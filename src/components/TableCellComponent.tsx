import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function TableCellComponent({
    value
}) {

    return (

        <TextInput
            style={styles.input}
            value={value?.toString() ?? ""}
            editable={false}
        />

    );

}

const styles = StyleSheet.create({

    input: {
        flex: 1,
        borderWidth: 1,
        padding: 6,
        marginHorizontal: 2,
        backgroundColor: "#cfeccf"
    }

});