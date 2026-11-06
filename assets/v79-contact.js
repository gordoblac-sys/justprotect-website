/* V79 Signal Desk: a presentation layer over original V18/V66 controls.
   No new storage, network requests, or automatic email; all project changes use canonical V40 buttons. */
(()=>{'use strict';
 const root=document.getElementById('contact');if(!root)return;
 const picks=[...root.querySelectorAll('[data-v18-service]')];
 const prev=root.querySelector('#v79-scene-prev'),next=root.querySelector('#v79-scene-next');
 const count=root.querySelector('#v79-scene-count'),list=root.querySelector('#v79-considerations');
 const add=root.querySelector('#v79-add-preview'),status=root.querySelector('#v79-scene-status');
 const lab=[...document.querySelectorAll('[data-v40-service]')];
 if(picks.length!==5||!prev||!next||!count||!list||!add||lab.length!==5)return;
 const items=[
  {key:'tv',label:'TV & theater',checks:['Viewing height and wall construction','Mounting hardware and equipment','Power and cable routing']},
  {key:'starlink',label:'Starlink',checks:['Potential sky obstructions','Safe mount and access location','Weatherproof cable entry and router location']},
  {key:'network',label:'Networking',checks:['Rooms and wired connection points','Equipment location and power','Cable pathways and wireless coverage']},
  {key:'smart',label:'Smart home',checks:['Priority entry points and devices','Power and network needs','Existing equipment and compatibility']},
  {key:'audio',label:'Audio / video',checks:['Listening zones and speaker positions','Equipment and source locations','Signal and cable pathways']}
 ];
 let active=0;
 const selected=key=>lab.some(b=>b.dataset.v40Service===key&&b.getAttribute('aria-pressed')==='true');
 function render(){const item=items[active],inPlan=selected(item.key);
  count.textContent=String(active+1).padStart(2,'0')+' / 05';
  list.replaceChildren(...item.checks.map(v=>{const li=document.createElement('li');li.textContent=v;return li;}));
  add.dataset.added=String(inPlan);
  add.textContent=inPlan?'✓ IN PROJECT — REVIEW':'+ ADD '+item.label.toUpperCase()+' TO PROJECT';
  add.setAttribute('aria-label',inPlan?'Review your private project containing '+item.label:'Add '+item.label+' to your private project');
  status.textContent=inPlan?item.label+' is already selected in your private plan. Nothing has been sent.':'Preview only. '+item.label+' has not been added.';
  picks.forEach((b,i)=>{const on=selected(items[i].key);b.dataset.v79Selected=String(on);const badge=b.querySelector('.v79-pick-status');if(badge)badge.textContent=on?'IN PROJECT':'PREVIEW';});
 }
 function show(i){active=(i+items.length)%items.length;
  // Reuse the original V66 preview handler; no service is selected by browsing.
  picks[active].dispatchEvent(new Event('pointerenter'));
  render();
 }
 picks.forEach((b,i)=>{
  b.addEventListener('focus',()=>{active=i;render()});
  b.addEventListener('pointerenter',()=>{active=i;render()});
 });
 prev.addEventListener('click',()=>show(active-1));next.addEventListener('click',()=>show(active+1));
 [prev,next].forEach(b=>b.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();show(e.key==='Home'?0:e.key==='End'?items.length-1:active+(e.key==='ArrowRight'?1:-1));
 }));
 add.addEventListener('click',()=>{const item=items[active];if(selected(item.key)){
   document.getElementById('v42-open')?.click();return;
  }
  lab.find(b=>b.dataset.v40Service===item.key)?.click();render();
 });
 lab.forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(render)));
 document.querySelectorAll('[data-v41-preset],[data-v42-service],[data-v55-service]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(render)));
 const dock=document.getElementById('v42-dock-count');if(dock)new MutationObserver(render).observe(dock,{childList:true,characterData:true,subtree:true});
 show(0);
})();
