'use client';

import { useEffect, useState, useCallback } from 'react';
import { PatientList } from '@/components/dashboard/patient-list';
import { AlertFeed } from '@/components/dashboard/alert-feed';
import { SimulationPanel } from '@/components/dashboard/simulation-panel';
import { useSimulation } from '@/hooks/use-simulation';
import type { Alert } from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface PatientWithAlerts {
  activeContextAlerts?: Alert[];
  [key: string]: unknown;
}

export default function DashboardPage() {
  const [patients, setPatients] = useState<PatientWithAlerts[]>([]);
  const { currentHour } = useSimulation();

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/patients');
    const data: PatientWithAlerts[] = await res.json();
    setPatients(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentHour]);

  // Derive alerts from patients data — single source of truth, no desync possible
  const allAlerts: Alert[] = patients.flatMap((p) => p.activeContextAlerts ?? []);

  return (
    <div className="space-y-5">
      <SimulationPanel onStepComplete={fetchData} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <PatientList patients={patients as any} />
        </div>
        <div className="lg:col-span-2">
          <AlertFeed alerts={allAlerts} />
        </div>
      </div>
    </div>
  );
}
