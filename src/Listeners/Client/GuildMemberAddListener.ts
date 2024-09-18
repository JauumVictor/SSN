import { SSN } from '../../ssn';
import { ClientEmbed, ListenerStructure } from '../../structures';
import { Events, GuildMember, PermissionFlagsBits, TextChannel, VoiceChannel } from 'discord.js';
import { Logger } from '../../utils/logger';

export default class GuildMemberAddListener extends ListenerStructure {
    constructor(controller: SSN) {
        super(controller, {
            name: Events.GuildMemberAdd
        });
    }

    async eventExecute(member: GuildMember): Promise<void> {
        try {
            member.roles.add(process.env.INITIAL_ROLE).catch(() => { });
            const guild = this.controller.discord.guilds.cache.get(process.env.GUILD_ID);

            if (guild) {
                const guildMembersSize = (guild.memberCount - guild.members.cache.filter((member) => member.user.bot).size);
                const voiceChannel = guild.channels.cache.get('1150102363797999706') as VoiceChannel;

                if (member.guild.id === process.env.GUILD_ID) {
                    const generalChannel = this.controller.discord.channels.cache.get(process.env.GENERAL_CHANNEL) as TextChannel;

                    if (guild?.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) {
                        const newInvites = await guild.invites.fetch();
                        const cachedInvites = this.controller.discord.invites.get(member.guild.id);

                        if (cachedInvites) {
                            const usedInvite = newInvites.find((inv) => {
                                const invite = cachedInvites.get(inv.code);
                                return invite?.uses && inv.uses ? invite.uses < inv.uses : false;
                            });

                            const embed = new ClientEmbed(true, this.controller.discord)
                                .setTitle('Bem-vindo!!')
                                .setURL(`https://discord.gg/${usedInvite?.code}`)
                                .setDescription(`\`${member.user.tag}\` entrou no /ssn, convidado(a) por \`${usedInvite?.inviter?.username}\`.\nNº de usos: **${usedInvite?.uses}**`)
                                .setFooter({ text: guild.name });

                            newInvites.each((inv) => cachedInvites?.set(inv.code, inv));
                            this.controller.discord.invites.set(guild.id, cachedInvites);

                            const channel = guild.channels.cache.get(process.env.INVITE_CHANNEL) as TextChannel;
                            channel.send({ embeds: [embed] });
                        }
                    }

                    const embed = new ClientEmbed()
                        .setColor(0x2b2d31)
                        .setDescription(`bem-vindo(a) ${member.user} ao /ssn`);

                    voiceChannel.setName('✦・' + guildMembersSize);
                    generalChannel.send({ content: `${member.user}`, embeds: [embed] })
                        .then((message) => setTimeout(() => message.delete(), 20000));
                }
            }
        } catch (err) {
            Logger.error((err as Error).message, GuildMemberAddListener.name);
            Logger.warn((err as Error).stack, GuildMemberAddListener.name);
        }
    }
}