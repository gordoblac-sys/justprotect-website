/* V67 / Service Decision Desk. Preview state is in-page only; canonical V40 selection remains authoritative. */
(()=>{
 'use strict';
 const root=document.querySelector('.v67-service-desk');if(!root)return;
 const options={
  tv:{label:'TV & theater',full:'TV Mounting & Home Theater',points:['Screen height, viewing distance and seating','Wall material and suitable mounting approach','Power, device placement and concealed cable paths']},
  roughin:{label:'Rough-In Wiring',full:'Rough-In Wiring & Prewiring',points:['Possible sky visibility and cable pathway planning','Exterior entry route and weather protection','Router location, power and interior Wi-Fi needs']},
  network:{label:'Networking',full:'Networking & Structured Wiring',points:['Rooms needing wired ports or better Wi-Fi','Equipment location and cable pathways','Future network growth and access requirements']},
  smart:{label:'Smart home',full:'Smart Home & Security',points:['Which spaces and entry points matter most','Existing devices and desired integrations','Power, connectivity and equipment placement']},
  audio:{label:'Audio / video',full:'Audio & Video Solutions',points:['Listening zones and speaker locations','Source devices and equipment organization','Cable concealment and control preferences']}
 };
 const tabs=[...root.querySelectorAll('[data-v39-service]')];
 const canonical=[...document.querySelectorAll('[data-v40-service]')];
 const list=document.getElementById('v67-insight-list'),index=document.getElementById('v67-art-index');
 const toggle=document.getElementById('v67-toggle-service'),count=document.getElementById('v67-selection-count'),chips=document.getElementById('v67-selection-chips'),feedback=document.getElementById('v67-feedback');
 const copy=document.getElementById('v67-copy-link');
 let current='tv';
 function selected(key){return canonical.find(b=>b.dataset.v40Service===key)?.getAttribute('aria-pressed')==='true';}
 function active(){return canonical.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service).filter(k=>options[k]);}
 function render(){
  const item=options[current];if(!item)return;
  index.textContent=String(Object.keys(options).indexOf(current)+1).padStart(2,'0');
  list.replaceChildren(...item.points.map(point=>{const li=document.createElement('li');li.textContent=point;return li;}));
  const on=selected(current);toggle.setAttribute('aria-pressed',String(on));toggle.textContent=on?'✓ REMOVE FROM MY PROJECT':'+ ADD TO MY PROJECT';
  toggle.setAttribute('aria-label',(on?'Remove ':'Add ')+item.full+(on?' from':' to')+' my project');
  const keys=active();count.textContent=keys.length+' SELECTED';chips.replaceChildren();
  if(!keys.length){const empty=document.createElement('span');empty.textContent='Nothing selected yet — your choices stay local.';chips.append(empty);}
  keys.forEach(key=>{const btn=document.createElement('button');btn.type='button';btn.setAttribute('aria-label','Remove '+options[key].full+' from project');btn.textContent=options[key].label;const x=document.createElement('span');x.textContent='×';x.setAttribute('aria-hidden','true');btn.append(x);btn.addEventListener('click',()=>{const lab=canonical.find(b=>b.dataset.v40Service===key);if(lab?.getAttribute('aria-pressed')==='true')lab.click();feedback.textContent=options[key].label+' removed from your local project.';render();});chips.append(btn);});
 }
 tabs.forEach(tab=>{const sync=()=>{current=tab.dataset.v39Service;render();feedback.textContent='Previewing '+options[current].full+'. Nothing is sent.';};tab.addEventListener('click',sync);tab.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(e.key)){const on=tabs.find(b=>b.getAttribute('aria-selected')==='true');if(on){current=on.dataset.v39Service;render();}}});});
 toggle.addEventListener('click',()=>{const lab=canonical.find(b=>b.dataset.v40Service===current);if(!lab)return;lab.click();feedback.textContent=options[current].full+(selected(current)?' added to':' removed from')+' your local project. Nothing sent.';render();});
 canonical.forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(render)));
 // Synchronize selection changes initiated by the original wizard, Blueprint, Wayfinder and Casebook.
 const observer=new MutationObserver(()=>render());canonical.forEach(b=>observer.observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 document.getElementById('v67-open-project').addEventListener('click',()=>document.getElementById('v42-open')?.click());
 copy.addEventListener('click',async()=>{
  const url=new URL(location.href);url.searchParams.set('focus',current);url.hash='services';const link=url.toString();let success=false;
  try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(link);success=true;}}catch(_){}
  if(!success){const t=document.createElement('textarea');t.value=link;t.style.cssText='position:fixed;opacity:0;pointer-events:none';document.body.append(t);t.select();try{success=document.execCommand('copy');}catch(_){}t.remove();}
  feedback.textContent=success?'Service link copied. It only opens this preview; no project details are shared.':'Copy unavailable. Your browser may restrict clipboard access.';
 });
 const requested=new URLSearchParams(location.search).get('focus');if(requested&&Object.hasOwn(options,requested))tabs.find(t=>t.dataset.v39Service===requested)?.click();
 render();
})();
