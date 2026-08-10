import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

    function getRestingBloodPressureCategory(sys, dia) {
        if (sys >= 140 || dia >= 90)
            return 'hypertension';

        if (sys >= 130 || dia >= 85)
            return 'high-normal';

        if (sys >= 120 || dia >= 80)
            return 'normal';

        return 'optimal';
    }

    const heartRateZones = m.heartRateZones;

    //const intensities = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110];



    // const heartRateZones = intensities.map(percent => ({
    //     percent,
    //     bpm: Math.round(
    //         m.heartraterest +
    //         (percent / 100) *
    //         (m.heartratemax - m.heartraterest)
    //     )
    // }));

    const bpCategory = getRestingBloodPressureCategory(
        m.bloodpressurerestsystolic,
        m.bloodpressurerestdiastolic
    );


    function getRestingHeartRateCategory(hr) {
        if (hr > 100)
            return 'tachycardia';

        if (hr > 80)
            return 'elevated';

        if (hr >= 60)
            return 'optimal';

        return 'bradycardia';
    }

    const hrCategory = getRestingHeartRateCategory(
        m.heartraterest
    );


    function getMaximumHeartRatePercent(measured, expected) {
        if (expected <= 0) return 0;

        return Math.round((measured / expected) * 100);
    }

    const maxHeartRatePercent = getMaximumHeartRatePercent(
        m.heartratemax,
        m.expectedheartrate
    );

    function getMaximumBloodPressureCategory(sys) {
        if (sys > 240)
            return 'excessive';

        if (sys >= 220)
            return 'high';

        if (sys >= 190)
            return 'moderate';

        return 'normal';
    }

    const maxBpCategory = getMaximumBloodPressureCategory(
        m.bloodpressuremaxsystolic
    );

    return (
        <ScrollView>


            <View style={styles.page}>

                {/* HEADER */}

                <View style={styles.row}>
                    <Cell label={LanguageUtil.getName('name_text')} value={user.firstname + " " + user.lastname} />
                    <Cell label={LanguageUtil.getName('gender_text')} value={user.gender} />
                    <Cell label={LanguageUtil.getName('height_text')} value={`${m.heightcm} cm`} />
                    <Cell label={LanguageUtil.getName('weight_text')} value={`${m.weightkg} kg`} />
                    <Cell label={LanguageUtil.getName('bsa_text')} value={`${m.bodysurfacearea.toFixed(2)} m²`} />
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
                            active={bpCategory === 'optimal'}
                            label="Optimal (<120 / <80)"
                        />
                        <RangeCell
                            active={bpCategory === 'normal'}
                            label="Normal (120–129 / 80–84)"
                        />
                        <RangeCell
                            active={bpCategory === 'high-normal'}
                            label="High-normal (130–139 / 85–89)"
                        />
                        <RangeCell
                            active={bpCategory === 'hypertension'}
                            label="Hypertension (≥140 / ≥90)"
                        />
                    </Row>
                </Block>

                {/* RESTING HEART RATE */}
                <Block title={`Resting Heart Rate ${m.heartraterest} bpm`}>
                    <Row>
                        <RangeCell
                            active={hrCategory === 'bradycardia'}
                            label="Bradycardia (Low)"
                        />

                        <RangeCell
                            active={hrCategory === 'optimal'}
                            label="Optimal"
                        />

                        <RangeCell
                            active={hrCategory === 'elevated'}
                            label="Normal / Elevated"
                        />

                        <RangeCell
                            active={hrCategory === 'tachycardia'}
                            label="Tachycardia (High)"
                        />
                    </Row>
                </Block>

                {/* MAXIMUM HEART RATE */}
                <Block title="Maximum Heart Rate">
                    <Row>
                        <Cell
                            label="Measured"
                            value={`${m.heartratemax} bpm`}
                        />

                        <Cell
                            label="Expected"
                            value={`${m.expectedheartrate} bpm`}
                        />

                        <Cell
                            label="% Expected"
                            value={`${maxHeartRatePercent}%`}
                        />
                    </Row>
                </Block>

                {/* MAXIMUM BLOOD PRESSURE */}
                <Block title={`Maximum Blood Pressure ${m.bloodpressuremaxsystolic}/${m.bloodpressuremaxdiastolic} mmHg`}>
                    <Row>
                        <RangeCell
                            active={maxBpCategory === 'normal'}
                            label="Normal Response (<190 mmHg)"
                        />

                        <RangeCell
                            active={maxBpCategory === 'moderate'}
                            label="Moderate Increase (190–219 mmHg)"
                        />

                        <RangeCell
                            active={maxBpCategory === 'high'}
                            label="High Response (220–240 mmHg)"
                        />

                        <RangeCell
                            active={maxBpCategory === 'excessive'}
                            label="Excessive Response (>240 mmHg)"
                        />
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
                <Block title="Heart Rate Zones (Karvonen)">
                    <Row>
                        {heartRateZones.map(zone => (
                            <View key={zone.percent} style={styles.hrCell}>
                                <Text style={styles.hrText}>{zone.percent}%</Text>
                            </View>
                        ))}
                    </Row>

                    <Row>
                        {heartRateZones.map(zone => (
                            <View key={zone.percent} style={styles.hrCell}>
                                <Text style={styles.hrText}>{zone.bpm}</Text>
                            </View>
                        ))}
                    </Row>
                </Block>
            </View>

        </ScrollView>
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