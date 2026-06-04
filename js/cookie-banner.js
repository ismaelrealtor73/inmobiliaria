(function() {
  if (localStorage.getItem('cookies_accepted')) return;
  var banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.innerHTML =
    '<div class="cookie-content">' +
      '<p>Utilizamos cookies t\u00e9cnicas necesarias para el funcionamiento del sitio. No usamos cookies de rastreo ni publicitarias. ' +
      '<a href="aviso-legal.html" style="color:#D4AF37;text-decoration:underline">M\u00e1s informaci\u00f3n</a></p>' +
      '<button onclick="acceptCookies()">Aceptar</button>' +
    '</div>';
  document.body.appendChild(banner);
  window.acceptCookies = function() {
    localStorage.setItem('cookies_accepted', 'true');
    banner.style.display = 'none';
  };
})();
