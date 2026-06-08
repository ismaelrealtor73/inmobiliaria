const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin', status: 'active' },
  { username: 'agente1', password: 'agente123', role: 'agent', name: 'María García', status: 'active' },
  { username: 'agente2', password: 'agente123', role: 'agent', name: 'Carlos López', status: 'active' }
];

const DEFAULT_PROPERTIES = [
  { id: 1, title_es: 'Local comercial en centro de Málaga', title_en: 'Commercial premises in Málaga center', town: 'Málaga', type: 'sale', price: 250000, desc_es: 'Amplio local de 120m² en pleno centro de Málaga. Excelente ubicación, alto tránsito peatonal.', desc_en: 'Spacious 120m² premises in the heart of Málaga. Excellent location, high foot traffic.', images: [], featured: true, status: 'published', createdBy: 'admin', createdAt: '2026-05-15' },
  { id: 2, title_es: 'Restaurante en Marbella', title_en: 'Restaurant in Marbella', town: 'Marbella', type: 'transfer', price: 85000, desc_es: 'Restaurante en funcionamiento con terraza. Capacidad para 60 comensales. Traspaso por jubilación.', desc_en: 'Operating restaurant with terrace. Capacity for 60 diners. Transfer due to retirement.', images: [], featured: true, status: 'published', createdBy: 'agente1', createdAt: '2026-05-10' },
  { id: 3, title_es: 'Oficina en Fuengirola', title_en: 'Office in Fuengirola', town: 'Fuengirola', type: 'rent', price: 1200, desc_es: 'Oficina de 80m² totalmente amueblada. Ideal para start-ups y profesionales. 3 despachos.', desc_en: 'Fully furnished 80m² office. Ideal for start-ups and professionals. 3 offices.', images: [], featured: false, status: 'published', createdBy: 'admin', createdAt: '2026-05-05' },
  { id: 4, title_es: 'Local en Torremolinos', title_en: 'Premises in Torremolinos', town: 'Torremolinos', type: 'rent', price: 950, desc_es: 'Local de 60m² en zona turística. Perfecto para tienda de souvenirs o restauración.', desc_en: '60m² premises in tourist area. Perfect for souvenir shop or restaurant.', images: [], featured: true, status: 'published', createdBy: 'agente2', createdAt: '2026-04-20' },
  { id: 5, title_es: 'Pub en Benalmádena Costa', title_en: 'Pub in Benalmádena Costa', town: 'Benalmádena', type: 'transfer', price: 45000, desc_es: 'Pub con licencia y clientela fija. Terreno de 100m². Oportunidad única.', desc_en: 'Pub with license and regular clientele. 100m² venue. Unique opportunity.', images: [], featured: false, status: 'draft', createdBy: 'agente1', createdAt: '2026-04-15' },
  { id: 6, title_es: 'Nave industrial en Antequera', title_en: 'Industrial warehouse in Antequera', town: 'Antequera', type: 'sale', price: 380000, desc_es: 'Nave de 500m² en polígono industrial. Muelles de carga, oficinas y patio.', desc_en: '500m² warehouse in industrial estate. Loading docks, offices and yard.', images: [], featured: false, status: 'published', createdBy: 'admin', createdAt: '2026-04-10' },
  { id: 7, title_es: 'Obrador con Take Away en Avda. Europa', title_en: 'Bakery Workshop with Take Away on Av. Europa', town: 'Málaga', type: 'transfer', price: 20000, desc_es: 'Oportunidad excepcional para emprendedores del sector alimentación. Obrador de 230m² totalmente equipado en tres plantas con zona de venta, producción y almacenamiento. Alta densidad residencial y comercial. Alquiler 1.500€.', desc_en: 'Exceptional opportunity for food sector entrepreneurs. 230m² fully equipped workshop on three floors with sales area, production and storage. High residential and commercial density. Rent €1,500.', images: [], featured: true, status: 'published', createdBy: 'admin', createdAt: '2026-06-08' }
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

let blobsStore = null;
let blobsAvailable = true;

async function initBlobs() {
  if (blobsStore) return blobsStore;
  try {
    const { getStore } = await import('@netlify/blobs');
    blobsStore = getStore('crm');
    return blobsStore;
  } catch (e) {
    console.error('Blobs not available:', e.message);
    blobsAvailable = false;
    return null;
  }
}

function error(status, message) {
  return { statusCode: status, body: JSON.stringify({ error: message }), headers: { 'Content-Type': 'application/json' } };
}

function json(data) {
  return { statusCode: 200, body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } };
}

