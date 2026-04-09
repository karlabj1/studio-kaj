// Optimized gallery script for mobile and performance
(function() {
    'use strict';
    
    let initialized = false;
    
    function initGallery() {
        // Prevent multiple initializations
        if (initialized) return;
        initialized = true;
        
        const imageItems = document.querySelectorAll('.image-gallery .image-item');
        if (imageItems.length === 0) return;
        
        // Ensure all images start collapsed
        imageItems.forEach(item => {
            if (!item.classList.contains('expanded')) {
                item.classList.add('collapsed');
            }
        });
        
        imageItems.forEach(item => {
            let touchStartY = 0;
            let touchMoved = false;
            let touchStartTime = 0;
            let touchHandled = false;
            let lastTouchToggle = 0;
            
            const toggleImage = function() {
                // Immediate toggle - no delays
                const isExpanded = item.classList.contains('expanded');
                
                if (isExpanded) {
                    item.classList.remove('expanded');
                    item.classList.add('collapsed');
                } else {
                    item.classList.remove('collapsed');
                    item.classList.add('expanded');
                }
            };
            
            // Touch events for mobile (more reliable on iOS)
            item.addEventListener('touchstart', function(e) {
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
                touchMoved = false;
                touchHandled = false;
            }, { passive: true });
            
            item.addEventListener('touchmove', function(e) {
                if (touchStartTime > 0) {
                    const touchY = e.touches[0].clientY;
                    const distance = Math.abs(touchY - touchStartY);
                    // Only mark as moved if significant scroll (25px threshold)
                    if (distance > 25) {
                        touchMoved = true;
                    }
                }
            }, { passive: true });
            
            item.addEventListener('touchend', function(e) {
                if (touchStartTime > 0) {
                    const touchDuration = Date.now() - touchStartTime;
                    // Handle tap if: not moved, reasonable duration, and not already handled
                    if (!touchMoved && touchDuration > 0 && touchDuration < 500 && !touchHandled) {
                        e.preventDefault();
                        e.stopPropagation();
                        touchHandled = true;
                        lastTouchToggle = Date.now();
                        toggleImage();
                    }
                    // Reset state
                    touchStartTime = 0;
                    touchMoved = false;
                    setTimeout(function() {
                        touchHandled = false;
                    }, 50);
                }
            }, { passive: false });
            
            // Click for desktop; ignore synthetic click after touch (avoids double-toggle / flicker)
            item.addEventListener('click', function(e) {
                if (Date.now() - lastTouchToggle < 450) return;
                if (!touchHandled) {
                    toggleImage();
                }
            });
        });
    }
    
    // Initialize once when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery, { once: true });
    } else {
        // DOM already ready
        initGallery();
    }
})();

