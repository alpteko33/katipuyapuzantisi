// Bu script, UYAP sayfasına direkt olarak inject edilir
console.log('UYAP Asistan: inject.js yüklendi');

// Debugger modu - sadece geliştirme ortamında true yapın
// Script birden fazla defa yüklenmesin diye global kontrol
if (typeof window.UYAP_ASISTAN === 'undefined') {
    window.UYAP_ASISTAN = {
        DEBUG: false,
        isActive: false,
        intervalId: null
    };

    function debugLog(...args) {
        if (window.UYAP_ASISTAN.DEBUG) {
            console.log(...args);
        }
    }

    function addQuickPetitionButton() {
        debugLog('UYAP Asistan: Buton ekleme fonksiyonu başlatıldı');
        
        if (window.UYAP_ASISTAN.isActive) return; // Zaten çalışıyorsa tekrar başlatma
        window.UYAP_ASISTAN.isActive = true;
        
        // Tüm popup pencereleri izle
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            
            for (const mutation of mutations) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            if (
                                node.classList?.contains('dx-popup-title') || 
                                node.querySelector?.('.dx-popup-title') ||
                                node.classList?.contains('dx-button-has-text') && node.querySelector?.('i.icon-maximize')
                            ) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                    if (shouldCheck) break;
                }
            }
            
            if (shouldCheck) {
                // Butonu eklemek için kısa bir gecikme
                setTimeout(checkAllPopups, 200);
            }
        });

        // Tüm DOM değişikliklerini izle
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Sayfa yüklendiğinde kontrol et
        checkAllPopups();
        
        // Periyodik kontrol yerine, sadece başlangıçta ve DOM değişikliklerinde kontrol
        // Ayrıca, her 10 saniyede bir kontrol ederek kaçırılan popupları yakalayalım
        if (window.UYAP_ASISTAN.intervalId) {
            clearInterval(window.UYAP_ASISTAN.intervalId);
        }
        
        window.UYAP_ASISTAN.intervalId = setInterval(() => {
            const popups = document.querySelectorAll('.dx-popup-title');
            if (popups.length > 0) {
                checkAllPopups();
            }
        }, 10000); // 10 saniyede bir kontrol et
    }

    function checkForPopup(node) {
        // Eğer node kendisi popup title ise
        if (node.classList && node.classList.contains('dx-popup-title')) {
            processPopupTitle(node);
        }
        
        // Eğer node içinde popup title varsa
        const titleElements = node.querySelectorAll ? node.querySelectorAll('.dx-popup-title') : [];
        titleElements.forEach(processPopupTitle);
    }

    function checkAllPopups() {
        const popupTitles = document.querySelectorAll('.dx-popup-title');
        popupTitles.forEach(processPopupTitle);
    }

    function processPopupTitle(title) {
        // Tam Ekran butonunu bul
        const fullScreenButton = title.querySelector('.dx-button-has-text i.icon-maximize')?.closest('.dx-button');
        
        // Eğer Tam Ekran butonu varsa ve "Hızlı Dilekçe" butonu eklenmemişse
        if (fullScreenButton && !title.querySelector('.quick-petition-btn')) {
            debugLog('UYAP Asistan: Tam Ekran butonu bulundu, Hızlı Dilekçe butonu ekleniyor');
            
            // Yeni buton oluştur
            const quickPetitionButton = document.createElement('div');
            quickPetitionButton.className = 'dx-widget dx-button dx-button-mode-outlined dx-button-normal dx-button-has-text dx-button-has-icon me-2 quick-petition-btn';
            quickPetitionButton.setAttribute('role', 'button');
            quickPetitionButton.setAttribute('aria-label', 'Hızlı Dilekçe');
            quickPetitionButton.setAttribute('tabindex', '0');
            
            quickPetitionButton.innerHTML = `
                <div class="dx-button-content">
                    <i class="dx-icon fe icon-file-text"></i>
                    <span class="dx-button-text">Hızlı Dilekçe</span>
                </div>
            `;
            
            // Butona tıklama olayı ekle
            quickPetitionButton.addEventListener('click', () => {
                handleQuickPetition();
            });
            
            // Butonu Tam Ekran butonunun yanına ekle
            fullScreenButton.insertAdjacentElement('beforebegin', quickPetitionButton);
            debugLog('UYAP Asistan: Hızlı Dilekçe butonu eklendi');
        }
    }

    function handleQuickPetition() {
        debugLog('UYAP Asistan: Hızlı Dilekçe butonu tıklandı');
        
        // 1. Dosya ID'sini yakala
        const dosyaId = getDosyaId();
        if (!dosyaId) {
            alert('Dosya ID bulunamadı. Lütfen bir dava dosyası açın.');
            return;
        }
        
        debugLog('Dosya ID yakalandı:', dosyaId);
        
        // Dava dosyası başlığını al
        const dosyaBaslik = document.querySelector('.dx-popup-title h4')?.textContent || 'Dosya Bilgisi Bulunamadı';
        debugLog('Dava Başlığı:', dosyaBaslik);
        
        // Dava no ve mahkeme bilgisini başlıktan çıkar
        let davaNo = '';
        let mahkemeBilgisi = '';
        const baslikMatch = dosyaBaslik.match(/(\d+\/\d+)\s+(.+)/);
        if (baslikMatch) {
            davaNo = baslikMatch[1];
            // Sadece mahkeme adını al, diğer detayları çıkar
            mahkemeBilgisi = baslikMatch[2].split('-')[0].split('Mahkemesi')[0].trim() + ' Mahkemesi';
        }
        
        // 2. Taraf bilgilerini UYAP API'den çek
        fetchTarafBilgileri(dosyaId, davaNo, mahkemeBilgisi);
    }
    
    function getDosyaId() {
        debugLog('Dosya ID aranıyor...');
        
        // 1. Önce localStorage'dan kontrol et (file-tracking.js tarafından kaydedilen)
        const localStorageDosyaId = localStorage.getItem('uyap_asistan_dosya_id');
        if (localStorageDosyaId) {
            debugLog('Dosya ID localStorage\'dan alındı:', localStorageDosyaId);
            return localStorageDosyaId;
        }
        
        // 2. URL'den dosya ID'sini al
        const currentUrl = window.location.href;
        const dosyaIdMatch = currentUrl.match(/dosyaId=([^&]+)/);
        if (dosyaIdMatch && dosyaIdMatch[1]) {
            debugLog('Dosya ID URL\'den alındı:', dosyaIdMatch[1]);
            return dosyaIdMatch[1];
        }
        
        // 3. Diğer veri kaynaklarından kontrol et
        const dosyaIdInput = document.querySelector('input[name="dosyaId"]');
        if (dosyaIdInput) {
            debugLog('Dosya ID input alanından alındı:', dosyaIdInput.value);
            return dosyaIdInput.value;
        }
        
        // 4. Tüm gizli input alanlarını kontrol et
        const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
        for (const input of hiddenInputs) {
            if (input.name && input.name.toLowerCase().includes('dosya') && input.name.toLowerCase().includes('id')) {
                debugLog('Dosya ID gizli input alanından alındı:', input.value);
                return input.value;
            }
        }
        
        // 5. Sayfa içindeki script'lerden dosya ID'sini almayı dene
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            const content = script.textContent;
            if (content) {
                const scriptDosyaIdMatch = content.match(/dosyaId\s*=\s*['"](.*?)['"]/);
                if (scriptDosyaIdMatch && scriptDosyaIdMatch[1]) {
                    debugLog('Dosya ID script içeriğinden alındı:', scriptDosyaIdMatch[1]);
                    return scriptDosyaIdMatch[1];
                }
            }
        }
        
        // 6. Global objelerden dosya ID'sini almayı dene
        if (window.dosyaId) {
            debugLog('Dosya ID global objeden alındı:', window.dosyaId);
            return window.dosyaId;
        }
        
        // 7. DOM'dan mevcut popup başlığını bulup dosya ID oluşturmayı dene
        const popupTitle = document.querySelector('.dx-popup-title h4');
        if (popupTitle) {
            const dosyaBaslik = popupTitle.textContent.trim();
            if (dosyaBaslik) {
                // Basit bir hash oluştur (gerçek dosya ID değil, ancak tekrarlı aramalarda tutarlı bir değer)
                const simpleId = dosyaBaslik.replace(/[^a-zA-Z0-9]/g, '_');
                debugLog('Dosya ID popup başlığından oluşturuldu:', simpleId);
                return simpleId;
            }
        }
        
        debugLog('Dosya ID bulunamadı');
        return null;
    }
    
    function fetchTarafBilgileri(dosyaId, davaNo, mahkemeBilgisi) {
        debugLog('Taraf bilgileri API\'den çekiliyor...');
        
        // API'ye istek göndermek için gerekli parametreleri hazırla
        const url = 'https://avukatbeta.uyap.gov.tr/dosya_taraf_bilgileri_brd.ajx';
        const data = new FormData();
        data.append('dosyaId', dosyaId);
        
        // CSP hatası nedeniyle doğrudan XHR veya fetch kullanmak yerine
        // content script ile background script arasında mesajlaşma ile çözeceğiz
        chrome.runtime.sendMessage({
            action: 'fetchTarafBilgileri',
            url: url,
            dosyaId: dosyaId
        }, function(response) {
            if (chrome.runtime.lastError) {
                // API isteği gönderilemedi, mevcut yöntemi kullan
                debugLog('API isteği gönderilemedi, mevcut taraf bilgilerini kullanıyoruz:', chrome.runtime.lastError);
                const taraflarFallback = getTarafBilgileri();
                showQuickPetitionPopup(davaNo, mahkemeBilgisi, taraflarFallback);
                return;
            }
            
            if (response && response.success && response.data) {
                // API'den gelen verileri düzenle
                const taraflar = formatTarafBilgileri(response.data);
                debugLog('API\'den gelen taraf bilgileri:', taraflar);
                
                // Müvekkil bilgilerini kaydet
                saveMuvekkilBilgileri(davaNo, mahkemeBilgisi, taraflar);
                
                // Hızlı Dilekçe Popup'ını aç
                showQuickPetitionPopup(davaNo, mahkemeBilgisi, taraflar);
            } else {
                // API'den bilgi alınamadı, mevcut yöntemi kullan
                debugLog('API\'den bilgi alınamadı, mevcut taraf bilgilerini kullanıyoruz');
                const taraflarFallback = getTarafBilgileri();
                showQuickPetitionPopup(davaNo, mahkemeBilgisi, taraflarFallback);
            }
        });
    }
    
    function formatTarafBilgileri(apiData) {
        try {
            // API'den gelen veriyi işleyip uygun formata dönüştür
            const taraflar = [];
            
            if (Array.isArray(apiData)) {
                apiData.forEach(taraf => {
                    taraflar.push({
                        tip: taraf.rol || '',
                        ad: taraf.adi || '',
                        vekil: taraf.vekil || '',
                        kisiKurum: taraf.kisiKurum || 'Kişi'
                    });
                });
            }
            
            return taraflar;
        } catch (error) {
            debugLog('Taraf bilgileri formatlanırken hata oluştu:', error);
            return [];
        }
    }
    
    function getTarafBilgileri() {
        debugLog('Taraf bilgileri alınıyor...');
        const taraflar = [];
        
        // Aktif taraflar tablosunu bul
        const taraflarTable = document.querySelector('.dx-multiview-item-selected table');
        if (!taraflarTable) return taraflar;
        
        // Tablo satırlarını kontrol et
        const tarafRows = taraflarTable.querySelectorAll('tbody tr');
        
        tarafRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const tarafTip = cells[0].textContent.trim();
                const tarafAd = cells[1].textContent.trim();
                const vekilBilgisi = cells.length >= 3 ? cells[2].textContent.trim() : '';
                const kisiKurum = cells.length >= 4 && cells[3].textContent.includes('Kurum') ? 'Kurum' : 'Kişi';
                
                taraflar.push({
                    tip: tarafTip,
                    ad: tarafAd,
                    vekil: vekilBilgisi,
                    kisiKurum: kisiKurum
                });
            }
        });
        
        debugLog('Bulunan taraflar:', taraflar);
        return taraflar;
    }
    
    function saveMuvekkilBilgileri(davaNo, mahkemeBilgisi, taraflar) {
        debugLog('Müvekkil bilgileri kaydediliyor...');
        
        // Avukat adını bul
        const avukatAdi = document.querySelector('.layout-header-user-info-name')?.textContent.trim() || 'BAHİTTİN FURKAN TOROS';
        
        // Müvekkilleri filtrele (avukatın vekilliğini yaptığı kişiler)
        const muvekkilListesi = taraflar.filter(taraf => 
            taraf.vekil && taraf.vekil.includes(avukatAdi)
        );
        
        if (muvekkilListesi.length === 0) {
            debugLog('Müvekkil bulunamadı.');
            return;
        }

        // Chrome storage API ile müvekkil bilgilerini kaydet
        const muvekkilData = {
            davaNo: davaNo,
            mahkeme: mahkemeBilgisi,
            tarih: new Date().toLocaleDateString('tr-TR'),
            muvekkilListesi: muvekkilListesi
        };
        
        // Mevcut müvekkil verilerini al ve yeni veriyi ekle
        chrome.storage.local.get(['muvekkilVerileri'], function(result) {
            let muvekkilVerileri = result.muvekkilVerileri || [];
            
            // Aynı dava numarası varsa güncelle
            const existingIndex = muvekkilVerileri.findIndex(m => m.davaNo === davaNo);
            if (existingIndex !== -1) {
                muvekkilVerileri[existingIndex] = muvekkilData;
            } else {
                muvekkilVerileri.push(muvekkilData);
            }
            
            chrome.storage.local.set({ muvekkilVerileri: muvekkilVerileri }, function() {
                debugLog('Müvekkil bilgileri kaydedildi.');
                
                // Account Manager'a bildirim gönder
                const accountUpdateEvent = new CustomEvent('muvekkilDataUpdated', {
                    detail: { muvekkilVerileri: muvekkilVerileri }
                });
                window.dispatchEvent(accountUpdateEvent);
            });
        });
    }
    
    function showQuickPetitionPopup(davaNo, mahkemeBilgisi, taraflar) {
        debugLog('Hızlı Dilekçe Popup açılıyor...');
        
        // Popup container oluştur
        const popupContainer = document.createElement('div');
        popupContainer.className = 'quick-petition-popup-container';
        popupContainer.style.cssText = `
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
        
        // Popup içeriği
        popupContainer.innerHTML = `
            <div class="quick-petition-popup" style="
                background-color: #fff;
                width: 95%;
                max-width: 1200px;
                height: 85vh;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                filter: none !important;
                pointer-events: auto !important;
            ">
                <div class="quick-petition-header" style="
                    background-color: #fff;
                    border-bottom: 1px solid #e0e0e0;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; font-size: 1.5em; color: #2c3e50; font-weight: bold;">HIZLI DİLEKÇE</h3>
                    <div class="quick-petition-close" style="
                        cursor: pointer;
                        font-size: 1.2em;
                        opacity: 0.8;
                        transition: opacity 0.3s;
                        color: #2c3e50;
                    "><i class="fas fa-times"></i></div>
                </div>
                
                <div class="quick-petition-content" style="
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    gap: 20px;
                ">
                    <div class="quick-petition-left-panel" style="
                        width: 30%;
                        display: flex;
                        flex-direction: column;
                    ">
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Mahkeme Bilgisi:</label>
                            <input type="text" class="petition-mahkeme" value="${mahkemeBilgisi}" style="
                                width: 100%;
                                padding: 8px;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                            ">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Dosya No:</label>
                            <input type="text" class="petition-dava-no" value="${davaNo}" style="
                                width: 100%;
                                padding: 8px;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                            ">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Müvekkil Bilgisi:</label>
                            <select class="petition-muvekkil" style="
                                width: 100%;
                                padding: 10px;
                                border: 2px solid #e0e0e0;
                                border-radius: 5px;
                                font-size: 1em;
                                transition: border-color 0.3s;
                            ">
                                <option value="">-- Müvekkil Seçiniz --</option>
                                ${taraflar.map(taraf => 
                                    `<option value="${taraf.ad}" data-rol="${taraf.tip}" data-kisikurum="${taraf.kisiKurum || 'Kişi'}">${taraf.tip} - ${taraf.ad}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Vekil Bilgisi:</label>
                            <select class="petition-vekil" style="
                                width: 100%;
                                padding: 10px;
                                border: 2px solid #e0e0e0;
                                border-radius: 5px;
                                font-size: 1em;
                                transition: border-color 0.3s;
                            ">
                                <option value="">-- Vekil Seçiniz --</option>
                                ${extractVekilBilgileri(taraflar).map(vekil => 
                                    `<option value="${vekil.ad}" data-taraf="${vekil.taraf}">${vekil.taraf} Vekili - ${vekil.ad}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Dilekçe Türü:</label>
                            <select class="petition-type" style="
                                width: 100%;
                                padding: 10px;
                                border: 2px solid #e0e0e0;
                                border-radius: 5px;
                                font-size: 1em;
                                transition: border-color 0.3s;
                            ">
                                <option value="durusmaMazeret">Duruşma Mazeret Dilekçesi</option>
                                <option value="beyandaDavet">Beyanda Bulunma Davet Dilekçesi</option>
                                <option value="dosyaInceleme">Dosya İnceleme Talebi</option>
                                <option value="sureUzatma">Süre Uzatma Talebi</option>
                                <option value="bilirkisiItiraz">Bilirkişi Raporuna İtiraz</option>
                                <option value="taniksiz">Tanıksız Duruşma Yapılması Talebi</option>
                            </select>
                        </div>
                        
                        <div class="form-actions" style="
                            display: flex;
                            justify-content: center;
                            gap: 15px;
                            margin-top: auto;
                            padding-top: 25px;
                        ">
                            <button class="download-petition-btn" style="
                                padding: 10px 20px;
                                background-color: #3498db;
                                color: #fff;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                transition: background-color 0.3s;
                            ">İndir</button>
                            
                            <button class="save-petition-btn" style="
                                padding: 10px 20px;
                                background-color: #28a745;
                                color: #fff;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                transition: background-color 0.3s;
                            ">Kaydet</button>
                        </div>
                    </div>
                    
                    <div class="quick-petition-right-panel" style="
                        width: 70%;
                        display: flex;
                        flex-direction: column;
                    ">
                        <div class="form-group" style="
                            margin-bottom: 15px;
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                        ">
                            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Dilekçe İçeriği:</label>
                            <div class="editor-toolbar" style="
                                display: flex;
                                flex-wrap: wrap;
                                gap: 5px;
                                margin-bottom: 8px;
                                padding: 10px;
                                background: #f8f9fa;
                                border: 1px solid #e0e0e0;
                                border-radius: 5px 5px 0 0;
                            ">
                                <!-- Text Formatting -->
                                <div class="toolbar-group" style="display: flex; gap: 2px; margin-right: 8px;">
                                    <button type="button" data-action="bold" title="Kalın" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-bold"></i></button>
                                    <button type="button" data-action="italic" title="İtalik" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-italic"></i></button>
                                    <button type="button" data-action="underline" title="Altı Çizili" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-underline"></i></button>
                                    <button type="button" data-action="strikethrough" title="Üstü Çizili" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-strikethrough"></i></button>
                                </div>
                                
                                <!-- Paragraph Formatting -->
                                <div class="toolbar-group" style="display: flex; gap: 2px; margin-right: 8px;">
                                    <button type="button" data-action="justifyLeft" title="Sola Hizala" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-align-left"></i></button>
                                    <button type="button" data-action="justifyCenter" title="Ortala" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-align-center"></i></button>
                                    <button type="button" data-action="justifyRight" title="Sağa Hizala" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-align-right"></i></button>
                                    <button type="button" data-action="justifyFull" title="İki Yana Yasla" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-align-justify"></i></button>
                                </div>
                                
                                <!-- Lists -->
                                <div class="toolbar-group" style="display: flex; gap: 2px; margin-right: 8px;">
                                    <button type="button" data-action="insertUnorderedList" title="Madde İşaretleri" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-list-ul"></i></button>
                                    <button type="button" data-action="insertOrderedList" title="Numaralandırma" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-list-ol"></i></button>
                                    <button type="button" data-action="indent" title="Girinti Artır" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-indent"></i></button>
                                    <button type="button" data-action="outdent" title="Girinti Azalt" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-outdent"></i></button>
                                </div>
                                
                                <!-- Font & Size -->
                                <div class="toolbar-group" style="display: flex; gap: 2px; margin-right: 8px;">
                                    <select data-action="fontName" title="Yazı Tipi" style="
                                        padding: 8px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: border-color 0.3s;
                                    ">
                                        <option value="Arial">Arial</option>
                                        <option value="Times New Roman" selected>Times New Roman</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Tahoma">Tahoma</option>
                                        <option value="Calibri">Calibri</option>
                                    </select>
                                    <select data-action="fontSize" title="Yazı Boyutu" style="
                                        padding: 8px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: border-color 0.3s;
                                    ">
                                        <option value="1">8pt</option>
                                        <option value="2">10pt</option>
                                        <option value="3" selected>12pt</option>
                                        <option value="4">14pt</option>
                                        <option value="5">18pt</option>
                                        <option value="6">24pt</option>
                                        <option value="7">36pt</option>
                                    </select>
                                </div>
                                
                                <!-- Additional Features -->
                                <div class="toolbar-group" style="display: flex; gap: 2px; margin-right: 8px;">
                                    <button type="button" data-action="removeFormat" title="Biçimlendirmeyi Kaldır" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-eraser"></i></button>
                                    <button type="button" data-action="insertHorizontalRule" title="Yatay Çizgi" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    "><i class="fas fa-minus"></i></button>
                                </div>
                                
                                <!-- Line Spacing Controls -->
                                <div class="toolbar-group" style="display: flex; gap: 2px; margin-right: 8px;">
                                    <button type="button" data-action="lineSpacing" data-value="1" title="Tek Satır Aralığı" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    ">1.0</button>
                                    <button type="button" data-action="lineSpacing" data-value="1.5" title="1.5 Satır Aralığı" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    ">1.5</button>
                                    <button type="button" data-action="lineSpacing" data-value="2" title="Çift Satır Aralığı" style="
                                        padding: 8px 12px;
                                        background: #fff;
                                        border: 1px solid #e0e0e0;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: background-color 0.3s;
                                    ">2.0</button>
                                </div>
                            </div>
                            <div class="petition-content-wrapper" style="
                                border: 2px solid #e0e0e0;
                                border-top: none;
                                border-radius: 0 0 5px 5px;
                                flex: 1;
                                display: flex;
                                flex-direction: column;
                            ">
                                <div class="petition-content" contenteditable="true" style="
                                    width: 100%;
                                    flex: 1;
                                    min-height: 500px;
                                    padding: 15px;
                                    font-family: inherit;
                                    font-size: 14px;
                                    line-height: 1.5;
                                    overflow-y: auto;
                                    outline: none;
                                "></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Popup'ı sayfaya ekle
        document.body.appendChild(popupContainer);
        
        // Kapatma butonuna tıklama olayı
        const closeButton = popupContainer.querySelector('.quick-petition-close');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(popupContainer);
        });
        
        // ESC tuşu ile kapatma
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(popupContainer);
                document.removeEventListener('keydown', handleEscKey);
            }
        };
        document.addEventListener('keydown', handleEscKey);
        
        // Dilekçe türü değiştiğinde içeriği güncelle
        const petitionTypeSelect = popupContainer.querySelector('.petition-type');
        const petitionMuvekkilSelect = popupContainer.querySelector('.petition-muvekkil');
        const petitionContentDiv = popupContainer.querySelector('.petition-content');
        
        petitionTypeSelect.addEventListener('change', () => {
            const selectedType = petitionTypeSelect.value;
            const selectedMuvekkil = petitionMuvekkilSelect.value;
            const selectedOption = petitionMuvekkilSelect.options[petitionMuvekkilSelect.selectedIndex];
            const selectedMuvekkilRol = selectedOption ? selectedOption.getAttribute('data-rol') || '' : '';
            const selectedMuvekkilKisiKurum = selectedOption ? selectedOption.getAttribute('data-kisikurum') || 'Kişi' : 'Kişi';
            
            // Vekil bilgisini al
            const petitionVekilSelect = popupContainer.querySelector('.petition-vekil');
            const selectedVekil = petitionVekilSelect.value;
            const selectedVekilOption = petitionVekilSelect.options[petitionVekilSelect.selectedIndex];
            const selectedVekilTaraf = selectedVekilOption ? selectedVekilOption.getAttribute('data-taraf') || '' : '';
            
            const templateContent = generatePetitionTemplate(
                selectedType, 
                davaNo, 
                mahkemeBilgisi, 
                taraflar, 
                selectedMuvekkil, 
                selectedMuvekkilRol,
                selectedMuvekkilKisiKurum,
                selectedVekil,
                selectedVekilTaraf
            );
            
            petitionContentDiv.innerHTML = templateContent.replace(/\n/g, '<br>');
        });
        
        // Müvekkil seçildiğinde içeriği güncelle
        petitionMuvekkilSelect.addEventListener('change', () => {
            const selectedType = petitionTypeSelect.value;
            const selectedMuvekkil = petitionMuvekkilSelect.value;
            const selectedOption = petitionMuvekkilSelect.options[petitionMuvekkilSelect.selectedIndex];
            const selectedMuvekkilRol = selectedOption ? selectedOption.getAttribute('data-rol') || '' : '';
            const selectedMuvekkilKisiKurum = selectedOption ? selectedOption.getAttribute('data-kisikurum') || 'Kişi' : 'Kişi';
            
            // Vekil bilgisini al
            const petitionVekilSelect = popupContainer.querySelector('.petition-vekil');
            const selectedVekil = petitionVekilSelect.value;
            const selectedVekilOption = petitionVekilSelect.options[petitionVekilSelect.selectedIndex];
            const selectedVekilTaraf = selectedVekilOption ? selectedVekilOption.getAttribute('data-taraf') || '' : '';
            
            const templateContent = generatePetitionTemplate(
                selectedType, 
                davaNo, 
                mahkemeBilgisi, 
                taraflar, 
                selectedMuvekkil, 
                selectedMuvekkilRol,
                selectedMuvekkilKisiKurum,
                selectedVekil,
                selectedVekilTaraf
            );
            
            petitionContentDiv.innerHTML = templateContent.replace(/\n/g, '<br>');
        });
        
        // Vekil seçildiğinde içeriği güncelle
        const petitionVekilSelect = popupContainer.querySelector('.petition-vekil');
        petitionVekilSelect.addEventListener('change', () => {
            const selectedType = petitionTypeSelect.value;
            const selectedMuvekkil = petitionMuvekkilSelect.value;
            const selectedOption = petitionMuvekkilSelect.options[petitionMuvekkilSelect.selectedIndex];
            const selectedMuvekkilRol = selectedOption ? selectedOption.getAttribute('data-rol') || '' : '';
            const selectedMuvekkilKisiKurum = selectedOption ? selectedOption.getAttribute('data-kisikurum') || 'Kişi' : 'Kişi';
            
            // Vekil bilgisini al
            const selectedVekil = petitionVekilSelect.value;
            const selectedVekilOption = petitionVekilSelect.options[petitionVekilSelect.selectedIndex];
            const selectedVekilTaraf = selectedVekilOption ? selectedVekilOption.getAttribute('data-taraf') || '' : '';
            
            const templateContent = generatePetitionTemplate(
                selectedType, 
                davaNo, 
                mahkemeBilgisi, 
                taraflar, 
                selectedMuvekkil, 
                selectedMuvekkilRol,
                selectedMuvekkilKisiKurum,
                selectedVekil,
                selectedVekilTaraf
            );
            
            petitionContentDiv.innerHTML = templateContent.replace(/\n/g, '<br>');
        });
        
        // İlk dilekçe şablonunu oluştur
        const initialTemplate = generatePetitionTemplate(petitionTypeSelect.value, davaNo, mahkemeBilgisi, taraflar);
        petitionContentDiv.innerHTML = initialTemplate.replace(/\n/g, '<br>');
        
        // Editor butonlarına tıklama olayları
        const editorButtons = popupContainer.querySelectorAll('.editor-toolbar button, .editor-toolbar select');
        editorButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.tagName === 'BUTTON') {
                    // Button tıklandığında butonun rengini değiştir (aktif olduğunu göstermek için)
                    const allButtons = popupContainer.querySelectorAll('.editor-toolbar button');
                    
                    // Sadece toggle edilebilir butonlar için (bold, italic, underline, vb.)
                    const toggleActions = ['bold', 'italic', 'underline', 'strikethrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'];
                    
                    if (toggleActions.includes(button.dataset.action)) {
                        // Mevcut aktif durumu kontrol et
                        const isCurrentlyActive = button.classList.contains('active-button');
                        
                        // Aynı grup içindeki diğer butonları kontrol et (alignment butonları için)
                        if (button.dataset.action.startsWith('justify')) {
                            const alignmentButtons = popupContainer.querySelectorAll('.editor-toolbar button[data-action^="justify"]');
                            alignmentButtons.forEach(b => {
                                b.classList.remove('active-button');
                                b.style.backgroundColor = '#fff';
                            });
                        }
                        
                        // Butonun aktif durumunu değiştir
                        if (!isCurrentlyActive) {
                            button.classList.add('active-button');
                            button.style.backgroundColor = '#e2e8f0';
                        } else {
                            button.classList.remove('active-button');
                            button.style.backgroundColor = '#fff';
                        }
                    }
                    
                    // Command'i çalıştır
                    document.execCommand(button.dataset.action, false, null);
                    
                    // İçerik değiştiğinde focus'u tekrar içeriğe getir
                    petitionContentDiv.focus();
                }
            });
            
            if (button.tagName === 'SELECT') {
                button.addEventListener('change', () => {
                    document.execCommand(button.dataset.action, false, button.value);
                    // İçerik değiştiğinde focus'u tekrar içeriğe getir
                    petitionContentDiv.focus();
                });
            }
        });
        
        // İndir butonuna tıklama olayı
        const downloadButton = popupContainer.querySelector('.download-petition-btn');
        downloadButton.addEventListener('click', () => {
            const petitionContent = petitionContentDiv.innerHTML;
            const petitionData = {
                mahkeme: popupContainer.querySelector('.petition-mahkeme').value,
                davaNo: popupContainer.querySelector('.petition-dava-no').value,
                type: petitionTypeSelect.options[petitionTypeSelect.selectedIndex].text,
                content: petitionContent,
                date: new Date().toLocaleDateString('tr-TR')
            };
            
            // UDF formatında indir
            downloadAsUDF(petitionData);
        });
        
        // Kaydet butonuna tıklama olayı
        const saveButton = popupContainer.querySelector('.save-petition-btn');
        saveButton.addEventListener('click', () => {
            const petitionContent = petitionContentDiv.innerHTML;
            const petitionData = {
                mahkeme: popupContainer.querySelector('.petition-mahkeme').value,
                davaNo: popupContainer.querySelector('.petition-dava-no').value,
                muvekkil: popupContainer.querySelector('.petition-muvekkil').value,
                muvekkilRol: popupContainer.querySelector('.petition-muvekkil').options[popupContainer.querySelector('.petition-muvekkil').selectedIndex]?.getAttribute('data-rol') || '',
                type: petitionTypeSelect.options[petitionTypeSelect.selectedIndex].text,
                content: petitionContent,
                date: new Date().toLocaleDateString('tr-TR')
            };
            
            // Chrome storage API ile dilekçeyi kaydet
            chrome.storage.local.get(['savedAssignments'], function(result) {
                let savedAssignments = result.savedAssignments || [];
                savedAssignments.push({
                    type: 'petition',
                    data: petitionData,
                    createdAt: new Date().toISOString()
                });
                
                chrome.storage.local.set({ savedAssignments: savedAssignments }, function() {
                    alert('Dilekçe başarıyla kaydedildi ve Görevlendirmeler bölümüne eklendi.');
                    // Kaydetme işlemi tamamlandığında event gönder
                    const assignmentsUpdateEvent = new CustomEvent('assignmentsDataUpdated', {
                        detail: { savedAssignments: savedAssignments }
                    });
                    window.dispatchEvent(assignmentsUpdateEvent);
                });
            });
        });
    }
    
    function downloadAsUDF(petitionData) {
        // Tarih formatını standartlaştır - DD/MM/YYYY formatına çevir (UDF standart formatı)
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        // İçeriği düzgün formata çevir - HTML etiketlerini kaldır ve satır sonlarını düzenle
        const cleanContent = petitionData.content
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<div>(.*?)<\/div>/gi, '$1\n')
            .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\n{3,}/g, '\n\n') // Üç veya daha fazla satır sonunu iki satır sonuna indir
            .trim();
        
        // XML tabanlı UDF formatı
        const udfContent = `<?xml version="1.0" encoding="UTF-8" ?> 

<template format_id="1.7" >
<content><![CDATA[${petitionData.mahkeme.trim().toUpperCase()}
Dosya No: ${petitionData.davaNo.trim()}

${petitionData.type.trim().toUpperCase()}

${cleanContent}

${formattedDate}
Av. ${document.querySelector('.layout-header-user-info-name')?.textContent.trim() || 'BAHİTTİN FURKAN TOROS'}
${petitionData.muvekkil ? `${petitionData.muvekkilRol} ${petitionData.muvekkil} Vekili` : ''}
]]></content>
<properties>
<pageFormat mediaSizeName="1" leftMargin="42.52" rightMargin="42.52" topMargin="42.52" bottomMargin="14.17" paperOrientation="1" headerFOffset="20.0" footerFOffset="20.0" />
</properties>
<elements>
</elements>
<styles>
<style name="default" bold="false" italic="false" description="Geçerli" family="Times New Roman" size="12" foreground="-13421773" />
</styles>
<data>
<mahkeme>${petitionData.mahkeme.trim()}</mahkeme>
<dosyaNo>${petitionData.davaNo.trim()}</dosyaNo>
<dilekce_turu>${petitionData.type.trim()}</dilekce_turu>
<muvekkil>${(petitionData.muvekkil || '').trim()}</muvekkil>
<tarih>${formattedDate}</tarih>
</data>
</template>`;
        
        // Dosya oluştur ve indir
        const blob = new Blob([udfContent], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // Dosya adı formatını standartlaştır
        const fileName = `${petitionData.davaNo.replace(/[\/:.]/g, '_')}_${petitionData.type.trim().toLowerCase().replace(/\s+/g, '_')}.udf`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
    
    function generatePetitionTemplate(type, davaNo, mahkemeBilgisi, taraflar, selectedMuvekkil, selectedMuvekkilRol, selectedMuvekkilKisiKurum, selectedVekil, selectedVekilTaraf) {
        // Avukat bilgilerini al
        const avukatAdi = selectedVekil || '(Vekil)';
        
        // Tarih bilgisini oluştur
        const tarih = new Date().toLocaleDateString('tr-TR');
        
        // Müvekkil bilgilerini al
        const muvekkilAdi = selectedMuvekkil || '(Müvekkil)';
        
        // Müvekkilin taraf bilgisini al
        const tarafTipi = selectedMuvekkilRol || selectedVekilTaraf || '';
        
        // Kişi mi kurum mu?
        const kisiKurum = selectedMuvekkilKisiKurum || 'Kişi';
        
        // Dilekçe şablonları
        let templateContent = '';
        
        // Türkçe karakterleri düzgün şekilde büyük harfe çeviren fonksiyon
        function toTurkishUpperCase(text) {
            return text.replace(/i/g, 'İ')
                      .replace(/ı/g, 'I')
                      .replace(/ğ/g, 'Ğ')
                      .replace(/ü/g, 'Ü')
                      .replace(/ş/g, 'Ş')
                      .replace(/ö/g, 'Ö')
                      .replace(/ç/g, 'Ç')
                      .toUpperCase();
        }
        
        // Mahkeme adını düzgün şekilde büyük harfe çevir
        const mahkemeUpper = toTurkishUpperCase(mahkemeBilgisi);
        
        // Dilekçenin üst kısmını oluştur (mahkeme adı ortalı ve sonunda 'NE ibaresi)
        const dilekceBaslik = `<div style="text-align: center; font-weight: bold; margin-bottom: 20px; font-size: 14px;">${mahkemeUpper}'NE</div><br>`;

        // Sabit genişlikte başlık ve değerler için tablo stili kullanıyoruz (şimdi iki nokta kalın olacak)
        const dosyaNoSatiri = `<div style="display: flex; margin-bottom: 0px;"><div style="width: 150px; font-weight: bold;">Dosya No</div><div style="width: 30px; text-align: center;"><b>:</b></div><div>${davaNo}</div></div><br>`;
        
        // Taraf satırı - müvekkilin rolüne göre başlık belirle
        const tarafBilgisiBaslik = tarafTipi || 'Taraf';
        const tarafSatiri = `<div style="display: flex; margin-bottom: 0px;"><div style="width: 150px; font-weight: bold;">${tarafBilgisiBaslik}</div><div style="width: 30px; text-align: center;"><b>:</b></div><div>${muvekkilAdi}</div></div><br>`;
        
        // Vekil satırı
        const vekilSatiri = `<div style="display: flex; margin-bottom: 0px;"><div style="width: 150px; font-weight: bold;">Vekili</div><div style="width: 30px; text-align: center;"><b>:</b></div><div>Av. ${avukatAdi}</div></div>`;
        
        // Konu satırı
        let konuIcerik = '';
        switch(type) {
            case 'durusmaMazeret':
                konuIcerik = 'Mazeret dilekçemizin ibrazından ve mazeret taleplerimizin kabulüne karar verilmesi taleplerimizden ibaret dilekçemizdir.';
                break;
            case 'beyandaDavet':
                konuIcerik = 'Karşı tarafın beyanda bulunmaya davet edilmesi talebi hakkında dilekçemizdir.';
                break;
            case 'dosyaInceleme':
                konuIcerik = 'Dosya inceleme talebi hakkında dilekçemizdir.';
                break;
            case 'sureUzatma':
                konuIcerik = 'Süre uzatımı talebi hakkında dilekçemizdir.';
                break;
            case 'bilirkisiItiraz':
                konuIcerik = 'Bilirkişi raporuna itiraz dilekçemizdir.';
                break;
            case 'taniksiz':
                konuIcerik = 'Tanıksız duruşma yapılması talebi hakkında dilekçemizdir.';
                break;
            default:
                konuIcerik = '';
        }
        
        // Kullanıcının istediği düzende konu satırı
        const konuSatiri = `<div style="margin-bottom: 5px;"><br>    <div style="font-weight: bold; display: flex;"><br>        <div style="width: 150px;">Konu</div><br>        <div style="width: 30px; text-align: center;">:</div><br>    </div>    <div style="margin-top: 5px; text-align: justify;">${konuIcerik}</div></div>`;
        
        // Açıklamalar satırı başlığı
        const aciklamalarBaslik = `<div style="display: flex; margin-bottom: 0px; margin-top: 20px;"><div style="width: 150px; font-weight: bold;">Açıklamalar</div><div style="width: 30px; text-align: center;"><b>:</b></div><div></div></div>`;
        
        // Dilekçe içeriğini oluştur
        let dilekceIcerik = '';
        
        // Şablon türüne göre içeriği oluştur
        switch(type) {
            case 'durusmaMazeret':
                dilekceIcerik = `<div style="margin-top: 5px; text-align: justify; line-height: 1.5;">04.04.2025 tarihinde görülecek olan duruşmaya, önceden planlanmış başka bir duruşma sebebiyle katılamayacağımı bildirir, mazeretimin kabulünü arz ederim.<br></div><br>`;
                break;
                
            case 'beyandaDavet':
                dilekceIcerik = `<div style="margin-top: 5px; text-align: justify; line-height: 1.5;">Dava dosyasında müvekkilim ${muvekkilAdi} hakkında ileri sürülen iddialara karşı beyanda bulunmak üzere, davalı tarafın / davacı tarafın çağrılmasını arz ederim.<br></div><br>`;
                break;
                
            case 'dosyaInceleme':
                dilekceIcerik = `<div style="margin-top: 5px; text-align: justify; line-height: 1.5;">Sayın mahkeme nezdinde görülmekte olan ${davaNo} sayılı dava dosyasını incelemek istediğimi bildirir, gereğini arz ederim.<br></div><br>`;
                break;
                
            case 'sureUzatma':
                dilekceIcerik = `<div style="margin-top: 5px; text-align: justify; line-height: 1.5;">Sayın mahkemenizce müvekkilime tanınan savunma/cevap verme süresinin, delil toplama sürecinde yaşanan zorluklar nedeniyle 2 hafta daha uzatılmasını arz ederim.<br></div><br>`;
                break;
                
            case 'bilirkisiItiraz':
                dilekceIcerik = `<div style="margin-top: 5px; text-align: justify; line-height: 1.5;">Dosyada sunulan bilirkişi raporuna aşağıdaki gerekçelerle itiraz ediyorum:
<ol style="margin-top: 10px; margin-bottom: 10px;">
<li>İtiraz gerekçesi 1</li>
<li>İtiraz gerekçesi 2</li>
<li>İtiraz gerekçesi 3</li>
</ol>
Bu sebeplerle, yeni bir bilirkişi raporu alınmasını talep ederim.<br></div><br>`;
                break;
                
            case 'taniksiz':
                dilekceIcerik = `<div style="margin-top: 5px; text-align: justify; line-height: 1.5;">Dava konusu uyuşmazlığın tanık beyanlarına ihtiyaç duyulmaksızın çözülebilecek nitelikte olduğundan duruşmanın tanıksız olarak yapılmasını talep ederim.<br></div><br>`;
                break;
                
            default:
                dilekceIcerik = `<div style="margin-top: 5px; text-align: justify; line-height: 1.5;">[Dilekçe içeriği buraya girilecek]<br></div><br>`;
        }
        
        // İmza kısmını oluştur - kullanıcının istediği düzene göre
        const imzaKismi = `<div style="margin-top: 30px; text-align: right;"><br><div style="font-weight: bold;">Av. ${toTurkishUpperCase(avukatAdi)}</div><div style="font-weight: bold;">${tarafTipi} ${toTurkishUpperCase(muvekkilAdi)} Vekili</div><br></div>`;

        // Tüm şablonu bir araya getir
        templateContent = `${dilekceBaslik}${dosyaNoSatiri}${tarafSatiri}${vekilSatiri}${konuSatiri}${aciklamalarBaslik}${dilekceIcerik}${imzaKismi}`;

        return templateContent;
    }

    // Sayfa yüklendiğinde çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addQuickPetitionButton);
    } else {
        addQuickPetitionButton();
    }

    // Temizleme fonksiyonu (gerekirse)
    window.addEventListener('beforeunload', () => {
        if (window.UYAP_ASISTAN.intervalId) {
            clearInterval(window.UYAP_ASISTAN.intervalId);
        }
    });
} else {
    console.log('UYAP Asistan: Zaten yüklenmiş, tekrar yüklenmeyecek');
}

