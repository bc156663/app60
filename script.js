class HabitTracker {
    constructor() {
        this.habits = [];
        this.completions = {};
        this.currentMonth = new Date();
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.renderHabits();
        this.renderCalendar();
    }

    setupEventListeners() {
        // Add habit
        document.getElementById('addHabitBtn').addEventListener('click', () => this.addHabit());
        document.getElementById('habitInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addHabit();
        });

        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextMonth').addEventListener('click', () => this.nextMonth());

        // Modal
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('deleteHabitBtn').addEventListener('click', () => this.deleteHabit());
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('habitModal');
            if (e.target === modal) this.closeModal();
        });
    }

    addHabit() {
        const input = document.getElementById('habitInput');
        const habitName = input.value.trim();

        if (!habitName) {
            alert('Bitte gib einen Namen für die Gewohnheit ein!');
            return;
        }

        const habit = {
            id: Date.now(),
            name: habitName,
            createdAt: new Date().toISOString(),
            color: this.getRandomColor()
        };

        this.habits.push(habit);
        this.completions[habit.id] = {};
        input.value = '';
        this.saveToStorage();
        this.renderHabits();
    }

    deleteHabit() {
        const modal = document.getElementById('habitModal');
        const habitId = modal.dataset.habitId;
        
        if (confirm('Möchtest du diese Gewohnheit wirklich löschen?')) {
            this.habits = this.habits.filter(h => h.id != habitId);
            delete this.completions[habitId];
            this.saveToStorage();
            this.closeModal();
            this.renderHabits();
            this.renderCalendar();
        }
    }

    toggleHabitCompletion(habitId) {
        const today = this.getDateString(new Date());
        
        if (!this.completions[habitId]) {
            this.completions[habitId] = {};
        }

        this.completions[habitId][today] = !this.completions[habitId][today];
        this.saveToStorage();
        this.renderHabits();
        this.renderCalendar();
    }

    renderHabits() {
        const habitsList = document.getElementById('habitsList');
        
        if (this.habits.length === 0) {
            habitsList.innerHTML = '<p class="empty-message">Keine Gewohnheiten noch hinzugefügt. Starte mit einer neuen Gewohnheit!</p>';
            return;
        }

        habitsList.innerHTML = this.habits.map(habit => {
            const stats = this.calculateStats(habit.id);
            const today = this.getDateString(new Date());
            const isCompletedToday = this.completions[habit.id]?.[today] || false;

            return `
                <div class="habit-card" onclick="tracker.openHabitDetail(${habit.id})">
                    <div class="habit-info">
                        <div class="habit-name">${this.escapeHtml(habit.name)}</div>
                        <div class="habit-stats">
                            <div class="stat-item">
                                <span class="stat-value">${stats.currentStreak}</span>
                                <span class="stat-label">Aktueller Streak</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${stats.bestStreak}</span>
                                <span class="stat-label">Best Streak</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${stats.completionRate}%</span>
                                <span class="stat-label">Quote</span>
                            </div>
                        </div>
                    </div>
                    <div class="habit-actions">
                        <button class="check-btn ${isCompletedToday ? 'checked' : ''}" onclick="event.stopPropagation(); tracker.toggleHabitCompletion(${habit.id})">
                            ${isCompletedToday ? '✓ Heute erledigt' : 'Abhaken'}
                        </button>
                        <button class="remove-btn" onclick="event.stopPropagation(); tracker.removeHabit(${habit.id})">Entfernen</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    removeHabit(habitId) {
        if (confirm('Möchtest du diese Gewohnheit wirklich entfernen?')) {
            this.habits = this.habits.filter(h => h.id !== habitId);
            delete this.completions[habitId];
            this.saveToStorage();
            this.renderHabits();
            this.renderCalendar();
        }
    }

    renderCalendar() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        document.getElementById('monthYear').textContent = this.getMonthYearString(year, month);

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay() + 1);

        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        let currentDate = new Date(startDate);
        for (let i = 0; i < 42; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';

            if (currentDate.getMonth() !== month) {
                day.classList.add('other-month');
                day.textContent = currentDate.getDate();
            } else {
                const dateStr = this.getDateString(currentDate);
                const completedCount = this.countCompletedToday(dateStr);
                const totalHabits = this.habits.length;

                if (totalHabits === 0) {
                    day.classList.add('pending');
                } else if (completedCount === totalHabits) {
                    day.classList.add('completed');
                    day.textContent = '✓';
                } else if (completedCount > 0) {
                    day.classList.add('pending');
                    day.textContent = completedCount;
                } else if (currentDate < new Date()) {
                    day.classList.add('missed');
                    day.textContent = '✗';
                } else {
                    day.classList.add('pending');
                }
                day.textContent = day.textContent || currentDate.getDate();
            }

            calendar.appendChild(day);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    countCompletedToday(dateStr) {
        let count = 0;
        this.habits.forEach(habit => {
            if (this.completions[habit.id]?.[dateStr]) {
                count++;
            }
        });
        return count;
    }

    openHabitDetail(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        const stats = this.calculateStats(habitId);
        const modal = document.getElementById('habitModal');
        modal.dataset.habitId = habitId;

        document.getElementById('modalHabitName').textContent = habit.name;
        document.getElementById('currentStreak').textContent = stats.currentStreak;
        document.getElementById('bestStreak').textContent = stats.bestStreak;
        document.getElementById('completionRate').textContent = stats.completionRate + '%';

        this.renderModalCalendar(habitId);
        modal.classList.add('show');
    }

    closeModal() {
        document.getElementById('habitModal').classList.remove('show');
    }

    renderModalCalendar(habitId) {
        const last30Days = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last30Days.push(date);
        }

        const modalCalendar = document.getElementById('modalCalendar');
        modalCalendar.innerHTML = last30Days.map(date => {
            const dateStr = this.getDateString(date);
            const isCompleted = this.completions[habitId]?.[dateStr] || false;
            
            return `<div class="modal-calendar-day ${isCompleted ? 'completed' : 'missed'}">
                ${date.getDate()}
            </div>`;
        }).join('');
    }

    calculateStats(habitId) {
        const completions = this.completions[habitId] || {};
        const today = new Date();
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;
        let totalDays = 0;

        // Berechne Streaks
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = this.getDateString(date);

            if (date > today) continue;

            if (i === 0 || date < today) {
                totalDays++;
            }

            if (completions[dateStr]) {
                tempStreak++;
                if (i === 0) currentStreak = tempStreak;
            } else {
                if (tempStreak > bestStreak) {
                    bestStreak = tempStreak;
                }
                tempStreak = 0;
            }
        }

        if (tempStreak > bestStreak) {
            bestStreak = tempStreak;
        }

        // Berechne Erfolgsquote
        const completedDays = Object.keys(completions).length;
        const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

        return {
            currentStreak,
            bestStreak,
            completionRate
        };
    }

    previousMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
        this.renderCalendar();
    }

    getDateString(date) {
        return date.toISOString().split('T')[0];
    }

    getMonthYearString(year, month) {
        const months = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];
        return `${months[month]} ${year}`;
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    saveToStorage() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
        localStorage.setItem('completions', JSON.stringify(this.completions));
    }

    loadFromStorage() {
        const habitsData = localStorage.getItem('habits');
        const completionsData = localStorage.getItem('completions');

        if (habitsData) {
            this.habits = JSON.parse(habitsData);
        }

        if (completionsData) {
            this.completions = JSON.parse(completionsData);
        }
    }
}

// Initialisiere den Tracker
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new HabitTracker();
});
