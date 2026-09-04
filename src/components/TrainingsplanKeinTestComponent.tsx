// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-20 (Europe/Sofia) — DK: "Training – Gesundheit" модул. Първи
//   реален таб — "Kein Test" (5.21b_Training_Gesundheit_Kein_Test_
//   Grundeinstellung_EXPORT_2.pdf, 3 страници: Grundeinstellung/
//   Individuelle Planung/CODEX + 5.90CCCGESUNDHEITS_Training.pdf's
//   Entscheidungsbaum + 0.00 MAGMED Codex 04_2.pdf за точните формули).
//
//   Формулна верига (виж CODEX страницата в PDF-а, кодовете #23#/#25#/
//   #31#/#118#/#120#/#121#/#122#/#123#/#XZ#):
//     HFruhe (#23#) — measurement.heartraterest, ако е въведен, иначе
//       стандарт 70 S/min (Entscheidungsbaum: "HFruhe: Standardwert = 70").
//     HFmax (#25#) — measurement.expectedheartrate (220-Alter, вече
//       съществуващ getter, реизползван 1:1).
//     Watt max (#31#) — measurement.sollLeistungNorm (вече съществуващ
//       getter, ErgometrieUtil.getSollLeistungNorm по възраст — засега
//       опростена таблица, не официалната MAGMED таблица; известен, вече
//       флагнат дълг, не блокира тук).
//     km/h max (#120#) — TrainingsplanUtil.calculateSpeedFromWatt(Watt max)
//       (#KaW#).
//     GA1/GA2 Trainings-HF Fahrrad (#118#) — CodexUtil.
//       calculateKarvonenHeartRate(HFruhe, HFmax, intensität%), веднъж за
//       долната и веднъж за горната граница на всяка зона.
//     GA1/GA2 Laufen HF (#118+XZ#) — Fahrrad HF + глобалната #XZ# настройка
//       (Redux settingsSlice.xzCorrection).
//     GA1/GA2 Watt (#121#) — TrainingsplanUtil.calculateIntensityWatt(Watt
//       max, intensität%).
//     GA1/GA2 Laufen km/h (#122#) — TrainingsplanUtil.
//       calculateSpeedFromWatt(#121# Watt) (СЪЩАТА #KaW# формула, реизполз-
//       вана — Kein Test няма отделен Laufband тест, затова km/h идва
//       винаги от Watt чрез Näherungswert, точно както Entscheidungsbaum-ът
//       го описва: "Trainingsintensität min/km: Näherungswert vom Watt").
//     GA1/GA2 PACE (#123#) — CodexUtil.calculatePace(#122# km/h) (#MaK#).
//
//   ЗАБЕЛЕЖКА за DK: примерните числа в 5.21b мокъпа (напр. GA1 Watt
//   "85-105") не се пресъздават байт-по-байт от формулите тук — следвах
//   ДОСЛОВНО документираните формули в 0.00 MAGMED Codex 04_2.pdf (които
//   имат собствени, вътрешно последователни примери, напр. #129#
//   60%×250=150 ✓), не бегло въведените числа в 5.21b screenshot-а, които
//   изглеждат несъответстващи дори помежду си. Кажи, ако очакваш друго.
//
//   editMode ('grundeinstellung'|'individuell') съответства на 2-та вида
//   от мокъпа (страница 1 vs 2) — "Trainings-Woche GESTALTEN" бутонът
//   (виж TrainingsplanComponent.tsx) превключва между тях. В
//   'grundeinstellung' всичко е read-only (авто-изчислено); в
//   'individuell' HFruhe/HFmax/Watt max стават редактируеми override-и,
//   8-те стадия и Ratschläge стават свободно редактируеми (виж 5.90 PDF:
//   "In der freien Planung können alle Parameter in Gold gefärbten
//   Fenstern individuell verändert werden. Die geänderten Werte
//   überschreiben nicht die Grundeinstellung.").
//
// 2026-08-24 (Europe/Sofia) — DK забеляза, че Cycling/Laufen чекбоксовете
//   не се цъкат в 'grundeinstellung' режим (трябваше DESIGN training week
//   → individuell). Това беше несъзнателна непоследователност спрямо
//   "Hide unselected areas" (TrainingsplanComponent.tsx), който винаги е
//   кликаем независимо от editMode — двата чекбокса тук просто отбелязват
//   с какво спортува пациентът (не са override на изчислена стойност),
//   затова премахнах "isIndividuell &&" пазача от onPress — вече са
//   кликаеми и в двата режима, както hideUnselected.
// ============================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Switch } from 'react-native';
import { useSelector } from 'react-redux';
import LanguageUtil from '../utils/LanguageUtil';
import { CodexUtil } from '../utils/CodexUtil';
import { TrainingsplanUtil } from '../utils/TrainingsplanUtil';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';
import TitleWithInfoComponent from './TitleWithInfoComponent';
import { openPopup } from '../services/PopupService';
import {
    EMPTY_STAGES,
    KEIN_TEST_INTENSITY_RANGES,
    RATSCHLAEGE_VORLAGE_A,
    RATSCHLAEGE_VORLAGE_B,
    RATSCHLAEGE_VORLAGE_C
} from '../constants/trainingsplanKeinTestDefaults';

