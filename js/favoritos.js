// Gestiona la visualización y eliminación de noticias favoritas

const listaFavoritos = document.querySelector("#lista-favoritos");
const estadoFavoritos = document.querySelector("#estado-favoritos");

function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem("technewsFavoritos")) || [];
}

function eliminarFavorito(id) {
  const favoritosActualizados = obtenerFavoritos().filter(
    (noticia) => noticia.id !== id
  );

  localStorage.setItem(
    "technewsFavoritos",
    JSON.stringify(favoritosActualizados)
  );

  mostrarFavoritos();
}

function crearTarjetaFavorita(noticia) {
  return `
    <article class="tarjeta">
      <img
        class="imagen-noticia"
        src="img/noticias.jpg"
        alt="Imagen de ${noticia.titulo}"
      >

      <div class="tarjeta-contenido">
        <span class="categoria">${noticia.categoria}</span>
        <h2>${noticia.titulo}</h2>
        <p>${noticia.descripcion}</p>

        <div class="acciones-tarjeta">
          <a class="boton" href="detalle.html?id=${noticia.id}">Ver más</a>
          <button
            class="boton boton-peligro"
            data-id="${noticia.id}"
            type="button"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  `;
}

function mostrarFavoritos() {
  const favoritos = obtenerFavoritos();

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = "";
    estadoFavoritos.textContent =
      "Todavía no has guardado noticias como favoritas.";
    return;
  }

  estadoFavoritos.textContent = `${favoritos.length} noticia(s) favorita(s)`;
  listaFavoritos.innerHTML = favoritos.map(crearTarjetaFavorita).join("");

  document.querySelectorAll(".boton-peligro").forEach((boton) => {
    boton.addEventListener("click", () => {
      eliminarFavorito(Number(boton.dataset.id));
    });
  });
}

mostrarFavoritos();
