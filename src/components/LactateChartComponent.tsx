import React from 'react';

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

export default function LactateChartComponent({

    data,
    result,

    chartStart = null,

    showTrainingZones,
    showThresholdLines,
    showThresholdLabels,
    showHeartRateCurve

}: any) {

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
                style={{
                    width: '100%',
                    height: 320
                }}
            >

                <ResponsiveContainer>

                    <LineChart data={chartData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            type="number"
                            dataKey="load"

                            domain={[
                                chartData[0]?.load || 0,
                                showTrainingZones
                                    ? zoneChartMaxLoad
                                    : realChartMaxLoad
                            ]}

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
                            domain={[60, 220]}
                        />

                        <YAxis
                            yAxisId="lactate"
                            orientation="right"
                            type="number"
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
                            showTrainingZones &&
                            (() => {

                                const zones =
                                    ErgometryModelsUtil
                                        .calculateTrainingZones(
                                            result
                                        );

                                if (!zones) {
                                    return null;
                                }


                                const chartStart = chartData[0]?.load || 0;


                                const chartEnd =
                                    chartData[
                                        chartData.length - 1
                                    ]?.load || 0;

                                const zonesStart = chartStart;

                                const visualMinWidth =
                                    (chartEnd - chartStart) * 0.03;

                                const e2Start =
                                    Math.max(
                                        zonesStart,
                                        zones.E2.from
                                    );

                                const visualE2Start =
                                    chartEnd - e2Start < visualMinWidth
                                        ? chartEnd - visualMinWidth
                                        : e2Start;

                                console.log('\n========== TRAINING ZONES ==========');

                                console.log('chartStart=', chartStart);

                                console.log('zonesStart=', zonesStart);

                                console.log('chartEnd=', chartEnd);

                                console.log('IANS=', result?.IANSPoint?.load);

                                console.log('REG', '#fff176', '0→75%', 'from=', zones.REG.from, 'to=', zones.REG.to, 'width=', (zones.REG.to - zones.REG.from).toFixed(1));

                                console.log('GA1', '#81c784', '75→85%', 'from=', zones.GA1.from, 'to=', zones.GA1.to, 'width=', (zones.GA1.to - zones.GA1.from).toFixed(1));

                                console.log('GA2', '#64b5f6', '85→95%', 'from=', zones.GA2.from, 'to=', zones.GA2.to, 'width=', (zones.GA2.to - zones.GA2.from).toFixed(1));

                                console.log('E1', '#ef9a9a', '95→105%', 'from=', zones.E1.from, 'to=', zones.E1.to, 'width=', (zones.E1.to - zones.E1.from).toFixed(1));

                                console.log('E2', '#e57373', '105→INF', 'from=', zones.E2.from, 'to=', zones.E2.to);

                                console.log(
                                    'VISIBLE',

                                    'REG=', Math.max(0, Math.min(zones.REG.to, chartEnd) - Math.max(zones.REG.from, zonesStart)),

                                    'GA1=', Math.max(0, Math.min(zones.GA1.to, chartEnd) - Math.max(zones.GA1.from, zonesStart)),

                                    'GA2=', Math.max(0, Math.min(zones.GA2.to, chartEnd) - Math.max(zones.GA2.from, zonesStart)),

                                    'E1=', Math.max(0, Math.min(zones.E1.to, chartEnd) - Math.max(zones.E1.from, zonesStart)),

                                    'E2=', Math.max(0, chartEnd - Math.max(zones.E2.from, zonesStart))
                                );

                                console.log('visualE2Start=', visualE2Start);

                                console.log('==============================');
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

            </View>

        </View>

    );
}