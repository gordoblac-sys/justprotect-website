/* V65 Territory Studio: presentation, explicit local handoff, and accessibility.
   Preserves original V20 state tiles, ZIP field and V43/V54 canonical request.
   No coverage lookup, network request or automatic transmission. */
(()=>{
 'use strict';
 const section=document.querySelector('.v65-territory');
 if(!section)return;
 const tiles=[...section.querySelectorAll('[data-v20-state]')];
 const zip=section.querySelector('#v20-zip');
 const plan=section.querySelector('#v20-plan');
 const clear=section.querySelector('#v65-clear-zip');
 const reuse=section.querySelector('#v65-use-project');
 const readiness=section.querySelector('#v65-readiness');
 const project=section.querySelector('#v65-project-status');
 const counter=section.querySelector('.v65-state-counter');
 const states=['Illinois','Indiana','Michigan','Ohio'];
 const names={Illinois:'IL',Indiana:'IN',Michigan:'MI',Ohio:'OH'};
 const lab=[...document.querySelectorAll('[data-v40-service]')];
 const current=()=>tiles.find(b=>b.getAttribute('aria-pressed')==='true')||tiles[0];
 const active=()=>lab.filter(b=>b.getAttribute('aria-pressed')==='true').length;
 const clean=s=>String(s||'').replace(/\D/g,'').slice(0,5);
 function refresh(){
   const selected=current().dataset.v20State;
   const value=clean(zip.value);
   const count=active();
   clear.disabled=!value;
   counter.innerHTML=String(states.indexOf(selected)+1).padStart(2,'0')+' <span>/ 04</span>';
   section.querySelectorAll('[data-v65-node]').forEach(node=>node.classList.toggle('is-active',node.dataset.v65Node===selected));
   readiness.textContent=value.length===5
     ? selected+' · '+value+' — ready to include in your request.'
     : selected+' selected — '+(value.length?'ZIP needs '+(5-value.length)+' more digit'+(5-value.length===1?'':'s')+'.':'add a five-digit project ZIP.');
   project.textContent=count
     ? count+' service'+(count===1?'':'s')+' in your project. We will confirm address availability before scheduling.'
     : 'No services selected yet. Your location can be carried into the service builder.';
   plan.textContent=count?'Continue to project location ↗':'Choose services & continue ↗';
   let savedState='',savedZip='';
   try{savedState=data.state||'';savedZip=clean(data.zip)}catch(e){/* data is only used after original wizard initializes */ }
   const reusable=states.includes(savedState)&&savedZip.length===5&&(savedState!==selected||savedZip!==value);
   reuse.hidden=!reusable;
 }
 // Native button click/press remains in place. Add arrow/Home/End roving navigation.
 tiles.forEach((tile,i)=>{
   tile.addEventListener('keydown',e=>{
     const keys=['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'];
     if(!keys.includes(e.key))return;
     e.preventDefault();
     const next=e.key==='Home'?0:e.key==='End'?tiles.length-1:
       (i+(e.key==='ArrowRight'||e.key==='ArrowDown'?1:-1)+tiles.length)%tiles.length;
     tiles[next].click();tiles[next].focus();
   });
   // Existing V20 handler runs first and clears the ZIP on state changes.
   tile.addEventListener('click',refresh);
 });
 zip.addEventListener('input',refresh);
 clear.addEventListener('click',()=>{
   zip.value='';zip.dispatchEvent(new Event('input',{bubbles:true}));zip.focus();
 });
 reuse.addEventListener('click',()=>{
   let savedState='',savedZip='';
   try{savedState=data.state;savedZip=clean(data.zip)}catch(e){return;}
   if(!states.includes(savedState)||savedZip.length!==5)return;
   const tile=tiles.find(b=>b.dataset.v20State===savedState);
   tile.click();zip.value=savedZip;zip.dispatchEvent(new Event('input',{bubbles:true}));
   readiness.textContent='Your existing project location is ready to include. Availability is not confirmed.';
   zip.focus();
 });
 // Capture prevents the legacy V20 handler from skipping service selection.
 // The original V43 wizard and V54 location form remain the only canonical inputs.
 plan.addEventListener('click',e=>{
   e.preventDefault();e.stopImmediatePropagation();
   const state=current().dataset.v20State;
   const value=clean(zip.value);
   data.state=state;data.zip=value;
   const count=active();
   openWizard();
   if(count){
     step=1;render();
     document.getElementById('f_zip')?.focus();
   }else{
     step=0;render();
     document.querySelector('#wizard [data-v43-service]')?.focus();
   }
 },true);
 // The live count also follows service selection in the existing Design Lab/Wayfinder.
 lab.forEach(button=>new MutationObserver(refresh).observe(button,{attributes:true,attributeFilter:['aria-pressed']}));
 document.addEventListener('click',e=>{
   if(e.target.closest('#wizard,.v42-panel,.v62-services-panel,.v44-navigator'))setTimeout(refresh,0);
 });
 refresh();
})();
