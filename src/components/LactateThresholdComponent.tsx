import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ErgometryUtil } from '../utils/ErgometrieUtil';

export default function LactateThresholdComponent({
    measurements,
    selectedModel
}) {

    const report =
        ErgometryUtil.getReportByModel(
            measurements?.ergometryReports,
            selectedModel
        )?.result;

    const firstWattKg =
        ErgometryUtil.calculateWattPerKg(
            report?.IASPoint?.load,
            measurements?.weightkg
        );

    const secondWattKg =
        ErgometryUtil.calculateWattPerKg(
            report?.IANSPoint?.load,
            measurements?.weightkg
        );

    const firstHFPercent =
        ErgometryUtil.calculateHFPercent(
            report?.IASPoint?.hf,
            measurements?.heartratemax
        );

    const secondHFPercent =
        ErgometryUtil.calculateHFPercent(
            report?.IANSPoint?.hf,
            measurements?.heartratemax
        );

    const firstVO2Percent =
        ErgometryUtil.calculateVO2Percent(
            report?.IASPoint
        );

    const secondVO2Percent =
        ErgometryUtil.calculateVO2Percent(
            report?.IANSPoint
        );

    const firstSpeed =
        ErgometryUtil.calculateSpeed(
            report?.IASPoint,
            measurements?.ergometry?.type
        );

    const secondSpeed =
        ErgometryUtil.calculateSpeed(
            report?.IANSPoint,
            measurements?.ergometry?.type
        );

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Lactate Threshold
            </Text>

            <View style={styles.header}>

                <Text style={styles.label}></Text>

                <Text style={styles.cell}>
                    Watt
                </Text>

                <Text style={styles.cell}>
                    Watt/kg
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

                <Text style={styles.cell}>
                    {report?.IASPoint?.load ?? "-"}
                </Text>

                <Text style={styles.cell}>
                    {firstWattKg ?? "-"}
                </Text>

                <Text style={styles.cell}>
                    {firstVO2Percent}
                </Text>

                <Text style={styles.cell}>
                    {firstSpeed}
                </Text>

                <Text style={styles.cell}>
                    {firstHFPercent ?? "-"}
                </Text>

                <Text style={styles.cell}>
                    {report?.IASPoint?.hf ?? "-"}
                </Text>

            </View>

            <View style={styles.row}>

                <Text style={styles.label}>
                    Second LT
                </Text>

                <Text style={styles.cell}>
                    {report?.IANSPoint?.load ?? "-"}
                </Text>

                <Text style={styles.cell}>
                    {secondWattKg ?? "-"}
                </Text>

                <Text style={styles.cell}>
                    {secondVO2Percent}
                </Text>

                <Text style={styles.cell}>
                    {secondSpeed}
                </Text>

                <Text style={styles.cell}>
                    {secondHFPercent ?? "-"}
                </Text>

                <Text style={styles.cell}>
                    {report?.IANSPoint?.hf ?? "-"}
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