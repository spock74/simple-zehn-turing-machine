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
    isProgramInvalid?: boolean;
    speed: number;
    onSpeedChange: (newSpeed: number) => void;
    isSoundOn: boolean;
    onToggleSound: () => void;
}

const ControlButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string; label: string }> = ({ onClick, disabled = false, children, className = '', label }) => (
    <motion.button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 font-bold transition-all duration-300 border-2
            ${disabled
                ? 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed'
                : `bg-slate-800 hover:bg-opacity-80 hover:text-white ${className}`
            }
        `}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        aria-label={label}
    >
        {children}
    </motion.button>
);

export const Controls: React.FC<ControlsProps> = ({ onRun, onPause, onStep, onReset, isRunning, isHalted, isProgramInvalid, speed, onSpeedChange, isSoundOn, onToggleSound }) => {
    // Invert the slider logic so right=faster, left=slower
    // Speed range: 250ms (fast) to 4000ms (slow)
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // The slider value goes from 250 (slowest visually on slider) to 4000 (fastest)
        // We invert it to map to speed in ms: 4000ms -> 250ms
        const newSpeed = 4250 - Number(e.target.value);
        onSpeedChange(newSpeed);
    };
    // To make the slider move from left(slow) to right(fast), we invert the value.
    const sliderValue = 4250 - speed;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
                {!isRunning ? (
                    <ControlButton onClick={onRun} disabled={isHalted || isProgramInvalid} className="border-green-500 text-green-400 hover:bg-green-500/20" label="Executar">
                        <Icons.Play className="w-5 h-5" />
                        <span>Executar</span>
                    </ControlButton>
                ) : (
                    <ControlButton onClick={onPause} className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20" label="Pausar">
                        <Icons.Pause className="w-5 h-5" />
                        <span>Pausar</span>
                    </ControlButton>
                )}

                <ControlButton onClick={onStep} disabled={isRunning || isHalted || isProgramInvalid} className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20" label="Passo">
                    <Icons.StepForward className="w-5 h-5" />
                    <span>Passo</span>
                </ControlButton>

                <ControlButton onClick={onReset} className="border-red-500 text-red-400 hover:bg-red-500/20" label="Resetar">
                    <Icons.RefreshCw className="w-5 h-5" />
                    <span>Resetar</span>
                </ControlButton>
            </div>
            <div className="w-full max-w-xs flex flex-col items-center gap-2 pt-2">
                <label htmlFor="speed-slider" className="text-sm text-slate-400">Velocidade de Execução</label>
                <div className="w-full flex items-center gap-3">
                    <motion.button
                         onClick={onToggleSound}
                         className="text-slate-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                         aria-label={isSoundOn ? "Desativar som" : "Ativar som"}
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                    >
                      {isSoundOn ? <Icons.Volume2 className="w-5 h-5" /> : <Icons.VolumeX className="w-5 h-5" />}
                    </motion.button>
                    <input
                        id="speed-slider"
                        type="range"
                        min="250"  // Corresponds to 4000ms delay
                        max="4000" // Corresponds to 250ms delay
                        step="50"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        disabled={isRunning}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        aria-label="Controle de Velocidade"
                    />
                    <Icons.Rabbit className="w-5 h-5 text-slate-400 flex-shrink-0" />
                </div>
                 <span className="text-xs font-mono text-cyan-400 w-20 text-center">{(speed / 1000).toFixed(2)}s</span>
            </div>
        </div>
    );
};