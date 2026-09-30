// Gestiona la creación y eliminación de noticias mediante localStorage

const formularioNoticia = document.querySelector("#formulario-noticia");
const listaAdmin = document.querySelector("#lista-admin");
const estadoAdmin = document.querySelector("#estado-admin");
const mensajeAdmin = document.querySelector("#mensaje-admin");

let noticiasBase = [];

function obtenerCreadas() {
  return JSON.parse(localStorage.getItem("technewsNoticiasCreadas")) || [];
}

function obtenerEliminadas() {
  return JSON.parse(localStorage.getItem("technewsNoticiasEliminadas")) || [];
}

function obtenerTodasVisibles() {
  const eliminadas = obtenerEliminadas();
  return [...noticiasBase, ...obtenerCreadas()].filter(
    (noticia) => !eliminadas.includes(noticia.id)
  );
}

function siglaCategoria(categoria) {
  const siglas = {
    "Inteligencia artificial": "IA",
    Desarrollo: "SW",
    Cloud: "CL",
    Ciberseguridad: "CS",
    Innovación: "IN"
  };
  return siglas[categoria] || "TN";
}

function mostrarAdmin() {
  const noticias = obtenerTodasVisibles();
  estadoAdmin.textContent = `${noticias.length} noticia(s) disponible(s)`;

  listaAdmin.innerHTML = noticias.map((noticia) => `
    <article class="item-admin">
      <div>
        <span class="categoria">${noticia.categoria}</span>
        <h3>${noticia.titulo}</h3>
      </div>
      <button class="boton boton-peligro eliminar-admin"
        type="button" data-id="${noticia.id}">Eliminar</button>
    </article>
  `).join("");

  document.querySelectorAll(".eliminar-admin").forEach((boton) => {
    boton.addEventListener("click", () => eliminarNoticia(Number(boton.dataset.id)));
  });
}

function eliminarNoticia(id) {
  const creadas = obtenerCreadas();
  const esCreada = creadas.some((noticia) => noticia.id === id);

  if (esCreada) {
    const actualizadas = creadas.filter((noticia) => noticia.id !== id);
    localStorage.setItem("technewsNoticiasCreadas", JSON.stringify(actualizadas));
  } else {
    const eliminadas = obtenerEliminadas();
    if (!eliminadas.includes(id)) eliminadas.push(id);
    localStorage.setItem("technewsNoticiasEliminadas", JSON.stringify(eliminadas));
  }

  mostrarAdmin();
}

formularioNoticia.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const titulo = document.querySelector("#titulo").value.trim();
  const categoria = document.querySelector("#categoria-admin").value;
  const descripcion = document.querySelector("#descripcion").value.trim();
  const contenido = document.querySelector("#contenido").value.trim();

  if (titulo.length < 5 || !categoria || descripcion.length < 10 || contenido.length < 20) {
    mensajeAdmin.textContent = "Completa correctamente todos los campos.";
    mensajeAdmin.classList.add("mensaje-error");
    return;
  }

  const nuevaNoticia = {
    id: Date.now(),
    sigla: siglaCategoria(categoria),
    titulo,
    categoria,
    descripcion,
    contenido,
    fecha: new Date().toLocaleDateString("es-CO"),
    autor: "Equipo TechNews"
  };

  const creadas = obtenerCreadas();
  creadas.push(nuevaNoticia);
  localStorage.setItem("technewsNoticiasCreadas", JSON.stringify(creadas));

  formularioNoticia.reset();
  mensajeAdmin.classList.remove("mensaje-error");
  mensajeAdmin.textContent = "Noticia creada correctamente.";
  mostrarAdmin();
});

async function iniciarAdmin() {
  try {
    const respuesta = await fetch("data/noticias.json");
    if (!respuesta.ok) throw new Error("No se pudo leer noticias.json");
    noticiasBase = await respuesta.json();
    mostrarAdmin();
  } catch (error) {
    estadoAdmin.textContent = "No fue posible cargar las noticias.";
    console.error(error);
  }
}

iniciarAdmin();
