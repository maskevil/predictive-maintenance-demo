import type { Node, Edge } from '@xyflow/react';
import type { ComponentType } from '../components/AssetTree';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

function cn(id: string, label: string, x: number, y: number, abnormal = false, type: string = 'component'): Node {
  return { id, position: { x, y }, type: 'custom', data: { label, abnormal, type } };
}

function ce(id: string, source: string, target: string, abnormal = false, animated = false, dashed = false): Edge {
  return {
    id, source, target, animated: animated || abnormal,
    style: abnormal
      ? { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '6 3' }
      : dashed
        ? { stroke: '#a78bfa', strokeWidth: 1, strokeDasharray: '4 2' }
        : { stroke: '#475569' },
  };
}

interface GraphBuilder {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
}

function createBuilder(): GraphBuilder {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  return {
    nodes, edges,
    addNode(n: Node) { nodes.push(n); },
    addEdge(e: Edge) { edges.push(e); },
  };
}

type AlertOverrides = Record<string, { abnormalNodes: string[]; abnormalEdges: string[] }>;

function buildDryGasSealGraph(): { graph: GraphData; overrides: AlertOverrides } {
  const g = createBuilder();
  g.addNode(cn('comp', '电驱压缩机', 330, 0));
  g.addNode(cn('dgs', '干气密封', 330, 70, true));
  g.addNode(cn('n2', '氮气缓冲罐', 130, 70));
  g.addNode(cn('valve', '供气调节阀', 230, 140));
  g.addNode(cn('seal', '密封端面', 430, 140, true));
  g.addNode(cn('rotor', '压缩机转子', 330, 220));
  g.addNode(cn('impeller', '压缩机叶轮', 450, 220));
  g.addNode(cn('s_leak1', '一级泄漏传感器', 580, 40, true, 'sensor'));
  g.addNode(cn('s_leak2', '二级泄漏传感器', 580, 110, false, 'sensor'));
  g.addNode(cn('s_press', '供气压力传感器', 580, 190, true, 'sensor'));
  g.addNode(cn('alarm', '⚠ 密封泄漏超标', 580, 290, true, 'alarm'));
  g.addNode(cn('plc', 'PLC联锁控制系统', 50, 380));
  g.addNode(cn('plc1', '联锁1: 泄漏>10→报警', 0, 460, true, 'plc'));
  g.addNode(cn('plc2', '联锁2: 压力<0.4→启备用气源', 220, 460, true, 'plc'));
  g.addNode(cn('plc3', '联锁3: 二级泄>5→停机', 440, 460, false, 'plc'));
  g.addNode(cn('act1', '→ 报警', 0, 540, true, 'action'));
  g.addNode(cn('act2', '→ 切换备用气源', 220, 540, true, 'action'));
  g.addNode(cn('act3', '→ 延时停机', 440, 540, false, 'action'));
  g.addNode(cn('s_temp', '供气温度传感器', 580, 260, false, 'sensor'));

  g.addEdge(ce('e1', 'comp', 'dgs'));
  g.addEdge(ce('e2', 'n2', 'valve'));
  g.addEdge(ce('e3', 'valve', 'dgs'));
  g.addEdge(ce('e4', 'dgs', 'seal', true));
  g.addEdge(ce('e5', 'seal', 'rotor'));
  g.addEdge(ce('e6', 'rotor', 'impeller'));
  g.addEdge(ce('s1', 'dgs', 's_leak1', true));
  g.addEdge(ce('s2', 'seal', 's_leak2'));
  g.addEdge(ce('s3', 'valve', 's_press', true));
  g.addEdge(ce('s4', 'dgs', 's_temp'));
  g.addEdge(ce('a1', 's_leak1', 'alarm', true, true));
  g.addEdge(ce('a2', 's_press', 'alarm', true, true));
  g.addEdge(ce('p0a', 's_leak1', 'plc', false, false, true));
  g.addEdge(ce('p0b', 's_press', 'plc', false, false, true));
  g.addEdge(ce('p0c', 's_leak2', 'plc', false, false, true));
  g.addEdge(ce('p1', 'plc', 'plc1', true, false, true));
  g.addEdge(ce('p2', 'plc', 'plc2', true, false, true));
  g.addEdge(ce('p3', 'plc', 'plc3', false, false, true));
  g.addEdge(ce('pa1', 'plc1', 'act1', true));
  g.addEdge(ce('pa2', 'plc2', 'act2', true));
  g.addEdge(ce('pa3', 'plc3', 'act3'));

  const overrides: AlertOverrides = {
    'R-DQ-001': { abnormalNodes: ['dgs', 'seal', 's_leak1', 's_leak2', 's_press', 'alarm', 'plc1', 'plc2', 'act1', 'act2'], abnormalEdges: ['e4', 's1', 's3', 'a1', 'a2', 'p1', 'p2', 'pa1', 'pa2'] },
    'R-DQ-002': { abnormalNodes: ['dgs', 's_press', 'valve', 'alarm', 'plc2', 'act2'], abnormalEdges: ['s3', 'a2', 'p2', 'pa2'] },
    'Y-DQ-001': { abnormalNodes: ['dgs', 's_leak1', 'plc1'], abnormalEdges: ['s1', 'p1'] },
    'Y-DQ-002': { abnormalNodes: ['dgs', 's_temp', 'plc2'], abnormalEdges: ['s4', 'p2'] },
  };

  return { graph: { nodes: g.nodes, edges: g.edges }, overrides };
}

