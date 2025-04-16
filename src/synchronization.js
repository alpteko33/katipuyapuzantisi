class SynchronizationManager {
    constructor() {
        this.isReady = false;
        this.isStarted = false;
        this.isSyncing = false;
        this.overlay = null;
        this.popup = null;
        this.checkButton = null;
        this.startButton = null;
        this.statusElement = null;
        this.statistics = {
            totalFiles: 0,
            openFiles: 0,
            closedFiles: 0,
            otherFiles: 0,
            clientCount: 0,
            opposingPartyCount: 0
        };
        
        // Avukat bilgileri
        this.avukatBilgileri = null;
        
        // Müvekkil ve karşı taraf listesi
        this.muvekkilListesi = new Set();
        this.karsiTarafListesi = new Set();
        
        // Yargı birimi sorgu parametreleri
        this.requestPayloads = [
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0921", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0921", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0901", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0901", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "7702", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "7702", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0914", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0914", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0911", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0911", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0910", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0910", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0934", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0934", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0929", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0929", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0913", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0913", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0924", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0924", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0915", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0915", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0935", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0935", "birimTuru3": "0"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0920", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0920", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0922", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0922", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0926", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0926", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "7710", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "7710", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "7703", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "7703", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0933", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0933", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0927", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0927", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0906", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0906", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0904", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0904", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0912", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0912", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0925", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0925", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0908", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0908", "birimTuru3": "1"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "1101", "birimTuru3": "2"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "1101", "birimTuru3": "2"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0917", "birimTuru3": "6"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0917", "birimTuru3": "6"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0919", "birimTuru3": "6"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0919", "birimTuru3": "6"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "0918", "birimTuru3": "6"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "0918", "birimTuru3": "6"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "9791", "birimTuru3": "11"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "9791", "birimTuru3": "11"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "6701", "birimTuru3": "25"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "6701", "birimTuru3": "25"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 0, "birimTuru2": "6702", "birimTuru3": "25"},
            {"pageSize": 1000, "pageNumber": 1, "dosyaDurumKod": 1, "birimTuru2": "6702", "birimTuru3": "25"}
        ];
        
        this.currentPayloadIndex = 0;
        this.allResponseData = [];
        this.progressElement = null;
    }

    showSynchronization() {
        if (document.querySelector('.tasks-overlay.active')) {
            console.log('UYAP Asistan: Başka bir panel zaten açık');
            return;
        }

        // Overlay oluştur
        const tasksOverlay = document.createElement('div');
        tasksOverlay.className = 'tasks-overlay';
        
        // Büyük popup oluştur (tasks-popup sınıfını kullan)
        const tasksPopup = document.createElement('div');
        tasksPopup.className = 'tasks-popup';
        
        // Daha önce senkronize edildi mi kontrolü
        let syncStatus = "Henüz senkronizasyon yapılmadı.";
        let dashboardHTML = '';
        
        // Chrome storage'dan veri var mı kontrol et
        chrome.storage.local.get(['uyap-senkronizasyon'], (result) => {
            if (result && result['uyap-senkronizasyon']) {
                syncStatus = "Son senkronizasyon: " + new Date().toLocaleString();
                
                // Kaydedilmiş istatistikleri al
                chrome.storage.local.get(['uyap-sync-statistics'], (statsResult) => {
                    if (statsResult && statsResult['uyap-sync-statistics']) {
                        this.statistics = statsResult['uyap-sync-statistics'];
                        this.updateDashboard();
                    }
                });
            }
        });
        
        tasksPopup.innerHTML = `
            <div class="tasks-sidebar">
                <div class="tasks-filters">
                    <button class="filter-btn active">
                        <i class="fas fa-sync-alt"></i>
                        Senkronizasyon
                    </button>
                </div>
            </div>
            <div class="tasks-main">
                <div class="tasks-header">
                    <h2>UYAP Senkronizasyonu</h2>
                    <div class="tasks-controls">
                        <div class="tasks-close">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                </div>
                <div class="tasks-content">
                    <div class="sync-status" style="background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); margin-bottom: 20px;">
                        <p style="font-size: 16px; text-align: center; margin-bottom: 20px;">Lütfen UYAP Portal'ın açık olduğunu kontrol edin.</p>
                        <div class="sync-buttons" style="display: flex; justify-content: center;">
                            <button class="check-button" style="padding: 12px 24px; background-color: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Kontrol Et</button>
                        </div>
                    </div>
                    <div id="sync-dashboard" style="display: none; margin-bottom: 20px;">
                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                            <h3 style="margin-top: 0; color: #2c3e50; font-size: 18px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">
                                Senkronizasyon İstatistikleri
                            </h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
                                <div class="stat-card" style="flex: 1; min-width: 180px; background-color: #fff; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 4px solid #3498db;">
                                    <div style="font-size: 14px; color: #7f8c8d;">Toplam Dosya Sayısı</div>
                                    <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin-top: 5px;" id="total-files">0</div>
                                </div>
                                <div class="stat-card" style="flex: 1; min-width: 180px; background-color: #fff; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 4px solid #2ecc71;">
                                    <div style="font-size: 14px; color: #7f8c8d;">Açık Dosya Sayısı</div>
                                    <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin-top: 5px;" id="open-files">0</div>
                                </div>
                                <div class="stat-card" style="flex: 1; min-width: 180px; background-color: #fff; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 4px solid #e74c3c;">
                                    <div style="font-size: 14px; color: #7f8c8d;">Kapalı Dosya Sayısı</div>
                                    <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin-top: 5px;" id="closed-files">0</div>
                                </div>
                            </div>
                            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
                                <div class="stat-card" style="flex: 1; min-width: 180px; background-color: #fff; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 4px solid #9b59b6;">
                                    <div style="font-size: 14px; color: #7f8c8d;">Müvekkil Sayısı</div>
                                    <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin-top: 5px;" id="client-count">0</div>
                                </div>
                                <div class="stat-card" style="flex: 1; min-width: 180px; background-color: #fff; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 4px solid #f39c12;">
                                    <div style="font-size: 14px; color: #7f8c8d;">Karşı Taraf Sayısı</div>
                                    <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin-top: 5px;" id="opposing-party-count">0</div>
                                </div>
                                <div class="stat-card" style="flex: 1; min-width: 180px; background-color: #fff; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 4px solid #1abc9c;">
                                    <div style="font-size: 14px; color: #7f8c8d;">Son Güncelleme</div>
                                    <div style="font-size: 16px; font-weight: bold; color: #2c3e50; margin-top: 5px;" id="last-update">${syncStatus}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        tasksOverlay.appendChild(tasksPopup);
        document.body.appendChild(tasksOverlay);
        
        // Referansları kaydet
        this.overlay = tasksOverlay;
        this.popup = tasksPopup;
        this.statusElement = tasksPopup.querySelector('.sync-status p');
        this.checkButton = tasksPopup.querySelector('.check-button');
        
        // Buton olayını dinle
        this.checkButton.addEventListener('click', () => this.checkConnection());
        
        // Kapatma butonu
        const closeBtn = tasksPopup.querySelector('.tasks-close');
        closeBtn.addEventListener('click', () => this.hidePanel());
        
        // ESC tuşu ile kapatma
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && tasksOverlay.classList.contains('active')) {
                this.hidePanel();
            }
        });
        
        // Popup içine tıklama olayını engelle
        tasksPopup.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Overlay'e tıklayınca kapat
        tasksOverlay.addEventListener('click', (e) => {
            if (e.target === tasksOverlay) {
                this.hidePanel();
            }
        });

        // Overlay'ı göster
        setTimeout(() => {
            tasksOverlay.classList.add('active');
            
            // İstatistikleri göster
            chrome.storage.local.get(['uyap-senkronizasyon'], (result) => {
                if (result && result['uyap-senkronizasyon']) {
                    document.getElementById('sync-dashboard').style.display = 'block';
                }
            });
        }, 10);
    }
    
    // İstatistik panelini güncelle
    updateDashboard() {
        document.getElementById('total-files').textContent = this.statistics.totalFiles;
        document.getElementById('open-files').textContent = this.statistics.openFiles;
        document.getElementById('closed-files').textContent = this.statistics.closedFiles;
        document.getElementById('client-count').textContent = this.statistics.clientCount;
        document.getElementById('opposing-party-count').textContent = this.statistics.opposingPartyCount;
        document.getElementById('last-update').textContent = new Date().toLocaleString();
    }
    
    hidePanel() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            setTimeout(() => {
                this.overlay.remove();
                this.overlay = null;
                this.popup = null;
            }, 300);
        }
    }

    async checkConnection() {
        this.statusElement.innerHTML = 'UYAP Portal kontrol ediliyor...';
        this.checkButton.disabled = true;
        
        try {
            // UYAP'ın açık olup olmadığını kontrol etmek için istek
            const response = await fetch('https://avukatbeta.uyap.gov.tr/kullanici_bilgileri.uyap', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                this.isReady = true;
                this.statusElement.innerHTML = 'UYAP Portal açık. Senkronizasyon başlatılabilir.';
                this.checkButton.style.display = 'none';
                
                // Senkronizasyonu başlat düğmesini ekle
                const buttonContainer = this.popup.querySelector('.sync-buttons');
                this.startButton = document.createElement('button');
                this.startButton.style.padding = '12px 24px';
                this.startButton.style.backgroundColor = '#3498db';
                this.startButton.style.color = 'white';
                this.startButton.style.border = 'none';
                this.startButton.style.borderRadius = '5px';
                this.startButton.style.cursor = 'pointer';
                this.startButton.style.fontWeight = 'bold';
                this.startButton.textContent = 'Senkronizasyonu Başlat';
                buttonContainer.appendChild(this.startButton);
                
                // İlerleme göstergesi oluştur
                this.progressElement = document.createElement('div');
                this.progressElement.style.marginTop = '15px';
                this.progressElement.style.fontSize = '14px';
                this.progressElement.style.color = '#555';
                this.progressElement.style.textAlign = 'center';
                this.progressElement.innerHTML = '';
                buttonContainer.parentNode.appendChild(this.progressElement);
                
                // Başlat düğmesine olay dinleyicisi ekle
                this.startButton.addEventListener('click', () => this.startSynchronization());
            } else {
                this.statusElement.innerHTML = 'UYAP Portal erişilemiyor. Lütfen UYAP\'a giriş yaptığınızdan emin olun.';
                this.checkButton.disabled = false;
            }
        } catch (error) {
            console.error('Bağlantı kontrol edilirken hata:', error);
            this.statusElement.innerHTML = 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve UYAP\'a giriş yapın.';
            this.checkButton.disabled = false;
        }
    }

    async startSynchronization() {
        if (this.isSyncing) {
            return; // Zaten senkronizasyon yapılıyorsa tekrar başlatma
        }
        
        this.isSyncing = true;
        this.isStarted = true;
        this.startButton.disabled = true;
        this.statusElement.innerHTML = 'Senkronizasyon başlatılıyor...';
        
        // Senkronizasyon başlarken istatistikleri sıfırla
        this.statistics = {
            totalFiles: 0,
            openFiles: 0,
            closedFiles: 0,
            otherFiles: 0,
            clientCount: 0,
            opposingPartyCount: 0
        };
        
        // Tüm yanıtları saklamak için diziyi temizle
        this.allResponseData = [];
        // İşlenecek istek indeksini sıfırla
        this.currentPayloadIndex = 0;
        
        try {
            // Tüm istekleri sırayla işle
            await this.processNextRequest();
        } catch (error) {
            console.error('Senkronizasyon sırasında hata:', error);
            this.statusElement.innerHTML = `Senkronizasyon sırasında bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.`;
            this.startButton.disabled = false;
            this.isSyncing = false;
        }
    }
    
    async processNextRequest() {
        // Tüm istekler tamamlandıysa, sonuçları birleştir ve kaydet
        if (this.currentPayloadIndex >= this.requestPayloads.length) {
            await this.finalizeSync();
            return;
        }
        
        const totalRequests = this.requestPayloads.length;
        const currentRequest = this.currentPayloadIndex + 1;
        
        // İlerleme durumunu güncelle
        this.progressElement.innerHTML = `İşleniyor: ${currentRequest}/${totalRequests} (${Math.round(currentRequest/totalRequests*100)}%)`;
        
        const payload = this.requestPayloads[this.currentPayloadIndex];
        
        try {
            // Yargı birimi kodu ve durum bilgisini insan tarafından okunabilir formata çevir
            let birimAdi = this.getBirimAdi(payload.birimTuru2);
            let durumAdi = payload.dosyaDurumKod === 0 ? "Açık" : "Kapalı";
            
            this.statusElement.innerHTML = `${birimAdi} yargı birimindeki ${durumAdi} dosyalar sorgulanıyor...`;
            
            // Dava dosyalarını çekmek için istek gönderiyoruz
            const response = await fetch('https://avukatbeta.uyap.gov.tr/search_phrase_detayli.ajx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`API yanıtı alındı (${birimAdi}, ${durumAdi}):`, data);
                
                // API yanıtı geçerli ise sonuçları ekle
                if (data && Array.isArray(data) && data.length === 2) {
                    // Eğer dosya listesi varsa (ilk eleman), her bir dosya için birimAdi'ni kontrol et ve doğru değeri al
                    if (Array.isArray(data[0]) && data[0].length > 0) {
                        // Her bir dosya için tam mahkeme adını kontrol et
                        data[0].forEach(dosya => {
                            // UYAP'tan gelen tam mahkeme adı varsa, bunu kullan
                            if (dosya.mahkemeAdi) {
                                // Dosya gerçek mahkeme adını güncelle
                                dosya.birimAdiTam = dosya.mahkemeAdi;
                                console.log(`Dosya için gerçek mahkeme adı bulundu: ${dosya.mahkemeAdi}`);
                            } else if (dosya.birimAdi) {
                                // Eğer mahkemeAdi yoksa ama birimAdi varsa bunu kullan
                                dosya.birimAdiTam = dosya.birimAdi;
                                console.log(`Dosya için birimAdi kullanılıyor: ${dosya.birimAdi}`);
                            } else {
                                // Hiçbir mahkeme adı yoksa, getBirimAdi'den gelen değeri kullan
                                dosya.birimAdiTam = birimAdi;
                                
                                // Mahkeme numarası varsa ekle
                                if (dosya.mahkemeNo) {
                                    dosya.birimAdiTam = `${birimAdi} ${dosya.mahkemeNo}.`;
                                }
                                
                                console.log(`Dosya için varsayılan birimAdi kullanılıyor: ${dosya.birimAdiTam}`);
                            }
                        });
                    }
                
                    this.allResponseData.push({
                        payload: payload,
                        response: data,
                        birimAdi: birimAdi,
                        durumAdi: durumAdi
                    });
                }
                
                // İndeksi artır ve bir sonraki isteği başlat
                this.currentPayloadIndex++;
                // Kısa bir bekleme süresi ekleyelim ki API'yi aşırı yüklemeyelim
                setTimeout(() => this.processNextRequest(), 500);
            } else {
                console.error(`API isteği başarısız oldu (${birimAdi}, ${durumAdi}):`, response.status, response.statusText);
                // Hata olsa bile bir sonraki isteğe geç
                this.currentPayloadIndex++;
                setTimeout(() => this.processNextRequest(), 500);
            }
        } catch (error) {
            console.error(`İstek işlenirken hata (${this.currentPayloadIndex}):`, error);
            // Hata olsa bile bir sonraki isteğe geç
            this.currentPayloadIndex++;
            setTimeout(() => this.processNextRequest(), 500);
        }
    }
    
    // Yargı birimi kodundan insan tarafından okunabilir isim elde et
    getBirimAdi(birimKodu) {
        const birimler = {
            "0921": "Ağır Ceza Mahkemesi",
            "0901": "Asliye Ceza Mahkemesi",
            "7702": "Asliye Hukuk Mahkemesi",
            "0914": "Asliye Ticaret Mahkemesi",
            "0911": "Çocuk Ağır Ceza Mahkemesi",
            "0910": "Çocuk Mahkemesi",
            "0934": "Fikri ve Sınai Haklar Ceza Mahkemesi",
            "0929": "Fikri ve Sınai Haklar Hukuk Mahkemesi",
            "0913": "İcra Ceza Mahkemesi",
            "0924": "İcra Hukuk Mahkemesi",
            "0915": "İş Mahkemesi",
            "0935": "Kadastro Mahkemesi",
            "0920": "Sulh Ceza Mahkemesi",
            "0922": "Sulh Hukuk Mahkemesi",
            "0926": "Tüketici Mahkemesi",
            "7710": "Ceza Dairesi",
            "7703": "Hukuk Dairesi",
            "0933": "İdare Mahkemesi",
            "0927": "Vergi Mahkemesi",
            "0906": "İnfaz Hakimliği",
            "0904": "Bölge Adliye",
            "0912": "Bölge İdare",
            "0925": "Anayasa Mahkemesi",
            "0908": "Yargıtay",
            "1101": "Cumhuriyet Başsavcılığı",
            "0917": "İcra Dairesi",
            "0919": "İcra Müdürlüğü",
            "0918": "İflas Müdürlüğü",
            "9791": "Adli Sicil Müdürlüğü",
            "6701": "Tahkim",
            "6702": "Arabuluculuk Bürosu"
        };
        
        return birimler[birimKodu] || `Birim ${birimKodu}`;
    }
    
    async finalizeSync() {
        console.log('Tüm istekler tamamlandı, sonuçlar birleştiriliyor...');
        
        // Tüm dosyaları birleştir
        let allFiles = [];
        let totalFileCount = 0;
        let acikDosyaSayisi = 0;
        let kapaliDosyaSayisi = 0;
        
        // Tüm yanıtları işle
        this.allResponseData.forEach(item => {
            const data = item.response;
            const payload = item.payload;
            
            // API yanıtının düzgün formatını kontrol et
            if (Array.isArray(data) && data.length === 2) {
                // Dosya sayısını ayır (API'den gelen toplam)
                const dosyaSayisi = data[1] || 0;
                
                // İstek türüne göre dosya sayısını artır
                if (payload.dosyaDurumKod === 0) {
                    // Açık dosyalar (dosyaDurumKod: 0)
                    acikDosyaSayisi += dosyaSayisi;
                    console.log(`${item.birimAdi} için ${dosyaSayisi} açık dosya eklendi.`);
                } else if (payload.dosyaDurumKod === 1) {
                    // Kapalı dosyalar (dosyaDurumKod: 1)
                    kapaliDosyaSayisi += dosyaSayisi;
                    console.log(`${item.birimAdi} için ${dosyaSayisi} kapalı dosya eklendi.`);
                }
                
                // Toplam dosya sayısını güncelle
                totalFileCount += dosyaSayisi;
                
                // Dosyaları birleştir
                if (Array.isArray(data[0])) {
                    allFiles = allFiles.concat(data[0]);
                }
            }
        });
        
        console.log(`Toplam dosya sayısı: ${totalFileCount}, Birleştirilmiş dosya sayısı: ${allFiles.length}`);
        console.log(`Açık: ${acikDosyaSayisi}, Kapalı: ${kapaliDosyaSayisi}`);
        
        // İstatistikleri güncelle (sadece dosya sayıları)
        this.statistics = {
            totalFiles: totalFileCount,
            openFiles: acikDosyaSayisi,
            closedFiles: kapaliDosyaSayisi,
            otherFiles: 0,
            clientCount: 0, // Şimdilik 0, daha sonra güncellenecek
            opposingPartyCount: 0 // Şimdilik 0, daha sonra güncellenecek
        };
        
        // Birleşik veriyi sakla
        const combinedData = [allFiles, totalFileCount];
        
        try {
            // Veriyi Chrome uzantı depolama alanına kaydet
            await new Promise((resolve, reject) => {
                chrome.storage.local.set({ 'uyap-senkronizasyon': combinedData }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Chrome depolama hatası:', chrome.runtime.lastError);
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        console.log('Veri başarıyla Chrome depolama alanına kaydedildi');
                        resolve();
                    }
                });
            });
            
            // Şimdi ek bilgileri toplamaya başla
            await this.collectExtraInformation(allFiles);
            
            // İstatistikleri depola
            await new Promise((resolve) => {
                chrome.storage.local.set({ 'uyap-sync-statistics': this.statistics }, resolve);
            });
            
            // Dashboard'u göster
            document.getElementById('sync-dashboard').style.display = 'block';
            
            // İstatistikleri güncelle
            this.updateDashboard();
            
            // Sonucu göster
            this.progressElement.innerHTML = '';
            this.statusElement.innerHTML = `Senkronizasyon başarıyla tamamlandı. Toplam ${totalFileCount} dosya elde edildi (${acikDosyaSayisi} açık, ${kapaliDosyaSayisi} kapalı).`;
            
            // Butonu güncelle
            this.startButton.textContent = 'Senkronizasyon Tamamlandı';
            this.startButton.disabled = true;
            
            // 3 saniye sonra butonu tekrar aktif et
            setTimeout(() => {
                this.isSyncing = false;
                this.startButton.disabled = false;
                this.startButton.textContent = 'Senkronizasyonu Yenile';
            }, 3000);
        } catch (error) {
            console.error('Veriler kaydedilirken hata:', error);
            this.statusElement.innerHTML = `Veriler kaydedilirken bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.`;
            this.isSyncing = false;
            this.startButton.disabled = false;
        }
    }
    
    // Ek bilgileri topla (taraf bilgileri vb.)
    async collectExtraInformation(allFiles) {
        try {
            // Avukat bilgilerini al
            await this.getAvukatBilgileri();
            
            if (this.avukatBilgileri) {
                console.log('Avukat bilgileri alındı:', this.avukatBilgileri);
                const avukatAdSoyad = `${this.avukatBilgileri.adi} ${this.avukatBilgileri.soyadi}`;
                
                // Avukat bilgilerini Kullanıcı Bilgileri popup'ına da kaydet
                await this.saveAvukatBilgileriToAccount();
                
                // Taraf bilgilerini topla
                this.progressElement.innerHTML = '0/0 (0%) - Dosya taraf bilgileri alınıyor...';
                this.statusElement.innerHTML = 'Dosya taraf bilgileri alınıyor...';
                
                // Müvekkil ve karşı taraf listelerini temizle
                this.muvekkilListesi.clear();
                this.karsiTarafListesi.clear();
                
                // Dosya sayısına göre işlem sınırı belirle (performans için)
                const maxDosyaSayisi = Math.min(allFiles.length, 100); // En fazla 100 dosya işle
                
                // Dosyaların detaylarını saklamak için dizi
                this.dosyaDetaylari = [];
                
                // Ayrıca birimAdi ve dosya bilgisi eşleştirmelerini tutacak bir harita oluştur
                // Bu sayede daha sonra hızlıca erişebiliriz
                this.birimAdiEslesmeleri = new Map();
                
                // Birim-dosya eşleştirmelerini hazırla
                if (this.allResponseData && this.allResponseData.length > 0) {
                    this.allResponseData.forEach(responseItem => {
                        if (responseItem.response && Array.isArray(responseItem.response[0])) {
                            responseItem.response[0].forEach(dosya => {
                                const dosyaId = this.getDosyaId(dosya);
                                if (dosyaId) {
                                    // Her dosya için tam birimAdi bilgisini hazırla
                                    let tamBirimAdi = null;
                                    
                                    // Tam mahkeme adı öncelik sırası: birimAdiTam -> mahkemeAdi -> birimAdi -> genel birimAdi
                                    if (dosya.birimAdiTam) {
                                        tamBirimAdi = dosya.birimAdiTam;
                                    } else if (dosya.mahkemeAdi) {
                                        tamBirimAdi = dosya.mahkemeAdi;
                                    } else if (dosya.birimAdi) {
                                        tamBirimAdi = dosya.birimAdi;
                                    } else {
                                        // Hiçbiri yoksa, genel birimAdi ve mahkemeNo'yu birleştir
                                        tamBirimAdi = responseItem.birimAdi || "";
                                        
                                        // Mahkeme numarası varsa ekle
                                        if (dosya.mahkemeNo) {
                                            tamBirimAdi = `${tamBirimAdi} ${dosya.mahkemeNo}.`;
                                        }
                                    }
                                    
                                    this.birimAdiEslesmeleri.set(dosyaId, {
                                        birimAdi: responseItem.birimAdi,
                                        tamBirimAdi: tamBirimAdi, // Tam mahkeme adını da ekle
                                        dosya: dosya
                                    });
                                }
                            });
                        }
                    });
                }
                
                console.log(`Birim-dosya eşleştirmeleri hazır. Toplam: ${this.birimAdiEslesmeleri.size}`);
                
                // Dosya taraf bilgilerini topla
                let basariliSorgulama = 0;
                let basarisizSorgulama = 0;
                
                for (let i = 0; i < maxDosyaSayisi; i++) {
                    const progress = Math.round((i + 1) / maxDosyaSayisi * 100);
                    this.progressElement.innerHTML = `${i+1}/${maxDosyaSayisi} (${progress}%) - Dosya taraf bilgileri alınıyor...`;
                    
                    try {
                        // Dosya nesnesini al
                        const dosya = allFiles[i];
                        
                        // Dosya ID'sini bul
                        const dosyaId = this.getDosyaId(dosya);
                        
                        if (dosyaId) {
                            console.log(`${i+1}/${maxDosyaSayisi} - Dosya işleniyor: ${dosyaId}`);
                            const tarafBilgileri = await this.getDosyaTarafBilgileri(dosyaId);
                            
                            if (tarafBilgileri && Array.isArray(tarafBilgileri)) {
                                // Taraf bilgilerini işle ve müvekkil/karşı taraf listelerini güncelle
                                this.processTarafBilgileri(tarafBilgileri, avukatAdSoyad);
                                
                                // Dosya detaylarını sakla (dava no, mahkeme bilgisi, tarih vb.)
                                this.saveDosyaDetayi(dosya, tarafBilgileri, avukatAdSoyad);
                                
                                basariliSorgulama++;
                            } else {
                                console.warn(`Dosya ${dosyaId} için taraf bilgileri alınamadı.`);
                                basarisizSorgulama++;
                            }
                        } else {
                            console.warn(`Dosya indeksi ${i} için ID bulunamadı:`, dosya);
                            basarisizSorgulama++;
                        }
                    } catch (error) {
                        console.error(`Dosya taraf bilgileri alınırken hata (${i}):`, error);
                        basarisizSorgulama++;
                        // Hata durumunda diğer dosyalara devam et
                        continue;
                    }
                    
                    // API'yi aşırı yüklememek için kısa bir bekleme süresi
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                console.log(`Taraf bilgisi sorgulaması tamamlandı. Başarılı: ${basariliSorgulama}, Başarısız: ${basarisizSorgulama}`);
                console.log('Müvekkil listesi:', this.muvekkilListesi);
                console.log('Karşı taraf listesi:', this.karsiTarafListesi);
                
                // Müvekkil bilgilerini Kullanıcı Bilgileri popup'ına da kaydet
                await this.saveMuvekkilBilgileriToAccount();
                
                // Müvekkil ve karşı taraf listelerini de kaydet
                await new Promise((resolve) => {
                    chrome.storage.local.set({ 
                        'uyap-muvekkilListesi': Array.from(this.muvekkilListesi),
                        'uyap-karsiTarafListesi': Array.from(this.karsiTarafListesi)
                    }, resolve);
                });
                
                // Müvekkil ve karşı taraf sayıları
                const muvekkilSayisi = this.muvekkilListesi.size;
                const karsiTarafSayisi = this.karsiTarafListesi.size;
                
                // İstatistikleri güncelle
                this.statistics.clientCount = muvekkilSayisi;
                this.statistics.opposingPartyCount = karsiTarafSayisi;
            }
        } catch (error) {
            console.error('Ek bilgiler alınırken hata:', error);
            // Hata olsa da devam et
        }
    }
    
    // Dosya detaylarını sakla
    saveDosyaDetayi(dosya, tarafBilgileri, avukatAdSoyad) {
        if (!dosya || !tarafBilgileri || !Array.isArray(tarafBilgileri)) return;
        
        try {
            // Dosya bilgilerini al (temel bilgiler)
            let davaNo = dosya.davaNo || dosya.number || dosya.dosyaNo || "Belirtilmemiş";
            let mahkeme = "Belirtilmemiş";
            
            // Dosya ID'sini al
            const dosyaId = this.getDosyaId(dosya);
            
            // Önce doğrudan dosya nesnesinden tam birimAdi'ni kontrol et
            if (dosya.birimAdiTam) {
                mahkeme = dosya.birimAdiTam;
                console.log(`Dosya ${dosyaId} için doğrudan tam birimAdi kullanılıyor: ${mahkeme}`);
            }
            // Önce birimAdiEslesmeleri haritasından daha hızlı bir şekilde bilgileri almayı dene
            else if (dosyaId && this.birimAdiEslesmeleri && this.birimAdiEslesmeleri.has(dosyaId)) {
                const eslesme = this.birimAdiEslesmeleri.get(dosyaId);
                const foundDosya = eslesme.dosya;
                
                // Tam mahkeme adını kullan (yeni eklenen birimAdiTam)
                if (foundDosya.birimAdiTam) {
                    mahkeme = foundDosya.birimAdiTam;
                    console.log(`Dosya ${dosyaId} için birimAdiTam kullanılıyor: ${mahkeme}`);
                }
                // Eğer eşleştirme haritasında kaydettiğimiz tamBirimAdi varsa kullan
                else if (eslesme.tamBirimAdi) {
                    mahkeme = eslesme.tamBirimAdi;
                    console.log(`Dosya ${dosyaId} için tamBirimAdi kullanılıyor: ${mahkeme}`);
                }
                // Eğer birimAdiTam yoksa, diğer alanlara bak
                else if (foundDosya.mahkemeAdi) {
                    mahkeme = foundDosya.mahkemeAdi;
                    console.log(`Dosya ${dosyaId} için mahkemeAdi kullanılıyor: ${mahkeme}`);
                }
                else if (foundDosya.birimAdi) {
                    mahkeme = foundDosya.birimAdi;
                    console.log(`Dosya ${dosyaId} için birimAdi kullanılıyor: ${mahkeme}`);
                }
                else {
                    // Hiçbir tam mahkeme adı yoksa, birimAdi ve mahkemeNo'yu birleştir
                    mahkeme = eslesme.birimAdi || "Belirtilmemiş";
                    
                    // Numara bilgisi varsa ekle
                    if (foundDosya.mahkemeNo) {
                        mahkeme = `${mahkeme} ${foundDosya.mahkemeNo}.`;
                    }
                    
                    console.log(`Dosya ${dosyaId} için yedek bilgilerden mahkeme oluşturuldu: ${mahkeme}`);
                }
                
                // Dosya numarası bilgisini güncelle (varsa)
                if (foundDosya.esasNo && foundDosya.esasYil) {
                    davaNo = `${foundDosya.esasYil}/${foundDosya.esasNo}`;
                } else if (foundDosya.dosyaNo) {
                    davaNo = foundDosya.dosyaNo;
                }
            }
            // Eğer eşleştirme haritasında bulunamadıysa, eski yöntemi kullan (tüm yanıtları kontrol et)
            else if (dosyaId && this.allResponseData && this.allResponseData.length > 0) {
                // Tüm yanıtları kontrol et
                for (const responseItem of this.allResponseData) {
                    // Yanıt verisinde bu dosya var mı kontrol et
                    if (responseItem.response && Array.isArray(responseItem.response[0])) {
                        const foundDosya = responseItem.response[0].find(d => this.getDosyaId(d) === dosyaId);
                        if (foundDosya) {
                            // Tam mahkeme adını kullan (yeni eklenen birimAdiTam)
                            if (foundDosya.birimAdiTam) {
                                mahkeme = foundDosya.birimAdiTam;
                                console.log(`Dosya ${dosyaId} için yanıttan birimAdiTam kullanılıyor: ${mahkeme}`);
                            }
                            // Eğer birimAdiTam yoksa, diğer alanlara bak
                            else if (foundDosya.mahkemeAdi) {
                                mahkeme = foundDosya.mahkemeAdi;
                                console.log(`Dosya ${dosyaId} için yanıttan mahkemeAdi kullanılıyor: ${mahkeme}`);
                            }
                            else if (foundDosya.birimAdi) {
                                mahkeme = foundDosya.birimAdi;
                                console.log(`Dosya ${dosyaId} için yanıttan birimAdi kullanılıyor: ${mahkeme}`);
                            }
                            else {
                                // Hiçbir tam mahkeme adı yoksa, birimAdi ve mahkemeNo'yu birleştir
                                mahkeme = responseItem.birimAdi || "Belirtilmemiş";
                                
                                // Numara bilgisi varsa ekle
                                if (foundDosya.mahkemeNo) {
                                    mahkeme = `${mahkeme} ${foundDosya.mahkemeNo}.`;
                                }
                                
                                console.log(`Dosya ${dosyaId} için yanıttan birim adı oluşturuldu: ${mahkeme}`);
                            }
                            
                            // Dosya numarası bilgisini güncelle (varsa)
                            if (foundDosya.esasNo && foundDosya.esasYil) {
                                davaNo = `${foundDosya.esasYil}/${foundDosya.esasNo}`;
                            } else if (foundDosya.dosyaNo) {
                                davaNo = foundDosya.dosyaNo;
                            }
                            
                            break;
                        }
                    }
                }
            }
            
            const tarih = new Date().toLocaleDateString();
            
            // Müvekkil listesini oluştur
            const muvekkilListesi = tarafBilgileri
                .filter(taraf => taraf.vekil && taraf.vekil.includes(avukatAdSoyad))
                .map(taraf => {
                    return {
                        ad: taraf.adi,
                        tip: taraf.rol || "Müvekkil"
                    };
                });
            
            if (muvekkilListesi.length > 0) {
                // Dosya detayını sakla
                this.dosyaDetaylari.push({
                    davaNo,
                    mahkeme,
                    tarih,
                    muvekkilListesi
                });
            }
        } catch (error) {
            console.error('Dosya detayları işlenirken hata:', error);
        }
    }
    
    // Müvekkil bilgilerini Kullanıcı Bilgileri popup'ındaki "Müvekkiller" bölümüne ekle
    async saveMuvekkilBilgileriToAccount() {
        if (!this.dosyaDetaylari || this.dosyaDetaylari.length === 0) {
            console.warn('Kaydedilecek müvekkil bilgisi bulunamadı.');
            return;
        }
        
        try {
            console.log('Müvekkil bilgileri Account formatına dönüştürülüyor...');
            
            // Bu bilgileri chrome.storage.local'e kaydedelim ki Account sınıfı erişebilsin
            await new Promise((resolve) => {
                chrome.storage.local.set({ 'muvekkilVerileri': this.dosyaDetaylari }, () => {
                    console.log('Müvekkil bilgileri Account popup\'ı için kaydedildi.');
                    
                    // Müvekkil verilerinin güncellendiğini bildiren bir olay tetikle
                    // Account sınıfı bu olayı dinleyerek verileri yenileyecek
                    const event = new CustomEvent('muvekkilDataUpdated', {
                        detail: { muvekkilVerileri: this.dosyaDetaylari }
                    });
                    window.dispatchEvent(event);
                    
                    resolve();
                });
            });
        } catch (error) {
            console.error('Müvekkil bilgileri kaydedilirken hata:', error);
        }
    }

    // Avukat bilgilerini Kullanıcı Bilgileri popup'ındaki "Avukat Bilgileri" kısmına ekle
    async saveAvukatBilgileriToAccount() {
        if (!this.avukatBilgileri) {
            console.warn('Kaydedilecek avukat bilgisi bulunamadı.');
            return;
        }
        
        try {
            // Avukat bilgilerini Account sınıfının kullandığı formata dönüştür
            const avukatInfo = {
                name: `${this.avukatBilgileri.adi} ${this.avukatBilgileri.soyadi}`,
                bar: this.avukatBilgileri.baro || "Belirtilmemiş",
                id: this.avukatBilgileri.tcKimlikNo || "Belirtilmemiş",
                baroNo: this.avukatBilgileri.baroNo || "Belirtilmemiş", // Baro numarası
                tbbNo: this.avukatBilgileri.tbbNo || "Belirtilmemiş", // TBB numarası
                email: this.avukatBilgileri.email || "Belirtilmemiş",
                phone: this.avukatBilgileri.telefon || "Belirtilmemiş",
                address: this.avukatBilgileri.adres || "Belirtilmemiş"
            };
            
            console.log('Avukat bilgileri Account formatına dönüştürüldü:', avukatInfo);
            
            // Mevcut avukat listesini al
            chrome.storage.sync.get('lawyers', (data) => {
                const lawyers = data.lawyers || [];
                
                // Bu avukat zaten eklenmiş mi kontrol et
                const avukatVarMi = lawyers.some(lawyer => lawyer.id === avukatInfo.id);
                
                if (!avukatVarMi) {
                    // Yeni avukatı listeye ekle
                    lawyers.push(avukatInfo);
                    
                    // Güncellenmiş listeyi kaydet
                    chrome.storage.sync.set({ lawyers }, () => {
                        console.log('Avukat bilgileri Account popup\'ına kaydedildi.');
                    });
                } else {
                    // Varolan avukatı güncelle
                    const index = lawyers.findIndex(lawyer => lawyer.id === avukatInfo.id);
                    if (index !== -1) {
                        lawyers[index] = avukatInfo;
                        
                        // Güncellenmiş listeyi kaydet
                        chrome.storage.sync.set({ lawyers }, () => {
                            console.log('Avukat bilgileri Account popup\'ında güncellendi.');
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Avukat bilgileri kaydedilirken hata:', error);
        }
    }

    // Dosya ID'sini bul - farklı API yanıtları farklı alanlarda ID bilgisi döndürebilir
    getDosyaId(dosya) {
        if (!dosya) return null;
        
        // Olası ID alanlarını kontrol et
        if (dosya.id) return dosya.id;
        if (dosya.dosyaId) return dosya.dosyaId;
        if (dosya.derdestDosyaId) return dosya.derdestDosyaId;
        if (dosya.derdestDosya && dosya.derdestDosya.id) return dosya.derdestDosya.id;
        
        // Dosya nesnesi için bir ID bulunamadı
        console.error('Dosya için ID bulunamadı:', dosya);
        return null;
    }
    
    // Dosya taraf bilgilerini al
    async getDosyaTarafBilgileri(dosyaId) {
        try {
            console.log(`Dosya taraf bilgileri isteği gönderiliyor - ID: ${dosyaId}`);
            
            // Dosya ID'si için istek gövdesi oluştur
            // API isteğinin doğru formatını kullan
            const requestBody = JSON.stringify({
                dosyaId: {dosyaId}
            });
            
            console.log('İstek gövdesi:', requestBody);
            
            const response = await fetch('https://avukatbeta.uyap.gov.tr/dosya_taraf_bilgileri_brd.ajx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: requestBody,
                credentials: 'include'
            });
            
            console.log(`Dosya taraf bilgileri yanıtı (${dosyaId}):`, response.status, response.statusText);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`Dosya taraf bilgileri alındı (${dosyaId}):`, data);
                return data;
            } else {
                console.error(`Dosya taraf bilgileri alınırken hata (${dosyaId}):`, response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error(`Dosya taraf bilgileri alınırken istek hatası (${dosyaId}):`, error);
            return null;
        }
    }
    
    // Taraf bilgilerini işle ve müvekkil/karşı taraf listelerini güncelle
    processTarafBilgileri(tarafBilgileri, avukatAdSoyad) {
        if (!Array.isArray(tarafBilgileri)) return;
        
        console.log(`Taraf bilgileri işleniyor - Toplam ${tarafBilgileri.length} taraf`);
        
        tarafBilgileri.forEach(taraf => {
            // Tarafın vekilinde avukatın adı geçiyorsa bu bir müvekkil
            if (taraf.vekil && taraf.vekil.includes(avukatAdSoyad)) {
                // Müvekkil listesine ekle
                this.muvekkilListesi.add(taraf.adi);
                console.log(`Müvekkil bulundu: ${taraf.adi}`);
            } else {
                // Karşı taraf listesine ekle
                this.karsiTarafListesi.add(taraf.adi);
                console.log(`Karşı taraf bulundu: ${taraf.adi}`);
            }
        });
    }

    // Avukat bilgilerini al
    async getAvukatBilgileri() {
        try {
            const response = await fetch('https://avukatbeta.uyap.gov.tr/avukatKisiselBilgileriSorgula.ajx', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const responseData = await response.json();
                // Yanıt bir dizi şeklinde geliyor, ilk eleman avukat bilgilerini içeriyor
                if (Array.isArray(responseData) && responseData.length > 0) {
                    const avukatData = responseData[0];
                    
                    // Avukat bilgilerini dönüştürüp saklayalım
                    this.avukatBilgileri = {
                        adi: avukatData.ad || '',
                        soyadi: avukatData.soyad || '',
                        tcKimlikNo: avukatData.tcKimlikNo || '',
                        baro: avukatData.bagliOlduguBaroAdi || '',
                        baroNo: avukatData.baroNo || '',
                        tbbNo: avukatData.tbbNo || '',
                        email: '', // API'de bulunmuyor, boş bırakılacak
                        telefon: '', // API'de bulunmuyor, boş bırakılacak
                        adres: '' // API'de bulunmuyor, boş bırakılacak
                    };
                    
                    console.log('Avukat bilgileri alındı:', this.avukatBilgileri);
                    return this.avukatBilgileri;
                } else {
                    console.error('Avukat bilgileri yanıtı beklenmeyen formatta:', responseData);
                    return null;
                }
            } else {
                console.error('Avukat bilgileri alınırken hata:', response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Avukat bilgileri alınırken istek hatası:', error);
            return null;
        }
    }
}

export default SynchronizationManager; 