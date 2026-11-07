"use strict";

const cursos = [
    {
        id: "html-css",
        titulo: "HTML y CSS desde cero",
        descripcion: "Bases sólidas de maquetado web: etiquetas semánticas, selectores y Flexbox.",
        nivel: "Principiante",
        precio: "$15.000",
        duracion: "4 semanas",
        imagen: "img/Computadora_codigo.jpg",
        textoImagen: "Pantalla con código HTML y CSS"
    },
    {
        id: "javascript",
        titulo: "JavaScript aplicado",
        descripcion: "Lógica de programación, DOM y almacenamiento local para sitios interactivos.",
        nivel: "Intermedio",
        precio: "$22.000",
        duracion: "6 semanas",
        imagen: "img/Pantalla_react.jpg",
        textoImagen: "Pantalla con código de React y componentes"
    },
    {
        id: "ux-ui",
        titulo: "UX/UI para desarrolladores",
        descripcion: "Principios de diseño de interfaces, prototipado y sistemas de color y tipografía.",
        nivel: "Intermedio",
        precio: "$20.000",
        duracion: "5 semanas",
        imagen: "img/Pantalla_con_dashboard.jpg",
        textoImagen: "Pantalla con un dashboard de análisis de datos"
    },
    {
        id: "full-stack",
        titulo: "Bootcamp Full Stack",
        descripcion: "Programa intensivo que integra frontend, backend y una base de datos real.",
        nivel: "Avanzado",
        precio: "$45.000",
        duracion: "12 semanas",
        imagen: "img/Notebook_Dashboard.jpg",
        textoImagen: "Notebook con un dashboard de análisis de datos"
    }
];

const testimonios = [
    {
        nombre: "Lucía Fernández",
        curso: "HTML y CSS desde cero",
        comentario: "Pude armar mi primera página y entendí cómo organizar el código desde el principio."
    },
    {
        nombre: "Mateo González",
        curso: "JavaScript aplicado",
        comentario: "Las prácticas me ayudaron a llevar la teoría a proyectos que puedo mostrar."
    },
    {
        nombre: "Sofía Martínez",
        curso: "Bootcamp Full Stack",
        comentario: "Trabajar en un proyecto completo me dio confianza para seguir aprendiendo."
    }
];

const CLAVE_FAVORITOS = "sabela-favoritos-cursos-v1";
const grillaCursos = document.querySelector("#grilla-cursos");
const grillaTestimonios = document.querySelector("#grilla-testimonios");
const filtroNivel = document.querySelector("#filtro-nivel");
const botonFiltroFavoritos = document.querySelector("#filtro-favoritos");
const estadoCursos = document.querySelector("#estado-cursos");
let ultimoCambioFavorito = null;
let temporizadorCambioFavorito;
let favoritos = cargarFavoritos();
let mostrarSoloFavoritos = false;

function cargarFavoritos() {
    try {
        const datosGuardados = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS) || "[]");
        if (!Array.isArray(datosGuardados)) {
            return new Set();
        }

        const idsValidos = datosGuardados.filter((id) =>
            typeof id === "string" && cursos.some((curso) => curso.id === id)
        );
        return new Set(idsValidos);
    } catch (error) {
        return new Set();
    }
}

function guardarFavoritos() {
    try {
        localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify([...favoritos]));
        return true;
    } catch (error) {
        estadoCursos.textContent = "No se pudieron guardar los favoritos en este navegador.";
        return false;
    }
}

