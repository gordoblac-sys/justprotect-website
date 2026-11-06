/* V75 Blueprint Theater: all mutations delegate to original V40/V41 canonical controls.
   No new persistence, transmission, route planning, or installation feasibility claims. */
(()=>{
 'use strict';
 const root=document.getElementById('toolkit');if(!root)return;
 root.classList.add('v75-blueprint');
 const roomBtns=[...root.querySelectorAll('[data-v40-room]')],serviceBtns=[...root.querySelectorAll('[data-v40-service]')];
 const note=document.getElementById('v75-room-note'),chips=document.getElementById('v75-scope-chips'),counter=document.getElementById('v75-scope-count');
 const next=document.getElementById('v75-live-next'),state=document.getElementById('v40-state'),map=document.getElementById('v75-enlarge'),toMap=document.getElementById('v75-to-map');
 const canvas=root.querySelector('.v40-canvas');
 const names={tv:'TV & theater',starlink:'Starlink',network:'Networking',smart:'Smart home',audio:'Audio / video'};
 const roomCopy={living:'Living room concept · Consider viewing angles, accessible power, and discreet cable routes.',office:'Office / studio concept · Think about workstations, equipment power, and future network capacity.',property:'Whole-property concept · Consider building access, cable entry points, and exterior mounting restrictions.'};
 const arts={
 living:'<path d="M12 40h76M17 32h66v15H17zM25 22h50v10H25zM21 49v8m58-8v8"/>',
 office:'<path d="M12 30h76v7H12zM20 37v20m60-20v20M35 10h31v18H35zM50 28v8m-12 0h25"/>',
 property:'<path d="M10 31L50 7l40 24M18 28v31h64V28M44 59V39h15v20M26 38h12v12H26zM65 38h11v12H65z"/>'
 };
 roomBtns.forEach(b=>{
  const art=document.createElement('span');art.className='v75-room-art';art.setAttribute('aria-hidden','true');
  art.innerHTML='<svg viewBox="0 0 100 68" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+arts[b.dataset.v40Room]+'</svg>';
  b.prepend(art);
 });
 function selected(){return serviceBtns.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service)}
 function activeRoom(){return roomBtns.find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.v40Room||'living'}
 function render(){
  const keys=selected(),room=activeRoom();note.textContent=roomCopy[room];
  counter.textContent=String(keys.length).padStart(2,'0')+' / 05';
  chips.replaceChildren();
  if(!keys.length){const span=document.createElement('span');span.className='v75-no-services';span.textContent='Select any specialty above to build your concept.';chips.appendChild(span)}
  keys.forEach(key=>{
   const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Remove '+names[key]+' from this concept');
   b.textContent=names[key];const x=document.createElement('span');x.textContent='×';x.setAttribute('aria-hidden','true');b.appendChild(x);
   b.addEventListener('click',()=>{serviceBtns.find(e=>e.dataset.v40Service===key)?.click();requestAnimationFrame(()=>{(chips.querySelector('button')||document.getElementById('v40-reset'))?.focus();});});chips.appendChild(b);
  });
  next.textContent=!keys.length?'NEXT / Choose an installation specialty to begin.':!state.value?'NEXT / Select your project state below, or keep exploring this conceptual room.':'READY TO CONTINUE / Review the concept or open the existing editable request. Nothing is sent automatically.';
 }
 // Focus-only keyboard navigation: the native button's Enter/Space activation still chooses a room/service.
 for(const group of [roomBtns,serviceBtns]){
  group.forEach((button,index)=>button.addEventListener('keydown',e=>{
   if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
   e.preventDefault();const step=(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:1;
   const i=e.key==='Home'?0:e.key==='End'?group.length-1:(index+step+group.length)%group.length;
   group[i].focus();
  }));
 }
 let focusReturn=null;
 function expand(on){
  if(on===root.classList.contains('v75-expanded'))return;
  root.classList.toggle('v75-expanded',on);document.body.classList.toggle('v75-map-open',on);
  map.setAttribute('aria-pressed',String(on));map.textContent=on?'× CLOSE FULL VIEW':'⤢ EXPAND VIEW';
  if(on){focusReturn=document.activeElement;map.focus();}else{(focusReturn?.isConnected?focusReturn:map).focus();focusReturn=null;}
 }
 map.addEventListener('click',()=>expand(!root.classList.contains('v75-expanded')));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('v75-expanded')){e.preventDefault();e.stopPropagation();expand(false)}},true);
 toMap.addEventListener('click',()=>{canvas.scrollIntoView({block:'start',behavior:'instant'});map.focus();});
 state.addEventListener('change',render);
 const observer=new MutationObserver(()=>requestAnimationFrame(render));
 [...roomBtns,...serviceBtns].forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['aria-pressed']}));
 [...roomBtns,...serviceBtns,...root.querySelectorAll('[data-v41-preset]'),document.getElementById('v40-reset')].filter(Boolean).forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(render)));
 render();
})();
