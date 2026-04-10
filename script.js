/**
 * Tu Mejor Defensa - Interactive JavaScript
 * Handles navigation, tabs, animations, and form functionality
 */

// ========================================
// DOM Elements
// ========================================
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const contactForm = document.getElementById('contact-form');

// ========================================
// Navigation Scroll Effect
// ========================================
function handleScroll() {
  const scrollPosition = window.scrollY;

  if (scrollPosition > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Throttle scroll events for better performance
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});

// ========================================
// Mobile Menu Toggle
// ========================================
function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('active') &&
    !mobileMenu.contains(e.target) &&
    e.target !== mobileMenuBtn &&
    !mobileMenuBtn.contains(e.target)) {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
    toggleMobileMenu();
  }
});

// ========================================
// Tab Functionality
// ========================================
function switchTab(tabId) {
  // Hide all tab panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  // Show selected panel
  const selectedPanel = document.getElementById(`${tabId}-content`);
  if (selectedPanel) {
    selectedPanel.classList.remove('hidden');
  }

  // Update button styles
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('tab-active');
    btn.classList.add('text-slate-400');
  });

  // Activate selected button
  const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeBtn) {
    activeBtn.classList.add('tab-active');
    activeBtn.classList.remove('text-slate-400');
  }
}

// Make switchTab available globally for onclick handlers
window.switchTab = switchTab;

// ========================================
// Chart.js Configuration
// ========================================
let chartInstance = null;

function initChart() {
  const chartCanvas = document.getElementById('successChart');

  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext('2d');

  // Gradient for bars
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#4D0085');
  gradient.addColorStop(1, '#2A004A');

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Penal', 'Familiar', 'Civil', 'Corp.'],
      datasets: [{
        label: 'Éxito (%)',
        data: [0, 0, 0, 0], // Start at zero for animation
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
      animation: false, // Disable built-in animation, we'll animate manually
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(77, 0, 133, 0.9)',
          titleFont: {
            family: 'Public Sans',
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: 'Public Sans',
            size: 13
          },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              return `Éxito: ${context.raw}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: 'Public Sans',
              weight: 'bold',
              size: 12
            },
            color: '#64748B',
            callback: function (value) {
              return value + '%';
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: 'Public Sans',
              weight: 'bold',
              size: 12
            },
            color: '#64748B'
          }
        }
      }
    }
  });
}

// ========================================
// Intersection Observer for Animations
// ========================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections for animation
  document.querySelectorAll('section > div').forEach(section => {
    section.classList.add('opacity-0');
    observer.observe(section);
  });
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// Contact Form Handler
// ========================================
function handleFormSubmit(e) {
  e.preventDefault();

  // Get form values
  const nombre = document.getElementById('form-nombre').value.trim();
  const telefono = document.getElementById('form-telefono').value.trim();
  const asunto = document.getElementById('form-asunto').value;
  const mensaje = document.getElementById('form-mensaje').value.trim();

  // Validate form
  if (!nombre || !telefono || !asunto || !mensaje) {
    showNotification('Por favor completa todos los campos requeridos.', 'error');
    return;
  }

  // WhatsApp number
  const whatsappNumber = '525580046535';

  // Build message with structure
  const whatsappMessage = `*Nuevo Mensaje desde el Sitio Web*%0A%0A` +
    `*Nombre:* ${nombre}%0A` +
    `*Teléfono de Contacto:* ${telefono}%0A` +
    `*Asunto:* ${asunto}%0A` +
    `*Mensaje:* ${mensaje}`;

  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Update button state
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  submitBtn.textContent = 'Redirigiendo a WhatsApp...';
  submitBtn.disabled = true;

  // Redirect to WhatsApp after short delay
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');

    // Reset form and button
    contactForm.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    showNotification('Te estamos conectando con WhatsApp...', 'success');
  }, 800);
}

// ========================================
// Notification System
// ========================================
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification fixed bottom-24 right-8 z-[70] px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-y-20 opacity-0`;

  // Set styles based on type
  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-primary text-white'
  };

  notification.classList.add(...styles[type].split(' '));
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.classList.remove('translate-y-20', 'opacity-0');
  });

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.classList.add('translate-y-20', 'opacity-0');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ========================================
// Active Section Highlight
// ========================================
function initActiveSectionHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.glass-nav a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.remove('text-accent');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('text-accent');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => sectionObserver.observe(section));
}

// ========================================
// Parallax Effect for Hero
// ========================================
function initParallax() {
  const heroImage = document.querySelector('.hero-image');

  if (!heroImage) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroSection = document.getElementById('hero');

    if (scrolled < heroSection.offsetHeight) {
      heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });
}

// ========================================
// Counter Animation
// ========================================
function animateCounter(element, target, duration = 2000) {
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
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initChart();
  animateChartBars();
  initSmoothScroll();
  initActiveSectionHighlight();
  initCounterAnimations();

  // Form handler
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  // Initial scroll check
  handleScroll();

  // Log ready
  console.log('Tu Mejor Defensa - Website loaded successfully');

  // Initialize Hero Gradient Animation
  initHeroGradient();
});

// ========================================
// Utility Functions
// ========================================

// Debounce function for resize events
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
  // Re-initialize chart on significant resize
  if (window.innerWidth < 768) {
    // Mobile adjustments if needed
  }
}, 250));

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
      const duration = 1400;
      const startTime = performance.now();
      const startValue = 0;

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function updateBar(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = startValue + (target - startValue) * easedProgress;

        chartInstance.data.datasets[0].data[currentBar] = Math.round(currentValue * 10) / 10;
        chartInstance.update('none');

        if (progress < 1) {
          requestAnimationFrame(updateBar);
        } else {
          // Set exact final value
          chartInstance.data.datasets[0].data[currentBar] = target;
          chartInstance.update('none');
          currentBar++;
          if (currentBar < targetValues.length) {
            setTimeout(() => {
              animateNextBar();
            }, 400);
          }
        }
      }

      requestAnimationFrame(updateBar);
    }

    animateNextBar();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        animateBarsSequentially();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(resultsSection);
}

// ========================================
// Hero Gradient Background Animation
// ========================================
function initHeroGradient() {
  const blob1 = document.querySelector('.blob-1');
  if (!blob1) return;

  const heroSection = document.getElementById('hero');

  let targetX = 0, targetY = 0;
  let blob1CurX = 0, blob1CurY = 0;
  let animationFrame = null;

  function animate() {
    // Center blob - slow subtle follow via CSS variables
    blob1CurX = blob1CurX + (targetX - blob1CurX) / 40;
    blob1CurY = blob1CurY + (targetY - blob1CurY) / 40;
    blob1.style.setProperty('--mx', `${blob1CurX}px`);
    blob1.style.setProperty('--my', `${blob1CurY}px`);
    animationFrame = requestAnimationFrame(animate);
  }

  animationFrame = requestAnimationFrame(animate);

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    targetX = e.clientX - rect.left - rect.width / 2;
    targetY = e.clientY - rect.top - rect.height / 2;
  });

  heroSection.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
  heroSection.addEventListener('mouseenter', (e) => {
    const rect = heroSection.getBoundingClientRect();
    targetX = e.clientX - rect.left - rect.width / 2;
    targetY = e.clientY - rect.top - rect.height / 2;
  });

  window.addEventListener('beforeunload', () => {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
  });
}
