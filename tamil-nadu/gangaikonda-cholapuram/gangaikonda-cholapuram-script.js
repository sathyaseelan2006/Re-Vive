// Thanjavur Heritage Site Interactive Features
// Consistent with Tamil Nadu heritage theme

// =============================================
// IMAGE LIGHTBOX FUNCTIONALITY
// =============================================

let currentLightboxIndex = 0;
const galleryImages = [];

// Initialize lightbox data
function initializeLightbox() {
    // Get all gallery images
    const imageElements = document.querySelectorAll('.gallery-image');

    imageElements.forEach((img, index) => {
        const card = img.closest('.heritage-card');
        const title = card.querySelector('.card-info h5')?.textContent || 'Heritage Image';
        const description = card.querySelector('.card-info p')?.textContent || '';

        galleryImages.push({
            src: img.src,
            alt: img.alt,
            title: title,
            description: description
        });

        // Add click event to open lightbox
        img.addEventListener('click', () => openLightbox(index));

        // Add keyboard support
        img.setAttribute('tabindex', '0');
        img.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCounter = document.getElementById('lightboxCounter');

    if (lightbox && galleryImages[index]) {
        const imageData = galleryImages[index];

        lightboxImage.src = imageData.src;
        lightboxImage.alt = imageData.alt;
        lightboxTitle.textContent = imageData.title;
        lightboxDescription.textContent = imageData.description;
        lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;

    // Loop around if at ends
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = galleryImages.length - 1;
    } else if (currentLightboxIndex >= galleryImages.length) {
        currentLightboxIndex = 0;
    }

    const imageData = galleryImages[currentLightboxIndex];
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCounter = document.getElementById('lightboxCounter');

    // Add fade animation
    lightboxImage.style.opacity = '0';

    setTimeout(() => {
        lightboxImage.src = imageData.src;
        lightboxImage.alt = imageData.alt;
        lightboxTitle.textContent = imageData.title;
        lightboxDescription.textContent = imageData.description;
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
        lightboxImage.style.opacity = '1';
    }, 150);
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Close lightbox when clicking on background
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('imageLightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLightbox);

// =============================================
// MODAL MANAGEMENT
// =============================================

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
const totalCards = 9; // Total number of heritage cards for Gangaikonda Cholapuram

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
        rajendra: {
            title_en: "Rajendra Chola \"Bringing\" the Ganga",
            content_en: `
                <div class="story-content">
                    <h4>Rajendra Chola "Bringing" the Ganga</h4>
                    <p>In the heat of a Tamil summer, the news spread like fire: "Our king has conquered the North." Rajendra Chola I, the son of Rajaraja, did something that sounded impossible for his time. He did not just win battles; he touched the Ganga itself.</p>
                    
                    <p>Imagine long columns of soldiers returning after years of campaign, their armor dusty, their flags torn, but their spirits burning with pride. Along with them came elephants and horses, but there was something else, something stranger: thousands of pots, carefully sealed, each filled with water from the sacred Ganga. This was not just war booty; it was a message.</p>
                    
                    <p>Rajendra stood in his new capital, still rising from the plains, and watched as these pots were brought before him. Some say he closed his eyes and whispered, "Let the northern Ganga flow in the south." The water was then ceremonially poured into a massive reservoir and sacred wells. From that day, people said the Ganga herself had "come" to Tamil Nadu. That is why they called him "Gangaikonda Chola" – the Chola who brought the Ganga – and the city "Gangaikonda Cholapuram."</p>
                    
                    <p>In your narration, you can show this as a cinematic sequence: drums, conch shells, priests chanting, and the king standing still as the holy water turns an ordinary lake into something legendary.</p>
                </div>
            `,
            title_ta: "கங்கை கொண்ட சோழன் – கங்கை கொண்டு வந்த ராஜேந்திரன்",
            content_ta: `
                <div class="story-content">
                    <h4>கங்கை கொண்ட சோழன் – கங்கை கொண்டு வந்த ராஜேந்திரன்</h4>
                    <p>ராஜராஜன் முதலவன் முடிச்ச பாதையை, இன்னும் தூரம் எடுத்துச் சென்றவன் தான் ராஜேந்திர சோழன். வடஇந்தியாவுல இருந்த அரசர்களை வென்று, படையோட பாதம் கங்கை நதிவரை செஞ்சவன்.</p>
                    
                    <p>அந்தக் காலத்துல, "தென்னாட்டு அரசன் கங்கை வரையோட போய்ட்டான்"னு கேட்டாலே, சாதாரண மக்களுக்கு அது புரியலாமல் போச்சு – அதே நேரம் பெருமையும் கலந்த பயமும்.</p>
                    
                    <p>போர் முடிஞ்ச பிறகு, ராஜேந்திரன் ஒரு வித்தியாசமான ஆணை கொடுத்தான்: "கங்கையின் புனிதத் தண்ணீர் நம்ம நாட்டுக்கு வரணும்." ஆயிரக்கணக்காக மண்ணு குடங்கள் தயார் பண்ணப்பட்டு, கங்கையில் நிரப்பப்பட்டது.</p>
                    
                    <p>கனமான குடங்களை தூக்கிக்கிட்டே, சோழ படை, யானைகள், குதிரைகள் எல்லாம் கூட்டமா தென்னாட்டுக்கு march பண்ணுது – அந்தப் பாதை itself ஒரு ஜெயகோஷ யாத்திரை மாதிரி.</p>
                    
                    <p>புதிய தலைநகரா திட்டமிடப்பட்ட அந்த நிலத்துல, ஒரு பெரும் ஏரி, ஆழமான கிணறு எல்லாம் அமைத்து வச்சிருந்தாங்க. மந்திரிகள், பூசாரிகள், வீரர்கள், பொதுமக்கள் – எல்லாரும் நிற்க, கொங்குகள் ஊத, வேதமந்திரம் ஓசை கலந்து, அந்தக் கங்கைத்தண்ணீர் மெல்ல மெல்ல ஏரிக்குள் ஊற்றப்படும்போது, ராஜேந்திரன் தலையை குனிஞ்சு கண்ணை மூடி நின்றான்னு கதை.</p>
                    
                    <p>அந்த நிமிஷத்தில தான், "வடக்குல ஓடுற கங்கை, இப்போ தென்னாட்டுல உயிரோட இருக்குது"னு மக்கள் மனசில பதஞ்சு போச்சு. அப்படித் தான் அவனுக்கு "கங்கை கொண்ட சோழன்", நகரத்துக்கு "கங்கைகொண்ட சோழபுரம்"ன்னு பேர் வந்தது.</p>
                </div>
            `
        },
        lake: {
            title_en: "The Sacred \"Chola Gangam\" Lake",
            content_en: `
                <div class="story-content">
                    <h4>The Sacred "Chola Gangam" Lake</h4>
                    <p>On the edge of the capital lay a vast water body that villagers did not dare to treat like an ordinary tank. This was the Chola Gangam, a man-made lake, but in people's minds it was something much more. Locals would whisper, "Idhu Ganga thaan… Tamil naatula odura Ganga."</p>
                    
                    <p>Elders told children that when the pots of Ganga water arrived, they were not just poured randomly. The lake was blessed with rituals; priests stood along the bank, chanting mantras as the clear northern water met the still southern reservoir. To those watching, it was as if two distant worlds were joining—Aryavarta of the North and the Tamil country of the South.</p>
                    
                    <p>Over time, people believed that a single sip from this lake could cleanse one's sins, just like bathing in the real Ganga. Some swore that on quiet nights, if you stood near the shore and listened carefully, you could hear the distant echo of northern temple bells and unknown languages carried in the wind, as if the memories of faraway lands were trapped in that water.</p>
                    
                    <p>For narration, you can build an atmosphere of calm mysticism: a child sneaking out at night, an old priest telling him never to play in this "ordinary" water because it is not a simple lake, but the soul of the empire itself.</p>
                </div>
            `,
            title_ta: "சோழ கங்கம் – பாவம் கழுவும் ஏரி",
            content_ta: `
                <div class="story-content">
                    <h4>சோழ கங்கம் – பாவம் கழுவும் ஏரி</h4>
                    <p>அந்தப் பெருங்குளத்துக்கு, சாதாரணமாக "ஏரி"ன்னு யாருமே பார்க்கல. "சோழ கங்கம்" – அப்படின்னு தான் அழைக்க ஆரம்பிச்சாங்க.</p>
                    
                    <p>"வடக்குல இருக்குற கங்கை இங்க தங்கி இருக்கா"ன்னு கலந்த அச்சமும், மரியாதையும், பக்தியும் பசங்க காலத்திலேயே கதையா கேட்டு வளர்ந்தாங்க.</p>
                    
                    <p>மாலையோட கூட்டமா, பெரியவர்கள் அந்தக் குளம் கரைக்கே கூட்டிக்கிட்டு போய், "இந்த நீர் ordinary கிடையாது பா. தூர ஒட்ற கங்கை நதியோட ஜீவனை இங்க கொண்டு வந்திருக்கான் நம்ம ராஜா"ன்னு சொல்லுவாங்க.</p>
                    
                    <p>சிலர், "இந்த நீர்ல சிறிது குடிச்சாலே பாபம் நீங்கிவிடும், குலம் தூய்மையா இருக்கும்"னு நம்பிக்கையோட இருந்தாங்க.</p>
                    
                    <p>சிலர் சொல்வாங்க – ராத்திரி ஆழமா அமைதியா இருக்கும் நேரத்துல, குளம் கரையில நின்னு காதை காற்றுக்கு கொடுத்து நின்னா, தொலைத்தூர வடஇந்தியால இருக்கும் கோவிலோட மணி ஓசை மாதிரி ஒரு நுணுக்கமான சத்தம் கேட்கும் போல இருக்கும். அப்படின்னு சொன்னா, listener-க்கு அந்த இடத்துக்கும், வடஇந்தியாவுக்கும் ஒரு invisible spiritual connection feel ஆகும்.</p>
                </div>
            `
        },
        vanished: {
            title_en: "The Vanished Capital and \"Cursed City\" Feel",
            content_en: `
                <div class="story-content">
                    <h4>The Vanished Capital and "Cursed City" Feel</h4>
                    <p>Once, Gangaikonda Cholapuram was not a quiet village but the beating heart of a mighty empire. Palaces, crowded markets, grand streets, musicians, dancers—everything that a capital could dream of. But when someone visits today, they mostly see the grand Shiva temple standing alone, and around it, open land and silence. That emptiness itself feels like an urban legend.</p>
                    
                    <p>No one agrees exactly on how the city fell. Some say enemies like the Pandyas came with burning rage and wiped out the proud Chola capital in revenge. Others say the power shifted, kings abandoned it, and time itself slowly ate away the walls, houses, and palaces. Only the temple survived, as if Shiva refused to leave. Local whispers sometimes turn this into a curse story: "The king's pride invited divine anger. The city vanished, but the Lord stayed."</p>
                    
                    <p>For narration, you can start in the present: a lone traveler walking through the remains, the sound of the wind blowing over broken stones. An old guide, with a lantern in his hand, tells the traveler, "Intha idam oru kaalathula, iravu-la thoonga kooda mudiyama irundhuchu—so much life, so much light. Ippove paaru… the city is gone." Then he points at the towering temple: "Avar mattum dhaan irukkaru—only He remains."</p>
                    
                    <p>Leave it slightly ambiguous—never fully explain whether it was war, politics, or something supernatural. That mystery itself is the hook.</p>
                </div>
            `,
            title_ta: "மறைந்த நகரம் – சாபம் பட்ட சோழ தலைநகர்",
            content_ta: `
                <div class="story-content">
                    <h4>மறைந்த நகரம் – சாபம் பட்ட சோழ தலைநகர்</h4>
                    <p>ஒரு காலத்துல, கங்கைகொண்ட சோழபுரம் ஒரு பெரிய தலைநகரம். அரண்மனை, படை மைதானம், சந்தை, ஆடலறை, இசை – இரவு வரை தூங்காத நகரம்.</p>
                    
                    <p>ஆனா இன்று போனா, அந்தப் பெருமையில் இருந்து பாக்கறதென்னன்னா – ஒரு மாபெரும் சிவன் கோவில் மட்டும் திமிரா வானத்த பாக்கிற மாதிரி நின்னு கொண்டு இருக்குது. சுற்றுல பாத்தா, ஊரே ஒடஞ்சது போல வெறிச்சோலை.</p>
                    
                    <p>"இந்த நகரத்துக்கு என்ன ஆயிடுச்சு?"ன்னு கேக்கும்போது, உறுதியா சொல்ல முடிஞ்ச வரலாறு மிகவும் குறைவு. சில கதைல, "பாண்டியர் கோபத்துல வந்து நகரையே தரைமட்டம் பண்ணிட்டாங்க"னு சொல்வாங்க. வேற சிலர், "அரசியல் மாறுச்சி, ராஜாங்கம் சிப்ட்டு போச்சு, அங்கிருந்து மக்கள் மெல்ல மெல்ல போய்ட்டாங்க, காலம் மெதுவா சுவற்றையே சாப்பிட்டுச்சு"னு சொல்வாங்க.</p>
                    
                    <p>ஆனா ஒரு விஷயம் மட்டும் எல்லாருக்கும் common: கோவில் மட்டும் தப்பிச்சு நின்னது. "நகரமெல்லாம் அழியட்டும், கோவில மட்டும் அருக முடியல"னு மக்கள் சொல்லிக்கிற அளவுக்கு அந்தக் கோவிலுக்கு ஒரு divine protection feel பண்றாங்க.</p>
                    
                    <p>இப்போதைய காலத்துல ஒரு பயணி, மாலை நேரமா கோவில பக்கத்துல நடக்கிறான். காற்று கல்லைத் தொட்டுத் தட்டுற சத்தம்தான் ஒலிக்குது. அவனோட பக்கத்துல ஒரு மூதாட்டன்/மூதாட்டி லாந்தன் பிடிச்சுக்கிட்டே மெதுவா சொல்றாங்க: "இங்க ஒரு காலத்துல, இரவுல கூட தூங்க முடியல, அவ்ளோ ஜாலியாவும் ஜோதியாவும் இருந்த நகரம் இது. இப்போ பாத்தா…" அவர் கையை நீட்டி கோவிலக் காட்டி, "அவர் மட்டும் தான்டா இருக்கார். எல்லா காலத்த பட்றாலும், இந்த ஒரு இடம் மட்டும் நிலைத்துப் போச்சு"ன்னு சொல்றாரு.</p>
                </div>
            `
        },
        lion: {
            title_en: "The Lion Shrine and Secret Door Myth",
            content_en: `
                <div class="story-content">
                    <h4>The Lion Shrine and Secret Door Myth</h4>
                    <p>Near the temple's ancient well stands a majestic lion sculpture, its mouth open in a silent roar. Children from nearby villages are often warned, half-seriously, "Don't go too close… there's a secret door in that lion's mouth." On the surface, it is just architecture, but for storytellers, it becomes the entrance to an underground world.</p>
                    
                    <p>One favourite version goes like this: beneath the lion lies a long-forgotten tunnel, built for the Chola kings. In dangerous times, the royal family could escape through this hidden path, emerging miles away, safe from enemies. Some storytellers add another twist: the tunnel leads not just outside the city, but to secret treasure chambers where the Cholas stored gold, gems, and war trophies from across the Indian Ocean.</p>
                    
                    <p>For narration, imagine a stormy evening. Two curious boys dare each other to touch the lion's mouth. As one brushes the stone, he feels a strange hollow sound, like there is empty space beneath. Night after night, he dreams of stairs spiralling downwards, of torches on the wall, of murals showing battles and ships. One day, he meets an old temple worker who says quietly, "Some doors are better left closed. These stones remember more than we do."</p>
                    
                    <p>Whether the tunnel really exists or not is irrelevant—the fear and fascination in the listener's mind is the real story.</p>
                </div>
            `,
            title_ta: "சிங்கத்துப் பிள்ளையார் அருகிலுள்ள சிங்கச் சிலை – ரகசியக் கதவு கதை",
            content_ta: `
                <div class="story-content">
                    <h4>சிங்கத்துப் பிள்ளையார் அருகிலுள்ள சிங்கச் சிலை – ரகசியக் கதவு கதை</h4>
                    <p>கோவில் வளாகத்துல, பழமையான கிணற்றுக்குபக்கம், வாயைத் திறந்த சிங்கச் சிலை ஒன்று இருக்கு. குழந்தைகளுக்கு வீட்ட்ல என்ன சொல்லுவாங்கன்னா, "அந்த சிங்க வாய்க்கு உள்ள போயிடாதே. அதுக்குள்ள ரகசிய கதவு இருக்கு"ன்னு அரை-ஜாலியா, அரை-அச்சமா எச்சரிக்கிறாங்க.</p>
                    
                    <p>வரலாற்று ரீதியில அது ஒரு அழகான கரைக்கோவில் கலையப் பொருள் தான். ஆனா மக்கள் கற்பனையில அது underground பாதை வாயிலாச்சு. ஒரு versionல, அந்த சிங்கத்தின் கீழே, சோழ மன்னர்களுக்காக கட்டப்பட்ட ரகசிய சுரங்கப் பாதை இருக்குன்னு சொல்வாங்க – எதிரி படையெடுப்பு நேரத்துல, ராஜ குடும்பம் கூட வெளியேற இந்த பாதை தான் உபயோகப்பட்டதாம்.</p>
                    
                    <p>இன்னொரு versionல, அந்த பாதை நேரா போய் treasure chamber-களில் முடியும் – கடல் கடந்து கொண்டு வந்த தங்கம், ரத்தினம், விலைமதிப்புள்ள பொருட்கள் எல்லாம் அங்க தான் பூட்டி வச்சிருந்தாங்கன்னு சொல்வாங்க.</p>
                    
                    <p>மழை பெய்து கொண்டு இருக்கும் மாலை. கோவிலில் கூட்டம் குறைஞ்சிருக்கும் நேரம். ரெண்டு பசங்க, ஒருத்தன் தைரியசாலி, இன்னொருத்தன் பயந்துபோகுற type. "சிங்க வாயை தொட்டுப் பார்ப்பியா?"ன்னு ஒருத்தன் கேக்கிறான். மற்றவன் நடுக்கத்துல கையை நீட்டும். கல் குளிர், கையில் ஒட்டுற சத்தத்துல அவருக்கு ஒரு வெறிய சத்தம் கேக்கிற மாதிரி தோணும்.</p>
                    
                    <p>அடுத்து ராத்திரி அவனுக்கு கனவில், அந்த சிங்கத்தின் வாய்க்குள் படி இறங்குற underground வழியும், சுவரில் சோழ சக்கரவர்த்தியின் யுத்தப் படங்களும், தீப்பந்தங்கள் ஒளியும் தெரிகிறது. மறுநாள் அவன் கோவிலோட ஒருத்தர் பூசாரி/தோழர்/காவல்காரரிடம் சொல்றான். அவங்க சிரிச்சுக்கிட்டு, "இந்தக் கல்லு நம்ம கதை எல்லாம் கேட்டு, ரகசியமா வச்சுக்கிட்டு இருப்பது தான்டா. சில கதவுகள் திறந்தா நல்லதா இருக்காது"ன்னு ஒரு வரி dialogue விடுறாங்க.</p>
                </div>
            `
        },
        minister: {
            title_en: "The Forgetful Minister and Vinayakar's Blessing",
            content_en: `
                <div class="story-content">
                    <h4>The Forgetful Minister and Vinayakar's Blessing</h4>
                    <p>Not all legends here are about war and destruction; some are intimate and human. One story revolves around a minister who oversaw the construction of the Brihadisvara temple at Gangaikonda Cholapuram. He handled everything: stone, labor, wages, donations. The king trusted him completely.</p>
                    
                    <p>But when the grand work was done, the king called him to court and asked for a full account: "Tell me, how much did we spend? How did we use the people's wealth?" Standing before the throne, with hundreds of eyes on him, the minister's mind went blank. Names, numbers, records—everything vanished from his memory. That moment of total fear, of thinking "My life is over," is where your narration can slow down and zoom in: the sweat on his forehead, his shaking hands, the echo of his own heartbeat.</p>
                    
                    <p>Desperate, he ran to the Vinayakar shrine in the temple and fell flat on the floor. With tears in his eyes, he prayed, "You are the remover of obstacles, but my obstacle is inside my own mind. If you do not help, the truth I guarded will die with me." The next day, standing again before the king, he suddenly found the words flowing out with perfect clarity. He recited every detail of the accounts as if he was reading from an invisible palm leaf. The king, amazed, believed it was nothing less than divine grace.</p>
                    
                    <p>From then on, people said that praying to this Vinayakar could clear confusion, remove mental blocks, and restore memory—especially for students, writers, and officials.</p>
                </div>
            `,
            title_ta: "மறந்துபோன மந்திரி மற்றும் விநாயகரின் ஆசீர்வாதம்",
            content_ta: `
                <div class="story-content">
                    <h4>மறந்துபோன மந்திரி மற்றும் விநாயகரின் ஆசீர்வாதம்</h4>
                    <p>இங்குள்ள எல்லா கதைகளும் போர் மற்றும் அழிவைப் பற்றியவை அல்ல; சில நெருக்கமானவை மற்றும் மனிதாபிமானமானவை. ஒரு கதை கங்கைகொண்ட சோழபுரத்தில் பிரகதீஸ்வரர் கோவில் கட்டுமானத்தை மேற்பார்வையிட்ட ஒரு மந்திரியைச் சுற்றி வருகிறது. அவர் எல்லாவற்றையும் கையாண்டார்: கல், உழைப்பு, ஊதியம், நன்கொடைகள். ராஜா அவரை முழுமையாக நம்பினார்.</p>
                    
                    <p>ஆனால் பிரமாண்டமான வேலை முடிந்ததும், ராஜா அவரை நீதிமன்றத்திற்கு அழைத்து முழு கணக்கைக் கேட்டார்: "சொல்லுங்கள், நாம் எவ்வளவு செலவு செய்தோம்? மக்களின் செல்வத்தை எவ்வாறு பயன்படுத்தினோம்?" சிம்மாசனத்தின் முன் நின்று, நூற்றுக்கணக்கான கண்கள் அவரைப் பார்த்துக் கொண்டிருக்க, மந்திரியின் மனம் வெறுமையாகிவிட்டது. பெயர்கள், எண்கள், பதிவுகள் - எல்லாம் அவரது நினைவிலிருந்து மறைந்துவிட்டன.</p>
                    
                    <p>அந்த முழு பயத்தின் தருணம், "என் வாழ்க்கை முடிந்துவிட்டது" என்று நினைக்கும் தருணம், உங்கள் விவரிப்பு மெதுவாகி, அவரது நெற்றியில் வியர்வை, நடுங்கும் கைகள், அவரது சொந்த இதயத் துடிப்பின் எதிரொலி ஆகியவற்றில் கவனம் செலுத்தலாம்.</p>
                    
                    <p>அவசரத்தில், அவர் கோவிலில் உள்ள விநாயகர் சன்னிதிக்கு ஓடி தரையில் விழுந்தார். கண்களில் கண்ணீருடன், அவர் பிரார்த்தித்தார், "நீங்கள் தடைகளை நீக்குபவர், ஆனால் என் தடை என் சொந்த மனதிற்குள் இருக்கிறது. நீங்கள் உதவவில்லை என்றால், நான் பாதுகாத்த உண்மை என்னுடன் இறந்துவிடும்."</p>
                    
                    <p>மறுநாள், மீண்டும் ராஜாவின் முன் நின்றபோது, திடீரென்று வார்த்தைகள் சரியான தெளிவுடன் வெளிவருவதைக் கண்டார். அவர் ஒரு கண்ணுக்குத் தெரியாத ஓலைச் சுவடியிலிருந்து படிப்பது போல் கணக்குகளின் ஒவ்வொரு விவரத்தையும் சொன்னார். ராஜா, ஆச்சரியப்பட்டு, இது தெய்வீக அருளைத் தவிர வேறில்லை என்று நம்பினார்.</p>
                    
                    <p>அன்று முதல், இந்த விநாயகரை வழிபடுவது குழப்பத்தை நீக்கவும், மன தடைகளை அகற்றவும், நினைவாற்றலை மீட்டெடுக்கவும் முடியும் என்று மக்கள் கூறினர் - குறிப்பாக மாணவர்கள், எழுத்தாளர்கள் மற்றும் அதிகாரிகளுக்கு.</p>
                </div>
            `
        }
    };

    // Ensure we have a cached copy of the story-selection HTML so we can return to it
    if (!window._gangaikonda_story_options_html) {
        const initialBody = document.querySelector('#storytellingModal .modal-body');
        if (initialBody) window._gangaikonda_story_options_html = initialBody.innerHTML;
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
        try { populateVoiceList(); } catch (e) { }
        try { populateNarrationLanguageSelector(); } catch (e) { }
    }
}


// Voice management for SpeechSynthesis
let _selectedVoiceName = localStorage.getItem('gangaikonda_voice') || null;
// Persisted narration language: 'en' (English) or 'ta' (Tamil)
let _selectedNarrationLanguage = localStorage.getItem('gangaikonda_narration_lang') || 'ta';

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
        try { localStorage.setItem('gangaikonda_voice', _selectedVoiceName); } catch (e) { }
    });

    // After populating voices, update availability indicator and mismatch warning
    try { updateVoiceAvailabilityIndicator(); } catch (e) { }
}

