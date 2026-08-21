// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-18 (Europe/Sofia) — DK: качи "3.32 CCC Laktat Datenerfassung und
// Auswertung" спецификацията и поиска таб 2 ("Überlagern"/Overlay) да
// показва ТОЧНО и САМО това (нищо друго) — а другите 2 таба
// (Trainingsbereich/Rechenverfahren) да са празни за момента, докато не
// стигнем до тях методично, спецификация по спецификация.
//
// Разделите 1-4/7-8 от PDF-а (Belastungsprotokoll, Datenerfassung,
// Rechenverfahren, Plausibilitätsprüfung, Automatisierungslogik) вече
// съществуват в таб "Aktuell" — не се преоткриват тук. Тук се реализират
// САМО раздели 5 и 6, буквално както са именувани в PDF-а:
//   5. "Darstellung (nur Datenauswertung)" → таблица "AUSWERTUNG"
//      (REG/IAS-LTP1/GA1/GA2/IANS-LTP2/E1/E2/max, колони Laktat mmol |
//      Watt (или km/h) | Watt/kg (или min/km) | HF S/min) — построена върху
//      вече съществуващата и тествана ErgometryModelsUtil.calculateTrainingZoneTable
//      (REG..E1 редовете) + добавен "max" ред от последното измерено stage.
//   6. "Dialogbereich (Detailanalyse)" → навигация Stufe по Stufe
//      (◀ Stufe N ▶) показваща Zeitpunkt/Laktat/HF/% HF(IANS)/% HRR/
//      % HFmax/Watt/Watt-kg/% Pmax за избраната Stufe — върху вече
//      съществуващите calculateHFPercent/calculatePmaxPercent/
//      calculateHRRPercent/calculateWattPerKg (същите формули, които вече
//      се ползват за IAS/IANS точките в Page11.tsx save()).
//
// Körpergewicht (нужно за Watt/kg) не съществуваше никъде в модела на
// тази страница досега — добавен е като ново поле, което Page11.tsx вече
// пази в MDPatientMeasurements.weightkg и записва при Save/Generate (виж
// коментара в Page11.tsx save()) — DK изрично поиска "когато пишем по
// обекта, да го сейваме в него", затова тук НЕ държим локално губещо се
// състояние, а само подаваме/четем през props от Page11.
// ============================================

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ErgometryModelsUtil } from '../utils/ErgometryModelsUtil';
import LanguageUtil from '../utils/LanguageUtil';

// 🔹 Same placeholder constants Page11.tsx's save() already uses for the
// IAS/IANS %HFmax/%HRR columns — kept identical here so the Dialog section
// stays consistent with the rest of the app. Not yet patient-specific.
const HF_MAX_PLACEHOLDER = 190;
const HF_REST_PLACEHOLDER = 60;

