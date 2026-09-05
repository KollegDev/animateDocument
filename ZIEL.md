# ZIEL des Animationsprojekts (Blattkino)

Stand 2026-09-05, nachgezogen auf den Autorentscheid vom 2026-09-04 (STAND.md §0/§6).

## Das Ziel

Blattkino verwandelt ein Dokument in ein scrollgesteuertes Lehrblatt. Die Seite steht still; Wischen dreht nur den Fortschritt einer Animation, die auf einer stehenden Bühne abläuft. Ein Bogen des Stoffs ist ein Blatt und ein Blatt ein Bildschirm: Die Blöcke legen sich von oben nach unten dazu und bleiben stehen, bis der Bogen endet, denn das Blatt ist der ausgelagerte Speicher des Lesers. Das Projekt baut zwei Artefakte. Erstens den Player (player.html), eine einzelne HTML-Datei ohne Anmeldung, ohne Sprachausgabe und ohne Aufruf zur Laufzeit, der eine JSON-Filmdatei deterministisch aufführt. Zweitens den Skill (skill/blattkino), der eine beliebige LLM-Sitzung mit einem Dokument befähigt, genau diese JSON-Datei zu erzeugen: Anweisung, Formatreferenz, ein mechanischer Prüfer, der gegen die Autorlehren misst und mit Fehlercode abbricht, ein Bauwerkzeug und ein bestandenes Beispiel. Die verarbeitende Sitzung ist das Auge; der Player sieht nichts und rechnet nichts.

## Die Herkunft

Zwei Projekte: Das Autorenprojekt (Geschwisterordner, eingefroren auf Commit c7097d3) ist der reproduzierbare Schreibprozess mit dem Autorurteil als Bodenwahrheit und den Lehren in LEHREN.md; Blattkino ist seine bewegte Aufführung. Didaktisch optimales Animieren baut auf didaktisch fähigem Schreiben auf: Der Skill erkennt die didaktischen Träger eines Dokuments und übersetzt sie in Bewegung, er erfindet sie nie.

## Was reproduzierbar heißt

Eine frische, blinde Session, die nur die Kanon-Dateien liest (START_HIER, ZIEL, KANON, LEHREN_ANIMATION, PLAYER, ITERATION, LAUFKARTE) plus STAND.md der Bau-Session, kann ohne Sitzungsgeschichte weiterarbeiten. Jede Autorkorrektur und jede Debugging-Erkenntnis wird als Lehrstück verdaut; nichts lebt nur im Chatverlauf.

## Was fertig heißt

Ein Dokument ergibt ohne Handarbeit einen Film, den der Autor billigt; Autorbefunde pro Film fallen und betreffen überwiegend Geschmack. Kein interner Messwert ersetzt das Autorurteil (der Prüfer fängt Mechanik, nie Verständnis, STAND.md §8).
