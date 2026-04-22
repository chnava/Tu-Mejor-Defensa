/**
 * Tu Mejor Defensa - Premium Experience
 * Fast, Fluid & Professional
 */

// ========================================
// DOM Elements (Initialized on DOMContentLoaded)
// ========================================
let navbar, mobileMenuBtn, mobileMenu, mobileLinks, contactForm;
let splashScreen, splashLogo, splashText, progressBar;

// ========================================
// SPLASH SCREEN - Premium Entry (Fast & Fluid)
// ========================================
function initSplashScreen() {
  splashScreen = document.getElementById('splash-screen');
  splashLogo = document.getElementById('splash-logo-container');
  splashText = document.getElementById('splash-text');
  progressBar = document.getElementById('progress-bar');

  if (!splashScreen) return;

  // Responsive values
  const isMobile = window.innerWidth <= 768;
  const targetLetterSpacing = isMobile ? "0.4em" : "0.8em";
  const startLetterSpacing = isMobile ? "0.8em" : "1.8em";

  // Use GSAP for buttery smooth animation
  const tl = gsap.timeline({
    onComplete: () => {
      if (splashScreen) {
        splashScreen.style.display = 'none';
      }
    }
  });

  // 1. Logo Reveal & Subtle Pulsing
  tl.to(splashLogo, {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    duration: 1.2,
    ease: "power2.out"
  }, 0.2);
  
  // Continuous subtle scale while loading
  tl.to(splashLogo, {
    scale: 1.05,
    duration: 3,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  }, 1.4);

  // 2. Text Reveal
  tl.fromTo(splashText, 
    { opacity: 0, letterSpacing: startLetterSpacing, y: 20 },
    { opacity: 1, letterSpacing: targetLetterSpacing, y: 0, duration: 1.5, ease: "power2.out" },
    0.6
  );

  // 3. Progress Bar
  tl.to(progressBar, {
    width: "100%",
    duration: 2.8,
    ease: "power1.inOut"
  }, 0);

  // 4. Premium Exit
  tl.to(splashScreen, {
    opacity: 0,
    y: -50, // Subtle lift on exit
    duration: 0.8,
    ease: "power2.inOut"
  }, "+=0.2");
}

// ========================================
// Navigation Scroll Effect
// ========================================
function handleScroll() {
  if (!navbar) return;
  
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// ========================================
// Mobile Menu Toggle
// ========================================
function toggleMobileMenu() {
  if (!mobileMenu || !mobileMenuBtn) return;
  
  const isActive = mobileMenu.classList.toggle('active');
  mobileMenuBtn.classList.toggle('active');
  
  document.body.style.overflow = isActive ? 'hidden' : '';
}

function initMobileMenu() {
  if (!mobileMenuBtn) return;
  
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (mobileMenu?.classList.contains('active') &&
      !mobileMenu.contains(e.target) &&
      e.target !== mobileMenuBtn &&
      !mobileMenuBtn.contains(e.target)) {
      mobileMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
}

// ========================================
// Tab Functionality
// ========================================
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  const selectedPanel = document.getElementById(`${tabId}-content`);
  if (selectedPanel) {
    selectedPanel.classList.remove('hidden');
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('tab-active');
    btn.classList.add('text-slate-400');
  });

  const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeBtn) {
    activeBtn.classList.add('tab-active');
    activeBtn.classList.remove('text-slate-400');
  }
}

window.switchTab = switchTab;

// ========================================
// Chart.js Configuration
// ========================================
let chartInstance = null;

function initChart() {
  const chartCanvas = document.getElementById('successChart');
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#4D0085');
  gradient.addColorStop(1, '#2A004A');

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Penal', 'Familiar', 'Civil', 'Corp.'],
      datasets: [{
        label: 'Éxito (%)',
        data: [0, 0, 0, 0],
        backgroundColor: gradient,
        borderRadius: 12,
        borderSkipped: false,
        barThickness: 48,
        maxBarThickness: 64
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(77, 0, 133, 0.9)',
          titleFont: { family: 'Public Sans', size: 14, weight: 'bold' },
          bodyFont: { family: 'Public Sans', size: 13 },
          padding: 12,
          cornerRadius: 8,
          callbacks: { label: (ctx) => `Éxito: ${ctx.raw}%` }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { display: false },
          ticks: {
            font: { family: 'Public Sans', weight: 'bold', size: 12 },
            color: '#64748B',
            callback: (val) => val + '%'
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { family: 'Public Sans', weight: 'bold', size: 12 },
            color: '#64748B'
          }
        }
      }
    }
  });
}

