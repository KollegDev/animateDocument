#!/usr/bin/env node
// Prueft eine Blattkino-Datei gegen die Gesetze aus matheguss.
// Aufruf:  node pruefe.mjs film.json [player.html]
// Ausgabe: Befunde, je einer pro Zeile. Kein Lob, keine Nacherzaehlung.
import fs from 'fs';
import path from 'path';

const VH = 812;                      // Bildhoehe eines Handys, Massstab der Puffer-Pruefung
const datei = process.argv[2];
if(!datei){ console.error('Aufruf: node pruefe.mjs film.json [player.html]'); process.exit(2); }
const roh = fs.readFileSync(datei,'utf8');
let D; try{ D = JSON.parse(roh); }catch(e){ console.log('SCHWER  JSON nicht lesbar: '+e.message); process.exit(1); }

// compileExpr aus dem Spieler holen, damit Ausdruecke genau so geprueft werden, wie sie laufen
const spieler = process.argv[3] || path.join(path.dirname(new URL(import.meta.url).pathname),'player.html');
let compileExpr = () => true;
try{
  const h = fs.readFileSync(spieler,'utf8');
  const src = h.slice(h.indexOf('function compileExpr'), h.indexOf('function num('));
  compileExpr = new Function(src + '; return compileExpr;')();
}catch(e){ /* ohne Spieler wird expr nicht geprueft */ }

const befunde = [];
const B = (schwere, wo, text) => befunde.push({schwere, wo, text});

// ---------- Struktur ----------
const boegen = Array.isArray(D.boegen) ? D.boegen
             : (Array.isArray(D.beats) ? [{beats:D.beats}] : null);
if(!boegen){ console.log('SCHWER  Weder "boegen" noch "beats" vorhanden.'); process.exit(1); }
if(!D.titel) B('SCHWER','Kopf','Kein "titel". Jede Datei hiesse sonst gleich.');

const OPS = ['clear','h','text','item','math','note','frage','umformung','tabelle','merksatz',
             'jetztihr','plot','point','hline','vline','region','sweep',
             'wert','doppelgraph','binden','bildfolge','zoomfolge','paar'];
const UEBERFLIEG = ['h','tabelle','merksatz','plot','jetztihr','doppelgraph','zoomfolge'];
// Geraete, die ein eigenes Bild aufmachen. Nach ihnen ist ein neues Bild noetig, um sie anzusprechen.
const BILDER = ['plot','doppelgraph','zoomfolge'];

// ---------- Hoehenmodell ----------
// Auf der Buehne zaehlt nicht mehr, wie lang ein Bogen scrollt: jeder Takt bekommt
// dieselbe Strecke am Rad. Gemessen wird jetzt, ob ein Beat auf einen Bildschirm passt.
// Kalibriert an echten Messungen bei 375 Pixel Breite.
const zeilen = (t,proZeile=46) => Math.max(1, Math.ceil(String(t||'').length/proZeile));
function hoehe(o){
  switch(o.op){
    case 'clear':     return 0;   // auf der Buehne wirkungslos, die Szene trennt selbst
    case 'h':         return 90;
    case 'text':      return 27*zeilen(o.t)+14;
    case 'item':      return 28*zeilen(o.t,40)+8;
    case 'math':      return (o.hl?46:28)+34;
    case 'note':      return 27*zeilen(o.t,52)+24;
    case 'frage':     return 27*zeilen(o.t,44)+30;
    case 'umformung': return (Array.isArray(o.zeilen)?o.zeilen:[]).reduce((n,z)=>n+30+(z&&z.warum?24:0),0)+26;
    case 'tabelle':   return 34 + 34*((Array.isArray(o.zeilen)?o.zeilen:[]).length) + 26;
    case 'merksatz':  return 27*zeilen(o.t,44)+50;
    case 'jetztihr':  return 34 + 27*zeilen(o.t||o.aufgabe,44) + 44;
    // Ein Bild ist ein Block im Blatt wie jeder andere und kostet seine Hoehe.
    // 440 zu 290 auf 335 Pixel Breite sind 221; der Doppelgraph ist doppelt so hoch.
    case 'plot': case 'zoomfolge':   return 230;
    case 'doppelgraph':              return 460;
    // Marken und Folgen zeichnen in ein vorhandenes Bild und kosten keine eigene Hoehe.
    case 'point': case 'hline': case 'vline': case 'region': case 'sweep':
    case 'binden': case 'bildfolge':  return 0;
    // Ein Wert bringt eine Formelzeile in den Text
    case 'wert':        return o.tex?42:0;
    // Zwei Formelzeilen plus die Pfeilzeile dazwischen
    case 'paar':        return 154;
    default:          return 0;   // Markierungen im Graphen kosten keine eigene Hoehe
  }
}
const beatHoehe = b => (Array.isArray(b.ops)?b.ops:[]).reduce((n,o)=>n+hoehe(o),0)
                     + 27*zeilen(b.sub);
