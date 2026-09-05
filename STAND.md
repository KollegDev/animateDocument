# STAND: Blattkino, ausgelieferte Linie

Stand 2026-09-05. Diese Datei beschreibt den Zustand der Linie `player.html` plus
`skill/blattkino` plus `filme/`, also des Produkts, das derzeit auf studienkolleg.me läuft.

**Achtung, Widerspruch zum älteren Kanon.** `ZIEL.md`, `PLAYER.md` und `PROMPT.md`
beschreiben einen Player mit Sprachausgabe, Untertiteln, Claude-Anmeldung und
Vertiefungs-Dialog. Der Autor hat diese Eigenschaften am 2026-09-04 ausdrücklich
abbestellt. Was hier steht, ist der Stand nach dieser Entscheidung. Der Abschnitt
„Entschiedenes" unten nennt jede Abweichung mit ihrem Grund. Wer am Produkt arbeitet,
folgt dieser Datei; `LEHREN_ANIMATION.md` und das Autorenprojekt bleiben unberührt gültig.

**Rollen.** Die Bau-Session (Player, Skill, Auslieferung) hält diese Datei und fasst
Kanon-Dateien nicht an. Die Steuerungs-Session hält den Kanon. Nachrichten zwischen den
Sessions laufen über `AUSTAUSCH.md`. Über Didaktik gilt `LEHREN_ANIMATION.md` und darüber
das Autorenprojekt; diese Datei sagt nur, was gebaut ist.

---

## 0. Für die Projektsteuerung: was an der bisherigen Zusammenfassung überholt ist

Die Kanon-Zusammenfassung beschreibt den Stand vor dem 4. September. Elf Sätze davon
stimmen nicht mehr. Links der alte Satz, rechts der gemessene Zustand.

| Bisher im Kanon | Heute gebaut |
|---|---|
| Beat ist Untertitel plus Leinwand-Operationen | Beat ist ein Zeitabschnitt; die Einheit ist der **Bogen**, und ein Bogen ist ein **Blatt**, also genau ein Bildschirm |
| gesprochener Untertitel, TTS liest vor | keine Sprachausgabe, keine Untertitelzeile; abbestellt am 2026-09-04 |
| Takt hängt an der Sprechdauer | jeder Beat kostet dieselbe Strecke am Rad; wer länger braucht, hält an |
| Anhalten öffnet eine Frage, die Antwort wird in den Film animiert | entfällt; kein Aufruf zur Laufzeit, alles vorkompiliert |
| setzt eine Claude-Sitzung des Betrachters voraus | keine Anmeldung, keine Inferenzkosten, eine HTML-Datei |
| Mausrad spult die Animation | Wischen auf einer durchsichtigen Radfläche; mobile first, Vollbild-Tor auf kleinen Geräten |
| kleines festes Vokabular (7 Operationen) | 23 Operationen, darunter das Paar und vier Geräte, die es auf Papier nicht gibt: `wert`, `doppelgraph` mit `binden`, `bildfolge`, `zoomfolge` |
| die Rolle wächst, `clear` ist ein Schnitt | innerhalb eines Bogens wächst das Blatt und behält alles; am Bogenende löst das nächste Blatt ab. `clear` ist gegenstandslos geworden |
| `blattkino.html` ist der Player | `player.html` ist der Player; `blattkino.html` ist die alte Linie |
| `PROMPT.md` ist das zweite Artefakt | der **Skill** ist das zweite Artefakt: Anweisung, Referenz, mechanischer Prüfer, Bauwerkzeug und ein bestandenes Beispiel |
| Vision-Ingestion im Player, pdf.js rendert Seiten und schickt sie an die Regie | die verarbeitende Sitzung ist das Auge; der Player sieht nichts und rechnet nichts |

**Drei Messungen, aus denen das folgt.** Sie sind der Grund, nicht der Geschmack:

1. Die Artifact-Laufzeit nimmt keine Bilder entgegen. `sample.limits()` liefert
   `{"maxPromptBytes":65536,"tools":{"maxCount":16}}`, kein `images`; jeder Aufruf mit
   `images` scheitert mit `invalid_request`. Ein Player, der selbst sieht, ist unmöglich.
