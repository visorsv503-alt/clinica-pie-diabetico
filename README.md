# Clínica de Curaciones de Úlceras y Pie Diabético

Sitio web de la clínica domiciliaria de curación de úlceras y pie diabético de
la **Lic. Sofía Avalos**, en Santa Ana, El Salvador.

Landing page de una sola página hecha con **HTML, CSS y JavaScript**. Sin
frameworks ni compilación: se sube tal cual a cualquier hosting.

```
index.html           la página entera
css/estilos.css      todos los estilos
js/sitio.js          animaciones, menú y formulario (arriba está CONFIG)
img/                 las imágenes que usa el sitio
fuentes/             originales de marca y el documento de contenido
servidor.mjs         servidor local para verla
preparar-marca.mjs   recortó el escudo del logo (ya corrido, no hay que repetirlo)
GUIA-IMAGENES.md     qué foto va en cada hueco y qué buscar en Pexels
```

## Para verla en la computadora

```bash
node servidor.mjs
```

y abrir **http://localhost:4700**

Abrir `index.html` con doble clic también funciona, pero con el servidor el
sitio se comporta igual que publicado.

---

## Las imágenes que faltan

Cada hueco de imagen aparece en la página como un recuadro azul punteado con
**el nombre exacto del archivo** escrito adentro. Copiás el archivo a la
carpeta `img/` con ese nombre y la foto aparece sola: no hay que tocar código.

| Archivo | Dónde sale | Forma recomendada |
|---|---|---|
| `hero-movil` | portada, **solo en celular** | vertical, 4:5 o más alta (p. ej. 1080×1350) |
| `sobre-clinica` | sección «Un servicio diferente» | vertical 3:4 |
| `equipo-instrumental` | «Clínica domiciliaria equipada» | horizontal 4:3 |
| `esterilizacion` | detalle sobre la anterior | cuadrada 1:1 |
| `servicio-ulceras` | franja de servicios | horizontal 16:9 |
| `servicio-pie-diabetico` | franja de servicios | horizontal 16:9 |
| `servicio-sueros` | franja de servicios | horizontal 16:9 |
| `proceso-domicilio` | «Cómo trabajamos» | vertical 3:4 |
| `lic-sofia-avalos` | «Quién te atiende» | vertical 3:4, retrato |

**La extensión no importa**: sirve `.jpg`, `.jpeg`, `.png` o `.webp`. Lo único
que tiene que coincidir es el nombre. El recuadro punteado desaparece en cuanto
el archivo existe.

La portada en escritorio ya está puesta (`img/hero-escritorio.jpg`, salida de
`portada-hero.PNG`). La versión de celular es la única que falta ahí: poné
`img/hero-movil.jpg` y el sitio la usa por debajo de 768 px de ancho.

**La foto de portada va limpia, sin velo de color ni cuadrícula encima.** En
escritorio la portada está partida en dos: el texto en su columna de la
izquierda, sobre blanco, y la foto entera a la derecha hasta el borde. En
celular la foto va arriba (alto 4:5, con tope de 46 % de la pantalla) y el
texto debajo. Por eso el titular nunca le cae encima a la cara. Si querés
mover el encuadre de la foto, es `object-position` de `.portada__foto` en
`css/estilos.css` (hoy `50% 22%` en celular y `50% 24%` en escritorio): el
primer número corre la imagen de lado, el segundo de arriba abajo.

Tamaño: guardalas a **1600 px de lado mayor como máximo** y en JPG de calidad
media-alta. Arriba de eso solo pesa más y no se ve mejor.

---

## Dónde se cambian los datos

- **Teléfonos y mensaje de WhatsApp del formulario**: el bloque `CONFIG` al
  inicio de `js/sitio.js`.
- **Teléfonos de los botones y enlaces**: se repiten en `index.html` como
  `wa.me/50372069644` y `tel:+50372069644`. Si cambia el número, buscar y
  reemplazar esos dos textos.
- **Textos**: están todos en `index.html`, en el orden en que se leen.
- **Colores**: el bloque `:root` al inicio de `css/estilos.css`.

---

## Cómo está hecho

- **Tipografía**: *Archivo* para titulares —es la que más se parece al grosor
  del logo— y *Instrument Sans* para los párrafos. Se cargan desde Google Fonts.
- **Iconos**: dibujados a mano en SVG dentro del propio `index.html`
  (el bloque `<svg class="sprite">`). No hay emojis ni librerías de iconos.
- **Animaciones**: **GSAP + ScrollTrigger** para las entradas de lado a lado al
  bajar, y **Lenis** para el desplazamiento suave en escritorio. Las dos por
  CDN. Si el internet falla y no cargan, el sitio usa un respaldo con
  `IntersectionObserver` y se ve igual; y si nada de eso corre, el contenido
  aparece completo, nunca en blanco.
- **`prefers-reduced-motion`**: quien tenga las animaciones desactivadas en su
  sistema ve la página quieta.
- **Cada bloque** entra desde la izquierda, desde la derecha o desde abajo
  según el atributo `data-anim` en el HTML (`izq`, `der`, `arriba`) y
  `data-retraso` en segundos. Se pueden cambiar sin tocar el JS.
- En celular el escalonado se anula a propósito: ahí las tarjetas van una
  debajo de otra y el retraso solo haría que llegaran tarde.

## Detalles que conviene no romper

- La barra de arriba es **blanca opaca**. Con transparencia, el texto que pasa
  por debajo se alcanza a leer a través de ella.
- `section[id] { scroll-margin-top: 88px }` es lo que evita que la barra fija
  tape el título al saltar con un enlace del menú.
- El botón flotante de WhatsApp **se esconde solo** al llegar a la sección de
  contacto, porque ahí caía justo encima del botón de enviar el formulario.
- Los campos del formulario están a **16 px**: por debajo de eso, Safari en
  iPhone amplía la página al enfocarlos y se puede arrastrar de lado.
- El formulario valida por su cuenta y avisa en rojo qué falta. No usa el aviso
  del navegador porque en un formulario largo no siempre se alcanza a ver.

---

## Publicar

El sitio es estático: `index.html` en la raíz y nada que compilar. Sirve
cualquiera de estas tres.

**GitHub Pages** — gratis y ya está el repositorio. En el repo:
*Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`*.
A los dos minutos queda en `https://<usuario>.github.io/<repositorio>/`.
El archivo `.nojekyll` de la raíz ya está puesto para que GitHub publique todo
tal cual, sin procesarlo.

**Netlify** — arrastrar la carpeta a netlify.com, o conectar el repositorio.
Sin comando de build y con la carpeta de publicación en `.` (la raíz).

**Hosting propio por FTP** — subir el contenido de la carpeta a `public_html`.
No hace falta nada instalado en el servidor: es HTML plano.

Con dominio propio, después hay que cambiar en `index.html` el
`<link rel="canonical">` y el `og:image` por la dirección real.

---

## Antes de publicar

- [ ] Poner las imágenes de la tabla de arriba. **Mientras falten, el sitio
      enseña los recuadros punteados con el nombre del archivo**: útil para
      trabajar, pero no para que lo vea un cliente.
- [ ] Confirmar con la Lic. Avalos lo de «urgencias 24 h» y «tratamientos de
      última generación»: dejar solo lo que realmente pueda cumplir.
- [ ] Decidir si se muestra el número de JVPE y los años de experiencia.
- [ ] Cambiar `<link rel="canonical">` y `og:image` en `index.html` por el
      dominio real.
- [ ] Si hay redes sociales, agregarlas al pie.
