export function initTheme() {
  const html = document.documentElement;
  const stored = localStorage.getItem('bamm-docs-theme');
  if (stored === 'light' || stored === 'dark') {
    html.setAttribute('data-theme', stored);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('bamm-docs-theme', next);
    });
  }
  window.addEventListener('storage', (e) => {
    if (e.key === 'bamm-docs-theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
      html.setAttribute('data-theme', e.newValue);
    }
  });
}
