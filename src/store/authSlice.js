/**
 * This slice is responsible for managing authentication state.
 * 
 *   References:
 *   - https://redux-toolkit.js.org/tutorials/quick-start#create-a-redux-state-slice
 *   - https://redux-toolkit.js.org/api/createSlice
 */
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: null,
        isAuthenticated: false
    },
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;