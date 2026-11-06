/* V55 — Service Studio. Enhances V43's service buttons, never replaces its selection model. */
(()=>{'use strict';
 const panel=document.getElementById('wizardContent');
 if(!panel||typeof render!=='function'||typeof services==='undefined')return;
 const illustrations={
  'TV Mounting & Home Theater':{image:'scene-entertainment.svg',short:'TV / THEATER',heading:'MAKE ROOM.\nFOR THE MOMENT.',mobileHeading:'WATCH.\nBETTER.',description:'Start with screen placement, viewing comfort and a clean cable path.',guide:'services/tv-mounting.html',questions:['Where will the screen be viewed from?','Is there a clear cable and power route?','What equipment needs a home?']},
  'Starlink Installation':{image:'scene-connectivity.svg',short:'STARLINK',heading:'CONNECT.\nWITH INTENTION.',mobileHeading:'GO.\nONLINE.',description:'Plan equipment placement, exterior access and a thoughtful route inside.',guide:'services/starlink.html',questions:['Where might the dish have a clear view?','How will the cable enter the property?','Where will indoor equipment sit?']},
  'Networking & Structured Wiring':{image:'scene-network.svg',short:'NETWORKING',heading:'BUILT TO.\nSTAY CONNECTED.',mobileHeading:'WIRE.\nSMART.',description:'Think through wired coverage, device locations and organized infrastructure.',guide:'services/networking.html',questions:['Which rooms need wired connections?','Where will the network equipment live?','Is there access for cable routing?']},
  'Smart Home & Security':{image:'scene-smart.svg',short:'SMART HOME',heading:'A SMARTER.\nEVERYDAY.',mobileHeading:'LIVE.\nSMART.',description:'Map the devices and controls that fit the way the space is used.',guide:'services/smart-home-security.html',questions:['Which areas matter most?','What devices need reliable connectivity?','Where should controls be accessible?']},
  'Audio & Video Solutions':{image:'scene-audio.svg',short:'AUDIO / VIDEO',heading:'FEEL EVERY.\nDETAIL.',mobileHeading:'SOUND.\nBETTER.',description:'Consider sound, sightlines, equipment and a clean finished look.',guide:'services/audio-video.html',questions:['How will the space be used?','Where should speakers and displays sit?','What cables and equipment need concealing?']}
 };
 const pairs=[
  {label:'Theater + Audio',services:[services[0],services[4]]},
  {label:'Starlink + Networking',services:[services[1],services[2]]},
  {label:'Smart Home + Networking',services:[services[3],services[2]]}
 ];
 let focused=services[0],undoSnapshot=null,batching=false;
 const originalRender=render;
 const escape=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const selected=()=>[...panel.querySelectorAll('[data-v43-service][aria-pressed="true"]')].map(b=>b.dataset.v43Service);
 const buttonFor=(service)=>[...panel.querySelectorAll('[data-v43-service]')].find(b=>b.dataset.v43Service===service);
 function applySelection(target){
  batching=true;
  try{
   services.forEach(service=>{
    const b=buttonFor(service);if(!b)return;
    const want=target.includes(service),has=b.getAttribute('aria-pressed')==='true';
    if(want!==has)b.click(); // V43 performs the canonical sync with Design Lab, request text and sidebar.
   });
  }finally{batching=false;}
 }
 // A visitor changing a single existing service invalidates the one-time clear undo.
 panel.addEventListener('click',e=>{
  if(!batching&&e.target.closest('[data-v43-service]'))undoSnapshot=null;
 },true);
 function mount(){
  document.getElementById('wizard')?.classList.toggle('v55-service-open',step===0);
  const title=document.getElementById('wizardTitle');
  if(title)title.innerHTML=step===0?'YOUR SPACE.<br><em>YOUR PLAN.</em>':'BUILD IT.<br><em>YOUR WAY.</em>';
  if(step!==0)return;
  const choices=panel.querySelector('.v43-services');if(!choices)return;
  const hint=panel.querySelector('#v43-service-count');
  const active=selected();
  if(!active.includes(focused))focused=active[0]||focused;
  const studio=document.createElement('div');studio.className='v55-studio';
  studio.innerHTML=`<section class="v55-stage" aria-label="Installation concept preview">
    <div class="v55-stage-copy"><span class="v55-eyebrow">01 / YOUR INSTALLATION</span><h3 id="v55-stage-title"></h3><p id="v55-stage-desc"></p><a id="v55-guide" href="services/index.html">Explore service guide ↗</a></div>
    <figure class="v55-visual"><img id="v55-scene" src="assets/scene-entertainment.svg" width="1000" height="900" alt="Illustrated installation concept"><figcaption>ORIGINAL CONCEPT ART / NOT A PROJECT PHOTO</figcaption></figure>
   </section><div class="v55-select-area"><div class="v55-selector-head"><h4>CHOOSE WHAT YOU NEED.</h4><p>Pick one specialty or combine several. Your selections carry through to the request.</p></div></div>
   <section class="v55-selected" aria-label="Selected installation services"><div class="v55-selected-head"><strong>YOUR PROJECT MIX</strong><span id="v55-count"></span></div><div class="v55-chips" id="v55-chips"></div><p class="v55-empty" id="v55-empty">Nothing selected yet. Choose a service above.</p><div class="v55-undo-row"><button type="button" class="v55-clear" id="v55-clear">Clear services</button><button type="button" class="v55-undo" id="v55-undo" hidden>Undo clear ↶</button></div></section>
   <section class="v55-planning" aria-label="Questions to consider"><strong>THREE THINGS TO THINK THROUGH</strong><ul id="v55-questions"></ul></section>`;
  const area=studio.querySelector('.v55-select-area');area.append(choices);if(hint)area.append(hint);
  const shortcuts=document.createElement('div');shortcuts.className='v55-shortcuts';
  shortcuts.innerHTML='<div class="v55-shortcuts-head"><strong>COMMON COMBINATIONS</strong><span>Add both without removing your other services.</span></div><div class="v55-pair-grid" role="group" aria-label="Quick add service combinations"></div>';
  pairs.forEach(pair=>{
   const b=document.createElement('button');b.type='button';b.className='v55-pair';b.dataset.v55Pair=pair.label;
   b.innerHTML=escape(pair.label)+' <span class="v55-plus" aria-hidden="true">＋</span>';
   b.addEventListener('click',()=>{undoSnapshot=null;applySelection([...new Set([...selected(),...pair.services])]);const current=panel.querySelector('[data-v55-pair="'+pair.label+'"]');current?.focus();});
   shortcuts.querySelector('.v55-pair-grid').append(b);
  });
  area.append(shortcuts);panel.replaceChildren(studio);
  const allButtons=[...choices.querySelectorAll('[data-v43-service]')];
  function showPreview(name){
   const config=illustrations[name]||illustrations[services[0]];focused=name;
   const lines=(window.matchMedia('(max-width:540px)').matches?config.mobileHeading:config.heading).split('\n');
   studio.querySelector('#v55-stage-title').innerHTML=lines.map(escape).join('<br><em>')+(lines.length>1?'</em>':'');
   studio.querySelector('.v55-eyebrow').textContent='PREVIEW / '+config.short;
   studio.querySelector('#v55-stage-desc').textContent=config.description;
   studio.querySelector('#v55-scene').src='assets/'+config.image;
   studio.querySelector('#v55-scene').alt='Concept illustration for '+name+'; not a photograph of completed work';
   studio.querySelector('#v55-guide').href=config.guide;
   studio.querySelector('#v55-guide').textContent='Explore '+config.short.toLowerCase()+' guide ↗';
   studio.querySelector('#v55-questions').replaceChildren(...config.questions.map(q=>{const li=document.createElement('li');li.textContent=q;return li;}));
  }
  allButtons.forEach((b,i)=>{
   b.addEventListener('focus',()=>showPreview(b.dataset.v43Service));
   b.addEventListener('mouseenter',()=>showPreview(b.dataset.v43Service));
   b.addEventListener('keydown',e=>{
    const keys=['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'];if(!keys.includes(e.key))return;
    e.preventDefault();
    const delta=e.key==='ArrowRight'||e.key==='ArrowDown'?1:-1;
    const next=e.key==='Home'?0:e.key==='End'?allButtons.length-1:(i+delta+allButtons.length)%allButtons.length;
    allButtons[next].focus();
   });
  });
  showPreview(focused);
  const chips=studio.querySelector('#v55-chips');
  active.forEach(name=>{
   const chip=document.createElement('button');chip.type='button';chip.className='v55-chip';chip.setAttribute('aria-label','Remove '+name+' from project');
   chip.append(document.createTextNode(name));const cross=document.createElement('span');cross.textContent='×';cross.setAttribute('aria-hidden','true');chip.append(cross);
   chip.addEventListener('click',()=>{undoSnapshot=null;buttonFor(name)?.click();});chips.append(chip);
  });
  studio.querySelector('#v55-count').textContent=active.length+' of 5 selected';
  studio.querySelector('#v55-empty').hidden=active.length>0;
  const clear=studio.querySelector('#v55-clear');clear.disabled=active.length===0;
  clear.addEventListener('click',()=>{if(!selected().length)return;undoSnapshot=selected();applySelection([]);});
  const undo=studio.querySelector('#v55-undo');undo.hidden=!undoSnapshot?.length;
  undo.addEventListener('click',()=>{if(!undoSnapshot)return;const restore=[...undoSnapshot];undoSnapshot=null;applySelection(restore);});
  studio.querySelectorAll('[data-v55-pair]').forEach(b=>{
   const pair=pairs.find(p=>p.label===b.dataset.v55Pair);
   const on=pair.services.every(s=>active.includes(s));b.disabled=on;b.setAttribute('aria-disabled',String(on));
   b.title=on?'Both services are already in your project':'Add both services to your project';
  });
 }
 render=function(){originalRender();mount();};
})();
