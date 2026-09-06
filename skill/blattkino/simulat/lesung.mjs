#!/usr/bin/env node
// Schnelle Lesung: ein Kopf, ein Aufruf, ein Formular. Zwei Lesarten, parallel startbar.
//   beziehung  : Beziehung und Choreographie (Katalog des Goldlaufs, GL1 bis GL4, AL19)
//   lehren     : Lehren-Treue (AL1 bis AL18, DD2 bis DD6, Sprache)
// Der Kopf sieht das ganze Transkript und schreibt hoechstens zehn Befundzeilen mit Belegstelle.
// Das ist kein Schueler (kein Gedaechtniskaefig), sondern ein Lektor; billig und in Minuten fertig.
//   node lesung.mjs prompts <lauf-ordner> <film.json>          schreibt lesung-beziehung.md, lesung-lehren.md
//   node lesung.mjs sammeln <lauf-ordner>                      liest lesung-*.antwort.json, schreibt BEFUNDE.md
import fs from 'fs'; import path from 'path'; import {execFileSync} from 'child_process';
const [,, befehl, ordner, film]=process.argv;
const hier=path.dirname(new URL(import.meta.url).pathname);

const FORM=`Antworte NUR mit einem JSON-Objekt:
{
  "befunde": [ {"wo": "Blatt n, Wisch m", "regel": "Kurzname der verletzten Regel oder Katalogzeile", "zitat": "woertlich aus dem Transkript, hoechstens 12 Woerter", "befund": "ein Satz: was fehlt oder falsch ist", "schwere": "schwer|mittel"} ],
  "trug": [ "ein Halbsatz je Stelle, die trug (hoechstens fuenf)" ],
  "urteil": "ein Satz"
}
Hoechstens zehn Befunde, nach Schwere geordnet. Kein Lob, keine Vorschlaege, keine Nacherzaehlung. Ein Befund ohne Zitat zaehlt nicht.`;

const KOPF_BEZIEHUNG=`Du liest das Transkript eines Lehrfilms (Blatt fuer Blatt, was der Leser am Handy sieht; Bewegungen in eckigen Klammern). Du pruefst genau eines: ob jede Beziehung, die der Stoff enthaelt, im Film als Bewegung gezeigt wird, und ob jede Bewegung eine Beziehung zeigt.

Der Katalog der Beziehungen und ihrer Traeger:
- eine Zahl wird in eine Klammer eingesetzt: Pfeil von der Quelle, von oben in die Klammer, auf die eingesetzte Zahl (nie an den Zeilenanfang). Jedes "eingesetzt" ohne Pfeil ist ein Befund.
- dieselbe Zahl wird mehrfach eingesetzt: ein Stamm, mehrere Aeste.
- eine Zahl bekommt einen Ort im Bild oder ein Ort wird eine Zahl: Flug zur Achsenmarke oder in eine Zeile.
- eine Stelle ist noch kein Punkt: Kandidat an der Achse, Aufstieg zur Hoehe, dann der Punkt.
- wie das Bild an der Stelle aussieht: Kappe auf dem Kurvenstueck, mit dem Wortlaut des Dokuments.
- ein Konzept ist ein Lauf: Fahrt (die Tangente faehrt, m laeuft mit).
- eine Zahl ist im Bild eine Stelle: Wert (Formelzeile und Hilfslinie zugleich).
- dasselbe Verfahren an neuen Zahlen: Serie mit identischer Choreographie; die teure Bewegung nur im erklaerten Beispiel, in der Serie erscheint die Ergebniszeile nur.
Regeln dazu: Farbe sitzt nur auf der Zahl, die wandert, eine Farbe je Kandidat, nie auf Zeilen oder Text. Bewegung nur dort, wo der Leser sich etwas nicht selbst denken kann; ein Trivialschritt (4 minus 4 gleich 0) als eigene Zeile ist Dekoration, ein Graph, den er sich nicht vorstellen kann, traegt. Antwort nie vor der Not: das Ergebnis kommt, nachdem das Problem sichtbar war. Jeder Beat zeigt etwas; ein Wisch, bei dem nur ein Satz erscheint, ist leer.

Lesehinweise: Saetze in eckigen Klammern sind Beschreibungen des Transkripts, kein Text des Films; Sprach- und Satzregeln gelten nur fuer Text ausserhalb der Klammern. „hervorgehoben, Kasten" ist ein Kasten um eine Ergebniszeile, keine Kandidatenfarbe. Die gestrichelte Aufstiegslinie und der Punkt tragen die Farbe ihres Kandidaten; das ist richtig. Der Schlusssatz nach dem letzten Blatt ist Abspann, kein Blatt.`;

