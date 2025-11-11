// Kanyakumari Heritage Site Interactive Features
// Consistent with Tamil Nadu heritage theme

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Gallery Tab Management
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Heritage Gallery Scroll Functionality
let currentGalleryIndex = 0;
let cardsPerView = 3; // Default for desktop
const totalCards = 6; // Total number of heritage cards for Kanyakumari

function scrollGallery(direction) {
    const galleryTrack = document.getElementById('galleryTrack');
    if (!galleryTrack) return;
    
    const cardWidth = 320 + 25; // Card width + gap
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    
    if (direction === 'left') {
        currentGalleryIndex = Math.max(0, currentGalleryIndex - 1);
    } else {
        currentGalleryIndex = Math.min(maxIndex, currentGalleryIndex + 1);
    }
    
    const translateX = -(currentGalleryIndex * cardWidth);
    galleryTrack.style.transform = `translateX(${translateX}px)`;
    
    // Update navigation button states
    updateGalleryNavButtons();
}

function updateGalleryNavButtons() {
    const prevBtn = document.querySelector('.prev-gallery');
    const nextBtn = document.querySelector('.next-gallery');
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    
    if (prevBtn) {
        prevBtn.style.opacity = currentGalleryIndex === 0 ? '0.5' : '1';
        prevBtn.disabled = currentGalleryIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.style.opacity = currentGalleryIndex >= maxIndex ? '0.5' : '1';
        nextBtn.disabled = currentGalleryIndex >= maxIndex;
    }
}

// Touch/swipe support for heritage gallery
let galleryStartX = 0;
let galleryEndX = 0;

function handleGalleryTouchStart(e) {
    galleryStartX = e.touches[0].clientX;
}

function handleGalleryTouchMove(e) {
    galleryEndX = e.touches[0].clientX;
}

function handleGalleryTouchEnd() {
    const threshold = 50;
    const diff = galleryStartX - galleryEndX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            scrollGallery('right');
        } else {
            scrollGallery('left');
        }
    }
}

// Image modal functionality for gallery
function openImageModal(imageSrc, caption) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.image-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="modal-close" onclick="closeImageModal()">&times;</span>
            <img src="${imageSrc}" alt="${caption}" class="modal-image">
            <div class="modal-caption">${caption}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
}

// Toggle Read More functionality for pin messages
function toggleReadMore(textId, button) {
    const textElement = document.getElementById(textId);
    const isExpanded = textElement.classList.contains('expanded');
    
    if (isExpanded) {
        textElement.classList.remove('expanded');
        button.textContent = 'Read More';
    } else {
        textElement.classList.add('expanded');
        button.textContent = 'Read Less';
    }
}

// Check if text needs read more button and show/hide accordingly
function checkTextOverflow() {
    const pinTexts = document.querySelectorAll('.pin-text');
    
    pinTexts.forEach((textElement, index) => {
        const button = textElement.parentElement.querySelector('.read-more-btn');
        if (!button) return;
        
        // Temporarily remove line clamp to check full height
        const originalClamp = textElement.style.webkitLineClamp;
        textElement.style.webkitLineClamp = 'unset';
        
        const fullHeight = textElement.scrollHeight;
        
        // Restore line clamp
        textElement.style.webkitLineClamp = originalClamp || '3';
        
        const clampedHeight = textElement.scrollHeight;
        
        // Show read more button if text is truncated
        if (fullHeight > clampedHeight) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });
}

// Responsive gallery adjustment
function adjustCardsPerView() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) {
        cardsPerView = 1;
    } else if (screenWidth < 768) {
        cardsPerView = 2;
    } else {
        cardsPerView = 3;
    }
    
    // Reset gallery position and update navigation
    currentGalleryIndex = 0;
    const galleryTrack = document.getElementById('galleryTrack');
    if (galleryTrack) {
        galleryTrack.style.transform = 'translateX(0px)';
    }
    updateGalleryNavButtons();
}

