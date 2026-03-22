document.body.classList.add('has-wide-utils');

const { ColorHub, contrastText } = window.ch;

// The package ships no built-in themes — you define your own ColorTheme objects.
// These two are local to the demo and illustrate the expected shape.
const demoThemes = [
  {
    name: 'demo-light',
    colorMode: 'light',
    colors: {
      background: '#f8fafc',
      surface: '#ffffff',
      grid: '#e2e8f0',
      axis: '#64748b',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#0284c7',
    },
    palette: ['#2563eb', '#14b8a6', '#f97316', '#8b5cf6', '#e11d48', '#0891b2'],
    colorMap: { 'Series Red': '#FF0000' },
  },
  {
    name: 'demo-dark',
    colorMode: 'dark',
    colors: {
      background: '#020617',
      surface: '#0f172a',
      grid: '#1e293b',
      axis: '#94a3b8',
      textPrimary: '#e2e8f0',
      textSecondary: '#cbd5e1',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#f43f5e',
      info: '#38bdf8',
    },
    palette: ['#60a5fa', '#2dd4bf', '#fbbf24', '#a78bfa', '#fb7185', '#38bdf8'],
    colorMap: { 'Series Red': '#FF0000' },
  },
];
const cs = new ColorHub(demoThemes);

const seriesKeys = ['Series A', 'Series B', 'Series C', 'Series D', 'Series Red'];

const seriesEl = document.getElementById('series-colors');
function renderSeriesColors() {
  seriesEl.innerHTML = '';
  seriesKeys.forEach((key) => {
    const colors = cs.getColors(key);
    const group = document.createElement('div');
    group.className = 'key-group';
    const label = document.createElement('span');
    label.className = 'key-group-label';
    label.textContent = key;
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';
    [
      { label: 'Default', c: colors.default },
      { label: 'Hover', c: colors.hover },
      { label: 'Active', c: colors.active },
      { label: 'Disabled', c: colors.disabled },
    ].forEach(({ label: l, c }) => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.type = 'button';
      btn.style.background = c;
      btn.title = c;
      btn.innerHTML = `${l}<span class="btn-hex">${c}</span>`;
      if (c === colors.disabled) btn.style.cursor = 'default';
      btnGroup.appendChild(btn);
    });
    group.appendChild(label);
    group.appendChild(btnGroup);
    seriesEl.appendChild(group);
  });
}
renderSeriesColors();

const newSeriesKeys = [];
const newSeriesEl = document.getElementById('new-series-colors');
const newSeriesAddEl = document.getElementById('new-series-add');

