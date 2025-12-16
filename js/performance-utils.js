/**
 * Performance Optimization Utilities
 * Lazy loading, debouncing, and performance enhancements
 */

// Performance Monitoring
const performanceMonitor = {
    marks: {},
    
    start(name) {
        this.marks[name] = performance.now();
    },
    
    end(name) {
        if (this.marks[name]) {
            const duration = performance.now() - this.marks[name];
            console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
            delete this.marks[name];
        }
    }
};

// Debounce Function
function debounce(func, wait = 150) {
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

// Throttle Function
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy Load Images
const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
};

// Lazy Load iframes (YouTube, Sketchfab)
const lazyLoadIframes = () => {
    const iframeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                }
                observer.unobserve(iframe);
            }
        });
    }, {
        rootMargin: '200px 0px',
        threshold: 0.01
    });

    document.querySelectorAll('iframe[data-src]').forEach(iframe => {
        iframeObserver.observe(iframe);
    });
};

// Optimize Scrolling
const optimizeScrolling = () => {
    let scrolling = false;
    
    const handleScroll = throttle(() => {
        if (!scrolling) {
            document.body.classList.add('scrolling');
            scrolling = true;
        }
    }, 100);
    
    const handleScrollEnd = debounce(() => {
        document.body.classList.remove('scrolling');
        scrolling = false;
    }, 150);
    
    window.addEventListener('scroll', () => {
        handleScroll();
        handleScrollEnd();
    }, { passive: true });
};

// Preload Critical Resources
const preloadCriticalResources = () => {
    const criticalImages = document.querySelectorAll('img.site-main-image, img.cover-image');
    criticalImages.forEach(img => {
        if (img.src && !img.complete) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        }
    });
};

// Reduce Animation Complexity on Low-End Devices
const optimizeAnimations = () => {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        document.body.classList.add('reduced-animations');
    }
};

// Clean Up Unused Event Listeners
const cleanupEventListeners = () => {
    // Remove duplicate event listeners
    const buttons = document.querySelectorAll('[onclick]');
    buttons.forEach(button => {
        const onclick = button.getAttribute('onclick');
        if (onclick) {
            button.removeAttribute('onclick');
            button.addEventListener('click', new Function(onclick), { once: false });
        }
    });
};

// Optimize Modal Performance
const optimizeModals = () => {
    const modals = document.querySelectorAll('.modal');
    const modalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.display = 'block';
            } else {
                // Don't hide, just reduce priority
                entry.target.style.contentVisibility = 'auto';
            }
        });
    }, { threshold: 0 });
    
    modals.forEach(modal => modalObserver.observe(modal));
};

// Optimize Gallery Performance
const optimizeGallery = () => {
    const galleries = document.querySelectorAll('.gallery-track, .carousel-track');
    
    galleries.forEach(gallery => {
        // Use passive listeners for better scroll performance
        gallery.addEventListener('scroll', throttle(() => {
            // Lazy load visible items only
            const visibleItems = gallery.querySelectorAll('.heritage-card, .model-card');
            visibleItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                if (rect.left >= 0 && rect.right <= window.innerWidth) {
                    item.classList.add('in-view');
                }
            });
        }, 200), { passive: true });
    });
};

// Main Initialization
const initPerformanceOptimizations = () => {
    performanceMonitor.start('Page Load');
    
    // Run optimizations after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
        runOptimizations();
    }
};

function runOptimizations() {
    console.log('🚀 Initializing Performance Optimizations...');
    
    // Priority 1: Critical optimizations
    preloadCriticalResources();
    optimizeAnimations();
    optimizeScrolling();
    
    // Priority 2: Lazy loading
    setTimeout(() => {
        lazyLoadImages();
        lazyLoadIframes();
    }, 100);
    
    // Priority 3: UI optimizations
    setTimeout(() => {
        optimizeModals();
        optimizeGallery();
        cleanupEventListeners();
    }, 500);
    
    performanceMonitor.end('Page Load');
    console.log('✅ Performance optimizations loaded');
}

// Auto-initialize
initPerformanceOptimizations();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        performanceMonitor,
        lazyLoadImages,
        lazyLoadIframes
    };
}
