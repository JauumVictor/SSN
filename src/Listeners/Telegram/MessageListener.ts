import { MessageContext, PhotoAttachment } from 'puregram';
import { Bot } from '../../Client';
import { TelegramListenerStructure } from '../../Structures/';
import { AttachmentBuilder, TextChannel } from 'discord.js';

export default class MessageListener extends TelegramListenerStructure {
    constructor(client: Bot) {
        super(client, {
            name: 'message'
        });
    }

    async eventExecute(message: MessageContext) {
        const channel = this.client.discord.channels.cache.get('1146630192719200356') as TextChannel;

        const { text, photo, attachment, forwardedMessage } = message;

        if (attachment) {
            if (attachment && attachment.attachmentType === 'photo') {
                const highestResolutionPhoto = (attachment as PhotoAttachment).bigSize;
                const imageData = await this.client.api.getFile({ file_id: highestResolutionPhoto.fileId });
                const imageUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${imageData.file_path}`;
                const nameArray = imageUrl.split('.');
                const attEx = nameArray[nameArray.length - 1];

                const file = new AttachmentBuilder(imageUrl, { name: imageData.file_unique_id + '.' + attEx });

                channel.send({ content: text, files: [file] });
            }
        }

        if (!photo || photo.length === 0) {
            let forwardedMessageText = '';

            // Verifica se a mensagem foi encaminhada e obtém as informações do canal de origem
            if (forwardedMessage) {
                forwardedMessageText = `[Esta mensagem foi encaminhada do canal ${forwardedMessage.chat?.firstName}](${forwardedMessage.chat?.inviteLink})`;
            }

            // Adiciona o texto da mensagem original
            forwardedMessageText += `\n\`\`\`txt\n${text}\n\`\`\``;

            channel.send({ content: forwardedMessageText });
        }
    }
}