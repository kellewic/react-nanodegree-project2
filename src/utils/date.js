/**
 * Formats timestamp to human readable date string.
 * 
 * @param {number} timestamp - Timestamp to format
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};