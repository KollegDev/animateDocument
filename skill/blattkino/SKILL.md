---
name: blattkino
description: Blattkino 2.9.2 (Buehne, Blickfuehrung, Goldgeraete, Umbau Zeile fuer Zeile, Gabel, Endloesung, Werkbank, Inventar, Simulat-Harness, Schnellrichter). Verwandelt ein Dokument in einen wischgesteuerten Lehrfilm fuer das Handy, in dem Formeln sich aufbauen, Zahlen von Zeile zu Zeile wandern und Graphen sich zeichnen. Nutze diesen Skill, wenn aus einem PDF, Arbeitsblatt, Skript oder Aufgabenblatt eine Animation, ein Lehrfilm, ein Video oder eine erklaerende Fassung werden soll, oder wenn "Blattkino" genannt wird. Funktioniert auch mit gescannten PDFs ohne Textebene, weil die Seiten angesehen werden.
---

# Blattkino

**Version 2.9.2 (2026-09-07).** Jeder Film traegt diese Nummer im Feld `"skill"`; sie steht
auch in der `description` oben.

Aenderungsprotokoll (Version, Datum, Anlass):
- 2.9.2, 2026-09-07: nach dem Live-Lauf der Werkbank auf dem Handy, drei Fehler im Spieler:
  Radikand und Zaehler trugen die Klassennamen des Rahmens (`rad`, `oben`) und wurden dadurch
  aus der Zeile heraus ueber den Bildschirm gelegt; das Wurzelzeichen ist jetzt ein SVG und
  waechst mit dem Radikanden; die Pfeile der Gabel schnitten durch den Lehrersatz und setzen
  ihren Scheitel jetzt dicht ueber die Aeste, wenn etwas dazwischensteht; in der `zoomfolge`
  wuchsen Punkt und Schrift mit und verdeckten das Bild. Harness: keine Formelklasse darf wie
  eine Rahmenklasse heissen.
- 2.9.1, 2026-09-07: `beispiel-werkbank.json`, der Pruefstand mit fuenfzehn Blaettern, je
  eine Bewegung an richtiger Mathematik; darin die zwei neuen Faelle des Herausloesens
  (teilweise Wurzel, Ablesen von p, q und Scheitel) und die Wurzel aus Chips. Pruefer:
  Umbau, Gabel und Pfeil zaehlen als das, was ein Blatt traegt; eine Farbe, die fliegt,
  ist keine Dekoration; die Endloesung wird je Aussage geprueft (Kette verboten, Rechnung
  im Wert verboten, Klammern und Hochzahlen erlaubt).
- 2.9, 2026-09-07: nach drei Autorbefunden am Ausklammer-Blatt: `zieht` (der Teil loest sich
  aus seiner Quelle, statt eine Zwischenzeile zu brauchen), `gabel` (zwei Wege, zwei Pfeile,
  zwei Spalten, die unabhaengig weiterrechnen), `loesung` (die Endloesung wird doppelt
  unterstrichen, Symbol und Wert nebeneinander). Pruefer: Rechnung ohne Endloesung,
  Rechenschritt in der Endloesung, Gabel ohne zwei Aeste oder ohne Endloesung.
- 2.8.1, 2026-09-07: nach dem Autorbefund zum Spagat der Augen: der Lehrersatz steht im
  Fluss des Blattes, vor dem, was er ankuendigt, und wird leise, wenn der naechste kommt;
  keine feste Sprecherzeile mehr. Abschnitt „Der Blick: eine Sache nach der anderen";
  Pruefer meldet Satz und Marke, die dasselbe sagen, und mehr als drei Saetze je Blatt.
- 2.8, 2026-09-07: nach drei Autorbefunden an Blindtest 5, Fassung 2: Ueberschrift ist der
  `titel` (Gegenstand), nicht mehr die Frage; Lehrersatz je Beat (`sag`);
  Treue heisst „erklaeren ja, hinzufuegen nein";
  `umformung` Zeile fuer Zeile mit `wege` (Umbau von der vorigen Zeile, `| +8` rechts wie der
  Schueler schreibt), `wird` und `weg`, Bruch und Hochzahl aus Chips; Katalog der Grundformen
  des Umbaus; Serifenschrift, Blattzaehler.
- 2.7, 2026-09-07: nach drei Autorbefunden an Blindtest 5: neues Geraet `umbau` (die Teile
  einer Zeile wandern an ihre neuen Plaetze; Ausklammern und Verwandte), `kandidat` an der
  y-Achse (der y-Wert fliegt aus der Zeile zur Achse), Flug kostet mindestens 2, das Bild
  folgt dem Rad mit begrenztem Tempo, Pruefer meldet Chips mit offener Klammer.
- 2.6.1, 2026-09-06: Werkzeuge, Regeln unveraendert: Spieler mit Halo hinter jeder Bildschrift, Achsenzahlen
  nach Pixeldichte, Beschriftungen weichen Achse und einander aus, vierte Farbe k3, Dokument-
  Ansicht (Wisch nach links, Feld `seiten`, je Bogen `seite`); `simulat/lesung.mjs` (Schnellrichter).
