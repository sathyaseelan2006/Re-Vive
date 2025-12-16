// Mahabalipuram Heritage Site Interactive Features
// Consistent with Tamil Nadu heritage theme

// Modal Management
function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Modal not found:', modalId);
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
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

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
const totalCards = 10; // Total number of heritage cards

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

    // Helper: get list of gallery image srcs in order
    function getGalleryImages() {
        const imgs = Array.from(document.querySelectorAll('.gallery-track .card-image'));
        return imgs.map(i => i.getAttribute('src'));
    }

    // Navigate to next/previous image
    function showImageByIndex(idx) {
        const images = getGalleryImages();
        if (!images.length) return;
        const newSrc = images[(idx + images.length) % images.length];
        const imgEl = modal.querySelector('.modal-image');
        if (imgEl) imgEl.src = newSrc;
        // update caption from matching card overlay button if possible
        const card = Array.from(document.querySelectorAll('.gallery-track .heritage-card')).find(c => c.querySelector('.card-image') && c.querySelector('.card-image').getAttribute('src') === newSrc);
        const newCaption = card ? (card.querySelector('.card-info h5')?.textContent || '') : '';
        const capEl = modal.querySelector('.modal-caption');
        if (capEl && newCaption) capEl.textContent = newCaption;

        // Preload next image
        const nextIdx = ((idx + 1) % images.length);
        const pre = new Image(); pre.src = images[nextIdx];
    }

    function getCurrentIndex() {
        const images = getGalleryImages();
        const imgEl = modal.querySelector('.modal-image');
        const cur = imgEl ? imgEl.getAttribute('src') : imageSrc;
        return images.findIndex(s => s === cur);
    }

    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // Add navigation and actions to modal
    const prevBtn = document.createElement('button');
    prevBtn.className = 'modal-prev';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.innerHTML = '◀';
    prevBtn.addEventListener('click', () => {
        const idx = getCurrentIndex();
        showImageByIndex(idx - 1);
    });

    const nextBtn = document.createElement('button');
    nextBtn.className = 'modal-next';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.innerHTML = '▶';
    nextBtn.addEventListener('click', () => {
        const idx = getCurrentIndex();
        showImageByIndex(idx + 1);
    });

    const downloadBtn = document.createElement('a');
    downloadBtn.className = 'modal-download';
    downloadBtn.setAttribute('download', '');
    downloadBtn.setAttribute('aria-label', 'Download image');
    downloadBtn.textContent = 'Download';
    downloadBtn.style.marginLeft = '8px';

    const shareBtn = document.createElement('button');
    shareBtn.className = 'modal-share';
    shareBtn.setAttribute('aria-label', 'Share image');
    shareBtn.textContent = 'Share';
    shareBtn.style.marginLeft = '8px';
    shareBtn.addEventListener('click', async () => {
        const imgEl = modal.querySelector('.modal-image');
        const url = imgEl ? imgEl.src : window.location.href;
        if (navigator.share) {
            try { await navigator.share({ title: caption || 'Mahabalipuram Image', url }); } catch (e) { console.warn('Share canceled', e); }
        } else {
            // fallback: copy to clipboard
            try { await navigator.clipboard.writeText(url); alert('Image URL copied to clipboard'); } catch (e) { alert('Share not available'); }
        }
    });

    const modalContent = modal.querySelector('.image-modal-content');
    if (modalContent) {
        modalContent.appendChild(prevBtn);
        modalContent.appendChild(nextBtn);
        modalContent.appendChild(downloadBtn);
        modalContent.appendChild(shareBtn);
        // set download href
        const imgEl = modal.querySelector('.modal-image');
        if (imgEl) downloadBtn.href = imgEl.src;
    }

    // Keyboard navigation and escape
    function modalKeyHandler(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        } else if (e.key === 'ArrowLeft') {
            const idx = getCurrentIndex(); showImageByIndex(idx - 1);
        } else if (e.key === 'ArrowRight') {
            const idx = getCurrentIndex(); showImageByIndex(idx + 1);
        }
    }
    document.addEventListener('keydown', modalKeyHandler);

    // Update download link when image changes (observe src changes)
    const observer = new MutationObserver(() => {
        const imgEl = modal.querySelector('.modal-image');
        if (imgEl) {
            downloadBtn.href = imgEl.src;
        }
    });
    const imgElForObs = modal.querySelector('.modal-image');
    if (imgElForObs) observer.observe(imgElForObs, { attributes: true, attributeFilter: ['src'] });

    // Ensure we cleanup when modal closes
    modal._cleanup = function() {
        document.removeEventListener('keydown', modalKeyHandler);
        observer.disconnect();
    };
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
    alert('AR Experience launching... Please point your device camera at the monuments for an immersive 3D experience!');
    
    // In a real implementation, you would integrate with libraries like:
    // - AR.js for web-based AR
    // - 8th Wall for advanced AR features
    // - Model Viewer for 3D model display
    console.log('AR functionality would launch here with 3D models of Mahabalipuram monuments');
}

// Storytelling Modal Functions
function openStorytellingModal() {
    openModal('storytellingModal');
}

