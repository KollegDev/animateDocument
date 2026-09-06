---
name: blattkino
description: Verwandelt ein Dokument in eine scrollgesteuerte, didaktisch gefuehrte Fassung, in der Formeln sich aufbauen, Rechnungen als Bewegung laufen und Graphen sich zeichnen, waehrend man an ihnen vorbeiscrollt. Nutze diesen Skill, wenn aus einem PDF, Arbeitsblatt, Skript oder Aufgabenblatt eine Animation, ein Lehrfilm, ein Video oder eine erklaerende Fassung werden soll, oder wenn "Blattkino" genannt wird. Funktioniert auch mit gescannten oder gerasterten PDFs ohne Textebene, weil die Seiten angesehen werden.
---

# Blattkino

**Version 2.4 (2026-09-06).** Jeder Film traegt diese Nummer im Feld `"skill"`.

Aenderungsprotokoll (Version, Datum, Anlass):
- 2.4, 2026-09-06: nach den Beiakten von Trial 4 und 5: LaTeX-Glaettung im Inventarabgleich
  (`\pm\sqrt{}`, verschachtelte Klammern), `pruefe --hoehe`, `lauf2` im Skill-Ordner, Feld
  `skill`, Inventar-Feld gegen `INVENTAR.md` abgegrenzt, zwei Kappen am Wendepunkt.
- 2.3, 2026-09-06: nach Trial 2 und 3 (P6, G6): Storyboard als Pflichtschritt, Katalog
  richtungsfrei mit Miniaturen, Simulat als Abgabebedingung, `transkript.mjs`, Lexika fuer
  Plan-Leak und Regieanweisung, Farbe ohne Beziehung. Trials 4 und 5.
- 2.2, 2026-09-05: nach Trial 2 (Autorbefund): Inventar zuerst, jeder Beat zeigt etwas,
  hoechstens eine Uebersicht, jedes Einsetzen ein Pfeil, Strecke je Stueck. Trial 3.
- 2.1, 2026-09-05: Goldgeraete und Spieler v2. Trials 1 und 2.
- 1.x, 2026-09-04: Spieler v1 (`gewicht`, `fokus`). Abgeloest.

## Was hier entsteht

Eine einzelne HTML-Datei. Kein Konto, keine Anmeldung, kein Server. Man scrollt, und
dabei baut sich das Dokument auf: Saetze erscheinen in Leserichtung, Formeln setzen
sich, Rechnungen laufen Zeile fuer Zeile mit ihrem Grund, Graphen bleiben stehen und
zeichnen sich, waehrend der Text an ihnen vorbeizieht.

Das Ergebnis deiner Arbeit ist **eine JSON-Datei**. Der Spieler ist fertig und wird
nicht angefasst.

## Wozu ueberhaupt animieren

Ein Dokument statisch zu scrollen kann jeder Browser. Der einzige Grund fuer den
Aufwand ist, dass die Animation **fuehrt**: sie bringt den Blick in die Reihenfolge, in
der man verstehen muss, sie haelt dort an, wo es schwer ist, und sie tritt zurueck, wo
es leicht ist. Sie ist der sichtbare Ausdruck davon, dass du den Stoff verstanden hast.

Ohne diese Absicht ist sie Dekoration und schlechter als das PDF.

## Die Zielfunktion

Guete ist **Ertrag geteilt durch Aufwand plus Schuldenlast**.

Ertrag ist, was der Leser danach versteht und kann. Aufwand ist Lesezeit und geistige
Last. Schulden sind offene Posten mal Strecke bis zur Tilgung. Daran entscheidet sich
jeder Zielkonflikt, auch die Wahl der Ausdrucksmittel. Ein Mittel, das nicht mehr
Ertrag bringt, als es Aufwand kostet, kommt nicht vor.

## Der Leser, physikalisch

Studienkollegiat, Deutsch etwa B2. Kurze Saetze tragen ihn, verschachtelte kosten ihn.

Sein Arbeitsgedaechtnis haelt drei bis vier ungefestigte Dinge, und was darin liegt,
haelt etwa eine Minute. Danach ist es weg. Er kann sich nichts vorstellen, was die
Seite nicht zeigt. Er rechnet nur mit, wenn es billig ist. Er ueberfliegt zuerst.

Und er lernt durch Musterabstraktion, nicht durch Logikverarbeitung. Ein erklaertes
Beispiel erzeugt nur eine Ahnung. Das Muster entsteht erst ueber eine Serie.

## Die Bauform: eine Buehne, kein langes Blatt

Die Seite scrollt nicht. Sie bewegt sich nie um einen Pixel.

Ueber dem Bild liegt eine durchsichtige Flaeche, das **Rad**. Wischen bewegt nur diese
Flaeche, und ihr Stand ist der Fortschritt der Animation.

