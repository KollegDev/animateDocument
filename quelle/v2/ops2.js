// ============================================================
// Blattkino Player v2: die Daten. Eine JSON-Datei wird in die Engine uebersetzt.
// Alles, was der Leser sieht, entsteht hier aus Text; nie aus HTML in den Daten.
// ============================================================
const LEER={titel:'Blattkino',quelle:'',boegen:[]};
function lesen(j){
  if(!j||typeof j!=='object')return LEER;
  if(Array.isArray(j.boegen))return j;
  if(Array.isArray(j.beats))return Object.assign({},j,{boegen:[{beats:j.beats}]});
  return Object.assign({},LEER,{titel:j.titel||'Blattkino',quelle:j.quelle||''});
}
let DATEN=(()=>{ const k=$('blattkino-daten'); if(!k)return LEER;
  try{ return lesen(JSON.parse(k.textContent)); }catch(e){ return LEER; } })();

const TEX_VERBOTEN=/\\(href|url|includegraphics|input|include|write|openout|def|let|newcommand|renewcommand|require|style|class|cssId|unicode|toggle)\b/gi;
function sauberTex(t){ const x=String(t==null?'':t).slice(0,600); return x.trim()?x.replace(TEX_VERBOTEN,''):''; }
const num=(v,d)=>{ const n=typeof v==='number'?v:parseFloat(v); return isFinite(n)?n:d; };

function torFuellen(){
  const t=$('torTitel'), q=$('torQuelle');
  if(t)t.textContent=String(DATEN.titel||'Blattkino');
  if(q){ if(DATEN.quelle)q.textContent=String(DATEN.quelle); else q.remove(); }
  document.title=String(DATEN.titel||'Blattkino');
}

// ---------------- Serie: eine Vorlage, viele Faelle (G5 c) ----------------
// Platzhalter {{name}} in Strings; {"je":"liste","dann":[...]} wiederholt seine Eintraege
// je Element der Liste im Fall, mit dem Element als Kontext plus i (Index) und k (Farbe).
function pfad(ctx,name){
  let v=ctx; for(const teil of String(name).split('.')){ if(v==null)return undefined; v=v[teil]; } return v;
}
function ersetzen(wert,ctx){
  if(typeof wert==='string'){
    const ganz=wert.match(/^\{\{\s*([\w.]+)\s*\}\}$/);
    if(ganz){ return pfad(ctx,ganz[1]); }   // Zahl bleibt Zahl, Liste bleibt Liste, Unbekanntes wird leer
    return wert.replace(/\{\{\s*([\w.]+)\s*\}\}/g,(m,n)=>{ const v=pfad(ctx,n); return v===undefined?m:String(v); });
  }
  if(Array.isArray(wert)){
    const aus=[];
    for(const e of wert){
      if(e&&typeof e==='object'&&!Array.isArray(e)&&e.je){
        const liste=pfad(ctx,e.je); if(!Array.isArray(liste))continue;
        liste.forEach((elem,i)=>{
          const c2=Object.assign({},ctx,(elem&&typeof elem==='object')?elem:{wert:elem},{i:i,k:(elem&&elem.k!==undefined)?elem.k:i});
          // dann als Liste ersetzen, damit verschachtelte je-Bloecke ebenfalls entfaltet werden
          for(const d of ersetzen(e.dann||[],c2))aus.push(d);
        });
      } else aus.push(ersetzen(e,ctx));
    }
    return aus;
  }
  if(wert&&typeof wert==='object'){ const o={}; for(const key in wert)o[key]=ersetzen(wert[key],ctx); return o; }
  return wert;
}
function entfalten(bo){
  if(!bo||!bo.serie||!Array.isArray(bo.serie.vorlage)||!Array.isArray(bo.serie.faelle))return [bo];
  return bo.serie.faelle.map(fall=>{
    const ctx=Object.assign({},fall);
    return {frage:ersetzen(fall.frage!==undefined?fall.frage:(bo.serie.frage||bo.frage||''),ctx),
            beats:ersetzen(bo.serie.vorlage,ctx), serieFall:true};
  });
}

