/* V71 Answer Desk: original six FAQ answers, now topic-filtered and easier to use.
   All information and clipboard actions remain local; original V22 request buttons remain. */
(()=>{'use strict';
 const root=document.getElementById('help');
 if(!root||!root.classList.contains('v71-answer-desk'))return;
 const input=root.querySelector('#v22-search'),count=root.querySelector('#v22-count'),badge=root.querySelector('#v71-badge');
 const none=root.querySelector('#v22-none'),clear=root.querySelector('#v71-clear'),tabs=[...root.querySelectorAll('[data-v71-filter]')];
 const answers=[...root.querySelectorAll('[data-v22-question]')];
 const status=root.querySelector('#v71-copy-status'),project=root.querySelector('#v71-project-state'),location=root.querySelector('#v71-project-location');
 let topic='all';
 function filter(){
  const q=input.value.trim().toLocaleLowerCase();let visible=0;
  for(const item of answers){const match=(topic==='all'||item.dataset.v71Topic===topic)&&item.textContent.toLocaleLowerCase().includes(q);
   item.hidden=!match;if(!match)item.open=false;if(match)visible++;}
  count.textContent=visible+' '+(visible===1?'answer':'answers')+' available';badge.textContent=String(visible).padStart(2,'0');none.hidden=visible!==0;
  clear.disabled=topic==='all'&&!q;
  tabs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v71Filter===topic)));
 }
 // The original V22 search listener runs first; this additional pass combines search and topic.
 input.addEventListener('input',filter);
 tabs.forEach((button,index)=>{
  button.addEventListener('click',()=>{topic=button.dataset.v71Filter;filter();});
  button.addEventListener('keydown',event=>{
   if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
   event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
   tabs[next].focus();tabs[next].click();
  });
 });
 clear.addEventListener('click',()=>{input.value='';topic='all';filter();input.focus();});
 // Native details preserve their semantics and built-in keyboard accessibility.
 answers.forEach(item=>item.addEventListener('toggle',()=>{if(item.open)answers.forEach(other=>{if(other!==item)other.open=false;});}));
 async function copyAnswer(button){
  const details=button.closest('details');const question=details?.querySelector('.v71-question')?.textContent?.trim();
  const answer=details?.querySelector('.v71-answer-body p')?.textContent?.trim();
  if(!question||!answer)return;
  const text=question+'\n'+answer+'\n\nGeneral guidance from Just Protect LLC. Confirm details for your project.';
  try{
   if(!navigator.clipboard?.writeText)throw Error('Clipboard API unavailable');
   await navigator.clipboard.writeText(text);status.textContent='Answer copied locally. Nothing was sent.';
  }catch(_){
   const field=document.createElement('textarea');field.value=text;field.setAttribute('aria-label','Answer text to copy');field.style.cssText='position:fixed;left:10px;bottom:10px;width:min(460px,90vw);height:110px;z-index:80';
   document.body.append(field);field.focus();field.select();
   let copied=false;try{copied=document.execCommand('copy');}catch(_){}
   if(copied){field.remove();status.textContent='Answer copied locally. Nothing was sent.';}
   else{status.textContent='Clipboard access is blocked. The answer is selected in a temporary text field; copy it manually.';
    field.addEventListener('blur',()=>field.remove(),{once:true});}
  }
 }
 root.querySelectorAll('[data-v71-copy]').forEach(b=>b.addEventListener('click',()=>copyAnswer(b)));
 const selectors=[...document.querySelectorAll('[data-v40-service]')],state=document.getElementById('v42-state');
 function refreshProject(){
  const n=selectors.filter(b=>b.getAttribute('aria-pressed')==='true').length;
  let region=state?.value||document.getElementById('v40-state')?.value||'';
  if(!['Illinois','Indiana','Michigan','Ohio'].includes(region))region='';
  project.textContent=n?n+' installation '+(n===1?'service':'services')+' selected':'No services selected yet';
  location.textContent=region?region+' selected · Availability to be confirmed.':'No project state selected. Your choices stay private until you share.';
 }
 selectors.forEach(b=>new MutationObserver(refreshProject).observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 state?.addEventListener('change',refreshProject);document.getElementById('v40-state')?.addEventListener('change',refreshProject);
 root.querySelector('#v71-open-workspace').addEventListener('click',()=>document.getElementById('v42-open')?.click());
 root.querySelector('#v71-start-request').addEventListener('click',()=>{if(typeof openWizard==='function')openWizard();});
 filter();refreshProject();
})();
