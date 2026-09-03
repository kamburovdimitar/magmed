// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-28 (Claude) — DK: "искам да направим един хубав принт, по целият
//   документ, така, че когато някой принтира, да има всичките данни, от
//   измерванията" + follow-up: "full report / only available measurements"
//   настройка отгоре. Заменя счупения PrintTestPanel.jsx (грешен title key
//   `koerpermasse_und_vitalparameter_text` — не съществуваше — и строеше
//   MDPatientMeasurements от суровия `measurements` МАСИВ вместо от активния
//   тест `.data`, откъдето всички стойности излизаха 0) с истински, пълен
//   доклад за ТЕКУЩО отворения тест (measurement = Page8.tsx-ovия `draft`,
//   вече е правилната MDPatientMeasurements инстанция на активния тест).
//
//   Обхваща 7 секции (виж одобрения мокъп
//   https://claude.ai/code/artifact/93e10ff7-6e68-4cf9-ae3a-1a301451eb10):
//     1) Körpermaße & Vitalparameter (същите редове като старият
//        PrintTestPanel, вече с правилния title key `koerpermassen_
//        vitalparametern` + реалните стойности)
//     2) Ergometrie — SOLL/IST Watt (Fahrrad) или Max Speed/Pace (Laufband)
//        + Karvonen HF-зони 45-95%
//     3) Muskel-Funktion — KRAFT/DEHNBARKEIT/BEWEGLICHKEIT (реизползва
//        MUSCLE_LIST/KRAFT_RATING_COLORS от constants/
//        muskelFunktionKraftPunkte.js)
//     4) Körper-Haltung — всичките 6 категории (реизползва *_SECTIONS от
//        constants/koerperHaltungSections.js, същата декларация като
//        BeuterlungTable.tsx/KoerperHaltungAuswertungComponent.tsx, за да
//        няма разминаване в label/key-овете)
//     5) Laktat-Ergometrie — стъпкова таблица + IAS/IANS (чете вече
//        изчислените `measurement.ergometryReports`, СЪЩИЯТ източник, който
//        ErgometryResultsComponent/LactateThresholdComponent/VO2MaxComponent
//        показват — не преизчислява отделно, за да няма разминаване) +
//        LactateChartComponent (същия компонент като Page11.tsx)
//     6) Spiro-Ergometrie — VO2max/VT1/VT2 (същата логика като
//        VO2MaxComponent.tsx) + %VO2max HF-зони
//     7) Trainingsplan — обобщение на 4-те таба (Kein Test/Ergometrie/
//        Laktat-Ergometrie/Spiro-Ergometrie), GA1/GA2 зони + активните
//        стъпки от прогресията (СЪЩАТА computeZone формула като
//        PrintReportComponent.tsx/TrainingsplanKeinTestComponent.tsx и
//        сестрите му — умишлено дублирана тук по същата причина като там:
//        компонентите не export-ват computeZone-а си).
//
//   FULL REPORT / ONLY AVAILABLE MEASUREMENTS (DK, 2026-08-28): toolbar-ът
//   има превключвател с 2 режима:
//     - "full"      → показват се ВСИЧКИ секции/редове; непопълнените се
//                     маркират като "N/A" (не се крият).
//     - "available" → показва се само това, което РЕАЛНО е измерено/
//                     записано; ред/подсекция/цяла секция без данни
//                     напълно се скрива (не само N/A).
//   Всяка секция/под-таблица си има собствена "hasData" проверка (виж
//   локалните isXxxAvailable по-долу) — режимът просто решава дали да
//   филтрира по нея или не, самите изчисления са едни и същи.
//
//   Print CSS механизъм — същия установен подход като PrintReportComponent.
//   tsx/Page8.tsx (printInterpretation): #magmed-app-root (сложен в
//   Page10/Page8 контейнера) се скрива при печат, #print-full-report-area
//   остава в нормален document flow (не absolute), за да се разпагинира
//   правилно. Модалът portal-ва извън #magmed-app-root автоматично
//   (react-native-web Modal).
//
//   Trainingsplan секцията: "available" режим показва само табовете, които
//   потребителят реално е отворил/запазил (measurement[storageKey] има поне
//   едно поле); "full" режим показва и 4-те, изчислени от default
//   константите, ако табът никога не е отварян (същия fallback принцип,
//   който PrintReportComponent.tsx вече ползва за activeTab-а си). Watt/HF
//   стойностите тук идват от реалните измерени данни на пациента
//   (heartraterest/heartratemax/sollLeistungNorm), не от твърдо закодирани
//   placeholder-и — за разлика от PrintReportComponent.tsx (виж неговия
//   коментар за Page11.tsx-паритет), тук нямаме нужда от такъв паритет.
// ============================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import LanguageUtil from '../utils/LanguageUtil';
import { CodexUtil } from '../utils/CodexUtil';
import { TrainingsplanUtil } from '../utils/TrainingsplanUtil';
import { ErgometryUtil } from '../utils/ErgometrieUtil';
import { ERGOMETRY_MODELS } from '../constants/ergometryModels';
import { KEIN_TEST_INTENSITY_RANGES, KEIN_TEST_DEFAULT_STAGES } from '../constants/trainingsplanKeinTestDefaults';
import { ERGOMETRIE_INTENSITY_RANGES_BY_KATEGORIE } from './TrainingsplanErgometrieComponent';
import { LAKTAT_INTENSITY_RANGES_BY_KATEGORIE } from './TrainingsplanLaktatErgometrieComponent';
import { SPIRO_INTENSITY_RANGES_BY_KATEGORIE } from './TrainingsplanSpiroErgometrieComponent';
import LactateChartComponent from './LactateChartComponent';
import { MUSCLE_LIST, KRAFT_RATING_COLORS } from '../constants/muskelFunktionKraftPunkte';
import {
    KOPF_SECTIONS,
    WIRBELSAEULE_SECTIONS,
    SCHULTER_SECTIONS,
    BECKEN_SECTIONS,
    KNIE_SECTIONS,
    FUSS_SECTIONS
} from '../constants/koerperHaltungSections';

const SEVERITY_COLORS = ['#ef5350', '#ffcc80', '#fff59d', '#a5d6a7'];
const SEVERITY_LABEL_KEYS = ['schwer', 'mittelschwer', 'leicht', 'normal'];

