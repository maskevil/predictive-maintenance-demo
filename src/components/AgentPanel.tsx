import { useState } from 'react';
import { AlertTriangle, Bell, Bot, Brain, CheckCircle2, ChevronDown, ChevronRight, ClipboardList, Clock, GitBranch, MessageSquare, Search, Send, Target, TrendingUp, Wrench } from 'lucide-react';
import { KnowledgeGraph } from './KnowledgeGraph';
import type { SelectedAsset } from './AssetTree';
import { getDiagnosticScenario, type DiagnosticScenario, type SensorTrend, type PlcInterlock, type FaultLink } from '../data/diagnosticData';

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

interface AgentPanelProps {
  selectedAsset?: SelectedAsset | null;
}

const defaultScenario: DiagnosticScenario = getDiagnosticScenario('R-RH-001');

function AlertsTable({ scenario }: { scenario: DiagnosticScenario }) {
  const levelClass = scenario.level === 'red' ? 'text-rose-400' : 'text-amber-400';
  const levelText = scenario.level === 'red' ? '严重' : '预警';
  const isPredictive = scenario.level === 'yellow';
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        {scenario.level === 'red' ? (
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        ) : (
          <TrendingUp className="w-4 h-4 text-amber-400" />
        )}
        <h3 className="text-sm font-semibold text-slate-200">
          {scenario.level === 'red' ? '当前故障告警' : '当前预测告警'}
        </h3>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/60">
            <tr>
              <th className="px-3 py-2 text-left text-slate-400 font-medium">告警编号</th>
              <th className="px-3 py-2 text-left text-slate-400 font-medium">部件</th>
              <th className="px-3 py-2 text-left text-slate-400 font-medium">级别</th>
              {isPredictive && (
                <>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">预测时间</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">置信度</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            <tr className="bg-slate-800/40">
              <td className="px-3 py-2 text-slate-300">{scenario.alertId}</td>
              <td className="px-3 py-2 text-slate-300">{scenario.component}</td>
              <td className="px-3 py-2">
                <span className={`${levelClass} font-semibold`}>{levelText}</span>
              </td>
              {isPredictive && (
                <>
                  <td className="px-3 py-2 text-slate-300">预计72小时内</td>
                  <td className="px-3 py-2">
                    <span className="text-amber-400 font-semibold">{scenario.step4_confidence}%</span>
                  </td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Step1AlertTrigger({ scenario }: { scenario: DiagnosticScenario }) {
  return (
    <CollapsibleStep
      stepNumber={1}
      title={scenario.level === 'red' ? '告警触发' : '预测触发'}
      icon={scenario.level === 'red' ? <Bell className="w-3 h-3 text-rose-400" /> : <TrendingUp className="w-3 h-3 text-amber-400" />}
      iconColor={scenario.level === 'red' ? 'bg-rose-500/20 border border-rose-400' : 'bg-amber-500/20 border border-amber-400'}
      defaultExpanded={true}
    >
      <div className="pt-2 text-sm text-slate-300 space-y-1">
        <p>{scenario.step1_device} <span className="font-medium">{scenario.component}</span>传感器上报异常</p>
        {scenario.step1_values.map((v, i) => (
          <p key={i}>
            • {v.label} = <span className={v.abnormal ? 'text-rose-400 font-medium' : 'text-amber-400 font-medium'}>{v.value}</span>
          </p>
        ))}
        <p className="text-xs text-slate-400">告警时间：{scenario.step1_time} | 级别：{scenario.step1_level}</p>
      </div>
    </CollapsibleStep>
  );
}

function Step2ImpactAnalysis({ scenario, alertId }: { scenario: DiagnosticScenario; alertId?: string }) {
  const isPredictive = scenario.level === 'yellow';
  return (
    <CollapsibleStep
      stepNumber={2}
      title={isPredictive ? '确认范围（基于本体知识图谱）' : '影响范围推理'}
      icon={<GitBranch className={`w-3 h-3 ${isPredictive ? 'text-sky-400' : 'text-amber-400'}`} />}
      iconColor={isPredictive ? 'bg-sky-500/20 border border-sky-400' : 'bg-amber-500/20 border border-amber-400'}
      defaultExpanded={true}
    >
      <div className="pt-2 space-y-3">
        <div>
          <div className="text-xs text-slate-400 mb-1.5">【PID工艺关联逻辑】</div>
          <div className="p-2 rounded border border-slate-600 bg-slate-800/40 text-[10px] text-slate-300 space-y-1.5">
            <div className="text-[10px] text-slate-400 mb-1">{scenario.step2_pidLabel}</div>
            {scenario.step2_pidRelations.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5 flex-wrap">
                {r.nodes.map((n, j) => {
                  const isLink = n.startsWith('←') || n.startsWith('→');
                  const isAbnormal = n.includes(scenario.component);
                  return isLink ? (
                    <span key={j} className="text-slate-500">{n}</span>
                  ) : (
                    <span key={j} className={`px-1.5 py-0.5 rounded border ${
                      isAbnormal ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-slate-700 text-slate-200'
                    }`}>{n}</span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 mb-1.5">【PLC联锁控制逻辑】</div>
          <div className="space-y-1.5 text-[10px]">
            {scenario.step2_plcInterlocks.map((plc: PlcInterlock, i: number) => (
              <div key={i} className={`flex items-start gap-2 p-1.5 rounded border ${plc.triggered ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-800/40 border-slate-700/50'}`}>
                <span className={`${plc.triggered ? 'text-rose-400' : 'text-amber-400'} font-medium shrink-0`}>联锁{i + 1}:</span>
                <span className="text-slate-300">{plc.condition}{plc.action ? ` ${plc.action}` : ''}</span>
                {plc.triggered && <span className="text-rose-400 ml-auto shrink-0 text-[9px]">⚡ 已触发</span>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 mb-1.5">【故障影响链路分析】</div>
          <div className="p-2 rounded border border-slate-600 bg-slate-800/40 text-[10px] text-slate-300 space-y-2">
            {scenario.step2_faultLinks.map((link: FaultLink, i: number) => (
              <div key={i} className="flex items-center gap-1.5 flex-wrap">
                <span className={`px-1.5 py-0.5 rounded border ${link.abnormal ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>{link.from}</span>
                <span className="text-slate-500">{link.relation}</span>
                <span className={`px-1.5 py-0.5 rounded border ${link.abnormal ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>{link.to}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            <span className="font-medium text-slate-200">影响范围：</span>
            {scenario.step2_impactConclusion}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xs text-slate-400 mb-2">【本体知识图谱 — 部件关系与PLC联锁】</div>
          <div className="h-[320px] rounded-lg border border-slate-600 overflow-hidden">
            <KnowledgeGraph compact component={scenario.component} alertId={alertId} />
          </div>
        </div>

        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-medium text-slate-200">初步判断：</p>
          {scenario.step2_initialJudgments.map((j, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-32 text-slate-400">{j.cause}</span>
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${j.probability > 50 ? 'bg-amber-500' : 'bg-slate-500'}`} style={{ width: `${j.probability}%` }} />
              </div>
              <span className={`w-10 text-right font-medium ${j.probability > 50 ? 'text-amber-400' : 'text-slate-400'}`}>{j.probability}%</span>
            </div>
          ))}
        </div>
      </div>
    </CollapsibleStep>
  );
}

function Step3DataInvestigation({ scenario }: { scenario: DiagnosticScenario }) {
  const isPredictive = scenario.level === 'yellow';
  return (
    <CollapsibleStep
      stepNumber={3}
      title={isPredictive ? '多维数据验证' : '数据排查'}
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
                {scenario.step3_sensors.map((s: SensorTrend, i: number) => (
                  <tr key={i} className="bg-slate-800/30">
                    <td className="px-2 py-1 text-slate-300">{s.sensor}</td>
                    <td className={`px-2 py-1 text-right ${s.abnormal ? 'text-amber-400' : 'text-slate-300'}`}>{s.before}</td>
                    <td className={`px-2 py-1 text-right font-medium ${s.abnormal ? 'text-rose-400' : 'text-slate-300'}`}>{s.at}</td>
                    <td className={`px-2 py-1 text-right ${s.abnormal ? 'text-rose-400' : 'text-slate-300'}`}>{s.after}</td>
                    <td className={`px-2 py-1 text-right ${s.abnormal ? 'text-rose-400' : 'text-emerald-400'}`}>{s.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[10px] text-slate-400">
            <span className="font-medium text-slate-200">趋势判断：</span>
            {scenario.step3_trendJudgment}
          </div>
        </div>
        <div className="text-xs text-slate-300">
          <span className="font-medium text-slate-200">排查结论：</span>
          {scenario.step3_conclusion}
        </div>
      </div>
    </CollapsibleStep>
  );
}

function Step4RootCauseAnalysis({ scenario }: { scenario: DiagnosticScenario }) {
  const isPredictive = scenario.level === 'yellow';
  return (
    <CollapsibleStep
      stepNumber={4}
      title={isPredictive ? '案例库相似度推理' : '根因分析'}
      icon={isPredictive ? <Brain className="w-3 h-3 text-purple-400" /> : <Target className="w-3 h-3 text-purple-400" />}
      iconColor="bg-purple-500/20 border border-purple-400"
      defaultExpanded={true}
    >
      <div className="pt-2 space-y-3">
        <div>
          <div className="text-xs text-slate-400 mb-1.5">【逻辑推导过程】</div>
          <div className="space-y-1.5 text-[10px] text-slate-300">
            {scenario.step4_premises.map((p, i) => (
              <div key={i} className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                <span className="text-sky-400 font-medium shrink-0">前提{i + 1}:</span>
                <span>{p}</span>
              </div>
            ))}
            {scenario.step4_reasoning.map((r, i) => (
              <div key={`r${i}`} className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
                <span className="text-sky-400 font-medium shrink-0">推理{i + 1}:</span>
                <span>{r}</span>
              </div>
            ))}
            <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-indigo-500/30 border-l-2 border-l-indigo-500">
              <span className="text-indigo-400 font-medium shrink-0">知识库分析:</span>
              <div className="text-indigo-300 space-y-1">
                <div>{scenario.step4_knowledgeBaseTitle}</div>
                <div className="pl-2 space-y-0.5 text-slate-300">
                  {scenario.step4_knowledgeBaseCauses.map((c, i) => (
                    <div key={i}>• {c.text}</div>
                  ))}
                </div>
                <div>对比历史案例库：</div>
                <div className="pl-2 space-y-0.5 text-slate-300">
                  {scenario.step4_knowledgeBaseHistory.map((h, i) => (
                    <div key={i}>• {h.case}：{h.desc}，{h.match}</div>
                  ))}
                </div>
                <div>结合故障特征 → <span className="text-amber-300 font-medium">{scenario.step4_knowledgeBaseConclusion}</span></div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-1.5 rounded bg-slate-800/40 border border-slate-700/50">
              <span className="text-sky-400 font-medium shrink-0">推理{scenario.step4_reasoning.length + 1}:</span>
              <span>{scenario.step4_finalReasoning}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-300 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">{isPredictive ? '预测根因：' : '最可能根因：'}</span>
            <span className={`${isPredictive ? 'text-amber-400' : 'text-rose-400'} font-semibold`}>{scenario.step4_rootCause}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">置信度：</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">{scenario.step4_confidence}%</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            推理依据：{scenario.step4_reasoningBasis}
          </p>
        </div>
      </div>
    </CollapsibleStep>
  );
}

function Step5FieldConfirmation({ scenario }: { scenario: DiagnosticScenario }) {
  const isPredictive = scenario.level === 'yellow';
  return (
    <CollapsibleStep
      stepNumber={5}
      title={isPredictive ? '预测性维护建议' : '现场工勘确认'}
      icon={isPredictive ? <Clock className="w-3 h-3 text-emerald-400" /> : <ClipboardList className="w-3 h-3 text-orange-400" />}
      iconColor={isPredictive ? 'bg-emerald-500/20 border border-emerald-400' : 'bg-orange-500/20 border border-orange-400'}
      defaultExpanded={isPredictive}
    >
      <div className="pt-2 space-y-2">
        {!isPredictive ? (
          <>
            <div className="p-2 rounded border border-dashed border-slate-600 bg-slate-800/40">
              <div className="text-[10px] text-slate-500 mb-1">客户现场反馈</div>
              <div className="text-xs text-slate-300">{scenario.step5_fieldFeedback}</div>
            </div>
            <div className="text-xs text-slate-300">
              <span className="font-medium text-slate-200">更新结论：</span>
              {scenario.step5_updateConclusion.split(scenario.step4_rootCause).map((part, i) =>
                i === 0 ? part : <span key={i}><span className="text-rose-400 font-medium">{scenario.step4_rootCause}</span>{part}</span>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs text-slate-400">预测诊断链路：</span>
              <div className="text-xs text-slate-200 mt-1">
                预测模型预警 → 本体知识图谱验证 → 多维度数据交叉验证 → 案例库相似度推理 → {scenario.step4_rootCause}预测根因
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-200">【分阶段处置建议】</div>
              {[
                { phase: '第一阶段（0-24小时）', color: 'amber', desc: '预防性维护窗口', items: scenario.step6_steps.slice(0, 3) },
                { phase: '第二阶段（24-48小时）', color: 'rose', desc: '预测故障即将发生', items: scenario.step6_steps.slice(1, 4) },
                { phase: '第三阶段（48-72小时）', color: 'slate', desc: '验证维护效果', items: [`持续监控确认下降趋势`, `对比维护前后数据验证预测准确性`, `更新案例库记录本次经验`] },
              ].map((p, i) => (
                <div key={i} className={`p-2 rounded border bg-${p.color === 'amber' ? 'amber' : p.color === 'rose' ? 'rose' : 'slate'}-500/10 border-${p.color === 'amber' ? 'amber' : p.color === 'rose' ? 'rose' : 'slate'}-500/30`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-1.5 py-0.5 rounded bg-${p.color === 'amber' ? 'amber' : p.color === 'rose' ? 'rose' : 'slate'}-500/20 text-${p.color === 'amber' ? 'amber' : p.color === 'rose' ? 'rose' : 'slate'}-400 text-[10px] font-medium`}>{p.phase}</span>
                    <span className="text-[10px] text-slate-400">{p.desc}</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                    {p.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CollapsibleStep>
  );
}

function Step6ConclusionMaintenance({ scenario }: { scenario: DiagnosticScenario }) {
  return (
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
          <div className="text-xs text-slate-200 mt-1">{scenario.step6_diagnosisChain}</div>
        </div>
        <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1">
          {scenario.step6_steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          状态：{scenario.step6_status}
        </div>
      </div>
    </CollapsibleStep>
  );
}

export function AgentPanel({ selectedAsset }: AgentPanelProps) {
  const alertId = selectedAsset?.alertId;
  const scenario = alertId ? getDiagnosticScenario(alertId) : defaultScenario;
  const isPredictive = scenario.level === 'yellow';

  const [alertType, setAlertType] = useState<'fault' | 'predictive'>(isPredictive ? 'predictive' : 'fault');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: `您好！我是告警诊断Agent。当前检测到${scenario.component}${alertId ? scenario.step1_values.find(v=>v.abnormal)?.label || '异常' : '异常'}，已初步分析故障根因为${scenario.step4_rootCause}。请问您有什么疑问或需要进一步协助？` }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', content: chatInput }]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `收到您的问题。基于当前${scenario.component}数据分析，建议优先检查${scenario.step4_rootCause}相关状态。如需更详细的诊断报告，我可以为您生成完整的故障分析文档。`
      }]);
    }, 1000);
    setChatInput('');
  };

  const showFault = alertType === 'fault';
  const flowTitle = showFault ? '故障诊断推理流程' : '预测诊断推理流程';

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">告警诊断 & 本体推理 Agent</h2>
        </div>
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
            {alertType === 'fault' && <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px]">当前</span>}
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
            {alertType === 'predictive' && <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px]">当前</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AlertsTable scenario={scenario} />

        <section>
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">{flowTitle}</h3>
          </div>

          <div className="relative pl-6 space-y-3">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-600" />

            <Step1AlertTrigger scenario={scenario} />
            <Step2ImpactAnalysis scenario={scenario} alertId={alertId} />
            <Step3DataInvestigation scenario={scenario} />
            <Step4RootCauseAnalysis scenario={scenario} />
            <Step5FieldConfirmation scenario={scenario} />
            <Step6ConclusionMaintenance scenario={scenario} />
          </div>
        </section>

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
