# ITERATION: Wie Player und Prompt besser werden

Der Iterationsprozess dieses Projekts, dem Autorenprojekt nachgebaut. Bodenwahrheit ist das Autorurteil am abgespielten Film; jede Erkenntnis wird verdaut statt im Chat zu verdunsten.

## Der Loop

1. **Auftrag** (eine Zeile in LAUFKARTE.md): was geändert wird und warum, mit Lehren-Bezug.
2. **Änderung**: Skill- und Player-Änderungen macht die Bau-Session (Besitz siehe KANON); die Steuerung ändert Kanon und beauftragt über AUSTAUSCH.md. Format- und Schnittstellenänderungen gegen die Invarianten in PLAYER.md.
3. **Mechanische Prüfung** (Pflicht vor jedem Publish): die Prüfkette aus STAND.md §7 in der v2-Fassung (node --check, harness2, pruefe.mjs über jeden Film, abgleich2 gegen den Goldstandard wo einschlägig). Eine Änderung ohne grüne Kette ist nicht gelaufen (EL9).
4. **Golden-Lauf**: filme/kurvendiskussion-1.json im Player abspielen; Soll-Liste (Seiten 1 bis 4 des Testdokuments): drei Graphen (x²+4 mit T(0|4) und Bereich y≥4; x⁴−2x² mit H(0|0), T(−1|−1), T(1|−1) und y≥−1; −(x−1)²+3 mit H(1|3)), die Formelliste der Seiten 1 bis 3 exakt, drei Situationen des Definitionsbereichs (Brüche, Wurzeln, Logarithmus), keine erfundene Notation (kein f: R → R).
5. **Autor früh**: Der Autor sieht den Film, bevor poliert wird. Sein Befund ist die einzige Bodenwahrheit.
6. **Methodenschleife pro Befund** (dreifach verwerten, wie im Autorenprojekt): (a) Lehrstück in LEHREN_ANIMATION.md (Situation, Anweisung, Quelle), (b) Änderung in PROMPT.md oder am Player, (c) wenn mechanisch prüfbar: ein neuer Fall im Harness oder in der Golden-Soll-Liste. Wiederholt sich ein Befund, ist die frühere Übersetzung der Fehler (L29).
7. **Laufkarten-Zeile abschließen**: Ergebnis in einem Satz. Eine Iteration ohne Zeile ist nicht gelaufen.

## Drift-Schutz

- Neue Sessions lesen zuerst ZIEL.md und KANON.md, dann LAUFKARTE.md; nie den Chatverlauf rekonstruieren.
- Hohe Signale (Autorworte, Debugging-Bodenwahrheiten) leben ausschließlich in LEHREN_ANIMATION.md; wer eine Erkenntnis nur im Chat hat, hat sie nicht.
- Das Autorenprojekt (C:\Users\Dell\Downloads\Projekte\animateDocuments\Autorenprojekt) ist die eingefrorene didaktische Quelle. Es wird gelesen, nie verändert; bei Widerspruch zwischen einer Animationsregel und einer Autorlehre dort gewinnt die Autorlehre, und der Widerspruch wird als Fallgeschichte notiert.
- Berichte sind Zeilen; Lobprosa und Nacherzählung sind die Token-Form des Schauspielens.

## STATUS DER FOLGENDEN ABSCHNITTE: ENTWURF IN ABSTIMMUNG (Autor, 2026-09-06)

Verbindlich sind nur: (1) Ein Trial ist ein Blindlauf mit Dokument plus installiertem, versioniertem Skill, sonst nichts (P8). (2) Der Skill wird versioniert, die installierte Fassung im selben Batch nachgezogen (P8). (3) Das AUSTAUSCH-Archiv (P11).

Alles Weitere unten (Leseprozess, Tor, Senf-Runde, Skill-Iterationsprotokoll, Ledger, Hold-out-Verfahren) ist Diskussionsstand zwischen Autor und Steuerung. Es gilt nicht, niemand handelt danach, bis der Autor es freigibt. Die Abstimmung läuft in dieser Reihenfolge: zuerst das Simulat (der Schlüssel), dann die Iterationsarchitektur. Zurückgenommen ist ausdrücklich: die Beschränkung der Sessions auf je einen Aspekt (die Sessions antworten aus ihrer Perspektive, das genügt); das Regel-Ledger; die Formel „wiederkehrende Escapes zeigen fehlende Regeln".

## Der Trial-Loop (Autorentscheid 2026-09-06)

Ein Trial = frische Session bekommt NUR Dokument plus installierten Skill (versioniert), sonst nichts, und liefert Film, Inventar, Beiakte mit Storyboard, Transkript und Selbst-Simulat. Danach der **Leseprozess**, fünf Lesarten in fester Reihenfolge, jede eine Zeile in TRIALS.md:

