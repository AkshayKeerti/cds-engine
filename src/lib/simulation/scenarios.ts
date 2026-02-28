import type { Scenario } from '@/lib/types';
import scenario1 from '../../../data/scenarios/vancomycin-gentamicin-aki.json';
import scenario2 from '../../../data/scenarios/metformin-contrast-renal.json';
import scenario3 from '../../../data/scenarios/nsaid-ace-inhibitor-renal.json';

const scenarios: Scenario[] = [scenario1, scenario2, scenario3] as Scenario[];

export function getScenario(patientId: string): Scenario | undefined {
  return scenarios.find((s) => s.patientId === patientId);
}

export function getAllScenarios(): Scenario[] {
  return scenarios;
}

export function getScenarioStep(patientId: string, hour: number) {
  const scenario = getScenario(patientId);
  if (!scenario) return undefined;

  // Find the step at or just before the given hour
  const sortedSteps = [...scenario.steps].sort((a, b) => a.hour - b.hour);
  let matchingStep = sortedSteps[0];
  for (const step of sortedSteps) {
    if (step.hour <= hour) matchingStep = step;
    else break;
  }
  return matchingStep;
}
