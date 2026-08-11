// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Screen split (1:1 with 3.25CCC_Test_Ergometri_
//   PROJEKT.pdf and Präsentation2.pptx): this screen used to render EVERYTHING
//   (body measurements + bike/run toggle + SOLL/IST Watt + HR reserve +
//   ergometry stage table + IAS/IANS results + lactate threshold + VO2max +
//   %IANS HR zones + Print/Generate-Fake-Data/Interpretation buttons) on one
//   screen. Per the Codex's 7-button "3.00 Test" menu and the presentation's
//   "3.1-F Neuer Test - Körpermaße und Vitalparameter" mockup, this button
//   ("detail1") should show ONLY the body measurements / vital parameters
//   block (Codex #10-25) — nothing ergometry/lactate/VO2max related.
//   Everything that used to live here (the combined view) was moved as-is to
//   TestComponent7.jsx, which is now the real content behind the "ALLE Tests"
//   (button 7) menu item — that item is explicitly meant to show the combined
//   view per the Codex, so no functionality was lost, only relocated to the
//   correct button. Page8.tsx's renderTestView() was updated to match (no
//   longer passes onPrint/onInterpration/onGenereateFakeData/setModel here —
//   those now flow to TestComponent7 instead).
// 2026-08-11 (Europe/Sofia) — Added a per-screen "Generate Fake Data" button:
//   the user wants one under every split screen that fills ONLY that
//   screen's own object, while the one on the last page ("ALLE Tests") keeps
//   filling everything. Here that means only the body measurement / vital
//   fields this screen actually shows (Codex #10-25) — it clones the
//   CURRENT localMeasurements (so it never wipes ergometry/lactate data
//   entered on the other screens) and only overwrites the vitals fields,
//   using the exact same random ranges as Page8.tsx's original
//   onGenereateFakeData().
// ============================================

import React from 'react'
import { View, ScrollView, StyleSheet, Button } from 'react-native'
import TestMeasurmentComponent from '../TestMeasurementsComponent'
import { useEffect, useState } from "react";
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'

export default function TestComponent1({
    callback,
    measurement
}) {

    const [localMeasurements, setLocalMeasurements] = useState(new MDPatientMeasurements(measurement));

    useEffect(() => {

        if (!measurement) return;

        setLocalMeasurements(new MDPatientMeasurements(measurement));

    }, [measurement]);

    function onUpdateMeasurements(field, value) {

        let updated = {
            ...localMeasurements,
            [field]: value === '' ? null : isNaN(Number(value)) ? value : Number(value)
        };

        updated = new MDPatientMeasurements(updated);

        setLocalMeasurements(updated);

        callback(updated);

    }

    function genereateFakeDataHandler() {

        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let updated = new MDPatientMeasurements(localMeasurements);

        updated.age = random(18, 70);

        updated.heightcm = random(160, 200);
        updated.weightkg = random(55, 110);

        updated.waistcm = random(70, 120);
        updated.hipcm = random(85, 125);

        updated.bodyfatpercent = random(8, 35);

        updated.bloodpressurerestsystolic = random(105, 135);
        updated.bloodpressurerestdiastolic = random(65, 90);

        updated.bloodpressuremaxsystolic = random(160, 230);
        updated.bloodpressuremaxdiastolic = random(80, 110);

        updated.heartraterest = random(50, 85);

        let expected = 220 - updated.age;
        updated.heartratemax = random(expected - 15, expected + 10);

        setLocalMeasurements(updated);

        callback(updated);

    }

    return (

        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}
        >

            <TestMeasurmentComponent
                measurements={localMeasurements}
                onUpdateMeasurements={onUpdateMeasurements}
            />

            <Button
                title="Generate Fake Data"
                onPress={genereateFakeDataHandler}
            />

        </ScrollView>

    );
}

const styles = StyleSheet.create({

    container: {
        gap: 10,
        paddingBottom: 30,
    }

})
