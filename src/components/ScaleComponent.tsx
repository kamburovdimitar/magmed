import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'

export default function ScaleComponent() {
    return (
        <View style={{ flexDirection: 'row' }}>
            <TextInput style={styles.input} />
            <TextInput style={styles.input} />
            <TextInput style={styles.input} />
            <TextInput style={styles.input} />
            <TextInput style={styles.input} />
            <TextInput style={styles.input} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        height: 40,
        width: 15,
        borderWidth: 1,
    },
})

