// Chettinad Heritage Site Interactive Features
// Consistent with Tamil Nadu heritage theme

// 3D Model Carousel Management
let currentModelIndex = 1;
const totalModels = 4;

function changeModel(direction) {
    const models = document.querySelectorAll('.model-container');
    const currentModelElement = document.querySelector('.model-container.active');
    
    // Remove active class from current model
    if (currentModelElement) {
        currentModelElement.classList.remove('active');
    }
    
    // Update model index
    currentModelIndex += direction;
    
    // Handle wrapping
    if (currentModelIndex > totalModels) {
        currentModelIndex = 1;
    } else if (currentModelIndex < 1) {
        currentModelIndex = totalModels;
    }
    
    // Show new model
    const newModelElement = document.querySelector(`[data-model="${currentModelIndex}"]`);
    if (newModelElement) {
        newModelElement.classList.add('active');
    }
    
    // Update counter
    updateModelCounter();
    
    // Add smooth transition effect
    console.log(`Changed to model ${currentModelIndex}`);
}

function updateModelCounter() {
    const currentModelSpan = document.getElementById('currentModel');
    const totalModelsSpan = document.getElementById('totalModels');
    
    if (currentModelSpan) {
        currentModelSpan.textContent = currentModelIndex;
    }
    if (totalModelsSpan) {
        totalModelsSpan.textContent = totalModels;
    }
}

// Initialize 3D model carousel
function initializeModelCarousel() {
    // Ensure first model is active
    const firstModel = document.querySelector('[data-model="1"]');
    if (firstModel) {
        firstModel.classList.add('active');
    }
    
    // Initialize counter
    updateModelCounter();
    
    console.log('3D Model carousel initialized');
}

// Gallery Navigation Functions (matching Mahabalipuram/Thanjavur)
function scrollGallery(direction) {
    console.log('=== scrollGallery called with direction:', direction, '===');
    
    // Try to find the scrollable container first
    const galleryContainer = document.querySelector('.gallery-scroll-container');
    const galleryTrack = document.getElementById('galleryTrack');
    
    console.log('Gallery container found:', galleryContainer);
    console.log('Gallery track found:', galleryTrack);
    
    const scrollElement = galleryContainer || galleryTrack;
    
    if (!scrollElement) {
        console.error('Gallery scroll element not found!');
        return;
    }
    
    console.log('Using scroll element:', scrollElement);
    console.log('Current scrollLeft:', scrollElement.scrollLeft);
    console.log('ScrollWidth:', scrollElement.scrollWidth);
    console.log('ClientWidth:', scrollElement.clientWidth);
    
    const cardWidth = 345; // Adjusted for actual card width + gap
    const scrollAmount = cardWidth * 2; // Scroll 2 cards at a time
    
    if (direction === 'left') {
        console.log('Scrolling left by', -scrollAmount);
        scrollElement.scrollLeft -= scrollAmount;
    } else if (direction === 'right') {
        console.log('Scrolling right by', scrollAmount);
        scrollElement.scrollLeft += scrollAmount;
    }
    
    // Log new position
    setTimeout(() => {
        console.log('New scrollLeft after scroll:', scrollElement.scrollLeft);
    }, 100);
}

