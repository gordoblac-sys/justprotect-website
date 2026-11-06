/* V60: optional, page-memory-only two-concept comparison inside V45 Casebook. */
(()=>{'use strict';
 const root=document.getElementById('v60-compare');if(!root)return;
 const catalog=[
  {slug:'screen',tag:'THE SCREEN',title:'A media room, refined.',img:'assets/scene-entertainment.svg',description:'TV placement, power access and cable paths planned around the room.',keys:['tv'],questions:['Screen size, wall type and viewing height','Outlet location and cable routing','Devices, speakers and room layout']},
  {slug:'connection',tag:'THE CONNECTION',title:'Connected beyond the street.',img:'assets/scene-connectivity.svg',description:'Consider clear-sky visibility, routing and the equipment location.',keys:['starlink'],questions:['Clear-sky visibility and potential obstructions','Mounting surface and safe cable entry','Router placement and network distribution']},
  {slug:'network',tag:'THE NETWORK',title:'A network with room to grow.',img:'assets/scene-network.svg',description:'Organized cabling and practical equipment access for connected spaces.',keys:['network'],questions:['Locations needing wired connections','Cable routes and accessible pathways','Equipment space, ventilation and power']},
  {slug:'control',tag:'THE CONTROL',title:'Everyday tech, considered.',img:'assets/scene-smart.svg',description:'Explore compatible devices, sensible placement and everyday routines.',keys:['smart'],questions:['Existing systems and device compatibility','Coverage goals and device positions','Reliable connectivity and control preferences']},
  {slug:'sound',tag:'THE SOUND',title:'Hear the difference in the details.',img:'assets/scene-audio.svg',description:'Plan speaker positions, component access and a cleaner media space.',keys:['audio'],questions:['Room dimensions and listening positions','Speaker and component placement','Cable concealment and equipment access']},
  {slug:'property',tag:'THE PROPERTY',title:'One connected property.',img:'assets/scene-property.svg',description:'A combined plan for wiring, security and the spaces in between.',keys:['network','smart','audio'],questions:['Areas and buildings to connect','Equipment locations and cable pathways','Security, connectivity and media priorities']}
 ];
 const names={tv:'TV Mounting & Home Theater',starlink:'Starlink Installation',network:'Networking & Structured Wiring',smart:'Smart Home & Security',audio:'Audio & Video Solutions'};
 const tabs=[...document.querySelectorAll('[data-v45-index]')];
 const pin=document.getElementById('v60-pin'),slots=document.getElementById('v60-slots'),count=document.getElementById('v60-count'),status=document.getElementById('v60-status');
 const use=document.getElementById('v60-use'),swap=document.getElementById('v60-swap'),copy=document.getElementById('v60-copy'),download=document.getElementById('v60-download'),link=document.getElementById('v60-link');
 let saved=[];
 const current=()=>{const i=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');return Math.max(0,i)};
 const message=t=>{status.textContent=t};
 function card(i,pos){const c=catalog[i],el=document.createElement('article');el.className='v60-card';
  const art=document.createElement('div');art.className='v60-card-art';
  const img=document.createElement('img');img.src=c.img;img.alt='Concept illustration: '+c.tag.toLowerCase();img.loading='lazy';img.width=1000;img.height=900;
  const stamp=document.createElement('span');stamp.textContent=String(pos+1).padStart(2,'0')+' / '+c.tag;art.append(img,stamp);
  const body=document.createElement('div');body.className='v60-card-content';
  const title=document.createElement('h5');title.textContent=c.title;
  const desc=document.createElement('p');desc.textContent=c.description;
  const label=document.createElement('strong');label.textContent='Planning considerations';
  const list=document.createElement('ul');c.questions.forEach(q=>{const li=document.createElement('li');li.textContent=q;list.append(li)});
  const actions=document.createElement('div');actions.className='v60-card-actions';
  const view=document.createElement('button');view.type='button';view.textContent='VIEW IDEA ↗';view.addEventListener('click',()=>{tabs[i].click();tabs[i].focus({preventScroll:true});document.getElementById('v45-stage-tag')?.scrollIntoView({block:'center',behavior:'smooth'});});
  const remove=document.createElement('button');remove.type='button';remove.textContent='REMOVE';remove.setAttribute('aria-label','Remove '+c.tag.toLowerCase()+' from comparison');remove.addEventListener('click',()=>{saved=saved.filter(x=>x!==i);render();message(c.tag+' removed. Your project selections are unchanged.');pin.focus({preventScroll:true})});
  actions.append(view,remove);body.append(title,desc,label,list,actions);el.append(art,body);return el;
 }
 function empty(pos){const el=document.createElement('article');el.className='v60-empty';const label=document.createElement('span');label.textContent=pos===0?'01 / FIRST IDEA':'02 / SECOND IDEA';const plus=document.createElement('b');plus.setAttribute('aria-hidden','true');plus.textContent='+';const p=document.createElement('p');p.textContent=pos===0?'Choose a concept above and select Save to compare.':'Add another concept to see the two side by side.';el.append(label,plus,p);return el}
 function render(){const i=current();slots.replaceChildren(...[0,1].map(pos=>saved[pos]===undefined?empty(pos):card(saved[pos],pos)));count.textContent=saved.length+' / 2 SAVED';pin.setAttribute('aria-pressed',String(saved.includes(i)));pin.textContent=saved.includes(i)?'✓ SAVED / REMOVE':'◇ SAVE TO COMPARE';use.disabled=!saved.length;swap.disabled=saved.length!==2;copy.disabled=!saved.length;download.disabled=!saved.length;}
 function addCurrent(){const i=current();if(saved.includes(i)){saved=saved.filter(x=>x!==i);message(catalog[i].tag+' removed from comparison.');}else if(saved.length<2){saved.push(i);message(catalog[i].tag+' saved for comparison. Nothing was sent.');}else{const replaced=catalog[saved[1]].tag;saved[1]=i;message(catalog[i].tag+' replaced '+replaced+' in comparison slot two.');}render()}
 function brief(){const lines=['JUST PROTECT | CONCEPT COMPARISON','Illustrated ideas, not completed customer installations.','Planning reference only; scope and availability require confirmation.',''];saved.forEach((i,pos)=>{const c=catalog[i];lines.push('CONCEPT '+(pos+1)+' — '+c.tag,c.title,c.description,'Possible services: '+c.keys.map(k=>names[k]).join(' + '),'Questions to consider:');c.questions.forEach(q=>lines.push(' - '+q));lines.push('')});lines.push('Selected services in this comparison are suggestions, not a submitted request.');return lines.join('\n')}
 async function copyText(t){if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(t);return true}catch(e){/* local fallback */}}const input=document.createElement('textarea');input.value=t;input.setAttribute('readonly','');input.style.position='fixed';input.style.left='-9999px';document.body.append(input);input.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){/* copy unavailable */}input.remove();return ok}
 pin.addEventListener('click',addCurrent);
 tabs.forEach(t=>t.addEventListener('click',render));
 document.getElementById('v45-tabs')?.addEventListener('keydown',render);
 swap.addEventListener('click',()=>{if(saved.length!==2)return;saved.reverse();render();message('Comparison order reversed; original project selections remain unchanged.')});
 use.addEventListener('click',()=>{const keys=[...new Set(saved.flatMap(i=>catalog[i].keys))];const controls=[...document.querySelectorAll('[data-v40-service]')];let added=0;keys.forEach(key=>{const control=controls.find(b=>b.dataset.v40Service===key);if(control&&control.getAttribute('aria-pressed')!=='true'){control.click();added++}});message(keys.length+' relevant service'+(keys.length===1?'':'s')+' included in your local project ('+added+' newly added). Nothing was sent.');document.getElementById('v42-open')?.click();});
 copy.addEventListener('click',async()=>{if(!saved.length)return;const ok=await copyText(brief());message(ok?'Comparison notes copied locally. Nothing was sent.':'Clipboard unavailable; use Download notes instead.')});
 download.addEventListener('click',()=>{if(!saved.length)return;const blob=new Blob([brief()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='just-protect-concept-comparison.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Comparison notes downloaded locally. Nothing was sent.')});
 link.addEventListener('click',async()=>{const u=new URL(location.href);if(!['https:','http:'].includes(u.protocol)){message('Shareable links become available when this site is hosted. Local file paths are not portable.');return}u.searchParams.set('case',catalog[current()].slug);u.hash='inspiration';const ok=await copyText(u.href);message(ok?'Concept-view link copied. This opens the selected illustration, not a saved comparison.':'Clipboard unavailable. The concept remains visible here.')});
 // A published ?case= slug selects a scene without changing the live project or comparison.
 const raw=(typeof window.__v60InitialCase==='string'?window.__v60InitialCase:new URLSearchParams(location.search).get('case'))||'';
 const target=catalog.findIndex(c=>c.slug===raw.toLowerCase());if(target>=0){tabs[target].click();message('Showing the '+catalog[target].tag.toLowerCase()+' concept. No services were selected or sent.');}
 render();
})();
