import React from 'react'
import { View, Text, Button } from 'react-native'

export default function Page3({ goTo }) {

    return (
        <View>

            <Text>Page 3</Text>

            <Button
                title="Back to Home"
                onPress={() => goTo('home')}
            />

        </View>
    )
}