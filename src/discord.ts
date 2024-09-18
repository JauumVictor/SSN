import { Client, Collection, Snowflake, Invite, ClientOptions } from 'discord.js';
import { CommandStructure, ServiceStructure } from './structures';
import { Logger } from './utils/logger';
import { Connection } from 'mysql2/promise';
import { Database } from './database/Database';

type DataType = 'user' | 'guild' | 'client' | 'command';

export class DiscordBot extends Client {
    public readonly developers: ReadonlyArray<string> = Object.freeze([process.env.OWNER_ID]);
    public readonly commands: Collection<string, CommandStructure> = new Collection();
    public readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
    public readonly services: Collection<string, ServiceStructure> = new Collection();
    public invites: Collection<string, Collection<string, Invite>> = new Collection();
    public codeUses: Collection<string, Invite> = new Collection();
    public connection!: Connection;

    public constructor(options: ClientOptions) {
        super(options);
    }

    public async initialize() {
        await super.login(process.env.CLIENT_TOKEN);

        process.on('uncaughtException', (err: Error) => Logger.error((err as Error).stack as string, 'uncaughtException'));
        process.on('unhandledRejection', (err: Error) => Logger.error((err as Error).stack as string, 'unhandledRejection'));
    }

    public async getData<T extends DataType>(
        id: string | undefined,
        type: T
    ) {
        switch (type) {
            case 'guild': {
                if (id) {
                    const guild = await this.guilds.fetch(id).catch(() => undefined);

                    if (guild) {
                        let data = await Database.getGuild(guild.id);

                        try {
                            if (!data) {
                                data = await Database.createGuild(guild);
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