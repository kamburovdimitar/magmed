import { ERGOMETRY_MODELS } from '../constants/ergometryModels';
import { TEST_SCENARIOS } from './ErgometrieScenarioUtil';
import {ErgometryModelsUtil} from './ErgometryModelsUtil';
// utils/ergometryUtil.js



// 👉 примерна таблица (можеш да я разшириш)
const SOLL_TABLE = [

    { min: 0, max: 29, male: 300, female: 250 },
    { min: 30, max: 39, male: 280, female: 230 },
    { min: 40, max: 49, male: 260, female: 210 },
    { min: 50, max: 59, male: 240, female: 190 },
    { min: 60, max: 200, male: 220, female: 170 }

];

function getSollLeistungNorm(
    age = 40,
    gender = "male"
) {

    for (
        let i = 0;
        i < SOLL_TABLE.length;
        i++
    ) {

        let row =
            SOLL_TABLE[i];

        if (
            age >= row.min
            &&
            age <= row.max
        ) {

            return gender === "female"
                ? row.female
                : row.male;

        }

    }

    return 220;

}


function getSollLeistungWeight(age, gender) {

    return getSollLeistungNorm(age, gender) - 20;
}

// 🔹 fake rows
function generateFakeTest({
    stages,
    startLoad,
    increment,
    timeStep
}) {

    const rows = [];

    // 🔹 initial lactate
    let lactate = 1.8;

    // 🔹 initial HF
    let hf = 90;

    for (let i = 0; i < stages; i++) {

        const load =
            startLoad + (i * increment);

        // 🔹 realistic HF growth
        hf +=
            Math.floor(
                6 + Math.random() * 5
            );

        // 🔹 EARLY DROP
        if (i === 1) {

            lactate -= 0.3;
        }

        if (i === 2) {

            lactate -= 0.1;
        }

        // 🔹 stable aerobic zone
        if (i >= 3 && i <= 4) {

            lactate +=
                0.1 + Math.random() * 0.2;
        }

        // 🔹 transition zone
        if (i >= 5 && i <= 6) {

            lactate +=
                0.5 + Math.random() * 0.5;
        }

        // 🔹 anaerobic rise
        if (i >= 7) {

            lactate +=
                1.0 + Math.random() * 1.5;
        }

        rows.push({

            stage: i,

            time:
                `${String(i * timeStep).padStart(2, '0')}:00`,

            load,

            hf,

            lactate:
                Number(
                    lactate.toFixed(1)
                )
        });
    }

    return rows;
}

// 🔥 FULL ERGOMETRY GENERATOR
function generateFakeErgometry(options = {}) {

    // 🔹 type
    const type =
        options.type ||
        (Math.random() > 0.5 ? 'bike' : 'run');

    // 🔹 models
    const models =
        Object.values(
            ERGOMETRY_MODELS
        );

    const model =
        models[
            Math.floor(
                Math.random() *
                models.length
            )
        ];

    // 🔹 defaults
    let startLoad =
        options.startLoad ?? 30;

    let increment =
        options.increment ?? 30;

    let timeStep =
        options.timeStep ?? 3;

    // 🔹 run defaults
    if (
        type === 'run' &&
        options.startLoad == null
    ) {

        startLoad = 8;
        increment =
            options.increment ?? 2;
    }

    // 🔹 data
    const data =
        generateFakeTest({

            stages:
                options.stages || 10,

            startLoad,

            increment,

            timeStep
        });

    return {

        type,

        model,

        startLoad,

        increment,

        timeStep,

        data
    };
}

function validateAllModels(rows, type) {

    const results = [];

    const models = [

        ERGOMETRY_MODELS.DICKHUTH,

        ERGOMETRY_MODELS.FREIBURG,

        ERGOMETRY_MODELS.LINEAR,

        ERGOMETRY_MODELS.LTP,

        ERGOMETRY_MODELS.KEUL,

        ERGOMETRY_MODELS.KEUL_LEGACY
    ];

    for (let i = 0; i < models.length; i++) {

        let result = null;

        if (models[i] === ERGOMETRY_MODELS.DICKHUTH) result = ErgometryModelsUtil.calculateDickhuth(rows);

        if (models[i] === ERGOMETRY_MODELS.FREIBURG) result = ErgometryModelsUtil.calculateFreiburg(rows);

        if (models[i] === ERGOMETRY_MODELS.LINEAR) result = ErgometryModelsUtil.calculateLinear(rows);

        if (models[i] === ERGOMETRY_MODELS.LTP) result = ErgometryModelsUtil.calculateLTP(rows);

        if (models[i] === ERGOMETRY_MODELS.KEUL) result = ErgometryModelsUtil.calculateKeul(rows, type);

        if (models[i] === ERGOMETRY_MODELS.KEUL_LEGACY) result = ErgometryModelsUtil.calculateMaxSlopeMethodKeulLegacy(rows);

        results.push({

            model: models[i],

            validation:
                validateResult(
                    result
                ),

            result
        });
    }

    return results;
}