export default function LaktatkurveAuswertungComponent({
    data,
    result,
    model,
    isRun = false,
    weightKg = null,
    onWeightKgChange
}: any) {

    const normalized = ErgometryModelsUtil.normalizeChartData(data);

    const [stageIndex, setStageIndex] = useState(0);

    const safeIndex = normalized.length
        ? Math.max(0, Math.min(stageIndex, normalized.length - 1))
        : 0;

    const unit = isRun ? 'km/h' : 'Watt';
    const thirdColHeader = isRun ? 'min/km' : 'Watt/kg';

    const table = ErgometryModelsUtil.calculateTrainingZoneTable(result, data, model, isRun, null);

    // 🔹 за % Pmax искаме реалния измерен max load, НЕ
    // calculateChartMaxLoad() (тя добавя +2 визуален padding за chart
    // осите — правилно за графика, но би дало 99.3% вместо 100% на max
    // reда тук). Същия подход като Page11.tsx save() за IAS/IANS %Pmax.
    const maxLoad = normalized.length ? normalized[normalized.length - 1].load : 0;

    function thirdColValue(row: any) {
        if (isRun) {
            // 🔹 BUG FIX (2026-08-18): table.rows (от calculateTrainingZoneTable)
            // и maxRow вече носят .pace, но selectedRow идва директно от
            // normalizeChartData(), чиито редове са {load,lactate,hf,stage} —
            // БЕЗ .pace поле. Затова Dialog секцията винаги показваше "—" за
            // min/km при run-режим, въпреки валидни km/h данни (видяно в
            // screenshot на DK). Fallback-ваме към директно изчисление,
            // вместо да разчитаме на несъществуващо поле.
            if (row?.pace != null) return row.pace;
            return row?.load != null ? ErgometryModelsUtil.formatPace(row.load) : '—';
        }
        const v = ErgometryModelsUtil.calculateWattPerKg(row?.load, weightKg);
        return v != null ? v : '—';
    }

    const lastRow = normalized.length ? normalized[normalized.length - 1] : null;

    const maxRow = lastRow ? {
        key: 'MAX',
        label: 'max',
        percent: null,
        hf: lastRow.hf,
        lactate: lastRow.lactate,
        load: lastRow.load,
        pace: isRun ? ErgometryModelsUtil.formatPace(lastRow.load) : null
    } : null;

    const selectedRow = normalized[safeIndex] ?? null;

    const iansHF = result?.IANSPoint?.hf != null ? Number(result.IANSPoint.hf) : null;

    const stagePmaxPercent = selectedRow ? ErgometryModelsUtil.calculatePmaxPercent(selectedRow.load, maxLoad) : null;
    const stageHfPercent = selectedRow ? ErgometryModelsUtil.calculateHFPercent(selectedRow.hf, HF_MAX_PLACEHOLDER) : null;
    const stageHrrPercent = selectedRow ? ErgometryModelsUtil.calculateHRRPercent(selectedRow.hf, HF_REST_PLACEHOLDER, HF_MAX_PLACEHOLDER) : null;
    const stageHfIansPercent = (selectedRow && iansHF) ? Number(((Number(selectedRow.hf) / iansHF) * 100).toFixed(0)) : null;
    const stageThirdCol = selectedRow ? thirdColValue(selectedRow) : '—';

    function goPrevStage() {
        setStageIndex((i) => Math.max(0, i - 1));
    }

    function goNextStage() {
        setStageIndex((i) => Math.min(normalized.length - 1, i + 1));
    }

    return (
        <View style={styles.container}>

            {/* 🔹 Körpergewicht — нужно само за Watt/kg колоната (bike режим).
                Пази се в Page11.tsx state и се записва в
                MDPatientMeasurements.weightkg при Save/Generate. */}
            {!isRun && (
                <View style={styles.weightRow}>
                    <Text style={styles.weightLabel}>
                        {LanguageUtil.getName('koerpergewicht_text')} (kg):
                    </Text>
                    <TextInput
                        style={styles.weightInput}
                        value={weightKg != null ? String(weightKg) : ''}
                        keyboardType="numeric"
                        onChangeText={(val) => {
                            const digitsOnly = val.replace(/[^0-9.,]/g, '').replace(',', '.');
                            onWeightKgChange?.(digitsOnly === '' ? null : Number(digitsOnly));
                        }}
                    />
                </View>
            )}

            {/* 🔹 5. "Darstellung (nur Datenauswertung)" — таблица AUSWERTUNG */}
            <View style={styles.section}>

                <Text style={styles.sectionTitle}>
                    {LanguageUtil.getName('auswertung_text').toUpperCase()}
                </Text>

                {!table && (
                    <Text style={styles.emptyText}>
                        {LanguageUtil.getName('trainingsbereich_kein_ergebnis_text')}
                    </Text>
                )}

                {table && (
                    <>
                        <View style={styles.headerRow}>
                            <Text style={[styles.cell, styles.labelCell, styles.headerText]} />
                            <Text style={[styles.cell, styles.headerText]}>Laktat mmol</Text>
                            <Text style={[styles.cell, styles.headerText]}>{unit}</Text>
                            <Text style={[styles.cell, styles.headerText]}>{thirdColHeader}</Text>
                            <Text style={[styles.cell, styles.headerText]}>HF S/min</Text>
                        </View>

                        {table.rows.map((row: any) => (
                            <View key={row.key} style={styles.row}>
                                <Text style={[styles.cell, styles.labelCell]}>{row.label}</Text>
                                <Text style={styles.cell}>{row.lactate ?? '—'}</Text>
                                <Text style={styles.cell}>{row.load ?? '—'}</Text>
                                <Text style={styles.cell}>{thirdColValue(row)}</Text>
                                <Text style={styles.cell}>{row.hf ?? '—'}</Text>
                            </View>
                        ))}

                        {maxRow && (
                            <View style={[styles.row, styles.rowMax]}>
                                <Text style={[styles.cell, styles.labelCell]}>{maxRow.label}</Text>
                                <Text style={styles.cell}>{maxRow.lactate ?? '—'}</Text>
                                <Text style={styles.cell}>{maxRow.load ?? '—'}</Text>
                                <Text style={styles.cell}>{thirdColValue(maxRow)}</Text>
                                <Text style={styles.cell}>{maxRow.hf ?? '—'}</Text>
                            </View>
                        )}
                    </>
                )}

            </View>

            {/* 🔹 6. "Dialogbereich (Detailanalyse)" — Stufe по Stufe навигация */}
            <View style={styles.section}>

                <Text style={styles.sectionTitle}>
                    {LanguageUtil.getName('detail_analyse_text')}
                </Text>

                {!selectedRow && (
                    <Text style={styles.emptyText}>
                        {LanguageUtil.getName('trainingsbereich_kein_ergebnis_text')}
                    </Text>
                )}

                {selectedRow && (
                    <>
                        <View style={styles.navRow}>
                            <TouchableOpacity
                                style={[styles.navButton, safeIndex === 0 && styles.navButtonDisabled]}
                                onPress={goPrevStage}
                                disabled={safeIndex === 0}
                            >
                                <Text style={styles.navButtonText}>◀</Text>
                            </TouchableOpacity>

                            <Text style={styles.navLabel}>
                                {LanguageUtil.getName('zeitpunkt')}: {selectedRow.stage ?? safeIndex}
                            </Text>

                            <TouchableOpacity
                                style={[styles.navButton, safeIndex === normalized.length - 1 && styles.navButtonDisabled]}
                                onPress={goNextStage}
                                disabled={safeIndex === normalized.length - 1}
                            >
                                <Text style={styles.navButtonText}>▶</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.headerRow}>
                            <Text style={[styles.cell, styles.headerText]}>{LanguageUtil.getName('laktat')}</Text>
                            <Text style={[styles.cell, styles.headerText]}>HF</Text>
                            <Text style={[styles.cell, styles.headerText]}>% HF (IANS)</Text>
                            <Text style={[styles.cell, styles.headerText]}>% HRR</Text>
                            <Text style={[styles.cell, styles.headerText]}>% HFmax</Text>
                            <Text style={[styles.cell, styles.headerText]}>{unit}</Text>
                            <Text style={[styles.cell, styles.headerText]}>{thirdColHeader}</Text>
                            <Text style={[styles.cell, styles.headerText]}>% Pmax</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.cell}>{selectedRow.lactate ?? '—'}</Text>
                            <Text style={styles.cell}>{selectedRow.hf ?? '—'}</Text>
                            <Text style={styles.cell}>{stageHfIansPercent ?? '—'}</Text>
                            <Text style={styles.cell}>{stageHrrPercent ?? '—'}</Text>
                            <Text style={styles.cell}>{stageHfPercent ?? '—'}</Text>
                            <Text style={styles.cell}>{selectedRow.load ?? '—'}</Text>
                            <Text style={styles.cell}>{stageThirdCol}</Text>
                            <Text style={styles.cell}>{stagePmaxPercent ?? '—'}</Text>
                        </View>
                    </>
                )}

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        marginTop: 10
    },

    weightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10
    },

    weightLabel: {
        fontSize: 12.5,
        fontWeight: '600',
        color: '#333'
    },

    weightInput: {
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
        width: 80,
        backgroundColor: '#fff'
    },

    section: {
        borderWidth: 1,
        borderColor: '#dde3ea',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        backgroundColor: '#eef3e6'
    },

    sectionTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8
    },

    emptyText: {
        fontSize: 12.5,
        color: '#6b7789',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 8
    },

    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 4,
        backgroundColor: '#d9e2ef'
    },

    headerText: {
        fontWeight: 'bold',
        fontSize: 10.5,
        textAlign: 'center'
    },

    row: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        paddingVertical: 4
    },

    rowMax: {
        backgroundColor: 'rgba(0,0,0,0.05)'
    },

    cell: {
        flex: 1,
        fontSize: 11.5,
        textAlign: 'center'
    },

    labelCell: {
        fontWeight: '600',
        textAlign: 'left'
    },

    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        marginBottom: 8
    },

    navButton: {
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 14,
        paddingVertical: 4,
        paddingHorizontal: 14,
        backgroundColor: '#fff'
    },

    navButtonDisabled: {
        opacity: 0.35
    },

    navButtonText: {
        fontSize: 13,
        fontWeight: '700'
    },

    navLabel: {
        fontSize: 12.5,
        fontWeight: '600',
        color: '#333'
    }

});
