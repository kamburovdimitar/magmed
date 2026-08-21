// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-19 (Europe/Sofia) — MUFU KRAFT (Muskel-Funktion, "3.05 Neuer Test
//   - MUFU" мокъп): DK качи мокъп-скрийншотове (KRAFT таблица с 10 мускула
//   x R/L x 1-5 оценка + снимка на тялото с жълти точки) и поиска: (1)
//   реалната KRAFT таблица, (2) точките върху снимката да са селектабъли —
//   клик на точка selectва съответния ред в таблицата (потвърдено с DK чрез
//   AskUserQuestion). Снимката (assets/humanBody.jpg) вече съществуваше в
//   архива — точно тя отговаря 1:1 на мокъпа (същите жълти точки, R L L R
//   надписи). Координатите на точките са извлечени програмно от самото
//   изображение — виж constants/muskelFunktionKraftPunkte.js.
//
//   Данните се пазят в measurement.muskelFunktionKraft (нов field в
//   MDPatientMeasurements) като {[muscleKey]: {r, l}} — минава през същия
//   draft/callback механизъм, който TestComponent1/4/5/6/7 вече ползват
//   (Page8.tsx-ния "Speichern" бутон persist-ва целия draft наведнъж).
// ============================================

import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';
import { MUSCLE_LIST, MUSCLE_POINTS, KRAFT_RATING_COLORS } from '../constants/muskelFunktionKraftPunkte';
import humanBody from '../../assets/humanBody.jpg';

// 🔹 естественото съотношение на assets/humanBody.jpg (514x699) — пазим
// го тук, за да могат точките (position:'absolute', left/top в %) да
// седят точно върху нарисуваните жълти кръгчета, независимо от реалния
// render-нат размер на картинката.
const IMAGE_ASPECT_RATIO = 514 / 699;

// 🔹 2026-08-20 — DK: коремните мускули имат само 1 точка (не R/L двойка).
// По подразбиране мускул има 2 страни ['r','l']; MUSCLE_LIST може да
// override-не с `sides: ['c']` (виж bauchmuskulatur в
// constants/muskelFunktionKraftPunkte.js) за мускул с една обща точка/ред.
const DEFAULT_SIDES = ['r', 'l'] as const;

