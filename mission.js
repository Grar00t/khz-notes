/* Progressive enhancement: notes remain readable without JavaScript. */
(()=>{'use strict';
const entries=[...document.querySelectorAll('.codex-entry')];
const search=document.getElementById('codexSearch');
const filters=[...document.querySelectorAll('[data-filter]')];
const count=document.getElementById('codexCount');
const empty=document.getElementById('codexEmpty');
let category='all';
function update(){const q=search.value.trim().toLocaleLowerCase();let visible=0;entries.forEach(entry=>{const show=(category==='all'||entry.dataset.category===category)&&entry.textContent.toLocaleLowerCase().includes(q);entry.hidden=!show;if(show)visible++;});count.textContent=visible+' / '+entries.length;empty.hidden=visible!==0;}
filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update();}));
search.addEventListener('input',update);
update();
function revealHash(){const target=document.getElementById(location.hash.slice(1));if(!target)return;let parent=target.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}target.scrollIntoView({block:'start'});}
window.addEventListener('hashchange',revealHash);if(location.hash)revealHash();
})();
