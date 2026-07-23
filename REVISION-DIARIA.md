# Revisión Diaria — Central de Traspasos

Cada vez que te conectes, ejecuta esta revisión:

## 1. Encoding y Archivos Críticos
- [ ] `js/translations.js` — sin caracteres rotos (U+FFFD, \u0080)
- [ ] `js/data.js` — sin encoding corruption, `site_images` intacto
- [ ] `css/style.css` — sin `}00;` ni reglas rotas

## 2. Enlaces Rotos
- [ ] `bares.html` — enlace a blog funcional
- [ ] `locales-comerciales.html` — enlace a traspasos-marbella.html
- [ ] Todos los enlaces internos apuntan a archivos existentes

## 3. SEO y Meta Tags
- [ ] Titles < 60 caracteres en páginas públicas
- [ ] Descriptions < 160 caracteres
- [ ] OG tags completos (title, description, image)
- [ ] JSON-LD Schema presente en páginas públicas
- [ ] `robots: noindex, nofollow` en páginas internas/anuncios

## 4. Assets
- [ ] Todas las imágenes referenciadas existen
- [ ] CSS y JS cargan correctamente
- [ ] Favicon funciona

## 5. Netlify
- [ ] `netlify.toml` tiene redirects para todas las páginas
- [ ] Funciones serverless funcionan (api.js, property-page.js)

## 6. Funcionalidad
- [ ] CRM login funciona
- [ ] Propiedades se cargan (data.js + localStorage)
- [ ] Blog carga posts correctamente
- [ ] Carrusel de propiedades funciona

## 7. Cambios Recientes
- [ ] Revisar `git status` — ¿hay cambios sin commitear?
- [ ] Revisar `git log --oneline -5` — últimos cambios

---

**Última revisión:** [FECHA]
**Problemas encontrados:** [DESCRIPCIÓN]
**Acciones tomadas:** [DESCRIPCIÓN]