export default function MuskelFunktionKraftComponent({ value, onChange }: any) {

    // 🔹 {muscleKey, side} на текущо селектирания ред — селектва се или от
    // клик върху ред в таблицата, или от клик върху точка на снимката
    // (двупосочно, DK: "клик на точка selectva реда"). `side` обикновено е
    // 'r'|'l', но за мускули с 1 точка (виж DEFAULT_SIDES override по-горе)
    // е просто 'c' — компонентът не предполага фиксиран набор от страни.
    const [selected, setSelected] = useState<{ muscleKey: string; side: string } | null>(null);

    const kraft = value ?? {};

    function isSelected(muscleKey: string, side: string) {
        return selected?.muscleKey === muscleKey && selected?.side === side;
    }

    function selectRow(muscleKey: string, side: string) {
        setSelected({ muscleKey, side });
    }

    function setRating(muscleKey: string, side: string, rating: number) {

        const current = kraft[muscleKey] ?? {};

        const updated = {
            ...kraft,
            [muscleKey]: {
                ...current,
                [side]: current[side] === rating ? null : rating // 🔹 повторен клик на същата оценка я изчиства
            }
        };

        onChange(updated);

        selectRow(muscleKey, side);
    }

    return (

        <View style={styles.container}>

            {/* 🔹 ТАБЛИЦА */}
            <View style={styles.tableWrap}>

                <View style={styles.headerRow}>
                    <Text style={styles.headerMuscle} />
                    <Text style={styles.headerSide} />
                    {[1, 2, 3, 4, 5].map((n) => (
                        <Text key={n} style={styles.headerRating}>{n}</Text>
                    ))}
                </View>

                {
                    MUSCLE_LIST.map((muscle) => {

                        const rowValue = kraft[muscle.key] ?? {};
                        const sides = muscle.sides ?? DEFAULT_SIDES;

                        return (
                            <View key={muscle.key} style={styles.muscleGroup}>

                                {sides.map((side, sideIndex) => (

                                    <Pressable
                                        key={side}
                                        onPress={() => selectRow(muscle.key, side)}
                                        style={[
                                            styles.dataRow,
                                            isSelected(muscle.key, side) && styles.dataRowSelected
                                        ]}
                                    >

                                        <Text style={styles.muscleLabel} numberOfLines={1}>
                                            {sideIndex === 0 ? LanguageUtil.getName(muscle.labelKey) : ''}
                                        </Text>

                                        <Text style={styles.sideLabel}>
                                            {sides.length > 1 ? side.toUpperCase() : ''}
                                        </Text>

                                        {[1, 2, 3, 4, 5].map((n) => {

                                            const active = rowValue[side] === n;

                                            return (
                                                <Pressable
                                                    key={n}
                                                    onPress={() => setRating(muscle.key, side, n)}
                                                    style={[
                                                        styles.ratingCell,
                                                        { backgroundColor: KRAFT_RATING_COLORS[n] }
                                                    ]}
                                                >
                                                    <Text style={styles.ratingCellText}>
                                                        {active ? '●' : ''}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })}

                                    </Pressable>
                                ))}

                            </View>
                        );
                    })
                }

            </View>

            {/* 🔹 СНИМКА НА ТЯЛОТО С СЕЛЕКТАБЪЛНИ ТОЧКИ */}
            <View style={styles.bodyImageWrap}>

                <View style={styles.bodyImageAspect}>

                    <Image
                        source={humanBody}
                        style={styles.bodyImage}
                        resizeMode="contain"
                    />

                    {
                        MUSCLE_LIST.map((muscle) => (

                            (muscle.sides ?? DEFAULT_SIDES).map((side) => {

                                const point = MUSCLE_POINTS[muscle.key]?.[side];

                                if (!point) return null;

                                const rowValue = kraft[muscle.key] ?? {};

                                const hasRating = rowValue[side] != null;

                                const active = isSelected(muscle.key, side);

                                return (
                                    <Pressable
                                        key={`${muscle.key}-${side}`}
                                        onPress={() => selectRow(muscle.key, side)}
                                        style={[
                                            styles.bodyPoint,
                                            {
                                                left: `${point.xPercent}%`,
                                                top: `${point.yPercent}%`
                                            },
                                            active && styles.bodyPointActive,
                                            hasRating && !active && {
                                                backgroundColor: KRAFT_RATING_COLORS[rowValue[side]]
                                            }
                                        ]}
                                    />
                                );
                            })
                        ))
                    }

                </View>

                <Text style={styles.bodyImageHint}>
                    {
                        selected
                            ? (() => {
                                const selectedMuscle = MUSCLE_LIST.find(m => m.key === selected.muscleKey);
                                const label = LanguageUtil.getName(selectedMuscle?.labelKey ?? '');
                                const hasMultipleSides = (selectedMuscle?.sides ?? DEFAULT_SIDES).length > 1;
                                return hasMultipleSides ? `${label} — ${selected.side.toUpperCase()}` : label;
                            })()
                            : ' '
                    }
                </Text>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        width: '100%',
        gap: 10
    },

    tableWrap: {
        flex: 1.3,
        borderWidth: 1,
        borderColor: '#999'
    },

    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#fff176',
        borderBottomWidth: 1,
        borderColor: '#999'
    },

    headerMuscle: {
        flex: 3
    },

    headerSide: {
        width: 26
    },

    headerRating: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingVertical: 4
    },

    muscleGroup: {
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },

    dataRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        minHeight: 26
    },

    dataRowSelected: {
        backgroundColor: '#fff9c4'
    },

    muscleLabel: {
        flex: 3,
        fontSize: 12,
        paddingLeft: 4,
        alignSelf: 'center'
    },

    sideLabel: {
        width: 26,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        alignSelf: 'center'
    },

    ratingCell: {
        flex: 1,
        borderLeftWidth: 1,
        borderColor: '#999',
        alignItems: 'center',
        justifyContent: 'center'
    },

    ratingCellText: {
        fontSize: 13,
        fontWeight: 'bold'
    },

    bodyImageWrap: {
        flex: 1,
        alignItems: 'center'
    },

    // 🔹 фиксирано съотношение (виж IMAGE_ASPECT_RATIO) — гарантира, че
    // %-базираните left/top на точките винаги съвпадат с нарисуваните
    // жълти кръгчета в изображението, независимо от ширината на panel-а.
    bodyImageAspect: {
        width: '100%',
        aspectRatio: IMAGE_ASPECT_RATIO,
        position: 'relative'
    },

    bodyImage: {
        width: '100%',
        height: '100%'
    },

    bodyPoint: {
        position: 'absolute',
        width: 18,
        height: 18,
        marginLeft: -9,
        marginTop: -9,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.35)',
        backgroundColor: 'rgba(255,255,255,0.01)'
    },

    bodyPointActive: {
        backgroundColor: '#2f6fed',
        borderColor: '#1a3f99',
        width: 22,
        height: 22,
        marginLeft: -11,
        marginTop: -11,
        borderRadius: 11
    },

    bodyImageHint: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: '600',
        color: '#333'
    }

});
