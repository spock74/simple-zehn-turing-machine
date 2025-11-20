import { Rule } from './types';

export const BLANK_SYMBOL = '_';
export const INITIAL_STATE = '0';
export const HALT_STATE = 'H';

interface ExampleProgram {
    name: string;
    description: string;
    input: string;
    rules: Rule[];
}

export const EXAMPLE_PROGRAMS: ExampleProgram[] = [
    {
        name: "Inversor Binário",
        description: "Inverte todos os bits (0 vira 1, 1 vira 0) na fita.",
        input: "01101",
        rules: [
            { id: '1', currentState: '0', read: '0', newState: '0', write: '1', move: 'R' },
            { id: '2', currentState: '0', read: '1', newState: '0', write: '0', move: 'R' },
            { id: '3', currentState: '0', read: BLANK_SYMBOL, newState: HALT_STATE, write: BLANK_SYMBOL, move: 'L' },
        ],
    },
    {
        name: "Soma Unária",
        description: "Soma dois números em notação unária (ex: '111+11' -> '11111')",
        input: "11+111",
        rules: [
            { id: '1', currentState: '0', read: '1', newState: '0', write: '1', move: 'R' },
            { id: '2', currentState: '0', read: '+', newState: '1', write: '1', move: 'R' },
            { id: '3', currentState: '1', read: '1', newState: '1', write: '1', move: 'R' },
            { id: '4', currentState: '1', read: BLANK_SYMBOL, newState: '2', write: BLANK_SYMBOL, move: 'L' },
            { id: '5', currentState: '2', read: '1', newState: '2', write: BLANK_SYMBOL, move: 'L' },
            { id: '6', currentState: '2', read: '1', newState: HALT_STATE, write: '1', move: 'R' },
        ]
    },
    {
        name: "Verificador de Palíndromo",
        description: "Verifica se a entrada é um palíndromo de 0s e 1s.",
        input: "101101",
        rules: [
            { id: '1', currentState: '0', read: '0', newState: '1', write: BLANK_SYMBOL, move: 'R' },
            { id: '2', currentState: '0', read: '1', newState: '2', write: BLANK_SYMBOL, move: 'R' },
            { id: '3', currentState: '0', read: BLANK_SYMBOL, newState: HALT_STATE, write: BLANK_SYMBOL, move: 'R' }, // Palíndromo (ou entrada vazia)
            
            { id: '4', currentState: '1', read: '0', newState: '1', write: '0', move: 'R' }, // procura fim (início era 0)
            { id: '5', currentState: '1', read: '1', newState: '1', write: '1', move: 'R' }, // procura fim
            { id: '6', currentState: '1', read: BLANK_SYMBOL, newState: '3', write: BLANK_SYMBOL, move: 'L' }, // chegou ao fim, volta

            { id: '7', currentState: '2', read: '0', newState: '2', write: '0', move: 'R' }, // procura fim (início era 1)
            { id: '8', currentState: '2', read: '1', newState: '2', write: '1', move: 'R' }, // procura fim
            { id: '9', currentState: '2', read: BLANK_SYMBOL, newState: '4', write: BLANK_SYMBOL, move: 'L' }, // chegou ao fim, volta
            
            { id: '10', currentState: '3', read: '0', newState: '5', write: BLANK_SYMBOL, move: 'L' }, // encontrou 0 no final, ok
            { id: '11', currentState: '3', read: '1', newState: 'H', write: '1', move: 'L' }, // não é palíndromo
            { id: '12', currentState: '3', read: BLANK_SYMBOL, newState: HALT_STATE, write: BLANK_SYMBOL, move: 'R' }, // Palíndromo (ímpar)
            
            { id: '13', currentState: '4', read: '1', newState: '5', write: BLANK_SYMBOL, move: 'L' }, // encontrou 1 no final, ok
            { id: '14', currentState: '4', read: '0', newState: 'H', write: '0', move: 'L' }, // não é palíndromo
            { id: '15', currentState: '4', read: BLANK_SYMBOL, newState: HALT_STATE, write: BLANK_SYMBOL, move: 'R' }, // Palíndromo (ímpar)

            { id: '16', currentState: '5', read: '0', newState: '5', write: '0', move: 'L' }, // volta para o início
            { id: '17', currentState: '5', read: '1', newState: '5', write: '1', move: 'L' }, // volta para o início
            { id: '18', currentState: '5', read: BLANK_SYMBOL, newState: '0', write: BLANK_SYMBOL, move: 'R' }, // chegou ao início, recomeça ciclo
        ]
    },
];
