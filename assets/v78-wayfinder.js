/* V78 Wayfinder Studio: a visual/searchable VIEW of the existing V62 five cards.
   Canonical service changes delegate to original V62 -> V40 controls; no new storage. */
(()=>{'use strict';
 const panel=document.getElementById('v62-services-panel');
 const toggle=document.getElementById('v62-services-toggle');
 const search=document.getElementById('v78-search');
 const all=document.getElementById('v78-filter-all');
 const chosen=document.getElementById('v78-filter-selected');
 const count=document.getElementById('v78-results');
 const filterCount=document.getElementById('v78-filter-count');
 const empty=document.getElementById('v78-empty');
 const clear=document.getElementById('v78-clear');
 const image=document.getElementById('v78-stage-image');
 const number=document.getElementById('v78-stage-number');
 const state=document.getElementById('v78-stage-state');
 const title=document.getElementById('v78-spotlight-title');
 const description=document.getElementById('v78-stage-description');
 const checks=document.getElementById('v78-stage-checks');
 const guide=document.getElementById('v78-spotlight-guide');
 const add=document.getElementById('v78-spotlight-add');
 const lab=[...document.querySelectorAll('[data-v40-service]')];
 if(!panel||!toggle||!search||!lab.length)return;
 const catalog=[
  {key:'tv',name:'TV & theater',number:'01',image:'scene-entertainment.svg',alt:'Illustrated TV and theater installation concept',guide:'tv-mounting.html',description:'Plan the screen location, wall surface and clean cable path before mounting.',checks:['Viewing height and distance','Wall material and mount location','Power and cable routing'],terms:'television mounting home theater screen tv cables'},
  {key:'starlink',name:'Starlink',number:'02',image:'scene-connectivity.svg',alt:'Illustrated Starlink equipment and cable routing concept',guide:'starlink.html',description:'Consider exterior placement, clear sky and a practical path inside.',checks:['Potential sky obstructions','Safe mounting position','Cable entry and weather protection'],terms:'satellite internet dish roof exterior connectivity'},
  {key:'network',name:'Networking',number:'03',image:'scene-network.svg',alt:'Illustrated structured network and wiring concept',guide:'networking.html',description:'Map wired endpoints and wireless coverage around the spaces that matter.',checks:['Device and workstation locations','Cable pathways and access','Network equipment placement'],terms:'wifi ethernet structured wiring data cable internet'},
  {key:'smart',name:'Smart home',number:'04',image:'scene-smart.svg',alt:'Illustrated smart home and security device concept',guide:'smart-home-security.html',description:'Identify priority rooms, devices and power or connectivity needs.',checks:['Device placement and purpose','Power and network requirements','Compatibility and control preferences'],terms:'security cameras sensors automation locks connected devices'},
  {key:'audio',name:'Audio / video',number:'05',image:'scene-audio.svg',alt:'Illustrated audio video media installation concept',guide:'audio-video.html',description:'Think through listening zones, source equipment and discreet wiring.',checks:['Listening and viewing zones','Equipment and source locations','Speaker and signal cable routes'],terms:'speakers surround sound media receiver av sound'}
 ];
 const cards=[...panel.querySelectorAll('.v62-menu-card')];
 const buttons=[...panel.querySelectorAll('[data-v78-preview]')];
 let active='tv';let selectedOnly=false;
 const selected=key=>lab.some(b=>b.dataset.v40Service===key&&b.getAttribute('aria-pressed')==='true');
 function spotlight(){
  const item=catalog.find(x=>x.key===active)||catalog[0];const isAdded=selected(item.key);
  image.src='assets/'+item.image;image.alt=item.alt;number.textContent=item.number+' / 05';
  title.textContent=item.name.toUpperCase();const dot=document.createElement('span');dot.textContent='.';title.append(dot);
  description.textContent=item.description;
  checks.replaceChildren(...item.checks.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));
  guide.href='services/'+item.guide;guide.setAttribute('aria-label','Read '+item.name+' installation guide');
  state.textContent=isAdded?'IN YOUR PRIVATE PROJECT':'NOT YET IN PROJECT';state.dataset.added=String(isAdded);
  add.textContent=isAdded?'IN PROJECT ✓':' + ADD TO MY PROJECT';add.dataset.added=String(isAdded);
  add.setAttribute('aria-label',isAdded?item.name+' is already in your private project':'Add '+item.name+' to your private project');
  cards.forEach(c=>c.dataset.v78Active=String(c.querySelector('[data-v62-add]')?.dataset.v62Add===item.key));
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v78Preview===item.key)));
 }
 function filter(){
  const q=search.value.trim().toLowerCase();const chosenCount=catalog.filter(c=>selected(c.key)).length;
  filterCount.textContent=String(chosenCount);
  let visible=0;let first=null;
  cards.forEach(card=>{
   const key=card.querySelector('[data-v62-add]')?.dataset.v62Add;
   const item=catalog.find(c=>c.key===key);if(!item)return;
   const matches=(!selectedOnly||selected(key))&&(!q||(item.name+' '+item.description+' '+item.terms).toLowerCase().includes(q));
   card.hidden=!matches;if(matches){visible++;first??=key;}
  });
  count.textContent=visible+' OF 5 SERVICES';empty.hidden=visible!==0;
  document.getElementById('v78-spotlight').hidden=visible===0;
  if(first&&!cards.some(c=>c.dataset.v78Active==='true'&&!c.hidden))active=first;
  spotlight();
 }
 function choose(key){active=key;spotlight();}
 buttons.forEach((b,i)=>{
  b.addEventListener('click',()=>choose(b.dataset.v78Preview));
  b.addEventListener('focus',()=>choose(b.dataset.v78Preview));
  b.addEventListener('keydown',e=>{
   if(!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
   e.preventDefault();e.stopPropagation();
   const visible=buttons.filter(el=>!el.closest('.v62-menu-card').hidden);if(!visible.length)return;
   const pos=visible.indexOf(b);const next=e.key==='Home'?0:e.key==='End'?visible.length-1:(pos+(e.key==='ArrowDown'?1:-1)+visible.length)%visible.length;
   visible[next].focus();
  });
  b.closest('.v62-menu-card')?.addEventListener('pointerenter',()=>{if(!b.closest('.v62-menu-card').hidden)choose(b.dataset.v78Preview);});
 });
 // Preserve the original V62 Home/End destinations when navigating its original controls.
 // Preview buttons have their own focus-only roving behavior; text inputs retain native Home/End.
 panel.addEventListener('keydown',e=>{
  if(!['Home','End'].includes(e.key)||e.target.matches('input,textarea,select,[data-v78-preview]'))return;
  const destination=e.key==='Home'?panel.querySelector('.v62-menu-copy a'):document.getElementById('v62-request');
  if(destination){e.preventDefault();e.stopImmediatePropagation();destination.focus();}
 },true);
 search.addEventListener('input',filter);
 function setMode(next){selectedOnly=next;all.setAttribute('aria-pressed',String(!next));chosen.setAttribute('aria-pressed',String(next));filter();}
 all.addEventListener('click',()=>setMode(false));chosen.addEventListener('click',()=>setMode(true));
 clear.addEventListener('click',()=>{search.value='';setMode(false);search.focus();});
 add.addEventListener('click',()=>{
  const b=panel.querySelector('[data-v62-add="'+active+'"]');if(!b)return;
  b.click();filter();
 });
 panel.querySelectorAll('[data-v62-add]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(filter)));
 const observer=new MutationObserver(()=>{if(!panel.hidden)filter();});
 lab.forEach(b=>observer.observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 toggle.addEventListener('click',()=>{if(!panel.hidden){filter();if(innerWidth>750)search.focus();}});
 filter();
})();