function buildLubeOilGraph(): { graph: GraphData; overrides: AlertOverrides } {
  const g = createBuilder();
  g.addNode(cn('comp', '电驱压缩机', 330, 0));
  g.addNode(cn('lube', '润滑油系统', 330, 70, true));
  g.addNode(cn('bearing', '主轴承', 500, 70, true));
  g.addNode(cn('pump', '油泵', 150, 150));
  g.addNode(cn('filter', '双联过滤器', 330, 150, true));
  g.addNode(cn('tank', '油箱', 50, 220));
  g.addNode(cn('cooler', '空冷器', 550, 150));
  g.addNode(cn('gearbox', '齿轮箱', 620, 70));
  g.addNode(cn('s_temp', '温度传感器', 520, 230, true, 'sensor'));
  g.addNode(cn('s_vib', '振动传感器', 620, 230, true, 'sensor'));
  g.addNode(cn('s_diff', '差压传感器', 250, 230, true, 'sensor'));
  g.addNode(cn('alarm', '⚠ 滤芯堵塞告警', 480, 320, true, 'alarm'));
  g.addNode(cn('plc', 'PLC联锁控制系统', 20, 380));
  g.addNode(cn('plc1', '联锁1: 油压低→启事故泵', 0, 460, true, 'plc'));
  g.addNode(cn('plc2', '联锁2: 温度>80→降负荷', 200, 460, true, 'plc'));
  g.addNode(cn('plc3', '联锁3: 振动>1.0→停机', 400, 460, true, 'plc'));
  g.addNode(cn('plc4', '联锁4: 差压>80→切换过滤器', 600, 460, true, 'plc'));
  g.addNode(cn('plc5', '联锁5: 空冷器>45→启风机', 0, 530, false, 'plc'));
  g.addNode(cn('act2', '→ 降负荷运行', 200, 530, true, 'action'));
  g.addNode(cn('act3', '→ 延时30s停机', 400, 530, true, 'action'));
  g.addNode(cn('act4', '→ 切换备用过滤器', 600, 530, true, 'action'));

  g.addEdge(ce('e1', 'comp', 'lube'));
  g.addEdge(ce('e2', 'lube', 'bearing', true));
  g.addEdge(ce('e3', 'lube', 'pump'));
  g.addEdge(ce('e4', 'pump', 'filter'));
  g.addEdge(ce('e5', 'filter', 'bearing', true, true));
  g.addEdge(ce('e6', 'pump', 'tank'));
  g.addEdge(ce('e7', 'tank', 'pump'));
  g.addEdge(ce('e8', 'lube', 'cooler'));
  g.addEdge(ce('e9', 'cooler', 'bearing'));
  g.addEdge(ce('e10', 'bearing', 'gearbox'));
  g.addEdge(ce('s1', 'bearing', 's_temp', true));
  g.addEdge(ce('s2', 'bearing', 's_vib', true));
  g.addEdge(ce('s3', 'filter', 's_diff', true));
  g.addEdge(ce('a1', 's_temp', 'alarm', true, true));
  g.addEdge(ce('a2', 's_vib', 'alarm', true, true));
  g.addEdge(ce('a3', 's_diff', 'alarm', true, true));
  g.addEdge(ce('p0a', 'pump', 'plc', false, false, true));
  g.addEdge(ce('p0b', 's_temp', 'plc', false, false, true));
  g.addEdge(ce('p0c', 's_vib', 'plc', false, false, true));
  g.addEdge(ce('p0d', 's_diff', 'plc', false, false, true));
  g.addEdge(ce('p0e', 'cooler', 'plc', false, false, true));
  g.addEdge(ce('p1', 'plc', 'plc1', true, false, true));
  g.addEdge(ce('p2', 'plc', 'plc2', true, false, true));
  g.addEdge(ce('p3', 'plc', 'plc3', true, false, true));
  g.addEdge(ce('p4', 'plc', 'plc4', true, false, true));
  g.addEdge(ce('p5', 'plc', 'plc5', false, false, true));
  g.addEdge(ce('pa2', 'plc2', 'act2', true));
  g.addEdge(ce('pa3', 'plc3', 'act3', true));
  g.addEdge(ce('pa4', 'plc4', 'act4', true));

  const overrides: AlertOverrides = {
    'R-RH-001': { abnormalNodes: ['lube', 'bearing', 'filter', 's_temp', 's_vib', 's_diff', 'alarm', 'plc1', 'plc2', 'plc3', 'plc4', 'act2', 'act3', 'act4'], abnormalEdges: ['e2', 'e5', 's1', 's2', 's3', 'a1', 'a2', 'a3', 'p1', 'p2', 'p3', 'p4', 'pa2', 'pa3', 'pa4'] },
    'R-RH-002': { abnormalNodes: ['lube', 'pump', 'bearing', 's_temp', 'alarm', 'plc1', 'plc2', 'act2'], abnormalEdges: ['e2', 's1', 'a1', 'p1', 'p2', 'pa2'] },
    'Y-RH-001': { abnormalNodes: ['lube', 's_temp', 'plc2'], abnormalEdges: ['s1', 'p2'] },
    'Y-RH-002': { abnormalNodes: ['lube', 'filter', 's_diff', 'plc4'], abnormalEdges: ['e5', 's3', 'p4'] },
  };

  return { graph: { nodes: g.nodes, edges: g.edges }, overrides };
}

