import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

export default function ErgometrySummaryComponent({
    result
}: any) {

    if (!result) {
        return null;
    }

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                THRESHOLD SUMMARY
            </Text>

            {/* 🔹 IAS */}
            <View style={styles.block}>

                <Text style={styles.blockTitle}>
                    IAS
                </Text>

                <Text>
                    Lactate:
                    {' '}
                    {result.IAS}
                </Text>

                <Text>
                    Watt:
                    {' '}
                    {result.IASPoint?.load}
                </Text>

                <Text>
                    HF:
                    {' '}
                    {result.IASPoint?.hf}
                </Text>

                <Text>
                    % HFmax:
                    {' '}
                    {result.IASPoint?.hfPercent}
                </Text>

                <Text>
                    % Pmax:
                    {' '}
                    {result.IASPoint?.pmaxPercent}
                </Text>

                <Text>
                    % HRR:
                    {' '}
                    {result.IASPoint?.hrrPercent}
                </Text>

            </View>

            {/* 🔹 IANS */}
            <View style={styles.block}>

                <Text style={styles.blockTitle}>
                    IANS
                </Text>

                <Text>
                    Lactate:
                    {' '}
                    {result.IANS}
                </Text>

                <Text>
                    Watt:
                    {' '}
                    {result.IANSPoint?.load}
                </Text>

                <Text>
                    HF:
                    {' '}
                    {result.IANSPoint?.hf}
                </Text>

                <Text>
                    % HFmax:
                    {' '}
                    {result.IANSPoint?.hfPercent}
                </Text>

                <Text>
                    % Pmax:
                    {' '}
                    {result.IANSPoint?.pmaxPercent}
                </Text>

                <Text>
                    % HRR:
                    {' '}
                    {result.IANSPoint?.hrrPercent}
                </Text>

            </View>

            {/* 🔹 Interpretation */}
            <View style={styles.block}>

                <Text style={styles.blockTitle}>
                    INTERPRETATION
                </Text>

                {
                    result?.interpretation &&
                    result.interpretation.map(
                        (item: any, i: number) => (

                            <Text key={i}>
                                • {item}
                            </Text>
                        )
                    )
                }

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        backgroundColor: '#f5f5f5'
    },

    title: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10
    },

    block: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        backgroundColor: '#fff'
    },

    blockTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1565C0'
    }

})