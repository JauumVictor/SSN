import { Message, OmitPartialGroupDMChannel } from 'discord.js';
import { SSN } from '../../ssn';
import { TestCommandData } from '../../Data/Commands/Developers/TestCommandData';
import { CommandStructure } from '../../structures';
import { rulesEmbed, rulesEmbedFooter } from '../../utils/Objects/embeds';

export default class avatarCommand extends CommandStructure {
    constructor(controller: SSN) {
        super(controller, TestCommandData);
    }

    commandExecute({ message }: { message: OmitPartialGroupDMChannel<Message> }) {
        return void message.channel?.send({ embeds: [rulesEmbed(), rulesEmbedFooter()] });
    }
}