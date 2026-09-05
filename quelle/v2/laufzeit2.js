function zeitVerteilen(){
  let U=0; for(const s of SZENEN){ s.von=U; for(const b of s.beats){ b.von=U; U+=1; b.bis=U; } s.bis=U; }
  // Kontinuitaet (Autorbefund 2026-09-05): keine Ruhezonen. Die Stuecke eines Beats kacheln
  // seine ganze Strecke lueckenlos; nur vor einem Blattwechsel bleibt die Blende frei, und die
  // Blende selbst ist Bewegung. gewicht steuert nichts mehr an der Zeit.
  for(const s of SZENEN)s.beats.forEach((b,bi)=>{
    const letzter=bi===s.beats.length-1;
    const von=b.von, bis=letzter?b.bis-BLENDE:b.bis, d=bis-von;
    const gew=b.stuecke.map(x=>x.dauer), summe=gew.reduce((a,c)=>a+c,0)||1; let lauf=0;
    b.stuecke.forEach((st,i)=>{ const a=von+d*(lauf/summe); lauf+=gew[i]; const bb=von+d*(lauf/summe);
      for(const it of st.items){ it.a=a; it.b=Math.max(bb,a+0.001); } });
  });
  TOTAL=U; document.documentElement.style.setProperty('--kurbel',(Math.max(2,U)*100).toFixed(0)+'vh');
}
const BLENDE=0.09;
function render(t){
  const letzte=SZENEN[SZENEN.length-1];
  for(const s of SZENEN){
    let o; if(t<s.von-BLENDE||t>s.bis+BLENDE)o=0; else if(t<s.von)o=(t-(s.von-BLENDE))/BLENDE; else if(t>s.bis)o=1-(t-s.bis)/BLENDE; else o=1;
    if(s===SZENEN[0]&&t<s.von)o=1; if(s===letzte&&t>s.bis)o=1;
    s.kn.style.opacity=o.toFixed(3); s.kn.style.visibility=o>0?'visible':'hidden';
    if(o<=0)continue;
    for(const it of s.items){ const u=clamp((t-it.a)/(it.b-it.a),0,1); if(it.last!==u){ it.last=u;
      try{ it.apply(u); }catch(e){ melden('apply: '+e.message); } } }
  }
}
function melden(m){ const f=$('fehler'); if(!f)return; f.style.display='block'; f.textContent=m; }
// ---------------- Einpassen: ein Bogen ist ein Blatt ----------------
function einpassen(){
  for(const s of SZENEN){
    const inh=s.inhalt; inh.style.transform=''; inh.style.width=''; inh.style.gap='';
    const kinder=[...inh.children].filter(k=>!k.classList.contains('pfeile')&&!k.classList.contains('flug'));
    const cs=getComputedStyle(s.kn); const avail=s.kn.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
    if(!avail||!kinder.length){ s.scale=1; continue; }
    const mess=()=>{ let hh=0; for(const k of kinder)hh+=k.getBoundingClientRect().height; return hh; };
    let f=1, hgt=mess(), n=kinder.length;
    let gap=n>1?clamp((avail-hgt)/(n-1),16,26):0; inh.style.gap=gap+'px';
    let tot=hgt+gap*(n-1);
    for(let i=0;i<3&&tot>avail+1;i++){ f=Math.max(0.55,f*(avail/tot)); inh.style.width=(100/f).toFixed(2)+'%'; inh.style.transform='scale('+f.toFixed(4)+')';
      hgt=mess()/f; tot=hgt+gap*(n-1); }
    s.scale=f;
  }
  // Geometrie je Blatt, im Bezugssystem seines eigenen Inhalts
  for(const s of SZENEN){ szene=s; for(const it of s.items)if(it.rechnen){ try{ it.rechnen(); }catch(e){ melden('rechnen: '+e.message); } } }
}
// ---------------- Fortschritt ----------------
const rad=$('rad'), fill=$('fill'), leiste=$('fortschritt');
let angefordert=false, bereit=false;
function fortschritt(){ const hh=rad.scrollHeight-rad.clientHeight; return hh>0?clamp(rad.scrollTop/hh,0,1):0; }
function anzeigen(){ angefordert=false; const p=fortschritt(); fill.style.transform='scaleY('+p.toFixed(4)+')';
  leiste.setAttribute('aria-valuenow',String(Math.round(p*100))); if(bereit)render(p*TOTAL);
  if(window.__diag){ const d=$('diag'); if(d){ d.style.display='block'; d.textContent='p='+p.toFixed(3)+' t='+(p*TOTAL).toFixed(2)+' top='+Math.round(rad.scrollTop)+'/'+rad.scrollHeight+' bereit='+bereit; } } }
