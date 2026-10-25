const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function el(extra={}){return Object.assign({hidden:false,attrs:{},handlers:{},value:'',dataset:{},addEventListener(k,f){this.handlers[k]=f},setAttribute(k,v){this.attrs[k]=v}},extra)}
const entries=[el({dataset:{category:'research'},textContent:'Language اللغة'}),el({dataset:{category:'systems'},textContent:'Memory ذاكرة'}),el({dataset:{category:'experiment'},textContent:'Scanner اختبار'}),el({dataset:{category:'experiment'},textContent:'Persona واجهة'})];
const filters=['all','research','systems','experiment'].map(f=>el({dataset:{filter:f}}));const search=el(),count=el(),empty=el(),motion=el();const media={matches:false,addEventListener(k,f){this.change=f}};const classes={};
const document={querySelectorAll:s=>s==='.codex-entry'?entries:filters,getElementById:id=>({codexSearch:search,codexCount:count,codexEmpty:empty,motionToggle:motion})[id],documentElement:{classList:{toggle(k,v){classes[k]=v}}}};
vm.runInNewContext(fs.readFileSync('mission.js','utf8'),{document,window:{matchMedia:()=>media}});
let n=0;function test(name,f){f();n++;console.log('PASS '+name)}
test('initial four entries',()=>assert.equal(count.textContent,'4 / 4'));
test('category filters and pressed states',()=>{filters[3].handlers.click();assert.equal(count.textContent,'2 / 4');assert.equal(filters[3].attrs['aria-pressed'],'true');assert.equal(filters[0].attrs['aria-pressed'],'false')});
test('search intersects category',()=>{search.value='Scanner';search.handlers.input();assert.equal(count.textContent,'1 / 4')});
test('Arabic search',()=>{search.value='واجهة';search.handlers.input();assert.equal(count.textContent,'1 / 4')});
test('empty state',()=>{search.value='zzzz';search.handlers.input();assert.equal(empty.hidden,false);assert.equal(count.textContent,'0 / 4')});
test('reset returns entries',()=>{search.value='';filters[0].handlers.click();assert.equal(count.textContent,'4 / 4');assert.equal(empty.hidden,true)});
test('motion pause toggle',()=>{motion.handlers.click();assert.equal(classes['motion-paused'],true);assert.equal(motion.attrs['aria-pressed'],'true')});
test('system reduced motion pauses',()=>{media.matches=true;media.change();assert.equal(classes['motion-paused'],true)});
console.log(n+'/8 Codex interaction checks passed (stub DOM, not rendered browser).');
