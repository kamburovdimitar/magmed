// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 13:30 (Europe/Sofia) — Added calculateTrainingZoneTable(): Codex/CCC
//   "3.34 Laktatkurve und Trainingsbereich" cascade — HF zone boundary first
//   (% of IANS-HF for Freiburger/Keul, or anchored to the measured IAS/IANS
//   points for Dickhuth/Stückweise-linear/Linear/Keul-Legacy), then Watt/km-h
//   looked up on the real measured stage curve via interpolateByHF (never a
//   % multiplication of the threshold load).
// ============================================

import { MDErgometryReportResult } from '../model/MDErgometryReportResult';
/**
 * 🔹 Dickhuth method
 *
 * Calculates aerobic (IAS) and anaerobic (IANS) thresholds
 * using the minimal lactate value (lmin).
 *
 * Formula:
 * IAS = lmin + 0.5 mmol/L
 * IANS = lmin + 1.5 mmol/L
 *
 * Processing:
 * 1. Finds the lowest lactate value in dataset
 * 2. Calculates IAS/IANS thresholds
 * 3. Interpolates exact load/hf values between stages
 *
 * @param {Array} data
 * Array of stage objects:
 * [
 *   {
 *     lactate: Number|String,
 *     load: Number,
 *     hf: Number,
 *     stage: String
 *   }
 * ]
 *
 * @returns {Object}
 * {
 *   lmin,
 *   IAS,
 *   IANS,
 *   lminRow,
 *   IASPoint,
 *   IANSPoint
 * }
 */
function calculateDickhuth(data) {



        console.trace("calculateDickhuth called");

    console.log("========== DICKHUTH ==========");


    console.log("Array.isArray:", Array.isArray(data));
    console.log("Length:", data?.length);

    if (data?.length) {
        console.log("First item:");
        console.log(data[0]);
    }

    if (!data || data.length === 0) {

        console.log("No data.");

        return null;
    }

    console.table(data);

    let lmin = Number.MAX_VALUE;

    let lminRow = null;

    for (let i = 0; i < data.length; i++) {

        const lactate =
            Number(data[i].lactate);

        console.log(
            "Row:",
            i,
            " Lactate:",
            data[i].lactate,
            " Number:",
            lactate
        );

        if (lactate < lmin) {

            lmin = lactate;

            lminRow = data[i];

            console.log(
                "New LMIN:",
                lmin
            );

        }

    }

    console.log("Final LMIN:", lmin);
    console.log("LMIN ROW:", lminRow);

    const IAS =
        lmin + 0.5;

    const IANS =
        lmin + 1.5;

    console.log("IAS:", IAS);
    console.log("IANS:", IANS);

    const IASPoint =
        interpolateThreshold(
            data,
            IAS
        );

    const IANSPoint =
        interpolateThreshold(
            data,
            IANS
        );

    console.log("IASPoint:");
    console.log(IASPoint);

    console.log("IANSPoint:");
    console.log(IANSPoint);

    console.log("==============================");

    return {

        lmin,

        IAS,

        IANS,

        lminRow,

        IASPoint,

        IANSPoint

    };

}

/**
 * 🔹 Freiburg method
 *
 * Calculates anaerobic threshold based on:
 * IANS = lmin + 2.0 mmol/L
 *
 * IAS is estimated as 75% of IANS load.
 *
 * Processing:
 * 1. Finds minimal lactate value
 * 2. Calculates IANS
 * 3. Interpolates exact threshold point
 * 4. Derives IAS from 75% of IANS
 *
 * @param {Array} data
 * Ergometry stage dataset
 *
 * @returns {Object}
 * {
 *   lmin,
 *   IAS,
 *   IANS,
 *   lminRow,
 *   IASPoint,
 *   IANSPoint
 * }
 */
function calculateFreiburg(data) {

    if (!data || data.length === 0) {
        return null;
    }

    let lmin = Number.MAX_VALUE;

    let lminRow = null;

    for (let i = 0; i < data.length; i++) {
        const lactate = Number(data[i].lactate);

        if (lactate < lmin) {
            lmin = lactate;
            lminRow = data[i];
        }
    }

    const IANS = lmin + 2.0;
    const IANSPoint = interpolateThreshold(data, IANS);

    let IASPoint = null;
    let IAS = null;

   if (IANSPoint) {

    const targetHF = IANSPoint.hf * 0.75;

    IASPoint = interpolateByHF(data, targetHF);

    if (IASPoint) IAS = IASPoint.lactate;
    }

    return {
        lmin,
        IAS,
        IANS,
        lminRow,
        IASPoint,
        IANSPoint
    };
}

function calculateChartMaxLoad(data) {
    let max = 0;

    for (let i = 0; i < data.length; i++) {
        const load = Number(data[i].load);

        if (!isNaN(load) && load > max) {
            max = load;
        }
    }

    // 🔥 visual padding
    return max + 2;
}



/**
 * 🔹 Linear method
 *
 * Detects thresholds using lactate curve progression.
 *
 * IAS:
 * First point where lactate exceeds baseline + 0.4
 *
 * IANS:
 * Point where lactate slope sharply increases
 * (slope2 > slope1 * 1.5)
 *
 * Processing:
 * 1. Uses first lactate as baseline
 * 2. Searches for aerobic threshold
 * 3. Detects anaerobic breakpoint
 *
 * @param {Array} data
 * Ergometry stage dataset
 *
 * @returns {Object}
 * {
 *   lmin,
 *   IAS,
 *   IANS,
 *   lminRow,
 *   IASPoint,
 *   IANSPoint
 * }
 */
