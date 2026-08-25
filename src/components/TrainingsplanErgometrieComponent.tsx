// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-21 (Europe/Sofia) — DK: "сега следващите 3 таба ... ергометрия,
//   лактат ергометри, спиро ергометри. започни с ергометри." (следвайки
//   PDF-по-PDF плана — 5.24b_Training_Gesundheit_Ergometrie_Watt_
//   Grundeinstellung_EXPORT.pdf, 6 страници: Ergometrie Watt/km-h
//   Grundeinstellung + CODEX страници + Individuelle/Automatische
//   Planung).
//
//   DK потвърди 6-те точки да следват СЪЩИЯ модел като Kein Test таба
//   (TrainingsplanKeinTestComponent.tsx): UI, "Generate fake data" бутон,
//   инфо бутони, отделен обект за съхранение (measurement.
//   trainingsplanErgometrie, по аналогия на trainingsplanKeinTest),
//   бг/де/ен превключвател за Ratschläge, и Save бутон (виж
//   TrainingsplanComponent.tsx — Save/фейк данни бутоните вече са общи за
//   всички табове, кой обект пипат зависи от activeTab).
//
//   Основната обобщаваща (Basiswerte & Trainingszonen + 8-степенна
//   Trainings-Woche таблица + Ratschläge панел) секция е ПРАКТИЧЕСКИ
//   идентична на Kein Test таба — същите формули (HFruhe/HFmax/Watt max/
//   km-h max, Karvonen GA1/GA2 зони), СЪЩАТА 8-степенна таблица (5.24b
//   мокъпа показва абсолютно същите стойности като 5.21b — 30/60/90/.../
//   300 WNTZ и т.н.) и СЪЩИЯТ Ratschläge Vorlage A текст (проверих
//   дословно в PDF-а — идентичен на немски). Затова тук реизползваме
//   директно константите от trainingsplanKeinTestDefaults.js вместо да ги
//   дублираме — ако някога Ergometrie трябва да има различни стойности,
//   ще ги извадим в общ файл tогава.
//
//   НОВО спрямо Kein Test (5.24b, ляво меню): REHABILITATION /
//   GESUNDHEITSSPORT / FREIZEITSPORT — 3-late категория за интензитета на
//   плана (виж TrainingsplanComponent.tsx controlPanel — рендерът е там,
//   защото визуално е в общото ляво меню, но пише в
//   measurement.trainingsplanErgometrie.trainingskategorie). PDF-ът
//   показва точни % стойности САМО за GESUNDHEITSSPORT (GA1: 50-60, GA2:
//   60-70 — same като Kein Test). Rehabilitation/Freizeitsport нямат
//   собствени % диапазони в този конкретен PDF — засега и трите бутона
//   използват едни и същи (Gesundheitssport) диапазони, докато DK не
//   предостави съответните им PDF-и с точните стойности за другите две.
//
//   CODEX страницата (стр. 2) показва формулни номера (#23#/#24#/#32#/
//   #35#/#40#/#119#/#125#/#XZ#) без самите формули (тези са в отделния
//   "0.00 MAGMED Codex 04_2.pdf", не в този файл) — затова тук реизполз-
//   ваме ДОСЛОВНО същата формулна верига, която вече важи за Kein Test
//   (CodexUtil.calculateKarvonenHeartRate + xzCorrection за Laufen HF,
//   TrainingsplanUtil.calculateIntensityWatt/calculateSpeedFromWatt,
//   CodexUtil.calculatePace) — известен опростен участък, флагнат за DK.
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

