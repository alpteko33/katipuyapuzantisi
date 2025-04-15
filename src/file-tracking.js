// UYAP popup'larına Dosya Takip butonu ekleyen fonksiyon
function addFileTrackingButton() {
    // Popup başlık çubuğundaki buton container'ını bul
    const buttonContainer = document.querySelector('.dx-popup-title .ms-auto');
    
    if (buttonContainer && !document.querySelector('.file-tracking-btn')) {
        // Tam Ekran butonunu daha spesifik bir seçici ile bul
        const fullScreenBtn = buttonContainer.querySelector('.dx-button-has-text i.icon-maximize')?.closest('.dx-button');
        
        if (fullScreenBtn) {
            console.log('UYAP Asistan: Dosya Takip - Tam Ekran butonu bulundu');
            
            // Hızlı Dilekçe butonunu kontrol et
            const quickPetitionBtn = buttonContainer.querySelector('.quick-petition-btn');
            
            // Dosya Takip butonunu oluştur
            const fileTrackingBtn = document.createElement('div');
            fileTrackingBtn.className = 'dx-widget dx-button dx-button-mode-outlined dx-button-normal dx-button-has-text dx-button-has-icon me-2 file-tracking-btn';
            fileTrackingBtn.setAttribute('role', 'button');
            fileTrackingBtn.setAttribute('aria-label', 'Dosya Takip');
            fileTrackingBtn.setAttribute('tabindex', '0');
            
            // Buton içeriğini oluştur
            fileTrackingBtn.innerHTML = `
                <div class="dx-button-content">
                    <i class="dx-icon fe icon-folder"></i>
                    <span class="dx-button-text">Dosya Takip</span>
                </div>
            `;
            
            // Butonu uygun konuma ekle (Hızlı Dilekçe varsa önüne, yoksa Tam Ekran butonunun önüne)
            if (quickPetitionBtn) {
                console.log('UYAP Asistan: Dosya Takip - Hızlı Dilekçe butonu bulundu, önüne ekleniyor');
                quickPetitionBtn.parentNode.insertBefore(fileTrackingBtn, quickPetitionBtn);
            } else {
                console.log('UYAP Asistan: Dosya Takip - Hızlı Dilekçe butonu bulunamadı, Tam Ekran butonu önüne ekleniyor');
                fullScreenBtn.parentNode.insertBefore(fileTrackingBtn, fullScreenBtn);
            }
            
            // Buton tıklama olayını ekle
            fileTrackingBtn.addEventListener('click', function() {
                // Dosya Takip butonuna tıklandığında yapılacak işlemler
                console.log('Dosya Takip butonu tıklandı');
                
                // Dosya bilgilerini al
                const fileInfo = getFileInfo();
                
                // Dosya ID'yi localStorage'dan al (temp_functions.js tarafından kaydedilen)
                const dosyaId = localStorage.getItem('uyap_asistan_dosya_id');
                
                if (dosyaId) {
                    console.log('UYAP Asistan: Dosya Takip - Dosya ID bulundu:', dosyaId);
                    
                    // API isteklerini yapabiliriz
                    if (window.makeUYAPApiRequest) {
                        // Dosya detaylarını ve işlem türlerini al
                        window.makeUYAPApiRequest('dosyaAyrintiBilgileri_brd.ajx', { dosyaId })
                            .then(response => {
                                if (response) {
                                    console.log('UYAP Asistan: Dosya Takip - Dosya detayları:', response);
                                    localStorage.setItem('uyap_asistan_dosya_detaylari', JSON.stringify(response));
                                }
                            });
                        
                        window.makeUYAPApiRequest('dosya_islem_turleri_sorgula_brd.ajx', { dosyaId })
                            .then(response => {
                                if (response) {
                                    console.log('UYAP Asistan: Dosya Takip - Dosya işlem türleri:', response);
                                    localStorage.setItem('uyap_asistan_dosya_islem_turleri', JSON.stringify(response));
                                }
                            });
                        
                        // Dosya evraklarını al - artık kendi fonksiyonumuzu kullanıyoruz
                        getUYAPDocumentList()
                            .then(response => {
                                if (response && response.status === 200) {
                                    console.log('UYAP Asistan: Dosya Takip - Evrak listesi alındı');
                                } else {
                                    console.log('UYAP Asistan: Dosya Takip - Evrak listesi alınamadı');
                                }
                            })
                            .catch(error => {
                                console.error('UYAP Asistan: Dosya Takip - Evrak listesi alınırken hata:', error);
                            });
                    }
                } else {
                    console.log('UYAP Asistan: Dosya Takip - Dosya ID bulunamadı');
                }
                
                // Dosya takip popup'ını göster
                showFileTrackingPopup(fileInfo, dosyaId);
            });
            
            console.log('UYAP Asistan: Dosya Takip butonu eklendi');
        } else {
            console.log('UYAP Asistan: Dosya Takip - Tam Ekran butonu bulunamadı');
        }
    }
}

// Açık dosya bilgilerini al
function getFileInfo() {
    const popupTitle = document.querySelector('.dx-popup-title h4');
    let fileInfo = '';
    
    if (popupTitle) {
        fileInfo = popupTitle.textContent.trim();
    }
    
    return fileInfo;
}

// Dosya takip veritabanı yönetimi için yardımcı fonksiyonlar
const FileTrackingDB = {
    // Veritabanı adı
    dbName: 'katip_file_tracking',
    
    // Tüm dosya verilerini al
    getAllFiles() {
        const db = localStorage.getItem(this.dbName);
        return db ? JSON.parse(db) : { files: {} };
    },
    
    // Belirli bir dosyanın verilerini al
    getFile(fileId) {
        const db = this.getAllFiles();
        return db.files[fileId] || this.createEmptyFileData();
    },
    
    // Belirli bir dosyanın verilerini kaydet
    saveFile(fileId, fileData) {
        const db = this.getAllFiles();
        db.files[fileId] = fileData;
        localStorage.setItem(this.dbName, JSON.stringify(db));
    },
    
    // Yeni boş dosya verisi oluştur
    createEmptyFileData() {
        return {
            notes: [],
            schema: {
                mainStage: 'dilekce',
                subStage: 'dava_dilekcesi',
                currentDescription: 'Dava dilekçesi verilmiş olup, davalının cevap dilekçesi beklenmektedir.'
            }
            // Diğer tab'lar için alanlar gerektiğinde eklenecek
        };
    },
    
    // Dosya ID'si oluştur (temizlenmiş dosya adı)
    createFileId(fileInfo) {
        // Dosya adını benzersiz ID'ye dönüştür
        return fileInfo.trim().replace(/[^a-zA-Z0-9]/g, '_');
    }
};

