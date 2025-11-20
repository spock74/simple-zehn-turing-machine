import React from 'react';
import { motion } from "framer-motion";
import { Icons } from './Icons';

interface ControlsProps {
    onRun: () => void;
    onPause: () => void;
    onStep: () => void;
    onReset: () => void;
    isRunning: boolean;
    isHalted: boolean;
    isProgramInvalid: boolean;
    speed: number;
    onSpeedChange: (speed: number) => void;
    isSoundOn: boolean;
    onToggleSound: () => void;
}

const ControlButton: React.FC<{ onClick: () => void; disabled?: boolean; color: string; children: React.ReactNode; className?: string }> = 
({ onClick, disabled, color, children, className }) => {
    const colorClasses = {
        green: 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/50',
        blue: 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/50',
        red: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/50',
        gray: 'bg-slate-700/50 text-slate-500 border-slate-700'
    }[color];

    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 border rounded-md text-sm sm:text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${colorClasses} ${className}`}>
            {children}
        </button>
    );
};

export const Controls: React.FC<ControlsProps> = React.memo(({
    onRun,
    onPause,
    onStep,
    onReset,
    isRunning,
    isHalted,
    isProgramInvalid,
    speed,
    onSpeedChange,
    isSoundOn,
    onToggleSound,
}) => {

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSpeedChange(Number(e.target.value));
    };

    const speedInSeconds = (3000 - speed) / 1000;

    return (
        <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full sm:w-auto">
                    <ControlButton onClick={isRunning ? onPause : onRun} disabled={isHalted || isProgramInvalid} color={isRunning ? "blue" : "green"} className="w-full">
                        {isRunning ? <><Icons.Pause className="w-4 h-4" /> Pausar</> : <><Icons.Play className="w-4 h-4" /> Executar</>}
                    </ControlButton>
                    <ControlButton onClick={onStep} disabled={isRunning || isHalted || isProgramInvalid} color="blue" className="w-full">
                       <Icons.StepForward className="w-4 h-4" /> Passo
                    </ControlButton>
                </div>
                <ControlButton onClick={onReset} color="red" className="w-full sm:w-auto">
                    <Icons.RefreshCw className="w-4 h-4"/> Resetar
                </ControlButton>
            </div>

            <div className="flex items-center gap-3 pt-2 sm:pt-0">
                <button onClick={onToggleSound} className="text-slate-400 hover:text-cyan-400 transition-colors">
                    {isSoundOn ? <Icons.Volume2 className="w-5 h-5" /> : <Icons.VolumeX className="w-5 h-5" />}
                </button>
                <div className="flex-grow flex items-center gap-3">
                     <input
                        type="range"
                        min="0"
                        max="2900" // Max speed, results in 0.1s delay
                        step="100"
                        value={speed}
                        onChange={handleSpeedChange}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb"
                    />
                </div>
                <span className="text-xs font-mono text-cyan-400 w-12 text-center">{speedInSeconds.toFixed(2)}s</span>
            </div>
        </div>
    );
});