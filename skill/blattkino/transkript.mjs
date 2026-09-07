#!/usr/bin/env node
// Schreibt aus einer Blattkino-Datei das Transkript, so wie ein Leser den Film am Handy erlebt.
// Blatt fuer Blatt, Wisch fuer Wisch: was steht da, was bewegt sich, in welcher Farbe.
// Grundlage fuer das Simulat (SIMULAT.md): der Leser des Transkripts kennt die Datei nicht.
// Aufruf:  node transkript.mjs film.json > TRANSKRIPT.md
import fs from 'fs';

const datei=process.argv[2];
if(!datei){ console.error('Aufruf: node transkript.mjs film.json'); process.exit(2); }
const D=JSON.parse(fs.readFileSync(datei,'utf8'));

// ---- Serie entfalten, wie im Spieler ----
function pfad(ctx,name){ let v=ctx; for(const t of String(name).split('.')){ if(v==null)return undefined; v=v[t]; } return v; }
function ersetzen(wert,ctx){
  if(typeof wert==='string'){ const g=wert.match(/^\{\{\s*([\w.]+)\s*\}\}$/); if(g)return pfad(ctx,g[1]);
    return wert.replace(/\{\{\s*([\w.]+)\s*\}\}/g,(m,n)=>{ const v=pfad(ctx,n); return v===undefined?m:String(v); }); }
  if(Array.isArray(wert)){ const aus=[]; for(const e of wert){
      if(e&&typeof e==='object'&&!Array.isArray(e)&&e.je){ const l=pfad(ctx,e.je); if(!Array.isArray(l))continue;
        l.forEach((elem,i)=>{ const c2=Object.assign({},ctx,(elem&&typeof elem==='object')?elem:{wert:elem},{i:i,k:(elem&&elem.k!==undefined)?elem.k:i});
          for(const d of ersetzen(e.dann||[],c2))aus.push(d); }); }
      else aus.push(ersetzen(e,ctx)); } return aus; }
  if(wert&&typeof wert==='object'){ const o={}; for(const k in wert)o[k]=ersetzen(wert[k],ctx); return o; }
  return wert; }
const boegen=[];
for(const bo of (D.boegen||(D.beats?[{beats:D.beats}]:[]))){
  if(bo&&bo.serie&&Array.isArray(bo.serie.vorlage)&&Array.isArray(bo.serie.faelle)){
    for(const fall of bo.serie.faelle){ const ctx=Object.assign({},fall);
      boegen.push({frage:ersetzen(fall.frage!==undefined?fall.frage:(bo.serie.frage||bo.frage||''),ctx),titel:ersetzen(fall.titel!==undefined?fall.titel:(bo.serie.titel||bo.titel||''),ctx),beats:ersetzen(bo.serie.vorlage,ctx),serieFall:true}); }
  } else boegen.push(bo);
}

