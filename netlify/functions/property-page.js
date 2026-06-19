import { getStore } from '@netlify/blobs';

const DEFAULT_PROPERTIES = [
  { id: 1, title_es: 'Local comercial en centro de Málaga', title_en: 'Commercial premises in Málaga center', town: 'Málaga', type: 'sale', price: 250000, sqm: 120, bathrooms: 1, smoke_exhaust: false, terrace: false, license: 'Activa', desc_es: 'Amplio local de 120m² en pleno centro de Málaga. Excelente ubicación, alto tránsito peatonal.', desc_en: 'Spacious 120m² premises in the heart of Málaga. Excellent location, high foot traffic.', images: [], featured: true, status: 'published', createdBy: 'admin', createdAt: '2026-05-15' },
  { id: 2, title_es: 'Restaurante en Marbella', title_en: 'Restaurant in Marbella', town: 'Marbella', type: 'transfer', price: 85000, sqm: 150, bathrooms: 2, smoke_exhaust: true, terrace: true, license: 'Activa', desc_es: 'Restaurante en funcionamiento con terraza. Capacidad para 60 comensales. Traspaso por jubilación.', desc_en: 'Operating restaurant with terrace. Capacity for 60 diners. Transfer due to retirement.', images: [], featured: true, status: 'published', createdBy: 'agente1', createdAt: '2026-05-10' },
  { id: 3, title_es: 'Oficina en Fuengirola', title_en: 'Office in Fuengirola', town: 'Fuengirola', type: 'rent', price: 1200, sqm: 80, bathrooms: 1, smoke_exhaust: false, terrace: false, license: null, desc_es: 'Oficina de 80m² totalmente amueblada. Ideal para start-ups y profesionales. 3 despachos.', desc_en: 'Fully furnished 80m² office. Ideal for start-ups and professionals. 3 offices.', images: [], featured: false, status: 'published', createdBy: 'admin', createdAt: '2026-05-05' },
  { id: 4, title_es: 'Local en Torremolinos', title_en: 'Premises in Torremolinos', town: 'Torremolinos', type: 'rent', price: 950, sqm: 60, bathrooms: 1, smoke_exhaust: false, terrace: false, license: null, desc_es: 'Local de 60m² en zona turística. Perfecto para tienda de souvenirs o restauración.', desc_en: '60m² premises in tourist area. Perfect for souvenir shop or restaurant.', images: [], featured: true, status: 'published', createdBy: 'agente2', createdAt: '2026-04-20' },
  { id: 5, title_es: 'Pub en Benalmádena Costa', title_en: 'Pub in Benalmádena Costa', town: 'Benalmádena', type: 'transfer', price: 45000, sqm: 100, bathrooms: 2, smoke_exhaust: false, terrace: false, license: 'Activa', desc_es: 'Pub con licencia y clientela fija. Terreno de 100m². Oportunidad única.', desc_en: 'Pub with license and regular clientele. 100m² venue. Unique opportunity.', images: [], featured: false, status: 'draft', createdBy: 'agente1', createdAt: '2026-04-15' },
  { id: 6, title_es: 'Nave industrial en Antequera', title_en: 'Industrial warehouse in Antequera', town: 'Antequera', type: 'sale', price: 380000, sqm: 500, bathrooms: 2, smoke_exhaust: false, terrace: false, license: null, desc_es: 'Nave de 500m² en polígono industrial. Muelles de carga, oficinas y patio.', desc_en: '500m² warehouse in industrial estate. Loading docks, offices and yard.', images: [], featured: false, status: 'published', createdBy: 'admin', createdAt: '2026-04-10' },
  { id: 7, title_es: 'Obrador con Take Away en Avda. Europa', title_en: 'Bakery Workshop with Take Away on Av. Europa', town: 'Málaga', type: 'transfer', price: 20000, sqm: 230, bathrooms: 2, smoke_exhaust: true, terrace: false, license: 'Activa', desc_es: 'Oportunidad excepcional para emprendedores del sector alimentación. Obrador de 230m² totalmente equipado en tres plantas con zona de venta, producción y almacenamiento. Alta densidad residencial y comercial. Alquiler 1.500€.', desc_en: 'Exceptional opportunity for food sector entrepreneurs. 230m² fully equipped workshop on three floors with sales area, production and storage. High residential and commercial density. Rent €1,500.', images: [], featured: true, status: 'published', createdBy: 'admin', createdAt: '2026-06-08' }
];

