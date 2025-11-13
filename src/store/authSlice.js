/**
 * This slice is responsible for managing authentication state.
 * 
 *   References:
 *   - https://redux-toolkit.js.org/tutorials/quick-start#create-a-redux-state-slice
 *   - https://redux-toolkit.js.org/api/createSlice
 */
import { createSlice } from '@reduxjs/toolkit';

export const AUTH_STORAGE_KEY = 'employeePolls_auth';

// Try to restore auth from localStorage on init
const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
const initialAuth = savedAuth ? JSON.parse(savedAuth) : {
    currentUser: null,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuth,
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            // Persist to localStorage
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
                currentUser: action.payload,
                isAuthenticated: true
            }));
        },
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            // Clear from localStorage
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;