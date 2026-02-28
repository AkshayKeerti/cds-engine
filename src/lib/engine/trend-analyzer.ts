import type { LabResult, TrendDirection } from '@/lib/types';

export function computeTrend(labValues: { value: number; timestamp: string }[]): TrendDirection {
  if (labValues.length < 2) return 'stable';

  const sorted = [...labValues].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const recent = sorted.slice(-5);
  if (recent.length < 2) return 'stable';

  const slope = linearSlope(recent.map((v, i) => ({ x: i, y: v.value })));

  if (slope > 0.05) return 'rising';
  if (slope < -0.05) return 'falling';
  return 'stable';
}

export function computeTrendFactor(labValues: { value: number; timestamp: string }[]): number {
  if (labValues.length < 2) return 1.0;

  const sorted = [...labValues].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const recent = sorted.slice(-5);
  if (recent.length < 2) return 1.0;

  // Compute normalized slope (change per step relative to first value)
  const first = recent[0].value;
  if (first === 0) return 1.0;

  const last = recent[recent.length - 1].value;
  const relativeChange = (last - first) / first;

  // Map relative change to trend factor 1.0-2.0
  // 0% change = 1.0, 100%+ change = 2.0
  return Math.min(2.0, Math.max(1.0, 1.0 + relativeChange));
}

function linearSlope(points: { x: number; y: number }[]): number {
  const n = points.length;
  if (n < 2) return 0;

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }

  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return 0;

  return (n * sumXY - sumX * sumY) / denom;
}

export function getLatestLabValue(
  labs: Pick<LabResult, 'labType' | 'value' | 'timestamp'>[],
  labType: string
): number | undefined {
  const filtered = labs
    .filter((l) => l.labType === labType)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return filtered[0]?.value;
}
