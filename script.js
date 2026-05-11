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
const blFilters = document.querySelectorAll('.bl-filter');
const blCards = document.querySelectorAll('.bl-card[data-cat]');
const blEmpty = document.getElementById('blEmpty');

blFilters.forEach((btn) => {
  btn.addEventListener('click', () => {
    blFilters.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.filter;
    let visible = 0;

    blCards.forEach((card) => {
      const match = cat === 'todos' || card.dataset.cat === cat;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (blEmpty) blEmpty.style.display = visible === 0 ? 'block' : 'none';
  });
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