function calculateLinear(data) {

    if (data.length < 3) {
        return null;
    }

    let IASPoint = null;
    let IANSPoint = null;
    let IASIndex = -1;

    const baseline =
        Number(data[0].lactate);

    // 🔹 IAS
    for (let i = 1; i < data.length; i++) {

        const current =
            Number(data[i].lactate);

        if (current > baseline + 0.4) {

            IASPoint = {

                lactate: current,

                load: data[i].load,

                hf: Number(data[i].hf),

                stage: data[i].stage,

                stageRange: `${data[i].stage}`

            };

            IASIndex = i;

            break;

        }

    }

    // 🔹 IANS ONLY AFTER IAS
    if (IASIndex !== -1) {

        for (let i = IASIndex; i < data.length - 1; i++) {

            const prev =
                Number(data[i - 1].lactate);

            const current =
                Number(data[i].lactate);

            const next =
                Number(data[i + 1].lactate);

            const slope1 =
                current - prev;

            const slope2 =
                next - current;

            if (slope2 > slope1 * 1.5) {

                IANSPoint = {

                    lactate: current,

                    load: data[i].load,

                    hf: Number(data[i].hf),

                    stage: data[i].stage,

                    stageRange: `${data[i].stage}`

                };

                break;

            }

        }

    }

    const result =
        new MDErgometryReportResult();

    result.IAS =
        IASPoint?.lactate ?? null;

    result.IANS =
        IANSPoint?.lactate ?? null;

    result.IASPoint =
        IASPoint;

    result.IANSPoint =
        IANSPoint;

    return result;

}
/**
 * 🔹 Keul method
 *
 * Calculates anaerobic threshold based on
 * maximal lactate/load slope.
 *
 * Formula:
 * slope = Δlactate / Δload
 *
 * Processing:
 * 1. Calculates slope between all stages
 * 2. Finds highest slope increase
 * 3. Uses that point as IANS
 * 4. IAS derived as 75% of IANS load
 *
 * @param {Array} data
 * Ergometry stage dataset
 *
 * @returns {Object}
 * {
 *   lmin,
 *   IAS,
 *   IANS,
 *   lminRow,
 *   IASPoint,
 *   IANSPoint,
 *   maxSlope
 * }
 */
function calculateMaxSlopeMethodKeulLegacy(data) {

    if (!data || data.length < 2) {
        return null;
    }

    let maxSlope = 0;
    let IANSPoint = null;

    for (let i = 0; i < data.length - 1; i++) {

        const p1 = data[i];
        const p2 = data[i + 1];

        const lactate1 = Number(p1.lactate);
        const lactate2 = Number(p2.lactate);

        const load1 = Number(p1.load);
        const load2 = Number(p2.load);

        const loadDiff = load2 - load1;

        if (
            isNaN(lactate1) ||
            isNaN(lactate2) ||
            isNaN(load1) ||
            isNaN(load2) ||
            loadDiff <= 0
        ) {
            continue;
        }

        const slope =
            (lactate2 - lactate1) / loadDiff;

        if (slope > maxSlope) {

            maxSlope = slope;

            IANSPoint = {

                lactate: lactate2,

                load: load2,

                hf: Number(p2.hf),

                stage: p2.stage,

                stageRange: `${p1.stage}-${p2.stage}`

            };

        }

    }

    let IASPoint = null;

    if (IANSPoint) {

        const derivedLoad =
            Number((IANSPoint.load * 0.75).toFixed(1));

        IASPoint =
            interpolateByLoad(
                data,
                derivedLoad
            );

    }

    if (
        IASPoint &&
        IANSPoint &&
        IASPoint.lactate >= IANSPoint.lactate
    ) {

        console.warn(
            'Invalid Keul thresholds'
        );

    }

    return {

        lmin: null,

        IAS:
            IASPoint?.lactate || null,

        IANS:
            IANSPoint?.lactate || null,

        lminRow: null,

        IASPoint,

        IANSPoint,

        maxSlope:
            Number(maxSlope.toFixed(4))

    };

}

