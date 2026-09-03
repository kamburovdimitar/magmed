// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-31 (Claude) — DK одобри "Табло за прогреса" (Вариант 1 от
//   HTML мокъпа, https://claude.ai/code/artifact/f0f5e567-c42b-420f-803d-1d3c103bd76c)
//   и поиска реална версия на Page3 ("Страница 3"), за да я разгледа
//   първо самостоятелно — "после ще видим как ще го вържим". Затова:
//
//   - Статусът на 7-те карти идва от РЕАЛНИТЕ данни на активния тест
//     (TestProgressUtil.computeAll), не измислени проценти.
//   - "Печат / доклад" картата Е свързана реално — отваря СЪЩИЯ
//     PrintFullReportComponent, който вече работи от Page8/Page10/
//     Page11 (самостоятелен Modal, не изисква навигация между страници).
//   - Останалите 7 domain-карти НЕ навигират никъде още — Page3 получава
//     само `goTo` (App.tsx-ово ниво: 'home'/'login'), не и достъп до
//     HomeScreen.js-ния вътрешен `setPage('page8')` — за да отворят
//     директно съответния раздел в Page8, HomeScreen.js трябва да подаде
//     нов callback надолу (умишлено оставено за следващата стъпка, по
//     изричното желание на DK да го види първо, преди да решим как се
//     вързва).
//   - Няма "последно променено" caption на картите (мокъпът имаше
//     "днес"/"вчера") — MDTestRecord пази ЕДНА updatedAt дата за целия
//     тест, не по раздел, затова показването на "вчера" под всяка карта
//     би било измислено, не реално. Пропуснато нарочно, не пропуск.
// ============================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';
import { TestProgressUtil } from '../utils/TestProgressUtil';
import PrintFullReportComponent from './PrintFullReportComponent';

const STATUS_LABEL_KEY: any = {
    done: 'test_progress_done_text',
    partial: 'test_progress_partial_text',
    empty: 'test_progress_empty_text'
};

const DOMAIN_DEFS = [
    { key: 'vitals', labelKey: 'nav_page8_text' },
    { key: 'muskel', labelKey: 'muskel_funktion' },
    { key: 'haltung', labelKey: 'koerper_haltung' },
    { key: 'ergometrie', labelKey: 'ergometrie' },
    { key: 'laktat', labelKey: 'training_laktat_ergometrie_text' },
    { key: 'spiro', labelKey: 'training_spiro_ergometrie_text' },
    { key: 'training', labelKey: 'trainingsplan_text' }
];

export default function TestProgressDashboardComponent({
    measurement,
    patient,
    activeTest,
    onSelectDomain
}: any) {

    const [showFullReport, setShowFullReport] = React.useState(false);

    const progress = TestProgressUtil.computeAll(measurement);

    const patientName = [patient?.title, patient?.firstname, patient?.lastname]
        .filter(Boolean)
        .join(' ');

    function Ring({ percent, size = 46 }: { percent: number; size?: number }) {

        const color =
            percent >= 100 ? '#2e7d32' :
                percent > 0 ? '#b8860b' : '#8a8f8c';

        const bg = percent > 0 ? '#e7e5e1' : '#e7e5e1';

        return (
            <View
                style={[
                    styles.ring,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        // @ts-ignore — conic-gradient works via react-native-web's style passthrough
                        background: `conic-gradient(${color} 0 ${percent}%, ${bg} ${percent}% 100%)`
                    }
                ]}
            >
                <Text style={[styles.ringText, { color }]}>
                    {percent >= 100 ? '✓' : `${percent}%`}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.patientBar}>
                <View>
                    <Text style={styles.who}>{patientName || '—'}</Text>
                    <Text style={styles.when}>
                        {activeTest?.name || LanguageUtil.getName('test_text')}
                        {activeTest?.createdAt ? ` · ${activeTest.createdAt}` : ''}
                    </Text>
                </View>

                <View style={styles.overallRow}>
                    <Ring percent={progress.overallPercent} size={46} />
                    <Text style={styles.overallLabel}>
                        {progress.doneCount} {LanguageUtil.getName('test_progress_of_text')} {progress.totalDomains}
                        {'\n'}{LanguageUtil.getName('test_progress_domains_ready_text')}
                    </Text>
                </View>
            </View>

            <View style={styles.cardGrid}>

                {DOMAIN_DEFS.map(d => {

                    const domain = (progress.domains as any)[d.key];

                    return (
                        <Pressable
                            key={d.key}
                            style={styles.card}
                            onPress={() => onSelectDomain && onSelectDomain(d.key)}
                        >
                            <View style={styles.cardTop}>
                                <Text style={styles.cardName}>{LanguageUtil.getName(d.labelKey)}</Text>
                                <View style={[styles.pill, styles[`pill_${domain.status}` as keyof typeof styles] as any]}>
                                    <Text style={styles.pillText}>{LanguageUtil.getName(STATUS_LABEL_KEY[domain.status])}</Text>
                                </View>
                            </View>

                            <Ring percent={domain.percent} size={32} />
                        </Pressable>
                    );

                })}

                <Pressable
                    style={styles.card}
                    onPress={() => setShowFullReport(true)}
                >
                    <View style={styles.cardTop}>
                        <Text style={styles.cardName}>{LanguageUtil.getName('test_progress_print_card_text')}</Text>
                    </View>
                    <View style={styles.printIconWrap}>
                        <Text style={styles.printIcon}>🖨</Text>
                    </View>
                </Pressable>

            </View>

            {showFullReport && (
                <PrintFullReportComponent
                    measurement={measurement}
                    patient={patient}
                    activeTest={activeTest}
                    onClose={() => setShowFullReport(false)}
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        width: '100%'
    },

    patientBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        marginBottom: 18,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexWrap: 'wrap',
        gap: 12
    },

    who: {
        fontSize: 16,
        fontWeight: '700'
    },

    when: {
        fontSize: 12,
        color: '#777',
        marginTop: 2
    },

    overallRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },

    overallLabel: {
        fontSize: 12,
        color: '#555',
        lineHeight: 16
    },

    ring: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    ringText: {
        fontSize: 11,
        fontWeight: '700'
    },

    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },

    card: {
        width: 170,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 14,
        backgroundColor: '#fff'
    },

    cardTop: {
        marginBottom: 18,
        gap: 6
    },

    cardName: {
        fontSize: 14,
        fontWeight: '700'
    },

    pill: {
        alignSelf: 'flex-start',
        borderRadius: 999,
        paddingVertical: 3,
        paddingHorizontal: 8
    },

    pill_done: {
        backgroundColor: '#d4ead6'
    },

    pill_partial: {
        backgroundColor: '#f6e3b8'
    },

    pill_empty: {
        backgroundColor: '#e7e4dc'
    },

    pillText: {
        fontSize: 10.5,
        fontWeight: '700',
        color: '#333'
    },

    printIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#0e5f6b',
        alignItems: 'center',
        justifyContent: 'center'
    },

    printIcon: {
        fontSize: 15
    }

});
