import { SSN } from '../Client';
import { ModuleStructure, ClientEmbed } from '../Structures';
import { Collection, Message, PermissionFlagsBits, TextChannel, Snowflake } from 'discord.js';
import ms from 'ms';

interface SpamMap {
    msgCount: number;
    lastMessage: Message;
    timer: NodeJS.Timeout;
}

const map: Collection<Snowflake, SpamMap> = new Collection();

export default class SpamModule extends ModuleStructure {
    constructor(client: SSN) {
        super(client);
    }

    moduleExecute(message: Message) {
        if (message.guild) {
            const difference = 3000;
            const limit = 5;
            const time = 1000 * 60 * 2;

            try {
                if (['1149464095410634793'].includes(message.channel.id)) return;

                if (map.has(message.author.id)) {
                    const data = map.get(message.author.id);

                    if (data) {
                        const { lastMessage, timer, msgCount } = data;
                        const diff = message.createdTimestamp - lastMessage.createdTimestamp;

                        if (diff >= difference) {
                            clearTimeout(timer);
                            map.set(message.author.id, { msgCount: 1, lastMessage: message, timer: setTimeout(() => map.delete(message.author.id), time) });
                        } else {
                            const newCount = msgCount + 1;

                            if (newCount === limit) {
                                map.delete(message.author.id);

                                if (!message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
                                    const embed = new ClientEmbed(true, this.client)
                                        .setDescription(`Você está enviando muitas mensagens simultaneamente, você foi mutado e será desmutado em **${ms(time)}**.`);

                                    const log = new ClientEmbed(true, this.client)
                                        .setThumbnail(message.author.displayAvatarURL({ extension: 'png', size: 4096 }))
                                        .setDescription(`O usuário \`${message.author.tag} (${message.author.id})\` estava enviando muitas mensagens simultaneamente, ele foi mutado e será desmutado em \`${ms(time)}\`.`);

                                    message.member?.timeout(time, `Membro castigado automaticamente pelo sistema anti-spam do ${this.client.user?.username}.`)
                                        .then(async () => {
                                            message.reply({ embeds: [embed] });

                                            const channel = await this.client.channels.fetch(process.env.LOG_CHANNEL).catch(() => undefined) as TextChannel;
                                            channel.send({ embeds: [log] });
                                        })
                                        .catch(() => undefined);
                                }
                            } else {
                                map.set(message.author.id, { msgCount: newCount, lastMessage, timer });
                            }
                        }
                    }
                } else {
                    map.set(message.author.id, { msgCount: 1, lastMessage: message, timer: setTimeout(() => map.delete(message.author.id), time) });
                }
            } catch (err) {
                this.client.logger.error((err as Error).message, SpamModule.name);
                this.client.logger.warn((err as Error).stack as string, SpamModule.name);
            }
        }
    }
}