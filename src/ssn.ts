import { readdirSync } from 'fs';
import { DiscordBot } from './discord';
import { TelegramBot } from './telegram';
import { Logger } from './utils/logger';
import { join } from 'path';
import { CommandStructure, ListenerStructure, TelegramListenerStructure } from './structures';
import { RegisterSlashCommands } from '../registerSlash';

export class SSN {
    constructor(public discord: DiscordBot, public telegram: TelegramBot) {
        this.discord = discord;
        this.telegram = telegram;
    }

    public async start(): Promise<void> {
        await this.loadDiscordCommands();
        await this.loadDiscordEvents();
        await this.loadTelegramEvents();
        await this.clientManager();
        await RegisterSlashCommands.registerSlash(this.discord);
    }

    public async clientManager(): Promise<void> {
        const { default: servicesIndex } = await import('./Services/index');
        new servicesIndex(this).moduleExecute();
    }  

    private async loadDiscordCommands(): Promise<void> {
        const commandFolders = readdirSync(join(__dirname, 'Commands'), { withFileTypes: true }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

        const commands = await Promise.all(
            commandFolders.map(async (folder) => {
                const commandFiles = readdirSync(join(__dirname, 'Commands', folder), { withFileTypes: true }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.js')).map((dirent) => dirent.name);

                const folderCommands = await Promise.all(
                    commandFiles.map(async (file) => {
                        const { default: CommandClass }: { default: new (client: SSN) => CommandStructure } = await import(join(__dirname, 'Commands', folder, file));
                        const command = new CommandClass(this);

                        this.discord.commands.set(command.data.options.name, command);
                    })
                );

                return folderCommands;
            })
        );

        Logger.info(`${commands.flat().length} commands loaded successfully.`, 'Commands');
    }

    private async loadDiscordEvents(): Promise<void> {
        const listenersFolders = readdirSync(join(__dirname, 'Listeners/Client'), { withFileTypes: true }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.js')).map((dirent) => dirent.name);

        const listeners = await Promise.all(
            listenersFolders.map(async (file) => {
                const { default: EventClass }: { default: new (client: SSN) => ListenerStructure } = await import(join(__dirname, 'Listeners/Client', file));
                const event = new EventClass(this);

                return event.options.once
                    ? this.discord.once(event.options.name, (...args) => event.eventExecute(...args))
                    : this.discord.on(event.options.name, (...args) => event.eventExecute(...args));
            })
        );

        Logger.info(`Added ${listeners.flat().length} listeners to the client.`, 'Listeners');
    }

    private async loadTelegramEvents(): Promise<void> {
        const listenersFolders = readdirSync(join(__dirname, 'Listeners/Telegram'), { withFileTypes: true }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.js')).map((dirent) => dirent.name);

        const listeners = await Promise.all(
            listenersFolders.map(async (file) => {
                const { default: EventClass }: { default: new (client: SSN) => TelegramListenerStructure } = await import(join(__dirname, 'Listeners/Telegram', file));
                const event = new EventClass(this);

                return this.telegram.updates.on(event.options.name, (...args) => event.eventExecute(...args as any));
            })
        );

        Logger.info(`Added ${listeners.flat().length} listeners to the telegram client.`, 'Telegram Listeners');
    }
}