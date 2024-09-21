import { Guild } from 'discord.js';
import { Database } from './database';
import { GuildSchema } from '../types/guildSchema';
import { Logger } from '../utils/logger';
import { Connection } from 'mysql2/promise';

export class DatabaseGuild {
    public constructor(private connection: Connection) {
        this.connection = connection;
    }

    public async createGuild(guild: Guild): Promise<GuildSchema | null> {
        if(!this.connection) return null;

        try {
            await this.connection.query(`
                INSERT INTO Guilds 
                (GuildID, GuildName, GuildOwnerID, CreatedAt) 
                VALUES ('${guild.id}', '${guild.name}', '${guild.ownerId}', '${guild.createdAt}')
            `);

            await this.connection.query(`
                INSERT INTO GuildSettings
                (GuildID, Prefix)
                VALUES ('${guild.id}', '${process.env.PREFIX}')
            `);

            const data = await this.getGuild(guild.id);

            if (!data) {
                return null;
            } else {
                return data;
            }
        } catch (err) {
            Logger.error((err as Error).message, [Database.name, this.createGuild.name]);
            Logger.warn((err as Error).stack, [Database.name, this.createGuild.name]);

            return null;
        }
    }

    public async deleteGuild(guildID: string): Promise<boolean> {
        if(!this.connection) return false;

        try {
            await this.connection.execute(`
                DELETE FROM Guilds
                WHERE GuildID = '${guildID}'
            `);

            return true;
        } catch (err) {
            Logger.error((err as Error).message, [Database.name, this.deleteGuild.name]);
            Logger.warn((err as Error).stack, [Database.name, this.deleteGuild.name]);

            return false;
        }
    }

    public async getGuild(guildID: string): Promise<GuildSchema | null> {
        if(!this.connection) return null;

        try {
            const rows = await this.connection.query(`
                    SELECT *
                    FROM Guilds
                    JOIN GuildSettings ON Guilds.guildID = GuildSettings.guildID
                    WHERE Guilds.guildID = '${guildID}'
                `);

            return rows[0][0] as GuildSchema;
        } catch (err) {
            Logger.error((err as Error).message, [Database.name, this.getGuild.name]);
            Logger.warn((err as Error).stack, [Database.name, this.getGuild.name]);

            return null;
        }
    }
}