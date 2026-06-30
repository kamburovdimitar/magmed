import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ERGOMETRY_MODELS } from '../constants/ergometryModels';

export default function LactateModelPickerComponent({
    selectedModel,
    setSelectedModel
}) {

    return (

        <View style={styles.container}>

            <Text style={styles.label}>
                Lactate Model
            </Text>

            <View style={styles.pickerContainer}>

                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    style={styles.webPicker}
                >

                    <option value={ERGOMETRY_MODELS.DICKHUTH}>
                        Dickhuth
                    </option>

                    <option value={ERGOMETRY_MODELS.FREIBURG}>
                        Freiburg
                    </option>

                    <option value={ERGOMETRY_MODELS.LINEAR}>
                        Linear
                    </option>

                    <option value={ERGOMETRY_MODELS.LTP}>
                        LTP
                    </option>

                    <option value={ERGOMETRY_MODELS.KEUL}>
                        Keul
                    </option>

                    <option value={ERGOMETRY_MODELS.KEUL_LEGACY}>
                        Keul Legacy
                    </option>

                </select>

            </View>

        </View>

    );

}

const styles = StyleSheet.create({

    container: {

        width: 240,
        marginLeft: 15,
        justifyContent: 'center'

    },

    label: {

        fontSize: 10,
        color: '#666',
        marginLeft: 4,
        marginBottom: 2

    },

    pickerContainer: {

        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
        height: 32,
        justifyContent: 'center'

    },

    webPicker: {

        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: 13,
        paddingLeft: 6

    }

});