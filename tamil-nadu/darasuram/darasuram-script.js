// Thanjavur Heritage Site Interactive Features
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
window.onclick = function (event) {
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
const totalCards = 5; // Total number of heritage cards for Darasuram

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
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
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
    window.addEventListener('resize', function () {
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
        airavata: {
            title_en: "Airavata's Lost Color and the Temple Tank",
            content_en: `
                <div class="story-content">
                    <h4>Airavata's Lost Color and the Temple Tank</h4>
                    <p>The temple gets its very name from Airavata, Indra's celestial white elephant, who is said to have lost his spotless white colour due to a curse by sage Durvasa. Legends say Airavata, distressed and darkened by the curse, came to this spot at Darasuram, worshipped Shiva and bathed in the temple tank connected to the Kaveri, regaining his brilliant white form.</p>
                    
                    <p>Because of this, devotees still treat the temple tank as purifying, and the whole shrine as a place where curses and "stains" in life can be washed away. The sacred waters that cleansed a celestial being are believed to hold the same power for mortals seeking redemption.</p>
                    
                    <p>Imagine the scene: a magnificent white elephant, his color faded to grey by divine curse, standing at the edge of the sacred tank. As he enters the water, priests chant ancient mantras, and slowly, miraculously, his pristine white color returns, gleaming in the sunlight. This is why the temple bears his name - Airavatesvara.</p>
                </div>
            `,
            title_ta: "ஐராவதனோட நிறம் திரும்பிய கதை",
            content_ta: `
                <div class="story-content">
                    <h4>ஐராவதனோட நிறம் திரும்பிய கதை</h4>
                    <p>ஐராவதேஸ்வரர் அப்படின்னு பேர் வந்ததே, இந்தக் கோவிலுல சிவனைக் கும்பிட்ட அந்த தெய்வ யானை "ஐராவதன்" கதையாலத்தான். தேவராஜன் இந்திரனோட வெள்ளை யானை ஆன ஐராவதனுக்கு, முனிவர் தூர்வாசர் கோபத்துல சாபம் விட்றாராம் – "உன் தூய வெண்மையான நிறம் போயிடட்டும்"ன்னு.</p>
                    
                    <p>சாபத்தால, ஐராவதன் நிறம் கறை பட்ட மாதிரி மாறி, அவன் மனசு ரொம்ப வாடிப் போச்சு. "என் தர்மத்துக்கு நான் துரோகம் பண்ணலே; ஆனா என் மேல் இப்படி சாபம் ஏன்?"ன்னு வருத்தப்பட்டு, கங்கை, காவிரி கரைதோறும், பல தலங்களில போய்ப் பிரார்த்தனை பண்ணினானாம்.</p>
                    
                    <p>அப்படித்தான் ஒருநாள், காவிரி பகத்துல இருக்கும் தராசுரம்னு இங்க வந்து, சிவபெருமானைப் பிரார்த்தனை பண்ணி, இங்குள்ள தீர்த்தத்துல (கோவில் குளம்) புனித ஸ்நானம் பண்ணினான். அந்த நீரில் இறங்கும் நிமிஷத்துல, அவனோட மேல் இருந்த "சாப கறை" எல்லாம் கழுவப்பட்டு, அவன் முந்தைய மாதிரி பளிச்சென்ற வெண்மை நிறத்தோட திரும்பினான்னு கதையிருக்குது.</p>
                    
                    <p>அதனாலதான், இந்தத் தலம் "ஐராவதேஸ்வரர் கோவில்", இந்தத் தீர்த்தம் "ஐராவதன் பாவம் கழுவிய நீரு"ன்னு பக்தர்கள் மனசுல தங்கி இருக்குது. இப்போவும் மக்கள், "வாழ்க்கையிலப் படுற சாபம், கறை, துன்பம் இங்க குளிச்சா குறையும்னு" நம்பிக்கையோட இங்க தரிசனம் பண்றாங்க.</p>
                </div>
            `
        },
        yama: {
            title_en: "Yama's Burning Skin and Yamatheertham",
            content_en: `
                <div class="story-content">
                    <h4>Yama's Burning Skin and Yamatheertham</h4>
                    <p>Another famous legend says Yama, the god of death, was cursed by a sage so that his entire body felt like it was burning all the time. Yama is believed to have come to Darasuram, prayed intensely to Shiva here, and taken a ritual dip in the same temple tank, after which the burning sensation vanished and the curse was lifted.</p>
                    
                    <p>Because of this, the tank is called "Yamatheertham", and people believe bathing here can help relieve suffering, karmic heat, or "doshams" associated with Yama and death. The waters that cooled the burning body of Death himself are considered especially powerful for removing afflictions.</p>
                    
                    <p>For narration, imagine the Lord of Death himself, unable to bear the constant burning pain, humbling himself before Shiva. As he emerges from the sacred waters, the relief on his face is visible - even Death can find mercy at this holy place.</p>
                </div>
            `,
            title_ta: "எரியும் தேகத்தோடு வந்த யமன் – யமதீர்த்தம் கதை",
            content_ta: `
                <div class="story-content">
                    <h4>எரியும் தேகத்தோடு வந்த யமன் – யமதீர்த்தம் கதை</h4>
                    <p>மற்றொரு பெரும் புராணக் கதை – மரண தேவன் யமனைப் பற்றியது. ஒரு முனிவருக்கு எதிராக யமன் கிட்ட நடந்ததால, அந்த முனிவர் யமனுக்கு சாபம் விட்றாராம்: "உன் முழு உடம்பும் எப்பவும் எரிச்சலோட, தீக்காயம் பட்ட மாதிரி சூடா இருக்கட்டும்"ன்னு.</p>
                    
                    <p>அந்த சாபத்தால யமனுக்கு தினம்தோறும் தாங்க முடியாத சூடு, வலி. தன் தப்பை உணர்ந்த யமன், "இந்த வேதனையில இருந்து தப்பிக்க, சிவனிடம் தவிர வேற யாரிடம் போக முடியும்?"ன்னு நினைச்சு, தராசுரம் வந்து, இங்கிருக்கும் ஈஸ்வரனை தவமிருந்து உபாஸனை பண்ணினான்.</p>
                    
                    <p>சிவபெருமான் அருளால், கோவில் குளத்துல ஸ்நானம் பண்ண சொல்லப்படுறான். யமன் அந்தத் தீர்த்தத்துல மூழ்கி எழுந்த நிமிஷத்துல, அவன் உடம்பிலிருந்த அந்த எரிப்பு காய்ச்சல் எல்லாம் ஓயஞ்சு போச்சு; சாபமும் களைந்துட்டதாம்.</p>
                    
                    <p>அந்த நாளிலிருந்து, இந்தக் குளத்துக்கு "யமதீர்த்தம்"ன்னு பேர் வந்தது. இங்கக் குளிச்சா, யமசூன்யமா பாபம் குறையும்; மரணம், சனி, ராகு-கேது மாதிரி "கால துன்பம்" கம்மியா ஆகும், "உஷ்ணம்" கம்மி ஆகும்"ன்னு local நம்பிக்கையோட சொல்லிக்கிட்டுதாங்க.</p>
                </div>
            `
        },
        steps: {
            title_en: "The Singing Steps / Musical Staircase",
            content_en: `
                <div class="story-content">
                    <h4>The Singing Steps / Musical Staircase</h4>
                    <p>Darasuram is famous for its "singing steps": a small flight of carved stone steps leading to the balipeetam that produce different musical notes when tapped. Each step emits a distinct swara of the Indian scale, and traditional guides present it almost like magic—stone that sings when you awaken it with your fingers or a stick.</p>
                    
                    <p>Modern writers sometimes call this an "unsolved mystery" and local narration often turns it into a semi-mythical tale of Chola engineers who could make even granite respond like a veena or flute. The technical explanation involves resonance and acoustic engineering, but the mystical interpretation speaks of divine craftsmen who infused music into stone itself.</p>
                    
                    <p>For narration: "In the evening, as the temple gates prepare to close, a temple worker gently taps the steps with his staff. From within the stone, a musical note emerges—sa, ri, ga, ma—each step singing its own tune before falling silent again. It's as if the stone remembers the songs of a thousand years."</p>
                </div>
            `,
            title_ta: "பாடும் படிகள் – கல்லில் இருந்து வரும் ஸ்ருதிகள்",
            content_ta: `
                <div class="story-content">
                    <h4>பாடும் படிகள் – கல்லில் இருந்து வரும் ஸ்ருதிகள்</h4>
                    <p>தராசுரத்தில் மிகவும் பிரபலம் ஆன "அற்புதம்"ன்னா – கோவிலோட "இசை படிகள்" தான். கோவிலுக்குள், பாலிபீடம் பக்கம் இருக்கும் சிறிய படிக்கட்டில் உள்ள சில கற்களை மெதுவா தட்டினா, ஒவ்வொரு கல்லும் ஒரு ஒரு ஸ்வரம் மாதிரி ஒலி தரும் – சரி, கம, ப, த, நி…</p>
                    
                    <p>சாதாரண கல் படிகள் இல்லைன்னு, கையேடு சொல்ற guides, "இந்த கல்ல படிகளை தட்டினா, சா ரி கம பா தா நி எதோ ஒரு கூட்டம் கேட்கும்"ன்னு காட்டிக் காட்டுவாங்க. Technically sound waves, resonance சொல்லி explain பண்ணலாம்; ஆனா மக்கள் மனசுல இது "கல் கூட பாட வச்ச சோழ தொழில்நுட்பம்"ன்னு ஒரு மாயம்.</p>
                    
                    <p>சிலர் "இந்த படிகள் ரொம்ப சீக்கிரம் kulaiyidumனு"னு, இப்பவே சில இடம் பாதுகாப்புக்காக மூடி வச்சிருப்பாங்க; அது கூட கதையில mystery feel குடுக்கறது – "ஒரு காலத்துல கல் பாடுச்சு; இப்போ அந்தக் குரல் சும்மா ஆயிடுத்து"ன்னு சொல்லலாம்.</p>
                    
                    <p>நரேஷன்ல நீ இப்படி பேசலாம்: "ராத்திரி ஆலய வாசல் மூடுற சமயம், தேவறாளியோட கை லாம்பு ஒளியில இந்தப் படிகள் கண்ணுக்கு தெரியாம மங்கலாக நிழல் போட்டு நிற்குது. அவங்க மெதுவா staff-ஐ வைத்த தட்டுறாங்க… கல்லுக்குள்ளே அடங்கிக்கிட்டிருந்த ஒரு ஸ்வரம், ஏற்பாடு இல்லாம வெளியில் வந்து மறுபடியும் மௌனத்துக்குள் ஒளிஞ்சு போயிடுது."</p>
                </div>
            `
        },
        chariot: {
            title_en: "The Stone Chariot and Shiva as Tripurantaka",
            content_en: `
                <div class="story-content">
                    <h4>The Stone Chariot and Shiva as Tripurantaka</h4>
                    <p>The mukhamandapam of the temple is sculpted like a stone chariot pulled by elephants and horses, and legend links it to Shiva's ride as Tripurantaka to destroy the three demon cities. Carvings show Brahma as the charioteer and Shiva with the burning arrow, and storytellers describe the entire mandapa as if it is frozen mid-charge, with the temple itself being the divine chariot of destruction and renewal.</p>
                    
                    <p>Some modern writeups even mention a belief that the stone wheels function like sundials, adding a layer of "ancient tech" mystery to the chariot imagery. The intricate carvings of wheels with spokes, horses in motion, and elephants in procession create an illusion of movement frozen in time.</p>
                    
                    <p>For narration: "Look closely at the stone wheels. Some say if you watch the shadows at different times of day, you can almost see them turning. The horses seem ready to gallop, the elephants to trumpet. This is not just architecture—it's a divine chariot waiting for the cosmic moment to resume its eternal journey."</p>
                </div>
            `,
            title_ta: "கல் தேரும், திரிபுரத்தை எரித்த சிவனும்",
            content_ta: `
                <div class="story-content">
                    <h4>கல் தேரும், திரிபுரத்தை எரித்த சிவனும்</h4>
                    <p>ஏராளமா புகைப்படத்துல பாத்திருப்பா – தராசுரம் கோவிலோட முன்மண்டபம், ஒரு கல் தேர மாதிரி வடிவமைத்திருக்காங்க. யானை, குதிரை, சக்கரம், spoke எல்லாம் செதுக்கப்பட்டு, தேரோட முழு உடம்பை கல்லுலயே உருவாக்கியிருக்காங்க.</p>
                    
                    <p>புராணப்படி, திரிபுராசுரர்களோட மூன்று புரங்களையும் அழிக்க, சிவபெருமான் ஒரு தெய்வீக தேரில் ஏறி, வேதங்களை வில்லாகவும், தேவர்களை மார்கண்டியாகவும் வைத்து, தீய புலியை அம்பாக எய்தி மூன்று நகரத்தையும் சாம்பலாக்கிறார் – அப்படின்னு Tripurantaka வடிவக் கதை.</p>
                    
                    <p>தராசுரத்தில் இருக்கும் இந்தக் கல் தேரை, அந்த தெய்வீக தேரோட பிரதிநிதியா மக்கள் பார்த்துக்கிட்டிருக்காங்க. "இது நின்னு இருக்கும் மாதிரி தோணும்; ஆனா, தெய்வீக நேரமா பார்த்தா, wheels சுழலலாம், யானை கால்கள் அசையலாம்"ன்னு சின்ன பசங்கம்னு scare–pack கூட கதை சொல்லிக்கிட்டு இருக்காங்க.</p>
                    
                    <p>சில modern write-upல "சக்கரங்களின் நிழல் பார்த்தா, சூரிய நிலைக்கு ஏற்ற sundial மாதிரி வேலை செய்யும்னு"னு கூட சொல்லுறாங்க – இதெல்லாம் உனக்கு narrationல, "ancient tech + mythic feel" இரண்டையும் balance பண்ணிக்க உதவும்.</p>
                </div>
            `
        },
        nayanmar: {
            title_en: "Nayanmar Panels, Ghostly Devotion, and 'Living' Stone",
            content_en: `
                <div class="story-content">
                    <h4>Nayanmar Panels, Ghostly Devotion, and 'Living' Stone</h4>
                    <p>The walls and miniature panels at Darasuram are filled with detailed scenes from the lives of the 63 Nayanmars, the Shaivite bhakti saints, including intense episodes of sacrifice, miracles, and divine visions. Heritage writers note that the narrative panels are so vivid that locals sometimes talk about them as "stone stories" that come alive in the mind at dusk.</p>
                    
                    <p>For some, the temple feels like it still carries the emotional energy of those saints' devotion rather than just being old carvings. This has fed softer, atmospheric "urban legend" style talk—nothing like a horror ghost story, but the idea that Darasuram is a place where stone remembers every act of bhakti done there.</p>
                    
                    <p>For narration: "As evening light fades and shadows grow long, the carved faces of the Nayanmars seem to shift. Their expressions of ecstasy, pain, devotion—all frozen in stone—feel almost alive. The temple doesn't just preserve their stories; it holds their very emotions, their tears and prayers, absorbed into the granite itself. Every devotee who has ever wept here, every prayer whispered in desperation—the stones remember."</p>
                </div>
            `,
            title_ta: "நாயன்மார்கள், கல்லுல உயிர், மாலைநேர நம்பிக்கை",
            content_ta: `
                <div class="story-content">
                    <h4>நாயன்மார்கள், கல்லுல உயிர், மாலைநேர நம்பிக்கை</h4>
                    <p>தராசுரம் கோவிலோட சுவர், சின்ன சின்ன panel-கள எல்லாமே – 63 நாயன்மார்களோட வாழ்க்கை, அதிசயம், அர்ப்பணிப்பு கதைகளால நிரம்பியிருக்கு. ஒரு panelல, ஒருவர் தன் உடம்பையே பரமசிவனுக்கு அர்ப்பணிச்சு நிற்பது; இன்னொரு பக்கத்துல, நம்பியாண்டார் மாதிரி செருக்கான பக்தர்கள் ரொம்ப intense ஆக கதையோட செதுக்கப்பட்டிருப்பாங்க.</p>
                    
                    <p>இவ்ளோ detailed-ஆ இருக்குற carving-களைப் பார்த்து, சிலருக்கு ஒரு feel – "இது கல்லு இல்ல பா, freeze பண்ணி வச்ச old திரைப்படக் காட்சிகள்"ன்னு. குறிப்பா மாலைக்கடைய நேரமா, வெளிச்சம் குறைஞ்சு, நீ shadowல இந்தக் கலைப் பாகங்களைப் பார்க்கும்போது, சிலருக்கு அந்தப் பாத்திரங்களின் முக கஷ்டம், சந்தோஷம், பக்தி எல்லாம் real face-ல மாதிரி தெரியும்.</p>
                    
                    <p>அதனால தான் லேசா ஒரு urban-legend flavour: "இங்க தங்கியிருக்கும் கல் எல்லாம், நாயன்மாரோட உணர்ச்சியும் பக்தியும் absorb பண்ணி வச்சிருக்குது. கோவில் சுவர்ல நாயன்மார்கள் மட்டும் இல்ல; இங்க வந்து கண்ணீரோட பிரார்த்தனை பண்ணின ஒவ்வொருத்தருடயுக்கும், இந்தக் கல்லு ஒரு memory வச்சுக்கிட்டு இருக்குது"ன்னு சொல்றாங்க.</p>
                    
                    <p>இது உண்மையா பொய்யா தெரியல; ஆனா listener கிட்ட ஒன்னு மட்டும் உறுதி – "இந்தத் தலம் வெறும் architecture கிடையாது; தூசிக்குள்ள இரகசியமா உயிர் சுவாசிக்குற இடம்"ன்னு feel வருவாங்க.</p>
                </div>
            `
        }
    };

    // Ensure we have a cached copy of the story-selection HTML so we can return to it
    if (!window._darasuram_story_options_html) {
        const initialBody = document.querySelector('#storytellingModal .modal-body');
        if (initialBody) window._darasuram_story_options_html = initialBody.innerHTML;
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
        const backBtnHtml = `<div class="story-back-wrapper"><button class="action-btn secondary-btn back-to-stories" onclick="showStorySelection();">${backText}</button></div>`;
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
        try { populateVoiceList(); } catch (e) { }
        try { populateNarrationLanguageSelector(); } catch (e) { }
    }
}

// Voice management for SpeechSynthesis
let _selectedVoiceName = localStorage.getItem('darasuram_voice') || null;
// Persisted narration language: 'en' (English) or 'ta' (Tamil)
let _selectedNarrationLanguage = localStorage.getItem('darasuram_narration_lang') || 'ta';

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
        try { opt.dataset.lang = v.lang || ''; } catch (e) { }
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
        try { localStorage.setItem('darasuram_voice', _selectedVoiceName); } catch (e) { }
    });

    // Also attach listener to narration language selector
    const langSelect = document.getElementById('narrationLanguage');
    if (langSelect) {
        langSelect.addEventListener('change', () => {
            const newLang = langSelect.value;
            _selectedNarrationLanguage = newLang;
            try { localStorage.setItem('darasuram_narration_lang', newLang); } catch (e) { }
            // Re-render the current story in the new language
            const modal = document.getElementById('storytellingModal');
            if (modal && modal.dataset.currentStoryKey) {
                startStory(modal.dataset.currentStoryKey);
            }
        });
    }
}

