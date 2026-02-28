import type { Alert, AlertSeverity, RiskScore, DrugPair } from '@/lib/types';
import { v4 as uuid } from 'uuid';

export function createContextAwareAlert(
  patientId: string,
  riskScore: RiskScore,
  drugPair: DrugPair,
  simulationHour: number
): Alert | null {
  if (riskScore.severity === 'silent') return null;

  const severityTitles: Record<AlertSeverity, string> = {
    critical: `CRITICAL: ${drugPair.drugA} + ${drugPair.drugB} — Renal Clearance Compromised`,
    warning: `WARNING: ${drugPair.drugA} + ${drugPair.drugB} — Declining Renal Function`,
    informational: `INFO: ${drugPair.drugA} + ${drugPair.drugB} — Monitor Renal Trend`,
    silent: '',
  };

  return {
    id: uuid(),
    patientId,
    alertType: 'context_aware',
    severity: riskScore.severity,
    title: severityTitles[riskScore.severity],
    mechanism: drugPair.mechanism,
    riskProjection: drugPair.riskDescription,
    recommendation: drugPair.recommendation,
    drugPair: [drugPair.drugA, drugPair.drugB],
    riskScore: riskScore.score,
    status: 'active',
    createdAt: new Date().toISOString(),
    simulationHour,
  };
}

export function createStaticAlert(
  patientId: string,
  drugPair: DrugPair,
  simulationHour: number
): Alert {
  return {
    id: uuid(),
    patientId,
    alertType: 'static',
    severity: 'warning',
    title: `Drug Interaction Alert: ${drugPair.drugA} + ${drugPair.drugB}`,
    mechanism: `${drugPair.drugA} and ${drugPair.drugB} have a known interaction. Use caution.`,
    riskProjection: 'Potential for adverse interaction. No patient-specific risk assessment available.',
    recommendation: 'Review medication list and consider alternatives if clinically appropriate.',
    drugPair: [drugPair.drugA, drugPair.drugB],
    riskScore: 0.5, // Static alerts have no real score
    status: 'active',
    createdAt: new Date().toISOString(),
    simulationHour,
  };
}

export function shouldEscalate(previousSeverity: AlertSeverity, newSeverity: AlertSeverity): boolean {
  const severityOrder: Record<AlertSeverity, number> = {
    silent: 0,
    informational: 1,
    warning: 2,
    critical: 3,
  };
  return severityOrder[newSeverity] > severityOrder[previousSeverity];
}
