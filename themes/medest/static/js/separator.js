(function () {
  'use strict';

  var sep = document.querySelector('.separator');
  var scroller = document.querySelector('.scroll-right');
  var root = document.documentElement;
  var mobileLayout = window.matchMedia('(max-width: 1024px)');
  var viewport = window.visualViewport || null;
  var rafId = 0;
  var restoreRafId = 0;
  var savedScrollY = -1;
  var isRestoring = false;

  if (!sep || !scroller) return;

  function getPageScrollY() {
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

  function usesPageScroll() {
    return mobileLayout.matches;
  }

  function getScrollY() {
    if (usesPageScroll()) {
      return getPageScrollY();
    }

    return scroller.scrollTop;
  }

  function applyProgress(scrollY) {
    var fadeEnd = Math.max(window.innerHeight * 0.55, 1);
    var t = Math.min(Math.max(scrollY / fadeEnd, 0), 1);
    var progress = t * t;

    sep.style.opacity = String(1 - progress);
    root.style.setProperty('--pane-divider-opacity', progress.toFixed(3));
    savedScrollY = scrollY;
  }

  function refreshSeparator() {
    applyProgress(getScrollY());
  }

  function cancelScheduledRefreshes() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }

    if (restoreRafId) {
      cancelAnimationFrame(restoreRafId);
      restoreRafId = 0;
    }
  }

  function scheduleRefresh() {
    if (isRestoring || rafId) return;

    rafId = requestAnimationFrame(function () {
      rafId = 0;
      refreshSeparator();
    });
  }

  function waitForRestoredScroll() {
    var targetScrollY = savedScrollY;
    var attemptsRemaining = 60;

    isRestoring = true;

    function poll() {
      restoreRafId = 0;

      var scrollY = getScrollY();
      var restored = targetScrollY < 0 || Math.abs(scrollY - targetScrollY) <= 0.5;

      if (restored || attemptsRemaining <= 0) {
        isRestoring = false;
        applyProgress(scrollY);
        return;
      }

      attemptsRemaining -= 1;
      restoreRafId = requestAnimationFrame(poll);
    }

    restoreRafId = requestAnimationFrame(poll);
  }

  scroller.addEventListener('scroll', scheduleRefresh, { passive: true });
  window.addEventListener('scroll', scheduleRefresh, { passive: true });
  window.addEventListener('resize', scheduleRefresh, { passive: true });
  window.addEventListener('orientationchange', scheduleRefresh, { passive: true });

  window.addEventListener('load', function () {
    scheduleRefresh();
  }, { passive: true });

  window.addEventListener('pagehide', function () {
    savedScrollY = getScrollY();
    isRestoring = false;
    cancelScheduledRefreshes();
  });

  window.addEventListener('pageshow', function (event) {
    cancelScheduledRefreshes();

    if (event.persisted) {
      waitForRestoredScroll();
      return;
    }

    isRestoring = false;
    scheduleRefresh();
  });

  if (viewport) {
    viewport.addEventListener('scroll', scheduleRefresh, { passive: true });
    viewport.addEventListener('resize', scheduleRefresh, { passive: true });
  }

  if (typeof mobileLayout.addEventListener === 'function') {
    mobileLayout.addEventListener('change', scheduleRefresh);
  } else if (typeof mobileLayout.addListener === 'function') {
    mobileLayout.addListener(scheduleRefresh);
  }

  refreshSeparator();
})();
