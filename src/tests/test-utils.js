import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import usersReducer, { USERS_STORAGE_KEY } from '../store/usersSlice';
import authReducer, { AUTH_STORAGE_KEY } from '../store/authSlice';
import { getAvatarUrl } from '../utils/user';

/**
 * Creates a mock Redux store for testing with optional preloaded state.
 * 
 * @param {Object} preloadedState - Optional preloaded state for the store
 * @returns {Object} The mock Redux store
 */
export function createMockStore(preloadedState = {}) {
    return configureStore({
        reducer: {
            users: usersReducer,
            auth: authReducer,
        },
        preloadedState,
    });
}

/**
 * Custom render function that includes Redux Provider and Router.
 * Use this instead of @testing-library/react's render function.
 * 
 * @param {React.ReactNode} ui - The UI to render
 * @param {Object} renderOptions - Optional render options
 * @returns {Object} The rendered component and the mock Redux store
 */
export function renderWithProviders(
    ui,
    {
        preloadedState = {},
        store = createMockStore(preloadedState),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </Provider>
        );
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

/**
 * Creates a mock user object for testing
 * 
 * @param {Object} overrides - Optional overrides for mock user object
 * @returns {Object} Mock user object
 */
export function createMockUser(overrides = {}) {
    const userId = overrides.id || 'testuser';
    return {
        id: userId,
        name: 'Test User',
        password: 'password123',
        avatarURL: getAvatarUrl(userId),
        answers: {},
        questions: [],
        ...overrides,
    };
}

// ============================================================================
// LocalStorage Helper Functions
// ============================================================================

/**
 * Helper to set up localStorage with existing users for testing.
 * 
 * @param {Object} users - Object with userId as key and user object as value
 */
export function setupLocalStorageUsers(users = {}) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Helper to get users from localStorage during tests.
 * 
 * @returns {Object} Object with userId as key and user object as value
 */
export function getLocalStorageUsers() {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
}

/**
 * Helper to set up auth state in localStorage for testing.
 * 
 * @param {string|null} userId - User ID to set as authenticated, or null to clear auth
 */
export function setupLocalStorageAuth(userId) {
    if (userId) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            currentUser: userId,
            isAuthenticated: true
        }));
    } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
}

/**
 * Helper to get auth from localStorage during tests.
 * 
 * @returns {Object|null} Auth object with currentUser and isAuthenticated, or null if not set
 */
export function getLocalStorageAuth() {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    return auth ? JSON.parse(auth) : null;
}