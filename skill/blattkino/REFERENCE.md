# Format und Operationen

## Die Datei

```json
{
  "titel": "Definitions- und Wertebereich",
  "quelle": "Kurvendiskussion 1, Seiten 1 bis 4",
  "inventar": "wörtliche Liste aller Formeln, Graphen und Listen des Dokuments",
  "boegen": [ ... ]
}
```

`inventar` ist freiwillig und wird nicht in den Film übernommen. Liegt es bei, prüft
`pruefe.mjs` damit die Abdeckung.

## Der Bogen

```json
{
  "frage": "Warum darf man hier ausgerechnet die Vier nicht einsetzen?",
  "beats": [ ... ]
}
```

`frage` erscheint nicht im Film. Sie ist die Frage, die im Leser lebt, und der Grund,
warum es diesen Bogen gibt. Genau ein Beat trägt `"payoff": true` und steht am Ende.

## Der Beat

```json
{
  "sub": "Der einführende Satz. Steht im Dokument, vor den Formeln des Beats.",
  "gewicht": 2,
  "fokus": false,
  "payoff": false,
  "ops": [ ... ]
}
```

| Feld | Werte | Wirkung |
|---|---|---|
| `sub` | Fliesstext | Ein lesbarer Satz, kein Untertitel. Führt ein, was danach kommt. |
| `gewicht` | 1, 2, 3 | Aufbautempo innerhalb des Takts. Jeder Takt kostet dieselbe Strecke am Rad; 3 baut über fast die ganze Strecke auf, 1 ist früh fertig. Fehlt es, gilt 2. |
| `fokus` | `true` | Solange dieser Beat im Lesefeld steht, tritt alles andere zurück. Ein bis zwei Mal je Dokument. |
| `payoff` | `true` | Dieser Beat löst den Bogen auf. Ohne eigenes `gewicht` bekommt er 3. |

Der Bogen selbst kennt ausser `frage` und `beats` ein drittes Feld: `"fortsetzung": true`
sagt, dass dieser Bogen den vorigen fortsetzt. Dann zählt dessen Beispielserie für einen
`merksatz` hier weiter. Nutze es, wenn eine Serie nicht auf ein Blatt passt und geteilt
werden muss; ohne das Feld wäre die Regel im zweiten Bogen ohne Serie.

Haben alle Beats Gewicht 2, wurde nicht entschieden. Der Prüfer meldet das.

## Operationen

