document.addEventListener('DOMContentLoaded', () => {
    // Application State
    let tasks = Storage.getTasks();
    let currentFilter = 'all';
    let draggedTaskId = null;
    let editingTaskId = null;

    // Callbacks object to pass into UI rendering
    const uiCallbacks = {
        onToggleComplete: (id) => toggleTaskStatus(id),
        onDelete: (id) => deleteTask(id),
        onEdit: (task) => editTask(task),
        onDragStart: (e, id) => {
            draggedTaskId = id;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', id);
        },
        onDragOver: (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const taskList = document.getElementById('task-list');
            const draggingElement = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(taskList, e.clientY);
            
            if (afterElement == null) {
                taskList.appendChild(draggingElement);
            } else {
                taskList.insertBefore(draggingElement, afterElement);
            }
        },
        onDrop: (e, targetId) => {
            e.preventDefault();
            if (!draggedTaskId || draggedTaskId === targetId) return;

            // Update array order based on DOM
            const taskElements = [...document.querySelectorAll('.task-item')];
            const draggedElementIndex = taskElements.findIndex(el => el.getAttribute('data-id') === draggedTaskId);
            
            // Reorder array
            const draggedTaskIndex = tasks.findIndex(t => t.id === draggedTaskId);
            const taskToMove = tasks.splice(draggedTaskIndex, 1)[0];
            
            // Assuming DOM order matches target index after insertion
            tasks.splice(draggedElementIndex, 0, taskToMove);
            
            saveAndRender();
        }
    };

    /**
     * Determines which element cursor is physically above to support drag and drop insertion
     */
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    const checkNotifications = () => {
        if (!("Notification" in window)) return;
        
        const now = new Date();
        let updated = false;

        tasks.forEach(task => {
            if (!task.completed && task.dueDate && !task.notified) {
                const taskTime = new Date(task.dueDate);
                if (now >= taskTime) {
                    // Time has arrived
                    task.notified = true;
                    updated = true;
                    
                    if (Notification.permission === "granted") {
                        new Notification("Task Master Reminder!", {
                            body: `It's time for: ${task.text}`,
                            icon: "https://cdn-icons-png.flaticon.com/512/906/906334.png" // generic bell icon
                        });
                    } else {
                        UI.showToast(`Reminder: ${task.text}`, 'info');
                    }
                }
            }
        });

        if (updated) {
            Storage.saveTasks(tasks); // Save the 'notified: true' state without a full re-render
        }
    };

    const hourlyReminder = () => {
        if (!("Notification" in window)) return;
        
        const activeTasksCount = tasks.filter(t => !t.completed).length;
        if (activeTasksCount > 0) {
            const message = `You have ${activeTasksCount} active task${activeTasksCount > 1 ? 's' : ''} to complete!`;
            if (Notification.permission === "granted") {
                new Notification("Task Master Hourly Reminder", {
                    body: message,
                    icon: "https://cdn-icons-png.flaticon.com/512/906/906334.png"
                });
            } else {
                UI.showToast(message, 'info');
            }
        }
    };

    // Initialize UI
    const init = () => {
        const savedTheme = Storage.getTheme();
        UI.applyTheme(savedTheme);
        render();

        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }

        // Initialize advanced Flatpickr for Date & Time
        window.fpInstance = flatpickr("#task-datetime", {
            enableTime: true,
            dateFormat: "Y-m-d\\TH:i",
            altInput: true,
            altFormat: "F j, Y - h:i K"
        });

        setInterval(checkNotifications, 10000); // check every 10 seconds for specific due times
        checkNotifications(); // check immediately on load

        // Hourly recurring reminder for pending tasks
        setInterval(hourlyReminder, 3600000); // 3600000 ms = 1 hour
    };

    // Central Render Function
    const render = () => {
        let filteredTasks = tasks;
        
        // Sorting: completed tasks at the bottom
        filteredTasks.sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });

        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        UI.renderTasks(filteredTasks, uiCallbacks);
        UI.updateStats(tasks);
        UI.updateFilterButtons(currentFilter);
    };

    const saveAndRender = () => {
        Storage.saveTasks(tasks);
        render();
    };

    // Core Logic Functions
    const addTask = (text, priority, dueDate) => {
        const newTask = {
            id: generateId(),
            text,
            priority,
            dueDate,
            completed: false,
            notified: false,
            createdAt: Date.now()
        };
        // Add to start of list
        tasks.unshift(newTask);
        saveAndRender();
        UI.showToast('Task added successfully!');
    };

    const updateTask = (id, newText, newPriority, newDueDate) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.text = newText;
            task.priority = newPriority;
            task.dueDate = newDueDate;
            task.notified = false; // Reset notification on edit
            saveAndRender();
            UI.showToast('Task updated!', 'info');
        }
    };

    const toggleTaskStatus = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveAndRender();
            if (task.completed) {
                UI.showToast('Task marked as complete!');
            }
        }
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
        UI.showToast('Task deleted', 'error');
    };

    const editTask = (task) => {
        editingTaskId = task.id;
        UI.setFormForEditing(task);
        const addBtn = document.getElementById('add-btn');
        addBtn.innerHTML = '<i class="fas fa-save"></i> Save';
    };

    // Event Listeners setup
    const setupEventListeners = () => {
        const form = document.getElementById('task-form');
        const input = document.getElementById('task-input');
        const prioritySelect = document.getElementById('task-priority');
        const datetimeInput = document.getElementById('task-datetime');
        const themeToggle = document.getElementById('theme-toggle');
        const filterContainer = document.querySelector('.filters-container');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            const priority = prioritySelect.value;
            const combinedDateTime = datetimeInput.value;

            if (!text) {
                // simple visual feedback for empty submission
                input.style.border = '1px solid var(--danger-color)';
                setTimeout(() => input.style.border = '', 2000);
                return;
            }

            if (editingTaskId) {
                updateTask(editingTaskId, text, priority, combinedDateTime);
                editingTaskId = null;
                document.getElementById('add-btn').innerHTML = '<i class="fas fa-plus"></i> Add';
            } else {
                addTask(text, priority, combinedDateTime);
            }

            // reset form
            form.reset();
            if (window.fpInstance) window.fpInstance.clear();
            prioritySelect.value = 'medium'; // default
            input.focus();
        });

        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                currentFilter = e.target.dataset.filter;
                render();
            }
        });

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            UI.applyTheme(newTheme);
            Storage.saveTheme(newTheme);
        });
    };

    // Bootstrap
    setupEventListeners();
    init();
});
