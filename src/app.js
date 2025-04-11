import Settings from './settings.js';

// Settings popup initialization
document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settings');
    const settingsManager = new Settings();

    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            settingsManager.showSettings();
        });
    }
}); 