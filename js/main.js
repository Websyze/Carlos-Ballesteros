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
