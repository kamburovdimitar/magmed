// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass: the "Heart Rate Reserve"
//   section title and the "Reserve" row label now go through
//   LanguageUtil.getName (new keys herzfrequenzreserve_text, reserve_text —
//   added to Translations.js). Left the info-popup content (infoHandler's
//   title/description/formula/fields) untouched — that's a much larger,
//   separate localization task (every component's "i" tooltip), out of
//   scope here. Also left "70%"/"80%"/"90%" — those are numbers, not words.
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LabelAndInputTextComponent from './LabelAndInputComponent';
import TitleWithInfoComponent from './TitleWithInfoComponent'
import LanguageUtil from '../utils/LanguageUtil';
import { openPopup } from '../services/PopupService';


export default function HeartRateZoneComponent({ measurements }) {

    function infoHandler() {

        openPopup({

            title: "Heart Rate Reserve",

            description:
                "Displays the patient's Heart Rate Reserve (HRR) and the calculated target heart rates for common training intensities using the Karvonen method.",

            formula:
                "HRR = HRmax - HRrest\nTarget HR = HRrest + (HRR × %)",

            source:
                "Calculated from the patient's Resting Heart Rate and Maximum Heart Rate using the Karvonen Heart Rate Reserve method.",
            fields: [

                "Resting Heart Rate = CODEX #23 - heartraterest\nMeasured heart rate at rest.",

                "Maximum Heart Rate = CODEX #24 - heartratemax\nMaximum heart rate achieved during the ergometry test.",

                "Heart Rate Reserve = Derived Value - heartrateReserve\nFormula: HRmax - HRrest.",

                "Target Heart Rate 70% = Derived Value - hrr70\nFormula: HRrest + ((HRmax - HRrest) × 0.70).\nImplementation: CodexUtil.calculateKarvonenHeartRate().",

                "Target Heart Rate 80% = Derived Value - hrr80\nFormula: HRrest + ((HRmax - HRrest) × 0.80).\nImplementation: CodexUtil.calculateKarvonenHeartRate().",

                "Target Heart Rate 90% = Derived Value - hrr90\nFormula: HRrest + ((HRmax - HRrest) × 0.90).\nImplementation: CodexUtil.calculateKarvonenHeartRate()."

            ]

        });

    }

    return (

        <View style={styles.block}>



            <TitleWithInfoComponent title={`  ${LanguageUtil.getName('herzfrequenzreserve_text')}`} infoHandler={infoHandler} />

            <LabelAndInputTextComponent
                label={LanguageUtil.getName('reserve_text')}
                measure="bpm"
                value={measurements?.heartrateReserve}
                isEditable={false}
            />

            <LabelAndInputTextComponent
                label="70%"
                measure="bpm"
                value={measurements?.hrr70?.toFixed(0)}
                isEditable={false}
            />

            <LabelAndInputTextComponent
                label="80%"
                measure="bpm"
                value={measurements?.hrr80?.toFixed(0)}
                isEditable={false}
            />

            <LabelAndInputTextComponent
                label="90%"
                measure="bpm"
                value={measurements?.hrr90?.toFixed(0)}
                isEditable={false}
            />

        </View>

    );

}

const styles = StyleSheet.create({

    block: {
        borderWidth: 1,
        padding: 10,
        marginTop: 20,
        gap: 8
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 10
    }

});