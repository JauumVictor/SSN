import { ChatInputCommandInteraction, Message } from 'discord.js';
import { inspect } from 'node:util';
import { SSN } from '../../ssn';
import { EvalCommandData } from '../../Data/Commands/Utilities/EvalCommandData';
import { CommandStructure } from '../../structures';

export default class EvalCommand extends CommandStructure {
    constructor(controller: SSN) {
        super(controller, EvalCommandData);
    }

    async commandExecute({ message, args }: { message: Message | ChatInputCommandInteraction, args: string[] }): Promise<void> {
        const code = args.join(' ') ?? '';

        try {
            const result = await Promise.any([eval(code), Promise.reject()]);
            const evaled = inspect(result, { depth: 0 });

            return void message.reply({
                content: `\`\`\`js\n${evaled.slice(0, 1970)}\`\`\``
            });
        } catch (err) {
            return void message.reply({
                content: `\`\`\`js\n${(err as Error).message.slice(0, 2000)}\`\`\``
            });
        }
    }
}