// Dosya takip popup'ını göster
function showFileTrackingPopup(fileInfo, dosyaId, isReload = false) {
    // Popup zaten açıksa ve yeniden yükleme değilse bir şey yapma
    if (document.getElementById('file-tracking-overlay') && !isReload) {
        console.log('UYAP Asistan: Popup zaten açık');
        return;
    }
    
    // Önceki popup varsa kaldır
    const existingPopup = document.getElementById('file-tracking-overlay');
    if (existingPopup) {
        document.body.removeChild(existingPopup);
    }
    
    // Dosya ID'si bulunamadıysa, fileInfo'dan oluştur
    if (!dosyaId) {
        // Dosya ID'si oluştur (temizlenmiş dosya adı)
        dosyaId = FileTrackingDB.createFileId(fileInfo);
    }
    
    console.log('Dosya ID:', dosyaId);
    
    // Önbellek kontrolü - mevcut dosya ID'si önceki ile aynı mı?
    const previousDosyaId = localStorage.getItem('uyap_asistan_current_dosya_id');
    
    // Eğer yeni bir dosyaya geçiş yapıldıysa, localStorage'ı temizleme ihtiyacını belirle
    if (previousDosyaId && previousDosyaId !== dosyaId) {
        console.log('UYAP Asistan: Farklı bir dosyaya geçildi, evrak listesi güncelleniyor...');
        
        // Sadece dosya değişiminde evrak listesindeki önbelleği temizle
        localStorage.removeItem('uyap_asistan_evrak_listesi_zaman');
    }
    
    // Şu anki dosya ID'sini sakla
    localStorage.setItem('uyap_asistan_current_dosya_id', dosyaId);
    
    // Dosya başlık bilgisini sakla (dosya türünü belirlemek için kullanılacak)
    if (fileInfo) {
        localStorage.setItem('uyap_asistan_dosya_title', fileInfo);
        
        // Dosya türünü belirle
        let dosyaTuru = 'hukuk'; // Varsayılan olarak hukuk davası
        if (fileInfo.toLowerCase().includes('ceza')) {
            dosyaTuru = 'ceza';
        } else if (fileInfo.toLowerCase().includes('icra')) {
            dosyaTuru = 'icra';
        }
        localStorage.setItem('uyap_asistan_dosya_turu', dosyaTuru);
    }
    
    // Dosya verilerini yükle
    const fileData = FileTrackingDB.getFile(dosyaId);
    console.log('Dosya verileri yüklendi:', fileData);
    
    // Popup overlay
    const overlay = document.createElement('div');
    overlay.id = 'file-tracking-overlay';
    overlay.className = 'file-tracking-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999999;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px);
    `;
    
    // Popup container
    const popup = document.createElement('div');
    popup.className = 'file-tracking-popup';
    popup.style.cssText = `
        background-color: #fff;
        width: 95%;
        max-width: 1200px;
        height: 85vh;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        filter: none !important;
        pointer-events: auto !important;
    `;
    
    // Popup header
    const header = document.createElement('div');
    header.className = 'file-tracking-header';
    header.style.cssText = `
        background-color: #fff;
        border-bottom: 1px solid #e0e0e0;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    // Dosya bilgisi
    const title = document.createElement('h2');
    title.style.cssText = `
        margin: 0;
        font-size: 1.5em;
        color: #2c3e50;
    `;
    title.textContent = fileInfo;
    
    // Dosya ID bilgisi ekle
    const idInfo = document.createElement('span');
    idInfo.style.cssText = `
        font-size: 0.8em;
        color: #7f8c8d;
        margin-left: 10px;
        display: none; /* ID bilgisini gizle */
    `;
    idInfo.textContent = `(ID: ${dosyaId})`;
    title.appendChild(idInfo);
    
    // Header sağ kısım (kontroller)
    const controls = document.createElement('div');
    controls.className = 'file-tracking-controls';
    controls.style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
    `;
    
    // API İşlemleri butonunu kaldırdık
    
    // Kapatma butonu
    const closeBtn = document.createElement('div');
    closeBtn.className = 'file-tracking-close';
    closeBtn.style.cssText = `
        cursor: pointer;
        font-size: 1.2em;
        opacity: 0.8;
        transition: opacity 0.3s;
        color: #2c3e50;
    `;
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // Hover efekti
    closeBtn.addEventListener('mouseover', function() {
        this.style.opacity = '1';
    });
    closeBtn.addEventListener('mouseout', function() {
        this.style.opacity = '0.8';
    });
    
    // ESC ile kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.parentNode) {
            document.body.removeChild(overlay);
        }
    });
    
    // Dışarı tıklama ile kapatma
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    // API butonunu ve kapatma butonunu kontrollere ekle
    // API butonunu kaldırdık
    controls.appendChild(closeBtn);
    
    // Header'a başlık ve kontrolleri ekle
    header.appendChild(title);
    header.appendChild(controls);
    
    // Popup içeriği
    const content = document.createElement('div');
    content.className = 'file-tracking-content';
    content.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `;
    
    // TabPanel Sistemi
    const tabPanel = document.createElement('div');
    tabPanel.className = 'file-tracking-tabpanel';
    tabPanel.style.cssText = `
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    `;
    
    // Tab Başlıkları
    const tabHeaders = document.createElement('div');
    tabHeaders.className = 'file-tracking-tab-headers';
    tabHeaders.style.cssText = `
        display: flex;
        border-bottom: 1px solid #e0e0e0;
        background-color: #f8f9fa;
    `;
    
    // Tab içerikleri
    const tabContents = document.createElement('div');
    tabContents.className = 'file-tracking-tab-contents';
    tabContents.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        position: relative;
    `;
    
    // Tab'ları oluştur
    const tabs = [
        { id: 'schema', title: 'Şema Görünümü', active: true },
        { id: 'notes', title: 'Dava Dosyası Notları', active: false },
        { id: 'financial', title: 'Mali Bilgiler', active: false },
        { id: 'folder', title: 'Klasör Sistemi', active: false },
        { id: 'scan', title: 'Otomatik Tarama Sistemi', active: false }
    ];
    
    tabs.forEach(tab => {
        // Tab başlığı
        const tabHeader = document.createElement('div');
        tabHeader.className = `file-tracking-tab-header ${tab.active ? 'active' : ''}`;
        tabHeader.setAttribute('data-tab', tab.id);
        tabHeader.style.cssText = `
            padding: 15px 20px;
            cursor: pointer;
            font-weight: ${tab.active ? 'bold' : 'normal'};
            color: ${tab.active ? '#24377F' : '#555'};
            border-bottom: ${tab.active ? '3px solid #24377F' : '3px solid transparent'};
            transition: all 0.3s;
        `;
        tabHeader.textContent = tab.title;
        
        // Tab içeriği
        const tabContent = document.createElement('div');
        tabContent.className = `file-tracking-tab-content ${tab.active ? 'active' : ''}`;
        tabContent.setAttribute('data-tab', tab.id);
        tabContent.style.cssText = `
            display: ${tab.active ? 'block' : 'none'};
            height: 100%;
        `;
        
        // Tab'a tıklama olayı
        tabHeader.addEventListener('click', () => {
            // Tüm tab başlıklarını ve içeriklerini deaktive et
            document.querySelectorAll('.file-tracking-tab-header').forEach(header => {
                header.classList.remove('active');
                header.style.fontWeight = 'normal';
                header.style.color = '#555';
                header.style.borderBottom = '3px solid transparent';
            });
            
            document.querySelectorAll('.file-tracking-tab-content').forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Seçilen tab'ı aktifleştir
            tabHeader.classList.add('active');
            tabHeader.style.fontWeight = 'bold';
            tabHeader.style.color = '#24377F';
            tabHeader.style.borderBottom = '3px solid #24377F';
            
            tabContent.classList.add('active');
            tabContent.style.display = 'block';
        });
        
        // Tab içeriklerini doldur
        if (tab.id === 'schema') {
            tabContent.appendChild(createSchemaView(fileInfo, fileData.schema));
        } else if (tab.id === 'notes') {
            tabContent.appendChild(createNotesView(fileInfo, fileData.notes));
        } else {
            // Diğer tablar şimdilik boş
            const emptyTab = document.createElement('div');
            emptyTab.style.cssText = `
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
            color: #777;
            font-style: italic;
        `;
            emptyTab.textContent = 'Bu özellik daha sonra eklenecektir.';
            tabContent.appendChild(emptyTab);
        }
        
        // Otomatik Tarama Sistemi tabına özel içerik
        if (tab.id === 'scan') {
            // Mevcut içeriği temizle
            tabContent.innerHTML = '';
            
            // Otomatik Tarama Sistemi container
            const scanContainer = document.createElement('div');
            scanContainer.className = 'file-tracking-scan-container';
            scanContainer.style.cssText = `
                margin: 20px 0;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 5px;
                border: 1px solid #e0e0e0;
            `;
            
            // Tarih filtreleme bölümü
            const dateFilterContainer = document.createElement('div');
            dateFilterContainer.className = 'date-filter-container mb-3';
            dateFilterContainer.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;
                justify-content: center;
            `;
            
            // Varsayılan tarih aralığını hesapla (son 2 ay)
            const today = new Date();
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(today.getMonth() - 2);
            
            const formatDateForInput = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            
            // Başlangıç tarihi etiketi ve input
            const startDateLabel = document.createElement('label');
            startDateLabel.textContent = 'Başlangıç Tarihi:';
            startDateLabel.htmlFor = 'tebligat-start-date';
            startDateLabel.style.cssText = `
                font-weight: 500;
                margin-right: 5px;
            `;
            
            const startDateInput = document.createElement('input');
            startDateInput.type = 'date';
            startDateInput.id = 'tebligat-start-date';
            startDateInput.className = 'form-control';
            startDateInput.value = formatDateForInput(twoMonthsAgo);
            startDateInput.style.cssText = `
                width: auto;
            `;
            
            // Bitiş tarihi etiketi ve input
            const endDateLabel = document.createElement('label');
            endDateLabel.textContent = 'Bitiş Tarihi:';
            endDateLabel.htmlFor = 'tebligat-end-date';
            endDateLabel.style.cssText = `
                font-weight: 500;
                margin-right: 5px;
                margin-left: 10px;
            `;
            
            const endDateInput = document.createElement('input');
            endDateInput.type = 'date';
            endDateInput.id = 'tebligat-end-date';
            endDateInput.className = 'form-control';
            endDateInput.value = formatDateForInput(today);
            endDateInput.style.cssText = `
                width: auto;
            `;
            
            // Tarih filtreleme bileşenlerini container'a ekle
            dateFilterContainer.appendChild(startDateLabel);
            dateFilterContainer.appendChild(startDateInput);
            dateFilterContainer.appendChild(endDateLabel);
            dateFilterContainer.appendChild(endDateInput);
            
            // Tebligat Sorgulama butonu
            const tebligatBtn = document.createElement('button');
            tebligatBtn.className = 'dx-button dx-button-mode-contained dx-button-normal';
            tebligatBtn.style.cssText = `
                background-color: #24377F;
                color: white;
                padding: 12px 20px;
                border: none;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                margin-top: 10px;
                width: 80%;
                max-width: 300px;
                transition: background-color 0.3s;
                margin-left: auto;
                margin-right: auto;
                display: block;
            `;
            tebligatBtn.textContent = 'Tebligat Sorgulama';
            
            // Hover efekti
            tebligatBtn.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#1a2a5e';
            });
            tebligatBtn.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#24377F';
            });
            
            // İlerleme göstergesi div'i oluştur
            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container mt-3';
            progressContainer.style.cssText = `
                display: none;
                width: 80%;
                max-width: 300px;
                margin-left: auto;
                margin-right: auto;
            `;
            
            const progressBar = document.createElement('div');
            progressBar.className = 'progress';
            progressBar.style.cssText = `
                height: 20px;
                background-color: #e0e0e0;
                border-radius: 5px;
                overflow: hidden;
            `;
            
            const progressInner = document.createElement('div');
            progressInner.className = 'progress-bar';
            progressInner.style.cssText = `
                height: 100%;
                background-color: #24377F;
                width: 0%;
                transition: width 0.3s;
                text-align: center;
                line-height: 20px;
                color: white;
                font-weight: bold;
            `;
            progressInner.textContent = '0%';
            
            progressBar.appendChild(progressInner);
            progressContainer.appendChild(progressBar);
            
            // Tebligat Sorgulama butonuna tıklama olayı
            tebligatBtn.addEventListener('click', async function() {
                // Önce listeyi temizle
                window.latestTebligatSonuclari = [];
                window.tebligatSonuclari = [];
                
                // İlerleme göstergesini görünür yap
                progressContainer.style.display = 'block';
                
                // Seçili tarih aralığını al
                const startDate = new Date(document.getElementById('tebligat-start-date').value);
                const endDate = new Date(document.getElementById('tebligat-end-date').value);
                
                // Tarihleri kontrol et
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    alert('Lütfen geçerli bir tarih aralığı seçin.');
                    progressContainer.style.display = 'none';
                    return;
                }
                
                if (startDate > endDate) {
                    alert('Başlangıç tarihi bitiş tarihinden sonra olamaz.');
                    progressContainer.style.display = 'none';
                    return;
                }
                
                // Maksimum 3 aylık aralık kontrolü
                const threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000; // yaklaşık 3 ay
                if (endDate - startDate > threeMonthsInMs) {
                    alert('En fazla 3 aylık bir aralık seçebilirsiniz.');
                    progressContainer.style.display = 'none';
                    return;
                }
                
                // Güncel dosyaId'yi al
                const dosyaId = localStorage.getItem('uyap_asistan_current_dosya_id') || localStorage.getItem('uyap_asistan_dosya_id');
                
                if (!dosyaId) {
                    console.error('UYAP Asistan: Dosya ID bulunamadı! Lütfen sayfayı yenileyip tekrar deneyin.');
                    progressContainer.style.display = 'none';
                    return;
                }
                
                // Buton durumunu güncelle
                tebligatBtn.disabled = true;
                tebligatBtn.textContent = 'Sorgulanıyor...';
                tebligatBtn.style.backgroundColor = '#95a5a6';
                
                try {
                    // İlerleme göstergesini başlat
                    let progress = 10;
                    progressInner.style.width = progress + '%';
                    progressInner.textContent = progress + '%';
                    
                    // Tebligat sorgulaması yap
                    const response = await fetch('https://avukatbeta.uyap.gov.tr/list_dosya_evraklar.ajx', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            dosyaId: dosyaId
                        }),
                        credentials: 'include' // Include cookies for authentication
                    });
                    
                    // İlerlemeyi güncelle
                    progress = 60;
                    progressInner.style.width = progress + '%';
                    progressInner.textContent = progress + '%';
                    
                    const data = await response.json();
                    
                    // İlerlemeyi güncelle
                    progress = 100;
                    progressInner.style.width = progress + '%';
                    progressInner.textContent = progress + '%';
                    
                    if (data && data.status === 200) {
                        // Sonuç başarılı
                        console.log('UYAP Asistan: Tebligat sorgulaması sonuçları:', data);
                        
                        // Kapalı Tebligat türünde olan evrakları filtrele
                        const kapaliTebligatlar = [];
                        
                        // tumEvraklar içindeki her dosya için döngü
                        if (data.tumEvraklar) {
                            for (const dosyaKey in data.tumEvraklar) {
                                const evraklar = data.tumEvraklar[dosyaKey];
                                
                                // Her evrakı kontrol et
                                evraklar.forEach(evrak => {
                                    if (evrak.tur === 'Kapalı Tebligat') {
                                        // Tarih filtreleme - onaylandigiTarih'e göre
                                        if (evrak.onaylandigiTarih) {
                                            // UYAP'tan gelen tarih formatını konsola yazdır
                                            console.log(`Evrak tarihi ham hali: ${evrak.onaylandigiTarih} (ID: ${evrak.evrakId})`);
                                            
                                            // UYAP'tan gelen tarihi normalize et (sadece gün/ay/yıl dikkate alınsın)
                                            let evrakDate;
                                            
                                            // UYAP'tan gelen tarih formatları farklı olabilir, kontrol et ve düzgün parse et
                                            if (evrak.onaylandigiTarih.includes('.')) {
                                                // GG.AA.YYYY formatı (örneğin 15.02.2025)
                                                const [day, month, year] = evrak.onaylandigiTarih.split('.').map(Number);
                                                evrakDate = new Date(year, month - 1, day);
                                            } else if (evrak.onaylandigiTarih.includes('-')) {
                                                // YYYY-AA-GG formatı (örneğin 2025-02-15)
                                                const [year, month, day] = evrak.onaylandigiTarih.split('-').map(Number);
                                                evrakDate = new Date(year, month - 1, day);
                                            } else if (evrak.onaylandigiTarih.includes('/')) {
                                                // GG/AA/YYYY formatı (örneğin 15/02/2025)
                                                const [day, month, year] = evrak.onaylandigiTarih.split('/').map(Number);
                                                evrakDate = new Date(year, month - 1, day);
                                            } else {
                                                // Normal Date constructor ile dene
                                                evrakDate = new Date(evrak.onaylandigiTarih);
                                            }
                                            
                                            // Zaman kısmını sıfırla (sadece gün/ay/yıl karşılaştırması yapalım)
                                            const normalizedEvrakDate = new Date(evrakDate.getFullYear(), evrakDate.getMonth(), evrakDate.getDate());
                                            
                                            // Inputlardan alınan tarihleri de normalize et
                                            const normalizedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                                            const normalizedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                                            
                                            // Bütün tarihleri ekrana yazdır (debug için)
                                            console.log(`Evrak için: ${normalizedEvrakDate.toLocaleDateString()} <= ${normalizedEvrakDate.toISOString()}`);
                                            console.log(`Filtre: ${normalizedStartDate.toLocaleDateString()} - ${normalizedEndDate.toLocaleDateString()}`);
                                            
                                            // Normalize edilmiş tarihlerle karşılaştır
                                            if (normalizedEvrakDate >= normalizedStartDate && normalizedEvrakDate <= normalizedEndDate) {
                                                // Bu blok içinde tarih filtresi koşulunu karşılayan evraklar işleniyor
                                                console.log(`✅ Evrak filtre içinde: ${evrak.evrakId} - ${normalizedEvrakDate.toLocaleDateString()}`);
                                                
                                                // Elektronik tebligat kontrolü ve diğer işlemler...
                                                // ... existing evrak işleme kodu ...
                                                
                                                // Elektronik tebligat kontrolü
                                                let isElektronikTebligat = false;
                                                
                                                // Aciklama alanı varsa, elektronik tebligat içerip içermediğini kontrol et
                                                if (evrak.aciklama) {
                                                    const aciklamaLower = evrak.aciklama.toLowerCase();
                                                    if (aciklamaLower.includes("elektronik tebligat") || 
                                                        aciklamaLower.includes("e-tebligat") || 
                                                        aciklamaLower.includes("ulak") || 
                                                        aciklamaLower.includes("elektronik tebliğ") ||
                                                        aciklamaLower.includes("uets")) {
                                                        
                                                        isElektronikTebligat = true;
                                                        
                                                        // Elektronik tebligat olduğunu konsola yazdır
                                                        console.log('***********************');
                                                        console.log('Elektronik Tebligat Tespit Edildi');
                                                        console.log('Evrak ID:', evrak.evrakId);
                                                        console.log('Açıklama:', evrak.aciklama);
                                                        console.log('Tarih:', evrak.sistemeGonderildigiTarih);
                                                        console.log('Gönderen:', evrak.gonderenYerKisi);
                                                        console.log('***********************');
                                                    }
                                                }
                                                
                                                // Alıcı bilgisi için güvenli şekilde regex
                                                let aliciBilgisi = '';
                                                if (evrak.aciklama) {
                                                    const aliciMatch = evrak.aciklama.match(/\[(.*?)\]/);
                                                    if (aliciMatch && aliciMatch[1]) {
                                                        aliciBilgisi = aliciMatch[1];
                                                    }
                                                }
                                                
                                                // Eklenecek evrak bilgilerini hazırla
                                                kapaliTebligatlar.push({
                                                    evrakId: evrak.evrakId,
                                                    dosyaId: evrak.dosyaId,
                                                    tur: evrak.tur,
                                                    tarih: evrak.sistemeGonderildigiTarih,
                                                    gonderenKisi: evrak.gonderenYerKisi,
                                                    isElektronikTebligat: isElektronikTebligat,
                                                    dosyaNoIs: evrak.gonderenDosyaNo,
                                                    aliciBilgisiIs: aliciBilgisi,
                                                    onaylananTarih: evrak.onaylandigiTarih || ''
                                                });
                                            } else {
                                                console.log(`UYAP Asistan: Tarih filtresi dışında kalan evrak (${evrak.evrakId}): ${evrak.onaylandigiTarih}`);
                                            }
                                        } else {
                                            console.log(`UYAP Asistan: Onaylanma tarihi olmayan evrak (${evrak.evrakId})`);
                                            // Onaylanma tarihi olmayan evrakları da dahil et
                                            // ... existing evrak işleme kodu ...
                                            
                                            // Elektronik tebligat kontrolü
                                            let isElektronikTebligat = false;
                                            
                                            // Aciklama alanı varsa, elektronik tebligat içerip içermediğini kontrol et
                                            if (evrak.aciklama) {
                                                const aciklamaLower = evrak.aciklama.toLowerCase();
                                                if (aciklamaLower.includes("elektronik tebligat") || 
                                                    aciklamaLower.includes("e-tebligat") || 
                                                    aciklamaLower.includes("ulak") || 
                                                    aciklamaLower.includes("elektronik tebliğ") ||
                                                    aciklamaLower.includes("uets")) {
                                                    
                                                    isElektronikTebligat = true;
                                                    
                                                    // Elektronik tebligat olduğunu konsola yazdır
                                                    console.log('***********************');
                                                    console.log('Elektronik Tebligat Tespit Edildi');
                                                    console.log('Evrak ID:', evrak.evrakId);
                                                    console.log('Açıklama:', evrak.aciklama);
                                                    console.log('Tarih:', evrak.sistemeGonderildigiTarih);
                                                    console.log('Gönderen:', evrak.gonderenYerKisi);
                                                    console.log('***********************');
                                                }
                                            }
                                            
                                            // Alıcı bilgisi için güvenli şekilde regex
                                            let aliciBilgisi = '';
                                            if (evrak.aciklama) {
                                                const aliciMatch = evrak.aciklama.match(/\[(.*?)\]/);
                                                if (aliciMatch && aliciMatch[1]) {
                                                    aliciBilgisi = aliciMatch[1];
                                                }
                                            }
                                            
                                            // Eklenecek evrak bilgilerini hazırla
                                            kapaliTebligatlar.push({
                                                evrakId: evrak.evrakId,
                                                dosyaId: evrak.dosyaId,
                                                tur: evrak.tur,
                                                tarih: evrak.sistemeGonderildigiTarih,
                                                gonderenKisi: evrak.gonderenYerKisi,
                                                isElektronikTebligat: isElektronikTebligat,
                                                dosyaNoIs: evrak.gonderenDosyaNo,
                                                aliciBilgisiIs: aliciBilgisi,
                                                onaylananTarih: evrak.onaylandigiTarih || ''
                                            });
                                        }
                                    }
                                });
                            }
                        }
                        
                        // son20Evrak içindeki evrakları da kontrol et
                        if (data.son20Evrak) {
                            data.son20Evrak.forEach(evrak => {
                                if (evrak.tur === 'Kapalı Tebligat') {
                                    // Eğer bu evrak zaten listeye eklenmemişse ekle
                                    const varMi = kapaliTebligatlar.some(item => item.evrakId === evrak.evrakId);
                                    if (!varMi) {
                                        // Tarih filtreleme - onaylandigiTarih'e göre
                                        if (evrak.onaylandigiTarih) {
                                            // UYAP'tan gelen tarih formatını konsola yazdır
                                            console.log(`Son20 Evrak tarihi ham hali: ${evrak.onaylandigiTarih} (ID: ${evrak.evrakId})`);
                                            
                                            // UYAP'tan gelen tarihi normalize et (sadece gün/ay/yıl dikkate alınsın)
                                            let evrakDate;
                                            
                                            // UYAP'tan gelen tarih formatları farklı olabilir, kontrol et ve düzgün parse et
                                            if (evrak.onaylandigiTarih.includes('.')) {
                                                // GG.AA.YYYY formatı (örneğin 15.02.2025)
                                                const [day, month, year] = evrak.onaylandigiTarih.split('.').map(Number);
                                                evrakDate = new Date(year, month - 1, day);
                                            } else if (evrak.onaylandigiTarih.includes('-')) {
                                                // YYYY-AA-GG formatı (örneğin 2025-02-15)
                                                const [year, month, day] = evrak.onaylandigiTarih.split('-').map(Number);
                                                evrakDate = new Date(year, month - 1, day);
                                            } else if (evrak.onaylandigiTarih.includes('/')) {
                                                // GG/AA/YYYY formatı (örneğin 15/02/2025)
                                                const [day, month, year] = evrak.onaylandigiTarih.split('/').map(Number);
                                                evrakDate = new Date(year, month - 1, day);
                                            } else {
                                                // Normal Date constructor ile dene
                                                evrakDate = new Date(evrak.onaylandigiTarih);
                                            }
                                            
                                            // Zaman kısmını sıfırla (sadece gün/ay/yıl karşılaştırması yapalım)
                                            const normalizedEvrakDate = new Date(evrakDate.getFullYear(), evrakDate.getMonth(), evrakDate.getDate());
                                            
                                            // Inputlardan alınan tarihleri de normalize et
                                            const normalizedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                                            const normalizedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                                            
                                            // Bütün tarihleri ekrana yazdır (debug için)
                                            console.log(`Son20 Evrak için: ${normalizedEvrakDate.toLocaleDateString()} <= ${normalizedEvrakDate.toISOString()}`);
                                            
                                            // Normalize edilmiş tarihlerle karşılaştır
                                            if (normalizedEvrakDate >= normalizedStartDate && normalizedEvrakDate <= normalizedEndDate) {
                                                // Bu blok içinde tarih filtresi koşulunu karşılayan evraklar işleniyor
                                                console.log(`✅ Son20 Evrak filtre içinde: ${evrak.evrakId} - ${normalizedEvrakDate.toLocaleDateString()}`);
                                                
                                                // Elektronik tebligat kontrolü ve diğer işlemler...
                                                // ... existing evrak işleme kodu ...
                                                
                                                // Elektronik tebligat kontrolü
                                                let isElektronikTebligat = false;
                                                
                                                // Aciklama alanı varsa, elektronik tebligat içerip içermediğini kontrol et
                                                if (evrak.aciklama) {
                                                    const aciklamaLower = evrak.aciklama.toLowerCase();
                                                    if (aciklamaLower.includes("elektronik tebligat") || 
                                                        aciklamaLower.includes("e-tebligat") || 
                                                        aciklamaLower.includes("ulak") || 
                                                        aciklamaLower.includes("elektronik tebliğ") ||
                                                        aciklamaLower.includes("uets")) {
                                                        
                                                        isElektronikTebligat = true;
                                                        
                                                        // Elektronik tebligat olduğunu konsola yazdır
                                                        console.log('***********************');
                                                        console.log('Elektronik Tebligat Tespit Edildi');
                                                        console.log('Evrak ID:', evrak.evrakId);
                                                        console.log('Açıklama:', evrak.aciklama);
                                                        console.log('Tarih:', evrak.sistemeGonderildigiTarih);
                                                        console.log('Gönderen:', evrak.gonderenYerKisi);
                                                        console.log('***********************');
                                                    }
                                                }
                                                
                                                // Alıcı bilgisi için güvenli şekilde regex
                                                let aliciBilgisi = '';
                                                if (evrak.aciklama) {
                                                    const aliciMatch = evrak.aciklama.match(/\[(.*?)\]/);
                                                    if (aliciMatch && aliciMatch[1]) {
                                                        aliciBilgisi = aliciMatch[1];
                                                    }
                                                }
                                                
                                                // Eklenecek evrak bilgilerini hazırla
                                                kapaliTebligatlar.push({
                                                    evrakId: evrak.evrakId,
                                                    dosyaId: evrak.dosyaId,
                                                    tur: evrak.tur,
                                                    tarih: evrak.sistemeGonderildigiTarih,
                                                    gonderenKisi: evrak.gonderenYerKisi,
                                                    isElektronikTebligat: isElektronikTebligat,
                                                    dosyaNoIs: evrak.gonderenDosyaNo,
                                                    aliciBilgisiIs: aliciBilgisi,
                                                    onaylananTarih: evrak.onaylandigiTarih || ''
                                                });
                                            } else {
                                                console.log(`UYAP Asistan: Tarih filtresi dışında kalan evrak (son20) (${evrak.evrakId}): ${evrak.onaylandigiTarih}`);
                                            }
                                        } else {
                                            console.log(`UYAP Asistan: Onaylanma tarihi olmayan evrak (son20) (${evrak.evrakId})`);
                                            // Onaylanma tarihi olmayan evrakları da dahil et
                                            // ... existing evrak işleme kodu ...
                                            
                                            // Elektronik tebligat kontrolü
                                            let isElektronikTebligat = false;
                                            
                                            // Aciklama alanı varsa, elektronik tebligat içerip içermediğini kontrol et
                                            if (evrak.aciklama) {
                                                const aciklamaLower = evrak.aciklama.toLowerCase();
                                                if (aciklamaLower.includes("elektronik tebligat") || 
                                                    aciklamaLower.includes("e-tebligat") || 
                                                    aciklamaLower.includes("ulak") || 
                                                    aciklamaLower.includes("elektronik tebliğ") ||
                                                    aciklamaLower.includes("uets")) {
                                                    
                                                    isElektronikTebligat = true;
                                                    
                                                    // Elektronik tebligat olduğunu konsola yazdır
                                                    console.log('***********************');
                                                    console.log('Elektronik Tebligat Tespit Edildi');
                                                    console.log('Evrak ID:', evrak.evrakId);
                                                    console.log('Açıklama:', evrak.aciklama);
                                                    console.log('Tarih:', evrak.sistemeGonderildigiTarih);
                                                    console.log('Gönderen:', evrak.gonderenYerKisi);
                                                    console.log('***********************');
                                                }
                                            }
                                            
                                            // Alıcı bilgisi için güvenli şekilde regex
                                            let aliciBilgisi = '';
                                            if (evrak.aciklama) {
                                                const aliciMatch = evrak.aciklama.match(/\[(.*?)\]/);
                                                if (aliciMatch && aliciMatch[1]) {
                                                    aliciBilgisi = aliciMatch[1];
                                                } else {
                                                    aliciBilgisi = evrak.aciklama;
                                                }
                                            }
                                            
                                            kapaliTebligatlar.push({
                                                evrakId: evrak.evrakId,
                                                dosyaId: evrak.dosyaId,
                                                tur: evrak.tur,
                                                tarih: evrak.sistemeGonderildigiTarih,
                                                gonderenKisi: evrak.gonderenYerKisi,
                                                isElektronikTebligat: isElektronikTebligat,
                                                dosyaNoIs: evrak.gonderenDosyaNo,
                                                aliciBilgisiIs: aliciBilgisi,
                                                onaylananTarih: evrak.onaylandigiTarih || ''
                                            });
                                        }
                                    }
                                }
                            });
                        }
                        
                        console.log('UYAP Asistan: Kapalı Tebligatlar:', kapaliTebligatlar);
                        
                        // Tespit edilen tebligatlar hakkında kullanıcıyı bilgilendir
                        if (kapaliTebligatlar.length > 0) {
                            console.log(`UYAP Asistan: ${kapaliTebligatlar.length} adet kapalı tebligat bulundu. İndirme işlemi başlatılıyor...`);
                            
                            // Tebligat sonuçlarını saklamak için dizi
                            const tebligatSonuclari = [];
                            
                            // Başlangıç ilerleme değeri ve tebligat başına düşen ilerleme miktarını hesapla
                            let progress = 60;  // Bu noktada zaten %60'a kadar gelmişiz
                            const progressPerTebligat = kapaliTebligatlar.length > 0 ? (35 / kapaliTebligatlar.length) : 35;
                            
                            // Her kapalı tebligat için indir
                            for (const tebligat of kapaliTebligatlar) {
                                try {
                                    // Belge indirme URL'sini oluştur
                                    const downloadUrl = `https://avukatbeta.uyap.gov.tr/download_document_brd.uyap?evrakId=${tebligat.evrakId}&dosyaId=${encodeURIComponent(dosyaId)}`;
                                    
                                    console.log(`UYAP Asistan: Tebligat indiriliyor: ${downloadUrl}`);
                                    
                                    // fetch ile belgeyi indir (ağ bölümünde görünsün diye)
                                    fetch(downloadUrl, {
                                        method: 'GET',
                                        credentials: 'include' // Include cookies for authentication
                                    }).then(async response => {
                                        if (response.ok) {
                                            console.log(`UYAP Asistan: Tebligat başarıyla indirildi: ${tebligat.evrakId}`);
                                            
                                            // PDF'i blob olarak al
                                            const blob = await response.blob();
                                            
                                            // Blob'u base64'e çevir
                                            const reader = new FileReader();
                                            reader.readAsDataURL(blob);
                                            
                                            reader.onloadend = async function() {
                                                // Base64 verisini al (data:application/pdf;base64, kısmını kaldır)
                                                const base64Data = reader.result.split(',')[1];
                                                
                                                try {
                                                    // Önce barkod numarasını al
                                                    const barkodResult = await sendBase64ToPdfServer(base64Data);
                                                    
                                                    if (barkodResult.success) {
                                                        const barcodeNumber = barkodResult.data.barcodeNumber;
                                                        
                                                        // Tebligat sonucu için temel veri yapısını oluştur
                                                        const tebligatSonuc = {
                                                            yargiBirimi: tebligat.gonderenKisi || 'Belirtilmemiş',
                                                            dosyaNo: tebligat.dosyaNoIs || 'Belirtilmemiş',
                                                            barkodNo: barcodeNumber,
                                                            aliciBilgisi: tebligat.aliciBilgisiIs || 'Belirtilmemiş',
                                                            gonderimDurumu: '',
                                                            gonderimAciklamasi: '',
                                                            teslimTarihi: '',
                                                            isElektronikTebligat: tebligat.isElektronikTebligat
                                                        };
                                                        
                                                        // Eğer elektronik tebligat ise
                                                        if (tebligat.isElektronikTebligat) {
                                                            tebligatSonuc.gonderimDurumu = 'Elektronik Tebligat';
                                                            tebligatSonuc.gonderimAciklamasi = 'UETS';
                                                            tebligatSonuc.teslimTarihi = tebligat.onaylananTarih || '';
                                                            
                                                            // Sonuçları listeye ekle
                                                            tebligatSonuclari.push(tebligatSonuc);
                                                            
                                                            // İlerlemeyi güncelle
                                                            progress += progressPerTebligat;
                                                            progressInner.style.width = Math.min(95, progress) + '%';
                                                            progressInner.textContent = Math.min(95, Math.round(progress)) + '%';
                                                            
                                                            // Tabloyu güncelle
                                                            updateTebligatTable(tebligatSonuclari);
                                                            
                                                            console.log('***********************');
                                                            console.log('Elektronik Tebligat Barkod Numarası:', barcodeNumber);
                                                            console.log('Evrak ID:', tebligat.evrakId);
                                                            console.log('***********************');
                                                        } else {
                                                            // Normal tebligat ise PTT sorgusu yap
                                                            try {
                                                                const response = await fetch('https://avukatbeta.uyap.gov.tr/mts_tebligat_safahat_list_brd.ajx', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                    },
                                                                    body: JSON.stringify({
                                                                        barkodNo: barcodeNumber
                                                                    })
                                                                });

                                                                if (response.ok) {
                                                                    const pttData = await response.json();
                                                                    
                                                                    // MTS'den hata döndüyse (errorCode veya error var ise)
                                                                    if (pttData.errorCode || pttData.error) {
                                                                        console.log('MTS Hatası:', pttData.error || 'MTS Tebligat durumu alınamadı');
                                                                        // Hata durumunda gönderim durumunu "Gönderim Aşamasında" olarak ayarla
                                                                        tebligatSonuc.gonderimDurumu = 'Gönderim Aşamasında';
                                                                        tebligatSonuc.gonderimAciklamasi = 'PTT tebligatı henüz işleme koymadı';
                                                                    } 
                                                                    // Normal veri döndüyse işleme devam et
                                                                    else if (Array.isArray(pttData) && pttData.length > 0) {
                                                                        // Alıcı bilgilerini çek
                                                                        const aciklamaItem = pttData.find(item => item.aciklama && item.aciklama.includes('[') && item.aciklama.includes(']'));
                                                                        if (aciklamaItem) {
                                                                            const aciklama = aciklamaItem.aciklama;
                                                                            const aliciMatch = aciklama.match(/\[(.*?)\]/);
                                                                            if (aliciMatch && aliciMatch[1]) {
                                                                                tebligatSonuc.aliciBilgisi = aliciMatch[1];
                                                                            }
                                                                        }
                                                                        
                                                                        // Belirli açıklamalara sahip OLMAYAN öğeleri bul
                                                                        const hariçTutulacakAçıklamalar = [
                                                                            "Kabul Edildi", 
                                                                            "Torbaya Eklendi", 
                                                                            "Gönderinin Geliş Kaydı Yapıldı", 
                                                                            "Dağıtıcıya Verildi", 
                                                                            "Göndericisine Teslim Edildi", 
                                                                            "Köy Dağıtımına Tabi Bekliyor",
                                                                            "Cihet Hazırlama Listesine Eklendi",
                                                                            "MAZBATA TESLİM",
                                                                            "Cihetten Gönderi Çıkarıldı",
                                                                            "Gönderi Akıbeti Araştırılıyor",
                                                                            "Depodan Gönderi Çıkartıldı",
                                                                            "Zimmet Edildi"
                                                                        ];
                                                                        
                                                                        const durumItem = pttData.find(item => 
                                                                            item.aciklama && 
                                                                            !hariçTutulacakAçıklamalar.some(hariç => 
                                                                                item.aciklama.includes(hariç)
                                                                            )
                                                                        );
                                                                        
                                                                        if (durumItem) {
                                                                            tebligatSonuc.gonderimDurumu = durumItem.islemTipAdi || 'Belirtilmemiş';
                                                                            tebligatSonuc.gonderimAciklamasi = durumItem.aciklama || 'Belirtilmemiş';
                                                                            // Tarih bilgisini gonderimTarihi olarak kaydet (tabloda gösterilmeyecek)
                                                                            if (durumItem.tarih) {
                                                                                tebligatSonuc.gonderimTarihi = durumItem.tarih;
                                                                            }
                                                                        }
                                                                        
                                                                        // Teslim tarihini bul
                                                                        const teslimItem = pttData.find(item => 
                                                                            (item.islemTipAdi && item.islemTipAdi.toLowerCase().includes('teslim')) || 
                                                                            (item.aciklama && item.aciklama.toLowerCase().includes('teslim')) ||
                                                                            (item.islemTipKodu && item.islemTipKodu === 'TESLIM')
                                                                        );
                                                                        
                                                                        if (teslimItem && teslimItem.tarih) {
                                                                            tebligatSonuc.teslimTarihi = teslimItem.tarih;
                                                                        } else if (tebligatSonuc.gonderimTarihi) {
                                                                            // Eğer teslim tarihi bulunmazsa gönderim tarihini kullan
                                                                            tebligatSonuc.teslimTarihi = tebligatSonuc.gonderimTarihi;
                                                                        }
                                                                    } else {
                                                                        // Veri boş gelirse "Gönderim Aşamasında" olarak işaretle
                                                                        tebligatSonuc.gonderimDurumu = 'Gönderim Aşamasında';
                                                                        tebligatSonuc.gonderimAciklamasi = 'PTT tebligatı henüz işleme koymadı';
                                                                    }
                                                                } else {
                                                                    // Yanıt başarısız ise "Gönderim Aşamasında" olarak işaretle
                                                                    tebligatSonuc.gonderimDurumu = 'Gönderim Aşamasında';
                                                                    tebligatSonuc.gonderimAciklamasi = 'PTT tebligatı henüz işleme koymadı';
                                                                }
                                                            } catch (error) {
                                                                console.error('PTT sorgusu sırasında hata oluştu:', error);
                                                            }
                                                            
                                                            // Sonuçları listeye ekle
                                                            tebligatSonuclari.push(tebligatSonuc);
                                                            
                                                            // İlerlemeyi güncelle
                                                            progress += progressPerTebligat;
                                                            progressInner.style.width = Math.min(95, progress) + '%';
                                                            progressInner.textContent = Math.min(95, Math.round(progress)) + '%';
                                                            
                                                            // Tabloyu güncelle
                                                            updateTebligatTable(tebligatSonuclari);
                                                        }
                                                    } else {
                                                        console.error('Barkod bulunamadı:', barkodResult.error);
                                                    }
                                                } catch (error) {
                                                    console.error('UYAP Asistan: İşlem hatası:', error);
                                                }
                                            };
                                        } else {
                                            console.error(`UYAP Asistan: Tebligat indirilemedi: ${tebligat.evrakId}`, response.status);
                                        }
                                    }).catch(err => {
                                        console.error(`UYAP Asistan: Tebligat indirme hatası: ${tebligat.evrakId}`, err);
                                    });
                                    
                                    // İstekler arasında kısa bir bekleme süresi
                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                    
                                } catch (error) {
                                    console.error(`UYAP Asistan: Tebligat ${tebligat.evrakId} indirilirken hata:`, error);
                                }
                            }
                            
                            console.log('UYAP Asistan: Tebligat indirme işlemleri tamamlandı. Ağ sekmesini kontrol edebilirsiniz.');
                            
                            // Tebligat sorgusu tamamlandığında ilerleme çubuğunu tamamla
                            progressInner.style.width = '100%';
                            progressInner.textContent = '100%';
                            
                            // 1 saniye sonra ilerleme çubuğunu gizle
                            setTimeout(() => {
                                progressContainer.style.display = 'none';
                            }, 1000);
                            
                            // Buton durumunu normal haline getir
                            tebligatBtn.disabled = false;
                            tebligatBtn.textContent = 'Tebligat Sorgulama';
                            tebligatBtn.style.backgroundColor = '#24377F';
                            
                            // Tebligat sorgusu tamamlandığında tablonun görünür olduğundan emin ol
                            const activeTab = document.querySelector('.file-tracking-tab-content.active');
                            if (activeTab) {
                                // Önceki tabloyu temizle
                                const existingTable = activeTab.querySelector('.tebligat-table-container');
                                if (existingTable) {
                                    existingTable.remove();
                                }
                                
                                // Yeni tablo container'ı oluştur
                                const tableContainer = document.createElement('div');
                                tableContainer.className = 'tebligat-table-container mt-3';
                                tableContainer.innerHTML = `
                                    <h4 class="text-center mb-3">Tebligat Durumları</h4>
                                    
                                    <div class="mb-3 d-flex justify-content-between">
                                        <div class="flex-grow-1 me-2">
                                            <input type="text" id="tebligat-search" class="form-control" placeholder="Tebligat tablosunda ara...">
                                        </div>
                                        <div>
                                            <button id="export-excel-btn" class="btn btn-success btn-sm">
                                                <i class="fas fa-file-excel me-1"></i> Excel'e Aktar
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="table-responsive">
                                        <table class="table table-striped table-bordered">
                                            <thead class="table-dark">
                                                <tr>
                                                    <th data-sort="yargiBirimi" class="sortable">Yargı Birimi <i class="fas fa-sort"></i></th>
                                                    <th data-sort="dosyaNo" class="sortable">Dosya No <i class="fas fa-sort"></i></th>
                                                    <th data-sort="barkodNo" class="sortable">Barkod No <i class="fas fa-sort"></i></th>
                                                    <th data-sort="aliciBilgisi" class="sortable">Alıcı Bilgileri <i class="fas fa-sort"></i></th>
                                                    <th data-sort="gonderimAciklamasi">Gönderim Açıklaması</th>
                                                    <th data-sort="teslimTarihi" class="sortable">Teslim Tarihi <i class="fas fa-sort"></i></th>
                                                </tr>
                                            </thead>
                                            <tbody id="tebligat-table-body">
                                                <tr>
                                                    <td colspan="6" class="text-center">
                                                        <div class="spinner-border text-primary" role="status">
                                                            <span class="visually-hidden">Yükleniyor...</span>
                                                        </div>
                                                        <p class="mt-2">Tebligat bilgileri yükleniyor...</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <div class="mt-3 text-center d-none" id="tebligat-summary">
                                        <span class="badge bg-success me-2">Toplam: <span id="total-count">0</span></span>
                                        <span class="badge bg-info me-2">Elektronik: <span id="elektronik-count">0</span></span>
                                        <span class="badge bg-warning">Normal: <span id="normal-count">0</span></span>
                                    </div>
                                `;
                                
                                activeTab.appendChild(tableContainer);
                                
                                // Arama işlevselliğini ekle
                                const searchInput = tableContainer.querySelector('#tebligat-search');
                                if (searchInput) {
                                    searchInput.addEventListener('keyup', function() {
                                        filterTebligatTable(this.value);
                                    });
                                }
                                
                                // Excel'e aktarma işlevselliğini ekle
                                const exportBtn = tableContainer.querySelector('#export-excel-btn');
                                if (exportBtn) {
                                    exportBtn.addEventListener('click', function() {
                                        exportTableToExcel();
                                    });
                                }
                                
                                // Sıralama işlevselliğini ekle
                                const sortableThs = tableContainer.querySelectorAll('th.sortable');
                                sortableThs.forEach(th => {
                                    th.addEventListener('click', function() {
                                        const sortField = this.getAttribute('data-sort');
                                        sortTebligatTable(sortField);
                                        
                                        // Simgeyi güncelle
                                        const icon = this.querySelector('i');
                                        if (icon.classList.contains('fa-sort')) {
                                            // İlk tıklama - artan sıralama
                                            sortableThs.forEach(h => h.querySelector('i').className = 'fas fa-sort');
                                            icon.className = 'fas fa-sort-up';
                                            th.setAttribute('data-sort-dir', 'asc');
                                        } else if (icon.classList.contains('fa-sort-up')) {
                                            // İkinci tıklama - azalan sıralama
                                            icon.className = 'fas fa-sort-down';
                                            th.setAttribute('data-sort-dir', 'desc');
                        } else {
                                            // Üçüncü tıklama - sıralama kaldır
                                            icon.className = 'fas fa-sort';
                                            th.removeAttribute('data-sort-dir');
                                        }
                                    });
                                });
                                
                                // İlk tabloyu güncelle
                                updateTebligatTable(tebligatSonuclari);
                            }
                        } else {
                            console.log('UYAP Asistan: Kapalı tebligat bulunamadı.');
                            alert('Dosyada kapalı tebligat bulunamadı.');
                        }
                    } else {
                        // Hata durumu
                        console.error('UYAP Asistan: Tebligat sorgulaması sırasında bir hata oluştu!');
                        console.error('UYAP Asistan: Tebligat sorgulaması hatası:', data);
                    }
                } catch (error) {
                    // İstek hatası
                    console.error('UYAP Asistan: Tebligat sorgulaması yapılırken bir hata oluştu!');
                    console.error('UYAP Asistan: Tebligat sorgulaması istek hatası:', error);
                } finally {
                    // Buton durumunu eski haline getir
                    tebligatBtn.disabled = false;
                    tebligatBtn.textContent = 'Tebligat Sorgulama';
                    tebligatBtn.style.backgroundColor = '#24377F';
                }
            });
            
            // Açıklama metni
            const explanation = document.createElement('p');
            explanation.style.cssText = `
                margin: 10px 0;
                color: #555;
                font-size: 14px;
            `;
            explanation.textContent = 'Bu buton, dosyanıza ait tebligat bilgilerini sorgulamak için kullanılabilir.';
            
            // Elemanları container'a ekle
            scanContainer.appendChild(dateFilterContainer);
            scanContainer.appendChild(tebligatBtn);
            scanContainer.appendChild(progressContainer);
            scanContainer.appendChild(explanation);
            
            // Container'ı tab içeriğine ekle
            tabContent.appendChild(scanContainer);
        }
        
        tabHeaders.appendChild(tabHeader);
        tabContents.appendChild(tabContent);
    });
    
    // TabPanel'i birleştir
    tabPanel.appendChild(tabHeaders);
    tabPanel.appendChild(tabContents);
    
    // İçeriğe TabPanel'i ekle
    content.appendChild(tabPanel);
    
    // Controls'a close button ekle
    controls.appendChild(closeBtn);
    
    // Header içeriğini oluştur
    header.appendChild(title);
    header.appendChild(controls);
    
    // Popup'ı oluştur
    popup.appendChild(header);
    popup.appendChild(content);
    
    // Overlay'e popup'ı ekle
    overlay.appendChild(popup);
    
    // Sayfaya overlay'i ekle
    document.body.appendChild(overlay);
    
    // Blur efekti için diğer elementleri bulanıklaştır
    document.querySelectorAll('body > *:not(#file-tracking-overlay)').forEach(elem => {
        if (elem !== overlay) {
            elem.style.filter = 'blur(5px)';
            elem.style.pointerEvents = 'none';
        }
    });
    
    // Popup kapatıldığında blur efektini kaldır
    const removeBlur = () => {
        document.querySelectorAll('body > *').forEach(elem => {
            elem.style.filter = '';
            elem.style.pointerEvents = '';
        });
    };
    
    closeBtn.addEventListener('click', removeBlur);
    overlay.addEventListener('click', event => {
        if (event.target === overlay) {
            removeBlur();
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && overlay.parentNode) {
            removeBlur();
        }
    });
}

