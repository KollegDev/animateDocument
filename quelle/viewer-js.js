'use strict';
const $=id=>document.getElementById(id);

__KERN__

const LEER={titel:'Blattkino',quelle:'',boegen:[]};
// Die Einheit ist der Bogen: eine Spannung von der Oeffnung bis zur Aufloesung.
// Eine flache Beat-Liste wird als ein einziger Bogen gelesen.
function lesen(j){
  if(!j||typeof j!=='object')return LEER;
  if(Array.isArray(j.boegen))return j;
  if(Array.isArray(j.beats))return Object.assign({},j,{boegen:[{beats:j.beats}]});
  return Object.assign({},LEER,{titel:j.titel||'Blattkino',quelle:j.quelle||''});
}
let DATEN=(()=>{
  const k=$('blattkino-daten');
  if(!k)return LEER;
  try{ return lesen(JSON.parse(k.textContent)); }catch(e){ return LEER; }
})();

const doc=$('doc');
const esc=t=>{const d=document.createElement('span');d.textContent=String(t??'');return d.innerHTML;};
const TEX_VERBOTEN=/\\(href|url|includegraphics|input|include|write|openout|def|let|newcommand|renewcommand|require|style|class|cssId|unicode|toggle)\b/gi;
function sauberTex(t){ const x=String(t??'').slice(0,600); return x.trim()?x.replace(TEX_VERBOTEN,''):''; }
const el=(tag,cls)=>{ const e=document.createElement(tag); if(cls)e.className=cls; return e; };

// ================= Zustand beim Aufbau =================
// Die Buehne steht. Gebaut wird eine Liste von Szenen, jede mit Takten, jeder Takt mit
// Stuecken. Ein Stueck ist, was gleichzeitig erscheint. Die Zeit wird erst danach verteilt.
const SZENEN=[];        // {kn, frage, blatt, mitBild, takte:[]}
let szene=null;         // laufende Szene
let takt=null;          // laufender Takt {kn, stuecke:[], gewicht, bildAb:null}
let ziel=null;          // wohin Textelemente wandern (der Takt-Knoten)
let plots={};           // id -> {api,fn}
let gewicht=2;
const mathKnoten=[];

function szeneAuf(frageText){
  const s=el('section','szene');
  const f=el('p','frage');
  if(frageText){ f.textContent=String(frageText); s.appendChild(f); }
  // Ein Bogen ist ein Blatt. Es fuellt sich von oben nach unten und behaelt alles,
  // bis der Bogen zu Ende ist: es ist der ausgelagerte Speicher des Lesers.
  const blatt=el('div','blatt');
  s.appendChild(blatt);
  doc.appendChild(s);
  szene={kn:s, frage:frageText?f:null, blatt:blatt, takte:[], mitBild:false};
  SZENEN.push(szene);
  ziel=blatt; plots={};
}
function taktAuf(g,fokus){
  // Ein Takt ist nur noch ein Zeitabschnitt, kein eigener Kasten: alles steht im Blatt.
  takt={stuecke:[], gewicht:g, fokus:!!fokus, kurve:null, zoomer:null};
  szene.takte.push(takt);
  ziel=szene.blatt;
}
// Ein Stueck: was gleichzeitig erscheint. luft ist Wartezeit davor, in Stueckbreiten.
function stueck(knoten,luft){
  const liste=(Array.isArray(knoten)?knoten:[knoten]).filter(Boolean);
  if(!liste.length||!takt)return;
  takt.stuecke.push({kn:liste, luft:+luft||0});
}
function setzen(e,mitMath,luft){
  e.classList.add('el');
  ziel.appendChild(e);
  stueck(e,luft);
  if(mitMath)mathKnoten.push(e);
}
function schritt(knoten,art){
  if(!knoten)return;
  const liste=(Array.isArray(knoten)?knoten:[knoten]).filter(Boolean);
  liste.forEach((k,i)=>{ if(k.classList){ k.classList.add('schritt');
    const a=Array.isArray(art)?(art[i]||art[art.length-1]):art; if(a)k.classList.add(a); } });
  stueck(liste);
}
// Ein Bild ist ein Block im Blatt und erscheint wie jedes andere Stueck.
function bildAuf(svg){
  const kasten=el('div','bild'); kasten.appendChild(svg);
  szene.blatt.appendChild(kasten); szene.mitBild=true;
  stueck(kasten);
  return kasten;
}
function plotAuf(o){
  const cfg={xmin:num(o.xmin,-5),xmax:num(o.xmax,5),ymin:num(o.ymin,-5),ymax:num(o.ymax,5),
    legend:o.legend?String(o.legend):''};
  if(cfg.xmax<=cfg.xmin)cfg.xmax=cfg.xmin+1; if(cfg.ymax<=cfg.ymin)cfg.ymax=cfg.ymin+1;
  return cfg;
}
function kurveZeichnen(p,fn){
  p.curve(fn,false);
  for(const c of p.curvePaths){ if(c.p.classList.contains('kurve'))continue;
    c.p.classList.add('kurve'); c.p.style.setProperty('--laenge',c.L); c.p.style.strokeDasharray=c.L;
    if(takt&&!takt.kurve)takt.kurve=c.p; }
}
function steigung(fn,x){
  const h=Math.max(1e-4,Math.abs(x)*1e-4);
  try{ const a=fn(x-h), b=fn(x+h); const m=(b-a)/(2*h); return isFinite(m)?m:null; }catch(e){ return null; }
}