async function initStoreData(store) {
  const raw = await store.get('data', { type: 'text' });
  if (raw) return JSON.parse(raw);
  const data = { properties: JSON.parse(JSON.stringify(DEFAULT_PROPERTIES)), users: [], leads: [], siteContent: {} };
  await store.setJSON('data', data);
  return data;
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getPropertyUrl(p) {
  return '/propiedad/' + slugify(p.title_es || p.title_en) + '-' + p.id;
}

function getTypeLabel(type, lang) {
  const map = lang === 'en'
    ? { sale: 'Sale', rent: 'Rent', transfer: 'Transfer' }
    : { sale: 'Compra', rent: 'Alquiler', transfer: 'Traspaso' };
  return map[type] || type;
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price);
}

const TOWN_INFO = {
  'Málaga': { es: 'Capital de la Costa del Sol, Málaga ofrece una vibrante vida comercial con alto tránsito peatonal en su centro histórico. Zonas como La Malagueta, El Palo y Teatinos concentran gran actividad de locales y negocios.', en: 'Capital of the Costa del Sol, Málaga offers a vibrant commercial life with high foot traffic in its historic center. Areas like La Malagueta, El Palo and Teatinos concentrate great business activity.' },
  'Marbella': { es: 'Marbella es un referente del lujo en la Costa del Sol, con una intensa actividad comercial durante todo el año. La Milla de Oro y Puerto Banús son las zonas más cotizadas.', en: 'Marbella is a luxury benchmark on the Costa del Sol, with intense commercial activity throughout the year. The Golden Mile and Puerto Banús are the most sought-after areas.' },
  'Fuengirola': { es: 'Fuengirola combina turismo y vida local, con gran demanda de locales comerciales en zonas playeras y en el centro. Perfecto para hostelería y comercio minorista.', en: 'Fuengirola combines tourism and local life, with high demand for commercial premises in beach areas and the center. Perfect for hospitality and retail.' },
  'Torremolinos': { es: 'Torremolinos es un destino turístico consolidado con alta rotación de locales comerciales durante todo el año. Especialmente atractivo para restauración y ocio nocturno.', en: 'Torremolinos is a consolidated tourist destination with high turnover of commercial premises throughout the year. Especially attractive for restaurants and nightlife.' },
  'Benalmádena': { es: 'Benalmádena ofrece un mercado diverso con locales en zona costera y pueblo. Ideal para hostelería, servicios y comercio, con gran afluencia turística.', en: 'Benalmádena offers a diverse market with premises in coastal areas and the village. Ideal for hospitality, services and commerce, with high tourist influx.' },
  'Antequera': { es: 'Antequera es el centro logístico de la provincia de Málaga, perfecto para naves industriales y locales comerciales. Cuenta con importantes polígonos industriales.', en: 'Antequera is the logistics center of the province of Málaga, perfect for industrial warehouses and commercial premises. It has major industrial estates.' },
  'Nerja': { es: 'Nerja atrae turismo durante todo el año, con oportunidades en hostelería y comercio local. Su casco histórico y playas son los focos principales.', en: 'Nerja attracts tourism throughout the year, with opportunities in hospitality and local commerce. Its historic center and beaches are the main focuses.' },
  'Estepona': { es: 'Estepona ha experimentado un gran crecimiento, con su casco antiguo peatonal como foco comercial. Muy demandada para restauración y comercio.', en: 'Estepona has experienced great growth, with its pedestrian old town as a commercial hub. Highly demanded for restaurants and commerce.' },
  'Mijas': { es: 'Mijas ofrece locales tanto en costa como en pueblo, con atractivo turístico durante todo el año. Ideal para hostelería y servicios turísticos.', en: 'Mijas offers premises both on the coast and in the village, with tourist appeal throughout the year. Ideal for hospitality and tourist services.' },
  'Rincón de la Victoria': { es: 'Rincón de la Victoria es una zona residencial en crecimiento con alta demanda de servicios locales y comercio de proximidad.', en: 'Rincón de la Victoria is a growing residential area with high demand for local services and neighborhood commerce.' }
};

