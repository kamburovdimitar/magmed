import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MDPatient } from "../model/MDPatient";

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
            console.log(action)
            state.selectedUser = action.payload;
        },

        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        updateMeasurements: (state, action) => {
            if (!state.selectedUser) return; state.selectedUser =
            {
                ...state.selectedUser, measurements: action.payload
            };
        }
    }
});

export const { setSelectedUser, clearSelectedUser, updateMeasurements } = userSlice.actions;
export default userSlice.reducer;