async function getBlobsData() {
  const store = await initBlobs();
  if (!store) return null;
  try {
    const raw = await store.get('data', { type: 'text' });
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Blobs read error:', e.message);
    return null;
  }
}

async function saveBlobsData(data) {
  const store = await initBlobs();
  if (!store) return false;
  try {
    await store.setJSON('data', data);
    return true;
  } catch (e) {
    console.error('Blobs write error:', e.message);
    return false;
  }
}

let inMemoryData = { users: JSON.parse(JSON.stringify(USERS)), properties: JSON.parse(JSON.stringify(DEFAULT_PROPERTIES)), leads: [], siteContent: JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)) };

async function getData() {
  const blobData = await getBlobsData();
  if (blobData) {
    inMemoryData = { users: blobData.users || USERS, properties: blobData.properties || DEFAULT_PROPERTIES, leads: blobData.leads || [], siteContent: blobData.siteContent || DEFAULT_SITE_CONTENT };
  }
  return inMemoryData;
}

async function saveData(data) {
  const saved = await saveBlobsData(data);
  inMemoryData = data;
  return saved;
}

exports.handler = async (event) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/api\//, '').replace(/^\/api\//, '');
  const method = event.httpMethod;

  try {
    if (path === 'login' && method === 'POST') {
      const { username, password } = JSON.parse(event.body);
      const data = await getData();
      const user = (data.users || []).find(u => u.username === username && u.password === password);
      if (!user) return error(401, 'Credenciales inválidas');
      if (user.status === 'pending') return error(403, 'Usuario pendiente de aprobación por el administrador');
      return json({ username: user.username, role: user.role, name: user.name, status: user.status });
    }

    if (path === 'users' && method === 'GET') {
      const data = await getData();
      return json(data.users || []);
    }

    if (path === 'users' && method === 'POST') {
      const data = await getData();
      if (!data.users) data.users = JSON.parse(JSON.stringify(USERS));
      const newUser = JSON.parse(event.body);
      if (!newUser.username || !newUser.password) return error(400, 'Usuario y contraseña requeridos');
      if (data.users.find(u => u.username === newUser.username)) return error(409, 'El usuario ya existe');
      newUser.role = newUser.role || 'agent';
      newUser.name = newUser.name || newUser.username;
      newUser.status = 'pending';
      data.users.push(newUser);
      await saveData(data);
      return json(newUser);
    }

    if (path.startsWith('users/') && method === 'PUT') {
      const username = path.split('/')[1];
      const data = await getData();
      const idx = (data.users || []).findIndex(u => u.username === username);
      if (idx === -1) return error(404, 'Usuario no encontrado');
      const updates = JSON.parse(event.body);
      data.users[idx] = { ...data.users[idx], ...updates };
      await saveData(data);
      return json(data.users[idx]);
    }

    if (path.startsWith('users/') && method === 'DELETE') {
      const username = path.split('/')[1];
      const data = await getData();
      data.users = (data.users || []).filter(u => u.username !== username);
      await saveData(data);
      return json({ success: true });
    }

    if (path.startsWith('users/') && path.endsWith('/approve') && method === 'PUT') {
      const username = path.split('/')[1];
      const data = await getData();
      const idx = (data.users || []).findIndex(u => u.username === username);
      if (idx === -1) return error(404, 'Usuario no encontrado');
      data.users[idx].status = 'active';
      await saveData(data);
      return json(data.users[idx]);
    }

    if (path.startsWith('users/') && path.endsWith('/reject') && method === 'PUT') {
      const username = path.split('/')[1];
      const data = await getData();
      data.users = (data.users || []).filter(u => u.username !== username);
      await saveData(data);
      return json({ success: true });
    }

    if (path === 'properties' && method === 'GET') {
      const data = await getData();
      return json(data.properties || []);
    }

    if (path === 'properties' && method === 'POST') {
      const data = await getData();
      if (!data.properties) data.properties = JSON.parse(JSON.stringify(DEFAULT_PROPERTIES));
      const prop = JSON.parse(event.body);
      prop.id = Date.now();
      prop.createdAt = new Date().toISOString().split('T')[0];
      data.properties.push(prop);
      await saveData(data);
      return json(prop);
    }

    if (path.startsWith('properties/') && method === 'PUT') {
      const id = parseInt(path.split('/')[1]);
      const data = await getData();
      const idx = (data.properties || []).findIndex(p => p.id === id);
      if (idx === -1) return error(404, 'Propiedad no encontrada');
      const updates = JSON.parse(event.body);
      data.properties[idx] = { ...data.properties[idx], ...updates };
      await saveData(data);
      return json(data.properties[idx]);
    }

    if (path.startsWith('properties/') && method === 'DELETE') {
      const id = parseInt(path.split('/')[1]);
      const data = await getData();
      data.properties = (data.properties || []).filter(p => p.id !== id);
      await saveData(data);
      return json({ success: true });
    }

    if (path === 'leads' && method === 'GET') {
      const data = await getData();
      return json(data.leads || []);
    }

    if (path === 'leads' && method === 'POST') {
      const data = await getData();
      if (!data.leads) data.leads = [];
      const lead = JSON.parse(event.body);
      lead.id = Date.now();
      lead.status = 'new';
      lead.createdAt = new Date().toISOString().split('T')[0];
      lead.notes = '';
      data.leads.unshift(lead);
      await saveData(data);
      return json(lead);
    }

    if (path.startsWith('leads/') && method === 'DELETE') {
      const id = parseInt(path.split('/')[1]);
      const data = await getData();
      data.leads = (data.leads || []).filter(l => l.id !== id);
      await saveData(data);
      return json({ success: true });
    }

    if (path.startsWith('leads/') && method === 'PUT') {
      const id = parseInt(path.split('/')[1]);
      const data = await getData();
      const idx = (data.leads || []).findIndex(l => l.id === id);
      if (idx === -1) return error(404, 'Lead no encontrado');
      const updates = JSON.parse(event.body);
      data.leads[idx] = { ...data.leads[idx], ...updates };
      await saveData(data);
      return json(data.leads[idx]);
    }

    if (path === 'site-content' && method === 'GET') {
      const data = await getData();
      const res = { ...(data.siteContent || DEFAULT_SITE_CONTENT) };
      res.site_images = {};
      return json(res);
    }

    if (path === 'site-content' && method === 'PUT') {
      const data = await getData();
      if (!data.siteContent) data.siteContent = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
      const updates = JSON.parse(event.body);
      data.siteContent = { ...data.siteContent, ...updates };
      await saveData(data);
      return json(data.siteContent);
    }

    if (path.startsWith('images/') && method === 'GET') {
      const key = path.split('/')[1];
      const data = await getData();
      const img = data.siteContent && data.siteContent.site_images && data.siteContent.site_images[key];
      if (!img) return error(404, 'Imagen no encontrada');
      return json({ imageData: img });
    }

    if (path.startsWith('images/') && method === 'POST') {
      const key = path.split('/')[1];
      const data = await getData();
      if (!data.siteContent) data.siteContent = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
      if (!data.siteContent.site_images) data.siteContent.site_images = {};
      const { imageData } = JSON.parse(event.body);
      data.siteContent.site_images[key] = imageData;
      await saveData(data);
      return json({ success: true });
    }

    if (path.startsWith('images/') && method === 'DELETE') {
      const key = path.split('/')[1];
      const data = await getData();
      if (data.siteContent && data.siteContent.site_images) {
        delete data.siteContent.site_images[key];
        await saveData(data);
      }
      return json({ success: true });
    }

    if (path === 'send-email' && method === 'POST') {
      const SMTP_USER = process.env.SMTP_USER || 'ismaelcostahappyhome@gmail.com';
      const SMTP_PASS = process.env.SMTP_PASS || 'ekefzuzhkfumhxcs';
      if (!SMTP_USER || !SMTP_PASS) return error(500, 'Credenciales SMTP no configuradas');
      const { to, subject, text, html } = JSON.parse(event.body);
      if (!to || !subject) return error(400, 'Faltan campos requeridos (to, subject)');
      const { createTransport } = await import('nodemailer');
      const transporter = createTransport({
        host: 'smtp.gmail.com', port: 587, secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      });
      await transporter.sendMail({
        from: '"CENTRAL DE TRASPASOS" <' + SMTP_USER + '>',
        to, subject, text, html: html || text
      });
      return json({ success: true });
    }

    return error(404, 'Ruta no encontrada');
  } catch (err) {
    console.error('API Error:', err);
    return error(500, err.message);
  }
};