function buildVfdGraph(): { graph: GraphData; overrides: AlertOverrides } {
  const g = createBuilder();
  g.addNode(cn('comp', '电驱压缩机', 330, 0));
  g.addNode(cn('vfd', '变频器', 330, 70, true));
  g.addNode(cn('motor', '主电机', 500, 70));
  g.addNode(cn('grid', '电网进线', 80, 130));
  g.addNode(cn('rect', '整流单元', 200, 130));
  g.addNode(cn('dcbus', '直流母线', 330, 130, true));
  g.addNode(cn('inv', '逆变单元', 460, 130));
  g.addNode(cn('igbt', 'IGBT模块', 580, 130));
  g.addNode(cn('s_dc', '直流母线电压传感器', 330, 210, true, 'sensor'));
  g.addNode(cn('s_igbt', 'IGBT温度传感器', 580, 210, false, 'sensor'));
  g.addNode(cn('s_curr', '输出电流传感器', 460, 210, false, 'sensor'));
  g.addNode(cn('alarm', '⚠ 直流母线过压', 330, 290, true, 'alarm'));
  g.addNode(cn('plc', 'PLC联锁控制系统', 30, 360));
  g.addNode(cn('plc1', '联锁1: 母线>1150V→降功率', 0, 440, true, 'plc'));
  g.addNode(cn('plc2', '联锁2: IGBT>90°C→降频', 240, 440, false, 'plc'));
  g.addNode(cn('plc3', '联锁3: 电流>120%→停机', 480, 440, false, 'plc'));
  g.addNode(cn('act1', '→ 降功率运行', 0, 520, true, 'action'));
  g.addNode(cn('act2', '→ 降频运行', 240, 520, false, 'action'));
  g.addNode(cn('act3', '→ 延时停机', 480, 520, false, 'action'));

  g.addEdge(ce('e1', 'comp', 'vfd'));
  g.addEdge(ce('e2', 'grid', 'rect'));
  g.addEdge(ce('e3', 'rect', 'dcbus'));
  g.addEdge(ce('e4', 'dcbus', 'inv', true));
  g.addEdge(ce('e5', 'inv', 'igbt'));
  g.addEdge(ce('e6', 'igbt', 'motor'));
  g.addEdge(ce('e7', 'motor', 'comp'));
  g.addEdge(ce('s1', 'dcbus', 's_dc', true));
  g.addEdge(ce('s2', 'igbt', 's_igbt'));
  g.addEdge(ce('s3', 'inv', 's_curr'));
  g.addEdge(ce('a1', 's_dc', 'alarm', true, true));
  g.addEdge(ce('p0a', 's_dc', 'plc', false, false, true));
  g.addEdge(ce('p0b', 's_igbt', 'plc', false, false, true));
  g.addEdge(ce('p0c', 's_curr', 'plc', false, false, true));
  g.addEdge(ce('p1', 'plc', 'plc1', true, false, true));
  g.addEdge(ce('p2', 'plc', 'plc2', false, false, true));
  g.addEdge(ce('p3', 'plc', 'plc3', false, false, true));
  g.addEdge(ce('pa1', 'plc1', 'act1', true));
  g.addEdge(ce('pa2', 'plc2', 'act2'));
  g.addEdge(ce('pa3', 'plc3', 'act3'));

  const overrides: AlertOverrides = {
    'R-BP-001': { abnormalNodes: ['vfd', 'dcbus', 's_dc', 'alarm', 'plc1', 'act1'], abnormalEdges: ['e4', 's1', 'a1', 'p1', 'pa1'] },
    'R-BP-002': { abnormalNodes: ['vfd', 'igbt', 's_curr', 'alarm', 'plc3', 'act3'], abnormalEdges: ['e5', 's3', 'p3', 'pa3'] },
    'Y-BP-001': { abnormalNodes: ['vfd', 'igbt', 's_igbt', 'plc2'], abnormalEdges: ['s2', 'p2'] },
    'Y-BP-002': { abnormalNodes: ['vfd', 'inv', 's_curr', 'plc3'], abnormalEdges: ['s3', 'p3'] },
  };

  return { graph: { nodes: g.nodes, edges: g.edges }, overrides };
}

