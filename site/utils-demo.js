/**
 * Utilities section: one registry entry per util demo.
 *
 * To add a new util from src/utils.ts:
 * 1. Export it from src/index.ts (if not already).
 * 2. Destructure it from `ch` below (the bundle global).
 * 3. Append one object to `buildUtilDemos(...)` — put `exports` + `render` together.
 * 4. `npm run build` and refresh the site.
 *
 * `exports` lists function names checked by "Runtime export check"; keep in sync with the demo.
 */
(function attachUtilsDemo(global) {
  function initUtilsDemo(opts) {
    const { ch, rootEl, baseInputEl, baseTextEl, baseLabelEl } = opts;

    const {
      alpha,
      lighten,
      darken,
      saturate,
      desaturate,
      invert,
      grayscale,
      rotateHue,
      mix,
      mixOklab,
      mixOklch,
      colorStepsOklch,
      colorStepsOklab,
      contrastRatio,
      contrastText,
      brightness,
      isValidColor,
      isDark,
      isLight,
      toRgb,
      colorSteps,
      randomColor,
      randomChartColor,
      randomDistinctColor,
      randomPaletteColor,
      deltaE76,
      minDeltaE76ToExisting,
      distinctColorPerceptual,
    } = ch;

    function swatch(label, hex) {
      const span = document.createElement('span');
      span.className = 'swatch swatch-wide';
      span.style.background = hex;
      span.title = hex;
      span.textContent = label;
      return span;
    }

    function fnBlock(signature, note, renderBody) {
      const block = document.createElement('section');
      block.className = 'utils-fn-block';
      const h = document.createElement('h3');
      h.className = 'utils-fn-title';
      h.textContent = signature;
      block.appendChild(h);
      if (note) {
        const p = document.createElement('p');
        p.className = 'utils-fn-note';
        p.textContent = note;
        block.appendChild(p);
      }
      renderBody(block);
      return block;
    }

    function row(pairs) {
      const el = document.createElement('div');
      el.className = 'color-row';
      pairs.forEach(([label, hex]) =>
        el.appendChild(swatch(String(label), hex)),
      );
      return el;
    }

    /** @param {string|string[]} names */
    function utilDemo(names, renderSection) {
      const exports = Array.isArray(names) ? names : [names];
      return { exports, render: renderSection };
    }

    function renderRandomDemo(signature, fn) {
      return fnBlock(
        signature,
        'Click ↻ to sample 5 new colors (same as the old random rows).',
        (block) => {
          const rowWrap = document.createElement('div');
          rowWrap.className = 'key-group';
          rowWrap.style.marginBottom = '0';
          const sampleBtn = document.createElement('button');
          sampleBtn.type = 'button';
          sampleBtn.className = 'btn btn-sm btn-arrow';
          sampleBtn.style.background = '#555';
          sampleBtn.title = 'Resample';
          sampleBtn.textContent = '↻';
          const swatchRow = document.createElement('div');
          swatchRow.className = 'color-row';
          function fillSwatches() {
            swatchRow.innerHTML = '';
            for (let i = 0; i < 5; i++) {
              const c = fn();
              const s = document.createElement('span');
              s.className = 'swatch';
              s.style.background = c;
              s.title = c;
              s.textContent = c;
              swatchRow.appendChild(s);
            }
          }
          sampleBtn.onclick = fillSwatches;
          fillSwatches();
          rowWrap.appendChild(sampleBtn);
          rowWrap.appendChild(swatchRow);
          block.appendChild(rowWrap);
        },
      );
    }

    /**
     * One entry per util (or one entry for a combined demo like isDark + isLight).
     * Order is page order.
     */
    function buildUtilDemos() {
      return [
        utilDemo('alpha', (base) =>
          fnBlock(
            'alpha(color, amount)',
            'Example: alpha(base, 0.5)',
            (block) =>
              block.appendChild(row([['alpha(base, 0.5)', alpha(base, 0.5)]])),
          ),
        ),

        utilDemo('lighten', (base) =>
          fnBlock(
            'lighten(color, amount)',
            'Example: lighten(base, 0.2)',
            (block) =>
              block.appendChild(row([['lighten(base, 0.2)', lighten(base, 0.2)]])),
          ),
        ),

        utilDemo('darken', (base) =>
          fnBlock(
            'darken(color, amount)',
            'Example: darken(base, 0.2)',
            (block) =>
              block.appendChild(row([['darken(base, 0.2)', darken(base, 0.2)]])),
          ),
        ),

        utilDemo('saturate', (base) =>
          fnBlock(
            'saturate(color, amount)',
            'Example: saturate(base, 0.3)',
            (block) =>
              block.appendChild(
                row([['saturate(base, 0.3)', saturate(base, 0.3)]]),
              ),
          ),
        ),

        utilDemo('desaturate', (base) =>
          fnBlock(
            'desaturate(color, amount)',
            'Example: desaturate(base, 0.3)',
            (block) =>
              block.appendChild(
                row([['desaturate(base, 0.3)', desaturate(base, 0.3)]]),
              ),
          ),
        ),

        utilDemo('invert', (base) =>
          fnBlock(
            'invert(color)',
            'Mirror HSL lightness, keep hue (light↔dark)',
            (block) =>
              block.appendChild(row([['invert(base)', invert(base)]])),
          ),
        ),

        utilDemo('grayscale', (base) =>
          fnBlock(
            'grayscale(color)',
            'Same lightness, zero saturation',
            (block) =>
              block.appendChild(row([['grayscale(base)', grayscale(base)]])),
          ),
        ),

        utilDemo('rotateHue', (base) =>
          fnBlock(
            'rotateHue(color, degrees)',
            'Examples: rotateHue(base, 60) and rotateHue(base, 180)',
            (block) =>
              block.appendChild(
                row([
                  ['rotateHue(60)', rotateHue(base, 60)],
                  ['rotateHue(180)', rotateHue(base, 180)],
                ]),
              ),
          ),
        ),

        utilDemo('mix', (base) =>
          fnBlock(
            'mix(color1, color2, ratio)',
            'Top: mix(base, #ffffff, 0 / 0.5 / 1). Bottom: mix(#ff0000, #0000ff, …) — does not use base.',
            (block) => {
              block.appendChild(
                row([
                  ['mix base+white 0', mix(base, '#ffffff', 0)],
                  ['0.5', mix(base, '#ffffff', 0.5)],
                  ['1', mix(base, '#ffffff', 1)],
                ]),
              );
              const sub = document.createElement('p');
              sub.className = 'utils-fn-note';
              sub.textContent = 'Red → blue (fixed endpoints):';
              sub.style.marginTop = '0.65rem';
              block.appendChild(sub);
              block.appendChild(
                row(
                  [0, 0.25, 0.5, 0.75, 1].map((r) => [
                    `mix ${r}`,
                    mix('#ff0000', '#0000ff', r),
                  ]),
                ),
              );
            },
          ),
        ),

        utilDemo(['mixOklab', 'mixOklch'], (base) =>
          fnBlock(
            'mixOklab(color1, color2, ratio?)',
            'Oklab (L,a,b) linear mix vs sRGB mix — red→blue mid is less muddy than channel mix. mixOklch is an alias of mixOklab.',
            (block) => {
              block.appendChild(
                row([
                  ['mixOklab 0.5', mixOklab('#ff0000', '#0000ff', 0.5)],
                  ['mix 0.5', mix('#ff0000', '#0000ff', 0.5)],
                ]),
              );
            },
          ),
        ),

        utilDemo(['contrastRatio', 'contrastText'], (base) =>
          fnBlock(
            'contrastRatio(foreground, background)',
            'Left pair: contrastText(base) on base. Right: white on black (expect ~21).',
            (block) => {
              const wrap = document.createElement('div');
              wrap.className = 'contrast-ratio-pair';
              const fgOnBase = contrastText(base);
              wrap.appendChild(swatch('fg', fgOnBase));
              wrap.appendChild(swatch('bg', base));
              const t1 = document.createElement('span');
              t1.className = 'contrast-ratio-value';
              t1.textContent = `= ${contrastRatio(fgOnBase, base).toFixed(2)}`;
              wrap.appendChild(t1);

              wrap.appendChild(swatch('fg', '#ffffff'));
              wrap.appendChild(swatch('bg', '#000000'));
              const t2 = document.createElement('span');
              t2.className = 'contrast-ratio-value';
              t2.textContent = `= ${contrastRatio('#ffffff', '#000000').toFixed(2)}`;
              wrap.appendChild(t2);
              block.appendChild(wrap);
            },
          ),
        ),

        utilDemo(['contrastText', 'contrastRatio'], (base) =>
          fnBlock(
            'contrastText(background, options?)',
            'Readable text on your base, and on light gray (custom default dark/light).',
            (block) => {
              const demo = document.createElement('div');
              demo.className = 'contrast-demo';
              const fg = contrastText(base);
              const card = document.createElement('div');
              card.className = 'contrast-demo-card';
              card.style.background = base;
              card.style.color = fg;
              card.innerHTML = `<span class="line-title">contrastText(base)</span>
            <span class="line-main">Sample heading</span>
            <span class="line-sub">text = ${fg} · contrastRatio = ${contrastRatio(
            fg,
            base,
          ).toFixed(2)}</span>`;
              demo.appendChild(card);

              const bg2 = '#e5e7eb';
              const fg2 = contrastText(bg2);
              const card2 = document.createElement('div');
              card2.className = 'contrast-demo-card';
              card2.style.background = bg2;
              card2.style.color = fg2;
              card2.innerHTML = `<span class="line-title">contrastText('#e5e7eb')</span>
            <span class="line-main">Body text</span>
            <span class="line-sub">text = ${fg2} · ratio = ${contrastRatio(
            fg2,
            bg2,
          ).toFixed(2)}</span>`;
              demo.appendChild(card2);
              block.appendChild(demo);
            },
          ),
        ),

        utilDemo('brightness', (base) =>
          fnBlock(
            'brightness(color)',
            'Perceived brightness 0–1 (marker on gradient)',
            (block) => {
              const br = brightness(base);
              const demo = document.createElement('div');
              demo.className = 'brightness-demo';
              const track = document.createElement('div');
              track.className = 'brightness-track';
              const marker = document.createElement('div');
              marker.className = 'brightness-fill-marker';
              marker.style.left = `${Math.min(100, Math.max(0, br * 100))}%`;
              track.appendChild(marker);
              const val = document.createElement('div');
              val.className = 'brightness-value';
              val.textContent = `brightness(base) = ${br.toFixed(4)}`;
              demo.appendChild(track);
              demo.appendChild(val);
              block.appendChild(demo);
            },
          ),
        ),

        utilDemo('isValidColor', (base) =>
          fnBlock(
            'isValidColor(input)',
            'Try pasting an invalid string in the base field above; this still reflects parse of current base vs a bad literal.',
            (block) => {
              const grid = document.createElement('div');
              grid.className = 'validity-grid';
              const ok = document.createElement('div');
              ok.className = 'validity-cell ok';
              ok.textContent = `isValidColor(${JSON.stringify(base)}) → ${isValidColor(
                base,
              )}`;
              const bad = document.createElement('div');
              bad.className = 'validity-cell bad';
              bad.textContent =
                'isValidColor("not-a-color") → ' + isValidColor('not-a-color');
              grid.appendChild(ok);
              grid.appendChild(bad);
              block.appendChild(grid);
            },
          ),
        ),

        utilDemo(['isDark', 'isLight'], (base) =>
          fnBlock(
            'isDark(color) / isLight(color)',
            'Same three samples with swatches:',
            (block) => {
              const wrap = document.createElement('div');
              wrap.style.display = 'flex';
              wrap.style.flexDirection = 'column';
              wrap.style.gap = '0.5rem';
              const samples = [
                ['base (current)', base],
                ['black', '#000000'],
                ['white', '#ffffff'],
              ];
              samples.forEach(([name, c]) => {
                const line = document.createElement('div');
                line.style.display = 'flex';
                line.style.alignItems = 'center';
                line.style.gap = '0.5rem';
                line.style.flexWrap = 'wrap';
                const sq = document.createElement('span');
                sq.style.cssText =
                  'width:28px;height:28px;border-radius:6px;border:1px solid rgba(0,0,0,0.12);flex-shrink:0;';
                sq.style.background = c;
                sq.title = c;
                const span = document.createElement('span');
                span.className = 'utils-fn-note';
                span.style.margin = '0';
                span.textContent = `${name} → isDark=${isDark(c)} · isLight=${isLight(
                  c,
                )}`;
                line.appendChild(sq);
                line.appendChild(span);
                wrap.appendChild(line);
              });
              block.appendChild(wrap);
            },
          ),
        ),

        utilDemo('toRgb', (base) =>
          fnBlock(
            'toRgb(color)',
            'Object with r, g, b (0–255) and a (0–1):',
            (block) => {
              const pre = document.createElement('pre');
              pre.className = 'utils-meta';
              pre.textContent = JSON.stringify(toRgb(base), null, 2);
              block.appendChild(pre);
            },
          ),
        ),

        utilDemo(['colorSteps', 'colorStepsOklch', 'colorStepsOklab'], (base) =>
          fnBlock(
            'colorSteps / colorStepsOklch / colorStepsOklab',
            'sRGB channel mix vs Oklab differ most when hues are far apart (e.g. red↔blue). Blue↔orange often looks similar — that is expected. Hover swatches for hex.',
            (block) => {
              const n = 8;

              function appendStripGroup(title, rowSpecs) {
                const titleEl = document.createElement('p');
                titleEl.className = 'utils-strip-group-title';
                titleEl.textContent = title;
                block.appendChild(titleEl);
                const wrap = document.createElement('div');
                wrap.className = 'utils-strip-comparison';
                rowSpecs.forEach(([label, hexes]) => {
                  const row = document.createElement('div');
                  row.className = 'utils-strip-comparison-row';
                  const lab = document.createElement('div');
                  lab.className = 'utils-strip-row-label';
                  lab.textContent = label;
                  row.appendChild(lab);
                  const strip = document.createElement('div');
                  strip.className = 'utils-strip';
                  hexes.forEach((hex) => {
                    const seg = document.createElement('span');
                    seg.style.background = hex;
                    seg.title = hex;
                    strip.appendChild(seg);
                  });
                  row.appendChild(strip);
                  wrap.appendChild(row);
                });
                block.appendChild(wrap);
              }

              appendStripGroup(
                'Fixed endpoints — red → blue (difference usually obvious)',
                [
                  [
                    'colorSteps("#ff0000", "#0000ff", 8) — sRGB channel',
                    colorSteps('#ff0000', '#0000ff', n),
                  ],
                  [
                    'colorStepsOklch("#ff0000", "#0000ff", 8) — Oklab',
                    colorStepsOklch('#ff0000', '#0000ff', n),
                  ],
                  [
                    'colorStepsOklab("#ff0000", "#0000ff", 8) — alias of colorStepsOklch',
                    colorStepsOklab('#ff0000', '#0000ff', n),
                  ],
                ],
              );

              appendStripGroup(
                'Uses your base color → #ff7f0e (often subtle vs Oklab)',
                [
                  [
                    'colorSteps(base, "#ff7f0e", 8) — sRGB channel',
                    colorSteps(base, '#ff7f0e', n),
                  ],
                  [
                    'colorStepsOklch(base, "#ff7f0e", 8) — Oklab',
                    colorStepsOklch(base, '#ff7f0e', n),
                  ],
                  [
                    'colorStepsOklab(base, "#ff7f0e", 8) — alias of colorStepsOklch',
                    colorStepsOklab(base, '#ff7f0e', n),
                  ],
                ],
              );
            },
          ),
        ),

        utilDemo('deltaE76', (base) =>
          fnBlock(
            'deltaE76(color1, color2)',
            'CIELAB ΔE76 between base and #ff7f0e',
            (block) => {
              const d = deltaE76(base, '#ff7f0e');
              const p = document.createElement('p');
              p.className = 'utils-fn-note';
              p.textContent = `deltaE76(base, '#ff7f0e') = ${d.toFixed(2)}`;
              block.appendChild(p);
              block.appendChild(
                row([
                  ['base', base],
                  ['#ff7f0e', '#ff7f0e'],
                ]),
              );
            },
          ),
        ),

        utilDemo('minDeltaE76ToExisting', (base) =>
          fnBlock(
            'minDeltaE76ToExisting(candidate, existing[])',
            'Minimum ΔE76 from base to pure red / green / blue',
            (block) => {
              const existing = ['#ff0000', '#00ff00', '#0000ff'];
              const d = minDeltaE76ToExisting(base, existing);
              const p = document.createElement('p');
              p.className = 'utils-fn-note';
              p.textContent = `minDeltaE76ToExisting(base, [rgb]) = ${d.toFixed(2)}`;
              block.appendChild(p);
              block.appendChild(
                row([
                  ['base', base],
                  ['red', existing[0]],
                  ['green', existing[1]],
                  ['blue', existing[2]],
                ]),
              );
            },
          ),
        ),

        utilDemo(
          ['distinctColorPerceptual', 'minDeltaE76ToExisting'],
          () =>
            fnBlock(
              'distinctColorPerceptual(existing[], options?)',
              'Candidate vs three fixed colors (min ΔE18). Click ↻ to resample.',
              (block) => {
                const fixed = ['#e74c3c', '#3498db', '#2ecc71'];
                block.appendChild(
                  row([
                    ['A', fixed[0]],
                    ['B', fixed[1]],
                    ['C', fixed[2]],
                  ]),
                );
                const rowWrap = document.createElement('div');
                rowWrap.className = 'key-group';
                rowWrap.style.marginTop = '0.5rem';
                const sampleBtn = document.createElement('button');
                sampleBtn.type = 'button';
                sampleBtn.className = 'btn btn-sm btn-arrow';
                sampleBtn.style.background = '#555';
                sampleBtn.title = 'Resample';
                sampleBtn.textContent = '↻';
                const swatchRow = document.createElement('div');
                swatchRow.className = 'color-row';
                const note = document.createElement('span');
                note.className = 'utils-fn-note';
                note.style.marginLeft = '0.35rem';
                function fill() {
                  const c = distinctColorPerceptual(fixed, {
                    minDeltaE: 18,
                    maxAttempts: 200,
                  });
                  swatchRow.innerHTML = '';
                  const s = document.createElement('span');
                  s.className = 'swatch swatch-wide';
                  s.style.background = c;
                  s.title = c;
                  s.textContent = `new: ${c}`;
                  swatchRow.appendChild(s);
                  note.textContent = `min ΔE to fixed = ${minDeltaE76ToExisting(
                    c,
                    fixed,
                  ).toFixed(1)}`;
                  swatchRow.appendChild(note);
                }
                sampleBtn.onclick = fill;
                fill();
                rowWrap.appendChild(sampleBtn);
                rowWrap.appendChild(swatchRow);
                block.appendChild(rowWrap);
              },
            ),
        ),

        utilDemo('randomColor', () =>
          renderRandomDemo('randomColor()', randomColor),
        ),

        utilDemo('randomChartColor', () =>
          renderRandomDemo('randomChartColor(70, 50)', () =>
            randomChartColor(70, 50),
          ),
        ),

        utilDemo('randomDistinctColor', () =>
          renderRandomDemo('randomDistinctColor()', randomDistinctColor),
        ),

        utilDemo('randomPaletteColor', () =>
          renderRandomDemo('randomPaletteColor()', randomPaletteColor),
        ),
      ];
    }

    const utilDemos = buildUtilDemos();

    const REQUIRED_EXPORTS = [
      ...new Set(utilDemos.flatMap((d) => d.exports)),
    ];

    function renderExportDiagnostics() {
      const block = document.createElement('section');
      block.className = 'utils-fn-block';
      const title = document.createElement('h3');
      title.className = 'utils-fn-title';
      title.textContent = 'Runtime export check (window.ch)';
      block.appendChild(title);

      const available = Object.keys(ch || {}).sort();
      const missing = REQUIRED_EXPORTS.filter(
        (name) => typeof ch?.[name] !== 'function',
      );

      const note = document.createElement('p');
      note.className = 'utils-fn-note';
      note.textContent =
        missing.length === 0
          ? 'All expected util functions are present in the loaded bundle.'
          : `Missing exports: ${missing.join(', ')}`;
      block.appendChild(note);

      const pre = document.createElement('pre');
      pre.className = 'utils-meta';
      pre.textContent =
        `Available keys (${available.length}):\n` + available.join(', ');
      block.appendChild(pre);
      rootEl.appendChild(block);
    }

    function addLegacyTransformStrip(base) {
      const wrap = document.createElement('div');
      wrap.className = 'utils-legacy-strip';
      const lab = document.createElement('p');
      lab.className = 'utils-legacy-label';
      lab.textContent =
        'Original “Utils: color functions” strip — base + alpha(0.5), lighten(0.2), darken(0.2), saturate(0.3) (same as the old site)';
      wrap.appendChild(lab);
      wrap.appendChild(
        row([
          ['base', base],
          ['alpha(0.5)', alpha(base, 0.5)],
          ['lighten(0.2)', lighten(base, 0.2)],
          ['darken(0.2)', darken(base, 0.2)],
          ['saturate(0.3)', saturate(base, 0.3)],
        ]),
      );
      rootEl.appendChild(wrap);
    }

    function render() {
      const base = baseTextEl.value.trim() || '#1f77b4';
      baseLabelEl.textContent = base;
      rootEl.innerHTML = '';
      renderExportDiagnostics();
      addLegacyTransformStrip(base);

      for (const demo of utilDemos) {
        rootEl.appendChild(demo.render(base));
      }
    }

    function normalizeHexInput(raw) {
      const t = raw.trim();
      if (/^#[0-9A-Fa-f]{6}$/.test(t)) return t;
      if (/^#[0-9A-Fa-f]{3}$/.test(t)) {
        const r = t[1];
        const g = t[2];
        const b = t[3];
        return `#${r}${r}${g}${g}${b}${b}`;
      }
      return null;
    }

    baseInputEl.addEventListener('input', () => {
      baseTextEl.value = baseInputEl.value;
      render();
    });

    baseTextEl.addEventListener('change', () => {
      const n = normalizeHexInput(baseTextEl.value);
      if (n) {
        baseTextEl.value = n;
        baseInputEl.value = n;
        render();
      }
    });

    baseTextEl.addEventListener('input', () => {
      const n = normalizeHexInput(baseTextEl.value);
      if (n) {
        baseInputEl.value = n;
        render();
      }
    });

    render();
    return { render };
  }

  global.initUtilsDemo = initUtilsDemo;
})(window);
