import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { APIEmbed } from 'discord-api-types/v10';
import { DiscordBot } from '../discord';

class ClientEmbed extends EmbedBuilder {
    constructor(footer = false, client?: DiscordBot,  data?: APIEmbed) {
        super(data);
        this.setColor(process.env.EMBED_COLOR as ColorResolvable);

        if (footer && client) {
            this.setFooter({ text: `${client.user?.username}©`, iconURL: client.user?.displayAvatarURL({ extension: 'png', size: 4096 }) });
            this.setTimestamp();
        }
    }
}

export { ClientEmbed };