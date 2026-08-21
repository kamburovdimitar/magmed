// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-20 (Europe/Sofia) — DK: "това на коя страница е имплементирано?"
//   -> после: "имплементирай пдф по пдф всичките неща, в страницата
//   training (heart). всичко, което има там до момента го изтрий и
//   започни всичко от начало, това са стари имплементации и не са
//   коректни." Старото съдържание на този файл (виж git history) беше
//   несвързан placeholder: функцията се казваше Page11 (copy-paste
//   remnant), ползваше fake `UsersProxy.getAllUsers()` пациент-търсачка
//   несвързана с реалния избран пациент, и статични hardcoded таблични
//   стойности с бутони, които правеха само `console.log(true)` — нищо
//   реално не се пазеше. Изтрито изцяло, преизградено от нула по 5-те
//   нови PDF-а ("Training – Gesundheit" — 5.21b Kein Test, 5.24b
//   Ergometrie Watt, 5.25b Laktat Ergometrie Watt, 0.00 MAGMED Codex
//   04_2, 5.90 CCC Gesundheits Training).
//
//   Забележка: старият файл дори не получаваше `measurement`/`callback`
//   от HomeScreen.js (само `goTo`) — единствената top-level страница без
//   връзка към избрания пациент/активния тест. Сега следва СЪЩИЯ модел
//   като Page11.tsx (друга самостоятелна top-nav страница, не таб вътре
//   в Page8): чете `selectedUser`/`activeTestId`/`measurements` директно
//   от Redux, пише директно през `saveActiveTest` (auto-save на всяка
//   промяна — тук няма отделен "Save" бутон в нито един мокъп, а много
//   дребни чекбокс/поле промени, затова auto-save е по-безопасно от
//   отложен draft, който лесно се забравя да се запази; аналогично на
//   BeuterlungTable/KoerperHaltung компонентите).
//
//   Съдържа само Kein Test таба реално имплементиран засега (виж
//   TrainingsplanComponent.tsx/TrainingsplanKeinTestComponent.tsx) —
//   Ergometrie/Laktat Ergometrie/Spiro Ergometrie са "Not implemented
//   yet." placeholder-и, следват PDF по PDF в следващите стъпки.
// ============================================

