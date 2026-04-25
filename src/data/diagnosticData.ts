import type { ComponentType, AlertLevel } from '../components/AssetTree';

export interface SensorTrend {
  sensor: string;
  before: string;
  at: string;
  after: string;
  unit: string;
  trend: string;
  abnormal: boolean;
}

export interface PlcInterlock {
  name: string;
  condition: string;
  action: string;
  triggered: boolean;
}

export interface FaultLink {
  from: string;
  relation: string;
  to: string;
  abnormal: boolean;
}

export interface RootCauseOption {
  cause: string;
  probability: number;
}

export interface DiagnosticScenario {
  alertId: string;
  component: ComponentType;
  level: AlertLevel;

  step1_title: string;
  step1_device: string;
  step1_values: { label: string; value: string; abnormal: boolean }[];
  step1_time: string;
  step1_level: string;

  step2_pidLabel: string;
  step2_pidRelations: { nodes: string[]; links: string[] }[];
  step2_plcInterlocks: PlcInterlock[];
  step2_faultLinks: FaultLink[];
  step2_impactConclusion: string;
  step2_initialJudgments: RootCauseOption[];

  step3_sensors: SensorTrend[];
  step3_trendJudgment: string;
  step3_conclusion: string;

  step4_premises: string[];
  step4_reasoning: string[];
  step4_knowledgeBaseTitle: string;
  step4_knowledgeBaseCauses: { text: string; probability: number }[];
  step4_knowledgeBaseHistory: { case: string; desc: string; match: string }[];
  step4_knowledgeBaseConclusion: string;
  step4_finalReasoning: string;
  step4_rootCause: string;
  step4_confidence: number;
  step4_reasoningBasis: string;

  step5_fieldFeedback: string;
  step5_updateConclusion: string;

  step6_diagnosisChain: string;
  step6_steps: string[];
  step6_status: string;
}

function sensorTrend(abnormal: boolean): string {
  return abnormal ? '↑ 持续上升' : '→ 正常波动';
}