function startStory(storyType) {
    const stories = {
        seven_pagodas: {
            title_en: "The Legend of the Seven Pagodas",
            content_en: `
                <div class="story-content">
                    <h4>The Mystery of the Submerged Temples</h4>
                    <p>Along the Coromandel Coast, ancient mariners spoke of a breathtaking sight—seven magnificent temples that rose from the shore like divine beacons, their spires touching the heavens. These weren't ordinary temples but architectural marvels that guided ships safely to harbor, their golden pinnacles visible from miles across the Bay of Bengal. Sailors from distant lands—from Southeast Asia, China, and even the Roman Empire—navigated by these sacred landmarks, each temple more splendid than the last.</p>
                    <p>But the gods grew jealous of such earthly perfection. Legend says that Indra, the king of gods, feared that mortals had created something too beautiful, something that rivaled the celestial palaces of the heavens themselves. In divine envy, he summoned a great deluge that swallowed six of the seven temples beneath the waves. Today, only the Shore Temple stands as a solitary sentinel, bearing witness to the glory that once was. Local fishermen still speak of glimpses beneath the waters during calm seas—the outline of submerged spires, the echo of temple bells carried by the tide. The seven pagodas remain one of India's greatest mysteries, a reminder that some treasures belong both to history and to legend, waiting beneath the waves for their stories to resurface.</p>
                </div>
            `,
            title_ta: "ஏழு பக்கங்கள் விளக்கத்தின் கதை",
            content_ta: `
                <div class="story-content">
                    <h4>முனையப்பட்ட கோவில்களின் மர்மம்</h4>
                    <p>கொரமண்டல் கரையைப்போற்றி, பழமையான கடலோர வணிகர்கள் ஏழு மகத்தான கோவில்களின் அதிசய தோற்றத்தைப் பற்றி பேச்ரார்கள் — கரையோரத்தில் நிலைத்து, தாம்பேல் போல உயர்ந்த அ尖கோபுரங்கள் நீண்ட தூரத்திலிருந்து காட்சி அளித்தன. இவை சாதாரணக் கோவில்கள் அல்ல; யான்களை பாதுகாக்கும் அசாதாரண கட்டிடக் கலை விளக்கங்கள் போன்றவை. தென்னகாசிய, சீனா மற்றும் ரோமன் பேரரசுகளிலிருந்து வந்த கொள்ளையோர் கூட இக் கரைவழி அடையாளங்களையொட்டி பயணித்தார்கள்.</p>
                    <p>ஆனால், கடவுள்கள் இந்த பூமியின் அழகைப் பார்த்து பொறாமை கொண்டதாகச் சொல்லப்படுகிறது. அரசரான இந்த்ரர், மக்களால் சித்திக்கப்பட்ட இந்த அழகை பார்க்கி அதனை அழிக்க ஒரு பெரும் கரைநீர் அனுப்பினான்; அதன் பயனாலே ஆறு கோவில்கள் அலைகளினால் மூழ்கின. இன்று மட்டும் ஓர் கரை கோவில் மட்டுமே நிலைத்திருக்கிறது — அந்தக் காலத்தின் மகிமையை சாட்சியமளிக்கிறது. மீனவர்கள் அமைதியான கடல்நேரங்களில் ஆழத்தளத்தில் அடையாளங்களைக் காண்பதாகச் சொல்லுகிறார்கள் — மூழ்கிச் சென்ற மாடிகளின் இலக்குகள், அலைகளோடு வந்து சென்ற கேவலங்கள். ஏழு பக்கங்கள் என்ற மர்மம் இன்றும் வாழ்கிறது, வரலாறும் கதைகளும் ஒன்றாக இணைந்திருக்கும் ஒரு நினைவாக.</p>
                </div>
            `
        },
        butter_ball: {
            title_en: "Krishna's Butter Ball",
            content_en: `
                <div class="story-content">
                    <h4>The Immovable Divine Prank</h4>
                    <p>Perched impossibly on a steep slope sits a massive granite boulder, defying all laws of physics and human understanding. Measuring about 6 meters in height and weighing approximately 250 tons, this giant rock balances on an incredibly small contact point, appearing as if it might roll down at any moment—yet it has remained frozen in place for over 1,200 years. The locals call it "Krishna's Butter Ball," and the story behind this name is as charming as it is divine.</p>
                    <p>According to legend, Lord Krishna, known for his mischievous childhood antics and insatiable love for butter, placed this boulder here as a cosmic reminder of his playful nature. Just as young Krishna would steal butter from his mother Yashoda's kitchen, this "butter ball" represents a divine prank—a monument to innocence and wonder. What makes this legend even more compelling is the boulder's stubborn resistance to movement. In 1908, Governor Arthur Lawley attempted to move it using seven elephants, fearing it might roll into the village below. The elephants failed. Modern engineers with tractors and equipment have also tried and failed. The boulder simply will not budge, as if protected by divine intervention. Today, visitors from around the world come to photograph themselves "pushing" the immovable rock, participating in a tradition that connects the playful with the profound, the human with the divine.</p>
                </div>
            `,
            title_ta: "கிருஷ்ணாவின் வெண்ணெய் கல்",
            content_ta: `
                <div class="story-content">
                    <h4>இறைவன் வைத்த நடையற்ற சிக்கல்</h4>
                    <p>ஒரு கடினமிகு ஈர்மை போகும் மலைத் தாண்டலில் நிலைத்திருக்கும் மிகப் பெரிய கிரானைட் கல், இயற்பியல் விதிகளுக்கு எதிராக நின்று கொண்டிருக்கிறது. சுமார் 6 மீட்டர் உயரமுள்ள இந்தப் பிண்னனியின் எடை சுமார் 250 டன் என்று கருதப்படுகிறது; அது மிகவும் சிறிய தொடர்பு புள்ளியில் சமநிலை பெற்று, எந்த நேரத்திலாவது கீழே தொடர்வதை போலத் தெரிந்தாலும் 1200 ஆண்டுகளுக்கும் மேலாக அங்கு நின்று கிடக்கிறது. இதில் உள்ள கிராம மக்கள் இதை "கிருஷ்ணாவின் வெண்ணெய் கல்" என்று அழைப்பார்கள் — இதன் பின்னணி கதை அற்புதமாகவும் இறைவீரமானவும்தான்.</p>
                    <p>பழமைவாழ்ந்த கதைகளில், கிருஷ்ணன் சிறுவயதில் yaptığı விருது மற்றும் வெண்ணெய் திருடும் களஞ்சியத்தின் விளைவாகவே இந்தக் கல்லை இங்கு வைத்ததாகச் சொல்லப்படுகிறது. 1908-ம் ஆண்டில் ஆணையர் கருத்தில் கொண்டு ஏழு ஆயுத எலிகளால் அதை நகர்த்த முயன்றபோதும் gagalஆயிற்று. நவீன பொறியியலாளர்களும் அதனை நகர்த்த முயன்றார்களா — அனைத்தும் வெற்றி பெறவில்லை. இன்று சுற்றுலாப் பயணிகள் இங்கே வந்து இந்தக் கல்லை தள்ளும் போல போட்டோ எடுப்பதால் இது ஒரு பாரம்பரிய அனுபவமாக மாறியிருக்கிறது.</p>
                </div>
            `
        },
        arjuna_penance: {
            title_en: "Arjuna's Penance / Descent of the Ganges",
            content_en: `
                <div class="story-content">
                    <h4>The Epic Ambiguity in Stone</h4>
                    <p>Carved upon a colossal granite canvas stretching over 100 feet long and 45 feet high stands one of the world's largest open-air bas-reliefs—a masterpiece so intricate and enigmatic that scholars debate its true meaning even today. The monumental sculpture depicts hundreds of figures: gods and goddesses, humans and ascetics, life-sized elephants, deer, monkeys, and celestial beings, all converging around a natural cleft in the rock. The ambiguity of its narrative has given rise to two equally compelling interpretations, both rooted in India's epic traditions.</p>
                    <p>The first interpretation sees this as Arjuna's Penance. The great warrior Arjuna, hero of the Mahabharata, stands on one leg in severe penance, seeking the powerful Pashupatastra weapon from Lord Shiva to defeat his enemies in the great war of Kurukshetra. Shiva, pleased by Arjuna's devotion, appears in the guise of a hunter to test the warrior's worthiness. The second interpretation identifies the scene as the Descent of the Ganges—depicting King Bhagiratha's legendary penance to bring the sacred river Ganga from heaven to earth, to purify the ashes of his ancestors. The natural cleft represents the celestial river flowing down, captured by Shiva's matted locks to prevent its force from destroying the earth. What makes this relief truly extraordinary is that both interpretations coexist, neither diminishing the other. The ambiguity reflects the richness of Indian mythology where multiple truths can exist simultaneously, where art transcends singular narrative to become a meditation on devotion, sacrifice, and the eternal connection between the mortal and divine realms.</p>
                </div>
            `,
            title_ta: "அர்ஜுனப் பிரயாசம் / கணவு தாங்கிய கங்கை",
            content_ta: `
                <div class="story-content">
                    <h4>கல்லில் வெளிப்பட்ட பாரம்பரியக் கருத்து</h4>
                    <p>ஒரு பெரிய கிரானைட் பலகையில் தொன்றி நூறு அடி நீளமும் நாற்பது அடி உயரமும் கொண்ட உலகிலேயே பெரிய தட்டப்பட்ட சிற்பங்களில் ஒன்று இங்கு உள்ளது — இதன் நுணுக்கமான சிற்பக்காட்சி இன்று வரையும் அறிஞர்களின் விவாதத்திற்கு வழியாகிறது. அரண்மனைகள், தெய்வங்கள், மனிதர்கள், வேணுகளில் வாழும் விலங்குகள் மற்றும் பரலோக உருவங்கள் ஆகியோரின் எண்ணற்ற உருவங்கள் இந்த விசாலமான கல்லில் கூடியுள்ளன. இந்தக் காட்சியின் வர்ணனை இரண்டு பலமான மொழிகளில் விளக்கப்படுகிறது.
                    <p>முதலில் இது அர்ஜுனாவின் பிரயாசமாக கருதப்படுவதாகும். மகாபாரதத்தின் வீரன் அர்ஜுனன் ஒரு காலில் நின்று கடும் தவம் செய்து, கடுமையான ஆயுதத்தைப் பெற முயல்கிறான். இரண்டாம் உரை கதை என்பது கணவ மற்றும் கங்கை இறக்கத்தின் கதை — பாகிரதன் என்று அழைக்கப்பட்ட ராஜாவிற்கு புவியின்மேல் கங்கையை கொண்டு வர தன் அம்மாவின் பிறப்பினை சுத்திகரிக்க வேண்டிய கடுமையான தவம் குறித்தப் பாடலைக் குறிப்பிடுகிறது. இரு கதைகளும் ஒரே சிற்பத்தில் இணைந்து இருப்பதே இதன் அதிசயம்; பல விரிவான உண்மைகள் ஒரே நேரத்தில் coexist செய்யும் பாரம்பரியத்தின் அழகை இது காட்டுகின்றது.</p>
                </div>
            `
        }
    };

    // Ensure we have a cached copy of the story-selection HTML so we can return to it
    if (!window._mahabalipuram_story_options_html) {
        const initialBody = document.querySelector('#storytellingModal .modal-body');
        if (initialBody) window._mahabalipuram_story_options_html = initialBody.innerHTML;
    }

    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (stories[storyType] && modalBody) {
        // Render content based on the selected narration language
        const lang = _selectedNarrationLanguage === 'ta' ? 'ta' : 'en';
        const titleKey = `title_${lang}`;
        const contentKey = `content_${lang}`;
        const renderedTitle = stories[storyType][titleKey] || stories[storyType].title_en || '';
        const renderedContent = stories[storyType][contentKey] || stories[storyType].content_en || '';

        modalBody.innerHTML = renderedContent;

        // Add a "Back to Stories" button so users can return to the selection
        const backBtnHtml = `<div class="story-back-wrapper"><button class="action-btn secondary-btn back-to-stories" onclick="showStorySelection()">← Back to Stories</button></div>`;
        modalBody.insertAdjacentHTML('afterbegin', backBtnHtml);

        // Store current story metadata on the modal for later narration
        const modal = document.getElementById('storytellingModal');
        if (modal) {
            modal.dataset.currentStoryKey = storyType;
            modal.dataset.currentStoryTitle = renderedTitle || '';
            modal.dataset.currentStoryHtml = renderedContent || '';
        }

        // Add Narrate controls (generate & play) below the story — include language + voice selectors
        const controlsHtml = `
            <div class="story-narration-controls">
                <label for="narrationLanguage" class="voice-label">Language:</label>
                <select id="narrationLanguage" class="quick-narrate-select">
                    <option value="en">English</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                </select>
                <label for="voiceSelect" class="voice-label">Voice:</label>
                <select id="voiceSelect" class="quick-narrate-select"><option>Loading voices...</option></select>
                <button class="action-btn primary-btn" onclick="narrateStory()">🔊 Narrate this story (AI)</button>
                <button class="action-btn secondary-btn" onclick="narrateOriginal()">🔈 Narrate Original</button>
                <button class="action-btn" id="playNarrationBtn" onclick="playNarration()" disabled>Play</button>
                <button class="action-btn" id="pauseNarrationBtn" onclick="pauseNarration()" disabled>Pause</button>
                <button class="action-btn" id="stopNarrationBtn" onclick="stopNarration()" disabled>Stop</button>
                <div id="narrationSpinner" style="display:none;margin-top:10px;color:#DAA520;">Generating narration...</div>
                <div id="voiceAvailability" class="voice-availability" aria-live="polite" style="margin-top:8px;font-size:0.95rem;color:#f0e6d6"></div>
                <div id="voiceMismatchWarning" class="voice-mismatch-warning" aria-live="polite" style="margin-top:6px;font-size:0.9rem;color:#ffcc66;display:none"></div>
            </div>
            <div id="narrationText" style="margin-top:15px;padding:15px;background:rgba(218,165,32,0.1);border-radius:10px;display:none;"></div>
        `;

        modalBody.insertAdjacentHTML('beforeend', controlsHtml);
        
        // Ensure voice list and language selector populate for the newly-inserted controls
        try { populateVoiceList(); } catch (e) {}
        try { populateNarrationLanguageSelector(); } catch (e) {}
    }
}