// Ağ isteklerini izlemek için kullanılan fonksiyonları yükle
(function loadNetworkMonitor() {
    try {
        // Önce temp_functions.js dosyasını yükle
        const scriptElement = document.createElement('script');
        scriptElement.src = chrome.runtime.getURL('temp_functions.js');
        scriptElement.onload = function() {
            // Dosya yüklendikten sonra monitorUYAPNetworkRequests fonksiyonunu çalıştır
            const initScript = document.createElement('script');
            initScript.textContent = `
                // Ağ izleme fonksiyonunu başlat
                if (typeof monitorUYAPNetworkRequests === 'function') {
                    monitorUYAPNetworkRequests();
                    console.log('UYAP Asistan: Ağ izleme fonksiyonu başlatıldı');
                } else {
                    console.error('UYAP Asistan: monitorUYAPNetworkRequests fonksiyonu bulunamadı');
                }
            `;
            document.head.appendChild(initScript);
            console.log('UYAP Asistan: Network izleme başlatıldı');
        };
        scriptElement.onerror = function() {
            console.error('UYAP Asistan: temp_functions.js dosyası yüklenemedi');
        };
        document.head.appendChild(scriptElement);
    } catch (error) {
        console.error('UYAP Asistan: Network izleme başlatılırken hata:', error);
    }
})();

