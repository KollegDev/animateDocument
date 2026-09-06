# STAND: Blattkino, ausgelieferte Linie

Stand 2026-09-05. Diese Datei beschreibt den Zustand der Linie `player.html` plus
`skill/blattkino` plus `filme/`, also des Produkts, das derzeit auf studienkolleg.me läuft.

Der Kanon (`ZIEL.md`, `PLAYER.md`, `KANON.md`) ist seit P1/P3/P4 auf diese Linie
nachgezogen; ein Widerspruch besteht nicht mehr. `LEHREN_ANIMATION.md` und das
Autorenprojekt gelten über Didaktik.

**Rollen.** Die Bau-Session (Player, Skill, Auslieferung) hält diese Datei und fasst
Kanon-Dateien nicht an. Die Steuerungs-Session hält den Kanon. Nachrichten zwischen den
Sessions laufen über `AUSTAUSCH.md`. Über Didaktik gilt `LEHREN_ANIMATION.md` und darüber
das Autorenprojekt; diese Datei sagt nur, was gebaut ist.

---

## 0. Warum der Player dumm ist

Drei Messungen, keine Geschmacksfrage: die Artifact-Laufzeit nimmt keine Bilder entgegen;
die PDFs des Autors sind Raster ohne Textebene, OCR zerstört die Formeln; die Artifact-CSP
lässt keinen fremden fetch zu. Also ist die verarbeitende Sitzung das Auge, der Player
deterministisch, und die Intelligenz sitzt im Skill.

---

## 1. Ziel

Ein Skill, mit dem eine beliebige frische LLM-Sitzung gemeinsam mit einem hochgeladenen
Dokument eine Animation in einer Form erstellt, die ohne Nacharbeit in unseren Player
geht. Das Ergebnis ist eine JSON-Datei. Der Player liegt einmal auf der Seite und setzt
jede solche Datei um.

Die Animation ist der visuelle Ausdruck des didaktischen Inhaltsverständnisses eines
LLMs, mit dem Ziel, statische Information in eine geführte Erfahrung zu verwandeln.
Nicht Dekoration, nicht Anordnung.

## 2. Gegenstand: die Bauform

Die Seite scrollt nicht. Sie bewegt sich nie um einen Pixel.

- Über allem liegt eine durchsichtige Fläche, das **Rad**. Wischen bewegt nur sie; ihr
  Stand ist der Fortschritt der Animation. Rechts läuft ein senkrechter Balken mit.
- Darunter steht die **Bühne**, unbeweglich, auf `svh` bemessen, damit die Adresszeile
  des Handys das Layout nicht springen lässt.
- Davor steht ein **Tor**: Titel, Quelle, ein Knopf. Vorher läuft nichts. Auf kleinen
  Geräten startet der Knopf ins Vollbild, weil die Wischgeste sonst dauernd die
  Adresszeile hervorholt. Unten rechts führt ein Kreuz hinaus.
- Ein **Bogen** ist ein **Blatt**, und ein Blatt ist genau ein Bildschirm.
- Das Blatt füllt sich von oben nach unten. Jeder Beat legt seine Blöcke dazu, an ihrem
  endgültigen Platz. Es rutscht nichts nach.
- **Was einmal dasteht, bleibt stehen**, bis der Bogen endet. Das Erscheinen trennt die
  Gedankenschritte, das Stehenbleiben trägt sie: das Blatt ist der ausgelagerte Speicher
  des Lesers und seine Orientierung.
- Erst am Ende des Bogens löst das nächste Blatt das alte ab, als Kreuzblende.
- Ein Bild ist ein Block im Blatt wie jeder andere und bleibt ebenso stehen.
- Die Abstände zwischen den Blöcken rechnet der Player so, dass die Bildhöhe aufgebraucht
  wird, höchstens 64 Pixel je Fuge. Was nicht passt, wird einmal verkleinert.
