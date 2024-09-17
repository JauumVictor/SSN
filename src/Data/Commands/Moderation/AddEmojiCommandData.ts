import { CommandData } from '../../../structures';
import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js';

class AddEmojiCommandDataConstructor extends CommandData {
    constructor() {
        super({
            name: 'add-emoji',
            description: 'Shows the avatar of the mentioned user or your own avatar.',
            type: ApplicationCommandType.ChatInput,
            name_localizations: {
                'pt-BR': 'add-emoji',
                'en-US': 'add-emoji'
            },
            description_localizations: {
                'pt-BR': 'Adiciona emoji ao servidor.',
                'en-US': 'Adds emoji to guild.'
            },
            category: '⚙️ Moderation',
            aliases: ['addemoji', 'emojiadd'],
            usage: ['<emoji>'],
            permissions: {
                client: ['EmbedLinks', 'ManageEmojisAndStickers', 'UseExternalEmojis'],
                member: ['ManageEmojisAndStickers', 'UseExternalEmojis']
            },
            config: {
                cooldown: 10,
                devOnly: false,
                interactionOnly: false,
                registerSlash: true,
                args: true
            },
            options: [
                {
                    name: 'emoji',
                    description: 'Emoji to be added:',
                    type: ApplicationCommandOptionType.String,
                    name_localizations: {
                        'pt-BR': 'emoji',
                        'en-US': 'emoji'
                    },
                    description_localizations: {
                        'pt-BR': 'Emoji a ser adicionado:',
                        'en-US': 'Emoji to be added:'
                    },
                    required: false
                }
            ]
        });
    }
}

export const AddEmojiCommandData = new AddEmojiCommandDataConstructor();