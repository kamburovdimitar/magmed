// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-31 (Claude) — DK одобри "Табло за прогреса" (виж мокъп-a,
//   https://claude.ai/code/artifact/f0f5e567-c42b-420f-803d-1d3c103bd76c)
//   и поиска реална версия на "Страница 3", за да я разгледа, преди да
//   решим как да я свържем към останалата навигация. Статусът на всяка
//   от 7-те карти трябва да идва от РЕАЛНИТЕ данни на активния тест — не
//   fake проценти като в HTML мокъпа — затова е изваден в собствен util
//   (не директно в компонента), за да може по-късно да се преизползва и
//   от друго място (напр. хедър-лентата от Вариант А/Б, ако DK избере
//   тя да носи същия статус), без да се дублира логиката.
//
//   Всяко domain-поле връща { percent, status } (status: 'done' |
//   'partial' | 'empty'). "Лактатна ергометрия"/"Спироергометрия"
//   нарочно нямат междинно ('partial') състояние — и двете зависят от
//   СЪЩАТА проверка (има ли поне 1 ред с lactate > 0 в
//   measurement.ergometry.data), точно както вече прави
//   PrintFullReportComponent.tsx (hasLactateData) — единствен източник
//   на истина, не преизчислена отделно тук.
// ============================================

import { MUSCLE_LIST } from '../constants/muskelFunktionKraftPunkte';
import {
    KOPF_SECTIONS,
    WIRBELSAEULE_SECTIONS,
    SCHULTER_SECTIONS,
    BECKEN_SECTIONS,
    KNIE_SECTIONS,
    FUSS_SECTIONS
} from '../constants/koerperHaltungSections';

const MUSKEL_QUALITY_FIELDS = [
    'muskelFunktionKraft',
    'muskelFunktionDehnbarkeit',
    'muskelFunktionBeweglichkeit'
];

const POSTURE_FIELDS = [
    { fieldKey: 'koerperHaltungKopf', sections: KOPF_SECTIONS },
    { fieldKey: 'koerperHaltungWirbelsaeule', sections: WIRBELSAEULE_SECTIONS },
    { fieldKey: 'koerperHaltungSchulter', sections: SCHULTER_SECTIONS },
    { fieldKey: 'koerperHaltungBecken', sections: BECKEN_SECTIONS },
    { fieldKey: 'koerperHaltungKnie', sections: KNIE_SECTIONS },
    { fieldKey: 'koerperHaltungFuss', sections: FUSS_SECTIONS }
];

const TRAINING_FIELDS = [
    'trainingsplanKeinTest',
    'trainingsplanErgometrie',
    'trainingsplanLaktatErgometrie',
    'trainingsplanSpiroErgometrie'
];

function statusFor(percent) {
    if (percent <= 0) return 'empty';
    if (percent >= 100) return 'done';
    return 'partial';
}

function round(n) {
    return Math.round(n);
}

export const TestProgressUtil = {

    computeVitals(measurement) {

        const fields = [
            measurement?.heightcm,
            measurement?.weightkg,
            measurement?.waistcm,
            measurement?.hipcm,
            measurement?.bodyfatpercent,
            measurement?.bloodpressurerestsystolic,
            measurement?.bloodpressuremaxsystolic,
            measurement?.heartraterest,
            measurement?.heartratemax
        ];

        const filled = fields.filter(v => !!v).length;
        const percent = round((filled / fields.length) * 100);

        return { percent, status: statusFor(percent) };

    },

    computeMuskel(measurement) {

        let filled = 0;
        const total = MUSKEL_QUALITY_FIELDS.length * MUSCLE_LIST.length;

        MUSKEL_QUALITY_FIELDS.forEach(field => {

            const value = measurement?.[field] ?? {};

            MUSCLE_LIST.forEach(m => {
                const sides = m.sides ?? ['r', 'l'];
                const entry = value?.[m.key] ?? {};
                const hasAny = sides.some(s => entry[s] != null);
                if (hasAny) filled += 1;
            });

        });

        const percent = round((filled / total) * 100);

        return { percent, status: statusFor(percent) };

    },

    computeHaltung(measurement) {

        let filled = 0;
        let total = 0;

        POSTURE_FIELDS.forEach(category => {

            const value = measurement?.[category.fieldKey] ?? {};

            category.sections.forEach(section => {
                section.rows.forEach(row => {
                    total += 1;
                    if (value[row.key] != null) filled += 1;
                });
            });

        });

        const percent = total > 0 ? round((filled / total) * 100) : 0;

        return { percent, status: statusFor(percent) };

    },

    computeErgometrie(measurement) {

        const isRun = measurement?.ergometry?.type === 'run';
        const hasPerformance = isRun ? !!measurement?.maxspeed : !!measurement?.istLeistungMax;
        const hasHeartRate = !!measurement?.heartraterest && !!measurement?.heartratemax;

        const filled = (hasPerformance ? 1 : 0) + (hasHeartRate ? 1 : 0);
        const percent = round((filled / 2) * 100);

        return { percent, status: statusFor(percent) };

    },

    // 🔹 споделена проверка за Laktat-Ergometrie И Spiro-Ergometrie — виж
    // changelog-а по-горе защо са едно и също условие.
    hasLactateData(measurement) {
        return !!(
            measurement?.ergometry?.data &&
            measurement.ergometry.data.some(r => Number(r.lactate) > 0)
        );
    },

    computeLaktat(measurement) {
        const has = this.hasLactateData(measurement);
        return { percent: has ? 100 : 0, status: has ? 'done' : 'empty' };
    },

    computeSpiro(measurement) {
        const has = this.hasLactateData(measurement);
        return { percent: has ? 100 : 0, status: has ? 'done' : 'empty' };
    },

    computeTraining(measurement) {

        const configured = TRAINING_FIELDS.filter(field => {
            const kt = measurement?.[field] ?? {};
            return Object.keys(kt).length > 0;
        }).length;

        const percent = round((configured / TRAINING_FIELDS.length) * 100);

        return { percent, status: statusFor(percent) };

    },

    // 🔹 обобщение за всичките 7 домейна + overall (X от 7 готови) — точно
    // толкова, колкото трябва на TestProgressDashboardComponent.tsx, без
    // да дублира отделните compute* извиквания на друго място.
    computeAll(measurement) {

        const domains = {
            vitals: this.computeVitals(measurement),
            muskel: this.computeMuskel(measurement),
            haltung: this.computeHaltung(measurement),
            ergometrie: this.computeErgometrie(measurement),
            laktat: this.computeLaktat(measurement),
            spiro: this.computeSpiro(measurement),
            training: this.computeTraining(measurement)
        };

        const keys = Object.keys(domains);
        const doneCount = keys.filter(k => domains[k].status === 'done').length;
        const overallPercent = round((doneCount / keys.length) * 100);

        return { domains, doneCount, totalDomains: keys.length, overallPercent };

    }

};
