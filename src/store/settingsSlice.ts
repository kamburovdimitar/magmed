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
// ============================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
    // #XZ# — Fahrrad↔Laufband HF корекция, уд/мин. MAGMED Codex
    // подразбиране: 10 (диапазон 0–20, регулируем в настройките).
    xzCorrection: number;
}

const initialState: SettingsState = {
    xzCorrection: 10
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
        }
    }
});

export const {
    setXzCorrection
} = settingsSlice.actions;

export default settingsSlice.reducer;
