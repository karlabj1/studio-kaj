(function () {
    'use strict';

    /**
     * Directory URL for the folder that contains the current HTML file (trailing slash).
     * Used so "home" works on file://, site root, and subfolder hosts (e.g. GitHub Pages).
     */
    function siteDirectoryUrl() {
        if (location.protocol === 'file:') {
            try {
                return new URL('.', location.href).href;
            } catch (e) {
                return location.href;
            }
        }
        var path = location.pathname || '/';
        if (path.endsWith('/')) {
            return location.origin + path;
        }
        var i = path.lastIndexOf('/');
        var dir = i <= 0 ? '/' : path.slice(0, i + 1);
        return location.origin + dir;
    }

    function homePageHref() {
        if (location.protocol === 'file:') {
            try {
                return new URL('index.html', location.href).href;
            } catch (e2) {
                return 'index.html';
            }
        }
        return siteDirectoryUrl();
    }

    function applyHomeLinks() {
        var href = homePageHref();
        document.querySelectorAll('a.logo[href]').forEach(function (a) {
            a.setAttribute('href', href);
        });
    }

    /**
     * On the home page, the logo href points at the same URL as the current document.
     * Following it forces a full reload; Chrome/Vercel often flash a blank document. Stay in place.
     */
    function attachLogoHomeNoReload() {
        if (!document.body || !document.body.hasAttribute('data-home')) return;
        document.querySelectorAll('a.logo').forEach(function (a) {
            if (a.getAttribute('data-kaj-logo-home') === '1') return;
            a.setAttribute('data-kaj-logo-home', '1');
            a.addEventListener(
                'click',
                function (e) {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    window.scrollTo(0, 0);
                },
                false
            );
        });
    }

    function runHomeFixes() {
        applyHomeLinks();
        attachLogoHomeNoReload();
    }

    runHomeFixes();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runHomeFixes);
    }

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
