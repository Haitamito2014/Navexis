/* Navexis site — minimal JS for nav + UX polish
   Works on static hosts (GitHub Pages included).
*/

(function(){
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  const isFR = lang.startsWith('fr');

  // Mobile menu
  const menuBtn = document.querySelector('[data-menu-btn]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');
  if(menuBtn && mobilePanel){
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      mobilePanel.hidden = isOpen;
    });

    // Close mobile panel on link click
    mobilePanel.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobilePanel.hidden = true;
      });
    });
  }

  // Scroll progress + back to top
  const progress = document.querySelector('[data-progress]');
  const toTop = document.querySelector('[data-to-top]');
  function onScroll(){
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
    const height = (doc.scrollHeight - doc.clientHeight) || 1;
    const p = Math.max(0, Math.min(1, scrollTop / height));

    if(progress){
      progress.style.transform = `scaleX(${p})`;
    }
    if(toTop){
      if(scrollTop > 600) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Scroll reveal (subtle)
  if(!prefersReduced){
    const revealTargets = Array.from(document.querySelectorAll(
      '.hero-grid > *, main section .head, main .card, main .badge, main .kpi, main .step, main .inline-photo'
    ));

    revealTargets.forEach((el, i) => {
      if(!el.classList.contains('reveal')){
        el.classList.add('reveal');
        const delay = Math.min(i * 35, 220);
        el.style.transitionDelay = delay + 'ms';
      }
    });

    const io = new IntersectionObserver((entries) => {
      for(const entry of entries){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -12% 0px' });

    revealTargets.forEach(el => io.observe(el));
  }else{
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  // Scrollspy (active nav link)
  const desktopLinks = Array.from(document.querySelectorAll('header .nav a[href^="#"]'));
  const mobileLinks = Array.from(document.querySelectorAll('.mobile-panel a[href^="#"]'));
  const allLinks = desktopLinks.concat(mobileLinks);

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if(allLinks.length && sections.length){
    const setActive = (id) => {
      allLinks.forEach(a => {
        const match = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('active', match);
        if(match) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    };

    const spy = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if(!visible.length) return;
      visible.sort((a,b) => b.intersectionRatio - a.intersectionRatio);
      setActive(visible[0].target.id);
    }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, .1, .25, .5, .75, 1] });

    sections.forEach(sec => spy.observe(sec));
  }

  // Contact form: two modes
  // 1) Email client (mailto) — always works on static hosting
  // 2) Optional automatic sending via Formspree — set FORM_ENDPOINT below.
  const FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxxx"

  const form = document.querySelector('form[data-contact-form]');
  const toast = document.querySelector('[data-toast]');
  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());

      // Simple anti-bot honeypot
      if(payload.website){
        return;
      }

      const defaultSubject = isFR ? 'Demande de contact — Navexis' : 'Contact request — Navexis';
      const subject = payload.subject || defaultSubject;

      const labels = isFR
        ? { name:'Nom', company:'Entreprise', email:'Email', phone:'Téléphone', subject:'Sujet', message:'Message' }
        : { name:'Name', company:'Company', email:'Email', phone:'Phone', subject:'Subject', message:'Message' };

      const lines = [
        `${labels.name}: ${payload.name || ''}`,
        `${labels.company}: ${payload.company || ''}`,
        `${labels.email}: ${payload.email || ''}`,
        `${labels.phone}: ${payload.phone || ''}`,
        `${labels.subject}: ${payload.subject || ''}`,
        '',
        payload.message || ''
      ].join('\n');

      if(FORM_ENDPOINT){
        try{
          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: data
          });
          if(!res.ok) throw new Error('Network response was not ok');
          showToast(isFR ? '✅ Message envoyé. Nous revenons vers vous rapidement.' : '✅ Message sent. We will get back to you shortly.', false);
          form.reset();
          return;
        }catch(err){
          showToast(isFR ? '⚠️ Envoi automatique indisponible. Ouverture de votre email…' : '⚠️ Automatic sending unavailable. Opening your email…', false);
        }
      }

      const mailto = `mailto:contact@navexistech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
      window.location.href = mailto;
    });
  }

  function showToast(msg, isError){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.toggle('error', Boolean(isError));
    toast.style.display = 'block';
  }
})();
