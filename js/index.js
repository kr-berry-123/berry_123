(function(){
const $=(s,c=document)=>c.querySelector(s);
const listEl=$('#list');
const emptyEl=$('#empty');
const q=$('#q');
const catFilter=$('#catFilter');


function render(){
const raw=Store.read();
const term=(q.value||'').toLowerCase();
const filterCat=catFilter.value||'';
const filtered=raw.filter(p=>{
const okTerm=!term || String(p.name||'').toLowerCase().includes(term);
const okCat=!filterCat || String(p.category||'미분류')===filterCat;
return okTerm && okCat;
});


// 카테고리 옵션
const cats=[...new Set(Store.read().map(p=>p.category||'미분류'))].sort((a,b)=>a.localeCompare(b,'ko'));
catFilter.innerHTML='<option value="">전체 카테고리</option>' + cats.map(c=>`<option ${c===filterCat?'selected':''}>${Store.escapeHtml(c)}</option>`).join('');


listEl.innerHTML='';
if(!filtered.length){ emptyEl.hidden=false; return; } else emptyEl.hidden=true;


const grouped=Store.groupByCategory(filtered);
for(const [cat, arr] of [...grouped.entries()].sort((a,b)=>a[0].localeCompare(b[0],'ko'))){
const sec=document.createElement('section'); sec.className='cat';
sec.innerHTML=`<h2 class="h2">${Store.escapeHtml(cat)}</h2>`;
const grid=document.createElement('div'); grid.className='grid';
arr.forEach(p=>{
const card=document.createElement('div'); card.className='card';
card.innerHTML=`
${p.img?`<img class="img" src="${p.img}" alt="${Store.escapeHtml(p.name||'')}">`:''}
<div class="body">
<div class="price">${Number(p.price||0).toLocaleString()}원</div>
<div class="name">${Store.escapeHtml(p.name||'')}</div>
</div>`;
grid.appendChild(card);
});
sec.appendChild(grid); listEl.appendChild(sec);
}
}


q.addEventListener('input', render);
catFilter.addEventListener('change', render);
window.addEventListener('storage', render);
render();
})();