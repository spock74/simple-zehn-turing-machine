import { useState, useCallback, useRef, useEffect } from 'react';
import type { Rule, TuringMachineState, HistoryEntry, ValidatedRule } from '../types';

interface UseTuringMachineProps {
    rules: Rule[];
    input: string;
    initialState: string;
    blankSymbol: string;
    haltState: string;
    speed: number;
    isSoundOn: boolean;
}

const TAPE_PADDING = 20;
const TAPE_SAFE_ZONE = 10;

const createInitialTape = (input: string, blankSymbol: string) => {
    const inputArray = input.length > 0 ? input.split('') : [blankSymbol];
    return [
        ...Array(TAPE_PADDING).fill(blankSymbol),
        ...inputArray,
        ...Array(TAPE_PADDING).fill(blankSymbol),
    ];
};

const performSingleStep = (
    state: Omit<TuringMachineState, 'history'>,
    rules: ValidatedRule[],
    blankSymbol: string,
    haltState: string
): Omit<TuringMachineState, 'history'> => {
    if (state.isHalted) {
        return state;
    }

    const currentSymbol = state.tape[state.headPosition] || blankSymbol;

    if (state.currentState === haltState) {
        return { ...state, isHalted: true, lastUsedRuleId: null };
    }

    const rule = rules.find(
        (r) => r.currentState === state.currentState && r.read === currentSymbol
    );

    if (!rule) {
        return { 
            ...state,
            isHalted: true,
            lastUsedRuleId: null,
            error: `Nenhuma regra definida para o estado '${state.currentState}' e o símbolo lido '${currentSymbol}'.`
        };
    }

    const newTape = [...state.tape];
    newTape[state.headPosition] = rule.write;

    let newHeadPosition = state.headPosition;
    if (rule.move === 'R') {
        newHeadPosition++;
    } else {
        newHeadPosition--;
    }

    let finalTape = newTape;
    let finalHeadPosition = newHeadPosition;

    if (finalHeadPosition < TAPE_SAFE_ZONE) {
        const padding = Array(TAPE_PADDING).fill(blankSymbol);
        finalTape = [...padding, ...finalTape];
        finalHeadPosition += TAPE_PADDING;
    } else if (finalHeadPosition >= finalTape.length - TAPE_SAFE_ZONE) {
        const padding = Array(TAPE_PADDING).fill(blankSymbol);
        finalTape = [...finalTape, ...padding];
    }

    return {
        tape: finalTape,
        headPosition: finalHeadPosition,
        currentState: rule.newState,
        isHalted: rule.newState === haltState,
        stepCount: state.stepCount + 1,
        lastUsedRuleId: rule.id,
        error: null,
    };
};

export const useTuringMachine = ({
    rules,
    input,
    initialState,
    blankSymbol,
    haltState,
    speed,
    isSoundOn,
}: UseTuringMachineProps) => {
    const [machineState, setMachineState] = useState<TuringMachineState>({
        tape: createInitialTape(input, blankSymbol),
        headPosition: TAPE_PADDING,
        currentState: initialState,
        isHalted: false,
        stepCount: 0,
        lastUsedRuleId: null,
        error: null,
        history: [],
    });
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const [validationState, setValidationState] = useState<{ validatedRules: ValidatedRule[]; hasErrors: boolean }>({ validatedRules: [], hasErrors: false });
    const audioCtxRef = useRef<AudioContext | null>(null);

    const ensureAudioContext = useCallback(() => {
        if (!audioCtxRef.current) {
            try {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported in this browser.");
                return;
            }
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    }, []);

    const playSound = useCallback(() => {
        if (!isSoundOn || !audioCtxRef.current) return;
        const oscillator = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtxRef.current.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtxRef.current.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioCtxRef.current.currentTime + 0.1);
    }, [isSoundOn]);

    useEffect(() => {
        const ruleMap = new Map<string, Rule[]>();
        rules.forEach(rule => {
            const key = `${rule.currentState}:${rule.read}`;
            if (!ruleMap.has(key)) {
                ruleMap.set(key, []);
            }
            ruleMap.get(key)!.push(rule);
        });

        let hasAnyErrors = false;
        const newValidatedRules: ValidatedRule[] = rules.map(rule => {
            const key = `${rule.currentState}:${rule.read}`;
            const conflictingRules = ruleMap.get(key)!;
            if (conflictingRules.length > 1) {
                hasAnyErrors = true;
                return { ...rule, hasError: true };
            }
            return { ...rule, hasError: false };
        });

        setValidationState({ validatedRules: newValidatedRules, hasErrors: hasAnyErrors });
    }, [rules]);

    const advanceMachine = useCallback(() => {
        if (machineState.isHalted) {
            setIsRunning(false);
            return;
        }
        playSound();
        setMachineState(prevState => {
            if (prevState.isHalted) {
                return prevState;
            }

            const nextState = performSingleStep(prevState, validationState.validatedRules, blankSymbol, haltState);

            const historyEntry: HistoryEntry = {
                step: prevState.stepCount,
                state: prevState.currentState,
                read: prevState.tape[prevState.headPosition] || blankSymbol,
                position: prevState.headPosition,
                ruleId: nextState.lastUsedRuleId,
            };

            return {
                ...nextState,
                history: [...prevState.history, historyEntry]
            };
        });
    }, [machineState.isHalted, validationState.validatedRules, blankSymbol, haltState, playSound]);

    const step = useCallback(() => {
        if (isRunning || machineState.isHalted || validationState.hasErrors) return;
        ensureAudioContext();
        advanceMachine();
    }, [isRunning, machineState.isHalted, validationState.hasErrors, advanceMachine, ensureAudioContext]);

    const run = useCallback(() => {
        if (machineState.isHalted || validationState.hasErrors) return;
        ensureAudioContext();
        setIsRunning(true);
    }, [machineState.isHalted, validationState.hasErrors, ensureAudioContext]);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);
    
    const reset = useCallback((newInput: string, newRules: Rule[]) => {
        setIsRunning(false);
        setMachineState({
            tape: createInitialTape(newInput, blankSymbol),
            headPosition: TAPE_PADDING,
            currentState: initialState,
            isHalted: false,
            stepCount: 0,
            lastUsedRuleId: null,
            error: null,
            history: [],
        });
    }, [blankSymbol, initialState]);
    
    useEffect(() => {
        if (!isRunning || machineState.isHalted) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (machineState.isHalted) {
                setIsRunning(false);
            }
            return;
        }

        intervalRef.current = window.setInterval(() => {
            advanceMachine();
        }, speed);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, machineState.isHalted, speed, advanceMachine]);
    
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            audioCtxRef.current?.close();
        };
    }, []);

    return {
        ...machineState,
        isRunning,
        step,
        run,
        pause,
        reset,
        validatedRules: validationState.validatedRules,
        hasRuleErrors: validationState.hasErrors,
    };
};