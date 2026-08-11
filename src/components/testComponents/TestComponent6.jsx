// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Screen split (1:1 with 3.25CCC_Test_Ergometri_
//   PROJEKT.pdf and Präsentation2.pptx): rebuilt as the dedicated
//   "Spiro-Ergometrie" screen (button 6). Per the spec: body measurements/
//   vitals + VO2max/VT1/VT2 fields (Watt or km/h, Liter/min, ml/min/kg,
//   %VO2max, HF — #62-75 bike / #90-103 treadmill, already implemented by
//   VO2MaxComponent) + a %-of-VO2max heart-rate-zone table (45%-95%,
//   #76-86 bike / #104-114 treadmill). Explicitly NO SOLL/IST Watt table and
//   NO lactate fields on this screen (that's the Ergometrie/Laktat-Ergometrie
//   screens' job).
//   VO2max is derived from the same underlying ergometry stage data
//   (Stufe/Zeitpunkt/Watt/HF/Laktat) used by the Laktat-Ergometrie screen —
//   that data entry table intentionally does NOT live here too (the
//   presentation's Spiro-Ergometrie mockup doesn't show one either); it's
//   entered once (Laktat-Ergometrie screen) and shared via the same
//   `measurements.ergometryReports`, which is persisted on the patient record
//   (Redux) rather than re-derived per-screen. If VO2max shows "-" here, that
//   means no ergometry stage data has been entered yet for this patient.
//   The %-of-VO2max HR table reuses KarvonenZoneTableComponent (see that
//   file's changelog for the explicit assumption about which HR formula is
//   used, since the codebase has no separate VO2max-based HR formula).
// 2026-08-11 (Europe/Sofia) — Fixed the same layout bug as TestComponent4.jsx
//   and TestComponent5.jsx (device-toggle buttons overlapping the last row
//   of TestMeasurmentComponent): removed the leftover `flex: 1` wrapping
//   `container` View around TestMeasurmentComponent — inside this screen's
//   ScrollView (unbounded height), a `flex: 1` View collapses to ~0 height
//   while its content still paints at full size. See TestComponent4.jsx's
//   changelog for the full explanation.
// 2026-08-11 (Europe/Sofia) — Added a per-screen "Generate Fake Data" button.
//   This screen has no independently-editable fields of its own — VO2max/
//   VT1/VT2 are entirely derived from the same underlying ergometry stage
//   data as the Laktat-Ergometrie screen (see the file-level note above) —
//   so "this screen's own object" is that shared ergometry data. Regenerates
//   it the same way TestComponent5.jsx does (cloning localMeasurements
//   first, preserving the current device-type selection), so VO2max actually
//   has something to compute from. Flagging this as a judgment call: if the
//   intent was for this button to do nothing when there's no Spiro-specific
//   raw field to fake, that's easy to change.
// ============================================

import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Pressable, ScrollView, Button } from 'react-native'
import TestMeasurmentComponent from '../TestMeasurementsComponent'
import VO2MaxComponent from '../VO2MaxComponent'
import KarvonenZoneTableComponent from '../KarvonenZoneTableComponent'
import LactateModelPickerComponent from '../LactateModelPickerComponent'
import { ErgometryUtil } from '../../utils/ErgometrieUtil'
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'
import { ERGOMETRY_MODELS } from '../../constants/ergometryModels'

export default function TestComponent6({
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

            {/* DEVICE TOGGLE + LACTATE MODEL (used for VO₂max threshold selection) */}
            <View style={styles.topBar}>
                <Pressable
                    style={[styles.button, !isRun && styles.activeButton]}
                    onPress={() => setDeviceType("bike")}
                >
                    <Text>🚴 Ergometrie</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, isRun && styles.activeButton]}
                    onPress={() => setDeviceType("run")}
                >
                    <Text>🏃 Laufband</Text>
                </Pressable>

                <LactateModelPickerComponent
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                />
            </View>

            <VO2MaxComponent
                measurements={localMeasurements}
                selectedModel={selectedModel}
            />

            {/* %-OF-VO2MAX HR ZONES 45-95% — Codex #76-86 / #104-114 */}
            <KarvonenZoneTableComponent
                measurements={localMeasurements}
                title="Heart Rate Zones (%VO₂max, 45-95%)"
                minPercent={45}
                maxPercent={95}
            />

            <Button
                title="Generate Fake Data"
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