const OPS={
  clear(){ /* Auf der Buehne trennt die Szene. Bleibt als alter Name gueltig. */ },
  h(o){ const e=el(szene&&szene.kn.querySelector('h2')?'h3':'h2'); e.textContent=String(o.t??''); setzen(e); },
  text(o){ const e=el('p','txt'); e.textContent=String(o.t??''); setzen(e); },
  item(o){ const e=el('div','item'); e.innerHTML='<b>–</b><span>'+esc(o.t)+'</span>'; setzen(e); },
  math(o){ const tex=sauberTex(o.tex); if(!tex)return;
    const e=el('div','mathline'+(o.hl?' hl':'')); e.textContent='\\('+tex+'\\)'; setzen(e,true); },
  note(o){ const e=el('div','notebox'); e.textContent=String(o.t??''); setzen(e); },
  // Mustertabelle: mehrere Zeilen, in jeder dieselbe ungekuerzte Gestalt
  tabelle(o){
    const zeilen=Array.isArray(o.zeilen)?o.zeilen:[];
    if(!zeilen.length)return;
    const t=el('table','mtab');
    if(Array.isArray(o.kopf)&&o.kopf.length){
      const tr=el('tr'); for(const k of o.kopf){ const th=el('th');
        th.textContent=String(k).replace(/^!/,''); tr.appendChild(th); }   // Koepfe sind immer Klartext
      const thead=el('thead'); thead.appendChild(tr); t.appendChild(thead);
    }
    const tb=el('tbody');
    for(const z of zeilen){
      const zellen=Array.isArray(z)?z:[z]; const tr=el('tr');
      zellen.forEach((c,i)=>{ const td=el('td'); const w=String(c??'');
        // Zellen sind LaTeX, ausser sie beginnen mit einem Ausrufezeichen
        if(w.startsWith('!')){ td.textContent=w.slice(1); td.className='vor'; }
        else { const tex=sauberTex(w); td.textContent=tex?'\\('+tex+'\\)':''; mathKnoten.push(td); }
        tr.appendChild(td); });
      tb.appendChild(tr);
    }
    t.appendChild(tb); setzen(t);
  },
  // Zwei korrespondierende Zeilen untereinander, mit Pfeilen in beide Richtungen.
  // Das validierte Wirkmittel: man sieht den Hin- und den Rueckweg zugleich.
  paar(o){
    const FARBEN=['#c25a22','#3b6fe0','#2f9c6a','#8b5cf6'];
    let oben=sauberTex(o.oben), unten=sauberTex(o.unten);
    if(!oben||!unten)return;
    // Korrespondierende Teile bekommen dieselbe Farbe, damit man sieht, was zu was gehoert
    // Gesucht wird rechts vom ersten Gleichheitszeichen, damit das x in "f(x)" nicht
    // faelschlich getroffen wird. Erst wenn es dort nicht steht, gilt die ganze Zeile.
    const faerben=(zeile,teil,farbe)=>{
      if(!teil)return zeile;
      const g=zeile.indexOf('=');
      const ab=g>=0?g+1:0;
      let i=zeile.indexOf(teil,ab);
      if(i<0)i=zeile.indexOf(teil);
      if(i<0)return zeile;
      return zeile.slice(0,i)+'\\color{'+farbe+'}{'+teil+'}'+zeile.slice(i+teil.length);
    };
    const paare=Array.isArray(o.paare)?o.paare:[];
    paare.forEach((pz,i)=>{
      if(!Array.isArray(pz)||pz.length<2)return;
      const f=FARBEN[i%FARBEN.length];
      oben =faerben(oben, String(pz[0]), f);
      unten=faerben(unten,String(pz[1]), f);
    });
    const k=el('div','paar');
    const z1=el('div','mathline'); z1.textContent='\\('+oben+'\\)'; k.appendChild(z1); mathKnoten.push(z1);
    const pf=el('div','pfeile');
    const zur=String(o.zurueck??'');
    const hin=String(o.hin??'');
    const l=el('span','zur'); l.textContent=zur?('\u2191 '+zur):'';
    const r=el('span','hin'); r.textContent=hin?(hin+' \u2193'):'';
    pf.appendChild(l); pf.appendChild(r); k.appendChild(pf);
    const z2=el('div','mathline'); z2.textContent='\\('+unten+'\\)'; k.appendChild(z2); mathKnoten.push(z2);
    setzen(k);
  },
  // Merksatz in Alltagssprache, ein Satz
  merksatz(o){ const e=el('div','merk'); e.textContent=String(o.t??''); setzen(e); },
  // Jetzt ihr: Aufgabe, dann eine Strecke, dann die Loesung
  jetztihr(o){
    const a=el('p','jetzt');
    const m=el('span','marke'); m.textContent='Jetzt ihr:'; a.appendChild(m);
    // Aufgabe und Loesung koennen Formel sein oder Klartext, und beides zugleich.
    const tex=sauberTex(o.aufgabe||o.aufgabeTex);
    if(o.t!==undefined&&String(o.t).trim()){
      const st=el('span'); st.textContent=String(o.t); a.appendChild(st); }
    if(tex){ const s2=el('span'); s2.textContent=' \\('+tex+'\\)'; a.appendChild(s2); mathKnoten.push(a); }
    setzen(a);
    const lo=el('div','loesung');
    const b2=el('b'); b2.textContent='Lösung'; lo.appendChild(b2);
    const lt=sauberTex(o.loesung||o.loesungTex);
    if(lt){ const s3=el('span'); s3.textContent='\\('+lt+'\\) '; lo.appendChild(s3); mathKnoten.push(lo); }
    if(o.loesungText!==undefined&&String(o.loesungText).trim()){
      const s4=el('div','dazu'); s4.textContent=String(o.loesungText); lo.appendChild(s4); }
    setzen(lo,false,2.6);   // erst nach einer Strecke Nachdenkzeit
  },
  // Eine Frage stehen lassen, dann eine Strecke Stille, dann kommt die Antwort
  frage(o){ const e=el('p','fragezeile'); e.textContent=String(o.t??''); setzen(e); },
  // Eine Umformung ist eine Bewegung: jede Zeile mit ihrem Grund, die vorige verblasst
  umformung(o){
    const zeilen=Array.isArray(o.zeilen)?o.zeilen:[];
    if(!zeilen.length)return;
    const k=el('div','kette'); 
    zeilen.forEach((z,i)=>{
      const tex=sauberTex(z&&z.tex); if(!tex)return;
      const w=(z&&z.warum)?String(z.warum):'';
      if(w){ const g=el('div','warum'); g.textContent='↓ '+w; k.appendChild(g); }
      const m=el('div','mathline'+(i<zeilen.length-1?' alt':''));
      m.textContent='\\('+tex+'\\)'; k.appendChild(m); mathKnoten.push(m);
    });
    setzen(k);
  },
  plot(o){ const fn=compileExpr(o.expr); if(!fn){ if(o.legend)OPS.note({t:'Graph: '+o.legend}); return; }
    const p=makePlot(plotAuf(o));
    bildAuf(p.svg);
    plots[o.id||'p']={api:p,fn};
    kurveZeichnen(p,fn); },

  // Zwei Koordinatensysteme uebereinander, dieselben Stellen durch senkrechte Striche verbunden.
  // Das ist das Geraet, mit dem man f und f' zusammendenken lernt.
  doppelgraph(o){
    const fn1=compileExpr(o.expr), fn2=compileExpr(o.expr2);
    if(!fn1||!fn2){ OPS.note({t:'Doppelgraph nicht darstellbar'}); return; }
    const H=290, LUFT=16;
    const c1=plotAuf(o);
    const c2=plotAuf({xmin:o.xmin,xmax:o.xmax,
      ymin:(o.ymin2!==undefined?o.ymin2:o.ymin), ymax:(o.ymax2!==undefined?o.ymax2:o.ymax),
      legend:o.legend2?String(o.legend2):''});
    const NS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(NS,'svg');
    svg.setAttribute('viewBox','0 0 440 '+(2*H+LUFT));
    svg.setAttribute('width','440'); svg.style.maxWidth='100%';
    // Zwei Systeme sind hoch. Sie duerfen den Lesestreifen nicht auffressen.
    svg.style.width='auto'; svg.style.display='block'; svg.style.margin='0 auto';
    const oben=makePlot(c1,svg,0);
    const unten=makePlot(c2,svg,H+LUFT);
    bildAuf(svg);
    const id=o.id||'p';
    plots[id]={api:oben,fn:fn1}; plots[id+'2']={api:unten,fn:fn2};
    plots['__doppel']={oben:oben,unten:unten,fn1:fn1,fn2:fn2};
    kurveZeichnen(oben,fn1); kurveZeichnen(unten,fn2);
  },

  // Eine Stelle x in beiden Systemen gleichzeitig zeigen, verbunden durch einen gestrichelten Strich
  binden(o){
    const d=plots['__doppel']; if(!d)return;
    const x=num(o.x,0); if(!isFinite(x))return;
    const A=d.oben, B=d.unten;
    if(x<A.cfg.xmin||x>A.cfg.xmax)return;
    const gruppe=[], arten=[];
    const strich=A.g('line',{x1:A.sx(x),y1:A.oy+A.pad-8,x2:A.sx(x),y2:B.oy+B.H-B.pad+8,
      stroke:'var(--pt)','stroke-width':1.2,'stroke-dasharray':'5 4',opacity:'.7'});
    gruppe.push(strich); arten.push('zeiger');
    const w1=A.wert(x,d.fn1,o.label?String(o.label):'');
    if(w1)for(const k of w1){ gruppe.push(k); arten.push(k.tagName==='circle'?'punkt':'zeiger'); }
    const w2=B.wert(x,d.fn2,o.label2?String(o.label2):'');
    if(w2)for(const k of w2){ gruppe.push(k); arten.push(k.tagName==='circle'?'punkt':'zeiger'); }
    schritt(gruppe,arten);
  },

  // Ein Wert steht gleichzeitig in der Formel und im Bild. Das behebt die geteilte Aufmerksamkeit.
  wert(o){
    const p=plots[o.id||'p']; const x=num(o.x,NaN);
    if(!p||!isFinite(x))return;
    const gruppe=[], arten=[];
    const tex=sauberTex(o.tex);
    if(tex){ const e=el('div','mathline hl'); e.textContent='\\('+tex+'\\)';
      e.classList.add('el'); ziel.appendChild(e); mathKnoten.push(e);
      gruppe.push(e); arten.push('zeiger'); }
    const w=p.api.wert(x,p.fn,o.label?String(o.label):'');
    if(w)for(const k of w){ gruppe.push(k); arten.push(k.tagName==='circle'?'punkt':'zeiger'); }
    schritt(gruppe,arten);
  },

  // Eine Folge von Bildern, die sich einem Grenzbild naehert. Nur das letzte bleibt stehen.
  bildfolge(o){
    const p=plots[o.id||'p']; if(!p)return;
    const stufen=Array.isArray(o.stufen)?o.stufen:[];
    if(!stufen.length)return;
    const art=o.art==='balken'?'balken':'sekante';
    const x0=num(o.x,0);
    stufen.forEach((st,i)=>{
      const letzte=i===stufen.length-1;
      let knoten=[];
      if(art==='balken'){
        const n=Math.max(1,Math.min(64,Math.round(num(st,4))));
        knoten=p.api.balken(p.fn,n).map(k=>p.api.hinten(k));
        const t=p.api.lab(p.api.W-p.api.pad,p.api.oy+p.api.pad+20,n+' Streifen','end','var(--accent)');
        knoten.push(t);
      }else{
        const h=num(st,1); let y0,y1;
        try{ y0=p.fn(x0); y1=p.fn(x0+h); }catch(e){ return; }
        if(!isFinite(y0)||!isFinite(y1))return;
        const m=(Math.abs(h)<1e-9)?steigung(p.fn,x0):(y1-y0)/h;
        if(m===null||!isFinite(m))return;
        knoten.push(p.api.gerade(x0,y0,m));
        if(Math.abs(h)>1e-9){ const pt=p.api.point(x0+h,y1,''); if(pt)knoten=knoten.concat(Array.isArray(pt)?pt:[pt]); }
        const txt=(Math.abs(h)<1e-9)?(o.ziel?String(o.ziel):'Beruehrgerade'):('h = '+(Math.round(h*1000)/1000));
        knoten.push(p.api.lab(p.api.W-p.api.pad,p.api.oy+p.api.pad+20,txt,'end','var(--accent)'));
      }
      knoten=knoten.filter(Boolean);
      if(!knoten.length)return;
      if(letzte){ for(const k of knoten)k.classList.add('letzte'); schritt(knoten,'zeiger'); }
      else schritt(knoten,'fluechtig');
    });
  },

  // Stufenloser Zoom in eine Stelle hinein, bis die Kurve von ihrer Beruehrgeraden nicht mehr
  // zu unterscheiden ist. Auf Papier braucht das drei starre Lupen, hier ist es eine Bewegung.
  zoomfolge(o){
    const fn=compileExpr(o.expr); if(!fn){ OPS.note({t:'Zoomfolge nicht darstellbar'}); return; }
    const p=makePlot(plotAuf(o));
    bildAuf(p.svg);
    plots[o.id||'p']={api:p,fn};
    kurveZeichnen(p,fn);
    const x=num(o.x,0); let y=NaN; try{ y=fn(x); }catch(e){}
    if(isFinite(y)){
      const m=steigung(fn,x);
      if(m!==null){ const gr=p.gerade(x,y,m); gr.setAttribute('stroke-dasharray','6 4'); }
      p.point(x,y,o.label?String(o.label):'');
    }
    // Alles bisher Gezeichnete kommt in eine Gruppe, die hineinfaehrt
    const NS='http://www.w3.org/2000/svg';
    const zoomer=document.createElementNS(NS,'g'); zoomer.setAttribute('class','zoomer');
    while(p.svg.firstChild)zoomer.appendChild(p.svg.firstChild);
    p.svg.appendChild(zoomer);
    const zf=Math.max(2,Math.min(40,num(o.zoom,8)));
    zoomer.style.setProperty('--zx',(isFinite(y)?p.sx(x):220)+'px');
    zoomer.style.setProperty('--zy',(isFinite(y)?p.sy(y):145)+'px');
    zoomer.style.setProperty('--zf',String(zf));
    if(takt)takt.zoomer=zoomer;
  },
  point(o){ const p=plots[o.id||'p']; if(p&&isFinite(+o.x)&&isFinite(+o.y))
    schritt(p.api.point(+o.x,+o.y,o.label?String(o.label):''),'punkt'); },
  hline(o){ const p=plots[o.id||'p']; if(p&&isFinite(+o.y))schritt(p.api.hline(+o.y,o.label?String(o.label):''),'strich'); },
  vline(o){ const p=plots[o.id||'p']; if(p&&isFinite(+o.x))schritt(p.api.vline(+o.x,o.label?String(o.label):''),'strich'); },
  region(o){ const p=plots[o.id||'p']; if(p&&isFinite(+o.y))
    schritt(p.api.region(+o.y,o.dir==='below'?'below':'above',o.label?String(o.label):''),'flaeche'); },
  sweep(o){ const p=plots[o.id||'p']; if(!p)return;
    const x=num(o.x1,0); let y=0; try{ y=p.fn(x); }catch(e){}
    if(isFinite(y))schritt(p.api.point(x,y,o.label?String(o.label):''),'punkt'); }
};


