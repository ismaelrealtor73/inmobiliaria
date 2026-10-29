# 02 · Estado de la web y arquitectura

Todo lo de esta página está **verificado en producción** el 29/10/2026 navegando
`https://centraldetraspasos.com`, no deducido leyendo código.

---

## 1. Arquitectura real

No es una SPA ni un WordPress. Es **HTML estático + JavaScript + funciones serverless de Netlify**.

```
centraldetraspasos.com
│
├── Páginas estáticas (.html)          index.html, propiedades.html, blog.html,
│   ├── cargan css/style.css           locales-*.html, traspasos-*.html,
│   ├── js/translations.js             restaurantes.html, bares.html,
│   ├── js/data.js                     hosteleria.html, 404.html …
│   └── js/cookie-banner.js
│
├── Funciones serverless (netlify/functions/)
│   ├── api.js            → /api/*        (propiedades, site-content, imágenes,
│   │                                      leads, usuarios, backup, envío email)
│   ├── property-page.js  → /propiedad/*  (SSR de cada ficha, con SEO)
│   └── sitemap.js        → /sitemap.xml  (sitemap dinámico)
│
├── Datos: Netlify Blobs, almacén "crm"
│   ├── properties        (las 29 propiedades)
│   ├── site_content      (textos, teléfono, email, dirección)
│   ├── images/*          (logo, hero, fotos)
│   └── leads, users, backups…
│
└── netlify.toml          → redirects y build
```

### Redirects que importan (`netlify.toml`)

| Desde | A | Efecto |
|---|---|---|
| `/api/*` | `/.netlify/functions/api/:splat` | API pública |
| `/propiedad/*` | `/.netlify/functions/property-page/:splat` | fichas SSR con SEO |
| `/en/propiedad/*` | `/.netlify/functions/property-page/:splat` | fichas en inglés |
| `/sitemap.xml` | `/.netlify/functions/sitemap` | sitemap dinámico |
| `/blog`, `/locales-malaga`, `/traspasos-marbella`, … | `/<página>.html` | URLs limpias |
| `/en/*` | `/:splat` | el inglés se resuelve en cliente (no hay páginas `/en/` reales) |

**Consecuencia práctica:** las páginas se sirven con URL limpia (`/propiedades`) pero los
enlaces internos del repo son relativos (`propiedades.html`). Funciona, pero hay dos formas de
llegar a la misma página. Ver bug 4.

---

## 2. Cómo carga el listado público (y por qué a veces parece vacío)

`propiedades.html`:

1. HTML con un `<div class="properties-grid" id="propertiesGrid"></div>` **vacío**.
2. Al final, un `<script>` inline con `DOMContentLoaded` que hace:
   ```
   loadHeaderLogo()
   → applySiteContent()
   → populateSearchTowns() / populateQCTowns()
   → getPublishedProperties()      // fetch('/api/properties')
   → renderProperties(...)         // pinta las tarjetas
   ```
3. `getPublishedProperties()` (en `js/data.js`) llama a `apiFetch('/properties')`, filtra
   `status === 'published'` y, si la API falla, cae a `localStorage.crm_properties` y luego a
   `DEFAULT_PROPERTIES`. Por eso casi nunca devuelve 0.

**Medición real en producción (29/10):**

| Comprobación | Resultado |
|---|---|
| `GET /api/properties` | `200`, `application/json`, **29 elementos**, todos `published` |
| Tarjetas en `/propiedades` | **29** |
| Texto del contador | `29 propiedades encontradas` |
| Municipios en el desplegable | 103 |
| Errores de consola | solo el 401 esperado de `/api/images/logo` |
| `/sitemap.xml` | 69 URLs, **29** de `/propiedad/` |

### La hipótesis falsa de la sesión anterior

La sesión grande vio **0 tarjetas** y concluyó que el `401` de `/api/images/logo` rompía el
arranque. **Es falso.** Comprobado:

- `getSiteImage()` captura el error del 401 y devuelve `null`; no propaga excepción.
- Reproduciendo el arranque paso a paso a mano, todos los pasos devuelven `ok`.
- La causa era **medir demasiado pronto**: el listado tarda >4 s (fetch frío a `/api/*` +
  lectura de Blobs). Si se mira el DOM al segundo 1, está vacío. A los 5–10 s, hay 29.
- Además, la portada tarda aún más porque arranca **más** trabajo antes de pintar.

**Regla para la próxima sesión:** no dar por roto nada hasta haber esperado al menos 10 s
después de `load`, o hasta haber llamado a `getPublishedProperties()` a mano y ver el número.

---

## 3. Estado verificado por página

| URL | Estado | Notas |
|---|---|---|
| `/` | ✅ 28 tarjetas (todas las `featured`) | tarda >4 s; H1 vacío (bug 1) |
| `/propiedades` | ✅ 29 tarjetas | contador correcto, orden y filtros OK |
| `/propiedad/<slug>` | ✅ 200 en las 29 | SSR con JSON-LD, canonical y hreflang |
| `/sitemap.xml` | ✅ 69 URLs | 29 fichas + páginas + blog |
| `/blog`, `/locales-*`, `/traspasos-*`, `/restaurantes`, `/bares`, `/hosteleria`, `/locales-comerciales` | ✅ 200 | enlazadas desde home y footer |
| `/crm/*` | ✅ | login y propietarios; datos correctos según el usuario |
| `/aviso-legal`, `/404` | ✅ | |

Comprobación de los 8 enlaces estáticos del bloque SEO de `propiedades.html`: **los 8
devuelven HTTP 200**. O sea: no hay enlaces rotos hoy, aunque la lista esté congelada.

---

## 4. Bugs y problemas reales

### Bug 1 — El `<h1>` de la portada queda vacío (confirmado)

