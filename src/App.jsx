import React, { useCallback } from 'react';
import ReactFlow, { 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import './styles.css';

const NODE_TYPES = {
  agent: { background: '#F4F3FF', color: '#6B46C1' },
  think: { 
    background: '#FFF',
    color: '#1A1A1A',
    iconBg: '#F4F3FF',
    iconColor: '#6B46C1',
    labelBg: '#F4F3FF'
  },
  skill: { 
    background: '#FFF',
    color: '#1A1A1A',
    iconBg: '#FFF3E8',
    iconColor: '#F97316',
    labelBg: '#FEF6EE'
  },
  search: {
    background: '#FFF',
    color: '#1A1A1A',
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    labelBg: '#F0FDF4'
  }
};

const AgentNode = ({ data }) => (
  <div style={{
    padding: '8px 16px',
    borderRadius: '50px',
    background: NODE_TYPES.agent.background,
    color: NODE_TYPES.agent.color,
    minWidth: '250px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid rgba(107, 70, 193, 0.2)'
  }}>
    <Handle type="source" position={Position.Bottom} style={{ background: '#6B46C1', width: '8px', height: '8px', bottom: '-4px' }} />
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#6B46C1"/>
    </svg>
    <div style={{ fontWeight: '500', fontSize: '14px' }}>{data.label}</div>
  </div>
);

const BaseNode = ({ type, data, color }) => (
  <div style={{ position: 'relative', width: '100%' }}>
    <Handle 
      type="target" 
      position={Position.Top} 
      style={{ background: color, width: '8px', height: '8px', top: '-4px' }} 
    />
    
    <div style={{
      display: 'inline-block',
      padding: '4px 12px',
      background: NODE_TYPES[type].labelBg,
      color: NODE_TYPES[type].iconColor,
      borderRadius: '16px',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px'
    }}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </div>

    <div style={{
      background: NODE_TYPES[type].background,
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #E5E7EB',
      minWidth: '300px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div style={{
          background: NODE_TYPES[type].iconBg,
          borderRadius: '8px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          {type === 'think' ? '🧠' : null}
          {type === 'search' ? '🔍' : null}
          {type === 'skill' ? '⚡️' : null}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: '500',
          color: NODE_TYPES[type].color
        }}>
          {data.label}
        </div>
      </div>

      {data.description && (
        <div style={{
          color: '#6B7280',
          fontSize: '14px',
          lineHeight: '1.5',
          background: '#F9FAFB',
          padding: '12px',
          borderRadius: '6px'
        }}>
          {data.description}
        </div>
      )}
    </div>
    
    <Handle 
      type="source" 
      position={Position.Bottom} 
      style={{ background: color, width: '8px', height: '8px', bottom: '-4px' }} 
    />
  </div>
);

const ThinkNode = (props) => <BaseNode {...props} type="think" color="#6B46C1" />;
const SkillNode = (props) => <BaseNode {...props} type="skill" color="#F97316" />;
const SearchNode = (props) => <BaseNode {...props} type="search" color="#16A34A" />;

const initialNodes = [
  {
    id: 'greeting',
    position: { x: 400, y: 0 },
    type: 'agent',
    data: { 
      label: 'Customer Support Agent'
    }
  },
  {
    id: 'language',
    position: { x: 400, y: 200 },
    type: 'think',
    data: { 
      label: 'Language Detection',
      description: 'Detect user language and adapt responses accordingly'
    }
  },
  {
    id: 'issue-clear',
    position: { x: 400, y: 450 },
    type: 'think',
    data: { 
      label: 'Issue Clear?',
      description: 'Analyze if the query is clear enough'
    }
  },
  {
    id: 'follow-up',
    position: { x: 900, y: 450 },
    type: 'think',
    data: { 
      label: 'Gather Information',
      description: 'Ask about expected behavior, error messages, steps to reproduce, screenshots'
    }
  },
  {
    id: 'search',
    position: { x: 400, y: 700 },
    type: 'search',
    data: { 
      label: 'Search Knowledge Base',
      description: 'Search docs, tickets, QnA pairs, and Slack channels'
    }
  },
  {
    id: 'solution-found',
    position: { x: 400, y: 950 },
    type: 'think',
    data: { 
      label: 'Solution Available?',
      description: 'Check if a solution exists in search results'
    }
  },
  {
    id: 'issue-type',
    position: { x: 900, y: 950 },
    type: 'think',
    data: { 
      label: 'Determine Issue Type',
      description: 'Is it a bug, feature request, or needs human?'
    }
  },
  {
    id: 'create-ticket',
    position: { x: 400, y: 1200 },
    type: 'skill',
    data: { 
      label: 'Create Ticket',
      description: 'For bugs and feature requests'
    }
  },
  {
    id: 'update-conversation',
    position: { x: 900, y: 1200 },
    type: 'skill',
    data: { 
      label: 'Update Conversation',
      description: 'Escalate to human agent'
    }
  },
  {
    id: 'provide-solution',
    position: { x: -100, y: 1200 },
    type: 'skill',
    data: { 
      label: 'Provide Solution',
      description: 'Share found solution in user\'s language'
    }
  }
];

const initialEdges = [
  { id: 'e-greeting-lang', source: 'greeting', target: 'language' },
  { id: 'e-lang-issue', source: 'language', target: 'issue-clear' },
  { id: 'e-issue-followup', source: 'issue-clear', target: 'follow-up', label: 'No' },
  { id: 'e-followup-issue', source: 'follow-up', target: 'issue-clear', type: 'step' },
  { id: 'e-issue-search', source: 'issue-clear', target: 'search', label: 'Yes' },
  { id: 'e-search-solution', source: 'search', target: 'solution-found' },
  { id: 'e-solution-type', source: 'solution-found', target: 'issue-type', label: 'No' },
  { id: 'e-solution-provide', source: 'solution-found', target: 'provide-solution', label: 'Yes' },
  { id: 'e-type-ticket', source: 'issue-type', target: 'create-ticket', label: 'Bug/Feature' },
  { id: 'e-type-update', source: 'issue-type', target: 'update-conversation', label: 'Need Human' }
].map(edge => ({
  ...edge,
  type: edge.type || 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { stroke: '#333' },
  animated: true,
  labelBgStyle: { fill: 'white', fillOpacity: 0.9 },
  labelBgPadding: [8, 4],
  labelStyle: { fill: '#333', fontWeight: 700 },
  className: 'animated-edge'
}));

const nodeTypes = {
  think: ThinkNode,
  skill: SkillNode,
  search: SearchNode,
  agent: AgentNode
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      className: 'animated-edge',
      style: { stroke: '#333' },
      markerEnd: { type: MarkerType.ArrowClosed }
    }, eds));
  }, [setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultZoom={0.5}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