// Taraf bilgilerinden vekil bilgilerini çıkaran fonksiyon
function extractVekilBilgileri(taraflar) {
    const vekiller = [];
    
    taraflar.forEach(taraf => {
        if (taraf.vekil && taraf.vekil.trim()) {
            // Vekil bilgisi formatlarda farklı olabilir, hem [] içinde hem de normal yazı olabilir
            const vekilMatches = taraf.vekil.match(/\[(.*?)\]|[^\[\]]+/g);
            
            if (vekilMatches) {
                vekilMatches.forEach(match => {
                    // [] işaretlerini temizle
                    const vekilAd = match.replace(/[\[\]]/g, '').trim();
                    
                    if (vekilAd && !vekiller.some(v => v.ad === vekilAd)) {
                        vekiller.push({
                            ad: vekilAd,
                            taraf: taraf.tip
                        });
                    }
                });
            }
        }
    });
    
    return vekiller;
}

// Editor için Tab tuşu desteği ve başlangıç ayarlarını ekle
function setupEditor(petitionContentDiv) {
    // Times New Roman ve 12 punto ayarları
    petitionContentDiv.style.fontFamily = 'Times New Roman';
    petitionContentDiv.style.fontSize = '12pt';
    petitionContentDiv.style.lineHeight = '1.5'; // Varsayılan satır aralığını 1.5 yap
    
    // Tab tuşu desteği
    petitionContentDiv.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            
            // Seçili metin yerine tab ekle
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    });
    
    // Başlangıçta iki yana yasla ayarını uygula
    setTimeout(() => {
        document.execCommand('justifyFull', false, null);
        
        // İki yana yasla butonunu aktif olarak işaretle
        const justifyFullButton = document.querySelector('button[data-action="justifyFull"]');
        if (justifyFullButton) {
            justifyFullButton.classList.add('active-button');
            justifyFullButton.style.backgroundColor = '#e2e8f0';
            
            // Diğer hizalama butonlarını deaktif yap
            const alignmentButtons = document.querySelectorAll('button[data-action^="justify"]:not([data-action="justifyFull"])');
            alignmentButtons.forEach(button => {
                button.classList.remove('active-button');
                button.style.backgroundColor = '#fff';
            });
        }
        
        // 1.5 satır aralığı butonunu varsayılan olarak aktif yap
        const lineSpacingButton = document.querySelector('button[data-action="lineSpacing"][data-value="1.5"]');
        if (lineSpacingButton) {
            lineSpacingButton.classList.add('active-button');
            lineSpacingButton.style.backgroundColor = '#e2e8f0';
        }
    }, 100);
}

