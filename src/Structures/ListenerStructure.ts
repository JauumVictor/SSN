import { ClientEvents } from 'discord.js';
import { SSN } from '../ssn';

interface EventOptions {
    name: keyof ClientEvents;
    once?: boolean;
}

export abstract class ListenerStructure {
    public readonly controller: SSN;
    public readonly options: EventOptions;

    public constructor(controller: SSN, options: EventOptions) {
        this.controller = controller;
        this.options = options;
    }

    public abstract eventExecute(...args: ClientEvents[keyof ClientEvents]): Promise<void> | void;
}