# Blattkino: Stand und Überblick (2026-09-06, abends)

Für den Autor. Kurzfassung des Projekts über alle Sessions; die Produktwahrheit im Detail
steht in STAND.md, der Kanon in KANON.md, das Gespräch in AUSTAUSCH.md.

## 1. Ziel

Ein Skill, mit dem eine beliebige frische LLM-Sitzung aus einem hochgeladenen Dokument
(Raster-PDF, Mathematik, Studienkolleg) einen Lehrfilm erzeugt, den unser Player ohne
Nacharbeit abspielt und den der Autor billigt. Der Film ist eine JSON-Datei; der Player liegt
einmal auf studienkolleg.me. Die Intelligenz sitzt im Skill, der Player ist deterministisch.

## 2. Wer schreibt, und wie

Vier Sessions, ein Mensch. Kommunikation nur über AUSTAUSCH.md, chronologisch angehängt,
jede Nachricht mit Kürzel und Nummer:

| Kürzel | Session | Besitz | Nachrichten |
|---|---|---|---|
| **B** | builder (diese Session) | player.html, skill/, quelle/, filme/, blindtest/, dokumente/, index.html, STAND.md, README.md | B1 bis B28 |
| **P** | Projektsteuerung | KANON, ZIEL, PLAYER, ITERATION, TRIALS, LEHREN_ANIMATION, LAUFKARTE, START_HIER | P1 bis P19 |
| **G** | gold | gold/ (Goldfilm, Transkript, Simulat-Auftrag, Storyboard, Lehren GL), künftig richter/ | G1 bis G6 |
| **DD** | didakt | kein Besitz; prüft gegen das Autorenprojekt | DD1 bis DD8 |
| Autor | Heinrich | Entscheide, Push (`git p`), Urteil am Handy, Hold-out-Dokument, Skill-Installation | |

Weitere Nummern: L (Lehren des Autorenprojekts), AL und EL (Animationslehren in
LEHREN_ANIMATION), GL (Lehren des Goldlaufs), T (Transferaufgaben), F (Fehlregeln), W
(Whitelist), S (Seiten), Trial n (Blindlauf n). Erledigte Threads B1 bis B16, G1 bis G5, DD1
bis DD8, P1 bis P5 liegen in AUSTAUSCH_ARCHIV.md.

Eiserne Regel 6: ein Umbau ist erst fertig, wenn STAND, REFERENCE beziehungsweise der
Kanontext im selben Arbeitsgang nachgezogen sind.

## 3. Was gebaut ist

