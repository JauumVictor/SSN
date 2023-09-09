import { SSN } from '../Client';

type RawServiceData = {
    name: string;
    initialize: boolean;
    amount?: number;
    interval?: number;
    wait?: number;
};

export abstract class ServiceStructure {
    client: SSN;
    data: RawServiceData;

    constructor(client: SSN, data: RawServiceData) {
        this.client = client;
        this.data = data;
    }

    abstract serviceExecute(...args: any[]): Promise<any> | any;
}