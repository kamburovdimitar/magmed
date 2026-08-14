// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-14 (Europe/Sofia) — Trainingsbereich UI pass: calculateTrainingZones()
// used to derive its boundaries by multiplying the IANS *load* by a fixed
// percentage — exactly the "einfache prozentuale Multiplikation" the CCC
// spec ("3.34 Laktatkurve und Trainingsbereich") explicitly forbids, and it
// could disagree with calculateTrainingZoneTable()'s HF-cascade method on
// the same test. Fixed to share the same HF-cascade boundaries (see
// computeZoneHFBoundaries in ErgometryModelsUtil.js) — this changes the
// function's signature (now needs the measured ergometry rows + model, not
// just IANSPoint.load), so the old single-arg test no longer applies and is
// replaced here with cascade-aware coverage, plus coverage for the new
// customPercents override (editable/draggable Trainingsbereich table).
// ============================================

import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('calculateTrainingZones', () => {

    const data = [
        { stage: 1, load: 100, hf: 120, lactate: 1.0 },
        { stage: 2, load: 150, hf: 140, lactate: 1.5 },
        { stage: 3, load: 200, hf: 160, lactate: 2.5 },
        { stage: 4, load: 225, hf: 170, lactate: 3.5 },
        { stage: 5, load: 250, hf: 180, lactate: 5.5 },
        { stage: 6, load: 275, hf: 190, lactate: 8.5 }
    ];

    const result = {
        model: 'freiburg',
        IASPoint: { hf: 160, load: 200, lactate: 2.5 },
        IANSPoint: { hf: 180, load: 250, lactate: 5.5 }
    };

    test('calculates 5 zones via the HF cascade (not simple %-of-load) and stays monotonically increasing', () => {

        const zones = ErgometryModelsUtil.calculateTrainingZones(result, data, 'freiburg', false);

        expect(zones.REG.percentTo).toBe(75);
        expect(zones.GA1.percentFrom).toBe(75);
        expect(zones.GA1.percentTo).toBe(85);
        expect(zones.GA2.percentFrom).toBe(85);
        expect(zones.GA2.percentTo).toBe(95);
        expect(zones.E1.percentFrom).toBe(95);
        expect(zones.E1.percentTo).toBe(105);
        expect(zones.E2.percentFrom).toBe(105);

        // Each zone must start exactly where the previous one ended and the
        // boundaries must strictly increase — this is exactly the ordering
        // bug the old %-of-load shortcut could produce whenever the
        // measured IAS point sat above 75%-of-IANS-HF.
        expect(zones.REG.from).toBe(0);
        expect(zones.GA1.from).toBe(zones.REG.to);
        expect(zones.GA2.from).toBe(zones.GA1.to);
        expect(zones.E1.from).toBe(zones.GA2.to);
        expect(zones.E2.from).toBe(zones.E1.to);

        expect(zones.REG.to).toBeLessThan(zones.GA1.to);
        expect(zones.GA1.to).toBeLessThan(zones.GA2.to);
        expect(zones.GA2.to).toBeLessThan(zones.E1.to);

    });

    test('"point"-anchored models (Dickhuth/Linear/LTP/Keul Legacy) anchor REG/IAS to the measured IAS point instead of 75%-of-IANS-HF', () => {

        const zones = ErgometryModelsUtil.calculateTrainingZones(result, data, 'dickhuth', false);

        // measured IAS load (200) is used directly as the REG→GA1 boundary,
        // not the theoretical 75%-of-IANS-HF value (~138) that "percent"
        // models get for the same input.
        expect(zones.REG.to).toBe(200);

    });

    test('supports custom zone-boundary percent overrides (editable table cell / dragged chart boundary)', () => {

        const defaultZones = ErgometryModelsUtil.calculateTrainingZones(result, data, 'freiburg', false);
        const customZones = ErgometryModelsUtil.calculateTrainingZones(result, data, 'freiburg', false, { GA1: 80 });

        expect(customZones.GA1.percentTo).toBe(80);
        expect(customZones.GA1.to).not.toBe(defaultZones.GA1.to);
        expect(customZones.GA1.to).toBeLessThan(defaultZones.GA1.to);

    });

    test('returns null without a full IAS/IANS result or ergometry data', () => {

        expect(ErgometryModelsUtil.calculateTrainingZones({ IANSPoint: { load: 300 } }, data, 'freiburg', false)).toBeNull();
        expect(ErgometryModelsUtil.calculateTrainingZones(result, null, 'freiburg', false)).toBeNull();

    });

});

describe('calculateTrainingZoneTable', () => {

    const data = [
        { stage: 1, load: 100, hf: 120, lactate: 1.0 },
        { stage: 2, load: 150, hf: 140, lactate: 1.5 },
        { stage: 3, load: 200, hf: 160, lactate: 2.5 },
        { stage: 4, load: 225, hf: 170, lactate: 3.5 },
        { stage: 5, load: 250, hf: 180, lactate: 5.5 },
        { stage: 6, load: 275, hf: 190, lactate: 8.5 }
    ];

    const result = {
        model: 'freiburg',
        IASPoint: { hf: 160, load: 200, lactate: 2.5 },
        IANSPoint: { hf: 180, load: 250, lactate: 5.5 }
    };

    test('returns 7 rows (REG/IAS/GA1/GA2/IANS/E1/E2) matching the spec\'s Trainingsbereich table', () => {

        const table = ErgometryModelsUtil.calculateTrainingZoneTable(result, data, 'freiburg', false);

        expect(table.rows.map(r => r.key)).toEqual(['REG', 'IAS', 'GA1', 'GA2', 'IANS', 'E1', 'E2']);
        expect(table.rows.find(r => r.key === 'IANS').hf).toBe(180);
        expect(table.rows.find(r => r.key === 'IANS').load).toBe(250);

    });

    test('ignores an incomplete in-progress last row (empty hf/lactate) instead of interpolating a bogus 0', () => {

        const dirtyData = [...data, { stage: 7, load: 300, hf: '', lactate: '' }];

        const table = ErgometryModelsUtil.calculateTrainingZoneTable(result, dirtyData, 'freiburg', false);

        expect(table.rows.length).toBe(7);

    });

    test('custom percent overrides change only the targeted row', () => {

        const table = ErgometryModelsUtil.calculateTrainingZoneTable(result, data, 'freiburg', false, { GA1: 80 });

        expect(table.rows.find(r => r.key === 'GA1').percent).toBe(80);
        expect(table.rows.find(r => r.key === 'GA2').percent).toBe(95);

    });

});
