import { NextResponse } from 'next/server';
import { store } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patient = store.getPatient(id);
  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  const medications = store.getMedications(id);
  const labs = store.getLabResults(id);
  const alerts = store.getAlerts({ patientId: id });

  return NextResponse.json({
    ...patient,
    comorbidities: JSON.parse(patient.comorbidities),
    medications,
    labs: [...labs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    alerts: alerts.map((a) => ({
      ...a,
      drugPair: JSON.parse(a.drugPair),
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
}
