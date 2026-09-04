// ===== Modelo de datos: galería (arreglo de objetos) =====
var galeriaData = [
  {
    src: 'images/imagen1.jfif',
    alt: 'Lionel Messi con la camiseta de la selección argentina'
  },
  {
    src: 'images/imagen2.jfif',
    alt: 'Lionel Messi señalando hacia arriba con ambas manos'
  }
];

// Recorre galeriaData y crea cada tarjeta con createElement + appendChild
function renderGaleria() {
  var contenedor = document.getElementById('galeria-contenedor');
  if (!contenedor) return;

  galeriaData.forEach(function (item) {
    var figura = document.createElement('figure');
    figura.className = 'gallery__item';

    var img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.className = 'gallery__img';
    img.loading = 'lazy';

    figura.appendChild(img);
    contenedor.appendChild(figura);
  });
}

// ===== Formulario de contacto =====
var asuntos = {
  consulta: 'Consulta general',
  propuesta: 'Propuesta de proyecto',
  otro: 'Otro'
};

function initFormulario() {
  var form = document.getElementById('form-contacto');
  var modal = document.getElementById('modal-exito');
  var error = document.getElementById('form-error');
  var lista = document.getElementById('lista-mensajes');
  if (!form || !modal) return;

  // Crea un <li> con el resumen del mensaje y lo agrega a la lista
  function agregarMensajeALista(datos) {
    var item = document.createElement('li');
    item.className = 'mensajes__item';

    var fecha = new Date().toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short'
    });

    item.textContent =
      datos.nombre +
      ' — ' +
      (asuntos[datos.asunto] || datos.asunto) +
      ' (' +
      fecha +
      ')';

    lista.appendChild(item);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nombre = form.elements.nombre.value.trim();
    var correo = form.elements.correo.value.trim();
    var asunto = form.elements.asunto.value;
    var mensaje = form.elements.mensaje.value.trim();

    // Validación básica: ningún campo obligatorio puede llegar vacío
    if (!nombre || !correo || !asunto || !mensaje) {
      error.textContent =
        'Completa nombre, correo, asunto y mensaje antes de enviar.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      error.textContent = 'Ingresa un correo válido.';
      return;
    }

    error.textContent = '';
    agregarMensajeALista({ nombre: nombre, asunto: asunto });

    form.reset();
    modal.classList.add('is-open');
  });

  modal.querySelector('.modal__cerrar').addEventListener('click', function () {
    modal.classList.remove('is-open');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderGaleria();
  initFormulario();
});
