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

    // 🔹 2026-08-19 — MUFU (Muskel-Funktion/Körper-Haltung, "3.05 Neuer Test
    // - MUFU" мокъп). Плоски обекти (не отделен модел клас) — същия подход
    // като ergometryReports по-горе, персистват през Object.assign(this,
    // data) в конструктора, без нужда от собствени getter/setter-и.
    //
    // muskelFunktionKraft: { [muscleKey]: { r: number|null, l: number|null } }
    // — виж MUSCLE_LIST в constants/muskelFunktionKraftPunkte.js за ключовете.
    muskelFunktionKraft: any = {};

    // 🔹 2026-08-20 — DK: "следващите стъпки от плана" -> DEHNBARKEIT
    // (разтегливост) и BEWEGLICHKEIT (подвижност) под Muskel-Funktion.
    // Същата форма/структура като muskelFunktionKraft по-горе (10-те
    // мускула x R/L x 1-5 оценка + същата точкова диаграма върху тялото),
    // само различен смисъл на оценката — виж MuskelFunktionComponent.tsx.
    muskelFunktionDehnbarkeit: any = {};
    muskelFunktionBeweglichkeit: any = {};

    // koerperHaltungWirbelsaeule: { [rowKey]: number|null } — колонен индекс
    // 0=schwer/1=mittelschwer/2=leicht/3=normal, виж BeuterlungTable.tsx.
    koerperHaltungWirbelsaeule: any = {};

    // 🔹 2026-08-20 — DK: "тези неща, които са от плана в тази страница ...
    // и които не са имплементирани" -> KOPF/SCHULTER/BECKEN/KNIE/FUSS под
    // Körper-Haltung (бяха placeholder "Not implemented yet."). Същата
    // форма като koerperHaltungWirbelsaeule по-горе ({rowKey: colIndex}),
    // редовете идват от constants/koerperHaltungSections.js.
    koerperHaltungKopf: any = {};
    koerperHaltungSchulter: any = {};
    koerperHaltungBecken: any = {};
    koerperHaltungKnie: any = {};
    koerperHaltungFuss: any = {};

    // 🔹 2026-08-20 (3) — DK: новите 5 PDF-а "Training – Gesundheit" (план +
    // предложение за модела, обсъдено с DK преди имплементация). 3 таба,
    // всеки едно плоско поле тук (per-тест, същия подход като
    // muskelFunktionKraft/koerperHaltung* по-горе):
    //   trainingsplanKeinTest / trainingsplanErgometrie /
    //   trainingsplanLaktatErgometrie
    // Очаквано вътрешно съдържание на всяко (форма ще се уточни при
    // строене на конкретния таб): Grundeinstellung входове (спорт вид,
    // избран intensität%, HFmax/HFruhe override), 8-те стадия на
    // прогресията ([{weeks:number, active:boolean}, ...] — DK потвърди:
    // редактируеми per-тест, НЕ статична таблица), избран Ratschlag
    // (template key + свободен текст override), automatikEnabled:boolean
    // (EIN/AUS — самата decision-tree логика е placeholder, зависи от
    // все още непредоставен "Einstellungen" документ).
    //
    // ЗАБЕЛЕЖКА: Personenspezifische Standardwerte (запазени лични
    // подразбирания) НЕ живеят тук — те трябва да преживяват отделния
    // тест, затова са предложени като поле на MDPatient.tsx
    // (trainingsplanStandardwerte), не тук.
    //
    // #XZ# (Fahrrad↔Laufband HF корекция) също НЕ живее тук — DK
    // потвърди, че е глобална настройка на приложението, не per-тест —
    // виж новия store/settingsSlice.ts.
    trainingsplanKeinTest: any = {};
    trainingsplanErgometrie: any = {};
    trainingsplanLaktatErgometrie: any = {};

    // 🔹 id на archive записа (ergometryReports[]), който текущата
    // `ergometry` в момента "представлява" — Page11.tsx's Archive бутон
    // го ползва, за да реши save (нов запис) vs update (същия запис).
    // Персистнато тук (не само в локален React state), за да преживява
    // unmount/remount на Page11 при смяна на таб (виж Page11.tsx-ния
    // mount-hydration ефект).
    loadedReportId: string | null = null;

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

    // 🔹 2026-08-21 (Claude) — DK: "нека се захванем с полето gender ...
    // то се ползва на различни места" — досега `sollLeistungNorm`/
    // `sollLeistungWeight` по-долу викаха ErgometryUtil с hardcode-нато
    // "male", независимо какво реално е записано за пациента (полето
    // Gender никъде не се подаваше). Сега пазим реалния пол тук (същия
    // patern като `_age` по-горе), с fallback "male" САМО за да не се
    // чупят стойности за стари/недовършени записи, където gender още не е
    // синхронизиран (виж Page10.tsx промяната, аналогична на
    // age-синхронизацията от MDPatient.birthdate).
    private _gender: string = "";

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

    get gender() { return this._gender; }
    set gender(value: string) { this._gender = value; }

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
            this._gender || "male"
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
            this._gender || "male"
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

    get istWatt(): number {
        return this._istLeistungMax;
    }

    get isBike() {

        return (
            this.ergometry?.type === "bike"
        );

    }

    get isTreadmill() {

        return (
            this.ergometry?.type === "run"
        );

    }

    get heartRateZones() {

        const intensities = [
            45, 50, 55, 60,
            65, 70, 75, 80,
            85, 90, 95,
            100, 105, 110
        ];

        return intensities.map(percent => ({
            percent,
            bpm: CodexUtil.calculateKarvonenHeartRate(
                this._heartraterest,
                this._heartratemax,
                percent
            ) ?? 0
        }));

    }

}