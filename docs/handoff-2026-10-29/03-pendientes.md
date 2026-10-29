# 03 · Pendientes priorizados

Ordenados por **impacto real / riesgo**. Los tres primeros son de una sola sesión corta.
Cada uno lleva criterio de aceptación verificable en producción.

---

## P1 · Arreglar el `<h1>` vacío de la portada — 15 min, riesgo bajo

**Estado: aplicado en local el 29/10/2026. Pendiente de desplegar.**

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

**Qué:** sustituir las listas estáticas de enlaces internos por listas generadas con
`getPublishedProperties()`.

**Dónde:**
- `propiedades.html` → bloque con **8** `<li>` (empieza en la línea 128 del archivo local).
- `index.html` → bloque con **13** `<li>`.

**Cómo:** dejar el HTML estático como está (sirve de respaldo y de contenido inicial para SEO) y,
tras cargar las propiedades, reemplazar el contenido del `<ul>` con las 29 reales. Etiqueta =
`title_es` de la propiedad; `href` = `/propiedad/<slug>`.

**Aceptación:**
- [ ] Tras 10 s, el bloque de `propiedades.html` tiene 29 enlaces.
- [ ] Los 29 devuelven HTTP 200.
- [ ] Con JS desactivado, el bloque sigue mostrando enlaces (respaldo intacto).
- [ ] Ningún enlace apunta a una propiedad en estado distinto de `published`.

---

## P3 · Reducir el tiempo de pintado de la portada — 1–2 h, riesgo medio

**Qué:** hoy la home tarda >4 s en mostrar tarjetas porque hace todo en serie.

**Cómo:** en el `DOMContentLoaded` de `index.html`, lanzar en paralelo las llamadas
independientes y pintar las tarjetas en cuanto lleguen:

```js
const [props] = await Promise.all([
  getPublishedProperties(),
  loadHeaderLogo(),
  applySiteContent(),
]);
renderProperties(props.filter(p => p.featured));
```

Cuidado: `applySiteContent()` también toca `#heroTitle`; si se arregla P1 primero, no hay
conflicto. No partir en dos `await`s que dependan del mismo estado sin comprobar.

**Aceptación:**
- [ ] En producción, con caché vacía, hay tarjetas visibles antes de 2,5 s
      (medir con la pestaña Network o `performance.now()` en consola).
- [ ] Sin errores nuevos en consola.
- [ ] Las 28 tarjetas destacadas siguen saliendo.

---

## P4 · Unificar URLs (limpias vs `.html`) — 2 h, riesgo medio, no urgente

**Qué:** el repo enlaza `propiedades.html`; producción sirve `/propiedades`. El `canonical` ya es
correcto, así que no hay penalización SEO conocida.

**Cómo:** decidir una sola forma (recomendado: limpia, sin `.html`) y cambiarla en **todas** las
páginas a la vez, incluyendo nav, footer y bloques internos. Verificar que los redirects de
`netlify.toml` siguen cubriendo lo antiguo.

**Aceptación:**
- [ ] `grep` no encuentra `href="*.html"` en páginas públicas (salvo casos justificados).
- [ ] Los redirects de `netlify.toml` siguen devolviendo 200 en las URLs viejas.
- [ ] Ningún enlace roto (probar las 69 URLs del sitemap).

---

## P5 · Enlazar el repo a Netlify para que `git push` despliegue — 10 min, requiere al usuario

**Qué:** hoy un `git push` **no publica nada**. Los despliegues se hacían con la CLI y un token
que ya está revocado.

**Cómo (elige una):**
- **A (recomendada):** en la UI de Netlify, *Site configuration → Build & deploy → Link repository*
  y elegir `ismaelrealtor73/inmobiliaria`, rama `main`. Publicación automática en cada push.
- **B:** que el usuario genere un *personal access token* nuevo y pasarlo por `NETLIFY_AUTH_TOKEN`
  solo para el comando de despliegue.

**Aceptación:**
- [ ] Un commit de prueba en `main` aparece publicado en centraldetraspasos.com sin CLI.
- [ ] El token (si se usa) no queda escrito en ningún archivo del repo.

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

## Descartado / ya resuelto (no repetir)

| Tema | Estado |
|---|---|
| "El listado público no se alimenta del API" | ✅ **Resuelto y desplegado.** `/propiedades` muestra 29 desde `/api/properties`. |
| "El 401 de `/api/images/logo` rompe la carga" | ❌ **Falso.** El error se captura; la página pinta. |
| "Solo hay 8 propiedades" | ❌ **Falso.** Son 29; los 8 eran el bloque SEO estático. |
| Sitemap incompleto | ✅ 69 URLs con las 29 fichas. |
| Fichas `/propiedad/*` | ✅ Las 29 devuelven 200. |
| CRM `/crm/propietarios` | ✅ Datos correctos según el usuario. |
| marlyproperties.com | Proyecto aparte, sin pendientes aquí. |
