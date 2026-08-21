// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-17 (Europe/Sofia) — Стъпка 2 от плана за "3.36 CCC Laktatkurve
// überlagern": нов, самостоятелен компонент (не пипа LactateChartComponent
// или Page11-ната стара логика). DK поиска това да НЕ е отделна Page, а
// под-изглед в Page11 самата — виж handleShowUeberlagern* state-а там.
//
// V1 обхват (следващи стъпки ще добавят останалото от 3.36 PDF-а):
//   ✅ чек-лист archive записи (най-нов пръв) за избор кои да се наслагват
//   ✅ absolute / normierte (%IANS) превключвател — чрез OverlayUtil
//   ✅ цвят по хронологична позиция, активна (hover-읽ната) крива по-дебела
//   ✅ таблица IAS/IANS (Watt|km-h, S/min, mmol/l) за избраните тестове
//   ⏳ hover-fade на другите криви, click-от-таблица highlight, tooltip на
//      самите IAS/IANS точки, Herzfrequenzkurven/Schwellen toggle-и,
//      outlier "Glühwürmchen" маркери — следващи стъпки, нарочно оставени
//      извън тази версия за да не се омесва прекалено много наведнъж.
// ============================================

import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    ReferenceLine, ReferenceArea, ReferenceDot
} from 'recharts';
import { OverlayUtil } from '../utils/OverlayUtil';
import { ErgometryModelsUtil } from '../utils/ErgometryModelsUtil';
import LanguageUtil from '../utils/LanguageUtil';

// 🔹 2026-08-18 — Herzfrequenzkurven/Trainingszonen/Test Datum/
// Schwellenwerte/Schwellenlinien toggle-ите винаги важат за "активната"
// крива само (hover-натата, или ако няма — най-новата избрана) — точно
// както PDF-ът описва зоните/праговете само около една, "фокусна" крива,
// не за всичките наведнъж (би било визуален хаос с повече от 2-3 теста).
const IAS_DOT_COLOR = '#2c3e91';
const IANS_DOT_COLOR = '#c0392b';

// 🔹 2026-08-18 — DK изрично поиска навигационните бутони (ZURÜCK/Dialog/
// Auswertung/Daten Erfassung, стъпка 4) да могат ЛЕСНО да се дизейбълнат —
// един-единствен флаг тук, вместо да се коментира/трие целия JSX блок.
// false → редът изобщо не се рендира (не само скрит, а и без ефект).
const NAV_BUTTONS_ENABLED = true;