// ================= Bauen =================
function bauen(){
  document.documentElement.lang='de';
  document.title=String(DATEN.titel||'Blattkino');

  for(const bo of (DATEN.boegen||[])){
    const bs=(bo&&Array.isArray(bo.beats))?bo.beats:[];
    if(!bs.length)continue;
    szeneAuf(bo&&bo.frage?bo.frage:null);
    for(const b of bs){
      if(!b||typeof b!=='object')continue;
      // Der aufloesende Beat traegt Gewicht 3, wenn nichts anderes gesagt ist
      if(b.payoff===true&&b.gewicht===undefined)b.gewicht=3;
      gewicht=Math.max(1,Math.min(3,Math.round(+b.gewicht||2)));
      taktAuf(gewicht,b.fokus===true);
      const ops=Array.isArray(b.ops)?b.ops:[];
      // Eine Ueberschrift steht ueber ihrem Satz, nicht darunter
      let i=0;
      while(i<ops.length&&ops[i]&&(ops[i].op==='clear'||ops[i].op==='h')){
        try{ if(OPS[ops[i].op])OPS[ops[i].op](ops[i]); }catch(e){} i++; }
      if(typeof b.sub==='string'&&b.sub.trim()){
        const p=el('p','satz'); p.textContent=b.sub.trim(); setzen(p);
      }
      for(;i<ops.length;i++){ const o=ops[i]; try{ if(o&&OPS[o.op])OPS[o.op](o); }
        catch(e){ if(window.__laut)try{console.log(o.op,e.message);}catch(_){} } }
    }
  }

  // Schlussszene
  szeneAuf(null);
  szene.kn.classList.add('schluss','ohnebild');
  taktAuf(1,false);
  { const e=el('p'); e.textContent='Ende'; setzen(e); }

  zeitVerteilen();

  if(window.MathJax&&MathJax.typesetPromise&&mathKnoten.length)
    MathJax.typesetPromise(mathKnoten).then(einpassen).catch(()=>{});
  else einpassen();
}

