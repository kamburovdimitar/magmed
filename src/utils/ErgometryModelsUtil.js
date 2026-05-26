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

    let lmin = 999;

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

    let lmin = 999;

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

        const targetLoad = IANSPoint.load * 0.75;

        IASPoint = {

            lactate: null,

            load: Number(targetLoad.toFixed(1)),

            hf: Number((IANSPoint.hf * 0.75).toFixed(0)),

            stage: 'derived'
        };

        IAS = Number((IANS * 0.75).toFixed(2));
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

        const load =
            Number(data[i].load);

        if (
            !isNaN(load) &&
            load > max
        ) {
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

                stage: data[i].stage
            };

            IASIndex = i;

            break;
        }
    }

    // 🔹 IANS ONLY AFTER IAS
    if (IASIndex !== -1) {

        for (
            let i = IASIndex;
            i < data.length - 1;
            i++
        ) {

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

            // 🔹 strong rise
            if (
                slope2 >
                slope1 * 1.5
            ) {

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

    return {

        IAS:
            IASPoint?.lactate || null,

        IANS:
            IANSPoint?.lactate || null,

        IASPoint,
        IANSPoint
    };
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
function calculateKeul(data) {

    if (!data || data.length < 2) {

        return null;
    }

    /**
     * 🔹 interpolate point by load
     */
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

            // 🔹 target between loads
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

                    lactate: Number(
                        (
                            lactate1 +
                            ratio *
                            (
                                lactate2 -
                                lactate1
                            )
                        ).toFixed(1)
                    ),

                    load: Number(
                        targetLoad.toFixed(1)
                    ),

                    hf: Number(
                        (
                            hf1 +
                            ratio *
                            (
                                hf2 -
                                hf1
                            )
                        ).toFixed(0)
                    ),

                    stage:
                        `${p1.stage}-${p2.stage}`
                };
            }
        }

        return null;
    }

    let maxSlope = 0;

    let IANSPoint = null;

    /**
     * 🔹 find maximum slope
     */
    for (let i = 0; i < data.length - 1; i++) {

        const p1 = data[i];

        const p2 = data[i + 1];

        const lactate1 =
            Number(p1.lactate);

        const lactate2 =
            Number(p2.lactate);

        const load1 =
            Number(p1.load);

        const load2 =
            Number(p2.load);

        const loadDiff =
            load2 - load1;

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
            (lactate2 - lactate1) /
            loadDiff;

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

        const derivedLoad =
            Number(
                (
                    IANSPoint.load * 0.75
                ).toFixed(1)
            );

        IASPoint =
            interpolateByLoad(
                data,
                derivedLoad
            );
    }

    /**
     * 🔹 validation
     */
    if (
        IASPoint &&
        IANSPoint &&
        IASPoint.lactate >=
        IANSPoint.lactate
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
            Number(
                maxSlope.toFixed(4)
            )
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


export const ErgometryModelsUtil = {

    calculateDickhuth,
    calculateLinear,
    calculateFreiburg,
    calculateKeul,
    calculateHFPercent,
    calculatePmaxPercent,
    calculateHRRPercent,
    generateInterpretation,
    calculateChartMaxLoad,
    calculateChartMaxLactate
};