const POSTURE_CATEGORIES = [
    { titleKey: 'kopf', sections: KOPF_SECTIONS, fieldKey: 'koerperHaltungKopf' },
    { titleKey: 'wirbelsaeule', sections: WIRBELSAEULE_SECTIONS, fieldKey: 'koerperHaltungWirbelsaeule' },
    { titleKey: 'schulter', sections: SCHULTER_SECTIONS, fieldKey: 'koerperHaltungSchulter' },
    { titleKey: 'becken', sections: BECKEN_SECTIONS, fieldKey: 'koerperHaltungBecken' },
    { titleKey: 'knie', sections: KNIE_SECTIONS, fieldKey: 'koerperHaltungKnie' },
    { titleKey: 'fuss', sections: FUSS_SECTIONS, fieldKey: 'koerperHaltungFuss' }
];

const MUSKEL_QUALITIES = [
    { key: 'muskelFunktionKraft', labelKey: 'kraft_text' },
    { key: 'muskelFunktionDehnbarkeit', labelKey: 'dehnbarkeit_text' },
    { key: 'muskelFunktionBeweglichkeit', labelKey: 'beweglichkeit_text' }
];

const STORAGE_KEY_BY_TAB: any = {
    keinTest: 'trainingsplanKeinTest',
    ergometrie: 'trainingsplanErgometrie',
    laktatErgometrie: 'trainingsplanLaktatErgometrie',
    spiroErgometrie: 'trainingsplanSpiroErgometrie'
};

const TAB_LABEL_KEY: any = {
    keinTest: 'kein_test_text',
    ergometrie: 'training_ergometrie_text',
    laktatErgometrie: 'training_laktat_ergometrie_text',
    spiroErgometrie: 'training_spiro_ergometrie_text'
};

const INTENSITY_RANGES_BY_TAB: any = {
    ergometrie: ERGOMETRIE_INTENSITY_RANGES_BY_KATEGORIE,
    laktatErgometrie: LAKTAT_INTENSITY_RANGES_BY_KATEGORIE,
    spiroErgometrie: SPIRO_INTENSITY_RANGES_BY_KATEGORIE
};

const TRAINING_TABS = ['keinTest', 'ergometrie', 'laktatErgometrie', 'spiroErgometrie'];

// 🔹 2026-08-30 (Claude) — DK: "сложи бутони до другите, така че да може
// да принтираме, всяка от страници с енейбъл/дизейбъл" — освен пълен
// доклад/само наличните (mode-а по-долу), сега потребителят може и да
// включва/изключва отделни раздели за принт (checkbox чипове), плюс
// бързи "Само Х" бутони (за измервания/тренировка/лактатна крива и
// останалите), които solo-ират точно този раздел с едно кликване. Двата
// механизма са независими: `mode` решава КАКВО се показва в един enabled
// раздел (всичко с N/A, или само реално измереното), `enabledSections`
// решава КОИ раздели изобщо се печатат.
const SECTION_DEFS = [
    { key: 'vitals', labelKey: 'koerpermassen_vitalparametern' },
    { key: 'ergometrie', labelKey: 'ergometrie' },
    { key: 'muskel', labelKey: 'muskel_funktion' },
    { key: 'haltung', labelKey: 'koerper_haltung' },
    { key: 'laktat', labelKey: 'training_laktat_ergometrie_text' },
    { key: 'spiro', labelKey: 'training_spiro_ergometrie_text' },
    { key: 'training', labelKey: 'trainingsplan_text' }
];

const ALL_SECTIONS_ENABLED = SECTION_DEFS.reduce((acc: any, s) => {
    acc[s.key] = true;
    return acc;
}, {});

