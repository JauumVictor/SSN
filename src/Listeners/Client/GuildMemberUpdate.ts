import { Events, GuildMember, Message, TextChannel } from 'discord.js';
import { ClientEmbed, ListenerStructure } from '../../structures';
import { SSN } from '../../ssn';
import { Logger } from '../../utils/logger';

export default class guildMemberUpdateEvent extends ListenerStructure {
    constructor(controller: SSN) {
        super(controller, {
            name: Events.GuildMemberUpdate
        });
    }

    eventExecute(oldMember: GuildMember, newMember: GuildMember) {
        try {
            const guild = newMember.guild;
            const premiumRole = guild.roles.premiumSubscriberRole?.id;

            if (premiumRole) {
                const hadRole = oldMember.roles.cache.has(premiumRole);
                const hasRole = newMember.roles.cache.has(premiumRole);

                const boosted = new ClientEmbed()
                    .setColor(0xfa85c4)
                    .setTitle(`<a:p_booster:1133214590562488401> O ${guild.name} levou um impulso!`)
                    .setDescription(`${newMember}, deu impulso no servidor! <a:w_hellokitty:1133215597073801216>`);

                const newBoost = new ClientEmbed()
                    .setColor(0xfa85c4)
                    .setTitle(`O ${guild.name} ganhou um impulso!`)
                    .setDescription(`O usuário ${newMember} impulsionou o ${guild.name}. 💞`);

                const removed = new ClientEmbed()
                    .setColor(0xfa85c4)
                    .setTitle(`O ${guild.name} perdeu um impulso..`)
                    .setDescription(`Infelizmente o/a ${newMember} rSSNveu o impulso do ${guild.name}. 💔`);

                // Cargo adicionado:
                if (!hadRole && hasRole) {
                    (newMember.guild.channels.cache.get(process.env.GENERAL_CHANNEL) as TextChannel)?.send({ content: `${newMember}`, embeds: [boosted] })
                        .then((msg: Message) => msg.react('<a:p_heart:1133215054788051008>'))
                        .catch(() => { });

                    newMember.guild.members.cache.get(process.env.OWNER_ID)?.send({ content: `Usuário: ${newMember} (${newMember.id})`, embeds: [newBoost] })
                        .catch(() => { });
                }

                // Cargo removido:
                if (!hasRole && hadRole) {
                    newMember.guild.members.cache.get(process.env.OWNER_ID)?.send({ content: `Usuário: ${newMember} (${newMember.id})`, embeds: [removed] })
                        .catch(() => { });
                }
            }
        } catch (err) {
            Logger.error((err as Error).message, guildMemberUpdateEvent.name);
            Logger.warn((err as Error).stack as string, guildMemberUpdateEvent.name);
        }
    }
}