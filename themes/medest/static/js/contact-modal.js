(function () {
  'use strict';

  var modal = document.getElementById('contact-modal');
  if (!modal) return;

  var form = modal.querySelector('[data-contact-form]');
  var status = modal.querySelector('[data-contact-form-status]');
  var submitButton = modal.querySelector('[data-contact-form-submit]');
  var triggers = document.querySelectorAll('.js-open-contact-modal');
  var closeButtons = modal.querySelectorAll('[data-close-contact-modal]');
  var firstInput = modal.querySelector('input[name="name"]');
  var menuToggle = document.querySelector('.menu-toggle');
  var defaultButtonLabel = submitButton ? submitButton.textContent : '';

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

  function closeModal() {
    document.body.classList.remove('contact-form-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function openModal() {
    document.body.classList.remove('nav-open');
    syncMenuState();
    document.body.classList.add('contact-form-open');
    modal.setAttribute('aria-hidden', 'false');
    clearStatus();

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

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeModal();
  });

  if (!form || !submitButton) return;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearStatus();

    submitButton.disabled = true;
    submitButton.textContent = 'Wysyłanie...';

    try {
      var response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('FORM_SUBMIT_FAILED');
      }

      form.reset();
      status.textContent = 'Dziękujemy. Wiadomość została wysłana.';
      status.dataset.state = 'success';
    } catch (error) {
      status.textContent = 'Nie udało się wysłać wiadomości. Spróbuj ponownie albo skontaktuj się telefonicznie.';
      status.dataset.state = 'error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonLabel;
    }
  });
})();
