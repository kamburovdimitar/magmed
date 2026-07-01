import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LabelAndInputTextComponent from './LabelAndInputComponent';


export default function HeartRateZoneComponent({ measurements }) {

    return (

        <View style={styles.block}>

            <Text style={styles.title}>
                Heart Rate Reserve
            </Text>

            <LabelAndInputTextComponent
                label="Reserve"
                measure="bpm"
                value={measurements?.heartrateReserve}
                isEditable={false}
            />

            <LabelAndInputTextComponent
                label="70%"
                measure="bpm"
                value={measurements?.hrr70?.toFixed(0)}
                isEditable={false}
            />

            <LabelAndInputTextComponent
                label="80%"
                measure="bpm"
                value={measurements?.hrr80?.toFixed(0)}
                isEditable={false}
            />

            <LabelAndInputTextComponent
                label="90%"
                measure="bpm"
                value={measurements?.hrr90?.toFixed(0)}
                isEditable={false}
            />

        </View>

    );

}

const styles = StyleSheet.create({

    block: {
        borderWidth: 1,
        padding: 10,
        marginTop: 20,
        gap: 8
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 10
    }

});