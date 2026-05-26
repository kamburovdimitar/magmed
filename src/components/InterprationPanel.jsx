import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';
import LanguageUtil from '../utils/LanguageUtil'
import { MDPatient } from '../model/MDPatient';

export default function InterpretationPanel() {
    const raw = useSelector(
        (state) => state.user.selectedUser?.measurements
    );

    const rawuser = useSelector(
        (state) => state.user.selectedUser
    );

    const m = new MDPatientMeasurements(raw);
    const user = new MDPatient(rawuser);

    if (!m) return null;
    if (!user) return null;

    return (
        <View style={styles.page}>

            {/* HEADER */}
            <View style={styles.row}>
                <Cell label={LanguageUtil.getName('name_text')} value={user.firstname + " " + user.lastname} />
                <Cell label={LanguageUtil.getName('gender_text')} value="männlich" />
                <Cell label={LanguageUtil.getName('height_text')} value={`${m.heightcm} cm`} />
                <Cell label={LanguageUtil.getName('weight_text')} value={`${m.weightkg} kg`} />
                <Cell label={LanguageUtil.getName('bsa_text')} value="2.1 qm" />
            </View>

            {/* BODY MASS INDEX */}
            <Block title={`Body Mass Index ${m.bmi.toFixed(1)}`}>
                <Row>
                    <RangeCell active={m.bmi < 18.5} label="Underweight" range="<18.5" />
                    <RangeCell active={m.bmi >= 18.5 && m.bmi < 25} label="Normal weight" range="18.5-25" />
                    <RangeCell active={m.bmi >= 25 && m.bmi < 30} label="Overweight" range="25-30" />
                    <RangeCell active={m.bmi >= 30 && m.bmi < 40} label="Obesity" range="30-40" />
                    <RangeCell active={m.bmi >= 40} label="Morbid obesity" range=">40" />
                </Row>
            </Block>

            {/* WAIST HIP RATIO */}
            <Block title={`Waist-Hip Ratio ${m.whrindex.toFixed(2)}`}>
                <Row>
                    <RangeCell active={m.whrindex < 0.9} label="Normal" range="<0.9" />
                    <RangeCell active={m.whrindex >= 0.9 && m.whrindex < 1} label="Increased risk" range="0.9-1" />
                    <RangeCell active={m.whrindex >= 1} label="High risk" range=">1" />
                </Row>
            </Block>

            {/* BODY FAT */}
            <Block title={`Body Fat Percentage ${m.bodyfatpercent}%`}>
                <Row>
                    <RangeCell active={m.bodyfatpercent < 15} label="Low" range="<15" />
                    <RangeCell active={m.bodyfatpercent >= 15 && m.bodyfatpercent <= 22} label="Normal" range="15-22" />
                    <RangeCell active={m.bodyfatpercent > 22} label="High" range=">22" />
                </Row>
            </Block>

            {/* RESTING BLOOD PRESSURE */}
            <Block title={`Resting Blood Pressure ${m.bloodpressurerestsystolic}/${m.bloodpressurerestdiastolic} mmHg`}>
                <Row>
                    <RangeCell
                        active={m.bloodpressurerestsystolic < 120 && m.bloodpressurerestdiastolic < 80}
                        label="Optimal (<120 / <80)"
                    />
                    <RangeCell
                        active={
                            (m.bloodpressurerestsystolic >= 120 && m.bloodpressurerestsystolic <= 129) &&
                            m.bloodpressurerestdiastolic < 85
                        }
                        label="Normal (120–129 / <85)"
                    />
                    <RangeCell
                        active={
                            (m.bloodpressurerestsystolic >= 130 && m.bloodpressurerestsystolic <= 139) ||
                            (m.bloodpressurerestdiastolic >= 85 && m.bloodpressurerestdiastolic <= 89)
                        }
                        label="High-normal (130–139 / 85–89)"
                    />
                    <RangeCell
                        active={
                            m.bloodpressurerestsystolic >= 140 ||
                            m.bloodpressurerestdiastolic >= 90
                        }
                        label="Hypertension (≥140 / ≥90)"
                    />
                </Row>
            </Block>

            {/* RESTING HEART RATE */}
            <Block title={`Resting Heart Rate ${m.heartraterest} bpm`}>
                <Row>
                    <RangeCell active={m.heartraterest < 60} label="Bradycardia (Low)" />
                    <RangeCell active={m.heartraterest >= 60 && m.heartraterest <= 80} label="Optimal" />
                    <RangeCell active={m.heartraterest > 80 && m.heartraterest <= 100} label="Normal / Elevated" />
                    <RangeCell active={m.heartraterest > 100} label="Tachycardia (High)" />
                </Row>
            </Block>

            {/* MAXIMUM HEART RATE */}
            <Block title={`Maximum Heart Rate ${m.heartratemax} bpm`}>
                <Row>
                    <RangeCell active={m.heartratemax < m.expectedheartrate * 0.9} label="Below expected" />
                    <RangeCell active={m.heartratemax >= m.expectedheartrate * 0.9 && m.heartratemax <= m.expectedheartrate * 1.1} label="Normal" />
                    <RangeCell active={m.heartratemax > m.expectedheartrate * 1.1} label="Above expected" />
                </Row>
            </Block>

            {/* MAXIMUM BLOOD PRESSURE */}
            <Block title={`Maximum Blood Pressure ${m.bloodpressuremaxsystolic}/${m.bloodpressuremaxdiastolic} mmHg`}>
                <Row>
                    <RangeCell active={m.bloodpressuremaxsystolic < 190} label="Normal Response (<190 mmHg)" />
                    <RangeCell active={m.bloodpressuremaxsystolic >= 190 && m.bloodpressuremaxsystolic < 220} label="Moderate Increase (190–220 mmHg)" />
                    <RangeCell active={m.bloodpressuremaxsystolic >= 220 && m.bloodpressuremaxsystolic <= 240} label="High Response (220–240 mmHg)" />
                    <RangeCell active={m.bloodpressuremaxsystolic > 240} label="Excessive Response (>240 mmHg)" />
                </Row>
            </Block>
            {/* LACTATE */}
            <Block title="Lactate Threshold">
                <Row>
                    <Cell label="First Lactate Threshold (LT1)" value="Watt" />
                    <Cell label="Watt per kg" value="" />
                    <Cell label="Percent of VO2max" value="" />
                    <Cell label="Speed (km/h)" value="" />
                    <Cell label="Percent of Max Heart Rate" value="" />
                    <Cell label="Heart Rate" value="" />
                </Row>
                <Row>
                    <Cell label="Second Lactate Threshold (LT2)" value="Watt" />
                    <Cell label="Watt per kg" value="" />
                    <Cell label="Percent of VO2max" value="" />
                    <Cell label="Speed (km/h)" value="" />
                    <Cell label="Percent of Max Heart Rate" value="" />
                    <Cell label="Heart Rate" value="" />
                </Row>
            </Block>

            {/* VO2 MAX */}
            <Block title="Maximum Oxygen Uptake (VO2max)">
                <Row>
                    <Cell label="VO2max (absolute)" value="L/min" />
                    <Cell label="VO2max (relative)" value="ml/kg/min" />
                    <Cell label="Power Output (Watt)" value="" />
                    <Cell label="Heart Rate" value="" />
                </Row>
                <Row>
                    <Cell label="Ventilatory Threshold 1 (VT1)" value="" />
                    <Cell label="" value="" />
                    <Cell label="" value="" />
                    <Cell label="" value="" />
                </Row>
                <Row>
                    <Cell label="Ventilatory Threshold 2 (VT2)" value="" />
                    <Cell label="" value="" />
                    <Cell label="" value="" />
                    <Cell label="" value="" />
                </Row>
            </Block>

            {/* HEART RATE ZONES */}
            <Block title="Heart Rate Zones (%)">
                <Row>
                    {['45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100', '105', '110'].map((p, i) => (
                        <View key={i} style={styles.hrCell}>
                            <Text style={styles.hrText}>{p}%</Text>
                        </View>
                    ))}
                </Row>

                <Row>
                    {Array(14).fill(0).map((_, i) => (
                        <View key={i} style={[styles.hrCell, i >= 2 && i <= 7 && styles.yellow]} />
                    ))}
                </Row>

                <Row>
                    {Array(14).fill(0).map((_, i) => (
                        <View key={i} style={[styles.hrCell, i >= 4 && i <= 9 && styles.green]} />
                    ))}
                </Row>
            </Block>

        </View>
    );
}

