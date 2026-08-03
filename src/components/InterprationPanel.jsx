import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useSelector } from 'react-redux';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';
import LanguageUtil from '../utils/LanguageUtil'
import { MDPatient } from '../model/MDPatient';
import { ErgometryUtil } from '../utils/ErgometrieUtil';
import { CodexUtil } from '../utils/CodexUtil';

export default function InterpretationPanel({
    model,
    measurement
}) {

    if (!measurement)
        return null;

    if (!model)
        return null;

    const currentMeasurement =
        new MDPatientMeasurements(
            measurement
        );

    const report =
        ErgometryUtil.createReport(
            currentMeasurement,
            model
        );

    console.log(
        "INTERPRETATION",
        currentMeasurement.ergometry.data[0]
    );

    console.log(report);

    debugger

    if (!report?.result) {

        return (
            <Text>
                No report available.
            </Text>
        );

    }

    const iansHF =
        report.result.IANSPoint?.hf ?? 0;

    const interpretation = {

        /* -------------------------------------------------
         * PATIENT
         * ------------------------------------------------- */

        name:
            "",

        gender:
            "männlich",

        height:
            currentMeasurement.heightcm,

        weight:
            currentMeasurement.weightkg,

        bmi:
            currentMeasurement.bmi,

        bsa:
            currentMeasurement.bodysurfacearea,

        whr:
            currentMeasurement.whrindex,

        bodyFat:
            currentMeasurement.bodyfatpercent,

        restHR:
            currentMeasurement.heartraterest,

        maxHR:
            currentMeasurement.heartratemax,

        expectedHR:
            currentMeasurement.expectedheartrate,

        restBP:
            `${currentMeasurement.bloodpressurerestsystolic}/${currentMeasurement.bloodpressurerestdiastolic}`,

        maxBP:
            `${currentMeasurement.bloodpressuremaxsystolic}/${currentMeasurement.bloodpressuremaxdiastolic}`,

        /* -------------------------------------------------
         * LT1
         * ------------------------------------------------- */

        lt1Load:
            report.result.IASPoint?.load,

        lt1HF:
            report.result.IASPoint?.hf,

        lt1Lactate:
            report.result.IASPoint?.lactate,

        lt1WattKg:
            CodexUtil.calculateIASWattKg(
                report.result.IASPoint,
                currentMeasurement.weightkg
            ),

        lt1VO2:
            CodexUtil.calculateIASVO2(
                report.result.IASPoint
            ),

        lt1VO2Kg:
            CodexUtil.calculateIASVO2Kg(
                report.result.IASPoint,
                currentMeasurement.weightkg
            ),

        lt1VO2Percent:
            CodexUtil.calculateIASVO2Percent(
                report.result.IASPoint
            ),

        lt1HFPercent:
            CodexUtil.calculateIASHFPercent(
                report.result.IASPoint,
                currentMeasurement.heartratemax
            ),

        lt1Speed:
            CodexUtil.calculateIASSpeed(
                report.result.IASPoint,
                currentMeasurement.ergometry.type
            ),

        /* -------------------------------------------------
         * LT2
         * ------------------------------------------------- */

        lt2Load:
            report.result.IANSPoint?.load,

        lt2HF:
            report.result.IANSPoint?.hf,

        lt2Lactate:
            report.result.IANSPoint?.lactate,

        lt2WattKg:
            CodexUtil.calculateIANSWattKg(
                report.result.IANSPoint,
                currentMeasurement.weightkg
            ),

        lt2VO2:
            CodexUtil.calculateIANSVO2(
                report.result.IANSPoint
            ),

        lt2VO2Kg:
            CodexUtil.calculateIANSVO2Kg(
                report.result.IANSPoint,
                currentMeasurement.weightkg
            ),

        lt2VO2Percent:
            CodexUtil.calculateIANSVO2Percent(
                report.result.IANSPoint
            ),

        lt2HFPercent:
            CodexUtil.calculateIANSHFPercent(
                report.result.IANSPoint,
                currentMeasurement.heartratemax
            ),

        lt2Speed:
            CodexUtil.calculateIANSSpeed(
                report.result.IANSPoint,
                currentMeasurement.ergometry.type
            ),

        /* -------------------------------------------------
         * HR ZONES
         * ------------------------------------------------- */

        hrZones:
            [
                45,
                50,
                55,
                60,
                65,
                70,
                75,
                80,
                85,
                90,
                95,
                100,
                105,
                110
            ].map(
                p =>
                    Math.round(
                        iansHF * p / 100
                    )
            )

    };


    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                paddingBottom: 30
            }}
        >

            <Text style={styles.title}>
                Ergometry Interpretation
            </Text>

            {/* -------------------------------- */}
            {/* PATIENT */}
            {/* -------------------------------- */}

            <Block title="Patient">

                <Row>

                    <Cell
                        label="Height"
                        value={interpretation.height}
                    />

                    <Cell
                        label="Weight"
                        value={interpretation.weight}
                    />

                </Row>

                <Row>

                    <Cell
                        label="BMI"
                        value={interpretation.bmi}
                    />

                    <Cell
                        label="BSA"
                        value={interpretation.bsa}
                    />

                </Row>

                <Row>

                    <Cell
                        label="WHR"
                        value={interpretation.whr}
                    />

                    <Cell
                        label="Body Fat %"
                        value={interpretation.bodyFat}
                    />

                </Row>

            </Block>

            {/* -------------------------------- */}
            {/* BLOOD PRESSURE */}
            {/* -------------------------------- */}

            <Block title="Blood Pressure">

                <Row>

                    <Cell
                        label="Rest"
                        value={interpretation.restBP}
                    />

                    <Cell
                        label="Maximum"
                        value={interpretation.maxBP}
                    />

                </Row>

            </Block>

            {/* -------------------------------- */}
            {/* HEART RATE */}
            {/* -------------------------------- */}

            <Block title="Heart Rate">

                <Row>

                    <Cell
                        label="Rest HR"
                        value={interpretation.restHR}
                    />

                    <Cell
                        label="Expected HR"
                        value={interpretation.expectedHR}
                    />

                </Row>

                <Row>

                    <Cell
                        label="Maximum HR"
                        value={interpretation.maxHR}
                    />

                    <Cell
                        label=""
                        value=""
                    />

                </Row>

            </Block>

            {/* -------------------------------- */}
            {/* LT1 */}
            {/* -------------------------------- */}

            <Block title="LT1 (IAS)">

                <Row>

                    <Cell
                        label="Load"
                        value={interpretation.lt1Load}
                    />

                    <Cell
                        label="HF"
                        value={interpretation.lt1HF}
                    />

                </Row>

                <Row>

                    <Cell
                        label="Lactate"
                        value={interpretation.lt1Lactate}
                    />

                    <Cell
                        label="W/kg"
                        value={interpretation.lt1WattKg}
                    />

                </Row>

                <Row>

                    <Cell
                        label="VO₂"
                        value={interpretation.lt1VO2}
                    />

                    <Cell
                        label="VO₂/kg"
                        value={interpretation.lt1VO2Kg}
                    />

                </Row>

                <Row>

                    <Cell
                        label="VO₂ %"
                        value={interpretation.lt1VO2Percent}
                    />

                    <Cell
                        label="HF %"
                        value={interpretation.lt1HFPercent}
                    />

                </Row>

                <Row>

                    <Cell
                        label="Speed"
                        value={interpretation.lt1Speed}
                    />

                    <Cell
                        label=""
                        value=""
                    />

                </Row>

            </Block>

            {/* -------------------------------- */}
            {/* LT2 */}
            {/* -------------------------------- */}

            <Block title="LT2 (IANS)">

                <Row>

                    <Cell
                        label="Load"
                        value={interpretation.lt2Load}
                    />

                    <Cell
                        label="HF"
                        value={interpretation.lt2HF}
                    />

                </Row>

                <Row>

                    <Cell
                        label="Lactate"
                        value={interpretation.lt2Lactate}
                    />

                    <Cell
                        label="W/kg"
                        value={interpretation.lt2WattKg}
                    />

                </Row>

                <Row>

                    <Cell
                        label="VO₂"
                        value={interpretation.lt2VO2}
                    />

                    <Cell
                        label="VO₂/kg"
                        value={interpretation.lt2VO2Kg}
                    />

                </Row>

                <Row>

                    <Cell
                        label="VO₂ %"
                        value={interpretation.lt2VO2Percent}
                    />

                    <Cell
                        label="HF %"
                        value={interpretation.lt2HFPercent}
                    />

                </Row>

                <Row>

                    <Cell
                        label="Speed"
                        value={interpretation.lt2Speed}
                    />

                    <Cell
                        label=""
                        value=""
                    />

                </Row>

            </Block>

            {/* -------------------------------- */}
            {/* HEART RATE ZONES */}
            {/* -------------------------------- */}

            <Block title="Heart Rate Zones">

                <Row>

                    {
                        interpretation.hrZones.map(
                            (value, index) => (

                                <RangeCell
                                    key={index}
                                    label={`${45 + index * 5}%`}
                                    range={value}
                                />

                            )
                        )
                    }

                </Row>

            </Block>

        </ScrollView>

    );

    /* ============================================================
 * COMPONENTS
 * ============================================================ */

    function Block({
        title,
        children
    }) {

        return (

            <View style={styles.block}>

                <Text style={styles.blockTitle}>
                    {title}
                </Text>

                {children}

            </View>

        );

    }

    function Row({
        children
    }) {

        return (

            <View style={styles.row}>

                {children}

            </View>

        );

    }

    function Cell({
        label,
        value
    }) {

        return (

            <View style={styles.cell}>

                <Text style={styles.label}>
                    {label}
                </Text>

                <Text style={styles.value}>
                    {
                        value == null
                            ? "-"
                            : value
                    }
                </Text>

            </View>

        );

    }

    function RangeCell({
        label,
        range,
        active
    }) {

        return (

            <View
                style={[
                    styles.rangeCell,
                    active &&
                    styles.active
                ]}
            >

                <Text style={styles.rangeLabel}>
                    {label}
                </Text>

                {
                    range != null &&

                    <Text style={styles.range}>
                        {range}
                    </Text>

                }

            </View>

        );

    }



}

