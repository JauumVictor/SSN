import { SSN } from '../Client';

export abstract class ModuleStructure {
    readonly client: SSN;

    constructor(client: SSN) {
        this.client = client;
    }

    abstract moduleExecute(...args: any[]): Promise<any> | any;
}