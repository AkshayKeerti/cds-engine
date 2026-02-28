'use client';

import type { Medication } from '@/lib/types';

export function MedicationList({ medications }: { medications: Medication[] }) {
  const active = medications.filter((m) => m.status === 'active');

  return (
    <div className="bg-white border border-border rounded-lg">
      <div className="px-4 py-2.5 border-b border-border">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Active Medications
          <span className="text-muted-foreground font-normal ml-1">({active.length})</span>
        </h3>
      </div>
      <div className="divide-y divide-border">
        {active.map((med) => (
          <div key={med.id} className="flex items-center justify-between px-4 py-2">
            <div>
              <span className="text-[13px] font-medium text-foreground">{med.drugName}</span>
              <span className="text-xs text-muted-foreground ml-2">{med.dose} {med.route}</span>
            </div>
            <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{med.frequency}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
