export class MDErgometry {

    constructor(data?: Partial<MDErgometry>) {
        Object.assign(this, data);

        if (data?.data?.length) {
            this.data = data.data.map(d => ({ ...d })); // shallow copy
        }

        if (data?.results?.length) {
            this.results = data.results.map(r => ({ ...r })); //shallow copy
        }

        if (data?.detail != null) {
            this.detail = { ...data.detail }; //shallow copy
        }
    }

    type: 'bike' | 'run' = 'bike'
    startLoad: number = 0
    increment: number = 0
    timeStep: number = 0

    data: MDErgometryRow[] = []

    model: 'dickhuth' | 'freiburg' | 'linear' | 'keul' = 'dickhuth'

    results: MDErgometryResult[] = []

    detail?: MDErgometryDetail
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