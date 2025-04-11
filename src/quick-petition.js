// UYAP popup'larına Hızlı Dilekçe butonu ekleyen fonksiyon
function addQuickPetitionButton() {
    // Popup başlık çubuğundaki buton container'ını bul
    const buttonContainer = document.querySelector('.dx-popup-title .ms-auto');
    
    if (buttonContainer && !document.querySelector('.quick-petition-btn')) {
        // Tam Ekran butonunu bul
        const fullscreenBtn = buttonContainer.querySelector('.dx-button-has-text');
        
        if (fullscreenBtn) {
            // Hızlı Dilekçe butonunu oluştur
            const quickPetitionBtn = document.createElement('div');
            quickPetitionBtn.className = 'dx-widget dx-button dx-button-mode-outlined dx-button-normal dx-button-has-text dx-button-has-icon me-2 quick-petition-btn';
            quickPetitionBtn.setAttribute('role', 'button');
            quickPetitionBtn.setAttribute('aria-label', 'Hızlı Dilekçe');
            quickPetitionBtn.setAttribute('tabindex', '0');
            
            // Buton içeriğini oluştur
            quickPetitionBtn.innerHTML = `
                <div class="dx-button-content">
                    <i class="dx-icon fe icon-file-text"></i>
                    <span class="dx-button-text">Hızlı Dilekçe</span>
                </div>
            `;
            
            // Butonu Tam Ekran butonunun soluna ekle
            fullscreenBtn.parentNode.insertBefore(quickPetitionBtn, fullscreenBtn);
            
            // Buton tıklama olayını ekle
            quickPetitionBtn.addEventListener('click', function() {
                // Hızlı Dilekçe butonuna tıklandığında yapılacak işlemler
                console.log('Hızlı Dilekçe butonu tıklandı');
            });
        }
    }
}

