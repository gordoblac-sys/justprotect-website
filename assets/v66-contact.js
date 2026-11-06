/* V66 / Conversation Gateway: upgrade the existing contact section in place.
 * Preview-only focus, canonical project summary, and explicit existing-plan access.
 * No network calls, storage, selection mutation or automatic email sending. */
(()=>{'use strict';
 const root=document.getElementById('contact');if(!root)return;
 const picks=[...root.querySelectorAll('[data-v18-service]')];
 const image=root.querySelector('#v66-visual-image'),title=root.querySelector('#v66-visual-title'),question=root.querySelector('#v66-visual-question'),guide=root.querySelector('#v66-visual-guide'),index=root.querySelector('#v66-visual-index');
 const summary=root.querySelector('#v66-current-summary'),readiness=root.querySelector('#v66-current-readiness'),meter=root.querySelector('#v66-current-meter-fill'),review=root.querySelector('#v66-review-plan');
 if(picks.length!==5||!image||!review)return;
 const catalog=[
  {key:'tv',title:'TV & theater',image:'scene-entertainment.svg',guide:'tv-mounting.html',question:'Where will the screen go, and what cable route works for your room?'},
  {key:'starlink',title:'Starlink',image:'scene-connectivity.svg',guide:'starlink.html',question:'What mounting location, sky visibility and cable entry should we discuss?'},
  {key:'network',title:'Networking & wiring',image:'scene-network.svg',guide:'networking.html',question:'Which rooms need connections, and where will your network equipment live?'},
  {key:'smart',title:'Smart home & security',image:'scene-smart.svg',guide:'smart-home-security.html',question:'Which devices, entry points and existing systems should work together?'},
  {key:'audio',title:'Audio / video',image:'scene-audio.svg',guide:'audio-video.html',question:'Where should sound be heard, and how should speakers and cables be placed?'}
 ];
 function preview(i){const item=catalog[i];if(!item)return;
  image.src='assets/'+item.image;image.alt='Original illustrated '+item.title+' installation concept; not a photograph of completed work';
  title.textContent=item.title;question.textContent=item.question;guide.href='services/'+item.guide;guide.setAttribute('aria-label','Read '+item.title+' installation guide');index.textContent=String(i+1).padStart(2,'0')+'—05';
  picks.forEach((button,n)=>button.classList.toggle('v66-previewing',n===i));
 }
 picks.forEach((button,i)=>{
  button.addEventListener('focus',()=>preview(i));button.addEventListener('pointerenter',()=>preview(i));
  button.addEventListener('keydown',event=>{
   if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
   event.preventDefault();const d=event.key==='ArrowRight'||event.key==='ArrowDown'?1:-1;
   const next=event.key==='Home'?0:event.key==='End'?picks.length-1:(i+d+picks.length)%picks.length;
   picks[next].focus();
  });
 });
 const lab=[...document.querySelectorAll('[data-v40-service]')];const state=document.getElementById('v42-state');
 const labels={tv:'TV & theater',starlink:'Starlink',network:'Networking',smart:'Smart home',audio:'Audio / video'};
 function sync(){const keys=lab.filter(button=>button.getAttribute('aria-pressed')==='true').map(button=>button.dataset.v40Service);
  const where=state?.value||document.getElementById('v40-state')?.value||'';
  const count=keys.length;
  summary.textContent=count?count+' '+(count===1?'specialty':'specialties')+' in your private plan: '+keys.map(k=>labels[k]||k).join(' + ')+'.': 'No services selected yet. Your editable project can include multiple specialties.';
  readiness.textContent=count&&where?'Services and '+where+' selected. Review your plan before sharing.':count?'Next: choose a project state. Nothing has been sent.':'Start with any specialty; no information is submitted automatically.';
  meter.style.width=(Number(count>0)+Number(Boolean(where)))*50+'%';
  review.textContent=count?'REVIEW '+count+' SELECTED '+(count===1?'SERVICE':'SERVICES')+' ↗':'OPEN MY PROJECT WORKSPACE ↗';
 }
 review.addEventListener('click',()=>{document.getElementById('v42-open')?.click();});
 const countSource=document.getElementById('v42-dock-count');if(countSource)new MutationObserver(sync).observe(countSource,{childList:true,characterData:true,subtree:true});
 state?.addEventListener('change',sync);document.getElementById('v40-state')?.addEventListener('change',sync);
 preview(0);sync();
})();
