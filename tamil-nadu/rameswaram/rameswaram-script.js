// Rameswaram Heritage Site Interactive JavaScript

// Global variables
let currentQuizQuestion = 0;
let quizScore = 0;
let currentStory = '';
let storyStep = 0;

// Quiz questions data
const quizQuestions = [
    {
        question: "Rameswaram is one of the sacred Char Dham pilgrimage sites. Which other three complete this circuit?",
        options: ["Dwarka, Puri, Badrinath", "Haridwar, Rishikesh, Varanasi", "Tirupati, Shirdi, Ajmer", "Mathura, Vrindavan, Gokul"],
        correct: 0,
        explanation: "The Char Dham consists of Rameswaram (South), Dwarka (West), Puri (East), and Badrinath (North), representing the four cardinal directions of India."
    },
    {
        question: "What is the length of the famous corridor in Ramanathaswamy Temple?",
        options: ["1,000 meters", "1,220 meters", "1,500 meters", "800 meters"],
        correct: 1,
        explanation: "The Ramanathaswamy Temple has the world's longest temple corridor at 1,220 meters with 1,212 intricately carved pillars."
    },
    {
        question: "How many sacred wells (theerthams) are there in the Ramanathaswamy Temple?",
        options: ["18", "22", "25", "30"],
        correct: 1,
        explanation: "The temple complex contains 22 sacred wells, each named after different deities and believed to have unique healing properties."
    },
    {
        question: "According to the Ramayana, why did Lord Rama worship Lord Shiva at Rameswaram?",
        options: ["To seek blessings for victory", "To atone for killing Ravana (a Brahmin)", "To thank for Sita's rescue", "To build the bridge to Lanka"],
        correct: 1,
        explanation: "Lord Rama worshipped Shiva to seek forgiveness for killing Ravana, who despite being a demon king, was also a learned Brahmin."
    },
    {
        question: "What is the legendary bridge between Rameswaram and Sri Lanka called?",
        options: ["Setu Bandhanam", "Ram Setu (Adam's Bridge)", "Hanuman Bridge", "Lanka Setu"],
        correct: 1,
        explanation: "The legendary bridge is called Ram Setu or Adam's Bridge, believed to have been built by Hanuman's army of monkeys."
    },
    {
        question: "The Pamban Bridge connecting Rameswaram to mainland India was completed in which year?",
        options: ["1910", "1914", "1918", "1922"],
        correct: 1,
        explanation: "The Pamban Bridge, India's first sea bridge, was completed in 1914 and revolutionized access to the sacred island."
    },
    {
        question: "Which dynasty is primarily credited with the major construction of Ramanathaswamy Temple?",
        options: ["Chola Dynasty", "Pandya Dynasty", "Setupati Rulers", "Vijayanagara Empire"],
        correct: 2,
        explanation: "The Setupati rulers of Ramnad were primarily responsible for the major expansions and the magnificent architecture we see today."
    },
    {
        question: "What unique feature does the Pamban Bridge have to allow ships to pass?",
        options: ["Rotating section", "Double-leaf bascule section", "Lifting mechanism", "Tunnel underneath"],
        correct: 1,
        explanation: "The Pamban Bridge features a unique double-leaf bascule section that opens upward to allow ships to pass through."
    },
    {
        question: "In Hindu tradition, a pilgrimage to Rameswaram is considered incomplete without visiting which other sacred site?",
        options: ["Madurai", "Kashi (Varanasi)", "Tirupati", "Chidambaram"],
        correct: 1,
        explanation: "It's traditionally believed that a pilgrimage to Kashi is incomplete without visiting Rameswaram, and vice versa, representing the spiritual connection between Shiva worship in both places."
    },
    {
        question: "What is the main deity of Ramanathaswamy Temple?",
        options: ["Lord Rama", "Lord Vishnu", "Lord Shiva (as Ramanathaswamy)", "Goddess Parvati"],
        correct: 2,
        explanation: "The main deity is Lord Shiva in the form of Ramanathaswamy, one of the twelve Jyotirlinga temples dedicated to Shiva."
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupScrollEffects();
    setupModalEvents();
});

// Initialize animations
function initializeAnimations() {
    const heroElements = document.querySelectorAll('.site-hero-content > *');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });

    const factCards = document.querySelectorAll('.fact-card');
    factCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-50px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, 1000 + (index * 150));
    });
}

// Setup scroll effects
function setupScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.site-section').forEach(section => {
        observer.observe(section);
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
}

