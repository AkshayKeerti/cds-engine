'use client';

import { useEffect, useState, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { HandoverSummary } from '@/lib/types';

export default function HandoverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [summary, setSummary] = useState<HandoverSummary | null>(null);

  useEffect(() => {
    fetch(`/api/handover?patientId=${id}`).then((r) => r.json()).then(setSummary);
  }, [id]);

  if (!summary) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/patient/${id}`} className="hover:text-foreground transition-colors">Patient</Link>
        <span>/</span>
        <span className="text-foreground">Shift Handover</span>
      </div>

      <div>
        <h1 className="text-xl font-bold mb-1">Shift Handover Report</h1>
        <p className="text-sm text-muted-foreground">
          Generated {new Date(summary.generatedAt).toLocaleString()} | {summary.period}
        </p>
      </div>

      {/* Risk Summary */}
      <Card className={summary.riskSummary.startsWith('CRITICAL') ? 'border-danger/50' : summary.riskSummary.startsWith('WARNING') ? 'border-warn/30' : 'border-safe/20'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Risk Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{summary.riskSummary}</p>
        </CardContent>
      </Card>

      {/* Lab Trends */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Lab Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {summary.labTrends.map((lt) => (
              <div key={lt.labType} className="flex items-center justify-between p-2 rounded-md bg-secondary/30">
                <div>
                  <span className="text-xs text-muted-foreground uppercase">{lt.labType}</span>
                  <div className="text-sm font-mono font-medium">{lt.latestValue} {lt.unit}</div>
                </div>
                <Badge variant="secondary" className={
                  lt.direction === 'rising' ? 'text-danger' : lt.direction === 'falling' ? 'text-safe' : ''
                }>
                  {lt.direction === 'rising' ? '↑' : lt.direction === 'falling' ? '↓' : '→'} {lt.direction}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Medications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Medications ({summary.activeMedications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {summary.activeMedications.map((med) => (
              <div key={med.id} className="flex items-center justify-between py-1 text-sm">
                <span>{med.drugName} {med.dose} {med.route}</span>
                <span className="text-muted-foreground">{med.frequency}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {summary.recommendations.length > 0 && (
        <Card className="border-warn/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {summary.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-warn flex-shrink-0">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      {summary.activeAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts ({summary.activeAlerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-2 py-1 text-sm">
                  <Badge className={
                    alert.severity === 'critical' ? 'bg-danger text-white' :
                    alert.severity === 'warning' ? 'bg-warn text-black' :
                    'bg-info text-white'
                  }>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="flex-1">{alert.title}</span>
                  <span className="text-muted-foreground font-mono text-xs">
                    {(alert.riskScore * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
