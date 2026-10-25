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
const motion=document.getElementById('motionToggle');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches;
function setMotion(){motion.disabled=reduced.matches;if(reduced.matches)paused=true;document.documentElement.classList.toggle('motion-paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.innerHTML=reduced.matches?'<span class="ar">تقليل الحركة مفعّل</span><span class="en">REDUCED MOTION ON</span>':paused?'<span class="ar">تشغيل الحركة</span><span class="en">PLAY MOTION</span>':'<span class="ar">إيقاف الحركة</span><span class="en">PAUSE MOTION</span>';}
motion.addEventListener('click',()=>{paused=!paused;setMotion();});
reduced.addEventListener('change',()=>{paused=reduced.matches;setMotion();});setMotion();update();
})();