- **Jedes Stück kostet dieselbe Strecke am Rad.** Ein Beat kostet 0,2 plus 0,11 Bildschirme
  je Stück (zwischen 0,35 und 1,6). Ein Wisch bringt immer etwa gleich viel Neues, und es
  gibt keine Ruhezonen: die Stücke kacheln die Strecke lückenlos (GL3). `gewicht` wird
  ignoriert. Autorbefund 2026-09-05: gleiche Strecke je Beat liess dünne Beats leer laufen.

**Player v2 (seit 2026-09-05, Kern des Goldlaufs).** Alles ist eine Funktion des
Radstands p: ein rAF je Scroll-Ereignis liest p, jedes Element hat einen Zustand apply(u).
Kein zweiter Mechanismus, keine CSS-Zeitleisten mehr. Ein Beat kostet Strecke nach seinen
Stücken, die sie lückenlos kacheln (GL3), vor dem Blattwechsel bleibt die Blende frei.
Geometrie (Pfeilwege, Anker) wird je Blatt nach MathJax und Einpassen gerechnet. Auf
Schirmen ab 700 px steht die Bühne als Handy-Rahmen. Bei `prefers-reduced-motion` wird
die Seite ein gewöhnliches Dokument. Ein sichtbarer Fehlerkasten ersetzt die Konsole.

## 3. Das Format

Eine JSON-Datei mit `titel`, `quelle`, `inventar` (Pflicht, seitenweise mit Marken
`S1:`; entfällt nur bei `"frei": true` für Filme ohne Quelldokument), freiwilligem
`schluss` und `boegen`. Ein Bogen hat eine lebende `frage` und `beats` (oder `serie` mit
`vorlage` und `faelle`, oder `uebersicht: true` mit `frage: null`); ein Beat hat `sub`,
`payoff` und `ops`. `gewicht` und `fokus` werden ignoriert. Vollständig beschrieben in
`skill/blattkino/REFERENCE.md`.

Operationen: `h, text, item, math, note, merksatz, frage, umformung, paar, tabelle,
jetztihr, plot, point, hline, vline, region, sweep, wert, doppelgraph, binden, bildfolge,
zoomfolge`, dazu aus dem Goldlauf `satz, marke, merk, zeile, zeig, graph, punkt,
beschriftung, kandidat, flug, pfeil, kappe, aufstieg, fahrt` und die `serie` als Vorlage
mit Fällen. `clear` bleibt gültig und tut nichts. Ein Bogen kennt neben `frage` und
`beats` das Feld `fortsetzung`, das die Beispielserie des vorigen Bogens weiterzählen
lässt.

`paar` setzt zwei korrespondierende Zeilen untereinander und zeigt beide Wege dazwischen,
mit gleicher Farbe für korrespondierende Teile. Für Umkehrbeziehungen; `umformung` bleibt
für die einseitige Kette.

Die vier Geräte, in denen Scrollen dem Papier überlegen ist, alle freiwillig:

- `wert`: eine Zahl steht gleichzeitig in der Formel und als Stelle im Bild. Behebt die
  geteilte Aufmerksamkeit.
- `doppelgraph` mit `binden`: zwei Systeme übereinander, dieselbe Stelle durch einen
  senkrechten Strich verbunden.
- `bildfolge`: eine Näherung läuft ab, jede Stufe kommt und geht, nur das Grenzbild bleibt.
- `zoomfolge`: stufenloses Hineinfahren, bis die Kurve ihre Berührgerade ist.

## 4. Werkzeuge

