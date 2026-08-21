// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 14:20 (Europe/Sofia) — Restored the "enlarge to read" zoom control
//   (Codex 3.13) via zoomLevel state + A-/Reset/A+ buttons in the Interpretation
//   modal header, wired to InterprationPanel's new zoomLevel prop (real font
//   scaling, not the old CSS `zoom` transform that broke scrolling). Also added
//   a Print button + print-only CSS (#interpretation-print-area) so the
//   Interpretation itself can be printed (Codex: "Interpretation wird gedruckt"),
//   instead of only the separate basic PrintTestPanel.
// 2026-08-11 14:55 (Europe/Sofia) — Fixed print breaking/overlapping content
//   above ~145% zoom: the old print CSS used the classic
//   "visibility:hidden + position:absolute" single-element-print trick, which
//   cannot paginate content taller than one page (Chrome overlaps sections
//   instead of splitting them across pages). Replaced with explicit
//   display:none on the two things we don't want printed (#magmed-app-root,
//   #interpretation-modal-header) while the print target itself stays in
//   normal document flow, so it now paginates cleanly across as many pages
//   as needed at any zoom level.
// 2026-08-11 15:05 (Europe/Sofia) — Default Interpretation zoom changed from
//   100% to 145% (INTERPRETATION_ZOOM_DEFAULT); "Reset" now returns to 145%
//   instead of 100%.
// 2026-08-11 (Europe/Sofia) — Screen split (1:1 with 3.25CCC_Test_Ergometri_
//   PROJEKT.pdf and Präsentation2.pptx): renderTestView() now wires
//   detail1/4/5/6/7 to the newly-split TestComponent1/4/5/6/7 (see each
//   file's own changelog). detail1 lost the onPrint/onInterpration/
//   onGenereateFakeData/setModel props (moved to detail7, "ALLE Tests",
//   which now holds the combined view). detail4/5/6 gained real
//   measurements/callback wiring (5 and 6 also get the shared
//   model/setModel for lactate-model selection). detail2/detail3
//   (Muskel-Funktion/Körper-Haltung) were left unchanged — out of scope for
//   this pass.
// 2026-08-11 (Europe/Sofia) — Localization pass: the Interpretation modal's
//   "Reset" zoom button now goes through LanguageUtil.getName
//   ('zuruecksetzen') (exact matching key already in Translations.js). Left
//   "A-"/"A+"/"Print"/"Back to Home" hardcoded — no exact-match keys exist
//   for those in Translations.js.
// 2026-08-11 (Europe/Sofia) — Localization pass, part 2 (after the user
//   pointed out remaining untranslated strings elsewhere): added
//   zurueck_zur_startseite_text to Translations.js for the "Back to Home"
//   button and wired it here. Left "A-"/"A+"/"Print"/"Close" in the
//   Interpretation modal header hardcoded — out of scope for this pass
//   (no matching keys added yet for those).
// 2026-08-11 (Europe/Sofia) — New Test / Existing Tests / Save feature.
//   Redux's `selectedUser.measurements` changed from a single object to
//   MDTestRecord[] (see MDPatient.tsx's changelog for the full shape).
//   This file now keeps a LOCAL draft of the active test's data — every
//   field edit across TestComponent1-7 only updates `draft` here, it is
//   NOT dispatched to Redux on every keystroke anymore (that was the old
//   `updateMeasurements` behavior). Redux is only touched at three
//   explicit moments:
//     - Save button       -> dispatch(saveActiveTest(draft))
//     - New Test button    -> dispatch(createTest()) (after a confirm gate
//                             if there are unsaved changes)
//     - Existing Tests ->
//       Apply               -> dispatch(setActiveTest(id)) (also behind the
//                             confirm gate), which loads that test's data
//                             into `draft` via the activeTestId effect below
//   `isDirty` tracks whether `draft` differs from what's saved; the confirm
//   popup (ConfirmDialogComponent) only appears when isDirty is true — a
//   deliberate judgment call (showing "you'll lose data" when there's
//   nothing to lose felt like noise); easy to change to "always show" if
//   that's not the intent.
// ============================================

