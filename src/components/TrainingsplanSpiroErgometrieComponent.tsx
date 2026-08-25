// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-21 (Europe/Sofia) — DK: "остана последният — Spiro Ergometrie"
//   (5.90CCCGESUNDHEITS_Training.pdf, "SPIROERGOMETRIE, Fahrrad –
//   Standardeinstellung" — самия Entscheidungsbaum документ, не отделен
//   "_EXPORT" мокъп като другите 3 табове, но съдържа своя собствена
//   мокъп-таблица + формулен блок за Spiro, достатъчен за имплементация).
//   Структурата е СЪЩАТА като Laktat Ergometrie (обобщаваща таблица + 8-
//   степенна Trainings-Woche таблица + Ratschläge панел + REHABILITATION/
//   GESUNDHEITSSPORT/FREIZEITSPORT ляво меню) — реизползван е абсолютно
//   същия layout/стилове.
//
//   Разлики спрямо Laktat Ergometrie:
//     база = VT1/VT2 (Ventilatory Threshold 1/2, от спироергометрия —
//            CodexUtil #74#/#75# calculateVT1HeartRate/
//            calculateVT2HeartRate от MDErgometryReportResult.hfFirst/
//            hfSecond на последния "bike" тест), НЕ IAS/IANS.
//     зони = GA1: 55-65% / GA2: 65-75% (различно от Laktat-овите 75-85/
//            85-95 И от Kein Test/Ergometrie-вите 50-60/60-70).
//     km/h max СЕ показва тук (за разлика от Laktat, който няма отделен
//            ред за него) — виж мокъпа: VT1/VT2/Watt max/km-h max, 4
//            реда, точно както Kein Test/Ergometrie.
//
//   Формула за HF зоните (Entscheidungsbaum: "Inter- und Extrapolation
//   Kaskaden #77 bis 81# und #65#") — след разчитане на CodexUtil.js: #77-
//   86 са само именувани alias-и (HF@50%/55%/.../95% VO2max) на ЕДИН общ
//   генеричен helper, `calculateVO2HeartRate(maxHF, percent) = maxHF ×
//   percent/100` — затова тук викаме директно генеричния helper с точния
//   %, вместо да търсим alias за всеки отделен процент (55/65/75 не са
//   всички кратни на 5° по мрежата от alias-и, но самата формула е чисто
//   линейна, така че генеричния helper дава идентичен резултат).
//
//   #65# (VO₂ Max Heart Rate — пикова HF при самия VO2max тест) е
//   формулно посочена като база в PDF-а, но моделът (MDErgometryReport-
//   Result) няма отделно поле за нея — само hfFirst/hfSecond (VT1/VT2).
//   Затова, аналогично на Laktat таба (където IANS замести Karvonen-ова
//   HFmax), тук ползвам VT2 (hfSecond) като % база вместо непредоставената
//   VO2max-пикова HF — флагнато явно, кажи ако имаш точната #65# стойност
//   отделно.
//
//   Watt max/VT1/VT2 fallback (без реален spiro тест): същия принцип
//   както Laktat табa — VT1≈70%/VT2≈90% от възрастовия HFmax, Watt max =
//   възрастовата норма (measurement.sollLeistungNorm), докато DK не
//   предостави реален CPET тест за демонстрация.
//
// 2026-08-24 — DK забеляза, че Cycling/Laufen чекбоксовете тук не се цъкат
//   в 'grundeinstellung' режим. Премахнах "isIndividuell &&" пазача от
//   onPress (виж пълния разбор в TrainingsplanKeinTestComponent.tsx —
//   същата непоследователност спрямо "Hide unselected areas", поправена
//   идентично във всичките 4 таба).
// ============================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import LanguageUtil from '../utils/LanguageUtil';
import { CodexUtil } from '../utils/CodexUtil';
import { TrainingsplanUtil } from '../utils/TrainingsplanUtil';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';
import TitleWithInfoComponent from './TitleWithInfoComponent';
import { openPopup } from '../services/PopupService';
import {
    KEIN_TEST_DEFAULT_STAGES,
    RATSCHLAEGE_VORLAGE_A,
    RATSCHLAEGE_VORLAGE_B,
    RATSCHLAEGE_VORLAGE_C
} from '../constants/trainingsplanKeinTestDefaults';

