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

    function isHome() {
        return document.body && document.body.hasAttribute('data-home');
    }

    window.addEventListener(
        'pageshow',
        function (event) {
            if (isHome()) {
                nudgeRepaint();
                requestAnimationFrame(nudgeRepaint);
                return;
            }
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

})();
