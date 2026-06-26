import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

                <Picker
                    style={styles.picker}
                    selectedValue={selectedModel}
                    onValueChange={(value) =>
                        setSelectedModel(value)
                    }
                >

                    <Picker.Item
                        label="Dickhuth"
                        value={ERGOMETRY_MODELS.DICKHUTH}
                    />

                    <Picker.Item
                        label="Freiburg"
                        value={ERGOMETRY_MODELS.FREIBURG}
                    />

                    <Picker.Item
                        label="Linear"
                        value={ERGOMETRY_MODELS.LINEAR}
                    />

                    <Picker.Item
                        label="LTP"
                        value={ERGOMETRY_MODELS.LTP}
                    />

                    <Picker.Item
                        label="Keul"
                        value={ERGOMETRY_MODELS.KEUL}
                    />

                    <Picker.Item
                        label="Keul Legacy"
                        value={ERGOMETRY_MODELS.KEUL_LEGACY}
                    />

                </Picker>

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

    picker: {

        height: 32,

        fontSize: 13

    }

});