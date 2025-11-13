/**
 * This slice is responsible for managing authentication state.
 * 
 *   References:
 *   - https://redux-toolkit.js.org/tutorials/quick-start#create-a-redux-state-slice
 *   - https://redux-toolkit.js.org/api/createSlice
 */
import { createSlice } from '@reduxjs/toolkit';

// Try to restore auth from localStorage on init
const savedAuth = localStorage.getItem('employeePolls_auth');
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
            localStorage.setItem('employeePolls_auth', JSON.stringify({
                currentUser: action.payload,
                isAuthenticated: true
            }));
        },
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            // Clear from localStorage
            localStorage.removeItem('employeePolls_auth');
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;