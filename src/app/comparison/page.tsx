'use client';

import { useEffect, useState, useCallback } from 'react';
import { ComparisonView } from '@/components/comparison/comparison-view';
import { SimulationPanel } from '@/components/dashboard/simulation-panel';
import { useSimulation } from '@/hooks/use-simulation';
import type { Alert } from '@/lib/types';

export default function ComparisonPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { currentHour } = useSimulation();

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/alerts');
    setAlerts(await res.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentHour]);

  return (
    <div className="space-y-6">
      <SimulationPanel onStepComplete={fetchData} />

      <div>
        <h1 className="text-xl font-bold mb-1">Static vs Context-Aware Alerts</h1>
        <p className="text-sm text-muted-foreground">
          Side-by-side comparison showing how context-aware alerts reduce noise while catching real danger
        </p>
      </div>

      <ComparisonView alerts={alerts} currentHour={currentHour} />
    </div>
  );
}
