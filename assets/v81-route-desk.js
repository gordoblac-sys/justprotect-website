/* V81 / Territory Routing Desk: progressive UI on original V20/V65 canonical controls.
   No new storage, network requests, address verification or submission. */
(()=>{
 'use strict';
 const root=document.querySelector('.v81-route-desk');if(!root)return;
 const states=[...root.querySelectorAll('[data-v20-state]')];
 const zip=root.querySelector('#v20-zip');
 const serviceButtons=[...document.querySelectorAll('[data-v40-service]')];
 const selectedName=root.querySelector('#v81-selected-region');
 const selectedCode=root.querySelector('#v81-selected-code');
 const progress=root.querySelector('#v81-ready-meter');
 const count=root.querySelector('#v81-ready-count');
 const fill=root.querySelector('#v81-ready-fill');
 const review=root.querySelector('#v81-review');
 const copy=root.querySelector('#v81-copy');
 const copyStatus=root.querySelector('#v81-copy-status');
 const abbreviations={Illinois:'IL',Indiana:'IN',Michigan:'MI',Ohio:'OH'};
 const services=()=>serviceButtons.filter(b=>b.getAttribute('aria-pressed')==='true');
 const state=()=>states.find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.v20State||'Illinois';
 const zipValue=()=>zip.value.replace(/\D/g,'').slice(0,5);
 function refresh(){
   const current=state(),index=states.findIndex(b=>b.dataset.v20State===current)+1;
   const serviceCount=services().length,validZip=zipValue().length===5;
   const steps=[true,validZip,serviceCount>0];const ready=steps.filter(Boolean).length;
   selectedName.textContent=current.toUpperCase();
   selectedCode.textContent=abbreviations[current]+' / '+String(index).padStart(2,'0')+' OF 04';
   count.textContent=ready+' / 3';progress.setAttribute('aria-valuenow',String(ready));
   progress.setAttribute('aria-valuetext',ready+' of 3 preparation steps complete');
   fill.style.width=(ready/3*100)+'%';
   ['state','zip','services'].forEach((key,i)=>{
     const el=root.querySelector('#v81-step-'+key);
     el.dataset.ready=String(steps[i]);el.querySelector('b').textContent=steps[i]?'READY':'TO DO';
   });
   review.textContent=serviceCount?'REVIEW MY PROJECT ↗':'CHOOSE INSTALLATIONS ↗';
   copy.disabled=!validZip;
   copy.setAttribute('aria-label',validZip?'Copy private project location and service summary':'Enter a five-digit ZIP before copying location');
 }
 // Existing V20 handlers run first; V65 then updates its own preview.
 states.forEach(b=>b.addEventListener('click',refresh));
 zip.addEventListener('input',refresh);
 serviceButtons.forEach(b=>new MutationObserver(refresh).observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
 root.querySelector('#v65-clear-zip')?.addEventListener('click',refresh);
 root.querySelector('#v65-use-project')?.addEventListener('click',refresh);
 review.addEventListener('click',()=>{
   if(services().length){document.querySelector('#v42-open')?.click();return;}
   const target=document.querySelector('[data-v49-service]')||serviceButtons[0];
   if(target){target.scrollIntoView({behavior:'auto',block:'center'});target.focus({preventScroll:true});}
 });
 copy.addEventListener('click',async()=>{
   if(zipValue().length!==5)return;
   const names=services().map(b=>b.dataset.v40Service||b.textContent.trim());
   const summary='Just Protect / Private project location\nState: '+state()+'\nZIP: '+zipValue()+'\nServices: '+(names.length?names.join(', '):'Not yet selected')+'\nAddress availability and installation feasibility require confirmation. This is not a submitted request.';
   let ok=false;
   try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(summary);ok=true;}}catch(e){}
   if(!ok){
     const field=document.createElement('textarea');field.value=summary;field.setAttribute('aria-hidden','true');field.style.cssText='position:fixed;top:0;left:-9999px';document.body.append(field);field.select();
     try{ok=document.execCommand('copy');}catch(e){}field.remove();
   }
   copyStatus.textContent=ok?'Location summary copied locally. Nothing was sent.':'Copy unavailable in this browser. Your location remains here; no request was sent.';
 });
 refresh();
})();
