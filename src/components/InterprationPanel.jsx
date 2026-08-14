// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 13:30 (Europe/Sofia) — Replaced the % of IANS-HF Training Zones block
//   with the Codex/CCC-compliant cascade table (REG/IAS/GA1/GA2/IANS/E1/E2), using
//   ErgometryModelsUtil.calculateTrainingZoneTable() for HF boundaries + real
//   Watt/km-h/Pace lookup from the measured stage curve.
// 2026-08-11 14:20 (Europe/Sofia) — Restored the "enlarge to read comfortably" zoom
//   requirement (Codex 3.13), this time via a real font-size scale (ZoomContext)
//   instead of the old CSS `zoom` transform, so it no longer breaks ScrollView's
//   scroll-height calculation. Controlled by the new zoomLevel prop (set from
//   Page8's zoom buttons).
// 2026-08-11 (Europe/Sofia) — Localization pass: the two hardcoded "Lactate"
//   column headers (Lactate Threshold block, Training Zones block) now go
//   through LanguageUtil.getName('laktat') (exact matching key already in
//   Translations.js). Left the "Watt" header cells hardcoded — no
//   exact-match key exists for that. Separately noticed but NOT changed
//   (flagging for the user, since it's a different kind of bug than what was
//   asked): the patient-info row above already calls LanguageUtil.getName
//   with 'name_text', 'height_text', 'weight_text' and 'bsa_text' — none of
//   those keys exist in Translations.js, so today they render literally as
//   the strings "name_text"/"height_text"/"weight_text"/"bsa_text" instead
//   of real labels (only 'gender_text' among that group actually exists).
//   Worth a follow-up once it's clear which existing key each should map to
//   (e.g. height_text vs. the existing koerpergroesse_text).
// ============================================

