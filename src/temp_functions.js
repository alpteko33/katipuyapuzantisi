// UYAP API isteklerini dinleme
function monitorUYAPNetworkRequests() {
    console.log('UYAP Asistan: Network izleme başlatıldı');

    // Original XHR send yöntemini sakla
    const originalXhrSend = XMLHttpRequest.prototype.send;
    // Original Fetch fonksiyonunu sakla
    const originalFetch = window.fetch;

    // XMLHttpRequest'i izle
    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        const url = xhr.responseURL;

        // Önemli UYAP endpoint'lerini kontrol et
        if (url && url.includes('uyap.gov.tr')) {
            // Dosya ID'yi al
            const dosyaId = extractDosyaId(url, body);
            
            if (dosyaId) {
                console.log('UYAP Asistan: API (XHR) - dosyaId yakalandı:', dosyaId);
                // LocalStorage'a kaydet
                localStorage.setItem('uyap_asistan_dosya_id', dosyaId);
                // Diğer bileşenlere bildir
                dispatchDosyaIdEvent(dosyaId, body, url);
            }
            
            xhr.addEventListener('load', function() {
                try {
                    if (xhr.responseText && xhr.getResponseHeader('content-type')?.includes('application/json')) {
                        const data = JSON.parse(xhr.responseText);
                        
                        if (data.dosyaId || data.DosyaId) {
                            const responseDosyaId = data.dosyaId || data.DosyaId;
                            console.log('UYAP Asistan: API (XHR) yanıtından dosyaId yakalandı:', responseDosyaId);
                            localStorage.setItem('uyap_asistan_dosya_id', responseDosyaId);
                            dispatchDosyaIdEvent(responseDosyaId, body, url);
                        }
                    }
                } catch (error) {
                    console.error('UYAP Asistan: API yanıtı işlenirken hata:', error);
                }
            });
        }

        // Orijinal fonksiyonu çağır
        return originalXhrSend.apply(this, arguments);
    };

    // Fetch API'yi izle
    window.fetch = function(resource, options) {
        const url = resource instanceof Request ? resource.url : resource;
        
        // UYAP API isteklerini filtrele
        if (url && url.includes('uyap.gov.tr')) {
            const body = options?.body || '';
            
            // Dosya ID'yi al
            const dosyaId = extractDosyaId(url, body);
            
            if (dosyaId) {
                console.log('UYAP Asistan: API (Fetch) - dosyaId yakalandı:', dosyaId);
                // LocalStorage'a kaydet
                localStorage.setItem('uyap_asistan_dosya_id', dosyaId);
                // Diğer bileşenlere bildir
                dispatchDosyaIdEvent(dosyaId, body, url);
            }
            
            return originalFetch.apply(this, arguments).then(response => {
                // Response klonla çünkü body sadece bir kez okunabilir
                const clonedResponse = response.clone();
                
                clonedResponse.json().then(data => {
                    if (data.dosyaId || data.DosyaId) {
                        const responseDosyaId = data.dosyaId || data.DosyaId;
                        console.log('UYAP Asistan: API (Fetch) yanıtından dosyaId yakalandı:', responseDosyaId);
                        localStorage.setItem('uyap_asistan_dosya_id', responseDosyaId);
                        dispatchDosyaIdEvent(responseDosyaId, body, url);
                    }
                }).catch(error => {
                    // JSON olarak ayrıştırılamayan yanıtları yoksay
                });
                
                return response;
            });
        }
        
        // Orijinal fonksiyonu çağır
        return originalFetch.apply(this, arguments);
    };

    // Dosya ID'yi URL veya istek gövdesinden çıkarır
    function extractDosyaId(url, body) {
        let dosyaId = null;
        
        // URL'den al
        const urlMatch = url.match(/[?&]dosyaId=([^&]+)/);
        if (urlMatch && urlMatch[1]) {
            dosyaId = urlMatch[1];
        }
        
        // Body'den al (eğer URL'de bulunamadıysa)
        if (!dosyaId && body) {
            let bodyStr = '';
            
            if (typeof body === 'string') {
                bodyStr = body;
            } else if (body instanceof FormData) {
                const formDataDosyaId = body.get('dosyaId');
                if (formDataDosyaId) {
                    dosyaId = formDataDosyaId;
                }
            } else if (body instanceof URLSearchParams) {
                dosyaId = body.get('dosyaId');
            } else if (typeof body === 'object') {
                try {
                    bodyStr = JSON.stringify(body);
                } catch (e) {
                    // JSON'a dönüştürülemiyorsa, yoksay
                }
            }
            
            if (!dosyaId && bodyStr) {
                const bodyMatch = bodyStr.match(/dosyaId['":\s=]+([^&"',\s}]+)/);
                if (bodyMatch && bodyMatch[1]) {
                    dosyaId = bodyMatch[1];
                }
            }
        }
        
        // Sayfa üzerindeki input'lardan al (eğer URL ve body'de bulunamadıysa)
        if (!dosyaId) {
            const dosyaIdInput = document.querySelector('input[name="dosyaId"]');
            if (dosyaIdInput && dosyaIdInput.value) {
                dosyaId = dosyaIdInput.value;
            }
        }
        
        return dosyaId;
    }

    // Diğer eklenti bileşenlerine Dosya ID'sini bildirir
    function dispatchDosyaIdEvent(dosyaId, payload, endpoint) {
        const event = new CustomEvent('uyapDosyaIdCaptured', {
            detail: {
                dosyaId,
                payload,
                endpoint
            }
        });
        
        window.dispatchEvent(event);
    }

    // En son yakalanan Dosya ID'sini almak için global fonksiyon
    window.getLatestDosyaId = function() {
        return localStorage.getItem('uyap_asistan_dosya_id');
    };
    
    // Tüm input alanlarını izle
    const inputObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                const target = mutation.target;
                if (target.name === 'dosyaId' && target.value) {
                    console.log('UYAP Asistan: Input değeri değişti - dosyaId yakalandı:', target.value);
                    localStorage.setItem('uyap_asistan_dosya_id', target.value);
                    dispatchDosyaIdEvent(target.value, null, window.location.href);
                }
            }
        });
    });
    
    // Input değişikliklerini izle
    document.querySelectorAll('input[name="dosyaId"]').forEach(input => {
        inputObserver.observe(input, { attributes: true });
    });
    
    // DOM değişikliğini izle ve yeni eklenen dosyaId inputlarını da izle
    const domObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.querySelectorAll) {
                        const inputs = node.querySelectorAll('input[name="dosyaId"]');
                        inputs.forEach(input => {
                            if (input.value) {
                                console.log('UYAP Asistan: Yeni input bulundu - dosyaId yakalandı:', input.value);
                                localStorage.setItem('uyap_asistan_dosya_id', input.value);
                                dispatchDosyaIdEvent(input.value, null, window.location.href);
                            }
                            inputObserver.observe(input, { attributes: true });
                        });
                    }
                }
            }
        });
    });
    
    domObserver.observe(document.documentElement, { childList: true, subtree: true });
    
    console.log('UYAP Asistan: Network izleme kuruldu');
}

