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
// ============================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Switch } from 'react-native';
import { useSelector } from 'react-redux';
import LanguageUtil from '../utils/LanguageUtil';
import { CodexUtil } from '../utils/CodexUtil';
import { TrainingsplanUtil } from '../utils/TrainingsplanUtil';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';
import {
    KEIN_TEST_DEFAULT_STAGES,
    KEIN_TEST_INTENSITY_RANGES,
    RATSCHLAEGE_VORLAGE_A_DE,
    RATSCHLAEGE_VORLAGE_B_DE,
    RATSCHLAEGE_VORLAGE_C_DE
} from '../constants/trainingsplanKeinTestDefaults';

const VORLAGEN: any = {
    A: RATSCHLAEGE_VORLAGE_A_DE,
    B: RATSCHLAEGE_VORLAGE_B_DE,
    C: RATSCHLAEGE_VORLAGE_C_DE
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
    const stages = kt.stages ?? KEIN_TEST_DEFAULT_STAGES;

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

    function updateStageField(stageIndex: number, field: string, value: string) {

        const updated = stages.map((s: any, i: number) =>
            i === stageIndex ? { ...s, [field]: value } : s
        );

        updateKt({ stages: updated });

    }

    const ratschlagText = kt.ratschlagText != null
        ? kt.ratschlagText
        : (ratschlagTemplate ? VORLAGEN[ratschlagTemplate] : '');

    return (
        <View style={styles.row}>

            <View style={styles.mainColumn}>

                {/* ===== SUMMARY: HFruhe/HFmax + Radfahren/Laufen + Watt max/km-h max ===== */}
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
                                        onPress={() => isIndividuell && updateKt({ radfahrenEnabled: !radfahrenEnabled })}
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
                                        onPress={() => isIndividuell && updateKt({ laufenEnabled: !laufenEnabled })}
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
                <View style={styles.stageTable}>

                    <View style={styles.stageHeaderRow}>
                        <Text style={styles.stageCheckCell}></Text>
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
                                    // 🔹 2026-08-21 — DK потвърди (по 5.90CCCGESUNDHEITS_Training.pdf:
                                    // "alle Parameter in Gold gefärbten Fenstern individuell
                                    // verändert werden") — не само Trainingsblock, а ВСИЧКИ
                                    // колони на етапа стават редактируеми в Individuelle Planung.
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
        gap: 6
    },

    sportToggleLabel: {
        fontSize: 14,
        fontWeight: '600'
    },

    checkboxGlyph: {
        fontSize: 19
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
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        paddingVertical: 8
    },

    stageCell: {
        flex: 1,
        fontSize: 13,
        textAlign: 'center',
        borderWidth: 0.5,
        borderColor: '#9fb3c8',
        padding: 8
    },

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
        gap: 6
    },

    vorlageLabel: {
        fontSize: 14,
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
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },

    ratschlagTextArea: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        textAlignVertical: 'top',
        minHeight: 560
    }

});
