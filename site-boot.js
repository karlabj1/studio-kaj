(function () {
    'use strict';

    /** Bump `version.txt` on each production deploy so returning visitors auto-reload once. */
    var DEPLOY_VERSION_KEY = 'kaj_deploy_v';

    function stripKajEphemeralParams() {
        try {
            var u = new URL(location.href);
            var changed = false;
            if (u.searchParams.has('_kajcb')) {
                u.searchParams.delete('_kajcb');
                changed = true;
            }
            if (u.searchParams.has('_kajnav')) {
                u.searchParams.delete('_kajnav');
                changed = true;
            }
            if (!changed) return;
            history.replaceState(null, '', u.pathname + u.search + u.hash);
        } catch (e) {
            /* ignore */
        }
    }

    /**
     * Compare /version.txt (always fetched with no-store) to localStorage. If the deploy
     * id changed, reload once with a query param so the browser must revalidate HTML.
     * After reload, strip the param. No user action required.
     */
    function syncDeployVersion() {
        if (location.protocol === 'file:') return;
        if (typeof fetch === 'undefined') return;

        var hadCb = false;
        try {
            hadCb = new URL(location.href).searchParams.has('_kajcb');
        } catch (e0) {
            return;
        }

        fetch('/version.txt', { cache: 'no-store', credentials: 'same-origin' })
            .then(function (r) {
                return r.ok ? r.text() : '';
            })
            .then(function (text) {
                var serverV = (text || '').trim();
                if (!serverV) return;

                if (hadCb) {
                    try {
                        localStorage.setItem(DEPLOY_VERSION_KEY, serverV);
                    } catch (e1) {
                        /* ignore */
                    }
                    stripKajEphemeralParams();
                    return;
                }

                var prev = null;
                try {
                    prev = localStorage.getItem(DEPLOY_VERSION_KEY);
                } catch (e2) {
                    /* ignore */
                }

                if (prev && prev !== serverV) {
                    var u = new URL(location.href);
                    u.searchParams.set('_kajcb', String(Date.now()));
                    location.replace(u.toString());
                    return;
                }

                try {
                    localStorage.setItem(DEPLOY_VERSION_KEY, serverV);
                } catch (e3) {
                    /* ignore */
                }
            })
            .catch(function () {
                /* offline or blocked — do not reload */
            });
    }

    syncDeployVersion();

    /** After deploy/version logic, clean ?_kajcb / ?_kajnav from the address bar. */
    stripKajEphemeralParams();

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
     * Logo: on home, scroll to top (no reload). On other pages, assign home with ?_kajnav=
     * so Chrome/Vercel must fetch HTML instead of reusing a blank cached shell.
     */
    function attachLogoNavigation() {
        document.querySelectorAll('a.logo').forEach(function (a) {
            if (a.getAttribute('data-kaj-logo-nav') === '1') return;
            a.setAttribute('data-kaj-logo-nav', '1');
            a.addEventListener(
                'click',
                function (e) {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();

                    if (document.body && document.body.hasAttribute('data-home')) {
                        window.scrollTo(0, 0);
                        return;
                    }

                    if (location.protocol === 'file:') {
                        try {
                            location.assign(new URL('index.html', location.href).href);
                        } catch (err) {
                            location.assign('index.html');
                        }
                        return;
                    }

                    try {
                        var dest = new URL(homePageHref());
                        dest.searchParams.set('_kajnav', String(Date.now()));
                        location.assign(dest.href);
                    } catch (err2) {
                        location.assign(homePageHref());
                    }
                },
                false
            );
        });
    }

    function runHomeFixes() {
        applyHomeLinks();
        attachLogoNavigation();
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
