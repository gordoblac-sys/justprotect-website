/* V98 read-only planning lenses for original V45/V72 Concept Wall */
(()=>{'use strict';const root=document.querySelector('#inspiration.v98-concept-studio');if(!root)return;
const tabs=[...root.querySelectorAll('[data-v45-index]')], buttons=[...root.querySelectorAll('[data-v98-lens]')];
const note=root.querySelector('#v98-lens-note'),counter=root.querySelector('#v98-lens-count'),guide=root.querySelector('#v98-lens-guide');
const details=[
['Check viewing distance, wall construction and the placement of the display.','Confirm power access, cable concealment and connections to nearby equipment.','Consider remote access, glare and how the room is used every day.'],
['Check where the cable pathway can be positioned and how the installation area can be reached.','Plan a protected cable route and a practical location for network equipment.','Consider where connected devices need reliable access indoors.'],
['Identify the equipment location and the areas that need network coverage.','Consider cable pathways, wall penetrations and future network expansion.','Plan around everyday devices, workspaces and shared connectivity.'],
['Consider device placement, access and the spaces that need monitoring.','Plan power and connection requirements for each proposed device.','Consider who needs access, notifications and convenient controls.'],
['Check listening positions, room layout and suitable speaker locations.','Consider cable routes, amplifier placement and available power.','Plan controls and volume zones around how the space is used.'],
['Identify the areas of the property that should connect together.','Consider existing pathways and the distance between equipment locations.','Prioritize reliable access and straightforward day-to-day controls.']];
let lens=0;const selected=()=>{const i=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');return i<0?0:i};
function render(){const idx=selected();buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===lens)));note.textContent=details[idx][lens];counter.textContent=String(lens+1).padStart(2,'0')+' / 03';const original=root.querySelector('#v72-guide');if(original){guide.href=original.getAttribute('href')||'services/index.html'}}
buttons.forEach((b,i)=>b.addEventListener('click',()=>{lens=i;render()}));
const observer=new MutationObserver(()=>render());tabs.forEach(t=>observer.observe(t,{attributes:true,attributeFilter:['aria-selected']}));
const original=root.querySelector('#v72-guide');if(original)observer.observe(original,{attributes:true,attributeFilter:['href']});
render();})();
