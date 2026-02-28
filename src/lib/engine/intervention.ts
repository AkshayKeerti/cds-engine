import type { InterventionCard, RiskScore, DrugPair } from '@/lib/types';

export function generateInterventionCard(
  riskScore: RiskScore,
  drugPair: DrugPair,
  currentCreatinine: number,
  currentGfr: number | undefined
): InterventionCard {
  const gfrText = currentGfr !== undefined ? `GFR ${currentGfr} mL/min` : 'GFR unavailable';

  return {
    why: drugPair.mechanism,
    risk: `${drugPair.riskDescription}\n\nCurrent status: Creatinine ${currentCreatinine} mg/dL, ${gfrText}. ` +
      `Organ function at ${(riskScore.organFunctionScore * 100).toFixed(0)}% capacity. ` +
      `Risk score: ${(riskScore.score * 100).toFixed(0)}% (trend factor: ${riskScore.trendFactor.toFixed(1)}x).`,
    what: drugPair.recommendation + (drugPair.alternativeDrug
      ? `\n\nSuggested alternative: ${drugPair.alternativeDrug}`
      : ''),
    severity: riskScore.severity,
    drugPair: [drugPair.drugA, drugPair.drugB],
    riskScore: riskScore.score,
  };
}
