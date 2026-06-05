import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('calculateDickhuth', () => {

    test('should calculate thresholds from lmin', () => {

        const data = [

            { load: 50, lactate: 2.4, hf: 100, stage: '1' },
            { load: 100, lactate: 1.5, hf: 120, stage: '2' },
            { load: 150, lactate: 2.0, hf: 140, stage: '3' },
            { load: 200, lactate: 3.0, hf: 160, stage: '4' },
            { load: 250, lactate: 4.5, hf: 180, stage: '5' }

        ];

        const result =
            ErgometryModelsUtil
                .calculateDickhuth(data);

        expect(result.lmin).toBe(1.5);

        expect(result.IAS).toBe(2);

        expect(result.IANS).toBe(3);

        expect(
            Math.round(
                result.IASPoint.load
            )
        ).toBe(150);

        expect(
            Math.round(
                result.IANSPoint.load
            )
        ).toBe(200);

    });

});