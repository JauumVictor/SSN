import { Connection } from 'mysql2/promise';
import { Logger } from '../utils/logger';
import { join } from 'node:path';
import { readdirSync, readFileSync } from 'node:fs';
import { DatabaseGuild } from './guild';

export class Database {
    public static connection: Connection;
    public static guild: DatabaseGuild;

    public static connect(connection: Connection) {
        Database.connection = connection;
        Database.guild = new DatabaseGuild(connection);
    }

    public static async createTables(): Promise<void> {
        if(!Database.connection) return;

        try {
            const schemasFolders = readdirSync(join('src/schemas'), { withFileTypes: true }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.sql')).map((dirent) => dirent.name);

            await Promise.all(
                schemasFolders.map(async (file) => {
                    const sql = readFileSync(join('src/schemas', file), 'utf-8');
                    await Database.connection.query(sql);
                })
            );

            Logger.info('Tables created successfully!', [Database.name, Database.createTables.name]);
        } catch (err) {
            Logger.error((err as Error).message, [Database.name, Database.createTables.name]);
            Logger.warn((err as Error).stack, [Database.name, Database.createTables.name]);
        }
    }
}