import React from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil'
import HeaderComponent from '../../components/HeaderComponent'

import UsersProxy from '../../services/UsersProxy'
import { useEffect, useState } from "react";

export default function Page11({ goTo }) {

    function Cell({ text }) {
        return (
            <View style={{
                flex: 1,
                borderWidth: 1,
                padding: 6,
                justifyContent: 'center'
            }}>
                <Text style={{ fontSize: 12, textAlign: 'center' }}>
                    {text}
                </Text>
            </View>
        );
    }

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


    function callback(value) {

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
                    <View style={{ width: '100%', height: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '10%', height: '100%', flexDirection: 'column' }}>


                            <Button
                                title="Rehabilitation"
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="GESUNDHEITSSPORT   "
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="FREIZEITSPORT   "
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="Trainings-Woche GESTALTEN   "
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="Automatik EIN   "
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="Automatik AUS  "
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="Nicht gewählte Bereiche ausblenden "
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="Person bezogene STANDARD speichern   "
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="Person bezogene STANDARD Zurücksetzen   "
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="Mobilisen  "
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="HWS  "
                                onPress={() => trace(true)}
                            />
                            <Button
                                title="BWS"
                                onPress={() => trace(true)}
                            />
                        </View>
                        <View style={{ width: '90%', height: '100%', flexDirection: 'column', }}>
                            <View style={{
                                width: '100%', height: '10%', flexDirection: 'row', alignItems: "center", justifyContent: 'space-around'
                            }}>

                                <Button
                                    title="Rehabilitation"
                                    onPress={() => console.log(true)}
                                />
                                <Button
                                    title="GESUNDHEITSSPORT   "
                                    onPress={() => console.log(true)}
                                />
                                <Button
                                    title="FREIZEITSPORT   "
                                    onPress={() => console.log(true)}
                                />
                                <Button
                                    title="Trainings-Woche GESTALTEN   "
                                    onPress={() => console.log(true)}
                                />



                            </View>
                            <View style={{ width: '100%', height: '50%', flexDirection: 'column' }}>
                                <View style={{ padding: 10 }}>

                                    {/* ===== TABLE 1 ===== */}
                                    <View style={{ borderWidth: 1, marginBottom: 15 }}>

                                        {/* Row 1 */}
                                        <View style={{ flexDirection: 'row' }}>
                                            <Cell text="HF ruhe / HF max." />
                                            <Cell text="Trainings Bereich % der HFR" />
                                            <Cell text="Radfahren" />
                                            <Cell text="Laufen" />
                                        </View>

                                        {/* Row 2 */}
                                        <View style={{ flexDirection: 'row' }}>
                                            <Cell text="" />
                                            <Cell text="" />
                                            <Cell text="S/min     Watt" />
                                            <Cell text="S/min     km/h" />
                                        </View>

                                        {/* Row 3 */}
                                        <View style={{ flexDirection: 'row' }}>
                                            <Cell text="Watt max." />
                                            <Cell text="GA1: 50 - 60" />
                                            <Cell text="134 - 145     20 - 50" />
                                            <Cell text="130 - 140     X - X" />
                                        </View>

                                        {/* Row 4 */}
                                        <View style={{ flexDirection: 'row' }}>
                                            <Cell text="km/h max." />
                                            <Cell text="GA2: 00 - 00" />
                                            <Cell text="" />
                                            <Cell text="" />
                                        </View>

                                    </View>


                                    {/* ===== TABLE 2 ===== */}
                                    <View style={{ borderWidth: 1 }}>

                                        {/* Header */}
                                        <View style={{ flexDirection: 'row' }}>
                                            <Cell text="" />
                                            <Cell text="Stufe" />
                                            <Cell text="WNTZ Minuten" />
                                            <Cell text="Dauer/TE Minuten" />
                                            <Cell text="Häufigkeit TE/W" />
                                            <Cell text="% / Trainings Bereich" />
                                            <Cell text="TW" />
                                        </View>

                                        {/* Rows */}
                                        {[
                                            ['○', '1.', '30', '10-15', '3-2', '90/10   GA1/GA2', '3-5'],
                                            ['○', '2.', '60', '15-20', '4-3', '90/10   GA1/GA2', '4-6'],
                                            ['○', '3.', '90', '20-30', '4-6', '80/20   GA1/GA2', '4-6']
                                        ].map((row, i) => (
                                            <View key={i} style={{ flexDirection: 'row' }}>
                                                {row.map((cell, j) => (
                                                    <Cell key={j} text={cell} />
                                                ))}
                                            </View>
                                        ))}

                                    </View>

                                </View>

                            </View>

                            <View style={{ width: '100%', height: '40%', flexDirection: 'column', }}>

                                {/* Top button */}
                                <View style={{
                                    width: '100%',
                                    height: '10%',
                                    justifyContent: 'center'
                                }}>
                                    <View style={{ width: '100%' }}>
                                        <Button
                                            title="button 1"
                                            onPress={() => console.log(true)}
                                        />
                                    </View>
                                </View>

                                {/* Row 1 */}
                                <View style={{
                                    width: '100%',
                                    height: '10%',
                                    flexDirection: 'row'
                                }}>
                                    <View style={{ width: '33%' }}>
                                        <Button title="Rehabilitation" onPress={() => console.log(true)} />
                                    </View>
                                    <View style={{ width: '33%' }}>
                                        <Button title="GESUNDHEITSSPORT" onPress={() => console.log(true)} />
                                    </View>
                                    <View style={{ width: '33%' }}>
                                        <Button title="FREIZEITSPORT" onPress={() => console.log(true)} />
                                    </View>
                                </View>

                                {/* Row 2 */}
                                <View style={{
                                    width: '100%',
                                    height: '10%',
                                    flexDirection: 'row'
                                }}>
                                    <View style={{ width: '33%' }}>
                                        <Button title="Rehabilitation" onPress={() => console.log(true)} />
                                    </View>
                                    <View style={{ width: '33%' }}>
                                        <Button title="GESUNDHEITSSPORT" onPress={() => console.log(true)} />
                                    </View>
                                    <View style={{ width: '33%' }}>
                                        <Button title="FREIZEITSPORT" onPress={() => console.log(true)} />
                                    </View>
                                </View>

                            </View>

                        </View>



                    </View>



                </View>
                <Button
                    title="Back to Home"
                    onPress={() => goTo('home')}
                />
            </View>

            {/* RIGHT PANEL */}
            <View style={styles.rightPanel}>
            </View>

        </View >

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