/* V80 / Compass Field Deck. A visual enhancement of the existing V44/V61
   Explore dialog. No independent selection model, persistence, or transmission. */
(()=>{'use strict';
 const dialog=document.getElementById('v44-navigator');
 const route=document.getElementById('v61-route');
 const desc=document.getElementById('v61-route-desc');
 const goalButtons=[...document.querySelectorAll('[data-v61-goal]')];
 const canonical=[...document.querySelectorAll('[data-v40-service]')];
 if(!dialog||!route||!desc||goalButtons.length!==4||canonical.length!==5)return;
 const catalog={
  tv:{name:'TV & home theater',image:'scene-entertainment.svg',guide:'tv-mounting.html'},
  roughin:{name:'rough-in wiring and prewiring',image:'scene-rough-in.svg',guide:'roughin.html'},
  network:{name:'Networking & wiring',image:'scene-network.svg',guide:'networking.html'},
  smart:{name:'Smart home & security',image:'scene-smart.svg',guide:'smart-home-security.html'},
  audio:{name:'Audio & video',image:'scene-audio.svg',guide:'audio-video.html'}
 };
 const routes={
  cinema:{image:'scene-entertainment.svg',keys:['tv','audio']},
  connected:{image:'scene-rough-in.svg',keys:['roughin','network']},
  smart:{image:'scene-smart.svg',keys:['smart','network']},
  sound:{image:'scene-audio.svg',keys:['audio','tv']}
 };
 goalButtons.forEach(button=>{
  const route=routes[button.dataset.v61Goal];
  const img=document.createElement('img');img.className='v80-goal-image';img.src='assets/'+route.image;
  img.alt='';img.setAttribute('aria-hidden','true');img.loading='lazy';
  button.insertBefore(img,button.firstChild);
 });
 const stage=document.createElement('div');stage.className='v80-pair-stage';stage.id='v80-pair-stage';stage.hidden=true;
 stage.innerHTML='<div class="v80-pair-top"><strong>PAIR READINESS / PRIVATE PROJECT</strong><span id="v80-pair-count">0 / 2</span></div><div class="v80-pair-meter" id="v80-pair-meter" role="progressbar" aria-label="Suggested services already in project" aria-valuemin="0" aria-valuemax="2" aria-valuenow="0"><span id="v80-pair-fill"></span></div><div class="v80-pair-cards" id="v80-pair-cards"></div><p class="v80-pair-caption">Illustrated planning concepts only. Previewing a service does not add it; availability and scope require confirmation.</p>';
 desc.insertAdjacentElement('afterend',stage);
 const cards=stage.querySelector('#v80-pair-cards');
 const count=stage.querySelector('#v80-pair-count');
 const meter=stage.querySelector('#v80-pair-meter');
 const fill=stage.querySelector('#v80-pair-fill');
 let active=null;
 function isSelected(key){return canonical.some(b=>b.dataset.v40Service===key&&b.getAttribute('aria-pressed')==='true');}
 function card(key,index){
  const item=catalog[key],on=isSelected(key);
  const article=document.createElement('article');article.className='v80-pair-card';article.dataset.inProject=String(on);
  const art=document.createElement('div');art.className='v80-pair-art';
  const image=document.createElement('img');image.src='assets/'+item.image;image.alt='Illustrated '+item.name+' concept';image.loading='lazy';
  const status=document.createElement('span');status.textContent=on?'IN YOUR PROJECT':'TO CONSIDER';
  art.append(image,status);
  const body=document.createElement('div');body.className='v80-pair-body';
  const heading=document.createElement('strong');heading.textContent=String(index+1).padStart(2,'0')+' / '+item.name;
  const actions=document.createElement('div');actions.className='v80-pair-actions';
  const preview=document.createElement('button');preview.type='button';preview.dataset.v80Preview=key;preview.textContent='Preview ↗';preview.setAttribute('aria-label','Preview '+item.name+' without adding it');
  const guide=document.createElement('a');guide.href='services/'+item.guide;guide.textContent='Guide ↗';guide.setAttribute('aria-label','Read '+item.name+' installation guide');guide.setAttribute('data-v44-link','');
  actions.append(preview,guide);body.append(heading,actions);article.append(art,body);return article;
 }
 function render(){
  const selectedGoal=goalButtons.find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.v61Goal||null;
  if(!selectedGoal){active=null;stage.hidden=true;cards.replaceChildren();return;}
  const route=routes[selectedGoal];if(!route)return;
  const added=route.keys.filter(isSelected).length;
  const goalChanged=selectedGoal!==active;active=selectedGoal;
  // Rebuild only when a goal or canonical selection changes, never while a user
  // is typing, and restore focus if the focused Preview button is replaced.
  const focusKey=cards.contains(document.activeElement)?document.activeElement.dataset.v80Preview:null;
  cards.replaceChildren(...route.keys.map(card));
  count.textContent=added+' / 2 IN PROJECT';meter.setAttribute('aria-valuenow',String(added));
  fill.style.width=(added/2*100)+'%';stage.hidden=false;
  if(focusKey){cards.querySelector('[data-v80-preview="'+focusKey+'"]')?.focus({preventScroll:true});}
  if(goalChanged){stage.dataset.goal=selectedGoal;}
 }
 cards.addEventListener('click',e=>{
  const button=e.target.closest('[data-v80-preview]');if(!button)return;
  const target=dialog.querySelector('[data-v44-select="'+button.dataset.v80Preview+'"]');
  if(!target)return;
  const search=document.getElementById('v44-search');
  if(search?.value){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));}
  target.click(); // Existing V44 preview only; never the V44 Add control.
  if(innerWidth<=750){dialog.querySelector('.v44-scene')?.scrollIntoView({block:'center',behavior:'instant'});}
 });
 cards.addEventListener('keydown',e=>{
  if(!e.target.matches('[data-v80-preview]')||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();e.stopPropagation();
  const buttons=[...cards.querySelectorAll('[data-v80-preview]')];
  const index=buttons.indexOf(e.target);
  const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
  buttons[next]?.focus(); // Focus-only; no canonical selection or preview change.
 });
 const observer=new MutationObserver(render);
 [...goalButtons,...canonical].forEach(button=>observer.observe(button,{attributes:true,attributeFilter:['aria-pressed']}));
 document.getElementById('v44-explore')?.addEventListener('click',()=>requestAnimationFrame(render));
 render();
})();
