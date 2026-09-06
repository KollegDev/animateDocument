# Simulat v2: Selbsttest des Skills (Besitz Bau)

Der Schueler als Kaefig: `simulat2.mjs` haelt Whitelist, Zettel und Blaetter, baut je Blatt einen
Prompt fuer EINEN frischen Agenten (der nie ein frueheres Blatt gesehen hat), prueft dessen
JSON mechanisch (Quellenpflicht B:/Z:/W:, Zettel hoechstens vier Zeilen zu 90 Zeichen,
Budgets als Flags) und schreibt den naechsten Prompt. Nach dem letzten Blatt die Regelprobe
(Regelfassung, Fehlregeln mit Gegenbeispiel-Zitat, Transfer gegen hinterlegte Loesung,
Deutung, Schluss). `bericht` schreibt BERICHT.md und BERICHT.json.

```
node simulat2.mjs init    LAUF film.json WISSEN.json TRANSFER.json [FEHLREGELN.json] --thema "..."
# je Blatt: frischer Agent liest LAUF/prompt-NN.md, schreibt LAUF/antwort-NN.json, dann:
node simulat2.mjs antwort LAUF NN LAUF/antwort-NN.json      # zuletzt: antwort LAUF regel ...
node simulat2.mjs bericht LAUF
node simulat2.mjs nullfilm film.json nullfilm.json          # entkernter Film fuer den Nullfilm-Test
```

Dateien: `WISSEN-*.json` (Whitelist mit Kennungen; `-eng` ohne Loesungsweg), `TRANSFER-*.json`
(Aufgaben mit Loesung und `verboten`: Terme, die nicht im Film stehen duerfen),
`FEHLREGELN-*.json` (Vorrat je Thema). Berichte und Rohantworten der Projektlaeufe liegen ausserhalb des Skills in `skill/simulat-laeufe/`.

In einer Skill-Sitzung (SKILL.md Schritt 7): `init`, dann je Prompt-Datei EIN frischer Agent, der nur diese Datei liest und sein JSON schreibt, dann `antwort`, zuletzt `bericht`. Fuer ein neues Thema zuerst `WISSEN-<thema>.json` (Vorwissen laut Buchreihenfolge, ohne Loesungsweg des Themas), `TRANSFER-<thema>.json` (zwei Aufgaben derselben Sorte, nicht im Film, mit Loesung) und bei Bedarf Fehlregeln aus `FEHLREGELN-kurvendiskussion.json` waehlen.

Laeufe 2026-09-06 (Sonnet als Schueler, Haiku bei null2h): AUSTAUSCH B25.
