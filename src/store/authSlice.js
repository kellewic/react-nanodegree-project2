/**
 * This slice is responsible for managing authentication state.
 * 
 *   References:
 *   - https://redux-toolkit.js.org/tutorials/quick-start#create-a-redux-state-slice
 *   - https://redux-toolkit.js.org/api/createSlice
 */
import { createSlice } from '@reduxjs/toolkit';

export const AUTH_STORAGE_KEY = 'employeePolls_auth';

// Default impersonation state
const defaultImpersonation = {
    isImpersonating: false,
    impersonatedUserId: null,
    originalUserId: null
};

// Try to restore auth from localStorage on init
const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
const initialAuth = savedAuth ? {
    ...JSON.parse(savedAuth),
    // Ensure impersonation exists (backward compatibility with old localStorage)
    impersonation: JSON.parse(savedAuth).impersonation || defaultImpersonation
} : {
    currentUser: null,
    isAuthenticated: false,
    impersonation: defaultImpersonation
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuth,
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            // Ensure impersonation exists
            if (!state.impersonation) {
                state.impersonation = {
                    isImpersonating: false,
                    impersonatedUserId: null,
                    originalUserId: null
                };
            }
            // Persist to localStorage
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
                currentUser: action.payload,
                isAuthenticated: true,
                impersonation: state.impersonation
            }));
        },
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            // Stop impersonation on logout
            state.impersonation = {
                isImpersonating: false,
                impersonatedUserId: null,
                originalUserId: null
            };
            // Clear from localStorage
            localStorage.removeItem(AUTH_STORAGE_KEY);
        },
        startImpersonation: (state, action) => {
            // Ensure impersonation object exists (defensive check)
            if (!state.impersonation) {
                state.impersonation = {
                    isImpersonating: false,
                    impersonatedUserId: null,
                    originalUserId: null
                };
            }
            // Store original user if not already impersonating
            if (!state.impersonation.isImpersonating) {
                state.impersonation.originalUserId = state.currentUser;
            }
            state.impersonation.isImpersonating = true;
            state.impersonation.impersonatedUserId = action.payload;
            state.currentUser = action.payload;
            // Persist to localStorage
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
                currentUser: state.currentUser,
                isAuthenticated: state.isAuthenticated,
                impersonation: state.impersonation
            }));
        },
        stopImpersonation: (state) => {
            // Ensure impersonation object exists (defensive check)
            if (!state.impersonation) {
                return;
            }
            // Restore original user
            state.currentUser = state.impersonation.originalUserId;
            state.impersonation = {
                isImpersonating: false,
                impersonatedUserId: null,
                originalUserId: null
            };
            // Persist to localStorage
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
                currentUser: state.currentUser,
                isAuthenticated: state.isAuthenticated,
                impersonation: state.impersonation
            }));
        }
    }
});

export const { login, logout, startImpersonation, stopImpersonation } = authSlice.actions;
export default authSlice.reducer;