const dryGasSealScenario: DiagnosticScenario = {
  alertId: 'R-DQ-001',
  component: '干气密封',
  level: 'red',
  step1_title: '告警触发',
  step1_device: '压缩机 TA-001',
  step1_values: [
    { label: '干气密封一级泄漏量', value: '12.5 Nml/min', abnormal: true },
    { label: '干气密封供气压力', value: '0.38 MPa', abnormal: true },
  ],
  step1_time: '2024-01-15 14:00:00',
  step1_level: '严重',
  step2_pidLabel: '基于PID逻辑图，干气密封泄漏异常可能影响范围：',
  step2_pidRelations: [
    { nodes: ['干气密封', '←供气→', '供气调节阀', '←气源→', '氮气缓冲罐'], links: [] },
    { nodes: ['干气密封', '→密封→', '压缩机转子', '→旋转→', '压缩机叶轮'], links: [] },
  ],
  step2_plcInterlocks: [
    { name: '联锁1', condition: "IF 一级泄漏量 > 10 Nml/min THEN 报警", action: '', triggered: true },
    { name: '联锁2', condition: "IF 供气压力 < 0.4 MPa THEN 启动备用气源", action: '', triggered: true },
    { name: '联锁3', condition: "IF 二级泄漏量 > 5 Nml/min THEN 延时停机保护", action: '', triggered: false },
  ],
  step2_faultLinks: [
    { from: '密封端面磨损', relation: '→ 密封间隙增大 →', to: '泄漏量超标', abnormal: true },
    { from: '供气压力不足', relation: '→ 气膜刚度下降 →', to: '密封失效风险', abnormal: false },
    { from: '氮气缓冲罐', relation: '→ 压力正常 →', to: '气源稳定', abnormal: false },
  ],
  step2_impactConclusion: '故障集中在干气密封本体，未影响压缩机运行参数，但存在密封失效扩展风险。',
  step2_initialJudgments: [
    { cause: '密封端面磨损', probability: 55 },
    { cause: '供气系统异常', probability: 30 },
    { cause: '弹簧失效', probability: 15 },
  ],
  step3_sensors: [
    { sensor: '一级泄漏量', before: '8.2 Nml/min', at: '12.5 Nml/min', after: '14.1 Nml/min', unit: '', trend: sensorTrend(true), abnormal: true },
    { sensor: '供气压力 (PT-201)', before: '0.42 MPa', at: '0.38 MPa', after: '0.36 MPa', unit: '', trend: sensorTrend(true), abnormal: true },
    { sensor: '供气温度', before: '28.5°C', at: '29.1°C', after: '29.3°C', unit: '', trend: sensorTrend(false), abnormal: false },
    { sensor: '二级泄漏量', before: '2.1 Nml/min', at: '3.5 Nml/min', after: '4.2 Nml/min', unit: '', trend: sensorTrend(true), abnormal: true },
    { sensor: '压缩机转速', before: '1480 rpm', at: '1485 rpm', after: '1482 rpm', unit: '', trend: sensorTrend(false), abnormal: false },
  ],
  step3_trendJudgment: '一级泄漏量快速上升并超过阈值(10 Nml/min)，供气压力持续下降接近下限(0.35 MPa)，二级泄漏量同步上升→密封端面间隙增大，泄漏加速恶化。',
  step3_conclusion: '传感器趋势数据验证步骤2推理——干气密封一级泄漏量超标，供气压力下降，需分析密封端面状态。',
  step4_premises: [
    '当前干气密封一级泄漏量 12.5 Nml/min > 10 Nml/min（触发联锁1），10分钟内从8.2升至14.1 Nml/min，恶化趋势明确',
    '供气压力 0.38 MPa < 0.4 MPa（触发联锁2），且持续下降至0.36 MPa，与泄漏量恶化同步',
    '二级泄漏量从2.1升至4.2 Nml/min，接近联锁3阈值5 Nml/min，表明密封状态持续恶化',
  ],
  step4_reasoning: [
    '根据干气密封工作原理，一级泄漏量与密封端面间隙成正比 → 泄漏量上升意味着端面间隙增大',
    '供气压力下降但气源稳定 → 密封间隙增大导致气体泄漏增加，气体消耗量大于供气量',
    '二级泄漏量同步上升 → 一级密封失效已影响到二级密封，存在连锁失效风险',
    '压缩机转速和振动正常 → 密封失效未影响机组机械状态，但存在扩展风险',
  ],
  step4_knowledgeBaseTitle: '查询故障模式库，干气密封泄漏异常可能原因：',
  step4_knowledgeBaseCauses: [
    { text: '密封端面磨损（概率55%）- 长期运行导致端面材料损耗，间隙增大', probability: 55 },
    { text: '弹簧力衰减（概率25%）- 弹簧疲劳导致闭合压力下降', probability: 25 },
    { text: 'O型圈老化（概率20%）- 静密封泄漏导致异常', probability: 20 },
  ],
  step4_knowledgeBaseHistory: [
    { case: '案例#2022-03', desc: '密封端面磨损，泄漏量持续上升，供气压力波动，与本案例吻合', match: '高度吻合' },
    { case: '案例#2023-07', desc: '弹簧疲劳，泄漏量波动大无单调趋势，供气正常，排除', match: '不匹配' },
  ],
  step4_knowledgeBaseConclusion: '泄漏量单调上升+供气压力下降+二级密封受影响→高度疑似密封端面磨损',
  step4_finalReasoning: '知识库分析结果与传感器趋势、PLC联锁状态一致→密封端面磨损导致间隙增大，一级泄漏量超标，需及时检修。',
  step4_rootCause: '干气密封端面磨损',
  step4_confidence: 90,
  step4_reasoningBasis: '步骤2影响范围推理定位在干气密封本体；步骤3传感器趋势验证泄漏量与供气压力同步恶化；步骤4逻辑推导结合知识库对比，确认密封端面磨损为根因。',
  step5_fieldFeedback: '"干气密封端面有明显磨损痕迹，密封环碳化层损伤，已拍照记录。"',
  step5_updateConclusion: '结合工勘反馈，确认根因为密封端面磨损导致一级泄漏量超标。与Agent推理结论一致。',
  step6_diagnosisChain: '密封端面磨损 → 密封间隙增大 → 一级泄漏量超标 → 供气压力下降',
  step6_steps: [
    '立即安排停机检修，更换干气密封动静环组件',
    '检查密封腔体清洁度，清除碳粉沉积',
    '复装后按规程进行静态和动态调试',
    '运行4小时后复测一级泄漏量，确保 < 5 Nml/min',
    '连续监控48小时，跟踪泄漏量趋势',
  ],
  step6_status: '已生成最终报告，已通知现场工程师',
};