// ================= Die Zeit =================
// Jeder Takt bekommt eine Strecke am Rad. Daraus werden Prozentwerte auf der Kurbel.
// Nichts davon laeuft waehrend des Scrollens: es wird einmal gerechnet und in CSS geschrieben.
// Jeder Takt bekommt dieselbe Strecke am Rad. Wer laenger braucht, haelt einfach an;
// das ist Sache des Lesers und nicht des Films. Ungleiche Strecken machen die Geste
// unberechenbar: man weiss dann nie, wie weit ein Wisch traegt.
const TAKTSTRECKE = 1.0;
function taktDauer(){ return TAKTSTRECKE; }
function zeitVerteilen(){
  let U=0;
  for(const s of SZENEN){ s.von=U; for(const t of s.takte){ t.von=U; U+=taktDauer(t); t.bis=U; } s.bis=U; }
  if(U<=0)U=1;
  const P=x=>(x/U*100);
  const spanne=(kn,a,b)=>{ const A=Math.max(0,Math.min(100,P(a))), B=Math.max(A+0.01,Math.min(100,P(b)));
    kn.style.animationRange=A.toFixed(3)+'% '+B.toFixed(3)+'%';
    kn.dataset.a=A.toFixed(3); kn.dataset.b=B.toFixed(3); };
  // Eine Lage soll genau von "von" bis "bis" voll gedeckt stehen. Die Blende liegt davor
  // und dahinter, damit zwei Lagen ineinander uebergehen statt zu blinken.
  const L=0.0682;
  const lage=(kn,von,bis)=>{
    const l=Math.max(0.02,(bis-von)*L);
    let a=von-l, b=bis+l;
    if(a<=0){ a=0; kn.classList.add('ab'); }    // was ganz vorn steht, ist schon da
    if(b>=U){ b=U; kn.classList.add('auf'); }   // was ganz hinten steht, bleibt stehen
    spanne(kn,a,b);
  };

  for(const s of SZENEN){
    // Die Szene bleibt vom ersten bis zum letzten Takt stehen, mit kurzer Blende an den Raendern
    lage(s.kn, s.von, s.bis);
    if(s.frage)spanne(s.frage, s.von, s.von+Math.min(0.5,(s.bis-s.von)*0.14));
    for(const t of s.takte){
      const d=t.bis-t.von;
      // Jeder Takt kostet dieselbe Strecke. Das Gewicht bestimmt nicht mehr, wie weit
      // man drehen muss, sondern wie schnell der Takt sich aufbaut: ein schwerer Beat
      // baut ueber fast die ganze Strecke auf, ein leichter ist frueh fertig.
      const gew=t.stuecke.map(x=>1+x.luft);
      const summe=gew.reduce((a,b)=>a+b,0)||1;
      const anteil = t.gewicht>=3?0.78 : (t.gewicht<=1?0.42:0.60);
      const bau=d*anteil, ab=t.von+d*0.05;
      let lauf=0;
      t.stuecke.forEach((st,i)=>{
        const a=ab+bau*(lauf/summe);
        lauf+=gew[i];
        const b=Math.min(t.bis, a+Math.max(d*0.10, bau*(gew[i]/summe)*0.85));
        for(const k of st.kn) spanne(k,a,b);
      });
      if(t.kurve)spanne(t.kurve, t.von+d*0.04, t.von+d*0.38);
      // Der Zoom laeuft ueber die ganze Szene weiter, nicht nur ueber seinen Takt
      if(t.zoomer)spanne(t.zoomer, t.von+d*0.12, s.bis);
    }
  }
  // Was am allerersten Punkt steht, kann nicht erst erscheinen: es ist schon da.
  for(const k of document.querySelectorAll('.frage[data-a], .el[data-a], .schritt[data-a]'))
    if(+k.dataset.a<=0)k.classList.add('sofort');

  // Der Weg im Rad ist so lang wie die Summe der Takte, mindestens aber zwei Bildhoehen
  document.documentElement.style.setProperty('--kurbel', (Math.max(2,U)*100).toFixed(1)+'vh');
}

