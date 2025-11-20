import React from 'react';
import { motion } from "framer-motion";
import { Icons } from './Icons';
import type { ValidatedRule, Rule } from '../types';

interface RuleEditorProps {
    rules: ValidatedRule[];
    setRules: (rules: Rule[]) => void;
    lastUsedRuleId: string | null;
    stepCount: number;
}

const RuleRow: React.FC<{
    rule: ValidatedRule;
    onRuleChange: (id: string, field: keyof Rule, value: string) => void;
    onDeleteRule: (id: string) => void;
    isHighlighted: boolean;
    isError: boolean;
}> = ({ rule, onRuleChange, onDeleteRule, isHighlighted, isError }) => {

    const highlightClass = isHighlighted ? 'bg-cyan-500/30' : 'bg-slate-800/50';
    const errorClass = isError ? '!border-red-500/50' : 'border-slate-700';

    const inputClasses = "w-full bg-transparent text-center font-mono text-sm sm:text-base focus:outline-none focus:bg-slate-700/50 rounded-md p-1 uppercase";

    return (
        <motion.div 
            className={`grid grid-cols-[repeat(2,1fr)_min-content_repeat(3,1fr)_auto] gap-1 sm:gap-2 items-center p-1.5 rounded-lg border ${errorClass} ${highlightClass} transition-colors duration-500`}
            animate={{ scale: isHighlighted ? 1.02 : 1 }}
            transition={{ duration: 0.3 }}
        >
            <input
                type="text"
                maxLength={1}
                value={rule.currentState}
                onChange={(e) => onRuleChange(rule.id, 'currentState', e.target.value)}
                className={inputClasses}
            />
            <input
                type="text"
                maxLength={1}
                value={rule.read}
                onChange={(e) => onRuleChange(rule.id, 'read', e.target.value)}
                className={inputClasses}
            />

            <div className="text-cyan-400 font-bold mx-1 text-sm sm:text-base"><Icons.ArrowRight className="w-4 h-4 sm:w-5 sm:h-5"/></div>
            
            <input
                type="text"
                maxLength={1}
                value={rule.newState}
                onChange={(e) => onRuleChange(rule.id, 'newState', e.target.value)}
                className={inputClasses}
            />
            <input
                type="text"
                maxLength={1}
                value={rule.write}
                onChange={(e) => onRuleChange(rule.id, 'write', e.target.value)}
                className={inputClasses}
            />
            <input
                type="text"
                maxLength={1}
                value={rule.move}
                onChange={(e) => onRuleChange(rule.id, 'move', e.target.value)}
                className={inputClasses}
                placeholder="L/R"
            />
            <button onClick={() => onDeleteRule(rule.id)} className="text-slate-500 hover:text-red-500 p-1 rounded-full transition-colors"><Icons.Trash className="w-3 h-3 sm:w-4 sm:h-4" /></button>
        </motion.div>
    );
};

export const RuleEditor: React.FC<RuleEditorProps> = React.memo(({ rules, setRules, lastUsedRuleId, stepCount }) => {
    
    const handleRuleChange = (id: string, field: keyof Rule, value: string) => {
        const upperValue = value.toUpperCase();
        setRules(rules.map(r => r.id === id ? { ...r, [field]: upperValue } : r));
    };

    const handleAddRule = () => {
        const newRule: Rule = { id: Date.now().toString(), currentState: '', read: '', newState: '', write: '', move: '' };
        setRules([...rules, newRule]);
    };

    const handleDeleteRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id));
    };

    const headerClasses = "text-cyan-400 font-bold text-xs sm:text-sm text-center pb-1 sm:pb-2";

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-2 sm:p-4 shadow-lg w-full">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="font-bold text-base sm:text-lg text-slate-200">Programa (Regras)</h3>
                <button onClick={handleAddRule} className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-md text-xs sm:text-sm font-bold hover:bg-cyan-500/30 transition-colors">
                    <Icons.PlusCircle className="w-3 h-3 sm:w-4 sm:h-4"/>
                    <span>Nova Regra</span>
                </button>
            </div>

            <div className="grid grid-cols-[repeat(2,1fr)_min-content_repeat(3,1fr)_auto] gap-1 sm:gap-2 items-center px-1.5">
                 <div className={`${headerClasses} col-span-2`}>Condição</div>
                 <div className="col-span-1"></div>
                 <div className={`${headerClasses} col-span-3`}>Ação</div>
            </div>

             <div className="grid grid-cols-[repeat(2,1fr)_min-content_repeat(3,1fr)_auto] gap-1 sm:gap-2 items-center text-center text-slate-400 text-xs sm:text-sm font-mono px-1.5">
                <span>Estado</span>
                <span>Lê</span>
                <span></span> 
                <span>Novo Est.</span>
                <span>Escreve</span>
                <span>Move</span>
                <span></span>
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2 mt-1 sm:mt-2 max-h-96 overflow-y-auto pr-1">
                {rules.map(rule => (
                    <RuleRow 
                        key={rule.id}
                        rule={rule}
                        onRuleChange={handleRuleChange}
                        onDeleteRule={handleDeleteRule}
                        isHighlighted={lastUsedRuleId === rule.id && stepCount > 0}
                        isError={rule.hasError ?? false}
                    />
                ))}
                 {rules.length === 0 && (
                    <div className="text-center p-4 text-slate-500 text-sm">
                        Nenhuma regra definida.
                    </div>
                )}
            </div>
        </div>
    );
});