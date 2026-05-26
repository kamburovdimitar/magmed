import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { MDPatient } from "../../model/MDPatient";

export default function PatientList(
    { data, onSelectItem }: {
        data: MDPatient[];
        onSelectItem?: (patient: MDPatient) => void;
    }
) {

    const [selectedId, setSelectedId] = useState(null)

    function selectPatient(patient: MDPatient) {
        if (onSelectItem) {
            onSelectItem(patient)
        }
    }

    function renderItem({ item }) {

        const isSelected = item.patientid === selectedId

        return (

            <TouchableOpacity
                style={[styles.row, isSelected && styles.selectedRow]}
                activeOpacity={0.6}
                onPress={() => {

                    setSelectedId(item.patientid)
                    selectPatient(item)
                }}
            >

                <Text style={styles.col}>{item.lastname}</Text>
                <Text style={styles.col}>{item.firstname}</Text>
                <Text style={styles.col}>{item.title}</Text>
                <Text style={styles.col}>{item.birthdate}</Text>
                <Text style={styles.col}>{item.patientid}</Text>

            </TouchableOpacity>

        )
    }

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 1
    },

    selectedRow: {
        backgroundColor: '#d0e8ff'
    },

    col: {
        flex: 1
    }

})