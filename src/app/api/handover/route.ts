import { NextResponse } from 'next/server';
import { store } from '@/lib/db';
import { generateHandoverSummary } from '@/lib/engine/handover-generator';
import type { Alert, Medication, LabResult } from '@/lib/types';

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

  const alerts = store.getAlerts({ patientId })
    .map((a) => ({ ...a, drugPair: JSON.parse(a.drugPair) })) as unknown as Alert[];

  const medications = store.getMedications(patientId) as unknown as Medication[];
  const labs = store.getLabResults(patientId) as unknown as LabResult[];

  const summary = generateHandoverSummary(patientId, alerts, medications, labs);

  return NextResponse.json(summary);
}
