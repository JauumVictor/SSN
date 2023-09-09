import { SSN } from '../../Client';
import { ServiceStructure } from '../../Structures/';

export default class setActivityService extends ServiceStructure {
    constructor(client: SSN) {
        super(client, {
            name: 'setActivity',
            initialize: true
        });
    }

    serviceExecute() {
        try {
            const activityArray = [
                '.gg/ssn'
            ];

            const typeArray = [0];
            const time = 15;
            let x = 0;
            let y = 0;

            setInterval(() => {
                const activity = { name: activityArray[x++ % activityArray.length], type: typeArray[y++ % typeArray.length] };
                this.client.user?.setPresence({ status: 'online', activities: [activity] });
            }, 1000 * time);

            this.client.logger.info(`${this.client.user?.username} presence has been successfully set.`, 'Presence');
        } catch (err) {
            this.client.logger.error((err as Error).message, setActivityService.name);
            this.client.logger.warn((err as Error).stack as string, setActivityService.name);
        }
    }
}