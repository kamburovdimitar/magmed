import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
// 🔹 2026-08-20 — DK: "Training – Gesundheit" модул, #XZ# е първата
// глобална (app-wide) настройка в приложението — виж settingsSlice.ts.
import settingsReducer from "./settingsSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        settings: settingsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;