// Ein Bogen ist ein Blatt und ein Blatt ist ein Bildschirm. Abzueglich Frage,
// Sicherheitsraendern und dem kleinsten Abstand zwischen den Bloecken bleiben:
const BLATT = 0.86*VH;
// Jeder Block braucht mindestens diesen Abstand zum naechsten.
const ABSTAND = 8;
// Wie viele Bloecke ein Beat im Blatt erzeugt: der Satz plus jede sichtbare Op.
const SICHTBAR = ['h','text','item','math','note','frage','umformung','tabelle','merksatz',
                  'jetztihr','plot','doppelgraph','zoomfolge','paar'];
const beatBloecke = b => (b.sub&&String(b.sub).trim()?1:0)
  + (Array.isArray(b.ops)?b.ops:[]).filter(o=>SICHTBAR.includes(o.op)).length
  + (Array.isArray(b.ops)?b.ops:[]).filter(o=>o.op==='jetztihr').length      // Loesung ist ein zweiter Block
  + (Array.isArray(b.ops)?b.ops:[]).filter(o=>o.op==='wert'&&o.tex).length;

// ---------- Sprach- und Haltungsfilter ----------
const GEBRABBEL = [
  [/\b(in diesem Kapitel|in diesem Abschnitt|wir werden|wir schauen uns|zuerst schauen wir|der Weg beginnt)\b/i,'geleakter Plan'],
  [/\b(ihr erinnert euch|wie wir gesehen haben|wie oben gezeigt|wie vorhin|von vorhin|weiter oben)\b/i,'Verweis statt Reprise'],
  [/\b(der Trick|ganz einfach|keine Sorge|natuerlich ist das|wie ihr seht)\b/i,'Fuellwort'],
  [/\b(lasst uns|jetzt kommt|gleich sehen wir)\b/i,'Ankuendigung'],
];
const SPRACHE = [
  [/[—–]/,'Gedankenstrich'],
  [/\b\w+(:innen|\*innen|\/innen)\b/,'Gendern'],
  [/\bist nicht\b[^.]{0,60}\bsondern\b/i,'Konstruktion "nicht x, sondern y"'],
  [/\d+\.\d+\s*(FE|cm|m|Einheiten)?\b/,'Dezimalpunkt statt Komma'],
];
function textVon(b){
  const t=[b.sub];
  for(const o of (Array.isArray(b.ops)?b.ops:[])){
    t.push(o.t,o.label,o.legend,o.warum,o.loesungText);
    if(Array.isArray(o.zeilen)) for(const z of o.zeilen) t.push(z&&z.warum);
  }
  return t.filter(x=>typeof x==='string').join(' \n ');
}

