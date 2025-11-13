/**
 * Get current logged in user
 * 
 * @param {Object} state - The state object
 * @returns {Object|null} The current user or null if not authenticated
 */
export const selectCurrentUser = (state) => {
    const userId = state.auth.currentUser;
    return userId ? state.users.byId[userId] : null;
};

/**
 * Get authentication status
 * 
 * @param {Object} state - The state object
 * @returns {boolean} True if authenticated, false otherwise
 */
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;