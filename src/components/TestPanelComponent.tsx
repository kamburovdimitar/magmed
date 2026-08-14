// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Screen split (1:1 with 3.25CCC_Test_Ergometri_
//   PROJEKT.pdf and Präsentation2.pptx): filled in the blank/placeholder
//   button labels ("Button 1", "Button 2", "Button 7") to match the Codex's
//   official 7-item "3.00 Test" menu order (Körpermaße/Vitalparameter,
//   Muskel-Funktion, Körper-Haltung, Ergometrie, Laktat-Ergometrie,
//   Spiro-Ergometrie, ALLE Tests) — the button→screen wiring in Page8.tsx
//   already matched this order, only the visible labels were placeholders.
//   No behavior changed, only the text on 3 buttons.
// 2026-08-11 (Europe/Sofia) — Muskel-Funktion (detail2) and Körper-Haltung
//   (detail3) are not built out yet, so per the user's request they
//   temporarily don't navigate anywhere: their onPress no longer calls
//   ergometryHandleClick (which both selects the button and switches
//   Page8.tsx's ergoView), and they're dimmed (styles.disabledButton) so
//   it's visually clear they're placeholders for now. Nothing else changed —
//   re-enable by restoring the onPress once those two screens are built.
// 2026-08-11 (Europe/Sofia) — Localization pass: the 7 button labels below
//   were hardcoded German/English text; Translations.js already has exact
//   matching keys for all 7 (koerpermassen_vitalparametern, muskel_funktion,
//   koerper_haltung, ergometrie, laktat_ergometrie, spiro_ergometrie,
//   alle_tests), so they now go through LanguageUtil.getName() like the
//   Test/New Test/Existing Tests buttons above already did. No new keys
//   added, no text changed for the current language — just wired.
// 2026-08-11 (Europe/Sofia) — New Test / Existing Tests / Save feature:
//   these two buttons had no onPress at all before (pure decoration) —
//   wired them to the onNewTest/onExistingTests callbacks Page8.tsx now
//   passes down, which run the unsaved-changes confirm gate before acting.
// ============================================

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import LanguageUtil from '../utils/LanguageUtil'

export default function TestPanelComponent({ handlerButton, onNewTest, onExistingTests }) {

    const [selected, setSelected] = useState(null)

    const ergometryHandleClick = (value) => {
        setSelected(value)
        handlerButton(value)
    }

    return (
        <View style={styles.container}>

            <View style={styles.top}>
                <TouchableOpacity style={styles.button}>
                    <Text>{LanguageUtil.getName('test_text')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.midle}>
                <TouchableOpacity style={styles.button} onPress={onNewTest}>
                    <Text>{LanguageUtil.getName('neuer_test_text')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onExistingTests}>
                    <Text>{LanguageUtil.getName('vorhandene_tests_test')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottom}>

                <TouchableOpacity
                    style={[styles.button, selected === "detail1" && styles.active]}
                    onPress={() => ergometryHandleClick("detail1")}
                >
                    <Text>{LanguageUtil.getName('koerpermassen_vitalparametern')}</Text>
                </TouchableOpacity>

                {/* Not built yet — temporarily doesn't navigate anywhere. */}
                <TouchableOpacity
                    style={[styles.button, styles.disabledButton]}
                >
                    <Text>{LanguageUtil.getName('muskel_funktion')}</Text>
                </TouchableOpacity>

                {/* Not built yet — temporarily doesn't navigate anywhere. */}
                <TouchableOpacity
                    style={[styles.button, styles.disabledButton]}
                >
                    <Text>{LanguageUtil.getName('koerper_haltung')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selected === "detail4" && styles.active]}
                    onPress={() => ergometryHandleClick("detail4")}
                >
                    <Text>{LanguageUtil.getName('ergometrie')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selected === "detail5" && styles.active]}
                    onPress={() => ergometryHandleClick("detail5")}
                >
                    <Text>{LanguageUtil.getName('laktat_ergometrie')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selected === "detail6" && styles.active]}
                    onPress={() => ergometryHandleClick("detail6")}
                >
                    <Text>{LanguageUtil.getName('spiro_ergometrie')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selected === "detail7" && styles.active]}
                    onPress={() => ergometryHandleClick("detail7")}
                >
                    <Text>{LanguageUtil.getName('alle_tests')}</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        borderWidth: 1
    },

    top: {
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    },

    midle: {
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        flexDirection: 'row',
    },

    bottom: {
        height: '70%',
        justifyContent: 'space-around',
        padding: 10,
        borderWidth: 1
    },

    button: {
        borderWidth: 1,
        padding: 12,
        alignItems: 'center'
    },

    active: {
        backgroundColor: 'yellow'
    },

    disabledButton: {
        opacity: 0.4
    }

})
