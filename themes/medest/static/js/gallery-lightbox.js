(function () {
  'use strict';

  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox-item]'));

  if (!triggers.length) return;

  var items = triggers.map(function (trigger) {
    return {
      src: trigger.getAttribute('data-lightbox-src'),
      alt: trigger.getAttribute('data-lightbox-alt') || ''
    };
  });

  var lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.setAttribute('hidden', 'hidden');
  lightbox.innerHTML =
    '<div class="gallery-lightbox__backdrop" data-lightbox-close></div>' +
    '<div class="gallery-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Podgląd obrazu">' +
      '<button class="gallery-lightbox__button gallery-lightbox__button--close" type="button" data-lightbox-close aria-label="Zamknij podgląd">&times;</button>' +
      '<button class="gallery-lightbox__button gallery-lightbox__button--prev" type="button" aria-label="Poprzedni obraz">&lsaquo;</button>' +
      '<figure class="gallery-lightbox__figure">' +
        '<img class="gallery-lightbox__image" alt="">' +
        '<figcaption class="gallery-lightbox__caption"></figcaption>' +
        '<div class="gallery-lightbox__counter" aria-live="polite"></div>' +
      '</figure>' +
      '<button class="gallery-lightbox__button gallery-lightbox__button--next" type="button" aria-label="Następny obraz">&rsaquo;</button>' +
    '</div>';

  document.body.appendChild(lightbox);

  var image = lightbox.querySelector('.gallery-lightbox__image');
  var caption = lightbox.querySelector('.gallery-lightbox__caption');
  var counter = lightbox.querySelector('.gallery-lightbox__counter');
  var dialog = lightbox.querySelector('.gallery-lightbox__dialog');
  var swipeSurface = lightbox.querySelector('.gallery-lightbox__figure');
  var closeButtons = lightbox.querySelectorAll('[data-lightbox-close]');
  var prevButton = lightbox.querySelector('.gallery-lightbox__button--prev');
  var nextButton = lightbox.querySelector('.gallery-lightbox__button--next');
  var closeButton = lightbox.querySelector('.gallery-lightbox__button--close');
  var currentIndex = 0;
  var lastTrigger = null;
  var touchStartX = 0;
  var touchStartY = 0;
  var hasTouchGesture = false;

  function renderItem(index) {
    currentIndex = (index + items.length) % items.length;

    image.src = items[currentIndex].src;
    image.alt = items[currentIndex].alt;
    caption.textContent = items[currentIndex].alt;
    counter.textContent = (currentIndex + 1) + ' / ' + items.length;

    var multipleItems = items.length > 1;
    prevButton.hidden = !multipleItems;
    nextButton.hidden = !multipleItems;
  }

  function openLightbox(index, trigger) {
    lastTrigger = trigger;
    renderItem(index);
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;

    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');

    if (lastTrigger) {
      lastTrigger.focus();
    }
  }

  triggers.forEach(function (trigger, index) {
    trigger.addEventListener('click', function () {
      openLightbox(index, trigger);
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener('click', closeLightbox);
  });

  lightbox.addEventListener('click', function (event) {
    if (lightbox.hidden) return;
    if (event.target.closest('.gallery-lightbox__button')) return;
    if (event.target === image) return;

    closeLightbox();
  });

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) {
      closeLightbox();
    }
  });

  prevButton.addEventListener('click', function () {
    renderItem(currentIndex - 1);
  });

  nextButton.addEventListener('click', function () {
    renderItem(currentIndex + 1);
  });

  swipeSurface.addEventListener('touchstart', function (event) {
    if (event.touches.length !== 1) return;

    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    hasTouchGesture = true;
  }, { passive: true });

  swipeSurface.addEventListener('touchend', function (event) {
    if (!hasTouchGesture || event.changedTouches.length !== 1) return;

    var deltaX = event.changedTouches[0].clientX - touchStartX;
    var deltaY = event.changedTouches[0].clientY - touchStartY;

    hasTouchGesture = false;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX > 0) {
      renderItem(currentIndex - 1);
      return;
    }

    renderItem(currentIndex + 1);
  }, { passive: true });

  swipeSurface.addEventListener('touchcancel', function () {
    hasTouchGesture = false;
  }, { passive: true });

  window.addEventListener('keydown', function (event) {
    if (lightbox.hidden) return;

    if (event.key === 'Escape') {
      closeLightbox();
      return;
    }

    if (event.key === 'ArrowLeft') {
      renderItem(currentIndex - 1);
      return;
    }

    if (event.key === 'ArrowRight') {
      renderItem(currentIndex + 1);
    }
  });
})();
