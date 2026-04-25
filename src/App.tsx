import { useState } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { AssetTree, type SelectedAsset } from './components/AssetTree';
import { PredictiveCharts } from './components/PredictiveCharts';
import { AnomalyDetectionCharts } from './components/AnomalyDetectionCharts';
import { AgentPanel } from './components/AgentPanel';
import { Monitor } from 'lucide-react';

function App() {
  const [selected, setSelected] = useState<SelectedAsset | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  const handleSelect = (asset: SelectedAsset) => {
    setSelected(asset);
    if (asset.alertId) {
      setPanelVisible(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <TopNavbar />
      <div className="flex-1 flex min-h-0 relative">
        <AssetTree onSelect={handleSelect} selected={selected} />
        <main className="flex-1 flex flex-col min-w-0 relative">
          <div className="flex-1 flex flex-col min-w-0">
            {selected && !selected.alertId ? (
              <>
                <div className="flex-1 min-h-0 border-b border-slate-700/50">
                  <PredictiveCharts
                    title={`${selected.station} / ${selected.compressor} / ${selected.component} — 预测趋势`}
                  />
                </div>
                <div className="flex-1 min-h-0">
                  <AnomalyDetectionCharts component={selected.component} />
                </div>
              </>
            ) : selected?.alertId ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3 px-8">
                  <Monitor className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-slate-300 text-sm font-medium">{selected.alertText}</p>
                  <p className="text-slate-500 text-xs">
                    {selected.station} / {selected.compressor} / {selected.component}
                  </p>
                  <p className="text-slate-400 text-xs">告警详情请查看右侧诊断面板</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Monitor className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-slate-500 text-sm">请在左侧资产结构中选择一个部件以查看监控数据</p>
                </div>
              </div>
            )}
          </div>

          <div
            className={`absolute inset-0 bg-slate-800/95 border-l border-slate-600 shadow-2xl shadow-black/50 transition-transform duration-300 ease-in-out z-20 flex ${
              panelVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <button
              onClick={() => setPanelVisible(!panelVisible)}
              className="absolute -left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-3.5 h-16 bg-slate-700 border border-slate-600 rounded-l hover:bg-slate-600 transition-colors cursor-pointer z-30"
              title={panelVisible ? '隐藏诊断面板' : '显示诊断面板'}
            >
              <span className="text-[8px] text-slate-400 leading-none">
                {panelVisible ? '◀' : '▶'}
              </span>
            </button>
            <div className="flex-1 overflow-hidden">
              <AgentPanel selectedAsset={selected} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
