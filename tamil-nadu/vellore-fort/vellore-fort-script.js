// Vellore Fort Heritage Site Interactive Features
// Based on Thanjavur template, adapted for Vellore Fort

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
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    event.target.classList.add('active');
}

// Heritage Gallery Scroll Functionality
let currentGalleryIndex = 0;
let cardsPerView = 3;
const totalCards = 4; // Total heritage cards for Vellore Fort

function scrollGallery(direction) {
    const galleryTrack = document.getElementById('galleryTrack');
    if (!galleryTrack) return;
    
    const cardWidth = 320 + 25;
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    
    if (direction === 'left') {
        currentGalleryIndex = Math.max(0, currentGalleryIndex - 1);
    } else {
        currentGalleryIndex = Math.min(maxIndex, currentGalleryIndex + 1);
    }
    
    const translateX = -(currentGalleryIndex * cardWidth);
    galleryTrack.style.transform = `translateX(${translateX}px)`;
    
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

// Touch/swipe support for gallery
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

// Image modal functionality
function openImageModal(imageSrc, caption) {
    const existingModal = document.querySelector('.image-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
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
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
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

// Toggle Read More for pin messages
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

// Check text overflow
function checkTextOverflow() {
    const pinTexts = document.querySelectorAll('.pin-text');
    
    pinTexts.forEach((textElement, index) => {
        const button = textElement.parentElement.querySelector('.read-more-btn');
        if (!button) return;
        
        const originalClamp = textElement.style.webkitLineClamp;
        textElement.style.webkitLineClamp = 'unset';
        
        const fullHeight = textElement.scrollHeight;
        textElement.style.webkitLineClamp = originalClamp || '3';
        const clampedHeight = textElement.scrollHeight;
        
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
    
    currentGalleryIndex = 0;
    const galleryTrack = document.getElementById('galleryTrack');
    if (galleryTrack) {
        galleryTrack.style.transform = 'translateX(0px)';
    }
    updateGalleryNavButtons();
}

// Initialize heritage gallery
function initializeHeritageGallery() {
    const galleryContainer = document.querySelector('.gallery-scroll-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('touchstart', handleGalleryTouchStart, { passive: true });
        galleryContainer.addEventListener('touchmove', handleGalleryTouchMove, { passive: true });
        galleryContainer.addEventListener('touchend', handleGalleryTouchEnd);
    }
    
    updateGalleryNavButtons();
    setTimeout(checkTextOverflow, 100);
    
    window.addEventListener('resize', function() {
        adjustCardsPerView();
        setTimeout(checkTextOverflow, 100);
    });
    adjustCardsPerView();
}

// Storytelling Modal Functions
function openStorytellingModal() {
    openModal('storytellingModal');
}

function startStory(storyType) {
    const stories = {
        vijayanagara: {
            title_en: "The Vijayanagara Empire's Fortress",
            content_en: `
                <div class="story-content">
                    <h4>The Fortress That Bridged Three Faiths</h4>
                    <p>In the 16th century, Vellore Fort stood as a testament to the Vijayanagara Empire's power. Within its massive granite walls, Hindu, Muslim, and Christian communities coexisted, each leaving their mark on this magnificent fortress.</p>
                    <p>The massive granite walls were built using advanced engineering techniques. Workers transported massive stones using elephants and innovative pulley systems. The fort housed the Jalakanteswarar Temple, a mosque, and later a church, symbolizing the religious harmony that characterized the region.</p>
                </div>
            `,
            title_ta: "விஜயநகரப் பேரரசின் கோட்டை",
            content_ta: `
                <div class="story-content">
                    <h4>மூன்று நம்பிக்கைகளை இணைத்த கோட்டை</h4>
                    <p>16ஆம் நூற்றாண்டில், வேலூர் கோட்டை விஜயநகரப் பேரரசின் வலிமைக்கு சாட்சியாக நின்றது. அதன் பிரம்மாண்டமான கிரானைட் சுவர்களுக்குள், இந்து, முஸ்லிம் மற்றும் கிறிஸ்தவ சமூகங்கள் ஒன்றாக வாழ்ந்து, ஒவ்வொன்றும் இந்த அற்புதமான கோட்டையில் தங்கள் அடையாளத்தை விட்டுச் சென்றன.</p>
                    <p>பிரம்மாண்டமான கிரானைட் சுவர்கள் மேம்பட்ட பொறியியல் நுட்பங்களைப் பயன்படுத்தி கட்டப்பட்டன. தொழிலாளர்கள் யானைகள் மற்றும் புதுமையான கப்பி அமைப்புகளைப் பயன்படுத்தி பெரிய கற்களை நகர்த்தினர். கோட்டையில் ஜலகண்டேஸ்வரர் கோவில், ஒரு மசூதி, பின்னர் ஒரு தேவாலயம் ஆகியவை இருந்தன — இப்பகுதியின் மத நல்லிணக்கத்தின் அடையாளமாக.</p>
                </div>
            `
        },
        mutiny: {
            title_en: "The 1806 Vellore Mutiny",
            content_en: `
                <div class="story-content">
                    <h4>The First Major Uprising</h4>
                    <p>On July 10, 1806, the Vellore Fort witnessed the first major armed uprising against British colonial rule in India. Sepoys rose against new uniform regulations that they believed violated their religious practices.</p>
                    <p>The sepoys, numbering over 1,500, overpowered the guards and took control of the fort. This rebellion predated the famous 1857 uprising by 51 years. Though swiftly suppressed by British cavalry from Arcot, the mutiny led to significant changes in British military policy and foreshadowed later independence movements.</p>
                </div>
            `,
            title_ta: "1806 வேலூர் கலகம்",
            content_ta: `
                <div class="story-content">
                    <h4>முதல் பெரிய எழுச்சி</h4>
                    <p>ஜூலை 10, 1806 அன்று, வேலூர் கோட்டை இந்தியாவில் பிரிட்டிஷ் காலனிய ஆட்சிக்கு எதிரான முதல் பெரிய ஆயுதமேந்திய கிளர்ச்சிக்கு சாட்சியானது. புதிய சீருடை விதிமுறைகள் தங்கள் மத நடைமுறைகளை மீறுவதாகக் கருதிய சிப்பாய்கள் எழுச்சி கொண்டனர்.</p>
                    <p>1,500க்கும் மேற்பட்ட சிப்பாய்கள் காவலர்களை மடக்கி கோட்டையைக் கைப்பற்றினர். இந்தக் கிளர்ச்சி புகழ்பெற்ற 1857 எழுச்சிக்கு 51 ஆண்டுகள் முன்னரே நடந்தது. ஆர்காட்டிலிருந்து வந்த பிரிட்டிஷ் குதிரைப்படையால் விரைவாக அடக்கப்பட்டாலும், இந்தக் கலகம் பிரிட்டிஷ் ராணுவக் கொள்கையில் குறிப்பிடத்தக்க மாற்றங்களுக்கு வழிவகுத்தது மற்றும் பிற்கால சுதந்திர இயக்கங்களுக்கு முன்னோடியானது.</p>
                </div>
            `
        },
        architecture: {
            title_en: "Architectural Marvel of Vellore",
            content_en: `
                <div class="story-content">
                    <h4>Engineering Wonder of the 16th Century</h4>
                    <p>The fort's double-walled construction, surrounded by a deep moat, represents some of the finest military architecture in India. The Jalakanteswarar Temple within showcases exquisite Vijayanagara craftsmanship.</p>
                    <p>The double-walled construction with a moat 9 meters deep made the fort nearly impregnable. The walls feature battlements and bastions at strategic positions. The Jalakanteswarar Temple inside showcases intricate Vijayanagara architecture with detailed sculptures, magnificent gopurams, and a stunning kalyana mandapa.</p>
                </div>
            `,
            title_ta: "வேலூரின் கட்டிடக்கலை அதிசயம்",
            content_ta: `
                <div class="story-content">
                    <h4>16ஆம் நூற்றாண்டின் பொறியியல் அதிசயம்</h4>
                    <p>கோட்டையின் இரட்டை சுவர் கட்டுமானம், ஆழமான அகழியால் சூழப்பட்டு, இந்தியாவின் சிறந்த ராணுவ கட்டிடக்கலையின் ஒரு அங்கமாகும். உள்ளே உள்ள ஜலகண்டேஸ்வரர் கோவில் விஜயநகர கைவினைத் திறனை வெளிப்படுத்துகிறது.</p>
                    <p>9 மீட்டர் ஆழமுள்ள அகழியுடன் கூடிய இரட்டை சுவர் கட்டுமானம் கோட்டையை கிட்டத்தட்ட அழிக்க முடியாததாக ஆக்கியது. சுவர்களில் மூலோபாய இடங்களில் கொத்தளங்கள் மற்றும் படைக்கோட்டைகள் உள்ளன. உள்ளே உள்ள ஜலகண்டேஸ்வரர் கோவில் விரிவான சிற்பங்கள், அற்புதமான கோபுரங்கள் மற்றும் அழகிய கல்யாண மண்டபத்துடன் நுணுக்கமான விஜயநகர கட்டிடக்கலையை வெளிப்படுத்துகிறது.</p>
                </div>
            `
        }
    };


    if (!window._vellore_fort_story_options_html) {
        const initialBody = document.querySelector('#storytellingModal .modal-body');
        if (initialBody) window._vellore_fort_story_options_html = initialBody.innerHTML;
    }

    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (stories[storyType] && modalBody) {
        const lang = _selectedNarrationLanguage || 'ta';
        const content = (lang === 'ta') ? stories[storyType].content_ta : stories[storyType].content_en;
        const title = (lang === 'ta') ? stories[storyType].title_ta : stories[storyType].title_en;

        modalBody.innerHTML = content;

        const backText = (lang === 'ta') ? '← கதைகளுக்குத் திரும்பு' : '← Back to Stories';
        const backBtnHtml = `<div class="story-back-wrapper"><button class="action-btn secondary-btn back-to-stories" onclick="showStorySelection()">${backText}</button></div>`;
        modalBody.insertAdjacentHTML('afterbegin', backBtnHtml);

        const modal = document.getElementById('storytellingModal');
        if (modal) {
            modal.dataset.currentStoryKey = storyType;
            modal.dataset.currentStoryTitle = title;
            modal.dataset.currentStoryHtml = content;
        }


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
                <div id="narrationSpinner" style="display:none">Generating...</div>
                <div id="voiceAvailability" class="voice-availability" aria-live="polite" style="margin-top:8px;font-size:0.95rem;color:#f0e6d6"></div>
                <div id="voiceMismatchWarning" class="voice-mismatch-warning" aria-live="polite" style="margin-top:6px;font-size:0.9rem;color:#ffcc66;display:none"></div>
            </div>
            <div id="narrationText"></div>
        `;
        modalBody.insertAdjacentHTML('beforeend', controlsHtml);
        try { populateVoiceList(); } catch (e) {}
        try { populateNarrationLanguageSelector(); } catch (e) {}
    }
}

function showStorySelection() {
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (!modalBody) return;
    if (window._vellore_fort_story_options_html) {
        modalBody.innerHTML = window._vellore_fort_story_options_html;
    }
}

// Voice management for SpeechSynthesis
let _selectedVoiceName = localStorage.getItem('vellore-fort_voice') || null;
let _selectedNarrationLanguage = localStorage.getItem('vellore-fort_narration_lang') || 'ta';

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
        const preferredNames = [/Google US English/i, /Microsoft Zira/i, /Zira/i, /Samantha/i];
        const preferred = voices.find(v => preferredNames.some(rx => rx.test(v.name)) || /en-?us|en-?gb/i.test(v.lang));
        if (preferred) select.value = preferred.name;
    }
    select.addEventListener('change', () => {
        _selectedVoiceName = select.value;
        try { localStorage.setItem('vellore-fort_voice', _selectedVoiceName); } catch (e) {}
    });
    try { updateVoiceAvailabilityIndicator(); } catch (e) {}
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(populateVoiceList, 100);
    setTimeout(() => { try { populateNarrationLanguageSelector(); } catch (e) {} }, 120);
});

if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => { try { populateVoiceList(); } catch (e) {} };
}

function populateNarrationLanguageSelector() {
    const langSelect = document.getElementById('narrationLanguage');
    if (!langSelect) return;
    try {
        if (_selectedNarrationLanguage && Array.from(langSelect.options).some(o => o.value === _selectedNarrationLanguage)) {
            langSelect.value = _selectedNarrationLanguage;
        } else { langSelect.value = 'ta'; }
    } catch (e) {}
    langSelect.addEventListener('change', () => {
        _selectedNarrationLanguage = langSelect.value;
        try { localStorage.setItem('vellore-fort_narration_lang', _selectedNarrationLanguage); } catch (e) {}
        try { updateVoiceAvailabilityIndicator(); } catch (e) {}
        try { updateVoiceMismatchWarning(); } catch (e) {}
        const modal = document.getElementById('storytellingModal');
        if (modal && modal.style.display === 'block' && modal.dataset.currentStoryKey) {
            startStory(modal.dataset.currentStoryKey);
        }
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
        indicator.textContent = `Voice availability: ${matches.length} ${lang === 'ta' ? 'Tamil' : 'English'} voice(s) available.`;
        indicator.style.color = '#DAA520';
    } else {
        indicator.textContent = `No ${lang === 'ta' ? 'Tamil' : 'English'} voices detected. Playback may use a default fallback voice.`;
        indicator.style.color = '#ffcc66';
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
    if (!voiceLang) { warningEl.style.display = 'none'; return; }
    if (!voiceLang.startsWith(requestedLang)) {
        warningEl.textContent = 'Warning: Selected voice language does not match narration language; pronunciation may be poor.';
        warningEl.style.display = 'block';
    } else { warningEl.style.display = 'none'; }
}

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

async function requestNarrationFromServer(title, content, language) {
    const resp = await fetch('/api/chatbot/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, language })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.message || 'Narration request failed');
    return data.narration || '';
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
    const textEl = document.getElementById('narrationText');
    if (spinner) spinner.style.display = 'inline-block';
    try {
        const narration = await requestNarrationFromServer(title, plain, _selectedNarrationLanguage);
        _currentNarrationText = narration || '';
        if (textEl) textEl.textContent = _currentNarrationText;
        if (playBtn) playBtn.disabled = false;
        if (spinner) spinner.style.display = 'none';
        playNarration();
    } catch (err) {
        console.error('Narration failed', err);
        if (spinner) spinner.style.display = 'none';
        if (textEl) textEl.textContent = 'Narration generation failed. Try "Narrate Original" instead.';
    }
}

function playNarration() {
    if (!_currentNarrationText) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(_currentNarrationText);
    const voiceSelect = document.getElementById('voiceSelect');
    if (voiceSelect && voiceSelect.value) {
        const voices = speechSynthesis.getVoices();
        const selected = voices.find(v => v.name === voiceSelect.value);
        if (selected) utterance.voice = selected;
    }
    utterance.rate = 0.9;
    utterance.pitch = 1;
    _currentUtterance = utterance;
    const playBtn = document.getElementById('playNarrationBtn');
    const pauseBtn = document.getElementById('pauseNarrationBtn');
    const stopBtn = document.getElementById('stopNarrationBtn');
    if (playBtn) playBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = false;
    utterance.onend = () => { if (playBtn) playBtn.disabled = false; if (pauseBtn) pauseBtn.disabled = true; };
    speechSynthesis.speak(utterance);
}

function pauseNarration() {
    speechSynthesis.pause();
    const playBtn = document.getElementById('playNarrationBtn');
    const pauseBtn = document.getElementById('pauseNarrationBtn');
    if (playBtn) playBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
}

function stopNarration() {
    speechSynthesis.cancel();
    const playBtn = document.getElementById('playNarrationBtn');
    const pauseBtn = document.getElementById('pauseNarrationBtn');
    const stopBtn = document.getElementById('stopNarrationBtn');
    if (playBtn) playBtn.disabled = false;
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
                    <div class="post-category">Military History</div>
                    <h4>The 1806 Vellore Mutiny: First Spark of Indian Resistance</h4>
                    <p class="post-meta">Historical Research | July 10, 1806</p>
                    <p class="post-excerpt">The Vellore Mutiny of 1806 marked the first major armed uprising against British colonial rule in India, predating the famous 1857 rebellion by half a century...</p>
                    <button class="read-more-btn" onclick="readFullBlog('mutiny')">Read Full Article</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Architecture</div>
                    <h4>Vijayanagara Military Architecture at Vellore</h4>
                    <p class="post-meta">Architectural Study | 16th Century</p>
                    <p class="post-excerpt">Vellore Fort represents the pinnacle of Vijayanagara military architecture, featuring innovative double-wall construction and sophisticated defensive systems...</p>
                    <button class="read-more-btn" onclick="readFullBlog('architecture')">Read Full Article</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Religious Harmony</div>
                    <h4>Three Faiths Under One Fortress: Vellore's Unique Heritage</h4>
                    <p class="post-meta">Cultural Studies | Multicultural Heritage</p>
                    <p class="post-excerpt">The Jalakanteswarar Temple, mosque, and church within Vellore Fort symbolize centuries of religious coexistence and cultural synthesis...</p>
                    <button class="read-more-btn" onclick="readFullBlog('faiths')">Read Full Article</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Royal History</div>
                    <h4>Tipu Sultan's Sons: The Royal Prisoners of Vellore</h4>
                    <p class="post-meta">Historical Documentation | 1799-1806</p>
                    <p class="post-excerpt">After Tipu Sultan's defeat, his family was imprisoned in Vellore Fort. Their presence played a crucial role in the 1806 mutiny...</p>
                    <button class="read-more-btn" onclick="readFullBlog('tipu')">Read Full Article</button>
                </article>
            </div>
        `;
    }
}

function readFullBlog(articleType) {
    const articles = {
        mutiny: {
            title: "The 1806 Vellore Mutiny: First Spark of Indian Resistance",
            category: "Military History",
            date: "July 10, 1806",
            content: `
                <h4>The First Major Armed Uprising</h4>
                <p>On the night of July 10, 1806, Vellore Fort witnessed the first major armed rebellion against British colonial rule in India. This event, predating the famous 1857 uprising by 51 years, marked a significant chapter in India's struggle for independence.</p>
                
                <h5>🔥 Causes of the Mutiny</h5>
                <ul>
                    <li><strong>Religious Interference:</strong> New dress code regulations banned traditional religious symbols</li>
                    <li><strong>Uniform Changes:</strong> Sepoys were forced to wear leather cockades and shave their beards</li>
                    <li><strong>Royal Prisoners:</strong> Presence of Tipu Sultan's sons fueled anti-British sentiment</li>
                    <li><strong>Cultural Disrespect:</strong> Perceived attack on Hindu and Muslim religious practices</li>
                </ul>
                
                <h5>⚔️ The Rebellion</h5>
                <p>Over 1,500 sepoys of the Madras Army revolted, overpowering British guards and taking control of the fort. The mutineers proclaimed Tipu's eldest son as their leader. The rebellion was violently suppressed within hours by cavalry from Arcot, but its impact resonated for decades.</p>
                
                <h5>📜 Historical Significance</h5>
                <p>The Vellore Mutiny exposed deep-seated grievances in the colonial military system and led to significant policy reforms. It demonstrated that seemingly minor cultural insensitivities could spark major uprisings, a lesson that would prove relevant in 1857.</p>
            `
        },
        architecture: {
            title: "Vijayanagara Military Architecture at Vellore",
            category: "Architecture",
            date: "16th Century Heritage",
            content: `
                <h4>Engineering Marvel of South India</h4>
                <p>Vellore Fort stands as one of the finest examples of 16th-century Vijayanagara military architecture, showcasing advanced defensive engineering and aesthetic grandeur.</p>
                
                <h5>🏰 Fortification Features</h5>
                <ul>
                    <li><strong>Double-Wall System:</strong> Inner and outer walls with interlocking defenses</li>
                    <li><strong>Deep Moat:</strong> 9-meter deep moat surrounding the entire fort</li>
                    <li><strong>Granite Construction:</strong> Massive blocks fitted without mortar</li>
                    <li><strong>Strategic Bastions:</strong> Positioned for maximum defensive coverage</li>
                </ul>
                
                <h5>🕌 Jalakanteswarar Temple</h5>
                <p>The temple within the fort is an architectural jewel, featuring intricate Vijayanagara carvings, magnificent gopurams, and a stunning kalyana mandapa with carved pillars depicting mythological scenes.</p>
                
                <h5>🔧 Engineering Innovations</h5>
                <p>The fort's design incorporated water management systems, underground passages, and strategic viewpoints that made it nearly impregnable to medieval siege warfare.</p>
            `
        },
        faiths: {
            title: "Three Faiths Under One Fortress: Vellore's Unique Heritage",
            category: "Religious Harmony",
            date: "Multicultural Heritage",
            content: `
                <h4>A Symbol of Religious Coexistence</h4>
                <p>Vellore Fort uniquely houses places of worship for three major religions - Hinduism, Islam, and Christianity - each representing different periods of the fort's rich history.</p>
                
                <h5>🕉️ Jalakanteswarar Temple (Hindu)</h5>
                <p>Built during the Vijayanagara period, this magnificent temple dedicated to Lord Shiva showcases exquisite architecture and serves as the fort's spiritual heart.</p>
                
                <h5>🕌 The Mosque (Islamic)</h5>
                <p>Evidence of the fort's Islamic period, the mosque reflects the architectural synthesis between Vijayanagara and Islamic styles.</p>
                
                <h5>⛪ St. John's Church (Christian)</h5>
                <p>Built during the British colonial period, the church represents the final layer of Vellore's multi-faith heritage.</p>
                
                <h5>🤝 Cultural Synthesis</h5>
                <p>The presence of these three faiths within one fortress symbolizes centuries of religious tolerance and cultural exchange that characterized pre-modern India.</p>
            `
        },
        tipu: {
            title: "Tipu Sultan's Sons: The Royal Prisoners of Vellore",
            category: "Royal History",
            date: "1799-1806",
            content: `
                <h4>From Royalty to Captivity</h4>
                <p>After Tipu Sultan's defeat and death in the Fourth Anglo-Mysore War (1799), his family was imprisoned in Vellore Fort. Their presence transformed the fort into a focal point of anti-British sentiment.</p>
                
                <h5>👑 The Royal Family</h5>
                <ul>
                    <li><strong>Fateh Hyder:</strong> Tipu's eldest son, proclaimed leader during the 1806 mutiny</li>
                    <li><strong>Extended Family:</strong> Wives, children, and relatives numbering over 300</li>
                    <li><strong>Living Conditions:</strong> Housed in relative comfort but under constant surveillance</li>
                </ul>
                
                <h5>🎭 Role in the Mutiny</h5>
                <p>The princes became symbols of resistance against British rule. Their presence inspired the sepoys' rebellion, though the princes themselves claimed no active role in planning the uprising.</p>
                
                <h5>📖 Later Years</h5>
                <p>After the mutiny, the family was moved to Calcutta. Their story represents the fate of many Indian royal families during the colonial transition.</p>
            `
        }
    };
    
    const modalBody = document.querySelector('#blogModal .modal-body');
    if (articles[articleType] && modalBody) {
        const article = articles[articleType];
        modalBody.innerHTML = `
            <div class="full-article">
                <div class="article-header">
                    <span class="article-category">${article.category}</span>
                    <h3>${article.title}</h3>
                    <p class="article-meta">${article.date}</p>
                </div>
                <div class="article-content">
                    ${article.content}
                </div>
                <div class="article-footer">
                    <button onclick="openBlogModal()" class="back-to-blog-btn">← Back to All Articles</button>
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
let quizQuestions = [
    {
        question: "When was Vellore Fort constructed?",
        options: ["14th century", "15th century", "16th century", "17th century"],
        correct: 2,
        explanation: "Vellore Fort was built in the 16th century by the Vijayanagara Empire, representing their military architectural prowess."
    },
    {
        question: "What year did the famous Vellore Mutiny take place?",
        options: ["1799", "1806", "1857", "1885"],
        correct: 1,
        explanation: "The Vellore Mutiny occurred on July 10, 1806, making it the first major armed uprising against British colonial rule in India."
    },
    {
        question: "The Jalakanteswarar Temple inside the fort is dedicated to which deity?",
        options: ["Vishnu", "Shiva", "Murugan", "Ganesha"],
        correct: 1,
        explanation: "The Jalakanteswarar Temple is dedicated to Lord Shiva and showcases exquisite Vijayanagara architecture."
    },
    {
        question: "How deep is the moat surrounding Vellore Fort?",
        options: ["5 meters", "7 meters", "9 meters", "11 meters"],
        correct: 2,
        explanation: "The moat surrounding Vellore Fort is 9 meters deep, providing formidable protection against invaders."
    },
    {
        question: "Which royal family was imprisoned in Vellore Fort after 1799?",
        options: ["Maratha rulers", "Tipu Sultan's family", "Mughal princes", "Nayak dynasty"],
        correct: 1,
        explanation: "After Tipu Sultan's defeat in 1799, his family including his sons were imprisoned in Vellore Fort."
    },
    {
        question: "What type of construction material was primarily used for the fort?",
        options: ["Red sandstone", "Granite", "Limestone", "Marble"],
        correct: 1,
        explanation: "Vellore Fort was built using massive granite blocks, showcasing the engineering capabilities of the Vijayanagara period."
    },
    {
        question: "The fort represents harmony between how many major religions?",
        options: ["Two", "Three", "Four", "Five"],
        correct: 1,
        explanation: "Vellore Fort houses places of worship for three major religions: Hinduism, Islam, and Christianity."
    },
    {
        question: "Which dynasty built Vellore Fort?",
        options: ["Chola", "Pallava", "Vijayanagara", "Pandya"],
        correct: 2,
        explanation: "The Vijayanagara Empire built Vellore Fort in the 16th century as a key military stronghold."
    },
    {
        question: "What was the primary cause of the 1806 Vellore Mutiny?",
        options: ["Tax increases", "Religious uniform regulations", "Food shortages", "Pay reductions"],
        correct: 1,
        explanation: "The mutiny was triggered by new British uniform regulations that sepoys believed violated their religious practices."
    },
    {
        question: "What architectural style is evident in the Jalakanteswarar Temple?",
        options: ["Dravidian", "Indo-Islamic", "Vijayanagara", "Nayak"],
        correct: 2,
        explanation: "The temple showcases classic Vijayanagara architectural style with intricate carvings and detailed sculptures."
    },
    {
        question: "How many sepoys participated in the 1806 mutiny?",
        options: ["Over 500", "Over 1,000", "Over 1,500", "Over 2,000"],
        correct: 2,
        explanation: "More than 1,500 sepoys of the Madras Army participated in the Vellore Mutiny."
    },
    {
        question: "What unique defensive feature does Vellore Fort have?",
        options: ["Single thick wall", "Double-wall system", "Triple moat", "Underground tunnels only"],
        correct: 1,
        explanation: "Vellore Fort features a sophisticated double-wall system with interlocking defenses, making it nearly impregnable."
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
    
    options.forEach(option => option.disabled = true);
    
    options[selectedIndex].classList.add(selectedIndex === question.correct ? 'correct' : 'incorrect');
    if (selectedIndex !== question.correct) {
        options[question.correct].classList.add('correct');
    }
    
    if (selectedIndex === question.correct) {
        score++;
    }
    
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
        achievement = "🏰 Fortress Master";
        message = "Outstanding! You possess the wisdom of Vijayanagara architects!";
        quote = "\"Like the mighty granite walls of Vellore Fort, your knowledge stands unshakeable against the test of time.\"";
    } else if (percentage >= 70) {
        achievement = "🎯 Heritage Guardian";
        message = "Excellent! The spirit of the 1806 mutiny lives in your knowledge!";
        quote = "\"As the three faiths coexist within these walls, your understanding bridges past and present.\"";
    } else if (percentage >= 50) {
        achievement = "📚 Fort Explorer";
        message = "Good effort! You're discovering Vellore's rich history!";
        quote = "\"Every stone in these walls has a story - continue your journey to uncover them all.\"";
    } else {
        achievement = "🌟 Beginning Seeker";
        message = "Keep exploring! Vellore Fort has many secrets to reveal!";
        quote = "\"Even the greatest fortress began with a single stone. Your learning journey starts here.\"";
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
                <button onclick="startQuiz()" class="action-btn retake-btn">🔄 Retake Quiz</button>
                <button onclick="closeModal('quizModal')" class="action-btn close-btn">✨ Explore More</button>
            </div>
        </div>
    `;
}

// Virtual Tour Functions
function copyTourLink() {
    const tourLink = window.location.href + "?tour=virtual";
    navigator.clipboard.writeText(tourLink).then(() => {
        const button = document.querySelector('.tour-button.secondary');
        const originalText = button.textContent;
        button.textContent = '✓ Link Copied!';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeHeritageGallery();
    
    // Smooth scrolling for navigation
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

document.addEventListener('DOMContentLoaded', function() {
    initializeVelloreFort();
    initializeFortressExperience();
    initializeThreeFaithsTimeline();
});

function initializeVelloreFort() {
    console.log('Initializing Vellore Fort Heritage Site');
    
    addFortressAnimations();
    initializeRampartAnimations();
    createThreeFaithsGallery();
}

function addFortressAnimations() {
    const fortCards = document.querySelectorAll('.sidebar-card.fort-image');
    
    fortCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 10px 30px rgba(255, 140, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(255, 140, 0, 0.2)';
        });
    });
}

function initializeRampartAnimations() {
    const manuscriptPanel = document.querySelector('.manuscript-panel');
    
    if (manuscriptPanel) {
        createVijayanagaraPatterns();
    }
}

function createVijayanagaraPatterns() {
    const patternsContainer = document.createElement('div');
    patternsContainer.className = 'vijayanagara-patterns';
    patternsContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.1;
    `;
    
    // Create architectural patterns
    for (let i = 0; i < 12; i++) {
        const pattern = document.createElement('div');
        pattern.style.cssText = `
            position: absolute;
            width: 4px;
            height: 100%;
            background: linear-gradient(to bottom, 
                rgba(255, 140, 0, 0.3) 0%, 
                rgba(139, 69, 19, 0.5) 50%, 
                rgba(218, 165, 32, 0.3) 100%);
            left: ${i * 8}%;
            animation: rampart-wave ${4 + Math.random() * 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        patternsContainer.appendChild(pattern);
    }
    
    document.querySelector('.manuscript-panel').appendChild(patternsContainer);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rampart-wave {
            0%, 100% { opacity: 0.1; transform: scaleY(0.8); }
            50% { opacity: 0.3; transform: scaleY(1.1); }
        }
    `;
    document.head.appendChild(style);
}

function initializeThreeFaithsTimeline() {
    const timelineData = [
        { period: '16th Century', event: 'Vijayanagara Construction', significance: 'Jalakanteswarar Temple Built' },
        { period: '17th Century', event: 'Muslim Rule', significance: 'Mosque Construction' },
        { period: '18th Century', event: 'Carnatic Wars', significance: 'Strategic Military Position' },
        { period: '19th Century', event: 'British Rule', significance: 'St. John\'s Church Built' },
        { period: '1857', event: 'Indian Rebellion', significance: 'Siege of Vellore' },
        { period: '1947', event: 'Independence', significance: 'Indian Army Garrison' },
        { period: 'Present', event: 'Archaeological Site', significance: 'Museum & Heritage' }
    ];
    
    createTimelineVisualization(timelineData);
}

function createTimelineVisualization(data) {
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'fortress-timeline';
    timelineContainer.style.cssText = `
        margin: 2rem 0;
        padding: 1rem;
        background: linear-gradient(135deg, rgba(255, 140, 0, 0.1), rgba(218, 165, 32, 0.1));
        border-radius: 10px;
        border: 1px solid rgba(255, 140, 0, 0.3);
    `;
    
    const timelineTitle = document.createElement('h3');
    timelineTitle.textContent = 'Vellore Fort Through the Ages';
    timelineTitle.style.cssText = `
        color: var(--vellore-orange);
        text-align: center;
        margin-bottom: 1rem;
        font-family: 'Cinzel Decorative', serif;
    `;
    timelineContainer.appendChild(timelineTitle);
    
    data.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            margin: 0.5rem 0;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            transition: background 0.3s ease;
        `;
        
        timelineItem.innerHTML = `
            <span style="font-weight: bold; color: var(--vellore-orange);">${item.period}</span>
            <span style="color: var(--vellore-gold);">${item.event}</span>
            <span style="font-style: italic; color: var(--vellore-brown);">${item.significance}</span>
        `;
        
        timelineItem.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 140, 0, 0.2)';
        });
        
        timelineItem.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        timelineContainer.appendChild(timelineItem);
    });
    
    // Insert timeline after the narrative scroll
    const narrativeScroll = document.querySelector('.narrative-scroll');
    if (narrativeScroll) {
        narrativeScroll.appendChild(timelineContainer);
    }
}

function initializeFortressExperience() {
    const arButton = document.querySelector('.ar-btn');
    
    if (arButton) {
        arButton.addEventListener('click', function() {
            showFortressARModal();
        });
    }
}

function showFortressARModal() {
    const modal = document.createElement('div');
    modal.className = 'ar-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, var(--vellore-orange), var(--vellore-gold));
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            color: white;
            max-width: 400px;
            margin: 1rem;
        ">
            <h3 style="margin-bottom: 1rem;">🏰 Fortress Heritage AR</h3>
            <p style="margin-bottom: 1rem;">Explore the magnificent Vellore Fort and discover the unique coexistence of three religions within its walls. Walk through centuries of history and witness the architectural marvels of the Vijayanagara Empire.</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: var(--vellore-brown);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                cursor: pointer;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 5000);
}

