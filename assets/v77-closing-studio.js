/* V77 — original footer Closing Studio. Canonical V40/V42 state only; no storage or sending. */
(()=>{'use strict';
 const root=document.getElementById('site-footer');if(!root)return;
 const controls=[...document.querySelectorAll('[data-v40-service]')];
 const state=document.getElementById('v40-state');
 const starterState=document.getElementById('v38-state');
 const count=document.getElementById('v77-footer-count');
 const place=document.getElementById('v77-footer-state');
 const meter=document.getElementById('v77-footer-meter');
 const fill=document.getElementById('v77-footer-meter-fill');
 const label=document.getElementById('v77-footer-readiness');
 const next=document.getElementById('v77-footer-primary');
 const mobile=document.getElementById('v77-mobile-ready');
 if(!controls.length||!state||!count||!place||!meter||!next)return;
 const selected=()=>controls.filter(b=>b.getAttribute('aria-pressed')==='true');
 const location=()=>state.value||starterState?.value||'';
 let pending=false;
 function render(){pending=false;
  const services=selected().length,where=location(),ready=Number(services>0)+Number(Boolean(where));
  count.innerHTML=String(services).padStart(2,'0')+' <small>SERVICES</small>';
  place.textContent=where||'NOT SELECTED';
  meter.setAttribute('aria-valuenow',String(ready));
  fill.style.width=(ready*50)+'%';
  label.textContent=ready+' OF 2 STARTER DETAILS';
  if(mobile)mobile.textContent=ready+' / 2 READY';
  next.innerHTML=(!services?'CHOOSE A SERVICE':!where?'CHOOSE A STATE':'REVIEW MY PROJECT')+' <span aria-hidden="true">↗</span>';
  next.setAttribute('aria-label',!services?'Go to original service choices':!where?'Go to original state choices':'Open original editable project workspace');
 }
 function queue(){if(pending)return;pending=true;queueMicrotask(render);}
 controls.forEach(b=>new MutationObserver(queue).observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 state.addEventListener('change',queue);starterState?.addEventListener('change',queue);
 document.querySelectorAll('[data-v49-state],[data-v49-service],[data-v52-pair]').forEach(b=>b.addEventListener('click',()=>queueMicrotask(queue)));
 next.addEventListener('click',()=>{
  if(!selected().length){document.querySelector('[data-v49-service]')?.focus();return;}
  if(!location()){document.querySelector('[data-v49-state]')?.focus();return;}
  document.getElementById('v49-workspace')?.click();
 });
 document.getElementById('v77-back-to-top')?.addEventListener('click',()=>{
  document.getElementById('home')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  document.querySelector('.brand[href="#home"]')?.focus({preventScroll:true});
 });
 render();
})();