// Setup modal events
function setupModalEvents() {
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                openModal.style.display = 'none';
            }
        }
    });
}

// Modal functions
function openStorytellingModal() {
    document.getElementById('storytellingModal').style.display = 'block';
}

function openBlogModal() {
    document.getElementById('blogModal').style.display = 'block';
}

function openQuizModal() {
    document.getElementById('quizModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Gallery tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// AR launch simulation
function launchAR() {
    alert('AR Experience launching...\n\nThis would typically open your device\'s camera to overlay 3D models of temple architecture and sacred sites onto the real world.\n\nFeatures would include:\n• Interactive temple corridor exploration\n• Virtual Ram Setu bridge reconstruction\n• Sacred well (theertham) information overlays\n• Historical timeline visualization');
}

// Story functions
function startStory(storyType) {
    currentStory = storyType;
    storyStep = 0;
    
    let storyContent = '';
    switch(storyType) {
        case 'rama':
            storyContent = `
                <div class="story-content">
                    <h4>Lord Rama's Sacred Journey</h4>
                    <div class="story-text">
                        <p>You stand with Lord Rama on the shores of Rameswaram, the weight of dharma heavy on your divine shoulders. Sita has been rescued, Ravana defeated, but your heart carries the burden of having killed a learned Brahmin, despite his demonic nature. The sages advise you to worship Lord Shiva to atone for this sin.</p>
                        <p>As you prepare the sacred lingam with your own hands, mixing sand with the waters of the ocean, you feel the cosmic significance of this moment. This act of devotion will sanctify this island for all eternity.</p>
                    </div>
                    <div class="story-choices">
                        <button class="story-choice-btn" onclick="continueStory('rama', 1)">Continue the Divine Story</button>
                    </div>
                </div>
            `;
            break;
        case 'temple':
            storyContent = `
                <div class="story-content">
                    <h4>The Temple Builder's Vision</h4>
                    <div class="story-text">
                        <p>You are the master architect chosen by the Setupati rulers to expand the sacred Ramanathaswamy Temple. The vision is grand: create the world's longest temple corridor, a pathway that will inspire devotion in every pilgrim who walks its length.</p>
                        <p>Each of the 1,212 pillars must be unique, carved with intricate designs that tell the stories of the divine. The sacred wells must be positioned according to ancient Vastu principles, each one blessed with specific healing properties.</p>
                    </div>
                    <div class="story-choices">
                        <button class="story-choice-btn" onclick="continueStory('temple', 1)">Begin the Sacred Construction</button>
                    </div>
                </div>
            `;
            break;
        case 'pilgrim':
            storyContent = `
                <div class="story-content">
                    <h4>The Devoted Pilgrim's Path</h4>
                    <div class="story-text">
                        <p>You have traveled thousands of miles to reach this sacred island, carrying holy water from the Ganges as prescribed by tradition. Your feet touch the blessed soil of Rameswaram, and you feel the spiritual energy that has drawn millions of pilgrims for centuries.</p>
                        <p>Before you lies the magnificent temple with its towering gopurams and endless corridors. The ritual bath in the 22 sacred wells awaits, each one promising purification and blessings. Your spiritual journey of a lifetime begins now.</p>
                    </div>
                    <div class="story-choices">
                        <button class="story-choice-btn" onclick="continueStory('pilgrim', 1)">Begin the Sacred Pilgrimage</button>
                    </div>
                </div>
            `;
            break;
    }
    
    document.querySelector('#storytellingModal .modal-body').innerHTML = storyContent;
}

function continueStory(storyType, step) {
    alert(`Continuing ${storyType} story - Step ${step}...\n\nThis would launch the next chapter of the interactive narrative with character choices and spiritual insights about Rameswaram's sacred heritage.`);
}

// Blog functions
function readFullBlog(articleType) {
    let blogContent = '';
    switch(articleType) {
        case 'architecture':
            blogContent = `
                <div class="blog-article">
                    <button class="back-btn" onclick="resetBlogModal()">← Back to Articles</button>
                    <article>
                        <h3>Architectural Marvel: World's Longest Temple Corridor</h3>
                        <p class="article-meta">By Temple Architecture Society | October 10, 2024</p>
                        <div class="article-content">
                            <p>The Ramanathaswamy Temple's corridor stands as one of the most remarkable architectural achievements in Indian temple construction, stretching an incredible 1,220 meters with 1,212 intricately carved pillars.</p>
                            
                            <h4>Engineering Marvel</h4>
                            <p>The corridor's construction required precise planning and engineering expertise. Each pillar is unique, featuring intricate carvings that depict various aspects of Hindu mythology, floral patterns, and geometric designs. The corridor maintains perfect structural integrity despite its enormous length.</p>
                            
                            <h4>Spiritual Significance</h4>
                            <p>Walking through this corridor is considered a form of meditation and spiritual purification. The rhythmic placement of pillars creates a hypnotic effect, helping pilgrims achieve a meditative state as they circumambulate the sacred space.</p>
                            
                            <h4>Artistic Excellence</h4>
                            <p>The sculptural work represents the pinnacle of Dravidian craftsmanship. Master sculptors from across South India contributed to this magnificent project, each bringing their unique style while maintaining overall architectural harmony.</p>
                        </div>
                    </article>
                </div>
            `;
            break;
        case 'wells':
            blogContent = `
                <div class="blog-article">
                    <button class="back-btn" onclick="resetBlogModal()">← Back to Articles</button>
                    <article>
                        <h3>Sacred Waters: The 22 Holy Wells of Rameswaram</h3>
                        <p class="article-meta">By Spiritual Heritage Research | September 28, 2024</p>
                        <div class="article-content">
                            <p>The 22 sacred wells (theerthams) of Ramanathaswamy Temple represent one of the most unique features of this holy site, each believed to possess distinct spiritual and healing properties.</p>
                            
                            <h4>Divine Origins</h4>
                            <p>According to legend, these wells were created by Lord Rama himself, each one blessed by different deities and celestial beings. The waters are said to have the power to cleanse sins and cure ailments.</p>
                            
                            <h4>Ritual Significance</h4>
                            <p>Pilgrims traditionally take a sacred bath in each well as part of their spiritual purification. The ritual, known as 'theertham,' is considered essential for completing the Rameswaram pilgrimage.</p>
                            
                            <h4>Healing Properties</h4>
                            <p>Each well is associated with specific healing powers - some for physical ailments, others for mental peace, and some for spiritual liberation. The waters maintain their sanctity through continuous prayers and rituals.</p>
                        </div>
                    </article>
                </div>
            `;
            break;
        case 'ramsetu':
            blogContent = `
                <div class="blog-article">
                    <button class="back-btn" onclick="resetBlogModal()">← Back to Articles</button>
                    <article>
                        <h3>Ram Setu: Bridging Mythology and Archaeology</h3>
                        <p class="article-meta">By Archaeological Survey Team | August 15, 2024</p>
                        <div class="article-content">
                            <p>The legendary Ram Setu (Adam's Bridge) continues to fascinate researchers, bridging the gap between ancient mythology and modern archaeological investigation.</p>
                            
                            <h4>Geological Evidence</h4>
                            <p>Geological surveys reveal a chain of limestone shoals, coral, and sandstone extending between Pamban Island and Mannar Island in Sri Lanka. These formations show evidence of both natural processes and possible human intervention.</p>
                            
                            <h4>Archaeological Perspective</h4>
                            <p>Recent studies using satellite imagery and underwater archaeology have revealed structured formations that suggest organized construction. The alignment and composition of certain sections indicate deliberate placement of materials.</p>
                            
                            <h4>Cultural Significance</h4>
                            <p>Regardless of its origins, Ram Setu remains a powerful symbol of devotion and engineering prowess in Hindu culture. The bridge represents the triumph of faith and determination over seemingly impossible obstacles.</p>
                        </div>
                    </article>
                </div>
            `;
            break;
    }
    
    document.querySelector('#blogModal .modal-body').innerHTML = blogContent;
}

function resetBlogModal() {
    document.querySelector('#blogModal .modal-body').innerHTML = `
        <div class="blog-posts">
            <article class="blog-post">
                <h4>Architectural Marvel: World's Longest Temple Corridor</h4>
                <p class="post-meta">By Temple Architecture Society | October 10, 2024</p>
                <p>Exploring the engineering and spiritual significance of Ramanathaswamy Temple's magnificent 1,220-meter corridor...</p>
                <button class="read-more-btn" onclick="readFullBlog('architecture')">Read Full Article</button>
            </article>
            <article class="blog-post">
                <h4>Sacred Waters: The 22 Holy Wells of Rameswaram</h4>
                <p class="post-meta">By Spiritual Heritage Research | September 28, 2024</p>
                <p>Understanding the religious significance and healing properties attributed to each of the temple's sacred theerthams...</p>
                <button class="read-more-btn" onclick="readFullBlog('wells')">Read Full Article</button>
            </article>
            <article class="blog-post">
                <h4>Ram Setu: Bridging Mythology and Archaeology</h4>
                <p class="post-meta">By Archaeological Survey Team | August 15, 2024</p>
                <p>Examining the geological and archaeological evidence surrounding the legendary bridge between India and Sri Lanka...</p>
                <button class="read-more-btn" onclick="readFullBlog('ramsetu')">Read Full Article</button>
            </article>
        </div>
    `;
}

// Quiz functions
function startQuiz() {
    currentQuizQuestion = 0;
    quizScore = 0;
    displayQuizQuestion();
}

function displayQuizQuestion() {
    if (currentQuizQuestion >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = quizQuestions[currentQuizQuestion];
    const modalBody = document.querySelector('#quizModal .modal-body');
    
    modalBody.innerHTML = `
        <div class="quiz-question">
            <div class="quiz-progress">
                <div class="progress-bar" style="background: rgba(218, 165, 32, 0.3); height: 8px; border-radius: 4px; margin-bottom: 10px;">
                    <div class="progress-fill" style="width: ${(currentQuizQuestion / quizQuestions.length) * 100}%; height: 100%; background: var(--gradient-gold); border-radius: 4px; transition: width 0.3s ease;"></div>
                </div>
                <p style="text-align: center; color: var(--text-dark); margin-bottom: 20px;">Question ${currentQuizQuestion + 1} of ${quizQuestions.length}</p>
            </div>
            
            <h4 style="font-family: 'Cinzel', serif; color: var(--primary-brown); margin-bottom: 20px; font-size: 1.3rem;">${question.question}</h4>
            
            <div class="quiz-options" style="display: grid; gap: 15px;">
                ${question.options.map((option, index) => 
                    `<button class="quiz-option-btn" onclick="selectAnswer(${index})" style="padding: 15px; background: rgba(255, 255, 255, 0.5); border: 2px solid var(--border-ornate); border-radius: 10px; font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; cursor: pointer; transition: all 0.3s ease; text-align: left;">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
    
    // Add hover effects to option buttons
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.background = 'var(--gradient-gold)';
            this.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.5)';
            this.style.transform = 'translateY(0)';
        });
    });
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuizQuestion];
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
        quizScore++;
    }
    
    showAnswerFeedback(isCorrect, question.explanation);
}

