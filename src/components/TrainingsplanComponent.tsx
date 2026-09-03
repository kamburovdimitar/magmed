// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-20 (Europe/Sofia) — DK: "изтрий всичко старо на Training (❤️)
//   страницата, имплементирай PDF по PDF" — старият Page10.tsx съдържаше
//   само мъртъв/несвързан код (fake UsersProxy търсачка, копирано от
//   другаде, бутони с console.log(true)) — изтрит изцяло (виж Page10.tsx).
//
//   Този компонент е новият контейнер за целия "Training – Gesundheit"
//   модул (5 PDF-а): горните 4 таба (Kein Test/Ergometrie/Laktat
//   Ergometrie/Spiro Ergometrie — виж 5.90CCCGESUNDHEITS_Training.pdf:
//   "Aktiv werden nur die Knöpfe ..., für die auch ein, oder mehrere,
//   Tests in Background vorhanden sind" — засега ВСИЧКИ 4 са кликаеми,
//   без реална проверка "има ли тест в background", защото моделът все
//   още няма изричен testType флаг на ergometryReports — маркирано като
//   опростяване за DK да потвърди), плюс лявото контролно табло:
//     Automatik EIN/AUS      — превключвател, самата decision-tree логика
//                              е placeholder (DK потвърди: чакаме
//                              отделния "Einstellungen" документ)
//     Nicht gewählte Bereiche
//     ausblenden             — препредаден през measurement.
//                              trainingsplanKeinTest.hideUnselected
//     Trainings-Woche
//     GESTALTEN              — тълкуван като toggle между 'grundeinstellung'
//                              (read-only, авто-изчислено) и 'individuell'
//                              (редактируемо) editMode — виж 5.21b мокъпа,
//                              страници 1 vs 2, и DK-коментара в
//                              TrainingsplanKeinTestComponent.tsx.
//     LEERE Tabellen         — изчиства 8-те стадия (active=false, празни
//                              стойности) за построяване от нула.
//     Personenspezifische
//     Standardwerte          — Abrufen/Speichern/Zurücksetsvane свързани с
//                              MDPatient.trainingsplanStandardwerte (виж
//                              MDPatient.tsx) — преживяват отделния тест.
//
//   REHABILITATION (страничен бутон от старите мокъп screenshot-и) НЕ е
//   имплементиран — не се среща в нито един от 5-те предоставени PDF-а,
//   извън scope засега (флагнато за DK).
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';
import { MDPatientMeasurements } from '../model/MDPatientMeasurements';
import { MDPatient } from '../model/MDPatient';
import { KEIN_TEST_DEFAULT_STAGES, EMPTY_STAGES } from '../constants/trainingsplanKeinTestDefaults';
import TrainingsplanKeinTestComponent from './TrainingsplanKeinTestComponent';
import TrainingsplanErgometrieComponent from './TrainingsplanErgometrieComponent';
import TrainingsplanLaktatErgometrieComponent from './TrainingsplanLaktatErgometrieComponent';
import TrainingsplanSpiroErgometrieComponent from './TrainingsplanSpiroErgometrieComponent';
import PrintFullReportComponent from './PrintFullReportComponent';

const TABS = [
    { key: 'keinTest', labelKey: 'kein_test_text' },
    { key: 'ergometrie', labelKey: 'training_ergometrie_text' },
    { key: 'laktatErgometrie', labelKey: 'training_laktat_ergometrie_text' },
    { key: 'spiroErgometrie', labelKey: 'training_spiro_ergometrie_text' }
];

// 🔹 2026-08-21 (Claude) — DK: "сега следващите 3 таба ... започни с
// ергометри." Общото ляво контролно табло (Automatik/Nicht gewählte
// Bereiche/Trainings-Woche GESTALTEN/LEERE Tabellen/Standardwerte) сега
// важи за ПОВЕЧЕ от един таб — трябва да пипа обекта на АКТИВНИЯ таб, не
// само trainingsplanKeinTest (иначе бутоните тук щяха да местят
// trainingsplanKeinTest, докато самата Ergometrie компонента чете от
// trainingsplanErgometrie — пълно разминаване). Затова storage полето се
// избира динамично по activeTab.
const STORAGE_KEY_BY_TAB: any = {
    keinTest: 'trainingsplanKeinTest',
    ergometrie: 'trainingsplanErgometrie',
    laktatErgometrie: 'trainingsplanLaktatErgometrie',
    spiroErgometrie: 'trainingsplanSpiroErgometrie'
};

