# 01 · Resumen de la sesión anterior

**ID:** `ses_177fda7d4fferh40TDUivnPDuz`
**Título:** "Conectar proyecto opencode con Netlify"
**Periodo:** 15/10/2026 → 29/10/2026
**Volumen:** ~25,2 M tokens de entrada / 3,0 M de salida (≈86 mensajes de usuario)
**Modelo:** empezó en `opencode/big-pickle`; el 29/10 se cambió a `opencode-go/glm-5.3`.

No hay que reabrirla. Todo lo reutilizable está aquí.

---

## 1. marlyproperties.com — despliegue y DNS (15–17 oct)

Proyecto **distinto** de centraldetraspasos.com (confirmado por el usuario). Carpeta local:
`C:\Users\Usuario\Downloads\marlyproperties`.

- Se desplegó con **Netlify CLI** (`npx netlify-cli deploy --prod --dir . --functions netlify/functions`),
  sitio `a07c2bf8-cdf0-4696-81b4-8d100622a43e`.
- **Netlify no está enlazado al repositorio de GitHub**: un `git push` NO despliega. Para que
  desplegara hubo que pasar un *personal access token* por `NETLIFY_AUTH_TOKEN` (tokens ya
  revocados). Quedó pendiente enlazar `marlyproperties/marlyproperties` en la UI de Netlify.
- Dominio en **Hostalia** (`marlyproperties.com`), DNS apuntando a Netlify (4 servidores; el panel
  solo aceptaba 3 al principio). El correo `info@marlyproperties.com` sigue en Hostalia.
- Ajustes hechos: ocultar el nombre de la promotora en los títulos de promoción (solo el nombre
  de la promoción), sincronización con el feed de Habihub, arreglo del export `HABIHUB_NAMES`,
  breadcrumbs de fichas que pintaban `[object Object]`, límite de 6 MB al cargar viviendas.
- **Conclusión:** marlyproperties y centraldetraspasos son proyectos separados; no mezclar.

## 2. centraldetraspasos.com — infraestructura

- **Netlify** sirve el sitio estático + funciones serverless. Deploy URL del sitio:
  `https://main--wondrous-pie-0cf615.netlify.app` (nombre interno `wondrous-pie-0cf615`).
- Dominio en Hostalia; DNS a Netlify.
- Repositorio GitHub: `https://github.com/ismaelrealtor73/inmobiliaria.git` (rama `main`).
  **Ojo:** el `git push` tampoco publica por sí solo; el deploy se hacía por CLI/UI.

## 3. SEO (varias sesiones, hasta oct)

Trabajo ya aplicado en el repo:

- `404.html` propio (minificado, enlaces absolutos limpios).
- `hreflang` es/en/x-default y `canonical` en 23+ páginas.
- JSON-LD: `RealEstateAgent`, `WebSite`+`SearchAction`, `FAQPage`, `BreadcrumbList`,
  `Article`+`FAQPage` en los posts del blog.
- Páginas de ciudad/categoría: `locales-*`, `traspasos-*`, `restaurantes`, `bares`,
  `locales-comerciales`, `hosteleria`, `teatinos`.
- Posts de blog nuevos (peluquería, clínica estética, discoteca/pub, precios por zonas,
  financiación, coste de traspaso de restaurante…).
- Sitemap dinámico (`netlify/functions/sitemap.js`) con las 29 fichas.
- Bloques de enlaces internos "Todas nuestras propiedades" **estáticos** (ver bug 3 en `02`).

## 4. Informe de Meta Ads + Idealista/Fotocasa (23 oct)

El usuario pidió un informe con un anuncio de Meta (5.553 visualizaciones, 2.109 espectadores,
2 interesados, 21 €) y sendos PDF de Idealista y Fotocasa. Se generó un documento PDF con el
análisis comparativo. No hay trabajo pendiente ahí; los PDF de origen están en Descargas.

## 5. CRM — `/crm/propietarios` (29 oct)

Se revisó esa ruta y el usuario confirmó que la información estaba correcta
("Perfecto, si ahí está"). También se localizó la ficha/foto del encargo de traspaso de Málaga.
Sin pendientes.

## 6. Consulta puntual: pizzería de Benalmádena (29 oct)

El usuario buscaba el contacto del propietario de una pizzería de Benalmádena (70.000 €) que no
aparecía en la web. Se localizó en el CRM (`/crm/propietarios`). Sin pendientes.

## 7. Tarea que quedó a medias: listado público

Petición literal del usuario (29/10 13:06 UTC):

> "Haz que el listado público se alimente del API como dices y se vean las 29 propiedades"

Lo que hizo la sesión:

1. Confirmó que las fichas `/propiedad/*` van por función SSR (`property-page.js`) y que el
   sitemap ya tenía las 29 fichas.
2. Descargó los archivos públicos en vivo a `%TEMP%\opencode\ct_live` (copia guardada en
   `docs/handoff-2026-10-29/live-2026-10-29/`).
3. Vio que `propiedades.html` **ya** llamaba a `getPublishedProperties()`.
4. En su navegador vio **0 tarjetas** y llamó a `getPublishedProperties()` a mano: 29 elementos.
5. Concluyó (hipótesis) que el 401 de `/api/images/logo` rompía la cadena de arranque.
6. Se quedó sin cuota justo cuando iba a reproducir el arranque paso a paso.

**Corrección verificada el 29/10/2026:** esa hipótesis es **falsa**. Ver `02-estado-web-y-arquitectura.md`.
El listado funcionaba; la medición se hizo antes de que terminara la carga asíncrona.

---

## Decisiones y preferencias del usuario

- Presupuesto cerrado: **10 €/mes** de OpenCode Go. Cero cargos extra.
- Quiere modelos sin entrenamiento con sus datos y retención 0 días (`glm-5.3` cumple).
- Las sesiones antiguas pueden seguir en el modelo gratuito cambiando el modelo en esa sesión.
- Prefiere respuestas en español y explicaciones sin jerga.
- Le gusta que se verifique en producción, no que se le dé teoría.
