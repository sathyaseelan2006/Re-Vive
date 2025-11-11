// Chennai Heritage Site JavaScript - Interactive functionality

document.addEventListener('DOMContentLoaded', function() {
    // -------------------------------
    // Modal Management
    // -------------------------------
    
    // Open modal function
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    };
    
    // Close modal function
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    };
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
    
    // -------------------------------
    // Gallery Tab Switching
    // -------------------------------
    
    window.switchTab = function(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Add active class to clicked tab button
        event.target.classList.add('active');
    };
    
    // -------------------------------
    // AR Functionality
    // -------------------------------
    
    window.launchAR = function() {
        // Check if on mobile device
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // In a real implementation, this would launch the AR experience
            alert('AR experience would launch here on a mobile device. This is a placeholder for the AR functionality.');
        } else {
            alert('AR experience is best viewed on mobile devices. Please visit this page on your mobile device for the full experience.');
        }
    };
    
    // -------------------------------
    // Storytelling Engine
    // -------------------------------
    
    window.openStorytellingModal = function() {
        openModal('storytellingModal');
    };
    
    window.startStory = function(storyId) {
        // In a real implementation, this would start the storytelling experience
        alert(`Starting story: ${storyId}. This would integrate with the NLP storytelling engine.`);
        closeModal('storytellingModal');
    };
    
    // -------------------------------
    // Blog System
    // -------------------------------
    
    window.openBlogModal = function() {
        openModal('blogModal');
    };
    
    window.readFullBlog = function(blogId) {
        // In a real implementation, this would display the full blog post
        alert(`Displaying full blog post: ${blogId}. This would integrate with the blog system.`);
        closeModal('blogModal');
    };
    
    // -------------------------------
    // Quiz System
    // -------------------------------
    
    window.openQuizModal = function() {
        openModal('quizModal');
    };
    
    window.startQuiz = function() {
        // In a real implementation, this would start the quiz
        alert('Starting quiz. This would integrate with the quiz system.');
        closeModal('quizModal');
    };
    
    // -------------------------------
    // Scroll Reveal Animations
    // -------------------------------
    
    try {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const revealEls = document.querySelectorAll('.site-section');
        
        if (prefersReduced) {
            revealEls.forEach(el => el.classList.add('in-view'));
        } else {
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
            
            revealEls.forEach(el => io.observe(el));
        }
    } catch (err) {
        console.warn('Scroll reveal setup failed:', err);
    }
    
    // -------------------------------
    // Floating Elements Animation
    // -------------------------------
    
    // Create floating animation for decorative elements
    const floatingElements = document.querySelectorAll('.decorative-corner');
    floatingElements.forEach((element, index) => {
        // Add floating animation with staggered delays
        element.style.animation = `float 3s ease-in-out infinite`;
        element.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add CSS for floating animation if not already defined
    const styleSheet = document.styleSheets[0];
    try {
        styleSheet.insertRule(`
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(5deg); }
            }
        `, styleSheet.cssRules.length);
    } catch (e) {
        // Animation rule might already exist
        console.log('Float animation rule may already exist');
    }
});
