export enum Direction {
    Left = 'L',
    Right = 'R',
}

// The core Rule definition used by the machine logic
export interface Rule {
    id: string;
    currentState: string;
    read: string;
    newState: string;
    write: string;
    move: string;
}

// The Rule definition used by the UI, with validation state
export interface ValidatedRule extends Rule {
    hasError?: boolean;
}

export interface HistoryEntry {
    step: number;
    state: string;
    read: string;
    position: number;
    ruleId: string | null;
}

export interface TuringMachineState {
    tape: string[];
    headPosition: number;
    currentState: string;
    isHalted: boolean;
    stepCount: number;
    lastUsedRuleId: string | null;
    error: string | null;
    history: HistoryEntry[];
}

export interface AppState {
    tape: string[];
    headPosition: number;
    currentState: string;
    isHalted: boolean;
    isRunning: boolean;
    stepCount: number;
    error: string | null;
    hasRuleErrors: boolean;
    initialInput: string;
    finalTape: string[] | null;
    speed: number;
    isSoundOn: boolean;
}

export interface MachineActions {
    run: () => void;
    pause: () => void;
    step: () => void;
    reset: () => void;
    setSpeed: (speed: number) => void;
    toggleSound: () => void;
    setInitialInput: (input: string) => void;
}
