export class MDErgometry {

    constructor(data?: Partial<MDErgometry>) {

        Object.assign(this, data);

        if (!this.data?.length) {
            this.fillDefaultRows();
        }

    }

    type: 'bike' | 'run' = 'bike';

    startLoad: number = 0;

    increment: number = 0;

    timeStep: number = 180;

    data: MDErgometryRow[] = [];

    model: string = "";

    results: MDErgometryResult[] = [];

    detail?: MDErgometryDetail;


    fillDefaultRows() {

        this.data = [];

        for (let i = 0; i < 10; i++) {

            const minutes = i * 3;
            let hourText = "";

            if (minutes < 10) {
                hourText = "0" + minutes;
            } else {
                hourText = minutes.toString();
            }

            const time = hourText + ":00";

            this.data.push({
                stage: i,
                time: time,
                load: 0,
                hf: 0,
                lactate: 0
            });

        }

    }

}


// 🔹 TYPES

export type MDErgometryRow = {
    stage: number
    time: string
    load: number
    hf: number
    lactate: number
}

export type MDErgometryResult = {
    lactate: number
    iansPercent: number
    hf: number
    load: number
    pmax: number
    hrr: number
    vo2max: number
    hfmaxPercent: number
}

export type MDErgometryDetail = {
    time: string
    hf: number
    hfPercent: number
    load: number
    pmax: number
    hrr: number
    lactate: number
    hfIans: number
    vo2max: number
}