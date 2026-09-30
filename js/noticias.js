// Carga las noticias desde JSON y gestiona el buscador y los filtros

const contenedor = document.querySelector("#lista-noticias");
const estado = document.querySelector("#estado");
const buscador = document.querySelector("#buscador");
const botonesFiltro = document.querySelectorAll(".filtro");

let noticias = [];
let categoriaSeleccionada = "Todas";

function crearTarjeta(noticia) {
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
        <a class="boton" href="detalle.html?id=${noticia.id}">Ver más</a>
      </div>
    </article>
  `;
}

function mostrarNoticias(lista) {
  contenedor.innerHTML = lista.map(crearTarjeta).join("");
  estado.textContent = lista.length
    ? `${lista.length} noticia(s) encontrada(s)`
    : "No se encontraron noticias.";
}

function aplicarFiltros() {
  const texto = buscador.value.toLowerCase().trim();

  const filtradas = noticias.filter((noticia) => {
    const coincideTexto =
      noticia.titulo.toLowerCase().includes(texto) ||
      noticia.categoria.toLowerCase().includes(texto) ||
      noticia.descripcion.toLowerCase().includes(texto);

    const coincideCategoria =
      categoriaSeleccionada === "Todas" ||
      noticia.categoria === categoriaSeleccionada;

    return coincideTexto && coincideCategoria;
  });

  mostrarNoticias(filtradas);
}

async function cargarNoticias() {
  try {
    const respuesta = await fetch("data/noticias.json");
    if (!respuesta.ok) {
      throw new Error("No se pudo leer noticias.json");
    }

    const noticiasBase = await respuesta.json();
    const noticiasCreadas =
      JSON.parse(localStorage.getItem("technewsNoticiasCreadas")) || [];
    const noticiasEliminadas =
      JSON.parse(localStorage.getItem("technewsNoticiasEliminadas")) || [];

    noticias = [...noticiasBase, ...noticiasCreadas].filter(
      (noticia) => !noticiasEliminadas.includes(noticia.id)
    );

    aplicarFiltros();
  } catch (error) {
    estado.textContent =
      "Error al cargar las noticias. Abre el proyecto con Live Server.";
    console.error(error);
  }
}

buscador.addEventListener("input", aplicarFiltros);

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesFiltro.forEach((elemento) => {
      elemento.classList.remove("activo");
    });

    boton.classList.add("activo");
    categoriaSeleccionada = boton.dataset.categoria;
    aplicarFiltros();
  });
});

cargarNoticias();
