// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-19 (Europe/Sofia) — MUFU Körper-Haltung ("3.05 Neuer Test - MUFU"
//   мокъп): DK поиска това поле реализирано покрай Muskel-Funktion/KRAFT.
//   Мокъпът показва 6 категории (KOPF/WIRBELSÄULE/SCHULTER/BECKEN/KNIE/
//   FUSS) и снимка на тялото с 2 референтни прави линии (assets/body2.PNG,
//   вече съществуваща в архива — точно тя отговаря на мокъпа) за визуална
//   оценка на симетрия/подравняване. Само WIRBELSÄULE получава реална
//   таблица тук (реизползва вече готовия BeuterlungTable.tsx —
//   HWS/BWS/LWS x Lordose/Skoliose/... x schwer/mittelschwer/leicht/
//   normal) — DK потвърди (AskUserQuestion) фокус върху едно поле в тоя
//   първи кръг; KOPF/SCHULTER/BECKEN/KNIE/FUSS остават placeholder
//   бутони, аналогично на DEHNBARKEIT/BEWEGLICHKEIT в
//   MuskelFunktionKraftComponent.tsx — лесно се доразвиват после.
//
// 2026-08-20 — DK: "тези неща, които са от плана в тази страница ... и
//   които не са имплементирани" -> KOPF/SCHULTER/BECKEN/KNIE/FUSS вече
//   получават реални таблици тук, по същия модел като WIRBELSÄULE
//   (BeuterlungTable.tsx с новия optional `sections` prop — виж
//   constants/koerperHaltungSections.js за конкретните редове/термини).
//   Данните за всяка секция се пазят в собствено поле в
//   MDPatientMeasurements (koerperHaltungKopf/Schulter/Becken/Knie/Fuss),
//   аналогично на koerperHaltungWirbelsaeule.
//
// 2026-08-20 (2) — DK показа мокъп със ЗАСЕБНА кутия под BEURTEILUNG
//   панела с AUSWERTUNG/TRAININGSPLAN/ÜBUNGEN AUSWÄHLEN бутони (все още
//   липсваше изцяло тук). DK потвърди (AskUserQuestion) AUSWERTUNG първо,
//   с реално съдържание (виж KoerperHaltungAuswertungComponent.tsx —
//   обобщение на всички 6 категории наведнъж, read-only); TRAININGSPLAN/
//   ÜBUNGEN AUSWÄHLEN остават placeholder за сега, аналогично на
//   DEHNBARKEIT/BEWEGLICHKEIT в MuskelFunktionComponent.tsx.
//
// 2026-08-20 (3) — DK: "това не е картината с изкривяванията" — статичната
//   реферетна снимка (body2_posture.png) показваше само правите линии за
//   симетрия, но DK очакваше версията с червените криви (илюстриращи
//   реален пример за изкривяване на гръбнака — сколиоза/кифоза), която ни
//   изпрати директно (нов файл assets/body2_deviations.png). Тъй като
//   червените криви илюстрират точно WIRBELSÄULE находки (шиен + гръбначен
//   участък), картината се показва конкретно на WIRBELSÄULE и AUSWERTUNG
//   табовете; останалите (KOPF/SCHULTER/BECKEN/KNIE/FUSS) продължават да
//   показват обикновената реферетна снимка с правите линии — там целта е
//   обща проверка на симетрия/подравняване, не гръбначна крива.
// ============================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';
import BeuterlungTable from './BeuterlungTable';
import KoerperHaltungAuswertungComponent from './KoerperHaltungAuswertungComponent';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';
import {
    KOPF_SECTIONS,
    SCHULTER_SECTIONS,
    BECKEN_SECTIONS,
    KNIE_SECTIONS,
    FUSS_SECTIONS
} from '../constants/koerperHaltungSections';
// 🔹 2026-08-19 (2) — DK: webpack build гърмеше с "Module parse failed:
// Unexpected character '�'" за body2.PNG — asset loader-ът на ReNative
// матчва разширения само с малки букви (регекс case-sensitive), а
// оригиналният файл в assets/ е с главни "PNG". Тъй като Windows не
// различава главни/малки букви в имена на файлове (истинско rename риск
// от колизия със съществуващия body2.PNG), вместо преименуване е добавено
// ново копие с изцяло различно, гарантирано-уникално малки-букви име
// (body2_posture.png) — импортваме него оттук нататък.
import body2 from '../../assets/body2_posture.png';
// 🔹 2026-08-20 (3) — DK изпрати директно файла с червените криви
// (илюстрация на изкривяване на гръбнака) — виж коментара по-горе.
import body2Deviations from '../../assets/body2_deviations.png';

