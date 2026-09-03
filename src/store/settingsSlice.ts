// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-20 (Europe/Sofia) — DK: "Training – Gesundheit" модул (5 нови
//   PDF-а, план обсъден с DK преди имплементация). Новият Codex код #XZ#
//   (Fahrrad↔Laufband HF корекция при смяна на ергометър, по подразбиране
//   ±10 уд/мин, регулируема 0–20) е ПЪРВАТА глобална (app-wide, не
//   per-пациент/per-тест) настройка в приложението — досега `store.ts`
//   имаше само `user` slice (`selectedUser: MDPatient`), няма съществуващо
//   място за такива стойности. Нов, минимален slice — държи само `#XZ#`
//   засега; други бъдещи глобални настройки могат да се добавят тук
//   по-късно, вместо да се плодят отделни slice-ове за всяка една.
//
// 2026-08-25 (Europe/Sofia) — DK: "навсякъде преводи на български, за да
//   мога да се ориентирам" + "нека има опция български в сетингс и да може
//   когато цъкнем на него всичко да се преименува на бг, по дефолт засега
//   да е бг за теста". Езикът досега живееше в LanguageUtil.language —
//   обикновено static class поле, НЕ Redux state, затова SettingsComponent
//   реално сменяше стойността, но никой компонент не беше subscribe-нат за
//   промяна -> екраните не се преренд(ваха, докато не навигираш другаде.
//   Преместено в Redux (тук) — LanguageUtil.getName() чете директно от
//   store-а (виж LanguageUtil.js), а App.tsx е subscribe-нат през
//   useSelector, за да предизвика реален rerender на цялото дърво при смяна.
//   Подразбиране 'bg' (per DK, "по дефолт засега да е бг за теста").
// ============================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppLanguage = 'bg' | 'en' | 'de';

interface SettingsState {
    // #XZ# — Fahrrad↔Laufband HF корекция, уд/мин. MAGMED Codex
    // подразбиране: 10 (диапазон 0–20, регулируем в настройките).
    xzCorrection: number;

    // 🔹 текущ език на интерфейса — виж changelog-а по-горе.
    language: AppLanguage;
}

const initialState: SettingsState = {
    xzCorrection: 10,
    language: 'bg'
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setXzCorrection: (state, action: PayloadAction<number>) => {

            // 🔹 clamp към официалния диапазон 0–20 (MAGMED Codex #XZ#)
            const clamped = Math.min(
                20,
                Math.max(
                    0,
                    action.payload
                )
            );

            state.xzCorrection = clamped;
        },

        setLanguage: (state, action: PayloadAction<AppLanguage>) => {
            state.language = action.payload;
        }
    }
});

export const {
    setXzCorrection,
    setLanguage
} = settingsSlice.actions;

export default settingsSlice.reducer;
