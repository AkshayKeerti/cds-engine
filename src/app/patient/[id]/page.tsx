'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { PatientHeader } from '@/components/patient/patient-header';
import { MedicationList } from '@/components/patient/medication-list';
import { LabTrendChart } from '@/components/patient/lab-trend-chart';
import { RiskGauge } from '@/components/patient/risk-gauge';
import { InterventionCard } from '@/components/patient/intervention-card';
import { SimulationPanel } from '@/components/dashboard/simulation-panel';
import { useSimulation } from '@/hooks/use-simulation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface PatientData {
  id: string;
  name: string;
  age: number;
  sex: string;
  weight: number;
  unit: string;
  status: string;
  comorbidities: string[];
  baselineCreatinine: number;
  baselineGfr: number;
  medications: Array<{ id: string; drugName: string; drugCode: string; dose: string; route: string; frequency: string; status: string }>;
  labs: Array<{ labType: string; value: number; unit: string; timestamp: string }>;
  alerts: Array<{
    id: string;
    alertType: string;
    severity: string;
    title: string;
    mechanism: string;
    riskProjection: string;
    recommendation: string;
    drugPair: [string, string];
    riskScore: number;
    status: string;
    simulationHour: number;
  }>;
}

interface RiskData {
  interactions: Array<{
    riskScore: { score: number; severity: string; details: string };
    intervention: { why: string; risk: string; what: string };
    drugPair: { drugA: string; drugB: string };
  }>;
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const { currentHour } = useSimulation();

  const fetchData = useCallback(async () => {
    const [patientRes, riskRes] = await Promise.all([
      fetch(`/api/patients/${id}`),
      fetch(`/api/risk?patientId=${id}`),
    ]);
    setPatient(await patientRes.json());
    setRiskData(await riskRes.json());
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentHour]);

  const handleAlertAction = async (alertId: string, feedback: string, status: 'dismissed' | 'confirmed') => {
    await fetch(`/api/alerts/${alertId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, clinicianFeedback: feedback }),
    });
    fetchData();
  };

  if (!patient) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  const contextAlerts = patient.alerts.filter((a) => a.alertType === 'context_aware' && a.status === 'active');
  const staticAlertCount = patient.alerts.filter((a) => a.alertType === 'static').length;

  return (
    <div className="space-y-6">
      <SimulationPanel onStepComplete={fetchData} />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-foreground">{patient.name}</span>
      </div>

      <PatientHeader
        name={patient.name}
        age={patient.age}
        sex={patient.sex}
        weight={patient.weight}
        unit={patient.unit}
        status={patient.status}
        comorbidities={patient.comorbidities}
        baselineCreatinine={patient.baselineCreatinine}
        baselineGfr={patient.baselineGfr}
      />

      {/* Static alert noise indicator */}
      {staticAlertCount > 0 && (
        <Card className="border-warn/20 bg-warn/5">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-warn text-black">{staticAlertCount}</Badge>
              <span className="text-sm text-muted-foreground">
                static drug interaction alerts fired (traditional CDS)
              </span>
            </div>
            <span className="text-xs text-warn/60">These would cause alert fatigue</span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LabTrendChart labs={patient.labs} baselineCreatinine={patient.baselineCreatinine} />

          {/* Risk Gauges */}
          {riskData?.interactions && riskData.interactions.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold">Drug Interaction Risk</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {riskData.interactions.map((interaction, i) => (
                  <RiskGauge
                    key={i}
                    score={interaction.riskScore.score}
                    severity={interaction.riskScore.severity}
                    drugPair={[interaction.drugPair.drugA, interaction.drugPair.drugB]}
                    details={interaction.riskScore.details}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <MedicationList medications={patient.medications as any} />

          {/* Intervention Cards */}
          {contextAlerts.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-danger">Active Interventions</h2>
              {contextAlerts.map((alert) => {
                const matchingIntervention = riskData?.interactions.find(
                  (i) =>
                    (i.drugPair.drugA === alert.drugPair[0] && i.drugPair.drugB === alert.drugPair[1]) ||
                    (i.drugPair.drugA === alert.drugPair[1] && i.drugPair.drugB === alert.drugPair[0])
                );
                return (
                  <InterventionCard
                    key={alert.id}
                    alertId={alert.id}
                    severity={alert.severity}
                    drugPair={alert.drugPair}
                    riskScore={alert.riskScore}
                    why={alert.mechanism}
                    risk={matchingIntervention?.intervention.risk ?? alert.riskProjection}
                    what={alert.recommendation}
                    onDismiss={(id, fb) => handleAlertAction(id, fb, 'dismissed')}
                    onConfirm={(id, fb) => handleAlertAction(id, fb, 'confirmed')}
                  />
                );
              })}
            </div>
          ) : (
            <Card className="border-safe/20">
              <CardContent className="py-6 text-center">
                <div className="text-safe text-xl mb-1">&#10003;</div>
                <p className="text-sm text-safe font-medium">No interventions needed</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drug interactions detected but organ function supports safe clearance
                </p>
              </CardContent>
            </Card>
          )}

          <Link href={`/patient/${id}/handover`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer mt-3">
              <CardContent className="py-3 text-center text-sm text-muted-foreground">
                View Shift Handover Report
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
