// Thanjavur Heritage Site Interactive Features
// Consistent with Tamil Nadu heritage theme

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

// Helper: start a story and immediately request narration (used by Explore quick narrate)
function startAndNarrate(storyKey) {
    // Open modal and load story
    openStorytellingModal();
    // Small delay to ensure modal DOM is available
    setTimeout(() => {
        try {
            startStory(storyKey);
            // Ensure modal dataset updated by startStory before requesting narration
            setTimeout(() => {
                narrateStory();
            }, 250);
        } catch (err) {
            console.error('startAndNarrate error', err);
        }
    }, 200);
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
const totalCards = 6; // Total number of heritage cards for Thanjavur

function scrollGallery(direction) {
    const galleryTrack = document.getElementById('galleryTrack');
    const galleryContainer = document.querySelector('.gallery-scroll-container');
    if (!galleryTrack || !galleryContainer) return;
    
    // Get actual card element to calculate precise width
    const card = document.querySelector('.heritage-card');
    if (!card) return;
    
    const cardStyle = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth;
    const gap = 25; // gap from CSS
    const scrollAmount = cardWidth + gap;
    
    // Calculate max scroll positions
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    
    if (direction === 'left') {
        currentGalleryIndex = Math.max(0, currentGalleryIndex - 1);
    } else {
        currentGalleryIndex = Math.min(maxIndex, currentGalleryIndex + 1);
    }
    
    // Clamp to prevent over-scrolling
    currentGalleryIndex = Math.max(0, Math.min(maxIndex, currentGalleryIndex));
    
    const translateX = -(currentGalleryIndex * scrollAmount);
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
        <button class="modal-nav-btn left" aria-label="Previous image" title="Previous" onclick="prevModalImage()">‹</button>
        <button class="modal-nav-btn right" aria-label="Next image" title="Next" onclick="nextModalImage()">›</button>
    `;
    
    // Build gallery arrays (images + captions) from current gallery cards
    const cardImgs = Array.from(document.querySelectorAll('.heritage-card .card-image'));
    const galleryImages = cardImgs.map(img => img.src || img.getAttribute('src'));
    const galleryCaptions = cardImgs.map(img => img.alt || img.getAttribute('alt') || '');

    // Determine current index
    let currentIndex = galleryImages.indexOf(imageSrc);
    if (currentIndex === -1) {
        // If clicked image not in gallery (external), place it at start
        galleryImages.unshift(imageSrc);
        galleryCaptions.unshift(caption || '');
        currentIndex = 0;
    }

    // Attach gallery data to modal for navigation
    modal.dataset.gallery = JSON.stringify(galleryImages);
    modal.dataset.captions = JSON.stringify(galleryCaptions);
    modal.dataset.index = String(currentIndex);

    document.body.appendChild(modal);
    modal.style.display = 'block';
    // prevent background scroll
    document.body.style.overflow = 'hidden';

    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // Keyboard navigation (left/right/escape)
    function modalKeyHandler(e) {
        if (!document.querySelector('.image-modal')) return;
        if (e.key === 'Escape') {
            closeImageModal();
        } else if (e.key === 'ArrowLeft') {
            prevModalImage();
        } else if (e.key === 'ArrowRight') {
            nextModalImage();
        }
    }

    window.addEventListener('keydown', modalKeyHandler);

    // Store the handler so it can be removed on close
    modal._keyHandler = modalKeyHandler;
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        // remove key handler
        if (modal._keyHandler) window.removeEventListener('keydown', modal._keyHandler);
        document.body.style.overflow = 'auto';
        modal.style.display = 'none';
        modal.remove();
    }
}

// Navigate to next image inside modal
function nextModalImage() {
    const modal = document.querySelector('.image-modal');
    if (!modal) return;
    const gallery = JSON.parse(modal.dataset.gallery || '[]');
    const captions = JSON.parse(modal.dataset.captions || '[]');
    let idx = parseInt(modal.dataset.index || '0', 10);
    if (gallery.length === 0) return;
    idx = (idx + 1) % gallery.length;
    const imgEl = modal.querySelector('.modal-image');
    const capEl = modal.querySelector('.modal-caption');
    if (imgEl) imgEl.src = gallery[idx];
    if (capEl) capEl.textContent = captions[idx] || '';
    modal.dataset.index = String(idx);
}

// Navigate to previous image inside modal
function prevModalImage() {
    const modal = document.querySelector('.image-modal');
    if (!modal) return;
    const gallery = JSON.parse(modal.dataset.gallery || '[]');
    const captions = JSON.parse(modal.dataset.captions || '[]');
    let idx = parseInt(modal.dataset.index || '0', 10);
    if (gallery.length === 0) return;
    idx = (idx - 1 + gallery.length) % gallery.length;
    const imgEl = modal.querySelector('.modal-image');
    const capEl = modal.querySelector('.modal-caption');
    if (imgEl) imgEl.src = gallery[idx];
    if (capEl) capEl.textContent = captions[idx] || '';
    modal.dataset.index = String(idx);
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

function closePinMessage(pinMessageElement) {
    pinMessageElement.style.opacity = '0';
    pinMessageElement.style.visibility = 'hidden';
    pinMessageElement.style.transform = 'translateY(-20px)';
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
    
    // Adjust currentGalleryIndex to stay within bounds after resize
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    currentGalleryIndex = Math.min(currentGalleryIndex, maxIndex);
    
    // Update gallery position with accurate card width
    const galleryTrack = document.getElementById('galleryTrack');
    const card = document.querySelector('.heritage-card');
    if (galleryTrack && card) {
        const cardWidth = card.offsetWidth;
        const gap = 25;
        const scrollAmount = cardWidth + gap;
        const translateX = -(currentGalleryIndex * scrollAmount);
        galleryTrack.style.transform = `translateX(${translateX}px)`;
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
    alert('AR Experience launching... Please point your device camera at the monuments for an immersive 3D experience!');
    
    // In a real implementation, you would integrate with libraries like:
    // - AR.js for web-based AR
    // - 8th Wall for advanced AR features
    // - Model Viewer for 3D model display
    console.log('AR functionality would launch here with 3D models of Thanjavur monuments');
}

// Storytelling Modal Functions
function openStorytellingModal() {
    openModal('storytellingModal');
}

function startStory(storyType) {
    const stories = {
        tanjan: {
            title_en: "Anjan (Tanjan) Asura & The Name of Thanjavur",
            content_en: `
                <div class="story-content">
                    <h4>Anjan (Tanjan) Asura and the Origin of Thanjavur's Name</h4>
                    <p>The name "Thanjavur" is traditionally believed to come from the demon Tanjan (or Tanjan Asura), a figure in Hindu mythology who terrorized the region before being defeated by Lord Vishnu in his Neelamegha Perumal incarnation. According to legend, before his defeat, Tanjan requested that the place of his destruction be named after him, giving rise to the name Thanjavur. Alongside this mythological tale, there is also a historical belief that the name evolved from "Thananjay," a Mutharayar king who ruled the area around 575 CE. These dual origins highlight the rich blending of mythology and history that shapes Thanjavur's cultural identity.</p>
                    <p>This layered narrative reflects not only the divine and heroic stories of the region but also its grounding in actual royal legacies, making Thanjavur a place where legend and history intertwine.</p>
                </div>
            `,
            title_ta: "அஞ்சன் (தஞ்சன்) அசுரன் & தஞ்சாவூரின் பெயர்",
            content_ta: `
                <div class="story-content">
                    <h4>அஞ்சன் (தஞ்சன்) அசுரன் மற்றும் தஞ்சாவூரின் பெயர்க்காரணம்</h4>
                    <p>"தஞ்சாவூர்" என்ற பெயர் பாரம்பரியமாக தஞ்சன் (அல்லது தஞ்சன் அசுரன்) என்ற அரக்கனிடமிருந்து வந்ததாக நம்பப்படுகிறது. இந்து புராணங்களின்படி, நீலமேகப் பெருமாள் அவதாரத்தில் விஷ்ணுவால் தோற்கடிக்கப்படுவதற்கு முன்பு இப்பகுதியை அச்சுறுத்தியவர் இவர். புராணத்தின் படி, அவர் தோற்கடிக்கப்படுவதற்கு முன்பு, தான் அழிக்கப்பட்ட இடத்திற்கு தனது பெயரை சூட்ட வேண்டும் என்று தஞ்சன் வேண்டினார், இது தஞ்சாவூர் என்ற பெயரை உருவாக்கியது. இந்த புராணக் கதையுடன், கி.பி 575 இல் இப்பகுதியை ஆண்ட முத்தரையர் மன்னரான "தனஞ்சயன்" பெயரிலிருந்து இப்பெயர் உருவானது என்ற வரலாற்று நம்பிக்கையும் உள்ளது. இந்த இரட்டை தோற்றங்கள் தஞ்சாவூரின் கலாச்சார அடையாளத்தை வடிவமைக்கும் புராணம் மற்றும் வரலாற்றின் செழுமையான கலவையை எடுத்துக்காட்டுகின்றன.</p>
                    <p>இந்த அடுக்கு விவரிப்பு பிராந்தியத்தின் தெய்வீக மற்றும் வீரக் கதைகளை மட்டுமல்ல, உண்மையான அரச மரபுகளிலும் அதன் அடித்தளத்தை பிரதிபலிக்கிறது, இது தஞ்சாவூரை புராணமும் வரலாறும் பின்னிப்பிணைந்த இடமாக மாற்றுகிறது.</p>
                </div>
            `
        },
        brihadi: {
            title_en: "Brihadisvara Temple: Architecture & Festivals",
            content_en: `
                <div class="story-content">
                    <h4>Brihadisvara Temple: Architectural Marvel and Cultural Center</h4>
                    <p>Constructed circa 1010 CE by the Chola Emperor Rajaraja I, the Brihadisvara Temple is an iconic example of Chola architecture, renowned for its massive granite vimana that rises approximately 208 feet. The temple features a sanctum housing a colossal Shiva lingam and a massive Nandi bull carved from a single rock. Its design is a precise application of geometrical principles, including a rectangular courtyard, pillared verandahs, and multiple mandapams for congregational worship and cultural activities.</p>
                    <p>The temple actively continues to be a living cultural hub, hosting grand annual festivals such as Maha Shivratri and the Natyanjali dance festival, which celebrates classical dance forms in honor of Lord Shiva. Its intricate frescoes and inscriptions testify to the religious and artistic fervor of the Chola era, preserving centuries of heritage and devotion.</p>
                </div>
            `,
            title_ta: "பிரகதீஸ்வரர் கோவில்: கட்டிடக்கலை & திருவிழாக்கள்",
            content_ta: `
                <div class="story-content">
                    <h4>பிரகதீஸ்வரர் கோவில்: கட்டிடக்கலை அதிசயம் மற்றும் கலாச்சார மையம்</h4>
                    <p>கி.பி 1010 இல் சோழப் பேரரசர் ராஜராஜ சோழனால் கட்டப்பட்ட பிரகதீஸ்வரர் கோவில், சோழர் கட்டிடக்கலைக்கு ஒரு சிறந்த எடுத்துக்காட்டாகும். இது சுமார் 208 அடி உயரமுள்ள அதன் பிரம்மாண்டமான கிரானைட் விமானத்திற்கு பெயர் பெற்றது. இக்கோவிலில் ஒரு பெரிய சிவலிங்கம் மற்றும் ஒரே கல்லால் செதுக்கப்பட்ட பிரம்மாண்டமான நந்தி சிலை உள்ளது. செவ்வக முற்றம், தூண்கள் கொண்ட வராண்டாக்கள் மற்றும் வழிபாட்டிற்கான பல மண்டபங்கள் உள்ளிட்ட வடிவியல் கொள்கைகளின் துல்லியமான பயன்பாடாக இதன் வடிவமைப்பு உள்ளது.</p>
                    <p>மகா சிவராத்திரி மற்றும் நாட்டியாஞ்சலி நடனத் திருவிழா போன்ற பிரமாண்டமான வருடாந்திர விழாக்களை நடத்தும் இக்கோவில், இன்றும் ஒரு துடிப்பான கலாச்சார மையமாகத் திகழ்கிறது. இதன் நுணுக்கமான ஓவியங்கள் மற்றும் கல்வெட்டுகள் சோழர் காலத்தின் மத மற்றும் கலை ஆர்வத்திற்கு சான்றாக உள்ளன, பல நூற்றாண்டுகளின் பாரம்பரியத்தையும் பக்தியையும் பாதுகாக்கின்றன.</p>
                </div>
            `
        },
        saraswathi: {
            title_en: "Saraswathi Mahal Library: A Scholarly Treasure",
            content_en: `
                <div class="story-content">
                    <h4>Saraswathi Mahal Library: Custodian of Ancient Wisdom</h4>
                    <p>Located within the Thanjavur Palace, the Saraswathi Mahal Library stands as one of Asia’s oldest and most treasured repositories of knowledge. Founded initially by the Nayak rulers and significantly expanded by the Maratha king Serfoji II in the 18th and 19th centuries, the library houses nearly 50,000 manuscripts and 60,000 books in languages such as Tamil, Sanskrit, Marathi, and Telugu.</p>
                    <p>The collection includes rare palm-leaf manuscripts on subjects ranging from literature and music to Ayurveda and religious texts. One unique manuscript famously recounts the Ramayana forward and Krishna’s story in reverse. The library is a testament to the scholarly spirit fostered by Thanjavur’s royal patrons, preserving invaluable cultural and intellectual heritage for future generations.</p>
                </div>
            `,
            title_ta: "சரஸ்வதி மகால் நூலகம்: ஒரு அறிவார்ந்த பொக்கிஷம்",
            content_ta: `
                <div class="story-content">
                    <h4>சரஸ்வதி மகால் நூலகம்: பண்டைய ஞானத்தின் பாதுகாவலர்</h4>
                    <p>தஞ்சாவூர் அரண்மனைக்குள் அமைந்துள்ள சரஸ்வதி மகால் நூலகம், ஆசியாவின் பழமையான மற்றும் மிகவும் போற்றப்படும் அறிவு களஞ்சியங்களில் ஒன்றாகும். ஆரம்பத்தில் நாயக்க மன்னர்களால் நிறுவப்பட்டு, 18 மற்றும் 19 ஆம் நூற்றாண்டுகளில் மராட்டிய மன்னர் இரண்டாம் சரபோஜியால் விரிவுபடுத்தப்பட்டது. இந்நூலகத்தில் தமிழ், சமஸ்கிருதம், மராத்தி மற்றும் தெலுங்கு போன்ற மொழிகளில் கிட்டத்தட்ட 50,000 கையெழுத்துப் பிரதிகள் மற்றும் 60,000 புத்தகங்கள் உள்ளன.</p>
                    <p>இலக்கியம் மற்றும் இசை முதல் ஆயுர்வேதம் மற்றும் மத நூல்கள் வரையிலான அரிய பனை ஓலைச் சுவடிகள் இங்கு உள்ளன. ஒரு தனித்துவமான கையெழுத்துப் பிரதி ராமாயணத்தை நேராகவும், கிருஷ்ணரின் கதையை தலைகீழாகவும் விவரிக்கிறது. எதிர்கால சந்ததியினருக்காக விலைமதிப்பற்ற கலாச்சார மற்றும் அறிவுசார் பாரம்பரியத்தைப் பாதுகாக்கும் தஞ்சாவூரின் அரச புரவலர்களால் வளர்க்கப்பட்ட அறிவார்ந்த உணர்விற்கு இந்த நூலகம் ஒரு சான்றாகும்.</p>
                </div>
            `
        },
        artsdance: {
            title_en: "Tanjore Paintings & Bharatanatyam Origins",
            content_en: `
                <div class="story-content">
                    <h4>The Artistic Legacy of Tanjore Paintings and Bharatanatyam</h4>
                    <p>Thanjavur is celebrated as a foundational center for classical arts in South India, notably as the cradle of Bharatanatyam, a classical dance form that originated as Sadir Attam, performed in temple courtyards as part of worship rituals. This rich tradition nurtured devotional expression through movement and storytelling.</p>
                    <p>Complementing this, the region is famed worldwide for Tanjore paintings, an art style distinguished by vibrant colors, detailed gold leaf craftsmanship, and religious themes often illustrating Hindu deities and mythological scenes. Influenced by diverse styles, including Vijayanagara and Maratha, these paintings were traditionally commissioned by temples and royal patrons, symbolizing the cultural vitality and artistic excellence of Thanjavur. Both Bharatanatyam and Tanjore paintings remain vital expressions of Thanjavur's enduring cultural heritage.</p>
                </div>
            `,
            title_ta: "தஞ்சாவூர் ஓவியங்கள் & பரதநாட்டியத்தின் தோற்றம்",
            content_ta: `
                <div class="story-content">
                    <h4>தஞ்சாவூர் ஓவியங்கள் மற்றும் பரதநாட்டியத்தின் கலை மரபு</h4>
                    <p>தென்னிந்தியாவில் செவ்வியல் கலைகளுக்கான அடிப்படை மையமாக தஞ்சாவூர் கொண்டாடப்படுகிறது. குறிப்பாக கோவில் முற்றங்களில் வழிபாட்டுச் சடங்குகளின் ஒரு பகுதியாக நிகழ்த்தப்பட்ட சதிர் ஆட்டம் என்ற செவ்வியல் நடன வடிவமான பரதநாட்டியத்தின் தொட்டிலாக இது திகழ்கிறது. இந்த செழுமையான பாரம்பரியம் இயக்கம் மற்றும் கதைசொல்லல் மூலம் பக்தி வெளிப்பாட்டை வளர்த்தது.</p>
                    <p>இதற்கு இணையாக, துடிப்பான வண்ணங்கள், விரிவான தங்க இலை வேலைப்பாடுகள் மற்றும் இந்து தெய்வங்கள் மற்றும் புராணக் காட்சிகளை சித்தரிக்கும் மதக் கருப்பொருள்களால் வேறுபடும் தஞ்சாவூர் ஓவியங்களுக்கு இப்பகுதி உலகளவில் புகழ் பெற்றது. விஜயநகர மற்றும் மராட்டிய பாணிகள் உட்பட பல்வேறு பாணிகளால் ஈர்க்கப்பட்ட இந்த ஓவியங்கள் பாரம்பரியமாக கோவில்கள் மற்றும் அரச புரவலர்களால் நியமிக்கப்பட்டன. பரதநாட்டியம் மற்றும் தஞ்சாவூர் ஓவியங்கள் இரண்டும் தஞ்சாவூரின் நீடித்த கலாச்சார பாரம்பரியத்தின் முக்கிய வெளிப்பாடுகளாகத் திகழ்கின்றன.</p>
                </div>
            `
        }
    };
    
    // Ensure we have a cached copy of the story-selection HTML so we can return to it
    if (!window._thanjavur_story_options_html) {
        const initialBody = document.querySelector('#storytellingModal .modal-body');
        if (initialBody) window._thanjavur_story_options_html = initialBody.innerHTML;
    }

    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (stories[storyType] && modalBody) {
        // Determine initial language
        const lang = _selectedNarrationLanguage || 'ta';
        const content = (lang === 'ta') ? stories[storyType].content_ta : stories[storyType].content_en;
        const title = (lang === 'ta') ? stories[storyType].title_ta : stories[storyType].title_en;

        modalBody.innerHTML = content;

        // Add a "Back to Stories" button so users can return to the selection
        const backText = (lang === 'ta') ? "← கதைகளுக்குத் திரும்பு" : "← Back to Stories";
        const backBtnHtml = `<div class="story-back-wrapper"><button class="action-btn secondary-btn back-to-stories" onclick="showStorySelection()">${backText}</button></div>`;
        modalBody.insertAdjacentHTML('afterbegin', backBtnHtml);

        // Store current story metadata on the modal for later narration
        const modal = document.getElementById('storytellingModal');
        if (modal) {
            modal.dataset.currentStoryKey = storyType; // Store key to allow re-rendering on language change
            modal.dataset.currentStoryTitle = title;
            modal.dataset.currentStoryHtml = content;
        }

        // Add Narrate controls (generate & play) below the story — include language + voice selectors
        const controlsHtml = `
            <div class="story-narration-controls">
                <label for="narrationLanguage" class="voice-label">Language:</label>
                <select id="narrationLanguage" class="quick-narrate-select">
                    <option value="ta" ${lang === 'ta' ? 'selected' : ''}>தமிழ் (Tamil)</option>
                    <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
                </select>
                <label for="voiceSelect" class="voice-label">Voice:</label>
                <select id="voiceSelect" class="quick-narrate-select"><option>Loading voices...</option></select>
                <button class="action-btn primary-btn" onclick="narrateStory()">🔊 Narrate this story (AI)</button>
                <button class="action-btn secondary-btn" onclick="narrateOriginal()">🔈 Narrate Original</button>
                <button class="action-btn" id="playNarrationBtn" onclick="playNarration()" disabled>Play</button>
                <button class="action-btn" id="pauseNarrationBtn" onclick="pauseNarration()" disabled>Pause</button>
                <button class="action-btn" id="stopNarrationBtn" onclick="stopNarration()" disabled>Stop</button>
                <div id="narrationSpinner">Generating...</div>
                <div id="voiceAvailability" class="voice-availability" aria-live="polite" style="margin-top:8px;font-size:0.95rem;color:#f0e6d6"></div>
                <div id="voiceMismatchWarning" class="voice-mismatch-warning" aria-live="polite" style="margin-top:6px;font-size:0.9rem;color:#ffcc66;display:none"></div>
            </div>
            <div id="narrationText"></div>
        `;

        modalBody.insertAdjacentHTML('beforeend', controlsHtml);
        // Ensure voice list and language selector populate for the newly-inserted controls
        try { populateVoiceList(); } catch (e) {}
        try { populateNarrationLanguageSelector(); } catch (e) {}
    }
}

// Voice management for SpeechSynthesis
let _selectedVoiceName = localStorage.getItem('thanjavur_voice') || null;
// Persisted narration language: 'en' (English) or 'ta' (Tamil)
let _selectedNarrationLanguage = localStorage.getItem('thanjavur_narration_lang') || 'ta';

function populateVoiceList() {
    const select = document.getElementById('voiceSelect');
    if (!select) return;

    const voices = speechSynthesis.getVoices();
    if (!voices || !voices.length) return;

    // Clear existing
    select.innerHTML = '';

    voices.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.lang})${v.default ? ' — default' : ''}`;
        // store language on option to help selection logic
        try { opt.dataset.lang = v.lang || ''; } catch (e) {}
        select.appendChild(opt);
    });

    // Pick stored voice if available
    if (_selectedVoiceName && Array.from(select.options).some(o => o.value === _selectedVoiceName)) {
        select.value = _selectedVoiceName;
    } else {
        // Try a reasonable preferred voice names (common on Chrome/Edge/macOS/Windows)
        const preferredNames = [/Google US English/i, /Microsoft Zira/i, /Zira/i, /Samantha/i, /Alex/i, /Daniel/i, /Karen/i];
        const preferred = voices.find(v => preferredNames.some(rx => rx.test(v.name)) || /en-?us|en-?gb|en-?au/i.test(v.lang));
        if (preferred) select.value = preferred.name;
    }

    select.addEventListener('change', () => {
        _selectedVoiceName = select.value;
        try { localStorage.setItem('thanjavur_voice', _selectedVoiceName); } catch (e) {}
    });

    // After populating voices, update availability indicator and mismatch warning
    try { updateVoiceAvailabilityIndicator(); } catch (e) {}
}

