/* V84: visual layer for original V16 comparison. Canonical project selection is V40/V42 only. */
(()=>{'use strict';
 const root=document.getElementById('transformation');if(!root)return;
 const tabs=[...root.querySelectorAll('[data-v84-scene]')],positions=[...root.querySelectorAll('[data-v84-position]')];
 const range=root.querySelector('#v16-range'),before=root.querySelector('#v84-art-before'),after=root.querySelector('#v84-art-after');
 const title=root.querySelector('#v84-panel-title'),copy=root.querySelector('#v84-panel-copy'),points=root.querySelector('#v84-panel-points');
 const guide=root.querySelector('#v84-guide'),add=root.querySelector('#v84-add'),state=root.querySelector('#v84-plan-state'),status=root.querySelector('#v84-status');
 const original=root.querySelector('.v84-original-wizard');
 const lab=[...document.querySelectorAll('[data-v40-service]')];
 if(tabs.length!==3||positions.length!==3||!range||!before||!after||!title||!copy||!points||!guide||!add||lab.length!==5)return;
 const scenes={
  tv:{key:'tv',label:'TV & THEATER',name:'TV & theater',img:'assets/scene-entertainment.svg',guide:'services/tv-mounting.html',title:'MAKE THE SCREEN FEEL BUILT IN.',copy:'A cleaner-looking entertainment space starts with placement, equipment and cable access.',questions:['Viewing height and wall construction','Power and concealed cable paths','Equipment placement and access'],wizard:'TV Mounting & Home Theater'},
  network:{key:'network',label:'NETWORKING',name:'Networking',img:'assets/scene-network.svg',guide:'services/networking.html',title:'PUT THE CONNECTIONS IN ORDER.',copy:'Plan the network location, cabling paths and access points before the equipment is installed.',questions:['Which rooms need wired connections?','Where can equipment safely live and receive power?','How will cables be routed and identified?'],wizard:'Networking & Structured Wiring'},
  smart:{key:'smart',label:'SMART HOME & SECURITY',name:'Smart home & security',img:'assets/scene-smart.svg',guide:'services/smart-home-security.html',title:'MAKE EVERY DEVICE FEEL INTENTIONAL.',copy:'A thoughtful connected-property plan considers placement, network requirements and future access.',questions:['Which doors, rooms and devices matter most?','What power and network access is available?','Which existing systems must be compatible?'],wizard:'Smart Home & Security'}
 };
 let current='tv';
 const selected=k=>lab.some(b=>b.dataset.v40Service===k&&b.getAttribute('aria-pressed')==='true');
 function syncSelection(){const d=scenes[current],yes=selected(d.key);state.textContent=yes?'IN YOUR PROJECT':'NOT IN PROJECT';state.dataset.selected=String(yes);add.dataset.selected=String(yes);add.textContent=yes?'✓ SELECTED — REVIEW PROJECT':'+ ADD TO MY PROJECT';add.setAttribute('aria-label',yes?'Review your private project including '+d.name:'Add '+d.name+' to your private project');}
 function show(key){const d=scenes[key];if(!d)return;current=key;
  tabs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v84Scene===key)));
  before.src=after.src=d.img;before.alt='Conceptual '+d.name+' scene with open planning questions';after.alt='Conceptual '+d.name+' scene with considered installation routes';
  title.textContent=d.title;copy.textContent=d.copy;points.replaceChildren(...d.questions.map(q=>{const li=document.createElement('li');li.textContent=q;return li;}));
  guide.href=d.guide;guide.setAttribute('aria-label','Read original '+d.name+' installation guide');
  root.querySelector('#v84-scene-number').textContent=String(tabs.findIndex(t=>t.dataset.v84Scene===key)+1).padStart(2,'0');
  root.querySelector('#v84-panel-index').textContent=root.querySelector('#v84-scene-number').textContent;
  root.querySelector('#v84-scene-label').textContent=d.label;
  original.textContent='Start a '+d.name+' request ↗';
  original.setAttribute('onclick',"openWizard("+JSON.stringify(d.wizard)+")");
  range.setAttribute('aria-label','Compare open planning questions and a planned '+d.name+' illustration');
  syncSelection();status.textContent='Previewing '+d.name+'. Nothing has been sent or stored.';
 }
 function syncRange(){const v=Number(range.value);positions.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.v84Position)===v)));root.querySelector('#v84-slider-value').textContent=v===0?'PLANNED VIEW':v===100?'QUESTIONS VIEW':v+'% SPLIT';range.setAttribute('aria-valuetext',v===0?'Planned concept':v===100?'Planning questions':v+' percent split');}
 tabs.forEach((b,i)=>{b.addEventListener('click',()=>show(b.dataset.v84Scene));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].focus();show(tabs[next].dataset.v84Scene);});});
 positions.forEach(b=>b.addEventListener('click',()=>{range.value=b.dataset.v84Position;range.dispatchEvent(new Event('input',{bubbles:true}));syncRange();range.focus({preventScroll:true});}));
 range.addEventListener('input',syncRange);
 add.addEventListener('click',()=>{const d=scenes[current];if(selected(d.key)){document.getElementById('v42-open')?.click();status.textContent='Opened your private project. No request was sent.';return;}lab.find(b=>b.dataset.v40Service===d.key)?.click();syncSelection();status.textContent=d.name+' added to your private project. No request was sent.';});
 root.querySelector('#v84-workspace').addEventListener('click',()=>{document.getElementById('v42-open')?.click();status.textContent='Opened your private project. Nothing was sent.';});
 lab.forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(syncSelection)));
 document.querySelectorAll('[data-v41-preset],[data-v42-service],[data-v55-service]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(syncSelection)));
 const count=document.getElementById('v42-dock-count');if(count)new MutationObserver(syncSelection).observe(count,{childList:true,subtree:true,characterData:true});
 show('tv');syncRange();
})();
