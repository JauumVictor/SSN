import { SSN } from '../../Client';
import { flagTexts, FlagKey } from '../../Utils/Objects/flags';
import { ServiceStructure, ClientEmbed, CommandStructure } from '../../Structures';
import { Message, PermissionsBitField } from 'discord.js';

export default class checkPermissionsService extends ServiceStructure {
    constructor(client: SSN) {
        super(client, {
            name: 'checkPermissions',
            initialize: false
        });
    }

    serviceExecute({ message, command }: { message: Message, command: CommandStructure }) {
        try {
            const sendPermissionError = (command: CommandStructure, isBotPermission: boolean): boolean => {
                const permissions = isBotPermission ?
                    new PermissionsBitField(command.data.options.permissions.client) :
                    new PermissionsBitField(command.data.options.permissions.member);

                const array: string[] = [];

                for (const flag in flagTexts) {
                    if (permissions.toArray().includes(flag as FlagKey)) {
                        array.push(flagTexts[flag]['pt-BR']);
                    }
                }

                const embed = new ClientEmbed(true, this.client)
                    .setAuthor({ name: 'Faltando permissões', iconURL: isBotPermission ? this.client.user?.displayAvatarURL({ extension: 'png', size: 4096 }) : message.author.displayAvatarURL({ extension: 'png', size: 4096 }) })
                    .setDescription(`${isBotPermission ? `${message.author}, eu sou fraco, me falta` : `${message.author}, você é fraco, lhe falta`} permissões de \`${array.join(', ').replace(/,([^,]*)$/, ' e$1')}\` para executar este comando.`);

                message.reply({ embeds: [embed] });
                return false;
            };

            if (command.data.options.permissions.client.length > 0 && !message.guild?.members.me?.permissions.has(command.data.options.permissions.client)) {
                return sendPermissionError(command, true);
            }

            if (command.data.options.permissions.member.length > 0 && !message.member?.permissions.has(command.data.options.permissions.member)) {
                return sendPermissionError(command, false);
            }

            return true;
        } catch (err) {
            this.client.logger.error((err as Error).message, checkPermissionsService.name);
            this.client.logger.warn((err as Error).stack as string, checkPermissionsService.name);
        }
    }
}