// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — New component, created as part of splitting the
//   "Test" screens 1:1 with the MAGMED Codex / 3.25CCC_Test_Ergometri_PROJEKT.pdf
//   spec. Both the "Ergometrie" screen (Karvonen HR-zones table, 45-95%,
//   Codex #40) and the "Spiro-Ergometrie" screen (%-of-VO2max HR-zones table,
//   45-95%, Codex #76-86 / #104-114) need a 45-95% heart-rate-zone table that
//   no existing component rendered. MDPatientMeasurements already computes
//   the real Karvonen values for every percent via its `heartRateZones`
//   getter (45..110%) — this component just renders that existing, real
//   calculation as a table, filtered to a percent range. NOTE (explicit
//   assumption, flagged for the user): the Codex names the Spiro-Ergometrie
//   table "%-of-VO2max", but the codebase has no separate VO2max-based HR
//   formula — only the Karvonen HRR formula. Rather than fabricate a new,
//   unverified formula, this reuses the real Karvonen calculation for both
//   screens. If MAGMED's real %VO2max HR formula differs, this table should
//   be revisited once that formula is confirmed.
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TableCellComponent from './TableCellComponent';
import TitleWithInfoComponent from './TitleWithInfoComponent';
import { openPopup } from '../services/PopupService';

export default function KarvonenZoneTableComponent({
    measurements,
    title = 'Heart Rate Zones (Karvonen, %)',
    minPercent = 45,
    maxPercent = 95
}) {

    function infoHandler() {

        openPopup({

            title: "Heart Rate Zones (Karvonen)",

            description:
                "Displays the target heart rate for each training intensity, calculated from the "
                + "patient's Heart Rate Reserve (Karvonen method).",

            formula:
                "Target HR = HRrest + (HRmax - HRrest) × (% / 100)",

            source:
                "Calculated from the patient's Resting Heart Rate (#23) and Maximum Heart Rate (#24) "
                + "using the Karvonen Heart Rate Reserve method.",

            fields: [

                "HRrest = Resting Heart Rate (CODEX #23)",

                "HRmax = Maximum Heart Rate (CODEX #24)",

                `Displayed zones: ${minPercent}% - ${maxPercent}% HRR`

            ]

        });

    }

    const zones = (measurements?.heartRateZones ?? []).filter(
        (z) => z.percent >= minPercent && z.percent <= maxPercent
    );

    if (!zones.length) return null;

    return (

        <View style={styles.container}>

            <TitleWithInfoComponent title={title} infoHandler={infoHandler} />

            <View style={styles.row}>

                {
                    zones.map((zone) => (

                        <View key={zone.percent} style={styles.cell}>
                            <Text style={styles.header}>{zone.percent}%</Text>
                        </View>

                    ))
                }

            </View>

            <View style={styles.row}>

                {
                    zones.map((zone) => (

                        <View key={zone.percent} style={styles.cell}>
                            <TableCellComponent value={zone.bpm ? String(Math.round(zone.bpm)) : "-"} />
                        </View>

                    ))
                }

            </View>

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        marginTop: 20,
        borderWidth: 1,
        padding: 10
    },

    row: {
        flexDirection: 'row'
    },

    cell: {
        flex: 1,
        alignItems: 'center'
    },

    header: {
        marginBottom: 4,
        fontWeight: 'bold'
    }

});