function getTownInfo(town, lang) {
  const info = TOWN_INFO[town];
  if (lang === 'en' && info) return info.en || info.es;
  if (info) return info.es;
  return lang === 'en'
    ? town + ' is a municipality in the province of Málaga with excellent business opportunities. Investing here is a smart decision for your business.'
    : town + ' es un municipio de la provincia de Málaga con excelentes oportunidades comerciales. Invertir aquí es una decisión inteligente para tu negocio.';
}

function getCityPageUrl(town) {
  if (town === 'Marbella') return '/traspasos-marbella';
  const slug = town.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s]+/g, '-');
  return '/locales-' + slug;
}

function getSimilarHtml(props, currentId, town, type, lang) {
  const similar = props.filter(p => p.id !== currentId && (p.town === town || p.type === type)).slice(0, 3);
  if (!similar.length) return '';
  return similar.map(p => {
    const title = lang === 'en' ? (p.title_en || p.title_es) : (p.title_es || p.title_en);
    const cover = p.images && p.images.length ? p.images[0].data : null;
    const imgStyle = cover ? '' : ' style="background:linear-gradient(135deg,' + (p.type === 'sale' ? '#2E86AB' : p.type === 'rent' ? '#36B37E' : '#e67e22') + ',#1a2a3a)"';
    const imgContent = cover ? '<img src="' + cover + '" style="width:100%;height:100%;object-fit:cover" alt="' + title + '" onerror="this.style.display=\'none\';this.parentNode.style.background=\'linear-gradient(135deg,' + (p.type === 'sale' ? '#2E86AB' : p.type === 'rent' ? '#36B37E' : '#e67e22') + ',#1a2a3a)\';this.parentNode.innerHTML=\'\x3cspan style=\'font-size:2rem\'\x3e🏪\x3c/span\x3e\'">' : '<span style="font-size:2rem">🏪</span>';
    return '<a href="' + getPropertyUrl(p) + '" class="property-card-link">' +
      '<div class="property-card">' +
      '<div class="property-img"' + imgStyle + '>' + imgContent +
      '<span class="tag tag-' + p.type + '">' + getTypeLabel(p.type) + '</span>' +
      '</div>' +
      '<div class="property-body">' +
      '<div class="property-town">📍 ' + p.town + '</div>' +
      '<div class="property-title">' + title + '</div>' +
      '<div class="property-price">' + formatPrice(p.price) + (p.type === 'rent' ? '<span style="font-size:0.7rem;font-weight:400;color:var(--text-light)">/mes</span>' : '') + '</div>' +
      '</div></div></a>';
  }).join('');
}

const SPEC_CONFIG = [
  { key: 'sqm', icon: '📐', labelKey: 'spec_sqm', format: (v) => v + ' m²' },
  { key: 'bathrooms', icon: '🚿', labelKey: 'spec_bathrooms', format: (v) => v },
  { key: 'smoke_exhaust', icon: '💨', labelKey: 'spec_smoke_exhaust', format: () => '✓' },
  { key: 'terrace', icon: '🌿', labelKey: 'spec_terrace', format: () => '✓' },
  { key: 'license', icon: '📋', labelKey: 'spec_license', format: (v) => v }
];

