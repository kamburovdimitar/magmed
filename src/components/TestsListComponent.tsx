// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — New Test / Existing Tests / Save feature:
//   lists MDPatient.measurements[] (every saved test) with an Apply button
//   per row — modeled directly on ErgometryHistoryComponent.tsx's shape
//   (that file already does "list of past records + Apply button" for
//   ergometry reports; this is the same pattern one level up, for whole
//   tests).
// ============================================

import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';

export default function TestsListComponent({
    tests,
    activeTestId,
    onApply,
    onClose
}: any) {

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                {LanguageUtil.getName('vorhandene_tests_test')}
            </Text>

            {
                (!tests || tests.length === 0) && (

                    <Text style={styles.empty}>
                        {LanguageUtil.getName('keine_tests_text')}
                    </Text>

                )
            }

            <ScrollView style={styles.list}>

                {
                    tests?.map((t: any) => (

                        <View
                            key={t.id}
                            style={[
                                styles.row,
                                t.id === activeTestId && styles.activeRow
                            ]}
                        >

                            <Text style={styles.cell}>
                                {LanguageUtil.getName('name')}: {t.name || t.id}
                                {'  •  '}
                                {LanguageUtil.getName('datum')}: {t.createdAt}
                            </Text>

                            <Button
                                title={LanguageUtil.getName('uebernehmen')}
                                onPress={() => onApply(t.id)}
                            />

                        </View>

                    ))
                }

            </ScrollView>

            <Button
                title={LanguageUtil.getName('schliessen')}
                onPress={onClose}
            />

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 10
    },

    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center'
    },

    empty: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#666'
    },

    list: {
        flex: 1,
        marginBottom: 10
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        padding: 8,
        marginBottom: 6
    },

    activeRow: {
        backgroundColor: '#fff7cc'
    },

    cell: {
        flex: 1
    }

});