// ---------- Durchlauf ----------
let nBeats=0, gewichte=[], nFokus=0, alleTex=[], alleText=[];
let offenesBild=null;   // welches Bild gerade steht; Markierungen brauchen eines
boegen.forEach((bo,bi)=>{
  offenesBild=null;     // jede Szene faengt mit leerer Buehne an
  const wo = 'Bogen '+(bi+1);
  const bs = Array.isArray(bo.beats)?bo.beats:[];
  if(!bs.length){ B('SCHWER',wo,'ohne Beats.'); return; }
  if(!bo.frage) B('MITTEL',wo,'ohne "frage": die lebende Frage fehlt, die den Bogen zieht.');

  // Puffer: jeder Takt kostet dieselbe Strecke, also zaehlt die Zahl der Beats.
  // Was der Leser vor der Aufloesung noch im Kopf halten muss, ist begrenzt.
  if(bs.length > 6) B('SCHWER',wo,bs.length+' Beats bis zur Aufloesung. Der Ein-Minuten-Puffer reisst. Teilen.');
  else if(bs.length > 5) B('MITTEL',wo,bs.length+' Beats. Grenzwertig fuer den Puffer.');

  // Ein Bogen ist ein Blatt und das Blatt ist ein Bildschirm. Alles, was im Bogen
  // erscheint, steht am Ende gleichzeitig da: das ist der ausgelagerte Speicher.
  const bloecke = bs.reduce((n,b)=>n+beatBloecke(b),0);
  const hoeheB  = bs.reduce((n,b)=>n+beatHoehe(b),0) + Math.max(0,bloecke-1)*ABSTAND;
  if(hoeheB > BLATT*1.15)
    B('SCHWER',wo,'passt nicht auf ein Blatt: '+Math.round(hoeheB)+' von '+Math.round(BLATT)
      +' Pixeln bei '+bloecke+' Bloecken. Teilen.');
  else if(hoeheB > BLATT)
    B('MITTEL',wo,'fuellt das Blatt bis zum Rand: '+Math.round(hoeheB)+' von '+Math.round(BLATT)
      +' Pixeln. Der Spieler verkleinert es.');

  // Genau eine Aufloesung, und sie steht am Ende
  const pay = bs.map((b,i)=>b.payoff===true?i:-1).filter(i=>i>=0);
  if(pay.length===0) B('SCHWER',wo,'ohne "payoff": kein Beat loest die Spannung auf.');
  else if(pay.length>1) B('MITTEL',wo,pay.length+' Beats mit "payoff". Ein Bogen hat eine Aufloesung.');
  else if(pay[0] < bs.length-2) B('MITTEL',wo,'die Aufloesung steht '+(bs.length-1-pay[0])+' Beats vor dem Ende. Danach steht Fremdes im offenen Bogen.');

  // Von einem Bild sprechen und keines zeigen
  // Aufzaehlungen nennen Dinge, sie versprechen sie nicht. "Skizze" in einer Schrittliste
  // ist kein Versprechen, ein Bild zu zeigen.
  const bogenText = bs.map(b=>[b.sub].concat((b.ops||[]).filter(o=>o.op!=='item')
      .map(o=>[o.t,o.label,o.legend,o.warum,o.loesungText].filter(x=>typeof x==='string').join(' ')))
      .filter(x=>typeof x==='string').join(' ')).join(' ');
  const hatBild = bs.some(b=>(b.ops||[]).some(o=>BILDER.includes(o.op)));
  if(!hatBild && /\b(Graph|Graphen|Kurve|Parabel|Skizze|Schaubild|zeichnet|gezeichnet|Zeichnung)\b/i.test(bogenText))
    B('MITTEL',wo,'spricht vom Bild ("'+(bogenText.match(/\b(Graph|Graphen|Kurve|Parabel|Skizze|Schaubild|zeichnet|gezeichnet|Zeichnung)\b/i)||[''])[0]+'"), zeigt aber keines. Setze einen plot.');
  // Ein benutzter Funktionswert gehoert ins Bild, nicht nur in die Formel
  if(hatBild && !bs.some(b=>(b.ops||[]).some(o=>o.op==='wert'))){
    const tex = bs.flatMap(b=>(b.ops||[])).filter(o=>o.op==='math').map(o=>String(o.tex||'')).join(' ');
    const tr = tex.match(/[a-zA-Z]'?\(\s*-?\d+(?:[,.]\d+)?\s*\)\s*=/);
    if(tr) B('MITTEL',wo,'benutzt den Wert "'+tr[0]+'" nur in der Formel. Im Bild ist er eine Stelle: nimm "wert".');
  }

  // Ueberflieg: traegt der Bogen ohne Fliesstext?
  const traeger = bs.some(b=>(b.ops||[]).some(o=>UEBERFLIEG.includes(o.op)));
  if(!traeger) B('MITTEL',wo,'nichts zum Ueberfliegen: keine Ueberschrift, Tabelle, Merksatz, Graph oder Aufgabe.');

  // clear gehoert an den Anfang eines Bogens, nie hinein
  bs.forEach((b,i)=>{ if(i>0 && (b.ops||[]).some(o=>o.op==='clear'))
    B('MITTEL',wo+', Beat '+(i+1),'"clear" mitten im Bogen zerschneidet ihn.'); });

  // Regel ohne Serie
  const hatMerksatz = bs.some(b=>(b.ops||[]).some(o=>o.op==='merksatz'));
  // Ein Bogen mit "fortsetzung": true setzt den vorigen fort. Seine Serie zaehlt weiter,
  // damit eine Blattgrenze eine Musterserie nicht zerreisst.
  const vorherBs = (bo.fortsetzung===true && bi>0 && Array.isArray(boegen[bi-1].beats))
                   ? boegen[bi-1].beats : [];
  const alleOps = bs.concat(vorherBs).flatMap(b=>(b.ops||[]));
  const tabZeilen = alleOps.filter(o=>o.op==='tabelle').reduce((n,o)=>n+((o.zeilen||[]).length),0);
  const nMath = alleOps.filter(o=>o.op==='math'||o.op==='umformung'||o.op==='paar').length;
  // Eine Serie muss nicht aus Zeilen bestehen. Vier Stufen einer Bildfolge sind vier Faelle,
  // drei gebundene Stellen sind drei Faelle. Was der Leser gesehen hat, zaehlt.
  // Ein ganzes Bild zeigt einen Fall. Zwei verschiedene Bilder tragen eine Regel ueber Bilder.
  const nBilder = alleOps.filter(o=>['bildfolge','zoomfolge','doppelgraph'].includes(o.op)).length;
  // Eine Marke zeigt eine Stelle. Drei Stellen tragen eine Regel ueber Stellen.
  const nMarken = alleOps.filter(o=>['binden','wert','point'].includes(o.op)).length
                + alleOps.filter(o=>o.op==='bildfolge').reduce((n,o)=>n+(Array.isArray(o.stufen)?o.stufen.length:0),0);
  if(hatMerksatz && tabZeilen<4 && nMath<4 && nBilder<2 && nMarken<3)
    B('SCHWER',wo,'Regel ohne Serie: ein Merksatz, aber weniger als vier Beispiele. Nach einem Beispiel hat der Leser nur eine Ahnung.');

  bs.forEach((b,i)=>{
    nBeats++;
    const wob = wo+', Beat '+(i+1);
    if(typeof b.sub!=='string'||!b.sub.trim()) B('SCHWER',wob,'ohne "sub".');
    gewichte.push(Math.round(+b.gewicht||2));
    if(b.fokus===true)nFokus++;
    const ops = Array.isArray(b.ops)?b.ops:[];
    if(ops.length>6) B('MITTEL',wob,ops.length+' Operationen. Ein Beat ist ein Gedanke.');
    for(const o of ops){
      if(!o||!OPS.includes(o.op)){ B('SCHWER',wob,'unbekannte Operation "'+(o&&o.op)+'".'); continue; }
      if(o.op==='plot'||o.op==='zoomfolge'||o.op==='doppelgraph'){
        if(!compileExpr(o.expr)) B('SCHWER',wob,'expr "'+o.expr+'" laesst sich nicht auswerten. Kein LaTeX, sondern 1/(x-4).');
      }
      if(o.op==='doppelgraph'){
        if(!compileExpr(o.expr2)) B('SCHWER',wob,'expr2 "'+o.expr2+'" laesst sich nicht auswerten.');
        if(!o.legend||!o.legend2) B('MITTEL',wob,'Doppelgraph ohne Beschriftung beider Systeme. Man muss sehen, welches oben f und welches unten f\' ist.');
        if(!bs.some(b2=>(b2.ops||[]).some(x=>x.op==='binden')))
          B('SCHWER',wob,'Doppelgraph ohne "binden" im selben Bogen. Zwei Bilder uebereinander sind noch kein Zusammenhang; erst der senkrechte Strich stiftet ihn.');
      }
      if(o.op==='bildfolge'){
        const st=Array.isArray(o.stufen)?o.stufen:[];
        if(st.length<3) B('MITTEL',wob,'Bildfolge mit '+st.length+' Stufen. Eine Annaeherung zeigt sich erst ueber mehrere.');
        if(st.length>6) B('MITTEL',wob,'Bildfolge mit '+st.length+' Stufen. Nach vier hat der Leser die Bewegung verstanden.');
        if(o.art!=='balken'){
          const z=st.map(Number);
          if(z.some(x=>!isFinite(x))) B('SCHWER',wob,'Bildfolge: "stufen" muss Zahlen enthalten (die h-Werte).');
          else{
            if(Math.abs(z[z.length-1])>1e-9) B('MITTEL',wob,'Bildfolge endet bei h='+z[z.length-1]+'. Das Grenzbild (h=0) fehlt, die Folge laeuft ins Leere.');
            for(let k=1;k<z.length;k++) if(Math.abs(z[k])>Math.abs(z[k-1])){
              B('SCHWER',wob,'Bildfolge: die Stufen werden nicht kleiner. Eine Annaeherung geht in eine Richtung.'); break; }
          }
        }
      }
      if(o.op==='zoomfolge'){
        const zf=+o.zoom;
        if(!(zf>=4)) B('MITTEL',wob,'Zoomtiefe '+(o.zoom===undefined?'fehlt':o.zoom)+'. Unter dem Faktor vier wird die Kurve nicht sichtbar gerade.');
      }
      if(o.op==='wert'&&!o.tex)
        B('SCHWER',wob,'"wert" ohne tex. Der Sinn des Geraets ist, dass Formel und Bild gleichzeitig dastehen.');
      if(['wert','point','hline','vline','region','sweep','bildfolge'].includes(o.op)){
        // Diese Geraete sprechen ein Bild an. Vorher muss in diesem Beat oder davor eines aufgemacht worden sein.
        if(!offenesBild) B('SCHWER',wob,'"'+o.op+'" ohne Bild. Vorher muss ein plot, doppelgraph oder zoomfolge stehen.');
      }
      if(o.op==='binden'&&offenesBild!=='doppelgraph')
        B('SCHWER',wob,'"binden" ohne Doppelgraph. Der verbindende Strich braucht zwei Systeme.');
      if(BILDER.includes(o.op)) offenesBild=o.op;
      if(o.op==='clear') offenesBild=null;
      if(o.op==='tabelle'){
        const z=Array.isArray(o.zeilen)?o.zeilen:[];
        // "regel" listet Bedingungen, "vergleich" stellt zwei Faelle gegenueber.
        // Nur die Musterserie (Vorgabe) muss lang und gleichgestaltig sein.
        const art = o.art||'serie';
        if(art==='serie'){
          if(z.length<4) B('MITTEL',wob,'Musterserie mit '+z.length+' Zeilen. Ein Muster zeigt sich erst ueber mehrere.');
          const skelett = z.map(r=>{const c=Array.isArray(r)?r[r.length-1]:r;
            return String(c||'').replace(/\d+/g,'#').replace(/\s+/g,'');}).filter(Boolean);
          if(skelett.length>=4 && new Set(skelett).size>skelett.length-1)
            B('MITTEL',wob,'die Notationsgestalt wechselt in jeder Zeile. Das Muster wird dadurch unsichtbar (4x²/4 statt 2x²).');
        }
      }
      // Alles zaehlt, was der Leser als Formel zu sehen bekommt, nicht nur math und umformung
      if(o.op==='math'&&o.tex) alleTex.push(o.tex);
      if(o.op==='wert'&&o.tex) alleTex.push(o.tex);
      if(o.op==='jetztihr'){ for(const f of [o.aufgabe,o.aufgabeTex,o.loesung,o.loesungTex]) if(f) alleTex.push(f); }
      if(o.op==='umformung'){
        const zs=(o.zeilen||[]).map(z=>z&&z.tex).filter(Boolean);
        for(const z of zs) alleTex.push(z);
        // Eine Rechnung ueber mehrere Zeilen deckt auch ihre zusammengezogene Gestalt ab
        if(zs.length>1) alleTex.push(zs.join(''));
      }
      if(o.op==='tabelle') for(const z of (o.zeilen||[])){
        const zellen=Array.isArray(z)?z:[z];
        for(const c of zellen){ const w=String(c??''); if(w&&!w.startsWith('!')) alleTex.push(w); }
      }
      if(o.op==='plot'||o.op==='zoomfolge'||o.op==='doppelgraph'){
        for(const f of [o.legend,o.legend2]) if(f) alleTex.push(String(f));
      }
      if(o.op==='frage'){
        const rest = ops.slice(ops.indexOf(o)+1).length + bs.slice(i+1).reduce((n,x)=>n+(x.ops||[]).length,0);
        if(rest===0) B('SCHWER',wob,'Frage ohne Auflösung im selben Bogen.');
      }
    }
    const t = textVon(b);
    alleText.push(t);
    for(const [re,name] of GEBRABBEL) if(re.test(t)) B('MITTEL',wob,name+': "'+(t.match(re)||[''])[0]+'".');
    for(const [re,name] of SPRACHE)   if(re.test(t)) B('MITTEL',wob,name+': "'+(t.match(re)||[''])[0]+'".');
    const lang = String(b.sub||'').split(/(?<=[.!?])\s+/).filter(x=>x.split(',').length>2);
    if(lang.length) B('LEICHT',wob,'Satz mit mehr als einem Nebensatz: "'+lang[0].slice(0,60)+'".');
  });
});

// ---------- Ueber das Ganze ----------
const einzigG=[...new Set(gewichte)];
if(einzigG.length===1) B('SCHWER','Ganzes','alle Beats haben Gewicht '+einzigG[0]+'. Es wurde nicht entschieden, was traegt.');
else if(!gewichte.includes(3)) B('MITTEL','Ganzes','kein Beat mit Gewicht 3. Welcher Schritt traegt das Dokument?');
if(nFokus>Math.max(2,Math.round(nBeats/12))) B('MITTEL','Ganzes',nFokus+' Fokusstellen bei '+nBeats+' Beats. Wenn alles hervorsticht, sticht nichts hervor.');
if(nFokus===0) B('LEICHT','Ganzes','keine Fokusstelle.');

// Inventar-Abdeckung, wenn eines beiliegt
if(typeof D.inventar==='string' && D.inventar.trim()){
  const norm=s=>String(s).toLowerCase().replace(/\\[a-z]+/g,'').replace(/[^a-z0-9]/g,'');
  const heu=norm(alleTex.join(' ')+' '+alleText.join(' '));
  const kand=(D.inventar.match(/[A-Za-z_\\][^\s,;]*\s*[=<>][^\s,;]+|\\frac\{[^}]*\}\{[^}]*\}|\\sqrt(\[\d\])?\{[^}]*\}/g)||[]);
  let fehlt=0;
  for(const k of kand){ const n=norm(k); if(n.length<4)continue;
    if(!heu.includes(n.slice(0,Math.min(n.length,14)))){ fehlt++; if(fehlt<=6)B('SCHWER','Inventar','fehlt im Film: '+k.trim()); } }
  if(fehlt>6) B('SCHWER','Inventar','und '+(fehlt-6)+' weitere Elemente fehlen.');
}

// ---------- Ausgabe ----------
const ord={SCHWER:0,MITTEL:1,LEICHT:2};
befunde.sort((a,b)=>ord[a.schwere]-ord[b.schwere]);
for(const f of befunde) console.log(f.schwere.padEnd(7)+f.wo.padEnd(22)+f.text);
const z=s=>befunde.filter(f=>f.schwere===s).length;
console.log('');
console.log(boegen.length+' Boegen, '+nBeats+' Beats, Gewichte '+JSON.stringify(gewichte.reduce((m,g)=>(m[g]=(m[g]||0)+1,m),{}))+', '+nFokus+' Fokus');
console.log(z('SCHWER')+' schwer, '+z('MITTEL')+' mittel, '+z('LEICHT')+' leicht');
process.exit(z('SCHWER')?1:0);
