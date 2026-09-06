#!/usr/bin/env node
// Simulat v2: der Schueler als Kaefig aus Skript und frischen Koepfen.
// Das Skript haelt Zustand (Whitelist, Zettel, Blaetter), baut je Blatt einen Prompt fuer EINEN
// frischen Agenten, prueft dessen JSON-Antwort mechanisch (Quellenpflicht, Zettelgrenze, Budgets)
// und schreibt den naechsten Prompt. Kein Kopf sieht je ein frueheres Blatt.
//
// Aufrufe:
//   node simulat2.mjs init   <lauf-ordner> <film.json> <WISSEN.json> <TRANSFER.json> [FEHLREGELN.json] [--thema NAME]
//   node simulat2.mjs antwort <lauf-ordner> <n|regel> <antwort.json>
//   node simulat2.mjs bericht <lauf-ordner>
//   node simulat2.mjs nullfilm <film.json> <aus.json>
// Ablauf: init schreibt prompt-01.md. Die orchestrierende Sitzung gibt den Prompt einem frischen
// Agenten, speichert dessen JSON, ruft antwort auf; das schreibt prompt-02.md usw.; nach dem
// letzten Blatt prompt-regel.md; nach dessen Antwort bericht.
import fs from 'fs'; import path from 'path'; import {execFileSync} from 'child_process';

const [,, befehl, ...arg]=process.argv;
const hier=path.dirname(new URL(import.meta.url).pathname);
const lies=p=>fs.readFileSync(p,'utf8');
const json=p=>JSON.parse(lies(p));
const schreib=(p,s)=>fs.writeFileSync(p,s);

