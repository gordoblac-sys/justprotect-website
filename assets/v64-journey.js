/* V64 — A navigable, accessible request journey with readiness gates and a private live status.
   This is an enhancement of the original 3-step wizard, not a parallel form or request model. */
(()=>{'use strict';
 const dialog=document.querySelector('#wizard .dialog');
 if(!dialog||typeof render!=='function'||typeof step==='undefined'||typeof data==='undefined')return;
 const oldProgress=dialog.querySelector('.progress');
 if(!oldProgress)return;
 const journey=document.createElement('nav');
 journey.className='v64-journey';journey.setAttribute('aria-label','Project request steps');
 journey.innerHTML=`<div class="v64-journey-top"><span>YOUR REQUEST / THREE STEPS</span><small>EDIT ANY EARLIER STEP ↗</small></div>
 <div class="v64-journey-steps" role="group" aria-label="Choose a project request step">
  <button type="button" class="v64-journey-step" data-v64-step="0" aria-describedby="v64-journey-help"><span class="v64-journey-number" aria-hidden="true">01</span><span class="v64-journey-text"><strong>Services</strong><small data-v64-state="0">Choose services</small></span></button>
  <button type="button" class="v64-journey-step" data-v64-step="1" aria-describedby="v64-journey-help"><span class="v64-journey-number" aria-hidden="true">02</span><span class="v64-journey-text"><strong>Location</strong><small data-v64-state="1">Add ZIP + state</small></span></button>
  <button type="button" class="v64-journey-step" data-v64-step="2" aria-describedby="v64-journey-help"><span class="v64-journey-number" aria-hidden="true">03</span><span class="v64-journey-text"><strong>Contact</strong><small data-v64-state="2">Review draft</small></span></button>
 </div><div class="v64-journey-bottom"><div class="v64-journey-status" role="status" aria-live="polite" aria-atomic="true"><strong id="v64-journey-title">Start with your services.</strong><span id="v64-journey-detail">Choose one or more installation specialties.</span></div><span class="v64-journey-privacy">LOCAL UNTIL YOU CHOOSE TO SEND</span></div><p id="v64-journey-help" class="v64-journey-hint" aria-live="polite"></p>`;
 oldProgress.before(journey);
 const buttons=[...journey.querySelectorAll('[data-v64-step]')];
 const stateLabels=[...journey.querySelectorAll('[data-v64-state]')];
 const title=journey.querySelector('#v64-journey-title'),detail=journey.querySelector('#v64-journey-detail'),hint=journey.querySelector('#v64-journey-help');
 const stateAllowed=['Illinois','Indiana','Michigan','Ohio'];
 function serviceCount(){
  const lab=[...document.querySelectorAll('[data-v40-service][aria-pressed="true"]')];
  return lab.length||Number(Boolean(data.service));
 }
 function ready(){
  return [serviceCount()>0,stateAllowed.includes(data.state)&&/^\d{5}$/.test(String(data.zip||'')),Boolean(String(data.name||'').trim())&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email||'').trim())];
 }
 function refresh(){
  if(!document.getElementById('wizard')?.classList.contains('open'))return;
  const done=ready();
  const labels=[done[0]?`${serviceCount()} service${serviceCount()===1?'':'s'} selected`:'Choose services',done[1]?`${data.state} · ${data.zip}`:'State + 5-digit ZIP',done[2]?'Contact ready':'Review email draft'];
  buttons.forEach((button,i)=>{
   button.toggleAttribute('aria-current',i===step);if(i===step)button.setAttribute('aria-current','step');
   button.dataset.ready=String(done[i]);button.dataset.locked=String(i>0&&!done.slice(0,i).every(Boolean));
   stateLabels[i].textContent=labels[i];
  });
  if(step===0){title.textContent=done[0]?'Services selected. Ready for location.':'First, choose your installation services.';
   detail.textContent=done[0]?`${serviceCount()} selected · You can combine specialties and edit them later.`:'Select at least one specialty. Nothing is sent when you choose.';
  }else if(step===1){title.textContent=done[1]?'Location ready for discussion.':'Where will the installation take place?';
   detail.textContent=done[1]?`${data.state} · ${data.zip} · Service area subject to confirmation.`:'Choose IL, IN, MI or OH and enter a five-digit ZIP.';
  }else{title.textContent=done[2]?'Ready to review your email draft.':'Add your contact details to prepare a draft.';
   detail.textContent=done[2]?'The email will not be sent until you press Send in your email application.':'A name and valid email are needed. Phone and notes are optional.';
  }
 }
 function navigate(target){
  const done=ready();hint.textContent='';
  if(target===step){refresh();return;}
  if(target>0&&!done[0]){hint.textContent='Choose at least one service before moving to location or contact.';buttons[0].focus();return;}
  if(target>1&&!done[1]){hint.textContent='Complete your state and five-digit ZIP before opening contact.';buttons[1].focus();return;}
  step=target;render();
  const focusTarget=target===0?document.querySelector('#wizardContent [data-v43-service]'):target===1?document.querySelector('#wizardContent #f_state'):document.querySelector('#wizardContent #f_name');
  (focusTarget||buttons[target]).focus();
 }
 buttons.forEach((button,index)=>{
  button.addEventListener('click',()=>navigate(index));
  button.addEventListener('keydown',event=>{
   const keys=['ArrowRight','ArrowLeft','Home','End'];if(!keys.includes(event.key))return;
   event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;
   buttons[next].focus();
  });
 });
 const oldRender=render;
 render=function(){oldRender();hint.textContent='';refresh();};
 dialog.addEventListener('input',()=>queueMicrotask(refresh));
 dialog.addEventListener('change',()=>queueMicrotask(refresh));
 dialog.addEventListener('click',()=>requestAnimationFrame(refresh));
 refresh();
})();
