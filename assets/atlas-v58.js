(()=>{'use strict';
 const root=document.getElementById('atlas-panel');if(!root)return;
 const data=JSON.parse(document.getElementById('atlas-data').textContent);
 const tabs=[...document.querySelectorAll('.atlas-item')],partner=document.getElementById('atlas-partner');
 const questions=document.getElementById('v58-questions'),counter=document.getElementById('v58-prep-count'),feedback=document.getElementById('v58-share-status');
 const prompts=[
  ['Note screen size and the proposed mounting wall.','Identify power, connected equipment and nearby outlets.','Decide whether visible or concealed cable routing is preferred.'],
  ['Consider the proposed mounting location and sky view.','Identify a potential weather-safe cable entry route.','Choose where indoor networking equipment could sit.'],
  ['List rooms and devices that need wired connectivity.','Identify a possible network cabinet and power location.','Consider the cable paths between floors or rooms.'],
  ['List the connected devices and ecosystems you already use.','Note the locations of entry points and devices.','Check where power and network connections may be needed.'],
  ['List existing speakers, displays and source equipment.','Consider speaker positions and listening areas.','Decide where cables and controls could be located.']
 ];
 // In-page memory only; changing tabs never loses considered checkpoints.
 const considered=data.map(()=>new Set());
 const active=()=>Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));
 const slugIndex=s=>data.findIndex(x=>x.slug===s);
 function paint(){const i=active();questions.replaceChildren();prompts[i].forEach((text,n)=>{
   const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=considered[i].has(n);input.dataset.check=String(n);
   input.addEventListener('change',()=>{if(input.checked)considered[i].add(n);else considered[i].delete(n);counter.textContent=considered[i].size+' / 3';});
   label.append(input,document.createTextNode(text));questions.append(label);
 });counter.textContent=considered[i].size+' / 3';feedback.textContent='';}
 // The existing Copy/Download/Email actions retain their original handlers; this getter adds
 // only the user's current optional readiness selections to their existing local outline.
 window.justProtectAtlasReadinessLines=()=>prompts[active()].map((q,n)=>(considered[active()].has(n)?'[x] ':'[ ] ')+q);
 window.justProtectAtlasLink=slug=>{const u=new URL(location.href==='about:blank'?document.baseURI:location.href);u.searchParams.set('atlas',slug);u.hash='atlas-explore';return u.toString()};
 const actualWeb=()=>/^https?:$/.test(location.protocol)&&!location.hostname.endsWith('.invalid');
 function sync(){paint();if(actualWeb()){
   try{const url=new URL(location.href);url.searchParams.set('atlas',data[active()].slug);history.replaceState(history.state,'',url)}catch(_){/* opaque test or file origins */}
 }}
 tabs.forEach(t=>{t.addEventListener('click',sync);t.addEventListener('keydown',e=>{
   if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key))setTimeout(sync,20);
 });});
 document.querySelectorAll('.atlas-goal').forEach(g=>g.addEventListener('click',sync));
 document.getElementById('v58-share').addEventListener('click',async()=>{
   if(!actualWeb()){feedback.textContent='Service links become shareable after the website is published. Your current selections remain local.';return;}
   try{await navigator.clipboard.writeText(window.justProtectAtlasLink(data[active()].slug));feedback.textContent='Service link copied. No project details were sent.'}
   catch(_){feedback.textContent='Clipboard unavailable. Copy the address from your browser instead.'}
 });
 const requested=window.__v58InitialSlug||new URLSearchParams(location.search).get('atlas');
 const initial=slugIndex(requested);if(initial>=0){tabs[initial].click();}else{paint();}
 // Browser back/forward on published sites can restore a specific service.
 window.addEventListener('popstate',()=>{const i=slugIndex(new URLSearchParams(location.search).get('atlas'));if(i>=0)tabs[i].click()});
})();