// Populate voices on load, and when voiceschanged event fires
window.addEventListener('DOMContentLoaded', () => {
    // Try to populate immediately
    setTimeout(populateVoiceList, 100);
    // Also attempt to initialize narration language selector if present
    setTimeout(() => {
        try { populateNarrationLanguageSelector(); } catch (e) {}
    }, 120);
});
if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = function() {
        try { populateVoiceList(); } catch (e) {}
    };

// Populate and wire narration language selector (English / Tamil)
function populateNarrationLanguageSelector() {
    const langSelect = document.getElementById('narrationLanguage');
    if (!langSelect) return;

    // Set stored value if exists
    try {
        if (_selectedNarrationLanguage && Array.from(langSelect.options).some(o => o.value === _selectedNarrationLanguage)) {
            langSelect.value = _selectedNarrationLanguage;
        } else {
            langSelect.value = _selectedNarrationLanguage || 'en';
        }
    } catch (e) {}

    langSelect.addEventListener('change', () => {
        _selectedNarrationLanguage = langSelect.value;
        try { localStorage.setItem('thanjavur_narration_lang', _selectedNarrationLanguage); } catch (e) {}
        // Update availability / mismatch display when language changes
        try { updateVoiceAvailabilityIndicator(); } catch (e) {}
        try { updateVoiceMismatchWarning(); } catch (e) {}

        // If a story is currently open, re-render it in the new language
        const modal = document.getElementById('storytellingModal');
        if (modal && modal.style.display === 'block' && modal.dataset.currentStoryKey) {
            startStory(modal.dataset.currentStoryKey);
        }
    });
}