// ---------------- Register je Bogen ----------------
let R=null;
function neuesRegister(){ R={chips:{},graphen:{},pfeile:{},kand:{},zeilen:{},letzterGraph:null}; }
function graphVon(o){ const g=(o&&o.id!==undefined)?R.graphen[o.id]:null; return g||R.letzterGraph; }
function chipVon(id){ return id!==undefined?R.chips[id]:undefined; }

// Teile einer Zeile aus den Daten in Engine-Teile: Ids werden global je Bogen registriert
function teileVon(liste,z){
  const aus=[];
  for(const p of liste){
    if(Array.isArray(p)){ aus.push(teileVon(p,z)); continue; }
    if(typeof p==='string'){ aus.push(p==='!eng'?p:sauberTex(p)); continue; }
    if(p&&typeof p==='object'){
      if(p.tex!==undefined)aus.push({tex:sauberTex(p.tex),k:p.k,id:p.id,leer:!!p.leer});
      else aus.push({t:String(p.t==null?'':p.t),fett:p.fett,k:p.k,id:p.id,leer:!!p.leer});
    }
  }
  return aus;
}
function zeileAus(o){
  const teile=teileVon(Array.isArray(o.teile)?o.teile:(o.tex!==undefined?[o.tex]:[]),null);
  if(!teile.length)return null;
  const z=zeile(teile,{hl:!!o.hl,folge:!!o.folge,stumm:!!o.stumm,dauer:num(o.dauer,1)});
  for(const id in z.chips)R.chips[id]=z.chips[id];
  if(o.id)R.zeilen[o.id]=z;
  return z;
}

// Fluechtige Stufe: kommt, bleibt kurz, geht wieder (Bildfolge)
function fluechtigItem(nodes){ const l=[].concat(nodes).filter(Boolean); for(const n of l)n.style.opacity=0;
  return {apply(u){ const v=u<=0?0:(u<0.22?u/0.22:(u>0.68?Math.max(0,(1-u)/0.32):1)); for(const n of l)n.style.opacity=(0.85*v).toFixed(3); }}; }

