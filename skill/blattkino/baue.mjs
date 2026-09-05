#!/usr/bin/env node
// Baut aus einer Blattkino-Datei und dem Spieler eine fertige HTML-Seite.
// Aufruf:  node baue.mjs film.json [player.html] [ziel.html]
import fs from 'fs';
import path from 'path';

const hier = path.dirname(new URL(import.meta.url).pathname);
const quelle = process.argv[2];
if(!quelle){ console.error('Aufruf: node baue.mjs film.json [player.html] [ziel.html]'); process.exit(2); }
const spieler = process.argv[3] || path.join(hier,'player.html');
const ziel    = process.argv[4] || quelle.replace(/\.json$/,'')+'.html';

const daten = JSON.parse(fs.readFileSync(quelle,'utf8'));
const tpl   = fs.readFileSync(spieler,'utf8');

// Der Datenblock steht in einem script-Element. Steht irgendwo im Text "</script>",
// wuerde er die Seite zerreissen. Darum wird jedes "</" entschaerft; JSON liest "<\/" als "</".
const json = JSON.stringify(daten).replace(/<\//g,'<\\/').replace(/[\u2028\u2029]/g,m=>'\\u'+m.charCodeAt(0).toString(16));
const titel = String(daten.titel||'Blattkino').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));

if(!tpl.includes('__TITEL__')||!tpl.includes('__BEATS_JSON__')){
  console.error('Der Spieler enthaelt die Platzhalter nicht.'); process.exit(1);
}
fs.writeFileSync(ziel, tpl.replace('__TITEL__',titel).replace('__BEATS_JSON__',json), 'utf8');
console.log(ziel+'  '+fs.statSync(ziel).size+' Bytes');
