import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Pressable } from 'react-native'
import TestMeasurmentComponent from '../TestMeasurementsComponent'
import WattMeasurmentComponent from '../WattMeasurmentComponent'
import PercentageComponent from '../PercentageComponent'
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'

export default function TestComponent4({ measurements, callback }) {

    const [localMeasurements, setLocalMeasurements] = useState(
        new MDPatientMeasurements(measurements)
    );

    const [mode, setMode] = useState("bike"); // bike | treadmill

    useEffect(() => {
        setLocalMeasurements(new MDPatientMeasurements(measurements));
    }, [measurements]);

    function onUpdateMeasurements(field, value) {
        const parsedValue = value === "" ? 0 : Number(value);

        setLocalMeasurements((prev) => {
            const updated = new MDPatientMeasurements(prev);
            updated[field] = parsedValue;
            return updated;
        });
    }

    function onSave() {
        callback(localMeasurements);
    }

    return (
        <View style={styles.fullcontainer}>



            {/* TEST DATA */}
            <View style={styles.container}>
                <TestMeasurmentComponent
                    measurements={localMeasurements}
                    onUpdateMeasurements={onUpdateMeasurements}
                />
            </View>

            {/* TOP BUTTONS */}
            <View style={styles.topBar}>
                <Pressable
                    style={[styles.button, mode === "bike" && styles.activeButton]}
                    onPress={() => setMode("bike")}
                >
                    <Text>🚴 Ergometrie</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, mode === "treadmill" && styles.activeButton]}
                    onPress={() => setMode("treadmill")}
                >
                    <Text>🏃 Laufband</Text>
                </Pressable>
            </View>

            {/* ERGOMETRY BLOCK */}
            <View style={styles.container}>
                <View style={styles.row}>

                    {/* BLOCK 1 */}
                    <View style={styles.half}>
                        <Text style={styles.title}>
                            Körperoberfläche bezogen
                        </Text>

                        <WattMeasurmentComponent
                            showlabel={true}
                            mode="surface"
                            measurements={localMeasurements}
                            onUpdateMeasurements={onUpdateMeasurements}
                        />

                    </View>

                    {/* BLOCK 2 */}
                    <View style={styles.half}>
                        <Text style={styles.title}>
                            Körpergewicht bezogen
                        </Text>

                        <WattMeasurmentComponent
                            showlabel={false}
                            mode="weight"
                            measurements={localMeasurements}
                            onUpdateMeasurements={onUpdateMeasurements}
                        />
                    </View>

                </View>
            </View>

            {/* PERCENT */}
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
        width: '100%'
    },

    row: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1
    },

    half: {
        flex: 1,
        borderWidth: 1,
        padding: 5
    },

    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 5
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        padding: 10
    },

    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#eee'
    },

    activeButton: {
        backgroundColor: '#cde5ff'
    }
});