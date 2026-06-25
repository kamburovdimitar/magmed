import { ErgometryUtil } from '../utils/ErgometrieUtil';
import { MDErgometry } from "./MDErgometry";
import { MDErgometryReport } from "./MDErgometryReport";

export class MDPatientMeasurements {

    constructor(data?: Partial<MDPatientMeasurements>) {
        Object.assign(this, data);

        if (data?.ergometry) {
            this.ergometry = new MDErgometry(data.ergometry);
        }
    }

    ergometry: MDErgometry = new MDErgometry();
    ergometryReports: MDErgometryReport[] = [];

    // editable
    private _heightcm: number = 0;
    private _weightkg: number = 0;
    private _waistcm: number = 0;
    private _hipcm: number = 0;
    private _bodyfatpercent: number = 0;
    private _maxspeed: number = 0;

    private _bloodpressurerestsystolic: number = 0;
    private _bloodpressurerestdiastolic: number = 0;
    private _bloodpressuremaxsystolic: number = 0;
    private _bloodpressuremaxdiastolic: number = 0;

    private _heartraterest: number = 0;
    private _heartratemax: number = 0;

    private _age: number = 0;

    private _istLeistungMax: number = 0; // #32

    // getters/setters
    get heightcm() { return this._heightcm; }
    set heightcm(value: number) { this._heightcm = value; }

    get weightkg() { return this._weightkg; }
    set weightkg(value: number) { this._weightkg = value; }

    get waistcm() { return this._waistcm; }
    set waistcm(value: number) { this._waistcm = value; }

    get hipcm() { return this._hipcm; }
    set hipcm(value: number) { this._hipcm = value; }

    get bodyfatpercent() { return this._bodyfatpercent; }
    set bodyfatpercent(value: number) { this._bodyfatpercent = value; }

    get bloodpressurerestsystolic() { return this._bloodpressurerestsystolic; }
    set bloodpressurerestsystolic(value: number) { this._bloodpressurerestsystolic = value; }

    get bloodpressurerestdiastolic() { return this._bloodpressurerestdiastolic; }
    set bloodpressurerestdiastolic(value: number) { this._bloodpressurerestdiastolic = value; }

    get bloodpressuremaxsystolic() { return this._bloodpressuremaxsystolic; }
    set bloodpressuremaxsystolic(value: number) { this._bloodpressuremaxsystolic = value; }

    get bloodpressuremaxdiastolic() { return this._bloodpressuremaxdiastolic; }
    set bloodpressuremaxdiastolic(value: number) { this._bloodpressuremaxdiastolic = value; }

    get heartraterest() { return this._heartraterest; }
    set heartraterest(value: number) { this._heartraterest = value; }

    get heartratemax() { return this._heartratemax; }
    set heartratemax(value: number) { this._heartratemax = value; }

    get age() { return this._age; }
    set age(value: number) { this._age = value; }

    get istLeistungMax() { return this._istLeistungMax; }
    set istLeistungMax(value: number) { this._istLeistungMax = value; }

    // 🔹 SOLL (идва от util)
    get sollLeistungNorm(): number {
        return ErgometryUtil.getSollLeistungNorm(this._age, "male");
    }

    // calculated
    get bodysurfacearea(): number {
        return Math.sqrt((this._heightcm * this._weightkg) / 3600);
    }

    get bmi(): number {
        const heightm = this._heightcm / 100;
        return heightm ? this._weightkg / (heightm * heightm) : 0;
    }

    get whrindex(): number {
        return this._hipcm ? this._waistcm / this._hipcm : 0;
    }

    get fatmasskg(): number {
        return this._weightkg * (this._bodyfatpercent / 100);
    }

    get expectedheartrate(): number {
        return 220 - this._age;
    }

    // 🔹 ERGOMETRIE

    get sollLeistungProKg(): number {
        return this._weightkg
            ? this.sollLeistungNorm / this._weightkg
            : 0;
    }

    get istLeistungProKg(): number {
        return this._weightkg
            ? this._istLeistungMax / this._weightkg
            : 0;
    }

    get istProzentNorm(): number {
        return this.sollLeistungNorm
            ? (this._istLeistungMax * 100) / this.sollLeistungNorm
            : 0;
    }

    get sollLeistungWeight(): number {
        return ErgometryUtil.getSollLeistungWeight(
            this._age,
            "male"
        );
    }

    get sollLeistungWeightProKg(): number {
        return this._weightkg
            ? this.sollLeistungWeight / this._weightkg
            : 0;
    }

    get istLeistungWeightProKg(): number {
        return this._weightkg
            ? this._istLeistungMax / this._weightkg
            : 0;
    }

    get istProzentWeightNorm(): number {
        return this.sollLeistungWeight
            ? (this._istLeistungMax * 100)
            / this.sollLeistungWeight
            : 0;
    }


    // ---------- UI GETTERS ----------

    // #31
    get sollWatt(): number {
        return +this.sollLeistungNorm.toFixed(0);
    }

    // #33
    get sollWattKg(): number {
        return +this.sollLeistungProKg.toFixed(2);
    }

    // #34
    get istWattKg(): number {
        return +this.istLeistungProKg.toFixed(2);
    }

    // #35
    get istPercent(): number {
        return +this.istProzentNorm.toFixed(1);
    }

    // #36
    get sollWeightWatt(): number {
        return +this.sollLeistungWeight.toFixed(0);
    }

    // #37
    get sollWeightWattKg(): number {
        return +this.sollLeistungWeightProKg.toFixed(2);
    }

    // #39
    get istWeightPercent(): number {
        return +this.istProzentWeightNorm.toFixed(1);
    }


    get maxspeed() {
        return this._maxspeed;
    }

    set maxspeed(value: number) {
        this._maxspeed = value;
    }

    get minperkm(): string {

        if (!this._maxspeed)
            return "";

        let totalSeconds =
            Math.round(
                3600 / this._maxspeed
            );

        let minutes =
            Math.floor(
                totalSeconds / 60
            );

        let seconds =
            totalSeconds % 60;

        return (
            minutes +
            ":" +
            seconds
                .toString()
                .padStart(2, '0')
        );

    }

}