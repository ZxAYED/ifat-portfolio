import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const bootstrap = read('src/app/layout.tsx').match(/__html: `([^`]+)`/)[1];
function initialize(values, reduced = false) {
  const dataset = {};
  runInNewContext(bootstrap, {
    document: { documentElement: { dataset } },
    localStorage: { getItem: (key) => values[key] ?? null },
    matchMedia: () => ({ matches: reduced }),
  });
  return dataset;
}
test('fresh visits default to light with full motion', () => {
  const state = initialize({});
  assert.equal(state.theme, 'light');
  assert.equal(state.motionMode, 'full');
});
test('explicit dark theme survives reload, but legacy motion preferences do not', () => {
  const state = initialize({'portfolio-theme':'dark','portfolio-motion':'off','portfolio-animations':'off'});
  assert.equal(state.theme, 'dark');
  assert.equal(state.motionMode, 'full');
  assert.doesNotMatch(read('src/lib/runtime/page.js'), /localStorage/);
  assert.doesNotMatch(read('src/components/MotionProvider.tsx'), /localStorage/);
});
test('OS reduced-motion accessibility remains respected', () => {
  assert.equal(initialize({}, true).motionMode, 'reduced');
});
test('theme control is one accessible 44px button; footer contains no motion switch', () => {
  const component = read('src/components/ThemeToggle.tsx');
  assert.equal((component.match(/<button\b/g) || []).length, 1);
  assert.match(component, /aria-pressed=\{dark\}/);
  const rule = read('src/styles/dark-theme.css').match(/\.theme-toggle\s*\{([^}]+)\}/)[1];
  assert.match(rule, /\bwidth:\s*44px/);
  assert.match(rule, /\bheight:\s*44px/);
  assert.doesNotMatch(read('src/components/SiteFooter.tsx'), /motion-toggle|AnimationToggle|Animations:/);
});