// Tebligat tablosunu güncellemek için yardımcı fonksiyon
function updateTebligatTable(tebligatSonuclari) {
    const tableBody = document.getElementById('tebligat-table-body');
    const summary = document.getElementById('tebligat-summary');
    
    // Tablo gövdesi yoksa sessizce çık
    if (!tableBody) {
        return;
    }
    
    console.log(`UYAP Asistan: Tablo güncelleniyor... ${tebligatSonuclari.length} adet tebligat var.`);
    
    // Tabloyu temizle
    tableBody.innerHTML = '';
    
    // Sonuçları tabloya ekle
    if (tebligatSonuclari.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Tebligat bilgisi bulunamadı</td></tr>`;
        if (summary) summary.classList.add('d-none');
        return;
    }
    
    // İstatistikler
    let elektronikCount = 0;
    let normalCount = 0;
    let teslimCount = 0;
    let teslimBekleyenCount = 0;
    let iadeCount = 0;
    
    tebligatSonuclari.forEach(sonuc => {
        const row = document.createElement('tr');
        
        // İade kontrolü
        const isIade = sonuc.gonderimAciklamasi && 
                      (sonuc.gonderimAciklamasi.toUpperCase().includes('IADE') || 
                       sonuc.gonderimAciklamasi.toUpperCase().includes('İADE'));
        
        // Stil uygulamaları
        if (sonuc.isElektronikTebligat) {
            // Elektronik tebligat için mavi stil
            row.classList.add('table-info');
            elektronikCount++;
        } else if (isIade) {
            // İade edilmiş tebligat için kırmızı stil
            row.classList.add('table-danger');
            normalCount++;
            iadeCount++;
        } else if (sonuc.teslimTarihi && sonuc.teslimTarihi.trim() !== '-' && sonuc.teslimTarihi.trim() !== '') {
            // Teslim edilmiş tebligat için yeşil stil
            row.classList.add('table-success');
            normalCount++;
            teslimCount++;
        } else {
            // Henüz teslim edilmemiş tebligat için kırmızı stil
            row.classList.add('table-danger');
            normalCount++;
            teslimBekleyenCount++;
        }
        
        row.innerHTML = `
            <td>${sonuc.yargiBirimi || '-'}</td>
            <td>${sonuc.dosyaNo || '-'}</td>
            <td>${sonuc.barkodNo || '-'}</td>
            <td>${sonuc.aliciBilgisi || '-'}</td>
            <td>${sonuc.gonderimAciklamasi || '-'}</td>
            <td>${sonuc.teslimTarihi || '-'}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Özet bilgileri göster
    if (summary) {
        document.getElementById('total-count').textContent = tebligatSonuclari.length;
        document.getElementById('elektronik-count').textContent = elektronikCount;
        document.getElementById('normal-count').textContent = normalCount;
        summary.classList.remove('d-none');
    }
    
    // Global tebligat sonuçları değişkenini güncelle
    window.latestTebligatSonuclari = tebligatSonuclari;
}

// Tebligat tablosunda arama yapmak için fonksiyon
function filterTebligatTable(searchText) {
    if (!window.latestTebligatSonuclari) return;
    
    const filteredResults = window.latestTebligatSonuclari.filter(sonuc => {
        const searchLower = searchText.toLowerCase();
        return (
            (sonuc.yargiBirimi && sonuc.yargiBirimi.toLowerCase().includes(searchLower)) ||
            (sonuc.dosyaNo && sonuc.dosyaNo.toLowerCase().includes(searchLower)) ||
            (sonuc.barkodNo && sonuc.barkodNo.toLowerCase().includes(searchLower)) ||
            (sonuc.aliciBilgisi && sonuc.aliciBilgisi.toLowerCase().includes(searchLower)) ||
            (sonuc.gonderimAciklamasi && sonuc.gonderimAciklamasi.toLowerCase().includes(searchLower)) ||
            (sonuc.teslimTarihi && sonuc.teslimTarihi.toLowerCase().includes(searchLower))
        );
    });
    
    // Tablo gövdesini güncelle
    const tableBody = document.getElementById('tebligat-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (filteredResults.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Arama kriterine uygun tebligat bulunamadı</td></tr>`;
        return;
    }
    
    // Sayaçlar
    let elektronikCount = 0;
    let teslimCount = 0;
    let teslimBekleyenCount = 0;
    let iadeCount = 0;
    
    filteredResults.forEach(sonuc => {
        const row = document.createElement('tr');
        
        // İade kontrolü
        const isIade = sonuc.gonderimAciklamasi && 
                      (sonuc.gonderimAciklamasi.toUpperCase().includes('IADE') || 
                       sonuc.gonderimAciklamasi.toUpperCase().includes('İADE'));
        
        // Stil uygulamaları
        if (sonuc.isElektronikTebligat) {
            // Elektronik tebligat için mavi stil
            row.classList.add('table-info');
            elektronikCount++;
        } else if (isIade) {
            // İade edilmiş tebligat için kırmızı stil
            row.classList.add('table-danger');
            iadeCount++;
        } else if (sonuc.teslimTarihi && sonuc.teslimTarihi.trim() !== '-' && sonuc.teslimTarihi.trim() !== '') {
            // Teslim edilmiş tebligat için yeşil stil
            row.classList.add('table-success');
            teslimCount++;
        } else {
            // Henüz teslim edilmemiş tebligat için kırmızı stil
            row.classList.add('table-danger');
            teslimBekleyenCount++;
        }
        
        row.innerHTML = `
            <td>${sonuc.yargiBirimi || '-'}</td>
            <td>${sonuc.dosyaNo || '-'}</td>
            <td>${sonuc.barkodNo || '-'}</td>
            <td>${sonuc.aliciBilgisi || '-'}</td>
            <td>${sonuc.gonderimAciklamasi || '-'}</td>
            <td>${sonuc.teslimTarihi || '-'}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Özet bilgilerini güncelle
    const summary = document.getElementById('tebligat-summary');
    if (summary) {
        document.getElementById('total-count').textContent = filteredResults.length;
        document.getElementById('elektronik-count').textContent = elektronikCount;
        document.getElementById('normal-count').textContent = filteredResults.length - elektronikCount;
    }
}

// Tebligat tablosunu sıralamak için fonksiyon
function sortTebligatTable(field) {
    if (!window.latestTebligatSonuclari) return;
    
    const th = document.querySelector(`th[data-sort="${field}"]`);
    const sortDir = th.getAttribute('data-sort-dir') || 'asc';
    
    // Sıralama yönüne göre sırala
    const sortedResults = [...window.latestTebligatSonuclari].sort((a, b) => {
        const valA = (a[field] || '').toString().toLowerCase();
        const valB = (b[field] || '').toString().toLowerCase();
        
        if (sortDir === 'asc') {
            return valA.localeCompare(valB, 'tr');
        } else {
            return valB.localeCompare(valA, 'tr');
        }
    });
    
    // Tablo gövdesini güncelle
    const tableBody = document.getElementById('tebligat-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Sayaçlar
    let elektronikCount = 0;
    let teslimCount = 0;
    let teslimBekleyenCount = 0;
    let iadeCount = 0;
    
    sortedResults.forEach(sonuc => {
        const row = document.createElement('tr');
        
        // İade kontrolü
        const isIade = sonuc.gonderimAciklamasi && 
                      (sonuc.gonderimAciklamasi.toUpperCase().includes('IADE') || 
                       sonuc.gonderimAciklamasi.toUpperCase().includes('İADE'));
        
        // Stil uygulamaları
        if (sonuc.isElektronikTebligat) {
            // Elektronik tebligat için mavi stil
            row.classList.add('table-info');
            elektronikCount++;
        } else if (isIade) {
            // İade edilmiş tebligat için kırmızı stil
            row.classList.add('table-danger');
            iadeCount++;
        } else if (sonuc.teslimTarihi && sonuc.teslimTarihi.trim() !== '-' && sonuc.teslimTarihi.trim() !== '') {
            // Teslim edilmiş tebligat için yeşil stil
            row.classList.add('table-success');
            teslimCount++;
        } else {
            // Henüz teslim edilmemiş tebligat için kırmızı stil
            row.classList.add('table-danger');
            teslimBekleyenCount++;
        }
        
        row.innerHTML = `
            <td>${sonuc.yargiBirimi || '-'}</td>
            <td>${sonuc.dosyaNo || '-'}</td>
            <td>${sonuc.barkodNo || '-'}</td>
            <td>${sonuc.aliciBilgisi || '-'}</td>
            <td>${sonuc.gonderimAciklamasi || '-'}</td>
            <td>${sonuc.teslimTarihi || '-'}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Dava Dosyası Notları Tab İçeriği
function createNotesView(fileInfo, notesData) {
    const notesContainer = document.createElement('div');
    notesContainer.className = 'file-tracking-notes-view';
    notesContainer.style.cssText = `
        height: 100%;
        display: flex;
        flex-direction: column;
    `;
    
    // Not başlığı
    const notesTitle = document.createElement('h3');
    notesTitle.style.cssText = `
        margin: 0 0 20px 0;
        color: #24377F;
        font-size: 1.2em;
    `;
    notesTitle.textContent = 'Dosya Notları';
    
    // Not ekleme formu
    const noteForm = document.createElement('div');
    noteForm.className = 'note-form';
    noteForm.style.cssText = `
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
    `;
    
    // Not içerik input
    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.placeholder = 'Yeni not ekle...';
    noteInput.className = 'note-input';
    noteInput.style.cssText = `
        flex: 1;
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        font-size: 14px;
    `;
    
    // Not ekle butonu
    const addNoteBtn = document.createElement('button');
    addNoteBtn.textContent = 'Ekle';
    addNoteBtn.className = 'add-note-btn';
    addNoteBtn.style.cssText = `
        padding: 0 20px;
        background-color: #24377F;
        color: white;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s;
    `;
    
    // Hover efekti
    addNoteBtn.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#1a2a5e';
    });
    addNoteBtn.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#24377F';
    });
    
    // Form elemanlarını forma ekle
    noteForm.appendChild(noteInput);
    noteForm.appendChild(addNoteBtn);
    
    // Kayıtlı Notlar bölümü
    const savedNotesSection = document.createElement('div');
    savedNotesSection.className = 'saved-notes-section';
    savedNotesSection.style.cssText = `
        margin-bottom: 20px;
        padding: 15px;
        background-color: #f5f7fa;
        border-radius: 5px;
        border: 1px solid #e0e0e0;
    `;
    
    // Kayıtlı Notlar başlığı
    const savedNotesTitle = document.createElement('h4');
    savedNotesTitle.style.cssText = `
        margin: 0 0 15px 0;
        color: #24377F;
        font-size: 1em;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    savedNotesTitle.innerHTML = '<span>Kayıtlı Notlar</span>';
    
    // Arama kutusu
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: relative;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Not ara ve Enter tuşuna bas...';
    searchInput.className = 'saved-notes-search';
    searchInput.style.cssText = `
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        font-size: 14px;
    `;

    // Otomatik tamamlama için öneriler
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'notes-suggestions';
    suggestionsContainer.style.cssText = `
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 10;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(suggestionsContainer);
    
    // Kayıtlı Notlar bölümünü birleştir
    savedNotesSection.appendChild(savedNotesTitle);
    savedNotesSection.appendChild(searchContainer);
    
    // Yeni otomatik tamamlama fonksiyonu
    let allCaseNotes = [];
    let selectedSuggestionIndex = -1;

    searchInput.addEventListener('focus', () => {
        // Tüm notları al
        allCaseNotes = JSON.parse(localStorage.getItem('uyap_asistan_case_notes') || '[]');
        allCaseNotes = allCaseNotes.map(note => note.text);
        
        // Odaklandığında mevcut arama metnine göre önerileri göster
        const searchText = searchInput.value.trim().toLowerCase();
        if (searchText) {
            showSuggestions(searchText);
        }
    });
    
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.trim().toLowerCase();
        if (searchText) {
            showSuggestions(searchText);
        } else {
            suggestionsContainer.style.display = 'none';
            suggestionsContainer.innerHTML = '';
            selectedSuggestionIndex = -1;
        }
    });
    
    searchInput.addEventListener('keydown', (e) => {
        const suggestions = suggestionsContainer.querySelectorAll('.note-suggestion');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedSuggestionIndex < suggestions.length - 1) {
                selectedSuggestionIndex++;
                highlightSuggestion(suggestions);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedSuggestionIndex > 0) {
                selectedSuggestionIndex--;
                highlightSuggestion(suggestions);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
                // Seçili öneriyi ekle
                const selectedNote = suggestions[selectedSuggestionIndex].getAttribute('data-text');
                addNoteToCaseFile(selectedNote);
                
                // Input alanını temizle ve önerileri kapat
                searchInput.value = '';
                suggestionsContainer.style.display = 'none';
                suggestionsContainer.innerHTML = '';
                selectedSuggestionIndex = -1;
            } else if (searchInput.value.trim() !== '') {
                // Yazılan metni doğrudan ekle
                addNoteToCaseFile(searchInput.value.trim());
                searchInput.value = '';
                suggestionsContainer.style.display = 'none';
                suggestionsContainer.innerHTML = '';
            }
        } else if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
            suggestionsContainer.innerHTML = '';
            selectedSuggestionIndex = -1;
        }
    });
    
    // Önerileri gösterme fonksiyonu
    function showSuggestions(searchText) {
        suggestionsContainer.innerHTML = '';
        
        // Arama metnine göre filtreleme yap
        const filteredNotes = allCaseNotes.filter(note => 
            note.toLowerCase().includes(searchText)
        );
        
        if (filteredNotes.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // En fazla 5 öneri göster
        const maxSuggestions = Math.min(filteredNotes.length, 5);
        
        for (let i = 0; i < maxSuggestions; i++) {
            const suggestion = document.createElement('div');
            suggestion.className = 'note-suggestion';
            suggestion.setAttribute('data-text', filteredNotes[i]);
            suggestion.style.cssText = `
                padding: 8px 12px;
                cursor: pointer;
                border-bottom: ${i < maxSuggestions - 1 ? '1px solid #f0f0f0' : 'none'};
                transition: background-color 0.2s;
            `;
            
            // Arama metnini vurgula
            const text = filteredNotes[i];
            const index = text.toLowerCase().indexOf(searchText);
            
            if (index >= 0) {
                const part1 = text.substring(0, index);
                const part2 = text.substring(index, index + searchText.length);
                const part3 = text.substring(index + searchText.length);
                
                suggestion.innerHTML = `${part1}<strong>${part2}</strong>${part3}`;
            } else {
                suggestion.textContent = text;
            }
            
            suggestion.addEventListener('click', () => {
                // Notu ekle
                addNoteToCaseFile(filteredNotes[i]);
                
                // Input alanını temizle ve önerileri kapat
                searchInput.value = '';
                suggestionsContainer.style.display = 'none';
                suggestionsContainer.innerHTML = '';
                selectedSuggestionIndex = -1;
            });
            
            suggestion.addEventListener('mouseover', () => {
                selectedSuggestionIndex = i;
                highlightSuggestion(suggestionsContainer.querySelectorAll('.note-suggestion'));
            });
            
            suggestionsContainer.appendChild(suggestion);
        }
        
        suggestionsContainer.style.display = 'block';
    }
    
    // Seçili öneriyi vurgulama
    function highlightSuggestion(suggestions) {
        for (let i = 0; i < suggestions.length; i++) {
            if (i === selectedSuggestionIndex) {
                suggestions[i].style.backgroundColor = '#f5f5f5';
            } else {
                suggestions[i].style.backgroundColor = 'transparent';
            }
        }
        
        // Seçili öğeyi görünür hale getir
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
            suggestions[selectedSuggestionIndex].scrollIntoView({
                block: 'nearest'
            });
        }
    }
    
    // Notlar listesi
    const notesList = document.createElement('div');
    notesList.className = 'notes-list';
    notesList.style.cssText = `
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        align-content: flex-start;
    `;
    
    // Dava dosyasına not ekleme fonksiyonu
    const addNoteToCaseFile = (text) => {
        if (text.trim() !== '') {
            // Dosya verilerini al
            const updatedFileData = FileTrackingDB.getFile(fileInfo);
            
            // Yeni not oluştur
            const newNote = {
                id: Date.now(),
                text: text.trim(),
                color: getRandomColor(),
                date: new Date().toLocaleDateString('tr-TR')
            };
            
            // Notlar listesine ekle
            updatedFileData.notes.push(newNote);
            
            // Dosya verilerini kaydet
            FileTrackingDB.saveFile(fileInfo, updatedFileData);
            
            // Not kartını oluştur ve listeye ekle
            const noteCard = createNoteCard(newNote, notesList, fileInfo);
            notesList.appendChild(noteCard);
        }
    };
    
    // Mevcut notları listele
    if (notesData && notesData.length > 0) {
        notesData.forEach(note => {
            const noteCard = createNoteCard(note, notesList, fileInfo);
            notesList.appendChild(noteCard);
        });
    }
    
    // Not ekleme işlevi
    addNoteBtn.addEventListener('click', () => {
        if (noteInput.value.trim() !== '') {
            // Yeni not ekle
            addNoteToCaseFile(noteInput.value.trim());
            
            // Input'u temizle
            noteInput.value = '';
        }
    });
    
    // Enter tuşu ile de not eklenebilsin
    noteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addNoteBtn.click();
        }
    });
    
    // Ana container'a elemanları ekle
    notesContainer.appendChild(notesTitle);
    notesContainer.appendChild(noteForm);
    notesContainer.appendChild(savedNotesSection);
    notesContainer.appendChild(notesList);
    
    return notesContainer;
}