// ================= Einpassen =================
// Ein Blatt soll die Hoehe wirklich ausnutzen: die Abstaende zwischen den Bloecken
// werden so gewaehlt, dass der Rest der Buehne aufgebraucht wird. Was nicht passt,
// wird einmal verkleinert.
const ABSTAND_MIN=8, ABSTAND_MAX=64;
function einpassen(){
  const zuVoll=[];
  for(const s of SZENEN){
    const b=s.blatt; if(!b)continue;
    b.style.gap=''; b.style.transform=''; b.style.width=''; b.classList.remove('mittig');
    const H=b.clientHeight; if(!H)continue;
    const kinder=[...b.children];
    const n=kinder.length; if(!n)continue;
    // Hoehe des Inhalts ohne Abstaende
    let h=0; for(const k of kinder)h+=k.getBoundingClientRect().height;
    if(n>1){
      const rest=H-h;
      const a=Math.max(ABSTAND_MIN,Math.min(ABSTAND_MAX,rest/(n-1)));
      b.style.gap=a.toFixed(1)+'px';
      h+=a*(n-1);
    }
    if(h>H+2){
      const f=Math.max(0.66,(H-2)/h);
      b.style.transform='scale('+f.toFixed(3)+')';
      b.style.width=(100/f).toFixed(2)+'%';
      if(f<=0.68)zuVoll.push(s);
    } else if(h < H*0.72){
      // Bleibt trotz groesster Abstaende viel Luft, steht das Blatt mittig statt oben
      b.classList.add('mittig');
    }
  }
  if(zuVoll.length&&window.console)console.warn('Blattkino: '+zuVoll.length+' Blatt/Blaetter zu voll.');
}
addEventListener('resize',()=>{ clearTimeout(einpassen._t); einpassen._t=setTimeout(einpassen,180); },{passive:true});
// Schriften und Formeln kommen spaeter als das Geruest. Danach noch einmal messen.
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>setTimeout(einpassen,60));

