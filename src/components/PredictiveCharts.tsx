import { useMemo } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import { generatePredictiveData } from '../data/mockData';
import { TrendingUp } from 'lucide-react';

interface PredictiveChartsProps {
  title: string;
  compact?: boolean;
}

function ChartTooltip({ active, payload, label }: Record<string, unknown>) {
  if (!active || !payload || !Array.isArray(payload)) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-slate-400 text-xs mb-1">{String(label)}</p>
      {payload.map((entry: Record<string, unknown>, idx: number) => (
        <p key={idx} className="text-xs" style={{ color: String(entry.color) }}>
          {String(entry.name)}: {String(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function PredictiveCharts({ title }: PredictiveChartsProps) {
  const data = useMemo(() => generatePredictiveData(), []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        </div>
        <span className="text-xs text-slate-500">未来10分钟预测</span>
      </div>
      <div className="flex-1 grid grid-rows-2 gap-0 p-3 min-h-0">
        <div className="min-h-0">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            振动预测趋势 (mm/s RMS)
          </div>
          <div className="h-[calc(100%-20px)]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  interval={1}
                  tickMargin={4}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} width={40} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine
                  y={1.0}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{
                    value: '告警 1.0',
                    fill: '#ef4444',
                    fontSize: 9,
                    position: 'right',
                  }}
                />
                <defs>
                  <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="vibrationUpper"
                  stroke="none"
                  fill="url(#vibGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="vibrationLower"
                  stroke="none"
                  fill="url(#vibGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="vibration"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#f87171' }}
                  name="振动预测值"
                  unit=" mm/s"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-h-0">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            温度预测趋势 (°C)
          </div>
          <div className="h-[calc(100%-20px)]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  interval={1}
                  tickMargin={4}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} width={40} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine
                  y={80}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{
                    value: '告警 80°C',
                    fill: '#ef4444',
                    fontSize: 9,
                    position: 'right',
                  }}
                />
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="temperatureUpper"
                  stroke="none"
                  fill="url(#tempGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="temperatureLower"
                  stroke="none"
                  fill="url(#tempGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#fbbf24' }}
                  name="温度预测值"
                  unit=" °C"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