rad.addEventListener('scroll',()=>{ if(!angefordert){ angefordert=true; requestAnimationFrame(anzeigen); } },{passive:true});
function neuMessen(){ clearTimeout(neuMessen._t); neuMessen._t=setTimeout(()=>{ einpassen(); for(const s of SZENEN)for(const it of s.items)it.last=undefined; anzeigen(); },160); }
addEventListener('resize',neuMessen,{passive:true});

// ---------------- Das Tor ----------------
const klein=matchMedia('(pointer:coarse)').matches;
const vollbildMoeglich=()=>!!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen);
const imVollbild=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function starten(){ if(klein&&vollbildMoeglich()&&!imVollbild()){ try{ const e=document.documentElement; const p=(e.requestFullscreen||e.webkitRequestFullscreen).call(e,{navigationUI:'hide'}); if(p&&p.catch)p.catch(()=>{}); }catch(err){} }
  document.documentElement.classList.add('laeuft'); requestAnimationFrame(()=>{ neuMessen(); rad.focus({preventScroll:true}); }); }
$('start').addEventListener('click',starten);
$('raus').addEventListener('click',()=>{ if(imVollbild()){ try{ (document.exitFullscreen||document.webkitExitFullscreen).call(document); }catch(e){} } else document.documentElement.classList.remove('laeuft'); });
function vollbildGewechselt(){ neuMessen(); if(!imVollbild()&&klein&&vollbildMoeglich())document.documentElement.classList.remove('laeuft'); }
addEventListener('fullscreenchange',vollbildGewechselt); addEventListener('webkitfullscreenchange',vollbildGewechselt);
addEventListener('keydown',e=>{ if(e.key==='Escape'&&!imVollbild())document.documentElement.classList.remove('laeuft'); });
if(klein&&vollbildMoeglich())$('start').textContent='Im Vollbild starten';

// ---------------- Los ----------------
function los(){
  torFuellen();
  try{ bauen(); }catch(e){ melden('bauen: '+e.message); }
  zeitVerteilen();
  const ruhig=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const knopf=$('start'); const knopfText=knopf.textContent; knopf.disabled=true; knopf.textContent='Wird vorbereitet …';
  const fertig=()=>{ if(ruhig){ document.documentElement.classList.add('ruhig'); for(const s of SZENEN){ szene=s; s.kn.style.opacity=1; s.kn.style.visibility='visible'; s.scale=1; for(const it of s.items){ try{ if(it.rechnen)it.rechnen(); it.apply(1); }catch(e){} } } return; }
    einpassen(); bereit=true; anzeigen();
    // Ohne Film bleibt der Knopf gesperrt (Datei nicht gefunden)
    if(!window.__keinFilm){ knopf.disabled=false; knopf.textContent=knopfText; } else knopf.textContent='Film nicht gefunden'; };
  const typeset=()=>(window.MathJax&&MathJax.typesetPromise)?MathJax.typesetPromise(mathKnoten):Promise.resolve();
  typeset().catch(()=>{}).then(()=>{ if(document.fonts&&document.fonts.ready)return document.fonts.ready; }).then(()=>setTimeout(fertig,40));
}
// Ein Film kann als eigene Datei danebenliegen: player.html?film=filme/x.json
function filmLaden(){
  let name='';
  try{ name=new URLSearchParams(location.search).get('film')||''; }catch(e){}
  const gut=/^[A-Za-z0-9_\-]+(\/[A-Za-z0-9_\-]+)*\.json$/.test(name)&&name.indexOf('..')<0;
  if(!name||!gut)return Promise.resolve();
  return fetch(name,{credentials:'omit'}).then(r=>{ if(!r.ok)throw new Error(String(r.status)); return r.json(); })
    .then(j=>{ DATEN=lesen(j); })
    .catch(()=>{ DATEN=Object.assign({},LEER,{titel:'Film nicht gefunden',quelle:name}); window.__keinFilm=true; });
}
function anfang(){ filmLaden().then(los); }
if(window.MathJax&&MathJax.startup&&MathJax.startup.promise)MathJax.startup.promise.then(anfang); else addEventListener('load',anfang);
// Pruefgriff fuer jsdom und Diagnose: nichts davon laeuft im Betrieb
window.__bk={SZENEN:SZENEN, render:t=>render(t), einpassen:einpassen, zeit:zeitVerteilen, total:()=>TOTAL, bereit:()=>bereit};
