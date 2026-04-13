(function () {
    'use strict';

    // BFCache / swipe-back restore: nudge a repaint so Safari does not leave a blank white view.
    window.addEventListener(
        'pageshow',
        function (event) {
            if (!event.persisted) return;
            requestAnimationFrame(function () {
                var b = document.body;
                if (!b) return;
                b.style.transform = 'translateZ(0)';
                void b.offsetWidth;
                b.style.transform = '';
            });
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
})();
