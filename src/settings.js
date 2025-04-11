class Settings {
    constructor() {
        this.currentSection = 'interface'; // Default section
        this.setupSettingsUI();
        this.loadSettings(); // Kaydedilmiş ayarları yükle
    }

    // Ayarları localStorage'dan yükle
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('uyapAsistanSettings') || '{}');
        
        // Yazı boyutu ayarı
        const fontSize = settings.fontSize || 'medium';
        document.documentElement.style.setProperty('--base-font-size', this.getFontSize(fontSize));
        
        // Yazı tipi ayarı
        const fontFamily = settings.fontFamily || 'system';
        document.documentElement.style.setProperty('--base-font-family', this.getFontFamily(fontFamily));
        
        // Sessiz mod ayarı
        const quietMode = settings.quietMode || false;
        if (quietMode) {
            document.body.classList.add('quiet-mode');
        }
    }

    // Ayarları localStorage'a kaydet
    saveSettings(settings) {
        localStorage.setItem('uyapAsistanSettings', JSON.stringify(settings));
    }

    // Yazı boyutunu punto cinsinden döndür
    getFontSize(size) {
        const sizes = {
            'small': '14px',
            'medium': '18px',
            'large': '22px'
        };
        return sizes[size] || sizes.medium;
    }

    // Yazı tipini döndür
    getFontFamily(family) {
        const families = {
            'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            'times': '"Times New Roman", Times, serif',
            'arial': 'Arial, sans-serif',
            'roboto': 'Roboto, sans-serif',
            'opensans': '"Open Sans", sans-serif'
        };
        return families[family] || families.system;
    }

    setupSettingsUI() {
        const settingsOverlay = document.createElement('div');
        settingsOverlay.className = 'settings-overlay';
        
        const settingsPopup = document.createElement('div');
        settingsPopup.className = 'settings-popup';
        
        settingsPopup.innerHTML = `
            <div class="settings-close">
                <i class="fas fa-times"></i>
            </div>
            <div class="settings-sidebar">
                <div class="settings-header">
                    <h2>Genel Ayarlar</h2>
                </div>
                <div class="settings-menu">
                    <div class="settings-menu-item active" data-section="interface">
                        <i class="fas fa-palette"></i>
                        <span>Arayüz Ayarları</span>
                    </div>
                    <div class="settings-menu-item" data-section="notifications">
                        <i class="fas fa-bell"></i>
                        <span>Bildirim ve Uyarı Ayarları</span>
                    </div>
                    <div class="settings-menu-item" data-section="privacy">
                        <i class="fas fa-shield-alt"></i>
                        <span>Veri ve Gizlilik Ayarları</span>
                    </div>
                    <div class="settings-menu-item" data-section="reporting">
                        <i class="fas fa-chart-bar"></i>
                        <span>Raporlama Ayarları</span>
                    </div>
                </div>
            </div>
            <div class="settings-main">
                <div class="settings-content">
                    ${this.generateInterfaceSettings()}
                </div>
            </div>
        `;
        
        settingsOverlay.appendChild(settingsPopup);
        document.body.appendChild(settingsOverlay);
        
        this.setupEventListeners(settingsOverlay, settingsPopup);
    }

    generateInterfaceSettings() {
        const settings = JSON.parse(localStorage.getItem('uyapAsistanSettings') || '{}');
        const currentFontFamily = settings.fontFamily || 'system';

        return `
            <div class="settings-section" id="interface-settings">
                <h3>Arayüz Ayarları</h3>
                <div class="settings-group">
                    <h4>Yazı Ayarları</h4>
                    <div class="font-settings">
                        <div class="setting-row">
                            <label>Yazı Boyutu</label>
                            <select class="font-size-select">
                                <option value="small">Küçük</option>
                                <option value="medium" selected>Orta</option>
                                <option value="large">Büyük</option>
                            </select>
                        </div>
                        <div class="setting-row">
                            <label>Yazı Tipi</label>
                            <select class="font-family-select">
                                <option value="system" ${currentFontFamily === 'system' ? 'selected' : ''}>Sistem Yazı Tipi</option>
                                <option value="times" ${currentFontFamily === 'times' ? 'selected' : ''}>Times New Roman</option>
                                <option value="arial" ${currentFontFamily === 'arial' ? 'selected' : ''}>Arial</option>
                                <option value="roboto" ${currentFontFamily === 'roboto' ? 'selected' : ''}>Roboto</option>
                                <option value="opensans" ${currentFontFamily === 'opensans' ? 'selected' : ''}>Open Sans</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateNotificationSettings() {
        return `
            <div class="settings-section" id="notification-settings">
                <h3>Bildirim ve Uyarı Ayarları</h3>
                <div class="settings-group">
                    <h4>Bildirim Tercihleri</h4>
                    <div class="setting-row">
                        <label class="switch-label">
                            <span>Bildirimleri Etkinleştir</span>
                            <label class="switch">
                                <input type="checkbox" checked>
                                <span class="slider round"></span>
                            </label>
                        </label>
                    </div>
                    <div class="notification-options">
                        <div class="setting-row">
                            <label class="checkbox-label">
                                <input type="checkbox" checked>
                                <span>Görev Bildirimleri</span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label class="checkbox-label">
                                <input type="checkbox" checked>
                                <span>Ajanda Hatırlatıcıları</span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label class="checkbox-label">
                                <input type="checkbox" checked>
                                <span>Rapor Bildirimleri</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="settings-group">
                    <h4>Sessiz Mod</h4>
                    <div class="setting-row">
                        <label class="switch-label">
                            <span>Sessiz Modu Etkinleştir</span>
                            <label class="switch">
                                <input type="checkbox" name="quiet-mode">
                                <span class="slider round"></span>
                            </label>
                        </label>
                    </div>
                    <div class="quiet-hours">
                        <div class="setting-row">
                            <label>Başlangıç Saati</label>
                            <input type="time" value="22:00">
                        </div>
                        <div class="setting-row">
                            <label>Bitiş Saati</label>
                            <input type="time" value="07:00">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generatePrivacySettings() {
        return `
            <div class="settings-section" id="privacy-settings">
                <h3>Veri ve Gizlilik Ayarları</h3>
                <div class="settings-group">
                    <h4>Veri Depolama</h4>
                    <div class="storage-options">
                        <div class="setting-row">
                            <label class="radio-label">
                                <input type="radio" name="storage" value="local" checked>
                                <span>Yerel Depolama</span>
                            </label>
                            <p class="setting-description">Verileriniz sadece bu cihazda saklanır</p>
                        </div>
                        <div class="setting-row">
                            <label class="radio-label">
                                <input type="radio" name="storage" value="cloud">
                                <span>Bulut Depolama</span>
                            </label>
                            <p class="setting-description">Verileriniz güvenli bulut sunucularında saklanır</p>
                        </div>
                    </div>
                </div>
                <div class="settings-group">
                    <h4>İzin Yönetimi</h4>
                    <div class="permission-options">
                        <div class="setting-row">
                            <label class="switch-label">
                                <span>Kamera Erişimi</span>
                                <label class="switch">
                                    <input type="checkbox">
                                    <span class="slider round"></span>
                                </label>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label class="switch-label">
                                <span>Mikrofon Erişimi</span>
                                <label class="switch">
                                    <input type="checkbox">
                                    <span class="slider round"></span>
                                </label>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label class="switch-label">
                                <span>Konum Erişimi</span>
                                <label class="switch">
                                    <input type="checkbox">
                                    <span class="slider round"></span>
                                </label>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateReportingSettings() {
        return `
            <div class="settings-section" id="reporting-settings">
                <h3>Raporlama Ayarları</h3>
                <div class="settings-group">
                    <h4>Rapor İçeriği</h4>
                    <div class="report-content-options">
                        <div class="setting-row">
                            <label class="checkbox-label">
                                <input type="checkbox" checked>
                                <span>Yapılan İşler</span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label class="checkbox-label">
                                <input type="checkbox" checked>
                                <span>Gelirler</span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label class="checkbox-label">
                                <input type="checkbox" checked>
                                <span>Giderler</span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label class="checkbox-label">
                                <input type="checkbox" checked>
                                <span>Açılan Davalar</span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label class="checkbox-label">
                                <input type="checkbox" checked>
                                <span>Yeni Müvekkiller</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="settings-group">
                    <h4>Rapor Sıklığı</h4>
                    <div class="report-frequency">
                        <div class="setting-row">
                            <label class="radio-label">
                                <input type="radio" name="frequency" value="daily">
                                <span>Günlük Rapor</span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label class="radio-label">
                                <input type="radio" name="frequency" value="weekly" checked>
                                <span>Haftalık Rapor</span>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label class="radio-label">
                                <input type="radio" name="frequency" value="monthly">
                                <span>Aylık Rapor</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners(overlay, popup) {
        // Close button
        const closeBtn = popup.querySelector('.settings-close');
        closeBtn.addEventListener('click', () => this.hideSettings());
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                this.hideSettings();
            }
        });

        // Prevent closing when clicking inside popup
        popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Menu items
        const menuItems = popup.querySelectorAll('.settings-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const section = item.dataset.section;
                const content = popup.querySelector('.settings-content');
                
                switch(section) {
                    case 'interface':
                        content.innerHTML = this.generateInterfaceSettings();
                        break;
                    case 'notifications':
                        content.innerHTML = this.generateNotificationSettings();
                        break;
                    case 'privacy':
                        content.innerHTML = this.generatePrivacySettings();
                        break;
                    case 'reporting':
                        content.innerHTML = this.generateReportingSettings();
                        break;
                }
                
                this.currentSection = section;
                this.setupSettingsEventListeners(popup);
            });
        });

        this.setupSettingsEventListeners(popup);
    }

    setupSettingsEventListeners(popup) {
        // Yazı boyutu değiştirme
        const fontSizeSelect = popup.querySelector('.font-size-select');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => {
                const fontSize = e.target.value;
                document.documentElement.style.setProperty('--base-font-size', this.getFontSize(fontSize));
                this.saveSettings({
                    ...JSON.parse(localStorage.getItem('uyapAsistanSettings') || '{}'),
                    fontSize
                });
            });
        }

        // Yazı tipi değiştirme
        const fontFamilySelect = popup.querySelector('.font-family-select');
        if (fontFamilySelect) {
            fontFamilySelect.addEventListener('change', (e) => {
                const fontFamily = e.target.value;
                const fontFamilyValue = this.getFontFamily(fontFamily);
                document.documentElement.style.setProperty('--base-font-family', fontFamilyValue);
                document.body.style.setProperty('--base-font-family', fontFamilyValue);
                this.saveSettings({
                    ...JSON.parse(localStorage.getItem('uyapAsistanSettings') || '{}'),
                    fontFamily
                });
            });
        }

        // Sessiz mod değiştirme
        const quietModeInput = popup.querySelector('input[type="checkbox"][name="quiet-mode"]');
        if (quietModeInput) {
            quietModeInput.addEventListener('change', (e) => {
                const quietMode = e.target.checked;
                if (quietMode) {
                    document.body.classList.add('quiet-mode');
                } else {
                    document.body.classList.remove('quiet-mode');
                }
                this.saveSettings({
                    ...JSON.parse(localStorage.getItem('uyapAsistanSettings') || '{}'),
                    quietMode
                });
            });
        }
    }

    showSettings() {
        const overlay = document.querySelector('.settings-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    hideSettings() {
        const overlay = document.querySelector('.settings-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
}

export default Settings; 