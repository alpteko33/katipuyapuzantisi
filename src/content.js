// Content script for UYAP Portal Extension
console.log('UYAP Asistan: Content script yüklendi');

let taskManager = null;
let calendar = null;  // Calendar instance'ı için değişken
let settingsManager = null;
let accountManager = null;
let calculatorManager = null; // Calculator Manager için değişken
let fileTracking = null; // File Tracking Manager için değişken
let synchronizationManager = null; // Synchronization Manager için değişken

function loadFontAwesome() {
    console.log('UYAP Asistan: Font Awesome yükleniyor');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    console.log('UYAP Asistan: Font Awesome yüklendi');
}

function loadStyles() {
    console.log('UYAP Asistan: Stiller yükleniyor');
    
    const styles = [
        'styles/tasks.css',
        'styles/calendar.css',
        'styles/calculator.css'
    ];

    styles.forEach(style => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL(style);
        document.head.appendChild(link);
    });
    
    console.log('UYAP Asistan: Stiller yüklendi');
}

async function loadModules() {
    try {
        // Load Task Manager
        const tasksSrc = chrome.runtime.getURL('src/tasks.js');
        const tasksModule = await import(tasksSrc);
        taskManager = new tasksModule.default();
        console.log('UYAP Asistan: Task Manager yüklendi');

        // Task güncelleme mesajlarını dinle
        chrome.runtime.onMessage.addListener((message) => {
            if (message.action === 'tasksUpdated' && Array.isArray(message.tasks) && taskManager) {
                console.log('UYAP Asistan: Content.js - tasksUpdated mesajı alındı');
                taskManager.tasks = message.tasks;
                // Görevler paneli açıksa, içeriğini güncelle
                if (document.querySelector('.tasks-overlay.active')) {
                    taskManager.renderTasks();
                }
            }
        });

        // Load Calendar
        const calendarSrc = chrome.runtime.getURL('src/calendar.js');
        const calendarModule = await import(calendarSrc);
        calendar = new calendarModule.default();
        console.log('UYAP Asistan: Calendar yüklendi');

        // Load Settings
        const settingsSrc = chrome.runtime.getURL('src/settings.js');
        const settingsModule = await import(settingsSrc);
        settingsManager = new settingsModule.default();
        console.log('UYAP Asistan: Settings Manager yüklendi');

        // Load Account
        const accountSrc = chrome.runtime.getURL('src/account.js');
        const accountModule = await import(accountSrc);
        accountManager = new accountModule.default();
        console.log('UYAP Asistan: Account Manager yüklendi');

        // Load Calculator
        const calculatorSrc = chrome.runtime.getURL('src/calculator.js');
        const calculatorModule = await import(calculatorSrc);
        calculatorManager = new calculatorModule.default();
        console.log('UYAP Asistan: Calculator Manager yüklendi');
        
        // Load Synchronization
        const synchronizationSrc = chrome.runtime.getURL('src/synchronization.js');
        const synchronizationModule = await import(synchronizationSrc);
        synchronizationManager = new synchronizationModule.default();
        console.log('UYAP Asistan: Synchronization Manager yüklendi');
        
        // Inject.js ve Quick Petition.js'i yükle (önce)
        await loadInjectionScripts();
        
        // Load File Tracking (sonra)
        const fileTrackingSrc = chrome.runtime.getURL('src/file-tracking.js');
        const fileTrackingModule = await import(fileTrackingSrc);
        fileTracking = new fileTrackingModule.default();
        console.log('UYAP Asistan: File Tracking Manager yüklendi');
    } catch (error) {
        console.error('UYAP Asistan: Modüller yüklenirken hata:', error);
    }
}

// Inject script for UYAP
async function loadInjectionScripts() {
    try {
        // Load Injection
        const injectSrc = chrome.runtime.getURL('src/inject.js');
        await import(injectSrc);
        console.log('UYAP Asistan: Inject.js yüklendi');
        
        // Load Quick Petition
        const quickPetitionSrc = chrome.runtime.getURL('src/quick-petition.js');
        await import(quickPetitionSrc);
        console.log('UYAP Asistan: Quick Petition yüklendi');
    } catch (error) {
        console.error('UYAP Asistan: Injection scripts yüklenirken hata:', error);
    }
}

