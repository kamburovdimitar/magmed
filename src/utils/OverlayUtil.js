// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-17 (Europe/Sofia) — Нов файл, стъпка 1 от плана за
// "3.36 CCC Laktatkurve überlagern" (наслагване на няколко archive теста
// на един пациент на общ график). Нарочно изолиран от ErgometryModelsUtil.js/
// ErgometrieUtil.js/Page11.tsx — само чиста логика (сортиране, оцветяване,
// нормализация към %IANS), тествана самостоятелно, преди да се пипа UI.
//
// Извлечено директно от спецификацията:
//   - "Absolute Darstellung": X-ос = реални Watt/km-h стойности.
//   - "Normierte Darstellung": X-ос = % от индивидуалната IANS на всеки
//     тест поотделно (IANS = фиксна точка 100%), за да са сравними криви
//     от различни протоколи (различен старт/стъпка).
//   - "aktive Kurve: дебела линия, висока наситеност; alte Kurven: по-тънки,
//     по-бледи/полупрозрачни" + "Farb-Kopplung": цветът е фиксиран по
//     тест-дата, не се разбърква при всяко презареждане.
//   - "Der neueste Test liegt im Vordergrund": хронологично сортирани,
//     най-новият отгоре/най-отпред.
// ============================================

// 🔹 палитра, циклираща по хронологичен индекс (0 = най-стар). PDF-ът дава
// пример с конкретни години (2014→сиво, 2016→синьо, 2020→зелено,
// 2024→червено), но реалните архивни дати на който и да е пациент няма как
// да съвпаднат с точно тези 4 години — затова тук цветът е закачен за
// ПОЗИЦИЯТА на теста в хронологията (стар→нов), не за буквалната година.
// Палитрата е нарочно същия дух (сиво→синьо→зелено→червено→...) и се
// повтаря, ако тестовете са повече от цветовете.
const OVERLAY_COLOR_PALETTE = ['#888888', '#3b6fd6', '#2e8b57', '#c0392b', '#8a5bc8', '#c07a1e'];

/**
 * 🔹 Сортира archive записите хронологично по createdAt.
 * @param {Array} reports - MDErgometryReport[]-подобни обекти { id, createdAt, ... }
 * @param {'asc'|'desc'} order - 'asc' = най-стар пръв (по подразбиране)
 * @returns {Array} нов сортиран масив (не мутира входа)
 */
function sortReportsChronologically(reports, order = 'asc') {

    if (!reports || !reports.length) return [];

    const withParsedDate = reports.map((report) => ({
        report,
        timestamp: Date.parse(report?.createdAt) || 0
    }));

    withParsedDate.sort((a, b) =>
        order === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );

    return withParsedDate.map((entry) => entry.report);
}

/**
 * 🔹 Цвят по хронологична позиция (0-базиран индекс СРЕД ХРОНОЛОГИЧНО
 * СОРТИРАНИТЕ записи, не индекс в оригиналния/непроменен масив).
 * @param {number} chronologicalIndex
 * @returns {string} hex цвят
 */
function getOverlayColorByIndex(chronologicalIndex) {

    if (chronologicalIndex == null || chronologicalIndex < 0) {
        return OVERLAY_COLOR_PALETTE[0];
    }

    return OVERLAY_COLOR_PALETTE[chronologicalIndex % OVERLAY_COLOR_PALETTE.length];
}

/**
 * 🔹 Нормализира редовете на един тест към % от НЕГОВАТА собствена IANS
 * (IANS точка = фиксна 100%). Работи с товар (Watt) ИЛИ скорост (km/h) —
 * каквото поле вече носи всеки ред ("load"), тъй като за run тестовете
 * load вече представлява km/h стойността (виж ErgometryModelsUtil.js).
 * @param {Array} rows - [{stage, load, hf, lactate}]
 * @param {number} iansLoad - IANSPoint.load на СЪЩИЯ тест
 * @returns {Array|null} нови редове с added `percentIANS`, или null ако
 * iansLoad липсва/е <=0 (не може да се нормализира без фиксна точка)
 */
