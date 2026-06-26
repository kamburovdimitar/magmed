import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ErgometryResultsComponent({
    measurements
}) {

    const reports =
        measurements?.ergometryReports ?? [];

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Ergometry Results
            </Text>

            {

                reports.map((report, i) => (

                    <View
                        key={i}
                        style={styles.block}
                    >

                        <Text style={styles.model}>
                            {report.model}
                        </Text>

                        <View style={styles.row}>

                            <Text style={styles.label}>
                                IAS
                            </Text>

                            <Text style={styles.value}>
                                {report.result?.IAS ?? "-"}
                            </Text>

                            <Text style={styles.value}>
                                {report.result?.IASPoint?.hf ?? "-"} bpm
                            </Text>

                            <Text style={styles.value}>
                                {report.result?.IASPoint?.lactate ?? "-"} mmol
                            </Text>

                        </View>

                        <View style={styles.row}>

                            <Text style={styles.label}>
                                IANS
                            </Text>

                            <Text style={styles.value}>
                                {report.result?.IANS ?? "-"}
                            </Text>

                            <Text style={styles.value}>
                                {report.result?.IANSPoint?.hf ?? "-"} bpm
                            </Text>

                            <Text style={styles.value}>
                                {report.result?.IANSPoint?.lactate ?? "-"} mmol
                            </Text>

                        </View>

                    </View>

                ))

            }

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

    block: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10
    },

    model: {
        fontWeight: 'bold',
        marginBottom: 8
    },

    row: {
        flexDirection: 'row',
        marginVertical: 3
    },

    label: {
        width: 70,
        fontWeight: 'bold'
    },

    value: {
        flex: 1
    }

});