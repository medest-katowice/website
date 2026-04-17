(function () {
  'use strict';

  var sep = document.querySelector('.separator');
  var scroller = document.querySelector('.scroll-right');
  var root = document.documentElement;
  var mobileLayout = window.matchMedia('(max-width: 1024px)');
  var viewport = window.visualViewport || null;
  var rafId = 0;
  var trailingFrames = 0;
  var lastScrollY = -1;

  if (!sep || !scroller) return;

  function isIOSWebKit() {
    var ua = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var isWebKit = /WebKit/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    return isIOS && isWebKit;
  }

  if (!isIOSWebKit()) return;

  document.body.classList.add('separator-js-fallback');

  function getMobileScrollY() {
    var scrollingElement = document.scrollingElement || document.documentElement;
    var candidates = [
      window.scrollY,
      window.pageYOffset,
      scrollingElement ? scrollingElement.scrollTop : 0,
      document.documentElement.scrollTop,
      document.body ? document.body.scrollTop : 0,
      viewport ? viewport.pageTop : 0
    ];

    return candidates.reduce(function (max, value) {
      if (typeof value !== 'number' || !isFinite(value)) return max;
      return value > max ? value : max;
    }, 0);
  }

  function getScrollY() {
    if (mobileLayout.matches) {
      return getMobileScrollY();
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

  function runRefreshLoop() {
    rafId = 0;

    var scrollY = getScrollY();
    var moved = Math.abs(scrollY - lastScrollY) > 0.5;

    lastScrollY = scrollY;
    refreshSeparator();

    if (moved || trailingFrames > 0) {
      trailingFrames = Math.max(trailingFrames - 1, 0);
      rafId = requestAnimationFrame(runRefreshLoop);
    }
  }

  function scheduleRefresh(frameBuffer) {
    trailingFrames = Math.max(trailingFrames, frameBuffer || 6);

    if (!rafId) {
      rafId = requestAnimationFrame(runRefreshLoop);
    }
  }

  function refreshAfterLayout(frameBuffer) {
    scheduleRefresh(frameBuffer || 12);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        scheduleRefresh(frameBuffer || 12);
      });
    });
  }

  scroller.addEventListener('scroll', function () {
    scheduleRefresh(8);
  }, { passive: true });

  window.addEventListener('scroll', function () {
    scheduleRefresh(8);
  }, { passive: true });

  window.addEventListener('resize', function () {
    refreshAfterLayout(14);
  }, { passive: true });

  window.addEventListener('orientationchange', function () {
    refreshAfterLayout(18);
  }, { passive: true });

  window.addEventListener('touchstart', function () {
    scheduleRefresh(10);
  }, { passive: true });

  window.addEventListener('touchmove', function () {
    scheduleRefresh(10);
  }, { passive: true });

  window.addEventListener('touchend', function () {
    scheduleRefresh(16);
  }, { passive: true });

  window.addEventListener('load', function () {
    refreshAfterLayout(20);
  }, { passive: true });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      // Restored from back-forward cache. The inline opacity from before
      // caching is still correct. Cancel any pending rAF — it would read
      // scrollY = 0 (not yet restored) and flash the separator to full
      // opacity. The scroll event that fires once the browser finishes
      // restoring the scroll position will trigger scheduleRefresh.
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      trailingFrames = 0;
      return;
    }
    refreshAfterLayout(20);
  });

  if (viewport) {
    viewport.addEventListener('scroll', function () {
      scheduleRefresh(10);
    }, { passive: true });

    viewport.addEventListener('resize', function () {
      refreshAfterLayout(16);
    }, { passive: true });
  }

  if (typeof mobileLayout.addEventListener === 'function') {
    mobileLayout.addEventListener('change', function () {
      refreshAfterLayout(12);
    });
  } else if (typeof mobileLayout.addListener === 'function') {
    mobileLayout.addListener(function () {
      refreshAfterLayout(12);
    });
  }

  refreshSeparator();
  refreshAfterLayout(16);
})();
