import type { DrugPair, LabResult, RiskScore, AlertSeverity } from '@/lib/types';
import { computeTrendFactor } from './trend-analyzer';

export function computeOrganFunctionScore(
  currentCreatinine: number,
  baselineCreatinine: number,
  currentGfr?: number
): number {
  // Score 0-1 where 1.0 = normal, 0.0 = severe impairment
  const creatinineRatio = currentCreatinine / baselineCreatinine;

  // GFR-based scoring
  let gfrScore = 1.0;
  if (currentGfr !== undefined) {
    if (currentGfr >= 90) gfrScore = 1.0;
    else if (currentGfr >= 60) gfrScore = 0.7 + (currentGfr - 60) * 0.01;
    else if (currentGfr >= 30) gfrScore = 0.3 + (currentGfr - 30) * (0.4 / 30);
    else if (currentGfr >= 15) gfrScore = 0.1 + (currentGfr - 15) * (0.2 / 15);
    else gfrScore = 0.05;
  }

  // Creatinine ratio scoring
  let crScore = 1.0;
  if (creatinineRatio <= 1.0) crScore = 1.0;
  else if (creatinineRatio <= 1.5) crScore = 1.0 - (creatinineRatio - 1.0) * 0.6;
  else if (creatinineRatio <= 2.0) crScore = 0.7 - (creatinineRatio - 1.5) * 0.6;
  else if (creatinineRatio <= 3.0) crScore = 0.4 - (creatinineRatio - 2.0) * 0.3;
  else crScore = 0.1;

  // Take the lower of the two scores (more conservative)
  return Math.max(0.05, Math.min(1.0, Math.min(gfrScore, crScore)));
}

export function computeRiskScore(
  drugPair: DrugPair,
  currentCreatinine: number,
  baselineCreatinine: number,
  currentGfr: number | undefined,
  creatinineLabs: { value: number; timestamp: string }[]
): RiskScore {
  const organFunctionScore = computeOrganFunctionScore(
    currentCreatinine,
    baselineCreatinine,
    currentGfr
  );

  const trendFactor = computeTrendFactor(creatinineLabs);
  const toxicityMultiplier = drugPair.toxicityMultiplier;

  // riskScore = (1 - organFunctionScore) × toxicityMultiplier × trendFactor
  // Normalized to 0-1 range
  const rawScore = (1 - organFunctionScore) * toxicityMultiplier * trendFactor;
  const score = Math.min(1.0, Math.max(0, rawScore / 3.6)); // Normalize to 0-1 range

  const severity = classifyRiskSeverity(score, trendFactor);

  const details = `Organ function: ${(organFunctionScore * 100).toFixed(0)}% | ` +
    `Toxicity multiplier: ${toxicityMultiplier.toFixed(1)}x | ` +
    `Trend factor: ${trendFactor.toFixed(2)}x | ` +
    `Cr: ${currentCreatinine} (baseline ${baselineCreatinine}) | ` +
    `GFR: ${currentGfr ?? 'N/A'}`;

  return { score, severity, organFunctionScore, toxicityMultiplier, trendFactor, details };
}

export function classifyRiskSeverity(score: number, trendFactor: number = 1.0): AlertSeverity {
  if (score > 0.7) return 'critical';
  if (score > 0.5 && trendFactor > 1.3) return 'critical';
  if (score >= 0.4) return 'warning';
  if (score >= 0.2) return 'informational';
  return 'silent';
}

export function generateStaticAlerts(drugCodes: string[], drugPairs: DrugPair[]): {
  drugPair: DrugPair;
  title: string;
  severity: AlertSeverity;
}[] {
  const alerts: { drugPair: DrugPair; title: string; severity: AlertSeverity }[] = [];

  for (let i = 0; i < drugCodes.length; i++) {
    for (let j = i + 1; j < drugCodes.length; j++) {
      const pair = drugPairs.find(
        (p) =>
          (p.drugCodeA === drugCodes[i] && p.drugCodeB === drugCodes[j]) ||
          (p.drugCodeA === drugCodes[j] && p.drugCodeB === drugCodes[i])
      );
      if (pair) {
        alerts.push({
          drugPair: pair,
          title: `Drug Interaction: ${pair.drugA} + ${pair.drugB}`,
          severity: 'warning', // Static alerts are always "warning" — no context
        });
      }
    }
  }

  return alerts;
}
