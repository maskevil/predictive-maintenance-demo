import { useState } from 'react';
import { AlertTriangle, Bell, Bot, Brain, CheckCircle2, ChevronDown, ChevronRight, ClipboardList, Clock, GitBranch, LineChart, MessageSquare, Search, Send, Shield, Target, TrendingUp, Wrench } from 'lucide-react';

const alerts = [
  { id: '告警#103', component: '主轴承', level: '严重' },
  { id: '告警#104', component: '主轴承', level: '严重' },
  { id: '告警#105', component: '润滑系统', level: '严重' },
];

interface CollapsibleStepProps {
  stepNumber: number;
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

function CollapsibleStep({ stepNumber, title, icon, iconColor, defaultExpanded = false, children }: CollapsibleStepProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="relative">
      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full ${iconColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="bg-slate-900/60 rounded-lg border border-slate-700 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">步骤{stepNumber}：</span>
            <span className="text-xs font-semibold text-slate-200">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>
        
        {isExpanded && (
          <div className="px-3 pb-3 border-t border-slate-700/50">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export function AgentPanel() {
  const [alertType, setAlertType] = useState<'fault' | 'predictive'>('fault');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '您好！我是告警诊断Agent。当前检测到主轴承温度异常，已初步分析故障根因为双联过滤器滤芯堵塞。请问您有什么疑问或需要进一步协助？' }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages([...chatMessages, { role: 'user', content: chatInput }]);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '收到您的问题。基于当前数据分析，建议优先检查双联过滤器滤芯状态。如需更详细的诊断报告，我可以为您生成完整的故障分析文档。' 
      }]);
    }, 1000);
    
    setChatInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">告警诊断 & 本体推理 Agent</h2>
        </div>
        
        {/* 告警类型切换 - 平铺展示 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAlertType('fault')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              alertType === 'fault'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>故障告警</span>
            {alertType === 'fault' && (
              <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px]">当前</span>
            )}
          </button>
          <button
            onClick={() => setAlertType('predictive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              alertType === 'predictive'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>预测告警</span>
            {alertType === 'predictive' && (
              <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px]">当前</span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 当前告警 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            {alertType === 'fault' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            ) : (
              <TrendingUp className="w-4 h-4 text-amber-400" />
            )}
            <h3 className="text-sm font-semibold text-slate-200">
              {alertType === 'fault' ? '当前故障告警' : '当前预测告警'}
            </h3>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">告警编号</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">部件</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">级别</th>
                  {alertType === 'predictive' && (
                    <>
                      <th className="px-3 py-2 text-left text-slate-400 font-medium">预测时间</th>
                      <th className="px-3 py-2 text-left text-slate-400 font-medium">置信度</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {alertType === 'fault' ? (
                  alerts.map((a) => (
                    <tr key={a.id} className="bg-slate-800/40">
                      <td className="px-3 py-2 text-slate-300">{a.id}</td>
                      <td className="px-3 py-2 text-slate-300">{a.component}</td>
                      <td className="px-3 py-2">
                        <span className="text-rose-400 font-semibold">{a.level}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-slate-800/40">
                    <td className="px-3 py-2 text-slate-300">预测#2024-001</td>
                    <td className="px-3 py-2 text-slate-300">主轴承</td>
                    <td className="px-3 py-2">
                      <span className="text-amber-400 font-semibold">预警</span>
                    </td>
                    <td className="px-3 py-2 text-slate-300">预计72小时内</td>
                    <td className="px-3 py-2">
                      <span className="text-amber-400 font-semibold">78%</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 本体推理逻辑流程 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              {alertType === 'fault' ? '故障诊断推理流程' : '预测诊断推理流程'}
            </h3>
          </div>

          <div className="relative pl-6 space-y-3">
            {/* 竖线 */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-600" />

            {alertType === 'fault' ? (
              <>
                {/* 故障告警诊断流程 */}
                
                {/* Step 1: 告警触发 */}
                <CollapsibleStep
                  stepNumber={1}
                  title="告警触发"
                  icon={<Bell className="w-3 h-3 text-rose-400" />}
                  iconColor="bg-rose-500/20 border border-rose-400"
                  defaultExpanded={true}
                >
                  <div className="pt-2 text-sm text-slate-300 space-y-1">
                    <p>涡轮机组 <span className="font-medium">G1</span> 主轴承温度传感器上报异常</p>
                    <p>• 主轴承温度 = <span className="text-rose-400 font-medium">85.2°C</span></p>
                    <p>• 主轴承振动 = <span className="text-rose-400 font-medium">1.2 mm/s</span></p>
                    <p className="text-xs text-slate-400">告警时间：2024-01-15 14:00:00 | 级别：严重</p>
                  </div>
                </CollapsibleStep>

                {/* Step 2: 影响范围推理 */}
                <CollapsibleStep
                  stepNumber={2}
                  title="影响范围推理"
                  icon={<GitBranch className="w-3 h-3 text-amber-400" />}
                  iconColor="bg-amber-500/20 border border-amber-400"
                  defaultExpanded={true}
                >
                  <div className="pt-2 space-y-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【PID工艺关联逻辑】</div>
                      <div className="p-2 rounded border border-slate-600 bg-slate-800/40 text-[10px] text-slate-300 space-y-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">主轴承</span>
                          <span className="text-slate-500">←供油→</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">润滑油站</span>
                          <span className="text-slate-500">←回流→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">油箱</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">润滑油站</span>
                          <span className="text-slate-500">←冷却→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">空冷器</span>
                          <span className="text-slate-500">←过滤→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">双联过滤器</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">主轴承</span>
                          <span className="text-slate-500">→同轴→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">齿轮箱</span>
                          <span className="text-slate-500">→同轴→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">主电机</span>
                          <span className="text-slate-500">→同轴→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">压缩机</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【PLC联锁控制逻辑】</div>
                      <div className="space-y-1.5 text-[10px]">
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-amber-400 font-medium shrink-0">联锁1:</span>
                          <span className="text-slate-300">IF 油压 {'<'} 0.15 MPa OR 油位 {'<'} 30% THEN 启动事故油泵 + 报警</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-amber-400 font-medium shrink-0">联锁2:</span>
                          <span className="text-slate-300">IF 主轴承温度 {'>'} 80°C THEN 降负荷运行 + 报警</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-amber-400 font-medium shrink-0">联锁3:</span>
                          <span className="text-slate-300">IF 主轴承振动 {'>'} 1.0 mm/s THEN 延时30s停机保护</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-amber-400 font-medium shrink-0">联锁4:</span>
                          <span className="text-slate-300">IF 过滤器差压 {'>'} 80 KPa THEN 切换备用过滤器 + 报警</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-amber-400 font-medium shrink-0">联锁5:</span>
                          <span className="text-slate-300">IF 空冷器出口温度 {'>'} 45°C THEN 启动备用风机</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【故障影响链路分析】</div>
                      <div className="p-2 rounded border border-slate-600 bg-slate-800/40 text-[10px] text-slate-300 space-y-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">过滤器环节异常</span>
                          <span className="text-slate-500">→ 差压↑ 供油流量↓ →</span>
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">主轴承润滑不足</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">主轴承润滑不足</span>
                          <span className="text-slate-500">→ 摩擦↑ 散热↓ →</span>
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">温度85.2°C + 振动1.2mm/s</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">齿轮箱</span>
                          <span className="text-slate-500">← 独立油路供油正常 →</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">温度正常42°C</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">油箱</span>
                          <span className="text-slate-500">→ 油泵正常 →</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">油压稳定0.31MPa</span>
                          <span className="text-slate-500">→ 空冷器正常 →</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">油温33°C</span>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400">
                        <span className="font-medium text-slate-200">影响范围：</span>
                        故障局限于过滤器→主轴承分支油路，未扩散至齿轮箱、主电机、压缩机，油泵和冷却系统运行正常
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <p className="font-medium text-slate-200">初步判断：</p>
                      <div className="flex items-center gap-2">
                        <span className="w-32 text-slate-400">过滤器环节异常</span>
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
                        </div>
                        <span className="w-10 text-right text-amber-400 font-medium">60%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-32 text-slate-400">冷却系统异常</span>
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 rounded-full" style={{ width: '20%' }} />
                        </div>
                        <span className="w-10 text-right text-slate-400 font-medium">20%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-32 text-slate-400">轴承本身故障</span>
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 rounded-full" style={{ width: '20%' }} />
                        </div>
                        <span className="w-10 text-right text-slate-400 font-medium">20%</span>
                      </div>
                    </div>
                  </div>
                </CollapsibleStep>

                {/* Step 3: 数据排查 */}
                <CollapsibleStep
                  stepNumber={3}
                  title="数据排查"
                  icon={<Search className="w-3 h-3 text-indigo-400" />}
                  iconColor="bg-indigo-500/20 border border-indigo-400"
                  defaultExpanded={true}
                >
                  <div className="pt-2 space-y-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【关联传感器趋势分析（告警前后10分钟）】</div>
                      <div className="overflow-hidden rounded border border-slate-700 mb-2">
                        <table className="w-full text-[10px]">
                          <thead className="bg-slate-800">
                            <tr>
                              <th className="px-2 py-1 text-left text-slate-400 font-medium">传感器</th>
                              <th className="px-2 py-1 text-right text-slate-400 font-medium">13:50</th>
                              <th className="px-2 py-1 text-right text-slate-400 font-medium">14:00</th>
                              <th className="px-2 py-1 text-right text-slate-400 font-medium">14:10</th>
                              <th className="px-2 py-1 text-right text-slate-400 font-medium">趋势</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700">
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">主轴承温度</td>
                              <td className="px-2 py-1 text-right text-slate-300">78.5°C</td>
                              <td className="px-2 py-1 text-right text-rose-400 font-medium">85.2°C</td>
                              <td className="px-2 py-1 text-right text-rose-400">87.1°C</td>
                              <td className="px-2 py-1 text-right text-rose-400">↑ 持续上升</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">主轴承振动</td>
                              <td className="px-2 py-1 text-right text-slate-300">0.85 mm/s</td>
                              <td className="px-2 py-1 text-right text-rose-400 font-medium">1.2 mm/s</td>
                              <td className="px-2 py-1 text-right text-rose-400">1.35 mm/s</td>
                              <td className="px-2 py-1 text-right text-rose-400">↑ 持续上升</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">油压 (PISA4141)</td>
                              <td className="px-2 py-1 text-right text-slate-300">0.31 MPa</td>
                              <td className="px-2 py-1 text-right text-slate-300">0.31 MPa</td>
                              <td className="px-2 py-1 text-right text-slate-300">0.30 MPa</td>
                              <td className="px-2 py-1 text-right text-emerald-400">→ 基本稳定</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">过滤器差压</td>
                              <td className="px-2 py-1 text-right text-slate-300">65 KPa</td>
                              <td className="px-2 py-1 text-right text-amber-400">78 KPa</td>
                              <td className="px-2 py-1 text-right text-rose-400">85 KPa</td>
                              <td className="px-2 py-1 text-right text-rose-400">↑ 快速上升</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">空冷器出口温度</td>
                              <td className="px-2 py-1 text-right text-slate-300">32.6°C</td>
                              <td className="px-2 py-1 text-right text-slate-300">33.1°C</td>
                              <td className="px-2 py-1 text-right text-slate-300">33.0°C</td>
                              <td className="px-2 py-1 text-right text-emerald-400">→ 正常波动</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">齿轮箱温度</td>
                              <td className="px-2 py-1 text-right text-slate-300">42.1°C</td>
                              <td className="px-2 py-1 text-right text-slate-300">42.3°C</td>
                              <td className="px-2 py-1 text-right text-slate-300">42.5°C</td>
                              <td className="px-2 py-1 text-right text-emerald-400">→ 正常波动</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        <span className="font-medium text-slate-200">趋势判断：</span>
                        主轴承温度/振动同步持续上升，过滤器差压快速上升并超过阈值，油压稳定，空冷器和齿轮箱温度正常 → 故障集中在润滑回路过滤器环节
                      </div>
                    </div>

                    <div className="text-xs text-slate-300">
                      <span className="font-medium text-slate-200">排查结论：</span> 传感器趋势数据验证步骤2推理——故障集中在过滤器环节，需进一步分析具体原因。
                    </div>
                  </div>
                </CollapsibleStep>

                {/* Step 4: 根因分析 */}
                <CollapsibleStep
                  stepNumber={4}
                  title="根因分析"
                  icon={<Target className="w-3 h-3 text-purple-400" />}
                  iconColor="bg-purple-500/20 border border-purple-400"
                  defaultExpanded={true}
                >
                  <div className="pt-2 space-y-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【逻辑推导过程】</div>
                      <div className="space-y-1.5 text-[10px] text-slate-300">
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">前提1:</span>
                          <span>当前主轴承温度 85.2°C {'>'} 80°C（触发联锁2），且10分钟内从78.5°C升至87.1°C，上升趋势明确</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">前提2:</span>
                          <span>当前主轴承振动 1.2 mm/s {'>'} 1.0 mm/s（触发联锁3），且10分钟内从0.85升至1.35 mm/s，与温度同步恶化</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">前提3:</span>
                          <span>过滤器差压从65 KPa升至85 KPa（触发联锁4阈值80 KPa），10分钟内上升30%，异常趋势明显</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">推理1:</span>
                          <span>根据PID关联，主轴承温度/振动同步上升 → 润滑油供给量不足或油质恶化</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">推理2:</span>
                          <span>油压稳定在0.30-0.31 MPa（联锁1未触发）→ 油泵运行正常，供油压力充足，排除油泵故障</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">推理3:</span>
                          <span>空冷器出口温度稳定33°C（联锁5未触发）→ 冷却系统正常，排除冷却不足导致温升</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">推理4:</span>
                          <span>齿轮箱温度正常42°C → 下游润滑正常，故障未扩散至齿轮箱，定位在过滤器至主轴承分支油路</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">推理5:</span>
                          <span>过滤器差压快速上升（65→85 KPa）与主轴承温升时间点吻合（13:50-14:10）→ 过滤器环节存在异常，导致供油流量下降</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-indigo-500/30 border-l-2 border-l-indigo-500">
                          <span className="text-indigo-400 font-medium shrink-0">知识库分析:</span>
                          <div className="text-indigo-300 space-y-1">
                            <div>查询故障模式库，过滤器差压异常可能原因：</div>
                            <div className="pl-2 space-y-0.5 text-slate-300">
                              <div>• 滤芯堵塞（概率75%）- 差压持续上升，油质劣化</div>
                              <div>• 油液粘度异常（概率15%）- 温度变化导致，差压波动</div>
                              <div>• 流量突增（概率10%）- 系统负荷变化，差压瞬时上升</div>
                            </div>
                            <div>对比历史案例库：</div>
                            <div className="pl-2 space-y-0.5 text-slate-300">
                              <div>• 案例#2019-08：滤芯堵塞，差压65→90 KPa，主轴承温度同步上升，与本案例高度吻合</div>
                              <div>• 案例#2021-03：油液粘度异常，差压波动范围大，温度无明显变化，排除</div>
                            </div>
                            <div>结合故障特征：差压单调上升+温度同步恶化+油压稳定 → <span className="text-amber-300 font-medium">高度疑似滤芯堵塞</span></div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">推理6:</span>
                          <span>知识库分析结果与传感器趋势、PLC联锁状态一致 → 过滤器滤芯堵塞导致供油流量下降，主轴承润滑不足</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-slate-300 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">最可能根因：</span>
                        <span className="text-rose-400 font-semibold">双联过滤器滤芯堵塞</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">置信度：</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">95%</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        推理依据：步骤2影响范围推理确定故障在过滤器→主轴承分支油路；步骤3传感器趋势分析验证过滤器差压与主轴承参数同步恶化；步骤4逻辑推导结合知识库对比，确认滤芯堵塞为根因。
                      </p>
                    </div>
                  </div>
                </CollapsibleStep>

                {/* Step 5: 现场工勘确认 */}
                <CollapsibleStep
                  stepNumber={5}
                  title="现场工勘确认"
                  icon={<ClipboardList className="w-3 h-3 text-orange-400" />}
                  iconColor="bg-orange-500/20 border border-orange-400"
                  defaultExpanded={false}
                >
                  <div className="pt-2 space-y-2">
                    <div className="p-2 rounded border border-dashed border-slate-600 bg-slate-800/40">
                      <div className="text-[10px] text-slate-500 mb-1">客户现场反馈</div>
                      <div className="text-xs text-slate-300">
                        “润滑油泵滤芯存在明显堵塞，油液杂质较多，已拍照记录。”
                      </div>
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="font-medium text-slate-200">更新结论：</span>
                      结合工勘反馈，确认根因为<span className="text-rose-400 font-medium">润滑油泵滤芯堵塞</span>导致供油不足，引发主轴承润滑失效。与Agent推理结论一致。
                    </div>
                  </div>
                </CollapsibleStep>

                {/* Step 6: 最终结论与维护建议 */}
                <CollapsibleStep
                  stepNumber={6}
                  title="最终结论与维护建议"
                  icon={<Wrench className="w-3 h-3 text-emerald-400" />}
                  iconColor="bg-emerald-500/20 border border-emerald-400"
                  defaultExpanded={true}
                >
                  <div className="pt-2 space-y-2">
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-xs text-slate-400">综合诊断链路：</span>
                      <div className="text-xs text-slate-200 mt-1">
                        双联过滤器滤芯堵塞 → 供油流量下降 → 主轴承润滑失效 → 温度/振动异常
                      </div>
                    </div>
                    <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1">
                      <li>立即切换至备用过滤器，隔离堵塞过滤器</li>
                      <li>更换滤芯并清洗过滤器壳体</li>
                      <li>检查油液品质，必要时更换润滑油</li>
                      <li>运行2小时后复测主轴承温度与振动</li>
                      <li>连续监控24小时，确认趋势恢复正常</li>
                    </ol>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      状态：已生成最终报告，已通知现场工程师
                    </div>
                  </div>
                </CollapsibleStep>
              </>
            ) : (
              <>
                {/* 预测告警诊断流程 */}
                
                {/* Step 1: 预测触发 */}
                <CollapsibleStep
                  stepNumber={1}
                  title="预测触发"
                  icon={<TrendingUp className="w-3 h-3 text-amber-400" />}
                  iconColor="bg-amber-500/20 border border-amber-400"
                  defaultExpanded={true}
                >
                  <div className="pt-2 text-sm text-slate-300 space-y-1">
                    <p>涡轮机组 <span className="font-medium">G1</span> 主轴承温度预测模型触发预警</p>
                    <p>• 当前温度：<span className="text-amber-400 font-medium">78.5°C</span>（正常范围）</p>
                    <p>• 预测趋势：<span className="text-amber-400 font-medium">72小时内将达到85°C以上</span></p>
                    <p>• 预测置信度：<span className="text-amber-400 font-medium">78%</span></p>
                    <p className="text-xs text-slate-400">预测时间：2024-01-15 14:00:00 | 预警级别：中</p>
                  </div>
                </CollapsibleStep>

                {/* Step 2: 确认范围（基于本体知识图谱） */}
                <CollapsibleStep
                  stepNumber={2}
                  title="确认范围（基于本体知识图谱）"
                  icon={<Shield className="w-3 h-3 text-sky-400" />}
                  iconColor="bg-sky-500/20 border border-sky-400"
                  defaultExpanded={true}
                >
                  <div className="pt-2 space-y-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【本体知识图谱关联分析】</div>
                      <div className="p-2 rounded border border-slate-600 bg-slate-800/40 text-[10px] text-slate-300 space-y-2">
                        <div className="text-[10px] text-slate-400 mb-1">基于PID逻辑图，主轴承温度异常可能影响范围：</div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">主轴承</span>
                          <span className="text-slate-500">←供油→</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">润滑油站</span>
                          <span className="text-slate-500">←回流→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">油箱</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">润滑油站</span>
                          <span className="text-slate-500">←冷却→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">空冷器</span>
                          <span className="text-slate-500">←过滤→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">双联过滤器</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">主轴承</span>
                          <span className="text-slate-500">→同轴→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">齿轮箱</span>
                          <span className="text-slate-500">→同轴→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">主电机</span>
                          <span className="text-slate-500">→同轴→</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">压缩机</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【物理规则验证】</div>
                      <div className="space-y-1.5 text-[10px]">
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">规则1:</span>
                          <span className="text-slate-300">主轴承温度变化率 ≤ 5°C/小时（物理极限）</span>
                          <span className="text-emerald-400 ml-auto">✓ 通过</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">规则2:</span>
                          <span className="text-slate-300">温度-振动关联性：温度升高时振动应同步变化</span>
                          <span className="text-emerald-400 ml-auto">✓ 通过</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">规则3:</span>
                          <span className="text-slate-300">润滑系统供油压力与温度负相关（压力下降→温度上升）</span>
                          <span className="text-emerald-400 ml-auto">✓ 通过</span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-sky-400 font-medium shrink-0">规则4:</span>
                          <span className="text-slate-300">环境温度影响系数：夏季温升速率高于冬季</span>
                          <span className="text-emerald-400 ml-auto">✓ 通过</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded border border-emerald-500/30 bg-emerald-500/10">
                      <div className="text-xs text-emerald-400 font-medium mb-1">✓ 范围确认结果</div>
                      <div className="text-[10px] text-slate-300 space-y-1">
                        <div>• 基于本体知识图谱分析，主轴承温度异常可能影响范围：润滑油站、过滤器、冷却系统、齿轮箱</div>
                        <div>• 物理规则验证全部通过，预测数据符合设备运行规律，<span className="text-emerald-400 font-medium">非伪告警</span></div>
                        <div>• 需对范围内相关部件传感器数据进行多维验证</div>
                      </div>
                    </div>
                  </div>
                </CollapsibleStep>

                {/* Step 3: 多维数据验证（范围内传感器趋势） */}
                <CollapsibleStep
                  stepNumber={3}
                  title="多维数据验证（范围内传感器趋势）"
                  icon={<LineChart className="w-3 h-3 text-indigo-400" />}
                  iconColor="bg-indigo-500/20 border border-indigo-400"
                  defaultExpanded={true}
                >
                  <div className="pt-2 space-y-3">
                    <div className="text-[10px] text-slate-400 mb-1">
                      基于步骤2确认的范围，对相关部件传感器进行趋势分析：
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【一天趋势分析（24小时）】</div>
                      <div className="overflow-hidden rounded border border-slate-700 mb-2">
                        <table className="w-full text-[10px]">
                          <thead className="bg-slate-800">
                            <tr>
                              <th className="px-2 py-1 text-left text-slate-400 font-medium">时间段</th>
                              <th className="px-2 py-1 text-right text-slate-400 font-medium">温度均值</th>
                              <th className="px-2 py-1 text-right text-slate-400 font-medium">温度峰值</th>
                              <th className="px-2 py-1 text-right text-slate-400 font-medium">趋势</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700">
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">00:00-06:00</td>
                              <td className="px-2 py-1 text-right text-slate-300">72.3°C</td>
                              <td className="px-2 py-1 text-right text-slate-300">74.1°C</td>
                              <td className="px-2 py-1 text-right text-slate-300">→ 平稳</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">06:00-12:00</td>
                              <td className="px-2 py-1 text-right text-slate-300">74.8°C</td>
                              <td className="px-2 py-1 text-right text-slate-300">76.5°C</td>
                              <td className="px-2 py-1 text-right text-amber-400">↑ 缓慢上升</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">12:00-18:00</td>
                              <td className="px-2 py-1 text-right text-slate-300">76.2°C</td>
                              <td className="px-2 py-1 text-right text-amber-400">78.5°C</td>
                              <td className="px-2 py-1 text-right text-amber-400">↑ 加速上升</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">18:00-24:00</td>
                              <td className="px-2 py-1 text-right text-slate-300">预估77.5°C</td>
                              <td className="px-2 py-1 text-right text-amber-400">预估80.2°C</td>
                              <td className="px-2 py-1 text-right text-rose-400">↑ 持续恶化</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【一周趋势分析（7天）】</div>
                      <div className="overflow-hidden rounded border border-slate-700 mb-2">
                        <table className="w-full text-[10px]">
                          <thead className="bg-slate-800">
                            <tr>
                              <th className="px-2 py-1 text-left text-slate-400 font-medium">日期</th>
                              <th className="px-2 py-1 text-right text-slate-400 font-medium">日均温度</th>
                              <th className="px-2 py-1 text-right text-slate-400 font-medium">温升速率</th>
                              <th className="px-2 py-1 text-right text-slate-400 font-medium">状态</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700">
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">01/09</td>
                              <td className="px-2 py-1 text-right text-slate-300">68.5°C</td>
                              <td className="px-2 py-1 text-right text-slate-300">—</td>
                              <td className="px-2 py-1 text-right text-emerald-400">正常</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">01/10</td>
                              <td className="px-2 py-1 text-right text-slate-300">69.2°C</td>
                              <td className="px-2 py-1 text-right text-slate-300">+0.7°C/天</td>
                              <td className="px-2 py-1 text-right text-emerald-400">正常</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">01/11</td>
                              <td className="px-2 py-1 text-right text-slate-300">70.8°C</td>
                              <td className="px-2 py-1 text-right text-amber-400">+1.6°C/天</td>
                              <td className="px-2 py-1 text-right text-amber-400">关注</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">01/12</td>
                              <td className="px-2 py-1 text-right text-slate-300">72.5°C</td>
                              <td className="px-2 py-1 text-right text-amber-400">+1.7°C/天</td>
                              <td className="px-2 py-1 text-right text-amber-400">关注</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">01/13</td>
                              <td className="px-2 py-1 text-right text-slate-300">74.1°C</td>
                              <td className="px-2 py-1 text-right text-rose-400">+1.6°C/天</td>
                              <td className="px-2 py-1 text-right text-rose-400">预警</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">01/14</td>
                              <td className="px-2 py-1 text-right text-slate-300">76.3°C</td>
                              <td className="px-2 py-1 text-right text-rose-400">+2.2°C/天</td>
                              <td className="px-2 py-1 text-right text-rose-400">预警</td>
                            </tr>
                            <tr className="bg-slate-800/30">
                              <td className="px-2 py-1 text-slate-300">01/15（今天）</td>
                              <td className="px-2 py-1 text-right text-amber-400">78.5°C</td>
                              <td className="px-2 py-1 text-right text-rose-400">+2.2°C/天</td>
                              <td className="px-2 py-1 text-right text-rose-400">预警</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="p-2 rounded border border-amber-500/30 bg-amber-500/10">
                      <div className="text-xs text-amber-400 font-medium mb-1">⚠ 交叉验证结论</div>
                      <div className="text-[10px] text-slate-300 space-y-1">
                        <div>• 一天趋势：温度呈现加速上升态势，最近6小时温升速率较白天提升40%</div>
                        <div>• 一周趋势：连续7天温度持续上升，日均温升速率从0.7°C增至2.2°C，恶化趋势明显</div>
                        <div>• 关联参数：过滤器差压同期从45 KPa升至65 KPa，呈现正相关趋势</div>
                        <div className="text-amber-400 font-medium">→ 交叉验证通过，预测告警可信度高</div>
                      </div>
                    </div>
                  </div>
                </CollapsibleStep>

                {/* Step 4: 案例库相似度推理 */}
                <CollapsibleStep
                  stepNumber={4}
                  title="案例库相似度推理"
                  icon={<Brain className="w-3 h-3 text-purple-400" />}
                  iconColor="bg-purple-500/20 border border-purple-400"
                  defaultExpanded={true}
                >
                  <div className="pt-2 space-y-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【历史相似案例匹配】</div>
                      <div className="space-y-2">
                        <div className="p-2 rounded border border-slate-600 bg-slate-800/40">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-200">案例#2022-11-08</span>
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-medium">相似度 92%</span>
                          </div>
                          <div className="text-[10px] text-slate-400 space-y-0.5">
                            <div>特征：主轴承温度7天持续上升，日均温升2.1°C，过滤器差压同步上升</div>
                            <div>根因：润滑油滤芯堵塞</div>
                            <div>处置：提前48小时更换滤芯，避免故障停机</div>
                          </div>
                        </div>

                        <div className="p-2 rounded border border-slate-600 bg-slate-800/40">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-200">案例#2023-05-22</span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-medium">相似度 78%</span>
                          </div>
                          <div className="text-[10px] text-slate-400 space-y-0.5">
                            <div>特征：主轴承温度快速上升，但过滤器差压正常</div>
                            <div>根因：冷却系统散热效率下降</div>
                            <div>处置：清洗冷却器，未更换滤芯</div>
                          </div>
                        </div>

                        <div className="p-2 rounded border border-slate-600 bg-slate-800/40">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-200">案例#2021-09-15</span>
                            <span className="px-2 py-0.5 rounded bg-slate-600 text-slate-400 text-[10px] font-medium">相似度 45%</span>
                          </div>
                          <div className="text-[10px] text-slate-400 space-y-0.5">
                            <div>特征：温度波动异常，无持续上升趋势</div>
                            <div>根因：传感器漂移</div>
                            <div>处置：校准传感器</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 mb-1.5">【相似度推理分析】</div>
                      <div className="space-y-1.5 text-[10px] text-slate-300">
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-purple-400 font-medium shrink-0">匹配1:</span>
                          <span>案例#2022-11-08 相似度92% - 温度趋势、过滤器差压变化、时间跨度高度吻合，<span className="text-rose-400">最可能根因为滤芯堵塞</span></span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-purple-400 font-medium shrink-0">匹配2:</span>
                          <span>案例#2023-05-22 相似度78% - 温度趋势相似，但过滤器差压异常，<span className="text-slate-400">当前案例差压已上升，排除此根因</span></span>
                        </div>
                        <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                          <span className="text-purple-400 font-medium shrink-0">匹配3:</span>
                          <span>案例#2021-09-15 相似度45% - 特征差异较大，<span className="text-slate-400">排除传感器故障</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-slate-300 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">预测根因：</span>
                        <span className="text-amber-400 font-semibold">双联过滤器滤芯堵塞（预测性）</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">置信度：</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">92%</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        推理依据：通过本体知识图谱物理规则验证排除伪告警；一天/一周趋势交叉验证确认恶化趋势；案例库相似度匹配（92%）指向滤芯堵塞根因。
                      </p>
                    </div>
                  </div>
                </CollapsibleStep>

                {/* Step 5: 预测性维护建议 */}
                <CollapsibleStep
                  stepNumber={5}
                  title="预测性维护建议"
                  icon={<Clock className="w-3 h-3 text-emerald-400" />}
                  iconColor="bg-emerald-500/20 border border-emerald-400"
                  defaultExpanded={true}
                >
                  <div className="pt-2 space-y-3">
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-xs text-slate-400">预测诊断链路：</span>
                      <div className="text-xs text-slate-200 mt-1">
                        预测模型预警 → 本体知识图谱验证 → 多维度数据交叉验证 → 案例库相似度推理 → 滤芯堵塞预测根因
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-slate-200">【分阶段处置建议】</div>
                      
                      <div className="p-2 rounded border border-amber-500/30 bg-amber-500/10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-medium">第一阶段（0-24小时）</span>
                          <span className="text-[10px] text-slate-400">预防性维护窗口</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                          <li>安排计划性巡检，重点检查过滤器差压趋势</li>
                          <li>准备备用滤芯和工具，做好更换准备</li>
                          <li>增加监控频率，从每小时改为每30分钟</li>
                        </ul>
                      </div>

                      <div className="p-2 rounded border border-rose-500/30 bg-rose-500/10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-medium">第二阶段（24-48小时）</span>
                          <span className="text-[10px] text-slate-400">预测故障即将发生</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                          <li>切换至备用过滤器，隔离主过滤器</li>
                          <li>更换滤芯并清洗过滤器壳体</li>
                          <li>检查油液品质，必要时更换润滑油</li>
                        </ul>
                      </div>

                      <div className="p-2 rounded border border-slate-600 bg-slate-800/40">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-600 text-slate-300 text-[10px] font-medium">第三阶段（48-72小时）</span>
                          <span className="text-[10px] text-slate-400">验证维护效果</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                          <li>持续监控主轴承温度，确认下降趋势</li>
                          <li>对比维护前后数据，验证预测准确性</li>
                          <li>更新案例库，记录本次预测维护经验</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      状态：预测性维护方案已生成，建议优先执行第一阶段预防措施
                    </div>
                  </div>
                </CollapsibleStep>
              </>
            )}
          </div>
        </section>

        {/* AI对话区域 */}
        <section className="border-t border-slate-700/50 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Agent对话</h3>
          </div>
          
          <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-lg text-xs ${
                  msg.role === 'user' 
                    ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30' 
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入问题与Agent对话..."
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
            <button
              onClick={handleSendMessage}
              className="px-3 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/30 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
