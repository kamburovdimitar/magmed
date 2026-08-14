// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-14 (Europe/Sofia) — New component (Phase 3 of the CCC pdf plan,
// "3.34 Laktatkurve und Trainingsbereich"): renders the TRAININGSBEREICH
// table (REG/IAS/GA1/GA2/IANS/E1/E2 rows, % der IANS / mmol/Liter / S/min /
// Watt-or-min·km columns) via ErgometryModelsUtil.calculateTrainingZoneTable.
// REG/GA1/GA2/E1 percentages are editable inputs — editing one calls
// onPercentsChange() with the merged override, which Page11.tsx also feeds
// into LactateChartComponent/TrainingZonesOverlayComponent so the table,
// the colored chart bands, and the draggable boundary handles on the chart
// all stay in sync (dragging a boundary on the chart updates this table's
// input too, since they share the same customPercents state in Page11).
// IAS/LTP1 (75%) and IANS/LTP2 (100%) stay fixed, non-editable anchors —
// matches the spec table where those two rows have no "Einstellung" column.
// ============================================

import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { ErgometryModelsUtil } from '../utils/ErgometryModelsUtil';
import LanguageUtil from '../utils/LanguageUtil';

const MODEL_LABELS: any = {
    dickhuth: 'Dickhuth',
    freiburg: 'Freiburger',
    linear: 'Linear',
    ltp: 'LTP',
    keul: 'Keul',
    keul_legacy: 'Keul Legacy'
};

const EDITABLE_KEYS = ['REG', 'GA1', 'GA2', 'E1'];

export default function TrainingsbereichComponent({
    result,
    data,
    model,
    isRun = false,
    customPercents = null,
    onPercentsChange,
    onReset
}: any) {

    const table = ErgometryModelsUtil.calculateTrainingZoneTable(
        result,
        data,
        model,
        isRun,
        customPercents
    );

    if (!table) {
        return null;
    }

    function handlePercentChange(key: string, rawValue: string) {

        const digitsOnly = rawValue.replace(/[^0-9]/g, '');

        if (digitsOnly === '') {
            // let the field go empty while typing without touching state yet
            return;
        }

        const percent = Math.max(1, Math.min(300, Number(digitsOnly)));

        onPercentsChange?.({
            ...(customPercents || {}),
            [key]: percent
        });
    }

    const loadHeader = isRun
        ? LanguageUtil.getName('zeit_text') + ' / km/h'
        : 'Watt';

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {LanguageUtil.getName('trainingsbereich_titel_text')}
                {'\n'}
                <Text style={styles.subtitle}>
                    ({MODEL_LABELS[model] || model || '—'})
                </Text>
            </Text>

            <View style={styles.headerRow}>
                <Text style={[styles.cell, styles.labelCell, styles.headerText]} />
                <Text style={[styles.cell, styles.headerText]}>{LanguageUtil.getName('prozent_der_ians_text')}</Text>
                <Text style={[styles.cell, styles.headerText]}>{LanguageUtil.getName('mmol_liter_text')}</Text>
                <Text style={[styles.cell, styles.headerText]}>S/min</Text>
                <Text style={[styles.cell, styles.headerText]}>{loadHeader}</Text>
            </View>

            {
                table.rows.map((row: any) => {

                    const isEditable = EDITABLE_KEYS.includes(row.key);
                    const isAnchor = row.key === 'IAS' || row.key === 'IANS';

                    return (
                        <View
                            key={row.key}
                            style={[styles.row, isAnchor && styles.rowAnchor]}
                        >
                            <Text style={[styles.cell, styles.labelCell, isAnchor && styles.labelAnchor]}>
                                {row.label}
                            </Text>

                            {
                                isEditable ? (
                                    <TextInput
                                        style={[styles.cell, styles.percentInput]}
                                        value={String(row.percent ?? '')}
                                        keyboardType="numeric"
                                        onChangeText={(val) => handlePercentChange(row.key, val)}
                                    />
                                ) : (
                                    <Text style={styles.cell}>
                                        {row.percent ?? ''}
                                    </Text>
                                )
                            }

                            <Text style={styles.cell}>{row.lactate ?? ''}</Text>
                            <Text style={styles.cell}>{row.hf ?? ''}</Text>
                            <Text style={styles.cell}>
                                {isRun ? (row.pace ?? '') : (row.load ?? '')}
                            </Text>
                        </View>
                    );
                })
            }

            <TouchableOpacity
                style={styles.resetButton}
                onPress={() => onReset?.()}
            >
                <Text style={styles.resetButtonText}>
                    {LanguageUtil.getName('zuruecksetzen')}
                </Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        borderColor: '#c9d6c0',
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#eef3e6'
    },

    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 13
    },

    subtitle: {
        fontWeight: 'normal',
        fontSize: 11,
        color: '#555'
    },

    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#999',
        paddingBottom: 4,
        marginBottom: 4
    },

    headerText: {
        fontWeight: 'bold',
        fontSize: 10
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3
    },

    rowAnchor: {
        backgroundColor: 'rgba(0,0,0,0.05)'
    },

    cell: {
        flex: 1,
        fontSize: 11,
        textAlign: 'center'
    },

    labelCell: {
        textAlign: 'left',
        fontWeight: '600'
    },

    labelAnchor: {
        fontWeight: 'bold'
    },

    percentInput: {
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 4,
        textAlign: 'center',
        backgroundColor: '#fff'
    },

    resetButton: {
        marginTop: 8,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 14,
        paddingVertical: 5,
        paddingHorizontal: 14,
        backgroundColor: '#fff'
    },

    resetButtonText: {
        fontSize: 12,
        color: '#333'
    }

})