function validateResult(result) {

    const errors = [];

    if (result?.IASPoint && result?.IANSPoint && result.IASPoint.load > result.IANSPoint.load) errors.push('IAS load > IANS load');

    if (result?.IAS != null && result?.IANS != null && result.IAS > result.IANS) errors.push('IAS > IANS');

    if (result?.IASPoint && result?.IANSPoint && result.IASPoint.hf > result.IANSPoint.hf) errors.push('IAS HF > IANS HF');

    if (result?.IASPoint?.load < 0 || result?.IANSPoint?.load < 0) errors.push('Negative load');

    if (result?.IASPoint?.load > result?.IANSPoint?.load) errors.push('IAS load > IANS load');

    if (result?.IASPoint?.hf > result?.IANSPoint?.hf) errors.push('IAS HF > IANS HF');

    if (result?.IASPoint?.lactate > result?.IANSPoint?.lactate) errors.push('IAS lactate > IANS lactate');

    if (result?.IANSPoint?.load > 400) errors.push('IANS unrealistic load');

    return {
        valid: errors.length === 0,
        errors
    };
}

// ------------------------------------------------
// 🔹 2026-08-14 (Europe/Sofia) — Testability pass: pulled out of Page11.tsx
// where they lived as component-local (but actually pure — they only touch
// their own arguments) functions. Moving them here makes the underlying
// business logic something a unit test can hit directly, without needing a
// full React/Redux render. Page11.tsx now calls these via ErgometryUtil.*
// instead of the local copies it used to have; behavior is unchanged.
// ------------------------------------------------

// 🔹 Datenerfassung input format rules ("3.32 CCC Laktat Datenerfassung
// und Auswertung": "Herzfrequenzwerte können nur in Format 0 eingegeben
// werden" / Laktat "0 / 0,0 / 0,00 / 0.0 / 0.00") — extracted out of
// DatenerfassungComponentList.tsx's updateHf/updateLactate so the input
// sanitizing itself is unit-testable as plain string->string functions,
// independent of the TextInput/FlatList wiring around them.

// 🔹 HF: digits only, no decimals/letters
function sanitizeHfInput(value) {
    return String(value ?? '').replace(/[^0-9]/g, '');
}

// 🔹 Laktat: digits + at most ONE separator (, or .), max 2 digits after it
function sanitizeLactateInput(value) {

    let cleaned = String(value ?? '').replace(/[^0-9.,]/g, '');

    const firstSeparatorMatch = cleaned.match(/[.,]/);

    if (firstSeparatorMatch) {

        const sepIndex = firstSeparatorMatch.index;

        const integerPart = cleaned.slice(0, sepIndex).replace(/[.,]/g, '');

        const decimalPart = cleaned
            .slice(sepIndex + 1)
            .replace(/[.,]/g, '')
            .slice(0, 2);

        cleaned = `${integerPart}${cleaned[sepIndex]}${decimalPart}`;
    }

    return cleaned;
}

// 🔹 Datenerfassung Eingabelogik ("3.32 CCC Laktat Datenerfassung"):
// "Wird der Button 'Laktatkurve'/'Auswertung' betätigt: wird eine
// unvollständige letzte Stufe automatisch gelöscht" — a stage counts as
// "incomplete" only when BOTH HF and Laktat are empty (either one alone is
// fine — Laktat is optional per stage, per the same spec).
function stripIncompleteLastRow(sourceData) {

    if (!sourceData?.length) return sourceData;

    const last = sourceData[sourceData.length - 1];

    const hfEmpty =
        last.hf === '' ||
        last.hf === undefined ||
        last.hf === null;

    const lactateEmpty =
        last.lactate === '' ||
        last.lactate === undefined ||
        last.lactate === null;

    if (hfEmpty && lactateEmpty) {
        return sourceData.slice(0, -1);
    }

    return sourceData;
}

// 🔹 Plausibilitätsprüfung: "Die Belastungswerte müssen stufenweise
// ansteigen. Abfallende oder identische Belastungswerte sind nicht
// zulässig." Does NOT block the calculation (spec wants a warning/pointer
// to a different model, not a hard stop) — just returns a message key (or
// null when the load column is fine) for the UI to show.
//
// `getErrorMessage` is injectable so this stays pure/framework-free — the
// caller (Page11.tsx) passes LanguageUtil.getName, a test can pass a plain
// identity function or a stub.
function checkLoadPlausibility(rows, getErrorMessage = (key) => key) {

    for (let i = 1; i < rows.length; i++) {

        if (Number(rows[i].load) <= Number(rows[i - 1].load)) {
            return getErrorMessage('plausibility_load_error_text');
        }
    }

    return null;
}

