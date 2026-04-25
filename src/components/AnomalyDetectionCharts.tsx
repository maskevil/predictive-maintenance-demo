import { useMemo } from 'react';
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
import { TrendingDown, AlertTriangle } from 'lucide-react';
import type { ComponentType } from './AssetTree';

interface AnomalyParam {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  alertLine: number;
  abnormal: boolean;
}

const paramConfigs: Record<ComponentType, AnomalyParam[]> = {
  '干气密封': [
    { key: 'leak_rate', label: '一级泄漏量', unit: 'Nml/min', min: 2, max: 12, alertLine: 10, abnormal: true },
    { key: 'supply_pressure', label: '供气压力', unit: 'MPa', min: 0.35, max: 0.55, alertLine: 0.4, abnormal: false },
    { key: 'supply_temp', label: '供气温度', unit: '°C', min: 20, max: 50, alertLine: 45, abnormal: false },
  ],
  '润滑油': [
    { key: 'oil_pressure', label: '供油压力', unit: 'MPa', min: 0.25, max: 0.40, alertLine: 0.28, abnormal: true },
    { key: 'return_temp', label: '回油温度', unit: '°C', min: 35, max: 65, alertLine: 60, abnormal: true },
    { key: 'filter_diff', label: '滤芯差压', unit: 'KPa', min: 20, max: 90, alertLine: 80, abnormal: true },
  ],
  '变频器': [
    { key: 'output_freq', label: '输出频率', unit: 'Hz', min: 45, max: 55, alertLine: 52, abnormal: false },
    { key: 'igbt_temp', label: 'IGBT温度', unit: '°C', min: 50, max: 90, alertLine: 85, abnormal: false },
    { key: 'dc_voltage', label: '直流母线电压', unit: 'V', min: 1000, max: 1200, alertLine: 1150, abnormal: false },
  ],
  '水冷系统': [
    { key: 'inlet_temp', label: '进水温度', unit: '°C', min: 18, max: 35, alertLine: 32, abnormal: false },
    { key: 'outlet_temp', label: '出水温度', unit: '°C', min: 22, max: 42, alertLine: 40, abnormal: true },
    { key: 'flow_rate', label: '循环流量', unit: 'm³/h', min: 40, max: 80, alertLine: 50, abnormal: true },
  ],
  '励磁机系统': [
    { key: 'exc_current', label: '励磁电流', unit: 'A', min: 200, max: 320, alertLine: 300, abnormal: false },
    { key: 'stator_temp', label: '定子温度', unit: '°C', min: 60, max: 110, alertLine: 105, abnormal: true },
    { key: 'rectifier_temp', label: '整流器温度', unit: '°C', min: 40, max: 85, alertLine: 80, abnormal: false },
  ],
};

function generateAnomalyData(min: number, max: number, abnormal: boolean) {
  const data: { time: string; value: number }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 2 * 60 * 1000);
    const label = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`;
    let value: number;
    if (abnormal && i < 8) {
      value = max - 5 + Math.random() * (max - (max - 5)) * (1 - i / 30) * 3;
    } else {
      value = min + Math.random() * (max - min) * 0.6;
    }
    data.push({ time: label, value: Number(value.toFixed(2)) });
  }
  return data;
}

interface AnomalyDetectionChartsProps {
  component: ComponentType;
}

export function AnomalyDetectionCharts({ component }: AnomalyDetectionChartsProps) {
  const params = paramConfigs[component] || paramConfigs['润滑油'];
  const chartData = useMemo(
    () => params.map((p) => ({ param: p, data: generateAnomalyData(p.min, p.max, p.abnormal) })),
    [component]
  );

  const hasAlert = params.some((p) => p.abnormal);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            异常检测趋势 — {component}
          </h3>
        </div>
        {hasAlert && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-[10px] text-red-400 font-medium">检测到异常指标</span>
          </div>
        )}
      </div>
      <div className="flex-1 grid grid-cols-3 gap-3 p-3 min-h-0">
        {chartData.map(({ param, data }) => (
          <div key={param.key} className="bg-slate-800/60 rounded-lg border border-slate-700/50 p-2 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-1 shrink-0">
              <span className="text-[10px] text-slate-400">{param.label}</span>
              <span className={`text-[10px] font-medium ${param.abnormal ? 'text-red-400' : 'text-slate-500'}`}>
                {param.unit}
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 2, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: '#475569', fontSize: 8 }}
                    interval={14}
                    tickMargin={0}
                  />
                  <YAxis
                    tick={{ fill: '#475569', fontSize: 8 }}
                    width={28}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: 4,
                      fontSize: 10,
                      color: '#f1f5f9',
                      padding: '4px 8px',
                    }}
                    formatter={(value) => [`${value}`, param.label]}
                  />
                  {param.abnormal && (
                    <ReferenceLine
                      y={param.alertLine}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={param.abnormal ? '#ef4444' : '#38bdf8'}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