// ---- Lesbare Formeln ----
const FARBE=['orange','blau','gruen','violett'];
const FM=['oranger','blauer','gruener','violetter'], FF=['orange','blaue','gruene','violette'], FN=['orangen','blauen','gruenen','violetten'];
// Ohne k faerbt der Spieler mit k0 (orange); das Transkript sagt dasselbe
const kk=k=>(k===undefined||k===null||isNaN(+k))?0:(+k%4);
const farbe=k=>FARBE[kk(k)];
const fm=k=>FM[kk(k)];   // ein oranger Punkt
const ff=k=>FF[kk(k)];   // die orange Marke
const fn=k=>FN[kk(k)];   // der orangen Zahl
function tex(s){
  let t=String(s==null?'':s).replace(/\\left|\\right/g,'');
  // Brueche, Wurzeln, Hoch- und Tiefstellungen von innen nach aussen, damit verschachtelte Klammern ganz bleiben
  for(let i=0;i<8;i++){ const v=t; t=t.replace(/([_^])\{([^{}]*)\}/g,'$1$2').replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g,'($1)/($2)').replace(/\\sqrt(\[\d\])?\{([^{}]*)\}/g,'√($2)'); if(t===v)break; }
  return t
    .replace(/\\cdot/g,'·').replace(/\\(neq|ne)(?![a-zA-Z])/g,'≠').replace(/\\(leq|le|leqslant)(?![a-zA-Z])/g,'≤').replace(/\\(geq|ge|geqslant)(?![a-zA-Z])/g,'≥')
    .replace(/\\(iff|Leftrightarrow)(?![a-zA-Z])/g,'⟺').replace(/\\(rightarrow|to)(?![a-zA-Z])/g,'→').replace(/\\Rightarrow(?![a-zA-Z])/g,'⇒')
    .replace(/\\infty/g,'∞').replace(/\\pm(?![a-zA-Z])/g,'±').replace(/\\mid(?![a-zA-Z])/g,' | ').replace(/\\in(?![a-zA-Z])/g,'∈').replace(/\\mathbb\{R\}/g,'ℝ').replace(/\\approx(?![a-zA-Z])/g,'≈')
    .replace(/\\quad|\\qquad|\\,|\\;|\\!|\\ /g,' ').replace(/\\left|\\right/g,'').replace(/\\text\{([^}]*)\}/g,'$1').replace(/\\mathrm\{([^}]*)\}/g,'$1')
    .replace(/\{,\}/g,',').replace(/\^\{([^}]*)\}/g,'^$1').replace(/_\{([^}]*)\}/g,'_$1').replace(/\{\}/g,'')
    .replace(/\\\(|\\\)/g,'').replace(/[{}]/g,'').replace(/\\([a-zA-Z]+)/g,'$1').replace(/\s+/g,' ').trim();
}
// Chip mit Farbe: die Zahl, die eine Farbe traegt, wird markiert
function teile(liste,chips){
  let s='';
  const lauf=t=>{ for(const p of t){
    if(Array.isArray(p)){ if(s&&!/\s$/.test(s))s+=' '; lauf(p); continue; }
    if(typeof p==='string'){ if(p!=='!eng')s+=tex(p); continue; }
    if(!p||typeof p!=='object')continue;
    if(p.bruch){ s+='('; lauf([].concat(p.bruch.oben||[])); s+=')/('; lauf([].concat(p.bruch.unten||[])); s+=')'; continue; }
    if(p.hoch){ lauf([].concat(p.hoch.basis||[])); s+='^('; lauf([].concat(p.hoch.exp||[])); s+=')'; continue; }
    const inhalt=p.tex!==undefined?tex(p.tex):String(p.t==null?'':p.t);
    if(p.id!==undefined)chips[p.id]={text:inhalt,k:p.k,leer:!!p.leer};
    if(p.leer){ s+='[Luecke]'; continue; }
    s+=p.k!==undefined?('['+inhalt+' '+FARBE[kk(p.k)]+']'):inhalt;
    if(p.fett)s+='(fett: '+p.fett+')';
  } };
  lauf(liste); return s.replace(/\s+/g,' ').trim();
}

const aus=[];
const P=s=>aus.push(s);
P('# Transkript: '+(D.titel||datei));
P('');
P('Der Film ist eine Folge von Blaettern, jedes Blatt ein Bildschirm. Man wischt nach unten; mit jedem Wisch kommen Bloecke dazu, von oben nach unten, und bleiben stehen, bis das Blatt voll ist. Dann blendet das naechste Blatt ein. Zurueckblaettern geht nur durch Zurueckwischen. Oben steht der Titel des Blattes, links daneben klein „Blatt n von N". Der Satz zu einem Wisch steht im Fluss des Blatts, direkt ueber dem, was der Wisch zeigt; der vorige Satz tritt zurueck (blasser), wenn der naechste kommt. Rechts ein Fortschrittsbalken. Was hier in eckigen Klammern steht, sieht der Leser als Bewegung oder Bild; Farben stehen bei der Zahl, die sie tragen.');
if(D.quelle){ P(''); P('Quelle laut Datei: '+D.quelle); }