// 🔹 REHABILITATION/GESUNDHEITSSPORT/FREIZEITSPORT (5.24b мокъп, ляво
// меню) — само за табовете СЛЕД Kein Test (в Kein Test мокъпа тези 3
// бутона липсват изцяло, виж 5.21b). Засега важи и за Laktat/Spiro
// Ergometrie предварително (все още без техните PDF-и) — лесно за
// стесняване по-късно, ако се окаже грешно.
const TRAININGSKATEGORIE_OPTIONS = [
    { value: 'rehabilitation', labelKey: 'rehabilitation_text' },
    { value: 'gesundheitssport', labelKey: 'gesundheitssport_text' },
    { value: 'freizeitsport', labelKey: 'freizeitsport_text' }
];

export default function TrainingsplanComponent({ measurement, callback, patient, patientCallback }: any) {

    const [activeTab, setActiveTab] = useState('keinTest');
    const [savedFlash, setSavedFlash] = useState(false);

    // 🔹 2026-08-26 (Claude) — DK: "нека направим принт страница с
    // текущите и налични данни от трейнинг и лактатните криви" — първо
    // сочеше към тесния PrintReportComponent.tsx (само тренировка+лактат).
    // 2026-08-28 (Claude) — DK: "този печат го сложи на няколко различни
    // места ... на тренировките" — сменено да отваря СЪЩИЯ пълен доклад
    // (PrintFullReportComponent.tsx) като бутона от Page8.tsx/Page11.tsx,
    // вместо отделен по-тесен изглед.
    const [showPrintReport, setShowPrintReport] = useState(false);

    // 🔹 PrintFullReportComponent очаква и `activeTest` (MDTestRecord —
    // name/id/дати, за хедъра на доклада) — тук нямаме такъв проп отгоре
    // (Page10.tsx подава само measurement/patient), но `patient` вече носи
    // measurements[]/activeTestId, така че го извеждаме по абсолютно
    // същия начин като Page10.tsx/Page8.tsx.
    const activeTest = (patient?.measurements ?? []).find(
        (t: any) => t.id === patient?.activeTestId
    ) ?? null;

    const showTrainingskategorie = activeTab !== 'keinTest';

    const storageKey = STORAGE_KEY_BY_TAB[activeTab] ?? 'trainingsplanKeinTest';
    const kt = measurement?.[storageKey] ?? {};
    const editMode = kt.editMode ?? 'grundeinstellung';
    const automatikEnabled = kt.automatikEnabled ?? false;
    const hideUnselected = kt.hideUnselected ?? false;
    const trainingskategorie = kt.trainingskategorie ?? 'gesundheitssport';

    function updateKt(patch: any) {

        callback(
            new MDPatientMeasurements({
                ...measurement,
                [storageKey]: {
                    ...kt,
                    ...patch
                }
            })
        );

    }

    function toggleEditMode() {
        updateKt({ editMode: editMode === 'individuell' ? 'grundeinstellung' : 'individuell' });
    }

    // 🔹 2026-09-02 (Claude) — DK изрично избра: докторът пише плана РЪЧНО,
    // не софтуерът да генерира нещо автоматично (виж changelog-а при
    // EMPTY_STAGES в constants/trainingsplanKeinTestDefaults.js). Затова
    // "Automatik ИЗКЛ" вече връща към ПРАЗНА таблица, не към
    // KEIN_TEST_DEFAULT_STAGES — старото поведение мълчаливо показваше
    // едни и същи "стандартни" числа за всеки пациент, което точно
    // създаваше объркването. Самата "Automatik" decision-tree логика
    // остава placeholder (чакаме отделния "Einstellungen" документ) —
    // бутонът засега само превключва флага и връща към празно при ИЗКЛ.
    function toggleAutomatik() {
        if (automatikEnabled) {
            updateKt({
                automatikEnabled: false,
                editMode: 'grundeinstellung',
                hfruheOverride: null,
                hfmaxOverride: null,
                wattMaxOverride: null,
                stages: EMPTY_STAGES
            });
        } else {
            updateKt({ automatikEnabled: true });
        }
    }

    // 🔹 2026-09-02 (Claude) — преди изчистваше само active/trainingsblock,
    // но оставяше wntz/dauerTe/teWoche/zeitAufteilung с генеричните числа
    // от KEIN_TEST_DEFAULT_STAGES — "празната" таблица всъщност не беше
    // празна. Вече наистина връща 8 напълно празни реда (EMPTY_STAGES).
    function clearStages() {
        updateKt({ stages: EMPTY_STAGES, editMode: 'individuell' });
    }

    // 🔹 2026-08-21 (Claude) — same reason as STORAGE_KEY_BY_TAB above:
    // "Personenspezifische Standardwerte" също трябва да пазят отделни
    // подразбирания ЗА ВСЕКИ таб (ключувано по `activeTab`), не само за
    // Kein Test — иначе Ergometrie-то щеше тихомълком да чете/презаписва
    // същите запазени стойности като Kein Test.
    function speichernStandardwerte() {

        if (!patientCallback || !patient) return;

        patientCallback(
            new MDPatient({
                ...patient,
                trainingsplanStandardwerte: {
                    ...(patient.trainingsplanStandardwerte ?? {}),
                    [activeTab]: kt
                }
            })
        );

    }

    function abrufenStandardwerte() {

        const saved = patient?.trainingsplanStandardwerte?.[activeTab];

        if (!saved) return;

        updateKt({ ...saved });

    }

    function zuruecksetzenStandardwerte() {

        if (!patientCallback || !patient) return;

        patientCallback(
            new MDPatient({
                ...patient,
                trainingsplanStandardwerte: {
                    ...(patient.trainingsplanStandardwerte ?? {}),
                    [activeTab]: null
                }
            })
        );

    }

    // 🔹 2026-08-21 (Claude) — DK: "генерално не сме сложили сейв, трябва
    // да го сложим и тук, както и на предната страница." И двата таба
    // ВЕЧЕ auto-save-ват на всяка промяна (виж Page10.tsx — dispatch на
    // saveActiveTest при всеки callback), но нямаше никакъв видим бутон,
    // затова DK не е сигурен дали/кога нещо реално се записва. Този бутон
    // не прави нищо технически различно (пак просто препредава текущия
    // measurement) — просто дава ясно, видимо потвърждение "Записано ✓"
    // за 1.5 секунди, за спокойствие.
    function saveNow() {

        callback(new MDPatientMeasurements({ ...measurement }));

        setSavedFlash(true);

        setTimeout(() => setSavedFlash(false), 1500);

    }

    // 🔹 2026-08-21 (Claude) — DK: "сложи ми отдолу един generate fake
    // data button, да мога да го цъкам и да попълва автоматично, това,
    // което се попълва, защото аз не се ориентирам." Попълва точно
    // нещата, които реално се избират/въвеждат от доктора на тази
    // страница (виж обяснението, дадено на DK в чата): кои стадии са
    // активни + примерни стойности в "Individuelle Planung" режим +
    // избран Vorlage шаблон вдясно (Ratschläge). Vorlage B/C нямат
    // предоставен текст все още (само A) — затова генераторът винаги
    // избира A, за да остане нещо смислено видимо вдясно вместо празно
    // поле.
    function generateFakeData() {

        const dauerTeOptions = ['10-15', '15-20', '20-30', '30-40', '40-50', '40-60', '40-80', '45-90'];
        const teWocheOptions = ['2-3', '3-4', '3-5', '3-6', '3-7'];
        const zeitAufteilungOptions = ['90/10', '80/20', '70/30', '60/40'];
        const trainingsblockOptions = ['3-5', '4-6', '5-7', '6-8', '7-9'];

        function pick(options: string[]) {
            return options[Math.floor(Math.random() * options.length)];
        }

        const fakeStages = KEIN_TEST_DEFAULT_STAGES.map((s) => ({
            ...s,
            active: Math.random() > 0.15,
            wntz: Math.max(15, Math.round((s.wntz + (Math.random() * 40 - 20)) / 5) * 5),
            dauerTe: pick(dauerTeOptions),
            teWoche: pick(teWocheOptions),
            zeitAufteilung: pick(zeitAufteilungOptions),
            trainingsblock: s.stage === 8 ? '-----' : pick(trainingsblockOptions)
        }));

        updateKt({
            editMode: 'individuell',
            stages: fakeStages,
            ratschlagTemplate: 'A',
            ratschlagText: null
        });

    }

    // 🔹 2026-08-21 (Claude) — DK: "2. fake буton" за Ergometrie таба
    // (същия принцип като Kein Test-ния generateFakeData по-горе) — плюс
    // случаен избор на trainingskategorie, тъй като Ergometrie-то има тази
    // допълнителна опция.
    function generateFakeDataErgometrie() {

        const dauerTeOptions = ['10-15', '15-20', '20-30', '30-40', '40-50', '40-60', '40-80', '45-90'];
        const teWocheOptions = ['2-3', '3-4', '3-5', '3-6', '3-7'];
        const zeitAufteilungOptions = ['90/10', '80/20', '70/30', '60/40'];
        const trainingsblockOptions = ['3-5', '4-6', '5-7', '6-8', '7-9'];
        const kategorieOptions = ['rehabilitation', 'gesundheitssport', 'freizeitsport'];

        function pick(options: string[]) {
            return options[Math.floor(Math.random() * options.length)];
        }

        const fakeStages = KEIN_TEST_DEFAULT_STAGES.map((s) => ({
            ...s,
            active: Math.random() > 0.15,
            wntz: Math.max(15, Math.round((s.wntz + (Math.random() * 40 - 20)) / 5) * 5),
            dauerTe: pick(dauerTeOptions),
            teWoche: pick(teWocheOptions),
            zeitAufteilung: pick(zeitAufteilungOptions),
            trainingsblock: s.stage === 8 ? '-----' : pick(trainingsblockOptions)
        }));

        updateKt({
            editMode: 'individuell',
            stages: fakeStages,
            ratschlagTemplate: 'A',
            ratschlagText: null,
            trainingskategorie: pick(kategorieOptions)
        });

    }

    // 🔹 2026-08-21 (Claude) — DK: "давай третото лактат ергометри" — същия
    // fake-data принцип, за Laktat Ergometrie таба.
    function generateFakeDataLaktatErgometrie() {

        const dauerTeOptions = ['10-15', '15-20', '20-30', '30-40', '40-50', '40-60', '40-80', '45-90'];
        const teWocheOptions = ['2-3', '3-4', '3-5', '3-6', '3-7'];
        const zeitAufteilungOptions = ['90/10', '80/20', '70/30', '60/40'];
        const trainingsblockOptions = ['3-5', '4-6', '5-7', '6-8', '7-9'];
        const kategorieOptions = ['rehabilitation', 'gesundheitssport', 'freizeitsport'];

        function pick(options: string[]) {
            return options[Math.floor(Math.random() * options.length)];
        }

        const fakeStages = KEIN_TEST_DEFAULT_STAGES.map((s) => ({
            ...s,
            active: Math.random() > 0.15,
            wntz: Math.max(15, Math.round((s.wntz + (Math.random() * 40 - 20)) / 5) * 5),
            dauerTe: pick(dauerTeOptions),
            teWoche: pick(teWocheOptions),
            zeitAufteilung: pick(zeitAufteilungOptions),
            trainingsblock: s.stage === 8 ? '-----' : pick(trainingsblockOptions)
        }));

        updateKt({
            editMode: 'individuell',
            stages: fakeStages,
            ratschlagTemplate: 'A',
            ratschlagText: null,
            trainingskategorie: pick(kategorieOptions)
        });

    }

    // 🔹 2026-08-21 (Claude) — DK: "остана последният — Spiro Ergometrie" —
    // същия fake-data принцип, за Spiro Ergometrie таба (4-ти и последен).
    function generateFakeDataSpiroErgometrie() {

        const dauerTeOptions = ['10-15', '15-20', '20-30', '30-40', '40-50', '40-60', '40-80', '45-90'];
        const teWocheOptions = ['2-3', '3-4', '3-5', '3-6', '3-7'];
        const zeitAufteilungOptions = ['90/10', '80/20', '70/30', '60/40'];
        const trainingsblockOptions = ['3-5', '4-6', '5-7', '6-8', '7-9'];
        const kategorieOptions = ['rehabilitation', 'gesundheitssport', 'freizeitsport'];

        function pick(options: string[]) {
            return options[Math.floor(Math.random() * options.length)];
        }

        const fakeStages = KEIN_TEST_DEFAULT_STAGES.map((s) => ({
            ...s,
            active: Math.random() > 0.15,
            wntz: Math.max(15, Math.round((s.wntz + (Math.random() * 40 - 20)) / 5) * 5),
            dauerTe: pick(dauerTeOptions),
            teWoche: pick(teWocheOptions),
            zeitAufteilung: pick(zeitAufteilungOptions),
            trainingsblock: s.stage === 8 ? '-----' : pick(trainingsblockOptions)
        }));

        updateKt({
            editMode: 'individuell',
            stages: fakeStages,
            ratschlagTemplate: 'A',
            ratschlagText: null,
            trainingskategorie: pick(kategorieOptions)
        });

    }

    return (
        <View style={styles.container}>

            {/* ===== TOP TABS ===== */}
            <View style={styles.tabRow}>
                {
                    TABS.map((tab) => (
                        <Pressable
                            key={tab.key}
                            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                                {LanguageUtil.getName(tab.labelKey)}
                            </Text>
                        </Pressable>
                    ))
                }
            </View>

            <View style={styles.body}>

                {/* ===== LEFT CONTROL PANEL ===== */}
                <View style={styles.controlPanel}>

                    {/* 🔹 5.24b мокъп — само за Ergometrie/Laktat/Spiro
                        табовете (Kein Test го няма, виж 5.21b). Избира
                        категорията на плана — засега само Gesundheitssport
                        има реални % диапазони (виж коментара при
                        TRAININGSKATEGORIE_OPTIONS по-горе). */}
                    {
                        showTrainingskategorie &&
                        TRAININGSKATEGORIE_OPTIONS.map((option) => (
                            <Pressable
                                key={option.value}
                                style={[styles.controlButton, trainingskategorie === option.value && styles.controlButtonActive]}
                                onPress={() => updateKt({ trainingskategorie: option.value })}
                            >
                                <Text style={styles.controlButtonText}>
                                    {LanguageUtil.getName(option.labelKey)}
                                </Text>
                            </Pressable>
                        ))
                    }

                    <Pressable style={styles.controlButton} onPress={toggleAutomatik}>
                        <Text style={styles.controlButtonText}>
                            {LanguageUtil.getName('automatik_ein_aus_text')} — {automatikEnabled ? LanguageUtil.getName('ja') : LanguageUtil.getName('nein')}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={styles.controlCheckboxRow}
                        onPress={() => updateKt({ hideUnselected: !hideUnselected })}
                    >
                        <Text style={styles.checkboxGlyph}>{hideUnselected ? '☑' : '☐'}</Text>
                        <Text style={styles.controlCheckboxText}>{LanguageUtil.getName('nicht_gewaehlte_bereiche_ausblenden_text')}</Text>
                    </Pressable>

                    {/* 🔹 2026-08-25 (Claude) — DK докладва, че бутонът за отключване
                        на редакция (individuell mode) не се забелязва достатъчно:
                        потребителите не разбират че трябва да го натиснат и си
                        мислят че полетата "не работят". Затова докато сме в
                        заключен режим (grundeinstellung) бутонът е подчертан с
                        жълт "call-to-action" стил + катинарче + hint текст под него;
                        щом е individuell (отключено), той просто показва ✓. */}
                    <View>
                        <Pressable
                            style={[styles.controlButton, editMode === 'individuell' ? styles.controlButtonActive : styles.controlButtonAttention]}
                            onPress={toggleEditMode}
                        >
                            <Text style={styles.controlButtonText}>
                                {editMode === 'individuell' ? '🔓 ' : '🔒 '}
                                {LanguageUtil.getName('trainings_woche_gestalten_text')}
                                {editMode === 'individuell' ? ' ✓' : ''}
                            </Text>
                        </Pressable>
                        {editMode !== 'individuell' && (
                            <Text style={styles.controlButtonHint}>
                                {LanguageUtil.getName('trainings_woche_gestalten_hint_text')}
                            </Text>
                        )}
                    </View>

                    <Pressable style={styles.controlButton} onPress={clearStages}>
                        <Text style={styles.controlButtonText}>{LanguageUtil.getName('leere_tabellen_text')}</Text>
                    </Pressable>

                    <Pressable style={styles.controlButton} onPress={() => setShowPrintReport(true)}>
                        <Text style={styles.controlButtonText}>{LanguageUtil.getName('print_report_button_text')}</Text>
                    </Pressable>

                    <View style={styles.standardwerteBox}>
                        <Text style={styles.standardwerteTitle}>{LanguageUtil.getName('personenspezifische_standardwerte_text')}</Text>
                        <Pressable style={styles.standardwerteButton} onPress={abrufenStandardwerte}>
                            <Text style={styles.standardwerteButtonText}>{LanguageUtil.getName('abrufen_text')}</Text>
                        </Pressable>
                        <Pressable style={styles.standardwerteButton} onPress={speichernStandardwerte}>
                            <Text style={styles.standardwerteButtonText}>{LanguageUtil.getName('speichern')}</Text>
                        </Pressable>
                        <Pressable style={styles.standardwerteButton} onPress={zuruecksetzenStandardwerte}>
                            <Text style={styles.standardwerteButtonText}>{LanguageUtil.getName('zuruecksetzen')}</Text>
                        </Pressable>
                    </View>

                </View>

                {/* ===== MAIN CONTENT ===== */}
                <ScrollView style={styles.content} contentContainerStyle={styles.contentScrollContainer}>
                    {
                        activeTab === 'keinTest'
                            ? <TrainingsplanKeinTestComponent measurement={measurement} callback={callback} />
                            : activeTab === 'ergometrie'
                                ? <TrainingsplanErgometrieComponent measurement={measurement} callback={callback} />
                                : activeTab === 'laktatErgometrie'
                                    ? <TrainingsplanLaktatErgometrieComponent measurement={measurement} callback={callback} />
                                    : activeTab === 'spiroErgometrie'
                                        ? <TrainingsplanSpiroErgometrieComponent measurement={measurement} callback={callback} />
                                        : <Text style={styles.placeholder}>{LanguageUtil.getName('mufu_placeholder_text')}</Text>
                    }
                </ScrollView>

            </View>

            {/* ===== FOOTER: Generate fake data + Save (DK: помощни бутони
                за ориентация в демо/тест данните, докато няма реална БД,
                плюс видимо потвърждение, че записва) — вече за всичките 4
                табове. ===== */}
            <View style={styles.footerRow}>

                <Pressable
                    style={styles.fakeDataButton}
                    onPress={
                        activeTab === 'keinTest'
                            ? generateFakeData
                            : activeTab === 'ergometrie'
                                ? generateFakeDataErgometrie
                                : activeTab === 'laktatErgometrie'
                                    ? generateFakeDataLaktatErgometrie
                                    : generateFakeDataSpiroErgometrie
                    }
                >
                    <Text style={styles.fakeDataButtonText}>Generate fake data</Text>
                </Pressable>

                <Pressable style={styles.saveButton} onPress={saveNow}>
                    <Text style={styles.saveButtonText}>
                        {savedFlash ? LanguageUtil.getName('saved_confirmation_text') : LanguageUtil.getName('speichern')}
                    </Text>
                </Pressable>

            </View>

            {
                showPrintReport && (
                    <PrintFullReportComponent
                        measurement={measurement}
                        patient={patient}
                        activeTest={activeTest}
                        onClose={() => setShowPrintReport(false)}
                    />
                )
            }

        </View>
    );
}