Davor steht ein **Tor**: Titel, Quelle, ein Knopf. Vorher laeuft nichts. Auf dem Handy
startet der Knopf ins Vollbild, weil die Wischgeste sonst dauernd die Adresszeile des
Browsers hervorholt und das Bild springt. Unten rechts fuehrt ein Kreuz wieder hinaus.
Titel und Quelle stehen also im Tor, nicht in einer eigenen Szene. Gesehen wird immer dieselbe
stehende **Buehne**: oben die lebende Frage des Bogens, darunter das Bild, darunter der
Text. Nichts wandert nach oben aus dem Bild. Es wird abgeloest.

- Ein **Bogen** wird ein **Blatt**, und ein Blatt ist genau ein Bildschirm.
- Das Blatt **fuellt sich von oben nach unten**. Jeder Beat legt seine Bloecke dazu, an
  ihrem endgueltigen Platz; es rutscht nichts nach, weil der Platz von Anfang an steht.
- **Was einmal dasteht, bleibt stehen**, bis der Bogen zu Ende ist. Das Erscheinen trennt
  die Gedankenschritte voneinander, das Stehenbleiben gibt Orientierung. Das Blatt ist
  der ausgelagerte Speicher des Lesers, nicht nur eine Buehne.
- Erst am Ende des Bogens loest das naechste Blatt das alte ab.
- Ein **Bild** ist ein Block im Blatt wie jeder andere und bleibt ebenso stehen.
- Die Abstaende zwischen den Bloecken werden so gerechnet, dass die Bildhoehe wirklich
  aufgebraucht wird. Rechts laeuft ein senkrechter Balken mit: er zeigt, dass gewischt
  wird und wie weit es noch ist.

Daraus folgt eine harte Grenze, die es auf Papier nicht gibt: **ein Bogen muss auf einen
Bildschirm passen.** Alles, was in ihm vorkommt, steht am Ende gleichzeitig da. Was nicht
passt, wird einmal verkleinert; wird es zu klein, war der Bogen zu voll. `pruefe.mjs`
rechnet die Hoehe aus und nennt die Zahl.

**Jedes Stueck kostet dieselbe Strecke am Rad.** Ein Beat ist so lang, wie er Inhalt hat:
`0,2 + 0,11 · Summe der dauer` Bildschirme, mindestens 0,35, hoechstens 1,6. Ein Wisch
bringt so immer etwa gleich viel Neues; ein Beat aus einer Zeile laeuft nicht leer, ein Beat
mit Graph und drei Zeilen hat Platz. Keine Ruhezonen: die Stuecke kacheln die Strecke
lueckenlos (GL3). Wer verweilen will, haelt die Hand still. `gewicht` gibt es nicht mehr;
der Pruefer meldet es als ueberfluessig.

Der Ein-Minuten-Puffer wird damit zaehlbar: **ein Bogen sollte nicht mehr als fuenf Beats
bis zur Aufloesung brauchen.**

## Was das Rad kann, was Papier nicht kann

Drei Rohstoffe, mehr gibt es nicht:

- **Steuerbare Zeit.** Der Leser bewegt einen umkehrbaren Parameter. Daraus entstehen
  Reihenfolge, Tempo und Rueckschritt.
- **Bleibender Raum.** Etwas kann stehen bleiben, waehrend anderes dazukommt.
- **Stetige Verwandlung.** Ein Ding kann sich aendern, statt ersetzt zu werden.

Der Ein-Minuten-Puffer wird dadurch **messbar**: eine Szene hat eine Strecke am Rad, und
`pruefe.mjs` rechnet nach, ob ihre Aufloesung rechtzeitig kommt.

Aus diesen drei Rohstoffen kommen vier Geraete, fuer die Papier mehrere starre Bilder
nebeneinander braucht, die der Leser selbst zusammenrechnen muss:

- **`wert`** setzt eine Zahl gleichzeitig in die Formel und ins Bild. Das behebt die geteilte
  Aufmerksamkeit, die entsteht, wenn f'(2) nur als Zeichen dasteht und nirgends als Stelle.
- **`doppelgraph`** mit **`binden`** stellt zwei Systeme uebereinander und verbindet dieselbe
  Stelle durch einen senkrechten Strich. Das ist das Geraet, mit dem man f und f' zusammendenken
  lernt; auf Papier stehen dafuer zwei Bilder da und der Zusammenhang bleibt Behauptung.
- **`bildfolge`** laesst eine Naeherung ablaufen: jede Stufe kommt, bleibt kurz, geht wieder,
  nur das Grenzbild bleibt stehen. Der Leser sieht die Bewegung statt vier eingefrorener Zustaende.
- **`zoomfolge`** faehrt stufenlos in eine Stelle hinein, bis die Kurve ihre Beruehrgerade ist.
  Auf Papier braucht das drei starre Lupen und den Satz, man moege sich den Rest denken.

Dazu kommt das **Paar**: zwei Zeilen, die auseinander hervorgehen, mit beiden Wegen
dazwischen (`paar`). Ableiten und Integrieren, Potenzieren und Wurzelziehen,
Ausmultiplizieren und Faktorisieren. Man sieht Hinweg und Rueckweg zugleich, und die
korrespondierenden Teile tragen dieselbe Farbe. Wo das Dokument eine Umkehrbeziehung
zeigt, gehoert das Paar hin.