// Not kartı oluşturma fonksiyonu
function createNoteCard(note, parentList, fileInfo) {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.setAttribute('data-id', note.id);
    noteCard.style.cssText = `
        width: 200px;
        min-height: 150px;
        padding: 15px;
        background-color: ${note.color};
        color: #333;
        border-radius: 5px;
        position: relative;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        transform: rotate(${Math.random() * 4 - 2}deg);
    `;
    
    // Raptiye ikonu
    const pinIcon = document.createElement('div');
    pinIcon.className = 'pin-icon';
    pinIcon.innerHTML = '<i class="fas fa-thumbtack"></i>';
    pinIcon.style.cssText = `
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(0, 0, 0, 0.3);
        font-size: 1.2em;
    `;
    
    // Not içeriği
    const noteContent = document.createElement('div');
    noteContent.className = 'note-content';
    noteContent.textContent = note.text;
    noteContent.style.cssText = `
        margin-top: 15px;
        flex: 1;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
        white-space: pre-wrap;
    `;
    
    // Not düzenleme inputu (başlangıçta gizli)
    const editInput = document.createElement('textarea');
    editInput.className = 'edit-note-input';
    editInput.value = note.text;
    editInput.style.cssText = `
        display: none;
        width: 100%;
        height: 100%;
        padding: 5px;
        margin-top: 15px;
        border: none;
        background-color: transparent;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        resize: none;
        outline: none;
    `;
    
    // Not alt kısmı (tarih ve butonlar)
    const noteFooter = document.createElement('div');
    noteFooter.className = 'note-footer';
    noteFooter.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    `;
    
    // Not tarihi
    const noteDate = document.createElement('div');
    noteDate.className = 'note-date';
    noteDate.textContent = note.date || new Date().toLocaleDateString('tr-TR');
    noteDate.style.cssText = `
        font-size: 11px;
        color: rgba(0, 0, 0, 0.5);
    `;
    
    // Not işlem butonları
    const noteActions = document.createElement('div');
    noteActions.className = 'note-actions';
    noteActions.style.cssText = `
        display: flex;
        gap: 5px;
    `;
    
    // Düzenle butonu
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.style.cssText = `
        background-color: transparent;
        border: none;
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        padding: 2px;
        font-size: 12px;
    `;
    
    // Sil butonu
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.style.cssText = `
        background-color: transparent;
        border: none;
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        padding: 2px;
        font-size: 12px;
    `;
    
    // Kaydet butonu (başlangıçta gizli)
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.innerHTML = '<i class="fas fa-save"></i>';
    saveBtn.style.cssText = `
        display: none;
        background-color: transparent;
        border: none;
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        padding: 2px;
        font-size: 12px;
    `;
    
    // Düzenleme modu
    editBtn.addEventListener('click', () => {
        noteContent.style.display = 'none';
        editInput.style.display = 'block';
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        editInput.focus();
    });
    
    // Kaydetme işlemi
    saveBtn.addEventListener('click', () => {
        if (editInput.value.trim() !== '') {
            // Dosya verilerini al
            const updatedFileData = FileTrackingDB.getFile(fileInfo);
            
            // Not metnini güncelle
            const noteIndex = updatedFileData.notes.findIndex(n => n.id === note.id);
            if (noteIndex !== -1) {
                updatedFileData.notes[noteIndex].text = editInput.value.trim();
                
                // Dosya verilerini kaydet
                FileTrackingDB.saveFile(fileInfo, updatedFileData);
                
                // Görünümü güncelle
                noteContent.textContent = editInput.value.trim();
                noteContent.style.display = 'block';
                editInput.style.display = 'none';
                saveBtn.style.display = 'none';
                editBtn.style.display = 'inline-block';
            }
        }
    });
    
    // Enter tuşu ile kaydetme
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveBtn.click();
        }
    });
    
    // Silme işlemi
    deleteBtn.addEventListener('click', () => {
        // Animasyon efekti
        noteCard.style.opacity = '0';
        noteCard.style.transform = 'scale(0.8) rotate(5deg)';
        noteCard.style.transition = 'all 0.3s';
        
        // Dosya verilerini al
        const updatedFileData = FileTrackingDB.getFile(fileInfo);
        
        // Notu sil
        updatedFileData.notes = updatedFileData.notes.filter(n => n.id !== note.id);
        
        // Dosya verilerini kaydet
        FileTrackingDB.saveFile(fileInfo, updatedFileData);
        
        // DOM'dan kaldır
        setTimeout(() => {
            parentList.removeChild(noteCard);
        }, 300);
    });
    
    // Elementleri birleştir
    noteActions.appendChild(editBtn);
    noteActions.appendChild(saveBtn);
    noteActions.appendChild(deleteBtn);
    
    noteFooter.appendChild(noteDate);
    noteFooter.appendChild(noteActions);
    
    noteCard.appendChild(pinIcon);
    noteCard.appendChild(noteContent);
    noteCard.appendChild(editInput);
    noteCard.appendChild(noteFooter);
    
    return noteCard;
}

// Rastgele renk üreten fonksiyon
function getRandomColor() {
    const colors = [
        '#ffd700', // Sarı
        '#ff9800', // Turuncu
        '#4caf50', // Yeşil
        '#2196f3', // Mavi
        '#9c27b0', // Mor
        '#f48fb1', // Pembe
        '#81d4fa', // Açık Mavi
        '#a5d6a7'  // Açık Yeşil
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
}

// MutationObserver ile popup'ları izle
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.matches('.dx-overlay-content.dx-popup-normal')) {
                    console.log('UYAP Asistan: Dosya Takip - Yeni popup tespit edildi');
                    
                    // UYAP popup'ı tamamen yüklenmesi için biraz daha uzun süre bekleme ekle
                    // Önce hızlı dilekçe butonu eklenecek, sonra biz eklemeyi deneyelim
                    setTimeout(() => {
                        addFileTrackingButton();
                    }, 500); // 500ms geçikmeli çalıştır
                }
            });
        }
    });
});

// Tüm sayfayı izlemeye başla
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Font Awesome kütüphanesini yükle
function loadFontAwesome() {
    if (!document.getElementById('font-awesome-css')) {
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.id = 'font-awesome-css';
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        fontAwesomeLink.integrity = 'sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==';
        fontAwesomeLink.crossOrigin = 'anonymous';
        document.head.appendChild(fontAwesomeLink);
        console.log('Font Awesome yüklendi');
    }
}

// Dosya takip için CSS stillerini yükle
function loadFileTrackingStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .tebligat-table-container {
            margin-top: 20px;
            margin-bottom: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .tebligat-table-container table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        }
        
        .tebligat-table-container th {
            background-color: #343a40;
            color: white;
            font-weight: 600;
            text-align: center;
            padding: 12px 8px;
            font-size: 14px;
            cursor: pointer;
            user-select: none;
        }
        
        .tebligat-table-container th.sortable:hover {
            background-color: #495057;
        }
        
        .tebligat-table-container th i {
            margin-left: 5px;
            font-size: 12px;
        }
        
        .tebligat-table-container td {
            padding: 10px 8px;
            font-size: 13px;
            vertical-align: middle;
        }
        
        .tebligat-table-container tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .tebligat-table-container tbody tr:hover {
            background-color: #e9ecef;
        }
        
        .tebligat-table-container .table-info {
            background-color: #d1ecf1 !important;
        }
        
        .tebligat-table-container .table-info:hover {
            background-color: #bee5eb !important;
        }
        
        .tebligat-table-container h4 {
            color: #495057;
            font-weight: 600;
        }
        
        #tebligat-search {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        
        #tebligat-search:focus {
            border-color: #80bdff;
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        #tebligat-summary {
            font-size: 14px;
        }
        
        #tebligat-summary .badge {
            font-size: 85%;
            padding: 6px 10px;
            border-radius: 4px;
        }
        
        .spinner-border {
            width: 2rem;
            height: 2rem;
        }
    `;
    document.head.appendChild(styleElement);
}

class FileTracking {
    constructor() {
        console.log('UYAP Asistan: File Tracking Manager oluşturuldu');
        
        // Ağ isteklerinden yakalanan dosya ID'lerini dinle
        this.setupDosyaIdListener();
        
        // Dosya takip butonu ekleme işlemini periyodik olarak kontrol et
        setInterval(addFileTrackingButton, 2000);
        
        loadFileTrackingStyles(); // CSS stillerini yükle
    }
    
    // Dosya ID yakalama olayını dinle
    setupDosyaIdListener() {
        window.addEventListener('uyapDosyaIdCaptured', (event) => {
            const { dosyaId, payload, endpoint } = event.detail;
            console.log('UYAP Asistan: Dosya takip - Dosya ID yakalandı:', dosyaId);
            
            // Yakalanan dosyaId'yi sakla
            this.currentDosyaId = dosyaId;
            
            // Gerekirse ek işlemler burada yapılabilir
            if (endpoint.includes('dosya_islem_turleri_sorgula_brd.ajx')) {
                // İşlem türleri sorgulandığında yapılacak işlemler
                this.fetchDosyaDetaylari(dosyaId);
            }
        });
    }
    
