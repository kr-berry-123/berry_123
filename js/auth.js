// 🔒 아주 간단한 클라이언트 측 보호 (강력 보안 아님)
// 설정: 아래 HASH 값을 원하는 비밀번호로 교체하려면, 임시로 location.hash에 '#setpw=원하는비번' 붙여 열고
// 콘솔에서 Auth._set('원하는비번') 실행해 나온 해시를 하드코딩하세요.
(function(global){
const STORAGE_FLAG='gh_products_auth_ok';
// 기본 비밀번호 해시(예: 'roadin' 의 SHA-256). 처음엔 더미값. 아래를 교체하세요.
let PASSWORD_HASH='d2b2f12a2a3d8b8a3b2a9e8b47f7a0e2f3b3a9a2b1c0d0e0f1a2b3c4d5e6f708';


async function sha256(text){
const enc=new TextEncoder();
const buf=await crypto.subtle.digest('SHA-256', enc.encode(text));
return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}


async function login(pass){
const h=await sha256(pass||'');
if(h===PASSWORD_HASH){ sessionStorage.setItem(STORAGE_FLAG,'1'); return true; }
return false;
}


function isAuthed(){ return sessionStorage.getItem(STORAGE_FLAG)==='1'; }


// 개발용: 새 비번 해시 생성 헬퍼
async function _set(newPlain){
const h=await sha256(newPlain);
console.log('[Auth] 새 해시:', h);
PASSWORD_HASH=h; // 이 줄은 런타임 임시 교체(새로고침하면 초기화).
return h;
}


global.Auth={ login, isAuthed, _set };
})(window);