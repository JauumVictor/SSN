import { MessageContext, PhotoAttachment } from 'puregram';
import { Bot } from '../../Client';
import { TelegramListenerStructure } from '../../Structures/';
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, MessageComponentInteraction, TextChannel } from 'discord.js';

export default class MessageListener extends TelegramListenerStructure {
    constructor(client: Bot) {
        super(client, {
            name: 'message'
        });
    }

    async eventExecute(message: MessageContext) {
        const channel = this.client.discord.channels.cache.get('1146630192719200356') as TextChannel;

        const { text, photo, attachment, forwardedMessage } = message;

        const warnButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('warn')
            .setLabel('Postar em avisos')
            .setEmoji('📢');

        const oportunityButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('oportunity')
            .setLabel('Postar em oportunidades')
            .setEmoji('📩');

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(warnButton, oportunityButton);

        if (attachment) {
            if (attachment && attachment.attachmentType === 'photo') {
                const highestResolutionPhoto = (attachment as PhotoAttachment).bigSize;
                const imageData = await this.client.api.getFile({ file_id: highestResolutionPhoto.fileId });
                const imageUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${imageData.file_path}`;
                const nameArray = imageUrl.split('.');
                const attEx = nameArray[nameArray.length - 1];
                const file = new AttachmentBuilder(imageUrl, { name: imageData.file_unique_id + '.' + attEx });

                const msg = await channel.send({ content: text, files: [file], components: [row] });
                const filter = (interaction: MessageComponentInteraction) => interaction.message.id === msg.id;
                const collector = msg.createMessageComponentCollector({ filter, max: 1 });

                collector.on('collect', async (interaction) => {
                    if (interaction.customId === 'warn') {
                        const warnChannel = this.client.discord.channels.cache.get('1146621483993534515') as TextChannel;
                        await warnChannel.send({ content: text, files: [file] });
                    }

                    if (interaction.customId === 'oportunity') {
                        const oportunityChannel = this.client.discord.channels.cache.get('1150142608954359941') as TextChannel;
                        await oportunityChannel.send({ content: text, files: [file] });
                    }

                    await msg.delete();
                });
            }
        }

        if (!photo || photo.length === 0) {
            let forwardedMessageText = '';

            if (forwardedMessage) {
                forwardedMessageText = forwardedMessage.chat ? `Esta mensagem foi encaminhada do canal \`${forwardedMessage.chat?.title}\`\n` : `[Esta mensagem foi encaminhada do usuário ${forwardedMessage.from?.lastName ? forwardedMessage.from.firstName + ' ' + forwardedMessage.from?.lastName : forwardedMessage.from?.firstName ? forwardedMessage.from.firstName : forwardedMessage.senderName}](<https://t.me/${forwardedMessage.from?.username}>)\n`;
            }

            forwardedMessageText += `\n\`\`\`txt\n${text}\n\`\`\``;

            const msg = await channel.send({ content: forwardedMessageText, components: [row] });
            const filter = (interaction: MessageComponentInteraction) => interaction.message.id === msg.id;
            const collector = msg.createMessageComponentCollector({ filter, max: 1 });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'warn') {
                    const warnChannel = this.client.discord.channels.cache.get('1146621483993534515') as TextChannel;
                    await warnChannel.send({ content: forwardedMessageText });
                }

                if (interaction.customId === 'oportunity') {
                    const oportunityChannel = this.client.discord.channels.cache.get('1150142608954359941') as TextChannel;
                    await oportunityChannel.send({ content: forwardedMessageText });
                }

                await msg.delete();
            });
        }
    }
}