| Operation | Form | Wirkung |
|---|---|---|
| `clear` | `{"op":"clear"}` | Trennstrich. Nur am Anfang eines Bogens, nie hinein. |
| `h` | `{"op":"h","t":"Überschrift"}` | Überschrift, die erste wird gross gesetzt |
| `text` | `{"op":"text","t":"kurzer Satz"}` | Fliesstext, sparsam |
| `item` | `{"op":"item","t":"Listenpunkt"}` | Aufzählungspunkt |
| `math` | `{"op":"math","tex":"f(x)=\\frac{1}{x-4}","hl":false}` | Formel. `hl:true` setzt sie in einen Kasten, für das Ergebnis eines Bogens, nie für Muster |
| `note` | `{"op":"note","t":"Randbemerkung"}` | eingerückte Bemerkung |
| `merksatz` | `{"op":"merksatz","t":"Nenner gleich null setzen, nach x auflösen."}` | fett, Alltagssprache, ein Satz. Braucht eine Serie in seinem Bogen |
| `frage` | `{"op":"frage","t":"Warum darf x nicht 4 sein?"}` | Frage in Akzentfarbe, danach eine Strecke Stille |
| `umformung` | siehe unten | eine Rechnung als **eine** Bewegung, mit Gründen zwischen den Zeilen |
| `tabelle` | siehe unten | Musterserie, Regelliste oder Gegenüberstellung |
| `jetztihr` | siehe unten | Aufgabe, dann eine Strecke Nachdenkzeit, dann die Lösung |
| `plot` | `{"op":"plot","id":"p1","expr":"x^2+4","xmin":-4,"xmax":4,"ymin":0,"ymax":12,"legend":"f(x)=x²+4"}` | Graph. Bleibt stehen, während der Text an ihm vorbeizieht, und baut sich dabei auf |
| `point` | `{"op":"point","id":"p1","x":0,"y":4,"label":"T(0|4)"}` | markierter Punkt, landet mit kleinem Überschwingen |
| `hline` / `vline` | `{"op":"hline","id":"p1","y":4,"label":"y=4"}` | gestrichelte Hilfslinie, liegt hinter der Kurve |
| `region` | `{"op":"region","id":"p1","y":4,"dir":"above","label":"y ≥ 4"}` | schraffierter Bereich, füllt sich von unten |
| `sweep` | `{"op":"sweep","id":"p1","x1":2,"label":"P"}` | markiert einen Punkt auf der Kurve |
| `paar` | siehe unten | zwei korrespondierende Zeilen mit beiden Wegen dazwischen |
| `wert` | `{"op":"wert","id":"p1","x":2,"tex":"f(2)=8","label":"8"}` | siehe unten. Formelzeile und Stelle im Bild zugleich |
| `doppelgraph` | siehe unten | zwei Koordinatensysteme übereinander |
| `binden` | `{"op":"binden","x":2,"label":"f(2)=4","label2":"f'(2)=4"}` | ein senkrechter Strich durch beide Systeme |
| `bildfolge` | siehe unten | eine Folge von Bildern, die sich einem Grenzbild nähert |
| `zoomfolge` | siehe unten | das Bild fährt stufenlos in eine Stelle hinein |

### Die vier Geräte, in denen Scrollen dem Papier überlegen ist

Auf Papier braucht jedes dieser vier Dinge mehrere starre Bilder nebeneinander. Der Leser
muss sie selbst zusammenrechnen. Beim Scrollen ist es eine einzige Bewegung.

**`wert` gegen die geteilte Aufmerksamkeit.** Eine Zahl, die nur in der Formel steht, bleibt
eine Zahl. Steht sie zugleich im Bild, wird sie eine Stelle. `wert` setzt beides in dasselbe
Zeitfenster: die Formelzeile erscheint, und gleichzeitig laufen gestrichelte Linien zu beiden
Achsen und ein Punkt landet.

```json
{"op":"plot","id":"f","expr":"x^2","xmin":-1,"xmax":4,"ymin":-1,"ymax":10,"legend":"f(x)=x²"},
{"op":"wert","id":"f","x":2,"tex":"f(2)=4","label":"4"}
```

Regel: jeder benutzte Funktions- oder Ableitungswert gehört ins Bild, nicht nur in die Formel.
`wert` ohne `tex` ist sinnlos und wird beanstandet.

**`doppelgraph` und `binden` für den Zusammenhang zweier Funktionen.** Zwei Koordinatensysteme
übereinander, oben f, darunter f'. `binden` zieht einen gestrichelten Strich durch beide und
setzt in jedem einen Punkt. Erst dieser Strich stiftet den Zusammenhang; zwei Bilder
untereinander allein sind noch keiner. Ein `doppelgraph` ohne `binden` wird beanstandet.

```json
{"op":"doppelgraph","id":"d","expr":"x^2","expr2":"2*x",
 "xmin":-3,"xmax":3,"ymin":-1,"ymax":9,"ymin2":-6,"ymax2":6,
 "legend":"f(x)=x²","legend2":"f'(x)=2x"},
{"op":"binden","x":2,"label":"f(2)=4","label2":"f'(2)=4"}
```

`ymin2` und `ymax2` gelten für das untere System; fehlen sie, gilt der obere Bereich.
Beide Systeme brauchen eine Beschriftung, sonst weiss niemand, welches welches ist.