// Düzenleyici toolbar butonlarına satır aralığı işlevselliği ekle
function updateEditorButtonHandlers(popupContainer) {
    const editorButtons = popupContainer.querySelectorAll('.editor-toolbar button, .editor-toolbar select');
    const petitionContentDiv = popupContainer.querySelector('.petition-content');
    
    editorButtons.forEach(button => {
        if (button.tagName === 'BUTTON') {
            // Mevcut olay dinleyicilerini kaldır
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', () => {
                // Satır aralığı butonları için özel işlev
                if (newButton.dataset.action === 'lineSpacing') {
                    const lineHeight = newButton.dataset.value;
                    
                    // Satır aralığı butonlarını sıfırla
                    const lineSpacingButtons = popupContainer.querySelectorAll('button[data-action="lineSpacing"]');
                    lineSpacingButtons.forEach(btn => {
                        btn.classList.remove('active-button');
                        btn.style.backgroundColor = '#fff';
                    });
                    
                    // Tıklanan butonu aktif yap
                    newButton.classList.add('active-button');
                    newButton.style.backgroundColor = '#e2e8f0';
                    
                    // Seçili metne veya tüm içeriğe satır aralığı uygula
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0 && !selection.isCollapsed) {
                        // Seçili metin varsa
                        try {
                            const selectedNodes = [];
                            const range = selection.getRangeAt(0);
                            
                            // Tüm seçili elemanları işle
                            const container = range.commonAncestorContainer;
                            
                            if (container.nodeType === 3) {
                                // Metin düğümü ise
                                if (container.parentNode) {
                                    container.parentNode.style.lineHeight = lineHeight;
                                }
                            } else if (container.nodeType === 1) {
                                // Element ise
                                const walker = document.createTreeWalker(
                                    container,
                                    NodeFilter.SHOW_ELEMENT,
                                    null,
                                    false
                                );
                                
                                let node;
                                while (node = walker.nextNode()) {
                                    if (range.intersectsNode(node)) {
                                        node.style.lineHeight = lineHeight;
                                    }
                                }
                                
                                // Ayrıca container'ın kendisini de ayarla
                                container.style.lineHeight = lineHeight;
                            }
                        } catch (error) {
                            console.error('Satır aralığı uygulanırken hata:', error);
                            // Hata durumunda tüm içeriğe uygula
                            petitionContentDiv.style.lineHeight = lineHeight;
                        }
                    } else {
                        // Seçim yoksa veya hata durumunda tüm içeriğe uygula
                        petitionContentDiv.style.lineHeight = lineHeight;
                        
                        // İçindeki tüm div'lere de uygula
                        const allDivs = petitionContentDiv.querySelectorAll('div');
                        allDivs.forEach(div => {
                            div.style.lineHeight = lineHeight;
                        });
                    }
                    
                    petitionContentDiv.focus();
                } else {
                    // Button tıklandığında butonun rengini değiştir (aktif olduğunu göstermek için)
                    // Sadece toggle edilebilir butonlar için (bold, italic, underline, vb.)
                    const toggleActions = ['bold', 'italic', 'underline', 'strikethrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'];
                    
                    if (toggleActions.includes(newButton.dataset.action)) {
                        // Mevcut aktif durumu kontrol et
                        const isCurrentlyActive = newButton.classList.contains('active-button');
                        
                        // Aynı grup içindeki diğer butonları kontrol et (alignment butonları için)
                        if (newButton.dataset.action.startsWith('justify')) {
                            const alignmentButtons = popupContainer.querySelectorAll('.editor-toolbar button[data-action^="justify"]');
                            alignmentButtons.forEach(b => {
                                b.classList.remove('active-button');
                                b.style.backgroundColor = '#fff';
                            });
                        }
                        
                        // Butonun aktif durumunu değiştir
                        if (!isCurrentlyActive) {
                            newButton.classList.add('active-button');
                            newButton.style.backgroundColor = '#e2e8f0';
                        } else {
                            newButton.classList.remove('active-button');
                            newButton.style.backgroundColor = '#fff';
                        }
                    }
                    
                    // Command'i çalıştır
                    document.execCommand(newButton.dataset.action, false, null);
                }
                
                // İçerik değiştiğinde focus'u tekrar içeriğe getir
                petitionContentDiv.focus();
            });
        } else if (button.tagName === 'SELECT') {
            // Select elementleri için işlevselliği güncelle
            const newSelect = button.cloneNode(true);
            button.parentNode.replaceChild(newSelect, button);
            
            newSelect.addEventListener('change', () => {
                document.execCommand(newSelect.dataset.action, false, newSelect.value);
                // İçerik değiştiğinde focus'u tekrar içeriğe getir
                petitionContentDiv.focus();
            });
        }
    });
}

function showQuickPetitionPopup(davaNo, mahkemeBilgisi, taraflar) {
    // ... existing code ...
    
    // Başlangıçta editörü ayarla ve içeriği yükle
    const petitionContentDiv = popupContainer.querySelector('.petition-content');
    
    // Tab tuşu ve başlangıç ayarlarını ekle
    setupEditor(petitionContentDiv);
    
    // Toolbar butonlarına satır aralığı kontrolü işlevselliği ekle
    updateEditorButtonHandlers(popupContainer);
    
    // İlk dilekçe şablonunu oluştur ve içeriği ayarla
    const initialTemplate = generatePetitionTemplate(petitionTypeSelect.value, davaNo, mahkemeBilgisi, taraflar);
    petitionContentDiv.innerHTML = initialTemplate;
    
    // ... existing code ...
} 
