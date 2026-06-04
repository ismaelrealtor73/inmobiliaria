const TOWNS = [
  'Alameda','Alcaucín','Alfarnate','Alfarnatejo','Algarrobo','Algatocín',
  'Alhaurín de la Torre','Alhaurín el Grande','Almáchar','Almargen','Almogía',
  'Álora','Alozaina','Alpandeire','Antequera','Árchez','Archidona','Ardales',
  'Arenas','Arriate','Atajate','Benadalid','Benahavís','Benalauría',
  'Benalmádena','Benamargosa','Benamocarra','Benaoján','Benarrabá','El Borge',
  'El Burgo','Campillos','Canillas de Aceituno','Canillas de Albaida',
  'Cañete la Real','Carratraca','Cartajima','Cártama','Casabermeja',
  'Casarabonela','Casares','Coín','Colmenar','Comares','Cómpeta',
  'Cortes de la Frontera','Cuevas Bajas','Cuevas de San Marcos',
  'Cuevas del Becerro','Cútar','Estepona','Faraján','Frigiliana',
  'Fuengirola','Fuente de Piedra','Gaucín','Genalguacil','Guaro',
  'Humilladero','Igualeja','Istán','Iznate','Jimera de Líbar','Jubrique',
  'Júzcar','Macharaviaya','Málaga','Manilva','Marbella','Mijas',
  'Moclinejo','Mollina','Monda','Montejaque','Nerja','Ojén','Parauta',
  'Periana','Pizarra','Pujerra','Rincón de la Victoria','Riogordo','Ronda',
  'Salares','Sayalonga','Sedella','Sierra de Yeguas','Teba','Tolox',
  'Torremolinos','Torrox','Totalán','Valle de Abdalajís','Vélez-Málaga',
  'Villanueva de Algaidas','Villanueva de la Concepción','Villanueva de Tapia',
  'Villanueva del Rosario','Villanueva del Trabuco','Viñuela','Yunquera'
].sort();

const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
  { username: 'agente1', password: 'agente123', role: 'agent', name: 'María García' },
  { username: 'agente2', password: 'agente123', role: 'agent', name: 'Carlos López' }
];

const PROPERTY_TYPES = ['sale', 'rent', 'transfer'];

const DEFAULT_PROPERTIES = [
  { id: 1, title_es: 'Local comercial en centro de Málaga', title_en: 'Commercial premises in Málaga center',
    town: 'Málaga', type: 'sale', price: 250000,
    desc_es: 'Amplio local de 120m² en pleno centro de Málaga. Excelente ubicación, alto tránsito peatonal.',
    desc_en: 'Spacious 120m² premises in the heart of Málaga. Excellent location, high foot traffic.',
    images: [], featured: true, status: 'published', createdBy: 'admin', createdAt: '2026-05-15' },
  { id: 2, title_es: 'Restaurante en Marbella', title_en: 'Restaurant in Marbella',
    town: 'Marbella', type: 'transfer', price: 85000,
    desc_es: 'Restaurante en funcionamiento con terraza. Capacidad para 60 comensales. Traspaso por jubilación.',
    desc_en: 'Operating restaurant with terrace. Capacity for 60 diners. Transfer due to retirement.',
    images: [], featured: true, status: 'published', createdBy: 'agente1', createdAt: '2026-05-10' },
  { id: 3, title_es: 'Oficina en Fuengirola', title_en: 'Office in Fuengirola',
    town: 'Fuengirola', type: 'rent', price: 1200,
    desc_es: 'Oficina de 80m² totalmente amueblada. Ideal para start-ups y profesionales. 3 despachos.',
    desc_en: 'Fully furnished 80m² office. Ideal for start-ups and professionals. 3 offices.',
    images: [], featured: false, status: 'published', createdBy: 'admin', createdAt: '2026-05-05' },
  { id: 4, title_es: 'Local en Torremolinos', title_en: 'Premises in Torremolinos',
    town: 'Torremolinos', type: 'rent', price: 950,
    desc_es: 'Local de 60m² en zona turística. Perfecto para tienda de souvenirs o restauración.',
    desc_en: '60m² premises in tourist area. Perfect for souvenir shop or restaurant.',
    images: [], featured: true, status: 'published', createdBy: 'agente2', createdAt: '2026-04-20' },
  { id: 5, title_es: 'Pub en Benalmádena Costa', title_en: 'Pub in Benalmádena Costa',
    town: 'Benalmádena', type: 'transfer', price: 45000,
    desc_es: 'Pub con licencia y clientela fija. Terreno de 100m². Oportunidad única.',
    desc_en: 'Pub with license and regular clientele. 100m² venue. Unique opportunity.',
    images: [], featured: false, status: 'draft', createdBy: 'agente1', createdAt: '2026-04-15' },
  { id: 6, title_es: 'Nave industrial en Antequera', title_en: 'Industrial warehouse in Antequera',
    town: 'Antequera', type: 'sale', price: 380000,
    desc_es: 'Nave de 500m² en polígono industrial. Muelles de carga, oficinas y patio.',
    desc_en: '500m² warehouse in industrial estate. Loading docks, offices and yard.',
    images: [], featured: false, status: 'published', createdBy: 'admin', createdAt: '2026-04-10' }
];

