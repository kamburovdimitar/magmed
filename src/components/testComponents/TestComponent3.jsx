// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-19 (Europe/Sofia) — MUFU Körper-Haltung ("3.05 Neuer Test - MUFU"
//   мокъп): преди беше празен scratch/proof-of-concept (статична картинка,
//   без данни, без callback wiring — виж git history). Пренаписан като
//   тънка обвивка, точно както TestComponent1/4/5/6/7 — приема
//   `measurement`/`callback` от Page8.tsx и делегира на
//   KoerperHaltungComponent.tsx (WIRBELSÄULE реална таблица + референтна
//   снимка; KOPF/SCHULTER/BECKEN/KNIE/FUSS placeholder за сега).
// ============================================

import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import KoerperHaltungComponent from '../KoerperHaltungComponent'

export default function TestComponent3({ measurement, callback }) {

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>

            <KoerperHaltungComponent
                measurement={measurement}
                callback={callback}
            />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 30
    }
})
