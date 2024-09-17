import { ContextsMapping } from 'puregram/lib/types/mappings';
import { Known } from 'puregram/types';
import { SSN } from '../ssn';

type EventOptions = {
    name: keyof Known<ContextsMapping>;
};

export abstract class TelegramListenerStructure {
    readonly controller: SSN;
    readonly options: EventOptions;

    constructor(controller: SSN, options: EventOptions) {
        this.controller = controller;
        this.options = options;
    }

    abstract eventExecute(...args: ContextsMapping[keyof Known<ContextsMapping>][]): Promise<void> | void;
}