const KOPF_LEHREN=`Du liest das Transkript eines Lehrfilms (Blatt fuer Blatt, was der Leser am Handy sieht; Bewegungen in eckigen Klammern). Der Leser ist Studienkollegiat, Deutsch B2, Arbeitsgedaechtnis drei bis vier Dinge fuer eine Minute; er kann sich nichts vorstellen, was das Blatt nicht zeigt, und lernt Muster ueber Serien, nicht ueber Erklaerungen. Du pruefst den Film gegen diese Lehren:
- Jede Kernaussage hat einen sichtbaren Traeger (Formel, Bild, Tabelle); Prosa ist Bindegewebe, ein Gedanke je Satz. Ein Payoff, der nur ein Satz ist, tilgt nichts.
- Nach dem erklaerten Beispiel kommt die Serie mit konstantem Muster und konstanter Notation; eine Tabelle "Aufgabe, Ergebnis" ohne Schritt-Spalte zeigt kein Muster. Ein Film ohne Merksatz konsolidiert nichts; ein Merksatz steht auf einem Blatt mit mindestens einem Beleg.
- Ein Bogen oeffnet mit einer lebenden Frage und tilgt sie mit einem Ergebnis; hoechstens fuenf Wische bis zur Tilgung; nach der Tilgung kein neuer Inhalt.
- Reprise statt Verweis: nie "wie oben", "wie wir gesehen haben"; was gebraucht wird und weg ist, wird neu gezeigt.
- Kein Plan-Leak, kein Meta: keine Saetze ueber den Film, das Blatt, das Wischen, kein "nun folgt".
- Erster Satz nennt die Natur der Sache, keine Klassifikationshuelle. Fachwoerter beim ersten Auftreten im Halbsatz erklaert. Jedes neue Symbol wird im Bild geerdet.
- Uebersichtsblaetter hoechstens eines, nie als Eroeffnung.
- Treue: nichts, was nicht im Dokument steht; nichts durch Auslassung verfaelscht (du siehst das Dokument nicht; melde nur, was im Transkript selbst als Luecke sichtbar wird, etwa eine angekuendigte Liste, die nicht kommt).
- Sprache: kurze Saetze, hoechstens ein Nebensatz, Anrede ihr, kein Gendern, Dezimalkomma.

Lesehinweise: Saetze in eckigen Klammern sind Beschreibungen des Transkripts, kein Text des Films; Sprach- und Satzregeln gelten nur fuer Text ausserhalb der Klammern. „hervorgehoben, Kasten" ist ein Kasten um eine Ergebniszeile, keine Kandidatenfarbe. Die gestrichelte Aufstiegslinie und der Punkt tragen die Farbe ihres Kandidaten; das ist richtig. Der Schlusssatz nach dem letzten Blatt ist Abspann, kein Blatt.`;

function transkript(f){ return execFileSync('node',[path.join(hier,'..','transkript.mjs'),f],{encoding:'utf8',maxBuffer:64*1024*1024}); }

if(befehl==='prompts'){
  fs.mkdirSync(ordner,{recursive:true});
  const T=transkript(film);
  for(const [name,kopf] of [['beziehung',KOPF_BEZIEHUNG],['lehren',KOPF_LEHREN]]){
    fs.writeFileSync(path.join(ordner,'lesung-'+name+'.md'),kopf+'\n\nDAS TRANSKRIPT:\n\n'+T+'\n\n'+FORM+'\n');
  }
  console.log('Prompts: lesung-beziehung.md, lesung-lehren.md in '+ordner+'. Je Datei ein frischer Agent, Antwort nach lesung-<name>.antwort.json, dann: sammeln');
} else if(befehl==='sammeln'){
  const L=[]; let n=0; const alle=[];
  for(const name of ['beziehung','lehren']){
    const p=path.join(ordner,'lesung-'+name+'.antwort.json'); if(!fs.existsSync(p))continue;
    let s=fs.readFileSync(p,'utf8').trim(); const a=s.indexOf('{'), e=s.lastIndexOf('}'); s=s.slice(a,e+1);
    let A; try{ A=JSON.parse(s); }catch(err){ L.push('('+name+': JSON nicht lesbar)'); continue; }
    for(const b of (A.befunde||[])){ n++; alle.push(Object.assign({nr:n,lesart:name},b)); }
    L.push('**Lesart '+name+':** '+(A.urteil||'')+(A.trug&&A.trug.length?'  \nTrug: '+A.trug.join('; '):''));
  }
  const ord={schwer:0,mittel:1};
  alle.sort((x,y)=>(ord[x.schwere]??2)-(ord[y.schwere]??2));
  const out=['# Befunde des Schnellrichters','','Je Zeile eine Nummer. Autor antwortet mit Nummern: stimmt / stimmt nicht / fehlt: <eigener Befund>.',''];
  alle.forEach((b,i)=>out.push((i+1)+'. ['+(b.schwere||'?')+', '+b.lesart+'] '+(b.wo||'')+' | '+(b.regel||'')+' | „'+(b.zitat||'')+'" | '+(b.befund||'')));
  out.push(''); out.push(...L);
  fs.writeFileSync(path.join(ordner,'BEFUNDE.md'),out.join('\n')+'\n');
  console.log(out.join('\n'));
} else { console.error('Aufruf: node lesung.mjs prompts LAUF film.json | node lesung.mjs sammeln LAUF'); process.exit(2); }
