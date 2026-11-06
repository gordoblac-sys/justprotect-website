/* V85: Progressive enhancement of the ORIGINAL V21 two-question project matcher.
 * No new state storage, model, submission or automatic request. Original V21 choices and wizard remain authoritative.
 */
(()=>{
'use strict';
const root=document.getElementById('advisor');if(!root)return;
const title=document.getElementById('v21-result-title'),art=document.getElementById('v85-art-image'),counter=document.getElementById('v85-art-counter'),caption=document.getElementById('v85-art-caption');
const list=document.getElementById('v85-notes-list'),guide=document.getElementById('v85-guide'),add=document.getElementById('v85-add'),badge=document.getElementById('v85-project-badge'),location=document.getElementById('v85-route-location'),feedback=document.getElementById('v85-feedback');
if(!title||!art||!list||!guide||!add)return;
const catalog={
 'TV Mounting & Home Theater':{key:'tv',image:'scene-entertainment.svg',number:'01 / 05',caption:'A clearer view starts with a plan.',guide:'services/tv-mounting.html',questions:['What screen size, viewing height and wall material are involved?','Where are power, media devices and cable routes located?','Will the setup need a soundbar or other connected equipment?']},
 'Rough-In Wiring & Prewiring':{key:'roughin',image:'scene-rough-in.svg',number:'02 / 05',caption:'A connection begins with the right location.',guide:'services/rough-in-wiring.html',questions:['Where might the cable pathway have a clear view of the sky?','How could the cable enter the building safely?','Where would the router and power equipment be located?']},
 'Networking & Structured Wiring':{key:'network',image:'scene-network.svg',number:'03 / 05',caption:'A better backbone for connected rooms.',guide:'services/networking.html',questions:['Which rooms need wired data connections?','Where could the network equipment and cable paths go?','Is future expansion or Wi-Fi coverage part of the goal?']},
 'Smart Home & Security':{key:'smart',image:'scene-smart.svg',number:'04 / 05',caption:'Make the controls fit the way you live.',guide:'services/smart-home-security.html',questions:['Which entrances, rooms or devices matter most?','What existing devices and networks must work together?','Where are suitable power and mounting locations?']},
 'Audio & Video Solutions':{key:'audio',image:'scene-audio.svg',number:'05 / 05',caption:'Sound and screens, considered together.',guide:'services/audio-video.html',questions:['Which rooms or listening zones need audio?','Where might speakers and components be placed?','How should wiring, controls and equipment be organized?']}
};
const canon=[...document.querySelectorAll('[data-v40-service]')];const state=document.getElementById('v40-state');
let current=null;
function item(){return catalog[title.textContent.trim()]||catalog['TV Mounting & Home Theater'];}
function selected(key){return canon.some(b=>b.dataset.v40Service===key&&b.getAttribute('aria-pressed')==='true');}
function update(){
 const d=item(),was=current===d.key;current=d.key;
 if(!was){art.src='assets/'+d.image;art.alt='Illustration of a '+title.textContent.trim()+' installation concept, not a completed customer project';counter.textContent=d.number;caption.textContent=d.caption;guide.href=d.guide;list.replaceChildren(...d.questions.map(q=>{const li=document.createElement('li');li.textContent=q;return li;}));}
 const isSelected=selected(d.key);badge.textContent=isSelected?'IN YOUR PROJECT':'NOT IN PROJECT';badge.classList.toggle('is-selected',isSelected);
 add.textContent=isSelected?'REVIEW MY PROJECT ↗':'+ ADD SUGGESTED SERVICE';add.setAttribute('aria-label',isSelected?'Open original project workspace with '+title.textContent.trim():'Add '+title.textContent.trim()+' to your project');
 const st=state?.value||'';location.textContent=st?'PROJECT STATE: '+st.toUpperCase():'STATE NOT SELECTED';
}
// The original V21 handler updates the ORIGINAL title. Observe it instead of maintaining a second matcher model.
new MutationObserver(update).observe(title,{childList:true,characterData:true,subtree:true});
canon.forEach(b=>new MutationObserver(update).observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
if(state)state.addEventListener('change',update);
add.addEventListener('click',()=>{
 const d=item();if(selected(d.key)){
  document.getElementById('v42-open')?.click();feedback.textContent='Your original editable project workspace is open. Nothing was submitted.';
 }else{
  const b=canon.find(b=>b.dataset.v40Service===d.key);if(!b){feedback.textContent='Use the original project builder to add this service.';return;}
  b.click();feedback.textContent=title.textContent.trim()+' added to your private project. Availability and installation details require confirmation.';
 }
 update();
});
// Focus-only navigation. The existing V21 click handlers still make all actual selections.
for(const selector of ['[data-v21-goal]','[data-v21-detail]']){
 const buttons=[...root.querySelectorAll(selector)];buttons.forEach((button,index)=>button.addEventListener('keydown',event=>{
  const keys=['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'];if(!keys.includes(event.key))return;
  event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'||event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
  buttons[next].focus();
 }));
}
update();
})();