2. Die PDFs des Autors sind reine Rastergrafiken ohne Textebene (belegt mit `pdffonts`,
   `pdftotext`, `pdfimages`). OCR zerstört die Formeln. Also muss die Sitzung ansehen,
   was der Player nicht kann.
3. Die Artifact-CSP lässt nur cdnjs, jsdelivr, Tailwind und jQuery zu und blockiert jeden
   fetch auf andere Hosts, bei 16 MB Seitenobergrenze. Client-seitiges OCR oder ML im
   Player ist ausgeschlossen.

Daraus folgt die heutige Arbeitsteilung: **die Intelligenz sitzt im Skill, der Player ist
dumm und deterministisch.** Das ist keine Vereinfachung des Ziels, sondern seine einzige
bauhare Form.

**Fassung zum Übernehmen.** Wenn die Steuerung `ZIEL.md` nachzieht, passt dieser Absatz:

> Blattkino verwandelt ein Dokument in ein scrollgesteuertes Lehrblatt. Die Seite steht
> still; Wischen dreht nur den Fortschritt einer Animation, die auf einer stehenden Bühne
> abläuft. Ein Bogen des Stoffs ist ein Blatt und ein Blatt ein Bildschirm: die Blöcke
> legen sich von oben nach unten dazu und bleiben stehen, bis der Bogen endet, denn das
> Blatt ist der ausgelagerte Speicher des Lesers. Das Projekt baut zwei Artefakte. Erstens
> den Player, eine einzelne HTML-Datei ohne Anmeldung, ohne Sprachausgabe und ohne Aufruf
> zur Laufzeit, der eine JSON-Filmdatei deterministisch aufführt. Zweitens den Skill, der
> eine beliebige LLM-Sitzung mit einem Dokument befähigt, genau diese JSON-Datei zu
> erzeugen: Anweisung, Formatreferenz, ein mechanischer Prüfer, der gegen die Autorlehren
> misst und mit Fehlercode abbricht, ein Bauwerkzeug und ein bestandenes Beispiel. Fertig
> heisst: ein Dokument ergibt ohne Handarbeit einen Film, den der Autor billigt.

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
- **Jeder Beat kostet dieselbe Strecke am Rad.** Ein Wisch trägt immer gleich weit.
  `gewicht` bestimmt nicht mehr die Strecke, sondern das Aufbautempo innerhalb des Beats.

Technisch: CSS `scroll-timeline-name: --rad` auf dem Rad, `timeline-scope: --rad` auf
`:root`, jedes Element mit eigenem `animation-range` in Prozent. Kein Skript pro Bild.
Fällt die Zeitleiste aus, schaltet der Player auf einen Scroll-Lauscher um (`html.zuFuss`).
Bei `prefers-reduced-motion` wird die Seite ein gewöhnliches Dokument.

## 3. Das Format

Eine JSON-Datei mit `titel`, `quelle`, freiwilligem `inventar` und `boegen`. Ein Bogen
hat eine lebende `frage` und `beats`; ein Beat hat `sub`, `gewicht`, `fokus`, `payoff`
und `ops`. Vollständig beschrieben in `skill/blattkino/REFERENCE.md`.

Operationen: `h, text, item, math, note, merksatz, frage, umformung, paar, tabelle,
jetztihr, plot, point, hline, vline, region, sweep, wert, doppelgraph, binden, bildfolge,
zoomfolge`. `clear` bleibt gültig und tut nichts. Ein Bogen kennt neben `frage` und
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
| `quelle/viewer-kopf.html` | Kopf und gesamtes CSS des Players |
| `quelle/kern.js` | `compileExpr`, `makePlot` und die Zeichen-Methoden |
| `quelle/viewer-js.js` | Aufbau, Zeitverteilung, Einpassen, Tor, Rückfall |
| `quelle/bauen.sh` | setzt die drei Teile zu `skill/blattkino/player.html` und `player.html` zusammen |
| `skill/blattkino/pruefe.mjs` | prüft eine Filmdatei gegen die Gesetze; Fehlercode bei schwerem Befund |
| `skill/blattkino/baue.mjs` | baut aus Filmdatei plus Player eine eigenständige HTML-Datei |
| `skill/harness-viewer.mjs` | 80 mechanische Tests über jsdom |
| `quelle/*.json` | die Filme im Quellzustand |

