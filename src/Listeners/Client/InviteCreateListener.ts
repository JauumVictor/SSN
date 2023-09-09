import { SSN } from '../../Client';
import { ListenerStructure } from '../../Structures/';
import { Events, Guild, Invite, PermissionFlagsBits } from 'discord.js';
export default class inviteCreateListener extends ListenerStructure {
    constructor(client: SSN) {
        super(client, {
            name: Events.InviteCreate
        });
    }

    async eventExecute(invite: Invite) {
        try {
            if (invite.guild) {
                const guild = invite.guild as Guild;

                if (guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    const invites = await guild.invites.fetch();

                    invites.each((inv) => this.client.codeUses.set(inv.code, inv));
                    this.client.invites.set(invite.guild.id, this.client.codeUses);
                }
            }
        } catch (err) {
            this.client.logger.error((err as Error).message, inviteCreateListener.name);
            this.client.logger.warn((err as Error).stack as string, inviteCreateListener.name);
        }
    }
}