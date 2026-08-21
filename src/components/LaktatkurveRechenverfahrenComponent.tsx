// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-18 (Europe/Sofia) — Стъпка от плана за "3.32 CCC Rechenverfahren
// Beispiele / Datenerfassung und Auswertung": 4-и таб в новия Page11
// под-навигатор ("Aktuell / Überlagern / Trainingsbereich / Rechenverfahren").
// V1 обхват — само преглед/прозрачност на 6-те съществуващи модела +
// пряк линк към вече построения "Business-Logic-Tracer"
// (public/tools/business_logic_tracer.html), който вече смята стъпка по
// стъпка всеки модел. Дълбок одит на самите Rechenverfahren/Datenerfassung
// изисквания от 3.32 (виж laktatkurve_plan.html) следва в следваща стъпка —
// нарочно НЕ преоткриваме логика тук, само подреждаме съществуващото ясно
// в собствен, самостоятелен таб.
// ============================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';

const MODEL_INFO = [
    { key: 'dickhuth', label: 'Dickhuth', descKey: 'rechenverfahren_dickhuth_desc_text' },
    { key: 'freiburg', label: 'Freiburger', descKey: 'rechenverfahren_freiburg_desc_text' },
    { key: 'linear', label: 'Linear', descKey: 'rechenverfahren_linear_desc_text' },
    { key: 'ltp', label: 'Stückweise lineare Regression (LTP)', descKey: 'rechenverfahren_ltp_desc_text' },
    { key: 'keul', label: 'Keul', descKey: 'rechenverfahren_keul_desc_text' },
    { key: 'keul_legacy', label: 'Keul Legacy', descKey: 'rechenverfahren_keul_legacy_desc_text' }
];

export default function LaktatkurveRechenverfahrenComponent({ model = null }: any) {

    return (
        <View style={styles.container}>

            <Text style={styles.intro}>
                {LanguageUtil.getName('rechenverfahren_intro_text')}
            </Text>

            <View style={styles.list}>
                {MODEL_INFO.map((m) => (
                    <View
                        key={m.key}
                        style={[styles.row, model === m.key && styles.rowActive]}
                    >
                        <Text style={[styles.rowLabel, model === m.key && styles.rowLabelActive]}>
                            {m.label}
                        </Text>
                        <Text style={styles.rowDesc}>
                            {LanguageUtil.getName(m.descKey)}
                        </Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={styles.tracerButton}
                onPress={() => {
                    if (typeof window !== 'undefined' && window.open) {
                        window.open('/tools/business_logic_tracer.html', '_blank');
                    }
                }}
            >
                <Text style={styles.tracerButtonText}>
                    🔍 {LanguageUtil.getName('logik_pruefen_text')}
                </Text>
            </TouchableOpacity>

            <Text style={styles.todoNote}>
                🚧 {LanguageUtil.getName('rechenverfahren_todo_text')}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        borderColor: '#dde3ea',
        borderRadius: 8,
        padding: 12,
        marginTop: 10
    },

    intro: {
        fontSize: 12.5,
        color: '#444',
        marginBottom: 10
    },

    list: {
        borderWidth: 1,
        borderColor: '#dde3ea',
        borderRadius: 6,
        marginBottom: 12
    },

    row: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eef2f7'
    },

    rowActive: {
        backgroundColor: '#eef4ff'
    },

    rowLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333'
    },

    rowLabelActive: {
        color: '#2f6fed'
    },

    rowDesc: {
        fontSize: 11.5,
        color: '#6b7789',
        marginTop: 2
    },

    tracerButton: {
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 18,
        backgroundColor: '#fff'
    },

    tracerButtonText: {
        fontSize: 12.5,
        fontWeight: '600',
        color: '#333'
    },

    todoNote: {
        fontSize: 11,
        color: '#8a6d1a',
        marginTop: 10,
        textAlign: 'center',
        fontStyle: 'italic'
    }

});