**`bildfolge` für eine Annäherung.** Eine Folge von Bildern im selben Rahmen. Jede Stufe
erscheint, bleibt kurz und verschwindet wieder; nur das letzte Bild bleibt stehen. Der Leser
sieht die Bewegung, nicht vier eingefrorene Zustände.

```json
{"op":"plot","id":"s","expr":"x^2","xmin":-0.5,"xmax":4,"ymin":-1,"ymax":10,"legend":"f(x)=x²"},
{"op":"point","id":"s","x":1,"y":1,"label":"P(1|1)"},
{"op":"bildfolge","id":"s","art":"sekante","x":1,"stufen":[2,1,0.5,0],"ziel":"Tangente"}
```

`art` ist `sekante` oder `balken`. Bei `sekante` sind die `stufen` die Abstände h; sie müssen
kleiner werden und bei 0 enden, sonst läuft die Folge ins Leere. Bei `balken` sind die `stufen`
die Anzahlen der Streifen, etwa `[2,4,8,16]`. Drei bis vier Stufen genügen. `ziel` ist die
Beschriftung des Grenzbildes, ohne Angabe steht dort „Berührgerade".

**`zoomfolge` für lokale Betrachtung.** Das Bild fährt beim Scrollen stufenlos in eine Stelle
hinein, bis die Kurve von ihrer Berührgeraden nicht mehr zu unterscheiden ist. Die Berührgerade
liegt gestrichelt schon von Anfang an im Bild.

```json
{"op":"zoomfolge","id":"z","expr":"x^2","x":1,"zoom":14,
 "xmin":-1,"xmax":4,"ymin":-1,"ymax":10,"label":"P(1|1)"}
```

`zoom` ist der Vergrösserungsfaktor am Ende, sinnvoll zwischen 8 und 20. Unter 4 wird die Kurve
nicht sichtbar gerade und der Prüfer beanstandet es. Eine `zoomfolge` macht ein eigenes Bild auf,
wie `plot`.

Wann welches Gerät: `wert` immer, sobald eine Zahl benutzt wird, die im Bild eine Stelle hat.
`doppelgraph` nur, wenn zwei Funktionen wirklich zusammengehören, und immer mit
mindestens einem `binden` irgendwo im selben Bogen. `bildfolge` und `zoomfolge`
nur für einen Grenzübergang. Wer sie einbaut, weil sie hübsch aussehen, baut Mimikry.

### `paar`

Zwei Zeilen, die auseinander hervorgehen, mit beiden Wegen dazwischen. Das ist das
stärkste Wirkmittel für Umkehrbeziehungen: man sieht den Hinweg und den Rückweg zugleich.

```json
{"op":"paar",
 "oben":"f(x)=3x^{2}",
 "unten":"f'(x)=6x",
 "hin":"ableiten",
 "zurueck":"integrieren",
 "paare":[["3x^{2}","6x"]]}
```

`oben` und `unten` sind Pflicht; fehlt eine, wird die Operation still verworfen. `hin`
beschriftet den Pfeil nach unten, `zurueck` den nach oben; eine leere Beschriftung lässt
den Pfeil weg.

`paare` bindet korrespondierende Teile: jedes Paar bekommt dieselbe Farbe, das erste Paar
eine andere als das zweite. Gesucht wird **rechts vom ersten Gleichheitszeichen**, damit
das `x` in `f(x)` nicht getroffen wird; steht der Teil dort nicht, gilt die ganze Zeile.
Höchstens vier Paare, danach wiederholen sich die Farben.

Die Zeilen stehen linksbündig untereinander. Glyphengenaue Ausrichtung leistet das nicht;
die Zuordnung trägt die Farbe.

Nutze `paar` für Ableiten und Integrieren, Potenzieren und Wurzelziehen, Ausmultiplizieren
und Faktorisieren, Gleichung und Probe. Für eine einseitige Rechnung über mehrere Schritte
nimm `umformung`.

### `jetztihr`

Vier Felder, alle freiwillig, beliebig kombinierbar:

