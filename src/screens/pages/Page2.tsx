import React from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil'
import HeaderComponent from '../../components/HeaderComponent'

export default function Page2({ goTo }) {
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

                    <View style={styles.listBody}>
                        {/* results go here */}
                    </View>

                    <View style={styles.listFooter}>
                        <Button
                            title={LanguageUtil.getName('delete_customer_text')}
                            onPress={() => { }}
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