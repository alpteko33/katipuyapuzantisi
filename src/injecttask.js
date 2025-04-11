// Bu script, UYAP sayfasına direkt olarak inject edilir
console.log('UYAP Asistan: injecttask.js yüklendi');

// Debugger modu - sadece geliştirme ortamında true yapın
// Script birden fazla defa yüklenmesin diye global kontrol
if (typeof window.UYAP_ASISTAN_TASK === 'undefined') {
    window.UYAP_ASISTAN_TASK = {
        DEBUG: false,
        isActive: false
    };

    function debugLog(...args) {
        if (window.UYAP_ASISTAN_TASK.DEBUG) {
            console.log(...args);
        }
    }

    function addBulkTaskButton() {
        debugLog('UYAP Asistan: Toplu Görev Ekle butonu ekleme fonksiyonu başlatıldı');

        if (window.UYAP_ASISTAN_TASK.isActive) return; // Zaten çalışıyorsa tekrar başlatma
        window.UYAP_ASISTAN_TASK.isActive = true;

        // Sayfayı izleyen MutationObserver oluştur
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Yeni eklenen düğümleri kontrol et
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // "Toplu Takvime Ekle" butonunu içeren form-group'u ara
                            const formGroup = node.querySelector ? node.querySelector('.form-group .dx-button-success') : null;
                            if (formGroup) {
                                checkForCalendarButton(node);
                            } else if (node.classList && node.classList.contains('form-group')) {
                                checkForCalendarButton(node);
                            }
                        }
                    }
                }
            }
        });

        // Tüm DOM değişikliklerini izle
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Mevcut sayfayı hemen kontrol et
        checkAllCalendarButtons();
    }

    function checkAllCalendarButtons() {
        // "Toplu Takvime Ekle" butonlarını ara
        const calendarButtons = document.querySelectorAll('.form-group .dx-button-success');
        calendarButtons.forEach(button => {
            if (button.querySelector('.dx-button-text')?.textContent === 'Toplu Takvime Ekle') {
                addBulkTaskButtonBeside(button);
            }
        });
    }

    function checkForCalendarButton(node) {
        // Node içerisinde "Toplu Takvime Ekle" butonunu ara
        const calendarButton = node.querySelector ? node.querySelector('.dx-button-success') : null;
        if (calendarButton && calendarButton.querySelector('.dx-button-text')?.textContent === 'Toplu Takvime Ekle') {
            addBulkTaskButtonBeside(calendarButton);
        }
    }

    function addBulkTaskButtonBeside(calendarButton) {
        // Buton zaten eklenmiş mi kontrol et
        const formGroup = calendarButton.closest('.form-group');
        if (formGroup && !formGroup.querySelector('.bulk-task-button')) {
            debugLog('UYAP Asistan: Toplu Görev Ekle butonu ekleniyor');

            // Yeni buton oluştur
            const taskButton = document.createElement('div');
            // Görsel özellikleri "Toplu Takvime Ekle" butonu ile aynı olacak şekilde güncellendi
            taskButton.className = 'dx-widget dx-button dx-button-mode-contained dx-button-success dx-button-has-text dx-button-has-icon float-end min-w me-4 bulk-task-button';
            taskButton.setAttribute('role', 'button');
            taskButton.setAttribute('aria-label', 'Toplu Görev Ekle');
            taskButton.setAttribute('tabindex', '0');

            taskButton.innerHTML = `
                <div class="dx-button-content">
                    <i class="dx-icon fe icon-check-circle"></i>
                    <span class="dx-button-text">Toplu Görev Ekle</span>
                </div>
            `;

            // Butona tıklama olayı ekle
            taskButton.addEventListener('click', () => {
                handleBulkTasks();
            });

            // Butonu "Toplu Takvime Ekle" butonunun önüne ekle
            calendarButton.insertAdjacentElement('beforebegin', taskButton);
            debugLog('UYAP Asistan: Toplu Görev Ekle butonu eklendi');
        }
    }

    function handleBulkTasks() {
        debugLog('UYAP Asistan: Toplu Görev Ekle butonu tıklandı');

        // Tablodaki duruşmaları bul
        const hearingRows = document.querySelectorAll('#adaletDataGridContainer .dx-data-row');
        if (hearingRows.length === 0) {
            return;
        }

        // Görev olarak eklenecek duruşmaları topla
        const hearings = [];
        // Mevcut görevleri al (duplicate kontrolü için)
        const existingTasks = [];
        const savedTasksString = localStorage.getItem('tasks');
        if (savedTasksString) {
            try {
                const tasks = JSON.parse(savedTasksString);
                if (Array.isArray(tasks)) {
                    existingTasks.push(...tasks);
                }
            } catch (e) {
                debugLog('localStorage parse hatası', e);
            }
        }

        hearingRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 10) {
                // Mahkeme bilgisi
                const court = cells[0].textContent.trim();
                // Dosya no
                const fileNo = cells[1].textContent.trim();
                // Dosya türü
                const fileType = cells[2].textContent.trim();
                // Duruşma tarihi
                const dateElement = cells[3].querySelector('.text-nowrap:first-child');
                const timeElement = cells[3].querySelector('.text-nowrap:nth-child(2)');
                
                // İcon'ları ve gereksiz karakterleri temizle
                const dateText = dateElement ? dateElement.textContent.replace(/[^0-9.]/g, '').trim() : '';
                const timeText = timeElement ? timeElement.textContent.replace(/[^0-9:]/g, '').trim() : '';
                
                // Tarih ve saat bilgisini düzenle
                const dateParts = dateText.match(/(\d{2})\.(\d{2})\.(\d{4})/);
                const timeParts = timeText.match(/(\d{2}):(\d{2})/);

                let taskDate = null;
                if (dateParts && timeParts) {
                    // Tarih formatını düzgün bir şekilde ayarla: YYYY-MM-DDThh:mm
                    taskDate = `${dateParts[3]}-${dateParts[2]}-${dateParts[1]}T${timeParts[1]}:${timeParts[2]}`;
                }

                // Taraf bilgisi
                const parties = cells[4].textContent.trim();
                // İşlem türü
                const processType = cells[5].textContent.trim();

                // Görev metni oluştur
                const taskText = `Duruşma: ${court} - ${fileNo} - ${fileType} (${parties.substring(0, 30)}${parties.length > 30 ? '...' : ''}) - ${processType}`;
                
                // Bu görev zaten eklenmiş mi kontrol et
                // Hem metin hem de tarih verilerini karşılaştır
                const isTaskDuplicate = existingTasks.some(task => {
                    return task.text === taskText && task.dueDate === taskDate;
                });
                
                if (!isTaskDuplicate) {
                    hearings.push({
                        text: taskText,
                        dueDate: taskDate,
                        important: true, // Duruşmalar önemli olarak işaretlensin
                        completed: false,
                        assignee: 'self' // Varsayılan olarak kendisine atansın
                    });
                }
            }
        });

        if (hearings.length > 0) {
            // Görevleri localStorage'a kaydet
            saveHearingsAsTasks(hearings);
        }
    }

    function saveHearingsAsTasks(hearings) {
        debugLog('Duruşmalar görev olarak kaydediliyor...', hearings);

        try {
            // Mevcut görevleri al
            let tasks = [];
            const savedTasksString = localStorage.getItem('tasks');
            
            if (savedTasksString) {
                try {
                    tasks = JSON.parse(savedTasksString);
                    // Geçerli bir array olmadığı durumda boş array ile başla
                    if (!Array.isArray(tasks)) {
                        console.warn('localStorage\'daki tasks geçerli bir dizi değil, sıfırlanıyor');
                        tasks = [];
                    }
                } catch (parseError) {
                    console.error('localStorage parse hatası:', parseError);
                    tasks = [];
                }
            }

            // Yeni görevleri ekle
            hearings.forEach(hearing => {
                // Benzersiz ID oluştur
                const taskId = Date.now() + Math.floor(Math.random() * 1000);
                
                // Tarih formatını kontrol et ve düzelt
                let taskDueDate = hearing.dueDate;
                if (taskDueDate) {
                    try {
                        // ISO formatını kontrol et
                        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(taskDueDate)) {
                            const today = new Date();
                            taskDueDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}T${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
                        }
                        
                        // Tarih formatının geçerli olduğundan emin ol
                        const testDate = new Date(taskDueDate);
                        if (isNaN(testDate.getTime())) {
                            throw new Error('Geçersiz tarih');
                        }
                    } catch (e) {
                        console.error('Tarih doğrulama hatası:', e);
                        const today = new Date();
                        taskDueDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}T${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
                    }
                }
                
                // Görevi ekle
                tasks.push({
                    id: taskId,
                    text: hearing.text,
                    dueDate: taskDueDate,
                    important: hearing.important,
                    completed: hearing.completed,
                    assignee: hearing.assignee,
                    createdAt: new Date().toISOString()
                });
            });

            // Güncellenmiş görev listesini kaydet
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // TaskManager modülüne bildirim gönder
            try {
                const tasksUpdatedEvent = new CustomEvent('tasksUpdated', {
                    detail: { tasks: tasks }
                });
                window.dispatchEvent(tasksUpdatedEvent);
                debugLog('tasksUpdated olayı gönderildi, görev sayısı:', tasks.length);
            } catch (eventError) {
                console.error('Event gönderme hatası:', eventError);
            }
            
            // Chrome extension'da görevleri güncelle
            try {
                chrome.runtime.sendMessage({ action: 'updateTasks', tasks: tasks });
            } catch (err) {
                debugLog('Chrome mesaj gönderme hatası (önemli değil):', err);
            }
            
            // Görevler eklendiğinde sayfayı yenile
            try {
                // Kısa bir gecikme ile sayfayı yenile (verilerin kaydedilmesi için zaman tanı)
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } catch (err) {
                debugLog('Sayfa yenileme hatası:', err);
            }
        } catch (error) {
            console.error('Görevler kaydedilirken hata oluştu:', error);
        }
    }

    // Sayfa yüklendiğinde çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addBulkTaskButton);
    } else {
        addBulkTaskButton();
    }
}

