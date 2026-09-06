# Blattkino

Arbeitsblätter, die sich beim Lesen aufbauen. Die Seite scrollt nicht: Wischen dreht nur
den Fortschritt einer Animation, die auf einer stehenden Bühne abläuft.

Live: https://studienkolleg.me

## Für Menschen

- Einen Film ansehen: `player.html?film=filme/parabel.json`
- Einen Film hinzufügen: JSON-Datei nach `filme/` legen, eine Zeile in `index.html`.

## Für Sitzungen, die hier arbeiten

Lies **START_HIER.md**, dann **STAND.md**. STAND.md beschreibt die ausgelieferte Linie.
Nachrichten zwischen den parallel arbeitenden Sessions stehen in **AUSTAUSCH.md**.

Filme liegen an genau einer Stelle: ausgelieferte in `filme/`, Blindtests in
`blindtest/<n>/film.json` (mit Beiakte daneben); der Katalog `index.html` verlinkt beide
direkt ueber `player.html?film=...`. `quelle/` enthaelt nur die Spielerquellen.

## Bauen

```
bash quelle/bauen.sh                                   # Player v2 aus quelle/v2
node skill/harness2.mjs                                # 43 Tests
node skill/abgleich2.mjs                               # Vorabnahme gegen gold/extrempunkte.html
node skill/blattkino/lauf2.mjs filme/x.json [--dump]  # ganze Radstrecke, 0 Fehler
node skill/blattkino/pruefe.mjs filme/x.json skill/blattkino/player.html
node skill/blattkino/baue.mjs filme/x.json skill/blattkino/player.html x.html
node skill/blattkino/transkript.mjs filme/x.json > TRANSKRIPT.md   # Leseerlebnis fuer das Simulat
```

Skill installieren: `skill/blattkino.skill` (Zip des Ordners, Version im Kopf von SKILL.md)
im Chat ueber „Save skill" installieren; die alte installierte Fassung vorher entfernen.
`bash quelle/bauen.sh` baut das Zip nicht; nach jeder Skill-Aenderung:
`cd skill && zip -r blattkino.skill blattkino`.
