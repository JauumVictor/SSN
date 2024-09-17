import { Client, Collection, Snowflake, Invite, ClientOptions } from 'discord.js';
import { CommandStructure, ServiceStructure } from './structures';
import { Logger } from './utils/logger';
import { Connection } from 'mysql2/promise';

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
}