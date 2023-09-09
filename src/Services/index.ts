import { SSN } from '../Client';
import { ModuleStructure, ServiceStructure } from '../Structures/';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export default class Services extends ModuleStructure {
    constructor(client: SSN) {
        super(client);
    }

    async moduleExecute() {
        try {
            const serviceFolder = readdirSync(join(__dirname, 'Modules'), { withFileTypes: true }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.js')).map((dirent) => dirent.name);
            const initializeServices: ServiceStructure[] = [];

            for (const file of serviceFolder) {
                const { default: ServiceClass }: { default: new (client: SSN) => ServiceStructure } = await import(`../Services/Modules/${file}`);
                const service = new ServiceClass(this.client);

                if (service.data) {
                    this.client.services.set(service.data.name, service);

                    if (service.data.initialize) {
                        initializeServices.push(service);
                    }
                }
            }

            for (const service of initializeServices) {
                await this.client.utils.executeService(service);
            }

            this.client.logger.info('Services loaded successfully.', 'Services');
        } catch (err) {
            this.client.logger.error((err as Error).message, Services.name);
            this.client.logger.warn((err as Error).stack as string, Services.name);
        }
    }
}