/* Just Protect V51 — Compact Project Pulse + readiness + local preparation notes.
   No network requests, no automatic form submission, no persistent personal data. */
(()=>{'use strict';
 const dock=document.getElementById('v42-project-dock'),panel=document.getElementById('v42-panel');
 const lab=[...document.querySelectorAll('[data-v40-service]')],state=document.getElementById('v42-state');
 if(!dock||!panel||!lab.length)return;
 const label=dock.querySelector('.v42-dock-copy');
 const subtitle=document.createElement('small');subtitle.className='v51-pulse-note';subtitle.id='v51-pulse-note';
 label.append(subtitle);
 const action=dock.querySelector('.v42-dock-cta');if(action)action.textContent='OPEN BRIEF ↗';
 const pulse=dock.querySelector('.v42-dock-symbol');
 const ready=document.createElement('div');ready.className='v51-ready-block';
 ready.innerHTML='<div class="v51-ready-top"><strong>PROJECT READINESS</strong><span id="v51-ready-count">0 / 2 essentials</span></div><div class="v51-ready-meter" aria-hidden="true"><span id="v51-ready-fill"></span></div><p class="v51-ready-hint" id="v51-ready-hint">Start by choosing an installation service.</p><div class="v51-ready-actions"><button type="button" id="v51-next-step">Choose a service ↓</button><button type="button" id="v51-undo" hidden>Undo clear ↶</button><button type="button" id="v51-clear">Clear services</button></div>';
 const brief=panel.querySelector('.v42-brief');brief.parentElement.insertBefore(ready,brief);
 const count=ready.querySelector('#v51-ready-count'),fill=ready.querySelector('#v51-ready-fill'),hint=ready.querySelector('#v51-ready-hint'),next=ready.querySelector('#v51-next-step'),clear=ready.querySelector('#v51-clear'),undo=ready.querySelector('#v51-undo');
 const active=()=>lab.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service);
 const status=document.getElementById('v42-status');let prior=[],undoTimer;
 function sync(){
  const selected=active(),hasState=Boolean(state.value),steps=Number(selected.length>0)+Number(hasState),pct=steps*50;
  dock.style.setProperty('--v51-ready',pct+'%');fill.style.setProperty('--v51-progress',pct+'%');
  count.textContent=steps+' / 2 essentials';clear.disabled=selected.length===0;
  subtitle.textContent=!selected.length?'Choose what you need':!hasState?'Add your project state':'Ready to review · nothing sent';
  hint.textContent=!selected.length?'Choose at least one installation specialty.':!hasState?'Now choose the state where the project is located.':'Your services and state are set. Continue when you are ready.';
  next.textContent=!selected.length?'Choose a service ↓':!hasState?'Choose a state ↓':'Review your request ↗';
  next.setAttribute('aria-label',next.textContent);
  if(pulse)pulse.setAttribute('aria-label',steps+' of 2 project essentials selected');
 }
 next.addEventListener('click',()=>{
  if(!active().length){panel.querySelector('[data-v42-service]')?.focus();return;}
  if(!state.value){state.focus();return;}
  document.getElementById('v42-continue')?.click();
 });
 clear.addEventListener('click',()=>{
  prior=active();if(!prior.length)return;
  lab.filter(b=>prior.includes(b.dataset.v40Service)).forEach(b=>b.click());
  undo.hidden=false;status.textContent='Selected services cleared. Use Undo to restore them; your state and space remain unchanged.';
  clearTimeout(undoTimer);undoTimer=setTimeout(()=>{undo.hidden=true;prior=[];},12000);sync();
 });
 undo.addEventListener('click',()=>{
  lab.forEach(b=>{if(prior.includes(b.dataset.v40Service)&&b.getAttribute('aria-pressed')!=='true')b.click();});
  clearTimeout(undoTimer);prior=[];undo.hidden=true;status.textContent='Previous service selections restored. Nothing was sent.';sync();
 });
 // V42 updates its count text on every service, room or state change; observe only that text,
 // avoiding a second state store and keeping the new UI in sync with all earlier tools.
 const countSource=document.getElementById('v42-dock-count');
 if(countSource)new MutationObserver(sync).observe(countSource,{childList:true,characterData:true,subtree:true});
 state.addEventListener('change',()=>queueMicrotask(sync));
 sync();

 // Upgrade the existing V50 planning disclosure in place. Scene changes still come from V35/V50.
 const list=document.getElementById('v50-notes-list'),details=document.getElementById('v50-notes');
 if(!list||!details)return;
 const memo=new Map();
 const intro=document.createElement('p');intro.className='v51-prep-intro';intro.textContent='Check what you already know. Unchecked items become questions for your project conversation.';
 list.before(intro);
 const footer=document.createElement('div');footer.className='v51-prep-footer';
 const progress=document.createElement('span');progress.id='v51-prep-progress';progress.setAttribute('aria-live','polite');
 const copy=document.createElement('button');copy.type='button';copy.id='v51-copy-prep';copy.textContent='COPY PREP NOTES ↗';
 footer.append(progress,copy);list.after(footer);
 const feedback=document.createElement('p');feedback.className='v51-prep-feedback';feedback.setAttribute('role','status');footer.after(feedback);
 const scene=()=>document.querySelector('[data-v35-scene][aria-pressed="true"]')?.dataset.v35Scene||'entertainment';
 function updateProgress(){const key=scene(),items=[...list.querySelectorAll('input[type=checkbox]')],known=items.filter(x=>x.checked).length;
  progress.textContent=known+' / '+items.length+' details known';memo.set(key,new Set(items.filter(x=>x.checked).map(x=>Number(x.dataset.index))));
 }
 function decorate(){
  const items=[...list.querySelectorAll('li')];if(!items.length||items.every(li=>li.querySelector('input')))return;
  const key=scene(),known=memo.get(key)||new Set();
  items.forEach((li,i)=>{
   const question=li.textContent.trim();li.textContent='';
   const lab=document.createElement('label');lab.className='v51-prep-item';
   const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.dataset.index=String(i);checkbox.checked=known.has(i);
   const span=document.createElement('span');span.textContent=question;lab.append(checkbox,span);li.append(lab);
   checkbox.addEventListener('change',()=>{updateProgress();feedback.textContent='Your checklist stays in this page until you choose to copy it.';});
  });
  feedback.textContent='';updateProgress();
 }
 // A V50 scene switch replaces the three list items. Re-decorate those new nodes without
 // interfering with the original V50 data or keyboard scene navigation.
 const observer=new MutationObserver(decorate);observer.observe(list,{childList:true});decorate();
 copy.addEventListener('click',async()=>{
  const current=scene(),selectedTab=document.querySelector('[data-v35-scene][aria-pressed="true"]');
  const service=selectedTab?.textContent.trim()||current;
  const questions=[...list.querySelectorAll('li')].map(li=>({text:li.querySelector('span')?.textContent||li.textContent.trim(),known:Boolean(li.querySelector('input')?.checked)}));
  const text=['JUST PROTECT / INSTALLATION PREPARATION','Service concept: '+service,'Project state: '+(state.value||'Not selected'),'',...questions.map(q=>(q.known?'[KNOWN] ':'[TO DISCUSS] ')+q.text),'','Planning notes only. Actual feasibility and availability require discussion.','This text is not sent automatically.'].join('\n');
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text);feedback.textContent='Preparation notes copied locally. Nothing was sent.';}
  catch(err){const blob=new Blob([text],{type:'text/plain'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='just-protect-preparation-notes.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);feedback.textContent='Clipboard unavailable. Your notes were downloaded as a local text file.';}
 });
})();
