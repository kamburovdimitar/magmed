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

    const IAS = lmin + 0.5;

    const IANS = lmin + 1.5;

    // 🔹 closest practical points
    const IASPoint = interpolateThreshold(data, IAS);

    const IANSPoint = interpolateThreshold(data, IANS);

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

    const baseline = Number(data[0].lactate);

    // 🔹 IAS
    for (let i = 1; i < data.length; i++) {

        const current = Number(data[i].lactate);

        if (current > baseline + 0.4) {

            IASPoint = {

                lactate: current,
                load: data[i].load,
                hf: Number(data[i].hf),
                stage: data[i].stage

            };

            IASIndex = i;

            break;
        }
    }

    // 🔹 IANS ONLY AFTER IAS
    if (IASIndex !== -1) {

        for (let i = IASIndex; i < data.length - 1; i++) {

            const prev = Number(data[i - 1].lactate);
            const current = Number(data[i].lactate);
            const next = Number(data[i + 1].lactate);

            const slope1 = current - prev;
            const slope2 = next - current;

            if (slope2 > slope1 * 1.5) {

                IANSPoint = {

                    lactate: current,
                    load: data[i].load,
                    hf: Number(data[i].hf),
                    stage: data[i].stage

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

    /**
     * 🔹 interpolate point by load
     */
    let maxSlope = 0;
    let IANSPoint = null;

    /**
     * 🔹 find maximum slope
     */
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

        const slope = (lactate2 - lactate1) / loadDiff;

        if (slope > maxSlope) {
            maxSlope = slope;

            IANSPoint = {
                lactate: lactate2,
                load: load2,
                hf: Number(p2.hf),
                stage: p2.stage
            };
        }
    }

    /**
     * 🔹 derive IAS
     * 75% of IANS load
     */
    let IASPoint = null;

    if (IANSPoint) {
        const derivedLoad = Number((IANSPoint.load * 0.75).toFixed(1));

        IASPoint = interpolateByLoad(data, derivedLoad);
    }

    /**
     * 🔹 validation
     */
    if (
        IASPoint &&
        IANSPoint &&
        IASPoint.lactate >= IANSPoint.lactate
    ) {
        console.warn('Invalid Keul thresholds');
    }

    return {
        lmin: null,
        IAS: IASPoint?.lactate || null,
        IANS: IANSPoint?.lactate || null,
        lminRow: null,
        IASPoint,
        IANSPoint,
        maxSlope: Number(maxSlope.toFixed(4))
    };
}

function calculateKeul(data) {

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

    const targetSlope = 0.055;

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
function interpolateThreshold(data, target) {

    for (let i = 0; i < data.length - 1; i++) {

        const p1 = data[i];

        const p2 = data[i + 1];

        const l1 = Number(p1.lactate);

        const l2 = Number(p2.lactate);

        // 🔹 target between points
        if (target >= l1 && target <= l2) {

            const ratio = (target - l1) / (l2 - l1);

            const interpolatedLoad = p1.load + ratio * (p2.load - p1.load);

            const hf1 = Number(p1.hf);

            const hf2 = Number(p2.hf);

            const interpolatedHF = hf1 + ratio * (hf2 - hf1);

            return {

                lactate: target,

                load: Number(interpolatedLoad.toFixed(1)),

                hf: Number(interpolatedHF.toFixed(0)),

                stage: `${p1.stage}-${p2.stage}`
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
            const ratio = (targetHF - hf1) / (hf2 - hf1);

            return {
                load: p1.load + ((p2.load - p1.load) * ratio),
                lactate: p1.lactate + ((p2.lactate - p1.lactate) * ratio),
                hf: targetHF,
                stage: p1.stage
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

        const load1 =
            Number(p1.load);

        const load2 =
            Number(p2.load);

        if (
            targetLoad >= load1 &&
            targetLoad <= load2
        ) {

            const ratio =
                (targetLoad - load1) /
                (load2 - load1);

            const lactate1 =
                Number(p1.lactate);

            const lactate2 =
                Number(p2.lactate);

            const hf1 =
                Number(p1.hf);

            const hf2 =
                Number(p2.hf);

            return {

                load:
                    targetLoad,

                lactate:
                    Number(
                        (
                            lactate1 +
                            ratio *
                            (lactate2 - lactate1)
                        ).toFixed(1)
                    ),

                hf:
                    Number(
                        (
                            hf1 +
                            ratio *
                            (hf2 - hf1)
                        ).toFixed(0)
                    )
            };
        }
    }

    return null;
}
function calculateTrainingZones(result) {

    if (!result || !result.IANSPoint) return null;

    const iansLoad = Number(result.IANSPoint.load);

    const regEnd = Number((iansLoad * 0.75).toFixed(1));
    const ga1End = Number((iansLoad * 0.85).toFixed(1));
    const ga2End = Number((iansLoad * 0.95).toFixed(1));
    const e1End = Number((iansLoad * 1.05).toFixed(1));

    return {
        REG: { from: 0, to: regEnd, percentFrom: 0, percentTo: 75, color: '#fff176' },
        GA1: { from: regEnd, to: ga1End, percentFrom: 75, percentTo: 85, color: '#81c784' },
        GA2: { from: ga1End, to: ga2End, percentFrom: 85, percentTo: 95, color: '#64b5f6' },
        E1: { from: ga2End, to: e1End, percentFrom: 95, percentTo: 105, color: '#ef9a9a' },
        E2: { from: e1End, to: Number.MAX_VALUE, percentFrom: 105, percentTo: null, color: '#e57373' }
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
            hf: Number(data[i].hf)
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
            bestResult.line3Points,
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

    calculateLTP

};