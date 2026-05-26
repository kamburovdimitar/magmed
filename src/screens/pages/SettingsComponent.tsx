import React from 'react'
import { View, Text, Button } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil.js'


export default function SettingsComponents({ goTo }) {

    function setLanguage(value) {

        LanguageUtil.setLanguage(value);
    }

    return (
        <View>

            <Text>Settings</Text>

            <Button
                title="English"
                onPress={() => setLanguage('en')}
            />

            <Button
                title="german"
                onPress={() => setLanguage('de')}
            />

            <Button
                title="Back to Home"
                onPress={() => goTo('home')}
            />

        </View>
    )
}