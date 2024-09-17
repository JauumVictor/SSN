import { createConnection } from 'mysql2/promise';
import { SSN } from '../../ssn';
import { ServiceStructure } from '../../structures';
import { Logger } from '../../utils/logger';

export default class DatabaseService extends ServiceStructure {
    constructor(controller: SSN) {
        super(controller, {
            name: 'loadDatabase',
            initialize: true
        });
    }

    serviceExecute() {
        try {
            createConnection({
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
            })
                .then((connection) => {
                    this.controller.discord.connection = connection;
                    Logger.info('Database connection established!', DatabaseService.name);
                })
                .catch((err) => {
                    Logger.error((err as Error).message, DatabaseService.name);
                    Logger.warn((err as Error).stack as string, DatabaseService.name);
                 });
        } catch (err) {
            Logger.error((err as Error).message, DatabaseService.name);
            Logger.warn((err as Error).stack as string, DatabaseService.name);
        }
    }
}