function buildCoolingGraph(): { graph: GraphData; overrides: AlertOverrides } {
  const g = createBuilder();
  g.addNode(cn('comp', '电驱压缩机', 330, 0));
  g.addNode(cn('cool', '水冷系统', 330, 60, true));
  g.addNode(cn('pump', '循环水泵', 200, 120, true));
  g.addNode(cn('tower', '冷却塔', 60, 180));
  g.addNode(cn('heater', '换热器', 330, 180));
  g.addNode(cn('lube', '润滑油系统', 500, 120, true));
  g.addNode(cn('mcc', 'MCC配电柜', 120, 30));
  g.addNode(cn('s_flow', '循环流量传感器', 60, 260, true, 'sensor'));
  g.addNode(cn('s_out', '出水温度传感器', 200, 260, true, 'sensor'));
  g.addNode(cn('s_curr', '泵电流传感器', 340, 260, true, 'sensor'));
  g.addNode(cn('alarm', '⚠ 循环泵停运', 200, 340, true, 'alarm'));
  g.addNode(cn('plc', 'PLC联锁控制系统', 30, 420));
  g.addNode(cn('plc1', '联锁1: 泵停运→启备用泵', 0, 500, true, 'plc'));
  g.addNode(cn('plc2', '联锁2: 出水>40→增风机', 240, 500, true, 'plc'));
  g.addNode(cn('plc3', '联锁3: 流量<30→停机', 480, 500, true, 'plc'));
  g.addNode(cn('act1', '→ 启动备用泵', 0, 570, true, 'action'));
  g.addNode(cn('act2', '→ 增加风机转速', 240, 570, true, 'action'));
  g.addNode(cn('act3', '→ 延时停机', 480, 570, false, 'action'));

  g.addEdge(ce('e1', 'comp', 'cool'));
  g.addEdge(ce('e2', 'cool', 'pump', true));
  g.addEdge(ce('e3', 'pump', 'tower'));
  g.addEdge(ce('e4', 'tower', 'pump'));
  g.addEdge(ce('e5', 'pump', 'heater', true));
  g.addEdge(ce('e6', 'heater', 'lube', true));
  g.addEdge(ce('e7', 'mcc', 'pump'));
  g.addEdge(ce('s1', 'pump', 's_flow', true));
  g.addEdge(ce('s2', 'heater', 's_out', true));
  g.addEdge(ce('s3', 'pump', 's_curr', true));
  g.addEdge(ce('a1', 's_flow', 'alarm', true, true));
  g.addEdge(ce('a2', 's_curr', 'alarm', true, true));
  g.addEdge(ce('a3', 's_out', 'alarm', true, true));
  g.addEdge(ce('p0a', 's_flow', 'plc', false, false, true));
  g.addEdge(ce('p0b', 's_out', 'plc', false, false, true));
  g.addEdge(ce('p0c', 's_curr', 'plc', false, false, true));
  g.addEdge(ce('p1', 'plc', 'plc1', true, false, true));
  g.addEdge(ce('p2', 'plc', 'plc2', true, false, true));
  g.addEdge(ce('p3', 'plc', 'plc3', true, false, true));
  g.addEdge(ce('pa1', 'plc1', 'act1', true));
  g.addEdge(ce('pa2', 'plc2', 'act2', true));
  g.addEdge(ce('pa3', 'plc3', 'act3'));

  const overrides: AlertOverrides = {
    'R-SL-001': { abnormalNodes: ['cool', 'pump', 'lube', 's_flow', 's_out', 'alarm', 'plc1', 'plc2', 'plc3', 'act1', 'act2'], abnormalEdges: ['e2', 'e5', 'e6', 's1', 's2', 'a1', 'a3', 'p1', 'p2', 'p3', 'pa1', 'pa2'] },
    'R-SL-002': { abnormalNodes: ['cool', 'pump', 'lube', 's_flow', 's_curr', 's_out', 'alarm', 'plc1', 'plc2', 'plc3', 'act1', 'act2'], abnormalEdges: ['e2', 'e5', 'e6', 's1', 's2', 's3', 'a1', 'a2', 'a3', 'p1', 'p2', 'p3', 'pa1', 'pa2'] },
    'Y-SL-001': { abnormalNodes: ['cool', 'heater', 's_out', 'plc2'], abnormalEdges: ['s2', 'p2'] },
    'Y-SL-002': { abnormalNodes: ['cool', 'pump', 's_flow', 'plc3'], abnormalEdges: ['s1', 'p3'] },
  };

  return { graph: { nodes: g.nodes, edges: g.edges }, overrides };
}