```json
{"op":"jetztihr",
 "t":"Wo hat f einen waagerechten Punkt?",
 "aufgabe":"f(x)=x^{2}-6x",
 "loesung":"f'(x)=2x-6",
 "loesungText":"2x-6=0 ergibt x=3"}
```

`t` und `loesungText` sind Klartext, `aufgabe` und `loesung` sind LaTeX. Klartext steht
vorn, die Formel dahinter. `aufgabeTex` und `loesungTex` gelten als Zweitnamen für
`aufgabe` und `loesung`.

Die Lösung erscheint erst nach einer Strecke Nachdenkzeit im selben Takt, nie in Klammern
daneben.

### `umformung`

```json
{"op":"umformung","zeilen":[
  {"tex":"x-2\\neq 0","warum":"Nenner ungleich null"},
  {"tex":"x\\neq 2","warum":"beide Seiten plus zwei"}
]}
```

Der `warum` einer Zeile erklärt, wie **diese** Zeile zustande kommt, und steht über ihr.
Die vorigen Zeilen bleiben stehen und verblassen. Nutze `umformung` immer, wenn
Gleichungen auseinander hervorgehen. Drei `math`-Ops hintereinander sind dafür die
falsche Wahl, weil sie den Zusammenhang verschweigen.

### `tabelle`

```json
{"op":"tabelle","art":"serie","kopf":["!Funktion","!Definitionsbereich"],
 "zeilen":[["f(x)=\\frac{8}{x}","x\\in\\mathbb{R}\\mid x\\neq 0"], ...]}
```

Zellen sind LaTeX. Eine Zelle, die mit `!` beginnt, ist Klartext. **Der `kopf` ist immer
Klartext**, dort ist ein `!` überflüssig und wird abgeschnitten; schreibe einfach
`["Funktion","Definitionsbereich"]`.

`art` steuert, wie streng geprüft wird:

- `"serie"` (Vorgabe): eine Musterserie. Mindestens vier Zeilen, und in jeder dieselbe
  ungekürzte Gestalt, damit das Muster sichtbar wird.
- `"regel"`: eine Liste von Bedingungen. Keine Längen- oder Gestaltprüfung.
- `"vergleich"`: zwei Fälle mit einem Unterschied.

### Der Ausdruck in `expr`

Erlaubt sind `x`, Zahlen, `+ - * / ^ ( )`, die Funktionen
`sin cos tan asin acos atan sinh cosh tanh exp ln log log10 sqrt abs`, die Konstanten
`pi` und `e`, sowie implizite Multiplikation wie `2x` oder `3(x+1)`.

Kein LaTeX. Falsch: `\frac{1}{x-4}`. Richtig: `1/(x-4)`.

Ein ungültiger Ausdruck wird verworfen und der Graph fehlt. `pruefe.mjs` prüft jeden
Ausdruck mit derselben Funktion, die der Spieler benutzt.

### Reihenfolge im Graphen

Gib die Markierungen in der Reihenfolge, in der man sie verstehen soll: erst `plot`,
dann `point`, dann `region`. Der Spieler verteilt sie über die Zeit, in der der Graph
stehen bleibt. Die Kurve zeichnet sich zuerst.

## Die Geräte des Goldlaufs (Player v2)

Seit dem Goldlauf (gold/extrempunkte.html, Autor plus Gold-Session) kann der Player Zahlen
fliegen lassen, Pfeile im Seitenrand führen und die Tangente mit dem Finger fahren. Jedes
dieser Geräte zeigt eine benannte Beziehung (GL6); wer es einbaut, sagt in der Beiakte in
einem Satz, welche. Referenz für das Verhalten ist gold/UEBERGABE_BAU.md §3.

**Zeit (GL3):** jeder Beat kostet dieselbe Radstrecke. Seine Stücke kacheln sie lückenlos
nach ihrem `dauer`-Anteil (Vorgabe 1); vor einem Blattwechsel bleibt die Blende frei.
`gewicht` wird ignoriert. Es gibt keine Ruhezonen: wer verweilen will, hält die Hand still.

