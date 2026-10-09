(function(){
  var d=document; d.documentElement.classList.remove('no-js');
  // mobile nav
  var nav=d.getElementById('nav'), bg=d.querySelector('.burger');
  if(bg&&nav){
    bg.addEventListener('click',function(){var o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.focus()}});
  }
  // header shadow on scroll
  var h=d.querySelector('.hdr'); var sc=function(){h.classList.toggle('scrolled',scrollY>8)}; sc(); addEventListener('scroll',sc,{passive:true});
  // stagger index per group
  d.querySelectorAll('[data-stagger]').forEach(function(g){g.querySelectorAll(':scope > .rv').forEach(function(el,i){el.style.setProperty('--i',i)})});
  // hero video: no autoplay under reduced motion, pause off-screen, explicit control
  var hv=d.querySelector('.hv'), vb=d.querySelector('.vbtn');
  if(hv&&vb){
    var rm=matchMedia('(prefers-reduced-motion: reduce)').matches, user=null;
    var sync=function(){var p=!hv.paused; vb.classList.toggle('playing',p); vb.setAttribute('aria-label',p?vb.dataset.pause:vb.dataset.play)};
    hv.addEventListener('play',sync); hv.addEventListener('pause',sync);
    vb.addEventListener('click',function(){ if(hv.paused){user='play';hv.play()} else {user='pause';hv.pause()} });
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){ if(user==='play'||(!rm&&user!=='pause')) hv.play().catch(function(){}) } else hv.pause();
    })},{threshold:.25}).observe(hv);
  }
  // reveal on scroll
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
    d.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
  } else d.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')});
  var y=d.getElementById('yr'); if(y) y.textContent=new Date().getFullYear();
  // contact form
  var f=d.getElementById('cform'); if(!f) return;
  var m=d.getElementById('fmsg');
  function check(fl){var c=fl.querySelector('input,select,textarea'); var ok=c.checkValidity(); fl.classList.toggle('bad',!ok); return ok}
  f.querySelectorAll('.fld').forEach(function(fl){var c=fl.querySelector('input,select,textarea'); c.addEventListener('blur',function(){if(c.value)check(fl)}); c.addEventListener('input',function(){if(fl.classList.contains('bad'))check(fl)})});
  f.addEventListener('submit',function(e){
    e.preventDefault(); var first=null;
    f.querySelectorAll('.fld').forEach(function(fl){if(!check(fl)&&!first)first=fl.querySelector('input,select,textarea')});
    var cb=f.querySelector('.chk input'); if(!cb.checked&&!first)first=cb;
    if(first){first.focus(); if(first===cb)cb.reportValidity(); return}
    var b=f.querySelector('button[type=submit]'), t=b.innerHTML; b.disabled=true; b.textContent=f.dataset.sending; m.className='fmsg';
    fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}})
      .then(function(r){if(!r.ok)throw 0; m.textContent=f.dataset.ok; m.className='fmsg ok'; f.reset()})
      .catch(function(){m.textContent=f.dataset.err; m.className='fmsg err'})
      .then(function(){b.disabled=false; b.innerHTML=t; m.focus()});
  });
})();
