#!/usr/bin/env node
// Prueft eine Blattkino-Datei gegen die Gesetze aus matheguss.
// Aufruf:  node pruefe.mjs film.json [player.html] [--hoehe]   (--hoehe zeigt das Hoehenmodell je Bogen und Beat)
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
  const ende = h.indexOf('function makePlot')>0 ? h.indexOf('function makePlot') : h.indexOf('function num(');
  const src = h.slice(h.indexOf('function compileExpr'), ende);
  compileExpr = new Function(src + '; return compileExpr;')();
}catch(e){ /* ohne Spieler wird expr nicht geprueft */ }

const befunde = [];
const B = (schwere, wo, text) => befunde.push({schwere, wo, text});

// ---------- Struktur ----------
const rohBoegen = Array.isArray(D.boegen) ? D.boegen
             : (Array.isArray(D.beats) ? [{beats:D.beats}] : null);
if(!rohBoegen){ console.log('SCHWER  Weder "boegen" noch "beats" vorhanden.'); process.exit(1); }
// ---------- Serie: Vorlage und Faelle, genau wie im Spieler entfaltet ----------
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
rohBoegen.forEach((bo,i)=>{
  if(bo&&bo.serie){
    if(!Array.isArray(bo.serie.vorlage)||!Array.isArray(bo.serie.faelle)){ B('SCHWER','Bogen '+(i+1),'serie ohne "vorlage" oder "faelle".'); return; }
    // Die Serie soll das Muster konstant halten: jede Entfaltung muss dieselbe Folge von Geraeten ergeben (G5, AL3/H3)
    const gestalten=[];
    for(const fall of bo.serie.faelle){ const ctx=Object.assign({},fall);
      const beats=ersetzen(bo.serie.vorlage,ctx);
      // Je Beat die Menge der Geraete, nicht ihre Zahl: drei Kandidaten sind dasselbe Muster wie einer
      gestalten.push(beats.map(b=>[...new Set((b.ops||[]).map(o=>o.op))].sort().join(',')).join(' | '));
      boegen.push({frage:ersetzen(fall.frage!==undefined?fall.frage:(bo.serie.frage||bo.frage||''),ctx),beats:beats,serieFall:true,fortsetzung:bo.fortsetzung}); }
    const arten=[...new Set(gestalten)];
    if(arten.length>1) B('MITTEL','Bogen '+(i+1),'serie: die Faelle erzeugen verschiedene Geraetefolgen. Eine Serie haelt das Muster konstant.');
  } else boegen.push(bo);
});
if(!D.titel) B('SCHWER','Kopf','Kein "titel". Jede Datei hiesse sonst gleich.');
if(!D.skill) B('LEICHT','Kopf','Kein Feld "skill". Trage die Version aus dem Kopf von SKILL.md ein, damit der Film seiner Skill-Fassung zuzuordnen bleibt.');
// Das Inventar ist der Treue-Vertrag. Ohne es kann niemand pruefen, was weggelassen wurde.
// Ein frei komponierter Film ("frei": true) hat kein Quelldokument und damit kein Inventar.
if(D.frei===true) B('LEICHT','Kopf','frei komponierter Film: keine Treuepruefung moeglich.');
else if(typeof D.inventar!=='string'||D.inventar.trim().length<40)
  B('SCHWER','Kopf','Kein "inventar" (oder zu kurz). Das Inventar ist Pflicht: jede Formel, jede Tabellenzeile, jeder Graph des Dokuments, wortgetreu, BEVOR der erste Bogen entsteht. Ohne Inventar ist Weglassen unsichtbar.');

const OPS = ['clear','h','text','item','math','note','frage','umformung','tabelle','merksatz',
             'jetztihr','plot','point','hline','vline','region','sweep',
             'wert','doppelgraph','binden','bildfolge','zoomfolge','paar',
             // v2 (Goldlauf)
             'satz','marke','merk','zeile','zeig','graph','punkt','beschriftung','kandidat','flug','pfeil','kappe','aufstieg','fahrt'];
const UEBERFLIEG = ['h','tabelle','merksatz','merk','plot','graph','jetztihr','doppelgraph','zoomfolge','marke'];
// Geraete, die ein eigenes Bild aufmachen. Nach ihnen ist ein neues Bild noetig, um sie anzusprechen.
const BILDER = ['plot','graph','doppelgraph','zoomfolge'];

