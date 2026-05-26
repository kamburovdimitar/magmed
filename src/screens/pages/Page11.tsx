import { useEffect, useState } from "react";
import { View, StyleSheet, Button, ScrollView, Text } from 'react-native'
import HeaderComponent from '../../components/HeaderComponent'
import WorkloadRow from '../../components/WorkloadRowComponent'
import DatenerfassungList from '../../components/Lists/DatenerfassungComponentList'
import RechenverfahrenComponent from '../../components/RechenverfahrenComponent'
import AuswertungComponent from '../../components/AuswertungComponent'
import DetailAnalyseComponent from '../../components/DetailAnalyseComponent'
import { MDPatient } from "../../model/MDPatient";
import { MDErgometryReport } from "../../model/MDErgometryReport";
import { MDErgometry, MDErgometryRow } from "../../model/MDErgometry";
import { useSelector } from "react-redux";
import { ErgometryUtil } from "../../utils/ErgometrieUtil";
import { ErgometryModelsUtil } from '../../utils/ErgometryModelsUtil'
import LactateChartComponent from '../../components/LactateChartComponent'
import TrainingZonesOverlayComponent from '../../components/TrainingZonesOverlayComponent'
import ErgometrySummaryComponent from '../../components/ErgometrySummaryComponent'
import ErgometryHistoryComponent from '../../components/ErgometryHistoryComponent'


// 🔹 Това е UI тип (таблицата за въвеждане)
// ⚠️ Тук стойностите са string (за input полета)
type RowType = {
    stage: number       // Stufe = етап
    time: string        // Zeitpunkt = време
    load: number        // Watt = мощност
    hf: string          // HF = пулс (string в UI)
    lactate: string     // Laktat = лактат (string в UI)
}

