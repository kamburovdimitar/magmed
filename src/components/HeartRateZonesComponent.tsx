import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TableCellComponent from './TableCellComponent';

export default function HeartRateZonesComponent() {

    const zones = [
        "45%",
        "50%",
        "55%",
        "60%",
        "65%",
        "70%",
        "75%",
        "80%",
        "85%",
        "90%",
        "95%",
        "100%",
        "105%",
        "110%"
    ];

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Heart Rate Zones (%)
            </Text>

            <View style={styles.row}>

                {

                    zones.map((zone) => (

                        <View
                            key={zone}
                            style={styles.cell}
                        >

                            <Text style={styles.header}>
                                {zone}
                            </Text>

                        </View>

                    ))

                }

            </View>

            <View style={styles.row}>

                {

                    zones.map((zone) => (

                        <View
                            key={zone}
                            style={styles.cell}
                        >

                            <TableCellComponent
                                value=""
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
    }

});