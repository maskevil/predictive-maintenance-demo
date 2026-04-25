import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch } from 'lucide-react';
import type { ComponentType } from './AssetTree';
import { getComponentGraph } from '../data/graphData';

interface KnowledgeGraphProps {
  componentName?: string;
  compact?: boolean;
  component?: ComponentType;
  alertId?: string;
}

interface GraphNodeData extends Record<string, unknown> {
  label: string;
  abnormal: boolean;
  type: 'component' | 'sensor' | 'system' | 'alarm' | 'plc' | 'action';
}

function CustomNode({ data }: NodeProps) {
  const d = data as unknown as GraphNodeData;
  const isAbnormal = d.abnormal;
  const isPlc = d.type === 'plc';
  const isAction = d.type === 'action';

  const baseClasses = 'px-2 py-1 rounded-lg text-[10px] font-medium border shadow-lg backdrop-blur-sm whitespace-nowrap';
  let styleClasses: string;
  if (isAbnormal) {
    styleClasses = 'bg-red-500/20 border-red-400 text-red-300 shadow-red-500/10 animate-pulse';
  } else if (isPlc) {
    styleClasses = 'bg-amber-500/10 border-amber-500/40 text-amber-300';
  } else if (isAction) {
    styleClasses = 'bg-purple-500/10 border-purple-500/30 text-purple-300';
  } else {
    styleClasses = 'bg-slate-800 border-slate-600 text-slate-300';
  }

  return (
    <div className={`${baseClasses} ${styleClasses}`}>
      <Handle type="target" position={Position.Top} className="!bg-slate-500" />
      <span>{d.label}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-500" />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

export function KnowledgeGraph({ componentName, compact = false, component, alertId }: KnowledgeGraphProps) {
  const graphData = useMemo(() => getComponentGraph(component || '润滑油', alertId), [component, alertId]);

  const [nodes, , onNodesChange] = useNodesState(graphData.nodes);
  const [edges, , onEdgesChange] = useEdgesState(graphData.edges);

  const defaultViewport = useMemo(() => compact
    ? { x: 30, y: 20, zoom: 0.48 }
    : { x: 50, y: 10, zoom: 0.60 }
  , [compact]);

  const header = !compact && (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50">
      <div className="flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-slate-200">
          本体知识图谱{componentName ? ` — ${componentName}` : ''}
        </h3>
      </div>
      <div className="flex items-center gap-3 text-[10px]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-slate-400">异常</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-slate-400">PLC联锁</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span className="text-slate-400">正常</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {header}
      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          defaultViewport={defaultViewport}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1e293b" gap={20} />
          {!compact && (
            <Controls
              className="[&>button]:!bg-slate-700 [&>button]:!border-slate-600 [&>button]:!fill-slate-300 [&>button:hover]:!bg-slate-600 [&>button>svg]:!fill-slate-300"
            />
          )}
        </ReactFlow>
      </div>
    </div>
  );
}