**Wo das Dokument einen Graphen zeigt oder beschreibt, gehoert ein `plot` hin.** Ein
Kapitel ueber Kurven, das nur aus Text besteht, hat den Gegenstand verfehlt. Und wo ein
Funktionswert benutzt wird und ein Bild dasteht, gehoert `wert` hin: die Zahl ist im Bild
eine Stelle. Der Pruefer meldet beides.

Diese vier sind kein Schmuck. Wer sie einbaut, weil sie sich gut bewegen, baut Mimikry.
Sie gehoeren dorthin, wo der didaktische Gegenstand selbst eine Bewegung ist.

**Bewegung dort, wo der Leser sich etwas nicht selbst denken kann.** Das Simulat des
Blindfilms 2 hat es gemessen: die Umformung `4 − 4 = 0` als eigene Zeile „bringt fast
nichts", der Leser hatte sie im Kopf; die Parabel, die sich zeichnet, war Dekoration. Was
trug: der Graph, den er sich nicht vorstellen konnte (x⁴ − 2x²), die Linie und die
Schraffur am Bild, die Nachdenkpause vor der Loesung. Trivialschritte bekommen keine
Bewegung. Die 4, die in die Klammer fliegt und den Nenner zu null macht, bekommt eine.

**Sie sind alle vier freiwillig.** Ein Dokument ueber Definitionsbereiche rechnet keine
Grenzuebergaenge und braucht keine Zoomfolge. Aber Vorsicht mit dem Umkehrschluss: fast
jedes Dokument setzt irgendwo eine Zahl in eine Formel ein, und jedes Einsetzen ist ein
`pfeil` in die Klammer. „4 eingesetzt, Nenner wird null" ist der Musterfall. Wer es als
Textzeile setzt, hat die Beziehung dem Leser ueberlassen. Ein Film ganz ohne diese Geraete ist in
Ordnung; ein Film mit einem erfundenen Grenzuebergang ist es nicht. `wert` gilt, sobald
das Dokument selbst einen Funktionswert benutzt und ein Bild dazu da ist. Benutzt es
keinen, gibt es nichts zu zeigen.

## Die Geraete des Goldlaufs: Zahlen, die wandern

Der Autor hat mit der Gold-Session den Massstab gebaut (`beispiel-extrempunkte.json`,
acht Blaetter Extrempunkte). Daraus kommen Geraete fuer eine Beziehung, die Papier nie
zeigen kann: **woher eine Zahl kommt und wohin sie geht.** Ein Verfahren wie
„notwendige Bedingung, hinreichende Bedingung, y-Wert" ist ein Fluss von Zahlen zwischen
drei Zeilen. Auf Papier muss der Leser den Fluss im Kopf herstellen. Im Film sieht er ihn.

Jedes Geraet zeigt genau eine Beziehung. Die Beziehung ist **richtungsfrei**: eine Zahl,
die an einer Stelle steht, taucht an einer anderen auf, und der Film zeigt den Weg, gleich
ob Formel zu Formel, Formel zu Bild oder Bild zu Formel. Auch ein Testwert wird eingesetzt.
Das ist die Auswahltabelle, je Geraet mit zwei Miniaturen aus fremden Themen, damit du die
Beziehung erkennst und nicht die Oberflaeche des Beispiels suchst:

| Beziehung, die der Leser sonst im Kopf herstellen muesste | Geraet | Miniaturen |
|---|---|---|
| eine Zahl wird in eine Klammer eingesetzt, gleich woher sie kommt | `pfeil` von der Quelle, im Seitenrand entlang, **von oben in die Klammer** auf die eingesetzte Zahl | Definitionsbereich: die 4 aus `x = 4` fliesst in `f(4) = 1/(4 − 4)`, der Nenner wird null. Nullstellen: `x₁ = 2` aus der p-q-Formel fliesst in `f(2)` zur Probe |
| dieselbe Zahl wird mehrfach eingesetzt | ein Stamm, mehrere Aeste: `pfeil` mit `von: {"pfeil": id}` | Extrempunkte: `x₁` in `f''(x₁)` und in `f(x₁)`. Integral: die Grenze 3 in `F(3)` und spaeter in die Flaechenformel |
| eine Zahl bekommt einen Ort im Bild, oder ein Ort im Bild wird eine Zahl | `flug` vom Chip zur Achsenmarke (`kandidat`), oder in einen leeren Chip einer Zeile | Wertebereich: die −1 aus `T(−1\|−1)` fliegt in `y ≥ −1`, Bild zu Formel. Nullstellen: `x₁` fliegt in `N₁(x₁\|0)` |
| eine Stelle ist noch kein Punkt | `kandidat` auf der x-Achse; erst `aufstieg` hebt sie zur Hoehe, dann landet `punkt` | y-Achsenschnitt: die 0 auf der x-Achse steigt zu `f(0)`. Wendepunkt: `x_w` steht an der Achse, bis `f(x_w)` ihn hebt |
| wie das Bild an der Stelle aussieht | `kappe` auf dem Kurvenstueck, ∩ oder ∪, beschriftet mit dem Wortlaut des Dokuments | Kruemmung: `f'' > 0` als ∪ auf dem Stueck. Wendepunkt: zwei Kappen in derselben Farbe, links ∩ und rechts ∪ der Stelle, denn gezeigt wird der Wechsel |
| ein Konzept ist selbst ein Lauf | `fahrt`: x laeuft mit dem Rad, die Tangente faehrt, m laeuft mit | Grenzwert: x wandert nach rechts, `f(x)` naehert sich der Asymptote. Steigung: m wird 0 am Gipfel und im Tal |
| eine Zahl ist im Bild eine Stelle | `wert`: Formelzeile und Hilfslinie im Graphen zugleich | Definitionsbereich: `f(0) = 4` erscheint als Zeile und als Punkt. Ableitung: `f'(2) = 4` als Zahl und als Steigung dort |
| dasselbe Verfahren an neuen Zahlen | `serie`: eine Vorlage, viele Faelle, identische Choreographie | Nullstellen: vier Funktionen, je p-q-Formel. Definitionsbereich: vier Nenner, je Nenner gleich null |

