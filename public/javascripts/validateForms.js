// Bootstrap validation trigger
      (function () {
        'use strict'
        const forms = document.querySelectorAll('form')

        Array.from(forms).forEach(function (form) {
          form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
              const firstInvalid = form.querySelector(':invalid');
              if (firstInvalid) {
                firstInvalid.focus(); // focus the first invalid input
              }
            }
            form.classList.add('was-validated')
          }, false)
        })
      })()