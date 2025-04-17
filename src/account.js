class Account {
    constructor() {
        this.currentSection = 'lawyer'; // Default section
        this.currentDocumentSection = 'petitions'; // Varsayılan evrak alt bölümü
        this.setupAccountUI();
        this.loadLawyerInfo(); // Load saved lawyer info when initialized
        this.loadCaseNotes(); // Dava notlarını yükle
    }

    setupAccountUI() {
        const accountOverlay = document.createElement('div');
        accountOverlay.className = 'account-overlay';
        
        const accountPopup = document.createElement('div');
        accountPopup.className = 'account-popup';
        
        accountPopup.innerHTML = `
            <div class="account-close">
                <i class="fas fa-times"></i>
            </div>
            <div class="account-sidebar">
                <div class="account-header">
                    <h2>Yönetim Paneli</h2>
                </div>
                <div class="account-menu">
                    <div class="account-menu-item active" data-section="lawyer">
                        <i class="fas fa-user-tie"></i>
                        <span>Bilgilerim</span>
                    </div>
                    <div class="account-menu-item" data-section="staff">
                        <i class="fas fa-users"></i>
                        <span>Personelim</span>
                    </div>
                    <div class="account-menu-item" data-section="clients">
                        <i class="fas fa-user-friends"></i>
                        <span>Müvekkillerim</span>
                    </div>
                    <div class="account-menu-item" data-section="document-management">
                        <i class="fas fa-file-alt"></i>
                        <span>Evraklarım</span>
                    </div>
                    <div class="account-menu-item" data-section="case-notes">
                        <i class="fas fa-sticky-note"></i>
                        <span>Notlarım</span>
                    </div>
                    <div class="account-menu-item" data-section="reports">
                        <i class="fas fa-chart-bar"></i>
                        <span>Raporlarım</span>
                    </div>
                </div>
            </div>
            <div class="account-main">
                <div class="account-content">
                    ${this.generateLawyerInfo()}
                </div>
            </div>
        `;
        
        accountOverlay.appendChild(accountPopup);
        document.body.appendChild(accountOverlay);
        
        this.setupEventListeners(accountOverlay, accountPopup);
    }

    generateLawyerInfo() {
        return `
            <div class="account-section" id="lawyer-info">
                <h3>Bilgilerim</h3>
                <div class="account-group lawyer-container">
                    <div class="lawyer-form">
                        <div class="info-row">
                            <label>Ad Soyad</label>
                            <input type="text" class="lawyer-name" placeholder="Ad Soyad">
                        </div>
                        <div class="info-row">
                            <label>Baro</label>
                            <input type="text" class="lawyer-bar" placeholder="Baro">
                        </div>
                        <div class="info-row">
                            <label>TC Kimlik No</label>
                            <input type="text" class="lawyer-id" placeholder="TC Kimlik No">
                        </div>
                        <div class="info-row">
                            <label>Baro No</label>
                            <input type="text" class="lawyer-baro-no" placeholder="Baro No">
                        </div>
                        <div class="info-row">
                            <label>TBB No</label>
                            <input type="text" class="lawyer-tbb-no" placeholder="TBB No">
                        </div>
                        <div class="info-row">
                            <label>E-posta</label>
                            <input type="email" class="lawyer-email" placeholder="E-posta">
                        </div>
                        <div class="info-row">
                            <label>Telefon</label>
                            <input type="tel" class="lawyer-phone" placeholder="Telefon">
                        </div>
                        <div class="info-row">
                            <label>Ofis Adresi</label>
                            <textarea class="lawyer-address" placeholder="Ofis Adresi"></textarea>
                        </div>
                        <button class="save-lawyer-btn">
                            <i class="fas fa-plus"></i>
                            Avukat Ekle
                        </button>
                    </div>
                    <div class="lawyer-list">
                        <h4>Kayıtlı Avukatlar</h4>
                        <div class="lawyers-container">
                            <!-- Kaydedilen avukatlar buraya eklenecek -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateStaffInfo() {
        return `
            <div class="account-section" id="staff-info">
                <h3>Personelim</h3>
                <div class="account-group staff-container">
                    <div class="staff-form">
                        <div class="info-row">
                            <label>Ad Soyad</label>
                            <input type="text" class="staff-name" placeholder="Ad Soyad">
                        </div>
                        <div class="info-row">
                            <label>Pozisyon</label>
                            <select class="staff-position">
                                <option value="">Pozisyon Seçin</option>
                                <option value="Stajyer">Stajyer</option>
                                <option value="Katip">Katip</option>
                                <option value="Asistan">Asistan</option>
                                <option value="Sekreter">Sekreter</option>
                                <option value="Muhasebeci">Muhasebeci</option>
                            </select>
                        </div>
                        <div class="info-row">
                            <label>E-posta</label>
                            <input type="email" class="staff-email" placeholder="E-posta">
                        </div>
                        <div class="info-row">
                            <label>Telefon</label>
                            <input type="tel" class="staff-phone" placeholder="Telefon">
                        </div>
                        <button class="save-staff-btn">
                            <i class="fas fa-plus"></i>
                            Personel Ekle
                        </button>
                    </div>
                    <div class="staff-list">
                        <h4>Kayıtlı Personeller</h4>
                        <div class="staffs-container">
                            <!-- Kaydedilen personeller buraya eklenecek -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateClientsInfo() {
        return `
            <div class="account-section" id="clients-info">
                <h3>Müvekkillerim</h3>
                <div class="account-group clients-container">
                    <div class="clients-list">
                        <div class="clients-header">
                            <h4>Müvekkilleriniz</h4>
                        </div>
                        <div class="clients-cards-container">
                            <!-- Müvekkiller buraya yüklenecek -->
                            <div class="loading-clients">
                                <i class="fas fa-spinner fa-pulse"></i>
                                <p>Müvekkiller yükleniyor...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateDocumentManagementInfo() {
        return `
            <div class="account-section" id="document-management-info">
                <h3>Evraklarım</h3>
                <div class="document-tabpanel">
                    <div class="document-tab-headers">
                        <div class="document-tab-header active" data-section="petitions">
                            <i class="fas fa-file-alt"></i>
                            <span>Dilekçelerim</span>
                        </div>
                        <div class="document-tab-header" data-section="quick-petitions">
                            <i class="fas fa-bolt"></i>
                            <span>Hızlı Dilekçelerim</span>
                        </div>
                        <div class="document-tab-header" data-section="contracts">
                            <i class="fas fa-file-signature"></i>
                            <span>Sözleşmelerim</span>
                        </div>
                        <div class="document-tab-header" data-section="meeting-notes">
                            <i class="fas fa-clipboard"></i>
                            <span>Görüşme Tutanaklarım</span>
                        </div>
                    </div>
                    <div class="document-tab-contents">
                        <div class="document-tab-content active" data-section="petitions">
                            ${this.generatePetitionsContent()}
                        </div>
                        <div class="document-tab-content" data-section="quick-petitions" style="display:none;">
                            ${this.generateQuickPetitionsContent()}
                        </div>
                        <div class="document-tab-content" data-section="contracts" style="display:none;">
                            ${this.generateContractsContent()}
                        </div>
                        <div class="document-tab-content" data-section="meeting-notes" style="display:none;">
                            ${this.generateMeetingNotesContent()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generatePetitionsContent() {
        return `
            <div class="document-section-content" id="petitions-content">
                <div class="petitions-header">
                    <div class="petitions-actions">
                        <button class="add-petition-btn">
                            <i class="fas fa-plus"></i>
                            Ekle
                            </button>
                        </div>
                    </div>
                <div class="petitions-list">
                    <div class="loading-petitions">
                            <i class="fas fa-spinner fa-pulse"></i>
                            <p>Dilekçeler yükleniyor...</p>
                        </div>
                    </div>
            </div>
        `;
    }

    generateQuickPetitionsContent() {
        return `
            <div class="document-section-content" id="quick-petitions-content">
                <div class="quick-petitions-header">
                    <div class="quick-petitions-actions">
                        <button class="add-quick-petition-btn">
                        <i class="fas fa-plus"></i>
                            Ekle
                    </button>
                    </div>
                </div>
                <div class="quick-petitions-list">
                    <div class="loading-quick-petitions">
                        <i class="fas fa-spinner fa-pulse"></i>
                        <p>Hızlı dilekçeler yükleniyor...</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateContractsContent() {
        return `
            <div class="document-section-content" id="contracts-content">
                <div class="contracts-header">
                    <div class="contracts-actions">
                        <button class="add-contract-btn">
                            <i class="fas fa-plus"></i>
                            Ekle
                        </button>
                    </div>
                </div>
                <div class="contracts-list">
                    <div class="loading-contracts">
                        <i class="fas fa-spinner fa-pulse"></i>
                        <p>Sözleşmeler yükleniyor...</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateMeetingNotesContent() {
        return `
            <div class="document-section-content" id="meeting-notes-content">
                <div class="meeting-notes-header">
                    <div class="meeting-notes-actions">
                        <button class="add-meeting-note-btn">
                            <i class="fas fa-plus"></i>
                            Ekle
                        </button>
                    </div>
                </div>
                <div class="meeting-notes-list">
                    <div class="loading-meeting-notes">
                        <i class="fas fa-spinner fa-pulse"></i>
                        <p>Görüşme tutanakları yükleniyor...</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateCaseNotesInfo() {
        return `
            <div class="account-section" id="case-notes-info">
                <h3>Notlarım</h3>
                <div class="account-group case-notes-container">
                    <div class="case-notes-header">
                        <div class="case-notes-search">
                            <input type="text" class="case-notes-search-input" placeholder="Notlarda ara...">
                        </div>
                        <div class="case-notes-add">
                            <input type="text" class="case-notes-add-input" placeholder="Yeni not ekle...">
                            <button class="add-case-note-btn">
                                <i class="fas fa-plus"></i>
                                Ekle
                            </button>
                        </div>
                    </div>
                    <div class="case-notes-grid">
                        <!-- Dava notları buraya eklenecek -->
                    </div>
                </div>
            </div>
        `;
    }

    generateReportsInfo() {
        return `
            <div class="account-section" id="reports-info">
                <h3>Raporlarım</h3>
                <div id="reports-container">
                    <!-- Raporlar içeriği buraya eklenecek -->
                    <div class="reports-placeholder">
                        <i class="fas fa-chart-bar"></i>
                        <p>Raporlar hazırlanıyor...</p>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners(overlay, popup) {
        // Close button
        const closeBtn = popup.querySelector('.account-close');
        closeBtn.addEventListener('click', () => this.hideAccount());
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                this.hideAccount();
            }
        });

        // Prevent closing when clicking inside popup
        popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Menu items
        const menuItems = popup.querySelectorAll('.account-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const section = item.dataset.section;
                const content = popup.querySelector('.account-content');
                
                switch(section) {
                    case 'lawyer':
                        content.innerHTML = this.generateLawyerInfo();
                        this.loadLawyerInfo();
                        this.setupLawyerFormEvents();
                        break;
                    case 'staff':
                        content.innerHTML = this.generateStaffInfo();
                        this.loadStaffInfo();
                        this.setupStaffFormEvents();
                        break;
                    case 'clients':
                        content.innerHTML = this.generateClientsInfo();
                        this.setupClientEvents();
                        break;
                    case 'document-management':
                        content.innerHTML = this.generateDocumentManagementInfo();
                        this.setupDocumentManagementEvents();
                        break;
                    case 'case-notes':
                        content.innerHTML = this.generateCaseNotesInfo();
                        this.setupCaseNotesEvents();
                        break;
                    case 'reports':
                        content.innerHTML = this.generateReportsInfo();
                        this.setupReportsEvents();
                        break;
                }
                
                this.currentSection = section;
            });
        });

        // Initial setup for lawyer form events
        this.setupLawyerFormEvents();
        if (this.currentSection === 'staff') {
            this.setupStaffFormEvents();
        }
        
        // Görevlendirmeler verisi güncellendiğinde dinle
        window.addEventListener('assignmentsDataUpdated', (event) => {
            if (this.currentSection === 'document-management' && this.currentDocumentSection === 'petitions') {
                this.displayPetitionsData(event.detail.savedAssignments);
            }
        });
    }

    setupLawyerFormEvents() {
        const saveBtn = document.querySelector('.save-lawyer-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveLawyerInfo());
        }
    }

    saveLawyerInfo() {
        const newLawyer = {
            name: document.querySelector('.lawyer-name').value,
            bar: document.querySelector('.lawyer-bar').value,
            id: document.querySelector('.lawyer-id').value,
            baroNo: document.querySelector('.lawyer-baro-no').value,
            tbbNo: document.querySelector('.lawyer-tbb-no').value,
            email: document.querySelector('.lawyer-email').value,
            phone: document.querySelector('.lawyer-phone').value,
            address: document.querySelector('.lawyer-address').value
        };

        // Mevcut avukatları al
        chrome.storage.sync.get('lawyers', (data) => {
            const lawyers = data.lawyers || [];
            lawyers.push(newLawyer);
            
            // Avukatları kaydet
            chrome.storage.sync.set({ lawyers }, () => {
                this.loadLawyerInfo();
                
                // Form alanlarını temizle
                document.querySelector('.lawyer-name').value = '';
                document.querySelector('.lawyer-bar').value = '';
                document.querySelector('.lawyer-id').value = '';
                document.querySelector('.lawyer-baro-no').value = '';
                document.querySelector('.lawyer-tbb-no').value = '';
                document.querySelector('.lawyer-email').value = '';
                document.querySelector('.lawyer-phone').value = '';
                document.querySelector('.lawyer-address').value = '';
            });
        });
    }

    loadLawyerInfo() {
        chrome.storage.sync.get('lawyers', (data) => {
            const lawyersContainer = document.querySelector('.lawyers-container');
            if (lawyersContainer && data.lawyers) {
                lawyersContainer.innerHTML = data.lawyers.map((lawyer, index) => `
                    <div class="lawyer-card">
                        <div class="lawyer-card-header">
                            <h5>${lawyer.name}</h5>
                        </div>
                        <div class="lawyer-card-body">
                            <div class="lawyer-info-item">
                                <div class="lawyer-info-header">
                                    <span class="lawyer-badge">${lawyer.bar}</span>
                                </div>
                                <div class="lawyer-info-row"><i class="fas fa-id-card"></i> TC: ${lawyer.id}</div>
                                <div class="lawyer-info-row"><i class="fas fa-gavel"></i> Baro No: ${lawyer.baroNo || "Belirtilmemiş"}</div>
                                <div class="lawyer-info-row"><i class="fas fa-balance-scale"></i> TBB No: ${lawyer.tbbNo || "Belirtilmemiş"}</div>
                                <div class="lawyer-info-row"><i class="fas fa-envelope"></i> ${lawyer.email}</div>
                                <div class="lawyer-info-row"><i class="fas fa-phone"></i> ${lawyer.phone}</div>
                                <div class="lawyer-info-row"><i class="fas fa-map-marker-alt"></i> ${lawyer.address}</div>
                            </div>
                            <div class="lawyer-card-actions">
                                <button class="edit-lawyer-btn" onclick="this.getRootNode().host.querySelector('.account-overlay').__vue__.editLawyer(${index})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-lawyer-btn" onclick="this.getRootNode().host.querySelector('.account-overlay').__vue__.deleteLawyer(${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');

                this.setupLawyerCardEvents();
            }
        });
    }

    setupLawyerCardEvents() {
        const editBtns = document.querySelectorAll('.edit-lawyer-btn');
        const deleteBtns = document.querySelectorAll('.delete-lawyer-btn');

        editBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editLawyer(index);
            });
        });

        deleteBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteLawyer(index);
            });
        });
    }

    editLawyer(index) {
        chrome.storage.sync.get('lawyers', (data) => {
            const lawyers = data.lawyers || [];
            const lawyer = lawyers[index];
            
            if (lawyer) {
                document.querySelector('.lawyer-name').value = lawyer.name;
                document.querySelector('.lawyer-bar').value = lawyer.bar;
                document.querySelector('.lawyer-id').value = lawyer.id;
                document.querySelector('.lawyer-baro-no').value = lawyer.baroNo || '';
                document.querySelector('.lawyer-tbb-no').value = lawyer.tbbNo || '';
                document.querySelector('.lawyer-email').value = lawyer.email;
                document.querySelector('.lawyer-phone').value = lawyer.phone;
                document.querySelector('.lawyer-address').value = lawyer.address;

                const saveBtn = document.querySelector('.save-lawyer-btn');
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Güncelle';
                saveBtn.dataset.editIndex = index;
                saveBtn.classList.add('editing');

                saveBtn.removeEventListener('click', () => this.saveLawyerInfo());
                saveBtn.addEventListener('click', () => this.updateLawyer(index));
            }
        });
    }

    updateLawyer(index) {
        const updatedLawyer = {
            name: document.querySelector('.lawyer-name').value,
            bar: document.querySelector('.lawyer-bar').value,
            id: document.querySelector('.lawyer-id').value,
            baroNo: document.querySelector('.lawyer-baro-no').value,
            tbbNo: document.querySelector('.lawyer-tbb-no').value,
            email: document.querySelector('.lawyer-email').value,
            phone: document.querySelector('.lawyer-phone').value,
            address: document.querySelector('.lawyer-address').value
        };

        chrome.storage.sync.get('lawyers', (data) => {
            const lawyers = data.lawyers || [];
            lawyers[index] = updatedLawyer;

            chrome.storage.sync.set({ lawyers }, () => {
                this.loadLawyerInfo();

                document.querySelector('.lawyer-name').value = '';
                document.querySelector('.lawyer-bar').value = '';
                document.querySelector('.lawyer-id').value = '';
                document.querySelector('.lawyer-baro-no').value = '';
                document.querySelector('.lawyer-tbb-no').value = '';
                document.querySelector('.lawyer-email').value = '';
                document.querySelector('.lawyer-phone').value = '';
                document.querySelector('.lawyer-address').value = '';

                const saveBtn = document.querySelector('.save-lawyer-btn');
                saveBtn.innerHTML = '<i class="fas fa-plus"></i> Avukat Ekle';
                saveBtn.classList.remove('editing');
                saveBtn.removeEventListener('click', () => this.updateLawyer(index));
                saveBtn.addEventListener('click', () => this.saveLawyerInfo());
            });
        });
    }

    deleteLawyer(index) {
        chrome.storage.sync.get('lawyers', (data) => {
            const lawyers = data.lawyers || [];
            lawyers.splice(index, 1);

            chrome.storage.sync.set({ lawyers }, () => {
                this.loadLawyerInfo();
            });
        });
    }

    setupStaffFormEvents() {
        const saveBtn = document.querySelector('.save-staff-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveStaffInfo());
        }
    }

    saveStaffInfo() {
        const newStaff = {
            name: document.querySelector('.staff-name').value,
            position: document.querySelector('.staff-position').value,
            email: document.querySelector('.staff-email').value,
            phone: document.querySelector('.staff-phone').value
        };

        chrome.storage.sync.get('staffs', (data) => {
            const staffs = data.staffs || [];
            staffs.push(newStaff);
            
            chrome.storage.sync.set({ staffs }, () => {
                this.loadStaffInfo();
                
                document.querySelector('.staff-name').value = '';
                document.querySelector('.staff-position').value = '';
                document.querySelector('.staff-email').value = '';
                document.querySelector('.staff-phone').value = '';
            });
        });
    }

    loadStaffInfo() {
        chrome.storage.sync.get('staffs', (data) => {
            const staffsContainer = document.querySelector('.staffs-container');
            if (staffsContainer && data.staffs) {
                staffsContainer.innerHTML = data.staffs.map((staff, index) => `
                    <div class="staff-card">
                        <div class="staff-card-header">
                            <h5>${staff.name}</h5>
                        </div>
                        <div class="staff-card-body">
                            <div class="staff-info-item">
                                <div class="staff-info-header">
                                    <span class="staff-position-badge">${staff.position}</span>
                                </div>
                                <div class="staff-info-row"><i class="fas fa-envelope"></i> ${staff.email}</div>
                                <div class="staff-info-row"><i class="fas fa-phone"></i> ${staff.phone}</div>
                            </div>
                            <div class="staff-card-actions">
                                <button class="edit-staff-btn" onclick="this.getRootNode().host.querySelector('.account-overlay').__vue__.editStaff(${index})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-staff-btn" onclick="this.getRootNode().host.querySelector('.account-overlay').__vue__.deleteStaff(${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');

                this.setupStaffCardEvents();
            }
        });
    }

    setupStaffCardEvents() {
        const editBtns = document.querySelectorAll('.edit-staff-btn');
        const deleteBtns = document.querySelectorAll('.delete-staff-btn');

        editBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editStaff(index);
            });
        });

        deleteBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteStaff(index);
            });
        });
    }

    editStaff(index) {
        chrome.storage.sync.get('staffs', (data) => {
            const staffs = data.staffs || [];
            const staff = staffs[index];
            
            if (staff) {
                document.querySelector('.staff-name').value = staff.name;
                document.querySelector('.staff-position').value = staff.position;
                document.querySelector('.staff-email').value = staff.email;
                document.querySelector('.staff-phone').value = staff.phone;

                const saveBtn = document.querySelector('.save-staff-btn');
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Güncelle';
                saveBtn.dataset.editIndex = index;
                saveBtn.classList.add('editing');

                saveBtn.removeEventListener('click', () => this.saveStaffInfo());
                saveBtn.addEventListener('click', () => this.updateStaff(index));
            }
        });
    }

    updateStaff(index) {
        const updatedStaff = {
            name: document.querySelector('.staff-name').value,
            position: document.querySelector('.staff-position').value,
            email: document.querySelector('.staff-email').value,
            phone: document.querySelector('.staff-phone').value
        };

        chrome.storage.sync.get('staffs', (data) => {
            const staffs = data.staffs || [];
            staffs[index] = updatedStaff;

            chrome.storage.sync.set({ staffs }, () => {
                this.loadStaffInfo();

                document.querySelector('.staff-name').value = '';
                document.querySelector('.staff-position').value = '';
                document.querySelector('.staff-email').value = '';
                document.querySelector('.staff-phone').value = '';

                const saveBtn = document.querySelector('.save-staff-btn');
                saveBtn.innerHTML = '<i class="fas fa-plus"></i> Personel Ekle';
                saveBtn.classList.remove('editing');
                saveBtn.removeEventListener('click', () => this.updateStaff(index));
                saveBtn.addEventListener('click', () => this.saveStaffInfo());
            });
        });
    }

    deleteStaff(index) {
        chrome.storage.sync.get('staffs', (data) => {
            const staffs = data.staffs || [];
            staffs.splice(index, 1);

            chrome.storage.sync.set({ staffs }, () => {
                this.loadStaffInfo();
            });
        });
    }

    showAccount() {
        const overlay = document.querySelector('.account-overlay');
        if (overlay) {
            overlay.classList.add('active');
            
            // Stil ekle
            const style = document.createElement('style');
            style.textContent = `
                .client-card, .lawyer-card, .staff-card, .petition-card {
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    background-color: #fff;
                    overflow: hidden;
                }
                
                .client-card-header, .lawyer-card-header, .staff-card-header, .petition-card-header {
                    padding: 12px 15px;
                    border-bottom: 1px solid #e0e0e0;
                    background-color: #f9f9f9;
                    position: relative;
                }
                
                .client-card-header h5, .lawyer-card-header h5, .staff-card-header h5, .petition-card-header h5 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #333;
                }
                
                .client-role-badge, .lawyer-badge, .staff-position-badge {
                    display: inline-block;
                    background-color: #4a76a8;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    margin-bottom: 10px;
                }
                
                .client-cases-count, .petition-card-date {
                    position: absolute;
                    right: 15px;
                    top: 12px;
                    background-color: #6c757d;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                }
                
                .client-card-body, .lawyer-card-body, .staff-card-body, .petition-card-body {
                    padding: 15px;
                }
                
                .lawyer-card-actions, .staff-card-actions, .petition-card-actions {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 15px;
                    padding-top: 10px;
                    border-top: 1px solid #e0e0e0;
                }
                
                .lawyer-card-actions button, .staff-card-actions button, .petition-card-actions button {
                    background: none;
                    border: none;
                    color: #4a76a8;
                    cursor: pointer;
                    margin-left: 5px;
                    padding: 3px 6px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                
                .lawyer-card-actions button:hover, .staff-card-actions button:hover, .petition-card-actions button:hover {
                    background-color: rgba(74, 118, 168, 0.1);
                }
                
                .edit-lawyer-btn, .edit-staff-btn, .edit-petition-btn {
                    color: #4a76a8 !important;
                }
                
                .delete-lawyer-btn, .delete-staff-btn, .delete-petition-btn {
                    color: #dc3545 !important;
                }
                
                .lawyer-info-item, .staff-info-item {
                    border-left: 3px solid #4a76a8;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    background-color: #f3f7fa;
                    border-radius: 0 4px 4px 0;
                }
                
                /* TabPanel Stilleri */
                .document-tabpanel {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    background-color: #fff;
                    height: 100%;
                }
                
                .document-tab-headers {
                    display: flex;
                    border-bottom: 1px solid #e0e0e0;
                    background-color: #f8f9fa;
                }
                
                .document-tab-header {
                    padding: 15px 20px;
                    cursor: pointer;
                    font-weight: normal;
                    color: #555;
                    border-bottom: 3px solid transparent;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .document-tab-header i {
                    margin-right: 5px;
                    color: #4a76a8;
                }
                
                .document-tab-header:hover {
                    background-color: #e3edf7;
                }
                
                .document-tab-header.active {
                    font-weight: bold;
                    color: #24377F;
                    border-bottom: 3px solid #24377F;
                }
                
                .document-tab-contents {
                    padding: 20px;
                    position: relative;
                    flex: 1;
                    overflow-y: auto;
                }
                
                .document-tab-content {
                    display: none;
                    height: 100%;
                }
                
                .document-tab-content.active {
                    display: block;
                }
                
                .petitions-header, .quick-petitions-header, .contracts-header, .meeting-notes-header {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    margin-bottom: 15px;
                }
                
                .add-petition-btn, .add-quick-petition-btn, .add-contract-btn, .add-meeting-note-btn {
                    background-color: #4a76a8;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                }
                
                .add-petition-btn i, .add-quick-petition-btn i, .add-contract-btn i, .add-meeting-note-btn i {
                    margin-right: 5px;
                }
                
                .no-petitions, .no-quick-petitions, .no-contracts, .no-meeting-notes {
                    text-align: center;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    color: #6c757d;
                }
                
                .no-petitions i, .no-quick-petitions i, .no-contracts i, .no-meeting-notes i {
                    font-size: 2rem;
                    margin-bottom: 10px;
                    display: block;
                }
                
                /* Raporlar Stilleri */
                .reports-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .reports-header {
                    margin-bottom: 20px;
                }
                
                .reports-filters {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex-wrap: wrap;
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    border: 1px solid #e0e0e0;
                }
                
                .report-type-select {
                    padding: 8px 12px;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    min-width: 180px;
                }
                
                .date-filter {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .date-filter input[type="date"] {
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                }
                
                .generate-report-btn, .export-report-btn {
                    background-color: #4a76a8;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .reports-content {
                    flex: 1;
                    background-color: #fff;
                    border-radius: 8px;
                    border: 1px solid #e0e0e0;
                    padding: 20px;
                    min-height: 400px;
                }
                
                .report-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    text-align: center;
                    color: #6c757d;
                }
                
                .reports-icon {
                    font-size: 48px;
                    margin-bottom: 15px;
                    color: #4a76a8;
                }
                
                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .report-date-range {
                    color: #6c757d;
                    font-style: italic;
                }
                
                .report-summary {
                    margin-bottom: 30px;
                }
                
                .report-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                
                .report-card {
                    display: flex;
                    align-items: center;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 15px;
                    border: 1px solid #e0e0e0;
                }
                
                .report-card-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    background-color: #24377F;
                    color: white;
                    border-radius: 50%;
                    margin-right: 15px;
                    font-size: 20px;
                }
                
                .report-number {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0;
                    color: #24377F;
                }
                
                .report-chart {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                    border: 1px solid #e0e0e0;
                }
                
                .chart-placeholder {
                    height: 200px;
                    background-color: #e9ecef;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6c757d;
                    margin-top: 10px;
                }
                
                .report-table {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 15px;
                    border: 1px solid #e0e0e0;
                }
                
                .reports-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                
                .reports-table th, .reports-table td {
                    padding: 10px;
                    text-align: left;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .reports-table th {
                    background-color: #f1f1f1;
                    font-weight: bold;
                }
                
                .loading-reports {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 50px 0;
                }
                
                .loading-reports i {
                    font-size: 30px;
                    color: #4a76a8;
                    margin-bottom: 15px;
                }
                
                .reports-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                    text-align: center;
                    color: #6c757d;
                }
                
                .reports-placeholder i {
                    font-size: 48px;
                    margin-bottom: 20px;
                    color: #4a76a8;
                }
            `;
            document.head.appendChild(style);
        }
    }

    hideAccount() {
        const overlay = document.querySelector('.account-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    setupClientEvents() {
        // Müvekkil verileri güncellendiğinde dinle
        window.addEventListener('muvekkilDataUpdated', (event) => {
            this.displayClientData(event.detail.muvekkilVerileri);
        });
        
        // İlk yükleme
        this.loadClientData();
    }
    
    loadClientData() {
        const clientsContainer = document.querySelector('.clients-cards-container');
        
        if (clientsContainer) {
            // Yükleniyor göster
            clientsContainer.innerHTML = `
                <div class="loading-clients">
                    <i class="fas fa-spinner fa-pulse"></i>
                    <p>Müvekkiller yükleniyor...</p>
                </div>
            `;
            
            // Chrome storage'dan müvekkil verilerini çek
            chrome.storage.local.get(['muvekkilVerileri'], (result) => {
                const muvekkilVerileri = result.muvekkilVerileri || [];
                this.displayClientData(muvekkilVerileri);
            });
        }
    }
    
    displayClientData(muvekkilVerileri) {
        const clientsContainer = document.querySelector('.clients-cards-container');
        const header = document.querySelector('.clients-header h4');
        
        if (!clientsContainer) return;
        
        if (muvekkilVerileri && muvekkilVerileri.length > 0) {
            header.textContent = 'Müvekkilleriniz';
            
            // Müvekkilleri adlarına göre gruplandır
            const groupedClients = {};
            
            muvekkilVerileri.forEach(dava => {
                dava.muvekkilListesi.forEach(muvekkil => {
                    // Müvekkil adını anahtar olarak kullan
                    const key = muvekkil.ad;
                    
                    if (!groupedClients[key]) {
                        // Yeni müvekkil - ilk davayı ekle
                        groupedClients[key] = {
                            muvekkil: muvekkil,
                            davalar: [{
                                davaNo: dava.davaNo,
                                mahkeme: dava.mahkeme,
                                tarih: dava.tarih
                            }]
                        };
                    } else {
                        // Varolan müvekkil - yeni davayı ekle
                        groupedClients[key].davalar.push({
                            davaNo: dava.davaNo,
                            mahkeme: dava.mahkeme,
                            tarih: dava.tarih
                        });
                    }
                });
            });
            
            let cardsHTML = '';
            
            // Gruplandırılmış müvekkilleri göster
            Object.values(groupedClients).forEach(group => {
                const { muvekkil, davalar } = group;
                
                let davaListHTML = '';
                davalar.forEach(dava => {
                    davaListHTML += `
                        <div class="client-case">
                            <div class="client-case-header">
                                <span class="client-role-badge">${muvekkil.tip}</span>
                            </div>
                            <p><i class="fas fa-gavel"></i> ${dava.mahkeme} ${dava.davaNo}</p>
                        </div>
                    `;
                });
                
                cardsHTML += `
                    <div class="client-card">
                        <div class="client-card-header">
                            <h5>${muvekkil.ad}</h5>
                            <span class="client-cases-count">${davalar.length} dava</span>
                        </div>
                        <div class="client-card-body">
                            ${davaListHTML}
                        </div>
                    </div>
                `;
            });
            
            clientsContainer.innerHTML = cardsHTML;
            
            // Kart yoksa
            if (!cardsHTML) {
                this.displayNoClients(clientsContainer, header);
            }
        } else {
            this.displayNoClients(clientsContainer, header);
        }
    }
    
    displayNoClients(container, header) {
        header.textContent = 'Müvekkiliniz Bulunmamaktadır';
        container.innerHTML = `
            <div class="no-clients">
                <i class="fas fa-user-friends"></i>
                <p>Henüz müvekkiliniz bulunmamaktadır.</p>
                <p class="help-text">Açtığınız dava dosyalarında "Hızlı Dilekçe" butonuna tıklayarak müvekkillerinizi otomatik olarak ekleyebilirsiniz.</p>
            </div>
        `;
    }

    setupDocumentManagementEvents() {
        // Tab başlıklarına tıklama olayları
        const tabHeaders = document.querySelectorAll('.document-tab-header');
        const tabContents = document.querySelectorAll('.document-tab-content');
        
        if (tabHeaders.length && tabContents.length) {
            tabHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    // Aktif tab'ı değiştir
                    tabHeaders.forEach(h => h.classList.remove('active'));
                    header.classList.add('active');
                    
                    const section = header.dataset.section;
                    this.currentDocumentSection = section;
                    
                    // İlgili içeriği göster, diğerlerini gizle
                    tabContents.forEach(content => {
                        if (content.dataset.section === section) {
                            content.style.display = 'block';
                            content.classList.add('active');
                            
                            // İlgili içerik için veri yükleme metodunu çağır
                            switch(section) {
                                case 'petitions':
                                    this.loadPetitionsData();
                                    break;
                                case 'quick-petitions':
                                    this.loadQuickPetitionsData();
                                    break;
                                case 'contracts':
                                    this.loadContractsData();
                                    break;
                                case 'meeting-notes':
                                    this.loadMeetingNotesData();
                                    break;
                            }
                        } else {
                            content.style.display = 'none';
                            content.classList.remove('active');
                        }
                    });
                });
            });
        }
        
        // İlk tab için veri yükleme
        this.loadPetitionsData();
    }
    
    loadPetitionsData() {
        const petitionsList = document.querySelector('.petitions-list');
        
        if (petitionsList) {
            petitionsList.innerHTML = `
                <div class="loading-petitions">
                    <i class="fas fa-spinner fa-pulse"></i>
                    <p>Dilekçeler yükleniyor...</p>
                </div>
            `;
            
            // Verileri çek
            chrome.storage.local.get(['savedPetitions'], (result) => {
                const savedPetitions = result.savedPetitions || [];
                this.displayPetitionsData(savedPetitions);
            });
            
            // Ekle butonu
            const addBtn = document.querySelector('.add-petition-btn');
            
            if (addBtn) {
                addBtn.addEventListener('click', () => this.showAddPetitionForm());
            }
        }
    }
    
    displayPetitionsData(petitions) {
        const petitionsList = document.querySelector('.petitions-list');
        
        if (!petitionsList) return;
        
        if (petitions && petitions.length > 0) {
            let cardsHTML = '<div class="petitions-cards-container">';
            
            petitions.forEach((petition, index) => {
                    cardsHTML += `
                    <div class="petition-card">
                        <div class="petition-card-header">
                            <h5>${petition.type || 'Dilekçe'}</h5>
                            <span class="petition-card-date">${new Date(petition.createdAt || Date.now()).toLocaleDateString('tr-TR')}</span>
                            </div>
                        <div class="petition-card-body">
                            <p><i class="fas fa-gavel"></i> ${petition.davaNo || 'Dosya No Yok'}</p>
                            <p><i class="fas fa-university"></i> ${petition.mahkeme || 'Mahkeme Bilgisi Yok'}</p>
                            </div>
                        <div class="petition-card-actions">
                                <button class="view-petition-btn" data-index="${index}">
                                    <i class="fas fa-eye"></i> Görüntüle
                                </button>
                                <button class="edit-petition-btn" data-index="${index}">
                                    <i class="fas fa-edit"></i> Düzenle
                                </button>
                            <button class="delete-petition-btn" data-index="${index}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
            });
            
            cardsHTML += '</div>';
            petitionsList.innerHTML = cardsHTML;
            
            // Butonlara tıklama olayları
            this.setupPetitionCardEvents();
                } else {
            petitionsList.innerHTML = `
                <div class="no-petitions">
                    <i class="fas fa-file-alt"></i>
                    <p>Henüz kaydedilmiş dilekçe bulunmamaktadır.</p>
                        </div>
                    `;
                }
    }
    
    setupPetitionCardEvents() {
        // Görüntüle butonları
        const viewBtns = document.querySelectorAll('.view-petition-btn');
        viewBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.dataset.index;
                    this.viewPetition(index);
                });
            });
            
        // Düzenle butonları
        const editBtns = document.querySelectorAll('.edit-petition-btn');
        editBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.dataset.index;
                    this.editPetition(index);
                });
            });
            
        // Sil butonları
        const deleteBtns = document.querySelectorAll('.delete-petition-btn');
            deleteBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.dataset.index;
                this.deletePetition(index);
                });
            });
    }
    
    showAddPetitionForm() {
        // Yeni dilekçe ekleme formu göster
        this.createNewDocumentForm('petition');
    }
    
    viewPetition(index) {
        // Dilekçe görüntüleme
        chrome.storage.local.get(['savedPetitions'], (result) => {
            const savedPetitions = result.savedPetitions || [];
            const petition = savedPetitions[index];
            
            if (petition) {
                this.showPetitionViewer(petition);
            }
        });
    }
    
    editPetition(index) {
        // Dilekçe düzenleme
        chrome.storage.local.get(['savedPetitions'], (result) => {
            const savedPetitions = result.savedPetitions || [];
            const petition = savedPetitions[index];
            
            if (petition) {
                this.showPetitionEditor(petition, index);
            }
        });
    }
    
    deletePetition(index) {
        // Dilekçe silme
        if (confirm('Bu dilekçeyi silmek istediğinize emin misiniz?')) {
            chrome.storage.local.get(['savedPetitions'], (result) => {
                const savedPetitions = result.savedPetitions || [];
                savedPetitions.splice(index, 1);
                
                chrome.storage.local.set({ savedPetitions }, () => {
                    this.loadPetitionsData();
                });
            });
        }
    }
    
    loadQuickPetitionsData() {
        const quickPetitionsList = document.querySelector('.quick-petitions-list');
        
        if (quickPetitionsList) {
            quickPetitionsList.innerHTML = `
                <div class="no-quick-petitions">
                    <i class="fas fa-bolt"></i>
                    <p>Hızlı dilekçe özelliği yakında kullanıma sunulacaktır.</p>
                </div>
            `;
            
            // Ekle butonu
            const addBtn = document.querySelector('.add-quick-petition-btn');
            
            if (addBtn) {
                addBtn.addEventListener('click', () => this.createNewDocumentForm('quick-petition'));
            }
        }
    }
    
    loadContractsData() {
        const contractsList = document.querySelector('.contracts-list');
        
        if (contractsList) {
            // Önce yükleniyor mesajını göster
            contractsList.innerHTML = `
                <div class="loading-contracts">
                    <i class="fas fa-spinner fa-pulse"></i>
                    <p>Sözleşmeler yükleniyor...</p>
                </div>
            `;
            
            // Chrome storage'dan sözleşmeleri al
            chrome.storage.local.get('contracts', (result) => {
                const contracts = result.contracts || [];
                
                // Sözleşmeler var mı kontrol et
                if (contracts.length > 0) {
                    let contractsHTML = '<div class="contracts-grid">';
                    
                    // Her sözleşme için kart oluştur
                    contracts.forEach((contract, index) => {
                        // Tarih formatını düzenle
                        const date = new Date(contract.createdAt);
                        const formattedDate = date.toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        });
                        
                        contractsHTML += `
                            <div class="contract-card" data-id="${contract.id}" data-index="${index}">
                                <div class="contract-header">
                                    <h4>Avukatlık Ücret Sözleşmesi</h4>
                                    <div class="contract-date">${formattedDate}</div>
                                </div>
                                <div class="contract-body">
                                    <div class="contract-client">${contract.clientName || 'İsimsiz Müvekkil'}</div>
                                    <div class="contract-summary">
                                        <i class="fas fa-user-tie" style="color: #4a76a8;"></i> ${contract.lawyerName || 'Belirtilmemiş'}
                                    </div>
                                    <div class="contract-summary">
                                        <i class="fas fa-calendar-alt" style="color: #4a76a8;"></i> ${formattedDate}
                                    </div>
                                </div>
                                <div class="contract-actions">
                                    <button class="view-contract" data-index="${index}">
                                        <i class="fas fa-eye"></i> Görüntüle
                                    </button>
                                    <button class="download-contract" data-index="${index}">
                                        <i class="fas fa-download"></i> İndir
                                    </button>
                                    <button class="delete-contract" data-index="${index}">
                                        <i class="fas fa-trash"></i> Sil
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                    
                    contractsHTML += '</div>';
                    
                    // CSS stil ekleme
                    contractsHTML += `
                        <style>
                            .contracts-grid {
                                display: grid;
                                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                                grid-gap: 20px;
                                margin-top: 20px;
                            }
                            
                            .contract-card {
                                border: 1px solid #ddd;
                                border-radius: 8px;
                                overflow: hidden;
                                background-color: white;
                                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                                transition: transform 0.2s, box-shadow 0.2s;
                            }
                            
                            .contract-card:hover {
                                transform: translateY(-3px);
                                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                            }
                            
                            .contract-header {
                                padding: 12px 15px;
                                background-color: #f8f9fa;
                                border-bottom: 1px solid #eee;
                            }
                            
                            .contract-header h4 {
                                margin: 0 0 5px 0;
                                font-size: 16px;
                                color: #333;
                            }
                            
                            .contract-date {
                                font-size: 13px;
                                color: #666;
                            }
                            
                            .contract-body {
                                padding: 15px;
                            }
                            
                            .contract-client {
                                font-weight: bold;
                                margin-bottom: 10px;
                                font-size: 15px;
                                color: #333;
                            }
                            
                            .contract-summary {
                                font-size: 14px;
                                color: #555;
                                margin-bottom: 8px;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            }
                            
                            .contract-actions {
                                display: flex;
                                justify-content: space-between;
                                padding: 12px 15px;
                                border-top: 1px solid #eee;
                                background-color: #f8f9fa;
                            }
                            
                            .contract-actions button {
                                padding: 6px 10px;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 13px;
                                display: flex;
                                align-items: center;
                                gap: 5px;
                                transition: background-color 0.2s;
                            }
                            
                            .view-contract {
                                background-color: #4a76a8;
                                color: white;
                            }
                            
                            .view-contract:hover {
                                background-color: #3d638e;
                            }
                            
                            .download-contract {
                                background-color: #17a2b8;
                                color: white;
                            }
                            
                            .download-contract:hover {
                                background-color: #138496;
                            }
                            
                            .delete-contract {
                                background-color: #dc3545;
                                color: white;
                            }
                            
                            .delete-contract:hover {
                                background-color: #c82333;
                            }
                        </style>
                    `;
                    
                    contractsList.innerHTML = contractsHTML;
                    
                    // Kart butonlarına olayları ekle
                    this.setupContractCardEvents();
                } else {
                    // Sözleşme yoksa mesaj göster
                    contractsList.innerHTML = `
                        <div class="no-contracts">
                            <i class="fas fa-file-contract"></i>
                            <p>Henüz kaydedilmiş sözleşme bulunmamaktadır.</p>
                            <p>Yeni bir sözleşme oluşturmak için "Ekle" butonuna tıklayın.</p>
                        </div>
                        <style>
                            .no-contracts {
                                text-align: center;
                                padding: 50px 20px;
                                color: #666;
                                background-color: #f9f9f9;
                                border-radius: 8px;
                                margin-top: 20px;
                            }
                            
                            .no-contracts i {
                                font-size: 3rem;
                                margin-bottom: 15px;
                                color: #4a76a8;
                            }
                            
                            .no-contracts p {
                                margin: 5px 0;
                                font-size: 1rem;
                            }
                        </style>
                    `;
                }
                
                // Ekle butonu
                const addBtn = document.querySelector('.add-contract-btn');
                
                if (addBtn) {
                    // Önce mevcut tüm event listener'ları kaldır
                    const newAddBtn = addBtn.cloneNode(true);
                    addBtn.parentNode.replaceChild(newAddBtn, addBtn);
                    
                    // Yeni bir event listener ekle
                    newAddBtn.addEventListener('click', () => this.createNewDocumentForm('contract'));
                }
            });
        }
    }
    
    loadMeetingNotesData() {
        const meetingNotesList = document.querySelector('.meeting-notes-list');
        
        if (meetingNotesList) {
            // Önce yükleniyor mesajını göster
            meetingNotesList.innerHTML = `
                <div class="loading-meeting-notes">
                    <i class="fas fa-spinner fa-pulse"></i>
                    <p>Görüşme tutanakları yükleniyor...</p>
                </div>
            `;
            
            // Local storage'dan görüşme tutanaklarını al
            const meetingNotes = JSON.parse(localStorage.getItem('uyap_asistan_meeting_notes') || '[]');
            
            // Görüşme tutanakları var mı kontrol et
            if (meetingNotes.length > 0) {
                let meetingNotesHTML = '<div class="meeting-notes-grid">';
                
                // Her görüşme tutanağı için kart oluştur
                meetingNotes.forEach((note, index) => {
                    // Tutanak tipini belirle
                    let typeName = 'İlk Görüşme';
                    if (note.type === 'dava_sonrasi') typeName = 'Dava Sonrası Görüşme';
                    else if (note.type === 'uzlasma') typeName = 'Uzlaşma Görüşmesi';
                    else if (note.type === 'bilgilendirme') typeName = 'Bilgilendirme Toplantısı';
                    else if (note.type === 'diger') typeName = 'Diğer Görüşme';
                    
                    // Tarih formatını düzenle
                    const date = new Date(note.date);
                    const formattedDate = date.toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                    
                    meetingNotesHTML += `
                        <div class="meeting-note-card" data-id="${note.id}" data-index="${index}">
                            <div class="meeting-note-header">
                                <h4>${typeName}</h4>
                                <div class="meeting-note-date">${formattedDate}</div>
                            </div>
                            <div class="meeting-note-body">
                                <div class="meeting-note-client">${note.clientName || 'İsimsiz Müvekkil'}</div>
                                <div class="meeting-note-summary">
                                    <i class="fas fa-user-tie" style="color: #4a76a8;"></i> ${note.lawyerName || 'Belirtilmemiş'}
                                </div>
                                <div class="meeting-note-summary">
                                    <i class="fas fa-calendar-alt" style="color: #4a76a8;"></i> ${formattedDate}
                                </div>
                            </div>
                            <div class="meeting-note-actions">
                                <button class="view-meeting-note" data-index="${index}">
                                    <i class="fas fa-eye"></i> Görüntüle
                                </button>
                                <button class="download-meeting-note" data-index="${index}">
                                    <i class="fas fa-download"></i> İndir
                                </button>
                                <button class="delete-meeting-note" data-index="${index}">
                                    <i class="fas fa-trash"></i> Sil
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                meetingNotesHTML += '</div>';
                
                // CSS stil ekleme
                meetingNotesHTML += `
                    <style>
                        .meeting-notes-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                            grid-gap: 20px;
                            margin-top: 20px;
                        }
                        
                        .meeting-note-card {
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            overflow: hidden;
                            background-color: white;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            transition: transform 0.2s, box-shadow 0.2s;
                        }
                        
                        .meeting-note-card:hover {
                            transform: translateY(-3px);
                            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                        }
                        
                        .meeting-note-header {
                            padding: 12px 15px;
                            background-color: #f8f9fa;
                            border-bottom: 1px solid #eee;
                        }
                        
                        .meeting-note-header h4 {
                            margin: 0 0 5px 0;
                            font-size: 16px;
                            color: #333;
                        }
                        
                        .meeting-note-date {
                            font-size: 13px;
                            color: #666;
                        }
                        
                        .meeting-note-body {
                            padding: 15px;
                        }
                        
                        .meeting-note-client {
                            font-weight: bold;
                            margin-bottom: 10px;
                            font-size: 15px;
                            color: #333;
                        }
                        
                        .meeting-note-summary {
                            font-size: 14px;
                            color: #555;
                            margin-bottom: 8px;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                        
                        .meeting-note-actions {
                            display: flex;
                            justify-content: space-between;
                            padding: 12px 15px;
                            border-top: 1px solid #eee;
                            background-color: #f8f9fa;
                        }
                        
                        .meeting-note-actions button {
                            padding: 6px 10px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 13px;
                            display: flex;
                            align-items: center;
                            gap: 5px;
                            transition: background-color 0.2s;
                        }
                        
                        .view-meeting-note {
                            background-color: #4a76a8;
                            color: white;
                        }
                        
                        .view-meeting-note:hover {
                            background-color: #3d638e;
                        }
                        
                        .download-meeting-note {
                            background-color: #17a2b8;
                            color: white;
                        }
                        
                        .download-meeting-note:hover {
                            background-color: #138496;
                        }
                        
                        .delete-meeting-note {
                            background-color: #dc3545;
                            color: white;
                        }
                        
                        .delete-meeting-note:hover {
                            background-color: #c82333;
                        }
                    </style>
                `;
                
                meetingNotesList.innerHTML = meetingNotesHTML;
                
                // Kart butonlarına olayları ekle
                this.setupMeetingNoteCardEvents();
            } else {
                // Görüşme tutanağı yoksa mesaj göster
                meetingNotesList.innerHTML = `
                    <div class="no-meeting-notes">
                        <i class="fas fa-clipboard"></i>
                        <p>Henüz kaydedilmiş görüşme tutanağı bulunmamaktadır.</p>
                        <p>Yeni bir görüşme tutanağı oluşturmak için "Ekle" butonuna tıklayın.</p>
                    </div>
                    <style>
                        .no-meeting-notes {
                            text-align: center;
                            padding: 50px 20px;
                            color: #666;
                            background-color: #f9f9f9;
                            border-radius: 8px;
                            margin-top: 20px;
                        }
                        
                        .no-meeting-notes i {
                            font-size: 3rem;
                            margin-bottom: 15px;
                            color: #4a76a8;
                        }
                        
                        .no-meeting-notes p {
                            margin: 5px 0;
                            font-size: 1rem;
                        }
                    </style>
                `;
            }
            
            // Ekle butonu
            const addBtn = document.querySelector('.add-meeting-note-btn');
            if (addBtn) {
                // Önceki event listener'ları temizle
                const newAddBtn = addBtn.cloneNode(true);
                addBtn.parentNode.replaceChild(newAddBtn, addBtn);
                
                // Yeni event listener ekle
                newAddBtn.addEventListener('click', () => this.createNewDocumentForm('meeting-note'));
            }
        }
    }
    
    createNewDocumentForm(type) {
        // Bu metod yakında gelecek özellikler için hazır tutuluyor
        console.log(`${type} için form oluşturulacak`);
        
        // Boş form yapısı ekleniyor, ileride bu kısım doldurulacak
        const popupContainer = document.createElement('div');
        popupContainer.className = 'quick-petition-editor-container';
        
        let title = '';
        let content = '';
        
        switch(type) {
            case 'petition':
                title = 'YENİ DİLEKÇE OLUŞTUR';
                content = `
                    <div class="coming-soon">
                        <i class="fas fa-tools" style="font-size: 3rem; margin-bottom: 15px; color: #4a76a8;"></i>
                        <p>Bu özellik henüz geliştirme aşamasındadır.</p>
                        <p>Yakında kullanıma sunulacaktır.</p>
                    </div>
                `;
                break;
            case 'quick-petition':
                title = 'YENİ HIZLI DİLEKÇE OLUŞTUR';
                content = `
                    <div class="coming-soon">
                        <i class="fas fa-tools" style="font-size: 3rem; margin-bottom: 15px; color: #4a76a8;"></i>
                        <p>Bu özellik henüz geliştirme aşamasındadır.</p>
                        <p>Yakında kullanıma sunulacaktır.</p>
                    </div>
                `;
                break;
            case 'contract':
                title = 'AVUKATLIK ÜCRET SÖZLEŞMESİ OLUŞTUR';
                content = this.generateContractForm();
                break;
            case 'meeting-note':
                title = 'YENİ GÖRÜŞME TUTANAĞI OLUŞTUR';
                content = this.generateMeetingNotesForm();
                break;
        }
        
        popupContainer.innerHTML = `
            <div class="quick-petition-popup">
                <div class="quick-petition-header">
                    <h3>${title}</h3>
                    <div class="quick-petition-close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                
                <div class="quick-petition-content">
                    ${content}
                        </div>
                        </div>
        `;
        
        // Stil ekle
        const style = document.createElement('style');
        style.textContent = `
            .coming-soon {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 50px 20px;
                text-align: center;
                color: #555;
            }
            
            .coming-soon p {
                margin: 5px 0;
                font-size: 1.1rem;
            }
            
            .quick-petition-popup {
                width: 900px;
                height: 600px;
                max-width: 90%;
                max-height: 90vh;
                overflow: auto;
            }
            
            /* Wizard stil tanımlamaları */
            .wizard-header {
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            
            .wizard-steps {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 5px;
            }
            
            .wizard-step {
                padding: 8px 12px;
                background-color: #f0f0f0;
                border-radius: 4px;
                font-size: 14px;
                color: #555;
                opacity: 0.75;
                cursor: default;
                flex: 1;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .wizard-step.active {
                background-color: #4a76a8;
                color: white;
                opacity: 1;
                font-weight: bold;
            }
            
            .wizard-page {
                display: none;
                padding: 20px;
                max-height: 450px;
                overflow-y: auto;
            }
            
            .wizard-page.active {
                display: block;
            }
            
            .wizard-footer {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #eee;
            }
            
            .wizard-navigation {
                display: flex;
                gap: 10px;
            }
            
            .wizard-navigation button {
                padding: 8px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            }
            
            .prev-step-btn {
                background-color: #f0f0f0;
                color: #555;
            }
            
            .next-step-btn {
                background-color: #4a76a8;
                color: white;
            }
            
            .finish-btn {
                background-color: #28a745;
                color: white;
            }
            
            .wizard-status {
                font-size: 14px;
                color: #666;
                align-self: center;
            }
            
            /* Görüşme tutanakları listesi stilleri */
            .meeting-notes-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                grid-gap: 15px;
                margin-top: 20px;
            }
            
            .meeting-note-card {
                border: 1px solid #ddd;
                border-radius: 6px;
                overflow: hidden;
                background-color: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .meeting-note-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            .meeting-note-header {
                padding: 12px 15px;
                background-color: #f8f8f8;
                border-bottom: 1px solid #eee;
            }
            
            .meeting-note-header h4 {
                margin: 0 0 5px 0;
                font-size: 16px;
                color: #333;
            }
            
            .meeting-note-date {
                font-size: 13px;
                color: #666;
            }
            
            .meeting-note-body {
                padding: 15px;
            }
            
            .meeting-note-client {
                font-weight: bold;
                margin-bottom: 5px;
                font-size: 15px;
            }
            
            .meeting-note-summary {
                font-size: 14px;
                color: #555;
                margin-bottom: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .meeting-note-actions {
                display: flex;
                justify-content: space-between;
                padding: 10px 15px;
                border-top: 1px solid #eee;
                background-color: #f8f8f8;
            }
            
            .meeting-note-actions button {
                padding: 6px 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .view-meeting-note {
                background-color: #4a76a8;
                color: white;
            }
            
            .download-meeting-note, .download-viewed-meeting-note {
                background-color: #17a2b8;
                color: white;
            }
            
            .delete-meeting-note {
                background-color: #dc3545;
                color: white;
            }
            
            .meeting-note-preview-container {
                padding: 20px;
                max-height: 500px;
                overflow-y: auto;
                border: 1px solid #ddd;
                border-radius: 4px;
                background-color: #fff;
            }
            
            .no-meeting-notes {
                text-align: center;
                padding: 40px 20px;
                color: #666;
            }
            
            .no-meeting-notes i {
                font-size: 3rem;
                margin-bottom: 15px;
                color: #4a76a8;
            }
            
            .meeting-note-form-wizard {
                width: 100%;
                height: 100%;
            }
            
            .contract-form-wizard {
                width: 100%;
                height: 100%;
            }
        `;
        document.head.appendChild(style);
        
        // Popup'ı sayfaya ekle
        document.body.appendChild(popupContainer);
        
        // Form olaylarını ekle
        if (type === 'contract') {
            this.setupContractFormEvents(popupContainer);
            
            // Kayıtlı avukat bilgilerini getir ve otomatik doldur
            this.autoFillLawyerInfo(popupContainer);
        } else if (type === 'meeting-note') {
            this.setupMeetingNoteFormEvents();
        }
        
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
    }
    
    // Avukat bilgilerini otomatik doldurma fonksiyonu
    autoFillLawyerInfo(container) {
        chrome.storage.sync.get('lawyers', (data) => {
            const lawyers = data.lawyers || [];
            
            if (lawyers.length > 0) {
                // İlk kayıtlı avukatın bilgilerini kullan
                const lawyer = lawyers[0];
                
                // Form alanlarını doldur
                const addressField = container.querySelector('#lawyer-address');
                const nameField = container.querySelector('#lawyer-name');
                const barIdField = container.querySelector('#lawyer-bar-id');
                const barField = container.querySelector('#lawyer-bar');
                
                if (addressField) addressField.value = lawyer.address || '';
                if (nameField) nameField.value = lawyer.name || '';
                if (barIdField) barIdField.value = lawyer.baroNo || '';
                if (barField) barField.value = lawyer.bar || '';

                // Birden fazla avukat varsa, avukat seçme butonu göster
                if (lawyers.length > 1) {
                    const formRow = container.querySelector('.form-row:first-child');
                    if (formRow) {
                        const selectLawyerButton = document.createElement('button');
                        selectLawyerButton.className = 'select-lawyer-btn';
                        selectLawyerButton.textContent = 'Başka Avukat Seç';
                        selectLawyerButton.style.cssText = 'background-color: #6c757d; color: white; margin-top: 5px; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;';
                        
                        formRow.appendChild(selectLawyerButton);
                        
                        // Avukat seçme modal'ını göster
                        selectLawyerButton.addEventListener('click', () => {
                            this.showLawyerSelectionModal(container, lawyers);
                        });
                    }
                }
            }
        });
    }
    
    // Avukat seçme penceresi gösterme fonksiyonu
    showLawyerSelectionModal(container, lawyers) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'lawyer-selection-modal-overlay';
        modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;';
        
        const modal = document.createElement('div');
        modal.className = 'lawyer-selection-modal';
        modal.style.cssText = 'background-color: white; border-radius: 8px; padding: 20px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;';
        
        let modalContent = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #333;">Avukat Seçin</h3>
                <button class="close-modal-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
            </div>
            <div class="lawyers-list" style="display: flex; flex-direction: column; gap: 10px;">
        `;
        
        lawyers.forEach((lawyer, index) => {
            modalContent += `
                <div class="lawyer-select-item" data-index="${index}" style="border: 1px solid #ddd; border-radius: 5px; padding: 10px; cursor: pointer; transition: all 0.2s;">
                    <div style="font-weight: bold;">${lawyer.name}</div>
                    <div style="font-size: 0.9rem; color: #666;">${lawyer.bar}</div>
                    <div style="font-size: 0.9rem;">TC: ${lawyer.id}</div>
                    <div style="font-size: 0.9rem;">Baro No: ${lawyer.baroNo || "Belirtilmemiş"}</div>
                </div>
            `;
        });
        
        modalContent += `</div>`;
        modal.innerHTML = modalContent;
        
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        // Kapatma düğmesi
        const closeBtn = modal.querySelector('.close-modal-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });
        
        // Dışarı tıklandığında kapatma
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });
        
        // Avukat seçme işlemi
        const lawyerItems = modal.querySelectorAll('.lawyer-select-item');
        lawyerItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                const selectedLawyer = lawyers[index];
                
                // Seçilen avukatın bilgilerini forma doldur
                container.querySelector('#lawyer-address').value = selectedLawyer.address || '';
                container.querySelector('#lawyer-name').value = selectedLawyer.name || '';
                container.querySelector('#lawyer-bar-id').value = selectedLawyer.baroNo || '';
                container.querySelector('#lawyer-bar').value = selectedLawyer.bar || '';
                
                // Modal'ı kapat
                document.body.removeChild(modalOverlay);
            });
            
            // Hover efekti
            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = '#f3f7fa';
            });
            
            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = 'white';
            });
        });
    }

    generateContractForm() {
        return `
            <div class="contract-form-wizard">
                <div class="wizard-header">
                    <div class="wizard-steps">
                        <div class="wizard-step active" data-step="1">1. Sözleşme Özellikleri</div>
                        <div class="wizard-step" data-step="2">2. Avukat Bilgileri</div>
                        <div class="wizard-step" data-step="3">3. İş Sahibi Bilgileri</div>
                        <div class="wizard-step" data-step="4">4. Tevdi Edilen İş</div>
                        <div class="wizard-step" data-step="5">5. Avukatlık Ücreti</div>
                        <div class="wizard-step" data-step="6">6. Genel Hükümler</div>
                        <div class="wizard-step" data-step="7">7. Önizleme</div>
                    </div>
                </div>
                
                <div class="wizard-content">
                    <!-- Adım 1: Sözleşmenin Genel Özellikleri -->
                    <div class="wizard-page active" data-page="1">
                        <div class="form-row">
                            <label>Yargı Türü:</label>
                            <select id="jurisdiction-type">
                                <option value="Ceza">Ceza</option>
                                <option value="Hukuk">Hukuk</option>
                                <option value="İcra">İcra</option>
                                <option value="İdari Yargı">İdari Yargı</option>
                                <option value="Satış Memurluğu">Satış Memurluğu</option>
                                <option value="Arabuluculuk">Arabuluculuk</option>
                                <option value="Cumhuriyet Başsavcılığı">Cumhuriyet Başsavcılığı</option>
                                <option value="Tazminat Komisyon Başkanlığı">Tazminat Komisyon Başkanlığı</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <label>Görevli Yargı Birimi:</label>
                            <select id="jurisdiction-unit">
                                <!-- Bu seçenekler JavaScript ile doldurulacak -->
                            </select>
                        </div>
                        <div class="form-row">
                            <label>Yetkili Yargı Birimi:</label>
                            <input type="text" id="authorized-court" placeholder="İstanbul Mahkemeleri">
                        </div>
                        <div class="form-row">
                            <label>Dava Türü:</label>
                            <input type="text" id="case-type" placeholder="Muhdesat Aidiyetinin Tespiti">
                        </div>
                    </div>
                    
                    <!-- Adım 2: Avukat Bilgileri -->
                    <div class="wizard-page" data-page="2">
                        <div class="form-row">
                            <label>Avukat Adı Soyadı:</label>
                            <input type="text" id="lawyer-name" placeholder="Avukat adı soyadı">
                        </div>
                        <div class="form-row">
                            <label>Avukat Barosu:</label>
                            <input type="text" id="lawyer-bar" placeholder="Barosu">
                        </div>
                        <div class="form-row">
                            <label>Avukat Baro Sicil No:</label>
                            <input type="text" id="lawyer-bar-id" placeholder="Baro sicil numarası">
                        </div>
                        <div class="form-row full-width">
                            <label>Avukat Adres:</label>
                            <textarea id="lawyer-address" placeholder="Avukat ofis adresi"></textarea>
                        </div>
                    </div>
                    
                    <!-- Adım 3: İş Sahibi Bilgileri -->
                    <div class="wizard-page" data-page="3">
                        <div class="form-row">
                            <label>İş Sahibi Adı Soyadı/Unvan:</label>
                            <input type="text" id="client-name" placeholder="Müvekkil adı soyadı veya unvanı">
                        </div>
                        <div class="form-row">
                            <label>İş Sahibi T.C./Vergi No:</label>
                            <input type="text" id="client-id" placeholder="T.C. Kimlik No / Vergi No">
                        </div>
                        <div class="form-row">
                            <label>İş Sahibi Telefon:</label>
                            <input type="text" id="client-phone" placeholder="Telefon numarası">
                        </div>
                        <div class="form-row full-width">
                            <label>İş Sahibi Adres:</label>
                            <textarea id="client-address" placeholder="Müvekkil adresi"></textarea>
                        </div>
                    </div>
                    
                    <!-- Adım 4: Tevdi Edilen İş -->
                    <div class="wizard-page" data-page="4">
                        <div class="form-row full-width">
                            <label>Tevdi Edilen İş:</label>
                            <textarea id="case-description" placeholder="İşçilik ücret alacaklarından olan; işçilik ücreti, yıllık ücretli izin alacağı, kıdem tazminatı ve ihbar tazminatı alacaklarına ilişkin arabuluculuk başvurusu yapılması, anlaşamama halinde yetkili iş mahkemesi nezdinde işçilik ücret alacağı davasının açılması işlemidir. "></textarea>
                        </div>
                        <div class="form-row full-width">
                            <label>Gerekilecek Belgeler:</label>
                            <textarea id="required-documents" placeholder="İş sahibi, avukata tevdi ettiği işin yerine getirilebilmesi amacıyla vekaletname, e-devlet şifresi, işe giriş ve çıkış bildirgeleri, hizmet dökümü, adli sicil kaydı, iş sözleşmesi fesih bildirimi vb. yargılamaya esas teşkil edecek her nevi bilgi ve belgeyi avukata teslim eder."></textarea>
                        </div>
                    </div>
                    
                    <!-- Adım 5: Avukatlık Ücreti -->
                    <div class="wizard-page" data-page="5">
                        <div class="form-row">
                            <label>Ödeme Tipi:</label>
                            <select id="payment-type">
                                <option value="tam_pesin">Yargılama Gideri ve Avukatlık Ücretinin Tamamının Peşin Ödemesi</option>
                                <option value="gider_pesin_ucret_taksit">Yargılama Giderinin Peşin ve Avukatlık Ücretinin Taksitli Ödenmesi</option>
                                <option value="gider_taksit_ucret_pesin">Yargılama Giderinin Taksitli ve Avukatlık Ücretinin Peşin Ödenmesi</option>
                                <option value="tam_taksit">Yargılama Gideri ve Avukatlık Ücretinin Taksitli Ödenmesi</option>
                            </select>
                        </div>
                        
                        <div style="display: flex; gap: 15px;">
                            <div class="form-row" style="flex: 1;">
                                <label>Yargılama Sonu Anlaşma:</label>
                                <select id="agreement-option">
                                    <option value="agreement-yes">Yargılama Sonu Anlaşma Oranı Var</option>
                                    <option value="agreement-no">Yargılama Sonu Anlaşma Oranı Yok</option>
                                </select>
                            </div>
                            <div class="form-row" id="agreement-percent-container" style="flex: 1; flex-direction: column;">
                                <label>Anlaşma Oranı (%):</label>
                                <input type="text" id="percent" placeholder="20">
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 15px;">
                            <div class="form-row" style="flex: 1;">
                                <label>Avukatlık Ücreti (Rakamla):</label>
                                <input type="text" id="fee-amount" placeholder="15.000,00 TL">
                            </div>
                            <div class="form-row" style="flex: 1;">
                                <label>Avukatlık Ücreti (Yazıyla):</label>
                                <input type="text" id="fee-text" placeholder="onbeşbintürklirası">
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 15px;">
                            <div class="form-row" style="flex: 1;">
                                <label>Yargılama Gideri (Rakamla):</label>
                                <input type="text" id="court-fee-amount" placeholder="5.000,00 TL">
                            </div>
                            <div class="form-row" style="flex: 1;">
                                <label>Yargılama Gideri (Yazıyla):</label>
                                <input type="text" id="court-fee-text" placeholder="beşbintürklirası">
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 15px;">
                            <div class="form-row" style="flex: 1;">
                                <label>KDV Oranı:</label>
                                <select id="kdv-rate">
                                    <option value="kdv_dahil_1">KDV Dahil %1</option>
                                    <option value="kdv_dahil_10">KDV Dahil %10</option>
                                    <option value="kdv_dahil_20" selected>KDV Dahil %20</option>
                                    <option value="kdv_haric">KDV Hariç</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Taksit Bölümü - Ödeme tipine göre görünürlüğü değişecek -->
                        <div id="installment-section" style="display: none;">
                            <div class="form-row">
                                <label>Taksit Sayısı:</label>
                                <select id="installment-count">
                                    <option value="2">2 Taksit</option>
                                    <option value="3">3 Taksit</option>
                                    <option value="4">4 Taksit</option>
                                    <option value="5">5 Taksit</option>
                                    <option value="6">6 Taksit</option>
                                    <option value="7">7 Taksit</option>
                                    <option value="8">8 Taksit</option>
                                    <option value="9">9 Taksit</option>
                                    <option value="10">10 Taksit</option>
                                    <option value="11">11 Taksit</option>
                                    <option value="12">12 Taksit</option>
                                </select>
                            </div>
                            
                            <div id="installment-dates">
                                <!-- Taksit tarih alanları JavaScript ile eklenecek -->
                            </div>
                        </div>
                        
                        <!-- Taksit bilgileri için açıklama -->
                        <div id="installment-info" class="form-row full-width" style="display: none;">
                            <p style="color: #666; font-size: 13px; margin-top: 10px;">
                                * Taksit tarihleri, sözleşmenin önizleme ve yazdırma aşamasında gösterilecektir.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Adım 6: Genel Hükümler -->
                    <div class="wizard-page" data-page="6">
                        <div class="form-row full-width">
                            <label>Sözleşme Hükümleri:</label>
                            <textarea id="contract-terms" style="height: 300px; min-height: 300px;">
Avukat üzerine aldığı işi kanun hükümleri dairesinde, sonuna kadar takip etmekle yükümlü olup dava hakkında iş sahibine herhangi bir taahhütte bulunmamıştır.
Bu sözleşmeye göre işin sonucu, mahkemece verilen hükmün kesinleşmesiyle son bulur. Avukat, temyizi mümkün kararlarda, hukuki yarar gördüğü ve iş sahibince de gideri karşılandığı takdirde, hükmü Bölge Adliye Mahkemeleri ve Yargıtay nezdinde temyiz ve/veya istinaf eder.
Avukat işi bizzat yapabileceği gibi, vekaletnamede tevkile yetki tanınmış ise, işi başka avukatla birlikte takip edebilir veya başka bir avukata veya avukatlık ortaklığına vererek de işi takip ettirebilir.
Kararlaştırılan avukatlık ücreti yalnızca, yukarıda belirtilen bu işin karşılığı olup, mukabil dava, bağlantı veya ilişkisi bulunsa bile başka dava ve icra kovuşturmaları ile uzlaşmacı avukatlık dahil, her türlü hukuki yardımlar ayrı ücrete tabidir.
Anlaşmaya göre, Avukata peşin olarak verilmesi gereken ücret ödenmezse, Avukat işe başlamak zorunda değildir. Bu sebeple doğabilecek her türlü sorumluluk iş sahibine aittir.
İş Sahibi, Avukatın yazılı olurunu aldıktan sonra başka Avukatı da, işin kovuşturma, soruşturma ve takibine katabilir.
İş sahibi, işten kısmen veya tamamen feragat ettiği veya karşılıklı takas edildiği veya karşı tarafla sulh olduğu, anlaştığı veya avukatı haksız olarak azlettiği takdirde, Avukatlık Asgari Ücret Sözleşmesi marifetiyle belirlenen bedeli avukata ödemekle yükümlüdür.
Avukatlık asgari ücret tarifesi ile 1136 sayılı yasanın ilgili maddeleri gereğince mahkemelerce veya icra müdürlüklerince ödenmesi karşı tarafa yükletilen ücret-i vekalet avukata aittir.
Avukatın zimmetinde iş sahibine ait avans ya da herhangi bir para varsa, iş sonunda vekâlet ücreti alacağı bulunuyorsa Avukat, bu avans veya parayı avukatlık ücretine mahsup edebilir.
Avukata tebliğ edilen işin yapılması veya yapıldıktan sonra sonucun alınması için gerekli bütün vergi, resim, harç, gider ve masraflar, iş sahibinin sorumluluğu altında olup, Avukat tarafından ilk istekte, Avukata veya gerektirdiği yere ödenir.
Harç ve masrafların ödenmesi ile ilgili ve diğer konulardaki isteklerin İş Sahibine ihbarı telefon, faks, e-mail ve diğer iletişim araçları ile yapılabileceği gibi, kişi vasıtası ile de yapılabilir ve haber verilebilir.
İş Sahibinin, sözleşme düzenlenirken beyan ettiği yukarıdaki adrese Avukat tarafından yapılacak her türlü tebliğ kendisine yapılmış sayılır.
İşbu Avukatlık Ücret Sözleşmesi 2(iki) nüsha yapılmış olup, tarafların her bir sayfayı imzaladığı andan itibaren aşağıda belirtilen tarihte geçerlilik kazanır.
Bu sözleşmede hüküm bulunmayan hususlarda sırasıyla, Avukatlık Kanunu ve Yönetmelikleri ile Borçlar vekâlete ilişkin hükümleri uygulanır.
İşbu sözleşmeden doğabilecek her türlü ihtilafta yetkili mercii, Avukatın yukarıdaki ikametgahımdaki icra daireleri ve mahkemelerdir.</textarea>
                        </div>
                    </div>
                    
                    <!-- Adım 7: Önizleme -->
                    <div class="wizard-page" data-page="7">
                        <div class="contract-preview">
                            <h4>AVUKATLIK ÜCRET SÖZLEŞMESİ</h4>
                            <div id="contract-preview-content"></div>
                        </div>
                    </div>
                </div>
                
                <div class="wizard-footer">
                    <button class="prev-step-btn" disabled>Geri</button>
                    <div class="wizard-status">Adım 1/7</div>
                        <button class="next-step-btn">İleri</button>
                        <button class="finish-btn" style="display: none;">Tamamla</button>
                    </div>
                </div>
            
            <style>
                .contract-form-wizard {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .wizard-header {
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                
                .wizard-steps {
                    display: flex;
                    justify-content: space-between;
                }
                
                .wizard-step {
                    font-size: 12px;
                    color: #666;
                    padding: 5px 10px;
                    border-radius: 15px;
                    cursor: default;
                }
                
                .wizard-step.active {
                    background-color: #4a76a8;
                    color: white;
                    font-weight: bold;
                }
                
                .wizard-content {
                    flex: 1;
                    overflow-y: auto;
                    min-height: 400px;
                }
                
                .wizard-page {
                    display: none;
                    padding: 10px;
                }
                
                .wizard-page.active {
                    display: block;
                }
                
                .form-row {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 15px;
                    min-height: 80px;
                    box-sizing: border-box;
                }
                
                .form-row label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                    color: #333;
                }
                
                .form-row input,
                .form-row select,
                .form-row textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                
                .form-row textarea {
                    flex-grow: 1;
                    min-height: 80px;
                }
                
                .form-row.full-width {
                    width: 100%;
                }
                
                .wizard-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 0px;
                    padding-top: 15px;
                    border-top: 1px solid #ddd;
                }
                
                .wizard-footer button {
                    padding: 8px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }
                
                .prev-step-btn {
                    background-color: #6c757d;
                    color: white;
                }
                
                .prev-step-btn:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                
                .next-step-btn, .finish-btn {
                    background-color: #4a76a8;
                    color: white;
                }
                
                .wizard-status {
                    font-size: 14px;
                    color: #666;
                }
                
                h3 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #333;
                }
                
                .contract-preview {
                    border: 1px solid #ddd;
                    padding: 20px;
                    background-color: #f9f9f9;
                    height: 400px;
                    overflow-y: auto;
                }
            </style>
        `;
    }
    
    setupContractFormEvents() {
        const previewButton = document.querySelector('#contract-preview-btn');
        const saveButton = document.querySelector('#contract-save-btn');
        const downloadButton = document.querySelector('#contract-download-btn');
        const nextButtons = document.querySelectorAll('.next-step-btn');
        const prevButtons = document.querySelectorAll('.prev-step-btn');
        const wizardSteps = document.querySelectorAll('.wizard-step');
        const wizardPages = document.querySelectorAll('.wizard-page');
        const finishButton = document.querySelector('.finish-btn');
        const wizardStatus = document.querySelector('.wizard-status');
        const feeAmountInput = document.querySelector('#fee-amount');
        const courtFeeAmountInput = document.querySelector('#court-fee-amount');
        
        // Sayı formatlamak için yardımcı fonksiyon
        const formatNumberInput = (inputElement) => {
            if (!inputElement) return;
            
            inputElement.addEventListener('input', function(e) {
                // Sadece sayıları ve virgülü tut
                let value = this.value.replace(/[^\d,]/g, '');
                
                // Virgül kontrolü
                if (value.indexOf(',') !== -1) {
                    let parts = value.split(',');
                    
                    // Birden fazla virgül varsa sadece ilkini koru
                    if (parts.length > 2) {
                        value = parts[0] + ',' + parts.slice(1).join('');
                    }
                }
                
                // Virgül yoksa ve karakter varsa formatlama yap
                if (value && !value.includes(',')) {
                    // Sayıyı düz olarak al ve formatla
                    const numericValue = value.replace(/\./g, '');
                    const formattedValue = formatNumber(numericValue);
                    this.value = formattedValue;
                } 
                // Virgül varsa, formatı koru
                else if (value.includes(',')) {
                    const parts = value.split(',');
                    const intPart = parts[0].replace(/\./g, '');
                    
                    if (intPart) {
                        const formattedInt = formatNumber(intPart);
                        const decimalPart = parts.length > 1 ? ',' + parts[1] : ',';
                        this.value = formattedInt + decimalPart;
                    } else {
                        this.value = value;
                    }
                } else {
                    this.value = value;
                }
            });
        };
        
        // Bir sayıyı binlik ayırıcılarla formatlayan yardımcı fonksiyon
        const formatNumber = (num) => {
            if (!num) return '';
            
            let result = '';
            let counter = 0;
            
            // Sayıyı sağdan sola doğru işle
            for (let i = num.length - 1; i >= 0; i--) {
                counter++;
                result = num[i] + result;
                
                // Her 3 basamakta bir, binlik ayırıcı ekle
                if (counter % 3 === 0 && i > 0) {
                    result = '.' + result;
                }
            }
            
            return result;
        };
        
        // Avukatlık Ücreti ve Yargılama Gideri alanlarını formatla
        formatNumberInput(feeAmountInput);
        formatNumberInput(courtFeeAmountInput);
        
        // Yargı Türü ve Yargı Birimi arasındaki bağlantıyı kurma
        const jurisdictionTypeSelect = document.querySelector('#jurisdiction-type');
        const jurisdictionUnitSelect = document.querySelector('#jurisdiction-unit');

        // Wizard işlevselliği için değişkenler
        let currentPage = 0;

        // Wizard işlevselliği için yardımcı fonksiyonlar
        const showPage = (pageIndex) => {
            wizardPages.forEach((page, index) => {
                page.style.display = index === pageIndex ? '' : 'none';
                page.classList.toggle('active', index === pageIndex);
            });
            
            // Adım göstergesini güncelle
            if (wizardStatus) {
                wizardStatus.textContent = `Adım ${pageIndex + 1}/${wizardPages.length}`;
            }
            
            // Adım durumlarını güncelle
            wizardSteps.forEach((step, index) => {
                step.classList.toggle('active', index === pageIndex);
            });
            
            // Düğmeleri güncelle
            prevButtons.forEach(btn => {
                btn.disabled = pageIndex === 0;
            });
            
            // Son adıma geçildiğinde (Önizleme adımı)
            if (pageIndex === wizardPages.length - 1) {
                nextButtons.forEach(btn => btn.style.display = 'none');
                if (finishButton) finishButton.style.display = 'block';
                
                // Son adımda önizleme içeriğini güncelle - Özellikle Genel Hükümler kısmında yapılan değişiklikler için
                const contractContent = this.generateContractContent();
                const previewContent = document.querySelector('#contract-preview-content');
                if (previewContent) {
                    previewContent.innerHTML = contractContent;
                }
            } else {
                nextButtons.forEach(btn => btn.style.display = 'block');
                if (finishButton) finishButton.style.display = 'none';
            }

            currentPage = pageIndex;
        };

        // İlk sayfayı etkinleştir
        if (wizardPages.length > 0) {
            showPage(0);
        }
        
        // Avukatlık ücreti aşaması için ödeme tipi değişikliği işleyicisi
        const paymentTypeSelect = document.querySelector('#payment-type');
        const installmentSection = document.querySelector('#installment-section');
        const installmentInfo = document.querySelector('#installment-info');
        
        // Ödeme tipi değişikliğini işle
        const handlePaymentTypeChange = () => {
            if (!paymentTypeSelect || !installmentSection || !installmentInfo) return;
            
            const paymentType = paymentTypeSelect.value;
            const showInstallments = paymentType.includes('taksit'); // Taksit içeren herhangi bir seçenek için
            
            installmentSection.style.display = showInstallments ? 'block' : 'none';
            installmentInfo.style.display = showInstallments ? 'block' : 'none';
            
            // Taksit sayısı değişikliğini tetikle
            if (showInstallments) {
                handleInstallmentCountChange();
            }
        };
        
        // Yargılama Sonu Anlaşma seçeneği değişikliğini işle
        const handleAgreementOptionChange = () => {
            const agreementOption = document.querySelector('#agreement-option');
            const agreementPercentContainer = document.querySelector('#agreement-percent-container');
            
            if (!agreementOption || !agreementPercentContainer) return;
            
            const showAgreementPercent = agreementOption.value === 'agreement-yes';
            agreementPercentContainer.style.display = showAgreementPercent ? 'flex' : 'none';
        };
        
        // Taksit sayısı değişikliğini işle
        const handleInstallmentCountChange = () => {
            const installmentCount = document.querySelector('#installment-count');
            const installmentDates = document.querySelector('#installment-dates');
            
            if (!installmentCount || !installmentDates) return;
            
            const count = parseInt(installmentCount.value);
            installmentDates.innerHTML = ''; // Mevcut taksit alanlarını temizle
            
            // Şimdiki tarih
            const currentDate = new Date();
            
            // Her taksit için tarih alanı ekle
            for (let i = 1; i <= count; i++) {
                // Sonraki ay
                const nextDate = new Date(currentDate);
                nextDate.setMonth(currentDate.getMonth() + i);
                
                // Tarih formatını YYYY-MM-DD olarak ayarla
                const formattedDate = nextDate.toISOString().split('T')[0];
                
                const dateRow = document.createElement('div');
                dateRow.className = 'form-row';
                dateRow.innerHTML = `
                    <label>${i}. Taksit Tarihi:</label>
                    <input type="date" class="installment-date" data-index="${i}" value="${formattedDate}">
                `;
                installmentDates.appendChild(dateRow);
            }
        };
        
        // Ödeme tipi değişiklik event listener ekle
        if (paymentTypeSelect) {
            paymentTypeSelect.addEventListener('change', handlePaymentTypeChange);
            // Sayfa yüklendiğinde varsayılan durumu ayarla
            handlePaymentTypeChange();
        }
        
        // Yargılama Sonu Anlaşma değişiklik event listener ekle
        const agreementOption = document.querySelector('#agreement-option');
        if (agreementOption) {
            agreementOption.addEventListener('change', handleAgreementOptionChange);
            // Sayfa yüklendiğinde varsayılan durumu ayarla
            handleAgreementOptionChange();
        }
        
        // Taksit sayısı değişiklik event listener ekle
        const installmentCount = document.querySelector('#installment-count');
        if (installmentCount) {
            installmentCount.addEventListener('change', handleInstallmentCountChange);
        }

        // Yargı birimlerini tanımlama
        const jurisdictionUnits = {
            'Ceza': [
                'Ağır Ceza Mahkemesi',
                'Asliye Ceza Mahkemesi',
                'Sulh Ceza Hakimliği',
                'İcra Ceza Mahkemesi',
                'Çocuk Mahkemesi',
                'Çocuk Ağır Ceza Mahkemesi',
                'Fikri ve Sınai Haklar Ceza Mahkemesi',
                'İnfaz Hakimliği'
            ],
            'Hukuk': [
                'Asliye Hukuk Mahkemesi',
                'Sulh Hukuk Mahkemesi',
                'Asliye Ticaret Mahkemesi',
                'Tüketici Mahkemesi',
                'İş Mahkemesi',
                'Aile Mahkemesi',
                'Fikri ve Sınai Haklar Hukuk Mahkemesi',
                'Kadastro Mahkemesi'
            ],
            'İcra': [
                'İcra Dairesi',
                'İcra Hukuk Mahkemesi'
            ],
            'İdari Yargı': [
                'İdare Mahkemesi',
                'Vergi Mahkemesi',
                'Bölge İdare Mahkemesi',
                'Danıştay'
            ],
            'Satış Memurluğu': [
                'Satış Memurluğu'
            ],
            'Arabuluculuk': [
                'Arabuluculuk Bürosu'
            ],
            'Cumhuriyet Başsavcılığı': [
                'Cumhuriyet Başsavcılığı',
                'Cumhuriyet Savcılığı'
            ],
            'Tazminat Komisyon Başkanlığı': [
                'Tazminat Komisyon Başkanlığı'
            ]
        };

        // Sayfa yüklendiğinde varsayılan seçenekleri yükleme
        if (jurisdictionTypeSelect && jurisdictionUnitSelect) {
            const updateJurisdictionUnits = () => {
                const selectedType = jurisdictionTypeSelect.value;
                jurisdictionUnitSelect.innerHTML = '';
                
                if (jurisdictionUnits[selectedType]) {
                    jurisdictionUnits[selectedType].forEach(unit => {
                        const option = document.createElement('option');
                        option.value = unit;
                        option.textContent = unit;
                        jurisdictionUnitSelect.appendChild(option);
                    });
                }
            };

            // Sayfa yüklendiğinde ilk yargı birimlerini yükle
            updateJurisdictionUnits();
            
            // Yargı türü değiştiğinde yargı birimlerini güncelle
            jurisdictionTypeSelect.addEventListener('change', updateJurisdictionUnits);
        }

        if (previewButton) {
            previewButton.addEventListener('click', () => {
                const contractContent = this.generateContractContent();
                const previewArea = document.querySelector('#contract-preview');
                if (previewArea) {
                    previewArea.innerHTML = contractContent;
                }
            });
        }

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveContract();
            });
        }

        if (downloadButton) {
        downloadButton.addEventListener('click', () => {
                this.downloadContract();
            });
        }

        // İleri butonu işleyicileri
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentPage < wizardPages.length - 1) {
                    // Mevcut sayfadaki tüm alanları kontrol et
                    const currentWizardPage = wizardPages[currentPage];
                    const requiredInputs = currentWizardPage.querySelectorAll('input, select, textarea');
                    let allFieldsFilled = true;
                    let firstEmptyField = null;
                    
                    requiredInputs.forEach(input => {
                        // Taksit tarihleri, anlaşma oranı gibi koşullu alanları kontrol et
                        let isRequired = true;
                        
                        // Taksit tarihi alanları ve anlaşma oranı kontrolü
                        if (input.id === 'percent') {
                            const agreementOption = document.querySelector('#agreement-option');
                            if (agreementOption && agreementOption.value === 'agreement-no') {
                                isRequired = false;
                            }
                        }
                        
                        // Koşula bağlı görünümde olmayan taksit alanlarını kontrol etme
                        if (input.closest('#installment-section') && 
                            document.querySelector('#installment-section').style.display === 'none') {
                            isRequired = false;
                        }
                        
                        // Alanın değerini kontrol et
                        if (isRequired && (input.value === '' || input.value === null)) {
                            allFieldsFilled = false;
                            if (!firstEmptyField) {
                                firstEmptyField = input;
                            }
                        }
                    });
                    
                    if (allFieldsFilled) {
                        showPage(currentPage + 1);
                    } else {
                        alert('Lütfen tüm alanları doldurunuz.');
                        if (firstEmptyField) {
                            firstEmptyField.focus();
                        }
                    }
                }
            });
        });

        // Geri butonu işleyicileri
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentPage > 0) {
                    showPage(currentPage - 1);
                }
            });
        });

        // Adım numaralarına tıklama ile geçiş
        wizardSteps.forEach((step, index) => {
            step.addEventListener('click', () => {
                // Geriye doğru geçişlerde kontrol yapma
                if (index < currentPage) {
                    showPage(index);
                    return;
                }
                
                // İleriye doğru geçişlerde kontrol yap
                // Mevcut adımdan hedef adıma kadar tüm adımları kontrol et
                let canProceed = true;
                let firstIncompleteStep = -1;
                
                for (let i = currentPage; i < index; i++) {
                    const pageToCheck = wizardPages[i];
                    const requiredInputs = pageToCheck.querySelectorAll('input, select, textarea');
                    let allFieldsFilled = true;
                    
                    requiredInputs.forEach(input => {
                        // Taksit tarihleri, anlaşma oranı gibi koşullu alanları kontrol et
                        let isRequired = true;
                        
                        // Taksit tarihi alanları ve anlaşma oranı kontrolü
                        if (input.id === 'percent') {
                            const agreementOption = document.querySelector('#agreement-option');
                            if (agreementOption && agreementOption.value === 'agreement-no') {
                                isRequired = false;
                            }
                        }
                        
                        // Koşula bağlı görünümde olmayan taksit alanlarını kontrol etme
                        if (input.closest('#installment-section') && 
                            document.querySelector('#installment-section').style.display === 'none') {
                            isRequired = false;
                        }
                        
                        // Alanın değerini kontrol et
                        if (isRequired && (input.value === '' || input.value === null)) {
                            allFieldsFilled = false;
                        }
                    });
                    
                    if (!allFieldsFilled) {
                        canProceed = false;
                        if (firstIncompleteStep === -1) {
                            firstIncompleteStep = i;
                        }
                    }
                }
                
                if (canProceed) {
                    showPage(index);
                } else {
                    alert(`Lütfen adım ${firstIncompleteStep + 1}'deki tüm alanları doldurunuz.`);
                    showPage(firstIncompleteStep);
                }
            });
        });

        // Tamamla butonu işleyicisi
        if (finishButton) {
            finishButton.addEventListener('click', () => {
                this.saveContract();
                this.downloadContract();
            });
        }
    }
    
    generateContractContent() {
        const lawyerAddress = document.querySelector('#lawyer-address')?.value || '[Avukat Adresi]';
        const lawyerName = document.querySelector('#lawyer-name')?.value || '[Avukat Adı]';
        const lawyerBar = document.querySelector('#lawyer-bar')?.value || '[Avukat Barosu]';
        const lawyerBarId = document.querySelector('#lawyer-bar-id')?.value || '[Sicil No]';
        const clientName = document.querySelector('#client-name')?.value || '[Müvekkil Adı]';
        const clientId = document.querySelector('#client-id')?.value || '[TC/Vergi No]';
        const clientPhone = document.querySelector('#client-phone')?.value || '[Telefon]';
        const clientAddress = document.querySelector('#client-address')?.value || '[Müvekkil Adresi]';
        const caseDescription = document.querySelector('#case-description')?.value || '[İş Tanımı]';
        const feeAmount = document.querySelector('#fee-amount')?.value || '[Ücret]';
        const feeText = document.querySelector('#fee-text')?.value || '[Ücret Yazıyla]';
        const courtFeeAmount = document.querySelector('#court-fee-amount')?.value || '[Yargılama Gideri]';
        const courtFeeText = document.querySelector('#court-fee-text')?.value || '[Yargılama Gideri Yazıyla]';
        const requiredDocs = document.querySelector('#required-documents')?.value || '[Gerekli Belgeler]';
        const percent = document.querySelector('#percent')?.value || '[İş Sonu Anlaşma Oranı]';
        
        // Anlaşma seçeneği
        const agreementOption = document.querySelector('#agreement-option')?.value || 'agreement-yes';
        const hasAgreementPercent = agreementOption === 'agreement-yes';
        
        // Ödeme tipi ve KDV bilgisi
        const paymentType = document.querySelector('#payment-type')?.value || 'full_pesin';
        const kdvRate = document.querySelector('#kdv-rate')?.value || 'dahil_20';
        
        // Taksit bilgilerini al
        let installmentText = '';
        if (paymentType.includes('taksit')) {
            const installmentCount = document.querySelector('#installment-count')?.value || '2';
            const installmentDates = document.querySelectorAll('.installment-date');
            
            if (installmentDates.length > 0) {
                installmentText = '<p><strong>Taksit Planı:</strong></p><ul>';
                
                // Ödeme tipine göre taksitlendirilecek miktarı belirle
                let taksitlendirilecekUcret = 0;
                let taksitlendirilecekGider = 0;
                
                if (paymentType === 'tam_taksit') {
                    // Hem avukatlık ücreti hem yargılama gideri taksitlendirilecek
                    taksitlendirilecekUcret = parseFloat(feeAmount.replace(/[^0-9,]/g, '').replace(',', '.'));
                    taksitlendirilecekGider = parseFloat(courtFeeAmount.replace(/[^0-9,]/g, '').replace(',', '.'));
                } else if (paymentType === 'gider_pesin_ucret_taksit') {
                    // Sadece avukatlık ücreti taksitlendirilecek
                    taksitlendirilecekUcret = parseFloat(feeAmount.replace(/[^0-9,]/g, '').replace(',', '.'));
                } else if (paymentType === 'gider_taksit_ucret_pesin') {
                    // Sadece yargılama gideri taksitlendirilecek
                    taksitlendirilecekGider = parseFloat(courtFeeAmount.replace(/[^0-9,]/g, '').replace(',', '.'));
                }
                
                const taksitSayisi = installmentDates.length;
                
                // Her taksit için avukatlık ücreti ve yargılama gideri miktarını hesapla
                const taksitUcretTutari = taksitlendirilecekUcret / taksitSayisi;
                const taksitGiderTutari = taksitlendirilecekGider / taksitSayisi;
                
                const formatliTaksitUcretTutari = taksitUcretTutari.toLocaleString('tr-TR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                });
                
                const formatliTaksitGiderTutari = taksitGiderTutari.toLocaleString('tr-TR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                });
                
                installmentDates.forEach((date, index) => {
                    const taksitTarihi = new Date(date.value);
                    const formatliTarih = taksitTarihi.toLocaleDateString('tr-TR');
                    let taksitDetay = `<li>${index + 1}. Taksit - Ödeme Tarihi: ${formatliTarih} - `;
                    
                    if (paymentType === 'tam_taksit') {
                        taksitDetay += `Avukatlık Ücreti: ${formatliTaksitUcretTutari} TL, Yargılama Gideri: ${formatliTaksitGiderTutari} TL`;
                    } else if (paymentType === 'gider_pesin_ucret_taksit') {
                        taksitDetay += `Avukatlık Ücreti: ${formatliTaksitUcretTutari} TL`;
                    } else if (paymentType === 'gider_taksit_ucret_pesin') {
                        taksitDetay += `Yargılama Gideri: ${formatliTaksitGiderTutari} TL`;
                    }
                    
                    taksitDetay += `</li>`;
                    installmentText += taksitDetay;
                });
                
                installmentText += '</ul>';
            }
        }
        
        // Ödeme tipi açıklaması
        let paymentTypeText = '';
        switch(paymentType) {
            case 'tam_pesin':
                paymentTypeText = 'Yargılama Gideri ve Avukatlık Ücretinin Tamamının Peşin Ödemesi';
                break;
            case 'gider_pesin_ucret_taksit':
                paymentTypeText = 'Yargılama Giderinin Peşin ve Avukatlık Ücretinin Taksitli Ödenmesi';
                break;
            case 'gider_taksit_ucret_pesin':
                paymentTypeText = 'Yargılama Giderinin Taksitli ve Avukatlık Ücretinin Peşin Ödenmesi';
                break;
            case 'tam_taksit':
                paymentTypeText = 'Yargılama Gideri ve Avukatlık Ücretinin Taksitli Ödenmesi';
                break;
            default:
                paymentTypeText = 'Peşin Ödeme';
        }
        
        // KDV oranı açıklaması
        let kdvText = '';
        switch(kdvRate) {
            case 'kdv_dahil_1':
                kdvText = 'KDV Dahil %1';
                break;
            case 'kdv_dahil_10':
                kdvText = 'KDV Dahil %10';
                break;
            case 'kdv_dahil_20':
                kdvText = 'KDV Dahil %20';
                break;
            case 'kdv_haric':
                kdvText = 'KDV Hariç';
                break;
            default:
                kdvText = 'KDV Dahil %20';
        }
        
        // Genel Hükümler bölümünden sözleşme hükümlerini al
        const contractTerms = document.querySelector('#contract-terms')?.value;
        
        // Sözleşme hükümlerini düzenle
        let formattedTerms = '';
        if (contractTerms) {
            // Textarea'dan gelen metni satır satır işle
            const lines = contractTerms.split('\n');
            
            // Her satırı bir madde olarak formatlayarak ekle
            lines.forEach((line, index) => {
                if (line.trim() !== '') {
                    formattedTerms += `<li>${line.trim()}</li>\n`;
                }
            });
        } else {
            // Varsayılan sözleşme maddeleri
            formattedTerms = `
                <li>Avukat üzerine aldığı işi kanun hükümleri dairesinde, sonuna kadar takip etmekle yükümlü olup dava hakkında iş sahibine herhangi bir taahhütte bulunmamıştır.</li>
                <li>Bu sözleşmeye göre işin sonucu, mahkemece verilen hükmün kesinleşmesiyle son bulur. Avukat, temyizi mümkün kararlarda, hukuki yarar gördüğü ve iş sahibince de gideri karşılandığı takdirde, hükmü Bölge Adliye Mahkemeleri ve Yargıtay nezdinde temyiz ve/veya istinaf eder. Gerek Bölge Adliye Mahkemelerinde 
                istinaf ve gerekse Yargıtay'da temyiz duruşmalı istendiği takdirde, avukatın duruşmalara katılabilmesi için; yukarıda kararlaştırılan avukatlık ücretlerinden 
                ayrı olarak, Asgari Ücret Tarifesinin İkinci Kısım ve ikinci bölümündeki "Yargıtay, Danıştay, Askeri Yargıtay ve Sayıştay'da temyiz yolu ile görülen işlerin 
                duruşması için belirtilen ücretten aşağı olmamak üzere, ayrıca ücret ve masraflar peşin olarak ödenmedikçe, belirtilen yasa yollarındaki duruşmalarına gidilmez. 
                İş sahibi isterse, buralara kendisi katılabilir. İcra müdürlüğünden aciz vesikası alınması işin bitmesi anlamındadır.</li>
                <li>Avukat işi bizzat yapabileceği gibi, vekaletnamede tevkile yetki tanınmış ise, işi başka avukatla birlikte takip edebilir veya başka bir avukata veya 
                avukatlık ortaklığına vererek de işi takip ettirebilir. Keza, 1136 sayılı kanunun 56. Maddesine 4667 S.Y eklenen beşinci fıkrası gereğince yetki belgesi de 
                verebilir. Bundan dolayı iş sahibinden ayrı bir ücret istenmez.</li>
                <li>Kararlaştırılan avukatlık ücreti yalnızca, yukarıda belirtilen bu işin karşılığı olup, mukabil dava, bağlantı veya ilişkisi bulunsa bile başka dava ve 
                icra kovuşturmaları ayrı ücretlere tabidir. Paylaştırma, ortaklığın giderilmesi, men-i müdahale, tahliye 
                gibi davalarda, mahkeme kıymet takdiri, itiraz ve satış ile kararın icradaki infazı aşamaları ayrı ücretlere tabidir. Bu gibi bir önceki aşamanın doğal sonucu 
                niteliğindeki durumlarda; sonraki bir aşamada davanın özelliği gereği olarak yazılı anlaşma olmadan işe başlanılması, iş sahibinin sözlü olurunun varlığını 
                gösterir. Avukat bu aşamalar için müvekkilinden, işin tamamlandığı tarihteki o işin asgari ücreti kadar ücrete ayrıca hak kazanır. Karşı taraftan alınan ücret-i 
                vekalet varsa bu da avukata aittir.</li>
                <li>Anlaşmaya göre, Avukata peşin olarak verilmesi gereken ücret ödenmezse, Avukat işe başlamak zorunda değildir. Bu sebeple doğabilecek her türlü sorumluluk 
                iş sahibine aittir. Bu sözleşmedeki ödeme şartlarımın yerine getirilmemesinden dolayı, Avukat işi takip etmekten ve sonucu elde etmekten mahrum kalırsa, 
                sorumluluk bakımından aynı hüküm uygulanır.</li>
                <li>İş Sahibi, Avukatın yazılı olurunu aldıktan sonra başka Avukatı da, işin kovuşturma, soruşturma ve takibine katabilir. Aksine davranıldığında, avukatın 
                olur vermemesi halinde, Avukat üzerine aldığı işten ayrılabilir ve bu ücret sözleşmesinde gösterilen ücretin tamamıma hak kazanır ve ücret muaccel hale gelir. 
                Bunun için ayrıca ihbar ve ihtar çekmeye gerek yoktur. Avukatın, işe katılan yenı avukatı kabul etmediğini yazılı olarak iş sahibine bildirmesi yeterlidir.</li>
                <li>İş sahibi, işten kısmen veya tamamen feragat ettiği veya karşılıklı takas edildiği veya karşı tarafla sulh olduğu, anlaştığı veya avukatı haksız olarak azlettiği takdirde, Avukatlık Asgari Ücret Sözleşmesi marifetiyle belirlenen bedeli avukata ödemekle yükümlüdür.
Avukatlık asgari ücret tarifesi ile 1136 sayılı yasanın ilgili maddeleri gereğince mahkemelerce veya icra müdürlüklerince ödenmesi karşı tarafa yükletilen ücret-i vekalet avukata aittir.
Avukatın zimmetinde iş sahibine ait avans ya da herhangi bir para varsa, iş sonunda vekâlet ücreti alacağı bulunuyorsa Avukat, bu avans veya parayı avukatlık ücretine mahsup edebilir.
Avukata tebliğ edilen işin yapılması veya yapıldıktan sonra sonucun alınması için gerekli bütün vergi, resim, harç, gider ve masraflar, iş sahibinin sorumluluğu altında olup, Avukat tarafından ilk istekte, Avukata veya gerektirdiği yere ödenir.
Harç ve masrafların ödenmesi ile ilgili ve diğer konulardaki isteklerin İş Sahibine ihbarı telefon, faks, e-mail ve diğer iletişim araçları ile yapılabileceği gibi, kişi vasıtası ile de yapılabilir ve haber verilebilir.
İş Sahibinin, sözleşme düzenlenirken beyan ettiği yukarıdaki adrese Avukat tarafından yapılacak her türlü tebliğ kendisine yapılmış sayılır.
İşbu Avukatlık Ücret Sözleşmesi 2(iki) nüsha yapılmış olup, tarafların her bir sayfayı imzaladığı andan itibaren aşağıda belirtilen tarihte geçerlilik kazanır.
Bu sözleşmede hüküm bulunmayan hususlarda sırasıyla, Avukatlık Kanunu ve Yönetmelikleri ile Borçlar vekâlete ilişkin hükümleri uygulanır.
İşbu sözleşmeden doğabilecek her türlü ihtilafta yetkili mercii, Avukatın yukarıdaki ikametgahımdaki icra daireleri ve mahkemelerdir.</li>
            `;
        }

        return `
            <p>${lawyerAddress} adresinde bürosu bulunan Avukat ${lawyerName} ile aşağıda isim ve adresi yazılı bulunan iş sahip(leri) arasında, avukata 
            verilen iş çerçevesinde ücret sözleşmesi düzenlenmiştir.</p>
            
            <p><strong>Avukat:</strong> ${lawyerName} - ${lawyerBar} (Sicil No: ${lawyerBarId})<br>
            ${lawyerAddress}</p>
            
            <p><strong>İş Sahibi:</strong> ${clientName} (T.C. ${clientId})<br>
            <strong>Telefon:</strong> ${clientPhone}<br>
            ${clientAddress}</p>
            
            <p><strong>Tevdi Edilen İş:</strong> ${caseDescription}</p>
            
            <p><strong>Avukatlık Ücreti ve Ödeme Şekli:</strong> İş sahibi, ${paymentTypeText} şeklinde ve ${kdvText} olarak
            avukatlık ücreti olarak toplam ${feeAmount} TL (${feeText}) ve yargılama gideri olarak toplam ${courtFeeAmount} TL (${courtFeeText}) ödemeyi kabul ve taahhüt eder.${hasAgreementPercent ? ` Yapılacak yargılama sonucunda iş sahibi lehine ödenmesine hükmedilen dava bedelinin %${percent} oranında ayrıca avukatlık ücreti ödemesi yapılır.` : ''}</p>
            
            ${installmentText}
            
            <p><strong>Getirilecek Belgeler:</strong> ${requiredDocs}</p>
            
            <p><strong>Sözleşme Hükümleri:</strong></p>
            <ol>
                ${formattedTerms}
            </ol>
        `;
    }
    
    saveContract() {
        // Sözleşme içeriğini oluştur
        const contractContent = this.generateContractContent();
        const clientName = document.querySelector('#client-name')?.value || 'İsimsiz Müvekkil';
        
        // Yeni sözleşme objesi
        const newContract = {
            id: Date.now(),
            clientName: clientName,
            createdAt: new Date().toISOString(),
            content: contractContent,
            lawyerName: document.querySelector('#lawyer-name')?.value,
            caseDescription: document.querySelector('#case-description')?.value
        };
        
        // Mevcut sözleşmeleri al
        chrome.storage.local.get('contracts', (result) => {
            const contracts = result.contracts || [];
            
            // Yeni sözleşmeyi ekle
            contracts.push(newContract);
            
            // Veritabanına kaydet
            chrome.storage.local.set({ contracts }, () => {
                alert('Sözleşme başarıyla kaydedildi!');
                
                // Popup'ı kapat
                const popupContainer = document.querySelector('.quick-petition-viewer-container');
                if (popupContainer) {
                    document.body.removeChild(popupContainer);
                }
                
                // Sözleşme listesini güncelle
                this.loadContractsData();
                
                // Sözleşme kartları olaylarını ayarla
                setTimeout(() => {
                    this.setupContractCardEvents();
                }, 300);
            });
        });
    }
    
    downloadContract() {
        // Sözleşme içeriğini oluştur
        const contractContent = this.generateContractContent();
        const clientName = document.querySelector('#client-name')?.value || 'İsimsiz Müvekkil';
        const date = new Date().toLocaleDateString('tr-TR');
        
        // HTML dosyası için tam içerik
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Avukatlık Ücret Sözleşmesi - ${clientName}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    line-height: 1.5;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .date {
                    text-align: right;
                    margin-bottom: 20px;
                }
                .signature-container {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 50px;
                }
                .signature {
                    text-align: center;
                    width: 45%;
                }
                .signature-line {
                    border-top: 1px solid #000;
                    margin: 50px 0 10px 0;
                }
                @media print {
                    body {
                        margin: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="date">Tarih: ${date}</div>
            <h1>AVUKATLIK ÜCRET SÖZLEŞMESİ</h1>
            <div class="content">
                ${contractContent}
            </div>
            
            <div class="signature-container">
                <div class="signature">
                    <div class="signature-line"></div>
                    <p>İş Sahibi<br>${clientName}</p>
                </div>
                <div class="signature">
                    <div class="signature-line"></div>
                    <p>Avukat<br>${document.querySelector('#lawyer-name')?.value || 'Bahittin Furkan TOROS'}</p>
                </div>
            </div>
        </body>
        </html>
        `;
        
        // Dosya adı oluştur
        const formattedDate = date.replace(/\//g, '-');
        const fileName = `Avukatlık_Sözleşmesi_${clientName.replace(/\s+/g, '_')}_${formattedDate}.html`;
        
        // Dosyayı indir
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    showPetitionEditor(petition, index) {
        // Popup container oluştur
        const popupContainer = document.createElement('div');
        popupContainer.className = 'quick-petition-editor-container';
        
        // Popup içeriği
        popupContainer.innerHTML = `
            <div class="quick-petition-popup">
                <div class="quick-petition-header">
                    <h3>DİLEKÇE DÜZENLEME</h3>
                    <div class="quick-petition-close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                
                <div class="quick-petition-content">
                    <div class="form-group">
                        <label>Mahkeme Bilgisi:</label>
                        <input type="text" class="petition-mahkeme" value="${petition.mahkeme}">
                    </div>
                    
                    <div class="form-group">
                        <label>Dosya No:</label>
                        <input type="text" class="petition-dava-no" value="${petition.davaNo}">
                    </div>
                    
                    <div class="form-group">
                        <label>Dilekçe Türü:</label>
                        <input type="text" class="petition-type" value="${petition.type}">
                    </div>
                    
                    <div class="form-group">
                        <label>Dilekçe İçeriği:</label>
                        <div class="editor-toolbar">
                            <button type="button" data-action="bold"><i class="fas fa-bold"></i></button>
                            <button type="button" data-action="italic"><i class="fas fa-italic"></i></button>
                            <button type="button" data-action="underline"><i class="fas fa-underline"></i></button>
                            <select data-action="fontSize">
                                <option value="1">Küçük</option>
                                <option value="2">Normal</option>
                                <option value="3" selected>Orta</option>
                                <option value="4">Büyük</option>
                                <option value="5">Daha Büyük</option>
                            </select>
                            <button type="button" data-action="justifyLeft"><i class="fas fa-align-left"></i></button>
                            <button type="button" data-action="justifyCenter"><i class="fas fa-align-center"></i></button>
                            <button type="button" data-action="justifyRight"><i class="fas fa-align-right"></i></button>
                        </div>
                        <div class="petition-content-wrapper">
                            <div class="petition-content" contenteditable="true">${petition.content}</div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button class="update-petition-btn" data-index="${index}">Güncelle</button>
                        <button class="download-petition-btn">İndir</button>
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
        
        // Güncelle butonuna tıklama olayı
        const updateButton = popupContainer.querySelector('.update-petition-btn');
        updateButton.addEventListener('click', () => {
            const updatedPetition = {
                mahkeme: popupContainer.querySelector('.petition-mahkeme').value,
                davaNo: popupContainer.querySelector('.petition-dava-no').value,
                type: popupContainer.querySelector('.petition-type').value,
                content: popupContainer.querySelector('.petition-content').innerHTML,
                date: petition.date
            };
            
            this.updatePetition(updatedPetition, index);
            document.body.removeChild(popupContainer);
        });
        
        // İndir butonuna tıklama olayı
        const downloadButton = popupContainer.querySelector('.download-petition-btn');
        downloadButton.addEventListener('click', () => {
            const updatedPetition = {
                mahkeme: popupContainer.querySelector('.petition-mahkeme').value,
                davaNo: popupContainer.querySelector('.petition-dava-no').value,
                type: popupContainer.querySelector('.petition-type').value,
                content: popupContainer.querySelector('.petition-content').innerHTML,
                date: new Date().toLocaleDateString('tr-TR')
            };
            
            this.downloadPetitionAsUDF(updatedPetition);
        });
    }
    
    updatePetition(updatedPetition, index) {
        chrome.storage.local.get(['savedPetitions'], (result) => {
            const savedPetitions = result.savedPetitions || [];
            
            if (savedPetitions[index] && savedPetitions[index].type === 'petition') {
                savedPetitions[index].data = updatedPetition;
                
                chrome.storage.local.set({ savedPetitions }, () => {
                    this.loadPetitionsData();
                    alert('Dilekçe başarıyla güncellendi.');
                });
            }
        });
    }
    
    downloadPetitionAsUDF(petition) {
        // UDF formatı için basit bir yapı
        const udfContent = `UYAP_DILEKCE_FORMAT_1.0
MAHKEME: ${petition.mahkeme}
DOSYA_NO: ${petition.davaNo}
DILEKCE_TURU: ${petition.type}
TARIH: ${new Date().toLocaleDateString('tr-TR')}
ICERIK_BASLANGIC
${petition.content.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')}
ICERIK_BITIS`;
        
        // Dosya oluştur ve indir
        const blob = new Blob([udfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Dilekce_${petition.davaNo.replace(/\//g, '_')}_${new Date().toISOString().replace(/[-:.]/g, '')}.udf`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
    
    displayCaseNotes() {
        const container = document.querySelector('.case-notes-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.caseNotes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'case-note-card';
            noteElement.dataset.id = note.id;
            noteElement.style.backgroundColor = this.getRandomNoteColor();
            
            noteElement.innerHTML = `
                <div class="case-note-content">
                    <p>${note.text}</p>
                </div>
                <div class="case-note-actions">
                    <button class="edit-note-btn" data-id="${note.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-note-btn" data-id="${note.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            container.appendChild(noteElement);
            
            // Event listeners
            const editBtn = noteElement.querySelector('.edit-note-btn');
            const deleteBtn = noteElement.querySelector('.delete-note-btn');
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editCaseNote(note.id);
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteCaseNote(note.id);
            });
        });
    }
    
    addCaseNote(text) {
        const newNote = {
            id: Date.now(),
            text: text,
            createdAt: new Date().toISOString(),
            color: this.getRandomNoteColor()
        };
        
        this.caseNotes.unshift(newNote);
        localStorage.setItem('uyap_asistan_case_notes', JSON.stringify(this.caseNotes));
        this.displayCaseNotes();
    }
    
    editCaseNote(id) {
        const note = this.caseNotes.find(note => note.id == id);
        if (!note) return;
        
        const newText = prompt('Notu düzenle:', note.text);
        if (newText !== null && newText.trim() !== '') {
            note.text = newText.trim();
            localStorage.setItem('uyap_asistan_case_notes', JSON.stringify(this.caseNotes));
            this.displayCaseNotes();
        }
    }
    
    deleteCaseNote(id) {
        if (confirm('Bu notu silmek istediğinize emin misiniz?')) {
            this.caseNotes = this.caseNotes.filter(note => note.id != id);
            localStorage.setItem('uyap_asistan_case_notes', JSON.stringify(this.caseNotes));
            this.displayCaseNotes();
        }
    }
    
    filterCaseNotes(query) {
        const container = document.querySelector('.case-notes-grid');
        if (!container) return;
        
        const notes = container.querySelectorAll('.case-note-card');
        
        if (!query) {
            notes.forEach(note => note.style.display = 'block');
            return;
        }
        
        const lowerQuery = query.toLowerCase();
        notes.forEach(note => {
            const text = note.querySelector('p').textContent.toLowerCase();
            if (text.includes(lowerQuery)) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
            }
        });
    }
    
    getRandomNoteColor() {
        // Sabit renk: Açık mavi (RGB: 176, 224, 230) - Powderblue
        return 'rgb(176, 224, 230)';
    }

    setupCaseNotesEvents() {
        const searchInput = document.querySelector('.case-notes-search-input');
        const addInput = document.querySelector('.case-notes-add-input');
        const addButton = document.querySelector('.add-case-note-btn');

        // Notları görüntüle
        this.displayCaseNotes();
        
        // Not arama
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterCaseNotes(searchInput.value);
            });
        }

        // Yeni not ekleme
        if (addButton && addInput) {
            addButton.addEventListener('click', () => {
                const noteText = addInput.value.trim();
                if (noteText) {
                    this.addCaseNote(noteText);
                    addInput.value = '';
                }
            });

            addInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const noteText = addInput.value.trim();
                    if (noteText) {
                        this.addCaseNote(noteText);
                        addInput.value = '';
                    }
                }
            });
        }
    }
    
    setupReportsEvents() {
        // İleride raporlar bölümü için gerekli olacak temel işlevler
        const reportsContainer = document.getElementById('reports-container');
        if (reportsContainer) {
            // Raporlar bölümünün temel yapısını hazırla
            const placeholder = reportsContainer.querySelector('.reports-placeholder');
            if (placeholder) {
                placeholder.style.textAlign = 'center';
                placeholder.style.padding = '30px';
                placeholder.style.color = '#666';
            }
        }
    }
    
    loadCaseNotes() {
        try {
        // LocalStorage'dan notları yükle
        this.caseNotes = JSON.parse(localStorage.getItem('uyap_asistan_case_notes') || '[]');
        
        // Eğer notlar boşsa, varsayılan notları ekle
        if (this.caseNotes.length === 0) {
            const defaultNotes = [
                "Delil dilekçesi gönderildi.",
                "Islah dilekçesi gönderildi.",
                "Taşınır haczi yapıldı.",
                "Taşınmaz haczi yapıldı.",
                "Fiili haciz yapıldı.",
                "Tanık listesi gönderildi.",
                "Tanıklık ücreti yatırıldı.",
                "Bilirkişi ücreti yatırıldı.",
                "Keşif yapıldı.",
                "Keşif ücreti yatırıldı.",
                "Savunma dilekçesi gönderildi.",
                "İstinaf dilekçesi gönderildi.",
                "Temyiz dilekçesi gönderildi.",
                "Islah harcı yatırıldı.",
                "Karar aşamasına gelindi.",
                "Duruşma ertelendi.",
                "İtiraz dilekçesi sunuldu.",
                "İhtarname gönderildi.",
                "İcra emri tebliğ edildi.",
                "Haciz ihbarnamesi gönderildi.",
                "Mal beyanında bulunuldu.",
                "İhtiyati tedbir kararı alındı.",
                "İhtiyati haciz kararı alındı.",
                "Tensip tutanağı hazırlandı.",
                "Ön inceleme duruşması yapıldı.",
                "Tahkikat aşamasına geçildi.",
                "Sözlü savunma yapıldı.",
                "Dosya üzerinden karar verildi.",
                "Ara karar oluşturuldu.",
                "Reddi hakim talebinde bulunuldu.",
                "Süre uzatım dilekçesi verildi.",
                "Hüküm açıklandı.",
                "Gerekçeli karar tebliğ edildi.",
                "Cevap dilekçesi hazırlandı.",
                "Tanık beyanı alındı.",
                "Bilirkişi raporu tebliğ edildi.",
                "Dosya incelendi.",
                "Vekaletname sunuldu.",
                "Duruşma hazırlık notları hazırlandı.",
                "Ücret sözleşmesi imzalandı.",
                "Avukat değişikliği yapıldı.",
                "Dosyanın işlemden kaldırılması istendi.",
                "Teminat yatırıldı.",
                "Feragat dilekçesi verildi.",
                "Sulh anlaşması imzalandı.",
                "Dava dilekçesi hazırlandı.",
                "Bilirkişi itiraz dilekçesi hazırlandı.",
                "Duruşma tutanağı incelendi.",
                "Harç yatırıldı.",
                    "Masraf avansı yatırıldı."
            ];
            
            this.caseNotes = defaultNotes.map(text => {
                return {
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    text: text,
                    createdAt: new Date().toISOString(),
                    color: this.getRandomNoteColor()
                };
            });
            
            localStorage.setItem('uyap_asistan_case_notes', JSON.stringify(this.caseNotes));
            }
        } catch (error) {
            console.error('Dava notları yüklenirken hata oluştu:', error);
            this.caseNotes = [];
        }
    }

    showPetitionViewer(petition) {
        // Popup container oluştur
        const popupContainer = document.createElement('div');
        popupContainer.className = 'quick-petition-viewer-container';
        
        // Popup içeriği
        popupContainer.innerHTML = `
            <div class="quick-petition-popup">
                <div class="quick-petition-header">
                    <h3>DİLEKÇE GÖRÜNTÜLEME</h3>
                    <div class="quick-petition-close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                
                <div class="quick-petition-content">
                    <div class="petition-view">
                        <div class="petition-info">
                            <p><strong>Dilekçe Türü:</strong> ${petition.type}</p>
                            <p><strong>Mahkeme:</strong> ${petition.mahkeme}</p>
                            <p><strong>Dosya No:</strong> ${petition.davaNo}</p>
                            <p><strong>Tarih:</strong> ${new Date(petition.date).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div class="petition-content-viewer">
                            ${petition.content}
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button class="download-petition-btn">İndir</button>
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
        
        // İndir butonuna tıklama olayı
        const downloadButton = popupContainer.querySelector('.download-petition-btn');
        downloadButton.addEventListener('click', () => {
            this.downloadPetitionAsUDF(petition);
        });
    }

    // Müvekkilleri aranan metne göre filtrele
    filterClients(searchText) {
        // Arama işlevi kaldırıldı
        return;
    }

    generateMeetingNotesForm() {
        return `
            <div class="meeting-note-form-wizard">
                <div class="wizard-header">
                    <div class="wizard-steps">
                        <div class="wizard-step active" data-step="1">1. Tutanak Özellikleri</div>
                        <div class="wizard-step" data-step="2">2. Avukat Bilgileri</div>
                        <div class="wizard-step" data-step="3">3. Müvekkil Bilgileri</div>
                        <div class="wizard-step" data-step="4">4. Avukat Sözü</div>
                        <div class="wizard-step" data-step="5">5. Müvekkil Sözü</div>
                        <div class="wizard-step" data-step="6">6. Genel Hükümler</div>
                        <div class="wizard-step" data-step="7">7. Önizleme</div>
                    </div>
                </div>
                
                <div class="wizard-content">
                    <!-- Adım 1: Tutanak Özellikleri -->
                    <div class="wizard-page active" data-page="1">
                        <div class="form-row full-width">
                            <label>Tutanak Tipi:</label>
                            <select id="meeting-type">
                                <option value="ilk_gorusme">İlk Görüşme Tutanağı</option>
                                <option value="dava_sonrasi">Dava Sonrası Görüşme</option>
                                <option value="uzlasma">Uzlaşma Görüşmesi</option>
                                <option value="bilgilendirme">Bilgilendirme Toplantısı</option>
                                <option value="diger">Diğer</option>
                            </select>
                        </div>
                        <div class="form-row full-width">
                            <label>Görüşme Yeri:</label>
                            <input type="text" id="meeting-location" placeholder="Avukat Bürosu, İstanbul" required>
                        </div>
                        <div class="form-row full-width">
                            <label>Görüşme Tarihi:</label>
                            <input type="date" id="meeting-date" value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                        <div class="form-row full-width">
                            <label>Görüşme Saati:</label>
                            <input type="time" id="meeting-time" value="${new Date().toTimeString().slice(0, 5)}" required>
                        </div>
                    </div>
                    
                    <!-- Adım 2: Avukat Bilgileri -->
                    <div class="wizard-page" data-page="2">
                        <div class="form-row full-width">
                            <label>Avukat Adı Soyadı:</label>
                            <input type="text" id="lawyer-name" placeholder="Avukat adı soyadı" required>
                        </div>
                        <div class="form-row full-width">
                            <label>Avukat Barosu:</label>
                            <input type="text" id="lawyer-bar" placeholder="Barosu" required>
                        </div>
                        <div class="form-row full-width">
                            <label>Avukat Baro Sicil No:</label>
                            <input type="text" id="lawyer-bar-id" placeholder="Baro sicil numarası" required>
                        </div>
                        <div class="form-row full-width">
                            <label>Avukat Adres:</label>
                            <textarea id="lawyer-address" placeholder="Avukat ofis adresi" required></textarea>
                        </div>
                    </div>
                    
                    <!-- Adım 3: Müvekkil Bilgileri -->
                    <div class="wizard-page" data-page="3">
                        <div class="form-row full-width">
                            <label>Müvekkil Adı Soyadı/Unvan:</label>
                            <input type="text" id="client-name" placeholder="Müvekkil adı soyadı veya unvanı" required>
                        </div>
                        <div class="form-row full-width">
                            <label>Müvekkil T.C./Vergi No:</label>
                            <input type="text" id="client-id" placeholder="T.C. Kimlik No / Vergi No" required>
                        </div>
                        <div class="form-row full-width">
                            <label>Müvekkil Telefon:</label>
                            <input type="text" id="client-phone" placeholder="Telefon numarası" required>
                        </div>
                        <div class="form-row full-width">
                            <label>Müvekkil Adres:</label>
                            <textarea id="client-address" placeholder="Müvekkil adresi" required></textarea>
                        </div>
                    </div>
                    
                    <!-- Adım 4: Avukat Sözü -->
                    <div class="wizard-page" data-page="4">
                        <div class="form-row full-width">
                            <label>Avukat Beyanı:</label>
                            <textarea id="lawyer-statement" style="height: 250px; min-height: 250px;" placeholder="Avukatın müvekkile aktardığı bilgiler, tavsiyeler ve hukuki değerlendirmeler..." required></textarea>
                        </div>
                    </div>
                    
                    <!-- Adım 5: Müvekkil Sözü -->
                    <div class="wizard-page" data-page="5">
                        <div class="form-row full-width">
                            <label>Müvekkil Beyanı:</label>
                            <textarea id="client-statement" style="height: 250px; min-height: 250px;" placeholder="Müvekkilin avukata aktardığı olay, talep ve beklentiler..." required></textarea>
                        </div>
                    </div>
                    
                    <!-- Adım 6: Genel Hükümler -->
                    <div class="wizard-page" data-page="6">
                        <div class="form-row full-width">
                            <label>Tutanak Hükümleri:</label>
                            <textarea id="meeting-terms" style="height: 250px; min-height: 250px;" required>
İş bu tutanak, görüşme sırasında avukat ve müvekkil arasında yapılan konuşmalardan ve alınan kararlardan oluşmaktadır.

Görüşme tutanağı tarafların hak ve yükümlülüklerini belirlemek, ileride ortaya çıkabilecek anlaşmazlıkları önlemek ve müvekkile verilen bilgileri kayıt altına almak amacıyla hazırlanmıştır.

Tutulan kayıtların gizliliği esastır ve üçüncü kişilerle avukat-müvekkil ilişkisi içerisinde tanınan istisnalar dışında paylaşılamaz.

İş bu tutanak iki nüsha olarak düzenlenmiş olup, bir nüshası müvekkile verilmiştir.
                            </textarea>
                        </div>
                    </div>
                    
                    <!-- Adım 7: Önizleme -->
                    <div class="wizard-page" data-page="7">
                        <div class="form-row full-width">
                            <div id="meeting-note-preview-content" class="contract-preview">
                                <!-- Önizleme içeriği JavaScript tarafından doldurulacak -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="wizard-footer">
                    <div class="wizard-status">Adım 1/7</div>
                    <div class="wizard-navigation">
                        <button class="prev-step-btn" disabled>Geri</button>
                        <button class="next-step-btn">İleri</button>
                        <button class="finish-btn" style="display: none;">Tamamla</button>
                    </div>
                </div>
                
                <style>
                    .meeting-note-form-wizard {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                    }
                    
                    .wizard-header {
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 15px;
                        margin-bottom: 20px;
                    }
                    
                    .wizard-steps {
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        gap: 5px;
                        position: relative;
                    }
                    
                    .wizard-steps:after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 0;
                        right: 0;
                        height: 2px;
                        background-color: #e9ecef;
                        transform: translateY(-50%);
                        z-index: 0;
                    }
                    
                    .wizard-step {
                        font-size: 12px;
                        color: #666;
                        padding: 8px 12px;
                        border-radius: 15px;
                        background-color: #f5f5f5;
                        cursor: default;
                        flex: 1;
                        text-align: center;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        position: relative;
                        z-index: 1;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        transition: all 0.3s ease;
                    }
                    
                    .wizard-step.active {
                        background-color: #4a76a8;
                        color: white;
                        font-weight: bold;
                    }
                    
                    .wizard-content {
                        flex: 1;
                        overflow-y: auto;
                        min-height: 400px;
                        padding: 10px;
                    }
                    
                    .wizard-page {
                        display: none;
                        padding: 15px 5px;
                    }
                    
                    .wizard-page.active {
                        display: block;
                    }
                    
                    .form-row {
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 20px;
                        min-height: 70px;
                        box-sizing: border-box;
                    }
                    
                    .form-row label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: bold;
                        color: #333;
                    }
                    
                    .form-row input,
                    .form-row select,
                    .form-row textarea {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        box-sizing: border-box;
                        font-size: 14px;
                    }
                    
                    .form-row input:focus,
                    .form-row select:focus,
                    .form-row textarea:focus {
                        outline: none;
                        border-color: #4a76a8;
                        box-shadow: 0 0 0 2px rgba(74, 118, 168, 0.2);
                    }
                    
                    .form-row textarea {
                        flex-grow: 1;
                        min-height: 80px;
                        resize: vertical;
                    }
                    
                    .wizard-footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 10px;
                        padding-top: 15px;
                        border-top: 1px solid #ddd;
                    }
                    
                    .wizard-navigation {
                        display: flex;
                        gap: 10px;
                    }
                    
                    .wizard-navigation button {
                        padding: 8px 20px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background-color 0.2s;
                    }
                    
                    .prev-step-btn {
                        background-color: #6c757d;
                        color: white;
                    }
                    
                    .prev-step-btn:disabled {
                        background-color: #cccccc;
                        cursor: not-allowed;
                    }
                    
                    .next-step-btn {
                        background-color: #4a76a8;
                        color: white;
                    }
                    
                    .finish-btn {
                        background-color: #28a745;
                        color: white;
                    }
                    
                    .wizard-status {
                        font-size: 14px;
                        color: #666;
                    }
                    
                    #meeting-note-preview-content {
                        border: 1px solid #ddd;
                        padding: 20px;
                        background-color: #f9f9f9;
                        height: 400px;
                        overflow-y: auto;
                        box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
                        border-radius: 4px;
                        line-height: 1.6;
                    }
                    
                    #meeting-note-preview-content h2 {
                        text-align: center;
                        margin-bottom: 20px;
                        color: #333;
                        font-size: 1.6rem;
                    }
                    
                    #meeting-note-preview-content h3 {
                        color: #4a76a8;
                        margin-top: 25px;
                        margin-bottom: 15px;
                        font-size: 1.3rem;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 5px;
                    }
                    
                    #meeting-note-preview-content h4 {
                        color: #555;
                        margin-top: 15px;
                        margin-bottom: 10px;
                        font-size: 1.1rem;
                    }
                    
                    #meeting-note-preview-content p {
                        margin-bottom: 10px;
                    }
                    
                    @media (min-width: 768px) {
                        .wizard-page.active {
                            display: block;
                            padding: 15px;
                        }
                        
                        .wizard-page .form-row.full-width {
                            width: 100%;
                        }
                    }
                </style>
            </div>
        `;
    }

    setupMeetingNoteFormEvents() {
        const nextButtons = document.querySelectorAll('.next-step-btn');
        const prevButtons = document.querySelectorAll('.prev-step-btn');
        const wizardSteps = document.querySelectorAll('.wizard-step');
        const wizardPages = document.querySelectorAll('.wizard-page');
        const finishButton = document.querySelector('.finish-btn');
        const wizardStatus = document.querySelector('.wizard-status');
        
        // Form sayfaları arasındaki geçişi takip etmek için sayaç
        let currentPage = 0;
        
        // Sayfalar arasında geçiş için yardımcı fonksiyon
        const showPage = (pageIndex) => {
            // Önce tüm sayfaları gizle
            wizardPages.forEach((page, index) => {
                page.style.display = 'none';
                page.classList.remove('active');
            });
            
            // Sadece aktif sayfayı göster
            if (wizardPages[pageIndex]) {
                wizardPages[pageIndex].style.display = '';
                wizardPages[pageIndex].classList.add('active');
            }
            
            // Adım göstergesini güncelle
            if (wizardStatus) {
                wizardStatus.textContent = `Adım ${pageIndex + 1}/${wizardPages.length}`;
            }
            
            // Adım durumlarını güncelle
            wizardSteps.forEach((step, index) => {
                step.classList.toggle('active', index === pageIndex);
            });
            
            // Düğmeleri güncelle
            prevButtons.forEach(btn => {
                btn.disabled = pageIndex === 0;
            });
            
            // Son adıma geçildiğinde (Önizleme adımı)
            if (pageIndex === wizardPages.length - 1) {
                nextButtons.forEach(btn => btn.style.display = 'none');
                if (finishButton) finishButton.style.display = 'block';
                
                // Son adımda önizleme içeriğini güncelle
                const meetingNoteContent = this.generateMeetingNoteContent();
                const previewContent = document.querySelector('#meeting-note-preview-content');
                if (previewContent) {
                    previewContent.innerHTML = meetingNoteContent;
                }
            } else {
                nextButtons.forEach(btn => btn.style.display = 'block');
                if (finishButton) finishButton.style.display = 'none';
            }
            
            currentPage = pageIndex;
        };

        // İlk sayfayı etkinleştir
        if (wizardPages.length > 0) {
            showPage(0);
        }
        
        // İleri butonlarına tıklama olayı
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentPage < wizardPages.length - 1) {
                    // Mevcut sayfadaki zorunlu alanları kontrol et
                    const currentWizardPage = wizardPages[currentPage];
                    const requiredInputs = currentWizardPage.querySelectorAll('input[required], select[required], textarea[required]');
                    let allFieldsFilled = true;
                    let firstEmptyField = null;
                    
                    requiredInputs.forEach(input => {
                        if (input.value.trim() === '') {
                            allFieldsFilled = false;
                            if (!firstEmptyField) {
                                firstEmptyField = input;
                            }
                        }
                    });
                    
                    if (allFieldsFilled) {
                        showPage(currentPage + 1);
                    } else {
                        alert('Lütfen tüm zorunlu alanları doldurunuz.');
                        if (firstEmptyField) {
                            firstEmptyField.focus();
                        }
                    }
                }
            });
        });

        // Geri butonlarına tıklama olayı
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentPage > 0) {
                    showPage(currentPage - 1);
                }
            });
        });

        // Avukat bilgilerini otomatik doldur
        this.autoFillLawyerInfo(document.querySelector('.meeting-note-form-wizard'));

        // Tamamla butonuna tıklama olayı
        if (finishButton) {
            finishButton.addEventListener('click', () => {
                this.saveMeetingNote();
                this.downloadMeetingNote();
            });
        }
    }

    generateMeetingNoteContent() {
        const meetingType = document.querySelector('#meeting-type')?.value || 'İlk Görüşme';
        const meetingDate = document.querySelector('#meeting-date')?.value || new Date().toISOString().split('T')[0];
        const meetingTime = document.querySelector('#meeting-time')?.value || new Date().toTimeString().slice(0, 5);
        const meetingLocation = document.querySelector('#meeting-location')?.value || 'Belirtilmedi';
        
        const lawyerName = document.querySelector('#lawyer-name')?.value || '[Avukat Adı]';
        const lawyerBar = document.querySelector('#lawyer-bar')?.value || '[Avukat Barosu]';
        const lawyerBarId = document.querySelector('#lawyer-bar-id')?.value || '[Sicil No]';
        const lawyerAddress = document.querySelector('#lawyer-address')?.value || '[Avukat Adresi]';
        
        const clientName = document.querySelector('#client-name')?.value || '[Müvekkil Adı]';
        const clientId = document.querySelector('#client-id')?.value || '[TC/Vergi No]';
        const clientPhone = document.querySelector('#client-phone')?.value || '[Telefon]';
        const clientAddress = document.querySelector('#client-address')?.value || '[Müvekkil Adresi]';
        
        const lawyerStatement = document.querySelector('#lawyer-statement')?.value || '';
        const clientStatement = document.querySelector('#client-statement')?.value || '';
        const meetingTerms = document.querySelector('#meeting-terms')?.value || '';
        
        // Tutanak tipi çevirisi
        let meetingTypeName = 'İlk Görüşme Tutanağı';
        if (meetingType === 'dava_sonrasi') meetingTypeName = 'Dava Sonrası Görüşme';
        else if (meetingType === 'uzlasma') meetingTypeName = 'Uzlaşma Görüşmesi';
        else if (meetingType === 'bilgilendirme') meetingTypeName = 'Bilgilendirme Toplantısı';
        else if (meetingType === 'diger') meetingTypeName = 'Görüşme Tutanağı';
        
        // Tarih formatı
        const formattedDate = new Date(meetingDate).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        return `
            <div class="meeting-note-preview">
                <h2 style="text-align: center;">${meetingTypeName}</h2>
                
                <p style="text-align: right;"><strong>Tarih:</strong> ${formattedDate}<br>
                <strong>Saat:</strong> ${meetingTime}<br>
                <strong>Yer:</strong> ${meetingLocation}</p>
                
                <h3>1. TOPLANTIYA KATILANLAR</h3>
                
                <h4>1.1. Avukat Bilgileri</h4>
                <p><strong>Adı Soyadı:</strong> ${lawyerName}<br>
                <strong>Barosu:</strong> ${lawyerBar}<br>
                <strong>Sicil No:</strong> ${lawyerBarId}<br>
                <strong>Adres:</strong> ${lawyerAddress}</p>
                
                <h4>1.2. Müvekkil Bilgileri</h4>
                <p><strong>Adı Soyadı/Unvanı:</strong> ${clientName}<br>
                <strong>TC/Vergi No:</strong> ${clientId}<br>
                <strong>Telefon:</strong> ${clientPhone}<br>
                <strong>Adres:</strong> ${clientAddress}</p>
                
                <h3>2. GÖRÜŞME İÇERİĞİ</h3>
                
                <h4>2.1. Avukat Beyanı</h4>
                <p>${lawyerStatement.replace(/\n/g, '<br>')}</p>
                
                <h4>2.2. Müvekkil Beyanı</h4>
                <p>${clientStatement.replace(/\n/g, '<br>')}</p>
                
                <h3>3. GENEL HÜKÜMLER</h3>
                <p>${meetingTerms.replace(/\n/g, '<br>')}</p>
                
                <div style="margin-top: 50px; display: flex; justify-content: space-between;">
                    <div style="width: 45%;">
                        <p style="text-align: center; margin-bottom: 40px;">Avukat</p>
                        <p style="text-align: center;">${lawyerName}</p>
                        <p style="text-align: center;">İmza</p>
                    </div>
                    <div style="width: 45%;">
                        <p style="text-align: center; margin-bottom: 40px;">Müvekkil</p>
                        <p style="text-align: center;">${clientName}</p>
                        <p style="text-align: center;">İmza</p>
                    </div>
                </div>
            </div>
        `;
    }

    saveMeetingNote() {
        // Meeting note bilgilerini al
        const meetingType = document.querySelector('#meeting-type')?.value;
        const meetingDate = document.querySelector('#meeting-date')?.value;
        const clientName = document.querySelector('#client-name')?.value;
        
        // Kaydedilecek veriyi oluştur
        const meetingNote = {
            id: Date.now(),
            type: meetingType,
            date: meetingDate,
            clientName: clientName,
            lawyerName: document.querySelector('#lawyer-name')?.value,
            lawyerStatement: document.querySelector('#lawyer-statement')?.value,
            clientStatement: document.querySelector('#client-statement')?.value,
            content: this.generateMeetingNoteContent()
        };
        
        // Mevcut görüşme notlarını al
        let meetingNotes = JSON.parse(localStorage.getItem('uyap_asistan_meeting_notes') || '[]');
        
        // Yeni notu ekle
        meetingNotes.push(meetingNote);
        
        // Local storage'a kaydet
        localStorage.setItem('uyap_asistan_meeting_notes', JSON.stringify(meetingNotes));
        
        // Kullanıcıya bilgi ver
        alert('Görüşme tutanağı başarıyla kaydedildi.');
        
        // Popup'ı kapat
        const popupContainer = document.querySelector('.quick-petition-viewer-container');
        if (popupContainer) {
            document.body.removeChild(popupContainer);
        }
        
        // Görüşme notları listesini güncelle
        this.loadMeetingNotesData();
    }

    downloadMeetingNote() {
        const meetingNoteContent = this.generateMeetingNoteContent();
        const clientName = document.querySelector('#client-name')?.value || 'müvekkil';
        const meetingDate = document.querySelector('#meeting-date')?.value || new Date().toISOString().split('T')[0];
        
        // HTML içeriğini oluştur
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Görüşme Tutanağı - ${clientName}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    margin: 40px;
                }
                h1, h2, h3, h4 {
                    color: #333;
                }
                .meeting-note-preview {
                    max-width: 800px;
                    margin: 0 auto;
                }
            </style>
        </head>
        <body>
            ${meetingNoteContent}
        </body>
        </html>
        `;
        
        // Dosya adı oluştur
        const formattedDate = meetingDate.replace(/-/g, '');
        const fileName = `Gorusme_Tutanagi_${clientName.replace(/\s+/g, '_')}_${formattedDate}.html`;
        
        // Dosyayı indir
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    setupMeetingNoteCardEvents() {
        // Görüntüle butonları
        const viewButtons = document.querySelectorAll('.view-meeting-note');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                this.viewMeetingNote(index);
            });
        });
        
        // İndir butonları
        const downloadButtons = document.querySelectorAll('.download-meeting-note');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                this.downloadExistingMeetingNote(index);
            });
        });
        
        // Sil butonları
        const deleteButtons = document.querySelectorAll('.delete-meeting-note');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                this.deleteMeetingNote(index);
            });
        });
    }

    viewMeetingNote(index) {
        // Local storage'dan görüşme tutanaklarını al
        const meetingNotes = JSON.parse(localStorage.getItem('uyap_asistan_meeting_notes') || '[]');
        const note = meetingNotes[index];
        
        if (!note) return;
        
        // Popup oluştur
        const popupContainer = document.createElement('div');
        popupContainer.className = 'quick-petition-viewer-container';
        
        // Popup içeriği
        popupContainer.innerHTML = `
            <div class="quick-petition-popup">
                <div class="quick-petition-header">
                    <h3>GÖRÜŞME TUTANAĞI GÖRÜNTÜLEME</h3>
                    <div class="quick-petition-close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                <div class="quick-petition-content">
                    <div class="meeting-note-preview-container">
                        ${note.content}
                    </div>
                    <div class="meeting-note-actions" style="margin-top: 20px; text-align: center; padding: 15px; background: none; border-top: 1px solid #ddd;">
                        <button class="download-viewed-meeting-note" style="background-color: #17a2b8; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; transition: background-color 0.2s;">
                            <i class="fas fa-download"></i> İndir
                        </button>
                    </div>
                </div>
            </div>
            <style>
                .meeting-note-preview-container {
                    padding: 30px;
                    max-height: 70vh;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #fff;
                    box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
                    line-height: 1.6;
                }
                
                .meeting-note-preview-container h2 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 20px;
                    font-size: 1.8rem;
                }
                
                .meeting-note-preview-container h3 {
                    color: #4a76a8;
                    margin-top: 30px;
                    margin-bottom: 15px;
                    font-size: 1.4rem;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 8px;
                }
                
                .meeting-note-preview-container h4 {
                    color: #555;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    font-size: 1.2rem;
                }
                
                .meeting-note-preview-container p {
                    margin-bottom: 15px;
                }
                
                .meeting-note-preview-container strong {
                    color: #333;
                }
                
                .download-viewed-meeting-note:hover {
                    background-color: #138496;
                }
                
                @media print {
                    .quick-petition-header, .meeting-note-actions {
                        display: none;
                    }
                    
                    .meeting-note-preview-container {
                        border: none;
                        box-shadow: none;
                        max-height: none;
                        padding: 0;
                    }
                    
                    .quick-petition-popup {
                        width: 100%;
                        height: auto;
                    }
                }
            </style>
        `;
        
        // Popup'ı sayfaya ekle
        document.body.appendChild(popupContainer);
        
        // İndir butonuna tıklama olayı
        const downloadButton = popupContainer.querySelector('.download-viewed-meeting-note');
        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                this.downloadExistingMeetingNote(index);
            });
        }
        
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
    }

    downloadExistingMeetingNote(index) {
        // Local storage'dan görüşme tutanaklarını al
        const meetingNotes = JSON.parse(localStorage.getItem('uyap_asistan_meeting_notes') || '[]');
        const note = meetingNotes[index];
        
        if (!note) return;
        
        // HTML içeriğini oluştur
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Görüşme Tutanağı - ${note.clientName || 'müvekkil'}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    margin: 40px;
                }
                h1, h2, h3, h4 {
                    color: #333;
                }
                .meeting-note-preview {
                    max-width: 800px;
                    margin: 0 auto;
                }
            </style>
        </head>
        <body>
            ${note.content}
        </body>
        </html>
        `;
        
        // Dosya adı oluştur
        const formattedDate = note.date.replace(/-/g, '');
        const fileName = `Gorusme_Tutanagi_${(note.clientName || 'müvekkil').replace(/\s+/g, '_')}_${formattedDate}.html`;
        
        // Dosyayı indir
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    deleteMeetingNote(index) {
        // Silme işlemi için kullanıcıdan onay iste
        if (confirm('Bu görüşme tutanağını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
            // Local storage'dan görüşme tutanaklarını al
            let meetingNotes = JSON.parse(localStorage.getItem('uyap_asistan_meeting_notes') || '[]');
            
            // İndeks kontrol et
            if (index >= 0 && index < meetingNotes.length) {
                // Görüşme tutanağını sil
                meetingNotes.splice(index, 1);
                
                // Güncellenmiş listeyi local storage'a kaydet
                localStorage.setItem('uyap_asistan_meeting_notes', JSON.stringify(meetingNotes));
                
                // Görüşme tutanakları listesini güncelle
                this.loadMeetingNotesData();
                
                // Kullanıcıya bilgi ver
                alert('Görüşme tutanağı başarıyla silindi.');
            }
        }
    }

    setupContractCardEvents() {
        // Görüntüle butonları
        const viewButtons = document.querySelectorAll('.view-contract');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                this.viewContract(index);
            });
        });
        
        // İndir butonları
        const downloadButtons = document.querySelectorAll('.download-contract');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                this.downloadExistingContract(index);
            });
        });
        
        // Sil butonları
        const deleteButtons = document.querySelectorAll('.delete-contract');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                this.deleteContract(index);
            });
        });
    }

    downloadExistingContract(index) {
        // Chrome storage'dan sözleşmeleri al
        chrome.storage.local.get(['contracts'], (result) => {
            const contracts = result.contracts || [];
            const contract = contracts[index];
            
            if (!contract) return;
            
            const clientName = contract.clientName || 'İsimsiz Müvekkil';
            const date = new Date(contract.createdAt).toLocaleDateString('tr-TR');
            
            // HTML dosyası için tam içerik
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Avukatlık Ücret Sözleşmesi - ${clientName}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 40px;
                        line-height: 1.5;
                    }
                    h1 {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .date {
                        text-align: right;
                        margin-bottom: 20px;
                    }
                    .signature-container {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 50px;
                    }
                    .signature {
                        text-align: center;
                        width: 45%;
                    }
                    .signature-line {
                        border-top: 1px solid #000;
                        margin: 50px 0 10px 0;
                    }
                    @media print {
                        body {
                            margin: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="date">Tarih: ${date}</div>
                <h1>AVUKATLIK ÜCRET SÖZLEŞMESİ</h1>
                <div class="content">
                    ${contract.content}
                </div>
                
                <div class="signature-container">
                    <div class="signature">
                        <div class="signature-line"></div>
                        <p>İş Sahibi<br>${clientName}</p>
                    </div>
                    <div class="signature">
                        <div class="signature-line"></div>
                        <p>Avukat<br>${contract.lawyerName || 'Avukat'}</p>
                    </div>
                </div>
            </body>
            </html>
            `;
            
            // Dosya adı oluştur
            const formattedDate = date.replace(/\//g, '-');
            const fileName = `Avukatlık_Sözleşmesi_${clientName.replace(/\s+/g, '_')}_${formattedDate}.html`;
            
            // Dosyayı indir
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    viewContract(index) {
        // Chrome storage'dan sözleşmeleri al
        chrome.storage.local.get(['contracts'], (result) => {
            const contracts = result.contracts || [];
            const contract = contracts[index];
            
            if (!contract) return;
            
            // Popup oluştur
            const popupContainer = document.createElement('div');
            popupContainer.className = 'quick-petition-viewer-container';
            
            // Popup içeriği
            popupContainer.innerHTML = `
                <div class="quick-petition-popup">
                    <div class="quick-petition-header">
                        <h3>SÖZLEŞME GÖRÜNTÜLEME</h3>
                        <div class="quick-petition-close">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                    <div class="quick-petition-content">
                        <div class="contract-preview-container">
                            ${contract.content}
                        </div>
                        <div class="contract-actions" style="margin-top: 20px; text-align: center; padding: 15px; background: none; border-top: 1px solid #ddd;">
                            <button class="download-viewed-contract" style="background-color: #17a2b8; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; transition: background-color 0.2s;">
                                <i class="fas fa-download"></i> İndir
                            </button>
                        </div>
                    </div>
                </div>
                <style>
                    .contract-preview-container {
                        padding: 30px;
                        max-height: 70vh;
                        overflow-y: auto;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        background-color: #fff;
                        box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
                        line-height: 1.6;
                    }
                    
                    .contract-preview-container h2 {
                        text-align: center;
                        color: #333;
                        margin-bottom: 20px;
                        font-size: 1.8rem;
                    }
                    
                    .contract-preview-container h3 {
                        color: #4a76a8;
                        margin-top: 30px;
                        margin-bottom: 15px;
                        font-size: 1.4rem;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 8px;
                    }
                    
                    .contract-preview-container h4 {
                        color: #555;
                        margin-top: 20px;
                        margin-bottom: 10px;
                        font-size: 1.2rem;
                    }
                    
                    .contract-preview-container p {
                        margin-bottom: 15px;
                    }
                    
                    .contract-preview-container strong {
                        color: #333;
                    }
                    
                    .download-viewed-contract:hover {
                        background-color: #138496;
                    }
                    
                    @media print {
                        .quick-petition-header, .contract-actions {
                            display: none;
                        }
                        
                        .contract-preview-container {
                            border: none;
                            box-shadow: none;
                            max-height: none;
                            padding: 0;
                        }
                        
                        .quick-petition-popup {
                            width: 100%;
                            height: auto;
                        }
                    }
                </style>
            `;
            
            // Sayfaya ekle
            document.body.appendChild(popupContainer);
            
            // Kapatma butonuna tıklama olayı
            const closeButton = popupContainer.querySelector('.quick-petition-close');
            closeButton.addEventListener('click', () => {
                document.body.removeChild(popupContainer);
            });
            
            // İndir butonuna tıklama olayı
            const downloadButton = popupContainer.querySelector('.download-viewed-contract');
            downloadButton.addEventListener('click', () => {
                this.downloadExistingContract(index);
            });
            
            // ESC tuşu ile kapatma
            const handleEscKey = (e) => {
                if (e.key === 'Escape') {
                    document.body.removeChild(popupContainer);
                    document.removeEventListener('keydown', handleEscKey);
                }
            };
            document.addEventListener('keydown', handleEscKey);
        });
    }
    
    deleteContract(index) {
        // Kullanıcıya silme işlemini onayla
        if (confirm('Bu sözleşmeyi silmek istediğinizden emin misiniz?')) {
            // Chrome storage'dan sözleşmeleri al
            chrome.storage.local.get(['contracts'], (result) => {
                const contracts = result.contracts || [];
                
                // Eğer index geçerliyse sözleşmeyi sil
                if (index >= 0 && index < contracts.length) {
                    contracts.splice(index, 1);
                    
                    // Güncellenmiş listeyi kaydet
                    chrome.storage.local.set({ contracts }, () => {
                        // Listeyi güncelle
                        this.loadContractsData();
                        alert('Sözleşme başarıyla silindi.');
                    });
                }
            });
        }
    }
}

export default Account; 
