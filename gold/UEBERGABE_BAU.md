# Übergabe an die Bau-Session: vom Goldlauf zum reproduzierbaren Prozess

Stand 2026-09-05, Autorentscheid: die Bau-Session baut Format, Player, Skill und führt den Blindtest durch. Die Gold-Session liefert den Maßstab (gold/extrempunkte.html, LEHREN_GOLD.md, STORYBOARD) und beurteilt die Ergebnisse gegen den Maßstab. Die Steuerung hält den Kanon. Alles in gold/ ist Lesequelle, nie Schreibziel.

## 1. Das Ziel in einem Satz

Eine blinde, schwächere Session (Sonnet, später Haiku) erhält nur den Skill und die PDF-Seiten als Bilder und erzeugt daraus eine Filmdatei, die der Player so aufführt, dass der Autor keinen Abstand zu gold/extrempunkte.html mehr sieht. Jeder Abstand ist eine Skill- oder Player-Lücke, nie ein Anlass, den Film der blinden Session zu korrigieren (L40).

## 2. Der Maßstab

gold/extrempunkte.html, Entwurf 3. Acht Blätter, Aufbau in gold/STORYBOARD_extrempunkte.md (Bögen B1 bis B8, Beziehungskatalog, Hypothesen H1 bis H8). Lesererfahrung Blatt für Blatt in gold/TRANSKRIPT_extrempunkte_e2.md (Entwurf 2; Entwurf 3 ändert Farbe, Pfeilziel und Zeitverteilung, siehe LEHREN_GOLD GL1 bis GL3). Abnahmekriterium Schritt 1: derselbe Film als Datei im neuen Format, im erweiterten Player aufgeführt, vom Autor am Handy ohne sichtbaren Unterschied gebilligt.

## 3. Was der Player neu können muss (jedes Gerät mit seiner Beziehung)

Referenzimplementierung: der Skriptteil von gold/extrempunkte.html (Funktionen graph, pfeil, flug, zeile, zeitVerteilen, einpassen, render). Alles ist eine Funktion des Radstands p; kein zweiter Mechanismus.

