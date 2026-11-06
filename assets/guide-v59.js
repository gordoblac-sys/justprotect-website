/* V59 — optional one-at-a-time question focus, exact local outline preview, reversible reset. */
(()=>{'use strict';
 const root=document.querySelector('[data-guide]');if(!root)return;
 const checks=[...document.querySelectorAll('.planner .check input[type="checkbox"]')];
 const checklist=document.querySelector('.planner .checklist');
 const counter=document.getElementById('v59-question-position');
 const prev=document.getElementById('v59-question-prev');
 const next=document.getElementById('v59-question-next');
 const toggle=document.getElementById('v59-toggle-all');
 const nav=document.querySelector('.v59-question-actions');
 const preview=document.getElementById('v59-outline');
 const state=document.getElementById('guide-state');
 const zip=document.getElementById('guide-zip');
 const notes=document.getElementById('guide-notes');
 const reset=document.getElementById('guide-reset');
 const undo=document.getElementById('v59-undo-reset');
 const status=document.getElementById('guide-status');
 if(!checks.length||!checklist||!counter||!prev||!next||!toggle||!preview||!reset||!undo)return;
 let focusIndex=0,all=false,snapshot=null,undoTimer=null;
 function paint(){
   checklist.classList.toggle('v59-focus-mode',!all);
   checks.forEach((input,i)=>input.closest('.check').classList.toggle('v59-current',i===focusIndex));
   counter.textContent=String(focusIndex+1).padStart(2,'0')+' / '+String(checks.length).padStart(2,'0');
   prev.disabled=all||focusIndex===0;next.disabled=all||focusIndex===checks.length-1;
   nav.hidden=all;toggle.setAttribute('aria-pressed',String(all));
   toggle.textContent=all?'Focus on one question':'Show all questions';
 }
 function go(delta){focusIndex=Math.min(checks.length-1,Math.max(0,focusIndex+delta));paint();checks[focusIndex].focus();}
 prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
 toggle.addEventListener('click',()=>{all=!all;paint();if(!all)checks[focusIndex].focus();});
 function outline(){
  const lines=['JUST PROTECT / PROJECT PLANNING NOTES','Service: '+root.dataset.name,'State: '+(state?.value||'Not yet selected'),'ZIP code: '+(zip?.value.length===5?zip.value:'Not provided'),'','PLANNING QUESTIONS'];
  checks.forEach(c=>lines.push((c.checked?'[x] ':'[ ] ')+c.dataset.question));
  lines.push('','YOUR PROJECT NOTES',notes?.value.trim()||'No additional notes.','','Notes: Questions marked [x] have been considered, not verified by Just Protect.','Availability, scope and feasibility require direct review.','This is a local draft and has not been submitted.');
  return lines.join('\n');
 }
 function updatePreview(){preview.textContent=outline();}
 [state,zip,notes,...checks].filter(Boolean).forEach(el=>{
  el.addEventListener('input',updatePreview);el.addEventListener('change',updatePreview);
 });
 function expireUndo(){snapshot=null;undo.disabled=true;clearTimeout(undoTimer);undoTimer=null;}
 // Capture before the existing V47 handler clears canonical fields.
 reset.addEventListener('click',()=>{
  snapshot={checks:checks.map(c=>c.checked),state:state?.value||'',zip:zip?.value||'',notes:notes?.value||''};
  clearTimeout(undoTimer);undo.disabled=false;
  undoTimer=setTimeout(expireUndo,15000);
  setTimeout(updatePreview,0);
 },true);
 undo.addEventListener('click',()=>{
  if(!snapshot)return;
  checks.forEach((c,i)=>{c.checked=snapshot.checks[i];c.dispatchEvent(new Event('change',{bubbles:true}));});
  if(state){state.value=snapshot.state;state.dispatchEvent(new Event('change',{bubbles:true}));}
  if(zip){zip.value=snapshot.zip;zip.dispatchEvent(new Event('input',{bubbles:true}));}
  if(notes){notes.value=snapshot.notes;notes.dispatchEvent(new Event('input',{bubbles:true}));}
  expireUndo();updatePreview();status.textContent='Your checklist, state, ZIP and notes have been restored. Nothing was sent.';
 });
 paint();updatePreview();
})();