// LaTeX glaetten: Befehle zu Woertern, \frac und \sqrt von innen nach aussen zu a/b und sqrt(a).
// Dieselbe Gestalt fuer Inventar und Film, damit \pm\sqrt{\frac{1}{3}} und pm sqrt(1/3) zusammenfallen.
function flach(s){
  let t=String(s==null?'':s).replace(/\\left|\\right/g,'').replace(/\\(cdot|quad|qquad|mid|in|mathbb|le|ge|leq|geq|geqslant|leqslant|neq|ne|rightarrow|iff|to|infty|pm|approx|ln|log|sin|cos|tan|e)(?![a-zA-Z])/g,' $1 ').replace(/\\[,;!]/g,' ');
  for(let i=0;i<6;i++){ const v=t;
    t=t.replace(/([_^])\{([^{}]*)\}/g,'$1$2').replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g,'($1)/($2)').replace(/\\sqrt(\[\d\])?\{([^{}]*)\}/g,' sqrt($2)');
    if(t===v)break; }
  return t;
}
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
    case 'graph':       return Math.round((+o.h||200)*(335/340))+(o.legend?24:0);
    case 'doppelgraph':              return 460;
    // v2: eine Zeile aus Chips, eine Marke, ein Satz
    case 'zeile':       return o.stumm?0:26;
    case 'zeig':        return 26;
    case 'satz':        return 27*zeilen(o.t)+2;
    case 'marke':       return 22;
    case 'merk':        return 27*zeilen(o.t,44)+30;
    case 'kandidat': case 'flug': case 'pfeil': case 'kappe': case 'aufstieg': case 'fahrt':
    case 'punkt': case 'beschriftung': return 0;
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
const BLATT = 0.93*VH;
// Jeder Block braucht mindestens diesen Abstand zum naechsten.
const ABSTAND = 16;
// Wie viele Bloecke ein Beat im Blatt erzeugt: der Satz plus jede sichtbare Op.
const SICHTBAR = ['h','text','item','math','note','frage','umformung','tabelle','merksatz',
                  'jetztihr','plot','doppelgraph','zoomfolge','paar',
                  'satz','marke','merk','zeile','graph'];
const beatBloecke = b => (b.sub&&String(b.sub).trim()?1:0)
  + (Array.isArray(b.ops)?b.ops:[]).filter(o=>SICHTBAR.includes(o.op)).length
  + (Array.isArray(b.ops)?b.ops:[]).filter(o=>o.op==='jetztihr').length      // Loesung ist ein zweiter Block
  + (Array.isArray(b.ops)?b.ops:[]).filter(o=>o.op==='wert'&&o.tex).length;

