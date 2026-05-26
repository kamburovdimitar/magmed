import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import LanguageUtil from '../utils/LanguageUtil'

export default function TestPanelComponent({ handlerButton }) {

    const [selected, setSelected] = useState(null)

    const ergometryHandleClick = (value) => {
        setSelected(value)
        handlerButton(value)
    }

    return (
        <View style={styles.container}>

            <View style={styles.top}>
                <TouchableOpacity style={styles.button}>
                    <Text>{LanguageUtil.getName('test_text')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.midle}>
                <TouchableOpacity style={styles.button}>
                    <Text>{LanguageUtil.getName('neuer_test_text')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text>{LanguageUtil.getName('vorhandene_tests_test')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottom}>

                <TouchableOpacity
                    style={[styles.button, selected === "detail1" && styles.active]}
                    onPress={() => ergometryHandleClick("detail1")}
                >
                    <Text>Button 1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selected === "detail2" && styles.active]}
                    onPress={() => ergometryHandleClick("detail2")}
                >
                    <Text>Button 2</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selected === "detail3" && styles.active]}
                    onPress={() => ergometryHandleClick("detail3")}
                >
                    <Text>Button 3 Korper Houtung</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selected === "detail4" && styles.active]}
                    onPress={() => ergometryHandleClick("detail4")}
                >
                    <Text>Button 4 Ergometrie</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selected === "detail5" && styles.active]}
                    onPress={() => ergometryHandleClick("detail5")}
                >
                    <Text>Button 5 Laktat Ergometrie</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selected === "detail6" && styles.active]}
                    onPress={() => ergometryHandleClick("detail6")}
                >
                    <Text>Button 6 Spiro Ergometrie</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selected === "detail7" && styles.active]}
                    onPress={() => ergometryHandleClick("detail7")}
                >
                    <Text>Button 7</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        borderWidth: 1
    },

    top: {
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    },

    midle: {
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        flexDirection: 'row',
    },

    bottom: {
        height: '70%',
        justifyContent: 'space-around',
        padding: 10,
        borderWidth: 1
    },

    button: {
        borderWidth: 1,
        padding: 12,
        alignItems: 'center'
    },

    active: {
        backgroundColor: 'yellow'
    }

})