const randomSeriesNames = ['Revenue', 'Cost', 'Profit', 'Users', 'Orders', 'Visits', 'Conversion', 'Churn', 'Growth', 'Margin', 'ROI', 'CTR', 'LTV', 'CAC', 'MRR', 'ARR'];
function randomSeriesName() {
  const word = randomSeriesNames[Math.floor(Math.random() * randomSeriesNames.length)];
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${word}-${suffix}`;
}

function renderNewSeriesColors() {
  newSeriesEl.innerHTML = '';
  newSeriesKeys.forEach((key) => {
    const colors = cs.getColors(key);
    const group = document.createElement('div');
    group.className = 'key-group';
    const label = document.createElement('span');
    label.className = 'key-group-label';
    label.textContent = key;
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';
    [
      { label: 'Default', c: colors.default },
      { label: 'Hover', c: colors.hover },
      { label: 'Active', c: colors.active },
      { label: 'Disabled', c: colors.disabled },
    ].forEach(({ label: l, c }) => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.type = 'button';
      btn.style.background = c;
      btn.title = c;
      btn.innerHTML = `${l}<span class="btn-hex">${c}</span>`;
      if (c === colors.disabled) btn.style.cursor = 'default';
      btnGroup.appendChild(btn);
    });
    group.appendChild(label);
    group.appendChild(btnGroup);
    newSeriesEl.appendChild(group);
  });
}

newSeriesAddEl.addEventListener('click', () => {
  newSeriesKeys.push(randomSeriesName());
  renderNewSeriesColors();
});

const dashboardThemesGalleryEl = document.getElementById('dashboard-themes-gallery');

function createDashboardSwatch(name, value) {
  const sw = document.createElement('div');
  sw.className = 'dashboard-swatch';
  sw.style.background = value;
  sw.title = `${name}: ${value}`;
  const textColor = contrastText ? contrastText(value) : '#ffffff';
  sw.style.color = textColor;

  const key = document.createElement('div');
  key.className = 'dashboard-swatch-key';
  key.textContent = name;
  const val = document.createElement('div');
  val.className = 'dashboard-swatch-value';
  val.textContent = value;
  sw.appendChild(key);
  sw.appendChild(val);
  return sw;
}

function renderDashboardThemesGallery() {
  if (!dashboardThemesGalleryEl) return;
  dashboardThemesGalleryEl.innerHTML = '';
  const currentName = cs.getCurrentTheme()?.name;
  demoThemes.forEach((theme) => {
    const card = document.createElement('article');
    card.className = 'dashboard-theme-card';
    card.dataset.themeName = theme.name;
    if (theme.name === currentName) {
      card.classList.add('dashboard-theme-card-active');
    }

    const title = document.createElement('h3');
    title.className = 'dashboard-theme-title';
    title.textContent = theme.name;
    if (theme.colorMode) {
      const mode = document.createElement('span');
      mode.className = 'dashboard-theme-mode';
      mode.textContent = theme.colorMode;
      title.appendChild(mode);
    }
    card.appendChild(title);

    const semanticTitle = document.createElement('p');
    semanticTitle.className = 'dashboard-theme-section-title';
    semanticTitle.textContent = 'Semantic colors';
    card.appendChild(semanticTitle);

    const semanticGrid = document.createElement('div');
    semanticGrid.className = 'dashboard-semantic-grid';
    const colors = theme.colors || {};
    Object.keys(colors).forEach((key) => {
      semanticGrid.appendChild(createDashboardSwatch(key, colors[key]));
    });
    card.appendChild(semanticGrid);

    const paletteTitle = document.createElement('p');
    paletteTitle.className = 'dashboard-theme-section-title';
    paletteTitle.textContent = 'Palette';
    card.appendChild(paletteTitle);

    const paletteRow = document.createElement('div');
    paletteRow.className = 'dashboard-palette-row';
    (theme.palette || []).forEach((color) => {
      const seg = document.createElement('span');
      seg.className = 'dashboard-palette-seg';
      seg.style.background = color;
      seg.title = color;
      paletteRow.appendChild(seg);
    });
    card.appendChild(paletteRow);

    dashboardThemesGalleryEl.appendChild(card);
  });
}

function switchToTheme(themeName) {
  cs.switchTheme(themeName);
  applyDarkClassFromTheme();
  renderSeriesColors();
  renderNewSeriesColors();
  renderDashboardThemesGallery();
}
function applyDarkClassFromTheme() {
  const t = cs.getCurrentTheme();
  document.body.classList.toggle('dark', t.colorMode === 'dark');
}
if (dashboardThemesGalleryEl) {
  dashboardThemesGalleryEl.addEventListener('click', (e) => {
    const raw = e.target;
    const el = raw instanceof Element ? raw : null;
    const card = el?.closest?.('.dashboard-theme-card');
    const themeName = card?.dataset?.themeName;
    if (!themeName) return;
    switchToTheme(themeName);
  });
}
applyDarkClassFromTheme();
renderDashboardThemesGallery();

const goldenExhaustHub = new ColorHub([{ name: 'empty', palette: [], colorMap: {} }]);
const perceptualExhaustHub = new ColorHub(
  [{ name: 'empty', palette: [], colorMap: {} }],
  {
    paletteExhaustion: 'perceptual',
    perceptualMinDeltaE: 20,
    perceptualMaxAttempts: 120,
  },
);

const goldenExhaustKeys = [];
const perceptualExhaustKeys = [];
let goldenExhaustN = 0;
let perceptualExhaustN = 0;

function renderExhaustionList(hub, keys, containerEl) {
  if (!containerEl) return;
  containerEl.innerHTML = '';
  keys.forEach((key) => {
    const c = hub.getColors(key).default;
    const row = document.createElement('div');
    row.className = 'key-group';
    row.style.marginBottom = '0.35rem';
    const lab = document.createElement('span');
    lab.className = 'key-group-label';
    lab.textContent = key;
    lab.style.minWidth = '5rem';
    const sw = document.createElement('span');
    sw.className = 'btn';
    sw.style.background = c;
    sw.style.cursor = 'default';
    sw.title = c;
    sw.innerHTML = `<span class="btn-hex">${c}</span>`;
    row.appendChild(lab);
    row.appendChild(sw);
    containerEl.appendChild(row);
  });
}

const exhaustionDemoEl = document.getElementById('exhaustion-demo');
const exhaustGoldenListEl = document.getElementById('exhaust-golden-list');
const exhaustPerceptualListEl = document.getElementById('exhaust-perceptual-list');

function handleExhaustionDemoClick(e) {
  const raw = e.target;
  const el = raw instanceof Element ? raw : raw.parentElement;
  const btn = el?.closest?.('#exhaust-golden-add, #exhaust-perceptual-add');
  if (!btn) return;
  try {
    if (btn.id === 'exhaust-golden-add') {
      goldenExhaustN += 1;
      goldenExhaustKeys.push(`G-${goldenExhaustN}`);
      renderExhaustionList(goldenExhaustHub, goldenExhaustKeys, exhaustGoldenListEl);
    } else {
      perceptualExhaustN += 1;
      perceptualExhaustKeys.push(`P-${perceptualExhaustN}`);
      renderExhaustionList(
        perceptualExhaustHub,
        perceptualExhaustKeys,
        exhaustPerceptualListEl,
      );
    }
  } catch (err) {
    console.error('[exhaustion demo]', err);
  }
}

if (exhaustionDemoEl) {
  exhaustionDemoEl.addEventListener('click', handleExhaustionDemoClick);
} else {
  console.warn('[color-hub site] #exhaustion-demo missing; exhaustion buttons not wired.');
}

/* ——— Utilities demo (moved to site/utils-demo.js) ——— */
window.initUtilsDemo({
  ch: window.ch,
  rootEl: document.getElementById('utils-sections'),
  baseInputEl: document.getElementById('utils-base-input'),
  baseTextEl: document.getElementById('utils-base-text'),
  baseLabelEl: document.getElementById('utils-base-label'),
});
