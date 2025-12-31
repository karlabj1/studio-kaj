// Menu popup functionality
(function() {
    'use strict';
    
    const menuButton = document.getElementById('menuButton');
    const menuPopup = document.getElementById('menuPopup');
    
    if (!menuButton || !menuPopup) return;
    
    menuButton.addEventListener('click', function() {
        menuPopup.classList.toggle('active');
        menuButton.classList.toggle('active');
    });
    
    // Close popup when clicking on a link
    const popupItems = menuPopup.querySelectorAll('.menu-popup-item');
    popupItems.forEach(item => {
        item.addEventListener('click', function() {
            menuPopup.classList.remove('active');
            menuButton.classList.remove('active');
        });
    });
    
    // Close popup when clicking outside
    menuPopup.addEventListener('click', function(e) {
        if (e.target === menuPopup) {
            menuPopup.classList.remove('active');
            menuButton.classList.remove('active');
        }
    });
})();

