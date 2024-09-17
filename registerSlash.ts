import { RawCommandData } from './src/structures';
import { ApplicationCommand, REST, Routes } from 'discord.js';
import { Logger } from './src/utils/logger';
import { DiscordBot } from './src/discord';

export class RegisterSlashCommands {
    public static async registerSlash(client: DiscordBot) {
        const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);
        const applications: RawCommandData[] = client.commands.map((command) => command.data.options);

        try {
            const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: applications }) as ApplicationCommand[];

            Logger.info(`Updated ${data.length} slash command(s) (/) successfully!`, 'Slash Commands');
        } catch (error) {
            console.error(error);
        }
    }
}
