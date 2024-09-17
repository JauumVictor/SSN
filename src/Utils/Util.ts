import { setTimeout as sleep } from 'timers/promises';
import { ServiceStructure } from '../structures';

class Util {
    public static GetMention(id: string): RegExp {
        return new RegExp(`^<@!?${id}>( |)$`);
    }

    public static async executeService(service: ServiceStructure) {
        const { amount = 1, interval = 0, wait = 0 } = service.data;

        for (let i = 0; i < amount; i++) {
            await sleep(wait);

            service.serviceExecute();

            if (i < amount - 1) {
                await sleep(interval);
            }
        }
    }
}

export { Util };