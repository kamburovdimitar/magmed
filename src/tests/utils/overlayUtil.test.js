// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-17 (Europe/Sofia) — Тестове за OverlayUtil.js, стъпка 1 от плана
// за "3.36 CCC Laktatkurve überlagern". Покрива хронологично сортиране,
// цвят по позиция, нормализация към %IANS, и главната buildOverlaySeries().
// ============================================

import { describe, test, expect } from 'vitest';
import { OverlayUtil } from '../../utils/OverlayUtil';

function makeReport(id, createdAt, { iansLoad = 200, rows = null, model = null } = {}) {
    return {
        id,
        createdAt,
        ergometry: {
            model,
            data: rows ?? [
                { stage: 1, load: 100, hf: 120, lactate: 1.0 },
                { stage: 2, load: 150, hf: 140, lactate: 1.5 },
                { stage: 3, load: 200, hf: 160, lactate: 2.5 },
                { stage: 4, load: 250, hf: 180, lactate: 5.5 }
            ]
        },
        result: {
            IASPoint: { load: 137.5, hf: 135, lactate: 2.0 },
            IANSPoint: { load: iansLoad, hf: 180, lactate: 5.5 }
        }
    };
}

describe('sortReportsChronologically', () => {

    test('sorts ascending (oldest first) by default', () => {

        const reports = [
            makeReport('b', '2022-01-01'),
            makeReport('a', '2020-01-01'),
            makeReport('c', '2024-01-01')
        ];

        const sorted = OverlayUtil.sortReportsChronologically(reports);

        expect(sorted.map((r) => r.id)).toEqual(['a', 'b', 'c']);

    });

    test('sorts descending (newest first) when asked', () => {

        const reports = [
            makeReport('b', '2022-01-01'),
            makeReport('a', '2020-01-01'),
            makeReport('c', '2024-01-01')
        ];

        const sorted = OverlayUtil.sortReportsChronologically(reports, 'desc');

        expect(sorted.map((r) => r.id)).toEqual(['c', 'b', 'a']);

    });

    test('does not mutate the input array', () => {

        const reports = [makeReport('b', '2022-01-01'), makeReport('a', '2020-01-01')];
        const copy = [...reports];

        OverlayUtil.sortReportsChronologically(reports);

        expect(reports).toEqual(copy);

    });

    test('handles empty/undefined input without throwing', () => {

        expect(OverlayUtil.sortReportsChronologically([])).toEqual([]);
        expect(OverlayUtil.sortReportsChronologically(undefined)).toEqual([]);

    });

    test('treats an unparsable createdAt as timestamp 0 (sorts first) instead of throwing', () => {

        const reports = [
            makeReport('valid', '2022-01-01'),
            makeReport('garbage', 'not-a-date')
        ];

        const sorted = OverlayUtil.sortReportsChronologically(reports);

        expect(sorted.map((r) => r.id)).toEqual(['garbage', 'valid']);

    });

});

describe('getOverlayColorByIndex', () => {

    test('returns a stable color per index', () => {

        expect(OverlayUtil.getOverlayColorByIndex(0)).toBe(OverlayUtil.getOverlayColorByIndex(0));
        expect(OverlayUtil.getOverlayColorByIndex(0)).not.toBe(OverlayUtil.getOverlayColorByIndex(1));

    });

    test('cycles the palette instead of throwing when index exceeds palette length', () => {

        const paletteLength = 6; // OVERLAY_COLOR_PALETTE.length, kept in sync manually here
        expect(OverlayUtil.getOverlayColorByIndex(paletteLength)).toBe(OverlayUtil.getOverlayColorByIndex(0));

    });

    test('falls back to the first color for negative/null index', () => {

        expect(OverlayUtil.getOverlayColorByIndex(-1)).toBe(OverlayUtil.getOverlayColorByIndex(0));
        expect(OverlayUtil.getOverlayColorByIndex(null)).toBe(OverlayUtil.getOverlayColorByIndex(0));

    });

});

describe('normalizeRowsToPercentIANS', () => {

    test('converts load to % of the given IANS load, IANS itself = 100%', () => {

        const rows = [
            { stage: 1, load: 100, hf: 120, lactate: 1.0 },
            { stage: 2, load: 200, hf: 160, lactate: 2.5 }
        ];

        const normalized = OverlayUtil.normalizeRowsToPercentIANS(rows, 200);

        expect(normalized[0].percentIANS).toBe(50);
        expect(normalized[1].percentIANS).toBe(100);

    });

    test('preserves the original fields alongside the new percentIANS field', () => {

        const rows = [{ stage: 1, load: 100, hf: 120, lactate: 1.0 }];
        const normalized = OverlayUtil.normalizeRowsToPercentIANS(rows, 200);

        expect(normalized[0]).toMatchObject({ stage: 1, load: 100, hf: 120, lactate: 1.0 });

    });

    test('returns null when iansLoad is missing, zero, or negative — cannot build a % scale without it', () => {

        const rows = [{ stage: 1, load: 100, hf: 120, lactate: 1.0 }];

        expect(OverlayUtil.normalizeRowsToPercentIANS(rows, null)).toBeNull();
        expect(OverlayUtil.normalizeRowsToPercentIANS(rows, 0)).toBeNull();
        expect(OverlayUtil.normalizeRowsToPercentIANS(rows, -50)).toBeNull();

    });

    test('returns null for empty/undefined rows instead of throwing', () => {

        expect(OverlayUtil.normalizeRowsToPercentIANS([], 200)).toBeNull();
        expect(OverlayUtil.normalizeRowsToPercentIANS(undefined, 200)).toBeNull();

    });

});

