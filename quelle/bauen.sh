#!/bin/bash
# Baut Player v2 aus quelle/v2 und liefert ihn an player.html und skill/blattkino/player.html.
# Filme liegen nur in filme/ (Quelle) und blindtest/*/film.json; quelle/ enthaelt nur Spielerquellen.
set -e
HIER="$(cd "$(dirname "$0")" && pwd)"; WURZEL="$(dirname "$HIER")"
bash "$HIER/v2/bauen2.sh"
python3 - "$WURZEL" <<'PY'
import io,sys
w=sys.argv[1]
tpl=io.open(w+'/quelle/v2/player2.html',encoding='utf-8').read()
io.open(w+'/skill/blattkino/player.html','w',encoding='utf-8').write(tpl)
io.open(w+'/player.html','w',encoding='utf-8').write(tpl.replace('__TITEL__','Blattkino').replace('__BEATS_JSON__','null'))
# Eine Wahrheit: filme/ ist die Quelle der Filme, der Skill traegt den Goldfilm als Kopie
io.open(w+'/skill/blattkino/beispiel-extrempunkte.json','w',encoding='utf-8').write(io.open(w+'/filme/extrempunkte.json',encoding='utf-8').read())
print('player.html, skill/blattkino/player.html = v2; beispiel-extrempunkte.json = filme/extrempunkte.json')
PY
