import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface StateDisplayProps {
    currentState: string;
    stepCount: number;
    isHalted: boolean;
    error: string | null;
}

export const StateDisplay: React.FC<StateDisplayProps> = ({ currentState, stepCount, isHalted, error }) => {
    return (
        <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700">
            <div className="flex items-center gap-4">
                 <span className="text-sm text-slate-400">PASSO:</span>
                 <span className="text-2xl font-orbitron font-bold text-cyan-300 w-20">{stepCount}</span>
            </div>
            
            <div className="flex items-center gap-4">
                 <span className="text-sm text-slate-400">ESTADO:</span>
                 <AnimatePresence mode="wait">
                    <motion.span 
                        key={currentState}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="text-2xl font-orbitron font-bold text-cyan-300 w-24 text-center"
                    >
                      {currentState}
                    </motion.span>
                 </AnimatePresence>
            </div>

            <div className="w-48 text-center">
                <AnimatePresence>
                    {error ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-full text-sm font-bold truncate"
                            title={error}
                        >
                            ERRO: Regra inválida
                        </motion.div>
                    ) : isHalted ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded-full text-sm font-bold"
                        >
                          HALT
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
};