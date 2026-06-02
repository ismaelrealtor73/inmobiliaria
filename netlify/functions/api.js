import { getStore } from '@netlify/blobs';

const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
  { username: 'agente1', password: 'agente123', role: 'agent', name: 'María García' },
  { username: 'agente2', password: 'agente123', role: 'agent', name: 'Carlos López' }
];

const DEFAULT_PROPERTIES = [
  { id: 1, title_es: 'Local comercial en centro de Málaga', title_en: 'Commercial premises in Málaga center', town: 'Málaga', type: 'sale', price: 250000, desc_es: 'Amplio local de 120m² en pleno centro de Málaga. Excelente ubicación, alto tránsito peatonal.', desc_en: 'Spacious 120m² premises in the heart of Málaga. Excellent location, high foot traffic.', images: [], featured: true, status: 'published', createdBy: 'admin', createdAt: '2026-05-15' },
  { id: 2, title_es: 'Restaurante en Marbella', title_en: 'Restaurant in Marbella', town: 'Marbella', type: 'transfer', price: 85000, desc_es: 'Restaurante en funcionamiento con terraza. Capacidad para 60 comensales. Traspaso por jubilación.', desc_en: 'Operating restaurant with terrace. Capacity for 60 diners. Transfer due to retirement.', images: [], featured: true, status: 'published', createdBy: 'agente1', createdAt: '2026-05-10' },
  { id: 3, title_es: 'Oficina en Fuengirola', title_en: 'Office in Fuengirola', town: 'Fuengirola', type: 'rent', price: 1200, desc_es: 'Oficina de 80m² totalmente amueblada. Ideal para start-ups y profesionales. 3 despachos.', desc_en: 'Fully furnished 80m² office. Ideal for start-ups and professionals. 3 offices.', images: [], featured: false, status: 'published', createdBy: 'admin', createdAt: '2026-05-05' },
  { id: 4, title_es: 'Local en Torremolinos', title_en: 'Premises in Torremolinos', town: 'Torremolinos', type: 'rent', price: 950, desc_es: 'Local de 60m² en zona turística. Perfecto para tienda de souvenirs o restauración.', desc_en: '60m² premises in tourist area. Perfect for souvenir shop or restaurant.', images: [], featured: true, status: 'published', createdBy: 'agente2', createdAt: '2026-04-20' },
  { id: 5, title_es: 'Pub en Benalmádena Costa', title_en: 'Pub in Benalmádena Costa', town: 'Benalmádena', type: 'transfer', price: 45000, desc_es: 'Pub con licencia y clientela fija. Terreno de 100m². Oportunidad única.', desc_en: 'Pub with license and regular clientele. 100m² venue. Unique opportunity.', images: [], featured: false, status: 'draft', createdBy: 'agente1', createdAt: '2026-04-15' },
  { id: 6, title_es: 'Nave industrial en Antequera', title_en: 'Industrial warehouse in Antequera', town: 'Antequera', type: 'sale', price: 380000, desc_es: 'Nave de 500m² en polígono industrial. Muelles de carga, oficinas y patio.', desc_en: '500m² warehouse in industrial estate. Loading docks, offices and yard.', images: [], featured: false, status: 'published', createdBy: 'admin', createdAt: '2026-04-10' }
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
  site_images: {}
};

function error(status, message) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { 'Content-Type': 'application/json' } });
}