### Zeilen aus Chips

```json
{"op":"zeile","id":"z1","teile":["3x^{2}-3=0","\\iff x^{2}=1",["\\iff x_1=",{"tex":"-1","k":0,"id":"x1"}]],
 "folge":true,"hl":false,"stumm":false,"dauer":1}
```

`teile`: ein String ist ein TeX-Chip; `{tex,k,id,leer}` ein TeX-Chip mit Farbe `k` (0, 1, 2),
Kennung `id` und `leer` (unsichtbar, bis ein Flug ihn füllt); `{t,fett,id}` ein Textchip,
dessen erstes Vorkommen von `fett` fett gesetzt wird und die Flugquelle ist; eine Liste ist
eine Gruppe, die nie umbricht; eine Liste mit erstem Element `"!eng"` eine enge Gruppe ohne
Abstände, damit eine Formel in Chips zerlegt werden kann und nur die eingesetzte Zahl Farbe
und Pfeilziel trägt: `["!eng",{"tex":"f''("},{"tex":"-1","k":0,"id":"e"},{"tex":")=-6"}]`.
Führende Hochzahl als `{}^{3}`. `folge` lässt die Chips einzeln in Leserichtung erscheinen.
`stumm` setzt die Zeile, ohne sie zu zeigen; `{"op":"zeig","zeile":"z1","folge":true}` holt
sie nach, etwa nachdem ein Pfeil zu ihr gezeichnet ist. Chip-Kennungen gelten je Bogen.

`satz {t}`, `marke {t}` (Kleinbuchstaben-Marke, TeX erlaubt), `merk {t}`, `h {t}`.

### Bild

```json
{"op":"graph","id":"G","expr":"x^3-3*x","xmin":-2.4,"xmax":2.4,"ymin":-4,"ymax":4,
 "legend":"f(x) = x³ − 3x","h":190,"dauer":2}
```

`h` ist die Bildhöhe in Pixeln (165 bis 215 im Goldlauf), die Legende steht unter dem
Bild. Alles Weitere spricht das Bild über `id` an (fehlt sie, gilt das letzte Bild):

| Op | Beziehung | Felder |
|---|---|---|
| `punkt` | Punkt landet | `x, y, k` |
| `beschriftung` | Name am Punkt, oben bei Gipfel, unten bei Tal | `x, y, text, k, dauer` |
| `kandidat` | eine Stelle auf der x-Achse; unsichtbar, bis ein `flug` sie erreicht | `id, x, k, text, sofort?` |
| `flug` | eine Zahl wandert an ihren Ort | `von` Chip-Id, `zu` Chip-Id oder `{"kandidat":id}`, `k, dauer` |
| `pfeil` | Herkunft und Einsetzen: aus der Quelle in die Rinne links, von oben in die Klammer | `id, von` Chip-Id oder `{"pfeil":id}` (Ast aus dem Stamm), `zu` Chip-Id, `lane, k, versatz?, dauer` |
| `kappe` | Krümmung am Kandidaten, ∩ oder ∪ | `x, r, k, text?` |
| `aufstieg` | die Stelle wird zur Höhe: gestrichelt hinauf zur Kurve und zur y-Achse | `x, y, k, text` |
| `fahrt` | der Finger ist x: die Tangente fährt, m läuft mit, an Geister-Stellen bleibt m = 0 liegen | `x0, x1, geister:[x], k, dauer` |

Der Pfeil endet **immer** von oben auf der eingesetzten Zahl (GL2). Farbe sitzt nur auf der
Zahl, die wandert oder eingesetzt wird (GL1): eine Farbe je Kandidat, nie auf Zeilen.

### Serie: eine Vorlage, viele Fälle

