/* LOGOVO — интерактив лендинга */
(function () {
  'use strict';

  document.documentElement.classList.add('js-ready');

  const D = window.LOGOVO;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ——— Хедер и мобильное меню ——— */
  const header = $('#header');
  const burger = $('#burger');
  const mobileMenu = $('#mobileMenu');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
    const float = $('#floatCta');
    if (float) float.classList.toggle('is-visible', window.scrollY > 640);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('#mobileMenu a').forEach((a) =>
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('active');
        document.body.style.overflow = '';
      })
    );
  }

  /* ——— Табы прайса ——— */
  $$('#priceTabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tab;
      $$('#priceTabs .tab').forEach((t) => t.classList.toggle('active', t === tab));
      $$('.price-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === id));
    });
  });

  /* ——— Мастера ——— */
  const grid = $('#mastersGrid');
  const levelLabel = { expert: 'Эксперт', top: 'Топ', barber: 'Барбер' };

  function renderMasters() {
    if (!grid) return;
    grid.innerHTML = D.masters
      .map((m, i) => {
        const lvl = m.level === 'expert' ? 'master__level--expert' : '';
        return `
      <article class="master reveal" data-salon="${m.salonId}" data-idx="${i}">
        <div class="master__photo">
          <img src="${m.photo}" alt="${m.name} — ${m.role}" loading="lazy">
          <span class="master__level ${lvl}">${levelLabel[m.level] || ''}</span>
        </div>
        <div class="master__body">
          <div class="master__role">${m.role} · ${m.salon}</div>
          <h3 class="master__name">${m.name}</h3>
          <p class="master__bio">${m.bio}</p>
          <p class="master__about">${m.about}</p>
          <div class="master__actions">
            <a class="btn btn--red" href="${m.book}" target="_blank" rel="noopener">Записаться</a>
            <button class="btn btn--ghost js-about">О мастере</button>
          </div>
        </div>
      </article>`;
      })
      .join('');

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-about');
      if (!btn) return;
      const card = btn.closest('.master');
      const wasOpen = card.classList.contains('is-open');
      // закрываем все открытые карточки — открывается только нажатая
      grid.querySelectorAll('.master.is-open').forEach((c) => {
        c.classList.remove('is-open');
        const b = c.querySelector('.js-about');
        if (b) b.textContent = 'О мастере';
      });
      if (!wasOpen) {
        card.classList.add('is-open');
        btn.textContent = 'Скрыть';
      }
    });
  }
  renderMasters();

  $$('#mastersFilter .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.salon;
      $$('#mastersFilter .tab').forEach((t) => t.classList.toggle('active', t === tab));
      $$('.master').forEach((card) => {
        const show = id === 'all' || card.dataset.salon === id;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ——— Галерея + лайтбокс ——— */
  const galleryGrid = $('#galleryGrid');
  if (galleryGrid) {
    galleryGrid.innerHTML = D.gallery
      .map(
        (src, i) => `
      <figure class="gallery-item reveal" data-src="${src}">
        <img src="${src}" alt="Работа и атмосфера LOGOVO ${i + 1}" loading="lazy">
      </figure>`
      )
      .join('');

    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');
    galleryGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      lightboxImg.src = item.dataset.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    const closeLb = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    $$('[data-close-lightbox]').forEach((b) => b.addEventListener('click', closeLb));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLb();
    });
  }

  /* ——— Отзывы ——— */
  const reviewsGrid = $('#reviewsGrid');
  if (reviewsGrid) {
    reviewsGrid.innerHTML = D.reviews
      .map(
        (r) => `
      <article class="review reveal">
        <div class="review__stars">★★★★★</div>
        <p class="review__text">${r.text}</p>
        <div class="review__foot">
          <span class="review__author">${r.author}</span>
          <span class="review__date">${r.date}</span>
        </div>
      </article>`
      )
      .join('');
  }

  /* ——— Появление секций при скролле ——— */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  $$('.reveal').forEach((el) => io.observe(el));

  const mo = new MutationObserver(() => $$('.reveal:not(.is-in)').forEach((el) => io.observe(el)));
  mo.observe(document.body, { childList: true, subtree: true });

  // страховка: при скролле/загрузке показывать всё, что уже в кадре
  // (защищает от пропусков анимации при прыжке по странице и загрузке картинок)
  const sweep = () =>
    $$('.reveal:not(.is-in)').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 16) el.classList.add('is-in');
    });
  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('resize', sweep);
  window.addEventListener('load', sweep, true); // и события загрузки ленивых картинок
  let sweeps = 0;
  const sweepTimer = setInterval(() => {
    sweep();
    if (++sweeps > 16) clearInterval(sweepTimer);
  }, 500);
})();