import React from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Modal,
} from 'react-native';
import LanguageUtil from '../../utils/LanguageUtil'
import HeaderSearchComponent from '../../components/HeaderComponent'
import PatientList from '../../components/Lists/PatientList'
import UsersProxy from '../../services/UsersProxy'
import SelectedUserProxy from '../../services//SelectedUserProxy'
import { useEffect, useState } from "react";
import TestPanel from '../../components/TestPanelComponent'
import TestsListComponent from '../../components/TestsListComponent'
import ConfirmDialogComponent from '../../components/ConfirmDialogComponent'
import TestComponent1 from '../../components/testComponents/TestComponent1'
import TestComponent2 from '../../components/testComponents/TestComponent2'
import TestComponent3 from '../../components/testComponents/TestComponent3'
import TestComponent4 from '../../components/testComponents/TestComponent4'
import TestComponent5 from '../../components/testComponents/TestComponent5'
import TestComponent6 from '../../components/testComponents/TestComponent6'
import TestComponent7 from '../../components/testComponents/TestComponent7'
import PrintTestPanel from '../../components/PrintTestPanel'
import InterprationPanel from '../../components/InterprationPanel'
import { MDPatient } from '../../model/MDPatient'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createTest, setActiveTest, saveActiveTest, renameActiveTest } from "../../store/userSlice";
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'
import LabelAndInputTextComponent from '../../components/LabelAndInputComponent'
import { ERGOMETRY_MODELS } from '../../constants/ergometryModels'
import { CodexUtil } from '../../utils/CodexUtil'



