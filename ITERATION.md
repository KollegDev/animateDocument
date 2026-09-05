# ITERATION: Wie Player und Prompt besser werden

Der Iterationsprozess dieses Projekts, dem Autorenprojekt nachgebaut. Bodenwahrheit ist das Autorurteil am abgespielten Film; jede Erkenntnis wird verdaut statt im Chat zu verdunsten.

## Der Loop

1. **Auftrag** (eine Zeile in LAUFKARTE.md): was geändert wird und warum, mit Lehren-Bezug.
2. **Änderung**: Skill- und Player-Änderungen macht die Bau-Session (Besitz siehe KANON); die Steuerung ändert Kanon und beauftragt über AUSTAUSCH.md. Format- und Schnittstellenänderungen gegen die Invarianten in PLAYER.md.
3. **Mechanische Prüfung** (Pflicht vor jedem Publish): die Prüfkette aus STAND.md §7 (node --check, harness-viewer 80 Tests, pruefe.mjs 0 schwer über jeden Film). Eine Änderung ohne grüne Kette ist nicht gelaufen (EL9).
4. **Golden-Lauf**: filme/kurvendiskussion-1.json im Player abspielen; Soll-Liste (Seiten 1 bis 4 des Testdokuments): drei Graphen (x²+4 mit T(0|4) und Bereich y≥4; x⁴−2x² mit H(0|0), T(−1|−1), T(1|−1) und y≥−1; −(x−1)²+3 mit H(1|3)), die Formelliste der Seiten 1 bis 3 exakt, drei Situationen des Definitionsbereichs (Brüche, Wurzeln, Logarithmus), keine erfundene Notation (kein f: R → R).
5. **Autor früh**: Der Autor sieht den Film, bevor poliert wird. Sein Befund ist die einzige Bodenwahrheit.
6. **Methodenschleife pro Befund** (dreifach verwerten, wie im Autorenprojekt): (a) Lehrstück in LEHREN_ANIMATION.md (Situation, Anweisung, Quelle), (b) Änderung in PROMPT.md oder am Player, (c) wenn mechanisch prüfbar: ein neuer Fall im Harness oder in der Golden-Soll-Liste. Wiederholt sich ein Befund, ist die frühere Übersetzung der Fehler (L29).
7. **Laufkarten-Zeile abschließen**: Ergebnis in einem Satz. Eine Iteration ohne Zeile ist nicht gelaufen.

## Drift-Schutz

- Neue Sessions lesen zuerst ZIEL.md und KANON.md, dann LAUFKARTE.md; nie den Chatverlauf rekonstruieren.
- Hohe Signale (Autorworte, Debugging-Bodenwahrheiten) leben ausschließlich in LEHREN_ANIMATION.md; wer eine Erkenntnis nur im Chat hat, hat sie nicht.
- Das Autorenprojekt (C:\Users\Dell\Downloads\Projekte\animateDocuments\Autorenprojekt) ist die eingefrorene didaktische Quelle. Es wird gelesen, nie verändert; bei Widerspruch zwischen einer Animationsregel und einer Autorlehre dort gewinnt die Autorlehre, und der Widerspruch wird als Fallgeschichte notiert.
- Berichte sind Zeilen; Lobprosa und Nacherzählung sind die Token-Form des Schauspielens.
