// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-19 (Europe/Sofia) — MUFU Muskel-Funktion ("3.05 Neuer Test - MUFU"
//   мокъп): BEURTEILUNG кутията с 3 бутона (KRAFT/DEHNBARKEIT/
//   BEWEGLICHKEIT) — само KRAFT получава реална таблица+диаграма тук (DK
//   потвърди фокус, AskUserQuestion); другите 2 остават placeholder,
//   аналогично на KOPF/SCHULTER/BECKEN/KNIE/FUSS в
//   KoerperHaltungComponent.tsx.
//
// 2026-08-20 — DK: "давай следващите стъпки от плана!" -> потвърди
//   (AskUserQuestion) DEHNBARKEIT + BEWEGLICHKEIT като следваща стъпка.
//   MuskelFunktionKraftComponent.tsx вече е напълно generic (само value/
//   onChange props, не съдържа нищо KRAFT-специфично в логиката си — само
//   в името на файла) — реизползваме СЪЩИЯ компонент (таблица 10 мускула x
//   R/L x 1-5 + същата точкова диаграма върху тялото) и за трите секции,
//   всяка вързана към собствено поле в MDPatientMeasurements
//   (muskelFunktionKraft/muskelFunktionDehnbarkeit/
//   muskelFunktionBeweglichkeit). Оценъчната скала/цветовете остават 1-5
//   както при KRAFT — DK не e уточнил различна скала за DEHNBARKEIT/
//   BEWEGLICHKEIT, лесно се коригира отделно, ако при преглед иска друго.
// ============================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';
import MuskelFunktionKraftComponent from './MuskelFunktionKraftComponent';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';

const SECTIONS = [
    { key: 'kraft', labelKey: 'kraft_text' },
    { key: 'dehnbarkeit', labelKey: 'dehnbarkeit_text' },
    { key: 'beweglichkeit', labelKey: 'beweglichkeit_text' }
];

export default function MuskelFunktionComponent({ measurement, callback }: any) {

    const [activeSection, setActiveSection] = useState('kraft');

    function updateKraft(updatedKraft: any) {

        // 🔹 ВАЖНО: callback-ът нагоре (Page8.tsx updateHandler -> setDraft)
        // НЕ увива резултата обратно в `new MDPatientMeasurements(...)` —
        // затова winаги трябва самите ние да го направим тук (същия
        // принцип като TestComponent1/4: `{...measurement}` копира само
        // собствените полета (_heightcm и т.н.), НЕ и getter-ите на
        // класа (bmi/whrindex/... — те са на prototype-а), така че без
        // това увиване draft-ът би станал plain object без getter-ите).
        const updated = new MDPatientMeasurements({
            ...measurement,
            muskelFunktionKraft: updatedKraft
        });

        callback(updated);
    }

    // 🔹 същия увиващ принцип като updateKraft по-горе, само различно поле
    function updateDehnbarkeit(updatedDehnbarkeit: any) {

        const updated = new MDPatientMeasurements({
            ...measurement,
            muskelFunktionDehnbarkeit: updatedDehnbarkeit
        });

        callback(updated);
    }

    function updateBeweglichkeit(updatedBeweglichkeit: any) {

        const updated = new MDPatientMeasurements({
            ...measurement,
            muskelFunktionBeweglichkeit: updatedBeweglichkeit
        });

        callback(updated);
    }

    return (

        <View style={styles.container}>

            {/* 🔹 BEURTEILUNG — KRAFT/DEHNBARKEIT/BEWEGLICHKEIT */}
            <View style={styles.leftBox}>

                <Text style={styles.leftBoxTitle}>
                    {LanguageUtil.getName('beurteilung_text')}
                </Text>

                {
                    SECTIONS.map((section) => (
                        <TouchableOpacity
                            key={section.key}
                            style={[
                                styles.sectionButton,
                                activeSection === section.key && styles.sectionButtonActive
                            ]}
                            onPress={() => setActiveSection(section.key)}
                        >
                            <Text style={[
                                styles.sectionButtonText,
                                activeSection === section.key && styles.sectionButtonTextActive
                            ]}>
                                {LanguageUtil.getName(section.labelKey)}
                            </Text>
                        </TouchableOpacity>
                    ))
                }

            </View>

            {/* 🔹 СЪДЪРЖАНИЕ */}
            <View style={styles.content}>

                {
                    activeSection === 'kraft' && (
                        <MuskelFunktionKraftComponent
                            value={measurement?.muskelFunktionKraft}
                            onChange={updateKraft}
                        />
                    )
                }

                {
                    activeSection === 'dehnbarkeit' && (
                        <MuskelFunktionKraftComponent
                            value={measurement?.muskelFunktionDehnbarkeit}
                            onChange={updateDehnbarkeit}
                        />
                    )
                }

                {
                    activeSection === 'beweglichkeit' && (
                        <MuskelFunktionKraftComponent
                            value={measurement?.muskelFunktionBeweglichkeit}
                            onChange={updateBeweglichkeit}
                        />
                    )
                }

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        width: '100%',
        gap: 10
    },

    leftBox: {
        width: 180,
        borderWidth: 1,
        borderColor: '#7cb342',
        backgroundColor: '#e8f5e9',
        padding: 8,
        gap: 6
    },

    leftBoxTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6
    },

    sectionButton: {
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 6,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },

    sectionButtonActive: {
        backgroundColor: '#fff176',
        borderColor: '#c9a800'
    },

    sectionButtonText: {
        fontSize: 12,
        fontWeight: '600'
    },

    sectionButtonTextActive: {
        color: '#333'
    },

    content: {
        flex: 1
    },

    placeholder: {
        padding: 20,
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic'
    }

});
