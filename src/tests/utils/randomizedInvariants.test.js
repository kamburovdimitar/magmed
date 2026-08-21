// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-14 (Europe/Sofia) — New test file, added per DK's request for a
// "verify things on a random basis with corner cases" mechanism, since the
// fixed hand-picked datasets in the other test files only ever probe the
// exact shapes their authors thought of. This does two things:
//
//   1. RANDOMIZED sweep — generates many synthetic-but-plausible ergometry
//      datasets (varying stage count, start load, increment, lactate/HF
//      growth curves, bike vs run) using a seeded PRNG (mulberry32, NOT
//      Math.random()) so a failure is always reproducible by re-running with
//      the printed seed, and runs every one of the 6 models
//      (ErgometryUtil.validateAllModels, which already existed and already
//      checks sane invariants like "IAS load > IANS load" per row) plus the
//      Trainingsbereich cascade (calculateTrainingZoneTable/
//      calculateTrainingZones) against it — every run must (a) never throw,
//      (b) never come back with a NaN/Infinity where a number is expected,
//      (c) keep the Trainingsbereich zones monotonically increasing.
//
//   2. CORNER CASES — deliberately adversarial/edge inputs the "normal"
//      random generator above would rarely produce on its own: a single
//      stage, decreasing load, a completely flat lactate curve, negative/
//      zero values, extreme (very large) values, too few stages for a
//      model that needs more (e.g. LTP needs >=6). These must degrade
//      gracefully (return null / a validation error) rather than throw or
//      silently produce garbage.
//
// Neither section pins exact numeric outputs (that's what the other
// calculate*.test.js files with fixed datasets are for) — this file is
// about ROBUSTNESS: does the code survive realistic variety and hostile
// edge cases without crashing or quietly returning nonsense.
// ============================================

import { describe, test, expect } from 'vitest';
import { ErgometryUtil } from '../../utils/ErgometrieUtil';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

// 🔹 mulberry32 — tiny deterministic PRNG. Same seed => same sequence,
// every time, on every machine — that's the whole point (a failing
// randomized run must be reproducible by re-running this file with the
// seed printed in the failure message, not "well it worked when I tried it
// again").
function mulberry32(seed) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function randRange(rng, min, max) {
    return min + rng() * (max - min);
}

// 🔹 generates a synthetic-but-physiologically-plausible dataset: lactate
// starts low/flat, then rises with increasing steepness (a real lactate
// curve), HF rises roughly linearly — but with randomized stage count,
// start load, increment, and noise, so no two runs look the same.
function randomPlausibleDataset(rng, { isRun } = {}) {

    const stages = Math.floor(randRange(rng, 6, 14));
    const startLoad = isRun ? randRange(rng, 4, 10) : randRange(rng, 20, 60);
    const increment = isRun ? randRange(rng, 1, 3) : randRange(rng, 15, 40);

    let lactate = randRange(rng, 0.8, 1.6);
    let hf = randRange(rng, 70, 100);

    const rows = [];

    for (let i = 0; i < stages; i++) {

        const load = Number((startLoad + i * increment).toFixed(1));

        hf += randRange(rng, 4, 12);

        // early dip (real tests often show this), then accelerating rise
        if (i === 1) lactate -= randRange(rng, 0, 0.3);
        if (i >= 2 && i < stages * 0.5) lactate += randRange(rng, 0.05, 0.3);
        if (i >= stages * 0.5 && i < stages * 0.8) lactate += randRange(rng, 0.3, 0.8);
        if (i >= stages * 0.8) lactate += randRange(rng, 0.8, 2.5);

        rows.push({
            stage: i,
            load,
            hf: Math.round(hf),
            lactate: Number(Math.max(0.1, lactate).toFixed(2))
        });
    }

    return rows;
}

function isFiniteNumberOrNull(value) {
    return value == null || (typeof value === 'number' && isFinite(value));
}

describe('randomized sweep — every model, many seeds, never throws / never NaN', () => {

    const SEED_COUNT = 40;

    for (let seedIndex = 0; seedIndex < SEED_COUNT; seedIndex++) {

        const seed = 1000 + seedIndex;

        test(`seed ${seed} (bike)`, () => {

            const rng = mulberry32(seed);
            const rows = randomPlausibleDataset(rng, { isRun: false });

            let results;

            expect(() => {
                results = ErgometryUtil.validateAllModels(rows, 'bike');
            }).not.toThrow();

            for (const { model, result } of results) {

                expect(isFiniteNumberOrNull(result?.IASPoint?.load)).toBe(true);
                expect(isFiniteNumberOrNull(result?.IASPoint?.hf)).toBe(true);
                expect(isFiniteNumberOrNull(result?.IANSPoint?.load)).toBe(true);
                expect(isFiniteNumberOrNull(result?.IANSPoint?.hf)).toBe(true);

                // when both thresholds resolved, IAS must not sit ABOVE
                // IANS — this is exactly the class of bug the pre-existing
                // validateResult() already checks for; asserting it here too
                // across many random seeds is what turns it from "checked
                // when someone remembers to call it" into "checked always".
                if (result?.IASPoint && result?.IANSPoint) {
                    expect(result.IASPoint.load).toBeLessThanOrEqual(result.IANSPoint.load + 0.5);
                }
            }

            // Trainingsbereich cascade — only meaningful once a model
            // actually resolved both thresholds (freiburg is deterministic
            // and cheap to re-derive here for the check)
            const freiburgResult = results.find((r) => r.model === 'freiburg')?.result;

            if (freiburgResult?.IASPoint && freiburgResult?.IANSPoint) {

                const zones = ErgometryModelsUtil.calculateTrainingZones(freiburgResult, rows, 'freiburg', false);

                if (zones) {
                    expect(zones.REG.to).toBeLessThanOrEqual(zones.GA1.to);
                    expect(zones.GA1.to).toBeLessThanOrEqual(zones.GA2.to);
                    expect(zones.GA2.to).toBeLessThanOrEqual(zones.E1.to);
                }
            }

        });

        test(`seed ${seed} (run)`, () => {

            const rng = mulberry32(seed + 500000);
            const rows = randomPlausibleDataset(rng, { isRun: true });

            let results;

            expect(() => {
                results = ErgometryUtil.validateAllModels(rows, 'run');
            }).not.toThrow();

            for (const { result } of results) {
                expect(isFiniteNumberOrNull(result?.IASPoint?.load)).toBe(true);
                expect(isFiniteNumberOrNull(result?.IANSPoint?.load)).toBe(true);
            }

        });

    }

});

