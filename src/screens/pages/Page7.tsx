import React from 'react'
import { View, Text, Button } from 'react-native'

export default function Page7({ goTo }) {

    return (
        <View>

            <Text>Page 7</Text>

            <Button
                title="Back to Home"
                onPress={() => goTo('home')}
            />

        </View>
    )
}