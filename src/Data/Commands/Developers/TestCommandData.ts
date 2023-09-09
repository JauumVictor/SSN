import { CommandData } from '../../../Structures';
import { ApplicationCommandType } from 'discord.js';

class TestCommandDataConstructor extends CommandData {
    constructor() {
        super({
            name: 'teste',
            description: 'A test command for developers',
            type: ApplicationCommandType.ChatInput,
            name_localizations: {
                'pt-BR': 'teste',
                'en-US': 'test'
            },
            description_localizations: {
                'pt-BR': 'Um comando de teste para os desenvolvedores',
                'en-US': 'A test command for developers'
            },
            category: '⚙️ Desenvolvedores',
            aliases: ['test'],
            usage: ['<any>'],
            permissions: {
                client: [],
                member: []
            },
            config: {
                cooldown: 10,
                devOnly: true,
                interactionOnly: false,
                registerSlash: false,
                args: false
            }
        });
    }
}

export const TestCommandData = new TestCommandDataConstructor();