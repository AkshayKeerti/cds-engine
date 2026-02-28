import { NextResponse } from 'next/server';
import { store } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId') ?? undefined;

  const logs = store.getAuditLogs(patientId);

  return NextResponse.json(
    logs
      .map((l) => ({ ...l, details: JSON.parse(l.details) }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  );
}
