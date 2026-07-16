import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LabelAndInputTextComponent from './LabelAndInputComponent'
import TitleWithInfoComponent from './TitleWithInfoComponent'
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
                        title='    Laufband Leistung'
                        infoHandler={laufbandInfoHandler}
                    />

                    <LabelAndInputTextComponent
                        label="Max Speed"
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
                    title='    Körper Oberfläche bezogen'
                    infoHandler={infoHandler}
                />

                <LabelAndInputTextComponent
                    label="SOLL"
                    measure="Watt"

                    // MAGMED #31
                    // measurements.sollWatt
                    // -> sollLeistungNorm
                    // -> ErgometryUtil.getSollLeistungNorm()
                    value={measurements?.sollWatt ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="SOLL"
                    measure="Watt/kg"

                    // MAGMED #33
                    // measurements.sollWattKg
                    // -> sollLeistungProKg
                    // -> CodexUtil.calculateSollWattKg()
                    value={measurements?.sollWattKg ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="IST"
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
                    label="IST"
                    measure="Watt/kg"

                    // MAGMED #34
                    // measurements.istWattKg
                    // -> CodexUtil.calculateIstWattKg()
                    value={measurements?.istWattKg ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="% Norm"
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
                    Körper Gewicht bezogen
                </Text>

                <LabelAndInputTextComponent
                    label="SOLL"
                    measure="Watt"

                    // MAGMED #36
                    // measurements.sollWeightWatt
                    // -> ErgometryUtil.getSollLeistungWeight()
                    value={measurements?.sollWeightWatt ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="SOLL"
                    measure="Watt/kg"

                    // MAGMED #37
                    // measurements.sollWeightWattKg
                    // -> CodexUtil.calculateSollWeightWattKg()
                    value={measurements?.sollWeightWattKg ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="IST"
                    measure="Watt"

                    // MAGMED #32
                    // measurements.istWatt
                    value={measurements?.istWatt ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="IST"
                    measure="Watt/kg"

                    // MAGMED #38
                    // measurements.istWeightWattKg
                    // -> istLeistungWeightProKg
                    // -> CodexUtil.calculateIstWeightWattKg()
                    value={measurements?.istWeightWattKg ?? 0}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label="% Norm"
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