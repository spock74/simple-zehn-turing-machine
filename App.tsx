import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTuringMachine } from './hooks/useTuringMachine';
import { MachineCore } from './components/MachineCore';
import { RuleEditor } from './components/RuleEditor';
import { InfoCard } from './components/InfoCard';
import { HistoryLog } from './components/HistoryLog';
import { StateDiagram } from './components/StateDiagram';
import { Icons } from './components/Icons';
import { EXAMPLE_PROGRAMS, BLANK_SYMBOL, INITIAL_STATE, HALT_STATE } from './constants';
import type { Rule, AppState } from './types';

type MobileTab = 'history' | 'rules' | 'diagram' | 'examples';

const TabButton: React.FC<{
    tabId: MobileTab;
    activeTab: MobileTab;
    onClick: (tabId: MobileTab) => void;
    children: React.ReactNode;
}> = ({ tabId, activeTab, onClick, children }) => {
    const isActive = tabId === activeTab;
    return (
        <button
            onClick={() => onClick(tabId)}
            className={`flex-1 p-2 text-xs sm:text-sm font-bold transition-all duration-300 border-b-2 ${
                isActive
                    ? 'bg-slate-800/50 text-cyan-400 border-cyan-400'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/20'
            }`}
        >
            {children}
        </button>
    );
};

