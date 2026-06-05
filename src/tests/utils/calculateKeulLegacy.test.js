import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('calculateKeulLegacy', () => {

    test('should detect max slope threshold', () => {

        const data = [

            { load: 50, lactate: 1.4, hf: 100, stage: '1' },
            { load: 100, lactate: 1.6, hf: 115, stage: '2' },
            { load: 150, lactate: 2.0, hf: 130, stage: '3' },
            { load: 200, lactate: 3.5, hf: 150, stage: '4' },
            { load: 250, lactate: 6.5, hf: 170, stage: '5' },
            { load: 300, lactate: 10.0, hf: 185, stage: '6' }

        ];

        const result =
            ErgometryModelsUtil
                .calculateMaxSlopeMethodKeulLegacy(data);

        expect(result).not.toBeNull();

        expect(result.maxSlope)
            .toBeGreaterThan(0);

        expect(result.IANSPoint)
            .not
            .toBeNull();

        expect(result.IASPoint)
            .not
            .toBeNull();

        expect(result.IASPoint.load)
            .toBeLessThan(
                result.IANSPoint.load
            );

    });

});