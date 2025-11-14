import { createSelector } from '@reduxjs/toolkit';

/**
 * Get current effective user (impersonated user if impersonating, otherwise logged-in user)
 * 
 * @param {Object} state - State object
 * @returns {Object|null} Current user or null if not authenticated
 * 
 *   References:
 *   - https://redux.js.org/usage/deriving-data-selectors
 */
export const selectCurrentUser = (state) => {
    const userId = state.auth.currentUser;
    return userId ? state.users.byId[userId] : null;
};

/**
 * Get logged-in user (actual authenticated user, not impersonated)
 * 
 * @param {Object} state - State object
 * @returns {Object|null} Logged-in user or null if not authenticated
 */
export const selectLoggedInUser = (state) => {
    const isImpersonating = state.auth.impersonation?.isImpersonating;
    const userId = isImpersonating
        ? state.auth.impersonation.originalUserId
        : state.auth.currentUser;
    return userId ? state.users.byId[userId] : null;
};

/**
 * Get authentication status
 * 
 * @param {Object} state - State object
 * @returns {boolean} True if authenticated, false otherwise
 */
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

/**
 * Get impersonation status
 * 
 * @param {Object} state - State object
 * @returns {boolean} True if currently impersonating, false otherwise
 */
export const selectIsImpersonating = (state) =>
    state.auth.impersonation?.isImpersonating || false;

/**
 * Get impersonated user
 * 
 * @param {Object} state - State object
 * @returns {Object|null} Impersonated user or null if not impersonating
 */
export const selectImpersonatedUser = (state) => {
    const userId = state.auth.impersonation?.impersonatedUserId;
    return userId ? state.users.byId[userId] : null;
};

/**
 * Get users available for impersonation (all users except the logged-in user)
 * 
 * Memoized to prevent unnecessary re-renders
 * 
 * @param {Object} state - State object
 * @returns {Array} Array of users available for impersonation
 * 
 *   References:
 *   - https://redux.js.org/usage/deriving-data-selectors#creating-unique-selector-instances
 */
export const selectAvailableUsersForImpersonation = createSelector(
    [
        (state) => state.users.byId,
        selectLoggedInUser
    ],
    (usersById, loggedInUser) => {
        const allUsers = Object.values(usersById);
        return allUsers.filter(user => user.id !== loggedInUser?.id);
    }
);

/**
 * Get leaderboard data sorted by total score (questions answered + questions created)
 * 
 * @param {Object} state - State object
 * @returns {Array} Array of users with their stats, sorted by total score descending
 */
export const selectLeaderboard = createSelector(
    [(state) => state.users.byId],
    (usersById) => {
        const users = Object.values(usersById);

        return users
            .map(user => ({
                id: user.id,
                name: user.name,
                avatarURL: user.avatarURL,
                answeredCount: Object.keys(user.answers || {}).length,
                createdCount: (user.questions || []).length,
                totalScore: Object.keys(user.answers || {}).length + (user.questions || []).length
            }))
            .sort((a, b) => b.totalScore - a.totalScore);
    }
);