'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Props {
  score: number;
  severity: string;
  drugPair: [string, string];
  details?: string;
}

export function RiskGauge({ score, severity, drugPair, details }: Props) {
  const percentage = Math.round(score * 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score * circumference);

  const color = severity === 'critical' ? '#ef4444'
    : severity === 'warning' ? '#f59e0b'
    : severity === 'informational' ? '#3b82f6'
    : '#22c55e';

  return (
    <Card className={cn(
      severity === 'critical' && 'border-danger/50 animate-pulse-glow',
      severity === 'warning' && 'border-warn/30',
    )}>
      <CardContent className="py-4 flex items-center gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.3s' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold tabular-nums" style={{ color }}>
              {percentage}%
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Risk Score
          </div>
          <div className="text-sm font-semibold">
            {drugPair[0]} + {drugPair[1]}
          </div>
          <div className="text-xs text-muted-foreground" style={{ color }}>
            {severity.toUpperCase()}
          </div>
          {details && (
            <p className="text-xs text-muted-foreground line-clamp-2">{details}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
