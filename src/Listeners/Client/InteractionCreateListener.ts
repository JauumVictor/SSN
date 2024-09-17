import { ApplicationCommandOptionType, Collection, Events, GuildMember, Interaction, InteractionEditReplyOptions, InteractionReplyOptions, Message, MessagePayload, MessageResolvable, OmitPartialGroupDMChannel, PermissionFlagsBits, TextChannel } from 'discord.js';
import { SSN } from '../../ssn';
import { ClientEmbed, ListenerStructure } from '../../structures';
import { Logger } from '../../utils/logger';

export default class interactionCreateListener extends ListenerStructure {
    constructor(controller: SSN) {
        super(controller, {
            name: Events.InteractionCreate
        });
    }

    async eventExecute(interaction: Interaction) {
        try {
            if (interaction.user.bot || !interaction.guild) return;

            //===============> Módulo de tradução <===============//

            const prefix = process.env.PREFIX;
            const args: string[] = [];

            //===============> Comandos <===============//

            if (interaction.isCommand() || interaction.isContextMenuCommand()) {
                if (!(interaction.channel as TextChannel).permissionsFor(interaction.guild.members.me as GuildMember).has(PermissionFlagsBits.SendMessages)) {
                    return void interaction.reply({ content: `${interaction.user}, não possuo permissões de \`Enviar Mensagens\` neste servidor, contate um administrador.`, ephemeral: true });
                }

                interaction.options?.data.forEach((option) => {
                    if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
                        if (option.name) {
                            args.push(option.name);
                        }

                        option.options?.forEach(options => {
                            if (options.name) {
                                args.push(options.name);
                            }

                            options.options?.forEach(options => {
                                if (options.name) {
                                    args.push(options.name);
                                }

                                if (options.value) {
                                    args.push(options.value as string);
                                }
                            });
                        });
                    } else if (option.type === ApplicationCommandOptionType.Subcommand) {
                        if (option.name) {
                            args.push(option.name);
                        }

                        option.options?.forEach(options => {
                            if (options.value) {
                                args.push(options.value as string);
                            }
                        });
                    } else if (option.value) {
                        args.push(option.value as string);
                    }
                });

                const command = this.controller.discord.commands.get(interaction.commandName);

                if (command) {
                    try {
                        //===============> Cooldown:
                        if (!this.controller.discord.cooldowns.has(command.data.options.name)) {
                            this.controller.discord.cooldowns.set(command.data.options.name, new Collection());
                        }

                        const now = Date.now();
                        const timestamps = this.controller.discord.cooldowns.get(command.data.options.name);
                        const cooldownAmount = (command.data.options.config.cooldown || 2) * 1000;

                        if (timestamps?.has(interaction.user.id)) {
                            const time = timestamps?.get(interaction.user.id);

                            if (time && now < time + cooldownAmount) {
                                const timeLeft = (time + cooldownAmount - now) / 1000;
                                return void interaction.reply({ content: `Calma lá meu patrão, você deve aguardar \`${timeLeft.toFixed(1)} segundos\` para utilizar o comando \`${command.data.options.name}\` novamente.`, ephemeral: true }).catch(() => undefined);
                            }
                        }

                        if (!this.controller.discord.developers.includes(interaction.user.id)) {
                            timestamps?.set(interaction.user.id, now);
                            setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);
                        }

                        if (command.data.options.config.devOnly && !this.controller.discord.developers.some((id) => [id].includes(interaction.user.id))) {
                            return void interaction.reply({ content: `${interaction.user}, este comando é reservado apenas aos desenvolvedores do ${this.controller.discord.user}.`, ephemeral: true });
                        }

                        await interaction.deferReply({ fetchReply: true });

                        const message = Object.assign(interaction, {
                            author: interaction.user,
                            reply: async (options: string | MessagePayload | InteractionReplyOptions) => await interaction.followUp(options).catch(console.error),
                            edit: async (options: string | MessagePayload | InteractionEditReplyOptions) => await interaction.editReply(options).catch(console.error),
                            delete: async (message?: MessageResolvable) => await interaction.deleteReply(message)
                        }) as unknown as OmitPartialGroupDMChannel<Message>;

                        //===============> Checando permissões dos membros e do cliente:

                        const checkPermissions = this.controller.discord.services.get('checkPermissions');

                        // Verificando permissões do membro:
                        const memberPermissions = checkPermissions?.serviceExecute({ message, command });
                        if (!memberPermissions) return;

                        // Verificando permissões do client:
                        const clientPermissions = checkPermissions?.serviceExecute({ message, command });
                        if (!clientPermissions) return;

                        const interactionExecute = new Promise((resolve, reject) => {
                            try {
                                resolve(command.commandExecute({ message, args, prefix }));
                            } catch (err) {
                                reject(err);
                            }
                        });

                        interactionExecute.catch((err): void => {
                            Logger.error(err.message, command.data.options.name);
                            Logger.warn(err.stack, command.data.options.name);

                            const errorChannel = this.controller.discord.channels.cache.get(process.env.ERROR_CHANNEL) as TextChannel;

                            if (errorChannel) {
                                const errorEmbed = new ClientEmbed(true, this.controller.discord)
                                    .setTitle(`${command.data.options.name}`)
                                    .setDescription('```js' + '\n' + err.stack + '\n' + '```');

                                errorChannel.send({ embeds: [errorEmbed] });
                            }

                            return void interaction.reply({ content: `${interaction.user}, ocorreu um erro ao utilizar o comando \`${command.data.options.name}\`, os desenvolvedores já estão ciente do erro, aguarde e tente novamente mais tarde.`, ephemeral: true });
                        });
                    } catch (err) {
                        Logger.error((err as Error).message, interactionCreateListener.name);
                        Logger.warn((err as Error).stack as string, interactionCreateListener.name);
                    }
                }
            }

            //==============================================//
        } catch (err) {
            Logger.error((err as Error).message, interactionCreateListener.name);
            return Logger.warn((err as Error).stack as string, interactionCreateListener.name);
        }
    }
}