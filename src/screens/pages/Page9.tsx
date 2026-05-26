import React from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil'
import HeaderComponent from '../../components/HeaderComponent'
import PatientList from '../../components/Lists/PatientList'
import UsersProxy from '../../services/UsersProxy'
import { useEffect, useState } from "react";
import LabelAndInputTextComponent from '../../components/LabelAndInputComponent'
import LabelAndDobuleInputTextComponent from '../../components/LabelAndDoubleInputComponent'
import TestPanelResultComponent from '../../components/TestPanelResultsComponent'



export default function Page9({ goTo }) {

    const [data, setData] = useState([]);

    useEffect(() => {
        const users = UsersProxy.getAllUsers();
        setData(users);// червено е , но е коректно.
    }, []);


    function searchHandler(lastName: string, firstName: string) {
        console.log(lastName)
        let users = UsersProxy.getAllUsers();
        let result: Patient[] = [];

        for (let i = 0; i < users.length; i++) {
            if (users[i].lastName.toLowerCase().includes(lastName.toLowerCase())) {
                result.push(users[i]);
            }
        }

        console.log(result);
        setData(result);
    }

    function callback() {

    }

    return (

        <View style={styles.container}>

            <View style={styles.leftPanel}>

                {/* TOP FORM */}
                <View style={styles.formSection}>


                    <HeaderComponent
                        buttonCallback={callback}
                        buttonName={"update_user_text"}
                        setButtonState={null}
                        clearFieldFlag={null}
                        setClearFieldFlag={null}
                        dataPatient={null}
                    />
                </View>

                {/* BOTTOM LIST */}
                <View style={styles.listSection}>

                    <View style={styles.colsection}>
                        <Text>Column 1</Text>
                        <LabelAndInputTextComponent label={"lbl 1"} measure={"cm"} />
                        <LabelAndInputTextComponent label={"lbl 2"} measure={"cm"} />
                        <LabelAndInputTextComponent label={"lbl 3"} measure={"cm"} />
                        <LabelAndInputTextComponent label={"lbl 4"} measure={"cm"} />
                        <LabelAndInputTextComponent label={"lbl 5"} measure={"cm"} />
                        <LabelAndInputTextComponent label={"lbl 6"} measure={"cm"} />

                    </View>
                    <View style={styles.colsection}>
                        <LabelAndInputTextComponent label={"lbl 1"} measure={"cm"} />
                        <LabelAndInputTextComponent label={"lbl 2"} measure={"cm"} />
                        <LabelAndInputTextComponent label={"lbl 3"} measure={"cm"} />
                        <LabelAndInputTextComponent label={"lbl 4"} measure={"cm"} />
                        <LabelAndDobuleInputTextComponent label={"lbl 5"} measure={"cm"} />
                        <LabelAndInputTextComponent label={"lbl 6"} measure={"cm"} />
                    </View>

                    <View style={styles.colsection}>
                        <Text>Column 3</Text>
                    </View>

                </View>
                <Button
                    title="Back to Home"
                    onPress={() => goTo('home')}
                />
            </View>

            {/* RIGHT PANEL */}
            <View style={styles.rightPanel}>
                <TestPanelResultComponent />
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