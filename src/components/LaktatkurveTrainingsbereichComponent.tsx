// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-18 (Europe/Sofia) — Стъпка от плана за "3.34 CCC Laktatkurve und
// Trainingsbereich": DK поиска изричен 4-бутонен под-навигатор в Page11
// ("Aktuell / Überlagern / Trainingsbereich / Rechenverfahren"), всеки
// маршрутизиран към собствен компонент, за да е ясно кое е старо и кое
// ново. Тук не преоткриваме логиката — тя вече съществува и е тествана
// (ErgometryModelsUtil.calculateTrainingZones/calculateTrainingZoneTable,
// TrainingZonesOverlayComponent, TrainingsbereichComponent) — просто ги
// композираме в самостоятелен, винаги видим таб (преди TrainingsbereichComponent
// се показваше само в дясното archive-меню и само докато showTrainingZones
// беше включен; тук е независим от този toggle).
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TrainingZonesOverlayComponent from './TrainingZonesOverlayComponent';
import TrainingsbereichComponent from './TrainingsbereichComponent';
import LanguageUtil from '../utils/LanguageUtil';

export default function LaktatkurveTrainingsbereichComponent({
    result,
    data,
    isRun = false,
    model = null,
    trainingZonePercents = null,
    onPercentsChange,
    onReset
}: any) {

    const hasResult = !!(result && result.IASPoint && result.IANSPoint);

    return (
        <View style={styles.container}>

            {!hasResult && (
                <Text style={styles.emptyText}>
                    {LanguageUtil.getName('trainingsbereich_kein_ergebnis_text')}
                </Text>
            )}

            {hasResult && (
                <>
                    <TrainingZonesOverlayComponent
                        result={result}
                        data={data}
                        isRun={isRun}
                        model={model}
                        trainingZonePercents={trainingZonePercents}
                    />

                    <TrainingsbereichComponent
                        result={result}
                        data={data}
                        model={model}
                        isRun={isRun}
                        customPercents={trainingZonePercents}
                        onPercentsChange={onPercentsChange}
                        onReset={onReset}
                    />
                </>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        marginTop: 10
    },

    emptyText: {
        fontSize: 12.5,
        color: '#6b7789',
        fontStyle: 'italic',
        padding: 14,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#dde3ea',
        borderRadius: 6
    }

});