// UYAP Duruşma Kartı ile Task Entegrasyonu
console.log('UYAP Asistan: Duruşma kartı entegrasyonu başlatıldı');

function updateDurusmaKarti() {
    // Hedef kartın başlığını güncelle
    const headerLabel = document.querySelector('.hedef-card-header--label');
    if (headerLabel) {
        headerLabel.textContent = 'Bildirimler';
    }

    // Mevcut liste elemanlarının metinlerini kaydet (çakışmaları önlemek için)
    const scheduleList = document.querySelector('.schedule-list');
    if (!scheduleList) return;
    
    const existingItems = new Set();
    scheduleList.querySelectorAll('li').forEach(li => {
        // İçerik olarak tüm metni (tarih dahil) kaydediyoruz
        const content = li.textContent.trim().replace(/\s+/g, ' ');
        existingItems.add(content);
    });

    // Task listesini al
    chrome.storage.local.get(['tasks'], (result) => {
        if (!result.tasks) return;

        // Bu haftanın başlangıç ve bitiş tarihlerini hesapla
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Bu haftaya ait görevleri filtrele
        // Ayrıca "Duruşma:" veya "Keşif:" içeren görevleri filtrelemiyoruz, 
        // çünkü bunlar zaten UYAP tarafından gösteriliyor olabilir
        const weeklyTasks = result.tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            const isThisWeek = taskDate >= startOfWeek && taskDate <= endOfWeek;
            
            // Sistem tarafından zaten gösterilen duruşma ve keşifleri hariç tut
            const isDurusmaOrKesif = task.text.startsWith('Duruşma:') || task.text.startsWith('Keşif:');
            return isThisWeek && !isDurusmaOrKesif;
        });

        // Görevleri listeye ekle
        if (weeklyTasks.length > 0) {
            weeklyTasks.forEach(task => {
                const taskDate = new Date(task.dueDate);
                
                // Bu görevin içeriğini oluştur
                const dateStr = taskDate.toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                // Görev içeriğini oluştur
                const taskContent = `${dateStr} ${task.text} ${task.important ? 'Önemli Görev' : 'Görev'}`;
                
                // Bu görev zaten listede varsa ekleme
                if (existingItems.has(taskContent)) return;
                
                // Görev listede yoksa ekle
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="dot-circle dot-circle--0"></div>
                    <span class="icon-list-item">
                        <strong>${dateStr} </strong>
                    </span>
                    <span class="icon-list-text mb-1 ">${task.text}</span>
                    <span class="icon-list-tag ">
                        <div class="label-light ">${task.important ? 'Önemli Görev' : 'Görev'}</div>
                    </span>
                `;
                scheduleList.appendChild(li);
                
                // Eklediğimiz görevi existingItems'a ekle ki tekrar eklemeyelim
                existingItems.add(taskContent);
            });
        }
    });
}

// Sayfa yüklendiğinde kartı güncelle
document.addEventListener('DOMContentLoaded', () => {
    // Yüklenme sonrası biraz gecikme ile çalıştır (UYAP'ın kendi listesini yüklemesi için)
    setTimeout(updateDurusmaKarti, 1000);
});

// Custom Event dinleyicisi ekle - localStorage değişikliklerini yakalamak için
window.addEventListener('tasksUpdated', () => {
    console.log('UYAP Asistan: tasksUpdated eventi alındı, duruşma kartı güncelleniyor');
    updateDurusmaKarti();
});

// Görev güncellemelerini dinle
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'tasksUpdated' || message.action === 'forceTasksUpdate') {
        console.log('UYAP Asistan: Task güncelleme mesajı alındı, duruşma kartı güncelleniyor');
        updateDurusmaKarti();
    }
    return true; // Async yanıt için
});

// MutationObserver ile duruşma kartının DOM'a eklendiğini izle
function observeScheduleList() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Duruşma kartının eklenip eklenmediğini kontrol et
                        const scheduleList = node.querySelector ? node.querySelector('.schedule-list') : null;
                        if (scheduleList || node.classList && node.classList.contains('schedule-list')) {
                            console.log('UYAP Asistan: Duruşma listesi DOM\'a eklendi, görevler entegre ediliyor');
                            // Biraz bekleyerek UYAP'ın kendi listesini tamamlamasını sağla
                            setTimeout(updateDurusmaKarti, 500);
                        }
                    }
                }
            }
        }
    });

    // Tüm DOM değişikliklerini izle
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Sayfa yüklendiğinde gözlemciyi başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeScheduleList);
} else {
    observeScheduleList();
}

// İlk yüklemede çalıştır
updateDurusmaKarti();