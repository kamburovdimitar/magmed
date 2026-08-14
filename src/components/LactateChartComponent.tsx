// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-14 (Europe/Sofia) — Trainingsbereich UI pass (part 2 — chart drag):
//   1) calculateTrainingZones() now needs data/model/isRun/customPercents —
//      wired through from Page11.tsx (see props below) so the chart's
//      colored zone bands use the corrected HF-cascade method and honor the
//      same editable percent overrides as TrainingsbereichComponent's table.
//   2) Added draggable zone-boundary handles directly on the chart (per
//      "3.34 CCC": "Es soll möglich sein mit Cursor die Bereiche ... zu
//      verschieben"). Implementation note: recharts doesn't expose its
//      internal pixel<->data scale in a way we can hook into cleanly, so
//      this uses an explicit fixed chart margin + fixed YAxis widths (so the
//      plot rectangle's pixel bounds are deterministic) plus an absolutely
//      positioned HTML/RNW overlay of 4 thin drag handles (REG/GA1/GA2/E1
//      boundaries — E2 is open-ended, nothing to drag) that convert mouse
//      X back to a load value, look up the HF at that load, and re-express
//      it as a %-of-IANS-HF via the existing onZonePercentChange callback.
//      This is an approximation (recharts' actual rendered margins can
//      differ slightly from the nominal prop in edge cases) — expect to
//      true this up against real screenshots rather than pixel-perfect math.
//   3) Removed the verbose per-render console.log block that used to dump
//      zone boundaries on every paint — it was debug scaffolding, not
//      something a user should see in the browser console.
// ============================================

import React, { useEffect, useRef, useState } from 'react';

import {
    View,
    Text
} from 'react-native';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceDot,
    ReferenceLine,
    ReferenceArea
} from 'recharts';
import { ErgometryModelsUtil } from '../utils/ErgometryModelsUtil';

// 🔹 fixed chart geometry — keeping these explicit (instead of letting
// recharts auto-size axes from tick-label width) is what makes the drag
// overlay's pixel math below possible.
const CHART_MARGIN = { top: 10, right: 15, bottom: 20, left: 15 };
const Y_AXIS_WIDTH = 42;

const DRAGGABLE_ZONE_KEYS = ['REG', 'GA1', 'GA2', 'E1'];