Wo das Dokument „Weitere Beispiele" hat, ist die Serie Pflicht, nie Kuerzungsmasse: das
Dokument hat das Muster hineingelegt, der Film nimmt es nicht heraus.

Eine Formelzeile ist dafuer eine `zeile` aus Chips: nur die eingesetzte Zahl bekommt eine
Kennung, eine Farbe und ist Pfeilziel. Die Formel drum herum ist eine enge Gruppe
(`["!eng", ...]`), damit sie nicht umbricht. Ein Pfeilziel ist eine Zahl, auch `\pm 1` oder
`\pm\sqrt{\frac{1}{3}}`, wenn das Dokument beide Kandidaten in einer Zeile behandelt; dann
enden beide Pfeile auf demselben Chip. Eine Zeile, die das Dokument einzeilig schreibt
(`h''(x) = -6x = 0 ⟺ x₁ = 0`), darf der Film in Schritte zerlegen; das ist Betonung, keine
Erfindung. Alles Weitere steht in REFERENCE.md.

Vier Lehren des Autors dazu, jede mit ihrem Grund:

- **Farbe sitzt auf der Zahl, die wandert, sonst nirgends (GL1).** Eine Farbe je Kandidat:
  auf der Stelle, ihren Einsetzungen, ihrem y-Wert, ihrem Punkt. Nie auf ganzen Zeilen,
  nie auf Text. Autorwort: „Farben koennen auch verwirren. Es muss damit vorsichtig
  umgegangen werden." Farbe ist ein Zeiger; zeigt sie auf alles, zeigt sie auf nichts.
- **Der Pfeil muendet von oben in die Klammer (GL2).** Er bedeutet „diese Zahl kommt hier
  hinein". Zeilenanfang ist nie ein Ziel. Autorwort: „Die Pfeile sollen IN die Klammer
  rein zeigen, denn es geht ja um das Einsetzen."
- **Keine Ruhezonen am Rad (GL3).** Jeder Beat kostet dieselbe Strecke, seine Stuecke
  kacheln sie lueckenlos. `gewicht` gibt es nicht mehr. Wer verweilen will, haelt die Hand
  still. Autorwort: „Es ist unangenehm, dass ich das nicht selbst unter Kontrolle habe."
- **Eine teure Bewegung einmal, in der Serie nur das Muster (GL4).** Das Zusammenfliegen
  des Ergebnisses aus seinen Herkunftszahlen gehoert ins erklaerte Beispiel. In der Serie
  bleiben Pfeile, Kappen und Aufstieg; die Ergebniszeile erscheint nur noch. Beim dritten
  Auftreten wird gezeigt, nicht mehr erzaehlt.

Und die Regel ueber allen: **jedes bewegte Element zeigt eine benannte Beziehung (GL6).**
Kannst du sie nicht in einem Satz nennen, fliegt das Element. Diesen Satz schreibst du
je Geraet ins Storyboard (Schritt 4) und in die Beiakte.

Der Umkehrschluss gilt genauso: **eine Beziehung, die im Dokument liegt und kein Geraet
bekommt, ist ein Fehler.** Der Blindfilm 2 hat `f(4) = 1/(4 − 4)` als Textzeile gesetzt und
in der Beiakte „kein mehrstufiger Zahlenfluss" geschrieben. Falsch: die 4 wird eingesetzt,
das ist der Pfeil in Reinform. Der Pruefer meldet eine Umformung, deren Grund „eingesetzt"
sagt, ohne dass sich eine Zahl bewegt.

