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
    <div className="space-y-5">
      <SimulationPanel onStepComplete={fetchData} />

      <div>
        <h1 className="text-base font-bold text-foreground">Static vs Context-Aware Alerts</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          How context-aware alerts reduce noise while catching real danger
        </p>
      </div>

      <ComparisonView alerts={alerts} currentHour={currentHour} />
    </div>
  );
}
