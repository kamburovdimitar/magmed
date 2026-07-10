import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TitleWithInfoComponent from './TitleWithInfoComponent'
import { openPopup } from '../services/PopupService';
import { CodexUtil } from '../utils/CodexUtil';

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

                "IAS = Individual Aerobic Threshold (First Lactate Threshold).\nRepresents the transition from purely aerobic metabolism to increasing lactate production.",

                "IANS = Individual Anaerobic Threshold (Second Lactate Threshold).\nRepresents the exercise intensity above which lactate accumulation increases rapidly.",

                "Watt = Power output at the threshold.\nSource: IASPoint.load / IANSPoint.load.",

                "Watt/kg = Relative power output normalized to body weight.\nFormula: Watt / Body Weight.\nImplementation: CodexUtil.calculateIASWattKg() and CodexUtil.calculateIANSWattKg().",

                "HF = Heart Rate at the threshold.\nSource: IASPoint.hf / IANSPoint.hf.",

                "Lactate = Blood lactate concentration at the threshold.\nSource: IASPoint.lactate / IANSPoint.lactate.",

                "Model = Selected lactate evaluation algorithm used for threshold detection.",

                "",

                "MAGMED Codex Mapping:",

                "#45 -> IAS Watt\nSource: IASPoint.load",

                "#46 -> IANS Watt\nSource: IANSPoint.load",

                "#47 -> IAS Watt/kg\nFormula: IAS Watt / Body Weight",

                "#48 -> IANS Watt/kg\nFormula: IANS Watt / Body Weight",

                "#49 -> IAS Heart Rate\nSource: IASPoint.hf",

                "#50 -> IANS Heart Rate\nSource: IANSPoint.hf"

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

            <TitleWithInfoComponent
                title=' Ergometry Results'
                infoHandler={infoHandler}
            />

            <View style={styles.block}>

                <Text style={styles.model}>
                    {report.model}
                </Text>

                <View style={styles.header}>

                    <Text style={styles.label}>
                    </Text>

                    <Text style={styles.value}>
                        Watt
                    </Text>

                    <Text style={styles.value}>
                        Watt/kg
                    </Text>

                    <Text style={styles.value}>
                        HF
                    </Text>

                    <Text style={styles.value}>
                        Lactate
                    </Text>

                </View>

                <View style={styles.row}>

                    <Text style={styles.label}>
                        IAS
                    </Text>

                    {/* #45 */}
                    <Text style={styles.value}>
                        {report.result?.IASPoint?.load ?? "-"} W
                    </Text>

                    {/* #47 */}
                    <Text style={styles.value}>
                        {
                            CodexUtil.calculateIASWattKg(
                                report.result?.IASPoint,
                                measurements?.weightkg
                            ) ?? "-"
                        } W/kg
                    </Text>

                    {/* #49 */}
                    <Text style={styles.value}>
                        {report.result?.IASPoint?.hf ?? "-"} bpm
                    </Text>

                    {/* Lactate */}
                    <Text style={styles.value}>
                        {report.result?.IASPoint?.lactate ?? "-"} mmol
                    </Text>

                </View>

                <View style={styles.row}>

                    <Text style={styles.label}>
                        IANS
                    </Text>

                    {/* #46 */}
                    <Text style={styles.value}>
                        {report.result?.IANSPoint?.load ?? "-"} W
                    </Text>

                    {/* #48 */}
                    <Text style={styles.value}>
                        {
                            CodexUtil.calculateIANSWattKg(
                                report.result?.IANSPoint,
                                measurements?.weightkg
                            ) ?? "-"
                        } W/kg
                    </Text>

                    {/* #50 */}
                    <Text style={styles.value}>
                        {report.result?.IANSPoint?.hf ?? "-"} bpm
                    </Text>

                    {/* Lactate */}
                    <Text style={styles.value}>
                        {report.result?.IANSPoint?.lactate ?? "-"} mmol
                    </Text>

                </View>

            </View>

        </View>

    );

}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        marginBottom: 10
    },

    row: {
        flexDirection: 'row',
        marginVertical: 4
    },

    label: {
        width: 120,
        fontWeight: 'bold'
    },

    value: {
        flex: 1,
        textAlign: 'center'
    },

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



});