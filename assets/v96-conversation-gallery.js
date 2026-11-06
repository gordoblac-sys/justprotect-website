/* V96: presentation only; delegates to original V79/V66 service preview. No project mutation or storage. */
(()=>{'use strict';const root=document.querySelector('#contact.v96-conversation-gallery');if(!root)return;
const thumbs=[...root.querySelectorAll('[data-v96-scene]')],picks=[...root.querySelectorAll('[data-v18-service]')];
const prompt=root.querySelector('#v96-prompt'),copy=root.querySelector('#v96-copy');if(thumbs.length!==5||picks.length!==5||!prompt||!copy)return;
const notes=[
'Consider viewing height, wall construction, power access and cable routing before choosing a mounting position.',
'Consider sky visibility, a safe mounting position, weatherproof cable entry and router location.',
'Identify rooms needing wired connections, equipment power, cable routes and future network expansion.',
'List priority devices, entry points, existing equipment and compatibility questions before installation.',
'Consider listening zones, speaker positions, source equipment and concealed cable pathways.'
];let active=0;
function render(i){active=(i+5)%5;thumbs.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===active)));prompt.textContent=notes[active];copy.textContent='COPY NOTE ↗';}
function show(i){render(i);picks[active].dispatchEvent(new Event('pointerenter'));}
thumbs.forEach((b,i)=>{b.addEventListener('click',()=>show(i));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?4:(i+(e.key==='ArrowRight'?1:-1)+5)%5;thumbs[n].focus();show(n);});});
picks.forEach((b,i)=>{b.addEventListener('focus',()=>render(i));b.addEventListener('pointerenter',()=>render(i));});
root.querySelector('#v79-scene-prev')?.addEventListener('click',()=>requestAnimationFrame(()=>{const n=picks.findIndex(b=>b===document.activeElement);if(n>=0)render(n);else render(active-1)}));
root.querySelector('#v79-scene-next')?.addEventListener('click',()=>requestAnimationFrame(()=>{const n=picks.findIndex(b=>b===document.activeElement);if(n>=0)render(n);else render(active+1)}));
copy.addEventListener('click',async()=>{const text='Just Protect installation planning note: '+notes[active]+' This is a discussion prompt, not a confirmed installation plan.';try{await navigator.clipboard.writeText(text);copy.textContent='COPIED ✓';}catch(e){const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();copy.textContent=ok?'COPIED ✓':'SELECT NOTE TO COPY';}});
render(0);
})();
