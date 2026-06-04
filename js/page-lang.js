function applyPageLang(lang) {
  document.querySelectorAll('.lang-es').forEach(el => el.style.display = lang === 'es' ? '' : 'none');
  document.querySelectorAll('.lang-en').forEach(el => el.style.display = lang === 'en' ? '' : 'none');
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.startsWith('/en/')) {
    setLang('en');
  } else {
    applyPageLang(currentLang || 'es');
  }
});
document.addEventListener('langchange', () => applyPageLang(currentLang));