function umbauTextMit(chips){ return (wege,ziel)=>{ const takte=new Map();
  (Array.isArray(wege)?wege:[]).forEach((w,i)=>{ const W=Array.isArray(w)?{von:w[0],zu:w[1],takt:w[2]}:(w&&typeof w==='object'?w:null); if(!W)return;
    const t=W.takt!==undefined?+W.takt:i; if(!takte.has(t))takte.set(t,[]);
    for(const v of [].concat(W.von)){ const von=chips[v]||{text:v}; const vt=(von.k!==undefined?ff(von.k)+' ':'')+von.text;
      if(W.weg||W.zu===undefined){ takte.get(t).push({von:vt,weg:true}); continue; }
      const zu=chips[W.zu]||{text:W.zu}; takte.get(t).push({von:vt,zu:zu.text,wird:!!W.wird,zieht:!!W.zieht}); } });
  const schritte=[...takte.keys()].sort((a,b)=>a-b).map(t=>{ const je=new Map(); const weg=[];
    for(const w of takte.get(t)){ if(w.weg){ weg.push(w.von); continue; } const key=w.zu+(w.wird?'!':'')+(w.zieht?'~':''); if(!je.has(key))je.set(key,{zu:w.zu,wird:w.wird,zieht:w.zieht,q:[]}); je.get(key).q.push(w.von); }
    const teile=[...je.values()].map(e=>e.zieht?('aus '+e.q.join(' und ')+' loest sich je ein '+e.zu+' heraus; sie treffen sich als ein '+e.zu)
      :(e.q.length>1?e.q.join(' und ')+' treffen sich als ein '+e.zu:(e.wird?e.q[0]+' wandert und wird dabei zu '+e.zu:e.q[0]+' → '+e.zu)));
    if(weg.length)teile.push(weg.join(' und ')+' wird durchgestrichen und verblasst'); return teile.join(', '); });
  return '[Umbau: die Teile der Zeile wandern an ihre neuen Plaetze, die Quelle verblasst: '+(schritte.join('; dann ')||'nichts wandert')+'. Dann schliesst sich die neue Zeile: '+ziel+']'; }; }