- 2.6, 2026-09-06: nach P19 Nr. 1: Simulat-Harness (`simulat/`) im Skill-Ordner, Schritt 7 laeuft
  darauf mit frischen Koepfen je Blatt; Berichte der Projektlaeufe ausserhalb.
- 2.5, 2026-09-06: Neuguss nach P18: sieben Widersprueche aufgeloest (JSON statt HTML als
  Ergebnis, Strecke je Stueck ueberall, Frage steht sichtbar oben, Musterlernen nur mit
  Dokumentbeispielen, Zahlenregel gestrichen, ein Geraetekatalog, ein Auslieferweg),
  Ueberflieg-Test durch das fertige Blatt ersetzt, Selbst-Simulat gestrichen, jede Regel
  einmal, Wenn-dann-Regeln zu Beispielen.
- 2.4.1 / 2.4, 2026-09-06: nach Trial 4 und 5: LaTeX-Glaettung im Inventarabgleich,
  `pruefe --hoehe`, `lauf2` im Skill-Ordner, Feld `skill`, Version in der description.
- 2.3, 2026-09-06: nach Trial 2 und 3: Storyboard, richtungsfreier Katalog mit Miniaturen,
  Transkript-Werkzeug, Lexika fuer Plan-Leak und Regieanweisung. Trials 4 und 5.
- 2.2, 2026-09-05: nach Trial 2: Inventar zuerst, jeder Beat zeigt etwas, hoechstens eine
  Uebersicht, jedes Einsetzen ein Pfeil, Strecke je Stueck. Trial 3.
- 2.1, 2026-09-05: Goldgeraete und Spieler v2. Trials 1 und 2.
- 1.x, 2026-09-04: Spieler v1. Abgeloest.

## Was entsteht

**Eine JSON-Datei**, der Film. Der Spieler `player.html` liegt fertig daneben und wird nicht
angefasst; er spielt jede solche Datei ab: `player.html?film=filme/name.json`. Nur wer eine
Datei ohne Server braucht, baut mit `baue.mjs` beide zu einer HTML-Datei zusammen.

Der Film fuehrt. Er bringt den Blick in die Reihenfolge, in der man verstehen muss, haelt an,
wo es schwer ist, und tritt zurueck, wo es leicht ist. Er zeigt, dass du den Stoff verstanden
hast. Ohne diese Absicht ist er Dekoration und schlechter als das PDF.

## Der Leser

Studienkollegiat, Deutsch etwa B2. Kurze Saetze tragen ihn. Sein Arbeitsgedaechtnis haelt
drei bis vier ungefestigte Dinge etwa eine Minute; danach sind sie weg. Er kann sich nichts
vorstellen, was das Blatt nicht zeigt, rechnet nur mit, wenn es billig ist, und lernt durch
Musterabstraktion: ein erklaertes Beispiel gibt ihm eine Ahnung, das Muster entsteht erst
ueber eine Serie.

Guete ist Ertrag geteilt durch Aufwand plus Schuldenlast: was er danach kann, gegen Lesezeit
und geistige Last, plus offene Fragen mal Strecke bis zu ihrer Aufloesung. Daran entscheidet
sich jeder Zielkonflikt.

## Die Buehne

Die Seite scrollt nicht. Ueber dem Bild liegt eine durchsichtige Flaeche, das **Rad**;
Wischen bewegt nur sie, und ihr Stand ist der Fortschritt des Films. Davor steht ein Tor mit
Titel, Quelle und Startknopf; auf dem Handy startet er ins Vollbild. Rechts laeuft ein
Fortschrittsbalken.

Ein **Bogen** des Films ist ein **Blatt**, und ein Blatt ist genau ein Bildschirm. Oben steht
klein die Frage des Bogens, darunter fuellt sich das Blatt von oben nach unten: jeder Beat
legt seine Bloecke an ihren endgueltigen Platz, ein Bild ist ein Block wie jeder andere, und
**was einmal dasteht, bleibt stehen, bis der Bogen endet.** Das Blatt ist der ausgelagerte
Speicher des Lesers. Erst am Bogenende blendet das naechste Blatt ein; zurueck kommt nur, wer
zurueckwischt.

Daraus folgen zwei Grenzen, die Papier nicht kennt. **Ein Bogen muss auf einen Bildschirm
passen**, denn alles, was in ihm vorkommt, steht am Ende gleichzeitig da; `pruefe.mjs`
rechnet die Hoehe aus und nennt sie. Und **jedes Stueck kostet dieselbe Strecke am Rad**: ein
Beat ist `0,2 + 0,11 · Summe der dauer` Bildschirme lang (mindestens 0,35, hoechstens 1,6),
seine Stuecke kacheln diese Strecke lueckenlos, es gibt keine Ruhezonen. Ein Wisch bringt so
immer etwa gleich viel Neues; wer verweilen will, haelt die Hand still. Ein Feld `gewicht`
gibt es nicht mehr.

## Der Bogen

Ein Bogen ist eine Spannung von ihrer Oeffnung bis zu ihrer Aufloesung, in einem Zug. Nicht
der Absatz, nicht die Dokumentzeile.

