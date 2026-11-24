import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createFallbackMotion } from '../src/lib/runtime/animation/fallback.js';
const read = path => readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
function fixture(reducedMotion) {
  const calls=[];
  let intersect, observed=0, disconnected=false;
  const element={matches:()=>false,animate(frames,options){const a={frames,options,canceled:false,cancel(){this.canceled=true}};calls.push(a);return a;}};
  const win={IntersectionObserver:class { constructor(callback){intersect=callback} observe(){observed++} disconnect(){disconnected=true} },getComputedStyle:()=>({display:'block'}),removeEventListener(){},cancelAnimationFrame(){}};
  const doc={nodeType:9,defaultView:win,documentElement:{dataset:{}}};
  const root={nodeType:1,ownerDocument:doc,querySelectorAll:()=>[element]};
  const runtime=createFallbackMotion({root,reducedMotion});
  return {runtime,element,calls,doc,get observed(){return observed},get disconnected(){return disconnected},emit(isIntersecting){intersect([{target:element,isIntersecting}])}};
}
test('native entrances replay on re-entry and leave content visible after cleanup',()=>{
 const f=fixture(false);assert.equal(f.observed,1);f.emit(true);assert.equal(f.calls.length,1);assert.equal(f.calls[0].frames[0].translate,'0 26px');assert.equal(f.calls[0].options.fill,'none');f.emit(true);assert.equal(f.calls.length,1);f.emit(false);f.emit(true);assert.equal(f.calls.length,2);assert.equal(f.calls[0].canceled,true);f.runtime.destroy();assert.equal(f.calls[1].canceled,true);assert.equal(f.disconnected,true);assert.equal(f.doc.documentElement.dataset.nativeReveals,undefined);
});
test('reduced-motion retains gentle opacity-only entrances',()=>{
 const f=fixture(true);f.emit(true);assert.deepEqual(f.calls[0].frames,[{opacity:.82},{opacity:1}]);assert.equal(f.calls[0].options.duration,190);f.runtime.destroy();
});
test('theme changes retain the motion engine and use color-only transitions',()=>{
 assert.match(read('src/lib/runtime/page.js'),/listen\(window, "themestatuschange", requestScrollUpdate\)/);
 const css=read('src/styles/motion-spacing.css');assert.match(css,/--theme-duration:\s*420ms/);assert.match(css,/transition-property: background-color,color,border-color,box-shadow,outline-color/);
 assert.match(read('src/components/ThemeToggle.tsx'),/dataset.themeTransitioning/);
});
test('section spacing is bounded and Process retains a final-frame height',()=>{
 const css=read('src/styles/motion-spacing.css');assert.match(css,/--section-space:\s*clamp\(56px, 5.4vw, 84px\)/);assert.match(css,/process-stage:last-child\s*\{ min-height: calc\(var\(--process-panel-height\) \+ 12px\)/);assert.match(css,/html\[data-motion-mode="reduced"\] \.home-page \.process-mini\s*\{[^}]*display: flex/);
});
