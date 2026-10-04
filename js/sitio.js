/* ==========================================================================
   Clínica de Curaciones de Úlceras y Pie Diabético
   Interacción y animaciones.  Librerías: GSAP + ScrollTrigger + Lenis (CDN).
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIGURACIÓN — lo único que hay que tocar para cambiar datos de contacto
   -------------------------------------------------------------------------- */
const CONFIG = {
  whatsapp: "50372069644",              // número principal, sin + ni espacios
  telefonoPrincipal: "+50372069644",
  telefonoAlterno: "+50371614229",
  mensajeInicial:
    "Hola, me gustaría información sobre el servicio de curación de úlceras / pie diabético a domicilio.",
  // Imagen de portada para el celular. Poné el archivo con este nombre dentro
  // de img/ y aparece solo: no hay que tocar nada más.
  heroMovil: "img/hero-movil.jpg",
};

// Extensiones que se prueban para cada imagen, en este orden. Así el nombre
// del archivo es lo único que tiene que coincidir.
const EXTENSIONES = [".jpg", ".jpeg", ".png", ".webp"];

/* --------------------------------------------------------------------------
   1. Marcos de imagen todavía vacíos
   Cada <figure class="marco"> muestra su rótulo con el nombre del archivo
   mientras ese archivo no exista. En cuanto se copia a img/, se ve la foto.
   -------------------------------------------------------------------------- */
function marcoVacio(img) {
  const base = (img.dataset.base ||= img.getAttribute("src").replace(/\.[a-z]+$/i, ""));
  const intento = Number(img.dataset.intento || 0) + 1;
  if (intento < EXTENSIONES.length) {
    img.dataset.intento = String(intento);
    img.src = base + EXTENSIONES[intento];
    return;
  }
  img.closest(".marco")?.classList.add("marco--vacio");
}
window.marcoVacio = marcoVacio;

// Por si alguna imagen falló antes de que este archivo se ejecutara.
document.querySelectorAll(".marco img").forEach((img) => {
  img.addEventListener("error", () => marcoVacio(img));
  if (img.complete && img.naturalWidth === 0) marcoVacio(img);
});

/* --------------------------------------------------------------------------
   2. Portada en celular
   El <source> para móvil se agrega solo si el archivo existe, para que la
   portada nunca salga rota mientras la foto vertical no esté puesta.
   -------------------------------------------------------------------------- */
(function portadaMovil() {
  const foto = document.getElementById("portadaFoto");
  if (!foto) return;
  const base = (foto.dataset.movil || CONFIG.heroMovil).replace(/\.[a-z]+$/i, "");

  (function probar(i) {
    if (i >= EXTENSIONES.length) return;          // todavía no la ha puesto
    const prueba = new Image();
    prueba.onload = () => {
      const fuente = document.createElement("source");
      fuente.media = "(max-width: 767px)";
      fuente.srcset = base + EXTENSIONES[i];
      foto.insertBefore(fuente, foto.firstElementChild);
    };
    prueba.onerror = () => probar(i + 1);
    prueba.src = base + EXTENSIONES[i];
  })(0);
})();

/* --------------------------------------------------------------------------
   3. Barra: sombra al bajar, barra de progreso y enlace activo
   -------------------------------------------------------------------------- */
const barra = document.getElementById("barra");
const progreso = document.getElementById("progreso");
const enlacesMenu = Array.from(document.querySelectorAll(".menu a"));
const secciones = enlacesMenu
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function alDesplazar() {
  const y = window.scrollY;
  barra.classList.toggle("barra--fija", y > 12);

  const alto = document.documentElement.scrollHeight - window.innerHeight;
  progreso.style.width = alto > 0 ? `${Math.min(100, (y / alto) * 100)}%` : "0%";

  const referencia = y + window.innerHeight * 0.3;
  let activa = null;
  secciones.forEach((sec) => {
    if (sec.offsetTop <= referencia) activa = sec.id;
  });
  enlacesMenu.forEach((a) =>
    a.classList.toggle("activo", a.getAttribute("href") === `#${activa}`)
  );
}
window.addEventListener("scroll", alDesplazar, { passive: true });
alDesplazar();

/* --------------------------------------------------------------------------
   4. Menú de celular
   -------------------------------------------------------------------------- */
const hamburguesa = document.getElementById("hamburguesa");
const menu = document.getElementById("menu");

function cerrarMenu() {
  menu.classList.remove("menu--abierto");
  hamburguesa.setAttribute("aria-expanded", "false");
  hamburguesa.setAttribute("aria-label", "Abrir menú");
}

hamburguesa.addEventListener("click", () => {
  const abierto = menu.classList.toggle("menu--abierto");
  hamburguesa.setAttribute("aria-expanded", String(abierto));
  hamburguesa.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
});
enlacesMenu.forEach((a) => a.addEventListener("click", cerrarMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarMenu();
});

/* --------------------------------------------------------------------------
   5. El botón flotante se aparta en la sección de contacto
   -------------------------------------------------------------------------- */
