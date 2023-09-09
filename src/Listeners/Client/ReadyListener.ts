import { SSN } from '../../Client';
import { ListenerStructure } from '../../Structures/';
import { Events, PermissionFlagsBits, VoiceChannel } from 'discord.js';

export default class readyListener extends ListenerStructure {
    constructor(client: SSN) {
        super(client, {
            name: Events.ClientReady,
            once: true
        });
    }

    eventExecute(): void {
        try {
            const guild = this.client.guilds.cache.get(process.env.GUILD_ID);

            this.client.guilds.cache.forEach(async (guild) => {
                if (guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    const invites = await guild.invites.fetch();

                    invites.each((inv) => this.client.codeUses.set(inv.code, inv));
                }
            });

            if (guild) {
                const guildMembersSize = (guild.memberCount - guild.members.cache.filter((member) => member.user.bot).size);
                const voiceChannel = guild.channels.cache.get('1150102363797999706') as VoiceChannel;

                if (guild?.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    voiceChannel.setName('✦・' + guildMembersSize);
                }
            }


            this.client.logger.info(`${this.client.user?.username} has been loaded completely.`, 'Ready');
        } catch (err) {
            this.client.logger.error((err as Error).message, readyListener.name);
            this.client.logger.warn((err as Error).stack as string, readyListener.name);
        }
    }
}