import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('chart helpers', () => {

    test('calculateChartMaxLactate', () => {

        const data = [

            { lactate: 2 },

            { lactate: 6 },

            { lactate: 8 }

        ];

        expect(
            ErgometryModelsUtil
                .calculateChartMaxLactate(
                    data
                )
        )
        .toBeGreaterThanOrEqual(
            8
        );

    });

    test('calculateChartMaxLoad', () => {

        const data = [

            { load: 30 },

            { load: 150 },

            { load: 300 }

        ];

        expect(
    ErgometryModelsUtil
        .calculateChartMaxLoad(
            data
        )
)
.toBe(302);

    });

    test('generateInterpretation', () => {

        const result = {

            IANSPoint: {
                load: 250
            }

        };

        const text =
            ErgometryModelsUtil
                .generateInterpretation(
                    result
                );

        expect(
            text
        )
        .toBeTruthy();

    });

});