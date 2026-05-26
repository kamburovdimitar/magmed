import React from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil'
import HeaderComponent from '../../components/HeaderComponent'
import PatientList from '../../components/Lists/PatientList'
import UsersProxy from '../../services/UsersProxy'
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { measure } from 'react-native-reanimated'
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'


export default function Page1({ goTo }) {

    const [data, setData] = useState([]);
    const [buttonState, setButtonState] = useState(1);
    const [clearFieldFlag, setClearFieldFlag] = useState(0);


    function addButton(firstName: string, lastName: string, title: string, birthdate: string, patientId: string) {
        const id = uuidv4();
        const measurements = new MDPatientMeasurements()
        const gender = ""; // not added for the momemnt
        UsersProxy.addUser(firstName, lastName, title, gender, birthdate, id, measurements)
    }

    return (

        <View style={styles.container}>

            <View style={styles.leftPanel}>

                {/* TOP FORM */}
                <View style={styles.formSection}>
                    <HeaderComponent
                        buttonCallback={addButton}
                        buttonName={"add_btn_text"}
                        setButtonState={setButtonState}
                        clearFieldFlag={clearFieldFlag}
                        setClearFieldFlag={setClearFieldFlag}
                        dataPatient={null}
                    />
                </View>

                {/* BOTTOM LIST */}
                <View style={styles.listSection}>

                    <View style={styles.row}>
                        <TextInput style={styles.input} />
                        <TextInput style={styles.input} />
                    </View>


                    <View style={styles.listHeader}>
                        <Text style={styles.col} >{LanguageUtil.getName('lastname_text')}</Text>
                        <Text style={styles.col} >{LanguageUtil.getName('firstname_text')}</Text>
                        <Text style={styles.col} >{LanguageUtil.getName('title_text')}</Text>
                        <Text style={styles.col} >{LanguageUtil.getName('birthdate_text')}</Text>
                        <Text style={styles.col} >{LanguageUtil.getName('patientid_text')}</Text>
                    </View>


                    {/* This is the list */}

                    <PatientList data={data} />

                    <View style={styles.listFooter}>
                        <Button
                            title={LanguageUtil.getName('new_client_text')}
                            onPress={() => { }}
                        />
                        {buttonState === 1 && (
                            <Button
                                title={LanguageUtil.getName('search_client_text')}
                                onPress={() => { }}
                            />
                        )}

                        {buttonState === 2 && (
                            <Button
                                title={LanguageUtil.getName('delete_client_text')}
                                onPress={() => {
                                    setClearFieldFlag(1)
                                    setButtonState(1)
                                }}
                            />
                        )}

                    </View>

                </View>
                <Button
                    title="Back to Home"
                    onPress={() => goTo('home')}
                />
            </View>

            {/* RIGHT PANEL */}
            <View style={styles.rightPanel}>
                {/* reserved for details / charts / preview */}
            </View>

        </View>

    )
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '100%'

    },

    leftPanel: {
        flex: 3,
        borderRightWidth: 1
    },

    rightPanel: {
        flex: 1,

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
        padding: 4,
        width: 120
    },

    smallInput: {
        borderWidth: 1,
        padding: 4,
        width: 60
    },

    listSection: {
        flex: 1,
        padding: 10
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
        flexDirection: "row",
        justifyContent: "flex-end",

        gap: 10,
    }

})