`beispiel-extrempunkte.json` ist das Mass. Lies es ganz, bevor du das erste Blatt
giesst: dort siehst du, wie ein Verfahren in Chips zerlegt wird, wie Pfeile aus einem
Stamm verzweigen, wie die Serie aus einer Vorlage entsteht. Es ist kein Formular zum
Ausfuellen; ein anderes Dokument hat einen anderen Fluss.

## Die Einheit ist der Bogen

Nicht der Absatz und nicht die Dokumentzeile. Ein **Bogen** ist eine Spannung von ihrer
Oeffnung bis zu ihrer Aufloesung, in einem Zug.

Jeder Bogen traegt eine `frage`: die Frage, die im Leser an dieser Stelle wirklich
lebt. Sie erscheint nicht im Film, sie ist der Grund, warum es den Bogen gibt. Findest
du keine, gehoert der Bogen nicht ins Dokument.

Genau ein Beat traegt `payoff: true`. **Er tilgt die Schuld des Bogens**: die Antwort auf
die lebende Frage, das Ergebnis, die Stelle im Bild. Konsolidierung darf danach stehen
(ein Merksatz nach der Regel, eine Uebung); der Payoff ist die Tilgung, nicht das Letzte.
Eine Uebungsaufgabe allein ist kein Payoff, sie prueft nur, was aufgeloest wurde.

