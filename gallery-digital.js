// Optimized gallery script for digital page with series support
(function() {
    'use strict';
    
    let initialized = false;
    
    function initGallery() {
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
            
            const handleInteraction = function() {
                const isRegular = item.getAttribute('data-regular') === 'true';
                const seriesName = item.getAttribute('data-series');
                
                if (isRegular) {
                    // Regular image - toggle individually
                    const isExpanded = item.classList.contains('expanded');
                    if (isExpanded) {
                        item.classList.remove('expanded');
                        item.classList.add('collapsed');
                    } else {
                        item.classList.remove('collapsed');
                        item.classList.add('expanded');
                    }
                } else if (seriesName) {
                    // Series image - expand/collapse entire series
                    const seriesItems = Array.from(document.querySelectorAll(`[data-series="${seriesName}"]`));
                    const isAnyExpanded = seriesItems.some(img => img.classList.contains('expanded'));
                    
                    if (isAnyExpanded) {
                        // Collapse this series
                        seriesItems.forEach(img => {
                            img.classList.remove('expanded');
                            img.classList.add('collapsed');
                        });
                    } else {
                        // Collapse all other series first
                        const allSeriesItems = Array.from(document.querySelectorAll('[data-series]'));
                        allSeriesItems.forEach(img => {
                            const imgSeries = img.getAttribute('data-series');
                            if (imgSeries !== seriesName && img.classList.contains('expanded')) {
                                img.classList.remove('expanded');
                                img.classList.add('collapsed');
                            }
                        });
                        
                        // Expand this series
                        seriesItems.forEach(img => {
                            img.classList.remove('collapsed');
                            img.classList.add('expanded');
                        });
                    }
                }
            };
            
            // Use pointer events for better performance
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
                    if (!touchMoved && touchDuration < 500) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleInteraction();
                    }
                    touchStartTime = 0;
                    touchMoved = false;
                }
            }, { passive: false });
            
            item.addEventListener('click', function(e) {
                if (e.pointerType !== 'touch') {
                    handleInteraction();
                }
            });
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery, { once: true });
    } else {
        initGallery();
    }
})();

