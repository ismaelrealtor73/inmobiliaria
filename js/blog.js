(function() {
var article = document.querySelector('article');
if (!article) return;

var headings = article.querySelectorAll('h2, h3');
if (headings.length >= 3) {
  var tocHTML = '<div style="margin:0 auto 32px;max-width:700px;padding:20px 24px;background:var(--light);border-radius:12px;border:1px solid #eef1f4"><p style="font-weight:700;margin-bottom:12px;color:var(--primary)">\u00cdndice</p><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px">';
  for (var i = 0; i < headings.length; i++) {
    var h = headings[i];
    var text = h.textContent.trim();
    var id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'sec-' + i;
    h.id = id;
    var cls = h.tagName === 'H3' ? 'padding-left:16px;font-size:0.85rem' : 'font-size:0.9rem';
    tocHTML += '<li style="' + cls + '"><a href="#' + id + '" style="color:var(--text);text-decoration:none;transition:color 0.2s">' + text + '</a></li>';
  }
  tocHTML += '</ul></div>';
  var meta = article.querySelector('.post-meta');
  if (meta) {
    meta.insertAdjacentHTML('afterend', tocHTML);
  } else {
    article.insertAdjacentHTML('afterbegin', tocHTML);
  }
}

var footer = document.querySelector('footer');
if (!footer) return;

var url = encodeURIComponent(window.location.href);
var title = encodeURIComponent(document.title.replace(' - CENTRAL DE TRASPASOS', ''));

var shareHTML = '<div style="margin:40px auto;max-width:700px;padding:24px;background:var(--light);border-radius:12px;text-align:center">' +
  '<p style="font-weight:600;margin-bottom:16px;color:var(--text)">Comparte este art\u00edculo</p>' +
  '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
  '<a href="https://wa.me/?text=' + url + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:500;font-size:0.9rem">WhatsApp</a>' +
  '<a href="https://www.facebook.com/sharer/sharer.php?u=' + url + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:#1877F2;color:white;border-radius:8px;text-decoration:none;font-weight:500;font-size:0.9rem">Facebook</a>' +
  '<a href="https://twitter.com/intent/tweet?text=' + title + '&url=' + url + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:#000;color:white;border-radius:8px;text-decoration:none;font-weight:500;font-size:0.9rem">X</a>' +
  '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' + url + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:#0A66C2;color:white;border-radius:8px;text-decoration:none;font-weight:500;font-size:0.9rem">LinkedIn</a>' +
  '<button onclick="navigator.clipboard.writeText(decodeURIComponent(\'' + url + '\'));this.textContent=\'Copiado\';setTimeout(function(){this.textContent=\'Copiar enlace\'}.bind(this),2000)" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:var(--primary);color:white;border:2px solid var(--primary);border-radius:8px;cursor:pointer;font-weight:500;font-size:0.9rem;font-family:inherit">Copiar enlace</button>' +
  '</div></div>';

footer.insertAdjacentHTML('beforebegin', shareHTML);

var posts = [
  { t: 'Mejores zonas para abrir un negocio en M\u00e1laga 2026', u: 'mejores-zonas-abrir-negocio-malaga.html' },
  { t: 'C\u00f3mo traspasar un local o negocio en M\u00e1laga: gu\u00eda completa 2026', u: 'guia-traspaso-local-malaga.html' },
  { t: 'Los 5 mejores locales para restaurante en la Costa del Sol en 2026', u: 'locales-restaurante-costa-del-sol.html' },
  { t: 'Alquiler de local comercial en M\u00e1laga: precios, zonas y consejos', u: 'alquiler-local-comercial-malaga.html' },
  { t: 'Invertir en locales comerciales en la Costa del Sol: gu\u00eda 2026', u: 'invertir-locales-costa-del-sol.html' },
  { t: 'Licencia de actividad en M\u00e1laga: gu\u00eda completa 2026', u: 'licencia-actividad-malaga.html' },
  { t: 'C\u00f3mo tasar un negocio o local comercial en M\u00e1laga: gu\u00eda de valoraci\u00f3n 2026', u: 'tasacion-negocio-malaga.html' },
  { t: 'Cu\u00e1nto cuesta traspasar un restaurante en M\u00e1laga 2026', u: 'cuanto-cuesta-traspaso-restaurante-malaga.html' },
  { t: 'Gu\u00eda de precios de locales comerciales por zonas en M\u00e1laga', u: 'guia-precios-locales-zonas-malaga.html' },
  { t: 'C\u00f3mo financiar un traspaso de negocio en M\u00e1laga', u: 'como-financiar-traspaso-negocio-malaga.html' },
  { t: 'Traspaso de restaurante en Teatinos M\u00e1laga 2026', u: 'traspaso-restaurante-teatinos-malaga.html' },
  { t: 'Traspaso de pizzer\u00eda en M\u00e1laga 2026', u: 'traspaso-pizzeria-malaga.html' },
  { t: 'Traspaso de kebab en M\u00e1laga 2026', u: 'traspaso-kebab-malaga.html' },
  { t: 'Traspaso de peluquer\u00eda en M\u00e1laga 2026', u: 'traspaso-peluqueria-malaga.html' },
  { t: 'Traspaso de cl\u00ednica est\u00e9tica en M\u00e1laga 2026', u: 'traspaso-clinica-estetica-malaga.html' },
  { t: 'Traspaso de discoteca o pub en la Costa del Sol 2026', u: 'traspaso-discoteca-pub-malaga.html' },
  { t: 'Traspaso de supermercado en Fuengirola 2026', u: 'traspaso-supermercado-fuengirola-malaga.html' }
];

var current = window.location.pathname.split('/').pop();
var related = posts.filter(function(p) { return p.u !== current; });
for (var i = related.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = related[i]; related[i] = related[j]; related[j] = tmp; }
var pick = related.slice(0, 3);

var relatedHTML = '<div style="margin:40px auto;max-width:700px;padding:24px;background:white;border:1px solid #eef1f4;border-radius:12px"><p style="font-weight:600;margin-bottom:16px;color:var(--text)">Art\u00edculos relacionados</p><div style="display:flex;flex-direction:column;gap:12px">';
for (var k = 0; k < pick.length; k++) {
  relatedHTML += '<a href="' + pick[k].u + '" style="padding:12px 16px;background:var(--light);border-radius:8px;color:var(--primary);text-decoration:none;font-weight:500;font-size:0.95rem;transition:background 0.2s">' + pick[k].t + '</a>';
}
relatedHTML += '</div></div>';

footer.insertAdjacentHTML('beforebegin', relatedHTML);
})();