// 🔹 2026-08-24 (Claude) — DK: "да сложи. и да видим после какво правим"
// (след като посочи, че Rehabilitation/Gesundheitssport/Freizeitsport дават
// едни и същи стойности). PDF-ът (5.24b) има точни % САМО за
// Gesundheitssport (GA1: 50-60 / GA2: 60-70 от HFR) — Rehabilitation и
// Freizeitsport нямат собствен мокъп. Тук слагаме ПРИБЛИЗИТЕЛНИ placeholder
// стойности (±10pp спрямо Gesundheitssport — по-нисък интензитет за
// Rehabilitation, по-висок за Freizeitsport), ясно флагнати като временни,
// докато DK предостави реалните диапазони.
const ERGOMETRIE_INTENSITY_RANGES_BY_KATEGORIE: any = {
    rehabilitation: { ga1: { from: 40, to: 50 }, ga2: { from: 50, to: 60 } },
    gesundheitssport: KEIN_TEST_INTENSITY_RANGES,
    freizeitsport: { ga1: { from: 60, to: 70 }, ga2: { from: 70, to: 80 } }
};

// 🔹 2026-08-21 (Claude) — само на български засега (виж същия коментар в
// TrainingsplanKeinTestComponent.tsx защо) — съдържанието е пренаписано за
// Ergometrie контекста (споменава конкретно избора Rehabilitation/
// Gesundheitssport/Freizeitsport от лявото меню).
const INFO_SUMMARY_BG = {
    title: 'Основни стойности и тренировъчни зони (Ергометрия)',
    description:
        'Показва базовите физиологични стойности на пациента (пулс в покой и максимален, максимални ватове и скорост), '
        + 'изчислени автоматично от неговата възраст и пол — не се въвеждат ръчно тук. Долната таблица показва в какъв '
        + 'диапазон (пулс, ватове, темпо) трябва да тренира пациентът при по-лека (GA1) и по-усилена (GA2) интензивност, '
        + 'на велоергометър (Radfahren) и/или бягаща пътека (Laufen).',
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
        'Rehabilitation / Gesundheitssport / Freizeitsport (ляво меню) = категория на плана — определя интензитета на зоните. '
        + 'В момента точни % стойности има само за Gesundheitssport (50–70% от резерва на сърдечната честота); '
        + 'Rehabilitation/Freizeitsport временно ползват същите стойности, докато не получим техните конкретни диапазони.'
    ],
    source:
        'Стойностите се преизчисляват автоматично при всяка промяна на данните за пациента (възраст, пол, HF в покой). '
        + 'Стават редактируеми само в режим "Индивидуално планиране" (бутон "DESIGN training week").'
};

const INFO_STAGES_BG = {
    title: 'Тренировъчен план по седмици (8 етапа) — Ергометрия',
    description:
        'Това е самият тренировъчен план за велоергометър/бягаща пътека — прогресия през 8 етапа с постепенно нарастващо '
        + 'натоварване. По подразбиране стойностите са стандартни за всички пациенти ("Grundeinstellung"); за да ги '
        + 'промениш индивидуално за този пациент, натисни "DESIGN training week" от лявото меню — редовете стават '
        + 'редактируеми.',
    fields: [
        'WNTZ (минути) = обща нетна тренировъчна седмица — колко минути общо тренира пациентът седмично на този етап.',
        'Продължителност на сесия (минути) = колко минути трае всяка отделна тренировка.',
        'Сесии/седмица = колко пъти седмично тренира пациентът на този етап.',
        'Разпределение на времето (GA1/GA2) = какъв процент от времето е в по-лека (GA1) и какъв в по-усилена (GA2) зона.',
        'Тренировъчен блок (седмици) = колко седмици пациентът остава на този етап, преди да премине към следващия.',
        'Чекбоксът вляво на всеки ред показва дали етапът е активен/включен в плана.'
    ],
    source: 'Стойностите по подразбиране следват стандартната прогресия от документацията MAGMED Codex (същите като Kein Test таба).'
};