Manche Boegen tragen keine lebende Frage, weil sie eine Uebersicht des Dokuments
wiedergeben (ein Katalog, eine Gliederung). Dann `"uebersicht": true` und `"frage": null`.
Das ist ehrlich; eine erfundene Frage („Womit faengt eine Kurvendiskussion an?") ist es
nicht, denn im Leser lebt sie nicht.

Ein Bogen ist ein Blatt und ein Blatt ein Bildschirm. Typisch drei bis fuenf Beats;
unter drei ist das Blatt kaum aufgebaut, schon wird es abgeloest.

**Jeder Beat zeigt etwas.** Ein Beat, der nur aus seinem Satz besteht, ist ein leerer
Wisch. Ein Payoff, der nur aus einem Satz besteht, tilgt nichts: die Tilgung ist ein
Ergebnis, eine Formel, eine Stelle im Bild. Der Satz gehoert zu dem Beat, der etwas
zeigt, nicht in einen eigenen.

Hoechstens ein Uebersichtsbogen je Film, **nie als Eroeffnung**, und nur, wenn der Film den
Katalog danach abarbeitet. Der Film oeffnet mit einem Gegenstand und einer Frage, die im
Leser lebt (der Goldfilm: der Gipfel). Zwei Uebersichtsblaetter waren im Blindfilm 2 ein
Drittel des Films ohne Lerngegenstand; `uebersicht` ist kein Freifahrtschein fuer tote
Blaetter. Wer nach zwei Blaettern noch nichts gelernt hat, geht.

**Antwort nie vor der Not.** Die Schreibweise `D_f: x ≠ 4` kommt, nachdem der Leser die 4 in
den Nenner hat fliessen sehen und die Null dastand. Steht die Antwort im ersten Beat, gibt
es nichts mehr aufzuloesen, und der Rest des Bogens ist Begruendung im Nachhinein.

## Ablauf

### 1. Seiten ansehen

`Read` mit `pages` liest PDF-Seiten als Bilder, hoechstens 20 je Aufruf. Scheitert das,
rendere und lies die Bilder:

```
pdftoppm -r 110 -jpeg -jpegopt quality=80 dokument.pdf seite
```

Viele Mathematik-PDFs haben keine Textebene. Das ist der Normalfall, kein Fehler.
**Du bist die Bilderkennung.** Was du nicht herausliest, existiert im Ergebnis nicht.

### 2. Inventar, wortgetreu, VOR allem anderen

Bevor du an Boegen denkst, schreibst du das Inventar: Seite fuer Seite **alles**, was
dasteht. Jede Formel exakt als LaTeX, jede Tabellenzeile, jeder Satz, der eine Regel
oder eine Begruendung traegt, jeder Graph mit Funktion, Achsenbereich, Punkten und
eingezeichneten Linien, jede Ueberschrift. Nichts wird schon jetzt weggelassen, weil es
„nur ein Beispiel" oder „eine Wiederholung" ist.

Das Inventar geht **unverkuerzt** in das Feld `inventar` der Datei, mit Seitenmarken
(`S1: ... S2: ...`). Der Pruefer sucht jedes Element darin im Film. Ein Inventar, das nur
nennt, was der Film ohnehin zeigt, ist wertlos; darum entsteht es zuerst, ohne Blick auf
den Film. Ein Lauf ohne `inventar` bricht mit schwerem Befund ab.

Warum so streng: Ein Inventar, das nach dem Film entsteht, enthaelt genau das, was der
Film zeigt, und der Pruefer ist blind. Nur ein Inventar, das vor dem Film entsteht, kann
zeigen, was weggelassen wurde.

Das Inventar ist ausserdem eine eigene Datei `INVENTAR.md` neben dem Film, seitenweise,
vollstaendig. Traegt eine Seite auch Nachbarabschnitte, die nicht Gegenstand des Films sind
(der Auftrag nennt den Abschnitt), stehen sie in `INVENTAR.md` vollstaendig mit dem Vermerk
„nicht Gegenstand"; ins Feld `inventar` der Datei kommt von ihnen nur eine Zeile ohne
Formeln („S30 oben: Kruemmung, nicht Gegenstand"), denn der Pruefer sucht jede Formel des
Feldes im Film. Der Abschnitt selbst steht im Feld unverkuerzt.

### 3. Die Lernreise, vor dem ersten Beat

Nicht die Seitenreihenfolge, sondern die Kette der Begreif-Schritte. Beantworte
schriftlich, kurz:

- **Wo ist die eigentliche Huerde?** Nicht was draufsteht, sondern was Lernende falsch
  verstehen. Nicht "Definitionsbereich", sondern "warum eine einzelne Zahl verboten
  sein kann, obwohl die Formel harmlos aussieht".
- **Welche Frage lebt an welcher Stelle?** Jede Frage wird ein Bogen.
- **Welcher Schritt traegt das Ganze?** Meist einer. Er bekommt das teure Geraet und die
  meisten Stuecke.
- **Was ist blosse Aufzaehlung?** Ein Beat, nie ein Bogen.

Diese Reise gehoert in deine Antwort an den Nutzer, in fuenf Zeilen. Sie ist die
Begruendung fuer alles Weitere und erscheint nie im Film. **Eine der fuenf Zeilen sagt, wo
die Filmordnung von der Dokumentordnung abweicht, oder stellt ausdruecklich fest, dass
die Dokumentordnung schon die Lernordnung ist.** Sonst ist die Reise ein Wegwerfartefakt,
das nichts bewirkt.

### 4. Storyboard: eine Zeile je Bogen, Pflichtdurchgang durch die Auswahltabelle

Zwischen Reise und Guss liegt die Luecke, in die der Blindfilm 2 gefallen ist: die Reise
nannte die Huerde richtig („eine harmlose Zahl bringt die Formel zum Kollabieren"), der Film
zeigte sie als statische Umformung. Darum vor dem Giessen, schriftlich, **eine Zeile je
Bogen**: lebende Frage, welche Beziehung der Bogen zeigt, welches Geraet sie traegt, was
der Payoff ist.

Dabei gehst du **fuer jede Gleichung des Bogens** die Auswahltabelle durch: Welche Zahl
bewegt sich? Woher? Wohin? Erst wenn die Antwort dreimal „keine" ist, darf die Gleichung
statisch stehen. Ein Bogen ohne Geraet ist erlaubt; ein Bogen ohne diese Pruefung nicht.

Das Storyboard geht in die Beiakte.

### 5. Boegen giessen

Lies `REFERENCE.md`: Format, Operationen, `expr`-Regeln.

`beispiel-parabel.json` liegt daneben: ein frei komponierter Film in acht Boegen, der die
Altgeraete (`plot`, `bildfolge`, `zoomfolge`, `doppelgraph` mit `binden`, `wert`) an der Stelle
benutzt, an die sie gehoeren. Er ist aelter als die Goldgeraete und kein Mass fuer Pfeil und
Flug; sieh ihn als Beleg fuer die Altgeraete, nicht als Vorlage zum Ausfuellen.

Schreibe aus dem Strang, nicht aus einer Liste. Rufe deine Kenntnis des Themas auf und
simuliere den Kopf des Lesers durch das ganze Dokument: Was weiss er hier, welche Frage
lebt in ihm, was sieht er, wie schwer traegt er gerade? Wer aus Prozessschritten
schreibt, bekommt Fragmente.

Frage bei jedem Bogen einmal: **ist der Gegenstand hier eine Bewegung?** Ein Grenzuebergang,
eine Annaeherung, ein Zusammenhang zweier Funktionen, ein Wert, der eine Stelle ist. Wenn ja,
gehoert eines der vier Geraete hin. Wenn nein, lass sie weg.

### 6. Pruefen

```
node pruefe.mjs film.json player.html            # Befunde gegen die Gesetze
node pruefe.mjs film.json player.html --hoehe    # dazu das Hoehenmodell je Bogen und Beat
node lauf2.mjs film.json player.html             # ganze Radstrecke, muss 0 Fehler melden
```

`lauf2.mjs` liegt im selben Ordner; es faehrt den Film im Spieler ab und meldet jede
Operation, die zur Laufzeit scheitert (falsche Chip-Kennung, Pfeil ohne Ziel). `pruefe.mjs`
sieht das nicht, weil es nur die Datei liest. `lauf2` braucht `jsdom`; fehlt es, sagt es
das und `npm install jsdom` behebt es.

Der Pruefer meldet Befunde, kein Lob. Jeder schwere Befund wird behoben, bevor gebaut
wird. Ein Qualitaetsmangel wird nie am Satz repariert: **giesse den Bogen neu**, mit
diesem Verstaendnis.

### 7. Simulat: Abgabebedingung

Der Pruefer sieht Mechanik. Ob der Film lehrt, sieht nur ein Leser. Darum vor der Abgabe:

```
node transkript.mjs film.json > TRANSKRIPT.md
```

schreibt den Film so auf, wie ihn ein Leser am Handy erlebt, Blatt fuer Blatt, Wisch fuer
Wisch, ohne Blick in die Datei. Dann liest du `SIMULAT.md` und fuehrst den Auftrag darin
auf dem Transkript aus: in einem frischen Agenten, wenn du einen starten kannst, sonst
selbst, mit dem Transkript als einziger Quelle. Das Ergebnis (`SIMULAT.md` des Films) sagt,
was der Leser morgen noch weiss, wo er ausgestiegen ist, welche Regel er falsch abstrahiert
hat. Jede Aussteige- und Glauben-Marke geht zurueck in den Guss. Ein Film ohne Simulat ist
nicht abgegeben; der Blindfilm 2 war mechanisch 0/0/0 und didaktisch ungenuegend, genau
das misst das Simulat.

### 8. Beiakte

Deine Antwort an den Nutzer enthaelt neben der Datei: das Inventar (als Datei), die
Lernreise in fuenf Zeilen (mit der Abweichung von der Dokumentordnung), das Storyboard
(eine Zeile je Bogen: Frage, Beziehung, Geraet, Payoff), die Grundkonzepte des Abschnitts
(was Verstaendnis konstituiert, keine Rechenschritte), **je eingesetztem Geraet einen Satz,
welche Beziehung es zeigt** (GL6), und das Simulat. Fehlt der Satz zu einem Geraet, ist das
Geraet Dekoration und fliegt. Keine Lobprosa, keine Nacherzaehlung des Films.

### 9. Bauen

`player.html` lesen, `__TITEL__` durch das Thema und `__BEATS_JSON__` durch den Inhalt
der JSON-Datei ersetzen, Ergebnis schreiben. Programmatisch, nicht abtippen.

Antworte dem Nutzer mit der Lernreise in fuenf Zeilen und einem Satz, was entstanden
ist. Kein Prozessbericht.

## Die Gesetze

**Der Ein-Minuten-Puffer.** Jede geoeffnete Spannung fuehrt binnen etwa einer
Leseminute zu einem Ergebnis. Im Zweifel wird das Beispiel erst zu Ende geloest.

**Reprise statt Verweis.** Was der Leser braucht und was den Bildschirm verlassen hat,
wird neu gezeigt. Niemals "wie oben", "wie wir gesehen haben", "von vorhin". Beim
Scrollen ist das strenger als im Buch, weil niemand zurueckblaettert.

**Der Ueberflieg-Test.** Blende alles ausser Ueberschriften, Tabellen, Merksaetzen,
Graphen und Aufgaben aus. Traegt das die Geschichte allein? Wenn nicht, fehlt ein
struktureller Traeger.

**Visuell zuerst.** Jede Kernaussage bekommt einen Traeger: ein ausgerichtetes
Formelpaar, eine Tabelle, einen Graphen. Prosa ist kurzes Bindegewebe, ein Gedanke pro
Satz. Ein Beat mit mehreren neuen Informationen ist ein Befund. Ausnahme: vor dem
ersten Beispiel stehen ein, zwei Konzeptsaetze, damit der Leser weiss, warum er hinsieht.

**Der erste Satz nennt die Natur der Sache.** Kein Anlauf, keine Klassifikationshuelle.
"Die Ableitung sagt fuer jede Stelle, wie steil der Graph dort ist." Bei
Aufgabentypen die Sorte samt Wollen.

**Musterlernen.** Nach dem erklaerten Beispiel kommt die Serie. In ihr bleibt genau das
Muster konstant, alles Irrelevante variiert. Frage dich, welche falsche Regel jemand
aus deinen Beispielen abstrahieren koennte, und brich sie durch ein Beispiel, das an
diesem Merkmal variiert.

**Das Muster zeigt die Notation, nicht die Farbe.** In jeder Zeile dieselbe ungekuerzte
Gestalt, auch im Trivialfall: aus 4x wird 4x²/4, aus x wird 1x²/1, aus 7 wird 7/1·x¹.
Gekuerzt wird erst hinter einem angehaengten Gleichheitszeichen. Ein Zwischenschritt,
den die Regel nicht erzeugt, verdeckt sie.

Das gilt auch fuer eine `tabelle`, denn dort landen Serien im Film. Eine Tabelle
„Aufgabe, Ergebnis" zeigt das Muster nicht: der Schritt, der die Regel IST, steht in
keiner Zeile, und der Leser abstrahiert aus der Gestalt der Aufgabe. Eine Musterserie
traegt eine Spalte mit dem Schritt: Funktion | Nenner gleich null | Loesung. Und wo das
Verfahren ein Fluss von Zahlen ist, traegt die `serie` mit Pfeilen es besser als jede
Tabelle, weil die Tabelle den Fluss verbirgt.

**Eine Regel steht auf einem Blatt, das mindestens einen ihrer Belege traegt.** Ein
Merksatz auf einem Blatt, dessen Beispiele mit dem vorigen Blatt weggeblendet sind, steht
im Leeren; der Leser kann nicht zurueckblaettern. Muss eine Serie geteilt werden, kommt
der letzte Fall als Reprise mit auf das Blatt der Regel, oder die Regel bleibt bei den
Faellen.

**Der Plan bleibt unsichtbar.** Jeder Satz, der ankuendigt, praesentiert oder eine
Planentscheidung ausspricht, ist Fueller und entsteht gar nicht erst. Kein "in diesem
Abschnitt", kein "der Trick", kein "wir schauen uns an".

**Zeigen statt vorstellen lassen.** Was der Text behauptet, steht auf der Seite.
Beschriftungen gehoeren ins Bild, nicht daneben.

**Zahlen.** So gewaehlt, dass Ergebnisse angenehm sind. Die neutrale Zahl einer
Operation taugt nie zu ihrer Demonstration.

**Energie proportional zum Nutzen.** Ein Nebengedanke bekommt einen Beat, nie einen
Bogen. Eine allgemeine Regel, die den Sonderfall miterledigt, schlaegt Regel plus
Sonderregel.

## Treue

- **Nur die Notation des Dokuments.** Schreibt es selbst `\in` und `\mathbb{R}`, dann
  schreibst du das auch. Schreibt es das nicht, erfindest du es nicht.
- **Nichts hinzufuegen.** Kein Beispiel, keine Zwischenrechnung, keine Regel, die nicht
  im Dokument steht. Reihenfolge aendern und betonen darfst du, Inhalt erfinden nicht.
- **Nichts durch Auslassung verfaelschen.** Zaehlt das Dokument dreizehn Gesichtspunkte in
  drei Bloecken, sagt der Film nicht „vier gehoeren dazu". Das Inventar ist der Vertrag.
- **Bildelemente, die die lebende Frage nicht braucht, fallen**, auch wenn das Dokument sie
  zeigt. Der Goldfilm liess `W(0\|0)` im ersten Blatt weg, weil die Frage dort der Gipfel war
  und der Wendepunkt abgelenkt haette. Betonung aendern ist erlaubt; das ist keine
  Auslassung, sondern Fuehrung. Was faellt, steht trotzdem im Inventar.
- **Keine Meta-Beats.** Nie ein Satz ueber fehlenden Inhalt oder eine Entschuldigung.
- **Sprache des Dokuments.**

### Wenn Treue und Puffer sich widersprechen

Manchmal endet ein Abschnitt des Dokuments ohne Aufloesung: der Graph steht da, aber die
Antwort steht nirgends. Der Bogen verlangt eine Aufloesung, die Treue verbietet, sie zu
erfinden. **Treue geht vor.** Zwei erlaubte Auswege, in dieser Reihenfolge:

1. **Die Aufloesung ist das Sehen selbst.** Der Payoff-Beat zeigt am Bild, was zu sehen
   ist, ohne einen Satz zu behaupten, der nicht dasteht. Ein Wert, eine markierte Stelle,
   ein Bereich. Das ist keine Erfindung, sondern das Ablesen dessen, was gezeichnet ist.
2. **`jetztihr`.** Die offene Stelle wird zur Aufgabe. Die Loesung darfst du dann bilden,
   denn sie ist die Rechnung des Dokuments zu Ende gefuehrt, nicht neuer Stoff.

Was du nie tust: eine Regel, eine Definition oder ein Beispiel erfinden, damit der Bogen
schliesst. Lieber ein Bogen weniger.

## Sprachregeln

Anrede ihr. Ein Gedanke pro Satz, hoechstens ein Nebensatz. Keine Gedankenstriche.
Keine Konstruktion "das ist nicht x, sondern y". Kein Gendern. Dezimalkomma.
Fachwoerter beim ersten Auftreten im Halbsatz erklaert.

**Der Film spricht nie ueber sich.** Kein „Film", „Blatt", „Animation", „Bildschirm", kein
„wischen", kein „der Finger faehrt". Der Leser sieht Mathematik, keine Regie. Der Blindfilm 1
hat „Der Finger faehrt als x ueber die Kurve" als Satz gesetzt; das ist eine Anweisung aus
diesem Skill, kein Satz fuer den Leser. Ebenso keine Ankuendigung: „Nun folgt", „Es folgt",
„Als Naechstes", „Jetzt kommt", „Wir sehen". Der Pruefer kennt diese Woerter.

## Die Warnung

Kopierte Form ohne ihren Grund ist Nachahmung und faellt durch. Die Mittel dieses
Skills sind Ausdrucksformen der Zielfunktion, keine Checkliste. Wenn du ein Mittel
einsetzt, musst du in einem Satz sagen koennen, welche Beziehung es zeigt. Kannst du
das nicht, lass es weg.
