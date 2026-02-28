'use client';

import { cn } from '@/lib/utils';
import type { Alert } from '@/lib/types';

export function AlertFeed({ alerts }: { alerts: Alert[] }) {
  const contextAlerts = alerts.filter((a) => a.alertType === 'context_aware' && a.status === 'active');

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-sm font-semibold text-foreground">Active Alerts</h2>
        {contextAlerts.length > 0 && (
          <span className="text-xs font-medium text-clinical-danger bg-clinical-danger-bg px-2 py-0.5 rounded-full border border-clinical-danger-border">
            {contextAlerts.length}
          </span>
        )}
      </div>

      {contextAlerts.length === 0 ? (
        <div className="bg-white border border-border rounded-lg px-4 py-8 text-center">
          <div className="w-8 h-8 rounded-full bg-clinical-safe-bg border border-clinical-safe-border flex items-center justify-center mx-auto mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">All clear</p>
          <p className="text-xs text-muted-foreground mt-0.5">No active drug interaction alerts</p>
        </div>
      ) : (
        <div className="space-y-2">
          {contextAlerts.map((alert, i) => (
            <div
              key={alert.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <AlertCard alert={alert} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert }: { alert: Alert }) {
  const config = {
    critical: {
      bg: 'bg-clinical-danger-bg',
      border: 'border-clinical-danger-border',
      text: 'text-clinical-danger',
      label: 'CRITICAL',
      dot: 'bg-clinical-danger',
      pulse: 'animate-clinical-pulse',
    },
    warning: {
      bg: 'bg-clinical-warn-bg',
      border: 'border-clinical-warn-border',
      text: 'text-clinical-warn',
      label: 'WARNING',
      dot: 'bg-clinical-warn',
      pulse: '',
    },
    informational: {
      bg: 'bg-clinical-info-bg',
      border: 'border-clinical-info-border',
      text: 'text-clinical-info',
      label: 'INFO',
      dot: 'bg-clinical-info',
      pulse: '',
    },
    silent: {
      bg: 'bg-muted',
      border: 'border-border',
      text: 'text-muted-foreground',
      label: '',
      dot: 'bg-muted-foreground',
      pulse: '',
    },
  }[alert.severity] || { bg: 'bg-muted', border: 'border-border', text: 'text-muted-foreground', label: '', dot: 'bg-muted-foreground', pulse: '' };

  return (
    <div className={cn('border rounded-lg px-3.5 py-3', config.bg, config.border, config.pulse)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn('text-[10px] font-bold uppercase tracking-wider', config.text)}>
              {config.label}
            </span>
            <span className="text-[10px] text-muted-foreground">H{alert.simulationHour}</span>
          </div>
          <p className="text-[13px] font-medium text-foreground leading-snug">{alert.title}</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {alert.mechanism.substring(0, 140)}...
          </p>
        </div>
        <div className="text-right flex-shrink-0 pt-1">
          <div className={cn('text-xl font-bold vitals', config.text)}>
            {(alert.riskScore * 100).toFixed(0)}
          </div>
          <div className="text-[10px] text-muted-foreground -mt-0.5">risk %</div>
        </div>
      </div>
    </div>
  );
}