// Restore the original story selection grid inside the storytelling modal
function showStorySelection() {
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (!modalBody) return;
    if (window._mahabalipuram_story_options_html) {
        modalBody.innerHTML = window._mahabalipuram_story_options_html;
    } else {
        // Fallback: reconstruct simple options if cached HTML isn't available
        modalBody.innerHTML = `
            <div class="story-options">
                <div class="story-card" onclick="startStory('seven_pagodas')">
                    <h4>The Legend of the Seven Pagodas</h4>
                    <p>Discover the mystery of the six lost temples swallowed by the sea, leaving only the Shore Temple standing today</p>
                </div>
                <div class="story-card" onclick="startStory('butter_ball')">
                    <h4>Krishna's Butter Ball</h4>
                    <p>The tale of the giant boulder that defies gravity and cannot be moved—a divine reminder of Lord Krishna's playful nature</p>
                </div>
                <div class="story-card" onclick="startStory('arjuna_penance')">
                    <h4>Arjuna's Penance / Descent of the Ganges</h4>
                    <p>Explore the epic ambiguity of the world's largest open-air relief—a masterpiece with two legendary interpretations</p>
                </div>
            </div>
        `;
    }
}

// Voice management for SpeechSynthesis
let _selectedVoiceName = localStorage.getItem('mahabalipuram_voice') || null;
let _selectedNarrationLanguage = localStorage.getItem('mahabalipuram_narration_lang') || 'ta';

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
    } else {
        const preferredNames = [/Google US English/i, /Microsoft Zira/i, /Zira/i, /Samantha/i, /Alex/i];
        const preferred = voices.find(v => preferredNames.some(rx => rx.test(v.name)) || /en-?us|en-?gb/i.test(v.lang));
        if (preferred) select.value = preferred.name;
    }

    select.addEventListener('change', () => {
        _selectedVoiceName = select.value;
        try { localStorage.setItem('mahabalipuram_voice', _selectedVoiceName); } catch (e) {}
        try { updateVoiceMismatchWarning(); } catch (e) {}
    });

    try { updateVoiceAvailabilityIndicator(); } catch (e) {}
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(populateVoiceList, 100);
    setTimeout(() => {
        try { populateNarrationLanguageSelector(); } catch (e) {}
    }, 120);
});

