import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import ScaleComponent from './ScaleComponent'

export default function LineKraftComponent() {

    return (

        <View style={{ width: '100%', flexDirection: 'column' }}>

            <Text style={{ textAlign: "center" }}> BEURTEILUNG  </Text>

            {/* LEFT */}
            <View style={{ width: '100%', height: '100%', flexDirection: 'row' }}>


                <View style={{ width: '40%', flexDirection: 'column' }}>

                    <TouchableOpacity style={styles.button}
                        onPress={() => { }}
                    >
                        <Text style={{ color: 'white' }}>Click me</Text>
                    </TouchableOpacity>

                </View>

                <View style={{ width: '60%', height: '100%', flexDirection: 'column' }}>

                    <ScaleComponent />
                    <ScaleComponent />

                </View>

            </View>


            {/* RIGHT */}
            <View>


            </View>


        </View>

    )
}

const styles = StyleSheet.create({

    button: {
        width: 210,
        height: 80,

        padding: 10,
        alignItems: 'center'
    },
    row: {
        width: '100%',
        height: '3%',

        padding: 10,
        borderRadius: 8,
        alignItems: 'center'
    },

    input: {
        height: '3%',
        width: '10%',
        borderWidth: 1,
    },



})

