import { Telegram } from 'puregram';
import { TelegramOptions } from 'puregram/interfaces';

export class TelegramBot extends Telegram {
    public constructor(options: TelegramOptions) {
        super(options);
    }

    async initialize() {
        await this.updates.startPolling();
    }
}