const SECTIONS = [
    { key: 'kopf', labelKey: 'kopf' },
    { key: 'wirbelsaeule', labelKey: 'wirbelsaeule' },
    { key: 'schulter', labelKey: 'schulter' },
    { key: 'becken', labelKey: 'becken' },
    { key: 'knie', labelKey: 'knie' },
    { key: 'fuss', labelKey: 'fuss' }
];

// 🔹 засебна кутия под BEURTEILUNG (виж мокъпа) — AUSWERTUNG има реално
// съдържание (KoerperHaltungAuswertungComponent.tsx); другите 2 placeholder.
const ACTION_BUTTONS = [
    { key: 'auswertung', labelKey: 'auswertung_text' },
    { key: 'trainingsplan', labelKey: 'trainingsplan_text' },
    { key: 'uebungen_auswaehlen', labelKey: 'uebungen_auswaehlen_text' }
];

const BODY2_ASPECT_RATIO = 473 / 686;
const BODY2_DEVIATIONS_ASPECT_RATIO = 491 / 698;

// 🔹 табове, на които показваме картината с червените криви (изкривяване
// на гръбнака) вместо обикновената реферетна снимка — виж коментара горе.
const DEVIATIONS_IMAGE_SECTIONS = ['wirbelsaeule', 'auswertung'];

