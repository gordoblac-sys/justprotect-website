/* V61: goal-first Explore navigation and private project outline. No network calls. */
(()=>{
 const dialog=document.getElementById('v44-navigator');if(!dialog)return;
 const lab=[...document.querySelectorAll('[data-v40-service]')],goalButtons=[...dialog.querySelectorAll('[data-v61-goal]')];
 const goalData={
  cinema:{name:'A better movie night',desc:'Start with the screen and the sound. Confirm wall construction, cable paths and listening positions before planning equipment.',keys:['tv','audio']},
  connected:{name:'A connected property',desc:'Consider the internet entry point and where wired connections should terminate. Mounting and routing depend on the site.',keys:['starlink','network']},
  smart:{name:'A smarter everyday space',desc:'Plan device locations, power, network stability and compatibility before choosing controls or cameras.',keys:['smart','network']},
  sound:{name:'Sound, thoughtfully placed',desc:'Consider speaker positions, room use and how audio and video sources will connect.',keys:['audio','tv']}
 };
 const services={tv:'TV & Home Theater',starlink:'Starlink Installation',network:'Networking & Wiring',smart:'Smart Home & Security',audio:'Audio & Video'};
 const routeName=document.getElementById('v61-route-name'),routeDesc=document.getElementById('v61-route-desc'),routeServices=document.getElementById('v61-route-services'),routeAdd=document.getElementById('v61-add-route');
 const chips=document.getElementById('v61-chips'),copy=document.getElementById('v61-copy'),status=document.getElementById('v61-copy-status'),state=document.getElementById('v44-state');
 let activeGoal=null;
 const selected=()=>lab.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service);
 function render(){
  const on=selected();chips.replaceChildren();
  if(!on.length){const el=document.createElement('span');el.className='v61-empty-selection';el.textContent='No services selected yet. Choose any specialty above.';chips.append(el);}
  else on.forEach(k=>{const b=document.createElement('button');b.type='button';b.className='v61-chip';b.setAttribute('aria-label','Remove '+services[k]+' from project');b.textContent=services[k]+' ';const x=document.createElement('span');x.textContent='×';x.setAttribute('aria-hidden','true');b.append(x);b.addEventListener('click',()=>{const target=lab.find(el=>el.dataset.v40Service===k);if(target?.getAttribute('aria-pressed')==='true')target.click();render();});chips.append(b);});
  copy.disabled=!on.length;
  const d=activeGoal&&goalData[activeGoal];routeName.textContent=d?d.name:'Start with any specialty';routeDesc.textContent=d?d.desc:'Pick a goal to see a useful two-service starting point, or add services individually below.';
  routeServices.replaceChildren();if(d)d.keys.forEach(k=>{const el=document.createElement('span');el.textContent=services[k]+(on.includes(k)?' ✓':'');routeServices.append(el);});
  routeAdd.hidden=!d;routeAdd.textContent=d&&d.keys.every(k=>on.includes(k))?'Both services are in your project ✓':'Add both to my project ↗';routeAdd.disabled=!!d&&d.keys.every(k=>on.includes(k));
  goalButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v61Goal===activeGoal)));
 }
 function setGoal(k){activeGoal=k;const d=goalData[k];if(!d){render();return;}const search=document.getElementById('v44-search');if(search.value){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));}dialog.querySelector('[data-v44-select="'+d.keys[0]+'"]')?.click();render();}
 goalButtons.forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.v61Goal;setGoal(activeGoal===k?null:k);}));
 routeAdd.addEventListener('click',()=>{const d=goalData[activeGoal];if(!d)return;d.keys.forEach(k=>{const b=lab.find(el=>el.dataset.v40Service===k);if(b?.getAttribute('aria-pressed')!=='true')b?.click();});render();status.textContent='Pair added. Your other services were kept.';});
 goalButtons.forEach(b=>b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const idx=goalButtons.indexOf(b);const next=e.key==='Home'?0:e.key==='End'?goalButtons.length-1:(idx+(e.key==='ArrowRight'?1:-1)+goalButtons.length)%goalButtons.length;goalButtons[next].focus();setGoal(goalButtons[next].dataset.v61Goal);}));
 dialog.addEventListener('keydown',e=>{if(!e.target.matches('[data-v44-select]')||!['Home','End'].includes(e.key))return;const visible=[...dialog.querySelectorAll('[data-v44-select]')].filter(b=>!b.closest('[hidden]'));if(!visible.length)return;e.preventDefault();const target=e.key==='Home'?visible[0]:visible[visible.length-1];target.focus();target.click();});
 async function copyText(t){if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(t);return true;}catch(e){}}const el=document.createElement('textarea');el.value=t;el.style.position='fixed';el.style.opacity='0';document.body.append(el);el.select();let ok=false;try{ok=document.execCommand('copy');}catch(e){}el.remove();return ok;}
 copy.addEventListener('click',async()=>{const on=selected();if(!on.length)return;const d=activeGoal&&goalData[activeGoal];const lines=['JUST PROTECT — PROJECT OUTLINE','',d?'Starting goal: '+d.name:'Starting goal: Not selected','Services:',...on.map((k,i)=>(i+1)+'. '+services[k]),'Project state: '+(state.value||'Not selected'),'', 'Planning outline only. No request has been submitted.','Service availability and scope require confirmation.'];const ok=await copyText(lines.join('\n'));status.textContent=ok?'Project outline copied.':'Copy unavailable in this browser.';});
 document.getElementById('v61-mobile-jump')?.addEventListener('click',()=>{dialog.querySelector('.v44-right')?.scrollIntoView({block:'start',behavior:'instant'});});
 document.getElementById('v61-mobile-back')?.addEventListener('click',()=>{dialog.querySelector('.v44-lead')?.scrollIntoView({block:'start',behavior:'instant'});});
 const observer=new MutationObserver(render);lab.forEach(b=>observer.observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 state.addEventListener('change',()=>{status.textContent='';render();});
 dialog.querySelectorAll('[data-v44-add]').forEach(b=>b.addEventListener('click',()=>{status.textContent='';queueMicrotask(render);}));
 document.getElementById('v44-explore')?.addEventListener('click',()=>{status.textContent='';render();});
 render();
})();
