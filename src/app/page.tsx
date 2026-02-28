'use client';

import { useEffect, useState, useCallback } from 'react';
import { PatientList } from '@/components/dashboard/patient-list';
import { AlertFeed } from '@/components/dashboard/alert-feed';
import { SimulationPanel } from '@/components/dashboard/simulation-panel';
import { useSimulation } from '@/hooks/use-simulation';
import type { Alert } from '@/lib/types';

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { currentHour } = useSimulation();

  const fetchData = useCallback(async () => {
    const [patientsRes, alertsRes] = await Promise.all([
      fetch('/api/patients'),
      fetch('/api/alerts'),
    ]);
    setPatients(await patientsRes.json());
    setAlerts(await alertsRes.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentHour]);

  return (
    <div className="space-y-6">
      <SimulationPanel onStepComplete={fetchData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PatientList patients={patients} />
        </div>
        <div>
          <AlertFeed alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
