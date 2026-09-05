// Vorabnahme: Player v2 mit Filmdatei gegen gold/extrempunkte.html.
// Vergleicht je Bogen: Beats, Stuecke (Typ, dauer), Zeitfenster a/b, sichtbare Bloecke mit Text.
import {JSDOM} from 'jsdom'; import fs from 'fs'; import path from 'path';
const hier=path.dirname(new URL(import.meta.url).pathname);
const wurzel=path.join(hier,'..');
function welt(html){
  html=html.replace(/<script[^>]*src=[^>]*><\/script>/g,'').replace(/<script>window\.MathJax[^<]*<\/script>/,'');
  const w=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://example.org/'}).window;
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.SVGElement.prototype.getTotalLength=function(){ return 300; };
  w.HTMLElement.prototype.getBoundingClientRect=function(){ return {left:10,top:10,width:100,height:20}; };
  w.SVGElement.prototype.getBoundingClientRect=function(){ return {left:10,top:10,width:340,height:200}; };
  Object.defineProperty(w.HTMLElement.prototype,'clientHeight',{get(){ return 700; },configurable:true});
  Object.defineProperty(w.HTMLElement.prototype,'scrollHeight',{get(){ return 3000; },configurable:true});
  const src=html.match(/<script>\n'use strict';([\s\S]*?)<\/script>/)[1];
  // Griff auf die Innereien, innerhalb desselben eval-Geltungsbereichs
  w.eval(src.replace(/^\s*'use strict';/,'')+"\n;window.__innen={SZENEN:SZENEN,TOTAL:()=>TOTAL,bereit:()=>bereit};");
  return w;
}
async function warten(w,lese){ for(let i=0;i<60;i++){ try{ if(lese())return; }catch(e){} await new Promise(r=>setTimeout(r,50)); } }
function dump(w,SZENEN){
  return SZENEN.map(s=>{
    const frage=s.inhalt.querySelector('.frage');
    const beats=s.beats.map(b=>b.stuecke.map(st=>st.items.map(x=>(x.typ||(x.rechnen?'geom':'item'))).join('+')+'×'+(+st.dauer).toFixed(2)));
    const fenster=[]; for(const b of s.beats)for(const st of b.stuecke)for(const it of st.items)fenster.push((+it.a).toFixed(3)+'–'+(+it.b).toFixed(3));
    const bloecke=[...s.inhalt.children].filter(k=>!k.classList.contains('pfeile')&&!k.classList.contains('flug')&&!k.classList.contains('frage'))
      .map(k=>{ let cls=(k.className||k.tagName.toLowerCase()).replace(/\bel\b/g,'').trim();
        let t=k.textContent.replace(/\s+/g,' ').trim();
        if(k.classList.contains('bild')){ const l=k.querySelector('.legende'); t='[Graph] '+(l?l.textContent:''); }
        return cls+' :: '+t; });
    return {frage:frage?frage.textContent:'', beats, fenster, bloecke};
  });
}
// Gold
const gold=welt(fs.readFileSync(path.join(wurzel,'gold','extrempunkte.html'),'utf8'));
await warten(gold,()=>gold.__innen.bereit());
const G=dump(gold,gold.__innen.SZENEN);
// Meine Fassung
const film=JSON.parse(fs.readFileSync(process.argv[2]||path.join(wurzel,'quelle','extrempunkte.json'),'utf8'));
let tpl=fs.readFileSync(path.join(wurzel,'quelle','v2','player2.html'),'utf8');
const mein=welt(tpl.replace('__TITEL__',film.titel).replace('__BEATS_JSON__',JSON.stringify(film).replace(/<\//g,'<\\/')));
await warten(mein,()=>mein.__bk&&mein.__bk.bereit());
const M=dump(mein,mein.__bk.SZENEN);
let abw=0; const melde=(wo,a,b)=>{ abw++; if(abw<=40)console.log('ABWEICHUNG '+wo+'\n   gold: '+a+'\n   mein: '+b); };
console.log('Szenen gold',G.length,' mein',M.length,' | TOTAL gold',gold.__innen.TOTAL(),' mein',mein.__bk.total());
const n=Math.max(G.length,M.length);
for(let i=0;i<n;i++){
  const g=G[i], m=M[i]; if(!g||!m){ melde('Szene '+i,g?'da':'fehlt',m?'da':'fehlt'); continue; }
  if(g.frage!==m.frage)melde('Szene '+i+' Frage',g.frage,m.frage);
  if(g.beats.length!==m.beats.length)melde('Szene '+i+' Beatzahl',g.beats.length,m.beats.length);
  const nb=Math.max(g.beats.length,m.beats.length);
  for(let j=0;j<nb;j++){ const a=(g.beats[j]||[]).join(' | '), b=(m.beats[j]||[]).join(' | '); if(a!==b)melde('Szene '+i+' Beat '+j+' Stuecke',a,b); }
  const nf=Math.max(g.fenster.length,m.fenster.length);
  for(let j=0;j<nf;j++)if(g.fenster[j]!==m.fenster[j]){ melde('Szene '+i+' Fenster '+j,g.fenster[j],m.fenster[j]); break; }
  const nk=Math.max(g.bloecke.length,m.bloecke.length);
  for(let j=0;j<nk;j++)if(g.bloecke[j]!==m.bloecke[j])melde('Szene '+i+' Block '+j,g.bloecke[j],m.bloecke[j]);
}
console.log(abw?('\n'+abw+' ABWEICHUNGEN'):'\nIDENTISCH: Struktur, Fenster und Text aller Blaetter');
process.exit(abw?1:0);
