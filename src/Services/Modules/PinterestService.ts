import { AttachmentBuilder, TextChannel } from 'discord.js';
import { SSN } from '../../Client';
import { ServiceStructure } from '../../Structures';
import { Data } from '../../Types/PinterestTypes';

export default class PinterestService extends ServiceStructure {
    constructor(client: SSN) {
        super(client, {
            name: 'Pinterest',
            initialize: false
        });
    }

    async serviceExecute() {
        try {
            const channel = await this.client.channels.fetch(process.env.PIN_CHANNEL).catch(() => undefined) as TextChannel;
            const { data, file } = await this.getPin();

            if (channel && data && file) {
                channel.send({ content: `<${data.user.profile_url}>`, files: [file] });
                
                setInterval(async () => {
                    const { data, file } = await this.getPin();

                    if (data && file) {
                        channel.send({ content: `<${data.user.profile_url}>`, files: [file] });
                    }
                }, 1000 * 60 * 10); 
            }
        } catch (err) {
            this.client.logger.error((err as Error).message, PinterestService.name);
            this.client.logger.warn((err as Error).stack as string, PinterestService.name);
        }
    }

    async getPin(): Promise<{ file: AttachmentBuilder, data: Data }> {
        const array = [
            'https://widgets.pinterest.com/v3/pidgets/boards/youngdSSNns/yd/pins/',
            'https://widgets.pinterest.com/v3/pidgets/boards/piedziki/rawr/pins/'
        ];
        const index = Math.floor(Math.random() * array.length);

        const { data }: { data: Data } = await fetch(array[index])
            .then(res => res.json())
            .catch(() => { });
            
        const image = data?.pins.map(({ images }) => images['564x'].url).sort(() => (Math.random() > 0.5 ? -1 : 1));
        const x = Math.floor(Math.random() * image.length);
        const randomImage = image[x];
        const nameArray = randomImage.split('.');
        const attEx = nameArray[nameArray.length - 1];
        const file = new AttachmentBuilder(randomImage, { name: 'dependency.' + attEx, description: 'discord.gg/dependency' });

        return { file, data };
    }
}