// Check whether browser has voices for the selected language (simple prefix match)
function updateVoiceAvailabilityIndicator() {
    const indicator = document.getElementById('voiceAvailability');
    const lang = _selectedNarrationLanguage || 'en';
    if (!indicator) return;

    const voices = speechSynthesis.getVoices() || [];
    const lower = lang === 'ta' ? 'ta' : 'en';
    const matches = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(lower));

    if (matches.length > 0) {
        indicator.textContent = `Voice availability: ${matches.length} ${lang === 'ta' ? 'Tamil' : 'English'} voice(s) available on your browser/device.`;
        indicator.style.color = '#DAA520';
    } else {
        indicator.textContent = `No ${lang === 'ta' ? 'Tamil' : 'English'} voices detected in your browser. Playback may use an English voice or default fallback which can sound unnatural.`;
        indicator.style.color = '#ffcc66';
    }
}

// Show warning when the selected voice language doesn't match the narration language
function updateVoiceMismatchWarning() {
    const warningEl = document.getElementById('voiceMismatchWarning');
    if (!warningEl) return;

    const voiceSelect = document.getElementById('voiceSelect');
    if (!voiceSelect) { warningEl.style.display = 'none'; return; }

    const selectedOpt = voiceSelect.options[voiceSelect.selectedIndex];
    const voiceLang = (selectedOpt && selectedOpt.dataset && selectedOpt.dataset.lang) ? selectedOpt.dataset.lang.toLowerCase() : '';
    const requestedLang = (_selectedNarrationLanguage === 'ta') ? 'ta' : 'en';

    // If no language metadata, hide warning
    if (!voiceLang) {
        warningEl.style.display = 'none';
        return;
    }

    if (!voiceLang.startsWith(requestedLang)) {
        warningEl.textContent = 'Warning: The selected voice language does not match the chosen narration language; pronunciation may be poor. Consider selecting a voice that matches the language or enable server-side TTS.';
        warningEl.style.display = 'block';
    } else {
        warningEl.style.display = 'none';
    }
}
}