// ================= Fortschritt =================
const balken=$('fill'), leiste=$('fortschritt'), rad=$('rad');
let angefordert=false;
function fortschritt(){
  if(!rad)return 0;
  const h=rad.scrollHeight-rad.clientHeight;
  return h>0?Math.max(0,Math.min(1,rad.scrollTop/h)):0;
}
function anzeigen(){
  angefordert=false;
  const p=fortschritt();
  balken.style.transform='scaleY('+p.toFixed(4)+')';
  leiste.setAttribute('aria-valuenow',String(Math.round(p*100)));
  if(document.documentElement.classList.contains('zuFuss'))vonHand(p*100);
}
if(rad)rad.addEventListener('scroll',()=>{ if(!angefordert){ angefordert=true; requestAnimationFrame(anzeigen); } },{passive:true});
addEventListener('resize',anzeigen,{passive:true});

// ================= Rueckfall =================
// Kann der Browser den Regler nicht selbst lesen, lesen wir ihn einmal je Bild.
let handKnoten=null;
function vonHand(p){
  if(!handKnoten)handKnoten=[...document.querySelectorAll('[data-a]')];
  for(const k of handKnoten){
    const a=+k.dataset.a, b=+k.dataset.b;
    const bleibt=k.classList.contains('szene')||k.classList.contains('takt')||k.classList.contains('lage');
    const an = bleibt ? (p>=a-0.05&&p<=b+0.05) : (p>=a);
    if(an!==k.classList.contains('an'))k.classList.toggle('an',an);
    if(k.classList.contains('kurve'))k.classList.toggle('an',p>=a);
  }
}
function zuFuss(){
  if(document.documentElement.classList.contains('zuFuss'))return;
  document.documentElement.classList.add('zuFuss');
  handKnoten=null; vonHand(fortschritt()*100);
}
function pruefen(){
  let kann=false;
  try{ kann=CSS.supports('animation-timeline','--rad')||CSS.supports('animation-timeline','scroll()'); }catch(e){}
  if(!kann){ zuFuss(); return; }
  const proben=[document.querySelector('.szene'), document.querySelector('.takt'),
                document.querySelector('.el')].filter(Boolean);
  const laeuft=proben.length>0&&proben.every(x=>{ try{ return x.getAnimations&&x.getAnimations().length>0; }catch(e){ return false; } });
  if(!laeuft)zuFuss();
}