// Populate voices on load, and when voiceschanged event fires
window.addEventListener('DOMContentLoaded', () => {
    // Try to populate immediately
    setTimeout(populateVoiceList, 100);
    // Also attempt to initialize narration language selector if present
    setTimeout(() => {
        try { populateNarrationLanguageSelector(); } catch (e) { }
    }, 120);
});
if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = function () {
        try { populateVoiceList(); } catch (e) { }
    };
}

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
    } catch (e) { }

    langSelect.addEventListener('change', () => {
        _selectedNarrationLanguage = langSelect.value;
        try { localStorage.setItem('gangaikonda_narration_lang', _selectedNarrationLanguage); } catch (e) { }
        // Update availability / mismatch display when language changes
        try { updateVoiceAvailabilityIndicator(); } catch (e) { }
        try { updateVoiceMismatchWarning(); } catch (e) { }

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

// Restore the original story selection grid inside the storytelling modal
function showStorySelection() {
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (!modalBody) return;
    if (window._gangaikonda_story_options_html) {
        modalBody.innerHTML = window._gangaikonda_story_options_html;
    } else {
        // Fallback: reconstruct simple options if cached HTML isn't available
        modalBody.innerHTML = `
            <div class="story-options">
                <div class="story-card" onclick="startStory('rajendra')">
                    <h4>Rajendra's Ganges Campaign</h4>
                    <p>Experience the epic military expedition that led to the founding of this imperial capital</p>
                </div>
                <div class="story-card" onclick="startStory('lake')">
                    <h4>The Sacred Chola Gangam Lake</h4>
                    <p>Discover the mystical lake that holds the essence of the Ganges</p>
                </div>
                <div class="story-card" onclick="startStory('vanished')">
                    <h4>The Vanished Capital</h4>
                    <p>Uncover the mystery of the lost imperial city</p>
                </div>
                <div class="story-card" onclick="startStory('lion')">
                    <h4>The Lion Shrine Secret</h4>
                    <p>Explore legends of hidden tunnels and treasure chambers</p>
                </div>
                <div class="story-card" onclick="startStory('minister')">
                    <h4>The Forgetful Minister</h4>
                    <p>A human story of divine intervention and memory</p>
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
                    <p>Curated articles from authoritative sources about Gangaikonda Cholapuram. Click "Read Full Article" to visit the original source.</p>
                </div>
                <article class="blog-post">
                    <div class="post-category">UNESCO World Heritage</div>
                    <h4>Brihadisvara Temple, Gangaikonda Cholapuram</h4>
                    <p class="post-meta">Source: Wikipedia | Comprehensive Encyclopedia</p>
                    <p class="post-excerpt">The Brihadisvara Temple at Gangaikonda Cholapuram is a UNESCO World Heritage Site, part of the "Great Living Chola Temples." Built by Rajendra Chola I in the 11th century to commemorate his victory over the Ganges region, this architectural marvel showcases the evolution of Chola temple design...</p>
                    <button class="read-more-btn" onclick="window.open('https://en.wikipedia.org/wiki/Brihadisvara_Temple,_Gangaikonda_Cholapuram', '_blank')">Read Full Article →</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Travel & Culture</div>
                    <h4>Gangaikonda Cholapuram: Discover Tamil Nadu's Forgotten Chola-Era Marvel</h4>
                    <p class="post-meta">Source: Outlook Traveller | 2025 Feature</p>
                    <p class="post-excerpt">Following PM Modi's visit, this forgotten Chola capital is experiencing a tourism renaissance. Discover the magnificent temple that stands as testament to Rajendra Chola's ambitious northern campaign and the city that once rivaled Thanjavur in grandeur...</p>
                    <button class="read-more-btn" onclick="window.open('https://www.outlooktraveller.com/destinations/india/gangaikonda-cholapuram-discover-tamil-nadus-forgotten-chola-era-marvel', '_blank')">Read Full Article →</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Heritage & History</div>
                    <h4>The Chola Empire's Forgotten Crown Jewel</h4>
                    <p class="post-meta">Source: National Geographic | Heritage Travel 2025</p>
                    <p class="post-excerpt">National Geographic explores the architectural splendor of Gangaikonda Cholapuram, the imperial capital that embodied the zenith of Chola power. From the refined vimana to the 81 Karana sculptures, discover why this site represents the evolution of South Indian temple architecture...</p>
                    <button class="read-more-btn" onclick="window.open('https://www.nationalgeographic.com/travel/article/gangaikondacholapuram-southern-india-chola-dynasty-ponniyin-selvan-1', '_blank')">Read Full Article →</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Official Tourism</div>
                    <h4>Gangaikonda Cholapuram - Official Destination Guide</h4>
                    <p class="post-meta">Source: Tamil Nadu Tourism | Government Portal</p>
                    <p class="post-excerpt">Official tourism guide to Gangaikonda Cholapuram, featuring detailed information about the Brihadisvara Temple, the sacred Chola Gangam lake, visiting hours, accessibility, and how to plan your heritage tour to this UNESCO World Heritage Site...</p>
                    <button class="read-more-btn" onclick="window.open('https://www.tamilnadutourism.tn.gov.in/destinations/gangaikonda-cholapuram', '_blank')">Read Full Article →</button>
                </article>
                <article class="blog-post">
                    <div class="post-category">Travel Blog</div>
                    <h4>A Sparkling Gem of Living History: Gangaikonda Cholapuram</h4>
                    <p class="post-meta">Source: The Unclicheophile | Heritage Travel Blog</p>
                    <p class="post-excerpt">An intimate traveler's perspective on visiting Gangaikonda Cholapuram, exploring the temple's intricate sculptures, the mysterious vanished city, and the spiritual atmosphere that pervades this forgotten imperial capital. Includes practical tips and photography insights...</p>
                    <button class="read-more-btn" onclick="window.open('https://theunclicheophile.com/2019/10/02/sparkling-gem-history-gangaikonda-cholapuram/', '_blank')">Read Full Article →</button>
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
// Gangaikonda Cholapuram-specific quiz questions
let quizQuestions = [
    {
        question: "Which Chola king built the Gangaikonda Cholapuram temple?",
        options: ["Raja Raja Chola I", "Rajendra Chola I", "Rajaraja Chola II", "Kulottunga Chola I"],
        correct: 1,
        explanation: "Rajendra Chola I built this temple in 1035 CE to commemorate his victory over the Pala dynasty and bringing Ganges water."
    },
    {
        question: "What does the name 'Gangaikonda Cholapuram' mean?",
        options: ["City of Chola Temples", "City of the Chola who conquered the Ganges", "Capital of Cholas", "Ganges City"],
        correct: 1,
        explanation: "'Gangaikonda Cholapuram' means 'the city of the Chola who conquered the Ganges', celebrating Rajendra's northern expedition."
    },
    {
        question: "In which year was Gangaikonda Cholapuram temple designated as a UNESCO World Heritage Site?",
        options: ["1987", "2004", "2010", "2014"],
        correct: 1,
        explanation: "The temple was designated as a UNESCO World Heritage Site in 2004 as part of the 'Great Living Chola Temples'."
    },
    {
        question: "How does the height of this temple's vimana compare to Thanjavur's Brihadeeswarar Temple?",
        options: ["Taller", "Slightly shorter", "Same height", "Much shorter"],
        correct: 1,
        explanation: "The vimana is 182 feet tall, slightly shorter than Thanjavur's 216 feet, but equally magnificent in design."
    },
    {
        question: "What unique feature does the Nandi statue at this temple have?",
        options: ["It's made of bronze", "It's the largest Nandi", "It's smaller and more elegantly proportioned", "It faces east"],
        correct: 2,
        explanation: "Unlike Thanjavur's massive Nandi, this one is smaller but more elegantly proportioned and artistically refined."
    },
    {
        question: "The temple tank was filled with water brought from which river?",
        options: ["Kaveri", "Ganges (Ganga)", "Godavari", "Krishna"],
        correct: 1,
        explanation: "Rajendra Chola brought Ganges water from his northern conquests to fill the temple tank, called Chola Gangam."
    },
    {
        question: "This temple served as the capital for which Chola ruler?",
        options: ["Raja Raja Chola I", "Rajendra Chola I", "Both A and B", "Kulottunga Chola"],
        correct: 1,
        explanation: "Rajendra Chola I moved his capital from Thanjavur to Gangaikonda Cholapuram and made this temple the centerpiece."
    },
    {
        question: "What architectural refinement distinguishes this temple from its predecessor in Thanjavur?",
        options: ["Taller gopuram", "More graceful and curving vimana", "Larger courtyard", "More sculptures"],
        correct: 1,
        explanation: "The vimana has a more graceful, slightly curved profile compared to Thanjavur's straight-sided design."
    },
    {
        question: "The main deity is dedicated to which form of Shiva?",
        options: ["Nataraja", "Gangaikonda Choleshwara", "Brihadeeshwara", "Arunachaleswara"],
        correct: 1,
        explanation: "The main deity is Gangaikonda Choleshwara, Lord Shiva in the form associated with the Chola conquest."
    },
    {
        question: "Which empire eventually destroyed much of the city around the temple?",
        options: ["Pandyas", "Vijayanagara", "Later Pandyas and invaders", "British"],
        correct: 2,
        explanation: "The city was largely destroyed by later Pandya rulers and subsequent invaders, though the main temple survived."
    },
    {
        question: "What is notable about the sculptures in this temple?",
        options: ["They're identical to Thanjavur", "They show evolved artistry and detail", "They're made of marble", "There are very few"],
        correct: 1,
        explanation: "The sculptures show more evolved artistry with intricate details, representing the peak of Chola sculptural tradition."
    },
    {
        question: "The lion sculptures at the base of the temple represent what?",
        options: ["Royal emblem", "Chola military power", "Guardian deities", "Artistic decoration only"],
        correct: 1,
        explanation: "The magnificent lion sculptures symbolize the military might and victorious campaigns of the Chola empire."
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
