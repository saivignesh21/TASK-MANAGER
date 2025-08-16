// Task & Habit Tracker Application
class TaskHabitApp {
    constructor() {
        // Initialize data with sample data since localStorage is not available
        this.tasks = [
            {
                id: 1,
                title: "Complete project proposal",
                description: "Finish the Q1 project proposal for the marketing campaign",
                priority: "high",
                dueDate: "2025-08-18",
                completed: false,
                createdAt: "2025-08-16"
            },
            {
                id: 2,
                title: "Buy groceries",
                description: "Get milk, bread, and vegetables for the week",
                priority: "medium",
                dueDate: "2025-08-17",
                completed: false,
                createdAt: "2025-08-16"
            },
            {
                id: 3,
                title: "Review team feedback",
                description: "Go through the feedback from last week's presentation",
                priority: "low",
                dueDate: "2025-08-20",
                completed: true,
                createdAt: "2025-08-15"
            }
        ];

        this.habits = [
            {
                id: 1,
                name: "Drink 8 glasses of water",
                description: "Stay hydrated throughout the day",
                category: "health",
                frequency: "daily",
                streak: 5,
                completedDates: ["2025-08-12", "2025-08-13", "2025-08-14", "2025-08-15", "2025-08-16"]
            },
            {
                id: 2,
                name: "30 minutes exercise",
                description: "Do cardio or strength training",
                category: "fitness",
                frequency: "daily",
                streak: 3,
                completedDates: ["2025-08-14", "2025-08-15", "2025-08-16"]
            },
            {
                id: 3,
                name: "Read for 20 minutes",
                description: "Read books or educational content",
                category: "learning",
                frequency: "daily",
                streak: 8,
                completedDates: ["2025-08-09", "2025-08-10", "2025-08-11", "2025-08-12", "2025-08-13", "2025-08-14", "2025-08-15", "2025-08-16"]
            }
        ];

        this.motivationalQuotes = [
            "The secret of getting ahead is getting started.",
            "Success is the sum of small efforts repeated day in and day out.",
            "Don't watch the clock; do what it does. Keep going.",
            "The only way to do great work is to love what you do.",
            "Believe you can and you're halfway there."
        ];

        this.currentView = 'dashboard';
        this.currentTaskId = 0;
        this.currentHabitId = 0;
        this.isDarkMode = false;
        this.weeklyChart = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDashboard();
        this.renderTasks();
        this.renderHabits();
        this.updateStatistics();
        this.setDailyQuote();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Task management
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.openTaskModal();
        });

        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        document.getElementById('closeTaskModal').addEventListener('click', () => {
            this.closeTaskModal();
        });

        document.getElementById('cancelTask').addEventListener('click', () => {
            this.closeTaskModal();
        });

        // Habit management
        document.getElementById('addHabitBtn').addEventListener('click', () => {
            this.openHabitModal();
        });

        document.getElementById('habitForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveHabit();
        });

        document.getElementById('closeHabitModal').addEventListener('click', () => {
            this.closeHabitModal();
        });

        document.getElementById('cancelHabit').addEventListener('click', () => {
            this.closeHabitModal();
        });

        // Filters
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.renderTasks();
        });

        document.getElementById('priorityFilter').addEventListener('change', () => {
            this.renderTasks();
        });

        // Modal backdrop clicks
        document.querySelectorAll('.modal__backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    switchView(viewName) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('nav-item--active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('nav-item--active');

        // Show/hide views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('view--active');
        });
        document.getElementById(viewName).classList.add('view--active');

        this.currentView = viewName;

        // Update view-specific content
        if (viewName === 'dashboard') {
            this.updateDashboard();
        } else if (viewName === 'stats') {
            this.updateStatistics();
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        const themeIcon = document.querySelector('.theme-toggle__icon');
        
        if (this.isDarkMode) {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
            themeIcon.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-color-scheme', 'light');
            themeIcon.textContent = '🌙';
        }
    }

    // Task Management
    openTaskModal(task = null) {
        const modal = document.getElementById('taskModal');
        const title = document.getElementById('taskModalTitle');
        const form = document.getElementById('taskForm');

        this.currentTaskId = task ? task.id : 0;

        if (task) {
            title.textContent = 'Edit Task';
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskDueDate').value = task.dueDate;
        } else {
            title.textContent = 'Add New Task';
            form.reset();
        }

        modal.classList.remove('hidden');
    }

    closeTaskModal() {
        document.getElementById('taskModal').classList.add('hidden');
        document.getElementById('taskForm').reset();
        this.currentTaskId = 0;
    }

    saveTask() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (!title.trim()) {
            alert('Please enter a task title');
            return;
        }

        if (this.currentTaskId === 0) {
            // Add new task
            const newTask = {
                id: Date.now(),
                title: title.trim(),
                description: description.trim(),
                priority,
                dueDate,
                completed: false,
                createdAt: new Date().toISOString().split('T')[0]
            };
            this.tasks.push(newTask);
        } else {
            // Update existing task
            const taskIndex = this.tasks.findIndex(t => t.id === this.currentTaskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = {
                    ...this.tasks[taskIndex],
                    title: title.trim(),
                    description: description.trim(),
                    priority,
                    dueDate
                };
            }
        }

        this.closeTaskModal();
        this.renderTasks();
        this.updateDashboard();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.renderTasks();
            this.updateDashboard();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.renderTasks();
            this.updateDashboard();
        }
    }

    renderTasks() {
        const container = document.getElementById('taskList');
        const statusFilter = document.getElementById('statusFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;

        let filteredTasks = this.tasks;

        if (statusFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => 
                statusFilter === 'completed' ? task.completed : !task.completed
            );
        }

        if (priorityFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
        }

        container.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.completed ? 'task-item--completed' : ''}">
                <div class="task-item__header">
                    <div class="task-checkbox ${task.completed ? 'task-checkbox--checked' : ''}" 
                         onclick="app.toggleTask(${task.id})">
                        ${task.completed ? '✓' : ''}
                    </div>
                    <h3 class="task-item__title">${task.title}</h3>
                    <span class="priority-badge priority-badge--${task.priority}">${task.priority}</span>
                </div>
                ${task.description ? `<p class="task-item__description">${task.description}</p>` : ''}
                <div class="task-item__footer">
                    <span>Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                    <div class="task-actions">
                        <button class="task-action" onclick="app.openTaskModal(app.tasks.find(t => t.id === ${task.id}))">Edit</button>
                        <button class="task-action task-action--delete" onclick="app.deleteTask(${task.id})">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateTaskProgress();
    }

    updateTaskProgress() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        document.getElementById('taskProgress').style.width = `${percentage}%`;
        document.getElementById('taskProgressText').textContent = `${percentage}% completed`;
    }

    // Habit Management
    openHabitModal(habit = null) {
        const modal = document.getElementById('habitModal');
        const title = document.getElementById('habitModalTitle');
        const form = document.getElementById('habitForm');

        this.currentHabitId = habit ? habit.id : 0;

        if (habit) {
            title.textContent = 'Edit Habit';
            document.getElementById('habitName').value = habit.name;
            document.getElementById('habitDescription').value = habit.description;
            document.getElementById('habitCategory').value = habit.category;
            document.getElementById('habitFrequency').value = habit.frequency;
        } else {
            title.textContent = 'Add New Habit';
            form.reset();
        }

        modal.classList.remove('hidden');
    }

    closeHabitModal() {
        document.getElementById('habitModal').classList.add('hidden');
        document.getElementById('habitForm').reset();
        this.currentHabitId = 0;
    }

    saveHabit() {
        const name = document.getElementById('habitName').value;
        const description = document.getElementById('habitDescription').value;
        const category = document.getElementById('habitCategory').value;
        const frequency = document.getElementById('habitFrequency').value;

        if (!name.trim()) {
            alert('Please enter a habit name');
            return;
        }

        if (this.currentHabitId === 0) {
            // Add new habit
            const newHabit = {
                id: Date.now(),
                name: name.trim(),
                description: description.trim(),
                category,
                frequency,
                streak: 0,
                completedDates: []
            };
            this.habits.push(newHabit);
        } else {
            // Update existing habit
            const habitIndex = this.habits.findIndex(h => h.id === this.currentHabitId);
            if (habitIndex !== -1) {
                this.habits[habitIndex] = {
                    ...this.habits[habitIndex],
                    name: name.trim(),
                    description: description.trim(),
                    category,
                    frequency
                };
            }
        }

        this.closeHabitModal();
        this.renderHabits();
        this.updateDashboard();
    }

    toggleHabitCompletion(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        const today = new Date().toISOString().split('T')[0];
        const isCompletedToday = habit.completedDates.includes(today);

        if (isCompletedToday) {
            // Remove today from completed dates
            habit.completedDates = habit.completedDates.filter(date => date !== today);
            // Recalculate streak
            this.calculateHabitStreak(habit);
        } else {
            // Add today to completed dates
            habit.completedDates.push(today);
            habit.completedDates.sort();
            // Update streak
            habit.streak++;
        }

        this.renderHabits();
        this.updateDashboard();
    }

    calculateHabitStreak(habit) {
        if (habit.completedDates.length === 0) {
            habit.streak = 0;
            return;
        }

        const sortedDates = habit.completedDates.sort().reverse();
        let streak = 0;
        let currentDate = new Date();

        for (let i = 0; i < sortedDates.length; i++) {
            const completedDate = new Date(sortedDates[i]);
            const diffDays = Math.floor((currentDate - completedDate) / (1000 * 60 * 60 * 24));

            if (i === 0 && diffDays <= 1) {
                streak = 1;
                currentDate = completedDate;
            } else if (diffDays === 1) {
                streak++;
                currentDate = completedDate;
            } else {
                break;
            }
        }

        habit.streak = streak;
    }

    deleteHabit(habitId) {
        if (confirm('Are you sure you want to delete this habit?')) {
            this.habits = this.habits.filter(h => h.id !== habitId);
            this.renderHabits();
            this.updateDashboard();
        }
    }

    renderHabits() {
        const container = document.getElementById('habitList');
        const today = new Date().toISOString().split('T')[0];

        container.innerHTML = this.habits.map(habit => {
            const isCompletedToday = habit.completedDates.includes(today);
            return `
                <div class="habit-card">
                    <div class="habit-card__header">
                        <h3 class="habit-card__title">${habit.name}</h3>
                        <span class="category-badge category-badge--${habit.category}">${habit.category}</span>
                    </div>
                    ${habit.description ? `<p class="habit-card__description">${habit.description}</p>` : ''}
                    <div class="habit-streak">
                        <span class="streak-number">${habit.streak}</span>
                        <span class="streak-label">day streak</span>
                    </div>
                    <div class="habit-actions">
                        <button class="habit-complete-btn ${isCompletedToday ? 'habit-complete-btn--completed' : ''}" 
                                onclick="app.toggleHabitCompletion(${habit.id})">
                            ${isCompletedToday ? 'Completed Today ✓' : 'Mark Complete'}
                        </button>
                        <button class="task-action" onclick="app.openHabitModal(app.habits.find(h => h.id === ${habit.id}))">Edit</button>
                        <button class="task-action task-action--delete" onclick="app.deleteHabit(${habit.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Dashboard Updates
    updateDashboard() {
        const today = new Date().toISOString().split('T')[0];
        
        // Task statistics
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const totalTasks = this.tasks.length;
        
        // Habit statistics
        const habitsCompletedToday = this.habits.filter(h => 
            h.completedDates.includes(today)
        ).length;
        
        // Longest streak
        const longestStreak = Math.max(0, ...this.habits.map(h => h.streak));
        
        // Productivity score
        const taskScore = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const habitScore = this.habits.length > 0 ? (habitsCompletedToday / this.habits.length) * 100 : 0;
        const productivityScore = Math.round((taskScore + habitScore) / 2);

        // Update dashboard stats
        document.getElementById('tasksCompleted').textContent = `${completedTasks}/${totalTasks}`;
        document.getElementById('habitsCompleted').textContent = `${habitsCompletedToday}/${this.habits.length}`;
        document.getElementById('currentStreak').textContent = longestStreak;
        document.getElementById('productivityScore').textContent = `${productivityScore}%`;

        // Update today's tasks
        this.renderTodayTasks();
    }

    renderTodayTasks() {
        const container = document.getElementById('todayTasks');
        const today = new Date().toISOString().split('T')[0];
        
        const todayTasks = this.tasks.filter(task => 
            task.dueDate === today || (!task.completed && !task.dueDate)
        ).slice(0, 5);

        if (todayTasks.length === 0) {
            container.innerHTML = '<p>No tasks for today. Great job!</p>';
            return;
        }

        container.innerHTML = todayTasks.map(task => `
            <div class="task-summary-item">
                <div class="task-checkbox ${task.completed ? 'task-checkbox--checked' : ''}" 
                     onclick="app.toggleTask(${task.id})">
                    ${task.completed ? '✓' : ''}
                </div>
                <span class="${task.completed ? 'task-item--completed' : ''}">${task.title}</span>
                <span class="priority-badge priority-badge--${task.priority}">${task.priority}</span>
            </div>
        `).join('');
    }

    setDailyQuote() {
        const quote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
        document.getElementById('dailyQuote').textContent = quote;
    }

    // Statistics
    updateStatistics() {
        this.renderWeeklyChart();
        this.renderHabitStreaks();
    }

    renderWeeklyChart() {
        const ctx = document.getElementById('weeklyChart').getContext('2d');
        
        // Generate weekly data
        const weekData = this.generateWeeklyData();
        
        if (this.weeklyChart) {
            this.weeklyChart.destroy();
        }

        this.weeklyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Tasks Completed',
                    data: weekData.tasks,
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    tension: 0.4
                }, {
                    label: 'Habits Completed',
                    data: weekData.habits,
                    backgroundColor: '#FFC185',
                    borderColor: '#FFC185',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    generateWeeklyData() {
        // Generate sample weekly data based on current data
        const taskData = [2, 3, 1, 4, 2, 1, 3];
        const habitData = [3, 2, 3, 3, 2, 1, 2];
        
        return {
            tasks: taskData,
            habits: habitData
        };
    }

    renderHabitStreaks() {
        const container = document.getElementById('habitStreaks');
        
        const sortedHabits = [...this.habits].sort((a, b) => b.streak - a.streak);
        
        container.innerHTML = sortedHabits.map(habit => `
            <div class="habit-streak-item">
                <div>
                    <div style="font-weight: var(--font-weight-medium);">${habit.name}</div>
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${habit.category}</div>
                </div>
                <div style="font-weight: var(--font-weight-bold); color: var(--color-primary);">${habit.streak} days</div>
            </div>
        `).join('');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TaskHabitApp();
});