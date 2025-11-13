/**
 * Generates avatar URL for a given user ID.
 * 
 * @param {string} userId - User ID to generate avatar for
 * @param {number} size - Size of avatar image (default: 150)
 * @returns {string} Avatar URL
 */
export const getAvatarUrl = (userId, size = 150) => {
    return `https://i.pravatar.cc/${size}?u=${userId}`;
};