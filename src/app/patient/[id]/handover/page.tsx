'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { HandoverSummary } from '@/lib/types';

export default function HandoverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [summary, setSummary] = useState<HandoverSummary | null>(null);

  useEffect(() => {
    fetch(`/api/handover?patientId=${id}`).then((r) => r.json()).then(setSummary);
  }, [id]);

  if (!summary) return <div className="text-center py-16 text-sm text-muted-foreground">Loading...</div>;

  const isCritical = summary.riskSummary.startsWith('CRITICAL');
  const isWarning = summary.riskSummary.startsWith('WARNING');

  return (
    <div className="max-w-2xl mx-auto space-y-5 py-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/patient/${id}`} className="hover:text-foreground transition-colors">Patient</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Handover</span>
      </div>

      <div>
        <h1 className="text-base font-bold text-foreground">Shift Handover Report</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Generated {new Date(summary.generatedAt).toLocaleString()} &middot; {summary.period}
        </p>
      </div>

      {/* Risk summary */}
      <div className={cn(
        'border rounded-lg px-4 py-3',
        isCritical ? 'bg-clinical-danger-bg border-clinical-danger-border' :
        isWarning ? 'bg-clinical-warn-bg border-clinical-warn-border' :
        'bg-clinical-safe-bg border-clinical-safe-border'
      )}>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Risk Summary</div>
        <p className="text-sm text-foreground">{summary.riskSummary}</p>
      </div>

      {/* Lab trends */}
      <div className="bg-white border border-border rounded-lg">
        <div className="px-4 py-2.5 border-b border-border">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Lab Trends</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border">
          {summary.labTrends.map((lt) => (
            <div key={lt.labType} className="bg-white px-3.5 py-2.5">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{lt.labType}</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-sm font-semibold vitals">{lt.latestValue}</span>
                <span className="text-[10px] text-muted-foreground">{lt.unit}</span>
                <span className={cn(
                  'text-xs font-medium ml-auto',
                  lt.direction === 'rising' ? 'text-clinical-danger' : lt.direction === 'falling' ? 'text-clinical-safe' : 'text-muted-foreground'
                )}>
                  {lt.direction === 'rising' ? '↑' : lt.direction === 'falling' ? '↓' : '→'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div className="bg-white border border-border rounded-lg">
        <div className="px-4 py-2.5 border-b border-border">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Active Medications ({summary.activeMedications.length})
          </span>
        </div>
        <div className="divide-y divide-border">
          {summary.activeMedications.map((med) => (
            <div key={med.id} className="flex items-center justify-between px-4 py-2 text-xs">
              <span className="text-foreground">{med.drugName} {med.dose} {med.route}</span>
              <span className="text-muted-foreground">{med.frequency}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {summary.recommendations.length > 0 && (
        <div className="bg-clinical-warn-bg border border-clinical-warn-border rounded-lg">
          <div className="px-4 py-2.5 border-b border-clinical-warn-border">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Recommendations</span>
          </div>
          <div className="px-4 py-3 space-y-2">
            {summary.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                <span className="text-clinical-warn flex-shrink-0 font-bold">{i + 1}.</span>
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active alerts */}
      {summary.activeAlerts.length > 0 && (
        <div className="bg-white border border-border rounded-lg">
          <div className="px-4 py-2.5 border-b border-border">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Active Alerts ({summary.activeAlerts.length})
            </span>
          </div>
          <div className="divide-y divide-border">
            {summary.activeAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-2 px-4 py-2 text-xs">
                <span className={cn(
                  'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
                  alert.severity === 'critical' ? 'text-clinical-danger bg-clinical-danger-bg' :
                  alert.severity === 'warning' ? 'text-clinical-warn bg-clinical-warn-bg' :
                  'text-clinical-info bg-clinical-info-bg'
                )}>
                  {alert.severity}
                </span>
                <span className="flex-1 text-foreground">{alert.title}</span>
                <span className="text-muted-foreground vitals">{(alert.riskScore * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
