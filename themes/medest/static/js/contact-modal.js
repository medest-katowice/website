(function () {
  'use strict';

  var modal = document.getElementById('contact-modal');
  if (!modal) return;

  var form = modal.querySelector('[data-contact-form]');
  var status = modal.querySelector('[data-contact-form-status]');
  var submitButton = modal.querySelector('[data-contact-form-submit]');
  var cancelButton = modal.querySelector('[data-contact-form-cancel]');
  var title = modal.querySelector('[data-contact-modal-title]');
  var intro = modal.querySelector('[data-contact-modal-intro]');
  var successPanel = modal.querySelector('[data-contact-form-success]');
  var turnstileContainer = modal.querySelector('[data-turnstile-container]');
  var triggers = document.querySelectorAll('.js-open-contact-modal');
  var closeButtons = modal.querySelectorAll('[data-close-contact-modal]');
  var firstInput = modal.querySelector('[data-contact-first-input]');
  var inputs = form ? form.querySelectorAll('input, textarea') : [];
  var inlineInputs = form ? form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]') : [];
  var menuToggle = document.querySelector('.menu-toggle');
  var defaultButtonLabel = submitButton ? submitButton.textContent : '';
  var defaultTitle = title ? title.dataset.titleDefault : '';
  var successTitle = title ? title.dataset.titleSuccess : '';
  var hasTurnstile = !!turnstileContainer;

  function syncMenuState() {
    if (!menuToggle) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Otwórz menu');
  }

  function clearStatus() {
    if (!status) return;
    status.textContent = '';
    status.dataset.state = '';
  }

  function getTurnstileResponse() {
    if (!form) return '';
    var responseField = form.querySelector('input[name="cf-turnstile-response"]');
    return responseField ? responseField.value.trim() : '';
  }

  function resetFormState() {
    clearStatus();
    setDefaultView();

    if (form) {
      form.reset();
    }
  }

  function setDefaultView() {
    modal.classList.remove('contact-modal--success');

    if (title && defaultTitle) {
      title.textContent = defaultTitle;
    }

    if (intro) {
      intro.hidden = false;
    }

    if (form) {
      form.hidden = false;
    }

    if (successPanel) {
      successPanel.hidden = true;
    }
  }

  function setSuccessView() {
    modal.classList.add('contact-modal--success');

    if (title && successTitle) {
      title.textContent = successTitle;
    }

    if (intro) {
      intro.hidden = true;
    }

    if (form) {
      form.hidden = true;
    }

    if (successPanel) {
      successPanel.hidden = false;
    }
  }

  function closeModal() {
    document.body.classList.remove('contact-form-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function openModal() {
    document.body.classList.remove('nav-open');
    syncMenuState();
    document.body.classList.add('contact-form-open');
    modal.setAttribute('aria-hidden', 'false');
    resetFormState();

    if (firstInput) {
      window.setTimeout(function () {
        firstInput.focus();
      }, 50);
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      openModal();
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener('click', closeModal);
  });

  if (cancelButton) {
    cancelButton.addEventListener('click', function () {
      resetFormState();
      closeModal();
    });
  }

  inlineInputs.forEach(function (input, index) {
    input.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter') return;

      event.preventDefault();

      var nextField = inputs[index + 1];
      if (nextField) {
        nextField.focus();
      }
    });
  });

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeModal();
  });

  if (!form || !submitButton) return;

  window.onMedestTurnstileSuccess = function () {
    clearStatus();
  };

  window.onMedestTurnstileError = function () {
    status.textContent = 'Nie udało się załadować weryfikacji antyspamowej. Odśwież stronę i spróbuj ponownie.';
    status.dataset.state = 'error';
  };

  window.onMedestTurnstileExpired = function () {
    status.textContent = 'Weryfikacja antyspamowa wygasła. Potwierdź ją ponownie.';
    status.dataset.state = 'error';
  };

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearStatus();

    if (hasTurnstile && !getTurnstileResponse()) {
      status.textContent = 'Potwierdź, że nie jesteś robotem, a potem wyślij formularz.';
      status.dataset.state = 'error';
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Wysyłanie...';

    try {
      var formData = new FormData(form);
      var payload = new URLSearchParams();

      formData.forEach(function (value, key) {
        if (typeof value === 'string' && value.trim() !== '') {
          payload.append(key, value);
        }
      });

      var response = await fetch(form.action, {
        method: 'POST',
        body: payload,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      });

      if (!response.ok) {
        throw new Error('FORM_SUBMIT_FAILED');
      }

      clearStatus();
      setSuccessView();
    } catch (error) {
      setDefaultView();
      status.textContent = 'Nie udało się wysłać wiadomości. Spróbuj ponownie albo skontaktuj się telefonicznie.';
      status.dataset.state = 'error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonLabel;
    }
  });
})();