// 🔹 type: 'bike' | 'run' — Keul-модел ползва различен tangent slope за
// IANS/LPT2 според мерната единица на натоварването (виж PDF-a
// "3.32CCC_Laktatkurve_Rechenverfahren_BEISPIELE_PROJEKT", стр. 5-6):
//   - Watt (bike):  Tangentensteigung 0,055  (Steigungswinkel 3,14°)
//   - km/h (run):   Tangentensteigung 1,26   (Steigungswinkel 51,34°)
// По-рано тук стоеше hardcoded 0.055 за всички случаи — коректно само за
// bike, грешно за run/km-h тестове (даваше грешен IANS load за бягане).
function calculateKeul(data, type) {

    if (!data || data.length < 3) return null;

    const points = [];

    for (let i = 0; i < data.length; i++) {

        const load = Number(data[i].load);
        const lactate = Number(data[i].lactate);

        if (isNaN(load) || isNaN(lactate) || lactate <= 0) continue;

        points.push({
            load: load,
            lactate: lactate,
            hf: Number(data[i].hf),
            stage: data[i].stage
        });
    }

    if (points.length < 3) return null;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < points.length; i++) {

        const x = points[i].load;
        const y = Math.log(points[i].lactate);

        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    const n = points.length;
    const denominator = (n * sumXX) - (sumX * sumX);

    if (denominator === 0) return null;

    const b = ((n * sumXY) - (sumX * sumY)) / denominator;
    const lnA = (sumY - (b * sumX)) / n;
    const a = Math.exp(lnA);

    if (a <= 0 || b === 0 || (a * b) <= 0) return null;

    const targetSlope = type === 'run' ? 1.26 : 0.055;

    let iansLoad = Math.log(targetSlope / (a * b)) / b;

    if (isNaN(iansLoad) || !isFinite(iansLoad)) return null;

    const minLoad = points[0].load;
    const maxLoad = points[points.length - 1].load;

    if (iansLoad < minLoad) iansLoad = minLoad;

    if (iansLoad > maxLoad) iansLoad = maxLoad;

    const IANSPoint = interpolateByLoad(data, iansLoad);

    if (!IANSPoint) return null;

    const IASPoint = interpolateByHF(data, IANSPoint.hf * 0.75);

    return {

        model: 'keul',

        IAS: IASPoint?.lactate || null,

        IANS: IANSPoint.lactate,

        IASPoint: IASPoint,

        IANSPoint: IANSPoint,

        a: Number(a.toFixed(6)),

        b: Number(b.toFixed(6)),

        iansLoad: Number(iansLoad.toFixed(1)),

        targetSlope: targetSlope,

        exponentialFit: {
            a: a,
            b: b
        }
    };
}
/**
 * 🔹 HF %
 *
 * Calculates heart rate percentage
 * relative to maximal heart rate.
 *
 * Formula:
 * HF% = (hf / hfMax) * 100
 *
 * @param {Number} hf
 * Current heart rate
 *
 * @param {Number} hfMax
 * Maximal heart rate
 *
 * @returns {Number}
 * Percentage value
 */
function calculateHFPercent(hf, hfMax) {

    if (!hfMax) {

        return 0;
    }

    return Number(((hf / hfMax) * 100).toFixed(1));
}

/**
 * 🔹 Pmax %
 *
 * Calculates workload percentage
 * relative to maximal workload.
 *
 * Formula:
 * Pmax% = (load / maxLoad) * 100
 *
 * @param {Number} load
 * Current workload
 *
 * @param {Number} maxLoad
 * Maximal workload
 *
 * @returns {Number}
 * Percentage value
 */
function calculatePmaxPercent(load, maxLoad) {

    if (!maxLoad) {

        return 0;
    }

    return Number(((load / maxLoad) * 100).toFixed(1));
}

/**
 * 🔹 HRR %
 *
 * Heart Rate Reserve percentage
 * using Karvonen formula.
 *
 * Formula:
 * HRR% =
 * ((hf - hfRest) / (hfMax - hfRest)) * 100
 *
 * @param {Number} hf
 * Current heart rate
 *
 * @param {Number} hfRest
 * Resting heart rate
 *
 * @param {Number} hfMax
 * Maximal heart rate
 *
 * @returns {Number}
 * Percentage value
 */
function calculateHRRPercent(hf, hfRest, hfMax) {

    if (!hfMax || hfMax === hfRest) {

        return 0;
    }

    return Number((((hf - hfRest) / (hfMax - hfRest)) * 100).toFixed(1));
}

/**
 * 🔹 Threshold interpolation
 *
 * Finds exact threshold point between
 * two measured stages using linear interpolation.
 *
 * Processing:
 * 1. Finds two stages surrounding target lactate
 * 2. Calculates interpolation ratio
 * 3. Interpolates load and heart rate
 *
 * Formula:
 * ratio = (target - l1) / (l2 - l1)
 *
 * interpolatedValue =
 * value1 + ratio * (value2 - value1)
 *
 * @param {Array} data
 * Ergometry stage dataset
 *
 * @param {Number} target
 * Target lactate threshold
 *
 * @returns {Object|null}
 * {
 *   lactate,
 *   load,
 *   hf,
 *   stage
 * }
 */
function interpolateThreshold(
    data,
    target
) {

    if (!data || data.length < 2)
        return null;

    for (let i = 0; i < data.length - 1; i++) {

        const p1 = data[i];
        const p2 = data[i + 1];

        const l1 = Number(p1.lactate);
        const l2 = Number(p2.lactate);

        if (
            isNaN(l1) ||
            isNaN(l2)
        ) {
            continue;
        }

        if (l1 === l2) {
            continue;
        }

        if (
            (target >= l1 && target <= l2) ||
            (target >= l2 && target <= l1)
        ) {

            const ratio =
                (target - l1) /
                (l2 - l1);

            const interpolatedLoad =
                p1.load +
                ratio * (p2.load - p1.load);

            const hf1 =
                Number(p1.hf);

            const hf2 =
                Number(p2.hf);

            const interpolatedHF =
                hf1 +
                ratio * (hf2 - hf1);

            return {

                lactate: target,

                load:
                    Number(
                        interpolatedLoad.toFixed(1)
                    ),

                hf:
                    Number(
                        interpolatedHF.toFixed(0)
                    ),

                stage:
                    `${p1.stage}-${p2.stage}`,

                stageRange:
                    `${p1.stage}-${p2.stage}`

            };

        }

    }

    return null;

}
function interpolateByHF(data, targetHF) {

    if (!data || data.length < 2) {
        return null;
    }

    for (let i = 0; i < data.length - 1; i++) {

        const p1 = data[i];
        const p2 = data[i + 1];

        const hf1 = Number(p1.hf);
        const hf2 = Number(p2.hf);

        if (isNaN(hf1) || isNaN(hf2)) {
            continue;
        }

        if (targetHF >= hf1 && targetHF <= hf2) {

            const ratio =
                (targetHF - hf1) / (hf2 - hf1);

            return {

                load:
                    p1.load + ((p2.load - p1.load) * ratio),

                lactate:
                    p1.lactate + ((p2.lactate - p1.lactate) * ratio),

                hf: targetHF,

                // Старото поведение
                stage: p1.stage,

                // Новото - за UI
                stageRange: `${p1.stage}-${p2.stage}`

            };

        }

    }

    return null;

}
/**
 * 🔹 Automatic interpretation
 *
 * Generates textual interpretation
 * based on IAS/IANS results.
 *
 * Processing:
 * 1. Evaluates aerobic threshold
 * 2. Evaluates anaerobic capacity
 * 3. Evaluates lactate kinetics
 *
 * @param {Object} result
 * Threshold calculation result
 *
 * @returns {Array}
 * Array of interpretation texts
 */
