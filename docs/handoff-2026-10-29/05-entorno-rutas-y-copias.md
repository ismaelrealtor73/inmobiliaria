# 05 · Entorno, rutas y copias

---

## 1. Rutas en este ordenador

| Qué | Ruta |
|---|---|
| **Proyecto activo (este)** | `C:\Users\Usuario\Downloads\inmobiliaria` |
| Repo GitHub | `https://github.com/ismaelrealtor73/inmobiliaria.git` (rama `main`) |
| Handoff (este paquete) | `C:\Users\Usuario\Downloads\inmobiliaria\docs\handoff-2026-10-29\` |
| Copia de producción (evidencia) | `...\docs\handoff-2026-10-29\live-2026-10-29\` |
| Diff local vs producción | `...\docs\handoff-2026-10-29\diffs\local-vs-live.txt` |
| Config global de OpenCode | `C:\Users\Usuario\.config\opencode\opencode.jsonc` |
| Base de datos de sesiones | `C:\Users\Usuario\.local\share\opencode\opencode.db` |

### Carpetas que **no** son este proyecto (no tocar)

| Ruta | Qué es |
|---|---|
| `C:\Users\Usuario\Downloads\marlyproperties` | **Otro** proyecto (marlyproperties.com). Netlify site `a07c2bf8-cdf0-4696-81b4-8d100622a43e`. |
| `C:\Users\Usuario\Downloads\Central_traspasos` | Proyecto viejo de Lovable/Vite, sin git, de mayo 2026. No se usa. |
| `C:\Users\Usuario\Downloads\WEB_CENTRAL_TRASPASOS` | Copia de trabajo de junio 2026 (respaldo). |
| `C:\Users\Usuario\Downloads\LOGOTIPOS_CENTRAL_TRASPASOS` | Logos e imágenes sueltas. |
| `C:\Users\Usuario\AppData\Local\Temp\opencode\ctweb_full` | Extracto del respaldo de junio. |
| `C:\Users\Usuario\AppData\Local\Temp\opencode\ct_live` | Origen de la copia de producción (ya volcada al handoff). |

---

## 2. Git

```
Rama:            main
Último commit:   e9f1380  (2026-10-02)
                 "feat: descarga manual de backup (GET /api/backup, solo lectura y solo admin)"
Remoto:          origin -> https://github.com/ismaelrealtor73/inmobiliaria.git
```

- El repo está **limpio**. Los cambios del 29/10 están en el commit `0adaccc`
  (arreglo del H1 + este paquete de traspaso), ya subido a `origin/main`.
  Queda sin seguimiento `cloudflared2.log`.

### Si `git push` falla con "denied to marlyproperties"

GitHub CLI tiene guardada la cuenta `marlyproperties` y su ayudante de credenciales pisa la
credencial correcta, que sí existe en el Gestor de credenciales de Windows para
`ismaelrealtor73`. Solución, sin tocar nada permanente:

```powershell
cd C:\Users\Usuario\Downloads\inmobiliaria
$env:GIT_TERMINAL_PROMPT="0"
git -c credential.helper= -c credential.helper=manager push origin main
Remove-Item Env:\GIT_TERMINAL_PROMPT
```

Eso usa la credencial de `ismaelrealtor73` y sube correctamente. Si algún día caduca, habrá que
volver a iniciar sesión con esa cuenta (`gh auth login`) o pegar un token nuevo.

- **`git push` NO publica la web.** Netlify no está enlazado al repositorio. Ver P5 en
  `03-pendientes.md`.
- Los despliegues se hacían a mano:
  ```
  npx netlify-cli deploy --prod --dir . --functions netlify/functions
  ```
  con un `NETLIFY_AUTH_TOKEN` temporal. **Ese token ya no vale** (se revocó).
- No hay ningún token guardado en el repo. No lo busques.

### Antes de commitear

```powershell
cd C:\Users\Usuario\Downloads\inmobiliaria
git status
git diff
```

Si se quiere guardar este handoff, **pedir permiso al usuario** primero. Commit sugerido:

```
docs: traspaso de sesión 2026-10-29 (estado verificado, pendientes y copia de producción)
```

---

## 3. Cómo se despliega (dos caminos)

**A. Enlazar el repo a Netlify (recomendado, una sola vez).**
Netlify → *Site configuration → Build & deploy → Link repository* → `ismaelrealtor73/inmobiliaria`,
rama `main`, comando de build vacío, carpeta de publicación `.`.
A partir de ahí, `git push` publica solo. **Es la opción que evita manejar tokens.**

**B. CLI con token temporal.**
El usuario genera un *personal access token* en Netlify y se pasa solo para ese comando:

```powershell
$env:NETLIFY_AUTH_TOKEN="<token>"
npx.cmd -y netlify-cli@latest deploy --prod --dir . --functions netlify/functions
Remove-Item Env:\NETLIFY_AUTH_TOKEN
```

No escribir el token en ningún archivo.

**URL de despliegue del sitio:** `https://main--wondrous-pie-0cf615.netlify.app`
(nombre interno `wondrous-pie-0cf615`).

---

## 4. Cómo comprobar producción sin desplegar nada

Estas comprobaciones son de solo lectura y sirven para saber si algo está roto de verdad.

