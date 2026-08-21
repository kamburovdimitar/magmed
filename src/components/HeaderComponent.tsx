import React, { useState, useEffect } from 'react'

import { View, Text, TextInput, StyleSheet, Button, Pressable } from 'react-native'
import LanguageUtil from '../utils/LanguageUtil'

// 🔹 2026-08-21 (Claude) — DK: "нека се захванем с полето gender, то се
// ползва на различни места и чака реализиране от доста време ... нека е с
// дроп даун и да не може да бъде празно". Досега полето беше свободен
// текст (`TextInput`) — можеше да остане празно, да съдържа произволна
// стойност ("m", "М", "мъж"...) и никъде реално не се задаваше (виж
// Page1.tsx - "const gender = ''; // not added for the momemnt"). Всички
// изчисления надолу по веригата (ErgometrieUtil.getSollLeistungNorm и
// др.) очакват точно "male"/"female", затова dropdown-ът връща само тези
// две стойности - невъзможно е вече да се получи произволен/грешен низ.
const GENDER_OPTIONS = [
    { value: 'male', labelKey: 'male_text' },
    { value: 'female', labelKey: 'female_text' }
];

export default function HeaderComponent({ buttonCallback, buttonName, setButtonState, clearFieldFlag, setClearFieldFlag, dataPatient, onValidityChange }) {

    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [birthday, setBirthday] = useState('')
    const [title, setTitle] = useState('')
    const [gender, setGender] = useState('')
    const [patientid, setPatientId] = useState('')
    const [measurements, setMeasurements] = useState({})
    const [genderMenuOpen, setGenderMenuOpen] = useState(false)

    // 🔹 DK: "не можем да сейвнем, ако всичко не е попълнено и останалите
    // страници стоят дизейбълнати" — Patient ID нарочно е изключен от тук:
    // полето е read-only (виж TextInput-а по-долу — няма onChangeText),
    // винаги идва готово от `dataPatient` при Update, а при създаване на
    // нов пациент реалният ID се генерира отделно (виж Page1.tsx - uuid),
    // затова да го изискваме тук би блокирало точно create-флоу-то.
    const isValid = Boolean(
        lastName?.trim() &&
        firstName?.trim() &&
        title?.trim() &&
        birthday?.trim() &&
        gender?.trim()
    )

    useEffect(() => {
        if (onValidityChange) {
            onValidityChange(isValid)
        }
    }, [isValid]);

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

        // 🔹 допълнителна защита освен самото disabled на бутона по-долу —
        // дори бутонът да бъде натиснат по някакъв начин, докато формата
        // не е валидна, нищо не се записва.
        if (buttonCallback && isValid) {
            buttonCallback(firstName, lastName, birthday, title, gender, patientid)
        }

    }

    function selectGender(value: string) {
        setGender(value)
        setGenderMenuOpen(false)
    }

    function genderLabel(value: string) {

        const match = GENDER_OPTIONS.find((o) => o.value === value)

        return match
            ? LanguageUtil.getName(match.labelKey)
            : LanguageUtil.getName('select_gender_text')

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

                <View style={[styles.col, styles.genderCol]}>
                    <Text>{LanguageUtil.getName('gender_text')}</Text>
                    <Pressable
                        style={[styles.input, styles.genderBox, !gender && styles.genderBoxEmpty]}
                        onPress={() => {

                            setGenderMenuOpen(!genderMenuOpen)

                            if (setButtonState) {
                                setButtonState(2)
                            }
                            if (setClearFieldFlag) {
                                setClearFieldFlag(0)
                            }
                        }}
                    >
                        <Text style={!gender && styles.genderPlaceholderText}>
                            {genderLabel(gender)}
                        </Text>
                        <Text style={styles.genderCaret}>{genderMenuOpen ? '▲' : '▼'}</Text>
                    </Pressable>

                    {
                        genderMenuOpen &&
                        <View style={styles.genderMenu}>
                            {
                                GENDER_OPTIONS.map((option) => (
                                    <Pressable
                                        key={option.value}
                                        style={[styles.genderMenuItem, gender === option.value && styles.genderMenuItemActive]}
                                        onPress={() => selectGender(option.value)}
                                    >
                                        <Text>{LanguageUtil.getName(option.labelKey)}</Text>
                                    </Pressable>
                                ))
                            }
                        </View>
                    }
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
                        disabled={!isValid}
                    />
                }

                {
                    buttonCallback && !isValid &&
                    <Text style={styles.hintText}>{LanguageUtil.getName('complete_all_fields_hint_text')}</Text>
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
    },

    // 🔹 Gender dropdown (виж GENDER_OPTIONS/genderLabel по-горе) — просто
    // Pressable "кутийка", която прилича на другите TextInput-и (същия
    // `input` стил), плюс малък flex-row за caret-а, и floating меню под
    // нея с 2-те опции.
    genderCol: {
        position: 'relative',
        zIndex: 10
    },

    genderBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    genderBoxEmpty: {
        borderColor: '#c0392b'
    },

    genderPlaceholderText: {
        color: '#888'
    },

    genderCaret: {
        fontSize: 10,
        color: '#555'
    },

    genderMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        borderWidth: 1,
        borderColor: '#999',
        backgroundColor: '#fff',
        zIndex: 20,
        elevation: 6
    },

    genderMenuItem: {
        paddingVertical: 8,
        paddingHorizontal: 8
    },

    genderMenuItemActive: {
        backgroundColor: '#d0e8ff'
    },

    hintText: {
        marginTop: 6,
        fontSize: 12,
        color: '#c0392b'
    }

})