const lubeOilScenario: DiagnosticScenario = {
  alertId: 'R-RH-001',
  component: '润滑油',
  level: 'red',
  step1_title: '告警触发',
  step1_device: '压缩机 TA-001',
  step1_values: [
    { label: '润滑油供油压力', value: '0.12 MPa', abnormal: true },
    { label: '主轴承温度', value: '85.2°C', abnormal: true },
  ],
  step1_time: '2024-01-15 14:00:00',
  step1_level: '严重',
  step2_pidLabel: '基于PID逻辑图，润滑油压力异常可能影响范围：',
  step2_pidRelations: [
    { nodes: ['主轴承', '←供油→', '润滑油站', '←回流→', '油箱'], links: [] },
    { nodes: ['润滑油站', '←冷却→', '空冷器', '←过滤→', '双联过滤器'], links: [] },
  ],
  step2_plcInterlocks: [
    { name: '联锁1', condition: "IF 油压 < 0.15 MPa OR 油位 < 30% THEN 启动事故油泵+报警", action: '', triggered: true },
    { name: '联锁2', condition: "IF 主轴承温度 > 80°C THEN 降负荷运行+报警", action: '', triggered: true },
    { name: '联锁4', condition: "IF 过滤器差压 > 80 KPa THEN 切换备用过滤器+报警", action: '', triggered: false },
  ],
  step2_faultLinks: [
    { from: '过滤器环节异常', relation: '→ 差压↑ 供油流量↓ →', to: '主轴承润滑不足', abnormal: true },
    { from: '主轴承润滑不足', relation: '→ 摩擦↑ 散热↓ →', to: '温度85.2°C + 振动1.2mm/s', abnormal: true },
    { from: '齿轮箱', relation: '← 独立油路供油正常 →', to: '温度正常42°C', abnormal: false },
  ],
  step2_impactConclusion: '故障局限于过滤器→主轴承分支油路，未扩散至齿轮箱、主电机、压缩机。',
  step2_initialJudgments: [
    { cause: '过滤器环节异常', probability: 60 },
    { cause: '油泵故障', probability: 25 },
    { cause: '管路泄漏', probability: 15 },
  ],
  step3_sensors: [
    { sensor: '主轴承温度', before: '78.5°C', at: '85.2°C', after: '87.1°C', unit: '', trend: sensorTrend(true), abnormal: true },
    { sensor: '主轴承振动', before: '0.85 mm/s', at: '1.2 mm/s', after: '1.35 mm/s', unit: '', trend: sensorTrend(true), abnormal: true },
    { sensor: '油压 (PISA4141)', before: '0.31 MPa', at: '0.31 MPa', after: '0.30 MPa', unit: '', trend: '→ 基本稳定', abnormal: false },
    { sensor: '过滤器差压', before: '65 KPa', at: '78 KPa', after: '85 KPa', unit: '', trend: sensorTrend(true), abnormal: true },
    { sensor: '空冷器出口温度', before: '32.6°C', at: '33.1°C', after: '33.0°C', unit: '', trend: sensorTrend(false), abnormal: false },
    { sensor: '齿轮箱温度', before: '42.1°C', at: '42.3°C', after: '42.5°C', unit: '', trend: sensorTrend(false), abnormal: false },
  ],
  step3_trendJudgment: '主轴承温度/振动同步持续上升，过滤器差压快速上升并超过阈值，油压稳定，空冷器和齿轮箱温度正常→故障集中在润滑回路过滤器环节。',
  step3_conclusion: '传感器趋势数据验证步骤2推理——故障集中在过滤器环节，需进一步分析具体原因。',
  step4_premises: [
    '当前主轴承温度 85.2°C > 80°C（触发联锁2），且10分钟内从78.5°C升至87.1°C，上升趋势明确',
    '当前主轴承振动 1.2 mm/s > 1.0 mm/s（触发联锁3），与温度同步恶化',
    '过滤器差压从65 KPa升至85 KPa（触发联锁4阈值80 KPa），10分钟内上升30%',
  ],
  step4_reasoning: [
    '根据PID关联，主轴承温度/振动同步上升→润滑油供给量不足或油质恶化',
    '油压稳定在0.30-0.31 MPa（联锁1未触发）→油泵运行正常，排除油泵故障',
    '空冷器出口温度稳定33°C（联锁5未触发）→冷却系统正常',
    '过滤器差压快速上升与主轴承温升时间点吻合→过滤器环节存在异常',
  ],
  step4_knowledgeBaseTitle: '查询故障模式库，过滤器差压异常可能原因：',
  step4_knowledgeBaseCauses: [
    { text: '滤芯堵塞（概率75%）- 差压持续上升，油质劣化', probability: 75 },
    { text: '油液粘度异常（概率15%）- 温度变化导致', probability: 15 },
    { text: '流量突增（概率10%）- 系统负荷变化', probability: 10 },
  ],
  step4_knowledgeBaseHistory: [
    { case: '案例#2019-08', desc: '滤芯堵塞，差压65→90 KPa，与本案例高度吻合', match: '高度吻合' },
    { case: '案例#2021-03', desc: '油液粘度异常，差压波动大，温度无明显变化，排除', match: '不匹配' },
  ],
  step4_knowledgeBaseConclusion: '差压单调上升+温度同步恶化+油压稳定→高度疑似滤芯堵塞',
  step4_finalReasoning: '知识库分析结果与传感器趋势、PLC联锁状态一致→过滤器滤芯堵塞导致供油流量下降，主轴承润滑不足。',
  step4_rootCause: '双联过滤器滤芯堵塞',
  step4_confidence: 95,
  step4_reasoningBasis: '步骤2影响范围推理确定故障在过滤器→主轴承分支油路；步骤3传感器趋势分析验证过滤器差压与主轴承参数同步恶化；步骤4逻辑推导结合知识库对比，确认滤芯堵塞为根因。',
  step5_fieldFeedback: '"润滑油泵滤芯存在明显堵塞，油液杂质较多，已拍照记录。"',
  step5_updateConclusion: '结合工勘反馈，确认根因为润滑油泵滤芯堵塞导致供油不足，引发主轴承润滑失效。与Agent推理结论一致。',
  step6_diagnosisChain: '双联过滤器滤芯堵塞 → 供油流量下降 → 主轴承润滑失效 → 温度/振动异常',
  step6_steps: [
    '立即切换至备用过滤器，隔离堵塞过滤器',
    '更换滤芯并清洗过滤器壳体',
    '检查油液品质，必要时更换润滑油',
    '运行2小时后复测主轴承温度与振动',
    '连续监控24小时，确认趋势恢复正常',
  ],
  step6_status: '已生成最终报告，已通知现场工程师',
};

