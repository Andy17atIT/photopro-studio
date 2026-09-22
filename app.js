/* PhotoPro Studio — lógica compartida (demo funcional, sin backend) */
(function(){
"use strict";
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];
const store={
  get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
if(!store.get('trialEnd')) store.set('trialEnd', Date.now()+3*24*3600*1000);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function toast(msg){
  let t=$('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),3200);
}
function fmtDate(d){return new Date(d).toLocaleDateString('es',{day:'numeric',month:'long',year:'numeric'});}

/* ---------- "en vivo" ahora mismo (social proof) ---------- */
const liveNum=$('.live-num');
if(liveNum){
  const drift=()=>{ liveNum.textContent=8+Math.floor(Math.random()*16); };
  drift();
  setInterval(drift, 7000);
}

/* ---------- fecha de cargo en todas las páginas ---------- */
$$('[data-trial]').forEach(el=>{
  const end=store.get('trialEnd',Date.now());
  el.textContent=fmtDate(end);
});

/* ---------- countdown de oferta (página cancel) ---------- */
function startOfferTimers(){
  $$('[data-offer]').forEach(el=>{
    let s=4*60+59;
    clearInterval(el._t);
    el._t=setInterval(()=>{
      s--; if(s<0)s=0;
      const m=String(Math.floor(s/60)).padStart(2,'0'),ss=String(s%60).padStart(2,'0');
      el.textContent=m+':'+ss;
      if(s===0)clearInterval(el._t);
    },1000);
  });
}
if(document.querySelector('[data-offer]')) startOfferTimers();

/* ---------- formato de tarjeta (checkout) ---------- */
const cardInput=$('#cardNumber');
if(cardInput){
  cardInput.addEventListener('input',()=>{
    let v=cardInput.value.replace(/\D/g,'').slice(0,16);
    cardInput.value=v.replace(/(.{4})/g,'$1 ').trim();
  });
}
const exp=$('#exp');
if(exp){exp.addEventListener('input',()=>{
  let v=exp.value.replace(/\D/g,'').slice(0,4);
  if(v.length>=3)v=v.slice(0,2)+'/'+v.slice(2);
  exp.value=v;
});}
const cvv=$('#cvv');
if(cvv){cvv.addEventListener('input',()=>{cvv.value=cvv.value.replace(/\D/g,'').slice(0,4);});}

const chargeDate=$('#chargeDate'),chargeDate2=$('#chargeDate2');
if(chargeDate)chargeDate.textContent=fmtDate(store.get('trialEnd',Date.now()));
if(chargeDate2)chargeDate2.textContent=fmtDate(store.get('trialEnd',Date.now()));

/* ---------- submit checkout ---------- */
const cf=$('#checkoutForm');
if(cf){
  cf.addEventListener('submit',e=>{
    e.preventDefault();
    const num=$('#cardNumber').value.replace(/\s/g,'');
    const name=$('#cardName').value.trim();
    if(num.length<15){toast('⚠️ Revisa el número de tarjeta.');$('#cardNumber').focus();return;}
    if(!name){toast('⚠️ Escribe el nombre de la tarjeta.');$('#cardName').focus();return;}
    store.set('customer',{name:name,num:num.slice(-4),end:store.get('trialEnd')});
    store.set('subscribed',true);
    location.href='dashboard.html';
  });
}

/* ---------- PRESETS de headshot ---------- */
const PRESETS=[
  {name:"Corporate Blue", c1:"#1e3a5f", c2:"#0f1f33", filter:"saturate(0.9) contrast(1.05) brightness(1.06)", accent:"#60a5fa"},
  {name:"Studio Gray",    c1:"#4a515c", c2:"#20242b", filter:"saturate(0.85) contrast(1.08)",           accent:"#cbd5e1"},
  {name:"Warm Natural",   c1:"#6b5340", c2:"#3a2c20", filter:"saturate(1.12) brightness(1.06) sepia(0.12)",accent:"#fbbf24"},
  {name:"Executive Dark", c1:"#1c1c22", c2:"#050506", filter:"contrast(1.22) brightness(0.97)",          accent:"#e5e7eb"},
  {name:"Creative Pop",   c1:"#7c3aed", c2:"#db2777", filter:"saturate(1.25) hue-rotate(12deg)",         accent:"#c4b5fd"},
  {name:"Clean White",    c1:"#f5f5f5", c2:"#dfe3ea", filter:"brightness(1.09) contrast(1.0)",           accent:"#111827"}
];
function drawCover(ctx,img,W,H){
  const ir=img.naturalWidth/img.naturalHeight, cr=W/H; let dw,dh;
  if(ir>cr){dh=H;dw=H*ir;}else{dw=W;dh=W/ir;}
  const x=(W-dw)/2, y=(H-dh)/2 - dh*0.04;
  ctx.drawImage(img,x,y,dw,dh);
}
function drawSilhouette(ctx,W,H){
  const cx=W/2, tone="#2b3038"; ctx.fillStyle=tone;
  ctx.beginPath();
  ctx.moveTo(cx-W*0.5,H); ctx.lineTo(cx-W*0.46,H*0.82);
  ctx.quadraticCurveTo(cx-W*0.42,H*0.62,cx-W*0.20,H*0.575);
  ctx.lineTo(cx-W*0.11,H*0.55); ctx.lineTo(cx-W*0.11,H*0.47);
  ctx.lineTo(cx+W*0.11,H*0.47); ctx.lineTo(cx+W*0.11,H*0.55);
  ctx.lineTo(cx+W*0.20,H*0.575);
  ctx.quadraticCurveTo(cx+W*0.42,H*0.62,cx+W*0.46,H*0.82);
  ctx.lineTo(cx+W*0.5,H); ctx.closePath(); ctx.fill();
  ctx.fillRect(cx-W*0.075,H*0.40,W*0.15,H*0.10);
  ctx.beginPath(); ctx.ellipse(cx,H*0.30,W*0.15,H*0.17,0,0,Math.PI*2); ctx.fill();
}
function renderHeadshot(canvas,preset,personImg){
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  const g=ctx.createLinearGradient(0,0,W*0.25,H);
  g.addColorStop(0,preset.c1); g.addColorStop(1,preset.c2);
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  const rg=ctx.createRadialGradient(W*0.5,H*0.32,10,W*0.5,H*0.45,W*0.75);
  rg.addColorStop(0,'rgba(255,255,255,0.14)'); rg.addColorStop(1,'rgba(0,0,0,0.30)');
  ctx.fillStyle=rg; ctx.fillRect(0,0,W,H);
  ctx.save(); ctx.filter=preset.filter;
  if(personImg) drawCover(ctx,personImg,W,H); else drawSilhouette(ctx,W,H);
  ctx.restore();
}

/* ---------- dashboard: generación ---------- */
let personImg=null;
const grid=$('#grid');
if(grid){
  const fileInput=$('#fileInput'),demoBtn=$('#demoBtn'),
        pWrap=$('#progressWrap'),pfill=$('#pfill'),plabel=$('#plabel'),
        dlAll=$('#downloadAll'),hint=$('#gridHint');
  const STEPS=["Analizando estructura facial…","Mapeando tono de piel e iluminación…","Generando fondos de estudio…","Aplicando retoque profesional…","Renderizando 48 headshots…"];
  fileInput&&fileInput.addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f)return;
    const img=new Image();
    img.onload=()=>{personImg=img; runGeneration();};
    img.src=URL.createObjectURL(f);
  });
  demoBtn&&demoBtn.addEventListener('click',()=>{personImg=null; runGeneration();});
  dlAll&&dlAll.addEventListener('click',()=>{
    $$('#grid canvas').forEach((c,i)=>{
      const a=document.createElement('a');
      a.download='photopro-headshot-'+(i+1)+'.png'; a.href=c.toDataURL('image/png'); a.click();
    });
    toast('⬇ Descargando tus headshots en 4K…');
  });
  async function runGeneration(){
    pWrap.classList.add('on'); grid.innerHTML=''; dlAll.style.display='none'; hint.style.display='none';
    for(let i=0;i<STEPS.length;i++){
      plabel.textContent=STEPS[i];
      pfill.style.width=Math.round(((i+1)/STEPS.length)*100)+'%';
      await sleep(650+Math.random()*450);
    }
    pWrap.classList.remove('on');
    PRESETS.forEach(p=>{
      const fig=document.createElement('figure'); fig.className='shot';
      const c=document.createElement('canvas'); c.width=480; c.height=640;
      const cap=document.createElement('figcaption');
      cap.innerHTML='<span>'+p.name+'</span><span class="tag">PRO</span>';
      const dl=document.createElement('button'); dl.className='dl'; dl.textContent='⬇ 4K';
      dl.onclick=()=>{const a=document.createElement('a');a.download='photopro-'+p.name+'.png';a.href=c.toDataURL('image/png');a.click();};
      cap.appendChild(dl);
      fig.appendChild(c); fig.appendChild(cap); grid.appendChild(fig);
      renderHeadshot(c,p,personImg);
    });
    dlAll.style.display='inline-flex'; hint.style.display='block';
    toast('✨ 48 headshots generados — aquí ves 6. ¡Descarga todo!');
  }
  if(store.get('subscribed')) setTimeout(()=>{personImg=null; runGeneration();},400);
}

/* ---------- cancel: máquina de estados de dark pattern ---------- */
const csteps=$$('.cstep');
if(csteps.length){
  const dots=$('#cdots'), n=csteps.length;
  dots.innerHTML=Array.from({length:n}).map(()=>'<span class="cdot"></span>').join('');
  const cdots=$$('#cdots .cdot');
  function show(i){
    csteps.forEach((s,idx)=>s.classList.toggle('active',idx===i));
    cdots.forEach((d,idx)=>d.classList.toggle('on',idx<=i));
    if(i===n-1) store.set('cancelled',true);
    if(document.querySelector('[data-offer]')) startOfferTimers();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $$('.cbtn').forEach(b=>b.addEventListener('click',()=>{
    const to=b.dataset.to;
    if(to==='end'){show(n-1);}
    else show(parseInt(to,10));
  }));
  show(0);
}
})();
