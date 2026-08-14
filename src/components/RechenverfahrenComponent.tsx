// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass, part 3 (Page11.tsx, the
//   separate "PAGE 11 - LAKTAT" screen, was never wired to LanguageUtil at
//   all): the "Rechenverfahren" section title already had a matching key
//   (`rechenverfahren`), so it now goes through LanguageUtil.getName
//   ('rechenverfahren'). Left the six model names (Dickhuth, Freiburger,
//   etc.) hardcoded — only half of them have loosely-matching keys in
//   Translations.js (keul_modell/freiburger_modell/dichut_modell), and the
//   exact label text here differs from those keys' values anyway;
//   translating half would look worse than leaving all six as-is (same
//   call made for LactateModelPickerComponent.tsx in an earlier pass).
// ============================================

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ERGOMETRY_MODELS } from '../constants/ergometryModels';
import LanguageUtil from '../utils/LanguageUtil';

export default function RechenverfahrenComponent({ value, setValue }: any) {

    const options = [
        { key: ERGOMETRY_MODELS.DICKHUTH, label: 'Dickhuth' },
        { key: ERGOMETRY_MODELS.FREIBURG, label: 'Freiburger (L_min + 2.0 mmol/l)' },
        { key: ERGOMETRY_MODELS.LINEAR, label: 'Stückweise lineare Regression' },
        { key: ERGOMETRY_MODELS.LTP, label: 'Stückweise lineare Regression (LTP)' },
        { key: ERGOMETRY_MODELS.KEUL, label: 'Keul' },
        { key: ERGOMETRY_MODELS.KEUL_LEGACY, label: 'Keul Legacy' }
    ];

    return (
        <View style={styles.container}>

            <Text style={styles.title}>{LanguageUtil.getName('rechenverfahren')}</Text>

            {
                options.map((item, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.row}
                        onPress={() => setValue(item.key)}
                    >
                        <Text style={styles.radio}>
                            {value === item.key ? '🔘' : '⚪'}
                        </Text>

                        <Text style={styles.label}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))
            }

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        backgroundColor: '#f0e8d8'
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 5,
        padding: 6,
        backgroundColor: '#d9e2ef'
    },

    radio: {
        width: 30,
        textAlign: 'center'
    },

    label: {
        flex: 1
    }

})