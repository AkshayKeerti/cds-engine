'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { PatientHeader } from '@/components/patient/patient-header';
import { MedicationList } from '@/components/patient/medication-list';
import { LabTrendChart } from '@/components/patient/lab-trend-chart';
import { RiskGauge } from '@/components/patient/risk-gauge';
import { InterventionCard } from '@/components/patient/intervention-card';
import { SimulationPanel } from '@/components/dashboard/simulation-panel';
import { useSimulation } from '@/hooks/use-simulation';
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

  if (!patient) {
    return <div className="text-center py-16 text-muted-foreground text-sm">Loading patient data...</div>;
  }

  const contextAlerts = patient.alerts.filter((a) => a.alertType === 'context_aware' && a.status === 'active');
  const staticAlertCount = patient.alerts.filter((a) => a.alertType === 'static').length;

  return (
    <div className="space-y-5">
      <SimulationPanel onStepComplete={fetchData} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{patient.name}</span>
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

      {/* Static alert noise banner */}
      {staticAlertCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-clinical-warn-bg border border-clinical-warn-border rounded-lg">
          <span className="text-xs font-bold text-clinical-warn vitals">{staticAlertCount}</span>
          <span className="text-xs text-muted-foreground">
            static alerts fired by traditional CDS — these would typically be overridden
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Charts & Risk */}
        <div className="lg:col-span-2 space-y-5">
          <LabTrendChart labs={patient.labs} baselineCreatinine={patient.baselineCreatinine} />

          {riskData?.interactions && riskData.interactions.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider px-1 mb-2">Drug Interaction Risk</h3>
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

        {/* Right: Meds & Interventions */}
        <div className="space-y-5">
          <MedicationList medications={patient.medications as any} />

          {contextAlerts.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold text-clinical-danger uppercase tracking-wider px-1 mb-2">Active Interventions</h3>
              <div className="space-y-3">
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
            </div>
          ) : (
            <div className="bg-white border border-clinical-safe-border rounded-lg px-4 py-6 text-center">
              <div className="w-8 h-8 rounded-full bg-clinical-safe-bg border border-clinical-safe-border flex items-center justify-center mx-auto mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">No interventions needed</p>
              <p className="text-xs text-muted-foreground mt-0.5">Organ function supports safe drug clearance</p>
            </div>
          )}

          <Link href={`/patient/${id}/handover`}>
            <div className="bg-white border border-border rounded-lg px-4 py-2.5 text-center text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer mt-3">
              View Shift Handover Report &rarr;
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