    // Dosya detaylarını getir
    async fetchDosyaDetaylari(dosyaId) {
        if (!dosyaId && window.getLatestDosyaId) {
            dosyaId = window.getLatestDosyaId();
        }
        
        if (!dosyaId) {
            console.error('UYAP Asistan: Dosya takip - Dosya ID bulunamadı');
            return;
        }
        
        console.log('UYAP Asistan: Dosya takip - Dosya detayları getiriliyor:', dosyaId);
        
        // window.makeUYAPApiRequest fonksiyonu inject edilmişse kullan
        if (window.makeUYAPApiRequest) {
            try {
                const response = await window.makeUYAPApiRequest('dosyaAyrintiBilgileri_brd.ajx', { dosyaId });
                
                if (response) {
                    console.log('UYAP Asistan: Dosya takip - Dosya detayları:', response);
                    // Burada dosya bilgilerini işleyebilirsiniz
                    
                    // Örnek: Dosya detaylarını localStorage'a kaydet
                    localStorage.setItem('uyap_asistan_dosya_detaylari', JSON.stringify(response));
                }
            } catch (error) {
                console.error('UYAP Asistan: Dosya takip - API isteği hatası:', error);
            }
        } else {
            console.error('UYAP Asistan: Dosya takip - makeUYAPApiRequest fonksiyonu bulunamadı');
        }
    }
    
    // Dosya işlem türlerini getir
    async fetchDosyaIslemTurleri(dosyaId) {
        if (!dosyaId && window.getLatestDosyaId) {
            dosyaId = window.getLatestDosyaId();
        }
        
        if (!dosyaId) {
            console.error('UYAP Asistan: Dosya takip - Dosya ID bulunamadı');
                            return;
        }
        
        console.log('UYAP Asistan: Dosya takip - Dosya işlem türleri getiriliyor:', dosyaId);
        
        // window.makeUYAPApiRequest fonksiyonu inject edilmişse kullan
        if (window.makeUYAPApiRequest) {
            try {
                const response = await window.makeUYAPApiRequest('dosya_islem_turleri_sorgula_brd.ajx', { dosyaId });
                
                if (response) {
                    console.log('UYAP Asistan: Dosya takip - Dosya işlem türleri:', response);
                    // Burada işlem türlerini işleyebilirsiniz
                    
                    // Örnek: İşlem türlerini localStorage'a kaydet
                    localStorage.setItem('uyap_asistan_dosya_islem_turleri', JSON.stringify(response));
                }
            } catch (error) {
                console.error('UYAP Asistan: Dosya takip - API isteği hatası:', error);
            }
        } else {
            console.error('UYAP Asistan: Dosya takip - makeUYAPApiRequest fonksiyonu bulunamadı');
        }
    }
}

export default FileTracking;

function createSchemaView(fileInfo, schemaData) {
    // Timeline infografik container
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'file-tracking-timeline-container';
    timelineContainer.style.cssText = `
        padding: 20px;
        background-color: #f5f7fa;
        border-radius: 10px;
        height: 100%;
        overflow-y: auto;
    `;
    
    // Önce localStorage'da kayıtlı dosya türünü kontrol edip, varsayılan schema'ya ekleyelim
    const savedDosyaTuru = localStorage.getItem('uyap_asistan_dosya_turu');
    if (savedDosyaTuru && !schemaData.dosyaTuru) {
        schemaData.dosyaTuru = savedDosyaTuru;
        console.log('UYAP Asistan: LocalStorage\'dan dosya türü yüklendi:', savedDosyaTuru);
    }
    
    // Dosya türü kontrolü - Talimat dosyası ise mesaj göster ve geri dön
    const dosyaTitle = fileInfo || localStorage.getItem('uyap_asistan_dosya_title') || '';
    if (dosyaTitle.toLowerCase().includes('talimat')) {
        const talimatMesaji = document.createElement('div');
        talimatMesaji.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-size: 1.2em;
            color: #666;
            text-align: center;
            padding: 30px;
        `;
        talimatMesaji.textContent = "Talimat dosyaları için şema görünümü bulunmamaktadır.";
        timelineContainer.appendChild(talimatMesaji);
        return timelineContainer;
    }
    
    // Otomatik güncelleme işlemlerini burada gerçekleştireceğiz
    const updateSchemaFromEvrakList = async () => {
        try {
            console.log('UYAP Asistan: Şema görünümü için evrak listesi kontrol ediliyor...');
            
            // Mevcut dosya ID'sini al
            const currentDosyaId = localStorage.getItem('uyap_asistan_current_dosya_id');
            
            // Dosya ID'si yoksa işlemi durdur
            if (!currentDosyaId) {
                console.log('UYAP Asistan: Güncel dosya ID bulunamadı');
                return;
            }
            
            // Evrak listesini al (önbellek mekanizması getUYAPDocumentList içinde var)
            const response = await getUYAPDocumentList();
            if (!response || response.status !== 200) {
                console.log('UYAP Asistan: Evrak listesi alınamadı, varsayılan şema kullanılıyor');
                return;
            }
            
            const evrakListesi = response;
            
            // Evrak listesini analiz et
            const analiz = analyzeDosyaEvraklari(evrakListesi);
            
            // Analiz sonuçlarını kullanarak şemayı güncelle
            if (analiz) {
                console.log('UYAP Asistan: Evrak analizi tamamlandı');
                
                // SchemaData nesnesini güncelle
                let updatedSchema = {...schemaData};
                
                // Tüm evrakları schema'ya ekle
                updatedSchema.tumEvraklar = analiz.tumEvraklar;
                
                // Popup başlığından dosya türünü tespit et
                const fileTitle = fileInfo || localStorage.getItem('uyap_asistan_dosya_title') || '';
                let dosyaTuru = 'hukuk'; // Varsayılan olarak hukuk davası
                
                if (fileTitle.toLowerCase().includes('ceza')) {
                    dosyaTuru = 'ceza';
                } else if (fileTitle.toLowerCase().includes('icra')) {
                    dosyaTuru = 'icra';
                }
                
                // Eğer evrak analizinden dosya tipi tespit edildiyse, onu kullanalım
                if (analiz.dosyaTipi === 'icra') {
                    dosyaTuru = 'icra';
                    console.log('UYAP Asistan: Evrak analizinden icra dosyası olduğu tespit edildi');
                }
                
                // Yargılama aşamalarını belirle
                const yargilamaAsamalari = belirleYargilamaAsamasi(analiz.tumEvraklar, dosyaTuru);
                updatedSchema.yargilamaAsamalari = yargilamaAsamalari;
                updatedSchema.dosyaTuru = dosyaTuru;
                
                // Eski özel aşama güncellemelerini de koru
                
                // Dava dilekçesi aşaması
                if (analiz.davaDilekcesi) {
                    updatedSchema.mainStage = 'dilekce';
                    updatedSchema.subStage = 'dava_dilekcesi';
                    updatedSchema.davaDilekcesiTarihi = analiz.davaDilekcesi.tarih;
                    updatedSchema.currentDescription = `Dava dilekçesi ${analiz.davaDilekcesi.tarih} tarihinde ${analiz.davaDilekcesi.gonderenKisi} tarafından verilmiştir.`;
                }
                
                // Cevap dilekçesi aşaması
                if (analiz.cevapDilekcesi) {
                    updatedSchema.mainStage = 'dilekce';
                    updatedSchema.subStage = 'cevap_dilekcesi';
                    updatedSchema.cevapDilekcesiTarihi = analiz.cevapDilekcesi.tarih;
                    updatedSchema.currentDescription = `Cevap dilekçesi ${analiz.cevapDilekcesi.tarih} tarihinde ${analiz.cevapDilekcesi.gonderenKisi} tarafından verilmiştir.`;
                }
                
                // Cevaba cevap dilekçesi aşaması
                if (analiz.cevabaCevapDilekcesi) {
                    updatedSchema.mainStage = 'dilekce';
                    updatedSchema.subStage = 'cevaba_cevap_dilekcesi';
                    updatedSchema.cevabaCevapDilekcesiTarihi = analiz.cevabaCevapDilekcesi.tarih;
                    updatedSchema.currentDescription = `Cevaba cevap dilekçesi ${analiz.cevabaCevapDilekcesi.tarih} tarihinde ${analiz.cevabaCevapDilekcesi.gonderenKisi} tarafından verilmiştir.`;
                }
                
                // İkinci cevap dilekçesi aşaması
                if (analiz.ikinciCevapDilekcesi) {
                    updatedSchema.mainStage = 'dilekce';
                    updatedSchema.subStage = 'ikinci_cevap_dilekcesi';
                    updatedSchema.ikinciCevapDilekcesiTarihi = analiz.ikinciCevapDilekcesi.tarih;
                    updatedSchema.currentDescription = `İkinci cevap dilekçesi ${analiz.ikinciCevapDilekcesi.tarih} tarihinde ${analiz.ikinciCevapDilekcesi.gonderenKisi} tarafından verilmiştir.`;
                }
                
                // Güncellenmiş şema verilerini localStorage'a kaydet
                const fileId = fileInfo ? FileTrackingDB.createFileId(fileInfo) : (currentDosyaId || null);
                if (fileId) {
                    const fileData = FileTrackingDB.getFile(fileId);
                    fileData.schema = updatedSchema;
                    FileTrackingDB.saveFile(fileId, fileData);
                    console.log('UYAP Asistan: Şema bilgileri güncellendi ve kaydedildi.');
                }
                
                // Mevcut şema verilerini güncelle ve UI'ı yenile
                schemaData = updatedSchema;
                renderTimeline(updatedSchema);
            }
        } catch (error) {
            console.error('UYAP Asistan: Şema görünümü güncellenirken hata oluştu:', error);
        }
    };
    
    // Evrak listesi güncellendiğinde otomatik olarak şemayı güncelle
    window.addEventListener('uyapEvrakListesiGuncellendi', (event) => {
        console.log('UYAP Asistan: Evrak listesi güncellendiği tespit edildi, şema yenileniyor...');
        updateSchemaFromEvrakList();
    });
    
    // İlk yüklemede evrak listesini al ve şemayı güncelle
    updateSchemaFromEvrakList();
    
    // Timeline içeriğini oluştur ve doldur
    const renderTimeline = (schema) => {
        // İç içeriği temizle
        timelineContainer.innerHTML = '';
        
        // Dosya başlığına göre dosya türünü tekrar kontrol et
        const dosyaTitle = fileInfo || localStorage.getItem('uyap_asistan_dosya_title') || '';
        if (dosyaTitle.toLowerCase().includes('icra')) {
            schema.dosyaTuru = 'icra';
            console.log('UYAP Asistan: Dosya başlığından icra dosyası olduğu tespit edildi');
        } else if (dosyaTitle.toLowerCase().includes('ceza')) {
            schema.dosyaTuru = 'ceza';
        }
        
        // Aşama bilgisi üst kısmı ekle
        if (schema.yargilamaAsamalari && schema.yargilamaAsamalari.tamamlananAsamalar) {
            const asamaContainer = document.createElement('div');
            asamaContainer.className = 'yargılama-asamalari-container';
            asamaContainer.style.cssText = `
                padding: 20px;
        background-color: #fff;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;
            
            // Dosya Türü Bilgisi
            const dosyaTuruBaslik = document.createElement('div');
            dosyaTuruBaslik.style.cssText = `
                font-size: 1.1em;
                font-weight: bold;
                color: #3498db;
                margin-bottom: 15px;
            `;
            dosyaTuruBaslik.textContent = schema.dosyaTuru === 'ceza' ? 
                'Ceza Dava Dosyası Aşamaları' : 
                (schema.dosyaTuru === 'icra' ? 'İcra Dosyası Aşamaları' : 'Hukuk Dava Dosyası Aşamaları');
            asamaContainer.appendChild(dosyaTuruBaslik);
            
            // Aşamalar listesi
            const asamalarFlexContainer = document.createElement('div');
            asamalarFlexContainer.style.cssText = `
        display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                flex-wrap: wrap;
            `;
            
            // Aşama kutuları oluştur
            const asamaKutulari = oluşturAsamaKutulari(schema);
            asamaKutulari.forEach(kutu => {
                asamalarFlexContainer.appendChild(kutu);
            });
            
            asamaContainer.appendChild(asamalarFlexContainer);
            
            // Aktif Aşama bilgisi ve ilerleme çubuğu kaldırıldı
            
            timelineContainer.appendChild(asamaContainer);
        }
        
        // Timeline infografik oluştur
        const timelineTrack = document.createElement('div');
        timelineTrack.className = 'timeline-track';
        timelineTrack.style.cssText = `
                            position: relative;
            margin: 30px auto;
            width: 90%;
            padding: 20px 0;
        `;
        
        // Timeline arkaplan çizgisi
        const timelineLine = document.createElement('div');
        timelineLine.className = 'timeline-line';
        timelineLine.style.cssText = `
        position: absolute;
            top: 0;
            bottom: 0;
        left: 50%;
            width: 4px;
            margin-left: -2px;
            background-color: #ddd;
        z-index: 1;
    `;
        timelineTrack.appendChild(timelineLine);
        
        // Eğer evraklar yoksa bilgi mesajı göster
        if (!schema.tumEvraklar || schema.tumEvraklar.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.cssText = `
                                text-align: center;
                color: #7f8c8d;
                                font-style: italic;
                padding: 20px;
            `;
            emptyMessage.textContent = 'Bu dosya için henüz evrak bulunmamaktadır.';
            timelineContainer.appendChild(emptyMessage);
        } else {
            // Tüm evrakları tarihe göre sırala (yeniden eskiye)
            schema.tumEvraklar.sort((a, b) => {
                // Daha güvenli tarih karşılaştırması
                const tarihA = parseTarih(a.tarih);
                const tarihB = parseTarih(b.tarih);
                
                // Yeniden eskiye sırala (en yeni tarih üstte)
                return tarihB - tarihA;
            });
            
            // Tüm evraklar için timeline node'ları oluştur
            schema.tumEvraklar.forEach((evrak, index) => {
                const position = index % 2 === 0 ? 'left' : 'right';
                
                const stageNode = document.createElement('div');
                stageNode.className = `timeline-node ${position}`;
                stageNode.style.cssText = `
                                position: relative;
                    margin: 40px 0;
                    ${position === 'left' ? 'padding-right: 50%;' : 'padding-left: 50%;'}
                    clear: both;
                `;
                
                // Evrak türüne göre stil belirleme
                let isHighlighted = false;
                let badgeColor = '#95a5a6'; // Varsayılan gri renk
                
                const turLower = evrak.tur.toLowerCase();
                if (turLower.includes('dava dilekçesi')) {
                    isHighlighted = true;
                    badgeColor = '#3498db'; // Mavi
                } else if (turLower.includes('cevap dilekçesi') && !turLower.includes('cevaba')) {
                    isHighlighted = true;
                    badgeColor = '#2ecc71'; // Yeşil
                } else if (turLower.includes('cevaba cevap')) {
                    isHighlighted = true;
                    badgeColor = '#e74c3c'; // Kırmızı
                } else if (turLower.includes('ikinci cevap')) {
                    isHighlighted = true;
                    badgeColor = '#f39c12'; // Turuncu
                } else if (turLower.includes('dilekçe')) {
                    badgeColor = '#9b59b6'; // Mor
                } else if (turLower.includes('karar')) {
                    isHighlighted = true;
                    badgeColor = '#34495e'; // Koyu gri/mavi
                } else if (turLower.includes('duruşma')) {
                    isHighlighted = true;
                    badgeColor = '#e67e22'; // Koyu turuncu
                } else if (turLower.includes('iddianame')) {
                    isHighlighted = true;
                    badgeColor = '#c0392b'; // Kırmızı
                } else if (turLower.includes('bilirkişi')) {
                    isHighlighted = true;
                    badgeColor = '#16a085'; // Turkuaz
                }
                
                // Node içeriği
                const content = document.createElement('div');
                content.className = `timeline-content ${isHighlighted ? 'highlighted' : ''}`;
                content.style.cssText = `
                    position: relative;
                    padding: 15px;
                    background-color: ${isHighlighted ? '#f8f9fa' : 'white'};
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border: 1px solid ${isHighlighted ? badgeColor : '#ddd'};
                    ${position === 'left' ? 'margin-right: 30px;' : 'margin-left: 30px;'}
            transition: all 0.3s ease;
        `;
        
                // Başlık
                const nodeTitle = document.createElement('h4');
                nodeTitle.style.cssText = `
                    margin: 0 0 10px 0;
                    color: #2c3e50;
                    font-size: 1.1em;
                `;
                nodeTitle.textContent = evrak.tur;
                
                // Gönderen kişi
                const sender = document.createElement('p');
                sender.style.cssText = `
                    margin: 0 0 5px 0;
                    color: #7f8c8d;
                    font-size: 0.9em;
                    line-height: 1.4;
                `;
                sender.textContent = `Gönderen: ${evrak.gonderenKisi}`;
                
                // Tarih 
                const date = document.createElement('div');
                date.style.cssText = `
                    margin-top: 5px;
                    color: #95a5a6;
                    font-size: 0.8em;
                    font-weight: bold;
                `;
                
                // Tarih formatlama
                try {
                    // Yeni parseTarih fonksiyonu ile tarih değerini işle
                    const tarihObj = parseTarih(evrak.tarih);
                    
                    // Tarih geçerli mi kontrol et
                    if (isNaN(tarihObj.getTime())) {
                        // Geçersiz tarih, uyarı göster
                        console.warn('UYAP Asistan: Geçersiz tarih formatı:', evrak.tarih);
                        date.textContent = evrak.tarih || 'Tarih bilgisi yok';
                    } else {
                        // Tüm evraklar için sadece tarih bilgisi göster, saat gösterme
                        const formatOptions = {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        };
                        
                        const formatlananTarih = new Intl.DateTimeFormat('tr-TR', formatOptions).format(tarihObj);
                        date.textContent = formatlananTarih;
                    }
                } catch (error) {
                    console.error('UYAP Asistan: Tarih formatlarken hata:', error, evrak);
                    // Hata durumunda basit format kullan
                    date.textContent = evrak.tarih || 'Tarih bilgisi yok';
                }
                
                // Tip rozeti
                const badge = document.createElement('div');
                badge.style.cssText = `
                    position: absolute;
                    top: -10px;
                    ${position === 'left' ? 'right' : 'left'}: -10px;
                    background-color: ${badgeColor};
                                color: white;
                    padding: 3px 8px;
                    border-radius: 10px;
                    font-size: 0.7em;
                    text-transform: uppercase;
                `;
                
                // Evrak türüne göre rozet metni
                let badgeText = "Evrak";
                if (turLower.includes('dilekçe')) badgeText = "Dilekçe";
                if (turLower.includes('karar')) badgeText = "Karar";
                if (turLower.includes('duruşma')) badgeText = "Duruşma";
                if (turLower.includes('bilirkişi')) badgeText = "Bilirkişi";
                if (turLower.includes('tebligat')) badgeText = "Tebligat";
                if (turLower.includes('iddianame')) badgeText = "İddianame";
                
                badge.textContent = badgeText;
                
                // Node noktası
                const nodePoint = document.createElement('div');
                nodePoint.className = 'timeline-node-point';
                nodePoint.style.cssText = `
                                position: absolute;
                                top: 50%;
                    ${position === 'left' ? 'right: calc(50% - 12px);' : 'left: calc(50% - 12px);'}
                    width: 16px;
                    height: 16px;
                    margin-top: -8px;
                    border-radius: 50%;
                    background-color: ${badgeColor};
                                z-index: 2;
                    box-shadow: 0 0 0 4px rgba(149, 165, 166, 0.2);
                `;
                
                // İçeriği birleştir
                content.appendChild(nodeTitle);
                content.appendChild(sender);
                content.appendChild(date);
                content.appendChild(badge);
                stageNode.appendChild(content);
                stageNode.appendChild(nodePoint);
                timelineTrack.appendChild(stageNode);
            });
        }
        
        // Timeline'ı container'a ekle
        timelineContainer.appendChild(timelineTrack);
    };
    
    // Yargılama aşaması kutularını oluşturan fonksiyon
    function oluşturAsamaKutulari(schema) {
        const kutular = [];
        
        // Tamamlanan aşamaları tespit et
        const tamamlananlar = schema.yargilamaAsamalari ? 
            schema.yargilamaAsamalari.tamamlananAsamalar.map(a => a.ad) : [];
        
        // Hüküm aşamasının tamamlanıp tamamlanmadığını kontrol et
        const hukumTamamlandi = tamamlananlar.includes('Hüküm');
        // Satış aşamasının tamamlanıp tamamlanmadığını kontrol et (icra dosyaları için)
        const satisTamamlandi = tamamlananlar.includes('Satış');
        
        // En son hangi aşamanın tamamlandığını bul (indeks olarak)
        let sonTamamlananAsamaIndeksi = -1;

        // İcra Dosyası için aşamalar
        if (schema.dosyaTuru === 'icra') {
            const asamalar = [
                { id: 'takip_talebi', label: 'Takip Talebi' },
                { id: 'odeme_emri', label: 'Ödeme Emri' },
                { id: 'takinbin_kesinlesmesi', label: 'Takibin kesinleşmesi' },
                { id: 'haciz', label: 'Haciz' },
                { id: 'satis', label: 'Satış' }
            ];
            
            // Tamamlanmış olan en son aşamanın indeksini bul
            for (let i = asamalar.length - 1; i >= 0; i--) {
                if (tamamlananlar.includes(asamalar[i].label)) {
                    sonTamamlananAsamaIndeksi = i;
                    break;
                }
            }
            
            asamalar.forEach((asama, index) => {
                const kutu = document.createElement('div');
                kutu.className = 'asama-kutusu';
                kutu.style.cssText = `
                    flex: 1;
                    min-width: 100px;
                    margin: 0 5px;
                    text-align: center;
                    position: relative;
                `;
                
                // Aşama tamamlandı mı?
                // 1. Satış tamamlandıysa tüm aşamalar tamamlanmıştır
                // 2. Mevcut indeks, son tamamlanan aşama indeksinden küçük veya eşitse tamamlanmıştır
                // 3. Aşama adı tamamlananlar listesinde varsa tamamlanmıştır
                const asamaTamamlandi = satisTamamlandi || 
                    index <= sonTamamlananAsamaIndeksi || 
                    tamamlananlar.includes(asama.label);
                
                // Asama numarası
                const asamaNo = document.createElement('div');
                asamaNo.className = 'asama-no';
                asamaNo.style.cssText = `
                    width: 30px;
                    height: 30px;
                    margin: 0 auto 10px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: ${asamaTamamlandi ? '#2ecc71' : '#bdc3c7'};
                    color: white;
                    font-weight: bold;
                    position: relative;
                    z-index: 2;
                `;
                asamaNo.textContent = (index + 1).toString();
                
                // Aşama başlığı
                const asamaBaslik = document.createElement('div');
                asamaBaslik.className = 'asama-baslik';
                asamaBaslik.style.cssText = `
                    font-size: 0.8em;
                    font-weight: ${asamaTamamlandi ? 'bold' : 'normal'};
                    color: ${asamaTamamlandi ? '#2c3e50' : '#7f8c8d'};
                `;
                asamaBaslik.textContent = asama.label;
                
                // Aşama çizgisi (kutular arası bağlantı) - son kutu hariç hepsine ekle
                if (index < asamalar.length - 1) {
                    const asamaCizgisi = document.createElement('div');
                    asamaCizgisi.className = 'asama-cizgisi';
                    asamaCizgisi.style.cssText = `
                        position: absolute;
                        top: 15px;
                        left: 50%;
                        width: 100%;
                        height: 2px;
                        background-color: ${asamaTamamlandi && (index < sonTamamlananAsamaIndeksi || satisTamamlandi) ? '#2ecc71' : '#bdc3c7'};
                        z-index: 1;
                    `;
                    kutu.appendChild(asamaCizgisi);
                }
                
                kutu.appendChild(asamaNo);
                kutu.appendChild(asamaBaslik);
                kutular.push(kutu);
            });
        } 
        // Hukuk Dava Dosyası için aşamalar
        else if (schema.dosyaTuru === 'hukuk') {
            const asamalar = [
                { id: 'dilekce', label: 'Dilekçeler Teatisi' },
                { id: 'oninceleme', label: 'Ön İnceleme' },
                { id: 'tahkikat', label: 'Tahkikat' },
                { id: 'sozlu', label: 'Sözlü Yargılama' },
                { id: 'hukum', label: 'Hüküm' }
            ];
            
            // Tamamlanmış olan en son aşamanın indeksini bul
            for (let i = asamalar.length - 1; i >= 0; i--) {
                if (tamamlananlar.includes(asamalar[i].label)) {
                    sonTamamlananAsamaIndeksi = i;
                    break;
                }
            }
            
            asamalar.forEach((asama, index) => {
                const kutu = document.createElement('div');
                kutu.className = 'asama-kutusu';
                kutu.style.cssText = `
                    flex: 1;
                    min-width: 100px;
                    margin: 0 5px;
                                text-align: center;
                    position: relative;
                `;
                
                // Aşama tamamlandı mı?
                // 1. Hüküm tamamlandıysa tüm aşamalar tamamlanmıştır
                // 2. Mevcut indeks, son tamamlanan aşama indeksinden küçük veya eşitse tamamlanmıştır
                // 3. Aşama adı tamamlananlar listesinde varsa tamamlanmıştır
                const asamaTamamlandi = hukumTamamlandi || 
                    index <= sonTamamlananAsamaIndeksi || 
                    tamamlananlar.includes(asama.label);
                
                // Asama numarası
                const asamaNo = document.createElement('div');
                asamaNo.className = 'asama-no';
                asamaNo.style.cssText = `
                    width: 30px;
                    height: 30px;
                    margin: 0 auto 10px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: ${asamaTamamlandi ? '#2ecc71' : '#bdc3c7'};
                    color: white;
                    font-weight: bold;
                    position: relative;
                    z-index: 2;
                `;
                asamaNo.textContent = (index + 1).toString();
                
                // Aşama başlığı
                const asamaBaslik = document.createElement('div');
                asamaBaslik.className = 'asama-baslik';
                asamaBaslik.style.cssText = `
                    font-size: 0.8em;
                    font-weight: ${asamaTamamlandi ? 'bold' : 'normal'};
                    color: ${asamaTamamlandi ? '#2c3e50' : '#7f8c8d'};
                `;
                asamaBaslik.textContent = asama.label;
                
                // Aşama çizgisi (kutular arası bağlantı) - son kutu hariç hepsine ekle
                if (index < asamalar.length - 1) {
                    const asamaCizgisi = document.createElement('div');
                    asamaCizgisi.className = 'asama-cizgisi';
                    asamaCizgisi.style.cssText = `
                            position: absolute;
                        top: 15px;
                        left: 50%;
                        width: 100%;
                        height: 2px;
                        background-color: ${asamaTamamlandi && (index < sonTamamlananAsamaIndeksi || hukumTamamlandi) ? '#2ecc71' : '#bdc3c7'};
                        z-index: 1;
                    `;
                    kutu.appendChild(asamaCizgisi);
                }
                
                kutu.appendChild(asamaNo);
                kutu.appendChild(asamaBaslik);
                kutular.push(kutu);
            });
        } 
        // Ceza Dava Dosyası için aşamalar
        else if (schema.dosyaTuru === 'ceza') {
            const asamalar = [
                { id: 'sorusturma', label: 'Soruşturma' },
                { id: 'kovusturma', label: 'Kovuşturma' },
                { id: 'hukum', label: 'Hüküm' }
            ];
            
            // Tamamlanmış olan en son aşamanın indeksini bul
            for (let i = asamalar.length - 1; i >= 0; i--) {
                if (tamamlananlar.includes(asamalar[i].label)) {
                    sonTamamlananAsamaIndeksi = i;
                    break;
                }
            }
            
            asamalar.forEach((asama, index) => {
                const kutu = document.createElement('div');
                kutu.className = 'asama-kutusu';
                kutu.style.cssText = `
                    flex: 1;
                    min-width: 100px;
                    margin: 0 5px;
                                text-align: center;
                    position: relative;
                `;
                
                // Aşama tamamlandı mı?
                // 1. Hüküm tamamlandıysa tüm aşamalar tamamlanmıştır
                // 2. Mevcut indeks, son tamamlanan aşama indeksinden küçük veya eşitse tamamlanmıştır 
                // 3. Aşama adı tamamlananlar listesinde varsa tamamlanmıştır
                const asamaTamamlandi = hukumTamamlandi || 
                    index <= sonTamamlananAsamaIndeksi || 
                    tamamlananlar.includes(asama.label);
                
                // Asama numarası
                const asamaNo = document.createElement('div');
                asamaNo.className = 'asama-no';
                asamaNo.style.cssText = `
                    width: 30px;
                    height: 30px;
                    margin: 0 auto 10px auto;
                            display: flex;
                            align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: ${asamaTamamlandi ? '#2ecc71' : '#bdc3c7'};
                    color: white;
                    font-weight: bold;
                    position: relative;
                    z-index: 2;
                `;
                asamaNo.textContent = (index + 1).toString();
                
                // Aşama başlığı
                const asamaBaslik = document.createElement('div');
                asamaBaslik.className = 'asama-baslik';
                asamaBaslik.style.cssText = `
                    font-size: 0.8em;
                    font-weight: ${asamaTamamlandi ? 'bold' : 'normal'};
                    color: ${asamaTamamlandi ? '#2c3e50' : '#7f8c8d'};
                `;
                asamaBaslik.textContent = asama.label;
                
                // Aşama çizgisi (kutular arası bağlantı) - son kutu hariç hepsine ekle
                if (index < asamalar.length - 1) {
                    const asamaCizgisi = document.createElement('div');
                    asamaCizgisi.className = 'asama-cizgisi';
                    asamaCizgisi.style.cssText = `
                                position: absolute;
                        top: 15px;
                        left: 50%;
                        width: 100%;
                        height: 2px;
                        background-color: ${asamaTamamlandi && (index < sonTamamlananAsamaIndeksi || hukumTamamlandi) ? '#2ecc71' : '#bdc3c7'};
                                z-index: 1;
                            `;
                    kutu.appendChild(asamaCizgisi);
                }
                
                kutu.appendChild(asamaNo);
                kutu.appendChild(asamaBaslik);
                kutular.push(kutu);
            });
        }
        
        return kutular;
    }
    
    // İlk kez timeline'ı render et
    renderTimeline(schemaData);
    
    return timelineContainer;
}

