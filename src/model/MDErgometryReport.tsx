import { MDErgometry } from "./MDErgometry";
import { MDErgometryReportResult } from "./MDErgometryReportResult";

export class MDErgometryReport {

    id: string = '';
    createdAt: string = '';

    ergometry: MDErgometry = new MDErgometry();

    result: MDErgometryReportResult = new MDErgometryReportResult();

    notes: string = '';

    constructor(data?: Partial<MDErgometryReport>) {
        Object.assign(this, data);
    }
}