function createPanel() {
    console.log('UYAP Asistan: Panel oluşturuluyor');
    
    // Create toggle button
    const toggle = document.createElement('div');
    toggle.className = 'extension-toggle';
    toggle.innerHTML = '<i class="fas fa-chevron-left"></i><div class="extension-toggle-text">UYAP ASİSTANI</div>';
    document.body.appendChild(toggle);
    console.log('UYAP Asistan: Toggle butonu oluşturuldu');

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'uyap-extension-panel';
    panel.className = 'uyap-extension-panel';

    const panelContent = `
        <div class="relative">
            <div class="extension-close">
                <i class="fas fa-times"></i>
            </div>
        </div>
        
        <div class="extension-logo">
            <h2>UYAP</h2>
            <h3>Asistan</h3>
        </div>
        
        <div class="extension-menu">
            <div class="extension-item" id="tasks">
                <div class="extension-item-content">
                    <i class="fas fa-tasks"></i>
                    <span>Görevler</span>
                </div>
                <i class="fas fa-chevron-down arrow-icon"></i>
            </div>
            
            <div class="extension-item" id="calendar">
                <div class="extension-item-content">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Ajanda</span>
                </div>
                <i class="fas fa-chevron-down arrow-icon"></i>
            </div>
            
            <div class="extension-item" id="calculator">
                <div class="extension-item-content">
                    <i class="fas fa-calculator"></i>
                    <span>Hesaplama İşlemleri</span>
                </div>
                <i class="fas fa-chevron-down arrow-icon"></i>
            </div>
            
            <div class="extension-item" id="synchronization">
                <div class="extension-item-content">
                    <i class="fas fa-sync-alt"></i>
                    <span>Senkronizasyon</span>
                </div>
                <i class="fas fa-chevron-down arrow-icon"></i>
            </div>
            
            <div class="extension-divider"></div>
            
            <div class="extension-item" id="settings">
                <div class="extension-item-content">
                    <i class="fas fa-cog"></i>
                    <span>Genel Ayarlar</span>
                </div>
                <i class="fas fa-chevron-down arrow-icon"></i>
            </div>
            
            <div class="extension-item" id="account">
                <div class="extension-item-content">
                    <i class="fas fa-user-cog"></i>
                    <span>Yönetim Paneli</span>
                </div>
                <i class="fas fa-chevron-down arrow-icon"></i>
            </div>
        </div>
        
        <div class="extension-footer">
            UYAP Asistan v1.0 © 2023
        </div>
    `;

    panel.innerHTML = panelContent;
    document.body.appendChild(panel);
    console.log('UYAP Asistan: Panel oluşturuldu');

    // Toggle panel visibility
    toggle.addEventListener('click', () => {
        console.log('UYAP Asistan: Toggle butonuna tıklandı');
        panel.classList.toggle('active');
        toggle.innerHTML = panel.classList.contains('active') 
            ? '<i class="fas fa-chevron-right"></i><div class="extension-toggle-text">UYAP ASİSTANI</div>' 
            : '<i class="fas fa-chevron-left"></i><div class="extension-toggle-text">UYAP ASİSTANI</div>';
    });

    // Kapatma butonu için event listener
    const closeButton = panel.querySelector('.extension-close');
    closeButton.addEventListener('click', () => {
        console.log('UYAP Asistan: Kapat butonuna tıklandı');
        panel.classList.remove('active');
        toggle.innerHTML = '<i class="fas fa-chevron-left"></i><div class="extension-toggle-text">UYAP ASİSTANI</div>';
    });

    // ESC tuşu için event listener
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && panel.classList.contains('active')) {
            console.log('UYAP Asistan: ESC tuşuna basıldı');
            panel.classList.remove('active');
            toggle.innerHTML = '<i class="fas fa-chevron-left"></i><div class="extension-toggle-text">UYAP ASİSTANI</div>';
        }
    });

    // Event listeners for menu items
    const menuItems = panel.querySelectorAll('.extension-item, .home-item, .favorites-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('id');
            if (id) {
                console.log('UYAP Asistan: Menü öğesine tıklandı:', id);
                // Eğer extension-item ise ve ok ikonu varsa toggle etmeli
                if (item.classList.contains('extension-item')) {
                    item.classList.toggle('active');
                    const arrowIcon = item.querySelector('.arrow-icon');
                    if (arrowIcon) {
                        if (item.classList.contains('active')) {
                            arrowIcon.classList.remove('fa-chevron-down');
                            arrowIcon.classList.add('fa-chevron-up');
                        } else {
                            arrowIcon.classList.remove('fa-chevron-up');
                            arrowIcon.classList.add('fa-chevron-down');
                        }
                    }
                }
                handleMenuClick(id);
            }
        });
    });
}

function handleMenuClick(menuId) {
    console.log('UYAP Asistan: Menü tıklama işleniyor:', menuId);
    switch(menuId) {
        case 'tasks':
            if (taskManager) {
                taskManager.showTasksPanel();
            } else {
                alert('Görevler özelliği yüklenemedi. Lütfen sayfayı yenileyin.');
            }
            break;
        case 'calendar':
            if (calendar) {
                calendar.showCalendar();
            } else {
                alert('Ajanda özelliği yüklenemedi. Lütfen sayfayı yenileyin.');
            }
            break;
        case 'calculator':
            if (calculatorManager) {
                calculatorManager.showCalculatorPanel();
            } else {
                alert('Hesaplama Araçları özelliği yüklenemedi. Lütfen sayfayı yenileyin.');
            }
            break;
        case 'synchronization':
            if (synchronizationManager) {
                synchronizationManager.showSynchronization();
            } else {
                alert('Senkronizasyon özelliği yüklenemedi. Lütfen sayfayı yenileyin.');
            }
            break;
        case 'settings':
            if (settingsManager) {
                settingsManager.showSettings();
            } else {
                alert('Ayarlar özelliği yüklenemedi. Lütfen sayfayı yenileyin.');
            }
            break;
        case 'account':
            if (accountManager) {
                accountManager.showAccount();
            } else {
                alert('Yönetim Paneli özelliği yüklenemedi. Lütfen sayfayı yenileyin.');
            }
            break;
    }
}

// Initialize when the page is loaded
console.log('UYAP Asistan: Sayfa durumu:', document.readyState);

async function init() {
    console.log('UYAP Asistan: Başlatılıyor');
    try {
        loadFontAwesome();
        loadStyles();
        await loadModules();
        createPanel();
        
        // UYAP sayfasından görev eklerken görevler panelini açmak için event listener ekle
        window.addEventListener('openTasksPanel', () => {
            console.log('UYAP Asistan: openTasksPanel olayı alındı');
            if (taskManager) {
                setTimeout(() => {
                    taskManager.showTasksPanel();
                    console.log('UYAP Asistan: Görevler paneli açıldı');
                }, 500); // Kısa bir gecikme ile aç
            }
        });
    } catch (error) {
        console.error('UYAP Asistan: Başlatma hatası:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
} 