```powershell
# ¿La API devuelve las 29?
(Invoke-RestMethod https://centraldetraspasos.com/api/properties).Count

# ¿El sitemap tiene 69 URLs y 29 fichas?
$sm = Invoke-WebRequest https://centraldetraspasos.com/sitemap.xml
([regex]::Matches($sm.Content,'<loc>')).Count
([regex]::Matches($sm.Content,'/propiedad/')).Count

# ¿Una página responde 200?
(Invoke-WebRequest https://centraldetraspasos.com/propiedades -Method Head).StatusCode
```

En el navegador (pestaña Consola de la web):

```js
// esperar 10 s antes de fiarse del resultado
document.getElementById('propertiesGrid').children.length   // 29 en /propiedades, 28 en /
document.getElementById('resultCount').textContent          // "29 propiedades encontradas"
document.getElementById('heroTitle').textContent            // hoy: "" (bug P1)
```

**Recordatorio:** el listado tarda >4 s. Medir al segundo 1 da un falso "0 propiedades".

---

## 5. Copias de seguridad

| Copia | Dónde | Fecha | Notas |
|---|---|---|---|
| Repo git | GitHub + local | commit 2026-10-02 | fuente de verdad del código |
| Respaldo junio | `C:\Users\Usuario\Downloads\WEB_CENTRAL_TRASPASOS` y `%TEMP%\opencode\ctweb_full` | 2026-06-22 | anterior a SEO y CRM actual |
| Copia de producción | `docs/handoff-2026-10-29/live-2026-10-29/` | 2026-10-29 | 11 archivos, solo páginas públicas |
| Datos del CRM | Netlify Blobs, almacén `crm` | continuo | propiedades, textos, imágenes, leads, usuarios |
| Backup del CRM | `GET /api/backup` (solo admin) | — | descarga manual en JSON; no restaura nada |

**Importante:** la copia de producción **no** incluye los datos del CRM ni las imágenes.
Solo el HTML/JS/sitemap servido públicamente. Si se pierde el almacén de Blobs, se pierden las
propiedades reales; lo que hay en el repo son datos DEMO de respaldo.

No hay una copia automática verificada del almacén `crm` en este momento. Si el usuario quiere
tranquilidad, lo más útil es descargar `/api/backup` desde el CRM una vez a la semana y guardar
el JSON fuera del portátil.

---

## 6. Archivos del proyecto que conviene conocer

```
inmobiliaria/
├── index.html                 Portada. Script inline grande; aquí está el bug del H1.
├── propiedades.html           Listado público (29 tarjetas desde la API).
├── blog.html, blog/*.html     Blog y posts.
├── locales-*.html             Páginas de ciudad (SEO local).
├── traspasos-*.html
├── restaurantes.html, bares.html, hosteleria.html, locales-comerciales.html, teatinos.html
├── captacion.html             Formulario "vende tu propiedad".
├── crm/                       CRM interno (login, propiedades, propietarios…).
├── css/style.css              Estilos.
├── js/
│   ├── data.js                API, respaldo local, propiedades DEMO, utilidades.
│   ├── translations.js        ES/EN. Aquí está applyTranslation() (causa del H1 vacío).
│   └── cookie-banner.js
├── img/
├── netlify.toml               Redirects. FUENTE DE VERDAD. No sustituir.
├── netlify/functions/
│   ├── api.js                 API completa. Minificado en 1 línea. Credenciales dentro.
│   ├── property-page.js       SSR de /propiedad/*.
│   └── sitemap.js             Sitemap dinámico.
└── docs/
    ├── handoff-2026-10-29/    Este paquete.
    ├── manual-operativo-central-traspasos.md / .docx
```

**Ojo con `netlify/functions/api.js`:** 18 KB en una sola línea, con `SMTP_USER`, `SMTP_PASS` y
`API_SECRET` como valores por defecto, y usuarios con hash de contraseña. Cualquier cambio ahí es
delicado. Ver P6 en `03-pendientes.md`.

---

## 7. OpenCode: modelo y cuotas

- Config global: `C:\Users\Usuario\.config\opencode\opencode.jsonc`
- Modelo por defecto para sesiones nuevas: `opencode-go/glm-5.3`
  (contexto grande, retención 0 días, sin entrenamiento con los datos).
- **No usar** `opencode/glm-5.3` → error 402 (va contra crédito Extra Usage, que está a 0,00 $).
- **No usar** modelos `*-free` → error 429 (cuota gratuita agotada).
- Plan Go: 10 $/mes, sin posibilidad de cargos extra. Límites por ventana de 5 h, semanal y
  mensual. Todos los modelos Go comparten la misma ventana.
- Las sesiones antiguas conservan el modelo con el que se crearon; el cambio de defecto no las
  afecta.
- La sesión grande (`ses_177fda7d4fferh40TDUivnPDuz`) sigue existiendo en la base de datos, pero
  **no conviene reabrirla**: reenvía ~25 M de contexto por turno.

### Si se quiere consultar algo de la sesión vieja sin abrirla

Los datos están en `opencode.db`, tablas `session_v2`, `session_message`, `part`.
Hay scripts de ayuda en `C:\Users\Usuario\AppData\Local\Temp\opencode\`:

| Script | Para qué |
|---|---|
| `db-users2.mjs` | listar mensajes del usuario de la sesión vieja |
| `db-last.mjs` | volcar los últimos mensajes (usuario + respuestas) |
| `db-tools.mjs` | buscar en las llamadas a herramientas por palabra clave |

Uso: `node "%TEMP%\opencode\db-tools.mjs" netlify`

Son de solo lectura (`readOnly: true`). No modifican la base de datos.
