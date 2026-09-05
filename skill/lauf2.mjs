// Laeuft einen Film im Player v2 unter jsdom ueber die ganze Radstrecke und meldet Fehler.
// Aufruf: node skill/lauf2.mjs film.json [player2.html] [--dump]
import {JSDOM} from 'jsdom'; import fs from 'fs'; import path from 'path';
const hier=path.dirname(new URL(import.meta.url).pathname);
const film=process.argv[2]; if(!film){ console.error('Aufruf: node lauf2.mjs film.json [player.html] [--dump]'); process.exit(2); }
const spieler=process.argv[3]&&!process.argv[3].startsWith('--')?process.argv[3]:path.join(hier,'..','quelle','v2','player2.html');
const dump=process.argv.includes('--dump');
const daten=JSON.parse(fs.readFileSync(film,'utf8'));
const tpl=fs.readFileSync(spieler,'utf8');
const json=JSON.stringify(daten).replace(/<\//g,'<\\/');
let html=tpl.replace('__TITEL__',daten.titel||'T').replace('__BEATS_JSON__',json);
html=html.replace(/<script[^>]*src=[^>]*><\/script>/g,'').replace(/<script>window\.MathJax[^<]*<\/script>/,'');
const w=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://example.org/'}).window;
w.matchMedia=()=>({matches:false,addEventListener(){}});
w.SVGElement.prototype.getTotalLength=function(){ return 300; };
w.HTMLElement.prototype.getBoundingClientRect=function(){ return {left:10,top:10,width:100,height:20}; };
w.SVGElement.prototype.getBoundingClientRect=function(){ return {left:10,top:10,width:340,height:200}; };
Object.defineProperty(w.HTMLElement.prototype,'clientHeight',{get(){ return 700; },configurable:true});
Object.defineProperty(w.HTMLElement.prototype,'scrollHeight',{get(){ return 3000; },configurable:true});
const src=html.match(/<script>\n'use strict';([\s\S]*?)<\/script>/)[1];
w.eval(src.replace(/^\s*'use strict';/,''));
for(let i=0;i<40&&!(w.__bk&&w.__bk.bereit());i++)await new Promise(r=>setTimeout(r,50));
const bk=w.__bk; const D=w.document;
const fehl=()=>{ const f=D.getElementById('fehler'); return f&&f.style.display==='block'?f.textContent:''; };
if(!bk){ console.log('FEHLER: kein __bk'); process.exit(1); }
console.log('Szenen',bk.SZENEN.length,' TOTAL',bk.total(),' bereit',bk.bereit(),' fehler:',fehl()||'keiner');
let fehler=0; const T=bk.total();
for(let t=0;t<=T+0.001;t+=0.005){ try{ bk.render(t); }catch(e){ fehler++; if(fehler<4)console.log('render('+t.toFixed(3)+'):',e.message); } if(fehl()){ fehler++; if(fehler<4)console.log('bei t='+t.toFixed(3)+': '+fehl()); const f=D.getElementById('fehler'); f.style.display='none'; f.textContent=''; } }
console.log('Radstrecke gelaufen, Schritte',Math.round(T/0.005),' Fehler',fehler);
if(dump){
  bk.SZENEN.forEach((s,i)=>{
    const frage=s.inhalt.querySelector('.frage'); 
    console.log('── Szene',i,frage?frage.textContent:'(ohne Frage)');
    s.beats.forEach((b,j)=>{ const it=b.stuecke.map(st=>st.items.map(x=>(x.typ||(x.apply&&x.rechnen?'geom':'item'))).join('+')+'×'+st.dauer);
      console.log('   Beat',j,'stuecke',b.stuecke.length,':',it.join(' | ')); });
    const bloecke=[...s.inhalt.children].filter(k=>!k.classList.contains('pfeile')&&!k.classList.contains('flug'));
    console.log('   Bloecke:',bloecke.map(k=>k.className.replace(/ ?el ?/,'')||k.tagName.toLowerCase()).join(', '));
  });
}
process.exit(fehler?1:0);