describe('buildOverlaySeries', () => {

    test('absolute mode: keeps raw load as xField, one series per report, colored by chronological order', () => {

        const reports = [
            makeReport('newer', '2024-01-01'),
            makeReport('older', '2020-01-01')
        ];

        const series = OverlayUtil.buildOverlaySeries(reports, { mode: 'absolute' });

        expect(series.length).toBe(2);
        // chronological: older first
        expect(series[0].id).toBe('older');
        expect(series[1].id).toBe('newer');
        expect(series[0].xField).toBe('load');
        expect(series[0].color).not.toBe(series[1].color);

    });

    test('normiert mode: xField becomes percentIANS and rows carry the normalized field', () => {

        const reports = [makeReport('a', '2020-01-01', { iansLoad: 250 })];

        const series = OverlayUtil.buildOverlaySeries(reports, { mode: 'normiert' });

        expect(series[0].xField).toBe('percentIANS');
        expect(series[0].rows.every((r) => typeof r.percentIANS === 'number')).toBe(true);

    });

    test('normiert mode silently skips a report with no resolvable IANS (cannot build its % scale)', () => {

        const goodReport = makeReport('good', '2020-01-01');
        const badReport = makeReport('bad', '2021-01-01');
        badReport.result.IANSPoint = null;

        const series = OverlayUtil.buildOverlaySeries([goodReport, badReport], { mode: 'normiert' });

        expect(series.length).toBe(1);
        expect(series[0].id).toBe('good');

    });

    test('absolute mode keeps a report even without IANS (raw Watt/km-h always valid)', () => {

        const report = makeReport('no-ians', '2020-01-01');
        report.result.IANSPoint = null;

        const series = OverlayUtil.buildOverlaySeries([report], { mode: 'absolute' });

        expect(series.length).toBe(1);
        expect(series[0].IANSPoint).toBeNull();

    });

    // 🔹 2026-08-18 — Trainingszonen ein/aus (стъпка 3, "3.36 CCC
    // überlagern") се нуждае от кой Rechenverfahren модел е ползван за
    // ВСЕКИ archived report поотделно (може да се различава от текущо
    // отворения на "Aktuell"), за да пресметне зоните му правилно —
    // проверяваме, че полето реално стига до series изхода.
    test('carries the report\'s own ergometry model through to the series entry (needed for per-report zone calc)', () => {

        const reports = [makeReport('freiburg-test', '2020-01-01', { model: 'freiburg' })];

        const series = OverlayUtil.buildOverlaySeries(reports, { mode: 'absolute' });

        expect(series[0].model).toBe('freiburg');

    });

    test('missing ergometry.model resolves to null, not undefined/throw', () => {

        const reports = [makeReport('no-model', '2020-01-01')];

        expect(() => OverlayUtil.buildOverlaySeries(reports)).not.toThrow();

        const series = OverlayUtil.buildOverlaySeries(reports);

        expect(series[0].model).toBeNull();

    });

    test('marks the active report via activeReportId', () => {

        const reports = [makeReport('a', '2020-01-01'), makeReport('b', '2021-01-01')];

        const series = OverlayUtil.buildOverlaySeries(reports, { activeReportId: 'b' });

        expect(series.find((s) => s.id === 'a').isActive).toBe(false);
        expect(series.find((s) => s.id === 'b').isActive).toBe(true);

    });

    test('reports with no ergometry rows at all are skipped, not thrown', () => {

        const emptyReport = makeReport('empty', '2020-01-01', { rows: [] });
        const goodReport = makeReport('good', '2021-01-01');

        expect(() => OverlayUtil.buildOverlaySeries([emptyReport, goodReport])).not.toThrow();

        const series = OverlayUtil.buildOverlaySeries([emptyReport, goodReport]);
        expect(series.length).toBe(1);
        expect(series[0].id).toBe('good');

    });

    test('empty/undefined reports list returns an empty array, never throws', () => {

        expect(OverlayUtil.buildOverlaySeries([])).toEqual([]);
        expect(OverlayUtil.buildOverlaySeries(undefined)).toEqual([]);

    });

});
