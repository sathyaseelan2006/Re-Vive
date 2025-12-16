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

// Voice management for SpeechSynthesis
let _selectedVoiceName = localStorage.getItem('keeladi_voice') || null;
let _selectedNarrationLanguage = localStorage.getItem('keeladi_narration_lang') || 'ta';
let _currentUtterance = null;
let _currentNarrationText = '';

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
        try { localStorage.setItem('keeladi_voice', _selectedVoiceName); } catch (e) {}
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
        try { localStorage.setItem('keeladi_narration_lang', _selectedNarrationLanguage); } catch (e) {}
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

        if (lang === 'ta') {
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

async function requestNarrationAudioFromServer(title, content, language = 'en') {
    try {
        const resp = await fetch('/api/chatbot/narrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, language })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.message || 'Narration request failed');
        return data;
    } catch (err) {
        console.error('Narration audio request failed', err);
        return null;
    }
}

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

function startStory(storyType) {
    const stories = {
        merchant: {
            title_en: "The Sangam Trader's Tale",
            content_en: `
                <div class="story-content">
                    <h4>A Merchant in Ancient Keeladi</h4>
                    <p>The year is 500 BCE. A prosperous merchant named Chattan walks through Keeladi's bustling marketplace, his hands bearing Tamil-Brahmi inscribed pottery recording the day's trade. Roman gold coins jingle in his pouch...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('merchant', 'trade')" class="story-choice-btn">Follow the Trade Routes</button>
                        <button onclick="continueStory('merchant', 'market')" class="story-choice-btn">Explore the Marketplace</button>
                    </div>
                </div>
            `,
            title_ta: "சங்க கால வணிகரின் கதை",
            content_ta: `
                <div class="story-content">
                    <h4>பண்டைய கீழடியில் ஒரு வணிகர்</h4>
                    <p>கி.மு. 500 ஆம் ஆண்டு. சாத்தன் என்ற வளமான வணிகர் கீழடியின் பரபரப்பான சந்தையில் நடக்கிறார், அவரது கைகளில் அன்றைய வர்த்தகத்தைப் பதிவு செய்யும் தமிழ்-பிராமி பொறிக்கப்பட்ட மட்பாண்டங்கள் உள்ளன. ரோமானிய தங்க நாணயங்கள் அவரது பையில் ஒலிக்கின்றன...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('merchant', 'trade')" class="story-choice-btn">வர்த்தக வழிகளைப் பின்தொடரவும்</button>
                        <button onclick="continueStory('merchant', 'market')" class="story-choice-btn">சந்தையை ஆராயுங்கள்</button>
                    </div>
                </div>
            `
        },
        scribe: {
            title_en: "The Tamil-Brahmi Scholar",
            content_en: `
                <div class="story-content">
                    <h4>Chronicles of an Ancient Scribe</h4>
                    <p>Seated in a well-lit workshop, the scribe carefully inscribes Tamil-Brahmi letters onto pottery. Each mark preserves Tamil language and culture for millennia to come. This is the dawn of written Tamil literature...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('scribe', 'script')" class="story-choice-btn">Learn the Ancient Script</button>
                        <button onclick="continueStory('scribe', 'literature')" class="story-choice-btn">Discover Tamil Literature</button>
                    </div>
                </div>
            `,
            title_ta: "தமிழ்-பிராமி அறிஞர்",
            content_ta: `
                <div class="story-content">
                    <h4>ஒரு பண்டைய எழுத்தரின் வரலாறு</h4>
                    <p>நன்கு ஒளிரும் பட்டறையில் அமர்ந்து, எழுத்தர் கவனமாக மட்பாண்டங்களில் தமிழ்-பிராமி எழுத்துக்களைப் பொறிக்கிறார். ஒவ்வொரு குறியீடும் தமிழ் மொழியையும் கலாச்சாரத்தையும் ஆயிரக்கணக்கான ஆண்டுகளாகப் பாதுகாக்கிறது. இது எழுதப்பட்ட தமிழ் இலக்கியத்தின் விடியல்...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('scribe', 'script')" class="story-choice-btn">பண்டைய எழுத்துமுறையைக் கற்றுக்கொள்ளுங்கள்</button>
                        <button onclick="continueStory('scribe', 'literature')" class="story-choice-btn">தமிழ் இலக்கியத்தைக் கண்டறியவும்</button>
                    </div>
                </div>
            `
        },
        archaeologist: {
            title_en: "The Great Discovery",
            content_en: `
                <div class="story-content">
                    <h4>Unearthing Keeladi's Secrets</h4>
                    <p>Year 2015. Dr. Rajesh brushes away 2,600 years of earth to reveal a pottery fragment. As he cleans it, Tamil-Brahmi letters emerge - rewriting everything we thought we knew about ancient Tamil civilization...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('archaeologist', 'discovery')" class="story-choice-btn">Witness the Discovery</button>
                        <button onclick="continueStory('archaeologist', 'significance')" class="story-choice-btn">Understand the Significance</button>
                    </div>
                </div>
            `,
            title_ta: "மகத்தான கண்டுபிடிப்பு",
            content_ta: `
                <div class="story-content">
                    <h4>கீழடியின் ரகசியங்களை வெளிக்கொணர்தல்</h4>
                    <p>ஆண்டு 2015. டாக்டர் ராஜேஷ் 2,600 ஆண்டுகால மண்ணை அகற்றி ஒரு மட்பாண்டத் துண்டைக் கண்டுபிடிக்கிறார். அவர் அதைச் சுத்தம் செய்யும்போது, தமிழ்-பிராமி எழுத்துக்கள் வெளிப்படுகின்றன - பண்டைய தமிழ் நாகரிகத்தைப் பற்றி நாம் அறிந்த அனைத்தையும் மாற்றி எழுதுகின்றன...</p>
                    
                    <div class="story-choices">
                        <button onclick="continueStory('archaeologist', 'discovery')" class="story-choice-btn">கண்டுபிடிப்பைக் காணுங்கள்</button>
                        <button onclick="continueStory('archaeologist', 'significance')" class="story-choice-btn">முக்கியத்துவத்தைப் புரிந்து கொள்ளுங்கள்</button>
                    </div>
                </div>
            `
        }
    };
    
    // Ensure we have a cached copy of the story-selection HTML so we can return to it
    if (!window._keeladi_story_options_html) {
        const initialBody = document.querySelector('#storytellingModal .modal-body');
        if (initialBody) window._keeladi_story_options_html = initialBody.innerHTML;
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
        const backText = lang === 'ta' ? '← கதைகளுக்குத் திரும்பு' : '← Back to Stories';
        const backBtnHtml = `<div class="story-back-wrapper"><button class="action-btn secondary-btn back-to-stories" onclick="showStorySelection()">${backText}</button></div>`;
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
    if (window._keeladi_story_options_html) {
        modalBody.innerHTML = window._keeladi_story_options_html;
    } else {
        // Fallback: reconstruct simple options if cached HTML isn't available
        modalBody.innerHTML = `
            <div class="story-options">
                <div class="story-card" onclick="startStory('merchant')">
                    <h4>?? The Merchant's Journey</h4>
                    <p>Follow a Sangam-era trader through ancient Keeladi's bustling markets, international trade networks, and cultural exchanges</p>
                </div>
                <div class="story-card" onclick="startStory('scribe')">
                    <h4>?? The Scribe's Chronicle</h4>
                    <p>Experience the development of Tamil-Brahmi script through a scholar's daily life and literary pursuits</p>
                </div>
                <div class="story-card" onclick="startStory('archaeologist')">
                    <h4>?? The Great Discovery</h4>
                    <p>Join modern archaeologists as they uncover Keeladi's 2,600-year-old secrets layer by layer</p>
                </div>
            </div>
        `;
    }
}

function continueStory(character, choice) {
    const continuations = {
        merchant: {
            trade_en: "Caravans from Rome, Sri Lanka, and Southeast Asia regularly arrived in Keeladi, bringing exotic goods and taking back Tamil Nadu's famed textiles and spices...",
            trade_ta: "ரோம், இலங்கை மற்றும் தென்கிழக்கு ஆசியாவிலிருந்து வணிகக் குழுக்கள் தொடர்ந்து கீழடிக்கு வந்து, கவர்ச்சியான பொருட்களைக் கொண்டு வந்து, தமிழ்நாட்டின் புகழ்பெற்ற ஜவுளி மற்றும் மசாலாப் பொருட்களை எடுத்துச் சென்றன...",
            market_en: "The marketplace buzzed with different languages - Tamil, Prakrit, and foreign tongues. Every transaction was recorded on pottery in Tamil-Brahmi script...",
            market_ta: "சந்தை பல்வேறு மொழிகளால் - தமிழ், பிராகிருதம் மற்றும் வெளிநாட்டு மொழிகளால் பரபரப்பாக இருந்தது. ஒவ்வொரு பரிவர்த்தனையும் தமிழ்-பிராமி எழுத்துக்களில் மட்பாண்டங்களில் பதிவு செய்யப்பட்டது..."
        },
        scribe: {
            script_en: "The Tamil-Brahmi script evolved from Brahmi, adapting it perfectly to Tamil phonology. Each inscription preserved Tamil language for future generations...",
            script_ta: "தமிழ்-பிராமி எழுத்துமுறை பிராமியிலிருந்து உருவானது, இது தமிழ் ஒலிப்பு முறைக்கு ஏற்றவாறு மாற்றியமைக்கப்பட்டது. ஒவ்வொரு கல்வெட்டும் எதிர்கால சந்ததியினருக்காக தமிழ் மொழியைப் பாதுகாத்தது...",
            literature_en: "The scribe's work was part of the great Sangam literary tradition, documenting trade, poetry, and daily life in beautiful Tamil verses...",
            literature_ta: "எழுத்தரின் பணி சிறந்த சங்க இலக்கிய மரபின் ஒரு பகுதியாக இருந்தது, வர்த்தகம், கவிதை மற்றும் அன்றாட வாழ்வை அழகான தமிழ் பாடல்களில் ஆவணப்படுத்தியது..."
        },
        archaeologist: {
            discovery_en: "Layer by layer, the excavation revealed urban planning, drainage systems, craft workshops - evidence of a sophisticated 2,600-year-old civilization...",
            discovery_ta: "அடுக்கு அடுக்காக, அகழ்வாராய்ச்சி நகரத் திட்டமிடல், வடிகால் அமைப்புகள், கைவினைப் பட்டறைகள் ஆகியவற்றை வெளிப்படுத்தியது - இது 2,600 ஆண்டுகள் பழமையான நாகரிகத்தின் சான்றாகும்...",
            significance_en: "This discovery pushed Tamil civilization back by centuries, proving ancient Tamil culture was contemporary with the Indus Valley Civilization...",
            significance_ta: "இந்தக் கண்டுபிடிப்பு தமிழ் நாகரிகத்தின் காலத்தை பல நூற்றாண்டுகளுக்கு பின்னோக்கித் தள்ளியது, பண்டைய தமிழ் கலாச்சாரம் சிந்து சமவெளி நாகரிகத்திற்கு சமகாலத்தது என்பதை நிரூபித்தது..."
        }
    };
    
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (modalBody && continuations[character]) {
        const lang = _selectedNarrationLanguage === 'ta' ? 'ta' : 'en';
        const contentKey = `${choice}_${lang}`;
        const content = continuations[character][contentKey] || continuations[character][`${choice}_en`];
        
        const returnText = lang === 'ta' ? 'கதை தேர்வுக்குத் திரும்பு' : 'Return to Story Selection';
        const endText = lang === 'ta' ? 'கதையை முடிக்கவும்' : 'End Story';
        const titleText = lang === 'ta' ? 'கதை தொடர்கிறது...' : 'Story Continues...';

        modalBody.innerHTML = `
            <div class="story-continuation">
                <h4>${titleText}</h4>
                <p>${content}</p>
                <button onclick="startStory('${character}')" class="story-choice-btn">${returnText}</button>
                <button onclick="closeModal('storytellingModal')" class="story-choice-btn">${endText}</button>
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
