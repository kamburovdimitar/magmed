// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass, part 3 (Page11.tsx screen):
//   added no_archived_reports_text and modell_text to Translations.js for
//   "No archived reports" and the "Model:" label; wired "Date:" to the
//   existing `datum` key and the "Apply" button to the existing
//   `uebernehmen` key. Left "IAS:"/"IANS:" hardcoded — abbreviations
//   identical in both languages.
// ============================================

import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import LanguageUtil from '../utils/LanguageUtil';

// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-19 (Europe/Sofia) — DK: след "Add" (нов archive запис) или
//   "Apply" (зареден стар запис), съответният елемент в тоя списък трябва
//   видимо да изглежда селектнат — досега нямаше никакъв визуален
//   индикатор кой запис "представляват" текущите данни. selectedReportId
//   идва от Page11.tsx (loadedReportId) и просто оцветява реда, чийто
//   item.id съвпада.
// 2026-08-19 (2) — DK: "delete от листа е изчезнал" — Page11.tsx винаги е
//   подавал onDelete={requestDeleteArchiveReport} на тоя компонент, но
//   компонентът никога не го е ползвал/дестрактурал и никога не е
//   рендервал Delete бутон — самата delete логика (ConfirmDialogComponent
//   модал, requestDeleteArchiveReport/confirmDeleteArchiveReport в
//   Page11.tsx) винаги си е била наред, просто нямаше как да се задейства
//   оттук. Добавен Delete бутон до Apply, ползва съществуващия 'loeschen'
//   ключ (Löschen/Delete), подава (item, index) на onDelete.
// 2026-08-19 (3) — DK: "когато селектна нещата от списъка, искам да ми
//   зарежда нещата избрани от него в компонента" — досега трябваше изрично
//   да цъкнеш "Apply", отделно от избора/селекцията на реда. Сега цялата
//   картичка е цъкаема — селектирането Е зареждането (onApply(item)),
//   отделният "Apply" бутон отпадна (същия принцип като сливането на
//   Save/Generate+Add в Page11.tsx). Delete спира propagation, за да не
//   тригерне и apply при цъкване върху него.
// ============================================

export default function ErgometryHistoryComponent({
    reports,
    onApply,
    onDelete,
    selectedReportId
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
                reports.map((item: any, index: number) => {

                    const isSelected = selectedReportId != null && item?.id === selectedReportId;

                    return (

                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={() => {

                            onApply(item);
                        }}
                        style={{
                            borderWidth: isSelected ? 2 : 1,
                            borderColor: isSelected ? '#2f6fed' : '#000',
                            backgroundColor: isSelected ? '#eaf1ff' : 'transparent',
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

                        {
                            onDelete &&

                            <View style={{ alignItems: 'flex-start', marginTop: 6 }}>

                                <Button
                                    title={LanguageUtil.getName('loeschen')}
                                    onPress={(e: any) => {

                                        // 🔹 спираме propagation-а, за да не
                                        // тригерне и onApply на родителската
                                        // картичка (уеб/RN-web nested touchables)
                                        e?.stopPropagation?.();

                                        onDelete(item, index);
                                    }}
                                />

                            </View>
                        }

                    </TouchableOpacity>
                    );
                })
            }

        </View>
    );
}