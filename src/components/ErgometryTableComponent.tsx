// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass: the "Lactate" column header
//   was hardcoded English text; Translations.js already has an exact
//   matching key (`laktat`), so it now goes through
//   LanguageUtil.getName('laktat'). Left "Time", "Load", "HF" and "LT"
//   hardcoded — no exact-match keys exist for those in Translations.js, and
//   the task was to wire existing translations, not invent new ones.
// 2026-08-11 (Europe/Sofia) — Localization pass, part 2 (after the user
//   pointed out remaining untranslated strings elsewhere): added zeit_text
//   and belastung_text keys to Translations.js for "Time"/"Load" and wired
//   them here. Left "HF" and "LT" hardcoded — abbreviations identical in
//   both languages.
// ============================================

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import TitleWithInfoComponent from './TitleWithInfoComponent';
import { openPopup } from '../services/PopupService';
import { ErgometryUtil } from '../utils/ErgometrieUtil';
import LanguageUtil from '../utils/LanguageUtil';

export default function ErgometryTableComponent({
    measurements,
    selectedModel,
    onUpdateRow
}) {

    function infoHandler() {

        openPopup({

            title: "Ergometry Test",

            description:
                "Displays the recorded exercise protocol used for the ergometry test. "
                + "Each row represents one exercise stage and contains the recorded workload, heart rate and blood lactate values.",

            formula:
                "Threshold calculations are based on the entered Load, Heart Rate and Lactate values for each exercise stage.",

            source:
                "Data entered in this table are used to calculate aerobic and anaerobic thresholds, VO₂ estimates and training zones.",

            fields: [

                "Stage = Exercise stage number.\nEach row represents one exercise interval.",

                "Time = Stage duration or elapsed time.\nUsed by lactate interpolation models.",

                "Load = Exercise intensity.\nBike ergometry uses Watt.\nTreadmill ergometry uses Speed (km/h).",

                "HF = Heart Rate.\nMeasured at the end of each stage.\nUnit: bpm.",

                "Lactate = Blood lactate concentration.\nUnit: mmol/L.",

                "LT1 / IAS = First lactate threshold selected by the active model.\nRepresents predominantly aerobic metabolism.",

                "LT2 / IANS = Second lactate threshold selected by the active model.\nRepresents transition to predominantly anaerobic metabolism.",

                "",

                "Derived values generated from this table:",

                "CODEX #47 = IAS Watt/kg",

                "CODEX #48 = IANS Watt/kg",

                "CODEX #68 = IAS Speed %",

                "CODEX #69 = IANS Speed %",

                "CODEX #72 = IAS Pace",

                "CODEX #73 = IANS Pace",

                "CODEX #92 = VO₂ ml/kg",

                "CODEX #96 = VT1 Watt/kg",

                "CODEX #97 = VT2 Watt/kg",

                "CODEX #100 = VT1 %",

                "CODEX #101 = VT2 %",

                "CODEX #116 = VT1 Running %",

                "CODEX #117 = VT2 Running %"

            ]

        });

    }

    const rows =
        measurements?.ergometry?.data ?? [];

    const report =
        ErgometryUtil.getReportByModel(
            measurements?.ergometryReports,
            selectedModel
        )?.result;

    return (

        <View style={styles.container}>

            <TitleWithInfoComponent
                title="  Ergometry Test"
                infoHandler={infoHandler}
            />

            <View style={styles.header}>

                <Text style={styles.stage}>
                    #
                </Text>

                <Text style={styles.ltColumn}>
                    LT
                </Text>

                <Text style={styles.input}>
                    {LanguageUtil.getName('zeit_text')}
                </Text>

                <Text style={styles.input}>
                    {LanguageUtil.getName('belastung_text')}
                </Text>

                <Text style={styles.input}>
                    HF
                </Text>

                <Text style={styles.input}>
                    {LanguageUtil.getName('laktat')}
                </Text>

            </View>

            {

                rows.map((row, i) => {



                    const firstStageRange =
                        report?.IASPoint?.stageRange?.toString() ?? "";

                    const secondStageRange =
                        report?.IANSPoint?.stageRange?.toString() ?? "";

                    const firstStages =
                        firstStageRange.split("-");

                    const secondStages =
                        secondStageRange.split("-");
                    const showLT1 =
                        firstStages.length === 2 &&
                        Number(firstStages[0]) === row.stage + 1;

                    const showLT2 =
                        secondStages.length === 2 &&
                        Number(secondStages[0]) === row.stage + 1;

                    return (

                        <React.Fragment key={i}>

                            <View style={styles.row}>

                                <Text style={styles.stage}>
                                    {row.stage + 1}
                                </Text>

                                <Text style={styles.ltColumn}>
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    value={row.time?.toString() ?? ""}
                                    onChangeText={(v) =>
                                        onUpdateRow(
                                            i,
                                            "time",
                                            v
                                        )
                                    }
                                />

                                <TextInput
                                    style={styles.input}
                                    value={row.load?.toString() ?? ""}
                                    onChangeText={(v) =>
                                        onUpdateRow(
                                            i,
                                            "load",
                                            Number(v)
                                        )
                                    }
                                />

                                <TextInput
                                    style={styles.input}
                                    value={row.hf?.toString() ?? ""}
                                    onChangeText={(v) =>
                                        onUpdateRow(
                                            i,
                                            "hf",
                                            Number(v)
                                        )
                                    }
                                />

                                <TextInput
                                    style={styles.input}
                                    value={row.lactate?.toString() ?? ""}
                                    onChangeText={(v) =>
                                        onUpdateRow(
                                            i,
                                            "lactate",
                                            Number(v)
                                        )
                                    }
                                />

                            </View>

                            {

                                showLT1 && (

                                    <View style={styles.thresholdRow}>

                                        <Text style={styles.thresholdLabel}>
                                            LT1
                                        </Text>

                                        <Text style={styles.thresholdValue}>
                                            {report?.IASPoint?.load} W
                                            {"   "}
                                            {report?.IASPoint?.hf} bpm
                                            {"   "}
                                            {report?.IASPoint?.lactate} mmol/L
                                        </Text>

                                    </View>

                                )

                            }

                            {

                                showLT2 && (

                                    <View style={styles.thresholdRow}>

                                        <Text style={styles.thresholdLabel}>
                                            LT2
                                        </Text>

                                        <Text style={styles.thresholdValue}>
                                            {report?.IANSPoint?.load} W
                                            {"   "}
                                            {report?.IANSPoint?.hf} bpm
                                            {"   "}
                                            {report?.IANSPoint?.lactate} mmol/L
                                        </Text>

                                    </View>

                                )

                            }

                        </React.Fragment>

                    );

                })

            }

        </View>

    );

}

const styles = StyleSheet.create({
    thresholdRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
        marginLeft: 35,
        padding: 6,
        borderWidth: 1,
        borderColor: '#d8c46b',
        backgroundColor: '#fff7cc'
    },

    thresholdLabel: {
        width: 60,
        fontWeight: 'bold',
        color: '#8a6d00'
    },

    thresholdValue: {
        flex: 1,
        fontWeight: '600'
    },
    container: {
        marginTop: 20,
        borderWidth: 1,
        padding: 10
    },

    header: {
        flexDirection: 'row',
        marginBottom: 5
    },

    row: {
        flexDirection: 'row',
        marginVertical: 3
    },

    lt1Row: {
        backgroundColor: '#e9f9e9'
    },

    lt2Row: {
        backgroundColor: '#ffeaea'
    },

    stage: {
        width: 35,
        textAlign: 'center',
        paddingTop: 8
    },

    ltColumn: {
        width: 55,
        textAlign: 'center',
        paddingTop: 8,
        fontWeight: 'bold'
    },

    lt1Text: {
        color: '#008000'
    },

    lt2Text: {
        color: '#d00000'
    },

    input: {
        flex: 1,
        borderWidth: 1,
        marginHorizontal: 2,
        padding: 6
    }

});