import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTuringMachine } from './hooks/useTuringMachine';
import { Tape } from './components/Tape';
import { Controls } from './components/Controls';
import { RuleEditor } from './components/RuleEditor';
import { StateDisplay } from './components/StateDisplay';
import { InfoCard } from './components/InfoCard';
import { HistoryLog } from './components/HistoryLog';
import { StateDiagram } from './components/StateDiagram';
import { Icons } from './components/Icons';
import { EXAMPLE_PROGRAMS, BLANK_SYMBOL, INITIAL_STATE, HALT_STATE } from './constants';
import type { Rule } from './types';

const App: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>(EXAMPLE_PROGRAMS[0].rules);
    const [initialInput, setInitialInput] = useState<string>(EXAMPLE_PROGRAMS[0].input);
    const [finalTape, setFinalTape] = useState<string[] | null>(null);
    const [speed, setSpeed] = useState(1500); // Default speed: 1.5 seconds
    const [isSoundOn, setIsSoundOn] = useState(true);

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
            // Trim leading and trailing blank symbols
            const firstContentIndex = tape.findIndex(s => s !== BLANK_SYMBOL);
            if (firstContentIndex === -1) {
                // Tape is all blank, show a single blank symbol
                setFinalTape([BLANK_SYMBOL]);
                return;
            }
            // FIX: Replace findLastIndex with a manual loop for broader compatibility.
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
    }, [reset]);
    
    const toggleSound = useCallback(() => {
        setIsSoundOn(prev => !prev);
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 font-rajdhani text-slate-300 p-4 lg:p-6 overflow-x-hidden">
            <div className="absolute inset-0 bg-grid-slate-800/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
            <header className="relative text-center mb-4 lg:mb-6 z-10">
                <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-cyan-400 tracking-wider">
                    <span className="[text-shadow:_0_0_10px_theme(colors.cyan.400)]">
                        Máquina de Turing
                    </span>
                </h1>
                <p className="text-slate-400 mt-2 text-lg">Um Simulador Interativo Zehn</p>
            </header>

            <main className="relative z-10">
                <div className="flex flex-col xl:flex-row gap-6">

                    {/* Left Column: History Log */}
                    <motion.div 
                        initial={{ x: -100, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        transition={{ duration: 0.5, delay: 0.5 }} 
                        className="xl:w-1/4 xl:order-1 h-96 xl:h-[calc(100vh-12rem)]"
                    >
                        <HistoryLog history={history} rules={rules} />
                    </motion.div>

                    {/* Center Column (Machine + Rules) */}
                    <div className="xl:w-1/2 flex flex-col gap-6 min-w-0 xl:order-2">
                        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col gap-4">
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-2xl shadow-cyan-500/10">
                                <StateDisplay currentState={currentState} stepCount={stepCount} isHalted={isHalted} error={error} />
                                <div className="mt-4 relative pt-4">
                                    <AnimatePresence>
                                        {isHalted && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                                                exit={{ opacity: 0 }}
                                                className="absolute top-0 left-1/2 -translate-x-1/2 bg-cyan-500/20 border border-cyan-500 text-cyan-300 text-xs font-bold px-3 py-0.5 rounded-full z-20"
                                            >
                                                SAÍDA FINAL
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <Tape
                                        tape={finalTape ?? tape}
                                        headPosition={headPosition}
                                        isFinal={isHalted}
                                    />
                                </div>
                            </div>
                             <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-lg">
                                <Controls
                                    onRun={run}
                                    onPause={pause}
                                    onStep={step}
                                    onReset={handleReset}
                                    isRunning={isRunning}
                                    isHalted={isHalted}
                                    isProgramInvalid={hasRuleErrors}
                                    speed={speed}
                                    onSpeedChange={setSpeed}
                                    isSoundOn={isSoundOn}
                                    onToggleSound={toggleSound}
                                />
                                <div className="mt-4">
                                    <label htmlFor="initial-input" className="block text-sm font-medium text-cyan-400 mb-1">Entrada Inicial na Fita</label>
                                    <input
                                        id="initial-input"
                                        type="text"
                                        value={initialInput}
                                        onChange={(e) => setInitialInput(e.target.value)}
                                        onBlur={handleReset}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                                        placeholder="Ex: 1101"
                                    />
                                </div>
                            </div>
                        </motion.div>
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                            <RuleEditor rules={validatedRules} setRules={setRules} lastUsedRuleId={lastUsedRuleId} stepCount={stepCount} />
                        </motion.div>
                    </div>

                    {/* Right Column: Info & Examples */}
                    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="xl:w-1/4 flex-shrink-0 flex flex-col gap-6 xl:order-3">
                        <InfoCard title="Como Funciona?" icon={<Icons.HelpCircle className="w-6 h-6 text-cyan-400"/>} defaultOpen={true}>
                            <p>1. <strong>Defina as Regras:</strong> Use o painel 'Programa (Regras)' para definir as transições da máquina.</p>
                            <p>2. <strong>Insira a Fita:</strong> Digite a entrada inicial no campo abaixo dos controles.</p>
                            <p>3. <strong>Execute:</strong> Use os botões de controle para iniciar, pausar, avançar passo a passo ou resetar a simulação.</p>
                        </InfoCard>

                        <InfoCard title="Exemplos Prontos" icon={<Icons.Code className="w-6 h-6 text-cyan-400"/>}>
                            <div className="flex flex-col gap-2">
                               {EXAMPLE_PROGRAMS.map((ex, idx) => (
                                 <button key={idx} onClick={() => loadExample(ex)} className="w-full text-left p-2 bg-slate-700/50 hover:bg-cyan-500/20 rounded-md transition-colors duration-300 border border-slate-700 hover:border-cyan-500">
                                   <p className="font-bold text-cyan-400">{ex.name}</p>
                                   <p className="text-sm text-slate-400">{ex.description}</p>
                                 </button>
                               ))}
                            </div>
                        </InfoCard>
                        
                        <InfoCard title="Diagrama de Estados" icon={<Icons.Diagram className="w-6 h-6 text-cyan-400"/>} defaultOpen={true}>
                            <div className="h-80 w-full flex items-center justify-center">
                                <StateDiagram rules={validatedRules} currentState={currentState} />
                            </div>
                        </InfoCard>
                    </motion.div>

                </div>
            </main>
        </div>
    );
};

export default App;