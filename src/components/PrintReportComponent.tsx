// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-26 (Claude) — DK: "нека направим принт страница с текущите и
//   налични данни от трейнинг и лактатните криви и след това ще ти кажа,
//   как ще продължим" — ПЪРВА версия на комбиниран принт доклад:
//     1) Тренировъчни зони (GA1/GA2) + активните стъпки от 8-степенната
//        прогресия — за ТЕКУЩО отворения таб на Training страницата
//        (TrainingsplanComponent.tsx подава activeTab/measurement/patient).
//        Изчисленията са СЪЩИТЕ формули като в TrainingsplanKeinTest/
//        Ergometrie/LaktatErgometrie/SpiroErgometrieComponent.tsx (виж
//        computeZone по-долу) — умишлено дублирани тук вместо импортирани
//        от компонентите (те не exportват computeZone-а си), но
//        intensity-range константите по категория СА export-нати и се
//        импортират оттам, за да няма разминаване в самите прагови стойности.
//     2) Лактатна крива (LactateChartComponent, същия компонент като на
//        Page11.tsx) + прагова таблица (IAS/IANS) — от measurement.ergometry
//        (споделен обект между Page11 и целия останал апп). Изчислителната
//        логика (кой Rechenverfahren модел → коя ErgometryModelsUtil
//        функция) е копие на dispatch-а от Page11.tsx save() (виж
//        computeErgometryResult по-долу) — само READ, нищо не пише в Redux.
//   Print CSS механизъм — същия установен подход като Page8.tsx
//   (printInterpretation): #magmed-app-root (цялата Training страница,
//   nativeID сложен в Page10.tsx) се скрива с display:none при печат,
//   а самият report (#print-report-area) остава в нормален document flow
//   (не absolute), за да се разпагинира правилно на няколко страници.
//   Модалът portal-ва извън #magmed-app-root (react-native-web Modal), така
//   че не се самоскрива.
//
//   ЗАБЕЛЕЖКА за DK: това е ПЪРВА чернова — показва зоните+стъпките само
//   за таба, който е активен в момента на натискане на бутона (не и
//   останалите 3 таба едновременно), и лактатната крива е ЕДНА обща
//   (measurement.ergometry не е разделен по таб). Кажи какво да променя.
// ============================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import LanguageUtil from '../utils/LanguageUtil';
import { CodexUtil } from '../utils/CodexUtil';
import { TrainingsplanUtil } from '../utils/TrainingsplanUtil';
import { ErgometryModelsUtil } from '../utils/ErgometryModelsUtil';
import { ERGOMETRY_MODELS } from '../constants/ergometryModels';
import { KEIN_TEST_INTENSITY_RANGES, KEIN_TEST_DEFAULT_STAGES } from '../constants/trainingsplanKeinTestDefaults';
import { ERGOMETRIE_INTENSITY_RANGES_BY_KATEGORIE } from './TrainingsplanErgometrieComponent';
import { LAKTAT_INTENSITY_RANGES_BY_KATEGORIE } from './TrainingsplanLaktatErgometrieComponent';
import { SPIRO_INTENSITY_RANGES_BY_KATEGORIE } from './TrainingsplanSpiroErgometrieComponent';
import LactateChartComponent from './LactateChartComponent';

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

// 🔹 keinTest няма собствена "по категория" таблица (винаги GA1: 50-60 /
// GA2: 60-70, виж TrainingsplanKeinTestComponent.tsx) — само другите 3 таба.
const INTENSITY_RANGES_BY_TAB: any = {
    ergometrie: ERGOMETRIE_INTENSITY_RANGES_BY_KATEGORIE,
    laktatErgometrie: LAKTAT_INTENSITY_RANGES_BY_KATEGORIE,
    spiroErgometrie: SPIRO_INTENSITY_RANGES_BY_KATEGORIE
};