export default function LaktatkurveUeberlagernComponent({ reports, isRun = false, onLoadReport, onGoToView }) {

    const allReports = reports ?? [];

    // 🔹 показваме списъка най-нов-пръв (по-удобно за избор — "3.36" PDF-ът
    // самия показва архива така), но OverlayUtil.buildOverlaySeries пак
    // сортира хронологично възходящо вътрешно за самото чертане/оцветяване.
    const displayReports = useMemo(
        () => OverlayUtil.sortReportsChronologically(allReports, 'desc'),
        [allReports]
    );

    const [selectedIds, setSelectedIds] = useState(() => {
        // по подразбиране: последните (най-новите) до 2 теста, ако има поне 2 —
        // веднага показва нещо смислено при отваряне, без да е шумно с всичко.
        return new Set(displayReports.slice(0, 2).map((r) => r.id));
    });

    const [mode, setMode] = useState('absolute'); // 'absolute' | 'normiert'
    const [hoveredId, setHoveredId] = useState(null);

    // 🔹 5-те toggle бутона от дясната колона на "3.36 CCC" PDF-а. Всичките
    // включени по подразбиране — точно както изглежда мокъпа на PDF-а
    // (страница 2), с всичко видимо едновременно.
    const [showHeartRateCurve, setShowHeartRateCurve] = useState(true);
    const [showTrainingZones, setShowTrainingZones] = useState(true);
    const [showTestDate, setShowTestDate] = useState(true);
    const [showThresholdValues, setShowThresholdValues] = useState(true);
    const [showThresholdLines, setShowThresholdLines] = useState(true);

    function toggleSelected(id) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }

    const selectedReports = allReports.filter((r) => selectedIds.has(r.id));

    // 🔹 "3.36 CCC" стъпка 4 — Dialog/Auswertung/Daten Erfassung действат
    // върху КОНКРЕТЕН избран тест (не hover, а реално чекнат — навигацията
    // трябва да е предвидима, не да зависи от къде в момента е мишката).
    // Взимаме най-новия от чекнатите — ако е чекнат само 1, той е и целта.
    const navTargetReport = useMemo(() => {
        if (!selectedReports.length) return null;
        return OverlayUtil.sortReportsChronologically(selectedReports, 'desc')[0];
    }, [selectedReports]);

    function goToDataEntry() {
        if (!navTargetReport) return;
        onLoadReport?.(navTargetReport);
        onGoToView?.('current');
    }

    function goToAuswertungOrDialog() {
        if (!navTargetReport) return;
        onLoadReport?.(navTargetReport);
        // 🔹 в нашата структура Auswertung И Dialog си живеят заедно в
        // "Overlay" таба (виж LaktatkurveAuswertungComponent) — PDF-ът ги
        // показва като 2 отделни бутона/прозорци, но не преоткриваме
        // отделен Dialog-only изглед само заради тази разлика.
        onGoToView?.('ueberlagern');
    }

    function goBackToCurve() {
        // 🔹 само навигация — за разлика от горните, НЕ зарежда друг тест,
        // просто връща на "Aktuell" с каквото вече е активно.
        onGoToView?.('current');
    }

    const series = useMemo(
        () => OverlayUtil.buildOverlaySeries(selectedReports, { mode, activeReportId: hoveredId }),
        [selectedReports, mode, hoveredId]
    );

    const unit = isRun ? 'km/h' : 'Watt';
    const xLabel = mode === 'normiert' ? '%IANS' : unit;
    const xField = mode === 'normiert' ? 'percentIANS' : 'load';

    // 🔹 "активната" крива: hover-натата, иначе последната (най-новата)
    // избрана — тя носи зоните/праговите линии/стойности, за да не се
    // претрупва графиката с по 5 комплекта зони при няколко наслагани теста.
    const activeSeries = useMemo(() => {
        if (!series.length) return null;
        if (hoveredId) {
            const hovered = series.find((s) => s.id === hoveredId);
            if (hovered) return hovered;
        }
        return series[series.length - 1];
    }, [series, hoveredId]);

    // 🔹 товар (Watt/km-h) → x стойност в текущия display режим (absolute =
    // самия товар, normiert = % от IANS-а на АКТИВНАТА крива — не всяка
    // крива поотделно, защото зоните важат само за нея).
    function toXValue(loadValue) {
        if (loadValue == null || isNaN(loadValue)) return null;
        if (mode !== 'normiert') return loadValue;
        const iansLoad = activeSeries?.IANSPoint?.load;
        if (!iansLoad) return null;
        return Number(((loadValue / iansLoad) * 100).toFixed(1));
    }

    const maxLactate = useMemo(() => {
        let max = 0;
        series.forEach((s) => {
            s.rows.forEach((row) => {
                const l = Number(row.lactate);
                if (!isNaN(l) && l > max) max = l;
            });
        });
        return max > 0 ? Math.ceil(max) + 1 : 15;
    }, [series]);

    // 🔹 Trainingszonen — само за активната крива (виж коментара на
    // IAS_DOT_COLOR по-горе), пресметнати през вече тествания
    // calculateTrainingZones (същата "не проста % от Watt" каскада като на
    // "Aktuell"/"Training Zones" табовете). customPercents нарочно null тук
    // (стандартните проценти) — per-report override е извън обхвата на V1.
    const activeZones = useMemo(() => {
        if (!showTrainingZones || !activeSeries) return null;
        const resultLike = {
            IASPoint: activeSeries.IASPoint,
            IANSPoint: activeSeries.IANSPoint
        };
        return ErgometryModelsUtil.calculateTrainingZones(
            resultLike,
            activeSeries.rows,
            activeSeries.model,
            isRun,
            null
        );
    }, [showTrainingZones, activeSeries, isRun]);

    const activeChartEndX = activeSeries?.rows?.length
        ? toXValue(activeSeries.rows[activeSeries.rows.length - 1].load)
        : null;

    function formatDate(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        return d.toLocaleDateString('de-DE');
    }

    return (
        <View style={styles.container}>

            {/* 🔹 2026-08-18 — навигационните бутони (страница 5 от "3.36
                CCC" PDF-а). DK изрично поиска да са НА СВОЕ НИВО, над
                toggle-ите/mode бутоните — визуално отделени в собствен ред
                отгоре. Dialog/Auswertung действат само върху НАЙ-НОВИЯ
                чекнат тест (navTargetReport) — затова са disabled, докато
                няма поне 1 чекнат. ZURÜCK не зависи от избора. Целият ред
                се вдига/сваля с NAV_BUTTONS_ENABLED константата отгоре. */}
            {NAV_BUTTONS_ENABLED && (
                <View style={styles.navRow}>
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={goBackToCurve}
                    >
                        <Text style={styles.navButtonText}>
                            {LanguageUtil.getName('ueberlagern_nav_zurueck_text')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, !navTargetReport && styles.navButtonDisabled]}
                        onPress={goToAuswertungOrDialog}
                        disabled={!navTargetReport}
                    >
                        <Text style={styles.navButtonText}>
                            {LanguageUtil.getName('ueberlagern_nav_dialog_text')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, !navTargetReport && styles.navButtonDisabled]}
                        onPress={goToAuswertungOrDialog}
                        disabled={!navTargetReport}
                    >
                        <Text style={styles.navButtonText}>
                            {LanguageUtil.getName('auswertung_text')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, !navTargetReport && styles.navButtonDisabled]}
                        onPress={goToDataEntry}
                        disabled={!navTargetReport}
                    >
                        <Text style={styles.navButtonText}>
                            {LanguageUtil.getName('ueberlagern_nav_datenerfassung_text')}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 🔹 absolute / normierte Darstellung */}
            <View style={styles.modeRow}>
                <TouchableOpacity
                    style={[styles.modeButton, mode === 'absolute' && styles.modeButtonActive]}
                    onPress={() => setMode('absolute')}
                >
                    <Text style={[styles.modeButtonText, mode === 'absolute' && styles.modeButtonTextActive]}>
                        {LanguageUtil.getName('ueberlagern_absolute_text')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeButton, mode === 'normiert' && styles.modeButtonActive]}
                    onPress={() => setMode('normiert')}
                >
                    <Text style={[styles.modeButtonText, mode === 'normiert' && styles.modeButtonTextActive]}>
                        {LanguageUtil.getName('ueberlagern_normiert_text')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 🔹 2026-08-18 — 5-те toggle бутона от дясната колона на PDF-а
                (Herzfrequenzkurven/Trainingszonen/TestDatum/Schwellenwerte/
                Schwellenlinien ein/aus). Всички важат за "активната"
                (hover-натата, иначе последната избрана) крива. */}
            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[styles.toggleChip, showHeartRateCurve && styles.toggleChipActive]}
                    onPress={() => setShowHeartRateCurve((v) => !v)}
                >
                    <Text style={[styles.toggleChipText, showHeartRateCurve && styles.toggleChipTextActive]}>
                        {LanguageUtil.getName('ueberlagern_toggle_hf_text')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleChip, showTrainingZones && styles.toggleChipActive]}
                    onPress={() => setShowTrainingZones((v) => !v)}
                >
                    <Text style={[styles.toggleChipText, showTrainingZones && styles.toggleChipTextActive]}>
                        {LanguageUtil.getName('ueberlagern_toggle_zonen_text')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleChip, showTestDate && styles.toggleChipActive]}
                    onPress={() => setShowTestDate((v) => !v)}
                >
                    <Text style={[styles.toggleChipText, showTestDate && styles.toggleChipTextActive]}>
                        {LanguageUtil.getName('ueberlagern_toggle_datum_text')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleChip, showThresholdValues && styles.toggleChipActive]}
                    onPress={() => setShowThresholdValues((v) => !v)}
                >
                    <Text style={[styles.toggleChipText, showThresholdValues && styles.toggleChipTextActive]}>
                        {LanguageUtil.getName('ueberlagern_toggle_schwellenwerte_text')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleChip, showThresholdLines && styles.toggleChipActive]}
                    onPress={() => setShowThresholdLines((v) => !v)}
                >
                    <Text style={[styles.toggleChipText, showThresholdLines && styles.toggleChipTextActive]}>
                        {LanguageUtil.getName('ueberlagern_toggle_schwellenlinien_text')}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.body}>

                {/* 🔹 ляво: чек-лист + таблица IAS/IANS */}
                <View style={styles.leftPanel}>

                    <Text style={styles.sectionLabel}>{LanguageUtil.getName('ueberlagern_tests_text')}</Text>

                    <ScrollView style={styles.reportList}>
                        {displayReports.length === 0 && (
                            <Text style={styles.emptyText}>{LanguageUtil.getName('ueberlagern_keine_tests_text')}</Text>
                        )}
                        {displayReports.map((report, indexNewestFirst) => {
                            // цветът е закачен за хронологичната позиция (стар→нов),
                            // не за реда в този newest-first списък — затова го взимаме
                            // от вече построените `series`, ако записът участва в тях,
                            // иначе показваме сив placeholder swatch.
                            const seriesEntry = series.find((s) => s.id === report.id);
                            const color = seriesEntry?.color ?? '#c9c9c9';
                            const checked = selectedIds.has(report.id);

                            return (
                                <TouchableOpacity
                                    key={report.id}
                                    style={[styles.reportRow, checked && styles.reportRowChecked]}
                                    onPress={() => toggleSelected(report.id)}
                                    onMouseEnter={() => setHoveredId(report.id)}
                                    onMouseLeave={() => setHoveredId((prev) => (prev === report.id ? null : prev))}
                                >
                                    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                                        {checked && <Text style={styles.checkboxMark}>✓</Text>}
                                    </View>
                                    <View style={[styles.colorSwatch, { backgroundColor: color }]} />
                                    <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {selectedReports.length > 0 && (
                        <View style={styles.iasIansTable}>
                            {/* 🔹 2026-08-18 — DK качи "3.36 CCC Laktatkurve
                                überlagern": IAS/IANS таблицата в PDF-а има
                                ПО 3 колони за всяка точка (unit/S-min/mmol·l),
                                не само товар — разширено от предишната V1
                                (само 2 колони) до пълните 6, точно както в
                                спецификацията. */}
                            <View style={styles.tableHeaderGroupRow}>
                                <Text style={[styles.tableHeaderCell, styles.tableDateCell]} />
                                <Text style={[styles.tableHeaderCell, styles.tableGroupCell]}>IAS</Text>
                                <Text style={[styles.tableHeaderCell, styles.tableGroupCell]}>IANS</Text>
                            </View>
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.tableHeaderCell, styles.tableDateCell]}>{LanguageUtil.getName('ueberlagern_test_datum_text')}</Text>
                                <Text style={styles.tableHeaderCell}>{unit}</Text>
                                <Text style={styles.tableHeaderCell}>S/min</Text>
                                <Text style={styles.tableHeaderCell}>mmol/l</Text>
                                <Text style={styles.tableHeaderCell}>{unit}</Text>
                                <Text style={styles.tableHeaderCell}>S/min</Text>
                                <Text style={styles.tableHeaderCell}>mmol/l</Text>
                            </View>
                            {OverlayUtil.sortReportsChronologically(selectedReports, 'asc').map((report) => (
                                <View key={report.id} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.tableDateCell]}>{formatDate(report.createdAt)}</Text>
                                    <Text style={styles.tableCell}>{report.result?.IASPoint?.load ?? '—'}</Text>
                                    <Text style={styles.tableCell}>{report.result?.IASPoint?.hf ?? '—'}</Text>
                                    <Text style={styles.tableCell}>{report.result?.IASPoint?.lactate ?? '—'}</Text>
                                    <Text style={styles.tableCell}>{report.result?.IANSPoint?.load ?? '—'}</Text>
                                    <Text style={styles.tableCell}>{report.result?.IANSPoint?.hf ?? '—'}</Text>
                                    <Text style={styles.tableCell}>{report.result?.IANSPoint?.lactate ?? '—'}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                </View>

                {/* 🔹 дясно: самата наслагана графика */}
                <View style={styles.chartPanel}>
                    {series.length === 0 ? (
                        <Text style={styles.emptyText}>{LanguageUtil.getName('ueberlagern_izberi_text')}</Text>
                    ) : (
                        <ResponsiveContainer width="100%" height={380}>
                            <LineChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey={xField}
                                    type="number"
                                    allowDuplicatedCategory={false}
                                    label={{ value: xLabel, position: 'insideBottomRight', offset: -5 }}
                                />
                                <YAxis
                                    yAxisId="lactate"
                                    dataKey="lactate"
                                    domain={[0, maxLactate]}
                                    label={{ value: 'Laktat mmol/l', angle: -90, position: 'insideLeft' }}
                                />
                                {showHeartRateCurve && (
                                    <YAxis
                                        yAxisId="hf"
                                        orientation="right"
                                        type="number"
                                        domain={[60, 220]}
                                        label={{ value: 'HF S/min', angle: 90, position: 'insideRight' }}
                                    />
                                )}
                                <Tooltip />
                                <Legend />

                                {/* 🔹 Trainingszonen — само около активната крива */}
                                {showTrainingZones && activeZones && activeChartEndX != null && ['REG', 'GA1', 'GA2', 'E1', 'E2'].map((key) => {
                                    const zone = activeZones[key];
                                    if (!zone) return null;
                                    const x1 = toXValue(zone.from);
                                    const x2raw = zone.to === Number.MAX_VALUE ? activeSeries.rows[activeSeries.rows.length - 1].load : zone.to;
                                    const x2 = toXValue(x2raw);
                                    if (x1 == null || x2 == null || x2 <= x1) return null;
                                    return (
                                        <ReferenceArea
                                            key={key}
                                            yAxisId="lactate"
                                            x1={x1}
                                            x2={Math.min(x2, activeChartEndX)}
                                            y1={0}
                                            y2={maxLactate}
                                            fill={zone.color}
                                            fillOpacity={key === 'E2' ? 0.3 : 0.15}
                                        />
                                    );
                                })}

                                {/* 🔹 Schwellenlinien — вертикални IAS/IANS линии за активната крива */}
                                {showThresholdLines && activeSeries?.IASPoint && (
                                    <ReferenceLine
                                        yAxisId="lactate"
                                        x={toXValue(activeSeries.IASPoint.load)}
                                        stroke={IAS_DOT_COLOR}
                                        strokeWidth={1.5}
                                        label={{ value: 'IAS', position: 'top', fill: IAS_DOT_COLOR, fontSize: 11, fontWeight: 700 }}
                                    />
                                )}
                                {showThresholdLines && activeSeries?.IANSPoint && (
                                    <ReferenceLine
                                        yAxisId="lactate"
                                        x={toXValue(activeSeries.IANSPoint.load)}
                                        stroke={IANS_DOT_COLOR}
                                        strokeWidth={1.5}
                                        label={{ value: 'IANS', position: 'top', fill: IANS_DOT_COLOR, fontSize: 11, fontWeight: 700 }}
                                    />
                                )}

                                {/* 🔹 Schwellenwerte — HF/Lakt/Watt стойности на IAS/IANS точките */}
                                {showThresholdValues && activeSeries?.IASPoint && (
                                    <ReferenceDot
                                        yAxisId="lactate"
                                        x={toXValue(activeSeries.IASPoint.load)}
                                        y={activeSeries.IASPoint.lactate}
                                        r={4}
                                        fill={IAS_DOT_COLOR}
                                        stroke="#fff"
                                        label={{
                                            value: `IAS  HF-${activeSeries.IASPoint.hf}; Lakt-${activeSeries.IASPoint.lactate}; ${unit}-${activeSeries.IASPoint.load}`,
                                            position: 'bottom',
                                            fill: IAS_DOT_COLOR,
                                            fontSize: 9.5
                                        }}
                                    />
                                )}
                                {showThresholdValues && activeSeries?.IANSPoint && (
                                    <ReferenceDot
                                        yAxisId="lactate"
                                        x={toXValue(activeSeries.IANSPoint.load)}
                                        y={activeSeries.IANSPoint.lactate}
                                        r={4}
                                        fill={IANS_DOT_COLOR}
                                        stroke="#fff"
                                        label={{
                                            value: `IANS  HF-${activeSeries.IANSPoint.hf}; Lakt-${activeSeries.IANSPoint.lactate}; ${unit}-${activeSeries.IANSPoint.load}`,
                                            position: 'top',
                                            fill: IANS_DOT_COLOR,
                                            fontSize: 9.5
                                        }}
                                    />
                                )}

                                {series.map((s) => (
                                    <Line
                                        key={s.id}
                                        data={s.rows}
                                        dataKey="lactate"
                                        yAxisId="lactate"
                                        xAxisId={0}
                                        name={formatDate(s.createdAt)}
                                        stroke={s.color}
                                        strokeWidth={s.isActive ? 3.5 : 1.5}
                                        strokeOpacity={hoveredId && !s.isActive ? 0.3 : 1}
                                        dot={{ r: s.isActive ? 4 : 2 }}
                                        isAnimationActive={false}
                                        connectNulls
                                    />
                                ))}

                                {/* 🔹 Herzfrequenzkurven — прекъсната линия, за да се различава от Laktat */}
                                {showHeartRateCurve && series.map((s) => (
                                    <Line
                                        key={`hf-${s.id}`}
                                        data={s.rows}
                                        dataKey="hf"
                                        yAxisId="hf"
                                        xAxisId={0}
                                        name={`HF ${formatDate(s.createdAt)}`}
                                        stroke={s.color}
                                        strokeWidth={s.isActive ? 2.5 : 1}
                                        strokeOpacity={hoveredId && !s.isActive ? 0.3 : 0.8}
                                        strokeDasharray="4 3"
                                        dot={false}
                                        isAnimationActive={false}
                                        connectNulls
                                        legendType="none"
                                    />
                                ))}

                                {/* 🔹 Test Datum — етикет с датата до последната точка на всяка крива */}
                                {showTestDate && series.map((s) => {
                                    const lastRow = s.rows[s.rows.length - 1];
                                    if (!lastRow) return null;
                                    const x = lastRow[xField];
                                    if (x == null) return null;
                                    return (
                                        <ReferenceDot
                                            key={`date-${s.id}`}
                                            yAxisId="lactate"
                                            x={x}
                                            y={lastRow.lactate}
                                            r={0}
                                            label={{
                                                value: formatDate(s.createdAt),
                                                position: 'top',
                                                fill: s.color,
                                                fontSize: 10,
                                                fontWeight: s.isActive ? 700 : 400
                                            }}
                                        />
                                    );
                                })}
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        borderColor: '#dde3ea',
        borderRadius: 8,
        padding: 12,
        marginTop: 10
    },

    navRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 14,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#dde3ea'
    },

    navButton: {
        borderWidth: 1,
        borderColor: '#2c3e91',
        borderRadius: 6,
        paddingVertical: 9,
        paddingHorizontal: 16,
        backgroundColor: '#e9edf8'
    },

    navButtonDisabled: {
        opacity: 0.4
    },

    navButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2c3e91'
    },

    modeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10
    },

    modeButton: {
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 14,
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: '#fff'
    },

    modeButtonActive: {
        backgroundColor: '#2f6fed',
        borderColor: '#2f6fed'
    },

    modeButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333'
    },

    modeButtonTextActive: {
        color: '#fff'
    },

    toggleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 14
    },

    toggleChip: {
        borderWidth: 1,
        borderColor: '#c9d6c0',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 18,
        backgroundColor: '#f4f7f0'
    },

    toggleChipActive: {
        backgroundColor: '#4a7c3c',
        borderColor: '#4a7c3c'
    },

    toggleChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333'
    },

    toggleChipTextActive: {
        color: '#fff'
    },

    body: {
        flexDirection: 'row',
        gap: 14
    },

    leftPanel: {
        width: 260
    },

    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b7789',
        marginBottom: 6,
        textTransform: 'uppercase'
    },

    reportList: {
        maxHeight: 160,
        borderWidth: 1,
        borderColor: '#dde3ea',
        borderRadius: 6
    },

    reportRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eef2f7'
    },

    reportRowChecked: {
        backgroundColor: '#eef4ff'
    },

    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },

    checkboxChecked: {
        backgroundColor: '#2f6fed',
        borderColor: '#2f6fed'
    },

    checkboxMark: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700'
    },

    colorSwatch: {
        width: 10,
        height: 10,
        borderRadius: 2
    },

    reportDate: {
        fontSize: 12.5,
        color: '#333'
    },

    emptyText: {
        fontSize: 12.5,
        color: '#6b7789',
        fontStyle: 'italic',
        padding: 10
    },

    iasIansTable: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#dde3ea',
        borderRadius: 6
    },

    tableHeaderGroupRow: {
        flexDirection: 'row',
        backgroundColor: '#dde7f5',
        paddingTop: 4
    },

    tableGroupCell: {
        flex: 3,
        fontSize: 10.5,
        fontWeight: '700',
        color: '#33455e',
        textAlign: 'center'
    },

    tableDateCell: {
        flex: 2
    },

    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#eef2f7',
        paddingVertical: 4
    },

    tableHeaderCell: {
        flex: 1,
        fontSize: 10.5,
        fontWeight: '700',
        color: '#6b7789',
        textAlign: 'center'
    },

    tableRow: {
        flexDirection: 'row',
        paddingVertical: 4,
        borderTopWidth: 1,
        borderTopColor: '#eef2f7'
    },

    tableCell: {
        flex: 1,
        fontSize: 11.5,
        textAlign: 'center',
        color: '#333'
    },

    chartPanel: {
        flex: 1,
        minHeight: 380
    }

});
