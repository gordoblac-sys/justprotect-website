/* V76 — Original V49/V52 Project Ticket: private live starter and contextual focus.
   Only reads the existing canonical V40/V42 controls. No new storage or transmissions. */
(()=>{'use strict';
 const root=document.querySelector('.v76-launch');if(!root)return;
 const lab=[...document.querySelectorAll('[data-v40-service]')];
 const state=document.getElementById('v40-state');
 const starterService=document.getElementById('v38-service');
 const starterState=document.getElementById('v38-state');
 const next=document.getElementById('v76-next');
 const chips=document.getElementById('v76-brief-chips');
 const guide=document.getElementById('v76-guide');
 const count=document.getElementById('v76-brief-services');
 const place=document.getElementById('v76-brief-state');
 const status=document.getElementById('v76-brief-status');
 const hint=document.getElementById('v76-next-hint');
 const artHint=document.getElementById('v76-art-hint');
 const fraction=document.getElementById('v76-ready-fraction');
 const meter=document.getElementById('v76-meter');
 const fill=document.getElementById('v76-meter-fill');
 if(!lab.length||!state||!next||!chips)return;
 const catalog={
  tv:{name:'TV & theater',value:'TV Mounting & Home Theater',guide:'services/tv-mounting.html'},
  starlink:{name:'Starlink',value:'Starlink Installation',guide:'services/starlink.html'},
  network:{name:'Networking',value:'Networking & Structured Wiring',guide:'services/networking.html'},
  smart:{name:'Smart home',value:'Smart Home & Security',guide:'services/smart-home-security.html'},
  audio:{name:'Audio / video',value:'Audio & Video Solutions',guide:'services/audio-video.html'}
 };
 const chosen=()=>lab.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service);
 const where=()=>state.value||starterState?.value||'';
 const servicePreview=()=>Object.keys(catalog).find(k=>catalog[k].value===starterService?.value)||'tv';
 let pending=false;
 function render(){pending=false;
  const selected=chosen(),location=where(),ready=Number(selected.length>0)+Number(Boolean(location));
  count.innerHTML=String(selected.length).padStart(2,'0')+' <small>/ 05</small>';
  place.textContent=location||'NOT SET';
  fraction.textContent=String(ready).padStart(2,'0')+' / 02';
  meter.setAttribute('aria-valuenow',String(ready));fill.style.width=(ready*50)+'%';
  status.textContent=ready===2?'READY TO REVIEW':ready===1?'IN PROGRESS':'NOT STARTED';
  status.dataset.ready=String(ready===2);
  const primary=selected[0]||servicePreview();guide.href=catalog[primary].guide;
  guide.textContent='READ '+catalog[primary].name.toUpperCase()+' GUIDE ↗';
  chips.replaceChildren();
  selected.forEach(key=>{
   const button=document.createElement('button');button.type='button';
   button.textContent=catalog[key].name+' ×';button.setAttribute('aria-label','Remove '+catalog[key].name+' from your project');
   button.addEventListener('click',()=>{const canonical=lab.find(b=>b.dataset.v40Service===key);if(canonical?.getAttribute('aria-pressed')==='true')canonical.click();queue();});
   chips.append(button);
  });
  if(!selected.length){next.textContent='CHOOSE A SERVICE ↗';hint.textContent='Select an installation specialty. Your choices stay private until you decide to share.';artHint.textContent='Choose an installation service to get started.';}
  else if(!location){next.textContent='CHOOSE YOUR STATE ↗';hint.textContent=selected.length+' service'+(selected.length===1?'':'s')+' selected. Choose Illinois, Indiana, Michigan or Ohio next.';artHint.textContent='Your services are in the editable plan. Add a project state to continue.';}
  else{next.textContent='REVIEW EDITABLE PROJECT ↗';hint.textContent='Your '+selected.length+' service'+(selected.length===1?' is':'s are')+' planned for '+location+'. Exact local availability and scope still need confirmation.';artHint.textContent='Starter ready for review. Nothing has been submitted.';}
 }
 function queue(){if(pending)return;pending=true;queueMicrotask(render);}
 next.addEventListener('click',()=>{
  if(!chosen().length){root.querySelector('[data-v49-service]')?.focus();return;}
  if(!where()){root.querySelector('[data-v49-state]')?.focus();return;}
  document.getElementById('v49-workspace')?.click();
 });
 // Preserve original V49 arrow-key selection behavior. New actions are ordinary
 // focusable controls, not another service-selection system.
 lab.forEach(b=>new MutationObserver(queue).observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 state.addEventListener('change',queue);starterState?.addEventListener('change',queue);
 starterService?.addEventListener('change',queue);
 root.querySelectorAll('[data-v49-service],[data-v49-state],[data-v52-pair]').forEach(b=>b.addEventListener('click',()=>queueMicrotask(queue)));
 render();
})();
