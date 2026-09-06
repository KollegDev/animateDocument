# dokumente/ (Besitz Bau)

Die Quelldokumente der Trials, damit jeder Kopf ein eigenes Inventar bilden kann (EL19,
Lesart 2). Je PDF ein Ordner mit den Seitenbildern (90 dpi, JPEG), genau die Bilder, die
eine Trial-Session bekommt. Seitenangaben im Projekt nennen immer Datei und Seite dieses
Ordners.

| Datei | Seiten | Inhalt | Trials |
|---|---|---|---|
| `KurvendiskKurz.pdf` | 3 | Extrempunkte, Kurzfassung; Quelle des Goldfilms | Goldlauf, Trial 1 (S. 1 bis 3) |
| `Testdokument.pdf` | 4 | Kurvendiskussion, Anfang: Übersicht, Definitions- und Wertebereich | Trial 2 und 3 (S. 1 bis 4) |
| `Testdokumentgross.pdf` | 40 | Kurvendiskussion 1, ganz (Dateiname ohne ß, im Upload „Testdokumentgroß.pdf") | Trial 4 (S. 30 bis 32, Wendepunkte), Trial 5 (S. 9 bis 12, y-Achsenschnittpunkt und Nullstellen); `filme/kurvendiskussion-1.json` aus S. 1 bis 8 |

Achtung Zählung: Gold hat dasselbe grosse Dokument in einer 52-Seiten-Fassung gesehen
(gold/INVENTAR_kurvendisk1.md). Die Seitenzahlen dort sind nicht die hier.

Bilder neu erzeugen: `pdftoppm -r 90 -jpeg -jpegopt quality=80 NAME.pdf NAME/seite`.
