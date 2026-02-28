import type { Alert, Medication, LabResult, HandoverSummary, LabType, TrendDirection } from '@/lib/types';
import { computeTrend } from './trend-analyzer';

export function generateHandoverSummary(
  patientId: string,
  alerts: Alert[],
  medications: Medication[],
  labs: LabResult[]
): HandoverSummary {
  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const activeMeds = medications.filter((m) => m.status === 'active');

  // Compute lab trends
  const labTypes: LabType[] = ['creatinine', 'bun', 'gfr', 'potassium', 'ast', 'alt'];
  const labTrends: HandoverSummary['labTrends'] = [];

  for (const lt of labTypes) {
    const labsForType = labs
      .filter((l) => l.labType === lt)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (labsForType.length > 0) {
      const direction = computeTrend(labsForType) as TrendDirection;
      labTrends.push({
        labType: lt,
        direction,
        latestValue: labsForType[0].value,
        unit: labsForType[0].unit,
      });
    }
  }

  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;
  const warningCount = activeAlerts.filter((a) => a.severity === 'warning').length;

  let riskSummary = '';
  if (criticalCount > 0) {
    riskSummary = `CRITICAL: ${criticalCount} critical alert(s) active. Immediate attention required.`;
  } else if (warningCount > 0) {
    riskSummary = `WARNING: ${warningCount} warning alert(s). Close monitoring recommended.`;
  } else {
    riskSummary = 'No active alerts. Continue current monitoring protocol.';
  }

  const recommendations = activeAlerts
    .filter((a) => a.severity === 'critical' || a.severity === 'warning')
    .map((a) => a.recommendation);

  return {
    patientId,
    generatedAt: new Date().toISOString(),
    period: 'Current shift',
    activeAlerts,
    labTrends,
    activeMedications: activeMeds,
    riskSummary,
    recommendations: [...new Set(recommendations)],
  };
}
