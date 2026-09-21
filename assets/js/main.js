/**
 * Colour-scheme toggle.
 *
 * The no-flash script in head/theme-init.html has already applied any stored
 * preference to <html data-theme> before first paint. This only handles the
 * button: flipping the attribute, persisting the choice, and keeping the
 * button's pressed state in sync for assistive technology.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'hugo-pulse:theme';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function systemTheme() {
    return media.matches ? 'dark' : 'light';
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || systemTheme();
  }

  function syncButtons() {
    var isDark = currentTheme() === 'dark';
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* Private mode or blocked storage: the choice just won't persist. */
    }
    syncButtons();
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-theme-toggle]');
    if (!button) {
      return;
    }
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  /* Follow the system while the reader has not pinned a choice. */
  media.addEventListener('change', function () {
    if (!root.hasAttribute('data-theme')) {
      syncButtons();
    }
  });

  syncButtons();
})();