| Datei | Rolle |
|---|---|
| `quelle/v2/kopf2.html` | Kopf und gesamtes CSS des Players (aus dem Goldlauf, plus v1-Blöcke) |
| `quelle/v2/engine2.js` | die Gold-Engine: Chips, Zeilen, Graph, Pfeil, Flug, Fahrt, Kappe, Aufstieg |
| `quelle/v2/ops2.js` | JSON zu Engine: alle Operationen, Serie-Entfaltung, Register je Bogen |
| `quelle/v2/laufzeit2.js` | Zeit, render(p), Einpassen, Tor, Datei laden |
| `quelle/v2/kern2.js` | `compileExpr` und `makePlot` (für den Doppelgraphen) |
| `quelle/bauen.sh` | baut v2 nach `player.html` und `skill/blattkino/player.html` |
| `quelle/v1/` | der abgelöste v1-Player, nur Geschichte |
| `skill/blattkino/pruefe.mjs` | prüft eine Filmdatei gegen die Gesetze; Fehlercode bei schwerem Befund |
| `skill/blattkino/baue.mjs` | baut aus Filmdatei plus Player eine eigenständige HTML-Datei |
| `skill/blattkino/transkript.mjs` | schreibt den Film als Leseerlebnis (Blatt, Wisch, Bewegung, Farbe); Eingabe des Simulats |
| `skill/blattkino/SIMULAT.md` | Simulat-Auftrag (Fassung Gold); im Skill Abgabebedingung |
| `skill/harness2.mjs` | 43 mechanische Tests über jsdom |
| `skill/lauf2.mjs` | fährt einen Film über die ganze Radstrecke, zählt Fehler, `--dump` zeigt die Struktur |
| `skill/abgleich2.mjs` | Vorabnahme: Filmdatei gegen gold/extrempunkte.html, Struktur, Fenster, Text |
| `filme/*.json` | die ausgelieferten Filme, einzige Quelle; `bauen.sh` spiegelt den Goldfilm in den Skill |
| `blindtest/<n>/` | je Blindlauf `film.json` plus Beiakte, vom Katalog direkt verlinkt |

Ablauf einer Änderung am Player: `quelle/v2/` ändern, `bash quelle/bauen.sh`,
`node skill/harness2.mjs`, `node skill/abgleich2.mjs` (muss IDENTISCH melden), `node
skill/lauf2.mjs FILM` je Film. Ein Umbau ist erst fertig, wenn STAND und REFERENCE im
selben Batch nachgezogen sind (eiserne Regel 6).

Der Prüfer misst unter anderem: passt ein Bogen auf ein Blatt (755 Pixel, ein Graph nach
`h`, ein Doppelgraph 460), Zahl der Beats bis zur Auflösung (über fünf grenzwertig, über
sechs schwer), genau eine Auflösung je Bogen und kein neuer Inhalt danach ausser merk,
jetztihr, note, Überflieg-Träger, Regel ohne Serie, Notationsgestalt in Musterserien,
Gebrabbel samt Plan-Leak und Regieanweisung, Sprachregeln, Gültigkeit jedes `expr`,
Inventar als Pflicht mit Seitenmarken und seine Abdeckung, GL1 (Farbe auf mehr als einer
Zahl; Farbe im Text ohne Gerät; dritte Farbe auf Bildobjekten ohne Zahl), GL2 (Pfeilziel),
GL4 (Flug in der Serie), Umformung „eingesetzt" ohne Pfeil, Beat oder Payoff aus nur einem
Satz, Film ohne Merksatz, Übersicht als Eröffnung oder doppelt, drei gleichartige Fälle
ohne Serie, DD2 (Regel mit Beleg), DD4 (Payoff auf Übung), DD5 (Meta-Frage), DD6 (kurze
Bögen).

## 5. Zustand

- Player v2: `player.html`, 65 KB, eine Datei, keine Netzabhängigkeit ausser MathJax und
  den Plex-Schriften.
- 44 Harness-Tests grün; Abgleich gegen den Goldlauf IDENTISCH; alle Filme und Blindfilme
  laufen über die ganze Radstrecke ohne Fehler.
