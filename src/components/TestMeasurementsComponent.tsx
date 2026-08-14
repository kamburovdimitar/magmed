// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass, part 2 (after the user
//   pointed out remaining untranslated strings elsewhere): the info-panel
//   title "  Ergometry Test" was hardcoded English text even though this
//   file already imports LanguageUtil for its field labels; added the
//   missing ergometrie_test_text key to Translations.js and wired it here.
// ============================================

import React from 'react'
import { View, StyleSheet } from 'react-native'
import LabelAndInputTextComponent from './LabelAndInputComponent'
import LabelAndDobuleInputTextComponent from './LabelAndDoubleInputComponent'
import LanguageUtil from '../utils/LanguageUtil'
import TitleWithInfoComponent from './TitleWithInfoComponent';
import { openPopup } from '../services/PopupService';

export default function TestMeasurmentComponent({
    measurements,
    onUpdateMeasurements
}) {

    function infoHandler() {

        openPopup({

            title: "Patient Measurements",

            description:
                "Displays the patient's anthropometric and cardiovascular baseline measurements used for the ergometry calculations. "
                + "These values are used to calculate body composition, reference exercise performance and heart rate zones.",

            formula:
                "BMI = Weight / Height²\n"
                + "WHR = Waist Circumference / Hip Circumference\n"
                + "Fat Mass = Body Weight × Body Fat %\n"
                + "Expected Heart Rate = 220 - Age",

            source:
                "Reference calculations are performed automatically using the entered patient measurements. "
                + "Several ergometry parameters and MAGMED Codex values depend directly on these inputs.",

            fields: [

                "Body Height = CODEX #10 - _heightcm\nHeight used for BMI and BSA calculations.",

                "Body Weight = CODEX #11 - _weightkg\nWeight used for BMI, Fat Mass and performance calculations.",

                "Body Mass Index = CODEX #13 - bmi\nCalculated using weight and height.\nFormula: Weight / Height².",

                "Waist Circumference = CODEX #14 - _waistcm\nUsed for WHR calculation.",

                "Hip Circumference = CODEX #15 - _hipcm\nUsed for WHR calculation.",

                "Waist-Hip Ratio = CODEX #16 - whrindex\nFormula: Waist Circumference / Hip Circumference.",

                "Body Fat Percentage = CODEX #17 - _bodyfatpercent\nPatient body fat percentage entered manually.",

                "Fat Mass = CODEX #18 - fatmasskg\nFormula: Weight × Body Fat %.",

                "Resting Blood Pressure (Systolic) = CODEX #19 - _bloodpressurerestsystolic\nResting systolic blood pressure.",

                "Resting Blood Pressure (Diastolic) = CODEX #20 - _bloodpressurerestdiastolic\nResting diastolic blood pressure.",

                "Maximum Blood Pressure (Systolic) = CODEX #21 - _bloodpressuremaxsystolic\nMaximum systolic blood pressure during exercise.",

                "Maximum Blood Pressure (Diastolic) = CODEX #22 - _bloodpressuremaxdiastolic\nMaximum diastolic blood pressure during exercise.",

                "Resting Heart Rate = CODEX #23 - _heartraterest\nHeart rate measured at rest.",

                "Maximum Heart Rate = CODEX #24 - _heartratemax\nMaximum heart rate achieved during the test.",

                "Expected Heart Rate = CODEX #25 - expectedheartrate\nFormula: 220 - Age."

            ]

        });

    }


    function update(field, value) {
        onUpdateMeasurements(field, value);
    }

    return (



        <View style={styles.listSection}>

            {/* ------------------------------------------------ */}
            {/* LEFT COLUMN                                      */}
            {/* ------------------------------------------------ */}


            <View style={styles.colsection}>
                <TitleWithInfoComponent
                    title={LanguageUtil.getName('ergometrie_test_text')}
                    infoHandler={infoHandler}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('koerpergroesse_text')}
                    measure="cm"

                    // MAGMED #10
                    // Körpergröße
                    // measurements.heightcm
                    value={measurements?.heightcm}

                    isEditable={true}
                    setValue={(v) => update('heightcm', v)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('taillenumfang_text')}
                    measure="cm"

                    // MAGMED #14
                    // Taillenumfang
                    // measurements.waistcm
                    value={measurements?.waistcm}

                    isEditable={true}
                    setValue={(v) => update('waistcm', v)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('koerperfettanteil_text')}
                    measure="%"

                    // MAGMED #17
                    // Körperfettanteil
                    // measurements.bodyfatpercent
                    value={measurements?.bodyfatpercent}

                    isEditable={true}
                    setValue={(v) => update('bodyfatpercent', v)}
                />

                <LabelAndDobuleInputTextComponent
                    label={LanguageUtil.getName('blutdruck_ruhe_text')}
                    measure="mmHg"

                    // MAGMED #19
                    // RR Ruhe systolisch
                    value1={measurements?.bloodpressurerestsystolic}

                    // MAGMED #20
                    // RR Ruhe diastolisch
                    value2={measurements?.bloodpressurerestdiastolic}

                    setValue1={(v) =>
                        update(
                            'bloodpressurerestsystolic',
                            v
                        )
                    }

                    setValue2={(v) =>
                        update(
                            'bloodpressurerestdiastolic',
                            v
                        )
                    }
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('herzfrequenz_ruhe_text')}
                    measure="bpm"

                    // MAGMED #23
                    // Herzfrequenz Ruhe
                    // measurements.heartraterest
                    value={measurements?.heartraterest}

                    isEditable={true}
                    setValue={(v) =>
                        update(
                            'heartraterest',
                            v
                        )
                    }
                />

            </View>

            {/* ------------------------------------------------ */}
            {/* CENTER COLUMN                                    */}
            {/* ------------------------------------------------ */}

            <View style={styles.colsection}>

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('koerpergewicht_text')}
                    measure="kg"

                    // MAGMED #11
                    // Körpergewicht
                    // measurements.weightkg
                    value={measurements?.weightkg}

                    isEditable={true}
                    setValue={(v) =>
                        update(
                            'weightkg',
                            v
                        )
                    }
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('hueftumfang_text')}
                    measure="cm"

                    // MAGMED #15
                    // Hüftumfang
                    // measurements.hipcm
                    value={measurements?.hipcm}

                    isEditable={true}
                    setValue={(v) =>
                        update(
                            'hipcm',
                            v
                        )
                    }
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('fettmasse_text')}
                    measure="kg"

                    // MAGMED #18
                    // Fettmasse
                    // measurements.fatmasskg
                    // -> CodexUtil.calculateFatMass()
                    value={measurements?.fatmasskg}

                    isEditable={false}
                />

                <LabelAndDobuleInputTextComponent
                    label={LanguageUtil.getName('blutdruck_max_text')}
                    measure="mmHg"

                    // MAGMED #21
                    // RR Max systolisch
                    value1={measurements?.bloodpressuremaxsystolic}

                    // MAGMED #22
                    // RR Max diastolisch
                    value2={measurements?.bloodpressuremaxdiastolic}

                    setValue1={(v) =>
                        update(
                            'bloodpressuremaxsystolic',
                            v
                        )
                    }

                    setValue2={(v) =>
                        update(
                            'bloodpressuremaxdiastolic',
                            v
                        )
                    }
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('herzfrequenz_max_text')}
                    measure="bpm"

                    // MAGMED #24
                    // Herzfrequenz Max
                    // measurements.heartratemax
                    value={measurements?.heartratemax}

                    isEditable={true}
                    setValue={(v) =>
                        update(
                            'heartratemax',
                            v
                        )
                    }
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('durchschnittlicher_erwartungswert_text')}
                    measure="bpm"

                    // MAGMED #25
                    // Durchschnittlicher Erwartungswert
                    // measurements.expectedheartrate
                    // -> CodexUtil.calculateExpectedHeartRate()
                    value={measurements?.expectedheartrate}

                    isEditable={false}
                />

            </View>

            {/* ------------------------------------------------ */}
            {/* RIGHT COLUMN                                     */}
            {/* ------------------------------------------------ */}

            <View style={styles.colsection}>

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('body_mass_index_text')}

                    // MAGMED #13
                    // Body Mass Index
                    // measurements.bmi
                    // -> CodexUtil.calculateBMI()
                    value={measurements?.bmi}

                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('whr_index_text')}

                    // MAGMED #16
                    // Waist Hip Ratio
                    // measurements.whrindex
                    // -> CodexUtil.calculateWHR()
                    value={measurements?.whrindex}

                    isEditable={false}
                />

            </View>

        </View>

    );
}

const styles = StyleSheet.create({

    listSection: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
    },

    colsection: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        gap: 8,
    }

})