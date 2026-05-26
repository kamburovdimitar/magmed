import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

export default function WattMeasurementComponent({
    showlabel,
    measurements,
    onUpdateMeasurements,
    mode // "surface" | "weight"
}) {

    if (!measurements) return null;

    const isSurface = mode === "surface";

    return (
        <View style={styles.row}>

            {showlabel && (
                <View style={styles.column}>
                    <View style={styles.labelTop1}>
                        <Text>SOLL WERT</Text>
                    </View>

                    <View style={styles.labelTop2}>
                        <Text>IST WERT</Text>
                    </View>
                </View>
            )}

            {/* WATT */}
            <View style={styles.column}>
                <TextInput
                    style={[styles.input, styles.inputSoll]}
                    value={
                        isSurface
                            ? (measurements.sollLeistungNorm ?? 0).toString()
                            : (measurements.sollLeistungWeight ?? 0).toString()
                    }
                    editable={false}
                />

                <TextInput
                    style={[styles.input, styles.inputIst]}
                    value={(measurements.istLeistungMax ?? 0).toString()}
                    keyboardType="numeric"
                    onChangeText={(v) => onUpdateMeasurements("istLeistungMax", v)}
                />
            </View>

            <View style={styles.unit}>
                <Text>Watt</Text>
            </View>

            {/* WATT / KG */}
            <View style={styles.column}>
                <TextInput
                    style={[styles.input, styles.inputSoll]}
                    value={
                        isSurface
                            ? (measurements.sollLeistungProKg ?? 0).toFixed(2)
                            : (measurements.sollLeistungWeightProKg ?? 0).toFixed(2)
                    }
                    editable={false}
                />

                <TextInput
                    style={[styles.input, styles.inputSoll]}
                    value={
                        isSurface
                            ? (measurements.istLeistungProKg ?? 0).toFixed(2)
                            : (measurements.istLeistungWeightProKg ?? 0).toFixed(2)
                    }
                    editable={false}
                />
            </View>

            <View style={styles.unit}>
                <Text>Watt / kg</Text>
            </View>

            {/* % */}
            <View style={styles.column}>
                <TextInput
                    style={[styles.input, styles.inputSoll]}
                    value={"0"}
                    editable={false}
                />

                <TextInput
                    style={[styles.input, styles.inputSoll]}
                    value={
                        isSurface
                            ? (measurements.istProzentNorm ?? 0).toFixed(2)
                            : (measurements.istProzentWeightNorm ?? 0).toFixed(2)
                    }
                    editable={false}
                />
            </View>

            <View style={styles.unit}>
                <Text>% der norm</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        gap: 10,
        padding: 10,
        alignItems: 'flex-start'
    },

    column: {
        flexDirection: 'column',
        gap: 10
    },

    labelTop1: {
        paddingTop: 10
    },

    labelTop2: {
        paddingTop: 20
    },

    unit: {
        paddingTop: 40
    },

    input: {
        borderWidth: 1,
        height: 35,
        paddingHorizontal: 6,
        borderRadius: 4,
        textAlign: 'center'
    },

    inputSoll: {
        backgroundColor: '#d4f5d0'
    },

    inputIst: {
        backgroundColor: '#ffffff'
    }

})