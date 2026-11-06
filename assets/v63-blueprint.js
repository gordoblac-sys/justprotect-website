/* V63 / Local Blueprint Experience. Original V40/V41 buttons remain canonical.
   Viewing an inspector or route never adds a service or transmits information. */
(()=>{
 'use strict';
 const root=document.getElementById('toolkit');if(!root)return;
 const catalog={
  tv:{title:'PLACE THE SCREEN WITH INTENTION.',label:'TV & theater',category:'01 / ENTERTAINMENT',img:'scene-entertainment.svg',alt:'Original TV and theater installation concept illustration',guide:'services/tv-mounting.html',question:'Where will power and signal cables run?',detail:'Consider wall material, mounting height and equipment location.'},
  roughin:{title:'FIND THE RIGHT CONNECTION.',label:'Rough-In Wiring',category:'02 / CONNECTIVITY',img:'scene-rough-in.svg',alt:'Original Rough-In Wiring connection concept illustration',guide:'services/rough-in-wiring.html',question:'Where could an unobstructed sky view be assessed?',detail:'Discuss access, mounting constraints and an exterior cable entry.'},
  network:{title:'PLAN THE INVISIBLE BACKBONE.',label:'Networking',category:'03 / INFRASTRUCTURE',img:'scene-network.svg',alt:'Original network cabinet concept illustration',guide:'services/networking.html',question:'Which rooms need reliable wired or wireless coverage?',detail:'Consider equipment location, data drops and future expansion.'},
  smart:{title:'PUT CONTROL WHERE IT COUNTS.',label:'Smart home & security',category:'04 / CONNECTED LIVING',img:'scene-smart.svg',alt:'Original connected smart home concept illustration',guide:'services/smart-home-security.html',question:'Which entry points, devices and controls matter most?',detail:'Discuss existing equipment and power/network access.'},
  audio:{title:'LET THE ROOM SET THE SOUND.',label:'Audio / video',category:'05 / SOUND',img:'scene-audio.svg',alt:'Original speaker and audio concept illustration',guide:'services/audio-video.html',question:'Where should speakers and listening zones be located?',detail:'Consider component placement, wiring and concealment.'}
 };
 const rooms={living:{name:'LIVING ROOM',tip:'Think about seating, screen sightlines and visible cable routes.'},office:{name:'OFFICE / STUDIO',tip:'Consider desks, power, workstations and future equipment.'},property:{name:'WHOLE PROPERTY',tip:'Discuss building access, cable pathways and exterior restrictions.'}};
 const keys=Object.keys(catalog),buttons=[...root.querySelectorAll('[data-v63-focus]')];
 const labButtons=[...root.querySelectorAll('[data-v40-service]')],roomButtons=[...root.querySelectorAll('[data-v40-room]')];
 const markers=[...root.querySelectorAll('[data-v40-marker]')];
 const nodes={image:document.getElementById('v63-focus-image'),title:document.getElementById('v63-focus-title'),question:document.getElementById('v63-focus-question'),tip:document.getElementById('v63-room-tip'),category:document.getElementById('v63-focus-category'),guide:document.getElementById('v63-focus-guide'),add:document.getElementById('v63-focus-add'),copy:document.getElementById('v63-focus-copy'),index:document.getElementById('v63-inspector-index'),status:document.getElementById('v63-status'),paths:document.getElementById('v63-paths-layer'),room:document.getElementById('v63-view-room'),routes:document.getElementById('v63-view-paths'),count:document.getElementById('v63-route-count'),lens:document.getElementById('v63-lens-name')};
 let focus='tv',mode='room';
 const selected=()=>labButtons.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service);
 const currentRoom=()=>roomButtons.find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.v40Room||'living';
 const announce=s=>{nodes.status.textContent=s};
 function render(){
  const item=catalog[focus],r=rooms[currentRoom()],chosen=selected();
  buttons.forEach(b=>{const on=b.dataset.v63Focus===focus;b.setAttribute('aria-pressed',String(on));b.tabIndex=on?0:-1});
  nodes.image.src='assets/'+item.img;nodes.image.alt=item.alt;
  nodes.title.textContent=item.title;nodes.question.textContent=item.question;
  nodes.tip.textContent=r.name+' / '+r.tip;
  nodes.category.textContent=item.category;nodes.index.textContent=String(keys.indexOf(focus)+1).padStart(2,'0')+' / 05';
  nodes.guide.href=item.guide;nodes.guide.setAttribute('aria-label','Read the '+item.label+' installation guide');
  const active=chosen.includes(focus);
  nodes.add.textContent=active?'✓ REMOVE '+item.label.toUpperCase():'＋ ADD '+item.label.toUpperCase();
  nodes.add.setAttribute('aria-label',(active?'Remove ':'Add ')+item.label+(active?' from':' to')+' this concept');
  nodes.room.setAttribute('aria-pressed',String(mode==='room'));nodes.routes.setAttribute('aria-pressed',String(mode==='paths'));
  nodes.lens.textContent=mode==='paths'?'CONNECTION IDEAS':'ROOM MAP';nodes.count.textContent=String(chosen.length);
  // The SVG is conceptual: connections converge on an imaginary hub, not real wiring routes.
  nodes.paths.replaceChildren();
  nodes.paths.toggleAttribute('hidden',mode!=='paths'||chosen.length===0);
  if(mode==='paths'&&chosen.length){
   const ns='http://www.w3.org/2000/svg',hub={x:360,y:266};
   const make=(tag,attrs)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));nodes.paths.appendChild(el);return el};
   make('circle',{cx:hub.x,cy:hub.y,r:47,class:'v63-route-ring'});
   chosen.forEach(k=>{
    const transform=markers.find(m=>m.dataset.v40Marker===k)?.getAttribute('transform')||'';
    const nums=transform.match(/-?\d+(?:\.\d+)?/g)||[];
    if(nums.length<2)return;
    const x=Number(nums[0]),y=Number(nums[1]);
    const midx=(x+hub.x)/2,midy=(y+hub.y)/2-24;
    make('path',{d:`M ${x} ${y} Q ${midx} ${midy} ${hub.x} ${hub.y}`,class:'v63-route'});
   });
   make('circle',{cx:hub.x,cy:hub.y,r:12,class:'v63-route-hub'});
  }
 }
 function preview(key){if(!catalog[key])return;focus=key;render();announce('Previewing '+catalog[key].label+'. No service added or information sent.');}
 buttons.forEach((b,i)=>{
  b.addEventListener('click',()=>preview(b.dataset.v63Focus));
  b.addEventListener('keydown',e=>{
   if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
   e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?keys.length-1:(i+(e.key==='ArrowRight'?1:-1)+keys.length)%keys.length;
   buttons[n].focus();preview(keys[n]);
  });
 });
 nodes.add.addEventListener('click',()=>{
  const button=labButtons.find(b=>b.dataset.v40Service===focus);if(!button)return;
  const was=button.getAttribute('aria-pressed')==='true';button.click();render();
  announce(catalog[focus].label+(was?' removed from':' added to')+' the existing project. Nothing sent.');
 });
 nodes.room.addEventListener('click',()=>{mode='room';render();announce('Room map restored. Original installation pins remain interactive.');});
 nodes.routes.addEventListener('click',()=>{mode='paths';render();announce(selected().length?'Showing illustrative connection ideas, not a wiring plan.':'Select a service to see hypothetical connections. Nothing added.');});
 nodes.copy.addEventListener('click',async()=>{
  const d=catalog[focus],r=rooms[currentRoom()];
  const txt=['JUST PROTECT / CONCEPT QUESTIONS','', 'Space: '+r.name,'Focus: '+d.label,'','Planning questions:','- '+d.question,'- '+d.detail,'- '+r.tip,'','This is a concept, not a survey or a confirmed installation plan.','No information was submitted.'].join('\n');
  try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(txt);announce('Questions copied locally. Nothing sent.');}
  catch(e){const url=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='just-protect-concept-questions.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);announce('Questions downloaded as a local text file. Nothing sent.');}
 });
 // Read-only observers: other versions remain the single source of truth for selections and room.
 const observer=new MutationObserver(()=>requestAnimationFrame(render));
 [...labButtons,...roomButtons,...markers].forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['aria-pressed','transform']}));
 labButtons.forEach(b=>b.addEventListener('click',()=>{focus=b.dataset.v40Service;requestAnimationFrame(render)}));
 markers.forEach(m=>m.addEventListener('focus',()=>preview(m.dataset.v40Marker)));
 roomButtons.forEach(b=>b.addEventListener('click',render));
 render();
})();
