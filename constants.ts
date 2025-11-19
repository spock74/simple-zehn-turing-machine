import type { Rule } from './types';
import { Direction } from './types';

export const BLANK_SYMBOL = ' ';
export const INITIAL_STATE = 'q0';
export const HALT_STATE = 'halt';

export const EXAMPLE_PROGRAMS: { name: string; description: string; input: string; rules: Rule[] }[] = [
    {
        name: "Incrementador Binário",
        description: "Adiciona 1 a um número binário.",
        input: "1011",
        rules: [
            { id: '1', currentState: 'q0', readSymbol: '1', newState: 'q0', writeSymbol: '1', moveDirection: Direction.Right },
            { id: '2', currentState: 'q0', readSymbol: '0', newState: 'q0', writeSymbol: '0', moveDirection: Direction.Right },
            { id: '3', currentState: 'q0', readSymbol: BLANK_SYMBOL, newState: 'q1', writeSymbol: BLANK_SYMBOL, moveDirection: Direction.Left },
            { id: '4', currentState: 'q1', readSymbol: '1', newState: 'q1', writeSymbol: '0', moveDirection: Direction.Left },
            { id: '5', currentState: 'q1', readSymbol: '0', newState: 'q2', writeSymbol: '1', moveDirection: Direction.Left },
            { id: '6', currentState: 'q1', readSymbol: BLANK_SYMBOL, newState: 'q2', writeSymbol: '1', moveDirection: Direction.Left },
            { id: '7', currentState: 'q2', readSymbol: '0', newState: 'q2', writeSymbol: '0', moveDirection: Direction.Left },
            { id: '8', currentState: 'q2', readSymbol: '1', newState: 'q2', writeSymbol: '1', moveDirection: Direction.Left },
            { id: '9', currentState: 'q2', readSymbol: BLANK_SYMBOL, newState: HALT_STATE, writeSymbol: BLANK_SYMBOL, moveDirection: Direction.Right },
        ],
    },
    {
        name: "Palíndromo (a,b)",
        description: "Verifica se uma string é um palíndromo (ex: 'abaaba').",
        input: "ababa",
        rules: [
            { id: 'p1', currentState: 'q0', readSymbol: 'a', newState: 'q1', writeSymbol: BLANK_SYMBOL, moveDirection: Direction.Right },
            { id: 'p2', currentState: 'q0', readSymbol: 'b', newState: 'q2', writeSymbol: BLANK_SYMBOL, moveDirection: Direction.Right },
            { id: 'p3', currentState: 'q0', readSymbol: BLANK_SYMBOL, newState: HALT_STATE, writeSymbol: BLANK_SYMBOL, moveDirection: Direction.Right },
            { id: 'p4', currentState: 'q1', readSymbol: 'a', newState: 'q1', writeSymbol: 'a', moveDirection: Direction.Right },
            { id: 'p5', currentState: 'q1', readSymbol: 'b', newState: 'q1', writeSymbol: 'b', moveDirection: Direction.Right },
            { id: 'p6', currentState: 'q1', readSymbol: BLANK_SYMBOL, newState: 'q3', writeSymbol: BLANK_SYMBOL, moveDirection: Direction.Left },
            { id: 'p7', currentState: 'q2', readSymbol: 'a', newState: 'q2', writeSymbol: 'a', moveDirection: Direction.Right },
            { id: 'p8', currentState: 'q2', readSymbol: 'b', newState: 'q2', writeSymbol: 'b', moveDirection: Direction.Right },
            { id: 'p9', currentState: 'q2', readSymbol: BLANK_SYMBOL, newState: 'q4', writeSymbol: BLANK_SYMBOL, moveDirection: Direction.Left },
            { id: 'p10', currentState: 'q3', readSymbol: 'a', newState: 'q5', writeSymbol: BLANK_SYMBOL, moveDirection: Direction.Left },
            { id: 'p11', currentState: 'q3', readSymbol: 'b', newState: HALT_STATE, writeSymbol: 'b', moveDirection: Direction.Left },
            { id: 'p12', currentState: 'q4', readSymbol: 'b', newState: 'q5', writeSymbol: BLANK_SYMBOL, moveDirection: Direction.Left },
            { id: 'p13', currentState: 'q4', readSymbol: 'a', newState: HALT_STATE, writeSymbol: 'a', moveDirection: Direction.Left },
            { id: 'p14', currentState: 'q5', readSymbol: 'a', newState: 'q5', writeSymbol: 'a', moveDirection: Direction.Left },
            { id: 'p15', currentState: 'q5', readSymbol: 'b', newState: 'q5', writeSymbol: 'b', moveDirection: Direction.Left },
            { id: 'p16', currentState: 'q5', readSymbol: BLANK_SYMBOL, newState: 'q0', writeSymbol: BLANK_SYMBOL, moveDirection: Direction.Right },
        ],
    },
];
