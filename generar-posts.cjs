const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, 'crm', 'posts-png');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const POSTS = [
  {
    file: '01-alquiler-vs-traspaso.png',
    bg: 'linear-gradient(135deg,#0d1b2a,#1b2838)',
    accent: '#e8a838',
    emoji: '💡',
    big: '¿Pagas 800€ de alquiler de piso?',
    sub: 'Por 700€ alquilas un local y montas tu propio negocio',
    items: [
      '📍 Málaga capital, Teatinos, Costa del Sol',
      '💰 Desde 500€/mes de alquiler',
      '📋 Hostelería, tiendas, franquicias, clínicas'
    ],
    cta: 'Escríbenos y te enviamos la lista'
  },
  {
    file: '02-empleado-a-dueno.png',
    bg: 'linear-gradient(135deg,#0a1a2a,#0d3328)',
    accent: '#4caf50',
    emoji: '🚀',
    big: 'De empleado a dueño',
    sub: '3 historias reales en Málaga',
    items: [
      '👤 Antonio: camarero → dueño bar en Málaga (35.000€)',
      '👤 María: admin → tienda propia en Teatinos',
      '👤 Javi y Laura: ingenieros → hostal Costa del Sol'
    ],
    cta: 'Escríbenos y te asesoramos sin compromiso'
  },
  {
    file: '03-bar-torremolinos.png',
    bg: 'linear-gradient(135deg,#1a0a0a,#2d130e)',
    accent: '#ff5722',
    emoji: '🔥',
    big: 'Bar restaurante en Torremolinos',
    sub: 'Traspaso 50.000€ · Alquiler 1.630€',
    items: [
      '📍 90m² + terraza · A 5 min de la playa',
      '📊 Facturación real: 8.000€/mes',
      '👴 Dueño se jubila · Negocio funcionando'
    ],
    cta: 'Escríbenos "BAR" y te enviamos más fotos',
    tag: 'OPORTUNIDAD'
  },
  {
    file: '04-errores-traspaso.png',
    bg: 'linear-gradient(135deg,#1a0a2e,#2a0a3e)',
    accent: '#ab47bc',
    emoji: '⚠️',
    big: '5 errores al comprar un traspaso',
    sub: '(y cómo evitarlos)',
    items: [
      '❌ No pedir la contabilidad real',
      '❌ No revisar la licencia municipal',
      '❌ Pagar sin asesoramiento legal',
      '❌ No negociar el precio del traspaso',
      '❌ Fiarte sin comprobar la viabilidad'
    ],
    cta: 'En Central de Traspasos te ayudamos. 15 años en Málaga.'
  },
  {
    file: '05-mitos-traspasos.png',
    bg: 'linear-gradient(135deg,#0a1a3a,#0a2a4a)',
    accent: '#42a5f5',
    emoji: '🤔',
    big: 'Mitos sobre los traspasos',
    sub: '(que la gente sigue creyendo)',
    items: [
      '🗣️ "Son una estafa" → Hay legítimos, solo hay que asesorarse',
      '🗣️ "Solo hay bares" → Tiendas, hostales, talleres, clínicas...',
      '🗣️ "Necesitas un pastón" → Hay traspasos desde 5.000€',
      '🗣️ "Te compras problemas" → Compras clientes y flujo de caja'
    ],
    cta: '¿Tú también pensabas alguno? Escríbenos'
  },
  {
    file: '06-senales-rentabilidad.png',
    bg: 'linear-gradient(135deg,#1a1a0a,#2a2a0e)',
    accent: '#e8a838',
    emoji: '📊',
    big: '6 señales de que un traspaso es rentable',
    sub: '(antes de poner un euro)',
    items: [
      '✅ Contabilidad clara los últimos 2-3 años',
      '✅ Margen bruto mínimo 60-65% en hostelería',
      '✅ Alquiler no supera el 20% de la facturación',
      '✅ El dueño enseña todo sin esconderse'
    ],
    cta: 'Escríbenos y te ayudamos a evaluarlo'
  },
  {
    file: '07-vender-negocio.png',
    bg: 'linear-gradient(135deg,#2a0a0a,#3a0a0a)',
    accent: '#ef5350',
    emoji: '🎯',
    big: '¿Quieres vender tu negocio?',
    sub: 'Lo traspasamos en 60 días o seguimos trabajando gratis',
    items: [
      '✅ Tasación gratuita y sin compromiso',
      '✅ Discreción total: nadie se entera',
      '✅ Compradores cualificados y serios',
      '✅ Te acompañamos hasta la firma'
    ],
    cta: '15 años en Málaga. Escríbenos "TASAR"',
    tag: 'CAPTACIÓN'
  }
];

