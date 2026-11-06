/* V83 Installation Journey Cinema — augments original V29 home/business stage copy.
   All preview controls are visit-only; project snapshot reads original canonical V40 controls. */
(()=>{'use strict';
 const root=document.getElementById('journey');if(!root?.classList.contains('v83-journey'))return;
 const stages=[...root.querySelectorAll('[data-v83-stage]')];const buttons=stages.map(s=>s.querySelector('.v83-stage-choose'));
 const types=[...root.querySelectorAll('[data-v29-type]')];const title=root.querySelector('#v83-stage-title');const summary=root.querySelector('#v83-stage-summary');
 const kicker=root.querySelector('#v83-stage-kicker'),img=root.querySelector('#v83-stage-image'),index=root.querySelector('#v83-art-index');
 const list=root.querySelector('#v83-stage-prompts'),pos=root.querySelector('#v83-stage-position'),guide=root.querySelector('#v83-stage-guide');
 const originals=[...document.querySelectorAll('[data-v40-service]')];const state=document.getElementById('v40-state');
 const contexts={
  home:[
   {art:'scene-property.svg',prompts:['What rooms or areas are involved?','Which equipment do you already have?','What would make the space work better?']},
   {art:'scene-network.svg',prompts:['Where are power and existing connections?','What access, cable paths or mounting surfaces are available?','Are there equipment or placement restrictions?']},
   {art:'scene-entertainment.svg',prompts:['What should be demonstrated or explained?','Which devices and connections should be checked?','What follow-up questions would help you use the setup?']}],
  business:[
   {art:'scene-property.svg',prompts:['Which rooms or business areas are affected?','Who uses the existing equipment?','Are there access hours or site contacts to consider?']},
   {art:'scene-network.svg',prompts:['Where are current wiring and network equipment?','Are site access, safety or building rules involved?','Which devices or teams need coordination?']},
   {art:'scene-smart.svg',prompts:['Who should review system operation?','What equipment or access details should be documented?','Which staff need basic usage instructions?']}]
 };
 const guideMap={tv:['services/tv-mounting.html','TV & THEATER GUIDE'],starlink:['services/starlink.html','STARLINK GUIDE'],network:['services/networking.html','NETWORKING GUIDE'],smart:['services/smart-home-security.html','SMART HOME GUIDE'],audio:['services/audio-video.html','AUDIO / VIDEO GUIDE']};
 let active=0;
 const currentType=()=>types.find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.v29Type||'home';
 const selected=()=>originals.filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.dataset.v40Service);
 function updateProject(){
  const chosen=selected(),region=state?.value||'';const count=Number(chosen.length>0)+Number(Boolean(region));
  const meter=root.querySelector('.v83-context-meter');meter.setAttribute('aria-valuenow',String(count));
  root.querySelector('#v83-context-fill').style.width=(count/2*100)+'%';root.querySelector('#v83-context-count').textContent=count+' / 2';
  const serviceText=chosen.length?chosen.length+' service'+(chosen.length===1?'':'s')+' selected':'No service selected';
  const stateText=region?region+' selected':'state not selected';
  root.querySelector('#v83-context-copy').textContent=serviceText+' · '+stateText+'. This is your private planning snapshot, not installation progress or confirmed coverage.';
  const action=root.querySelector('#v83-context-action');action.textContent=chosen.length?'REVIEW MY PROJECT ↗':'CHOOSE AN INSTALLATION ↗';
  const route=chosen.length?guideMap[chosen[0]]:null;
  guide.href=route?route[0]:'services/index.html#atlas-explore';guide.textContent=route?'OPEN '+route[1]+' ↗':'EXPLORE SERVICE ATLAS ↗';
 }
 function show(n){
  active=(n+stages.length)%stages.length;const type=currentType(),entry=contexts[type][active],stage=stages[active];
  stages.forEach((s,i)=>{const on=i===active;s.dataset.v83Current=String(on);buttons[i].setAttribute('aria-pressed',String(on));});
  const stageTitle=stage.querySelector('h3')?.textContent.trim()||'Project planning';
  title.textContent=stageTitle;summary.textContent=stage.querySelector('p')?.textContent.trim()||'';
  kicker.textContent='STAGE 0'+(active+1)+' / '+(type==='home'?'HOME':'BUSINESS')+' PROJECT';
  index.innerHTML='0'+(active+1)+' <i>/ 03</i>';pos.textContent='0'+(active+1)+' / 03';
  img.src='assets/'+entry.art;img.alt='Original conceptual illustration for stage '+(active+1)+' of the '+type+' project conversation; not a real installation';
  list.replaceChildren(...entry.prompts.map(s=>{const li=document.createElement('li');li.textContent=s;return li;}));
  updateProject();
 }
 buttons.forEach((button,i)=>{
  button.addEventListener('click',()=>show(i));
  button.addEventListener('focus',()=>show(i));
  button.addEventListener('keydown',e=>{
   if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
   e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+buttons.length)%buttons.length;
   buttons[next].focus();
  });
 });
 root.querySelector('#v83-stage-prev').addEventListener('click',()=>show(active-1));
 root.querySelector('#v83-stage-next').addEventListener('click',()=>show(active+1));
 types.forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(()=>show(active))));
 root.querySelector('#v83-context-action').addEventListener('click',()=>{
  if(selected().length){document.getElementById('v42-open')?.click();return;}
  const target=originals[0];if(!target)return;
  document.getElementById('toolkit')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  target.focus({preventScroll:true});
 });
 originals.forEach(b=>new MutationObserver(updateProject).observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 state?.addEventListener('change',updateProject);
 document.querySelectorAll('[data-v49-state]').forEach(b=>new MutationObserver(updateProject).observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 show(0);
})();
