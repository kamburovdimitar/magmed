import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

export default function BeuterlungComponentSixButtons({ label, openKraftMenu, openSpineMenu, openShoulderMenu, openPelvisMenu, openKneeMenu, openFootMenu }) {

    return (

        <View style={{ width: '100%', height: '100%', flexDirection: 'column' }}>
            {
                label && <Text style={{ textAlign: "center" }}> BEURTEILUNG  </Text>
            }

            <Button
                title="KOPF"
                onPress={() => openKraftMenu(true)}
            />
            <Button
                title="WIRBELSÄULE  "
                onPress={() => openSpineMenu(true)}
            />
            <Button
                title="SCHULTER  "
                onPress={() => openShoulderMenu(true)}
            />
            <Button
                title="BECKEN  "
                onPress={() => openPelvisMenu(true)}
            />
            <Button
                title="KNIE  "
                onPress={() => openKneeMenu(true)}
            />
            <Button
                title="FUß"
                onPress={() => openFootMenu(true)}
            />
        </View>

    )
}

