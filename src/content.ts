// Content script for UYAP Portal Extension
import './styles/sidebar.css';

function loadFontAwesome() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'uyap-extension-sidebar';
    sidebar.className = 'uyap-sidebar';

    const sidebarContent = `
        <div class="sidebar-header">
            <h3>UYAP Asistan</h3>
        </div>
        <div class="sidebar-menu">
            <div class="menu-item" id="tasks">
                <i class="fas fa-tasks"></i>
                <span>Görevler</span>
            </div>
            <div class="menu-item" id="calendar">
                <i class="fas fa-calendar-alt"></i>
                <span>Ajanda</span>
            </div>
            <div class="menu-item" id="templates">
                <i class="fas fa-file-alt"></i>
                <span>Şablon Dilekçeler</span>
            </div>
            <div class="menu-item" id="quick-petition">
                <i class="fas fa-pen-fancy"></i>
                <span>Hızlı Dilekçe</span>
            </div>
            <div class="divider"></div>
            <div class="menu-item" id="settings">
                <i class="fas fa-cog"></i>
                <span>Genel Ayarlar</span>
            </div>
            <div class="menu-item" id="account">
                <i class="fas fa-user-cog"></i>
                <span>Hesap Ayarları</span>
            </div>
        </div>
    `;

    sidebar.innerHTML = sidebarContent;
    document.body.appendChild(sidebar);

    // Event listeners for menu items
    const menuItems = sidebar.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('id');
            if (id) handleMenuClick(id);
        });
    });
}

function handleMenuClick(menuId: string) {
    // Handle menu item clicks here
    console.log(`Clicked menu item: ${menuId}`);
    // TODO: Implement popup handling for each menu item
}

// Tebligat sorgulama fonksiyonu
tebligatButton.addEventListener('click', async () => {
    try {
        // Dosya ID'sini al
        const dosyaId = localStorage.getItem('uyap_asistan_current_dosya_id');
        if (!dosyaId) {
            throw new Error('Dosya ID bulunamadı');
        }

        // Önce taraf tebligat listesini sorgula
        const response = await fetch('/portal/avukat/mtsTarafTebligatList_brd.ajx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                dosyaId: dosyaId,
                islemTipi: 'SORGULA'
            })
        });

        if (!response.ok) {
            throw new Error('Tebligat listesi alınamadı');
        }

        const data = await response.json();
        // ... sonuçları göster
    } catch (error) {
        console.error('Tebligat sorgulama hatası:', error);
        alert('Tebligat durumu sorgulanırken bir hata oluştu: ' + error.message);
    }
});

// Initialize when the page is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadFontAwesome();
        createSidebar();
    });
} else {
    loadFontAwesome();
    createSidebar();
} 