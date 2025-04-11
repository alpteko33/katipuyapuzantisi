const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

async function fetchClientsFromUYAP(username) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // UYAP'a giriş yap
        await page.goto('https://avukatbeta.uyap.gov.tr/main');
        
        // Giriş formunu doldur (gerekirse)
        // await page.type('#username', username);
        // await page.type('#password', password);
        // await page.click('#login-button');
        
        // Yargı birimlerini sorgula
        await page.goto('https://avukatbeta.uyap.gov.tr/yargiBirimleriSorgula_brd.ajx');
        
        // Mahkemeleri sorgula
        await page.goto('https://avukatbeta.uyap.gov.tr/avukat_mahkemeleri_sorgula.ajx');
        
        // Taraf bilgilerini al
        await page.goto('https://avukatbeta.uyap.gov.tr/dosya_taraf_bilgileri_brd.ajx');
        
        // Sayfa içeriğini al
        const content = await page.content();
        
        // JSON verisini parse et
        const data = JSON.parse(content);
        
        // Müvekkilleri filtrele
        const muvekkiller = data.filter(taraf => 
            taraf && taraf.vekil && 
            typeof taraf.vekil === 'string' && 
            taraf.vekil.includes(username)
        );

        return muvekkiller;
    } catch (error) {
        console.error('Puppeteer hatası:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

app.post('/api/fetch-clients', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Kullanıcı adı gerekli' });
        }

        const muvekkiller = await fetchClientsFromUYAP(username);
        
        res.json({ muvekkiller });
    } catch (error) {
        console.error('API hatası:', error);
        res.status(500).json({ error: 'Müvekkil verileri alınamadı' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Puppeteer sunucusu ${PORT} portunda çalışıyor`);
}); 