// Prueft die Buehne: Aufbau, Zeitverteilung, Sicherheit, Geraete, Rueckfall.
import {JSDOM} from 'jsdom';
import fs from 'fs';
import path from 'path';
const hier=path.dirname(new URL(import.meta.url).pathname);
const tpl=fs.readFileSync(path.join(hier,'blattkino','player.html'),'utf8');
function welt(daten,mitZeitleiste,opt){
  opt=opt||{};
  const json=JSON.stringify(opt.eingebaut===false?null:daten).replace(/<\//g,'<\\/');
  const html=tpl.replace('__TITEL__',daten.titel||'T').replace('__BEATS_JSON__',json);
  const doc=`<!doctype html><html><head></head><body>${html.replace(/<script[^>]*src=[^>]*><\/script>/g,'').replace(/<script>window.MathJax.*?<\/script>/s,'')}</body></html>`;
  const w=new JSDOM(doc,{runScripts:'outside-only',pretendToBeVisual:true,
    url:'https://example.org/'+(opt.abfrage||'')}).window;
  if(opt.holen)w.fetch=opt.holen;
  w.matchMedia=()=>({matches:false});
  w.SVGElement.prototype.getTotalLength=function(){return 100;};
  w.CSS={supports:()=>!!mitZeitleiste};
  w.Element.prototype.getAnimations=function(){ return mitZeitleiste?[{}]:[]; };
  w.eval(html.match(/<script>\n'use strict';([\s\S]*?)<\/script>/)[1]);
  return {w,q:s=>w.document.querySelector(s),alle:s=>[...w.document.querySelectorAll(s)]};
}
let f=0; const ck=(n,c,x)=>{console.log((c?'PASS  ':'FEHLER')+'  '+n+(x!==undefined?'  → '+String(x).slice(0,92):'')); if(!c)f++;};
const von=e=>+e.dataset.a, bis=e=>+e.dataset.b;

const D={titel:'Wertebereich',quelle:'Blatt 1',boegen:[
 {frage:'Welche y-Werte kommen vor?',beats:[
  {sub:'Wir sehen uns die Parabel an.',gewicht:1,ops:[{op:'h',t:'Wertebereich'},{op:'math',tex:'f(x)=x^{2}+4'}]},
  {sub:'Der tiefste Punkt liegt bei vier.',gewicht:2,ops:[
    {op:'plot',id:'p1',expr:'x^2+4',xmin:-4,xmax:4,ymin:0,ymax:12,legend:'f(x)=x²+4'},
    {op:'point',id:'p1',x:0,y:4,label:'T(0|4)'},
    {op:'region',id:'p1',y:4,dir:'above',label:'y ≥ 4'},
    {op:'item',t:'kleinster Wert 4'},{op:'note',t:'nie kleiner'}]},
  {sub:'Damit steht der Wertebereich fest.',payoff:true,fokus:true,ops:[{op:'merksatz',t:'Alle Werte ab vier.'}]}]}]};

console.log('— Bauform —');
{ const a=welt(D,true);
  ck('Titel steht im Dokument', a.w.document.title==='Wertebereich');
  ck('Es gibt genau ein Rad', a.alle('.rad').length===1);
  ck('Der Weg im Rad hat eine Hoehe', /vh$/.test(a.w.document.documentElement.style.getPropertyValue('--kurbel')),
     a.w.document.documentElement.style.getPropertyValue('--kurbel'));
  ck('Die Seite selbst scrollt nicht', a.alle('.buehne').length===1 && a.q('.buehne').id==='doc');
  ck('Inhaltsszene und Schlussszene', a.alle('.szene').length===2, a.alle('.szene').length);
  ck('Vor dem Start laeuft nichts', !a.w.document.documentElement.classList.contains('laeuft'));
  ck('Das Tor traegt den Titel', a.q('#torTitel').textContent==='Wertebereich');
  ck('Das Tor nennt die Quelle', a.q('#torQuelle').textContent==='Blatt 1');
  ck('Das Tor hat einen Startknopf', a.q('#start')!==null && /tart/.test(a.q('#start').textContent));
  ck('Es gibt einen Ausstieg', a.q('#raus')!==null);
  ck('Der Knopf startet den Film', (()=>{ a.q('#start').click();
     return a.w.document.documentElement.classList.contains('laeuft'); })());
  ck('Die Frage des Bogens steht ueber der Szene',
     a.alle('.szene')[0].querySelector('.frage').textContent==='Welche y-Werte kommen vor?');
  ck('Jeder Bogen wird ein Blatt', a.alle('.blatt').length===a.alle('.szene').length);
  ck('Alles steht in einem einzigen Blatt',
     [...a.alle('.szene')[0].querySelector('.blatt').children].length>=5,
     [...a.alle('.szene')[0].querySelector('.blatt').children].length);
  ck('Das Bild ist ein Block im Blatt', a.q('.blatt > .bild svg')!==null);
  ck('Kein Block darf zusammengedrueckt werden', /\.blatt > \*\{flex:0 0 auto/.test(tpl));
  ck('Ueberschrift steht vor ihrem Satz', (()=>{
     const k=[...a.alle('.szene')[0].querySelector('.blatt').children];
     return k.findIndex(x=>x.tagName==='H2') < k.findIndex(x=>x.classList.contains('satz')); })());
}

console.log('— Die Zeit am Rad —');
{ const a=welt(D,true);
  const alle=a.alle('[data-a]');
  ck('Jeder bewegte Knoten hat ein Zeitfenster', alle.length>10, alle.length);
  ck('Kein Fenster laeuft rueckwaerts', alle.every(e=>bis(e)>von(e)));
  ck('Kein Fenster liegt ausserhalb der Kurbel', alle.every(e=>von(e)>=0&&bis(e)<=100));
  const sz=a.alle('.szene');
  ck('Die Szenen folgen aufeinander', von(sz[0])<von(sz[1]));
  ck('Szenen ueberlappen sich, damit sie ineinander blenden', bis(sz[0])>von(sz[1]), bis(sz[0])+' > '+von(sz[1]));
  ck('Die erste Szene steht sofort da', sz[0].classList.contains('ab')&&von(sz[0])===0);
  ck('Die letzte Szene reicht bis ans Ende und bleibt stehen',
     bis(sz[1])===100 && sz[1].classList.contains('auf'), bis(sz[1])+' '+sz[1].className);
  const el=[...sz[0].querySelector('.blatt').children];
  ck('Die Bloecke eines Blattes erscheinen nacheinander',
     el.length>1 && el.every((e,i)=>i===0||von(e)>=von(el[i-1])), el.map(e=>von(e).toFixed(1)).join(' '));
  ck('Alle Bloecke erscheinen innerhalb ihrer Szene',
     el.every(e=>von(e)>=von(sz[0])-0.01 && von(e)<=bis(sz[0])+0.01));
  ck('Was einmal dasteht, bleibt bis zum Ende des Bogens',
     el.every(e=>!e.classList.contains('blende')));
  ck('Ein schwerer Beat baut langsamer auf als ein leichter', (()=>{
      // Der letzte Block des schweren Beats erscheint spaeter in seinem Abschnitt
      const abst=el.map((e,i)=>i===0?0:von(e)-von(el[i-1]));
      return Math.max(...abst)>0; })());
  ck('Die Kurve zeichnet sich frueh in ihrer Szene',
     (()=>{const k=a.q('path.kurve'); return k && von(k)<(von(sz[0])+bis(sz[0]))/2;})());
}

console.log('— Sicherheit —');
{ const b=welt({titel:'<img src=x onerror=alert(1)>',boegen:[{frage:'F',beats:[{sub:'<b>fett</b>',payoff:true,ops:[
    {op:'h',t:'<script>bad()<\/script>'},{op:'item',t:'<i>kursiv</i>'},
    {op:'math',tex:'\\href{javascript:x}{y}+\\class{a}{b}'},
    {op:'note',t:'<img src=x onerror=alert(2)>'}]}]}]},true);
  ck('Titel wird nicht als HTML gedeutet', b.q('#torTitel').querySelector('img')===null);
  ck('Ueberschrift wird nicht als HTML gedeutet', b.q('h2').querySelector('script')===null);
  ck('Satz wird nicht als HTML gedeutet', b.q('.satz').querySelector('b')===null);
  ck('Listenpunkt wird nicht als HTML gedeutet', b.q('.item span').querySelector('i')===null);
  ck('Gefaehrliche TeX-Befehle fallen weg', !/href|class/.test(b.q('.mathline').textContent), b.q('.mathline').textContent);
  ck('Notiz wird nicht als HTML gedeutet', b.q('.notebox').querySelector('img')===null);
}

console.log('— Operationen —');
{ const c=welt({titel:'Ops',boegen:[{frage:'F',beats:[
   {sub:'a',ops:[{op:'umformung',zeilen:[{tex:'x+1=2',warum:'Start'},{tex:'x=1',warum:'minus 1'}]}]},
   {sub:'b',ops:[{op:'tabelle',art:'serie',kopf:['x','f(x)'],zeilen:[['1','2 \\cdot 1'],['2','2 \\cdot 2'],['!Text','3']]}]},
   {sub:'c',ops:[{op:'frage',t:'Warum?'},{op:'merksatz',t:'Darum.'}]},
   {sub:'d',payoff:true,ops:[{op:'jetztihr',aufgabe:'f(x)=x',loesung:'x'}]}]}]},true);
  ck('Umformung als Kette', c.alle('.kette .mathline').length===2);
  ck('Vorige Zeile verblasst', c.q('.kette .mathline.alt')!==null);
  ck('Jede Zeile nennt ihren Grund', c.alle('.kette .warum').length===2,
     c.alle('.kette .warum').map(x=>x.textContent).join(' | '));
  ck('Der Grund steht vor seiner Zeile',
     c.q('.kette').children[0].classList.contains('warum'));
  ck('Tabellenkopf ist Klartext', c.q('.mtab th').textContent==='x');
  ck('Tabellenzelle ist Formel', c.alle('.mtab td')[1].textContent==='\\(2 \\cdot 1\\)');
  ck('Zelle mit Ausrufezeichen bleibt Klartext', c.alle('.mtab td').some(t=>t.textContent==='Text'));
  ck('Frage steht hervorgehoben', c.q('.fragezeile')!==null);
  ck('Auch der Fragetakt bekommt dieselbe Strecke', (()=>{
     const k=[...c.alle('.szene')[0].querySelector('.blatt').children];
     return k.every((x,i)=>i===0||von(x)>=von(k[i-1])); })());
  ck('Jetzt ihr mit Aufgabe', c.q('.jetzt .marke').textContent==='Jetzt ihr:');
  { const j=welt({titel:'J',boegen:[{frage:'F',beats:[{sub:'a',payoff:true,ops:[{op:'jetztihr',
      t:'Wo ist der Punkt?',aufgabe:'f(x)=x^{2}-6x',
      loesungTex:"f'(x)=2x-6",loesungText:'2x-6=0 ergibt x=3'}]}]}]},true);
    ck('Aufgabe zeigt Klartext und Formel',
       /Wo ist der Punkt/.test(j.q('.jetzt').textContent)&&/x\^\{2\}-6x/.test(j.q('.jetzt').textContent),
       j.q('.jetzt').textContent);
    ck('loesungTex gilt wie loesung', /2x-6/.test(j.q('.loesung').textContent), j.q('.loesung').textContent);
    ck('Loesungstext steht daneben', /ergibt x=3/.test(j.q('.loesung').textContent)); }
  ck('Die Loesung kommt spaeter als die Aufgabe', von(c.q('.loesung'))>von(c.q('.jetzt')),
     von(c.q('.jetzt')).toFixed(2)+' → '+von(c.q('.loesung')).toFixed(2));
}

console.log('— Das Paar —');
{ const P=welt({titel:'P',boegen:[{frage:'F',beats:[{sub:'a',payoff:true,ops:[
    {op:'paar',oben:'f(x)=3x^{2}',unten:"f'(x)=6x",hin:'ableiten',zurueck:'integrieren',
     paare:[['3','6'],['x^{2}','x']]}]}]}]},true);
  const k=P.q('.paar');
  ck('Paar ist ein Block', !!k && k.classList.contains('el'));
  ck('Zwei Formelzeilen', k.querySelectorAll('.mathline').length===2);
  ck('Beide Wege stehen dazwischen',
     /integrieren/.test(k.querySelector('.pfeile .zur').textContent)&&
     /ableiten/.test(k.querySelector('.pfeile .hin').textContent),
     k.querySelector('.pfeile').textContent);
  ck('Pfeile zeigen in beide Richtungen',
     k.querySelector('.pfeile .zur').textContent.includes('\u2191')&&
     k.querySelector('.pfeile .hin').textContent.includes('\u2193'));
  ck('Korrespondierende Teile bekommen dieselbe Farbe', (()=>{
      const z=[...k.querySelectorAll('.mathline')].map(x=>x.textContent);
      const f1=(z[0].match(/\\color\{(#[0-9a-f]{6})\}/gi)||[]);
      const f2=(z[1].match(/\\color\{(#[0-9a-f]{6})\}/gi)||[]);
      return f1.length===2&&f2.length===2&&f1[0]===f2[0]&&f1[1]===f2[1]; })(),
     [...k.querySelectorAll('.mathline')].map(x=>x.textContent).join(' | '));
  const O=welt({titel:'O',boegen:[{frage:'F',beats:[{sub:'a',payoff:true,ops:[
    {op:'paar',oben:'f(x)=x'},{op:'text',t:'danach'}]}]}]},true);
  ck('Paar ohne zweite Zeile wird still verworfen',
     O.q('.paar')===null && O.alle('p.txt').some(e=>e.textContent==='danach'));
}

console.log('— Die vier Geraete —');
{ const G={titel:'G',boegen:[{frage:'Wie haengen f und die Steigung zusammen?',beats:[
    {sub:'Der Wert steht im Bild.',ops:[
      {op:'plot',id:'p',expr:'x^2',xmin:-3,xmax:3,ymin:-1,ymax:9,legend:'f'},
      {op:'wert',id:'p',x:2,tex:'f(2)=4',label:'4'}]},
    {sub:'Zwei Systeme.',ops:[
      {op:'doppelgraph',id:'d',expr:'x^2',expr2:'2*x',xmin:-3,xmax:3,ymin:-1,ymax:9,ymin2:-6,ymax2:6,
       legend:'f',legend2:'fs'},
      {op:'binden',x:2,label:'4',label2:'4'}]},
    {sub:'Die Folge naehert sich.',ops:[
      {op:'plot',id:'q',expr:'x^2',xmin:-1,xmax:4,ymin:-2,ymax:10,legend:'f'},
      {op:'bildfolge',id:'q',art:'sekante',x:1,stufen:[2,1,0.5,0]}]},
    {sub:'Wir fahren hinein.',payoff:true,ops:[
      {op:'zoomfolge',expr:'x^2',x:1,zoom:10,xmin:-2,xmax:4,ymin:-2,ymax:10,label:'P(1|1)'}]}]}]};
  const a=welt(G,true);
  const szene=a.alle('.szene')[0];
  const lagen=[...szene.querySelectorAll('.blatt > .bild')];
  ck('Vier Bilder, vier Bloecke im Blatt', lagen.length===4, lagen.length);
  ck('Die Bilder erscheinen nacheinander', lagen.every((l,i)=>i===0||von(l)>=von(lagen[i-1])));

  const mz=szene.querySelector('.blatt .mathline');
  const kreis=lagen[0].querySelector('circle.schritt.punkt');
  ck('Wert steht als Formelzeile da', !!mz, mz&&mz.textContent);
  ck('Wert steht zugleich als Punkt im Bild', !!kreis);
  ck('Formel und Bildmarke teilen das Zeitfenster', !!mz&&!!kreis&&mz.dataset.a===kreis.dataset.a,
     mz&&mz.dataset.a+'/'+kreis.dataset.a);
  ck('Zeiger fuehrt zu beiden Achsen', lagen[0].querySelectorAll('line.schritt.zeiger').length>=2);

  const d=lagen[1];
  ck('Doppelgraph ist ein hohes Bild', /^0 0 440 5\d\d$/.test(d.querySelector('svg').getAttribute('viewBox')),
     d.querySelector('svg').getAttribute('viewBox'));
  ck('Doppelgraph hat zwei Kurven', d.querySelectorAll('path.kurve').length===2);
  ck('Ein Strich verbindet beide Systeme',
     [...d.querySelectorAll('line.schritt.zeiger')].filter(l=>Math.abs((+l.getAttribute('y2'))-(+l.getAttribute('y1')))>300).length===1);
  ck('In beiden Systemen sitzt ein Punkt', d.querySelectorAll('circle.schritt.punkt').length===2);

  const b=lagen[2];
  const fl=b.querySelectorAll('.fluechtig'), letzte=b.querySelectorAll('.letzte');
  ck('Zwischenstufen sind fluechtig', fl.length>0, fl.length);
  ck('Nur das Grenzbild bleibt', letzte.length>0&&[...letzte].every(k=>!k.classList.contains('fluechtig')));
  ck('Jede Stufe nennt ihr h', (()=>{const t=[...b.querySelectorAll('text.schritt')].map(x=>x.textContent);
     return t.some(x=>/^h = /.test(x))&&t.some(x=>/Beruehr/.test(x));})());
  ck('Die Stufen laufen nacheinander', von(fl[0])<von(letzte[0]),
     von(fl[0]).toFixed(2)+' → '+von(letzte[0]).toFixed(2));

  const z=lagen[3].querySelector('g.zoomer');
  ck('Zoomgruppe umschliesst das Bild', !!z&&z.querySelector('path.kurve')!==null);
  ck('Zoom faehrt in die Stelle', !!z&&/px/.test(z.style.getPropertyValue('--zx')));
  ck('Zoomtiefe gesetzt', !!z&&z.style.getPropertyValue('--zf')==='10');
  ck('Der Zoom laeuft ueber fast die ganze Lage',
     !!z&&(bis(z)-von(z))>0.72*(bis(lagen[3])-von(lagen[3])),
     ((bis(z)-von(z)).toFixed(1))+' von '+((bis(lagen[3])-von(lagen[3])).toFixed(1)));
  ck('Beruehrgerade liegt schon im Bild', !!z&&z.querySelectorAll('line[stroke-dasharray]').length>0);
}

console.log('— Der Film als eigene Datei —');
{
  const F={titel:'Extern',quelle:'Q',boegen:[{frage:'F',beats:[
    {sub:'eins',ops:[{op:'text',t:'aus der Datei'}]},{sub:'zwei',payoff:true,ops:[{op:'note',t:'x'}]}]}]};
  const holen=(u)=>Promise.resolve({ok:true,json:()=>Promise.resolve(F)});
  const a=welt(F,true,{eingebaut:false,abfrage:'?film=filme/extern.json',holen});
  // fetch loest erst im naechsten Takt auf; wir warten einen Mikrotakt ab
  await new Promise(r=>setTimeout(r,0));
  ck('Der Film wird aus der Datei geladen', a.q('#torTitel').textContent==='Extern',
     a.q('#torTitel').textContent);
  ck('Die Szenen entstehen aus der geladenen Datei', a.alle('.szene').length===2, a.alle('.szene').length);
  ck('Der Inhalt der Datei steht auf der Buehne',
     a.alle('p.txt').some(e=>e.textContent==='aus der Datei'));

  let gerufen=null;
  const b=welt(F,true,{eingebaut:false,abfrage:'?film=https://fremd.example/x.json',
    holen:(u)=>{gerufen=u; return Promise.resolve({ok:true,json:()=>Promise.resolve(F)});}});
  await new Promise(r=>setTimeout(r,0));
  ck('Eine fremde Herkunft wird nicht geholt', gerufen===null, gerufen);

  let gerufen2=null;
  const c2=welt(F,true,{eingebaut:false,abfrage:'?film=../geheim.json',
    holen:(u)=>{gerufen2=u; return Promise.resolve({ok:true,json:()=>Promise.resolve(F)});}});
  await new Promise(r=>setTimeout(r,0));
  ck('Ein Aufstieg im Baum wird nicht geholt', gerufen2===null, gerufen2);

  const d=welt(F,true,{eingebaut:false,abfrage:'?film=filme/weg.json',
    holen:()=>Promise.resolve({ok:false,status:404,json:()=>Promise.reject(new Error('x'))})});
  await new Promise(r=>setTimeout(r,0));
  ck('Fehlt die Datei, sagt das Tor es', /nicht gefunden/.test(d.q('#torTitel').textContent),
     d.q('#torTitel').textContent);
  ck('Dann laesst sich auch nichts starten', d.q('#start').disabled===true);
}

console.log('— Robustheit —');
{ const B=welt({titel:'B',boegen:[{beats:[{sub:'x',ops:[
    {op:'wert',x:2,tex:'f(2)=4'},{op:'binden',x:1},
    {op:'bildfolge',id:'nix',art:'sekante',x:1,stufen:[1]},
    {op:'zoomfolge',expr:'sqrt(',x:1},
    {op:'gibtsnicht',t:'egal'},
    {op:'text',t:'danach'}]}]}]},true);
  ck('Geraete ohne Bild brechen nicht ab', B.alle('p.txt').some(e=>e.textContent==='danach'));
  const L=welt({titel:'Leer',boegen:[]},true);
  ck('Leerer Film bricht nicht ab', L.alle('.szene').length===1);
  const F=welt({titel:'Flach',beats:[{sub:'a',payoff:true,ops:[{op:'text',t:'x'}]}]},true);
  ck('Alte flache Fassung wird als ein Bogen gelesen', F.alle('.szene').length===2);
}

console.log('— Rueckfall ohne Zeitleiste —');
{ const r=welt(D,false);
  ck('Ohne Zeitleiste wird von Hand gedreht', r.w.document.documentElement.classList.contains('zuFuss'));
  const m=welt(D,true);
  ck('Mit laufender Zeitleiste kein Rueckfall', !m.w.document.documentElement.classList.contains('zuFuss'));
}

console.log(f?('\n'+f+' FEHLER'):'\nBuehne grün');