function getSpecsHtml(p) {
  const chips = SPEC_CONFIG.filter(s => p[s.key] != null && p[s.key] !== false)
    .map(s => '<div class="spec-chip">' +
      '<span class="spec-chip-icon">' + s.icon + '</span>' +
      '<span class="spec-chip-value">' + s.format(p[s.key]) + '</span>' +
      '<span class="spec-chip-label" data-i18n="' + s.labelKey + '">' + s.labelKey + '</span>' +
    '</div>');
  if (!chips.length) return '';
  return '<div class="specs-row">' + chips.join('') + '</div>';
}

export default async (req) => {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const lang = pathParts[0] === 'en' ? 'en' : 'es';
  const slugWithId = pathParts[pathParts.length - 1];
  const id = parseInt(slugWithId.split('-').pop());
  const notFoundMsg = lang === 'en' ? 'Property not found' : 'Propiedad no encontrada';

  if (!id) {
    return new Response(notFoundMsg, { status: 404, headers: { 'Content-Type': 'text/html' } });
  }

  const store = getStore('crm');
  const data = await initStoreData(store);
  const props = (data && data.properties) || [];

  const p = props.find(x => x.id === id);
  if (!p || p.status !== 'published') {
    return new Response(notFoundMsg, { status: 404, headers: { 'Content-Type': 'text/html' } });
  }

  const title = lang === 'en' ? (p.title_en || p.title_es) : (p.title_es || p.title_en);
  const desc = lang === 'en' ? (p.desc_en || p.desc_es || '') : (p.desc_es || p.desc_en || '');
  const typeLabel = getTypeLabel(p.type, lang);
  const propUrl = getPropertyUrl(p);
  const urlPrefix = lang === 'en' ? '/en' : '';
  const canonicalUrl = 'https://centraldetraspasos.com' + urlPrefix + propUrl;
  const imgUrl = p.images && p.images.length ? p.images[0].data : 'https://centraldetraspasos.com/img/og-image.jpg';
  const noImagesMsg = lang === 'en' ? 'No images available' : 'No hay imágenes disponibles';
  const ogLocale = lang === 'en' ? 'en_GB' : 'es_ES';

  const cityPageUrl = getCityPageUrl(p.town);
  const breadcrumbLabel2 = lang === 'en'
    ? (p.town === 'Málaga' ? 'Transfers in Málaga' : 'Premises and transfers in ' + p.town)
    : (p.town === 'Málaga' ? 'Traspasos en Málaga' : 'Locales y traspasos en ' + p.town);
  const breadcrumbLabel1 = lang === 'en' ? 'Home' : 'Inicio';
  const ldExtra = {};
  if (p.sqm) ldExtra.floorSize = { '@type': 'QuantitativeValue', value: p.sqm, unitCode: 'MTK' };
  if (p.bathrooms) ldExtra.numberOfBathroomsTotalAndPartial = p.bathrooms;
  const ldJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: desc,
    url: canonicalUrl,
    image: imgUrl,
    datePosted: p.createdAt,
    ...ldExtra,
    seller: { '@type': 'RealEstateAgent', name: 'CENTRAL DE TRASPASOS', url: 'https://centraldetraspasos.com' },
    offers: { '@type': 'Offer', price: p.price, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' }
  });
  const breadcrumbJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: breadcrumbLabel1, item: 'https://centraldetraspasos.com/' + (lang === 'en' ? 'en' : '') },
      { '@type': 'ListItem', position: 2, name: breadcrumbLabel2, item: 'https://centraldetraspasos.com' + cityPageUrl },
      { '@type': 'ListItem', position: 3, name: title }
    ]
  });

  const imagesHtml = p.images && p.images.length
    ? p.images.map((img, i) =>
      '<div class="carousel-slide' + (i === 0 ? ' active' : '') + '">' +
        '<img src="' + img.data + '" alt="' + title + ' - ' + (lang === 'en' ? 'Image' : 'Imagen') + ' ' + (i + 1) + '">' +
      '</div>'
    ).join('')
    : '<p style="color:var(--text-light);text-align:center;padding:40px">' + noImagesMsg + '</p>';

  const dotsHtml = p.images && p.images.length > 1
    ? p.images.map((_, i) => '<span class="carousel-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '"></span>').join('')
    : '';

  const townInfo = getTownInfo(p.town, lang);
  const similarHtml = getSimilarHtml(props, p.id, p.town, p.type, lang);
  const rentLabel = lang === 'en' ? '/month' : '/mes';
  const prevLabel = lang === 'en' ? 'Previous' : 'Anterior';
  const nextLabel = lang === 'en' ? 'Next' : 'Siguiente';
  const typeLinkLabel = lang === 'en'
    ? 'View all ' + (p.type === 'transfer' ? 'transfers' : p.type === 'sale' ? 'premises for sale' : 'rentals') + ' in '
    : 'Ver todos los ' + (p.type === 'transfer' ? 'traspasos' : p.type === 'sale' ? 'locales en venta' : 'alquileres') + ' en ';

  const esUrl = 'https://centraldetraspasos.com' + propUrl;
  const enUrl = 'https://centraldetraspasos.com/en' + propUrl;

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} - CENTRAL DE TRASPASOS</title>
<meta name="description" content="${desc.replace(/"/g, '&quot;')}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CENTRAL DE TRASPASOS">
<meta property="og:locale" content="${ogLocale}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:title" content="${title} - CENTRAL DE TRASPASOS">
<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}">
<meta property="og:image" content="${imgUrl}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${canonicalUrl}">
<meta name="twitter:title" content="${title} - CENTRAL DE TRASPASOS">
<meta name="twitter:description" content="${desc.replace(/"/g, '&quot;')}">
<meta name="twitter:image" content="${imgUrl}">
<link rel="canonical" href="${canonicalUrl}">
<link rel="alternate" href="${esUrl}" hreflang="es">
<link rel="alternate" href="${enUrl}" hreflang="en">
<link rel="alternate" href="${lang === 'en' ? enUrl : esUrl}" hreflang="x-default">
<link rel="icon" type="image/svg+xml" href="/img/favicon.svg">
<link rel="apple-touch-icon" href="/img/favicon.svg">
<link rel="stylesheet" href="/css/style.css">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<script type="application/ld+json">${ldJson}</script>
<script type="application/ld+json">${breadcrumbJson}</script>
</head>
<body>