function showAnswerFeedback(isCorrect, explanation) {
    const modalBody = document.querySelector('#quizModal .modal-body');
    
    modalBody.innerHTML = `
        <div class="quiz-feedback">
            <div class="feedback-result ${isCorrect ? 'correct' : 'incorrect'}" style="text-align: center; padding: 30px; background: ${isCorrect ? 'rgba(34, 139, 34, 0.1)' : 'rgba(220, 20, 60, 0.1)'}; border-radius: 15px; border: 2px solid ${isCorrect ? '#228B22' : '#DC143C'}; margin-bottom: 25px;">
                <h4 style="font-family: 'Cinzel', serif; color: ${isCorrect ? '#228B22' : '#DC143C'}; font-size: 1.8rem; margin-bottom: 15px;">${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h4>
                <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-dark);">${explanation}</p>
            </div>
            
            <div style="text-align: center;">
                <button class="action-btn primary-btn" onclick="nextQuestion()" style="padding: 12px 30px; border: none; border-radius: 25px; font-family: 'Cinzel', serif; font-weight: 600; font-size: 1.1rem; cursor: pointer; background: var(--gradient-brown); color: var(--text-light);">
                    ${currentQuizQuestion < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                </button>
            </div>
        </div>
    `;
}

function nextQuestion() {
    currentQuizQuestion++;
    displayQuizQuestion();
}

