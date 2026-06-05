import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('edge cases', () => {

    test('should return null for empty input', () => {

        expect(
            ErgometryModelsUtil
                .calculateKeul([])
        ).toBeNull();

        expect(
            ErgometryModelsUtil
                .calculateFreiburg([])
        ).toBeNull();

        expect(
            ErgometryModelsUtil
                .calculateDickhuth([])
        ).toBeNull();

        expect(
            ErgometryModelsUtil
                .calculateLTP([])
        ).toBeNull();

    });

    test('should handle one point', () => {

        const data = [
            {
                load: 100,
                lactate: 2,
                hf: 120
            }
        ];

        expect(
            ErgometryModelsUtil
                .calculateKeul(data)
        ).toBeNull();

        expect(
            ErgometryModelsUtil
                .calculateLTP(data)
        ).toBeNull();

    });

    test('should ignore invalid values', () => {

        const data = [

            {
                load: 100,
                lactate: 'abc',
                hf: 120
            },

            {
                load: 150,
                lactate: 2,
                hf: 130
            }

        ];

        expect(() =>
            ErgometryModelsUtil
                .calculateKeul(data)
        ).not.toThrow();

    });

});