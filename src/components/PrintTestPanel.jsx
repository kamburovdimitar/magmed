import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import LanguageUtil from '../utils/LanguageUtil';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';

export default function PrintTestPanel() {
    const selectedUser = useSelector((state) => state.user.selectedUser);

    const rawMeasurements = useSelector(
        (state) => state.user.selectedUser?.measurements
    );

    const measurements = new MDPatientMeasurements(rawMeasurements);

    if (!selectedUser) return null;

    return (
        <View style={styles.page}>
            <Text style={styles.title}>
                {LanguageUtil.getName('koerpermasse_und_vitalparameter_text')}
            </Text>

            <View style={styles.section}>
                <PrintRow
                    label={LanguageUtil.getName('koerpergroesse_text')}
                    value={`${measurements.heightcm} cm`}
                />

                <PrintRow
                    label={LanguageUtil.getName('koerpergewicht_text')}
                    value={`${measurements.weightkg} kg`}
                />

                <PrintRow
                    label={LanguageUtil.getName('body_mass_index_text')}
                    value={measurements.bmi.toFixed(1)}
                />

                <PrintRow
                    label={LanguageUtil.getName('taillenumfang_text')}
                    value={`${measurements.waistcm} cm`}
                />

                <PrintRow
                    label={LanguageUtil.getName('hueftumfang_text')}
                    value={`${measurements.hipcm} cm`}
                />

                <PrintRow
                    label={LanguageUtil.getName('whr_index_text')}
                    value={measurements.whrindex.toFixed(2)}
                />

                <PrintRow
                    label={LanguageUtil.getName('koerperfettanteil_text')}
                    value={`${measurements.bodyfatpercent} %`}
                />

                <PrintRow
                    label={LanguageUtil.getName('fettmasse_text')}
                    value={`${measurements.fatmasskg.toFixed(1)} kg`}
                />
            </View>

            <View style={styles.section}>
                <PrintRow
                    label={LanguageUtil.getName('blutdruck_ruhe_text')}
                    value={`${measurements.bloodpressurerestsystolic}/${measurements.bloodpressurerestdiastolic} mmHg`}
                />

                <PrintRow
                    label={LanguageUtil.getName('blutdruck_max_text')}
                    value={`${measurements.bloodpressuremaxsystolic}/${measurements.bloodpressuremaxdiastolic} mmHg`}
                />

                <PrintRow
                    label={LanguageUtil.getName('herzfrequenz_ruhe_text')}
                    value={`${measurements.heartraterest} bpm`}
                />

                <PrintRow
                    label={LanguageUtil.getName('herzfrequenz_max_text')}
                    value={`${measurements.heartratemax} bpm`}
                />

                <PrintRow
                    label={LanguageUtil.getName(
                        'durchschnittlicher_erwartungswert_text'
                    )}
                    value={`${measurements.expectedheartrate} bpm`}
                />
            </View>
        </View>
    );
}

function PrintRow({ label, value }) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        backgroundColor: 'white',
        padding: 30,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    section: {
        marginBottom: 25,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    label: {
        width: '65%',
        fontSize: 14,
    },

    value: {
        width: '35%',
        textAlign: 'right',
        fontSize: 14,
        fontWeight: '600',
    },
});