import { defineConfig } from '@bndynet/vue-site';

export default defineConfig({
  title: 'Color Hub',
  defaultPath: '/home',
  links: [
    {
      icon: 'github',
      link: 'https://github.com/bndynet/color-hub',
      title: 'GitHub',
    },
    {
      icon: 'package',
      link: 'https://www.npmjs.com/package/@bndynet/color-hub',
      title: 'npm',
    },
  ],
  // The site lives inside the library repo. Resolve the package specifier
  // `@bndynet/color-hub` to the live TypeScript source so demos run exactly what
  // is published — and editing any file under ../src triggers an automatic
  // hot-reload of the site (the source is compiled by Vite, not pre-bundled).
  env: {
    watchPackages: [
      { name: '@bndynet/color-hub', entryPath: '../src/index.ts' },
    ],
  },
  bootstrap: './bootstrap.ts',
  nav: [
    { label: 'Home', icon: 'home', path: '/home', page: () => import('./pages/home.md?raw') },
    {
      label: 'Getting Started',
      icon: 'rocket',
      page: () => import('./pages/getting-started.md?raw'),
    },
    {
      label: 'Utilities',
      icon: 'palette',
      children: [
        { label: 'Adjustments', icon: 'sliders-horizontal', page: () => import('./pages/Adjustments.vue') },
        { label: 'Mixing & Ramps', icon: 'blend', page: () => import('./pages/Mixing.vue') },
        { label: 'Tonal Scales', icon: 'layers', page: () => import('./pages/Scales.vue') },
        { label: 'Color Harmony', icon: 'shapes', page: () => import('./pages/Harmony.vue') },
        { label: 'Interpolation', icon: 'git-commit-horizontal', page: () => import('./pages/Interpolation.vue') },
        { label: 'Contrast & A11y', icon: 'contrast', page: () => import('./pages/Contrast.vue') },
        { label: 'Perceptual Distance', icon: 'ruler', page: () => import('./pages/Distance.vue') },
        { label: 'CVD Simulation', icon: 'eye', page: () => import('./pages/Cvd.vue') },
        { label: 'Parse & Convert', icon: 'repeat', page: () => import('./pages/Convert.vue') },
      ],
    },
    {
      label: 'ColorHub',
      icon: 'boxes',
      children: [
        { label: 'Key → Color', icon: 'key-round', page: () => import('./pages/Hub.vue') },
        { label: 'State Colors', icon: 'mouse-pointer-click', page: () => import('./pages/States.vue') },
        { label: 'Themes & CSS Vars', icon: 'sun-moon', page: () => import('./pages/Themes.vue') },
      ],
    },
    {
      label: 'Scenarios',
      icon: 'lightbulb',
      children: [
        { label: 'Chart Series Colors', icon: 'chart-column', page: () => import('./pages/Scenario-Charts.vue') },
        { label: 'Data Heatmaps', icon: 'grid-3x3', page: () => import('./pages/Scenario-Heatmap.vue') },
        { label: 'More Recipes', icon: 'book-open', page: () => import('./pages/scenarios.md?raw') },
      ],
    },
  ],
});
