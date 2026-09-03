// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-20 — DK: AUSWERTUNG бутон под BEURTEILUNG панела в Körper-
//   Haltung (мокъп "3.05 Neuer Test - KÖRPERHALTUNG - Beurteilung",
//   долна кутия с AUSWERTUNG/TRAININGSPLAN/ÜBUNGEN AUSWÄHLEN бутони) — DK
//   потвърди (AskUserQuestion) AUSWERTUNG първо, с реално съдържание;
//   другите 2 остават placeholder за сега (виж KoerperHaltungComponent.tsx).
//
//   AUSWERTUNG показва обобщение на ВСИЧКИ вече записани Körper-Haltung
//   оценки (KOPF/WIRBELSÄULE/SCHULTER/BECKEN/KNIE/FUSS наведнъж) — само
//   редовете, на които има избрана степен (schwer/mittelschwer/leicht/
//   normal), групирани по категория и цветово кодирани по същата скала
//   като таблиците (BeuterlungTable.tsx). Категория без нито един запис
//   показва "Keine Befunde erfasst".
//
//   Реизползва СЪЩИТЕ *_SECTIONS декларации (label+key) от
//   constants/koerperHaltungSections.js, за да не дублира кои редове
//   какъв label имат — единствен източник на истина с реалните таблици.
//
// 2026-08-27 (Europe/Sofia) — DK: untranslated German row labels (see the
//   same-day changelog in BeuterlungTable.tsx). findingsFor() pushed
//   r.label (raw German) straight into the summary — switched to
//   LanguageUtil.getName(r.labelKey).
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';
import {
    KOPF_SECTIONS,
    WIRBELSAEULE_SECTIONS,
    SCHULTER_SECTIONS,
    BECKEN_SECTIONS,
    KNIE_SECTIONS,
    FUSS_SECTIONS
} from '../constants/koerperHaltungSections';

const SEVERITY_COLORS = ['#ef5350', '#ffcc80', '#fff59d', '#a5d6a7'];
const SEVERITY_LABEL_KEYS = ['schwer', 'mittelschwer', 'leicht', 'normal'];

// 🔹 категория -> {titleKey, sections, fieldKey} — fieldKey сочи към
// съответното поле в MDPatientMeasurements (виж model файла).
const CATEGORIES = [
    { titleKey: 'kopf', sections: KOPF_SECTIONS, fieldKey: 'koerperHaltungKopf' },
    { titleKey: 'wirbelsaeule', sections: WIRBELSAEULE_SECTIONS, fieldKey: 'koerperHaltungWirbelsaeule' },
    { titleKey: 'schulter', sections: SCHULTER_SECTIONS, fieldKey: 'koerperHaltungSchulter' },
    { titleKey: 'becken', sections: BECKEN_SECTIONS, fieldKey: 'koerperHaltungBecken' },
    { titleKey: 'knie', sections: KNIE_SECTIONS, fieldKey: 'koerperHaltungKnie' },
    { titleKey: 'fuss', sections: FUSS_SECTIONS, fieldKey: 'koerperHaltungFuss' }
];

export default function KoerperHaltungAuswertungComponent({ measurement }: any) {

    function findingsFor(category: any) {

        const value = measurement?.[category.fieldKey] ?? {};

        const findings: { label: string; colIndex: number }[] = [];

        category.sections.forEach((section: any) => {
            section.rows.forEach((r: any) => {
                const colIndex = value[r.key];
                if (colIndex != null) {
                    findings.push({ label: LanguageUtil.getName(r.labelKey), colIndex });
                }
            });
        });

        return findings;
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {LanguageUtil.getName('auswertung_text')}
            </Text>

            {
                CATEGORIES.map((category) => {

                    const findings = findingsFor(category);

                    return (
                        <View key={category.titleKey} style={styles.categoryBlock}>

                            <Text style={styles.categoryTitle}>
                                {LanguageUtil.getName(category.titleKey)}
                            </Text>

                            {
                                findings.length === 0
                                    ? (
                                        <Text style={styles.emptyText}>
                                            {LanguageUtil.getName('keine_befunde_text')}
                                        </Text>
                                    )
                                    : findings.map((f, i) => (
                                        <View key={i} style={styles.findingRow}>
                                            <Text style={styles.findingLabel} numberOfLines={1}>
                                                {f.label}
                                            </Text>
                                            <View style={[styles.findingBadge, { backgroundColor: SEVERITY_COLORS[f.colIndex] }]}>
                                                <Text style={styles.findingBadgeText}>
                                                    {LanguageUtil.getName(SEVERITY_LABEL_KEYS[f.colIndex])}
                                                </Text>
                                            </View>
                                        </View>
                                    ))
                            }

                        </View>
                    );
                })
            }

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        borderColor: '#999',
        padding: 10,
        backgroundColor: '#eef3e6'
    },

    title: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10
    },

    categoryBlock: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#c8d6c0',
        borderRadius: 6,
        padding: 8,
        backgroundColor: '#ffffff'
    },

    categoryTitle: {
        fontWeight: 'bold',
        marginBottom: 6
    },

    emptyText: {
        fontSize: 12,
        color: '#777',
        fontStyle: 'italic'
    },

    findingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 3
    },

    findingLabel: {
        flex: 1,
        fontSize: 13
    },

    findingBadge: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)'
    },

    findingBadgeText: {
        fontSize: 11,
        fontWeight: '600'
    }

});
