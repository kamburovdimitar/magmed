import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('regression', () => {

    test('all models should stay stable', () => {

        const data = [

            { load: 30, lactate: 1.6, hf: 95, stage: '1' },
            { load: 60, lactate: 1.5, hf: 110, stage: '2' },
            { load: 90, lactate: 1.7, hf: 120, stage: '3' },
            { load: 120, lactate: 2.0, hf: 130, stage: '4' },
            { load: 150, lactate: 2.8, hf: 145, stage: '5' },
            { load: 180, lactate: 4.0, hf: 160, stage: '6' },
            { load: 210, lactate: 6.2, hf: 172, stage: '7' }

        ];

        const models = {

            dickhuth: ErgometryModelsUtil.calculateDickhuth(data),
            freiburg: ErgometryModelsUtil.calculateFreiburg(data),
            keul: ErgometryModelsUtil.calculateKeul(data),
            keulLegacy: ErgometryModelsUtil.calculateMaxSlopeMethodKeulLegacy(data),
            ltp: ErgometryModelsUtil.calculateLTP(data)

        };

        expect(models.dickhuth.IANS).toBeCloseTo(3, 0);

        expect(models.freiburg.IANS).toBeCloseTo(3.5, 0);

        expect(models.keul.IANSPoint.load).toBeGreaterThan(120);

        expect(models.keulLegacy.IANSPoint.load).toBeGreaterThan(120);

        expect(models.ltp.IANSPoint.load)
            .toBeGreaterThan(
                models.ltp.IASPoint.load
            );

    });

});