import { SSN } from '../../ssn';
import { ListenerStructure } from '../../structures';
import { Events, PermissionFlagsBits, VoiceChannel } from 'discord.js';
import { Logger } from '../../utils/logger';

export default class readyListener extends ListenerStructure {
    constructor(controller: SSN) {
        super(controller, {
            name: Events.ClientReady,
            once: true
        });
    }

    eventExecute(): void {
        try {
            const guild = this.controller.discord.guilds.cache.get(process.env.GUILD_ID);

            this.controller.discord.guilds.cache.forEach(async (guild) => {
                if (guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    const invites = await guild.invites.fetch();

                    invites.each((inv) => this.controller.discord.codeUses.set(inv.code, inv));
                }
            });

            if (guild) {
                const guildMembersSize = (guild.memberCount - guild.members.cache.filter((member) => member.user.bot).size);
                const voiceChannel = guild.channels.cache.get('1150102363797999706') as VoiceChannel;

                if (guild?.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    voiceChannel.setName('✦・' + guildMembersSize);
                }
            }


            Logger.info(`${this.controller.discord.user?.username} has been loaded completely.`, 'Ready');
        } catch (err) {
            Logger.error((err as Error).message, readyListener.name);
            Logger.warn((err as Error).stack as string, readyListener.name);
        }
    }
}