**Player v2** (`player.html`, aus `quelle/v2/`): die Engine des Goldlaufs. Die Seite scrollt
nicht; Wischen dreht den Fortschritt einer Animation auf stehender Bühne. Ein Bogen des
Films ist ein Blatt, ein Blatt genau ein Bildschirm; Blöcke kommen von oben nach unten dazu
und bleiben, bis der Bogen endet. Jedes Stück kostet dieselbe Wischstrecke, keine Ruhezonen.
Vollbild-Tor auf dem Handy, Fortschrittsbalken rechts. Vom Autor am Handy abgenommen („sieht
gleich aus" wie der Goldfilm). Geräte: Pfeil in die Klammer, Flug zur Achsenmarke, Kandidat
und Aufstieg, Kappe, Fahrt, Wert, Doppelgraph mit Bindung, Bildfolge, Zoomfolge, Paar, Serie
aus Vorlage und Fällen.

**Skill `blattkino` 2.6** (`skill/blattkino/`, Zip `skill/blattkino.skill`): SKILL.md (2.960
Wörter, Neuguss 2.5 nach P18, ein Gerätekatalog mit Miniaturen, Inventar zuerst, Lernreise,
Storyboard, Prüfen, Schüler-Simulat, Abgabe), REFERENCE.md (Format und Operationen),
`pruefe.mjs` (mechanischer Prüfer gegen die Lehren, rund vierzig Regeln, Inventarabgleich,
Höhenmodell), `lauf2.mjs` (fährt den Film im Spieler ab), `transkript.mjs` (Film als
Leseerlebnis), `baue.mjs`, `simulat/` (Schüler-Simulat v2 als Harness), Goldfilm und
Parabelfilm als Beispiele. Versioniert im Kopf und in der description, jeder Film trägt
`"skill"`. Installiert ist beim Autor noch 1.x; das Zip 2.6 liegt zur Installation bereit.

**Schüler-Simulat v2** (`skill/blattkino/simulat/simulat2.mjs`): der Schüler als Käfig aus
Skript und frischen Köpfen. Je Blatt ein Agent, der nur Whitelist, aktuelles Blatt und
höchstens vier Zettelzeilen sieht; jeder Gedankenschritt braucht eine Quelle (Blatt, Zettel,
Whitelist), das Skript prüft sie und bucht Ungedecktes als Glauben; danach Regelfassung,
Fehlregel-Probe mit Gegenbeispiel-Zitat, Transfer gegen hinterlegte Lösung, Deutungsprobe,
Schluss. Jede Messung trägt ihren Werkzeugstand (Version und Prüfsummen).

**Katalog studienkolleg.me** (`index.html`): vier Filme (Goldfilm Extrempunkte als Datei,
Parabel, Kurvendiskussion 1, Ableitung), fünf Blindtests direkt anklickbar, Demo Goldlauf.

**Dokumente** (`dokumente/`): die drei Quell-PDFs mit allen Seitenbildern, damit jeder Kopf ein
eigenes Inventar bilden kann. Seitenangaben im Projekt beziehen sich darauf.

## 4. Was gemessen ist

**Trials (Blindläufe, Sonnet, nur Skill plus Seitenbilder):**

| Trial | Thema | Skill | Mechanik | Urteil |
|---|---|---|---|---|
| 1 | Extrempunkte (Maßbeispiel derselben Seiten) | 2.1 | grün | wertlos als Messung, Abschrift |
| 2 | Definitionsbereich, 4 Seiten | 2.1 | grün | Autor: sehr schlecht; kein Goldgerät, Foliensatz |
| 3 | Definitionsbereich, dieselben Seiten | 2.2 | grün | offen (besser: Pfeil, Wert, eine Übersicht) |
| 4 | Wendepunkte, S. 30 bis 32 (nah) | 2.3 | grün | offen; überträgt die Gold-Choreographie |
| 5 | Nullstellen, S. 9 bis 12 (fern) | 2.3 | grün | offen; erster Film mit Geräten ohne themengleiche Vorlage, Merksatz, Serie |

Ab Trial 6: Dokument plus installierter Skill, kein Pfad, kein Zusatz (P8).

**Simulat v2, sechs Läufe (B25):** Goldfilm besteht den Transfer, Blindfilm 2 fällt genau
dort durch, wo Gold es sah (Wurzel und Logarithmus „kann ich nicht bestimmen"), die
Stockstellen decken sich mit Golds Handlesung. Der entkernte Goldfilm besteht den Transfer
aber ebenfalls, auch als Formelskelett, auch mit Haiku: wer Ableiten und f' als Steigung
mitbringt, holt die Regel aus einem Beispiel. Der Nullfilm-Test aus P16/P19 ist mit
Extrempunkten nicht erfüllbar; Gegenvorschlag: derselbe Test auf Definitionsbereich, wo das
Vorwissen nicht trägt (B27).

## 5. Die Iterationsarchitektur (P19, vom Autor zum Ausprobieren freigegeben)

Karpathys Schleife: eine veränderbare Seite (Skill samt Player), ein unantastbarer Richter,
behalten nur bei Verbesserung.

1. **Bauen (B):** Simulat-Harness im Skill. Erledigt (2.6).
2. **Beweisen (B, Abnahme P und G):** Nullfilm-Test. Offen, siehe oben; braucht Entscheid
   des Autors zum Gegenvorschlag.
3. **Richter trennen (G besitzt, Autor liefert):** `richter/` mit dem zurückgehaltenen
   Dokument, eigenen Transferaufgaben, Whitelist, Fehlregeln. B sieht es nie. Eingefroren
   werden nur Materialien; Werkzeuge kommen aus der geprüften Version, jede Messung trägt
   ihren Werkzeugstand, Eichlauf mit dem Goldfilm bei jeder Werkzeugänderung (B28).
4. **Messen (B fährt, P protokolliert):** Baseline mit zwei blinden Läufen auf dem
   Hold-out, dann je Änderung dasselbe; besser bleibt, sonst zurück. Eine Zeile je Lauf in
   TRIALS.md.
5. **Autor:** je Runde wenige Filme am Handy, beste plus ein schlechter, gemischt. Was der
   Autor findet und der Richter nicht, wird eine Richterfrage. Der Autor ändert den
   Richter, nie den Skill.
6. **Skill gesund halten (P):** feste Prüfung vor jeder Version: Widerspruchspaare,
   Doppelungen, unanwendbare Regeln, Länge, Werkzeuge existieren, Versionsnummern gleich.
   Erste Liste P18, Antwort 2.5.

Damit sind die früher offenen Punkte entschieden: Iterationsarchitektur (Schritte 1 bis 4),
Mensch im Loop (Schritt 5, statt der Senf-Runde), Skill-Pflege (Schritt 6, statt Ledger),
Hold-out (Schritt 3 und 4).

## 6. Was der Autor jetzt entscheiden oder tun muss

1. **Zip 2.6 installieren** (Chat, „Save skill"; alte Fassung `blattkino` vorher entfernen).
   Vorher kein Trial 6.
2. **`git p`**, dann git-Tag `skill-2.6`.
3. **Nullfilm-Test:** Ja oder Nein zum Gegenvorschlag Definitionsbereich (B27). Kosten mit
   Sonnet rund 22 Agentenaufrufe (etwa 90 Minuten), mit Haiku ein Viertel.
4. **Trial 4 und 5 am Handy** ansehen (Katalog: Blindtest 4, 5). Trial 5 ist der
   interessante.
5. **Hold-out-Dokument** an G übergeben, sobald P19 Schritt 3 beginnt.

## 7. Offen bei B, ohne Autorentscheid

kd-1 trägt vier Inventar-Befunde (Altbestand vor der Inventarpflicht). DD3 als eigene
Prüferregel fehlt. `paar` ist in keinem Film benutzt. Vom grossen Dokument sind acht Seiten
verfilmt. Fremdvokabular-Spur im Simulat ist noch grob. Wächter als zweiter Kopf (Stufe 3
des Simulats) nur, wenn der deterministische nachweislich zu wenig fängt.

## 8. Wo was liegt

| Frage | Datei |
|---|---|
| Was ist gebaut, was ist offen | STAND.md |
| Der Kanon, die Regeln aller Sessions | KANON.md, ITERATION.md, LEHREN_ANIMATION.md |
| Das Gespräch | AUSTAUSCH.md (lebend), AUSTAUSCH_ARCHIV.md |
| Register der Trials | TRIALS.md (P) |
| Der Skill | skill/blattkino/SKILL.md, REFERENCE.md; Zip skill/blattkino.skill |
| Das Simulat | skill/blattkino/simulat/README.md; Läufe skill/simulat-laeufe/ |
| Maßstab | gold/extrempunkte.html, gold/LEHREN_GOLD.md, gold/STORYBOARD_extrempunkte.md |
| Quelldokumente | dokumente/README.md |
| Recherche | RECHERCHE_RUNDE_1.md, RECHERCHE_RUNDE_2.md |
