import React, { useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { BLANK_SYMBOL } from '../constants';

interface TapeProps {
    tape: string[];
    headPosition: number;
    isHalted: boolean;
}

const TapeCell: React.FC<{ children: React.ReactNode; isHead: boolean; isHalted: boolean }> = ({ children, isHead, isHalted }) => {
    const symbol = children === ' ' ? BLANK_SYMBOL : children;
    
    const headColor = isHalted ? "border-emerald-400 bg-emerald-500/20" : "border-cyan-400 bg-cyan-500/20";
    const cellColor = isHead ? headColor : "border-slate-700 bg-slate-800/60";
    
    return (
        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border-2 ${cellColor} rounded-md flex items-center justify-center transition-colors duration-300`}>
            <span className="font-mono text-lg sm:text-xl md:text-2xl text-slate-200">{symbol}</span>
        </div>
    );
};

export const Tape: React.FC<TapeProps> = React.memo(({ tape, headPosition, isHalted }) => {
    const tapeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (tapeContainerRef.current) {
            const container = tapeContainerRef.current;
            const headElement = container.querySelector('[data-is-head="true"]');
            if (headElement) {
                const containerWidth = container.offsetWidth;
                const headLeft = (headElement as HTMLElement).offsetLeft;
                const headWidth = (headElement as HTMLElement).offsetWidth;

                container.scrollTo({
                    left: headLeft - (containerWidth / 2) + (headWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [headPosition, tape]);

    return (
        <div className="relative w-full">
             <div className={`absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 w-0 h-0 
                border-l-[6px] border-l-transparent
                border-t-[8px] ${isHalted ? 'border-t-emerald-400' : 'border-t-cyan-400'}
                border-r-[6px] border-r-transparent transition-colors duration-300`}>
            </div>
            <div ref={tapeContainerRef} className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
                {tape.map((symbol, index) => (
                    <div key={index} data-is-head={index === headPosition} style={{ scrollSnapAlign: 'center' }}>
                        <TapeCell isHead={index === headPosition} isHalted={isHalted}>
                            {symbol}
                        </TapeCell>
                    </div>
                ))}
            </div>
        </div>
    );
});