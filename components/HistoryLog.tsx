import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import type { HistoryEntry, Rule } from '../types';
import { BLANK_SYMBOL } from '../constants';
import { Icons } from './Icons';

interface HistoryLogProps {
    history: HistoryEntry[];
    rules: Rule[];
}

const Symbol: React.FC<{ symbol: string }> = ({ symbol }) => (
    <span className="font-mono font-bold text-center bg-slate-700/50 text-cyan-300 rounded px-2 py-0.5 text-sm">
        {symbol === BLANK_SYMBOL ? '␣' : symbol}
    </span>
);

const HistoryRow: React.FC<{ entry: HistoryEntry; rule: Rule | undefined }> = ({ entry, rule }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex items-center gap-3 text-sm p-1.5 rounded-md hover:bg-slate-700/40"
        >
            <span className="font-mono text-slate-500 w-6 text-right">{entry.step}</span>
            <div className="flex-1 flex items-center justify-between gap-2 border-l border-slate-700 pl-3">
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">Em</span>
                    <span className="font-bold text-slate-200">{entry.state}</span>
                    <span className="text-slate-400">leu</span>
                    <Symbol symbol={entry.readSymbol} />
                </div>
                {rule ? (
                    <div className="flex items-center gap-2 text-slate-400">
                        <Icons.ArrowRight className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400">Escr.</span>
                        <Symbol symbol={rule.writeSymbol} />
                        <span className="text-slate-400">Mover</span>
                        <span className="font-bold text-yellow-400">{rule.moveDirection}</span>
                        <span className="text-slate-400">ir para</span>
                        <span className="font-bold text-slate-200">{rule.newState}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-red-400">
                        <Icons.ArrowRight className="w-4 h-4 text-slate-500" />
                        <span>HALT</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};


export const HistoryLog: React.FC<HistoryLogProps> = ({ history, rules }) => {
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);
    
    const findRuleById = (id: string | null) => {
        if (!id) return undefined;
        return rules.find(r => r.id === id);
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-2xl shadow-cyan-500/10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-3">
                <Icons.FileText className="w-5 h-5 text-cyan-400"/>
                <h2 className="text-xl font-bold font-orbitron text-cyan-400 [text-shadow:_0_0_5px_theme(colors.cyan.400)]">
                    Histórico de Execução
                </h2>
            </div>
            
            <div className="flex-grow min-h-0 overflow-y-auto pr-2 no-scrollbar">
                 <AnimatePresence>
                    {history.length === 0 ? (
                         <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex items-center justify-center text-slate-500"
                        >
                            Pressione 'Executar' ou 'Passo' para iniciar...
                         </motion.div>
                    ) : (
                       history.map(entry => (
                            <HistoryRow 
                                key={entry.step} 
                                entry={entry} 
                                rule={findRuleById(entry.usedRuleId)} 
                            />
                        ))
                    )}
                 </AnimatePresence>
                 <div ref={logEndRef} />
            </div>
        </div>
    );
};