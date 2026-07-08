import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TitleWithInfoComponent from './TitleWithInfoComponent'
import { openPopup } from '../services/PopupService';

export default function ErgometryResultsComponent({
    measurements,
    selectedModel
}) {

    function infoHandler() {

        openPopup({

            title: "Ergometry Results",

            description:
                "Displays the calculated aerobic (IAS) and anaerobic (IANS) thresholds according to the selected lactate evaluation model. "
                + "The displayed values represent the exercise intensity, heart rate and blood lactate concentration at each threshold.",

            formula:
                "Thresholds are calculated using the selected evaluation algorithm (Dickhuth, Freiburg, Linear, LTP, Keul or Keul Legacy).",

            source:
                "Calculated from the recorded ergometry test data using the selected lactate evaluation model.",

            fields: [

                "IAS = Individual Aerobic Threshold",

                "IANS = Individual Anaerobic Threshold",

                "HF = Heart Rate at the threshold",

                "Lactate = Blood lactate concentration (mmol/L)",

                "Model = Selected lactate evaluation algorithm"

            ]

        });

    }

    const reports =
        measurements?.ergometryReports ?? [];

    const report =
        reports.find(r => r.model === selectedModel);

    if (!report)
        return null;

    return (

        <View style={styles.container}>

            <TitleWithInfoComponent title=' Ergometry Results' infoHandler={infoHandler} />

            <View style={styles.block}>

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
        padding: 10
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