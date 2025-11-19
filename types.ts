export enum Direction {
    Left = 'L',
    Right = 'R',
}

export interface Rule {
    id: string;
    currentState: string;
    readSymbol: string;
    newState: string;
    writeSymbol: string;
    moveDirection: Direction;
    isValid?: boolean;
    error?: string;
}

export interface HistoryEntry {
    step: number;
    state: string;
    readSymbol: string;
    usedRuleId: string | null;
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