// Valida los campos del formulario y muestra la confirmación de envío

const formulario = document.querySelector("#formulario-contacto");
const confirmacion = document.querySelector("#confirmacion");

function mostrarError(campo, mensaje) {
  document.querySelector(`#error-${campo}`).textContent = mensaje;
  document.querySelector(`#${campo}`).classList.add("invalido");
}

function limpiarErrores() {
  document.querySelectorAll(".error").forEach((elemento) => {
    elemento.textContent = "";
  });

  document.querySelectorAll(".invalido").forEach((elemento) => {
    elemento.classList.remove("invalido");
  });

  confirmacion.textContent = "";
}

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  limpiarErrores();

  const nombre = document.querySelector("#nombre").value.trim();
  const correo = document.querySelector("#correo").value.trim();
  const asunto = document.querySelector("#asunto").value.trim();
  const mensaje = document.querySelector("#mensaje").value.trim();
  let valido = true;

  if (nombre.length < 3) {
    mostrarError("nombre", "Escribe un nombre de al menos 3 caracteres.");
    valido = false;
  }

  if (!correoValido(correo)) {
    mostrarError("correo", "Introduce un correo electrónico válido.");
    valido = false;
  }

  if (asunto.length < 3) {
    mostrarError("asunto", "Escribe un asunto de al menos 3 caracteres.");
    valido = false;
  }

  if (mensaje.length < 10) {
    mostrarError("mensaje", "El mensaje debe tener al menos 10 caracteres.");
    valido = false;
  }

  if (!valido) return;

  confirmacion.textContent =
    "Mensaje enviado correctamente. Gracias por contactar con TechNews.";
  formulario.reset();
});
