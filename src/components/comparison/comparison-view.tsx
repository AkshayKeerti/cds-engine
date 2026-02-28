'use client';

import { cn } from '@/lib/utils';
import type { Alert } from '@/lib/types';

interface Props {
  alerts: Alert[];
  currentHour: number;
}

export function ComparisonView({ alerts, currentHour }: Props) {
  const staticAlerts = alerts.filter((a) => a.alertType === 'static');
  const contextAlerts = alerts.filter((a) => a.alertType === 'context_aware' && a.status === 'active');

  const staticOverridden = staticAlerts.length > 0 ? Math.max(staticAlerts.length - 1, 0) : 0;
  const contextCritical = contextAlerts.filter((a) => a.severity === 'critical');
  const contextActedOn = contextAlerts.filter((a) => a.status === 'confirmed').length;

  return (
    <div className="space-y-5">
      {/* Headline stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-clinical-warn-bg border border-clinical-warn-border rounded-lg p-5 text-center">
          <div className="text-4xl font-bold vitals text-clinical-warn">{staticAlerts.length}</div>
          <div className="text-sm text-foreground font-medium mt-1">Static Alerts</div>
          <div className="text-xs text-muted-foreground mt-1">~{staticOverridden} would be overridden</div>
        </div>
        <div className="bg-clinical-safe-bg border border-clinical-safe-border rounded-lg p-5 text-center">
          <div className="text-4xl font-bold vitals text-clinical-safe">{contextAlerts.length}</div>
          <div className="text-sm text-foreground font-medium mt-1">Context-Aware Alerts</div>
          <div className="text-xs text-muted-foreground mt-1">
            {contextCritical.length} critical &middot; {contextActedOn} acted upon
          </div>
        </div>
      </div>

      {/* Side by side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Traditional */}
        <div>
          <div className="flex items-center gap-2 px-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-clinical-warn" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Traditional CDS</h3>
          </div>

          <div className="bg-white border border-border rounded-lg overflow-hidden">
            {staticAlerts.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Run simulation to generate alerts
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
                {staticAlerts.map((alert) => (
                  <div key={alert.id} className="px-3.5 py-2.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-clinical-warn uppercase tracking-wider">WARNING</span>
                      <span className="text-[10px] text-muted-foreground">H{alert.simulationHour}</span>
                    </div>
                    <p className="text-xs font-medium text-foreground">{alert.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{alert.mechanism}</p>
                    <p className="text-[10px] text-clinical-warn/60 italic mt-1">No patient-specific risk assessment</p>
                  </div>
                ))}
              </div>
            )}
            {staticAlerts.length > 0 && (
              <div className="px-3.5 py-3 bg-clinical-warn-bg border-t border-clinical-warn-border text-center">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-clinical-warn">{staticAlerts.length} alerts</span> from admission &mdash; clinician overrides ~{Math.round(staticAlerts.length * 0.9)} without reading
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Context-Aware */}
        <div>
          <div className="flex items-center gap-2 px-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-clinical-safe" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Context-Aware CDS</h3>
          </div>

          <div className="bg-white border border-border rounded-lg overflow-hidden">
            {contextAlerts.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-clinical-safe-bg border border-clinical-safe-border flex items-center justify-center mx-auto mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground">All clear</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Drug interactions detected but organ function supports safe clearance.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
                {contextAlerts.map((alert) => {
                  const configs: Record<string, { bg: string; text: string; border: string }> = {
                    critical: { bg: 'bg-clinical-danger-bg', text: 'text-clinical-danger', border: 'border-l-clinical-danger' },
                    warning: { bg: '', text: 'text-clinical-warn', border: 'border-l-clinical-warn' },
                    informational: { bg: '', text: 'text-clinical-info', border: 'border-l-clinical-info' },
                  };
                  const config = configs[alert.severity] || { bg: '', text: 'text-muted-foreground', border: '' };

                  return (
                    <div key={alert.id} className={cn('px-3.5 py-2.5 border-l-2', config.border, config.bg)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={cn('text-[10px] font-bold uppercase tracking-wider', config.text)}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-muted-foreground">H{alert.simulationHour}</span>
                        </div>
                        <span className={cn('text-base font-bold vitals', config.text)}>
                          {(alert.riskScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-xs font-medium text-foreground">{alert.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{alert.recommendation}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="bg-white border border-primary/20 rounded-lg px-5 py-4 text-center">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">The Difference</p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Traditional CDS fired <span className="font-semibold text-clinical-warn">{staticAlerts.length} alerts</span> from admission &mdash; before any clinical risk existed.
          Context-aware CDS delivered <span className="font-semibold text-clinical-safe">{contextCritical.length} precise alert{contextCritical.length !== 1 ? 's' : ''}</span> only when organ function declined enough to endanger the patient.
        </p>
        {staticAlerts.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Alert reduction: <span className="font-bold text-clinical-safe">{Math.round((1 - contextAlerts.length / Math.max(staticAlerts.length, 1)) * 100)}%</span> fewer alerts
          </p>
        )}
      </div>
    </div>
  );
}
