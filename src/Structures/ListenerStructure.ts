import { SSN } from '../Client';
import { ClientEvents, Awaitable } from 'discord.js';

type EventOptions = {
    name: keyof ClientEvents;
    once?: boolean;
};

export abstract class ListenerStructure {
    readonly client: SSN;
    readonly options: EventOptions;

    constructor(client: SSN, options: EventOptions) {
        this.client = client;
        this.options = options;
    }

    abstract eventExecute(...args: ClientEvents[keyof ClientEvents]): Awaitable<void> | void;
}