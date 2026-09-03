// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-31 (Claude) — DK одобри "Табло за прогреса" и поиска реална
//   версия на Page3 ("Страница 3"), за да я разгледа сам, преди да решим
//   как да я свържем към останалата навигация ("после ще видим как ще
//   го вържим"). Затова:
//
//   - Взимаме РЕАЛНИТЕ данни на активния тест от Redux — същият модел
//     като Page10.tsx: selectedUser / activeTestId / measurements →
//     activeTest → measurement (fallback: празен MDPatientMeasurements,
//     ако все още няма избран пациент/тест).
//   - nativeID="magmed-app-root" на root-а — задължително за print-CSS
//     механизма на PrintFullReportComponent (през "Печат / доклад"
//     картата в таблото), както при Page8/Page10/Page11.
//   - onSelectDomain НЕ е свързан към нищо още — виж changelog-а в
//     TestProgressDashboardComponent.tsx защо (умишлено, по желание на DK).
// ============================================

import React from 'react'
import { View, Button } from 'react-native'
import { useSelector } from 'react-redux'
import LanguageUtil from '../../utils/LanguageUtil'
import TestProgressDashboardComponent from '../../components/TestProgressDashboardComponent'
import { MDPatientMeasurements } from '../../model/MDPatientMeasurements'

export default function Page3({ goTo }) {

    const selectedUser = useSelector((state: any) => state.user.selectedUser)

    const activeTestId = useSelector(
        (state: any) => state.user.selectedUser?.activeTestId
    )

    const measurements = useSelector(
        (state: any) => state.user.selectedUser?.measurements
    ) ?? []

    const activeTest = measurements.find((t: any) => t.id === activeTestId) ?? null
    const measurement = activeTest?.data ?? new MDPatientMeasurements()

    return (
        <View nativeID="magmed-app-root" style={{ padding: 16 }}>

            <TestProgressDashboardComponent
                measurement={measurement}
                patient={selectedUser}
                activeTest={activeTest}
            />

            <View style={{ marginTop: 20 }}>
                <Button
                    title={LanguageUtil.getName('zurueck_zur_startseite_text')}
                    onPress={() => goTo('home')}
                />
            </View>

        </View>
    )
}
