# Beiakte: y-Achsenschnittpunkt und Nullstellen

## Lernreise (fünf Zeilen)

1. Die eigentliche Hürde ist nicht die einzelne Rechnung, sondern zu erkennen, dass
   Nullstelle und y-Achsenschnittpunkt dieselbe Grundidee spiegelbildlich anwenden:
   einmal wird die gesuchte Koordinate (y bzw. x) auf Null gesetzt, die andere bleibt
   die zu berechnende Unbekannte.
2. Die lebende Frage wandert von „Wo schneidet der Graph die x-Achse?" über „Wo
   schneidet er die y-Achse?" zu „Geht das auch bei anderen Funktionstypen?" bis
   „Wie macht man das immer?" — jede Frage trägt einen eigenen Bogen.
3. Der tragende Schritt ist die vollständige Rechnung an f(x)=(x−3)²−4 in den ersten
   beiden Bögen: hier entsteht das Muster (y=0 setzen, x=0 setzen), das die Serie
   danach nur noch an neuen Funktionstypen wiederholt.
4. Bloße Aufzählung sind die vier „Weiteren Beispiele" (g, h, k, m): eine Musterserie
   mit wechselnder Lösungstechnik (Isolieren, Ausklammern, p-q-Formel, Logarithmus),
   aber identischer Choreographie; keines bekommt eigenes Gewicht über das Muster
   hinaus.
5. Abweichung von der Dokumentordnung: Das Dokument zeigt auf Seite 10 zuerst den
   fertig beschrifteten Graphen mit allen drei Punkten, bevor die Rechnung überhaupt
   beginnt (Antwort vor der Not). Der Film dreht das um: der Graph erscheint zuerst
   leer, die Punkte entstehen erst durch die Rechnung und landen erst dann im Bild.

## Storyboard (eine Zeile je Bogen)

1. **Wo schneidet der Graph die x-Achse?** — Beziehung: die berechnete Lösung x wird
   zur Stelle auf der x-Achse — Gerät: zeile(Chips)+kandidat+flug+punkt+beschriftung
   — Payoff: N₁(1|0), N₂(5|0).
2. **Wo schneidet er die y-Achse?** — Beziehung: die Stelle x=0 wird zur Höhe f(0)
   im Bild — Gerät: kandidat+aufstieg+punkt — Payoff: S_y(0|5).
3–6. **Geht das bei g / h / k / m genauso?** (Serie) — Beziehung: dieselben zwei
   Beziehungen aus 1./2. an neuen Funktionen und Lösungstechniken — Gerät: serie
   (Vorlage mit kandidat/flug/punkt/beschriftung, dann kandidat/aufstieg/punkt) —
   Payoff: je S_y(0|…), am Ende jedes Falls.
7. **Wie findet man das immer?** — keine lebende Rechnung mehr, reine
   Konsolidierung — Gerät: tabelle (Musterserie über alle fünf Funktionen) plus
   zwei hervorgehobene Zeilen y=0 / x=0 — Payoff: Merksatz.

## Grundkonzepte des Abschnitts

1. Nullstelle = x-Wert mit f(x)=0, liegt auf der x-Achse.
2. y-Achsenschnittpunkt = f(0), liegt auf der y-Achse.
3. Symmetrisches Verfahren: die gesuchte Achse liefert die Bedingung (y=0 bzw.
   x=0), die andere Größe wird berechnet.
4. Wurzelziehen liefert grundsätzlich zwei Lösungen (±), solange die Wurzel nicht 0
   ist.
5. Ausklammern eines gemeinsamen Faktors liefert zusätzliche Nullstellen; das
   Dokument nennt dafür keinen Namen (Nullproduktsatz bleibt implizit).
6. Nullstelle und y-Achsenschnittpunkt können derselbe Punkt sein, wenn f(0)=0 ist
   (bei h und m im Film zweimal sichtbar).

## Beziehungssatz je eingesetztem Gerät (GL6)

- **kandidat + flug + punkt + beschriftung** (Nullstellen, Bogen 1 und in jedem
  Serienfall): zeigt, dass die algebraisch berechnete Lösung x genau die Stelle ist,
  an der die Kurve die x-Achse schneidet — nicht nur eine Zahl, sondern ein Ort.
- **kandidat + aufstieg + punkt** (y-Achsenschnittpunkt, Bogen 2 und in jedem
  Serienfall): zeigt, dass der eingesetzte Wert x=0 im Bild zu einer Höhe auf der
  Kurve wird, nämlich f(0) — die Rechnung bekommt eine geometrische Bedeutung.
- **serie** (Bögen 3–6): zeigt, dass die beiden obigen Beziehungen unabhängig von
  der konkreten Lösungstechnik der Gleichung (Isolieren, Ausklammern, p-q-Formel,
  Logarithmus) immer gleich ablaufen.
- **tabelle** (Bogen 7, art: serie): zeigt die fünf Einzelfälle nebeneinander als
  ein gemeinsames Muster, aus dem sich die allgemeine Regel ablesen lässt.
- **math (hl)** an jedem Payoff: markiert, wo eine Bogenfrage endgültig beantwortet
  ist; keine Bewegung, aber die vom Skill vorgesehene Kennzeichnung des Ergebnisses.

`doppelgraph`, `bildfolge` und `zoomfolge` kommen nicht vor: Der Abschnitt hat keinen
Grenzübergang und keine zwei zusammengehörigen Funktionen, an denen sie eine
Beziehung zeigen könnten. Ihr Einbau wäre Mimikry gewesen.

## Simulat-Kurzfazit

