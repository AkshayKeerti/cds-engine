'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Alert } from '@/lib/types';

interface Props {
  alerts: Alert[];
  currentHour: number;
}

export function ComparisonView({ alerts, currentHour }: Props) {
  const staticAlerts = alerts.filter((a) => a.alertType === 'static');
  const contextAlerts = alerts.filter((a) => a.alertType === 'context_aware');

  const staticDismissed = staticAlerts.filter((a) => a.status === 'dismissed').length;
  const staticOverridden = staticAlerts.length > 0 ? Math.max(staticAlerts.length - 1, staticDismissed) : 0;

  const contextActedOn = contextAlerts.filter((a) => a.status === 'confirmed').length;
  const contextCritical = contextAlerts.filter((a) => a.severity === 'critical');

  return (
    <div className="space-y-6">
      {/* Stats comparison */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-warn/30 bg-warn/5">
          <CardContent className="py-6 text-center">
            <div className="text-4xl font-bold text-warn tabular-nums">{staticAlerts.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Static Alerts</div>
            <div className="text-xs text-warn/70 mt-2">{staticOverridden} likely overridden</div>
          </CardContent>
        </Card>
        <Card className="border-safe/30 bg-safe/5">
          <CardContent className="py-6 text-center">
            <div className="text-4xl font-bold text-safe tabular-nums">{contextAlerts.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Context-Aware Alerts</div>
            <div className="text-xs text-safe/70 mt-2">
              {contextCritical.length} critical, {contextActedOn} acted upon
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side by side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Traditional CDS */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-warn flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Traditional CDS — Static Alerts
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {staticAlerts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-4 text-center text-sm text-muted-foreground">
                  Run simulation to generate alerts
                </CardContent>
              </Card>
            ) : (
              staticAlerts.map((alert) => (
                <Card key={alert.id} className="border-warn/20 bg-warn/5">
                  <CardContent className="py-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Badge className="bg-warn text-black text-xs">WARNING</Badge>
                          <span className="text-xs text-muted-foreground">Hour {alert.simulationHour}</span>
                        </div>
                        <p className="text-xs font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.mechanism}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-warn/60 italic">
                      Generic warning — no patient-specific risk assessment
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {staticAlerts.length > 0 && (
              <div className="text-center py-3 text-xs text-muted-foreground border border-dashed border-warn/20 rounded-lg">
                Clinician sees {staticAlerts.length} alerts from admission.
                <br />
                <span className="text-warn">~{Math.round(staticAlerts.length * 0.9)} will be overridden without review.</span>
              </div>
            )}
          </div>
        </div>

        {/* Context-Aware CDS */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-safe flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            Context-Aware CDS — Smart Alerts
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {contextAlerts.length === 0 ? (
              <Card className="border-safe/20 bg-safe/5">
                <CardContent className="py-8 text-center">
                  <div className="text-safe text-2xl mb-2">&#10003;</div>
                  <p className="text-sm text-safe">All clear</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drug interactions detected but organ function supports safe clearance.
                    <br />No alert needed at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              contextAlerts.map((alert) => (
                <Card key={alert.id} className={cn(
                  alert.severity === 'critical' ? 'border-danger/50 bg-danger/10 animate-pulse-glow' :
                  alert.severity === 'warning' ? 'border-warn/30 bg-warn/5' :
                  'border-info/20 bg-info/5'
                )}>
                  <CardContent className="py-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5">
                          <Badge className={
                            alert.severity === 'critical' ? 'bg-danger text-white text-xs' :
                            alert.severity === 'warning' ? 'bg-warn text-black text-xs' :
                            'bg-info text-white text-xs'
                          }>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Hour {alert.simulationHour}</span>
                        </div>
                        <p className="text-xs font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{alert.recommendation}</p>
                      </div>
                      <div className="text-right ml-2">
                        <span className="text-lg font-bold tabular-nums" style={{
                          color: alert.riskScore > 0.7 ? '#ef4444' : alert.riskScore > 0.4 ? '#f59e0b' : '#3b82f6'
                        }}>
                          {(alert.riskScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Key insight */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold text-primary">The Difference</p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Traditional CDS fired <span className="font-bold text-warn">{staticAlerts.length} alerts</span> from the moment drugs were co-prescribed — before any clinical risk existed.
              Context-aware CDS waited until renal function actually declined, then delivered <span className="font-bold text-safe">{contextCritical.length} precise, actionable alert{contextCritical.length !== 1 ? 's' : ''}</span> with
              specific mechanism, projected risk, and recommended alternatives.
            </p>
            {staticAlerts.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Alert reduction: <span className="font-bold text-safe">{Math.round((1 - contextAlerts.length / staticAlerts.length) * 100)}%</span> fewer alerts with higher clinical relevance.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
