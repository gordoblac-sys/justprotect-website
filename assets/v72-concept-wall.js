/* V72: original Casebook concept tabs, comparison and canonical service model are preserved.
   This layer adds illustration-led navigation, honest project matching and real guide links.
   No network calls, storage, analytics, new forms, or automatic service selection. */
(()=>{'use strict';
 const root=document.getElementById('inspiration');if(!root?.classList.contains('v72-concept-wall'))return;
 const tabs=[...root.querySelectorAll('[data-v45-index]')];if(tabs.length!==6)return;
 const catalog=[
  {keys:['tv'],guide:'services/tv-mounting.html',label:'TV INSTALLATION GUIDE'},
  {keys:['starlink'],guide:'services/starlink.html',label:'STARLINK INSTALLATION GUIDE'},
  {keys:['network'],guide:'services/networking.html',label:'NETWORKING GUIDE'},
  {keys:['smart'],guide:'services/smart-home-security.html',label:'SMART HOME GUIDE'},
  {keys:['audio'],guide:'services/audio-video.html',label:'AUDIO & VIDEO GUIDE'},
  {keys:['network','smart','audio'],guide:'services/index.html',label:'BROWSE ALL SERVICE GUIDES'}
 ];
 const previous=root.querySelector('#v72-prev'),next=root.querySelector('#v72-next'),position=root.querySelector('#v72-stage-position');
 const projectCount=root.querySelector('#v72-project-count'),match=root.querySelector('#v72-project-match'),guide=root.querySelector('#v72-guide');
 const canonical=[...document.querySelectorAll('[data-v40-service]')];
 const selected=key=>canonical.some(b=>b.dataset.v40Service===key&&b.getAttribute('aria-pressed')==='true');
 const current=()=>Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));
 function sync(){
  const i=current(),item=catalog[i],n=canonical.filter(b=>b.getAttribute('aria-pressed')==='true').length;
  projectCount.textContent=n+' '+(n===1?'service':'services')+' selected';
  const hits=item.keys.filter(selected).length,required=item.keys.length;
  match.textContent=hits===required?'All '+required+' suggested '+(required===1?'service is':'services are')+' already in your project.':hits?'This idea has '+hits+' of '+required+' suggested services in your project.':'This illustrated idea is a preview. No services were added.';
  tabs.forEach((tab,j)=>{const badge=tab.querySelector('.v72-tab-match');if(!badge)return;
   const count=catalog[j].keys.filter(selected).length;badge.hidden=count===0;
   badge.textContent=count===catalog[j].keys.length?'IN PROJECT':count+' / '+catalog[j].keys.length;
  });
  position.textContent=String(i+1).padStart(2,'0')+' / 06';
  guide.href=item.guide;guide.firstChild.textContent=item.label+' ';
 }
 function navigate(delta){const i=(current()+delta+tabs.length)%tabs.length;tabs[i].click();tabs[i].scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});sync();}
 previous.addEventListener('click',()=>navigate(-1));next.addEventListener('click',()=>navigate(1));
 tabs.forEach(tab=>{
  tab.addEventListener('click',sync);
  // V45's existing Arrow/Home/End listener runs first and updates aria-selected.
  tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))queueMicrotask(sync);});
 });
 canonical.forEach(b=>new MutationObserver(sync).observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 root.querySelector('#v72-open-project').addEventListener('click',()=>document.getElementById('v42-open')?.click());
 // Original V45 add/plan and V60 comparison buttons can change canonical state.
 root.querySelector('#v45-add')?.addEventListener('click',sync);
 root.querySelector('#v60-use')?.addEventListener('click',sync);
 sync();
})();
