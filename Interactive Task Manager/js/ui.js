class UI {
    static taskListElement = document.getElementById('task-list');
    static emptyStateElement = document.getElementById('empty-state');
    
    /**
     * Renders the list of tasks
     * @param {Array} tasks 
     * @param {Object} callbacks - Functions for task actions
     */
    static renderTasks(tasks, callbacks) {
        this.taskListElement.innerHTML = '';
        
        if (tasks.length === 0) {
            this.emptyStateElement.classList.remove('hidden');
        } else {
            this.emptyStateElement.classList.add('hidden');
            
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.setAttribute('data-id', task.id);
                li.setAttribute('draggable', 'true');
                
                const dueDateDisplay = task.dueDate 
                    ? `<span class="task-date" title="Due Date"><i class="far fa-calendar"></i> ${formatDate(task.dueDate)}</span>` 
                    : '';

                li.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
                    <div class="task-content">
                        <span class="task-text">${this.escapeHTML(task.text)}</span>
                        <div class="task-meta">
                            <span class="task-priority priority-${task.priority}">
                                ${capitalize(task.priority)}
                            </span>
                            ${dueDateDisplay}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn edit-btn" aria-label="Edit Task" title="Edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="action-btn delete-btn" aria-label="Delete Task" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

                // Add Event Listeners
                const checkbox = li.querySelector('.task-checkbox');
                checkbox.addEventListener('change', () => callbacks.onToggleComplete(task.id));

                const deleteBtn = li.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    // Start removing animation
                    li.classList.add('removing');
                    setTimeout(() => callbacks.onDelete(task.id), 300);
                });

                const editBtn = li.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => callbacks.onEdit(task));

                // Drag and Drop Listeners
                li.addEventListener('dragstart', (e) => callbacks.onDragStart(e, task.id));
                li.addEventListener('dragover', (e) => callbacks.onDragOver(e));
                li.addEventListener('drop', (e) => callbacks.onDrop(e, task.id));
                li.addEventListener('dragenter', (e) => e.preventDefault());
                li.addEventListener('dragend', () => li.classList.remove('dragging'));

                this.taskListElement.appendChild(li);
            });
        }
    }

    /**
     * Updates statistics displays
     * @param {Array} tasks 
     */
    static updateStats(tasks) {
        document.getElementById('stat-total').textContent = tasks.length;
        document.getElementById('stat-active').textContent = tasks.filter(t => !t.completed).length;
        document.getElementById('stat-completed').textContent = tasks.filter(t => t.completed).length;
    }

    /**
     * Escapes HTML to prevent XSS
     */
    static escapeHTML(str) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }

    /**
     * Update active filter button visually
     */
    static updateFilterButtons(activeFilter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === activeFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Applies the selected theme
     * @param {string} theme ('dark' or 'light')
     */
    static applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const toggleBtn = document.getElementById('theme-toggle');
        if (theme === 'dark') {
            toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    /**
     * Displays a task value back in the form for editing
     */
    static setFormForEditing(task) {
        document.getElementById('task-input').value = task.text;
        document.getElementById('task-priority').value = task.priority;
        
        if (window.fpInstance) {
            window.fpInstance.setDate(task.dueDate || null);
        }

        document.getElementById('task-input').focus();
    }

    /**
     * Display a sleek toast notification
     * @param {string} message 
     * @param {string} type ('success', 'error', 'info')
     */
    static showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconClasses = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="${iconClasses[type]}"></i>
            <span>${this.escapeHTML(message)}</span>
        `;

        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('removing');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }
}
