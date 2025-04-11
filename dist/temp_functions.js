// Kodu mevcut durumda düzeltecek yeni bir fonksiyon ekleyeceğim

// Temp functions for testing and debugging

// Wrapper function to monitor network requests and extract file IDs
function monitorUYAPNetworkRequests() {
    console.log('UYAP Asistan: Network monitoring başlatıldı');
    
    // Create a proxy for the XMLHttpRequest object
    const originalXHR = window.XMLHttpRequest;
    
    // Override the XMLHttpRequest constructor
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        
        // Override the open method to capture URL
        xhr.open = function() {
            this._url = arguments[1]; // Store the URL
            return originalOpen.apply(this, arguments);
        };
        
        // Override the send method to capture payload
        xhr.send = function(data) {
            // If this is one of our target API endpoints
            if (this._url && (
                this._url.includes('dosya_islem_turleri_sorgula_brd.ajx') || 
                this._url.includes('dosyaAyrintiBilgileri_brd.ajx')
            )) {
                try {
                    const payload = data ? JSON.parse(data) : {};
                    // Extract and store the dosyaId
                    if (payload.dosyaId) {
                        console.log('UYAP Asistan: Dosya ID bulundu:', payload.dosyaId);
                        console.log('UYAP Asistan: Tam istek yükü:', payload);
                        
                        // Store the dosyaId in localStorage for easy access
                        localStorage.setItem('uyap_asistan_dosya_id', payload.dosyaId);
                        
                        // Dispatch an event so other parts of the extension can listen
                        window.dispatchEvent(new CustomEvent('uyapDosyaIdCaptured', {
                            detail: {
                                dosyaId: payload.dosyaId,
                                payload: payload,
                                endpoint: this._url
                            }
                        }));
                    }
                } catch (e) {
                    console.error('UYAP Asistan: İstek verilerini ayrıştırma hatası:', e);
                }
            }
            
            return originalSend.apply(this, arguments);
        };
        
        return xhr;
    };
    
    // Also monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // Check if this is one of our target endpoints
        if (url && (
            url.includes('dosya_islem_turleri_sorgula_brd.ajx') || 
            url.includes('dosyaAyrintiBilgileri_brd.ajx')
        )) {
            try {
                if (options && options.body) {
                    const payload = JSON.parse(options.body);
                    // Extract and store the dosyaId
                    if (payload.dosyaId) {
                        console.log('UYAP Asistan: Fetch ile Dosya ID bulundu:', payload.dosyaId);
                        console.log('UYAP Asistan: Fetch tam istek yükü:', payload);
                        
                        // Store the dosyaId in localStorage for easy access
                        localStorage.setItem('uyap_asistan_dosya_id', payload.dosyaId);
                        
                        // Dispatch an event so other parts of the extension can listen
                        window.dispatchEvent(new CustomEvent('uyapDosyaIdCaptured', {
                            detail: {
                                dosyaId: payload.dosyaId,
                                payload: payload,
                                endpoint: url
                            }
                        }));
                    }
                }
            } catch (e) {
                console.error('UYAP Asistan: Fetch verilerini ayrıştırma hatası:', e);
            }
        }
        
        return originalFetch.apply(this, arguments);
    };
    
    // Function to get the most recently captured Dosya ID
    window.getLatestDosyaId = function() {
        return localStorage.getItem('uyap_asistan_dosya_id');
    };
    
    // Function to make API requests using the captured dosyaId
    window.makeUYAPApiRequest = async function(endpoint, customPayload = {}) {
        const dosyaId = localStorage.getItem('uyap_asistan_dosya_id');
        
        if (!dosyaId) {
            console.error('UYAP Asistan: Dosya ID bulunamadı, lütfen önce bir dosya açın');
            return null;
        }
        
        // Create default payload with dosyaId
        const payload = {
            dosyaId: dosyaId,
            ...customPayload
        };
        
        try {
            const response = await fetch(`https://avukatbeta.uyap.gov.tr/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(payload),
                credentials: 'include' // Include cookies for authentication
            });
            
            return await response.json();
        } catch (error) {
            console.error('UYAP Asistan: API isteği hatası:', error);
            return null;
        }
    };
    
    // Özel API istekleri için yardımcı fonksiyon
    window.makeUYAPCustomApiRequest = async function(endpoint, method, customPayload = {}, contentType = 'application/json', customHeaders = {}) {
        const dosyaId = localStorage.getItem('uyap_asistan_dosya_id');
        
        if (!dosyaId && !customPayload.dosyaId) {
            console.error('UYAP Asistan: Dosya ID bulunamadı, lütfen önce bir dosya açın');
            return null;
        }
        
        // Create default payload with dosyaId if not provided
        const payload = {
            ...(customPayload.dosyaId ? {} : { dosyaId: dosyaId }),
            ...customPayload
        };
        
        // Headers oluştur
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'X-Requested-With': 'XMLHttpRequest',
            ...customHeaders
        };
        
        // FormData dışında Content-Type ekle
        if (!(payload instanceof FormData) && contentType) {
            headers['Content-Type'] = contentType;
        }
        
        try {
            let requestOptions = {
                method: method,
                headers: headers,
                credentials: 'include' // Include cookies for authentication
            };
            
            // POST, PUT vb. metodlarda body ekle
            if (method !== 'GET' && method !== 'HEAD') {
                if (payload instanceof FormData) {
                    requestOptions.body = payload;
                } else if (contentType.includes('application/json')) {
                    requestOptions.body = JSON.stringify(payload);
                } else {
                    requestOptions.body = payload;
                }
            }
            
            // GET metodu için query string oluştur
            let url = `https://avukatbeta.uyap.gov.tr/${endpoint}`;
            if (method === 'GET' && Object.keys(payload).length > 0) {
                const queryParams = new URLSearchParams();
                for (const key in payload) {
                    queryParams.append(key, payload[key]);
                }
                url += `?${queryParams.toString()}`;
            }
            
            const response = await fetch(url, requestOptions);
            
            // Yanıt içeriğini kontrol et
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('UYAP Asistan: API isteği hatası:', error);
            return null;
        }
    };
    
    // Function to get taraf bilgileri using captured dosyaId
    window.getUYAPTarafBilgileri = async function(dosyaId = null) {
        if (!dosyaId) {
            dosyaId = localStorage.getItem('uyap_asistan_dosya_id');
        }
        
        if (!dosyaId) {
            console.error('UYAP Asistan: Dosya ID bulunamadı, lütfen önce bir dosya açın');
            return null;
        }
        
        console.log('UYAP Asistan: Taraf bilgileri alınıyor, Dosya ID:', dosyaId);
        
        // API endpoint'lerini sırayla dene
        const endpoints = [
            {
                url: `Servis/DosyaTarafBilgileri`,
                method: 'GET',
                customPayload: { dosyaId: dosyaId }
            },
            {
                url: 'dosya_taraf_bilgileri_brd.ajx',
                method: 'POST',
                customPayload: { dosyaId: parseInt(dosyaId, 10) }
            },
            {
                url: 'services/dosya-taraf-bilgileri',
                method: 'POST',
                customPayload: (() => {
                    const fd = new FormData();
                    fd.append('dosyaId', dosyaId);
                    return fd;
                })(),
                contentType: null
            }
        ];
        
        // Her endpoint'i sırayla dene
        for (const endpoint of endpoints) {
            try {
                console.log(`UYAP Asistan: Taraf bilgileri ${endpoint.url} endpoint'inden alınıyor...`);
                
                const response = await window.makeUYAPCustomApiRequest(
                    endpoint.url, 
                    endpoint.method, 
                    endpoint.customPayload,
                    endpoint.contentType
                );
                
                console.log('UYAP Asistan: Taraf bilgileri yanıtı:', response);
                
                // Yanıtı kontrol et ve işle
                if (response) {
                    let tarafBilgileri = [];
                    
                    // API yanıtının formatını kontrol et ve uygun şekilde işle
                    if (Array.isArray(response)) {
                        tarafBilgileri = response.map(taraf => ({
                            tip: taraf.rol || '',
                            ad: taraf.adi || '',
                            vekil: taraf.vekil || '',
                            kisiKurum: taraf.kisiKurum || 'Kişi'
                        }));
                    } else if (response.data && Array.isArray(response.data)) {
                        tarafBilgileri = response.data.map(taraf => ({
                            tip: taraf.rol || '',
                            ad: taraf.adi || '',
                            vekil: taraf.vekil || '',
                            kisiKurum: taraf.kisiKurum || 'Kişi'
                        }));
                    } else if (typeof response === 'object') {
                        const keys = Object.keys(response);
                        if (keys.length > 0) {
                            if (response.adi || response.rol) {
                                tarafBilgileri = [{
                                    tip: response.rol || '',
                                    ad: response.adi || '',
                                    vekil: response.vekil || '',
                                    kisiKurum: response.kisiKurum || 'Kişi'
                                }];
                            } else {
                                keys.forEach(key => {
                                    if (typeof response[key] === 'object' && response[key] !== null) {
                                        if (Array.isArray(response[key])) {
                                            const mappedData = response[key].map(item => ({
                                                tip: item.rol || '',
                                                ad: item.adi || '',
                                                vekil: item.vekil || '',
                                                kisiKurum: item.kisiKurum || 'Kişi'
                                            }));
                                            tarafBilgileri = tarafBilgileri.concat(mappedData);
                                        }
                                    }
                                });
                            }
                        }
                    }
                    
                    if (tarafBilgileri.length > 0) {
                        console.log('UYAP Asistan: Taraf bilgileri bulundu:', tarafBilgileri);
                        
                        // Taraf bilgilerini localStorage'a kaydet
                        localStorage.setItem('uyap_asistan_taraf_bilgileri', JSON.stringify(tarafBilgileri));
                        
                        // Event gönder
                        window.dispatchEvent(new CustomEvent('uyapTarafBilgileriGuncellendi', {
                            detail: {
                                tarafBilgileri: tarafBilgileri,
                                dosyaId: dosyaId
                            }
                        }));
                        
                        return tarafBilgileri;
                    }
                }
            } catch (error) {
                console.error(`UYAP Asistan: ${endpoint.url} endpoint'inden taraf bilgileri alınırken hata:`, error);
            }
        }
        
        console.error('UYAP Asistan: Taraf bilgileri alınamadı');
        return null;
    };
    
    // Function to get document list using captured dosyaId
    window.getUYAPDocumentList = async function() {
        const dosyaId = localStorage.getItem('uyap_asistan_dosya_id');
        
        if (!dosyaId) {
            console.error('UYAP Asistan: Dosya ID bulunamadı, lütfen önce bir dosya açın');
            return null;
        }
        
        try {
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
            console.log('UYAP Asistan: Evrak listesi alındı:', data);
            
            // Cache the document list for quick access
            if (data && data.status === 200) {
                localStorage.setItem('uyap_asistan_evrak_listesi', JSON.stringify(data));
                
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
            return null;
        }
    };
    
    // Function to analyze document list and extract key petition dates and information
    window.analyzeDosyaEvraklari = function(evrakListesi) {
        if (!evrakListesi || !evrakListesi.tumEvraklar) {
            return null;
        }
        
        const sonuclar = {
            davaDilekcesi: null,
            cevapDilekcesi: null,
            cevabaCevapDilekcesi: null,
            ikinciCevapDilekcesi: null,
            digerEvraklar: []
        };
        
        // Tüm dosya anahtarlarını döngüyle gez (dosya numaralarına göre gruplandırılmış)
        Object.keys(evrakListesi.tumEvraklar).forEach(dosyaKey => {
            const evraklar = evrakListesi.tumEvraklar[dosyaKey];
            
            // Her bir evrakı kontrol et
            evraklar.forEach(evrak => {
                const turLower = evrak.tur.toLowerCase();
                const tarih = evrak.sistemeGonderildigiTarih;
                
                // Evrak türüne göre sınıflandır
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
                } else {
                    // Diğer evraklar kategorisine ekle
                    sonuclar.digerEvraklar.push({
                        evrakId: evrak.evrakId,
                        ggEvrakId: evrak.ggEvrakId,
                        dosyaId: evrak.dosyaId,
                        tur: evrak.tur,
                        gonderenKisi: evrak.gonderenYerKisi,
                        tarih: tarih
                    });
                }
            });
        });
        
        return sonuclar;
    };
    
    console.log('UYAP Asistan: Network izleme başarıyla kuruldu');
    console.log('UYAP Asistan: getLatestDosyaId() ve makeUYAPApiRequest() fonksiyonları artık kullanılabilir');
}

