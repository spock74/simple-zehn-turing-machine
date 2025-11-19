import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from './Icons';

interface InfoCardProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const variants = {
        open: { opacity: 1, height: 'auto' },
        closed: { opacity: 0, height: 0 },
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="font-bold text-lg text-slate-200">{title}</h3>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Icons.ChevronRight className="w-5 h-5 text-slate-400" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={variants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="px-4"
                    >
                       <div className="pb-4 border-t border-slate-700 pt-3 text-slate-300 space-y-2">
                         {children}
                       </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};