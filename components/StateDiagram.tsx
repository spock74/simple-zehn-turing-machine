import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Rule } from '../types';
import { HALT_STATE, INITIAL_STATE, BLANK_SYMBOL } from '../constants';

interface StateDiagramProps {
    rules: Rule[];
    currentState: string;
}

interface Node {
    id: string;
    x: number;
    y: number;
}

interface Edge {
    id: string;
    source: string;
    target: string;
    label: string;
    isSelfLoop: boolean;
}

const formatSymbol = (s: string) => (s === BLANK_SYMBOL ? '␣' : s);

export const StateDiagram: React.FC<StateDiagramProps> = ({ rules, currentState }) => {
    const { nodes, edges } = useMemo(() => {
        const stateSet = new Set<string>([INITIAL_STATE, HALT_STATE]);
        rules.forEach(rule => {
            stateSet.add(rule.currentState);
            stateSet.add(rule.newState);
        });

        const sortedStates = Array.from(stateSet).sort((a, b) => {
             if (a === INITIAL_STATE) return -1;
             if (b === INITIAL_STATE) return 1;
             if (a === HALT_STATE) return 1;
             if (b === HALT_STATE) return -1;
             return a.localeCompare(b, undefined, { numeric: true });
        });
        
        const nodeMap = new Map<string, Node>();
        const radius = 100;
        const width = 280;
        const height = 280;
        const centerX = width / 2;
        const centerY = height / 2;

        sortedStates.forEach((stateId, i) => {
            const angle = (i / sortedStates.length) * 2 * Math.PI - Math.PI / 2;
            nodeMap.set(stateId, {
                id: stateId,
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            });
        });

        const edgeMap = new Map<string, Edge[]>();
        rules.forEach(rule => {
            const key = `${rule.currentState}->${rule.newState}`;
            if (!edgeMap.has(key)) {
                edgeMap.set(key, []);
            }
            edgeMap.get(key)!.push({
                id: rule.id,
                source: rule.currentState,
                target: rule.newState,
                label: `${formatSymbol(rule.readSymbol)}→${formatSymbol(rule.writeSymbol)}, ${rule.moveDirection}`,
                isSelfLoop: rule.currentState === rule.newState,
            });
        });

        return { nodes: Array.from(nodeMap.values()), edges: Array.from(edgeMap.values()).flat() };
    }, [rules]);

    const nodePositions = useMemo(() => {
        const map = new Map<string, { x: number; y: number }>();
        nodes.forEach(node => map.set(node.id, { x: node.x, y: node.y }));
        return map;
    }, [nodes]);
    
    if (nodes.length === 0) {
        return <div className="text-slate-500">Adicione regras para ver o diagrama.</div>;
    }

    return (
        <svg viewBox="0 0 280 280" className="w-full h-full">
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
            </defs>
            <g>
                {/* Edges */}
                {edges.map((edge, index) => {
                    const sourcePos = nodePositions.get(edge.source);
                    const targetPos = nodePositions.get(edge.target);
                    if (!sourcePos || !targetPos) return null;

                    if (edge.isSelfLoop) {
                        const { x, y } = sourcePos;
                        const loopRadius = 20;
                        const pathData = `M ${x - 12} ${y - 12} A ${loopRadius} ${loopRadius} 0 1 1 ${x + 12} ${y - 12}`;
                        return (
                            <g key={edge.id}>
                                <path d={pathData} stroke="#475569" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
                                <text x={x} y={y - 35} textAnchor="middle" fill="#94a3b8" fontSize="8">{edge.label}</text>
                            </g>
                        );
                    }

                    const dx = targetPos.x - sourcePos.x;
                    const dy = targetPos.y - sourcePos.y;
                    const angle = Math.atan2(dy, dx);
                    const padding = 22; // Node radius + padding

                    const startX = sourcePos.x + padding * Math.cos(angle);
                    const startY = sourcePos.y + padding * Math.sin(angle);
                    const endX = targetPos.x - padding * Math.cos(angle);
                    const endY = targetPos.y - padding * Math.sin(angle);
                    
                    const midX = (startX + endX) / 2;
                    const midY = (startY + endY) / 2;

                    // Bend the line
                    const bendFactor = 0.2;
                    const controlX = midX - dy * bendFactor;
                    const controlY = midY + dx * bendFactor;

                    return (
                        <g key={edge.id}>
                            <path d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`} stroke="#475569" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
                             <text x={controlX} y={controlY - 5} textAnchor="middle" fill="#94a3b8" fontSize="8">{edge.label}</text>
                        </g>
                    );
                })}
                {/* Nodes */}
                {nodes.map(node => {
                    const isActive = node.id === currentState;
                    const isHalt = node.id === HALT_STATE;
                    return (
                        <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                            <motion.circle
                                r={isHalt ? 18 : 20}
                                stroke={isActive ? '#22d3ee' : '#475569'}
                                strokeWidth={isActive ? 2.5 : 1.5}
                                fill="#1e293b"
                                animate={{ scale: isActive ? 1.1 : 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            />
                            {isHalt && <circle r="14" stroke="#475569" strokeWidth="1.5" fill="none" />}
                            <text textAnchor="middle" dy="4" fill={isActive ? '#67e8f9' : '#cbd5e1'} fontSize="10" fontWeight="bold">
                                {node.id}
                            </text>
                            {isActive && (
                                <motion.circle
                                    r={20}
                                    fill="none"
                                    stroke="#22d3ee"
                                    strokeWidth="3"
                                    initial={{ opacity: 0.5, scale: 1.1 }}
                                    animate={{ opacity: [0.5, 0, 0.5], scale: [1.1, 1.3, 1.1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            )}
                        </g>
                    );
                })}
            </g>
        </svg>
    );
};
