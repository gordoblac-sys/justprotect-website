/* V86: enhances the ORIGINAL V26 comparison; its original tabs, content and manual wizard remain authoritative.
   The optional pinned card is an ephemeral DOM snapshot. No storage, new project model or transmission. */
(()=>{'use strict';
const root=document.getElementById('compare');if(!root)return;
const $=id=>document.getElementById(id), tabs=[...root.querySelectorAll('[data-v26-tab]')],canon=[...document.querySelectorAll('[data-v40-service]')];
const art={tv:['scene-entertainment.svg','tv-mounting.html'],roughin:['scene-rough-in.svg','roughin.html'],network:['scene-network.svg','networking.html'],smart:['scene-smart.svg','smart-home-security.html'],av:['scene-audio.svg','audio-video.html']};
const keys=['tv','roughin','network','smart','av'];let pinned=null;
const activeKey=()=>tabs.find(t=>t.getAttribute('aria-selected')==='true')?.dataset.v26Tab||'tv';
const chosen=key=>canon.some(b=>b.dataset.v40Service===key&&b.getAttribute('aria-pressed')==='true');
function addOrReview(key){if(chosen(key)){$('v42-open')?.click();$('v86-status').textContent='Opened your original editable project workspace. Nothing was sent.';return;}
 const button=canon.find(b=>b.dataset.v40Service===key);if(!button){$('v86-status').textContent='Use the original project tools to choose this service.';return;}
 button.click();$('v86-status').textContent='Added '+(key==='av'?'audio / video':key)+' to your private project. Availability requires confirmation.';refresh();}
function snapshot(){const key=activeKey();return{key,name:$('v26-name').textContent.trim(),desc:$('v26-desc').textContent.trim(),items:[...$('v26-items').querySelectorAll('li')].map(li=>li.textContent.trim()),type:$('v26-type').textContent.trim()};}
function refresh(){const key=activeKey(),meta=art[key];if(!meta)return;
 $('v86-active-image').src='assets/'+meta[0];$('v86-image-index').textContent=String(keys.indexOf(key)+1).padStart(2,'0')+' / 05';$('v86-active-position').textContent=$('v86-image-index').textContent;
 $('v86-guide').href='services/'+meta[1];const is=chosen(key);$('v86-active-state').textContent=is?'IN YOUR PROJECT':'NOT IN PROJECT';root.querySelector('.v86-live').classList.toggle('is-selected',is);
 $('v86-add').textContent=is?'REVIEW MY PROJECT ↗':'+ ADD TO MY PROJECT';$('v86-add').setAttribute('aria-label',is?'Open original project workspace':'Add '+$('v26-name').textContent.trim()+' to project');
 $('v86-pin').setAttribute('aria-pressed',String(!!pinned&&pinned.key===key));$('v86-pin').textContent=pinned?.key===key?'PINNED ✓':'PIN FOR COMPARISON ↗';
 if(pinned){const selected=chosen(pinned.key);$('v86-pin-state').textContent=selected?'IN YOUR PROJECT':'NOT IN PROJECT';$('v86-pin-state').classList.toggle('is-selected',selected);$('v86-pin-add').textContent=selected?'REVIEW MY PROJECT ↗':'+ ADD PINNED SERVICE';}
}
function showPinned(){const aside=$('v86-pinned');aside.hidden=!pinned;$('v86-clear').hidden=!pinned;
 if(pinned){const m=art[pinned.key];$('v86-pin-image').src='assets/'+m[0];$('v86-pin-image').alt='Illustrated '+pinned.name+' installation concept, not a customer photo';$('v86-pin-guide').href='services/'+m[1];$('v86-pinned-title').textContent=pinned.name;$('v86-pin-desc').textContent=pinned.desc;$('v86-pin-type').textContent=pinned.type.toUpperCase();$('v86-pin-items').replaceChildren(...pinned.items.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));
 $('v86-status').textContent=pinned.key===activeKey()?'Pinned '+pinned.name+'. Select another specialty above to compare.':'Comparing '+pinned.name+' with '+$('v26-name').textContent.trim()+'. No project changes were made.';
 }else $('v86-status').textContent='Comparison cleared. Your original project selections are unchanged.';
 refresh();}
$('v86-pin').addEventListener('click',()=>{const current=snapshot();pinned=pinned?.key===current.key?null:current;showPinned();});
function clear(){pinned=null;showPinned();$('v86-pin').focus();}
$('v86-clear').addEventListener('click',clear);$('v86-unpin').addEventListener('click',clear);
$('v86-add').addEventListener('click',()=>addOrReview(activeKey()));$('v86-pin-add').addEventListener('click',()=>pinned&&addOrReview(pinned.key));
tabs.forEach(tab=>{tab.addEventListener('click',()=>{refresh();if(pinned)showPinned();});tab.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key))requestAnimationFrame(()=>{refresh();if(pinned)showPinned();});});});
// The original V26 handler owns all tab content. Observe its existing heading instead of copying its catalog.
new MutationObserver(()=>{refresh();if(pinned&&pinned.key!==activeKey())$('v86-status').textContent='Comparing '+pinned.name+' with '+$('v26-name').textContent.trim()+'. No project changes were made.';}).observe($('v26-name'),{childList:true,characterData:true,subtree:true});
canon.forEach(b=>new MutationObserver(refresh).observe(b,{attributes:true,attributeFilter:['aria-pressed']}));
refresh();
})();