| Gerät | Beziehung | Verhalten im Goldlauf |
|---|---|---|
| fahrt | der Finger ist der Parameter x; ein Wert läuft mit | Berührgerade (Halblänge 64 px, Kandidatenfarbe) fährt von x0 nach x1 über den Beat; Tafel oben links im Bild „x = …", „m = …" (Dezimalkomma, eine Stelle); an Geister-Stellen bleibt eine waagerechte Gerade mit „m = 0" liegen, sobald die Fahrt vorbei ist; die fahrende Gerade blendet in den letzten 4 Prozent aus |
| pfeil | Herkunft und Einsetzen | Quelle: Chip (eingesetzte Zahl); Ziel: Chip in der Klammer, von oben (GL2). Weg: aus der Quelle nach unten in die Fuge (g = 6 + lane·3), nach links in die Rinne (x = −12 − lane·6 im Seitenrand, Blatt hat 30 px linkes Polster), senkrecht bis zur Fuge über dem Ziel, waagerecht bis über das Ziel, hinunter mit Spitze auf die Zahl; Ecken r = 7 gerundet; Strichbreite 1,6; zeichnet sich linear über die Strecke, Spitze ab 86 Prozent. Verzweigung: ein weiterer Pfeil startet am Rinnenpunkt des ersten (split). versatz verschiebt die Spitze, wenn zwei Pfeile dieselbe Klammer treffen |
| flug | eine Zahl wandert an ihren Ort | Kopie des Chips (innerHTML nach MathJax) fliegt geradlinig, ease-in-out, zum Zielchip oder zu einem Bildanker; bei Ankunft (u ≥ 0,97) wird das Ziel sichtbar (Chip oder Achsenmarke), die Kopie verschwindet. Im Goldlauf: Kandidat zur x-Achse (Marke = Dreieck an der Achse plus farbige Zahl darunter, grauer Tick wird ausgeblendet); Ergebniszeile setzt sich in Blatt 3 aus Herkunftskopien zusammen (Buchstabe aus „Hochpunkt", x aus x₁ = …, y aus f(x₁) = …); in der Serie kein Flug in die Ergebniszeile (GL4) |
| kappe | wo im Bild, Gestalt am Kandidaten | Kurvenstück x ± r (r ≈ 0,3 bis 0,5), Strich 5, Kandidatenfarbe, zeichnet sich; Label optional über der Kappe bei f'' < 0 (∩), unter ihr bei f'' > 0 (∪); im Goldlauf nur im erklärten Beispiel beschriftet (Rechtskurve, Linkskurve; Dokumentwortlaut S. 37) |
| aufstieg | die Stelle wird zur Höhe | gestrichelter Pfad von (x, 0) nach (x, y) und weiter zur y-Achse, linear gezeichnet; Wert als farbige Zahl an der y-Achse ab 95 Prozent; danach landet der Punkt |
| gruppe / eng | Zeile bricht nicht innerhalb einer Einheit | gruppe: inline-flex mit Chipabstand; eng: Abstand 0, damit eine Formel in Chips zerlegt werden kann und nur die eingesetzte Zahl Farbe und Pfeilziel trägt (f''( · −1 · )=6·( · −1 · )=−6). Führende Hochzahl als {}^{3} schreiben |
| serie | dasselbe Muster, neue Zahlen | identische Choreographie je Beispiel: Funktion, Graph; notwendig (Ableitung, Lösung, Flug zur Achse); hinreichend (f'', Test mit Pfeil in die Klammer, Kappe); y-Werte (Pfeilast in die Klammer, Aufstieg, Punkt); Ergebniszeile erscheint, Beschriftung am Punkt |
| Handy-Rahmen | ein Blatt ist ein Handybildschirm | auf Schirmen ab 700 px Breite steht die Bühne als 390 px breiter Rahmen (Höhe min(812 px, 100svh − 24 px)) in der Mitte |

Weitere Eigenschaften des Goldlaufs, die der Player übernehmen sollte:
- Zeit (GL3): die Stücke eines Beats kacheln seine ganze Strecke lückenlos nach ihrem dauer-Gewicht; vor einem Blattwechsel bleibt die Blende (0,09 Beat) frei; gewicht steuert nichts mehr an der Zeit. Jeder Beat kostet dieselbe Radstrecke (100 vh).
- Chips: jede Formelzeile besteht aus Chips (MathJax SVG, fill = currentColor, Farbe per CSS-Klasse k0, k1, k2). Anker für Pfeile und Flüge sind Chips; Geometrie über getBoundingClientRect relativ zum Blattinhalt, geteilt durch den Blattmaßstab, nach MathJax-Satz und nach dem Einpassen neu gerechnet (Resize, Vollbild).
- Einpassen: Fugen 16 bis 26 px, sonst Skalierung des Blattinhalts (Ursprung oben links, Breite 100/f Prozent), mindestens 0,55.
- Graph: Legende als Zeile unter dem Bild (nicht im Bild, sie überlagerte die Kurve); x-Beschriftung am Achsenende unter der Achse; Tafel der Fahrt oben links.
- Farbe (GL1): eine Farbe je Kandidat, nur auf der Zahl, die wandert oder eingesetzt wird.
- Startknopf erst frei, wenn MathJax gesetzt und gemessen ist („Wird vorbereitet …"); Vollbild nur bei pointer:coarse; Fehlerkasten (window.onerror) sichtbar im Bild, weil auf dem Handy keine Konsole erreichbar ist.

## 4. Formatvorschlag (additiv zu titel, quelle, boegen, beats, ops)

Beat: {sub?, ops:[...]}; gewicht entfällt. Jede Op darf dauer tragen (Anteil an der Beatstrecke, Vorgabe 1).

zeile {teile:[...], hl?, folge?, stumm?}; teile: TeX-String | {tex, k, id, leer} | {t, id} | Gruppe als Liste, eng als Liste mit erstem Element "!eng". folge: Chip für Chip in Leserichtung. stumm: Zeile steht schon, erscheint erst mit zeig.
zeig {zeile, folge?}
marke {t} (Kleinbuchstaben-Marke, TeX erlaubt); satz {t}; h {t}; merk {t}
graph {id, expr, xmin, xmax, ymin, ymax, legend, h?, dauer?}
punkt {id, x, y, k}; beschriftung {id, x, y, text, k}
kandidat {id, x, k, text, sofort?}  (Achsenmarke; ohne sofort erst durch flug sichtbar)
flug {von: chipId, zu: chipId | {kandidat: id}, k, dauer?}
pfeil {id, von: chipId | {pfeil: id}, zu: chipId, lane, k, versatz?, dauer?}
kappe {id, x, r, k, text?}
aufstieg {id, x, y, k, text}
fahrt {id, x0, x1, geister:[x], k, dauer}
Chip-Ids gelten je Bogen. Ein Bogen darf serie: {…} tragen, das der Player in die obige Choreographie entfaltet (Vorschlag: so bleibt die Datei kurz und die Serie garantiert gleichförmig; Datenstruktur wie im Goldlauf: n, f, f1, loes, kand, f2, tests, y, erg).

## 5. Prüfer (pruefe.mjs), neue Befunde

- Farbe auf einer Zeile oder einem Text statt auf einer Zahl: schwer (GL1). Mechanisch: Chip mit k, dessen TeX mehr als eine Zahl enthält.
- pfeil, dessen Ziel keine Zahl in einer Klammer ist: mittel (GL2).
- gewicht im Beat: leicht, wird ignoriert (GL3).
- flug in eine Ergebniszeile außerhalb des erklärten Beispiels: mittel (GL4).
- Bewegung ohne Beziehung: nicht mechanisch prüfbar; der Skill verlangt in der Beiakte je Gerät einen Satz, welche Beziehung es zeigt (GL6). Fehlt er, mittel.
- Bestand: Blatthöhe, eine Auflösung je Bogen, Inventar, Sprachregeln.

## 6. Skill (SKILL.md, REFERENCE.md, Beispiel)

Quellen: skill/blattkino/SKILL.md (Bestand), gold/LEHREN_GOLD.md (GL1 bis GL6 mit Autorwort), gold/STORYBOARD_extrempunkte.md (Beziehungskatalog als Auswahltabelle, Hypothesen H1 bis H8, Grundkonzept-Karte als Muster), gold/SIMULAT_extrempunkte_1.md (was trug, was nicht). Beispiel: der Goldfilm als Datei im neuen Format; er ist das Maß, nicht Vorlage zum Ausfüllen (L26: Beispiele schlagen Anweisungen). Pflicht in der Antwort der Skill-Session: Lernreise in fünf Zeilen, Grundkonzepte, je eingesetztem Gerät ein Satz zur Beziehung.

## 7. Blindtest

Session: Sonnet, frisch, blind. Eingabe: nur der Skill-Ordner und die 52 Seiten als JPEG (pdftoppm -r 70 reicht zum Lesen; gold/INVENTAR_kurvendisk1.md zeigt, was darauf steht, bleibt der Session aber verborgen). Auftrag: „Mache aus Seite 35 bis 38 eine didaktisch optimale Animation nach dem Skill." Ausgabe: Filmdatei plus Beiakte. Auswertung durch die Gold-Session: Abgleich gegen den Goldfilm entlang des Beziehungskatalogs (welche Beziehungen gezeigt, welche Geräte richtig gesetzt, Treue, Farbe, Pfeilziele), dann Simulat-Lesung ihres Films (SCHUELER.md). Jeder Abstand wird in AUSTAUSCH gemeldet und geht als Skill-Änderung an die Bau-Session, nie als Korrektur am Film. Danach Haiku.

## 8. Fallen, in die ich gelaufen bin (spart euch Zeit)

1. Geometrie im falschen Bezugssystem: Anker müssen relativ zum Blatt gerechnet werden, in dem sie liegen; eine globale „aktuelle Szene" zeigte nach dem Aufbau auf das letzte Blatt, alle Pfeile saßen um den Versatz verschoben.
2. Zeilenumbruch trennte x₁ = von seinem Wert; Gruppen (nowrap) sind Pflicht.
3. Legende im Bild überlagerte die Kurve; als Zeile unter dem Bild ist sie sicher.
4. Fahrt-Tafel neben dem Punkt kollidierte mit Punktbeschriftungen; feste Tafel oben links.
5. Artifact-CSP lässt keine Fontdateien von cdnjs zu: MathJax SVG-Ausgabe, kein CHTML.
6. Vollbild im Artifact-iframe scheitert still; klein nur über pointer:coarse, sonst zeigt der Knopf „Im Vollbild starten" auch am Desktop.
7. Bis MathJax gesetzt und gemessen ist, würde ein früher Wisch verpuffen; Startknopf erst dann frei.
8. Der Autor sieht keine Konsole: ein sichtbarer Fehlerkasten im Bild ersetzt sie.
9. Ein Rechenblatt mit Graph 170 px und zehn Zeilen passt in 698 px nur skaliert; eng-Gruppen und kompakte Zeilen (line-height 1,35, Fuge 16) sind nötig.
10. Beim Prüfen im Browser-Rahmen erreichten Wisch und Tastatur den Artifact-iframe unzuverlässig; jsdom-Lauf über die ganze Radstrecke (0 Fehler) und das Handy des Autors sind die verlässlichen Prüfungen.

## 9. Reihenfolge

1. Format und Player (eure Linie, quelle/), Goldfilm als Datei, Sichtprüfung des Autors gegen gold/extrempunkte.html.
2. Skill mit Beispiel und Prüfer-Erweiterung.
3. Blindtest Sonnet; Auswertung durch Gold; Skill-Iteration; dann Haiku.
Jede Iteration eine Zeile in STAND bzw. eurer Laufkarte; Prüfkette wie STAND §7 plus jsdom-Lauf.
