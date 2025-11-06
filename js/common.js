(function(global){
const KEY = 'gh_products_v1';
function read(){ try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){return [];} }
function write(arr){ localStorage.setItem(KEY, JSON.stringify(arr)); }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
function groupByCategory(items){
const map=new Map();
for(const p of items){ const k=(p.category||'미분류').trim()||'미분류'; if(!map.has(k)) map.set(k,[]); map.get(k).push(p); }
return map;
}
global.Store = { KEY, read, write, escapeHtml, groupByCategory };
})(window);