// Initialize heritage gallery functionality
function initializeHeritageGallery() {
    // Add touch event listeners to gallery
    const galleryContainer = document.querySelector('.gallery-scroll-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('touchstart', handleGalleryTouchStart, { passive: true });
        galleryContainer.addEventListener('touchmove', handleGalleryTouchMove, { passive: true });
        galleryContainer.addEventListener('touchend', handleGalleryTouchEnd);
    }
    
    // Initialize navigation button states
    updateGalleryNavButtons();
    
    // Check text overflow for read more buttons
    setTimeout(checkTextOverflow, 100); // Small delay to ensure DOM is rendered
    
    // Adjust on resize
    window.addEventListener('resize', function() {
        adjustCardsPerView();
        setTimeout(checkTextOverflow, 100); // Recheck after resize
    });
    adjustCardsPerView(); // Initial call
}

// AR Functionality
function launchAR() {
    // Simulate AR launch - in real implementation, this would integrate with AR libraries
    alert('AR Experience launching... Please point your device camera at the landmarks for an immersive 3D experience!');
    
    // In a real implementation, you would integrate with libraries like:
    // - AR.js for web-based AR
    // - 8th Wall for advanced AR features
    // - Model Viewer for 3D model display
    console.log('AR functionality would launch here with 3D models of Kanyakumari landmarks');
}

// Storytelling Modal Functions
function openStorytellingModal() {
    openModal('storytellingModal');
}

function startStory(storyType) {
    const stories = {
        king: {
            title: "The Pandya Princess's Legacy",
            content: `
                <div class="story-content">
                    <h4>Kumari Amman - The Virgin Goddess</h4>
                    <p>Legend tells of a princess who stood at the southernmost tip of Bharat, where three seas meet. She awaited her divine consort, but destiny had different plans...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('king', 'vision')" class="story-choice-btn">Discover the Eternal Wait</button>
                        <button onclick="continueStory('king', 'construction')" class="story-choice-btn">Explore the Sacred Temple</button>
                    </div>
                </div>
            `
        },
        merchant: {
            title: "A Trader's Journey to the Land's End",
            content: `
                <div class="story-content">
                    <h4>The Merchant's Tales</h4>
                    <p>For centuries, traders from across the world have journeyed to this sacred confluence. The spices of the south, the pearls of the Gulf of Mannar, and the wisdom of the sages drew merchants to Kanyakumari...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('merchant', 'trade')" class="story-choice-btn">Follow the Ancient Trade Routes</button>
                        <button onclick="continueStory('merchant', 'culture')" class="story-choice-btn">Experience Cultural Confluence</button>
                    </div>
                </div>
            `
        },
        pilgrim: {
            title: "Vivekananda's Meditation",
            content: `
                <div class="story-content">
                    <h4>The Sage's Awakening</h4>
                    <p>In December 1892, Swami Vivekananda swam to a massive rock jutting from the confluence. There he meditated for three days and found his life's mission - to spread the message of Vedanta to the world...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('pilgrim', 'meditation')" class="story-choice-btn">Experience the Sacred Meditation</button>
                        <button onclick="continueStory('pilgrim', 'enlightenment')" class="story-choice-btn">Discover the Divine Mission</button>
                    </div>
                </div>
            `
        }
    };
    
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (stories[storyType] && modalBody) {
        modalBody.innerHTML = stories[storyType].content;
    }
}