<header class="header">
  <div class="header-inner">
    <div class="logo" id="logoHeader">CENTRAL DE TRASPASOS</div>
    <button class="hamburger" id="menuToggle" aria-label="Menu">☰</button>
    <nav class="nav" id="mainNav">
      <a href="/index.html" data-i18n="nav_home">Inicio</a>
      <a href="/propiedades.html" data-i18n="nav_properties">Propiedades</a>
      <a href="/captacion.html" data-i18n="nav_capture">Vende tu propiedad</a>
      <a href="/index.html#services" data-i18n="nav_services">Servicios</a>
      <a href="/index.html#contact" data-i18n="nav_contact">Contacto</a>
      <a href="/blog.html" data-i18n="nav_blog">Blog</a>
      <a href="/crm/login.html" data-i18n="nav_crm">CRM</a>
      <div class="lang-switch">
        <button class="lang-btn" data-lang="es" onclick="window.location.href='${propUrl}'"><img src="/img/flag-es.svg" class="flag-icon" alt=""> ES</button>
        <button class="lang-btn" data-lang="en" onclick="window.location.href='/en${propUrl}'"><img src="/img/flag-gb.svg" class="flag-icon" alt=""> EN</button>
      </div>
    </nav>
  </div>
</header>

<section class="detail-hero" id="detailHero">
  <span class="detail-type-badge">${typeLabel}</span>
  <h1>${title}</h1>
  <div class="detail-price">${formatPrice(p.price)}${p.type === 'rent' ? '<span style="font-size:0.9rem;font-weight:400;color:var(--text-light)">' + rentLabel + '</span>' : ''}</div>
  <div class="detail-location">📍 <span>${p.town}</span></div>
