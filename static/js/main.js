/* ═══════════════════════════════════════════════════════════
   Academic Project Page — main.js
   PDF viewer, BibTeX copy, scroll animations.
   No edits needed unless you want to customize behavior.
   ═══════════════════════════════════════════════════════════ */

// ── PDF Viewer ──────────────────────────────────────────

function openPDF(url, title) {
  var overlay = document.getElementById('pdfOverlay');
  var frame   = document.getElementById('pdfFrame');

  document.getElementById('pdfTitle').textContent    = title || 'PDF';
  document.getElementById('pdfDownload').href         = url;
  document.getElementById('pdfNewTab').href           = url;
  frame.src = url;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add('show');
    });
  });
}

function closePDF() {
  var overlay = document.getElementById('pdfOverlay');
  overlay.classList.remove('show');
  document.body.style.overflow = '';

  setTimeout(function () {
    overlay.classList.remove('active');
    document.getElementById('pdfFrame').src = '';
  }, 250);
}

// Close on Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closePDF();
});

// Close on backdrop click
document.getElementById('pdfOverlay').addEventListener('click', function (e) {
  if (e.target === e.currentTarget) closePDF();
});


// ── Copy BibTeX ─────────────────────────────────────────

function copyBibtex() {
  var el  = document.getElementById('bibtex');
  var bib = el.innerText.replace('Copy', '').trim();

  navigator.clipboard.writeText(bib).then(function () {
    var btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
  });
}


// ── Scroll Fade-In ──────────────────────────────────────

var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach(function (el) {
  observer.observe(el);
});


// ── Video Carousel ─────────────────────────────────────

var carouselState = {};

function carouselGoTo(carousel, index) {
  var slides = carousel.querySelectorAll('.carousel-slide');
  var dots = carousel.querySelectorAll('.carousel-dot');
  if (slides.length === 0) return;

  slides.forEach(function (slide) {
    var video = slide.querySelector('video');
    if (video) video.pause();
    slide.classList.remove('active');
  });
  dots.forEach(function (dot) { dot.classList.remove('active'); });

  var id = carousel.id || 'default';
  carouselState[id] = ((index % slides.length) + slides.length) % slides.length;
  slides[carouselState[id]].classList.add('active');
  if (dots[carouselState[id]]) dots[carouselState[id]].classList.add('active');

  var activeVideo = slides[carouselState[id]].querySelector('video');
  if (activeVideo) activeVideo.play();
}

function getCarouselIndex(carousel) {
  var id = carousel.id || 'default';
  return carouselState[id] || 0;
}

// For the default (animation) carousel
function carouselNext() {
  var c = document.querySelector('.carousel:not([id])') || document.getElementById('animationCarousel');
  carouselGoTo(c, getCarouselIndex(c) + 1);
}
function carouselPrev() {
  var c = document.querySelector('.carousel:not([id])') || document.getElementById('animationCarousel');
  carouselGoTo(c, getCarouselIndex(c) - 1);
}

// For named carousels
function carouselNextById(id) {
  var c = document.getElementById(id);
  if (c) carouselGoTo(c, getCarouselIndex(c) + 1);
}
function carouselPrevById(id) {
  var c = document.getElementById(id);
  if (c) carouselGoTo(c, getCarouselIndex(c) - 1);
}

// Build dots for all carousels on load
(function () {
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dotsContainer = carousel.querySelector('.carousel-dots');
    if (!dotsContainer || slides.length === 0) return;

    var id = carousel.id || 'default';
    carouselState[id] = 0;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () { carouselGoTo(carousel, i); });
      dotsContainer.appendChild(dot);
    });
  });
})();