// Restore the original story selection grid inside the storytelling modal
function showStorySelection() {
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (!modalBody) return;
    if (window._thanjavur_story_options_html) {
        modalBody.innerHTML = window._thanjavur_story_options_html;
    } else {
        // Fallback: reconstruct simple options if cached HTML isn't available
        modalBody.innerHTML = `
            <div class="story-options">
                <div class="story-card" onclick="startStory('tanjan')">
                    <h4>அஞ்சன் (தஞ்சன்) அசுரன் & தஞ்சாவூரின் பெயர்</h4>
                    <p>"தஞ்சாவூர்" என்ற பெயரின் புராண தோற்றம் மற்றும் தஞ்சன் அசுரனின் கதை.</p>
                </div>
                <div class="story-card" onclick="startStory('brihadi')">
                    <h4>பிரகதீஸ்வரர்: கட்டிடக்கலை & திருவிழாக்கள்</h4>
                    <p>கோவிலின் கட்டிடக்கலை, சடங்குகள் மற்றும் மரபுகளை உயிர்ப்புடன் வைத்திருக்கும் திருவிழாக்களை ஆராயுங்கள்.</p>
                </div>
                <div class="story-card" onclick="startStory('saraswathi')">
                    <h4>சரஸ்வதி மகால் நூலகம்</h4>
                    <p>அரச நூலகத்தில் பாதுகாக்கப்பட்டுள்ள அறிவார்ந்த பொக்கிஷங்கள் மற்றும் கையெழுத்துப் பிரதிகளை கண்டறியுங்கள்.</p>
                </div>
                <div class="story-card" onclick="startStory('artsdance')">
                    <h4>தஞ்சாவூர் ஓவியங்கள் & பரதநாட்டியம்</h4>
                    <p>தஞ்சாவூர் எவ்வாறு செவ்வியல் நடனத்தையும், நகரத்தின் பெயரால் அழைக்கப்படும் புகழ்பெற்ற ஓவிய பாணியையும் வடிவமைத்தது என்பதை அறியுங்கள்.</p>
                </div>
            </div>
        `;
    }
}

// Narrate the original story text (no AI) — uses the exact HTML content provided in the story and plays via SpeechSynthesis
function narrateOriginal() {
    const modal = document.getElementById('storytellingModal');
    if (!modal) return;
    const html = modal.dataset.currentStoryHtml || '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const plain = tmp.innerText.trim();

    _currentNarrationText = plain;
    const textEl = document.getElementById('narrationText');
    if (textEl) textEl.textContent = _currentNarrationText;

    // Enable playback controls and auto-start
    const playBtn = document.getElementById('playNarrationBtn');
    const pauseBtn = document.getElementById('pauseNarrationBtn');
    const stopBtn = document.getElementById('stopNarrationBtn');
    if (playBtn) playBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;

    // Ensure spinner hidden for original narration
    const spinner = document.getElementById('narrationSpinner');
    if (spinner) spinner.style.display = 'none';

    playNarration();
}

// --- AI Narration Integration ---
let _currentUtterance = null;
let _currentNarrationText = '';

// Request AI-generated narration from the server. Passes the desired language ('en' or 'ta').
async function requestNarrationFromServer(title, content, language = 'en') {
    try {
        const resp = await fetch('/api/chatbot/narrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, language })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.message || 'Narration request failed');
        return data.narration || '';
    } catch (err) {
        console.error('Narration request failed', err);
        throw err;
    }
}

async function narrateStory() {
    const modal = document.getElementById('storytellingModal');
    if (!modal) return;
    const title = modal.dataset.currentStoryTitle || 'Heritage Story';
    const html = modal.dataset.currentStoryHtml || '';

    // Extract plain text from HTML content
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const plain = tmp.innerText.trim();

    const spinner = document.getElementById('narrationSpinner');
    const playBtn = document.getElementById('playNarrationBtn');
    const pauseBtn = document.getElementById('pauseNarrationBtn');
    const stopBtn = document.getElementById('stopNarrationBtn');
    const textEl = document.getElementById('narrationText');

    if (spinner) spinner.style.display = 'inline-block';
    try {
    const narration = await requestNarrationFromServer(title, plain, _selectedNarrationLanguage);
        _currentNarrationText = narration || '';
        if (textEl) textEl.textContent = _currentNarrationText;

        // Enable playback controls
        if (playBtn) playBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;

        // Auto-start speaking
        playNarration();
    } catch (err) {
        if (textEl) textEl.textContent = 'Unable to generate narration. Please try again later.';
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

function playNarration() {
    if (!_currentNarrationText) return;
    // If already speaking, resume
    if (speechSynthesis.speaking && speechSynthesis.paused) {
        speechSynthesis.resume();
        document.getElementById('pauseNarrationBtn').disabled = false;
        return;
    }

    // Cancel any existing utterance
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    const utter = new SpeechSynthesisUtterance(_currentNarrationText);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    // Prefer a natural voice if available
    const voices = speechSynthesis.getVoices();
    if (voices && voices.length) {
        // Set utterance.lang according to user selection to help the browser pick appropriate pronunciation
        if (_selectedNarrationLanguage === 'ta') {
            utter.lang = 'ta-IN';
        } else {
            utter.lang = 'en-US';
        }
        // If user selected voice, prefer that
        if (_selectedVoiceName) {
            const userVoice = voices.find(v => v.name === _selectedVoiceName);
            if (userVoice) utter.voice = userVoice;
        }

        // Otherwise attempt to pick an English regional voice (fallback to first)
        if (!utter.voice) {
            // Prefer a voice that matches the requested language
            const langPrefix = _selectedNarrationLanguage === 'ta' ? 'ta' : 'en';
            const preferred = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix)) || voices.find(v => /Google US English|Microsoft Zira|Alex|Samantha|Daniel/i.test(v.name)) || voices[0];
            if (preferred) utter.voice = preferred;
        }
    }
    utter.onend = () => {
        document.getElementById('pauseNarrationBtn').disabled = true;
        document.getElementById('playNarrationBtn').disabled = false;
    };
    utter.onerror = (e) => {
        console.error('TTS error', e);
    };

    _currentUtterance = utter;
    speechSynthesis.speak(utter);
    document.getElementById('playNarrationBtn').disabled = true;
    document.getElementById('pauseNarrationBtn').disabled = false;
}

function pauseNarration() {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        document.getElementById('pauseNarrationBtn').disabled = true;
        document.getElementById('playNarrationBtn').disabled = false;
    }
}

function stopNarration() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    document.getElementById('pauseNarrationBtn').disabled = true;
    document.getElementById('playNarrationBtn').disabled = false;
}

function continueStory(character, choice) {
    const continuations = {
        // Remaining story continuations
    };
    
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (modalBody) {
        const text = (continuations[character] && continuations[character][choice]) ? continuations[character][choice] : 'The story continues with events lost to time — explore other tales in the collection.';
        modalBody.innerHTML = `
            <div class="story-continuation">
                <h4>Story Continues...</h4>
                <p>${text}</p>
                <button onclick="showStorySelection()" class="story-choice-btn">Return to Stories</button>
                <button onclick="closeModal('storytellingModal')" class="story-choice-btn">End Story</button>
            </div>
        `;
    }
}

// Blog Modal Functions
function openBlogModal() {
    openModal('blogModal');
    // Reset to show all articles
    const modalBody = document.querySelector('#blogModal .modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="blog-posts">
                <div class="blog-disclaimer">
                    <h4>📚 Selected Authoritative Articles on Brihadeesvara Temple</h4>
                    <p>Below are curated links to reputable sources about the Brihadeesvara / Brihadeeswarar Temple. Click "Read Summary & Source" to view a short summary and open the original article.</p>
                </div>

                <article class="blog-post">
                    <div class="post-category">Encyclopedia / Reference</div>
                    <h4>Brihadisvara Temple — Wikipedia</h4>
                    <p class="post-meta">Source: Wikipedia</p>
                    <p class="post-excerpt">An extensive overview covering the temple’s history, architecture, inscriptions, festivals and its designation as part of the Great Living Chola Temples UNESCO listing.</p>
                    <button class="read-more-btn" onclick="openExternalArticle('https://en.wikipedia.org/wiki/Brihadisvara_Temple', 'Wikipedia')">Read Full Original Article</button>
                </article>

                <article class="blog-post">
                    <div class="post-category">Official Tourism</div>
                    <h4>Brihadeeswara Temple — Tamil Nadu Tourism</h4>
                    <p class="post-meta">Source: Tamil Nadu Tourism Department</p>
                    <p class="post-excerpt">Official tourism page highlighting architectural features such as the towering vimana, monolithic Nandi, rock art and the temple’s importance as one of the Great Living Chola Temples.</p>
                    <button class="read-more-btn" onclick="openExternalArticle('https://www.tamilnadutourism.tn.gov.in/destinations/brihadeeswara-temple', 'Tamil Nadu Tourism')">Read Full Original Article</button>
                </article>

                <article class="blog-post">
                    <div class="post-category">Encyclopedic</div>
                    <h4>Brihadishvara Temple — Britannica</h4>
                    <p class="post-meta">Source: Encyclopedia Britannica</p>
                    <p class="post-excerpt">A concise, authoritative article focusing on the temple’s construction history, patronage of Rajaraja I and its lasting cultural significance.</p>
                    <button class="read-more-btn" onclick="openExternalArticle('https://www.britannica.com/place/Brihadishvara-temple', 'Encyclopedia Britannica')">Read Full Original Article</button>
                </article>

                <article class="blog-post">
                    <div class="post-category">Heritage Essay</div>
                    <h4>The Brihadeshwara Temple — Peepul Tree / GodsCollections</h4>
                    <p class="post-meta">Source: GodsCollections (Peepul Tree case study)</p>
                    <p class="post-excerpt">An illustrated case-study describing the temple’s historical background, construction techniques and the economic prosperity that enabled its creation.</p>
                    <button class="read-more-btn" onclick="openExternalArticle('https://www.godscollections.org/case-studies/the-brihadeshwara-temple-thanjavur', 'Peepul Tree / GodsCollections')">Read Full Original Article</button>
                </article>

                <article class="blog-post">
                    <div class="post-category">Travel / Feature</div>
                    <h4>Thanjavur Should Be On Every Culture Traveller's Itinerary — NDTV Travel</h4>
                    <p class="post-meta">Source: NDTV Travel</p>
                    <p class="post-excerpt">A travel feature celebrating the temple’s architectural feats, including granite transport and the massive capstone; a good practical read for visitors.</p>
                    <button class="read-more-btn" onclick="openExternalArticle('https://www.ndtv.com/travel/thanjavur-should-be-on-every-culture-travellers-itinerary-heres-why-9101683', 'NDTV Travel')">Read Full Original Article</button>
                </article>

            </div>
        `;
    }
}

function openExternalArticle(url, source) {
    // Show confirmation dialog
    const confirmed = confirm(`You are about to visit the original article from ${source}. This will open in a new tab.\n\nProceed to external source?`);
    
    if (confirmed) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

function shareArticleSummary(articleType) {
    const articles = {
        shore: "Shore Temple: A Marvel of Pallava Architecture - ASI Official Documentation",
        unesco: "Group of Monuments at Mahabalipuram - UNESCO World Heritage Centre", 
        pallava: "The Pallava Dynasty and Mahabalipuram's Legacy - Encyclopedia Britannica",
        conservation: "Conservation of Mahabalipuram Monuments - Current Science Journal",
        sculpture: "Rock-cut Sculptures of Mahabalipuram - Journal of Archaeological Science"
    };
    
    const articleTitle = articles[articleType];
    const shareUrl = `${window.location.origin}${window.location.pathname}?article=${articleType}`;
    
    // Update browser URL without reload
    window.history.pushState({article: articleType}, articleTitle, shareUrl);
    
    if (navigator.share) {
        navigator.share({
            title: articleTitle,
            text: `Explore authentic heritage research: ${articleTitle}`,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showLinkCopiedMessage(shareUrl);
        }).catch(() => {
            prompt('Copy this link to share:', shareUrl);
        });
    }
}

function shareArticle(articleType) {
    const articles = {
        shore: "New Discoveries at Shore Temple - Mahabalipuram Heritage",
        architecture: "Pallava Architectural Evolution - Mahabalipuram Heritage", 
        pagodas: "The Seven Pagodas Mystery - Mahabalipuram Heritage",
        conservation: "Preserving Heritage for Future Generations - Mahabalipuram Heritage",
        sculpture: "Masterpieces in Stone: Pallava Sculpture - Mahabalipuram Heritage"
    };
    
    const articleTitle = articles[articleType];
    const shareUrl = `${window.location.origin}${window.location.pathname}?article=${articleType}`;
    
    // Update browser URL without reload
    window.history.pushState({article: articleType}, articleTitle, shareUrl);
    
    if (navigator.share) {
        navigator.share({
            title: articleTitle,
            text: `Explore the fascinating heritage of Thanjavur: ${articleTitle}`,
            url: shareUrl
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `Check out this article: ${articleTitle}\n${shareUrl}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            showLinkCopiedMessage(shareUrl);
        }).catch(() => {
            // Final fallback
            prompt('Copy this link to share:', shareUrl);
        });
    }
}

