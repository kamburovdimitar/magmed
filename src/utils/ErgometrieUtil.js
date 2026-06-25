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

function getSollLeistungNorm(age, gender) {

    for (let i = 0; i < SOLL_TABLE.length; i++) {

        const row = SOLL_TABLE[i];

        if (age >= row.min && age <= row.max) {

            return gender === "female"
                ? row.female
                : row.male;
        }
    }

    return 0;
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

function validateAllModels(rows) {

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

        if (models[i] === ERGOMETRY_MODELS.KEUL) result = ErgometryModelsUtil.calculateKeul(rows);

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


export const ErgometryUtil = {

    getSollLeistungNorm,

    getSollLeistungWeight,

    generateFakeTest,

    generateFakeErgometry,

    validateResult,
    validateAllModels,
};