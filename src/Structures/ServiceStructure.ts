import { SSN } from '../ssn';

interface RawServiceData {
    name: string;
    initialize: boolean;
    amount?: number;
    interval?: number;
    wait?: number;
}

export abstract class ServiceStructure {
    controller: SSN;
    data: RawServiceData;

    constructor(controller: SSN, data: RawServiceData) {
        this.controller = controller;
        this.data = data;
    }

    abstract serviceExecute(...args: any[]): Promise<unknown> | unknown;
}