const VORLAGEN: any = {
    A: RATSCHLAEGE_VORLAGE_A,
    B: RATSCHLAEGE_VORLAGE_B,
    C: RATSCHLAEGE_VORLAGE_C
};

// 🔹 5.90 PDF, "SPIROERGOMETRIE" — GA1: 55-65% / GA2: 65-75% от VT2 HF.
const SPIRO_INTENSITY_RANGES = {
    ga1: { from: 55, to: 65 },
    ga2: { from: 65, to: 75 }
};

const VT1_FALLBACK_PERCENT_OF_HFMAX = 70;
const VT2_FALLBACK_PERCENT_OF_HFMAX = 90;

// 🔹 2026-08-24 (Claude) — DK: "да сложи. и да видим после какво правим".
// PDF-ът (5.90) има точни % САМО за Gesundheitssport (GA1: 55-65 / GA2:
// 65-75 от VT2 HF). Rehabilitation/Freizeitsport са ПРИБЛИЗИТЕЛНИ placeholder
// стойности (±10pp), докато DK предостави реалните диапазони.
const SPIRO_INTENSITY_RANGES_BY_KATEGORIE: any = {
    rehabilitation: { ga1: { from: 45, to: 55 }, ga2: { from: 55, to: 65 } },
    gesundheitssport: SPIRO_INTENSITY_RANGES,
    freizeitsport: { ga1: { from: 65, to: 75 }, ga2: { from: 75, to: 85 } }
};

const INFO_SUMMARY_BG = {
    title: 'Основни стойности и тренировъчни зони (Спироергометрия)',
    description:
        'VT1 и VT2 (вентилаторни прагове 1 и 2) са установени от спироергометричния тест на пациента — идват от '
        + 'последния му тест, ако има такъв; иначе се ползва приблизителна оценка от максималния пулс, докато не бъде '
        + 'направен реален тест. Watt max е максималната мощност от теста (или възрастова норма като заместител), а '
        + 'km/h max е приблизителна скорост, изчислена от Watt max. Зоните тук са директен % от VT2 пулса.',
    formula:
        'Тренировъчен пулс = Интензитет% × VT2 HF\n'
        + 'Watt при зона = Интензитет% × Watt max\n'
        + 'km/h max ≈ (0.06 × Watt max) + 2',
    fields: [
        'VT1 = първи вентилаторен праг — пулс, при който дишането започва леко да се учестява.',
        'VT2 = втори вентилаторен праг — пулс, при който дишането рязко се учестява (близо до анаеробния праг).',
        'Watt max = максималната мощност, постигната при спироергометричния тест (или възрастова норма, ако няма тест).',
        'km/h max = приблизителна максимална скорост, изчислена от Watt max.',
        'Колоездене / Бягане (чекбоксовете) = отбележи с какво тренира пациентът.',
        'Здравен спорт (GA1) = 55–65% от VT2 пулса.',
        'Свободно време спорт (GA2) = 65–75% от VT2 пулса.'
    ],
    source:
        'Стойностите идват от реалния спироергометричен тест на пациента, ако има такъв записан; иначе са приблизителна '
        + 'оценка (70%/90% от максималния пулс), докато не бъде направен реален тест. Стават редактируеми в режим '
        + '"Индивидуално планиране".'
};

