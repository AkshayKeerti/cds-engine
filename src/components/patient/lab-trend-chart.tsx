'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface LabPoint {
  labType: string;
  value: number;
  unit: string;
  timestamp: string;
}

interface Props {
  labs: LabPoint[];
  baselineCreatinine: number;
}

export function LabTrendChart({ labs, baselineCreatinine }: Props) {
  // Group labs by timestamp and create chart data points
  const timestamps = [...new Set(labs.map((l) => l.timestamp))].sort();

  const chartData = timestamps.map((ts, i) => {
    const point: Record<string, number | string> = { hour: `H${i * 8}`, index: i };
    const labsAtTime = labs.filter((l) => l.timestamp === ts);
    for (const lab of labsAtTime) {
      point[lab.labType] = lab.value;
    }
    return point;
  });

  const hasCreatinine = labs.some((l) => l.labType === 'creatinine');
  const hasGfr = labs.some((l) => l.labType === 'gfr');
  const hasPotassium = labs.some((l) => l.labType === 'potassium');
  const hasBun = labs.some((l) => l.labType === 'bun');

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Lab Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {hasCreatinine && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Creatinine (mg/dL)</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 11, fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '8px' }}
                    labelStyle={{ color: '#888' }}
                  />
                  <ReferenceLine y={baselineCreatinine} stroke="#22c55e" strokeDasharray="5 5" label={{ value: 'Baseline', fill: '#22c55e', fontSize: 10 }} />
                  <ReferenceLine y={2.0} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Danger', fill: '#ef4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="creatinine" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {hasGfr && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">GFR (mL/min)</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis domain={[0, 120]} tick={{ fontSize: 11, fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '8px' }}
                    labelStyle={{ color: '#888' }}
                  />
                  <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Stage 3', fill: '#f59e0b', fontSize: 10 }} />
                  <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Stage 4', fill: '#ef4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="gfr" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {hasPotassium && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Potassium (mEq/L)</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis domain={[3, 7]} tick={{ fontSize: 11, fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '8px' }}
                    labelStyle={{ color: '#888' }}
                  />
                  <ReferenceLine y={5.0} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'High', fill: '#f59e0b', fontSize: 10 }} />
                  <ReferenceLine y={5.5} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Critical', fill: '#ef4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="potassium" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {hasBun && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">BUN (mg/dL)</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 11, fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '8px' }}
                    labelStyle={{ color: '#888' }}
                  />
                  <ReferenceLine y={20} stroke="#22c55e" strokeDasharray="5 5" label={{ value: 'Normal', fill: '#22c55e', fontSize: 10 }} />
                  <Line type="monotone" dataKey="bun" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4, fill: '#06b6d4' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
