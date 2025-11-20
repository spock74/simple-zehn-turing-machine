import React, { useRef, useEffect } from 'react';
import type { HistoryEntry, Rule } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import { BLANK_SYMBOL } from '../constants';
import { Icons } from './Icons';

interface HistoryLogProps {
    history: HistoryEntry[];
    rules: Rule[];
}

const HistoryItem: React.FC<{ entry: HistoryEntry; rule: Rule | undefined }> = ({ entry, rule }) => {
    const { step, state, read, position } = entry;
    const ruleText = rule
        ? `(${rule.currentState}, ${rule.read}) -> (${rule.newState}, ${rule.write}, ${rule.move})`
        : 'N/A';

    const readSymbol = read === ' ' ? BLANK_SYMBOL : read;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 p-1.5 bg-slate-800/60 rounded-md text-xs sm:text-sm"
        >
            <span className="font-mono font-bold text-cyan-400 w-6 sm:w-8 text-center">{step}</span>
            <div className="flex-1 flex items-center justify-between gap-2 border-l border-r border-slate-700 px-2">
                <span className="flex-1 text-center">{state}</span>
                <Icons.ChevronRight className="w-4 h-4 text-slate-600"/>
                <span className="flex-1 text-center font-mono font-bold bg-slate-700/50 rounded-sm px-1">'{readSymbol}'</span>
                <Icons.ChevronRight className="w-4 h-4 text-slate-600"/>
                <span className="flex-1 text-center">@{position}</span>
            </div>
            <span className="flex-grow text-left text-slate-500 font-mono hidden md:block">{ruleText}</span>
        </motion.div>
    );
};

export const HistoryLog: React.FC<HistoryLogProps> = React.memo(({ history, rules }) => {
    const scrollableContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollableContainerRef.current) {
            scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
        }
    }, [history.length]);

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg w-full h-full flex flex-col p-2 sm:p-4">
            <h3 className="font-bold text-base sm:text-lg text-slate-200 mb-2 sm:mb-3">Histórico de Execução</h3>
            <div ref={scrollableContainerRef} className="flex-grow overflow-y-auto pr-1 sm:pr-2">
                <AnimatePresence>
                    {history.map((entry) => {
                        const appliedRule = rules.find(r => r.id === entry.ruleId);
                        return <HistoryItem key={entry.step} entry={entry} rule={appliedRule} />;
                    })}
                </AnimatePresence>
                 {history.length === 0 && (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        Aguardando execução...
                    </div>
                )}
            </div>
        </div>
    );
});