```json
{"serie":{
  "vorlage":[ {"ops":[{"op":"zeile","teile":["{{f}}"]},{"op":"graph","id":"G","expr":"{{expr}}", ...}]},
              {"ops":[{"je":"kand","dann":[{"op":"kandidat","id":"m{{k}}","x":"{{x}}","k":"{{k}}","text":"{{xt}}"}]}]} ],
  "faelle":[ {"frage":"Geht das bei g genauso?","f":"g(x)=x^{2}-4x","expr":"x^2-4*x","kand":[{"k":0,"x":2,"xt":"2"}]}, ... ]}}
```

Der Player entfaltet je Fall einen Bogen. `{{name}}` wird aus dem Fall ersetzt (ein
Platzhalter, der den ganzen Wert bildet, bleibt Zahl oder Liste); `{"je":"liste","dann":[…]}`
wiederholt seine Einträge je Element der Liste, mit dem Element als Kontext plus `i` und
`k`. Verschachtelung ist erlaubt (`tests` mit `pfeile` und `kappen` darin). Kennungen
schreibt der Fall aus (`"id":"x0"`), nicht die Vorlage rechnet sie. So bleibt die
Choreographie je Fall identisch (H3); der Prüfer beanstandet eine Serie, deren Fälle
verschiedene Gerätefolgen ergeben. Vollständiges Beispiel: `beispiel-extrempunkte.json`.

`schluss` auf oberster Ebene setzt den Text der Schlussszene.

## Der Prüfer

```
node pruefe.mjs film.json player.html
```

Er meldet drei Schweregrade und beendet sich mit Fehlercode, solange etwas Schweres
offen ist. Geprüft werden unter anderem: genau eine Auflösung je Bogen und ihre Lage,
Überflieg-Träger je Bogen, Regel ohne Serie, Notationsgestalt in Musterserien, Verweise
statt Reprisen, geleakter Plan und Füller, Gedankenstriche, Gendern, Dezimalpunkt, Sätze
mit mehreren Nebensätzen, Gewichts- und Fokusverteilung, Gültigkeit jedes `expr` und die
Abdeckung des Inventars.

### Die Zahlen, mit denen er rechnet

Damit du planen kannst statt zu raten. Bildhöhe 812 Pixel, Breite 375.

**Ein-Minuten-Puffer:** über 5 Beats je Bogen ist grenzwertig, über 6 schwer.

**Platz eines Bogens.** Ein Bogen hat 698 Pixel für alles zusammen, plus 8 Pixel Abstand
zwischen je zwei Blöcken. Wer darüber liegt, wird beanstandet; ab 15 Prozent darüber
schwer. Ein Graph kostet 230 Pixel, ein Doppelgraph 460; `clear`, Marken und Folgen
kosten nichts.

Was ein Element ungefähr kostet:

| Op | Pixel |
|---|---|
| `sub` des Beats | 27 je Zeile zu 46 Zeichen, plus 16 |
| `h` | 90 |
| `text` | 27 je Zeile, plus 14 |
| `item` | 28 je Zeile zu 40 Zeichen, plus 8 |
| `math` | 62, hervorgehoben 80 |
| `note` | 27 je Zeile zu 52 Zeichen, plus 24 |
| `frage` | 27 je Zeile zu 44 Zeichen, plus 30 |
| `merksatz` | 27 je Zeile zu 44 Zeichen, plus 50 |
| `umformung` | 30 je Zeile, plus 24 je `warum`, plus 26 |
| `tabelle` | 34 je Zeile, plus 60 |
| `jetztihr` | 78 plus 27 je Zeile |
| `wert` | 42, ohne `tex` 0 |
| `paar` | 154 |
| `plot`, `zoomfolge` | 230 |
| `doppelgraph` | 460 |
| `clear`, `point`, `hline`, `vline`, `region`, `binden`, `bildfolge`, `sweep` | 0 |

Ein Bogen aus drei Beats mit einem Graphen, vier Sätzen, einer Formel und einem Merksatz
liegt bei etwa 230 + 160 + 62 + 77 = 529 Pixeln plus fünf Fugen: er passt. Zwei Graphen im
selben Bogen passen fast nie.

