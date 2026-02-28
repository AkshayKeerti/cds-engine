import { NextResponse } from 'next/server';
import { store } from '@/lib/db';

export async function GET() {
  const patients = store.getPatients();

  const enriched = patients.map((patient) => {
    const labs = store.getLabResults(patient.id);
    const alerts = store.getAlerts({ patientId: patient.id });

    const latestCr = labs
      .filter((l) => l.labType === 'creatinine')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    const latestGfr = labs
      .filter((l) => l.labType === 'gfr')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    const activeAlerts = alerts.filter((a) => a.status === 'active');
    const contextAlerts = activeAlerts.filter((a) => a.alertType === 'context_aware');
    const staticAlerts = activeAlerts.filter((a) => a.alertType === 'static');

    return {
      ...patient,
      comorbidities: JSON.parse(patient.comorbidities),
      latestCreatinine: latestCr?.value,
      latestGfr: latestGfr?.value,
      contextAwareAlertCount: contextAlerts.length,
      staticAlertCount: staticAlerts.length,
      criticalAlertCount: activeAlerts.filter((a) => a.severity === 'critical').length,
      highestSeverity: activeAlerts.reduce((max, a) => {
        const order = { critical: 3, warning: 2, informational: 1, silent: 0 };
        const aOrder = order[a.severity as keyof typeof order] ?? 0;
        const maxOrder = order[max as keyof typeof order] ?? 0;
        return aOrder > maxOrder ? a.severity : max;
      }, 'silent' as string),
    };
  });

  return NextResponse.json(enriched);
}
