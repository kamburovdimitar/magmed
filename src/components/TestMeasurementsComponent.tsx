import React from 'react'
import { View, StyleSheet } from 'react-native'
import LabelAndInputTextComponent from './LabelAndInputComponent'
import LabelAndDobuleInputTextComponent from './LabelAndDoubleInputComponent'
import LanguageUtil from '../utils/LanguageUtil'

export default function TestMeasurmentComponent({
    measurements,
    onUpdateMeasurements
}) {

    function update(field, value) {
        onUpdateMeasurements(field, value);
    }

    return (

        <View style={styles.listSection}>

            <View style={styles.colsection}>

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('koerpergroesse_text')}
                    measure="cm"
                    isEditable={true}
                    value={measurements?.heightcm}
                    setValue={(v) => update('heightcm', v)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('taillenumfang_text')}
                    measure="cm"
                    value={measurements?.waistcm}
                    isEditable={true}
                    setValue={(v) => update('waistcm', v)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('koerperfettanteil_text')}
                    measure="%"
                    value={measurements?.bodyfatpercent}
                    isEditable={true}
                    setValue={(v) => update('bodyfatpercent', v)}
                />

                <LabelAndDobuleInputTextComponent
                    label={LanguageUtil.getName('blutdruck_ruhe_text')}
                    measure="mmHg"
                    value1={measurements?.bloodpressurerestsystolic}
                    value2={measurements?.bloodpressurerestdiastolic}
                    setValue1={(v) => update('bloodpressurerestsystolic', v)}
                    setValue2={(v) => update('bloodpressurerestdiastolic', v)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('herzfrequenz_ruhe_text')}
                    measure="bpm"
                    value={measurements?.heartraterest}
                    isEditable={true}
                    setValue={(v) => update('heartraterest', v)}
                />

            </View>

            <View style={styles.colsection}>

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('koerpergewicht_text')}
                    measure="kg"
                    value={measurements?.weightkg}
                    isEditable={true}
                    setValue={(v) => update('weightkg', v)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('hueftumfang_text')}
                    measure="cm"
                    value={measurements?.hipcm}
                    isEditable={true}
                    setValue={(v) => update('hipcm', v)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('fettmasse_text')}
                    measure="kg"
                    value={measurements?.fatmasskg}
                    isEditable={false}
                />

                <LabelAndDobuleInputTextComponent
                    label={LanguageUtil.getName('blutdruck_max_text')}
                    measure="mmHg"
                    value1={measurements?.bloodpressuremaxsystolic}
                    value2={measurements?.bloodpressuremaxdiastolic}
                    setValue1={(v) => update('bloodpressuremaxsystolic', v)}
                    setValue2={(v) => update('bloodpressuremaxdiastolic', v)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('herzfrequenz_max_text')}
                    measure="bpm"
                    value={measurements?.heartratemax}
                    isEditable={true}
                    setValue={(v) => update('heartratemax', v)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('durchschnittlicher_erwartungswert_text')}
                    measure="bpm"
                    value={measurements?.expectedheartrate}
                    isEditable={false}
                />

            </View>

            <View style={styles.colsection}>

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('body_mass_index_text')}
                    value={measurements?.bmi}
                    isEditable={false}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('whr_index_text')}
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