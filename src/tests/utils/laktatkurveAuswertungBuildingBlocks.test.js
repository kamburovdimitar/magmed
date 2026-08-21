// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-18 (Europe/Sofia) — Регресионни тестове за util-функциите зад
// LaktatkurveAuswertungComponent.tsx ("3.32 CCC Laktat Datenerfassung und
// Auswertung"). Не преоткриват логика — само проверяват как компонентът
// реално ги композира: AUSWERTUNG таблицата (calculateTrainingZoneTable),
// % Pmax спрямо РЕАЛНИЯ max load (не calculateChartMaxLoad's +2 chart
// padding — виж коментара в компонента защо това разграничение има
// значение), Watt/kg (calculateWattPerKg), и graceful null-handling преди
// Save/Generate.
// ============================================

import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('LaktatkurveAuswertungComponent building blocks', () => {

    test('table + max row + wattPerKg + stage percents compute without throwing', () => {

        const data = [
            { stage: 0, load: 30, hf: 100, lactate: 1.8 },
            { stage: 1, load: 60, hf: 108, lactate: 1.5 },
            { stage: 2, load: 90, hf: 117, lactate: 1.4 },
            { stage: 3, load: 120, hf: 125, lactate: 1.6 },
            { stage: 4, load: 150, hf: 133, lactate: 1.9 },
            { stage: 5, load: 180, hf: 139, lactate: 2.7 },
            { stage: 6, load: 210, hf: 146, lactate: 3.2 },
            { stage: 7, load: 240, hf: 152, lactate: 4.4 },
            { stage: 8, load: 270, hf: 159, lactate: 5.7 },
            { stage: 9, load: 300, hf: 167, lactate: 7.5 }
        ];

        const result = ErgometryModelsUtil.calculateFreiburg(data);
        expect(result?.IASPoint).toBeTruthy();
        expect(result?.IANSPoint).toBeTruthy();

        const table = ErgometryModelsUtil.calculateTrainingZoneTable(result, data, 'freiburg', false, null);
        expect(table).toBeTruthy();
        expect(table.rows.length).toBeGreaterThan(0);

        // 🔹 the component uses the last normalized row's raw load (NOT
        // calculateChartMaxLoad's +2 chart-axis padding) for % Pmax —
        // verify the distinction explicitly so a future "simplification"
        // doesn't silently swap one for the other.
        const chartPaddedMaxLoad = ErgometryModelsUtil.calculateChartMaxLoad(data);
        expect(chartPaddedMaxLoad).toBe(302);
        const rawMaxLoad = 300;

        const wattPerKg = ErgometryModelsUtil.calculateWattPerKg(300, 70);
        expect(wattPerKg).toBeCloseTo(4.29, 2);
        expect(ErgometryModelsUtil.calculateWattPerKg(300, null)).toBeNull();

        expect(ErgometryModelsUtil.calculateHFPercent(150, 190)).toBeTruthy();

        expect(ErgometryModelsUtil.calculatePmaxPercent(210, rawMaxLoad)).toBeTruthy();
        expect(ErgometryModelsUtil.calculatePmaxPercent(rawMaxLoad, rawMaxLoad)).toBeCloseTo(100, 0);

        expect(ErgometryModelsUtil.calculateHRRPercent(150, 60, 190)).toBeTruthy();

        const normalized = ErgometryModelsUtil.normalizeChartData(data);
        expect(normalized.length).toBe(10);
        expect(normalized[normalized.length - 1].load).toBe(300);

        // run-mode pace formatting shouldn't throw either
        expect(() => ErgometryModelsUtil.formatPace(20)).not.toThrow();
    });

    test('gracefully handles null/empty inputs (no result yet, no weight)', () => {

        const data = [
            { stage: 0, load: 30, hf: 100, lactate: 1.8 }
        ];

        expect(ErgometryModelsUtil.calculateTrainingZoneTable(null, data, 'freiburg', false, null)).toBeNull();

        expect(ErgometryModelsUtil.calculateWattPerKg(100, 0)).toBeNull();
        expect(ErgometryModelsUtil.calculateWattPerKg(100, null)).toBeNull();

        expect(ErgometryModelsUtil.normalizeChartData([])).toEqual([]);
        expect(ErgometryModelsUtil.normalizeChartData(null)).toEqual([]);
    });

    // 🔹 Регресионен тест за бъга, открит от screenshot на DK: в run-режим
    // DIALOG секцията винаги показваше "—" за min/km, защото selectedRow
    // идва от normalizeChartData() (редове {load,lactate,hf,stage}, БЕЗ
    // .pace поле), а thirdColValue() четеше само row.pace. Проверяваме
    // директно допускането зад фикса — normalizeChartData не носи .pace,
    // и formatPace(row.load) работи като fallback, без да хвърля грешка.
    test('normalizeChartData rows have no .pace field, but formatPace(row.load) works as a fallback (run-mode dialog fix)', () => {

        const data = [
            { stage: 0, load: 8, hf: 100, lactate: 1.8 },
            { stage: 1, load: 10, hf: 120, lactate: 2.5 }
        ];

        const normalized = ErgometryModelsUtil.normalizeChartData(data);
        expect(normalized.length).toBe(2);

        normalized.forEach((row) => {
            expect(row.pace).toBeUndefined();
            expect(() => ErgometryModelsUtil.formatPace(row.load)).not.toThrow();
            expect(ErgometryModelsUtil.formatPace(row.load)).toBeTruthy();
        });
    });

});
