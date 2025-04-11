# UYAP Asistan Chrome Extension

UYAP portalı için geliştirilen avukat asistan uzantısı.

## Özellikler

- Görevler yönetimi
- Ajanda
- Şablon Dilekçeler
- Hızlı Dilekçe Oluşturma
- Bildirim sistemi
- Raporlama
- Personel yönetimi
- Paraflama sistemi

## Geliştirme

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

### Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd uyap-asistan
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme modunda çalıştırın:
```bash
npm start
```

4. Chrome'da uzantıyı yükleyin:
   - Chrome'da `chrome://extensions/` adresine gidin
   - "Geliştirici modu"nu açın
   - "Paketlenmemiş öğe yükle" butonuna tıklayın
   - Projedeki `dist` klasörünü seçin

### Dağıtım

Üretim sürümünü oluşturmak için:
```bash
npm run build
```

## Lisans

Bu proje [LICENSE] altında lisanslanmıştır. 

deneme