import React from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import LabelAndInputTextComponent from '../../components/LabelAndInputComponent'
import LabelAndDobuleInputTextComponent from '../../components/LabelAndDoubleInputComponent'
import TesMeasurmentComponent from '../TestMeasurementsComponent'
import WattMeasurmentComponent from '../WattMeasurmentComponent'
import PercentageComponent from '../PercentageComponent'

export default function TestComponent4() {

    return (
        <View style={styles.fullcontainer}>
            <View style={styles.container}>
                <TesMeasurmentComponent />
            </View>
            <View style={styles.container}>

                <View style={styles.row}>

                    <View style={styles.half}>
                        <WattMeasurmentComponent showlabel={true} />
                    </View>

                    <View style={styles.half}>
                        <WattMeasurmentComponent showlabel={false} />
                    </View>

                </View>

            </View>

            <View style={{ width: "100%", height: '10%' }}>
                <PercentageComponent />

            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    fullcontainer: {
        flex: 1,

        width: '100%',
        height: '100%'

    },

    container: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '50%'

    },
    row: {
        height: '50%',
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1
    },

    half: {
        flex: 1,
        borderWidth: 1,
    },
    innerrow: {
        flex: 1,
        flexDirection: 'row',
        gap: '10'

    },
    input: {
        borderWidth: 1,
        height: 40,
        borderRadius: 4
    },
    label: {
        width: 120
    },
    percentrow: {
        flexDirection: "row",
        width: '100%',
    },
    cell: {
        flex: 1,
        borderWidth: 1,
        textAlign: "center",
        padding: 5,
    },
    input: {
        borderWidth: 1,
        height: 35,
        paddingHorizontal: 6,
        borderRadius: 4
    }



})