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
                    <button class="tool-btn" data-tool="enforcement-calculator">
                        <i class="fas fa-balance-scale"></i>
                        İnfaz Hesaplama
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
                    
                    <div id="enforcement-calculator" class="calculator-tool">
                        <h3>İnfaz Hesaplama</h3>
                        <p>Bu araçla hapis cezalarının infaz hesaplamasını yapabilirsiniz. Verilen ceza süresi, yaş durumu ve diğer faktörlere göre koşullu salıverilme (şartla tahliye) sürelerini hesaplayabilirsiniz.</p>
                        
                        <div class="calculator-form">
                            <form name="infazForm" id="infaz-hesaplama-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="ceza_tipi">Ceza Tipi:</label>
                                        <select name="ceza_tipi" id="ceza_tipi" class="form-control">
                                            <option value="sureli">Süreli Hapis Cezası</option>
                                            <option value="muebbet">Müebbet Hapis Cezası</option>
                                            <option value="agirlastirilmis">Ağırlaştırılmış Müebbet Hapis Cezası</option>
                                        </select>
                                    </div>
                                </div>

                                <div id="sureli_ceza_alanlari">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="ceza_yil">Yıl:</label>
                                            <input type="number" name="ceza_yil" id="ceza_yil" class="form-control" min="0" max="99" value="0">
                                        </div>
                                        <div class="form-group">
                                            <label for="ceza_ay">Ay:</label>
                                            <input type="number" name="ceza_ay" id="ceza_ay" class="form-control" min="0" max="11" value="0">
                                        </div>
                                        <div class="form-group">
                                            <label for="ceza_gun">Gün:</label>
                                            <input type="number" name="ceza_gun" id="ceza_gun" class="form-control" min="0" max="30" value="0">
                                        </div>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="dogum_tarihi">Doğum Tarihi:</label>
                                        <input type="text" name="dogum_tarihi" id="dogum_tarihi" class="form-control" placeholder="GG/AA/YYYY">
                                    </div>
                                    <div class="form-group">
                                        <label for="karar_tarihi">Karar Tarihi:</label>
                                        <input type="date" name="karar_tarihi" id="karar_tarihi" class="form-control">
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="tutukluluk_gun">Tutuklulukta Geçen Süre (Gün):</label>
                                        <input type="number" name="tutukluluk_gun" id="tutukluluk_gun" class="form-control" min="0" value="0">
                                    </div>
                                </div>

                                <div class="form-row checkbox-group">
                                    <div class="form-group" style="flex-basis: 100%;">
                                        <label>Suç Tipi:</label>
                                        <div class="checkbox-options">
                                            <div class="form-check">
                                                <input type="checkbox" name="adis" id="adis">
                                                <label for="adis">Adli Suçlar</label>
                                            </div>
                                            <div class="form-check">
                                                <input type="checkbox" name="yaralama" id="yaralama">
                                                <label for="yaralama">Kasten Öldürme/Yaralama</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-row checkbox-group">
                                    <div class="form-group" style="flex-basis: 100%;">
                                        <label>Diğer Durumlar:</label>
                                        <div class="checkbox-options">
                                            <div class="form-check">
                                                <input type="radio" name="tekerrur" id="tekerruryok" value="tekerruryok" checked>
                                                <label for="tekerruryok">Tekerrür Yok</label>
                                            </div>
                                            <div class="form-check">
                                                <input type="radio" name="tekerrur" id="tekerrurvar" value="tekerrurvar">
                                                <label for="tekerrurvar">Tekerrür Var</label>
                                            </div>
                                            <div class="form-check">
                                                <input type="checkbox" name="mahsupvar" id="mahsupvar">
                                                <label for="mahsupvar">Tutukluluk Mahsubu</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="button-group">
                                    <button type="button" class="calc-btn" id="infaz-hesapla-btn">Hesapla</button>
                                    <button type="button" class="calc-btn secondary" id="infaz-temizle-btn">Temizle</button>
                                </div>
                                
                                <div class="result-container">
                                    <div class="form-group total-result">
                                        <label for="infazSonuc">Koşullu Salıverilme Süresi:</label>
                                        <input type="text" name="infazSonuc" id="infazSonuc" class="form-control result-input" readonly>
                                    </div>
                                    
                                    <div class="form-group details-result">
                                        <label for="infazSonucEkrani">Ayrıntılı Sonuç:</label>
                                        <textarea name="infazSonucEkrani" id="infazSonucEkrani" class="form-control result-textarea" readonly rows="10"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div id="deadline-calculator" class="calculator-tool">
                        <h3>Süre Hesaplama</h3>
                        <p>Bu bölümde hukuki süre hesaplamaları yapabilirsiniz.</p>
                        <div class="calculator-placeholder">
                            <i class="fas fa-calculator"></i>
                            <p>Hesaplama formları daha sonra eklenecektir.</p>
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

        // İnfaz hesaplama formu için olay dinleyicileri
        const dogumTarihiInput = popup.querySelector('#dogum_tarihi');
        
        if (dogumTarihiInput) {
            dogumTarihiInput.addEventListener('input', this.formatDateInput);
        }
        
        // Ceza tipi değiştiğinde form alanlarının görünürlüğünü ayarla
        const cezaTipiSelect = popup.querySelector('#ceza_tipi');
        if (cezaTipiSelect) {
            cezaTipiSelect.addEventListener('change', function() {
                const sureliCezaAlanlari = document.getElementById('sureli_ceza_alanlari');
                if (this.value === 'sureli') {
                    sureliCezaAlanlari.style.display = 'block';
                } else {
                    sureliCezaAlanlari.style.display = 'none';
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

    // Tarih formatı için yardımcı fonksiyon
    formatDateInput(e) {
        let value = e.target.value;
        
        // Sadece sayılar ve / karakterine izin ver
        value = value.replace(/[^\d/]/g, '');
        
        // Eğer kullanıcı / karakterini girmemişse otomatik ekle
        if (value.length === 2 && !value.includes('/')) {
            value += '/';
        } else if (value.length === 5 && value.charAt(2) === '/' && !value.includes('/', 3)) {
            value += '/';
        }
        
        // 10 karakterden uzun olmasını engelle (GG/AA/YYYY formatına uygun)
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        
        e.target.value = value;
    }

    // Yuvarlama yardımcı fonksiyonu (infaz hesaplaması için)
    yuvarla(deger) {
        return Math.floor(deger);
    }

    // Tarih formatını normalleştir
    normalizeDateFormat(dateString) {
        // YYYY-MM-DD formatında ise doğrudan dönüştürülebilir
        if (dateString.includes('-')) {
            return dateString;
        } 
        // DD/MM/YYYY formatını YYYY-MM-DD formatına çevir
        else if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                const year = parts[2];
                return `${year}-${month}-${day}`;
            }
        }
        // Başarısız olursa orijinal değeri döndür
        return dateString;
    }

    // Yaş hesaplama fonksiyonu (infaz hesaplaması için)
    getAge(dateString) {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        
        // Input date string handling
        let birthYear, birthMonth, birthDay;
        
        // Check if date is in format YYYY-MM-DD (from date input)
        if (dateString.includes('-')) {
            const parts = dateString.split('-');
            birthYear = parseInt(parts[0]);
            birthMonth = parseInt(parts[1]);
            birthDay = parseInt(parts[2]);
        } 
        // Check if date is in format DD/MM/YYYY
        else if (dateString.includes('/')) {
            const parts = dateString.split('/');
            birthDay = parseInt(parts[0]);
            birthMonth = parseInt(parts[1]);
            birthYear = parseInt(parts[2]);
        } else {
            // Invalid format
            console.error("Invalid date format:", dateString);
            return 0;
        }
        
        if (month === birthMonth && day >= birthDay) {
            return year - birthYear;
        } else if (month > birthMonth) {
            return year - birthYear;
        } else {
            return year - birthYear - 1;
        }
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
        var tanikg = 187;
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
        const form = document.getElementById('vekalet-hesaplama-form');
        if (form) {
            form.reset();
        }
        
        // Değer alanını temizle
        const davaDegeriInput = document.getElementById('dava_degeri');
        if (davaDegeriInput) davaDegeriInput.value = '';
        
        // Sonuç alanlarını temizle
        const vekaletSonucInput = document.getElementById('vekaletSonuc');
        const vekaletSonucEkraniTextarea = document.getElementById('vekaletSonucEkrani');
        if (vekaletSonucInput) vekaletSonucInput.value = '';
        if (vekaletSonucEkraniTextarea) vekaletSonucEkraniTextarea.value = '';
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
        this.formatDateInput = this.formatDateInput.bind(this);
        this.faizFormTemizle = this.faizFormTemizle.bind(this);
        this.faizHesapla = this.faizHesapla.bind(this);
        this.formatDateForDisplay = this.formatDateForDisplay.bind(this);
        this.vekaletFormTemizle = this.vekaletFormTemizle.bind(this);
        this.vekaletUcretiHesapla = this.vekaletUcretiHesapla.bind(this);
        this.calculateVekaletTarife = this.calculateVekaletTarife.bind(this);
        this.yuvarla = this.yuvarla.bind(this);
        this.getAge = this.getAge.bind(this);
        this.infazFormTemizle = this.infazFormTemizle.bind(this);
        this.infazHesapla = this.infazHesapla.bind(this);
        
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
        // Tüm araçları gizle
        const tools = document.querySelectorAll('.calculator-tool');
        tools.forEach(tool => tool.classList.remove('active'));
        
        // Seçilen aracı göster
        const selectedTool = document.getElementById(toolId);
        if (selectedTool) {
            selectedTool.classList.add('active');
        }
    }

    // İnfaz hesaplama formunu temizle
    infazFormTemizle() {
        const form = document.getElementById('infaz-hesaplama-form');
        if (form) {
            form.reset();
            document.getElementById('infazSonuc').value = '';
            document.getElementById('infazSonucEkrani').value = '';
        }
    }

    // İnfaz hesaplama
    infazHesapla() {
        // Form elemanlarını al
        const cezaTipi = document.getElementById('ceza_tipi').value;
        const cezaYil = parseInt(document.getElementById('ceza_yil').value) || 0;
        const cezaAy = parseInt(document.getElementById('ceza_ay').value) || 0;
        const cezaGun = parseInt(document.getElementById('ceza_gun').value) || 0;
        const dogumTarihi = document.getElementById('dogum_tarihi').value;
        const kararTarihi = document.getElementById('karar_tarihi').value;
        const tutuklulukGun = parseInt(document.getElementById('tutukluluk_gun').value) || 0;
        
        const adisChecked = document.getElementById('adis').checked;
        const yaralamaChecked = document.getElementById('yaralama').checked;
        const tekerruryokChecked = document.getElementById('tekerruryok').checked;
        const tekerrurvarChecked = document.getElementById('tekerrurvar').checked;
        const mahsupvarChecked = document.getElementById('mahsupvar').checked;
        
        const infazSonucInput = document.getElementById('infazSonuc');
        const infazSonucEkraniTextarea = document.getElementById('infazSonucEkrani');
        
        // Gerekli alanların dolu olup olmadığını kontrol et
        if (!dogumTarihi || !kararTarihi) {
            alert("Lütfen doğum tarihi ve karar tarihi alanlarını doldurunuz.");
            return;
        }
        
        if (cezaTipi === "sureli" && (cezaYil === 0 && cezaAy === 0 && cezaGun === 0)) {
            alert("Lütfen geçerli bir ceza süresi giriniz.");
            return;
        }
        
        // Yaş hesapla
        const yas = this.getAge(dogumTarihi);
        
        // Karar tarihi nesnesini oluştur - formatı düzgün şekilde işleme
        const normalizedKararTarihi = this.normalizeDateFormat(kararTarihi);
        let kararDate;
        try {
            kararDate = new Date(normalizedKararTarihi);
            // Geçerli bir tarih olup olmadığını kontrol et
            if (isNaN(kararDate.getTime())) {
                throw new Error("Geçersiz tarih formatı");
            }
        } catch(e) {
            console.error("Karar tarihi dönüştürme hatası:", e, normalizedKararTarihi);
            alert("Lütfen geçerli bir karar tarihi giriniz (GG/AA/YYYY veya YYYY-AA-GG formatında).");
            return;
        }
        
        // Referans tarihleri
        const ref2005 = new Date('2005-06-01');
        const ref2016 = new Date('2016-07-01'); 
        const ref2020 = new Date('2020-03-30');
        
        // Ceza gün sayısı hesaplama (toplam gün olarak)
        const toplamGun = cezaYil * 365 + cezaAy * 30 + cezaGun;
        
        // Sonuç değişkenleri
        let result = '';
        let denetimliSerbestlik = 0;
        let yatar = 0;
        
        // Tarih karşılaştırmalarını debug etmek için
        console.log("Karar tarihi:", kararDate);
        console.log("Ref 2005:", ref2005);
        console.log("Karar < 2005:", kararDate < ref2005);
        
        // Süreli hapis cezası hesaplama
        if (cezaTipi === "sureli") {
            if (adisChecked || yaralamaChecked) {
                // 2005 öncesi karar mı?
                if (kararDate < ref2005) {
                    if (tekerruryokChecked) {
                        if (yas >= 18) {
                            // Yetişkinler için standart hesaplama
                            yatar = toplamGun * 1/2 - (toplamGun * 1/2 / 30 * 6);
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır.`;
                        } else if (yas < 15) {
                            // 15 yaşından küçükler için hesaplama
                            yatar = (toplamGun / 3) * 1/2 - ((toplamGun / 3) * 1/2 / 30 * 6);
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır. 

(15 yaşından küçüklerde hükümlünün onbeş yaşını dolduruncaya kadar infaz kurumunda geçirdiği bir gün, üç gün olarak dikkate alınır 5275 S.K 107/5 Md.)`;
                        } else if (yas < 18 && yas >= 15) {
                            // 15-18 yaş arası için hesaplama
                            yatar = (toplamGun / 2) * 1/2 - ((toplamGun / 2) * 1/2 / 30 * 6);
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır. 

(18 yaşından küçük 15 yaşından büyüklerde hükümlünün onsekiz yaşını dolduruncaya kadar infaz kurumunda geçirdiği bir gün, iki gün olarak dikkate alınır 5275 S.K 107/5 Md.)`;
                        }
                    } else if (tekerrurvarChecked) {
                        // Tekerrür durumunda hesaplamalar
                        if (yas >= 18) {
                            yatar = toplamGun * 2/3;
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır.

(Mükerrir hükümlülerin koşullu salıverilme oranı 2/3'tür - 5275 S.K 108/1 Md.)`;
                        } else if (yas < 15) {
                            yatar = (toplamGun / 3) * 2/3;
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır.

(15 yaşından küçüklerde hükümlünün onbeş yaşını dolduruncaya kadar infaz kurumunda geçirdiği bir gün, üç gün olarak dikkate alınır 5275 S.K 107/5 Md. - Mükerrir hükümlülerin koşullu salıverilme oranı 2/3'tür)`;
                        } else if (yas < 18 && yas >= 15) {
                            yatar = (toplamGun / 2) * 2/3;
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır.

(18 yaşından küçük 15 yaşından büyüklerde hükümlünün onsekiz yaşını dolduruncaya kadar infaz kurumunda geçirdiği bir gün, iki gün olarak dikkate alınır 5275 S.K 107/5 Md. - Mükerrir hükümlülerin koşullu salıverilme oranı 2/3'tür)`;
                        }
                    }
                } 
                // 2005 sonrası hesaplama
                else {
                    if (tekerruryokChecked) {
                        if (yas >= 18) {
                            // 2020 öncesi ve sonrası için farklı hesaplamalar
                            if (kararDate <= ref2020) {
                                yatar = toplamGun * 1/2;
                                denetimliSerbestlik = 1 * 365; // 1 yıl
                            } else {
                                yatar = toplamGun * 1/2;
                                denetimliSerbestlik = 3 * 365; // 3 yıl
                            }
                            
                            let denetimliMetni = "";
                            if (yatar > 6 * 30) { // 6 aydan fazla ise denetimli serbestlik geçerli
                                denetimliMetni = `Koşullu salıverilme tarihine ${this.yuvarla(denetimliSerbestlik/365)} yıl kala DENETIMLI SERBESTLIK hükümlerinden yararlanabilir.`;
                            }
                            
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır.

${denetimliMetni}`;
                        } else if (yas < 15) {
                            if (kararDate <= ref2020) {
                                yatar = (toplamGun / 3) * 1/2;
                                denetimliSerbestlik = 1 * 365;
                            } else {
                                yatar = (toplamGun / 3) * 1/2;
                                denetimliSerbestlik = 3 * 365;
                            }
                            
                            let denetimliMetni = "";
                            if (yatar > 6 * 30) {
                                denetimliMetni = `Koşullu salıverilme tarihine ${this.yuvarla(denetimliSerbestlik/365)} yıl kala DENETIMLI SERBESTLIK hükümlerinden yararlanabilir.`;
                            }
                            
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır.

(15 yaşından küçüklerde hükümlünün onbeş yaşını dolduruncaya kadar infaz kurumunda geçirdiği bir gün, üç gün olarak dikkate alınır 5275 S.K 107/5 Md.)

${denetimliMetni}`;
                        } else if (yas < 18 && yas >= 15) {
                            if (kararDate <= ref2020) {
                                yatar = (toplamGun / 2) * 1/2;
                                denetimliSerbestlik = 1 * 365;
                            } else {
                                yatar = (toplamGun / 2) * 1/2;
                                denetimliSerbestlik = 3 * 365;
                            }
                            
                            let denetimliMetni = "";
                            if (yatar > 6 * 30) {
                                denetimliMetni = `Koşullu salıverilme tarihine ${this.yuvarla(denetimliSerbestlik/365)} yıl kala DENETIMLI SERBESTLIK hükümlerinden yararlanabilir.`;
                            }
                            
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır.

(18 yaşından küçük 15 yaşından büyüklerde hükümlünün onsekiz yaşını dolduruncaya kadar infaz kurumunda geçirdiği bir gün, iki gün olarak dikkate alınır 5275 S.K 107/5 Md.)

${denetimliMetni}`;
                        }
                    } else if (tekerrurvarChecked) {
                        // Tekerrür durumunda farklı hesaplar
                        if (yas >= 18) {
                            if (kararDate <= ref2020) {
                                yatar = toplamGun * 3/4;
                                denetimliSerbestlik = 1 * 365;
                            } else {
                                yatar = toplamGun * 2/3;
                                denetimliSerbestlik = 3 * 365;
                            }
                            
                            let denetimliMetni = "";
                            if (yatar > 6 * 30) {
                                denetimliMetni = `Koşullu salıverilme tarihine ${this.yuvarla(denetimliSerbestlik/365)} yıl kala DENETIMLI SERBESTLIK hükümlerinden yararlanabilir.`;
                            }
                            
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır.

(Mükerrir hükümlülerin koşullu salıverilme oranı 3/4'tür - 5275 S.K 108/1 Md. - 7242 sayılı kanun değişikliği ile 2/3 olmuştur.)

${denetimliMetni}`;
                        } else if (yas < 15) {
                            yatar = (toplamGun / 3) * 2/3;
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır.

(15 yaşından küçüklerde hükümlünün onbeş yaşını dolduruncaya kadar infaz kurumunda geçirdiği bir gün, üç gün olarak dikkate alınır 5275 S.K 107/5 Md. - Mükerrir hükümlülerin koşullu salıverilme oranı 2/3'tür)`;
                        } else if (yas < 18 && yas >= 15) {
                            yatar = (toplamGun / 2) * 2/3;
                            result = `Sanığa verilen ceza ${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün hapis cezasıdır.
                            
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN HAPİS cezasıdır.

(18 yaşından küçük 15 yaşından büyüklerde hükümlünün onsekiz yaşını dolduruncaya kadar infaz kurumunda geçirdiği bir gün, iki gün olarak dikkate alınır 5275 S.K 107/5 Md. - Mükerrir hükümlülerin koşullu salıverilme oranı 2/3'tür)`;
                        }
                    }
                }
            }
            
            // Tutukluluk mahsubu hesaplamaları
            if (mahsupvarChecked && tutuklulukGun > 0) {
                let mahsupGun = tutuklulukGun;
                
                // Yaş durumuna göre mahsup günü ayarlanır
                if (yas < 15) {
                    mahsupGun = tutuklulukGun * 3; // 15 yaş altı için 3 katı
                } else if (yas < 18) {
                    mahsupGun = tutuklulukGun * 2; // 15-18 yaş arası için 2 katı
                }
                
                const mahsupSonrasiYatar = Math.max(0, yatar - mahsupGun);
                
                result += `\n\nSanığın gözaltı ve tutuklulukta geçirdiği toplam ${mahsupGun} gün sonuç cezadan düşüldüğünde NETİCETEN YATARI: ${this.yuvarla(mahsupSonrasiYatar/365)} YIL ${this.yuvarla((mahsupSonrasiYatar%365)/30)} AY ${this.yuvarla(mahsupSonrasiYatar%365%30)} GÜN HAPİS cezasıdır.`;
                
                // Yatarı güncelle
                yatar = mahsupSonrasiYatar;
            }
        } 
        // Müebbet hapis cezası hesaplama
        else if (cezaTipi === "muebbet") {
            if (yas >= 18) {
                if (kararDate <= ref2016) {
                    yatar = 24 * 365; // 24 yıl
                } else if (kararDate > ref2016 && kararDate <= ref2020) {
                    yatar = 30 * 365; // 30 yıl
                } else {
                    yatar = 32 * 365; // 32 yıl
                }
                
                result = `Sanığa verilen ceza MÜEBBET HAPİS cezasıdır.
                
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL HAPİS cezasıdır.`;
            } else if (yas < 18) {
                yatar = 18 * 365; // 18 yıl (çocuklar için)
                
                result = `Sanığa verilen ceza MÜEBBET HAPİS cezasıdır.
                
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL HAPİS cezasıdır.

(18 yaşından küçük çocuklar için müebbet hapis cezasının karşılığı 18 yıldır.)`;
            }
        } 
        // Ağırlaştırılmış müebbet hapis cezası hesaplama
        else if (cezaTipi === "agirlastirilmis") {
            if (yas >= 18) {
                if (kararDate <= ref2016) {
                    yatar = 30 * 365; // 30 yıl
                } else if (kararDate > ref2016 && kararDate <= ref2020) {
                    yatar = 38 * 365; // 38 yıl
                } else {
                    yatar = 40 * 365; // 40 yıl
                }
                
                result = `Sanığa verilen ceza AĞIRLAŞTIRILMIŞ MÜEBBET HAPİS cezasıdır.
                
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL HAPİS cezasıdır.`;
            } else if (yas < 18) {
                yatar = 24 * 365; // 24 yıl (çocuklar için)
                
                result = `Sanığa verilen ceza AĞIRLAŞTIRILMIŞ MÜEBBET HAPİS cezasıdır.
                
Sanığa verilen cezadan koşullu salıverilme süresi (şartla tahliye) çıkarıldığında YATARI: ${this.yuvarla(yatar/365)} YIL HAPİS cezasıdır.

(18 yaşından küçük çocuklar için ağırlaştırılmış müebbet hapis cezasının karşılığı 24 yıldır.)`;
            }
        }
        
        // Denetimli serbestlik bilgisi ekleme
        if (denetimliSerbestlik > 0 && yatar > 6 * 30) {
            const denetimliYatar = Math.max(0, yatar - denetimliSerbestlik);
            
            result += `\n\nDenetimli serbestlik hükümleri uygulandığında CEZA İNFAZ KURUMUNDA GEÇIRECEĞI SÜRE: ${this.yuvarla(denetimliYatar/365)} YIL ${this.yuvarla((denetimliYatar%365)/30)} AY ${this.yuvarla(denetimliYatar%365%30)} GÜN olacaktır.`;
        }
        
        // Ayrıntılı sonuç ekleme
        if (infazSonucInput && infazSonucEkraniTextarea) {
            infazSonucInput.value = `${this.yuvarla(yatar/365)} YIL ${this.yuvarla((yatar%365)/30)} AY ${this.yuvarla(yatar%365%30)} GÜN`;
            infazSonucEkraniTextarea.value = result;
        }
    }

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
}

export default CalculatorManager; 