import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

export default function BeuterlungComponent({ label, openKraftMenu, openDEHNBARKEITmenu, openBEWEGLICHKEITmenu }) {

    return (

        <View style={{ width: '100%', height: '100%', flexDirection: 'column' }}>
            {
                label && <Text style={{ textAlign: "center" }}> BEURTEILUNG  </Text>
            }

            <Button
                title="KRAFT "
                onPress={() => openKraftMenu(true)}
            />
            <Button
                title="DEHNBARKEIT "
                onPress={() => openDEHNBARKEITmenu(true)}
            />
            <Button
                title="BEWEGLICHKEIT "
                onPress={() => openBEWEGLICHKEITmenu()}
            />
        </View>

    )
}

