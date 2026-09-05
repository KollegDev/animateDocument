const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const eOut=u=>1-Math.pow(1-u,3);
const eIO=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
const NS='http://www.w3.org/2000/svg';
const KF=['var(--k0)','var(--k1)','var(--k2)'];
function fmt(v,n){ n=n===undefined?1:n; let s=(Math.round(v*Math.pow(10,n))/Math.pow(10,n)).toFixed(n);
  s=s.replace('.',',').replace('-','\u2212'); if(/^\u22120(,0+)?$/.test(s))s=s.slice(1); return s; }
function fmt0(v){ return Number.isInteger(v)?String(v).replace('-','\u2212'):fmt(v,2); }
const svgEl=(tag,at,parent)=>{ const e=document.createElementNS(NS,tag); for(const k in at)e.setAttribute(k,at[k]); if(parent)parent.appendChild(e); return e; };
const el=(tag,cls,txt)=>{ const e=document.createElement(tag); if(cls)e.className=cls; if(txt!=null)e.textContent=txt; return e; };
const esc=t=>{ const d=document.createElement('span'); d.textContent=String(t==null?'':t); return d.innerHTML; };

// ---------------- Zustand beim Aufbau ----------------
const SZENEN=[]; let szene=null, beat=null; const mathKnoten=[]; let TOTAL=1;

function szeneAuf(frage){
  const s=el('section','szene'); const inhalt=el('div','inhalt'); s.appendChild(inhalt);
  if(frage){ inhalt.appendChild(el('p','frage',frage)); }
  const pf=svgEl('svg',{class:'pfeile'}); const fl=el('div','flug');
  inhalt.appendChild(pf); inhalt.appendChild(fl);
  $('buehne').appendChild(s);
  szene={kn:s,inhalt,pf,fl,beats:[],items:[],scale:1};
  SZENEN.push(szene); return szene;
}
function beatAuf(g,payoff){ beat={gewicht:g||2,payoff:!!payoff,anteil:undefined,stuecke:[]}; szene.beats.push(beat); }
// Ein Stueck: was gemeinsam erscheint. dauer ist sein Anteil an der Aufbaustrecke des Beats.
function stueck(items,dauer){ const l=[].concat(items).filter(Boolean); if(!l.length||!beat)return; beat.stuecke.push({items:l,dauer:dauer||1}); for(const it of l)szene.items.push(it); }

