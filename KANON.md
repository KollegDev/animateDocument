# KANON: Register des Animationsprojekts

Jede Datei hat genau einen Status und einen Besitzer. Neue Dateien nur mit Eintrag. Gelöschtes wird nie wieder angelegt oder eingelesen.

## Kanonisch: Steuerung (Besitz Projektsteuerung)

| Datei | Rolle |
|---|---|
| START_HIER.md | Einstieg und Lesereihenfolge |
| ZIEL.md | das Ziel; zuerst lesen |
| KANON.md | dieses Register |
| LEHREN_ANIMATION.md | verdaute Lehren samt Geltungsgrenzen; Drift-Anker |
| PLAYER.md | didaktischer Grund der Bauform, Invarianten der Schnittstellen |
| ITERATION.md | Verbesserungs-Loop, Golden-Lauf, Methodenschleife |
| LAUFKARTE.md | eine Zeile pro Steuerungs-Iteration |

## Kanonisch: Bau (Besitz Bau-Session; Steuerung fasst nie an, Bitten über AUSTAUSCH)

| Datei | Rolle |
|---|---|
| STAND.md | gebauter Zustand, Entschiedenes mit Grund; bei Produktfragen maßgeblich |
| player.html | der Player, seit 2026-09-05 v2 (Kern: Skriptteil des Goldlaufs, alles f(p); B16) |
| skill/ | das zweite Artefakt: SKILL, REFERENCE, Prüfer, Bauwerkzeug, Beispiele, Harness, Abgleich |
| quelle/ | Playerquellen (v2; v1 archiviert unter quelle/v1/), Filme im Quellzustand, bauen.sh |
| filme/ | ausgelieferte Filme (JSON), inkl. extrempunkte.json (Goldfilm als Datei) |
| index.html, README.md, CNAME | Katalog und Auslieferung (studienkolleg.me) |

## Kanonisch: Gold (Besitz Gold-Session)

| Datei | Rolle |
|---|---|
| gold/ | der Maßstab: Goldlauf extrempunkte.html samt Storyboard, Inventar, Simulat, Transkript, LEHREN_GOLD (GL1 bis GL6), SIMULAT_AUFTRAG, UEBERGABE_BAU, eigene Laufkarte |

Die didakt-Session (Erbauerin des Autorenprojekts) hat keinen Dateibesitz und schreibt ausschließlich in AUSTAUSCH.md (Kennung DD*); sie prüft Didaktik und Lehren-Treue gegen die Quelle.

## Gemeinsam

| Datei | Regel |
|---|---|
| AUSTAUSCH.md | fortlaufend, nur anhängen, nie ändern; Kennungen B*/P* |

## Rollen (Autorentscheid G4, 2026-09-05)

Bau baut Format, Player, Skill und führt den Blindtest durch. Gold liefert den Maßstab und beurteilt jeden Blindtest-Film dagegen (Befunde als Skill-Lücken, nie als Filmkorrektur). Die didakt-Session prüft gegen die Autorenprojekt-Quelle. Die Steuerung hält Kanon, Register, Lehren und Drift-Schutz und fährt den Golden-Lauf der Hauptlinie. Bodenwahrheit bleibt das Autorurteil.

## Eiserne Regeln

1. Eine Iteration ohne Zeile (LAUFKARTE bzw. STAND) ist nicht gelaufen.
2. Kein Ausliefern ohne Prüfkette (STAND.md §7); der Prüfer beweist nie didaktische Güte (EL11), Bodenwahrheit ist das Autorurteil.
3. Fremder Dateibesitz wird nie beschrieben; Koordination nur über AUSTAUSCH.md.
4. Autorentscheide (STAND.md §6) schlagen älteren Kanontext; die Steuerung zieht den Kanon nach und registriert den Widerspruch, bis er nachgezogen ist.
5. Das Autorenprojekt (Geschwisterordner) ist Lesequelle, nie Schreibziel.

## Gelöscht (nie wieder anlegen oder einlesen)

| Datei | Grund |
|---|---|
| UEBERGABE.md | 2026-09-05 in den Kanon überführt |
| Buch/blattkino/ (alter Ort) | 2026-09-05 hierher umgezogen |
| blattkino.html, harness.mjs | 2026-09-05 alte Kino-Linie (TTS, Laufzeit-Dialog, Vision im Player); durch Autorentscheid 2026-09-04 ersetzt, Messungen in STAND.md §0; Ideen-Erbe in LEHREN_ANIMATION Teil III |
| PROMPT.md | 2026-09-05 durch den Skill ersetzt (skill/blattkino); Lehren-Gehalt lebt in LEHREN_ANIMATION und im Skill |

## Externe Artefakte (historisch)

| Ort | Status |
|---|---|
| Dev-Artifact 67e03812… und Haupt-Artifact 7ed8de04… (claude.ai) | alte Kino-Linie, eingefroren; Produkt ist die Pages-Auslieferung studienkolleg.me |
| studienkolleg.me | zeigt den Stand des letzten Autor-Push; die Sessions haben keinen Schreibzugriff auf .git (B12), Commits und Push sind Autorhandlung |
