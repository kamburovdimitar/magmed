import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ErgometryModelsUtil } from '../utils/ErgometryModelsUtil';

export default function TrainingZonesOverlayComponent({
    result,
    data
}: any) {

    const zones =
        ErgometryModelsUtil
            .calculateTrainingZones(
                result
            );

    if (!zones) {
        return null;
    }

    if (
        !result ||
        !result.IANSPoint ||
        !data ||
        data.length === 0
    ) {
        return null;
    }

    let minLoad = Number(data[0].load);

    let maxLoad = Number(data[0].load);

    for (let i = 0; i < data.length; i++) {

        if (data[i].load < minLoad) {

            minLoad = data[i].load;
        }

        if (data[i].load > maxLoad) {

            maxLoad = data[i].load;
        }
    }

    function percent(start: number, end: number): `${number}%` {

        if (end < start) {
            return '0%';
        }

        const total = maxLoad - minLoad;

        if (!total) {
            return '0%';
        }

        return `${((end - start) * 100) / total}%`;
    }

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                TRAINING ZONES
            </Text>

            <View style={styles.row}>

                {/* REG */}
                <View
                    style={[
                        styles.zone,
                        {
                            width: percent(minLoad, zones.REG.to),
                            backgroundColor: zones.REG.color
                        }
                    ]}
                >
                    <Text style={styles.text}>
                        REG
                    </Text>

                    <Text style={styles.textSmall}>
                        &lt;75%
                    </Text>
                </View>

                {/* GA1 */}
                <View
                    style={[
                        styles.zone,
                        {
                            width: percent(
                                zones.GA1.from,
                                zones.GA1.to
                            ),
                            backgroundColor: '#81c784'
                        }
                    ]}
                >
                    <Text style={styles.text}>
                        GA1
                    </Text>

                    <Text style={styles.textSmall}>
                        75-85%
                    </Text>
                </View>

                {/* GA2 */}
                <View
                    style={[
                        styles.zone,
                        {
                            width: percent(
                                zones.GA2.from,
                                zones.GA2.to
                            ),
                            backgroundColor: '#64b5f6'
                        }
                    ]}
                >
                    <Text style={styles.text}>
                        GA2
                    </Text>

                    <Text style={styles.textSmall}>
                        85-95%
                    </Text>
                </View>

                {/* E1 */}
                <View
                    style={[
                        styles.zone,
                        {
                            width: percent(
                                zones.E1.from,
                                zones.E1.to
                            ),
                            backgroundColor: '#ef9a9a'
                        }
                    ]}
                >
                    <Text style={styles.text}>
                        E1
                    </Text>

                    <Text style={styles.textSmall}>
                        95-105%
                    </Text>
                </View>

                {/* E2 */}
                <View
                    style={[
                        styles.zone,
                        {
                            width: percent(
                                zones.E2.from,
                                maxLoad
                            ),
                            backgroundColor: '#e57373'
                        }
                    ]}
                >
                    <Text style={styles.text}>
                        E2
                    </Text>

                    <Text style={styles.textSmall}>
                        &gt;105%
                    </Text>
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
        backgroundColor: '#eef3e6'
    },

    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10
    },

    row: {
        flexDirection: 'row',
        height: 60,
        overflow: 'hidden',
        borderWidth: 1
    },

    zone: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1
    },

    text: {
        fontWeight: 'bold',
        fontSize: 12
    },

    textSmall: {
        fontSize: 10
    }
})