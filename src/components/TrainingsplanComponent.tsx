// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-20 (Europe/Sofia) — DK: "изтрий всичко старо на Training (❤️)
//   страницата, имплементирай PDF по PDF" — старият Page10.tsx съдържаше
//   само мъртъв/несвързан код (fake UsersProxy търсачка, копирано от
//   другаде, бутони с console.log(true)) — изтрит изцяло (виж Page10.tsx).
//
//   Този компонент е новият контейнер за целия "Training – Gesundheit"
//   модул (5 PDF-а): горните 4 таба (Kein Test/Ergometrie/Laktat
//   Ergometrie/Spiro Ergometrie — виж 5.90CCCGESUNDHEITS_Training.pdf:
//   "Aktiv werden nur die Knöpfe ..., für die auch ein, oder mehrere,
//   Tests in Background vorhanden sind" — засега ВСИЧКИ 4 са кликаеми,
//   без реална проверка "има ли тест в background", защото моделът все
//   още няма изричен testType флаг на ergometryReports — маркирано като
//   опростяване за DK да потвърди), плюс лявото контролно табло:
//     Automatik EIN/AUS      — превключвател, самата decision-tree логика
//                              е placeholder (DK потвърди: чакаме
//                              отделния "Einstellungen" документ)
//     Nicht gewählte Bereiche
//     ausblenden             — препредаден през measurement.
//                              trainingsplanKeinTest.hideUnselected
//     Trainings-Woche
//     GESTALTEN              — тълкуван като toggle между 'grundeinstellung'
//                              (read-only, авто-изчислено) и 'individuell'
//                              (редактируемо) editMode — виж 5.21b мокъпа,
//                              страници 1 vs 2, и DK-коментара в
//                              TrainingsplanKeinTestComponent.tsx.
//     LEERE Tabellen         — изчиства 8-те стадия (active=false, празни
//                              стойности) за построяване от нула.
//     Personenspezifische
//     Standardwerte          — Abrufen/Speichern/Zurücksetsvane свързани с
//                              MDPatient.trainingsplanStandardwerte (виж
//                              MDPatient.tsx) — преживяват отделния тест.
//
//   REHABILITATION (страничен бутон от старите мокъп screenshot-и) НЕ е
//   имплементиран — не се среща в нито един от 5-те предоставени PDF-а,
//   извън scope засега (флагнато за DK).
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';
import { MDPatient } from '../model/MDPatient';
import { KEIN_TEST_DEFAULT_STAGES } from '../constants/trainingsplanKeinTestDefaults';
import TrainingsplanKeinTestComponent from './TrainingsplanKeinTestComponent';

const TABS = [
    { key: 'keinTest', labelKey: 'kein_test_text' },
    { key: 'ergometrie', labelKey: 'training_ergometrie_text' },
    { key: 'laktatErgometrie', labelKey: 'training_laktat_ergometrie_text' },
    { key: 'spiroErgometrie', labelKey: 'training_spiro_ergometrie_text' }
];

