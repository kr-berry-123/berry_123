(function(){
const $=(s,c=document)=>c.querySelector(s);
const app=$('#app');
const lock=$('#lock');
const pw=$('#pw');
const btnLogin=$('#btnLogin');


async function gate(){
if(Auth.isAuthed()) return openApp();
lock.hidden=false; app.hidden=true;
btnLogin.onclick=async()=>{
const ok=await Auth.login(pw.value);
if(ok){ openApp(); }
else { alert('비밀번호가 올바르지 않습니다.'); pw.focus(); }
};
pw.addEventListener('keydown',e=>{ if(e.key==='Enter') btnLogin.click(); });
}


function openApp(){ lock.hidden=true; app.hidden=false; initForm(); }


// ----- 등록 폼 -----
const fields={cat:$('#category'), name:$('#name'), price:$('#price'), img:$('#img'), desc:$('#desc')};
function fillCats(){
const data=Store.read();
const cats=[...new Set(data.map(p=>p.category||'미분류'))].sort((a,b)=>a.localeCompare(b,'ko'));
const dl=$('#cats'); dl.innerHTML=cats.map(c=>`<option value="${Store.escapeHtml(c)}">`).join('');
}
function initForm(){
fillCats();
$('#save').onclick=()=>{
const category=(fields.cat.value||'미분류').trim()||'미분류';
const name=fields.name.value.trim();
if(!name){ alert('상품명을 입력하세요'); fields.name.focus(); return; }
const price=fields.price.value.trim();
const img=fields.img.value.trim();
const desc=fields.desc.value.trim();
const data=Store.read();
data.unshift({ id:Date.now(), category, name, price, img, desc });
Store.write(data);
Object.values(fields).forEach(f=>f.value='');
location.href='index.html';
};


$('#export').onclick=()=>{
const blob=new Blob([JSON.stringify(Store.read(),null,2)],{type:'application/json'});
const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='products.json'; a.click(); URL.revokeObjectURL(a.href);
};
$('#import').onclick=()=>$('#importFile').click();
$('#importFile').onchange=(e)=>{ const f=e.target.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ try{ Store.write(JSON.parse(rd.result)); alert('가져오기 완료'); fillCats(); } catch{ alert('JSON 형식 오류'); } }; rd.readAsText(f); e.target.value=''; };
$('#wipe').onclick=()=>{ if(confirm('모든 상품을 삭제할까요?')){ localStorage.removeItem(Store.KEY); fillCats(); } };
}


gate();
})();