// ---------------- Elemente ----------------
function riseItem(e){ e.classList.add('el'); return {apply(u){ const v=eOut(u); e.style.opacity=v; e.style.transform='translate3d(0,'+((1-v)*10).toFixed(2)+'px,0)'; }}; }
function einfuegen(e){ szene.inhalt.insertBefore(e,szene.pf); return e; }
function setzen(e,dauer){ einfuegen(e); stueck(riseItem(e),dauer); return e; }
function h(t){ return setzen(el('h2',null,t)); }
function satz(t){ return setzen(el('p','satz',t)); }
function marke(t){ const e=el('p','marke'); e.textContent=t; if(/\\\(/.test(t))mathKnoten.push(e); return setzen(e); }
function merk(t){ const e=el('p','merk'); e.textContent=t; if(/\\\(/.test(t))mathKnoten.push(e); return setzen(e); }
// Aus v1 uebernommene Bloecke, alle als Text gesetzt
function notiz(t){ return setzen(el('p','notebox',t)); }
function punktItem(t){ const e=el('div','item'); const b=el('b',null,'\u2013'); const sp=el('span',null,t); e.appendChild(b); e.appendChild(sp); return setzen(e); }
// Ein Teil ist ein Chip (Formel oder Text); eine Liste von Teilen ist eine Gruppe, die nie umbricht.
function chip(p,z){
  let c;
  if(typeof p==='string'){ c=el('span','chip'); c.textContent='\\('+p+'\\)'; mathKnoten.push(c); }
  else if(p.tex!==undefined){ c=el('span','chip'+(p.k!==undefined?' k'+p.k:'')+(p.leer?' leer':'')); c.textContent='\\('+p.tex+'\\)'; mathKnoten.push(c); }
  else { c=el('span','chip txt'+(p.k!==undefined?' k'+p.k:'')+(p.leer?' leer':''));
    // {t, fett}: das erste Vorkommen von fett wird fett gesetzt und ist die Flugquelle (G5 a)
    const t=String(p.t==null?'':p.t);
    if(p.fett&&t.indexOf(p.fett)>=0){ const i=t.indexOf(p.fett);
      c.appendChild(document.createTextNode(t.slice(0,i)));
      const b=el('b',null,p.fett); b.className='fett'; c.appendChild(b);
      c.appendChild(document.createTextNode(t.slice(i+p.fett.length))); }
    else c.textContent=t; }
  if(p&&p.id)z.chips[p.id]=c; return c;
}
function zeile(parts,opt){
  opt=opt||{}; const z=el('div','zeile'+(opt.hl?' hl':'')); z.chips={};
  for(const p of parts){
    if(Array.isArray(p)){ const eng=p[0]==='!eng'; const g=el('span','gruppe'+(eng?' eng':'')); for(const q of (eng?p.slice(1):p))g.appendChild(chip(q,z)); z.appendChild(g); }
    else z.appendChild(chip(p,z));
  }
  einfuegen(z);
  if(!opt.stumm)zeig(z,opt);
  return z;
}
// Eine Zeile erscheint als Ganzes, oder Chip fuer Chip in Leserichtung (folge).
function zeig(z,opt){ opt=opt||{}; if(opt.folge){ for(const c of z.children)stueck(riseItem(c),opt.dauer||1); } else stueck(riseItem(z),opt.dauer); }

// ---------------- Geometrie im Blatt ----------------
function lokal(e){ const b=szene.inhalt.getBoundingClientRect(), r=e.getBoundingClientRect(), s=szene.scale||1;
  return {x:(r.left-b.left)/s, y:(r.top-b.top)/s, w:r.width/s, h:r.height/s}; }

// ---------------- Der Graph ----------------
function graph(cfg){
  const W=cfg.w||340, H=cfg.h||200, pl=30, pr=12, pt=16, pb=22;
  const xmin=cfg.xmin, xmax=cfg.xmax, ymin=cfg.ymin, ymax=cfg.ymax, fn=cfg.fn;
  const sx=x=>pl+(x-xmin)/(xmax-xmin)*(W-pl-pr), sy=y=>pt+(ymax-y)/(ymax-ymin)*(H-pt-pb);
  const kx=(W-pl-pr)/(xmax-xmin), ky=(H-pt-pb)/(ymax-ymin);
  const svg=svgEl('svg',{viewBox:'0 0 '+W+' '+H});
  const L={grid:svgEl('g',{},svg),hinter:svgEl('g',{},svg),kurve:svgEl('g',{},svg),vorn:svgEl('g',{},svg)};
  const step=r=>r<=8?1:(r<=16?2:5);
  const xs=step(xmax-xmin), ys=step(ymax-ymin);
  const y0=(ymin<=0&&ymax>=0)?sy(0):sy(ymin), x0=(xmin<=0&&xmax>=0)?sx(0):sx(xmin);
  const lab=(x,y,t,anch,fill,size,parent)=>{ const e=svgEl('text',{x:x,y:y,fill:fill||'var(--muted)','font-size':size||12,'text-anchor':anch||'middle'},parent||L.vorn); e.textContent=t; return e; };
  const ticks={};
  for(let x=Math.ceil(xmin/xs)*xs;x<=xmax+1e-9;x+=xs){ svgEl('line',{x1:sx(x),y1:pt,x2:sx(x),y2:H-pb,stroke:'var(--grid)','stroke-width':1},L.grid);
    if(Math.abs(x)>1e-9)ticks[x]=lab(sx(x),y0+14,fmt0(x),'middle','var(--muted)',11.5,L.grid); }
  for(let y=Math.ceil(ymin/ys)*ys;y<=ymax+1e-9;y+=ys){ svgEl('line',{x1:pl,y1:sy(y),x2:W-pr,y2:sy(y),stroke:'var(--grid)','stroke-width':1},L.grid);
    if(Math.abs(y)>1e-9)lab(x0-6,sy(y)+4,fmt0(y),'end','var(--muted)',11.5,L.grid); }
  svgEl('line',{x1:pl,y1:y0,x2:W-pr+6,y2:y0,stroke:'var(--axis)','stroke-width':1.3},L.grid);
  svgEl('path',{d:'M'+(W-pr+6)+' '+y0+' l -6 -3.5 v 7 z',fill:'var(--axis)'},L.grid);
  svgEl('line',{x1:x0,y1:H-pb,x2:x0,y2:pt-6,stroke:'var(--axis)','stroke-width':1.3},L.grid);
  svgEl('path',{d:'M'+x0+' '+(pt-6)+' l -3.5 6 h 7 z',fill:'var(--axis)'},L.grid);
  lab(W-pr+4,y0+15,'x','end','var(--muted)',11.5,L.grid); lab(x0+9,pt+2,'y','start','var(--muted)',11.5,L.grid);
  // Kurve
  let d=''; const n=260;
  for(let i=0;i<=n;i++){ const x=xmin+i*(xmax-xmin)/n; let y; try{y=fn(x);}catch(e){y=NaN;}
    if(!isFinite(y)||y<ymin-0.6||y>ymax+0.6){ if(d&&!d.endsWith('M'))d+=' M'; continue; }
    const px=sx(x).toFixed(1),py=sy(y).toFixed(1);
    d+=(d===''||d.endsWith('M'))?((d===''?'M ':' ')+px+' '+py):(' L '+px+' '+py); }
  d=d.replace(/ M$/,'');
  const kurve=svgEl('path',{d:d,fill:'none',stroke:'var(--curve)','stroke-width':2.3,'stroke-linecap':'round','stroke-linejoin':'round'},L.kurve);
  const kasten=el('div','bild'); kasten.appendChild(svg);
  if(cfg.legend){ kasten.appendChild(el('p','legende',cfg.legend)); }
  setzen(kasten); stueck(drawItem(kurve),cfg.dauer||3);
  const meineSzene=szene;

  const abl=x=>{ const hh=1e-4; return (fn(x+hh)-fn(x-hh))/(2*hh); };
  const abl2=x=>{ const hh=1e-3; return (fn(x+hh)-2*fn(x)+fn(x-hh))/(hh*hh); };
  const G={svg:svg,sx:sx,sy:sy,fn:fn,
    // Ein Punkt des Bildes in Blattkoordinaten, mit Versatz in Bildpixeln
    anchor(x,y,dy){ const r=svg.getBoundingClientRect(), b=meineSzene.inhalt.getBoundingClientRect(), s=meineSzene.scale||1;
      const f=(r.width/s)/W; return {x:(r.left-b.left)/s+sx(x)*f, y:(r.top-b.top)/s+(sy(y)+(dy||0))*f}; },
    // Kandidat: eine Stelle auf der x-Achse
    marke(x,k,text){ const tri=svgEl('path',{d:'M'+sx(x)+' '+y0+' l -5 8 h 10 z',fill:KF[k],opacity:0},L.vorn);
      const t=lab(sx(x),y0+21,text,'middle',KF[k],12.5); t.setAttribute('font-weight','600'); t.style.opacity=0;
      return {nodes:[tri,t],tick:ticks[x]||null}; },
    // Aufstieg: von der Stelle hinauf zur Kurve, dann zur y-Achse
    aufstieg(x,y,k,text){ let p='M'+sx(x)+' '+y0; if(Math.abs(y)>1e-9)p+=' V'+sy(y); if(Math.abs(x)>1e-9)p+=' H'+x0;
      const path=svgEl('path',{d:p,fill:'none',stroke:KF[k],'stroke-width':1.3,'stroke-dasharray':'4 3',opacity:0},L.hinter);
      const it=drawItem(path,{linear:true});
      if(text!==undefined&&Math.abs(y)>1e-9){ const t=lab(x0-6,sy(y)+4,text,'end',KF[k],12.5); t.setAttribute('font-weight','600'); t.style.opacity=0;
        const a=it.apply; it.apply=u=>{ a(u); t.style.opacity=u>=0.95?1:0; }; }
      return it; },
    punkt(x,y,k){ const c=svgEl('circle',{cx:sx(x),cy:sy(y),r:4.6,fill:KF[k===undefined?0:k]},L.vorn); return landItem([c]); },
    // Aus v1: gestrichelte Hilfslinien und ein schraffierter Bereich, hinter der Kurve
    hline(y,text){ if(y<ymin||y>ymax)return null;
      const l=svgEl('line',{x1:pl,y1:sy(y),x2:W-pr,y2:sy(y),stroke:'var(--axis)','stroke-width':1.2,'stroke-dasharray':'5 4',opacity:0},L.hinter);
      const t=text?lab(pl+4,sy(y)-5,text,'start','var(--muted)',11.5,L.hinter):null; if(t)t.style.opacity=0;
      return {apply(u){ const v=eOut(u); l.style.opacity=u>0?v:0; if(t)t.style.opacity=u>0?v:0; }}; },
    vline(x,text){ if(x<xmin||x>xmax)return null;
      const l=svgEl('line',{x1:sx(x),y1:pt,x2:sx(x),y2:H-pb,stroke:'var(--axis)','stroke-width':1.2,'stroke-dasharray':'5 4',opacity:0},L.hinter);
      const t=text?lab(sx(x)+4,pt+12,text,'start','var(--muted)',11.5,L.hinter):null; if(t)t.style.opacity=0;
      return {apply(u){ const v=eOut(u); l.style.opacity=u>0?v:0; if(t)t.style.opacity=u>0?v:0; }}; },
    region(y,dir,text){ if(y<ymin||y>ymax)return null;
      const top=dir==='above'?pt:sy(y), hh=dir==='above'?Math.max(0,sy(y)-pt):Math.max(0,(H-pb)-sy(y));
      const r=svgEl('rect',{x:pl,y:top,width:W-pl-pr,height:hh,fill:'var(--k2)',opacity:0},L.hinter);
      const t=text?lab(pl+4,dir==='above'?top+12:top+hh-6,text,'start','var(--k2)',11.5,L.hinter):null; if(t)t.style.opacity=0;
      return {apply(u){ const v=eOut(u); r.style.opacity=(0.13*v).toFixed(3); if(t)t.style.opacity=u>0?v:0; }}; },
    // Ein Wert steht zugleich in der Formel und im Bild: Zeiger zu beiden Achsen, Punkt, Beschriftung
    wert(x,k,text){ let y; try{ y=fn(x); }catch(e){ return null; } if(!isFinite(y)||x<xmin||x>xmax||y<ymin||y>ymax)return null;
      const kk=k===undefined?0:k;
      const l1=svgEl('line',{x1:sx(x),y1:sy(y),x2:sx(x),y2:y0,stroke:KF[kk],'stroke-width':1.1,'stroke-dasharray':'4 3',opacity:0},L.hinter);
      const l2=svgEl('line',{x1:sx(x),y1:sy(y),x2:x0,y2:sy(y),stroke:KF[kk],'stroke-width':1.1,'stroke-dasharray':'4 3',opacity:0},L.hinter);
      const c=svgEl('circle',{cx:sx(x),cy:sy(y),r:4.2,fill:KF[kk],opacity:0},L.vorn);
      const t=text?lab(sx(x)+9,sy(y)-9,text,'start',KF[kk],12.5,L.vorn):null; if(t)t.style.opacity=0;
      return {apply(u){ const v=eOut(u); for(const n of [l1,l2,c])n.style.opacity=u>0?(0.75*v).toFixed(3):0; c.style.opacity=u>0?v:0; if(t)t.style.opacity=u>0.6?1:0; }}; },
    // Zoomfolge: das ganze Bild faehrt in eine Stelle hinein (aus v1)
    zoom(x,zf){ let y; try{ y=fn(x); }catch(e){ y=0; } const g=svgEl('g',{},svg);
      // alle bisherigen Ebenen in die Zoomgruppe
      for(const key of ['grid','hinter','kurve','vorn'])g.appendChild(L[key]);
      for(const key of ['grid','hinter','kurve','vorn'])for(const p of g.querySelectorAll('[stroke]'))p.setAttribute('vector-effect','non-scaling-stroke');
      const cx=sx(x), cy=sy(y);
      return {apply(u){ const f=1+(zf-1)*eIO(u); g.setAttribute('transform','translate('+cx+' '+cy+') scale('+f.toFixed(4)+') translate('+(-cx)+' '+(-cy)+')'); }}; },
    gerade(x0v,m,k,dash){ const y0v=fn(x0v); const p1={x:xmin,y:y0v+m*(xmin-x0v)}, p2={x:xmax,y:y0v+m*(xmax-x0v)};
      const l=svgEl('line',{x1:sx(p1.x),y1:sy(p1.y),x2:sx(p2.x),y2:sy(p2.y),stroke:KF[k===undefined?0:k],'stroke-width':1.8,opacity:0},L.vorn);
      if(dash)l.setAttribute('stroke-dasharray','6 4'); return l; },
    abl:abl, abl2:abl2, xmin:xmin, xmax:xmax, ymin:ymin, ymax:ymax,
    // Beschriftung eines Punktes; oben bei Gipfel, unten bei Tal
    beschriftung(x,y,text,k){ const oben=abl2(x)<0; const rechts=sx(x)<W-90;
      const t=lab(sx(x)+(rechts?8:-8),sy(y)+(oben?-9:17),text,rechts?'start':'end',KF[k],12.5); t.setAttribute('font-weight','600'); return landItem([t]); },
    // Kappe: das Kurvenstueck um die Stelle, gebogen wie der Gipfel oder das Tal
    kappe(x,r,k,text){ let d=''; const m=40; for(let i=0;i<=m;i++){ const xx=x-r+2*r*i/m; const yy=fn(xx); d+=(i?' L ':'M ')+sx(xx).toFixed(1)+' '+sy(yy).toFixed(1); }
      const p=svgEl('path',{d:d,fill:'none',stroke:KF[k],'stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round',opacity:0},L.vorn);
      const it=drawItem(p); if(text){ const oben=abl2(x)<0; const t=lab(sx(x),sy(fn(x))+(oben?-11:20),text,'middle',KF[k],11.5); t.style.opacity=0;
        const a=it.apply; it.apply=u=>{ a(u); t.style.opacity=u>=0.9?1:0; }; } return it; },
    // Die Fahrt: der Finger ist x. Die Tangente faehrt, m laeuft mit, wird 0 am Gipfel und im Tal.
    fahrt(o){ const g=svgEl('g',{},L.vorn); g.style.opacity=0;
      const line=svgEl('line',{stroke:'var(--k0)','stroke-width':2.2,'stroke-linecap':'round'},g);
      const dot=svgEl('circle',{r:4.2,fill:'var(--k0)'},g);
      const t1=lab(0,0,'','start','var(--k0)',12.5,g); t1.setAttribute('font-weight','600');
      const t2=lab(0,0,'','start','var(--ink)',12.5,g);
      const geister=(o.geister||[]).map(xg=>{ const gg=svgEl('g',{},L.vorn); gg.style.opacity=0; const yg=fn(xg);
        svgEl('line',{x1:sx(xg)-62,y1:sy(yg),x2:sx(xg)+62,y2:sy(yg),stroke:KF[o.k||0],'stroke-width':2,'stroke-linecap':'round'},gg);
        const oben=abl2(xg)<0; const tt=lab(sx(xg)+66,sy(yg)+4,'m = 0','start',KF[o.k||0],12.5,gg); tt.setAttribute('font-weight','600');
        return {g:gg,u:(xg-o.x0)/(o.x1-o.x0)}; });
      return {apply(u){ if(u<=0){ g.style.opacity=0; for(const z of geister)z.g.style.opacity=0; return; }
        const x=o.x0+(o.x1-o.x0)*u, y=fn(x), m=abl(x);
        const dx=1, dy=-m*ky/kx; const nn=Math.hypot(dx,dy); const ex=dx/nn*64, ey=dy/nn*64;
        const px=sx(x), py=sy(y);
        line.setAttribute('x1',px-ex); line.setAttribute('y1',py-ey); line.setAttribute('x2',px+ex); line.setAttribute('y2',py+ey);
        dot.setAttribute('cx',px); dot.setAttribute('cy',py);
        const lx=pl+6, ly=pt+12;
        t2.setAttribute('x',lx); t2.setAttribute('y',ly); t2.textContent='x = '+fmt(x);
        t1.setAttribute('x',lx); t1.setAttribute('y',ly+16); t1.textContent='m = '+fmt(m);
        g.style.opacity=u>0.96?clamp((1-u)/0.04,0,1):1;
        for(const z of geister)z.g.style.opacity=clamp((u-z.u)/0.025,0,1); }}; }
  };
  return G;
}
function drawItem(p,opt){ opt=opt||{}; p.style.opacity=0;
  const it={u:0,L:0,rechnen(){ try{ it.L=p.getTotalLength(); }catch(e){ it.L=1000; } if(!it.L)it.L=1000; p.style.strokeDasharray=it.L; it.apply(it.u); },
    apply(u){ it.u=u; const v=opt.linear?u:eOut(u); p.style.strokeDashoffset=(it.L*(1-v)).toFixed(2); p.style.opacity=u>0?1:0; }};
  return it; }
function landItem(nodes){ const l=[].concat(nodes).filter(Boolean);
  for(const n of l){ n.style.transformBox='fill-box'; n.style.transformOrigin='center'; n.style.opacity=0; }
  return {apply(u){ const s=u<=0?0.3:(u<0.65?0.35+(u/0.65)*0.8:1.15-0.15*((u-0.65)/0.35));
    for(const n of l){ n.style.opacity=u>0?1:0; n.style.transform='scale('+s.toFixed(3)+')'; } }}; }

// ---------------- Pfeile ----------------
// Pfeile laufen in der Rinne links vom Text: aus der Quelle nach unten in die Fuge, nach links in
// die Rinne, senkrecht, waagerecht ins Ziel. Ein Stamm, mehrere Aeste. Sie ueberlagern keinen Text.
function dist(a,b){ return Math.hypot(b.x-a.x,b.y-a.y); }
function pathRund(pts,r){ if(pts.length<2)return ''; let d='M'+pts[0].x.toFixed(1)+' '+pts[0].y.toFixed(1);
  for(let i=1;i<pts.length-1;i++){ const p0=pts[i-1],p1=pts[i],p2=pts[i+1]; const d1=dist(p0,p1),d2=dist(p1,p2);
    if(d1<0.5||d2<0.5){ d+=' L'+p1.x.toFixed(1)+' '+p1.y.toFixed(1); continue; }
    const rr=Math.min(r,d1/2,d2/2); const a={x:p1.x+(p0.x-p1.x)*rr/d1,y:p1.y+(p0.y-p1.y)*rr/d1}, b={x:p1.x+(p2.x-p1.x)*rr/d2,y:p1.y+(p2.y-p1.y)*rr/d2};
    d+=' L'+a.x.toFixed(1)+' '+a.y.toFixed(1)+' Q'+p1.x.toFixed(1)+' '+p1.y.toFixed(1)+' '+b.x.toFixed(1)+' '+b.y.toFixed(1); }
  const e=pts[pts.length-1]; d+=' L'+e.x.toFixed(1)+' '+e.y.toFixed(1); return d; }
function pfeil(o){
  const farbe=KF[o.k||0], lane=o.lane||0;
  const p=svgEl('path',{fill:'none',stroke:farbe,'stroke-width':1.6,'stroke-linecap':'round','stroke-linejoin':'round',opacity:0},szene.pf);
  const kopf=svgEl('path',{fill:farbe,d:'M1 0 L-6 -3.2 L-6 3.2 Z',opacity:0},szene.pf);
  const it={typ:'pfeil',u:0,L:0,split:null,
    rechnen(){ const rx=-12-lane*6, g=6+lane*3; const pts=[];
      const zb=lokal(o.zu);
      if(o.von&&o.von.typ==='pfeil'){ pts.push({x:o.von.split.x,y:o.von.split.y}); }
      else { const vb=lokal(o.von); const s={x:vb.x+vb.w/2,y:vb.y+vb.h-2}; const gapS=vb.y+vb.h+g; pts.push(s,{x:s.x,y:gapS},{x:rx,y:gapS}); }
      // Der Pfeil muendet immer von oben in den Zielchip (GL2, G5 b). Zeilenanfang ist nie ein Ziel.
      { const dx=zb.x+zb.w/2+(o.versatz||0); const gapD=zb.y-g; const d={x:dx,y:zb.y+1};
        pts.push({x:rx,y:gapD},{x:dx,y:gapD},d); it.split={x:rx,y:gapD}; }
      p.setAttribute('d',pathRund(pts,7)); try{ it.L=p.getTotalLength(); }catch(e){ it.L=300; } p.style.strokeDasharray=it.L;
      const a=pts[pts.length-2], b=pts[pts.length-1]; const ang=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
      kopf.setAttribute('transform','translate('+b.x.toFixed(1)+' '+b.y.toFixed(1)+') rotate('+ang.toFixed(1)+')');
      it.apply(it.u); },
    apply(u){ it.u=u; p.style.strokeDashoffset=(it.L*(1-u)).toFixed(2); p.style.opacity=u>0?1:0; kopf.style.opacity=u>0.86?clamp((u-0.86)/0.1,0,1):0; }
  };
  stueck(it,o.dauer||1.6); return it;
}
// ---------------- Flug: eine Zahl wandert an ihren Ort ----------------
function flug(o){
  const t=el('span','token'+(o.k!==undefined?' k'+o.k:'')+(o.txt?' txt':'')); szene.fl.appendChild(t);
  const it={typ:'flug',u:0,von:{x:0,y:0},zu:{x:0,y:0},
    rechnen(){ t.innerHTML=o.von.innerHTML; const vb=lokal(o.von); it.von={x:vb.x,y:vb.y};
      if(o.zu.anker){ const a=o.zu.anker(); const tb=t.getBoundingClientRect(); const s=szene.scale||1; it.zu={x:a.x-(tb.width/s)/2,y:a.y-(tb.height/s)/2}; }
      else { const zb=lokal(o.zu); it.zu={x:zb.x,y:zb.y}; }
      it.apply(it.u); },
    apply(u){ it.u=u; const v=eIO(clamp(u,0,1)); const x=it.von.x+(it.zu.x-it.von.x)*v, y=it.von.y+(it.zu.y-it.von.y)*v;
      t.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';
      const da=u>=0.97; t.style.opacity=(u>0&&!da)?1:0;
      if(o.zu.anker){ for(const n of (o.zu.zeig||[]))n.style.opacity=da?1:0; if(o.zu.tick)o.zu.tick.style.opacity=da?0:1; }
      else { o.zu.style.opacity=da?1:0; } }
  };
  stueck(it,o.dauer||1.2); return it;
}