function continueStory(character, choice) {
    const continuations = {
        king: {
            vision: "The goddess Kumari Amman continues her eternal vigil at the southern tip, her diamond nose ring said to guide ships safely through the tumultuous waters...",
            construction: "The ancient temple stands as a testament to Dravidian architecture, with its towering gopuram visible to sailors from miles away..."
        },
        merchant: {
            trade: "Ships from Arabia, China, and Southeast Asia converged here, making Kanyakumari a crucial node in the ancient maritime trade network...",
            culture: "The confluence of three seas created a cultural melting pot where Tamil, Malayalam, and Sanskrit traditions merged beautifully..."
        },
        pilgrim: {
            meditation: "On that sacred rock, surrounded by the cosmic dance of three oceans, Vivekananda found clarity in the rhythmic waves...",
            enlightenment: "The sage emerged from his meditation with a vision - to awaken India and share her ancient wisdom with the modern world..."
        }
    };
    
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="story-continuation">
                <h4>Story Continues...</h4>
                <p>${continuations[character][choice]}</p>
                <button onclick="startStory('${character}')" class="story-choice-btn">Return to Story Selection</button>
                <button onclick="closeModal('storytellingModal')" class="story-choice-btn">End Story</button>
            </div>
        `;
    }
}

// Blog Modal Functions
function openBlogModal() {
    openModal('blogModal');
    const modalBody = document.querySelector('#blogModal .modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="blog-posts">
                <article class="blog-post">
                    <div class="post-category">Heritage</div>
                    <h4>Tri-Sea Confluence: A Geographic Marvel</h4>
                    <p class="post-excerpt">Explore the unique phenomenon where three mighty water bodies meet - the Arabian Sea, Bay of Bengal, and Indian Ocean converge at Kanyakumari...</p>
                    <button class="read-more-btn" onclick="readFullBlog('confluence')">Read More</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Philosophy</div>
                    <h4>Swami Vivekananda's Historic Meditation</h4>
                    <p class="post-excerpt">Discover the profound spiritual journey of Swami Vivekananda at the Vivekananda Rock Memorial, where he meditated and found his life's calling...</p>
                    <button class="read-more-btn" onclick="readFullBlog('vivekananda')">Read More</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Architecture</div>
                    <h4>Thiruvalluvar Statue: A Monumental Tribute</h4>
                    <p class="post-excerpt">Standing at 133 feet, the Thiruvalluvar Statue represents the 133 chapters of the Thirukkural, Tamil literature's crowning jewel...</p>
                    <button class="read-more-btn" onclick="readFullBlog('thiruvalluvar')">Read More</button>
                </article>
            </div>
        `;
    }
}

function readFullBlog(articleType) {
    const articles = {
        confluence: {
            title: "Tri-Sea Confluence: A Geographic Marvel",
            content: `
                <h4>Where Three Seas Meet</h4>
                <p>Kanyakumari holds a unique distinction as the only place on Earth where you can witness the confluence of three major water bodies - the Arabian Sea, Bay of Bengal, and the Indian Ocean. This geographic marvel creates stunning visual displays, especially during sunrise and sunset.</p>
                
                <h5>The Science Behind the Colors</h5>
                <p>The meeting of these three seas creates distinct color variations in the water. Due to differences in depth, temperature, and sediment composition, you can actually see different shades of blue merging together, creating a natural spectacle that has captivated visitors for centuries.</p>
                
                <h5>Cultural Significance</h5>
                <p>Ancient Tamil literature speaks of this sacred confluence as "Kumari Kottam" - the fortress of the virgin goddess. Pilgrims have journeyed here for millennia to witness this divine meeting point and seek blessings.</p>
            `
        },
        vivekananda: {
            title: "Swami Vivekananda's Historic Meditation",
            content: `
                <h4>A Transformative Journey</h4>
                <p>In December 1892, Swami Vivekananda swam to a massive rock 500 meters from the shore, where he meditated for three days. This profound spiritual experience crystallized his mission to spread Vedanta philosophy worldwide.</p>
                
                <h5>The Rock Memorial</h5>
                <p>The Vivekananda Rock Memorial, built in 1970, commemorates this historic meditation. The architectural marvel combines designs from different parts of India, symbolizing national unity. The memorial consists of two main structures - the Vivekananda Mandapam and the Shripada Mandapam.</p>
                
                <h5>Legacy and Inspiration</h5>
                <p>Following this meditation, Vivekananda went on to represent Hinduism at the Parliament of World Religions in Chicago in 1893, where his famous speech beginning with "Sisters and brothers of America" received a standing ovation and introduced Yoga and Vedanta to the Western world.</p>
            `
        },
        thiruvalluvar: {
            title: "Thiruvalluvar Statue: A Monumental Tribute",
            content: `
                <h4>A Towering Testament to Tamil Culture</h4>
                <p>The 133-feet tall statue of the ancient Tamil poet and philosopher Thiruvalluvar stands majestically on a small island rock near Vivekananda Rock Memorial. Unveiled on January 1, 2000, it required 10 years of construction.</p>
                
                <h5>Symbolic Significance</h5>
                <p>Every measurement of this statue carries meaning - the 133 feet represents the 133 chapters (adhikarams) of the Thirukkural, his masterpiece on ethics, politics, economics, and love. The 38-foot pedestal symbolizes the 38 chapters in the first section "Aram" (virtue), while the 95-foot statue itself represents the remaining 95 chapters.</p>
                
                <h5>Architectural Marvel</h5>
                <p>Designed by sculptor V. Ganapati Sthapati, the statue weighs approximately 7000 tons and is made of 3,681 stones. Each stone was individually carved and assembled using ancient Tamil architectural techniques. The statue can withstand wind speeds up to 280 km/h and earthquakes measuring up to 8 on the Richter scale.</p>
            `
        }
    };
    
    const modalBody = document.querySelector('#blogModal .modal-body');
    if (articles[articleType] && modalBody) {
        const article = articles[articleType];
        modalBody.innerHTML = `
            <div class="full-article">
                <h3>${article.title}</h3>
                <div class="article-content">
                    ${article.content}
                </div>
                <button onclick="openBlogModal()" class="back-to-blog-btn">← Back to All Articles</button>
            </div>
        `;
    }
}

