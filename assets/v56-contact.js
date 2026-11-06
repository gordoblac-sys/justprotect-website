/* V56 — Contact Studio: accessible, local-only final-step contact preparation.
   Reuses the original V43 fields and V34 validation; no second form or transmission. */
(()=>{'use strict';
 const panel=document.getElementById('wizardContent');
 if(!panel||typeof render!=='function')return;
 const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||'').trim());
 function mount(){
  if(step!==2)return;
  const name=panel.querySelector('#f_name'),email=panel.querySelector('#f_email'),phone=panel.querySelector('#f_phone'),notes=panel.querySelector('#f_details');
  if(!name||!email||!phone||!notes)return;
  const fields=[name,email,phone,notes].map(el=>el.closest('.field'));
  const intro=panel.querySelector(':scope > .sub');if(intro)intro.remove();
  const studio=document.createElement('section');studio.className='v56-contact-studio';studio.setAttribute('aria-label','Prepare your contact information');
  studio.innerHTML=`<div class="v56-contact-art">
   <div class="v56-contact-top"><span>03 / CONTACT STUDIO</span><span aria-hidden="true">↗</span></div>
   <div class="v56-art-grid" aria-hidden="true"><span class="v56-orbit v56-orbit-one"></span><span class="v56-orbit v56-orbit-two"></span><span class="v56-art-mark">JP<span>↗</span></span></div>
   <h4>YOUR DETAILS.<br><em>YOUR CALL.</em></h4>
   <p>Give us a way to respond. Nothing is submitted here. You decide whether to send the email draft.</p>
   <div class="v56-contact-meter" aria-label="Contact readiness"><span class="v56-meter-label">CONTACT READINESS</span><strong id="v56-meter-count">0 / 2</strong><div class="v56-meter-track" role="progressbar" aria-label="Required contact fields completed" aria-valuemin="0" aria-valuemax="2" aria-valuenow="0" id="v56-meter"><span id="v56-meter-fill"></span></div><small id="v56-meter-message" role="status" aria-live="polite">Name and email are needed for the draft.</small></div>
  </div><div class="v56-contact-form"><div class="v56-form-head"><span>THE ESSENTIALS</span><strong>NO ACCOUNT REQUIRED</strong></div><div class="v56-form-fields"></div><div class="v56-contact-tools"><span id="v56-notes-count" aria-live="off">0 characters in project notes</span><button type="button" id="v56-phone-clear">Remove optional phone</button></div><div class="v56-contact-foot"><span aria-hidden="true">◉</span><span>Private on this page until you choose to share. The email button opens a draft only; you must press Send yourself.</span></div><button type="button" id="v56-check-draft">Review the outgoing email text ↓</button></div>`;
  const anchor=panel.querySelector('.v53-review-jumps')||panel.querySelector('.v53-review-head');
  if(anchor)anchor.after(studio);else panel.prepend(studio);
  const form=studio.querySelector('.v56-form-fields');fields.forEach(f=>form.append(f));
  fields[0].classList.add('v56-name');fields[1].classList.add('v56-email');fields[2].classList.add('v56-phone');fields[3].classList.add('v56-notes');
  name.setAttribute('autocomplete','name');email.setAttribute('autocomplete','email');phone.setAttribute('autocomplete','tel');
  name.setAttribute('aria-describedby','v56-name-help');email.setAttribute('aria-describedby','v56-email-help');phone.setAttribute('aria-describedby','v56-phone-help');
  const helps=[['v56-name-help','Required — enter your name.'],['v56-email-help','Required — enter a valid email address.'],['v56-phone-help','Optional — include a phone number only if you want to.']];
  helps.forEach(([id,message],i)=>{const small=document.createElement('small');small.className='v56-field-help';small.id=id;small.textContent=message;fields[i].append(small);});
  const label=fields[3].querySelector('label');if(label)label.textContent='Your project notes (optional)';
  const oldPreview=panel.querySelector('.v34-preview');
  if(oldPreview){const details=document.createElement('details');details.className='v56-legacy-snapshot';details.innerHTML='<summary>See the original project snapshot ↓</summary>';oldPreview.before(details);details.append(oldPreview);studio.after(details);}
  const prompts=panel.querySelector('.v53-prompts');if(prompts){const snap=panel.querySelector('.v56-legacy-snapshot');(snap||studio).after(prompts);}
  const count=studio.querySelector('#v56-meter-count'),bar=studio.querySelector('#v56-meter'),fill=studio.querySelector('#v56-meter-fill'),message=studio.querySelector('#v56-meter-message'),notesCount=studio.querySelector('#v56-notes-count'),clear=studio.querySelector('#v56-phone-clear');
  function refresh(){
   const hasName=Boolean(name.value.trim()),hasEmail=validEmail(email.value),ready=Number(hasName)+Number(hasEmail);
   count.textContent=ready+' / 2';bar.setAttribute('aria-valuenow',String(ready));fill.style.width=(ready*50)+'%';
   message.textContent=ready===2?'Ready to review your email draft. Nothing has been sent.':!hasName?'Enter your name to continue.':'Enter a valid email address to continue.';
   fields[0].classList.toggle('v56-field-ready',hasName);fields[1].classList.toggle('v56-field-ready',hasEmail);
   fields[0].querySelector('.v56-field-help').textContent=hasName?'Name entered.':'Required — enter your name.';
   fields[1].querySelector('.v56-field-help').textContent=hasEmail?'Email format looks valid.':'Required — enter a valid email address.';
   notesCount.textContent=notes.value.length+' characters in project notes (optional)';
   clear.hidden=!phone.value;studio.classList.toggle('v56-ready',ready===2);
  }
  [name,email,phone,notes].forEach(el=>{el.addEventListener('input',refresh);el.addEventListener('change',refresh);});
  clear.addEventListener('click',()=>{phone.value='';phone.dispatchEvent(new Event('input',{bubbles:true}));phone.focus();});
  studio.querySelector('#v56-check-draft').addEventListener('click',()=>{
   const disclosure=panel.querySelector('#v53-preview-details');if(!disclosure)return;
   disclosure.open=true;disclosure.querySelector('summary')?.focus();
   const status=panel.querySelector('#v53-share-status');if(status)status.textContent='Draft expanded below for review. Nothing has been sent.';
  });
  refresh();
 }
 const original=render;
 render=function(){original();mount();};
})();
