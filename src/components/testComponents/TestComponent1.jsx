import React from 'react'
import { View, StyleSheet, Button, TouchableOpacity, Text } from 'react-native'
import TestMeasurmentComponent from '../TestMeasurementsComponent'
import { useEffect, useState } from "react";
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'
import ErgoResultComponent from '../ErgoResultComponent'

export default function TestComponent1({
    callback,
    measurements,
    ergoType,
    setErgoType,
    onPrint,
    onInterpration,
    onGenereateFakeData
}) {

    const [localMeasurements, setLocalMeasurements] =
        useState(new MDPatientMeasurements(measurements));

    useEffect(() => {

        if (!measurements) return;

        setLocalMeasurements(
            new MDPatientMeasurements(measurements)
        );

    }, [measurements]);

    function onUpdateMeasurements(field, value) {

        let updated = {
            ...localMeasurements,
            [field]:
                value === ''
                    ? null
                    : isNaN(Number(value))
                        ? value
                        : Number(value)
        };

        updated =
            new MDPatientMeasurements(
                updated
            );

        setLocalMeasurements(
            updated
        );

        callback(updated);

    }

    function onPrintHandler() {
        onPrint();
    }

    function onInterprationHandler() {
        onInterpration();
    }

    function genereateFakeDataHandler() {

        let fake = onGenereateFakeData();

        fake = new MDPatientMeasurements(fake);

        setLocalMeasurements(fake);

        callback(fake);
    }

    return (

        <View style={styles.container}>

            <View style={styles.ergoRow}>

                <TouchableOpacity
                    style={[
                        styles.ergoButton,
                        ergoType === 'bike'
                        && styles.selected
                    ]}
                    onPress={() =>
                        setErgoType('bike')
                    }
                >
                    <Text>
                        🚴 Bike
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.ergoButton,
                        ergoType === 'laufband'
                        && styles.selected
                    ]}
                    onPress={() =>
                        setErgoType('laufband')
                    }
                >
                    <Text>
                        🏃 Laufband
                    </Text>

                </TouchableOpacity>

            </View>


            <TestMeasurmentComponent
                measurements={localMeasurements}
                onUpdateMeasurements={
                    onUpdateMeasurements
                }
                ergoType={ergoType}
            />


            <ErgoResultComponent
                measurements={localMeasurements}
                ergoType={ergoType}
                onUpdateMeasurements={
                    onUpdateMeasurements
                }
            />


            <Button
                title="Print"
                onPress={
                    onPrintHandler
                }
            />

            <Button
                title="Generate Fake Data"
                onPress={
                    genereateFakeDataHandler
                }
            />

            <Button
                title="Interpration"
                onPress={
                    onInterprationHandler
                }
            />

        </View>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        gap: 10,
    },

    ergoRow: {
        flexDirection: 'row',
        gap: 10
    },

    ergoButton: {
        width: 130,
        padding: 10,
        borderWidth: 1,
        alignItems: 'center'
    },

    selected: {
        backgroundColor: '#ffe600'
    }

})