// ========================================
// Chart Bar Animation on Scroll
// ========================================
function animateChartBars() {
  const resultsSection = document.getElementById('results');
  if (!resultsSection || !chartInstance) return;

  const targetValues = [96, 92, 89, 95];
  let hasAnimated = false;

  function animateBarsSequentially() {
    if (hasAnimated) return;
    hasAnimated = true;

    let currentBar = 0;

    function animateNextBar() {
      if (currentBar >= targetValues.length) return;

      const target = targetValues[currentBar];
      const duration = 1200;
      const startTime = performance.now();

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function updateBar(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = target * easedProgress;

        chartInstance.data.datasets[0].data[currentBar] = Math.round(currentValue * 10) / 10;
        chartInstance.update('none');

        if (progress < 1) {
          requestAnimationFrame(updateBar);
        } else {
          chartInstance.data.datasets[0].data[currentBar] = target;
          chartInstance.update('none');
          currentBar++;
          if (currentBar < targetValues.length) {
            setTimeout(animateNextBar, 300);
          }
        }
      }
      requestAnimationFrame(updateBar);
    }
    animateNextBar();
  }

  ScrollTrigger.create({
    trigger: resultsSection,
    start: "top 70%",
    onEnter: animateBarsSequentially
  });
}

// ========================================
// Smooth Scroll (Lenis)
// ========================================
function initSmoothScroll() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.1,
    touchMultiplier: 1.5,
    lerp: 0.1 // Added for extra buttery feel
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ========================================
// Active Section Highlight
// ========================================
function initActiveSectionHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.glass-nav a[href^="#"]');

  if (sections.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.3,
    rootMargin: '-20% 0px -60% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('text-accent');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('text-accent');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// ========================================
// Counter Animation
// ========================================
function animateCounter(element, target, duration = 1500) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;

    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      if (target >= 1000) {
        element.textContent = Math.floor(current).toLocaleString();
      } else if (target % 1 !== 0) {
        element.textContent = current.toFixed(1);
      } else {
        element.textContent = Math.floor(current);
      }
    }
  }, 16);
}

function initCounterAnimations() {
  const metricsSection = document.querySelector('[data-purpose="metrics-bar"]');
  if (!metricsSection) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('p.text-3xl');
        counters.forEach(counter => {
          const text = counter.textContent;
          const number = parseFloat(text.replace(/[^0-9.]/g, ''));
          if (!isNaN(number)) {
            animateCounter(counter, number);
          }
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterObserver.observe(metricsSection);
}

// ========================================
// HERO Effects Manager (Consolidated for performance)
// ========================================
function initHeroEffects() {
  const heroSection = document.getElementById('hero');
  const heroImageWrapper = document.querySelector('.hero-image-wrapper');
  const blob1 = document.querySelector('.blob-1');

  if (!heroSection) return;

  let isHeroVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isHeroVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(heroSection);

  // Parallax state
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  // Gradient state
  let targetGX = 0, targetGY = 0;
  let blobX = 0, blobY = 0;

  heroSection.addEventListener('mousemove', (e) => {
    if (!isHeroVisible) return;
    const rect = heroSection.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    
    mouseX = (relX - 0.5) * 40; // Increased range
    mouseY = (relY - 0.5) * 40;
    
    targetGX = (e.clientX - rect.left - rect.width / 2) * 0.8; // Faster following
    targetGY = (e.clientY - rect.top - rect.height / 2) * 0.8;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouseX = 0; mouseY = 0;
    targetGX = 0; targetGY = 0;
  });

  function update() {
    if (isHeroVisible) {
      // Update Parallax
      if (heroImageWrapper) {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;
        heroImageWrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      // Update Gradient (Smoother interpolation)
      if (blob1) {
        blobX += (targetGX - blobX) * 0.1;
        blobY += (targetGY - blobY) * 0.1;
        blob1.style.setProperty('--mx', `${blobX}px`);
        blob1.style.setProperty('--my', `${blobY}px`);
      }
    }
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ========================================
// Form Handler
// ========================================
function handleFormSubmit(e) {
  e.preventDefault();

  const nombre = document.getElementById('form-nombre')?.value.trim();
  const telefono = document.getElementById('form-telefono')?.value.trim();
  const asunto = document.getElementById('form-asunto')?.value;
  const mensaje = document.getElementById('form-mensaje')?.value.trim();

  if (!nombre || !telefono || !asunto || !mensaje) {
    alert('Por favor completa todos los campos');
    return;
  }

  const whatsappNumber = '525580046535';
  const whatsappMessage = `*Nuevo Mensaje desde el Sitio Web*%0A%0A*Nombre:* ${nombre}%0A*Teléfono:* ${telefono}%0A*Asunto:* ${asunto}%0A*Mensaje:* ${mensaje}`;

  window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');

  // Reset form
  e.target.reset();
}

// ========================================
// Initialize Everything (DOM Ready)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM elements
  navbar = document.getElementById('navbar');
  mobileMenuBtn = document.getElementById('mobile-menu-btn');
  mobileMenu = document.getElementById('mobile-menu');
  mobileLinks = document.querySelectorAll('.mobile-link');
  contactForm = document.getElementById('contact-form');

  // 1. Splash Screen (IMMEDIATE - highest priority)
  initSplashScreen();

  // 2. Core functionality
  initMobileMenu();
  initChart();
  
  // 3. Animations & Effects
  animateChartBars();
  initSmoothScroll();
  initActiveSectionHighlight();
  initCounterAnimations();
  initHeroEffects();

  // 4. Event listeners
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  console.log('✨ Tu Mejor Defensa - Premium Experience Ready');
});

// ========================================
// Utility: Debounce
// ========================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.addEventListener('resize', debounce(() => {
  // Handle resize if needed
}, 250));
