import React from 'react'
import { View, Text, Button } from 'react-native'

export default function Page11({ goTo }) {

    return (
        <View>

            <Text>Page 11</Text>

            <Button
                title="Back to Home"
                onPress={() => goTo('home')}
            />

        </View>
    )
}