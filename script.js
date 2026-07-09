/* ============================================================
   AUTONATION CUSTOM — SCRIPT
   1. Navbar scroll & mobile menu
   2. Smooth scroll / active link
   3. Scroll-triggered animations
   4. Animated counters
   5. Hero parallax
   6. Gallery filter + lightbox
   7. Before/After slider
   8. Contact form
   9. Back to top
   10. Footer year
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. NAVBAR SCROLL & MOBILE MENU ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-menu__links a, .mobile-menu__cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- 2. ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------- 3. SCROLL-TRIGGERED ANIMATIONS ---------- */
  const animatedEls = document.querySelectorAll('[data-animate]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;
        setTimeout(() => el.classList.add('is-visible'), Number(delay));
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  animatedEls.forEach(el => revealObserver.observe(el));

  /* ---------- 4. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat__number');

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = Number(el.getAttribute('data-decimal') || 0);
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ---------- 5. HERO PARALLAX ---------- */
  const heroParallax = document.getElementById('heroParallax');
  const hero = document.querySelector('.hero');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroParallax && hero && !prefersReducedMotion && window.innerWidth > 900) {
    hero.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 24;
      const y = (e.clientY / innerHeight - 0.5) * 24;
      heroParallax.style.transform = `translate(${x}px, ${y}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroParallax.style.transform = 'translate(0, 0)';
    });
  }

  /* ---------- 6. GALLERY FILTER + LIGHTBOX ---------- */
  const filterButtons = document.querySelectorAll('.gallery__filter');
  const galleryItems = document.querySelectorAll('.gallery__item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.hidden = !match;
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- 7. BEFORE / AFTER SLIDER ---------- */
  const baSlider = document.getElementById('baSlider');
  const baBefore = document.getElementById('baBefore');
  const baHandle = document.getElementById('baHandle');

  if (baSlider) {
    let dragging = false;

    const setSlider = (percent) => {
      const clamped = Math.max(0, Math.min(100, percent));
      baBefore.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      baHandle.style.left = `${clamped}%`;
      baHandle.setAttribute('aria-valuenow', Math.round(clamped));
    };

    const percentFromEvent = (clientX) => {
      const rect = baSlider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };

    baSlider.addEventListener('pointerdown', (e) => {
      dragging = true;
      setSlider(percentFromEvent(e.clientX));
    });
    window.addEventListener('pointermove', (e) => {
      if (dragging) setSlider(percentFromEvent(e.clientX));
    });
    window.addEventListener('pointerup', () => { dragging = false; });

    baHandle.addEventListener('keydown', (e) => {
      const current = parseFloat(baHandle.getAttribute('aria-valuenow'));
      if (e.key === 'ArrowLeft') setSlider(current - 5);
      if (e.key === 'ArrowRight') setSlider(current + 5);
    });

    setSlider(50);
  }

  /* ---------- 8. CONTACT FORM ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        formStatus.textContent = 'Please fill in the required fields (name and phone).';
        return;
      }
      // No backend connected yet — replace this block with a real submission handler.
      formStatus.textContent = 'Thanks! Your message has been received — we\'ll get back to you shortly.';
      contactForm.reset();
    });
  }

  /* ---------- 9. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- 10. FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
