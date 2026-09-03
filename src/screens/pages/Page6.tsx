import React from 'react'
import { View, Text, Button } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil'

export default function Page6({ goTo }) {

    return (
        <View>

            <Text>{LanguageUtil.getName('nav_drucken_text')}</Text>

            <Button
                title={LanguageUtil.getName('zurueck_zur_startseite_text')}
                onPress={() => goTo('home')}
            />

        </View>
    )
}