const DEFAULT_SITE_CONTENT = {
  hero_title_es: 'Tu negocio, nuestro compromiso',
  hero_title_en: 'Your business, our commitment',
  hero_subtitle_es: 'Especialistas en compraventa, alquiler y traspaso de locales y negocios en Málaga y la Costa del Sol',
  hero_subtitle_en: 'Specialists in buying, selling, renting and transferring commercial properties in Málaga and the Costa del Sol',
  about_es: 'CENTRAL DE TRASPASOS es la inmobiliaria de referencia en la Costa del Sol para la compraventa, alquiler y traspaso de locales comerciales y negocios. Con más de 15 años de experiencia, nuestro equipo de profesionales le ofrece el asesoramiento personalizado que necesita.',
  about_en: 'CENTRAL DE TRASPASOS is the leading real estate agency on the Costa del Sol for buying, selling, renting and transferring commercial premises and businesses. With over 15 years of experience, our team of professionals offers you the personalized advice you need.',
  logo_text: 'CENTRAL DE TRASPASOS',
  contact_phone: '+34 645 412 519',
  contact_email: 'info@centraldetraspasos.com',
  contact_address_es: 'Málaga, Costa del Sol',
  contact_address_en: 'Málaga, Costa del Sol',
  site_images: {}  // { 'hero': 'base64...', 'logo': 'base64...', 'about': 'base64...' }
};

const API_BASE = '/api';

const _cache = { properties: null, leads: null, siteContent: null };

function useApi() { return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'; }

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}/${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error de conexión');
  }
  return res.json();
}

/* ========== AUTH ========== */
function getCurrentUser() {
  const data = localStorage.getItem('crm_user');
  return data ? JSON.parse(data) : null;
}

async function login(username, password) {
  if (useApi()) {
    try {
      const user = await apiFetch('login', { method: 'POST', body: JSON.stringify({ username, password }) });
      localStorage.setItem('crm_user', JSON.stringify(user));
      return true;
    } catch { return false; }
  }
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem('crm_user', JSON.stringify({ username: user.username, role: user.role, name: user.name }));
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem('crm_user');
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) { window.location.href = 'login.html'; return null; }
  return user;
}

function requireAdmin() {
  const user = requireAuth();
  if (!user || user.role !== 'admin') { window.location.href = 'dashboard.html'; return null; }
  return user;
}

/* ========== PROPERTIES ========== */
async function getProperties() {
  if (useApi()) {
    if (_cache.properties) return _cache.properties;
    try {
      _cache.properties = await apiFetch('properties');
      return _cache.properties;
    } catch { }
  }
  try {
    const data = localStorage.getItem('crm_properties');
    if (data) return JSON.parse(data);
  } catch (e) {
    localStorage.removeItem('crm_properties');
  }
  localStorage.setItem('crm_properties', JSON.stringify(DEFAULT_PROPERTIES));
  return JSON.parse(JSON.stringify(DEFAULT_PROPERTIES));
}

function _invalidateCache() { _cache.properties = null; _cache.leads = null; _cache.siteContent = null; }

async function addProperty(prop) {
  if (useApi()) {
    const created = await apiFetch('properties', { method: 'POST', body: JSON.stringify(prop) });
    _cache.properties = null;
    return created;
  }
  const props = await getProperties();
  prop.id = Date.now();
  prop.createdAt = new Date().toISOString().split('T')[0];
  props.push(prop);
  localStorage.setItem('crm_properties', JSON.stringify(props));
  return prop;
}

async function updateProperty(id, updates) {
  if (useApi()) {
    const updated = await apiFetch(`properties/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    _cache.properties = null;
    return updated;
  }
  const props = await getProperties();
  const idx = props.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Propiedad no encontrada');
  Object.assign(props[idx], updates);
  localStorage.setItem('crm_properties', JSON.stringify(props));
  return props[idx];
}

async function deleteProperty(id) {
  if (useApi()) {
    await apiFetch(`properties/${id}`, { method: 'DELETE' });
    _cache.properties = null;
    return;
  }
  let props = await getProperties();
  props = props.filter(p => p.id !== id);
  localStorage.setItem('crm_properties', JSON.stringify(props));
}

async function getPublishedProperties() {
  const props = await getProperties();
  return props.filter(p => p.status === 'published');
}

/* ========== LEADS ========== */
async function getLeads() {
  if (useApi()) {
    if (_cache.leads) return _cache.leads;
    try {
      _cache.leads = await apiFetch('leads');
      return _cache.leads;
    } catch { }
  }
  const data = localStorage.getItem('crm_leads');
  return data ? JSON.parse(data) : [];
}

async function addLead(lead) {
  if (useApi()) {
    const created = await apiFetch('leads', { method: 'POST', body: JSON.stringify(lead) });
    _cache.leads = null;
    return created;
  }
  const leads = await getLeads();
  lead.id = Date.now();
  lead.status = 'new';
  lead.createdAt = new Date().toISOString().split('T')[0];
  lead.notes = '';
  leads.unshift(lead);
  localStorage.setItem('crm_leads', JSON.stringify(leads));
}

async function updateLead(id, updates) {
  if (useApi()) {
    const updated = await apiFetch(`leads/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    _cache.leads = null;
    return updated;
  }
  const leads = await getLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx === -1) throw new Error('Lead no encontrado');
  Object.assign(leads[idx], updates);
  localStorage.setItem('crm_leads', JSON.stringify(leads));
  return leads[idx];
}