// UYAP API istekleri için yardımcı fonksiyon
async function makeUYAPApiRequest(endpoint, data = {}) {
    try {
        // URL'yi oluştur
        let url = endpoint;
        if (!url.startsWith('http')) {
            url = `https://avukatbeta.uyap.gov.tr/${endpoint}`;
        }
        
        // İstek gövdesini hazırla
        let body;
        
        if (data instanceof FormData) {
            body = data;
        } else {
            const formData = new FormData();
            
            // Dosya ID'yi ekle (varsa)
            if (data.dosyaId) {
                formData.append('dosyaId', data.dosyaId);
            } else {
                // LocalStorage'dan dosya ID'yi al
                const storedDosyaId = localStorage.getItem('uyap_asistan_dosya_id');
                if (storedDosyaId) {
                    formData.append('dosyaId', storedDosyaId);
                }
            }
            
            // Diğer parametreleri ekle
            for (const key in data) {
                if (key !== 'dosyaId' && data.hasOwnProperty(key)) {
                    formData.append(key, data[key]);
                }
            }
            
            body = formData;
        }
        
        // İsteği yap
        const response = await fetch(url, {
            method: 'POST',
            body: body,
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        // Yanıtı JSON olarak ayrıştır
        if (response.headers.get('content-type')?.includes('application/json')) {
            return await response.json();
        }
        
        // JSON değilse text olarak dön
        return await response.text();
    } catch (error) {
        console.error('UYAP Asistan: API isteği yapılırken hata:', error);
        throw error;
    }
}

// Global API fonksiyonunu tanımla
window.makeUYAPApiRequest = makeUYAPApiRequest; 