import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TableCellComponent from './TableCellComponent';
import TitleWithInfoComponent from './TitleWithInfoComponent';
import { ErgometryUtil } from '../utils/ErgometrieUtil';
import { openPopup } from '../services/PopupService';

export default function HeartRateZonesComponent({
    measurements,
    selectedModel
}) {

    function infoHandler() {

        openPopup({

            title: "Heart Rate Zones (%)",

            description:
                "Displays the recommended training heart rate zones based on the Individual Anaerobic Threshold (IANS). "
                + "The original MAGMED lactate protocol uses percentages of IANS Heart Rate rather than the Karvonen method.",

            formula:
                "Target HR = IANS HF × (% / 100)",

            source:
                "Calculated from the Individual Anaerobic Threshold Heart Rate (IANS HF) using the selected lactate model.",

            fields: [

                "IANS HF = Heart Rate at the Individual Anaerobic Threshold.",

                "60% - 110% = Recommended training zones relative to IANS HF.",

                "Formula = IANS HF × (% / 100).",

                "",

                "MAGMED Codex Mapping:",

                "#50 -> IANS Heart Rate",

                "#51 -> Heart Rate Zones (%)"

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

    const percents = [
        60,
        65,
        70,
        75,
        80,
        85,
        90,
        95,
        100,
        105,
        110
    ];

    const iansHF =
        report?.IANSPoint?.hf;

    let zones = [];

    for (
        let i = 0;
        i < percents.length;
        i++
    ) {

        let value = "-";

        if (iansHF != null) {

            value = String(Math.round(
                iansHF *
                percents[i] /
                100
            ))
                ;

        }

        zones.push(value);

    }

    return (

        <View style={styles.container}>

            <TitleWithInfoComponent
                title='Heart Rate Zones (%)'
                infoHandler={infoHandler}
            />

            <View style={styles.row}>

                {

                    percents.map((percent) => (

                        <View
                            key={percent}
                            style={styles.cell}
                        >

                            <Text style={styles.header}>
                                {percent}%
                            </Text>

                        </View>

                    ))

                }

            </View>

            <View style={styles.row}>

                {

                    zones.map((zone, index) => (

                        <View
                            key={index}
                            style={styles.cell}
                        >

                            <TableCellComponent
                                value={zone}
                            />

                        </View>

                    ))

                }

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

    row: {
        flexDirection: 'row'
    },

    cell: {
        flex: 1,
        alignItems: 'center'
    },

    header: {
        marginBottom: 4,
        fontWeight: 'bold'
    }

});