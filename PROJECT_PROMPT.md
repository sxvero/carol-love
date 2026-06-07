# Prompt de Recreación del Proyecto "Carol"

Copia y pega el siguiente texto en cualquier otro entorno de desarrollo o chat de IA (como Claude, ChatGPT, Cursor, etc.) para recrear la página web interactiva completa desde cero.

---

```markdown
Actúa como un desarrollador frontend experto y diseñador de UX/UI. Quiero crear una página web interactiva de temática romántica y súper tierna ("cute") dedicada a "Carol". Esta página debe ser de una sola sección larga (Single Page Application con scroll interactivo y revelaciones dinámicas) diseñada con un estándar estético premium: uso de glassmorphism, degradados suaves, micro-animaciones interactivas y un diseño 100% responsive (optimizado para móviles y escritorio).

Debe estar construida con tecnologías web puras y estáticas (HTML5, CSS3 vanilla y JavaScript vanilla) para que pueda ser desplegada directamente en GitHub Pages de forma sencilla, sin procesos de compilación o frameworks (React, Vue, etc.).

### 💡 Reglas Críticas de Diseño y Contenido:
1. **Paleta de Colores:** Únicamente tonos rosados, blancos, pasteles y detalles dorados cálidos (warm gold). Absolutamente NADA de rojo intenso, verde o azul (excepto tonos degradados muy sutiles para transiciones de fondo o follaje suave).
2. **Sin Emojis de Sistema:** No utilices emojis de texto de Windows/Mac/iOS (como 🌸, ❤️, 🌟, ✉️). En su lugar, usa exclusivamente figuras CSS puras, degradados, o iconos vectoriales en línea (SVG inline).
3. **Restricción de Palabras:** En ninguna parte del texto debe decir "te amo". En su lugar, el mensaje debe enfocarse en lo mucho que me gusta todo de ella, detalles tiernos, cómo me gusta incluso cuando se molesta ("a pesar de que cuando se molesta es todo para mí"), cosas lindas y mensajes secretos sutiles.
4. **Tipografía:** Importa desde Google Fonts:
   - `Cormorant Garamond` (italics) para títulos elegantes y románticos.
   - `Outfit` para textos de cuerpo y legibilidad moderna.
   - `Dancing Script` para notas escritas a mano o toques cute.
5. **Idioma:** Todo el contenido de la web y sus interacciones deben estar en español.
6. **Música:** La página controlará de fondo una lista de reproducción con 4 canciones locales (que deben estar en la carpeta raíz del proyecto): `circles.mp3`, `te-quiero.mp3`, `todo-cambio.mp3`, y `travis.mp3`.

---

### 🎨 Arquitectura y Estilo Visual General (CSS)
- **Fondo de Transición Dinámica:** A medida que el usuario baja en scroll, el fondo del sitio cambia de un rosa claro pastel (`#FFF0F5`), pasando por tonos rosa atardecer ("dusky pink"), hasta un morado/noche profundo romántico (`#2D1B33` o similar) para la sección de estrellas. Los colores del texto deben cambiar a blanco cuando el fondo se vuelva oscuro para mantener el contraste.
- **Orbes Ambientales:** Esferas flotantes gigantes con desenfoque de fondo (`filter: blur(100px)`) y opacidad baja que flotan lentamente.
- **Sakura, Estrellas y Pájaros (Canvas):** Un canvas de fondo fijo que renderiza pétalos de cerezo cayendo, estrellitas parpadeantes y siluetas vectoriales de pajaritos (4 pájaros) volando de izquierda a derecha agitando sus alas con una animación sinusoidal matemática.
- **Efecto de Cursor:** Un rastro de destellos dorados/rosados que siguen la posición del puntero del mouse con un retardo suave.
- **Efecto de Clic:** Un efecto de onda de agua ("water ripple") expansiva que surge en el punto exacto de la pantalla donde el usuario hace clic o tap.
- **Transición de Entrada (Cortinas):** Al hacer clic en "Empezar", se activa una transición animada donde dos cortinas de color rosa oscuro con pliegues degradados elegantes se abren hacia los lados revelando el contenido principal de la página.

---

### 🕹️ Las 13 Secciones Interactivas (En Orden de Scroll)

