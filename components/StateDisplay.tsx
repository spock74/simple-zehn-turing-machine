import React from 'react';
import { motion } from "framer-motion";
import { Icons } from './Icons';

interface StateDisplayProps {
    currentState: string;
    stepCount: number;
    isHalted: boolean;
    error: string | null;
}

export const StateDisplay: React.FC<StateDisplayProps> = React.memo(({ currentState, stepCount, isHalted, error }) => {
    const stateColor = error ? "text-red-500" : isHalted ? "text-emerald-400" : "text-cyan-400";

    return (
        <div className="flex items-center justify-between text-slate-400 font-mono text-xs sm:text-sm md:text-base">
            <div className="flex items-center gap-2 sm:gap-3">
                <span className="font-bold">PASSO:</span>
                <motion.span
                    key={`step-${stepCount}`}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="font-bold text-lg sm:text-xl md:text-2xl text-cyan-400 w-10 text-center"
                >
                    {stepCount}
                </motion.span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
                 <span className="font-bold">ESTADO:</span>
                <motion.div
                    key={`state-${currentState}`}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`font-bold text-lg sm:text-xl md:text-2xl ${stateColor} flex items-center gap-1`}
                >
                    {error ? <Icons.AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5"/> : isHalted ? <Icons.CheckCircle className="w-4 h-4 sm:w-5 sm:h-5"/> : <Icons.Activity className="w-4 h-4 sm:w-5 sm:h-5"/>}
                    <span className="w-16 text-center">{currentState}</span>
                </motion.div>
            </div>
        </div>
    );
});