function crearTarjetaCurso(curso) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-curso";

    const imagen = document.createElement("img");
    imagen.src = curso.imagen;
    imagen.alt = curso.textoImagen;

    const informacion = document.createElement("div");
    informacion.className = "info-tarjeta";

    const nivel = document.createElement("span");
    nivel.className = "etiqueta-nivel";
    nivel.classList.add("nivel-" + curso.nivel.toLowerCase());
    nivel.textContent = curso.nivel;

    const titulo = document.createElement("h3");
    titulo.textContent = curso.titulo;

    const descripcion = document.createElement("p");
    descripcion.textContent = curso.descripcion;

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.append(document.createTextNode(curso.precio + " "));

    const duracion = document.createElement("span");
    duracion.className = "duracion";
    duracion.textContent = "· " + curso.duracion;
    precio.append(duracion);

    const botonFavorito = document.createElement("button");
    botonFavorito.className = "boton-favorito";
    botonFavorito.type = "button";
    botonFavorito.dataset.idCurso = curso.id;
    botonFavorito.setAttribute("aria-pressed", String(favoritos.has(curso.id)));
    botonFavorito.textContent = favoritos.has(curso.id) ? "♥ En favoritos" : "♡ Agregar a favoritos";

    const confirmacion = document.createElement("p");
    confirmacion.className = "confirmacion-favorito";
    confirmacion.setAttribute("aria-live", "polite");
    if (ultimoCambioFavorito && ultimoCambioFavorito.id === curso.id) {
        tarjeta.classList.add("tarjeta-actualizada");
        confirmacion.classList.add("confirmacion-visible");
        confirmacion.textContent = ultimoCambioFavorito.mensaje;
    }

    informacion.append(nivel, titulo, descripcion, precio, botonFavorito, confirmacion);
    tarjeta.append(imagen, informacion);
    return tarjeta;
}

function renderizarCursos() {
    const nivelSeleccionado = filtroNivel.value;
    const cursosFiltrados = cursos.filter((curso) => {
        const coincideNivel = nivelSeleccionado === "todos" || curso.nivel === nivelSeleccionado;
        const coincideFavoritos = !mostrarSoloFavoritos || favoritos.has(curso.id);
        return coincideNivel && coincideFavoritos;
    });

    grillaCursos.replaceChildren(...cursosFiltrados.map(crearTarjetaCurso));

    if (cursosFiltrados.length === 0) {
        estadoCursos.textContent = mostrarSoloFavoritos
            ? "Todavía no marcaste cursos favoritos para este filtro."
            : "No hay cursos disponibles para este nivel.";
    } else {
        estadoCursos.textContent = cursosFiltrados.length === 1
            ? "Se muestra 1 curso."
            : "Se muestran " + cursosFiltrados.length + " cursos.";
    }
}

function renderizarTestimonios() {
    const tarjetas = testimonios.map((testimonio) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-testimonio";

        const cita = document.createElement("blockquote");
        cita.textContent = "“" + testimonio.comentario + "”";

        const nombre = document.createElement("h3");
        nombre.textContent = testimonio.nombre;

        const curso = document.createElement("p");
        curso.textContent = "Estudiante de " + testimonio.curso;

        tarjeta.append(cita, nombre, curso);
        return tarjeta;
    });

    grillaTestimonios.replaceChildren(...tarjetas);
}

filtroNivel.addEventListener("change", renderizarCursos);

botonFiltroFavoritos.addEventListener("click", () => {
    mostrarSoloFavoritos = !mostrarSoloFavoritos;
    botonFiltroFavoritos.setAttribute("aria-pressed", String(mostrarSoloFavoritos));
    botonFiltroFavoritos.textContent = mostrarSoloFavoritos
        ? "Mostrar todos los cursos"
        : "Mostrar solo favoritos";
    renderizarCursos();
});

grillaCursos.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".boton-favorito");
    if (!boton) {
        return;
    }

    const idCurso = boton.dataset.idCurso;
    const eraFavorito = favoritos.has(idCurso);

    if (eraFavorito) {
        favoritos.delete(idCurso);
    } else {
        favoritos.add(idCurso);
    }

    const seGuardo = guardarFavoritos();
    const curso = cursos.find((elemento) => elemento.id === idCurso);
    ultimoCambioFavorito = {
        id: idCurso,
        mensaje: seGuardo
            ? (eraFavorito ? "Quitado de favoritos" : "¡Agregado a favoritos!")
            : "No se pudo guardar el cambio"
    };
    renderizarCursos();
    clearTimeout(temporizadorCambioFavorito);
    temporizadorCambioFavorito = setTimeout(() => {
        ultimoCambioFavorito = null;
        renderizarCursos();
    }, 2400);
});

renderizarCursos();
renderizarTestimonios();