function buildExciterGraph(): { graph: GraphData; overrides: AlertOverrides } {
  const g = createBuilder();
  g.addNode(cn('comp', '电驱压缩机', 330, 0));
  g.addNode(cn('exc', '励磁机系统', 280, 60, true));
  g.addNode(cn('avr', 'AVR励磁调节器', 450, 60, true));
  g.addNode(cn('traf', '励磁变压器', 100, 130));
  g.addNode(cn('wind', '励磁绕组', 280, 130, true));
  g.addNode(cn('rect', '旋转整流器', 450, 130));
  g.addNode(cn('rotor', '主电机转子', 280, 210, true));
  g.addNode(cn('s_curr', '励磁电流传感器', 80, 210, true, 'sensor'));
  g.addNode(cn('s_avr', 'AVR输出电压传感器', 180, 290, true, 'sensor'));
  g.addNode(cn('s_pf', '功率因数传感器', 280, 290, true, 'sensor'));
  g.addNode(cn('alarm', '⚠ 失磁保护动作', 180, 370, true, 'alarm'));
  g.addNode(cn('plc', 'PLC联锁控制系统', 40, 450));
  g.addNode(cn('plc1', '联锁1: 电流<50A→失磁停机', 0, 530, true, 'plc'));
  g.addNode(cn('plc2', '联锁2: 定子>105→降负荷', 240, 530, false, 'plc'));
  g.addNode(cn('plc3', '联锁3: 功率因数<0.8→报警', 480, 530, true, 'plc'));
  g.addNode(cn('act1', '→ 紧急停机保护', 0, 600, true, 'action'));
  g.addNode(cn('act2', '→ 降负荷运行', 240, 600, false, 'action'));
  g.addNode(cn('act3', '→ 报警提示', 480, 600, true, 'action'));

  g.addEdge(ce('e1', 'comp', 'exc'));
  g.addEdge(ce('e2', 'traf', 'avr'));
  g.addEdge(ce('e3', 'avr', 'wind', true));
  g.addEdge(ce('e4', 'wind', 'rect'));
  g.addEdge(ce('e5', 'rect', 'rotor'));
  g.addEdge(ce('e6', 'rotor', 'comp'));
  g.addEdge(ce('s1', 'wind', 's_curr', true));
  g.addEdge(ce('s2', 'avr', 's_avr', true));
  g.addEdge(ce('s3', 'rotor', 's_pf', true));
  g.addEdge(ce('a1', 's_curr', 'alarm', true, true));
  g.addEdge(ce('a2', 's_avr', 'alarm', true, true));
  g.addEdge(ce('a3', 's_pf', 'alarm', true, true));
  g.addEdge(ce('p0a', 's_curr', 'plc', false, false, true));
  g.addEdge(ce('p0b', 's_avr', 'plc', false, false, true));
  g.addEdge(ce('p0c', 's_pf', 'plc', false, false, true));
  g.addEdge(ce('p1', 'plc', 'plc1', true, false, true));
  g.addEdge(ce('p2', 'plc', 'plc2', false, false, true));
  g.addEdge(ce('p3', 'plc', 'plc3', true, false, true));
  g.addEdge(ce('pa1', 'plc1', 'act1', true));
  g.addEdge(ce('pa2', 'plc2', 'act2'));
  g.addEdge(ce('pa3', 'plc3', 'act3', true));

  const overrides: AlertOverrides = {
    'R-LC-001': { abnormalNodes: ['exc', 'avr', 'wind', 'rotor', 's_curr', 's_avr', 's_pf', 'alarm', 'plc1', 'plc3', 'act1', 'act3'], abnormalEdges: ['e3', 's1', 's2', 's3', 'a1', 'a2', 'a3', 'p1', 'p3', 'pa1', 'pa3'] },
    'R-LC-002': { abnormalNodes: ['exc', 'rect', 's_curr', 'alarm', 'plc1', 'act1'], abnormalEdges: ['e4', 's1', 'a1', 'p1', 'pa1'] },
    'Y-LC-001': { abnormalNodes: ['exc', 'wind', 'plc2'], abnormalEdges: ['p2'] },
    'Y-LC-002': { abnormalNodes: ['exc', 'avr', 's_curr', 's_avr', 'plc1'], abnormalEdges: ['s1', 's2', 'p1'] },
  };

  return { graph: { nodes: g.nodes, edges: g.edges }, overrides };
}

const componentBuilders: Record<ComponentType, () => { graph: GraphData; overrides: AlertOverrides }> = {
  '干气密封': buildDryGasSealGraph,
  '润滑油': buildLubeOilGraph,
  '变频器': buildVfdGraph,
  '水冷系统': buildCoolingGraph,
  '励磁机系统': buildExciterGraph,
};

export function getComponentGraph(component: ComponentType, alertId?: string): GraphData {
  const builder = componentBuilders[component] || componentBuilders['润滑油'];
  const { graph, overrides } = builder();

  if (!alertId || !overrides[alertId]) return graph;

  const ab = overrides[alertId];
  const abNodeSet = new Set(ab.abnormalNodes);
  const abEdgeSet = new Set(ab.abnormalEdges);

  const nodes = graph.nodes.map((n) => ({
    ...n,
    data: { ...n.data, abnormal: abNodeSet.has(n.id) },
  }));
  const edges = graph.edges.map((e) => ({
    ...e,
    style: abEdgeSet.has(e.id)
      ? { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '6 3' }
      : e.style,
    animated: abEdgeSet.has(e.id) || e.animated,
  }));

  return { nodes, edges };
}