export default function Page11({ goTo }: any) {

    const [showTrainingZones, setShowTrainingZones] = useState(true);

    const [showThresholdLines, setShowThresholdLines] = useState(true);

    const [showThresholdLabels, setShowThresholdLabels] = useState(true);

    const [showHeartRateCurve, setShowHeartRateCurve] = useState(true);

    const [reportMode, setReportMode] =
        useState(false);

    // 🔹 Взимаме избрания пациент от Redux
    const selectedUser = useSelector((state) => state.user.selectedUser);

    // 🔹 Локален пациент (копие, с което работим)
    const [dataPatient, setDataPatient] = useState({} as MDPatient);

    // 🔹 Preview на финалния обект
    // 🔹 Preview на финалния обект
    const [previewPatient, setPreviewPatient] =
        useState<MDPatient | null>(null);

    // 🔥 Result Preview
    const [resultPreview, setResultPreview] =
        useState<any>(null);

    useEffect(() => {

        if (!selectedUser) return;

        // 🔹 Зареждаме пациента
        setDataPatient(selectedUser as MDPatient);

    }, [selectedUser]);

    // 🔹 Rechenverfahren = метод на изчисление
    // 👉 кой алгоритъм ще използваме
    const [model, setModel] = useState<'dickhuth' | 'freiburg' | 'linear' | 'keul'>('dickhuth');



    // 🔹 Datenerfassung = въвеждане на данни (таблицата)
    const initialData: RowType[] = []

    for (let i = 0; i < 10; i++) {
        initialData.push({
            stage: i,
            time: '00:00',
            load: 0,
            hf: '',
            lactate: ''
        })
    }

    // 🔹 Това е таблицата, която user-а попълва
    const [data, setData] = useState<RowType[]>(initialData)

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
    function save() {

        // 🔹 Конвертираме UI данните → към модел (string → number)
        const rows: MDErgometryRow[] = [];

        for (let i = 0; i < data?.length; i++) {

            rows.push({
                stage: data[i].stage,
                time: data[i].time,
                load: data[i].load,
                hf: Number(data[i].hf),
                lactate: Number(data[i].lactate)
            });
        }

        // 🔹 Създаваме ергометрия (модел)
        const ergometry = new MDErgometry({
            type,
            startLoad: Number(type === 'bike' ? startLoad : runStartLoad),
            increment: Number(type === 'bike' ? powerIncrement : runPowerIncrement),
            timeStep: Number(type === 'bike' ? powerTimeStep : runPowerTimeStep),
            model,
            data: rows
        });

        // 🔹 Създаваме нов пациент (без mutation)
        const updatedPatient = new MDPatient(dataPatient);

        // 🔹 Вкарваме ергометрията към пациента
        updatedPatient.measurements.ergometry = ergometry;

        // 🔹 Preview в десния панел
        setPreviewPatient(updatedPatient);

        let result = null;

        if (model === 'dickhuth') {
            result = ErgometryModelsUtil.calculateDickhuth(rows);
        }

        if (model === 'freiburg') {
            result = ErgometryModelsUtil.calculateFreiburg(rows);
        }

        if (model === 'linear') {
            result = ErgometryModelsUtil.calculateLinear(rows);
        }

        if (model === 'keul') {
            result = ErgometryModelsUtil.calculateKeul(rows);
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
        }



        // 🔥 update result preview
        setResultPreview(result);

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

    function applyHistoryReport(
        report: any
    ) {

        const ergometry =
            report.ergometry;

        // 🔹 type
        setType(
            ergometry.type
        );

        // 🔹 model
        setModel(
            ergometry.model
        );

        // 🔹 protocol
        if (ergometry.type === 'bike') {

            setStartLoad(
                String(
                    ergometry.startLoad
                )
            );

            setPowerIncrement(
                String(
                    ergometry.increment
                )
            );

            setPowerTimeStep(
                String(
                    ergometry.timeStep
                )
            );

            // clear run
            setRunStartLoad('');

            setRunPowerIncrement('');

            setRunPowerTimeStep('');
        }
        else {

            setRunStartLoad(
                String(
                    ergometry.startLoad
                )
            );

            setRunPowerIncrement(
                String(
                    ergometry.increment
                )
            );

            setRunPowerTimeStep(
                String(
                    ergometry.timeStep
                )
            );

            // clear bike
            setStartLoad('');

            setPowerIncrement('');

            setPowerTimeStep('');
        }

        // 🔹 rows → UI rows
        const uiRows: RowType[] = [];

        for (let i = 0; i < ergometry.data.length; i++) {

            uiRows.push({

                stage:
                    ergometry.data[i].stage,

                time:
                    ergometry.data[i].time,

                load:
                    ergometry.data[i].load,

                hf:
                    String(
                        ergometry.data[i].hf
                    ),

                lactate:
                    String(
                        ergometry.data[i]
                            .lactate
                    )
            });
        }

        // 🔹 apply UI data
        setData(uiRows);

        // 🔹 apply result snapshot
        setResultPreview(
            report.results
        );

        // 🔹 apply patient preview
        const updatedPatient =
            new MDPatient(dataPatient);

        updatedPatient.measurements
            .ergometry = ergometry;

        setPreviewPatient(
            updatedPatient
        );
    }
    function clearData() {
        setStartLoad(String(""));
        setPowerIncrement(String(""));
        setPowerTimeStep(String(""));

        // clear run
        setRunStartLoad('');
        setRunPowerIncrement('');
        setRunPowerTimeStep('');
        setData(null)
    }

    function generateFakeData() {

        const fake =
            ErgometryUtil.generateFakeErgometry();

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

        const result = ErgometryModelsUtil.calculateDickhuth(uiRows)

        console.log(result)
    }


    function saveIntoArchive_History() {

        if (!resultPreview) {
            return;
        }

        // 🔹 rows
        const rows: MDErgometryRow[] = [];

        for (let i = 0; i < data?.length; i++) {

            rows.push({

                stage: data[i].stage,

                time: data[i].time,

                load: data[i].load,

                hf: Number(data[i].hf),

                lactate: Number(data[i].lactate)
            });
        }

        // 🔹 fresh ergometry snapshot
        const ergometry =
            new MDErgometry({

                type,

                startLoad:
                    Number(
                        type === 'bike'
                            ? startLoad
                            : runStartLoad
                    ),

                increment:
                    Number(
                        type === 'bike'
                            ? powerIncrement
                            : runPowerIncrement
                    ),

                timeStep:
                    Number(
                        type === 'bike'
                            ? powerTimeStep
                            : runPowerTimeStep
                    ),

                model,

                data: rows
            });

        // 🔹 clone patient
        const updatedPatient =
            new MDPatient(dataPatient);

        // 🔹 create report snapshot
        const report =
            new MDErgometryReport({

                id:
                    Date.now().toString(),

                createdAt:
                    new Date()
                        .toISOString(),

                ergometry,

                result:
                    resultPreview
            });

        // 🔹 push into history
        updatedPatient
            .measurements
            .ergometryReports
            .push(report);

        // 🔹 update state
        setDataPatient(updatedPatient);

        console.log(
            updatedPatient
                .measurements
                .ergometryReports
        );
    }




    return (

        <View style={styles.container}>

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
                                ? 'Back To Editттттттттттттттттт'
                                : 'Open Report'
                        }
                        onPress={() => {

                            setReportMode(
                                !reportMode
                            );
                        }}
                    />

                </View>

                {/* 🔥 SCROLLABLE CONTENT */}
                {!reportMode && (
                    <ScrollView
                        style={styles.listSection}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >

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

                        {/* 🔹 Rechenverfahren = метод на изчисление */}
                        <RechenverfahrenComponent
                            value={model}
                            setValue={setModel}
                        />
                        <View style={styles.paddingBottom_10}>
                            <Button
                                title="Save/Generate"
                                onPress={() => save()}
                            />
                        </View>


                        <View style={styles.paddingBottom_10}>
                            <Button
                                title="Archive"
                                onPress={() => saveIntoArchive_History()}
                            />
                        </View>

                        <View style={styles.paddingBottom_10}>
                            <Button
                                title="Generate Fake Data"
                                onPress={() => generateFakeData()}
                            />
                        </View>

                        <View style={styles.paddingBottom_10}>
                            <Button
                                title="Clear all data"
                                onPress={() => clearData()}
                            />
                        </View>



                        {/* 🔹 Auswertung = резултати */}
                        <AuswertungComponent
                            data={data}
                            result={resultPreview}
                        />

                        <ErgometrySummaryComponent
                            result={resultPreview}
                        />

                        <View style={styles.paddingBottom_10}>

                            <Button
                                title="Toggle Zones"
                                onPress={() => {

                                    setShowTrainingZones(
                                        !showTrainingZones
                                    );
                                }}
                            />

                        </View>

                        <View style={styles.paddingBottom_10}>

                            <Button
                                title="Toggle HR"
                                onPress={() => {

                                    setShowHeartRateCurve(
                                        !showHeartRateCurve
                                    );
                                }}
                            />

                        </View>

                        <View style={styles.paddingBottom_10}>

                            <Button
                                title="Toggle Thresholds"
                                onPress={() => {

                                    setShowThresholdLines(
                                        !showThresholdLines
                                    );
                                }}
                            />

                        </View>


                        <LactateChartComponent

                            data={data}

                            result={resultPreview}

                            showTrainingZones={showTrainingZones}

                            showThresholdLines={showThresholdLines}

                            showThresholdLabels={showThresholdLabels}

                            showHeartRateCurve={showHeartRateCurve}
                        />

                        {
                            showTrainingZones && (

                                <TrainingZonesOverlayComponent
                                    result={resultPreview}
                                    data={data}
                                />
                            )
                        }

                        {/* 🔹 DetailAnalyse = детайлен анализ */}
                        <DetailAnalyseComponent
                            data={data}
                            result={resultPreview}
                        />

                        <ErgometryHistoryComponent

                            reports={
                                dataPatient
                                    ?.measurements
                                    ?.ergometryReports
                            }

                            onApply={applyHistoryReport}
                        />

                    </ScrollView>
                )}

                {
                    reportMode && (

                        <>
                            <Button
                                title="Print Report"
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

                < Button
                    title="Back"
                    onPress={() => goTo('home')}
                />

            </View>


            {/* 🔹 Preview panel */}
            {
                !reportMode && (

                    <View style={styles.rightPanel}>

                        <ScrollView style={{ padding: 10 }}>

                            {/* 🔹 Patient Preview */}
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    marginBottom: 10
                                }}
                            >
                                Patient Preview
                            </Text>

                            {previewPatient &&
                                renderObject(previewPatient)
                            }

                            {/* 🔥 Result Preview */}
                            <View
                                style={{
                                    marginTop: 20,
                                    borderTopWidth: 1,
                                    borderColor: '#999',
                                    paddingTop: 10
                                }}
                            >

                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        marginBottom: 10
                                    }}
                                >
                                    Result Preview
                                </Text>

                                {resultPreview &&
                                    renderObject(resultPreview)
                                }

                            </View>

                        </ScrollView>

                    </View>
                )}

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

    formSection: {
        paddingBottom: 10,
        borderBottomWidth: 1
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
    }
})