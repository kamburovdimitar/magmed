// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-20 (Europe/Sofia) — DK: "Training – Gesundheit" модул (5 нови
//   PDF-а: 5.21b Kein Test, 5.24b Ergometrie Watt, 5.25b Laktat Ergometrie
//   Watt, 0.00 MAGMED Codex 04_2, 5.90 CCC Gesundheits Training — план
//   обсъден с DK преди имплементация). Този файл държи САМО формулите,
//   които са genuinely нови спрямо вече съществуващия CodexUtil.js:
//     #WaK# — Watt от km/h (Fahrrad -> Laufband конверсия)
//     #KaW# — km/h от Watt (Laufband -> Fahrrad конверсия)
//   #MaK# (min/km от km/h) НЕ се дублира тук — вече съществува като #28
//   `CodexUtil.calculatePace(speed)` (60/Speed, MM:SS формат) — виж
//   MDPatientMeasurements.minperkm getter-а, който вече го ползва.
//   #40#/#118# (Karvonen HF) също не се дублира — виж
//   `CodexUtil.calculateKarvonenHeartRate(restHF, maxHF, intensityPercent)`.
//   #XZ# (Fahrrad↔Laufband HF корекция) не е формула, а стойност — живее
//   в Redux `settingsSlice.ts` (глобална настройка), не тук.
// 2026-08-20 (2) — DK: "изтрий всичко старо на Training (❤️) страницата,
//   имплементирай PDF по PDF" — Kein Test таб (5.21b) изисква #121#/#129#
//   (Trainings Intensität Watt = Intensität% × SollWatt/#31# или #128#) —
//   генерична формула, реизползваема за GA1/GA2 и за бъдещите Ergometrie/
//   Laktat/Spiro табове (винаги "Watt = Intensität × база-Watt").
// ============================================

/**
 * ------------------------------------------------
 * #WaK# - Watt от km/h
 * ------------------------------------------------
 * MAGMED Codex:
 * (km/h - 2) / 0.06
 */
function calculateWattFromSpeed(
    speedKmh
) {

    if (
        speedKmh == null
    ) {
        return null;
    }

    return Number(
        (
            (speedKmh - 2) /
            0.06
        ).toFixed(0)
    );

}

/**
 * ------------------------------------------------
 * #KaW# - km/h от Watt
 * ------------------------------------------------
 * MAGMED Codex:
 * (0.06 × Watt) + 2
 */
function calculateSpeedFromWatt(
    watt
) {

    if (
        watt == null
    ) {
        return null;
    }

    return Number(
        (
            (0.06 * watt) +
            2
        ).toFixed(1)
    );

}

/**
 * ------------------------------------------------
 * #121#/#129# - Trainings Intensität Watt
 * ------------------------------------------------
 * MAGMED Codex:
 * Watt = Intensität × Basis-Watt (#31# кein Test / #32# Test am Fahrrad /
 * #128# Test am Laufband, в зависимост от таба)
 */
function calculateIntensityWatt(
    baseWatt,
    intensityPercent
) {

    if (
        baseWatt == null ||
        intensityPercent == null
    ) {
        return null;
    }

    return Math.round(
        (intensityPercent / 100) *
        baseWatt
    );

}

export const TrainingsplanUtil = {
    calculateWattFromSpeed,
    calculateSpeedFromWatt,
    calculateIntensityWatt
};
