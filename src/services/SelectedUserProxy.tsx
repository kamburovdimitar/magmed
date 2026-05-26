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
            state.selectedUser = action.payload;
        },

        clearSelectedUser: (state) => {
            state.selectedUser = null;
        }
    }
});

export const { setSelectedUser, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;