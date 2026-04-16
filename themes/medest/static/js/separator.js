(function () {
  'use strict';

  var sep = document.querySelector('.separator');
  var scroller = document.querySelector('.scroll-right');
  var mobileLayout = window.matchMedia('(max-width: 1024px)');
  var root = document.documentElement;

  if (!sep || !scroller) return;

  // Scroll-based fade: quadratic ease, fully faded at 75vh
  var fadeEnd = window.innerHeight * 0.75;

  function getScrollY() {
    if (mobileLayout.matches) {
      return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    return scroller.scrollTop;
  }

  function onResize() {
    fadeEnd = window.innerHeight * 0.75;
    onScroll();
  }

  function onScroll() {
    var scrollY = getScrollY();
    var t = Math.min(scrollY / fadeEnd, 1);
    var opacity = 1 - t * t;
    var dividerOpacity = (t * t * 0.14).toFixed(3);

    sep.style.opacity = opacity;
    root.style.setProperty('--pane-divider-opacity', dividerOpacity);
  }

  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  onScroll();
})();
