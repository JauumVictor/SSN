import { Client, Collection, Snowflake, Invite, GatewayIntentBits, Partials } from 'discord.js';
import { Telegram } from 'puregram';
import { Util, Logger } from './Utils/Util';
import { CommandStructure, ListenerStructure, ServiceStructure, TelegramListenerStructure } from './Structures';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export class SSN extends Client {
    public readonly logger: Logger = new Logger();
    public readonly utils: Util = new Util();
    public readonly developers: ReadonlyArray<string> = Object.freeze([process.env.OWNER_ID]);
    public readonly commands: Collection<string, CommandStructure> = new Collection();
    public readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
    public readonly services: Collection<string, ServiceStructure> = new Collection();
    public invites: Collection<string, Collection<string, Invite>> = new Collection();
    public codeUses: Collection<string, Invite> = new Collection();

    public constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildVoiceStates
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.User,
                Partials.GuildMember,
                Partials.Reaction
            ],
            allowedMentions: {
                parse: [
                    'users',
                    'roles'
                ],
                repliedUser: true
            },
            rest: {
                version: '10'
            },
            presence: {
                status: process.env.STATE == 'development' ? 'idle' : 'online'
            }
        });
    }

    public async initialize() {
        await this.loadCommands();
        await this.loadEvents();
        await this.registerSlashCommands();
        await super.login(process.env.CLIENT_TOKEN);
        await this.clientManager();

        process.on('uncaughtException', (err: Error) => this.logger.error((err as Error).stack as string, 'uncaughtException'));
        process.on('unhandledRejection', (err: Error) => this.logger.error((err as Error).stack as string, 'unhandledRejection'));
    }

    public async clientManager(): Promise<void> {
        const { default: servicesIndex } = await import('./Services/index');
        new servicesIndex(this).moduleExecute();
    }

    public async registerSlashCommands(): Promise<void> {
        const { default: registerSlash } = await import('../registerSlash');
        new registerSlash(this).registerSlash();
    }

    private async loadCommands(): Promise<void> {
        const commandFolders = readdirSync(join(__dirname, 'Commands'), { withFileTypes: true }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

        const commands = await Promise.all(
            commandFolders.map(async (folder) => {
                const commandFiles = readdirSync(join(__dirname, 'Commands', folder), { withFileTypes: true }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.js')).map((dirent) => dirent.name);

                const folderCommands = await Promise.all(
                    commandFiles.map(async (file) => {
                        const { default: CommandClass }: { default: new (client: SSN) => CommandStructure } = await import(join(__dirname, 'Commands', folder, file));
                        const command = new CommandClass(this);

                        this.commands.set(command.data.options.name, command);
                    })
                );

                return folderCommands;
            })
        );

        this.logger.info(`${commands.flat().length} commands loaded successfully.`, 'Commands');
    }

    private async loadEvents(): Promise<void> {
        const listenersFolders = readdirSync(join(__dirname, 'Listeners/Client'), { withFileTypes: true }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.js')).map((dirent) => dirent.name);

        const listeners = await Promise.all(
            listenersFolders.map(async (file) => {
                const { default: EventClass }: { default: new (client: SSN) => ListenerStructure } = await import(join(__dirname, 'Listeners/Client', file));
                const event = new EventClass(this);

                return event.options.once
                    ? this.once(event.options.name, (...args) => event.eventExecute(...args))
                    : this.on(event.options.name, (...args) => event.eventExecute(...args));
            })
        );

        this.logger.info(`Added ${listeners.flat().length} listeners to the client.`, 'Listeners');
    }
}

export class Bot extends Telegram {
    public readonly logger: Logger = new Logger();
    public readonly discord: SSN = new SSN();

    public constructor() {
        super({
            token: process.env.TELEGRAM_TOKEN
        });
    }

    async initialize() {
        await this.discord.initialize();
        await this.loadEvents();
        await this.updates.startPolling();
    }

    private async loadEvents(): Promise<void> {
        const listenersFolders = readdirSync(join(__dirname, 'Listeners/Telegram'), { withFileTypes: true }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.js')).map((dirent) => dirent.name);

        const listeners = await Promise.all(
            listenersFolders.map(async (file) => {
                const { default: EventClass }: { default: new (client: Bot) => TelegramListenerStructure } = await import(join(__dirname, 'Listeners/Telegram', file));
                const event = new EventClass(this);

                return this.updates.on(event.options.name, (...args) => event.eventExecute(...args));
            })
        );

        this.logger.info(`Added ${listeners.flat().length} listeners to the telegram client.`, 'Telegram Listeners');
    }
}