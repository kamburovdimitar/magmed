import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function ErgometryTableComponent({
    measurements,
    onUpdateRow
}) {

    const rows =
        measurements?.ergometry?.data ?? [];

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Ergometry Test
            </Text>

            <View style={styles.header}>

                <Text style={styles.stage}>
                    #
                </Text>

                <Text style={styles.input}>
                    Time
                </Text>

                <Text style={styles.input}>
                    Load
                </Text>

                <Text style={styles.input}>
                    HF
                </Text>

                <Text style={styles.input}>
                    Lactate
                </Text>

            </View>

            {

                rows.map((row, i) => (

                    <View
                        key={i}
                        style={styles.row}
                    >

                        <Text style={styles.stage}>
                            {row.stage + 1}
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={row.time?.toString() ?? ""}
                            onChangeText={(v) =>
                                onUpdateRow(
                                    i,
                                    "time",
                                    v
                                )
                            }
                        />

                        <TextInput
                            style={styles.input}
                            value={row.load?.toString() ?? ""}
                            onChangeText={(v) =>
                                onUpdateRow(
                                    i,
                                    "load",
                                    Number(v)
                                )
                            }
                        />

                        <TextInput
                            style={styles.input}
                            value={row.hf?.toString() ?? ""}
                            onChangeText={(v) =>
                                onUpdateRow(
                                    i,
                                    "hf",
                                    Number(v)
                                )
                            }
                        />

                        <TextInput
                            style={styles.input}
                            value={row.lactate?.toString() ?? ""}
                            onChangeText={(v) =>
                                onUpdateRow(
                                    i,
                                    "lactate",
                                    Number(v)
                                )
                            }
                        />

                    </View>

                ))

            }

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        marginTop: 20,
        borderWidth: 1,
        padding: 10
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 10
    },

    header: {
        flexDirection: 'row',
        marginBottom: 5
    },

    row: {
        flexDirection: 'row',
        marginVertical: 3
    },

    stage: {
        width: 35,
        textAlign: 'center',
        paddingTop: 8
    },

    input: {
        flex: 1,
        borderWidth: 1,
        marginHorizontal: 2,
        padding: 6
    }

});