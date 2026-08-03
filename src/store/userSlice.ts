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

            console.log("REDUCER START");

            console.log(action.payload);

            if (!state.selectedUser) {

                console.log("NO USER");

                return;

            }

            console.log("USER EXISTS");

            state.selectedUser = {

                ...state.selectedUser,

                measurements: action.payload

            };

            console.log("STATE AFTER");

            console.log(state.selectedUser);

            console.log(state.selectedUser.measurements);

        }
    }
});

export const { setSelectedUser, clearSelectedUser, updateMeasurements } = userSlice.actions;
export default userSlice.reducer;