Cada sección interactiva debe ocupar la pantalla completa (`100vh`) de forma sticky (una sobre otra) o fluir de manera que se sienta como un viaje pausado.

#### 1. El Hilo Rojo del Destino (Red Thread)
- **Mecánica:** Un Canvas en pantalla completa donde se dibuja una curva Bézier interactiva de color rosa vibrante. A medida que el usuario hace scroll vertical, la línea se "dibuja" gradualmente.
- **Detalle:** A lo largo del hilo hay 4 nudos dorados interactivos en posiciones fijas. Al hacer clic o tap en un nudo, este se vuelve rosa y revela una ventana flotante (con glassmorphism) mostrando un mensaje lindo.

#### 2. Burbujas Flotantes (Toca las Burbujas)
- **Mecánica:** Un contenedor lleno de 10 burbujas circulares translúcidas de diferentes tamaños que flotan y oscilan con CSS.
- **Detalle:** Al tocar una burbuja, esta explota con una pequeña animación de partículas y revela palabras lindas (ej. "Tu sonrisa", "Tu risa", "Tu mirada", "Tu calma", "Ese gesto que haces", "A pesar de todo", "Todo de ti").

#### 3. Tarjetas de Raspar (Scratch Cards)
- **Mecánica:** 3 tarjetas estilo raspa y gana. Cada una tiene una capa superior metálica degradada (rosa/oro) con el texto "Desliza aquí".
- **Detalle:** Usando un Canvas y composición `destination-out`, el usuario puede raspar con el mouse o con el dedo para revelar mensajes ocultos ilustrados con tipografía hand-written.

#### 4. Atrapa los Corazones (Minijuego)
- **Mecánica:** Un minijuego donde caen o vuelan corazones dibujados con SVG desde diferentes lados de la pantalla a velocidades aleatorias.
- **Detalle:** El usuario debe atrapar 5 corazones (un contador dinámico muestra `0/5` hasta `5/5`). Al completarlo, se desbloquea con un efecto suave una recompensa visual (tarjeta con un mensaje especial).

#### 5. Máquina de Escribir (Typewriter)
- **Mecánica:** Una tarjeta que simula una hoja de papel texturizada realista sobre un fondo elegante.
- **Detalle:** Abajo hay una tecla interactiva. Cada vez que el usuario hace clic o tap, se escriben 3 caracteres de un poema largo. Si mantiene presionado o hace clic rápido, simula la escritura mecánica con un cursor parpadeante. El poema habla de lo especial que es Carol y de cómo todo se detiene cuando está presente.

#### 6. El Teléfono de Hilo (String Telephone)
- **Mecánica:** Dos vasos tradicionales representados con CSS/SVG unidos por una cuerda floja horizontal.
- **Detalle:** Al hacer clic en el vaso izquierdo, este tiembla, la cuerda vibra transmitiendo una onda sinusoidal física visible (animación de trazo SVG), y luego de 1.5 segundos, el vaso derecho "recibe" el sonido, desplegando un bocadillo de diálogo con un mensaje dulce.

#### 7. Las Estaciones del Recorrido (Gift Stations)
- **Mecánica:** Un camino vertical central representado por una línea que se colorea a medida que el usuario hace scroll.
- **Detalle:** A lo largo del camino hay 4 cajas de regalo en 3D (hechas con CSS y degradados premium, lazos y cintas). Al hacer clic en cada caja, la tapa se abre/desvanece y revela un mensaje o recuerdo único.

#### 8. El Árbol de los Deseos (Tree of Wishes)
- **Mecánica:** Un árbol estilizado (dibujado con SVG) cuyas ramas crecen progresivamente al mantener pulsado un botón central en forma de anillo brillante.
- **Detalle:** Al mantener presionado el botón (mostrando una animación de carga circular), el porcentaje avanza. A medida que avanza, las ramas se dibujan y brotan hojas y flores rosas en posiciones aleatorias de la copa. Al llegar al 100%, se despliega un gran mensaje de dedicatoria firmado.

