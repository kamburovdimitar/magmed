import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function RechenverfahrenComponent({ value, setValue }: any) {

    const options = [
        { key: 'dickhuth', label: 'Dickhuth' },
        { key: 'freiburg', label: 'Freiburger (L_min + 2.0 mmol/l)' },
        { key: 'linear', label: 'Stückweise lineare Regression' },
        { key: 'keul', label: 'Keul' }
    ]

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Rechenverfahren</Text>

            {
                options.map((item, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.row}
                        onPress={() => setValue(item.key)}
                    >
                        <Text style={styles.radio}>
                            {value === item.key ? '🔘' : '⚪'}
                        </Text>

                        <Text style={styles.label}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))
            }

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        backgroundColor: '#f0e8d8'
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 5,
        padding: 6,
        backgroundColor: '#d9e2ef'
    },

    radio: {
        width: 30,
        textAlign: 'center'
    },

    label: {
        flex: 1
    }

})