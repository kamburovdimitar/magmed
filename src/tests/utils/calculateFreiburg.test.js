import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('calculateFreiburg', () => {

    test('should calculate IAS and IANS', () => {

        const data = [

            { load: 50, lactate: 2.0, hf: 100, stage: '1' },
            { load: 100, lactate: 1.5, hf: 120, stage: '2' },
            { load: 150, lactate: 2.3, hf: 140, stage: '3' },
            { load: 200, lactate: 3.4, hf: 160, stage: '4' },
            { load: 250, lactate: 5.0, hf: 180, stage: '5' }

        ];

        const result =
            ErgometryModelsUtil
                .calculateFreiburg(data);

        expect(result.lmin).toBe(1.5);

        expect(result.IANS).toBe(3.5);

        expect(
            Math.round(
                result.IANSPoint.load
            )
        ).toBe(203);

       expect(
    result.IASPoint.hf
).toBeGreaterThanOrEqual(
    120
);

expect(
    result.IASPoint.hf
).toBeLessThanOrEqual(
    122
);

    });

});