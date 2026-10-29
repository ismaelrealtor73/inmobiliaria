# 04 · Prompt para la sesión nueva

Copia el bloque de abajo tal cual y pégalo como **primer mensaje** de una sesión nueva y vacía.
No hace falta adjuntar nada más: los documentos están en el repo.

---

```
Contexto: seguimos con la web centraldetraspasos.com. Es una sesión nueva y pequeña a
propósito: la anterior acumuló ~25 M de tokens y agotaba la cuota en minutos.

Antes de tocar nada, lee estos archivos en este orden (están en el repo):
  docs/handoff-2026-10-29/README.md
  docs/handoff-2026-10-29/02-estado-web-y-arquitectura.md
  docs/handoff-2026-10-29/03-pendientes.md
  docs/handoff-2026-10-29/05-entorno-rutas-y-copias.md
NO leas 01-sesion-anterior.md salvo que necesites historia: es solo contexto.

Proyecto local: C:\Users\Usuario\Downloads\inmobiliaria
Web: https://centraldetraspasos.com
Repo: https://github.com/ismaelrealtor73/inmobiliaria (rama main)

Reglas:
1. Responde en español, claro y sin jerga.
2. Verifica en producción antes de afirmar nada. Si parece que algo está roto, espera
   al menos 10 segundos a que cargue: el listado tarda >4 s y eso ya provocó un falso
   positivo de "0 propiedades".
3. No despliegues ni hagas git push sin pedirme permiso. Tampoco cambies
   netlify/functions/api.js sin avisar: es un archivo minificado de una sola línea con
   credenciales dentro.
4. El netlify.toml bueno es el del repo. El de docs/handoff-2026-10-29/live-2026-10-29/
   es basura (es la página 404 que devuelve Netlify), ignóralo.
5. Presupuesto cerrado: plan OpenCode Go de 10 $/mes, sin cargos extra.

Lo primero que quiero hacer es el P1 de 03-pendientes.md: el <h1> de la portada queda
vacío porque applySiteContent() pone data-i18n="" y luego applyTranslation() lo borra.
Propónme el cambio exacto (archivo y líneas) y espera mi OK antes de editarlo.

Después veremos P2 y P3.
```

---

## Notas para el usuario (no pegar)

- **Modelo:** usar `opencode-go/glm-5.3`. No usar `opencode/glm-5.3` (da 402 por crédito a 0 $)
  ni los `*-free` (429).
- **Por qué una sesión nueva:** el coste no es el modelo, es el historial. Una sesión con 25 M de
  contexto reenvía todo en cada turno. Empezar de cero es lo que hace que el plan de 10 $ aguante.
- **Si el prompt se queda corto:** añade al final "y antes de empezar, dime en 5 líneas qué has
  entendido", así detectas enseguida si ha leído bien los documentos.
- **Orden recomendado:** P1 (rápido, visible) → P3 (velocidad) → P2 (listas dinámicas) → P5
  (enlazar Netlify) → P4 y P6 cuando haya tiempo.
