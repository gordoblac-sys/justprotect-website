/* Just Protect V57 — Illustrated Project Blueprint.
   Enhances the original V42 workspace, retaining V40/V43 as the only service selection model.
   Optional notes live in page memory; explicit action required to add them to the request. */
(()=>{'use strict';
 const panel=document.getElementById('v42-panel'),servicesBox=panel?.querySelector('.v42-services');
 if(!panel||!servicesBox||!document.getElementById('v42-open'))return;
 const catalog={
  tv:{label:'TV & theater',image:'scene-entertainment.svg',eyebrow:'SCREEN / SIGHTLINES',tip:'Screen position, wall conditions and equipment routing.'},
  roughin:{label:'Rough-In Wiring',image:'scene-rough-in.svg',eyebrow:'SIGNAL / ACCESS',tip:'Potential mounting areas, access and cable entry.'},
  network:{label:'Networking',image:'scene-network.svg',eyebrow:'CABLE / CONNECTION',tip:'Rooms, connection points and equipment locations.'},
  smart:{label:'Smart home / security',image:'scene-smart.svg',eyebrow:'CONTROL / COVERAGE',tip:'Device locations, controls and network needs.'},
  audio:{label:'Audio / video',image:'scene-audio.svg',eyebrow:'SOUND / SPACE',tip:'Listening zones, speaker positions and source equipment.'}
 };
 const canonical=[...document.querySelectorAll('[data-v40-service]')];
 const selected=()=>canonical.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service);
 let order=[],current='tv',preview='tv',lastInserted='',notes=new Map();
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const head=panel.querySelector('.v42-panel-top');
 head.querySelector('.v42-panel-kicker').textContent='YOUR PROJECT / ILLUSTRATED BLUEPRINT';
 head.querySelector('#v42-title').innerHTML='YOUR PLAN.<br><em>YOUR PRIORITIES.</em>';
 const hero=document.createElement('section');hero.className='v57-hero';hero.setAttribute('aria-label','Your installation blueprint preview');
 hero.innerHTML='<div class="v57-hero-copy"><span class="v57-serial">JUST PROTECT / 57</span><p class="v57-hero-kicker" id="v57-hero-kicker">YOUR PROJECT / START HERE</p><h3 id="v57-hero-title">MAKE THE<br><em>PLAN YOURS.</em></h3><p id="v57-hero-desc">Choose installation specialties, then set your priorities and optional site notes.</p><span class="v57-hero-count" id="v57-hero-count">NO SERVICES SELECTED</span></div><figure class="v57-hero-visual"><img id="v57-hero-image" src="assets/scene-entertainment.svg" alt="Original illustration of a TV and theater installation concept" width="1000" height="900"><figcaption>ORIGINAL CONCEPT ART · NOT A PROJECT PHOTO</figcaption></figure>';
 head.after(hero);
 servicesBox.classList.add('v57-illustrated-services');
 servicesBox.querySelectorAll('[data-v42-service]').forEach(b=>{
  const key=b.dataset.v42Service,info=catalog[key];if(!info)return;
  const label=document.createElement('span');label.className='v57-service-label';
  for(const node of [...b.childNodes])if(node.nodeType===Node.TEXT_NODE){label.append(node);}
  const image=document.createElement('img');image.className='v57-service-art';image.src='assets/'+info.image;image.alt='';image.setAttribute('aria-hidden','true');image.width=80;image.height=72;
  b.prepend(image,label);
  b.addEventListener('focus',()=>showPreview(key));
  // Focus (including pointer click) previews a service without changing its selection.
  b.addEventListener('keydown',e=>{
   const cards=[...servicesBox.querySelectorAll('[data-v42-service]')];
   const keys=['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'];if(!keys.includes(e.key))return;
   e.preventDefault();const index=cards.indexOf(b),delta=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:-1;
   const next=e.key==='Home'?0:e.key==='End'?cards.length-1:(index+delta+cards.length)%cards.length;cards[next].focus();
  });
 });
 const priority=document.createElement('section');priority.className='v57-priorities';priority.setAttribute('aria-labelledby','v57-priority-title');
 priority.innerHTML='<div class="v57-priority-top"><div><span class="v57-section-label">02 / OPTIONAL DETAILS</span><h3 id="v57-priority-title">WHAT MATTERS MOST?</h3><p>Arrange the selected services in your preferred discussion order. This is not an installation schedule.</p></div><span id="v57-priority-count" class="v57-priority-count">0 selected</span></div><ol id="v57-priority-list" class="v57-priority-list"></ol><p id="v57-priority-empty" class="v57-priority-empty">Select a service above to set your priorities.</p><div class="v57-notes"><div class="v57-notes-heading"><label for="v57-note-service">SITE NOTE / OPTIONAL</label><span id="v57-note-count">0 / 240</span></div><select id="v57-note-service" aria-label="Choose a service for a site note" disabled><option value="">Choose a service first</option></select><label class="v57-note-label" for="v57-note">Anything specific about this part of your project?</label><textarea id="v57-note" maxlength="240" rows="2" placeholder="Example: Existing cable route, equipment, access or placement preference" disabled></textarea><small>Notes remain on this page until you explicitly copy, download or add them to your request.</small></div><div class="v57-export"><button id="v57-copy" type="button" disabled>Copy blueprint ↗</button><button id="v57-download" type="button" disabled>Download .txt ↓</button><button id="v57-carry" type="button" disabled>Add priorities &amp; notes to request +</button></div><p id="v57-feedback" class="v57-feedback" role="status" aria-live="polite">Nothing is sent automatically.</p>';
 servicesBox.after(priority);
 const list=priority.querySelector('#v57-priority-list'),noteSelect=priority.querySelector('#v57-note-service'),note=priority.querySelector('#v57-note'),feedback=priority.querySelector('#v57-feedback');
 function showPreview(key){const info=catalog[key];if(!info)return;preview=key;
  hero.querySelector('#v57-hero-image').src='assets/'+info.image;
  hero.querySelector('#v57-hero-image').alt='Original concept illustration for '+info.label+'; not a photograph of completed work';
  hero.querySelector('#v57-hero-kicker').textContent=info.eyebrow;
  hero.querySelector('#v57-hero-title').innerHTML=esc(info.label.toUpperCase())+'<br><em>IN YOUR PLAN.</em>';
  hero.querySelector('#v57-hero-desc').textContent=info.tip+' Final scope is confirmed through discussion.';
 }
 function showIntro(){preview='tv';hero.querySelector('#v57-hero-image').src='assets/scene-entertainment.svg';
  hero.querySelector('#v57-hero-image').alt='Original TV and theater concept illustration; not a photograph of completed work';
  hero.querySelector('#v57-hero-kicker').textContent='YOUR PROJECT / START HERE';
  hero.querySelector('#v57-hero-title').innerHTML='MAKE THE<br><em>PLAN YOURS.</em>';
  hero.querySelector('#v57-hero-desc').textContent='Choose installation specialties, then set your priorities and optional site notes.';
 }
 function updateNotes(){notes.set(current,note.value);priority.querySelector('#v57-note-count').textContent=note.value.length+' / 240';}
 function sync(){const keys=selected();order=order.filter(k=>keys.includes(k));keys.forEach(k=>{if(!order.includes(k))order.push(k);});
  hero.querySelector('#v57-hero-count').textContent=keys.length?keys.length+' '+(keys.length===1?'SPECIALTY':'SPECIALTIES')+' IN YOUR PLAN':'NO SERVICES SELECTED';
  if(!keys.length)showIntro();else if(!keys.includes(preview))showPreview(order[0]);
  priority.querySelector('#v57-priority-count').textContent=order.length+' selected';
  priority.querySelector('#v57-priority-empty').hidden=order.length>0;
  list.replaceChildren();
  order.forEach((key,i)=>{const item=document.createElement('li');item.className='v57-priority-item';item.dataset.key=key;
   const rank=document.createElement('span');rank.className='v57-rank';rank.textContent=String(i+1).padStart(2,'0');
   const name=document.createElement('span');name.className='v57-priority-name';name.textContent=catalog[key].label;
   const buttons=document.createElement('div');buttons.className='v57-priority-actions';
   for(const [direction,mark,label,disabled] of [['up','↑','Move '+catalog[key].label+' higher',i===0],['down','↓','Move '+catalog[key].label+' lower',i===order.length-1]]){
    const b=document.createElement('button');b.type='button';b.dataset.move=direction;b.textContent=mark;b.disabled=disabled;b.setAttribute('aria-label',label);buttons.append(b);
   }
   item.append(rank,name,buttons);list.append(item);
  });
  if(!order.includes(current))current=order[0]||'tv';
  const previousFocus=document.activeElement===noteSelect;
  noteSelect.replaceChildren();
  if(!order.length){const o=document.createElement('option');o.value='';o.textContent='Choose a service first';noteSelect.append(o);}
  order.forEach(key=>{const o=document.createElement('option');o.value=key;o.textContent=catalog[key].label;noteSelect.append(o);});
  noteSelect.disabled=!order.length;note.disabled=!order.length;noteSelect.value=order.length?current:'';
  note.value=order.length?(notes.get(current)||''):'';
  priority.querySelector('#v57-note-count').textContent=note.value.length+' / 240';
  if(previousFocus)noteSelect.focus();
  for(const id of ['v57-copy','v57-download','v57-carry'])priority.querySelector('#'+id).disabled=!order.length;
 }
 function outline(){const state=document.getElementById('v42-state')?.value||'Not selected';const room=document.getElementById('v42-room')?.selectedOptions[0]?.textContent||'Not selected';
  return ['JUST PROTECT / PROJECT BLUEPRINT','', 'State: '+state,'Space: '+room,'','Installation priorities (discussion order only):',...order.map((k,i)=>String(i+1)+'. '+catalog[k].label+(notes.get(k)?.trim()?'\n   Site note: '+notes.get(k).trim():'')),'','Illustrated planning concept only. This order is not an installation schedule.','Feasibility and service availability require project-specific confirmation.','Nothing is sent automatically.'].join('\n');
 }
 function noteBlock(){return 'Installation priorities and site notes (discussion order only):\n'+order.map((k,i)=>(i+1)+'. '+catalog[k].label+(notes.get(k)?.trim()?' — '+notes.get(k).trim():'' )).join('\n');}
 list.addEventListener('click',e=>{const b=e.target.closest('button[data-move]');if(!b)return;const key=b.closest('li')?.dataset.key,index=order.indexOf(key);if(index<0)return;const target=index+(b.dataset.move==='up'?-1:1);if(target<0||target>=order.length)return;
  [order[index],order[target]]=[order[target],order[index]];sync();
  const focused=list.querySelector('li[data-key="'+key+'"] button[data-move="'+b.dataset.move+'"]');(focused?.disabled?list.querySelector('li[data-key="'+key+'"] button:not(:disabled)'):focused)?.focus();
  showPreview(order[0]);feedback.textContent='Priority order updated. Your service selections are unchanged.';
 });
 noteSelect.addEventListener('change',()=>{current=noteSelect.value;note.value=notes.get(current)||'';priority.querySelector('#v57-note-count').textContent=note.value.length+' / 240';showPreview(current);});
 note.addEventListener('input',updateNotes);
 priority.querySelector('#v57-copy').addEventListener('click',async()=>{try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(outline());feedback.textContent='Blueprint copied locally. Nothing was sent.';}
  catch{const blob=new Blob([outline()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='just-protect-blueprint.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);feedback.textContent='Clipboard unavailable. Blueprint downloaded locally instead.';}
 });
 priority.querySelector('#v57-download').addEventListener('click',()=>{const blob=new Blob([outline()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='just-protect-project-blueprint.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);feedback.textContent='Blueprint downloaded locally. Nothing was sent.';});
 priority.querySelector('#v57-carry').addEventListener('click',()=>{
  if(!order.length||typeof data==='undefined')return;
  const next=noteBlock();
  if(lastInserted&&data.details.includes(lastInserted))data.details=data.details.replace(lastInserted,next);
  else if(!data.details.includes(next))data.details=(data.details.trim()?data.details.trim()+'\n\n':'')+next;
  lastInserted=next;
  feedback.textContent='Your priorities and notes were added to the editable request draft. Open the request to review them. Nothing was sent.';
 });
 const count=document.getElementById('v42-dock-count');
 if(count)new MutationObserver(sync).observe(count,{childList:true,characterData:true,subtree:true});
 document.getElementById('v42-open').addEventListener('click',()=>{sync();if(order.length)showPreview(order[0]);else showIntro();});
 document.getElementById('v42-state')?.addEventListener('change',()=>{feedback.textContent='State updated. Nothing was sent.';});
 document.getElementById('v42-room')?.addEventListener('change',()=>{feedback.textContent='Project space updated. Nothing was sent.';});
 sync();showIntro();
})();
