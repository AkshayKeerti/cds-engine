'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="bg-card/50">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">{name}</h1>
              <Badge className={status === 'critical' ? 'bg-danger text-white' : 'bg-primary/20 text-primary'}>
                {status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{age} y/o {sex === 'M' ? 'Male' : 'Female'}</span>
              <span>{weight} kg</span>
              <span>{unit}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {comorbidities.map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
              ))}
            </div>
          </div>
          <div className="text-right space-y-1 text-sm">
            <div className="text-muted-foreground">
              Baseline Cr: <span className="font-mono text-foreground">{baselineCreatinine}</span> mg/dL
            </div>
            <div className="text-muted-foreground">
              Baseline GFR: <span className="font-mono text-foreground">{baselineGfr}</span> mL/min
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
