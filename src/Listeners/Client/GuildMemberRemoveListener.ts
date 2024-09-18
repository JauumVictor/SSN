import { SSN } from '../../ssn';
import { ListenerStructure } from '../../structures';
import { Events, GuildMember, PermissionFlagsBits, VoiceChannel } from 'discord.js';
import { Logger } from '../../utils/logger';

export default class GuildMemberRemoveListener extends ListenerStructure {
    constructor(controller: SSN) {
        super(controller, {
            name: Events.GuildMemberRemove
        });
    }

    eventExecute(member: GuildMember): void {
        try {
            const guild = this.controller.discord.guilds.cache.get(process.env.GUILD_ID);

            if (guild) {
                const guildMembersSize = (guild.memberCount - guild.members.cache.filter((member) => member.user.bot).size);
                const voiceChannel = guild.channels.cache.get('1150102363797999706') as VoiceChannel;

                if (member.guild.id === guild.id) {
                    if (guild?.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) {
                        voiceChannel.setName('✦・' + guildMembersSize);
                    }
                }
            }
        } catch (err) {
            Logger.error((err as Error).message, GuildMemberRemoveListener.name);
            Logger.warn((err as Error).stack, GuildMemberRemoveListener.name);
        }
    }
}