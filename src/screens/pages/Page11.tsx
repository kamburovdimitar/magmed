// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass, part 3 (after the user
//   pointed out this screen — "PAGE 11 - LAKTAT" — was never wired to
//   LanguageUtil at all, unlike the Test-screen family): added new keys to
//   Translations.js and wired every hardcoded button title on this screen
//   (Save/Generate, Archive, Clear all data, Generate Fake Data From Test
//   Scenario, Toggle HR/Thresholds/Zones, Print Report, Open Report,
//   Patient Preview, Result Preview). "Generate Fake Data" reuses the
//   existing testdaten_generieren_text key; "Back" reuses
//   zurueck_zur_startseite_text since it does the same goTo('home') as
//   Page8's "Back to Home" button. Also fixed a pre-existing typo bug while
//   here: the reportMode-true button title was
//   'Back To Editттттттттттттттттт' (stray repeated Cyrillic т's) — now a
//   real, translated label.
// 2026-08-12 (Europe/Sofia) — Breaking-bug fix: since the New Test/Existing
//   Tests/Save feature turned `MDPatient.measurements` from a single
//   MDPatientMeasurements object into MDTestRecord[] (see MDPatient.tsx's
//   changelog), this screen's three write paths — save(), applyHistoryReport(),
//   saveIntoArchive_History() — were still doing
//   `updatedPatient.measurements.ergometry = ...` /
//   `.measurements.ergometryReports.push(...)` as if measurements were still
//   that single object. Against an array this either silently vanishes (an
//   `.ergometry` prop tacked onto an array isn't visible via .map()/.length,
//   confirmed by the Patient Preview panel showing "measurements: [0]" after
//   Save) or throws outright (`.ergometryReports` doesn't exist on an array,
//   so `.push()` on Archive was a TypeError waiting to happen). Fixed by
//   routing all three through new helpers (getOrCreateActiveTest/
//   getActiveTest/withErgometry) that read/write the *active* MDTestRecord's
//   `.data.ergometry` / `.data.ergometryReports` — `MDPatientMeasurements`
//   (the `.data` type) already had both fields from before this screen even
//   existed, so this is the correct new home for them, not a new shape.
//   Kept everything else about this screen's flow as-is (still fully local
//   component state, no Redux dispatch — that was already true before this
//   fix and is an out-of-scope, separate follow-up).
// 2026-08-12 (Europe/Sofia) — Redux wiring: the previous fix made this
//   screen's writes correct in *shape* (data.ergometry/data.ergometryReports
//   on the active MDTestRecord), but they still only ever landed in this
//   component's own local `dataPatient`/`previewPatient` state — never
//   dispatched, so navigating away and back lost every Save/Archive done
//   here (this was true even before the array refactor; just newly visible
//   now that we're deliberately unifying with Page8's flow). save(),
//   applyHistoryReport() and saveIntoArchive_History() now ALSO dispatch
//   into the SAME activeTestId/measurements Redux slice Page8's New
//   Test/Existing Tests/Save uses (createTest() first if none is active
//   yet, then saveActiveTest() with the merged MDPatientMeasurements) —
//   so a lactate test entered here is the same underlying test record you'd
//   see/continue on Page8, not an island. Kept the existing local
//   preview/getOrCreateActiveTest/withErgometry helpers for the right-hand
//   debug panels as-is (harmless, `dataPatient` re-syncs from the Redux
//   `selectedUser` on the next render anyway via the existing useEffect
//   below). Removed the now-unused local getActiveTest() helper — the
//   ErgometryHistoryComponent reports prop reads `reduxActiveTest` (the
//   Redux-selected active test) directly instead.
// ============================================

import { useEffect, useState } from "react";
import { View, StyleSheet, Button, ScrollView, Text, TextInput, TouchableOpacity, Modal } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil'
import HeaderComponent from '../../components/HeaderComponent'
import WorkloadRow from '../../components/WorkloadRowComponent'
import DatenerfassungList from '../../components/Lists/DatenerfassungComponentList'
import RechenverfahrenComponent from '../../components/RechenverfahrenComponent'
import AuswertungComponent from '../../components/AuswertungComponent'
import DetailAnalyseComponent from '../../components/DetailAnalyseComponent'
import { MDPatient } from "../../model/MDPatient";
import { MDTestRecord } from "../../model/MDTestRecord";
import { MDPatientMeasurements } from "../../model/MDPatientMeasurements";
import { MDErgometryReport } from "../../model/MDErgometryReport";
import { MDErgometry, MDErgometryRow } from "../../model/MDErgometry";
import { useSelector, useDispatch } from "react-redux";
import { createTest, saveActiveTest, renameActiveTest } from "../../store/userSlice";
import { ErgometryUtil } from "../../utils/ErgometrieUtil";
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil'
import LactateChartComponent from '../../components/LactateChartComponent'
import TrainingZonesOverlayComponent from '../../components/TrainingZonesOverlayComponent'
import ErgometrySummaryComponent from '../../components/ErgometrySummaryComponent'
import ErgometryHistoryComponent from '../../components/ErgometryHistoryComponent'
import TrainingsbereichComponent from '../../components/TrainingsbereichComponent'
import ConfirmDialogComponent from '../../components/ConfirmDialogComponent'
// 🔹 2026-08-26 (Claude) — DK: "печат трябва да имаме на всяка страница,
// която показва даден компонент — тренировка, измервания, лактатна крива."
// Тук показваме само лактатната секция (showTrainingSection={false}) — виж
// PrintReportComponent.tsx за пълния коментар/логика.
import PrintFullReportComponent from '../../components/PrintFullReportComponent'
// 🔹 2026-08-19 — DK: съобщението "не е добавена/запазена" трябва да е
// popup, не inline банер (виж archiv_kein_ergebnis_title_text по-долу) —
// същия глобален popup, който InfoPopUpComponent/App.tsx вече рендерват
// за инфо-иконките на другите Test компоненти.
import { openPopup } from '../../services/PopupService';
import { ErgometryModel } from "../../constants/ergometryModels"
import { ERGOMETRY_MODELS } from '../../constants/ergometryModels';
import { trainingZonesScenarios } from '../../tests/utils/trainingZonesScenarios'
import { getVisibleZones } from '../../tests/utils/trainingZonesScenarios'
import { generateFromScenario } from '../../utils/ErgometrieScenarioUtil';
// 🔹 2026-08-18 — LaktatkurveRechenverfahrenComponent (3.32-placeholder)
// вече не се рендира тук (DK поиска таб 2 да показва точно 3.32
// Datenerfassung/Auswertung) — файлът остава на диска, само вносът е
// премахнат, за да няма мъртъв внос. Виж LaktatkurveAuswertungComponent.
import LaktatkurveAuswertungComponent from '../../components/LaktatkurveAuswertungComponent';
// 🔹 2026-08-18 (2) — DK качи "3.34 CCC Laktatkurve und Trainingsbereich" и
// поиска таб 3 ("Trainingsbereich") да показва точно тази спецификация.
// Не преоткриваме логика тук — LaktatkurveTrainingsbereichComponent вече
// съществуваше (композира TrainingZonesOverlayComponent + вече тествания
// TrainingsbereichComponent/calculateTrainingZoneTable, който изчислява
// точно каскадата от PDF-а: % от IANS-HF → HF граница → lookup по реалната
// крива → Watt/pace, НЕ проста % от Watt), само беше изключен от таба.
import LaktatkurveTrainingsbereichComponent from '../../components/LaktatkurveTrainingsbereichComponent';
// 🔹 2026-08-18 (3) — DK качи "3.36 CCC Laktatkurve überlagern" и поиска
// таб 4 ("Rechenverfahren" слотът) да показва тази спецификация вече (PDF-а
// на самия него е озаглавен "überlagern", не "Rechenverfahren" — но табовете
// са само провизорни placeholder етикети, DK пълни следващия свободен слот
// с всяка нова PDF спецификация, методично, една по една).
// V1 обхват (вече изграден по-рано тази сесия, само не беше окачен на таб):
// чек-лист archive записи на ТОЗИ пациент (най-нов пръв), absolute/normierte
// (%IANS) превключвател, цвят по хронология + по-дебела активна крива при
// hover, пълна IAS/IANS таблица (Watt|S-min|mmol·l за двете точки — виж
// разширението в самия компонент). НЕ включено още (следващи стъпки):
// Herzfrequenzkurven/Trainingszonen/TestDatum/Schwellenwerte/Schwellenlinien
// toggle бутоните от дясно, ZURÜCK/Dialog/Auswertung/DatenErfassung
// навигацията, крос-пациентско наслагване, outlier "Glühwürmchen" маркери,
// hover-fade на другите криви и tooltip-ите на IAS/IANS точките.
import LaktatkurveUeberlagernComponent from '../../components/LaktatkurveUeberlagernComponent';





// 🔹 Това е UI тип (таблицата за въвеждане)
// ⚠️ Тук стойностите са string (за input полета)
type RowType = {
    stage: number       // Stufe = етап
    time: string        // Zeitpunkt = време
    load: number        // Watt = мощност
    hf: string          // HF = пулс (string в UI)
    lactate: string     // Laktat = лактат (string в UI)
}