function htmlForPost(p) {
  const tagHtml = p.tag ? `<div class="tag">${p.tag}</div>` : '';
  const itemsHtml = p.items.map(i => `<div class="item">${i}</div>`).join('');
  return `<!DOCTYPE html><html><head><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:1080px;height:1080px;background:${p.bg};font-family:Arial,Helvetica,sans-serif;display:flex;flex-direction:column;position:relative;overflow:hidden}

    .header{display:flex;align-items:center;gap:16px;padding:36px 40px 0}
    .logo-icon{width:52px;height:52px;border-radius:10px;background:${p.accent};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:bold;color:#0a1a2a}
    .logo-text{font-size:22px;font-weight:bold;color:#fff;letter-spacing:0.5px}
    .logo-text span{color:${p.accent}}

    .main{flex:1;padding:20px 40px 10px;display:flex;flex-direction:column}
    .emoji{font-size:68px;margin-bottom:6px}
    ${tagHtml ? `.tag{display:inline-block;background:rgba(232,168,56,0.12);border:1px solid rgba(232,168,56,0.25);color:${p.accent};padding:8px 22px;border-radius:8px;font-size:20px;font-weight:bold;margin-bottom:14px;letter-spacing:2.5px;width:fit-content}` : ''}
    .big{font-size:60px;font-weight:bold;color:#fff;line-height:1.15;margin-bottom:8px}
    .sub{color:rgba(255,255,255,0.8);font-size:30px;margin-bottom:18px;line-height:1.3}

    .items{display:flex;flex-direction:column;gap:10px;flex:1}
    .item{background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 20px;font-size:26px;color:rgba(255,255,255,0.9);line-height:1.3}

    .cta-band{background:${p.accent};padding:20px 40px;text-align:center}
    .cta-text{color:#0a1a2a;font-size:28px;font-weight:bold;letter-spacing:0.5px}

    .footer{background:rgba(0,0,0,0.35);padding:20px 40px;display:flex;align-items:center;justify-content:center;gap:56px}
    .contact{display:flex;align-items:center;gap:10px;color:#fff;font-size:32px;font-weight:bold}
    .contact .ico{font-size:34px}
  </style></head><body>

    <div class="header">
      <div class="logo-icon">CT</div>
      <div class="logo-text">CENTRAL DE <span>TRASPASOS</span></div>
    </div>

    <div class="main">
      <div class="emoji">${p.emoji}</div>
      ${tagHtml}
      <div class="big">${p.big}</div>
      <div class="sub">${p.sub}</div>
      <div class="items">${itemsHtml}</div>
    </div>

    <div class="cta-band">
      <div class="cta-text">📲 ${p.cta}</div>
    </div>

    <div class="footer">
      <div class="contact"><span class="ico">🌐</span> centraldetraspasos.com</div>
      <div class="contact"><span class="ico">📱</span> 645 41 25 19</div>
    </div>

  </body></html>`;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080 });

  for (const p of POSTS) {
    const html = htmlForPost(p);
    await page.setContent(html, { waitUntil: 'load', timeout: 10000 });
    const filePath = path.join(OUT_DIR, p.file);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log('✓', p.file);
  }

  await browser.close();
  console.log('\n✅ 7 posts generados en:', OUT_DIR);
})();