const INFO_STAGES_BG = {
    title: 'Тренировъчен план по седмици (8 етапа) — Спироергометрия',
    description:
        'Същият тренировъчен план както при другите табове — прогресия през 8 етапа. Натисни "DESIGN training week" '
        + 'от лявото меню, за да редактираш индивидуално за този пациент.',
    fields: [
        'WNTZ (минути) = обща нетна тренировъчна седмица.',
        'Продължителност на сесия (минути) = колко минути трае всяка отделна тренировка.',
        'Сесии/седмица = колко пъти седмично тренира пациентът на този етап.',
        'Разпределение на времето (GA1/GA2) = какъв процент от времето е в по-лека (GA1) и какъв в по-усилена (GA2) зона.',
        'Тренировъчен блок (седмици) = колко седмици пациентът остава на този етап.',
        'Чекбоксът вляво на всеки ред показва дали етапът е активен/включен в плана.'
    ],
    source: 'Стойностите по подразбиране следват стандартната прогресия от документацията MAGMED Codex (същите като другите табове).'
};

function getLatestBikeErgometryReport(measurement: any) {

    const reports = (measurement?.ergometryReports ?? []).filter(
        (r: any) => r?.ergometry?.type === 'bike'
    );

    if (!reports.length) return null;

    return reports.reduce((latest: any, r: any) => {
        if (!latest) return r;
        return new Date(r.createdAt) > new Date(latest.createdAt) ? r : latest;
    }, null);

}

