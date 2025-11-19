import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface TapeProps {
    tape: string[];
    headPosition: number;
    isFinal?: boolean;
}

const CELL_WIDTH = 52; // Corresponds to w-12 + gap-1 -> (12 * 4px) + 4px

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
    <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        className="absolute bottom-full mb-2 w-max bg-slate-900 text-white text-xs rounded py-1 px-2 shadow-lg z-50 border border-slate-600"
    >
        {text}
    </motion.div>
);

const TapeCell: React.FC<{ symbol: string; isHead: boolean }> = ({ symbol, isHead }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const displaySymbol = symbol.length > 1 ? `${symbol.charAt(0)}…` : symbol;
    const needsTooltip = symbol.length > 1;

    return (
        <motion.div
            layout
            className={`relative flex-shrink-0 w-12 h-16 flex items-center justify-center text-2xl border-2 rounded-md transition-colors duration-300
                ${isHead 
                    ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300' 
                    : 'bg-slate-700/50 border-slate-600 text-slate-400'
                }`}
            animate={isHead ? {
                scale: [1.1, 1.14, 1.1],
                boxShadow: [
                    "0 0 12px rgba(34, 211, 238, 0.5)",
                    "0 0 20px rgba(34, 211, 238, 0.7)",
                    "0 0 12px rgba(34, 211, 238, 0.5)",
                ],
                transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }
            } : {
                scale: 1,
                boxShadow: "none"
            }}
            onMouseEnter={() => needsTooltip && setShowTooltip(true)}
            onMouseLeave={() => needsTooltip && setShowTooltip(false)}
        >
            <AnimatePresence>
                {showTooltip && <Tooltip text={symbol} />}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
                <motion.span
                    key={symbol} // Key change triggers animation
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-orbitron"
                >
                    {displaySymbol}
                </motion.span>
            </AnimatePresence>
        </motion.div>
    );
};


export const Tape: React.FC<TapeProps> = ({ tape, headPosition, isFinal = false }) => {
    // Com `justify-center` no pai, a fita já está centralizada.
    // O transform é relativo a essa posição central.
    // O deslocamento é o negativo da distância do centro da fita para o centro da célula ativa.
    const tapeWidth = tape.length * CELL_WIDTH;
    const activeTapeOffset = (tapeWidth / 2) - (headPosition * CELL_WIDTH) - (CELL_WIDTH / 2);

    return (
        <div className="relative w-full h-24 flex items-center justify-center overflow-hidden bg-slate-900/50 rounded-lg p-2">
            {!isFinal && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-cyan-400 z-20 animate-pulse-fast"></div>
            )}
            <motion.div
                className="flex items-center gap-1"
                style={{
                    // Na exibição final, x=0 mantém a fita centralizada.
                    // Durante a execução, calculamos o deslocamento para centralizar a célula ativa.
                    x: isFinal ? 0 : activeTapeOffset
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            >
                {tape.map((symbol, index) => (
                    <TapeCell key={index} symbol={symbol} isHead={!isFinal && index === headPosition} />
                ))}
            </motion.div>
        </div>
    );
};