/* V74: illustrated guide route, live optional readiness, local reading progress. No new storage or transmission. */
(()=>{'use strict';
 const root=document.querySelector('body[data-guide]');if(!root)return;
 const cards=[...document.querySelectorAll('.v74-route-card')];
 const checks=[...document.querySelectorAll('.planner .check input[type="checkbox"]')];
 const hero=document.getElementById('v74-hero-readiness');
 const resume=document.getElementById('v74-resume');
 const progress=document.getElementById('v74-chapter-progress');
 const track=document.querySelector('.v74-reading-track');
 if(!cards.length||!checks.length||!hero||!resume||!progress||!track)return;
 cards.forEach((card,index)=>card.addEventListener('keydown',event=>{
  let next=null;
  if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%cards.length;
  if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+cards.length-1)%cards.length;
  if(event.key==='Home')next=0;
  if(event.key==='End')next=cards.length-1;
  if(next!==null){event.preventDefault();cards[next].focus();cards[next].scrollIntoView({block:'nearest',inline:'nearest'});}
 }));
 function updateReadiness(){
  const done=checks.filter(c=>c.checked).length;
  hero.textContent=`${done} of ${checks.length} questions considered`;
  resume.innerHTML=done===checks.length?'Review your notes <span aria-hidden="true">↗</span>':'Continue planning <span aria-hidden="true">↗</span>';
 }
 checks.forEach(c=>c.addEventListener('change',updateReadiness));
 const reset=document.getElementById('guide-reset');if(reset)reset.addEventListener('click',()=>setTimeout(updateReadiness,0));
 const undo=document.getElementById('v59-undo-reset');if(undo)undo.addEventListener('click',()=>setTimeout(updateReadiness,0));
 function updateReading(){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const pct=Math.min(100,Math.max(0,Math.round(scrollY/max*100)));
  progress.textContent=`${pct}% READ`;track.style.width=pct+'%';
 }
 let scheduled=false;
 function queueReading(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;updateReading();});}
 window.addEventListener('scroll',queueReading,{passive:true});window.addEventListener('resize',queueReading,{passive:true});
 updateReadiness();updateReading();
})();