describe('corner cases — must degrade gracefully, never throw', () => {

    const models = ['dickhuth', 'freiburg', 'linear', 'ltp', 'keul', 'keul_legacy'];

    function expectNoThrowForAllModels(rows, type = 'bike') {

        expect(() => {
            const results = ErgometryUtil.validateAllModels(rows, type);
            expect(results.length).toBe(models.length);
        }).not.toThrow();
    }

    test('empty dataset', () => {
        expectNoThrowForAllModels([]);
    });

    test('single stage', () => {
        expectNoThrowForAllModels([{ stage: 0, load: 100, hf: 120, lactate: 1.5 }]);
    });

    test('two stages (below the minimum every model needs)', () => {
        expectNoThrowForAllModels([
            { stage: 0, load: 100, hf: 120, lactate: 1.5 },
            { stage: 1, load: 150, hf: 130, lactate: 1.8 }
        ]);
    });

    test('decreasing load throughout (physiologically invalid protocol)', () => {

        const rows = [
            { stage: 0, load: 300, hf: 180, lactate: 5 },
            { stage: 1, load: 250, hf: 170, lactate: 4 },
            { stage: 2, load: 200, hf: 160, lactate: 3 },
            { stage: 3, load: 150, hf: 150, lactate: 2 },
            { stage: 4, load: 100, hf: 140, lactate: 1.5 },
            { stage: 5, load: 50, hf: 130, lactate: 1 }
        ];

        expectNoThrowForAllModels(rows);
        expect(ErgometryUtil.checkLoadPlausibility(rows)).not.toBeNull();

    });

    test('completely flat lactate curve (no threshold to find)', () => {

        const rows = Array.from({ length: 8 }, (_, i) => ({
            stage: i,
            load: 50 + i * 30,
            hf: 100 + i * 8,
            lactate: 1.5
        }));

        expectNoThrowForAllModels(rows);

    });

    test('all-identical everything (zero variance)', () => {

        const rows = Array.from({ length: 8 }, (_, i) => ({
            stage: i,
            load: 100,
            hf: 120,
            lactate: 2.0
        }));

        expectNoThrowForAllModels(rows);

    });

    test('extreme/unrealistic large values do not produce Infinity/NaN leaks', () => {

        const rows = Array.from({ length: 8 }, (_, i) => ({
            stage: i,
            load: 1000 + i * 500,
            hf: 60 + i * 5,
            lactate: 1 + i * 50
        }));

        const results = ErgometryUtil.validateAllModels(rows, 'bike');

        for (const { result } of results) {
            expect(isFiniteNumberOrNull(result?.IASPoint?.load)).toBe(true);
            expect(isFiniteNumberOrNull(result?.IANSPoint?.load)).toBe(true);
        }

    });

    test('non-numeric junk in some cells is ignored, not thrown', () => {

        const rows = [
            { stage: 0, load: 100, hf: 'abc', lactate: 1.2 },
            { stage: 1, load: 150, hf: 130, lactate: 'n/a' },
            { stage: 2, load: 200, hf: 140, lactate: 2.5 },
            { stage: 3, load: 250, hf: 150, lactate: 3.5 },
            { stage: 4, load: 300, hf: 160, lactate: 5.5 },
            { stage: 5, load: 350, hf: 170, lactate: 8.5 }
        ];

        expectNoThrowForAllModels(rows);

    });

    test('null/undefined dataset', () => {

        expect(() => ErgometryUtil.validateAllModels(null, 'bike')).not.toThrow();
        expect(() => ErgometryUtil.validateAllModels(undefined, 'bike')).not.toThrow();

    });

    test('Trainingsbereich cascade never throws on malformed/missing IAS/IANS', () => {

        expect(() => ErgometryModelsUtil.calculateTrainingZoneTable(null, [], 'freiburg', false)).not.toThrow();
        expect(() => ErgometryModelsUtil.calculateTrainingZones({}, [], 'freiburg', false)).not.toThrow();
        expect(ErgometryModelsUtil.calculateTrainingZoneTable(null, [], 'freiburg', false)).toBeNull();
        expect(ErgometryModelsUtil.calculateTrainingZones({}, [], 'freiburg', false)).toBeNull();

    });

});