function generateInterpretation(result) {

    const texts = [];

    // 🔹 IAS
    if (result?.IASPoint?.load < 100) {

        texts.push('Low aerobic threshold.');
    }
    else if (result?.IASPoint?.load < 180) {

        texts.push('Moderate aerobic capacity.');
    }
    else {

        texts.push('Well developed aerobic threshold.');
    }

    // 🔹 IANS
    if (result?.IANSPoint?.load < 140) {

        texts.push('Reduced anaerobic performance.');
    }
    else if (result?.IANSPoint?.load < 220) {

        texts.push('Normal anaerobic capacity.');
    }
    else {

        texts.push('Excellent anaerobic performance.');
    }

    // 🔹 lactate kinetics
    if (result?.IANS > 4) {

        texts.push('Delayed lactate accumulation.');
    }
    else {

        texts.push('Normal lactate kinetics.');
    }

    return texts;
}

function calculateChartMaxLactate(
    data
) {

    let max = 0;

    for (let i = 0; i < data.length; i++) {

        if (data[i].lactate > max) {

            max = data[i].lactate;
        }
    }

    if (max <= 15) {
        return 15;
    }

    if (max <= 20) {
        return 20;
    }

    if (max <= 25) {
        return 25;
    }

    return Math.ceil(max / 5) * 5;
}

function interpolateByLoad(
    data,
    targetLoad
) {

    for (let i = 0; i < data.length - 1; i++) {

        const p1 = data[i];
        const p2 = data[i + 1];

        const load1 = Number(p1.load);
        const load2 = Number(p2.load);

        if (
            targetLoad >= load1 &&
            targetLoad <= load2
        ) {

            const ratio =
                (targetLoad - load1) /
                (load2 - load1);

            return {

                load: targetLoad,

                lactate:
                    p1.lactate + ((p2.lactate - p1.lactate) * ratio),

                hf:
                    p1.hf + ((p2.hf - p1.hf) * ratio),

                stage: p1.stage,

                stageRange: `${p1.stage}-${p2.stage}`

            };

        }

    }

    return null;

}

// ------------------------------------------------
// Training Zones — Codex/CCC-compliant cascade
// ------------------------------------------------
//
// Per "3.34 CCC Laktatkurve und Trainingsbereich":
//   - Freiburger / Keul: zone boundaries = % of IANS heart rate
//     (REG 65-75%, IAS=75%, GA1 75-85%, GA2 85-95%, IANS=100%, E1 95-105%, E2 >105%)
//   - Stückweise linear (LTP) / Dickhuth (and, absent a spec-named bucket,
//     Linear / Keul-Legacy): zone boundaries anchored to the *measured*
//     IAS/IANS heart-rate points instead (REG = IAS-10% .. IAS HF; GA1/GA2
//     split the band between IAS HF and IANS HF-5%). E1/E2 still use %IANS-HF
//     for every model per the spec table.
//
// The spec explicitly forbids deriving zone Watt/km-h by multiplying the
// threshold load by a percentage — instead each HF boundary must be looked
// up against the real measured stage curve. We reuse interpolateByHF for
// that lookup (piecewise-linear over the actual test stages).
//
// 2026-08-14 (Europe/Sofia) — Trainingsbereich UI pass: calculateTrainingZones()
// used to derive its boundaries by naively multiplying the IANS *load* by a
// fixed percentage (0.75/0.85/0.95/1.05) — exactly the "einfache prozentuale
// Multiplikation" the spec explicitly forbids, and inconsistent with
// calculateTrainingZoneTable()'s correct HF-cascade method (the two could
// disagree on the same test). Both now share computeZoneHFBoundaries() so
// the chart's colored bands and the Trainingsbereich table always agree.
// Also added `customPercents` (REG/GA1/GA2/E1 boundary %, editable in the UI
// via TrainingsbereichComponent.tsx or by dragging the boundary directly on
// the chart) — IAS(75%)/IANS(100%) stay fixed anchors per spec, everything
// else defaults to the spec's standard percentages when no override is given.

const PERCENT_IANS_MODELS = ['freiburg', 'keul'];

const DEFAULT_ZONE_PERCENTS = {
    REG: 75,
    GA1: 85,
    GA2: 95,
    E1: 105
};

