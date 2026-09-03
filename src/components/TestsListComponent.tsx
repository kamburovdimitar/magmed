// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — New Test / Existing Tests / Save feature:
//   lists MDPatient.measurements[] (every saved test) with an Apply button
//   per row — modeled directly on ErgometryHistoryComponent.tsx's shape
//   (that file already does "list of past records + Apply button" for
//   ergometry reports; this is the same pattern one level up, for whole
//   tests).
// 2026-08-27 (Europe/Sofia) — DK: "да мога да избирам тестовете, след клик,
//   вместо да се налага да натискам приложи ... трябва да имаме del бутон
//   до приложи". Replicated ErgometryHistoryComponent.tsx's own
//   already-proven pattern (its 2026-08-19 changelog entries): the whole
//   row is now a TouchableOpacity — clicking it IS applying (onApply(t.id)
//   fires directly), so the separate "ПРИЛОЖИ" button is gone. Added a
//   Delete button (reuses the existing 'loeschen' key) that calls
//   e.stopPropagation() before onDelete(t.id), so clicking Delete doesn't
//   also trigger the row's own onApply. `onDelete` stays optional (guarded
//   with `onDelete &&`) so this component doesn't hard-crash if some future
//   caller doesn't wire it — same defensive pattern as
//   ErgometryHistoryComponent.
// 2026-08-27 (2) (Europe/Sofia) — DK: "изтрий да е червено". Plain RN
// <Button>'s `color` prop is unreliable across platforms (text tint on
// iOS, background on Android, inconsistent on web) — switched to a
// Pressable+Text so the red is guaranteed to render everywhere.
// ============================================

import React from 'react';
import { View, Text, Button, Pressable, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';

export default function TestsListComponent({
    tests,
    activeTestId,
    onApply,
    onDelete,
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

                        <TouchableOpacity
                            key={t.id}
                            activeOpacity={0.7}
                            onPress={() => {

                                onApply(t.id);
                            }}
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

                            {
                                onDelete &&

                                <Pressable
                                    style={styles.deleteButton}
                                    onPress={(e: any) => {

                                        // 🔹 спираме propagation-а, за да не
                                        // тригерне и onApply на родителския ред
                                        e?.stopPropagation?.();

                                        onDelete(t.id);
                                    }}
                                >
                                    <Text style={styles.deleteButtonText}>
                                        {LanguageUtil.getName('loeschen')}
                                    </Text>
                                </Pressable>
                            }

                        </TouchableOpacity>

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
    },

    deleteButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 4,
        marginLeft: 8
    },

    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }

});