const flotante = document.querySelector(".flotante");
const seccionContacto = document.getElementById("contacto");
if (flotante && seccionContacto && "IntersectionObserver" in window) {
  new IntersectionObserver(
    ([entrada]) => flotante.classList.toggle("flotante--oculto", entrada.isIntersecting),
    { threshold: 0.12 }
  ).observe(seccionContacto);
}

/* --------------------------------------------------------------------------
   6. Año del pie
   -------------------------------------------------------------------------- */
const anio = document.getElementById("anio");
if (anio) anio.textContent = String(new Date().getFullYear());

/* --------------------------------------------------------------------------
   7. Formulario → WhatsApp con el mensaje ya escrito
   -------------------------------------------------------------------------- */
const formulario = document.getElementById("formulario");
const avisoFormulario = document.getElementById("avisoFormulario");

if (formulario) {
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const datos = {
      nombre: formulario.nombre.value.trim(),
      telefono: formulario.telefono.value.trim(),
      zona: formulario.zona.value.trim(),
      motivo: formulario.motivo.value,
      mensaje: formulario.mensaje.value.trim(),
    };

    // Validación propia: un campo vacío se avisa, nunca se envía en silencio.
    const faltantes = [];
    [
      ["nombre", "tu nombre"],
      ["telefono", "tu teléfono"],
      ["zona", "tu zona o dirección"],
      ["motivo", "el motivo de la consulta"],
    ].forEach(([campo, rotulo]) => {
      const control = formulario[campo];
      const vacio = !datos[campo];
      control.closest(".campo").classList.toggle("campo--error", vacio);
      if (vacio) faltantes.push(rotulo);
    });

    if (faltantes.length) {
      avisoFormulario.classList.remove("formulario__aviso--ok");
      avisoFormulario.textContent = `Falta ${faltantes.join(", ")}.`;
      formulario.querySelector(".campo--error input, .campo--error select")?.focus();
      return;
    }

    const texto =
      `Hola, quiero solicitar atención a domicilio.\n\n` +
      `Nombre: ${datos.nombre}\n` +
      `Teléfono: ${datos.telefono}\n` +
      `Zona: ${datos.zona}\n` +
      `Motivo: ${datos.motivo}` +
      (datos.mensaje ? `\nMensaje: ${datos.mensaje}` : "");

    avisoFormulario.classList.add("formulario__aviso--ok");
    avisoFormulario.textContent = "Abriendo WhatsApp con tu solicitud…";

    window.open(
      `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener"
    );
  });

  formulario.querySelectorAll("input, select, textarea").forEach((control) => {
    control.addEventListener("input", () =>
      control.closest(".campo").classList.remove("campo--error")
    );
  });
}

/* --------------------------------------------------------------------------
   8. Animaciones de entrada
   Los bloques con data-anim entran desde la izquierda, desde la derecha o
   desde abajo al llegar a ellos con el scroll.
   -------------------------------------------------------------------------- */
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const animables = Array.from(document.querySelectorAll("[data-anim]"));

function mostrarTodo() {
  animables.forEach((el) => el.classList.add("visible"));
}

function conGsap() {
  gsap.registerPlugin(ScrollTrigger);

  /* Desplazamiento suave (Lenis) enganchado al reloj de GSAP */
  if (typeof Lenis === "function" && !sinMovimiento && window.innerWidth >= 1000) {
    document.documentElement.style.scrollBehavior = "auto";
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, smoothTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const destino = document.querySelector(a.getAttribute("href"));
        if (!destino) return;
        e.preventDefault();
        lenis.scrollTo(destino, { offset: -80 });
      });
    });
  }

  /* Entradas de lado a lado.
     En celular el escalonado se anula: ahí las tarjetas van una debajo de
     otra y cada una entra por su cuenta, el retraso solo las haría llegar
     tarde a quien baja rápido. */
  const escalona = window.innerWidth >= 700 ? 1 : 0;
  animables.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.8,
      delay: parseFloat(el.dataset.retraso || "0") * escalona,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        once: true,
      },
    });
  });

  /* Paralaje suave de la portada (solo en escritorio, es un efecto de pintado) */
  const foto = document.querySelector(".portada__foto");
  if (foto && !sinMovimiento && window.innerWidth >= 1000) {
    gsap.to(foto, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".portada",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  ScrollTrigger.refresh();
}

function conObservador() {
  // Respaldo si las librerías no cargaron (sin internet, CDN bloqueado…).
  document.documentElement.classList.add("anim-css");
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );
  const escalona = window.innerWidth >= 700 ? 1 : 0;
  animables.forEach((el) => {
    el.style.transitionDelay = `${parseFloat(el.dataset.retraso || "0") * escalona}s`;
    observador.observe(el);
  });
}

function arrancarAnimaciones() {
  if (sinMovimiento) return mostrarTodo();
  if (window.gsap && window.ScrollTrigger) return conGsap();
  if ("IntersectionObserver" in window) return conObservador();
  mostrarTodo();
}

arrancarAnimaciones();

// Red de seguridad: si algo falló, nada se queda invisible.
setTimeout(() => {
  animables.forEach((el) => {
    if (getComputedStyle(el).opacity === "0" && el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add("visible");
    }
  });
}, 2500);
