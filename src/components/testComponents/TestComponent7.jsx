// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Screen split (1:1 with 3.25CCC_Test_Ergometri_
//   PROJEKT.pdf and Präsentation2.pptx): this was an empty stub
//   ("TestComponent 7"). Button 7 in the Codex's 7-item "3.00 Test" menu is
//   "ALLE Tests" — the combined view showing everything together. That is
//   exactly what the OLD TestComponent1.jsx used to render (before it was
//   split down to just Körpermaße/Vitalparameter), so that entire, working,
//   already-wired implementation was moved here as-is rather than rebuilt —
//   no functionality was lost, it just now lives behind the correct button.
//   Page8.tsx's renderTestView() was updated to pass this component the
//   onPrint/onInterpration/onGenereateFakeData/setModel props that used to go
//   to TestComponent1.
// ============================================

import React from 'react'
import { View, ScrollView, StyleSheet, Button, TouchableOpacity, Text } from 'react-native'
import TestMeasurmentComponent from '../TestMeasurementsComponent'
import { useEffect, useState } from "react";
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'
import ErgoResultComponent from '../ErgoResultComponent'
import HeartRateZoneComponent from '../HeartRateZoneComponent';
import ErgometryTableComponent from '../ErgometryTableComponent';
import { ErgometryUtil } from '../../utils/ErgometrieUtil';
import ErgometryResultsComponent from '../ErgometryResultsComponent';
import LactateThresholdComponent from '../LactateThresholdComponent';
import VO2MaxComponent from '../VO2MaxComponent';
import HeartRateZonesComponent from '../HeartRateZonesComponent';
import LactateModelPickerComponent from '../LactateModelPickerComponent';
import { ERGOMETRY_MODELS } from '../../constants/ergometryModels';

export default function TestComponent7({
    callback,
    measurement,
    onPrint,
    onInterpration,
    onGenereateFakeData,
    setModel,
    selectedModel: selectedModelProp
}) {

    const [selectedModel, setSelectedModel] = useState(selectedModelProp ?? ERGOMETRY_MODELS.DICKHUTH);
    const [localMeasurements, setLocalMeasurements] = useState(new MDPatientMeasurements(measurement));

    useEffect(() => {

        setModel && setModel(selectedModel)

    }, [selectedModel]);




    useEffect(() => {

        if (!measurement) return;

        setLocalMeasurements(new MDPatientMeasurements(measurement));

    }, [measurement]);

    function onUpdateMeasurements(field, value) {

        let updated = {
            ...localMeasurements,
            [field]: value === '' ? null : isNaN(Number(value)) ? value : Number(value)
        };

        updated = new MDPatientMeasurements(updated);

        setLocalMeasurements(updated);

        console.log(updated.heartrateReserve, updated.hrr70, updated.hrr80, updated.hrr90);

        callback(updated);

    }

    function onPrintHandler() {
        onPrint && onPrint();
    }

    function onInterprationHandler() {
        onInterpration && onInterpration();
    }

    function genereateFakeDataHandler() {

        let fake = onGenereateFakeData();
        //setErgoType(fake.ergometry.type)

        fake.ergometry = ErgometryUtil.generateFakeErgometry();

        fake = new MDPatientMeasurements(fake);

        fake.ergometryReports = ErgometryUtil.validateAllModels(fake.ergometry.data);

        setLocalMeasurements(fake);

        callback(fake);

    }

    function onUpdateRow(index, field, value) {

        let data =
            [...localMeasurements.ergometry.data];

        data[index] = {

            ...data[index],

            [field]: value

        };

        let updated =
            new MDPatientMeasurements(localMeasurements);

        updated.ergometry.data = data;

        updated.ergometryReports =
            ErgometryUtil.validateAllModels(
                updated.ergometry.data
            );

        setLocalMeasurements(updated);

        callback(updated);

    }



    return (

        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}
        >

            <View style={styles.ergoRow}>

                <TouchableOpacity
                    style={[
                        styles.ergoButton,
                        localMeasurements?.ergometry?.type === 'bike'
                        && styles.selected
                    ]}
                    onPress={() => {

                        let updated =
                            new MDPatientMeasurements(
                                localMeasurements
                            );

                        updated.ergometry.type =
                            'bike';

                        setLocalMeasurements(
                            updated
                        );

                        callback(
                            updated
                        );

                    }}
                >
                    <Text>
                        🚴 Bike
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.ergoButton,
                        localMeasurements?.ergometry?.type === 'run'
                        && styles.selected
                    ]}
                    onPress={() => {

                        let updated =
                            new MDPatientMeasurements(
                                localMeasurements
                            );

                        updated.ergometry.type =
                            'run';

                        setLocalMeasurements(
                            updated
                        );

                        callback(
                            updated
                        );

                    }}
                >
                    <Text>
                        🏃 Laufband
                    </Text>

                </TouchableOpacity>

                <LactateModelPickerComponent
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                />

            </View>


            <TestMeasurmentComponent
                measurements={localMeasurements}
                onUpdateMeasurements={
                    onUpdateMeasurements
                }

            />

            <ErgoResultComponent
                measurements={localMeasurements}
                onUpdateMeasurements={
                    onUpdateMeasurements
                }
            />

            <HeartRateZoneComponent
                measurements={localMeasurements}
            />


            <ErgometryTableComponent
                measurements={localMeasurements}
                selectedModel={selectedModel}
                onUpdateRow={onUpdateRow}
            />

            <ErgometryResultsComponent
                measurements={localMeasurements}
                selectedModel={selectedModel}
            />

            <LactateThresholdComponent
                measurements={localMeasurements}
                selectedModel={selectedModel}
            />

            <VO2MaxComponent
                measurements={localMeasurements}
                selectedModel={selectedModel}
            />

            <HeartRateZonesComponent
                measurements={localMeasurements}
                selectedModel={selectedModel}
            />

            <Button
                title="Print"
                onPress={
                    onPrintHandler
                }
            />

            <Button
                title="Generate Fake Data"
                onPress={
                    genereateFakeDataHandler
                }
            />

            <Button
                title="Interpration"
                onPress={
                    onInterprationHandler
                }
            />

        </ScrollView>

    );
}

const styles = StyleSheet.create({

    container: {
        gap: 10,
        paddingBottom: 30,
    },

    ergoRow: {
        flexDirection: 'row',
        gap: 10
    },

    ergoButton: {
        width: 130,
        padding: 10,
        borderWidth: 1,
        alignItems: 'center'
    },

    selected: {
        backgroundColor: '#ffe600'
    }

})
