# LEHREN_ANIMATION

Die verdauten Lehren dieses Projekts, gegen Drift geschützt. Teil I übersetzt die Autorlehren des Autorenprojekts (LEHREN.md dort, L-Nummern) in Animationsanweisungen; die Quelle bleibt maßgeblich, wer tiefer will, liest sie dort samt Autorzitat. Teil II sind eigene, in dieser Session hart erarbeitete Lehren (Debugging-Bodenwahrheit). Jede Änderung an PROMPT.md oder am Player prüft zuerst, ob sie einer Lehre hier widerspricht.

## Teil I: Autorlehren, übersetzt für Film

**AL1. Die Leinwand zeigt Struktur, der Untertitel erklärt (aus L1).** Jede Kernaussage bekommt einen sichtbaren Träger (Formel, Paar, Graph, Tabelle, Liste); gesprochener Text ist Bindegewebe, ein Gedanke pro Satz. Ein Beat, der nur redet und nichts zeigt, ist ein Befund.

**AL2. Das ausgerichtete Paar ist das stärkste Wirkmittel (aus L1/GOLD B13, Autorwort „ist ENORM gut").** Zwei korrespondierende Formelzeilen vertikal ausgerichtet, Pfeile hin und zurück (ableiten nach rechts, integrieren nach links), korrespondierende Teile markiert. Der Player trägt dafür die pair-Operation; der Prompt setzt sie überall ein, wo ein Hin-und-zurück oder ein Vorher-Nachher gelehrt wird.

**AL3. Serien-Taktung lehrt das Muster (aus L2).** Ein Beispiel wird ausführlich animiert, dann folgen mehrere Beispiel-Beats derselben Form ohne weiteren Erklärtext; die Invariante steht in jeder Zeile in derselben ungekürzten Notationsgestalt (aus 4x wird 4x²/4, aus x wird 1x²/1). Die Serie variiert genau das Irrelevante.

**AL4. Bereichsform im Film (aus L3).** Ein Verfahrens-Abschnitt animiert: erst das Konzept in ein, zwei gesprochenen Sätzen, dann EIN Beispiel vollständig bis zum Ergebnis, dann viele gelöste Beispiele über den Problemraum, zuletzt kurz die Theorie. Ein angekündigtes Beispiel wird sofort zu Ende geführt, nie nur hingestellt.

**AL5. Ein-Minuten-Puffer ist Beat-Takt (aus L4/L35).** Jede geöffnete Spannung erreicht binnen etwa einer gesprochenen Minute ein nutzbares Ergebnis; kein fremder Beat steht in einem offenen Bogen. Der Takt hängt an der Sprechdauer.

**AL6. Kein Plan-Leak, kein Meta (aus L5).** Kein Untertitel spricht über den Film, den Plan, die Seite oder fehlenden Inhalt („diese Seite zeigt", „nun kommen wir zu"). Straight up value delivery; Entschuldigungs- und Verwaltungs-Beats sind verboten.

**AL7. Erster Beat nennt die Natur des Konzepts (aus L36).** Der Einstieg eines Abschnitts sagt in einem Satz, was die Sache IST („Die Ableitung sagt für jede Stelle, wie steil der Graph dort ist."), dann kommt sofort das Beispiel. Kein Anlauf, keine Klassifikations-Hülle.

**AL8. Jeder Wert bekommt sein Bild; der Doppelgraph erdet f und f′ (aus L37).** Wo f(2) oder f′(2) vorkommt, zeigt der Graph den Punkt; für den Zusammenhang zweier Funktionen zwei Systeme übereinander mit gestrichelten Vertikalen. Der sweep-Operator (wandernder Punkt) trägt „die Kurve entlanggehen", Grenzverhalten, Zulaufen aufs Minimum.

**AL9. Symbol-Erdung (aus L38).** Jedes neue Symbol wird beim ersten Auftritt im bekannten Bild verankert (f(x) ist das y, die Höhe; f′(x) ist das m der Berührgeraden), als kurzer gesprochener Anker plus Bildmarkierung.

**AL10. Mini-Reprise statt Verweis (aus L41).** Der Film verweist nie auf etwas, das älter als etwa eine Minute ist; Gebrauchtes wird klein neu gezeigt (Formelzeile erneut, Bild wiederholt). Die wachsende Rolle macht das billig.

**AL11. Zahlen zeigen die Operation (aus L6).** Demonstrationszahlen nie neutral (keine 1 bei Multiplikation), Ergebnisse angenehm, kein Zwischenschritt, den die Regel nicht erzeugt.

**AL12. Dokumenttreue ist absolut (aus L7/B12 plus eigene Lehre EL3).** Formeln exakt in der Schreibweise des Dokuments, nur dessen Notation, keine Universitätsnotation, B2-Sprache. Der Film führt auf, was das Dokument lehrt; er dichtet nie.

**AL13. Beispiele schlagen Anweisungen, auch im Prompt (aus L26).** Der Regie-Prompt trägt ein durchgerechnetes Beispiel-Beat-Paar statt nur Maximen; LLMs generalisieren aus Beispielen stark, aus Maximen schwach.

**AL14. Untertitel in gesprochener Sprache.** Formeln werden im Untertitel ausgesprochen („f von x gleich eins durch x minus vier"); Symbole gehören auf die Leinwand. Grundlage der TTS-Qualität (EL5).

## Teil II: Eigene Lehren (Debugging-Bodenwahrheit dieser Session)

**EL1. Textlose PDFs sind der Normalfall, nicht der Sonderfall.** Mathcha-Exporte (und Scans) haben keine Textebene; pdf.js, pypdf und pdftotext extrahieren 0 Zeichen. Seiten ohne Text laufen über den Vision-Pfad: Seite als JPEG rendern und dem Regie-Call als Bild geben. Ein Prozess, der das nicht kann, halluziniert (EL2).

**EL2. Leerer Input erzeugt überzeugende Lügen.** Frühe Versionen spielten flüssige Filme aus leeren Seitentexten; der Inhalt war erfunden (erfundenes f: R → R, fehlende Graphen). Merksatz: Ein funktionierender Film beweist keine Treue. Treue wird mechanisch geprüft, nie geglaubt.

**EL3. Treue wird erzwungen, nicht erbeten.** Drei Stufen: (1) Der Regie-Call liefert zuerst ein wörtliches Inventar der Seite (Formeln exakt, Graphen mit Punkten und Bereichen, Listen), dann Beats mit Abdeckungspflicht. (2) Ein mechanischer Check ohne LLM (coverageGaps) vergleicht Inventar gegen Beats. (3) Lücken lösen genau einen Reparatur-Call aus. Das ist das Kaltleser-Prinzip des Autorenprojekts als Laufzeitmechanik.

**EL4. Der Formel-Parser ist eine Fehlerquelle erster Klasse.** Zwei stille Totalausfälle kamen aus compileExpr: Platzhalter, die echte Ziffern zerstörten, und die JS-Fallen unäres Minus vor Potenz sowie implizite Multiplikation (2x). Jede Parser-Änderung läuft gegen die expr-Batterie im Harness.

**EL5. TTS-Qualität ist Stimmwahl plus Sprech-Übersetzung.** Rangliste: Online-Natural (Edge) vor Google vor Enhanced/Siri; alte SAPI-/eSpeak-Stimmen ans Ende. Symbole vor dem Sprechen übersetzen (f(x) → f von x, ^2 → Quadrat, / → durch). Rate und Pitch neutral; Tempo nur über den Nutzerfaktor. Stimmen-Dropdown, weil das Angebot systemabhängig ist.

**EL6. Zustimmung und Parallelität kollidieren.** Vor parallelen LLM-Calls läuft ein einzelner Aufwärm-Call, der die einmalige Zustimmung auslöst; Fähigkeits-Abfragen (limits) werden optimistisch behandelt, nur eine ausdrückliche Absage schaltet ab. Jeder Fehlschlag zeigt seinen Code sichtbar in der Statuszeile, nie stiller Reset.

**EL7. Eine Timeline, eine Mechanik.** Natives Scrollen und Animationssteuerung dürfen nie konkurrieren. Es gibt nur die virtuelle Timeline-Position; das Mausrad verschiebt sie stufenlos, renderT stellt jeden Zwischenzustand deterministisch her (Opazität, Kurven-Zeichenfortschritt über stroke-dashoffset). Rückspulen ist mechanisches Rückgängigmachen, gratis.

**EL8. Ein Call pro Seite, alle Seiten parallel.** Inventar und Beats in einem Call; Ergebnisse in Dokumentreihenfolge platziert, spielbar ab Seite 1. Sequenzielle Mehrfach-Calls pro Seite waren der Latenz-Killer.

**EL9. Der Harness ist die Laufkarte des Codes.** Vor jedem Publish: node --check über das extrahierte Skript plus harness.mjs (gemockte Claude-Laufzeit, Retry-Pfad, Reparatur-Pfad, Playback, Rückspulen, Vertiefung, expr-Batterie). Eine Änderung ohne grünen Harness ist nicht gelaufen.

**EL10. UI-Vorgaben des Autors sind Bestand.** Simplicity first; breiter Knopf „Anhalten (Frage stellen)"; Play-Dreieck mittig; Ladekatze, darunter Ladekreis, darunter „Video wird vorbereitet :-)"; Geschwindigkeit über + und −. Nur auf Autorbefund anfassen.

## Teil III: Geltungsgrenzen nach Autorentscheid 2026-09-04 (Bauform Blatt statt Kino)

Die Lehren oben bleiben als Fallgeschichte gültig; ihre ANWEISUNGEN gelten mit diesen Grenzen (Delta vollständig in STAND.md §0/§6):

- AL5 (Takt an Sprechdauer): ersetzt. Es gibt keine Stimme; jeder Beat kostet dieselbe Radstrecke, gewicht steuert nur das Aufbautempo. Der Ein-Minuten-Puffer lebt weiter als Blattgrenze und Beat-Kappe je Bogen (Prüfer).
- AL14 und EL5 (gesprochene Sprache, TTS-Stimmwahl): TTS gegenstandslos. sub ist SICHTBARER Lesertext auf dem Blatt (der Player rendert ihn als Prosablock, DD6); er ist nie Planungsnotiz.
- AL10 (Mini-Reprise, wachsende Rolle): Zweck bleibt, Träger neu. Innerhalb des Bogens trägt das stehenbleibende Blatt; über Bogengrenzen hinweg gilt weiter: neu zeigen statt verweisen.
- AL2 (ausgerichtetes Paar): Wirkmittel bleibt Pflichtwissen; sein Träger im 22er-Vokabular ist zu klären (offene Frage P1 im AUSTAUSCH). Bis dahin: umformung/math so setzen, dass korrespondierende Zeilen vertikal ausgerichtet stehen.
- EL1/EL2 (Vision, Halluzination aus leerem Input): Kernaussage bleibt; der Ort wechselt. Nicht der Player sieht, die verarbeitende Sitzung sieht das Dokument an (gemessen: Laufzeit ohne images). Treue bleibt erzwungen (Inventar plus Prüfer).
- EL6 (Aufwärm-Call, Zustimmung) und EL8 (parallele Seiten-Calls): gegenstandslos im Player (kein Laufzeit-Aufruf); als Muster für Skill-Sitzungen weiter brauchbar.
- EL7 (eine Timeline-Mechanik): bestätigt und verschärft; die Seite bewegt sich nie, nur das Rad.
- EL9 (Harness-Pflicht): Träger sind jetzt skill/harness-viewer.mjs (80 Tests) und skill/blattkino/pruefe.mjs; der alte harness.mjs ist mit der alten Linie archiviert.
- EL10 (UI-Bestand): abgelöst durch die Autorentscheide in STAND.md §6 (Tor, Vollbild, Fortschritt rechts, kein Kino).
- Neu EL11: Der mechanische Prüfer beweist nie didaktische Güte (0/0/0 bei neun realen Mängeln); Skills werden gegen frische Sitzungen getestet, die Bodenwahrheit bleibt das Autorurteil.
- EL12 (neu gefasst 2026-09-05 nach B9/DD2): Mustertragende Belege und ihre Regel gehören auf EIN Blatt; eine Verallgemeinerung steht nur auf einem Blatt, das mindestens einen ihrer Belege trägt. fortsetzung ist legitim für Konsolidierung nach der Regel (weitere Aufgaben, jetztihr) und für Belege nur mit verkleinerter Reprise. Passt beides nicht, ist der Bogen zu voll oder die Serie zu lang. Merksätze werden nie zu text degradiert. (Erstfassung war falsch begründet: Ursache war eine Prüferzählung je Bogen, der didaktische Kern bestand; Wahrnehmung des Lesers bleibt der Maßstab.)

## Teil IV: Autorbefunde am Goldlauf und angenommene DD-Regeln (2026-09-05)

Quelle wörtlich: AUSTAUSCH G3/G5, gold/LEHREN_GOLD (GL1 bis GL6), DD2 bis DD8; Prüferregeln dazu baut die Bau-Session (B14/B16).

**AL15. Farbe nur auf der bewegten Zahl (GL1).** Genau eine Farbe je Kandidat, und sie sitzt nur auf der Zahl, die wandert oder eingesetzt wird, nie auf der Zeile. Autorwort: Farbe ohne Beziehung ist Lärm und kann verwirren.

**AL16. Der Pfeil zeigt Einsetzen (GL2).** Er mündet von oben in die Klammer, nie am Zeilenanfang. Braucht eine andere Beziehung einen Pfeil, ist das ein eigenes Gerät mit eigenem Grund.

**AL17. Keine Ruhezonen (GL3).** Jede Bewegung des Fingers bewegt etwas; der Aufbau füllt die Beatstrecke lückenlos, Blattwechsel eingeschlossen. Ungleich lange Schritte sind Kontrollverlust.

**AL18. Die teure Bewegung einmal (GL4, Simulat-Lesung).** Eine aufwendige Choreographie (etwa das Zusammenfliegen eines Ergebnisses) läuft einmal beim Erklären; in der Serie trägt nur noch das konstante Muster. Ab der zweiten Wiederholung lenkt sie ab.

**EL13. payoff ist die Tilgung (DD4).** Der payoff-Beat tilgt die Schuld des Bogens; Konsolidierung (Merksatz nach der Regel, jetztihr, Übungstabelle) darf danach stehen. Ein payoff, der nur konsolidiert, ist keiner.

**EL14. Keine Meta-Fragen (DD5).** Die frage eines Bogens lebt im Leser, nie im Dokumentaufbau. Übersichts-Bögen ohne lebende Frage sind als uebersicht:true ehrlich markiert. Die Lernreise nennt ausdrücklich, wo die Filmordnung von der Dokumentordnung abweicht, oder dass die Dokumentordnung die Lernordnung ist.

**EL15. Das fertige Blatt ist der Überflieg (DD6).** Am Bogenende muss das stehende Blatt die Aussage allein tragen, ohne erinnerte Reihenfolge. Bögen unter drei Beats sind ein Befund, außer als uebersicht oder Reprise markiert.

**EL16. Simulat vor Abgabe (DD7).** Jeder Film läuft vor der Abgabe als Transkript durch das Schüler-Simulat (Zettel, Vorstellungs-Verbot, Regel- und Deutungsproben, Transferaufgaben, die im Film nicht vorkommen); Auftrag in gold/SIMULAT_AUFTRAG.md. Der mechanische Prüfer ersetzt das nie (EL11).

**EL17. Serien sind Vorlagen (B15c/G5).** Eine Serie steht als Vorlage mit Platzhaltern in der Filmdatei, der Player bleibt themenfrei; identische Choreographie je Fall ist damit Konstruktion, ungleiche Gerätemengen je Fall sind ein Befund.

