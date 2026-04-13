(function () {
    'use strict';

    function nudgeRepaint() {
        requestAnimationFrame(function () {
            var b = document.body;
            if (!b) return;
            b.style.transform = 'translateZ(0)';
            void b.offsetWidth;
            b.style.transform = '';
        });
    }

    // BFCache / swipe-back, back-forward, and tab/app switch: WebKit often leaves a blank white
    // view until something forces a repaint (especially with fixed-position layout on the home page).
    window.addEventListener(
        'pageshow',
        function (event) {
            if (event.persisted) {
                nudgeRepaint();
                return;
            }
            try {
                var nav = performance.getEntriesByType('navigation')[0];
                if (nav && nav.type === 'back_forward') {
                    nudgeRepaint();
                }
            } catch (e) {
                /* ignore */
            }
        },
        false
    );

    document.addEventListener(
        'visibilitychange',
        function () {
            if (document.visibilityState === 'visible') {
                nudgeRepaint();
            }
        },
        false
    );

    if (!document.documentElement.hasAttribute('data-viewport-fix')) return;

    function setHeight() {
        var vh = window.innerHeight;
        document.documentElement.style.setProperty('--vh', vh + 'px');
        document.documentElement.style.height = vh + 'px';
        if (document.body) {
            document.body.style.height = vh + 'px';
        }
    }

    setHeight();
    window.addEventListener('resize', setHeight, false);
    window.addEventListener('orientationchange', function () {
        setTimeout(setHeight, 100);
    });

    window.addEventListener(
        'load',
        function () {
            requestAnimationFrame(nudgeRepaint);
        },
        false
    );
})();