- Vier Filme: `filme/extrempunkte.json` (der Goldfilm als Datei, 8 Bögen, 31 Beats, 0 schwer;
  2 mittlere: zwei Blätter auf 0,95 eingepasst, wie im Goldlauf), `filme/parabel.json`
  (8 Bögen, 20 Beats, frei), `filme/ableitung.json` (14 Bögen, 30 Beats, frei),
  `filme/kurvendiskussion-1.json` (19 Bögen, 46 Beats, 4 offene SCHWER im Inventar,
  Altbestand). Die alten Filme tragen die DD-Befunde als MITTEL und sind nicht bereinigt.
- Fünf Blindläufe in `blindtest/`, alle Sonnet, nur Skill-Ordner plus Seitenbilder. 1
  (Extrempunkte, Massbeispiel derselben Seiten) wertlos als Messung; 2 und 3
  (Definitionsbereich, Skill v2/v2b) Autorurteil sehr schlecht; 4 (Wendepunkte, S. 30 bis 32
  des grossen Dokuments, nah) und 5 (Nullstellen und y-Achsenschnittpunkt, S. 9 bis 12,
  fern) mit Skill v2c: je 7 Bögen, 26 und 23 Beats, 0 schwer, 1 mittel (Einpassen 0,97 und
  0,98), lauf2 0 Fehler, 20,5 und 18,3 Bildschirme; mit INVENTAR.md, Storyboard, Transkript
  und Selbst-Simulat daneben. Autorurteil und Fremd-Simulat (Gold, DD) offen.
  Der Prüfer von heute findet in Blind-2 1 schwer, 9 mittel.
- Auslieferung: GitHub Pages, `KollegDev/animateDocument`, Domain studienkolleg.me.
- Zwei Wege, einen Film auszuliefern:
  1. `player.html?film=filme/x.json` (üblich): Datei ablegen, eine Zeile in `index.html`.
  2. `baue.mjs` erzeugt eine eigenständige HTML-Datei (für Artifacts und offline).

**Offen, mit Priorität:**

1. Der Skill erzeugt noch keinen Film, den der Autor gebilligt hat. Skill v2c (Storyboard-
   Pflicht, richtungsfreier Katalog mit Miniaturen, Simulat als Abgabebedingung, Transkript-
   Werkzeug) ist geschrieben und mit Blindtest 4 und 5 gemessen: Mechanik grün, Urteil offen.
   Bekannte Schwäche: das Selbst-Simulat der erzeugenden Sitzung ist mild (beide Läufe
   melden keine Regelfehler); das Fremd-Simulat entscheidet.
2. kd-1 trägt vier offene Inventar-Befunde (Logarithmus-Graph, Schritte der Serientabelle);
   Altbestand vor der Inventarpflicht. Neu giessen oder aus dem Katalog nehmen.
3. Vom grossen Testdokument sind erst vier Seiten verfilmt.
4. `paar` ist gebaut, aber in keinem Film benutzt. Kandidat: `ableitung.json`.
5. DD3 als eigene Prüferregel (Zweispalten-Tabelle im Musterbogen) fehlt; der
   Inventarabgleich fängt den Fall bisher indirekt. Überflieg-Ersatz aus DD6 als Ausgabe
   fehlt.
6. Haiku-Lauf des Skills steht aus.
7. Im Skill-Werkzeug der Sitzungen liegt eine ältere installierte Fassung des Skills
   (`anthropic-skills:blattkino`, v1 mit `gewicht`/`fokus`); Blindtest 5 hat beide gesehen und
   ist der lokalen gefolgt. Die installierte Fassung muss der Autor nachziehen oder
   entfernen, sonst lesen frische Sitzungen zwei Wahrheiten.

## 6. Entschiedenes, mit Grund

Alles hier ist Autorentscheid, nicht Vorschlag. Wer es ändern will, braucht einen neuen
Autorentscheid.