// Quiz Modal Functions
function openQuizModal() {
    openModal('quizModal');
}

let currentQuestion = 0;
let score = 0;
let quizQuestions = [
    {
        question: "What makes Kanyakumari geographically unique?",
        options: ["Highest peak in South India", "Confluence of three seas", "Largest temple complex", "Ancient port city"],
        correct: 1,
        explanation: "Kanyakumari is the only place where the Arabian Sea, Bay of Bengal, and Indian Ocean meet."
    },
    {
        question: "How tall is the Thiruvalluvar Statue?",
        options: ["100 feet", "122 feet", "133 feet", "150 feet"],
        correct: 2,
        explanation: "The statue stands at 133 feet, representing the 133 chapters of Thirukkural."
    },
    {
        question: "When did Swami Vivekananda meditate at Kanyakumari?",
        options: ["December 1890", "December 1892", "December 1894", "December 1896"],
        correct: 1,
        explanation: "Swami Vivekananda meditated at the rock in December 1892, finding his life's mission."
    },
    {
        question: "What is the ancient name of Kanyakumari?",
        options: ["Madurai", "Kumari Kottam", "Pandya Pattanam", "Sangam Teertham"],
        correct: 1,
        explanation: "Kanyakumari was anciently known as 'Kumari Kottam' - the fortress of the virgin goddess."
    },
    {
        question: "The Kumari Amman Temple is dedicated to which goddess?",
        options: ["Meenakshi", "Parvati", "Kanyakumari (Virgin Goddess)", "Lakshmi"],
        correct: 2,
        explanation: "The temple is dedicated to Goddess Kanyakumari, an incarnation of Parvati in virgin form."
    },
    {
        question: "What unique phenomenon can be observed at Kanyakumari during full moon in April?",
        options: ["Bioluminescence", "Sunset and moonrise together", "Aurora", "Tidal waves"],
        correct: 1,
        explanation: "During full moon in April, one can witness both sunset and moonrise simultaneously from the same spot."
    },
    {
        question: "How many stones were used to build the Thiruvalluvar Statue?",
        options: ["2,500 stones", "3,681 stones", "5,000 stones", "7,000 stones"],
        correct: 1,
        explanation: "The statue was constructed using 3,681 individually carved stones weighing 7000 tons total."
    },
    {
        question: "What is the significance of the 38-foot pedestal of Thiruvalluvar Statue?",
        options: ["His age", "Years of work", "38 chapters of 'Aram'", "Height of the hill"],
        correct: 2,
        explanation: "The 38-foot pedestal represents the 38 chapters in the first section 'Aram' (virtue) of Thirukkural."
    },
    {
        question: "Which famous speech did Vivekananda deliver after his Kanyakumari meditation?",
        options: ["India's Freedom Speech", "Chicago Parliament Speech", "Vedanta Sermon", "Unity Address"],
        correct: 1,
        explanation: "After his meditation, Vivekananda delivered his historic speech at the Parliament of World Religions in Chicago in 1893."
    },
    {
        question: "What architectural style is the Vivekananda Rock Memorial?",
        options: ["Dravidian only", "Gothic", "Combination of styles from across India", "Modern"],
        correct: 2,
        explanation: "The memorial combines architectural designs from different parts of India, symbolizing national unity."
    },
    {
        question: "What is Thirukkural?",
        options: ["A temple", "A classical Tamil text on ethics", "A dance form", "A musical instrument"],
        correct: 1,
        explanation: "Thirukkural is a classical Tamil text consisting of 1,330 couplets on ethics, politics, economics, and love."
    },
    {
        question: "What makes the sunrise at Kanyakumari special?",
        options: ["It's the earliest in India", "Visible from the beach", "Colors the three seas differently", "All of the above"],
        correct: 3,
        explanation: "Kanyakumari's sunrise is special because it's visible from the beach, colors the three seas differently, and occurs early due to its eastern location."
    }
];

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const quizContainer = document.getElementById('quizContainer');
    if (currentQuestion < quizQuestions.length) {
        const question = quizQuestions[currentQuestion];
        quizContainer.innerHTML = `
            <div class="quiz-question">
                <div class="quiz-progress">
                    <span>Question ${currentQuestion + 1} of ${quizQuestions.length}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((currentQuestion + 1) / quizQuestions.length) * 100}%"></div>
                    </div>
                </div>
                <h4>${question.question}</h4>
                <div class="quiz-options">
                    ${question.options.map((option, index) => 
                        `<button class="quiz-option" onclick="selectAnswer(${index})">${option}</button>`
                    ).join('')}
                </div>
            </div>
        `;
    } else {
        showQuizResults();
    }
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach(option => option.disabled = true);
    
    // Show correct/incorrect
    options[selectedIndex].classList.add(selectedIndex === question.correct ? 'correct' : 'incorrect');
    if (selectedIndex !== question.correct) {
        options[question.correct].classList.add('correct');
    }
    
    // Update score
    if (selectedIndex === question.correct) {
        score++;
    }
    
    // Show explanation
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML += `
        <div class="quiz-explanation">
            <p><strong>Explanation:</strong> ${question.explanation}</p>
            <button onclick="nextQuestion()" class="next-question-btn">Next Question</button>
        </div>
    `;
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

