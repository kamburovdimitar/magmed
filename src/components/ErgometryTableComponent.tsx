import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import TitleWithInfoComponent from './TitleWithInfoComponent';
import { openPopup } from '../services/PopupService';
import { ErgometryUtil } from '../utils/ErgometrieUtil';

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

                "Stage = Exercise stage number",

                "Time = Duration or elapsed time of the stage",

                "Load = Exercise workload (Watt or treadmill speed)",

                "HF = Heart Rate (beats per minute)",

                "Lactate = Blood lactate concentration (mmol/L)",

                "LT1 / LT2 = Stages selected by the currently selected Lactate Model"

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

    console.log("Selected Model:", selectedModel);
    console.log(report);

    console.log(report?.IASPoint?.stage);
    console.log(typeof report?.IASPoint?.stage);

    console.log(report?.IANSPoint?.stage);
    console.log(typeof report?.IANSPoint?.stage);



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
                    Time
                </Text>

                <Text style={styles.input}>
                    Load
                </Text>

                <Text style={styles.input}>
                    HF
                </Text>

                <Text style={styles.input}>
                    Lactate
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