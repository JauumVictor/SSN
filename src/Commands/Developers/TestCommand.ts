import { SSN } from '../../Client';
import { CommandStructure } from '../../Structures';
import { Message } from 'discord.js';
import { rulesEmbed, rulesEmbedFooter } from '../../Utils/Objects/embeds';
import { TestCommandData } from '../../Data/Commands/Developers/TestCommandData';

export default class avatarCommand extends CommandStructure {
    constructor(client: SSN) {
        super(client, TestCommandData);
    }

    commandExecute({ message }: { message: Message }) {
        return void message.channel.send({ embeds: [rulesEmbed(), rulesEmbedFooter()] });
    }
}