</section>

<section class="detail-content">
  <div class="container">
    <div style="margin-bottom:24px">
      <a href="/propiedades.html" class="back-link" data-i18n="detail_back">← Volver a propiedades</a>
    </div>

    <div class="carousel" id="detailGallery">
      <div class="carousel-viewport">
        <div class="carousel-slides" id="carouselSlides">
          ${imagesHtml}
        </div>
        ${p.images && p.images.length > 1 ? '<button class="carousel-btn carousel-prev" id="carouselPrev" aria-label="' + prevLabel + '">❮</button><button class="carousel-btn carousel-next" id="carouselNext" aria-label="' + nextLabel + '">❯</button>' : ''}
      </div>
      <div class="carousel-dots" id="carouselDots">${dotsHtml}</div>
    </div>

    <div class="detail-layout">
      <div class="detail-description">
        <h2 data-i18n="detail_description">Descripción</h2>
        <p>${desc}</p>
        ${getSpecsHtml(p)}
        <div class="detail-location-box" style="margin-top:32px">
          <h3 data-i18n="detail_location">Ubicación</h3>
          <p>${townInfo}</p>
          <p style="margin-top:8px"><a href="${cityPageUrl}" style="color:var(--primary);text-decoration:underline;font-size:0.9rem">${typeLinkLabel}${p.town} →</a></p>
        </div>
      </div>
      <div class="detail-sidebar">
        <div class="detail-contact-card">
          <h3 data-i18n="detail_contact">Contacta con nosotros</h3>
          <p>📞 +34 645 412 519</p>
          <p>✉️ info@centraldetraspasos.com</p>
          <hr style="border:none;border-top:1px solid #eef1f4;margin:16px 0">
          <form id="detailContactForm" onsubmit="submitDetailContact(event)">
            <div class="form-group">
              <input type="text" id="detailContactName" placeholder=" " required data-i18n-placeholder="detail_contact_name">
            </div>
            <div class="form-group">
              <input type="email" id="detailContactEmail" placeholder=" " required data-i18n-placeholder="detail_contact_email">
            </div>
            <div class="form-group">
              <input type="tel" id="detailContactPhone" placeholder=" " data-i18n-placeholder="detail_contact_phone">
            </div>
            <button type="submit" class="btn btn-secondary" data-i18n="detail_contact_btn">Solicitar información</button>
          </form>
          <p id="detailContactSuccess" style="display:none;color:var(--secondary);font-weight:600;margin-top:12px" data-i18n="detail_contact_success">Mensaje enviado correctamente.</p>
        </div>
        <a href="https://wa.me/34645412519?text=Hola%20CENTRAL%20DE%20TRASPASOS%2C%20me%20interesa%20${encodeURIComponent(title)}" class="btn" style="text-align:center;background:#25d366;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
      </div>
    </div>
  </div>
</section>

${similarHtml ? `<section class="section" id="similarProperties" style="background:var(--light)">
  <div class="container">
    <h2 class="section-title"><span data-i18n="detail_similar">Propiedades similares</span></h2>
    <div class="properties-grid">${similarHtml}</div>
  </div>
</section>` : ''}