Jeder Bogen traegt eine `frage`: die Frage, die im Leser an dieser Stelle wirklich lebt.
Sie ist dein Werkzeug im Storyboard, nicht die Ueberschrift. „Woran erkennt man einen
Gipfel?" lebt; „Womit faengt eine Kurvendiskussion an?" spricht ueber das Dokument und lebt
in niemandem. Findest du keine lebende Frage, gehoert der Bogen nicht in den Film. Die eine
Ausnahme ist ein Katalog, den das Dokument selbst aufstellt und der Film danach abarbeitet:
dann `"uebersicht": true`, hoechstens einmal je Film und nie als Eroeffnung.

**Oben auf dem Blatt steht der `titel`: der Gegenstand**, als Nominalphrase mit Formel,
„Nullstellen von \(g(x)=2x^2-8\)", „y-Achsenschnittpunkt von \(f\)". Der Autor hat an
Blindtest 5 befunden, dass Fragen als Ueberschrift falsch wirken („Und wo schneidet g die
y-Achse?", „Geht das bei g genauso?"): sie tun, als waere die Frage im Leser jetzt klar,
und sagen nicht, was auf dem Blatt steht. Ein Dokument, das eine Sammlung von Uebersichten
ist, hat keinen Spannungsbogen, den eine Frage vortaeuschen duerfte. Die Frage darf in die
einen Lehrersatz im Fluss; die Ueberschrift nennt die Sache.

Genau ein Beat traegt `"payoff": true`: **er tilgt die Schuld des Bogens**, mit dem Ergebnis,
der Formel, der Stelle im Bild. Ein Satz allein tilgt nichts, eine Uebung prueft nur, was
schon getilgt ist. Nach dem Payoff duerfen Merksatz, Uebung oder Randnotiz stehen, kein neuer
Inhalt; der gehoert in einen neuen Bogen. **Antwort nie vor der Not:** `D_f: x ≠ 4` kommt,
nachdem die 4 in den Nenner geflossen ist und die Null dastand, nicht im ersten Beat.

Ein Bogen hat typisch drei bis fuenf Beats. Ueber fuenf reisst der Ein-Minuten-Puffer des
Lesers; unter drei ist das Blatt kaum aufgebaut, schon wird es abgeloest. **Jeder Beat zeigt
etwas**: ein Beat, der nur aus seinem Satz besteht, ist ein leerer Wisch; der Satz gehoert zu
dem Beat, der etwas zeigt.

Weil das Blatt am Bogenende ganz dasteht und das vorige weg ist: **Reprise statt Verweis.**
Was der Leser braucht und was das Blatt verlassen hat, wird neu gezeigt, nie „wie oben",
„wie wir gesehen haben". Eine Regel steht auf einem Blatt, das mindestens einen ihrer Belege
traegt; muss eine Serie geteilt werden, kommt der letzte Fall als Reprise mit auf das Blatt
der Regel. Und das fertige Blatt muss allein tragen: wer nur Ueberschrift, Formeln, Bild und
Merksatz des Blattes liest, versteht den Bogen; Prosa ist kurzes Bindegewebe, ein Gedanke je
Satz.

## Der Blick: eine Sache nach der anderen

Das Papier hat keine Zeitachse; der Film hat eine. Das ist sein einziger echter Vorteil, und
er heisst nicht Bewegung, sondern **Reihenfolge**: die Ordnung, in der die Dinge erscheinen,
ist der Weg der Aufmerksamkeit, und diesen Weg legst du. Alles Weitere folgt daraus.

**Die Augen koennen keinen Spagat.** Was gleichzeitig an zwei Orten erscheint, verliert
einen von beiden. Darum: in jedem Augenblick eine Sache, und die naechste dort, wo der Blick
schon ist oder einen Schritt weiter unten. Kein fester Streifen, keine Untertitelzeile, kein
Kasten am Rand, zu dem der Blick springen muesste; der Autor hat eine Sprecherzeile unten am
Blatt genau daran gemessen und verworfen.

**Der Lehrersatz steht im Fluss.** `sag` am Beat ist ein kurzer Satz, der an seiner Stelle im
Blatt erscheint, **bevor** kommt, was er ankuendigt: „Dort ist y = 0, also f(x) = 0", dann
die Rechnung; „Der Logarithmus holt das x herunter", dann die Zeile, in der es herunter
faellt. Er bleibt stehen (das Blatt ist der Speicher des Lesers), tritt aber zurueck und wird
leise, sobald der naechste kommt. Nichts rueckt dabei, nichts springt.

**Ein Gedanke, ein Ort.** Der Satz ersetzt die Marke, statt neben ihr zu stehen: „Nullstelle:
an jeder Nullstelle ist y = 0" als Kapitaelchen-Marke *und* derselbe Satz als Lehrersatz sind
zwei Texte an einer Stelle, also ein Spagat. Der Pruefer meldet das.

**Nicht jeder Beat braucht einen Satz.** Wo das Bild oder die Zeile fuer sich spricht,
schweigt der Lehrer; hoechstens drei Saetze auf einem Blatt, sonst liest der Leser, statt zu
sehen. Und jeder Satz kostet Blatthoehe: er ist ein Block wie jeder andere.