function resolveZonePercents(customPercents) {

    return {
        REG: customPercents?.REG ?? DEFAULT_ZONE_PERCENTS.REG,
        GA1: customPercents?.GA1 ?? DEFAULT_ZONE_PERCENTS.GA1,
        GA2: customPercents?.GA2 ?? DEFAULT_ZONE_PERCENTS.GA2,
        E1: customPercents?.E1 ?? DEFAULT_ZONE_PERCENTS.E1
    };
}

function formatPace(kmh) {

    if (!kmh || kmh <= 0) return null;

    const paceMin = 60 / kmh;
    const minutes = Math.floor(paceMin);
    const seconds = Math.round((paceMin - minutes) * 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function lookupZonePoint(data, targetHF, isRun) {

    if (targetHF == null || isNaN(targetHF) || !data?.length) return null;

    const point = interpolateByHF(data, targetHF);

    if (!point) return null;

    return {
        hf: Math.round(targetHF),
        lactate: point.lactate != null ? Number(Number(point.lactate).toFixed(1)) : null,
        load: isRun ? Number(Number(point.load).toFixed(1)) : Math.round(point.load),
        pace: isRun ? formatPace(point.load) : null
    };
}

// 🔹 shared by calculateTrainingZoneTable() and calculateTrainingZones() —
// the single source of truth for where each zone boundary sits in HF terms,
// so the table and the chart's colored bands can never disagree.
function computeZoneHFBoundaries(result, model, customPercents) {

    if (!result?.IASPoint || !result?.IANSPoint) return null;

    const measuredIasHF = Number(result.IASPoint.hf);
    const iansHF = Number(result.IANSPoint.hf);

    if (!measuredIasHF || !iansHF) return null;

    const usesPercentIANS = PERCENT_IANS_MODELS.includes(model);

    const percents = resolveZonePercents(customPercents);

    // 🔹 Per the spec table ("Schwellen und Markierungen", 3.34 CCC): for
    // Freiburger/Keul the IAS/LTP1 anchor in the Trainingsbereich is a
    // THEORETICAL point — 75% of IANS-HF — not whatever the chosen model
    // happened to measure as "real" IAS (that's a different, physiological
    // IAS used elsewhere in Auswertung/DetailAnalyse). For Dickhuth/
    // Stückweise-linear/Linear/Keul-Legacy, the Trainingsbereich anchors to
    // the actually measured IAS point instead. Without this split, REG/IAS
    // could end up ABOVE GA1's boundary for percent models whenever the
    // model's measured IAS sits above 75%-of-IANS-HF — an inverted zone.
    // A custom REG% override always wins, for every model.
    const iasHF = (customPercents?.REG != null || usesPercentIANS)
        ? iansHF * percents.REG / 100
        : measuredIasHF;

    // REG always tops out exactly at the IAS point in both methods.
    const regToHF = iasHF;

    const ga2UpperHF = iansHF * percents.GA2 / 100;

    // GA1/GA2 split the IAS↔IANS band for "point" models (Dickhuth/Linear/
    // LTP/Keul Legacy) UNLESS the user gave an explicit override — an
    // explicit % always wins, for every model, so dragging/typing works
    // everywhere.
    const ga1ToHF = (customPercents?.GA1 != null || usesPercentIANS)
        ? iansHF * percents.GA1 / 100
        : (iasHF + ga2UpperHF) / 2;

    const ga2ToHF = ga2UpperHF;

    const e1ToHF = iansHF * percents.E1 / 100;

    return {
        iasHF,
        iansHF,
        regToHF,
        ga1ToHF,
        ga2ToHF,
        e1ToHF,
        percents,
        usesPercentIANS
    };
}

// 🔹 defensive normalize — callers pass either raw Datenerfassung rows
// (stage/time/load/hf/lactate as strings, may include an in-progress last
// row with empty hf/lactate) or an already-filtered/sorted array (like
// LactateChartComponent's own `chartData`). Number("") is 0, not NaN, so
// without this an empty-but-present field would silently interpolate as a
// bogus 0 instead of being skipped — filter + sort defensively either way.
function normalizeChartData(data) {

    if (!data?.length) return [];

    const rows = [];

    for (let i = 0; i < data.length; i++) {

        const load = Number(data[i].load);
        const lactate = Number(data[i].lactate);
        const hf = Number(data[i].hf);

        if (
            data[i].hf === '' || data[i].hf == null ||
            data[i].lactate === '' || data[i].lactate == null ||
            isNaN(load) || isNaN(hf) || isNaN(lactate) || lactate <= 0
        ) {
            continue;
        }

        rows.push({ load, lactate, hf, stage: data[i].stage });
    }

    rows.sort((a, b) => a.load - b.load);

    return rows;
}

function calculateTrainingZoneTable(result, ergometryData, model, isRun = false, customPercents = null) {

    const normalized = normalizeChartData(ergometryData);

    if (!normalized.length) return null;

    const boundaries = computeZoneHFBoundaries(result, model, customPercents);

    if (!boundaries) return null;

    const { iasHF, iansHF, regToHF, ga1ToHF, ga2ToHF, e1ToHF, percents, usesPercentIANS } = boundaries;

    const rowDefs = [
        { key: 'REG', label: 'REG', percent: percents.REG, hfTarget: regToHF },
        { key: 'IAS', label: 'IAS/LTP1', percent: 75, hfTarget: iasHF },
        { key: 'GA1', label: 'GA1', percent: usesPercentIANS || customPercents?.GA1 != null ? percents.GA1 : null, hfTarget: ga1ToHF },
        { key: 'GA2', label: 'GA2', percent: usesPercentIANS || customPercents?.GA2 != null ? percents.GA2 : null, hfTarget: ga2ToHF },
        { key: 'IANS', label: 'IANS/LTP2', percent: 100, hfTarget: iansHF },
        { key: 'E1', label: 'E1', percent: percents.E1, hfTarget: e1ToHF },
        { key: 'E2', label: 'E2', percent: percents.E1, hfTarget: e1ToHF }
    ];

    const rows = rowDefs.map(row => {

        const point = lookupZonePoint(normalized, row.hfTarget, isRun);

        return {
            key: row.key,
            label: row.label,
            percent: row.percent,
            hf: point?.hf ?? Math.round(row.hfTarget),
            lactate: point?.lactate ?? null,
            load: point?.load ?? null,
            pace: point?.pace ?? null
        };
    });

    return {
        method: usesPercentIANS ? 'percent' : 'point',
        percents,
        rows
    };
}

function calculateTrainingZones(result, ergometryData, model, isRun = false, customPercents = null) {

    const normalized = normalizeChartData(ergometryData);

    if (!normalized.length) return null;

    const boundaries = computeZoneHFBoundaries(result, model, customPercents);

    if (!boundaries) return null;

    const { regToHF, ga1ToHF, ga2ToHF, e1ToHF, percents } = boundaries;

    const regTo = interpolateByHF(normalized, regToHF)?.load;
    const ga1To = interpolateByHF(normalized, ga1ToHF)?.load;
    const ga2To = interpolateByHF(normalized, ga2ToHF)?.load;
    const e1To = interpolateByHF(normalized, e1ToHF)?.load;

    if (regTo == null || ga1To == null || ga2To == null || e1To == null) {
        return null;
    }

    return {
        REG: { from: 0, to: regTo, percentFrom: 0, percentTo: percents.REG, color: '#fff176' },
        GA1: { from: regTo, to: ga1To, percentFrom: percents.REG, percentTo: percents.GA1, color: '#81c784' },
        GA2: { from: ga1To, to: ga2To, percentFrom: percents.GA1, percentTo: percents.GA2, color: '#64b5f6' },
        E1: { from: ga2To, to: e1To, percentFrom: percents.GA2, percentTo: percents.E1, color: '#ef9a9a' },
        E2: { from: e1To, to: Number.MAX_VALUE, percentFrom: percents.E1, percentTo: null, color: '#e57373' }
    };

}

function generateLinePoints(
    segment,
    line
) {

    const result = [];

    for (let i = 0; i < segment.length; i++) {

        const x =
            Number(segment[i].load);

        const y =
            line.slope * x +
            line.intercept;

        result.push({

            load: x,

            predicted:
                Number(y.toFixed(2))
        });
    }

    return result;
}

function calculateLTP(data) {

    if (
        !data ||
        data.length < 6
    ) {
        return null;
    }

    const points = [];

    for (let i = 0; i < data.length; i++) {

        const load =
            Number(data[i].load);

        const lactate =
            Number(data[i].lactate);

        if (
            isNaN(load) ||
            isNaN(lactate)
        ) {
            continue;
        }

        points.push({

            load,

            lactate,

            hf: Number(data[i].hf),

            stage: data[i].stage,

            stageRange: `${data[i].stage}`

        });

    }

    if (points.length < 6) {

        return null;

    }

    let bestError =
        Number.MAX_VALUE;

    let bestResult = null;

    for (
        let i = 1;
        i < points.length - 4;
        i++
    ) {

        for (
            let j = i + 2;
            j < points.length - 1;
            j++
        ) {

            const segment1 =
                points.slice(0, i + 1);

            const segment2 =
                points.slice(i, j + 1);

            const segment3 =
                points.slice(j);

            if (
                segment1.length < 2 ||
                segment2.length < 2 ||
                segment3.length < 2
            ) {
                continue;
            }

            const line1 =
                fitLine(segment1);

            const line2 =
                fitLine(segment2);

            const line3 =
                fitLine(segment3);

            const error1 =
                calculateLineError(
                    segment1,
                    line1
                );

            const error2 =
                calculateLineError(
                    segment2,
                    line2
                );

            const error3 =
                calculateLineError(
                    segment3,
                    line3
                );

            const totalError =
                error1 +
                error2 +
                error3;

            if (
                totalError < bestError
            ) {

                bestError =
                    totalError;

                bestResult = {

                    line1Points:
                        generateLinePoints(
                            segment1,
                            line1
                        ),

                    line2Points:
                        generateLinePoints(
                            segment2,
                            line2
                        ),

                    line3Points:
                        generateLinePoints(
                            segment3,
                            line3
                        ),

                    IASPoint:
                        points[i],

                    IANSPoint:
                        points[j],

                    segment1,

                    segment2,

                    segment3,

                    line1,

                    line2,

                    line3,

                    totalError

                };

            }

        }

    }

    if (!bestResult) {

        return null;

    }

    const IASPoint =
        bestResult.IASPoint;

    const IANSPoint =
        bestResult.IANSPoint;

    return {

        model: 'ltp',

        IAS:
            IASPoint.lactate,

        IANS:
            IANSPoint.lactate,

        IASPoint,

        IANSPoint,

        segment1:
            bestResult.segment1,

        segment2:
            bestResult.segment2,

        segment3:
            bestResult.segment3,

        line1:
            bestResult.line1,

        line2:
            bestResult.line2,

        line3:
            bestResult.line3,

        totalError:
            bestResult.totalError,

        line1Points:
            bestResult.line1Points,

        line2Points:
            bestResult.line2Points,

        line3Points:
            bestResult.line3Points

    };

}

function fitLine(points) {

    const n = points.length;

    if (n < 2) {

        return {

            slope: 0,
            intercept: 0
        };
    }

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < points.length; i++) {

        const x =
            Number(points[i].load);

        const y =
            Number(points[i].lactate);

        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    const slope =
        (
            n * sumXY -
            sumX * sumY
        ) /
        (
            n * sumXX -
            sumX * sumX
        );

    const intercept =
        (
            sumY -
            slope * sumX
        ) / n;

    return {

        slope,
        intercept
    };
}

function calculateLineError(
    points,
    line
) {

    let error = 0;

    for (let i = 0; i < points.length; i++) {

        const x =
            Number(points[i].load);

        const actual =
            Number(points[i].lactate);

        const predicted =
            line.slope * x +
            line.intercept;

        const diff =
            actual - predicted;

        error += diff * diff;
    }

    return error;
}


// ------------------------------------------------
// Performance
// ------------------------------------------------

function calculateSollWatt(
    bodySurfaceArea,
    age,
    gender
) {

}





/**
 * ------------------------------------------------
 * #35 - Performance (% Norm)
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #35 = (#32 × 100) / #31
 *
 * Returns:
 * %
 */
function calculateIstPercent(
    istWatt,
    sollWatt
) {

    if (
        istWatt == null ||
        sollWatt == null ||
        sollWatt <= 0
    ) {
        return null;
    }

    return Number(
        (
            (istWatt * 100) /
            sollWatt
        ).toFixed(0)
    );

}

function calculateSollWeightWatt(
    age,
    gender
) {

}

/**
 * ------------------------------------------------
 * #37 - Weight SOLL Power / kg
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #37 = #36 / #11
 *
 * Returns:
 * Watt/kg
 */
function calculateSollWeightWattKg(
    sollWeightWatt,
    weightKg
) {

    if (
        sollWeightWatt == null ||
        weightKg == null ||
        weightKg <= 0
    ) {
        return null;
    }

    return Number(
        (sollWeightWatt / weightKg).toFixed(2)
    );

}

/**
 * ------------------------------------------------
 * #38 - Weight IST Power / kg
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #38 = #32 / #11
 *
 * Returns:
 * Watt/kg
 */
function calculateIstWeightWattKg(
    istWatt,
    weightKg
) {

    if (
        istWatt == null ||
        weightKg == null ||
        weightKg <= 0
    ) {
        return null;
    }

    return Number(
        (istWatt / weightKg).toFixed(2)
    );

}

/**
 * ------------------------------------------------
 * #39 - Weight Performance (% Norm)
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #39 = (#32 × 100) / #36
 *
 * Returns:
 * %
 */
function calculateIstWeightPercent(
    istWatt,
    sollWeightWatt
) {

    if (
        istWatt == null ||
        sollWeightWatt == null ||
        sollWeightWatt <= 0
    ) {
        return null;
    }

    return Number(
        (
            (istWatt * 100) /
            sollWeightWatt
        ).toFixed(0)
    );

}

// ------------------------------------------------
// Heart Rate Reserve
// ------------------------------------------------

function calculateHRR(
    restHF,
    maxHF,
    intensity
) {

    if (
        restHF == null ||
        maxHF == null
    ) {
        return null;
    }

    return Math.round(
        restHF +
        ((maxHF - restHF) * intensity)
    );

}



// ------------------------------------------------
// VO2
// ------------------------------------------------

function calculateVO2HeartRate(
    maxHF,
    percent
) {

    if (
        maxHF == null
    ) {
        return null;
    }

    return Math.round(
        maxHF *
        (percent / 100)
    );

}

function calculateWattPerKg(
    watt,
    weight
) {

    if (
        watt == null ||
        weight == null ||
        weight <= 0
    ) {
        return null;
    }

    return Number(
        (watt / weight).toFixed(2)
    );

}

function calculateVO2Percent(
    point
) {

    if (!point) {
        return "-";
    }

    // TODO:
    // Implement according to the official MAGMED
    // Ergometry Formula Specification (PDF 3.21b).
    //
    // The current IAS/IANS points do not contain
    // enough information to calculate %VO₂ correctly.
    //
    // The final implementation should use the
    // official formula from the specification.

    return "-";

}


/**
 * ------------------------------------------------
 * #12 - Body Surface Area (BSA)
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #12 = 0.007184 × Weight^0.425 × Height^0.725
 *
 * Du Bois Formula
 *
 * Height: cm
 * Weight: kg
 *
 * Returns:
 * m²
 */
function calculateBSA(
    heightCm,
    weightKg
) {

    if (
        heightCm == null ||
        weightKg == null
    ) {
        return null;
    }

    return Number(
        (
            0.007184 *
            Math.pow(weightKg, 0.425) *
            Math.pow(heightCm, 0.725)
        ).toFixed(2)
    );

}

/**
 * ------------------------------------------------
 * #13 - Body Mass Index (BMI)
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #13 = Weight / Height²
 *
 * Height: meters
 *
 * Returns:
 * kg/m²
 */
function calculateBMI(
    heightCm,
    weightKg
) {

    if (
        heightCm == null ||
        weightKg == null ||
        heightCm <= 0
    ) {
        return null;
    }

    const heightM =
        heightCm / 100;

    return Number(
        (
            weightKg /
            (heightM * heightM)
        ).toFixed(1)
    );

}

/**
 * ------------------------------------------------
 * #16 - Waist Hip Ratio (WHR)
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #16 = Waist / Hip
 *
 * Returns:
 * Ratio
 */
function calculateWHR(
    waistCm,
    hipCm
) {

    if (
        waistCm == null ||
        hipCm == null ||
        hipCm <= 0
    ) {
        return null;
    }

    return Number(
        (
            waistCm / hipCm
        ).toFixed(2)
    );

}

/**
 * ------------------------------------------------
 * #18 - Fat Mass
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #18 = Weight × Fat% / 100
 *
 * Returns:
 * kg
 */
function calculateFatMass(
    weightKg,
    bodyFatPercent
) {

    if (
        weightKg == null ||
        bodyFatPercent == null
    ) {
        return null;
    }

    return Number(
        (
            weightKg *
            (bodyFatPercent / 100)
        ).toFixed(1)
    );

}

/**
 * ------------------------------------------------
 * #25 - Expected Heart Rate
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #25 = 220 - Age
 *
 * Returns:
 * bpm
 */
function calculateExpectedHeartRate(
    age
) {

    if (
        age == null
    ) {
        return null;
    }

    return 220 - age;

}

/**
 * ------------------------------------------------
 * #33 - SOLL Power / kg
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #33 = #31 / #11
 *
 * Returns:
 * Watt/kg
 */
function calculateSollWattKg(
    sollWatt,
    weightKg
) {

    if (
        sollWatt == null ||
        weightKg == null ||
        weightKg <= 0
    ) {
        return null;
    }

    return Number(
        (sollWatt / weightKg).toFixed(2)
    );

}


/**
 * ------------------------------------------------
 * #34 - IST Power / kg
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #34 = #32 / #11
 *
 * Returns:
 * Watt/kg
 */
function calculateIstWattKg(
    istWatt,
    weightKg
) {

    if (
        istWatt == null ||
        weightKg == null ||
        weightKg <= 0
    ) {
        return null;
    }

    return Number(
        (istWatt / weightKg).toFixed(2)
    );

}

/**
 * ------------------------------------------------
 * #47 - IAS Power / kg
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #47 = IAS Watt / Weight
 *
 * Returns:
 * Watt/kg
 */
function calculateIASWattKg(
    IASPoint,
    weightKg
) {

    return calculateWattPerKg(
        IASPoint?.load,
        weightKg
    );

}

/**
 * ------------------------------------------------
 * #48 - IANS Power / kg
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #48 = IANS Watt / Weight
 *
 * Returns:
 * Watt/kg
 */
function calculateIANSWattKg(
    IANSPoint,
    weightKg
) {

    return calculateWattPerKg(
        IANSPoint?.load,
        weightKg
    );

}

/**
 * ------------------------------------------------
 * #49 - IAS Heart Rate
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #49 = Heart Rate at IAS
 *
 * Returns:
 * bpm
 */
function calculateIASHeartRate(
    IASPoint
) {

    if (!IASPoint) {
        return null;
    }

    return IASPoint.hf ?? null;

}

/**
 * ------------------------------------------------
 * #50 - IANS Heart Rate
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #50 = Heart Rate at IANS
 *
 * Returns:
 * bpm
 */
function calculateIANSHeartRate(
    IANSPoint
) {

    if (!IANSPoint) {
        return null;
    }

    return IANSPoint.hf ?? null;

}

/**
 * ------------------------------------------------
 * #68 - IAS Speed (% Max Speed)
 * ------------------------------------------------
 *
 * MAGMED Codex:
 * #68 = IAS Speed × 100 / Max Speed
 *
 * Returns:
 * %
 */
function calculateIASSpeedPercent(
    IASSpeed,
    maxSpeed
) {

    if (
        IASSpeed == null ||
        maxSpeed == null ||
        maxSpeed <= 0
    ) {
        return null;
    }

    return Math.round(
        (IASSpeed * 100) / maxSpeed
    );

}





export const ErgometryModelsUtil = {

    calculateDickhuth,
    calculateLinear,

    calculateFreiburg,

    calculateKeul,

    calculateMaxSlopeMethodKeulLegacy,

    interpolateThreshold,

    interpolateByHF,

    interpolateByLoad,

    calculateHFPercent,

    calculatePmaxPercent,

    calculateHRRPercent,

    generateInterpretation,

    calculateChartMaxLoad,

    calculateChartMaxLactate,

    calculateTrainingZones,
    calculateTrainingZoneTable,
    normalizeChartData,
    DEFAULT_ZONE_PERCENTS,

    calculateLTP,

    // Performance
    calculateSollWatt,
    calculateSollWattKg,
    calculateIstWattKg,
    calculateIstPercent,
    calculateSollWeightWatt,
    calculateSollWeightWattKg,
    calculateIstWeightWattKg,
    calculateIstWeightPercent,

    // Heart Rate Reserve
    calculateHRR,

    // IANS
    calculateIANSHeartRate,

    // VO₂
    calculateVO2HeartRate,
    calculateVO2Percent,
    calculateWattPerKg,
    // CODEX
    calculateBSA,
    calculateBMI,
    calculateWHR,
    calculateFatMass,
    calculateExpectedHeartRate,
    calculateIASWattKg,
    calculateIANSWattKg,
    calculateIASHeartRate,
    calculateIASSpeedPercent
    

};