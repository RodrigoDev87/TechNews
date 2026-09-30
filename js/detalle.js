// Muestra el detalle de una noticia y permite guardarla en favoritos

const estadoDetalle = document.querySelector("#estado-detalle");
const contenedorDetalle = document.querySelector("#detalle-noticia");
const parametros = new URLSearchParams(window.location.search);
const idNoticia = Number(parametros.get("id"));

function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem("technewsFavoritos")) || [];
}

function guardarEnFavoritos(noticia) {
  const favoritos = obtenerFavoritos();

  if (favoritos.some((favorito) => favorito.id === noticia.id)) {
    alert("Esta noticia ya está en favoritos.");
    return;
  }

  favoritos.push(noticia);
  localStorage.setItem("technewsFavoritos", JSON.stringify(favoritos));
  alert("Noticia añadida a favoritos.");
}

function mostrarDetalle(noticia) {
  contenedorDetalle.innerHTML = `
    <img
      class="imagen-detalle"
      src="img/noticias.jpg"
      alt="Imagen de ${noticia.titulo}"
    >

    <div class="detalle-contenido">
      <span class="categoria">${noticia.categoria}</span>
      <h1>${noticia.titulo}</h1>
      <p class="metadatos">${noticia.fecha} | ${noticia.autor}</p>
      <p>${noticia.contenido}</p>

      <div class="acciones-detalle">
        <button id="boton-favorito" class="boton" type="button">
          Agregar a favoritos
        </button>
        <a class="boton boton-secundario" href="noticias.html">
          Volver a noticias
        </a>
      </div>
    </div>
  `;

  contenedorDetalle.hidden = false;
  estadoDetalle.textContent = "";

  document
    .querySelector("#boton-favorito")
    .addEventListener("click", () => guardarEnFavoritos(noticia));
}

async function cargarDetalle() {
  if (!idNoticia) {
    estadoDetalle.textContent = "No se indicó una noticia válida.";
    return;
  }

  try {
    const respuesta = await fetch("data/noticias.json");
    if (!respuesta.ok) {
      throw new Error("No se pudo leer noticias.json");
    }

    const noticiasBase = await respuesta.json();
    const noticiasCreadas =
      JSON.parse(localStorage.getItem("technewsNoticiasCreadas")) || [];
    const noticia = [...noticiasBase, ...noticiasCreadas].find(
      (elemento) => elemento.id === idNoticia
    );

    if (!noticia) {
      estadoDetalle.textContent = "La noticia solicitada no existe.";
      return;
    }

    mostrarDetalle(noticia);
  } catch (error) {
    estadoDetalle.textContent =
      "No fue posible cargar el detalle. Abre el proyecto con Live Server.";
    console.error(error);
  }
}

cargarDetalle();