function showLinkCopiedMessage(url) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'link-copied-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🔗</span>
            <div class="notification-text">
                <strong>Article link copied!</strong>
                <div class="copied-url">${url}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

function getArticleUrl(articleType) {
    return `${window.location.origin}${window.location.pathname}?article=${articleType}`;
}

function copyArticleUrl(articleType) {
    const url = getArticleUrl(articleType);
    const urlInput = document.querySelector('.article-url-input');
    
    if (urlInput) {
        urlInput.select();
        urlInput.setSelectionRange(0, 99999); // For mobile devices
    }
    
    navigator.clipboard.writeText(url).then(() => {
        showLinkCopiedMessage(url);
        
        // Temporarily change button text
        const copyBtn = document.querySelector('.copy-url-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, #228B22, #32CD32)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(() => {
        // Fallback
        prompt('Copy this article link:', url);
    });
}

// Check for article parameter on page load
function checkArticleParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleParam = urlParams.get('article');
    
    if (articleParam) {
        // Small delay to ensure page is loaded
        setTimeout(() => {
            openModal('blogModal');
            readFullBlog(articleParam);
        }, 500);
    }
}

// Initialize article parameter checking when page loads
document.addEventListener('DOMContentLoaded', checkArticleParameter);

function readFullBlog(articleType) {
    const articles = {
        shore: {
            title: "Shore Temple: A Marvel of Pallava Architecture",
            source: "Archaeological Survey of India",
            author: "ASI Heritage Division",
            date: "2023",
            readTime: "Original Article",
            category: "UNESCO World Heritage",
            externalLink: "https://asi.nic.in/shore-temple-mahabalipuram/",
            summary: `
                <div class="article-hero">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%23DAA520' width='400' height='200'/><text x='200' y='100' font-family='serif' font-size='24' fill='white' text-anchor='middle'>Shore Temple - ASI</text></svg>" alt="Shore Temple ASI" class="article-image" />
                </div>
                
                <h4>🏛️ Official Archaeological Survey of India Documentation</h4>
                <p class="lead-paragraph">The Shore Temple at Mahabalipuram, built during the reign of Narasimhavarman II (700-728 CE), stands as one of the oldest structural temples in South India. This UNESCO World Heritage Site represents the culmination of Pallava architectural achievements.</p>
                
                <h5>🏗️ Architectural Significance</h5>
                <p>The temple complex consists of three shrines, with the main temple facing east towards the Bay of Bengal. The structure demonstrates the transition from rock-cut to free-standing stone architecture, featuring:</p>
                <ul>
                    <li><strong>Structural Innovation:</strong> First of its kind in Dravidian architecture</li>
                    <li><strong>Twin Towers:</strong> Two sanctums dedicated to Lord Shiva</li>
                    <li><strong>Coastal Engineering:</strong> Built to withstand marine erosion</li>
                    <li><strong>Sculptural Excellence:</strong> Intricate carvings depicting Pallava artistry</li>
                </ul>
                
                <h5>🌊 Conservation Challenges</h5>
                <p>The ASI has documented significant conservation challenges including salt crystallization, coastal erosion, and environmental pollution. Ongoing preservation efforts include bio-rock technology and controlled access measures.</p>
                
                <blockquote class="heritage-quote">
                    "The Shore Temple stands as a testament to the Pallava dynasty's architectural genius and their mastery over stone construction techniques." - Archaeological Survey of India
                </blockquote>
                
                <div class="source-attribution">
                    <p><strong>Source:</strong> Archaeological Survey of India - Official Heritage Documentation</p>
                    <p><strong>Authority:</strong> Government of India, Ministry of Culture</p>
                </div>
            `,
            relatedArticles: ['unesco', 'pallava', 'conservation']
        },
        // --- Added authoritative Brihadeesvara articles requested by user ---
        wiki_brihadisvara: {
            title: "Brihadisvara Temple — Wikipedia",
            source: "Wikipedia",
            author: "Wikipedia contributors",
            date: "Updated regularly",
            readTime: "Original Article",
            category: "Reference",
            externalLink: "https://en.wikipedia.org/wiki/Brihadisvara_Temple",
            summary: `
                <div class="article-hero">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%234169E1' width='400' height='200'/><text x='200' y='100' font-family='serif' font-size='18' fill='white' text-anchor='middle'>Wikipedia: Brihadisvara Temple</text></svg>" alt="Wikipedia Brihadisvara" class="article-image" />
                </div>
                <h4>📝 Encyclopedic Overview</h4>
                <p class="lead-paragraph">This Wikipedia entry provides a broad, well-cited overview of the Brihadisvara (Brihadeeswarar) Temple: its history, architecture, inscriptions, festivals and its inclusion among the Great Living Chola Temples listed by UNESCO.</p>
                <p>The article is useful for quick reference, containing links to primary sources, archaeological findings and further reading sections for researchers and visitors alike.</p>
                <div class="source-attribution">
                    <p><strong>Source:</strong> Wikipedia</p>
                </div>
            `,
            relatedArticles: ['brihadeeswarar']
        },
        tn_tourism_brihadeeswarar: {
            title: "Brihadeeswara Temple — Tamil Nadu Tourism",
            source: "Tamil Nadu Tourism",
            author: "Tamil Nadu Tourism Department",
            date: "Official Page",
            readTime: "Original Article",
            category: "Official Tourism",
            externalLink: "https://www.tamilnadutourism.tn.gov.in/destinations/brihadeeswara-temple",
            summary: `
                <div class="article-hero">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%238B4513' width='400' height='200'/><text x='200' y='100' font-family='serif' font-size='18' fill='white' text-anchor='middle'>Tamil Nadu Tourism</text></svg>" alt="Tamil Nadu Tourism Brihadeeswarar" class="article-image" />
                </div>
                <h4>🏛️ Official Tourism Overview</h4>
                <p class="lead-paragraph">The Tamil Nadu Tourism page highlights the temple’s architectural highlights — the towering vimana, the monolithic Nandi, detailed rock work and the temple’s role as a cultural and pilgrimage center.</p>
                <p>This official source is practical for visitors and emphasizes the temple’s significance within the Great Living Chola Temples.</p>
                <div class="source-attribution">
                    <p><strong>Source:</strong> Tamil Nadu Tourism Department</p>
                </div>
            `,
            relatedArticles: ['brihadeeswarar']
        },
        britannica_brihadi: {
            title: "Brihadishvara Temple — Britannica",
            source: "Encyclopedia Britannica",
            author: "Encyclopedia Britannica",
            date: "Updated",
            readTime: "Original Article",
            category: "Encyclopedic",
            externalLink: "https://www.britannica.com/place/Brihadishvara-temple",
            summary: `
                <div class="article-hero">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%233C3C3C' width='400' height='200'/><text x='200' y='100' font-family='serif' font-size='18' fill='white' text-anchor='middle'>Britannica: Brihadishvara</text></svg>" alt="Britannica Brihadishvara" class="article-image" />
                </div>
                <h4>🔎 Scholarly Summary</h4>
                <p class="lead-paragraph">Britannica provides a concise, authoritative account of the temple’s construction under Rajaraja I, the likely architects involved and its cultural-historical importance.</p>
                <div class="source-attribution">
                    <p><strong>Source:</strong> Encyclopedia Britannica</p>
                </div>
            `,
            relatedArticles: ['brihadeeswarar']
        },
        peepul_brihadeshwara: {
            title: "The Brihadeshwara Temple — Peepul Tree / GodsCollections",
            source: "GodsCollections / Peepul Tree",
            author: "Peepul Tree",
            date: "Case Study",
            readTime: "Original Article",
            category: "Heritage Essay",
            externalLink: "https://www.godscollections.org/case-studies/the-brihadeshwara-temple-thanjavur",
            summary: `
                <div class="article-hero">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%23CD5C5C' width='400' height='200'/><text x='200' y='100' font-family='serif' font-size='16' fill='white' text-anchor='middle'>Peepul Tree Case Study</text></svg>" alt="Peepul Brihadeshwara" class="article-image" />
                </div>
                <h4>📜 Historical & Economic Context</h4>
                <p class="lead-paragraph">A focused case-study describing the temple's historical background, construction methods, and the Chola empire’s economic strength that enabled such monumental works.</p>
                <div class="source-attribution">
                    <p><strong>Source:</strong> GodsCollections / Peepul Tree</p>
                </div>
            `,
            relatedArticles: ['brihadeeswarar']
        },
        ndtv_thanjavur: {
            title: "Thanjavur Should Be On Every Culture Traveller's Itinerary — NDTV Travel",
            source: "NDTV Travel",
            author: "NDTV Travel",
            date: "Feature",
            readTime: "Original Article",
            category: "Travel",
            externalLink: "https://www.ndtv.com/travel/thanjavur-should-be-on-every-culture-travellers-itinerary-heres-why-9101683",
            summary: `
                <div class="article-hero">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%23339966' width='400' height='200'/><text x='200' y='100' font-family='serif' font-size='16' fill='white' text-anchor='middle'>NDTV Travel</text></svg>" alt="NDTV Thanjavur" class="article-image" />
                </div>
                <h4>✈️ Travel Feature</h4>
                <p class="lead-paragraph">A traveller-oriented feature highlighting architectural feats, logistics and reasons to visit Thanjavur, including details about moving massive granite blocks and the large capstone.</p>
                <div class="source-attribution">
                    <p><strong>Source:</strong> NDTV Travel</p>
                </div>
            `,
            relatedArticles: ['brihadeeswarar']
        },
        unesco: {
            title: "Group of Monuments at Mahabalipuram - World Heritage Site",
            source: "UNESCO World Heritage Centre",
            author: "UNESCO WHC",
            date: "2023",
            readTime: "Original Article",
            category: "World Heritage",
            externalLink: "https://whc.unesco.org/en/list/249/",
            summary: `
                <div class="article-hero">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%234169E1' width='400' height='200'/><text x='200' y='100' font-family='serif' font-size='18' fill='white' text-anchor='middle'>UNESCO World Heritage</text></svg>" alt="UNESCO World Heritage" class="article-image" />
                </div>
                
                <h4>🌍 UNESCO World Heritage Site Official Recognition</h4>
                <p class="lead-paragraph">Inscribed on the World Heritage List in 1984, the Group of Monuments at Mahabalipuram represents exceptional testimony to Pallava art and architecture of the 7th and 8th centuries CE.</p>
                
                <h5>📜 Outstanding Universal Value</h5>
                <p>UNESCO recognizes Mahabalipuram for its outstanding universal value based on:</p>
                <ul>
                    <li><strong>Criterion (i):</strong> Masterpiece of human creative genius in rock-cut architecture</li>
                    <li><strong>Criterion (ii):</strong> Important interchange of human values in architectural development</li>
                    <li><strong>Criterion (iii):</strong> Exceptional testimony to Pallava civilization</li>
                    <li><strong>Criterion (vi):</strong> Associated with Hindu religious and cultural traditions</li>
                </ul>
                
                <h5>🛡️ Protection and Management</h5>
                <p>The site is protected under the Ancient Monuments and Archaeological Sites and Remains Act (1958) and managed by the Archaeological Survey of India with UNESCO oversight.</p>
                
                <blockquote class="heritage-quote">
                    "The monuments constitute a unique artistic achievement and testimony to the Pallava civilization." - UNESCO World Heritage Committee
                </blockquote>
                
                <div class="source-attribution">
                    <p><strong>Source:</strong> UNESCO World Heritage Centre</p>
                    <p><strong>Authority:</strong> United Nations Educational, Scientific and Cultural Organization</p>
                </div>
            `,
            relatedArticles: ['shore', 'pallava', 'conservation']
        },
        pallava: {
            title: "The Pallava Dynasty and Mahabalipuram's Architectural Legacy",
            source: "Britannica Encyclopedia",
            author: "Encyclopedia Britannica",
            date: "2024",
            readTime: "Original Article",
            category: "Historical Research",
            externalLink: "https://www.britannica.com/topic/Pallava-dynasty",
            summary: `
                <div class="article-hero">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%238B4513' width='400' height='200'/><text x='200' y='100' font-family='serif' font-size='20' fill='white' text-anchor='middle'>Pallava Dynasty</text></svg>" alt="Pallava Dynasty" class="article-image" />
                </div>
                
                <h4>👑 The Pallava Dynasty: Architects of South Indian Heritage</h4>
                <p class="lead-paragraph">The Pallava dynasty (3rd-9th centuries CE) established Mahabalipuram as their major seaport and architectural laboratory, creating monuments that would influence South Indian temple architecture for centuries.</p>
                
                <h5>🏛️ Architectural Innovation Phases</h5>
                <p>Pallava architectural development at Mahabalipuram occurred in distinct phases:</p>
                <ul>
                    <li><strong>Mahendravarman I (600-630 CE):</strong> Initiated rock-cut cave temples</li>
                    <li><strong>Narasimhavarman I (630-668 CE):</strong> Created the great relief and rathas</li>
                    <li><strong>Narasimhavarman II (700-728 CE):</strong> Built the Shore Temple complex</li>
                </ul>
                
                <h5>🌊 Maritime Significance</h5>
                <p>Mahabalipuram served as the principal Pallava port, facilitating trade with Southeast Asia and cultural exchange that influenced architectural styles across the region.</p>
                
                <blockquote class="heritage-quote">
                    "The Pallavas transformed Mahabalipuram into a showcase of their architectural genius, experimenting with styles that would define South Indian temple architecture." - Encyclopedia Britannica
                </blockquote>
                
                <div class="source-attribution">
                    <p><strong>Source:</strong> Encyclopedia Britannica</p>
                    <p><strong>Authority:</strong> Peer-reviewed historical encyclopedia</p>
                </div>
            `,
            relatedArticles: ['shore', 'unesco', 'conservation']
        },
        conservation: {
            title: "Conservation of Mahabalipuram Monuments",
            source: "Current Science Journal",
            author: "Indian Academy of Sciences",
            date: "2022",
            readTime: "Original Article",
            category: "Scientific Research",
            externalLink: "https://www.currentscience.ac.in/",
            summary: `
                <div class="article-hero">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%23228B22' width='400' height='200'/><text x='200' y='100' font-family='serif' font-size='20' fill='white' text-anchor='middle'>Scientific Conservation</text></svg>" alt="Conservation Research" class="article-image" />
                </div>
                
                <h4>🔬 Scientific Approaches to Heritage Conservation</h4>
                <p class="lead-paragraph">Recent scientific studies published in Current Science journal document advanced conservation methodologies being employed to protect Mahabalipuram's monuments from environmental and anthropogenic threats.</p>
                
                <h5>⚠️ Primary Conservation Challenges</h5>
                <p>Scientific research has identified critical threats to monument preservation:</p>
                <ul>
                    <li><strong>Salt Crystallization:</strong> Marine aerosols causing stone deterioration</li>
                    <li><strong>Coastal Erosion:</strong> Sea level rise affecting Shore Temple foundation</li>
                    <li><strong>Biodeterioration:</strong> Microbial and algal growth on stone surfaces</li>
                    <li><strong>Tourism Impact:</strong> Visitor pressure affecting monument stability</li>
                </ul>
                
                <h5>🛡️ Modern Conservation Techniques</h5>
                <p>Advanced scientific methods being employed include chemical consolidation, laser cleaning, and environmental monitoring systems.</p>
                
                <blockquote class="heritage-quote">
                    "Interdisciplinary scientific approaches are essential for the long-term preservation of these irreplaceable cultural monuments." - Current Science Journal
                </blockquote>
                
                <div class="source-attribution">
                    <p><strong>Source:</strong> Current Science - Indian Academy of Sciences</p>
                    <p><strong>Authority:</strong> Peer-reviewed scientific journal</p>
                </div>
            `,
            relatedArticles: ['shore', 'unesco', 'pallava']
        },
        sculpture: {
            title: "Rock-cut Sculptures of Mahabalipuram",
            source: "Journal of Archaeological Science",
            author: "Academic Research",
            date: "2023",
            readTime: "Original Article",
            category: "Art History",
            externalLink: "https://www.journals.elsevier.com/journal-of-archaeological-science",
            summary: `
                <div class="article-hero">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%23CD853F' width='400' height='200'/><text x='200' y='100' font-family='serif' font-size='18' fill='white' text-anchor='middle'>Archaeological Research</text></svg>" alt="Archaeological Research" class="article-image" />
                </div>
                
                <h4>🎨 Archaeological Analysis of Mahabalipuram Sculptures</h4>
                <p class="lead-paragraph">Recent archaeological studies published in the Journal of Archaeological Science provide detailed analysis of the sculptural techniques and iconographic programs at Mahabalipuram's monuments.</p>
                
                <h5>🔍 Sculptural Analysis</h5>
                <p>Archaeological research has documented the sophisticated techniques employed:</p>
                <ul>
                    <li><strong>Descent of the Ganges:</strong> Largest bas-relief sculpture in the world (27m x 9m)</li>
                    <li><strong>Technical Innovation:</strong> Use of natural rock fissures as compositional elements</li>
                    <li><strong>Iconographic Program:</strong> Complex mythological narratives in stone</li>
                    <li><strong>Tool Technology:</strong> Evidence of advanced chiseling techniques</li>
                </ul>
                
                <h5>📐 Scientific Documentation</h5>
                <p>Modern documentation techniques including 3D scanning and photogrammetry are creating comprehensive digital archives for research and conservation.</p>
                
                <blockquote class="heritage-quote">
                    "The sculptures of Mahabalipuram represent a pinnacle of artistic and technical achievement in Indian rock-cut art." - Journal of Archaeological Science
                </blockquote>
                
                <div class="source-attribution">
                    <p><strong>Source:</strong> Journal of Archaeological Science</p>
                    <p><strong>Authority:</strong> Elsevier peer-reviewed academic journal</p>
                </div>
            `,
            relatedArticles: ['shore', 'pallava', 'unesco']
        }
    };
    
    const modalBody = document.querySelector('#blogModal .modal-body');
    if (articles[articleType] && modalBody) {
        const article = articles[articleType];
        const relatedArticlesHtml = article.relatedArticles.map(relatedType => {
            const relatedArticle = articles[relatedType];
            if (relatedArticle) {
                return `
                    <div class="related-article" onclick="readFullBlog('${relatedType}')">
                        <h6>${relatedArticle.title}</h6>
                        <p class="related-meta">${relatedArticle.category} • ${relatedArticle.source}</p>
                    </div>
                `;
            }
            return '';
        }).join('');
        
        modalBody.innerHTML = `
            <div class="full-article">
                <div class="article-header">
                    <div class="article-meta-bar">
                        <span class="article-category">${article.category}</span>
                        <span class="read-time">📖 ${article.readTime}</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p class="article-meta">Source: ${article.source} | ${article.date}</p>
                    <div class="article-source-bar">
                        <div class="source-info">
                            <span class="source-label">📚 Summary from authentic source</span>
                        </div>
                    </div>
                </div>
                <div class="article-content">
                    ${article.summary}
                </div>
                <div class="article-footer">
                    <div class="external-link-section">
                        <div class="external-link-card">
                            <h4>📖 Want to read the full original article?</h4>
                            <p>This is a summary of authentic research. Click below to read the complete article from the original source.</p>
                            <button onclick="openExternalArticle('${article.externalLink}', '${article.source}')" class="read-original-btn">
                                🔗 Read Full Original Article at ${article.source}
                            </button>
                        </div>
                    </div>
                    <div class="related-articles-section">
                        <h4>📚 Related Authentic Articles</h4>
                        <div class="related-articles-grid">
                            ${relatedArticlesHtml}
                        </div>
                    </div>
                    <div class="article-actions">
                        <button onclick="openBlogModal()" class="back-to-blog-btn">← Back to All Articles</button>
                        <button onclick="shareArticleSummary('${articleType}')" class="share-btn">🔗 Share Summary</button>
                    </div>
                </div>
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
// Thanjavur-specific quiz questions
let quizQuestions = [
    {
        question: "Which Chola king built the magnificent Brihadeeswarar Temple in Thanjavur?",
        options: ["Rajendra Chola I", "Raja Raja Chola I", "Rajaraja Chola II", "Kulottunga Chola I"],
        correct: 1,
        explanation: "Raja Raja Chola I built the Brihadeeswarar Temple in 1010 CE, marking the pinnacle of Chola architecture."
    },
    {
        question: "What is the height of the Brihadeeswarar Temple's main tower (vimana)?",
        options: ["180 feet", "200 feet", "216 feet", "250 feet"],
        correct: 2,
        explanation: "The temple's main tower stands at 216 feet, making it one of the tallest temple towers in the world."
    },
    {
        question: "What is the weight of the granite capstone (Kumbam) at the top of the temple?",
        options: ["60 tons", "80 tons", "100 tons", "120 tons"],
        correct: 1,
        explanation: "The massive granite capstone weighs approximately 80 tons and was placed using a 6.4 km long ramp."
    },
    {
        question: "In which year was the Brihadeeswarar Temple designated as a UNESCO World Heritage Site?",
        options: ["1985", "1987", "1989", "1991"],
        correct: 1,
        explanation: "The Brihadeeswarar Temple was designated as a UNESCO World Heritage Site in 1987 as part of the 'Great Living Chola Temples'."
    },
    {
        question: "What unique phenomenon occurs with the temple's shadow at noon?",
        options: ["It points north", "It disappears completely", "It never falls on the ground", "It forms a perfect circle"],
        correct: 2,
        explanation: "Due to its unique architectural design, the temple's shadow never falls on the ground at noon."
    },
    {
        question: "Thanjavur is famous for which traditional art form?",
        options: ["Tanjore paintings", "Kalamkari", "Pattachitra", "Warli painting"],
        correct: 0,
        explanation: "Thanjavur is the birthplace of Tanjore paintings, characterized by rich colors, surface richness, and compact composition."
    },
    {
        question: "What was the original name of Thanjavur during the Chola period?",
        options: ["Tanjapuri", "Thanjaipuri", "Dakshina Meru", "Rajarajapuram"],
        correct: 2,
        explanation: "Thanjavur was originally called 'Dakshina Meru' (Southern Meru) during the Chola period."
    },
    {
        question: "Which dynasty ruled Thanjavur after the Cholas?",
        options: ["Pandyas", "Pallavas", "Vijayanagara Empire", "Nayaks"],
        correct: 3,
        explanation: "The Nayak dynasty ruled Thanjavur after the Cholas, contributing significantly to art and architecture."
    },
    {
        question: "The Brihadeeswarar Temple is dedicated to which deity?",
        options: ["Vishnu", "Shiva", "Brahma", "Murugan"],
        correct: 1,
        explanation: "The Brihadeeswarar Temple is dedicated to Lord Shiva and houses one of the largest Shiva lingams in India."
    },
    {
        question: "Which material was primarily used in the construction of the Brihadeeswarar Temple?",
        options: ["Sandstone", "Marble", "Granite", "Limestone"],
        correct: 2,
        explanation: "The entire temple is built using granite blocks, showcasing the advanced engineering skills of the Chola period."
    },
    {
        question: "Thanjavur was historically known as the 'Rice Bowl' of which region?",
        options: ["Tamil Nadu", "South India", "Deccan Plateau", "Kaveri Delta"],
        correct: 1,
        explanation: "Thanjavur was known as the 'Rice Bowl of South India' due to its fertile lands and excellent irrigation system."
    },
    {
        question: "Which European power established a significant presence in Thanjavur?",
        options: ["Portuguese", "Dutch", "British", "French"],
        correct: 1,
        explanation: "The Dutch established a significant presence in Thanjavur and had considerable influence during their period."
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
        achievement = "🏛️ Chola Empire Master";
        message = "Outstanding! You possess the wisdom of royal architects!";
        quote = "\"Like the skilled Chola craftsmen who built the magnificent Brihadeeswarar Temple, you have mastered the knowledge of Thanjavur's imperial heritage.\"";
    } else if (percentage >= 70) {
        achievement = "🎯 Heritage Scholar";
        message = "Excellent! Raja Raja Chola would be proud of your wisdom!";
        quote = "\"As the great temple towers majestically over Thanjavur, your knowledge stands strong in preserving our royal legacy.\"";
    } else if (percentage >= 50) {
        achievement = "📚 Cultural Explorer";
        message = "Good effort! You're on the path to royal enlightenment!";
        quote = "\"Every bronze cast, every granite carved - continue your journey through the royal corridors of Chola heritage to unlock more mysteries.\"";
    } else {
        achievement = "🌟 Curious Seeker";
        message = "Keep exploring! The ancient Chola treasures await your return!";
        quote = "\"Even the mightiest vimana began with a single foundation stone. Your learning journey has just begun - return to discover the royal treasures of Thanjavur.\"";
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

// Floating Elements Animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
}

// Complete Manuscript Background Management
function adjustManuscriptHeight() {
    const body = document.body;
    const contentHeight = body.scrollHeight;
    
    // Ensure manuscript covers all content with new SVG sizes
    body.style.setProperty('--manuscript-height', contentHeight + 'px');
    
    // Dynamically adjust the middle section repeat (accounting for 150px top + 150px bottom)
    const middleSection = window.getComputedStyle(body, '::after');
    body.style.setProperty('--middle-repeat-height', Math.max(contentHeight - 300, 500) + 'px');
}

// Initialize manuscript height adjustment
document.addEventListener('DOMContentLoaded', function() {
    adjustManuscriptHeight();
    
    // Readjust on window resize
    window.addEventListener('resize', adjustManuscriptHeight);
    
    // Initialize scroll reveal
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
    
    // Initialize floating elements
    initFloatingElements();
    
    // Add glow effect to important elements
    const glowElements = document.querySelectorAll('.site-title, .timeline-year');
    glowElements.forEach(element => {
        element.classList.add('glow');
    });
    
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
    
    // Initialize gallery navigation
    updateGalleryNavButtons();
    
    // Add event listeners for gallery navigation buttons
    const prevGalleryBtn = document.querySelector('.prev-gallery');
    const nextGalleryBtn = document.querySelector('.next-gallery');
    
    if (prevGalleryBtn) {
        prevGalleryBtn.addEventListener('click', () => scrollGallery('left'));
    }
    
    if (nextGalleryBtn) {
        nextGalleryBtn.addEventListener('click', () => scrollGallery('right'));
    }
    
    // Add touch/swipe support for gallery
    const galleryTrack = document.getElementById('galleryTrack');
    if (galleryTrack) {
        galleryTrack.addEventListener('touchstart', handleGalleryTouchStart, { passive: true });
        galleryTrack.addEventListener('touchmove', handleGalleryTouchMove, { passive: true });
        galleryTrack.addEventListener('touchend', handleGalleryTouchEnd, { passive: true });
    }
    
    // Update cards per view on resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        if (width <= 768) {
            cardsPerView = 1;
        } else if (width <= 1024) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }
        updateGalleryNavButtons();
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

// Add CSS classes for quiz styling
const quizStyles = `
    .quiz-progress {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }
    
    .progress-bar {
        flex: 1;
        height: 10px;
        background-color: rgba(139, 69, 19, 0.2);
        border-radius: 5px;
        margin-left: 20px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
        border-radius: 5px;
        transition: width 0.5s ease;
    }
    
    .quiz-options {
        display: grid;
        gap: 15px;
        margin: 25px 0;
    }
    
    .quiz-option {
        padding: 15px 20px;
        border: 2px solid var(--accent-color);
        background: rgba(248, 244, 235, 0.9);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
        font-size: 1rem;
    }
    
    .quiz-option:hover:not(:disabled) {
        background: var(--gradient-secondary);
        transform: translateX(5px);
    }
    
    .quiz-option.correct {
        background: #4CAF50;
        color: white;
        border-color: #45a049;
    }
    
    .quiz-option.incorrect {
        background: #f44336;
        color: white;
        border-color: #d32f2f;
    }
    
    .quiz-explanation {
        background: rgba(218, 165, 32, 0.1);
        padding: 20px;
        border-radius: 10px;
        margin-top: 20px;
        border-left: 4px solid var(--secondary-color);
    }
    
    .next-question-btn {
        background: var(--gradient-primary);
        color: var(--text-light);
        border: none;
        padding: 10px 25px;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 15px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .score-circle {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: var(--gradient-primary);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto 20px;
        color: var(--text-light);
        font-size: 2rem;
        font-weight: bold;
        border: 5px solid var(--secondary-color);
        box-shadow: 0 10px 30px var(--shadow-color);
    }
`;

// Inject quiz styles
const styleSheet = document.createElement('style');
styleSheet.textContent = quizStyles;
document.head.appendChild(styleSheet);

// 3D Model Carousel Functionality
let currentModelIndex = 0;
const totalModels = 3;

function updateCarousel() {
    // Update model cards
    const cards = document.querySelectorAll('.model-card');
    const currentModelSpan = document.getElementById('currentModel');
    
    cards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentModelIndex) {
            card.classList.add('active');
        }
    });
    
    // Update counter
    if (currentModelSpan) {
        currentModelSpan.textContent = currentModelIndex + 1;
    }
}

function switchModel(direction) {
    if (direction === 'next') {
        currentModelIndex = (currentModelIndex + 1) % totalModels;
    } else if (direction === 'prev') {
        currentModelIndex = (currentModelIndex - 1 + totalModels) % totalModels;
    }
    updateCarousel();
}

function nextModel() {
    switchModel('next');
}

function previousModel() {
    switchModel('prev');
}

function goToSlide(slideNumber) {
    currentModelIndex = slideNumber - 1;
    updateCarousel();
}

// Auto-play carousel (optional)
function startAutoPlay() {
    setInterval(() => {
        // Only auto-advance if user isn't interacting
        if (!document.querySelector('.carousel-container:hover')) {
            nextModel();
        }
    }, 10000); // Change every 10 seconds
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        switchModel('prev');
    } else if (e.key === 'ArrowRight') {
        switchModel('next');
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleTouch() {
    const carouselTrack = document.querySelector('.carousel-track');
    if (!carouselTrack) return;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                switchModel('next'); // Swipe left - next model
            } else {
                switchModel('prev'); // Swipe right - previous model
            }
        }
    }
}

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCarousel();
    handleTouch();
    initializeHeritageGallery(); // Initialize the heritage gallery
    // Uncomment the next line if you want auto-play
    // startAutoPlay();
});

// ============================================
// OLD CHATBOT CODE REMOVED
// Now using Professional Heritage Chatbot System (professional-chatbot.js + backend API)
// See: thanjavur-chatbot-init.js for the new initialization
// ============================================

/*
// ============================================
// OLD CHATBOT CODE COMPLETELY REMOVED
// ============================================
// The old HeritageGuideAI class (approximately 520 lines) has been removed.
// 
// NEW SYSTEM:
// 1. professional-chatbot.js - Universal frontend chatbot client
// 2. backend/routes/chatbot.js - Secure backend API with Dr. Thornbury persona  
// 3. thanjavur-chatbot-init.js - Site-specific initialization with Thanjavur knowledge
//
// OLD CODE REMOVED: Lines 1316-1852 (HeritageGuideAI class definition)
// ============================================
*/

// ============================================
// Old HeritageGuideAI class removed (520+ lines)
// Replaced with Professional Heritage Chatbot System
// ============================================

// (Old HeritageGuideAI class body removed - approximately 515 lines deleted) specializing in Thanjavur, the Cultural Capital of Tamil Nadu, India. You are the dedicated guardian of Chola heritage and wisdom. You should respond naturally to ANY question the user asks, while being especially enthusiastic about Thanjavur's magnificent heritage.

// [Old HeritageGuideAI class code removed - 515 lines]

// ============================================
// OLD CHATBOT INITIALIZATION CODE - ALSO REMOVED
// Now using Professional Heritage Chatbot System (professional-chatbot.js)
// ============================================
/*
// Initialize chatbot after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 Initializing Thanjavur Heritage Chatbot v2.5 (gemini-1.5-flash)...');
    
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
    
    // Initialize chatbot after a short delay to ensure all other components are loaded
    setTimeout(() => {
        try {
            const chatbot = new HeritageGuideAI();
            console.log('✅ Heritage Guide AI initialized successfully');
            window.heritageAI = chatbot; // Make it globally accessible for debugging
        } catch (error) {
            console.error('❌ Failed to initialize chatbot:', error);
        }
    }, 1000);
    
    // Add click handler for tour preview
    const tourPreview = document.querySelector('.tour-preview');
    if (tourPreview) {
        tourPreview.addEventListener('click', function() {
            window.open('https://www.tamilnadutourism.tn.gov.in/virtualtour-pkg/thanjavur/index.html', '_blank');
        });
    }
});
*/

// Copy virtual tour link function
function copyTourLink() {
    const tourUrl = "https://www.tamilnadutourism.tn.gov.in/virtualtour-pkg/thanjavur/index.html";
    
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(tourUrl).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyTextToClipboard(tourUrl);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(tourUrl);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert('Copy failed. Please manually copy: ' + text);
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.innerHTML = '✅ Virtual tour link copied to clipboard!';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: 'Cinzel', serif;
        box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// Tab Switching Function
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Duplicate image modal implementation removed.
// Using the primary `openImageModal(imageSrc, caption)` / `closeImageModal()`
// implementations defined earlier in this file (heritage-styled modal).
// The older injected-white-modal version caused the bright white panels —
// removing it ensures the themed dark modal CSS is used instead.

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

// AR Model Lazy Loading
function initARModelLazyLoading() {
    const arModelFrames = document.querySelectorAll('.ar-model-frame');
    
    if (!arModelFrames.length) return;
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                const dataSrc = iframe.getAttribute('data-src');
                
                // Only load if not already loaded
                if (dataSrc && iframe.src === 'about:blank') {
                    iframe.src = dataSrc;
                    console.log('Loading AR model:', dataSrc);
                }
            }
        });
    }, {
        rootMargin: '50px' // Start loading slightly before element comes into view
    });
    
    // Observe all AR model iframes
    arModelFrames.forEach(frame => observer.observe(frame));
}

// Also load AR models when AR tab is clicked
document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loading
    initARModelLazyLoading();
    
    // Load models when AR tab becomes active
    const arTabBtn = document.querySelector('.tab-btn:nth-child(3)'); // AR Models button
    if (arTabBtn) {
        arTabBtn.addEventListener('click', () => {
            setTimeout(() => {
                const arModelFrames = document.querySelectorAll('.ar-model-frame');
                arModelFrames.forEach(iframe => {
                    const dataSrc = iframe.getAttribute('data-src');
                    if (dataSrc && iframe.src === 'about:blank') {
                        iframe.src = dataSrc;
                    }
                });
            }, 100);
        });
    }
});
