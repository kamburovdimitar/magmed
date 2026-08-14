// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass: "Laufband Leistung", "Max
//   Speed", the "Körper Oberfläche/Gewicht bezogen" titles, and the "SOLL"/
//   "IST"/"% Norm" row labels were hardcoded German/English text with no
//   language-toggle support. Added new keys to Translations.js
//   (laufband_leistung_text, max_speed_text, koerperoberflaeche_bezogen_text,
//   koerpergewicht_bezogen_text, soll_text, ist_text, prozent_der_norm_text)
//   and wired them here. The bike-mode titles now use the same keys as the
//   ones in TestComponent4.jsx/TestComponent5.jsx's inline Watt-block titles
//   (this file previously spelled them slightly differently — "Körper
//   Oberfläche bezogen" with a space vs. "Körperoberfläche bezogen" without —
//   both now render identically). Left "min/km", "Watt", "Watt/kg" and "%"
//   hardcoded — those are units, identical in German and English.
// ============================================

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LabelAndInputTextComponent from './LabelAndInputComponent'
import TitleWithInfoComponent from './TitleWithInfoComponent'
import LanguageUtil from '../utils/LanguageUtil'
import { openPopup } from '../services/PopupService';

export default function ErgoResultComponent({
    measurements,
    ergoType,
    onUpdateMeasurements
}) {

    function laufbandInfoHandler() {

        openPopup({

            title: "Running Ergometry Performance",

            description:
                "Displays the patient's maximal running performance achieved during the treadmill ergometry test. "
                + "The maximum speed is entered manually and the corresponding running pace is calculated automatically.",

            formula:
                "Pace (min/km) = 60 / Speed (km/h)",

            source:
                "Maximum running speed corresponds to the highest successfully completed treadmill stage during the test.",

            fields: [

                "Maximum Speed = CODEX #27 - maxspeed\nMaximum achieved running speed during the treadmill test.\nUnit: km/h.",

                "Running Pace = CODEX #28 - minperkm\nCalculated from maximum speed.\nFormula: 60 / Speed.\nImplementation: CodexUtil.calculatePace().",

                "Treadmill Ergometry = CODEX #30\nIndicates that the current test type is treadmill based."

            ]

        });

    }

    function infoHandler() {

        openPopup({

            title: "Ergometry Performance",

            description:
                "Displays the patient's measured exercise performance compared with the expected reference values. "
                + "Results are shown both relative to body surface area and body weight.",

            formula:
                "IST % = (Measured Performance / Expected Performance) × 100",

            source:
                "Reference values are calculated from patient characteristics. "
                + "Measured performance corresponds to the maximum achieved workload during the ergometry test.",

            fields: [

                "SOLL = Expected (reference) performance.\nReference value calculated from age, gender and body surface area or body weight.",

                "IST = Measured maximum performance.\nRepresents the maximum workload achieved during the ergometry test.",

                "Watt = Absolute power output.\nMeasured independently of body size.",

                "Watt/kg = Relative power output.\nAllows comparison between subjects with different body weights.",

                "% Norm = Percentage of expected performance.\nFormula: IST × 100 / SOLL.",

                "",

                "SOLL Watt = CODEX #31 - sollWatt\nExpected performance based on body surface area.\nSource: ErgometryUtil.getSollLeistungNorm().",

                "IST Watt = CODEX #32 - istWatt\nMaximum achieved workload entered by the user.\nSource field: _istLeistungMax.",

                "SOLL Watt/kg = CODEX #33 - sollWattKg\nFormula: #31 / Body Weight.\nImplementation: CodexUtil.calculateSollWattKg().",

                "IST Watt/kg = CODEX #34 - istWattKg\nFormula: #32 / Body Weight.\nImplementation: CodexUtil.calculateIstWattKg().",

                "IST % Norm = CODEX #35 - istPercent\nFormula: #32 × 100 / #31.\nImplementation: CodexUtil.calculateIstPercent().",

                "",

                "SOLL Weight Watt = CODEX #36 - sollWeightWatt\nExpected performance based on body weight.\nSource: ErgometryUtil.getSollLeistungWeight().",

                "SOLL Weight Watt/kg = CODEX #37 - sollWeightWattKg\nFormula: #36 / Body Weight.\nImplementation: CodexUtil.calculateSollWeightWattKg().",

                "IST Weight Watt/kg = CODEX #38 - istWeightWattKg\nFormula: #32 / Body Weight.\nImplementation: CodexUtil.calculateIstWeightWattKg().",

                "IST Weight % Norm = CODEX #39 - istWeightPercent\nFormula: #32 × 100 / #36.\nImplementation: CodexUtil.calculateIstWeightPercent()."

            ]

        });

    }

    if (measurements?.ergometry?.type === 'run') {

        return (

            <View style={styles.container}>

                <View style={styles.block}>



                    <TitleWithInfoComponent
                        title={`    ${LanguageUtil.getName('laufband_leistung_text')}`}
                        infoHandler={laufbandInfoHandler}
                    />

                    <LabelAndInputTextComponent
                        label={LanguageUtil.getName('max_speed_text')}
                        measure="km/h"
                        value={measurements?.maxspeed ?? 0}
                        isEditable={true}
                        setValue={(v) => onUpdateMeasurements(
                            'maxspeed',
                            v
                        )}
                    />

                    <LabelAndInputTextComponent
                        label="min/km"
                        measure=""
                        value={measurements?.minperkm ?? 0}
                        isEditable={false}
                    />

                </View>

            </View>

        )
    }

    return (

        <View style={styles.container}>

            <View style={styles.block}>

                <TitleWithInfoComponent
                    title={`    ${LanguageUtil.getName('koerperoberflaeche_bezogen_text')}`}
                    infoHandler={infoHandler}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('soll_text')}
                    measure="Watt"

                    // MAGMED #31
                    // measurements.sollWatt
                    // -> sollLeistungNorm
                    // -> ErgometryUtil.getSollLeistungNorm()
                    value={measurements?.sollWatt ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('soll_text')}
                    measure="Watt/kg"

                    // MAGMED #33
                    // measurements.sollWattKg
                    // -> sollLeistungProKg
                    // -> CodexUtil.calculateSollWattKg()
                    value={measurements?.sollWattKg ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('ist_text')}
                    measure="Watt"

                    // MAGMED #32
                    // measurements.istWatt
                    // Editable input
                    // Source for:
                    // #34
                    // #35
                    // #38
                    // #39
                    value={measurements?.istWatt ?? 0}

                    isEditable={true}

                    setValue={(v) =>
                        onUpdateMeasurements(
                            'istLeistungMax',
                            v
                        )
                    }
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('ist_text')}
                    measure="Watt/kg"

                    // MAGMED #34
                    // measurements.istWattKg
                    // -> CodexUtil.calculateIstWattKg()
                    value={measurements?.istWattKg ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('prozent_der_norm_text')}
                    measure="%"

                    // MAGMED #35
                    // measurements.istPercent
                    // -> CodexUtil.calculateIstPercent()
                    value={measurements?.istPercent ?? 0}

                    isEditable={false}
                />

            </View>

            <View style={styles.block}>

                <Text style={styles.title}>
                    {LanguageUtil.getName('koerpergewicht_bezogen_text')}
                </Text>

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('soll_text')}
                    measure="Watt"

                    // MAGMED #36
                    // measurements.sollWeightWatt
                    // -> ErgometryUtil.getSollLeistungWeight()
                    value={measurements?.sollWeightWatt ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('soll_text')}
                    measure="Watt/kg"

                    // MAGMED #37
                    // measurements.sollWeightWattKg
                    // -> CodexUtil.calculateSollWeightWattKg()
                    value={measurements?.sollWeightWattKg ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('ist_text')}
                    measure="Watt"

                    // MAGMED #32
                    // measurements.istWatt
                    value={measurements?.istWatt ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('ist_text')}
                    measure="Watt/kg"

                    // MAGMED #38
                    // measurements.istWeightWattKg
                    // -> istLeistungWeightProKg
                    // -> CodexUtil.calculateIstWeightWattKg()
                    value={measurements?.istWeightWattKg ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('prozent_der_norm_text')}
                    measure="%"

                    // MAGMED #39
                    // measurements.istWeightPercent
                    // -> CodexUtil.calculateIstWeightPercent()
                    value={measurements?.istWeightPercent ?? 0}

                    isEditable={false}
                />

            </View>

        </View>

    )
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20
    },

    block: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        gap: 8
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 10
    }

})