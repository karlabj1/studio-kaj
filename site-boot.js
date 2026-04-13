(function () {
    'use strict';

    /**
     * Never set transform/filter on document.body: that breaks position:fixed descendants
     * (menu overlay, etc.) and can blank the compositor in Chrome/Safari.
     */
    function nudgeRepaint() {
        requestAnimationFrame(function () {
            void document.documentElement.offsetHeight;
            var y = window.pageYOffset || document.documentElement.scrollTop || 0;
            window.scrollTo(0, y);
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