const vfdScenario: DiagnosticScenario = {
  alertId: 'R-BP-001',
  component: '变频器',
  level: 'red',
  step1_title: '告警触发',
  step1_device: '压缩机 TA-001',
  step1_values: [
    { label: '变频器直流母线电压', value: '1180 V', abnormal: true },
    { label: '变频器IGBT温度', value: '85°C', abnormal: false },
  ],
  step1_time: '2024-01-15 14:00:00',
  step1_level: '严重',
  step2_pidLabel: '基于PID逻辑图，变频器直流母线过压异常可能影响范围：',
  step2_pidRelations: [
    { nodes: ['变频器', '→驱动→', '主电机', '→同轴→', '压缩机'], links: [] },
    { nodes: ['电网', '→供电→', '整流单元', '→直流母线→', '逆变单元'], links: [] },
  ],
  step2_plcInterlocks: [
    { name: '联锁1', condition: "IF 直流母线电压 > 1150V THEN 降功率运行+报警", action: '', triggered: true },
    { name: '联锁2', condition: "IF IGBT温度 > 90°C THEN 降频运行+报警", action: '', triggered: false },
    { name: '联锁3', condition: "IF 输出电流 > 额定120% THEN 延时停机", action: '', triggered: false },
  ],
  step2_faultLinks: [
    { from: '电网电压波动', relation: '→ 整流后电压异常 →', to: '直流母线过压', abnormal: true },
    { from: '直流母线过压', relation: '→ IGBT开关应力↑ →', to: 'IGBT温度上升', abnormal: false },
    { from: '主电机', relation: '→ 运行正常 →', to: '压缩机未受影响', abnormal: false },
  ],
  step2_impactConclusion: '变频器直流母线过压报警，IGBT温度正常，压缩机运行尚未受影响，需排查电网侧或整流单元。',
  step2_initialJudgments: [
    { cause: '电网电压波动', probability: 50 },
    { cause: '制动单元故障', probability: 30 },
    { cause: '整流模块异常', probability: 20 },
  ],
  step3_sensors: [
    { sensor: '直流母线电压', before: '1100 V', at: '1180 V', after: '1195 V', unit: '', trend: sensorTrend(true), abnormal: true },
    { sensor: 'IGBT模块温度', before: '78°C', at: '85°C', after: '87°C', unit: '', trend: '↑ 缓慢上升', abnormal: false },
    { sensor: '输出频率', before: '50.0 Hz', at: '49.8 Hz', after: '49.7 Hz', unit: '', trend: sensorTrend(false), abnormal: false },
    { sensor: '输入电压', before: '10.1 kV', at: '10.5 kV', after: '10.6 kV', unit: '', trend: sensorTrend(true), abnormal: true },
    { sensor: '输出电流', before: '320 A', at: '325 A', after: '328 A', unit: '', trend: sensorTrend(false), abnormal: false },
  ],
  step3_trendJudgment: '直流母线电压快速上升超过1150V阈值，电网输入电压同步升高→电网侧电压波动导致整流后直流母线过压。',
  step3_conclusion: '传感器趋势数据验证步骤2推理——电网输入电压升高导致直流母线过压，变频器自身运行参数正常。',
  step4_premises: [
    '当前直流母线电压 1180V > 1150V（触发联锁1），且持续上升至1195V',
    '电网输入电压从10.1kV升至10.6kV（超出正常范围9.8-10.3kV），与直流母线过压时间点吻合',
    'IGBT温度78→87°C（未达90°C报警阈值），属于正常范围内的小幅上升',
  ],
  step4_reasoning: [
    '电网输入电压升高→整流单元输出直流电压同步升高→直流母线电压超限',
    'IGBT温度小幅上升但未超阈值→开关损耗略有增加，非IGBT本身故障',
    '输出频率和电流基本稳定→逆变单元控制正常，压缩机运行未受影响',
    '排除制动单元故障（制动电阻未投入），排除整流模块故障（三相输入平衡）',
  ],
  step4_knowledgeBaseTitle: '查询故障模式库，直流母线过压可能原因：',
  step4_knowledgeBaseCauses: [
    { text: '电网输入电压波动（概率50%）- 上级变电站调压异常', probability: 50 },
    { text: '制动单元失效（概率30%）- 无法吸收回馈能量', probability: 30 },
    { text: '整流模块控制异常（概率20%）- PWM控制信号漂移', probability: 20 },
  ],
  step4_knowledgeBaseHistory: [
    { case: '案例#2023-02', desc: '电网电压波动导致直流母线过压，上级变电站AVR故障，与本案例吻合', match: '高度吻合' },
    { case: '案例#2022-09', desc: '制动电阻开路，电机减速时直流母线过压，与本案例差异大', match: '部分匹配' },
  ],
  step4_knowledgeBaseConclusion: '电网输入电压异常+直流母线同步升高+逆变单元正常→高度疑似电网侧电压波动',
  step4_finalReasoning: '知识库分析结果与传感器趋势、PLC联锁状态一致→电网输入电压波动导致整流后直流母线过压。',
  step4_rootCause: '上级电网电压波动导致直流母线过压',
  step4_confidence: 88,
  step4_reasoningBasis: '步骤2影响范围推理定位在电网侧或整流单元；步骤3传感器趋势验证电网电压与直流母线同步升高；步骤4逻辑推导确认电网波动为根因。',
  step5_fieldFeedback: '"上级变电站AVR自动调节装置存在参数漂移，输出母线电压偶尔超标，已确认。"',
  step5_updateConclusion: '结合工勘反馈，确认根因为上级变电站AVR调节装置参数漂移导致电网电压波动，引发变频器直流母线过压。与Agent推理结论一致。',
  step6_diagnosisChain: '上级电网电压波动 → 整流后直流母线电压超标 → 变频器直流母线过压报警',
  step6_steps: [
    '联系电力调度部门，检查上级变电站AVR自动调节装置',
    '校准AVR调节参数，确保输出电压稳定在额定范围',
    '增加变频器直流母线电压监控的采样频率',
    '如电网波动持续，建议加装动态电压恢复装置(DVR)',
    '持续监控48小时，确认直流母线电压恢复正常',
  ],
  step6_status: '已生成最终报告，已通知现场工程师及电力调度部门',
};