export default function TrainingsplanSpiroErgometrieComponent({ measurement, callback }: any) {

    const xzCorrection = useSelector(
        (state: any) => state.settings?.xzCorrection
    ) ?? 10;

    const spiro = measurement?.trainingsplanSpiroErgometrie ?? {};

    const editMode = spiro.editMode ?? 'grundeinstellung';
    const isIndividuell = editMode === 'individuell';

    const radfahrenEnabled = spiro.radfahrenEnabled ?? true;
    const laufenEnabled = spiro.laufenEnabled ?? true;
    const hideUnselected = spiro.hideUnselected ?? false;
    const ratschlagTemplate = spiro.ratschlagTemplate === undefined ? 'A' : spiro.ratschlagTemplate;
    const ratschlagLanguage = spiro.ratschlagLanguage ?? 'bg';
    const stages = spiro.stages ?? KEIN_TEST_DEFAULT_STAGES;

    // 🔹 2026-08-24 (Claude) — виж SPIRO_INTENSITY_RANGES_BY_KATEGORIE по-горе.
    const trainingskategorie = spiro.trainingskategorie ?? 'gesundheitssport';
    const activeIntensityRanges = SPIRO_INTENSITY_RANGES_BY_KATEGORIE[trainingskategorie]
        ?? SPIRO_INTENSITY_RANGES;

    const bikeReport = getLatestBikeErgometryReport(measurement);

    const hfmaxFallback = measurement?.expectedheartrate > 0 ? measurement.expectedheartrate : 0;

    const vt1FromTest = CodexUtil.calculateVT1HeartRate(bikeReport?.result?.hfFirst || null);
    const vt2FromTest = CodexUtil.calculateVT2HeartRate(bikeReport?.result?.hfSecond || null);

    const vt1Base = vt1FromTest ?? (hfmaxFallback ? Math.round(hfmaxFallback * VT1_FALLBACK_PERCENT_OF_HFMAX / 100) : 0);
    const vt2Base = vt2FromTest ?? (hfmaxFallback ? Math.round(hfmaxFallback * VT2_FALLBACK_PERCENT_OF_HFMAX / 100) : 0);
    const wattMaxBase = measurement?.sollLeistungNorm ?? 0;

    const vt1 = (isIndividuell && spiro.vt1Override != null) ? spiro.vt1Override : vt1Base;
    const vt2 = (isIndividuell && spiro.vt2Override != null) ? spiro.vt2Override : vt2Base;
    const wattMax = (isIndividuell && spiro.wattMaxOverride != null) ? spiro.wattMaxOverride : wattMaxBase;

    const kmhMax = TrainingsplanUtil.calculateSpeedFromWatt(wattMax) ?? 0;

    function updateSpiro(patch: any) {

        callback(
            new MDPatientMeasurements({
                ...measurement,
                trainingsplanSpiroErgometrie: {
                    ...spiro,
                    ...patch
                }
            })
        );

    }

    function computeZone(fromPercent: number, toPercent: number) {

        const hfFahrradFrom = CodexUtil.calculateVO2HeartRate(vt2, fromPercent) ?? 0;
        const hfFahrradTo = CodexUtil.calculateVO2HeartRate(vt2, toPercent) ?? 0;

        const hfLaufenFrom = hfFahrradFrom + xzCorrection;
        const hfLaufenTo = hfFahrradTo + xzCorrection;

        const wattFrom = TrainingsplanUtil.calculateIntensityWatt(wattMax, fromPercent) ?? 0;
        const wattTo = TrainingsplanUtil.calculateIntensityWatt(wattMax, toPercent) ?? 0;

        const kmhFrom = TrainingsplanUtil.calculateSpeedFromWatt(wattFrom) ?? 0;
        const kmhTo = TrainingsplanUtil.calculateSpeedFromWatt(wattTo) ?? 0;

        const paceFrom = CodexUtil.calculatePace(kmhFrom) ?? '';
        const paceTo = CodexUtil.calculatePace(kmhTo) ?? '';

        return {
            hfFahrrad: `${hfFahrradFrom} - ${hfFahrradTo}`,
            hfLaufen: `${hfLaufenFrom} - ${hfLaufenTo}`,
            watt: `${wattFrom} - ${wattTo}`,
            pace: `${paceFrom} - ${paceTo}`
        };

    }

    const ga1 = computeZone(activeIntensityRanges.ga1.from, activeIntensityRanges.ga1.to);
    const ga2 = computeZone(activeIntensityRanges.ga2.from, activeIntensityRanges.ga2.to);

    const showRadfahren = radfahrenEnabled || !hideUnselected;
    const showLaufen = laufenEnabled || !hideUnselected;

    function toggleStageActive(stageIndex: number) {

        if (!isIndividuell) return;

        const updated = stages.map((s: any, i: number) =>
            i === stageIndex ? { ...s, active: !s.active } : s
        );

        updateSpiro({ stages: updated });

    }

    // 🔹 2026-08-21 (Claude) — DK: "на всичките полета отгоре, трябва да
    // им сложиш тикче селект ал/деселект ал" — master чекбокс в хедъра на
    // чекбокс-колоната (виж същия коментар в TrainingsplanKeinTestComponent.tsx).
    function toggleAllStages() {

        if (!isIndividuell) return;

        const allActive = stages.every((s: any) => s.active);

        const updated = stages.map((s: any) => ({ ...s, active: !allActive }));

        updateSpiro({ stages: updated });

    }

    function updateStageField(stageIndex: number, field: string, value: string) {

        const updated = stages.map((s: any, i: number) =>
            i === stageIndex ? { ...s, [field]: value } : s
        );

        updateSpiro({ stages: updated });

    }

    const ratschlagText = spiro.ratschlagText != null
        ? spiro.ratschlagText
        : (ratschlagTemplate ? (VORLAGEN[ratschlagTemplate]?.[ratschlagLanguage] ?? '') : '');

    function infoHandlerSummary() {
        openPopup(INFO_SUMMARY_BG);
    }

    function infoHandlerStages() {
        openPopup(INFO_STAGES_BG);
    }

    return (
        <View style={styles.row}>

            <View style={styles.mainColumn}>

                {/* ===== SUMMARY: VT1/VT2 + Watt max + km-h max ===== */}
                <TitleWithInfoComponent
                    title={LanguageUtil.getName('basiswerte_trainingszonen_text')}
                    infoHandler={infoHandlerSummary}
                />

                <View style={styles.summaryCard}>

                    <View style={styles.summaryLeft}>

                        <View style={styles.fieldRow}>
                            <Text style={styles.fieldLabel}>{LanguageUtil.getName('vt1_text')}</Text>
                            {
                                isIndividuell
                                    ? (
                                        <TextInput
                                            style={[styles.smallInput, styles.editableGold]}
                                            keyboardType="numeric"
                                            value={String(vt1)}
                                            onChangeText={(v) => updateSpiro({ vt1Override: Number(v) || 0 })}
                                        />
                                    )
                                    : <Text style={styles.readonlyValue}>{vt1}</Text>
                            }
                            <Text style={styles.unit}>S/min</Text>
                        </View>

                        <View style={styles.fieldRow}>
                            <Text style={styles.fieldLabel}>{LanguageUtil.getName('vt2_text')}</Text>
                            {
                                isIndividuell
                                    ? (
                                        <TextInput
                                            style={[styles.smallInput, styles.editableGold]}
                                            keyboardType="numeric"
                                            value={String(vt2)}
                                            onChangeText={(v) => updateSpiro({ vt2Override: Number(v) || 0 })}
                                        />
                                    )
                                    : <Text style={styles.readonlyValue}>{vt2}</Text>
                            }
                            <Text style={styles.unit}>S/min</Text>
                        </View>

                        <View style={styles.fieldRow}>
                            <Text style={styles.fieldLabel}>{LanguageUtil.getName('watt_max_text')}</Text>
                            {
                                isIndividuell
                                    ? (
                                        <TextInput
                                            style={[styles.smallInput, styles.editableGreen]}
                                            keyboardType="numeric"
                                            value={String(wattMax)}
                                            onChangeText={(v) => updateSpiro({ wattMaxOverride: Number(v) || 0 })}
                                        />
                                    )
                                    : <Text style={styles.readonlyValue}>{wattMax}</Text>
                            }
                            <Text style={styles.unit}>Watt</Text>
                        </View>

                        <View style={styles.fieldRow}>
                            <Text style={styles.fieldLabel}>{LanguageUtil.getName('kmh_max_text')}</Text>
                            <Text style={styles.readonlyValue}>{kmhMax}</Text>
                            <Text style={styles.unit}>km/h</Text>
                        </View>

                    </View>

                    <View style={styles.summaryRight}>

                        <View style={styles.sportToggleRow}>
                            {
                                showRadfahren && (
                                    <Pressable
                                        style={styles.sportToggle}
                                        onPress={() => updateSpiro({ radfahrenEnabled: !radfahrenEnabled })}
                                    >
                                        <Text style={styles.checkboxGlyph}>{radfahrenEnabled ? '☑' : '☐'}</Text>
                                        <Text style={styles.sportToggleLabel}>{LanguageUtil.getName('radfahren_text')}</Text>
                                    </Pressable>
                                )
                            }
                            {
                                showLaufen && (
                                    <Pressable
                                        style={styles.sportToggle}
                                        onPress={() => updateSpiro({ laufenEnabled: !laufenEnabled })}
                                    >
                                        <Text style={styles.checkboxGlyph}>{laufenEnabled ? '☑' : '☐'}</Text>
                                        <Text style={styles.sportToggleLabel}>{LanguageUtil.getName('laufen_text')}</Text>
                                    </Pressable>
                                )
                            }
                        </View>

                        <View style={styles.zoneTable}>

                            <View style={styles.zoneHeaderRow}>
                                <Text style={styles.zoneHeaderCell}>{LanguageUtil.getName('trainingsbereich_text')}</Text>
                                {showRadfahren && <Text style={styles.zoneHeaderCell}>S/min</Text>}
                                {showRadfahren && <Text style={styles.zoneHeaderCell}>Watt</Text>}
                                {showLaufen && <Text style={styles.zoneHeaderCell}>S/min</Text>}
                                {showLaufen && <Text style={styles.zoneHeaderCell}>min/km</Text>}
                            </View>

                            <View style={styles.zoneRow}>
                                <Text style={styles.zoneLabelCell}>
                                    {LanguageUtil.getName('gesundheitssport_text')} (GA1: {activeIntensityRanges.ga1.from} - {activeIntensityRanges.ga1.to})
                                </Text>
                                {showRadfahren && <Text style={styles.zoneValueCell}>{ga1.hfFahrrad}</Text>}
                                {showRadfahren && <Text style={styles.zoneValueCell}>{ga1.watt}</Text>}
                                {showLaufen && <Text style={styles.zoneValueCell}>{ga1.hfLaufen}</Text>}
                                {showLaufen && <Text style={styles.zoneValueCell}>{ga1.pace}</Text>}
                            </View>

                            <View style={styles.zoneRow}>
                                <Text style={styles.zoneLabelCell}>
                                    {LanguageUtil.getName('freizeitsport_text')} (GA2: {activeIntensityRanges.ga2.from} - {activeIntensityRanges.ga2.to})
                                </Text>
                                {showRadfahren && <Text style={styles.zoneValueCell}>{ga2.hfFahrrad}</Text>}
                                {showRadfahren && <Text style={styles.zoneValueCell}>{ga2.watt}</Text>}
                                {showLaufen && <Text style={styles.zoneValueCell}>{ga2.hfLaufen}</Text>}
                                {showLaufen && <Text style={styles.zoneValueCell}>{ga2.pace}</Text>}
                            </View>

                        </View>

                    </View>

                </View>

                {/* ===== 8-STAGE TRAININGS-WOCHE TABLE ===== */}
                <TitleWithInfoComponent
                    title={LanguageUtil.getName('trainingswoche_plan_text')}
                    infoHandler={infoHandlerStages}
                />

                <View style={styles.stageTable}>

                    <View style={styles.stageHeaderRow}>
                        <Pressable style={styles.stageCheckCell} onPress={toggleAllStages}>
                            <Text style={styles.checkboxGlyph}>{stages.every((s: any) => s.active) ? '☑' : '☐'}</Text>
                        </Pressable>
                        <Text style={styles.stageCell}>{LanguageUtil.getName('stufe_text')}</Text>
                        <Text style={styles.stageCell}>{LanguageUtil.getName('wntz_minuten_text')}</Text>
                        <Text style={styles.stageCell}>{LanguageUtil.getName('dauer_te_minuten_text')}</Text>
                        <Text style={styles.stageCell}>{LanguageUtil.getName('te_woche_haeufigkeit_text')}</Text>
                        <Text style={styles.stageCell}>{LanguageUtil.getName('zeit_aufteilung_text')}</Text>
                        <Text style={styles.stageCell}>{LanguageUtil.getName('trainingsblock_wochen_text')}</Text>
                    </View>

                    {
                        stages.map((s: any, i: number) => (
                            <View key={s.stage ?? i} style={styles.stageRow}>

                                <Pressable
                                    style={styles.stageCheckCell}
                                    onPress={() => toggleStageActive(i)}
                                >
                                    <Text style={styles.checkboxGlyph}>{s.active ? '☑' : '☐'}</Text>
                                </Pressable>

                                <Text style={styles.stageCell}>{s.stage}.</Text>

                                {
                                    isIndividuell
                                        ? (
                                            <TextInput
                                                style={[styles.stageCell, styles.editableGold]}
                                                keyboardType="numeric"
                                                value={String(s.wntz)}
                                                onChangeText={(v) => updateStageField(i, 'wntz', v)}
                                            />
                                        )
                                        : <Text style={styles.stageCell}>{s.wntz}</Text>
                                }

                                {
                                    isIndividuell
                                        ? (
                                            <TextInput
                                                style={[styles.stageCell, styles.editableGold]}
                                                value={String(s.dauerTe)}
                                                onChangeText={(v) => updateStageField(i, 'dauerTe', v)}
                                            />
                                        )
                                        : <Text style={styles.stageCell}>{s.dauerTe}</Text>
                                }

                                {
                                    isIndividuell
                                        ? (
                                            <TextInput
                                                style={[styles.stageCell, styles.editableGold]}
                                                value={String(s.teWoche)}
                                                onChangeText={(v) => updateStageField(i, 'teWoche', v)}
                                            />
                                        )
                                        : <Text style={styles.stageCell}>{s.teWoche}</Text>
                                }

                                {
                                    isIndividuell
                                        ? (
                                            <View style={[styles.stageCell, styles.editableGold, styles.zeitAufteilungCell]}>
                                                <TextInput
                                                    style={styles.zeitAufteilungInput}
                                                    value={String(s.zeitAufteilung)}
                                                    onChangeText={(v) => updateStageField(i, 'zeitAufteilung', v)}
                                                />
                                                <Text style={styles.zeitAufteilungSuffix}>GA1/GA2</Text>
                                            </View>
                                        )
                                        : <Text style={styles.stageCell}>{s.zeitAufteilung} GA1/GA2</Text>
                                }

                                {
                                    isIndividuell
                                        ? (
                                            <TextInput
                                                style={[styles.stageCell, styles.editableGold]}
                                                value={String(s.trainingsblock)}
                                                onChangeText={(v) => updateStageField(i, 'trainingsblock', v)}
                                            />
                                        )
                                        : <Text style={styles.stageCell}>{s.trainingsblock}</Text>
                                }

                            </View>
                        ))
                    }

                </View>

                {/* ===== RATSCHLÄGE VORLAGE SELECTOR ===== */}
                <View style={styles.vorlageRow}>
                    <Text style={styles.fieldLabel}>{LanguageUtil.getName('ratschlaege')}</Text>
                    {
                        ['A', 'B', 'C'].map((v) => (
                            <Pressable
                                key={v}
                                style={styles.vorlageOption}
                                onPress={() => updateSpiro({
                                    ratschlagTemplate: ratschlagTemplate === v ? null : v,
                                    ratschlagText: null
                                })}
                            >
                                <Text style={styles.checkboxGlyph}>{ratschlagTemplate === v ? '☑' : '☐'}</Text>
                                <Text style={styles.vorlageLabel}>{LanguageUtil.getName('vorlage_' + v.toLowerCase() + '_text')}</Text>
                            </Pressable>
                        ))
                    }
                </View>

                {/* ===== LEGEND (винаги статичен, не се редактира) ===== */}
                <View style={styles.legend}>
                    {
                        [
                            ['wntz_text', 'wntz_erklaerung_text'],
                            ['dauer_te_minuten_text', 'dauer_te_erklaerung_text'],
                            ['te_woche_haeufigkeit_text', 'te_woche_erklaerung_text'],
                            ['zeit_aufteilung_text', 'zeit_aufteilung_erklaerung_text'],
                            ['trainingsblock_wochen_text', 'trainingsblock_erklaerung_text']
                        ].map(([labelKey, explKey]) => (
                            <View key={labelKey} style={styles.legendRow}>
                                <Text style={styles.legendLabel}>{LanguageUtil.getName(labelKey)}</Text>
                                <Text style={styles.legendText}>{LanguageUtil.getName(explKey)}</Text>
                            </View>
                        ))
                    }
                </View>

            </View>

            {/* ===== RIGHT PANEL: Ratschläge текст (свободно редактируем) ===== */}
            <View style={styles.rightPanel}>
                <Text style={styles.rightPanelTitle}>{LanguageUtil.getName('ratschlaege')}</Text>

                <View style={styles.ratschlagLangRow}>
                    {
                        [
                            { code: 'bg', label: 'БГ' },
                            { code: 'de', label: 'DE' },
                            { code: 'en', label: 'EN' }
                        ].map((lang) => (
                            <Pressable
                                key={lang.code}
                                style={[styles.ratschlagLangOption, ratschlagLanguage === lang.code && styles.ratschlagLangOptionActive]}
                                onPress={() => updateSpiro({ ratschlagLanguage: lang.code })}
                            >
                                <Text style={[styles.ratschlagLangText, ratschlagLanguage === lang.code && styles.ratschlagLangTextActive]}>
                                    {lang.label}
                                </Text>
                            </Pressable>
                        ))
                    }
                </View>

                <TextInput
                    style={styles.ratschlagTextArea}
                    multiline
                    value={ratschlagText}
                    onChangeText={(v) => updateSpiro({ ratschlagText: v })}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    row: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        gap: 16
    },

    mainColumn: {
        flex: 2.2,
        gap: 14
    },

    summaryCard: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#eef3f7',
        padding: 14,
        gap: 20
    },

    summaryLeft: {
        gap: 10,
        justifyContent: 'center'
    },

    summaryRight: {
        flex: 1,
        gap: 10
    },

    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },

    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        minWidth: 110
    },

    readonlyValue: {
        fontSize: 17,
        fontWeight: 'bold',
        minWidth: 46
    },

    smallInput: {
        borderWidth: 1,
        borderColor: '#999',
        width: 64,
        padding: 6,
        fontSize: 15,
        borderRadius: 4
    },

    editableGold: {
        backgroundColor: '#fff3cd'
    },

    editableGreen: {
        backgroundColor: '#d9f2d9'
    },

    unit: {
        fontSize: 13,
        color: '#555'
    },

    sportToggleRow: {
        flexDirection: 'row',
        gap: 28,
        marginBottom: 4
    },

    sportToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 4
    },

    sportToggleLabel: {
        fontSize: 15,
        fontWeight: '600'
    },

    checkboxGlyph: {
        fontSize: 28
    },

    zoneTable: {
        borderWidth: 1,
        borderColor: '#999'
    },

    zoneHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#cfe0ea'
    },

    zoneHeaderCell: {
        flex: 1,
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8
    },

    zoneRow: {
        flexDirection: 'row'
    },

    zoneLabelCell: {
        flex: 1.6,
        fontSize: 13,
        fontWeight: '600',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8
    },

    zoneValueCell: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8,
        backgroundColor: '#e3f2e3'
    },

    stageTable: {
        borderWidth: 1,
        borderColor: '#999'
    },

    stageHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#cfe0ea'
    },

    stageRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    stageCheckCell: {
        width: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        paddingVertical: 12
    },

    stageCell: {
        flex: 1,
        fontSize: 13,
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8
    },

    zeitAufteilungCell: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: 4
    },

    zeitAufteilungInput: {
        fontSize: 13,
        textAlign: 'center',
        minWidth: 44,
        padding: 4
    },

    zeitAufteilungSuffix: {
        fontSize: 13
    },

    vorlageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#eef3f7',
        padding: 12
    },

    vorlageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 4
    },

    vorlageLabel: {
        fontSize: 15,
        fontWeight: '600'
    },

    legend: {
        borderWidth: 1,
        borderColor: '#999',
        padding: 14,
        gap: 8
    },

    legendRow: {
        flexDirection: 'row',
        gap: 12
    },

    legendLabel: {
        width: 160,
        fontSize: 13,
        fontWeight: 'bold'
    },

    legendText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18
    },

    rightPanel: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#fdf6d8',
        padding: 14
    },

    rightPanelTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },

    ratschlagLangRow: {
        flexDirection: 'row',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#7c9fb3',
        borderRadius: 4,
        overflow: 'hidden',
        alignSelf: 'flex-start'
    },

    ratschlagLangOption: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#fff'
    },

    ratschlagLangOptionActive: {
        backgroundColor: '#f5c518'
    },

    ratschlagLangText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333'
    },

    ratschlagLangTextActive: {
        color: '#000'
    },

    ratschlagTextArea: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        textAlignVertical: 'top',
        minHeight: 560
    }

});
