class Account {
    constructor() {
        this.currentSection = 'lawyer'; // Default section
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
                    <h2>Kullanıcı Bilgileri</h2>
                </div>
                <div class="account-menu">
                    <div class="account-menu-item active" data-section="lawyer">
                        <i class="fas fa-user-tie"></i>
                        <span>Avukat Bilgileri</span>
                    </div>
                    <div class="account-menu-item" data-section="staff">
                        <i class="fas fa-users"></i>
                        <span>Ofis Personelleri</span>
                    </div>
                    <div class="account-menu-item" data-section="clients">
                        <i class="fas fa-user-friends"></i>
                        <span>Müvekkiller</span>
                    </div>
                    <div class="account-menu-item" data-section="assignments">
                        <i class="fas fa-file-alt"></i>
                        <span>Kaydedilen Dilekçeler</span>
                    </div>
                    <div class="account-menu-item" data-section="case-notes">
                        <i class="fas fa-sticky-note"></i>
                        <span>Dava Notları</span>
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
                <h3>Avukat Bilgileri</h3>
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
                            <label>Baro Sicil No</label>
                            <input type="text" class="lawyer-id" placeholder="Baro Sicil No">
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
                <h3>Ofis Personelleri</h3>
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
                <h3>Müvekkiller</h3>
                <div class="account-group clients-container">
                    <div class="clients-list">
                        <div class="clients-header">
                            <h4>Müvekkilleriniz</h4>
                            <div class="clients-search">
                                <input type="text" class="clients-search-input" placeholder="Müvekil ismi ile ara...">
                                <i class="fas fa-search search-icon"></i>
                            </div>
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

    generateAssignmentsInfo() {
        return `
            <div class="account-section" id="assignments-info">
                <h3>Kayıtlı Dilekçeler</h3>
                <div class="account-group assignments-container">
                    <div class="assignments-header">
                        <h4>Kayıtlı Dilekçeler</h4>
                        <div class="assignments-actions">
                            <button class="refresh-assignments-btn">
                                <i class="fas fa-sync-alt"></i>
                                Yenile
                            </button>
                        </div>
                    </div>
                    <div class="assignments-list">
                        <div class="loading-assignments">
                            <i class="fas fa-spinner fa-pulse"></i>
                            <p>Dilekçeler yükleniyor...</p>
                        </div>
                    </div>
                    <button class="add-assignment-btn">
                        <i class="fas fa-plus"></i>
                        Yeni Dilekçe Ekle
                    </button>
                </div>
            </div>
        `;
    }

    generateCaseNotesInfo() {
        return `
            <div class="account-section" id="case-notes-info">
                <h3>Dava Notları</h3>
                <div class="case-notes-container">
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
                    case 'assignments':
                        content.innerHTML = this.generateAssignmentsInfo();
                        this.setupAssignmentsEvents();
                        break;
                    case 'case-notes':
                        content.innerHTML = this.generateCaseNotesInfo();
                        this.setupCaseNotesEvents();
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
            if (this.currentSection === 'assignments') {
                this.displayAssignmentsData(event.detail.savedAssignments);
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
                                    <span class="lawyer-badge">Baro: ${lawyer.bar} - No: ${lawyer.id}</span>
                                </div>
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
            
            // Müvekkil kartları için stil ekle
            const style = document.createElement('style');
            style.textContent = `
                .client-card, .lawyer-card, .staff-card {
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    background-color: #fff;
                    overflow: hidden;
                }
                
                .client-card-header, .lawyer-card-header, .staff-card-header {
                    padding: 12px 15px;
                    border-bottom: 1px solid #e0e0e0;
                    background-color: #f9f9f9;
                    position: relative;
                }
                
                .client-card-header h5, .lawyer-card-header h5, .staff-card-header h5 {
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
                
                .client-cases-count {
                    position: absolute;
                    right: 15px;
                    top: 12px;
                    background-color: #6c757d;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                }
                
                .client-card-body, .lawyer-card-body, .staff-card-body {
                    padding: 15px;
                }
                
                .lawyer-card-actions, .staff-card-actions {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 15px;
                    padding-top: 10px;
                    border-top: 1px solid #e0e0e0;
                }
                
                .lawyer-card-actions button, .staff-card-actions button {
                    background: none;
                    border: none;
                    color: #4a76a8;
                    cursor: pointer;
                    margin-left: 5px;
                    padding: 3px 6px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                
                .lawyer-card-actions button:hover, .staff-card-actions button:hover {
                    background-color: rgba(74, 118, 168, 0.1);
                }
                
                .edit-lawyer-btn, .edit-staff-btn {
                    color: #4a76a8 !important;
                }
                
                .delete-lawyer-btn, .delete-staff-btn {
                    color: #dc3545 !important;
                }
                
                .lawyer-info-item, .staff-info-item {
                    border-left: 3px solid #4a76a8;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    background-color: #f3f7fa;
                    border-radius: 0 4px 4px 0;
                }
                
                .lawyer-info-item:last-child, .staff-info-item:last-child {
                    margin-bottom: 0;
                }
                
                .lawyer-info-item i, .staff-info-item i {
                    margin-right: 8px;
                    color: #4a76a8;
                }
                
                .lawyer-info-header, .staff-info-header {
                    margin-bottom: 8px;
                }
                
                .lawyer-info-row, .staff-info-row {
                    margin-bottom: 5px;
                }
                
                .lawyer-info-row:last-child, .staff-info-row:last-child {
                    margin-bottom: 0;
                }
                
                .lawyer-info-row i, .staff-info-row i {
                    width: 20px;
                    margin-right: 8px;
                    color: #4a76a8;
                }
                
                .client-case {
                    border-left: 3px solid #4a76a8;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    background-color: #f3f7fa;
                    border-radius: 0 4px 4px 0;
                }
                
                .client-case-header {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 5px;
                }
                
                .client-case:last-child {
                    margin-bottom: 0;
                }
                
                .client-case p {
                    margin: 5px 0;
                    font-size: 0.9rem;
                }
                
                .clients-header {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }
                
                .clients-search {
                    position: relative;
                    flex-grow: 1;
                    margin: 0 15px;
                }
                
                .clients-search-input {
                    width: 100%;
                    padding: 8px 15px;
                    padding-right: 40px;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    transition: all 0.3s;
                }
                
                .clients-search-input:focus {
                    outline: none;
                    border-color: #4a76a8;
                    box-shadow: 0 0 0 2px rgba(74, 118, 168, 0.2);
                }
                
                .search-icon {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6c757d;
                }
                
                .client-card.hidden {
                    display: none;
                }
                
                /* Form Styling */
                .lawyer-form {
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .info-row {
                    margin-bottom: 12px;
                }
                
                .info-row label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #4a5568;
                }
                
                .info-row input, .info-row textarea {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: all 0.3s;
                }
                
                .info-row input:focus, .info-row textarea:focus {
                    border-color: #4a76a8;
                    box-shadow: 0 0 0 2px rgba(74, 118, 168, 0.2);
                    outline: none;
                }
                
                .save-lawyer-btn {
                    background-color: #4a76a8;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    transition: all 0.3s;
                }
                
                .save-lawyer-btn:hover {
                    background-color: #3b5998;
                }
                
                .save-lawyer-btn i {
                    margin-right: 5px;
                }
                
                .lawyer-list h4 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #4a5568;
                    font-size: 1.1rem;
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
        // Arama fonksiyonunu kur
        const searchInput = document.querySelector('.clients-search-input');
        if (searchInput) {
            // Input olayını dinle
            searchInput.addEventListener('input', (e) => {
                this.filterClients(e.target.value);
            });
            
            // Enter tuşu ile arama 
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.filterClients(e.target.value);
                }
            });
        }
        
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

    setupAssignmentsEvents() {
        // Yenile butonuna tıklama olayı
        const refreshBtn = document.querySelector('.refresh-assignments-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadAssignmentsData());
        }
        
        // Yeni görevlendirme ekle butonuna tıklama olayı
        const addBtn = document.querySelector('.add-assignment-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddAssignmentForm());
        }
        
        // İlk yükleme
        this.loadAssignmentsData();
    }
    
    loadAssignmentsData() {
        const assignmentsList = document.querySelector('.assignments-list');
        
        if (assignmentsList) {
            // Yükleniyor göster
            assignmentsList.innerHTML = `
                <div class="loading-assignments">
                    <i class="fas fa-spinner fa-pulse"></i>
                    <p>Dilekçeler yükleniyor...</p>
                </div>
            `;
            
            // Chrome storage'dan görevlendirme verilerini çek
            chrome.storage.local.get(['savedAssignments'], (result) => {
                const savedAssignments = result.savedAssignments || [];
                this.displayAssignmentsData(savedAssignments);
            });
        }
    }
    
    displayAssignmentsData(savedAssignments) {
        const assignmentsList = document.querySelector('.assignments-list');
        
        if (!assignmentsList) return;
        
        if (savedAssignments && savedAssignments.length > 0) {
            let cardsHTML = '<div class="assignments-cards-container">';
            
            savedAssignments.forEach((assignment, index) => {
                if (assignment.type === 'petition') {
                    // Dilekçe kartı oluştur
                    const petition = assignment.data;
                    cardsHTML += `
                        <div class="assignment-card petition-card">
                            <div class="assignment-card-header">
                                <h5>${petition.type}</h5>
                                <span class="assignment-card-date">${new Date(assignment.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div class="assignment-card-body">
                                <p><i class="fas fa-gavel"></i> ${petition.davaNo}</p>
                                <p><i class="fas fa-university"></i> ${petition.mahkeme}</p>
                            </div>
                            <div class="assignment-card-actions">
                                <button class="view-petition-btn" data-index="${index}">
                                    <i class="fas fa-eye"></i> Görüntüle
                                </button>
                                <button class="edit-petition-btn" data-index="${index}">
                                    <i class="fas fa-edit"></i> Düzenle
                                </button>
                                <button class="delete-assignment-btn" data-index="${index}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                } else {
                    // Normal görevlendirme kartı
                    cardsHTML += `
                        <div class="assignment-card">
                            <div class="assignment-card-header">
                                <h5>Görevlendirme</h5>
                                <span class="assignment-card-date">${new Date(assignment.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div class="assignment-card-body">
                                <p><i class="fas fa-tasks"></i> ${assignment.data?.title || 'Görev'}</p>
                                <p><i class="fas fa-user"></i> ${assignment.data?.assignee || 'Atanmamış'}</p>
                            </div>
                            <div class="assignment-card-actions">
                                <button class="edit-assignment-btn" data-index="${index}">
                                    <i class="fas fa-edit"></i> Düzenle
                                </button>
                                <button class="delete-assignment-btn" data-index="${index}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }
            });
            
            cardsHTML += '</div>';
            assignmentsList.innerHTML = cardsHTML;
            
            // Dilekçe görüntüleme butonlarını ayarla
            const viewPetitionBtns = assignmentsList.querySelectorAll('.view-petition-btn');
            viewPetitionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.dataset.index;
                    this.viewPetition(index);
                });
            });
            
            // Dilekçe düzenleme butonlarını ayarla
            const editPetitionBtns = assignmentsList.querySelectorAll('.edit-petition-btn');
            editPetitionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.dataset.index;
                    this.editPetition(index);
                });
            });
            
            // Silme butonlarını ayarla
            const deleteBtns = assignmentsList.querySelectorAll('.delete-assignment-btn');
            deleteBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.dataset.index;
                    this.deleteAssignment(index);
                });
            });
        } else {
            assignmentsList.innerHTML = `
                <div class="no-assignments">
                    <i class="fas fa-file-alt"></i>
                    <p>Henüz kaydedilmiş dilekçe bulunmamaktadır.</p>
                </div>
            `;
        }
    }
    
    viewPetition(index) {
        chrome.storage.local.get(['savedAssignments'], (result) => {
            const savedAssignments = result.savedAssignments || [];
            const petition = savedAssignments[index];
            
            if (petition && petition.type === 'petition') {
                this.showPetitionViewer(petition.data);
            }
        });
    }
    
    editPetition(index) {
        chrome.storage.local.get(['savedAssignments'], (result) => {
            const savedAssignments = result.savedAssignments || [];
            const petition = savedAssignments[index];
            
            if (petition && petition.type === 'petition') {
                this.showPetitionEditor(petition.data, index);
            }
        });
    }
    
    deleteAssignment(index) {
        if (confirm('Bu dilekçeyi silmek istediğinize emin misiniz?')) {
            chrome.storage.local.get(['savedAssignments'], (result) => {
                const savedAssignments = result.savedAssignments || [];
                savedAssignments.splice(index, 1);
                
                chrome.storage.local.set({ savedAssignments }, () => {
                    this.loadAssignmentsData();
                });
            });
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
        chrome.storage.local.get(['savedAssignments'], (result) => {
            const savedAssignments = result.savedAssignments || [];
            
            if (savedAssignments[index] && savedAssignments[index].type === 'petition') {
                savedAssignments[index].data = updatedPetition;
                
                chrome.storage.local.set({ savedAssignments }, () => {
                    this.loadAssignmentsData();
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
    
    showAddAssignmentForm() {
        // Yeni görevlendirme eklemek için popup göster
        alert('Yeni görevlendirme ekleme özelliği yakında eklenecektir.');
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
    
    loadCaseNotes() {
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
                "Masraf avansı yatırıldı.",
                "İflas erteleme talep edildi.",
                "İlamsız takip başlatıldı.",
                "İlamlı takip başlatıldı.",
                "Maaş haczi yapıldı.",
                "Araç haczi yapıldı.",
                "Banka hesabı haczi yapıldı.",
                "Kira alacağı haczi yapıldı.",
                "Tahliye işlemi başlatıldı.",
                "Mühlet uzatımı talep edildi.",
                "Yürütmeyi durdurma kararı alındı.",
                "İptal davası açıldı.",
                "Tespit davası açıldı.",
                "Alacak davası açıldı.",
                "Konkordato süreci başlatıldı.",
                "Ticari defter incelemesi yapıldı.",
                "Fatura itirazı yapıldı.",
                "İcra takibi durduruldu.",
                "Zaman aşımı def'i ileri sürüldü.",
                "Vergi ihtilafı açıldı.",
                "Kefalet sorumluluğu sona erdi.",
                "Uzlaşma görüşmeleri başlatıldı.",
                "Hizmet tespit davası açıldı.",
                "İş akdi feshedildi.",
                "Kıdem tazminatı hesaplandı.",
                "İhbar tazminatı hesaplandı.",
                "İşe iade davası açıldı.",
                "İtirazın iptali davası açıldı.",
                "Menfi tespit davası açıldı.",
                "Tasarrufun iptali davası açıldı.",
                "İflas davası açıldı.",
                "Ticaret sicili kayıtları incelendi.",
                "Zorunlu arabuluculuk başvurusu yapıldı.",
                "Arabuluculuk toplantısı gerçekleştirildi.",
                "Arabuluculuk anlaşma belgesi hazırlandı.",
                "Noter ihtarnamesi gönderildi.",
                "Aile konutu şerhi konuldu.",
                "Terditli dava açıldı.",
                "Müdahale talebinde bulunuldu.",
                "İdari başvuru yapıldı.",
                "İdari dava açma süresi durduruldu.",
                "İdari para cezasına itiraz edildi.",
                "Trafik kazası tespit tutanağı incelendi.",
                "Maddi tazminat hesaplaması yapıldı.",
                "Manevi tazminat talep edildi.",
                "SGK kayıtları incelendi.",
                "Sigorta eksper raporu incelendi.",
                "Destekten yoksun kalma tazminatı hesaplandı.",
                "İş göremezlik tazminatı hesaplandı.",
                "Kamulaştırma itirazı yapıldı.",
                "Karşı taraf delilleri incelendi.",
                "Tanık listesi hazırlandı.",
                "Bilirkişi heyeti değişikliği talep edildi.",
                "Mahkemece re'sen bilirkişi atandı.",
                "Soruşturma izni talep edildi.",
                "Yetki itirazında bulunuldu.",
                "Görev itirazında bulunuldu.",
                "Dava şartı yokluğu ileri sürüldü.",
                "Adli yardım talebinde bulunuldu.",
                "Haciz tutanağına itiraz edildi.",
                "Şikayet yoluyla icra mahkemesine başvuruldu.",
                "Davanın birleştirilmesi talep edildi.",
                "Borçlu malvarlığı araştırması yapıldı.",
                "Kira sözleşmesi feshedildi.",
                "Tapu kayıtları incelendi."
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

    // Müvekkilleri aranan metne göre filtrele
    filterClients(searchText) {
        const clientCards = document.querySelectorAll('.client-card');
        if (!clientCards.length) return;
        
        // Arama metni yok veya 1 karakterden kısaysa tüm kartları göster
        if (!searchText || searchText.length < 1) {
            clientCards.forEach(card => {
                card.classList.remove('hidden');
            });
            return;
        }
        
        // Arama metni küçük harfe çevir (case-insensitive arama için)
        searchText = searchText.toLowerCase();
        
        // Her müvekkil kartını kontrol et
        clientCards.forEach(card => {
            const clientName = card.querySelector('.client-card-header h5').textContent.toLowerCase();
            
            // Aranan metin müvekkil adında bulunuyorsa göster, yoksa gizle
            if (clientName.startsWith(searchText)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Filtreleme sonucu mesajı
        const displayedCards = document.querySelectorAll('.client-card:not(.hidden)').length;
        const clientsContainer = document.querySelector('.clients-cards-container');
        
        // Eğer hiç sonuç yoksa ve container varsa
        if (displayedCards === 0 && clientsContainer) {
            // Varsa eski no-results öğesini kaldır
            const oldNoResults = document.querySelector('.no-search-results');
            if (oldNoResults) oldNoResults.remove();
            
            // Yeni mesaj ekle
            const noResults = document.createElement('div');
            noResults.className = 'no-search-results';
            noResults.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #6c757d;">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>"${searchText}" ile eşleşen müvekkil bulunamadı.</p>
                </div>
            `;
            clientsContainer.appendChild(noResults);
        } else {
            // Sonuç varsa, no-results öğesini kaldır
            const noResults = document.querySelector('.no-search-results');
            if (noResults) noResults.remove();
        }
    }
}

export default Account; 
