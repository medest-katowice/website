(function () {
  'use strict';

  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');

  if (!toggle || !menu) return;

  function closeMenu() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Otwórz menu');
  }

  function toggleMenu() {
    var isOpen = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
  }

  toggle.addEventListener('click', toggleMenu);

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) closeMenu();
  });
})();