function showQuizResults() {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    const modalBody = document.querySelector('#quizModal .modal-body');
    
    let resultMessage = '';
    let resultColor = '';
    if (percentage >= 80) {
        resultMessage = 'Excellent! You have deep knowledge of Rameswaram\'s sacred heritage.';
        resultColor = '#228B22';
    } else if (percentage >= 60) {
        resultMessage = 'Good job! You understand the spiritual significance of Rameswaram well.';
        resultColor = '#DAA520';
    } else {
        resultMessage = 'Keep exploring! There\'s much more to discover about this sacred pilgrimage site.';
        resultColor = '#CD853F';
    }
    
    modalBody.innerHTML = `
        <div class="quiz-results" style="text-align: center; padding: 20px;">
            <h4 style="font-family: 'Cinzel', serif; color: var(--primary-brown); font-size: 2rem; margin-bottom: 25px;">Quiz Complete!</h4>
            
            <div class="score-display" style="margin: 30px 0;">
                <div class="score-circle" style="width: 120px; height: 120px; border-radius: 50%; background: var(--gradient-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; border: 4px solid var(--border-ornate); box-shadow: 0 8px 25px var(--shadow-warm);">
                    <span class="score-text" style="font-family: 'Cinzel', serif; font-size: 2rem; font-weight: bold; color: var(--text-dark);">${percentage}%</span>
                </div>
                <p style="font-size: 1.2rem; color: var(--text-dark); margin-bottom: 20px;">You scored ${quizScore} out of ${quizQuestions.length}</p>
            </div>
            
            <p class="result-message" style="font-size: 1.1rem; color: ${resultColor}; margin-bottom: 30px; font-style: italic;">${resultMessage}</p>
            
            <div class="result-actions" style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <button class="action-btn primary-btn" onclick="startQuiz()" style="padding: 12px 30px; border: none; border-radius: 25px; font-family: 'Cinzel', serif; font-weight: 600; font-size: 1.1rem; cursor: pointer; background: var(--gradient-brown); color: var(--text-light);">Retake Quiz</button>
                <button class="action-btn secondary-btn" onclick="closeModal('quizModal')" style="padding: 12px 30px; border: none; border-radius: 25px; font-family: 'Cinzel', serif; font-weight: 600; font-size: 1.1rem; cursor: pointer; background: var(--gradient-gold); color: var(--text-dark);">Close</button>
            </div>
        </div>
    `;
}