| Entschieden | Grund |
|---|---|
| Keine Sprachausgabe, keine Untertitelzeile | „Es soll kein Kino sein, sondern eher ein Viewer" |
| Keine Claude-Anmeldung, kein Aufruf zur Laufzeit, alles vorkompiliert | Extrem geringe Reibung beim Onboarding; keine Inferenzkosten für uns |
| Mobile FIRST, Wischen ist die einzige Mechanik | ausdrücklich, „wirklich FIRST" |
| Der Fortschritt ist stufenlos, kein Einrasten | „kontinuierlich by design" |
| Jedes Stück kostet dieselbe Strecke, ein Beat so viel wie sein Inhalt | „man muss sehr viel scrollen für mindere Wirkung"; keine Ruhezonen (GL3) |
| Ein Film ist erst mit Simulat abgegeben | Blind-2: Prüfer 0/0/0, Autor „sehr schlecht" |
| Blindtests bleiben im Katalog anklickbar | Autorwunsch; eine Wahrheit unter `blindtest/`, der Katalog verlinkt dorthin |
| Vollbild als Tor auf kleinen Geräten | die Wischgeste holte sonst die Adresszeile hervor und liess das Bild springen |
| Das Blatt behält alles bis zum Ende des Bogens | es ist der ausgelagerte Speicher des Lesers |
| Der Skill ist das Werkzeug, nicht ein Prompt im Player | eine frische Sitzung soll mit Dokument plus Skill arbeiten können |
| Der didaktische Plan ist Pflicht, wird aber nicht geprüft | Autorentscheid |
| Treue geht vor Bogenschluss | lieber ein Bogen weniger als eine erfundene Regel |

**Warum die alte Bauform fiel.** Die Sprachausgabe und der Vertiefungs-Dialog setzten
voraus, dass der Betrachter eine Claude-Sitzung hat. Gemessen wurde ausserdem, dass die
Artifact-Laufzeit keine Bilder entgegennimmt (`sample.limits()` liefert kein `images`;
jeder Aufruf mit `images` scheitert mit `invalid_request`) und dass die PDFs des Autors
reine Rastergrafiken sind, deren OCR die Formeln zerstört. Daraus folgte: die
verarbeitende Sitzung ist das Auge, nicht der Player. Der Player wurde dumm und
deterministisch, die Intelligenz wanderte in den Skill.

## 7. Arbeitsweise

- Der Prüfer meldet Befunde, kein Lob. Jeder schwere Befund wird behoben, bevor gebaut
  wird. Ein Qualitätsmangel wird nie am Satz repariert, sondern der Bogen neu gegossen.
- Vor jedem Ausliefern: `node --check`, dann der Harness grün, dann der Prüfer über jeden
  Film.
- Screenshots sind für Scrollverhalten untauglich und teuer. Geprüft wird im Browser mit
  einem Selbstlauf im Dokument, der den Radstand setzt, und mit einer Diagnoseleiste, die
  die gemessenen Werte anzeigt.
- Der Skill wird gegen frische Sitzungen getestet, nicht behauptet: Sonnet, nur
  Skill-Ordner plus Seitenbilder. Ein Blindlauf ist erst mit Simulat und Goldabgleich
  gelaufen; der Prüfer allein schliesst keinen Lauf ab.

**Sprachregeln, gültig für alle Ausgaben des Projekts:** niemals Gendern, keine
Gedankenstriche, Dezimalkomma, keine Konstruktion „ist nicht x, sondern y", höchstens ein
Nebensatz je Satz. Berichte sind knapp; Lobprosa und Nacherzählung sind verboten.

## 8. Was noch nie geprüft wurde

Ob der Skill ohne themengleiches Beispiel einen Film erzeugt, den der Autor billigt.
Blind-2 und Blind-3 sagen nein; v2c ist die Antwort darauf und noch ungemessen. Der Prüfer
fängt Mechanik, das Simulat fängt Lesbarkeit, die Bodenwahrheit bleibt das Autorurteil am
abgespielten Film.