<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <h4 class="logo">CENTRAL DE TRASPASOS</h4>
        <p data-i18n="footer_about">Inmobiliaria líder en la Costa del Sol especializada en locales y negocios comerciales.</p>
      </div>
      <div>
        <h4 data-i18n="footer_quick">Enlaces rápidos</h4>
        <a href="/index.html" data-i18n="nav_home">Inicio</a><br>
        <a href="/propiedades.html" data-i18n="nav_properties">Propiedades</a><br>
        <a href="/captacion.html" data-i18n="nav_capture">Vende tu propiedad</a><br>
        <a href="/index.html#services" data-i18n="nav_services">Servicios</a><br>
        <a href="/index.html#contact" data-i18n="nav_contact">Contacto</a><br>
        <a href="/aviso-legal.html">Aviso Legal</a>
      </div>
      <div>
        <h4 data-i18n="footer_contact_title">Contacto</h4>
        <p id="footerAddress" data-i18n="footer_contact_addr">📍 Málaga, Costa del Sol</p>
        <p id="footerPhone" data-i18n="footer_contact_phone">📞 +34 645 412 519</p>
        <p id="footerEmail" data-i18n="footer_contact_email">✉️ info@centraldetraspasos.com</p>
      </div>
      <div>
        <h4 data-i18n="footer_follow">Síguenos</h4>
        <div class="social-icons">
          <a href="https://www.facebook.com/profile.php?id=61590373630493" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
          <a href="https://www.instagram.com/centraldetraspasos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
          <a href="https://www.tiktok.com/@centraldetraspasos" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">&copy; 2026 <span>CENTRAL DE TRASPASOS</span><span data-i18n="footer_copy">. Todos los derechos reservados.</span> &nbsp;|&nbsp; <span>📞 +34 645 412 519</span> &nbsp;|&nbsp; <span>✉️ info@centraldetraspasos.com</span></div>
  </div>
</footer>

<script src="/js/translations.js"></script>
<script src="/js/data.js"></script>
<script src="/js/cookie-banner.js"></script>
<script>
var PROPERTY_DATA = ${JSON.stringify({ id: p.id, title_es: p.title_es, title_en: p.title_en })};
var PROPERTY_ID = ${p.id};
var IMAGES_COUNT = ${(p.images || []).length};

function initGallery() {
  var slides = document.getElementById('carouselSlides');
  var dots = document.getElementById('carouselDots');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var viewport = document.querySelector('.carousel-viewport');
  if (IMAGES_COUNT <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }
  var current = 0;
  var slideEls = slides ? slides.querySelectorAll('.carousel-slide') : [];
  var dotEls = dots ? dots.querySelectorAll('.carousel-dot') : [];
  function goTo(index) {
    if (index < 0) index = IMAGES_COUNT - 1;
    if (index >= IMAGES_COUNT) index = 0;
    current = index;
    slideEls.forEach(function(s, i) { s.classList.toggle('active', i === current); });
    dotEls.forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }
  if (prevBtn) prevBtn.onclick = function() { goTo(current - 1); };
  if (nextBtn) nextBtn.onclick = function() { goTo(current + 1); };
  if (dots) dots.addEventListener('click', function(e) {
    var dot = e.target.closest('.carousel-dot');
    if (dot) goTo(parseInt(dot.dataset.index));
  });
  if (viewport) {
    viewport.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });
    viewport.setAttribute('tabindex', '0');
  }
}

function submitDetailContact(e) {
  e.preventDefault();
  var name = document.getElementById('detailContactName').value.trim();
  var email = document.getElementById('detailContactEmail').value.trim();
  var phone = document.getElementById('detailContactPhone').value.trim();
  if (!name || !email) return;
  addLead({ name: name, email: email, phone: phone, propertyId: PROPERTY_ID, propertyTitle: PROPERTY_DATA['title_' + currentLang] || PROPERTY_DATA.title_es, message: 'Solicitud de informaci\u00f3n desde ficha de propiedad' });
  sendEmailNotification({ name: name, email: email, phone: phone, subject: 'Solicitud de informaci\u00f3n', message: 'Desde ficha de propiedad' });
  document.getElementById('detailContactSuccess').style.display = 'block';
  e.target.reset();
}

document.getElementById('menuToggle').addEventListener('click', function() {
  document.getElementById('mainNav').classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', function() {
  loadHeaderLogo();
  initGallery();
});
</script>
<a href="https://wa.me/34645412519" target="_blank" rel="noopener" class="whatsapp-float" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
};