1. **Mechanik** (Bau): pruefe.mjs, lauf2, Abgleich wo einschlägig.
2. **Treue** (Steuerung): Inventar der Seiten aus einem ANDEREN Kopf (EL19) gegen den Film; Auslassung, Erfindung, fremde Notation.
3. **Simulat fremd** (G oder DD): SIMULAT_AUFTRAG auf dem Transkript; Selbst-Simulat der Session daneben, Differenz kalibriert das Simulat.
4. **Goldabgleich** (G): entlang des Beziehungskatalogs; Gerätevermeidung, Gerätemissbrauch, Choreographie.
5. **Autor-Endfeedback** am Handy: Bodenwahrheit.

Dann die **Methodenschleife rückwärts**: Jeder Autorbefund wird gegen die Lesarten 1 bis 4 gehalten. Hat eine Lesart ihn vorab gefunden, ist er gefangen. Hat keine ihn gefunden, ist er ein Escape, und ein Escape ist immer eine Lücke im Prüfer, im Simulat-Auftrag oder im Katalog, nie nur ein Filmfehler; er wird dreifach verwertet: Prüferregel (mechanisch, wenn fassbar), Skill-Satz mit Miniatur (L26), Lehrstück in LEHREN_ANIMATION. Der Film selbst wird nie repariert (Iteration am Skill, nie am Film der blinden Session, G3). Ergebnis ist eine neue Skill-Version, und der nächste Trial läuft mit ihr.

**Versionskontrolle des Skills:** SKILL.md trägt im Kopf eine Versionsnummer und ein Änderungsprotokoll (Version, Datum, Anlass mit Trial-Nummer); die installierte Fassung wird im selben Batch nachgezogen (Regel 6) und trägt dieselbe Nummer; git-Tag je Version beim Autor-Push. Jeder Film trägt die Skill-Version im Feld quelle oder skill.

## Der Revisionsprozess als Tor (Autorentscheid 2026-09-06)

Der Computer prüft zuerst; was durchfällt, sieht der Autor nie. Iteriert wird am Skill, nie am Film.

**Das Tor, vier Bedingungen, alle ohne teuren Leser:**
1. Mechanik: Prüfer 0 schwer, lauf2 0 Fehler (kein LLM).
2. Simulat auf dem Transkript (Schüler-Simulat nach SCHUELER.md: simulierter Schüler mit Zettel-Gedächtnis, Vorstellungs-Verbot, Regel- und Transferprobe; kein Beurteiler, ein Vorfilter): Regelfassungen richtig, Transferaufgaben (nicht im Film enthalten) richtig. Modell: billig zulässig, einmalig gegen Golds Simulat kalibriert; bei systematischer Abweichung fällt es.
3. Treue und Katalog: unabhängiges Inventar gegen Film (Auslassung, Erfindung, fremde Notation), Beziehungen des Dokuments haben Geräte.
4. Positivbedingungen gegen blande Filme: Bewegung mit Beziehung wo das Dokument Beziehungen hat, Serie mit Konsolidierung, Merksatz; ein fehlerfreier Film ohne Bewegung fällt durch.
5. Die Senf-Runde (Autorentscheid 2026-09-06, human in the loop): Der passierte Film ist die Fassung VOR Senf. Die starken Sessions lesen das Transkript (nie das JSON) und schreiben Senf als Befundzeilen mit festem Formular (verletzte Lehre, Belegstelle, eine Zeile je Befund, höchstens zehn): didakt für Lehren-Treue, Gold für Beziehung und Choreographie, Steuerung für Treue und Klarheit. Eine frische Skill-Session bekommt Dokument, Skill und die Senf-Zeilen und gießt die betroffenen Bögen neu (Neuguss, keine Satzreparatur): die Fassung NACH Senf, ein Messinstrument, kein Produkt. Der Autor sieht beide Fassungen und urteilt zweifach: eigene Befunde am Film, und ob der Senf ihn besser gemacht hat. In den Skill fließt nur vom Autor als wirksam bestätigter Senf; nicht bestätigter Senf kalibriert die Richter (ihre Regel ist falsch oder zu schwach); eine Nachfassung, die schlechter wird, zeigt einen Befund, der sich nicht als Regel formulieren ließ. Billige Modelle sind nur als Schüler zulässig, nie als Richter. Die Senf-Zeilen sind die Vorab-Befunde, an denen die Fangquote gemessen wird.

