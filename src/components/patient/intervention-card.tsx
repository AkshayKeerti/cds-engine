'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Props {
  alertId: string;
  severity: string;
  drugPair: [string, string];
  riskScore: number;
  why: string;
  risk: string;
  what: string;
  onDismiss?: (id: string, feedback: string) => void;
  onConfirm?: (id: string, feedback: string) => void;
}

export function InterventionCard({ alertId, severity, drugPair, riskScore, why, risk, what, onDismiss, onConfirm }: Props) {
  const [feedback, setFeedback] = useState('');
  const [responded, setResponded] = useState(false);

  const isCritical = severity === 'critical';
  const borderClass = isCritical ? 'border-clinical-danger-border animate-clinical-pulse' : 'border-clinical-warn-border';
  const bgClass = isCritical ? 'bg-clinical-danger-bg' : 'bg-clinical-warn-bg';

  const handleAction = (action: 'dismiss' | 'confirm') => {
    if (action === 'dismiss') onDismiss?.(alertId, feedback);
    else onConfirm?.(alertId, feedback);
    setResponded(true);
  };

  if (responded) {
    return (
      <div className="border border-clinical-safe-border bg-clinical-safe-bg rounded-lg px-4 py-5 text-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" className="mx-auto mb-1">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <p className="text-sm font-medium text-clinical-safe">Response recorded</p>
      </div>
    );
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden', borderClass)}>
      {/* Header */}
      <div className={cn('px-4 py-2.5 flex items-center justify-between', bgClass)}>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
            isCritical ? 'bg-clinical-danger text-white' : 'bg-clinical-warn text-white'
          )}>
            {severity.toUpperCase()}
          </span>
          <span className="text-xs font-medium text-foreground">Intervention Required</span>
        </div>
        <span className={cn('text-lg font-bold vitals', isCritical ? 'text-clinical-danger' : 'text-clinical-warn')}>
          {(riskScore * 100).toFixed(0)}%
        </span>
      </div>

      <div className="bg-white px-4 py-3 space-y-3">
        <div className="text-xs text-muted-foreground">
          {drugPair[0]} + {drugPair[1]}
        </div>

        {/* WHY */}
        <Section color="#2563eb" label="WHY — Mechanism">
          {why}
        </Section>

        {/* RISK */}
        <Section color="#d97706" label="RISK — Projected Impact">
          {risk}
        </Section>

        {/* WHAT */}
        <Section color="#16a34a" label="ACTION — Recommendation">
          {what}
        </Section>

        {/* Feedback */}
        <div className="pt-2 border-t border-border space-y-2">
          <textarea
            className="w-full bg-muted border border-border rounded px-3 py-2 text-xs placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            rows={2}
            placeholder="Clinical notes (optional)..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleAction('confirm')}
              className="flex-1 h-8 text-xs bg-clinical-safe hover:bg-clinical-safe/90 text-white"
            >
              Confirm &amp; Act
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction('dismiss')}
              className="flex-1 h-8 text-xs"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ color, label, children }: { color: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed pl-2.5 whitespace-pre-line">{children}</p>
    </div>
  );
}
