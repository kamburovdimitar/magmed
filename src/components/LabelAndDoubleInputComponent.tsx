import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

export default function LabelAndDoubleInputComponent({
    label,
    measure,
    value1,
    value2,
    setValue1,
    setValue2,
}) {

    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.column}>
                <TextInput
                    style={styles.input}
                    value={value1}
                    onChangeText={(text) => {
                        setValue1(text);
                    }}
                />
                <TextInput
                    style={styles.input}
                    value={value2}
                    onChangeText={(text) => {
                        setValue2(text);
                    }}
                />
            </View>



            <Text style={styles.label}>{measure}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 6
    },
    label: {
        width: 120
    },
    input: {
        flex: 1,
        borderWidth: 1,
        padding: 8,
        borderRadius: 4
    }
})