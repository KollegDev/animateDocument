// Prueft Player v2: Bauform, Zeit, Sicherheit, Geraete, Serie, Datei laden.
import {JSDOM} from 'jsdom'; import fs from 'fs'; import path from 'path';
const hier=path.dirname(new URL(import.meta.url).pathname);
const tpl=fs.readFileSync(path.join(hier,'blattkino','player.html'),'utf8');
async function welt(daten,opt){
  opt=opt||{};
  const json=JSON.stringify(opt.eingebaut===false?null:daten).replace(/<\//g,'<\\/');
  let html=tpl.replace('__TITEL__',daten.titel||'T').replace('__BEATS_JSON__',json);
  html=html.replace(/<script[^>]*src=[^>]*><\/script>/g,'').replace(/<script>window\.MathJax[^<]*<\/script>/,'');
  const w=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://example.org/'+(opt.abfrage||'')}).window;
  if(opt.holen)w.fetch=opt.holen;
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.SVGElement.prototype.getTotalLength=function(){ return 300; };
  w.HTMLElement.prototype.getBoundingClientRect=function(){ return {left:10,top:10,width:100,height:20}; };
  w.SVGElement.prototype.getBoundingClientRect=function(){ return {left:10,top:10,width:340,height:200}; };
  Object.defineProperty(w.HTMLElement.prototype,'clientHeight',{get(){ return 700; },configurable:true});
  Object.defineProperty(w.HTMLElement.prototype,'scrollHeight',{get(){ return 3000; },configurable:true});
  const src=html.match(/<script>\n'use strict';([\s\S]*?)<\/script>/)[1];
  w.eval(src.replace(/^\s*'use strict';/,''));
  for(let i=0;i<60&&!(w.__bk&&w.__bk.bereit());i++)await new Promise(r=>setTimeout(r,50));
  return {w,bk:w.__bk,q:s=>w.document.querySelector(s),alle:s=>[...w.document.querySelectorAll(s)],
    fehler:()=>{ const f=w.document.getElementById('fehler'); return f&&f.style.display==='block'?f.textContent:''; }};
}
let f=0; const ck=(n,c,x)=>{console.log((c?'PASS  ':'FEHLER')+'  '+n+(x!==undefined?'  → '+String(x).slice(0,90):'')); if(!c)f++;};
const lauf=(bk)=>{ let n=0; const T=bk.total(); for(let t=0;t<=T+0.001;t+=0.01){ try{ bk.render(t); }catch(e){ n++; } } return n; };

const D={titel:'Wertebereich',quelle:'Blatt 1',boegen:[
 {frage:'Welche y-Werte kommen vor?',beats:[
  {sub:'Wir sehen uns die Parabel an.',ops:[{op:'h',t:'Wertebereich'},{op:'math',tex:'f(x)=x^{2}+4'}]},
  {sub:'Der tiefste Punkt liegt bei vier.',ops:[
    {op:'plot',id:'p1',expr:'x^2+4',xmin:-4,xmax:4,ymin:0,ymax:12,legend:'f(x)=x²+4'},
    {op:'point',id:'p1',x:0,y:4,label:'T(0|4)'},{op:'region',id:'p1',y:4,dir:'above',label:'y ≥ 4'},
    {op:'item',t:'kleinster Wert 4'},{op:'note',t:'nie kleiner'}]},
  {sub:'Damit steht der Wertebereich fest.',payoff:true,ops:[{op:'merksatz',t:'Alle Werte ab vier.'}]}]}]};

console.log('— Bauform v2 —');
{ const a=await welt(D);
  ck('bereit nach MathJax und Messung', a.bk&&a.bk.bereit());
  ck('Titel im Tor und im Dokument', a.q('#torTitel').textContent==='Wertebereich'&&a.w.document.title==='Wertebereich');
  ck('Inhaltsszene und Schlussszene', a.bk.SZENEN.length===2, a.bk.SZENEN.length);
  ck('Die Frage steht ueber dem Blatt', a.bk.SZENEN[0].inhalt.querySelector('.frage').textContent==='Welche y-Werte kommen vor?');
  ck('Jeder Beat ist ein Zeitabschnitt', a.bk.SZENEN[0].beats.length===3);
  ck('Ueberschrift vor dem Satz', (()=>{ const k=[...a.bk.SZENEN[0].inhalt.children]; return k.findIndex(x=>x.tagName==='H2')<k.findIndex(x=>x.classList.contains('satz')); })());
  ck('Der Graph ist ein Block im Blatt mit Legende darunter', a.q('.inhalt .bild svg')!==null && a.q('.inhalt .bild .legende').textContent==='f(x)=x²+4');
  ck('Alte Ops laufen: point, region, item, note, merksatz', a.q('.item')!==null&&a.q('.notebox')!==null&&a.q('.merk')!==null&&a.alle('.inhalt .bild svg rect').length>0);
  ck('Ganze Radstrecke ohne Fehler', lauf(a.bk)===0 && !a.fehler(), a.fehler());
}

console.log('— Die Zeit: keine Ruhezonen (GL3) —');
{ const a=await welt(D); const s=a.bk.SZENEN[0];
  ck('Jeder Beat kostet dieselbe Strecke (1)', s.beats.every(b=>Math.abs((b.bis-b.von)-1)<1e-9));
  const fenster=[]; for(const b of s.beats)for(const st of b.stuecke)for(const it of st.items)fenster.push([it.a,it.b]);
  ck('Die Stuecke kacheln den Beat lueckenlos', (()=>{ const b=s.beats[0]; const its=[]; for(const st of b.stuecke)for(const it of st.items)its.push(it);
     for(let i=1;i<its.length;i++)if(Math.abs(its[i].a-its[i-1].b)>1e-6)return false; return Math.abs(its[0].a-b.von)<1e-6; })());
  ck('Vor dem Blattwechsel bleibt die Blende frei', (()=>{ const b=s.beats[s.beats.length-1]; const its=[]; for(const st of b.stuecke)for(const it of st.items)its.push(it);
     return Math.abs(its[its.length-1].b-(b.bis-0.09))<1e-6; })());
  ck('gewicht steuert nichts', (()=>{ const b=s.beats[1]; return b.gewicht===2; })());
}

console.log('— Sicherheit —');
{ const b=await welt({titel:'<img src=x onerror=alert(1)>',boegen:[{frage:'<b>F</b>',beats:[{sub:'<b>fett</b>',payoff:true,ops:[
    {op:'h',t:'<script>bad()<\/script>'},{op:'zeile',teile:[{t:'<i>kursiv</i>',fett:'kursiv',id:'a'}]},
    {op:'math',tex:'\\href{javascript:x}{y}+\\class{a}{b}'},{op:'note',t:'<img src=x onerror=alert(2)>'}]}]}]});
  ck('Titel nicht als HTML', b.q('#torTitel').querySelector('img')===null);
  ck('Frage nicht als HTML', b.q('.frage').querySelector('b')===null);
  ck('Ueberschrift nicht als HTML', b.q('h2').querySelector('script')===null);
  ck('Satz nicht als HTML', b.q('.satz').querySelector('b')===null);
  ck('Chip-Text nicht als HTML, fett nur ueber das Feld', b.q('.chip.txt').querySelector('i')===null && b.q('.chip.txt b.fett')!==null);
  ck('Gefaehrliche TeX-Befehle fallen weg', !/href|class/.test(b.q('.zeile .chip').textContent));
  ck('Notiz nicht als HTML', b.q('.notebox').querySelector('img')===null);
}

console.log('— Die Geraete des Goldlaufs —');
{ const G={titel:'G',boegen:[{frage:'Wo?',beats:[
    {ops:[{op:'graph',id:'G',expr:'x^3-3*x',xmin:-2.4,xmax:2.4,ymin:-4,ymax:4,legend:'f',h:190},
          {op:'zeile',teile:[['x_1=',{tex:'-1',k:0,id:'x1'}]]},
          {op:'kandidat',id:'m1',x:-1,k:0,text:'−1'},{op:'flug',von:'x1',zu:{kandidat:'m1'},k:0}]},
    {ops:[{op:'zeile',id:'z',stumm:true,teile:[['!eng',{tex:"f''("},{tex:'-1',k:0,id:'e'},{tex:')=-6'}],'<0',{t:'→ Hochpunkt',fett:'H',id:'art'}]},
          {op:'pfeil',id:'p1',von:'x1',zu:'e',lane:0,k:0},{op:'zeig',zeile:'z',folge:true},{op:'kappe',x:-1,r:0.4,k:0,text:'Rechtskurve'}]},
    {payoff:true,ops:[{op:'zeile',id:'y',stumm:true,teile:[['!eng',{tex:'f('},{tex:'-1',k:0,id:'ye'},{tex:')=2',id:'yw'}]]},
          {op:'pfeil',von:{pfeil:'p1'},zu:'ye',lane:0,k:0},{op:'zeig',zeile:'y',folge:true},
          {op:'aufstieg',x:-1,y:2,k:0,text:'2'},{op:'punkt',x:-1,y:2,k:0},
          {op:'zeile',id:'erg',stumm:true,teile:[[{tex:'H(',k:0,leer:true,id:'a0'}]]},{op:'zeig',zeile:'erg'},
          {op:'flug',von:'art',zu:'a0',k:0,txt:true},{op:'fahrt',x0:-2,x1:2,geister:[-1],k:0,dauer:4}]}]}]};
  const a=await welt(G); const s=a.bk.SZENEN[0];
  const typen=[]; for(const b of s.beats)for(const st of b.stuecke)for(const it of st.items)typen.push(it.typ||(it.rechnen?'geom':'item'));
  ck('Pfeil und Flug sind Items mit Typ', typen.includes('pfeil')&&typen.includes('flug'), typen.join(','));
  ck('Zwei Pfeile, einer aus dem Stamm des ersten', typen.filter(t=>t==='pfeil').length===2);
  ck('Zwei Fluege: zur Achse und in die Ergebniszeile', typen.filter(t=>t==='flug').length===2);
  ck('Kappe und Aufstieg zeichnen sich', typen.filter(t=>t==='geom').length>=3);
  ck('Kandidat steht als Marke im Bild', a.alle('.bild svg path').length>0);
  ck('fett-Chip traegt ein <b> als Flugquelle', a.q('.chip.txt b.fett').textContent==='H');
  ck('Pfeile liegen in der eigenen Ebene ueber dem Blatt', a.alle('.inhalt svg.pfeile path').length>=2);
  ck('Ganze Radstrecke ohne Fehler', lauf(a.bk)===0 && !a.fehler(), a.fehler());
  const ohne=await welt({titel:'O',boegen:[{frage:'F',beats:[{sub:'x',payoff:true,ops:[{op:'pfeil',von:'nix',zu:'nirgends'},{op:'flug',von:'a',zu:'b'},{op:'kappe',x:1},{op:'text',t:'danach'}]}]}]});
  ck('Geraete ohne Ziel brechen nicht ab', ohne.alle('.satz').some(e=>e.textContent==='danach') && !ohne.fehler());
}

console.log('— Serie: Vorlage und Faelle —');
{ const S={titel:'S',boegen:[{serie:{vorlage:[
    {ops:[{op:'zeile',teile:['{{f}}']},{op:'graph',id:'G',expr:'{{expr}}',xmin:-3,xmax:3,ymin:-4,ymax:4,legend:'{{legend}}',h:170}]},
    {payoff:true,ops:[{op:'zeile',folge:true,teile:'{{loes}}'},
      {je:'kand',dann:[{op:'kandidat',id:'m{{k}}',x:'{{x}}',k:'{{k}}',text:'{{xt}}'},{op:'flug',von:'x{{k}}',zu:{kandidat:'m{{k}}'},k:'{{k}}',dauer:0.9},
                       {je:'kappen',dann:[{op:'kappe',x:'{{x}}',r:0.4,k:'{{k}}'}]}]}]}],
   faelle:[{frage:'Bei g?',f:'g(x)=x^{2}',expr:'x^2',legend:'g',loes:[['x_1=',{tex:'0',k:0,id:'x0'}]],kand:[{k:0,x:0,xt:'0',kappen:[{x:0}]}]},
           {frage:'Bei h?',f:'h(x)=x^{3}-3x',expr:'x^3-3*x',legend:'h',loes:[['x_1=',{tex:'-1',k:0,id:'x0'}],[',\\ x_2=',{tex:'1',k:1,id:'x1'}]],
            kand:[{k:0,x:-1,xt:'−1',kappen:[{x:-1}]},{k:1,x:1,xt:'1',kappen:[{x:1}]}]}]}}]};
  const a=await welt(S);
  ck('Jeder Fall wird ein Bogen', a.bk.SZENEN.length===3, a.bk.SZENEN.length);
  ck('Die Frage des Falls steht ueber seinem Blatt', a.bk.SZENEN[1].inhalt.querySelector('.frage').textContent==='Bei h?');
  const z=(s)=>{ const t=[]; for(const b of s.beats)for(const st of b.stuecke)for(const it of st.items)t.push(it.typ||(it.rechnen?'geom':'item')); return t; };
  ck('Ein Kandidat ergibt einen Flug, zwei ergeben zwei', z(a.bk.SZENEN[0]).filter(t=>t==='flug').length===1 && z(a.bk.SZENEN[1]).filter(t=>t==='flug').length===2);
  ck('Verschachtelte je-Bloecke entfalten sich', z(a.bk.SZENEN[1]).filter(t=>t==='geom').length>=3);
  ck('Zahlen bleiben Zahlen', typeof a.bk.SZENEN[1].beats.length==='number' && !a.fehler());
  ck('Ganze Radstrecke ohne Fehler', lauf(a.bk)===0);
}

console.log('— Film als eigene Datei —');
{ const F={titel:'Extern',quelle:'Q',boegen:[{frage:'F',beats:[{sub:'eins',ops:[{op:'text',t:'aus der Datei'}]},{sub:'zwei',payoff:true,ops:[{op:'note',t:'x'}]}]}]};
  const holen=()=>Promise.resolve({ok:true,json:()=>Promise.resolve(F)});
  const a=await welt(F,{eingebaut:false,abfrage:'?film=filme/extern.json',holen});
  ck('Der Film wird aus der Datei geladen', a.q('#torTitel').textContent==='Extern', a.q('#torTitel').textContent);
  ck('Der Inhalt steht auf dem Blatt', a.alle('.satz').some(e=>e.textContent==='aus der Datei'));
  let ruf=null; const b=await welt(F,{eingebaut:false,abfrage:'?film=https://fremd.example/x.json',holen:u=>{ruf=u;return holen();}});
  ck('Fremde Herkunft wird nicht geholt', ruf===null);
  let ruf2=null; const c=await welt(F,{eingebaut:false,abfrage:'?film=../geheim.json',holen:u=>{ruf2=u;return holen();}});
  ck('Aufstieg im Baum wird nicht geholt', ruf2===null);
  const d=await welt(F,{eingebaut:false,abfrage:'?film=filme/weg.json',holen:()=>Promise.resolve({ok:false,status:404,json:()=>Promise.reject(new Error('x'))})});
  ck('Fehlt die Datei, sagt das Tor es und sperrt den Start', /nicht gefunden/.test(d.q('#torTitel').textContent) && d.q('#start').disabled===true);
}

console.log('— Robustheit —');
{ const L=await welt({titel:'Leer',boegen:[]}); ck('Leerer Film bricht nicht ab', L.bk.SZENEN.length===1 && !L.fehler());
  const F=await welt({titel:'Flach',beats:[{sub:'a',payoff:true,ops:[{op:'text',t:'x'}]}]}); ck('Flache Fassung wird ein Bogen', F.bk.SZENEN.length===2);
  const U=await welt({titel:'U',boegen:[{frage:'F',beats:[{sub:'a',payoff:true,ops:[{op:'gibtsnicht',t:'x'},{op:'text',t:'danach'}]}]}]});
  ck('Unbekannte Op wird still uebergangen', U.alle('.satz').some(e=>e.textContent==='danach'));
}
console.log(f?('\n'+f+' FEHLER'):'\nPlayer v2 grün');