**Síntoma:** en producción, `document.getElementById('heroTitle').textContent === ""`.

**Causa, en `index.html`:**

```js
async function applySiteContent() {
  const sc = await getSiteContent();
  if (sc.hero_title_es) {
    document.getElementById('heroTitle').textContent = ...;
    document.getElementById('heroTitle').dataset.i18n = '';   // ← aquí
  }
  ...
}
```

Al poner `dataset.i18n = ''`, el elemento sigue teniendo el atributo `data-i18n` pero con valor
vacío. Después, `applyTranslation()` recorre **todos** los `[data-i18n]` y hace
`el.textContent = t(key)`; con `key === ''`, `t('')` devuelve `''` y **borra el texto**.

Lo mismo le pasa a `#heroSubtitle` y a `#aboutDesc`.

**Impacto:** SEO y accesibilidad. El título principal de la home no existe para Google ni para
lectores de pantalla. En el HTML fuente sí está, pero el JS lo borra al cargar.

**Estado:** arreglado en el repo el 29/10/2026 (se sustituyó `dataset.i18n = ''` por
`removeAttribute('data-i18n')` en los tres elementos). Falta desplegar para que se note en
producción.

**Arreglo recomendado (mínimo y seguro):** en vez de vaciar el valor, **quitar el atributo**:

```js
document.getElementById('heroTitle').removeAttribute('data-i18n');
```

y hacer lo mismo con `heroSubtitle` y `aboutDesc`. Alternativa: en `applyTranslation()`, saltar
los elementos cuyo `data-i18n` esté vacío (`if (!key) return;`). Con una de las dos basta.

**Criterio de aceptación:** en producción, tras 10 s, `heroTitle.textContent` contiene
"CENTRAL DE TRASPASOS" y el `<h1>` aparece en el HTML renderizado.

### Bug 2 — Los bloques "Todas nuestras propiedades" son listas estáticas

Hay enlaces internos escritos a mano que deberían salir del API:

- `propiedades.html`: **8** enlaces en el bloque "Todas nuestras propiedades".
- `index.html`: **13** enlaces en el mismo tipo de bloque.

Hoy los 8 de `propiedades.html` responden 200, así que **no hay enlaces rotos**, pero:

- no se actualizan solos: si se publica o se retira una propiedad, la lista miente;
- faltan 21 propiedades de las 29;
- el ancla de texto no coincide con el título real de la ficha en todos los casos.

**Arreglo:** generar esos `<li>` desde `getPublishedProperties()` al cargar (mismo patrón que
las tarjetas), dejando el HTML estático solo como respaldo sin JS. Ojo: son enlaces SEO, así que
conviene que el HTML de partida siga teniendo contenido, no un `<ul>` vacío.

### Bug 3 — La portada tarda más de 4 s en pintar

No es un fallo funcional, pero se nota y fue lo que provocó el falso positivo de "0 tarjetas".

Cadena actual, toda en serie:

```
loadHeaderLogo()  →  applySiteContent()  →  getSiteContent()  →  getSiteImage('hero')
                  →  getPublishedProperties()  →  renderProperties()
```

Cada paso es un `fetch` a una función serverless en frío. **Mejora:** lanzar en paralelo lo que
no depende entre sí (`getPublishedProperties()` y `getSiteContent()`), y pintar las tarjetas en
cuanto lleguen, sin esperar al logo ni al hero. Con `Promise.all` se recorta buena parte.

### Bug 4 — Dos URLs para la misma página

- Servido: `/propiedades`, `/blog`, `/locales-malaga` (URLs limpias, con `canonical` correcto).
- Enlazado dentro del repo: `propiedades.html`, `blog.html`, `locales-malaga`…

El `canonical` ya apunta a la URL limpia, así que Google no debería duplicar. Pero es una
inconsistencia que ensucia el mantenimiento. **No es urgente.** Si se toca, hacerlo de una vez y
en todas las páginas, no a medias.

### Aviso — `live-2026-10-29/netlify.toml` no es el netlify.toml

Netlify **no sirve** `netlify.toml` como archivo público. Al pedirlo, devuelve la página 404
(4186 bytes de HTML). Por eso en el dump ese archivo es basura. **El bueno es el del repo:**
`C:\Users\Usuario\Downloads\inmobiliaria\netlify.toml` (144 líneas).

---

## 5. Diferencia entre el repo y lo servido en producción

Diff completo en `diffs/local-vs-live.txt`. Resumen:

- **`propiedades.html`**: 12 líneas cambiadas, todas de navegación/pie. El repo usa rutas
  relativas (`index.html`, `propiedades.html`); producción sirve rutas absolutas limpias
  (`/`, `/propiedades`). **Funcionalmente equivalente.** Mismo número de bloques JSON-LD (3).
- **Resto de páginas**: mismas diferencias de enlaces, sin cambios de lógica.
- **`netlify.toml`**: ignorar el del dump (ver aviso arriba).
- **`data.js`**: el servido y el del repo son equivalentes en lo que importa (constantes +
  propiedades DEMO de respaldo).

Conclusión: **el repo local refleja lo que hay en producción.** No hay código "perdido" solo en
el servidor.

---

## 6. Lo que NO hay que tocar

- `netlify/functions/api.js` es un archivo **minificado en una sola línea** con credenciales por
  defecto dentro (SMTP y `API_SECRET`). Funciona; cualquier edición a mano es de alto riesgo.
  Si hay que cambiar algo ahí, hacerlo con cuidado y probando la función en local.
- `/api/images/*` exige autenticación: el 401 en las páginas públicas es **esperado**, no un bug.
- No sustituir `netlify.toml` por el del dump.
- No "arreglar" los `??` que aparecen al leer archivos con algunas herramientas: es un problema
  de codificación al leer, la web muestra los emojis correctamente.
