import { SSN } from '../../ssn';
import { ListenerStructure } from '../../structures';
import { Events, Guild, Invite, PermissionFlagsBits } from 'discord.js';
import { Logger } from '../../utils/logger';

export default class inviteCreateListener extends ListenerStructure {
    constructor(controller: SSN) {
        super(controller, {
            name: Events.InviteCreate
        });
    }

    async eventExecute(invite: Invite) {
        try {
            if (invite.guild) {
                const guild = invite.guild as Guild;

                if (guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    const invites = await guild.invites.fetch();

                    invites.each((inv) => this.controller.discord.codeUses.set(inv.code, inv));
                    this.controller.discord.invites.set(invite.guild.id, this.controller.discord.codeUses);
                }
            }
        } catch (err) {
            Logger.error((err as Error).message, inviteCreateListener.name);
            Logger.warn((err as Error).stack as string, inviteCreateListener.name);
        }
    }
}