import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TableCellComponent from './TableCellComponent';
import { ErgometryUtil } from '../utils/ErgometrieUtil';

export default function VO2MaxComponent({
    measurements,
    selectedModel
}) {

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

            <Text style={styles.title}>
                Maximum Oxygen Uptake (VO₂max)
            </Text>

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
                    Power
                </Text>

                <Text style={styles.label}>
                    HF
                </Text>

            </View>

            <View style={styles.row}>

                <Text style={styles.name}>
                    First LT

                </Text>

                <TableCellComponent value={firstVO2} />

                <TableCellComponent value={firstVO2Kg} />

                <TableCellComponent value={firstPower} />

                <TableCellComponent value={firstHF} />

            </View>

            <View style={styles.row}>

                <Text style={styles.name}>
                    Second LT
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