// 🔹 копие на изчислителния dispatch от Page11.tsx save() (виж промяна log-а
// по-горе защо не е импортирано) — READ-ONLY, само за принт прегледа.
function computeErgometryResult(ergometry: any) {

    if (!ergometry?.data?.length) return null;

    const rows = ergometry.data;
    const model = ergometry.model || ERGOMETRY_MODELS.DICKHUTH;
    const type = ergometry.type || 'bike';

    let result: any = null;

    if (model === ERGOMETRY_MODELS.DICKHUTH) result = ErgometryModelsUtil.calculateDickhuth(rows);
    if (model === ERGOMETRY_MODELS.FREIBURG) result = ErgometryModelsUtil.calculateFreiburg(rows);
    if (model === ERGOMETRY_MODELS.LINEAR) result = ErgometryModelsUtil.calculateLinear(rows);
    if (model === ERGOMETRY_MODELS.LTP) result = ErgometryModelsUtil.calculateLTP(rows);
    if (model === ERGOMETRY_MODELS.KEUL) result = ErgometryModelsUtil.calculateKeul(rows, type);
    if (model === ERGOMETRY_MODELS.KEUL_LEGACY) result = ErgometryModelsUtil.calculateMaxSlopeMethodKeulLegacy(rows);

    if (!result) return null;

    result.model = model;

    // 🔹 same placeholder hfMax/hfRest as Page11.tsx save() — real
    // patient hfrest/hfmax биха дошли от measurement, но Page11.tsx също
    // хардкодва тези 2 стойности тук (виж коментара там), затова не
    // отклоняваме принт прегледа от реалния изглед в Page11.
    const hfMax = 190;
    const hfRest = 60;
    const maxLoad = rows[rows.length - 1]?.load || 0;

    if (result.IASPoint) {
        result.IASPoint.hfPercent = ErgometryModelsUtil.calculateHFPercent(result.IASPoint.hf, hfMax);
        result.IASPoint.pmaxPercent = ErgometryModelsUtil.calculatePmaxPercent(result.IASPoint.load, maxLoad);
        result.IASPoint.hrrPercent = ErgometryModelsUtil.calculateHRRPercent(result.IASPoint.hf, hfRest, hfMax);
    }

    if (result.IANSPoint) {
        result.IANSPoint.hfPercent = ErgometryModelsUtil.calculateHFPercent(result.IANSPoint.hf, hfMax);
        result.IANSPoint.pmaxPercent = ErgometryModelsUtil.calculatePmaxPercent(result.IANSPoint.load, maxLoad);
        result.IANSPoint.hrrPercent = ErgometryModelsUtil.calculateHRRPercent(result.IANSPoint.hf, hfRest, hfMax);
    }

    return result;

}

