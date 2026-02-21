// Menu popup functionality
(function() {
    'use strict';
    
    // Wrap years in titles so they stay non-italic
    function wrapYearsInTitles() {
        document.querySelectorAll('.image-title').forEach(function(el) {
            if (el.querySelector('.title-year')) return; // already processed
            el.innerHTML = el.textContent.replace(/\b(19|20)\d{2}\b/g, '<span class="title-year">$&</span>');
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wrapYearsInTitles);
    } else {
        wrapYearsInTitles();
    }
    
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