**Regeln des Tors:**
- Verwerfen statt Nachbessern: Ein durchgefallener Film wird nicht repariert; sein Befund geht ins Skill-Änderungsprotokoll, die Skill-Version wird angepasst, ein frischer Trial läuft. Innerhalb der Trial-Session sind eigener Prüfer und eigenes Simulat einmal Pflicht (Skill), nie als Schleife.
- Das Tor entscheidet, was der Autor nicht sieht, nie, was gut ist. Jeder passierte Film geht an den Autor; seine Escapes sind die einzige Quelle neuer Tor-Bedingungen.
- Kappe gegen Flick-Drift: Fällt eine Skill-Linie dreimal in Folge durch, obwohl nach jedem Fehlschlag geändert wurde, wird nicht weiter geflickt, sondern die Ursache gesucht (Escape-Analyse, Diagnose-Formular unten). Ein Prüferbefund, der in zwei Trials wiederkehrt, ist eine Skill-Lücke (L29).
- Escape-Analyse: genau eine xhigh-Session nach Dimension (Gold: Beziehung und Choreographie; didakt: Lehren-Treue; Bau: Mechanik und Format), Kontext nur Befund, Transkriptstelle, Prüferausgabe. Ergebnis: eine Regel plus Miniatur, mechanisch wo fassbar. Teure Sessions lesen keine Filme, sie beantworten Escapes.
- Rauschen: mindestens zwei Trials je Skill-Version, bevor Wirkung behauptet wird; ein fester Regressionssatz (drei Abschnitte) läuft nach jeder Version nur durch Stufe 1 und Ops-Statistik.
- Hold-out: ein Dokumentabschnitt, der nie in einen Skill-Umbau geflossen ist, ist die Messstrecke; ein Gold-Referenzfilm dazu ist erlaubt und darf nie Skill-Beispiel werden. Extrempunkte ist KEIN Hold-out (Maßbeispiel im Skill). Wahl des Abschnitts beim Autor, offen.
- Skill-Hygiene: Prüferregel vor Skill-Prosa; jede Skill-Regel trägt eine Kennung (S-Nummer) und ihren Beleg-Trial; Prüferbefunde melden die Kennung; die Steuerung führt SKILL_LEDGER.md (Regel, Beleg-Trial, Prüferregel, zuletzt gegriffen) und schlägt nach jeder Version Streichungen (zwei Versionen ohne Greifen) und Lücken (wiederkehrende Escapes) vor. Bau schreibt den Skill, Steuerung hält ihn gesund. Regeln als Miniatur statt Satz (L26).
- AUSTAUSCH-Archiv: erledigte Threads wandern mit Fünfzeilen-Zusammenfassung nach AUSTAUSCH_ARCHIV.md; neue Sessions lesen Zusammenfassung plus offene Punkte, nie das ganze Protokoll.

## Skill-Iterationsprotokoll (nach jedem Fehlschlag am Tor oder Autorbefund; Autorentscheid 2026-09-06)

Ziel: am Skill iterieren, ohne dass er driftet (Bewegung ohne Richtung, wachsende Regelzahl bei gleicher Qualität).

1. **Diagnose vor Patch.** Jeder Befund bekommt einen Ursachentyp, ohne Typ keine Änderung:
   (a) Befolgung: der Skill trägt die Regel, die Session hielt sie nicht ein. Reaktion: kürzen, Regel als Beispiel statt Prosa, Prüferregel; nie eine weitere Regel.
   (b) Lücke: der Skill trägt keine Regel. Reaktion: Regel plus Miniatur, Prüferregel bevorzugt.
   (c) Kollision: zwei Regeln widersprechen sich. Reaktion: Fallgeschichte und Auflösung (L40), keine dritte Regel.
   (d) Prüferirrtum: falscher Befund. Reaktion: Prüfer, nicht Skill.
2. **Signal vor Rauschen.** Ein einzelner Fehlschlag wird im Ledger protokolliert, begründet aber keine Änderung; erst ein zweiter Trial mit demselben Befund oder ein Autorbefund. Ausnahme: Typ (a) reicht einmal.
3. **Neu gießen statt einfügen.** Kein Satz „achte auf X"; der betroffene Skill-Abschnitt wird mit dem neuen Verständnis neu geschrieben, Beispiel vor Maxime (L26, L40).
4. **Drift-Wächter vor der Freigabe.** Jede Änderung geht als Diff mit Anlass (Trial-Nummer, Ursachentyp) an die Steuerung; freigegeben wird nur, wenn sie keiner Lehre widerspricht, keine Regel dupliziert, den Skill nicht wachsen lässt (oder das Wachstum begründet) und keine Prüferregel stattdessen möglich ist. Bau schreibt, Steuerung gibt frei, dann Version.
5. **Kollateralschäden messen.** Regressionssatz nach jeder Version; Hold-out für Generalisierung; zwei Trials je Version vor jeder Wirkungsaussage.
6. **Gesundheitszeile je Version** (SKILL_LEDGER): Zeilenzahl, Regelzahl, Anteil Regeln mit Beleg, Regressionsergebnis, Fangquote. Wächst der Skill bei stagnierender Fangquote, driftet er.

Diagnose-Formular (für Bau nach Tor-Fehlschlag und für die Escape-Analyse): Trial-Nummer; Befund in einer Zeile mit Belegstelle; Ursachentyp a/b/c/d mit Begründung; betroffene Skill-Kennung (S-Nummer) oder „keine"; vorgeschlagene Reaktion (Prüferregel / Neuguss-Abschnitt / Kollisionsauflösung / Prüferfix); erwartete Wirkung, prüfbar am nächsten Trial.

