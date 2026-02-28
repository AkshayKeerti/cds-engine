'use client';

import { cn } from '@/lib/utils';

interface Props {
  name: string;
  age: number;
  sex: string;
  weight: number;
  unit: string;
  status: string;
  comorbidities: string[];
  baselineCreatinine: number;
  baselineGfr: number;
}

export function PatientHeader({ name, age, sex, weight, unit, status, comorbidities, baselineCreatinine, baselineGfr }: Props) {
  return (
    <div className="bg-white border border-border rounded-lg px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-foreground">{name}</h1>
            <span className={cn(
              'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
              status === 'critical'
                ? 'text-clinical-danger bg-clinical-danger-bg border-clinical-danger-border'
                : 'text-muted-foreground bg-muted border-border'
            )}>
              {status}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span>{age}y {sex === 'M' ? 'Male' : 'Female'}</span>
            <span className="text-border">|</span>
            <span>{weight} kg</span>
            <span className="text-border">|</span>
            <span>{unit}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            {comorbidities.map((c) => (
              <span key={c} className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6 text-right">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Baseline Cr</div>
            <div className="text-base font-semibold vitals">{baselineCreatinine} <span className="text-xs font-normal text-muted-foreground">mg/dL</span></div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Baseline GFR</div>
            <div className="text-base font-semibold vitals">{baselineGfr} <span className="text-xs font-normal text-muted-foreground">mL/min</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
