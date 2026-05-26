import React from 'react'
import { View, Text, Button } from 'react-native'

export default function Page6({ goTo }) {

    return (
        <View>

            <Text>PRINT</Text>

            <Button
                title="Back to Home"
                onPress={() => goTo('home')}
            />

        </View>
    )
}