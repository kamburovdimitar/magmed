import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

export default function LabelAndInputTextComponent({
    label,
    measure,
    isEditable,
    value,
    setValue
}) {

    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={isEditable ? styles.input : styles.inputgreen}
                editable={isEditable}
                value={value}
                onChangeText={(text) => {
                    setValue(text);
                }}

            />

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
    label: {
        width: 120
    },
    input: {
        flex: 1,
        borderWidth: 1,
        padding: 8,
        borderRadius: 4
    },
    inputgreen: {
        flex: 1,
        borderWidth: 1,
        padding: 8,
        borderRadius: 4,
        backgroundColor: "#cfeccf"
    }

})