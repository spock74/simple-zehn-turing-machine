import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from './Icons';

interface InfoCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg w-full">
            <button 
                className="w-full flex items-center justify-between p-2 sm:p-3 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 sm:gap-3">
                    {icon}
                    <h3 className="font-bold text-base sm:text-lg text-slate-200">{title}</h3>
                </div>
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                    <Icons.ChevronRight className="w-5 h-5 text-slate-400" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="p-2 pt-0 sm:p-4 sm:pt-0 text-sm text-slate-400 flex flex-col gap-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};