import { Guild } from "discord.js";
import { Connection } from "mysql2/promise";
import { Logger } from "../utils/logger";
import { join } from "node:path";
import { readdirSync, readFileSync } from "node:fs";
import { GuildSchema } from "../types/guildSchema";

export class Database {
    private static connection: Connection;

    private constructor(connection: Connection) {
        Database.connection = connection;
    }

    public static async connect(connection: Connection) {
        Database.connection = connection;
    }

    public static async createGuild(guild: Guild): Promise<GuildSchema | null> {
        try {
            await Database.connection.query(`
                INSERT INTO Guilds 
                (GuildID, GuildName, GuildOwnerID, CreatedAt) 
                VALUES ('${guild.id}', '${guild.name}', '${guild.ownerId}', '${guild.createdAt}')
            `);

            await Database.connection.query(`
                INSERT INTO GuildSettings
                (GuildID, Prefix)
                VALUES ('${guild.id}', '${process.env.PREFIX}')
            `);

            const data = await Database.getGuild(guild.id);

            if (!data) {
                return null;
            } else {
                return data;
            }
        } catch (err) {
            Logger.error((err as Error).message, [Database.name, Database.createGuild.name]);
            Logger.warn((err as Error).stack as string, [Database.name, Database.createGuild.name]);

            return null;
        }
    }

    public static async deleteGuild(guildID: string): Promise<boolean> {
        try {
            await Database.connection.execute(`
                DELETE FROM Guilds
                WHERE GuildID = '${guildID}'
            `);

            return true;
        } catch (err) {
            Logger.error((err as Error).message, [Database.name, Database.deleteGuild.name]);
            Logger.warn((err as Error).stack as string, [Database.name, Database.deleteGuild.name]);

            return false;
        }
    }

    public static async getGuild(guildID: string): Promise<GuildSchema | null> {
        try {
            const rows = await this.connection.query(`
                    SELECT *
                    FROM Guilds g
                    JOIN GuildSettings gs ON g.GuildID = gs.GuildID
                    WHERE g.GuildID = '${guildID}'
                `);

            return rows[0][0] as GuildSchema;
        } catch (err) {
            Logger.error((err as Error).message, [Database.name, Database.getGuild.name]);
            Logger.warn((err as Error).stack as string, [Database.name, Database.getGuild.name]);

            return null;
        }
    }

    public static async createTables() {
        try {
            const schemasFolders = readdirSync(join('src', 'schemas'), { withFileTypes: true }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.sql')).map((dirent) => dirent.name);

            await Promise.all(
                schemasFolders.map(async (file) => {
                    const sql = readFileSync(join('src', 'schemas', file), 'utf-8');
                    await Database.connection.query(sql);
                })
            )

            Logger.info('Tables created successfully!', [Database.name, Database.createTables.name]);
        } catch (err) {
            Logger.error((err as Error).message, [Database.name, Database.createTables.name]);
            Logger.warn((err as Error).stack as string, [Database.name, Database.createTables.name]);
        }
    }
}