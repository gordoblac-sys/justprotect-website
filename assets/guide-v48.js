(()=>{'use strict';
 const root=document.querySelector('[data-guide]');if(!root)return;
 const link=document.querySelector('[data-v48-guide-handoff]');if(!link)return;
 const slug=root.dataset.slug;
 link.href='../index.html?services='+encodeURIComponent(slug)+'#contact';
 link.addEventListener('click',()=>{
   const checks=[...document.querySelectorAll('.check input')];
   const note=document.getElementById('guide-notes')?.value.trim().slice(0,500)||'';
   const payload={version:48,created:Date.now(),slug,state:document.getElementById('guide-state')?.value||'',zip:document.getElementById('guide-zip')?.value||'',note,checked:checks.filter(c=>c.checked).map(c=>c.dataset.question)};
   // Store only on deliberate navigation. One-time, same-tab storage; do not transmit to any server.
   try{sessionStorage.setItem('justprotect-v48-guide-handoff',JSON.stringify(payload));}catch(e){/* Service selection still works via URL. */}
 });
})();
