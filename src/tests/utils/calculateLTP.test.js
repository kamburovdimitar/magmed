import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('calculateLTP', () => {

    test('should detect two turn points', () => {

        const data = [

            { load: 50, lactate: 1.4, hf: 100 },
            { load: 100, lactate: 1.5, hf: 110 },
            { load: 150, lactate: 1.7, hf: 120 },

            { load: 200, lactate: 2.4, hf: 135 },
            { load: 250, lactate: 4.2, hf: 150 },

            { load: 300, lactate: 7.8, hf: 170 },
            { load: 350, lactate: 11.5, hf: 185 }

        ];

        const result =
            ErgometryModelsUtil
                .calculateLTP(data);

        expect(result).not.toBeNull();

        expect(result.model)
            .toBe('ltp');

        expect(result.IASPoint)
            .not
            .toBeNull();

        expect(result.IANSPoint)
            .not
            .toBeNull();

        expect(result.IASPoint.load)
            .toBeLessThan(
                result.IANSPoint.load
            );

        expect(result.totalError)
            .toBeGreaterThanOrEqual(
                0
            );

        expect(result.line1Points.length)
            .toBeGreaterThan(
                0
            );

        expect(result.line2Points.length)
            .toBeGreaterThan(
                0
            );

        expect(result.line3Points.length)
            .toBeGreaterThan(
                0
            );

    });

});