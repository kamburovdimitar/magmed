import React from 'react'
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native'

export default function DatenerfassungComponentList({ data, setData }: any) {

    function updateValue(index: number, field: string, value: string) {
        let newData = []

        for (let i = 0; i < data.length; i++) {
            if (i === index) {
                let row = { ...data[i] }
                row[field] = value
                newData.push(row)
            } else {
                newData.push(data[i])
            }
        }

        setData(newData)
    }

    function renderItem({ item, index }: any) {

        let time = item.time
        let load = item.load

        return (

            <View style={styles.row}>

                <Text style={styles.cellStage}>
                    {item.stage}
                </Text>

                <Text style={styles.cellTime}>
                    {time}
                </Text>

                <Text style={styles.cellLoad}>
                    {load}
                </Text>

                <TextInput
                    style={styles.cellInput}
                    value={item.hf}
                    onChangeText={(val) => updateValue(index, 'hf', val)}
                />

                <TextInput
                    style={styles.cellInput}
                    value={item.lactate}
                    onChangeText={(val) => updateValue(index, 'lactate', val)}
                />

            </View>
        )
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.cellStage}>Stufe</Text>
                <Text style={styles.cellTime}>Zeit</Text>
                <Text style={styles.cellLoad}>Watt</Text>
                <Text style={styles.cellInput}>HF</Text>
                <Text style={styles.cellInput}>Laktat</Text>
            </View>

            {/* LIST */}
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(_, i) => i.toString()}
            />

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        marginTop: 10,
        borderWidth: 1,
        padding: 10
    },

    header: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 5
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },

    // 🔥 ПРОЦЕНТИ (можеш да ги пипаш)
    cellStage: {
        width: '20%'
    },

    cellTime: {
        width: '20%'
    },

    cellLoad: {
        width: '20%'
    },

    cellInput: {
        width: '20%',
        borderWidth: 1,
        padding: 4
    }

})