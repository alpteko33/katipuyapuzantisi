// Background script for UYAP Asistan Extension
console.log('UYAP Asistan: Background script başlatıldı');

// Aktif sekmelerde script durumunu tutmak için
const injectedTabs = new Set();
const injectedTaskTabs = new Set();

// Ağ isteklerini izlemek için bir WebRequest listener ekle
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // UYAP sayfalarında yapılan istekleri kontrol et
    if (details.url.includes('uyap.gov.tr') && 
        (details.type === 'xmlhttprequest' || details.type === 'fetch')) {
      console.log('UYAP Asistan: Yakalanan istek:', details.url);
      
      // Önemli API isteklerini düzenli bir şekilde kaydet
      if (details.url.includes('taraf_bilgileri') || 
          details.url.includes('dosya_bilgileri') ||
          details.url.includes('durusma_bilgileri')) {
        // İstek detaylarını sakla
        chrome.storage.local.set({
          lastApiRequest: {
            url: details.url,
            timestamp: Date.now()
          }
        });
      }
    }
    return { cancel: false };
  },
  { urls: ["*://*.uyap.gov.tr/*"] },
  ["requestBody"]
);

// Content script için güvenli bir şekilde external script yükleme fonksiyonu
function loadExternalScript(tabId, scriptUrl) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (url) => {
      const script = document.createElement('script');
      script.src = url;
      script.setAttribute('nonce', document.querySelector('script[nonce]')?.getAttribute('nonce') || '');
      script.onload = () => {
        console.log('Harici script başarıyla yüklendi:', url);
      };
      script.onerror = (error) => {
        console.error('Harici script yüklenemedi:', url, error);
      };
      document.head.appendChild(script);
    },
    args: [scriptUrl]
  }).catch(err => {
    console.error('Script enjekte edilirken hata:', err);
  });
}

// UYAP sayfalarını izle
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Sayfa yüklendiğinde ve UYAP URL'si içeriyorsa
  if (changeInfo.status === 'complete' && tab.url.includes('uyap.gov.tr')) {
    console.log('UYAP Asistan: UYAP sayfası tespit edildi, scriptler enjekte ediliyor');
    
    // CSP hatalarını önlemek için nonce değerini almayı dene
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        // Sayfadaki script etiketlerinden nonce değerini bul
        const scripts = document.querySelectorAll('script[nonce]');
        if (scripts.length > 0) {
          return scripts[0].getAttribute('nonce');
        }
        return null;
      }
    }).then(result => {
      const nonce = result[0]?.result;
      console.log('UYAP Asistan: Algılanan nonce değeri:', nonce);
      
      // inject.js dosyasını enjekte et
      if (!injectedTabs.has(tabId)) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['src/inject.js']
        }).then(() => {
          console.log('UYAP Asistan: inject.js başarıyla enjekte edildi');
          injectedTabs.add(tabId); // Tab'ı injected olarak işaretle
        }).catch(err => {
          console.error('UYAP Asistan: inject.js enjekte edilirken hata:', err);
        });
      }
      
      // injecttask.js dosyasını enjekte et
      if (!injectedTaskTabs.has(tabId)) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['src/injecttask.js']
        }).then(() => {
          console.log('UYAP Asistan: injecttask.js başarıyla enjekte edildi');
          injectedTaskTabs.add(tabId); // Tab'ı injected olarak işaretle
        }).catch(err => {
          console.error('UYAP Asistan: injecttask.js enjekte edilirken hata:', err);
        });
      }
    }).catch(err => {
      console.error('Nonce değeri alınırken hata:', err);
      
      // Nonce değeri alınamazsa, normal enjeksiyon yöntemini kullan
      if (!injectedTabs.has(tabId)) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['src/inject.js']
        }).then(() => {
          console.log('UYAP Asistan: inject.js başarıyla enjekte edildi');
          injectedTabs.add(tabId);
        }).catch(err => {
          console.error('UYAP Asistan: inject.js enjekte edilirken hata:', err);
        });
      }
      
      // injecttask.js dosyasını enjekte et
      if (!injectedTaskTabs.has(tabId)) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['src/injecttask.js']
        }).then(() => {
          console.log('UYAP Asistan: injecttask.js başarıyla enjekte edildi');
          injectedTaskTabs.add(tabId);
        }).catch(err => {
          console.error('UYAP Asistan: injecttask.js enjekte edilirken hata:', err);
        });
      }
    });
  }
});

// Tab kapatıldığında veya yenilendiğinde durumu temizle
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
  injectedTaskTabs.delete(tabId);
});

// Sekme yenilendiğinde veya navigasyon değiştiğinde de durumu temizle
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    injectedTabs.delete(tabId);
    injectedTaskTabs.delete(tabId);
  }
});

// Content scriptlerden gelen mesajları dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('UYAP Asistan: Mesaj alındı:', message);
  
  // UYAP API'sinden taraf bilgilerini çekme işlemi
  if (message.action === 'fetchTarafBilgileri' && message.url && message.dosyaId) {
    console.log('UYAP Asistan: Taraf bilgileri çekme isteği alındı:', message.dosyaId);
    
    // API'ye istekte bulun
    fetch(message.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: `dosyaId=${encodeURIComponent(message.dosyaId)}`
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('API yanıt vermedi: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log('UYAP Asistan: API yanıtı:', data);
      sendResponse({
        success: true,
        data: data
      });
    })
    .catch(error => {
      console.error('UYAP Asistan: API isteğinde hata:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    });
    
    return true; // Async yanıt için
  }

  // Görevleri güncelleme mesajı
  if (message.action === 'updateTasks' && message.tasks) {
    // Tasks öğesini localStorage'a kaydet
    chrome.storage.local.set({ tasks: message.tasks }, () => {
      console.log('UYAP Asistan: Görevler chrome.storage.local\'a kaydedildi');
    });
    
    // Popup'a mesaj gönder (eğer açıksa)
    chrome.runtime.sendMessage({
      action: 'tasksUpdated',
      tasks: message.tasks
    }).catch(err => {
      // Popup açık değilse hata verecektir, bu normal
      console.log('Popup açık değil, mesaj gönderilmedi');
    });
    
    return true; // Async yanıt için
  }

  // Zorunlu görev güncellemesi mesajı (deleteTask tarafından gönderilir)
  if (message.action === 'forceTasksUpdate' && message.tasks) {
    // Tasks öğesini chrome.storage.local'a kaydet
    chrome.storage.local.set({ tasks: message.tasks }, () => {
      console.log('UYAP Asistan: Görevler zorla güncellendi (chrome.storage.local)');
    });
    
    // Tüm sekmelere yayınla
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        try {
          chrome.tabs.sendMessage(tab.id, {
            action: 'tasksUpdated',
            tasks: message.tasks
          }).catch(() => {
            // Bazı sekmelere gönderilemezse normal
          });
        } catch (error) {
          // Sekme mesaj almıyorsa normal
        }
      }
    });
    
    // Popup'a da bildir
    chrome.runtime.sendMessage({
      action: 'tasksUpdated',
      tasks: message.tasks
    }).catch(() => {
      // Popup açık değilse normal
    });
    
    return true; // Async yanıt için
  }
}); 