function json(data) {
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

async function getStoreData(store) {
  const raw = await store.get('data', { type: 'text' });
  return raw ? JSON.parse(raw) : null;
}

async function initStore(store, key, defaults) {
  let data = await getStoreData(store);
  if (!data) {
    data = {};
    await store.setJSON('data', data);
  }
  return data;
}

export default async (req, context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\//, '');
  const method = req.method;

  const store = getStore('crm');

  try {
    if (path === 'login' && method === 'POST') {
      const { username, password } = await req.json();
      const user = USERS.find(u => u.username === username && u.password === password);
      if (!user) return error(401, 'Credenciales inválidas');
      return json({ username: user.username, role: user.role, name: user.name });
    }

    if (path === 'properties' && method === 'GET') {
      const data = await initStore(store, 'properties', DEFAULT_PROPERTIES);
      if (!data.properties) data.properties = DEFAULT_PROPERTIES;
      return json(data.properties);
    }

    if (path === 'properties' && method === 'POST') {
      const data = await initStore(store, 'properties', DEFAULT_PROPERTIES);
      if (!data.properties) data.properties = DEFAULT_PROPERTIES;
      const prop = await req.json();
      prop.id = Date.now();
      prop.createdAt = new Date().toISOString().split('T')[0];
      data.properties.push(prop);
      await store.setJSON('data', data);
      return json(prop);
    }

    if (path.startsWith('properties/') && method === 'PUT') {
      const id = parseInt(path.split('/')[1]);
      const data = await initStore(store, 'properties', DEFAULT_PROPERTIES);
      if (!data.properties) data.properties = DEFAULT_PROPERTIES;
      const idx = data.properties.findIndex(p => p.id === id);
      if (idx === -1) return error(404, 'Propiedad no encontrada');
      const updates = await req.json();
      data.properties[idx] = { ...data.properties[idx], ...updates };
      await store.setJSON('data', data);
      return json(data.properties[idx]);
    }

    if (path.startsWith('properties/') && method === 'DELETE') {
      const id = parseInt(path.split('/')[1]);
      const data = await initStore(store, 'properties', DEFAULT_PROPERTIES);
      if (!data.properties) data.properties = DEFAULT_PROPERTIES;
      data.properties = data.properties.filter(p => p.id !== id);
      await store.setJSON('data', data);
      return json({ success: true });
    }

    if (path === 'leads' && method === 'GET') {
      const data = await initStore(store, 'leads', []);
      if (!data.leads) data.leads = [];
      return json(data.leads);
    }

    if (path === 'leads' && method === 'POST') {
      const data = await initStore(store, 'leads', []);
      if (!data.leads) data.leads = [];
      const lead = await req.json();
      lead.id = Date.now();
      lead.status = 'new';
      lead.createdAt = new Date().toISOString().split('T')[0];
      lead.notes = '';
      data.leads.unshift(lead);
      await store.setJSON('data', data);
      return json(lead);
    }

    if (path.startsWith('leads/') && method === 'DELETE') {
      const id = parseInt(path.split('/')[1]);
      const data = await initStore(store, 'leads', []);
      if (!data.leads) data.leads = [];
      data.leads = data.leads.filter(l => l.id !== id);
      await store.setJSON('data', data);
      return json({ success: true });
    }

    if (path.startsWith('leads/') && method === 'PUT') {
      const id = parseInt(path.split('/')[1]);
      const data = await initStore(store, 'leads', []);
      if (!data.leads) data.leads = [];
      const idx = data.leads.findIndex(l => l.id === id);
      if (idx === -1) return error(404, 'Lead no encontrado');
      const updates = await req.json();
      data.leads[idx] = { ...data.leads[idx], ...updates };
      await store.setJSON('data', data);
      return json(data.leads[idx]);
    }

    if (path === 'site-content' && method === 'GET') {
      const data = await initStore(store, 'site-content', DEFAULT_SITE_CONTENT);
      if (!data.siteContent) data.siteContent = DEFAULT_SITE_CONTENT;
      return json(data.siteContent);
    }

    if (path === 'site-content' && method === 'PUT') {
      const data = await initStore(store, 'site-content', DEFAULT_SITE_CONTENT);
      const updates = await req.json();
      const existing = data.siteContent || DEFAULT_SITE_CONTENT;
      data.siteContent = { ...existing, ...updates };
      await store.setJSON('data', data);
      return json(data.siteContent);
    }

    if (path.startsWith('images/') && method === 'POST') {
      const key = path.split('/')[1];
      const data = await initStore(store, 'site-content', DEFAULT_SITE_CONTENT);
      if (!data.siteContent) data.siteContent = { ...DEFAULT_SITE_CONTENT };
      if (!data.siteContent.site_images) data.siteContent.site_images = {};
      const { imageData } = await req.json();
      data.siteContent.site_images[key] = imageData;
      await store.setJSON('data', data);
      return json({ success: true });
    }

    if (path.startsWith('images/') && method === 'DELETE') {
      const key = path.split('/')[1];
      const data = await initStore(store, 'site-content', DEFAULT_SITE_CONTENT);
      if (data.siteContent && data.siteContent.site_images) {
        delete data.siteContent.site_images[key];
        await store.setJSON('data', data);
      }
      return json({ success: true });
    }

    return error(404, 'Ruta no encontrada');
  } catch (err) {
    console.error('API Error:', err);
    return error(500, err.message);
  }
};