**Regel ohne Serie.** Ein `merksatz` verlangt in seinem Bogen eines davon: vier
Tabellenzeilen, oder vier `math`- und `umformung`-Ops, oder zwei ganze Bilder
(`bildfolge`, `zoomfolge`, `doppelgraph`), oder drei Marken (`binden`, `wert`, `point`,
wobei jede Stufe einer `bildfolge` als Marke zählt). Sonst steht die Regel vor ihren
Fällen.

**Inventar.** Der Prüfer sucht die Elemente aus `inventar` in allem, was der Leser als
Formel zu sehen bekommt: `math`, `umformung` (auch über Zeilen hinweg zusammengezogen),
`tabelle`-Zellen, `wert`, `jetztihr` und den Legenden der Graphen. Findet er etwas nicht,
fehlt es wirklich. `inventar` ist freiwillig, aber es ist deine einzige Absicherung gegen
stilles Weglassen; lösche es nicht, um Befunde loszuwerden.

## Bauen

```
node baue.mjs film.json            # neben player.html
node baue.mjs film.json player.html film.html
```

`baue.mjs` setzt den Titel und die Daten in `player.html` ein. Von Hand ersetzen ist
möglich, aber fehleranfällig: der Datenblock steht in einem `<script>`-Element, und ein
`</script>` irgendwo im Text zerreisst die Seite. `baue.mjs` entschärft das.

Das Ergebnis ist eine einzelne HTML-Datei ohne Netzabhängigkeit ausser MathJax, die
lokal, auf jedem Hosting und als Artifact läuft. Als Artifact mit `capabilities: {}`
und `favicon: "🎞️"`.

### Oder gar nicht bauen

Der Spieler kann den Film auch als eigene Datei nachladen:

```
player.html?film=filme/ableitung.json
```

Dann liegt der Spieler einmal auf der Seite und jeder Film ist nur seine JSON-Datei.
Der Name muss neben der Seite liegen und auf `.json` enden; fremde Herkunft und `..`
werden abgewiesen. Für studienkolleg.me ist das der übliche Weg: die JSON-Datei nach
`filme/` legen, eine Zeile in den Katalog, fertig.

## Was der Spieler daraus macht

Die Seite scrollt nicht. Über dem Bild liegt eine durchsichtige Fläche, das Rad; ihr
Stand ist der Fortschritt. Die Bühne darunter steht still.

Vor dem Film steht ein Tor mit Titel, Quelle und einem Startknopf; auf kleinen Geräten
startet er ins Vollbild. `titel` und `quelle` erscheinen dort, nicht als eigene Szene.

| im JSON | auf der Bühne |
|---|---|
| ein Bogen | ein Blatt, also genau ein Bildschirm: die `frage` steht oben, solange er läuft |
| ein Beat | ein Zeitabschnitt: seine Blöcke kommen dazu und bleiben stehen |
| eine Op | ein Block im Blatt: erscheint an seinem endgültigen Platz, nichts rutscht nach |
| `plot`, `doppelgraph`, `zoomfolge` | ein Bildblock, der ebenso stehen bleibt |
| `gewicht` | wie schnell der Beat sich aufbaut (die Strecke ist bei allen gleich) |

**Ein Bogen muss auf einen Bildschirm passen.** Alles, was in ihm vorkommt, steht am Ende
gleichzeitig da: das Blatt ist der ausgelagerte Speicher des Lesers. Was nicht passt, wird
einmal verkleinert; unter Faktor 0,68 meldet der Spieler es in der Konsole.

Die Abstände zwischen den Blöcken rechnet der Spieler so, dass die Bildhöhe aufgebraucht
wird, höchstens aber 40 Pixel je Fuge. Bleibt dann noch viel Luft, steht das Blatt mittig.

Rechts läuft ein senkrechter Fortschrittsbalken über die ganze Höhe.

`clear` ist gegenstandslos, weil der Bogen selbst trennt. Es bleibt gültig, tut nichts und
kostet keine Höhe.
