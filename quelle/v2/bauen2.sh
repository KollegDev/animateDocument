#!/bin/bash
# Player v2: Kopf + kern2 + engine2 + ops2 + laufzeit2 -> player2.html (mit Platzhaltern) und player.html (leer)
set -e
HIER="$(cd "$(dirname "$0")" && pwd)"; WURZEL="$(dirname "$(dirname "$HIER")")"
python3 - "$HIER" "$WURZEL" <<'PY'
import io,sys
hier,wurzel=sys.argv[1],sys.argv[2]
kopf=io.open(hier+'/kopf2.html',encoding='utf-8').read()
js='\n'.join(io.open(hier+'/'+f,encoding='utf-8').read() for f in ['kern2.js','engine2.js','ops2.js','laufzeit2.js'])
out=kopf+"<script>\n'use strict';\n"+js+"\n</script>\n</body>\n</html>\n"
io.open(wurzel+'/quelle/v2/player2.html','w',encoding='utf-8').write(out)
print('player2.html',len(out),'Zeichen')
PY
