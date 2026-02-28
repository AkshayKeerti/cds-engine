'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Alert } from '@/lib/types';

export function AlertFeed({ alerts }: { alerts: Alert[] }) {
  const contextAlerts = alerts.filter((a) => a.alertType === 'context_aware' && a.status === 'active');

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.268 21a2 2 0 0 0 3.464 0" />
          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        </svg>
        Context-Aware Alerts
        {contextAlerts.length > 0 && (
          <Badge className="bg-danger text-white">{contextAlerts.length}</Badge>
        )}
      </h2>

      {contextAlerts.length === 0 ? (
        <Card className="border-safe/20">
          <CardContent className="py-8 text-center text-muted-foreground">
            <div className="text-safe text-2xl mb-2">&#10003;</div>
            <p className="text-sm">No active alerts — all drug interactions within safe thresholds</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {contextAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert }: { alert: Alert }) {
  const severityStyles = {
    critical: 'border-danger/50 bg-danger/10',
    warning: 'border-warn/30 bg-warn/5',
    informational: 'border-info/20 bg-info/5',
    silent: '',
  };

  const severityBadge = {
    critical: 'bg-danger text-white',
    warning: 'bg-warn text-black',
    informational: 'bg-info text-white',
    silent: 'bg-muted',
  };

  return (
    <Card className={cn('animate-slide-in', severityStyles[alert.severity])}>
      <CardContent className="py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Badge className={severityBadge[alert.severity]}>
                {alert.severity.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Hour {alert.simulationHour}
              </span>
            </div>
            <p className="text-sm font-medium">{alert.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {alert.mechanism.substring(0, 120)}...
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tabular-nums" style={{ color: alert.riskScore > 0.7 ? '#ef4444' : alert.riskScore > 0.4 ? '#f59e0b' : '#3b82f6' }}>
              {(alert.riskScore * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">risk score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