function createThreeFaithsGallery() {
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'three-faiths-gallery';
    galleryContainer.style.cssText = `
        margin: 2rem 0;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(255, 140, 0, 0.2);
    `;
    
    const galleryTitle = document.createElement('h3');
    galleryTitle.textContent = 'Three Faiths, One Fort';
    galleryTitle.style.cssText = `
        color: var(--vellore-gold);
        text-align: center;
        margin-bottom: 1rem;
        font-family: 'Cinzel Decorative', serif;
    `;
    galleryContainer.appendChild(galleryTitle);
    
    const faiths = [
        { faith: 'Hinduism', structure: 'Jalakanteswarar Temple', period: '16th Century' },
        { faith: 'Islam', structure: 'Mosque', period: '17th Century' },
        { faith: 'Christianity', structure: 'St. John\'s Church', period: '19th Century' }
    ];
    
    faiths.forEach(faith => {
        const faithItem = document.createElement('div');
        faithItem.className = 'faith-item';
        faithItem.style.cssText = `
            padding: 0.5rem;
            margin: 0.3rem 0;
            background: rgba(218, 165, 32, 0.1);
            border-left: 3px solid var(--vellore-orange);
            transition: background 0.3s ease;
        `;
        
        faithItem.innerHTML = `
            <strong style="color: var(--vellore-orange);">${faith.faith}</strong> - 
            <span style="color: var(--vellore-gold);">${faith.structure}</span> 
            <span style="font-style: italic; color: var(--vellore-brown);">(${faith.period})</span>
        `;
        
        faithItem.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(218, 165, 32, 0.2)';
        });
        
        faithItem.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(218, 165, 32, 0.1)';
        });
        
        galleryContainer.appendChild(faithItem);
    });
    
    // Insert gallery after timeline
    const narrativeScroll = document.querySelector('.narrative-scroll');
    if (narrativeScroll) {
        narrativeScroll.appendChild(galleryContainer);
    }
}

// Export functions
window.VelloreFort = {
    initializeSite: initializeVelloreFort,
    showARExperience: showFortressARModal,
    createTimeline: createTimelineVisualization
};
