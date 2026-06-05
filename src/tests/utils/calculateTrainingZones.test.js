import { describe, test, expect } from 'vitest';
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil';

describe('calculateTrainingZones', () => {

    test('should calculate 5 zones for IANS 300', () => {

        const zones = ErgometryModelsUtil.calculateTrainingZones({ IANSPoint: { load: 300 } });

        expect(zones.REG).toEqual({
            from: 0,
            to: 225,
            percentFrom: 0,
            percentTo: 75,
            color: '#fff176'
        });

        expect(zones.GA1.from).toBe(225);
        expect(zones.GA1.to).toBe(255);

        expect(zones.GA2.from).toBe(255);
        expect(zones.GA2.to).toBe(285);

        expect(zones.E1.from).toBe(285);
        expect(zones.E1.to).toBe(297);

        expect(zones.E2.from).toBe(297);
        expect(zones.E2.to).toBe(300);

    });

});