// ---------- Sprach- und Haltungsfilter ----------
const GEBRABBEL = [
  [/\b(in diesem Kapitel|in diesem Abschnitt|wir werden|wir schauen uns|zuerst schauen wir|der Weg beginnt|nun folgt|es folgt|als n(ae|ä)chstes|wir sehen)\b/i,'geleakter Plan'],
  // G6: Regieanweisung im Film. Der Leser sieht Mathematik, keinen Film, kein Blatt, keinen Finger.
  [/\b(der Finger|wischen|wischt|Film|Blatt|Bl(ae|ä)tter|Animation|Bildschirm)\b/,'Regieanweisung (Meta)'],
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
let nBeats=0, gewichte=[], nFokus=0, alleTex=[], alleText=[], nGewicht=0;
let offenesBild=null;   // welches Bild gerade steht; Markierungen brauchen eines
const farbenOhneZahl=new Set();  // dritte Farbe auf einem Punkt, den keine Zahl im Text traegt (G6 i)
const geraetKFilm=new Set();     // Farben, die ein Geraet im Film schon getragen hat: spaetere Reprise im Text ist erlaubt
const filmHatSerie=boegen.filter(b=>b&&b.serieFall).length>=3;
const nUebersicht=boegen.filter(b=>b&&b.uebersicht===true).length;
if(nUebersicht>1) B('MITTEL','Ganzes',nUebersicht+' Uebersichtsboegen. Hoechstens einer je Film, und nur, wenn der Film den Katalog danach abarbeitet. Zwei sind Aufschub.');
// P6/G6: der Film oeffnet mit einem Gegenstand (Gold: der Gipfel), nicht mit einer Karte
if(boegen.length&&boegen[0]&&boegen[0].uebersicht===true) B('MITTEL','Bogen 1','der Film oeffnet mit einer Uebersicht. Erst ein lebender Bogen mit Gegenstand und Frage, die Karte danach oder gar nicht.');
// P6: ein Film ohne einen einzigen Merksatz konsolidiert nichts
if(!boegen.some(b=>(b.beats||[]).some(bt=>(bt.ops||[]).some(o=>o&&(o.op==='merk'||o.op==='merksatz')))))
  B('MITTEL','Ganzes','kein einziger Merksatz im Film. Was der Leser morgen noch wissen soll, steht nirgends als Regel.');
// P6: mehr als zwei gleichartige Faelle als Einzelboegen ohne Serie, Tabelle oder Merksatz
{ const GER=['plot','graph','hline','vline','region','point','punkt','wert','umformung','zeile','pfeil','flug','kappe','aufstieg','kandidat','bildfolge','zoomfolge','doppelgraph','binden'];
  const KONS=['merk','merksatz','tabelle'];
  const menge=b=>new Set((b.beats||[]).flatMap(bt=>(bt.ops||[])).map(o=>o&&o.op).filter(op=>GER.includes(op)));
  const kons=b=>!!b&&(b.beats||[]).some(bt=>(bt.ops||[]).some(o=>o&&KONS.includes(o.op)));
  let lauf=[];
  const pruefLauf=(ende)=>{ if(lauf.length>=3){ const naechster=boegen[ende]; if(!lauf.some(i=>kons(boegen[i]))&&!kons(naechster))
      B('MITTEL','Bogen '+(lauf[0]+1)+' bis '+(lauf[lauf.length-1]+1),lauf.length+' gleichartige Faelle als Einzelboegen, ohne Serie, Tabelle oder Merksatz. Drei Faelle ohne Muster sind drei Einzelheiten; der Leser nimmt keine Regel mit.'); } lauf=[]; };
  boegen.forEach((b,i)=>{ if(!b||b.uebersicht===true||b.serieFall){ pruefLauf(i); return; }
    const m=menge(b); if(m.size<3){ pruefLauf(i); return; }
    if(lauf.length){ const gemeinsam=[...m].filter(op=>menge(boegen[lauf[lauf.length-1]]).has(op)&&lauf.every(j=>menge(boegen[j]).has(op)));
      if(gemeinsam.length>=3){ lauf.push(i); return; } pruefLauf(i); }
    lauf.push(i); });
  pruefLauf(boegen.length); }
// G6: Inventar mit Seitenmarken, jede Seite der Quelle hat einen Eintrag
if(typeof D.inventar==='string'&&D.inventar.trim().length>=40){
  const marken=new Set((D.inventar.match(/\b(?:Seite|S\.?)\s*(\d{1,3})\b/g)||[]).map(m=>+m.replace(/\D/g,'')));
  if(!marken.size) B('MITTEL','Kopf','Inventar ohne Seitenmarken ("Seite 1:", "S2:"). Ohne sie ist nicht pruefbar, ob eine Seite ganz fehlt.');
  else { const q=String(D.quelle||'').match(/Seiten?\s*(\d{1,3})\s*(?:bis|-|–)\s*(\d{1,3})/);
    if(q){ const a=+q[1], b=+q[2]; const fehlend=[]; for(let n=a;n<=b;n++)if(!marken.has(n))fehlend.push(n);
      if(fehlend.length) B('MITTEL','Kopf','Inventar ohne Eintrag fuer Seite '+fehlend.join(', ')+' (Quelle nennt Seiten '+a+' bis '+b+'). Jede Seite bekommt ihren Absatz, auch wenn sie leer ist ("Seite 3: nur Aufgaben").'); } }
}
boegen.forEach((bo,bi)=>{
  offenesBild=null;     // jede Szene faengt mit leerer Buehne an
  const chips={};       // Kennungen der Chips dieses Bogens
  const wo = 'Bogen '+(bi+1);
  const bs = Array.isArray(bo.beats)?bo.beats:[];
  if(!bs.length){ B('SCHWER',wo,'ohne Beats.'); return; }
  // DD5: Uebersichtsboegen duerfen ohne Frage sein; erfundene Meta-Fragen nicht
  if(bo.uebersicht!==true && !bo.frage) B('MITTEL',wo,'ohne "frage": die lebende Frage fehlt, die den Bogen zieht. Ist es eine Uebersicht des Dokuments, setze "uebersicht": true.');
  if(bo.frage && /\b(Block|Kapitel|Abschnitt|Liste|Seite|Film|Dokument)\b/i.test(String(bo.frage)))
    B('MITTEL',wo,'die "frage" spricht ueber das Dokument ("'+String(bo.frage).slice(0,50)+'"). Im Leser lebt sie nicht. Entweder eine echte Frage oder "uebersicht": true.');
  // DD6: ein Blatt, das nach zwei Wischern abgeloest wird, ist kein Speicher
  if(bs.length<3 && bo.uebersicht!==true && bo.reprise!==true && !bo.serieFall)
    B('LEICHT',wo,'nur '+bs.length+' Beat(s). Das Blatt ist kaum aufgebaut, schon wird es abgeloest.');

  // Puffer: jeder Takt kostet dieselbe Strecke, also zaehlt die Zahl der Beats.
  // Was der Leser vor der Aufloesung noch im Kopf halten muss, ist begrenzt.
  if(bs.length > 6) B('SCHWER',wo,bs.length+' Beats bis zur Aufloesung. Der Ein-Minuten-Puffer reisst. Teilen.');
  else if(bs.length > 5) B('MITTEL',wo,bs.length+' Beats. Grenzwertig fuer den Puffer.');

  // Ein Bogen ist ein Blatt und das Blatt ist ein Bildschirm. Alles, was im Bogen
  // erscheint, steht am Ende gleichzeitig da: das ist der ausgelagerte Speicher.
  const bloecke = bs.reduce((n,b)=>n+beatBloecke(b),0);
  const hoeheB  = bs.reduce((n,b)=>n+beatHoehe(b),0) + Math.max(0,bloecke-1)*ABSTAND;
  if(process.argv.includes('--hoehe')) console.log(wo+': '+Math.round(hoeheB)+' px, '+bloecke+' Bloecke  |  '+bs.map((b,i)=>'B'+(i+1)+' '+Math.round(beatHoehe(b))+'px/'+beatBloecke(b)).join('  '));
  if(hoeheB > BLATT/0.68)
    B('SCHWER',wo,'passt nicht auf ein Blatt: '+Math.round(hoeheB)+' von '+Math.round(BLATT)
      +' Pixeln bei '+bloecke+' Bloecken; der Spieler muesste unter 0,68 verkleinern. Teilen.');
  else if(hoeheB > BLATT)
    B('MITTEL',wo,'fuellt das Blatt ueber den Rand: '+Math.round(hoeheB)+' von '+Math.round(BLATT)
      +' Pixeln, Verkleinerung auf '+(BLATT/hoeheB).toFixed(2)+'. Der Spieler passt es ein.');

  // Genau eine Aufloesung, und sie steht am Ende
  const pay = bs.map((b,i)=>b.payoff===true?i:-1).filter(i=>i>=0);
  if(pay.length===0) B('SCHWER',wo,'ohne "payoff": kein Beat loest die Spannung auf.');
  else if(pay.length>1) B('MITTEL',wo,pay.length+' Beats mit "payoff". Ein Bogen hat eine Aufloesung.');
  // G6: nach der Tilgung nur noch Merksatz, Uebung, Randnotiz. Neuer Inhalt gehoert in einen neuen Bogen.
  if(pay.length===1){ const NACH=['merk','merksatz','jetztihr','note','zeig','clear'];
    bs.slice(pay[0]+1).forEach((b,j)=>{ const fremd=(b.ops||[]).filter(o=>o&&SICHTBAR.includes(o.op)&&!NACH.includes(o.op)&&!(o.op==='zeile'&&o.stumm)).map(o=>o.op);
      if(fremd.length) B('MITTEL',wo+', Beat '+(pay[0]+2+j),'neuer Inhalt nach der Aufloesung ('+[...new Set(fremd)].join(', ')+'). Der Bogen ist getilgt; was danach kommt, ist ein neuer Bogen mit eigener Frage. Erlaubt danach: merk, jetztihr, note.'); }); }

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

  // DD4: der Payoff tilgt die Schuld; eine Uebung allein tilgt nichts
  bs.forEach((b,i)=>{ if(b.payoff!==true)return;
    const sicht=(b.ops||[]).filter(o=>o&&SICHTBAR.includes(o.op)&&!(o.op==='zeile'&&o.stumm)).map(o=>o.op);
    if(sicht.length&&sicht.every(op=>op==='jetztihr'))
      B('MITTEL',wo+', Beat '+(i+1),'"payoff" sitzt auf einer Uebung. Eine Uebung prueft das Aufgeloeste, sie loest nichts auf. Der Payoff ist die Tilgung, die Uebung darf danach stehen.'); });

  // P6: Einsetzen als Wort in der Umformung, aber keine Zahl bewegt sich
  { const eigen=bs.flatMap(b=>(b.ops||[]));
    const bewegt=eigen.some(o=>o&&(o.op==='pfeil'||o.op==='flug'));
    const setzt=eigen.filter(o=>o&&o.op==='umformung').flatMap(o=>(o.zeilen||[]).map(z=>z&&z.warum)).filter(w=>typeof w==='string'&&/einsetz|eingesetzt|setzen wir|setzt man/i.test(w));
    if(setzt.length&&!bewegt) B('MITTEL',wo,'Umformung sagt „'+String(setzt[0]).slice(0,40)+'", aber keine Zahl bewegt sich. Einsetzen ist der Paradefall des Pfeils: die Zahl fliesst von oben in die Klammer (GL2). Umformung zeigt nur das Ergebnis.');
    // G6: eine Farbe auf einer Zahl im Text braucht ein Geraet, das die Beziehung zeigt
    const geraetK=new Set(eigen.filter(o=>o&&['kandidat','pfeil','flug','punkt','point','kappe','aufstieg','wert','beschriftung','fahrt'].includes(o.op)).map(o=>o.k===undefined?(['pfeil','kandidat','kappe','aufstieg','fahrt'].includes(o.op)?0:undefined):+o.k).filter(k=>k!==undefined));
    const chipK=new Set(); const lauf=t=>{ for(const p of (t||[])){ if(Array.isArray(p))lauf(p); else if(p&&typeof p==='object'&&p.k!==undefined)chipK.add(+p.k); } };
    for(const o of eigen) if(o&&o.op==='zeile') lauf(o.teile);
    const gleichFall = bo.serieFall===true;
    for(const k of chipK) if(!geraetK.has(k)&&!geraetKFilm.has(k)&&!gleichFall) B('MITTEL',wo,'Farbe k'+k+' auf Zahlen im Text, aber kein Geraet traegt sie (keine Achsenmarke, kein Pfeil, kein Punkt). Farbe ist ein Zeiger auf eine Beziehung; ohne Beziehung ist sie Dekoration (GL1).');
    for(const k of geraetK) if(k>=2&&!chipK.has(k)) farbenOhneZahl.add(wo+': k'+k);
    for(const k of geraetK) geraetKFilm.add(k);
  }
  // Regel ohne Serie
  const hatMerksatz = bs.some(b=>(b.ops||[]).some(o=>o.op==='merksatz'||o.op==='merk'));
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
  // DD2: die Regel steht auf einem Blatt, das mindestens einen Beleg traegt
  if(hatMerksatz){
    const eigen=bs.flatMap(b=>(b.ops||[]));
    const belege=eigen.filter(o=>['tabelle','math','zeile','umformung','paar','point','punkt','wert','binden','bildfolge','kandidat','aufstieg'].includes(o.op)).length;
    if(belege===0) B('MITTEL',wo,'Merksatz ohne Beleg auf demselben Blatt. Die Faelle stehen auf dem vorigen Blatt, das schon weg ist; der Leser kann nicht zurueckblaettern. Reprise des letzten Falls hierher, oder die Regel zu den Faellen.');
  }
  // Eine Serie im Film (drei und mehr Faelle) traegt die Regel; sonst muss das Blatt selbst die Faelle zeigen
  if(hatMerksatz && !filmHatSerie && tabZeilen<4 && nMath<4 && nBilder<2 && nMarken<3)
    B('SCHWER',wo,'Regel ohne Serie: ein Merksatz, aber weniger als vier Beispiele. Nach einem Beispiel hat der Leser nur eine Ahnung.');

  bs.forEach((b,i)=>{
    nBeats++;
    const wob = wo+', Beat '+(i+1);
    const hatSichtbares=(b.ops||[]).some(o=>o&&(SICHTBAR.includes(o.op)||['point','punkt','kappe','aufstieg','fahrt','flug','pfeil','wert','binden','bildfolge','beschriftung','kandidat','hline','vline','region'].includes(o.op)));
    if((typeof b.sub!=='string'||!b.sub.trim())&&!hatSichtbares) B('SCHWER',wob,'ohne "sub" und ohne sichtbare Operation: ein leerer Beat.');
    // Ein Beat, der nur aus seinem Satz besteht, zeigt nichts. Ein Payoff aus einem Satz tilgt nichts.
    if(!hatSichtbares && typeof b.sub==='string' && b.sub.trim()){
      if(b.payoff===true) B('SCHWER',wob,'"payoff" besteht nur aus einem Satz. Die Tilgung ist ein Ergebnis, eine Stelle im Bild, eine Formel; ein Satz behauptet sie nur.');
      else B('MITTEL',wob,'Beat besteht nur aus seinem Satz. Was soll der Leser sehen? Entweder eine Operation dazu oder den Satz zum vorigen Beat.');
    }
    // GL3: gewicht steuert nichts mehr an der Zeit; einmal je Film gemeldet
    if(b.gewicht!==undefined) nGewicht++;
    gewichte.push(Math.round(+b.gewicht||2));
    if(b.fokus===true)nFokus++;
    const ops = Array.isArray(b.ops)?b.ops:[];
    const nBloecke=ops.filter(o=>o&&SICHTBAR.includes(o.op)&&!(o.op==='zeile'&&o.stumm)).length;
    if(nBloecke>6) B('MITTEL',wob,nBloecke+' Bloecke in einem Beat. Ein Beat ist ein Gedanke.');
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
      // Chips dieses Bogens fuer GL1 und GL2 einsammeln
      if(o.op==='zeile'&&Array.isArray(o.teile)){
        const lauf=(t)=>{ for(const p of t){ if(Array.isArray(p))lauf(p); else if(p&&typeof p==='object'){ if(p.id!==undefined)chips[p.id]=p;
          // GL1: Farbe nur auf einer Zahl. Indizes und Hochzahlen zaehlen nicht als Zahl.
          if(p.k!==undefined&&p.tex!==undefined){
            // Ein benannter Punkt H(x|y) ist ein Objekt des Kandidaten, keine gefaerbte Zeile
            const punkt=/^[A-Z](_\{?\d\}?)?\(/.test(String(p.tex));
            const rein=String(p.tex).replace(/[_^]\{?-?\d+\}?/g,'').replace(/\{,\}/g,',');
            const zahlen=(rein.match(/-?\d+(?:[.,]\d+)?/g)||[]).length;
            if(zahlen>1&&!punkt) B('SCHWER',wob,'Farbe auf "'+String(p.tex).slice(0,30)+'": mehr als eine Zahl. Farbe sitzt nur auf der Zahl, die wandert oder eingesetzt wird (GL1).'); } } } };
        lauf(o.teile); }
      if(o.op==='pfeil'){
        const z=chips[o.zu];
        if(z===undefined) B('SCHWER',wob,'pfeil auf eine Kennung, die es in diesem Bogen nicht gibt ("'+o.zu+'").');
        else if(z.tex===undefined || !/^-?(\d+(?:[.,{}\d]*)?|sqrt\(.*\)|\(\d+\)\/\(\d+\))$/.test(flach(z.tex).replace(/\s+/g,'').replace(/^pm/,'')))
          B('MITTEL',wob,'pfeil endet auf "'+String(z.tex!==undefined?z.tex:z.t).slice(0,20)+'", das ist keine eingesetzte Zahl in einer Klammer (GL2).');
      }
      if(o.op==='flug'&&typeof o.zu==='string'){ const z=chips[o.zu];
        if(z===undefined) B('SCHWER',wob,'flug in eine Kennung, die es in diesem Bogen nicht gibt ("'+o.zu+'").');
        else if(bo.serieFall&&z.leer) B('MITTEL',wob,'flug in die Ergebniszeile innerhalb der Serie. Das Zusammenfliegen gehoert ins erklaerte Beispiel; in der Serie erscheint die Ergebniszeile nur (GL4).'); }
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
      // zeile: jeder TeX-Chip zaehlt, und die ganze Zeile zusammengezogen
      if(o.op==='zeile'&&Array.isArray(o.teile)){ const tx=[]; const lauf=t=>{ for(const p of t){ if(Array.isArray(p))lauf(p); else if(typeof p==='string'&&p!=='!eng')tx.push(p); else if(p&&p.tex!==undefined)tx.push(String(p.tex)); } };
        lauf(o.teile); for(const t of tx)alleTex.push(t); if(tx.length>1)alleTex.push(tx.join('')); }
      if(o.op==='marke'&&o.t) alleTex.push(String(o.t));
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
// gewicht steuert seit GL3 nichts mehr; die Verteilung wird nicht mehr beurteilt.
if(nGewicht) B('LEICHT','Ganzes',nGewicht+' Beats tragen "gewicht". Es wird ignoriert: jeder Beat kostet dieselbe Strecke, die Stuecke kacheln sie (GL3). Kann weg.');
if(farbenOhneZahl.size) B('MITTEL','Ganzes','dritte Farbe auf Bildobjekten ohne Zahl im Text ('+[...farbenOhneZahl].join('; ')+'). Ein Punkt bekommt nur die Farbe eines Kandidaten, dessen Zahl in einer Klammer oder Achsenmarke steht; sonst keine (GL1).');
if(nFokus>Math.max(2,Math.round(nBeats/12))) B('MITTEL','Ganzes',nFokus+' Fokusstellen bei '+nBeats+' Beats. Wenn alles hervorsticht, sticht nichts hervor.');


// Inventar-Abdeckung, wenn eines beiliegt
if(typeof D.inventar==='string' && D.inventar.trim()){
  // Gleiche Gestalt fuer LaTeX und Kurzschrift: \frac{a}{b} wie a/b, \sqrt{a} wie sqrt(a), f(x)= wie f=
  const norm=s=>flach(s).toLowerCase()
    .replace(/\\[a-z]+/g,'').replace(/\b([a-z])\(x\)/g,'$1').replace(/[^a-z0-9]/g,'');
  const heu=norm(alleTex.join(' ')+' '+alleText.join(' '));
  // Kandidaten aus dem geglaetteten Inventar: verschachtelte Klammern sind dann schon aufgeloest
  const kand=(flach(D.inventar).match(/[A-Za-z_(][^\s,;]*\s*[=<>][^\s,;]+|sqrt\([^()\s]*\)/g)||[]);
  let fehlt=0;
  const da=n=>heu.includes(n.slice(0,Math.min(n.length,14)));
  for(let k of kand){ k=String(k).replace(/[.;:,]+$/,''); const n=norm(k); if(n.length<4)continue;
    // Ein Wort vor dem Zeichen ("Argument >0") ist Prosa, keine Formel
    if(/^[A-Za-zÄÖÜäöü]{4,}\s*[=<>]/.test(k))continue;
    if(da(n))continue;
    // Eine Kette a=b⟺c→d darf im Film als einzelne Schritte stehen
    const teile=k.split(/=|⟺|→|\\iff|\\rightarrow|\\Rightarrow|\\to\b/).map(t=>t.trim()).filter(Boolean);
    let ok=false;
    if(teile.length>=2){ ok=true; for(const t of teile){ const st=norm(t); if(st.length>=3&&!da(st)){ ok=false; break; } } }
    if(!ok){ fehlt++; if(fehlt<=6)B('SCHWER','Inventar','fehlt im Film: '+k.trim()); } }
  if(fehlt>6) B('SCHWER','Inventar','und '+(fehlt-6)+' weitere Elemente fehlen.');
}

// ---------- Ausgabe ----------
const ord={SCHWER:0,MITTEL:1,LEICHT:2};
befunde.sort((a,b)=>ord[a.schwere]-ord[b.schwere]);
for(const f of befunde) console.log(f.schwere.padEnd(7)+f.wo.padEnd(22)+f.text);
const z=s=>befunde.filter(f=>f.schwere===s).length;
console.log('');
console.log(boegen.length+' Boegen, '+nBeats+' Beats');
console.log(z('SCHWER')+' schwer, '+z('MITTEL')+' mittel, '+z('LEICHT')+' leicht');
process.exit(z('SCHWER')?1:0);
