import { SSN } from '../Client';
import { PermissionResolvable, ApplicationCommandType, Awaitable } from 'discord.js';
import { type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';

interface RawCommandData extends RESTPostAPIChatInputApplicationCommandsJSONBody {
    name: string;
    type: ApplicationCommandType.ChatInput;
    category: string;
    aliases: string[];
    usage: string[];
    permissions: {
        client: PermissionResolvable[],
        member: PermissionResolvable[]
    };
    config: {
        cooldown: number,
        devOnly: boolean,
        interactionOnly: boolean,
        registerSlash: boolean,
        args: boolean
    };
}

abstract class CommandData {
    options: RawCommandData;

    constructor(options: RawCommandData) {
        this.options = options;
    }
}

abstract class CommandStructure {
    client: SSN;
    data: CommandData;

    constructor(client: SSN, data: CommandData) {
        this.client = client;
        this.data = data;

        this.validateOptions();
    }

    validateOptions() {
        if (!this.data.options.name) {
            throw new Error('O nome do comando é obrigatório.');
        }

        if (![ApplicationCommandType.ChatInput, ApplicationCommandType.User, ApplicationCommandType.Message].includes(this.data.options.type)) {
            throw new Error('O tipo do comando deve ser um dos tipos suportados pela API.');
        }
    }

    commandExecute(...args: any[]): Awaitable<any> {
        return { args };
    }
}

export { CommandStructure, CommandData, RawCommandData };