function normalizeRowsToPercentIANS(rows, iansLoad) {

    if (!rows || !rows.length) return null;

    if (!iansLoad || iansLoad <= 0) return null;

    return rows.map((row) => ({
        ...row,
        percentIANS: Number(((Number(row.load) / iansLoad) * 100).toFixed(1))
    }));
}

/**
 * 🔹 Главна входна точка за Step 1: превръща избраните archive записи в
 * готови за чертане "серии" — сортирани хронологично, оцветени, с
 * нормализация ако е поискана, и стил (активна vs стара крива).
 *
 * @param {Array} reports - избраните MDErgometryReport-и (вече филтрирани
 * от UI-я кои да се наслагват — тази функция НЕ филтрира, само подрежда)
 * @param {Object} options
 * @param {'absolute'|'normiert'} options.mode
 * @param {string|null} options.activeReportId - кой е "активният"
 * (последно избран/hover-нат) за да получи дебела/наситена линия
 *
 * @returns {Array} [{
 *   id, createdAt, color, isActive,
 *   rows: [...],            // {load, hf, lactate, stage} или {..., percentIANS} ако mode==='normiert'
 *   IASPoint, IANSPoint,     // от report.result, недокоснати (absolute стойности за таблицата)
 *   xField: 'load'|'percentIANS'  // кое поле да ползва графиката за X
 * }]
 * Записи без валидни IAS/IANS точки (result.IASPoint/IANSPoint липсват) се
 * прескачат мълчаливо в 'normiert' режим (няма как да се нормализират без
 * фиксна точка) — но остават в absolute режим, само без нормализация.
 */
function buildOverlaySeries(reports, { mode = 'absolute', activeReportId = null } = {}) {

    if (!reports || !reports.length) return [];

    const chronological = sortReportsChronologically(reports, 'asc');

    const series = [];

    for (let i = 0; i < chronological.length; i++) {

        const report = chronological[i];

        const rawRows = report?.ergometry?.data;

        if (!rawRows || !rawRows.length) continue;

        const iansLoad = report?.result?.IANSPoint?.load ?? null;

        let rows = rawRows;
        let xField = 'load';

        if (mode === 'normiert') {

            const normalized = normalizeRowsToPercentIANS(rawRows, iansLoad);

            // 🔹 без валиден IANS не може да се построи %-скала за този
            // тест — пропускаме го мълчаливо С ИЗКЛЮЧЕНИЕ на absolute
            // режима, където суровите Watt/km-h стойности винаги важат.
            if (!normalized) continue;

            rows = normalized;
            xField = 'percentIANS';
        }

        series.push({
            id: report.id,
            createdAt: report.createdAt,
            color: getOverlayColorByIndex(i),
            isActive: activeReportId != null && report.id === activeReportId,
            rows,
            IASPoint: report?.result?.IASPoint ?? null,
            IANSPoint: report?.result?.IANSPoint ?? null,
            xField,
            // 🔹 2026-08-18 — нужно за Trainingszonen ein/aus (стъпка 2 от
            // "3.36 CCC überlagern"): за да пресметнем цветните зони на
            // "активната" крива трябва да знаем КОЙ Rechenverfahren модел е
            // ползван за точно този archived report (може да е различен от
            // теста, който в момента е отворен в "Aktuell").
            model: report?.ergometry?.model ?? null
        });
    }

    // 🔹 "Der neueste Test liegt im Vordergrund" — обръщаме реда за
    // ЧЕРТАНЕ (не за таблицата) така, че най-новият да се рисува последен
    // (= отгоре, най-отпред) без да губим хронологичния масив другаде.
    return series;
}

export const OverlayUtil = {
    sortReportsChronologically,
    getOverlayColorByIndex,
    normalizeRowsToPercentIANS,
    buildOverlaySeries
};