Die Regel wurde korrekt gefasst und auf zwei neue Funktionen erfolgreich übertragen,
alle sieben bewerteten Bewegungen wurden als hilfreich erlebt (keine als Dekoration).
Zwei echte Stockstellen bleiben bestehen: die Nummerierung der Nullstellen (N₁, N₂,
…) folgt nicht einheitlich der x-Reihenfolge oder der Rechenreihenfolge, und der
Nullproduktschritt in Bogen 4 (x=0 aus 0=x·(x²−4)) bleibt unbegründet — beides
Erbstücke des Quelldokuments selbst, die Treue verbietet eine Korrektur. Eine dritte
Stockstelle (p-q-Formel in Bogen 5 führte direkt zu x=3±1, ohne nachrechenbaren
Zwischenschritt) wurde nach dem Simulat behoben: `film.json` zeigt jetzt zusätzlich
die Zeile x_{1,2}=3±√(9−8), damit der Leser selbst nachrechnet statt zu glauben.
Volles Protokoll in `SIMULAT.md`.

## Letzte Ausgabe von pruefe.mjs

```
MITTEL Bogen 5               fuellt das Blatt ueber den Rand: 770 von 755 Pixeln, Verkleinerung auf 0.98. Der Spieler passt es ein.

7 Boegen, 23 Beats
0 schwer, 1 mittel, 0 leicht
```

Der eine verbleibende MITTEL-Befund ist die bewusst in Kauf genommene Folge der
Simulat-Korrektur oben (0,98-fache Verkleinerung, praktisch nicht wahrnehmbar); ein
weiteres Kürzen hätte den gerade behobenen Rechenschritt wieder gestrichen.

## Letzte Ausgabe von lauf2.mjs

```
Szenen 8  TOTAL 18.251000000000005  bereit true  fehler: keiner
Radstrecke gelaufen, Schritte 3650  Fehler 0
```

## Wo der Skill unklar war oder behindert hat

1. Es liegen zwei widersprüchliche SKILL.md-Fassungen im System vor: die vom
   Skill-Werkzeug geladene Version (älteres Bild-bleibt-stehen-Modell mit
   `gewicht`/`fokus`) unterscheidet sich stark von der im Auftrag genannten lokalen
   Fassung in `outputs/bt5/skill/blattkino/SKILL.md` (Bühnen-Modell mit `dauer`,
   GL1–GL6, Pfeil/Flug/Kandidat). Ich bin der lokalen, aktuelleren Fassung gefolgt,
   wie im Auftrag verlangt, aber welche gilt, war erst nach dem Lesen beider klar.
2. Die Höhenrechnung in `pruefe.mjs` ist im Fließtext von REFERENCE.md nur grob
   beschrieben; um Bögen gezielt unter das Platzlimit zu bringen, musste ich die
   Formel aus dem Quellcode extrahieren und ein eigenes Debug-Skript schreiben, das
   Höhe und Blockzahl je Beat ausgibt. Ein eingebauter Verbose-Modus in `pruefe.mjs`
   hätte das deutlich beschleunigt.
3. Die Inventar-Abdeckungsprüfung hat einen Normalisierungsfehler: `\pm` direkt
   gefolgt von `\sqrt{...}` ohne Leerzeichen wird von der generischen
   Backslash-Entfernung (`\\[a-z]+`) verschluckt und reißt dabei auch das
   nachfolgende „sqrt" mit heraus, was die `\sqrt`-Erkennung zerstört. Das erzeugte
   zwei falsche SCHWER-Befunde, bis die Ursache im Code gefunden war. Abhilfe: ein
   Leerzeichen zwischen `\pm` und `\sqrt`, nirgends dokumentiert.
4. Dieselbe Prüfung extrahiert bei verschachtelten Klammern
   (`\sqrt{\left(\frac{p}{2}\right)^2-q}`) nur bis zur ersten schließenden Klammer,
   was einen weiteren falschen Befund erzeugte, als diese Formel wörtlich im
   `inventar`-Feld stand. Die Inventar-Formulierung musste an dieser Stelle
   vereinfacht werden, um den Bug zu umgehen (die JSON-Datei zeigt die volle Formel
   trotzdem im Film selbst).
5. Die Auftragsvorgabe, Nachbarabschnitte „ins Inventar der Seite mit Vermerk
   'nicht Gegenstand'" zu setzen, steht in Spannung zur mechanischen Pflicht von
   `pruefe.mjs`, jede Formel aus dem `inventar`-Feld im Film wiederzufinden: Hätte
   ich die Nachbarformeln (Symmetrie, Grenzverhalten) im JSON-Feld wörtlich mit
   Gleichheitszeichen aufgeführt, hätte der Prüfer sie als fehlend gemeldet. Gelöst,
   indem das JSON-Feld die Nachbarinhalte nur in Prosa ohne auslösendes „=" nennt,
   während `INVENTAR.md` die vollständige, formelgetreue Fassung trägt — eine eigene
   Entscheidung, keine im Skill vorgegebene Lösung.
6. `transkript.mjs` lässt bei fehlender Farbe (`k` weggelassen) auf Bild-Operationen
   wie `kandidat`/`aufstieg` eine doppelte Leerstelle im Text entstehen (z. B. „die
   Achsenmarke"), weil die leere Farbbezeichnung trotzdem mit Leerzeichen umgeben
   wird. Kein Fehler im Film, aber es hat das Lesen des Transkripts beim Simulat
   unnötig gestört.
7. `transkript.mjs`s Tabellen-Renderer maskiert kein „|" innerhalb von
   LaTeX-Zellinhalten (z. B. „N_1(1|0)"), sodass die Markdown-Tabelle im Transkript
   optisch zerreißt, obwohl der eigentliche Spieler das als LaTeX sauber rendert.
   Für das Simulat musste das gedanklich rekonstruiert werden.
