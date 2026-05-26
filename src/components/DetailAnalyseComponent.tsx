import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function DetailAnalyseComponent({
    data,
    result
}: any) {

    // 🔹 use IANS point as detail row
    const item =
        result?.IANSPoint;

    if (!item) {
        return null;
    }

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                DIALOG (Detail-Analyse)
            </Text>

            {/* HEADER */}
            <View style={styles.header}>

                <Text style={styles.cell}>
                    Zeitpunkt
                </Text>

                <Text style={styles.cell}>
                    HF
                </Text>

                <Text style={styles.cell}>
                    % HFmax
                </Text>

                <Text style={styles.cell}>
                    Leistung
                </Text>

                <Text style={styles.cell}>
                    % Pmax
                </Text>

                <Text style={styles.cell}>
                    % HRR
                </Text>

                <Text style={styles.cell}>
                    Laktat
                </Text>

                <Text style={styles.cell}>
                    % HF (IANS)
                </Text>

                <Text style={styles.cell}>
                    % VO2max
                </Text>

            </View>

            {/* ROW */}
            <View style={styles.row}>

                <Text style={styles.cell}>
                    {item.stage}
                </Text>

                <Text style={styles.cell}>
                    {item.hf || '-'}
                </Text>

                <Text style={styles.cell}>
                    {item.hfPercent || '---'}
                </Text>

                <Text style={styles.cell}>
                    {item.load}
                </Text>

                <Text style={styles.cell}>
                    {item.pmaxPercent || '---'}
                </Text>

                <Text style={styles.cell}>
                    {item.hrrPercent || '---'}
                </Text>

                <Text style={styles.cell}>
                    {item.lactate || '-'}
                </Text>

                <Text style={styles.cell}>
                    {item.hfPercent || '---'}
                </Text>

                <Text style={styles.cell}>
                    ---
                </Text>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
        backgroundColor: '#eef3e6'
    },

    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },

    header: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 5,
        backgroundColor: '#d9e2ef'
    },

    row: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        paddingVertical: 4
    },

    cell: {
        width: `${100 / 9}%`,
        fontSize: 12,
        textAlign: 'center'
    }

})