// Usage instructions in console:
// 1. Call monitorUYAPNetworkRequests() to start monitoring
// 2. When a popup is opened, the dosyaId will be automatically captured
// 3. Use getLatestDosyaId() to get the current dosyaId
// 4. Use makeUYAPApiRequest(endpoint, customPayload) to make API requests with the captured dosyaId

console.log(
`UYAP Asistan: Dosya ID İzleme Aracı
----------------------------
Konsoldan şu fonksiyonları kullanabilirsiniz:

1. getLatestDosyaId() - En son yakalanan dosya ID'sini verir
2. makeUYAPApiRequest(endpoint, payload) - Yakalanan dosya ID ile API isteği yapar
3. getUYAPDocumentList() - Yakalanan dosya ID ile evrak listesini getirir
4. analyzeDosyaEvraklari(evrakListesi) - Evrak listesini analiz eder ve önemli dilekçeleri bulur

Örnek kullanımlar:
- Mevcut Dosya ID: ${localStorage.getItem('uyap_asistan_dosya_id') || 'Henüz yakalanmadı'}
- Dosya detayları: makeUYAPApiRequest('dosyaAyrintiBilgileri_brd.ajx')
- İşlem türleri: makeUYAPApiRequest('dosya_islem_turleri_sorgula_brd.ajx')
- Evrak listesi: getUYAPDocumentList()
`);

// Initialize monitoring automatically
monitorUYAPNetworkRequests();