// ---------------- Die Operationen ----------------
const OPS={
  clear(){},
  h(o){ h(String(o.t==null?'':o.t)); },
  text(o){ satz(String(o.t==null?'':o.t)); },
  satz(o){ satz(String(o.t==null?'':o.t)); },
  item(o){ punktItem(String(o.t==null?'':o.t)); },
  note(o){ notiz(String(o.t==null?'':o.t)); },
  marke(o){ marke(String(o.t==null?'':o.t)); },
  merk(o){ merk(String(o.t==null?'':o.t)); },
  merksatz(o){ merk(String(o.t==null?'':o.t)); },
  frage(o){ setzen(el('p','fragezeile',String(o.t==null?'':o.t)),num(o.dauer,1)); },
  math(o){ const t=sauberTex(o.tex); if(t)zeileAus({teile:[t],hl:!!o.hl,dauer:o.dauer}); },
  zeile(o){ zeileAus(o); },
  zeig(o){ const z=R.zeilen[o.zeile]; if(z)zeig(z,{folge:!!o.folge,dauer:num(o.dauer,1)}); },

  // ---- Bild ----
  graph(o){ const fn=compileExpr(o.expr); if(!fn){ notiz('Graph nicht darstellbar'); return; }
    const G=graph({fn:fn,xmin:num(o.xmin,-5),xmax:num(o.xmax,5),ymin:num(o.ymin,-5),ymax:num(o.ymax,5),
      legend:o.legend?String(o.legend):'',h:num(o.h,200),dauer:num(o.dauer,3)});
    if(o.id!==undefined)R.graphen[o.id]=G; R.letzterGraph=G; },
  plot(o){ OPS.graph(Object.assign({},o,{h:o.h!==undefined?o.h:200})); },
  punkt(o){ const G=graphVon(o); if(!G)return; const x=num(o.x,NaN), y=num(o.y,NaN); if(!isFinite(x)||!isFinite(y))return;
    stueck(G.punkt(x,y,o.k),num(o.dauer,1)); },
  point(o){ const G=graphVon(o); if(!G)return; const x=num(o.x,NaN), y=num(o.y,NaN); if(!isFinite(x)||!isFinite(y))return;
    const items=[G.punkt(x,y,o.k)]; if(o.label)items.push(G.beschriftung(x,y,String(o.label),o.k)); stueck(items,num(o.dauer,1)); },
  sweep(o){ OPS.point(Object.assign({},o,{x:o.x1!==undefined?o.x1:o.x, y:(()=>{ const G=graphVon(o); try{ return G?G.fn(num(o.x1!==undefined?o.x1:o.x,0)):NaN; }catch(e){ return NaN; } })()})); },
  beschriftung(o){ const G=graphVon(o); if(!G)return; stueck(G.beschriftung(num(o.x,0),num(o.y,0),String(o.text==null?'':o.text),o.k),num(o.dauer,0.6)); },
  hline(o){ const G=graphVon(o); if(!G)return; stueck(G.hline(num(o.y,0),o.label?String(o.label):''),num(o.dauer,1)); },
  vline(o){ const G=graphVon(o); if(!G)return; stueck(G.vline(num(o.x,0),o.label?String(o.label):''),num(o.dauer,1)); },
  region(o){ const G=graphVon(o); if(!G)return; stueck(G.region(num(o.y,0),o.dir==='below'?'below':'above',o.label?String(o.label):''),num(o.dauer,1)); },
  kandidat(o){ const G=graphVon(o); if(!G||o.id===undefined)return;
    const m=G.marke(num(o.x,0),o.k===undefined?0:o.k,String(o.text==null?fmt0(num(o.x,0)):o.text));
    R.kand[o.id]={m:m,x:num(o.x,0),G:G};
    if(o.sofort){ for(const n of m.nodes)n.style.opacity=1; if(m.tick)m.tick.style.opacity=0; } },
  kappe(o){ const G=graphVon(o); if(!G)return; stueck(G.kappe(num(o.x,0),num(o.r,0.4),o.k===undefined?0:o.k,o.text?String(o.text):undefined),num(o.dauer,1.4)); },
  aufstieg(o){ const G=graphVon(o); if(!G)return; stueck(G.aufstieg(num(o.x,0),num(o.y,0),o.k===undefined?0:o.k,o.text!==undefined?String(o.text):undefined),num(o.dauer,1.4)); },
  fahrt(o){ const G=graphVon(o); if(!G)return;
    const geister=Array.isArray(o.geister)?o.geister.map(Number).filter(isFinite):[];
    if(o.anteil!==undefined&&beat)beat.anteil=num(o.anteil,undefined);
    stueck(G.fahrt({x0:num(o.x0,G.xmin),x1:num(o.x1,G.xmax),geister:geister,k:o.k===undefined?0:o.k}),num(o.dauer,9)); },
  wert(o){ const G=graphVon(o); const x=num(o.x,NaN); if(!G||!isFinite(x))return;
    const items=[];
    const tex=sauberTex(o.tex);
    if(tex){ const z=zeile([tex],{hl:true,stumm:true}); items.push(riseItem(z)); }
    const w=G.wert(x,o.k,o.label?String(o.label):''); if(w)items.push(w);
    stueck(items,num(o.dauer,1)); },

  // ---- Fluss: Pfeil und Flug ----
  pfeil(o){ let von=null;
    if(o.von&&typeof o.von==='object'&&o.von.pfeil!==undefined)von=R.pfeile[o.von.pfeil];
    else von=chipVon(o.von);
    const zu=chipVon(o.zu); if(!von||!zu)return;
    const it=pfeil({von:von,zu:zu,an:'oben',lane:num(o.lane,0),k:o.k===undefined?0:o.k,versatz:num(o.versatz,0),dauer:num(o.dauer,1.6)});
    if(o.id!==undefined)R.pfeile[o.id]=it; },
  flug(o){ let von=chipVon(o.von); if(!von)return;
    // Traegt der Chip ein fett gesetztes Stueck, fliegt genau das (G5 a)
    { const b=von.querySelector?von.querySelector('b.fett'):null; if(b)von=b; }
    let zu=null;
    if(o.zu&&typeof o.zu==='object'&&o.zu.kandidat!==undefined){ const K=R.kand[o.zu.kandidat]; if(!K)return;
      zu={anker:()=>K.G.anchor(K.x,0,15),zeig:K.m.nodes,tick:K.m.tick}; }
    else zu=chipVon(o.zu);
    if(!zu)return;
    const txt=!!(o.txt)||!!(von.classList&&von.classList.contains('txt'))||von.tagName==='B';
    flug({von:von,zu:zu,k:o.k,txt:txt,dauer:num(o.dauer,1.2)}); },

  // ---- Aus v1: Geraete, die hier als Items weiterleben ----
  zoomfolge(o){ const fn=compileExpr(o.expr); if(!fn){ notiz('Zoomfolge nicht darstellbar'); return; }
    const G=graph({fn:fn,xmin:num(o.xmin,-5),xmax:num(o.xmax,5),ymin:num(o.ymin,-5),ymax:num(o.ymax,5),
      legend:o.legend?String(o.legend):'',h:num(o.h,200),dauer:1});
    if(o.id!==undefined)R.graphen[o.id]=G; R.letzterGraph=G;
    const x=num(o.x,0); let y=NaN; try{ y=fn(x); }catch(e){}
    if(isFinite(y)){ const m=G.abl(x); const l=G.gerade(x,m,0,true); l.style.opacity=1;
      stueck([G.punkt(x,y,0), o.label?G.beschriftung(x,y,String(o.label),0):null],0.6); }
    stueck(G.zoom(x,Math.max(2,Math.min(40,num(o.zoom,8)))),num(o.dauer,6)); },
  bildfolge(o){ const G=graphVon(o); if(!G)return;
    const stufen=Array.isArray(o.stufen)?o.stufen.map(Number).filter(isFinite):[]; if(!stufen.length)return;
    const x0=num(o.x,0);
    if(o.art==='balken'){
      stufen.forEach((n,i)=>{ const letzte=i===stufen.length-1; const nn=Math.max(1,Math.min(64,Math.round(n)));
        const nodes=[]; const b=(G.xmax-G.xmin)/nn;
        for(let j=0;j<nn;j++){ const x=G.xmin+j*b; let y; try{ y=G.fn(x+b/2); }catch(e){ continue; } if(!isFinite(y))continue;
          const yk=Math.max(G.ymin,Math.min(G.ymax,y));
          const r=svgEl('rect',{x:G.sx(x),y:Math.min(G.sy(yk),G.sy(0)),width:Math.max(0.6,G.sx(x+b)-G.sx(x)-0.5),height:Math.abs(G.sy(0)-G.sy(yk)),fill:'var(--k2)',opacity:0},G.svg);
          nodes.push(r); }
        stueck(letzte?landItem(nodes):fluechtigItem(nodes),num(o.dauer,1)); });
    } else {
      stufen.forEach((hh,i)=>{ const letzte=i===stufen.length-1; let y0,y1; try{ y0=G.fn(x0); y1=G.fn(x0+hh); }catch(e){ return; }
        if(!isFinite(y0)||!isFinite(y1))return;
        const m=Math.abs(hh)<1e-9?G.abl(x0):(y1-y0)/hh; if(!isFinite(m))return;
        const nodes=[G.gerade(x0,m,letzte?0:1,false)];
        if(Math.abs(hh)>1e-9){ const c=svgEl('circle',{cx:G.sx(x0+hh),cy:G.sy(y1),r:4,fill:'var(--k1)',opacity:0},G.svg); nodes.push(c); }
        const t=svgEl('text',{x:G.sx(G.xmax)-4,y:G.sy(G.ymax)+14,'text-anchor':'end','font-size':11.5,fill:letzte?'var(--k0)':'var(--k1)',opacity:0},G.svg);
        t.textContent=Math.abs(hh)<1e-9?(o.ziel?String(o.ziel):'Berührgerade'):('h = '+fmt(hh,2)); nodes.push(t);
        stueck(letzte?landItem(nodes):fluechtigItem(nodes),num(o.dauer,1)); });
    } },
  doppelgraph(o){ const fn1=compileExpr(o.expr), fn2=compileExpr(o.expr2); if(!fn1||!fn2){ notiz('Doppelgraph nicht darstellbar'); return; }
    const c1={xmin:num(o.xmin,-5),xmax:num(o.xmax,5),ymin:num(o.ymin,-5),ymax:num(o.ymax,5),legend:o.legend?String(o.legend):''};
    const c2={xmin:c1.xmin,xmax:c1.xmax,ymin:num(o.ymin2,c1.ymin),ymax:num(o.ymax2,c1.ymax),legend:o.legend2?String(o.legend2):''};
    const H=290, LUFT=16; const svg=svgEl('svg',{viewBox:'0 0 440 '+(2*H+LUFT)});
    const oben=makePlot(c1,svg,0), unten=makePlot(c2,svg,H+LUFT);
    const kasten=el('div','bild'); kasten.appendChild(svg); setzen(kasten,1);
    const items=[]; for(const [p,fn] of [[oben,fn1],[unten,fn2]]){ p.curve(fn,false); for(const c of p.curvePaths)items.push(drawItem(c.p)); }
    stueck(items,num(o.dauer,2));
    R.doppel={oben:oben,unten:unten,fn1:fn1,fn2:fn2}; },
  binden(o){ const d=R.doppel; if(!d)return; const x=num(o.x,NaN); if(!isFinite(x))return;
    const A=d.oben, B=d.unten; if(x<A.cfg.xmin||x>A.cfg.xmax)return;
    const nodes=[A.g('line',{x1:A.sx(x),y1:A.oy+A.pad-8,x2:A.sx(x),y2:B.oy+B.H-B.pad+8,stroke:'var(--k0)','stroke-width':1.2,'stroke-dasharray':'5 4',opacity:0})];
    for(const [P,fn,lab] of [[A,d.fn1,o.label],[B,d.fn2,o.label2]]){ const w=P.wert(x,fn,lab?String(lab):''); if(w)for(const n of w){ n.style.opacity=0; nodes.push(n); } }
    stueck({apply(u){ const v=eOut(u); for(const n of nodes)n.style.opacity=u>0?v:0; }},num(o.dauer,1.2)); },

  // ---- Aus v1: Textbloecke ----
  tabelle(o){ const zeilen=Array.isArray(o.zeilen)?o.zeilen:[]; if(!zeilen.length)return;
    const t=el('table','mtab');
    if(Array.isArray(o.kopf)&&o.kopf.length){ const tr=el('tr'); for(const k of o.kopf){ const th=el('th',null,String(k).replace(/^!/,'')); tr.appendChild(th); } const th=el('thead'); th.appendChild(tr); t.appendChild(th); }
    const tb=el('tbody');
    for(const z of zeilen){ const zellen=Array.isArray(z)?z:[z]; const tr=el('tr');
      for(const c of zellen){ const td=el('td'); const w=String(c==null?'':c);
        if(w.startsWith('!')){ td.textContent=w.slice(1); td.className='vor'; }
        else { const tex=sauberTex(w); td.textContent=tex?'\\('+tex+'\\)':''; mathKnoten.push(td); }
        tr.appendChild(td); }
      tb.appendChild(tr); }
    t.appendChild(tb); setzen(t,num(o.dauer,1.4)); },
  umformung(o){ const zeilen=Array.isArray(o.zeilen)?o.zeilen:[]; if(!zeilen.length)return;
    const k=el('div','kette'); einfuegen(k);
    zeilen.forEach((z,i)=>{ const tex=sauberTex(z&&z.tex); if(!tex)return;
      const w=(z&&z.warum)?String(z.warum):''; const items=[];
      if(w){ const g=el('div','warum','↓ '+w); k.appendChild(g); items.push(riseItem(g)); }
      const m=el('div','mathline'+(i<zeilen.length-1?' alt':'')); m.textContent='\\('+tex+'\\)'; k.appendChild(m); mathKnoten.push(m); items.push(riseItem(m));
      stueck(items,num(z&&z.dauer,1)); }); },
  paar(o){ const FARBEN=['var(--k0)','var(--k1)','var(--k2)','#8b5cf6'];
    let oben=sauberTex(o.oben), unten=sauberTex(o.unten); if(!oben||!unten)return;
    const faerben=(zeile,teil,farbe)=>{ if(!teil)return zeile; const g=zeile.indexOf('='); const ab=g>=0?g+1:0;
      let i=zeile.indexOf(teil,ab); if(i<0)i=zeile.indexOf(teil); if(i<0)return zeile;
      return zeile.slice(0,i)+'\\color{'+farbe+'}{'+teil+'}'+zeile.slice(i+teil.length); };
    (Array.isArray(o.paare)?o.paare:[]).forEach((pz,i)=>{ if(!Array.isArray(pz)||pz.length<2)return; const f=FARBEN[i%FARBEN.length];
      oben=faerben(oben,String(pz[0]),f); unten=faerben(unten,String(pz[1]),f); });
    const k=el('div','paar');
    const z1=el('div','mathline'); z1.textContent='\\('+oben+'\\)'; k.appendChild(z1); mathKnoten.push(z1);
    const pf=el('div','pfeile2'); const zur=String(o.zurueck==null?'':o.zurueck), hin=String(o.hin==null?'':o.hin);
    pf.appendChild(el('span','zur',zur?('↑ '+zur):'')); pf.appendChild(el('span','hin',hin?(hin+' ↓'):'')); k.appendChild(pf);
    const z2=el('div','mathline'); z2.textContent='\\('+unten+'\\)'; k.appendChild(z2); mathKnoten.push(z2);
    setzen(k,num(o.dauer,1.4)); },
  jetztihr(o){ const a=el('p','jetzt'); a.appendChild(el('span','markeJ','Jetzt ihr:'));
    const tex=sauberTex(o.aufgabe||o.aufgabeTex);
    if(o.t!==undefined&&String(o.t).trim())a.appendChild(el('span',null,String(o.t)));
    if(tex){ const s2=el('span'); s2.textContent=' \\('+tex+'\\)'; a.appendChild(s2); mathKnoten.push(a); }
    setzen(a,num(o.dauer,2.5));
    const lo=el('div','loesung'); lo.appendChild(el('b',null,'Lösung'));
    const lt=sauberTex(o.loesung||o.loesungTex);
    if(lt){ const s3=el('span'); s3.textContent='\\('+lt+'\\) '; lo.appendChild(s3); mathKnoten.push(lo); }
    if(o.loesungText!==undefined&&String(o.loesungText).trim())lo.appendChild(el('div','dazu',String(o.loesungText)));
    setzen(lo,1); }
};

