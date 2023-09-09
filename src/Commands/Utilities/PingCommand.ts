import { SSN } from '../../Client';
import { CommandStructure, ClientEmbed } from '../../Structures/';
import { PingCommandData } from '../../Data/Commands/Utilities/PingCommandData';
import { Colors, Message } from 'discord.js';

export default class pingCommand extends CommandStructure {
    constructor(client: SSN) {
        super(client, PingCommandData);
    }

    commandExecute({ message }: { message: Message }) {
        const created = Math.round(Date.now() - message.createdTimestamp);
        const host = Math.round(this.client.ws.ping);

        const embed = new ClientEmbed(true, this.client)
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