# PLAYER: Eigenschaften, didaktischer Grund, Invarianten

Der Player ist player.html, seit 2026-09-05 v2: Kern ist der Skriptteil des Goldlaufs, alles ist eine Funktion des Radstands f(p), ein rAF je Scroll-Ereignis, kein zweiter Mechanismus (B14 bis B16). Baudetails und Werkzeuge: STAND.md; Formatreferenz: skill/blattkino/REFERENCE.md. Diese Datei hält das WARUM und die Invarianten.

## Bauform und didaktischer Grund

| Eigenschaft | Grund |
|---|---|
| Stehende Bühne, Wischen dreht nur den Fortschritt; stufenlos; Aufbau füllt die Beatstrecke lückenlos, keine Ruhezonen | eine Mechanik, berechenbare Geste (EL7); Kontinuität ist Autorbefund (AL17/GL3) |
| Ein Bogen = ein Blatt = ein Bildschirm; Blöcke bleiben bis Bogenende; Kreuzblende | das Blatt ist der ausgelagerte Speicher des Lesers; Verallgemeinerung nur mit Beleg auf dem Blatt (EL12/EL15) |
| Jeder Beat kostet dieselbe Radstrecke; gewicht wird ignoriert (LEICHT im Prüfer) | gleiche Schritte, Kontrolle beim Leser (GL3) |
| Vorkompiliert: kein Laufzeit-Aufruf, keine Anmeldung, keine Sprachausgabe; sub ist sichtbarer Lesertext | Autorentscheid 2026-09-04; minimale Reibung |
| Mobile first: Handy-Rahmen ab 700 px, Vollbild-Tor, Fortschritt senkrecht rechts | Wischgeste gegen Adresszeile |
| Geräte-Vokabular: v1-Ops als Items plus Goldlauf-Geräte (fahrt, pfeil, flug, kappe, aufstieg, gruppe, serie, marke, merk, zeile/chip, paar, wert, doppelgraph+binden, bildfolge, zoomfolge); jedes Gerät hat eine benannte Beziehung | AL1/AL2/AL8; Farbe nur auf der bewegten Zahl (AL15), Pfeil mündet in die Klammer (AL16), teure Bewegung einmal (AL18) |
| serie als Vorlage mit Platzhaltern in der Filmdatei; der Player bleibt themenfrei | EL17; identische Choreographie je Fall ist Konstruktion |
| Kein Markup aus JSON (textContent, fett-Feld statt HTML) | Sicherheitsregel der Linie (B15a) |
| reduced-motion: gewöhnliches Dokument | Zugänglichkeit vor Effekt |

## Invarianten (Änderung nur mit Autorentscheid plus Ankündigung im AUSTAUSCH)

1. Filmformat v2 = v1 additiv erweitert (UEBERGABE_BAU §4 plus B15/G5-Festlegungen); alte Filme laufen unverändert, flache beats-Liste gilt als ein Bogen; Aliase math→zeile, plot→graph, merksatz→merk.
2. Auslieferung: player.html?film=filme/X.json (gleiche Herkunft, .json, kein ..) oder baue.mjs als eigenständige HTML.
3. Prüfer: node skill/blattkino/pruefe.mjs FILM.json PLAYER.html, Fehlercode 1 bei schwerem Befund, eine Zeile je Befund; kennt alle v2-Ops und entfaltet Serien wie der Player.
4. Blattgrenze: neues Höhenmodell (Blatt 755, Fuge 16, Zeile 26, Legende 24, graph-Höhe Parameter; schwer erst unter Skalierung 0,68).
5. Kein Ausliefern ohne node --check, harness2 grün und Prüfer über jeden Film; Struktur- und Textabgleich (abgleich2.mjs) ist die mechanische Vorabnahme gegen den Goldstandard.

## Bodenwahrheit

Der Prüfer misst Mechanik, nie didaktische Güte (EL11); vor Abgabe eines Films läuft das Simulat (EL16). Abnahmen macht der Autor am Handy.
