---
name: blattkino
description: Blattkino 2.6 (Buehne, Goldgeraete, Inventar, Simulat-Harness). Verwandelt ein Dokument in einen wischgesteuerten Lehrfilm fuer das Handy, in dem Formeln sich aufbauen, Zahlen von Zeile zu Zeile wandern und Graphen sich zeichnen. Nutze diesen Skill, wenn aus einem PDF, Arbeitsblatt, Skript oder Aufgabenblatt eine Animation, ein Lehrfilm, ein Video oder eine erklaerende Fassung werden soll, oder wenn "Blattkino" genannt wird. Funktioniert auch mit gescannten PDFs ohne Textebene, weil die Seiten angesehen werden.
---

# Blattkino

**Version 2.6 (2026-09-06).** Jeder Film traegt diese Nummer im Feld `"skill"`; sie steht
auch in der `description` oben.

Aenderungsprotokoll (Version, Datum, Anlass):
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
Sie steht klein oben auf dem Blatt. „Woran erkennt man einen Gipfel?" lebt; „Womit faengt
eine Kurvendiskussion an?" spricht ueber das Dokument und lebt in niemandem. Findest du
keine lebende Frage, gehoert der Bogen nicht in den Film. Die eine Ausnahme ist ein Katalog,
den das Dokument selbst aufstellt und der Film danach abarbeitet: dann `"uebersicht": true`
und `"frage": null`, hoechstens einmal je Film und nie als Eroeffnung. Der Goldfilm oeffnet
mit dem Gipfel, nicht mit der Gliederung; der Blindfilm 2 oeffnete mit zwei
Uebersichtsblaettern, ein Drittel des Films ohne Lerngegenstand.

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
| eine Zahl bekommt einen Ort im Bild, oder ein Ort wird eine Zahl | `flug` vom Chip zur Achsenmarke (`kandidat`) oder in einen leeren Chip einer Zeile | Wertebereich: die −1 aus `T(−1\|−1)` fliegt in `y ≥ −1`. Nullstellen: `x₁` fliegt in `N₁(x₁\|0)` |
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
ihm lebt, was er sieht, wie schwer er traegt.

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

Neben `film.json`: `INVENTAR.md`, `TRANSKRIPT.md`, `BERICHT.md` des Simulats, `BEIAKTE.md` mit Lernreise, Storyboard,
den Grundkonzepten des Abschnitts (was Verstaendnis konstituiert, keine Rechenschritte) und
den vermerkten Luecken. Fuer studienkolleg.me: Datei nach `filme/`, eine Zeile in
`index.html`. Antworte dem Nutzer mit der Lernreise und einem Satz, was entstanden ist. Kein
Prozessbericht, keine Lobprosa.

## Die Warnung

Kopierte Form ohne ihren Grund ist Nachahmung und faellt durch. Jedes Mittel dieses Skills
ist Ausdruck der Zielfunktion; kannst du zu einem Mittel nicht in einem Satz sagen, welche
Beziehung es zeigt, lass es weg.