import React, { createContext, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';
import LanguageUtil from '../utils/LanguageUtil'
import { MDPatient } from '../model/MDPatient';
import { ErgometryUtil } from '../utils/ErgometrieUtil';
import { CodexUtil } from '../utils/CodexUtil';
import { ErgometryModelsUtil } from '../utils/ErgometryModelsUtil';
import { ERGOMETRY_MODELS } from '../constants/ergometryModels';

// 🔹 Zoom — real font-size scaling (not a CSS transform) so the ScrollView's
// content height is computed correctly at the scaled size and nothing clips.
const ZoomContext = createContext(1);

export default function InterpretationPanel({
    selectedModel = ERGOMETRY_MODELS.DICKHUTH,
    zoomLevel = 1
}) {
    function scaleFont(base) {
        return Math.round(base * zoomLevel);
    }

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

    // 🔹 shared source for Lactate Threshold + IANS-based Training Zones
    const report = ErgometryUtil.getReportByModel(
        m.ergometryReports,
        selectedModel
    )?.result;

    const isRun = m.ergometry?.type === 'run';

    function fmt(value, suffix = '') {
        if (value === null || value === undefined || value === '') return '–';
        return `${value}${suffix}`;
    }

    // 🔹 Lactate Threshold values (real, from the selected model's report)
    const firstLoad = isRun
        ? CodexUtil.calculateIASSpeed(report?.IASPoint, m.ergometry?.type)
        : report?.IASPoint?.load;

    const secondLoad = isRun
        ? CodexUtil.calculateIANSSpeed(report?.IANSPoint, m.ergometry?.type)
        : report?.IANSPoint?.load;

    const firstWattKg = isRun
        ? null
        : CodexUtil.calculateIASWattKg(report?.IASPoint, m.weightkg);

    const secondWattKg = isRun
        ? null
        : CodexUtil.calculateIANSWattKg(report?.IANSPoint, m.weightkg);

    const firstHFPercent = CodexUtil.calculateIASHFPercent(report?.IASPoint, m.heartratemax);
    const secondHFPercent = CodexUtil.calculateIANSHFPercent(report?.IANSPoint, m.heartratemax);

    // 🔹 Training Zones — Codex/CCC-compliant cascade (per "3.34 CCC Laktatkurve
    // und Trainingsbereich"): HF boundary per zone, then Watt/km-h looked up on
    // the real measured stage curve (never a % of the threshold load).
    const trainingZones = ErgometryModelsUtil.calculateTrainingZoneTable(
        report,
        m.ergometry?.data,
        selectedModel,
        isRun
    );

    return (
        <ZoomContext.Provider value={zoomLevel}>
        <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
        >

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
                    <Row>
                        <Cell label="Fat Mass" value={`${m.fatmasskg.toFixed(1)} kg`} />
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

                {/* ERGOMETRY PERFORMANCE */}
                {isRun ? (
                    <Block title="Ergometry Performance (Treadmill)">
                        <Row>
                            <Cell label="Max Speed" value={`${fmt(m.maxspeed)} km/h`} />
                            <Cell label="Pace" value={`${fmt(m.minperkm)} min/km`} />
                        </Row>
                    </Block>
                ) : (
                    <>
                        <Block title="Ergometry Performance — Body Surface Area based">
                            <Row>
                                <Cell label="SOLL Watt" value={`${fmt(m.sollWatt)} W`} />
                                <Cell label="IST Watt" value={`${fmt(m.istWatt)} W`} />
                                <Cell label="SOLL Watt/kg" value={fmt(m.sollWattKg)} />
                                <Cell label="IST Watt/kg" value={fmt(m.istWattKg)} />
                                <Cell label="IST % Norm" value={`${fmt(m.istPercent)}%`} />
                            </Row>
                            <Row>
                                <Text style={[styles.note, { fontSize: scaleFont(styles.note.fontSize) }]}>
                                    SOLL values use a provisional reference table — pending the official MAGMED norm table.
                                </Text>
                            </Row>
                        </Block>

                        <Block title="Ergometry Performance — Body Weight based">
                            <Row>
                                <Cell label="SOLL Watt" value={`${fmt(m.sollWeightWatt)} W`} />
                                <Cell label="IST Watt" value={`${fmt(m.istWatt)} W`} />
                                <Cell label="SOLL Watt/kg" value={fmt(m.sollWeightWattKg)} />
                                <Cell label="IST Watt/kg" value={fmt(m.istWeightWattKg)} />
                                <Cell label="IST % Norm" value={`${fmt(m.istWeightPercent)}%`} />
                            </Row>
                        </Block>
                    </>
                )}

                {/* LACTATE THRESHOLD */}
                <Block title={`Lactate Threshold (${selectedModel})`}>
                    {!report ? (
                        <Row>
                            <Text style={[styles.note, { fontSize: scaleFont(styles.note.fontSize) }]}>
                                No ergometry report calculated yet for the "{selectedModel}" model.
                            </Text>
                        </Row>
                    ) : (
                        <>
                            <Row>
                                <Cell label="" value={isRun ? 'Speed' : 'Watt'} />
                                <Cell label="" value="Watt/kg" />
                                <Cell label="" value="%HFmax" />
                                <Cell label="" value="HF" />
                                <Cell label="" value={LanguageUtil.getName('laktat')} />
                            </Row>
                            <Row>
                                <Cell
                                    label="First LT (IAS)"
                                    value={isRun ? `${fmt(firstLoad)} km/h` : `${fmt(firstLoad)} W`}
                                />
                                <Cell label="" value={fmt(firstWattKg)} />
                                <Cell label="" value={`${fmt(firstHFPercent)}%`} />
                                <Cell label="" value={`${fmt(report?.IASPoint?.hf)} bpm`} />
                                <Cell label="" value={`${fmt(report?.IASPoint?.lactate)} mmol`} />
                            </Row>
                            <Row>
                                <Cell
                                    label="Second LT (IANS)"
                                    value={isRun ? `${fmt(secondLoad)} km/h` : `${fmt(secondLoad)} W`}
                                />
                                <Cell label="" value={fmt(secondWattKg)} />
                                <Cell label="" value={`${fmt(secondHFPercent)}%`} />
                                <Cell label="" value={`${fmt(report?.IANSPoint?.hf)} bpm`} />
                                <Cell label="" value={`${fmt(report?.IANSPoint?.lactate)} mmol`} />
                            </Row>
                        </>
                    )}
                </Block>

                {/* VO2 MAX — not available yet, kept visible as a placeholder for spiro-ergometry data */}
                <Block title="Maximum Oxygen Uptake (VO2max)">
                    <Row>
                        <Text style={[styles.note, { fontSize: scaleFont(styles.note.fontSize) }]}>
                            Not available yet — requires spiro-ergometry input (VO2max, VT1, VT2).
                        </Text>
                    </Row>
                    <Row>
                        <Cell label="" value="Watt" />
                        <Cell label="" value="ml/kg/min" />
                        <Cell label="" value="HF" />
                    </Row>
                    <Row>
                        <Cell label="VO2max" value="–" />
                        <Cell label="" value="–" />
                        <Cell label="" value="–" />
                    </Row>
                    <Row>
                        <Cell label="VT1" value="–" />
                        <Cell label="" value="–" />
                        <Cell label="" value="–" />
                    </Row>
                    <Row>
                        <Cell label="VT2" value="–" />
                        <Cell label="" value="–" />
                        <Cell label="" value="–" />
                    </Row>
                </Block>

                {/* HEART RATE ZONES — Karvonen (generic fitness zones) */}
                <Block title="Heart Rate Zones (Karvonen)">
                    <Row>
                        {heartRateZones.map(zone => (
                            <View key={zone.percent} style={[styles.hrCell, { height: Math.round(26 * zoomLevel) }]}>
                                <Text style={[styles.hrText, { fontSize: scaleFont(styles.hrText.fontSize) }]}>{zone.percent}%</Text>
                            </View>
                        ))}
                    </Row>

                    <Row>
                        {heartRateZones.map(zone => (
                            <View key={zone.percent} style={[styles.hrCell, { height: Math.round(26 * zoomLevel) }]}>
                                <Text style={[styles.hrText, { fontSize: scaleFont(styles.hrText.fontSize) }]}>{zone.bpm}</Text>
                            </View>
                        ))}
                    </Row>
                </Block>

                {/* TRAINING ZONES — MAGMED Codex / CCC "Laktatkurve und Trainingsbereich" cascade */}
                <Block title={`Training Zones (${selectedModel})`}>
                    {!trainingZones ? (
                        <Row>
                            <Text style={[styles.note, { fontSize: scaleFont(styles.note.fontSize) }]}>
                                No training zones available yet for the "{selectedModel}" model.
                            </Text>
                        </Row>
                    ) : (
                        <>
                            <Row>
                                <Cell label="" value="Zone" />
                                <Cell label="" value="% IANS" />
                                <Cell label="" value={LanguageUtil.getName('laktat')} />
                                <Cell label="" value="HF" />
                                <Cell label="" value={isRun ? 'Pace' : 'Watt'} />
                            </Row>
                            {trainingZones.rows.map(zone => (
                                <Row key={zone.key}>
                                    <Cell label="" value={zone.label} />
                                    <Cell label="" value={zone.percent != null ? `${zone.percent}%` : '–'} />
                                    <Cell label="" value={zone.lactate != null ? `${zone.lactate} mmol` : '–'} />
                                    <Cell label="" value={`${fmt(zone.hf)} bpm`} />
                                    <Cell
                                        label=""
                                        value={
                                            isRun
                                                ? fmt(zone.pace, ' min/km')
                                                : (zone.load != null ? `${zone.load} W` : '–')
                                        }
                                    />
                                </Row>
                            ))}
                            <Row>
                                <Text style={[styles.note, { fontSize: scaleFont(styles.note.fontSize) }]}>
                                    {trainingZones.method === 'percent'
                                        ? 'Freiburger/Keul method: zone boundaries = % of IANS heart rate; Watt/Pace looked up on the measured stage curve (not a % of threshold load).'
                                        : 'Dickhuth/Stückweise-linear method: REG/IAS/GA1/GA2/IANS anchored to the measured IAS/IANS heart-rate points (GA1/GA2 split the band between them); E1/E2 still use % of IANS-HF. Watt/Pace looked up on the measured stage curve.'}
                                </Text>
                            </Row>
                        </>
                    )}
                </Block>
            </View>

        </ScrollView>
        </ZoomContext.Provider>
    );
}

/* COMPONENTS */

function Block({ title, children }) {
    const zoom = useContext(ZoomContext);
    return (
        <View style={styles.block}>
            <Text style={[styles.blockTitle, { fontSize: Math.round(styles.blockTitle.fontSize * zoom) }]}>{title}</Text>
            {children}
        </View>
    );
}

function Row({ children }) {
    return <View style={styles.row}>{children}</View>;
}

function Cell({ label, value }) {
    const zoom = useContext(ZoomContext);
    return (
        <View style={styles.cell}>
            <Text style={[styles.label, { fontSize: Math.round(styles.label.fontSize * zoom) }]}>{label}</Text>
            <Text style={[styles.value, { fontSize: Math.round(styles.value.fontSize * zoom) }]}>{value}</Text>
        </View>
    );
}

function RangeCell({ label, range, active }) {
    const zoom = useContext(ZoomContext);
    return (
        <View style={[styles.rangeCell, active && styles.active]}>
            <Text style={[styles.rangeLabel, { fontSize: Math.round(styles.rangeLabel.fontSize * zoom) }]}>{label}</Text>
            {range && <Text style={[styles.range, { fontSize: Math.round(styles.range.fontSize * zoom) }]}>{range}</Text>}
        </View>
    );
}

/* STYLES */

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        minHeight: 0,
    },

    scrollContent: {
        flexGrow: 1,
        paddingBottom: 60,
    },

    page: { padding: 10, backgroundColor: '#fff' },

    block: { borderWidth: 1, marginTop: 10 },

    blockTitle: {
        borderBottomWidth: 1,
        padding: 6,
        fontSize: 14,
        fontWeight: '600',
    },

    row: { flexDirection: 'row' },

    cell: {
        flex: 1,
        borderRightWidth: 1,
        padding: 6,
    },

    label: { fontSize: 11, color: '#555' },

    value: { fontSize: 14, fontWeight: '600' },

    note: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
        padding: 6,
    },

    rangeCell: {
        flex: 1,
        borderRightWidth: 1,
        padding: 6,
        alignItems: 'center',
    },

    rangeLabel: { fontSize: 12 },

    range: { fontSize: 11, color: '#555' },

    active: { backgroundColor: '#c6efce' },

    hrCell: {
        flex: 1,
        borderWidth: 1,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },

    hrText: { fontSize: 11 },

    yellow: { backgroundColor: '#ffe599' },

    green: { backgroundColor: '#b6d7a8' },
});
