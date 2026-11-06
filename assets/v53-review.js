/* V53 — private, editable final-step request desk. No new transmission or persistence. */
(()=>{'use strict';
 const panel=document.getElementById('wizardContent');
 if(!panel||typeof render!=='function'||typeof requestText!=='function')return;
 const promptMap={
  'TV Mounting & Home Theater':'TV size, wall type, preferred mounting height and cable visibility',
  'Rough-In Wiring & Prewiring':'Equipment version, mounting access, possible obstructions and cable entry',
  'Networking & Structured Wiring':'Rooms to connect, device count and preferred equipment location',
  'Smart Home & Security':'Existing devices, entry points and preferred controls',
  'Audio & Video Solutions':'Rooms or zones, speaker locations and existing components'
 };
 function chosen(){
  const map={tv:'TV Mounting & Home Theater',roughin:'Rough-In Wiring & Prewiring',network:'Networking & Structured Wiring',smart:'Smart Home & Security',audio:'Audio & Video Solutions'};
  const active=[...document.querySelectorAll('[data-v40-service][aria-pressed="true"]')].map(b=>map[b.dataset.v40Service]).filter(Boolean);
  return active.length?active:(data.service?[data.service]:[]);
 }
 function refresh(){
  if(step!==2)return;
  const preview=panel.querySelector('#v53-email-preview');if(preview)preview.textContent=requestText();
  const tag=panel.querySelector('#v53-contact-status');if(tag)tag.textContent=(data.name.trim()&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))?'Contact details entered':'Name + valid email required to open email draft';
 }
 function jump(to){step=to;render();(to===0?panel.querySelector('[data-v43-service]'):panel.querySelector('#f_state'))?.focus();}
 function addTopics(){
  const field=panel.querySelector('#f_details');if(!field)return;
  const existing=field.value.trim();const selected=chosen();
  const topics=selected.map(s=>promptMap[s]).filter(Boolean);
  if(!topics.length)return;
  const header='Questions for our installation discussion:';
  if(existing.includes(header)){panel.querySelector('#v53-share-status').textContent='Planning questions are already in your project notes.';return;}
  field.value=(existing?existing+'\n\n':'')+header+'\n'+topics.map(t=>'• '+t).join('\n');
  field.dispatchEvent(new Event('input',{bubbles:true}));field.focus();
  panel.querySelector('#v53-share-status').textContent='Planning questions added to your notes. Edit them freely before sharing.';
 }
 function download(){
  const blob=new Blob([requestText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='justprotect-private-project-draft.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  panel.querySelector('#v53-share-status').textContent='A text draft was downloaded locally. Nothing was sent.';
 }
 async function copy(){
  const message=requestText(),status=panel.querySelector('#v53-share-status'),preview=panel.querySelector('#v53-email-preview');
  try{if(!navigator.clipboard?.writeText)throw Error('Clipboard not available');await navigator.clipboard.writeText(message);status.textContent='Project draft copied locally. Nothing was sent.';}
  catch{panel.querySelector('#v53-preview-details').open=true;const range=document.createRange();range.selectNodeContents(preview);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Clipboard access is unavailable. The text is selected above; copy it manually or download it.';}
 }
 function mount(){
  if(step!==2)return;
  const previousIntro=panel.querySelector(':scope > .v43-helper');if(previousIntro)previousIntro.remove();
  const oldSend=panel.querySelector('.v18-send-option');if(oldSend)oldSend.remove();
  const title=document.createElement('div');title.className='v53-review-head';
  title.innerHTML='<span class="v53-review-kicker">FINAL STEP / YOUR PRIVATE REQUEST</span><h3>REVIEW IT.<br>THEN SEND IT.</h3><p>One project, every selected service. Check the details before opening your own email app.</p><div class="v53-review-tags" id="v53-review-tags"></div>';
  const tags=title.querySelector('#v53-review-tags');
  chosen().forEach(service=>{const span=document.createElement('span');span.textContent=service;tags.append(span);});
  if(data.state){const span=document.createElement('span');span.textContent=data.state+(data.zip?' · '+data.zip:'');tags.append(span);}
  panel.prepend(title);
  const jumps=document.createElement('div');jumps.className='v53-review-jumps';jumps.innerHTML='<button type="button" id="v53-edit-services">← Edit services</button><button type="button" id="v53-edit-location">← Edit location</button>';
  title.after(jumps);
  jumps.querySelector('#v53-edit-services').addEventListener('click',()=>jump(0));
  jumps.querySelector('#v53-edit-location').addEventListener('click',()=>jump(1));
  const textarea=panel.querySelector('#f_details');
  if(textarea){
   const prompt=document.createElement('div');prompt.className='v53-prompts';
   prompt.innerHTML='<h4>OPTIONAL / MAKE THE REQUEST MORE USEFUL</h4><p id="v53-prompt-copy"></p><button type="button" id="v53-add-topics">+ Add discussion prompts to my notes</button>';
   textarea.closest('.field').after(prompt);
   prompt.querySelector('p').textContent=chosen().map(s=>promptMap[s]).filter(Boolean).join(' · ')||'Describe the equipment and the space you have in mind.';
   prompt.querySelector('button').addEventListener('click',addTopics);
  }
  const desk=document.createElement('section');desk.className='v53-send-desk';desk.setAttribute('aria-label','Review and export your private request');
  desk.innerHTML='<h4>YOUR OUTGOING REQUEST</h4><p>Preview exactly what the email draft will contain, including every selected service. Your browser does not submit this form automatically.</p><details id="v53-preview-details"><summary>Preview full email text ↗</summary><pre id="v53-email-preview"></pre></details><div class="v53-send-actions"><button type="button" id="v53-copy">Copy draft</button><button type="button" id="v53-download">Download .txt</button></div><p class="v53-share-status" id="v53-share-status" role="status" aria-live="polite">Draft stays on this device unless you choose to share it.</p><div class="v53-manual"><span aria-hidden="true">✉</span><span><strong>Manual email only.</strong> The orange button below opens a draft in your email application. You must review and press Send yourself.</span></div><p id="v53-contact-status" role="status" class="v53-share-status"></p>';
  panel.append(desk);
  desk.querySelector('#v53-copy').addEventListener('click',copy);
  desk.querySelector('#v53-download').addEventListener('click',download);
  refresh();
 }
 const original=render;
 render=function(){original();document.getElementById('wizard')?.classList.toggle('v53-final',step===2);mount();};
 panel.addEventListener('input',()=>queueMicrotask(refresh));
 panel.addEventListener('change',()=>queueMicrotask(refresh));
})();
