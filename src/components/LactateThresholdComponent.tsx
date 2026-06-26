import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ErgometryUtil } from '../.../../utils/ErgometrieUtil';
import { ERGOMETRY_MODELS } from '../constants/ergometryModels';

export default function LactateThresholdComponent({
    measurements
}) {

    const report =
        ErgometryUtil.getReportByModel(
            measurements?.ergometryReports,
            ERGOMETRY_MODELS.LINEAR
        )?.result;

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
                    -
                </Text>

                <Text style={styles.cell}>
                    -
                </Text>

                <Text style={styles.cell}>
                    -
                </Text>

                <Text style={styles.cell}>
                    -
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
                    -
                </Text>

                <Text style={styles.cell}>
                    -
                </Text>

                <Text style={styles.cell}>
                    -
                </Text>

                <Text style={styles.cell}>
                    -
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