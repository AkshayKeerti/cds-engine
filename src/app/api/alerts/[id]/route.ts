import { NextResponse } from 'next/server';
import { store } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status, clinicianFeedback } = body;

  const alert = store.getAlert(id);
  if (!alert) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (clinicianFeedback) updates.clinicianFeedback = clinicianFeedback;

  store.updateAlert(id, updates);

  store.insertAuditLog({
    id: uuid(),
    alertId: id,
    patientId: alert.patientId,
    action: status === 'dismissed' ? 'alert_dismissed' : status === 'confirmed' ? 'alert_confirmed' : 'alert_updated',
    actor: 'clinician',
    details: JSON.stringify({ status, clinicianFeedback, previousStatus: alert.status }),
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
