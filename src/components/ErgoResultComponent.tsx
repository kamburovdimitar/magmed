import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LabelAndInputTextComponent from './LabelAndInputComponent'

export default function ErgoResultComponent({
    measurements,
    ergoType,
    onUpdateMeasurements
}) {

    if (ergoType === 'laufband') {

        return (

            <View style={styles.container}>

                <View style={styles.block}>

                    <Text style={styles.title}>
                        Laufband
                    </Text>

                    <LabelAndInputTextComponent
                        label="Max Speed"
                        measure="km/h"
                        value={measurements?.maxspeed ?? 0}
                        isEditable={true}
                        setValue={(v) => onUpdateMeasurements(
                            'maxspeed',
                            v
                        )}
                    />

                    <LabelAndInputTextComponent
                        label="min/km"
                        measure=""
                        value={measurements?.minperkm ?? 0}
                        isEditable={false}
                    />

                </View>

            </View>

        )
    }

    return (

        <View style={styles.container}>

            <View style={styles.block}>

                <Text style={styles.title}>
                    Körper Oberfläche bezogen
                </Text>

                <LabelAndInputTextComponent
                    label="SOLL"
                    measure="Watt"
                    value={measurements?.sollWatt ?? 0}
                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="SOLL"
                    measure="Watt/kg"
                    value={measurements?.sollWattKg ?? 0}
                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="IST"
                    measure="Watt"
                    value={measurements?.istLeistungMax ?? 0}
                    isEditable={true}
                    setValue={(v) =>
                        onUpdateMeasurements(
                            'istLeistungMax',
                            v
                        )
                    }
                />

                <LabelAndInputTextComponent
                    label="IST"
                    measure="Watt/kg"
                    value={measurements?.istWattKg ?? 0}
                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="% Norm"
                    measure="%"
                    value={measurements?.istPercent ?? 0}
                    isEditable={false}
                />

            </View>

            <View style={styles.block}>

                <Text style={styles.title}>
                    Körper Gewicht bezogen
                </Text>

                <LabelAndInputTextComponent
                    label="SOLL"
                    measure="Watt"
                    value={measurements?.sollWeightWatt ?? 0}
                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="SOLL"
                    measure="Watt/kg"
                    value={measurements?.sollWeightWattKg ?? 0}
                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="IST"
                    measure="Watt"
                    value={measurements?.istLeistungMax ?? 0}
                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="IST"
                    measure="Watt/kg"
                    value={measurements?.istWattKg ?? 0}
                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="% Norm"
                    measure="%"
                    value={measurements?.istWeightPercent ?? 0}
                    isEditable={false}
                />

            </View>

        </View>

    )
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20
    },

    block: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        gap: 8
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 10
    }

})