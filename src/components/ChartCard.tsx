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
import type { DataPoint } from '../data/mockData';

interface ChartCardProps {
  title: string;
  data: DataPoint[];
  dataKey?: string;
  color?: string;
  alertLine?: number;
  alertLabel?: string;
  unit?: string;
}

export function ChartCard({
  title,
  data,
  color = '#38bdf8',
  alertLine,
  alertLabel,
  unit,
}: ChartCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700/50 flex flex-col">
      <h3 className="text-slate-200 text-sm font-semibold mb-3">{title}</h3>
      <div className="flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              interval="preserveStartEnd"
              tickMargin={8}
              angle={0}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              width={40}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 8,
                color: '#f1f5f9',
              }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value) => [`${value}${unit ? ` ${unit}` : ''}`, '数值']}
            />
            {alertLine !== undefined && (
              <ReferenceLine
                y={alertLine}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: alertLabel || `告警线 ${alertLine}`,
                  fill: '#ef4444',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
