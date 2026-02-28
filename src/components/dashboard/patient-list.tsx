'use client';

import Link from 'next/link';
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
    <div className="space-y-1">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-sm font-semibold text-foreground">ICU Census</h2>
        <span className="text-xs text-muted-foreground">{patients.length} patients</span>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden divide-y divide-border">
        {patients.map((patient) => (
          <PatientRow key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}

function PatientRow({ patient }: { patient: PatientSummary }) {
  const hasCritical = patient.criticalAlertCount > 0;
  const hasWarning = patient.highestSeverity === 'warning';
  const hasInfo = patient.highestSeverity === 'informational';

  return (
    <Link href={`/patient/${patient.id}`}>
      <div className={cn(
        'flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer',
        hasCritical && 'bg-clinical-danger-bg animate-clinical-pulse border-l-2 border-l-clinical-danger',
        hasWarning && !hasCritical && 'border-l-2 border-l-clinical-warn',
        hasInfo && !hasCritical && !hasWarning && 'border-l-2 border-l-clinical-info',
        !hasCritical && !hasWarning && !hasInfo && 'border-l-2 border-l-transparent',
      )}>
        {/* Status indicator */}
        <div className={cn(
          'w-2 h-2 rounded-full flex-shrink-0',
          hasCritical ? 'bg-clinical-danger' :
          hasWarning ? 'bg-clinical-warn' :
          hasInfo ? 'bg-clinical-info' :
          'bg-clinical-safe'
        )} />

        {/* Patient info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{patient.name}</span>
            <span className="text-xs text-muted-foreground">
              {patient.age}{patient.sex} &middot; {patient.unit}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {patient.comorbidities.slice(0, 3).map((c) => (
              <span key={c} className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Vitals */}
        <div className="flex items-center gap-5 flex-shrink-0">
          {patient.latestCreatinine !== undefined && (
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Cr</div>
              <div className={cn(
                'text-sm font-semibold vitals',
                patient.latestCreatinine > 2 ? 'text-clinical-danger' :
                patient.latestCreatinine > 1.5 ? 'text-clinical-warn' :
                'text-foreground'
              )}>
                {patient.latestCreatinine.toFixed(1)}
              </div>
            </div>
          )}
          {patient.latestGfr !== undefined && (
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">GFR</div>
              <div className={cn(
                'text-sm font-semibold vitals',
                patient.latestGfr < 30 ? 'text-clinical-danger' :
                patient.latestGfr < 60 ? 'text-clinical-warn' :
                'text-foreground'
              )}>
                {patient.latestGfr}
              </div>
            </div>
          )}
        </div>

        {/* Alert status */}
        <div className="flex-shrink-0 w-20 text-right">
          {hasCritical ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-clinical-danger bg-clinical-danger-bg px-2 py-0.5 rounded-full border border-clinical-danger-border">
              {patient.criticalAlertCount} Critical
            </span>
          ) : patient.contextAwareAlertCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-clinical-warn bg-clinical-warn-bg px-2 py-0.5 rounded-full border border-clinical-warn-border">
              {patient.contextAwareAlertCount} Alert{patient.contextAwareAlertCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Clear</span>
          )}
        </div>

        {/* Chevron */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/50 flex-shrink-0">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  );
}
