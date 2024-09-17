import { ModuleStructure } from '../structures';
import { ChannelType, GuildMember, Message, OmitPartialGroupDMChannel, PermissionFlagsBits } from 'discord.js';
import { Logger } from '../utils/logger';
import { SSN } from '../ssn';

export default class inviteModule extends ModuleStructure {
    constructor(controller: SSN) {
        super(controller);
    }

    async moduleExecute(message: OmitPartialGroupDMChannel<Message>) {
        try {
            if (message.guild && message.channel.type === ChannelType.GuildText) {
                if (message.channel?.permissionsFor(message.guild.members.me as GuildMember).has(PermissionFlagsBits.ManageGuild)) {
                    const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|(discord|discordapp)\.com\/invite)\/.+[a-z]/g;
                    const invites = await message.guild.invites.fetch();
                    const filter = invites.filter(i => i.inviter);
                    const url = Array.from(filter.map(i => i.code));
                    const content = message.content.split('/');

                    if (regex.test(message.content)) {
                        if (!url.some((link) => content[content.length - 1] === link)) {
                            const roles = ['1150134805019762718', '1150134888071184425'].some((x) => message.member?.roles.cache.has(x));

                            if (!message.member?.permissions.has(PermissionFlagsBits.Administrator) && !roles) {
                                message.delete()
                                    .then(() => {
                                        return void message.channel.send({ content: `${message.author}, convites para outros servidores sem permissão são estritamente proibidos.` });
                                    });
                            }
                        }
                    }
                }
            }
        } catch (err) {
            Logger.error((err as Error).message, inviteModule.name);
            Logger.warn((err as Error).stack as string, inviteModule.name);
        }
    }
}