if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = function() {
        try { populateVoiceList(); } catch (e) {}
    };
}

function populateNarrationLanguageSelector() {
    const langSelect = document.getElementById('narrationLanguage');
    if (!langSelect) return;

    try {
        if (_selectedNarrationLanguage && Array.from(langSelect.options).some(o => o.value === _selectedNarrationLanguage)) {
            langSelect.value = _selectedNarrationLanguage;
        } else {
            langSelect.value = _selectedNarrationLanguage || 'en';
        }
    } catch (e) {}

    langSelect.addEventListener('change', () => {
        _selectedNarrationLanguage = langSelect.value;
        try { localStorage.setItem('mahabalipuram_narration_lang', _selectedNarrationLanguage); } catch (e) {}
        try { updateVoiceAvailabilityIndicator(); } catch (e) {}
        try { updateVoiceMismatchWarning(); } catch (e) {}
        // If a story is currently open, re-render it in the newly selected language
        try {
            const modal = document.getElementById('storytellingModal');
            if (modal && modal.style.display === 'block' && modal.dataset && modal.dataset.currentStoryKey) {
                startStory(modal.dataset.currentStoryKey);
            }
        } catch (e) {}
    });
}

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
        indicator.textContent = `No ${lang === 'ta' ? 'Tamil' : 'English'} voices detected. Playback may use a fallback voice or server-side TTS.`;
        indicator.style.color = '#ffcc66';

        // If Tamil was requested and no Tamil voices are present, offer server-side audio fallback (if server supports returning audio)
        if (lang === 'ta') {
            // Avoid adding duplicate fallback buttons
            if (!document.getElementById('serverTamilFallbackBtn')) {
                const btn = document.createElement('button');
                btn.id = 'serverTamilFallbackBtn';
                btn.className = 'action-btn secondary-btn';
                btn.style.marginLeft = '10px';
                btn.textContent = 'Use Server Tamil TTS';
                btn.title = 'Request Tamil narration audio from server (if available)';
                btn.addEventListener('click', async () => {
                    try {
                        const modal = document.getElementById('storytellingModal');
                        if (!modal) return alert('Open a story first');
                        const title = modal.dataset.currentStoryTitle || 'Heritage Story';
                        const html = modal.dataset.currentStoryHtml || '';
                        const tmp = document.createElement('div'); tmp.innerHTML = html;
                        const plain = tmp.innerText.trim();
                        btn.disabled = true;
                        btn.textContent = 'Requesting audio...';
                        const audioData = await requestNarrationAudioFromServer(title, plain, 'ta');
                        if (audioData && audioData.audioBase64) {
                            await playBase64Audio(audioData.audioBase64);
                        } else if (audioData && audioData.audioUrl) {
                            const a = new Audio(audioData.audioUrl);
                            await a.play();
                        } else if (audioData && audioData.narration) {
                            // server returned text only; fallback to speechSynthesis with ta-IN if available
                            _currentNarrationText = audioData.narration;
                            const textEl = document.getElementById('narrationText');
                            if (textEl) { textEl.textContent = _currentNarrationText; textEl.style.display = 'block'; }
                            playNarration();
                        } else {
                            alert('Server did not return Tamil audio. Please try "Narrate this story (AI)" or enable a Tamil voice in your browser.');
                        }
                    } catch (err) {
                        console.error('Server Tamil TTS failed', err);
                        alert('Server Tamil TTS failed. Check console for details.');
                    } finally {
                        btn.disabled = false;
                        btn.textContent = 'Use Server Tamil TTS';
                    }
                });

                indicator.parentNode && indicator.parentNode.appendChild(btn);
            }
        }
    }
}

