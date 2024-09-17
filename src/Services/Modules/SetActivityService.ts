import { SSN } from '../../ssn';
import { ServiceStructure } from '../../structures';
import { Logger } from '../../utils/logger';

export default class setActivityService extends ServiceStructure {
    constructor(controller: SSN) {
        super(controller, {
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
                this.controller.discord.user?.setPresence({ status: 'online', activities: [activity] });
            }, 1000 * time);

            Logger.info(`${this.controller.discord.user?.username} presence has been successfully set.`, 'Presence');
        } catch (err) {
            Logger.error((err as Error).message, setActivityService.name);
            Logger.warn((err as Error).stack as string, setActivityService.name);
        }
    }
}