import React, { useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HeaderComponent from '../../components/HeaderComponent';
import TrainingsplanComponent from '../../components/TrainingsplanComponent';
import { createTest, saveActiveTest, setSelectedUser } from '../../store/userSlice';
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements';
import { CodexUtil } from '../../utils/CodexUtil';

export default function Page10({ goTo }: any) {

    const dispatch = useDispatch();

    const selectedUser = useSelector((state: any) => state.user.selectedUser);

    const activeTestId = useSelector(
        (state: any) => state.user.selectedUser?.activeTestId
    );

    const measurements = useSelector(
        (state: any) => state.user.selectedUser?.measurements
    ) ?? [];

    const activeTest = measurements.find((t: any) => t.id === activeTestId) ?? null;

    const measurement = activeTest?.data ?? new MDPatientMeasurements();

    // 🔹 auto-save на всяка промяна (виж change log-а по-горе защо, не
    // отложен draft+Save бутон) — създава активен тест, ако още няма
    // такъв, точно както Page11.tsx го прави за Laktatkurve-то.
    function updateMeasurement(updated: MDPatientMeasurements) {

        if (!activeTestId) {
            dispatch(createTest());
        }

        dispatch(saveActiveTest(updated));

    }

    // 🔹 2026-08-21 — DK: "какво трябва да въвеждам, за да получа
    // резултат?" / "нищо не разбирам от нея" (HF max=220, Watt max=300 за
    // пациентка родена 1991 — чисти defaults, все едно възрастта е 0).
    // Причина: `MDPatientMeasurements._age` е private поле с manual
    // getter/setter, но НИКЪДЕ в приложението не се задаваше — няма
    // input поле за "възраст" (проверих TestMeasurementsComponent.tsx —
    // "Age" се среща само в статични tooltip обяснения). MAGMED Codex
    // #7# изрично казва възрастта е type "A" = Automatisch (Дата -
    // Рождена дата), не ръчно поле — затова тук я изчисляваме от
    // MDPatient.birthdate (вече е попълнена в "Update Client" хедъра) и
    // я записваме в активния тест, вместо да добавяме нов input.
    // `CodexUtil.calculateAge` вече съществуваше в кода (export-нат), но
    // никой не го викаше — виждам и, че самата функция беше счупена за
    // формата "DD.MM.YYYY", който приложението реално пази (поправено
    // там, виж CodexUtil.js коментара).
    //
    // 🔹 2026-08-21 (по-късно същия ден) — DK: "нека се захванем с полето
    // gender" — същият проблем важеше и за пола: `sollLeistungNorm`/
    // `sollLeistungWeight` (Watt max) hardcode-ваха "male" в
    // MDPatientMeasurements.tsx, независимо какво реално е избрано за
    // пациента. Сега пациентският `gender` (male/female, вече истински
    // dropdown в HeaderComponent — виж промените там) се синхронизира
    // тук по абсолютно същия начин като възрастта.
    //
    // Само пресмятаме/пишем, ако нещо реално се различава — за да не
    // влизаме в безкраен render/dispatch цикъл.
    const computedAge = CodexUtil.calculateAge(selectedUser?.birthdate);
    const patientGender = selectedUser?.gender || '';

    useEffect(() => {

        const patch: any = {};
        let needsUpdate = false;

        if (computedAge != null && measurement.age !== computedAge) {
            patch.age = computedAge;
            needsUpdate = true;
        }

        if (patientGender && measurement.gender !== patientGender) {
            patch.gender = patientGender;
            needsUpdate = true;
        }

        if (needsUpdate) {

            updateMeasurement(
                new MDPatientMeasurements({
                    ...measurement,
                    ...patch
                })
            );

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [computedAge, patientGender, measurement.age, measurement.gender, activeTestId]);

    // 🔹 Personenspezifische Standardwerte живеят на MDPatient ниво (виж
    // MDPatient.tsx), не на MDPatientMeasurements — затова отделен callback.
    function updatePatient(updatedPatient: any) {
        dispatch(setSelectedUser(updatedPatient));
    }

    return (

        <View style={styles.container}>

            {/* 🔹 2026-08-21 — DK: "цялата страница е позиционирана надолу,
                трябва да е под Update button." Причина: HeaderComponent.tsx
                внасяно направо тук имаше собствен вътрешен `flex:1` (виж
                HeaderComponent.tsx `formSection` стил) — в column
                контейнер с два `flex:1` деца (Header-а и `content`-а),
                двете си поделят 50/50 наличната височина, независимо
                колко реално съдържание има Header-ът -> огромна празна
                лента между "Update Client" бутона и Training таба.
                Page8.tsx избягва точно това, като слага HeaderComponent в
                НЕ-flex обвивка (`formSection: {padding:10,
                borderBottomWidth:1}`, без flex) — същия фикс тук. */}
            <View style={styles.headerWrap}>
                <HeaderComponent
                    buttonCallback={() => { }}
                    buttonName={"update_user_text"}
                    setButtonState={null}
                    clearFieldFlag={null}
                    setClearFieldFlag={null}
                    dataPatient={selectedUser}
                />
            </View>

            <View style={styles.content}>
                <TrainingsplanComponent
                    measurement={measurement}
                    callback={updateMeasurement}
                    patient={selectedUser}
                    patientCallback={updatePatient}
                />
            </View>

            <Button
                title="Back to Home"
                onPress={() => goTo('home')}
            />

        </View>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },

    // 🔹 НЕ-flex обвивка около HeaderComponent — виж коментара горе защо
    // (Page8.tsx конвенция).
    headerWrap: {
        padding: 10,
        borderBottomWidth: 1
    },

    content: {
        flex: 1,
        padding: 10
    }

});
