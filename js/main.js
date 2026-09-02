/**
 * Navegación activa (scrollspy) + scroll suave.
 * Resalta el enlace del menú lateral según la sección visible
 * y desplaza suavemente al hacer clic, actualizando la URL.
 */
(function () {
  'use strict';

  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__list a[href^="#"]')
  );
  if (!links.length) return;

  // Mapa: id de sección -> enlace del menú
  var linkById = {};
  var sections = [];

  links.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (!section) return;
    linkById[id] = link;
    sections.push(section);
  });

  function setActive(id) {
    links.forEach(function (link) {
      var isActive = link === linkById[id];
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // ---- Scrollspy con IntersectionObserver ----
  if ('IntersectionObserver' in window) {
    var visible = {};

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });

        // Elige la sección visible con mayor proporción en pantalla
        var currentId = null;
        var maxRatio = 0;
        Object.keys(visible).forEach(function (id) {
          if (visible[id] > maxRatio) {
            maxRatio = visible[id];
            currentId = id;
          }
        });

        if (currentId) setActive(currentId);
      },
      {
        // Zona de activación: franja central de la ventana
        rootMargin: '-40% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ---- Scroll suave al hacer clic ----
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;

      e.preventDefault();
      section.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      setActive(id);

      // Actualiza la URL sin salto brusco
      if (history.replaceState) {
        history.replaceState(null, '', '#' + id);
      }
    });
  });

  // Estado inicial según el hash de la URL o la primera sección
  var initialId =
    (location.hash && linkById[location.hash.slice(1)])
      ? location.hash.slice(1)
      : sections[0].id;
  setActive(initialId);
})();

/**
 * Validación del formulario de contacto.
 * El sitio es estático (sin servidor), así que sólo valida en el
 * navegador y muestra un mensaje de confirmación.
 */
(function () {
  'use strict';

  var form = document.getElementById('form-contacto');
  if (!form) return;

  var feedback = document.getElementById('form-feedback');
  var campos = {
    nombre: form.elements.nombre,
    correo: form.elements.correo,
    mensaje: form.elements.mensaje
  };

  function mostrar(mensaje, ok) {
    feedback.textContent = mensaje;
    feedback.classList.toggle('is-ok', ok);
    feedback.classList.toggle('is-error', !ok);
  }

  function validar() {
    var errores = [];

    if (campos.nombre.value.trim().length < 2) {
      errores.push(campos.nombre);
    }
    // Validación de email: usa la del navegador + un patrón básico
    var correo = campos.correo.value.trim();
    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      errores.push(campos.correo);
    }
    if (campos.mensaje.value.trim().length < 10) {
      errores.push(campos.mensaje);
    }

    Object.keys(campos).forEach(function (k) {
      campos[k].classList.remove('is-invalid');
    });
    errores.forEach(function (campo) {
      campo.classList.add('is-invalid');
    });

    return errores;
  }

  // Quita el error de un campo en cuanto el usuario lo corrige
  Object.keys(campos).forEach(function (k) {
    campos[k].addEventListener('input', function () {
      campos[k].classList.remove('is-invalid');
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var errores = validar();

    if (errores.length) {
      mostrar('Revisa los campos marcados antes de enviar.', false);
      errores[0].focus();
      return;
    }

    mostrar(
      '¡Gracias, ' +
        campos.nombre.value.trim() +
        '! Tu mensaje se ha registrado correctamente.',
      true
    );
    form.reset();
  });
})();
