import { SSN } from './src/Client';
import { RawCommandData } from './src/Structures';
import { ApplicationCommand, REST, Routes } from 'discord.js';

export default class RegisterSlashCommands {
    readonly client: SSN;

    constructor(client: SSN) {
        this.client = client;
    }

    async registerSlash() {
        const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);
        const applications: RawCommandData[] = this.client.commands.map((command) => command.data.options);

        try {
            const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: applications }) as ApplicationCommand[];

            this.client.logger.info(`Updated ${data.length} slash command(s) (/) successfully!`, 'Slash Commands');
        } catch (error) {
            console.error(error);
        }
    }
}
