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
            
            const toggleImage = function() {
                // Immediate toggle - no delays, no event needed
                const isExpanded = item.classList.contains('expanded');
                
                if (isExpanded) {
                    item.classList.remove('expanded');
                    item.classList.add('collapsed');
                } else {
                    item.classList.remove('collapsed');
                    item.classList.add('expanded');
                }
            };
            
            // Use pointer events for better performance on mobile
            item.addEventListener('pointerdown', function(e) {
                if (e.pointerType === 'touch') {
                    touchStartY = e.clientY;
                    touchStartTime = Date.now();
                    touchMoved = false;
                }
            }, { passive: true });
            
            item.addEventListener('pointermove', function(e) {
                if (e.pointerType === 'touch' && touchStartTime > 0) {
                    const distance = Math.abs(e.clientY - touchStartY);
                    if (distance > 20) {
                        touchMoved = true;
                    }
                }
            }, { passive: true });
            
            item.addEventListener('pointerup', function(e) {
                if (e.pointerType === 'touch') {
                    const touchDuration = Date.now() - touchStartTime;
                    // Fast tap detection - only block if it was a long press or scroll
                    if (!touchMoved && touchDuration < 500) {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleImage();
                    }
                    touchStartTime = 0;
                    touchMoved = false;
                }
            }, { passive: false });
            
            // Click for desktop and fallback
            item.addEventListener('click', function(e) {
                if (e.pointerType !== 'touch') {
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