const styles = StyleSheet.create({

    // 🔹 2026-08-21 — DK: "не ми харесва, много е ситно всичко" — виж
    // идентичния коментар в TrainingsplanKeinTestComponent.tsx. Само CSS
    // размери/spacing преработени тук, wiring непроменен. `container`
    // добива изрично `width:'100%'` (не разчитаме само на default stretch
    // на родителя).
    container: {
        flex: 1,
        width: '100%',
        gap: 14
    },

    tabRow: {
        flexDirection: 'row',
        gap: 8
    },

    // 🔹 2026-08-21 (Claude) — DK: "бутоните в дясно и бутоните горе,
    // отново да са по-големи" — горните 4 таба (Kein Test/Ergometrie/...)
    // уголемени (padding + шрифт).
    tab: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#eef3f7'
    },

    tabActive: {
        backgroundColor: '#fff176',
        borderColor: '#c9a800'
    },

    tabText: {
        fontSize: 20,
        fontWeight: '600'
    },

    tabTextActive: {
        color: '#000'
    },

    body: {
        flex: 1,
        flexDirection: 'row',
        gap: 14
    },

    controlPanel: {
        width: 230,
        gap: 10
    },

    // 🔹 2026-08-21 (Claude) — DK: "бутоните в дясно и бутоните горе,
    // отново да са по-големи" — цялото ляво контролно табло (Automatik,
    // чекбокс, Trainings-Woche GESTALTEN, LEERE Tabellen, Standardwerte)
    // уголемено (padding + шрифт), за консистентност с горните табове.
    controlButton: {
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#ffffff',
        padding: 18
    },

    controlButtonText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center'
    },

    // 🔹 REHABILITATION/GESUNDHEITSSPORT/FREIZEITSPORT избраната опция —
    // същия жълт highlight конвенция като tabActive.
    controlButtonActive: {
        backgroundColor: '#fff176',
        borderColor: '#c9a800'
    },

    // 🔹 2026-08-25 (Claude) — "call-to-action" стил за "Trainings-Woche
    // GESTALTEN", докато полетата са заключени (grundeinstellung режим),
    // за да привлече вниманието на потребителя да го натисне.
    controlButtonAttention: {
        backgroundColor: '#fff3cd',
        borderColor: '#e6a700',
        borderWidth: 2
    },

    controlButtonHint: {
        fontSize: 13,
        fontStyle: 'italic',
        color: '#8a6d00',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 4
    },

    controlCheckboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#ffffff',
        padding: 16
    },

    controlCheckboxText: {
        fontSize: 17,
        flex: 1
    },

    checkboxGlyph: {
        fontSize: 28
    },

    standardwerteBox: {
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#eef3f7',
        padding: 12,
        gap: 10
    },

    standardwerteTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4
    },

    standardwerteButton: {
        borderWidth: 1,
        borderColor: '#7c9fb3',
        backgroundColor: '#fff176',
        paddingVertical: 14
    },

    standardwerteButtonText: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center'
    },

    // 🔹 2026-08-28 (Claude) — DK: скрийншот показва footerRow (Generate
    // fake data/Запази) и Page10.tsx-ния "ОБРАТНО КЪМ НАЧАЛНАТА СТРАНИЦА"
    // бутон, покриващи последните редове на активния таб (напр. "WNTZ"/
    // "Тренировъчен блок седмици" в Kein Test). Причина: `content` е
    // `flex:1` вътре в `body` (flex:1, flexDirection:'row') вътре в
    // `container` (flex:1) — активният таб компонент (Trainingsplan
    // KeinTest/Ergometrie/.../SpiroErgometrieComponent) НЯМА собствен
    // ScrollView, само plain Views, затова когато реалното му съдържание е
    // по-високо от наличното flex пространство, то прелива (default
    // overflow: visible) върху следващите sibling-и (footerRow тук, после
    // Page10.tsx-ния "назад" бутон), вместо да се scroll-ва. Same "min-
    // height:auto" механизъм като Page8.tsx/TestComponent4-6 бъговете, но
    // тук фиксът е различен: там децата вече си имаха собствен ScrollView
    // (просто родителят не го bound-ваше правилно) — тук няма никакъв
    // ScrollView, затова обвивам `content` в такъв (виж JSX-а по-долу),
    // вместо само overflow:hidden (което би отрязало редовете, вместо да
    // им позволи да се скролват).
    content: {
        flex: 1,
        minHeight: 0
    },

    contentScrollContainer: {
        flexGrow: 1,
        paddingBottom: 10
    },

    placeholder: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#777',
        padding: 20,
        textAlign: 'center'
    },

    footerRow: {
        flexDirection: 'row',
        gap: 14
    },

    fakeDataButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#2e7d32',
        backgroundColor: '#c8e6c9',
        paddingVertical: 16,
        alignItems: 'center'
    },

    fakeDataButtonText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#1b5e20'
    },

    // 🔹 2026-08-21 (Claude) — DK: Save бутон (виж коментара при saveNow()
    // по-горе защо) — синьо, за да се различава ясно от зеления
    // "Generate fake data".
    saveButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#0d47a1',
        backgroundColor: '#bbdefb',
        paddingVertical: 16,
        alignItems: 'center'
    },

    saveButtonText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#0d47a1'
    }

});
