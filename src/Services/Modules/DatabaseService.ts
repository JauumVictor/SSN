import { createConnection } from 'mysql2/promise';
import { SSN } from '../../ssn';
import { ServiceStructure } from '../../structures';
import { Logger } from '../../utils/logger';
import { Database } from '../../database/Database';

export default class DatabaseService extends ServiceStructure {
    constructor(controller: SSN) {
        super(controller, {
            name: 'loadDatabase',
            initialize: true
        });
    }

    async serviceExecute() {
        try {
            this.controller.discord.connection = await createConnection({
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                host: process.env.MYSQL_HOST
            });

            Database.connect(this.controller.discord.connection);
            Logger.info('Database connection established!', DatabaseService.name);

            try {
                Database.createTables();
            } catch (err) {
                Logger.error((err as Error).message, DatabaseService.name);
                Logger.warn((err as Error).stack as string, DatabaseService.name);
            }
        } catch (err) {
            Logger.error((err as Error).message, DatabaseService.name);
            Logger.warn((err as Error).stack as string, DatabaseService.name);
        }
    }
}