// Image Modal Functions
function openImageModal(imageSrc, imageTitle) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeImageModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${imageTitle}</h3>
                    <button class="modal-close" onclick="closeImageModal()">×</button>
                </div>
                <div class="modal-body">
                    <img src="${imageSrc}" alt="${imageTitle}" class="modal-image">
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .image-modal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 10000; display: flex; align-items: center; justify-content: center;
            }
            .modal-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(5px);
            }
            .modal-content {
                position: relative; background: white; border-radius: 16px;
                max-width: 90vw; max-height: 90vh; overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .modal-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 20px 25px; background: linear-gradient(135deg, #8B4513, #DAA520); color: white;
            }
            .modal-header h3 { margin: 0; font-family: 'Cinzel', serif; font-size: 1.4rem; }
            .modal-close {
                background: none; border: none; color: white; font-size: 2rem; cursor: pointer;
                padding: 0; width: 40px; height: 40px; border-radius: 50%; transition: background 0.3s ease;
            }
            .modal-close:hover { background: rgba(255, 255, 255, 0.2); }
            .modal-body { padding: 0; text-align: center; }
            .modal-image { max-width: 100%; max-height: 70vh; object-fit: contain; display: block; }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

// Read More Function
function toggleReadMore(textId, button) {
    const textElement = document.getElementById(textId);
    if (!textElement) return;
    
    const isExpanded = textElement.classList.contains('expanded');
    
    if (isExpanded) {
        textElement.classList.remove('expanded');
        button.textContent = 'Read More';
        textElement.style.maxHeight = '3em';
        textElement.style.overflow = 'hidden';
    } else {
        textElement.classList.add('expanded');
        button.textContent = 'Read Less';
        textElement.style.maxHeight = 'none';
        textElement.style.overflow = 'visible';
    }
}

// NOTE: AI Chat functions are now handled by improved-chatbot.js
// No need for duplicate functions here

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

// AR Functionality
function launchAR() {
    // Simulate AR launch - in real implementation, this would integrate with AR libraries
    alert('AR Experience launching... Please point your device camera at Chettinad mansions for an immersive 3D experience!');
    
    // In a real implementation, you would integrate with libraries like:
    // - AR.js for web-based AR
    // - 8th Wall for advanced AR features
    // - Model Viewer for 3D model display
    console.log('AR functionality would launch here with 3D models of Chettinad mansion architecture');
}

// Storytelling Modal Functions
function openStorytellingModal() {
    openModal('storytellingModal');
}

function startStory(storyType) {
    const stories = {
        merchant: {
            title: "The Merchant Prince's Journey",
            content: `
                <div class="story-content">
                    <h4>From Humble Beginnings to Global Empire</h4>
                    <p>Young Alagappa Chettiar stood at the port of Rangoon, his first venture into foreign trade beginning. With just a small bag of silver coins and boundless ambition, he would build an empire that spanned from Burma to Ceylon, eventually returning home to construct a palace that would rival any maharaja's...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('merchant', 'journey')" class="story-choice-btn">Follow the Trading Journey</button>
                        <button onclick="continueStory('merchant', 'mansion')" class="story-choice-btn">Build the Dream Mansion</button>
                    </div>
                </div>
            `
        },
        architect: {
            title: "The Master Builder's Vision",
            content: `
                <div class="story-content">
                    <h4>Designing a Palace of Dreams</h4>
                    <p>Master architect Vishwakarma Sthapathi examined the imported Italian marble, Burmese teak, and Belgian glass. The Chettiar patron wanted a mansion that would blend Tamil traditions with the grandest European palaces he had seen in his travels. "Create something the world has never seen," were his instructions...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('architect', 'design')" class="story-choice-btn">Explore the Architectural Design</button>
                        <button onclick="continueStory('architect', 'construction')" class="story-choice-btn">Witness the Grand Construction</button>
                    </div>
                </div>
            `
        },
        family: {
            title: "Life in the Grand Mansion",
            content: `
                <div class="story-content">
                    <h4>The Golden Age of Joint Family Life</h4>
                    <p>The great mansion buzzed with activity as three generations of the Chettiar family lived under one ornate roof. In the women's quarters, silk sarees rustled as the matriarch organized the day's activities. Children's laughter echoed through marble corridors, while elders discussed business in the grand hall...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('family', 'daily')" class="story-choice-btn">Experience Daily Life</button>
                        <button onclick="continueStory('family', 'celebration')" class="story-choice-btn">Join a Grand Celebration</button>
                    </div>
                </div>
            `
        }
    };
    
    const story = stories[storyType];
    if (story) {
        const modalBody = document.querySelector('#storytellingModal .modal-body');
        modalBody.innerHTML = story.content;
    }
}

function continueStory(storyType, choice) {
    const storyParts = {
        merchant: {
            journey: `
                <div class="story-content">
                    <h4>Building an Empire Across the Seas</h4>
                    <p>From the bustling markets of Rangoon to the rubber plantations of Malaya, Alagappa Chettiar built a network of banks and trading houses. His reputation for honesty and shrewd business sense opened doors across Southeast Asia. Each successful venture brought him closer to his dream of building the grandest mansion in Chettinad.</p>
                    <p>Years of careful investment, strategic partnerships, and tireless work transformed the young trader into one of the wealthiest merchants in Asia, ready to return home and create his architectural legacy.</p>
                    <button onclick="openStorytellingModal()" class="story-choice-btn">Return to Stories</button>
                </div>
            `,
            mansion: `
                <div class="story-content">
                    <h4>The Palace Takes Shape</h4>
                    <p>Returning to Karaikudi with immense wealth, Alagappa Chettiar began his dream project. Italian marble was shipped across oceans, master craftsmen were brought from across India, and the finest materials money could buy were assembled. The mansion would have 96 rooms, multiple courtyards, and architectural details that would amaze visitors for generations.</p>
                    <p>Every pillar, every tile, every carved detail reflected not just wealth, but the cultural sophistication and global connections of the Chettiar community.</p>
                    <button onclick="openStorytellingModal()" class="story-choice-btn">Return to Stories</button>
                </div>
            `
        },
        architect: {
            design: `
                <div class="story-content">
                    <h4>Fusion of Traditions and Innovation</h4>
                    <p>The architect's vision was revolutionary: Tamil architectural principles would form the foundation, with European grandeur and Southeast Asian influences creating a unique synthesis. The central courtyard would follow traditional Tamil design, while the facades would incorporate colonial elements. Belgian stained glass would filter light into prayer halls designed according to ancient Vastu principles.</p>
                    <p>This architectural fusion would become the signature style of Chettinad mansions, influencing design across the region.</p>
                    <button onclick="openStorytellingModal()" class="story-choice-btn">Return to Stories</button>
                </div>
            `,
            construction: `
                <div class="story-content">
                    <h4>Craftsmanship Beyond Compare</h4>
                    <p>The construction became a marvel in itself. Master craftsmen from different traditions worked together: Tamil stone carvers, Burmese teak specialists, Italian marble workers, and local tile makers. The famous Athangudi tiles were created on-site, each one taking 21 days to complete with intricate geometric patterns.</p>
                    <p>The mansion rose like a dream made manifest, each room more spectacular than the last, creating a legacy that would inspire awe for centuries.</p>
                    <button onclick="openStorytellingModal()" class="story-choice-btn">Return to Stories</button>
                </div>
            `
        },
        family: {
            daily: `
                <div class="story-content">
                    <h4>Rhythms of Prosperity</h4>
                    <p>Dawn began with prayers in the family temple, followed by breakfast served on silver plates in the grand dining hall. The men discussed business ventures while women managed the household's complex operations. Children studied with private tutors in marble-floored classrooms, learning multiple languages and traditional arts.</p>
                    <p>Every aspect of daily life reflected the family's prosperity and cultural values, from the elaborate meals to the evening music performances in the courtyard.</p>
                    <button onclick="openStorytellingModal()" class="story-choice-btn">Return to Stories</button>
                </div>
            `,
            celebration: `
                <div class="story-content">
                    <h4>Festivals of Grandeur</h4>
                    <p>During Navarathri, the mansion transformed into a cultural palace. Classical musicians performed in the main hall, dancers graced the courtyards, and the entire building glowed with oil lamps and decorations. Hundreds of guests were welcomed with legendary Chettiar hospitality, served elaborate feasts on banana leaves placed on marble floors.</p>
                    <p>These celebrations showcased not just wealth, but the deep cultural traditions and generous spirit that defined the Chettiar community.</p>
                    <button onclick="openStorytellingModal()" class="story-choice-btn">Return to Stories</button>
                </div>
            `
        }
    };
    
    const storyPart = storyParts[storyType]?.[choice];
    if (storyPart) {
        const modalBody = document.querySelector('#storytellingModal .modal-body');
        modalBody.innerHTML = storyPart;
    }
}

// Blog Modal Functions
function openBlogModal() {
    openModal('blogModal');
}

function readFullBlog(blogType) {
    const blogs = {
        architecture: `
            <div class="blog-content">
                <h3>Architectural Fusion: East Meets West</h3>
                <p class="blog-meta">By Dr. Architecture Heritage Team | September 15, 2024</p>
                
                <p>The Chettinad mansions represent one of the most successful architectural fusions in Indian history, seamlessly blending Tamil traditions with European grandeur and Southeast Asian influences. This unique synthesis emerged from the global connections and cultural sophistication of the Nattukottai Chettiar community.</p>
                
                <h4>Tamil Foundations</h4>
                <p>At their core, Chettinad mansions follow traditional Tamil architectural principles. The central courtyard (nadu mittam) remains the heart of the home, providing natural ventilation and serving as the focal point for family activities. The layout respects Vastu Shastra principles, with specific areas designated for different functions according to ancient guidelines.</p>
                
                <h4>European Influences</h4>
                <p>The Chettiars' exposure to colonial architecture in Southeast Asia introduced European elements: grand facades with classical columns, ornate balconies with wrought iron work, and spacious halls designed for formal entertaining. These elements were adapted to suit tropical climate and Indian lifestyle needs.</p>
                
                <h4>Southeast Asian Adaptations</h4>
                <p>Years of living and working in Burma, Malaya, and Ceylon influenced design choices. Wide verandas for tropical living, elevated foundations for flood protection, and innovative ventilation systems all reflect practical adaptations learned from Southeast Asian architecture.</p>
                
                <h4>Material Innovation</h4>
                <p>The use of imported materials was revolutionary: Italian marble for floors, Burmese teak for pillars, Belgian glass for windows, and English steel for structural elements. These materials were combined with local expertise in stone carving and tile making to create something entirely new.</p>
                
                <button onclick="openBlogModal()" class="story-choice-btn">Back to Articles</button>
            </div>
        `,
        tiles: `
            <div class="blog-content">
                <h3>The Art of Athangudi Tiles</h3>
                <p class="blog-meta">By Master Craftsman R. Murugan | August 28, 2024</p>
                
                <p>The handmade Athangudi tiles found in Chettinad mansions represent a 150-year-old craft tradition that combines artistic excellence with practical functionality. Each tile is a work of art, requiring 21 days to complete and featuring geometric patterns that reflect both Indian and international design influences.</p>
                
                <h4>Traditional Technique</h4>
                <p>The process begins with a mixture of cement, sand, and natural pigments. The design is created using metal frames that separate different colored sections. The tiles are then pressed, cured, and polished by hand. The geometric patterns often incorporate motifs from Islamic, European, and traditional Tamil designs.</p>
                
                <h4>Cultural Significance</h4>
                <p>Different patterns held symbolic meanings: floral motifs represented prosperity, geometric designs suggested order and harmony, and certain colors were chosen for their auspicious qualities. The tiles served both practical and aesthetic purposes, providing cool flooring suitable for the tropical climate while creating stunning visual effects.</p>
                
                <h4>Modern Revival</h4>
                <p>Today, Athangudi tiles are experiencing a revival as architects and designers worldwide recognize their beauty and sustainability. The traditional techniques are being preserved and adapted for contemporary use, ensuring this ancient craft continues to thrive.</p>
                
                <h4>Preservation Challenges</h4>
                <p>The craft faces challenges from machine-made alternatives and the loss of traditional knowledge. Efforts are underway to document techniques, train new artisans, and create markets for authentic handmade tiles to ensure this heritage craft survives for future generations.</p>
                
                <button onclick="openBlogModal()" class="story-choice-btn">Back to Articles</button>
            </div>
        `,
        trade: `
            <div class="blog-content">
                <h3>Trading Routes and Cultural Exchange</h3>
                <p class="blog-meta">By Prof. Economic History Dept | July 20, 2024</p>
                
                <p>The magnificent Chettinad mansions are physical manifestations of one of history's most successful trading networks. The Nattukottai Chettiars built a financial empire that spanned from South India to Southeast Asia, and their architectural legacy reflects the cultural exchanges that occurred along these trading routes.</p>
                
                <h4>The Chettiar Network</h4>
                <p>By the early 20th century, Chettiar banks and trading houses operated in over 50 cities across Burma, Malaya, Ceylon, and French Indochina. They financed rice cultivation, rubber plantations, and tin mining, becoming indispensable to the colonial economy while maintaining their cultural identity and connections to their homeland.</p>
                
                <h4>Cultural Exchange</h4>
                <p>Living and working across diverse cultures exposed the Chettiars to different architectural styles, artistic traditions, and lifestyle practices. They absorbed these influences while maintaining their Tamil identity, creating a unique cosmopolitan culture that is reflected in their mansions' design and decoration.</p>
                
                <h4>Architectural Influence</h4>
                <p>The mansions showcase this cultural synthesis: Burmese teak pillars support Tamil-style roofs, European-style furniture fills rooms with traditional Tamil proportions, and international decorative elements complement local artistic traditions. Each mansion tells the story of global connections and cultural adaptation.</p>
                
                <h4>Economic Impact</h4>
                <p>The wealth generated by overseas trading transformed the Chettinad region. The construction of thousands of mansions provided employment for local artisans, stimulated traditional crafts, and created a unique architectural heritage that continues to attract visitors and researchers from around the world.</p>
                
                <button onclick="openBlogModal()" class="story-choice-btn">Back to Articles</button>
            </div>
        `
    };
    
    const blog = blogs[blogType];
    if (blog) {
        const modalBody = document.querySelector('#blogModal .modal-body');
        modalBody.innerHTML = blog;
    }
}

// Quiz Modal Functions
function openQuizModal() {
    openModal('quizModal');
}

// Variables for quiz functionality
let currentQuestion = 0;
let score = 0;

// Exclusive Chettinad Quiz Questions
let quizQuestions = [
    {
        question: "What are the traditional mansions of the Chettiars called?",
        options: ["Veedu", "Kavalan", "Bangla", "Nallukettu"],
        correct: 0,
        explanation: "The grand mansions of Chettinad are called 'Veedu', featuring elaborate courtyards, ornate pillars, and traditional architecture spanning several thousand square feet."
    },
    {
        question: "Which community built the magnificent palaces of Chettinad?",
        options: ["Chola merchants", "Nattukottai Chettiars", "Pandya traders", "Marwari businessmen"],
        correct: 1,
        explanation: "The Nattukottai Chettiars, a prosperous trading community, built these palatial homes in the 19th and early 20th centuries using wealth from their Southeast Asian trading empire."
    },
    {
        question: "What are the famous handmade tiles of Chettinad called?",
        options: ["Mysore tiles", "Athangudi tiles", "Kerala tiles", "Thanjavur tiles"],
        correct: 1,
        explanation: "Athangudi tiles are the famous handmade cement tiles of Chettinad, known for their vibrant colors, geometric patterns, and eco-friendly production methods."
    },
    {
        question: "How many rooms did the largest Chettiar mansions typically have?",
        options: ["50-75 rooms", "100-150 rooms", "200-250 rooms", "Over 300 rooms"],
        correct: 2,
        explanation: "The grandest Chettiar mansions had 200-250 rooms or more, with multiple courtyards, separate quarters for family and guests, and elaborate architectural details."
    },
    {
        question: "Which material was predominantly used for Chettinad mansion pillars?",
        options: ["Marble from Rajasthan", "Teak wood from Burma", "Local granite", "Sandstone from Gujarat"],
        correct: 1,
        explanation: "Teak wood imported from Burma (Myanmar) was extensively used for the ornate pillars, doors, and architectural elements, showcasing the Chettiars' international trade connections."
    },
    {
        question: "What is the central courtyard of a Chettiar mansion called?",
        options: ["Angalam", "Nadumuttam", "Thinnai", "Kottagai"],
        correct: 1,
        explanation: "The 'Nadumuttam' is the central courtyard that serves as the heart of the mansion, providing natural light, ventilation, and a gathering space for the family."
    },
    {
        question: "Which countries were primary centers of Chettiar trading empire?",
        options: ["Sri Lanka and Maldives", "Burma and Ceylon", "Indonesia and Thailand", "All Southeast Asian countries"],
        correct: 3,
        explanation: "Chettiars established a vast trading network across Burma, Ceylon, Malaya, Singapore, Indonesia, Thailand, and Vietnam, becoming the backbone of Southeast Asian finance."
    },
    {
        question: "What is unique about Chettinad mansion construction technique?",
        options: ["No iron nails used", "Built without foundation", "Only local materials", "Prefabricated design"],
        correct: 0,
        explanation: "Chettinad mansions were constructed using traditional techniques without iron nails, instead using interlocking wood joints, lime mortar, and innovative engineering methods."
    },
    {
        question: "Which architectural feature is most distinctive in Chettinad mansions?",
        options: ["Flat roofs", "Ornate wooden pillars and brackets", "Glass windows", "Iron gates"],
        correct: 1,
        explanation: "The elaborate wooden pillars with intricate carvings and decorative brackets are the most distinctive architectural features, showcasing exceptional craftsmanship and artistic detail."
    },
    {
        question: "What caused the decline of Chettinad's golden era?",
        options: ["Natural disasters", "World War II and independence", "Family disputes", "Government restrictions"],
        correct: 1,
        explanation: "World War II disrupted international trade routes, and post-independence nationalization policies in Southeast Asia led to the decline of the Chettiar trading empire and the golden era of Chettinad."
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
    let quote = "";
    let achievement = "";
    
    if (percentage >= 90) {
        achievement = "🏛️ Chettinad Master";
        message = "Outstanding! You possess the wisdom of ancient Chettiar merchants!";
        quote = "\"Like the master craftsmen who carved these palatial mansions, you have mastered the knowledge of Chettinad's golden heritage.\"";
    } else if (percentage >= 70) {
        achievement = "🎯 Heritage Scholar";
        message = "Excellent! The spirits of Nattukottai ancestors would be proud!";
        quote = "\"As the grand mansions stood testament to Chettiar prosperity, your knowledge stands strong in preserving our merchant legacy.\"";
    } else if (percentage >= 50) {
        achievement = "📚 Cultural Explorer";
        message = "Good effort! You're on the path of discovery!";
        quote = "\"Every pillar carved, every tile laid - continue your journey through the mansions of time to unlock more mysteries of Chettinad.\"";
    } else {
        achievement = "🌟 Curious Seeker";
        message = "Keep exploring! The ancient mansions await your return!";
        quote = "\"Even the grandest palaces began with a single brick. Your learning journey has just begun - return to discover the treasures of Chettinad heritage.\"";
    }
    
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div class="quiz-results">
            <div class="achievement-banner">
                <h3>${achievement}</h3>
            </div>
            <div class="score-showcase">
                <div class="score-circle">
                    <span class="score-percentage">${percentage}%</span>
                    <span class="score-label">Score</span>
                </div>
                <div class="score-details">
                    <div class="points-earned">
                        <span class="points-number">${score}</span>
                        <span class="points-total">/ ${quizQuestions.length}</span>
                        <div class="points-label">Points Earned</div>
                    </div>
                </div>
            </div>
            <div class="result-message">
                <h4>${message}</h4>
                <blockquote class="heritage-quote">
                    ${quote}
                </blockquote>
            </div>
            <div class="quiz-actions">
                <button onclick="startQuiz()" class="action-btn retake-btn">
                    <i class="icon">🔄</i> Retake Quiz
                </button>
                <button onclick="closeModal('quizModal')" class="action-btn close-btn">
                    <i class="icon">✨</i> Explore More
                </button>
            </div>
        </div>
    `;
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D model carousel
    initializeModelCarousel();
    
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.site-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
