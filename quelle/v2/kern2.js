// Formelauswertung und der Doppelgraph aus v1
function compileExpr(src){
  let s=String(src||'').toLowerCase().replace(/\s+/g,'');
  if(!s||s.length>160) return null;
  if(!/^[0-9x+\-*/().^a-z,]+$/.test(s)) return null;
  // Funktionsnamen → @a@-Platzhalter (längere zuerst), Konstanten → #e#/#p#
  const fnames=[['asin','Math.asin'],['acos','Math.acos'],['atan','Math.atan'],['sinh','Math.sinh'],['cosh','Math.cosh'],
    ['tanh','Math.tanh'],['sqrt','Math.sqrt'],['log10','Math.log10'],['sin','Math.sin'],['cos','Math.cos'],
    ['tan','Math.tan'],['exp','Math.exp'],['ln','Math.log'],['log','Math.log'],['abs','Math.abs']];
  s=s.replace(/\^/g,'**');
  s=s.split('pi').join('#p#');
  fnames.forEach(([k],i)=>{ s=s.split(k).join('@'+String.fromCharCode(97+i)+'@'); });
  s=s.replace(/(?<![a-z0-9@#])e(?![a-z0-9@#])/g,'#e#');
  // implizite Multiplikation: 2x, 2(, x(, )x, )(, 2sin, x pi …
  s=s.replace(/(\d|\))(?=[x(@#])/g,'$1*');
  s=s.replace(/x(?=[\d(@#])/g,'x*');
  s=s.replace(/#(?=[\dx(@#])/g,'#*');   // nach schließendem # (Konstante) folgt Operand
  s=s.replace(/@(?=[\dx#])/g,'@*');     // nach schließendem @ folgt Operand (vor "(" bleibt es ein Funktionsaufruf)
  // unäres Minus vor Potenz absichern: -(x-1)**2 → (0-1)*(x-1)**2
  s=s.replace(/(^|[(+\-*/,])-/g,'$1(0-1)*');
  // Übrig dürfen nur x, Zahlen, Operatoren und Platzhalter sein
  if(/[a-z]/.test(s.replace(/@[a-z]@|#[ep]#|x/g,''))) return null;
  fnames.forEach(([,v],i)=>{ s=s.split('@'+String.fromCharCode(97+i)+'@').join(v); });
  s=s.split('#e#').join('Math.E').split('#p#').join('Math.PI');
  try{
    const f=new Function('x','"use strict";return ('+s+');');
    let ok=false;
    for(const t of [-2,-1,0.3,1,2.7]){ const v=f(t); if(isFinite(v))ok=true; }
    return ok?f:null;
  }catch(e){ return null; }
}

function makePlot(cfg, svgVor, dy){
  const W=440,H=290,pad=34;
  const oy=dy||0;
  const sx=x=>pad+(x-cfg.xmin)/(cfg.xmax-cfg.xmin)*(W-2*pad);
  const sy=y=>oy+H-pad-(y-cfg.ymin)/(cfg.ymax-cfg.ymin)*(H-2*pad);
  const NS='http://www.w3.org/2000/svg';
  const svg=svgVor||document.createElementNS(NS,'svg');
  if(!svgVor){ svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.setAttribute('width','440'); svg.style.maxWidth='100%'; }
  const g=(tag,at)=>{const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);svg.appendChild(e);return e;};
  const xstep=Math.max(1,Math.round((cfg.xmax-cfg.xmin)/9)), ystep=Math.max(1,Math.round((cfg.ymax-cfg.ymin)/8));
  for(let x=Math.ceil(cfg.xmin);x<=cfg.xmax;x+=xstep) g('line',{x1:sx(x),y1:oy+pad-6,x2:sx(x),y2:oy+H-pad,stroke:'var(--grid)','stroke-width':1});
  for(let y=Math.ceil(cfg.ymin);y<=cfg.ymax;y+=ystep) g('line',{x1:pad,y1:sy(y),x2:W-pad+6,y2:sy(y),stroke:'var(--grid)','stroke-width':1});
  if(cfg.ymin<=0&&cfg.ymax>=0){ g('line',{x1:pad,y1:sy(0),x2:W-pad+10,y2:sy(0),stroke:'var(--axis)','stroke-width':1.4});
    g('path',{d:`M ${W-pad+10} ${sy(0)} l -7 -4 v 8 z`,fill:'var(--axis)'}); }
  if(cfg.xmin<=0&&cfg.xmax>=0){ g('line',{x1:sx(0),y1:oy+H-pad,x2:sx(0),y2:oy+pad-10,stroke:'var(--axis)','stroke-width':1.4});
    g('path',{d:`M ${sx(0)} ${oy+pad-10} l -4 7 h 8 z`,fill:'var(--axis)'}); }
  const lab=(x,y,t,anch,fill)=>{const e=g('text',{x,y,fill:fill||'var(--muted)','font-size':'13','text-anchor':anch||'middle','font-family':'Source Sans 3,sans-serif'});e.textContent=t;return e;};
  const y0lab=(cfg.ymin<=0&&cfg.ymax>=0)?sy(0):oy+H-pad;
  for(let x=Math.ceil(cfg.xmin);x<=cfg.xmax;x+=xstep){ if(x!==0) lab(sx(x),y0lab+15,String(x)); }
  const x0lab=(cfg.xmin<=0&&cfg.xmax>=0)?sx(0):pad;
  for(let y=Math.ceil(cfg.ymin);y<=cfg.ymax;y+=ystep){ if(y!==0) lab(x0lab-8,sy(y)+4,String(y),'end'); }
  if(cfg.legend){const t=g('text',{x:W-pad,y:oy+pad+2,fill:'var(--curve)','font-size':'13.5','text-anchor':'end','font-weight':'600','font-family':'Source Sans 3,sans-serif'});t.textContent=cfg.legend;}
  const api={svg,cfg,oy,W,H,pad,sx,sy,g,lab,curvePaths:[],
    // Ein Wert steht gleichzeitig in der Formel und im Bild: gestrichelt zu beiden Achsen
    wert(x,fn,text){
      let y; try{ y=fn(x); }catch(e){ return null; }
      if(!isFinite(y)||x<cfg.xmin||x>cfg.xmax||y<cfg.ymin||y>cfg.ymax)return null;
      const n=[];
      n.push(g('line',{x1:sx(x),y1:sy(y),x2:sx(x),y2:(cfg.ymin<=0&&cfg.ymax>=0)?sy(0):(oy+H-pad),
        stroke:'var(--pt)','stroke-width':1.1,'stroke-dasharray':'4 3',opacity:'.75'}));
      n.push(g('line',{x1:sx(x),y1:sy(y),x2:(cfg.xmin<=0&&cfg.xmax>=0)?sx(0):pad,y2:sy(y),
        stroke:'var(--pt)','stroke-width':1.1,'stroke-dasharray':'4 3',opacity:'.75'}));
      n.push(g('circle',{cx:sx(x),cy:sy(y),r:4,fill:'var(--pt)'}));
      if(text)n.push(lab(sx(x)+9,sy(y)-9,text,'start','var(--pt)'));
      return n;
    },
    // Flaechen und Hilfslinien werden hinter die Kurve gelegt, sonst decken sie sie zu
    hinten(k){ const erste=api.curvePaths[0]; if(erste&&erste.p&&erste.p.parentNode===svg)svg.insertBefore(k,erste.p); return k; },
    // Eine Gerade durch einen Punkt, fuer Beruehrgeraden in der Zoomfolge
    gerade(x0,y0,m){
      const p1={x:cfg.xmin,y:y0+m*(cfg.xmin-x0)}, p2={x:cfg.xmax,y:y0+m*(cfg.xmax-x0)};
      return g('line',{x1:sx(p1.x),y1:sy(p1.y),x2:sx(p2.x),y2:sy(p2.y),
        stroke:'var(--accent)','stroke-width':1.8,opacity:'.9'});
    },
    // Rechtecke unter der Kurve, fuer die Bildfolge der Annaeherung
    balken(fn,n){
      const knoten=[], b=(cfg.xmax-cfg.xmin)/n;
      for(let i=0;i<n;i++){
        const x=cfg.xmin+i*b; let y; try{ y=fn(x+b/2); }catch(e){ y=0; }
        if(!isFinite(y))continue;
        const yk=Math.max(cfg.ymin,Math.min(cfg.ymax,y));
        const oben=sy(yk), unten=(cfg.ymin<=0&&cfg.ymax>=0)?sy(0):(oy+H-pad);
        knoten.push(g('rect',{x:sx(x),y:Math.min(oben,unten),width:Math.max(0.6,sx(x+b)-sx(x)-0.5),
          height:Math.abs(unten-oben),fill:'var(--accent)',opacity:'.28',stroke:'var(--accent)','stroke-width':.4}));
      }
      return knoten;
    },
    curve(fn,animate){
      let d='';const n=240;
      for(let i=0;i<=n;i++){const x=cfg.xmin+i*(cfg.xmax-cfg.xmin)/n;let y;try{y=fn(x);}catch(e){y=NaN;}
        if(!isFinite(y)||y<cfg.ymin-4||y>cfg.ymax+4){ if(d&&!d.endsWith('M'))d+=' M'; continue; }
        const px=sx(x).toFixed(1),py=sy(y).toFixed(1);
        d+= (d===''||d.endsWith('M')) ? (d===''?'M ':' ')+px+' '+py : ' L '+px+' '+py;
      }
      d=d.replace(/ M$/,'');
      if(!d)return;
      const p=g('path',{d,fill:'none',stroke:'var(--curve)','stroke-width':2.4,'stroke-linecap':'round'});
      let L=0; try{L=p.getTotalLength();}catch(e){}
      if(!L)L=1200;
      api.curvePaths.push({p,L});
      if(animate&&L&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        p.style.strokeDasharray=L;p.style.strokeDashoffset=L;
        p.style.transition='stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)';
        requestAnimationFrame(()=>requestAnimationFrame(()=>{p.style.strokeDashoffset='0';}));
      }
    },
    point(x,y,label){ if(x<cfg.xmin||x>cfg.xmax||y<cfg.ymin||y>cfg.ymax)return null;
      const c=g('circle',{cx:sx(x),cy:sy(y),r:4.5,fill:'var(--pt)'});
      const t=label?lab(sx(x)+8,sy(y)-9,label,'start','var(--pt)'):null;
      return [c,t]; },
    hline(y,label){ if(y<cfg.ymin||y>cfg.ymax)return null;
      const l=api.hinten(g('line',{x1:pad,y1:sy(y),x2:W-pad,y2:sy(y),stroke:'var(--axis)','stroke-width':1.2,'stroke-dasharray':'5 4'}));
      const t=label?lab(pad+4,sy(y)-5,label,'start','var(--region)'):null;
      return [l,t]; },
    vline(x,label){ if(x<cfg.xmin||x>cfg.xmax)return null;
      const l=api.hinten(g('line',{x1:sx(x),y1:oy+pad,x2:sx(x),y2:oy+H-pad,stroke:'var(--axis)','stroke-width':1.2,'stroke-dasharray':'5 4'}));
      const t=label?lab(sx(x)+4,oy+pad+12,label,'start','var(--region)'):null;
      return [l,t]; },
    region(y,dir,label){
      const top=dir==='above'?oy+pad-6:sy(y), h=dir==='above'?Math.max(0,sy(y)-(oy+pad-6)):Math.max(0,(oy+H-pad)-sy(y));
      const r=api.hinten(g('rect',{x:pad,y:top,width:W-2*pad,height:h,fill:'var(--region)',opacity:'0.10'}));
      return [r].concat(api.hline(y,label)||[]); },
    sweep(fn,x0,x1,label,animate){
      const cl=x=>Math.max(cfg.xmin,Math.min(cfg.xmax,x));
      x0=cl(num(x0,cfg.xmin)); x1=cl(num(x1,cfg.xmax));
      const yAt=x=>{try{const y=fn(x);return isFinite(y)?Math.max(cfg.ymin,Math.min(cfg.ymax,y)):null;}catch(e){return null;}};
      const y1v=yAt(x1); if(y1v===null)return;
      const c=g('circle',{cx:sx(x1),cy:sy(y1v),r:5,fill:'var(--pt)'});
      const t=label?lab(sx(x1)+9,sy(y1v)-9,label,'start','var(--pt)'):null;
      if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        const T=1900,start=performance.now();
        const tick=now=>{ const u=Math.min(1,(now-start)/T), x=x0+(x1-x0)*(u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2);
          const y=yAt(x); if(y!==null){ c.setAttribute('cx',sx(x)); c.setAttribute('cy',sy(y));
            if(t){t.setAttribute('x',sx(x)+9);t.setAttribute('y',sy(y)-9);} }
          if(u<1)requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    }
  };
  return api;
}