export default function TrainingsplanComponent({ measurement, callback, patient, patientCallback }: any) {

    const [activeTab, setActiveTab] = useState('keinTest');

    const kt = measurement?.trainingsplanKeinTest ?? {};
    const editMode = kt.editMode ?? 'grundeinstellung';
    const automatikEnabled = kt.automatikEnabled ?? false;
    const hideUnselected = kt.hideUnselected ?? false;

    function updateKt(patch: any) {

        callback(
            new MDPatientMeasurements({
                ...measurement,
                trainingsplanKeinTest: {
                    ...kt,
                    ...patch
                }
            })
        );

    }

    function toggleEditMode() {
        updateKt({ editMode: editMode === 'individuell' ? 'grundeinstellung' : 'individuell' });
    }

    function toggleAutomatik() {
        // 🔹 "Automatik AUS: Alle Trainingsparameter werden in Standard
        // Zustand zurückgesetzt" — при изключване връщаме към Grundein-
        // stellung defaults (override-ите и стадиите се изчистват).
        if (automatikEnabled) {
            updateKt({
                automatikEnabled: false,
                editMode: 'grundeinstellung',
                hfruheOverride: null,
                hfmaxOverride: null,
                wattMaxOverride: null,
                stages: KEIN_TEST_DEFAULT_STAGES
            });
        } else {
            updateKt({ automatikEnabled: true });
        }
    }

    function clearStages() {

        const emptied = KEIN_TEST_DEFAULT_STAGES.map((s) => ({
            ...s,
            active: false,
            trainingsblock: ''
        }));

        updateKt({ stages: emptied, editMode: 'individuell' });

    }

    function speichernStandardwerte() {

        if (!patientCallback || !patient) return;

        patientCallback(
            new MDPatient({
                ...patient,
                trainingsplanStandardwerte: {
                    ...(patient.trainingsplanStandardwerte ?? {}),
                    keinTest: kt
                }
            })
        );

    }

    function abrufenStandardwerte() {

        const saved = patient?.trainingsplanStandardwerte?.keinTest;

        if (!saved) return;

        updateKt({ ...saved });

    }

    function zuruecksetzenStandardwerte() {

        if (!patientCallback || !patient) return;

        patientCallback(
            new MDPatient({
                ...patient,
                trainingsplanStandardwerte: {
                    ...(patient.trainingsplanStandardwerte ?? {}),
                    keinTest: null
                }
            })
        );

    }

    return (
        <View style={styles.container}>

            {/* ===== TOP TABS ===== */}
            <View style={styles.tabRow}>
                {
                    TABS.map((tab) => (
                        <Pressable
                            key={tab.key}
                            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                                {LanguageUtil.getName(tab.labelKey)}
                            </Text>
                        </Pressable>
                    ))
                }
            </View>

            <View style={styles.body}>

                {/* ===== LEFT CONTROL PANEL ===== */}
                <View style={styles.controlPanel}>

                    <Pressable style={styles.controlButton} onPress={toggleAutomatik}>
                        <Text style={styles.controlButtonText}>
                            {LanguageUtil.getName('automatik_ein_aus_text')} — {automatikEnabled ? LanguageUtil.getName('ja') : LanguageUtil.getName('nein')}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={styles.controlCheckboxRow}
                        onPress={() => updateKt({ hideUnselected: !hideUnselected })}
                    >
                        <Text style={styles.checkboxGlyph}>{hideUnselected ? '☑' : '☐'}</Text>
                        <Text style={styles.controlCheckboxText}>{LanguageUtil.getName('nicht_gewaehlte_bereiche_ausblenden_text')}</Text>
                    </Pressable>

                    <Pressable style={styles.controlButton} onPress={toggleEditMode}>
                        <Text style={styles.controlButtonText}>
                            {LanguageUtil.getName('trainings_woche_gestalten_text')}
                            {editMode === 'individuell' ? ' ✓' : ''}
                        </Text>
                    </Pressable>

                    <Pressable style={styles.controlButton} onPress={clearStages}>
                        <Text style={styles.controlButtonText}>{LanguageUtil.getName('leere_tabellen_text')}</Text>
                    </Pressable>

                    <View style={styles.standardwerteBox}>
                        <Text style={styles.standardwerteTitle}>{LanguageUtil.getName('personenspezifische_standardwerte_text')}</Text>
                        <Pressable style={styles.standardwerteButton} onPress={abrufenStandardwerte}>
                            <Text style={styles.standardwerteButtonText}>{LanguageUtil.getName('abrufen_text')}</Text>
                        </Pressable>
                        <Pressable style={styles.standardwerteButton} onPress={speichernStandardwerte}>
                            <Text style={styles.standardwerteButtonText}>{LanguageUtil.getName('speichern')}</Text>
                        </Pressable>
                        <Pressable style={styles.standardwerteButton} onPress={zuruecksetzenStandardwerte}>
                            <Text style={styles.standardwerteButtonText}>{LanguageUtil.getName('zuruecksetzen')}</Text>
                        </Pressable>
                    </View>

                </View>

                {/* ===== MAIN CONTENT ===== */}
                <View style={styles.content}>
                    {
                        activeTab === 'keinTest'
                            ? <TrainingsplanKeinTestComponent measurement={measurement} callback={callback} />
                            : <Text style={styles.placeholder}>{LanguageUtil.getName('mufu_placeholder_text')}</Text>
                    }
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    // 🔹 2026-08-21 — DK: "не ми харесва, много е ситно всичко" — виж
    // идентичния коментар в TrainingsplanKeinTestComponent.tsx. Само CSS
    // размери/spacing преработени тук, wiring непроменен. `container`
    // добива изрично `width:'100%'` (не разчитаме само на default stretch
    // на родителя).
    container: {
        flex: 1,
        width: '100%',
        gap: 14
    },

    tabRow: {
        flexDirection: 'row',
        gap: 6
    },

    tab: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#eef3f7'
    },

    tabActive: {
        backgroundColor: '#fff176',
        borderColor: '#c9a800'
    },

    tabText: {
        fontSize: 15,
        fontWeight: '600'
    },

    tabTextActive: {
        color: '#000'
    },

    body: {
        flex: 1,
        flexDirection: 'row',
        gap: 14
    },

    controlPanel: {
        width: 230,
        gap: 10
    },

    controlButton: {
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#ffffff',
        padding: 14
    },

    controlButtonText: {
        fontSize: 13.5,
        fontWeight: '600',
        textAlign: 'center'
    },

    controlCheckboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#ffffff',
        padding: 12
    },

    controlCheckboxText: {
        fontSize: 13,
        flex: 1
    },

    checkboxGlyph: {
        fontSize: 18
    },

    standardwerteBox: {
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#eef3f7',
        padding: 12,
        gap: 8
    },

    standardwerteTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4
    },

    standardwerteButton: {
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#fff176',
        paddingVertical: 10
    },

    standardwerteButtonText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center'
    },

    content: {
        flex: 1
    },

    placeholder: {
        fontSize: 15,
        fontStyle: 'italic',
        color: '#777',
        padding: 20,
        textAlign: 'center'
    }

});