const App: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>(EXAMPLE_PROGRAMS[0].rules);
    const [initialInput, setInitialInput] = useState<string>(EXAMPLE_PROGRAMS[0].input);
    const [finalTape, setFinalTape] = useState<string[] | null>(null);
    const [speed, setSpeed] = useState(1500);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('rules');

    const {
        tape,
        headPosition,
        currentState,
        isHalted,
        isRunning,
        stepCount,
        lastUsedRuleId,
        error,
        history,
        step,
        run,
        pause,
        reset,
        validatedRules,
        hasRuleErrors,
    } = useTuringMachine({
        rules,
        input: initialInput,
        initialState: INITIAL_STATE,
        blankSymbol: BLANK_SYMBOL,
        haltState: HALT_STATE,
        speed,
        isSoundOn,
    });
    
    useEffect(() => {
        if (isHalted) {
            const firstContentIndex = tape.findIndex(s => s !== BLANK_SYMBOL);
            if (firstContentIndex === -1) {
                setFinalTape([BLANK_SYMBOL]);
                return;
            }
            let lastContentIndex = -1;
            for (let i = tape.length - 1; i >= 0; i--) {
                if (tape[i] !== BLANK_SYMBOL) {
                    lastContentIndex = i;
                    break;
                }
            }
            if (lastContentIndex !== -1) {
                 const trimmedTape = tape.slice(firstContentIndex, lastContentIndex + 1);
                 setFinalTape(trimmedTape);
            } else {
                 setFinalTape([BLANK_SYMBOL]);
            }
        } else {
            setFinalTape(null);
        }
    }, [isHalted, tape]);

    const handleReset = useCallback(() => {
        setFinalTape(null);
        reset(initialInput, rules);
    }, [initialInput, rules, reset]);
    
    const loadExample = useCallback((example: typeof EXAMPLE_PROGRAMS[0]) => {
        setFinalTape(null);
        setRules(example.rules);
        setInitialInput(example.input);
        reset(example.input, example.rules);
        setActiveMobileTab('rules');
    }, [reset]);
    
    const toggleSound = useCallback(() => {
        setIsSoundOn(prev => !prev);
    }, []);

    const appState: AppState = { tape, headPosition, currentState, isHalted, isRunning, stepCount, error, hasRuleErrors, initialInput, finalTape, speed, isSoundOn };
    const machineActions = { run, pause, step, reset: handleReset, setSpeed, toggleSound, setInitialInput };

    const ExamplesPanel = () => (
         <InfoCard title="Exemplos Prontos" icon={<Icons.FileText className="w-4 h-4 text-cyan-400"/>}>
            <div className="flex flex-col gap-2">
               {EXAMPLE_PROGRAMS.map((ex, idx) => (
                 <button key={idx} onClick={() => loadExample(ex)} className="w-full text-left p-2 bg-slate-700/50 hover:bg-cyan-500/20 rounded-md transition-colors duration-300 border border-slate-700 hover:border-cyan-500">
                   <p className="font-bold text-cyan-400 text-sm">{ex.name}</p>
                   <p className="text-xs text-slate-400">{ex.description}</p>
                 </button>
               ))}
            </div>
        </InfoCard>
    );

    const DiagramPanel = () => (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg w-full">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-b border-slate-700">
                <Icons.Diagram className="w-4 h-4 text-cyan-400"/>
                <h3 className="font-bold text-base sm:text-lg text-slate-200">Diagrama de Estados</h3>
            </div>
            <div className="p-2 h-96 w-full flex items-center justify-center">
                <StateDiagram rules={validatedRules} currentState={currentState} />
            </div>
        </div>
    );

    const DesktopInfoPanel = () => (
        <div className="flex-shrink-0 flex flex-col gap-6">
            <InfoCard title="Como Funciona?" icon={<Icons.HelpCircle className="w-5 h-5 text-cyan-400"/>} defaultOpen={true}>
                <p className="text-sm">1. <strong>Defina as Regras:</strong> Use o painel 'Programa (Regras)' para definir as transições da máquina.</p>
                <p className="text-sm">2. <strong>Insira a Fita:</strong> Digite a entrada inicial no campo abaixo dos controles.</p>
                <p className="text-sm">3. <strong>Execute:</strong> Use os botões para iniciar, pausar, avançar passo a passo ou resetar.</p>
            </InfoCard>
            <InfoCard title="Diagrama de Estados" icon={<Icons.Diagram className="w-5 h-5 text-cyan-400"/>} defaultOpen={true}>
                <div className="h-80 w-full flex items-center justify-center">
                    <StateDiagram rules={validatedRules} currentState={currentState} />
                </div>
            </InfoCard>
            <ExamplesPanel />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 font-rajdhani text-slate-300 p-2 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
            <div className="absolute inset-0 bg-grid-slate-800/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
            <header className="relative text-center mb-4 sm:mb-6 z-10">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-orbitron font-bold text-cyan-400 tracking-wider [text-shadow:_0_0_10px_theme(colors.cyan.400)]">
                    Máquina de Turing
                </h1>
                <p className="text-slate-400 mt-1 text-sm sm:text-base">Um Simulador Interativo Zehn</p>
            </header>

            <main className="relative z-10 max-w-screen-2xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

                    {/* --- DESKTOP LAYOUT --- */}
                    <div className="hidden lg:flex w-full gap-6">
                        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="w-1/4 max-h-[calc(100vh-12rem)]">
                            <HistoryLog history={history} rules={rules} />
                        </motion.div>

                        <div className="w-1/2 flex flex-col gap-6 min-w-0">
                            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <MachineCore state={appState} actions={machineActions} inputId="initial-input-desktop" />
                            </motion.div>
                            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <RuleEditor rules={validatedRules} setRules={setRules} lastUsedRuleId={lastUsedRuleId} stepCount={stepCount} />
                            </motion.div>
                        </div>

                        <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="w-1/4">
                           <DesktopInfoPanel />
                        </motion.div>
                    </div>

                    {/* --- MOBILE/TABLET LAYOUT --- */}
                    <div className="lg:hidden w-full flex flex-col gap-4">
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <MachineCore state={appState} actions={machineActions} inputId="initial-input-mobile" />
                        </motion.div>

                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg flex items-center shadow-lg sticky top-2 z-30">
                            <TabButton tabId="history" activeTab={activeMobileTab} onClick={setActiveMobileTab}>Histórico</TabButton>
                            <TabButton tabId="rules" activeTab={activeMobileTab} onClick={setActiveMobileTab}>Regras</TabButton>
                            <TabButton tabId="diagram" activeTab={activeMobileTab} onClick={setActiveMobileTab}>Diagrama</TabButton>
                            <TabButton tabId="examples" activeTab={activeMobileTab} onClick={setActiveMobileTab}>Exemplos</TabButton>
                        </div>
                        
                        <div className="mt-2 pb-12">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeMobileTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeMobileTab === 'history' && <div className="h-96"><HistoryLog history={history} rules={rules} /></div>}
                                    {activeMobileTab === 'rules' && <RuleEditor rules={validatedRules} setRules={setRules} lastUsedRuleId={lastUsedRuleId} stepCount={stepCount} />}
                                    {activeMobileTab === 'diagram' && <DiagramPanel />}
                                    {activeMobileTab === 'examples' && <ExamplesPanel />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
