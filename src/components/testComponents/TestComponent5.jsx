// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Screen split (1:1 with 3.25CCC_Test_Ergometri_
//   PROJEKT.pdf and Präsentation2.pptx): rebuilt as the dedicated
//   "Laktat-Ergometrie" screen (button 5). Per the spec/presentation
//   ("3.3-F Neuer Test - Laktat-Ergometrie"), this screen = everything from
//   the Ergometrie screen (body/vitals, device toggle, SOLL/IST Watt or
//   Laufband pace) PLUS: the ergometry stage data-entry table
//   (Stufe/Zeitpunkt/Watt-or-Speed/HF/Laktat, drives the IAS(LTP1)/IANS(LTP2)
//   calculation), the IAS/IANS Watt/Watt-kg/HF results block, the extended
//   Lactate Threshold view (adds %VO2max/%HFmax/Speed), and a %-of-IANS
//   heart-rate-zone table (60%-110%, Codex #51/#59) — that last table was
//   already correctly implemented as HeartRateZonesComponent, just never
//   reachable from its own dedicated screen before.
//   Previous version of this file was an unwired, hardcoded-empty-input
//   mockup duplicating the Ergometrie screen with no lactate content at all
//   — replaced entirely. Needs a lactate evaluation model selector
//   (Dickhuth/Freiburg/Linear/LTP/Keul/Keul Legacy) since every lactate
//   calculation depends on it; the selection is shared app-wide via
//   Page8.tsx's `model` state (passed in as `selectedModel` / `setModel`)
//   so the Interpretation panel and the Spiro-Ergometrie screen see the same
//   selection.
// 2026-08-11 (Europe/Sofia) — Fixed the same layout bug as TestComponent4.jsx
//   (device-toggle buttons / Lactate Model picker overlapping the last row
//   of TestMeasurmentComponent): removed the leftover `flex: 1` wrapping
//   `container` View around TestMeasurmentComponent and around the Watt-
//   table row — inside this screen's ScrollView (unbounded height), a
//   `flex: 1` View collapses to ~0 height while its content still paints at
//   full size, causing the next sibling to render on top of it. See
//   TestComponent4.jsx's changelog for the full explanation.
// 2026-08-11 (Europe/Sofia) — Added a per-screen "Generate Fake Data" button:
//   fills only this screen's own object — the ergometry stage data
//   (Stufe/Zeitpunkt/Watt/HF/Laktat) that drives the IAS/IANS calculation —
//   by cloning the current localMeasurements first (never touches body
//   measurements) and regenerating via ErgometryUtil.generateFakeErgometry(),
//   passing the CURRENTLY selected device type so it doesn't silently flip
//   the bike/treadmill toggle.
// 2026-08-11 (Europe/Sofia) — Localization pass, part 1: the "Ergometrie"
//   word in the device-toggle button wired to LanguageUtil.getName
//   ('ergometrie'). (The shared ErgometryTableComponent.tsx/
//   ErgometryResultsComponent.tsx this screen renders got their own
//   "Lactate" -> laktat fix directly in those files — see their changelogs.)
// 2026-08-11 (Europe/Sofia) — Localization pass, part 2 (after the user
//   pointed out "Körperoberfläche bezogen" was still untranslated): added
//   the missing keys to Translations.js — laufband_text,
//   koerperoberflaeche_bezogen_text, koerpergewicht_bezogen_text,
//   testdaten_generieren_text — and wired them here.
// ============================================

import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Pressable, ScrollView, Button } from 'react-native'
import TestMeasurmentComponent from '../TestMeasurementsComponent'
import WattMeasurmentComponent from '../WattMeasurmentComponent'
import ErgoResultComponent from '../ErgoResultComponent'
import ErgometryTableComponent from '../ErgometryTableComponent'
import ErgometryResultsComponent from '../ErgometryResultsComponent'
import LactateThresholdComponent from '../LactateThresholdComponent'
import HeartRateZonesComponent from '../HeartRateZonesComponent'
import LactateModelPickerComponent from '../LactateModelPickerComponent'
import LanguageUtil from '../../utils/LanguageUtil'
import { ErgometryUtil } from '../../utils/ErgometrieUtil'
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'
import { ERGOMETRY_MODELS } from '../../constants/ergometryModels'

