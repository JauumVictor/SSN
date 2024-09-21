import { SSN } from '../ssn';

export abstract class ModuleStructure {
    constructor(public readonly controller: SSN) {
        this.controller = controller;
    }

    abstract moduleExecute(...args: any[]): Promise<unknown> | unknown;
}