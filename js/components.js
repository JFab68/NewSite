// Global Components Loader
class ComponentLoader {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().toLowerCase();
        
        // Map filenames to page identifiers
        const pageMap = {
            '1 homepage.html': 'home',
            '2 issues.html': 'issues',
            '3 about.html': 'about',
            '4 programs.html': 'programs',
            '5 action center.html': 'action',
            '6 partners.html': 'partners',
            '7 news.html': 'news',
            '8 contact.html': 'contact',
            '9 donate.html': 'donate'
        };

        return pageMap[filename] || 'home';
    }

    async loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                return true;
            }
        } catch (error) {
            console.warn(`Could not load component ${componentPath}:`, error);
            return false;
        }
    }

    setActiveNavItem() {
        // Set active navigation item based on current page
        const navLinks = document.querySelectorAll('.header-nav a, .nav-row-1 a, .nav-row-2 a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(this.currentPage)) {
                link.classList.add('active');
            }
        });
    }

    initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const headerNav = document.querySelector('.header-nav');

        if (mobileMenuToggle && headerNav) {
            mobileMenuToggle.addEventListener('click', () => {
                const isActive = headerNav.classList.contains('active');
                headerNav.classList.toggle('active');
                mobileMenuToggle.setAttribute('aria-expanded', !isActive);
                
                // Add mobile menu styles dynamically
                if (!isActive) {
                    headerNav.style.display = 'flex';
                    headerNav.style.position = 'absolute';
                    headerNav.style.top = '100%';
                    headerNav.style.left = '0';
                    headerNav.style.right = '0';
                    headerNav.style.background = 'var(--white)';
                    headerNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                    headerNav.style.padding = '20px';
                    headerNav.style.flexDirection = 'column';
                    headerNav.style.gap = '10px';
                    headerNav.style.zIndex = '1002';
                } else {
                    headerNav.style.display = '';
                    headerNav.style.position = '';
                    headerNav.style.top = '';
                    headerNav.style.left = '';
                    headerNav.style.right = '';
                    headerNav.style.background = '';
                    headerNav.style.boxShadow = '';
                    headerNav.style.padding = '';
                    headerNav.style.flexDirection = '';
                    headerNav.style.gap = '';
                    headerNav.style.zIndex = '';
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.header-nav') && !e.target.closest('.mobile-menu-toggle')) {
                    if (headerNav.classList.contains('active')) {
                        headerNav.classList.remove('active');
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        // Reset styles
                        headerNav.style.display = '';
                        headerNav.style.position = '';
                        headerNav.style.top = '';
                        headerNav.style.left = '';
                        headerNav.style.right = '';
                        headerNav.style.background = '';
                        headerNav.style.boxShadow = '';
                        headerNav.style.padding = '';
                        headerNav.style.flexDirection = '';
                        headerNav.style.gap = '';
                        headerNav.style.zIndex = '';
                    }
                }
            });
        }
    }

    initHeaderScrollEffect() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                    header.style.webkitBackdropFilter = 'blur(10px)';
                } else {
                    header.style.background = 'var(--white)';
                    header.style.backdropFilter = 'none';
                    header.style.webkitBackdropFilter = 'none';
                }
            }
        });
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    async init() {
        // Load header and footer components if they exist
        const headerLoaded = await this.loadComponent('global-header', 'includes/header.html');
        const footerLoaded = await this.loadComponent('global-footer', 'includes/footer.html');

        // Wait a bit for DOM to update, then initialize components
        setTimeout(() => {
            if (headerLoaded) {
                this.setActiveNavItem();
                this.initMobileMenu();
                this.initHeaderScrollEffect();
            }
            this.initSmoothScrolling();
            this.initOtherComponents();
        }, 100);
    }

    initOtherComponents() {
        // Initialize dropdown menus
        this.initDropdowns();
        
        // Initialize any form handlers
        this.initForms();
        
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Initialize FAQ accordions
        this.initFAQ();
        
        // Initialize contact form
        this.initContactForm();
    }

    initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        menu.style.opacity = '0';
                        menu.style.visibility = 'hidden';
                    }
                });
            }
        });
    }

    initForms() {
        // Newsletter form handling
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                if (email) {
                    console.log('Newsletter signup:', email);
                    // Here you would typically send to your backend
                }
            });
        }
    }

    initScrollAnimations() {
        // Simple fade-in animation for elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate in
        const animateElements = document.querySelectorAll('.change-card, .team-member, .impact-item, .challenge-item');
        animateElements.forEach(el => observer.observe(el));
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // Toggle current item
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    initContactForm() {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const name = contactForm.querySelector('input[type="text"]').value;
                const email = contactForm.querySelector('input[type="email"]').value;
                const message = contactForm.querySelector('textarea').value;
                
                if (name && email && message) {
                    // Show loading state
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                    
                    // Simulate form submission (replace with actual form handler)
                    setTimeout(() => {
                        alert('Thank you for your message! We\'ll get back to you soon.');
                        contactForm.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                    
                    console.log('Contact form submitted:', { name, email, message });
                }
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});

// Global utility functions
window.PraxisUtils = {
    // Show loading state for buttons
    showButtonLoading: (button, originalText = null) => {
        if (!originalText) originalText = button.textContent;
        button.dataset.originalText = originalText;
        button.textContent = 'Loading...';
        button.style.opacity = '0.7';
        button.disabled = true;
    },

    // Hide loading state for buttons
    hideButtonLoading: (button) => {
        const originalText = button.dataset.originalText || 'Click Here';
        button.textContent = originalText;
        button.style.opacity = '1';
        button.disabled = false;
    },

    // Smooth scroll to element
    scrollToElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Format numbers with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // Debounce function for search/input handlers
    debounce: (func, wait) => {
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
};

// Add some additional event listeners for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Handle external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.hostname === window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // Handle phone number links
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Analytics tracking could go here
            console.log('Phone number clicked:', link.href);
        });
    });

    // Handle email links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Analytics tracking could go here
            console.log('Email link clicked:', link.href);
        });
    });
});
