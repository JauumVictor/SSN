import { SSN } from '../../Client';
import { CommandStructure, ClientEmbed } from '../../Structures';
import { AvatarCommandData } from '../../Data/Commands/Utilities/AvatarCommandData';
import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember } from 'discord.js';

export default class avatarCommand extends CommandStructure {
    constructor(client: SSN) {
        super(client, AvatarCommandData);
    }

    async commandExecute({ message, args }: { message: Message, args: string[] }) {
        const user = message.mentions?.users.first() || await this.client.users.fetch(args[0]).catch(() => undefined) || message.author;

        if (args[0] == 'avatar') {
            const member = message.guild?.members.cache.get(user.id) as GuildMember;
            const avatar = member.displayAvatarURL({ extension: 'png', size: 4096 });

            const embed = new ClientEmbed(true, this.client)
                .setTitle('📷 Avatar de Perfil')
                .addFields({ name: 'Avatar de:', value: `\`${member.user.username}\``, inline: true })
                .setImage(avatar);

            const button = new ButtonBuilder()
                .setEmoji('🔗')
                .setLabel('Baixar')
                .setURL(avatar)
                .setStyle(ButtonStyle.Link);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
            return message.reply({ embeds: [embed], components: [row] });
        } else {
            const avatar = user.displayAvatarURL({ extension: 'png', size: 4096 });

            const embed = new ClientEmbed(true, this.client)
                .setTitle('📷 Avatar de Perfil')
                .addFields({ name: 'Avatar de:', value: `\`${user.username}\``, inline: true })
                .setImage(avatar);

            const button = new ButtonBuilder()
                .setEmoji('🔗')
                .setLabel('Baixar')
                .setURL(avatar)
                .setStyle(ButtonStyle.Link);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
            return message.reply({ embeds: [embed], components: [row] });
        }
    }
}