// 🔹 2026-08-18 (Europe/Sofia) — DK уточни: 4-те бутона (Current/Überlagern/
// Trainingsbereich/Rechenverfahren) трябва да са на HEADER ниво (в
// HomeScreen.js, под главните 14 икон-бутона), НЕ заровени долу вътре в
// Page11-ния scroll. HomeScreen вече рендира тези 4 бутона (виж
// LACTATE_SUB_NAV_ITEMS там) само докато page === 'page11', и подава
// избрания под-изглед тук като `activeChartView` prop. Page11 вече НЕ
// управлява това състояние сам — просто чете пропа (с fallback 'current',
// ако някой го рендира без него).
export default function Page11({ goTo, activeChartView: propActiveChartView, onChartViewChange }: any) {

    const [showTrainingZones, setShowTrainingZones] = useState(true);

    const [showThresholdLines, setShowThresholdLines] = useState(true);

    const [showThresholdLabels, setShowThresholdLabels] = useState(true);

    const [showHeartRateCurve, setShowHeartRateCurve] = useState(true);

    const [reportMode, setReportMode] =
        useState(false);

    // 'current' | 'ueberlagern' | 'trainingsbereich' | 'rechenverfahren' —
    // подадено отвън (HomeScreen.js); fallback за безопасност.
    const activeChartView = propActiveChartView || 'current';

    // 🔹 Взимаме избрания пациент от Redux
    const selectedUser = useSelector((state) => state.user.selectedUser);

    const dispatch = useDispatch();

    // 🔹 Същият activeTestId/measurements, който Page8's New Test/Existing
    // Tests/Save управлява — save()/applyHistoryReport()/
    // saveIntoArchive_History() по-долу пишат тук, не само в локалния
    // dataPatient, за да не се губят при навигация настрани.
    const reduxActiveTestId = useSelector(
        (state) => state.user.selectedUser?.activeTestId
    );

    const reduxMeasurements = useSelector(
        (state) => state.user.selectedUser?.measurements
    ) ?? [];

    const reduxActiveTest =
        reduxMeasurements.find(
            (t) => t.id === reduxActiveTestId
        ) ?? null;

    // 🔹 Локален пациент (копие, с което работим)
    const [dataPatient, setDataPatient] = useState({} as MDPatient);

    // 🔹 Preview на финалния обект
    // 🔹 Preview на финалния обект
    const [previewPatient, setPreviewPatient] =
        useState<MDPatient | null>(null);

    // 🔥 Result Preview
    const [resultPreview, setResultPreview] = useState<any>(null);

    // 🔹 2026-08-19 — DK: "Patient Preview" и "Result Preview" вече не са
    // постоянно видими inline JSON-дървета долу в десния panel — вместо
    // това 2 бутона, всеки отваря fullscreen popup (Modal), само когато е
    // нужно да се погледне. 'patient' | 'result' | null.
    const [previewModalType, setPreviewModalType] =
        useState<'patient' | 'result' | null>(null);

    // 🔹 Plausibilitätsprüfung съобщение (виж checkLoadPlausibility по-долу)
    const [plausibilityWarning, setPlausibilityWarning] = useState<string | null>(null);


    // 🔹 Save vs Update семантика за Archive бутона: id-то на archive
    // записа, който текущите данни в момента "представляват" — сетва се
    // от applyHistoryReport (зареждаш стар запис) или от предишен
    // saveIntoArchive_History (вече си архивирал веднъж). Докато е сетнат,
    // Archive UPDATE-ва СЪЩИЯ запис вместо да трупа дубликати. Нулира се
    // при clearData()/нов fake сценарий — тогава Archive пак прави НОВ.
    const [loadedReportId, setLoadedReportId] = useState<string | null>(null);

    // 🔹 2026-08-18 — "3.32 CCC Laktat Datenerfassung und Auswertung": нужно
    // за Watt/kg колоната в новата AUSWERTUNG таблица
    // (LaktatkurveAuswertungComponent.tsx). За разлика от
    // trainingZonePercents по-долу, това Е реални пациентски данни, не
    // "what-if" — затова СЕ персистира в MDPatientMeasurements.weightkg
    // (виж save() по-долу, явно писано, по същия принцип като
    // loadedReportId), хидратира се от Redux в useEffect-а по-долу.
    const [weightKg, setWeightKg] = useState<number | null>(null);

    // 🔹 2026-08-26 (Claude) — печат на лактатната крива (виж коментара
    // при PrintReportComponent import-а по-горе).
    const [showPrintReport, setShowPrintReport] = useState(false);

    // 🔹 Trainingsbereich (Phase 3, "3.34 CCC Laktatkurve und
    // Trainingsbereich"): override % thresholds за REG/GA1/GA2/E1 —
    // редактируеми директно в TrainingsbereichComponent-ната таблица ИЛИ
    // чрез влачене на границите на самата графика (LactateChartComponent's
    // onZonePercentChange). null = ползвай spec default-ите (75/85/95/105).
    // Съзнателно НЕ се персистира в Redux/MDPatientMeasurements — това е
    // "what-if" изглед върху текущата крива, не измерени данни; нулира се
    // при нов тест/сценарий и при unmount (смяна на таб), точно както
    // "Zurücksetzen" бутона на самата функция очаква да работи.
    const [trainingZonePercents, setTrainingZonePercents] = useState<any>(null);

    function resetTrainingZonePercents() {
        setTrainingZonePercents(null);
    }

    function handleZonePercentChange(key: string, percent: number) {
        setTrainingZonePercents((prev: any) => ({
            ...(prev || {}),
            [key]: percent
        }));
    }

    useEffect(() => {

        if (!selectedUser) return;

        // 🔹 Зареждаме пациента
        setDataPatient(selectedUser as MDPatient);

    }, [selectedUser]);

    // 🔹 Rechenverfahren = метод на изчисление
    // 👉 кой алгоритъм ще използваме
    const [model, setModel] = useState<ErgometryModel>(ERGOMETRY_MODELS.DICKHUTH);


    // 🔹 Това е таблицата, която user-а попълва
    const [data, setData] = useState<RowType[]>(createInitialRows())

    // 🔹 Тип на теста (bike / run)
    const [type, setType] = useState<'bike' | 'run'>('bike')

    // 🔹 Belastungsprotokoll = настройки на натоварването

    // 🚴 Bike
    const [startLoad, setStartLoad] = useState('')
    const [powerIncrement, setPowerIncrement] = useState('')
    const [powerTimeStep, setPowerTimeStep] = useState('')

    // 🏃 Run / Treadmill
    const [runStartLoad, setRunStartLoad] = useState('')
    const [runPowerIncrement, setRunPowerIncrement] = useState('')
    const [runPowerTimeStep, setRunPowerTimeStep] = useState('')

    // 🔹 Име на активния тест — показва се/редактира се в header-а по-долу
    // (виж JSX-а), хидратира се в същия ефект като ергометрията, за да е
    // винаги в синхрон с това кой тест реално е активен.
    const [nameDraft, setNameDraft] = useState('');

    // 🔹 Хидратация от Redux при mount / смяна на активния тест.
    // HomeScreen.js рендира само една страница наведнъж (условен render,
    // не hide/show) — при превключване на таб Page11 се UNMOUNT-ва
    // напълно и целият локален state по-горе (data/type/model/startLoad/
    // .../runPowerTimeStep) се губи. Без този ефект той се връща на
    // hardcoded defaults (bike / Dickhuth / 10 празни реда) вместо на
    // вече запазеното в Redux — това е причината данните да изглеждат
    // "изгубени" при връщане на Page11, въпреки че save()/Redux частта
    // работи коректно. Ключ е само reduxActiveTestId (не целия
    // reduxActiveTest), за да не презаписваме локалните промени всеки
    // път, когато Save обнови reduxMeasurements — същия принцип като
    // Page8.tsx.
    useEffect(() => {

        const ergometry = reduxActiveTest?.data?.ergometry;

        if (ergometry) {
            applyErgometryToLocalState(ergometry);
        }

        setNameDraft(reduxActiveTest?.name ?? '');

        // 🔹 loadedReportId също е локален state, който Page11 губи при
        // unmount (tab switch) — хидратираме го от персистнатото в Redux
        // (виж полето в MDPatientMeasurements.tsx)
        setLoadedReportId(reduxActiveTest?.data?.loadedReportId ?? null);

        // 🔹 same reason — weightKg е реални пациентски данни, не бива да
        // се губи при tab switch (виж коментара при декларацията му).
        setWeightKg(
            reduxActiveTest?.data?.weightkg
                ? Number(reduxActiveTest.data.weightkg)
                : null
        );

    }, [reduxActiveTestId]);

    // 🔹 commit header name edit to Redux (on blur, not per keystroke) —
    // same renameActiveTest reducer Page8.tsx's header uses, single source
    // of truth, so a rename made on either screen shows up on the other.
    function handleRenameTest() {

        if (!reduxActiveTestId) return;

        dispatch(renameActiveTest(nameDraft));

    }

    function handleSetType(val: 'bike' | 'run') {
        setType(val)
    }

    // 🚴 Bike handlers

    function handleWatPower(value: string) {

        // 🔹 Нулираме run стойностите
        setRunStartLoad('')

        setStartLoad(value);
    }

    function handleWatIncrement(value: string) {

        // 🔹 Нулираме run стойностите
        setRunPowerIncrement('')

        setPowerIncrement(value);
    }

    function handleWatDuration(value: string) {

        // 🔹 Нулираме run стойностите
        setRunPowerTimeStep('')

        setPowerTimeStep(value);
    }

    // 🏃 Run handlers

    function handleRunPower(value: string) {

        // 🔹 Нулираме bike стойностите
        setStartLoad('')

        setRunStartLoad(value);
    }

    function handleRunIncrement(value: string) {

        // 🔹 Нулираме bike стойностите
        setPowerIncrement('')

        setRunPowerIncrement(value);
    }

    function handleRunDuration(value: string) {

        // 🔹 Нулираме bike стойностите
        setPowerTimeStep('')

        setRunPowerTimeStep(value);
    }

    // 🔹 Render object helper
    function renderObject(
        obj: any,
        level = 0
    ): any {

        // 🔹 null / undefined
        if (
            obj === null ||
            obj === undefined
        ) {
            return null;
        }

        const paddingLeft =
            level * 12;

        /**
         * 🔹 primitive renderer
         */
        function renderPrimitive(
            label: string,
            value: any,
            key: string
        ) {

            return (

                <View
                    key={key}
                    style={{
                        flexDirection: 'row',
                        paddingLeft,
                        marginBottom: 2,
                        flexWrap: 'wrap'
                    }}
                >

                    <Text
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        {label}:
                    </Text>

                    <Text>
                        {' '}
                        {String(value)}
                    </Text>

                </View>
            );
        }

        /**
         * 🔹 primitive root
         */
        if (
            typeof obj !== 'object'
        ) {

            return renderPrimitive(
                'value',
                obj,
                `primitive-${level}`
            );
        }

        /**
         * 🔹 root array
         */
        if (Array.isArray(obj)) {

            return obj.map(
                (item, index) => {

                    // 🔹 primitive array item
                    if (
                        typeof item !== 'object' ||
                        item === null
                    ) {

                        return (

                            <View
                                key={index}
                                style={{
                                    paddingLeft,
                                    marginBottom: 4
                                }}
                            >

                                <Text>
                                    • {String(item)}
                                </Text>

                            </View>
                        );
                    }

                    // 🔹 object array item
                    return (

                        <View
                            key={index}
                            style={{
                                paddingLeft,
                                marginBottom: 6,
                                borderLeftWidth: 2,
                                borderColor: '#999',
                                paddingVertical: 4,
                                marginLeft: 6
                            }}
                        >

                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: 4
                                }}
                            >
                                [{index}]
                            </Text>

                            {
                                renderObject(
                                    item,
                                    level + 1
                                )
                            }

                        </View>
                    );
                }
            );
        }

        /**
         * 🔹 object
         */
        return Object.keys(obj).map(
            (key) => {

                const value =
                    obj[key];

                // 🔹 skip functions
                if (
                    typeof value === 'function'
                ) {
                    return null;
                }

                /**
                 * 🔹 nested object
                 */
                if (
                    typeof value === 'object' &&
                    value !== null &&
                    !Array.isArray(value)
                ) {

                    return (

                        <View
                            key={key}
                            style={{
                                paddingLeft,
                                marginBottom: 4
                            }}
                        >

                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    marginTop: 6,
                                    color: '#1565C0'
                                }}
                            >
                                {key}
                            </Text>

                            {
                                renderObject(
                                    value,
                                    level + 1
                                )
                            }

                        </View>
                    );
                }

                /**
                 * 🔹 arrays
                 */
                if (
                    Array.isArray(value)
                ) {

                    return (

                        <View
                            key={key}
                            style={{
                                paddingLeft,
                                marginBottom: 6
                            }}
                        >

                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: '#2E7D32'
                                }}
                            >
                                {key}: [{value.length}]
                            </Text>

                            {
                                value.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        // 🔹 primitive item
                                        if (
                                            typeof item !== 'object' ||
                                            item === null
                                        ) {

                                            return (

                                                <View
                                                    key={index}
                                                    style={{
                                                        marginLeft: 10,
                                                        marginTop: 4
                                                    }}
                                                >

                                                    <Text>
                                                        • {String(item)}
                                                    </Text>

                                                </View>
                                            );
                                        }

                                        // 🔹 object item
                                        return (

                                            <View
                                                key={index}
                                                style={{
                                                    marginLeft: 10,
                                                    marginTop: 4,
                                                    padding: 6,
                                                    borderLeftWidth: 2,
                                                    borderColor: '#999'
                                                }}
                                            >

                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        marginBottom: 4
                                                    }}
                                                >
                                                    [{index}]
                                                </Text>

                                                {
                                                    renderObject(
                                                        item,
                                                        level + 1
                                                    )
                                                }

                                            </View>
                                        );
                                    }
                                )
                            }

                        </View>
                    );
                }

                /**
                 * 🔹 primitive value
                 */
                return renderPrimitive(
                    key,
                    value,
                    key
                );
            }
        );
    }

    // 🔹 sourceData по избор (default = локалния `data` state) — save()
    // подава изрично трим-натия масив (без непълния последен ред), защото
    // setData(...) е асинхронен и `data` closure-а още не би отразил
    // трима до следващия render.
    function buildRows(sourceData: RowType[] = data) {

        const rows: MDErgometryRow[] = [];

        for (let i = 0; i < sourceData?.length; i++) {

            rows.push({
                stage: sourceData[i].stage,
                time: sourceData[i].time,
                load: sourceData[i].load,
                hf: Number(sourceData[i].hf),
                lactate: Number(sourceData[i].lactate)
            });
        }

        return rows;
    }

    // 🔹 Eingabelogik (PDF "3.32CCC_Laktat_Datenerfassung_und_Auswertung") и
    // Plausibilitätsprüfung — 2026-08-14: извадени в ErgometrieUtil.js
    // (ErgometryUtil.stripIncompleteLastRow/checkLoadPlausibility) за да
    // могат да се unit-тестват директно, без да се рендира цялата страница.
    // Тънки wrapper-и тук само за да не се пипа всяко извикване по-долу.
    function stripIncompleteLastRow(sourceData: RowType[]): RowType[] {
        return ErgometryUtil.stripIncompleteLastRow(sourceData);
    }

    function checkLoadPlausibility(rows: MDErgometryRow[]): string | null {
        return ErgometryUtil.checkLoadPlausibility(rows, LanguageUtil.getName);
    }

    // 🔹 Returns {measurements, activeTestId, idx} — the active test's index
    // in a *cloned* measurements array, creating a blank MDTestRecord first
    // (and making it active) if none exists yet. Never mutates `patient`.
    function getOrCreateActiveTest(patient: MDPatient) {

        let measurements = [...(patient.measurements ?? [])];

        let activeTestId = patient.activeTestId;

        let idx = measurements.findIndex(
            (t) => t.id === activeTestId
        );

        if (idx === -1) {

            const now = new Date().toISOString();

            const newTest = new MDTestRecord({
                id: Date.now().toString(),
                createdAt: now,
                updatedAt: now
            });

            measurements = [...measurements, newTest];

            idx = measurements.length - 1;

            activeTestId = newTest.id;
        }

        return { measurements, activeTestId, idx };
    }

    // 🔹 Returns a NEW MDPatient with `ergometry` written into the active
    // test's `data.ergometry` — replaces the old (broken, pre-array-refactor)
    // `updatedPatient.measurements.ergometry = ergometry` one-liner.
    function withErgometry(patient: MDPatient, ergometry: MDErgometry): MDPatient {

        const { measurements, activeTestId, idx } =
            getOrCreateActiveTest(patient);

        const updatedData = new MDPatientMeasurements({
            ...measurements[idx].data,
            ergometry
        });

        measurements[idx] = new MDTestRecord({
            ...measurements[idx],
            data: updatedData,
            updatedAt: new Date().toISOString()
        });

        return new MDPatient({
            ...patient,
            measurements,
            activeTestId
        });
    }

    function save() {

        // 🔹 Eingabelogik: автоматично трием непълния последен ред (HF И
        // Laktat едновременно празни), ако има такъв, при всяко "Auswertung"
        // (тук: save()). workingData е новият масив; setData(...) го
        // записва за UI-то, но е асинхронен — затова build-ваме rows от
        // workingData директно, не чакаме следващия render.
        const workingData = stripIncompleteLastRow(data);

        if (workingData !== data) {
            setData(workingData);
        }

        // 🔹 Конвертираме UI данните → към модел (string → number)
        const rows = buildRows(workingData);

        // 🔹 Plausibilitätsprüfung: Belastung трябва да расте stufenweise —
        // не блокира изчислението, само показва предупреждение
        setPlausibilityWarning(checkLoadPlausibility(rows));

        // 🔹 Създаваме ергометрия (модел)
        const ergometry = new MDErgometry({
            type,
            startLoad: Number(type === 'bike' ? startLoad : runStartLoad),
            increment: Number(type === 'bike' ? powerIncrement : runPowerIncrement),
            timeStep: Number(type === 'bike' ? powerTimeStep : runPowerTimeStep),
            model: model,
            data: rows
        });

        // 🔹 Вкарваме ергометрията в активния тест (measurements е масив —
        // виж withErgometry по-горе) и получаваме нов пациент (без mutation)
        const updatedPatient = withErgometry(dataPatient, ergometry);

        // 🔹 Preview в десния панел
        setPreviewPatient(updatedPatient);

        // 🔹 Commit в Redux — същият activeTestId/measurements, който Page8
        // управлява. Ако още няма активен тест, createTest() го създава
        // първо (dispatch-ите са синхронни, saveActiveTest по-долу винаги
        // уцелва правилния запис, защото reducer-ът чете свежото state сам).
        if (!reduxActiveTestId) {
            dispatch(createTest());
        }

        dispatch(
            saveActiveTest(
                new MDPatientMeasurements({
                    ...(reduxActiveTest?.data ?? new MDPatientMeasurements()),
                    ergometry,
                    // 🔹 явно пишем текущия local state, не разчитаме на
                    // spread-а по-горе — иначе след clearData()
                    // (loadedReportId → null локално) старата стойност от
                    // Redux щеше да "оцелее" тук и да се появи пак при
                    // следващ remount (виж коментара на полето в
                    // MDPatientMeasurements.tsx)
                    loadedReportId,
                    // 🔹 2026-08-18 — същия принцип: явно пишем текущия
                    // local weightKg state, за да се запази в модела (DK:
                    // "когато пишем по обекта, да го сейваме в него").
                    weightkg: weightKg ?? 0
                })
            )
        );

        let result: any;

        if (model === ERGOMETRY_MODELS.DICKHUTH) {
            result = ErgometryModelsUtil.calculateDickhuth(rows);
        }

        if (model === ERGOMETRY_MODELS.FREIBURG) {
            result = ErgometryModelsUtil.calculateFreiburg(rows);
        }

        if (model === ERGOMETRY_MODELS.LINEAR) {
            result = ErgometryModelsUtil.calculateLinear(rows);
        }

        if (model === ERGOMETRY_MODELS.LTP) {
            result = ErgometryModelsUtil.calculateLTP(rows);
        }


        if (model === ERGOMETRY_MODELS.KEUL) {
            // 🔹 type ('bike'/'run') определя кой tangent slope се ползва
            // за IANS/LPT2 (0.055 за Watt, 1.26 за km/h) — виж коментара
            // в ErgometryModelsUtil.js за детайли/PDF референция.
            result = ErgometryModelsUtil.calculateKeul(rows, type);
            console.log("KEUL RESULT");
            console.log(result);

        }

        if (model === ERGOMETRY_MODELS.KEUL_LEGACY) {
            result = ErgometryModelsUtil.calculateMaxSlopeMethodKeulLegacy(rows);
        }


        // 🔹 example values
        const hfMax = 190;
        const hfRest = 60;

        // 🔹 max watt from test
        const maxLoad =
            rows[rows.length - 1]?.load || 0;

        // 🔹 IAS
        if (result?.IASPoint) {

            result.IASPoint.hfPercent = ErgometryModelsUtil.calculateHFPercent(result.IASPoint.hf, hfMax);

            result.IASPoint.pmaxPercent = ErgometryModelsUtil.calculatePmaxPercent(result.IASPoint.load, maxLoad);

            result.IASPoint.hrrPercent = ErgometryModelsUtil.calculateHRRPercent(result.IASPoint.hf, hfRest, hfMax);
        }

        // 🔹 IANS
        if (result?.IANSPoint) {

            result.IANSPoint.hfPercent = ErgometryModelsUtil.calculateHFPercent(result.IANSPoint.hf, hfMax);

            result.IANSPoint.pmaxPercent = ErgometryModelsUtil.calculatePmaxPercent(result.IANSPoint.load, maxLoad);

            result.IANSPoint.hrrPercent = ErgometryModelsUtil.calculateHRRPercent(result.IANSPoint.hf, hfRest, hfMax);
        }

        const interpretation = ErgometryModelsUtil.generateInterpretation(result);



        if (result) {
            result.interpretation = interpretation;
            result.model = model;
        }

        //Пусни и гледай дали логът стане:



        // 🔥 update result preview
        setResultPreview(result);

        // 🔹 2026-08-19 — DK: "Save/Generate" и "Add"/"Archive" бяха 2
        // отделни бутона/стъпки — точно това причиняваше "цъкам Add, не се
        // сейва в листа": ако редактираш данните СЛЕД Save/Generate (или
        // изобщо пропуснеш да го цъкнеш), Add archive-ваше стар/липсващ
        // resultPreview state (React state е асинхронен, а resultPreview
        // тук горе тепърва се сетва). Вече няма отделен Archive бутон —
        // едно цъкване computва СВЕЖ result (тук, локална променлива, не
        // state) И директно го подава на persistArchiveEntry, което го
        // персистира веднага, без да минава през resultPreview state race.
        persistArchiveEntry(result, ergometry, rows);

        const validation = ErgometryUtil.validateResult(result);
        console.log(
            ErgometryUtil
                .validateAllModels(
                    rows,
                    type
                )
        );

        console.log(validation);

        console.log(result);

        // UI data
        // ↓
        // rows
        // ↓
        // ergometry object
        // ↓
        // patient
        // ↓
        // calculateDickhuth(rows)
        // ↓
        // threshold result

        console.log(result)

    }

    // 🔹 Хидратира локалния UI state (data/type/model/startLoad/...) от
    // произволен MDErgometry обект. Извадено от applyHistoryReport, за да
    // може да се ползва и от mount-time ефекта по-долу (виж коментара там
    // защо е нужно — HomeScreen.js unmount-ва Page11 при смяна на таб).
    function applyErgometryToLocalState(ergometry: any) {
        setType(ergometry.type);
        setModel(ergometry.model || ERGOMETRY_MODELS.DICKHUTH);

        if (ergometry.type === 'bike') {
            setStartLoad(String(ergometry.startLoad));
            setPowerIncrement(String(ergometry.increment));
            setPowerTimeStep(String(ergometry.timeStep));

            setRunStartLoad('');
            setRunPowerIncrement('');
            setRunPowerTimeStep('');
        } else {
            setRunStartLoad(String(ergometry.startLoad));
            setRunPowerIncrement(String(ergometry.increment));
            setRunPowerTimeStep(String(ergometry.timeStep));

            setStartLoad('');
            setPowerIncrement('');
            setPowerTimeStep('');
        }

        setData(
            ergometry.data.map((row: any) => ({
                stage: row.stage,
                time: row.time,
                load: row.load,
                hf: String(row.hf),
                lactate: String(row.lactate)
            }))
        );
    }

    function applyHistoryReport(report: any) {
        const ergometry = report.ergometry;

        applyErgometryToLocalState(ergometry);

        setResultPreview(report.result);

        // 🔹 measurements е масив (MDTestRecord[]) — виж withErgometry
        const updatedPatient = withErgometry(dataPatient, ergometry);

        setPreviewPatient(updatedPatient);

        // 🔹 Applying a historical report also makes it the current/active
        // ergometry — commit в Redux, същия activeTestId/measurements
        if (!reduxActiveTestId) {
            dispatch(createTest());
        }

        dispatch(
            saveActiveTest(
                new MDPatientMeasurements({
                    ...(reduxActiveTest?.data ?? new MDPatientMeasurements()),
                    ergometry,
                    // 🔹 текущите данни вече "представляват" точно този
                    // archive запис — виж loadedReportId в
                    // MDPatientMeasurements.tsx
                    loadedReportId: report.id
                })
            )
        );

        // 🔹 текущите данни вече "представляват" точно този archive запис —
        // следващ Archive го update-ва, вместо да създава дубликат
        setLoadedReportId(report.id);

        // 🔹 нов зареден тест — Trainingsbereich override-ите от предишния
        // не бива да "изтекат" върху него
        resetTrainingZonePercents();
    }

    function createInitialRows(): RowType[] {

        const rows: RowType[] = [];

        for (let i = 0; i < 10; i++) {

            rows.push({
                stage: i,
                time: '00:00',
                load: 0,
                hf: '',
                lactate: ''
            });
        }

        return rows;
    }

    function clearData() {

        setStartLoad('');
        setPowerIncrement('');
        setPowerTimeStep('');

        setRunStartLoad('');
        setRunPowerIncrement('');
        setRunPowerTimeStep('');

        setData(createInitialRows());

        setPreviewPatient(null);

        setResultPreview(null);

        setReportMode(false);

        // 🔹 чиста маса — следващ Archive трябва да прави НОВ запис, не да
        // update-ва каквото беше заредено преди clearData()
        setLoadedReportId(null);

        resetTrainingZonePercents();
    }

    async function generateFakeData() {

        const fake = ErgometryUtil.generateFakeErgometry();
        await continueLogic(fake)
    }

    async function continueLogic(fake) {

        // 🔹 нов синтетичен сценарий — не е продължение на вече заредения
        // archive запис, следващ Archive трябва да прави НОВ, не update
        setLoadedReportId(null);

        resetTrainingZonePercents();

        // 🔹 type
        setType(fake.type);

        // 🔹 model
        setModel(fake.model);

        // 🔹 protocol
        if (fake.type === 'bike') {

            setStartLoad(String(fake.startLoad));
            setPowerIncrement(String(fake.increment));
            setPowerTimeStep(String(fake.timeStep));

            // clear run
            setRunStartLoad('');
            setRunPowerIncrement('');
            setRunPowerTimeStep('');
        }
        else {

            setRunStartLoad(String(fake.startLoad));
            setRunPowerIncrement(String(fake.increment));
            setRunPowerTimeStep(String(fake.timeStep));

            // clear bike
            setStartLoad('');
            setPowerIncrement('');
            setPowerTimeStep('');
        }

        // 🔹 rows → UI
        const uiRows: RowType[] = [];

        for (let i = 0; i < fake?.data?.length; i++) {

            uiRows.push({

                stage: fake.data[i].stage,

                time: fake.data[i].time,

                load: fake.data[i].load,

                hf: String(fake.data[i].hf),

                lactate: String(fake.data[i].lactate)
            });
        }

        setData(uiRows);

    }

    async function generateFakeDataFromTestScenario() {

        const fake =
            generateFromScenario(
                'normalBike'
            );

        const zoneScenario =
            trainingZonesScenarios[2];

        fake.chartStart =
            zoneScenario.chartStart;

        console.log("временно", fake.chartStart);

        fake.visible =
            getVisibleZones(
                zoneScenario.chartStart
            );

        await continueLogic(fake);

        save();
    }

    // 🔹 2026-08-19 — DK: попада ли резултатът извън изискванията на
    // избрания метод (напр. LTP изисква поне 6 реда, Linear/Keul поне 3),
    // popup-ът вече казва КОНКРЕТНО защо, не просто generic текст. Ако
    // моделът няма изрично минимално изискване тук (Dickhuth/Freiburg —
    // и двата само проверяват за празен масив), пада се на общата причина.
    function buildArchiveFailureReason(rows: any[]) {

        const minRowsByModel: any = {
            [ERGOMETRY_MODELS.LINEAR]: 3,
            [ERGOMETRY_MODELS.KEUL]: 3,
            [ERGOMETRY_MODELS.LTP]: 6,
            [ERGOMETRY_MODELS.KEUL_LEGACY]: 2
        };

        const minRows = minRowsByModel[model];

        const validRowsCount =
            (rows || []).filter(
                (r: any) =>
                    !isNaN(Number(r?.load)) &&
                    !isNaN(Number(r?.lactate)) &&
                    Number(r?.lactate) > 0
            ).length;

        if (minRows && validRowsCount < minRows) {
            return (
                LanguageUtil.getName('archiv_grund_zu_wenig_daten_text') +
                ` (${validRowsCount}/${minRows})`
            );
        }

        return LanguageUtil.getName('archiv_grund_allgemein_text');
    }

    // 🔹 2026-08-19 — DK: "Save/Generate" и отделния "Archive"/"Add" бутон
    // се сляха в едно цъкване (виж save() по-горе) — вече не отделна
    // функция, викана от собствен бутон, а помощна функция, викана В КРАЯ
    // на save(), със СВЕЖО изчисления `result`/`ergometry`/`rows` (подадени
    // директно като параметри, не през resultPreview state — избягва race-а
    // с React-ния асинхронен setState, който причиняваше "Add archive-ва
    // стар/липсващ резултат"). Ако result е невалиден — popup с конкретна
    // причина (DK: "съобщението да бъде поп ъп, с причината"), вместо
    // тихо да не прави нищо.
    function persistArchiveEntry(result: any, ergometry: any, rows: any) {

        if (!result) {
            openPopup({
                title: LanguageUtil.getName('archiv_kein_ergebnis_title_text'),
                description: buildArchiveFailureReason(rows)
            });
            return;
        }

        // 🔹 Save vs Update: извадено в ErgometryUtil.resolveArchiveSaveOrUpdate
        // (2026-08-14, за unit-тестваемост) — ако текущите данни идват от
        // вече архивиран report (loadedReportId, сетнат от
        // applyHistoryReport или от предишен Add) И той все още съществува
        // в списъка, UPDATE-ва СЪЩИЯ запис (пази id, освежава
        // ergometry/result/createdAt) вместо да трупа дубликат при всяко
        // цъкване. Ако няма такъв (нов тест/сценарий, или clearData() го е
        // нулирал) — създава нов запис, точно както преди.
        const reduxCurrentData =
            reduxActiveTest?.data ?? new MDPatientMeasurements();

        const existingReports = reduxCurrentData.ergometryReports ?? [];

        const nowIso = new Date().toISOString();

        const { reportId, updatedReports } = ErgometryUtil.resolveArchiveSaveOrUpdate({
            existingReports,
            loadedReportId,
            buildUpdatedReport: (existing: any) => new MDErgometryReport({
                ...existing,
                ergometry,
                result,
                createdAt: nowIso
            }),
            buildNewReport: () => new MDErgometryReport({
                id: Date.now().toString(),
                createdAt: nowIso,
                ergometry,
                result
            })
        });

        // 🔹 measurements е масив (MDTestRecord[]) — вкарваме report-а в
        // ergometryReports[] на активния тест (findOrCreate + immutable
        // update), вместо старото `.measurements.ergometryReports.push(...)`
        // което гърмеше с TypeError, защото масив няма такова поле.
        const {
            measurements,
            activeTestId,
            idx
        } = getOrCreateActiveTest(dataPatient);

        const currentData =
            measurements[idx].data ?? new MDPatientMeasurements();

        const updatedData = new MDPatientMeasurements({
            ...currentData,
            ergometry,
            weightkg: weightKg ?? 0,
            ergometryReports: updatedReports,
            loadedReportId: reportId
        });

        measurements[idx] = new MDTestRecord({
            ...measurements[idx],
            data: updatedData,
            updatedAt: new Date().toISOString()
        });

        const updatedPatient = new MDPatient({
            ...dataPatient,
            measurements,
            activeTestId
        });

        // 🔹 update state
        setDataPatient(updatedPatient);

        // 🔹 Commit в Redux — иначе архивираният report изчезва при
        // навигация настрани (setDataPatient по-горе е само локално copy).
        // 🔹 явно пишем и ergometry/weightkg тук (не само чрез spread-а на
        // reduxCurrentData) — reduxCurrentData е "замразен" отпреди това
        // цъкване (React state hooks не се обновяват в средата на един
        // синхронен onPress), затова само spread-vaйки го щеше да върне
        // ergometry-то към старата стойност и да изгуби това, което save()
        // тъкмо изчисли в СЪЩОТО цъкване.
        if (!reduxActiveTestId) {
            dispatch(createTest());
        }

        dispatch(
            saveActiveTest(
                new MDPatientMeasurements({
                    ...reduxCurrentData,
                    ergometry,
                    weightkg: weightKg ?? 0,
                    ergometryReports: updatedReports,
                    loadedReportId: reportId
                })
            )
        );

        // 🔹 запомняме кой archive запис точно представляват текущите
        // данни — следващо Add/Save ще го update-не пак, вместо да създава нов
        setLoadedReportId(reportId);
    }

    // 🔹 Изтрива архивиран report от ergometryReports[] на активния тест.
    // Чете/пише директно в Redux (reduxActiveTest), не в локалния
    // dataPatient — ErgometryHistoryComponent-ния `reports` prop идва от
    // reduxActiveTest?.data?.ergometryReports, така изтриването се вижда
    // веднага и се пази при навигация.
    // 🔹 delete отива през 2 стъпки: клик на Delete само отваря центриран
    // модал (ConfirmDialogComponent, същия, който Page8.tsx ползва за
    // New Test/Existing Tests) с детайли за конкретния запис — вместо
    // browser-ния window.confirm(), който не е центриран и няма как да
    // покаже нищо повече от текст.
    const [pendingDeleteReport, setPendingDeleteReport] =
        useState<{ report: any; index: number } | null>(null);

    function requestDeleteArchiveReport(report: any, index: number) {
        setPendingDeleteReport({ report, index });
    }

    function cancelDeleteArchiveReport() {
        setPendingDeleteReport(null);
    }

    function confirmDeleteArchiveReport() {

        if (!pendingDeleteReport) return;

        const { index } = pendingDeleteReport;

        const reduxCurrentData =
            reduxActiveTest?.data ?? new MDPatientMeasurements();

        // 🔹 филтрираме по ПОЗИЦИЯ в масива, не по report.id — по-старите/
        // сийдваните archive records невинаги имат валидно и уникално id
        // (виждаме празни Date/Model полета за някои от тях в UI-то), а
        // филтриране по id='' маха ВСИЧКИ съвпадащи наведнъж вместо само
        // конкретния запис, който потребителят е цъкнал (точно докладвания
        // бъг: "трие само един елемент, не всички" -> при него ставаше
        // обратното, триеше повече от един).
        const filteredReports =
            (reduxCurrentData.ergometryReports ?? [])
                .filter((_: any, i: number) => i !== index);

        dispatch(
            saveActiveTest(
                new MDPatientMeasurements({
                    ...reduxCurrentData,
                    ergometryReports: filteredReports
                })
            )
        );

        setPendingDeleteReport(null);

    }

    // 🔹 подробно съобщение за модала — дата, модел, IAS/IANS на КОНКРЕТНИЯ
    // запис, за да е ясно кое точно ще се изтрие (не просто generic текст)
    function buildDeleteReportMessage(): string {

        if (!pendingDeleteReport) return '';

        const { report } = pendingDeleteReport;

        const dateText =
            report?.createdAt ||
            LanguageUtil.getName('keine_tests_text');

        const modelText =
            report?.ergometry?.model || '—';

        const iasText =
            report?.result?.IAS ?? '—';

        const iansText =
            report?.result?.IANS ?? '—';

        return (
            `${LanguageUtil.getName('delete_report_confirm_text')}\n\n` +
            `${LanguageUtil.getName('datum')}: ${dateText}\n` +
            `${LanguageUtil.getName('modell_text')}: ${modelText}\n` +
            `IAS: ${iasText}\n` +
            `IANS: ${iansText}`
        );

    }




    return (

        <View style={styles.container} nativeID="magmed-app-root">

            <View style={styles.leftPanel}>

                <View style={styles.formSection}>

                    <HeaderComponent
                        buttonCallback={() => { }}
                        buttonName={"update_user_text"}
                        setButtonState={null}
                        clearFieldFlag={null}
                        setClearFieldFlag={null}
                        dataPatient={dataPatient}
                    />

                    <Button
                        title={
                            reportMode
                                ? LanguageUtil.getName('zurueck_zum_bearbeiten_text')
                                : LanguageUtil.getName('bericht_oeffnen_text')
                        }
                        onPress={() => {

                            setReportMode(
                                !reportMode
                            );
                        }}
                    />

                </View>

                {/* 🔹 Активен тест name/id — единия и същ activeTestId/
                    renameActiveTest, който Page8.tsx-ния header ползва,
                    така промяна тук се вижда и там (и обратно). Помага да
                    се провери визуално, че Save/навигация Page8<->Page11
                    работят с един и същ обект. */}
                <View style={styles.activeTestBar}>

                    <Text style={styles.activeTestLabel}>
                        {LanguageUtil.getName('name')}:
                    </Text>

                    <TextInput
                        style={styles.activeTestNameInput}
                        value={nameDraft}
                        editable={!!reduxActiveTestId}
                        onChangeText={setNameDraft}
                        onEndEditing={handleRenameTest}
                        onBlur={handleRenameTest}
                    />

                    <Text style={styles.activeTestId}>
                        ID: {reduxActiveTestId || '—'}
                    </Text>

                </View>

                {/* 🔥 SCROLLABLE CONTENT */}
                {!reportMode && (
                    <ScrollView
                        style={styles.listSection}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >

                        {/* 🔹 2026-08-18 — DK: "изобщо не е това от пдф-а" —
                            досега само toggle-редът+графиката бяха условни
                            на activeChartView === 'current'; всичко друго
                            (Belastungsprotokoll/Datenerfassung/Rechenverfahren
                            /action бутони/старата Auswertung+Summary таблица)
                            си оставаше видимо на ВСИЧКИ табове, затова
                            "Overlay" изглеждаше идентичен на "Aktuell". Сега
                            ЦЯЛОТО старо съдържание на "Aktuell" е в един-
                            единствен {'{activeChartView === \'current\' && (...)}'}
                            блок — на другите табове НЕ се вижда нищо от
                            него, само съответния нов компонент. */}
                        {activeChartView === 'current' && (
                            <>

                        {/* 🔹 Belastungsprotokoll = настройки на натоварване */}

                        {/* 🚴 Ergometer / Bike */}
                        <WorkloadRow
                            value="bike"
                            type={type}
                            setType={handleSetType}
                            label="Watt"
                            styles={styles}
                            startLoad={startLoad}
                            powerIncrement={powerIncrement}
                            powerTimeStep={powerTimeStep}
                            handleBasePower={handleWatPower}
                            handlePowerIncrement={handleWatIncrement}
                            handleStepDuration={handleWatDuration}
                        />

                        {/* 🏃 Laufband / Treadmill */}
                        <WorkloadRow
                            value="run"
                            type={type}
                            setType={handleSetType}
                            label="km/h"
                            styles={styles}
                            startLoad={runStartLoad}
                            powerIncrement={runPowerIncrement}
                            powerTimeStep={runPowerTimeStep}
                            handleBasePower={handleRunPower}
                            handlePowerIncrement={handleRunIncrement}
                            handleStepDuration={handleRunDuration}
                        />

                        {/* 🔹 Datenerfassung = въвеждане на данни */}
                        <DatenerfassungList
                            data={data}
                            setData={setData}
                        />

                        {/* 🔹 Plausibilitätsprüfung предупреждение — виж
                            checkLoadPlausibility в save() по-горе */}
                        {plausibilityWarning && (
                            <View style={styles.plausibilityWarning}>
                                <Text style={styles.plausibilityWarningText}>
                                    ⚠ {plausibilityWarning}
                                </Text>
                            </View>
                        )}

                        {/* 🔹 Rechenverfahren = метод на изчисление */}
                        <RechenverfahrenComponent
                            value={model}
                            setValue={setModel}
                        />
                        {/* 🔹 2026-08-14 — UI redesign: 4 стекнати full-width
                            Button-и (Save/Archive/Generate/Clear) заменени с
                            компактен 2-редов action bar (chip бутони,
                            primary/secondary/muted/destructive). Archive
                            текстът е динамичен: "Archive" докато няма
                            зареден archive запис, "Update Archive" щом
                            loadedReportId е сетнат (виж
                            persistArchiveEntry() по-горе — save-vs-update
                            семантика). */}
                        {/* 🔹 2026-08-19 — DK: "Save/Generate" и Archive/Add
                            бяха 2 отделни бутона — точно 2-те стъпки бяха
                            причината "цъкам Add, не се сейва в листа" (Add
                            archive-ваше resultPreview от МИНАЛ Save/Generate
                            клик, или изобщо липсващ, ако потребителят
                            директно цъкнеше Add). Слети в ЕДИН бутон
                            (save() вече прави и двете, виж таме) — "единия
                            бутон archive да отпадне изобщо". */}
                        <View style={styles.actionButtonsContainer}>

                            <View style={styles.actionRow}>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.actionButtonPrimary, { flex: 1 }]}
                                    onPress={() => save()}
                                >
                                    <Text style={styles.actionButtonTextLight}>
                                        {
                                            loadedReportId
                                                ? LanguageUtil.getName('archiv_aktualisieren_text')
                                                : LanguageUtil.getName('archivieren_text')
                                        }
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            <View style={styles.actionRow}>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.actionButtonMuted]}
                                    onPress={() => generateFakeData()}
                                >
                                    <Text style={styles.actionButtonText}>
                                        {LanguageUtil.getName('testdaten_generieren_text')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.actionButtonDestructive]}
                                    onPress={() => clearData()}
                                >
                                    <Text style={styles.actionButtonTextLight}>
                                        {LanguageUtil.getName('alle_daten_loeschen_text')}
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </View>



                        {/* 🔹 Auswertung = резултати */}
                        <AuswertungComponent
                            data={data}
                            result={resultPreview}
                        />



                        <ErgometrySummaryComponent
                            result={resultPreview}
                        />




                        {/* 🔹 2026-08-14 — UI redesign: HF/Schwellenwerte/Zonen
                            бяха 3 отделни full-width Button-и (пестят
                            вертикално пространство слабо, не показват
                            видимо активно/неактивно състояние) — заменени с
                            един компактен ред от chip toggle-и с ясен
                            active/inactive фон (виж toggleChip*Active
                            стиловете). "Generate Fake Data From Test
                            Scenario" беше групиран тук само по историческа
                            причина — преместен е под графиката (виж
                            scenarioButtonContainer по-долу), центриран и
                            по-малко обемен, per заявката на потребителя. */}
                        {/* 🔹 2026-08-18 — DK уточни: 4-те бутона (Aktuell/
                            Überlagern/Trainingsbereich/Rechenverfahren) не
                            трябва да са тук долу във scroll-а — местени са
                            на HEADER ниво в HomeScreen.js (под главните 14
                            икон-бутона), откъдето вече идва activeChartView
                            prop-а по-горе. Тук само четем стойността му.
                            (Външният {'{activeChartView === current}'}
                            wrapper вече е горе, над Belastungsprotokoll —
                            виж коментара там; тук само продължава
                            съдържанието му, без нов условен блок.) */}

                                <View style={styles.toggleRow}>

                                    <TouchableOpacity
                                        style={[styles.toggleChip, showHeartRateCurve && styles.toggleChipActive]}
                                        onPress={() => setShowHeartRateCurve(!showHeartRateCurve)}
                                    >
                                        <Text style={[styles.toggleChipText, showHeartRateCurve && styles.toggleChipTextActive]}>
                                            {LanguageUtil.getName('hf_umschalten_text')}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.toggleChip, showThresholdLines && styles.toggleChipActive]}
                                        onPress={() => setShowThresholdLines(!showThresholdLines)}
                                    >
                                        <Text style={[styles.toggleChipText, showThresholdLines && styles.toggleChipTextActive]}>
                                            {LanguageUtil.getName('schwellenwerte_umschalten_text')}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.toggleChip, showTrainingZones && styles.toggleChipActive]}
                                        onPress={() => setShowTrainingZones(!showTrainingZones)}
                                    >
                                        <Text style={[styles.toggleChipText, showTrainingZones && styles.toggleChipTextActive]}>
                                            {LanguageUtil.getName('zonen_umschalten_text')}
                                        </Text>
                                    </TouchableOpacity>

                                </View>

                                <LactateChartComponent

                                    data={data}

                                    result={resultPreview}

                                    chartStart={250}

                                    showTrainingZones={showTrainingZones}

                                    showThresholdLines={showThresholdLines}

                                    showThresholdLabels={showThresholdLabels}

                                    showHeartRateCurve={showHeartRateCurve}

                                    isRun={type === 'run'}

                                    model={model}

                                    trainingZonePercents={trainingZonePercents}

                                    onZonePercentChange={handleZonePercentChange}
                                />
                                {/* 🔹 преместен тук от блока над toggle-ите
                                    (виж коментара по-горе) — компактен,
                                    центриран pill. 2026-08-14: добавен втори
                                    pill до него, който отваря
                                    самостоятелния "Business-Logic-Tracer"
                                    (public/tools/business_logic_tracer.html)
                                    в нов таб — пресмята стъпка по стъпка
                                    същите формули, без да се чете код. Само
                                    web (window.open) — няма ефект/грешка на
                                    native builds. */}
                                <View style={styles.scenarioButtonContainer}>
                                    <TouchableOpacity
                                        style={styles.scenarioButton}
                                        onPress={() => generateFakeDataFromTestScenario()}
                                    >
                                        <Text style={styles.scenarioButtonText}>
                                            {LanguageUtil.getName('testdaten_aus_szenario_text')}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.logicTracerButton}
                                        onPress={() => {
                                            if (typeof window !== 'undefined' && window.open) {
                                                window.open('/tools/business_logic_tracer.html', '_blank')
                                            }
                                        }}
                                    >
                                        <Text style={styles.logicTracerButtonText}>
                                            🔍 {LanguageUtil.getName('logik_pruefen_text')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {
                                    showTrainingZones && (

                                        <TrainingZonesOverlayComponent
                                            result={resultPreview}
                                            data={data}
                                            isRun={type === 'run'}
                                            model={model}
                                            trainingZonePercents={trainingZonePercents}
                                        />
                                    )
                                }

                                {/* 🔹 DetailAnalyse = детайлен анализ */}
                                <DetailAnalyseComponent
                                    data={data}
                                    result={resultPreview}
                                />

                            </>
                        )}

                        {/* 🔹 2026-08-18 — DK: качи "3.32 CCC Laktat
                            Datenerfassung und Auswertung" и поиска този таб
                            да показва ТОЧНО и САМО тази спецификация (виж
                            пълния коментар в
                            LaktatkurveAuswertungComponent.tsx). Замества
                            старата LaktatkurveUeberlagernComponent (3.36
                            überlagern) тук — файлът/тестовете ѝ остават на
                            диска непокътнати, само не се рендира вече на
                            този таб, докато не стигнем методично до 3.36.
                            Извън {'{activeChartView === current}'} блока
                            по-горе — на този таб НЕ се вижда нищо от
                            Belastungsprotokoll/Datenerfassung/Rechenverfahren
                            /action бутони/старата Auswertung, само това. */}
                        {activeChartView === 'ueberlagern' && (
                            <LaktatkurveAuswertungComponent
                                data={data}
                                result={resultPreview}
                                model={model}
                                isRun={type === 'run'}
                                weightKg={weightKg}
                                onWeightKgChange={setWeightKg}
                            />
                        )}

                        {/* 🔹 2026-08-18 (2) — "3.34 CCC Laktatkurve und
                            Trainingsbereich": TRAININGSBEREICH таблица
                            (% der IANS / mmol Liter / S/min / Watt-или-min·km)
                            + графичното наслагване на зоните. Същия
                            trainingZonePercents state, който вече се
                            споделя с чарта на "Aktuell" таба — влаченето на
                            границите там и editable % полетата тук остават
                            синхронизирани, защото са едно и също state. */}
                        {activeChartView === 'trainingsbereich' && (
                            <LaktatkurveTrainingsbereichComponent
                                result={resultPreview}
                                data={data}
                                isRun={type === 'run'}
                                model={model}
                                trainingZonePercents={trainingZonePercents}
                                onPercentsChange={setTrainingZonePercents}
                                onReset={resetTrainingZonePercents}
                            />
                        )}

                        {/* 🔹 2026-08-18 (3) — "3.36 CCC Laktatkurve
                            überlagern" V1: чек-лист + absolute/normiert
                            превключвател + IAS/IANS таблица, върху вече
                            тествания OverlayUtil (18 теста). Виж коментара
                            на импорта по-горе за какво остава като следваща
                            стъпка. */}
                        {activeChartView === 'rechenverfahren' && (
                            <LaktatkurveUeberlagernComponent
                                reports={reduxActiveTest?.data?.ergometryReports}
                                isRun={type === 'run'}
                                onLoadReport={applyHistoryReport}
                                onGoToView={onChartViewChange}
                            />
                        )}

                    </ScrollView>
                )}

                {
                    reportMode && (

                        <>
                            <Button
                                title={LanguageUtil.getName('bericht_drucken_text')}
                                onPress={() => {

                                    window.print();
                                }}
                            />

                            <ScrollView
                                style={styles.reportSection}
                            >
                                <View
                                    id="ergometry-report"
                                >

                                    <AuswertungComponent
                                        data={data}
                                        result={resultPreview}
                                    />

                                    <ErgometrySummaryComponent
                                        result={resultPreview}
                                    />

                                    <LactateChartComponent
                                        data={data}

                                        result={resultPreview}

                                        showTrainingZones={showTrainingZones}

                                        showThresholdLines={showThresholdLines}

                                        showThresholdLabels={showThresholdLabels}

                                        showHeartRateCurve={showHeartRateCurve}

                                        isRun={type === 'run'}

                                        model={model}

                                        trainingZonePercents={trainingZonePercents}
                                    />



                                    <DetailAnalyseComponent
                                        data={data}
                                        result={resultPreview}
                                    />

                                </View>

                            </ScrollView>

                        </>
                    )
                }

                <Button
                    title={LanguageUtil.getName('print_report_button_text')}
                    onPress={() => setShowPrintReport(true)}
                />

                < Button
                    title={LanguageUtil.getName('zurueck_zur_startseite_text')}
                    onPress={() => goTo('home')}
                />

                {
                    showPrintReport && (
                        <PrintFullReportComponent
                            measurement={reduxActiveTest?.data ?? new MDPatientMeasurements()}
                            patient={selectedUser}
                            activeTest={reduxActiveTest}
                            onClose={() => setShowPrintReport(false)}
                        />
                    )
                }

            </View>


            {/* 🔹 Preview panel */}
            {
                !reportMode && (

                    <View style={styles.rightPanel}>

                        <ScrollView style={{ padding: 10 }}>

                            {/* 🔹 2026-08-14 — UI redesign: архивния списък
                                (ErgometryHistoryComponent) беше в дъното на
                                левия panel — местен тук, в началото на
                                десния panel, за да не се налага скрол през
                                целия ляв panel само за да стигнеш до старите
                                записи. */}
                            <ErgometryHistoryComponent

                                reports={
                                    reduxActiveTest
                                        ?.data
                                        ?.ergometryReports
                                }

                                onApply={applyHistoryReport}
                                onDelete={requestDeleteArchiveReport}
                                // 🔹 2026-08-19 — DK: след успешен "Add" новият
                                // запис трябва да изглежда селектнат в листа
                                // (и след "Apply" на стар запис — същия
                                // индикатор). loadedReportId вече е id-то на
                                // "текущо представения" archive запис.
                                selectedReportId={loadedReportId}
                            />

                            {/* 🔹 Trainingsbereich (Phase 3, "3.34 CCC
                                Laktatkurve und Trainingsbereich") — само
                                докато зоните са включени (иначе IAS/IANS
                                контекстът, който таблицата показва, не е
                                видим никъде другаде). Percentage inputs тук
                                и влаченето на границите директно на
                                графиката (LactateChartComponent) споделят
                                същия trainingZonePercents state, така че
                                винаги остават синхронизирани.
                                🔹 2026-08-18 (2) — тази дясна панелна версия
                                е СТАРАТА функционалност (виждаше се на всеки
                                таб, защото десният panel е извън
                                activeChartView switch-а). Сега таб
                                "Trainingsbereich" вече показва собствено,
                                по-пълно копие (LaktatkurveTrainingsbereichComponent,
                                виж по-горе) — затова тук я ограничаваме само
                                до "Aktuell" таба, за да не се дублира едно и
                                също нещо на два таба едновременно (същия бъг
                                клас, който DK докладва за Overlay таба). */}
                            {
                                showTrainingZones && activeChartView === 'current' && (

                                    <TrainingsbereichComponent
                                        result={resultPreview}
                                        data={data}
                                        model={model}
                                        isRun={type === 'run'}
                                        customPercents={trainingZonePercents}
                                        onPercentsChange={setTrainingZonePercents}
                                        onReset={resetTrainingZonePercents}
                                    />
                                )
                            }

                            {/* 🔹 2026-08-19 — DK: "премахни patient
                                preview-то отдолу, сложи го като бутон, да
                                го имаме и да ми го показва на цял екран в
                                поп ъп" — и същото после и за Result Preview.
                                И двете вече не са постоянно видими JSON-
                                дървета в scroll-а, а по един бутон, който
                                отваря fullscreen Modal (виж previewModalType
                                state и Modal-а долу, до ConfirmDialogComponent). */}
                            <View style={styles.previewButtonsRow}>

                                <TouchableOpacity
                                    style={styles.previewButton}
                                    onPress={() => setPreviewModalType('patient')}
                                >
                                    <Text style={styles.previewButtonText}>
                                        {LanguageUtil.getName('patienten_vorschau_text')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.previewButton}
                                    onPress={() => setPreviewModalType('result')}
                                >
                                    <Text style={styles.previewButtonText}>
                                        {LanguageUtil.getName('ergebnis_vorschau_text')}
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </ScrollView>

                    </View>
                )}

            <ConfirmDialogComponent
                visible={pendingDeleteReport !== null}
                message={buildDeleteReportMessage()}
                onConfirm={confirmDeleteArchiveReport}
                onCancel={cancelDeleteArchiveReport}
            />

            {/* 🔹 2026-08-19 — fullscreen Patient/Result Preview popup, виж
                previewButtonsRow по-горе. Едно и също Modal-обвивка за
                двата бутона, съдържанието се решава от previewModalType. */}
            <Modal
                visible={previewModalType !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setPreviewModalType(null)}
            >

                <View style={styles.previewModalOverlay}>

                    <View style={styles.previewModalBox}>

                        <View style={styles.previewModalHeader}>

                            <Text style={styles.previewModalTitle}>
                                {
                                    previewModalType === 'patient'
                                        ? LanguageUtil.getName('patienten_vorschau_text')
                                        : LanguageUtil.getName('ergebnis_vorschau_text')
                                }
                            </Text>

                            <TouchableOpacity
                                onPress={() => setPreviewModalType(null)}
                            >
                                <Text style={styles.previewModalClose}>
                                    ✕ {LanguageUtil.getName('schliessen')}
                                </Text>
                            </TouchableOpacity>

                        </View>

                        <ScrollView style={styles.previewModalScroll}>

                            {
                                previewModalType === 'patient' &&
                                (previewPatient
                                    ? renderObject(previewPatient)
                                    : <Text>—</Text>)
                            }

                            {
                                previewModalType === 'result' &&
                                (resultPreview
                                    ? renderObject(resultPreview)
                                    : <Text>—</Text>)
                            }

                        </ScrollView>

                    </View>

                </View>

            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'row'
    },

    leftPanel: {
        flex: 3,
        borderRightWidth: 1
    },

    rightPanel: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },

    // 🔹 2026-08-19 — Patient/Result Preview бутони (заместват старите
    // постоянно видими inline JSON-дървета) + fullscreen popup стилове.
    previewButtonsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 16
    },

    previewButton: {
        flex: 1,
        minWidth: 120,
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },

    previewButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333'
    },

    previewModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    previewModalBox: {
        width: '94%',
        height: '92%',
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#999',
        padding: 16
    },

    previewModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingBottom: 10,
        marginBottom: 10
    },

    previewModalTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },

    previewModalClose: {
        fontSize: 15,
        fontWeight: '600',
        color: '#c0392b'
    },

    previewModalScroll: {
        flex: 1
    },

    formSection: {
        paddingBottom: 10,
        borderBottomWidth: 1
    },

    activeTestBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        borderBottomWidth: 1,
        backgroundColor: '#fafafa'
    },

    activeTestLabel: {
        fontWeight: 'bold'
    },

    activeTestNameInput: {
        borderWidth: 1,
        padding: 4,
        flex: 1,
        minWidth: 100
    },

    activeTestId: {
        color: '#666',
        fontSize: 12
    },

    plausibilityWarning: {
        backgroundColor: '#fff3cd',
        borderWidth: 1,
        borderColor: '#e0a800',
        borderRadius: 4,
        padding: 8,
        marginTop: 8
    },

    plausibilityWarningText: {
        color: '#7a5c00',
        fontSize: 13
    },

    listSection: {
        flex: 1,
        padding: 10,
        gap: 10,
        borderWidth: 1
    },

    paddingBottom_10: {
        paddingBottom: 10
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },

    radio: {
        width: 30,
        alignItems: 'center'
    },

    cell: {
        flex: 1,
        fontSize: 12
    },

    input: {
        flex: 1,
        borderWidth: 1,
        padding: 4,
        marginRight: 5
    },

    disabled: {
        backgroundColor: '#eee',
        opacity: 0.6
    },
    reportSection: {
        flex: 1,
        borderWidth: 1
    },

    // 🔹 2026-08-14 — UI redesign: компактен action bar (Save/Archive/
    // Generate Fake Data/Clear All), заменя 4-те стекнати full-width Button.
    actionButtonsContainer: {
        marginTop: 10,
        gap: 8
    },

    actionRow: {
        flexDirection: 'row',
        gap: 8
    },

    actionButton: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    actionButtonPrimary: {
        backgroundColor: '#2f6fed'
    },

    actionButtonSecondary: {
        backgroundColor: '#5a6b7a'
    },

    actionButtonMuted: {
        backgroundColor: '#e3e7ec',
        borderWidth: 1,
        borderColor: '#c3cbd4'
    },

    actionButtonDestructive: {
        backgroundColor: '#d9534f'
    },

    actionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center'
    },

    actionButtonTextLight: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center'
    },

    // 🔹 HF/Schwellenwerte/Zonen — един компактен ред от toggle chip-ове
    // вместо 3 отделни full-width Button-а; active фон показва състоянието.
    toggleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6,
        marginTop: 10,
        marginBottom: 6
    },

    toggleChip: {
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#eef2f7'
    },

    toggleChipActive: {
        backgroundColor: '#2f6fed',
        borderColor: '#2f6fed'
    },

    toggleChipText: {
        fontSize: 12,
        color: '#333'
    },

    toggleChipTextActive: {
        color: '#fff',
        fontWeight: 'bold'
    },

    // 🔹 2026-08-17 — под-бутон "Ansicht wechseln" + 2-та скрити chip-а
    // ("Aktuell" / "Überlagern"), виж коментара в render-а по-горе.
    viewSwitcherContainer: {
        alignItems: 'center',
        marginTop: 8
    },

    viewSwitcherToggle: {
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 14,
        paddingVertical: 5,
        paddingHorizontal: 14,
        backgroundColor: '#f5f7fa'
    },

    viewSwitcherToggleText: {
        fontSize: 12,
        color: '#555',
        fontWeight: '600'
    },

    viewSwitcherOptions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 6
    },

    viewSwitcherChip: {
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 14,
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: '#fff'
    },

    viewSwitcherChipActive: {
        backgroundColor: '#8a5bc8',
        borderColor: '#8a5bc8'
    },

    viewSwitcherChipText: {
        fontSize: 12.5,
        color: '#333',
        fontWeight: '600'
    },

    viewSwitcherChipTextActive: {
        color: '#fff'
    },

    // 🔹 "Generate Fake Data From Test Scenario" — компактен, центриран
    // pill бутон под графиката (вместо обемен full-width Button над нея).
    // 2026-08-14: контейнерът вече е ред (flexDirection: 'row'), за да
    // побере и втория pill (logicTracerButton) до него.
    scenarioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
        marginBottom: 6
    },

    scenarioButton: {
        borderWidth: 1,
        borderColor: '#9fb3c8',
        borderRadius: 18,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#eef2f7'
    },

    scenarioButtonText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '600'
    },

    // 🔹 2026-08-14: pill бутон, който отваря business_logic_tracer.html
    // (public/tools/) в нов таб — самостоятелен инструмент за проследяване
    // на формулите зад Dickhuth/Freiburger/Linear/LTP/Keul/Keul Legacy и
    // Trainingsbereich каскадата, без да се чете код.
    logicTracerButton: {
        borderWidth: 1,
        borderColor: '#8a7bc8',
        borderRadius: 18,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f0ecfc'
    },

    logicTracerButtonText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '600'
    }
})