// UYAP Dosya Evrak Listesi için yardımcı fonksiyon
async function getUYAPDocumentList() {
    const dosyaId = localStorage.getItem('uyap_asistan_dosya_id');
    
    if (!dosyaId) {
        console.log('UYAP Asistan: Dosya ID bulunamadı, evrak listesi alınamıyor');
        return null;
    }
    
    // Önbellek kontrolü - son alınan veriyi ve zamanı kontrol et
    const cachedData = localStorage.getItem('uyap_asistan_evrak_listesi');
    const cachedTime = localStorage.getItem('uyap_asistan_evrak_listesi_zaman');
    const currentTime = new Date().getTime();
    
    // Dosya değişimi kontrolü - her dosya için kendi ID'sine özel bir veri saklanmalı
    const cachedDosyaId = localStorage.getItem('uyap_asistan_cached_dosya_id');
    
    // Eğer önbellekteki dosya ID'si mevcut dosya ID'si ile aynı değilse
    // bu farklı bir dosya demektir, yeni istek yapılmalı
    if (cachedDosyaId !== dosyaId) {
        console.log('UYAP Asistan: Farklı bir dosyaya geçildi, yeni istek yapılıyor...');
        localStorage.removeItem('uyap_asistan_evrak_listesi');
        localStorage.removeItem('uyap_asistan_evrak_listesi_zaman');
    }
    // Aynı dosya için belirli bir süre geçmemişse ve önbellekte veri varsa kullan
    else if (cachedData && cachedTime && (currentTime - parseInt(cachedTime) < 30 * 1000)) { // 30 saniye
        console.log('UYAP Asistan: Aynı dosya için son 30 saniye içinde alınmış veri kullanılıyor');
        return JSON.parse(cachedData);
    }
    
    // İstek sayacı kaldırıldı - her zaman yeni istek yapılacak
    
    try {
        console.log('UYAP Asistan: Evrak listesi için sunucuya istek yapılıyor...');
        const response = await fetch('https://avukatbeta.uyap.gov.tr/list_dosya_evraklar.ajx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dosyaId: dosyaId
            }),
            credentials: 'include' // Include cookies for authentication
        });
        
        const data = await response.json();
        console.log('UYAP Asistan: Evrak listesi alındı');
        
        // Cache the document list for quick access
        if (data && data.status === 200) {
            localStorage.setItem('uyap_asistan_evrak_listesi', JSON.stringify(data));
            localStorage.setItem('uyap_asistan_evrak_listesi_zaman', currentTime.toString());
            localStorage.setItem('uyap_asistan_cached_dosya_id', dosyaId);
            
            // Dispatch an event so other parts of the extension can listen
            window.dispatchEvent(new CustomEvent('uyapEvrakListesiGuncellendi', {
                detail: {
                    evrakListesi: data
                }
            }));
        }
        
        return data;
    } catch (error) {
        console.error('UYAP Asistan: Evrak listesi alınırken hata:', error);
        
        // Hata durumunda önbellekteki veriyi kullan
        if (cachedData && cachedDosyaId === dosyaId) {
            console.log('UYAP Asistan: Hata oluştu, aynı dosya için önbellekteki veri kullanılıyor');
            return JSON.parse(cachedData);
        }
        
        return null;
    }
}

// UYAP Evrak Analizi için yardımcı fonksiyon
function analyzeDosyaEvraklari(evrakListesi) {
    if (!evrakListesi || !evrakListesi.tumEvraklar) {
        return null;
    }
    
    // Timeline'da gösterilmeyecek evrak türleri
    const filtrelenenEvrakTurleri = [
        'Reddiyat Makbuzu',
        'Reddiyat Fişi',
        'Reddiyat Banka Ödeme Dekontu',
        'Reddiyat Fişi (Posta Reddiyat)',
        'Kapalı E-Tebliğ Mazbatası',
        'Vekaletname',
        'Vekalet Pulu Makbuzu',
        'Sayman Mutemet Alındısı',
        'Görevsizlik/Yetkisizlik/Gönderme Kararı Nedeniyle Dosyanın Gönderilmesi Üst Yazısı',
        'Kapalı Tebligat',
        'Bilirkişi Teslim Tutanağı',
        'Tevzi Formu',
        'Bilirkişi Teslim Tutanağı (İmzalı)',
        'Beyan Dilekçesi',
        'Tahsilat Makbuzu',
        'Tahsilat Fişi',
        'Mazeret Dilekçesi',
        'Dosyaya Eklenecek Evrak',
        'Genel Müzekkere',
        'Süre Uzatım Dilekçesi',
        'Talep Evrakı',
        'Ara Karar Evrakı',
        'Taşra Diğer Evraklar',
        'Hukuk Genel Tutanak',
        'Nüfus Kayıt Örnegi',
        'Açık Tebligat',
        'Açık E-Tebliğ Mazbatası',
        'Tebliğ Mazbatası',
        'Talimat Sonuç Evrakı',
        'Harç Tahsil Müzekkeresi',
        'Bam Dosya Gönderme Kontrol Formu',
        'Sarf Kararı',
        'E-Duruşma Talebi',
        'Vekillikten Çekilme Dilekçesi',
        'Talimat Gönderme Yazısı',
        'Talimat Tensip Zaptı',
        'Cumhuriyet Savcılığından Sosyal ve Ekonomik Durumun Araştırılması Yazısı',
        'Talimat Üst Yazısı',
        'Talimat Eksik Masraf Yazısı',
        'İhzar müzekkeresi (tanıklar için)',
        'Müzekkere Cevabı',
        'Avukat Mazeret Bildirimi',
        'Talimat Duruşma Zaptı',
        'Eksik Masraf Bildirim Yazısı',
        'Bankalardan Cevap Yazıları',
        'Hazırlık Dosyası Gelen Evrak',
        'Talimat Sonuç Yazısı',
        'Mahkemeden Yakalama Talebi',
        'Yakalama Emri',
        'Yakalama Kararı',
        'Yakalamanın İnfazen Gönderilmesi Müzekkeresi',
        'Adli Sicil Sabıka Kaydı',
        'Gelen Talimat İsteği Yazısı',
        'Talimat Gelen Evrak',
        'Talimat Dosyasının Emniyete Gönderilmesi',
        'Hedef Süre Formu',
        'Diğer Evrak',
        'Dava Açılış Formu',
        'Kişinin Sosyal ve Mali Durumunun Araştırılması Müzekkeresi',
        'Kurum ve Kuruluşlardan Gelen Cevap Yazısı',
        'Sanığın Tutukluluk Halinin Devamına İlişkin Mahkeme Ara Kararı',
        'Mahkemeden Tutuklama Talebi',
        'Tutuklama Müzekkeresi',
        'Tutuklunun Cezaevine Gönderme Müzekkeresi',
        'Tutukluluğa İtirazın Değerlendirilmesi Kararı',
        'Fotoğraf Teşhis Tutanağı',
        'Adli Tıptan Rapor Talebi',
        'Görüldü Evrakı',
        'Genel Karar/Müzekkere',
        'İddianamenin Kabul Kararı',
        'Talimat İfade Tutanağı',
        'Tutanak',
        'Resen Adli Kontrol Kaldırma Kararı',
        'Vekillikten Azil Dilekçesi',
        'Savcılık Zaptolunan Eşya Makbuzu',
        'Tahliye Müzekkeresi',
        'Soruşturma Dosyası İçin Birleştirme Kararı',
        'Diğer Değişik İş Talebi',
        'El Koymanın Onanması Kararı',
        'Dava Dosyasından, Yakalanan Şahsın Mahkemeye Sevki(CMK 199)',
        'Sanığa İddianamenin Tebliğ Müzekkeresi',
        'Tahsilat makbuzu',
        'İcra Dairesi Genel Yazı',
        'Masraf Makbuzu',
        'Reddiyat makbuzu',
        'Reddiyat Beyanı',
        'Avukat Portal Genel Talebi',
        'SGK Hizmet Dökümü Raporu',
        'Başka Suçtan Tutuklu Celbi Müzekkeresi',
        'Başka Savcılıktan Fezleke',
        'SGK Bilgi Evrak',
        'Cezaevi Harcı Makbuzu',
        'Bankadan Gelen Cevap Yazısı',
        'Dosya Alacağına Haciz Silme Evrakı',
        'Dosya İsteme',
        'Dosyanın Birime Gönderilmesi',
    ];
    
    const sonuclar = {
        davaDilekcesi: null,
        cevapDilekcesi: null,
        cevabaCevapDilekcesi: null,
        ikinciCevapDilekcesi: null,
        tumEvraklar: [], // Tüm evraklar kronolojik sırayla burada saklanacak
        dosyaTipi: 'hukuk' // Varsayılan dosya tipi
    };
    
    // İcra dosyası evrak tipleri için belirteçler
    let takipTalebiVar = false;
    let odemeEmriVar = false;
    let hacizVar = false;
    let icraEvrakiVar = false;
    
    // Tüm dosya anahtarlarını döngüyle gez (dosya numaralarına göre gruplandırılmış)
    Object.keys(evrakListesi.tumEvraklar).forEach(dosyaKey => {
        const evraklar = evrakListesi.tumEvraklar[dosyaKey];
        
        // Her bir evrakı kontrol et
        evraklar.forEach(evrak => {
            const turLower = evrak.tur.toLowerCase();
            const tarih = evrak.sistemeGonderildigiTarih;
            
            // İcra dosyası evrak tiplerini kontrol et
            if (turLower.includes('takip talebi')) {
                takipTalebiVar = true;
            }
            if (turLower.includes('ödeme emri') || turLower.includes('ödeme icra emri')) {
                odemeEmriVar = true;
            }
            if (turLower.includes('haciz')) {
                hacizVar = true;
            }
            // Genel olarak icra dosyası evrakı olup olmadığını kontrol et
            if (turLower.includes('icra') || 
                turLower.includes('haciz') || 
                turLower.includes('takip') || 
                turLower.includes('satış') || 
                turLower.includes('ödeme emri') ||
                turLower.includes('icra müdürlüğü') ||
                turLower.includes('alacaklı') ||
                turLower.includes('borçlu')) {
                icraEvrakiVar = true;
            }
            
            // Filtrelenen evrak türlerini kontrol et
            if (!filtrelenenEvrakTurleri.some(filtre => evrak.tur.includes(filtre))) {
                // Filtrelenmemiş evrakları listeye ekle
                sonuclar.tumEvraklar.push({
                    evrakId: evrak.evrakId,
                    ggEvrakId: evrak.ggEvrakId,
                    dosyaId: evrak.dosyaId,
                    tur: evrak.tur,
                    gonderenKisi: evrak.gonderenYerKisi,
                    tarih: tarih
                });
            }
            
            // Önceki sınıflandırmayı da koru
            if (turLower.includes('dava dilekçesi')) {
                if (!sonuclar.davaDilekcesi || new Date(tarih) < new Date(sonuclar.davaDilekcesi.tarih)) {
                    sonuclar.davaDilekcesi = {
                        evrakId: evrak.evrakId,
                        ggEvrakId: evrak.ggEvrakId,
                        dosyaId: evrak.dosyaId,
                        tur: evrak.tur,
                        gonderenKisi: evrak.gonderenYerKisi,
                        tarih: tarih
                    };
                }
            } else if (turLower.includes('cevap dilekçesi') && !turLower.includes('cevaba')) {
                if (!sonuclar.cevapDilekcesi || new Date(tarih) < new Date(sonuclar.cevapDilekcesi.tarih)) {
                    sonuclar.cevapDilekcesi = {
                        evrakId: evrak.evrakId,
                        ggEvrakId: evrak.ggEvrakId,
                        dosyaId: evrak.dosyaId,
                        tur: evrak.tur,
                        gonderenKisi: evrak.gonderenYerKisi,
                        tarih: tarih
                    };
                }
            } else if (turLower.includes('cevaba cevap')) {
                if (!sonuclar.cevabaCevapDilekcesi || new Date(tarih) < new Date(sonuclar.cevabaCevapDilekcesi.tarih)) {
                    sonuclar.cevabaCevapDilekcesi = {
                        evrakId: evrak.evrakId,
                        ggEvrakId: evrak.ggEvrakId,
                        dosyaId: evrak.dosyaId,
                        tur: evrak.tur,
                        gonderenKisi: evrak.gonderenYerKisi,
                        tarih: tarih
                    };
                }
            } else if (turLower.includes('ikinci cevap')) {
                if (!sonuclar.ikinciCevapDilekcesi || new Date(tarih) < new Date(sonuclar.ikinciCevapDilekcesi.tarih)) {
                    sonuclar.ikinciCevapDilekcesi = {
                        evrakId: evrak.evrakId,
                        ggEvrakId: evrak.ggEvrakId,
                        dosyaId: evrak.dosyaId,
                        tur: evrak.tur,
                        gonderenKisi: evrak.gonderenYerKisi,
                        tarih: tarih
                    };
                }
            }
        });
    });
    
    // İcra dosyası olup olmadığını belirle
    if (takipTalebiVar || odemeEmriVar || hacizVar || icraEvrakiVar) {
        sonuclar.dosyaTipi = 'icra';
        console.log('UYAP Asistan: Evrak içeriklerine göre icra dosyası olduğu tespit edildi');
    }
    
    // Tüm evrakları zamana göre sırala (eskiden yeniye)
    sonuclar.tumEvraklar.sort((a, b) => {
        return parseTarih(a.tarih) - parseTarih(b.tarih);
    });
    
    return sonuclar;
}