Ablauf einer Änderung am Player: `quelle/` ändern, `bash quelle/bauen.sh`,
`node skill/harness-viewer.mjs`, dann die Filme mit `baue.mjs` neu bauen und die
JSON-Dateien nach `filme/` spiegeln.

Der Prüfer misst unter anderem: passt ein Bogen auf ein Blatt (698 Pixel, ein Graph 230,
ein Doppelgraph 460), Zahl der Beats bis zur Auflösung (über fünf grenzwertig, über sechs
schwer), genau eine Auflösung je Bogen und ihre Lage, Überflieg-Träger, Regel ohne Serie,
Notationsgestalt in Musterserien, Gebrabbel, Sprachregeln, Gültigkeit jedes `expr`,
Abdeckung des Inventars, sinnvolle Verwendung der vier Geräte.

## 5. Zustand

- Player: `player.html`, 52 KB, eine Datei, keine Netzabhängigkeit ausser MathJax.
- 86 Harness-Tests grün.
- Drei Filme, alle mit 0 schweren, 0 mittleren, 0 leichten Befunden:
  `filme/parabel.json` (8 Bögen, 20 Beats, die Vorführung),
  `filme/ableitung.json` (14 Bögen, 30 Beats),
  `filme/kurvendiskussion-1.json` (19 Bögen, 46 Beats).
- Auslieferung: GitHub Pages, `KollegDev/animateDocument`, Domain studienkolleg.me.
- Zwei Wege, einen Film auszuliefern:
  1. `player.html?film=filme/x.json` (üblich): Datei ablegen, eine Zeile in `index.html`.
  2. `baue.mjs` erzeugt eine eigenständige HTML-Datei (für Artifacts und offline).

**Offen, mit Priorität:**

1. Pages-Build #13 ist rot. Ursache: der Geschwisterordner `Autorenprojekt` ist ein
   eigenes Git-Repository und wurde als Verweis auf ein nicht vorhandenes Submodul
   eingetragen. Behoben und vorbereitet (`git rm --cached Autorenprojekt`, `.gitignore`),
   aber noch nicht committet. Der nächste Push behebt es.
2. Der Merge mit der Linie `blattkino.html` ist nicht entschieden. Siehe „Entschiedenes".
3. `film-wertebereich.html` und `selbstbau.html` stammen aus alten Bauformen und sind
   nicht mehr verlinkt.
4. Vom restlichen grossen Testdokument sind erst vier Seiten verfilmt.
5. `paar` ist gebaut, aber in keinem Film benutzt. Kandidat: `ableitung.json`, wo f und
   f' auseinander hervorgehen.

## 6. Entschiedenes, mit Grund

Alles hier ist Autorentscheid, nicht Vorschlag. Wer es ändern will, braucht einen neuen
Autorentscheid.

| Entschieden | Grund |
|---|---|
| Keine Sprachausgabe, keine Untertitelzeile | „Es soll kein Kino sein, sondern eher ein Viewer" |
| Keine Claude-Anmeldung, kein Aufruf zur Laufzeit, alles vorkompiliert | Extrem geringe Reibung beim Onboarding; keine Inferenzkosten für uns |
| Mobile FIRST, Wischen ist die einzige Mechanik | ausdrücklich, „wirklich FIRST" |
| Der Fortschritt ist stufenlos, kein Einrasten | „kontinuierlich by design" |
| Jeder Beat kostet dieselbe Strecke | ungleiche Strecken machen die Geste unberechenbar; wer verweilen will, hält an |
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
- Der Skill wird gegen frische Sitzungen getestet, nicht behauptet. Der letzte Lauf fand
  neun Mängel; alle sind behoben.

**Sprachregeln, gültig für alle Ausgaben des Projekts:** niemals Gendern, keine
Gedankenstriche, Dezimalkomma, keine Konstruktion „ist nicht x, sondern y", höchstens ein
Nebensatz je Satz. Berichte sind knapp; Lobprosa und Nacherzählung sind verboten.

## 8. Was noch nie geprüft wurde

Ob der Inhalt einer fremden Sitzung didaktisch taugt. Der Prüfer fängt Mechanik, nicht
Verständnis. Der Testagent wurde ausdrücklich nach Reibung gefragt, nicht nach Qualität.
Die Bodenwahrheit bleibt das Autorurteil am abgespielten Film.
