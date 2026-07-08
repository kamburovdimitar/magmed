import { ErgometryUtil } from '../utils/ErgometrieUtil';
import { MDErgometry } from "./MDErgometry";
import { MDErgometryReport } from "./MDErgometryReport";
import { CodexUtil } from '../utils/CodexUtil';

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


    // calculated
    get bodysurfacearea(): number {

        return (
            CodexUtil.calculateBSA(
                this._heightcm,
                this._weightkg
            ) ?? 0
        );

    }

    get bmi(): number {

        return (
            CodexUtil.calculateBMI(
                this._heightcm,
                this._weightkg
            ) ?? 0
        );

    }

    get whrindex(): number {

        return (
            CodexUtil.calculateWHR(
                this._waistcm,
                this._hipcm
            ) ?? 0
        );

    }

    get fatmasskg(): number {

        return (
            CodexUtil.calculateFatMass(
                this._weightkg,
                this._bodyfatpercent
            ) ?? 0
        );

    }

    get expectedheartrate(): number {

        return (
            CodexUtil.calculateExpectedHeartRate(
                this._age
            ) ?? 0
        );

    }

    // 🔹 ERGOMETRIE





    get sollLeistungNorm(): number {
        return ErgometryUtil.getSollLeistungNorm(
            this._age,
            "male"
        );
    }

    get sollLeistungProKg(): number {

        return (
            CodexUtil.calculateSollWattKg(
                this.sollLeistungNorm,
                this._weightkg
            ) ?? 0
        );

    }

    get istLeistungProKg(): number {

        return (
            CodexUtil.calculateIstWattKg(
                this._istLeistungMax,
                this._weightkg
            ) ?? 0
        );

    }

    get istProzentNorm(): number {

        return (
            CodexUtil.calculateIstPercent(
                this._istLeistungMax,
                this.sollLeistungNorm
            ) ?? 0
        );

    }

    get sollLeistungWeight(): number {

        return ErgometryUtil.getSollLeistungWeight(
            this._age,
            "male"
        );

    }

    get sollLeistungWeightProKg(): number {

        return (
            CodexUtil.calculateSollWeightWattKg(
                this.sollLeistungWeight,
                this._weightkg
            ) ?? 0
        );

    }

    get istLeistungWeightProKg(): number {

        return (
            CodexUtil.calculateIstWeightWattKg(
                this._istLeistungMax,
                this._weightkg
            ) ?? 0
        );

    }

    get istProzentWeightNorm(): number {

        return (
            CodexUtil.calculateIstWeightPercent(
                this._istLeistungMax,
                this.sollLeistungWeight
            ) ?? 0
        );

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

        return (
            CodexUtil.calculatePace(
                this._maxspeed
            ) ?? ""
        );

    }

    get heartrateReserve(): number {

        return (
            this._heartratemax -
            this._heartraterest
        );

    }

    get hrr60(): number {

        return (
            CodexUtil.calculateKarvonenHeartRate(
                this._heartraterest,
                this._heartratemax,
                60
            ) ?? 0
        );

    }

    get hrr65(): number {

        return (
            CodexUtil.calculateKarvonenHeartRate(
                this._heartraterest,
                this._heartratemax,
                65
            ) ?? 0
        );

    }


    get hrr70(): number {

        return (
            CodexUtil.calculateKarvonenHeartRate(
                this._heartraterest,
                this._heartratemax,
                70
            ) ?? 0
        );

    }

    get hrr80(): number {

        return (
            CodexUtil.calculateKarvonenHeartRate(
                this._heartraterest,
                this._heartratemax,
                80
            ) ?? 0
        );

    }

    get hrr90(): number {

        return (
            CodexUtil.calculateKarvonenHeartRate(
                this._heartraterest,
                this._heartratemax,
                90
            ) ?? 0
        );

    }

    get hfMax70(): number {

        return (
            CodexUtil.calculateVO2HeartRate(
                this._heartratemax,
                70
            ) ?? 0
        );

    }

    get hfMax80(): number {

        return (
            CodexUtil.calculateVO2HeartRate(
                this._heartratemax,
                80
            ) ?? 0
        );

    }

    get hfMax90(): number {

        return (
            CodexUtil.calculateVO2HeartRate(
                this._heartratemax,
                90
            ) ?? 0
        );

    }

}