// ---------------- Bauen ----------------
function bauen(){
  document.documentElement.lang='de';
  const boegen=[]; for(const bo of (DATEN.boegen||[]))for(const b of entfalten(bo))boegen.push(b);
  for(const bo of boegen){
    const bs=(bo&&Array.isArray(bo.beats))?bo.beats:[]; if(!bs.length)continue;
    szeneAuf(bo.frage?String(bo.frage):null); neuesRegister();
    for(const b of bs){ if(!b||typeof b!=='object')continue;
      beatAuf(2,b.payoff===true);
      const ops=Array.isArray(b.ops)?b.ops:[];
      let i=0;
      // Ueberschrift vor dem Satz
      while(i<ops.length&&ops[i]&&(ops[i].op==='clear'||ops[i].op==='h')){ try{ OPS[ops[i].op](ops[i]); }catch(e){ melden(ops[i].op+': '+e.message); } i++; }
      if(typeof b.sub==='string'&&b.sub.trim())satz(b.sub.trim());
      for(;i<ops.length;i++){ const o=ops[i]; if(!o||!OPS[o.op])continue;
        try{ OPS[o.op](o); }catch(e){ melden(o.op+': '+e.message); } }
    }
  }
  // Schluss: ein Satz, mittig. Die Datei darf ihn setzen (schluss), sonst steht "Ende".
  szeneAuf(null); neuesRegister(); beatAuf(1,false);
  setzen(el('p','ende',String(DATEN.schluss||'Ende')));
  szene.inhalt.style.justifyContent='center'; szene.inhalt.style.minHeight='60vh';
}
