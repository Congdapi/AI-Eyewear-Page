// ==================== Utility Functions ====================
const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ==================== Header & Navigation ====================
class Header {
    constructor() {
        this.header = document.querySelector('.header');
        this.menuToggle = document.querySelector('.header__menu-toggle');
        this.menu = document.querySelector('.header__menu');
        this.links = document.querySelectorAll('.header__link');
        this.ctaBtns = document.querySelectorAll('.header__cta-btn, .hero .btn--primary');
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.handleScroll();
    }
    
    attachEventListeners() {
        // Menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Navigation links
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                this.closeMenu();
            });
        });
        
        // Scroll event
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
        
        // CTA buttons
        this.ctaBtns.forEach(btn => {
            btn.addEventListener('click', () => this.scrollToCTA());
        });
    }
    
    toggleMenu() {
        this.menu.classList.toggle('active');
        this.menuToggle.classList.toggle('active');
        
        if (this.menu.classList.contains('active')) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }
    
    closeMenu() {
        this.menu.classList.remove('active');
        this.menuToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    handleScroll() {
        if (window.scrollY > 10) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
    
    scrollToCTA() {
        const ctaSection = document.querySelector('#cta');
        ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== Scroll Animation ====================
class ScrollAnimation {
    constructor() {
        this.elements = document.querySelectorAll('[class*="__title"], [class*="__card"], [class*="__item"]');
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.elements.forEach(el => this.observer.observe(el));
    }
    
    animateElement(element) {
        element.style.animation = 'fadeUp 0.6s ease-out forwards';
    }
}

// ==================== Accordion Component ====================
class Accordion {
    constructor() {
        this.headers = document.querySelectorAll('.accordion__header');
        this.init();
    }
    
    init() {
        this.headers.forEach(header => {
            header.addEventListener('click', (e) => this.toggle(e));
            header.addEventListener('keydown', (e) => this.handleKeydown(e));
        });
    }
    
    toggle(e) {
        const header = e.currentTarget;
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        const content = document.querySelector(`#${header.getAttribute('aria-controls')}`);
        
        // Close other accordions
        this.headers.forEach(h => {
            if (h !== header) {
                h.setAttribute('aria-expanded', 'false');
                const otherContent = document.querySelector(`#${h.getAttribute('aria-controls')}`);
                otherContent.classList.remove('open');
            }
        });
        
        // Toggle current
        header.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('open');
    }
    
    handleKeydown(e) {
        const { key } = e;
        
        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            this.toggle(e);
        }
    }
}

// ==================== CTA Form ====================
class CTAForm {
    constructor() {
        this.form = document.querySelector('#cta-form');
        this.input = this.form.querySelector('.cta__input');
        this.message = this.form.querySelector('.cta__message');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const email = this.input.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showMessage('유효한 이메일 주소를 입력해주세요.', 'error');
            return;
        }
        
        // Simulate API call
        this.form.style.opacity = '0.6';
        this.form.style.pointerEvents = 'none';
        
        setTimeout(() => {
            this.showMessage('출시 알림 신청이 완료되었습니다! 감사합니다.', 'success');
            this.input.value = '';
            this.form.style.opacity = '1';
            this.form.style.pointerEvents = 'auto';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                this.message.classList.remove('show');
            }, 5000);
        }, 1000);
    }
    
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    showMessage(text, type = 'success') {
        this.message.textContent = text;
        this.message.className = `cta__message show ${type}`;
    }
}

// ==================== Scenario Modal ====================
class ScenarioModal {
    constructor() {
        this.modal = document.querySelector('.scenario-modal');
        this.backdrop = this.modal?.querySelector('.scenario-modal__backdrop');
        this.closeBtn = this.modal?.querySelector('.scenario-modal__close');
        this.image = this.modal?.querySelector('.scenario-modal__image');
        this.title = this.modal?.querySelector('.scenario-modal__title');
        this.description = this.modal?.querySelector('.scenario-modal__description');
        this.cards = document.querySelectorAll('.scenario__card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => this.open(card));
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.open(card);
                }
            });
        });

        this.backdrop?.addEventListener('click', () => this.close());
        this.closeBtn?.addEventListener('click', () => this.close());
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    open(card) {
        if (!this.modal) return;

        this.image.src = card.dataset.image || '';
        this.image.alt = card.dataset.title || '상세 정보';
        this.title.textContent = card.dataset.title || '';
        this.description.textContent = card.dataset.description || '';

        this.modal.classList.add('open');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    close() {
        if (!this.modal) return;

        this.modal.classList.remove('open');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }
}

