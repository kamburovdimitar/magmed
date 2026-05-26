import React from 'react'
import { View, StyleSheet, Button } from 'react-native'
import TestMeasurmentComponent from '../TestMeasurementsComponent'
import { useEffect, useState } from "react";

export default function TestComponent1({
    callback,
    measurements,
    onPrint,
    onInterpration,
}) {
    const [localMeasurements, setLocalMeasurements] = useState(measurements);

    useEffect(() => {
        setLocalMeasurements(measurements);
    }, [measurements]);


    function onUpdateMeasurements(field, value) {

        setLocalMeasurements((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    function onSave() {
        callback(localMeasurements);
    }

    function onPrintHandler() {
        onPrint(localMeasurements);
    }

    function onInterprationHandler() {
        onInterpration(localMeasurements);
    }

    return (
        <View style={styles.container}>
            <TestMeasurmentComponent
                measurements={localMeasurements}
                onUpdateMeasurements={onUpdateMeasurements}
            />

            <Button
                title="Save"
                onPress={onSave}
            />
            <Button
                title="Print"
                onPress={onPrintHandler}
            />
            <Button
                title="Interpration"
                onPress={onInterprationHandler}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '50%',
        gap: 10,
    },
})