function showQuizResults() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let message = "";
    let achievement = "";
    
    if (percentage >= 90) {
        achievement = "🏆 Tri-Sea Master";
        message = "Outstanding! You possess the wisdom of the confluence!";
    } else if (percentage >= 70) {
        achievement = "🎯 Heritage Scholar";
        message = "Excellent! Vivekananda would be proud!";
    } else if (percentage >= 50) {
        achievement = "📚 Cultural Explorer";
        message = "Good effort! Continue your journey of discovery!";
    } else {
        achievement = "🌟 Curious Seeker";
        message = "Keep exploring! The Land's End has many more stories to tell!";
    }
    
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div class="quiz-results">
            <div class="achievement-banner">
                <h3>${achievement}</h3>
            </div>
            <div class="score-circle">
                <span class="score-percentage">${percentage}%</span>
            </div>
            <div class="result-message">
                <h4>${message}</h4>
                <p>You scored ${score} out of ${quizQuestions.length} questions correctly.</p>
            </div>
            <div class="quiz-actions">
                <button onclick="startQuiz()" class="action-btn primary-btn">Retake Quiz</button>
                <button onclick="closeModal('quizModal')" class="action-btn secondary-btn">Explore More</button>
            </div>
        </div>
    `;
}

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('fade-up');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize heritage gallery
    initializeHeritageGallery();
    
    // Initialize scroll reveal
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
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
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.detail-card, .fact-card, .legend-card, .culture-item, .option-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Keyboard navigation for modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});