async function deleteLeadAPI(id) {
  if (useApi()) {
    await apiFetch(`leads/${id}`, { method: 'DELETE' });
    _cache.leads = null;
    return;
  }
  let leads = await getLeads();
  leads = leads.filter(l => l.id !== id);
  localStorage.setItem('crm_leads', JSON.stringify(leads));
}

/* ========== SITE CONTENT ========== */
async function getSiteContent() {
  if (useApi()) {
    if (_cache.siteContent) return _cache.siteContent;
    try {
      _cache.siteContent = await apiFetch('site-content');
      return _cache.siteContent;
    } catch { }
  }
  const data = localStorage.getItem('crm_site_content');
  if (data) return JSON.parse(data);
  saveSiteContentLocal(DEFAULT_SITE_CONTENT);
  return { ...DEFAULT_SITE_CONTENT };
}

function saveSiteContentLocal(content) {
  localStorage.setItem('crm_site_content', JSON.stringify(content));
}

async function saveSiteContent(content) {
  if (useApi()) {
    const saved = await apiFetch('site-content', { method: 'PUT', body: JSON.stringify(content) });
    _cache.siteContent = null;
    return saved;
  }
  saveSiteContentLocal(content);
}

async function saveSiteImage(key, imageData) {
  if (useApi()) {
    await apiFetch(`images/${key}`, { method: 'POST', body: JSON.stringify({ imageData }) });
    _cache.siteContent = null;
    return;
  }
  const sc = await getSiteContent();
  if (!sc.site_images) sc.site_images = {};
  sc.site_images[key] = imageData;
  saveSiteContentLocal(sc);
}

async function deleteSiteImage(key) {
  if (useApi()) {
    await apiFetch(`images/${key}`, { method: 'DELETE' });
    _cache.siteContent = null;
    return;
  }
  const sc = await getSiteContent();
  if (sc.site_images) {
    delete sc.site_images[key];
    saveSiteContentLocal(sc);
  }
}

async function getSiteImage(key) {
  if (useApi()) {
    try {
      const res = await apiFetch(`images/${key}`);
      return res.imageData || null;
    } catch { return null; }
  }
  const sc = await getSiteContent();
  return sc.site_images && sc.site_images[key] ? sc.site_images[key] : null;
}

/* ========== IMAGE HELPERS ========== */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ========== FORMATTERS ========== */
function getTypeLabel(type, lang) {
  const map = {
    es: { sale: 'Compra', rent: 'Alquiler', transfer: 'Traspaso' },
    en: { sale: 'Sale', rent: 'Rent', transfer: 'Transfer' }
  };
  return (map[lang || 'es'] && map[lang || 'es'][type]) || type;
}

function getTypeTag(type) {
  const map = { sale: 'tag-sale', rent: 'tag-rent', transfer: 'tag-transfer' };
  return map[type] || 'tag-sale';
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getStatusBadge(status, lang) {
  const labels = {
    es: { published: 'Publicado', draft: 'Borrador' },
    en: { published: 'Published', draft: 'Draft' }
  };
  const cls = status === 'published' ? 'badge-new' : 'badge-contacted';
  const label = (labels[lang || 'es'] && labels[lang || 'es'][status]) || status;
  return `<span class="badge ${cls}">${label}</span>`;
}

async function loadSidebarLogo() {
  const img = document.getElementById('sidebarLogoImg');
  if (!img) return;
  const data = await getSiteImage('logo');
  if (data) {
    img.src = data;
  }
}

async function loadHeaderLogo() {
  const logo = document.getElementById('logoHeader');
  if (!logo || logo.dataset.logoLoaded) return;
  const data = await getSiteImage('logo');
  if (data) {
    logo.innerHTML = '<img src="' + data + '" alt="CENTRAL DE TRASPASOS">';
    logo.dataset.logoLoaded = 'true';
  }
}

async function sendEmailNotification({ name, email, phone, subject, message }) {
  if (!useApi()) return;
  await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'info@centraldetraspasos.com',
      subject: subject || 'Nuevo lead desde web',
      text: `Nombre: ${name}\nEmail: ${email || 'No especificado'}\nTeléfono: ${phone || 'No especificado'}\nMensaje: ${message || ''}`
    })
  }).catch(() => {});
}

