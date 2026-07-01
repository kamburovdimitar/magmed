import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import TableCellComponent from './TableCellComponent';
import { ErgometryUtil } from '../utils/ErgometrieUtil';
import { openPopup } from '../services/PopupService';

export default function HeartRateZonesComponent({
    measurements
}) {

    function infoHandler() {

        openPopup({

            title: "Heart Rate Zones",

            info: "This table displays the training heart rate zones.",

            formula: "HR = HRrest + (HRmax - HRrest) × %"

        });

    }

    const zones =
        ErgometryUtil.calculateHeartRateZones(
            measurements
        );

    const percents = [

        45,
        50,
        55,
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

    return (

        <View style={styles.container}>

            <View style={styles.titleRow}>

                <Text style={styles.title}>
                    Heart Rate Zones (%)
                </Text>

                <Button
                    title="ⓘ"
                    onPress={infoHandler}
                />

            </View>


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

    title: {
        fontWeight: 'bold',
        marginBottom: 10
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
    },
    titleRow: {

        flexDirection: 'row',

        justifyContent: 'flex-start',

        alignItems: 'center',

        marginBottom: 10

    },

});