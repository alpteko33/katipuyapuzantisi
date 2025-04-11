class CalculatorManager {
    constructor() {
        this.setupCalculatorUI();
        this.currentTool = 'judgment-cost'; // Varsayılan seçili hesaplama aracı
    }

    setupCalculatorUI() {
        const calculatorOverlay = document.createElement('div');
        calculatorOverlay.className = 'calculator-overlay';
        
        const calculatorPopup = document.createElement('div');
        calculatorPopup.className = 'calculator-popup';
        
        calculatorPopup.innerHTML = `
            <div class="calculator-sidebar">
                <div class="calculator-tools">
                    <button class="tool-btn active" data-tool="judgment-cost">
                        <i class="fas fa-gavel"></i>
                        Yargılama Gideri Hesaplama
                    </button>
                    <button class="tool-btn" data-tool="correction-fee">
                        <i class="fas fa-edit"></i>
                        Islah Harcı Hesaplama
                    </button>
                    <button class="tool-btn" data-tool="receipt-calculator">
                        <i class="fas fa-receipt"></i>
                        Makbuz Hesaplama
                    </button>
                    <button class="tool-btn" data-tool="interest-calculator">
                        <i class="fas fa-chart-line"></i>
                        Faiz Hesaplama
                    </button>
                    <button class="tool-btn" data-tool="attorney-fee-calculator">
                        <i class="fas fa-user-tie"></i>
                        Vekalet Ücreti Hesaplama
                    </button>
                    <button class="tool-btn" data-tool="deadline-calculator">
                        <i class="fas fa-hourglass-end"></i>
                        Süre Hesaplama
                    </button>
                </div>
            </div>
            <div class="calculator-main">
                <div class="calculator-header">
                    <h2>Hesaplama Araçları</h2>
                    <div class="calculator-controls">
                        <div class="calculator-close">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                </div>
                <div class="calculator-content">
                    <div id="judgment-cost" class="calculator-tool active">
                        <h3>Yargılama Gideri Hesaplama</h3>
                        <p>Bu bölümde mahkeme türü ve dava değerini esas alarak yargılama giderlerinizi hesaplayabilirsiniz.</p>
                        
                        <div class="calculator-form">
                            <form name="form" id="yargılama-gideri-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="mahkeme">Mahkeme Türü:</label>
                                        <select name="mahkeme" id="mahkeme" class="form-control">
                                            <option value="0">Mahkeme Türü Seçiniz</option>
                                            <option value="1">Sulh Hukuk Mahkemesi</option>
                                            <option value="2">İcra Hukuk Mahkemesi</option>
                                            <option value="3">Asliye Hukuk Mahkemesi</option>
                                            <option value="4">Asliye Ticaret Mahkemesi</option>
                                            <option value="5">İş Mahkemesi</option>
                                            <option value="6">Aile Mahkemesi</option>
                                            <option value="7">Tüketici Mahkemesi</option>
                                            <option value="8">İdare Mahkemesi</option>
                                            <option value="9">Vergi Mahkemesi</option>
                                            <option value="10">Kadastro Mahkemesi</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="deger">Dava Değeri (TL):</label>
                                        <input type="text" name="deger" id="deger" class="form-control" inputmode="numeric">
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="tarafcmb">Taraf Sayısı:</label>
                                        <select name="tarafcmb" id="tarafcmb" class="form-control">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="avukatcmb">Avukat Sayısı:</label>
                                        <select name="avukatcmb" id="avukatcmb" class="form-control">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row checkbox-group">
                                    <div class="form-check">
                                        <input type="checkbox" name="tanikchk" id="tanikchk">
                                        <label for="tanikchk">Tanık sayısı belli değil (3 kişi kabul edilecek)</label>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="tanikcmb">Tanık Sayısı:</label>
                                        <select name="tanikcmb" id="tanikcmb" class="form-control">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="bilirkisicmb">Bilirkişi Sayısı:</label>
                                        <select name="bilirkisicmb" id="bilirkisicmb" class="form-control">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row checkbox-group">
                                    <div class="form-check">
                                        <input type="checkbox" name="bilirkisichk" id="bilirkisichk">
                                        <label for="bilirkisichk">Bilirkişi delili var</label>
                                    </div>
                                    
                                    <div class="form-check">
                                        <input type="checkbox" name="kesifchk" id="kesifchk">
                                        <label for="kesifchk">Keşif delili var</label>
                                    </div>
                                    
                                    <div class="form-check">
                                        <input type="checkbox" name="maktuchk" id="maktuchk">
                                        <label for="maktuchk">Maktu hesap kullan</label>
                                    </div>
                                </div>
                                
                                <div class="button-group">
                                    <button type="button" class="calc-btn" id="hesapla-btn">Hesapla</button>
                                    <button type="button" class="calc-btn secondary" id="temizle-btn">Temizle</button>
                                </div>
                                
                                <div class="result-container">
                                    <div class="form-group total-result">
                                        <label for="sonuc">Toplam Yargılama Gideri:</label>
                                        <input type="text" name="sonuc" id="sonuc" class="form-control result-input" readonly>
                                    </div>
                                    
                                    <div class="form-group details-result">
                                        <label for="sonucekrani">Ayrıntılı Sonuç:</label>
                                        <textarea name="sonucekrani" id="sonucekrani" class="form-control result-textarea" readonly rows="10"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div id="correction-fee" class="calculator-tool">
                        <h3>Islah Harcı Hesaplama</h3>
                        <p>Bu bölümde dava değeri artırımı için ödenmesi gereken ıslah harcını hesaplayabilirsiniz.</p>
                        
                        <div class="calculator-form">
                            <form name="islahForm" id="islah-harci-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="ilkDavaDegeri">İlk Dava Değeri (TL):</label>
                                        <input type="text" name="ilkDavaDegeri" id="ilkDavaDegeri" class="form-control" inputmode="numeric">
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="yeniDavaDegeri">Yeni Dava Değeri (TL):</label>
                                        <input type="text" name="yeniDavaDegeri" id="yeniDavaDegeri" class="form-control" inputmode="numeric">
                                    </div>
                                </div>
                                
                                <div class="button-group">
                                    <button type="button" class="calc-btn" id="islah-hesapla-btn">Hesapla</button>
                                    <button type="button" class="calc-btn secondary" id="islah-temizle-btn">Temizle</button>
                                </div>
                                
                                <div class="result-container">
                                    <div class="form-group total-result">
                                        <label for="islahSonuc">Ödenmesi Gereken Islah Harcı:</label>
                                        <input type="text" name="islahSonuc" id="islahSonuc" class="form-control result-input" readonly>
                                    </div>
                                    
                                    <div class="form-group details-result">
                                        <label for="islahSonucEkrani">Ayrıntılı Sonuç:</label>
                                        <textarea name="islahSonucEkrani" id="islahSonucEkrani" class="form-control result-textarea" readonly rows="8"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div id="receipt-calculator" class="calculator-tool">
                        <h3>Makbuz Hesaplama</h3>
                        <p>Bu bölümde serbest meslek makbuzu hesaplamaları yapabilirsiniz.</p>
                        
                        <div class="calculator-form">
                            <form name="makbuzForm" id="makbuz-hesaplama-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="stopaj_tipi">Stopaj Durumu:</label>
                                        <select name="tip" id="stopaj_tipi" class="form-control">
                                            <option value="0">Stopaj Dahil</option>
                                            <option value="1">Stopaj Hariç</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="kdv_tipi">KDV Tipi:</label>
                                        <select name="kdv" id="kdv_tipi" class="form-control">
                                            <option value="0">KDV Hariç</option>
                                            <option value="1">KDV Dahil (% 1)</option>
                                            <option value="2">KDV Dahil (% 10)</option>
                                            <option value="3">KDV Dahil (% 20)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="makbuz_tutar">Tutar (TL):</label>
                                        <input type="text" name="tutar" id="makbuz_tutar" class="form-control" inputmode="numeric">
                                    </div>
                                </div>
                                
                                <div class="button-group">
                                    <button type="button" class="calc-btn" id="makbuz-hesapla-btn">Hesapla</button>
                                    <button type="button" class="calc-btn secondary" id="makbuz-temizle-btn">Temizle</button>
                                </div>
                                
                                <div class="result-container">
                                    <div class="form-group total-result">
                                        <label for="makbuzSonuc">Makbuz Hesaplaması:</label>
                                        <div id="makbuzSonuc" class="form-control result-makbuz">
                                            <div class="makbuz-sonuc-placeholder">Hesaplama için yukarıdaki bilgileri doldurun ve "Hesapla" butonuna tıklayın.</div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div id="interest-calculator" class="calculator-tool">
                        <h3>Faiz Hesaplama</h3>
                        <p>Bu bölümde belirli bir tutar için faiz hesaplaması yapabilirsiniz.</p>
                        
                        <div class="calculator-form">
                            <form name="faizForm" id="faiz-hesaplama-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="anapara">Anapara (TL):</label>
                                        <input type="text" name="anapara" id="anapara" class="form-control" inputmode="numeric">
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="faiz_orani">Faiz Oranı (%):</label>
                                        <input type="text" name="faiz" id="faiz_orani" class="form-control" inputmode="numeric">
                                    </div>
                                    <div class="form-group">
                                        <label for="esas_gun">Esas Gün:</label>
                                        <select name="esas_gun" id="esas_gun" class="form-control">
                                            <option value="360">360</option>
                                            <option value="365">365</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="baslangic">Başlangıç Tarihi:</label>
                                        <input type="date" name="baslangic" id="baslangic" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label for="bitis">Bitiş Tarihi:</label>
                                        <input type="date" name="bitis" id="bitis" class="form-control">
                                    </div>
                                </div>
                                
                                <div class="button-group">
                                    <button type="button" class="calc-btn" id="faiz-hesapla-btn">Hesapla</button>
                                    <button type="button" class="calc-btn secondary" id="faiz-temizle-btn">Temizle</button>
                                </div>
                                
                                <div class="result-container">
                                    <div class="form-group total-result">
                                        <label for="faizSonuc">Hesaplanan Faiz Tutarı:</label>
                                        <input type="text" name="faizSonuc" id="faizSonuc" class="form-control result-input" readonly>
                                    </div>
                                    
                                    <div class="form-group details-result">
                                        <label for="faizSonucEkrani">Ayrıntılı Sonuç:</label>
                                        <textarea name="faizSonucEkrani" id="faizSonucEkrani" class="form-control result-textarea" readonly rows="8"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div id="attorney-fee-calculator" class="calculator-tool">
                        <h3>Vekalet Ücreti Hesaplama</h3>
                        <p>Bu bölümde dava değerine göre avukatlık ücreti hesaplaması yapabilirsiniz.</p>
                        
                        <div class="calculator-form">
                            <form name="vekaletForm" id="vekalet-hesaplama-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="konu">Uyuşmazlık Konusu:</label>
                                        <select name="secim" id="konu" class="form-control">
                                            <option value="1">Konusu Para Olan Davalar</option>
                                            <option value="2">İcra Takipleri</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row" id="unselect">
                                    <div class="form-group">
                                        <label for="mahkeme_tipi">Mahkeme Türü:</label>
                                        <select name="mahkeme" id="mahkeme_tipi" class="form-control">
                                            <option value="0">İcra Mahkemeleri</option>
                                            <option value="1">Sulh Mahkemeleri</option>
                                            <option value="2">Sulh Ceza/İnfaz Mahkemeleri</option>
                                            <option value="3">Asliye Mahkemeleri</option>
                                            <option value="4">Tüketici Mahkemeleri</option>
                                            <option value="5">Fikri Sınai Haklar Mahkemeleri</option>
                                            <option value="6">İdare ve Vergi Mahkemeleri (Duruşmalı)</option>
                                            <option value="7">İdare ve Vergi Mahkemeleri (Duruşmasız)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="dava_degeri">Dava Değeri (TL):</label>
                                        <input type="text" name="miktar" id="dava_degeri" class="form-control" inputmode="numeric">
                                    </div>
                                </div>
                                
                                <div class="button-group">
                                    <button type="button" class="calc-btn" id="vekalet-hesapla-btn">Hesapla</button>
                                    <button type="button" class="calc-btn secondary" id="vekalet-temizle-btn">Temizle</button>
                                </div>
                                
                                <div class="result-container">
                                    <div class="form-group total-result">
                                        <label for="vekaletSonuc">Vekalet Ücreti:</label>
                                        <input type="text" name="vekaletSonuc" id="vekaletSonuc" class="form-control result-input" readonly>
                                    </div>
                                    
                                    <div class="form-group details-result">
                                        <label for="vekaletSonucEkrani">Ayrıntılı Sonuç:</label>
                                        <textarea name="vekaletSonucEkrani" id="vekaletSonucEkrani" class="form-control result-textarea" readonly rows="8"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div id="deadline-calculator" class="calculator-tool">
                        <h3>Süre Hesaplama</h3>
                        <p>Bu bölümde tebliğ tarihi ve süreye göre vade sonu tarihini hesaplayabilirsiniz.</p>
                        
                        <div class="calculator-form">
                            <form name="sureForm" id="sure-hesaplama-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="teblig_tarihi">Tebliğ Tarihi:</label>
                                        <input type="date" name="teblig_tarihi" id="teblig_tarihi" class="form-control" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="sure_miktari">Süre:</label>
                                        <input type="number" name="sure_miktari" id="sure_miktari" class="form-control" min="1" value="7" required>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="sure_birimi">Süre Birimi:</label>
                                        <select name="sure_birimi" id="sure_birimi" class="form-control">
                                            <option value="gun">Gün</option>
                                            <option value="hafta">Hafta</option>
                                            <option value="ay">Ay</option>
                                            <option value="yil">Yıl</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row checkbox-group">
                                    <div class="form-check">
                                        <input type="checkbox" name="etebligat" id="etebligat">
                                        <label for="etebligat">E-tebligat yoluyla yapıldı (tebliğ tarihi yerine teslim tarihi girilecek)</label>
                                    </div>
                                </div>
                                
                                <div class="form-row checkbox-group">
                                    <div class="form-check">
                                        <input type="checkbox" name="mali_tatil_teblig" id="mali_tatil_teblig">
                                        <label for="mali_tatil_teblig">Mali Tatilde Tebliğ (Sürenin mali tatilin son gününü izleyen tarihten itibaren başlatılması)</label>
                                    </div>
                                </div>
                                
                                <div class="form-row checkbox-group">
                                    <div class="form-check">
                                        <input type="checkbox" name="mali_tatil_bitis" id="mali_tatil_bitis">
                                        <label for="mali_tatil_bitis">Mali Tatile Denk Gelme (Sürenin bitişi mali tatile denk gelirse uzatılması)</label>
                                    </div>
                                </div>
                                
                                <div class="form-row checkbox-group">
                                    <div class="form-check">
                                        <input type="checkbox" name="adli_tatil" id="adli_tatil">
                                        <label for="adli_tatil">Adli Tatile Denk Gelme (Sürenin bitişi adli tatile denk gelirse uzatılması)</label>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="adli_tatil_uzatma">Adli Tatil Uzatma Süresi:</label>
                                        <select name="adli_tatil_uzatma" id="adli_tatil_uzatma" class="form-control">
                                            <option value="3">Tatil sonrası 3 gün (Ceza Mahkemeleri vs.)</option>
                                            <option value="7" selected>Tatil sonrası 7 gün (Hukuk, İdare, Vergi Mahkemeleri vs.)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="button-group">
                                    <button type="button" class="calc-btn" id="sure-hesapla-btn">Hesapla</button>
                                    <button type="button" class="calc-btn secondary" id="sure-temizle-btn">Temizle</button>
                                </div>
                                
                                <div class="result-container">
                                    <div class="form-group total-result">
                                        <label for="sureSonuc">Vade Sonu Tarihi:</label>
                                        <input type="text" name="sureSonuc" id="sureSonuc" class="form-control result-input" readonly>
                                    </div>
                                    
                                    <div class="form-group details-result">
                                        <label for="sureSonucEkrani">Ayrıntılı Sonuç:</label>
                                        <textarea name="sureSonucEkrani" id="sureSonucEkrani" class="form-control result-textarea" readonly rows="10"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        calculatorOverlay.appendChild(calculatorPopup);
        document.body.appendChild(calculatorOverlay);
        
        this.setupEventListeners(calculatorOverlay, calculatorPopup);
        this.loadCalculationScripts();
    }

    setupEventListeners(overlay, popup) {
        // Close button
        const closeBtn = popup.querySelector('.calculator-close');
        closeBtn.addEventListener('click', () => this.hideCalculatorPanel());
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                this.hideCalculatorPanel();
            }
        });

        // Prevent closing when clicking inside popup
        popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Close when clicking outside popup
        overlay.addEventListener('click', () => {
            this.hideCalculatorPanel();
        });

        // Tool buttons
        const toolBtns = popup.querySelectorAll('.tool-btn');
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // İnfaz hesaplama butonuna tıklandıysa işlem yapma
                if (btn.dataset.tool === 'execution-calculator') {
                    return;
                }
                
                toolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
                this.showCalculatorTool(this.currentTool);
            });
        });
        
        // Dava değeri input formatı için olay dinleyicisi ekle
        const degerInput = popup.querySelector('#deger');
        if (degerInput) {
            degerInput.addEventListener('input', this.formatCurrencyInput);
        }
        
        // Hesapla ve Temizle butonları
        const hesaplaBtn = popup.querySelector('#hesapla-btn');
        const temizleBtn = popup.querySelector('#temizle-btn');
        
        if (hesaplaBtn) {
            hesaplaBtn.addEventListener('click', this.gideravansi);
        }
        
        if (temizleBtn) {
            temizleBtn.addEventListener('click', this.temizle);
        }
        
        // Islah Harcı formundaki alanlar için event listener'lar
        const ilkDavaDegeriInput = popup.querySelector('#ilkDavaDegeri');
        const yeniDavaDegeriInput = popup.querySelector('#yeniDavaDegeri');
        
        if (ilkDavaDegeriInput) {
            ilkDavaDegeriInput.addEventListener('input', this.formatCurrencyInput);
        }
        
        if (yeniDavaDegeriInput) {
            yeniDavaDegeriInput.addEventListener('input', this.formatCurrencyInput);
        }
        
        // Islah Harcı için hesapla ve temizle butonları
        const islahHesaplaBtn = popup.querySelector('#islah-hesapla-btn');
        const islahTemizleBtn = popup.querySelector('#islah-temizle-btn');
        
        if (islahHesaplaBtn) {
            islahHesaplaBtn.addEventListener('click', this.islahHarciHesapla);
        }
        
        if (islahTemizleBtn) {
            islahTemizleBtn.addEventListener('click', this.islahFormTemizle);
        }
        
        // Makbuz formundaki alanlar için event listener'lar
        const makbuzTutarInput = popup.querySelector('#makbuz_tutar');
        
        if (makbuzTutarInput) {
            makbuzTutarInput.addEventListener('input', this.formatCurrencyInput);
        }
        
        // Konuya göre mahkeme alanını göster/gizle
        const konuSelect = popup.querySelector('#konu');
        if (konuSelect) {
            konuSelect.addEventListener('change', function() {
                const unselectDiv = document.getElementById('unselect');
                if (this.value == "2") {
                    unselectDiv.style.display = 'none';
                } else {
                    unselectDiv.style.display = 'block';
                }
            });
        }
        
        // Makbuz Hesaplama için hesapla ve temizle butonları
        const makbuzHesaplaBtn = popup.querySelector('#makbuz-hesapla-btn');
        const makbuzTemizleBtn = popup.querySelector('#makbuz-temizle-btn');
        
        if (makbuzHesaplaBtn) {
            makbuzHesaplaBtn.addEventListener('click', this.makbuzHesapla);
        }
        
        if (makbuzTemizleBtn) {
            makbuzTemizleBtn.addEventListener('click', this.makbuzFormTemizle);
        }
        
        // Faiz Hesaplama formundaki alanlar için event listener'lar
        const anaparaInput = popup.querySelector('#anapara');
        const faizOraniInput = popup.querySelector('#faiz_orani');
        
        if (anaparaInput) {
            anaparaInput.addEventListener('input', this.formatCurrencyInput);
        }
        
        if (faizOraniInput) {
            faizOraniInput.addEventListener('input', this.formatPercentInput);
        }
        
        // Faiz Hesaplama için hesapla ve temizle butonları
        const faizHesaplaBtn = popup.querySelector('#faiz-hesapla-btn');
        const faizTemizleBtn = popup.querySelector('#faiz-temizle-btn');
        
        if (faizHesaplaBtn) {
            faizHesaplaBtn.addEventListener('click', this.faizHesapla);
        }
        
        if (faizTemizleBtn) {
            faizTemizleBtn.addEventListener('click', this.faizFormTemizle);
        }
        
        // Vekalet Ücreti formundaki alanlar için event listener'lar
        const davaDegeriInput = popup.querySelector('#dava_degeri');
        
        if (davaDegeriInput) {
            davaDegeriInput.addEventListener('input', this.formatCurrencyInput);
        }
        
        // Vekalet Ücreti için hesapla ve temizle butonları
        const vekaletHesaplaBtn = popup.querySelector('#vekalet-hesapla-btn');
        const vekaletTemizleBtn = popup.querySelector('#vekalet-temizle-btn');
        
        if (vekaletHesaplaBtn) {
            vekaletHesaplaBtn.addEventListener('click', this.vekaletUcretiHesapla);
        }
        
        if (vekaletTemizleBtn) {
            vekaletTemizleBtn.addEventListener('click', this.vekaletFormTemizle);
        }
        
        // İnfaz hesaplama için event listener'lar
        const cezaTuruSelect = popup.querySelector('#ceza_turu');
        if (cezaTuruSelect) {
            cezaTuruSelect.addEventListener('change', () => {
                const cezaSuresiRow = popup.querySelector('.ceza-suresi-row');
                if (cezaTuruSelect.value === 'V3') {
                    cezaSuresiRow.style.display = 'flex';
                } else {
                    cezaSuresiRow.style.display = 'none';
                }
            });
        }
        
        const mahsupSelect = popup.querySelector('#mahsup');
        if (mahsupSelect) {
            mahsupSelect.addEventListener('change', () => {
                const mahsupGunGroup = popup.querySelector('.mahsup-gun-group');
                if (mahsupSelect.value === 'V10') {
                    mahsupGunGroup.style.display = 'block';
                } else {
                    mahsupGunGroup.style.display = 'none';
                }
            });
        }
        
        // İnfaz Hesaplama için hesapla ve temizle butonları
        const infazHesaplaBtn = popup.querySelector('#infaz-hesapla-btn');
        const infazTemizleBtn = popup.querySelector('#infaz-temizle-btn');
        
        if (infazHesaplaBtn) {
            infazHesaplaBtn.addEventListener('click', this.infazHesapla);
        }
        
        if (infazTemizleBtn) {
            infazTemizleBtn.addEventListener('click', this.infazFormTemizle);
        }
        
        // Süre Hesaplama için hesapla ve temizle butonları
        const sureHesaplaBtn = popup.querySelector('#sure-hesapla-btn');
        const sureTemizleBtn = popup.querySelector('#sure-temizle-btn');
        
        if (sureHesaplaBtn) {
            sureHesaplaBtn.addEventListener('click', this.sureHesapla);
        }
        
        if (sureTemizleBtn) {
            sureTemizleBtn.addEventListener('click', this.sureFormTemizle);
        }
    }
    
    // Para birimi formatı için yardımcı fonksiyon (1.500,50 formatında)
    formatCurrencyInput(e) {
        let value = e.target.value;
        
        // Sadece sayılar ve virgül
        value = value.replace(/[^\d,]/g, '');
        
        // Sadece bir virgül olmalı
        const commaCount = (value.match(/,/g) || []).length;
        if (commaCount > 1) {
            const parts = value.split(',');
            value = parts[0] + ',' + parts.slice(1).join('');
        }
        
        // Virgül öncesi binlik ayırıcı ekle (1.234.567,89 formatı)
        if (value.includes(',')) {
            const parts = value.split(',');
            const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            value = integerPart + ',' + parts[1];
        } else {
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        
        e.target.value = value;
    }

    // Yüzde formatı için yardımcı fonksiyon
    formatPercentInput(e) {
        let value = e.target.value;
        
        // Sadece sayılar ve nokta
        value = value.replace(/[^\d.]/g, '');
        
        // Sadece bir nokta olmalı
        const dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 1) {
            const parts = value.split('.');
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        e.target.value = value;
    }

    // Hesaplama formunu temizle
    temizle() {
        document.getElementById('yargılama-gideri-form').reset();
        
        // Dava değeri alanını temizle
        const degerInput = document.getElementById('deger');
        if (degerInput) {
            degerInput.value = '';
        }
        
        // Sonuç alanlarını temizle
        const sonucInput = document.getElementById('sonuc');
        const sonucEkraniTextarea = document.getElementById('sonucekrani');
        if (sonucInput) sonucInput.value = '';
        if (sonucEkraniTextarea) sonucEkraniTextarea.value = '';
    }

    // Girilen para değerini sayısal formata dönüştür
    parseFormattedNumber(formattedValue) {
        if (!formattedValue) return 0;
        // 1.234,56 -> 1234.56
        return parseFloat(formattedValue.replace(/\./g, '').replace(',', '.'));
    }

    // Yargılama gideri hesaplama
    gideravansi() {
        // Değişkenler
        var dosyagideri = 22.10;
        var bilirkisi1 = 1600;
        var bilirkisi2 = 2700;
        var bilirkisi3 = 2100;
        var bilirkisi4 = 3200;
        var bilirkisi5 = 3400;
        var kesif = 4761.5;
        var tanikg = 276;
        var diger = 400;
        var sulh_icra = 281.8;
        var asliye_hukuk_idare = 615.40;
        var tuketici_mahk = 0;
        var ist_tem = 954.4;
        var anayasa = 5064.4;
        var vekaletharc = 87.5;
        var pesinharc = 1.70775;
        var tebligat = 435;
        var sonuc1 = 0;
        var harchesap = 0;
        var bilirkisiucreti = 0;
        var tebligatucreti = 0;
        var tanikucreti = 0;
        var maktudeger = 615.40;
        var maktuharc = 0;
        var basvuru = 0;

        var form = document.forms["form"];
        if (!form) {
            console.error("Form bulunamadı");
            return;
        }
        
        // Formattan arındırılmış dava değerini al
        var formattedDavaDegeri = form.deger.value;
        var davadegeri = window.calculatorManager.parseFormattedNumber(formattedDavaDegeri);
        
        var taniksayisi = form.tanikcmb.value;
        var tarafsayisi = form.tarafcmb.value;
        var bilirkisisayisi = form.bilirkisicmb.value;
        var avukatsayisi = form.avukatcmb.value;
        
        if(form.mahkeme.value == 0) {
            alert("Mahkeme Türü Seçiniz..");
            window.calculatorManager.temizle();
            return;
        }

        // Tanık sayısı belli, bilirkişi yok keşif yok maktu yok, sulh hukuk, icra hukuk tüketici
        if(form.tanikchk.checked == false && form.kesifchk.checked == false && form.bilirkisichk.checked == false && form.maktuchk.checked == false) {
            harchesap = (davadegeri * pesinharc / 100).toFixed(2);
            
            if(form.mahkeme.value == 1 || form.mahkeme.value == 2) {
                bilirkisiucreti = bilirkisisayisi * bilirkisi1;
                basvuru = sulh_icra;
            }
            else if(form.mahkeme.value == 7) {
                bilirkisiucreti = tuketici_mahk;	
                basvuru = tuketici_mahk;
                tebligatucreti = tarafsayisi * tebligat;
                tanikg = tuketici_mahk;
                tanikucreti = tuketici_mahk;
                var vekaletsuret = tuketici_mahk;
                harchesap = tuketici_mahk;
                avukatsayisi = tuketici_mahk;
                kesif = tuketici_mahk;
                pesinharc = tuketici_mahk;
                sonuc1 = harchesap + dosyagideri + basvuru + bilirkisiucreti + tebligatucreti + tanikucreti + vekaletsuret + diger;
            }
            else if(form.mahkeme.value == 3) {
                bilirkisiucreti = bilirkisisayisi * bilirkisi2;
                basvuru = asliye_hukuk_idare;
            }
            else if(form.mahkeme.value == 4 || form.mahkeme.value == 5 || form.mahkeme.value == 6) {
                bilirkisiucreti = bilirkisisayisi * bilirkisi3;
                basvuru = asliye_hukuk_idare;
            }
            else if(form.mahkeme.value == 8 || form.mahkeme.value == 9 || form.mahkeme.value == 10) {
                bilirkisiucreti = bilirkisisayisi * bilirkisi4;
                basvuru = asliye_hukuk_idare;
            }
            
            tebligatucreti = tarafsayisi * tebligat;
            tanikucreti = taniksayisi * tanikg;
            var vekaletsuret = avukatsayisi * vekaletharc;
            sonuc1 = parseFloat(harchesap) + dosyagideri + basvuru + bilirkisiucreti + tebligatucreti + tanikucreti + vekaletsuret + diger;

            form.sonuc.value = sonuc1.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL";
            form.sonucekrani.value = "AYRINTILI HESAP DÖKÜMÜ" + "\n---------------------------" + "\nMahkeme Türü :" + form.mahkeme.options[form.mahkeme.selectedIndex].text + "\nDava Değeri: " + (davadegeri.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')) + " TL" + "\n---------------------------" + "\nBaşvuru Harcı: " + basvuru.toFixed(2).replace('.', ',') + " TL" + "\nDosya Gideri: " + dosyagideri.toFixed(2).replace('.', ',') + " TL" + "\nPeşin Harç: " + parseFloat(harchesap).toFixed(2).replace('.', ',') + " TL" + "\nTebligat Gideri: " + tebligatucreti.toFixed(2).replace('.', ',') + " TL" + "\nVekalet Suret Harcı: " + vekaletsuret.toFixed(2).replace('.', ',') + " TL" + "\nBilirkişi Ücreti :" + bilirkisiucreti.toFixed(2).replace('.', ',') + " TL" + "\nKeşif Gideri :0 TL" + "\nTanık Gideri :" + tanikucreti.toFixed(2).replace('.', ',') + " TL" + "\nDiğer İş Ve İşlemler :" + diger.toFixed(2).replace('.', ',') + " TL" + "\n---------------------------" + "\nToplam :" + sonuc1.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL";
        }
        
        // tanık sayısı belli, bilirkişi yok keşif yok maktu harc kullan
        else if(form.tanikchk.checked == false && form.kesifchk.checked == false && form.bilirkisichk.checked == false && form.maktuchk.checked == true) {
            var harchesap1 = (davadegeri * pesinharc / 100).toFixed(2);
            if(harchesap1 > 269.85) {
                harchesap = harchesap1;
            } else {
                harchesap = maktudeger;
            }
            
            if(form.mahkeme.value == 1 || form.mahkeme.value == 2) {
                bilirkisiucreti = bilirkisisayisi * bilirkisi1;
                basvuru = sulh_icra;
            }
            else if(form.mahkeme.value == 7) {
                bilirkisiucreti = tuketici_mahk;	
                basvuru = tuketici_mahk;
                tebligatucreti = tarafsayisi * tebligat;
                tanikg = tuketici_mahk;
                tanikucreti = tuketici_mahk;
                var vekaletsuret = tuketici_mahk;
                harchesap = tuketici_mahk;
                avukatsayisi = tuketici_mahk;
                kesif = tuketici_mahk;
                pesinharc = tuketici_mahk;
                sonuc1 = harchesap + dosyagideri + basvuru + bilirkisiucreti + tebligatucreti + tanikucreti + vekaletsuret + diger;
            }
            else if(form.mahkeme.value == 3) {
                bilirkisiucreti = bilirkisisayisi * bilirkisi2;
                basvuru = asliye_hukuk_idare;
            }
            else if(form.mahkeme.value == 4 || form.mahkeme.value == 5 || form.mahkeme.value == 6) {
                bilirkisiucreti = bilirkisisayisi * bilirkisi3;
                basvuru = asliye_hukuk_idare;
            }
            else if(form.mahkeme.value == 8 || form.mahkeme.value == 9 || form.mahkeme.value == 10) {
                bilirkisiucreti = bilirkisisayisi * bilirkisi4;
                basvuru = asliye_hukuk_idare;
            }
            
            tebligatucreti = tarafsayisi * tebligat;
            tanikucreti = taniksayisi * tanikg;
            var vekaletsuret = avukatsayisi * vekaletharc;
            sonuc1 = parseFloat(harchesap) + dosyagideri + basvuru + bilirkisiucreti + tebligatucreti + tanikucreti + vekaletsuret + diger;

            form.sonuc.value = sonuc1.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL";
            form.sonucekrani.value = "AYRINTILI HESAP DÖKÜMÜ" + "\n---------------------------" + "\nMahkeme Türü :" + form.mahkeme.options[form.mahkeme.selectedIndex].text + "\nDava Değeri: " + (davadegeri.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')) + " TL" + "\n---------------------------" + "\nBaşvuru Harcı: " + basvuru.toFixed(2).replace('.', ',') + " TL" + "\nDosya Gideri: " + dosyagideri.toFixed(2).replace('.', ',') + " TL" + "\nPeşin Harç: " + parseFloat(harchesap).toFixed(2).replace('.', ',') + " TL" + "\nTebligat Gideri: " + tebligatucreti.toFixed(2).replace('.', ',') + " TL" + "\nVekalet Suret Harcı: " + vekaletsuret.toFixed(2).replace('.', ',') + " TL" + "\nBilirkişi Ücreti :" + bilirkisiucreti.toFixed(2).replace('.', ',') + " TL" + "\nKeşif Gideri :0 TL" + "\nTanık Gideri :" + tanikucreti.toFixed(2).replace('.', ',') + " TL" + "\nDiğer İş Ve İşlemler :" + diger.toFixed(2).replace('.', ',') + " TL" + "\n---------------------------" + "\nToplam :" + sonuc1.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL";
        }
        
        // Diğer durumlar için ayrıca eklemeler yapılabilir
        // Bu örnekte sadece iki temel durum eklenmiştir
        
        else {
            // Diğer tüm kombinasyonlar için default hesaplama
            if(form.mahkeme.value == 1 || form.mahkeme.value == 2) {
                basvuru = sulh_icra;
                if(form.bilirkisichk.checked) {
                    bilirkisiucreti = bilirkisi1;
                } else {
                    bilirkisiucreti = bilirkisisayisi * bilirkisi1;
                }
            }
            else if(form.mahkeme.value == 3) {
                basvuru = asliye_hukuk_idare;
                if(form.bilirkisichk.checked) {
                    bilirkisiucreti = bilirkisi2;
                } else {
                    bilirkisiucreti = bilirkisisayisi * bilirkisi2;
                }
            }
            else if(form.mahkeme.value == 4 || form.mahkeme.value == 5 || form.mahkeme.value == 6) {
                basvuru = asliye_hukuk_idare;
                if(form.bilirkisichk.checked) {
                    bilirkisiucreti = bilirkisi3;
                } else {
                    bilirkisiucreti = bilirkisisayisi * bilirkisi3;
                }
            }
            else if(form.mahkeme.value == 8 || form.mahkeme.value == 9 || form.mahkeme.value == 10) {
                basvuru = asliye_hukuk_idare;
                if(form.bilirkisichk.checked) {
                    bilirkisiucreti = bilirkisi4;
                } else {
                    bilirkisiucreti = bilirkisisayisi * bilirkisi4;
                }
            }
            
            // Harç hesaplama (maktu/nispi)
            if(form.maktuchk.checked) {
                var harchesap1 = (davadegeri * pesinharc / 100).toFixed(2);
                if(harchesap1 > 269.85) {
                    harchesap = harchesap1;
                } else {
                    harchesap = maktudeger;
                }
            } else {
                harchesap = (davadegeri * pesinharc / 100).toFixed(2);
            }
            
            // Tanık gideri hesaplama
            if(form.tanikchk.checked) {
                tanikucreti = 3 * tanikg; // Belli değilse 3 kabul ediliyor
            } else {
                tanikucreti = taniksayisi * tanikg;
            }
            
            // Tebligat ve vekalet harcı
            tebligatucreti = tarafsayisi * tebligat;
            var vekaletsuret = avukatsayisi * vekaletharc;
            
            // Keşif gideri ekleme
            var kesifGideri = form.kesifchk.checked ? kesif : 0;
            
            // Toplam hesaplama
            sonuc1 = parseFloat(harchesap) + dosyagideri + basvuru + bilirkisiucreti + 
                   tebligatucreti + tanikucreti + vekaletsuret + diger + kesifGideri;
            
            form.sonuc.value = sonuc1.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL";
            form.sonucekrani.value = "AYRINTILI HESAP DÖKÜMÜ" + 
                "\n---------------------------" + 
                "\nMahkeme Türü :" + form.mahkeme.options[form.mahkeme.selectedIndex].text + 
                "\nDava Değeri: " + (davadegeri.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')) + " TL" + 
                "\n---------------------------" + 
                "\nBaşvuru Harcı: " + basvuru.toFixed(2).replace('.', ',') + " TL" + 
                "\nDosya Gideri: " + dosyagideri.toFixed(2).replace('.', ',') + " TL" + 
                "\nPeşin Harç: " + parseFloat(harchesap).toFixed(2).replace('.', ',') + " TL" + 
                "\nTebligat Gideri: " + tebligatucreti.toFixed(2).replace('.', ',') + " TL" + 
                "\nVekalet Suret Harcı: " + vekaletsuret.toFixed(2).replace('.', ',') + " TL" + 
                "\nBilirkişi Ücreti :" + bilirkisiucreti.toFixed(2).replace('.', ',') + " TL" + 
                "\nKeşif Gideri :" + kesifGideri.toFixed(2).replace('.', ',') + " TL" + 
                "\nTanık Gideri :" + tanikucreti.toFixed(2).replace('.', ',') + " TL" + 
                "\nDiğer İş Ve İşlemler :" + diger.toFixed(2).replace('.', ',') + " TL" + 
                "\n---------------------------" + 
                "\nToplam :" + sonuc1.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL";
        }
    }

    // Islah harcı hesaplama formu temizleme
    islahFormTemizle() {
        const form = document.getElementById('islah-harci-form');
        if (form) {
            form.reset();
        }
        
        // Değer alanlarını temizle
        const ilkDavaDegeriInput = document.getElementById('ilkDavaDegeri');
        const yeniDavaDegeriInput = document.getElementById('yeniDavaDegeri');
        if (ilkDavaDegeriInput) ilkDavaDegeriInput.value = '';
        if (yeniDavaDegeriInput) yeniDavaDegeriInput.value = '';
        
        // Sonuç alanlarını temizle
        const islahSonucInput = document.getElementById('islahSonuc');
        const islahSonucEkraniTextarea = document.getElementById('islahSonucEkrani');
        if (islahSonucInput) islahSonucInput.value = '';
        if (islahSonucEkraniTextarea) islahSonucEkraniTextarea.value = '';
    }

    // Islah harcı hesaplama
    islahHarciHesapla() {
        // Değerleri al ve sayıya çevir
        const ilkDavaDegeriInput = document.getElementById('ilkDavaDegeri');
        const yeniDavaDegeriInput = document.getElementById('yeniDavaDegeri');
        const islahSonucInput = document.getElementById('islahSonuc');
        const islahSonucEkraniTextarea = document.getElementById('islahSonucEkrani');
        
        if (!ilkDavaDegeriInput || !yeniDavaDegeriInput || !islahSonucInput || !islahSonucEkraniTextarea) {
            console.error("Form elemanları bulunamadı");
            return;
        }
        
        // Formattan arındırılmış değerleri al
        const ilkDavaDegeri = window.calculatorManager.parseFormattedNumber(ilkDavaDegeriInput.value);
        const yeniDavaDegeri = window.calculatorManager.parseFormattedNumber(yeniDavaDegeriInput.value);
        
        // Hata kontrolleri
        if (ilkDavaDegeri <= 0 || isNaN(ilkDavaDegeri)) {
            alert("Lütfen geçerli bir ilk dava değeri giriniz.");
            return;
        }
        
        if (yeniDavaDegeri <= 0 || isNaN(yeniDavaDegeri)) {
            alert("Lütfen geçerli bir yeni dava değeri giriniz.");
            return;
        }
        
        if (yeniDavaDegeri <= ilkDavaDegeri) {
            alert("Yeni dava değeri, ilk dava değerinden büyük olmalıdır.");
            return;
        }
        
        // Artış miktarı
        const artisim = yeniDavaDegeri - ilkDavaDegeri;
        
        // Düzeltilmiş hesaplama:
        // 1. Artış miktarını 1000'e böl (binde hesabı için)
        // 2. Bu değeri 68,31 ile çarp
        // 3. Sonucu 4'e böl
        const bindeHesap = artisim / 1000; // Binde hesabı
        const bindeOran = 68.31; // Binde 68,31
        const dorteBir = 4; // Dörtte biri
        
        // Islah harcı hesaplama (binde 68,31'in dörtte biri)
        const islahHarci = (bindeHesap * bindeOran) / dorteBir;
        
        // Sonuçları göster (yukarı yuvarlama ile)
        islahSonucInput.value = islahHarci.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL";
        
        // Ayrıntılı sonuç metni
        islahSonucEkraniTextarea.value = 
            "AYRINTILI ISLAH HARCI HESAPLAMASI" + 
            "\n---------------------------" + 
            "\nİlk Dava Değeri: " + ilkDavaDegeri.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL" + 
            "\nYeni Dava Değeri: " + yeniDavaDegeri.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL" + 
            "\nArtış Miktarı: " + artisim.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL" + 
            "\n---------------------------" + 
            "\nHesaplama Yöntemi:" + 
            "\n1. Artış miktarı ÷ 1000 = " + bindeHesap.toFixed(2).replace('.', ',') +
            "\n2. " + bindeHesap.toFixed(2).replace('.', ',') + " × 68,31 = " + (bindeHesap * bindeOran).toFixed(2).replace('.', ',') +
            "\n3. " + (bindeHesap * bindeOran).toFixed(2).replace('.', ',') + " ÷ 4 = " + islahHarci.toFixed(2).replace('.', ',') +
            "\n---------------------------" + 
            "\nIslah Harcı Oranı: Binde 68,31'in dörtte biri" + 
            "\nÖdenecek Islah Harcı: " + islahHarci.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL" + 
            "\n---------------------------";
    }

    // Makbuz hesaplama formu temizleme
    makbuzFormTemizle() {
        const form = document.getElementById('makbuz-hesaplama-form');
        if (form) {
            form.reset();
        }
        
        // Tutar alanını temizle
        const tutarInput = document.getElementById('makbuz_tutar');
        if (tutarInput) {
            tutarInput.value = '';
        }
        
        // Sonuç alanını temizle
        const makbuzSonucDiv = document.getElementById('makbuzSonuc');
        if (makbuzSonucDiv) {
            makbuzSonucDiv.innerHTML = '<div class="makbuz-sonuc-placeholder">Hesaplama için yukarıdaki bilgileri doldurun ve "Hesapla" butonuna tıklayın.</div>';
        }
    }
    
    // Makbuz hesaplama
    makbuzHesapla() {
        // Form elemanlarını al
        const stopajTipiSelect = document.getElementById('stopaj_tipi');
        const kdvTipiSelect = document.getElementById('kdv_tipi');
        const tutarInput = document.getElementById('makbuz_tutar');
        const makbuzSonucDiv = document.getElementById('makbuzSonuc');
        
        if (!stopajTipiSelect || !kdvTipiSelect || !tutarInput || !makbuzSonucDiv) {
            console.error("Form elemanları bulunamadı");
            return;
        }
        
        // Formattan arındırılmış tutar değerini al
        const makbuz_tutar = window.calculatorManager.parseFormattedNumber(tutarInput.value);
        const stopaj_tipi = parseInt(stopajTipiSelect.value);
        const kdv_tipi = parseInt(kdvTipiSelect.value);
        
        // Hata kontrolü
        if (makbuz_tutar <= 0 || isNaN(makbuz_tutar)) {
            alert("Lütfen geçerli bir tutar giriniz.");
            return;
        }
        
        // Değişkenler tanımla
        let stopaj_oran = 0;
        let stopaj_oran_gercek = 0;
        let kdv_oran = 0;
        
        let val1_tuzel = 0;
        let val2_tuzel = 0;
        let val3_tuzel = 0;
        let val4_tuzel = 0;
        let val5_tuzel = 0;
        
        let val1_gercek = 0;
        let val2_gercek = 0;
        let val3_gercek = 0;
        let val4_gercek = 0;
        let val5_gercek = 0;
        
        let field1 = "";
        let field2 = "";
        let field3 = "";
        let field4 = "";
        let field5 = "";
        let headerField = "";
        
        // Stopajlı
        if (stopaj_tipi == 0) {
            stopaj_oran = 20;
            // KDV Hariç
            if (kdv_tipi == 0) {
                kdv_oran = 20;
                val1_gercek = makbuz_tutar;
                val1_tuzel = makbuz_tutar;
                
                val2_tuzel = val1_tuzel * (stopaj_oran / 100);
                val2_gercek = val1_tuzel * (stopaj_oran_gercek / 100);
                
                val3_tuzel = val1_tuzel - val2_tuzel;
                val3_gercek = val1_gercek - val2_gercek;
                
                val4_tuzel = val1_tuzel * (kdv_oran / 100);
                val4_gercek = val1_gercek * (kdv_oran / 100);
                
                val5_tuzel = val3_tuzel + val4_tuzel;
                val5_gercek = val3_gercek + val4_gercek;
                
                field1 = "Brüt (K.D.V. Hariç)";
                field2 = "Stopaj (%20)";
                field3 = "Alınan Net Ücret";
                field4 = "Brüt Üzerinden %20 K.D.V.";
                field5 = "Toplam Alınan";
                headerField = makbuz_tutar.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL için <b>STOPAJ DAHİL KDV HARİÇ</b> Serbest Meslek Makbuzu Hesabı";
            }
            // KDV Dahil
            else {
                // %1 KDV Tipi
                if (kdv_tipi == 1) {
                    field4 = "Brüt Üzerinden %1 K.D.V.";
                    kdv_oran = 1;
                }
                // %10 KDV Tipi
                else if (kdv_tipi == 2) {
                    field4 = "Brüt Üzerinden %10 K.D.V.";
                    kdv_oran = 10;
                }
                // %20 KDV Tipi
                else if (kdv_tipi == 3) {
                    field4 = "Brüt Üzerinden %20 K.D.V.";
                    kdv_oran = 20;
                }
                
                val1_tuzel = makbuz_tutar / ((100 + kdv_oran) / 100);
                val1_gercek = makbuz_tutar / ((100 + kdv_oran) / 100);
                
                val2_tuzel = val1_tuzel * (stopaj_oran / 100);
                val2_gercek = val1_tuzel * (stopaj_oran_gercek / 100);
                
                val3_tuzel = val1_tuzel - val2_tuzel;
                val3_gercek = val1_gercek - val2_gercek;
                
                val4_tuzel = val1_tuzel * (kdv_oran / 100);
                val4_gercek = val1_gercek * (kdv_oran / 100);
                
                val5_tuzel = val3_tuzel + val4_tuzel;
                val5_gercek = val3_gercek + val4_gercek;
                
                field1 = "Brüt (K.D.V. Hariç)";
                field2 = "Stopaj (%20)";
                field3 = "Alınan Net Ücret";
                field5 = "Toplam Alınan";
                headerField = makbuz_tutar.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL için <b>STOPAJ ve KDV DAHİL</b> Serbest Meslek Makbuzu Hesabı";
            }
        }
        // Stopajsız
        else if (stopaj_tipi == 1) {
            stopaj_oran = 20;
            // KDV Hariç
            if (kdv_tipi == 0) {
                kdv_oran = 20;
                val1_tuzel = makbuz_tutar / (1 - stopaj_oran / 100);
                val1_gercek = makbuz_tutar / (1 - stopaj_oran_gercek / 100);
                
                val2_tuzel = val1_tuzel * (stopaj_oran / 100);
                val2_gercek = val1_gercek * (stopaj_oran_gercek / 100);
                
                val3_tuzel = val1_tuzel - val2_tuzel;
                val3_gercek = val1_gercek - val2_gercek;
                
                val4_tuzel = val1_tuzel * (kdv_oran / 100);
                val4_gercek = val1_gercek * (kdv_oran / 100);
                
                val5_tuzel = val3_tuzel + val4_tuzel;
                val5_gercek = val3_gercek + val4_gercek;
                
                field1 = "Brüt (K.D.V. Hariç)";
                field2 = "Stopaj (%20)";
                field3 = "Alınan Net Ücret";
                field4 = "Brüt Üzerinden %20 K.D.V.";
                field5 = "Toplam Alınan";
                headerField = makbuz_tutar.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL için <b>STOPAJ ve KDV HARİÇ</b> Serbest Meslek Makbuzu Hesabı";
            }
            // KDV Dahil
            else {
                // %1 KDV Tipi
                if (kdv_tipi == 1) {
                    field4 = "Brüt Üzerinden %1 K.D.V.";
                    kdv_oran = 1;
                }
                // %10 KDV Tipi
                else if (kdv_tipi == 2) {
                    field4 = "Brüt Üzerinden %10 K.D.V.";
                    kdv_oran = 10;
                }
                // %20 KDV Tipi
                else if (kdv_tipi == 3) {
                    field4 = "Brüt Üzerinden %20 K.D.V.";
                    kdv_oran = 20;
                }
                
                val1_tuzel = makbuz_tutar / (1 - stopaj_oran / 100 + kdv_oran / 100);
                val1_gercek = makbuz_tutar / (1 - stopaj_oran_gercek / 100 + kdv_oran / 100);
                
                val2_tuzel = val1_tuzel * (stopaj_oran / 100);
                val2_gercek = val1_gercek * (stopaj_oran_gercek / 100);
                
                val4_tuzel = val1_tuzel * (kdv_oran / 100);
                val4_gercek = val1_gercek * (kdv_oran / 100);
                
                val3_tuzel = val1_tuzel - val2_tuzel;
                val3_gercek = makbuz_tutar / (1 + kdv_oran / 100);
                
                val5_tuzel = makbuz_tutar;
                val5_gercek = makbuz_tutar;
                
                field1 = "Brüt (K.D.V. Hariç)";
                field2 = "Stopaj (%20)";
                field3 = "Alınan Net Ücret";
                field5 = "Toplam Alınan";
                headerField = makbuz_tutar.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL için <b>STOPAJ HARİÇ KDV DAHİL</b> Serbest Meslek Makbuzu Hesabı";
            }
        }
        
        // Sonuç tablosunu oluştur
        const resultHTML = `
            <div class="makbuz-result">
                <h4 class="mb-3 text-center">${headerField}</h4>
                <div class="table-responsive">
                    <table class="table table-bordered makbuz-table">
                        <thead>
                            <tr>
                                <th>Makbuza Yazılacak</th>
                                <th>Tüzel Kişi</th>
                                <th>Gerçek Kişi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${field1}</td>
                                <td>${val1_tuzel.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                                <td>${val1_gercek.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                            </tr>
                            <tr>
                                <td>${field2}</td>
                                <td>${val2_tuzel.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                                <td>${val2_gercek.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                            </tr>
                            <tr>
                                <td>${field3}</td>
                                <td>${val3_tuzel.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                                <td>${val3_gercek.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                            </tr>
                            <tr>
                                <td>${field4}</td>
                                <td>${val4_tuzel.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                                <td>${val4_gercek.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                            </tr>
                            <tr class="total-row">
                                <td><strong>${field5}</strong></td>
                                <td><strong>${val5_tuzel.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</strong></td>
                                <td><strong>${val5_gercek.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Sonucu göster
        makbuzSonucDiv.innerHTML = resultHTML;
    }

    // Faiz hesaplama formu temizleme
    faizFormTemizle() {
        const form = document.getElementById('faiz-hesaplama-form');
        if (form) {
            form.reset();
        }
        
        // Değer alanlarını temizle
        const anaparaInput = document.getElementById('anapara');
        const faizOraniInput = document.getElementById('faiz_orani');
        if (anaparaInput) anaparaInput.value = '';
        if (faizOraniInput) faizOraniInput.value = '';
        
        // Sonuç alanlarını temizle
        const faizSonucInput = document.getElementById('faizSonuc');
        const faizSonucEkraniTextarea = document.getElementById('faizSonucEkrani');
        if (faizSonucInput) faizSonucInput.value = '';
        if (faizSonucEkraniTextarea) faizSonucEkraniTextarea.value = '';
    }
    
    // Faiz hesaplama
    faizHesapla() {
        // Form elemanlarını al
        const anaparaInput = document.getElementById('anapara');
        const faizOraniInput = document.getElementById('faiz_orani');
        const esasGunSelect = document.getElementById('esas_gun');
        const baslangicDateInput = document.getElementById('baslangic');
        const bitisDateInput = document.getElementById('bitis');
        const faizSonucInput = document.getElementById('faizSonuc');
        const faizSonucEkraniTextarea = document.getElementById('faizSonucEkrani');
        
        if (!anaparaInput || !faizOraniInput || !esasGunSelect || !baslangicDateInput || !bitisDateInput || !faizSonucInput || !faizSonucEkraniTextarea) {
            console.error("Form elemanları bulunamadı");
            return;
        }
        
        // Formattan arındırılmış değerleri al
        const anapara = window.calculatorManager.parseFormattedNumber(anaparaInput.value);
        const faizOrani = parseFloat(faizOraniInput.value.replace(",", "."));
        const esasGun = parseInt(esasGunSelect.value);
        const baslangicTarih = baslangicDateInput.value;
        const bitisTarih = bitisDateInput.value;
        
        // Hata kontrolleri
        if (anapara <= 0 || isNaN(anapara)) {
            alert("Lütfen geçerli bir anapara değeri giriniz.");
            return;
        }
        
        if (faizOrani <= 0 || isNaN(faizOrani)) {
            alert("Lütfen geçerli bir faiz oranı giriniz.");
            return;
        }
        
        if (!baslangicTarih || !bitisTarih) {
            alert("Lütfen başlangıç ve bitiş tarihlerini giriniz.");
            return;
        }
        
        // Tarihleri dönüştür ve gün farkını hesapla
        const baslangicDate = new Date(baslangicTarih);
        const bitisDate = new Date(bitisTarih);
        
        if (bitisDate <= baslangicDate) {
            alert("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.");
            return;
        }
        
        const gunFarki = Math.round((bitisDate - baslangicDate) / (1000 * 60 * 60 * 24));
        
        // Faiz hesaplama
        const faizTutari = (anapara * (faizOrani / 100) * gunFarki) / esasGun;
        
        // Sonuçları göster
        faizSonucInput.value = faizTutari.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL";
        
        // Ayrıntılı sonuç metni
        faizSonucEkraniTextarea.value = 
            "AYRINTILI FAİZ HESAPLAMASI" + 
            "\n---------------------------" + 
            "\nAna Para: " + anapara.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL" + 
            "\nBaşlangıç Tarihi: " + this.formatDateForDisplay(baslangicDate) + 
            "\nBitiş Tarihi: " + this.formatDateForDisplay(bitisDate) + 
            "\nGün Sayısı: " + gunFarki + " gün" + 
            "\n---------------------------" + 
            "\nFaiz Oranı: %" + faizOrani.toFixed(2).replace('.', ',') + 
            "\nEsas Gün: " + esasGun + 
            "\nFaiz Tutarı: " + faizTutari.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL" + 
            "\n---------------------------";
    }
    
    // Tarih formatı için yardımcı fonksiyon
    formatDateForDisplay(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Vekalet ücreti hesaplama formu temizleme
    vekaletFormTemizle() {
        document.getElementById('dava_degeri').value = '';
        document.getElementById('vekaletSonuc').value = '';
        document.getElementById('vekaletSonucEkrani').value = '';
        document.getElementById('konu').value = "1";
        document.getElementById('mahkeme_tipi').value = "0";
    }
    
    // Vekalet ücreti hesaplama fonksiyonu
    calculateVekaletTarife(value) {
        let res = 0.0;
        const oran1 = 0.16;
        const oran2 = 0.15;
        const oran3 = 0.14;
        const oran4 = 0.11;
        const oran5 = 0.08;
        const oran6 = 0.05;
        const oran7 = 0.03;
        const oran8 = 0.02;
        const oran9 = 0.01;

        const aralik1 = 200000;
        const aralik2 = 200000;
        const aralik3 = 400000;
        const aralik4 = 600000;
        const aralik5 = 800000;
        const aralik6 = 1000000;
        const aralik7 = 1200000;
        const aralik8 = 1400000;

        const sinir1 = aralik1;
        const sinir2 = sinir1 + aralik2;
        const sinir3 = sinir2 + aralik3;
        const sinir4 = sinir3 + aralik4;
        const sinir5 = sinir4 + aralik5;
        const sinir6 = sinir5 + aralik6;
        const sinir7 = sinir6 + aralik7;
        const sinir8 = sinir7 + aralik8;

        if (value > 0 && value <= sinir1) {
            const val1 = value * oran1;
            res = val1;
        } else if (value > sinir1 && value <= sinir2) {
            const val1 = aralik1 * oran1;
            const val2 = (value - sinir1) * oran2;
            res = val1 + val2;
        } else if (value > sinir2 && value <= sinir3) {
            const val1 = aralik1 * oran1;
            const val2 = aralik2 * oran2;
            const val3 = (value - sinir2) * oran3;
            res = val1 + val2 + val3;
        } else if (value > sinir3 && value <= sinir4) {
            const val1 = aralik1 * oran1;
            const val2 = aralik2 * oran2;
            const val3 = aralik3 * oran3;
            const val4 = (value - sinir3) * oran4;
            res = val1 + val2 + val3 + val4;
        } else if (value > sinir4 && value <= sinir5) {
            const val1 = aralik1 * oran1;
            const val2 = aralik2 * oran2;
            const val3 = aralik3 * oran3;
            const val4 = aralik4 * oran4;
            const val5 = (value - sinir4) * oran5;
            res = val1 + val2 + val3 + val4 + val5;
        } else if (value > sinir5 && value <= sinir6) {
            const val1 = aralik1 * oran1;
            const val2 = aralik2 * oran2;
            const val3 = aralik3 * oran3;
            const val4 = aralik4 * oran4;
            const val5 = aralik5 * oran5;
            const val6 = (value - sinir5) * oran6;
            res = val1 + val2 + val3 + val4 + val5 + val6;
        } else if (value > sinir6 && value <= sinir7) {
            const val1 = aralik1 * oran1;
            const val2 = aralik2 * oran2;
            const val3 = aralik3 * oran3;
            const val4 = aralik4 * oran4;
            const val5 = aralik5 * oran5;
            const val6 = aralik6 * oran6;
            const val7 = (value - sinir6) * oran7;
            res = val1 + val2 + val3 + val4 + val5 + val6 + val7;
        } else if (value > sinir7 && value <= sinir8) {
            const val1 = aralik1 * oran1;
            const val2 = aralik2 * oran2;
            const val3 = aralik3 * oran3;
            const val4 = aralik4 * oran4;
            const val5 = aralik5 * oran5;
            const val6 = aralik6 * oran6;
            const val7 = aralik7 * oran7;
            const val8 = (value - sinir7) * oran8;
            res = val1 + val2 + val3 + val4 + val5 + val6 + val7 + val8;
        }
        else if (value > sinir8) {
            const val1 = aralik1 * oran1;
            const val2 = aralik2 * oran2;
            const val3 = aralik3 * oran3;
            const val4 = aralik4 * oran4;
            const val5 = aralik5 * oran5;
            const val6 = aralik6 * oran6;
            const val7 = aralik7 * oran7;
            const val8 = aralik8 * oran8;
            const val9 = (value - sinir8) * oran9;
            res = val1 + val2 + val3 + val4 + val5 + val6 + val7 + val8 + val9;
        }
        return res;
    }
    
    // Vekalet ücreti hesaplama
    vekaletUcretiHesapla() {
        // Form elemanlarını al
        const konuSelect = document.getElementById('konu');
        const mahkemeTipiSelect = document.getElementById('mahkeme_tipi');
        const davaDegeriInput = document.getElementById('dava_degeri');
        const vekaletSonucInput = document.getElementById('vekaletSonuc');
        const vekaletSonucEkraniTextarea = document.getElementById('vekaletSonucEkrani');
        
        if (!konuSelect || !davaDegeriInput || !vekaletSonucInput || !vekaletSonucEkraniTextarea) {
            console.error("Form elemanları bulunamadı");
            return;
        }
        
        // Formattan arındırılmış değeri al
        const davaDegeri = window.calculatorManager.parseFormattedNumber(davaDegeriInput.value);
        const konu = parseInt(konuSelect.value);
        const mahkeme = konuSelect.value == "2" ? 0 : parseInt(mahkemeTipiSelect.value);
        
        // Hata kontrolleri
        if (davaDegeri <= 0 || isNaN(davaDegeri)) {
            alert("Lütfen geçerli bir dava değeri giriniz.");
            return;
        }
        
        // Değişkenleri tanımla
        let res = 0.0;
        let mahkemeAdi = "";
        let minDeger = 0;
        
        // Konusu para olan davalar
        if (konu == 1) {
            // Mahkeme tipine göre hesaplama yap
            if (mahkeme == 0) { // İcra Mahkemeleri
                mahkemeAdi = "İcra Mahkemeleri";
                minDeger = 6800;
                if (davaDegeri < minDeger) {
                    res = davaDegeri;
                } else if (davaDegeri >= minDeger && davaDegeri < (minDeger * 100) / 16) {
                    res = minDeger;
                } else {
                    res = window.calculatorManager.calculateVekaletTarife(davaDegeri);
                }
            } else if (mahkeme == 1) { // Sulh Mahkemeleri
                mahkemeAdi = "Sulh Mahkemeleri";
                minDeger = 10700;
                if (davaDegeri < minDeger) {
                    res = davaDegeri;
                } else if (davaDegeri >= minDeger && davaDegeri < (minDeger * 100) / 16) {
                    res = minDeger;
                } else {
                    res = window.calculatorManager.calculateVekaletTarife(davaDegeri);
                }
            } else if (mahkeme == 2) { // Sulh Ceza/İnfaz Mahkemeleri
                mahkemeAdi = "Sulh Ceza/İnfaz Mahkemeleri";
                minDeger = 8000;
                if (davaDegeri < minDeger) {
                    res = davaDegeri;
                } else if (davaDegeri >= minDeger && davaDegeri < (minDeger * 100) / 16) {
                    res = minDeger;
                } else {
                    res = window.calculatorManager.calculateVekaletTarife(davaDegeri);
                }
            } else if (mahkeme == 3) { // Asliye Mahkemeleri
                mahkemeAdi = "Asliye Mahkemeleri";
                minDeger = 17900;
                if (davaDegeri < minDeger) {
                    res = davaDegeri;
                } else if (davaDegeri >= minDeger && davaDegeri < (minDeger * 100) / 16) {
                    res = minDeger;
                } else {
                    res = window.calculatorManager.calculateVekaletTarife(davaDegeri);
                }
            } else if (mahkeme == 4) { // Tüketici Mahkemeleri
                mahkemeAdi = "Tüketici Mahkemeleri";
                minDeger = 9000;
                if (davaDegeri < minDeger) {
                    res = davaDegeri;
                } else if (davaDegeri >= minDeger && davaDegeri < (minDeger * 100) / 16) {
                    res = minDeger;
                } else {
                    res = window.calculatorManager.calculateVekaletTarife(davaDegeri);
                }
            } else if (mahkeme == 5) { // Fikri Sınai Haklar Mahkemeleri
                mahkemeAdi = "Fikri Sınai Haklar Mahkemeleri";
                minDeger = 25500;
                if (davaDegeri < minDeger) {
                    res = davaDegeri;
                } else if (davaDegeri >= minDeger && davaDegeri < (minDeger * 100) / 16) {
                    res = minDeger;
                } else {
                    res = window.calculatorManager.calculateVekaletTarife(davaDegeri);
                }
            } else if (mahkeme == 6) { // İdare ve Vergi Mahkemeleri (Duruşmalı)
                mahkemeAdi = "İdare ve Vergi Mahkemeleri (Duruşmalı)";
                minDeger = 20900;
                if (davaDegeri < minDeger) {
                    res = davaDegeri;
                } else if (davaDegeri >= minDeger && davaDegeri < (minDeger * 100) / 16) {
                    res = minDeger;
                } else {
                    res = window.calculatorManager.calculateVekaletTarife(davaDegeri);
                }
            } else if (mahkeme == 7) { // İdare ve Vergi Mahkemeleri (Duruşmasız)
                mahkemeAdi = "İdare ve Vergi Mahkemeleri (Duruşmasız)";
                minDeger = 10500;
                if (davaDegeri < minDeger) {
                    res = davaDegeri;
                } else if (davaDegeri >= minDeger && davaDegeri < (minDeger * 100) / 16) {
                    res = minDeger;
                } else {
                    res = window.calculatorManager.calculateVekaletTarife(davaDegeri);
                }
            }
        }
        // İcra Takipleri
        else if (konu == 2) {
            mahkemeAdi = "İcra Takipleri";
            minDeger = 3600;
            if (davaDegeri < minDeger) {
                res = davaDegeri;
            } else if (davaDegeri >= minDeger && davaDegeri < (minDeger * 100) / 16) {
                res = minDeger;
            } else {
                res = window.calculatorManager.calculateVekaletTarife(davaDegeri);
            }
        }
        
        // Sonuçları göster
        vekaletSonucInput.value = res.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL";
        
        // Hesaplama açıklamasını oluştur
        let hesaplamaAciklamasi = "";
        if (davaDegeri < minDeger) {
            hesaplamaAciklamasi = `Dava değeri (${davaDegeri.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL), asgari ücret olan ${minDeger.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL'den küçük olduğu için dava değeri kadar vekalet ücreti hesaplanmıştır.`;
        } else if (davaDegeri >= minDeger && davaDegeri < (minDeger * 100) / 16) {
            hesaplamaAciklamasi = `Dava değeri (${davaDegeri.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL), asgari ücretin (${minDeger.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL) üzerinde ancak tarifedeki nispi miktardan az olduğu için asgari ücret alınmıştır.`;
        } else {
            hesaplamaAciklamasi = `Dava değeri (${davaDegeri.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} TL) üzerinden tarife esaslarına göre hesaplama yapılmıştır.`;
        }
        
        // Ayrıntılı sonuç metni
        vekaletSonucEkraniTextarea.value = 
            "AYRINTILI VEKALET ÜCRETİ HESAPLAMASI" + 
            "\n---------------------------" + 
            "\nUyuşmazlık Konusu: " + (konu == 1 ? "Konusu Para Olan Davalar" : "İcra Takipleri") + 
            "\nMahkeme Türü: " + mahkemeAdi + 
            "\nDava Değeri: " + davaDegeri.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL" + 
            "\n---------------------------" + 
            "\nHesaplama Yöntemi: " + hesaplamaAciklamasi + 
            "\n---------------------------" + 
            "\nVekalet Ücreti: " + res.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " TL" + 
            "\n---------------------------";
    }

    loadCalculationScripts() {
        // Hesaplama ve temizleme fonksiyonlarını sınıf metodlarına bağla
        this.temizle = this.temizle.bind(this);
        this.gideravansi = this.gideravansi.bind(this);
        this.islahFormTemizle = this.islahFormTemizle.bind(this);
        this.islahHarciHesapla = this.islahHarciHesapla.bind(this);
        this.makbuzFormTemizle = this.makbuzFormTemizle.bind(this);
        this.makbuzHesapla = this.makbuzHesapla.bind(this);
        this.formatPercentInput = this.formatPercentInput.bind(this);
        this.faizFormTemizle = this.faizFormTemizle.bind(this);
        this.faizHesapla = this.faizHesapla.bind(this);
        this.formatDateForDisplay = this.formatDateForDisplay.bind(this);
        this.vekaletFormTemizle = this.vekaletFormTemizle.bind(this);
        this.vekaletUcretiHesapla = this.vekaletUcretiHesapla.bind(this);
        this.calculateVekaletTarife = this.calculateVekaletTarife.bind(this);
        this.infazFormTemizle = this.infazFormTemizle.bind(this);
        this.infazHesapla = this.infazHesapla.bind(this);
        this.calculateAge = this.calculateAge.bind(this);
        this.gunleriYilAyGunOlarakFormatla = this.gunleriYilAyGunOlarakFormatla.bind(this);
        this.sureFormTemizle = this.sureFormTemizle.bind(this);
        this.sureHesapla = this.sureHesapla.bind(this);
        this.isMaliTatil = this.isMaliTatil.bind(this);
        this.isAdliTatil = this.isAdliTatil.bind(this);
        this.isResmiTatil = this.isResmiTatil.bind(this);
        
        // CalculatorManager'ı global scope'a ekle
        window.calculatorManager = this;
    }

    showCalculatorPanel() {
        const overlay = document.querySelector('.calculator-overlay');
        overlay.classList.add('active');
    }

    hideCalculatorPanel() {
        const overlay = document.querySelector('.calculator-overlay');
        overlay.classList.remove('active');
    }

    showCalculatorTool(toolId) {
        // İnfaz hesaplama aracını göstermeyi engelle
        if (toolId === 'execution-calculator') {
            return;
        }
        
        // Tüm araçları gizle
        const tools = document.querySelectorAll('.calculator-tool');
        tools.forEach(tool => tool.classList.remove('active'));
        
        // Seçilen aracı göster
        const selectedTool = document.getElementById(toolId);
        if (selectedTool) {
            selectedTool.classList.add('active');
        }
    }

    // İnfaz hesaplama formu temizleme
    infazFormTemizle() {
        // Dropdown menüleri varsayılan değerlerine döndür
        document.getElementById('suc_turu').value = "V15";
        document.getElementById('ceza_turu').value = "V3";
        document.getElementById('mahsup').value = "V9";
        document.getElementById('tekerrur').value = "V11";
        document.getElementById('ozel_durum').value = "0";
        
        // Diğer form elemanlarını temizle
        document.getElementById('suc_tarihi').value = '';
        document.getElementById('dogum_tarihi').value = '';
        document.getElementById('ceza_yil').value = '0';
        document.getElementById('ceza_ay').value = '0';
        document.getElementById('ceza_gun').value = '0';
        document.getElementById('mahsup_gun').value = '0';
        
        // Sonuçları temizle
        document.getElementById('infazSonuc').value = '';
        document.getElementById('infazSonucEkrani').value = '';
        
        // Süreli hapis cezası ise ceza miktarı giriş alanını göster
        document.querySelector('.ceza-suresi-row').style.display = 'flex';
        
        // Mahsup gün kutusunu gizle
        document.querySelector('.mahsup-gun-group').style.display = 'none';
    }
    
    // İnfaz hesaplama
    infazHesapla() {
        // Form elemanlarını al
        const sucTuruSelect = document.getElementById('suc_turu');
        const cezaTuruSelect = document.getElementById('ceza_turu');
        const mahsupSelect = document.getElementById('mahsup');
        const tekerrurSelect = document.getElementById('tekerrur');
        const ozelDurumSelect = document.getElementById('ozel_durum');
        
        const sucTarihiInput = document.getElementById('suc_tarihi');
        const dogumTarihiInput = document.getElementById('dogum_tarihi');
        const cezaYilInput = document.getElementById('ceza_yil');
        const cezaAyInput = document.getElementById('ceza_ay');
        const cezaGunInput = document.getElementById('ceza_gun');
        const mahsupGunInput = document.getElementById('mahsup_gun');
        
        const infazSonucInput = document.getElementById('infazSonuc');
        const infazSonucEkraniTextarea = document.getElementById('infazSonucEkrani');
        
        // Hata kontrolleri
        if (!sucTarihiInput.value) {
            alert("Lütfen suç tarihini giriniz.");
            return;
        }
        
        if (!dogumTarihiInput.value) {
            alert("Lütfen doğum tarihini giriniz.");
            return;
        }
        
        // Seçili değerleri al
        const sucTuru = sucTuruSelect.value;
        const sucTuruAdi = sucTuruSelect.options[sucTuruSelect.selectedIndex].text;
        
        const cezaTuru = cezaTuruSelect.value;
        const cezaTuruAdi = cezaTuruSelect.options[cezaTuruSelect.selectedIndex].text;
        
        const mahsup = mahsupSelect.value;
        const tekerrur = tekerrurSelect.value;
        
        const ozelDurum = ozelDurumSelect.value;
        let ozelDurumAdi = "";
        if (ozelDurum !== "0") {
            ozelDurumAdi = ozelDurumSelect.options[ozelDurumSelect.selectedIndex].text;
        }
        
        // Ceza süresi kontrolü (eğer süreli hapis cezası seçildiyse)
        if (cezaTuru === "V3") {
            const cezaYil = parseInt(cezaYilInput.value) || 0;
            const cezaAy = parseInt(cezaAyInput.value) || 0;
            const cezaGun = parseInt(cezaGunInput.value) || 0;
            
            if (cezaYil === 0 && cezaAy === 0 && cezaGun === 0) {
                alert("Lütfen yıl, ay ve gün olarak verilen cezayı giriniz.");
                return;
            }
        }
        
        // Tarih hesaplamaları için temel değişkenleri oluştur
        const sucTarihi = new Date(sucTarihiInput.value);
        const dogumTarihi = new Date(dogumTarihiInput.value);
        
        // Yaş hesaplama
        const yasYil = window.calculatorManager.calculateAge(dogumTarihi, sucTarihi);
        
        // Ceza süresi hesaplama
        let toplamCezaGun = 0;
        
        if (cezaTuru === "V3") { // Süreli Hapis Cezası
            const cezaYil = parseInt(cezaYilInput.value) || 0;
            const cezaAy = parseInt(cezaAyInput.value) || 0;
            const cezaGun = parseInt(cezaGunInput.value) || 0;
            
            toplamCezaGun = (cezaYil * 365) + (cezaAy * 30) + cezaGun;
        } else if (cezaTuru === "V4") { // Ağırlaştırılmış Müebbet
            toplamCezaGun = 365 * 30; // 30 yıl varsayalım (gerçekte infaz durumuna göre değişir)
        } else if (cezaTuru === "V5") { // Müebbet
            toplamCezaGun = 365 * 24; // 24 yıl varsayalım (gerçekte infaz durumuna göre değişir)
        }
        
        // Mahsup hesaplama
        let mahsupGun = 0;
        if (mahsup === "V10") {
            mahsupGun = parseInt(mahsupGunInput.value) || 0;
        }
        
        // Koşullu salıverilme oranı hesaplama (infaz oranı)
        let infazOrani = 0.5; // Varsayılan oran (1/2)
        
        // Suç türüne göre infaz oranını ayarla
        if (["V20", "V21", "V22", "V23", "V24", "V25", "V26", "V27", "V28", "V29", "V30", "V31", "V32"].includes(sucTuru)) {
            infazOrani = 0.75; // Bu suçlar için 3/4 oranı
        } else if (["V16", "V17", "V19"].includes(sucTuru)) {
            infazOrani = 0.75; // Terör, Devlete karşı suçlar ve Uyuşturucu için 3/4 oranı
        }
        
        // Tekerrür durumunu kontrol et
        if (tekerrur === "V12") {
            infazOrani += 0.1; // Tekerrür varsa oranı artır
        }
        
        // Özel durumları kontrol et
        let ozelDurumIndirimi = 0;
        if (ozelDurum === "V0" || ozelDurum === "V1") {
            ozelDurumIndirimi = 0.1; // Özel durumlarda indirim
        }
        
        // Yaş faktörünü kontrol et
        let yasIndirimi = 0;
        if (yasYil < 18) {
            yasIndirimi = 0.05; // 18 yaşından küçükse indirim
        } else if (yasYil > 65) {
            yasIndirimi = 0.05; // 65 yaşından büyükse indirim
        }
        
        // Nihai infaz oranını hesapla
        let nihaiFazOrani = infazOrani - ozelDurumIndirimi - yasIndirimi;
        if (nihaiFazOrani < 0.33) nihaiFazOrani = 0.33; // Minimum 1/3 oran
        
        // İnfaz süresini hesapla
        const infazSuresiGun = Math.ceil(toplamCezaGun * nihaiFazOrani);
        
        // Mahsubu düş
        const netInfazSuresiGun = Math.max(0, infazSuresiGun - mahsupGun);
        
        // Denetimli serbestlik süresi (sabit 365 gün)
        const denetimliSerbestlikGun = 365;
        
        // Cezaevinde geçirilecek süre (denetimli serbestlik hariç)
        const cezaevindeGececekGun = netInfazSuresiGun - denetimliSerbestlikGun;
        
        // Açık ve kapalı cezaevi sürelerini hesapla
        let kapaliCezaeviGun = 0;
        let acikCezaeviGun = 0;
        
        // Suç türü kontrolü
        const isTerrorOrSexual = ["V16", "V17", "V19", "V20", "V21", "V22", "V31"].includes(sucTuru); // Terör, örgüt veya cinsel suçlar
        
        // Toplam ceza hesaplaması (yıl olarak)
        const toplamCezaYil = toplamCezaGun / 365;
        
        // Doğrudan açık cezaevine alınabilenler
        if (!isTerrorOrSexual && 
            ((cezaTuru === "V3" && toplamCezaYil <= 3) || // Kasıtlı suçlar için 3 yıl veya daha az
             (sucTuru === "V18" && toplamCezaYil <= 5))) { // Taksirli suçlar için 5 yıl veya daha az
            // Tüm süreyi açık cezaevinde geçirecek
            acikCezaeviGun = cezaevindeGececekGun;
            kapaliCezaeviGun = 0;
        }
        // Kapalı kurumdan açık kuruma aktarılabilenler
        else {
            // Koşullu salıverilme tarihine kalan süreyi hesapla (denetimli serbestlikten yararlanma tarihi)
            let kosulluSaliverilmeyeKalanGun = 0;
            
            if (cezaTuru === "V3") { // Süreli hapis cezası
                // Süreli hapis için koşullu salıverilme tarihine 7 yıl veya daha az kalması şartı
                const yediYilGun = 7 * 365; // 7 yıl
                
                if (toplamCezaYil < 10) {
                    // 10 yıldan az ceza alanlar: Minimum 1 ay kapalı cezaevinde kalmalı
                    const birAyKapali = 30; // 1 ay
                    
                    // Koşullu salıverilmeye 7 yıl veya daha az kalması şartı
                    // Toplam cezaevi süresi - 7 yıl = Açık cezaevine geçiş için minimum kalınması gereken süre
                    const kosulluSaliverilmeKriteri = Math.max(0, cezaevindeGececekGun - yediYilGun);
                    
                    // İki kriterin büyük olanı (hangisi daha geç tarihli açık cezaevine geçişi sağlıyorsa)
                    kapaliCezaeviGun = Math.max(birAyKapali, kosulluSaliverilmeKriteri);
                } else {
                    // 10 yıl ve üzeri ceza alanlar: Cezanın onda birini kapalıda geçirmeliler
                    const ondaBirKapali = Math.ceil(cezaevindeGececekGun / 10);
                    
                    // Koşullu salıverilmeye 7 yıl veya daha az kalması şartı
                    const kosulluSaliverilmeKriteri = Math.max(0, cezaevindeGececekGun - yediYilGun);
                    
                    // İki kriterin büyük olanı
                    kapaliCezaeviGun = Math.max(ondaBirKapali, kosulluSaliverilmeKriteri);
                }
            } else if (cezaTuru === "V5") { // Müebbet
                // Müebbet için koşullu salıverilme tarihine 5 yıl veya daha az kalması şartı
                const besYilGun = 5 * 365; // 5 yıl
                
                // Koşullu salıverilmeye 5 yıl veya daha az kalması şartı
                kapaliCezaeviGun = Math.max(0, cezaevindeGececekGun - besYilGun);
            } else if (cezaTuru === "V4") { // Ağırlaştırılmış müebbet
                // Yüksek güvenlikli kapalı kurum: Toplam cezanın 1/3'ünü iyi halli geçirip, koşullu salıverilmeye 3 yıl veya daha az kalanlar
                const ucYilGun = 3 * 365; // 3 yıl
                const cezaninUcteBiri = Math.ceil(cezaevindeGececekGun / 3);
                
                // Koşullu salıverilmeye 3 yıl veya daha az kalması şartı
                const kosulluSaliverilmeKriteri = Math.max(0, cezaevindeGececekGun - ucYilGun);
                
                // İki kriterin büyük olanı
                kapaliCezaeviGun = Math.max(cezaninUcteBiri, kosulluSaliverilmeKriteri);
            }
            
            // Kalan süre açık cezaevinde geçirilecek
            acikCezaeviGun = Math.max(0, cezaevindeGececekGun - kapaliCezaeviGun);
        }
        
        // Kapalı ve açık cezaevi sürelerini formatla
        const kapaliCezaeviSuresi = window.calculatorManager.gunleriYilAyGunOlarakFormatla(kapaliCezaeviGun);
        const acikCezaeviSuresi = window.calculatorManager.gunleriYilAyGunOlarakFormatla(acikCezaeviGun);
        
        // Tahliye tarihini hesapla
        const bugun = new Date();
        const tahliyeTarihi = new Date(bugun);
        tahliyeTarihi.setDate(tahliyeTarihi.getDate() + netInfazSuresiGun);
        
        // Şartlı tahliye tarihini hesapla (infaz süresinin kalan kısmı denetimli serbestlikle tamamlanır)
        const sartliTahliyeTarihi = new Date(tahliyeTarihi);
        sartliTahliyeTarihi.setDate(sartliTahliyeTarihi.getDate() - denetimliSerbestlikGun);
        
        // Sonuçları göster
        infazSonucInput.value = `Tahmini Tahliye: ${window.calculatorManager.formatDateForDisplay(tahliyeTarihi)}`;
        
        // Ayrıntılı sonuç metni
        const gunYilAyCevirme = window.calculatorManager.gunleriYilAyGunOlarakFormatla(netInfazSuresiGun);
        const denetimliSerbestlikSuresi = window.calculatorManager.gunleriYilAyGunOlarakFormatla(denetimliSerbestlikGun);
        const cezaevindeKalacakSure = window.calculatorManager.gunleriYilAyGunOlarakFormatla(cezaevindeGececekGun);
        
        infazSonucEkraniTextarea.value = 
            "AYRINTILI İNFAZ HESAPLAMASI" + 
            "\n----------------------------------" + 
            "\nSuç Türü: " + sucTuruAdi + 
            "\nCeza Türü: " + cezaTuruAdi +
            (cezaTuru === "V3" ? 
                "\nVerilen Ceza: " + cezaYilInput.value + " yıl " + cezaAyInput.value + " ay " + cezaGunInput.value + " gün" : "") +
            "\nSuç Tarihi: " + window.calculatorManager.formatDateForDisplay(sucTarihi) + 
            "\nDoğum Tarihi: " + window.calculatorManager.formatDateForDisplay(dogumTarihi) + 
            "\nSuç Tarihindeki Yaş: " + yasYil + 
            (ozelDurumAdi ? "\nÖzel Durum: " + ozelDurumAdi : "") + 
            (mahsup === "V10" ? "\nMahsup Süresi: " + mahsupGun + " gün" : "") +
            (tekerrur === "V12" ? "\nTekerrür: Var" : "") +
            "\n----------------------------------" + 
            "\nİnfaz Oranı: %" + (nihaiFazOrani * 100).toFixed(0) +
            "\nİnfaz Edilecek Toplam Süre: " + gunYilAyCevirme +
            "\nDenetimli Serbestlik Süresi: " + denetimliSerbestlikSuresi +
            "\nCezaevinde Geçirilecek Süre: " + cezaevindeKalacakSure +
            "\n  - Kapalı Cezaevi: " + kapaliCezaeviSuresi +
            "\n  - Açık Cezaevi: " + acikCezaeviSuresi +
            "\n----------------------------------" + 
            "\nDenetimli Serbestlikten Yaralanma Tarihi: " + window.calculatorManager.formatDateForDisplay(sartliTahliyeTarihi) + 
            "\nTahmini Tahliye Tarihi: " + window.calculatorManager.formatDateForDisplay(tahliyeTarihi) + 
            "\n----------------------------------" +
            "\nNOT: Bu hesaplama tahmini olup, kesin sonuçlar için İnfaz Hakimliğine başvurunuz.";
    }
    
    // Yaş hesaplama yardımcı fonksiyonu
    calculateAge(birthDate, otherDate) {
        let years = otherDate.getFullYear() - birthDate.getFullYear();
        if (otherDate.getMonth() < birthDate.getMonth() || 
            (otherDate.getMonth() === birthDate.getMonth() && otherDate.getDate() < birthDate.getDate())) {
            years--;
        }
        return years;
    }
    
    // Gün sayısını yıl, ay, gün olarak formatla
    gunleriYilAyGunOlarakFormatla(gunSayisi) {
        const yil = Math.floor(gunSayisi / 365);
        const kalanGun = gunSayisi % 365;
        const ay = Math.floor(kalanGun / 30);
        const gun = kalanGun % 30;
        
        let sonuc = "";
        if (yil > 0) sonuc += yil + " yıl ";
        if (ay > 0) sonuc += ay + " ay ";
        if (gun > 0) sonuc += gun + " gün";
        
        return sonuc.trim();
    }
    
    // Süre hesaplama formu temizleme
    sureFormTemizle() {
        // Form elemanlarını temizle
        document.getElementById('teblig_tarihi').value = '';
        document.getElementById('sure_miktari').value = '7';
        document.getElementById('sure_birimi').value = 'gun';
        document.getElementById('etebligat').checked = false;
        document.getElementById('mali_tatil_teblig').checked = false;
        document.getElementById('mali_tatil_bitis').checked = false;
        document.getElementById('adli_tatil').checked = false;
        document.getElementById('adli_tatil_uzatma').value = '7';
        
        // Sonuçları temizle
        document.getElementById('sureSonuc').value = '';
        document.getElementById('sureSonucEkrani').value = '';
    }
    
    // Tarih belli bir aralıkta mı kontrol et
    isDateInRange(date, startMonth, startDay, endMonth, endDay) {
        const month = date.getMonth() + 1; // JavaScript'te aylar 0'dan başlar
        const day = date.getDate();
        
        if (startMonth < endMonth) {
            return (month > startMonth || (month === startMonth && day >= startDay)) && 
                   (month < endMonth || (month === endMonth && day <= endDay));
        } else if (startMonth === endMonth) {
            return month === startMonth && day >= startDay && day <= endDay;
        } else {
            return (month > startMonth || (month === startMonth && day >= startDay)) || 
                   (month < endMonth || (month === endMonth && day <= endDay));
        }
    }
    
    // Mali tatil mi kontrol et (1-20 Temmuz)
    isMaliTatil(date) {
        return this.isDateInRange(date, 7, 1, 7, 20);
    }
    
    // Adli tatil mi kontrol et (20 Temmuz - 31 Ağustos)
    isAdliTatil(date) {
        return this.isDateInRange(date, 7, 20, 8, 31);
    }
    
    // Resmi tatil günleri (2024 yılı için)
    isResmiTatil(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayOfWeek = date.getDay(); // 0: Pazar, 6: Cumartesi
        
        // Hafta sonu kontrolü
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return true;
        }
        
        // Resmi tatil günleri (her yıl için güncellenmelidir)
        // 1 Ocak - Yılbaşı
        if (month === 1 && day === 1) return true;
        
        // 23 Nisan - Ulusal Egemenlik ve Çocuk Bayramı
        if (month === 4 && day === 23) return true;
        
        // 1 Mayıs - Emek ve Dayanışma Günü
        if (month === 5 && day === 1) return true;
        
        // 19 Mayıs - Atatürk'ü Anma, Gençlik ve Spor Bayramı
        if (month === 5 && day === 19) return true;
        
        // 15 Temmuz - Demokrasi ve Milli Birlik Günü
        if (month === 7 && day === 15) return true;
        
        // 30 Ağustos - Zafer Bayramı
        if (month === 8 && day === 30) return true;
        
        // 29 Ekim - Cumhuriyet Bayramı
        if (month === 10 && day === 29) return true;
        
        // Not: Dini bayramlar hareketli olduğu için burada yer almamaktadır.
        // Gerçek kullanımda bir API veya daha kapsamlı bir hesaplama kullanılmalıdır.
        
        return false;
    }
    
    // Süre hesaplama
    sureHesapla() {
        // Form elemanlarını al
        const tebligTarihiInput = document.getElementById('teblig_tarihi');
        const sureMiktariInput = document.getElementById('sure_miktari');
        const sureBirimiSelect = document.getElementById('sure_birimi');
        const etebligatCheck = document.getElementById('etebligat');
        const maliTatilTebligCheck = document.getElementById('mali_tatil_teblig');
        const maliTatilBitisCheck = document.getElementById('mali_tatil_bitis');
        const adliTatilCheck = document.getElementById('adli_tatil');
        const adliTatilUzatmaSelect = document.getElementById('adli_tatil_uzatma');
        
        const sureSonucInput = document.getElementById('sureSonuc');
        const sureSonucEkraniTextarea = document.getElementById('sureSonucEkrani');
        
        // Hata kontrolleri
        if (!tebligTarihiInput.value) {
            alert("Lütfen tebliğ tarihini giriniz.");
            return;
        }
        
        const sureMiktari = parseInt(sureMiktariInput.value) || 0;
        if (sureMiktari <= 0) {
            alert("Lütfen geçerli bir süre giriniz.");
            return;
        }
        
        // Değerleri al
        const sureBirimi = sureBirimiSelect.value;
        const etebligat = etebligatCheck.checked;
        const maliTatilTeblig = maliTatilTebligCheck.checked;
        const maliTatilBitis = maliTatilBitisCheck.checked;
        const adliTatil = adliTatilCheck.checked;
        const adliTatilUzatma = parseInt(adliTatilUzatmaSelect.value) || 7;
        
        // Tebliğ tarihini al ve başlangıç tarihini belirle
        let tebligTarihi = new Date(tebligTarihiInput.value);
        
        // E-tebligat işleme şekli
        let baslangicTarihi = new Date(tebligTarihi);
        let eTebligatOkunmaTarihi = null;
        
        if (etebligat) {
            // E-tebligat durumunda teslim tarihinden 5 gün sonra okunmuş sayılır
            eTebligatOkunmaTarihi = new Date(tebligTarihi);
            eTebligatOkunmaTarihi.setDate(eTebligatOkunmaTarihi.getDate() + 5);
            
            // Süre başlangıcı e-tebligatın okunduğu (sayıldığı) tarihten başlar
            baslangicTarihi = new Date(eTebligatOkunmaTarihi);
        } else {
            // Normal tebligat - tebliğ edildiği gün hesaba katılmaz
            baslangicTarihi.setDate(baslangicTarihi.getDate() + 1);
        }
        
        // Mali tatilde tebliğ edildiyse, mali tatilin son gününden sonraki günden başlat
        if (maliTatilTeblig && window.calculatorManager.isMaliTatil(tebligTarihi)) {
            // Mali tatil: 1-20 Temmuz
            const yil = tebligTarihi.getFullYear();
            const maliTatilBitis = new Date(yil, 6, 20); // 20 Temmuz
            
            baslangicTarihi = new Date(maliTatilBitis);
            baslangicTarihi.setDate(baslangicTarihi.getDate() + 1); // Mali tatilin bitiminden sonraki gün
        }
        
        // Bitiş tarihini hesapla
        let bitisTarihi = new Date(baslangicTarihi);
        
        if (sureBirimi === 'gun') {
            bitisTarihi.setDate(bitisTarihi.getDate() + sureMiktari - 1); // -1 çünkü ilk gün dahil
        } else if (sureBirimi === 'hafta') {
            bitisTarihi.setDate(bitisTarihi.getDate() + (sureMiktari * 7) - 1);
        } else if (sureBirimi === 'ay') {
            bitisTarihi.setMonth(bitisTarihi.getMonth() + sureMiktari);
            bitisTarihi.setDate(bitisTarihi.getDate() - 1);
        } else if (sureBirimi === 'yil') {
            bitisTarihi.setFullYear(bitisTarihi.getFullYear() + sureMiktari);
            bitisTarihi.setDate(bitisTarihi.getDate() - 1);
        }
        
        let aciklamalar = [];
        
        // Sürenin son günü resmi tatile denk geliyorsa, takip eden ilk iş gününe uzat
        let sonGunResmiTatil = window.calculatorManager.isResmiTatil(bitisTarihi);
        let originalBitisTarihi = new Date(bitisTarihi);
        
        if (sonGunResmiTatil) {
            aciklamalar.push(`Sürenin son günü (${window.calculatorManager.formatDateForDisplay(originalBitisTarihi)}) resmi tatile denk geldiği için takip eden ilk iş gününe uzatılmıştır.`);
            
            // Tatil olmayan ilk iş gününü bul
            do {
                bitisTarihi.setDate(bitisTarihi.getDate() + 1);
                sonGunResmiTatil = window.calculatorManager.isResmiTatil(bitisTarihi);
            } while (sonGunResmiTatil);
        }
        
        // Mali tatile denk gelme durumu
        if (maliTatilBitis) {
            const maliTatilIcinde = window.calculatorManager.isMaliTatil(bitisTarihi);
            const maliTatilSonrasiBesBun = (() => {
                const yil = bitisTarihi.getFullYear();
                const maliTatilBitis = new Date(yil, 6, 20); // 20 Temmuz
                const maliTatilSonrasi5Gun = new Date(maliTatilBitis);
                maliTatilSonrasi5Gun.setDate(maliTatilSonrasi5Gun.getDate() + 5); // + 5 gün
                
                return bitisTarihi > maliTatilBitis && bitisTarihi <= maliTatilSonrasi5Gun;
            })();
            
            if (maliTatilIcinde || maliTatilSonrasiBesBun) {
                const yil = bitisTarihi.getFullYear();
                const maliTatilBitisTarihi = new Date(yil, 6, 20); // 20 Temmuz
                
                aciklamalar.push(`Sürenin bitiş tarihi mali tatil içine (1-20 Temmuz) veya sonraki 5 gün içine denk geldiği için uzatılmıştır.`);
                
                if (maliTatilIcinde) {
                    bitisTarihi = new Date(maliTatilBitisTarihi);
                    bitisTarihi.setDate(bitisTarihi.getDate() + 7); // Mali tatilin bitiminden 7 gün sonra
                } else {
                    // Mali tatilin bitiminden sonraki 5 gün içine denk geldiği durumda
                    bitisTarihi = new Date(maliTatilBitisTarihi);
                    bitisTarihi.setDate(bitisTarihi.getDate() + 5); // Mali tatilin bitiminden 5 gün sonra
                }
            }
        }
        
        // Adli tatile denk gelme durumu
        if (adliTatil && window.calculatorManager.isAdliTatil(bitisTarihi)) {
            const yil = bitisTarihi.getFullYear();
            const adliTatilBitisTarihi = new Date(yil, 7, 31); // 31 Ağustos
            
            aciklamalar.push(`Sürenin bitiş tarihi adli tatil içine (20 Temmuz - 31 Ağustos) denk geldiği için uzatılmıştır.`);
            
            bitisTarihi = new Date(adliTatilBitisTarihi);
            bitisTarihi.setDate(bitisTarihi.getDate() + parseInt(adliTatilUzatma));
        }
        
        // Yeniden son günün tatile denk gelip gelmediğini kontrol et
        sonGunResmiTatil = window.calculatorManager.isResmiTatil(bitisTarihi);
        if (sonGunResmiTatil) {
            aciklamalar.push(`Uzatılan sürenin son günü (${window.calculatorManager.formatDateForDisplay(bitisTarihi)}) resmi tatile denk geldiği için takip eden ilk iş gününe uzatılmıştır.`);
            
            // Tatil olmayan ilk iş gününü bul
            do {
                bitisTarihi.setDate(bitisTarihi.getDate() + 1);
                sonGunResmiTatil = window.calculatorManager.isResmiTatil(bitisTarihi);
            } while (sonGunResmiTatil);
        }
        
        // Bitiş günü mesai saati sonudur (17:30)
        bitisTarihi.setHours(17, 30, 0, 0);
        
        // Sonuçları göster
        sureSonucInput.value = window.calculatorManager.formatDateForDisplay(bitisTarihi);
        
        // Süre birimi metnini oluştur
        let sureBirimiText = "";
        switch(sureBirimi) {
            case 'gun': sureBirimiText = "gün"; break;
            case 'hafta': sureBirimiText = "hafta"; break;
            case 'ay': sureBirimiText = "ay"; break;
            case 'yil': sureBirimiText = "yıl"; break;
        }
        
        // Ayrıntılı sonuç metni
        sureSonucEkraniTextarea.value = 
            "AYRINTILI SÜRE HESAPLAMASI" + 
            "\n----------------------------------" + 
            "\nTebliğ Tarihi: " + window.calculatorManager.formatDateForDisplay(tebligTarihi) + 
            (etebligat ? " (E-tebligat teslim tarihi)" : "") +
            "\nSüre: " + sureMiktari + " " + sureBirimiText +
            "\nBaşlangıç Tarihi: " + window.calculatorManager.formatDateForDisplay(baslangicTarihi);
            
        if (etebligat && eTebligatOkunmaTarihi) {
            sureSonucEkraniTextarea.value += "\nE-tebligat Okundu Sayılma Tarihi: " + window.calculatorManager.formatDateForDisplay(eTebligatOkunmaTarihi);
        }
            
        sureSonucEkraniTextarea.value += "\nHesaplanan İlk Bitiş Tarihi: " + window.calculatorManager.formatDateForDisplay(originalBitisTarihi) +
            "\n----------------------------------" +
            "\nVade Sonu Tarihi: " + window.calculatorManager.formatDateForDisplay(bitisTarihi) + " (Mesai Saati Sonu)" +
            "\n----------------------------------" +
            "\nNOT: Belirtilen tarihlerde resmi tatil durumu ve sürelerin hesaplanması için kesin bilgi almak üzere ilgili mercilere başvurunuz.";
    }
}

export default CalculatorManager; 