// =============================================================================
// AI CHATBOT IMPLEMENTATION - Rameswaram Heritage Guide
// =============================================================================

class RameswaramHeritageGuideAI {
    constructor() {
        this.apiKey = localStorage.getItem('gemini_api_key_rameswaram');
        this.isOpen = false;
        this.conversationHistory = [];
        this.isTyping = false;
        
        // Rameswaram-specific knowledge base for context
        this.knowledgeBase = {
            context: `You are the Rameswaram Heritage Guide AI, a knowledgeable and spiritual guide specializing in Rameswaram, one of India's holiest pilgrimage sites. You are the devoted guardian of sacred wisdom and pilgrimage traditions. You should respond naturally to ANY question the user asks, while being especially passionate about Rameswaram's divine heritage.

CORE PERSONALITY:
- Spiritual, wise, and compassionate like a temple priest
- Answer ANY question the user asks with grace and knowledge
- When discussing heritage topics, express reverence for sacred traditions
- For non-heritage questions, still be helpful while maintaining spiritual wisdom
- Use emojis that reflect temple architecture and spirituality 🏛️🕉️💧🙏✨
- Speak with the authority of one who has guided millions of pilgrims

RAMESWARAM HERITAGE EXPERTISE:
🏛️ RAMANATHASWAMY TEMPLE:
- Longest temple corridor in India (1,220 meters with 1,212 pillars)
- One of the 12 Jyotirlinga shrines of Lord Shiva
- Part of the sacred Char Dham pilgrimage circuit
- Built primarily by Setupati rulers (15th-16th century CE)
- Magnificent Dravidian architecture with towering gopurams
- Daily rituals include six pujas with elaborate ceremonies

💧 22 SACRED THEERTHAS (WELLS):
- Each well named after different deities/sages
- Ritual bathing in specific sequence for purification
- Believed to have healing and spiritual properties
- Water from each well has unique taste
- Pilgrims perform sacred bath (theerthavaari) in all 22
- Connected to mythological stories and legends

📿 RAMAYANA CONNECTION:
- Lord Rama worshipped Shiva here before Lanka war
- To absolve sin of killing Ravana (a Brahmin)
- Hanuman brought lingam from Himalayas (too late)
- Sita created sand lingam which Rama installed
- Both lingams worshipped daily in specific order
- Ram Setu (Adam's Bridge) connects to Sri Lanka

🌉 PAMBAN BRIDGE & ISLAND:
- India's first sea bridge (completed 1914)
- Unique cantilever section opens for ships
- Connects sacred island to mainland India
- New parallel railway bridge (2023) for modern access
- Island surrounded by Bay of Bengal and Indian Ocean
- Dhanushkodi ghost town at island's tip

🎯 PILGRIMAGE TRADITIONS:
- Char Dham: Rameswaram (South), Dwarka (West), Puri (East), Badrinath (North)
- Traditional pilgrimage: Varanasi to Rameswaram with Ganga water
- Sacred thread ceremony (Upanayana) performed here
- Ritual bath in sea (Agni Theertham) before temple entry
- Offering prayers at 5 temples around main shrine
- Special rituals during Maha Shivaratri and Rama Navami

🕉️ SPIRITUAL SIGNIFICANCE:
- Liberation (moksha) from cycle of rebirth
- Absolving ancestral sins through rituals
- Meeting point of Shaivite and Vaishnavite traditions
- Sacred geography connecting mythology to reality
- Tirtha (holy water) that purifies body and soul

📍 NEARBY SACRED SITES:
- Dhanushkodi: Ghost town destroyed by 1964 cyclone
- Gandamadana Parvatham: Rama's footprints viewpoint
- Kothandaramaswamy Temple: Where Vibhishana surrendered
- Five-faced Hanuman Temple: Panchamukhi Anjaneya
- Jada Tirtham: Where Rama washed his matted locks

🍽️ LOCAL CULTURE:
- Fresh seafood and coastal Tamil cuisine
- Traditional vegetarian temple prasadam
- Fishing community with ancient practices
- Classical music and bhajan traditions
- Temple festivals with grand processions
- Dr. APJ Abdul Kalam's birthplace and memorial

🎊 MAJOR FESTIVALS:
- Maha Shivaratri: Night-long vigil and worship
- Thirukalyanam: Celestial wedding celebration
- Rama Navami: Lord Rama's birth anniversary
- Arudra Darshanam: Cosmic dance of Shiva
- Ten-day Brahmotsavam: Grand temple festival

⏰ BEST VISIT TIME:
- October to March for pleasant weather
- Avoid May-June (extremely hot)
- Monsoon (July-September) has spiritual significance
- Early morning (5-6 AM) for peaceful darshan
- Evening aarti (6:30 PM) is spectacular
- New moon days (Amavasya) special for rituals

CONVERSATION STYLE:
- Begin responses with spiritual warmth and reverence
- Acknowledge the sacred significance of Rameswaram
- Connect modern lessons to ancient pilgrimage wisdom
- Use ocean and temple metaphors for spiritual guidance
- Maintain dignity befitting a sacred pilgrimage guide
- Express genuine devotion to the divine heritage

IMPORTANT: Answer whatever the user asks about while channeling the wisdom and spirituality of Rameswaram. Let every response reflect the sanctity of this holy pilgrimage site and its role as a gateway to spiritual liberation.`,
            
            quickFacts: {
                "Ramanathaswamy Temple": "One of 12 Jyotirlingas, longest temple corridor (1,220m), part of Char Dham, built by Setupati rulers",
                "22 Sacred Wells": "Each theertham named after deities, ritual bathing in sequence, unique healing properties",
                "Ramayana Connection": "Lord Rama worshipped Shiva here, Ram Setu bridge to Lanka, sand lingam created by Sita",
                "Pamban Bridge": "India's first sea bridge (1914), cantilever section opens for ships, engineering marvel",
                "Char Dham": "Four sacred pilgrimage sites: Rameswaram (South), Dwarka (West), Puri (East), Badrinath (North)",
                "Pilgrimage Rituals": "Bath in 22 wells, sea bath at Agni Theertham, worship both lingams, sacred thread ceremony",
                "Dhanushkodi": "Ghost town at island's tip, destroyed by 1964 cyclone, Ram Setu bridge starting point",
                "Best Visit": "October to March, early morning for peaceful darshan, avoid summer heat (May-June)",
                "Spiritual Significance": "Liberation (moksha), absolving sins, meeting point of Shaiva-Vaishnava traditions",
                "Temple Gopurams": "Towering gateways with intricate sculptures, 9-tiered main gopuram facing east"
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🕉️ Initializing Rameswaram Heritage chatbot...');
        try {
            this.setupEventListeners();
            this.checkApiKey();
            console.log('✅ Rameswaram chatbot initialization complete');
        } catch (error) {
            console.error('❌ Error during Rameswaram chatbot initialization:', error);
        }
    }
    
    setupEventListeners() {
        console.log('🔗 Setting up chatbot event listeners...');
        
        // Toggle chatbot
        const toggleBtn = document.getElementById('chatbotToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                console.log('🖱️ Chatbot toggle clicked');
                this.toggleChatbot();
            });
        } else {
            console.error('❌ chatbotToggle element not found');
        }
        
        // Close chatbot
        const closeBtn = document.getElementById('chatbotClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeChatbot();
            });
        }
        
        // Settings (Reset API Key)
        const settingsBtn = document.getElementById('chatbotSettings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.resetApiKey();
            });
        }
        
        // API key setup
        const saveBtn = document.getElementById('saveApiKey');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveApiKey();
            });
        }
        
        // Enter key for API key input
        const apiInput = document.getElementById('apiKeyInput');
        if (apiInput) {
            apiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveApiKey();
                }
            });
        }
        
        // Send message
        const sendBtn = document.getElementById('sendMessage');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        // Enter key for chat input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Quick question buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                const input = document.getElementById('chatInput');
                if (input) {
                    input.value = question;
                    this.sendMessage();
                }
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            const chatbot = document.getElementById('aiChatbot');
            if (chatbot && !chatbot.contains(e.target) && this.isOpen) {
                // Don't close if clicking on the toggle button
                if (!e.target.closest('#chatbotToggle')) {
                    this.closeChatbot();
                }
            }
        });
    }
    
    checkApiKey() {
        if (this.apiKey) {
            this.showChatInterface();
        } else {
            this.showApiKeySetup();
        }
    }
    
    saveApiKey() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = apiKeyInput.value.trim();
        
        console.log('💾 Attempting to save API key');
        
        if (!apiKey) {
            this.showNotification('Please enter your Gemini API key', 'error');
            return;
        }
        
        // Basic validation for Gemini API key format
        if (!apiKey.startsWith('AIza') || apiKey.length < 35) {
            console.error('❌ Invalid API key format');
            this.showNotification('Please enter a valid Gemini API key (should start with "AIza")', 'error');
            return;
        }
        
        this.apiKey = apiKey;
        localStorage.setItem('gemini_api_key_rameswaram', apiKey);
        console.log('✅ API key saved to localStorage');
        
        this.showNotification('API key saved successfully!', 'success');
        this.showChatInterface();
    }
    
    showApiKeySetup() {
        const setupDiv = document.getElementById('apiKeySetup');
        const messagesDiv = document.getElementById('chatMessages');
        const inputContainer = document.querySelector('.chat-input-container');
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendMessage');
        
        if (setupDiv) setupDiv.classList.remove('hidden');
        if (messagesDiv) messagesDiv.classList.remove('show');
        if (inputContainer) inputContainer.classList.remove('show');
        if (chatInput) chatInput.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
    }
    
    showChatInterface() {
        const setupDiv = document.getElementById('apiKeySetup');
        const messagesDiv = document.getElementById('chatMessages');
        const inputContainer = document.querySelector('.chat-input-container');
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendMessage');
        
        if (setupDiv) setupDiv.classList.add('hidden');
        if (messagesDiv) messagesDiv.classList.add('show');
        if (inputContainer) inputContainer.classList.add('show');
        if (chatInput) chatInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
    }
    
    toggleChatbot() {
        const window = document.getElementById('chatbotWindow');
        
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            if (window) window.classList.add('show');
            this.isOpen = true;
            
            // Focus on appropriate input
            setTimeout(() => {
                const setupDiv = document.getElementById('apiKeySetup');
                if (setupDiv && !setupDiv.classList.contains('hidden')) {
                    const apiInput = document.getElementById('apiKeyInput');
                    if (apiInput) apiInput.focus();
                } else {
                    const chatInput = document.getElementById('chatInput');
                    if (chatInput) chatInput.focus();
                }
            }, 300);
        }
    }
    
    closeChatbot() {
        const window = document.getElementById('chatbotWindow');
        if (window) window.classList.remove('show');
        this.isOpen = false;
    }
    
    resetApiKey() {
        if (confirm('Are you sure you want to reset your API key? You will need to enter it again.')) {
            localStorage.removeItem('gemini_api_key_rameswaram');
            this.apiKey = null;
            this.conversationHistory = [];
            this.showNotification('API key reset! Please enter your new key.', 'info');
            this.showApiKeySetup();
            
            // Clear chat messages except welcome
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                const messages = messagesContainer.querySelectorAll('.message:not(.welcome-message)');
                messages.forEach(msg => msg.remove());
            }
        }
    }
    
    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response
            this.addMessage(response, 'bot');
            
        } catch (error) {
            this.hideTypingIndicator();
            
            let errorMessage = "I apologize, but I'm having trouble connecting to my knowledge base. ";
            
            if (error.message.includes('API request failed: 400')) {
                errorMessage += "❌ **API Key Error**: Your API key appears to be invalid. Please click ⚙️ to reset.";
            } else if (error.message.includes('API request failed: 403')) {
                errorMessage += "🔒 **Access Denied**: Check your API key permissions.";
            } else if (error.message.includes('API request failed: 429')) {
                errorMessage += "⏰ **Rate Limited**: Please wait a moment and try again.";
            } else {
                errorMessage += "🔧 **Technical Issue**: " + error.message;
            }
            
            this.addMessage(errorMessage, 'bot');
            console.error('AI Response Error:', error);
        }
    }
    
    async getAIResponse(userMessage) {
        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });
        
        // Prepare the prompt with context
        const systemPrompt = this.knowledgeBase.context;
        const conversationContext = this.conversationHistory
            .slice(-6) // Keep last 6 messages for context
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');
            
        const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationContext}\n\nPlease respond naturally and helpfully as the Rameswaram Heritage Guide AI. Address what the user asked about with spiritual wisdom and detailed knowledge. Keep responses engaging and conversational (2-3 paragraphs when appropriate).`;
        
        // Call Gemini API
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        
        console.log('🌐 Calling Gemini API for Rameswaram');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 500,
                }
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Gemini API Error:', {
                status: response.status,
                error: errorText
            });
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Gemini API Response received');
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid API response format');
        }
        
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Add to conversation history
        this.conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });
        
        return aiResponse;
    }
    
    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 -8 72 72" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.11,8.25A7.54,7.54,0,0,0,19,6,11,11,0,0,0,15.6,4.31l-2.42-.57a2.78,2.78,0,0,0-.67,1.92c0,3,1.07,3.81,1.07,3.81h8.09A5.87,5.87,0,0,0,21.11,8.25Z"/>
                    <path d="M22.42,50.8a4.19,4.19,0,0,0,1-2.95V46h27a12.19,12.19,0,0,1-.14-1.88c0-9.08,7.85-22,7.85-32.31,0-8.26-7.85-9.3-7.85-9.3H16s6.14,1.48,7.56,7a9.11,9.11,0,0,1,.29,2.35C23.88,22.13,16,35.05,16,44.13a11.26,11.26,0,0,0,.49,3.41,7.25,7.25,0,0,0,1.27,2.39A5.51,5.51,0,0,0,19,51a3.2,3.2,0,0,0,1.47.59A2.39,2.39,0,0,0,22.42,50.8Z"/>
                    <path d="M25.28,47.85a6,6,0,0,1-1.51,4.2,7.42,7.42,0,0,1-3,1.43H55.42a3.7,3.7,0,0,0,2.89-1.64,6.59,6.59,0,0,0,1.18-4H25.28Z"/>
                </svg>
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(content)}</div>
                <div class="message-time">${currentTime}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    formatMessage(content) {
        // Format the message content with basic markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/🏛️|🕉️|💧|🙏|✨|🌊|📿|🎯|⏰|🕒|📸|🚗|🌅|💡|🔍|⚡|🌟|🎊|🎭/g, '<span style="font-size: 1.1em;">$&</span>');
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.classList.add('show');
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.classList.remove('show');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `chat-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? 'linear-gradient(135deg, #228B22, #32CD32)' : 
                        type === 'error' ? 'linear-gradient(135deg, #DC143C, #FF6347)' : 
                        'linear-gradient(135deg, #4169E1, #6495ED)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-family: 'Cinzel', serif;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            transform: translateY(-100px);
            opacity: 0;
            transition: all 0.4s ease;
            max-width: 300px;
            text-align: center;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.style.transform = 'translateY(-100px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }
}

// Initialize Rameswaram chatbot after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🕉️ Initializing Rameswaram Heritage Chatbot...');
    
    // Check if required elements exist
    const requiredElements = [
        'aiChatbot',
        'chatbotToggle',
        'chatbotClose',
        'chatbotSettings',
        'saveApiKey',
        'apiKeyInput',
        'sendMessage',
        'chatInput'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('❌ Missing chatbot elements:', missingElements);
        return;
    }
    
    console.log('✅ All chatbot elements found');
    
    // Initialize chatbot
    setTimeout(() => {
        try {
            const chatbot = new RameswaramHeritageGuideAI();
            console.log('✅ Rameswaram Heritage Guide AI initialized successfully');
            window.rameswaramAI = chatbot; // Make it globally accessible for debugging
        } catch (error) {
            console.error('❌ Failed to initialize Rameswaram chatbot:', error);
        }
    }, 1000);
});
