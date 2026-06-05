import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('all models integration', () => {

    test('all models should return valid thresholds', () => {

        const data = [

            { load: 50, lactate: 1.5, hf: 100, stage: '1' },
            { load: 100, lactate: 1.7, hf: 115, stage: '2' },
            { load: 150, lactate: 2.0, hf: 130, stage: '3' },
            { load: 200, lactate: 3.0, hf: 145, stage: '4' },
            { load: 250, lactate: 5.0, hf: 165, stage: '5' },
            { load: 300, lactate: 8.0, hf: 180, stage: '6' }

        ];

        const models = [

            ErgometryModelsUtil.calculateDickhuth,
            ErgometryModelsUtil.calculateFreiburg,
            ErgometryModelsUtil.calculateKeul,
            ErgometryModelsUtil.calculateMaxSlopeMethodKeulLegacy,
            ErgometryModelsUtil.calculateLTP

        ];

        for (let i = 0; i < models.length; i++) {

            const result =
                models[i](data);

            expect(result)
                .not
                .toBeNull();

            expect(result.IANSPoint)
                .not
                .toBeNull();

            if (result.IASPoint && result.IANSPoint) {

                expect(
                    result.IASPoint.load
                )
                .toBeLessThanOrEqual(
                    result.IANSPoint.load
                );

            }

        }

    });

});