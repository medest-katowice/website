(function () {
  'use strict';

  var pan = document.getElementById('noise-pan');
  var sep = document.querySelector('.separator');
  var scroller = document.querySelector('.scroll-right');
  var mobileLayout = window.matchMedia('(max-width: 1024px)');
  var root = document.documentElement;

  if (!pan || !sep || !scroller) return;

  var raf = 0;
  var running = true;

  // Animation: compound sine waves → organic feOffset drift
  function animate(t) {
    if (!running) return;
    var s = t * 0.001;
    var dx = Math.sin(s * 0.4) * 35 + Math.sin(s * 0.7) * 12;
    var dy = Math.cos(s * 0.3) * 25 + Math.cos(s * 0.55) * 10;
    pan.setAttribute('dx', dx);
    pan.setAttribute('dy', dy);
    raf = requestAnimationFrame(animate);
  }

  raf = requestAnimationFrame(animate);

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

    if (opacity < 0.01 && running) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (opacity >= 0.01 && !running) {
      running = true;
      raf = requestAnimationFrame(animate);
    }
  }

  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  onScroll();
})();
