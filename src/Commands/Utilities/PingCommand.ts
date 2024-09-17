import { SSN } from '../../ssn';
import { CommandStructure, ClientEmbed } from '../../structures';
import { PingCommandData } from '../../Data/Commands/Utilities/PingCommandData';
import { Colors, Message, OmitPartialGroupDMChannel } from 'discord.js';

export default class pingCommand extends CommandStructure {
    constructor(controller: SSN) {
        super(controller, PingCommandData);
    }

    commandExecute({ message }: { message: OmitPartialGroupDMChannel<Message> }): void {
        const created = Math.round(Date.now() - message.createdTimestamp);
        const host = Math.round(this.controller.discord.ws.ping);

        const embed = new ClientEmbed(true, this.controller.discord)
            .setTitle('Pong! 🏓')
            .setDescription(`💓 **Ping de resposta:** \`${created}\`ms \n` + `🛰️ **Ping da host**: \`${host}\`ms.`);

        switch (true) {
            case (created >= 500):
                embed.setColor(Colors.Red);
                break;
            case (created >= 300 && created <= 499):
                embed.setColor(Colors.Yellow);
                break;
            case (created <= 299):
                embed.setColor(Colors.Green);
                break;
        }

        return void message.reply({ embeds: [embed] });
    }
}