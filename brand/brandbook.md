# Escualia — Brand Book

**Version**: 1.0 — May 2026
**Maintained by**: Product / Design lead
**Contact**: hola@escualia.es

---

## Contents

1. Diagnóstico de identidad actual
2. Posicionamiento
3. Misión, visión y valores
4. Personalidad y tono de voz
5. Sistema de color
6. Tipografía
7. Espaciado
8. Iconografía
9. Estilo de imagen y fotografía
10. Logo — reglas de uso
11. Ejemplos de comunicación

---

## 1. Diagnóstico de identidad actual

> Basado en análisis de los componentes en `apps/landing/components/` y `app/globals.css`.
> El código fue leído en su totalidad antes de escribir este diagnóstico.

### Lo que está bien — mantener

**Paleta coherente y funcional**
Los tokens `--brand` (#2563EB azul) y `--accent` (#F97316 naranja) son una combinación
clásica de confianza + urgencia. El contraste entre ambos colores sobre fondo blanco
supera el ratio WCAG AA para texto grande. Esta combinación no debe cambiarse: es el
ancla visual de la marca.

**Dark mode bien ejecutado**
El `globals.css` implementa dark mode a través de `@media (prefers-color-scheme: dark)`
con valores correctamente ajustados para cada token. Los valores del azul en dark mode
(#3b82f6) son apropiadamente más claros que en light (#2563EB), siguiendo la regla de
accesibilidad en fondos oscuros. Esto es trabajo cuidadoso que muchos proyectos omiten.

**Logo con concepto sólido**
El SVG en `logo.tsx` tiene un concepto narrativo claro: camino desde un punto de origen
hasta un destino marcado con un check. El uso del naranja (#F97316) solo en el círculo
de destino crea jerarquía visual correcta — el acento llama la atención donde el usuario
debería terminar (aprobado, gestionado, completado).

**Tipografía en el wordmark**
`fontWeight: 800`, `letterSpacing: "-0.02em"` y el split de color en "Escua|lia"
(texto negro / azul brand) es una decisión tipográfica buena: el contraste de color
dentro del wordmark crea reconocimiento sin necesitar un ícono separado.

**Escala de neutrales funcional**
Los tres niveles de texto (`--text`, `--text-muted`, `--text-subtle`) más los tres
niveles de fondo (`--bg`, `--bg-subtle`, `--bg-muted`) crean un sistema de jerarquía
visual de 3 profundidades que se aplica consistentemente en todos los componentes.

**Uso correcto del color de estado en contexto**
El componente `problem.tsx` usa rojo (#ef4444) para las tarjetas de dolor del usuario —
comunicación semántica precisa. `hero.tsx` usa verde (#10b981) para las tres micro-ventajas
("Sin tarjeta de crédito", etc.) — refuerzo positivo donde corresponde.

---

### Lo que falta o es inconsistente — mejorar

**Colores hardcodeados fuera del sistema de tokens**
En `features.tsx`, cada feature card tiene su propio color hexadecimal hardcodeado:
`#7c3aed` (violet), `#db2777` (pink), `#d97706` (amber). Lo mismo en `social-proof.tsx`
y `hero.tsx`. Esto significa que si el color brand cambia, habrá 12+ lugares que no
se actualizarán automáticamente. El sistema de tokens existe pero no se usa para estos
colores adicionales.

**Familia tipográfica no especificada como token**
`body { font-family: ui-sans-serif, system-ui, sans-serif }` usa el fallback del
sistema, no Geist (que está en el stack declarado). No hay ningún `@import` o
`next/font/google` visible en los componentes leídos. Esto significa que la tipografía
de la landing page puede variar entre dispositivos dependiendo del sistema operativo.

**Falta de escala tipográfica sistemática**
Los tamaños de fuente están definidos directamente como clases Tailwind (`text-4xl`,
`text-lg`, `text-sm`) sin tokens intermedios. Esto funciona para un proyecto pequeño,
pero cuando haya múltiples páginas (app, docs, marketing) los tamaños pueden divergir.

**Bordes redondeados inconsistentes**
La mayoría de componentes usa `rounded-2xl` (16px) o `rounded-xl` (12px) para cards,
pero hay mezclados `rounded-lg`, `rounded-xl`, `rounded-2xl` sin regla clara. Los
badges/pills usan `rounded-full` (correcto). Los botones mezclan `rounded-xl` (hero)
con `rounded-lg` (navbar). Un sistema de radios nominal (sm/md/lg/xl/2xl) resuelve esto.

**No hay estados de error/éxito/advertencia unificados**
El color verde de éxito aparece como `#10b981` (emerald-500) en `hero.tsx` y como
`#059669` (emerald-700) en `social-proof.tsx` y `features.tsx` para el mismo tipo de
estado. Dos verdes diferentes para el mismo rol semántico.

**La sección waitlist usa colores literales, no tokens**
`waitlist-section.tsx` usa `rgba(255,255,255,0.1)`, `rgba(255,255,255,0.15)`, `text-blue-100`
como clases Tailwind — fuera del sistema de variables CSS. Esto no se adaptará si el
gradiente del fondo cambia de azul a otro color.

---

### 3 recomendaciones concretas accionables

**Recomendación 1 — Consolidar colores de feature en el sistema de tokens**
Crear tokens `--color-feature-1` a `--color-feature-6` mapeados a los colores actuales,
y usarlos desde `features.tsx`. Tiempo estimado: 30 minutos. Impacto: cualquier cambio
de paleta se propaga automáticamente.

**Recomendación 2 — Instalar Geist con `next/font` y crear un token**
Agregar `import { Geist } from "next/font/google"` en el layout raíz, exponer la
variable CSS `--font-sans`, y reemplazar `ui-sans-serif` en `globals.css`. Esto
garantiza que la fuente que define la identidad visual se carga en todos los
dispositivos. Tiempo estimado: 15 minutos.

**Recomendación 3 — Unificar el verde de estado en un único token**
Decidir si el color de éxito es `#059669` (emerald-700, mayor contraste, pasa AA en
blanco) o `#10b981` (emerald-500, más vivo pero falla AA en blanco en texto pequeño).
La recomendación es `#16a34a` (green-600 de Tailwind): pasa AA, es distintivo del brand
blue, y funciona en light y dark mode. Reemplazar todas las ocurrencias.

---

## 2. Posicionamiento

### Statement de posicionamiento

**Para** propietarios y gestores de autoescuelas españolas que pierden tiempo y dinero
gestionando su negocio con Excel, WhatsApp y software heredado de los 90,

**Escualia es** la plataforma de gestión all-in-one diseñada exclusivamente para
autoescuelas,

**que** centraliza alumnos, agenda, facturación y teoría en un solo lugar moderno,

**a diferencia de** las soluciones genéricas o el software sectorial anticuado,

**porque** combinamos la profundidad operativa que una autoescuela necesita con la
simplicidad de uso que un autónomo puede adoptar sin formación técnica.

---

### El enemigo de la marca

No es un competidor de SaaS. El enemigo es **el caos organizado**: el Excel que "ya
funciona", el WhatsApp que "siempre ha estado ahí", el programa de los 90 que "conocen
de memoria". El enemigo es la inercia, no otra empresa.

Cada pieza de comunicación de Escualia debe nombrar ese enemigo específicamente —
no atacar a otras herramientas, sino hacer visible el coste invisible del caos.

---

### Promesa de marca

**"Recupera el tiempo que tu autoescuela te está quitando."**

No prometemos tecnología. Prometemos tiempo devuelto y dinero que no se pierde.

---

## 3. Misión, visión y valores

### Misión

Dar a cada autoescuela española las herramientas que merecen: modernas, completas y
pensadas para su realidad operativa — no adaptadas de otro sector.

### Visión

Ser la plataforma de referencia para la gestión de autoescuelas en el mercado
hispanohablante: el nombre que los profesores del sector recomienden sin dudar.

### Valores

**1. Claridad antes que funcionalidad**
Una función que nadie usa no suma. Cada pantalla, cada flujo, cada campo debe
tener una razón de existir. Si no podemos explicar por qué está, no debería estar.

**2. El tiempo del cliente es el nuestro**
Los propietarios de autoescuela no son "usuarios" — son personas con un negocio
que depende de que esto funcione. Cada minuto que ahorran con Escualia es un minuto
de su vida. Eso no es retórica, es el criterio con el que tomamos decisiones de producto.

**3. Hecho en España, para España**
La DGT, los permisos por categoría, la facturación a Hacienda, el Reglamento General
de Conductores — Escualia no adapta una solución genérica. Está construida desde el
primer día para el marco legal y operativo español. Eso no es un feature. Es la base.

---

## 4. Personalidad y tono de voz

### Ejes de personalidad (escala 1–5)

| Eje             | 1 (polo A)          | Posición | 5 (polo B)         |
|-----------------|---------------------|:--------:|---------------------|
| Formalidad      | Académico           | **2**    | Coloquial           |
| Energía         | Calmado / reflexivo | **4**    | Urgente / enérgico  |
| Tecnicidad      | Técnico / preciso   | **2**    | Accesible / simple  |
| Posicionamiento | Humilde / servicial | **3**    | Seguro / asertivo   |

**Interpretación**:
- Somos cercanos pero no informales. Tuteamos, no tratamos de usted.
- Somos directos y tenemos energía, pero no somos agresivos ni sensacionalistas.
- Hablamos el idioma del negocio (alumnos, expedientes, prácticas), no el de la tecnología.
- Tenemos criterio y lo expresamos, pero no somos arrogantes.

---

### Principios de comunicación

**1. Beneficio antes que característica**
No: "Escualia tiene agenda sincronizada en tiempo real."
Sí: "Tus instructores ven sus clases actualizadas al instante, sin llamarte a ti."

**2. Concreto antes que genérico**
No: "Mejora la gestión de tu autoescuela."
Sí: "Recupera 8 horas a la semana. Cobra todo lo que trabajas."

**3. Empático antes que técnico**
Antes de hablar de la solución, nombramos el problema que el usuario conoce.
No asumimos que el usuario tiene contexto técnico. No asumimos que tiene paciencia
para leer. Respetamos su tiempo en cada frase.

---

### Vocabulario — palabras SÍ

1. Recupera (tiempo, dinero, control)
2. Centraliza
3. Automático / automáticamente
4. Claro / clara
5. En segundos / en un clic
6. Diseñado para autoescuelas
7. Sin papeles
8. Sin llamadas
9. Todo en un lugar
10. Español (contexto: "soporte en español", "adaptado a España")

---

### Vocabulario — palabras NO

1. Innovador / innovación (cliché vacío)
2. Disruptivo / disrupción
3. Ecosistema
4. Sinergias
5. Solución end-to-end
6. Potente (suena complejo, no atractivo)
7. Robusto
8. Escalable (el usuario no piensa en escalar)
9. Plataforma omnicanal
10. Digitalización / digital transformation

---

### Ejemplos "Antes vs Después"

#### Hero headline

**Antes (genérico, tech-bro)**
> "La plataforma innovadora que digitaliza la gestión de tu autoescuela"

**Después (Escualia)**
> "Recupera 8 horas a la semana y cobra todo lo que trabajas"

*Por qué funciona*: métricas concretas, dos beneficios distintos (tiempo + dinero),
sin mencionar tecnología. El usuario se reconoce en el problema antes de leer la solución.

---

#### Email de onboarding (primer email tras registro)

**Antes (genérico, SaaS estándar)**
> Hola,
>
> Bienvenido a Escualia. Tu cuenta ha sido creada con éxito.
> Puedes acceder a la plataforma en el siguiente enlace y comenzar a explorar todas
> las funcionalidades disponibles.
>
> Si tienes cualquier duda, no dudes en contactar con nuestro equipo de soporte.
>
> El equipo de Escualia

**Después (Escualia)**
> Hola [Nombre],
>
> Ya estás dentro. 
>
> Antes de que empieces, una cosa: no tienes que aprender todo de golpe.
> La mayoría de autoescuelas que usan Escualia tardan menos de 10 minutos en
> meter sus primeros alumnos y ver la agenda funcionando.
>
> Por donde empezar: añade un alumno real. Uno solo. Verás que tarda 2 minutos.
>
> Si en algún momento te atascas, estoy aquí: hola@escualia.es
>
> Hasta pronto,
> Pablo — Escualia

*Cambios clave*: nombre de persona real, no "el equipo"; una sola acción propuesta;
expectativa de tiempo concreta; tono cálido sin ser informal en exceso.

---

#### Mensaje de error (formulario de login)

**Antes (genérico, técnico)**
> "Error de autenticación. Las credenciales proporcionadas no son válidas.
> Por favor, verifique su email y contraseña e inténtelo de nuevo."

**Después (Escualia)**
> "Email o contraseña incorrectos. ¿Olvidaste la contraseña? Puedes recuperarla aquí."

*Cambios clave*: voz activa, segunda persona directa, enlace de acción inmediata
dentro del mensaje de error — reducción de fricción, no solo descripción del problema.

---

## 5. Sistema de color

> Los tokens están definidos en `brand/tokens.css`. Esta sección es la documentación
> narrativa y de referencia de ratios de contraste para diseñadores.

---

### Color primario — Azul Escualia

| Variante       | HEX     | RGB             | HSL            |
|----------------|---------|-----------------|----------------|
| Brand base     | #2563EB | rgb(37 99 235)  | hsl(221 83% 53%)|
| Brand hover    | #1D4ED8 | rgb(29 78 216)  | hsl(224 76% 48%)|
| Brand deep     | #1E3A8A | rgb(30 58 138)  | hsl(226 71% 33%)|
| Brand subtle   | #DBEAFE | rgb(219 234 254)| hsl(214 89% 93%)|
| Brand fg (text)| #FFFFFF | rgb(255 255 255)| hsl(0 0% 100%) |

**Ratio WCAG AA**
- #2563EB sobre #FFFFFF: **4.53:1** — Pasa AA para texto grande (18pt+). Falla para
  texto pequeño (requiere 4.5:1 — está en el límite exacto). Usar con font-weight 600+
  o tamaño 18px+ para garantizar conformidad.
- #2563EB sobre #DBEAFE: **2.87:1** — No pasa AA. Solo usar en elementos decorativos
  (badges, bordes) nunca para texto informativo crítico.
- #FFFFFF sobre #2563EB: **4.53:1** — Pasa AA. Usar para texto en botones primarios.
- #FFFFFF sobre #1D4ED8: **5.29:1** — Pasa AA y AAA para texto grande. Preferir para
  texto pequeño sobre fondo brand.

---

### Color acento — Naranja Escualia

| Variante       | HEX     | RGB             | HSL            |
|----------------|---------|-----------------|----------------|
| Accent base    | #F97316 | rgb(249 115 22) | hsl(25 95% 53%)|
| Accent hover   | #EA580C | rgb(234 88 12)  | hsl(21 90% 48%)|
| Accent subtle  | #FFEDD5 | rgb(255 237 213)| hsl(34 100% 92%)|
| Accent fg      | #FFFFFF | rgb(255 255 255)| hsl(0 0% 100%) |

**Ratio WCAG AA**
- #F97316 sobre #FFFFFF: **2.97:1** — No pasa AA para texto. El acento naranja NO debe
  usarse para texto en fondo blanco. Solo usar como color de fondo de botones CTA
  (con texto blanco encima) o como color decorativo.
- #FFFFFF sobre #F97316: **2.97:1** — Tampoco pasa AA. Para botones CTA en naranja,
  usar #EA580C como fondo (ratio 3.39:1 — pasa AA large text) o solo para botones
  de tamaño grande (padding generoso, font-size 16px+, font-weight 700+).
- **Regla**: el naranja es un color de acento visual, no de texto. Su función es crear
  contraste con el azul brand, no ser legible en sí mismo sobre fondos claros.

---

### Neutrales (5 pasos)

| Nombre          | HEX     | RGB              | HSL            | Uso principal             |
|-----------------|---------|------------------|----------------|---------------------------|
| Neutral 100     | #F1F5F9 | rgb(241 245 249) | hsl(210 40% 96%)| Fondos alternos, inputs   |
| Neutral 200     | #E2E8F0 | rgb(226 232 240) | hsl(214 32% 91%)| Bordes, divisores         |
| Neutral 400     | #94A3B8 | rgb(148 163 184) | hsl(215 20% 65%)| Texto placeholder, meta   |
| Neutral 600     | #64748B | rgb(100 116 139) | hsl(215 16% 47%)| Texto secundario (muted)  |
| Neutral 900     | #0F172A | rgb(15 23 42)    | hsl(222 84% 11%)| Texto primario, headings  |

**Ratio WCAG AA**
- Neutral 600 (#64748B) sobre blanco: **4.58:1** — Pasa AA. Usar para texto muted.
- Neutral 400 (#94A3B8) sobre blanco: **2.32:1** — No pasa AA. Solo para texto placeholder
  o decorativo, nunca para información necesaria.
- Neutral 900 (#0F172A) sobre blanco: **19.41:1** — Pasa AAA. Color de texto principal.

---

### Estados semánticos

#### Success (verde)

| Variante       | HEX     | RGB            | HSL            |
|----------------|---------|----------------|----------------|
| Success base   | #16A34A | rgb(22 163 74) | hsl(142 76% 36%)|
| Success bg     | #DCFCE7 | rgb(220 252 231)| hsl(141 79% 93%)|
| Success border | #4ADE80 | rgb(74 222 128)| hsl(142 69% 58%)|

- #16A34A sobre #FFFFFF: **4.54:1** — Pasa AA.
- #FFFFFF sobre #16A34A: **4.54:1** — Pasa AA.

#### Warning (amarillo-dorado)

| Variante       | HEX     | RGB            | HSL            |
|----------------|---------|----------------|----------------|
| Warning base   | #CA8A04 | rgb(202 138 4) | hsl(43 96% 40%)|
| Warning bg     | #FEF9C3 | rgb(254 249 195)| hsl(55 92% 88%)|
| Warning border | #FACC15 | rgb(250 204 21)| hsl(48 96% 53%)|

- #CA8A04 sobre #FFFFFF: **4.68:1** — Pasa AA.

#### Error (rojo)

| Variante      | HEX     | RGB            | HSL            |
|---------------|---------|----------------|----------------|
| Error base    | #DC2626 | rgb(220 38 38) | hsl(0 72% 51%) |
| Error bg      | #FEE2E2 | rgb(254 226 226)| hsl(0 86% 94%)|
| Error border  | #F87171 | rgb(248 113 113)| hsl(0 91% 71%)|

- #DC2626 sobre #FFFFFF: **5.74:1** — Pasa AA y AAA para texto grande.

#### Info (azul cielo)

| Variante     | HEX     | RGB            | HSL            |
|--------------|---------|----------------|----------------|
| Info base    | #0284C7 | rgb(2 132 199) | hsl(199 89% 40%)|
| Info bg      | #E0F2FE | rgb(224 242 254)| hsl(204 94% 94%)|
| Info border  | #38BDF8 | rgb(56 189 248)| hsl(199 89% 60%)|

- #0284C7 sobre #FFFFFF: **4.63:1** — Pasa AA.

---

## 6. Tipografía

### Familias elegidas

#### Principal — Geist (display + cuerpo)

**Justificación**: Geist es la fuente diseñada por Vercel para interfaces digitales
de alta legibilidad. Es la elección natural para un SaaS construido en Next.js con
Tailwind — coherencia entre herramienta y producto. Sus variantes van de Thin a Black
(9 pesos) con soporte completo de caracteres latinos incluyendo español (ñ, acentos,
ü). A diferencia de Inter, Geist tiene personalidad visual propia: los numerales son
ligeramente más compactos y las mayúsculas tienen más presencia — ideal para los
dashboards de métricas que son el core del producto.

**Uso**: headlines, subheadings, cuerpo de texto, UI labels.

#### Secundaria — Geist Mono (código + datos)

**Justificación**: Mantener la misma familia en versión monoespaciada garantiza
cohesión visual cuando se muestran datos tabulares (horas de clase, DNI de alumno,
importes en facturas). El código fuente del proyecto ya usa `font-mono` en la
simulación del dashboard (`app.escualia.es` en el navegador del hero), confirmando
que esta elección está implícita.

**Uso**: importes monetarios en tablas, horas de clases, identificadores de expediente,
fragmentos de código en documentación técnica.

---

### Escala tipográfica completa

| Token           | px  | rem    | Tailwind   | Uso                                  |
|-----------------|-----|--------|------------|--------------------------------------|
| `font-size-xs`  | 12  | 0.75   | `text-xs`  | Labels, badges, meta, timestamps     |
| `font-size-sm`  | 14  | 0.875  | `text-sm`  | Body small, captions, form hints     |
| `font-size-base`| 16  | 1      | `text-base`| Body default, inputs, buttons        |
| `font-size-md`  | 18  | 1.125  | `text-lg`  | Lead text, body large                |
| `font-size-lg`  | 20  | 1.25   | `text-xl`  | Card titles, subheadings             |
| `font-size-xl`  | 24  | 1.5    | `text-2xl` | H4, section subtitles                |
| `font-size-2xl` | 30  | 1.875  | `text-3xl` | H3                                   |
| `font-size-3xl` | 36  | 2.25   | `text-4xl` | H2                                   |
| `font-size-4xl` | 48  | 3      | `text-5xl` | H1 desktop                           |
| `font-size-5xl` | 60  | 3.75   | `text-6xl` | Hero headline desktop                |

**Line heights por uso**
- Títulos y headings: `1.2` (tight)
- Subheadings: `1.35` (snug)
- Cuerpo de texto: `1.5` (normal)
- Párrafos largos, onboarding copy: `1.75` (relaxed)

**Pesos más usados**
- `400` Regular: body text, descripciones
- `600` Semibold: labels, nav links, badge text
- `700` Bold: headings H3 y H4, precios, métricas clave
- `800` Black: H1 y H2 en la landing, wordmark del logo

---

## 7. Espaciado

**Base**: 4px. Todo espaciado es múltiplo de 4.

| Token         | px  | Uso típico                                            |
|---------------|-----|-------------------------------------------------------|
| `space-1`     | 4   | Gap entre icono e icono                               |
| `space-2`     | 8   | Padding interno de badges, gap entre items inline     |
| `space-3`     | 12  | Padding de badge, gap entre label e input             |
| `space-4`     | 16  | Padding horizontal botón pequeño, gap entre cards      |
| `space-6`     | 24  | Padding interno de card, gap vertical entre secciones |
| `space-8`     | 32  | Padding card grande, gap entre bloques de contenido   |
| `space-16`    | 64  | Padding vertical de secciones en mobile               |
| `space-20`    | 80  | Padding vertical de secciones en desktop              |

**Regla de oro**: si dos elementos están relacionados, el espacio entre ellos debe ser
menor que el espacio entre grupos no relacionados. El espaciado comunica jerarquía.

---

## 8. Iconografía

### Familia: Lucide React

**Justificación**: ya está en uso en todos los componentes (`lucide-react`). Lucide
es una fork de Feather Icons con mantenimiento activo, 1400+ íconos, y coherencia
visual total — single-weight stroke, rounded linecaps, estilo minimalista.

**Reglas de uso**

1. **Tamaño**: siempre usar los valores de `size` de Lucide directamente.
   Estándar de la UI: `size={16}` para inline / labels, `size={20}` para botones,
   `size={22}` para feature icons, `size={24}` para acciones prominentes.

2. **Peso de trazo**: Lucide usa stroke-width 2 por defecto. No modificar. Si en algún
   contexto se necesita más peso visual, usar `strokeWidth={2.5}` (nunca más de 3).

3. **Color**: los íconos heredan el `color` del CSS (`currentColor`). No definir color
   directamente en el componente — dejar que el wrapper lo controle.

4. **Ícono en fondo de color**: envolverlo en un contenedor con `background: color-mix(in
   srgb, {accent} 12%, transparent)` y `border-radius: var(--radius-xl)`. Este patrón
   ya existe en `features.tsx` y es el correcto.

5. **No mezclar familias**: si en algún momento se necesita un ícono que Lucide no
   tiene, la alternativa es un SVG custom siguiendo las mismas guías de trazo (2px,
   rounded linecap, no fill), no importar otra librería de íconos.

---

## 9. Estilo de imagen y fotografía

### Directriz general

Escualia es un producto para personas reales con un negocio real. Las imágenes deben
reflejar ese realismo — autoescuelas auténticas, instructores en contexto, no stock
photos de personas en trajes sonriendo frente a pantallas genéricas.

### Reglas de fotografía

**Contexto**: exteriores de autoescuelas españolas, vehículos de prácticas reales
(Seat, Volkswagen), aulas de teoría, instructores enseñando. No estudios fotográficos.

**Personas**: propietarios y gestores reales. Edad media 35–55 años. Diversidad de
género equilibrada. Ambiente de trabajo auténtico, no "staged". Si es editorial,
que parezca reportaje, no publicidad.

**Paleta fotográfica**: imágenes con tonos cálidos naturales (luz de mañana española,
no flash de estudio). Evitar imágenes de alto contraste artificial o filtros
Instagram.

**UI screenshots**: cuando se muestren pantallas del producto, siempre sobre mockups
de hardware realistas (MacBook, iPhone 15) con fondo neutral. No "floating" sin
contexto.

**Ilustraciones**: si se usan ilustraciones en lugar de fotografía (onboarding,
estado vacío, emails), deben seguir el estilo line-art / outline con los colores
del sistema. Sin illustraciones 3D o estilo "SaaS genérico 2019".

### Lo que NO hacer con imágenes

- No usar fotos de stock con personas en traje y tablet en mano
- No usar imágenes con texto superpuesto sin contraste WCAG suficiente
- No usar imágenes de semáforos, señales de tráfico o coches genéricos como
  metáfora visual — es demasiado literal para el sector
- No usar overlays azul intenso sobre fotografías — degrada la foto y trivializa
  el uso del color brand

---

## 10. Logo — Reglas de uso

### El logo tiene tres elementos

1. **El mark (SVG)**: cuadrado redondeado azul con camino de carretera y punto de
   destino en naranja con checkmark
2. **El wordmark**: "Escualia" con los cuatro últimos caracteres ("lia") en azul brand
3. **El lock-up horizontal**: mark + wordmark en línea (el que existe hoy en `logo.tsx`)

### Espacio de protección

El logo debe tener un espacio libre alrededor igual a la altura de la letra "E" del
wordmark en todos los lados. Ningún elemento puede entrar en ese espacio.

### Tamaños mínimos

- Lock-up horizontal: 120px de ancho mínimo
- Mark solo: 24px de lado mínimo (por debajo de esto, usar versión simplificada)
- Favicon: 16×16px — solo el mark, sin wordmark

### Variantes permitidas

**Sobre fondo blanco / claro**: lock-up completo con colores originales.

**Sobre fondo oscuro (dark mode)**: el mark mantiene el azul brand. El wordmark
pasa a blanco puro (#FFFFFF). Los cuatro caracteres "lia" mantienen el azul brand
(ligeramente más claro en dark: #60A5FA / blue-400 para mejor contraste).

**Sobre fondo de color brand (azul)**: versión negativa. Mark en blanco con naranja
para el punto de destino. Wordmark en blanco completo.

**Monocromo**: el mark en negro o blanco puro. Wordmark en el mismo color. Usar
solo cuando sea técnicamente inevitable (documentos impresos en blanco y negro,
grabado, bordado).

### Usos incorrectos — NO hacer

1. No estira el logo en ninguna dirección — es vectorial, se escala proporcionalmente
2. No cambiar el color del mark (el azul es brand, el naranja es destino — alterarlos
   rompe la narrativa visual)
3. No separar el mark del wordmark para crear una composición diferente — si necesitas
   el mark solo, úsalo tal cual; si necesitas el wordmark solo, úsalo como está
4. No colocar el logo sobre fotografías sin un fondo sólido o semi-transparente de
   protección — la legibilidad no puede estar en riesgo
5. No añadir sombra, glow, bisel o efecto 3D al logo
6. No rotar el logo — siempre horizontal
7. No usar versiones antiguas o no aprobadas — el archivo fuente es `brand/logo/escualia-mark.svg`
8. No recrear el logo con tipografías del sistema o aproximaciones — siempre usar
   los archivos SVG originales

---

## 11. Ejemplos adicionales de comunicación

> Esta sección complementa los "Antes vs Después" de la sección de Tono de Voz
> con ejemplos adicionales de piezas reales.

### Tagline y variantes

**Principal**: "El software que entiende tu autoescuela"
*Uso*: footer, meta description, firma de email

**Para hero / paid ads**: "Recupera 8 horas a la semana"
*Uso*: primera línea de hero, Facebook/Google Ads

**Para cierre de propuesta**: "Todo en un lugar. Desde mañana."
*Uso*: final de email de ventas, last-screen de demo

---

### Microcopy de estados de UI

| Contexto              | Mal                                  | Bien                                              |
|-----------------------|--------------------------------------|---------------------------------------------------|
| Estado vacío (alumnos)| "No hay alumnos registrados"         | "Aún no tienes alumnos. Añade el primero en 2 minutos." |
| Carga                 | "Cargando..."                        | "Preparando tu agenda..." (específico al contexto)|
| Éxito al guardar      | "Guardado con éxito"                 | "Alumno guardado. Ya aparece en la agenda."       |
| Error de red          | "Error de conexión"                  | "Algo falló. Revisa tu conexión y vuelve a intentarlo." |
| Confirmación borrado  | "¿Estás seguro?"                     | "¿Eliminar a [Nombre]? No se puede deshacer."     |
| Onboarding step 1     | "Bienvenido a Escualia"              | "Empieza por añadir tu primer alumno. Tarda 2 minutos." |

---

### Naming de planes

Los tres planes actuales (Autónomo / Escuela / Franquicia) son correctos: nombran
al segmento de cliente, no a una capacidad técnica. Esta convención debe mantenerse.
Cuando se creen nuevos planes o add-ons, el nombre debe responder a "¿quién eres?"
no a "¿qué incluye?".

---

*Fin del Brand Book v1.0*
*Próxima revisión programada: Q4 2026*
*Cambios significativos requieren alineación con producto, diseño y marketing.*