const VORLAGEN: any = {
    A: RATSCHLAEGE_VORLAGE_A,
    B: RATSCHLAEGE_VORLAGE_B,
    C: RATSCHLAEGE_VORLAGE_C
};

// 🔹 2026-08-21 (Claude) — DK: "искам това [обяснението, което ти дадох в
// чата] да ми бъде сложено като инфо бутон отстрани на всяка една
// таблица ... нека е на български [засега]". Реизползван е СЪЩИЯ вече
// съществуващ механизъм като другите инфо бутони в приложението
// (TitleWithInfoComponent + PopupService.openPopup — виж например
// TestMeasurementsComponent.tsx) — не нов компонент. Съдържанието засега е
// само на български (DK ще каже кога да добавим EN/DE версии на самите
// popup текстове — за разлика от Ratschläge текста вдясно, за него изрично
// поиска превключвател bg/de/en).
const INFO_SUMMARY_BG = {
    title: 'Основни стойности и тренировъчни зони',
    description:
        'Показва базовите физиологични стойности на пациента (пулс в покой и максимален, максимални ватове и скорост), '
        + 'изчислени автоматично от неговата възраст и пол — не се въвеждат ръчно тук. Долната таблица показва в какъв '
        + 'диапазон (пулс, ватове, темпо) трябва да тренира пациентът при по-лека (Здравен спорт/GA1) и по-усилена '
        + '(Свободно време спорт/GA2) интензивност.',
    formula:
        'HF max = 220 − Възраст\n'
        + 'Watt max = таблична норма по възраст и пол\n'
        + 'km/h max ≈ (0.06 × Watt max) + 2\n'
        + 'Тренировъчен пулс (Karvonen) = HF в покой + Интензитет% × (HF max − HF в покой)',
    fields: [
        'HF в покой = стойност от Измерванията на пациента, или стандартно 70 уд/мин, ако не е въведена.',
        'HF max = очаквана максимална сърдечна честота (220 минус възрастта на пациента).',
        'Watt max = очаквана нормална мощност според възрастта и пола на пациента.',
        'km/h max = приблизителна максимална скорост, изчислена от Watt max.',
        'Колоездене / Бягане (чекбоксовете) = отбележи с какво тренира пациентът — определя кои колони се виждат в таблицата.',
        'Здравен спорт (GA1) = по-лека интензивност, 50–60% от резерва на сърдечната честота.',
        'Свободно време спорт (GA2) = по-усилена интензивност, 60–70%.'
    ],
    source:
        'Стойностите се преизчисляват автоматично при всяка промяна на данните за пациента (възраст, пол, HF в покой). '
        + 'Стават редактируеми само в режим "Индивидуално планиране" (бутон "DESIGN training week").'
};

const INFO_STAGES_BG = {
    title: 'Тренировъчен план по седмици (8 етапа)',
    description:
        'Това е самият тренировъчен план, който се дава на пациента — прогресия през до 8 етапа с постепенно '
        + 'нарастващо натоварване. Таблицата тръгва празна — докторът я попълва ръчно, ред по ред, конкретно за ТОЗИ '
        + 'пациент (натисни "DESIGN training week" от лявото меню, за да отключиш редакция).',
    fields: [
        'WNTZ (минути) = обща нетна тренировъчна седмица — колко минути общо тренира пациентът седмично на този етап.',
        'Продължителност на сесия (минути) = колко минути трае всяка отделна тренировка.',
        'Сесии/седмица = колко пъти седмично тренира пациентът на този етап.',
        'Разпределение на времето (GA1/GA2) = какъв процент от времето е в по-лека (GA1) и какъв в по-усилена (GA2) зона.',
        'Тренировъчен блок (седмици) = колко седмици пациентът остава на този етап, преди да премине към следващия.',
        'Чекбоксът вляво на всеки ред показва дали етапът е активен/включен в плана.'
    ],
    source: 'Няма стойности "по подразбиране" — докторът решава сам колко етапа да ползва и какви числа да сложи, според конкретния пациент.'
};

