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
                            domain={['dataMin', 'dataMax']}
                            label={{
                                value: 'Load',
                                position: 'insideBottom',
                                offset: -5
                            }}
                        />

                        {/* 🔹 Y */}
                        {/* 🔹 HF axis */}
                        <YAxis

                            yAxisId="hf"

                            type="number"

                            domain={[60, 220]}
                        />

                        {/* 🔹 Lactate axis */}
                        <YAxis

                            yAxisId="lactate"

                            orientation="right"

                            type="number"

                            domain={[0, maxLactate]}
                        />

                        {/* 🔹 hover */}
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

                                    yAxisId="lactate"
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
                        {
                            showTrainingZones && (() => {

                                const zones = ErgometryModelsUtil.calculateTrainingZones(result);

                                if (!zones) {
                                    return null;
                                }

                                // console.log('E1.to:', zones.E1.to);
                                // console.log('E2.from:', zones.E2.from);
                                // console.log('zones object:', zones);
                                // console.log('maxLoad:', maxLoad);

                                // console.log('last point', chartData[chartData.length - 1]);
                                // console.log('chartData', chartData);

                                console.log(typeof zones.E2.from);
                                console.log(zones.E2.from);

                                const chartMaxLoad = chartData[chartData.length - 1]?.load || 0;
                                return (

                                    <>


                                        <ReferenceArea yAxisId="lactate" x1={chartData[0]?.load || 0} x2={zones.REG.to} y1={0} y2={maxLactate} fill={zones.REG.color} fillOpacity={0.15} />

                                        <ReferenceArea yAxisId="lactate" x1={zones.GA1.from} x2={zones.GA1.to} y1={0} y2={maxLactate} fill={zones.GA1.color} fillOpacity={0.15} />

                                        <ReferenceArea yAxisId="lactate" x1={zones.GA2.from} x2={zones.GA2.to} y1={0} y2={maxLactate} fill={zones.GA2.color} fillOpacity={0.15} />

                                        <ReferenceArea yAxisId="lactate" x1={zones.E1.from} x2={zones.E1.to} y1={0} y2={maxLactate} fill={zones.E1.color} fillOpacity={0.15} />

                                        <ReferenceArea yAxisId="lactate" x1={zones.E2.from} x2={chartMaxLoad} y1={0} y2={maxLactate} fill="#ff0000" fillOpacity={0.4} />

                                    </>
                                );
                            })()
                        }

                        {/* 🔹 lactate curve */}
                        <Line

                            type="monotone"
                            yAxisId="lactate"


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

                                    yAxisId="hf"

                                    type="monotone"

                                    dataKey="hf"

                                    stroke="#8B0000"

                                    strokeWidth={2}

                                    dot={false}
                                />
                            )
                        }
                        {/* 🔹 LTP segment 1 */}
                        {
                            result?.line1Points && (

                                <Line

                                    data={result.line1Points}

                                    dataKey="predicted"

                                    yAxisId="lactate"

                                    type="linear"

                                    stroke="#00cc66"

                                    strokeWidth={3}

                                    strokeDasharray="10 5"

                                    dot={false}

                                    isAnimationActive={false}
                                />
                            )
                        }

                        {/* 🔹 LTP segment 2 */}
                        {
                            result?.line2Points && (

                                <Line

                                    data={result.line2Points}

                                    dataKey="predicted"

                                    yAxisId="lactate"

                                    type="linear"

                                    stroke="#ff6600"

                                    strokeWidth={3}

                                    strokeDasharray="10 5"

                                    dot={false}

                                    isAnimationActive={false}
                                />
                            )
                        }

                        {/* 🔹 LTP segment 3 */}
                        {
                            result?.line3Points && (

                                <Line

                                    data={result.line3Points}

                                    dataKey="predicted"

                                    yAxisId="lactate"

                                    type="linear"

                                    stroke="#990000"

                                    strokeWidth={3}

                                    strokeDasharray="10 5"

                                    dot={false}

                                    isAnimationActive={false}
                                />
                            )
                        }
                        {
                            result?.IASPoint && (

                                <ReferenceDot
                                    yAxisId="lactate"

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
                                    yAxisId="lactate"

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