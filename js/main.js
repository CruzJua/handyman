/* ════════════════════════════════════════════════
   P SERVICE LLC — MAIN JAVASCRIPT
   js/main.js
════════════════════════════════════════════════ */

/* ── Before/After Comparison Sliders ── */
document.querySelectorAll('.comparison').forEach(el => {
  const after = el.querySelector('.img-after');
  const handle = el.querySelector('.comp-handle');
  let dragging = false;

  function update(clientX) {
    const r = el.getBoundingClientRect();
    let pct = ((clientX - r.left) / r.width) * 100;
    pct = Math.min(Math.max(pct, 2), 98);
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  el.addEventListener('mousedown', e => { dragging = true; update(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (dragging) update(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });

  el.addEventListener('touchstart', e => { dragging = true; update(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', e => { if (dragging) update(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });
});

/* ── Gallery Filter Tabs ── */
const tabs = document.querySelectorAll('.gtab');
const items = document.querySelectorAll('.gitem');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const filter = tab.dataset.filter;
    items.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.display = show ? '' : 'none';
    });
  });
});

/* ── Lightbox ── */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-caption');
const lbClose = document.getElementById('lb-close');

function openLightbox(src, alt, caption) {
  lbImg.src = src;
  lbImg.alt = alt;
  lbCap.textContent = caption || alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
  lbImg.src = '';
}

items.forEach(item => {
  const trigger = () => {
    const img = item.querySelector('img');
    openLightbox(img.src, img.alt, item.dataset.caption || img.alt);
  };
  item.addEventListener('click', trigger);
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
  });
});

lbClose.addEventListener('click', closeLightbox);
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── Contact Form → mailto fallback ── */
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const service = document.getElementById('fservice').value;
  const msg = document.getElementById('fmsg').value.trim();

  if (!name || !phone || !service) {
    alert('Please fill in your name, phone number, and service type.');
    return;
  }

  const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nService Requested: ${service}\n\nProject Details:\n${msg || '(none provided)'}`);
  const subject = encodeURIComponent(`Free Estimate Request — ${service}`);

  window.location.href = `mailto:pedrocerva059@gmail.com?subject=${subject}&body=${body}`;

  const success = document.getElementById('form-success');
  success.classList.add('visible');
  setTimeout(() => success.classList.remove('visible'), 6000);
});

/* ── Scroll-Reveal via IntersectionObserver ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Active Nav Link Highlighting on Scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header-nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--amber)'
      : 'rgba(255,255,255,0.70)';
  });
}, { passive: true });