export default function TrainingsplanKeinTestComponent({ measurement, callback }: any) {

    const xzCorrection = useSelector(
        (state: any) => state.settings?.xzCorrection
    ) ?? 10;

    const kt = measurement?.trainingsplanKeinTest ?? {};

    const editMode = kt.editMode ?? 'grundeinstellung';
    const isIndividuell = editMode === 'individuell';

    const radfahrenEnabled = kt.radfahrenEnabled ?? true;
    const laufenEnabled = kt.laufenEnabled ?? true;
    const hideUnselected = kt.hideUnselected ?? false;
    const automatikEnabled = kt.automatikEnabled ?? false;
    const ratschlagTemplate = kt.ratschlagTemplate === undefined ? 'A' : kt.ratschlagTemplate;
    // 🔹 DK: "текста в дясно Recommendations, да има опция да е на
    // български, немски и английски, първоначално да е на български" —
    // отделен избор ОТ глобалния LanguageUtil.language (който важи за
    // етикети/бутони из цялото приложение и няма 'bg' версия за всичко) —
    // пазим го в kt, за да оцелее презареждане на теста.
    const ratschlagLanguage = kt.ratschlagLanguage ?? 'bg';
    const stages = kt.stages ?? EMPTY_STAGES;

    // 🔹 базови (Grundeinstellung) стойности — виж formulaта в change log-а
    const hfruheBase = measurement?.heartraterest > 0 ? measurement.heartraterest : 70;
    const hfmaxBase = measurement?.expectedheartrate > 0 ? measurement.expectedheartrate : 0;
    const wattMaxBase = measurement?.sollLeistungNorm ?? 0;

    const hfruhe = (isIndividuell && kt.hfruheOverride != null) ? kt.hfruheOverride : hfruheBase;
    const hfmax = (isIndividuell && kt.hfmaxOverride != null) ? kt.hfmaxOverride : hfmaxBase;
    const wattMax = (isIndividuell && kt.wattMaxOverride != null) ? kt.wattMaxOverride : wattMaxBase;

    const kmhMax = TrainingsplanUtil.calculateSpeedFromWatt(wattMax) ?? 0;

    function updateKt(patch: any) {

        callback(
            new MDPatientMeasurements({
                ...measurement,
                trainingsplanKeinTest: {
                    ...kt,
                    ...patch
                }
            })
        );

    }

    function computeZone(fromPercent: number, toPercent: number) {

        // 🔹 2026-09-03 (Claude) — DK: за нов пациент без възраст/данни
        // hfmaxBase/wattMaxBase остават 0 (виж дефинициите по-горе — тук
        // 0, не null, е сентинелът за "няма данни"), а преди computeZone
        // все пак смяташе с тях и показваше измислени "0 - 0" диапазони
        // вместо ясен "Няма данни" placeholder.
        const emptyText = LanguageUtil.getName('test_progress_empty_text');

        let hfFahrrad = emptyText;
        let hfLaufen = emptyText;

        if (hfmax > 0) {

            const hfFahrradFrom = CodexUtil.calculateKarvonenHeartRate(hfruhe, hfmax, fromPercent) ?? 0;
            const hfFahrradTo = CodexUtil.calculateKarvonenHeartRate(hfruhe, hfmax, toPercent) ?? 0;

            hfFahrrad = `${hfFahrradFrom} - ${hfFahrradTo}`;
            hfLaufen = `${hfFahrradFrom + xzCorrection} - ${hfFahrradTo + xzCorrection}`;

        }

        let watt = emptyText;
        let pace = emptyText;

        if (wattMax > 0) {

            const wattFrom = TrainingsplanUtil.calculateIntensityWatt(wattMax, fromPercent) ?? 0;
            const wattTo = TrainingsplanUtil.calculateIntensityWatt(wattMax, toPercent) ?? 0;

            watt = `${wattFrom} - ${wattTo}`;

        }

        // 🔹 2026-09-04 (Claude) — DK потвърди (виж 5.21b мокъпа, "CODEX"
        // страница): min/km зоната е direct % от km/h max (#120#), НЕ
        // watt→скорост конверсия на вече-скалирания wattFrom/wattTo — това
        // произвеждаше грешни резултати (напр. ~08:23 вместо 10:00 за
        // Wattmax 171 при 50% GA1).
        if (kmhMax > 0) {

            const kmhFrom = TrainingsplanUtil.calculateIntensitySpeed(kmhMax, fromPercent) ?? 0;
            const kmhTo = TrainingsplanUtil.calculateIntensitySpeed(kmhMax, toPercent) ?? 0;

            const paceFrom = CodexUtil.calculatePace(kmhFrom) ?? '';
            const paceTo = CodexUtil.calculatePace(kmhTo) ?? '';

            pace = `${paceFrom} - ${paceTo}`;

        }

        return {
            hfFahrrad,
            hfLaufen,
            watt,
            pace
        };

    }

    const ga1 = computeZone(KEIN_TEST_INTENSITY_RANGES.ga1.from, KEIN_TEST_INTENSITY_RANGES.ga1.to);
    const ga2 = computeZone(KEIN_TEST_INTENSITY_RANGES.ga2.from, KEIN_TEST_INTENSITY_RANGES.ga2.to);

    const showRadfahren = radfahrenEnabled || !hideUnselected;
    const showLaufen = laufenEnabled || !hideUnselected;

    function toggleStageActive(stageIndex: number) {

        if (!isIndividuell) return;

        const updated = stages.map((s: any, i: number) =>
            i === stageIndex ? { ...s, active: !s.active } : s
        );

        updateKt({ stages: updated });

    }

    // 🔹 2026-08-21 (Claude) — DK: "на всичките полета отгоре, трябва да
    // им сложиш тикче селект ал/деселект ал" — master чекбокс в хедъра на
    // чекбокс-колоната: ако ВСИЧКИ 8 стадия са активни, показва ☑ и
    // цъкването деактивира всички наведнъж; иначе показва ☐ и цъкването
    // активира всички наведнъж (стандартно "select all" поведение).
    function toggleAllStages() {

        if (!isIndividuell) return;

        const allActive = stages.every((s: any) => s.active);

        const updated = stages.map((s: any) => ({ ...s, active: !allActive }));

        updateKt({ stages: updated });

    }

    function updateStageField(stageIndex: number, field: string, value: string) {

        const updated = stages.map((s: any, i: number) =>
            i === stageIndex ? { ...s, [field]: value } : s
        );

        updateKt({ stages: updated });

    }

    const ratschlagText = kt.ratschlagText != null
        ? kt.ratschlagText
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

                {/* ===== SUMMARY: HFruhe/HFmax + Radfahren/Laufen + Watt max/km-h max ===== */}
                <TitleWithInfoComponent
                    title={LanguageUtil.getName('basiswerte_trainingszonen_text')}
                    infoHandler={infoHandlerSummary}
                />

                <View style={styles.summaryCard}>

                    <View style={styles.summaryLeft}>

                        <View style={styles.fieldRow}>
                            <Text style={styles.fieldLabel}>{LanguageUtil.getName('hfruhe_text')}</Text>
                            {
                                isIndividuell
                                    ? (
                                        <TextInput
                                            style={[styles.smallInput, styles.editableGold]}
                                            keyboardType="numeric"
                                            value={String(hfruhe)}
                                            onChangeText={(v) => updateKt({ hfruheOverride: Number(v) || 0 })}
                                        />
                                    )
                                    : <Text style={styles.readonlyValue}>{hfruhe}</Text>
                            }
                            <Text style={styles.unit}>S/min</Text>
                        </View>

                        <View style={styles.fieldRow}>
                            <Text style={styles.fieldLabel}>{LanguageUtil.getName('hfmax_text')}</Text>
                            {
                                isIndividuell
                                    ? (
                                        <TextInput
                                            style={[styles.smallInput, styles.editableGold]}
                                            keyboardType="numeric"
                                            value={String(hfmax)}
                                            onChangeText={(v) => updateKt({ hfmaxOverride: Number(v) || 0 })}
                                        />
                                    )
                                    : <Text style={styles.readonlyValue}>{hfmax}</Text>
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
                                            onChangeText={(v) => updateKt({ wattMaxOverride: Number(v) || 0 })}
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
                                        onPress={() => updateKt({ radfahrenEnabled: !radfahrenEnabled })}
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
                                        onPress={() => updateKt({ laufenEnabled: !laufenEnabled })}
                                    >
                                        <Text style={styles.checkboxGlyph}>{laufenEnabled ? '☑' : '☐'}</Text>
                                        <Text style={styles.sportToggleLabel}>{LanguageUtil.getName('laufen_text')}</Text>
                                    </Pressable>
                                )
                            }
                        </View>

                        <View style={styles.zoneTable}>

                            <View style={styles.zoneHeaderRow}>
                                <Text style={styles.zoneHeaderLabelCell}>{LanguageUtil.getName('trainingsbereich_text')}</Text>
                                {showRadfahren && <Text style={styles.zoneHeaderCell}>S/min</Text>}
                                {showRadfahren && <Text style={styles.zoneHeaderCell}>Watt</Text>}
                                {showLaufen && <Text style={styles.zoneHeaderCell}>S/min</Text>}
                                {showLaufen && <Text style={styles.zoneHeaderCell}>min/km</Text>}
                            </View>

                            <View style={styles.zoneRow}>
                                <Text style={styles.zoneLabelCell}>
                                    {LanguageUtil.getName('gesundheitssport_text')} (GA1: {KEIN_TEST_INTENSITY_RANGES.ga1.from} - {KEIN_TEST_INTENSITY_RANGES.ga1.to})
                                </Text>
                                {showRadfahren && <Text style={styles.zoneValueCell}>{ga1.hfFahrrad}</Text>}
                                {showRadfahren && <Text style={styles.zoneValueCell}>{ga1.watt}</Text>}
                                {showLaufen && <Text style={styles.zoneValueCell}>{ga1.hfLaufen}</Text>}
                                {showLaufen && <Text style={styles.zoneValueCell}>{ga1.pace}</Text>}
                            </View>

                            <View style={styles.zoneRow}>
                                <Text style={styles.zoneLabelCell}>
                                    {LanguageUtil.getName('freizeitsport_text')} (GA2: {KEIN_TEST_INTENSITY_RANGES.ga2.from} - {KEIN_TEST_INTENSITY_RANGES.ga2.to})
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

                {/* 🔹 2026-09-03 (Claude) — DK: "полетата да не бъдат смачкани" (2-ри
                    случай) — виж идентичния changelog в
                    TrainingsplanErgometrieComponent.tsx: всеки ред тук е свой
                    отделен flex row, `stageCell` (flex:1, без minWidth) караше
                    header (дълги етикети) и редовете с празни клетки да вадят
                    различни, невзаимно подравнени ширини на колоните — празните
                    клетки изглеждаха "смачкани". Добавени общи `stageCol*`
                    minWidth-ове за header и за всеки ред. */}
                <View style={styles.stageTable}>

                    <View style={styles.stageHeaderRow}>
                        <Pressable style={styles.stageCheckCell} onPress={toggleAllStages}>
                            <Text style={styles.checkboxGlyph}>{stages.every((s: any) => s.active) ? '☑' : '☐'}</Text>
                        </Pressable>
                        <Text style={[styles.stageCell, styles.stageColStepen]}>{LanguageUtil.getName('stufe_text')}</Text>
                        <Text style={[styles.stageCell, styles.stageColWntz]}>{LanguageUtil.getName('wntz_minuten_text')}</Text>
                        <Text style={[styles.stageCell, styles.stageColDauer]}>{LanguageUtil.getName('dauer_te_minuten_text')}</Text>
                        <Text style={[styles.stageCell, styles.stageColSessions]}>{LanguageUtil.getName('te_woche_haeufigkeit_text')}</Text>
                        <Text style={[styles.stageCell, styles.stageColZeit]}>{LanguageUtil.getName('zeit_aufteilung_text')}</Text>
                        <Text style={[styles.stageCell, styles.stageColBlock]}>{LanguageUtil.getName('trainingsblock_wochen_text')}</Text>
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

                                <Text style={[styles.stageCell, styles.stageColStepen]}>{s.stage}.</Text>

                                {
                                    // 🔹 2026-08-21 — DK потвърди (по 5.90CCCGESUNDHEITS_Training.pdf:
                                    // "alle Parameter in Gold gefärbten Fenstern individuell
                                    // verändert werden") — не само Trainingsblock, а ВСИЧКИ
                                    // колони на етапа стават редактируеми в Individuelle Planung.
                                    isIndividuell
                                        ? (
                                            <TextInput
                                                style={[styles.stageCell, styles.stageColWntz, styles.editableGold]}
                                                keyboardType="numeric"
                                                value={String(s.wntz)}
                                                onChangeText={(v) => updateStageField(i, 'wntz', v)}
                                            />
                                        )
                                        : <Text style={[styles.stageCell, styles.stageColWntz]}>{s.wntz}</Text>
                                }

                                {
                                    isIndividuell
                                        ? (
                                            <TextInput
                                                style={[styles.stageCell, styles.stageColDauer, styles.editableGold]}
                                                value={String(s.dauerTe)}
                                                onChangeText={(v) => updateStageField(i, 'dauerTe', v)}
                                            />
                                        )
                                        : <Text style={[styles.stageCell, styles.stageColDauer]}>{s.dauerTe}</Text>
                                }

                                {
                                    isIndividuell
                                        ? (
                                            <TextInput
                                                style={[styles.stageCell, styles.stageColSessions, styles.editableGold]}
                                                value={String(s.teWoche)}
                                                onChangeText={(v) => updateStageField(i, 'teWoche', v)}
                                            />
                                        )
                                        : <Text style={[styles.stageCell, styles.stageColSessions]}>{s.teWoche}</Text>
                                }

                                {
                                    isIndividuell
                                        ? (
                                            <View style={[styles.stageCell, styles.stageColZeit, styles.editableGold, styles.zeitAufteilungCell]}>
                                                <TextInput
                                                    style={styles.zeitAufteilungInput}
                                                    value={String(s.zeitAufteilung)}
                                                    onChangeText={(v) => updateStageField(i, 'zeitAufteilung', v)}
                                                />
                                                <Text style={styles.zeitAufteilungSuffix}>GA1/GA2</Text>
                                            </View>
                                        )
                                        : <Text style={[styles.stageCell, styles.stageColZeit]}>{s.zeitAufteilung} GA1/GA2</Text>
                                }

                                {
                                    isIndividuell
                                        ? (
                                            <TextInput
                                                style={[styles.stageCell, styles.stageColBlock, styles.editableGold]}
                                                value={String(s.trainingsblock)}
                                                onChangeText={(v) => updateStageField(i, 'trainingsblock', v)}
                                            />
                                        )
                                        : <Text style={[styles.stageCell, styles.stageColBlock]}>{s.trainingsblock}</Text>
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
                                onPress={() => updateKt({
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

                {/* 🔹 DK: "текста в дясно Recommendations, да има опция да е
                    на български, немски и английски, първоначално да е на
                    български." — превключва само коя Vorlage-версия/език се
                    зарежда, докато няма ръчна редакция (ratschlagText ==
                    null) — виж коментара при `ratschlagLanguage` по-горе. */}
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
                                onPress={() => updateKt({ ratschlagLanguage: lang.code })}
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
                    onChangeText={(v) => updateKt({ ratschlagText: v })}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    // 🔹 2026-08-21 — DK: "не ми харесва, много е ситно всичко" — старите
    // размери (10-13px шрифт, 2-3px padding) правеха всичко нечетимо и
    // сбутано. Изцяло преработени размери по-долу, следвайки пропорциите
    // от 5.21b мокъпа (голяма, лесна за четене таблица) — самата ЛОГИКА/
    // wiring не са пипани, само CSS. Добавен е `flex:1, width:'100%'` тук
    // — липсваше преди, затова цялото съдържание се свиваше до ~половин
    // екран с празно място вдясно (RN Web View без flex/width не запълва
    // родителя).
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
        fontSize: 17,
        fontWeight: '600',
        minWidth: 110
    },

    readonlyValue: {
        fontSize: 20,
        fontWeight: 'bold',
        minWidth: 46
    },

    smallInput: {
        borderWidth: 1,
        borderColor: '#999',
        width: 64,
        padding: 6,
        fontSize: 18,
        borderRadius: 4
    },

    editableGold: {
        backgroundColor: '#fff3cd'
    },

    editableGreen: {
        backgroundColor: '#d9f2d9'
    },

    unit: {
        fontSize: 16,
        color: '#555'
    },

    sportToggleRow: {
        flexDirection: 'row',
        gap: 28,
        marginBottom: 4
    },

    // 🔹 2026-08-21 — DK: "чек боксовете ги направи по-големи, защото
    // много трудно се кликат" — по-голям glyph (19→28) + реален padding
    // около Pressable-а (преди нямаше никакъв — hit area беше буквално
    // само размера на текста), за да е много по-лесно да се уцели.
    sportToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 4
    },

    sportToggleLabel: {
        fontSize: 18,
        fontWeight: '600'
    },

    checkboxGlyph: {
        fontSize: 30
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
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8
    },

    // 🔹 2026-08-25 (Claude) — същата ширина (flex: 1.6) като zoneLabelCell,
    // за да се подравнят колоните на header реда с редовете под тях
    // (DK докладва че таблицата "Тренировъчна зона" изглежда разместена).
    zoneHeaderLabelCell: {
        flex: 1.6,
        fontSize: 16,
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
        fontSize: 16,
        fontWeight: '600',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8
    },

    zoneValueCell: {
        flex: 1,
        fontSize: 17,
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

    // 🔹 2026-09-03 (Claude) — DK: "полетата да не бъдат смачкани" — виж
    // идентичния changelog в TrainingsplanErgometrieComponent.tsx. Същият
    // checkboxGlyph (fontSize 30) + paddingVertical: 12 правеше реда на
    // 8-те степени много по-висок от WNTZ/Продължителност/Сесии/
    // Trainingsblock TextInput-ите, които увисваха насред празно
    // пространство. Намалена padding-а за изравнена височина на реда.
    stageCheckCell: {
        width: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        paddingVertical: 4
    },

    // 🔹 2026-09-03 (Claude) — DK потвърди след ребилд: НЕ ширината (вече
    // фиксната с stageCol*), а ВИСОЧИНАТА беше истинският проблем — celна с
    // празен текст (`{s.wntz}` когато е '' / undefined) пада до 0px реална
    // височина в браузъра (горна+долна рамка се сливат в една тънка линия),
    // докато съседна клетка с реално съдържание ("1.", "GA1/GA2") си пази
    // нормална височина — затова празните клетки изглеждаха "смачкани" до
    // линия, независимо от ширината. `minHeight` гарантира еднаква кутия.
    stageCell: {
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8,
        minHeight: 39
    },

    // 🔹 2026-09-03 (Claude) — виж changelog-а над <View style={styles.stageTable}>.
    stageColStepen: { minWidth: 50 },
    stageColWntz: { minWidth: 80 },
    stageColDauer: { minWidth: 150 },
    stageColSessions: { minWidth: 90 },
    stageColZeit: { minWidth: 130 },
    stageColBlock: { minWidth: 120 },

    // 🔹 Zeit Aufteilung колоната в individuell режим — редактируемо число
    // + фиксиран "GA1/GA2" суфикс до него (самото разпределение GA1/GA2
    // винаги е двойка зони, суфиксът не се редактира).
    zeitAufteilungCell: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: 4
    },

    zeitAufteilungInput: {
        fontSize: 16,
        textAlign: 'center',
        minWidth: 44,
        padding: 4
    },

    zeitAufteilungSuffix: {
        fontSize: 16
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
        fontSize: 18,
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
        fontSize: 16,
        fontWeight: 'bold'
    },

    legendText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 18
    },

    // 🔹 "най-десния компонент" за Ratschläge (DK) — по-широк, ясно
    // озаглавен панел, същия цвят/бордер конвенция като другите "кутии"
    // из приложението (виж actionBox в KoerperHaltungComponent.tsx).
    rightPanel: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#fdf6d8',
        padding: 14
    },

    rightPanelTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },

    // 🔹 2026-08-21 (Claude) — DK: "текста в дясно Recommendations, да има
    // опция да е на български, немски и английски, първоначално да е на
    // български." Малък 3-бутонен segmented switcher (БГ/DE/EN), същата
    // конструкция като genderToggleRow в HeaderComponent.tsx, но в жълтата
    // тема на дясното Ratschläge поле.
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
        fontSize: 17,
        fontWeight: '600',
        color: '#333'
    },

    ratschlagLangTextActive: {
        color: '#000'
    },

    ratschlagTextArea: {
        flex: 1,
        fontSize: 17,
        lineHeight: 20,
        textAlignVertical: 'top',
        minHeight: 560
    }

});
