// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass, part 3 (Page11.tsx screen):
//   wired the "Stufe"/"Zeit"/"Laktat" column headers to the existing
//   `stufe`/`zeit_text`/`laktat` keys. Left "Watt" and "HF" hardcoded —
//   units/abbreviations identical in both languages.
// 2026-08-14 (Europe/Sofia) — Eingabelogik pass (per
//   "3.32CCC_Laktat_Datenerfassung_und_Auswertung_PROJEKT.pdf", "Besonderheit:
//   letzte Stufe" + format rules):
//     - Zeitpunkt/Watt (time/load) are now editable ONLY on the LAST row —
//       every earlier row stays plain Text (auto-generated from
//       Belastungsprotokoll, not meant to be touched). Matches: "Zeitpunkt
//       und Leistung der letzten Stufe können manuell korrigiert werden".
//     - HF input now strips anything that isn't a digit as you type
//       ("Herzfrequenzwerte können nur in Format 0 eingegeben werden").
//     - Laktat input now restricts to digits + a single , or . separator
//       ("0 / 0,0 / 0,00 / 0.0 / 0.00").
//   Auto-delete of an incomplete last row and the load-must-increase
//   plausibility check live in Page11.tsx's save() (they need the full
//   Belastungsprotokoll/model context, not just this table).
// ============================================

import React from 'react'
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil'

export default function DatenerfassungComponentList({ data, setData }: any) {

    function updateValue(index: number, field: string, value: string) {
        let newData = []

        for (let i = 0; i < data.length; i++) {
            if (i === index) {
                let row = { ...data[i] }
                row[field] = value
                newData.push(row)
            } else {
                newData.push(data[i])
            }
        }

        setData(newData)
    }

    // 🔹 HF: "nur in Format 0" — цели числа, без десетични/букви
    function updateHf(index: number, value: string) {
        const digitsOnly = value.replace(/[^0-9]/g, '')
        updateValue(index, 'hf', digitsOnly)
    }

    // 🔹 Laktat: "0 / 0,0 / 0,00 / 0.0 / 0.00" — цифри + максимум ЕДИН
    // разделител (запетая или точка), до 2 цифри след него
    function updateLactate(index: number, value: string) {

        let cleaned = value.replace(/[^0-9.,]/g, '')

        const firstSeparatorMatch = cleaned.match(/[.,]/)

        if (firstSeparatorMatch) {

            const sepIndex = firstSeparatorMatch.index as number

            const integerPart = cleaned.slice(0, sepIndex).replace(/[.,]/g, '')

            const decimalPart = cleaned
                .slice(sepIndex + 1)
                .replace(/[.,]/g, '')
                .slice(0, 2)

            cleaned = `${integerPart}${cleaned[sepIndex]}${decimalPart}`
        }

        updateValue(index, 'lactate', cleaned)
    }

    // 🔹 последен ред: Zeitpunkt/Watt стават редактируеми ("Besonderheit:
    // letzte Stufe" — корекция при отклонения в теста)
    function updateLoad(index: number, value: string) {
        const digitsOnly = value.replace(/[^0-9]/g, '')
        updateValue(index, 'load', digitsOnly === '' ? 0 : Number(digitsOnly))
    }

    function renderItem({ item, index }: any) {

        const isLastRow = index === data.length - 1

        let time = item.time
        let load = item.load

        return (

            <View style={styles.row}>

                <Text style={styles.cellStage}>
                    {item.stage}
                </Text>

                {isLastRow ? (
                    <TextInput
                        style={styles.cellTimeInput}
                        value={String(time)}
                        onChangeText={(val) => updateValue(index, 'time', val)}
                    />
                ) : (
                    <Text style={styles.cellTime}>
                        {time}
                    </Text>
                )}

                {isLastRow ? (
                    <TextInput
                        style={styles.cellLoadInput}
                        value={String(load)}
                        keyboardType="numeric"
                        onChangeText={(val) => updateLoad(index, val)}
                    />
                ) : (
                    <Text style={styles.cellLoad}>
                        {load}
                    </Text>
                )}

                <TextInput
                    style={styles.cellInput}
                    value={item.hf}
                    keyboardType="numeric"
                    onChangeText={(val) => updateHf(index, val)}
                />

                <TextInput
                    style={styles.cellInput}
                    value={item.lactate}
                    keyboardType="decimal-pad"
                    onChangeText={(val) => updateLactate(index, val)}
                />

            </View>
        )
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.cellStage}>{LanguageUtil.getName('stufe')}</Text>
                <Text style={styles.cellTime}>{LanguageUtil.getName('zeit_text')}</Text>
                <Text style={styles.cellLoad}>Watt</Text>
                <Text style={styles.cellInput}>HF</Text>
                <Text style={styles.cellInput}>{LanguageUtil.getName('laktat')}</Text>
            </View>

            {/* LIST */}
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(_, i) => i.toString()}
            />

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        marginTop: 10,
        borderWidth: 1,
        padding: 10
    },

    header: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 5
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },

    // 🔥 ПРОЦЕНТИ (можеш да ги пипаш)
    cellStage: {
        width: '20%'
    },

    cellTime: {
        width: '20%'
    },

    cellLoad: {
        width: '20%'
    },

    cellInput: {
        width: '20%',
        borderWidth: 1,
        padding: 4
    },

    // 🔹 само последният ред ги ползва (виж isLastRow по-горе) — леко
    // различен фон, за да е видно, че точно тези две клетки са редактируеми
    cellTimeInput: {
        width: '20%',
        borderWidth: 1,
        padding: 4,
        backgroundColor: '#fffbe6'
    },

    cellLoadInput: {
        width: '20%',
        borderWidth: 1,
        padding: 4,
        backgroundColor: '#fffbe6'
    }

})