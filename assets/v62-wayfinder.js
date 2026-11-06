/* V62 Wayfinder. Private local-only project navigation; no new data storage or network calls. */
(()=>{'use strict';
 const toggle=document.getElementById('v62-services-toggle');
 const panel=document.getElementById('v62-services-panel');
 const status=document.getElementById('v62-menu-status');
 const lab=[...document.querySelectorAll('[data-v40-service]')];
 if(!toggle||!panel||!lab.length)return;
 const buttons=[...panel.querySelectorAll('[data-v62-add]')];
 const badge=document.getElementById('v62-nav-badge');
 const ctaCount=document.getElementById('v62-cta-count');
 const menuCount=document.getElementById('v62-menu-count');
 const selected=()=>lab.filter(b=>b.getAttribute('aria-pressed')==='true');
 const refresh=()=>{
  const active=new Set(selected().map(b=>b.dataset.v40Service));
  const count=active.size;
  if(badge)badge.textContent=String(count);
  if(ctaCount)ctaCount.textContent=String(count);
  if(menuCount)menuCount.textContent=String(count);
  toggle.setAttribute('aria-label',`Browse services. ${count} selected in your private project.`);
  buttons.forEach(b=>{const added=active.has(b.dataset.v62Add);b.dataset.v62Selected=String(added);b.textContent=added?'Added to project ✓':'+ Add to project';b.setAttribute('aria-label',`${added?'Already added':'Add'} ${b.dataset.v62Name} ${added?'to':'to'} your project`);});
 };
 const close=(restore=false)=>{if(panel.hidden)return;panel.hidden=true;toggle.setAttribute('aria-expanded','false');if(restore)toggle.focus();};
 const open=()=>{panel.hidden=false;toggle.setAttribute('aria-expanded','true');refresh();};
 toggle.addEventListener('click',()=>panel.hidden?open():close(true));
 buttons.forEach(b=>b.addEventListener('click',()=>{
  const control=lab.find(el=>el.dataset.v40Service===b.dataset.v62Add);
  if(!control)return;
  if(control.getAttribute('aria-pressed')!=='true')control.click();
  refresh();status.textContent=`${b.dataset.v62Name} is in your private project. Nothing has been sent.`;
 }));
 panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>close()));
 panel.querySelector('#v62-workspace')?.addEventListener('click',()=>{close();document.getElementById('v42-open')?.click();});
 panel.querySelector('#v62-request')?.addEventListener('click',()=>{close();if(typeof window.openWizard==='function')window.openWizard();});
 panel.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();close(true);return;}
  if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
  if(e.target.matches('input,textarea,select'))return;
  const items=[...panel.querySelectorAll('a,button:not([disabled])')].filter(el=>el.getClientRects().length);
  const index=items.indexOf(document.activeElement);
  if(index<0)return;
  e.preventDefault();
  const next=e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;
  items[next].focus();
 });
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!panel.hidden){close(true);return;}const explorer=document.getElementById('v44-navigator');if(explorer&&!explorer.hidden&&!explorer.contains(document.activeElement))document.getElementById('v44-close')?.click();});
 document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!toggle.contains(e.target))close();});
 const observer=new MutationObserver(refresh);
 lab.forEach(b=>observer.observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 refresh();
 const fill=document.getElementById('v62-scroll-fill');
 if(fill){let queued=false;const update=()=>{queued=false;const d=document.documentElement;const max=Math.max(0,d.scrollHeight-innerHeight);fill.style.width=(max?Math.min(100,Math.max(0,scrollY/max*100)):0)+'%';};const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);update();}
})();
