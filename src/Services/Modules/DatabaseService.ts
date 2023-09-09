import { SSN } from '../../Client';
import { ServiceStructure } from '../../Structures/';

export default class DatabaseService extends ServiceStructure {
    constructor(client: SSN) {
        super(client, {
            name: 'loadDatabase',
            initialize: true
        });
    }

    serviceExecute() {
        try {
            // code:
        } catch (err) {
            this.client.logger.error((err as Error).message, DatabaseService.name);
            this.client.logger.warn((err as Error).stack as string, DatabaseService.name);
        }
    }
}