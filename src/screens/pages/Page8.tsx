import React from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil'
import HeaderSearchComponent from '../../components/HeaderComponent'
import PatientList from '../../components/Lists/PatientList'
import UsersProxy from '../../services/UsersProxy'
import SelectedUserProxy from '../../services//SelectedUserProxy'
import { useEffect, useState } from "react";
import TestPanel from '../../components/TestPanelComponent'
import TestComponent1 from '../../components/testComponents/TestComponent1'
import TestComponent2 from '../../components/testComponents/TestComponent2'
import TestComponent3 from '../../components/testComponents/TestComponent3'
import TestComponent4 from '../../components/testComponents/TestComponent4'
import TestComponent5 from '../../components/testComponents/TestComponent5'
import TestComponent6 from '../../components/testComponents/TestComponent6'
import TestComponent7 from '../../components/testComponents/TestComponent7'
import PrintTestPanel from '../../components/PrintTestPanel'
import InterprationPanel from '../../components/InterprationPanel'
import { MDPatient } from '../../model/MDPatient'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateMeasurements } from "../../store/userSlice";
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'
import LabelAndInputTextComponent from '../../components/LabelAndInputComponent'



export default function Page8({ goTo }) {
    const dispatch = useDispatch();
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const [ergoType, setErgoType] = useState("bike");

    const rawMeasurements = useSelector(
        (state) => state.user.selectedUser?.measurements
    );

    const measurements = new MDPatientMeasurements(rawMeasurements);

    const [ergoView, setErgoView] = useState('');
    const [leftView, setLeftView] = useState('');
    const [dataPatient, setDataPatient] = useState({} as MDPatient);

    useEffect(() => {
        if (!selectedUser) return;

        setDataPatient(selectedUser as MDPatient);

    }, [selectedUser]);

    function updateHandler(updatedMeasurements: MDPatientMeasurements) {
        console.log("test", updatedMeasurements)
        dispatch(updateMeasurements(updatedMeasurements));
    }

    useEffect(() => {

        // const model = new MDPatientMeasurements(measurements);


        // console.log("after dispatch fatmass", model.fatmasskg);


    }, [measurements])

    function handlerButton(value) {
        setErgoView(value)
    }

    function onPrint() {
        setLeftView("print")
    }

    function onInterpration(value) {
        //console.log(value);
        setLeftView("interpratation")
    }

    function onGenereateFakeData() {

        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let fake = new MDPatientMeasurements();

        fake.age = random(18, 70);

        fake.heightcm = random(160, 200);
        fake.weightkg = random(55, 110);

        fake.waistcm = random(70, 120);
        fake.hipcm = random(85, 125);

        fake.bodyfatpercent = random(8, 35);

        fake.bloodpressurerestsystolic = random(105, 135);
        fake.bloodpressurerestdiastolic = random(65, 90);

        fake.bloodpressuremaxsystolic = random(160, 230);
        fake.bloodpressuremaxdiastolic = random(80, 110);

        fake.heartraterest = random(50, 85);

        let expected = 220 - fake.age;
        fake.heartratemax = random(expected - 15, expected + 10);

        fake.istLeistungMax = random(140, 380);

        return fake;
    }


    function renderTestView() {

        if (ergoView === 'detail1') return <TestComponent1
            callback={updateHandler}
            measurements={measurements}
            ergoType={ergoType}
            setErgoType={setErgoType}
            onPrint={onPrint}
            onInterpration={onInterpration}
            onGenereateFakeData={onGenereateFakeData}
        />

        if (ergoView === 'detail2') return <TestComponent2 />
        if (ergoView === 'detail3') return <TestComponent3 />
        if (ergoView === 'detail4') return <TestComponent4 measurements={measurements} callback={updateHandler} />
        if (ergoView === 'detail5') return <TestComponent5 />
        if (ergoView === 'detail6') return <TestComponent6 />
        if (ergoView === 'detail7') return <TestComponent7 />
    }

    let content;

    if (leftView === 'print') {
        content = <PrintTestPanel />;
    } else if (leftView === 'interpratation') {
        content = <Text>Interpretation here</Text>;
        content = <InterprationPanel />;
    } else {
        content = <TestPanel handlerButton={handlerButton} />;
    }




    return (

        <View style={styles.container}>

            <View style={styles.leftPanel}>

                {/* TOP FORM */}
                <View style={styles.formSection}>

                    <HeaderSearchComponent
                        buttonCallback={null}
                        buttonName={null}
                        setButtonState={null}
                        clearFieldFlag={null}
                        setClearFieldFlag={null}
                        dataPatient={dataPatient}
                    />
                </View>

                {/* BOTTOM LIST */}

                {/* Ergometry LIST */}
                <View style={styles.listSection}>
                    {renderTestView()}
                </View>
                <Button
                    title="Back to Home"
                    onPress={() => goTo('home')}
                />
                <TextInput
                    value={rawMeasurements?.heightcm?.toString()}
                />

            </View>

            {/* RIGHT PANEL */}
            <View style={styles.rightPanel}>
                {content}
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