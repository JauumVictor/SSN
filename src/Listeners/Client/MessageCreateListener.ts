import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, Colors, Events, GuildChannel, GuildMember, Message, OmitPartialGroupDMChannel, PermissionFlagsBits, TextChannel } from 'discord.js';
import { SSN } from '../../ssn';
import { ClientEmbed, ListenerStructure } from '../../structures';
import { emojis } from '../../utils/Objects/emojis';
import { Logger } from '../../utils/logger';
import { Util } from '../../utils/util';

export default class messageCreateListener extends ListenerStructure {
    constructor(controller: SSN) {
        super(controller, {
            name: Events.MessageCreate
        });
    }

    async eventExecute(message: OmitPartialGroupDMChannel<Message>) {
        if (message.author.bot || !message.guild) return;

        try {
            const prefix = process.env.PREFIX;

            //===============> Menções <===============//

            if (!(message.channel as GuildChannel).permissionsFor(message.guild.members.me as GuildMember)?.has(PermissionFlagsBits.SendMessages)) {
                return void message.member?.send({ content: `${message.author}, não possuo permissões de \`Enviar Mensagens\` neste servidor, contate um administrador.` })
                    .catch(() => undefined);
            }

            if (message.content.match(Util.GetMention(this.controller.discord.user?.id as string))) {
                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setURL('https://github.com/JauumVictor/')
                            .setStyle(ButtonStyle.Link)
                            .setEmoji(emojis.github)
                            .setLabel('GitHub'),
                        new ButtonBuilder()
                            .setURL('https://discord.gg/ssn')
                            .setStyle(ButtonStyle.Link)
                            .setEmoji(emojis.partner)
                            .setLabel('Servidor')
                    );

                const embed = new ClientEmbed(true, this.controller.discord)
                    .setDescription(`Olá ${message.author}, sou um BOT de gerenciamento para o servidor [Dependency](https://discord.gg/dependency), o meu prefixo é \`${prefix}\`.`)
                    .setFooter({ text: 'Made by 99hz', iconURL: this.controller.discord.user?.displayAvatarURL({ extension: 'png', size: 4096 }) });

                return void message.reply({ embeds: [embed], components: [row] });
            }

            //===============> Exportações de Comandos <===============//

            if (message.content.startsWith(prefix)) {
                const [name, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
                const command = this.controller.discord.commands.get(name) || this.controller.discord.commands.find((command) => command.data.options.aliases && command.data.options.aliases.includes(name));

                if (!command) {
                    if (message.content === prefix) return;

                    const searchCommand = this.controller.discord.commands.find((command) => new RegExp(name, 'i').test(command.data.options.name));

                    if (!searchCommand) {
                        return void message.reply({ content: `Não consegui encontrar nenhum comando chamado: \`${name}\`.` })
                            .then((message) => setTimeout(() => message.delete(), 1000 * 15));
                    }

                    const command = searchCommand.data.options.name;

                    return void message.reply({ content: `Hmmm, isto não me parece um comando existente, você não quis dizer: \`${command}\`? Utilize \`${prefix} ajuda\` para ver a minha lista de comandos.` })
                        .then((message) => setTimeout(() => message.delete(), 1000 * 15));
                }

                //===============> Cooldowns <===============//

                if (!this.controller.discord.cooldowns.has(command.data.options.name)) {
                    this.controller.discord.cooldowns.set(command.data.options.name, new Collection());
                }
                const now = Date.now();
                const timestamps = this.controller.discord.cooldowns.get(command.data.options.name);
                const cooldownAmount = (command.data.options.config.cooldown || 2) * 1000;

                if (timestamps?.has(message.author.id)) {
                    const time = timestamps?.get(message.author.id);

                    if (time && now < time + cooldownAmount) {
                        const timeLeft = (time + cooldownAmount - now) / 1000;
                        return void message.reply({ content: `Calma lá meu patrão, você deve aguardar \`${timeLeft.toFixed(1)} segundos\` para utilizar o comando \`${command.data.options.name}\` novamente.` }).catch(() => undefined);
                    }
                }

                if (!this.controller.discord.developers.includes(message.author.id)) {
                    timestamps?.set(message.author.id, now);
                    setTimeout(() => timestamps?.delete(message.author.id), cooldownAmount);
                }

                if (command.data.options.config.devOnly && !this.controller.discord.developers.some((id) => [id].includes(message.author.id))) {
                    return void message.reply({ content: `${message.author}, este comando é reservado apenas aos desenvolvedores do ${this.controller.discord.user}.` });
                }

                const checkPermissions = this.controller.discord.services.get('checkPermissions');

                const memberPermissions = checkPermissions?.serviceExecute({ message, command });
                if (!memberPermissions) return;

                const clientPermissions = checkPermissions?.serviceExecute({ message, command });
                if (!clientPermissions) return;

                await message.channel.sendTyping();

                const commandExecute = new Promise((resolve, reject): void => {
                    try {
                        resolve(command.commandExecute({ message, args, prefix }));
                    } catch (err) {
                        reject(err);
                    }
                });

                commandExecute.catch((err) => {
                    Logger.error(err.message, command.data.options.name);
                    Logger.warn(err.stack, command.data.options.name);

                    const errorChannel = this.controller.discord.channels.cache.get(process.env.ERROR_CHANNEL) as TextChannel;

                    if (errorChannel) {

                        const errorEmbed = new ClientEmbed(true, this.controller.discord)
                            .setColor(Colors.Red)
                            .setTitle(`Command: ${command.data.options.name}`)
                            .setDescription('```js' + '\n' + err.stack + '\n' + '```');

                        errorChannel.send({ embeds: [errorEmbed] });
                        return void message.reply({ content: `${message.author}, ocorreu um erro ao utilizar o comando ${command.data.options.name}, os desenvolvedores já estão ciente do erro, aguarde e tente novamente mais tarde.` })
                            .then((message) => setTimeout(() => message.delete(), 1000 * 10));
                    }
                });
            }

            //===============> Módulos <===============//

            //===============> Anti-Spam:
            const { default: SpamModule } = await import('../../Modules/SpamModule');
            new SpamModule(this.controller).moduleExecute(message);
            //===============> Anti-Invite:
            const { default: InviteModule } = await import('../../Modules/InviteModule');
            new InviteModule(this.controller).moduleExecute(message);

            //========================================//
        } catch (err) {
            Logger.error((err as Error).message, messageCreateListener.name);
            Logger.warn((err as Error).stack as string, messageCreateListener.name);
        }
    }
}