import { SSN } from '../../ssn';
import { ListenerStructure } from '../../structures';
import { Events, Guild } from 'discord.js';
import { Logger } from '../../utils/logger';

export default class GuildCreateListener extends ListenerStructure {
    constructor(controller: SSN) {
        super(controller, {
            name: Events.GuildCreate,
            once: true
        });
    }

    async eventExecute(guild: Guild): Promise<void> {
        try {
            const guildData = await this.controller.discord.getData(guild.id, 'guild');

            Logger.info(`The guild ${guildData?.guildName} has been added to the database.`, GuildCreateListener.name);
        } catch (err) {
            Logger.error((err as Error).message, GuildCreateListener.name);
            Logger.warn((err as Error).stack, GuildCreateListener.name);
        }
    }
}