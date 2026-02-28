'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PatientSummary {
  id: string;
  name: string;
  age: number;
  sex: string;
  unit: string;
  status: string;
  comorbidities: string[];
  latestCreatinine?: number;
  latestGfr?: number;
  contextAwareAlertCount: number;
  staticAlertCount: number;
  criticalAlertCount: number;
  highestSeverity: string;
}

export function PatientList({ patients }: { patients: PatientSummary[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        ICU Patients
      </h2>
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
}

function PatientCard({ patient }: { patient: PatientSummary }) {
  const severityColor = {
    critical: 'border-danger/50 bg-danger/5',
    warning: 'border-warn/30 bg-warn/5',
    informational: 'border-info/20',
    silent: 'border-border',
  }[patient.highestSeverity] || 'border-border';

  return (
    <Link href={`/patient/${patient.id}`}>
      <Card className={cn('hover:bg-accent/50 transition-colors cursor-pointer', severityColor, patient.criticalAlertCount > 0 && 'animate-pulse-glow')}>
        <CardContent className="py-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{patient.name}</span>
                <span className="text-sm text-muted-foreground">
                  {patient.age}{patient.sex === 'M' ? 'M' : 'F'} | {patient.unit}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {patient.comorbidities.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              {/* Lab values */}
              <div className="space-y-0.5">
                {patient.latestCreatinine !== undefined && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Cr: </span>
                    <span className={cn('font-mono font-medium', patient.latestCreatinine > 2 ? 'text-danger' : patient.latestCreatinine > 1.5 ? 'text-warn' : 'text-safe')}>
                      {patient.latestCreatinine.toFixed(1)}
                    </span>
                  </div>
                )}
                {patient.latestGfr !== undefined && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">GFR: </span>
                    <span className={cn('font-mono font-medium', patient.latestGfr < 30 ? 'text-danger' : patient.latestGfr < 60 ? 'text-warn' : 'text-safe')}>
                      {patient.latestGfr}
                    </span>
                  </div>
                )}
              </div>

              {/* Alert badges */}
              <div className="flex flex-col gap-1 items-end">
                {patient.criticalAlertCount > 0 && (
                  <Badge className="bg-danger text-white text-xs">
                    {patient.criticalAlertCount} Critical
                  </Badge>
                )}
                {patient.contextAwareAlertCount > 0 && patient.criticalAlertCount === 0 && (
                  <Badge className="bg-warn text-black text-xs">
                    {patient.contextAwareAlertCount} Alert{patient.contextAwareAlertCount > 1 ? 's' : ''}
                  </Badge>
                )}
                {patient.contextAwareAlertCount === 0 && (
                  <Badge variant="secondary" className="text-xs text-safe">
                    No alerts
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