// 🔹 Save vs Update semantics for the Archive button (Page11.tsx
// saveIntoArchive_History): if `loadedReportId` points at a report that
// still exists in `existingReports`, UPDATE that entry in place (keeps its
// id, refreshes ergometry/result/createdAt) instead of piling up a
// duplicate every time Archive is clicked. Otherwise, append a new one.
// `buildUpdatedReport`/`buildNewReport` are injected so this function stays
// free of the MDErgometryReport model class — the caller decides how the
// actual report object gets constructed; this function only decides WHICH
// path to take and returns the resulting array/id.
function resolveArchiveSaveOrUpdate({
    existingReports,
    loadedReportId,
    buildUpdatedReport,
    buildNewReport
}) {

    const reports = existingReports ?? [];

    const existingIndex = loadedReportId
        ? reports.findIndex((r) => r.id === loadedReportId)
        : -1;

    if (existingIndex !== -1) {

        const updatedReports = [...reports];

        updatedReports[existingIndex] = buildUpdatedReport(reports[existingIndex]);

        return {
            reportId: loadedReportId,
            updatedReports,
            wasUpdate: true,
            existingIndex
        };
    }

    const newReport = buildNewReport();

    return {
        reportId: newReport.id,
        updatedReports: [...reports, newReport],
        wasUpdate: false,
        existingIndex: -1
    };
}

function getReportByModel(reports, model) {

    if (!reports || !model)
        return null;

    return reports.find(
        p => p.model === model
    ) ?? null;
}

function createReport(
    measurements,
    model
) {

    if (
        !measurements ||
        !model
    ) {
        return null;
    }

    const rows =
        measurements?.ergometry?.data;

    const type =
        measurements?.ergometry?.type;

    console.log("===== CREATE REPORT =====");
    console.log("model:", model);
    console.table(rows);

    if (!rows?.length)
        return null;

    let result = null;

    if (model === ERGOMETRY_MODELS.DICKHUTH)
        result =
            ErgometryModelsUtil.calculateDickhuth(rows);

    if (model === ERGOMETRY_MODELS.FREIBURG)
        result =
            ErgometryModelsUtil.calculateFreiburg(rows);

    if (model === ERGOMETRY_MODELS.LINEAR)
        result =
            ErgometryModelsUtil.calculateLinear(rows);

    if (model === ERGOMETRY_MODELS.LTP)
        result =
            ErgometryModelsUtil.calculateLTP(rows);

    if (model === ERGOMETRY_MODELS.KEUL)
        result =
            ErgometryModelsUtil.calculateKeul(rows, type);

    if (model === ERGOMETRY_MODELS.KEUL_LEGACY)
        result =
            ErgometryModelsUtil.calculateMaxSlopeMethodKeulLegacy(rows);

    console.log("RESULT");
    console.log(result);

    return {

        model,

        validation:
            validateResult(
                result
            ),

        result
    };

}

function calculateWattPerKg(load, weight) {

    if (
        load == null ||
        weight == null ||
        weight === 0
    ) {

        return null;

    }

    return Number(
        (load / weight).toFixed(2)
    );

}

function calculateHFPercent(hf, hfMax) {

    if (
        hf == null ||
        hfMax == null ||
        hfMax === 0
    ) {

        return null;

    }

    return Number(
        ((hf / hfMax) * 100).toFixed(0)
    );

}

function calculateVO2Percent(
    report
) {

    // TODO:
    // Formula not available yet.

    return "TODO";

}

function calculateSpeed(
    point,
    ergoType
) {

    if (
        !point ||
        ergoType === "bike"
    ) {

        return "-";

    }

    // TODO:
    // Calculate treadmill speed from stage/load.

    return "TODO";

}

function calculateVO2(point,measurements) {

    // TODO:
    // VO₂ formula

    return "TODO";

}

function calculateVO2Kg(point, measurements) {

    // TODO:
    // VO₂ ml/kg/min formula

    return "TODO";

}

function calculateHeartRateZones(
    measurements
) {

    if (
        !measurements?.heartrateReserve ||
        !measurements?.heartraterest
    ) {

        return [];

    }

    const percents = [

        45,
        50,
        55,
        60,
        65,
        70,
        75,
        80,
        85,
        90,
        95,
        100,
        105,
        110

    ];

    const zones = [];

    for (let i = 0; i < percents.length; i++) {

        const p =
            percents[i] / 100;

        zones.push(

            Math.round(

                measurements.heartraterest +

                measurements.heartrateReserve * p

            )

        );

    }

    return zones;

}


export const ErgometryUtil = {

    getSollLeistungNorm,

    getSollLeistungWeight,

    generateFakeTest,

    generateFakeErgometry,

    validateResult,
    validateAllModels,
    getReportByModel,

    stripIncompleteLastRow,
    checkLoadPlausibility,
    resolveArchiveSaveOrUpdate,
    sanitizeHfInput,
    sanitizeLactateInput,

    calculateWattPerKg,
    calculateHFPercent,
    calculateSpeed,
    calculateVO2Percent,
    calculateVO2,
    calculateVO2Kg,
    calculateHeartRateZones,
    createReport

};