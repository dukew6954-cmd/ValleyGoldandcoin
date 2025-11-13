// Smooth scrolling and interactive features for Valley Gold & Coin website

document.addEventListener('DOMContentLoaded', function() {
    // Disable browser scroll restoration so refresh starts at top
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    // If a hash is present (e.g., #event), remove it and reset scroll
    if (location.hash) {
        history.replaceState(null, '', location.pathname + location.search);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        // Ensure top after the first paint
        setTimeout(() => window.scrollTo(0, 0), 0);
    }
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const heroScroll = document.querySelector('.hero-scroll');
    
    // Add smooth scrolling to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hero scroll button
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            const eventSection = document.querySelector('#event');
            if (eventSection) {
                const offsetTop = eventSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background based on scroll position
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(10, 7, 4, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 7, 4, 0.95)';
        }
        
        // Hide/show navbar on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                if (entry.target.classList.contains('event-card')) {
                    entry.target.style.setProperty('--translate', 'translateY(0)');
                } else {
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.item-card, .step, .testimonial-card, .event-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        if (el.classList.contains('event-card')) {
            el.style.setProperty('--translate', 'translateY(30px)');
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        } else {
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        observer.observe(el);
    });

    // Active outline for event cards using viewport scroll
    const eventList = document.querySelector('.event-list');
    if (eventList) {
        const eventCards = Array.from(eventList.querySelectorAll('.event-card'));

        // Make first one active initially
        if (eventCards[0]) {
            eventCards[0].classList.add('active');
        }

        // Helper: set active card as the one whose center is closest to viewport center
        let lastActive = null;
        const setActiveByViewportCenter = () => {
            const viewportCenter = window.innerHeight / 2;
            let bestCard = null;
            let bestDistance = Infinity;
            eventCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const distance = Math.abs(cardCenter - viewportCenter);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestCard = card;
                }
            });
            if (bestCard) {
                if (lastActive !== bestCard) {
                    // Update active classes
                    eventCards.forEach(c => c.classList.remove('active'));
                    bestCard.classList.add('active');
                    // Simple scale change only (no entry motion)
                    lastActive = bestCard;
                }
            }
        };

        // Apply subtle circular-like motion: rotate and orbit horizontally based on distance to center
        // No orbit motion

        // IntersectionObserver triggers recalculation near thresholds to avoid excessive work
        const activeObserver = new IntersectionObserver(() => {
            setActiveByViewportCenter();
        }, { threshold: [0.1, 0.25, 0.5, 0.75, 0.9] });

        eventCards.forEach(card => activeObserver.observe(card));

        // Remove proximity scaling per latest request
        eventCards.forEach(card => { card.style.transform = ''; });

        // No moving DOM indicator needed; handled via CSS ::before on active card

        // Also update on scroll and resize for continuous accuracy
        const debouncedActive = debounce(() => { setActiveByViewportCenter(); }, 10);
        window.addEventListener('scroll', debouncedActive, { passive: true });
        window.addEventListener('resize', debouncedActive);
        // Initial state
        setActiveByViewportCenter();

        // No internal scroll logic; rely on normal page scroll
    }
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.item-card, .testimonial-card, .step');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Enhanced image container effects
    const imageContainers = document.querySelectorAll('.item-image-container');
    imageContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.3)';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add ripple effect on click for image containers
    imageContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 10;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Typing effect removed per preference
    
    // Removed counter animation for trust elements (no text animations)
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Form validation for contact forms (if any are added later)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form submission logic here
            console.log('Form submitted');
        });
    });
    
    // Social media link handlers
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add social media tracking or redirect logic here
            console.log('Social link clicked:', this.href);
        });
    });
    
    // Calendly link tracking
    const calendlyLink = document.querySelector('a[href*="calendly.com"]');
    if (calendlyLink) {
        calendlyLink.addEventListener('click', function() {
            // Add analytics tracking here
            console.log('Calendly link clicked');
        });
    }
    
    // Add scroll progress indicator (optional)
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-gold), #b8941f);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
});

// Utility functions
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Add any scroll-based functionality here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);
