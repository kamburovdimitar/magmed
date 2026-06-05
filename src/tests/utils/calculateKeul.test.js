import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('calculateKeul', () => {

    test('should calculate exponential threshold', () => {

        const data = [

            { load: 50, lactate: 1.5, hf: 100, stage: '1' },
            { load: 100, lactate: 1.6, hf: 115, stage: '2' },
            { load: 150, lactate: 2.0, hf: 130, stage: '3' },
            { load: 200, lactate: 3.1, hf: 145, stage: '4' },
            { load: 250, lactate: 5.2, hf: 165, stage: '5' },
            { load: 300, lactate: 8.5, hf: 180, stage: '6' }

        ];

        const result =
            ErgometryModelsUtil
                .calculateKeul(data);

        expect(result).not.toBeNull();

        expect(result.model).toBe('keul');

        expect(result.IANS).toBeGreaterThan(0);

        expect(result.IANSPoint.load).toBeGreaterThan(100);

        expect(result.IASPoint.load)
            .toBeLessThan(
                result.IANSPoint.load
            );

    });

});