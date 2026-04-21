import { ChartCard } from './ChartCard';
import {
  generateCurrentData,
  generateVibrationData,
  generateOilPressureData,
  generateFlowData,
  generateCurrentElectricData,
  generateRPMSData,
} from '../data/mockData';
import { Activity } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-slate-100">
            预测性维护监控系统
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">设备:</span>
          <span className="text-slate-200 text-sm font-medium">Turbine System G1</span>
          <span className="ml-3 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            状态: 运行中
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
        <ChartCard
          title="主轴承 - 温度趋势图 (°C)"
          data={generateCurrentData()}
          color="#f59e0b"
          alertLine={80}
          alertLabel="告警线: 80°C"
          unit="°C"
        />
        <ChartCard
          title="主轴承 - 振动趋势图 (mm/s RMS)"
          data={generateVibrationData()}
          color="#a78bfa"
          alertLine={1.0}
          alertLabel="告警线: 1.0 mm/s"
          unit="mm/s"
        />
        <ChartCard
          title="润滑系统 - 油压 (bar)"
          data={generateOilPressureData()}
          color="#38bdf8"
          unit="bar"
        />
        <ChartCard
          title="润滑系统 - 流量 (l/min)"
          data={generateFlowData()}
          color="#34d399"
          unit="l/min"
        />
        <ChartCard
          title="电机 - 电流 (A)"
          data={generateCurrentElectricData()}
          color="#f472b6"
          unit="A"
        />
        <ChartCard
          title="电机 - 转速 (RPM)"
          data={generateRPMSData()}
          color="#60a5fa"
          unit="RPM"
        />
        </div>
      </div>
    </div>
  );
}