// MutationObserver ile popup'ları izle
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.matches('.dx-overlay-content.dx-popup-normal')) {
                    // Popup açıldığında butonu ekle
                    addQuickPetitionButton();
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

class QuickPetition {
    constructor() {
        this.setupQuickPetitionUI();
    }

    setupQuickPetitionUI() {
        // UYAP arayüzünde "Hızlı Dilekçe" butonu oluştur
        const actionButtons = document.querySelector('.dx-toolbar-after');
        if (actionButtons) {
            // Buton zaten varsa ekleme
            if (document.getElementById('quick-petition-button')) return;
            
            const quickPetitionButton = document.createElement('div');
            quickPetitionButton.className = 'dx-item dx-toolbar-item dx-toolbar-button';
            quickPetitionButton.innerHTML = `
                <div class="dx-item-content dx-toolbar-item-content">
                    <div id="quick-petition-button" class="dx-button dx-button-mode-contained dx-widget dx-button-has-text" role="button">
                        <div class="dx-button-content">
                            <span class="dx-button-text">Hızlı Dilekçe</span>
                        </div>
                    </div>
                </div>
            `;
            
            actionButtons.appendChild(quickPetitionButton);
            
            // Butona tıklama olayı ekle
            document.getElementById('quick-petition-button').addEventListener('click', async () => {
                await this.openQuickPetitionPopup();
            });
        }
    }

    async openQuickPetitionPopup() {
        // Mevcut mahkeme ve dosya bilgilerini al
        const mahkemeElement = document.querySelector('.adaletContent .description-top-part .title-container h2.title');
        const davaNoElement = document.querySelector('.adaletContent .description-top-part .title-container h3.subtitle');
        
        const mahkeme = mahkemeElement ? mahkemeElement.textContent.trim() : '';
        const davaNo = davaNoElement ? davaNoElement.textContent.trim() : '';
        
        // Müvekkil bilgilerini topla
        const muvekkilBilgileri = await this.getMuvekkilBilgileri();
        console.log("Müvekkil bilgileri:", muvekkilBilgileri);
        
        // Popup container oluştur
        const popupContainer = document.createElement('div');
        popupContainer.className = 'quick-petition-popup-container';
        
        // Popup içeriği
        popupContainer.innerHTML = `
            <div class="quick-petition-popup">
                <div class="quick-petition-header">
                    <h3>HIZLI DİLEKÇE</h3>
                    <div class="quick-petition-close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                
                <div class="quick-petition-content">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">Mahkeme Bilgisi:</label>
                        <input type="text" class="petition-mahkeme" value="${mahkeme}" style="
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
                            padding: 8px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                        ">
                            <option value="">-- Müvekkil Seçiniz --</option>
                            ${muvekkilBilgileri.map(muvekkil => 
                                `<option value="${muvekkil.ad}" data-rol="${muvekkil.rol}">${muvekkil.rol} - ${muvekkil.ad}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">Dilekçe Türü:</label>
                        <select class="petition-type" style="
                            width: 100%;
                            padding: 8px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                        ">
                            <option value="Duruşma Mazeret Dilekçesi">Duruşma Mazeret Dilekçesi</option>
                            <option value="Süre Uzatım Talebi">Süre Uzatım Talebi</option>
                            <option value="Delil Sunma Dilekçesi">Delil Sunma Dilekçesi</option>
                            <option value="Cevap Dilekçesi">Cevap Dilekçesi</option>
                            <option value="İtiraz Dilekçesi">İtiraz Dilekçesi</option>
                            <option value="Beyan Dilekçesi">Beyan Dilekçesi</option>
                            <option value="Bilirkişi Raporu İtiraz">Bilirkişi Raporu İtiraz</option>
                            <option value="Tensip Tutanağı İtiraz">Tensip Tutanağı İtiraz</option>
                            <option value="Diğer">Diğer</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">Dilekçe İçeriği:</label>
                        <div class="editor-toolbar" style="
                            display: flex;
                            gap: 5px;
                            margin-bottom: 8px;
                            padding: 5px;
                            background: #f5f5f5;
                            border: 1px solid #ddd;
                            border-radius: 4px 4px 0 0;
                        ">
                            <button type="button" data-action="bold" style="
                                padding: 5px 10px;
                                background: #fff;
                                border: 1px solid #ccc;
                                border-radius: 3px;
                                cursor: pointer;
                            "><i class="fas fa-bold"></i></button>
                            <button type="button" data-action="italic" style="
                                padding: 5px 10px;
                                background: #fff;
                                border: 1px solid #ccc;
                                border-radius: 3px;
                                cursor: pointer;
                            "><i class="fas fa-italic"></i></button>
                            <button type="button" data-action="underline" style="
                                padding: 5px 10px;
                                background: #fff;
                                border: 1px solid #ccc;
                                border-radius: 3px;
                                cursor: pointer;
                            "><i class="fas fa-underline"></i></button>
                            <select data-action="fontSize" style="
                                padding: 5px;
                                background: #fff;
                                border: 1px solid #ccc;
                                border-radius: 3px;
                                cursor: pointer;
                            ">
                                <option value="1">Küçük</option>
                                <option value="2">Normal</option>
                                <option value="3" selected>Orta</option>
                                <option value="4">Büyük</option>
                                <option value="5">Daha Büyük</option>
                            </select>
                            <button type="button" data-action="justifyLeft" style="
                                padding: 5px 10px;
                                background: #fff;
                                border: 1px solid #ccc;
                                border-radius: 3px;
                                cursor: pointer;
                            "><i class="fas fa-align-left"></i></button>
                            <button type="button" data-action="justifyCenter" style="
                                padding: 5px 10px;
                                background: #fff;
                                border: 1px solid #ccc;
                                border-radius: 3px;
                                cursor: pointer;
                            "><i class="fas fa-align-center"></i></button>
                            <button type="button" data-action="justifyRight" style="
                                padding: 5px 10px;
                                background: #fff;
                                border: 1px solid #ccc;
                                border-radius: 3px;
                                cursor: pointer;
                            "><i class="fas fa-align-right"></i></button>
                        </div>
                        <div class="petition-content-wrapper" style="
                            border: 1px solid #ddd;
                            border-top: none;
                            border-radius: 0 0 4px 4px;
                        ">
                            <div class="petition-content" contenteditable="true" style="
                                width: 100%;
                                min-height: 300px;
                                padding: 10px;
                                font-family: Arial, sans-serif;
                                font-size: 14px;
                                line-height: 1.5;
                                overflow-y: auto;
                                outline: none;
                            "></div>
                        </div>
                    </div>
                    
                    <div class="form-actions" style="
                        display: flex;
                        justify-content: flex-end;
                        gap: 10px;
                        margin-top: 20px;
                    ">
                        <button class="download-petition-btn" style="
                            background-color: #007AFF;
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 4px;
                            cursor: pointer;
                        ">İndir</button>
                        
                        <button class="save-petition-btn" style="
                            background-color: #28a745;
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 4px;
                            cursor: pointer;
                        ">Kaydet</button>
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
        
        // Editor butonlarına tıklama olayları
        const editorButtons = popupContainer.querySelectorAll('.editor-toolbar button, .editor-toolbar select');
        editorButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.tagName === 'BUTTON') {
                    document.execCommand(button.dataset.action, false, null);
                }
            });
            
            if (button.tagName === 'SELECT') {
                button.addEventListener('change', () => {
                    document.execCommand(button.dataset.action, false, button.value);
                });
            }
        });
        
        // Müvekkil seçildiğinde dilekçeye ekle
        const muvekkilSelect = popupContainer.querySelector('.petition-muvekkil');
        muvekkilSelect.addEventListener('change', () => {
            const selectedMuvekkil = muvekkilSelect.value;
            const selectedOption = muvekkilSelect.options[muvekkilSelect.selectedIndex];
            const muvekkilRol = selectedOption.getAttribute('data-rol') || '';
            const contentEditor = popupContainer.querySelector('.petition-content');
            
            if (selectedMuvekkil && contentEditor.innerHTML === '') {
                // Avukat bilgilerini al
                chrome.storage.sync.get('lawyers', (data) => {
                    const lawyers = data.lawyers || [];
                    let avukatBilgisi = '';
                    
                    if (lawyers.length > 0) {
                        const avukat = lawyers[0]; // İlk kaydedilen avukatı kullan
                        avukatBilgisi = `<p style="text-align: right;">${avukat.name}<br>${avukat.bar} Barosu<br>Sicil No: ${avukat.id}</p>`;
                    }
                    
                    const tarih = new Date().toLocaleDateString('tr-TR');
                    const petitionType = popupContainer.querySelector('.petition-type').value;
                    
                    // Temel dilekçe şablonu oluştur
                    const dilekceTemplate = `
                        <p style="text-align: center;"><strong>${mahkeme}</strong><br><strong>SAYIN HAKİMLİĞİNE</strong></p>
                        <p><strong>DOSYA NO:</strong> ${davaNo}</p>
                        <p><strong>MÜVEKKİL:</strong> ${selectedMuvekkil}</p>
                        <p><strong>KONU:</strong> ${petitionType}</p>
                        <p><br></p>
                        <p>Saygılarımla arz ederim. ${tarih}</p>
                        <p style="text-align: right;">${avukat ? avukat.name : "Avukat"}<br>${muvekkilRol} ${selectedMuvekkil} Vekili</p>
                        ${avukatBilgisi}
                    `;
                    
                    contentEditor.innerHTML = dilekceTemplate;
                });
            }
        });
        
        // İndir butonuna tıklama olayı
        const downloadButton = popupContainer.querySelector('.download-petition-btn');
        downloadButton.addEventListener('click', () => {
            const petitionData = this.collectPetitionData(popupContainer);
            this.downloadPetitionAsUDF(petitionData);
        });
        
        // Kaydet butonuna tıklama olayı
        const saveButton = popupContainer.querySelector('.save-petition-btn');
        saveButton.addEventListener('click', () => {
            const petitionData = this.collectPetitionData(popupContainer);
            this.savePetition(petitionData, popupContainer);
        });
    }
    
    async getMuvekkilBilgileri() {
        return new Promise((resolve) => {
            const muvekkilList = [];
            
            try {
                // Taraf bilgileri tablosunu bul
                const taraflarTable = document.querySelector('.dx-datagrid-rowsview .dx-datagrid-content table');
                if (!taraflarTable) {
                    console.log("Taraf bilgileri tablosu bulunamadı");
                    return resolve(muvekkilList);
                }
                
                // Senkron olarak işleme - Chrome.storage API kullanmadan doğrudan tarafları alalım
                // Tablo satırlarını işle
                const rows = taraflarTable.querySelectorAll('tr.dx-data-row');
                console.log("Bulunan taraf satırları:", rows.length);
                
                // Tüm tarafları ekleyelim, daha sonra vekil kontrolü yapılabilir
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 4) {
                        const rol = cells[0].textContent.trim();
                        const tip = cells[1].textContent.trim();
                        const ad = cells[2].textContent.trim();
                        const vekil = cells[3].textContent.trim();
                        
                        // Tüm tarafları ekle, vekil kontrolü sonradan yapılabilir
                        muvekkilList.push({
                            rol,
                            tip,
                            ad,
                            vekil
                        });
                        console.log(`Taraf eklendi: ${rol} - ${ad}`);
                    }
                });
                
                console.log("Toplanan müvekkil bilgileri:", muvekkilList);
                resolve(muvekkilList);
                
            } catch (error) {
                console.error('Müvekkil bilgileri çekilirken hata oluştu:', error);
                resolve(muvekkilList);
            }
        });
    }
    
    collectPetitionData(popupContainer) {
        return {
            mahkeme: popupContainer.querySelector('.petition-mahkeme').value,
            davaNo: popupContainer.querySelector('.petition-dava-no').value,
            type: popupContainer.querySelector('.petition-type').value,
            muvekkil: popupContainer.querySelector('.petition-muvekkil').value,
            content: popupContainer.querySelector('.petition-content').innerHTML,
            date: new Date()
        };
    }
    
    downloadPetitionAsUDF(petitionData) {
        // UDF formatı için basit bir yapı
        const udfContent = `UYAP_DILEKCE_FORMAT_1.0
MAHKEME: ${petitionData.mahkeme}
DOSYA_NO: ${petitionData.davaNo}
MUVEKKIL: ${petitionData.muvekkil}
DILEKCE_TURU: ${petitionData.type}
TARIH: ${new Date().toLocaleDateString('tr-TR')}
ICERIK_BASLANGIC
${petitionData.content.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')}
ICERIK_BITIS`;
        
        // Dosya oluştur ve indir
        const blob = new Blob([udfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Dilekce_${petitionData.davaNo.replace(/\//g, '_')}_${new Date().toISOString().replace(/[-:.]/g, '')}.udf`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
    
    savePetition(petitionData, popupContainer) {
        // Görevlendirmeler listesine ekle
        chrome.storage.local.get(['savedAssignments'], (result) => {
            const savedAssignments = result.savedAssignments || [];
            
            savedAssignments.push({
                type: 'petition',
                data: petitionData,
                createdAt: new Date().getTime()
            });
            
            chrome.storage.local.set({ savedAssignments }, () => {
                alert('Dilekçe başarıyla kaydedildi.');
                document.body.removeChild(popupContainer);
                
                // Kaydedildiğini bildir
                const event = new CustomEvent('assignmentsDataUpdated', {
                    detail: { savedAssignments }
                });
                window.dispatchEvent(event);
                
                // Müvekkil verilerini güncelle
                this.updateMuvekkilVerileri(petitionData);
            });
        });
    }
    
    updateMuvekkilVerileri(petitionData) {
        // Eğer müvekkil verileri yoksa oluştur
        chrome.storage.local.get(['muvekkilVerileri'], (result) => {
            const muvekkilVerileri = result.muvekkilVerileri || [];
            
            // Bu dava dosyası için kayıt var mı kontrol et
            let davaIndex = muvekkilVerileri.findIndex(dava => dava.davaNo === petitionData.davaNo);
            
            if (davaIndex === -1) {
                // Yeni dava kaydı oluştur
                muvekkilVerileri.push({
                    davaNo: petitionData.davaNo,
                    mahkeme: petitionData.mahkeme,
                    tarih: new Date().toLocaleDateString('tr-TR'),
                    muvekkilListesi: []
                });
                davaIndex = muvekkilVerileri.length - 1;
            }
            
            // Müvekkil listesine ekle
            if (petitionData.muvekkil && !muvekkilVerileri[davaIndex].muvekkilListesi.some(m => m.ad === petitionData.muvekkil)) {
                muvekkilVerileri[davaIndex].muvekkilListesi.push({
                    ad: petitionData.muvekkil,
                    tip: 'Kişi', // Varsayılan olarak Kişi
                    rol: 'Müvekkil' // Varsayılan olarak Müvekkil
                });
            }
            
            // Müvekkil verilerini güncelle
            chrome.storage.local.set({ muvekkilVerileri }, () => {
                // Müvekkil verileri güncellendiğini bildir
                const event = new CustomEvent('muvekkilDataUpdated', {
                    detail: { muvekkilVerileri }
                });
                window.dispatchEvent(event);
            });
        });
    }
}

export default QuickPetition; 