Was gesagt werden darf, begrenzt die Treue: **erklaeren ja, hinzufuegen nein.** Der Satz
erklaert den Schritt des Dokuments in den Worten eines Lehrers, im Praesens, wir-Form, nie
voraus („gleich sehen wir") und nie hinterher; er bringt keine Regel, kein Beispiel, kein
Ergebnis, das nicht im Dokument steht. „Nur die Zahl ohne x bleibt uebrig" beschreibt, was
dasteht; „bei dieser Form ist der y-Achsenschnittpunkt immer die Zahl ohne x" ist eine Regel,
die das Dokument nicht aufstellt.

Der Autor hat an Blindtest 5 befunden, er sei „ein bisschen lost" gewesen: das Dokument hatte
die Saetze („Die Nullstelle ist der Schnittpunkt einer Funktion mit der x-Achse", „Wichtig:
Beim Wurzelziehen gibt es immer zwei Loesungen"), der Film hatte sie zu `warum`-Fragmenten
eingedampft. Sie gehoeren in den Fluss, an die Stelle, an der der Blick sie braucht.

## Die Geraete: Beziehungen, die Papier nicht zeigen kann

Papier zeigt Zustaende. Der Film zeigt **woher eine Zahl kommt und wohin sie geht**, und
dass ein Konzept ein Lauf ist. Jedes Geraet zeigt genau eine Beziehung, und ein Geraet kommt
genau dann, wenn das Dokument diese Beziehung enthaelt: kein Geraet ohne Beziehung, keine
Beziehung ohne Geraet. Der Blindfilm 2 setzte `f(4) = 1/(4 − 4)` als Textzeile und schrieb
„kein Zahlenfluss"; falsch, die 4 wird eingesetzt, das ist der Pfeil. Ein erfundener
Grenzuebergang waere der Fehler in der anderen Richtung.

Die Beziehung ist richtungsfrei: Formel zu Formel, Formel zu Bild, Bild zu Formel; auch ein
Testwert wird eingesetzt. Die Miniaturen kommen aus fremden Themen, damit du die Beziehung
erkennst und nicht die Oberflaeche des Beispiels suchst.

| Beziehung, die der Leser sonst im Kopf herstellen muesste | Geraet | Miniaturen |
|---|---|---|
| eine Zahl wird in eine Klammer eingesetzt | `pfeil` von der Quelle, im Seitenrand entlang, **von oben in die Klammer** auf die eingesetzte Zahl | Definitionsbereich: die 4 aus `x = 4` fliesst in `f(4) = 1/(4 − 4)`, der Nenner wird null. Nullstellen: `x₁ = 2` aus der p-q-Formel fliesst in `f(2)` zur Probe |
| dieselbe Zahl wird mehrfach eingesetzt | ein Stamm, mehrere Aeste: `pfeil` mit `von: {"pfeil": id}` | Extrempunkte: `x₁` in `f''(x₁)` und in `f(x₁)`. Integral: die Grenze 3 in `F(3)` und in die Flaechenformel |
| eine Zahl bekommt einen Ort im Bild, oder ein Ort wird eine Zahl | `flug` vom Chip zur Achsenmarke (`kandidat`, auf der x-Achse oder mit `achse:"y"` an der y-Achse) oder in einen leeren Chip einer Zeile | Wertebereich: die −1 aus `T(−1\|−1)` fliegt in `y ≥ −1`. y-Achsenschnitt: die −8 aus `g(0) = −8` fliegt zur y-Achse, dann landet der Punkt |
| **ein Term wird umgebaut: seine Teile wandern an neue Plaetze** | `umformung` Zeile fuer Zeile, wie der Schueler schreibt, jede Zeile aus Chips, mit `wege` von der vorigen Zeile und `| +8` rechts; ein Weg bewegt (`[von, zu]`), verwandelt unterwegs (`wird`: −4 wird 4, x² wird x) oder streicht (`weg`: das e beim Logarithmieren). Bruch `{bruch}` und Hochzahl `{hoch}` sind aus Chips gebaut, damit Zaehler, Nenner und Exponent wandern koennen | siehe die Grundformen unten |

**Die Grundformen des Umbaus.** Jede Umformung, die ein Schueler Zeile fuer Zeile schreibt,
ist eine Bewegung ihrer Teile; der Film zeigt sie als Uebergang zwischen zwei Zeilen, die
beide stehen bleiben. Welcher Teil sich bewegt, entscheidet der Kontext: die Beziehung, die
der Leser sich sonst im Kopf herstellen muesste, und nur die.

- Seitenwechsel: der Term wandert ueber das Gleichheitszeichen und kippt dabei (`wird`:
  `−8` wird `8`, `·2` wird `:2`); rechts steht `| +8`, `| :2`.
- Beide Seiten teilen, Wurzel ziehen, quadrieren, logarithmieren: jede Seite wandert an
  ihren Platz und `wird` dabei (`2x²` wird `x²`, `4` wird `±2`; `e^x` verliert sein e, das
  gestrichen wird, und das x faellt aus dem Exponenten herunter); rechts `| √`, `| ln`.
- Ausklammern: aus `x³` und aus `4x` **loest sich je ein x heraus** (`zieht`) und beide
  treffen sich vor der Klammer (`takt` 0); im selben Zug wird `x³` zu `x²` und `4x` zu `4`
  und wandert in die Klammer (`takt` 1). Keine Zwischenzeile `x·x² − x·4`: sie zerreisst die
  Verbindung zur Ausgangszeile, der Autor hat sie darum verworfen. Ausmultiplizieren
  umgekehrt: der Faktor vor der Klammer fliegt zu jedem Summanden, zwei Wege aus einer Quelle.
- Zusammenfassen gleicher Terme: `3x` und `5x` treffen sich und werden `8x`.
- Kuerzen: derselbe Faktor oben und unten wird gestrichen (`weg`), im Bruch aus Chips.
  Erweitern: der Faktor erscheint oben und unten als Rest.
- Substitution: jedes `x²` wird `u`; Ruecksubstitution umgekehrt.
- Potenzregel beim Ableiten: der Exponent kommt als Faktor nach vorn (Kopie fliegt) und
  wird im Exponenten um eins kleiner (`wird`). Kettenregel: die innere Ableitung tritt als
  Faktor hinten an (Rest). Potenzgesetze: zwei Exponenten treffen sich zu ihrer Summe.
- Binomische Formeln und quadratische Ergaenzung: a und b wandern in Quadrate und
  Doppelprodukt; `(p/2)²` erscheint zweimal, plus und minus.
- Teilweises Wurzelziehen: aus `50` loest sich die `25` als `5` heraus und tritt vor die
  Wurzel (`zieht` mit `wird`), die `2` bleibt darunter stehen. Die Wurzel ist dafuer aus
  Chips gebaut: `{wurzel:[...]}`.
- **Ablesen** ist auch ein Herausloesen, nur ohne Rechnung: eine Zahl steckt schon in der
  Form und geht an ihren neuen Platz. `p` und `q` loesen sich aus `x² − 6x + 8` und stehen
  darunter als `p = −6`, `q = 8`; der Scheitel loest sich aus `(x − 3)² − 4` und wird
  `S(3|−4)`, wobei das Vorzeichen beim Lesen kippt (`zieht` mit `wird`); ebenso Steigung und
  Achsenabschnitt aus `y = mx + b`. Die Ausgangszeile bleibt dabei stehen, denn sie ist die
  Form, in der man liest.
- Einsetzen einer Zahl aus einer weiter oben stehenden Zeile bleibt der `pfeil` (durch den
  Seitenrand, von oben in die Klammer); der Umbau ist der Uebergang zwischen Nachbarzeilen.

Nicht alles wandert. Eine Zeile, deren Uebergang der Leser im Kopf hat (`9 − 4 = 5`), steht
einfach da; ein Umbau, dessen Beziehung du nicht in einem Satz nennen kannst, ist
Dekoration.
| eine Stelle ist noch kein Punkt | `kandidat` auf der x-Achse, `aufstieg` hebt sie zur Hoehe, `punkt` landet | y-Achsenschnitt: die 0 steigt zu `f(0)`. Wendepunkt: `x_w` wartet an der Achse, bis `f(x_w)` ihn hebt |
| wie das Bild an der Stelle aussieht | `kappe` auf dem Kurvenstueck, ∩ oder ∪, mit dem Wortlaut des Dokuments | Kruemmung: `f'' > 0` als ∪. Wendepunkt: zwei Kappen derselben Farbe, links ∩, rechts ∪, denn gezeigt wird der Wechsel |
| ein Konzept ist selbst ein Lauf | `fahrt`: x laeuft mit dem Rad, die Tangente faehrt, m laeuft mit | Steigung: m wird 0 am Gipfel und im Tal. Grenzwert: x wandert nach rechts, `f(x)` naehert sich der Asymptote |
| eine Zahl ist im Bild eine Stelle | `wert`: Formelzeile und Hilfslinie im Graphen zugleich | Definitionsbereich: `f(0) = 4` als Zeile und als Punkt. Ableitung: `f'(2) = 4` als Zahl und als Steigung dort |
| zwei Funktionen haengen an derselben Stelle zusammen | `doppelgraph` mit `binden`: zwei Systeme uebereinander, ein senkrechter Strich | Ableitung: wo f' die Achse schneidet, ist die Tangente an f waagerecht. Stammfunktion: Flaeche unter f wird Hoehe von F |
| eine Naeherung laeuft auf einen Grenzfall zu | `bildfolge`: jede Stufe kommt und geht, das Grenzbild bleibt | Differenzenquotient: Sekanten mit h = 1, 0,5, 0,1 werden zur Tangente. Integral: Balken werden feiner |
| ein Stueck Kurve wird unter der Lupe gerade | `zoomfolge`: stufenlos in eine Stelle hinein | lokale Linearitaet an `x = 1`. Kruemmung: die Parabel wird bei genuegend Zoom eine Gerade |
| zwei Zeilen gehen auseinander hervor, hin und zurueck | `paar`: beide Zeilen, beide Wege, korrespondierende Teile gleichfarbig | Ableiten und Aufleiten von `x³` und `3x²`. Ausmultiplizieren und Faktorisieren |
| dasselbe Verfahren an neuen Zahlen | `serie`: eine Vorlage, viele Faelle, identische Choreographie | Nullstellen: vier Funktionen, je p-q-Formel. Definitionsbereich: vier Nenner, je Nenner gleich null |

Wo das Dokument einen Graphen zeigt oder beschreibt, gehoert ein Bild hin; ein Kapitel ueber
Kurven aus Text hat den Gegenstand verfehlt.

**Bewegung dort, wo der Leser sich etwas nicht selbst denken kann.** Das Simulat des
Blindfilms 2 hat gemessen: die Umformung `4 − 4 = 0` als eigene Zeile brachte nichts, der
Leser hatte sie im Kopf; die Parabel, die sich zeichnet, war Dekoration; der Graph von
`x⁴ − 2x²`, den er sich nicht vorstellen konnte, trug, ebenso Linie und Schraffur am Bild.

Vier Lehren des Autors zu den Geraeten:

- **Farbe sitzt auf der Zahl, die wandert, sonst nirgends.** Eine Farbe je Kandidat: auf der
  Stelle, ihren Einsetzungen, ihrem y-Wert, ihrem Punkt. Nie auf ganzen Zeilen, nie auf Text,
  nie auf einem Punkt, dessen Zahl in keiner Klammer und keiner Achsenmarke steht. Farbe ist
  ein Zeiger; zeigt sie auf alles, zeigt sie auf nichts.
- **Der Pfeil muendet von oben in die Klammer.** Er bedeutet „diese Zahl kommt hier hinein";
  Zeilenanfang ist nie ein Ziel. Ein Ziel darf `\pm 1` oder `\pm\sqrt{\frac{1}{3}}` sein, wenn
  das Dokument beide Kandidaten in einer Zeile behandelt; dann enden beide Pfeile dort.
- **Eine teure Bewegung einmal, in der Serie nur das Muster.** Das Zusammenfliegen des
  Ergebnisses aus seinen Herkunftszahlen gehoert ins erklaerte Beispiel; in der Serie bleiben
  Pfeile, Kappen, Aufstieg, die Ergebniszeile erscheint nur noch.
- **Jedes bewegte Element zeigt eine benannte Beziehung.** Kannst du sie nicht in einem Satz
  nennen, fliegt das Element. Der Satz steht im Storyboard.

Eine Formelzeile ist dafuer eine `zeile` aus Chips: nur die eingesetzte Zahl bekommt Kennung,
Farbe und ist Pfeilziel; die Formel drum herum ist eine enge Gruppe `["!eng", ...]`. Eine
Zeile, die das Dokument einzeilig schreibt (`h''(x) = -6x = 0 ⟺ x₁ = 0`), darf der Film in
Schritte zerlegen. `beispiel-extrempunkte.json` ist das Mass: acht Blaetter des Autors mit
Chips, Stamm und Aesten, Serie aus einer Vorlage. Lies es ganz, bevor du giesst; es ist kein
Formular, ein anderes Dokument hat einen anderen Fluss. `beispiel-parabel.json` zeigt
`bildfolge`, `zoomfolge`, `doppelgraph` und `binden` im Einsatz.

**Die Werkbank.** `beispiel-werkbank.json` ist kein Dokumentfilm, sondern der Pruefstand:
fuenfzehn Blaetter, jedes eine Bewegung an richtiger Mathematik, von Ausklammern und Ablesen
ueber teilweise Wurzel, Potenzregel, Kuerzen, dritte binomische Formel rueckwaerts,
Substitution und Scheitel bis zu Flug, Aufstieg, Fahrt, Doppelgraph, Bildfolge und Tabelle.
Schlag dort nach, wenn du wissen willst, wie ein Geraet aussieht, das dein Dokument
verlangt. Sie traegt `"frei": true`, weil sie kein Quelldokument hat; jeder Film aus einem
Dokument braucht sein Inventar.

## Zwei Wege und das Ende der Rechnung

**Die Gabel.** Wo eine Gleichung in zwei Faelle zerfaellt, zeigt der Film das als Gabel:
zwei Pfeile schraeg nach links und rechts, darunter zwei Spalten, die unabhaengig
weiterrechnen. Satz vom Nullprodukt (`x·(x²−4) = 0` gibt `x₁ = 0` und `x²−4 = 0`),
Fallunterscheidung beim Betrag, plus und minus nach der Wurzel, zwei Nenner beim
Definitionsbereich. Der Leser sieht in einem Bild, dass es zwei Wege gibt und dass **beide
gelten**; eine Liste untereinander sagt das nicht. Hier erscheinen die beiden Aeste Reihe fuer
Reihe gemeinsam: sie tun dasselbe, das ist eine Sache, kein Spagat.

**Die Endloesung wird doppelt unterstrichen** (`"loesung": true`). Der Leser muss sehen,
welche Zeile fertig und brauchbar ist, und welche nur ein Zwischenschritt war. Dabei gilt:
**Symbol und Wert stehen nebeneinander**, der Rechenweg steht in der Zeile darueber.
`y = f(2) = 2² − 5 = −1` ist keine Endloesung, sondern ein Weg; er endet mit `= y`, und
darunter steht `−1 = y`, doppelt unterstrichen. Ebenso `x₁ = 3+2 \quad x₂ = 3−2` als Weg und
`x₁ = 5 \quad x₂ = 1` als Endloesung. Der Pruefer meldet eine Rechnung ohne Endloesung und
eine Endloesung, in der noch gerechnet wird.

## Serie und Muster

Nach dem erklaerten Beispiel kommt die Serie. Wo das Dokument „Weitere Beispiele" hat, ist
sie Pflicht, nie Kuerzungsmasse. In ihr bleibt genau das Muster konstant, alles andere
variiert, und die Notation bleibt in jeder Zeile dieselbe ungekuerzte Gestalt, auch im
Trivialfall: aus 4x wird 4x²/4, aus x wird 1x²/1; gekuerzt wird erst hinter einem
angehaengten Gleichheitszeichen. Eine `tabelle` als Serie traegt darum eine Spalte mit dem
Schritt, der die Regel ist: Funktion | Nenner gleich null | Loesung; „Aufgabe, Ergebnis"
zeigt kein Muster.

Frage dich, welche falsche Regel jemand aus den Beispielen abstrahieren koennte („der
Wertebereich ist immer nach unten begrenzt", „der Extrempunkt liegt immer bei null"). Liegt
im Dokument ein Beispiel, das sie bricht, stelle es so, dass es sichtbar bricht. Liegt keines
da, erfindest du keines; du vermerkst die Luecke in der Beiakte. Ein Film ohne einen
einzigen Merksatz konsolidiert nichts.

## Treue

- **Nur die Notation des Dokuments.** Schreibt es `\in` und `\mathbb{R}`, schreibst du das
  auch; schreibt es das nicht, erfindest du es nicht.
- **Nichts hinzufuegen:** kein Beispiel, keine Zwischenrechnung, keine Regel, keine
  Begruendung, die nicht im Dokument steht. Reihenfolge und Betonung sind deine.
- **Nichts durch Auslassung verfaelschen.** Zaehlt das Dokument dreizehn Gesichtspunkte,
  sagt der Film nicht „vier". Das Inventar ist der Vertrag.
- **Bildelemente, die die lebende Frage nicht braucht, fallen**, auch wenn das Dokument sie
  zeigt: der Goldfilm liess `W(0|0)` im ersten Blatt weg, weil die Frage der Gipfel war. Das
  ist Fuehrung; was faellt, steht im Inventar.
- **Keine Meta-Beats,** kein Satz ueber fehlenden Inhalt, keine Entschuldigung.

Endet ein Abschnitt des Dokuments ohne Aufloesung, geht Treue vor Bogenschluss. Zwei
Auswege, in dieser Reihenfolge: die Aufloesung ist das Sehen selbst (der Payoff zeigt am
Bild, was zu sehen ist, ohne einen Satz zu behaupten, der nicht dasteht), oder `jetztihr`
macht die offene Stelle zur Aufgabe, deren Loesung die Rechnung des Dokuments zu Ende
fuehrt. Lieber ein Bogen weniger als eine erfundene Regel.

## Sprache

Anrede ihr. Ein Gedanke je Satz, hoechstens ein Nebensatz. Keine Gedankenstriche, keine
Konstruktion „nicht x, sondern y", kein Gendern, Dezimalkomma, Fachwoerter beim ersten
Auftreten im Halbsatz erklaert. Der Film spricht nie ueber sich: kein „Film", „Blatt",
„Animation", „wischen", „der Finger faehrt", und keine Ankuendigung wie „Nun folgt", „Jetzt
kommt", „Wir sehen". Der Blindfilm 1 setzte „Der Finger faehrt als x ueber die Kurve" als
Satz; das war eine Anweisung aus diesem Skill.

## Ablauf

### 1. Seiten ansehen

`Read` mit `pages` liest PDF-Seiten als Bilder, hoechstens 20 je Aufruf; sonst
`pdftoppm -r 110 -jpeg -jpegopt quality=80 dokument.pdf seite` und die Bilder lesen. Viele
Mathematik-PDFs haben keine Textebene. **Du bist die Bilderkennung.** Was du nicht
herausliest, existiert im Ergebnis nicht.

### 2. Inventar, wortgetreu, vor allem anderen

Seite fuer Seite alles, was dasteht: jede Formel als LaTeX, jede Tabellenzeile, jeder Satz mit
Regel oder Begruendung, jeder Graph mit Funktion, Achsen, Punkten, Linien, jede Ueberschrift.
Es entsteht vor dem ersten Gedanken an Boegen, denn ein Inventar, das nach dem Film entsteht,
enthaelt genau das, was der Film zeigt, und der Pruefer ist blind.

Es wird die Datei `INVENTAR.md` neben dem Film und geht unverkuerzt in das Feld `inventar`
mit Seitenmarken (`S1: … S2: …`); der Pruefer sucht jedes Element darin im Film und meldet
Seiten ohne Marke. Nachbarabschnitte auf denselben Seiten, die nicht Gegenstand des Auftrags
sind, stehen in `INVENTAR.md` vollstaendig mit dem Vermerk „nicht Gegenstand" und im Feld nur
als Zeile ohne Formeln („S30 oben: Kruemmung, nicht Gegenstand").

### 3. Lernreise, fuenf Zeilen

Nicht die Seitenreihenfolge, sondern die Kette der Begreif-Schritte: Wo ist die Huerde (nicht
„Definitionsbereich", sondern „warum eine harmlose Zahl die Formel kippen laesst")? Welche
Frage lebt an welcher Stelle; jede wird ein Bogen. Welcher Schritt traegt das Ganze; er
bekommt das teure Geraet. Was ist blosse Aufzaehlung; ein Beat, nie ein Bogen. Und eine Zeile
sagt, wo die Filmordnung von der Dokumentordnung abweicht, oder stellt fest, dass die
Dokumentordnung schon die Lernordnung ist.

### 4. Storyboard, eine Zeile je Bogen

Zwischen Reise und Guss lag die Luecke des Blindfilms 2: die Reise nannte die Huerde richtig,
der Film zeigte sie statisch. Darum je Bogen eine Zeile: Frage, Beziehung, Geraet, Payoff.
So sieht eine aus:

> Bogen 2. Frage: Warum darf man die 4 nicht einsetzen? Beziehung: die 4 aus `x = 4` fliesst
> in die Klammer von `f(4)`, der Nenner wird 0. Geraet: `pfeil` in die Klammer, `zeile` mit
> der 4 als Chip. Payoff: die Null im Nenner, dann erst `D_f: x ≠ 4`.

Dafuer gehst du jede Gleichung des Bogens durch die Tabelle: welche Zahl bewegt sich, woher,
wohin. Eine Gleichung, bei der du dreimal „keine" antwortest, steht statisch; ein Bogen ohne
Geraet ist erlaubt, ein Bogen ohne diesen Durchgang nicht.

### 5. Giessen

Lies `REFERENCE.md` (Format, Operationen, `expr`). Schreibe aus dem Strang, nicht aus einer
Liste: simuliere den Kopf des Lesers durch das Dokument, was er hier weiss, welche Frage in
ihm lebt, was er sieht, wie schwer er traegt. Je Bogen ein `titel`, Lehrersaetze (`sag`)
nur dort, wo der Blick sie braucht; Rechnungen als `umformung` Zeile fuer Zeile mit `wege`,
wo die Beziehung es verlangt.

### 6. Pruefen

```
node pruefe.mjs film.json player.html            # Befunde gegen die Gesetze
node pruefe.mjs film.json player.html --hoehe    # dazu das Hoehenmodell je Bogen und Beat
node lauf2.mjs film.json player.html             # ganze Radstrecke im Spieler, 0 Fehler
```

`lauf2.mjs` braucht `jsdom` (`npm install jsdom`). Der Pruefer meldet Befunde, kein Lob;
jeder schwere Befund wird behoben. Ein Qualitaetsmangel wird nie am Satz repariert: giesse
den Bogen neu.

### 7. Schueler-Simulat

```
node transkript.mjs film.json > TRANSKRIPT.md
node simulat/simulat2.mjs init LAUF film.json simulat/WISSEN-<thema>.json simulat/TRANSFER-<thema>.json simulat/FEHLREGELN-<thema>.json --thema "<Thema>"
```

Das Transkript ist der Film, wie ein Leser ihn am Handy erlebt; es liegt dem Film bei. Das
Simulat liest ihn als Schueler mit nichts als der Whitelist: je Blatt startest du EINEN
frischen Agenten, der nur `LAUF/prompt-NN.md` liest und sein JSON nach `LAUF/antwort-NN.json`
schreibt, dann `node simulat/simulat2.mjs antwort LAUF NN LAUF/antwort-NN.json`; nach dem
letzten Blatt dasselbe mit `regel`, dann `bericht`. Du selbst liest den Film dabei nicht als
Schueler; ein Kopf, der den Film gegossen hat, misst nichts. Fehlt fuer das Thema eine
Whitelist oder Transferaufgabe, schreibst du sie vor dem ersten Blatt (README in `simulat/`):
Vorwissen laut Buchreihenfolge ohne den Loesungsweg des Themas, zwei Aufgaben derselben Sorte,
die nicht im Film stehen. `BERICHT.md` sagt, ob der Transfer bestanden ist, welche Fehlregel
ungebrochen blieb, was der Schueler nicht deuten konnte und wo er glauben musste. Jeder
Befund erster Klasse geht zurueck in den Guss, als Neuguss des Bogens.

### 8. Abgabe

Die Datei nennt ihre Seiten (`"seiten": ["dokumente/…/seite-09.jpg", …]`, je Bogen `"seite": n`),
damit der Leser mit einem Wisch nach links die Dokumentseite zum Vergleich sieht.

Neben `film.json`: `INVENTAR.md`, `TRANSKRIPT.md`, `BERICHT.md` des Simulats, `BEIAKTE.md` mit Lernreise, Storyboard,
den Grundkonzepten des Abschnitts (was Verstaendnis konstituiert, keine Rechenschritte) und
den vermerkten Luecken. Fuer studienkolleg.me: Datei nach `filme/`, eine Zeile in
`index.html`. Antworte dem Nutzer mit der Lernreise und einem Satz, was entstanden ist. Kein
Prozessbericht, keine Lobprosa.

## Die Warnung

Kopierte Form ohne ihren Grund ist Nachahmung und faellt durch. Jedes Mittel dieses Skills
ist Ausdruck der Zielfunktion; kannst du zu einem Mittel nicht in einem Satz sagen, welche
Beziehung es zeigt, lass es weg.