// ================= Das Tor =================
// Vor dem Start laeuft nichts. Auf dem Handy kommt der Film ins Vollbild, weil die
// Wischgeste sonst dauernd die Adresszeile des Browsers hervorholt und das Bild springt.
const tor=$('tor'), knopf=$('start'), raus=$('raus');
const klein = matchMedia('(pointer:coarse)').matches || innerWidth<860;
function vollbildMoeglich(){
  const e=document.documentElement;
  return !!(e.requestFullscreen||e.webkitRequestFullscreen);
}
function imVollbild(){ return !!(document.fullscreenElement||document.webkitFullscreenElement); }
function vollbildAn(){
  const e=document.documentElement;
  try{ const p=(e.requestFullscreen||e.webkitRequestFullscreen).call(e,{navigationUI:'hide'});
       if(p&&p.catch)p.catch(()=>{}); }catch(err){}
}
function vollbildAus(){
  try{ (document.exitFullscreen||document.webkitExitFullscreen).call(document); }catch(err){}
}
function starten(){
  if(klein&&vollbildMoeglich()&&!imVollbild())vollbildAn();
  document.documentElement.classList.add('laeuft');
  // Die Buehne kennt ihre Masse erst, wenn sie sichtbar ist
  requestAnimationFrame(()=>{ einpassen(); anzeigen(); if(rad)rad.focus({preventScroll:true}); });
}
function torZeigen(){
  document.documentElement.classList.remove('laeuft');
}
function torFuellen(){
  if(!tor)return;
  $('torTitel').textContent=String(DATEN.titel||'Blattkino');
  const q=$('torQuelle');
  if(q){ if(DATEN.quelle)q.textContent=String(DATEN.quelle); else q.remove(); }
  if(klein&&vollbildMoeglich())knopf.textContent='Im Vollbild starten';
}
if(tor)knopf.addEventListener('click',starten);
if(raus)raus.addEventListener('click',()=>{ if(imVollbild())vollbildAus(); else torZeigen(); });
function vollbildGewechselt(){
  const an=imVollbild();
  document.documentElement.classList.toggle('vollbild',an);
  // Die Bildhoehe aendert sich beim Wechsel, also einmal neu einpassen
  requestAnimationFrame(()=>{ einpassen(); anzeigen(); });
  // Wer das Vollbild verlaesst, will heraus. Auf dem Handy zurueck zum Tor.
  if(!an&&klein&&vollbildMoeglich())torZeigen();
}
addEventListener('fullscreenchange',vollbildGewechselt);
addEventListener('webkitfullscreenchange',vollbildGewechselt);
addEventListener('keydown',e=>{ if(e.key==='Escape'&&!imVollbild())torZeigen(); });

