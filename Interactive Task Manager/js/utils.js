/**
 * Generates a unique ID for a task
 * @returns {string} Unique identifier
 */
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Formats a date string into a more readable format including time
 * @param {string} dateString - YYYY-MM-DDTHH:mm
 * @returns {string} Formatted date (e.g., Oct 15, 2023 at 3:30 PM)
 */
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString(undefined, options);
};

/**
 * Capitalizes the first letter of a string
 * @param {string} string 
 * @returns {string}
 */
const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
