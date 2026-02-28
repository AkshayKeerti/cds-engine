import { store } from '@/lib/db';
import { v4 as uuid } from 'uuid';
import { getScenario } from './scenarios';
import { computeRiskScore } from '@/lib/engine/risk-engine';
import { createContextAwareAlert, createStaticAlert } from '@/lib/engine/alert-triage';
import { getInteractingPairs } from '@/lib/engine/pharmacokinetic-map';
import type { LabResult, Alert } from '@/lib/types';

export async function advanceSimulation(targetHour: number) {
  const patients = store.getPatients();
  const results: { patientId: string; hour: number; alerts: Alert[]; labs: LabResult[] }[] = [];

  for (const patient of patients) {
    const scenario = getScenario(patient.id);
    if (!scenario) continue;

    const sortedSteps = [...scenario.steps].sort((a, b) => a.hour - b.hour);
    const step = sortedSteps.find((s) => s.hour === targetHour);
    if (!step) continue;

    const timestamp = new Date(Date.now() + targetHour * 3600000).toISOString();

    // Insert lab results for this step
    const newLabs: LabResult[] = [];
    for (const lab of step.labs) {
      const labRecord = {
        id: uuid(),
        patientId: patient.id,
        labType: lab.labType,
        value: lab.value,
        unit: lab.unit,
        timestamp,
        trend: null,
      };
      store.insertLabResult(labRecord);
      newLabs.push({ ...labRecord, trend: undefined } as unknown as LabResult);
    }

    // Get all labs for trend computation
    const allLabs = store.getLabResults(patient.id);

    // Get active medications
    const meds = store.getMedications(patient.id);
    const activeDrugCodes = meds
      .filter((m) => m.status === 'active')
      .map((m) => m.drugCode);

    // Find interacting pairs
    const pairs = getInteractingPairs(activeDrugCodes);

    const newAlerts: Alert[] = [];

    for (const pair of pairs) {
      const creatinineLabs = allLabs
        .filter((l) => l.labType === 'creatinine')
        .map((l) => ({ value: l.value, timestamp: l.timestamp }));

      const latestCr = creatinineLabs.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0]?.value ?? patient.baselineCreatinine;

      const gfrLabs = allLabs.filter((l) => l.labType === 'gfr');
      const latestGfr = gfrLabs.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0]?.value;

      const riskScore = computeRiskScore(
        pair,
        latestCr,
        patient.baselineCreatinine,
        latestGfr,
        creatinineLabs
      );

      // Create context-aware alert if threshold met
      const contextAlert = createContextAwareAlert(patient.id, riskScore, pair, targetHour);
      if (contextAlert) {
        store.insertAlert({
          ...contextAlert,
          drugPair: JSON.stringify(contextAlert.drugPair),
          clinicianFeedback: null,
        });
        newAlerts.push(contextAlert);

        store.insertAuditLog({
          id: uuid(),
          alertId: contextAlert.id,
          patientId: patient.id,
          action: 'alert_generated',
          actor: 'system',
          details: JSON.stringify({ riskScore: riskScore.score, severity: riskScore.severity, hour: targetHour }),
          timestamp: new Date().toISOString(),
        });
      }

      // Generate static alerts at hour 0
      if (targetHour === 0) {
        const staticAlert = createStaticAlert(patient.id, pair, targetHour);
        store.insertAlert({
          ...staticAlert,
          drugPair: JSON.stringify(staticAlert.drugPair),
          clinicianFeedback: null,
        });
        newAlerts.push(staticAlert);

        for (let k = 0; k < 2; k++) {
          const extraAlert = createStaticAlert(patient.id, pair, targetHour);
          extraAlert.title = k === 0
            ? `Duplicate Check: ${pair.drugA} interaction with ${pair.drugB}`
            : `Medication Reconciliation: Verify ${pair.drugA} + ${pair.drugB}`;
          store.insertAlert({
            ...extraAlert,
            drugPair: JSON.stringify(extraAlert.drugPair),
            clinicianFeedback: null,
          });
          newAlerts.push(extraAlert);
        }
      }
    }

    results.push({ patientId: patient.id, hour: targetHour, alerts: newAlerts, labs: newLabs as LabResult[] });
  }

  store.updateSimulationState({ currentHour: targetHour });

  return results;
}

export function resetSimulation() {
  store.reset();
  return { success: true, message: 'Simulation reset to hour 0' };
}

export function getSimulationState() {
  return store.getSimulationState();
}
