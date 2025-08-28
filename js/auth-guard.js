(function() {
    'use strict';

    function redirectToLogin() {
        var current = window.location.pathname.split('/').pop() || '';
        if (current !== 'auth.html') {
            window.location.href = './auth.html';
        }
    }

    function init() {
        if (!window.sb || !window.sb.auth) {
            // Supabase client not yet ready; retry shortly
            setTimeout(init, 100);
            return;
        }

        window.sb.auth.getSession().then(function(result) {
            var session = result && result.data ? result.data.session : null;
            if (!session) {
                redirectToLogin();
            }
        });

        // React to auth state changes
        window.sb.auth.onAuthStateChange(function(event, session) {
            if (!session) {
                redirectToLogin();
            }
        });

        // Bind logout handlers if present
        document.addEventListener('click', function(e) {
            var target = e.target;
            if (!target) return;

            // Match elements with data-action="logout" or links to auth.html explicitly
            var logoutEl = target.closest('[data-action="logout"], a[href$="auth.html"]');
            if (logoutEl && logoutEl.matches('[data-action="logout"]')) {
                e.preventDefault();
                if (window.sb && window.sb.auth && window.sb.auth.signOut) {
                    window.sb.auth.signOut().finally(function() {
                        window.location.href = './auth.html';
                    });
                } else {
                    window.location.href = './auth.html';
                }
            }
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

