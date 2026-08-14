// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Screen split (1:1 with 3.25CCC_Test_Ergometri_
//   PROJEKT.pdf and Präsentation2.pptx): rebuilt as the dedicated
//   "Ergometrie" screen (button 4). Per the spec: body measurements/vitals +
//   a bike/treadmill device toggle that immediately hides irrelevant fields +
//   (bike) SOLL/IST Watt tables, surface- and weight-based (#31-39) +
//   Karvonen HR-zones table (45-95%, #40); (treadmill) Max Speed/Pace
//   (#27/#28, already implemented in ErgoResultComponent) + the SAME Karvonen
//   table, explicitly NO Watt SOLL/IST table ("keine Tabelle weil wir keine
//   Normwerte für Laufbandergometrie haben"). No lactate fields, no VO2max —
//   those belong on the Laktat-Ergometrie (5) / Spiro-Ergometrie (6) screens.
//   Fixed a real bug from the previous version: the bike/treadmill toggle
//   used to set a local `mode` state that was NEVER connected to
//   `measurements.ergometry.type` (the field every other component actually
//   reads to decide bike vs. run) — so switching the toggle here did nothing
//   to the rest of the app. The toggle now updates
//   `localMeasurements.ergometry.type` directly (same pattern as the
//   combined view in TestComponent7.jsx), so it's now the single source of
//   truth. The `PercentageComponent` from the previous version was dropped:
//   its table (unlabeled header row of blank cells) isn't wired to any real
//   Codex field and its %-of-norm value is already shown correctly inside
//   WattMeasurmentComponent's own %-cell, so keeping it would have meant
//   fabricating an empty table — flagging this removal in case the intent
//   was actually different.
// 2026-08-11 (Europe/Sofia) — Fixed a layout bug reported by the user
//   (screenshot showed the device-toggle buttons and the Watt-table title
//   overlapping the last row of TestMeasurmentComponent): this screen wraps
//   everything in a ScrollView now (it didn't before the split), and a
//   ScrollView's content area has unbounded/auto height. The old
//   `container` style still had `flex: 1` left over from when this content
//   sat inside a fixed-height, non-scrolling parent — a `flex: 1` View
//   inside an unbounded ScrollView content collapses to ~0 height in
//   react-native-web (it tries to grow into "remaining space" that doesn't
//   exist), while its child still paints at full size and overflows on top
//   of whatever renders next. Removed the redundant wrapping `<View
//   style={styles.container}>` around TestMeasurmentComponent and around the
//   Watt-table row (matching how the old, working monolith rendered
//   TestMeasurmentComponent directly as a ScrollView child, with no extra
//   flex:1 wrapper), and dropped `flex: 1` from the `row` style. `half` keeps
//   `flex: 1` — that one is safe, it only distributes width between the two
//   side-by-side Watt blocks inside a normal-height row, not stacking height.
// 2026-08-11 (Europe/Sofia) — Added a per-screen "Generate Fake Data" button:
//   fills ONLY this screen's own fields — IST Watt (#32, bike) or Max Speed
//   (#27, treadmill), whichever is currently relevant per the device toggle —
//   by cloning the current localMeasurements first, so it never wipes body
//   measurements or lactate/VO2max data entered on the other screens.
// 2026-08-11 (Europe/Sofia) — Localization pass, part 1: the "Ergometrie"
//   word in the device-toggle button wired to LanguageUtil.getName
//   ('ergometrie') (exact matching key already in Translations.js).
// 2026-08-11 (Europe/Sofia) — Localization pass, part 2 (after the user
//   pointed out "Körperoberfläche bezogen" and other strings were still
//   untranslated): added the missing keys to Translations.js instead of
//   leaving them hardcoded — laufband_text, koerperoberflaeche_bezogen_text,
//   koerpergewicht_bezogen_text, testdaten_generieren_text,
//   herzfrequenzzonen_karvonen_text — and wired all of them here.
// ============================================

import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Pressable, ScrollView, Button } from 'react-native'
import TestMeasurmentComponent from '../TestMeasurementsComponent'
import WattMeasurmentComponent from '../WattMeasurmentComponent'
import ErgoResultComponent from '../ErgoResultComponent'
import KarvonenZoneTableComponent from '../KarvonenZoneTableComponent'
import LanguageUtil from '../../utils/LanguageUtil'
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'

export default function TestComponent4({ measurements, callback }) {

    const [localMeasurements, setLocalMeasurements] = useState(
        new MDPatientMeasurements(measurements)
    );

    useEffect(() => {
        if (!measurements) return;
        setLocalMeasurements(new MDPatientMeasurements(measurements));
    }, [measurements]);

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

        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let updated = new MDPatientMeasurements(localMeasurements);

        if (updated?.ergometry?.type === 'run') {
            updated.maxspeed = random(8, 20);
        } else {
            updated.istLeistungMax = random(140, 380);
        }

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

            {/* DEVICE TOGGLE */}
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
            </View>

            {
                isRun ? (

                    // TREADMILL: Max Speed / Pace only — no Watt norm table
                    // ("keine Tabelle weil wir keine Normwerte für
                    // Laufbandergometrie haben").
                    <ErgoResultComponent
                        measurements={localMeasurements}
                        onUpdateMeasurements={onUpdateMeasurements}
                    />

                ) : (

                    // BIKE: SOLL/IST Watt, surface- and weight-based
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

            {/* KARVONEN HR ZONES 45-95% — Codex #40, same for bike + treadmill */}
            <KarvonenZoneTableComponent
                measurements={localMeasurements}
                title={LanguageUtil.getName('herzfrequenzzonen_karvonen_text')}
                minPercent={45}
                maxPercent={95}
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
