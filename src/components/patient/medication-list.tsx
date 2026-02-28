'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Medication } from '@/lib/types';

export function MedicationList({ medications }: { medications: Medication[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {medications.filter((m) => m.status === 'active').map((med) => (
            <div key={med.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
              <div>
                <span className="text-sm font-medium">{med.drugName}</span>
                <span className="text-xs text-muted-foreground ml-2">{med.dose} {med.route}</span>
              </div>
              <Badge variant="secondary" className="text-xs">{med.frequency}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
