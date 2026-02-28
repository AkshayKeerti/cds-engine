import { NextResponse } from 'next/server';
import { store } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId') ?? undefined;
  const alertType = searchParams.get('alertType') ?? undefined;

  const alerts = store.getAlerts({ patientId, alertType });

  return NextResponse.json(
    alerts.map((a) => ({
      ...a,
      drugPair: JSON.parse(a.drugPair),
    }))
  );
}
