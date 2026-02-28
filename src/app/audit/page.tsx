'use client';

import { useEffect, useState, useCallback } from 'react';
import { SimulationPanel } from '@/components/dashboard/simulation-panel';
import { useSimulation } from '@/hooks/use-simulation';
import { cn } from '@/lib/utils';

interface AuditEntry {
  id: string;
  alertId?: string;
  patientId: string;
  action: string;
  actor: string;
  details: Record<string, unknown>;
  timestamp: string;
}

const actionConfig: Record<string, { label: string; color: string; bg: string }> = {
  alert_generated: { label: 'Generated', color: 'text-clinical-info', bg: 'bg-clinical-info-bg' },
  alert_dismissed: { label: 'Dismissed', color: 'text-muted-foreground', bg: 'bg-muted' },
  alert_confirmed: { label: 'Confirmed', color: 'text-clinical-safe', bg: 'bg-clinical-safe-bg' },
  alert_updated: { label: 'Updated', color: 'text-clinical-warn', bg: 'bg-clinical-warn-bg' },
};

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

  return (
    <div className="space-y-5">
      <SimulationPanel onStepComplete={fetchData} />

      <div>
        <h1 className="text-base font-bold text-foreground">Audit Trail</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Every alert, response, and system action</p>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Event Log</span>
          <span className="text-xs text-muted-foreground">{logs.length} events</span>
        </div>

        {logs.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No audit events yet. Run the simulation to generate alerts.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((log) => {
              const config = actionConfig[log.action] ?? { label: log.action, color: 'text-muted-foreground', bg: 'bg-muted' };
              return (
                <div key={log.id} className="flex items-start gap-3 px-4 py-2.5">
                  <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5', config.color, config.bg)}>
                    {config.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-foreground">{log.patientId}</span>
                      <span className="text-muted-foreground">by {log.actor}</span>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                        {Object.entries(log.details).map(([k, v]) => (
                          <span key={k} className="mr-3">{k}: {String(v)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground flex-shrink-0 vitals">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