// Takvim tarihi formatına çeviren yardımcı fonksiyon
function parseTarih(tarihStr) {
    if (!tarihStr) return new Date(0); // Geçersiz tarih durumunda en eski tarih
    
    try {
        // Tarih formatını kontrol et
        if (tarihStr.includes('/')) {
            // Format: dd/MM/yyyy HH:mm:ss olabilir
            const [tarihKismi, saatKismi] = tarihStr.split(' ');
            const [gun, ay, yil] = tarihKismi.split('/');
            
            if (gun && ay && yil) {
                // Ay değeri 0-11 arasında olmalı, bu yüzden 1 eksiltiyoruz
                return new Date(parseInt(yil), parseInt(ay) - 1, parseInt(gun), 
                    saatKismi ? parseInt(saatKismi.split(':')[0]) || 0 : 0,
                    saatKismi ? parseInt(saatKismi.split(':')[1]) || 0 : 0);
            }
        } else if (tarihStr.includes('-')) {
            // Format: yyyy-MM-dd HH:mm:ss olabilir
            return new Date(tarihStr);
        } 
        
        // Diğer formatlar için standart Date constructor'ı dene
        return new Date(tarihStr);
    } catch (error) {
        console.error('UYAP Asistan: Tarih ayrıştırma hatası:', error, tarihStr);
        return new Date(0); // Hata durumunda en eski tarih
    }
}

// Dosyanın hangi yargılama aşamasında olduğunu belirleyen fonksiyon
function belirleYargilamaAsamasi(evrakListesi, dosyaTuru) {
    const tamamlananAsamalar = [];
    const siradakiAsama = {ad: '', tamamlanma: 0};
    
    // Tarih sıralı evrak listesi oluştur (eskiden yeniye)
    const siraliEvraklar = [...evrakListesi].sort((a, b) => {
        const tarihA = parseTarih(a.tarih);
        const tarihB = parseTarih(b.tarih);
        return tarihA - tarihB;
    });
    
    // Evrak türlerini kontrol et
    const evrakTurleri = siraliEvraklar.map(evrak => evrak.tur.toLowerCase());
    
    // İcra Dosyası için aşamalar
    if (dosyaTuru === 'icra') {
        // Temel kriterleri belirle
        const takipTalebiVar = evrakTurleri.some(tur => tur.includes('takip talebi'));
        const odemeEmriVar = evrakTurleri.some(tur => tur.includes('ödeme icra emri') || tur.includes('ödeme emri'));
        const hacizVar = evrakTurleri.some(tur => tur.includes('haciz'));
        const satisVar = evrakTurleri.some(tur => tur.includes('satış'));
        const kesinlesmeVar = takipTalebiVar && odemeEmriVar;
        
        // Mevcut aşamayı belirle
        let mevcutAsama = '';
        if (satisVar) {
            mevcutAsama = 'Satış';
        } else if (hacizVar) {
            mevcutAsama = 'Haciz';
        } else if (kesinlesmeVar) {
            mevcutAsama = 'Takibin kesinleşmesi';
        } else if (odemeEmriVar) {
            mevcutAsama = 'Ödeme Emri';
        } else if (takipTalebiVar) {
            mevcutAsama = 'Takip Talebi';
        }
        
        // Aşamaları ve tamamlanma durumlarını ekle
        // 1. Takip Talebi
        if (takipTalebiVar) {
            tamamlananAsamalar.push({
                ad: 'Takip Talebi',
                tamamlanma: 100,
                tamamlandi: true
            });
            
            if (mevcutAsama === 'Takip Talebi') {
                siradakiAsama.ad = 'Takip Talebi';
                siradakiAsama.tamamlanma = 100;
            }
        }
        
        // 2. Ödeme Emri
        if (odemeEmriVar) {
            tamamlananAsamalar.push({
                ad: 'Ödeme Emri',
                tamamlanma: 100,
                tamamlandi: true
            });
            
            if (mevcutAsama === 'Ödeme Emri') {
                siradakiAsama.ad = 'Ödeme Emri';
                siradakiAsama.tamamlanma = 100;
            }
        }
        
        // 3. Takibin kesinleşmesi
        if (kesinlesmeVar) {
            tamamlananAsamalar.push({
                ad: 'Takibin kesinleşmesi',
                tamamlanma: hacizVar || satisVar ? 100 : 50,
                tamamlandi: hacizVar || satisVar
            });
            
            if (mevcutAsama === 'Takibin kesinleşmesi') {
                siradakiAsama.ad = 'Takibin kesinleşmesi';
                siradakiAsama.tamamlanma = 50;
            }
        }
        
        // 4. Haciz
        if (hacizVar) {
            tamamlananAsamalar.push({
                ad: 'Haciz',
                tamamlanma: satisVar ? 100 : 50,
                tamamlandi: satisVar
            });
            
            if (mevcutAsama === 'Haciz') {
                siradakiAsama.ad = 'Haciz';
                siradakiAsama.tamamlanma = 50;
            }
        }
        
        // 5. Satış
        if (satisVar) {
            tamamlananAsamalar.push({
                ad: 'Satış',
                tamamlanma: 100,
                tamamlandi: true
            });
            
            if (mevcutAsama === 'Satış') {
                siradakiAsama.ad = 'Satış';
                siradakiAsama.tamamlanma = 100;
            }
        }
    }
    // Hukuk Dava Dosyası için aşamalar
    else if (dosyaTuru === 'hukuk') {
        // Temel kriterleri belirle
        const davaDilekcesiVar = evrakTurleri.some(tur => tur.includes('dava dilekçesi'));
        
        // Duruşma zaptı sayısını kontrol et
        const durusmaZaptiSayisi = evrakTurleri.filter(tur => 
            (tur.includes('duruşma') && tur.includes('tutanak')) || 
            tur.includes('duruşma zaptı')
        ).length;
        
        // Duruşma zaptı var mı?
        const durusmaZaptiVar = durusmaZaptiSayisi > 0;
        
        // Birden fazla duruşma zaptı var mı?
        const birdenFazlaDurusmaZaptiVar = durusmaZaptiSayisi > 1;
        
        // Ön inceleme zaptı var mı? - Farklı yazım varyasyonlarını da kontrol et
        const onIncelemeZaptiVar = evrakTurleri.some(tur => 
            tur.includes('ön inceleme zaptı') || 
            tur.includes('ön inceleme tutanağı') || 
            tur.includes('öninceleme zaptı') || 
            tur.includes('öninceleme tutanağı') || 
            tur.includes('ön inceleme') && (tur.includes('tutanak') || tur.includes('zaptı') || tur.includes('zapti')) ||
            tur.includes('öninceleme') && (tur.includes('tutanak') || tur.includes('zaptı') || tur.includes('zapti'))
        );
        
        const bilirkisiVar = evrakTurleri.some(tur => tur.includes('bilirkişi') && tur.includes('rapor'));
        const islahVar = evrakTurleri.some(tur => tur.includes('ıslah'));
        
        // Tahkikat aşamasına geçiş kriterleri:
        // 1. Birden fazla duruşma zaptı varsa
        // 2. Bilirkişi raporu varsa
        // 3. Islah dilekçesi varsa
        // 4. Ön inceleme zaptı varsa
        const tahkikatAsamasi = bilirkisiVar || islahVar || birdenFazlaDurusmaZaptiVar || onIncelemeZaptiVar;
        
        const sonSozDilekcesi = evrakTurleri.some(tur => tur.includes('beyan') || tur.includes('son söz'));
        const kararVar = evrakTurleri.some(tur => tur.includes('gerekçeli karar'));
        
        // Mevcut aşamayı belirle
        let mevcutAsama = '';
        if (kararVar) {
            mevcutAsama = 'Hüküm';
        } else if (sonSozDilekcesi || islahVar) { // Islah dilekçesi varsa sözlü yargılama aşamasına geçilmiş
            mevcutAsama = 'Sözlü Yargılama';
        } else if (tahkikatAsamasi) {
            mevcutAsama = 'Tahkikat';
        } else if (durusmaZaptiVar) {
            mevcutAsama = 'Ön İnceleme';
        } else if (davaDilekcesiVar) {
            mevcutAsama = 'Dilekçeler Teatisi';
        }
        
        // Aşamaları ve tamamlanma durumlarını ekle
        // 1. Dilekçeler Teatisi
        if (davaDilekcesiVar) {
            const dilekceTeatiTamamlandi = durusmaZaptiVar || tahkikatAsamasi || sonSozDilekcesi || kararVar || islahVar || onIncelemeZaptiVar;
            tamamlananAsamalar.push({
                ad: 'Dilekçeler Teatisi',
                tamamlanma: dilekceTeatiTamamlandi ? 100 : 50,
                tamamlandi: dilekceTeatiTamamlandi
            });
            
            if (mevcutAsama === 'Dilekçeler Teatisi') {
                siradakiAsama.ad = 'Dilekçeler Teatisi';
                siradakiAsama.tamamlanma = 50;
            }
        }
        
        // 2. Ön İnceleme
        if (durusmaZaptiVar || tahkikatAsamasi || sonSozDilekcesi || kararVar || islahVar || onIncelemeZaptiVar) {
            const onIncelemeTamamlandi = tahkikatAsamasi || sonSozDilekcesi || kararVar || islahVar || onIncelemeZaptiVar;
            tamamlananAsamalar.push({
                ad: 'Ön İnceleme',
                tamamlanma: onIncelemeTamamlandi ? 100 : 40,
                tamamlandi: onIncelemeTamamlandi
            });
            
            if (mevcutAsama === 'Ön İnceleme') {
                siradakiAsama.ad = 'Ön İnceleme';
                siradakiAsama.tamamlanma = 40;
            }
        }
        
        // 3. Tahkikat
        if (tahkikatAsamasi || sonSozDilekcesi || kararVar || islahVar || onIncelemeZaptiVar) {
            const tahkikatTamamlandi = sonSozDilekcesi || kararVar || islahVar || onIncelemeZaptiVar;
            tamamlananAsamalar.push({
                ad: 'Tahkikat',
                tamamlanma: tahkikatTamamlandi ? 100 : 60,
                tamamlandi: tahkikatTamamlandi
            });
            
            if (mevcutAsama === 'Tahkikat') {
                siradakiAsama.ad = 'Tahkikat';
                siradakiAsama.tamamlanma = 60;
            }
        }
        
        // 4. Sözlü Yargılama
        if (sonSozDilekcesi || kararVar || islahVar) {
            const sozluYargilamaTamamlandi = kararVar;
            tamamlananAsamalar.push({
                ad: 'Sözlü Yargılama',
                tamamlanma: sozluYargilamaTamamlandi ? 100 : 80,
                tamamlandi: sozluYargilamaTamamlandi
            });
            
            if (mevcutAsama === 'Sözlü Yargılama') {
                siradakiAsama.ad = 'Sözlü Yargılama';
                siradakiAsama.tamamlanma = 80;
            }
        }
        
        // 5. Hüküm
        if (kararVar) {
            tamamlananAsamalar.push({
                ad: 'Hüküm',
                tamamlanma: 100,
                tamamlandi: true
            });
            
            if (mevcutAsama === 'Hüküm') {
                siradakiAsama.ad = 'Hüküm';
                siradakiAsama.tamamlanma = 100;
            }
        }
    } 
    // Ceza Dava Dosyası için aşamalar
    else if (dosyaTuru === 'ceza') {
        // Temel kriterleri belirle
        const iddianameVar = evrakTurleri.some(tur => tur.includes('iddianame'));
        const tensipZaptiVar = evrakTurleri.some(tur => tur.includes('tensip zaptı') || tur.includes('tensip tutanağı'));
        const kararVar = evrakTurleri.some(tur => tur.includes('gerekçeli karar'));
        
        // Kovuşturma aşamasına geçiş kriterleri:
        // 1. İddianame varsa
        // 2. Tensip zaptı varsa
        const kovusturmaAsamasi = iddianameVar || tensipZaptiVar;
        
        // Mevcut aşamayı belirle
        let mevcutAsama = '';
        if (kararVar) {
            mevcutAsama = 'Hüküm';
        } else if (kovusturmaAsamasi) {
            mevcutAsama = 'Kovuşturma';
        } else {
            mevcutAsama = 'Soruşturma';
        }
        
        // 1. Soruşturma
        const sorusturmaTamamlandi = kovusturmaAsamasi || kararVar;
        tamamlananAsamalar.push({
            ad: 'Soruşturma',
            tamamlanma: sorusturmaTamamlandi ? 100 : 50,
            tamamlandi: sorusturmaTamamlandi
        });
        
        if (mevcutAsama === 'Soruşturma') {
            siradakiAsama.ad = 'Soruşturma';
            siradakiAsama.tamamlanma = 50;
        }
        
        // 2. Kovuşturma
        if (kovusturmaAsamasi || kararVar) {
            const kovusturmaTamamlandi = kararVar;
            tamamlananAsamalar.push({
                ad: 'Kovuşturma',
                tamamlanma: kovusturmaTamamlandi ? 100 : 60,
                tamamlandi: kovusturmaTamamlandi
            });
            
            if (mevcutAsama === 'Kovuşturma') {
                siradakiAsama.ad = 'Kovuşturma';
                siradakiAsama.tamamlanma = 60;
            }
        }
        
        // 3. Hüküm
        if (kararVar) {
            tamamlananAsamalar.push({
                ad: 'Hüküm',
                tamamlanma: 100,
                tamamlandi: true
            });
            
            if (mevcutAsama === 'Hüküm') {
                siradakiAsama.ad = 'Hüküm';
                siradakiAsama.tamamlanma = 100;
            }
        }
    }
    
    return {
        tamamlananAsamalar,
        siradakiAsama
    };
} 

// Eklentideki hazır fonksiyonu kullanarak taraf bilgilerini al
if (typeof window.getUYAPTarafBilgileri === 'function') {
  window.getUYAPTarafBilgileri()
    .then(tarafBilgileri => console.log('Taraf bilgileri:', tarafBilgileri))
    .catch(err => console.error('Hata:', err));
} else {
  console.error('getUYAPTarafBilgileri fonksiyonu bulunamadı');
}

// Evrak indirme işlemlerini özelleştiren modül
class EvrakDownloader {
    constructor() {
        // Orijinal XMLHttpRequest ve Fetch fonksiyonlarını koru
        this.originalXHROpen = XMLHttpRequest.prototype.open;
        this.originalFetch = window.fetch;

        // İndirme URL'lerini dinlemeyi başlat
        this.listenForDownloadURLs();
        
        console.log('UYAP Asistan: Evrak indirme modülü başlatıldı');
    }

    // İndirme URL ve isteklerini dinleyen fonksiyon
    listenForDownloadURLs() {
        // XMLHttpRequest'in open metodunu override et
        XMLHttpRequest.prototype.open = (...args) => {
            const method = args[0];
            const url = args[1];
            
            // XHR nesnesini tut
            const xhr = this;
            
            // Eğer bu bir indirme URL'si ise
            if (typeof url === 'string' && url.includes('evrak_')) {
                console.log('UYAP Asistan: Evrak indirme URL yakalandı:', url);
                
                // URL'den evrak id'yi çıkar
                const evrakIdMatch = url.match(/evrak_(\d+)/);
                if (evrakIdMatch && evrakIdMatch[1]) {
                    const evrakId = evrakIdMatch[1];
                    
                    // Evrak bilgilerini al ve yeni URL oluştur
                    this.getEvrakDetails(evrakId)
                        .then(evrakDetails => {
                            if (evrakDetails) {
                                // Yeni bir indirme URL'si oluştur - orijinal URL'yi kullan ancak isim özelliğini ekle
                                this.downloadWithCustomName(url, evrakDetails);
                                
                                // Orijinal isteği engellemek için boş return
                                return;
                            }
                        })
                        .catch(error => {
                            console.error('UYAP Asistan: Evrak bilgisi alınırken hata:', error);
                            // Hata durumunda orijinal isteği yap
                            return this.originalXHROpen.apply(this, args);
                        });
                        
                // Orijinal isteği engellemek için boş return
                return;
                } 
            }
            
            // Evrak indirme URL'si değilse normal akışa devam et
            return this.originalXHROpen.apply(this, args);
        };
        
        // Fetch API'sini de izle
        window.fetch = (resource, options) => {
            const url = resource instanceof Request ? resource.url : resource;
            
            // Eğer bu bir indirme URL'si ise
            if (typeof url === 'string' && url.includes('evrak_')) {
                console.log('UYAP Asistan: Evrak indirme URL yakalandı (fetch):', url);
                
                // URL'den evrak id'yi çıkar
                const evrakIdMatch = url.match(/evrak_(\d+)/);
                if (evrakIdMatch && evrakIdMatch[1]) {
                    const evrakId = evrakIdMatch[1];
                    
                    // Evrak bilgilerini al ve yeni URL oluştur
                    return this.getEvrakDetails(evrakId)
                        .then(evrakDetails => {
                            if (evrakDetails) {
                                // Yeni bir indirme URL'si oluştur
                                return this.downloadWithCustomName(url, evrakDetails);
                            } else {
                                // Evrak bilgisi alınamazsa orijinal isteği yap
                                return this.originalFetch.apply(window, [resource, options]);
                            }
                        })
                        .catch(error => {
                            console.error('UYAP Asistan: Evrak bilgisi alınırken hata:', error);
                            // Hata durumunda orijinal isteği yap
                            return this.originalFetch.apply(window, [resource, options]);
                        });
                }
            }
            
            // Evrak indirme URL'si değilse normal akışa devam et
            return this.originalFetch.apply(window, [resource, options]);
        };
        
        // Evrak indirme linklerini izlemek için DOM'u dinle
        this.observeDownloadLinks();
    }
    
