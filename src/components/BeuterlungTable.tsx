// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-19 (Europe/Sofia) — MUFU Körper-Haltung (WIRBELSÄULE): преди
//   компонентът пазеше избора само в локален useState — не преживяваше
//   navigate away/back и никога не се записваше в теста. Сега приема
//   контролирани `value`/`onChange` (със fallback на локален state, ако
//   не са подадени — обратно съвместимо), за да мине през същия
//   draft/callback механизъм като останалите MUFU/Ergometrie полета (виж
//   KoerperHaltungComponent.tsx). Header етикетите вече минават през
//   LanguageUtil (schwer/mittelschwer/leicht/normal ключовете вече
//   съществуваха, само не бяха свързани тук).
//
// 2026-08-20 — DK: KOPF/SCHULTER/BECKEN/KNIE/FUSS липсваха от Körper-
//   Haltung (само WIRBELSÄULE имаше реална таблица). Вместо да
//   копирам-паст-вам цялата таблица 5 пъти с различни редове, добавен е
//   optional `sections` prop: {rows:[{label,key}]}[] (виж
//   constants/koerperHaltungSections.js). Когато е подаден, таблицата се
//   рендерва динамично от него; когато НЕ е подаден (както при
//   WIRBELSÄULE — KoerperHaltungComponent.tsx не го подава там), поведе-
//   нието остава ТОЧНО както преди (хардкоднатите HWS/BWS/LWS секции по-
//   долу) — нулев риск за вече работещата WIRBELSÄULE таблица.
//
// 2026-08-20 (2) — DK поиска AUSWERTUNG (обобщен изглед на всички Körper-
//   Haltung оценки, виж KoerperHaltungAuswertungComponent.tsx) — за да
//   може той да look-up-ва label-ите на WIRBELSÄULE редовете (за да ги
//   покаже в обобщението), изнесох HWS/BWS/LWS секциите в
//   constants/koerperHaltungSections.js (WIRBELSAEULE_SECTIONS, СЪЩИТЕ
//   keys като преди — данните на съществуващи тестове не се засягат).
//   Вече винаги минаваме през ЕДИН рендер-път (sections ?? default), без
//   дублиран JSX — WIRBELSÄULE поведението остава идентично.
// ============================================

import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import LanguageUtil from '../utils/LanguageUtil';
import { WIRBELSAEULE_SECTIONS } from '../constants/koerperHaltungSections';

export default function BeuterlungTable({ value, onChange, sections }: any) {

    const [localSelected, setLocalSelected] = useState({});

    const selected = value ?? localSelected;

    function handlePress(row, col) {

        const updated = {
            ...selected,
            [row]: selected[row] === col ? null : col
        };

        if (onChange) {
            onChange(updated);
        } else {
            setLocalSelected(updated);
        }
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.headerRow}>
                <Text style={styles.headerEmpty}></Text>
                <Text style={styles.header}>{LanguageUtil.getName('schwer')}</Text>
                <Text style={styles.header}>{LanguageUtil.getName('mittelschwer')}</Text>
                <Text style={styles.header}>{LanguageUtil.getName('leicht')}</Text>
                <Text style={styles.header}>{LanguageUtil.getName('normal')}</Text>
            </View>

            {
                // 🔹 подаден `sections` prop (KOPF/SCHULTER/BECKEN/KNIE/FUSS) ->
                // ползваме него; иначе -> WIRBELSAEULE_SECTIONS (default,
                // идентичен на старото хардкоднато HWS/BWS/LWS поведение).
                (sections ?? WIRBELSAEULE_SECTIONS).map((section: any, sectionIndex: number) => (
                    <View key={section.title ?? sectionIndex} style={styles.section}>
                        {
                            section.title
                                ? <Text style={styles.sectionTitle}>{section.title}</Text>
                                : null
                        }

                        {
                            section.rows.map((r: any) => row(r.label, r.key, selected, handlePress))
                        }
                    </View>
                ))
            }

        </View>
    );
}


// ✅ clickable row
function row(label, rowKey, selected, handlePress) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>

            {cell(rowKey, 0, styles.red, selected, handlePress)}
            {cell(rowKey, 1, styles.orange, selected, handlePress)}
            {cell(rowKey, 2, styles.yellow, selected, handlePress)}
            {cell(rowKey, 3, styles.green, selected, handlePress)}
        </View>
    );
}


// ✅ clickable cell
function cell(rowKey, colIndex, colorStyle, selected, handlePress) {
    const isActive = selected[rowKey] === colIndex;

    return (
        <Pressable
            onPress={() => handlePress(rowKey, colIndex)}
            style={[styles.cell, colorStyle]}
        >
            <Text style={{ textAlign: "center", fontSize: 18 }}>
                {isActive ? "●" : ""}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#cfd8dc"
    },

    headerRow: {
        flexDirection: "row"
    },

    headerEmpty: {
        width: 100
    },

    header: {
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
        borderWidth: 1,
        backgroundColor: "#90a4ae"
    },

    section: {
        marginTop: 10,
        borderWidth: 1
    },

    sectionTitle: {
        position: "absolute",
        left: -40,
        top: 10,
        transform: [{ rotate: "-90deg" }]
    },

    row: {
        flexDirection: "row"
    },

    label: {
        width: 100,
        backgroundColor: "yellow",
        borderWidth: 1
    },

    cell: {
        flex: 1,
        borderWidth: 1,
        textAlign: "center"
    },

    red: { backgroundColor: "#ef5350" },
    orange: { backgroundColor: "#ffcc80" },
    yellow: { backgroundColor: "#fff59d" },
    green: { backgroundColor: "#a5d6a7" }
});