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
    ReferenceLine
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

    const maxLoad =
        ErgometryModelsUtil.calculateChartMaxLoad(data);

    const maxLactate = ErgometryModelsUtil.calculateChartMaxLactate(data);

    // 🔹 chart rows
    const chartData: any[] = [];

    // 🔹 normalize data
    if (data) {

        for (let i = 0; i < data.length; i++) {

            const load =
                Number(data[i].load);

            const lactate =
                Number(data[i].lactate);

            const hf =
                Number(data[i].hf);

            // 🔹 skip invalid rows
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

    // 🔹 sort by load
    chartData.sort(
        (a, b) => a.load - b.load
    );

    return (

        <View
            style={{
                marginTop: 20,
                padding: 10,
                borderWidth: 1,
                backgroundColor: '#fff'
            }}
        >

            {/* 🔹 title */}
            <Text
                style={{
                    fontWeight: 'bold',
                    marginBottom: 10,
                    textAlign: 'center'
                }}
            >
                Lactate Curve
            </Text>

            <View
                style={{
                    width: '100%',
                    height: 320
                }}
            >

                <ResponsiveContainer>

                    <LineChart
                        data={chartData}

                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20
                        }}
                    >

                        {/* 🔹 background grid */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        {/* 🔹 X */}
                        <XAxis
                            type="number"
                            dataKey="load"
                            domain={[0, maxLoad]}
                            label={{
                                value: 'Load',
                                position: 'insideBottom',
                                offset: -5
                            }}
                        />

                        {/* 🔹 Y */}
                        <YAxis
                            type="number"
                            domain={[0, maxLactate]}
                        />

                        {/* 🔹 hover */}
                        <Tooltip />

                        {
                            showThresholdLines &&
                            result?.IAS && (

                                <ReferenceLine

                                    y={result.IAS}

                                    stroke="green"

                                    strokeWidth={2}

                                    strokeDasharray="5 5"

                                    label={
                                        showThresholdLabels
                                            ? {
                                                value: 'IAS',
                                                position: 'left'
                                            }
                                            : undefined
                                    }
                                />
                            )
                        }

                        {/* 🔹 IANS horizontal threshold */}
                        {
                            showThresholdLines &&
                            result?.IANS && (

                                <ReferenceLine

                                    y={result.IANS}

                                    stroke="red"

                                    strokeWidth={2}

                                    strokeDasharray="5 5"

                                    label={
                                        showThresholdLabels
                                            ? {
                                                value: 'IANS',
                                                position: 'right'
                                            }
                                            : undefined
                                    }
                                />
                            )
                        }

                        {/* 🔹 lactate curve */}
                        <Line

                            type="monotone"

                            dataKey="lactate"

                            stroke="#1976D2"

                            strokeWidth={3}

                            dot={{
                                r: 4
                            }}
                        />

                        {
                            showHeartRateCurve && (

                                <Line

                                    type="monotone"

                                    dataKey="hf"

                                    stroke="#8B0000"

                                    strokeWidth={2}

                                    dot={false}
                                />
                            )
                        }
                        {
                            result?.IASPoint && (

                                <ReferenceDot

                                    x={
                                        result
                                            .IASPoint
                                            .load
                                    }

                                    y={
                                        result
                                            .IASPoint
                                            .lactate
                                    }

                                    r={8}

                                    fill="green"

                                    stroke="black"

                                    label={
                                        showThresholdLabels
                                            ? {
                                                value: 'IAS',
                                                position: 'top'
                                            }
                                            : undefined
                                    }
                                />
                            )
                        }

                        {/* 🔹 IANS point */}
                        {
                            result?.IANSPoint && (

                                <ReferenceDot

                                    x={
                                        result
                                            .IANSPoint
                                            .load
                                    }

                                    y={
                                        result
                                            .IANSPoint
                                            .lactate
                                    }

                                    r={8}

                                    fill="red"

                                    stroke="black"

                                    label={
                                        showThresholdLabels
                                            ? {
                                                value: 'IANS',
                                                position: 'top'
                                            }
                                            : undefined
                                    }
                                />
                            )
                        }

                    </LineChart>

                </ResponsiveContainer>

            </View>

        </View>
    );
}