function los(){
  torFuellen();
  bauen();
  anzeigen();
  // Kann der Browser es grundsaetzlich nicht, sofort umschalten, sonst blitzt eine leere Seite auf.
  let kann=false;
  try{ kann=CSS.supports('animation-timeline','--rad'); }catch(e){}
  if(!kann)zuFuss();
  requestAnimationFrame(()=>requestAnimationFrame(pruefen));
}

// ---- Ein Film kann auch als eigene Datei danebenliegen: player.html?film=filme/x.json
// Dann traegt die Seite den Spieler und die Datei nur den Inhalt.
(function(){
  let name='';
  try{ name=new URLSearchParams(location.search).get('film')||''; }catch(e){}
  // Nur eine harmlose Datei neben der Seite, keine fremde Herkunft, kein Aufstieg im Baum
  const gut = /^[A-Za-z0-9_\-]+(\/[A-Za-z0-9_\-]+)*\.json$/.test(name) && name.indexOf('..')<0;
  if(!name||!gut){ los(); return; }
  fetch(name,{credentials:'omit'})
    .then(r=>{ if(!r.ok)throw new Error(r.status); return r.json(); })
    .then(j=>{ DATEN=lesen(j); los(); })
    .catch(()=>{
      DATEN=Object.assign({},LEER,{titel:'Film nicht gefunden',quelle:name});
      los();
      if(knopf)knopf.disabled=true;
    });
})();
