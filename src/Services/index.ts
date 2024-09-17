import { ModuleStructure, ServiceStructure } from '../structures';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Logger } from '../utils/logger';
import { Util } from '../utils/util';
import { SSN } from '../ssn';

export default class Services extends ModuleStructure {
    constructor(controller: SSN) {
        super(controller);
    }

    async moduleExecute() {
        try {
            const serviceFolder = readdirSync(join(__dirname, 'Modules'), { withFileTypes: true }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.js')).map((dirent) => dirent.name);
            const initializeServices: ServiceStructure[] = [];

            for (const file of serviceFolder) {
                const { default: ServiceClass }: { default: new (client: SSN) => ServiceStructure } = await import(`../Services/Modules/${file}`);
                const service = new ServiceClass(this.controller);

                if (service.data) {
                    this.controller.discord.services.set(service.data.name, service);

                    if (service.data.initialize) {
                        initializeServices.push(service);
                    }
                }
            }

            for (const service of initializeServices) {
                await Util.executeService(service);
            }

            Logger.info('Services loaded successfully.', 'Services');
        } catch (err) {
            Logger.error((err as Error).message, Services.name);
            Logger.warn((err as Error).stack as string, Services.name);
        }
    }
}