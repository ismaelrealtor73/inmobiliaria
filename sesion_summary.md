# Inmobiliaria — Session Summary

## Goal
Help the user (inmobiliaria / real estate agent) generate leads for traspasos de negocios and naves industriales using Meta Ads, SEO improvements, and strategic advice.

## Constraints & Preferences
- 50€/month budget, Meta Ads only
- Target: Málaga province + rest of Spain (naves)
- Audience: Emprendedores 25–50, dueños de negocio
- Content: Link clicks → blog articles (SEO value)
- ChatGPT used for Spanish copy; user open to corrections
- Campaigns run via Meta Ads Manager (not Business Suite)
- User owns and manages the site centraldetraspasos.com

## Progress

### Done
- SEO meta tags (title, desc, og:image, hreflang, canonical) added to 89 key pages via `<head>` includes
- `og-image.png` created (1200×630)
- Blog carousel component created (`includes/blog-carousel.html`)
- Blog list page (`blog/index.html`) refactored to use carousel + featured grid
- 6 SEO blog articles written and published (por qué fracasan, licencia de obras, franquicia vs independiente, traspaso vs alquiler, normas sanitarias, terraza)
- B2B ad account issue resolved (rejected: "real estate" → "business services")
- B2B campaign running: "Naves Industriales" → artículo de naves
- B2C campaign: "Escapa del Alquiler" → artículo de traspaso
- Landing page `traspaso.html` with embedded lead form + WhatsApp CTA (dedicated ad destination)
- New lead form `includes/lead-form.html` (name, email, phone, message)
- B2C ads: 829 visualizaciones, 564 espectadores, 4.25€ gastados, 0 leads (2 days running, 1 day with corrected segment)
- Campaigns managed via Meta Ads Manager
- Grupo Alsea contacted user looking for 150m²+ locales in Málaga & Costa del Sol (rent/transfer, NOT purchase)
- User uploaded sports bar property (Torremolinos centro, 50,000€ transfer, 1,630€ rent)
- Schema JSON-LD (Article) added to all 19 blog posts
- `captacion.html` improved with trust stats + WhatsApp button
- Directory listings guide provided (InfoEmpresa, DirectorioDeAutonomos, etc.)
- Session summary added to repo as `sesion_summary.md`

### In Progress
- B2C Meta Ads campaign (Escapa del Alquiler) — pending results
- B2B Meta Ads campaign (Naves Industriales) — pending results

## Key Decisions
- Landing page `traspaso.html` as ad destination (not homepage)
- New lead form decoupled from landing page
- WhatsApp click-to-chat on landing page
- Blog carousel to cross-promote articles on other pages
- All blog posts got Article schema (JSON-LD) for rich results
- Business Suite → Ads Manager for campaign management
- Grupo Alsea contact → user to send available 150m²+ locales for rent/transfer
- Sports bar property uploaded as user action

## Next Steps (not started)
1. Wait for campaign results (3–5 more days minimum)
2. Optimize based on data: switch to leads objective, adjust creative, retarget
3. Alsea follow-up: send qualifying properties for rent/transfer in Málaga/Costa del Sol
4. Continue SEO: directory listings, backlinks
5. Meta pixel events: track ViewContent on article pages, track lead form submissions
6. Scale budget if campaigns show positive ROI

## Critical Context
- Ad account was locked after 24h (new account); unlocked by verifying identity
- B2B ads initially rejected as "real estate" category; reclassified as "business services" → approved
- Campaigns ran only 2 days; 0 leads but very low spend (4.25€)
- Alsea operates brands: Vips, Foster's Hollywood, Ginos, etc. They want 150m²+ minimum
- The user manages the website directly (centraldetraspasos.com)
- All conversations in Spanish; user is a native Spanish speaker in Málaga

## Relevant Files
- `ads/` — Campaign structure (ad level)
- `articles/`, `includes/blog-carousel.html` — Blog system
- `blog/index.html` — Blog landing page with carousel
- `traspaso.html` — Lead gen landing page
- `captacion.html` — Captación page with stats + WhatsApp
- `includes/lead-form.html` — Embedded lead form
- `includes/og-meta-head.html` — SEO meta tags
- `includes/head.html` — Critical CSS + viewport + description
- `og-image.png` — Social share image
- `sesion_summary.md` — This file
- All 19 blog posts under `blog/` — now with Article schema