// ==================== Design Gallery ====================
class DesignGallery {
    constructor() {
        this.carousel = document.querySelector('.design__carousel');
        this.track = this.carousel?.querySelector('.design__track');
        this.slides = this.track ? Array.from(this.track.children) : [];
        this.prevBtn = this.carousel?.querySelector('.design__nav--prev');
        this.nextBtn = this.carousel?.querySelector('.design__nav--next');
        this.dotsContainer = document.querySelector('.design__dots');
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        if (!this.carousel || !this.track || this.slides.length === 0) return;

        this.createDots();
        this.updateCarousel();

        this.prevBtn?.addEventListener('click', () => {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.updateCarousel();
        });

        this.nextBtn?.addEventListener('click', () => {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.updateCarousel();
        });
    }

    createDots() {
        this.dots = [];
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'design__dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `${index + 1}번째 디자인 보기`);
            dot.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateCarousel();
            });
            this.dotsContainer?.appendChild(dot);
            this.dots.push(dot);
        });
    }

    updateCarousel() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// ==================== Lazy Loading ====================
class LazyLoader {
    constructor() {
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                observer.observe(img);
            });
        }
    }
    
    loadImage(img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    }
}

// ==================== Smooth Scroll ====================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ==================== Keyboard Navigation ====================
class KeyboardNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => {
            // Tab key navigation
            if (e.key === 'Tab') {
                this.updateFocusVisible();
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.style.outlineOffset = '-4px';
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.style.outlineOffset = 'auto';
            }
        });
    }
    
    updateFocusVisible() {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement !== document.body) {
            focusedElement.classList.add('focused');
        }
    }
}

// ==================== Performance - Preload Critical Resources ====================
class ResourcePreloader {
    constructor() {
        this.preloadCriticalResources();
    }
    
    preloadCriticalResources() {
        // Preload fonts
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.href = 'https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }
}

// ==================== Intersection Observer for Parallax ====================
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', throttle(() => {
                        this.updateParallax(entry.target);
                    }, 16));
                }
            });
        }, observerOptions);
        
        this.elements.forEach(el => observer.observe(el));
    }
    
    updateParallax(element) {
        const scrollPos = window.scrollY;
        const elementPos = element.offsetTop;
        const distance = scrollPos - elementPos;
        
        const speed = element.dataset.parallax || 0.5;
        element.style.transform = `translateY(${distance * speed}px)`;
    }
}

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Header();
    new ScrollAnimation();
    new Accordion();
    new CTAForm();
    new ScenarioModal();
    new DesignGallery();
    new LazyLoader();
    new SmoothScroll();
    new KeyboardNavigation();
    new ResourcePreloader();
    new ParallaxEffect();
    
    // Performance: Log page load time
    window.addEventListener('load', () => {
        if (window.performance) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page Load Time:', pageLoadTime + 'ms');
        }
    });
});

// ==================== Error Handling ====================
window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ==================== Service Worker Registration (Optional) ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('./sw.js').catch(err => {
        //     console.log('SW registration failed:', err);
        // });
    });
}

// ==================== Analytics (Placeholder) ====================
class Analytics {
    constructor() {
        this.init();
    }
    
    init() {
        // Track button clicks
        document.querySelectorAll('button, a').forEach(element => {
            element.addEventListener('click', () => {
                this.trackEvent('click', element);
            });
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submit', e.target);
        });
    }
    
    trackEvent(eventType, element) {
        const eventData = {
            type: eventType,
            element: element.tagName,
            text: element.textContent || element.value,
            timestamp: new Date().toISOString()
        };
        
        // Send to analytics service (replace with actual service)
        console.log('Analytics Event:', eventData);
    }
}

// Initialize analytics after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new Analytics();
});
