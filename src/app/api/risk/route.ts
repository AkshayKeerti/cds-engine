import { NextResponse } from 'next/server';
import { store } from '@/lib/db';
import { computeRiskScore } from '@/lib/engine/risk-engine';
import { getInteractingPairs } from '@/lib/engine/pharmacokinetic-map';
import { generateInterventionCard } from '@/lib/engine/intervention';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');

  if (!patientId) {
    return NextResponse.json({ error: 'patientId required' }, { status: 400 });
  }

  const patient = store.getPatient(patientId);
  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  const meds = store.getMedications(patientId);
  const labs = store.getLabResults(patientId);

  const activeDrugCodes = meds.filter((m) => m.status === 'active').map((m) => m.drugCode);
  const pairs = getInteractingPairs(activeDrugCodes);

  const creatinineLabs = labs
    .filter((l) => l.labType === 'creatinine')
    .map((l) => ({ value: l.value, timestamp: l.timestamp }));

  const latestCr = creatinineLabs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0]?.value ?? patient.baselineCreatinine;

  const gfrLabs = labs.filter((l) => l.labType === 'gfr');
  const latestGfr = gfrLabs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0]?.value;

  const results = pairs.map((pair) => {
    const riskScore = computeRiskScore(pair, latestCr, patient.baselineCreatinine, latestGfr, creatinineLabs);
    const intervention = generateInterventionCard(riskScore, pair, latestCr, latestGfr);
    return { drugPair: pair, riskScore, intervention };
  });

  return NextResponse.json({
    patientId,
    currentCreatinine: latestCr,
    currentGfr: latestGfr,
    baselineCreatinine: patient.baselineCreatinine,
    interactions: results,
  });
}