export default function KoerperHaltungComponent({ measurement, callback }: any) {

    const [activeSection, setActiveSection] = useState('wirbelsaeule');

    function updateWirbelsaeule(updatedTable: any) {

        // 🔹 ВАЖНО: виж идентичния коментар в MuskelFunktionComponent.tsx —
        // callback-ът (Page8.tsx updateHandler) не увива резултата обратно
        // в MDPatientMeasurements, затова трябва ние да го направим тук,
        // иначе draft-ът губи класовите getter-и (bmi/whrindex/...).
        const updated = new MDPatientMeasurements({
            ...measurement,
            koerperHaltungWirbelsaeule: updatedTable
        });

        callback(updated);
    }

    // 🔹 същия увиващ принцип като updateWirbelsaeule по-горе, само различно поле
    function updateKopf(updatedTable: any) {
        callback(new MDPatientMeasurements({ ...measurement, koerperHaltungKopf: updatedTable }));
    }

    function updateSchulter(updatedTable: any) {
        callback(new MDPatientMeasurements({ ...measurement, koerperHaltungSchulter: updatedTable }));
    }

    function updateBecken(updatedTable: any) {
        callback(new MDPatientMeasurements({ ...measurement, koerperHaltungBecken: updatedTable }));
    }

    function updateKnie(updatedTable: any) {
        callback(new MDPatientMeasurements({ ...measurement, koerperHaltungKnie: updatedTable }));
    }

    function updateFuss(updatedTable: any) {
        callback(new MDPatientMeasurements({ ...measurement, koerperHaltungFuss: updatedTable }));
    }

    return (

        <View style={styles.container}>

            <View style={styles.leftColumn}>

                {/* 🔹 BEURTEILUNG — 6-те категории */}
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

                {/* 🔹 AUSWERTUNG / TRAININGSPLAN / ÜBUNGEN AUSWÄHLEN — засебна
                    кутия под BEURTEILUNG, виж мокъпа */}
                <View style={styles.actionBox}>

                    {
                        ACTION_BUTTONS.map((btn) => (
                            <TouchableOpacity
                                key={btn.key}
                                style={[
                                    styles.sectionButton,
                                    activeSection === btn.key && styles.sectionButtonActive
                                ]}
                                onPress={() => setActiveSection(btn.key)}
                            >
                                <Text style={[
                                    styles.sectionButtonText,
                                    activeSection === btn.key && styles.sectionButtonTextActive
                                ]}>
                                    {LanguageUtil.getName(btn.labelKey)}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }

                </View>

            </View>

            {/* 🔹 СЪДЪРЖАНИЕ */}
            <View style={styles.content}>

                {
                    activeSection === 'wirbelsaeule' && (
                        <BeuterlungTable
                            value={measurement?.koerperHaltungWirbelsaeule}
                            onChange={updateWirbelsaeule}
                        />
                    )
                }

                {
                    activeSection === 'kopf' && (
                        <BeuterlungTable
                            sections={KOPF_SECTIONS}
                            value={measurement?.koerperHaltungKopf}
                            onChange={updateKopf}
                        />
                    )
                }

                {
                    activeSection === 'schulter' && (
                        <BeuterlungTable
                            sections={SCHULTER_SECTIONS}
                            value={measurement?.koerperHaltungSchulter}
                            onChange={updateSchulter}
                        />
                    )
                }

                {
                    activeSection === 'becken' && (
                        <BeuterlungTable
                            sections={BECKEN_SECTIONS}
                            value={measurement?.koerperHaltungBecken}
                            onChange={updateBecken}
                        />
                    )
                }

                {
                    activeSection === 'knie' && (
                        <BeuterlungTable
                            sections={KNIE_SECTIONS}
                            value={measurement?.koerperHaltungKnie}
                            onChange={updateKnie}
                        />
                    )
                }

                {
                    activeSection === 'fuss' && (
                        <BeuterlungTable
                            sections={FUSS_SECTIONS}
                            value={measurement?.koerperHaltungFuss}
                            onChange={updateFuss}
                        />
                    )
                }

                {
                    activeSection === 'auswertung' && (
                        <KoerperHaltungAuswertungComponent measurement={measurement} />
                    )
                }

                {
                    (activeSection === 'trainingsplan' || activeSection === 'uebungen_auswaehlen') && (
                        <Text style={styles.placeholder}>
                            {LanguageUtil.getName('mufu_placeholder_text')}
                        </Text>
                    )
                }

            </View>

            {/* 🔹 РЕФЕРЕНТНА СНИМКА — статична, само за визуална проверка на
                подравняване/симетрия (или на WIRBELSÄULE/AUSWERTUNG —
                пример за изкривяване на гръбнака), виж коментара горе защо
                няма нужда от селектабилни точки тук. */}
            <View style={styles.imageWrap}>

                {
                    DEVIATIONS_IMAGE_SECTIONS.includes(activeSection)
                        ? (
                            <View style={[styles.imageAspect, { aspectRatio: BODY2_DEVIATIONS_ASPECT_RATIO }]}>
                                <Image
                                    source={body2Deviations}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </View>
                        )
                        : (
                            <View style={styles.imageAspect}>
                                <Image
                                    source={body2}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </View>
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

    leftColumn: {
        flex: 1,
        gap: 10
    },

    leftBox: {
        borderWidth: 1,
        borderColor: '#7cb342',
        backgroundColor: '#e8f5e9',
        padding: 8,
        gap: 6
    },

    actionBox: {
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#e8f1f5',
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
        paddingVertical: 8,
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
        flex: 2
    },

    placeholder: {
        padding: 20,
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic'
    },

    imageWrap: {
        flex: 1,
        alignItems: 'center'
    },

    imageAspect: {
        width: '100%',
        aspectRatio: BODY2_ASPECT_RATIO
    },

    image: {
        width: '100%',
        height: '100%'
    }

});
