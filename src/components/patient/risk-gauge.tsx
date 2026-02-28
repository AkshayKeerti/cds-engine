'use client';

import { cn } from '@/lib/utils';

interface Props {
  score: number;
  severity: string;
  drugPair: [string, string];
  details?: string;
}

export function RiskGauge({ score, severity, drugPair, details }: Props) {
  const percentage = Math.round(score * 100);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score * circumference);

  const color = severity === 'critical' ? '#dc2626'
    : severity === 'warning' ? '#d97706'
    : severity === 'informational' ? '#2563eb'
    : '#16a34a';

  const config = {
    critical: { bg: 'bg-clinical-danger-bg', border: 'border-clinical-danger-border', pulse: 'animate-clinical-pulse' },
    warning: { bg: 'bg-clinical-warn-bg', border: 'border-clinical-warn-border', pulse: '' },
    informational: { bg: 'bg-white', border: 'border-border', pulse: '' },
    silent: { bg: 'bg-white', border: 'border-border', pulse: '' },
  }[severity] || { bg: 'bg-white', border: 'border-border', pulse: '' };

  return (
    <div className={cn('border rounded-lg px-4 py-3 flex items-center gap-4', config.bg, config.border, config.pulse)}>
      {/* Circular gauge */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90">
          <circle cx="45" cy="45" r="40" fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle
            cx="45" cy="45" r="40"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold vitals" style={{ color }}>
            {percentage}
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Risk Score</div>
        <div className="text-[13px] font-semibold text-foreground mt-0.5">
          {drugPair[0]} + {drugPair[1]}
        </div>
        <div className="text-[11px] font-medium mt-0.5" style={{ color }}>
          {severity === 'silent' ? 'Within safe range' : severity.charAt(0).toUpperCase() + severity.slice(1)}
        </div>
      </div>
    </div>
  );
}
