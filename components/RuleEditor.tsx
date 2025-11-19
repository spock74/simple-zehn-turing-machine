import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import type { Rule } from '../types';
import { Direction } from '../types';
import { BLANK_SYMBOL } from '../constants';
import { Icons } from './Icons';

interface RuleEditorProps {
    rules: Rule[];
    setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
    lastUsedRuleId: string | null;
    stepCount: number;
}

const ErrorTooltip: React.FC<{ text: string }> = ({ text }) => (
    <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-slate-900 text-white text-xs rounded py-1 px-2 shadow-lg z-50 border border-slate-600"
    >
        {text}
    </motion.div>
);

const SymbolDisplay: React.FC<{ symbol: string }> = ({ symbol }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    
    const symbolToShow = symbol === BLANK_SYMBOL ? '␣' : symbol;
    
    const displaySymbol = symbolToShow.length > 1 ? `${symbolToShow.charAt(0)}…` : symbolToShow;
    const needsTooltip = symbolToShow.length > 1;

    return (
        <div 
            className="relative text-center text-cyan-400"
            onMouseEnter={() => needsTooltip && setShowTooltip(true)}
            onMouseLeave={() => needsTooltip && setShowTooltip(false)}
        >
            {displaySymbol}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-slate-900 text-white text-xs rounded py-1 px-2 shadow-lg z-50 border border-slate-600"
                    >
                        {symbolToShow}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const RuleRow: React.FC<{ 
    rule: Rule, 
    onRemove: (id: string) => void,
    isActive: boolean,
    stepCount: number 
}> = ({ rule, onRemove, isActive, stepCount }) => {
    const [isGlowing, setIsGlowing] = useState(false);
    const [showError, setShowError] = useState(false);
    const isInvalid = rule.isValid === false;

    useEffect(() => {
        if (isActive) {
            setIsGlowing(true);
            const timer = setTimeout(() => {
                setIsGlowing(false);
            }, 600); 
            return () => clearTimeout(timer);
        }
    }, [isActive, stepCount]);
    
    const borderClass = isInvalid
        ? 'border-red-500/80'
        : isGlowing
        ? 'border-cyan-400 shadow-lg shadow-cyan-500/30'
        : 'border-transparent';

    return (
        <motion.div 
          layout
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
          className={`grid grid-cols-[1fr_1fr_auto_1fr_1fr_1fr_auto_auto] items-center gap-2 p-2 rounded border-2 transition-all duration-500 ease-out ${borderClass} ${isInvalid ? 'bg-red-900/20' : 'bg-slate-800/50'}`}
        >
            <div className="text-center text-slate-300">{rule.currentState}</div>
            <SymbolDisplay symbol={rule.readSymbol} />
            <Icons.ArrowRight className="w-4 h-4 text-slate-500" />
            <div className="text-center text-slate-300">{rule.newState}</div>
            <SymbolDisplay symbol={rule.writeSymbol} />
            <div className="text-center text-yellow-400">{rule.moveDirection}</div>
            <button onClick={() => onRemove(rule.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                <Icons.Trash className="w-4 h-4" />
            </button>
            <div className="relative h-4 w-4 flex items-center justify-center"
                 onMouseEnter={() => isInvalid && setShowError(true)}
                 onMouseLeave={() => isInvalid && setShowError(false)}>
                {isInvalid && <Icons.AlertTriangle className="w-4 h-4 text-red-400" />}
                <AnimatePresence>
                    {showError && rule.error && <ErrorTooltip text={rule.error} />}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export const RuleEditor: React.FC<RuleEditorProps> = ({ rules, setRules, lastUsedRuleId, stepCount }) => {
    const [newRule, setNewRule] = useState({
        currentState: '', readSymbol: '', newState: '', writeSymbol: '', moveDirection: Direction.Right
    });

    const handleAddRule = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRule.currentState && newRule.readSymbol && newRule.newState && newRule.writeSymbol) {
            setRules(prev => [...prev, { ...newRule, id: Date.now().toString() }]);
            setNewRule({ currentState: '', readSymbol: '', newState: '', writeSymbol: '', moveDirection: Direction.Right });
        }
    };

    const handleRemoveRule = (id: string) => {
        setRules(prev => prev.filter(rule => rule.id !== id));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewRule(prev => ({ ...prev, [name]: value }));
    };

    const InputField: React.FC<{name: string, value: string, placeholder: string}> = ({ name, value, placeholder }) => (
         <input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            maxLength={10}
            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-cyan-500 focus:outline-none"
        />
    )
    
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-2xl shadow-cyan-500/10 h-full">
            <h2 className="text-xl font-bold font-orbitron text-cyan-400 mb-4 [text-shadow:_0_0_5px_theme(colors.cyan.400)]">Programa (Regras)</h2>

            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_auto_1fr_1fr_1fr_auto_auto] items-center gap-2 text-xs text-slate-400 mb-2 px-2 font-bold">
                <span>Estado</span>
                <span>Lê</span>
                <span></span>
                <span>Novo E.</span>
                <span>Escreve</span>
                <span>Move</span>
                <span></span>
                <span></span>
            </div>
            
            <div className="max-h-[300px] lg:max-h-[45vh] overflow-y-auto pr-2 flex flex-col gap-2 mb-4 no-scrollbar">
                <AnimatePresence>
                   {(rules || []).map(rule => 
                        <RuleRow 
                            key={rule.id} 
                            rule={rule} 
                            onRemove={handleRemoveRule}
                            isActive={rule.id === lastUsedRuleId}
                            stepCount={stepCount}
                        />
                    )}
                </AnimatePresence>
            </div>

            <form onSubmit={handleAddRule} className="grid grid-cols-[1fr_1fr_auto_1fr_1fr_1fr_auto_auto] items-center gap-2 p-2 border-t border-slate-700">
                <InputField name="currentState" value={newRule.currentState} placeholder="q0" />
                <InputField name="readSymbol" value={newRule.readSymbol} placeholder={BLANK_SYMBOL} />
                <Icons.ArrowRight className="w-4 h-4 text-slate-500" />
                <InputField name="newState" value={newRule.newState} placeholder="q1" />
                <InputField name="writeSymbol" value={newRule.writeSymbol} placeholder="1" />
                <select name="moveDirection" value={newRule.moveDirection} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-cyan-500 focus:outline-none">
                    <option value={Direction.Right}>D</option>
                    <option value={Direction.Left}>E</option>
                </select>
                <button type="submit" className="text-slate-400 hover:text-green-400 transition-colors">
                    <Icons.PlusCircle className="w-5 h-5" />
                </button>
                 <div />
            </form>
        </div>
    );
};