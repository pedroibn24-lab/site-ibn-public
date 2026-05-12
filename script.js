// --- DOM ELEMENTS ---
const nav = document.getElementById('mainNav');
const hamburger = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const contactForm = document.getElementById('contactForm');
const successMsg = document.getElementById('successMsg');

// --- MENU HANDLERS ---
function toggleMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
}

// --- SCROLL NAVIGATION ---
function activateMenuLink() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-links a');
  let current = '';

  sections.forEach((section) => {
    const top = section.offsetTop - 140;
    if (window.scrollY >= top) current = section.id;
  });

  links.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// --- PARALLAX ---
const _parallaxEls = () => document.querySelectorAll('.hero-bg-photo img, .section-bg-photo img, .photo-strip-img');
let _parallaxTick = false;

function updateParallax() {
  if (_parallaxTick) return;
  _parallaxTick = true;
  requestAnimationFrame(() => {
    const vh = window.innerHeight;
    _parallaxEls().forEach((img) => {
      const section = img.parentElement?.closest('section') || img.parentElement;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      img.style.transform = `translateY(${(progress - 0.5) * 80}px) scale(1.18)`;
    });
    _parallaxTick = false;
  });
}

function handleScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 18);
  activateMenuLink();
  updateParallax();
}

// --- WHATSAPP CONTACT FORM ---
function submitToWhatsApp(event) {
  event.preventDefault();

  const nome = document.getElementById('fNome').value.trim();
  const empresa = document.getElementById('fEmpresa').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const telefone = document.getElementById('fTelefone').value.trim();
  const servico = document.getElementById('fServico').value.trim();
  const mensagem = document.getElementById('fMensagem').value.trim();

  if (!nome || !empresa || !email) {
    alert('Por favor, preencha Nome, Empresa e E-mail.');
    return;
  }

  const texto = [
    'Olá, equipe IBN! Gostaria de solicitar uma proposta.',
    '',
    `Nome: ${nome}`,
    `Empresa: ${empresa}`,
    `E-mail: ${email}`,
    telefone ? `Telefone: ${telefone}` : '',
    servico ? `Serviço de interesse: ${servico}` : '',
    mensagem ? `Mensagem: ${mensagem}` : ''
  ].filter(Boolean).join('\n');

  successMsg?.classList.add('show');
  window.open(`https://wa.me/551936450337?text=${encodeURIComponent(texto)}`, '_blank');
  contactForm?.reset();

  setTimeout(() => successMsg?.classList.remove('show'), 4500);
}

// --- SCROLL REVEAL ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -120px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// --- SERVICES CAROUSEL ---
let _carouselTimer = null;

function _startCarousel() {
  _carouselTimer = setInterval(() => changeService(1), 6000);
}

function _stopCarousel() {
  clearInterval(_carouselTimer);
}

function changeService(direction) {
  const slides = document.querySelectorAll('.sc-slide');
  const dots = document.querySelectorAll('.sc-dot');
  const currentIndex = Array.from(slides).findIndex((slide) => slide.classList.contains('active'));

  if (currentIndex === -1) return;

  slides[currentIndex].classList.remove('active');
  dots[currentIndex].classList.remove('active');

  const nextIndex = (currentIndex + direction + slides.length) % slides.length;
  slides[nextIndex].classList.add('active');
  dots[nextIndex].classList.add('active');
}

function goToService(index) {
  const slides = document.querySelectorAll('.sc-slide');
  const dots = document.querySelectorAll('.sc-dot');

  slides.forEach((slide) => slide.classList.remove('active'));
  dots.forEach((dot) => dot.classList.remove('active'));

  if (slides[index]) slides[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
}

// --- INITIALIZATION ---
hamburger?.addEventListener('click', toggleMenu);
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', handleScroll, { passive: true });
contactForm?.addEventListener('submit', submitToWhatsApp);

_startCarousel();

const _scWrapper = document.querySelector('.sc-wrapper');
if (_scWrapper) {
  _scWrapper.addEventListener('mouseenter', _stopCarousel);
  _scWrapper.addEventListener('mouseleave', _startCarousel);
}

handleScroll();
updateParallax();

window.addEventListener('resize', updateParallax, { passive: true });

window.addEventListener('load', () => {
  document.querySelectorAll('.hv-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.15}s`;
  });

  const serviceParam = new URLSearchParams(window.location.search).get('service');
  if (serviceParam !== null) goToService(parseInt(serviceParam, 10));
});

// --- BLOG: FILTRO DE CATEGORIAS ---
document.querySelector('.bl-filters')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.bl-filter');
  if (!btn) return;

  document.querySelectorAll('.bl-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const cat = btn.dataset.filter;
  let visible = 0;

  document.querySelectorAll('#blGrid .bl-card[data-cat]').forEach(card => {
    const match = cat === 'todos' || card.dataset.cat === cat;
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });

  const blEmpty = document.getElementById('blEmpty');
  if (blEmpty) blEmpty.style.display = visible === 0 ? 'block' : 'none';
});

// --- TREINAMENTOS: TABS DOS FORMATOS ---
document.querySelectorAll('.tp-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tp-tab').forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.tp-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const panel = document.getElementById('tp-' + btn.dataset.tab);
    if (panel) {
      panel.classList.add('active');
      panel.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    }
  });
});

let _blogPosts = [];

