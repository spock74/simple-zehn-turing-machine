import React from 'react';
import { Tape } from './Tape';
import { StateDisplay } from './StateDisplay';
import { Controls } from './Controls';
import { Icons } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppState, MachineActions } from '../types';

interface MachineCoreProps {
    state: AppState;
    actions: MachineActions;
    inputId: string;
}

export const MachineCore: React.FC<MachineCoreProps> = ({ state, actions, inputId }) => {
    const { tape, headPosition, currentState, isHalted, isRunning, stepCount, error, hasRuleErrors, initialInput, finalTape, speed, isSoundOn } = state;
    const { run, pause, step, reset, setSpeed, toggleSound, setInitialInput } = actions;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInitialInput(e.target.value.toUpperCase());
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-2 sm:p-4 shadow-2xl shadow-cyan-500/5">
            <div className="w-full mb-2 sm:mb-4">
                <Tape tape={tape} headPosition={headPosition} isHalted={isHalted} />
            </div>
            <div className="w-full mb-2 sm:mb-4">
                <StateDisplay currentState={currentState} stepCount={stepCount} isHalted={isHalted} error={error} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 items-start">
                <div className="w-full">
                    <Controls
                        onRun={run}
                        onPause={pause}
                        onStep={step}
                        onReset={reset}
                        isRunning={isRunning}
                        isHalted={isHalted}
                        isProgramInvalid={hasRuleErrors}
                        speed={speed}
                        onSpeedChange={setSpeed}
                        isSoundOn={isSoundOn}
                        onToggleSound={toggleSound}
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor={inputId} className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Entrada Inicial</label>
                    <input
                        id={inputId}
                        type="text"
                        value={initialInput}
                        onChange={handleInputChange}
                        placeholder="Ex: 11011"
                        disabled={isRunning}
                        className="w-full p-1.5 sm:p-2.5 bg-slate-900/70 border border-slate-700 rounded-md text-sm sm:text-base font-mono text-center text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all disabled:opacity-50"
                    />
                     <AnimatePresence>
                        {finalTape && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-1 text-center bg-slate-900/70 border border-slate-700 rounded-md p-2"
                            >
                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fita Final</p>
                                <p className="font-mono text-sm sm:text-base text-slate-300 mt-1">{finalTape.join('')}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};