let nr=0;
for(const bo of boegen){
  const bs=Array.isArray(bo.beats)?bo.beats:[]; if(!bs.length)continue;
  nr++;
  const chips={}, graphen={}, pfeile={}, kand={}, zeilen={}; let letzterGraph=null; const umbauText=umbauTextMit(chips);
  const gname=o=>{ const id=(o&&o.id!==undefined)?o.id:null; return (id!==null&&graphen[id])?graphen[id]:(letzterGraph||'dem Bild'); };
  P('');
  // Kein Regie-Vermerk (Serie, Uebersicht): der Leser sieht nur das Blatt
  P('## Blatt '+nr+(bo.titel?' (Titel oben: „'+tex(String(bo.titel))+'")':(bo.frage?' (oben klein: „'+bo.frage+'")':' (ohne Titel)')));
  bs.forEach((b,bi)=>{
    P('');
    P('**Wisch '+(bi+1)+':**');
    const ops=Array.isArray(b.ops)?b.ops:[];
    // Ueberschrift vor dem Satz, wie im Spieler
    let i=0; while(i<ops.length&&ops[i]&&(ops[i].op==='clear'||ops[i].op==='h')){ if(ops[i].op==='h')P('Ueberschrift: '+ops[i].t); i++; }
    if(typeof b.sag==='string'&&b.sag.trim())P('[Der Lehrer sagt, an dieser Stelle im Blatt; der vorige Satz wird dabei leise:] '+b.sag.trim());
    if(typeof b.sub==='string'&&b.sub.trim())P(b.sub.trim());
    for(;i<ops.length;i++){ const o=ops[i]; if(!o||!o.op)continue;
      switch(o.op){
        case 'clear': break;
        case 'h': P('Ueberschrift: '+o.t); break;
        case 'text': case 'satz': P(String(o.t)); break;
        case 'item': P('• '+o.t); break;
        case 'note': P('[Randnotiz, klein:] '+o.t); break;
        case 'marke': P('[Kleine Marke, Kapitaelchen:] '+tex(o.t)); break;
        case 'merk': case 'merksatz': P('[Merksatz, Kasten:] '+o.t); break;
        case 'frage': P('[Fragezeile:] '+o.t); break;
        case 'math': P((o.hl?'[hervorgehoben, Kasten:] ':'')+tex(o.tex)); break;
        case 'zeile': { const s=teile(Array.isArray(o.teile)?o.teile:[o.tex],chips); if(o.id!==undefined)zeilen[o.id]=s; if(o.loesung){ P((o.stumm?'[Zeile liegt bereit, noch unsichtbar: ':'')+s+'   [doppelt unterstrichen: Endloesung]'+(o.stumm?']':'')); break; }
          if(o.stumm)P('[Zeile liegt bereit, noch unsichtbar: '+s+']');
          else P((o.hl?'[hervorgehoben, Kasten:] ':'')+(o.folge?'[Chip fuer Chip in Leserichtung:] ':'')+s); break; }
        case 'zeig': P('[Die vorbereitete Zeile erscheint'+(o.folge?' Chip fuer Chip':'')+'.]'); break;
        case 'graph': case 'plot': { const name=o.legend?tex(o.legend):('Graph von '+o.expr);
          if(o.id!==undefined)graphen[o.id]=name; letzterGraph=name;
          P('[Graph zeichnet sich: '+name+', x von '+(o.xmin??-5)+' bis '+(o.xmax??5)+', y von '+(o.ymin??-5)+' bis '+(o.ymax??5)+(o.h&&+o.h<160?', klein':'')+'.]'); break; }
        case 'punkt': P('[Ein '+(fm(o.k)||'')+' Punkt landet bei ('+o.x+'|'+o.y+') in '+gname(o)+'.]'); break;
        case 'point': case 'sweep': P('[Ein '+(fm(o.k)||'')+' Punkt landet bei ('+(o.x??o.x1)+'|'+(o.y??'f(x)')+')'+(o.label?', Beschriftung '+tex(o.label):'')+'.]'); break;
        case 'beschriftung': P('[Beschriftung '+tex(o.text)+' erscheint am Punkt ('+o.x+'|'+o.y+'), '+farbe(o.k)+'.]'); break;
        case 'hline': P('[Eine waagerechte Linie bei y = '+o.y+(o.label?' mit Beschriftung '+tex(o.label):'')+' erscheint.]'); break;
        case 'vline': P('[Eine senkrechte Linie bei x = '+o.x+(o.label?' mit Beschriftung '+tex(o.label):'')+' erscheint.]'); break;
        case 'region': P('[Der Bereich '+(o.dir==='below'?'unterhalb':'oberhalb')+' von y = '+o.y+' wird schraffiert'+(o.label?', Beschriftung '+tex(o.label):'')+'.]'); break;
        case 'kandidat': { if(o.achse==='y'){ const t=o.text!==undefined?o.text:o.y; kand[o.id]={y:o.y,k:o.k,text:t,achse:'y'};
            P(o.sofort?'[An der y-Achse steht die '+ff(o.k)+' Achsenmarke '+t+'.]':'[An der y-Achse bei '+o.y+' wartet eine '+ff(o.k)+' Achsenmarke '+t+', noch blass.]'); break; }
          const t=o.text!==undefined?o.text:o.x; kand[o.id]={x:o.x,k:o.k,text:t};
          P(o.sofort?'[An der x-Achse steht die '+ff(o.k)+' Achsenmarke '+t+'.]':'[An der x-Achse bei '+o.x+' wartet eine '+ff(o.k)+' Achsenmarke '+t+', noch blass.]'); break; }
        case 'kappe': P('[Im Graphen leuchtet das Kurvenstueck um x = '+o.x+' dick '+farbe(o.k)+' auf'+(o.text?', dabei klein „'+o.text+'"':'')+'.]'); break;
        case 'aufstieg': P('[Von der Achsenmarke '+o.x+' laeuft eine gestrichelte '+ff(o.k)+' Linie senkrecht zur Kurve und waagerecht zur y-Achse, dort steht '+(o.text!==undefined?o.text:o.y)+'.]'); break;
        case 'fahrt': P('[Beim Wischen faehrt eine '+ff(o.k)+' Beruehrgerade mit Punkt von x = '+(o.x0??'links')+' bis x = '+(o.x1??'rechts')+' ueber die Kurve; oben im Bild laufen x und m mit'+(Array.isArray(o.geister)&&o.geister.length?'; bei x = '+o.geister.join(', ')+' bleibt je ein blasser Abdruck stehen':'')+'.]'); break;
        case 'wert': P('[Im Graphen: von x = '+o.x+' laeuft eine Hilfslinie zur Kurve und zur y-Achse'+(o.label?', Beschriftung '+tex(o.label):'')+(o.tex?'; dazu steigt die Formelzeile auf: '+tex(o.tex):'')+'.]'); break;
        case 'pfeil': { const von=(o.von&&typeof o.von==='object'&&o.von.pfeil!==undefined)?('dem Stamm des Pfeils '+(pfeile[o.von.pfeil]||o.von.pfeil)):('der '+(chips[o.von]?chips[o.von].text:o.von)+' in der Zeile oben');
          const zu=chips[o.zu]?chips[o.zu].text:o.zu; if(o.id!==undefined)pfeile[o.id]='von '+zu;
          P('[Ein '+fm(o.k===undefined?0:o.k)+' Pfeil zieht sich langsam von '+von+' durch den Seitenrand nach unten und muendet von oben auf die '+zu+' in der Klammer der naechsten Zeile.]'); break; }
        case 'flug': { const von=chips[o.von]?chips[o.von].text:o.von;
          const zu=(o.zu&&typeof o.zu==='object'&&o.zu.kandidat!==undefined)?('zur '+((kand[o.zu.kandidat]||{}).achse==='y'?'y':'x')+'-Achse des Graphen; dort wird die Achsenmarke '+(kand[o.zu.kandidat]?kand[o.zu.kandidat].text:'')+' kraeftig'):('in die Luecke der Zeile '+(chips[o.zu]?'(dort steht dann '+von+')':''));
          P('[Eine Kopie der '+fn(o.k)+' '+von+' loest sich aus der Zeile und fliegt '+zu+'.]'); break; }
        case 'umbau': P(umbauText(o.wege,zeilen[o.zu]||o.zu)); break;
        case 'gabel': { P('[Von der Zeile darueber gehen zwei Pfeile schraeg nach links und rechts; darunter stehen zwei Spalten, die unabhaengig weiterrechnen:]');
          (Array.isArray(o.aeste)?o.aeste:[]).forEach((a,ai)=>{ P('   '+(ai?'rechter':'linker')+' Weg:');
            for(const z of (Array.isArray(a&&a.zeilen)?a.zeilen:[])){ if(!z)continue;
              const w=z.warum!==undefined&&z.warum!==null?String(z.warum):'';
              if(w&&!/^\s*\|/.test(w))P('     ↓ '+w);
              if(Array.isArray(z.teile)){ const t=teile(z.teile,chips); if(z.id!==undefined)zeilen[z.id]=t;
                if(w&&/^\s*\|/.test(w))P('     [rechts an der vorigen Zeile: „'+w.trim()+'"]');
                if(Array.isArray(z.wege)&&z.wege.length)P('     '+umbauText(z.wege,t));
                else P('     '+t+(z.loesung?'   [doppelt unterstrichen: Endloesung]':'')); }
              else if(z.tex)P('     '+tex(z.tex)+(z.loesung?'   [doppelt unterstrichen: Endloesung]':'')); } }); break; }
        case 'umformung': for(const z of (o.zeilen||[])){ if(!z)continue;
            const w=z.warum!==undefined&&z.warum!==null?String(z.warum):'';
            if(w&&!/^\s*\|/.test(w))P('   ↓ '+w);
            if(Array.isArray(z.teile)){ const s=teile(z.teile,chips); if(z.id!==undefined)zeilen[z.id]=s;
              if(w&&/^\s*\|/.test(w))P('   [rechts an der vorigen Zeile erscheint „'+w.trim()+'"]');
              if(Array.isArray(z.wege)&&z.wege.length)P('   '+umbauText(z.wege,s)+(z.loesung?'   [doppelt unterstrichen: Endloesung]':'')); else P('   '+s+(z.loesung?'   [doppelt unterstrichen: Endloesung]':'')); }
            else if(z.tex){ if(w&&/^\s*\|/.test(w))P('   [rechts an der vorigen Zeile erscheint „'+w.trim()+'"]'); P('   '+tex(z.tex)+(z.loesung?'   [doppelt unterstrichen: Endloesung]':'')); } } break;
        case 'tabelle': { if(Array.isArray(o.kopf))P('| '+o.kopf.map(k=>String(k).replace(/^!/,'')).join(' | ')+' |');
          for(const z of (o.zeilen||[])){ const zellen=Array.isArray(z)?z:[z]; P('| '+zellen.map(c=>{ const w=String(c==null?'':c); return w.startsWith('!')?w.slice(1):tex(w); }).join(' | ')+' |'); }
          P('[Tabelle erscheint als Ganzes.]'); break; }
        case 'paar': P('[Zwei Zeilen uebereinander, Teile gleichfarbig verbunden:] '+tex(o.oben)+'   '+(o.zurueck?'↑ '+o.zurueck+'  ':'')+(o.hin?o.hin+' ↓':'')+'   '+tex(o.unten)); break;
        case 'jetztihr': P('[Kasten „Jetzt ihr":] '+(o.t||'')+' '+tex(o.aufgabe||o.aufgabeTex||'')); P('[Nach einer Weile erscheint darunter „Loesung":] '+tex(o.loesung||o.loesungTex||'')+(o.loesungText?' '+o.loesungText:'')); break;
        case 'doppelgraph': P('[Zwei Koordinatensysteme uebereinander: oben '+tex(o.legend||o.expr)+', unten '+tex(o.legend2||o.expr2)+'; beide Kurven zeichnen sich.]'); break;
        case 'binden': P('[Ein senkrechter gestrichelter Strich bei x = '+o.x+' verbindet beide Bilder'+(o.label?', oben steht '+tex(o.label):'')+(o.label2?', unten '+tex(o.label2):'')+'.]'); break;
        case 'bildfolge': P('[Bildfolge: '+(o.art==='balken'?'Balken werden feiner: '+(o.stufen||[]).join(', '):'Sekanten von x = '+o.x+' mit h = '+(o.stufen||[]).join(', ')+', jede loest die vorige ab, die letzte bleibt'+(o.ziel?' („'+o.ziel+'")':''))+'.]'); break;
        case 'zoomfolge': P('[Graph '+tex(o.legend||o.expr)+' mit Punkt bei x = '+o.x+(o.label?' ('+tex(o.label)+')':'')+'; beim Wischen zoomt das Bild um den Punkt bis Faktor '+(o.zoom||8)+', die Kurve wird gerade.]'); break;
        default: P('['+o.op+']');
      }
    }
  });
}
P('');
P('## Schluss');
P(D.schluss?String(D.schluss):'Ende');
process.stdout.write(aus.join('\n')+'\n');
