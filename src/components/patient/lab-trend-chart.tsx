'use client';

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

  const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    fontSize: '12px',
  };

  return (
    <div className="bg-white border border-border rounded-lg">
      <div className="px-4 py-2.5 border-b border-border">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Lab Trends</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {hasCreatinine && (
            <ChartPanel label="Creatinine" unit="mg/dL">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine y={baselineCreatinine} stroke="#16a34a" strokeDasharray="4 4" strokeWidth={1} />
                  <ReferenceLine y={2.0} stroke="#dc2626" strokeDasharray="4 4" strokeWidth={1} />
                  <Line type="monotone" dataKey="creatinine" stroke="#d97706" strokeWidth={2} dot={{ r: 3, fill: '#d97706', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          )}

          {hasGfr && (
            <ChartPanel label="GFR" unit="mL/min">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 120]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine y={60} stroke="#d97706" strokeDasharray="4 4" strokeWidth={1} />
                  <ReferenceLine y={30} stroke="#dc2626" strokeDasharray="4 4" strokeWidth={1} />
                  <Line type="monotone" dataKey="gfr" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          )}

          {hasPotassium && (
            <ChartPanel label="Potassium" unit="mEq/L">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[3, 7]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine y={5.0} stroke="#d97706" strokeDasharray="4 4" strokeWidth={1} />
                  <ReferenceLine y={5.5} stroke="#dc2626" strokeDasharray="4 4" strokeWidth={1} />
                  <Line type="monotone" dataKey="potassium" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          )}

          {hasBun && (
            <ChartPanel label="BUN" unit="mg/dL">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine y={20} stroke="#16a34a" strokeDasharray="4 4" strokeWidth={1} />
                  <Line type="monotone" dataKey="bun" stroke="#0891b2" strokeWidth={2} dot={{ r: 3, fill: '#0891b2', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          )}
        </div>
      </div>
    </div>
  );
}

function ChartPanel({ label, unit, children }: { label: string; unit: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </div>
      {children}
    </div>
  );
}