export default function TrainingsplanErgometrieComponent({ measurement, callback }: any) {

    const xzCorrection = useSelector(
        (state: any) => state.settings?.xzCorrection
    ) ?? 10;

    const erg = measurement?.trainingsplanErgometrie ?? {};

    const editMode = erg.editMode ?? 'grundeinstellung';
    const isIndividuell = editMode === 'individuell';

    const radfahrenEnabled = erg.radfahrenEnabled ?? true;
    const laufenEnabled = erg.laufenEnabled ?? true;
    const hideUnselected = erg.hideUnselected ?? false;
    const ratschlagTemplate = erg.ratschlagTemplate === undefined ? 'A' : erg.ratschlagTemplate;
    const ratschlagLanguage = erg.ratschlagLanguage ?? 'bg';
    const stages = erg.stages ?? KEIN_TEST_DEFAULT_STAGES;

    // 🔹 2026-08-24 (Claude) — избраната категория (виж TrainingsplanComponent.tsx
    // controlPanel) определя кой GA1/GA2 диапазон се ползва — виж
    // ERGOMETRIE_INTENSITY_RANGES_BY_KATEGORIE по-горе за placeholder стойностите.
    const trainingskategorie = erg.trainingskategorie ?? 'gesundheitssport';
    const activeIntensityRanges = ERGOMETRIE_INTENSITY_RANGES_BY_KATEGORIE[trainingskategorie]
        ?? KEIN_TEST_INTENSITY_RANGES;

    const hfruheBase = measurement?.heartraterest > 0 ? measurement.heartraterest : 70;
    const hfmaxBase = measurement?.expectedheartrate > 0 ? measurement.expectedheartrate : 0;
    const wattMaxBase = measurement?.sollLeistungNorm ?? 0;

    const hfruhe = (isIndividuell && erg.hfruheOverride != null) ? erg.hfruheOverride : hfruheBase;
    const hfmax = (isIndividuell && erg.hfmaxOverride != null) ? erg.hfmaxOverride : hfmaxBase;
    const wattMax = (isIndividuell && erg.wattMaxOverride != null) ? erg.wattMaxOverride : wattMaxBase;

    const kmhMax = TrainingsplanUtil.calculateSpeedFromWatt(wattMax) ?? 0;

    function updateErg(patch: any) {

        callback(
            new MDPatientMeasurements({
                ...measurement,
                trainingsplanErgometrie: {
                    ...erg,
                    ...patch
                }
            })
        );

    }

    function computeZone(fromPercent: number, toPercent: number) {

        const hfFahrradFrom = CodexUtil.calculateKarvonenHeartRate(hfruhe, hfmax, fromPercent) ?? 0;
        const hfFahrradTo = CodexUtil.calculateKarvonenHeartRate(hfruhe, hfmax, toPercent) ?? 0;

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

        updateErg({ stages: updated });

    }

    // 🔹 2026-08-21 (Claude) — DK: "на всичките полета отгоре, трябва да
    // им сложиш тикче селект ал/деселект ал" — master чекбокс в хедъра на
    // чекбокс-колоната (виж същия коментар в TrainingsplanKeinTestComponent.tsx).
    function toggleAllStages() {

        if (!isIndividuell) return;

        const allActive = stages.every((s: any) => s.active);

        const updated = stages.map((s: any) => ({ ...s, active: !allActive }));

        updateErg({ stages: updated });

    }

    function updateStageField(stageIndex: number, field: string, value: string) {

        const updated = stages.map((s: any, i: number) =>
            i === stageIndex ? { ...s, [field]: value } : s
        );

        updateErg({ stages: updated });

    }

    const ratschlagText = erg.ratschlagText != null
        ? erg.ratschlagText
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
                                            onChangeText={(v) => updateErg({ hfruheOverride: Number(v) || 0 })}
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
                                            onChangeText={(v) => updateErg({ hfmaxOverride: Number(v) || 0 })}
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
                                            onChangeText={(v) => updateErg({ wattMaxOverride: Number(v) || 0 })}
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
                                        onPress={() => updateErg({ radfahrenEnabled: !radfahrenEnabled })}
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
                                        onPress={() => updateErg({ laufenEnabled: !laufenEnabled })}
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
                                onPress={() => updateErg({
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
                                onPress={() => updateErg({ ratschlagLanguage: lang.code })}
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
                    onChangeText={(v) => updateErg({ ratschlagText: v })}
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
