import { Bot } from '../Client';
import { type UpdateName } from 'puregram/types';

type EventOptions = {
    name: UpdateName;
};

export abstract class TelegramListenerStructure {
    readonly client: Bot;
    readonly options: EventOptions;

    constructor(client: Bot, options: EventOptions) {
        this.client = client;
        this.options = options;
    }

    abstract eventExecute(...args: any): Promise<any> | any;
}