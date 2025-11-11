// Keeladi Archaeological Site Interactive Features
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
const totalCards = 6; // Total number of heritage cards for Keeladi

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
    alert('AR Experience launching... View 3D models of Tamil-Brahmi pottery, excavation sites, and ancient artifacts!');
    
    // In a real implementation, you would integrate with libraries like:
    // - AR.js for web-based AR
    // - 8th Wall for advanced AR features
    // - Model Viewer for 3D model display
    console.log('AR functionality would launch here with 3D models of Keeladi archaeological artifacts');
}

// Storytelling Modal Functions
function openStorytellingModal() {
    openModal('storytellingModal');
}

function startStory(storyType) {
    const stories = {
        merchant: {
            title: "The Sangam Trader's Tale",
            content: `
                <div class="story-content">
                    <h4>A Merchant in Ancient Keeladi</h4>
                    <p>The year is 500 BCE. A prosperous merchant named Chattan walks through Keeladi's bustling marketplace, his hands bearing Tamil-Brahmi inscribed pottery recording the day's trade. Roman gold coins jingle in his pouch...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('merchant', 'trade')" class="story-choice-btn">Follow the Trade Routes</button>
                        <button onclick="continueStory('merchant', 'market')" class="story-choice-btn">Explore the Marketplace</button>
                    </div>
                </div>
            `
        },
        scribe: {
            title: "The Tamil-Brahmi Scholar",
            content: `
                <div class="story-content">
                    <h4>Chronicles of an Ancient Scribe</h4>
                    <p>Seated in a well-lit workshop, the scribe carefully inscribes Tamil-Brahmi letters onto pottery. Each mark preserves Tamil language and culture for millennia to come. This is the dawn of written Tamil literature...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('scribe', 'script')" class="story-choice-btn">Learn the Ancient Script</button>
                        <button onclick="continueStory('scribe', 'literature')" class="story-choice-btn">Discover Tamil Literature</button>
                    </div>
                </div>
            `
        },
        archaeologist: {
            title: "The Great Discovery",
            content: `
                <div class="story-content">
                    <h4>Unearthing Keeladi's Secrets</h4>
                    <p>Year 2015. Dr. Rajesh brushes away 2,600 years of earth to reveal a pottery fragment. As he cleans it, Tamil-Brahmi letters emerge - rewriting everything we thought we knew about ancient Tamil civilization...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('archaeologist', 'discovery')" class="story-choice-btn">Witness the Discovery</button>
                        <button onclick="continueStory('archaeologist', 'significance')" class="story-choice-btn">Understand the Significance</button>
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
        merchant: {
            trade: "Caravans from Rome, Sri Lanka, and Southeast Asia regularly arrived in Keeladi, bringing exotic goods and taking back Tamil Nadu's famed textiles and spices...",
            market: "The marketplace buzzed with different languages - Tamil, Prakrit, and foreign tongues. Every transaction was recorded on pottery in Tamil-Brahmi script..."
        },
        scribe: {
            script: "The Tamil-Brahmi script evolved from Brahmi, adapting it perfectly to Tamil phonology. Each inscription preserved Tamil language for future generations...",
            literature: "The scribe's work was part of the great Sangam literary tradition, documenting trade, poetry, and daily life in beautiful Tamil verses..."
        },
        archaeologist: {
            discovery: "Layer by layer, the excavation revealed urban planning, drainage systems, craft workshops - evidence of a sophisticated 2,600-year-old civilization...",
            significance: "This discovery pushed Tamil civilization back by centuries, proving ancient Tamil culture was contemporary with the Indus Valley Civilization..."
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
                    <div class="post-category">Archaeology</div>
                    <h4>Latest Keeladi Excavation Findings (2024)</h4>
                    <p class="post-excerpt">Recent excavations have revealed new insights into Keeladi's urban planning, sophisticated drainage systems, and evidence of craft specialization in this 2,600-year-old Tamil settlement...</p>
                    <button class="read-more-btn" onclick="readFullBlog('excavation')">Read More</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Epigraphy</div>
                    <h4>Tamil-Brahmi Script: Decoding Ancient Tamil</h4>
                    <p class="post-excerpt">Detailed analysis of Tamil-Brahmi inscriptions found on pottery shards reveals early Tamil literary traditions, trade records, and the sophistication of Sangam-era writing...</p>
                    <button class="read-more-btn" onclick="readFullBlog('script')">Read More</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">History</div>
                    <h4>Ancient Tamil Trade Networks Revealed</h4>
                    <p class="post-excerpt">Evidence from Keeladi reveals extensive trade connections with Rome, Southeast Asia, and Sri Lanka, highlighting Tamil Nadu's pivotal role in ancient international commerce...</p>
                    <button class="read-more-btn" onclick="readFullBlog('trade')">Read More</button>
                </article>
            </div>
        `;
    }
}

function readFullBlog(articleType) {
    const articles = {
        excavation: {
            title: "Latest Keeladi Excavation Findings (2024)",
            content: `
                <h4>Revolutionary Discoveries at Keeladi</h4>
                <p>The ongoing excavations at Keeladi continue to rewrite South Indian history. Recent findings from 2024 have uncovered new residential quarters, craft workshops, and more Tamil-Brahmi inscriptions, revealing the extent of this sophisticated urban settlement dating back 2,600 years.</p>
                
                <h5>Urban Planning & Infrastructure</h5>
                <p>The latest excavations reveal well-planned streets in a grid pattern, advanced drainage systems with terracotta pipes, and distinct residential and commercial zones. The level of urban sophistication rivals contemporary civilizations including the Indus Valley.</p>
                
                <h5>Archaeological Significance</h5>
                <p>Carbon dating confirms Keeladi's timeline to the 6th century BCE, making it contemporary with the Indus Valley Civilization. This discovery challenges traditional narratives and establishes Tamil civilization's antiquity. Over 5,000 artifacts including iron tools, beads, pottery, and terracotta objects have been recovered.</p>
            `
        },
        script: {
            title: "Tamil-Brahmi Script: Decoding Ancient Tamil",
            content: `
                <h4>The Birth of Written Tamil</h4>
                <p>The Tamil-Brahmi inscriptions found at Keeladi represent some of the earliest evidence of written Tamil language. These inscriptions on pottery shards and other artifacts reveal a society that valued literacy and maintained extensive written records.</p>
                
                <h5>Linguistic Evolution</h5>
                <p>Tamil-Brahmi script adapted the Brahmi script to suit Tamil phonology, creating a writing system uniquely suited to the Tamil language. The inscriptions found at Keeladi include personal names, trade records, ownership marks, and even poetic verses - providing invaluable insights into Sangam-era Tamil literature.</p>
                
                <h5>Cultural Impact</h5>
                <p>These inscriptions prove that written Tamil existed much earlier than previously believed. The sophistication of the script and the variety of contexts in which it was used (trade, administration, personal identification) indicates a highly literate urban society with strong literary traditions.</p>
            `
        },
        trade: {
            title: "Ancient Tamil Trade Networks Revealed",
            content: `
                <h4>Global Connections of Ancient Tamil Nadu</h4>
                <p>Archaeological evidence from Keeladi reveals extensive international trade connections. Artifacts including Roman coins, Sri Lankan pottery, Southeast Asian beads, and other exotic materials demonstrate that Keeladi was a crucial node in ancient global trade networks.</p>
                
                <h5>Maritime Commerce</h5>
                <p>The presence of Roman gold coins and Mediterranean pottery confirms direct trade with the Roman Empire via maritime routes. Ancient Tamil ports facilitated trade in textiles, spices, precious stones, and other luxury goods. Keeladi's location near the Vaigai River provided access to both inland and coastal trade routes.</p>
                
                <h5>Economic Sophistication</h5>
                <p>Evidence of specialized craft production, standardized weights and measures, and written trade records indicate a complex market economy. The variety and volume of trade goods suggest Keeladi was a prosperous urban center connected to the broader Sangam-era economic network that linked India with Rome, Southeast Asia, and beyond.</p>
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
        question: "When did the first phase of Keeladi excavations begin?",
        options: ["2010", "2015", "2017", "2019"],
        correct: 1,
        explanation: "The Archaeological Survey of India (ASI) began the first phase of excavations at Keeladi in 2015, uncovering evidence of an ancient urban civilization."
    },
    {
        question: "What is the carbon-dated age of Keeladi civilization?",
        options: ["2,200 years", "2,400 years", "2,600 years", "3,000 years"],
        correct: 2,
        explanation: "Carbon dating confirms that Keeladi dates back to the 6th century BCE, making it approximately 2,600 years old."
    },
    {
        question: "Which script was discovered on pottery at Keeladi?",
        options: ["Sanskrit", "Tamil-Brahmi", "Devanagari", "Grantha"],
        correct: 1,
        explanation: "Tamil-Brahmi script inscriptions were found on pottery shards and other artifacts, providing evidence of early written Tamil."
    },
    {
        question: "Approximately how many artifacts have been recovered from Keeladi?",
        options: ["1,000+", "3,000+", "5,000+", "10,000+"],
        correct: 2,
        explanation: "Over 5,000 artifacts including iron tools, pottery, beads, terracotta objects, and inscribed pottery have been recovered from the excavations."
    },
    {
        question: "What makes Keeladi's urban planning significant?",
        options: ["Random layout", "Grid pattern streets with drainage", "Circular design", "Hilltop fortification"],
        correct: 1,
        explanation: "Keeladi featured well-planned streets in a grid pattern with advanced drainage systems using terracotta pipes, showing sophisticated urban planning."
    },
    {
        question: "Which civilization is Keeladi contemporary with?",
        options: ["Roman Empire", "Indus Valley Civilization", "Mesopotamian Civilization", "Egyptian Civilization"],
        correct: 1,
        explanation: "Keeladi dates to the 6th century BCE, making it contemporary with the later phase of the Indus Valley Civilization."
    },
    {
        question: "What evidence of international trade was found at Keeladi?",
        options: ["Chinese silk", "Roman coins", "Egyptian papyrus", "Greek pottery"],
        correct: 1,
        explanation: "Roman gold coins and Mediterranean pottery were discovered, confirming direct trade connections with the Roman Empire via maritime routes."
    },
    {
        question: "Which river is Keeladi located near?",
        options: ["Kaveri", "Tamirabarani", "Vaigai", "Palar"],
        correct: 2,
        explanation: "Keeladi is situated near the Vaigai River, which provided access to both inland and coastal trade routes."
    },
    {
        question: "What does the name 'Keeladi' mean in Tamil?",
        options: ["Ancient place", "Lower settlement", "Sacred land", "Trading post"],
        correct: 1,
        explanation: "'Keeladi' in Tamil means 'lower settlement' or 'downstream village', referring to its location along the river."
    },
    {
        question: "What type of economy did Keeladi have?",
        options: ["Purely agricultural", "Complex market economy", "Hunter-gatherer", "Pastoral"],
        correct: 1,
        explanation: "Evidence of specialized craft production, standardized weights and measures, and written trade records indicate a complex market economy."
    },
    {
        question: "What period of Tamil history does Keeladi belong to?",
        options: ["Pallava period", "Chola period", "Sangam period", "Nayak period"],
        correct: 2,
        explanation: "Keeladi belongs to the Sangam period (3rd century BCE to 3rd century CE), providing archaeological evidence for this classical Tamil era."
    },
    {
        question: "What was a major finding that proved literacy at Keeladi?",
        options: ["Stone tablets", "Palm leaf manuscripts", "Inscribed pottery", "Metal plaques"],
        correct: 2,
        explanation: "Inscribed pottery with Tamil-Brahmi script containing names, trade records, and ownership marks proved widespread literacy in ancient Keeladi."
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