function abrirArtigo(id) {
  const post = _blogPosts.find(p => p.id === id);
  if (!post) return;

  const terms = post._embedded?.['wp:term']?.[0] || [];
  const mainCat = terms.find(t => t.taxonomy === 'category' && t.name.toLowerCase() !== 'sem categoria');
  const imgSrc = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const dataFormatada = new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  document.getElementById('artModalTitle').innerHTML = post.title.rendered;
  document.getElementById('artModalBody').innerHTML = post.content.rendered;
  document.getElementById('artModalCat').textContent = mainCat?.name || '';
  document.getElementById('artModalMeta').textContent = dataFormatada;
  document.getElementById('artModalImg').innerHTML = imgSrc
    ? `<img src="${imgSrc}" alt="${post.title.rendered}">`
    : '';

  const modal = document.getElementById('artModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.scrollTop = 0;
}

function fecharArtigo() {
  document.getElementById('artModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('artModalClose')?.addEventListener('click', fecharArtigo);
document.getElementById('artModalOverlay')?.addEventListener('click', fecharArtigo);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharArtigo(); });

async function carregarBlogPosts() {
  const grid = document.getElementById('blGrid');
  if (!grid) return;

  const filtersEl = document.querySelector('.bl-filters');
  const blEmpty = document.getElementById('blEmpty');

  grid.innerHTML = '<div style="text-align:center;padding:3rem;color:#888">Carregando artigos...</div>';

  try {
    const resposta = await fetch(
      'https://dev.ibnegocios.com.br/blog/wp-json/wp/v2/posts?_embed&per_page=50'
    );
    const posts = await resposta.json();
    _blogPosts = posts;

    const categorias = new Map();
    posts.forEach(post => {
      const terms = post._embedded?.['wp:term']?.[0] || [];
      terms.forEach(term => {
        if (term.taxonomy === 'category' && term.name.toLowerCase() !== 'sem categoria') {
          categorias.set(term.slug, term.name);
        }
      });
    });

    if (filtersEl) {
      filtersEl.innerHTML = '<button class="bl-filter active" data-filter="todos">Todos</button>';
      categorias.forEach((name, slug) => {
        filtersEl.innerHTML += `<button class="bl-filter" data-filter="${slug}">${name}</button>`;
      });
    }

    grid.innerHTML = '';

    posts.forEach((post, index) => {
      const imagem = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
      const titulo = post.title.rendered;
      const resumo = post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 130) + '...';
      const link = post.link;
      const terms = post._embedded?.['wp:term']?.[0] || [];
      const mainCat = terms.find(t => t.taxonomy === 'category' && t.name.toLowerCase() !== 'sem categoria');
      const catSlug = mainCat?.slug || '';
      const catName = mainCat?.name || '';
      const delayClass = index % 3 === 1 ? 'reveal-d1' : index % 3 === 2 ? 'reveal-d2' : '';
      const dataFormatada = new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

      const card = document.createElement('a');
      card.className = `bl-card reveal reveal-zoom ${delayClass}`.trim();
      card.href = link;
      card.role = 'button';
      if (catSlug) card.dataset.cat = catSlug;
      card.addEventListener('click', (e) => { e.preventDefault(); abrirArtigo(post.id); });
      card.innerHTML = `
        <div class="bl-card-img">${imagem ? `<img src="${imagem}" alt="${titulo}" loading="lazy" decoding="async">` : ''}</div>
        <div class="bl-card-body">
          ${catName ? `<span class="bl-card-cat">${catName}</span>` : ''}
          <div class="bl-card-meta">${dataFormatada}</div>
          <h3>${titulo}</h3>
          <p>${resumo}</p>
          <span class="bl-card-read">Ler artigo →</span>
        </div>
      `;
      grid.appendChild(card);
      revealObserver.observe(card);
    });

    if (blEmpty) grid.appendChild(blEmpty);

  } catch (erro) {
    console.error('Erro ao carregar posts do blog:', erro);
    grid.innerHTML = '<p style="text-align:center;padding:3rem;color:#666">Não foi possível carregar os artigos. Tente novamente mais tarde.</p>';
  }
}

if (document.getElementById('blGrid')) carregarBlogPosts();

async function carregarPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;

  try {

    const resposta = await fetch(
      'https://dev.ibnegocios.com.br/blog/wp-json/wp/v2/posts?_embed'
    );

    const posts = await resposta.json();

    container.innerHTML = '';

    posts.slice(0, 3).forEach((post, index) => {

      const imagem =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        '';

      const titulo = post.title.rendered;

      const resumo = post.excerpt.rendered
        .replace(/<[^>]+>/g, '')
        .substring(0, 120) + '...';

      const link = post.link;

      const delayClass =
        index === 1 ? 'reveal-d1' :
        index === 2 ? 'reveal-d2' :
        '';

      const card = `
        <a class="bcard ${delayClass}"
           href="${link}"
           target="_blank">

          <div class="bcard-img">
            <img src="${imagem}" alt="${titulo}">
          </div>

          <div class="bcard-body">
            <h3>${titulo}</h3>
            <p>${resumo}</p>
            <span class="bcard-read">
              Ler artigo →
            </span>
          </div>

        </a>
      `;

      container.innerHTML += card;

    });

  } catch (erro) {
    console.error('Erro ao carregar posts:', erro);
  }
}

// ─── PRIVACIDADE & TERMOS ────────────────────────────────────
document.querySelectorAll('[id="footer-year"]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

function showTab(tab, btn) {
  document.querySelectorAll('.legal-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.legal-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  btn.classList.add('active');
}

carregarPosts();