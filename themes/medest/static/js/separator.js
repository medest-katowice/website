(function () {
  'use strict';

  var sep = document.querySelector('.separator');
  var scroller = document.querySelector('.scroll-right');
  var root = document.documentElement;
  var mobileLayout = window.matchMedia('(max-width: 1024px)');

  if (!sep || !scroller) return;

  function isIOSWebKit() {
    var ua = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var isWebKit = /WebKit/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    return isIOS && isWebKit;
  }

  if (!isIOSWebKit()) return;

  document.body.classList.add('separator-js-fallback');

  function getScrollY() {
    if (mobileLayout.matches) {
      return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    return scroller.scrollTop;
  }

  function refreshSeparator() {
    var fadeEnd = Math.max(window.innerHeight * 0.55, 1);
    var scrollY = getScrollY();
    var t = Math.min(scrollY / fadeEnd, 1);
    var progress = t * t;

    sep.style.opacity = String(1 - progress);
    root.style.setProperty('--pane-divider-opacity', progress.toFixed(3));
  }

  scroller.addEventListener('scroll', refreshSeparator, { passive: true });
  window.addEventListener('scroll', refreshSeparator, { passive: true });
  window.addEventListener('resize', refreshSeparator, { passive: true });
  window.addEventListener('orientationchange', refreshSeparator, { passive: true });
  window.addEventListener('pageshow', function () {
    requestAnimationFrame(function () {
      requestAnimationFrame(refreshSeparator);
    });
  });

  refreshSeparator();
})();