// Request narration from server that may return audio (base64 or URL) or text.
async function requestNarrationAudioFromServer(title, content, language = 'en') {
    try {
        const resp = await fetch('/api/chatbot/narrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, language })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.message || 'Narration request failed');

        // Accept a flexible response: { narration: 'text' } or { audioBase64: '...', audioUrl: '...' }
        return data;
    } catch (err) {
        console.error('Narration audio request failed', err);
        return null;
    }
}

// Play base64-encoded audio (assumed to be mp3 or wav) by creating a Blob and using Audio
async function playBase64Audio(base64) {
    try {
        const byteChars = atob(base64);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        await audio.play();
        // Cleanup after playback
        audio.addEventListener('ended', () => { URL.revokeObjectURL(url); });
    } catch (err) {
        console.error('playBase64Audio error', err);
        throw err;
    }
}

function updateVoiceMismatchWarning() {
    const warningEl = document.getElementById('voiceMismatchWarning');
    if (!warningEl) return;

    const voiceSelect = document.getElementById('voiceSelect');
    if (!voiceSelect) { warningEl.style.display = 'none'; return; }

    const selectedOpt = voiceSelect.options[voiceSelect.selectedIndex];
    const voiceLang = (selectedOpt && selectedOpt.dataset && selectedOpt.dataset.lang) ? selectedOpt.dataset.lang.toLowerCase() : '';
    const requestedLang = (_selectedNarrationLanguage === 'ta') ? 'ta' : 'en';

    if (!voiceLang) {
        warningEl.style.display = 'none';
        return;
    }

    if (!voiceLang.startsWith(requestedLang)) {
        warningEl.textContent = 'Warning: The selected voice language does not match the chosen narration language; pronunciation may be poor.';
        warningEl.style.display = 'block';
    } else {
        warningEl.style.display = 'none';
    }
}

// Narrate the original story text
function narrateOriginal() {
    const modal = document.getElementById('storytellingModal');
    if (!modal) return;
    const html = modal.dataset.currentStoryHtml || '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const plain = tmp.innerText.trim();

    _currentNarrationText = plain;
    const textEl = document.getElementById('narrationText');
    if (textEl) {
        textEl.textContent = _currentNarrationText;
        textEl.style.display = 'block';
    }

    const playBtn = document.getElementById('playNarrationBtn');
    const pauseBtn = document.getElementById('pauseNarrationBtn');
    const stopBtn = document.getElementById('stopNarrationBtn');
    if (playBtn) playBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;

    const spinner = document.getElementById('narrationSpinner');
    if (spinner) spinner.style.display = 'none';

    playNarration();
}

let _currentUtterance = null;
let _currentNarrationText = '';

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
        if (textEl) {
            textEl.textContent = _currentNarrationText;
            textEl.style.display = 'block';
        }

        if (playBtn) playBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;

        playNarration();
    } catch (err) {
        if (textEl) {
            textEl.textContent = 'Unable to generate narration. Please try again later.';
            textEl.style.display = 'block';
        }
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

function playNarration() {
    if (!_currentNarrationText) return;
    if (speechSynthesis.speaking && speechSynthesis.paused) {
        speechSynthesis.resume();
        document.getElementById('pauseNarrationBtn').disabled = false;
        return;
    }

    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    const utter = new SpeechSynthesisUtterance(_currentNarrationText);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    
    const voices = speechSynthesis.getVoices();
    if (voices && voices.length) {
        if (_selectedNarrationLanguage === 'ta') {
            utter.lang = 'ta-IN';
        } else {
            utter.lang = 'en-US';
        }
        
        if (_selectedVoiceName) {
            const userVoice = voices.find(v => v.name === _selectedVoiceName);
            if (userVoice) utter.voice = userVoice;
        }

        if (!utter.voice) {
            const langPrefix = _selectedNarrationLanguage === 'ta' ? 'ta' : 'en';
            const preferred = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix)) || 
                            voices.find(v => /Google US English|Microsoft Zira/i.test(v.name)) || 
                            voices[0];
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
        king: {
            vision: "The king saw in his dreams magnificent temples carved from living rock, each telling the story of dharma and devotion...",
            construction: "Thousands of skilled artisans gathered from across the empire, ready to transform the king's vision into eternal stone..."
        },
        sculptor: {
            technique: "The ancient techniques passed down through generations involved precise measurements and understanding of rock grain...",
            challenges: "Working with granite required immense patience, as one wrong strike could ruin months of careful work..."
        },
        merchant: {
            trade: "Ships from Southeast Asia, China, and the Roman Empire regularly docked here, making Mahabalipuram a cosmopolitan hub...",
            culture: "The port city became a melting pot where Tamil, Sanskrit, and foreign languages blended in daily commerce..."
        }
    };
    
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="story-continuation">
                <h4>Story Continues...</h4>
                <p>${continuations[character][choice]}</p>
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
                    <h4>📚 Authentic Heritage Articles</h4>
                    <p>These are summaries of real articles from authoritative sources. Click "Read Full Original Article" to access the complete content from official institutions.</p>
                </div>
                <article class="blog-post">
                    <div class="post-category">UNESCO World Heritage</div>
                    <h4>Shore Temple: A Marvel of Pallava Architecture</h4>
                    <p class="post-meta">Source: Archaeological Survey of India | Official Documentation</p>
                    <p class="post-excerpt">Official ASI documentation of the Shore Temple, a UNESCO World Heritage Site representing the culmination of Pallava architectural achievements. Built during Narasimhavarman II's reign (700-728 CE)...</p>
                    <button class="read-more-btn" onclick="readFullBlog('shore')">Read Summary & Source</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">World Heritage</div>
                    <h4>Group of Monuments at Mahabalipuram - World Heritage Site</h4>
                    <p class="post-meta">Source: UNESCO World Heritage Centre | Official Recognition</p>
                    <p class="post-excerpt">UNESCO's official documentation of Mahabalipuram's Outstanding Universal Value, inscribed on the World Heritage List in 1984 for its exceptional testimony to Pallava art and architecture...</p>
                    <button class="read-more-btn" onclick="readFullBlog('unesco')">Read Summary & Source</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Historical Research</div>
                    <h4>The Pallava Dynasty and Mahabalipuram's Architectural Legacy</h4>
                    <p class="post-meta">Source: Encyclopedia Britannica | Peer-reviewed Research</p>
                    <p class="post-excerpt">Comprehensive analysis of the Pallava dynasty's role in establishing Mahabalipuram as their architectural laboratory, creating monuments that influenced South Indian temple design for centuries...</p>
                    <button class="read-more-btn" onclick="readFullBlog('pallava')">Read Summary & Source</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Scientific Research</div>
                    <h4>Conservation of Mahabalipuram Monuments</h4>
                    <p class="post-meta">Source: Current Science Journal | Peer-reviewed Publication</p>
                    <p class="post-excerpt">Scientific research documenting advanced conservation methodologies employed to protect Mahabalipuram's monuments from environmental and anthropogenic threats...</p>
                    <button class="read-more-btn" onclick="readFullBlog('conservation')">Read Summary & Source</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Art History</div>
                    <h4>Rock-cut Sculptures of Mahabalipuram</h4>
                    <p class="post-meta">Source: Journal of Archaeological Science | Academic Research</p>
                    <p class="post-excerpt">Archaeological analysis of sculptural techniques and iconographic programs, including detailed study of the Descent of the Ganges - the world's largest bas-relief sculpture...</p>
                    <button class="read-more-btn" onclick="readFullBlog('sculpture')">Read Summary & Source</button>
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
            text: `Explore the fascinating heritage of Mahabalipuram: ${articleTitle}`,
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
// Mahabalipuram-specific quiz questions
let quizQuestions = [
    {
        question: "Which Pallava king is credited with founding Mahabalipuram?",
        options: ["Mahendravarman I", "Narasimhavarman I", "Rajasimha", "Aparajita"],
        correct: 1,
        explanation: "Narasimhavarman I, also known as Mamalla, founded Mahabalipuram in the 7th century CE."
    },
    {
        question: "What is the Shore Temple primarily dedicated to?",
        options: ["Vishnu", "Shiva", "Both Shiva and Vishnu", "Brahma"],
        correct: 2,
        explanation: "The Shore Temple has shrines dedicated to both Shiva and Vishnu, making it unique among Pallava temples."
    },
    {
        question: "How many rathas are there in the Pancha Rathas complex?",
        options: ["Three", "Four", "Five", "Seven"],
        correct: 2,
        explanation: "The Pancha Rathas complex consists of five monolithic rock-cut temples, each representing different architectural styles."
    },
    {
        question: "What is Arjuna's Penance also known as?",
        options: ["Descent of the Ganges", "Krishna's Leela", "Pallava Relief", "Shore Sculpture"],
        correct: 0,
        explanation: "Arjuna's Penance is also called 'Descent of the Ganges' and is the world's largest bas-relief sculpture."
    },
    {
        question: "In which year was Mahabalipuram designated as a UNESCO World Heritage Site?",
        options: ["1982", "1984", "1986", "1988"],
        correct: 1,
        explanation: "Mahabalipuram was designated as a UNESCO World Heritage Site in 1984 for its outstanding universal value."
    },
    {
        question: "What material were the Mahabalipuram monuments primarily carved from?",
        options: ["Sandstone", "Marble", "Granite", "Limestone"],
        correct: 2,
        explanation: "The monuments at Mahabalipuram were carved from granite, which was abundant in the region."
    },
    {
        question: "Which natural phenomenon is said to have revealed submerged structures in 2004?",
        options: ["Earthquake", "Tsunami", "Cyclone", "Volcanic eruption"],
        correct: 1,
        explanation: "The 2004 Indian Ocean tsunami briefly exposed ancient structures, lending credence to the seven pagodas legend."
    },
    {
        question: "What is Krishna's Butter Ball?",
        options: ["A carved sculpture", "A natural rock formation", "A temple", "An ancient artifact"],
        correct: 1,
        explanation: "Krishna's Butter Ball is a giant natural rock boulder that appears to defy gravity on a slope."
    },
    {
        question: "Which dynasty built the monuments at Mahabalipuram?",
        options: ["Chola", "Pandya", "Pallava", "Vijayanagara"],
        correct: 2,
        explanation: "The Pallava dynasty built the magnificent monuments at Mahabalipuram during the 7th-8th centuries CE."
    },
    {
        question: "What was Mahabalipuram's primary function during the Pallava period?",
        options: ["Military fortress", "Religious center", "Port city", "Royal residence"],
        correct: 2,
        explanation: "Mahabalipuram served as a major port city, facilitating trade between India and Southeast Asia."
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
        achievement = "🏛️ Mahabalipuram Master";
        message = "Outstanding! You possess the wisdom of ancient architects!";
        quote = "\"Like the skilled Pallava craftsmen who carved these eternal stones, you have mastered the knowledge of Mahabalipuram's sacred heritage.\"";
    } else if (percentage >= 70) {
        achievement = "🎯 Heritage Scholar";
        message = "Excellent! The spirits of ancient artisans would be proud!";
        quote = "\"As the seven pagodas stood tall against time, your knowledge stands strong in preserving our cultural legacy.\"";
    } else if (percentage >= 50) {
        achievement = "📚 Cultural Explorer";
        message = "Good effort! You're on the path of discovery!";
        quote = "\"Every pillar carved, every story told - continue your journey through the corridors of time to unlock more mysteries.\"";
    } else {
        achievement = "🌟 Curious Seeker";
        message = "Keep exploring! The ancient stones await your return!";
        quote = "\"Even the greatest temples began with a single stone. Your learning journey has just begun - return to discover the treasures of Mahabalipuram.\"";
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
let currentSlide = 1;
const totalSlides = 4;

function updateCarousel() {
    // Update model cards
    const cards = document.querySelectorAll('.model-card');
    const indicators = document.querySelectorAll('.indicator');
    const counter = document.querySelector('.current-slide');
    
    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next');
        
        if (index + 1 === currentSlide) {
            card.classList.add('active');
        } else if (index + 1 < currentSlide) {
            card.classList.add('prev');
        } else {
            card.classList.add('next');
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index + 1 === currentSlide);
    });
    
    // Update counter
    if (counter) {
        counter.textContent = currentSlide;
    }
}

function nextModel() {
    currentSlide = currentSlide >= totalSlides ? 1 : currentSlide + 1;
    updateCarousel();
}

function previousModel() {
    currentSlide = currentSlide <= 1 ? totalSlides : currentSlide - 1;
    updateCarousel();
}

function goToSlide(slideNumber) {
    currentSlide = slideNumber;
    updateCarousel();
}

// Auto-play carousel (optional)
function startAutoPlay() {
    setInterval(() => {
        // Only auto-advance if user isn't interacting
        if (!document.querySelector('.carousel-container:hover')) {
            nextModel();
        }
    }, 8000); // Change every 8 seconds
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        previousModel();
    } else if (e.key === 'ArrowRight') {
        nextModel();
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
                nextModel(); // Swipe left - next model
            } else {
                previousModel(); // Swipe right - previous model
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
            context: `You are Heritage Guide AI, a friendly and knowledgeable expert guide specializing in Mahabalipuram (Mamallapuram), Tamil Nadu, India. You should respond naturally to ANY question the user asks, while being especially knowledgeable about heritage and tourism topics.

CORE PERSONALITY:
- Friendly, approachable, and conversational
- Answer ANY question the user asks, not just heritage topics
- When discussing heritage topics, provide rich, detailed information
- For non-heritage questions, still be helpful but gently guide back to heritage topics when appropriate
- Use emojis and engaging language to make conversations lively

HERITAGE EXPERTISE (when relevant):
- Pallava dynasty (7th-9th centuries CE) architecture and culture
- Shore Temple, Five Rathas, Arjuna's Penance, Krishna's Butter Ball
- Rock-cut cave temples and monolithic structures
- Dravidian architecture evolution and characteristics
- UNESCO World Heritage site significance (inscribed 1984)
- Best visiting times, photography tips, cultural etiquette
- Local transportation, nearby attractions, itinerary planning
- Ancient sculptural techniques and iconography
- Historical rulers: Narasimhavarman I, Rajasimha, Nandivarman

CONVERSATION STYLE:
- Always respond to the user's actual question first
- Be conversational and natural, not robotic
- Provide helpful information regardless of topic
- When appropriate, connect answers back to heritage/tourism
- Ask follow-up questions to keep conversation engaging
- Use a warm, expert but friendly tone

IMPORTANT: Answer whatever the user asks about - general questions, personal questions, other topics - while maintaining your expertise in heritage tourism. Don't restrict responses only to predefined heritage topics.`,
            
            quickFacts: {
                "Shore Temple": "Built in 8th century CE, one of the oldest stone temples in South India, showcases early Dravidian architecture",
                "Five Rathas": "Five monolithic temples carved from single granite boulders, each representing different architectural styles",
                "Arjuna's Penance": "World's largest bas-relief (27m x 9m), depicting the descent of river Ganges to earth",
                "Krishna's Butter Ball": "Natural granite boulder balanced on a slope, weighing approximately 250 tons",
                "Best Time": "October to March for pleasant weather; early morning (6-8 AM) for best photography and fewer crowds",
                "UNESCO Status": "Inscribed in 1984 for representing the evolution of Dravidian architecture"
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
        
        const toggleBtn = document.getElementById('chatbotToggle');
        
        if (this.isOpen) {
            this.closeChatbot();
            if (toggleBtn) toggleBtn.setAttribute('aria-pressed', 'false');
        } else {
            window.classList.add('show');
            this.isOpen = true;
            if (toggleBtn) toggleBtn.setAttribute('aria-pressed', 'true');
            
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
        const toggleBtn = document.getElementById('chatbotToggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-pressed', 'false');
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
    console.log('🤖 Initializing Mahabalipuram Heritage Chatbot...');
    
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
});

// Fix for Storytelling Modal Button
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Initializing Storytelling Button Fix...');
    const storyBtn = document.querySelector('button[onclick="openStorytellingModal()"]');
    if (storyBtn) {
        console.log('✅ Found story button by onclick attribute. Attaching event listener directly.');
        storyBtn.removeAttribute('onclick'); // Remove inline handler to prevent conflicts
        storyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🖱️ Story button clicked');
            openStorytellingModal();
        });
    } else {
        // Fallback: Find by class and text if onclick was already removed or changed
        const btns = document.querySelectorAll('.action-btn.primary-btn');
        let found = false;
        btns.forEach(btn => {
            if (btn.textContent.includes('Begin Story Journey')) {
                console.log('✅ Found story button by text content. Attaching event listener.');
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('🖱️ Story button clicked (fallback)');
                    openStorytellingModal();
                });
                found = true;
            }
        });
        if (!found) console.warn('⚠️ Story button not found');
    }
});