export default function LactateChartComponent({

    data,
    result,

    chartStart = null,

    showTrainingZones,
    showThresholdLines,
    showThresholdLabels,
    showHeartRateCurve,

    // 🔹 2026-08-14 — Trainingsbereich pass: needed so the chart's colored
    // zone bands use the same correct HF-cascade method (and the same
    // customPercents overrides) as the Trainingsbereich table, instead of
    // the old (spec-violating) simple %-of-load multiplication.
    isRun = false,
    model = null,
    trainingZonePercents = null,
    onZonePercentChange = null

}: any) {

    const containerRef = useRef<any>(null);

    const [containerWidth, setContainerWidth] = useState(0);

    const [draggingKey, setDraggingKey] = useState<string | null>(null);

    const maxLoad = ErgometryModelsUtil.calculateChartMaxLoad(data);

    const maxLactate = ErgometryModelsUtil.calculateChartMaxLactate(data);

    // 🔹 chart rows
    const chartData: any[] = [];

    // 🔹 normalize data
    if (data) {

        for (let i = 0; i < data.length; i++) {

            const load = Number(data[i].load);
            const lactate = Number(data[i].lactate);
            const hf = Number(data[i].hf);

            if (
                isNaN(load) ||
                isNaN(lactate) ||
                lactate <= 0
            ) {
                continue;
            }

            chartData.push({
                load,
                lactate,
                hf
            });

        }

    }

    // 🔹 sort
    chartData.sort((a, b) => a.load - b.load);

    // 🔹 real chart end
    const realChartMaxLoad =
        chartData[
            chartData.length - 1
        ]?.load || 0;


    const zoneChartMaxLoad = realChartMaxLoad;

    const domainMin = chartData[0]?.load || 0;
    const domainMax = showTrainingZones ? zoneChartMaxLoad : realChartMaxLoad;

    // 🔹 hoisted out of the render tree (used by both the ReferenceArea
    // bands below AND the drag-handle overlay, so they always agree)
    const zones = showTrainingZones
        ? ErgometryModelsUtil.calculateTrainingZones(
            result,
            chartData,
            model ?? result?.model,
            isRun,
            trainingZonePercents
        )
        : null;

    // 🔹 plot rectangle in pixels, given the fixed margin/axis-width above —
    // one YAxis on the left (hf), one on the right (lactate)
    const plotLeft = CHART_MARGIN.left + Y_AXIS_WIDTH;
    const plotRight = containerWidth - CHART_MARGIN.right - Y_AXIS_WIDTH;
    const plotWidth = Math.max(0, plotRight - plotLeft);

    function loadToPixel(load: number) {
        if (domainMax <= domainMin) return plotLeft;
        const ratio = (load - domainMin) / (domainMax - domainMin);
        return plotLeft + ratio * plotWidth;
    }

    function pixelToLoad(px: number) {
        const clamped = Math.max(plotLeft, Math.min(plotRight, px));
        const ratio = plotWidth > 0 ? (clamped - plotLeft) / plotWidth : 0;
        return domainMin + ratio * (domainMax - domainMin);
    }

    // 🔹 drag tracking — plain mouse events (this app runs web-only via
    // react-native-web/Next.js, same assumption Page11.tsx already makes
    // elsewhere, e.g. window.print() for the report view)
    useEffect(() => {

        if (!draggingKey || !onZonePercentChange) {
            return;
        }

        function handleMove(e: any) {

            const rect = containerRef.current?.getBoundingClientRect?.();

            if (!rect) return;

            const load = pixelToLoad(e.clientX - rect.left);

            const point = ErgometryModelsUtil.interpolateByLoad(chartData, load);

            const iansHF = Number(result?.IANSPoint?.hf);

            if (!point || !iansHF) return;

            const percent = Math.round((point.hf / iansHF) * 100);

            onZonePercentChange(draggingKey, percent);

        }

        function handleUp() {
            setDraggingKey(null);
        }

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draggingKey, containerWidth, domainMin, domainMax]);

    return (

        <View
            style={{
                marginTop: 20,
                padding: 10,
                borderWidth: 1,
                backgroundColor: '#fff'
            }}
        >

            <Text
                style={{
                    fontWeight: 'bold',
                    marginBottom: 10,
                    textAlign: 'center'
                }}
            >
                Lactate curve ({(result?.model || 'DICKHUTH').toUpperCase()})
            </Text>

            <View
                ref={containerRef}
                onLayout={(e: any) => setContainerWidth(e?.nativeEvent?.layout?.width || 0)}
                style={{
                    width: '100%',
                    height: 320
                }}
            >

                <ResponsiveContainer>

                    <LineChart data={chartData} margin={CHART_MARGIN}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            type="number"
                            dataKey="load"

                            domain={[domainMin, domainMax]}

                            allowDataOverflow={true}

                            label={{
                                value: 'Load',
                                position: 'insideBottom',
                                offset: -5
                            }}
                        />

                        <YAxis
                            yAxisId="hf"
                            type="number"
                            width={Y_AXIS_WIDTH}
                            domain={[60, 220]}
                        />

                        <YAxis
                            yAxisId="lactate"
                            orientation="right"
                            type="number"
                            width={Y_AXIS_WIDTH}
                            domain={[0, maxLactate]}
                        />

                        <Tooltip />

                        {
                            showThresholdLines &&
                            result?.IAS && (

                                <ReferenceLine
                                    yAxisId="lactate"
                                    y={result.IAS}
                                    stroke="green"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                />

                            )
                        }

                        {
                            showThresholdLines &&
                            result?.IANS && (

                                <ReferenceLine
                                    yAxisId="lactate"
                                    y={result.IANS}
                                    stroke="red"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                />

                            )
                        }

                        {
                            showTrainingZones && zones && (() => {

                                const chartStart = domainMin;
                                const chartEnd = chartData[chartData.length - 1]?.load || 0;
                                const zonesStart = chartStart;

                                return (
                                    <>
                                        {zones.REG.to > zonesStart && <ReferenceArea yAxisId="lactate" x1={Math.max(zones.REG.from, zonesStart)} x2={Math.min(zones.REG.to, chartEnd)} y1={0} y2={maxLactate} fill={zones.REG.color} fillOpacity={0.15} />}

                                        {zones.GA1.to > zonesStart && <ReferenceArea yAxisId="lactate" x1={Math.max(zones.GA1.from, zonesStart)} x2={Math.min(zones.GA1.to, chartEnd)} y1={0} y2={maxLactate} fill={zones.GA1.color} fillOpacity={0.15} />}

                                        {zones.GA2.to > zonesStart && <ReferenceArea yAxisId="lactate" x1={Math.max(zones.GA2.from, zonesStart)} x2={Math.min(zones.GA2.to, chartEnd)} y1={0} y2={maxLactate} fill={zones.GA2.color} fillOpacity={0.15} />}

                                        {zones.E1.to > zonesStart && <ReferenceArea yAxisId="lactate" x1={Math.max(zones.E1.from, zonesStart)} x2={Math.min(zones.E1.to, chartEnd)} y1={0} y2={maxLactate} fill={zones.E1.color} fillOpacity={0.15} />}

                                        {zones.E2.from < chartEnd && <ReferenceArea yAxisId="lactate" x1={Math.max(zones.E2.from, zonesStart)} x2={chartEnd} y1={0} y2={maxLactate} fill={zones.E2.color} fillOpacity={0.35} />}
                                    </>
                                );

                            })()
                        }




                        <Line
                            yAxisId="lactate"
                            type="linear"
                            dataKey="lactate"
                            stroke="blue"
                            strokeWidth={2}
                            connectNulls={false}
                            dot={(props: any) => {

                                if (
                                    props.payload?.virtual
                                ) {
                                    return null;
                                }

                                return (
                                    <circle
                                        cx={props.cx}
                                        cy={props.cy}
                                        r={2}
                                        fill="white"
                                        stroke="blue"
                                    />
                                );

                            }}
                            isAnimationActive={false}
                        />

                        {
                            showHeartRateCurve && (

                                <Line
                                    yAxisId="hf"
                                    type="linear"
                                    dataKey="hf"
                                    stroke="#8B0000"
                                    strokeWidth={2}
                                    dot={false}
                                    connectNulls={true}
                                    isAnimationActive={false}
                                />

                            )
                        }

                    </LineChart>

                </ResponsiveContainer>

                {/* 🔹 draggable zone-boundary handles — absolutely positioned
                    over the chart, one per movable boundary (REG/GA1/GA2/E1;
                    E2 has no "to" to drag). Only rendered once we know the
                    container's actual pixel width (onLayout) and only while
                    zones are shown/computable. */}
                {
                    showTrainingZones && zones && containerWidth > 0 && onZonePercentChange &&
                    DRAGGABLE_ZONE_KEYS.map((key) => {

                        const boundaryLoad = zones[key]?.to;

                        if (boundaryLoad == null || !isFinite(boundaryLoad)) {
                            return null;
                        }

                        const px = loadToPixel(boundaryLoad);

                        return (
                            <View
                                key={key}
                                onMouseDown={(e: any) => {
                                    e?.preventDefault?.();
                                    setDraggingKey(key);
                                }}
                                style={{
                                    position: 'absolute',
                                    left: px - 5,
                                    top: CHART_MARGIN.top,
                                    width: 10,
                                    height: 320 - CHART_MARGIN.top - CHART_MARGIN.bottom,
                                    cursor: 'ew-resize',
                                    backgroundColor: draggingKey === key
                                        ? 'rgba(47,111,237,0.35)'
                                        : 'rgba(47,111,237,0.12)',
                                    borderLeftWidth: 1,
                                    borderRightWidth: 1,
                                    borderColor: 'rgba(47,111,237,0.5)'
                                }}
                            />
                        );

                    })
                }

            </View>

        </View>

    );
}
