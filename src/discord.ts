import { Client, Collection, Snowflake, Invite, ClientOptions } from 'discord.js';
import { CommandStructure, ServiceStructure } from './structures';
import { Logger } from './utils/logger';
import { Connection } from 'mysql2/promise';
import { Database } from './database/database';
import { RegisterSlashCommands } from '../registerSlash';

type DataType = 'user' | 'guild' | 'client' | 'command';

export class DiscordBot extends Client {
    public readonly developers: readonly string[] = Object.freeze([process.env.OWNER_ID]);
    public readonly commands = new Collection<string, CommandStructure>();
    public readonly cooldowns = new Collection<string, Collection<Snowflake, number>>();
    public readonly services = new Collection<string, ServiceStructure>();
    public invites = new Collection<string, Collection<string, Invite>>();
    public codeUses = new Collection<string, Invite>();
    public connection!: Connection;

    public constructor(options: ClientOptions) {
        super(options);
    }

    public async initialize() {
        await super.login(process.env.CLIENT_TOKEN);
        await RegisterSlashCommands.registerSlash(this);

        process.on('uncaughtException', (err: Error) => { Logger.error((err).stack, 'uncaughtException'); });
        process.on('unhandledRejection', (err: Error) => { Logger.error((err).stack, 'unhandledRejection'); });
    }

    public async getData(id: string | undefined, type: DataType) {
        switch (type) {
            case 'guild': {
                if (id) {
                    const guild = await this.guilds.fetch(id).catch(() => undefined);

                    if (guild) {
                        let data = await Database.guild.getGuild(guild.id);

                        try {
                            if (!data) {
                                data = await Database.guild.createGuild(guild);
                            }

                            return data;
                        } catch (err) {
                            Logger.error((err as Error).message, [DiscordBot.name, this.getData.name]);
                            Logger.warn((err as Error).stack, [DiscordBot.name, this.getData.name]);
                        }
                    } else {
                        return undefined;
                    }
                }
                break;
            }
        }
    }
}