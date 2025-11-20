import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import type { Rule } from '../types';

interface StateDiagramProps {
    rules: Rule[];
    currentState: string;
}

interface Node {
    id: string;
    label: string;
    x: number;
    y: number;
}

interface Edge {
    id: string;
    source: string;
    target: string;
    label: string;
}

const DagreGraph: React.FC<{
    nodes: Node[];
    edges: Edge[];
    currentState: string;
}> = memo(({ nodes, edges, currentState }) => {

    return (
        <svg width="100%" height="100%" viewBox="0 0 300 250" preserveAspectRatio="xMidYMid meet">
            <defs>
                <marker
                    id="arrowhead"
                    viewBox="0 0 10 10"
                    refX="8" 
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
            </defs>

            {/* Edges */}
            {edges.map(edge => {
                 const sourceNode = nodes.find(n => n.id === edge.source)!;
                 const targetNode = nodes.find(n => n.id === edge.target)!;
                 if (!sourceNode || !targetNode) return null;

                 const dx = targetNode.x - sourceNode.x;
                 const dy = targetNode.y - sourceNode.y;
                 const dist = Math.sqrt(dx * dx + dy * dy);
                 const nx = dx / dist;
                 const ny = dy / dist;
                 const endX = targetNode.x - nx * 22;
                 const endY = targetNode.y - ny * 22;
 
                 const isSelfLoop = edge.source === edge.target;
                 const d = isSelfLoop ? `M ${sourceNode.x - 20} ${sourceNode.y - 10} A 20 20, 0, 1, 1, ${sourceNode.x} ${sourceNode.y - 22}` : `M ${sourceNode.x} ${sourceNode.y} L ${endX} ${endY}`;

                return (
                    <g key={edge.id}>
                        <path d={d} stroke="#64748b" strokeWidth="1.5" fill="none" markerEnd={isSelfLoop ? undefined : "url(#arrowhead)"} />
                        <text x={isSelfLoop ? sourceNode.x - 40 : (sourceNode.x + targetNode.x) / 2} y={isSelfLoop ? sourceNode.y - 40 : (sourceNode.y + targetNode.y) / 2} fill="#94a3b8" fontSize="10" textAnchor="middle">
                            {edge.label}
                        </text>
                    </g>
                );
            })}

            {/* Nodes */}
            {nodes.map(node => {
                const isActive = node.id === currentState;
                return (
                    <g key={node.id}>
                       <motion.circle
                           cx={node.x}
                           cy={node.y}
                           r={20}
                           fill={isActive ? "#0e7490" : "#1e293b"} 
                           stroke={isActive ? "#22d3ee" : "#475569"} 
                           strokeWidth={2}
                           animate={{ scale: isActive ? 1.1 : 1 }}
                           transition={{ duration: 0.3, type: "spring" }}
                       />
                        <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">
                            {node.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
});

export const StateDiagram: React.FC<StateDiagramProps> = ({ rules, currentState }) => {
    
    const { nodes, edges } = useMemo(() => {
        const stateNames = Array.from(new Set(rules.flatMap(r => [r.currentState, r.newState])));
        const nodes: Node[] = stateNames.map((name, i) => ({
            id: name,
            label: name,
            x: 150 + 100 * Math.cos(2 * Math.PI * i / stateNames.length),
            y: 125 + 100 * Math.sin(2 * Math.PI * i / stateNames.length),
        }));

        const edges: Edge[] = rules.map((rule, i) => ({
            id: `e${i}`,
            source: rule.currentState,
            target: rule.newState,
            label: `${rule.read} -> ${rule.write}, ${rule.move}`,
        }));
        return { nodes, edges };
    }, [rules]);

    if (nodes.length === 0) {
        return <div className="text-slate-500 text-sm">Sem regras para exibir o diagrama.</div>;
    }

    return <DagreGraph nodes={nodes} edges={edges} currentState={currentState} />;
};