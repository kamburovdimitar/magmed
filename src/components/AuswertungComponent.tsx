import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function AuswertungComponent({
    data,
    result
}: any) {

    function renderRow(item: any, index: number) {

        let ians = '---'
        let pmax = '---'
        let hrr = '---'
        let hfmax = '---'

        // 🔹 IAS
        if (result?.IASPoint && String(result.IASPoint.stage).includes(String(item.stage))) {

            ians = 'IAS'

            pmax = result.IASPoint.pmaxPercent
            hrr = result.IASPoint.hrrPercent
            hfmax = result.IASPoint.hfPercent
        }

        // 🔹 IANS
        if (result?.IANSPoint && String(result.IANSPoint.stage).includes(String(item.stage))) {

            ians = 'IANS'

            pmax = result.IANSPoint.pmaxPercent
            hrr = result.IANSPoint.hrrPercent
            hfmax = result.IANSPoint.hfPercent
        }

        return (



            <View key={index} style={styles.row}>


                <Text style={styles.cell}>
                    {item.lactate || '-'}
                </Text>

                <Text style={styles.cell}>
                    {ians}
                </Text>

                <Text style={styles.cell}>
                    {item.hf || '---'}
                </Text>

                <Text style={styles.cell}>
                    {item.load}
                </Text>

                <Text style={styles.cell}>
                    {pmax}
                </Text>

                <Text style={styles.cell}>
                    {hrr}
                </Text>

                <Text style={styles.cell}>
                    ---
                </Text>

                <Text style={styles.cell}>
                    {hfmax}
                </Text>

            </View>
        )
    }

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                AUSWERTUNG
            </Text>

            {/* HEADER */}
            <View style={styles.header}>

                <Text style={styles.cell}>
                    Laktat
                </Text>

                <Text style={styles.cell}>
                    IANS %
                </Text>

                <Text style={styles.cell}>
                    HF
                </Text>

                <Text style={styles.cell}>
                    Watt
                </Text>

                <Text style={styles.cell}>
                    % Pmax
                </Text>

                <Text style={styles.cell}>
                    % HRR
                </Text>

                <Text style={styles.cell}>
                    % VO2max
                </Text>

                <Text style={styles.cell}>
                    % HFmax
                </Text>

            </View>

            {/* BODY */}
            <View style={styles.scroll}>

                {
                    data?.map((item: any, i: number) =>
                        renderRow(item, i)
                    )
                }

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
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },

    header: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 5,
        backgroundColor: '#d9e2ef'
    },

    row: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        paddingVertical: 4
    },

    cell: {
        width: '12.5%',
        fontSize: 12
    },

    scroll: {
        maxHeight: 250
    }

})