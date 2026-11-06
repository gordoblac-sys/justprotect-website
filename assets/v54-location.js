/* V54 — Location Studio. Enhances the existing wizard's second step without changing data contracts. */
(()=>{'use strict';
 const panel=document.getElementById('wizardContent');
 if(!panel||typeof render!=='function'||typeof data==='undefined')return;
 const states=['Illinois','Indiana','Michigan','Ohio'];
 const liveList=document.querySelector('#wizard .v43-livecard dl');
 if(liveList&&!document.getElementById('v54-summary-property')){
  const item=document.createElement('div');
  item.innerHTML='<dt>Property type</dt><dd id="v54-summary-property">Home</dd>';
  liveList.append(item);
 }
 function syncPropertySummary(){const label=document.getElementById('v54-summary-property');if(label)label.textContent=({Home:'Residential',Business:'Commercial',Other:'Other space'})[data.property]||'Not selected';}
 const properties=[['Home','Residential'],['Business','Commercial'],['Other','Other space']];
 const tips={Home:'Think about where the equipment will go and which walls or exterior areas may need access.',Business:'Consider site access, working hours, and where networking or installation equipment can be placed.',Other:'Describe the space and any special access requirements in your project notes.'};
 const make=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;};
 function mount(){
  if(step!==1)return;
  const state=panel.querySelector('#f_state'),zip=panel.querySelector('#f_zip'),property=panel.querySelector('#f_property');
  if(!state||!zip||!property)return;
  const stateField=state.closest('.field'),zipField=zip.closest('.field'),propertyField=property.closest('.field');
  const header=make('header','v54-location-head');
  header.innerHTML='<span class="v54-kicker">02 / PROJECT LOCATION</span><h3>WHERE WILL<br><em>IT LIVE?</em></h3><p>Tell us about the site. We will review location, access and project scope with you—these choices do not confirm availability.</p><span class="v54-head-art" aria-hidden="true">IL · IN<br>MI · OH</span>';
  const stateBlock=make('section','v54-location-block');stateBlock.setAttribute('aria-labelledby','v54-state-label');
  const stateTitle=make('h4','v54-block-title','01  /  CHOOSE YOUR STATE');stateTitle.id='v54-state-label';
  const stateGrid=make('div','v54-state-grid');stateGrid.setAttribute('role','group');stateGrid.setAttribute('aria-label','Project state quick choices');
  states.forEach((s,i)=>{
   const b=make('button','v54-state-tile');b.type='button';b.dataset.v54State=s;
   b.innerHTML='<span class="v54-tile-index">0'+(i+1)+'</span><span class="v54-tile-name">'+s+'</span><span class="v54-tile-mark" aria-hidden="true">↗</span>';
   b.addEventListener('click',()=>{state.value=s;state.dispatchEvent(new Event('input',{bubbles:true}));state.dispatchEvent(new Event('change',{bubbles:true}));sync();});
   stateGrid.append(b);
  });
  stateBlock.append(stateTitle,stateGrid);
  const propertyBlock=make('section','v54-location-block');propertyBlock.setAttribute('aria-labelledby','v54-property-label');
  const propertyTitle=make('h4','v54-block-title','02  /  WHAT KIND OF SPACE?');propertyTitle.id='v54-property-label';
  const propertyGrid=make('div','v54-property-grid');propertyGrid.setAttribute('role','group');propertyGrid.setAttribute('aria-label','Property type quick choices');
  const symbols={Home:'⌂',Business:'▦',Other:'◇'};
  properties.forEach(([value,label])=>{
   const b=make('button','v54-property-tile');b.type='button';b.dataset.v54Property=value;
   b.innerHTML='<span class="v54-property-symbol" aria-hidden="true">'+symbols[value]+'</span><span>'+label+'</span><span class="v54-property-check" aria-hidden="true">✓</span>';
   b.addEventListener('click',()=>{property.value=value;property.dispatchEvent(new Event('input',{bubbles:true}));property.dispatchEvent(new Event('change',{bubbles:true}));sync();});
   propertyGrid.append(b);
  });
  propertyBlock.append(propertyTitle,propertyGrid);
  const zipBlock=make('section','v54-zip-block');
  const zipTitle=make('h4','v54-block-title','03  /  PROJECT ZIP CODE');
  zip.setAttribute('inputmode','numeric');zip.setAttribute('autocomplete','postal-code');zip.removeAttribute('maxlength');zip.setAttribute('pattern','[0-9]{5}');
  zip.setAttribute('aria-describedby','v54-zip-help');zip.placeholder='5-digit ZIP';
  const clear=make('button','v54-zip-clear','Clear ZIP');clear.type='button';clear.id='v54-zip-clear';
  clear.addEventListener('click',()=>{zip.value='';zip.dispatchEvent(new Event('input',{bubbles:true}));zip.focus();sync();});
  const zipRow=make('div','v54-zip-row');zipRow.append(zipField,clear);
  const zipHelp=make('p','v54-zip-help');zipHelp.id='v54-zip-help';
  zipBlock.append(zipTitle,zipRow,zipHelp);
  const ready=make('section','v54-ready');ready.setAttribute('aria-label','Project location readiness');
  ready.innerHTML='<div class="v54-ready-heading"><span>LOCATION READINESS</span><strong id="v54-ready-count">0 / 2</strong></div><div class="v54-ready-track" aria-hidden="true"><span id="v54-ready-fill"></span></div><p id="v54-ready-text" role="status" aria-live="polite"></p><p class="v54-site-tip" id="v54-site-tip"></p>';
  const fallback=make('details','v54-native');fallback.innerHTML='<summary>Prefer dropdowns? Use the original controls ↗</summary>';
  fallback.append(stateField,propertyField);
  panel.replaceChildren(header,stateBlock,propertyBlock,zipBlock,ready,fallback);
  const stateButtons=[...stateGrid.querySelectorAll('button')],propertyButtons=[...propertyGrid.querySelectorAll('button')];
  function keyboard(buttons,index,e){if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].focus();buttons[next].click();}
  stateButtons.forEach((b,i)=>b.addEventListener('keydown',e=>keyboard(stateButtons,i,e)));
  propertyButtons.forEach((b,i)=>b.addEventListener('keydown',e=>keyboard(propertyButtons,i,e)));
  function sync(){
   const selectedState=state.value,selectedProperty=property.value,validZip=/^\d{5}$/.test(zip.value);
   stateButtons.forEach(b=>{const on=b.dataset.v54State===selectedState;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',String(on));});
   propertyButtons.forEach(b=>{const on=b.dataset.v54Property===selectedProperty;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',String(on));});
   const complete=Number(states.includes(selectedState))+Number(validZip);
   ready.querySelector('#v54-ready-count').textContent=complete+' / 2';
   ready.querySelector('#v54-ready-fill').style.width=(complete*50)+'%';
   ready.querySelector('#v54-ready-text').textContent=complete===2?'Ready to continue. We still need to confirm availability and installation scope.':!selectedState?'Select a state and enter a five-digit ZIP.':'Enter a five-digit ZIP to continue.';
   zipHelp.textContent=zip.value.length===0?'We use this only to discuss the project location.':validZip?'ZIP format complete. This does not verify state/ZIP matching or service availability.':'Enter exactly five digits; no address is required.';
   clear.hidden=!zip.value;
   ready.querySelector('#v54-site-tip').textContent='SITE PLANNING / '+(tips[selectedProperty]||tips.Home);
   syncPropertySummary();
  }
  state.addEventListener('change',sync);property.addEventListener('change',sync);zip.addEventListener('input',()=>queueMicrotask(sync));
  sync();
 }
 const original=render;
 render=function(){original();document.getElementById('wizard')?.classList.toggle('v54-location-open',step===1);mount();syncPropertySummary();};
 syncPropertySummary();
})();