const coolingScenario: DiagnosticScenario = {
  alertId: 'R-SL-002',
  component: '水冷系统',
  level: 'red',
  step1_title: '告警触发',
  step1_device: '压缩机 TA-001',
  step1_values: [
    { label: '水冷系统循环泵电流', value: '0 A（停运）', abnormal: true },
    { label: '水冷系统出水温度', value: '42°C', abnormal: true },
  ],
  step1_time: '2024-01-15 14:00:00',
  step1_level: '严重',
  step2_pidLabel: '基于PID逻辑图，循环泵运行异常可能影响范围：',
  step2_pidRelations: [
    { nodes: ['循环水泵', '→循环→', '冷却塔', '→冷却→', '换热器', '→换热→', '压缩机润滑系统'], links: [] },
    { nodes: ['循环水泵', '←供电→', 'MCC配电柜', '←控制→', 'PLC'], links: [] },
  ],
  step2_plcInterlocks: [
    { name: '联锁1', condition: "IF 循环泵运行信号丢失 THEN 启动备用泵+报警", action: '', triggered: true },
    { name: '联锁2', condition: "IF 出水温度 > 40°C THEN 增加冷却塔风机转速+报警", action: '', triggered: true },
    { name: '联锁3', condition: "IF 循环流量 < 30 m³/h THEN 延时停机保护", action: '', triggered: false },
  ],
  step2_faultLinks: [
    { from: '循环泵异常', relation: '→ 循环流量中断 →', to: '出水温度快速上升', abnormal: true },
    { from: '出水温度上升', relation: '→ 换热效率下降 →', to: '润滑油温度升高', abnormal: true },
    { from: 'MCC配电柜', relation: '→ 供电正常 →', to: '非供电故障', abnormal: false },
  ],
  step2_impactConclusion: '循环泵停运导致水冷系统循环中断，出水温度快速上升，影响润滑油冷却效果，需紧急排查循环泵故障原因。',
  step2_initialJudgments: [
    { cause: '循环泵机械故障', probability: 45 },
    { cause: '电机绕组故障', probability: 35 },
    { cause: '电气控制回路故障', probability: 20 },
  ],
  step3_sensors: [
    { sensor: '循环泵电流', before: '45 A', at: '0 A', after: '0 A', unit: '', trend: '↓ 骤降为0', abnormal: true },
    { sensor: '出水温度', before: '32°C', at: '42°C', after: '46°C', unit: '', trend: sensorTrend(true), abnormal: true },
    { sensor: '循环流量', before: '65 m³/h', at: '0 m³/h', after: '0 m³/h', unit: '', trend: '↓ 骤降为0', abnormal: true },
    { sensor: '进水温度', before: '28°C', at: '29°C', after: '30°C', unit: '', trend: '↑ 缓慢上升', abnormal: false },
    { sensor: '润滑油温度', before: '40°C', at: '43°C', after: '47°C', unit: '', trend: sensorTrend(true), abnormal: true },
  ],
  step3_trendJudgment: '循环泵电流和流量骤降为0，确认循环泵已停运；出水温度快速上升，润滑油温度同步上升→循环泵停运导致换热失效，影响下游润滑系统。',
  step3_conclusion: '传感器趋势数据验证步骤2推理——循环泵停运导致水冷系统流量中断，温度快速上升，已影响润滑油冷却。',
  step4_premises: [
    '循环泵电流从45A骤降为0A→电机失电或保护跳闸，排除机械卡死（卡死电流应升高）',
    '水泵运行信号丢失触发联锁1→PLC已检测到泵停运，但备用泵未自动启动',
    '出水温度和润滑油温度快速上升→循环中断导致换热失效',
  ],
  step4_reasoning: [
    '电流骤降为0而非升高→排除机械卡涩、轴承损坏等机械故障',
    'MCC配电柜供电正常→排除上级电源故障',
    '备用泵未自动启动→检查PLC控制逻辑或备用泵自身状态',
    '出水温度上升速率验证循环中断→换热器一次侧无冷却介质',
  ],
  step4_knowledgeBaseTitle: '查询故障模式库，循环泵停运可能原因：',
  step4_knowledgeBaseCauses: [
    { text: '电机绕组短路跳闸（概率35%）- 绝缘老化导致匝间短路', probability: 35 },
    { text: '热继电器过载保护（概率30%）- 长期过载导致热继动作', probability: 30 },
    { text: '接触器线圈故障（概率20%）- 接触器无法吸合', probability: 20 },
    { text: 'PLC输出模块故障（概率15%）- 控制信号丢失', probability: 15 },
  ],
  step4_knowledgeBaseHistory: [
    { case: '案例#2023-06', desc: '电机绝缘老化导致匝间短路，热继跳闸，电流骤降，与本案例吻合', match: '高度吻合' },
    { case: '案例#2022-01', desc: '接触器线圈烧毁，无法启动备用泵，与备用泵未启动吻合', match: '部分匹配' },
  ],
  step4_knowledgeBaseConclusion: '电流骤降+备用泵未自启+出水温度快速上升→高度疑似电机保护跳闸+备用泵控制系统故障',
  step4_finalReasoning: '知识库分析结果与传感器趋势、PLC联锁状态一致→电机保护跳闸导致循环泵停运，备用泵控制系统异常导致未自动切换。',
  step4_rootCause: '循环泵电机过载跳闸 + 备用泵自启控制故障',
  step4_confidence: 92,
  step4_reasoningBasis: '步骤2影响范围推理定位在水冷系统循环泵及其控制回路；步骤3传感器趋势验证电流骤降和流量中断；步骤4确认电机跳闸+备用泵未自启。',
  step5_fieldFeedback: '"循环泵电机接线盒有烧焦痕迹，绝缘电阻测试为零，备用泵接触器线圈老化无法吸合。已确认。"',
  step5_updateConclusion: '结合工勘反馈，确认根因为循环泵电机绕组短路跳闸，且备用泵接触器故障无法自启，导致水冷系统循环中断。与Agent推理结论一致。',
  step6_diagnosisChain: '循环泵电机绕组短路 → 热继跳闸 → 循环泵停运 → 备用泵接触器故障→自启失败 → 水冷系统循环中断 → 温度上升',
  step6_steps: [
    '立即启动应急冷却方案，使用备用移动式冷却泵组',
    '更换循环泵电机或整体更换泵组',
    '修复或更换备用泵接触器线圈，确保自启功能正常',
    '检修后试运行4小时，确认循环流量和出水温度正常',
    '连续监控48小时，确认系统稳定运行',
  ],
  step6_status: '已生成最终报告，已通知现场工程师及维护班组',
};

