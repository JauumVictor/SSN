import { CommandData } from '../../../structures';
import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js';

class EvalCommandDataConstructor extends CommandData {
    constructor() {
        super({
            name: 'eval',
            description: 'Evaluates a code line',
            type: ApplicationCommandType.ChatInput,
            name_localizations: {
                'pt-BR': 'eval',
                'en-US': 'eval'
            },
            description_localizations: {
                'pt-BR': 'Executa uma linha de código',
                'en-US': 'Evaluates a code line'
            },
            category:  '⚙️ Desenvolvedores',
            aliases:  [],
            usage:  ['<code>'],
            permissions: {
                client: ['EmbedLinks'],
                member: []
            },
            config: {
                cooldown: 10,
                devOnly: true,
                interactionOnly: false,
                registerSlash: true,
                args: true
            },
            options: [
                {
                    name: 'code',
                    description: 'Insert a code:',
                    type: ApplicationCommandOptionType.String,
                    name_localizations: {
                        'pt-BR': 'código',
                        'en-US': 'code'
                    },
                    description_localizations: {
                        'pt-BR': 'Insira um código:',
                        'en-US': 'Insert a code:'
                    },
                    required: false
                }
            ]
        });
    }
}

export const EvalCommandData = new EvalCommandDataConstructor();