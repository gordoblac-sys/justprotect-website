/* V70 — Final Checkpoint. Rearranges the existing V53/V56 final step, not a second form.
   All state is read from the original canonical wizard; no persistence or transmission. */
(()=>{'use strict';
 const panel=document.getElementById('wizardContent');
 if(!panel||typeof render!=='function'||typeof data==='undefined')return;
 const validEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||'').trim());
 const names={tv:'TV & theater',roughin:'Rough-In Wiring',network:'Networking',smart:'Smart home & security',audio:'Audio & video'};
 let contactRevealed=false;
 function selectedServices(){
  const active=[...document.querySelectorAll('[data-v40-service][aria-pressed="true"]')].map(b=>names[b.dataset.v40Service]).filter(Boolean);
  return active.length?active:(data.service?[data.service]:[]);
 }
 function readiness(){return [selectedServices().length>0,['Illinois','Indiana','Michigan','Ohio'].includes(data.state)&&/^\d{5}$/.test(String(data.zip||'')),Boolean(String(data.name||'').trim())&&validEmail(data.email)];}
 function refresh(){
  const board=panel.querySelector('#v70-checkpoint');if(!board||step!==2)return;
  const ready=readiness(),count=ready.filter(Boolean).length;
  board.querySelector('#v70-ready-count').textContent=count+' / 3 REVIEW ITEMS';
  board.querySelector('#v70-ready-track').style.width=(count/3*100)+'%';
  board.querySelector('#v70-ready-progress').setAttribute('aria-valuenow',String(count));
  const services=selectedServices();
  board.querySelector('#v70-services').textContent=services.length?services.join(' · '):'Choose at least one service';
  board.querySelector('#v70-location').textContent=ready[1]?data.state+' · '+data.zip+' · '+(data.property||'Property type not specified'):'State and five-digit ZIP needed';
  const contact=board.querySelector('#v70-contact');
  contact.textContent=ready[2]?(contactRevealed?data.name.trim()+' · '+data.email.trim()+(data.phone?' · '+data.phone:''):'Contact entered · masked in this summary'):'Name and valid email needed';
  board.querySelector('#v70-toggle-private').textContent=contactRevealed?'Hide contact details':'Show contact details';
  board.querySelector('#v70-toggle-private').setAttribute('aria-pressed',String(contactRevealed));
  board.querySelectorAll('[data-v70-status]').forEach((el,i)=>{el.textContent=ready[i]?'READY':'NEEDS ATTENTION';el.dataset.ready=String(ready[i]);});
  board.querySelector('#v70-email-to').textContent=typeof CONTACT_EMAIL==='string'?CONTACT_EMAIL:'Your email application';
  board.querySelector('#v70-email-subject').textContent='Just Protect — '+data.service+' — '+data.state+' '+data.zip;
  board.querySelector('#v70-guidance').textContent=!ready[0]?'Choose a service in the Services stage before preparing a request.':!ready[1]?'Choose a state and enter a five-digit ZIP. Availability is confirmed only after review.':!ready[2]?'Enter your name and a valid email. Phone and notes are optional.':'Your draft is ready to review. Opening an email draft does not send it; you must press Send yourself.';
 }
 function mount(){
  if(step!==2)return;
  const studio=panel.querySelector('.v56-contact-studio'),desk=panel.querySelector('.v53-send-desk');
  if(!studio||!desk||panel.querySelector('#v70-checkpoint'))return;
  const layout=document.createElement('section');layout.id='v70-checkpoint';layout.className='v70-final-checkpoint';layout.setAttribute('aria-label','Final project checkpoint');
  layout.innerHTML=`<div class="v70-checkpoint-heading"><div><span class="v70-overline">FINAL CHECKPOINT / STEP 03</span><h3>ONE LAST LOOK.<br><em>YOUR CALL.</em></h3><p>Edit the original request on the left. Confirm the details and inspect the exact outgoing draft on the right.</p></div><div class="v70-checkpoint-meter"><strong id="v70-ready-count">0 / 3 REVIEW ITEMS</strong><div role="progressbar" aria-label="Request preparation items complete" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0" id="v70-ready-progress"><span id="v70-ready-track"></span></div><small>For preparation only — not a coverage or installation guarantee.</small></div></div><div class="v70-checkpoint-grid"><div class="v70-edit-column"><div class="v70-column-kicker"><span>01 / EDIT YOUR DETAILS</span><span>ORIGINAL FORM</span></div></div><div class="v70-review-column"><div class="v70-column-kicker"><span>02 / CHECK BEFORE SHARING</span><span>PRIVATE DRAFT</span></div><div class="v70-summary" aria-label="Live project summary"><div class="v70-summary-head"><strong>PROJECT AT A GLANCE</strong><span>LOCAL PREVIEW</span></div><div class="v70-summary-item"><div><span class="v70-number">01</span><strong>SERVICES</strong><span class="v70-item-status" data-v70-status="0">NEEDS ATTENTION</span></div><p id="v70-services"></p><div class="v70-services-actions"></div></div><div class="v70-summary-item"><div><span class="v70-number">02</span><strong>LOCATION</strong><span class="v70-item-status" data-v70-status="1">NEEDS ATTENTION</span></div><p id="v70-location"></p><div class="v70-location-actions"></div></div><div class="v70-summary-item"><div><span class="v70-number">03</span><strong>CONTACT</strong><span class="v70-item-status" data-v70-status="2">NEEDS ATTENTION</span></div><p id="v70-contact"></p><div class="v70-summary-actions"><button type="button" id="v70-edit-contact">Edit contact ↓</button><button type="button" id="v70-toggle-private" aria-pressed="false">Show contact details</button></div></div><p id="v70-guidance" class="v70-guidance" role="status" aria-live="polite"></p></div><button type="button" id="v70-show-draft" class="v70-show-draft">INSPECT THE EXACT OUTGOING TEXT <span aria-hidden="true">↗</span></button></div></div>`;
  studio.before(layout);
  const left=layout.querySelector('.v70-edit-column'),right=layout.querySelector('.v70-review-column');
  left.append(studio);
  const snapshot=panel.querySelector('.v56-legacy-snapshot');if(snapshot)left.append(snapshot);
  const prompts=panel.querySelector('.v53-prompts');if(prompts){const disclosure=document.createElement('details');disclosure.className='v70-prompts';disclosure.innerHTML='<summary>Optional installation discussion prompts</summary>';disclosure.append(prompts);left.append(disclosure);}
  const envelope=document.createElement('div');envelope.className='v70-envelope';envelope.setAttribute('aria-label','Outgoing email address and subject');
  envelope.innerHTML='<div><span>TO / MANUAL EMAIL DRAFT</span><strong id="v70-email-to"></strong></div><div><span>SUBJECT / GENERATED FROM YOUR PROJECT</span><strong id="v70-email-subject"></strong></div>';
  right.append(envelope,desk);
  const jumps=panel.querySelector('.v53-review-jumps');
  if(jumps){const editServices=jumps.querySelector('#v53-edit-services'),editLocation=jumps.querySelector('#v53-edit-location');
   if(editServices)layout.querySelector('.v70-services-actions').append(editServices);
   if(editLocation)layout.querySelector('.v70-location-actions').append(editLocation);
   jumps.remove();}
  const exact=desk.querySelector('#v53-preview-details');if(exact)exact.open=false;
  layout.querySelector('#v70-edit-contact').addEventListener('click',()=>{const field=panel.querySelector('#f_name');field?.focus();field?.scrollIntoView({block:'center',behavior:'instant'});});
  layout.querySelector('#v70-toggle-private').addEventListener('click',()=>{contactRevealed=!contactRevealed;refresh();});
  layout.querySelector('#v70-show-draft').addEventListener('click',()=>{if(exact){exact.open=true;exact.querySelector('summary')?.focus();exact.scrollIntoView({block:'center',behavior:'instant'});}const note=panel.querySelector('#v53-share-status');if(note)note.textContent='Exact local draft expanded for review. Nothing has been sent.';});
  refresh();
 }
 const oldRender=render;
 render=function(){oldRender();contactRevealed=false;mount();};
 panel.addEventListener('input',()=>queueMicrotask(refresh));
 panel.addEventListener('change',()=>queueMicrotask(refresh));
})();
