# Blattkino

Arbeitsblätter, die sich beim Lesen aufbauen. Die Seite scrollt nicht: Wischen dreht nur
den Fortschritt einer Animation, die auf einer stehenden Bühne abläuft.

Live: https://studienkolleg.me

## Für Menschen

- Einen Film ansehen: `player.html?film=filme/parabel.json`
- Einen Film hinzufügen: JSON-Datei nach `filme/` legen, eine Zeile in `index.html`.

## Für Sitzungen, die hier arbeiten

Lies **START_HIER.md**, dann **STAND.md**. STAND.md beschreibt die ausgelieferte Linie
und die Autorentscheide, die Teile des älteren Kanons überholen. Nachrichten zwischen den
parallel arbeitenden Sessions stehen in **AUSTAUSCH.md**.

## Bauen

```
bash quelle/bauen.sh                                   # Player v2 aus quelle/v2
node skill/harness2.mjs                                # 43 Tests
node skill/abgleich2.mjs                               # Vorabnahme gegen gold/extrempunkte.html
node skill/lauf2.mjs quelle/x.json [--dump]            # ganze Radstrecke, 0 Fehler
node skill/blattkino/pruefe.mjs quelle/x.json skill/blattkino/player.html
node skill/blattkino/baue.mjs quelle/x.json skill/blattkino/player.html x.html
```
