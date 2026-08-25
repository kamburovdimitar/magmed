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
// др.) очакват точно "male"/"female", затова тук връщаме само тези две
// стойности - невъзможно е вече да се получи произволен/грешен низ.
//
// 🔹 2026-08-21 (по-късно същия ден) — DK: "едното ниво е над другото"
// (виж скрийншот - "UPDATE CLIENT" лентата покриваше горната опция на
// floating dropdown менюто, защото position:'absolute' floating меню
// върху row без изричен stacking context се държеше непредвидимо в RN
// Web). Заменено с обикновен ВИНАГИ видим 2-бутонен segmented toggle
// (Male | Female) на мястото на полето — без absolute positioning, без
// z-index, значи няма как да се получи overlap с нищо под него. И е
// по-бързо за ползване (1 клик вместо отвори-после-избери).
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
                    <View style={[styles.genderToggleRow, !gender && styles.genderToggleRowEmpty]}>
                        {
                            GENDER_OPTIONS.map((option, index) => (
                                <Pressable
                                    key={option.value}
                                    style={[styles.genderToggleOption, index > 0 && styles.genderToggleOptionDivider, gender === option.value && styles.genderToggleOptionActive]}
                                    onPress={() => {

                                        selectGender(option.value)

                                        if (setButtonState) {
                                            setButtonState(2)
                                        }
                                        if (setClearFieldFlag) {
                                            setClearFieldFlag(0)
                                        }
                                    }}
                                >
                                    <Text style={[styles.genderToggleText, gender === option.value && styles.genderToggleTextActive]}>
                                        {LanguageUtil.getName(option.labelKey)}
                                    </Text>
                                </Pressable>
                            ))
                        }
                    </View>
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

    // 🔹 Gender — 2-бутонен segmented toggle (Male | Female), винаги
    // видим, без absolute positioning/z-index (виж коментара при
    // GENDER_OPTIONS по-горе защо заменихме floating dropdown менюто с
    // това — премахва изцяло класа бъгове тип "едното ниво е над
    // другото").
    genderToggleRow: {
        flexDirection: 'row',
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 4,
        overflow: 'hidden'
    },

    genderToggleRowEmpty: {
        borderColor: '#c0392b'
    },

    genderToggleOption: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6,
        backgroundColor: '#fff'
    },

    genderToggleOptionDivider: {
        borderLeftWidth: 1,
        borderLeftColor: '#999'
    },

    genderToggleOptionActive: {
        backgroundColor: '#fff176'
    },

    genderToggleText: {
        fontSize: 13,
        color: '#333'
    },

    genderToggleTextActive: {
        fontWeight: 'bold',
        color: '#000'
    },

    hintText: {
        marginTop: 6,
        fontSize: 12,
        color: '#c0392b'
    }

})