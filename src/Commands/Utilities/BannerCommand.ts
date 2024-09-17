import { SSN } from '../../ssn';
import { CommandStructure, ClientEmbed } from '../../structures';
import { BannerCommandData } from '../../Data/Commands/Utilities/BannerCommandData';
import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, OmitPartialGroupDMChannel } from 'discord.js';

export default class bannerCommand extends CommandStructure {
    constructor(controller: SSN) {
        super(controller, BannerCommandData);
    }

    async commandExecute({ message, args }: { message: OmitPartialGroupDMChannel<Message>, args: string[] }): Promise<void> {
        const user = message.mentions?.users.first() || await this.controller.discord.users.fetch(args[0]).catch(() => undefined) || message.author;

        user.fetch()
            .then((user) => {
                const banner = user.bannerURL({ extension: 'png', size: 4096 });

                if (!banner) {
                    return void message.reply({ content: `${message.author}, este usuário não possui um banner.` });
                } else {
                    const embed = new ClientEmbed(true, this.controller.discord)
                        .setTitle('📷 Banner de Perfil')
                        .addFields({ name: 'Banner de:', value: `\`${user.username}\``, inline: true })
                        .setImage(banner);

                    const button = new ButtonBuilder()
                        .setEmoji('🔗')
                        .setLabel('Baixar')
                        .setURL(banner)
                        .setStyle(ButtonStyle.Link);

                    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
                    return void message.reply({ embeds: [embed], components: [row] });
                }
            });
    }
}