/* COMPONENTS */

function Block({ title, children }) {
    return (
        <View style={styles.block}>
            <Text style={styles.blockTitle}>{title}</Text>
            {children}
        </View>
    );
}

function Row({ children }) {
    return <View style={styles.row}>{children}</View>;
}

function Cell({ label, value }) {
    return (
        <View style={styles.cell}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

function RangeCell({ label, range, active }) {
    return (
        <View style={[styles.rangeCell, active && styles.active]}>
            <Text style={styles.rangeLabel}>{label}</Text>
            {range && <Text style={styles.range}>{range}</Text>}
        </View>
    );
}

/* STYLES */

const styles = StyleSheet.create({
    page: { padding: 10, backgroundColor: '#fff' },

    block: { borderWidth: 1, marginTop: 10 },

    blockTitle: {
        borderBottomWidth: 1,
        padding: 5,
        fontWeight: '600',
    },

    row: { flexDirection: 'row' },

    cell: {
        flex: 1,
        borderRightWidth: 1,
        padding: 5,
    },

    label: { fontSize: 10, color: '#555' },

    value: { fontSize: 12, fontWeight: '600' },

    rangeCell: {
        flex: 1,
        borderRightWidth: 1,
        padding: 5,
        alignItems: 'center',
    },

    rangeLabel: { fontSize: 10 },

    range: { fontSize: 9, color: '#555' },

    active: { backgroundColor: '#c6efce' },

    hrCell: {
        flex: 1,
        borderWidth: 1,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    hrText: { fontSize: 9 },

    yellow: { backgroundColor: '#ffe599' },

    green: { backgroundColor: '#b6d7a8' },
});