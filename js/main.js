// Al enviar el formulario de contacto, muestra el modal de confirmación.
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('form-contacto');
  var modal = document.getElementById('modal-exito');
  if (!form || !modal) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.reset();
    modal.classList.add('is-open');
  });

  modal.querySelector('.modal__cerrar').addEventListener('click', function () {
    modal.classList.remove('is-open');
  });
});
