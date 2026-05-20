// --- SECURITY HELPERS ---
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHtml(html) {
  const allowed = ['p','br','strong','em','b','i','ul','ol','li','h2','h3','h4','blockquote','a','img','figure','figcaption','hr','span','div'];
  const root = document.createElement('div');
  root.innerHTML = html;
  root.querySelectorAll('*').forEach(el => {
    if (!allowed.includes(el.tagName.toLowerCase())) {
      el.replaceWith(...el.childNodes);
      return;
    }
    [...el.attributes].forEach(attr => {
      if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
    });
    if (el.tagName === 'A') {
      const href = el.getAttribute('href') || '';
      if (/^javascript:/i.test(href)) el.removeAttribute('href');
      el.setAttribute('rel', 'noopener noreferrer');
      el.setAttribute('target', '_blank');
    }
    if (el.tagName === 'IMG') {
      const src = el.getAttribute('src') || '';
      if (/^javascript:/i.test(src)) el.removeAttribute('src');
    }
  });
  return root.innerHTML;
}

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

  const consent = document.getElementById('fConsent')?.checked;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!nome || !empresa || !email) {
    alert('Por favor, preencha Nome, Empresa e E-mail.');
    return;
  }
  if (!emailRegex.test(email)) {
    alert('Por favor, insira um e-mail válido.');
    return;
  }
  if (!consent) {
    alert('Por favor, aceite a Política de Privacidade para continuar.');
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

document.querySelector('.sc-arrow--prev')?.addEventListener('click', () => changeService(-1));
document.querySelector('.sc-arrow--next')?.addEventListener('click', () => changeService(1));
document.querySelectorAll('.sc-dot[data-index]').forEach(dot => {
  dot.addEventListener('click', () => goToService(parseInt(dot.dataset.index, 10)));
});
document.querySelectorAll('a[data-service]').forEach(link => {
  link.addEventListener('click', () => goToService(parseInt(link.dataset.service, 10)));
});

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

function normalizarUrlImagem(url) {
  if (!url) return '';
  return url
    .replace(/https?:\/\/dev\.ibnegocios\.com\.br\/blog\//g, 'https://ibnegocios.com.br/cms_Dev/')
    .replace(/https?:\/\/ibnegocios\.com\.br\/cmsDev\//g, 'https://ibnegocios.com.br/cms_Dev/');
}

function abrirArtigo(id) {
  const post = _blogPosts.find(p => p.id === id);
  if (!post) return;

  const terms = post._embedded?.['wp:term']?.[0] || [];
  const mainCat = terms.find(t => t.taxonomy === 'category' && t.name.toLowerCase() !== 'sem categoria');
  const rawImgSrc = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const imgSrc = normalizarUrlImagem(rawImgSrc);
  const dataFormatada = new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  document.getElementById('artModalTitle').textContent = post.title.rendered;
  document.getElementById('artModalBody').innerHTML = sanitizeHtml(post.content.rendered);
  document.getElementById('artModalCat').textContent = mainCat?.name || '';
  document.getElementById('artModalMeta').textContent = dataFormatada;
  const imgEl = document.getElementById('artModalImg');
  imgEl.innerHTML = '';
  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = post.title.rendered;
    imgEl.appendChild(img);
  }

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
      'https://ibnegocios.com.br/cms_Dev/wp-json/wp/v2/posts?_embed&per_page=50'
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
      filtersEl.innerHTML = '';
      const btnTodos = document.createElement('button');
      btnTodos.className = 'bl-filter active';
      btnTodos.dataset.filter = 'todos';
      btnTodos.textContent = 'Todos';
      filtersEl.appendChild(btnTodos);
      categorias.forEach((name, slug) => {
        const btn = document.createElement('button');
        btn.className = 'bl-filter';
        btn.dataset.filter = escapeHtml(slug);
        btn.textContent = name;
        filtersEl.appendChild(btn);
      });
    }

    grid.innerHTML = '';

    posts.forEach((post, index) => {
      const rawImgSrc = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
      const imgSrc = normalizarUrlImagem(rawImgSrc);
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
      card.setAttribute('role', 'button');
      if (catSlug) card.dataset.cat = catSlug;
      card.addEventListener('click', (e) => { e.preventDefault(); abrirArtigo(post.id); });

      const imgDiv = document.createElement('div');
      imgDiv.className = 'bl-card-img';
      if (imgSrc) {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = titulo;
        img.loading = 'lazy';
        img.decoding = 'async';
        imgDiv.appendChild(img);
      }

      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'bl-card-body';
      if (catName) {
        const catEl = document.createElement('span');
        catEl.className = 'bl-card-cat';
        catEl.textContent = catName;
        bodyDiv.appendChild(catEl);
      }
      const metaEl = document.createElement('div');
      metaEl.className = 'bl-card-meta';
      metaEl.textContent = dataFormatada;
      const h3 = document.createElement('h3');
      h3.textContent = titulo;
      const p = document.createElement('p');
      p.textContent = resumo;
      const readEl = document.createElement('span');
      readEl.className = 'bl-card-read';
      readEl.textContent = 'Ler artigo →';
      bodyDiv.append(metaEl, h3, p, readEl);

      card.append(imgDiv, bodyDiv);
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
      'https://ibnegocios.com.br/cms_Dev/wp-json/wp/v2/posts?_embed'
    );

    const posts = await resposta.json();

    container.innerHTML = '';

    posts.slice(0, 3).forEach((post, index) => {

      const rawImagem = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
      const imagem = normalizarUrlImagem(rawImagem);

      const titulo = post.title.rendered;

      const resumo = post.excerpt.rendered
        .replace(/<[^>]+>/g, '')
        .substring(0, 120) + '...';

      const link = post.link;

      const delayClass =
        index === 1 ? 'reveal-d1' :
        index === 2 ? 'reveal-d2' :
        '';

      const card = document.createElement('a');
      card.className = `bcard ${delayClass}`.trim();
      card.href = link;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';

      const imgDiv = document.createElement('div');
      imgDiv.className = 'bcard-img';
      if (imagem) {
        const img = document.createElement('img');
        img.src = imagem;
        img.alt = titulo;
        img.loading = 'lazy';
        img.decoding = 'async';
        imgDiv.appendChild(img);
      }

      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'bcard-body';
      const h3 = document.createElement('h3');
      h3.textContent = titulo;
      const p = document.createElement('p');
      p.textContent = resumo;
      const read = document.createElement('span');
      read.className = 'bcard-read';
      read.textContent = 'Ler artigo →';
      bodyDiv.append(h3, p, read);

      card.append(imgDiv, bodyDiv);
      container.appendChild(card);

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

document.querySelectorAll('.legal-tab-btn[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab, btn));
});

// ─── INLINE HANDLER REPLACEMENTS ─────────────────────────────
document.querySelector('.wpp-bubble-close')?.addEventListener('click', function() {
  document.getElementById('wppChatBubble').style.display = 'none';
});
document.querySelector('.whatsapp-fab')?.addEventListener('click', function() {
  window.open('https://wa.me/551936450337', '_blank', 'noopener,noreferrer');
});

// ─── COOKIE CONSENT BANNER ───────────────────────────────────
(function initCookieBanner() {
  if (localStorage.getItem('ibn-cookie-consent')) return;

  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML =
    '<p>Utilizamos cookies para garantir a melhor experiência no site. Ao continuar navegando, você concorda com nossa ' +
    '<a href="privacidade-e-termos.html">Política de Privacidade</a>.</p>' +
    '<div class="cookie-actions">' +
    '<button id="cookieAccept">Aceitar</button>' +
    '<button id="cookieDecline">Recusar</button>' +
    '</div>';
  document.body.appendChild(banner);

  function dismiss(choice) {
    localStorage.setItem('ibn-cookie-consent', choice);
    banner.style.transition = 'transform .3s ease, opacity .3s ease';
    banner.style.transform = 'translateY(100%)';
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 320);
  }

  document.getElementById('cookieAccept').addEventListener('click', function() { dismiss('accepted'); });
  document.getElementById('cookieDecline').addEventListener('click', function() { dismiss('declined'); });
})();

carregarPosts();