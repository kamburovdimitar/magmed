import React from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import LabelAndInputTextComponent from '../../components/LabelAndInputComponent'
import LabelAndDobuleInputTextComponent from '../../components/LabelAndDoubleInputComponent'
import TesMeasurmentComponent from '../TestMeasurementsComponent'
import WattMeasurmentComponent from '../WattMeasurmentComponent'
import PercentageComponent from '../PercentageComponent'

export default function TestComponent4() {

    return (
        <View style={styles.fullcontainer}>
            <View style={styles.container}>
                <TesMeasurmentComponent />
            </View>
            <View style={styles.container}>

                <View style={styles.row}>
                    <View style={styles.half}>


                        <View style={styles.rowSingle} >
                            < View style={styles.column}>
                                <View style={styles.labelTop1}>
                                    <Text>SOLL WERT zzz</Text>
                                </View>

                            </View>

                            < View style={styles.column} >
                                <TextInput style={styles.input} />
                            </View>
                            < View style={styles.column}>
                                <View style={styles.labelTop1}>
                                    <Text>Watt</Text>
                                </View>

                            </View>

                            < View style={styles.column} >
                                <TextInput style={styles.input} />
                            </View>
                            < View style={styles.column}>
                                <View style={styles.labelTop1}>
                                    <Text>Watt</Text>
                                </View>

                            </View>

                            < View style={styles.column} >
                                <TextInput style={styles.input} />
                            </View>
                            < View style={styles.column}>
                                <View style={styles.labelTop1}>
                                    <Text>Watt</Text>
                                </View>

                            </View>

                            < View style={styles.column} >
                                <Text> </Text>
                            </View>
                            < View style={styles.column}>
                                <View style={styles.labelTop1}>
                                    <Text></Text>
                                </View>

                            </View>


                            < View style={styles.column} >
                                <TextInput style={styles.input} />
                            </View>
                            < View style={styles.column}>
                                <View style={styles.labelTop1}>
                                    <Text>S/min</Text>
                                </View>

                            </View>
                        </View>


                        <View style={styles.row} >

                            < View style={styles.column}>
                                <View style={styles.labelTop1}>
                                    <Text>SOLL WERT zzz</Text>
                                </View>

                                < View style={styles.labelTop2} >
                                    <Text>IST WERT </Text>
                                </View>
                            </View>

                            < View style={styles.column} >
                                <TextInput style={styles.input} />
                                < TextInput style={styles.input} />
                            </View>

                            < View style={styles.unit} >
                                <Text>Watt </Text>
                            </View>

                            < View style={styles.column} >
                                <TextInput style={styles.input} />
                                < TextInput style={styles.input} />
                            </View>

                            < View style={styles.unit} >
                                <Text>Watt / kg </Text>
                            </View>

                            < View style={styles.column} >
                                <TextInput style={styles.input} />
                                < TextInput style={styles.input} />
                            </View>

                            < View style={styles.unit} >
                                <Text>mi/min/kg </Text>
                            </View>

                            < View style={styles.column} >
                                <TextInput style={styles.input} />
                                < TextInput style={styles.input} />
                            </View>

                            < View style={styles.unit} >
                                <Text>% der VO2 max </Text>
                            </View>


                            < View style={styles.column} >
                                <TextInput style={styles.input} />
                                < TextInput style={styles.input} />
                            </View>

                            < View style={styles.unit} >
                                <Text>s/min </Text>
                            </View>

                        </View >

                    </View>



                </View>

            </View>

            <View style={{ width: "100%", height: '10%' }}>
                <PercentageComponent />

            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    fullcontainer: {
        flex: 1,
        width: '100%',
        height: '100%'

    },

    container: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '50%'

    },
    row: {
        paddingTop: "50",
        height: '50%',
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1
    },

    rowSingle: {
        paddingTop: "50",
        height: '10%',
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1
    },

    half: {
        flex: 1,
        borderWidth: 1,
    },
    innerrow: {
        flex: 1,
        flexDirection: 'row',
        gap: '10'

    },
    input: {
        borderWidth: 1,
        height: 40,
    },
    label: {
        width: 120
    },
    percentrow: {
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

    },
    labelTop1: {
        paddingTop: 10
    },
    labelTop2: {
        paddingTop: 20
    },
    column: {
        padding: 10,
        flexDirection: 'column',
        gap: 10
    },
    unit: {
        paddingTop: 40
    },



})