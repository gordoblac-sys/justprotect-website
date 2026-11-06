/* V94: delegates exclusively to the original V39 tab controls. */
(()=>{
  'use strict';
  function init(){
    const desk=document.querySelector('#services .v94-service-theater');
    if(!desk)return;
    const tabs=[...desk.querySelectorAll('.v39-tab[data-v39-service]')];
    const counter=desk.querySelector('#v94-counter');
    if(tabs.length!==5||!counter)return;
    function active(){
      const i=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');
      return i<0?0:i;
    }
    function refresh(){
      counter.textContent=String(active()+1).padStart(2,'0')+' / 05';
    }
    function move(delta){
      const next=(active()+delta+tabs.length)%tabs.length;
      tabs[next].click();
      tabs[next].focus();
      refresh();
    }
    desk.querySelector('#v94-back')?.addEventListener('click',()=>move(-1));
    desk.querySelector('#v94-forward')?.addEventListener('click',()=>move(1));
    tabs.forEach(t=>t.addEventListener('click',()=>queueMicrotask(refresh)));
    const observer=new MutationObserver(refresh);
    tabs.forEach(t=>observer.observe(t,{
      attributes:true,
      attributeFilter:['aria-selected']
    }));
    refresh();
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
