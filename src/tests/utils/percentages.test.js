import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('percent calculations', () => {

    test('HF percent', () => {

        expect(
            ErgometryModelsUtil
                .calculateHFPercent(
                    150,
                    200
                )
        )
        .toBe(75);

    });

    test('Pmax percent', () => {

        expect(
            ErgometryModelsUtil
                .calculatePmaxPercent(
                    150,
                    300
                )
        )
        .toBe(50);

    });

    test('HRR percent', () => {

        expect(
            ErgometryModelsUtil
                .calculateHRRPercent(
                    150,
                    50,
                    200
                )
        )
        .toBeCloseTo(
            66.7,
            0
        );

    });

});