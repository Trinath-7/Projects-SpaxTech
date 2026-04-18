const STORAGE_KEY = 'interactive_task_manager_data';
const THEME_KEY = 'interactive_task_manager_theme';

/**
 * Task Object Structure:
 * {
 *   id: string,
 *   text: string,
 *   completed: boolean,
 *   createdAt: number,
 *   priority: 'low' | 'medium' | 'high',
 *   dueDate: string
 * }
 */

class Storage {
    /**
     * Get tasks from local storage
     * @returns {Array} List of tasks
     */
    static getTasks() {
        try {
            const tasks = localStorage.getItem(STORAGE_KEY);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error reading tasks from storage', error);
            return [];
        }
    }

    /**
     * Save tasks to local storage
     * @param {Array} tasks - List of tasks
     */
    static saveTasks(tasks) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks to storage', error);
        }
    }

    /**
     * Get theme from local storage
     * @returns {string} 'dark' or 'light'
     */
    static getTheme() {
        return localStorage.getItem(THEME_KEY) || 'light';
    }

    /**
     * Save theme to local storage
     * @param {string} theme - 'dark' or 'light'
     */
    static saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }
}