export default function PrintReportComponent({
    measurement,
    patient,
    activeTab,
    // 🔹 2026-08-26 (Claude) — DK: "печат трябва да имаме на всяка
    // страница, която показва даден компонент — тренировка, измервания,
    // лактатна крива." Page10.tsx (Training) показва двете секции;
    // Page11.tsx (Laktatkurve) показва само лактатната (activeTab е null
    // там — няма trainingsplan таб контекст).
    showTrainingSection = true,
    showLactateSection = true,
    onClose
}: any) {

    const xzCorrection = useSelector(
        (state: any) => state.settings?.xzCorrection
    ) ?? 10;

    // 🔹 print-only CSS — виж Page8.tsx printInterpretation за оригиналния
    // установен подход (защо display:none, не visibility:hidden).
    useEffect(() => {

        if (typeof document === 'undefined') return;

        const styleEl = document.createElement('style');
        styleEl.id = 'magmed-print-report-style';

        styleEl.innerHTML = `
            @media print {
                html, body {
                    height: auto !important;
                    overflow: visible !important;
                }
                #magmed-app-root,
                #print-report-toolbar {
                    display: none !important;
                }
                #print-report-area,
                #print-report-area * {
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

    // 🔹 activeTab е null, когато отваряме от страница без trainingsplan
    // таб контекст (напр. Page11/Laktatkurve, showTrainingSection={false})
    // — тогава просто ползваме keinTest defaults, JSX-ът по-долу така или
    // иначе не рендира секцията.
    const storageKey = STORAGE_KEY_BY_TAB[activeTab as string] ?? 'trainingsplanKeinTest';
    const kt = measurement?.[storageKey] ?? {};
    const isIndividuell = kt.editMode === 'individuell';
    const trainingskategorie = kt.trainingskategorie ?? 'gesundheitssport';

    const activeIntensityRanges =
        activeTab === 'keinTest'
            ? KEIN_TEST_INTENSITY_RANGES
            : (INTENSITY_RANGES_BY_TAB[activeTab]?.[trainingskategorie] ?? KEIN_TEST_INTENSITY_RANGES);

    const hfruheBase = measurement?.heartraterest > 0 ? measurement.heartraterest : 70;
    const hfmaxBase = measurement?.expectedheartrate > 0 ? measurement.expectedheartrate : 0;
    const wattMaxBase = measurement?.sollLeistungNorm ?? 0;

    const hfruhe = (isIndividuell && kt.hfruheOverride != null) ? kt.hfruheOverride : hfruheBase;
    const hfmax = (isIndividuell && kt.hfmaxOverride != null) ? kt.hfmaxOverride : hfmaxBase;
    const wattMax = (isIndividuell && kt.wattMaxOverride != null) ? kt.wattMaxOverride : wattMaxBase;

    // 🔹 идентично на computeZone в TrainingsplanKeinTest/Ergometrie/
    // LaktatErgometrie/SpiroErgometrieComponent.tsx.
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

    const radfahrenEnabled = kt.radfahrenEnabled ?? true;
    const laufenEnabled = kt.laufenEnabled ?? true;
    const hideUnselected = kt.hideUnselected ?? false;

    const showRadfahren = radfahrenEnabled || !hideUnselected;
    const showLaufen = laufenEnabled || !hideUnselected;

    const stages = kt.stages ?? KEIN_TEST_DEFAULT_STAGES;
    const activeStages = stages.filter((s: any) => s.active);

    const ergometry = measurement?.ergometry;
    const hasLactateData = !!(ergometry?.data && ergometry.data.some((r: any) => Number(r.lactate) > 0));
    const ergometryResult = hasLactateData ? computeErgometryResult(ergometry) : null;

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

                <View style={styles.toolbar} nativeID="print-report-toolbar">

                    <Text style={styles.toolbarTitle}>
                        {LanguageUtil.getName('print_report_title_text')}
                    </Text>

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

                <ScrollView style={styles.scroll}>

                    <View nativeID="print-report-area" style={styles.printArea}>

                        <Text style={styles.reportTitle}>
                            {LanguageUtil.getName('print_report_title_text')}
                        </Text>

                        <View style={styles.patientHeader}>
                            <Text style={styles.patientName}>{patientName || '—'}</Text>
                            <Text style={styles.patientMeta}>
                                {LanguageUtil.getName('print_report_patient_id_text')}: {patient?.patientid || '—'}
                            </Text>
                            <Text style={styles.patientMeta}>
                                {LanguageUtil.getName('print_report_generated_on_text')}: {generatedOn}
                            </Text>
                        </View>

                        {/* ===== TRAININGSPLAN SECTION ===== */}

                        {showTrainingSection && (
                        <>
                        <Text style={styles.sectionTitle}>
                            {LanguageUtil.getName(TAB_LABEL_KEY[activeTab] ?? 'kein_test_text')}
                        </Text>

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

                        <Text style={styles.subTitle}>
                            {LanguageUtil.getName('trainingswoche_plan_text')}
                        </Text>

                        <Text style={styles.noteText}>
                            {LanguageUtil.getName('print_report_active_stages_only_text')}
                        </Text>

                        {
                            activeStages.length > 0 && (

                                <View style={styles.stageTable}>

                                    <View style={styles.stageHeaderRow}>
                                        <Text style={styles.stageCell}>{LanguageUtil.getName('stufe_text')}</Text>
                                        <Text style={styles.stageCell}>{LanguageUtil.getName('wntz_minuten_text')}</Text>
                                        <Text style={styles.stageCell}>{LanguageUtil.getName('dauer_te_minuten_text')}</Text>
                                        <Text style={styles.stageCell}>{LanguageUtil.getName('te_woche_haeufigkeit_text')}</Text>
                                        <Text style={styles.stageCell}>{LanguageUtil.getName('zeit_aufteilung_text')}</Text>
                                        <Text style={styles.stageCell}>{LanguageUtil.getName('trainingsblock_wochen_text')}</Text>
                                    </View>

                                    {
                                        activeStages.map((s: any, i: number) => (
                                            <View key={s.stage ?? i} style={styles.stageRow}>
                                                <Text style={styles.stageCell}>{s.stage}.</Text>
                                                <Text style={styles.stageCell}>{s.wntz}</Text>
                                                <Text style={styles.stageCell}>{s.dauerTe}</Text>
                                                <Text style={styles.stageCell}>{s.teWoche}</Text>
                                                <Text style={styles.stageCell}>{s.zeitAufteilung} GA1/GA2</Text>
                                                <Text style={styles.stageCell}>{s.trainingsblock}</Text>
                                            </View>
                                        ))
                                    }

                                </View>

                            )
                        }
                        </>
                        )}

                        {/* ===== LAKTATKURVE SECTION ===== */}

                        {showLactateSection && (
                        <>
                        <Text style={styles.sectionTitle}>
                            {LanguageUtil.getName('training_laktat_ergometrie_text')}
                        </Text>

                        {
                            hasLactateData
                                ? (
                                    <>
                                        <LactateChartComponent
                                            data={ergometry.data}
                                            result={ergometryResult}
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
                                                <Text style={styles.thresholdValueCell}>{ergometryResult?.IASPoint?.load?.toFixed?.(0) ?? '—'}</Text>
                                                <Text style={styles.thresholdValueCell}>{ergometryResult?.IASPoint?.hf?.toFixed?.(0) ?? '—'}</Text>
                                                <Text style={styles.thresholdValueCell}>{ergometryResult?.IAS?.toFixed?.(2) ?? '—'}</Text>
                                            </View>

                                            <View style={styles.thresholdRow}>
                                                <Text style={styles.thresholdLabelCell}>{LanguageUtil.getName('print_report_ians_text')}</Text>
                                                <Text style={styles.thresholdValueCell}>{ergometryResult?.IANSPoint?.load?.toFixed?.(0) ?? '—'}</Text>
                                                <Text style={styles.thresholdValueCell}>{ergometryResult?.IANSPoint?.hf?.toFixed?.(0) ?? '—'}</Text>
                                                <Text style={styles.thresholdValueCell}>{ergometryResult?.IANS?.toFixed?.(2) ?? '—'}</Text>
                                            </View>

                                        </View>
                                    </>
                                )
                                : (
                                    <Text style={styles.noteText}>
                                        {LanguageUtil.getName('print_report_no_lactate_data_text')}
                                    </Text>
                                )
                        }
                        </>
                        )}

                    </View>

                </ScrollView>

            </View>

        </Modal>

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
    },

    toolbarTitle: {
        fontSize: 18,
        fontWeight: '700'
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
        marginTop: 18,
        marginBottom: 4
    },

    noteText: {
        fontSize: 13,
        fontStyle: 'italic',
        color: '#666',
        marginBottom: 8
    },

    // 🔹 zone table — визуално идентична на zoneTable в
    // TrainingsplanKeinTestComponent.tsx (по-нов увеличен шрифт, виж
    // 2026-08-25 промяната там), но собствен StyleSheet (принт изгледът не
    // импортира стиловете на таба).
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
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8
    },

    zoneHeaderLabelCell: {
        flex: 1.6,
        fontSize: 14,
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
        flexDirection: 'row'
    },

    stageCell: {
        flex: 1,
        fontSize: 13,
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8
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
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8
    },

    thresholdRow: {
        flexDirection: 'row'
    },

    thresholdLabelCell: {
        flex: 1.4,
        fontSize: 13,
        fontWeight: '600',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8
    },

    thresholdValueCell: {
        flex: 1,
        fontSize: 13,
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8,
        backgroundColor: '#e3f2e3'
    }

});
