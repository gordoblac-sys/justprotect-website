/* V52 — Fast Track project ticket. Existing V38/V40/V42 state remains authoritative.
   All combinations are optional and additive; no data is transmitted. */
(()=>{'use strict';
 const root=document.querySelector('.v49-ticket');if(!root)return;
 const lab=[...document.querySelectorAll('[data-v40-service]')];
 const state=document.getElementById('v42-state'),heroState=document.getElementById('v38-state'),heroService=document.getElementById('v38-service');
 const names={tv:'TV Mounting & Home Theater',starlink:'Starlink Installation',network:'Networking & Structured Wiring',smart:'Smart Home & Security',audio:'Audio & Video Solutions'};
 const pairButtons=[...root.querySelectorAll('[data-v52-pair]')];
 const serviceButton=root.querySelector('#v52-route-service'),stateButton=root.querySelector('#v52-route-state'),reviewButton=root.querySelector('#v52-route-review');
 const serviceStatus=root.querySelector('#v52-route-service-status'),stateStatus=root.querySelector('#v52-route-state-status'),reviewStatus=root.querySelector('#v52-route-review-status');
 const feedback=root.querySelector('#v52-route-feedback');
 if(!lab.length||!state||!serviceButton||!stateButton||!reviewButton)return;
 const active=()=>lab.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service);
 const selectedState=()=>state.value||heroState?.value||'';
 function render(){
  const chosen=active(),where=selectedState(),ready=chosen.length>0&&Boolean(where);
  serviceButton.dataset.complete=String(chosen.length>0);stateButton.dataset.complete=String(Boolean(where));reviewButton.dataset.complete=String(ready);
  serviceStatus.textContent=chosen.length?chosen.length+' selected':'Choose a service';
  stateStatus.textContent=where||'Choose a state';
  reviewStatus.textContent=ready?'Ready to review':'Open project brief';
  const originalStatus=document.getElementById('v38-status');
  if(originalStatus&&chosen.length>1&&where)originalStatus.textContent=chosen.length+' installation services selected in '+where+'. Continue to review your combined request; nothing is sent automatically.';
  pairButtons.forEach(button=>{
   const pair=button.dataset.v52Pair.split(',');
   const pressed=pair.every(k=>chosen.includes(k));
   button.setAttribute('aria-pressed',String(pressed));
   button.setAttribute('aria-label',button.textContent.trim()+(pressed?' — included in your project':' — add both services'));
  });
 }
 pairButtons.forEach(button=>button.addEventListener('click',()=>{
  const keys=button.dataset.v52Pair.split(',');let added=0;
  keys.forEach(key=>{const target=lab.find(b=>b.dataset.v40Service===key);if(target&&target.getAttribute('aria-pressed')!=='true'){target.click();added++;}});
  // Keep the original V38 single-service preview aligned with the first chosen
  // specialty without replacing the additive V40/V42 multi-service plan.
  if(added&&heroService&&!heroService.value){heroService.value=names[keys[0]];heroService.dispatchEvent(new Event('change',{bubbles:true}));}
  feedback.textContent=added?('Added '+added+' installation '+(added===1?'service':'services')+' to your plan. Existing selections were kept.'): 'Both specialties are already in your plan. Edit selections in the project workspace.';
  render();
 }));
 serviceButton.addEventListener('click',()=>{
  root.querySelector('[data-v49-service]')?.focus();
  feedback.textContent='Choose one service above or add an optional combination. Nothing is sent.';
 });
 stateButton.addEventListener('click',()=>{
  root.querySelector('[data-v49-state]')?.focus();
  feedback.textContent='Choose Illinois, Indiana, Michigan or Ohio. Exact availability depends on the project address.';
 });
 reviewButton.addEventListener('click',()=>{
  document.getElementById('v49-workspace')?.click();
  feedback.textContent='Your editable project brief is open. This does not submit a request.';
 });
 // Preserve the original single-service starter while making the same Continue action
 // work for additive multi-service plans. The V40/V43 handoff owns the actual wizard.
 document.getElementById('v38-start')?.addEventListener('click',event=>{
  const chosen=active();
  if(chosen.length>1&&selectedState()){
   event.preventDefault();event.stopImmediatePropagation();
   document.getElementById('v42-continue')?.click();
   feedback.textContent='Your combined services were transferred into the editable request. No email was sent.';
  }
 },true);
 // Observe existing V42 project count, and use native state changes, rather than introducing
 // a second source of truth for the project.
 const count=document.getElementById('v42-dock-count');
 if(count)new MutationObserver(render).observe(count,{childList:true,characterData:true,subtree:true});
 state.addEventListener('change',render);heroState?.addEventListener('change',render);
 lab.forEach(b=>b.addEventListener('click',()=>queueMicrotask(render)));
 render();
})();
