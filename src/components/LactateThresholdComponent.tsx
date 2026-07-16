import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ErgometryUtil } from '../utils/ErgometrieUtil';
import TitleWithInfoComponent from './TitleWithInfoComponent'
import { openPopup } from '../services/PopupService';
import { CodexUtil } from '../utils/CodexUtil';

export default function LactateThresholdComponent({
    measurements,
    selectedModel
}) {

    function infoHandler() {

        openPopup({

            title: "Lactate Threshold",

            description:
                "Displays the calculated First (LT1/IAS) and Second (LT2/IANS) Lactate Thresholds using the selected evaluation model.",

            formula:
                "Thresholds are determined by the selected lactate evaluation algorithm.",

            source:
                "Results are calculated from the ergometry test data using the selected evaluation model (Dickhuth, Freiburg, Linear, LTP, Keul or Keul Legacy).",

            fields: [

                "Watt = Power output at the threshold",

                "Watt/kg = Power relative to body weight",

                "%VO₂max = Estimated oxygen uptake at the threshold",

                "Speed = Running speed (treadmill only)",

                "%HFmax = Heart rate as percentage of maximum heart rate",

                "HF = Heart rate at the threshold"

            ]

        });

    }

    const report =
        ErgometryUtil.getReportByModel(
            measurements?.ergometryReports,
            selectedModel
        )?.result;

    if (!report)
        return null;

    // openPopup({

    //     title: "Debug",

    //     fields: [

    //         `ergometry.type = ${measurements?.ergometry?.type}`,

    //         `isBike = ${measurements?.isBike}`,

    //         `IAS Load = ${report?.IASPoint?.load}`,

    //         `IANS Load = ${report?.IANSPoint?.load}`

    //     ]

    // });

    const firstWattKg =
        CodexUtil.calculateIASWattKg(
            report?.IASPoint,
            measurements?.weightkg
        );

    const secondWattKg =
        CodexUtil.calculateIANSWattKg(
            report?.IANSPoint,
            measurements?.weightkg
        );

    const firstHFPercent =
        CodexUtil.calculateIASHFPercent(
            report?.IASPoint,
            measurements?.heartratemax
        );

    const secondHFPercent =
        CodexUtil.calculateIANSHFPercent(
            report?.IANSPoint,
            measurements?.heartratemax
        );

    const firstVO2Percent =
        CodexUtil.calculateIASVO2Percent(
            report?.IASPoint
        );

    const secondVO2Percent =
        CodexUtil.calculateIANSVO2Percent(
            report?.IANSPoint
        );

    const firstSpeed =
        CodexUtil.calculateIASSpeed(
            report?.IASPoint,
            measurements?.ergometry?.type
        );

    const secondSpeed =
        CodexUtil.calculateIANSSpeed(
            report?.IANSPoint,
            measurements?.ergometry?.type
        );

    return (

        <View style={styles.container}>

            <TitleWithInfoComponent
                title='  Lactate Threshold'
                infoHandler={infoHandler}
            />

            <View style={styles.header}>

                <Text style={styles.label}></Text>

                <Text style={styles.cell}>
                    {
                        measurements?.isBike
                            ? "Watt"
                            : "Speed"
                    }
                </Text>

                <Text style={styles.cell}>
                    {
                        measurements?.isBike
                            ? "Watt/kg"
                            : "-"
                    }
                </Text>

                <Text style={styles.cell}>
                    %VO₂max
                </Text>

                <Text style={styles.cell}>
                    Speed
                </Text>

                <Text style={styles.cell}>
                    %HFmax
                </Text>

                <Text style={styles.cell}>
                    HF
                </Text>

            </View>

            <View style={styles.row}>

                <Text style={styles.label}>
                    First LT
                </Text>

                {/* #45 / #53 */}
                <Text style={styles.cell}>
                    {
                        measurements?.isBike
                            ? `${report?.IASPoint?.load ?? "-"} W`
                            : `${firstSpeed ?? "-"} km/h`
                    }
                </Text>

                {/* #47 */}
                <Text style={styles.cell}>
                    {
                        measurements?.isBike
                            ? `${firstWattKg ?? "-"} W/kg`
                            : "-"
                    }
                </Text>

                <Text style={styles.cell}>
                    {firstVO2Percent ?? "-"}
                </Text>

                <Text style={styles.cell}>
                    {
                        firstSpeed == null
                            ? "-"
                            : `${firstSpeed} km/h`
                    }
                </Text>

                <Text style={styles.cell}>
                    {
                        firstHFPercent == null
                            ? "-"
                            : `${firstHFPercent}%`
                    }
                </Text>

                <Text style={styles.cell}>
                    {
                        report?.IASPoint?.hf == null
                            ? "-"
                            : `${report.IASPoint.hf} bpm`
                    }
                </Text>

            </View>

            <View style={styles.row}>

                <Text style={styles.label}>
                    Second LT
                </Text>

                {/* #46 / #54 */}
                <Text style={styles.cell}>
                    {
                        measurements?.isBike
                            ? `${report?.IANSPoint?.load ?? "-"} W`
                            : `${secondSpeed ?? "-"} km/h`
                    }
                </Text>

                {/* #48 */}
                <Text style={styles.cell}>
                    {
                        measurements?.isBike
                            ? `${secondWattKg ?? "-"} W/kg`
                            : "-"
                    }
                </Text>

                <Text style={styles.cell}>
                    {secondVO2Percent ?? "-"}
                </Text>

                <Text style={styles.cell}>
                    {
                        secondSpeed == null
                            ? "-"
                            : `${secondSpeed} km/h`
                    }
                </Text>

                <Text style={styles.cell}>
                    {
                        secondHFPercent == null
                            ? "-"
                            : `${secondHFPercent}%`
                    }
                </Text>

                <Text style={styles.cell}>
                    {
                        report?.IANSPoint?.hf == null
                            ? "-"
                            : `${report.IANSPoint.hf} bpm`
                    }
                </Text>

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
        flexDirection: 'row'
    },

    row: {
        flexDirection: 'row'
    },

    label: {
        width: 170,
        borderWidth: 1,
        padding: 5
    },

    cell: {
        flex: 1,
        borderWidth: 1,
        padding: 5,
        textAlign: 'center'
    }

});