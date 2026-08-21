// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-20 — DK: "тези неща, които са от плана в тази страница ... и
//   които не са имплементирани" -> KOPF/SCHULTER/BECKEN/KNIE/FUSS под
//   Körper-Haltung бяха placeholder ("Not implemented yet.") — само
//   WIRBELSÄULE имаше реална таблица (виж BeuterlungTable.tsx,
//   KoerperHaltungComponent.tsx).
//
//   Термините тук са стандартни физиотерапевтични/ортопедични категории
//   за анализ на стойка (по същия модел като вече съществуващите
//   HWS/BWS/LWS редове — Lordose/Kyphose/Skoliose/...), оценени на същата
//   4-степенна скала schwer/mittelschwer/leicht/normal. DK не e
//   предоставил конкретен мокъп с точните редове за тия 5 полета все
//   още — лесно се преименуват/пренаредят при преглед, ако има други в
//   предвид (структурата — sections: [{rows: [{label, key}]}] — е
//   generic, виж override-а в BeuterlungTable.tsx).
// ============================================

// 🔹 2026-08-20 (2) — WIRBELSÄULE редовете бяха хардкоднати директно в
// JSX-а на BeuterlungTable.tsx (нямаше `sections` за default случая).
// Изнесени тук в СЪЩИЯ формат като KOPF/SCHULTER/... по-долу — same
// keys (lordose/skoliose/kyphose/schiefhals/steilstellung, bws_.../
// lws_...) като преди, за да не се губят вече записани данни. Целта: (1)
// BeuterlungTable.tsx вече винаги минава през ЕДИН и същ рендер-път
// (sections ?? WIRBELSAEULE_SECTIONS) вместо да дублира JSX, (2)
// KoerperHaltungAuswertungComponent.tsx може да реизползва СЪЩАТА
// декларация за label look-up на избраните редове (AUSWERTUNG бутон).
export const WIRBELSAEULE_SECTIONS = [
    {
        title: 'HWS',
        rows: [
            { label: 'Lordose', key: 'lordose' },
            { label: 'Skoliose', key: 'skoliose' },
            { label: 'Kyphose', key: 'kyphose' },
            { label: 'Schiefhals', key: 'schiefhals' },
            { label: 'Steilstellung', key: 'steilstellung' }
        ]
    },
    {
        title: 'BWS',
        rows: [
            { label: 'Kyphose', key: 'bws_kyphose' },
            { label: 'Skoliose', key: 'bws_skoliose' },
            { label: 'Steilstellung', key: 'bws_steil' }
        ]
    },
    {
        title: 'LWS',
        rows: [
            { label: 'Lordose', key: 'lws_lordose' },
            { label: 'Skoliose', key: 'lws_skoliose' },
            { label: 'Steilstellung', key: 'lws_steil' }
        ]
    }
];

export const KOPF_SECTIONS = [
    {
        rows: [
            { label: 'Kopfschiefstand', key: 'kopf_schiefstand' },
            { label: 'Kopfvorhaltung', key: 'kopf_vorhaltung' },
            { label: 'Kopfrotation', key: 'kopf_rotation' }
        ]
    }
];

export const SCHULTER_SECTIONS = [
    {
        rows: [
            { label: 'Schulterhochstand rechts', key: 'schulter_hochstand_re' },
            { label: 'Schulterhochstand links', key: 'schulter_hochstand_li' },
            { label: 'Schulterprotraktion', key: 'schulter_protraktion' },
            { label: 'Schulterasymmetrie', key: 'schulter_asymmetrie' }
        ]
    }
];

export const BECKEN_SECTIONS = [
    {
        rows: [
            { label: 'Beckenschiefstand', key: 'becken_schiefstand' },
            { label: 'Beckenkippung anterior', key: 'becken_kippung_anterior' },
            { label: 'Beckenkippung posterior', key: 'becken_kippung_posterior' },
            { label: 'Beckenrotation', key: 'becken_rotation' }
        ]
    }
];

export const KNIE_SECTIONS = [
    {
        rows: [
            { label: 'Genu valgum', key: 'knie_valgum' },
            { label: 'Genu varum', key: 'knie_varum' },
            { label: 'Genu recurvatum', key: 'knie_recurvatum' }
        ]
    }
];

export const FUSS_SECTIONS = [
    {
        rows: [
            { label: 'Senkfuß', key: 'fuss_senkfuss' },
            { label: 'Spreizfuß', key: 'fuss_spreizfuss' },
            { label: 'Hohlfuß', key: 'fuss_hohlfuss' },
            { label: 'Knickfuß', key: 'fuss_knickfuss' },
            { label: 'Plattfuß', key: 'fuss_plattfuss' }
        ]
    }
];
