// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-25 (Europe/Sofia) — DK: "навсякъде преводи на български, за да
//   мога да се ориентирам" + "нека има опция български в сетингс и да
//   може когато цъкнем на него всичко да се преименува на бг, по дефолт
//   засега да е бг за теста, а по-нататък ще го направим на английски и
//   немски". Тази страница беше чисто placeholder (hardcoded "Settings"/
//   "English"/"german" текст, `LanguageUtil.setLanguage(value)` мутираше
//   обикновено static class поле — виж LanguageUtil.js/settingsSlice.ts
//   changelog-овете защо това не преренд(ваше нищо реално).
//
//   Пренаписана: (1) вика dispatch(setLanguage(...)) вместо
//   LanguageUtil.setLanguage() директно — App.tsx е subscribe-нат за тази
//   Redux стойност и предизвиква реален rerender на цялото приложение;
//   (2) трети бутон "Български" (bg) до английски/немски; (3) маркира
//   активния език visually (същия жълт highlight стил като активната
//   nav икона в HomeScreen.js, за визуална консистентност); (4) самата
//   страница вече минава през LanguageUtil.getName() като всичко останало.
// ============================================

import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import LanguageUtil from '../../utils/LanguageUtil.js'
import { setLanguage } from '../../store/settingsSlice'

export default function SettingsComponents({ goTo }) {

    const dispatch = useDispatch()

    const currentLanguage = useSelector((state: any) => state.settings.language)

    function changeLanguage(value: 'bg' | 'en' | 'de') {
        dispatch(setLanguage(value))
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {LanguageUtil.getName('nav_einstellungen_text')}
            </Text>

            <Text style={styles.label}>
                {LanguageUtil.getName('language_text')}
            </Text>

            <View style={styles.row}>

                <View style={[styles.buttonWrap, currentLanguage === 'bg' && styles.buttonWrapActive]}>
                    <Button
                        title={LanguageUtil.getName('bulgarian_text')}
                        onPress={() => changeLanguage('bg')}
                    />
                </View>

                <View style={[styles.buttonWrap, currentLanguage === 'en' && styles.buttonWrapActive]}>
                    <Button
                        title={LanguageUtil.getName('english_text')}
                        onPress={() => changeLanguage('en')}
                    />
                </View>

                <View style={[styles.buttonWrap, currentLanguage === 'de' && styles.buttonWrapActive]}>
                    <Button
                        title={LanguageUtil.getName('german_text')}
                        onPress={() => changeLanguage('de')}
                    />
                </View>

            </View>

            <View style={styles.backButton}>
                <Button
                    title={LanguageUtil.getName('zurueck_zur_startseite_text')}
                    onPress={() => goTo('home')}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        padding: 20
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10
    },

    row: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 30
    },

    buttonWrap: {
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 6
    },

    buttonWrapActive: {
        borderColor: '#c9a800',
        backgroundColor: '#fff176'
    },

    backButton: {
        alignSelf: 'flex-start'
    }

})
