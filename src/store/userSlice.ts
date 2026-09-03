// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — New Test / Existing Tests / Save feature.
//   `measurements` is now MDTestRecord[] (see MDPatient.tsx's changelog),
//   so the old `updateMeasurements` reducer (which overwrote a single
//   object on every keystroke) no longer matches the shape — replaced with
//   three reducers matching the "real draft + explicit Save" flow decided
//   for Page8.tsx: while editing, changes stay local to Page8's own draft
//   state (not dispatched here at all); only these three moments touch
//   Redux:
//     createTest        -> New Test: push a blank MDTestRecord, make it active
//     setActiveTest      -> Existing Tests -> Apply: just switch the pointer
//     saveActiveTest     -> Save button: commit the draft's data into the
//                           active record in the array (upsert by id)
//   `updateMeasurements` had no other callers in the codebase (Page11.tsx
//   manages its own local state and never dispatched it), so it was removed
//   outright rather than kept alongside the new reducers.
// 2026-08-27 (Europe/Sofia) — DK: "трябва да имаме del бутон до приложи"
//   (Existing Tests panel needs a Delete button next to Apply). Added
//   `deleteTest`, following the exact same reassignment pattern as the
//   reducers below (state.selectedUser = {...} — NOT direct nested
//   mutation, per the 2026-08-11 correctness-fix note right below this).
//   If the deleted test happens to be the currently active one, clears
//   activeTestId so Page8/Page11's existing activeTestId-effect resets the
//   local draft back to a blank MDPatientMeasurements — the same state
//   already shown for a brand-new patient with zero tests.
// 2026-08-11 (Europe/Sofia) — correctness fix: the three reducers above were
//   originally written as direct nested mutations on `state.selectedUser`
//   (e.g. `state.selectedUser.measurements.push(...)`,
//   `state.selectedUser.activeTestId = ...`). `selectedUser` is a class
//   instance (MDPatient), and Immer (which createSlice uses under the hood)
//   only auto-drafts plain objects/arrays — it does NOT draft non-plain
//   class instances. So those mutations could silently touch the real
//   object without producing a new reference for `state.selectedUser`,
//   which meant `useSelector(state => state.user.selectedUser)` in
//   Page8.tsx could miss the change and skip re-rendering. Rewrote all
//   three to always reassign `state.selectedUser = { ...state.selectedUser,
//   ... }`, mirroring the original (proven-safe) `updateMeasurements`
//   reducer's pattern, so every change produces a genuinely new object.
// ============================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MDPatient } from "../model/MDPatient";
import { MDTestRecord } from "../model/MDTestRecord";

interface UserState {
    selectedUser: MDPatient | null;
}

const initialState: UserState = {
    selectedUser: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSelectedUser: (state, action: PayloadAction<MDPatient>) => {
            state.selectedUser = action.payload;
        },

        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },

        // 🔹 New Test: blank record, becomes the active one
        createTest: (state) => {

            if (!state.selectedUser) return;

            const now = new Date().toISOString();

            const existing = state.selectedUser.measurements ?? [];

            const test = new MDTestRecord({
                id: Date.now().toString(),
                // 🔹 auto-name so it's never blank in the UI — user can
                // rename via renameActiveTest (Page8/Page11 header input)
                name: `Test ${existing.length + 1}`,
                createdAt: now,
                updatedAt: now
            });

            const measurements = [
                ...existing,
                test
            ];

            state.selectedUser = {
                ...state.selectedUser,
                measurements,
                activeTestId: test.id
            } as MDPatient;
        },

        // 🔹 Rename the currently active test (header input on Page8/Page11)
        renameActiveTest: (state, action: PayloadAction<string>) => {

            if (!state.selectedUser) return;

            const id = state.selectedUser.activeTestId;

            const list = state.selectedUser.measurements ?? [];

            const index = list.findIndex(t => t.id === id);

            if (index === -1) return;

            const updatedRecord = new MDTestRecord({
                ...list[index],
                name: action.payload
            });

            const measurements = [...list];
            measurements[index] = updatedRecord;

            state.selectedUser = {
                ...state.selectedUser,
                measurements
            } as MDPatient;
        },

        // 🔹 Existing Tests -> Apply: just switch which test is open
        setActiveTest: (state, action: PayloadAction<string>) => {

            if (!state.selectedUser) return;

            state.selectedUser = {
                ...state.selectedUser,
                activeTestId: action.payload
            } as MDPatient;
        },

        // 🔹 Save button: commit the draft's data into the active record
        saveActiveTest: (state, action: PayloadAction<any>) => {

            if (!state.selectedUser) return;

            const id = state.selectedUser.activeTestId;

            const list = state.selectedUser.measurements ?? [];

            const index = list.findIndex(t => t.id === id);

            if (index === -1) return;

            const updatedRecord = new MDTestRecord({
                ...list[index],
                data: action.payload,
                updatedAt: new Date().toISOString()
            });

            const measurements = [...list];
            measurements[index] = updatedRecord;

            state.selectedUser = {
                ...state.selectedUser,
                measurements
            } as MDPatient;
        },

        // 🔹 Existing Tests -> DEL: permanently remove a test record
        deleteTest: (state, action: PayloadAction<string>) => {

            if (!state.selectedUser) return;

            const list = state.selectedUser.measurements ?? [];

            const measurements = list.filter(t => t.id !== action.payload);

            const wasActive = state.selectedUser.activeTestId === action.payload;

            state.selectedUser = {
                ...state.selectedUser,
                measurements,
                activeTestId: wasActive ? '' : state.selectedUser.activeTestId
            } as MDPatient;
        }
    }
});

export const {
    setSelectedUser,
    clearSelectedUser,
    createTest,
    setActiveTest,
    saveActiveTest,
    renameActiveTest,
    deleteTest
} = userSlice.actions;

export default userSlice.reducer;