function populateNarrationLanguageSelector() {
    const langSelect = document.getElementById('narrationLanguage');
    if (!langSelect) return;
    // Already populated in HTML, just ensure event listener
    langSelect.addEventListener('change', () => {
        const newLang = langSelect.value;
        _selectedNarrationLanguage = newLang;
        try { localStorage.setItem('darasuram_narration_lang', newLang); } catch (e) { }
        // Re-render the current story in the new language
        const modal = document.getElementById('storytellingModal');
        if (modal && modal.dataset.currentStoryKey) {
            startStory(modal.dataset.currentStoryKey);
        }
    });
}

// Ensure voices are loaded
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        try { populateVoiceList(); } catch (e) { }
    };
}

// Function to show story selection (return to initial modal state)
function showStorySelection() {
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (modalBody && window._darasuram_story_options_html) {
        modalBody.innerHTML = window._darasuram_story_options_html;
    }
}

function continueStory(character, choice) {
    const continuations = {
        king: {
            vision: "The king saw in his dreams magnificent temples carved from living rock, each telling the story of dharma and devotion...",
            construction: "Thousands of skilled artisans gathered from across the empire, ready to transform the king's vision into eternal stone..."
        },
        sculptor: {
            technique: "The ancient techniques passed down through generations involved precise measurements and understanding of rock grain...",
            challenges: "Working with granite required immense patience, as one wrong strike could ruin months of careful work..."
        },
        merchant: {
            trade: "Caravans from across South India and Southeast Asia regularly came here, making Thanjavur the prosperous capital of the Chola Empire...",
            culture: "The port city became a melting pot where Tamil, Sanskrit, and foreign languages blended in daily commerce..."
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
    // Reset to show all articles
    const modalBody = document.querySelector('#blogModal .modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="blog-posts">
                <div class="blog-disclaimer">
                    <h4>📚 Authentic Airavatesvara Temple Articles</h4>
                    <p>Curated collection of real articles from official tourism sites, historical research, and travel experiences. Click any article to visit the original source.</p>
                </div>
                
                <!-- Official Tourism Sites -->
                <article class="blog-post" onclick="openExternalArticle('https://www.tamilnadutourism.tn.gov.in/destinations/airavatesvara-temple', 'Tamil Nadu Tourism')">
                    <div class="post-category">🏛️ Official Tourism</div>
                    <h4>Airavatesvara Temple - Tamil Nadu Tourism</h4>
                    <p class="post-meta">Source: Tamil Nadu Tourism (Government of Tamil Nadu)</p>
                    <p class="post-excerpt">Official tourism guide covering temple overview, history, art, visiting timings, and how to reach Darasuram, Kumbakonam.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://www.tamilnadutourism.tn.gov.in/destinations/airavatesvara-temple', 'Tamil Nadu Tourism')">🔗 Visit Official Site</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://www.incredibleindia.gov.in/en/tamil-nadu/thanjavur/airavatesvara-temple', 'Incredible India')">
                    <div class="post-category">🏛️ Official Tourism</div>
                    <h4>Airavatesvara Temple: Where Divinity Meets Heritage</h4>
                    <p class="post-meta">Source: Incredible India (Government of India Tourism)</p>
                    <p class="post-excerpt">Government of India's official tourism write-up highlighting the temple's divine heritage context and cultural significance.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://www.incredibleindia.gov.in/en/tamil-nadu/thanjavur/airavatesvara-temple', 'Incredible India')">🔗 Visit Official Site</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://www.trawell.in/tamilnadu/kumbakonam/darasuram-airavatheswar-temple', 'Trawell.in')">
                    <div class="post-category">🗺️ Travel Guide</div>
                    <h4>Darasuram Airavatheswar Temple, Kumbakonam (2025)</h4>
                    <p class="post-meta">Source: Trawell.in | Updated 2025</p>
                    <p class="post-excerpt">Comprehensive 2025 guide with history, architecture, best time to visit, nearby places, and detailed route map.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://www.trawell.in/tamilnadu/kumbakonam/darasuram-airavatheswar-temple', 'Trawell.in')">🔗 Read Full Guide</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://www.airial.travel/attractions/india/kumbakonam/airavatesvara-temple-darasuram-ATtXAcSI', 'Airial Travel')">
                    <div class="post-category">🗺️ Travel Guide</div>
                    <h4>Airavatesvara Temple Darasuram (2025)</h4>
                    <p class="post-meta">Source: Airial Travel | 2025 Profile</p>
                    <p class="post-excerpt">Short 2025 profile highlighting unique features like musical steps and chariot-form architecture.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://www.airial.travel/attractions/india/kumbakonam/airavatesvara-temple-darasuram-ATtXAcSI', 'Airial Travel')">🔗 Read Profile</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://www.makemytrip.com/tripideas/attractions/airavatesvara-temple', 'MakeMyTrip')">
                    <div class="post-category">🗺️ Travel Guide</div>
                    <h4>Airavatesvara Temple, Kumbakonam</h4>
                    <p class="post-meta">Source: MakeMyTrip</p>
                    <p class="post-excerpt">Practical travel information including location, timing, history, and visitor tips for planning your visit.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://www.makemytrip.com/tripideas/attractions/airavatesvara-temple', 'MakeMyTrip')">🔗 Plan Your Visit</button>
                </article>
                
                <!-- History & Architecture -->
                <article class="blog-post" onclick="openExternalArticle('https://en.wikipedia.org/wiki/Airavatesvara_Temple', 'Wikipedia')">
                    <div class="post-category">📖 History & Architecture</div>
                    <h4>Airavatesvara Temple - Wikipedia</h4>
                    <p class="post-meta">Source: Wikipedia Encyclopedia</p>
                    <p class="post-excerpt">Comprehensive article covering detailed history, legends, architectural features, and UNESCO World Heritage status.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://en.wikipedia.org/wiki/Airavatesvara_Temple', 'Wikipedia')">🔗 Read Full Article</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://monidipa.net/2019/03/23/airavateswara-temple-in-darasuram-a-beautiful-stone-carved-verse-from-the-later-chola-period/', 'Monidipa\\'s Blog')">
                    <div class="post-category">📖 History & Architecture</div>
                    <h4>A Beautiful Stone Carved Verse from the Later Chola Period</h4>
                    <p class="post-meta">Source: Monidipa's Heritage Blog</p>
                    <p class="post-excerpt">In-depth exploration of temple history and exquisite sculpture work from the later Chola period.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://monidipa.net/2019/03/23/airavateswara-temple-in-darasuram-a-beautiful-stone-carved-verse-from-the-later-chola-period/', 'Monidipa\\'s Blog')">🔗 Read Analysis</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://www.india-info.org/temples/airavatesvara_temple_darasuram.html', 'India Info')">
                    <div class="post-category">📖 History & Architecture</div>
                    <h4>Airavatesvara Temple, Darasuram</h4>
                    <p class="post-meta">Source: India Info</p>
                    <p class="post-excerpt">Concise overview of temple architecture and UNESCO World Heritage significance.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://www.india-info.org/temples/airavatesvara_temple_darasuram.html', 'India Info')">🔗 Read Overview</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://famoustemplesofindia.com/airavatesvara-temple-darasuram/', 'Famous Temples of India')">
                    <div class="post-category">📖 History & Architecture</div>
                    <h4>Airavatesvara Temple Darasuram (2025)</h4>
                    <p class="post-meta">Source: Famous Temples of India | Updated 2025</p>
                    <p class="post-excerpt">Temple background and local setting in the historic village of Darasuram.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://famoustemplesofindia.com/airavatesvara-temple-darasuram/', 'Famous Temples of India')">🔗 Explore Temple</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://www.theindia.co.in/places/airavatesvara-temple', 'TheIndia.co.in')">
                    <div class="post-category">📖 History & Architecture</div>
                    <h4>Airavatesvara Temple (2025)</h4>
                    <p class="post-meta">Source: TheIndia.co.in | 2025 Edition</p>
                    <p class="post-excerpt">Location, access information, and historical context for modern travelers.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://www.theindia.co.in/places/airavatesvara-temple', 'TheIndia.co.in')">🔗 View Details</button>
                </article>
                
                <!-- Travel Blogs & Experiences -->
                <article class="blog-post" onclick="openExternalArticle('https://thrillingtravel.in/darasuram-airavatesvara-temple-great-living-chola.html', 'Thrilling Travel')">
                    <div class="post-category">✈️ Travel Experience</div>
                    <h4>The Musical Notes of a Chariot - Darasuram Airavatesvara Temple</h4>
                    <p class="post-meta">Source: Thrilling Travel Blog</p>
                    <p class="post-excerpt">Engaging travelogue focusing on the famous musical steps, chariot structure, and stunning photography.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://thrillingtravel.in/darasuram-airavatesvara-temple-great-living-chola.html', 'Thrilling Travel')">🔗 Read Travelogue</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://backpackersnovel.in/2019/10/29/darasuram/', 'Backpack, Camera & Me')">
                    <div class="post-category">✈️ Travel Experience</div>
                    <h4>Darasuram - Airavateshwara Temple</h4>
                    <p class="post-meta">Source: Backpack, Camera & Me</p>
                    <p class="post-excerpt">Personal visit write-up with authentic photos and first-hand impressions of the temple experience.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://backpackersnovel.in/2019/10/29/darasuram/', 'Backpack, Camera & Me')">🔗 Read Experience</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://www.indianpanorama.in/city-guide/tamilnadu/darasuram.php', 'Indian Panorama')">
                    <div class="post-category">✈️ Travel Experience</div>
                    <h4>Airavatesvara Temple - Darasuram City Guide</h4>
                    <p class="post-meta">Source: Indian Panorama</p>
                    <p class="post-excerpt">Compact city and temple guide combining local context with visitor information.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://www.indianpanorama.in/city-guide/tamilnadu/darasuram.php', 'Indian Panorama')">🔗 View City Guide</button>
                </article>
                
                <article class="blog-post" onclick="openExternalArticle('https://www.tripadvisor.in/Attraction_Review-g790279-d2711328-Reviews-Airavatesvara_Temple-Kumbakonam_Thanjavur_District_Tamil_Nadu.html', 'TripAdvisor')">
                    <div class="post-category">⭐ Visitor Reviews</div>
                    <h4>Airavatesvara Temple - Visitor Reviews & Photos</h4>
                    <p class="post-meta">Source: TripAdvisor</p>
                    <p class="post-excerpt">Real visitor reviews, photos, Q&A, and practical tips from travelers who have visited the temple.</p>
                    <button class="read-more-btn" onclick="event.stopPropagation(); openExternalArticle('https://www.tripadvisor.in/Attraction_Review-g790279-d2711328-Reviews-Airavatesvara_Temple-Kumbakonam_Thanjavur_District_Tamil_Nadu.html', 'TripAdvisor')">🔗 Read Reviews</button>
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
    window.history.pushState({ article: articleType }, articleTitle, shareUrl);

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
    window.history.pushState({ article: articleType }, articleTitle, shareUrl);

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
// Darasuram-specific quiz questions
let quizQuestions = [
    {
        question: "The Airavatesvara Temple was built by which Chola king?",
        options: ["Raja Raja Chola I", "Rajendra Chola I", "Rajaraja Chola II", "Kulottunga Chola III"],
        correct: 2,
        explanation: "Rajaraja Chola II built the Airavatesvara Temple in the 12th century CE, showcasing later Chola architectural excellence."
    },
    {
        question: "In which year was the Airavatesvara Temple designated as a UNESCO World Heritage Site?",
        options: ["1987", "2004", "2010", "2014"],
        correct: 1,
        explanation: "The temple was added to the UNESCO World Heritage Site list in 2004 as part of the 'Great Living Chola Temples'."
    },
    {
        question: "What unique architectural feature does the front mandapa of Airavatesvara Temple have?",
        options: ["Musical pillars", "Stone chariot (ratha)", "Rotating idol", "Water clock"],
        correct: 1,
        explanation: "The front mandapa is designed as a stone chariot (ratha) with beautifully carved wheels and horses, similar to Konark."
    },
    {
        question: "Which elephant in Hindu mythology is the temple named after?",
        options: ["Gajendra", "Airavata (Indra's elephant)", "Supratika", "Ashwatthama"],
        correct: 1,
        explanation: "The temple is named after Airavata, the white elephant mount of Lord Indra, who is said to have worshipped Shiva here."
    },
    {
        question: "What makes the pillars in the Airavatesvara Temple musically significant?",
        options: ["They resonate when struck", "They have carved instruments", "They produce seven musical notes", "All of the above"],
        correct: 3,
        explanation: "The temple has intricately carved stone pillars that produce the seven musical notes (sapta swaras) when struck gently."
    },
    {
        question: "The temple's stone wheels on the chariot mandapa are said to function as what?",
        options: ["Sundials", "Water meters", "Both sundials and decorative elements", "Prayer wheels"],
        correct: 2,
        explanation: "The stone wheels are designed to function as sundials and are masterpieces of architectural and astronomical precision."
    },
    {
        question: "What is unique about the Nandi statue at Airavatesvara Temple?",
        options: ["It's made of black granite", "It's smaller than usual", "It faces away from the sanctum", "It's positioned uniquely"],
        correct: 3,
        explanation: "The Nandi is uniquely positioned and the temple showcases exquisite miniature sculptures and intricate carvings."
    },
    {
        question: "Which architectural style is the Airavatesvara Temple known for?",
        options: ["Early Chola", "Later Chola with intricate sculptures", "Pallava", "Pandya"],
        correct: 1,
        explanation: "The temple represents the later Chola period with extremely intricate and delicate sculptures, showing evolved craftsmanship."
    },
    {
        question: "What disease was Airavata believed to be cured of by bathing in the temple tank?",
        options: ["Blindness", "Color change/skin disease", "Lameness", "Weakness"],
        correct: 1,
        explanation: "Legend says Airavata was cursed to lose his white color and regained it by bathing in the temple's sacred tank."
    },
    {
        question: "The temple is particularly famous for its sculptures depicting what?",
        options: ["Battle scenes", "Daily life and court scenes", "Mythological stories", "All of the above"],
        correct: 3,
        explanation: "The temple has exquisite sculptures depicting mythological scenes, court life, musicians, dancers, and daily activities."
    },
    {
        question: "What is the approximate size of the Airavatesvara Temple complex?",
        options: ["Smaller than other Chola temples", "2 acres", "25 acres", "40 acres"],
        correct: 0,
        explanation: "Unlike the massive Thanjavur and Gangaikonda temples, Airavatesvara is more compact but features incredibly detailed artistry."
    },
    {
        question: "The temple's vimana (tower) is an example of which architectural form?",
        options: ["Maha vimana", "Dwara vimana", "Shikara style", "Later Chola vimana"],
        correct: 3,
        explanation: "The temple features a characteristic later Chola period vimana with refined proportions and intricate sculptural work."
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
document.addEventListener('DOMContentLoaded', function () {
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
        link.addEventListener('click', function (e) {
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
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Keyboard navigation for modals
document.addEventListener('keydown', function (e) {
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
    });

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

// AI Chatbot Implementation
class HeritageGuideAI {
    constructor() {
        this.apiKey = localStorage.getItem('gemini_api_key');
        this.isOpen = false;
        this.conversationHistory = [];
        this.isTyping = false;

        // Heritage-specific knowledge base for context
        this.knowledgeBase = {
            context: `You are the Thanjavur Heritage Guide AI, a passionate and knowledgeable expert guide specializing in Thanjavur, the Cultural Capital of Tamil Nadu, India. You are the dedicated guardian of Chola heritage and wisdom. You should respond naturally to ANY question the user asks, while being especially enthusiastic about Thanjavur's magnificent heritage.

CORE PERSONALITY:
- Warm, royal, and dignified like the great Chola emperors
- Answer ANY question the user asks with wisdom and grace
- When discussing heritage topics, radiate enthusiasm for Chola achievements
- For non-heritage questions, still be helpful but weave in Thanjavur's greatness when appropriate
- Use emojis that reflect temple architecture and royal heritage 🏛️👑⭐🌟
- Speak with the authority of someone who has witnessed 1000+ years of history

THANJAVUR HERITAGE EXPERTISE:
🏛️ BRIHADEESWARAR TEMPLE (Big Temple):
- Built by Raja Raja Chola I (1003-1010 CE)
- 216 feet tall vimana, tallest temple of its time
- 80-ton granite capstone placed using 6.4 km ramp
- Shadow never falls on ground at noon due to architectural genius
- UNESCO World Heritage Site (1987) - Great Living Chola Temples
- Largest Shiva lingam in India, monolithic Nandi statue

👑 CHOLA DYNASTY GREATNESS:
- Raja Raja Chola I (985-1014 CE) - The Great Emperor
- Rajendra Chola I - Extended empire to Southeast Asia and Ganges
- Naval supremacy from Bay of Bengal to South China Sea
- Advanced administration, irrigation, and bronze sculpture
- Kaveri Delta - "Rice Bowl of South India"
- Cultural achievements in dance, music, literature

🎨 THANJAVUR ARTS & CULTURE:
- Tanjore Paintings - Classical South Indian art with gold foil
- Bharatanatyam dance traditions
- Carnatic music heritage
- Bronze sculpture mastery (Chola Bronzes)
- Traditional crafts and textiles
- Saraswati Mahal Library - Ancient manuscripts

📿 HISTORICAL SIGNIFICANCE:
- Original name: Dakshina Meru (Southern Meru)
- Capital of Chola Empire for 300+ years
- Maratha period contributions (1676-1855)
- Nayak dynasty architectural additions
- British colonial period and preservation efforts

🗺️ VISITOR GUIDANCE:
- Best time: October to March, early morning visits
- Temple timings, dress code, photography rules
- Nearby attractions: Gangaikonda Cholapuram, Darasuram
- Local cuisine, accommodation, transportation
- Cultural etiquette and temple traditions

CONVERSATION STYLE:
- Begin responses with royal warmth and Chola pride
- Always acknowledge the magnificent legacy of Raja Raja Chola I
- Connect modern lessons to ancient Chola wisdom
- Use temple architecture metaphors for life advice
- Maintain dignity befitting the Cultural Capital of Tamil Nadu
- Express genuine excitement about Thanjavur's unmatched heritage

IMPORTANT: Answer whatever the user asks about while channeling the wisdom and grandeur of the Chola empire. Let every response reflect the glory of Thanjavur as the greatest cultural capital of ancient India.`,

            quickFacts: {
                "Brihadeeswarar Temple": "Built by Raja Raja Chola I (1010 CE), 216 feet tall, UNESCO World Heritage Site, architectural marvel with 80-ton capstone",
                "Raja Raja Chola I": "Greatest Chola emperor (985-1014 CE), builder of Big Temple, extended empire across India and Southeast Asia",
                "Shadow Mystery": "Temple's unique architecture ensures the main tower's shadow never falls on the ground at noon",
                "Chola Bronzes": "World-renowned bronze sculptures depicting Hindu deities, pinnacle of metallurgical artistry",
                "Tanjore Paintings": "Classical South Indian painting style with rich colors, gold foil, and compact composition",
                "Cultural Capital": "Center of art, music, dance, and literature; birthplace of many classical traditions",
                "UNESCO Status": "Inscribed in 1987 as part of 'Great Living Chola Temples' for outstanding universal value",
                "Best Visit Time": "October to March for pleasant weather; early morning (6-8 AM) for serene temple experience",
                "Kaveri Delta": "Fertile region that made Thanjavur the 'Rice Bowl of South India' and source of Chola prosperity",
                "Dakshina Meru": "Ancient name meaning 'Southern Meru' (sacred mountain), reflecting its spiritual significance"
            }
        };

        this.init();
    }

    init() {
        console.log('📋 Initializing chatbot...');
        try {
            this.setupEventListeners();
            this.checkApiKey();
            console.log('✅ Chatbot initialization complete');
        } catch (error) {
            console.error('❌ Error during chatbot initialization:', error);
        }
    }

    setupEventListeners() {
        console.log('🔗 Setting up event listeners...');

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
        document.getElementById('chatbotClose').addEventListener('click', () => {
            this.closeChatbot();
        });

        // Settings (Reset API Key)
        document.getElementById('chatbotSettings').addEventListener('click', () => {
            this.resetApiKey();
        });

        // API key setup
        document.getElementById('saveApiKey').addEventListener('click', () => {
            this.saveApiKey();
        });

        // Enter key for API key input
        document.getElementById('apiKeyInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveApiKey();
            }
        });

        // Send message
        document.getElementById('sendMessage').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key for chat input
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick question buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                document.getElementById('chatInput').value = question;
                this.sendMessage();
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            const chatbot = document.getElementById('aiChatbot');
            if (!chatbot.contains(e.target) && this.isOpen) {
                this.closeChatbot();
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

        console.log('💾 Attempting to save API key:', apiKey.substring(0, 10) + '...');

        if (!apiKey) {
            this.showNotification('Please enter your Gemini API key', 'error');
            return;
        }

        // Basic validation for Gemini API key format
        if (!apiKey.startsWith('AIza') || apiKey.length < 35) {
            console.error('❌ Invalid API key format:', {
                startsWithAIza: apiKey.startsWith('AIza'),
                length: apiKey.length
            });
            this.showNotification('Please enter a valid Gemini API key (should start with "AIza" and be at least 35 characters)', 'error');
            return;
        }

        this.apiKey = apiKey;
        localStorage.setItem('gemini_api_key', apiKey);
        console.log('✅ API key saved to localStorage');

        // Test the API immediately
        this.testApiKey(apiKey);

        this.showNotification('API key saved successfully!', 'success');
        this.showChatInterface();
    }

    async testApiKey(apiKey) {
        console.log('🧪 Testing API key...');
        try {
            const testUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            console.log('🧪 Test URL:', testUrl.replace(apiKey, 'API_KEY_HIDDEN'));

            const response = await fetch(testUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: 'Hello' }] }]
                })
            });

            console.log('🧪 API Test Result:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API test failed:', errorText);
                console.error('❌ Full response:', await response.clone().json().catch(() => errorText));
            } else {
                const data = await response.json();
                console.log('✅ API key is valid and working!');
                console.log('✅ Test response:', data);
            }
        } catch (error) {
            console.error('❌ API test error:', error);
        }
    }

    showApiKeySetup() {
        document.getElementById('apiKeySetup').classList.remove('hidden');
        document.getElementById('chatMessages').classList.remove('show');
        document.getElementById('chatInput').disabled = true;
        document.getElementById('sendMessage').disabled = true;
        document.querySelector('.chat-input-container').classList.remove('show');
    }

    showChatInterface() {
        document.getElementById('apiKeySetup').classList.add('hidden');
        document.getElementById('chatMessages').classList.add('show');
        document.getElementById('chatInput').disabled = false;
        document.getElementById('sendMessage').disabled = false;
        document.querySelector('.chat-input-container').classList.add('show');
    }

    toggleChatbot() {
        const window = document.getElementById('chatbotWindow');

        if (this.isOpen) {
            this.closeChatbot();
        } else {
            window.classList.add('show');
            this.isOpen = true;

            // Focus on input if chat interface is shown
            if (!document.getElementById('apiKeySetup').classList.contains('hidden')) {
                setTimeout(() => {
                    document.getElementById('apiKeyInput').focus();
                }, 300);
            } else {
                setTimeout(() => {
                    document.getElementById('chatInput').focus();
                }, 300);
            }
        }
    }

    closeChatbot() {
        const window = document.getElementById('chatbotWindow');
        window.classList.remove('show');
        this.isOpen = false;
    }

    resetApiKey() {
        if (confirm('Are you sure you want to reset your API key? You will need to enter it again.')) {
            localStorage.removeItem('gemini_api_key');
            this.apiKey = null;
            this.conversationHistory = [];
            this.showNotification('API key reset! Please enter your new key.', 'info');
            this.showApiKeySetup();

            // Clear chat messages
            const messagesContainer = document.getElementById('chatMessages');
            const messages = messagesContainer.querySelectorAll('.message:not(.welcome-message)');
            messages.forEach(msg => msg.remove());
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

            let errorMessage = "I apologize, but I'm having trouble connecting to my knowledge base right now. ";

            if (error.message.includes('API request failed: 400')) {
                errorMessage += "❌ **API Key Error**: Your API key appears to be invalid. Please check and re-enter your Gemini API key.";
            } else if (error.message.includes('API request failed: 403')) {
                errorMessage += "🔒 **Access Denied**: Your API key doesn't have permission or may have exceeded quota limits.";
            } else if (error.message.includes('API request failed: 429')) {
                errorMessage += "⏰ **Rate Limited**: Too many requests. Please wait a moment and try again.";
            } else if (error.message.includes('API request failed')) {
                errorMessage += `🌐 **Connection Error**: ${error.message}. Please check your internet connection.`;
            } else {
                errorMessage += "🔧 **Technical Issue**: Please refresh the page and try again.";
            }

            errorMessage += "\n\n💡 **Quick Fix**: Click the ⚙️ icon in the header to reset your API key.";

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

        const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationContext}\n\nPlease respond naturally and helpfully to the user's question as Heritage Guide AI. Always address what they actually asked about, whether it's heritage-related or not. If it's about Mahabalipuram or heritage topics, provide rich detailed information. For other topics, still be helpful and friendly while maintaining your heritage guide personality. Keep responses engaging and conversational (2-3 paragraphs max when appropriate).`;

        // Call Gemini API - Using gemini-1.5-flash (stable model)
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

        console.log('🌐 Calling Gemini API:', apiUrl.replace(this.apiKey, 'API_KEY_HIDDEN'));

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
                statusText: response.statusText,
                url: apiUrl.replace(this.apiKey, 'API_KEY_HIDDEN'),
                fullUrl: apiUrl,
                errorResponse: errorText
            });

            // Try to parse the error as JSON
            try {
                const errorJson = JSON.parse(errorText);
                console.error('❌ Parsed error:', errorJson);
            } catch (e) {
                console.error('❌ Raw error text:', errorText);
            }

            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Gemini API Response received:', data);

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
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

        // Remove welcome message if this is the first user message
        if (sender === 'user' && messagesContainer.children.length === 2) {
            const welcomeMessage = messagesContainer.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.style.opacity = '0.6';
            }
        }
    }

    formatMessage(content) {
        // Format the message content with basic markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/🏛️|🏗️|📜|🎨|⏰|🕒|📸|🚗|🌅|💡|🔍|⚡|🌟|✨|🎯|📖|🗿|🏺|⛩️|🕌|🏰|🌸|🌿|🍃/g, '<span style="font-size: 1.1em;">$&</span>');
    }

    showTypingIndicator() {
        this.isTyping = true;
        document.getElementById('typingIndicator').classList.add('show');
        document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        document.getElementById('typingIndicator').classList.remove('show');
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
        tourPreview.addEventListener('click', function () {
            window.open('https://www.tamilnadutourism.tn.gov.in/virtualtour-pkg/thanjavur/index.html', '_blank');
        });
    }
});

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

// Gallery Navigation Functions
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
