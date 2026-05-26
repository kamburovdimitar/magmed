import React from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil'
import HeaderComponent from '../../components/HeaderComponent'
import PatientList from '../../components/Lists/PatientList'
import UsersProxy from '../../services/UsersProxy'
import { useEffect, useState } from "react";
import SelectedUserProxy from '../../services/SelectedUserProxy'
import { MDPatient } from "../../model/MDPatient";
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'
import { useDispatch } from "react-redux";
import { setSelectedUser } from "../../store/userSlice";



export default function Page4({ goTo }) {

    const [data, setData] = useState<MDPatient[]>([]);
    const [dataPatient, setDataPatient] = useState<MDPatient | null>(null);
    const [clearFieldFlag, setClearFieldFlag] = useState(0);
    const [searchFirstName, setSearchFirstName] = useState("");
    const [searchLastName, setSearchLastName] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        let users: MDPatient[] = UsersProxy.getAllUsers();
        setData(users);// червено е , но е коректно.
    }, []);



    function searchHandler(lastName: string, firstName: string) {
        console.log(lastName, firstName);

        let users = UsersProxy.getAllUsers();
        let result: MDPatient[] = [];

        for (let i = 0; i < users.length; i++) {
            if (
                users[i].lastname.toLowerCase().includes(lastName.toLowerCase()) &&
                users[i].firstname.toLowerCase().includes(firstName.toLowerCase())
            ) {
                result.push(users[i]);
            }
        }
        setData(result);
    }

    async function updateButton(firstName: string, lastName: string, birthday: string, title: string, gender: string, patientId: string, measurements: MDPatientMeasurements) {

        let patient: MDPatient = new MDPatient()
        patient.firstname = firstName;
        patient.lastname = lastName;
        patient.birthdate = birthday;
        patient.gender = gender;
        patient.title = title;
        patient.patientid = patientId;
        patient.measurements = measurements;

        let result = await UsersProxy.updateUser(patient);
        const users = UsersProxy.getAllUsers();
        //setData(users); това не работи и е фундаментално. Когато правим ъпдейта ние пъхаме вътре дейта в users, но не променяме големия обект, и после той не се рефрешва.
        setData([...users]);
    }

    function onSelectItem(patient: MDPatient) {

        setDataPatient(patient)
        dispatch(setSelectedUser(patient))
    }

    return (

        <View style={styles.container}>

            <View style={styles.leftPanel}>

                {/* TOP FORM */}
                <View style={styles.formSection}>

                    <HeaderComponent
                        buttonCallback={updateButton}
                        buttonName={"update_user_text"}
                        setButtonState={null}
                        clearFieldFlag={clearFieldFlag}
                        setClearFieldFlag={setClearFieldFlag}
                        dataPatient={dataPatient}
                    />
                </View>

                {/* BOTTOM LIST */}
                <View style={styles.listSection}>

                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setSearchLastName(text);
                            }}

                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setSearchFirstName(text);
                            }}

                        />
                        <Button
                            title="Search"
                            onPress={() => searchHandler(searchLastName, searchFirstName)}
                        />
                    </View>

                    <View style={styles.listHeader}>
                        <Text style={styles.col} >{LanguageUtil.getName('lastname_text')}</Text>
                        <Text style={styles.col} >{LanguageUtil.getName('firstname_text')}</Text>
                        <Text style={styles.col} >{LanguageUtil.getName('title_text')}</Text>
                        <Text style={styles.col} >{LanguageUtil.getName('birthdate_text')}</Text>
                        <Text style={styles.col} >{LanguageUtil.getName('patientid_text')}</Text>
                    </View>

                    {/* This is the list */}

                    <PatientList data={data} onSelectItem={onSelectItem} />

                    <View style={styles.listFooter}>
                        <Button
                            title={LanguageUtil.getName('delete_customer_text')}
                            onPress={() => {
                                setClearFieldFlag(1)
                            }}
                        />
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
        alignItems: 'flex-end'
    }

})