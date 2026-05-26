import React, { useState, useEffect } from 'react'

import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import LanguageUtil from '../utils/LanguageUtil'

export default function HeaderComponent({ buttonCallback, buttonName, setButtonState, clearFieldFlag, setClearFieldFlag, dataPatient }) {

    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [birthday, setBirthday] = useState('')
    const [title, setTitle] = useState('')
    const [gender, setGender] = useState('')
    const [patientid, setPatientId] = useState('')
    const [measurements, setMeasurements] = useState({})

    useEffect(() => {
        if (clearFieldFlag === 1) {
            clearFields()
        }
    }, [clearFieldFlag]);

    useEffect(() => {
        if (dataPatient) {

            setLastName(dataPatient.lastname)
            setFirstName(dataPatient.firstname)
            setBirthday(dataPatient.birthdate)
            setTitle(dataPatient.title)
            setGender(dataPatient.gender)
            setPatientId(dataPatient.patientid)
            setMeasurements(dataPatient.measurements)
        }
    }, [dataPatient]);



    function clearFields() {
        setFirstName('')
        setLastName('')
    }

    function onPressButton() {

        if (buttonCallback) {
            buttonCallback(firstName, lastName, birthday, title, gender, patientid)
        }

    }
    return (

        <View style={styles.formSection}>

            <View style={styles.row}>

                <View style={styles.col}>
                    <Text>{LanguageUtil.getName('lastname_text')}</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(text);
                        }}
                        onFocus={() => {
                            if (setButtonState) {
                                setButtonState(2)
                            }

                            if (setClearFieldFlag) {
                                setClearFieldFlag(0)
                            }
                        }}
                    />
                </View>

                <View style={styles.col}>
                    <Text>{LanguageUtil.getName('firstname_text')}</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(text);
                        }}
                        onFocus={() => {
                            if (setButtonState) {
                                setButtonState(2)
                            }
                            if (setClearFieldFlag) {
                                setClearFieldFlag(0)
                            }

                        }}
                    />
                </View>

                <View style={styles.col}>
                    <Text>{LanguageUtil.getName('title_text')}</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={(text) => {
                            setTitle(text);
                        }}
                        onFocus={() => {
                            if (setButtonState) {
                                setButtonState(2)
                            }
                            if (setClearFieldFlag) {
                                setClearFieldFlag(0)
                            }
                        }}
                    />
                </View>

            </View>

            <View style={styles.row}>

                <View style={styles.col}>
                    <Text>{LanguageUtil.getName('birthdate_text')}</Text>
                    <TextInput
                        style={styles.input}
                        value={birthday}
                        onChangeText={(text) => {
                            setBirthday(text);
                        }}
                        onFocus={() => {
                            if (setButtonState) {
                                setButtonState(2)
                            }
                            if (setClearFieldFlag) {
                                setClearFieldFlag(0)
                            }
                        }}
                    />
                </View>

                <View style={styles.col}>
                    <Text>{LanguageUtil.getName('gender_text')}</Text>
                    <TextInput
                        style={styles.input}
                        value={gender}
                        onChangeText={(text) => {
                            setGender(text);
                        }}
                        onFocus={() => {
                            if (setButtonState) {
                                setButtonState(2)
                            }
                            if (setClearFieldFlag) {
                                setClearFieldFlag(0)
                            }
                        }}
                    />
                </View>

                <View style={styles.col}>
                    <Text>{LanguageUtil.getName('patientid_text')}</Text>
                    <TextInput
                        style={styles.input}
                        value={patientid}
                        onFocus={() => {
                            if (setButtonState) {
                                setButtonState(2)
                            }
                            if (setClearFieldFlag) {
                                setClearFieldFlag(0)
                            }
                        }}
                    />
                </View>

            </View>

            <View >
                {
                    buttonCallback &&
                    <Button
                        title={LanguageUtil.getName(buttonName)}
                        onPress={() => { onPressButton() }}
                    />
                }

            </View>
        </View>

    )
}

const styles = StyleSheet.create({

    formSection: {
        flex: 1,
        paddingBottom: 10,
    },

    row: {
        flexDirection: 'row',
        marginBottom: 10
    },

    col: {
        flex: 1,
        marginRight: 20
    },

    input: {
        borderWidth: 1,
        padding: 4,
        marginTop: 4
    },

    smallInput: {
        borderWidth: 1,
        padding: 4,
        marginTop: 4,
        width: 60
    }

})