const exciterScenario: DiagnosticScenario = {
  alertId: 'R-LC-001',
  component: '励磁机系统',
  level: 'red',
  step1_title: '告警触发',
  step1_device: '压缩机 TA-001',
  step1_values: [
    { label: '励磁机励磁电流', value: '0 A（失磁）', abnormal: true },
    { label: '励磁机定子温度', value: '72°C', abnormal: false },
  ],
  step1_time: '2024-01-15 14:00:00',
  step1_level: '严重',
  step2_pidLabel: '基于PID逻辑图，励磁机失磁异常可能影响范围：',
  step2_pidRelations: [
    { nodes: ['励磁机', '→励磁→', '主电机转子', '→驱动→', '压缩机'], links: [] },
    { nodes: ['AVR励磁调节器', '→供电→', '励磁绕组', '→励磁→', '旋转整流器'], links: [] },
  ],
  step2_plcInterlocks: [
    { name: '联锁1', condition: "IF 励磁电流 < 50A THEN 失磁保护动作+紧急停机", action: '', triggered: true },
    { name: '联锁2', condition: "IF 定子温度 > 105°C THEN 降负荷+报警", action: '', triggered: false },
    { name: '联锁3', condition: "IF 功率因数 < 0.8 THEN 报警", action: '', triggered: false },
  ],
  step2_faultLinks: [
    { from: '失磁保护动作', relation: '→ 励磁电流归零 →', to: '主电机失磁运行', abnormal: true },
    { from: '主电机失磁', relation: '→ 功率因数骤降 →', to: '压缩机降负荷', abnormal: true },
    { from: 'AVR励磁调节器', relation: '→ 输出电压异常 →', to: '励磁绕组失电', abnormal: true },
  ],
  step2_impactConclusion: '励磁机失磁保护动作导致主电机失磁，压缩机降负荷运行，需紧急排查励磁回路故障原因。',
  step2_initialJudgments: [
    { cause: 'AVR励磁调节器故障', probability: 40 },
    { cause: '旋转整流器故障', probability: 35 },
    { cause: '励磁绕组断线', probability: 25 },
  ],
  step3_sensors: [
    { sensor: '励磁电流', before: '280 A', at: '0 A', after: '0 A', unit: '', trend: '↓ 骤降为0', abnormal: true },
    { sensor: 'AVR输出电压', before: '125 V', at: '2 V', after: '0 V', unit: '', trend: '↓ 骤降为0', abnormal: true },
    { sensor: '定子温度', before: '72°C', at: '72°C', after: '74°C', unit: '', trend: sensorTrend(false), abnormal: false },
    { sensor: '功率因数', before: '0.92', at: '0.65', after: '0.58', unit: '', trend: '↓ 快速下降', abnormal: true },
    { sensor: '压缩机转速', before: '1485 rpm', at: '1320 rpm', after: '1280 rpm', unit: '', trend: '↓ 持续下降', abnormal: true },
  ],
  step3_trendJudgment: 'AVR输出电压和励磁电流同步骤降为0，功率因数和压缩机转速快速下降→AVR励磁调节器输出中断导致失磁，主电机进入失磁运行状态。',
  step3_conclusion: '传感器趋势数据验证步骤2推理——AVR励磁调节器输出中断导致励磁电流归零，触发了失磁保护动作。',
  step4_premises: [
    '励磁电流从280A骤降为0A→触发失磁保护（联锁1），励磁系统完全退出',
    'AVR输出电压从125V骤降为2V→AVR调节器输出中断是励磁电流归零的直接原因',
    '功率因数从0.92降至0.58→主电机失磁后转为感性运行，无功功率大幅增加',
  ],
  step4_reasoning: [
    'AVR输出电压先于励磁电流归零→根因在AVR励磁调节器侧，非旋转整流器侧',
    '定子温度未升高→励磁中断时间较短，定子绕组未过热',
    '旋转整流器位于励磁机转子上→如为整流器故障，AVR输出电压应正常但励磁电流为零',
    '实际AVR输出也降为0→故障点应在AVR励磁调节器或励磁变压器',
  ],
  step4_knowledgeBaseTitle: '查询故障模式库，AVR励磁调节器输出中断可能原因：',
  step4_knowledgeBaseCauses: [
    { text: 'AVR调节器电源模块故障（概率40%）- 供电中断导致调节器停运', probability: 40 },
    { text: '励磁变压器故障（概率30%）- 励磁变短路或开路', probability: 30 },
    { text: 'AVR控制板CPU故障（概率20%）- 程序跑飞或硬件失效', probability: 20 },
    { text: '励磁电流传感器故障（概率10%）- 仅测量失效，实际正常', probability: 10 },
  ],
  step4_knowledgeBaseHistory: [
    { case: '案例#2022-05', desc: 'AVR电源模块电容老化导致输出电压骤降，励磁电流归零，与本案例高度吻合', match: '高度吻合' },
    { case: '案例#2021-11', desc: '励磁变高压侧熔断器熔断，AVR输出正常但无励磁电流，与本案例差异', match: '不匹配' },
  ],
  step4_knowledgeBaseConclusion: 'AVR电压与励磁电流同步归零+功率因数骤降+定子温度正常→高度疑似AVR电源模块故障',
  step4_finalReasoning: '知识库分析结果与传感器趋势、PLC联锁状态一致→AVR励磁调节器电源模块故障导致输出中断，主电机失磁。',
  step4_rootCause: 'AVR励磁调节器电源模块故障',
  step4_confidence: 91,
  step4_reasoningBasis: '步骤2影响范围推理定位在AVR励磁调节器或励磁变；步骤3传感器趋势验证AVR电压与励磁电流同步归零；步骤4逻辑推导结合知识库确认AVR电源模块为根因。',
  step5_fieldFeedback: '"AVR励磁调节器电源模块指示灯熄灭，更换备用模块后调节器恢复正常输出。已确认电源模块损坏。"',
  step5_updateConclusion: '结合工勘反馈，确认根因为AVR励磁调节器电源模块故障导致输出中断，引发励磁机失磁保护动作。与Agent推理结论一致。',
  step6_diagnosisChain: 'AVR电源模块故障 → AVR输出电压归零 → 励磁电流归零 → 失磁保护动作 → 压缩机降负荷',
  step6_steps: [
    '立即更换AVR励磁调节器电源模块（备用模块已就位）',
    '完成更换后，逐步恢复励磁电流至额定值280A',
    '监控功率因数恢复至0.9以上，确认主电机同步运行',
    '运行2小时后复测定子温度和励磁电流稳定性',
    '连续监控48小时，确认AVR调节器运行正常',
  ],
  step6_status: '已生成最终报告，已通知现场工程师及电气维护班组',
};

