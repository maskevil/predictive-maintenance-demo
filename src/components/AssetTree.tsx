import { useState } from 'react';
import {
  MapPin,
  Cog,
  ChevronRight,
  ChevronDown,
  Droplets,
  Wind,
  Zap,
  Snowflake,
  Radio,
  GaugeCircle,
  AlertTriangle,
} from 'lucide-react';

export type ComponentType =
  | '干气密封'
  | '润滑油'
  | '变频器'
  | '水冷系统'
  | '励磁机系统';

export type AlertLevel = 'yellow' | 'red';

export interface AlertItem {
  id: string;
  text: string;
  level: AlertLevel;
}

export interface SelectedAsset {
  station: string;
  compressor: string;
  component: ComponentType;
  alertId?: string;
  alertText?: string;
}

interface Compressor {
  id: string;
  name: string;
}

interface Station {
  name: string;
  compressors: Compressor[];
}

interface ComponentDef {
  name: ComponentType;
  icon: React.ReactNode;
  color: string;
}

const components: ComponentDef[] = [
  { name: '干气密封', icon: <Wind className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
  { name: '润滑油', icon: <Droplets className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  { name: '变频器', icon: <Zap className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  { name: '水冷系统', icon: <Snowflake className="w-3.5 h-3.5" />, color: 'text-sky-400' },
  { name: '励磁机系统', icon: <Radio className="w-3.5 h-3.5" />, color: 'text-rose-400' },
];

const alertsByComponent: Record<ComponentType, AlertItem[]> = {
  '干气密封': [
    { id: 'Y-DQ-001', text: '干气密封一级泄漏量微增', level: 'yellow' },
    { id: 'Y-DQ-002', text: '干气密封供气温度偏高', level: 'yellow' },
    { id: 'R-DQ-001', text: '干气密封一级泄漏量超标', level: 'red' },
    { id: 'R-DQ-002', text: '干气密封供气压差异常', level: 'red' },
  ],
  '润滑油': [
    { id: 'Y-RH-001', text: '润滑油回油温度偏高', level: 'yellow' },
    { id: 'Y-RH-002', text: '润滑油滤芯差压缓慢上升', level: 'yellow' },
    { id: 'R-RH-001', text: '润滑油供油压力过低', level: 'red' },
    { id: 'R-RH-002', text: '润滑油泵驱动端轴承温度高', level: 'red' },
  ],
  '变频器': [
    { id: 'Y-BP-001', text: '变频器IGBT模块温度偏高', level: 'yellow' },
    { id: 'Y-BP-002', text: '变频器输出电流谐波增大', level: 'yellow' },
    { id: 'R-BP-001', text: '变频器直流母线过电压', level: 'red' },
    { id: 'R-BP-002', text: '变频器功率单元过流', level: 'red' },
  ],
  '水冷系统': [
    { id: 'Y-SL-001', text: '水冷系统出水温度偏高', level: 'yellow' },
    { id: 'Y-SL-002', text: '水冷系统循环流量微降', level: 'yellow' },
    { id: 'R-SL-001', text: '水冷系统冷却水流量过低', level: 'red' },
    { id: 'R-SL-002', text: '水冷系统循环泵运行异常', level: 'red' },
  ],
  '励磁机系统': [
    { id: 'Y-LC-001', text: '励磁机定子绕组温度偏高', level: 'yellow' },
    { id: 'Y-LC-002', text: '励磁电流轻微波动', level: 'yellow' },
    { id: 'R-LC-001', text: '励磁机失磁保护动作', level: 'red' },
    { id: 'R-LC-002', text: '励磁机旋转整流器故障', level: 'red' },
  ],
};

const stations: Station[] = [
  {
    name: '泰安站',
    compressors: [
      { id: 'TA-001', name: '电驱压缩机 TA-001' },
      { id: 'TA-002', name: '电驱压缩机 TA-002' },
    ],
  },
  {
    name: '永清站',
    compressors: [
      { id: 'YQ-001', name: '电驱压缩机 YQ-001' },
      { id: 'YQ-002', name: '电驱压缩机 YQ-002' },
    ],
  },
];

interface AssetTreeProps {
  onSelect: (asset: SelectedAsset) => void;
  selected: SelectedAsset | null;
}

export function AssetTree({ onSelect, selected }: AssetTreeProps) {
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set(['泰安站']));
  const [expandedCompressors, setExpandedCompressors] = useState<Set<string>>(new Set(['TA-001']));
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());

  const toggleStation = (name: string) => {
    setExpandedStations((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleCompressor = (id: string) => {
    setExpandedCompressors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleComponent = (key: string) => {
    setExpandedComponents((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const isSelected = (station: string, compressor: string, component: ComponentType) =>
    selected?.station === station &&
    selected?.compressor === compressor &&
    selected?.component === component &&
    !selected?.alertId;

  const isAlertSelected = (alertId: string) => selected?.alertId === alertId;

  return (
    <aside className="w-60 bg-slate-800/80 border-r border-slate-700 flex flex-col shrink-0">
      <div className="px-3 py-3 border-b border-slate-700 flex items-center gap-2">
        <Cog className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          资产结构
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {stations.map((station) => (
          <div key={station.name}>
            <button
              onClick={() => toggleStation(station.name)}
              className="w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-700/50 transition-colors text-left"
            >
              {expandedStations.has(station.name) ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              )}
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-sm font-medium text-slate-200 truncate">
                {station.name}
              </span>
            </button>
            {expandedStations.has(station.name) && (
              <div className="ml-2">
                {station.compressors.map((comp) => (
                  <div key={comp.id}>
                    <button
                      onClick={() => toggleCompressor(comp.id)}
                      className="w-full flex items-center gap-1.5 pl-6 pr-3 py-1 hover:bg-slate-700/50 transition-colors text-left"
                    >
                      {expandedCompressors.has(comp.id) ? (
                        <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                      )}
                      <GaugeCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-300 truncate">{comp.name}</span>
                    </button>
                    {expandedCompressors.has(comp.id) && (
                      <div className="ml-4 border-l border-slate-700/50 pl-3 py-0.5 space-y-0.5">
                        {components.map((c) => {
                          const compKey = `${comp.id}-${c.name}`;
                          return (
                            <div key={c.name}>
                              <button
                                onClick={() => {
                                  toggleComponent(compKey);
                                  onSelect({
                                    station: station.name,
                                    compressor: comp.name,
                                    component: c.name,
                                  });
                                }}
                                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-colors ${
                                  isSelected(station.name, comp.name, c.name)
                                    ? 'bg-sky-500/15 border border-sky-500/30'
                                    : 'hover:bg-slate-700/40 border border-transparent'
                                }`}
                              >
                                {expandedComponents.has(compKey) ? (
                                  <ChevronDown className="w-2.5 h-2.5 text-slate-600 shrink-0" />
                                ) : (
                                  <ChevronRight className="w-2.5 h-2.5 text-slate-600 shrink-0" />
                                )}
                                <span className={c.color}>{c.icon}</span>
                                <span
                                  className={`text-xs truncate ${
                                    isSelected(station.name, comp.name, c.name)
                                      ? 'text-sky-300 font-medium'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {c.name}
                                </span>
                              </button>
                              {expandedComponents.has(compKey) && (
                                <div className="ml-3 border-l border-slate-700/30 pl-3 py-0.5 space-y-0.5">
                                  {alertsByComponent[c.name].map((alert) => (
                                    <button
                                      key={alert.id}
                                      onClick={() =>
                                        onSelect({
                                          station: station.name,
                                          compressor: comp.name,
                                          component: c.name,
                                          alertId: alert.id,
                                          alertText: alert.text,
                                        })
                                      }
                                      className={`w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded text-left transition-colors ${
                                        isAlertSelected(alert.id)
                                          ? alert.level === 'red'
                                            ? 'bg-red-500/15 border border-red-500/30'
                                            : 'bg-amber-500/15 border border-amber-500/30'
                                          : 'hover:bg-slate-700/40 border border-transparent'
                                      }`}
                                    >
                                      <AlertTriangle
                                        className={`w-2.5 h-2.5 shrink-0 ${
                                          alert.level === 'red'
                                            ? 'text-red-400'
                                            : 'text-amber-400'
                                        }`}
                                      />
                                      {alert.level === 'red' ? (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                      ) : (
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                      )}
                                      <span
                                        className={`text-[10px] leading-tight truncate ${
                                          isAlertSelected(alert.id)
                                            ? alert.level === 'red'
                                              ? 'text-red-300 font-medium'
                                              : 'text-amber-300 font-medium'
                                            : 'text-slate-500'
                                        }`}
                                      >
                                        {alert.text}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
