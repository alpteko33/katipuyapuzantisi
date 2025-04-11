class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.currentView = 'month'; // Default view
        this.tasks = [];
        this.loadTasks();
        this.setupCalendarUI();
    }

    setupCalendarUI() {
        const calendarOverlay = document.createElement('div');
        calendarOverlay.className = 'calendar-overlay';
        
        const calendarPopup = document.createElement('div');
        calendarPopup.className = 'calendar-popup';
        
        calendarPopup.innerHTML = `
            <div class="calendar-close">
                <i class="fas fa-times"></i>
            </div>
            <div class="calendar-sidebar">
                <div class="calendar-header">
                    <h2>Ajanda</h2>
                </div>
                <div class="calendar-navigation">
                    <div class="calendar-today">Bugün</div>
                    <div class="calendar-nav-buttons">
                        <button class="nav-btn prev-month">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="current-month">${this.formatMonth(this.currentDate)}</span>
                        <button class="nav-btn next-month">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="calendar-view-options">
                    <button class="view-btn" data-view="day">Gün</button>
                    <button class="view-btn" data-view="week">Hafta</button>
                    <button class="view-btn active" data-view="month">Ay</button>
                    <button class="view-btn" data-view="year">Yıl</button>
                </div>
            </div>
            <div class="calendar-main">
                <div class="calendar-grid-header">
                    ${this.generateWeekDaysHeader()}
                </div>
                <div class="calendar-grid">
                    ${this.generateCalendarGrid()}
                </div>
            </div>
        `;
        
        calendarOverlay.appendChild(calendarPopup);
        document.body.appendChild(calendarOverlay);
        
        this.setupEventListeners(calendarOverlay, calendarPopup);
    }

    setupEventListeners(overlay, popup) {
        // Close button
        const closeBtn = popup.querySelector('.calendar-close');
        closeBtn.addEventListener('click', () => this.hideCalendar());
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                this.hideCalendar();
            }
        });

        // Prevent closing when clicking inside popup
        popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Navigation buttons
        const prevBtn = popup.querySelector('.prev-month');
        const nextBtn = popup.querySelector('.next-month');
        const todayBtn = popup.querySelector('.calendar-today');

        prevBtn.addEventListener('click', () => {
            switch(this.currentView) {
                case 'year':
                    this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
                    break;
                case 'month':
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                    break;
                case 'week':
                    this.selectedDate.setDate(this.selectedDate.getDate() - 7);
                    this.currentDate = new Date(this.selectedDate);
                    break;
                case 'day':
                    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
                    this.currentDate = new Date(this.selectedDate);
                    break;
            }
            this.updateCalendarView();
        });

        nextBtn.addEventListener('click', () => {
            switch(this.currentView) {
                case 'year':
                    this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
                    break;
                case 'month':
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                    break;
                case 'week':
                    this.selectedDate.setDate(this.selectedDate.getDate() + 7);
                    this.currentDate = new Date(this.selectedDate);
                    break;
                case 'day':
                    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
                    this.currentDate = new Date(this.selectedDate);
                    break;
            }
            this.updateCalendarView();
        });

        todayBtn.addEventListener('click', () => {
            this.currentDate = new Date();
            this.selectedDate = new Date();
            this.updateCalendarView();
        });

        // View options
        const viewBtns = popup.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                this.updateCalendarView();
            });
        });

        // Calendar day click event
        popup.addEventListener('click', (e) => {
            // Handle month grid day click
            const dayCell = e.target.closest('.calendar-day');
            if (dayCell && dayCell.dataset.date) {
                const dateParts = dayCell.dataset.date.split('-');
                this.selectedDate = new Date(
                    parseInt(dateParts[0]), 
                    parseInt(dateParts[1]) - 1, 
                    parseInt(dateParts[2])
                );
                this.currentDate = new Date(this.selectedDate);
                this.currentView = 'day';
                this.updateCalendarView();
                // Update view buttons
                const viewBtns = popup.querySelectorAll('.view-btn');
                viewBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.view === 'day');
                });
                return;
            }

            // Handle year view month click
            const monthCell = e.target.closest('.year-month');
            if (monthCell) {
                const monthHeader = monthCell.querySelector('.month-header');
                if (monthHeader) {
                    const monthIndex = this.getMonthIndexFromName(monthHeader.textContent);
                    if (monthIndex !== -1) {
                        this.currentDate.setMonth(monthIndex);
                        this.currentView = 'month';
                        this.updateCalendarView();
                        // Update view buttons
                        const viewBtns = popup.querySelectorAll('.view-btn');
                        viewBtns.forEach(btn => {
                            btn.classList.toggle('active', btn.dataset.view === 'month');
                        });
                    }
                }
                return;
            }

            // Handle mini day click in year view
            const miniDay = e.target.closest('.mini-day');
            if (miniDay && !miniDay.classList.contains('empty')) {
                const monthCell = miniDay.closest('.year-month');
                if (monthCell) {
                    const monthHeader = monthCell.querySelector('.month-header');
                    const day = parseInt(miniDay.textContent);
                    if (monthHeader && !isNaN(day)) {
                        const monthIndex = this.getMonthIndexFromName(monthHeader.textContent);
                        if (monthIndex !== -1) {
                            this.selectedDate = new Date(this.currentDate.getFullYear(), monthIndex, day);
                            this.currentDate = new Date(this.selectedDate);
                            this.currentView = 'day';
                            this.updateCalendarView();
                            // Update view buttons
                            const viewBtns = popup.querySelectorAll('.view-btn');
                            viewBtns.forEach(btn => {
                                btn.classList.toggle('active', btn.dataset.view === 'day');
                            });
                        }
                    }
                }
            }
        });
    }

    generateWeekDaysHeader() {
        const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        return weekDays.map(day => `<div class="week-day">${day}</div>`).join('');
    }

    generateCalendarGrid() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        let firstDayIndex = firstDay.getDay() || 7;
        firstDayIndex = firstDayIndex - 1;
        
        const daysInMonth = lastDay.getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        let days = [];
        
        // Previous month days
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            days.push(`<div class="calendar-day prev-month">${daysInPrevMonth - i}</div>`);
        }
        
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
            const isToday = this.isSameDay(currentDate, new Date());
            const isSelected = this.isSameDay(currentDate, this.selectedDate);
            
            // Bu gün için görevleri filtrele
            const currentDateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            const dayTasks = this.tasks.filter(task => {
                if (!task.dueDate) return false;
                return task.dueDate.startsWith(currentDateStr);
            });
            
            // Görev noktalarını oluştur
            let taskDots = '';
            if (dayTasks.length > 0) {
                taskDots = '<div class="task-dots">';
                
                // Tüm görevleri göster
                for (let j = 0; j < Math.min(dayTasks.length, 5); j++) {
                    const hasImportantTask = dayTasks[j].important;
                    taskDots += `<span class="task-dot${hasImportantTask ? ' important-task' : ''}"></span>`;
                }
                
                if (dayTasks.length > 5) {
                    taskDots += `<span class="task-count">+${dayTasks.length - 5}</span>`;
                }
                taskDots += '</div>';
            }
            
            days.push(`
                <div class="calendar-day current-month${isWeekend ? ' weekend' : ' weekday'}${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" 
                     data-date="${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}">
                    <span class="day-number">${i}</span>
                    ${taskDots}
                </div>
            `);
        }
        
        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push(`<div class="calendar-day next-month">${i}</div>`);
        }
        
        return days.join('');
    }

    navigateMonth(delta) {
        const newDate = new Date(this.currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        this.currentDate = newDate;
        this.updateCalendarView();
    }

    goToToday() {
        this.currentDate = new Date();
        this.updateCalendar();
    }

    updateCalendar() {
        const monthDisplay = document.querySelector('.current-month');
        const calendarGrid = document.querySelector('.calendar-grid');
        
        if (monthDisplay && calendarGrid) {
            monthDisplay.textContent = this.formatMonth(this.currentDate);
            calendarGrid.innerHTML = this.generateCalendarGrid();
        }
    }

    formatMonth(date) {
        return date.toLocaleDateString('tr-TR', { 
            year: 'numeric',
            month: 'long'
        });
    }

    showCalendar() {
        const overlay = document.querySelector('.calendar-overlay');
        overlay.classList.add('active');
    }

    hideCalendar() {
        const overlay = document.querySelector('.calendar-overlay');
        overlay.classList.remove('active');
    }

    updateCalendarView() {
        const calendarMain = document.querySelector('.calendar-main');
        const currentMonthDisplay = document.querySelector('.current-month');

        if (!calendarMain || !currentMonthDisplay) return;
        
        switch(this.currentView) {
            case 'day':
                calendarMain.innerHTML = this.generateDayView();
                currentMonthDisplay.textContent = this.formatDate(this.selectedDate);
                break;
            case 'week':
                calendarMain.innerHTML = this.generateWeekView();
                currentMonthDisplay.textContent = this.formatWeekRange();
                break;
            case 'month':
                calendarMain.innerHTML = `
                    <div class="calendar-grid-header">
                        ${this.generateWeekDaysHeader()}
                    </div>
                    <div class="calendar-grid">
                        ${this.generateCalendarGrid()}
                    </div>
                `;
                currentMonthDisplay.textContent = this.formatMonth(this.currentDate);
                break;
            case 'year':
                calendarMain.innerHTML = this.generateYearView();
                currentMonthDisplay.textContent = this.currentDate.getFullYear().toString();
                break;
        }
    }

    generateDayView() {
        return `
            <div class="calendar-day-view">
                <div class="day-header">
                    <h3>${this.formatDate(this.selectedDate)}</h3>
                </div>
                <div class="day-schedule">
                    ${this.generateHourlySchedule()}
                </div>
            </div>
        `;
    }

    generateWeekView() {
        const weekStart = this.getWeekStartDate(this.selectedDate);
        let weekDays = [];
        
        for(let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(weekStart.getDate() + i);
            const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
            const isSelected = this.isSameDay(currentDay, this.selectedDate);
            
            // Bu gün için görevleri filtrele - ISO formatı kullanarak
            const year = currentDay.getFullYear();
            const month = (currentDay.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDay.getDate().toString().padStart(2, '0');
            const currentDayStr = `${year}-${month}-${day}`;
            
            const dayTasks = this.tasks.filter(task => {
                if (!task.dueDate) return false;
                return task.dueDate.startsWith(currentDayStr);
            });
            
            // Görevleri oluştur (saatler olmadan)
            const taskElements = dayTasks.map(task => {
                return `
                    <div class="calendar-task week-task ${task.important ? 'important' : ''} ${task.completed ? 'completed' : ''}">
                        <div class="task-title">${this.escapeHtml(task.text)}</div>
                    </div>
                `;
            }).join('');
            
            weekDays.push(`
                <div class="week-day-column${isWeekend ? ' weekend' : ' weekday'}${isSelected ? ' selected' : ''}">
                    <div class="week-day-header">
                        <div class="day-name">${currentDay.toLocaleDateString('tr-TR', {weekday: 'short'})}</div>
                        <div class="day-number">${currentDay.getDate()}</div>
                    </div>
                    <div class="week-day-content">
                        ${taskElements}
                    </div>
                </div>
            `);
        }

        return `
            <div class="calendar-week-view">
                <div class="week-container">
                    ${weekDays.join('')}
                </div>
            </div>
        `;
    }

    generateYearView() {
        const months = [];
        for(let month = 0; month < 12; month++) {
            const date = new Date(this.currentDate.getFullYear(), month, 1);
            months.push(`
                <div class="year-month">
                    <div class="month-header">${date.toLocaleDateString('tr-TR', {month: 'long'})}</div>
                    <div class="month-grid">
                        ${this.generateMiniMonthGrid(month)}
                    </div>
                </div>
            `);
        }

        return `
            <div class="calendar-year-view">
                ${months.join('')}
            </div>
        `;
    }

    generateHourlySchedule() {
        let hours = [];
        // Seçili tarih için görevleri filtrele - ISO formatı kullanarak
        const year = this.selectedDate.getFullYear();
        const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = this.selectedDate.getDate().toString().padStart(2, '0');
        const selectedDateStr = `${year}-${month}-${day}`;
        
        const dayTasks = this.tasks.filter(task => {
            if (!task.dueDate) return false;
            return task.dueDate.startsWith(selectedDateStr);
        });
        
        for(let i = 0; i < 24; i++) {
            // Bu saat için görevleri bul
            const hourTasks = dayTasks.filter(task => {
                if (!task.dueDate) return false;
                const taskHour = new Date(task.dueDate).getHours();
                return taskHour === i;
            });
            
            // Görev içeriklerini oluştur
            const taskElements = hourTasks.map(task => {
                return `
                    <div class="calendar-task ${task.important ? 'important' : ''} ${task.completed ? 'completed' : ''}">
                        <div class="task-time">${new Date(task.dueDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}</div>
                        <div class="task-title">${this.escapeHtml(task.text)}</div>
                    </div>
                `;
            }).join('');
            
            hours.push(`
                <div class="hour-slot">
                    <div class="hour-label">${i.toString().padStart(2, '0')}:00</div>
                    <div class="hour-content">${taskElements}</div>
                </div>
            `);
        }
        return hours.join('');
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

    generateMiniMonthGrid(month) {
        const date = new Date(this.currentDate.getFullYear(), month, 1);
        const daysInMonth = new Date(this.currentDate.getFullYear(), month + 1, 0).getDate();
        const firstDayIndex = date.getDay() || 7;
        const firstDayIndexAdjusted = firstDayIndex - 1;
        
        let days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayIndexAdjusted; i++) {
            days.push('<div class="mini-day empty"></div>');
        }
        
        // Add days of the month
        for(let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(this.currentDate.getFullYear(), month, i);
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
            const isSelected = this.isSameDay(currentDate, this.selectedDate);
            
            // Bu gün için görevleri filtrele - ISO formatı kullanarak
            const year = this.currentDate.getFullYear();
            const monthStr = (month + 1).toString().padStart(2, '0');
            const dayStr = i.toString().padStart(2, '0');
            const currentDateStr = `${year}-${monthStr}-${dayStr}`;
            
            const dayTasks = this.tasks.filter(task => {
                if (!task.dueDate) return false;
                return task.dueDate.startsWith(currentDateStr);
            });
            
            // Görev noktasını ekleme
            const hasTask = dayTasks.length > 0 ? ' has-task' : '';
            const hasImportantTask = dayTasks.some(task => task.important) ? ' has-important-task' : '';
            
            days.push(`
                <div class="mini-day${isWeekend ? ' weekend' : ' weekday'}${isSelected ? ' selected' : ''}${hasTask}${hasImportantTask}">${i}</div>
            `);
        }
        
        return days.join('');
    }

    getWeekStartDate(date) {
        const d = new Date(date);
        const day = d.getDay() || 7;
        d.setDate(d.getDate() - day + 1);
        return d;
    }

    formatDate(date) {
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    formatWeekRange() {
        const weekStart = this.getWeekStartDate(this.selectedDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return `${weekStart.getDate()} - ${weekEnd.getDate()} ${weekStart.toLocaleDateString('tr-TR', {month: 'long', year: 'numeric'})}`;
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    getMonthIndexFromName(monthName) {
        const months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        return months.indexOf(monthName);
    }

    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('tasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            }
            // Takvim olayları için özel bir event listener ekle
            window.addEventListener('tasksUpdated', (event) => {
                if (event.detail && event.detail.tasks) {
                    this.tasks = event.detail.tasks;
                    this.updateCalendarView();
                }
            });
        } catch (error) {
            console.error('Görevler yüklenemedi:', error);
            this.tasks = [];
        }
    }
}

export default Calendar; 