export default function PrintFullReportComponent({
    measurement,
    patient,
    activeTest,
    onClose
}: any) {

    const [mode, setMode] = useState<'full' | 'available'>('full');

    const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(ALL_SECTIONS_ENABLED);

    function toggleSection(key: string) {
        setEnabledSections(prev => ({ ...prev, [key]: !prev[key] }));
    }

    // 🔹 "Само X" бутоните — solo-ират точно този раздел (изключват
    // всички останали с едно кликване).
    function soloSection(key: string) {
        const next: Record<string, boolean> = {};
        SECTION_DEFS.forEach(s => { next[s.key] = (s.key === key); });
        setEnabledSections(next);
    }

    function selectAllSections() {
        setEnabledSections({ ...ALL_SECTIONS_ENABLED });
    }

    const xzCorrection = useSelector(
        (state: any) => state.settings?.xzCorrection
    ) ?? 10;

    // 🔹 print-only CSS — same established pattern as PrintReportComponent.tsx.
    useEffect(() => {

        if (typeof document === 'undefined') return;

        const styleEl = document.createElement('style');
        styleEl.id = 'magmed-print-full-report-style';

        styleEl.innerHTML = `
            @media print {
                html, body {
                    height: auto !important;
                    overflow: visible !important;
                }
                #magmed-app-root,
                #print-full-report-toolbar {
                    display: none !important;
                }
                #print-full-report-area,
                #print-full-report-area * {
                    height: auto !important;
                    max-height: none !important;
                    overflow: visible !important;
                }
            }
        `;

        document.head.appendChild(styleEl);

        return () => {
            styleEl.remove();
        };

    }, []);

    function doPrint() {
        if (typeof window !== 'undefined') {
            window.print();
        }
    }

    const isAvailableMode = mode === 'available';

    // ---------- HELPERS ----------

    function ValueOrNA({ empty, children }: any) {
        if (empty) {
            return <Text style={styles.valueNA}>N/A</Text>;
        }
        return <Text style={styles.value}>{children}</Text>;
    }

    // ---------- 1) KÖRPERMASSE & VITALPARAMETER ----------

    const vitalsRows = [
        {
            key: 'height',
            label: LanguageUtil.getName('koerpergroesse_text'),
            empty: !measurement?.heightcm,
            value: `${measurement?.heightcm} cm`
        },
        {
            key: 'weight',
            label: LanguageUtil.getName('koerpergewicht_text'),
            empty: !measurement?.weightkg,
            value: `${measurement?.weightkg} kg`
        },
        {
            key: 'bmi',
            label: LanguageUtil.getName('body_mass_index_text'),
            empty: !measurement?.heightcm || !measurement?.weightkg,
            value: measurement?.bmi?.toFixed?.(1)
        },
        {
            key: 'waist',
            label: LanguageUtil.getName('taillenumfang_text'),
            empty: !measurement?.waistcm,
            value: `${measurement?.waistcm} cm`
        },
        {
            key: 'hip',
            label: LanguageUtil.getName('hueftumfang_text'),
            empty: !measurement?.hipcm,
            value: `${measurement?.hipcm} cm`
        },
        {
            key: 'whr',
            label: LanguageUtil.getName('whr_index_text'),
            empty: !measurement?.waistcm || !measurement?.hipcm,
            value: measurement?.whrindex?.toFixed?.(2)
        },
        {
            key: 'bodyfat',
            label: LanguageUtil.getName('koerperfettanteil_text'),
            empty: !measurement?.bodyfatpercent,
            value: `${measurement?.bodyfatpercent} %`
        },
        {
            key: 'fatmass',
            label: LanguageUtil.getName('fettmasse_text'),
            empty: !measurement?.bodyfatpercent || !measurement?.weightkg,
            value: `${measurement?.fatmasskg?.toFixed?.(1)} kg`
        },
        {
            key: 'bprest',
            label: LanguageUtil.getName('blutdruck_ruhe_text'),
            empty: !measurement?.bloodpressurerestsystolic,
            value: `${measurement?.bloodpressurerestsystolic}/${measurement?.bloodpressurerestdiastolic} mmHg`
        },
        {
            key: 'bpmax',
            label: LanguageUtil.getName('blutdruck_max_text'),
            empty: !measurement?.bloodpressuremaxsystolic,
            value: `${measurement?.bloodpressuremaxsystolic}/${measurement?.bloodpressuremaxdiastolic} mmHg`
        },
        {
            key: 'hrrest',
            label: LanguageUtil.getName('herzfrequenz_ruhe_text'),
            empty: !measurement?.heartraterest,
            value: `${measurement?.heartraterest} bpm`
        },
        {
            key: 'hrmax',
            label: LanguageUtil.getName('herzfrequenz_max_text'),
            empty: !measurement?.heartratemax,
            value: `${measurement?.heartratemax} bpm`
        },
        {
            key: 'hrexpected',
            label: LanguageUtil.getName('durchschnittlicher_erwartungswert_text'),
            empty: !measurement?.expectedheartrate,
            value: `${measurement?.expectedheartrate} bpm`
        }
    ];

    const visibleVitalsRows = isAvailableMode
        ? vitalsRows.filter(r => !r.empty)
        : vitalsRows;

    const showVitalsSection = enabledSections.vitals && (!isAvailableMode || visibleVitalsRows.length > 0);

    // ---------- 2) ERGOMETRIE ----------

    const isTreadmill = measurement?.isTreadmill;

    const wattRows = [
        { key: 'sollWatt', label: 'SOLL Watt', empty: !measurement?.sollLeistungNorm, value: `${measurement?.sollWatt} W` },
        { key: 'istWatt', label: 'IST Watt', empty: !measurement?.istLeistungMax, value: `${measurement?.istWatt} W` },
        { key: 'sollWattKg', label: 'SOLL Watt/kg', empty: !measurement?.sollLeistungProKg, value: `${measurement?.sollWattKg}` },
        { key: 'istWattKg', label: 'IST Watt/kg', empty: !measurement?.istLeistungMax, value: `${measurement?.istWattKg}` },
        { key: 'istPercent', label: '% SOLL', empty: !measurement?.istLeistungMax, value: `${measurement?.istPercent} %` }
    ];

    const speedRows = [
        { key: 'maxspeed', label: 'Max Speed', empty: !measurement?.maxspeed, value: `${measurement?.maxspeed} km/h` },
        { key: 'pace', label: 'Pace', empty: !measurement?.maxspeed, value: `${measurement?.minperkm} min/km` }
    ];

    const ergoDataRows = isTreadmill ? speedRows : wattRows;
    const visibleErgoDataRows = isAvailableMode ? ergoDataRows.filter(r => !r.empty) : ergoDataRows;
    const showErgoDataBlock = !isAvailableMode || visibleErgoDataRows.length > 0;

    const hasHRData = !!(measurement?.heartraterest && measurement?.heartratemax);
    const karvonenZones = (measurement?.heartRateZones ?? []).filter((z: any) => z.percent <= 95);
    const showKarvonenBlock = !isAvailableMode || hasHRData;

    const showErgometrieSection = enabledSections.ergometrie && (showErgoDataBlock || showKarvonenBlock);

    // ---------- 3) MUSKEL-FUNKTION ----------

    function muscleQualityRows(fieldKey: string) {
        return MUSCLE_LIST.map((m: any) => {
            const sides = m.sides ?? ['r', 'l'];
            const entry = measurement?.[fieldKey]?.[m.key] ?? {};
            const hasAny = sides.some((s: string) => entry[s] != null);
            return { muscle: m, sides, entry, hasAny };
        });
    }

    const muskelBlocks = MUSKEL_QUALITIES.map(q => {
        const rows = muscleQualityRows(q.key);
        const visibleRows = isAvailableMode ? rows.filter(r => r.hasAny) : rows;
        return { quality: q, visibleRows };
    }).filter(b => !isAvailableMode || b.visibleRows.length > 0);

    const showMuskelSection = enabledSections.muskel && muskelBlocks.length > 0;

    // ---------- 4) KÖRPER-HALTUNG ----------

    const postureBlocks = POSTURE_CATEGORIES.map(category => {

        const value = (measurement as any)?.[category.fieldKey] ?? {};
        const rows: { label: string; colIndex: number | null }[] = [];

        category.sections.forEach((section: any) => {
            section.rows.forEach((r: any) => {
                const colIndex = value[r.key];
                rows.push({
                    label: LanguageUtil.getName(r.labelKey),
                    colIndex: colIndex != null ? colIndex : null
                });
            });
        });

        const visibleRows = isAvailableMode ? rows.filter(r => r.colIndex != null) : rows;

        return { category, visibleRows };

    }).filter(b => !isAvailableMode || b.visibleRows.length > 0);

    const showPostureSection = enabledSections.haltung && postureBlocks.length > 0;

    // ---------- 5) LAKTAT-ERGOMETRIE & 6) SPIRO-ERGOMETRIE ----------
    // 🔹 reads the already-computed `measurement.ergometryReports` (kept in
    // sync by ErgometryUtil.validateAllModels every time a stage row is
    // edited on TestComponent5 — same source ErgometryResultsComponent/
    // LactateThresholdComponent/VO2MaxComponent already display) instead of
    // recomputing the models here, so this can never disagree with what the
    // rest of the app shows for this test.

    const ergometrySelectedModel = measurement?.ergometry?.model || ERGOMETRY_MODELS.DICKHUTH;

    const hasLactateData = !!(
        measurement?.ergometry?.data &&
        measurement.ergometry.data.some((r: any) => Number(r.lactate) > 0)
    );

    const ergometryReport = hasLactateData
        ? ErgometryUtil.getReportByModel(measurement?.ergometryReports, ergometrySelectedModel)?.result
        : null;

    const showLaktatSection = enabledSections.laktat && (!isAvailableMode || hasLactateData);

    const firstVO2 = ErgometryUtil.calculateVO2(ergometryReport?.IASPoint, measurement);
    const secondVO2 = ErgometryUtil.calculateVO2(ergometryReport?.IANSPoint);
    const firstVO2Kg = ErgometryUtil.calculateVO2Kg(ergometryReport?.IASPoint, measurement?.weightkg);
    const secondVO2Kg = ErgometryUtil.calculateVO2Kg(ergometryReport?.IANSPoint, measurement?.weightkg);

    const showSpiroSection = enabledSections.spiro && (!isAvailableMode || hasLactateData);
    const vo2Zones = (measurement?.heartRateZones ?? []).filter((z: any) => z.percent <= 95);

    // ---------- 7) TRAININGSPLAN ----------

    function computeZone(hfruhe: number, hfmax: number, wattMax: number, fromPercent: number, toPercent: number) {

        const hfFahrradFrom = CodexUtil.calculateKarvonenHeartRate(hfruhe, hfmax, fromPercent) ?? 0;
        const hfFahrradTo = CodexUtil.calculateKarvonenHeartRate(hfruhe, hfmax, toPercent) ?? 0;

        const hfLaufenFrom = hfFahrradFrom + xzCorrection;
        const hfLaufenTo = hfFahrradTo + xzCorrection;

        const wattFrom = TrainingsplanUtil.calculateIntensityWatt(wattMax, fromPercent) ?? 0;
        const wattTo = TrainingsplanUtil.calculateIntensityWatt(wattMax, toPercent) ?? 0;

        return {
            hfFahrrad: `${hfFahrradFrom} - ${hfFahrradTo}`,
            hfLaufen: `${hfLaufenFrom} - ${hfLaufenTo}`,
            watt: `${wattFrom} - ${wattTo}`
        };

    }

    const trainingBlocks = TRAINING_TABS.map(tabKey => {

        const kt = (measurement as any)?.[STORAGE_KEY_BY_TAB[tabKey]] ?? {};
        const configured = kt && Object.keys(kt).length > 0;

        if (isAvailableMode && !configured) return null;

        const isIndividuell = kt.editMode === 'individuell';
        const trainingskategorie = kt.trainingskategorie ?? 'gesundheitssport';

        const activeIntensityRanges =
            tabKey === 'keinTest'
                ? KEIN_TEST_INTENSITY_RANGES
                : (INTENSITY_RANGES_BY_TAB[tabKey]?.[trainingskategorie] ?? KEIN_TEST_INTENSITY_RANGES);

        const hfruheBase = measurement?.heartraterest > 0 ? measurement.heartraterest : 70;
        const hfmaxBase = measurement?.expectedheartrate > 0 ? measurement.expectedheartrate : 0;
        const wattMaxBase = measurement?.sollLeistungNorm ?? 0;

        const hfruhe = (isIndividuell && kt.hfruheOverride != null) ? kt.hfruheOverride : hfruheBase;
        const hfmax = (isIndividuell && kt.hfmaxOverride != null) ? kt.hfmaxOverride : hfmaxBase;
        const wattMax = (isIndividuell && kt.wattMaxOverride != null) ? kt.wattMaxOverride : wattMaxBase;

        const ga1 = computeZone(hfruhe, hfmax, wattMax, activeIntensityRanges.ga1.from, activeIntensityRanges.ga1.to);
        const ga2 = computeZone(hfruhe, hfmax, wattMax, activeIntensityRanges.ga2.from, activeIntensityRanges.ga2.to);

        const stages = kt.stages ?? KEIN_TEST_DEFAULT_STAGES;
        const activeStages = stages.filter((s: any) => s.active);

        return { tabKey, configured, activeIntensityRanges, ga1, ga2, activeStages };

    }).filter(Boolean) as any[];

    const showTrainingSection = enabledSections.training && trainingBlocks.length > 0;

    // ---------- HEADER ----------

    const patientName = [patient?.title, patient?.firstname, patient?.lastname]
        .filter(Boolean)
        .join(' ');

    const generatedOn = new Date().toLocaleDateString('bg-BG');

    return (

        <Modal
            visible={true}
            animationType="fade"
            transparent={false}
            onRequestClose={onClose}
        >

            <View style={styles.modalContainer}>

                <View style={styles.toolbar} nativeID="print-full-report-toolbar">

                    <View style={styles.toolbarTopRow}>

                        <Text style={styles.toolbarTitle}>
                            {LanguageUtil.getName('print_full_report_title_text')}
                        </Text>

                        <View style={styles.modeSwitch}>

                            <Pressable
                                style={[styles.modeButton, mode === 'full' && styles.modeButtonActive]}
                                onPress={() => setMode('full')}
                            >
                                <Text style={[styles.modeButtonText, mode === 'full' && styles.modeButtonTextActive]}>
                                    {LanguageUtil.getName('print_full_report_mode_full_text')}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[styles.modeButton, mode === 'available' && styles.modeButtonActive]}
                                onPress={() => setMode('available')}
                            >
                                <Text style={[styles.modeButtonText, mode === 'available' && styles.modeButtonTextActive]}>
                                    {LanguageUtil.getName('print_full_report_mode_available_text')}
                                </Text>
                            </Pressable>

                        </View>

                        <View style={styles.toolbarButtons}>

                            <Pressable style={styles.toolbarButton} onPress={doPrint}>
                                <Text style={styles.toolbarButtonText}>
                                    {LanguageUtil.getName('nav_drucken_text')}
                                </Text>
                            </Pressable>

                            <Pressable style={styles.toolbarButton} onPress={onClose}>
                                <Text style={styles.toolbarButtonText}>
                                    {LanguageUtil.getName('schliessen')}
                                </Text>
                            </Pressable>

                        </View>

                    </View>

                    {/* 🔹 2026-08-30 (Claude) — DK: "бутони до другите ... с
                        енейбъл/дизейбъл" за всеки раздел, важи и под "Пълен
                        доклад", и под "Само наличните измервания" (двата
                        механизма са независими, виж коментара при
                        SECTION_DEFS по-горе). */}
                    <View style={styles.sectionTogglesRow}>

                        <Text style={styles.sectionTogglesLabel}>
                            {LanguageUtil.getName('print_full_report_sections_label_text')}:
                        </Text>

                        {SECTION_DEFS.map(s => (
                            <Pressable
                                key={s.key}
                                style={[styles.sectionChip, enabledSections[s.key] && styles.sectionChipActive]}
                                onPress={() => toggleSection(s.key)}
                            >
                                <Text style={[styles.sectionChipText, enabledSections[s.key] && styles.sectionChipTextActive]}>
                                    {enabledSections[s.key] ? '☑ ' : '☐ '}{LanguageUtil.getName(s.labelKey)}
                                </Text>
                            </Pressable>
                        ))}

                    </View>

                    {/* 🔹 бързи "Само Х" бутони — solo-ират точно 1 раздел
                        (DK изрично поиска: "само измервания"/"само
                        тренировка"/"само лактатна крива" + аналогично за
                        останалите менюта). */}
                    <View style={styles.sectionPresetsRow}>

                        {SECTION_DEFS.map(s => (
                            <Pressable
                                key={s.key}
                                style={styles.presetButton}
                                onPress={() => soloSection(s.key)}
                            >
                                <Text style={styles.presetButtonText}>
                                    {LanguageUtil.getName('print_full_report_only_text')} {LanguageUtil.getName(s.labelKey)}
                                </Text>
                            </Pressable>
                        ))}

                        <Pressable style={[styles.presetButton, styles.presetButtonAll]} onPress={selectAllSections}>
                            <Text style={styles.presetButtonText}>
                                {LanguageUtil.getName('print_full_report_select_all_text')}
                            </Text>
                        </Pressable>

                    </View>

                </View>

                <ScrollView style={styles.scroll}>

                    <View nativeID="print-full-report-area" style={styles.printArea}>

                        <Text style={styles.reportTitle}>
                            {LanguageUtil.getName('print_full_report_title_text')}
                        </Text>

                        <View style={styles.patientHeader}>
                            <Text style={styles.patientName}>{patientName || '—'}</Text>
                            <Text style={styles.patientMeta}>
                                {LanguageUtil.getName('patientid_text')}: {patient?.patientid || '—'}
                            </Text>
                            <Text style={styles.patientMeta}>
                                {LanguageUtil.getName('geburtsdatum')}: {patient?.birthdate || '—'}
                            </Text>
                            <Text style={styles.patientMeta}>
                                {LanguageUtil.getName('test_text')}: {activeTest?.name || '—'}
                            </Text>
                            <Text style={styles.patientMeta}>
                                {LanguageUtil.getName('print_report_generated_on_text')}: {generatedOn}
                            </Text>
                        </View>

                        {/* ===== 1) KÖRPERMASSE & VITALPARAMETER ===== */}

                        {showVitalsSection && (
                            <>
                                <Text style={styles.sectionTitle}>
                                    {LanguageUtil.getName('koerpermassen_vitalparametern')}
                                </Text>

                                <View style={styles.kvTable}>
                                    {visibleVitalsRows.map(r => (
                                        <View key={r.key} style={styles.kvRow}>
                                            <Text style={styles.kvLabel}>{r.label}</Text>
                                            <ValueOrNA empty={r.empty}>{r.value}</ValueOrNA>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}

                        {/* ===== 2) ERGOMETRIE ===== */}

                        {showErgometrieSection && (
                            <>
                                <Text style={styles.sectionTitle}>
                                    {LanguageUtil.getName('ergometrie')}
                                </Text>

                                {showErgoDataBlock && (
                                    <View style={styles.kvTable}>
                                        {visibleErgoDataRows.map(r => (
                                            <View key={r.key} style={styles.kvRow}>
                                                <Text style={styles.kvLabel}>{r.label}</Text>
                                                <ValueOrNA empty={r.empty}>{r.value}</ValueOrNA>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {showKarvonenBlock && (
                                    <>
                                        <Text style={styles.subTitle}>
                                            {LanguageUtil.getName('herzfrequenzzonen_karvonen_text')}
                                        </Text>

                                        {
                                            hasHRData ? (
                                                <View style={styles.zoneTable}>
                                                    <View style={styles.zoneHeaderRow}>
                                                        <Text style={styles.zoneHeaderLabelCell}>%HRR</Text>
                                                        <Text style={styles.zoneHeaderCell}>bpm</Text>
                                                    </View>
                                                    {karvonenZones.map((z: any) => (
                                                        <View key={z.percent} style={styles.zoneRow}>
                                                            <Text style={styles.zoneLabelCell}>{z.percent}%</Text>
                                                            <Text style={styles.zoneValueCell}>{z.bpm}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            ) : (
                                                <Text style={styles.valueNA}>N/A</Text>
                                            )
                                        }
                                    </>
                                )}
                            </>
                        )}

                        {/* ===== 3) MUSKEL-FUNKTION ===== */}

                        {showMuskelSection && (
                            <>
                                <Text style={styles.sectionTitle}>
                                    {LanguageUtil.getName('muskel_funktion')}
                                </Text>

                                {muskelBlocks.map(b => (
                                    <View key={b.quality.key} style={{ marginBottom: 14 }}>

                                        <Text style={styles.subTitle}>
                                            {LanguageUtil.getName(b.quality.labelKey)}
                                        </Text>

                                        <View style={styles.muscleTable}>

                                            <View style={styles.muscleHeaderRow}>
                                                <Text style={styles.muscleHeaderLabelCell}>{LanguageUtil.getName('muskel_funktion')}</Text>
                                                <Text style={styles.muscleHeaderCell}>R</Text>
                                                <Text style={styles.muscleHeaderCell}>L</Text>
                                            </View>

                                            {b.visibleRows.map((r: any) => (
                                                <View key={r.muscle.key} style={styles.muscleRow}>
                                                    <Text style={styles.muscleLabelCell}>
                                                        {LanguageUtil.getName(r.muscle.labelKey)}
                                                    </Text>
                                                    {r.sides.includes('c') ? (
                                                        <>
                                                            <RatingCell value={r.entry.c} />
                                                            <Text style={styles.muscleValueDash}>—</Text>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RatingCell value={r.entry.r} />
                                                            <RatingCell value={r.entry.l} />
                                                        </>
                                                    )}
                                                </View>
                                            ))}

                                        </View>

                                    </View>
                                ))}
                            </>
                        )}

                        {/* ===== 4) KÖRPER-HALTUNG ===== */}

                        {showPostureSection && (
                            <>
                                <Text style={styles.sectionTitle}>
                                    {LanguageUtil.getName('koerper_haltung')}
                                </Text>

                                {postureBlocks.map(b => (
                                    <View key={b.category.titleKey} style={styles.categoryBlock}>

                                        <Text style={styles.categoryTitle}>
                                            {LanguageUtil.getName(b.category.titleKey)}
                                        </Text>

                                        {b.visibleRows.map((f, i) => (
                                            <View key={i} style={styles.findingRow}>
                                                <Text style={styles.findingLabel} numberOfLines={1}>
                                                    {f.label}
                                                </Text>
                                                {f.colIndex != null ? (
                                                    <View style={[styles.findingBadge, { backgroundColor: SEVERITY_COLORS[f.colIndex] }]}>
                                                        <Text style={styles.findingBadgeText}>
                                                            {LanguageUtil.getName(SEVERITY_LABEL_KEYS[f.colIndex])}
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <Text style={styles.valueNA}>N/A</Text>
                                                )}
                                            </View>
                                        ))}

                                    </View>
                                ))}
                            </>
                        )}

                        {/* ===== 5) LAKTAT-ERGOMETRIE ===== */}

                        {showLaktatSection && (
                            <>
                                <Text style={styles.sectionTitle}>
                                    {LanguageUtil.getName('training_laktat_ergometrie_text')}
                                </Text>

                                {
                                    hasLactateData ? (
                                        <>
                                            <View style={styles.stageTable}>
                                                <View style={styles.stageHeaderRow}>
                                                    <Text style={styles.stageCell}>{LanguageUtil.getName('stufe_text')}</Text>
                                                    <Text style={styles.stageCell}>{LanguageUtil.getName('belastung_text')}</Text>
                                                    <Text style={styles.stageCell}>{LanguageUtil.getName('print_report_heart_rate_text')}</Text>
                                                    <Text style={styles.stageCell}>{LanguageUtil.getName('print_report_lactate_mmol_text')}</Text>
                                                </View>
                                                {measurement.ergometry.data.map((row: any, i: number) => (
                                                    <View key={i} style={styles.stageRow}>
                                                        <Text style={styles.stageCell}>{row.stage}</Text>
                                                        <Text style={styles.stageCell}>{row.load}</Text>
                                                        <Text style={styles.stageCell}>{row.hf}</Text>
                                                        <Text style={styles.stageCell}>{row.lactate}</Text>
                                                    </View>
                                                ))}
                                            </View>

                                            <LactateChartComponent
                                                data={measurement.ergometry.data}
                                                result={ergometryReport}
                                                showThresholdLines={true}
                                                showThresholdLabels={false}
                                                showHeartRateCurve={true}
                                                showTrainingZones={false}
                                            />

                                            <View style={styles.thresholdTable}>
                                                <View style={styles.thresholdHeaderRow}>
                                                    <Text style={styles.thresholdLabelCell}> </Text>
                                                    <Text style={styles.thresholdHeaderCell}>{LanguageUtil.getName('belastung_text')} (Watt)</Text>
                                                    <Text style={styles.thresholdHeaderCell}>{LanguageUtil.getName('print_report_heart_rate_text')}</Text>
                                                    <Text style={styles.thresholdHeaderCell}>{LanguageUtil.getName('print_report_lactate_mmol_text')}</Text>
                                                </View>
                                                <View style={styles.thresholdRow}>
                                                    <Text style={styles.thresholdLabelCell}>{LanguageUtil.getName('print_report_ias_text')}</Text>
                                                    <Text style={styles.thresholdValueCell}>{ergometryReport?.IASPoint?.load?.toFixed?.(0) ?? '—'}</Text>
                                                    <Text style={styles.thresholdValueCell}>{ergometryReport?.IASPoint?.hf?.toFixed?.(0) ?? '—'}</Text>
                                                    <Text style={styles.thresholdValueCell}>{ergometryReport?.IAS?.toFixed?.(2) ?? '—'}</Text>
                                                </View>
                                                <View style={styles.thresholdRow}>
                                                    <Text style={styles.thresholdLabelCell}>{LanguageUtil.getName('print_report_ians_text')}</Text>
                                                    <Text style={styles.thresholdValueCell}>{ergometryReport?.IANSPoint?.load?.toFixed?.(0) ?? '—'}</Text>
                                                    <Text style={styles.thresholdValueCell}>{ergometryReport?.IANSPoint?.hf?.toFixed?.(0) ?? '—'}</Text>
                                                    <Text style={styles.thresholdValueCell}>{ergometryReport?.IANS?.toFixed?.(2) ?? '—'}</Text>
                                                </View>
                                            </View>
                                        </>
                                    ) : (
                                        <Text style={styles.valueNA}>N/A — {LanguageUtil.getName('print_report_no_lactate_data_text')}</Text>
                                    )
                                }
                            </>
                        )}

                        {/* ===== 6) SPIRO-ERGOMETRIE ===== */}

                        {showSpiroSection && (
                            <>
                                <Text style={styles.sectionTitle}>
                                    {LanguageUtil.getName('training_spiro_ergometrie_text')}
                                </Text>

                                {
                                    hasLactateData ? (
                                        <>
                                            <View style={styles.vo2Table}>
                                                <View style={styles.vo2HeaderRow}>
                                                    <Text style={styles.vo2HeaderLabelCell}> </Text>
                                                    <Text style={styles.vo2HeaderCell}>VO₂max</Text>
                                                    <Text style={styles.vo2HeaderCell}>ml/kg/min</Text>
                                                    <Text style={styles.vo2HeaderCell}>{LanguageUtil.getName('power_text')}</Text>
                                                    <Text style={styles.vo2HeaderCell}>HF</Text>
                                                </View>
                                                <View style={styles.vo2Row}>
                                                    <Text style={styles.vo2LabelCell}>{LanguageUtil.getName('erste_schwelle_text')}</Text>
                                                    <Text style={styles.vo2ValueCell}>{firstVO2 ?? '—'}</Text>
                                                    <Text style={styles.vo2ValueCell}>{firstVO2Kg ?? '—'}</Text>
                                                    <Text style={styles.vo2ValueCell}>{ergometryReport?.IASPoint?.load ?? '—'}</Text>
                                                    <Text style={styles.vo2ValueCell}>{ergometryReport?.IASPoint?.hf ?? '—'}</Text>
                                                </View>
                                                <View style={styles.vo2Row}>
                                                    <Text style={styles.vo2LabelCell}>{LanguageUtil.getName('zweite_schwelle_text')}</Text>
                                                    <Text style={styles.vo2ValueCell}>{secondVO2 ?? '—'}</Text>
                                                    <Text style={styles.vo2ValueCell}>{secondVO2Kg ?? '—'}</Text>
                                                    <Text style={styles.vo2ValueCell}>{ergometryReport?.IANSPoint?.load ?? '—'}</Text>
                                                    <Text style={styles.vo2ValueCell}>{ergometryReport?.IANSPoint?.hf ?? '—'}</Text>
                                                </View>
                                            </View>

                                            <Text style={styles.subTitle}>
                                                {LanguageUtil.getName('herzfrequenzzonen_vo2max_text')}
                                            </Text>

                                            <View style={styles.zoneTable}>
                                                <View style={styles.zoneHeaderRow}>
                                                    <Text style={styles.zoneHeaderLabelCell}>%VO₂max</Text>
                                                    <Text style={styles.zoneHeaderCell}>bpm</Text>
                                                </View>
                                                {vo2Zones.map((z: any) => (
                                                    <View key={z.percent} style={styles.zoneRow}>
                                                        <Text style={styles.zoneLabelCell}>{z.percent}%</Text>
                                                        <Text style={styles.zoneValueCell}>{z.bpm}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </>
                                    ) : (
                                        <Text style={styles.valueNA}>N/A — {LanguageUtil.getName('print_report_no_lactate_data_text')}</Text>
                                    )
                                }
                            </>
                        )}

                        {/* ===== 7) TRAININGSPLAN ===== */}

                        {showTrainingSection && (
                            <>
                                <Text style={styles.sectionTitle}>
                                    {LanguageUtil.getName('trainingsplan_text')}
                                </Text>

                                {trainingBlocks.map(b => (
                                    <View key={b.tabKey} style={{ marginBottom: 16 }}>

                                        <Text style={styles.subTitle}>
                                            {LanguageUtil.getName(TAB_LABEL_KEY[b.tabKey])}
                                        </Text>

                                        <View style={styles.zoneTable}>
                                            <View style={styles.zoneHeaderRow}>
                                                <Text style={styles.zoneHeaderLabelCell}>{LanguageUtil.getName('trainingsbereich_text')}</Text>
                                                <Text style={styles.zoneHeaderCell}>HF (Fahrrad)</Text>
                                                <Text style={styles.zoneHeaderCell}>HF (Laufen)</Text>
                                                <Text style={styles.zoneHeaderCell}>Watt</Text>
                                            </View>
                                            <View style={styles.zoneRow}>
                                                <Text style={styles.zoneLabelCell}>
                                                    {LanguageUtil.getName('gesundheitssport_text')} (GA1: {b.activeIntensityRanges.ga1.from}-{b.activeIntensityRanges.ga1.to}%)
                                                </Text>
                                                <Text style={styles.zoneValueCell}>{b.ga1.hfFahrrad}</Text>
                                                <Text style={styles.zoneValueCell}>{b.ga1.hfLaufen}</Text>
                                                <Text style={styles.zoneValueCell}>{b.ga1.watt}</Text>
                                            </View>
                                            <View style={styles.zoneRow}>
                                                <Text style={styles.zoneLabelCell}>
                                                    {LanguageUtil.getName('freizeitsport_text')} (GA2: {b.activeIntensityRanges.ga2.from}-{b.activeIntensityRanges.ga2.to}%)
                                                </Text>
                                                <Text style={styles.zoneValueCell}>{b.ga2.hfFahrrad}</Text>
                                                <Text style={styles.zoneValueCell}>{b.ga2.hfLaufen}</Text>
                                                <Text style={styles.zoneValueCell}>{b.ga2.watt}</Text>
                                            </View>
                                        </View>

                                        {
                                            b.activeStages.length > 0 ? (
                                                <View style={[styles.stageTable, { marginTop: 8 }]}>
                                                    <View style={styles.stageHeaderRow}>
                                                        <Text style={styles.stageCell}>{LanguageUtil.getName('stufe_text')}</Text>
                                                        <Text style={styles.stageCell}>{LanguageUtil.getName('wntz_minuten_text')}</Text>
                                                        <Text style={styles.stageCell}>{LanguageUtil.getName('dauer_te_minuten_text')}</Text>
                                                        <Text style={styles.stageCell}>{LanguageUtil.getName('te_woche_haeufigkeit_text')}</Text>
                                                        <Text style={styles.stageCell}>{LanguageUtil.getName('trainingsblock_wochen_text')}</Text>
                                                    </View>
                                                    {b.activeStages.map((s: any, i: number) => (
                                                        <View key={s.stage ?? i} style={styles.stageRow}>
                                                            <Text style={styles.stageCell}>{s.stage}.</Text>
                                                            <Text style={styles.stageCell}>{s.wntz}</Text>
                                                            <Text style={styles.stageCell}>{s.dauerTe}</Text>
                                                            <Text style={styles.stageCell}>{s.teWoche}</Text>
                                                            <Text style={styles.stageCell}>{s.trainingsblock}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            ) : (
                                                <Text style={styles.valueNA}>N/A</Text>
                                            )
                                        }

                                    </View>
                                ))}
                            </>
                        )}

                    </View>

                </ScrollView>

            </View>

        </Modal>

    );

}

function RatingCell({ value }: { value: number | null | undefined }) {

    if (value == null) {
        return <Text style={styles.muscleValueEmpty}>N/A</Text>;
    }

    const color = (KRAFT_RATING_COLORS as any)[value] || '#eee';

    return (
        <View style={[styles.muscleValueFilled, { backgroundColor: color }]}>
            <Text style={styles.muscleValueText}>{value}</Text>
        </View>
    );

}

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        height: '100%',
        backgroundColor: '#fff'
    },

    toolbar: {
        padding: 14,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        gap: 10
    },

    toolbarTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        flexWrap: 'wrap'
    },

    toolbarTitle: {
        fontSize: 18,
        fontWeight: '700'
    },

    // 🔹 2026-08-30 (Claude) — раздел enable/disable чипове (виж
    // SECTION_DEFS/enabledSections в компонента).
    sectionTogglesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6
    },

    sectionTogglesLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
        marginRight: 4
    },

    sectionChip: {
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 14,
        paddingVertical: 5,
        paddingHorizontal: 12,
        backgroundColor: '#f5f8fa'
    },

    sectionChipActive: {
        backgroundColor: '#e3f2e3',
        borderColor: '#2e9e4f'
    },

    sectionChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999'
    },

    sectionChipTextActive: {
        color: '#1b5e20'
    },

    sectionPresetsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6
    },

    presetButton: {
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fafafa'
    },

    presetButtonAll: {
        borderColor: '#2f6fed',
        backgroundColor: '#eaf1ff'
    },

    presetButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#444'
    },

    modeSwitch: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#7c9fb3',
        borderRadius: 6,
        overflow: 'hidden'
    },

    modeButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: '#f5f8fa'
    },

    modeButtonActive: {
        backgroundColor: '#2f6fed'
    },

    modeButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333'
    },

    modeButtonTextActive: {
        color: '#fff'
    },

    toolbarButtons: {
        flexDirection: 'row',
        gap: 10
    },

    toolbarButton: {
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#f5f8fa',
        paddingVertical: 10,
        paddingHorizontal: 18
    },

    toolbarButtonText: {
        fontSize: 15,
        fontWeight: '600'
    },

    scroll: {
        flex: 1
    },

    printArea: {
        padding: 24,
        maxWidth: 900
    },

    reportTitle: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16
    },

    patientHeader: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 12
    },

    patientName: {
        fontSize: 19,
        fontWeight: '700',
        marginBottom: 4
    },

    patientMeta: {
        fontSize: 14,
        color: '#444'
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
        marginTop: 22,
        marginBottom: 10
    },

    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 6
    },

    valueNA: {
        fontSize: 13,
        fontStyle: 'italic',
        color: '#999'
    },

    value: {
        fontSize: 14,
        fontWeight: '600'
    },

    kvTable: {
        borderWidth: 1,
        borderColor: '#999'
    },

    kvRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        borderColor: '#ddd'
    },

    kvLabel: {
        fontSize: 14,
        flex: 1
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
        padding: 6
    },

    zoneHeaderLabelCell: {
        flex: 1.6,
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6
    },

    zoneRow: {
        flexDirection: 'row'
    },

    zoneLabelCell: {
        flex: 1.6,
        fontSize: 12,
        fontWeight: '600',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6
    },

    zoneValueCell: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6,
        backgroundColor: '#e3f2e3'
    },

    muscleTable: {
        borderWidth: 1,
        borderColor: '#999'
    },

    muscleHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#e8f5e9'
    },

    muscleHeaderLabelCell: {
        flex: 3,
        fontSize: 12,
        fontWeight: 'bold',
        borderWidth: 0.5,
        borderColor: '#c8d6c0',
        padding: 6
    },

    muscleHeaderCell: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#c8d6c0',
        padding: 6
    },

    muscleRow: {
        flexDirection: 'row',
        alignItems: 'stretch'
    },

    muscleLabelCell: {
        flex: 3,
        fontSize: 12,
        borderWidth: 0.5,
        borderColor: '#c8d6c0',
        padding: 6
    },

    muscleValueFilled: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#c8d6c0'
    },

    muscleValueEmpty: {
        flex: 1,
        fontSize: 11,
        fontStyle: 'italic',
        color: '#999',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderWidth: 0.5,
        borderColor: '#c8d6c0',
        padding: 6
    },

    muscleValueDash: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#bbb',
        borderWidth: 0.5,
        borderColor: '#c8d6c0',
        padding: 6
    },

    muscleValueText: {
        fontSize: 12,
        fontWeight: '700'
    },

    categoryBlock: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#c8d6c0',
        borderRadius: 6,
        padding: 8,
        backgroundColor: '#fafafa'
    },

    categoryTitle: {
        fontWeight: 'bold',
        marginBottom: 6
    },

    findingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 3
    },

    findingLabel: {
        flex: 1,
        fontSize: 13
    },

    findingBadge: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)'
    },

    findingBadgeText: {
        fontSize: 11,
        fontWeight: '600'
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
        flexDirection: 'row'
    },

    stageCell: {
        flex: 1,
        fontSize: 12,
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6
    },

    thresholdTable: {
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#999',
        maxWidth: 500
    },

    thresholdHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#cfe0ea'
    },

    thresholdHeaderCell: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6
    },

    thresholdRow: {
        flexDirection: 'row'
    },

    thresholdLabelCell: {
        flex: 1.4,
        fontSize: 12,
        fontWeight: '600',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6
    },

    thresholdValueCell: {
        flex: 1,
        fontSize: 12,
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6,
        backgroundColor: '#e3f2e3'
    },

    vo2Table: {
        borderWidth: 1,
        borderColor: '#999'
    },

    vo2HeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#cfe0ea'
    },

    vo2HeaderLabelCell: {
        flex: 1.4,
        fontSize: 12,
        fontWeight: 'bold',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6
    },

    vo2HeaderCell: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6
    },

    vo2Row: {
        flexDirection: 'row'
    },

    vo2LabelCell: {
        flex: 1.4,
        fontSize: 12,
        fontWeight: '600',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6
    },

    vo2ValueCell: {
        flex: 1,
        fontSize: 12,
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 6,
        backgroundColor: '#e3f2e3'
    }

});
