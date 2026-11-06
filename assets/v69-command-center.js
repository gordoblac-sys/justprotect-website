/* V69 / Project Command Center: reorganize the original V42 workspace + V57 blueprint.
   No new storage, project model, request form, transmission, or homepage section. */
(()=>{'use strict';
 const overlay=document.getElementById('v42-overlay'),panel=document.getElementById('v42-panel');
 const main=panel?.querySelector('.v42-panel-main'),steps=panel?.querySelector('.v42-steps');
 const hero=panel?.querySelector('.v57-hero'),brief=panel?.querySelector('.v42-brief');
 if(!overlay||!panel||!main||!steps||!hero||!brief||panel.querySelector('.v69-rail'))return;
 const rail=document.createElement('div');rail.className='v69-rail';rail.setAttribute('aria-label','Project navigation and readiness');
 rail.innerHTML='<div class="v69-rail-top"><span class="v69-rail-kicker">PROJECT / COMMAND CENTER</span><span id="v69-ready-count" class="v69-ready-count">0 OF 2 READY</span></div><nav class="v69-nav" aria-label="Jump to project editing area"><button type="button" data-v69-target="services" aria-current="step">Services</button><button type="button" data-v69-target="priorities">Priorities</button><button type="button" data-v69-target="location">Location</button><button type="button" data-v69-target="review">Review</button></nav>';
 const next=document.createElement('button');next.type='button';next.className='v69-next';next.id='v69-next';next.innerHTML='<span id="v69-next-label">CHOOSE YOUR SERVICES</span><span aria-hidden="true">↗</span>';
 const status=document.createElement('p');status.className='v69-status';status.id='v69-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent='Your selections stay on this page until you deliberately share them.';
 rail.append(brief,next,status);steps.after(rail);
 const targets={services:main.querySelector('.v42-services'),priorities:main.querySelector('.v57-priorities'),location:main.querySelector('.v42-location'),review:main.querySelector('.v42-panel-actions')};
 const nav=[...rail.querySelectorAll('[data-v69-target]')];
 const canonical=[...document.querySelectorAll('[data-v40-service]')],state=document.getElementById('v42-state');
 let lastScroll=0,selectedArea='services',lastReadiness='';
 function jump(key){const target=targets[key];if(!target)return;selectedArea=key;
  nav.forEach(b=>{if(b.dataset.v69Target===key)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  const mobile=matchMedia('(max-width:760px)').matches;
  if(mobile){target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
  else main.scrollTo({top:Math.max(0,target.offsetTop-main.offsetTop-18),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
 }
 nav.forEach((button,i)=>{button.addEventListener('click',()=>jump(button.dataset.v69Target));button.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();
  const index=e.key==='Home'?0:e.key==='End'?nav.length-1:(i+(e.key==='ArrowRight'?1:-1)+nav.length)%nav.length;
  nav[index].focus();
 });});
 function sync(){const n=canonical.filter(b=>b.getAttribute('aria-pressed')==='true').length;
  const region=state?.value||document.getElementById('v40-state')?.value||'';
  const ready=(n>0?1:0)+(region?1:0);rail.querySelector('#v69-ready-count').textContent=ready+' OF 2 READY';
  const nextKey=!n?'services':!region?'location':'review';next.dataset.target=nextKey;
  rail.querySelector('#v69-next-label').textContent=!n?'CHOOSE YOUR SERVICES':!region?'CHOOSE YOUR PROJECT STATE':'REVIEW YOUR PROJECT REQUEST';
  const message=!n?'Choose one or more specialties to begin.':!region?n+' '+(n===1?'service':'services')+' selected. Add a project state next.':'Ready to review — '+n+' '+(n===1?'service':'services')+' in '+region+'. Nothing has been sent.';
  if(message!==lastReadiness){status.textContent=message;lastReadiness=message;}
 }
 next.addEventListener('click',()=>jump(next.dataset.target||'services'));
 const observer=new MutationObserver(()=>sync());canonical.forEach(b=>observer.observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 state?.addEventListener('change',sync);document.getElementById('v40-state')?.addEventListener('change',sync);
 document.getElementById('v42-open')?.addEventListener('click',()=>{requestAnimationFrame(()=>{main.scrollTop=lastScroll;sync();});});
 for(const id of ['v42-close','v42-backdrop'])document.getElementById(id)?.addEventListener('click',()=>{lastScroll=main.scrollTop;});
 overlay.addEventListener('keydown',e=>{if(e.key==='Escape')lastScroll=main.scrollTop;});
 main.addEventListener('scroll',()=>{if(overlay.hidden)return;lastScroll=main.scrollTop;const pos=main.scrollTop+70;
  let current='services';for(const key of ['services','priorities','location','review']){const el=targets[key];if(el&&el.offsetTop-main.offsetTop<=pos)current=key;}
  if(current!==selectedArea){selectedArea=current;nav.forEach(b=>{if(b.dataset.v69Target===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});}
 },{passive:true});
 overlay.classList.add('v69-ready');sync();
})();
