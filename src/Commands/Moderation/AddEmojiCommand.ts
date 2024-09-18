import { GuildEmoji, Message, OmitPartialGroupDMChannel, parseEmoji } from 'discord.js';
import { SSN } from '../../ssn';
import { ClientEmbed, CommandStructure } from '../../structures';
import { AddEmojiCommandData } from '../../Data/Commands/Moderation/AddEmojiCommandData';
import { Logger } from '../../utils/logger';

export default class AddEmojiCommand extends CommandStructure {
    constructor(controller: SSN) {
        super(controller, AddEmojiCommandData);
    }

    async commandExecute({ message, args }: { message: OmitPartialGroupDMChannel<Message>, args: string[] }) {
        const emojiEmbed = new ClientEmbed()
            .setTitle('🤠 Adicionando emojis!');

        const msg = await message.reply({ embeds: [emojiEmbed] });
        const array: GuildEmoji[] = [];

        for (const emoji of args) {
            const customEmoji = parseEmoji(emoji);

            if (customEmoji?.id) {
                const link = `https://cdn.discordapp.com/emojis/${customEmoji.id}.${customEmoji.animated ? 'gif' : 'png'}`;

                message.guild?.emojis.create({
                    attachment: link,
                    name: customEmoji.name,
                    reason: `Emoji created by ${message.author.username}.`
                })
                    .then((emoji) => {
                        array.push(emoji);
                        const emojisMap = array.map((x) => x).join('** ┆ **');

                        emojiEmbed.setFields({
                            name: 'Emojis adicionados:',
                            value: emojisMap
                        });

                        return msg.edit({ embeds: [emojiEmbed] });
                    })
                    .catch((err) => {
                        Logger.error(err.stack, AddEmojiCommand.name);
                        return message.reply({ content: `Ocorreu um erro ao adicionar o emoji: ${emoji}.` });
                    });
            }
        }
    }
}