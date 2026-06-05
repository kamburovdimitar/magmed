import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('save pipeline', () => {

    test('should enrich result after calculation', () => {

        const rows = [
            { load: 30, lactate: 1.6, hf: 100 },
            { load: 60, lactate: 1.8, hf: 110 },
            { load: 90, lactate: 2.1, hf: 120 },
            { load: 120, lactate: 3.0, hf: 140 },
            { load: 150, lactate: 5.0, hf: 160 }
        ];

        const result = ErgometryModelsUtil.calculateKeul(rows);

        const hfMax = 190;
        const hfRest = 60;
        const maxLoad = rows[rows.length - 1].load;

        if (result?.IASPoint) {

            result.IASPoint.hfPercent = ErgometryModelsUtil.calculateHFPercent(result.IASPoint.hf, hfMax);

            result.IASPoint.pmaxPercent = ErgometryModelsUtil.calculatePmaxPercent(result.IASPoint.load, maxLoad);

            result.IASPoint.hrrPercent = ErgometryModelsUtil.calculateHRRPercent(result.IASPoint.hf, hfRest, hfMax);

        }

        expect(result).toBeTruthy();

        expect(result.IASPoint.hfPercent).toBeGreaterThan(0);

        expect(result.IASPoint.pmaxPercent).toBeGreaterThan(0);

        expect(result.IASPoint.hrrPercent).toBeGreaterThan(0);

    });

});