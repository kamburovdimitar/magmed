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
                                        .calculateTrainingZones(result);

                                if (!zones) {
                                    return null;
                                }

                                const chartStart =
                                    chartData[0]?.load || 0;

                                const chartEnd =
                                    chartData[
                                        chartData.length - 1
                                    ]?.load || 0;

                                const visualMinWidth =
                                    (chartEnd - chartStart) * 0.03;

                                const e2Width =
                                    zones.E2.to - zones.E2.from;

                                const visualE2Start =
                                    e2Width < visualMinWidth
                                        ? chartEnd - visualMinWidth
                                        : zones.E2.from;

                                return (
                                    <>

                                        <ReferenceArea
                                            yAxisId="lactate"
                                            x1={chartStart}
                                            x2={zones.REG.to}
                                            y1={0}
                                            y2={maxLactate}
                                            fill={zones.REG.color}
                                            fillOpacity={0.15}
                                        />

                                        <ReferenceArea
                                            yAxisId="lactate"
                                            x1={zones.GA1.from}
                                            x2={zones.GA1.to}
                                            y1={0}
                                            y2={maxLactate}
                                            fill={zones.GA1.color}
                                            fillOpacity={0.15}
                                        />

                                        <ReferenceArea
                                            yAxisId="lactate"
                                            x1={zones.GA2.from}
                                            x2={zones.GA2.to}
                                            y1={0}
                                            y2={maxLactate}
                                            fill={zones.GA2.color}
                                            fillOpacity={0.15}
                                        />

                                        <ReferenceArea
                                            yAxisId="lactate"
                                            x1={zones.E1.from}
                                            x2={visualE2Start}
                                            y1={0}
                                            y2={maxLactate}
                                            fill={zones.E1.color}
                                            fillOpacity={0.15}
                                        />

                                        <ReferenceArea
                                            yAxisId="lactate"
                                            x1={visualE2Start}
                                            x2={chartEnd}
                                            y1={0}
                                            y2={maxLactate}
                                            fill={zones.E2.color}
                                            fillOpacity={0.35}
                                        />

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