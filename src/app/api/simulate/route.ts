import { NextResponse } from 'next/server';
import { advanceSimulation, resetSimulation, getSimulationState } from '@/lib/simulation/time-stepper';

export async function POST(request: Request) {
  const body = await request.json();
  const { action, targetHour } = body;

  if (action === 'reset') {
    const result = resetSimulation();
    // After reset, run hour 0 to generate static alerts
    const hour0Results = await advanceSimulation(0);
    return NextResponse.json({ ...result, hour0Results });
  }

  if (action === 'advance' && targetHour !== undefined) {
    const results = await advanceSimulation(targetHour);
    return NextResponse.json({ success: true, hour: targetHour, results });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET() {
  const state = getSimulationState();
  return NextResponse.json(state);
}