export default function Page8({ goTo }) {
    const dispatch = useDispatch();
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const [ergoType, setErgoType] = useState("bike");
    const [model, setModel] = useState(ERGOMETRY_MODELS.DICKHUTH);

    const [ergoView, setErgoView] = useState('');
    const [leftView, setLeftView] = useState('');
    const [dataPatient, setDataPatient] = useState({} as MDPatient);
    const [showInterpretationModal, setShowInterpretationModal] = useState(false);
    const INTERPRETATION_ZOOM_DEFAULT = 1.45;
    const [interpretationZoom, setInterpretationZoom] = useState(INTERPRETATION_ZOOM_DEFAULT);





    // 🔹 New Test / Existing Tests / Save
    const tests = useSelector(
        (state) => state.user.selectedUser?.measurements
    ) ?? [];

    const activeTestId = useSelector(
        (state) => state.user.selectedUser?.activeTestId
    );

    const activeTest = tests.find((t) => t.id === activeTestId);

    const [draft, setDraft] = useState(() => new MDPatientMeasurements());
    const [isDirty, setIsDirty] = useState(false);
    const [showTestsList, setShowTestsList] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null as 'new' | 'existing' | null);

    // 🔹 name shown/editable in the header (see JSX below) — hydrated
    // alongside `draft` in the same effect, so it always matches whichever
    // test is actually active.
    const [nameDraft, setNameDraft] = useState('');

    // 🔹 whenever the active test changes (New Test / Apply), reload the
    // local draft from its data and clear the dirty flag. Depends only on
    // activeTestId, not on `tests` itself — Save doesn't change
    // activeTestId, so it correctly does NOT re-trigger this.
    useEffect(() => {

        if (activeTest) {
            setDraft(new MDPatientMeasurements(activeTest.data));
            setNameDraft(activeTest.name ?? '');
        } else {
            setDraft(new MDPatientMeasurements());
            setNameDraft('');
        }

        setIsDirty(false);

    }, [activeTestId]);

    // 🔹 2026-08-21 (Claude) — DK потвърди: "да, [оправи age/gender и] тук
    // (Page8/'Measurements')". Same gap fixed on Page10 ("Training"): age
    // and gender were never synced from the patient (birthdate/gender) into
    // the per-test `MDPatientMeasurements`, so `expectedheartrate`/
    // `sollLeistungNorm` silently used age=0/gender="male" defaults on this
    // screen too.
    //
    // This screen keeps a LOCAL draft (see change log at top — Redux is
    // only touched by explicit Save/New Test/Apply), so unlike Page10 we do
    // NOT dispatch anything here — we only patch the in-memory `draft` via
    // the functional setDraft form (so it correctly applies on top of the
    // draft-reload effect right above, not a stale pre-reload value — both
    // effects depend on `activeTestId` and run in declaration order). We
    // deliberately do NOT call `setIsDirty(true)` for this — auto-filling
    // age/gender from the patient's own identity isn't a "user edit" that
    // should trigger the unsaved-changes confirm dialog when switching
    // tests; it just makes the numbers correct while viewing/editing. If
    // the user does make a real edit afterwards, Save persists the
    // corrected age/gender along with it.
    const computedAge = CodexUtil.calculateAge(selectedUser?.birthdate);
    const patientGender = selectedUser?.gender || '';

    useEffect(() => {

        setDraft((prev) => {

            const patch: any = {};
            let needsUpdate = false;

            if (computedAge != null && prev.age !== computedAge) {
                patch.age = computedAge;
                needsUpdate = true;
            }

            if (patientGender && prev.gender !== patientGender) {
                patch.gender = patientGender;
                needsUpdate = true;
            }

            if (!needsUpdate) return prev;

            return new MDPatientMeasurements({ ...prev, ...patch });

        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [computedAge, patientGender, activeTestId]);

    // 🔹 commit the header name edit to Redux (on blur, not per keystroke)
    function handleRenameTest() {

        if (!activeTestId) return;

        dispatch(renameActiveTest(nameDraft));

    }

    const measurement = draft;

    console.log(
        "PAGE8 render",
        measurement.ergometry.data[0]
    );

    console.log("PAGE8 measurement");
    console.log(measurement);

    console.log("PAGE8 ergometry");
    console.table(measurement?.ergometry?.data);



    useEffect(() => {
        if (!selectedUser) return;

        setDataPatient(selectedUser as MDPatient);

    }, [selectedUser]);

    useEffect(() => {


    }, [model]);


    useEffect(() => {

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setShowInterpretationModal(false);
            }
        }

        if (showInterpretationModal) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, [showInterpretationModal]);


    // 🔹 Print-only CSS: hide everything except the Interpretation panel
    // (#interpretation-print-area) and let it print in NORMAL document flow.
    //
    // Earlier version used the classic "visibility:hidden + position:absolute"
    // trick — that breaks on content taller than one page: Chrome can't
    // paginate an absolutely-positioned box, so past ~1 page it started
    // overlapping sections on top of each other (confirmed via screenshot at
    // 145% zoom — rows were printing stacked on top of each other on page 2).
    // Fixed by explicitly hiding the two things we don't want printed
    // (display:none, not visibility) and leaving the print target itself in
    // normal flow (no position override), so the browser paginates it like
    // any other long document — splitting cleanly across as many pages as
    // needed instead of overlapping.
    useEffect(() => {

        if (typeof document === 'undefined') return;

        const styleEl = document.createElement('style');

        styleEl.id = 'magmed-interpretation-print-style';

        styleEl.innerHTML = `
            @media print {
                html, body {
                    height: auto !important;
                    overflow: visible !important;
                }
                #magmed-app-root,
                #interpretation-modal-header {
                    display: none !important;
                }
                #interpretation-modal-container,
                #interpretation-print-area,
                #interpretation-print-area * {
                    height: auto !important;
                    max-height: none !important;
                    overflow: visible !important;
                }
            }
        `;

        document.head.appendChild(styleEl);

        return () => {
            styleEl.remove();
        };

    }, []);

    function zoomIn() {
        setInterpretationZoom(z => Math.min(2, Number((z + 0.15).toFixed(2))));
    }

    function zoomOut() {
        setInterpretationZoom(z => Math.max(0.7, Number((z - 0.15).toFixed(2))));
    }

    function zoomReset() {
        setInterpretationZoom(INTERPRETATION_ZOOM_DEFAULT);
    }

    function printInterpretation() {
        if (typeof window !== 'undefined') {
            window.print();
        }
    }

    function updateHandler(updatedMeasurements) {

        // 🔹 local draft only — Redux is untouched until Save
        setDraft(updatedMeasurements);
        setIsDirty(true);

    }

    function handleSaveTest() {

        // 🔹 first save ever for this patient: create the row first, then
        // save into it (dispatches are synchronous, so activeTestId is
        // already fresh in the store by the second dispatch)
        if (!activeTestId) {
            dispatch(createTest());
        }

        dispatch(saveActiveTest(draft));

        setIsDirty(false);
    }

    function doNewTest() {
        dispatch(createTest());
        setConfirmAction(null);
    }

    function requestNewTest() {

        if (isDirty) {
            setConfirmAction('new');
        } else {
            doNewTest();
        }

    }

    function requestExistingTests() {

        if (isDirty) {
            setConfirmAction('existing');
        } else {
            setShowTestsList(true);
        }

    }

    function handleConfirmDiscard() {

        if (confirmAction === 'new') {
            doNewTest();
        }

        if (confirmAction === 'existing') {
            setShowTestsList(true);
            setConfirmAction(null);
        }

    }

    function handleCancelDiscard() {
        setConfirmAction(null);
    }

    function handleApplyTest(id) {
        dispatch(setActiveTest(id));
        setShowTestsList(false);

        // 🔹 при Apply от Existing Tests винаги отваряме "ALLE Tests"
        // (detail7), за да се вижда целият тест наведнъж, а не последния
        // отворен detail-изглед отпреди
        setErgoView('detail7');
    }

    useEffect(() => {

        // const model = new MDPatientMeasurements(measurements);
        // console.log("after dispatch fatmass", model.fatmasskg);


    }, [measurement])

    function handlerButton(value) {
        setErgoView(value)
    }

    function onPrint() {
        setLeftView("print")
    }

    function onInterpration(value) {
        setShowInterpretationModal(true);
    }
    function onGenereateFakeData() {

        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let fake = new MDPatientMeasurements();

        fake.age = random(18, 70);

        fake.heightcm = random(160, 200);
        fake.weightkg = random(55, 110);

        fake.waistcm = random(70, 120);
        fake.hipcm = random(85, 125);

        fake.bodyfatpercent = random(8, 35);

        fake.bloodpressurerestsystolic = random(105, 135);
        fake.bloodpressurerestdiastolic = random(65, 90);

        fake.bloodpressuremaxsystolic = random(160, 230);
        fake.bloodpressuremaxdiastolic = random(80, 110);

        fake.heartraterest = random(50, 85);

        let expected = 220 - fake.age;
        fake.heartratemax = random(expected - 15, expected + 10);

        fake.istLeistungMax = random(140, 380);

        return fake;
    }


    function renderTestView() {

        // Screen split (2026-08-11): detail1 is now the dedicated
        // "Körpermaße & Vitalparameter" screen (body measurements only).
        // The combined "everything on one screen" view that used to live
        // here moved to detail7 ("ALLE Tests"), which is where the Codex's
        // 7-item menu actually puts it — so the utility buttons
        // (Print/Generate Fake Data/Interpretation) and the model picker
        // moved there with it.
        if (ergoView === 'detail1') return <TestComponent1
            callback={updateHandler}
            measurement={measurement}
        />

        // 🔹 2026-08-19 — detail2/3 (Muskel-Funktion/Körper-Haltung) вече
        // получават measurement/callback точно като detail1/4/5/6/7 —
        // преди се рендираха без props (виж git history), затова каквото и
        // да променеше потребителят вътре, никога не стигаше до
        // draft/Speichern.
        if (ergoView === 'detail2') return <TestComponent2
            measurement={measurement}
            callback={updateHandler}
        />
        if (ergoView === 'detail3') return <TestComponent3
            measurement={measurement}
            callback={updateHandler}
        />

        // detail4 = "Ergometrie": body/vitals + device toggle + SOLL/IST
        // Watt (bike) or Max Speed/Pace (treadmill) + Karvonen HR zones.
        // No lactate model needed here (no IAS/IANS calculation on this
        // screen).
        if (ergoView === 'detail4') return <TestComponent4
            measurements={measurement}
            callback={updateHandler}
        />

        // detail5 = "Laktat-Ergometrie": Ergometrie screen's content plus
        // the stage data-entry table + IAS/IANS results + %IANS HR zones.
        // Shares the app-wide lactate model selection (`model`/`setModel`)
        // with the Interpretation panel and the Spiro-Ergometrie screen.
        if (ergoView === 'detail5') return <TestComponent5
            measurements={measurement}
            callback={updateHandler}
            selectedModel={model}
            setModel={setModel}
        />

        // detail6 = "Spiro-Ergometrie": body/vitals + VO2max/VT1/VT2 +
        // %VO2max HR zones. No Watt table, no lactate fields.
        if (ergoView === 'detail6') return <TestComponent6
            measurements={measurement}
            callback={updateHandler}
            selectedModel={model}
            setModel={setModel}
        />

        // detail7 = "ALLE Tests": the combined view (everything together),
        // exactly what used to be at detail1 before the split.
        if (ergoView === 'detail7') return <TestComponent7
            callback={updateHandler}
            measurement={measurement}
            onPrint={onPrint}
            onInterpration={onInterpration}
            onGenereateFakeData={onGenereateFakeData}
            setModel={setModel}
            selectedModel={model}
        />
    }

    let content;

    if (showTestsList) {
        content = <TestsListComponent
            tests={tests}
            activeTestId={activeTestId}
            onApply={handleApplyTest}
            onClose={() => setShowTestsList(false)}
        />;
    } else if (leftView === 'print') {
        content = <PrintTestPanel />;
    } else if (leftView === 'interpratation') {
        content = <InterprationPanel selectedModel={model} />;
    } else {
        content = <TestPanel
            handlerButton={handlerButton}
            onNewTest={requestNewTest}
            onExistingTests={requestExistingTests}
        />;
    }




    return (

        <View style={styles.container} nativeID="magmed-app-root">

            <View style={styles.leftPanel}>

                {/* TOP FORM */}
                <View style={styles.formSection}>

                    <HeaderSearchComponent
                        buttonCallback={null}
                        buttonName={null}
                        setButtonState={null}
                        clearFieldFlag={null}
                        setClearFieldFlag={null}
                        dataPatient={dataPatient}
                    />
                </View>

                {/* 🔹 Active test name/id — so it's always visible which
                    MDTestRecord is currently being edited (esp. useful
                    while testing that Save/navigation actually keeps the
                    same object across Page8 <-> Page11). */}
                <View style={styles.activeTestBar}>

                    <Text style={styles.activeTestLabel}>
                        {LanguageUtil.getName('name')}:
                    </Text>

                    <TextInput
                        style={styles.activeTestNameInput}
                        value={nameDraft}
                        editable={!!activeTestId}
                        onChangeText={setNameDraft}
                        onEndEditing={handleRenameTest}
                        onBlur={handleRenameTest}
                    />

                    <Text style={styles.activeTestId}>
                        ID: {activeTestId || '—'}
                    </Text>

                </View>

                {/* BOTTOM LIST */}

                {/* Ergometry LIST */}
                <View style={styles.listSection}>
                    {renderTestView()}
                </View>

                <Button
                    title={LanguageUtil.getName('speichern')}
                    onPress={handleSaveTest}
                />

                <Button
                    title={LanguageUtil.getName('zurueck_zur_startseite_text')}
                    onPress={() => goTo('home')}
                />
                <TextInput
                    value={draft?.heightcm?.toString()}
                />

            </View>

            {/* RIGHT PANEL */}
            <View style={styles.rightPanel}>
                {content}
            </View>

            <Modal
                visible={showInterpretationModal}
                animationType="fade"
                transparent={false}
                onRequestClose={() => setShowInterpretationModal(false)}
            >
                <View style={styles.modalContainer} nativeID="interpretation-modal-container">

                    <View style={styles.modalHeader} nativeID="interpretation-modal-header">

                        <View style={styles.zoomGroup}>
                            <Button title="A-" onPress={zoomOut} />
                            <Text style={styles.zoomLabel}>{Math.round(interpretationZoom * 100)}%</Text>
                            <Button title="A+" onPress={zoomIn} />
                            <Button title={LanguageUtil.getName('zuruecksetzen')} onPress={zoomReset} />
                        </View>

                        <Button
                            title="Print"
                            onPress={printInterpretation}
                        />

                        <Button
                            title="Close"
                            onPress={() => setShowInterpretationModal(false)}
                        />
                    </View>

                    <View style={styles.modalContent} nativeID="interpretation-print-area">
                        <InterprationPanel selectedModel={model} zoomLevel={interpretationZoom} />
                    </View>
                </View>
            </Modal>

            <ConfirmDialogComponent
                visible={confirmAction !== null}
                message={LanguageUtil.getName('test_data_loss_warning_text')}
                onConfirm={handleConfirmDiscard}
                onCancel={handleCancelDiscard}
            />

        </View>

    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        height: '100%',
        backgroundColor: "white",
    },

    modalHeader: {
        padding: 10,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },

    zoomGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    zoomLabel: {
        minWidth: 44,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
    },

    modalContent: {
        flex: 1,
        minHeight: 0,
        padding: 15,
    },

    container: {
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '100%'

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
        padding: 10,
        borderBottomWidth: 1
    },

    activeTestBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
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

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10
    },

    input: {
        borderWidth: 1,
        height: 30,
        padding: -10,
    },

    smallInput: {
        borderWidth: 1,
        padding: 4,
        width: 60,

    },

    listSection: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
    },
    colsection: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        flexDirection: 'column',
    },
    colsectionV: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        flexDirection: 'column',
    },

    listHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 5
    },

    col: {
        flex: 1,
        fontWeight: 'bold'
    },

    listBody: {
        flex: 1,
        borderWidth: 1,
        marginTop: 5
    },

    listFooter: {
        marginTop: 10,
        alignItems: 'flex-end'
    }

})