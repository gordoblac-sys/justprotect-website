/* V73 — Illustrated Atlas Fieldbook. UI-only enhancement of the original Atlas. */
(()=>{'use strict';
 const panel=document.getElementById('atlas-panel');if(!panel)return;
 const data=JSON.parse(document.getElementById('atlas-data').textContent);
 const tabs=[...document.querySelectorAll('.atlas-item')];
 const partner=document.getElementById('atlas-partner');
 const questions=document.getElementById('v58-questions');
 const progress=document.getElementById('v73-overall');
 const next=document.getElementById('v73-next-open');
 const reset=document.getElementById('v73-reset');
 const caption=document.getElementById('v73-pair-caption');
 const pair=document.querySelector('.v73-pair-visual');
 const counts=data.map(()=>0);
 const active=()=>Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));
 const countVisible=()=>questions.querySelectorAll('input[type="checkbox"]:checked').length;
 function paint(){
  const i=active(),j=partner.value===''?-1:Number(partner.value);
  counts[i]=countVisible();
  tabs.forEach((tab,k)=>{
   const badge=tab.querySelector('.v73-card-progress');
   badge.textContent=counts[k]+' / 3 considered';
   tab.classList.toggle('v73-considered',counts[k]===3);
  });
  const total=counts.reduce((a,b)=>a+b,0);
  progress.textContent=total+' of 15 optional checkpoints considered';
  const primary=data[i],secondary=j>=0&&j!==i?data[j]:null;
  document.getElementById('v73-pair-primary-image').src='../assets/'+primary.scene;
  document.getElementById('v73-pair-primary-label').textContent=primary.name;
  document.getElementById('v73-pair-secondary-image').src='../assets/'+(secondary?secondary.scene:primary.scene);
  document.getElementById('v73-pair-secondary-label').textContent=secondary?secondary.name:'No second service';
  pair.dataset.single=secondary?'false':'true';
  caption.textContent=secondary
   ?'Illustrative pairing only. '+primary.name+' + '+secondary.name+' will carry into the editable project builder when you choose Start a project request.'
   :'Single-service route. You can add a second specialty below, or continue with '+primary.name+' only.';
  reset.disabled=counts[i]===0;
  reset.title=counts[i]?'Clear the three optional checks for '+primary.name:'No checks to clear for '+primary.name;
  next.disabled=total===15;
  next.setAttribute('aria-label',total===15?'All optional checkpoints considered':'Jump to the next service with unchecked planning questions');
 }
 const later=()=>queueMicrotask(paint);
 tabs.forEach(tab=>{
  tab.addEventListener('click',later);
  tab.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key))setTimeout(paint,35)});
 });
 document.querySelectorAll('.atlas-goal').forEach(b=>b.addEventListener('click',later));
 partner.addEventListener('change',later);
 questions.addEventListener('change',later);
 reset.addEventListener('click',()=>{
  questions.querySelectorAll('input:checked').forEach(input=>input.click());
  paint();
  const status=document.getElementById('v58-share-status');
  status.textContent='Optional checks cleared for this service. No project information was sent.';
 });
 next.addEventListener('click',()=>{
  const i=active();let target=-1;
  for(let offset=1;offset<=tabs.length;offset++){
   const j=(i+offset)%tabs.length;
   if(counts[j]<3){target=j;break;}
  }
  if(target<0)return;
  tabs[target].click();tabs[target].focus({preventScroll:true});
  tabs[target].scrollIntoView({block:'nearest',behavior:'instant'});
  paint();
 });
 paint();
})();
