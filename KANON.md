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
| player.html | der Player |
| skill/ | das zweite Artefakt: SKILL.md, REFERENCE.md, pruefe.mjs, baue.mjs, player.html, Beispiel; harness-viewer.mjs |
| quelle/ | Playerquellen und Filme im Quellzustand; bauen.sh |
| filme/ | ausgelieferte Filme (JSON) |
| index.html, README.md, CNAME | Katalog und Auslieferung (studienkolleg.me) |

## Gemeinsam

| Datei | Regel |
|---|---|
| AUSTAUSCH.md | fortlaufend, nur anhängen, nie ändern; Kennungen B*/P* |

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