export default function TestComponent5({
    measurements,
    callback,
    selectedModel: selectedModelProp,
    setModel
}) {

    const [localMeasurements, setLocalMeasurements] = useState(
        new MDPatientMeasurements(measurements)
    );

    const [selectedModel, setSelectedModel] = useState(
        selectedModelProp ?? ERGOMETRY_MODELS.DICKHUTH
    );

    useEffect(() => {
        if (!measurements) return;
        setLocalMeasurements(new MDPatientMeasurements(measurements));
    }, [measurements]);

    useEffect(() => {
        setModel && setModel(selectedModel);
    }, [selectedModel]);

    function onUpdateMeasurements(field, value) {

        let updated = {
            ...localMeasurements,
            [field]: value === '' ? null : isNaN(Number(value)) ? value : Number(value)
        };

        updated = new MDPatientMeasurements(updated);

        setLocalMeasurements(updated);

        callback(updated);
    }

    function setDeviceType(type) {

        let updated = new MDPatientMeasurements(localMeasurements);

        updated.ergometry.type = type;

        setLocalMeasurements(updated);

        callback(updated);
    }

    function onUpdateRow(index, field, value) {

        let data = [...localMeasurements.ergometry.data];

        data[index] = {
            ...data[index],
            [field]: value
        };

        let updated = new MDPatientMeasurements(localMeasurements);

        updated.ergometry.data = data;

        updated.ergometryReports = ErgometryUtil.validateAllModels(updated.ergometry.data);

        setLocalMeasurements(updated);

        callback(updated);
    }

    function genereateFakeDataHandler() {

        let updated = new MDPatientMeasurements(localMeasurements);

        updated.ergometry = ErgometryUtil.generateFakeErgometry({
            type: updated?.ergometry?.type
        });

        updated = new MDPatientMeasurements(updated);

        updated.ergometryReports = ErgometryUtil.validateAllModels(updated.ergometry.data);

        setLocalMeasurements(updated);

        callback(updated);
    }

    const isRun = localMeasurements?.ergometry?.type === 'run';

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.fullcontainer}>

            {/* TEST DATA */}
            <TestMeasurmentComponent
                measurements={localMeasurements}
                onUpdateMeasurements={onUpdateMeasurements}
            />

            {/* DEVICE TOGGLE + LACTATE MODEL */}
            <View style={styles.topBar}>
                <Pressable
                    style={[styles.button, !isRun && styles.activeButton]}
                    onPress={() => setDeviceType("bike")}
                >
                    <Text>🚴 {LanguageUtil.getName('ergometrie')}</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, isRun && styles.activeButton]}
                    onPress={() => setDeviceType("run")}
                >
                    <Text>🏃 {LanguageUtil.getName('laufband_text')}</Text>
                </Pressable>

                <LactateModelPickerComponent
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                />
            </View>

            {
                isRun ? (

                    <ErgoResultComponent
                        measurements={localMeasurements}
                        onUpdateMeasurements={onUpdateMeasurements}
                    />

                ) : (

                    <View style={styles.row}>

                        <View style={styles.half}>
                            <Text style={styles.title}>
                                {LanguageUtil.getName('koerperoberflaeche_bezogen_text')}
                            </Text>

                            <WattMeasurmentComponent
                                showlabel={true}
                                mode="surface"
                                measurements={localMeasurements}
                                onUpdateMeasurements={onUpdateMeasurements}
                            />
                        </View>

                        <View style={styles.half}>
                            <Text style={styles.title}>
                                {LanguageUtil.getName('koerpergewicht_bezogen_text')}
                            </Text>

                            <WattMeasurmentComponent
                                showlabel={false}
                                mode="weight"
                                measurements={localMeasurements}
                                onUpdateMeasurements={onUpdateMeasurements}
                            />
                        </View>

                    </View>

                )
            }

            {/* LACTATE STAGE DATA ENTRY -> drives IAS(LTP1)/IANS(LTP2) */}
            <ErgometryTableComponent
                measurements={localMeasurements}
                selectedModel={selectedModel}
                onUpdateRow={onUpdateRow}
            />

            <ErgometryResultsComponent
                measurements={localMeasurements}
                selectedModel={selectedModel}
            />

            <LactateThresholdComponent
                measurements={localMeasurements}
                selectedModel={selectedModel}
            />

            {/* %-OF-IANS HR ZONES 60-110% — Codex #51/#59 */}
            <HeartRateZonesComponent
                measurements={localMeasurements}
                selectedModel={selectedModel}
            />

            <Button
                title={LanguageUtil.getName('testdaten_generieren_text')}
                onPress={genereateFakeDataHandler}
            />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    fullcontainer: {
        gap: 10,
        paddingBottom: 30,
    },

    row: {
        flexDirection: 'row',
        borderWidth: 1
    },

    half: {
        flex: 1,
        borderWidth: 1,
        padding: 5
    },

    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 5
    },

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 10
    },

    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#eee'
    },

    activeButton: {
        backgroundColor: '#cde5ff'
    }
});
