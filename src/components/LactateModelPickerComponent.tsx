import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { ERGOMETRY_MODELS } from '../constants/ergometryModels';

export default function LactateModelPickerComponent({
    selectedModel,
    setSelectedModel
}) {

    const items = [
        { label: 'Dickhuth', value: ERGOMETRY_MODELS.DICKHUTH },
        { label: 'Freiburg', value: ERGOMETRY_MODELS.FREIBURG },
        { label: 'Linear', value: ERGOMETRY_MODELS.LINEAR },
        { label: 'LTP', value: ERGOMETRY_MODELS.LTP },
        { label: 'Keul', value: ERGOMETRY_MODELS.KEUL },
        { label: 'Keul Legacy', value: ERGOMETRY_MODELS.KEUL_LEGACY }
    ];

    return (

        <View style={styles.container}>

            <Text style={styles.label}>
                Lactate Model
            </Text>

            <View style={styles.pickerContainer}>

                {
                    Platform.OS === 'web' ? (

                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            style={styles.webSelect}
                        >
                            {
                                items.map((item) => (

                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>

                                ))
                            }
                        </select>

                    ) : (

                        <Text>
                            Picker not implemented
                        </Text>

                    )
                }

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

    webSelect: {

        width: '100%',
        height: '100%',
        borderWidth: 0,
        fontSize: 13,
        paddingLeft: 6,
        backgroundColor: 'transparent'

    }

});