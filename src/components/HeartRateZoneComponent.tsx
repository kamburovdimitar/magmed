import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LabelAndInputTextComponent from './LabelAndInputComponent';
import TitleWithInfoComponent from './TitleWithInfoComponent'
import { openPopup } from '../services/PopupService';


export default function HeartRateZoneComponent({ measurements }) {

    function infoHandler() {

        openPopup({

            title: "Heart Rate Reserve",

            description:
                "Displays the patient's Heart Rate Reserve (HRR) and the calculated target heart rates for common training intensities using the Karvonen method.",

            formula:
                "HRR = HRmax - HRrest\nTarget HR = HRrest + (HRR × %)",

            source:
                "Calculated from the patient's Resting Heart Rate and Maximum Heart Rate using the Karvonen Heart Rate Reserve method.",

            fields: [

                "HRrest = Resting Heart Rate",

                "HRmax = Maximum Heart Rate",

                "HRR = Heart Rate Reserve (HRmax - HRrest)",

                "70%, 80%, 90% = Recommended target heart rates for the selected training intensity"
            ]

        });

    }

    return (

        <View style={styles.block}>



            <TitleWithInfoComponent title='  Heart Rate Reserve' infoHandler={infoHandler} />

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