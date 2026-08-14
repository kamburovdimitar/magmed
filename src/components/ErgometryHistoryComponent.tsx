// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass, part 3 (Page11.tsx screen):
//   added no_archived_reports_text and modell_text to Translations.js for
//   "No archived reports" and the "Model:" label; wired "Date:" to the
//   existing `datum` key and the "Apply" button to the existing
//   `uebernehmen` key. Left "IAS:"/"IANS:" hardcoded — abbreviations
//   identical in both languages.
// ============================================

import React from 'react';
import { View, Text, Button } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';

export default function ErgometryHistoryComponent({
    reports,
    onApply,
    onDelete
}: any) {

    if (!reports || reports.length === 0) {

        return (
            <View>
                <Text>
                    {LanguageUtil.getName('no_archived_reports_text')}
                </Text>
            </View>
        );
    }

    return (

        <View>

            {
                reports.map((item: any, index: number) => (

                    <View
                        key={index}
                        style={{
                            borderWidth: 1,
                            padding: 10,
                            marginBottom: 10
                        }}
                    >

                        <Text>
                            {LanguageUtil.getName('datum')}:
                            {' '}
                            {item.createdAt}
                        </Text>

                        <Text>
                            {LanguageUtil.getName('modell_text')}:
                            {' '}
                            {item?.ergometry?.model}
                        </Text>

                        <Text>
                            IAS:
                            {' '}
                            {item?.result?.IAS}
                        </Text>

                        <Text>
                            IANS:
                            {' '}
                            {item?.result?.IANS}
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 8 }}>

                            <View style={{ flex: 1 }}>
                                <Button
                                    title={LanguageUtil.getName('uebernehmen')}
                                    onPress={() => {

                                        onApply(item);
                                    }}
                                />
                            </View>

                            {onDelete && (
                                <View style={{ flex: 1 }}>
                                    <Button
                                        title={LanguageUtil.getName('loeschen')}
                                        color="#c0392b"
                                        onPress={() => {

                                            // 🔹 index, не item.id — по-стари/
                                            // сийдвани records може да нямат
                                            // валидно/уникално id (виждаме
                                            // празни Date/Model полета за
                                            // някои от тях), а филтриране по
                                            // id='' маха всички съвпадащи
                                            // наведнъж вместо само този запис.
                                            onDelete(item, index);
                                        }}
                                    />
                                </View>
                            )}

                        </View>

                    </View>
                ))
            }

        </View>
    );
}