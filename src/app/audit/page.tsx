'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SimulationPanel } from '@/components/dashboard/simulation-panel';
import { useSimulation } from '@/hooks/use-simulation';

interface AuditEntry {
  id: string;
  alertId?: string;
  patientId: string;
  action: string;
  actor: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const { currentHour } = useSimulation();

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/audit');
    setLogs(await res.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentHour]);

  const actionLabels: Record<string, { label: string; color: string }> = {
    alert_generated: { label: 'Alert Generated', color: 'bg-info text-white' },
    alert_dismissed: { label: 'Alert Dismissed', color: 'bg-muted text-muted-foreground' },
    alert_confirmed: { label: 'Alert Confirmed', color: 'bg-safe text-white' },
    alert_updated: { label: 'Alert Updated', color: 'bg-warn text-black' },
  };

  return (
    <div className="space-y-6">
      <SimulationPanel onStepComplete={fetchData} />

      <div>
        <h1 className="text-xl font-bold mb-1">Audit Trail</h1>
        <p className="text-sm text-muted-foreground">
          Complete log of every alert, clinician response, and system action
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Event Log</span>
            <Badge variant="secondary">{logs.length} events</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No audit events yet. Run the simulation to generate alerts and interactions.
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => {
                const actionInfo = actionLabels[log.action] ?? { label: log.action, color: 'bg-muted' };
                return (
                  <div key={log.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="flex-shrink-0 mt-0.5">
                      <Badge className={actionInfo.color + ' text-xs'}>
                        {actionInfo.label}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{log.patientId}</span>
                        <span className="text-muted-foreground">by {log.actor}</span>
                      </div>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                          {Object.entries(log.details).map(([k, v]) => (
                            <span key={k} className="mr-3">{k}: {String(v)}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
