// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass, part 2 (after the user
//   pointed out remaining untranslated strings elsewhere): wired the title
//   ("Maximum Oxygen Uptake (VO₂max)" -> maximale_sauerstoffaufnahme_text),
//   the "Power" header (-> power_text) and the "First LT"/"Second LT" row
//   labels (-> erste_schwelle_text / zweite_schwelle_text) to newly-added
//   Translations.js keys. Left "VO₂ max", "ml/kg/min" and "HF" hardcoded —
//   these are units/abbreviations, identical in both languages.
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TableCellComponent from './TableCellComponent';
import { ErgometryUtil } from '../utils/ErgometrieUtil';
import TitleWithInfoComponent from './TitleWithInfoComponent'
import { openPopup } from '../services/PopupService';
import LanguageUtil from '../utils/LanguageUtil';

export default function VO2MaxComponent({
    measurements,
    selectedModel
}) {

    function infoHandler() {

        openPopup({

            title: "Heart Rate Zones (%)",

            description:
                "The table displays the calculated heart rate for different training intensities. "
                + "Each value represents the target heart rate for the selected percentage of Heart Rate Reserve (HRR).",

            formula:
                "Target HR = HRrest + (HRmax - HRrest) × (% / 100)",

            source:
                "Calculated from the patient's Resting Heart Rate and Maximum Heart Rate using the Karvonen formula.",

            fields: [

                "HRrest = Resting Heart Rate",

                "HRmax = Maximum Heart Rate",

                "HRR = HRmax - HRrest",

                "Displayed zones: 45% - 110% HRR"

            ]

        });

    }

    const report =
        ErgometryUtil.getReportByModel(
            measurements?.ergometryReports,
            selectedModel
        )?.result;

    const firstVO2 =
        ErgometryUtil.calculateVO2(
            report?.IASPoint,
            measurements
        );

    const secondVO2 =
        ErgometryUtil.calculateVO2(
            report?.IANSPoint
        );

    const firstVO2Kg =
        ErgometryUtil.calculateVO2Kg(
            report?.IASPoint,
            measurements?.weightkg
        );

    const secondVO2Kg =
        ErgometryUtil.calculateVO2Kg(
            report?.IANSPoint,
            measurements?.weightkg
        );

    const firstPower =
        report?.IASPoint?.load ?? "-";

    const secondPower =
        report?.IANSPoint?.load ?? "-";

    const firstHF =
        report?.IASPoint?.hf ?? "-";

    const secondHF =
        report?.IANSPoint?.hf ?? "-";

    return (

        <View style={styles.container}>


            <TitleWithInfoComponent title={LanguageUtil.getName('maximale_sauerstoffaufnahme_text')} infoHandler={infoHandler} />

            <View style={styles.header}>

                <Text style={styles.name}>
                </Text>

                <Text style={styles.label}>
                    VO₂ max
                </Text>

                <Text style={styles.label}>
                    ml/kg/min
                </Text>

                <Text style={styles.label}>
                    {LanguageUtil.getName('power_text')}
                </Text>

                <Text style={styles.label}>
                    HF
                </Text>

            </View>

            <View style={styles.row}>

                <Text style={styles.name}>
                    {LanguageUtil.getName('erste_schwelle_text')}

                </Text>

                <TableCellComponent value={firstVO2} />

                <TableCellComponent value={firstVO2Kg} />

                <TableCellComponent value={firstPower} />

                <TableCellComponent value={firstHF} />

            </View>

            <View style={styles.row}>

                <Text style={styles.name}>
                    {LanguageUtil.getName('zweite_schwelle_text')}
                </Text>

                <TableCellComponent value={secondVO2} />

                <TableCellComponent value={secondVO2Kg} />

                <TableCellComponent value={secondPower} />

                <TableCellComponent value={secondHF} />

            </View>

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        marginTop: 20,
        borderWidth: 1,
        padding: 10
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 10
    },

    header: {
        flexDirection: 'row',
        marginBottom: 5
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3
    },

    name: {
        width: 70,
        fontWeight: 'bold'
    },

    label: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold'
    }

});