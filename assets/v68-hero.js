/* V68 — existing V50 hero, one canonical project model, preview-only scene deep links.
   No analytics, persistence, automatic request or backend calls. */
(()=>{'use strict';
 const hero=document.querySelector('.v50-hero'),tabs=[...document.querySelectorAll('[data-v35-scene]')];
 if(!hero||tabs.length!==5)return;
 hero.classList.add('v68-hero');
 const catalog={entertainment:{key:'tv',name:'TV & theater'},connectivity:{key:'roughin',name:'Rough-In Wiring'},smart:{key:'smart',name:'Smart home / security'},network:{key:'network',name:'Networking'},audio:{key:'audio',name:'Audio / video'}};
 const lab=[...document.querySelectorAll('[data-v40-service]')];
 const current=()=>tabs.find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.v35Scene||'entertainment';
 const selected=()=>lab.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service);
 const state=()=>document.getElementById('v42-state')?.value||document.getElementById('v40-state')?.value||'';
 const message=hero.querySelector('.v35-message');
 const pulse=document.createElement('div');pulse.className='v68-pulse';pulse.setAttribute('aria-label','Current private project status');
 pulse.innerHTML='<div><span class="v68-pulse-label">YOUR PROJECT / PRIVATE UNTIL YOU SHARE</span><strong class="v68-pulse-status" id="v68-pulse-status">Start with a specialty</strong><span class="v68-pulse-meta" id="v68-pulse-meta">Five installation specialties · four service states</span></div><button type="button" class="v68-pulse-button" id="v68-open-plan">EDIT MY PLAN ↗</button>';
 message.querySelector('.v35-actions')?.after(pulse);
 const share=document.createElement('div');share.className='v68-share';share.innerHTML='<button type="button" id="v68-copy-concept">Copy this concept link ↗</button><small id="v68-share-status" role="status" aria-live="polite">Preview links do not share your private selections.</small>';
 pulse.after(share);
 const controls=document.createElement('div');controls.className='v68-stage-controls';controls.setAttribute('aria-label','Browse illustrated installation concepts');
 controls.innerHTML='<button type="button" id="v68-prev" aria-label="Previous installation concept">←</button><button type="button" id="v68-next" aria-label="Next installation concept">→</button>';
 hero.querySelector('.v35-scene-header')?.append(controls);
 const status=document.getElementById('v68-pulse-status'),meta=document.getElementById('v68-pulse-meta'),feedback=document.getElementById('v68-share-status');
 function sync(){const keys=selected(),s=state();
  status.textContent=keys.length?`${keys.length} ${keys.length===1?'service':'services'} in your project`:'Your project starts with an idea';
  meta.textContent=keys.length?`${keys.map(k=>({tv:'TV & theater',roughin:'Rough-In Wiring',network:'Networking',smart:'Smart home',audio:'Audio / video'}[k]||k)).join(' + ')} · ${s||'Choose a state'}`:'Choose a concept, then add services when you are ready.';
 }
 document.getElementById('v68-open-plan').addEventListener('click',()=>document.getElementById('v42-open')?.click());
 function advance(delta){const i=tabs.findIndex(t=>t.dataset.v35Scene===current());const next=tabs[(i+delta+tabs.length)%tabs.length];next.click();next.focus({preventScroll:true});const rail=next.parentElement;if(rail&&rail.scrollWidth>rail.clientWidth)rail.scrollLeft=next.offsetLeft-rail.offsetLeft;}
 document.getElementById('v68-prev').addEventListener('click',()=>advance(-1));
 document.getElementById('v68-next').addEventListener('click',()=>advance(1));
 tabs.forEach((tab,i)=>tab.addEventListener('keydown',event=>{
  if(event.key!=='Home'&&event.key!=='End')return;
  event.preventDefault();const next=tabs[event.key==='Home'?0:tabs.length-1];next.focus();next.click();
 }));
 function urlForScene(){const url=new URL(location.href);url.searchParams.set('scene',current());url.hash='home';return url.toString();}
 document.getElementById('v68-copy-concept').addEventListener('click',async()=>{
  const url=urlForScene();
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard not available');await navigator.clipboard.writeText(url);feedback.textContent='Concept preview link copied. No private project data included.';}
  catch(e){const input=document.createElement('input');input.type='text';input.value=url;input.setAttribute('aria-label','Concept preview URL to copy');input.style.cssText='position:fixed;left:10px;bottom:90px;width:min(90vw,500px);z-index:99999';document.body.append(input);input.select();feedback.textContent='Clipboard unavailable. The link is selected in the temporary field; copy it manually.';setTimeout(()=>input.remove(),15000);}
 });
 // Only a known concept changes the preview. Canonical selections and request data are untouched.
 const incoming=new URLSearchParams(location.search).get('scene');
 if(incoming&&Object.prototype.hasOwnProperty.call(catalog,incoming)){tabs.find(b=>b.dataset.v35Scene===incoming)?.click();}
 const countSource=document.getElementById('v42-dock-count');if(countSource)new MutationObserver(sync).observe(countSource,{childList:true,characterData:true,subtree:true});
 document.getElementById('v42-state')?.addEventListener('change',()=>queueMicrotask(sync));
 document.getElementById('v40-state')?.addEventListener('change',()=>queueMicrotask(sync));
 lab.forEach(b=>b.addEventListener('click',()=>queueMicrotask(sync)));
 sync();
})();