// ---------- Normalisierung fuer Zitate und Loesungen ----------
const norm=s=>String(s==null?'':s).toLowerCase()
  .replace(/[−–—]/g,'-').replace(/\s+/g,' ').replace(/[„“”"'`«»]/g,'').replace(/\\\(|\\\)/g,'')
  .replace(/\\(cdot|neq|ne|le|ge|leq|geq|iff|rightarrow|to|infty|pm|in|mathbb|left|right|quad|qquad|frac|sqrt)/g,' $1 ')
  .replace(/[{}\\]/g,'').replace(/\s+/g,' ').trim();
const hart=s=>norm(s).replace(/[^a-z0-9äöüß|<>=+\-*/^().,:]/g,'');
function zitatDrin(zitat,text){ const z=hart(zitat), t=hart(text); if(z.length<6)return false; if(t.includes(z))return true;
  // Toleranz: 80 Prozent der Woerter des Zitats in Folge? Einfach: alle Woerter ab 3 Zeichen kommen vor
  const w=norm(zitat).split(' ').filter(x=>x.length>=3); if(w.length<2)return false;
  const tn=norm(text); return w.filter(x=>tn.includes(x)).length>=Math.ceil(0.8*w.length); }

// ---------- Transkript je Blatt ----------
function blaetterAus(film){
  const out=execFileSync('node',[path.join(hier,'..','transkript.mjs'),film],{encoding:'utf8',maxBuffer:64*1024*1024});
  const teile=out.split(/\n(?=## Blatt \d+)/); const kopf=teile.shift();
  const bl=[]; for(const t of teile){ const m=t.match(/^## Blatt (\d+)([^\n]*)/); if(!m)continue;
    const koerper=t.replace(/\n## Schluss[\s\S]*$/,''); bl.push({nr:+m[1],titel:m[2].trim(),text:koerper.trim()}); }
  const schluss=(out.match(/## Schluss\n([\s\S]*)$/)||['',''])[1].trim();
  return {kopf,blaetter:bl,schluss};
}

// ---------- Prompts ----------
function whitelistText(W){ return W.map(w=>`- ${w.id}: ${w.text}`).join('\n'); }
const SCHEMA_BLATT=`{
  "schritte": [ {"text": "ein Gedanke, den du beim Lesen vollziehst", "quelle": "B:<woertliches Zitat aus dem Blatt>" } ],
  "stockstellen": [ {"art": "stocken|raten|ruecksprung|glauben|skip|rechenfehler|lastmarke|verwechslung|vorstellung", "zitat": "Stelle im Blatt", "warum": "ein Satz"} ],
  "bewegungen": [ {"zitat": "die Bewegung in eckigen Klammern", "urteil": "trug|dekoration", "warum": "ein Halbsatz: was zeigte sie dir, das du sonst haettest denken muessen"} ],
  "deutungen": [ {"symbol": "neues Zeichen oder Wort", "was": "was es IST", "wo": "wo im Bild", "quelle": "B:<Zitat>|Z:<Nr>|W:<Kennung>|kann ich nicht deuten"} ],
  "zettel": [ "hoechstens vier Zeilen, je hoechstens 90 Zeichen: dein Kopfzustand nach diesem Blatt" ]
}`;
function promptBlatt(Z,n){
  const b=Z.blaetter[n-1]; const zettel=Z.zettel.length?Z.zettel.map((z,i)=>`Z:${i+1}  ${z}`).join('\n'):'(leer: dies ist das erste Blatt)';
  return `Du simulierst einen echten Schueler, der einen Lehrfilm am Handy ansieht, Blatt fuer Blatt. Du bist Studienkollegiat, Deutsch B2. Du kennst weder Entstehung noch Absicht des Films.

DEIN WISSEN, vollstaendig (Whitelist; alles andere besitzt du nicht, auch wenn du es als Modell wuesstest):
${whitelistText(Z.wissen)}
Das Thema „${Z.thema}" kennst du NICHT.

DEIN ZETTEL (alles, was du von frueheren Blaettern noch hast; die Blaetter selbst sind weg):
${zettel}

Vor dir steht jetzt Blatt ${n} von ${Z.blaetter.length}. Was in eckigen Klammern steht, siehst du als Bild oder Bewegung.

${b.text}

Regeln, mechanisch:
1. Jeder Gedankenschritt nennt seine Quelle: B:<woertliches Zitat aus diesem Blatt>, Z:<Nummer einer Zettelzeile>, W:<Kennung aus der Whitelist>. Ein Schritt ohne solche Quelle bekommt "quelle": "keine" und gilt als Glauben.
2. Du kannst dir nichts vorstellen, was das Blatt nicht zeigt. Fehlt eine Skizze, Zwischenform oder Umformung, ist das eine Stockstelle (vorstellung).
3. Du rechnest nur nach, was in ein, zwei einfachen Schritten geht. Laengeres glaubst du (glauben). Rechnest du nach und bekommst etwas anderes heraus: rechenfehler, mit deiner Rechnung.
4. Prosa kostet dich viel, Formeln, Bilder und Bewegungen wenig. Wird eine Stelle zaeh, ueberspringst du sie (skip).
5. Saetze mit mehr als einem Nebensatz und unerklaerte Fachwoerter: lastmarke.
6. Jede Bewegung in eckigen Klammern bewertest du in einem Halbsatz: zeigte sie dir etwas, das du sonst haettest denken muessen (trug), oder nicht (dekoration).
7. Jedes neue Zeichen oder Fachwort bekommt eine Deutung: was es IST und wo man es im Bild sieht, mit Quelle; kannst du es nicht sagen, schreibe "kann ich nicht deuten".
8. Am Ende schreibst du deinen Zettel neu: hoechstens vier Zeilen zu je hoechstens 90 Zeichen. Nur das steht dir beim naechsten Blatt zur Verfuegung. Was du nicht aufschreibst, ist weg.

Antworte NUR mit einem JSON-Objekt dieser Form, ohne Text davor oder danach:
${SCHEMA_BLATT}`;
}
function promptRegel(Z){
  const b=Z.blaetter[Z.blaetter.length-1];
  const zettel=Z.zettel.length?Z.zettel.map((z,i)=>`Z:${i+1}  ${z}`).join('\n'):'(leer)';
  const fehl=Z.fehlregeln.length?Z.fehlregeln.map(f=>`- ${f.id}: ${f.text}`).join('\n'):'(keine)';
  const tr=Z.transfer.map(t=>`- ${t.id}: ${t.aufgabe}`).join('\n');
  return `Du bist derselbe Schueler wie zuvor (Studienkollegiat, Deutsch B2). Der Film ist zu Ende; das letzte Blatt steht noch vor dir, alle anderen sind weg.

DEIN WISSEN, vollstaendig (Whitelist):
${whitelistText(Z.wissen)}

DEIN ZETTEL:
${zettel}

LETZTES BLATT (noch sichtbar):
${b.text}

Aufgaben, nacheinander:
A. REGELFASSUNG: Formuliere in je einem Satz die Regel(n), wie DU sie aus dem Film abstrahiert hast, in eigenen Worten, nicht wie der Film sie nennt.
B. FEHLREGELN: Hier sind Regeln, die manche Schueler faelschlich bilden. Pruefe fuer jede, ob sie zu ALLEN Beispielen passt, die du im Film gesehen hast (nur Zettel und letztes Blatt zaehlen). Passt sie zu allem, was du noch hast, schreibe passt_zu_allen_beispielen: true. Kannst du sie widerlegen, nenne das Gegenbeispiel als woertliches Zitat aus dem letzten Blatt oder aus deinem Zettel.
${fehl}
C. TRANSFER: Loese nur mit deiner Regel aus A und deinem Wissen, zeige die Rechnung kurz. Aufgaben:
${tr}
D. DEUTUNG: Fuer jedes Zeichen, das der Film neu eingefuehrt hat und das auf deinem Zettel oder dem letzten Blatt vorkommt: was es IST, wo man es im Bild sieht, mit Quelle B:/Z:/W: oder "kann ich nicht deuten".
E. SCHLUSS: ein Satz, was du jetzt kannst; ein Satz, was du morgen noch wuesstest (nur, was auf deinem Zettel steht).

Antworte NUR mit einem JSON-Objekt dieser Form:
{
  "regeln": [ {"regel": "..."} ],
  "fehlregeln": [ {"id": "F1", "passt_zu_allen_beispielen": true, "gegenbeispiel_zitat": ""} ],
  "transfer": [ {"id": "T1", "loesung": "Endergebnis in der Schreibweise des Films", "rechnung": "kurz", "quelle": "Z:<Nr>|W:<Kennung>|regel"} ],
  "deutungen": [ {"symbol": "...", "was": "...", "wo": "...", "quelle": "..."} ],
  "schluss": {"kann": "...", "morgen": "..."}
}`;
}

// ---------- Befehle ----------
function init(){
  const [ordner,film,wissenP,transferP,fehlP]=arg.filter(a=>!a.startsWith('--'));
  const themaI=arg.indexOf('--thema');
  fs.mkdirSync(ordner,{recursive:true});
  const T=blaetterAus(film); const F=json(film);
  const Z={film:path.resolve(film),titel:F.titel||'',thema:themaI>=0?arg[themaI+1]:(F.titel||''),
    wissen:json(wissenP),transfer:json(transferP),fehlregeln:fehlP?json(fehlP):[],
    blaetter:T.blaetter,schluss:T.schluss,zettel:[],zettelJeBlatt:[],antworten:[],flags:[],naechstes:1,fertig:false};
  // Transferaufgaben duerfen nicht im Film vorkommen (sonst misst die Probe Wiedererkennen)
  const ganz=T.blaetter.map(b=>b.text).join('\n');
  for(const t of Z.transfer){ for(const s of (t.verboten||[])) if(hart(ganz).includes(hart(s))) Z.flags.push('Transfer '+t.id+': „'+s+'" kommt im Film vor; die Probe misst dort Wiedererkennen.'); }
  schreib(path.join(ordner,'zustand.json'),JSON.stringify(Z,null,1));
  T.blaetter.forEach(b=>schreib(path.join(ordner,'blatt-'+String(b.nr).padStart(2,'0')+'.md'),b.text));
  schreib(path.join(ordner,'prompt-01.md'),promptBlatt(Z,1));
  console.log('init: '+T.blaetter.length+' Blaetter, '+Z.wissen.length+' Wissenszeilen, '+Z.transfer.length+' Transferaufgaben, '+Z.fehlregeln.length+' Fehlregeln. Naechster Prompt: prompt-01.md'+(Z.flags.length?'\nFLAGS: '+Z.flags.join(' | '):''));
}

function leseAntwort(p){ let s=lies(p).trim(); s=s.replace(/^```(json)?/,'').replace(/```$/,'').trim();
  const a=s.indexOf('{'), e=s.lastIndexOf('}'); if(a>0||e<s.length-1) s=s.slice(a,e+1); return JSON.parse(s); }

// Quelle pruefen: "B:<Zitat>", "Z:3", "W:W4", auch "W4", "Z3", mehrere durch ; getrennt; gedeckt, wenn eine traegt
function quelleOk(q,Z,blattText,alterZettel){
  const teile=String(q||'').split(/;|\|\|/).map(t=>t.trim()).filter(Boolean); if(!teile.length)return {ok:false,art:'keine'};
  let art='keine';
  for(let t of teile){
    if(/^B\s*:/i.test(t)){ art='B'; if(zitatDrin(t.replace(/^B\s*:/i,''),blattText))return {ok:true,art:'B'}; continue; }
    if(/^Z\s*:?\s*\d+/i.test(t)){ art='Z'; const i=parseInt(t.replace(/^Z\s*:?\s*/i,''),10); if(i>=1&&i<=alterZettel.length)return {ok:true,art:'Z'}; continue; }
    if(/^W\s*:?\s*W?\d+/i.test(t)){ art='W'; const id='W'+t.replace(/^W\s*:?\s*W?/i,'').match(/^\d+/)[0]; if(Z.wissen.some(w=>w.id===id))return {ok:true,art:'W'}; continue; }
    // nacktes Zitat ohne Praefix: zaehlt, wenn es im Blatt steht
    if(t.length>=12&&zitatDrin(t,blattText))return {ok:true,art:'B'};
  }
  return {ok:false,art};
}
function antwort(){
  const [ordner,welche,antP]=arg; const zp=path.join(ordner,'zustand.json'); const Z=json(zp);
  const A=leseAntwort(antP);
  if(welche==='regel'){ Z.regel=pruefeRegel(Z,A); Z.fertig=true; schreib(zp,JSON.stringify(Z,null,1)); console.log('Regelprobe angenommen. Jetzt: bericht'); return; }
  const n=+welche; if(n!==Z.naechstes){ console.error('erwartet Blatt '+Z.naechstes+', bekommen '+n); process.exit(2); }
  const b=Z.blaetter[n-1]; const alterZettel=Z.zettel.slice();
  const r={blatt:n,schritte:[],stockstellen:[],bewegungen:[],deutungen:[],flags:[],ungedeckt:0};
  // Schritte: Quellenpflicht mechanisch
  for(const s of (Array.isArray(A.schritte)?A.schritte:[])){
    const q=String(s.quelle||'keine').trim(); const {ok,art}=quelleOk(q,Z,b.text,alterZettel);
    r.schritte.push({text:String(s.text||''),quelle:q,art,gedeckt:ok});
    if(!ok){ r.ungedeckt++; r.stockstellen.push({art:'glauben',zitat:String(s.text||'').slice(0,120),warum:'Schritt ohne belegte Quelle ('+q.slice(0,40)+')',mechanisch:true}); }
  }
  for(const s of (Array.isArray(A.stockstellen)?A.stockstellen:[])) r.stockstellen.push({art:String(s.art||'stocken'),zitat:String(s.zitat||'').slice(0,160),warum:String(s.warum||'').slice(0,200)});
  for(const s of (Array.isArray(A.bewegungen)?A.bewegungen:[])) r.bewegungen.push({zitat:String(s.zitat||'').slice(0,160),urteil:/dekor/i.test(String(s.urteil))?'dekoration':'trug',warum:String(s.warum||'').slice(0,200)});
  for(const d of (Array.isArray(A.deutungen)?A.deutungen:[])){ const q=String(d.quelle||''); let ok=/kann ich nicht/i.test(q+' '+String(d.was||''))?null:false;
    if(ok===false) ok=quelleOk(q,Z,b.text,alterZettel).ok;
    r.deutungen.push({symbol:String(d.symbol||''),was:String(d.was||'').slice(0,200),wo:String(d.wo||'').slice(0,200),quelle:q.slice(0,120),gedeckt:ok}); }
  // Zettel: hoechstens vier Zeilen, je hoechstens 90 Zeichen; das ist der ganze Speicher
  const zettel=(Array.isArray(A.zettel)?A.zettel:[]).map(z=>String(z).replace(/\s+/g,' ').trim()).filter(Boolean);
  if(zettel.length>4) r.flags.push('Zettel: '+zettel.length+' Zeilen, auf vier gekuerzt');
  Z.zettel=zettel.slice(0,4).map(z=>{ if(z.length>90){ r.flags.push('Zettelzeile auf 90 Zeichen gekuerzt'); return z.slice(0,90); } return z; });
  Z.zettelJeBlatt.push(Z.zettel.slice());
  // Budgets nur als Flags (P16): Satzlaenge, Prosamenge, Rechenlast
  const prosa=b.text.split('\n').filter(l=>l&&!l.startsWith('#')&&!l.startsWith('[')&&!l.startsWith('**')&&!l.startsWith('|')&&!/^Ueberschrift:/.test(l)&&!/[=<>≠≤≥]/.test(l));
  const woerter=prosa.join(' ').split(/\s+/).filter(Boolean).length; if(woerter>80) r.flags.push('Prosalast: '+woerter+' Woerter Prosa auf dem Blatt');
  for(const s of prosa.join(' ').split(/(?<=[.!?])\s+/)){ const w=s.split(/\s+/).length; if(w>18) r.flags.push('Satzlaenge '+w+': „'+s.slice(0,60)+'"'); }
  if(r.schritte.length>8) r.flags.push('Rechenlast: '+r.schritte.length+' Schritte auf einem Blatt');
  Z.antworten.push(r); Z.naechstes=n+1;
  const naechster=n<Z.blaetter.length?'prompt-'+String(n+1).padStart(2,'0')+'.md':'prompt-regel.md';
  schreib(path.join(ordner,naechster),n<Z.blaetter.length?promptBlatt(Z,n+1):promptRegel(Z));
  schreib(zp,JSON.stringify(Z,null,1));
  console.log('Blatt '+n+': '+r.schritte.length+' Schritte ('+r.ungedeckt+' ungedeckt), '+r.stockstellen.length+' Stockstellen, Zettel '+Z.zettel.length+' Zeilen'+(r.flags.length?', Flags: '+r.flags.join('; '):'')+'. Naechster Prompt: '+naechster);
}

function pruefeRegel(Z,A){
  const alleBl=Z.blaetter.map(b=>b.text).join('\n'); const letztes=Z.blaetter[Z.blaetter.length-1].text; const zettel=Z.zettel.join('\n');
  const R={regeln:(A.regeln||[]).map(r=>String(r.regel||r)),fehlregeln:[],transfer:[],deutungen:[],schluss:A.schluss||{}};
  for(const f of Z.fehlregeln){ const a=(A.fehlregeln||[]).find(x=>x&&x.id===f.id);
    if(!a){ R.fehlregeln.push({id:f.id,text:f.text,ergebnis:'nicht beantwortet',ungebrochen:true}); continue; }
    if(a.passt_zu_allen_beispielen===true){ R.fehlregeln.push({id:f.id,text:f.text,ergebnis:'passt zu allen gesehenen Beispielen',ungebrochen:true}); continue; }
    const z=String(a.gegenbeispiel_zitat||''); const belegt=zitatDrin(z,letztes)||zitatDrin(z,zettel); const imFilm=zitatDrin(z,alleBl);
    R.fehlregeln.push({id:f.id,text:f.text,ergebnis:belegt?'widerlegt, Gegenbeispiel belegt':(imFilm?'Gegenbeispiel stand im Film, aber nicht mehr auf Zettel oder Blatt (verfallen)':'Gegenbeispiel nicht belegt'),zitat:z.slice(0,120),ungebrochen:!belegt}); }
  for(const t of Z.transfer){ const a=(A.transfer||[]).find(x=>x&&x.id===t.id); const l=a?String(a.loesung||'')+' '+String(a.rechnung||''):'';
    const erw=Array.isArray(t.loesung)?t.loesung:[t.loesung]; const hl=hart(l); const treffer=erw.map(e=>hl.includes(hart(e)));
    R.transfer.push({id:t.id,aufgabe:t.aufgabe,erwartet:erw,loesung:a?String(a.loesung||'').slice(0,160):'(keine Antwort)',quelle:a?String(a.quelle||''):'',richtig:treffer.every(Boolean),teilweise:treffer.some(Boolean)}); }
  for(const d of (A.deutungen||[])) R.deutungen.push({symbol:String(d.symbol||''),was:String(d.was||'').slice(0,160),quelle:String(d.quelle||'').slice(0,80),kannNicht:/kann ich nicht/i.test(String(d.quelle||'')+String(d.was||''))});
  // Fremdvokabular: Fachwoerter in Regel und Rechnung, die weder Film, Whitelist noch Zettel enthalten. Spur von Parameterwissen.
  const erlaubt=norm(alleBl+' '+zettel+' '+Z.wissen.map(w=>w.text).join(' ')+' '+Z.transfer.map(t=>t.aufgabe).join(' ')+' '+Z.fehlregeln.map(f=>f.text).join(' '));
  const gesagt=norm(R.regeln.join(' ')+' '+(A.transfer||[]).map(t=>String(t.rechnung||'')+' '+String(t.loesung||'')).join(' '));
  const ALLTAG=/^(eine[mnrs]?|kein[e]?|dann|wenn|also|oder|aber|dort|dabei|damit|dass|diese[mnrs]?|dieser|jede[mnrs]?|genau|immer|noch|schon|sonst|zuerst|danach|zuletzt|indem|weil|zwischen|welche[mnrs]?|nur|nicht|etwas|nichts|sind|wird|werden|kommt|kann|muss|soll|habe|gibt|steht|liegt|liegen|setze|setzt|einsetze|einsetzen|ausrechne|ausrechnen|bekomme|bekommt|finde|finden|rechne|schreibe|pruefe|pruefen|heraus|herauskommt|zahl|zahlen|stelle|stellen|wert|werte|punkt|punkte|kommen|funktion|ableitung|ableitungen|beispiel|beispiele|erste|zweite|dritte|ursprueng\w*|negativ\w*|positiv\w*|groesser|kleiner|gleich|null|ergebnis|loesung\w*|rechnung|formel\w*|graph\w*|film)$/;
  const fremd=new Set(); for(const w of gesagt.split(/[^a-zäöüß]+/)){ if(w.length<6||ALLTAG.test(w))continue; if(!erlaubt.includes(w)) fremd.add(w); }
  R.fremdvokabular=[...fremd];
  return R;
}

function bericht(){
  const [ordner]=arg; const Z=json(path.join(ordner,'zustand.json'));
  if(!Z.fertig){ console.error('Regelprobe fehlt noch.'); process.exit(2); }
  const R=Z.regel; const st=Z.antworten.flatMap(a=>a.stockstellen.map(s=>Object.assign({blatt:a.blatt},s)));
  const zaehl=art=>st.filter(s=>s.art===art).length;
  const ungedeckt=Z.antworten.reduce((n,a)=>n+a.ungedeckt,0), schritte=Z.antworten.reduce((n,a)=>n+a.schritte.length,0);
  // Morgen: Zettelzeilen, die auf mindestens zwei Blaettern standen (aehnlich: 60 Prozent gemeinsame Woerter)
  const toks=z=>new Set(norm(z).split(' ').filter(w=>w.length>=3));
  const morgen=[]; const alle=Z.zettelJeBlatt.map((zs,i)=>zs.map(z=>({i,z,t:toks(z)}))).flat();
  for(const a of alle){ if(morgen.some(m=>m.t&&[...m.t].filter(x=>a.t.has(x)).length>=0.6*Math.max(1,m.t.size)))continue;
    const n=new Set(alle.filter(b=>b.i!==a.i&&[...a.t].filter(x=>b.t.has(x)).length>=0.6*Math.max(1,a.t.size)).map(b=>b.i)).size;
    if(n>=1) morgen.push({z:a.z,blaetter:n+1,t:a.t}); }
  const deutNicht=Z.antworten.flatMap(a=>a.deutungen.filter(d=>d.gedeckt===null).map(d=>'Blatt '+a.blatt+': '+d.symbol)).concat(R.deutungen.filter(d=>d.kannNicht).map(d=>'Schluss: '+d.symbol));
  const deko=Z.antworten.flatMap(a=>a.bewegungen.filter(b=>b.urteil==='dekoration').map(b=>'Blatt '+a.blatt+': '+b.zitat.slice(0,80)));
  const trug=Z.antworten.flatMap(a=>a.bewegungen.filter(b=>b.urteil==='trug').map(b=>'Blatt '+a.blatt+': '+b.zitat.slice(0,80)));
  const erste={transfer_falsch:R.transfer.filter(t=>!t.richtig).map(t=>t.id+' ('+t.loesung+' statt '+t.erwartet.join(', ')+')'),
    fehlregeln_ungebrochen:R.fehlregeln.filter(f=>f.ungebrochen).map(f=>f.id+': '+f.text+' ['+f.ergebnis+']'),
    deutung_unmoeglich:deutNicht};
  const aus={film:Z.titel,thema:Z.thema,blaetter:Z.blaetter.length,transfer:R.transfer,transfer_bestanden:R.transfer.length>0&&R.transfer.every(t=>t.richtig),
    regeln:R.regeln,fehlregeln:R.fehlregeln,erste_klasse:erste,fremdvokabular:R.fremdvokabular||[],
    zweite_klasse:{stockstellen:st.length,glauben:zaehl('glauben'),ungedeckte_schritte:ungedeckt+' von '+schritte,skips:zaehl('skip'),ruecksprung:zaehl('ruecksprung'),vorstellung:zaehl('vorstellung'),rechenfehler:zaehl('rechenfehler'),lastmarken:zaehl('lastmarke'),verwechslung:zaehl('verwechslung')},
    bewegungen:{trug:trug,dekoration:deko},flags:Z.flags.concat(Z.antworten.flatMap(a=>a.flags.map(f=>'Blatt '+a.blatt+': '+f))),
    zettel_je_blatt:Z.zettelJeBlatt,morgen:morgen.map(m=>m.z),schluss:R.schluss,stockstellen:st};
  schreib(path.join(ordner,'BERICHT.json'),JSON.stringify(aus,null,1));
  const L=[]; const P=s=>L.push(s);
  P('# Simulat v2: '+Z.titel+' ('+Z.blaetter.length+' Blaetter)'); P('');
  P('**Transferprobe: '+(aus.transfer_bestanden?'BESTANDEN':'NICHT BESTANDEN')+'** ('+R.transfer.filter(t=>t.richtig).length+' von '+R.transfer.length+')');
  for(const t of R.transfer) P('- '+t.id+' '+t.aufgabe+' → '+t.loesung+' ['+(t.richtig?'richtig':(t.teilweise?'teilweise':'falsch'))+', Quelle '+t.quelle+']');
  P(''); P('**Regelfassung des Schuelers:**'); for(const r of R.regeln) P('- '+r);
  P(''); P('**Fehlregeln:**'); for(const f of R.fehlregeln) P('- '+f.id+' '+f.text+': '+f.ergebnis+(f.zitat?' („'+f.zitat.slice(0,60)+'")':''));
  P(''); P('**Erste Klasse:** Transfer falsch '+erste.transfer_falsch.length+', Fehlregeln ungebrochen '+erste.fehlregeln_ungebrochen.length+', nicht deutbar '+deutNicht.length+(deutNicht.length?' ('+deutNicht.join('; ')+')':''));
  P('**Zweite Klasse:** '+Object.entries(aus.zweite_klasse).map(([k,v])=>k+' '+v).join(', '));
  P('**Fremdvokabular in Regel und Rechnung (weder Film noch Whitelist noch Zettel):** '+((R.fremdvokabular||[]).length?R.fremdvokabular.join(', '):'keines'));
  P(''); P('**Bewegungen:** trug '+trug.length+', Dekoration '+deko.length+(deko.length?': '+deko.join(' | '):''));
  P(''); P('**Zettel je Blatt:**'); Z.zettelJeBlatt.forEach((z,i)=>P('- Blatt '+(i+1)+': '+z.join(' // ')));
  P(''); P('**Morgen noch da (auf mindestens zwei Zetteln):** '+(morgen.length?morgen.map(m=>m.z).join(' // '):'nichts'));
  P(''); P('**Schluss des Schuelers:** kann: '+(R.schluss.kann||'')+' | morgen: '+(R.schluss.morgen||''));
  if(aus.flags.length){ P(''); P('**Flags:** '+aus.flags.join(' | ')); }
  P(''); P('## Stockstellen'); for(const s of st) P('- Blatt '+s.blatt+' '+s.art+(s.mechanisch?' (mechanisch)':'')+': „'+s.zitat+'" '+s.warum);
  schreib(path.join(ordner,'BERICHT.md'),L.join('\n')+'\n');
  console.log(L.slice(0,12).join('\n'));
}

// Nullfilm: Erklaerungen, Serien, Merksaetze weg; Rahmen (Ueberschriften, Fragen, Graphen, Formeln des erklaerten Beispiels) bleibt
function nullfilm(){
  const [film,aus]=arg; const F=json(film);
  const WEG=new Set(['satz','text','note','item','merk','merksatz','tabelle','marke']);
  // Text-Chips ("→ Hochpunkt") aus Zeilen entfernen: es bleiben die reinen Formelteile
  const ohneText=t=>{ const aus=[]; for(const p of (t||[])){ if(Array.isArray(p)){ const u=ohneText(p); if(u.length)aus.push(u); } else if(typeof p==='string')aus.push(p); else if(p&&p.tex!==undefined)aus.push(p); } return aus; };
  const boegen=[]; for(const bo of (F.boegen||[])){ if(bo.serie)continue;
    const b=Object.assign({},bo); b.beats=(bo.beats||[]).map(bt=>{ const n=Object.assign({},bt); delete n.sub;
      n.ops=(bt.ops||[]).filter(o=>o&&!WEG.has(o.op)).map(o=>{ if(o.op==='jetztihr'){ const j=Object.assign({},o); delete j.loesung; delete j.loesungTex; delete j.loesungText; return j; }
        if(o.op==='zeile'&&Array.isArray(o.teile)){ const z=Object.assign({},o,{teile:ohneText(o.teile)}); return z.teile.length?z:null; }
        if(o.op==='kappe'||o.op==='beschriftung'){ const k=Object.assign({},o); if(o.op==='kappe')delete k.text; return k; } return o; }).filter(Boolean);
      return n; }).filter(bt=>(bt.ops||[]).length);
    // Ein Bogen ohne Bild ist ein Merkblatt (Schema) und faellt
    const hatBild=b.beats.some(bt=>(bt.ops||[]).some(o=>['graph','plot','doppelgraph','zoomfolge'].includes(o.op)));
    if(b.beats.length&&hatBild)boegen.push(b); }
  const N=Object.assign({},F,{titel:(F.titel||'')+' (Nullfilm)',boegen}); delete N.schluss;
  schreib(aus,JSON.stringify(N,null,1)); console.log('Nullfilm: '+boegen.length+' Boegen (von '+(F.boegen||[]).length+'), ohne sub, Saetze, Notizen, Marken, Merksaetze, Tabellen, Serien, Loesungen, Text-Chips und bildlose Boegen.');
}

const BEFEHLE={init,antwort,bericht,nullfilm};
if(!BEFEHLE[befehl]){ console.error('Befehle: init | antwort | bericht | nullfilm'); process.exit(2); }
BEFEHLE[befehl]();
