(()=>{
'use strict';
const source=document.getElementById('atlas-data');
if(!source)return;
const data=JSON.parse(source.textContent);
const tabs=[...document.querySelectorAll('.atlas-item')];
const img=document.getElementById('atlas-image');
const title=document.getElementById('atlas-title');
const desc=document.getElementById('atlas-description');
const link=document.getElementById('atlas-link');
const num=document.getElementById('atlas-number');
function select(i,focus){
  const item=data[i];
  tabs.forEach((b,j)=>{
    b.setAttribute('aria-selected',String(j===i));
    b.tabIndex=j===i?0:-1;
  });
  img.src='../assets/'+item.scene;
  img.alt='Illustrated '+item.name+' installation concept, not a customer project photograph';
  title.textContent=item.name;
  desc.textContent=item.deck;
  link.href=item.slug+'.html';
  num.textContent='SERVICE '+item.num+' / 05';
  document.getElementById('atlas-panel').setAttribute('aria-labelledby',tabs[i].id);
  if(focus)tabs[i].focus();
}
tabs.forEach((b,i)=>{
  b.addEventListener('click',()=>select(i,false));
  b.addEventListener('keydown',e=>{
    let j=i;
    if(e.key==='ArrowDown'||e.key==='ArrowRight')j=(i+1)%tabs.length;
    else if(e.key==='ArrowUp'||e.key==='ArrowLeft')j=(i+tabs.length-1)%tabs.length;
    else if(e.key==='Home')j=0;
    else if(e.key==='End')j=tabs.length-1;
    else return;
    e.preventDefault();
    select(j,true);
  });
});
select(0,false);
})();
