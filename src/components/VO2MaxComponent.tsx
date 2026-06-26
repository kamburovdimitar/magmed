import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TableCellComponent from './TableCellComponent';

export default function VO2MaxComponent({
    measurements
}) {

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
                    VT1
                </Text>

                <TableCellComponent value="" />

                <TableCellComponent value="" />

                <TableCellComponent value="" />

                <TableCellComponent value="" />

            </View>

            <View style={styles.row}>

                <Text style={styles.name}>
                    VT2
                </Text>

                <TableCellComponent value="" />

                <TableCellComponent value="" />

                <TableCellComponent value="" />

                <TableCellComponent value="" />

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