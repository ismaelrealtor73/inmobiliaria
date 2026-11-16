# 03 · Pendientes priorizados

Ordenados por **impacto real / riesgo**. Los tres primeros son de una sola sesión corta.
Cada uno lleva criterio de aceptación verificable en producción.

---

## P1 · Arreglar el `<h1>` vacío de la portada — 15 min, riesgo bajo

**Estado: ✅ hecho y verificado en producción el 16/11/2026.** El H1 dice
"Tu negocio, nuestro compromiso" y aguanta el cambio ES→EN→ES.

**Qué:** el título principal de la home desaparece al cargar el JS (ver bug 1 de `02`).

**Dónde:** el `<script>` inline al final de `index.html`, dentro de `applySiteContent()`.
También afecta a `#heroSubtitle` y `#aboutDesc`.

**Cómo:** cambiar `elemento.dataset.i18n = ''` por `elemento.removeAttribute('data-i18n')`.
(Alternativa defensiva: en `js/translations.js`, en `applyTranslation()`, ignorar claves vacías.)

**Aceptación (cuando se despliegue):**
- [ ] En producción, 10 s después de cargar `/`: `document.getElementById('heroTitle').textContent`
      contiene "CENTRAL DE TRASPASOS".
- [ ] `#heroSubtitle` y `#aboutDesc` tienen texto.
- [ ] Cambiar a EN y volver a ES no deja el H1 vacío.

---

## P2 · Generar los bloques "Todas nuestras propiedades" desde el API — 1 h, riesgo medio

**Estado: ✅ hecho el 16/11/2026.** Además de generarse al cargar con JS (32 enlaces,
también al cambiar de idioma), el HTML estático ya trae los 32 enlaces reales, así que
con JS desactivado el bloque también está completo.

**Qué:** sustituir las listas estáticas de enlaces internos por listas generadas con
`getPublishedProperties()`.

**Dónde:**
- `propiedades.html` → bloque con **8** `<li>` (empieza en la línea 128 del archivo local).
- `index.html` → bloque con **13** `<li>`.

**Cómo:** dejar el HTML estático como está (sirve de respaldo y de contenido inicial para SEO) y,
tras cargar las propiedades, reemplazar el contenido del `<ul>` con las 29 reales. Etiqueta =
`title_es` de la propiedad; `href` = `/propiedad/<slug>`.

**Aceptación:**
- [x] Tras 10 s, el bloque de `propiedades.html` tiene 32 enlaces.
- [x] Los 32 devuelven HTTP 200.
- [x] Con JS desactivado, el bloque sigue mostrando enlaces (32 en el HTML).
- [x] Ningún enlace apunta a una propiedad en estado distinto de `published`.

---

## P3 · Reducir el tiempo de pintado de la portada — 1–2 h, riesgo medio

**Estado: ✅ hecho el 16/11/2026.**

La causa real era otra: `/api/properties` devolvía **6,5 MB** (98 % fotos en base64),
tardaba ~9 s solo en descargarse y bloqueaba cualquier pintado. Solución aplicada:

1. `GET /api/properties?lite=1` → **124 KB** (sin fotos, con `hasImage` y `imageVersion`).
   Las páginas públicas usan siempre `lite`.
2. Nueva ruta pública `GET /api/property-image/<id>?v=<hash>` → devuelve la foto en binario
   con caché de 7 días. El `?v=` cambia al cambiar la foto, así que nunca se queda una
   imagen vieja en caché.
3. Tarjetas con `loading="lazy"` y miniatura WebP de 600 px vía Netlify Image CDN
   (~31 KB transferidos frente a 154 KB de la original). Si el CDN falla, vuelve sola a la
   imagen original.
4. Caché en memoria de 45 s en la función (`PROPS_CACHE_TTL`): la respuesta caliente pasa de
   ~800 ms a ~2 ms de función. El CRM (peticiones con `Authorization`) sigue leyendo siempre
   datos frescos, y crear/editar/borrar invalida la caché.
5. Carga inicial en paralelo: logo y textos ya no bloquean el listado.

**Medido en producción (16/11/2026):** 32 tarjetas, 32 enlaces, DOM listo en ~0,9 s y
página cargada en ~1,0 s (antes >9 s). Payload del listado: 124 KB (33 KB comprimido).

**Aceptación:**
- [x] En producción, con caché vacía, hay tarjetas visibles antes de 2,5 s.
- [x] Sin errores nuevos en consola (solo el 401 esperado de `/api/images/logo`).
- [x] Las 31 tarjetas destacadas salen en la portada.

---

## P4 · Unificar URLs (limpias vs `.html`) — ✅ hecho y verificado el 16/11/2026

**Estado: resuelto.** Los enlaces internos de las 21 páginas raíz ya van sin `.html`
(nav, footer, botones, blog hacia la web y la ficha SSR), y las direcciones viejas
(`/propiedades.html`, `/index.html`, …) redirigen **301** a la limpia. Los artículos del
blog mantienen su `.html`, que es su canonical (así están en sitemap y enlaces entre ellos).

**Verificado en producción (16/11/2026):** las 20 URLs limpias + `/` responden 200; las 20
`.html` redirigen 301 a su limpia; `/index.html` → `/`; las 72 URLs del sitemap responden
200; la ficha enlaza `/propiedades`; el banner de cookies apunta a `/aviso-legal` absoluto
(estaba roto en fichas y artículos); CRM e inglés funcionan igual.

