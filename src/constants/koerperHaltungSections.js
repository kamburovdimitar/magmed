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
// 🔹 2026-08-27 (Europe/Sofia) — DK: "нещата в списъка, не са преведени...
// на български" (+ follow-up: "тези също .... Lordose Kyphose... и
// останалите"). `label` was rendered directly as raw text by
// BeuterlungTable.tsx / KoerperHaltungAuswertungComponent.tsx — never
// translated. Added `labelKey` (new koerperhaltung_*_text keys in
// Translations.js) alongside the existing `label`; both consumers now look
// the row up via LanguageUtil.getName(r.labelKey) instead of using r.label
// directly. Kept `label` in place (unused now, but harmless) rather than
// removing it, in case anything else still reads it.
export const WIRBELSAEULE_SECTIONS = [
    {
        title: 'HWS',
        rows: [
            { label: 'Lordose', labelKey: 'koerperhaltung_lordose_text', key: 'lordose' },
            { label: 'Skoliose', labelKey: 'koerperhaltung_skoliose_text', key: 'skoliose' },
            { label: 'Kyphose', labelKey: 'koerperhaltung_kyphose_text', key: 'kyphose' },
            { label: 'Schiefhals', labelKey: 'koerperhaltung_schiefhals_text', key: 'schiefhals' },
            { label: 'Steilstellung', labelKey: 'koerperhaltung_steilstellung_text', key: 'steilstellung' }
        ]
    },
    {
        title: 'BWS',
        rows: [
            { label: 'Kyphose', labelKey: 'koerperhaltung_kyphose_text', key: 'bws_kyphose' },
            { label: 'Skoliose', labelKey: 'koerperhaltung_skoliose_text', key: 'bws_skoliose' },
            { label: 'Steilstellung', labelKey: 'koerperhaltung_steilstellung_text', key: 'bws_steil' }
        ]
    },
    {
        title: 'LWS',
        rows: [
            { label: 'Lordose', labelKey: 'koerperhaltung_lordose_text', key: 'lws_lordose' },
            { label: 'Skoliose', labelKey: 'koerperhaltung_skoliose_text', key: 'lws_skoliose' },
            { label: 'Steilstellung', labelKey: 'koerperhaltung_steilstellung_text', key: 'lws_steil' }
        ]
    }
];

export const KOPF_SECTIONS = [
    {
        rows: [
            { label: 'Kopfschiefstand', labelKey: 'koerperhaltung_kopfschiefstand_text', key: 'kopf_schiefstand' },
            { label: 'Kopfvorhaltung', labelKey: 'koerperhaltung_kopfvorhaltung_text', key: 'kopf_vorhaltung' },
            { label: 'Kopfrotation', labelKey: 'koerperhaltung_kopfrotation_text', key: 'kopf_rotation' }
        ]
    }
];

export const SCHULTER_SECTIONS = [
    {
        rows: [
            { label: 'Schulterhochstand rechts', labelKey: 'koerperhaltung_schulterhochstand_rechts_text', key: 'schulter_hochstand_re' },
            { label: 'Schulterhochstand links', labelKey: 'koerperhaltung_schulterhochstand_links_text', key: 'schulter_hochstand_li' },
            { label: 'Schulterprotraktion', labelKey: 'koerperhaltung_schulterprotraktion_text', key: 'schulter_protraktion' },
            { label: 'Schulterasymmetrie', labelKey: 'koerperhaltung_schulterasymmetrie_text', key: 'schulter_asymmetrie' }
        ]
    }
];

export const BECKEN_SECTIONS = [
    {
        rows: [
            { label: 'Beckenschiefstand', labelKey: 'koerperhaltung_beckenschiefstand_text', key: 'becken_schiefstand' },
            { label: 'Beckenkippung anterior', labelKey: 'koerperhaltung_beckenkippung_anterior_text', key: 'becken_kippung_anterior' },
            { label: 'Beckenkippung posterior', labelKey: 'koerperhaltung_beckenkippung_posterior_text', key: 'becken_kippung_posterior' },
            { label: 'Beckenrotation', labelKey: 'koerperhaltung_beckenrotation_text', key: 'becken_rotation' }
        ]
    }
];

export const KNIE_SECTIONS = [
    {
        rows: [
            { label: 'Genu valgum', labelKey: 'koerperhaltung_genu_valgum_text', key: 'knie_valgum' },
            { label: 'Genu varum', labelKey: 'koerperhaltung_genu_varum_text', key: 'knie_varum' },
            { label: 'Genu recurvatum', labelKey: 'koerperhaltung_genu_recurvatum_text', key: 'knie_recurvatum' }
        ]
    }
];

export const FUSS_SECTIONS = [
    {
        rows: [
            { label: 'Senkfuß', labelKey: 'koerperhaltung_senkfuss_text', key: 'fuss_senkfuss' },
            { label: 'Spreizfuß', labelKey: 'koerperhaltung_spreizfuss_text', key: 'fuss_spreizfuss' },
            { label: 'Hohlfuß', labelKey: 'koerperhaltung_hohlfuss_text', key: 'fuss_hohlfuss' },
            { label: 'Knickfuß', labelKey: 'koerperhaltung_knickfuss_text', key: 'fuss_knickfuss' },
            { label: 'Plattfuß', labelKey: 'koerperhaltung_plattfuss_text', key: 'fuss_plattfuss' }
        ]
    }
];
