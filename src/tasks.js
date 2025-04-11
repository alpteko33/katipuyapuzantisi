class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.showCompleted = true; // Tamamlanan görevlerin görünürlüğü
        this.officeStaff = this.loadOfficeStaff();
        this.loadTasks();
        this.setupTasksUI();
    }

    setupTasksUI() {
        const tasksOverlay = document.createElement('div');
        tasksOverlay.className = 'tasks-overlay';
        
        const tasksPopup = document.createElement('div');
        tasksPopup.className = 'tasks-popup';
        
        this.generateAssigneeOptions().then(assigneeOptions => {
            tasksPopup.innerHTML = `
                <div class="tasks-sidebar">
                    <div class="tasks-filters">
                        <button class="filter-btn active" data-filter="all">
                            <i class="fas fa-tasks"></i>
                            Tüm Görevler
                        </button>
                        <button class="filter-btn" data-filter="today">
                            <i class="fas fa-calendar-day"></i>
                            Günüm
                        </button>
                        <button class="filter-btn" data-filter="important">
                            <i class="fas fa-star"></i>
                            Önemli
                        </button>
                        <button class="filter-btn" data-filter="completed">
                            <i class="fas fa-check-circle"></i>
                            Tamamlanan
                        </button>
                        <button class="filter-btn" data-filter="assigned">
                            <i class="fas fa-user"></i>
                            Bana Atanmış
                        </button>
                        <button class="filter-btn" data-filter="planned">
                            <i class="fas fa-calendar"></i>
                            Planlanmış
                        </button>
                    </div>
                </div>
                <div class="tasks-main">
                    <div class="tasks-header">
                        <h2>Görevlerim</h2>
                        <div class="tasks-controls">
                            <div class="show-completed-toggle" title="${this.showCompleted ? 'Tamamlanan görevleri gizle' : 'Tamamlanan görevleri göster'}">
                                <i class="fas ${this.showCompleted ? 'fa-eye' : 'fa-eye-slash'}"></i>
                            </div>
                            <div class="tasks-close">
                                <i class="fas fa-times"></i>
                            </div>
                        </div>
                    </div>
                    <div class="tasks-content">
                        <div class="task-input-group">
                            <input type="text" class="task-input" placeholder="Yeni görev ekle...">
                            <input type="datetime-local" class="task-date-input">
                            <select class="task-assignee-input">
                                ${assigneeOptions}
                            </select>
                            <div class="task-important-toggle">
                                <input type="checkbox" id="task-important" class="task-important-input">
                                <label for="task-important">Önemli</label>
                            </div>
                            <button class="task-add-btn">Ekle</button>
                        </div>
                        <ul class="task-list"></ul>
                    </div>
                </div>
            `;
            
            tasksOverlay.appendChild(tasksPopup);
            document.body.appendChild(tasksOverlay);
            
            this.setupEventListeners(tasksOverlay, tasksPopup);
            this.renderTasks();
        });
    }

    setupEventListeners(overlay, popup) {
        // Close button
        const closeBtn = popup.querySelector('.tasks-close');
        closeBtn.addEventListener('click', () => this.hideTasksPanel());
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                this.hideTasksPanel();
            }
        });

        // Prevent closing when clicking inside popup
        popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Show/Hide completed tasks toggle
        const showCompletedToggle = popup.querySelector('.show-completed-toggle');
        showCompletedToggle.addEventListener('click', () => {
            this.showCompleted = !this.showCompleted;
            showCompletedToggle.title = this.showCompleted ? 'Tamamlanan görevleri gizle' : 'Tamamlanan görevleri göster';
            showCompletedToggle.querySelector('i').className = `fas ${this.showCompleted ? 'fa-eye' : 'fa-eye-slash'}`;
            this.renderTasks();
        });
        
        // Add task button
        const addBtn = popup.querySelector('.task-add-btn');
        const input = popup.querySelector('.task-input');
        const dateInput = popup.querySelector('.task-date-input');
        const assigneeInput = popup.querySelector('.task-assignee-input');
        const importantInput = popup.querySelector('.task-important-input');
        
        addBtn.addEventListener('click', () => {
            this.addTask(
                input.value,
                dateInput.value,
                assigneeInput.value,
                importantInput.checked
            );
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask(
                    input.value,
                    dateInput.value,
                    assigneeInput.value,
                    importantInput.checked
                );
            }
        });

        // Filter buttons
        const filterBtns = popup.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderTasks();
            });
        });
    }

    showTasksPanel() {
        const overlay = document.querySelector('.tasks-overlay');
        overlay.classList.add('active');
        const input = overlay.querySelector('.task-input');
        input.focus();
    }

    hideTasksPanel() {
        const overlay = document.querySelector('.tasks-overlay');
        overlay.classList.remove('active');
    }

    addTask(text, dueDate, assignee, important) {
        if (!text.trim()) return;
        
        const task = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            date: new Date().toISOString(),
            dueDate: dueDate || null,
            assignee: assignee || 'self',
            important: important || false
        };
        
        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        
        // Clear inputs
        const inputs = document.querySelectorAll('.task-input, .task-date-input');
        inputs.forEach(input => input.value = '');
        document.querySelector('.task-assignee-input').value = 'self';
        document.querySelector('.task-important-input').checked = false;
        document.querySelector('.task-input').focus();
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const taskItem = document.querySelector(`[data-id="${id}"]`);
        if (!taskItem) return;
        
        // generateAssigneeOptions'ı çağırıp Promise sonucunu bekle
        this.generateAssigneeOptions().then(assigneeOptions => {
            taskItem.innerHTML = `
                <input type="text" class="task-edit-input" value="${this.escapeHtml(task.text)}">
                <input type="datetime-local" class="task-edit-date" value="${task.dueDate || ''}">
                <select class="task-edit-assignee">
                    ${assigneeOptions}
                </select>
                <div class="task-edit-important">
                    <input type="checkbox" id="edit-important-${id}" ${task.important ? 'checked' : ''}>
                    <label for="edit-important-${id}">Önemli</label>
                </div>
                <button class="task-edit-save">Kaydet</button>
                <button class="task-edit-cancel">İptal</button>
            `;

            // Mevcut assignee değerini seç
            const assigneeSelect = taskItem.querySelector('.task-edit-assignee');
            if (assigneeSelect) {
                // Atanmış kişiyi bul
                const optionToSelect = Array.from(assigneeSelect.options).find(option => 
                    option.value === task.assignee
                );
                
                // Eğer varsa seç
                if (optionToSelect) {
                    optionToSelect.selected = true;
                }
            }

            const saveBtn = taskItem.querySelector('.task-edit-save');
            const cancelBtn = taskItem.querySelector('.task-edit-cancel');

            saveBtn.addEventListener('click', () => {
                const newText = taskItem.querySelector('.task-edit-input').value;
                const newDate = taskItem.querySelector('.task-edit-date').value;
                const newAssignee = taskItem.querySelector('.task-edit-assignee').value;
                const newImportant = taskItem.querySelector(`#edit-important-${id}`).checked;

                if (newText.trim()) {
                    task.text = newText.trim();
                    task.dueDate = newDate;
                    task.assignee = newAssignee;
                    task.important = newImportant;
                    this.saveTasks();
                    this.renderTasks();
                }
            });

            cancelBtn.addEventListener('click', () => {
                this.renderTasks();
            });
        });
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        // Görevi tasks array'inden kaldır
        this.tasks = this.tasks.filter(t => t.id !== id);
        
        // Tüm depolama yöntemlerine kaydet ve bildirimleri yay
        this.saveTasks();
        
        // Onay için görevi doğrudan tarayıcıya da ilet
        try {
            chrome.storage.local.set({ tasks: this.tasks }, () => {
                console.log('Görev silme işlemi chrome.storage.local\'a yansıtıldı');
            });
        } catch (error) {
            console.warn('Chrome storage erişimi başarısız (önemli değil):', error);
        }
        
        // Diğer tarayıcı pencerelerine de bildir
        try {
            chrome.runtime.sendMessage({ 
                action: 'forceTasksUpdate', 
                tasks: this.tasks 
            });
        } catch (error) {
            console.warn('Runtime mesaj gönderme hatası (önemli değil):', error);
        }
        
        // UI'ı güncelle
        this.renderTasks();
    }

    filterTasks() {
        let filteredTasks = [...this.tasks];
        
        // Filter by completion visibility
        if (!this.showCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Apply current filter
        switch (this.currentFilter) {
            case 'today':
                filteredTasks = filteredTasks.filter(task => {
                    if (!task.dueDate) return false;
                    const taskDate = new Date(task.dueDate);
                    taskDate.setHours(0, 0, 0, 0);
                    return taskDate.getTime() === today.getTime();
                });
                break;
            case 'important':
                filteredTasks = filteredTasks.filter(task => task.important);
                break;
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
            case 'assigned':
                filteredTasks = filteredTasks.filter(task => task.assignee === 'self');
                break;
            case 'planned':
                filteredTasks = filteredTasks.filter(task => task.dueDate);
                break;
        }

        // Sort tasks: first by completion status, then by due date (tasks without due date go to the end)
        return filteredTasks.sort((a, b) => {
            if (a.completed === b.completed) {
                // If both tasks have same completion status, sort by due date
                if (!a.dueDate && !b.dueDate) {
                    // If both tasks don't have due dates, sort by creation date
                    return new Date(b.date) - new Date(a.date);
                }
                if (!a.dueDate) return 1; // Tasks without due date go to the end
                if (!b.dueDate) return -1; // Tasks with due date come first
                
                // Otherwise sort by due date (ascending: closest due date first)
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return a.completed ? 1 : -1; // Completed tasks go to bottom
        });
    }

    // Görevi HTML olarak render etme fonksiyonu
    async renderTaskItem(task) {
        // Atama bilgisini Promise olarak al
        let assigneeName = this.getAssigneeName(task.assignee);
        
        // Eğer bir Promise ise bekle
        if (assigneeName instanceof Promise) {
            assigneeName = await assigneeName;
        }
        
        return `
            <li class="task-item ${task.completed ? 'completed' : ''} ${task.important ? 'important' : ''}" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <span class="task-info">
                    ${task.dueDate ? `<span class="task-due-date">Tarih: ${this.formatDate(task.dueDate)}</span>` : ''}
                    <span class="task-assignee">Atanan: ${assigneeName}</span>
                </span>
                <div class="task-actions">
                    <span class="task-edit"><i class="fas fa-edit"></i></span>
                    <span class="task-delete"><i class="fas fa-trash"></i></span>
                </div>
            </li>
        `;
    }

    async renderTasks() {
        const taskList = document.querySelector('.task-list');
        if (!taskList) return;

        const filteredTasks = this.filterTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<div class="no-tasks">Henüz görev eklenmemiş</div>';
            return;
        }

        // "Planlanmış" filtresindeyse, görevleri tarihlerine göre grupla
        if (this.currentFilter === 'planned') {
            // Görevleri tarihlerine göre grupla
            const tasksByDate = {};
            const tasksWithoutDate = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Görevleri tarihlerine göre grupla
            filteredTasks.forEach(task => {
                if (task.dueDate) {
                    const taskDate = new Date(task.dueDate);
                    taskDate.setHours(0, 0, 0, 0);
                    const dateKey = taskDate.toISOString().split('T')[0];
                    
                    if (!tasksByDate[dateKey]) {
                        tasksByDate[dateKey] = [];
                    }
                    tasksByDate[dateKey].push(task);
                } else {
                    tasksWithoutDate.push(task);
                }
            });

            // Tarihleri sırala (bugünden başlayarak)
            const sortedDates = Object.keys(tasksByDate).sort((a, b) => new Date(a) - new Date(b));
            
            // Gruplandırılmış görevleri HTML'e çevir
            let html = '';
            
            // Önce tarihi olan görevleri ekle
            for (const dateKey of sortedDates) {
                const taskDate = new Date(dateKey);
                const isToday = taskDate.getTime() === today.getTime();
                
                // Tarih başlığı oluştur
                html += `<div class="task-date-divider ${isToday ? 'today' : ''}">
                    ${isToday ? 'Bugün' : this.formatDateHeader(dateKey)}
                </div>`;
                
                // Bu tarihteki görevleri ekle
                for (const task of tasksByDate[dateKey]) {
                    html += await this.renderTaskItem(task);
                }
            }
            
            // Tarihi olmayan görevleri en sona ekle
            if (tasksWithoutDate.length > 0) {
                html += '<div class="task-date-divider no-date">Tarihi Belirsiz</div>';
                for (const task of tasksWithoutDate) {
                    html += await this.renderTaskItem(task);
                }
            }
            
            taskList.innerHTML = html;
        } else {
            // Diğer filtreler için normal görünüm
            let html = '';
            for (const task of filteredTasks) {
                html += await this.renderTaskItem(task);
            }
            taskList.innerHTML = html;
        }

        // Add event listeners to task items
        taskList.querySelectorAll('.task-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            
            item.querySelector('.task-checkbox').addEventListener('change', () => {
                this.toggleTask(id);
            });
            
            item.querySelector('.task-edit').addEventListener('click', () => {
                this.editTask(id);
            });

            item.querySelector('.task-delete').addEventListener('click', () => {
                this.deleteTask(id);
            });
        });
    }

    // Tarih başlığı formatı
    formatDateHeader(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        
        // Türkçe gün ve ay isimleri
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${days[date.getDay()]}`;
    }

    getAssigneeName(assigneeId) {
        // localStorage'daki temel kişiler
        const localStaff = this.loadOfficeStaff();
        const localPerson = localStaff.find(p => p.id === assigneeId);
        
        if (localPerson) {
            return localPerson.name;
        }
        
        // Eğer ID formatı avukat veya personel formatındaysa
        if (assigneeId.startsWith('lawyer_') || assigneeId.startsWith('staff_')) {
            const type = assigneeId.split('_')[0]; // 'lawyer' veya 'staff'
            const index = parseInt(assigneeId.split('_')[1]); // index değeri
            
            return new Promise((resolve) => {
                chrome.storage.sync.get([type + 's'], (data) => {
                    const items = data[type + 's'] || [];
                    
                    if (items[index]) {
                        const person = items[index];
                        const name = person.name;
                        const position = type === 'staff' ? ` (${person.position})` : '';
                        resolve(name + position);
                    } else {
                        resolve(assigneeId);
                    }
                });
            });
        }
        
        // Bilinmeyen bir ID
        return assigneeId;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        // localStorage'a kaydet
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        
        // Chrome storage'a da kaydet (extension context'inde çalışıyorsa)
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.set({ tasks: this.tasks }, () => {
                    const err = chrome.runtime.lastError;
                    if (err) {
                        console.warn('Chrome storage kaydetme hatası:', err);
                    } else {
                        console.log('Görevler chrome.storage.local\'a başarıyla kaydedildi');
                    }
                });
            }
        } catch (error) {
            console.warn('Chrome storage erişim hatası (önemli değil):', error);
        }
        
        // Runtime mesajı gönder (diğer extension parçalarına bildir)
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                chrome.runtime.sendMessage({ 
                    action: 'tasksUpdated', 
                    tasks: this.tasks 
                });
            }
        } catch (error) {
            console.warn('Runtime mesaj gönderme hatası (önemli değil):', error);
        }
        
        // Takvim ile entegrasyon için event yayınla
        const event = new CustomEvent('tasksUpdated', {
            detail: { tasks: this.tasks }
        });
        window.dispatchEvent(event);
    }

    loadTasks() {
        try {
            // Local Storage'dan görevleri yükle
            const savedTasks = localStorage.getItem('tasks');
            
            if (savedTasks) {
                try {
                    const parsedTasks = JSON.parse(savedTasks);
                    
                    // Geçerli bir dizi olup olmadığını kontrol et
                    if (Array.isArray(parsedTasks)) {
                        this.tasks = parsedTasks;
                    } else {
                        console.warn('localStorage\'daki tasks geçerli bir dizi değil');
                        this.tasks = [];
                    }
                } catch (parseError) {
                    console.error('Görevler parse edilirken hata oluştu:', parseError);
                    this.tasks = [];
                }
            } else {
                this.tasks = [];
            }
            
            // Chrome extension storage'dan da kontrol et (extension context'inde çalışıyorsa)
            try {
                if (typeof chrome !== 'undefined' && chrome.storage) {
                    chrome.storage.local.get(['tasks'], (result) => {
                        if (result.tasks && Array.isArray(result.tasks)) {
                            // Chrome storage'daki görevlerin sayısı daha fazlaysa onları kullan
                            if (result.tasks.length > this.tasks.length) {
                                console.log('Chrome storage\'dan daha güncel görevler yüklendi');
                                this.tasks = result.tasks;
                                
                                // localStorage'ı da güncelle
                                localStorage.setItem('tasks', JSON.stringify(this.tasks));
                                
                                // UI'ı güncelle
                                this.renderTasks();
                            }
                        }
                    });
                }
            } catch (chromeError) {
                console.warn('Chrome storage erişim hatası (önemli değil):', chromeError);
            }
            
            // Runtime mesajlarını dinle
            try {
                if (typeof chrome !== 'undefined' && chrome.runtime) {
                    chrome.runtime.onMessage.addListener((message) => {
                        if (message.action === 'tasksUpdated' && Array.isArray(message.tasks)) {
                            console.log('Runtime mesajıyla görevler güncellendi');
                            this.tasks = message.tasks;
                            localStorage.setItem('tasks', JSON.stringify(this.tasks));
                            this.renderTasks();
                        }
                    });
                }
            } catch (runtimeError) {
                console.warn('Runtime mesaj dinleme hatası (önemli değil):', runtimeError);
            }
        } catch (error) {
            console.error('Görevler yüklenemedi:', error);
            this.tasks = [];
        }
    }

    generateAssigneeOptions() {
        return new Promise((resolve) => {
            // Ofis personellerini localStorage'dan al
            const localStaff = this.loadOfficeStaff();
            
            // Chrome storage'dan avukat ve personel bilgilerini al
            chrome.storage.sync.get(['lawyers', 'staffs'], (data) => {
                const lawyers = data.lawyers || [];
                const staffs = data.staffs || [];
                
                let options = '';
                
                // Temel kişileri artık göstermeye gerek yok
                
                // Avukatları ekle
                if (lawyers.length > 0) {
                    options += '<optgroup label="Avukatlar">';
                    options += lawyers.map((lawyer, index) => 
                        `<option value="lawyer_${index}">${lawyer.name}</option>`
                    ).join('');
                    options += '</optgroup>';
                }
                
                // Personelleri ekle
                if (staffs.length > 0) {
                    options += '<optgroup label="Ofis Personelleri">';
                    options += staffs.map((staff, index) => 
                        `<option value="staff_${index}">${staff.name} (${staff.position})</option>`
                    ).join('');
                    options += '</optgroup>';
                }
                
                // Eğer hiç kayıtlı kişi yoksa bilgi mesajı göster
                if (lawyers.length === 0 && staffs.length === 0) {
                    options = '<option value="none" disabled selected>Personel Ekle</option>';
                }
                
                resolve(options);
            });
        });
    }

    loadOfficeStaff() {
        const saved = localStorage.getItem('uyap-office-staff');
        return saved ? JSON.parse(saved) : [
            { id: 'self', name: 'Kendim' },
            { id: 'assistant', name: 'Asistan' },
            { id: 'intern', name: 'Stajyer' }
        ];
    }

    // Settings Panel Methods
    showSettingsPanel() {
        const settingsOverlay = document.createElement('div');
        settingsOverlay.className = 'settings-overlay';
        
        const settingsPopup = document.createElement('div');
        settingsPopup.className = 'settings-popup';
        
        const staff = this.loadOfficeStaff();
        
        settingsPopup.innerHTML = `
            <div class="settings-header">
                <h2>Genel Ayarlar</h2>
                <div class="settings-close">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            <div class="settings-content">
                <div class="settings-section">
                    <h3>Ofis Çalışanları</h3>
                    <div class="staff-list">
                        ${staff.map(person => `
                            <div class="staff-item" data-id="${person.id}">
                                <input type="text" class="staff-name" value="${person.name}" ${person.id === 'self' ? 'disabled' : ''}>
                                ${person.id === 'self' ? '' : '<button class="staff-delete"><i class="fas fa-trash"></i></button>'}
                            </div>
                        `).join('')}
                    </div>
                    <button class="add-staff-btn">
                        <i class="fas fa-plus"></i> Yeni Çalışan Ekle
                    </button>
                </div>
            </div>
            <div class="settings-footer">
                <button class="settings-save">Kaydet</button>
                <button class="settings-cancel">İptal</button>
            </div>
        `;
        
        settingsOverlay.appendChild(settingsPopup);
        document.body.appendChild(settingsOverlay);
        
        this.setupSettingsEventListeners(settingsOverlay, settingsPopup);
    }

    setupSettingsEventListeners(overlay, popup) {
        // Close button
        popup.querySelector('.settings-close').addEventListener('click', () => {
            overlay.remove();
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        // Add new staff member
        popup.querySelector('.add-staff-btn').addEventListener('click', () => {
            const staffList = popup.querySelector('.staff-list');
            const newId = 'staff_' + Date.now();
            
            const staffItem = document.createElement('div');
            staffItem.className = 'staff-item';
            staffItem.dataset.id = newId;
            staffItem.innerHTML = `
                <input type="text" class="staff-name" placeholder="Çalışan adı">
                <button class="staff-delete"><i class="fas fa-trash"></i></button>
            `;
            
            staffList.appendChild(staffItem);
        });
        
        // Delete staff member
        popup.querySelectorAll('.staff-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.staff-item').remove();
            });
        });
        
        // Save settings
        popup.querySelector('.settings-save').addEventListener('click', () => {
            const staffItems = popup.querySelectorAll('.staff-item');
            const staff = Array.from(staffItems).map(item => ({
                id: item.dataset.id,
                name: item.querySelector('.staff-name').value.trim()
            })).filter(person => person.name); // Filter out empty names
            
            localStorage.setItem('uyap-office-staff', JSON.stringify(staff));
            
            // Update task assignee dropdown
            const assigneeSelect = document.querySelector('.task-assignee-input');
            if (assigneeSelect) {
                assigneeSelect.innerHTML = this.generateAssigneeOptions();
            }
            
            overlay.remove();
        });
        
        // Cancel settings
        popup.querySelector('.settings-cancel').addEventListener('click', () => {
            overlay.remove();
        });
    }
}

export default TaskManager; 