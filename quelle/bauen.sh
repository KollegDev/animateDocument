#!/bin/bash
# Setzt den Spieler aus seinen drei Teilen zusammen: Kopf mit CSS, Kern mit Mathe, Logik.
# Ergebnis: skill/blattkino/player.html mit den Platzhaltern __TITEL__ und __BEATS_JSON__.
set -e
HIER="$(cd "$(dirname "$0")" && pwd)"
WURZEL="$(dirname "$HIER")"
python3 - "$HIER" "$WURZEL" <<'PY'
import io,sys
hier,wurzel=sys.argv[1],sys.argv[2]
kopf=io.open(hier+'/viewer-kopf.html',encoding='utf-8').read()
kern=io.open(hier+'/kern.js',encoding='utf-8').read()
js  =io.open(hier+'/viewer-js.js',encoding='utf-8').read()
assert js.count('__KERN__')==1, 'Platzhalter __KERN__ fehlt'
out=kopf+'\n<script>\n'+js.replace('__KERN__',kern)+'\n</script>\n'
io.open(wurzel+'/skill/blattkino/player.html','w',encoding='utf-8').write(out)
# Der Spieler ohne eingebauten Film, fuer player.html?film=...
io.open(wurzel+'/player.html','w',encoding='utf-8').write(
    out.replace('__TITEL__','Blattkino').replace('__BEATS_JSON__','null'))
print('player.html', len(out), 'Zeichen')
PY