    // DOM üzerinde evrak indirme linklerini izle
    observeDownloadLinks() {
        // MutationObserver ile evrak indirme linklerini (a etiketi) izle
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        // Eklenen node bir element ise
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // A etiketlerini bul
                            const links = node.querySelectorAll('a[href*="evrak_"]');
                            
                            // İndirme linklerinin click olaylarını yakalayıp özelleştir
                            links.forEach(link => {
                                // Her link için bir kez işlem yap
                                if (!link.dataset.processed) {
                                    const url = link.href;
                                    const evrakIdMatch = url.match(/evrak_(\d+)/);
                                    
                                    if (evrakIdMatch && evrakIdMatch[1]) {
                                        const evrakId = evrakIdMatch[1];
                                        
                                        // Orijinal click olayını engelle ve kendi işlemini yap
                                        link.addEventListener('click', async (e) => {
                                            e.preventDefault();
                                            
                                            try {
                                                const evrakDetails = await this.getEvrakDetails(evrakId);
                                                if (evrakDetails) {
                                                    // Özel isimle indir
                                                    this.downloadWithCustomName(url, evrakDetails);
                                                } else {
                                                    // Evrak bilgisi alınamazsa normal indirme yap
                                                    window.location.href = url;
                                                }
                                            } catch (error) {
                                                console.error('UYAP Asistan: Evrak indirme hatası:', error);
                                                // Hata durumunda normal indirme yap
                                                window.location.href = url;
                                            }
                                        });
                                        
                                        // Bu linkin işlendiğini işaretle
                                        link.dataset.processed = 'true';
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });
        
        // Tüm DOM değişikliklerini izle
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // Evrak bilgilerini getir
    async getEvrakDetails(evrakId) {
        try {
            // Dosya ID'yi localStorage'dan al
            const dosyaId = localStorage.getItem('uyap_asistan_dosya_id');
            if (!dosyaId) {
                console.error('UYAP Asistan: Dosya ID bulunamadı');
                return null;
            }
            
            // Önce önbellekte evrak listesi var mı kontrol et
            let evrakListesi = null;
            const cachedData = localStorage.getItem('uyap_asistan_evrak_listesi');
            
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    evrakListesi = parsed;
                } catch (e) {
                    console.error('UYAP Asistan: Önbellekteki evrak listesi ayrıştırma hatası:', e);
                }
            }
            
            // Eğer önbellekte yoksa API'den al
            if (!evrakListesi) {
                console.log('UYAP Asistan: Evrak listesi için API isteği yapılıyor...');
                const response = await fetch('https://avukatbeta.uyap.gov.tr/list_dosya_evraklar.ajx', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        dosyaId: dosyaId
                    }),
                    credentials: 'include'
                });
                
                const data = await response.json();
                if (data && data.status === 200) {
                    evrakListesi = data;
                    // Önbelleğe kaydet
                    localStorage.setItem('uyap_asistan_evrak_listesi', JSON.stringify(data));
                } else {
                    console.error('UYAP Asistan: Evrak listesi alınamadı');
                    return null;
                }
            }
            
            // Evrak ID'ye göre ilgili evrakı bul
            let targetEvrak = null;
            
            if (evrakListesi && evrakListesi.tumEvraklar) {
                // Tüm dosya anahtarlarını döngüyle gez
                Object.keys(evrakListesi.tumEvraklar).forEach(dosyaKey => {
                    const evraklar = evrakListesi.tumEvraklar[dosyaKey];
                    
                    // Her bir evrakı kontrol et
                    evraklar.forEach(evrak => {
                        if (evrak.evrakId === evrakId || evrak.ggEvrakId === evrakId) {
                            targetEvrak = evrak;
                        }
                    });
                });
            }
            
            if (targetEvrak) {
                return {
                    tur: targetEvrak.tur,
                    gonderenYerKisi: targetEvrak.gonderenYerKisi,
                    gonderenDosyaNo: targetEvrak.gonderenDosyaNo || 'BelirtilmemisNo'
                };
            } else {
                console.error('UYAP Asistan: İlgili evrak bulunamadı:', evrakId);
                return null;
            }
        } catch (error) {
            console.error('UYAP Asistan: Evrak bilgileri alınırken hata:', error);
            return null;
        }
    }
    
    // Özelleştirilmiş dosya adıyla indirme işlemi
    downloadWithCustomName(url, evrakDetails) {
        try {
            // Evrak bilgilerinden dosya adı oluştur
            // [tur-gonderenYerKisi-gonderenDosyaNo] formatında
            let fileName = this.formatFileName(evrakDetails);
            
            // Fetch ile dosyayı indir
            fetch(url, { credentials: 'include' })
                .then(response => response.blob())
                .then(blob => {
                    // Blob'dan URL oluştur
                    const blobUrl = URL.createObjectURL(blob);
                    
                    // İndirme elemanı oluştur
                    const downloadLink = document.createElement('a');
                    downloadLink.href = blobUrl;
                    downloadLink.download = fileName;
                    downloadLink.style.display = 'none';
                    
                    // DOM'a ekle ve tıkla
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    
                    // Temizle
                    URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(downloadLink);
                    
                    console.log('UYAP Asistan: Evrak başarıyla indirildi:', fileName);
                })
                .catch(error => {
                    console.error('UYAP Asistan: Dosya indirme hatası:', error);
                });
        } catch (error) {
            console.error('UYAP Asistan: Özel dosya adıyla indirme hatası:', error);
        }
    }
    
    // Evrak bilgilerinden geçerli bir dosya adı oluştur
    formatFileName(evrakDetails) {
        try {
            // Karakterleri temizle ve maksimum uzunlukları kontrol et
            const tur = this.sanitizeFileName(evrakDetails.tur, 30);
            const gonderen = this.sanitizeFileName(evrakDetails.gonderenYerKisi, 30);
            const dosyaNo = this.sanitizeFileName(evrakDetails.gonderenDosyaNo || 'BelirtilmemisNo', 20);
            
            // [tur-gonderenYerKisi-gonderenDosyaNo] formatında dosya adı oluştur
            return `${tur}-${gonderen}-${dosyaNo}.pdf`;
        } catch (error) {
            console.error('UYAP Asistan: Dosya adı oluşturma hatası:', error);
            return `evrak_${Date.now()}.pdf`; // Fallback ismi
        }
    }
    
    // Dosya adı için geçersiz karakterleri temizle
    sanitizeFileName(input, maxLength) {
        if (!input) return 'BilinmeyenAd';
        
        // Geçersiz dosya adı karakterlerini temizle
        let cleaned = input
            .replace(/[\\/:*?"<>|]/g, '_') // Windows tarafından yasaklanan karakterler
            .replace(/\s+/g, '_')          // Boşlukları alt çizgi ile değiştir
            .replace(/[,;.]/g, '_')        // Noktalama işaretlerini temizle
            .replace(/__+/g, '_')          // Birden fazla alt çizgiyi tek alt çizgiye indir
            .trim();
            
        // Uzunluğu sınırla
        if (cleaned.length > maxLength) {
            cleaned = cleaned.substring(0, maxLength);
        }
        
        return cleaned;
    }
}

// Modülü başlat
(function() {
    // Sadece UYAP sayfalarında çalıştır
    if (window.location.href.includes('uyap.gov.tr')) {
        console.log('UYAP Asistan: Özelleştirilmiş evrak indirme modülü başlatılıyor...');
        // Sayfa tamamen yüklendiğinde evrak indirici başlat
        window.addEventListener('load', () => {
            const downloader = new EvrakDownloader();
        });
    }
})();

async function sendBase64ToPdfServer(base64Data) {
    try {
        const response = await fetch('https://base64to-barcod.vercel.app/api/extract-barcode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ base64String: base64Data })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('PDF sunucu hatası:', error);
        throw error;
    }
}

async function checkPTTStatus(barcodeNumber) {
    try {
        const response = await fetch('https://avukatbeta.uyap.gov.tr/mts_tebligat_safahat_list_brd.ajx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                barkodNo: barcodeNumber
            })
        });

        if (!response.ok) {
            throw new Error('PTT sorgusu başarısız oldu');
        }

        const data = await response.json();
        
        // Normal tebligat veri yapısını konsola yazdır
        console.log('***********************');
        console.log('Normal Tebligat:');
        console.log('Barkod Numarası:', barcodeNumber);
        console.log('***********************');
        
        if (!Array.isArray(data) || data.length === 0) {
            console.log('PTT tarafından evrak kaydı yapılmamıştır');
            return;
        }

        const status5 = data.find(item => item.siraNo === 5);
        if (status5) {
            console.log(`Tebligat Durumu: ${status5.aciklama}`);
        } else {
            console.log('PTT tarafından evrak kaydı yapılmamıştır');
        }
    } catch (error) {
        console.error('PTT sorgusu sırasında hata oluştu:', error);
    }
}

async function processBarcodeAndCheckPTT(base64Data) {
    try {
        // Önce barkod numarasını al
        const result = await sendBase64ToPdfServer(base64Data);
        
        if (result.success) {
            const barcodeNumber = result.data.barcodeNumber;
            console.log('Barkod Numarası:', barcodeNumber);

            // Elektronik tebligat kontrolü
            try {
                const response = await fetch('https://avukatbeta.uyap.gov.tr/mts_tebligat_safahat_list_brd.ajx', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        barkodNo: barcodeNumber
                    })
                });

                if (!response.ok) {
                    throw new Error('PTT sorgusu başarısız oldu');
                }

                const data = await response.json();
                
                if (Array.isArray(data) && data.length > 0) {
                    // Her öğeyi kontrol et ve elektronik tebligat olup olmadığını belirle
                    let isElektronikTebligat = false;
                    let tebligatBilgisi = null;
                    
                    // Tüm veri öğelerini döngü ile kontrol et
                    for (const item of data) {
                        // Tüm özellikleri kontrol et
                        Object.entries(item).forEach(([key, value]) => {
                            if (value && typeof value === 'string') {
                                const valueLower = value.toLowerCase();
                                
                                // Elektronik tebligat ile ilgili anahtar kelimeleri ara
                                if (valueLower.includes("elektronik tebligat") || 
                                    valueLower.includes("e-tebligat") ||
                                    valueLower.includes("ulak") || 
                                    valueLower.includes("elektronik tebliğ") ||
                                    valueLower.includes("uets")) {
                                    
                                    isElektronikTebligat = true;
                                    tebligatBilgisi = item;
                                }
                            }
                        });
                    }
                    
                    // Elektronik tebligat bulunduysa
                    if (isElektronikTebligat && tebligatBilgisi) {
                        console.log('***********************');
                        console.log('Elektronik Tebligat Tespit Edildi');
                        console.log('Barkod Numarası:', barcodeNumber);
                        
                        // Sadece aciklama alanını göster (varsa)
                        if (tebligatBilgisi.aciklama) {
                            console.log('Açıklama:', tebligatBilgisi.aciklama);
                        }
                        
                        console.log('***********************');
                        return; // PTT sorgusu yapmadan çık
                    }
                }
            } catch (error) {
                console.error('Elektronik tebligat kontrolü sırasında hata oluştu:', error);
            }

            // Elektronik tebligat değilse normal PTT sorgusu yap
            await checkPTTStatus(barcodeNumber);
        } else {
            console.error('Barkod bulunamadı:', result.error);
        }
    } catch (error) {
        console.error('İşlem sırasında hata oluştu:', error);
    }
}

// Excel'e aktarma fonksiyonu - Harici kütüphane kullanmadan HTML tabloyu dışa aktarır
function exportTableToExcel() {
    // Tebligat sonuçları kontrol edilir
    if (!window.latestTebligatSonuclari || window.latestTebligatSonuclari.length === 0) {
        alert('Dışa aktarılacak tebligat verisi bulunamadı!');
        return;
    }
    
    try {
        // Tarih bilgisini al
        const today = new Date();
        const dateStr = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
        const fileName = `Tebligatlar_${dateStr}.xls`;
        
        // HTML tablosu oluştur
        let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">';
        
        // Head kısmı ve stil
        html += '<head>';
        html += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
        html += '<meta http-equiv="X-UA-Compatible" content="IE=edge">';
        html += '<!--[if gte mso 9]><xml>';
        html += '<x:ExcelWorkbook>';
        html += '<x:ExcelWorksheets>';
        html += '<x:ExcelWorksheet>';
        html += '<x:Name>Tebligatlar</x:Name>';
        html += '<x:WorksheetOptions>';
        html += '<x:DisplayGridlines/>';
        html += '<x:FitToPage/>';
        html += '</x:WorksheetOptions>';
        html += '</x:ExcelWorksheet>';
        html += '</x:ExcelWorksheets>';
        html += '</x:ExcelWorkbook>';
        html += '</xml><![endif]-->';
        
        html += '<style>';
        html += 'table, th, td { border: 1px solid black; border-collapse: collapse; }';
        html += 'th { background-color: #1F4E78; color: white; font-weight: bold; }';
        html += '.elektronik { background-color: #D1ECF1; }'; // Açık mavi
        html += '.teslim { background-color: #D4EDDA; }'; // Açık yeşil
        html += '.iade { background-color: #F8D7DA; }'; // Açık kırmızı
        html += '.bekleyen { background-color: #FFF3CD; }'; // Açık sarı
        html += 'td, th { padding: 5px; white-space: nowrap; }'; // nowrap ekleyerek kırpılmayı engelliyoruz
        html += 'table { table-layout: fixed; width: 100%; }';
        html += 'col.c1 { width: 250px; }'; // Yargı Birimi
        html += 'col.c2 { width: 150px; }'; // Dosya No
        html += 'col.c3 { width: 150px; }'; // Barkod No
        html += 'col.c4 { width: 300px; }'; // Alıcı Bilgileri
        html += 'col.c5 { width: 350px; }'; // Gönderim Açıklaması
        html += 'col.c6 { width: 150px; }'; // Teslim Tarihi
        html += 'col.c7 { width: 180px; }'; // Tebligat Türü
        html += '</style>';
        html += '</head>';
        
        // Body başlangıcı
        html += '<body>';
        html += '<table>';
        
        // Sütun genişliklerini belirle
        html += '<colgroup>';
        html += '<col class="c1">'; // Yargı Birimi
        html += '<col class="c2">'; // Dosya No
        html += '<col class="c3">'; // Barkod No
        html += '<col class="c4">'; // Alıcı Bilgileri
        html += '<col class="c5">'; // Gönderim Açıklaması
        html += '<col class="c6">'; // Teslim Tarihi
        html += '<col class="c7">'; // Tebligat Türü
        html += '</colgroup>';
        
        // Tablo başlığı
        html += '<tr>';
        html += '<th>Yargı Birimi</th>';
        html += '<th>Dosya No</th>';
        html += '<th>Barkod No</th>';
        html += '<th>Alıcı Bilgileri</th>';
        html += '<th>Gönderim Açıklaması</th>';
        html += '<th>Teslim Tarihi</th>';
        html += '<th>Tebligat Türü</th>';
        html += '</tr>';
        
        // Tablo içeriği
        window.latestTebligatSonuclari.forEach(sonuc => {
            const isIade = sonuc.gonderimAciklamasi && 
                          (sonuc.gonderimAciklamasi.toUpperCase().includes('IADE') || 
                           sonuc.gonderimAciklamasi.toUpperCase().includes('İADE'));
            
            let rowClass = '';
            if (sonuc.isElektronikTebligat) {
                rowClass = 'elektronik';
            } else if (isIade) {
                rowClass = 'iade';
            } else if (sonuc.teslimTarihi && sonuc.teslimTarihi.trim() !== '-' && sonuc.teslimTarihi.trim() !== '') {
                rowClass = 'teslim';
            } else {
                rowClass = 'bekleyen';
            }
            
            const tebligatTuru = sonuc.isElektronikTebligat ? 'Elektronik Tebligat' : 'Normal Tebligat';
            
            // Tarihi standart formata dönüştür
            let formattedTeslimTarihi = sonuc.teslimTarihi || '-';
            if (formattedTeslimTarihi !== '-' && formattedTeslimTarihi.trim() !== '') {
                // Tarih formatını kontrol et ve standartlaştır (GG.AA.YYYY formatına çevir)
                if (formattedTeslimTarihi.includes('/')) {
                    const parts = formattedTeslimTarihi.split('/');
                    if (parts.length === 3) {
                        formattedTeslimTarihi = `${parts[0].padStart(2, '0')}.${parts[1].padStart(2, '0')}.${parts[2]}`;
                    }
                } else if (formattedTeslimTarihi.includes('-')) {
                    const parts = formattedTeslimTarihi.split('-');
                    if (parts.length === 3) {
                        // YYYY-AA-GG formatını GG.AA.YYYY formatına çevir
                        if (parts[0].length === 4) {
                            formattedTeslimTarihi = `${parts[2].padStart(2, '0')}.${parts[1].padStart(2, '0')}.${parts[0]}`;
                        } else {
                            formattedTeslimTarihi = `${parts[0].padStart(2, '0')}.${parts[1].padStart(2, '0')}.${parts[2]}`;
                        }
                    }
                } else if (formattedTeslimTarihi.includes('.')) {
                    const parts = formattedTeslimTarihi.split('.');
                    if (parts.length === 3) {
                        formattedTeslimTarihi = `${parts[0].padStart(2, '0')}.${parts[1].padStart(2, '0')}.${parts[2]}`;
                    }
                }
            }
            
            // Barkod numarasını metin olarak formatla (bilimsel gösterimden kaçınmak için)
            const barkodNo = sonuc.barkodNo || '-';
            const formattedBarkodNo = barkodNo !== '-' ? `'${barkodNo}` : '-';
            
            html += `<tr class="${rowClass}">`;
            html += `<td>${escapeHTML(sonuc.yargiBirimi || '-')}</td>`;
            html += `<td>${escapeHTML(sonuc.dosyaNo || '-')}</td>`;
            html += `<td style="mso-number-format:'\\@';">${escapeHTML(barkodNo)}</td>`;
            html += `<td>${escapeHTML(sonuc.aliciBilgisi || '-')}</td>`;
            html += `<td>${escapeHTML(sonuc.gonderimAciklamasi || '-')}</td>`;
            html += `<td>${escapeHTML(formattedTeslimTarihi)}</td>`;
            html += `<td>${escapeHTML(tebligatTuru)}</td>`;
            html += '</tr>';
        });
        
        // Tablo ve HTML sonu
        html += '</table>';
        html += '</body>';
        html += '</html>';
        
        // HTML'i Blob'a dönüştür
        const blob = new Blob([html], {type: 'application/vnd.ms-excel'});
        const url = URL.createObjectURL(blob);
        
        // Dosyayı indir
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`UYAP Asistan: Tebligatlar Excel formatında dışa aktarıldı: ${fileName}`);
    } catch (error) {
        console.error('Excel dosyası oluşturulurken hata:', error);
        alert('Excel dosyası oluşturulurken bir hata oluştu. CSV formatında dışa aktarmayı deniyorum...');
        exportTableToCSV();
    }
}

// HTML escaping fonksiyonu
function escapeHTML(str) {
    if (!str) return '';
    return str
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Yedek olarak CSV formatında dışa aktarma fonksiyonu
function exportTableToCSV() {
    // Tebligat sonuçları kontrol edilir
    if (!window.latestTebligatSonuclari || window.latestTebligatSonuclari.length === 0) {
        alert('Dışa aktarılacak tebligat verisi bulunamadı!');
        return;
    }
    
    // CSV formatına çevir
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    
    // Başlık satırı
    csvContent += 'Yargı Birimi,Dosya No,Barkod No,Alıcı Bilgileri,Gönderim Açıklaması,Teslim Tarihi,Tebligat Türü\n';
    
    // Veri satırları
    window.latestTebligatSonuclari.forEach(sonuc => {
        const tebligatTuru = sonuc.isElektronikTebligat ? 'Elektronik Tebligat' : 'Normal Tebligat';
        const row = [
            escapeCsvValue(sonuc.yargiBirimi || ''),
            escapeCsvValue(sonuc.dosyaNo || ''),
            escapeCsvValue(sonuc.barkodNo || ''),
            escapeCsvValue(sonuc.aliciBilgisi || ''),
            escapeCsvValue(sonuc.gonderimAciklamasi || ''),
            escapeCsvValue(sonuc.teslimTarihi || ''),
            escapeCsvValue(tebligatTuru)
        ];
        csvContent += row.join(',') + '\n';
    });
    
    // CSV'yi indirme bağlantısı oluştur
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    
    // Dosya adı oluştur (bugünün tarihi ile)
    const today = new Date();
    const dateStr = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    link.setAttribute('download', `Tebligatlar_${dateStr}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`UYAP Asistan: Tebligatlar CSV formatında dışa aktarıldı`);
}

// CSV için değerleri düzgün formata çevirme
function escapeCsvValue(value) {
    if (value === null || value === undefined) return '';
    
    value = value.toString();
    // Çift tırnak içine alınması gereken karakterler varsa
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        // Çift tırnakları escape et (bir tane daha ekleyerek)
        value = value.replace(/"/g, '""');
        // Tüm değeri çift tırnak içine al
        value = `"${value}"`;
    }
    return value;
}
