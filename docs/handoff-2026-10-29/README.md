# Handoff — Central de Traspasos · sesión "Conectar proyecto opencode con Netlify"

**Fecha del traspaso:** 29/10/2026
**Sesión origen:** `ses_177fda7d4fferh40TDUivnPDuz`
**Proyecto local:** `C:\Users\Usuario\Downloads\inmobiliaria`
**Web:** https://centraldetraspasos.com
**Netlify site (deploy URL):** https://main--wondrous-pie-0cf615.netlify.app

---

## Para qué sirve esta carpeta

La sesión original se volvió inmanejable: ~25,2 M de tokens de entrada y 3,0 M de salida
acumulados. Cada turno reenviaba todo ese contexto y agotaba la ventana de 5 h del plan Go
en ~18 minutos. Este paquete resume lo importante para poder continuar en una sesión nueva
y pequeña, sin arrastrar ese historial.

**Léelo en este orden:**

| Archivo | Contenido |
|---|---|
| `01-sesion-anterior.md` | Qué se hizo en la sesión grande (15–29 oct): Netlify, DNS, marlyproperties, SEO, Meta Ads, CRM |
| `02-estado-web-y-arquitectura.md` | Cómo funciona la web, qué está verificado hoy en producción y qué bugs reales quedan |
| `03-pendientes.md` | Backlog priorizado con criterios de aceptación |
| `04-prompt-nueva-sesion.md` | Prompt listo para pegar en la sesión nueva |
| `05-entorno-rutas-y-copias.md` | Rutas locales, git, copias de seguridad, dónde está cada cosa |
| `live-2026-10-29/` | Copia de los archivos públicos descargados de producción (evidencia) |
| `diffs/local-vs-live.txt` | Diff del repo local contra lo servido en producción |

---

## Estado en 1 minuto (verificado el 29/10/2026)

- ✅ **`/propiedades` YA muestra las 29 propiedades** desde `/api/properties`. El trabajo que
  quedó a medias en la sesión anterior **ya estaba resuelto y desplegado**.
- ✅ `/sitemap.xml` incluye las 29 fichas de propiedad (69 URLs en total).
- ✅ Los 8 enlaces estáticos del bloque SEO responden 200.
- ⚠️ La portada `/` pinta 28 tarjetas, pero **tarda más de 4 s** en hacerlo. La lectura de
  "0 tarjetas" de la sesión anterior fue una **medición prematura**, no una cadena rota.
- ⚠️ **Bug real:** el `<h1>` de la portada queda **vacío** tras `applySiteContent()`.
  **Arreglado en local el 29/10, pendiente de desplegar.**
- ⚠️ Los bloques "Todas nuestras propiedades" son **listas estáticas** (8 en `propiedades.html`,
  13 en `index.html`) y no se generan desde el API: enlaces internos SEO desactualizados.

## Dos avisos importantes

1. **`live-2026-10-29/netlify.toml` NO es un netlify.toml.** Netlify no sirve ese archivo:
   la URL devuelve la página 404 (4186 bytes de HTML). El `netlify.toml` bueno es el del repo
   (`C:\Users\Usuario\Downloads\inmobiliaria\netlify.toml`). No lo sustituyas por el del dump.
2. **No hay ningún token de Netlify válido guardado** (los que se pegaron en la sesión anterior
   se revocaron). Para desplegar hace falta que el usuario genere uno nuevo, o enlazar el repo
   a Netlify en la UI para que despliegue solo con `git push`.

## Cuotas del modelo (contexto de por qué se cortó)

- Plan **OpenCode Go** de 10 $/mes, sin overage posible (crédito Extra Usage = 0,00 $).
- Límites: ventana móvil de **5 h**, semanal y mensual. El 29/10 a las 13:08 UTC la ventana
  de 5 h llegó al **100 %** y bloqueó todos los modelos Go (`limitName: "5 hour"`).
- La cuota **gratuita** estaba agotada y se reiniciaba el 30/10 a las 00:00 UTC (01:00 España).
- Recomendación: seguir con `opencode-go/glm-5.3` en sesiones **nuevas y pequeñas**.
  Evitar `opencode/glm-5.3` (402, va contra crédito a 0 $) y `*-free` (429).
