import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import ScaleComponent from './ScaleComponent'
import LineKraftComponent from './LineKraftComponent'

export default function KraftComponent({ label, goTo }) {

    return (

        <View style={{ width: '100%', height: '100%', flexDirection: 'column' }}>

            <Text style={{ textAlign: "center" }}> BEURTEILUNG  </Text>

            {/* LEFT */}
            <View style={{ width: '100%', flexDirection: 'column' }}>
                <LineKraftComponent />
                <LineKraftComponent />
                <LineKraftComponent />
                <LineKraftComponent />
                <LineKraftComponent />
                <LineKraftComponent />
                <LineKraftComponent />
                <LineKraftComponent />
                <LineKraftComponent />
                <LineKraftComponent />
            </View>


            {/* RIGHT */}
            <View>


            </View>


        </View >

    )
}

const styles = StyleSheet.create({

    button: {
        width: '100%',
        height: '7.5%',

        padding: 10,
        alignItems: 'center'
    },
    row: {
        width: '100%',
        height: '3%',
        backgroundColor: 'red',
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

