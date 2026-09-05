# PLAYER: Eigenschaften, didaktischer Grund, Invarianten

Der Player ist player.html (Bau-Details, Quellordner und Werkzeuge: STAND.md, Besitz der Bau-Session). Diese Datei hält das WARUM und die Invarianten, gegen die jede Änderung geprüft wird.

## Bauform und didaktischer Grund

| Eigenschaft | Grund |
|---|---|
| Stehende Bühne, Wischen dreht nur den Fortschritt (Rad); stufenlos, kein Einrasten | eine einzige Mechanik, berechenbare Geste (EL7); Autorentscheid „kontinuierlich by design" |
| Ein Bogen = ein Blatt = ein Bildschirm; Blöcke bleiben bis Bogenende stehen | das Blatt ist der ausgelagerte Speicher des Lesers (ersetzt die wachsende Rolle; AL10-Zweck bleibt erfüllt) |
| Jeder Beat kostet dieselbe Radstrecke; gewicht steuert nur das Aufbautempo im Beat | ungleiche Strecken machen die Geste unberechenbar; wer verweilen will, hält an |
| Keine Sprachausgabe, keine Untertitelzeile, kein Laufzeit-Aufruf, keine Anmeldung; alles vorkompiliert | Autorentscheid 2026-09-04 („Viewer, kein Kino"); minimale Onboarding-Reibung, keine Inferenzkosten; gemessen: Laufzeit nimmt keine Bilder an |
| Mobile first, Vollbild-Tor auf kleinen Geräten, Fortschritt senkrecht rechts | Wischgeste kollidiert sonst mit der Adresszeile |
| 22 Operationen, darunter die vier Geräte wert, doppelgraph+binden, bildfolge, zoomfolge | wert bindet Zahl an Bildstelle (L10 Split-Attention); doppelgraph+binden ist das kanonische f/f′-Wirkmittel (L37); bildfolge trägt Konvergenz als Bildfolge mit Werten (GOLD C3); zoomfolge zeigt lokale Geradheit (Grundkonzept K14) |
| Rückfall: ohne Scroll-Timeline ein Scroll-Lauscher; bei prefers-reduced-motion ein gewöhnliches Dokument | Zugänglichkeit vor Effekt |

## Invarianten (Schnittstellen, Änderung nur mit Autorentscheid plus Ankündigung im AUSTAUSCH)

1. Filmformat: {titel, quelle, inventar?, boegen:[{frage, beats:[{sub, gewicht, fokus, payoff, ops:[…]}]}]}; flache beats-Liste gilt als ein Bogen.
2. Auslieferung: player.html?film=filme/X.json (gleiche Herkunft, .json, kein ..) oder baue.mjs als eigenständige HTML.
3. Prüfer: node pruefe.mjs FILM.json PLAYER.html; Fehlercode 1 bei schwerem Befund; eine Zeile je Befund.
4. Blattgrenzen: Bogen passt auf 698 px (Graph 230, Doppelgraph 460, 8 px je Fuge); über 5 Beats je Bogen grenzwertig, über 6 schwer.
5. Kein Publish ohne node --check, grünen harness-viewer (80 Tests) und Prüfer 0 schwer über jeden Film (STAND.md §7).

## Bodenwahrheit

Der Prüfer misst Mechanik, nie didaktische Güte (belegt: 0/0/0 bei gleichzeitig neun realen Skill-Mängeln). Golden-Lauf und Autorurteil liegen bei der Projektsteuerung (ITERATION.md).