/* ============================================================
    * STYLES
    * ============================================================ */

const styles = StyleSheet.create({

    container: {

        flex: 1,
        padding: 10,
        backgroundColor: "#fff"

    },

    title: {

        fontSize: 22,
        fontWeight: "700",
        marginBottom: 10

    },

    block: {

        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 12

    },

    blockTitle: {

        backgroundColor: "#f3f3f3",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",

        fontSize: 15,
        fontWeight: "700",

        padding: 8

    },

    row: {

        flexDirection: "row"

    },

    cell: {

        flex: 1,

        borderRightWidth: 1,
        borderBottomWidth: 1,

        borderColor: "#ddd",

        padding: 8

    },

    label: {

        fontSize: 11,
        color: "#666"

    },

    value: {

        marginTop: 4,
        fontSize: 15,
        fontWeight: "600"

    },

    rangeCell: {

        flex: 1,

        borderRightWidth: 1,
        borderBottomWidth: 1,

        borderColor: "#ddd",

        padding: 6,

        alignItems: "center",
        justifyContent: "center"

    },

    rangeLabel: {

        fontSize: 10,
        textAlign: "center"

    },

    range: {

        marginTop: 3,

        fontSize: 12,
        fontWeight: "600"

    },

    active: {

        backgroundColor: "#d9ead3"

    }

});

