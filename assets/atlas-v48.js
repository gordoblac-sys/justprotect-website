(()=>{'use strict';
 const hero=document.querySelector('.atlas-hero47');if(!hero)return;
 const data=JSON.parse(document.getElementById('atlas-data').textContent);
 const tabs=[...document.querySelectorAll('.atlas-item')],partner=document.getElementById('atlas-partner');
 const img=document.getElementById('v48-route-image'),primary=document.getElementById('v48-route-primary'),secondary=document.getElementById('v48-route-secondary'),count=document.getElementById('v48-route-count');
 const launch=document.getElementById('v48-route-start'),request=document.getElementById('atlas-request');
 const story=document.querySelector('.atlas-hero-story'),card=document.querySelector('.v48-route-card'),goalCard=document.querySelector('.atlas-goal-card'),down=document.querySelector('.hero47-down');
 const narrow=matchMedia('(max-width:820px)');
 // Physically reorder elements on small screens so visual, reading and keyboard order all agree.
 function position(){if(narrow.matches){goalCard.after(card);card.after(down);}else{story.append(card,down);}}
 position();
 if(narrow.addEventListener)narrow.addEventListener('change',position);else narrow.addListener(position);
 const current=()=>Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));
 function sync(){const i=current(),j=partner.value===''?-1:Number(partner.value),a=data[i],b=j<0?null:data[j];
   if(!a)return;
   img.src='../assets/'+a.scene;img.alt='Illustrated '+a.name+' installation concept; not a customer project photograph';
   primary.textContent=a.name;secondary.textContent=b?b.name:'None selected';count.textContent=a.num+' / 05';
   const slugs=[a.slug,...(b?[b.slug]:[])];const href='../index.html?services='+encodeURIComponent(slugs.join(','))+'#contact';
   launch.href=href;request.href=href;
   launch.setAttribute('aria-label','Build project with '+a.name+(b?' and '+b.name:''));
 }
 // The existing V46 and V47 handlers run first, so this updates the visual route from their final selection.
 tabs.forEach(t=>{t.addEventListener('click',sync);t.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key))setTimeout(sync,0);});});
 partner.addEventListener('change',sync);
 document.querySelectorAll('.atlas-goal').forEach(b=>b.addEventListener('click',sync));
 sync();
})();
