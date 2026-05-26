import { MDErgometry } from "./MDErgometry";

export class MDErgometryReport {

    id: string = '';
    createdAt: string = '';

    ergometry: MDErgometry = new MDErgometry();

    result: any = null;

    notes: string = '';

    constructor(data?: Partial<MDErgometryReport>) {

        Object.assign(this, data);
    }
}