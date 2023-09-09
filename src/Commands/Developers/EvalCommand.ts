import { SSN } from '../../Client';
import { CommandStructure } from '../../Structures';
import { EvalCommandData } from '../../Data/Commands/Utilities/EvalCommandData';
import { Message } from 'discord.js';
import { inspect } from 'node:util';

export default class EvalCommand extends CommandStructure {
    constructor(client: SSN) {
        super(client, EvalCommandData);
    }

    async commandExecute({ message, args }: { message: Message, args: string[] }): Promise<any> {
        const code = args.join(' ') ?? '';

        try {
            const result = await Promise.any([eval(code), Promise.reject()]);
            const evaled = inspect(result, { depth: 0 });

            return message.reply({
                content: `\`\`\`js\n${evaled.slice(0, 1970)}\`\`\``
            });
        } catch (err) {
            return message.reply({
                content: `\`\`\`js\n${(err as Error).message.slice(0, 2000)}\`\`\``
            });
        }
    }
}