#### 9. Lluvia de Estrellitas (Catch a Star)
- **Mecánica:** La pantalla se oscurece por completo simulando una noche estrellada en el campo. Se generan 40 estrellas titilantes en el fondo.
- **Detalle:** De repente, una estrella fugaz brillante cruza la pantalla de esquina a esquina en bucle. Si el usuario logra tocar la estrella fugaz, esta emite un destello y despliega un mensaje estelar interactivo en el centro de la pantalla.

#### 10. El Columpio de los Sueños (Swing)
- **Mecánica:** Un columpio de madera animado que cuelga de una barra superior con cuerdas doradas.
- **Detalle:** Hay un botón para "Impulsar". Cada clic en el botón hace que el columpio se balancee físicamente (animación de rotación pendular) y revela una a una las palabras de una frase bonita (ej. "Contigo", "cada", "día", "es", "mejor").

#### 11. Carta en la Botella (Message in a Bottle)
- **Mecánica:** Una botella de vidrio translúcida que flota y se balancea suavemente sobre olas de agua animadas con CSS (tres capas de olas con opacidad y movimientos independientes).
- **Detalle:** Al tocar la botella, el corcho sale volando y se extrae suavemente un pergamino enrollado que se abre en pantalla completa mostrando una carta secreta.

#### 12. El Jardín Secreto (Secret Garden)
- **Mecánica:** Una sección donde el scroll activa el crecimiento de la naturaleza.
- **Detalle:** A medida que el scroll progresa, tallos verdes crecen desde el suelo y de ellos florecen capullos de flores rosas, blancas y doradas. Al mismo tiempo, dos mariposas CSS vuelan en trayectorias de infinito (figura de 8) alrededor de las flores, culminando en la revelación de un lindo cartel de texto.

#### 13. La Cámara Polaroid (Un Recuerdo para Ti)
- **Mecánica:** Una ilustración interactiva de una cámara de fotos estilo vintage.
- **Detalle:** Al presionar el botón disparador, la cámara emite un flash blanco que inunda la pantalla momentáneamente. Luego, una foto Polaroid en blanco sale expulsada de la cámara. La imagen dentro de la Polaroid empieza a "revelarse" (fade-in gradual de blanco a una composición artística de corazones y estrellas CSS), mostrando un mensaje final al pie de la foto.

---

### 🎛️ Componentes Globales Adicionales

#### Pantalla de Carga Inicial (Cute Loading Screen)
- Pantalla completa que bloquea el sitio al entrar.
- Muestra un corazón hecho puramente con CSS latiendo suavemente y una barra de progreso que se llena en 2.5 segundos con un gradiente rosa a fucsia.
- Al cargar, se desvanece de manera ultra fluida.

#### Pantalla de Bienvenida (Intro Screen)
- Título principal: "Para Carol" con tipografía elegante y un botón premium brillante "Entrar al Viaje" que tiene un brillo deslizante ("shimmer effect").

#### Controlador de Música en Vinilo (Vinyl Player)
- Ubicado en la esquina inferior derecha fija.
- Consiste en un tocadiscos miniatura: un disco de vinilo negro que gira cuando la música está activa, y un brazo de aguja físico que se posa sobre el vinilo al reproducir y se levanta al pausar.
- Cuenta con botones estéticos para Play/Pausa y Siguiente canción.
- Al cambiar de canción o iniciar una nueva, se despliega en medio de la pantalla una tarjeta flotante de cristal ("Music Overlay") con fondo desenfocado indicando el nombre del tema y una frase poética asociada a esa canción, la cual se desvanece sola tras unos segundos.

---

### 📂 Estructura de Archivos del Proyecto
Genera el código completo distribuido en tres archivos principales:
1. `index.html` - Toda la estructura semántica y los contenedores SVG/HTML de cada una de las secciones y componentes.
2. `style.css` - Todos los estilos visuales detallados, animaciones clave (`@keyframes`), variables CSS (`--bg-base`, `--accent-pink`, etc.), media-queries para responsive y diseño adaptable.
3. `script.js` - Toda la lógica de control, manejadores de eventos táctiles y de ratón, bucles de animación en Canvas, reproducción de audio coordinada e IntersectionObserver para los disparos de animaciones al hacer scroll.
```

---

¡Guarda este archivo en tu carpeta del proyecto como referencia rápida o compártelo para configurar el mismo desarrollo en otros entornos!
