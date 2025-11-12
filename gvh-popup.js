(function(){
  const DELAY_MS = 12000; // 12 sec
  const COOKIE_SKIP_RE = /(gvh_is_subscriber|gvh_is_paid)=1/;
  const SET_SUB_COOKIE = "gvh_is_subscriber=1; path=/; max-age=31536000; SameSite=Lax";
  const ENORMAIL_ACTION = "https://app.enormail.eu/subscribe/e78032ce963c86af49ea6e394f594942";

  if (window.__GVH_POPUP_INIT__) return;
  window.__GVH_POPUP_INIT__ = true;

  // --- URL guard: primaire categorieën + Stilstaan-hub ---
  const path = (location.pathname || "/").replace(/\/+$/, "/");
  const seg = path.split("/").filter(Boolean);

  const PRIMARY_CATS = new Set(["jezelf","keuzes","vasthouden","vrij-maken","aanname","aannames","loslaten"]);
  const STILSTAAN_PREFIX = "stilstaan-om-te-groeien-inspiratie-voor-persoonlijke-groei";
  const EXCLUDE_RE = /(bedank|thank|checkout|order|betaal|subscribe|cart|pay)/i;

  const inPrimaryCat = seg.length >= 2 && PRIMARY_CATS.has(seg[0]);
  // Voor Stilstaan: minimaal 3 segmenten (prefix / subgroep / artikel)
  const inStilstaanHub = seg[0] === STILSTAAN_PREFIX && seg.length >= 3;

  if ((!inPrimaryCat && !inStilstaanHub) || EXCLUDE_RE.test(path)) return;

  function injectCSS(){
    const css = `
      .gvh-b{position:fixed;inset:0;background:rgba(0,0,0,.35);display:none;z-index:99998}
      .gvh-d{position:fixed;inset:0;display:none;align-items:center;justify-content:center;padding:20px;z-index:99999}
      .gvh-c{max-width:560px;width:100%;background:#fff;border-radius:12px;
        box-shadow:0 10px 28px rgba(0,0,0,.14);padding:20px;position:relative;line-height:1.55;
        font-family:'Quicksand',sans-serif}
      .gvh-x{position:absolute;top:8px;right:10px;background:transparent;border:0;
        font-size:22px;cursor:pointer}
      @media(max-width:680px){
        .gvh-c{padding:16px}
        .gvh-c h3{font-size:20px}
        .gvh-f input[type="text"],.gvh-f input[type="email"],.gvh-f input[type="submit"]{width:100% !important}
      }`;
    const tag=document.createElement('style');
    tag.textContent=css;
    document.head.appendChild(tag);
  }

  function injectHTML(){
    const bg=document.createElement('div');bg.className='gvh-b';
    const wrap=document.createElement('div');wrap.className='gvh-d';
    const card=document.createElement('div');card.className='gvh-c';

    const close=document.createElement('button');close.className='gvh-x';close.textContent='×';
    const title=document.createElement('h3');title.textContent='Even voor je weggaat…';
    const desc=document.createElement('p');desc.textContent='Ontvang wekelijks één blog die niet duwt of trekt — maar ruimte maakt.';
    const quote=document.createElement('p');quote.style.fontStyle='italic';
    quote.textContent='“Loslaten is iets wat je moet ervaren, niet alleen begrijpen.”';
    const lead=document.createElement('p');
    lead.style.cssText='font-size:1.05rem;font-weight:600;text-align:center';
    lead.textContent='Eén keer per week een blog die niet vraagt om actie, maar je wél iets laat zien.';

    const form=document.createElement('form');
    form.action=ENORMAIL_ACTION; form.method='post';
    form.style.cssText='display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;align-items:center';

    const n=document.createElement('input');
    n.type='text'; n.name='name'; n.required=true; n.placeholder='Voornaam';
    n.style.cssText='padding:.6rem .9rem;border:1px solid #ccc;border-radius:8px';
    const e=document.createElement('input');
    e.type='email'; e.name='email'; e.required=true; e.placeholder='E-mailadres';
    e.style.cssText='padding:.6rem .9rem;border:1px solid #ccc;border-radius:8px';
    const s=document.createElement('input');
    s.type='submit'; s.value='Ja, ik lees graag mee';
    s.style.cssText='padding:.6rem 1.2rem;background:#e6dfd1;border:0;border-radius:8px;cursor:pointer';

    form.append(n,e,s);
    card.append(close,title,desc,quote,lead,form);
    wrap.append(card);
    document.body.append(bg,wrap);

    const show=()=>{bg.style.display='block';wrap.style.display='flex'};
    const hide=()=>{bg.style.display='none';wrap.style.display='none'};

    close.onclick=hide;
    bg.onclick=(ev)=>{if(ev.target===bg)hide()};
    form.onsubmit=()=>{document.cookie=SET_SUB_COOKIE};

    // Toon na 12s
    setTimeout(()=>{show()},DELAY_MS);
  }

  function run(){
    if (COOKIE_SKIP_RE.test(document.cookie||'')) return;
    injectCSS();
    injectHTML();
  }

  (document.readyState==='loading')
    ? document.addEventListener('DOMContentLoaded',run)
    : run();
})();
