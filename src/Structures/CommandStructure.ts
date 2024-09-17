import { type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { ApplicationCommandType, Awaitable, Message, OmitPartialGroupDMChannel, PermissionResolvable } from 'discord.js';
import { SSN } from '../ssn';

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
    controller: SSN;
    data: CommandData;

    constructor(controller: SSN, data: CommandData) {
        this.controller = controller;
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

    abstract commandExecute({ message, args, prefix }: { message: OmitPartialGroupDMChannel<Message>, args: string[], prefix: string }): Awaitable<Message | void> | Message | void
}

export { CommandData, CommandStructure, RawCommandData };