**Aceptación:**
- [x] `grep` no encuentra `href="*.html"` en páginas públicas (salvo CRM y artículos del blog entre sí).
- [x] Las URLs viejas redirigen 301 (no 404).
- [x] Ningún enlace roto (probadas las 72 URLs del sitemap).

---

## P5 · Enlazar el repo a Netlify para que `git push` despliegue — 10 min, requiere al usuario

**Estado: ✅ resuelto.** Comprobado el 16/11/2026: cada `git push` a `main` se publica solo
en centraldetraspasos.com en ~1–2 minutos (los tres últimos commits salieron sin usar la CLI).

**Qué:** hoy un `git push` **no publica nada**. Los despliegues se hacían con la CLI y un token
que ya está revocado.

**Cómo (elige una):**
- **A (recomendada):** en la UI de Netlify, *Site configuration → Build & deploy → Link repository*
  y elegir `ismaelrealtor73/inmobiliaria`, rama `main`. Publicación automática en cada push.
- **B:** que el usuario genere un *personal access token* nuevo y pasarlo por `NETLIFY_AUTH_TOKEN`
  solo para el comando de despliegue.

**Aceptación:**
- [x] Un commit de prueba en `main` aparece publicado en centraldetraspasos.com sin CLI.
- [x] El token (si se usa) no queda escrito en ningún archivo del repo.

---

## P6 · Limpieza de seguridad (importante, no bloqueante)

Detectado al revisar `netlify/functions/api.js`:

- Hay **valores por defecto** de `SMTP_USER`, `SMTP_PASS` y `API_SECRET` escritos dentro del
  código. Si el archivo está en un repo público, esas credenciales están expuestas.
- Hay usuarios (`admin`, `agente1`, `agente2`) con hashes de contraseña en el propio archivo.

**Acciones:**
1. Comprobar si el repo de GitHub es público o privado.
2. Si es público: **rotar** la contraseña de aplicación del correo y `API_SECRET`, y mover los
   valores a variables de entorno de Netlify (`Site configuration → Environment variables`).
3. Quitar los valores por defecto del código y hacer que la función falle de forma explícita si
   faltan.

**Aceptación:**
- [ ] `grep` del repo no devuelve contraseñas ni secretos.
- [ ] El envío de emails y el login del CRM siguen funcionando tras rotar.

*Este punto no lo pidió el usuario, pero es el de mayor riesgo potencial de la lista. Mencionarlo
antes de tocar nada.*

---

## P7 · Fichas de propiedad ligeras — ✅ hecho y desplegado el 16/11/2026

**Qué pasaba:** cada ficha metía en el HTML la foto de la galería y las portadas de las tres
fichas similares en base64: **1,4 MB** de HTML por visita.

**Solución aplicada:**
1. Las fotos se sirven por `GET /api/property-image/<id>?i=<n>&v=<hash>` (binario, caché de
   7 días). `?i=` elige la foto de la galería y se valida (fuera de rango → 404).
2. La ficha solo carga la primera foto (con `fetchpriority="high"`); las demás llevan `data-src`
   y se piden al cambiar de diapositiva (también se precargan la anterior y la siguiente).
3. Las portadas de "fichas similares" usan la misma ruta con `loading="lazy"`.
4. `og:image`, `twitter:image` y el JSON-LD usan la URL absoluta versionada.
5. Caché en memoria de 45 s (`PROPS_CACHE_TTL`) para el blob de las fichas.

**Medido en producción (16/11/2026):** HTML de **1,4 MB → ~26 KB**; segunda visita a una ficha
en ~2 ms de función (antes ~800 ms de lectura del blob). Tests locales en verde: sin `data:image/`
en el HTML, una sola foto con `src`, resto con `data-src`, índices inválidos → 404, caché activa.

---

## Descartado / ya resuelto (no repetir)

| Tema | Estado |
|---|---|
| "El listado público no se alimenta del API" | ✅ **Resuelto y desplegado.** `/propiedades` muestra 32 desde `/api/properties?lite=1`. |
| "El 401 de `/api/images/logo` rompe la carga" | ❌ **Falso.** El error se captura; la página pinta. |
| "Solo hay 8 propiedades" | ❌ **Falso.** Son 32; los 8 eran el bloque SEO estático. |
| Listado lento (6,5 MB de fotos base64) | ✅ **Resuelto.** Listado 124 KB + imágenes aparte con caché. |
| Fichas lentas (1,4 MB de fotos base64) | ✅ **Resuelto.** Ficha ~26 KB + imágenes aparte con caché y carga bajo demanda. |
| Sitemap incompleto | ✅ 72 URLs con las 32 fichas. |
| Fichas `/propiedad/*` | ✅ Las 32 devuelven 200. |
| CRM `/crm/propietarios` | ✅ Datos correctos según el usuario. |
| `git push` no desplegaba | ✅ Netlify está enlazado con GitHub: publica solo. |
| marlyproperties.com | Proyecto aparte, sin pendientes aquí. |

### Pendiente real y conocido

- El **CRM** sigue pidiendo `/api/properties` completo (con fotos base64), así que el panel de
  administración sigue siendo pesado. No afecta a las páginas públicas.
- **P6** (mover secretos a variables de entorno y rotar credenciales) sigue abierto.
