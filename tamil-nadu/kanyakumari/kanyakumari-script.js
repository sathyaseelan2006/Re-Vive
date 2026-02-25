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
        kumari: {
            title_en: "The Eternal Wait of Kanya Kumari",
            content_en: `
                <div class="story-content">
                    <h4>The Virgin Goddess at Land's End</h4>
                    <p>According to Hindu mythology, Goddess Parvati incarnated as a young virgin princess, Kanya Kumari, at the southernmost tip of India. She performed intense penance (tapas) on the seashore, seeking to marry Lord Shiva. The legend states that Shiva finally agreed to marry her, and the wedding was set to take place at an auspicious hour just before dawn.</p>
                    <p>However, the sage Narada, realizing that the demon Banasura (who had a boon that he could only be killed by a virgin) would become invincible if the marriage occurred, decided to intervene. As Shiva made his way to Kanyakumari in the dark hours before dawn, Narada mimicked a rooster's crow, making Shiva believe that dawn had arrived and the auspicious moment had passed. Disappointed, Shiva returned to Kailash.</p>
                    <p>The heartbroken Kanya Kumari remained eternally a virgin at this sacred spot. The uncooked rice and other materials prepared for the wedding feast are said to have turned into colored stones on the shore. To this day, the Kumari Amman Temple stands at the confluence of three seas, where devotees worship the eternal virgin goddess. The diamond nose ring of the deity is believed to be so brilliant that it guides ships navigating these turbulent waters, serving as a spiritual lighthouse at the edge of the subcontinent.</p>
                </div>
            `,
            title_ta: "கன்னியாகுமரியின் நித்திய காத்திருப்பு",
            content_ta: `
                <div class="story-content">
                    <h4>தேசத்தின் தெற்கு முனையில் கன்னிப்பெண்</h4>
                    <p>இந்து புராணத்தின்படி, பார்வதி தேவி இந்தியாவின் தென்கோடியில் கன்னியாகுமரி என்ற இளம் கன்னிப் பெண்ணாக அவதாரம் எடுத்தார். அவர் சிவபெருமானை மணக்க வேண்டி கடற்கரையில் கடுமையான தவம் செய்தார். சிவபெருமான் இறுதியாக அவளை மணக்க ஒப்புக்கொண்டார், மேலும் திருமணம் விடியற்காலைக்கு சற்று முன் ஒரு சுபமுகூர்த்த நேரத்தில் நடைபெற இருந்தது.</p>
                    <p>இருப்பினும், கன்னிகையால் மட்டுமே கொல்லப்படக்கூடிய வரம் பெற்ற பாணாசுரன் திருமணம் நடந்தால் அழிக்க முடியாதவனாகி விடுவான் என உணர்ந்த நாரத முனிவர் தலையிட முடிவு செய்தார். விடியற்காலைக்கு முன் இருள் நிறைந்த வேளையில் சிவபெருமான் கன்னியாகுமரிக்கு வரும்போது, நாரதர் சேவல் கூவும் ஒலியைப் பிரதிபலித்தார், இதனால் விடிந்துவிட்டது என்றும் சுபமுகூர்த்தம் கடந்துவிட்டது என்றும் சிவபெருமான் நம்பினார். ஏமாற்றமடைந்த சிவபெருமான் கைலாசத்திற்குத் திரும்பினார்.</p>
                    <p>மனம் உடைந்த கன்னியாகுமரி இந்தப் புனித இடத்தில் நித்தியமாக கன்னிப்பெண்ணாகவே இருந்துவிட்டார். திருமண விருந்துக்காக தயாரிக்கப்பட்ட சமைக்காத அரிசி மற்றும் பிற பொருட்கள் கடற்கரையில் வண்ண கற்களாக மாறிவிட்டன என்று கூறப்படுகிறது. இன்றும், மூன்று கடல்கள் சங்கமிக்கும் இடத்தில் குமரி அம்மன் கோவில் நிற்கிறது, அங்கு பக்தர்கள் நித்திய கன்னித் தெய்வத்தை வணங்குகிறார்கள். தெய்வத்தின் வைர மூக்குத்தி மிகவும் ஒளிமயமானது, இந்த கொந்தளிப்பான நீரில் செல்லும் கப்பல்களை வழிநடத்துகிறது என்று நம்பப்படுகிறது.</p>
                </div>
            `
        },
        vivekananda: {
            title_en: "Swami Vivekananda's Three-Day Meditation",
            content_en: `
                <div class="story-content">
                    <h4>The Rock of Awakening</h4>
                    <p>In December 1892, Swami Vivekananda reached Kanyakumari after years of wandering across India as a parivrajaka (wandering monk). Deeply troubled by the poverty, ignorance, and spiritual decline he witnessed, he sought answers at the southern edge of the motherland. On December 25, 1892, he swam to a large rock about 500 meters offshore, where three mighty oceans—the Arabian Sea, Bay of Bengal, and Indian Ocean—converge in a cosmic embrace.</p>
                    <p>For three consecutive days and nights, Vivekananda sat in deep meditation on this isolated rock, contemplating India's glorious past and her present suffering. He reflected on the Upanishadic wisdom, the resilience of the masses, and the mission that lay ahead. It was here, surrounded by the rhythmic sound of waves and the vastness of the ocean, that Vivekananda attained clarity about his life's purpose: to awaken India's spiritual consciousness and share the universal message of Vedanta with the world.</p>
                    <p>This transformative meditation became the foundation for his historic journey to the Parliament of World Religions in Chicago in 1893, where he introduced the West to the profound philosophy of Hinduism and Vedanta. Today, the Vivekananda Rock Memorial stands on this sacred spot, attracting millions of pilgrims and tourists who come to honor the sage's vision and meditate where he once sat, seeking their own paths to enlightenment.</p>
                </div>
            `,
            title_ta: "சுவாமி விவேகானந்தரின் மூன்று நாள் தியானம்",
            content_ta: `
                <div class="story-content">
                    <h4>விழிப்புணர்வின் பாறை</h4>
                    <p>1892 டிசம்பரில், சுவாமி விவேகானந்தர் பல வருடங்கள் இந்தியா முழுவதும் பரிவ்ராஜகராக (சுற்றுலா மேற்கொள்ளும் துறவி) அலைந்து திரிந்த பிறகு கன்னியாகுமரியை அடைந்தார். வறுமை, அறியாமை மற்றும் ஆன்மீக வீழ்ச்சியைக் கண்டு மிகவும் கவலையடைந்து, தாய்நாட்டின் தெற்கு முனையில் பதில்களைத் தேடினார். 1892 டிசம்பர் 25 அன்று, மூன்று வலிமைமிக்க பெருங்கடல்கள்—அரபிக் கடல், வங்காள விரிகுடா மற்றும் இந்தியப் பெருங்கடல்—ஒரு பிரபஞ்ச அணைப்பில் ஒன்றிணையும் கடற்கரையில் இருந்து சுமார் 500 மீட்டர் தொலைவில் உள்ள ஒரு பெரிய பாறைக்கு அவர் நீந்திச் சென்றார்.</p>
                    <p>தொடர்ச்சியாக மூன்று நாட்கள் இரவு பகலாக, இந்த தனிமையான பாறையில் அமர்ந்து, இந்தியாவின் புகழ்பெற்ற கடந்த காலத்தையும் அவளது தற்போதைய துன்பத்தையும் பற்றி சிந்தித்துக்கொண்டு ஆழ்ந்த தியானத்தில் ஈடுபட்டார். உபநிஷத ஞானம், மக்களின் உறுதி, மற்றும் முன்னால் உள்ள பணி பற்றி சிந்தித்தார். அலைகளின் தாள ஒலியாலும், கடலின் விசாலத்தாலும் சூழப்பட்டு, விவேகானந்தர் தனது வாழ்க்கையின் நோக்கத்தைப் பற்றிய தெளிவை அடைந்தார்: இந்தியாவின் ஆன்மீக உணர்வை விழிப்படுத்துவதும், வேதாந்தத்தின் உலகளாவிய செய்தியை உலகத்துடன் பகிர்ந்து கொள்வதும்.</p>
                    <p>இந்த மாற்றுத் தியானம் 1893 இல் சிகாகோவில் நடந்த உலக மதங்கள் பாராளுமன்றத்திற்கான அவரது வரலாற்று பயணத்திற்கு அடித்தளமாக மாறியது, அங்கு அவர் மேற்குலகிற்கு இந்து மதம் மற்றும் வேதாந்தத்தின் ஆழமான தத்துவத்தை அறிமுகப்படுத்தினார். இன்று, இந்த புனிதமான இடத்தில் விவேகானந்தர் பாறை நினைவு மண்டபம் உள்ளது, முனிவரின் தரிசனத்தை கௌரவிக்கவும், அவர் அமர்ந்த இடத்தில் தியானம் செய்யவும் மில்லியன் கணக்கான யாத்ரீகர்கள் மற்றும் சுற்றுலாப் பயணிகள் வருகின்றனர்.</p>
                </div>
            `
        },
        thiruvalluvar: {
            title_en: "Thiruvalluvar: The Poet Saint of Tamil Nadu",
            content_en: `
                <div class="story-content">
                    <h4>The Weaver of Wisdom</h4>
                    <p>Thiruvalluvar, one of the greatest poets and philosophers in Tamil literature, is celebrated as the author of the Thirukkural, a timeless masterpiece consisting of 1,330 couplets (kurals). Though details about his life remain shrouded in mystery, tradition places him around 2,000 years ago, possibly during the Sangam period. He is believed to have lived a simple life as a weaver in Mylapore (present-day Chennai), alongside his devoted wife Vasuki, who is revered in Tamil culture for her virtue and wisdom.</p>
                    <p>The Thirukkural is divided into three sections—Aram (virtue and righteousness), Porul (wealth and statecraft), and Inbam (love and pleasure)—covering the entirety of human existence. Its verses offer guidance on ethics, governance, love, friendship, and justice, transcending religious boundaries and speaking to universal human values. The work's secular nature and profound insights have earned it admiration worldwide, with translations in over 40 languages.</p>
                    <p>In honor of this literary giant, the 133-foot-tall Thiruvalluvar Statue stands majestically on a small island near Kanyakumari, adjacent to the Vivekananda Rock Memorial. The statue's height symbolizes the 133 chapters of the Thirukkural. Unveiled in 2000, it has become an iconic landmark, reminding visitors of the enduring wisdom and cultural richness of Tamil heritage and the universal truths that Thiruvalluvar championed centuries ago.</p>
                </div>
            `,
            title_ta: "திருவள்ளுவர்: தமிழகத்தின் கவி முனிவர்",
            content_ta: `
                <div class="story-content">
                    <h4>ஞானத்தை நெய்த நெசவாளர்</h4>
                    <p>தமிழ் இலக்கியத்தின் மிகப் பெரிய கவிஞர்களும் தத்துவவாதிகளும் ஒருவரான திருவள்ளுவர், 1,330 குறள்களைக் (குறள்கள்) கொண்ட காலத்தால் அழியா தலைசிறந்த படைப்பான திருக்குறளின் ஆசிரியராகக் கொண்டாடப்படுகிறார். அவரது வாழ்க்கை பற்றிய விவரங்கள் மர்மமாக இருந்தாலும், பாரம்பரியம் அவரை சுமார் 2,000 ஆண்டுகளுக்கு முன்பு, சங்க காலத்தில் வாழ்ந்ததாக கூறுகிறது. அவர் தனது அர்ப்பணிப்புள்ள மனைவி வாசுகியுடன் மயிலாப்பூரில் (இன்றைய சென்னை) ஒரு நெசவாளராக எளிமையான வாழ்க்கையை வாழ்ந்ததாக நம்பப்படுகிறது.</p>
                    <p>திருக்குறள் மூன்று பிரிவுகளாகப் பிரிக்கப்பட்டுள்ளது—அறம் (நல்லொழுக்கம் மற்றும் நீதி), பொருள் (செல்வம் மற்றும் அரசியல்), இன்பம் (காதல் மற்றும் இன்பம்)—மனித இருப்பின் முழுமையையும் உள்ளடக்கியது. அதன் வசனங்கள் நெறிமுறைகள், ஆட்சி, காதல், நட்பு மற்றும் நீதி பற்றிய வழிகாட்டுதலை வழங்குகின்றன, மதக் கட்டுப்பாடுகளை மீறி உலகளாவிய மனித மதிப்புகளுக்கு பேசுகின்றன. படைப்பின் மதச்சார்பற்ற தன்மை மற்றும் ஆழமான நுண்ணறிவுகள் உலகளவில் பாராட்டப்பட்டு, 40க்கும் மேற்பட்ட மொழிகளில் மொழிபெயர்க்கப்பட்டுள்ளன.</p>
                    <p>இந்த இலக்கிய ராட்சதரின் நினைவாக, 133 அடி உயர திருவள்ளுவர் சிலை கன்னியாகுமரிக்கு அருகிலுள்ள ஒரு சிறிய தீவில், விவேகானந்தர் பாறை நினைவகத்திற்கு அருகில் பிரமாண்டமாக நிற்கிறது. சிலையின் உயரம் திருக்குறளின் 133 அதிகாரங்களைக் குறிக்கிறது. 2000 ஆம் ஆண்டில் திறக்கப்பட்ட இது ஒரு சின்னச் சின்னமான அடையாளமாக மாறியுள்ளது, பார்வையாளர்களுக்கு நீடித்த ஞானத்தையும் தமிழ் பாரம்பரியத்தின் கலாச்சார செழுமையையும் நூற்றாண்டுகளுக்கு முன்பு திருவள்ளுவர் பரிந்துரைத்த உலகளாவிய உண்மைகளையும் நினைவூட்டுகிறது.</p>
                </div>
            `
        },
        confluence: {
            title_en: "Where Three Seas Embrace: The Tri-Sea Confluence",
            content_en: `
                <div class="story-content">
                    <h4>The Sacred Meeting of Waters</h4>
                    <p>Kanyakumari holds a unique geographical distinction as the only place on Earth where three major water bodies—the Arabian Sea to the west, the Bay of Bengal to the east, and the Indian Ocean to the south—converge in a spectacular natural phenomenon. This tri-sea confluence, known in Tamil as "Mukkadal Sangamam," creates a mesmerizing sight where waters of different colors, temperatures, and currents meet and mingle.</p>
                    <p>The confluence is especially dramatic during the full moon days when tidal patterns create visible demarcations between the seas. Devotees consider bathing at this sacred sangam highly auspicious, believing it cleanses sins and grants spiritual merit. Geologically, the convergence creates unique underwater currents and marine biodiversity, with distinct ecosystems from each sea contributing to the region's rich aquatic life.</p>
                    <p>Spiritually, the meeting of three seas symbolizes the unity in diversity that defines India itself—different forces converging harmoniously at a single sacred point. The sunrise and sunset at Kanyakumari are renowned worldwide, as this is one of the rare places in India where both can be viewed over the ocean. On special occasions like the Chitra Pournami in April, one can witness the moon rise and sun set simultaneously over the horizon, creating a celestial spectacle that has drawn pilgrims, poets, and travelers for millennia. The confluence remains a powerful reminder of nature's grandeur and the spiritual significance of India's southern tip.</p>
                </div>
            `,
            title_ta: "மூன்று கடல்கள் சங்கமிக்கும் இடம்",
            content_ta: `
                <div class="story-content">
                    <h4>புனிதமான நீர்களின் சந்திப்பு</h4>
                    <p>கன்னியாகுமரி ஒரு தனித்துவமான புவியியல் பிரத்தியேகத்தைக் கொண்டுள்ளது, மூன்று பெரிய நீர்நிலைகள்—மேற்கில் அரபிக் கடல், கிழக்கில் வங்காள விரிகுடா, தெற்கில் இந்தியப் பெருங்கடல்—ஒரு கண்கவர் இயற்கை நிகழ்வில் ஒன்றிணையும் பூமியின் ஒரே இடம் இது. தமிழில் "முக்கடல் சங்கமம்" என்று அழைக்கப்படும் இந்த மூன்று கடல் சங்கமம், வெவ்வேறு நிறங்கள், வெப்பநிலைகள் மற்றும் நீரோட்டங்களின் நீர் சந்திக்கும் மற்றும் கலக்கும் ஒரு மயக்கும் காட்சியை உருவாக்குகிறது.</p>
                    <p>பௌர்ணமி நாட்களில் அலை முறைகள் கடல்களுக்கு இடையே காணக்கூடிய எல்லைகளை உருவாக்கும் போது சங்கமம் குறிப்பாக வியத்தகு முறையில் இருக்கும். இந்த புனித சங்கமத்தில் குளிப்பது மிகவும் சுபகரமானதாக பக்தர்கள் கருதுகின்றனர், இது பாவங்களைத் தூய்மைப்படுத்தி ஆன்மீக புண்ணியத்தை வழங்குகிறது என்று நம்புகின்றனர். புவியியல் ரீதியாக, இந்த சங்கமம் தனித்துவமான நீருக்கடியில் நீரோட்டங்கள் மற்றும் கடல் உயிர் பன்முகத்தன்மையை உருவாக்குகிறது.</p>
                    <p>ஆன்மீக ரீதியாக, மூன்று கடல்களின் சந்திப்பு இந்தியாவையே வரையறுக்கும் பன்முகத்தன்மையில் ஒற்றுமையின் அடையாளமாகும்—வெவ்வேறு சக்திகள் ஒரு புனித புள்ளியில் இணக்கமாக ஒன்றிணைகின்றன. கன்னியாகுமரியில் சூரிய உதயமும் சூரிய அஸ்தமனமும் உலகளவில் பிரபலமானவை, இது கடலுக்கு மேல் இரண்டையும் பார்க்கக்கூடிய இந்தியாவின் அரிய இடங்களில் ஒன்றாகும். ஏப்ரல் மாதத்தில் சித்திரை பௌர்ணமி போன்ற சிறப்பு சந்தர்ப்பங்களில், சந்திரன் உதயமாவதையும் சூரியன் அஸ்தமிப்பதையும் ஒரே நேரத்தில் அடிவானத்தில் பார்க்க முடியும்.</p>
                </div>
            `
        }
    };
    
    // Ensure we have a cached copy of the story-selection HTML so we can return to it
    if (!window._kanyakumari_story_options_html) {
        const initialBody = document.querySelector('#storytellingModal .modal-body');
        if (initialBody) window._kanyakumari_story_options_html = initialBody.innerHTML;
    }

    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (stories[storyType] && modalBody) {
        // Determine initial language
        const lang = _selectedNarrationLanguage || 'en';
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
            modal.dataset.currentStoryKey = storyType;
            modal.dataset.currentStoryTitle = title;
            modal.dataset.currentStoryHtml = content;
        }

        // Add Narrate controls below the story
        const controlsHtml = `
            <div class="story-narration-controls">
                <label for="narrationLanguage" class="voice-label">Language:</label>
                <select id="narrationLanguage" class="quick-narrate-select">
                    <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
                    <option value="ta" ${lang === 'ta' ? 'selected' : ''}>தமிழ் (Tamil)</option>
                </select>
                <label for="voiceSelect" class="voice-label">Voice:</label>
                <select id="voiceSelect" class="quick-narrate-select"><option>Loading voices...</option></select>
                <button class="action-btn primary-btn" onclick="narrateStory()">🔊 Narrate this story (AI)</button>
                <button class="action-btn secondary-btn" onclick="narrateOriginal()">🔈 Narrate Original</button>
                <button class="action-btn" id="playNarrationBtn" onclick="playNarration()" disabled>Play</button>
                <button class="action-btn" id="pauseNarrationBtn" onclick="pauseNarration()" disabled>Pause</button>
                <button class="action-btn" id="stopNarrationBtn" onclick="stopNarration()" disabled>Stop</button>
                <div id="narrationSpinner">Generating...</div>
                <div id="voiceAvailability" class="voice-availability" aria-live="polite"></div>
                <div id="voiceMismatchWarning" class="voice-mismatch-warning" aria-live="polite" style="display:none"></div>
            </div>
            <div id="narrationText"></div>
        `;

        modalBody.insertAdjacentHTML('beforeend', controlsHtml);
        
        // Populate voice controls
        try { populateVoiceList(); } catch (e) {}
        try { populateNarrationLanguageSelector(); } catch (e) {}
    }
}

