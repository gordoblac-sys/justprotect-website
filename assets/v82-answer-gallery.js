/* V82 Answer Gallery: in-place enhancements of original V71 FAQ. No storage or transmission. */
(()=>{'use strict';
 const root=document.getElementById('help');if(!root?.classList.contains('v82-answer-gallery'))return;
 const answers=[...root.querySelectorAll('#v71-answers > details[data-v22-question]')];
 const filters=[...root.querySelectorAll('[data-v71-filter]')];
 const input=root.querySelector('#v22-search');
 const position=root.querySelector('#v82-answer-position');
 const prev=root.querySelector('#v82-prev-answer');const next=root.querySelector('#v82-next-answer');
 const readCount=root.querySelector('#v82-read-count');const meter=root.querySelector('#v82-read-meter');const fill=root.querySelector('#v82-read-fill');
 const suggestionTitle=root.querySelector('#v82-suggestion-title');const suggestionReason=root.querySelector('#v82-suggestion-reason');
 const suggestionButton=root.querySelector('#v82-suggest-open');
 const seen=new Set();let active=0;let recommended=0;
 function visible(){return answers.filter(a=>!a.hidden);}
 function updateNav(){
  const list=visible();const open=answers.find(a=>a.open&&!a.hidden);
  if(open)active=Math.max(0,list.indexOf(open));
  else active=Math.min(active,Math.max(0,list.length-1));
  position.textContent=list.length?String(active+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0'):'00 / 00';
  prev.disabled=next.disabled=!list.length;
  readCount.textContent=seen.size+' / '+answers.length+' EXPLORED';meter.setAttribute('aria-valuenow',String(seen.size));fill.style.width=(seen.size/answers.length*100)+'%';
 }
 function show(index){const list=visible();if(!list.length)return;
  active=(index+list.length)%list.length;
  const item=list[active];item.open=true;
  // Native details remains the only answer source; the original V71 accordion closes others.
  item.querySelector('summary')?.focus({preventScroll:true});item.scrollIntoView({behavior:'auto',block:'nearest'});
  seen.add(answers.indexOf(item));updateNav();
 }
 prev.addEventListener('click',()=>show(active-1));next.addEventListener('click',()=>show(active+1));
 answers.forEach((item,i)=>item.addEventListener('toggle',()=>{if(item.open)seen.add(i);queueMicrotask(updateNav);}));
 // Observe original V71 topic/search filtering; no duplicate filter state or listeners.
 const observer=new MutationObserver(updateNav);
 answers.forEach(a=>observer.observe(a,{attributes:true,attributeFilter:['hidden','open']}));
 input?.addEventListener('input',()=>queueMicrotask(()=>{active=0;updateNav();}));
 filters.forEach(b=>b.addEventListener('click',()=>queueMicrotask(()=>{active=0;updateNav();})));
 root.querySelector('#v71-clear')?.addEventListener('click',()=>queueMicrotask(()=>{active=0;updateNav();}));
 const services=[...document.querySelectorAll('[data-v40-service]')];
 const state=document.getElementById('v42-state');
 const suggestions=[
  ['Where does Just Protect install?','Start with the four-state territory. Confirm actual availability for your ZIP and installation.'],
  ['Can I request multiple services together?','Explore how one private project can include multiple installation specialties.'],
  ['Do you provide TV mounting and cable management?','Review wall, outlet and cable-routing considerations for your selected TV service.'],
  ['What should I know before a rough-in wiring and prewiring?','Consider sky visibility, mounting location and router placement for your selected service.'],
  ['Can Just Protect help with home or business networking?','Review wiring, equipment and connection-point planning for your selected service.'],
  ['Does completing the project builder send my request?','Understand the final manual email review before you choose whether to send anything.']
 ];
 function updateSuggestion(){
  const selected=services.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service);
  const region=state?.value||document.getElementById('v40-state')?.value||'';
  const validRegion=['Illinois','Indiana','Michigan','Ohio'].includes(region);
  // Recommendation is advisory, based solely on canonical on-page controls; never changes the project.
  recommended=!validRegion?0:!selected.length?1:selected.includes('roughin')?3:selected.includes('tv')?2:selected.includes('networking')?4:5;
  suggestionTitle.textContent=suggestions[recommended][0];suggestionReason.textContent=suggestions[recommended][1];
  suggestionButton.setAttribute('aria-label','Read answer: '+suggestions[recommended][0]);
 }
 function revealRecommendation(){
  const target=answers[recommended];if(!target)return;
  // User-initiated shortcut clears only the original FAQ filters, never project data.
  if(target.hidden){input.value='';filters.find(b=>b.dataset.v71Filter==='all')?.click();}
  requestAnimationFrame(()=>{const i=visible().indexOf(target);if(i>=0)show(i);});
 }
 suggestionButton.addEventListener('click',revealRecommendation);
 services.forEach(b=>new MutationObserver(updateSuggestion).observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 state?.addEventListener('change',updateSuggestion);document.getElementById('v40-state')?.addEventListener('change',updateSuggestion);
 updateNav();updateSuggestion();
})();
