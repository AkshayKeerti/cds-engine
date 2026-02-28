'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const borderColor = severity === 'critical' ? 'border-danger/50' : severity === 'warning' ? 'border-warn/30' : 'border-info/20';

  const handleAction = (action: 'dismiss' | 'confirm') => {
    if (action === 'dismiss') onDismiss?.(alertId, feedback);
    else onConfirm?.(alertId, feedback);
    setResponded(true);
  };

  if (responded) {
    return (
      <Card className="border-safe/30 bg-safe/5">
        <CardContent className="py-6 text-center">
          <div className="text-safe text-xl mb-1">&#10003;</div>
          <p className="text-sm text-safe">Response recorded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(borderColor, severity === 'critical' && 'animate-pulse-glow')}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Badge className={severity === 'critical' ? 'bg-danger text-white' : severity === 'warning' ? 'bg-warn text-black' : 'bg-info text-white'}>
              {severity.toUpperCase()}
            </Badge>
            Intervention Required
          </CardTitle>
          <span className="text-lg font-bold tabular-nums" style={{ color: riskScore > 0.7 ? '#ef4444' : '#f59e0b' }}>
            {(riskScore * 100).toFixed(0)}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{drugPair[0]} + {drugPair[1]}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* WHY */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-info" />
            <span className="text-xs font-semibold uppercase tracking-wider text-info">Why</span>
          </div>
          <p className="text-sm text-muted-foreground pl-3">{why}</p>
        </div>

        {/* RISK */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-warn" />
            <span className="text-xs font-semibold uppercase tracking-wider text-warn">Risk</span>
          </div>
          <p className="text-sm text-muted-foreground pl-3 whitespace-pre-line">{risk}</p>
        </div>

        {/* WHAT */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-safe" />
            <span className="text-xs font-semibold uppercase tracking-wider text-safe">Recommended Action</span>
          </div>
          <p className="text-sm text-muted-foreground pl-3 whitespace-pre-line">{what}</p>
        </div>

        {/* Feedback & Actions */}
        <div className="border-t border-border pt-3 space-y-2">
          <textarea
            className="w-full bg-secondary/50 border border-border rounded-md p-2 text-sm placeholder:text-muted-foreground resize-none"
            rows={2}
            placeholder="Optional: clinical notes or feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-safe hover:bg-safe/80 text-white flex-1"
              onClick={() => handleAction('confirm')}
            >
              Confirm & Act
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => handleAction('dismiss')}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