// Voice management for SpeechSynthesis
let _selectedVoiceName = localStorage.getItem('kanyakumari_voice') || null;
let _selectedNarrationLanguage = localStorage.getItem('kanyakumari_narration_lang') || 'en';

function showStorySelection() {
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (modalBody && window._kanyakumari_story_options_html) {
        modalBody.innerHTML = window._kanyakumari_story_options_html;
    }
}

function populateVoiceList() {
    const select = document.getElementById('voiceSelect');
    if (!select) return;

    const voices = speechSynthesis.getVoices();
    if (!voices || !voices.length) return;

    select.innerHTML = '';
    voices.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.lang})${v.default ? ' — default' : ''}`;
        try { opt.dataset.lang = v.lang || ''; } catch (e) {}
        select.appendChild(opt);
    });

    if (_selectedVoiceName && Array.from(select.options).some(o => o.value === _selectedVoiceName)) {
        select.value = _selectedVoiceName;
    }

    select.addEventListener('change', () => {
        _selectedVoiceName = select.value;
        localStorage.setItem('kanyakumari_voice', _selectedVoiceName);
    });
}

function populateNarrationLanguageSelector() {
    const langSelect = document.getElementById('narrationLanguage');
    if (!langSelect) return;

    langSelect.addEventListener('change', () => {
        const newLang = langSelect.value;
        _selectedNarrationLanguage = newLang;
        localStorage.setItem('kanyakumari_narration_lang', newLang);
        
        const modal = document.getElementById('storytellingModal');
        if (modal && modal.dataset.currentStoryKey) {
            startStory(modal.dataset.currentStoryKey);
        }
    });
}

// Narration functions for story audio
function narrateStory() {
    console.log('Narrate story called - feature placeholder for AI narration');
}

function narrateOriginal() {
    const modal = document.getElementById('storytellingModal');
    if (!modal || !modal.dataset.currentStoryHtml) return;
    
    const storyDiv = document.createElement('div');
    storyDiv.innerHTML = modal.dataset.currentStoryHtml;
    const textContent = storyDiv.textContent || storyDiv.innerText || '';
    
    if (!textContent.trim()) {
        alert('No story text available to narrate.');
        return;
    }
    
    speakText(textContent);
}

function speakText(text) {
    if (!window.speechSynthesis) {
        alert('Text-to-speech is not supported in your browser.');
        return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    if (_selectedVoiceName) {
        const selectedVoice = voices.find(v => v.name === _selectedVoiceName);
        if (selectedVoice) utterance.voice = selectedVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
    
    const playBtn = document.getElementById('playNarrationBtn');
    const pauseBtn = document.getElementById('pauseNarrationBtn');
    const stopBtn = document.getElementById('stopNarrationBtn');
    
    if (playBtn) playBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = false;
}

function playNarration() {
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
    }
}

function pauseNarration() {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
    }
}

function stopNarration() {
    window.speechSynthesis.cancel();
    const playBtn = document.getElementById('playNarrationBtn');
    const pauseBtn = document.getElementById('pauseNarrationBtn');
    const stopBtn = document.getElementById('stopNarrationBtn');
    
    if (playBtn) playBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = true;
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
