import React from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import LabelAndInputTextComponent from './LabelAndInputComponent'
import LabelAndDobuleInputTextComponent from './LabelAndDoubleInputComponent'
import LanguageUtil from '../utils/LanguageUtil'
import { MDPatientMeasurements } from '../model/MDPatientMeasurements'
import { useEffect, useState } from "react";

export default function TestMeasurmentComponent({ measurements, onUpdateMeasurements }) {

    useEffect(() => {

        console.log("fatmass", measurements?.fatmasskg);

    }, [measurements]);

    return (
        <View style={styles.listSection}>
            <View style={styles.colsection}>
                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('koerpergroesse_text')}
                    measure="cm"
                    isEditable={true}
                    value={measurements?.heightcm}
                    setValue={(value) => onUpdateMeasurements('heightcm', value)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('taillenumfang_text')}
                    measure="cm"
                    isEditable={true}
                    value={measurements?.waistcm}
                    setValue={(value) => onUpdateMeasurements('waistcm', value)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('koerperfettanteil_text')}
                    measure="%"
                    isEditable={true}
                    value={measurements?.bodyfatpercent}
                    setValue={(value) => onUpdateMeasurements('bodyfatpercent', value)}
                />

                <LabelAndDobuleInputTextComponent
                    label={LanguageUtil.getName('blutdruck_ruhe_text')}
                    measure="mmHg"
                    value1={measurements?.bloodpressurerestsystolic}
                    value2={measurements?.bloodpressurerestdiastolic}
                    setValue1={(value) =>
                        onUpdateMeasurements('bloodpressurerestsystolic', value)
                    }
                    setValue2={(value) =>
                        onUpdateMeasurements('bloodpressurerestdiastolic', value)
                    }
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('herzfrequenz_ruhe_text')}
                    measure="bpm"
                    isEditable={true}
                    value={measurements?.heartraterest}
                    setValue={(value) => onUpdateMeasurements('heartraterest', value)}
                />
            </View>

            <View style={styles.colsection}>
                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('koerpergewicht_text')}
                    measure="kg"
                    isEditable={true}
                    value={measurements?.weightkg}
                    setValue={(value) => onUpdateMeasurements('weightkg', value)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('hueftumfang_text')}
                    measure="cm"
                    isEditable={true}
                    value={measurements?.hipcm}
                    setValue={(value) => onUpdateMeasurements('hipcm', value)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('fettmasse_text')}
                    measure="kg"
                    isEditable={false}
                    value={measurements?.fatmasskg}
                    setValue={null}
                />

                <LabelAndDobuleInputTextComponent
                    label={LanguageUtil.getName('blutdruck_max_text')}
                    measure="mmHg"
                    value1={measurements?.bloodpressuremaxsystolic}
                    value2={measurements?.bloodpressuremaxdiastolic}
                    setValue1={(value) =>
                        onUpdateMeasurements('bloodpressuremaxsystolic', value)
                    }
                    setValue2={(value) =>
                        onUpdateMeasurements('bloodpressuremaxdiastolic', value)
                    }
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('herzfrequenz_max_text')}
                    measure="bpm"
                    isEditable={true}
                    value={measurements?.heartratemax}
                    setValue={(value) => onUpdateMeasurements('heartratemax', value)}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('durchschnittlicher_erwartungswert_text')}
                    measure="bpm"
                    isEditable={false}
                    value={measurements?.expectedheartrate}
                    setValue={null}
                />
            </View>

            <View style={styles.colsection}>
                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('body_mass_index_text')}
                    measure=""
                    isEditable={false}
                    value={measurements?.bmi}
                    setValue={null}
                />

                <LabelAndInputTextComponent
                    label={LanguageUtil.getName('whr_index_text')}
                    measure=""
                    isEditable={false}
                    value={measurements?.whrindex}
                    setValue={null}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '50%'

    },

    leftPanel: {
        flex: 3,
        borderRightWidth: 1
    },

    rightPanel: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },

    formSection: {
        padding: 10,
        borderBottomWidth: 1
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10
    },

    input: {
        borderWidth: 1,
        height: 30,
        padding: -10,
    },

    smallInput: {
        borderWidth: 1,
        padding: 4,
        width: 60,

    },

    listSection: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
    },
    colsection: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        flexDirection: 'column',
    },
    colsectionV: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        flexDirection: 'column',
    },

    listHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 5
    },

    col: {
        flex: 1,
        fontWeight: 'bold'
    },

    listBody: {
        flex: 1,
        borderWidth: 1,
        marginTop: 5
    },

    listFooter: {
        marginTop: 10,
        alignItems: 'flex-end'
    }

})