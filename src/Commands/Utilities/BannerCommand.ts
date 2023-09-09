import { SSN } from '../../Client';
import { CommandStructure, ClientEmbed } from '../../Structures/';
import { BannerCommandData } from '../../Data/Commands/Utilities/BannerCommandData';
import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default class bannerCommand extends CommandStructure {
    constructor(client: SSN) {
        super(client, BannerCommandData);
    }

    async commandExecute({ message, args }: { message: Message, args: string[] }) {
        const user = message.mentions?.users.first() || await this.client.users.fetch(args[0]).catch(() => undefined) || message.author;

        user.fetch()
            .then((user) => {
                const banner = user.bannerURL({ extension: 'png', size: 4096 });

                if (!banner) {
                    return message.reply({ content: `${message.author}, este usuário não possui um banner.` });
                } else {
                    const embed = new ClientEmbed(true, this.client)
                        .setTitle('📷 Banner de Perfil')
                        .addFields({ name: 'Banner de:', value: `\`${user.username}\``, inline: true })
                        .setImage(banner);

                    const button = new ButtonBuilder()
                        .setEmoji('🔗')
                        .setLabel('Baixar')
                        .setURL(banner)
                        .setStyle(ButtonStyle.Link);

                    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
                    return message.reply({ embeds: [embed], components: [row] });
                }
            });
    }
}