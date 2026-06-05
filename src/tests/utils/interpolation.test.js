import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('interpolation', () => {

    const data = [

        { load: 100, lactate: 2, hf: 120, stage: '1' },
        { load: 200, lactate: 4, hf: 160, stage: '2' }

    ];

    test('interpolateThreshold', () => {

        const result =
            ErgometryModelsUtil
                .interpolateThreshold(
                    data,
                    3
                );

        expect(result.lactate)
            .toBe(3);

        expect(result.load)
            .toBe(150);

        expect(result.hf)
            .toBe(140);

    });

    test('interpolateByHF', () => {

        const result =
            ErgometryModelsUtil
                .interpolateByHF(
                    data,
                    140
                );

        expect(
            Math.round(
                result.load
            )
        )
        .toBe(150);

    });

    test('interpolateByLoad', () => {

        const result =
            ErgometryModelsUtil
                .interpolateByLoad(
                    data,
                    150
                );

        expect(
            Math.round(
                result.lactate
            )
        )
        .toBe(3);

        expect(
            result.hf
        )
        .toBe(140);

    });

});