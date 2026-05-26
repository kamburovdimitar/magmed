import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

export default function PercentageComponent({ showlabel }) {

    return (
        <View style={{ width: '100%', height: '100%' }} >
            <View style={styles.row}>
                <Text style={styles.cell}>%</Text>
                <Text style={styles.cell}>45%</Text>
                <Text style={styles.cell}>50%</Text>
                <Text style={styles.cell}>55%</Text>
                <Text style={styles.cell}>60%</Text>
                <Text style={styles.cell}>65%</Text>
                <Text style={styles.cell}>70%</Text>
                <Text style={styles.cell}>75%</Text>
                <Text style={styles.cell}>80%</Text>
                <Text style={styles.cell}>85%</Text>
                <Text style={styles.cell}>90%</Text>
                <Text style={styles.cell}>95%</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.cell}> s/min </Text>
                <Text style={styles.cell}></Text>
                <Text style={styles.cell}></Text>
                <Text style={styles.cell}></Text>
                <Text style={styles.cell}></Text>
                <Text style={styles.cell}></Text>
                <Text style={styles.cell}></Text>
                <Text style={styles.cell}></Text>
                <Text style={styles.cell}></Text>
                <Text style={styles.cell}></Text>
                <Text style={styles.cell}></Text>
                <Text style={styles.cell}></Text>
            </View>

        </View >


    )
}

const styles = StyleSheet.create({
    row: {
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