const yellowAlertBase = (
  base: DiagnosticScenario,
  alertId: string,
  _alertText: string,
  component: ComponentType,
): DiagnosticScenario => ({
  ...base,
  alertId,
  component,
  level: 'yellow',
  step1_values: base.step1_values.map((v) => ({
    ...v,
    abnormal: false,
  })),
  step1_level: '预警',
  step2_plcInterlocks: base.step2_plcInterlocks.map((p) => ({
    ...p,
    triggered: false,
  })),
  step4_confidence: Math.round(base.step4_confidence * 0.7),
});

export const diagnosticScenarios: Record<string, DiagnosticScenario> = {
  'R-DQ-001': dryGasSealScenario,
  'R-DQ-002': { ...dryGasSealScenario, alertId: 'R-DQ-002', step4_rootCause: '干气密封供气系统调节阀故障', step6_diagnosisChain: '供气调节阀响应滞后 → 供气压力波动 → 差压异常 → 气膜不稳定', step6_steps: ['检查供气调节阀执行机构', '校准阀门定位器', '测试调节阀响应时间', '运行2小时后复测供气压力', '连续监控48小时'] },
  'Y-DQ-001': yellowAlertBase(dryGasSealScenario, 'Y-DQ-001', '干气密封一级泄漏量微增', '干气密封'),
  'Y-DQ-002': yellowAlertBase(dryGasSealScenario, 'Y-DQ-002', '干气密封供气温度偏高', '干气密封'),

  'R-RH-001': lubeOilScenario,
  'R-RH-002': { ...lubeOilScenario, alertId: 'R-RH-002', step4_rootCause: '润滑油泵驱动端轴承磨损', step6_diagnosisChain: '油泵轴承磨损 → 振动增大 → 温度升高 → 供油不稳定性', step6_steps: ['停机检查油泵轴承', '更换磨损轴承', '清洗润滑油路', '试运行4小时', '连续监控48小时'] },
  'Y-RH-001': yellowAlertBase(lubeOilScenario, 'Y-RH-001', '润滑油回油温度偏高', '润滑油'),
  'Y-RH-002': yellowAlertBase(lubeOilScenario, 'Y-RH-002', '润滑油滤芯差压缓慢上升', '润滑油'),

  'R-BP-001': vfdScenario,
  'R-BP-002': { ...vfdScenario, alertId: 'R-BP-002', step4_rootCause: '变频器功率单元IGBT老化', step6_diagnosisChain: 'IGBT老化 → 导通压降增大 → 输出电流升高 → 过流保护触发', step6_steps: ['停电隔离变频器', '测试IGBT模块参数', '更换故障功率单元', '重新上电调试', '带载运行8小时确认'] },
  'Y-BP-001': yellowAlertBase(vfdScenario, 'Y-BP-001', '变频器IGBT模块温度偏高', '变频器'),
  'Y-BP-002': yellowAlertBase(vfdScenario, 'Y-BP-002', '变频器输出电流谐波增大', '变频器'),

  'R-SL-001': coolingScenario,
  'R-SL-002': coolingScenario,
  'Y-SL-001': yellowAlertBase(coolingScenario, 'Y-SL-001', '水冷系统出水温度偏高', '水冷系统'),
  'Y-SL-002': yellowAlertBase(coolingScenario, 'Y-SL-002', '水冷系统循环流量微降', '水冷系统'),

  'R-LC-001': exciterScenario,
  'R-LC-002': { ...exciterScenario, alertId: 'R-LC-002', step4_rootCause: '旋转整流器二极管击穿', step6_diagnosisChain: '二极管击穿 → 整流输出异常 → 励磁电流波动 → 整流器温度升高', step6_steps: ['停机检查旋转整流器', '更换击穿二极管', '测试整流器绝缘', '复装后空载调试', '带载运行8小时确认'] },
  'Y-LC-001': yellowAlertBase(exciterScenario, 'Y-LC-001', '励磁机定子绕组温度偏高', '励磁机系统'),
  'Y-LC-002': yellowAlertBase(exciterScenario, 'Y-LC-002', '励磁电流轻微波动', '励磁机系统'),
};

export function getDiagnosticScenario(alertId: string): DiagnosticScenario {
  return diagnosticScenarios[alertId] || lubeOilScenario;
}
