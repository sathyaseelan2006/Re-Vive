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
const totalCards = 1; // Total number of heritage cards for Thanjavur (will expand later)

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
        kannagi: {
            title_en: "Kannagi and the Burning of Madurai",
            content_en: `
                <div class="story-content">
                    <h4>🔥 The Tale of Justice and Fire</h4>
                    <p>Kannagi and Kovalan were a wealthy merchant couple from the great port city of Puhar. After marriage, Kovalan fell for the dancer Madhavi, spent all his wealth on her, and eventually returned to Kannagi only after losing everything. Ashamed but determined to rebuild their life, Kannagi broke her precious anklets and chose one pair to sell in Madurai so Kovalan could start fresh.</p>
                    <p>In Madurai, Kovalan went to a royal goldsmith to sell Kannagi's anklet. Unfortunately, that goldsmith had just stolen the queen's similar-looking anklet and, to save himself, blamed Kovalan as the thief. The enraged Pandya king, without a proper trial or investigation, ordered Kovalan's execution on the spot. When news reached Kannagi, she walked straight into the court, holding the single remaining anklet. She broke it open and showed that her anklet was filled with rubies, while the queen's anklets traditionally held pearls—proving that Kovalan had been innocent and the king's judgment unjust.</p>
                    <p>Realizing his terrible mistake, the king collapsed in shock and is said to have died of grief, followed by the queen. But Kannagi's sorrow had already turned into righteous fury. She tore off her breast and flung it toward the city, cursing Madurai to burn for its injustice to an innocent man and to a faithful wife. As the legend goes, flames rose across the city, and Madurai was engulfed in fire until the gods themselves had to intervene and appease Kannagi. Over time, she came to be revered not only as a wronged woman but as a powerful goddess of justice and chastity, worshipped in many parts of Tamil Nadu and Sri Lanka.</p>
                </div>
            `,
            title_ta: "கண்ணகி மற்றும் மதுரை எரிந்த கதை",
            content_ta: `
                <div class="story-content">
                    <h4>🔥 நீதி மற்றும் தீயின் கதை</h4>
                    <p>கண்ணகி மற்றும் கோவலன் பெரிய துறைமுக நகரமான புகாரைச் சேர்ந்த செல்வந்த வணிகர் தம்பதியினர். திருமணத்திற்குப் பிறகு, கோவலன் நடனக் கலைஞரான மாதவியின் மீது காதல் கொண்டு, தனது அனைத்து செல்வத்தையும் அவர் மீது செலவழித்து, இறுதியாக எல்லாவற்றையும் இழந்த பிறகு கண்ணகியிடம் திரும்பினார். வெட்கப்பட்டாலும் தங்கள் வாழ்க்கையை மீண்டும் கட்டியெழுப்ப உறுதியுடன், கண்ணகி தனது விலைமதிப்பற்ற கொலுசுகளை உடைத்து, கோவலன் புதிதாக தொடங்குவதற்காக ஒரு ஜோடியை மதுரையில் விற்க தேர்ந்தெடுத்தாள்.</p>
                    <p>மதுரையில், கோவலன் கண்ணகியின் கொலுசை விற்க அரச தங்கசாமிக்குச் சென்றார். துரதிர்ஷ்டவசமாக, அந்த தங்கசாமி ராணியின் ஒத்த கொலுசை திருடி, தன்னைக் காப்பாற்றிக் கொள்ள, கோவலனை திருடன் என்று குற்றம் சாட்டினார். கோபமடைந்த பாண்டிய மன்னர், சரியான விசாரணை அல்லது விசாரணை இல்லாமல், கோவலனை அந்த இடத்திலேயே தூக்கிலிட உத்தரவிட்டார். செய்தி கண்ணகியை அடைந்தபோது, அவள் நேராக நீதிமன்றத்திற்குச் சென்று, மீதமுள்ள ஒற்றை கொலுசை பிடித்துக்கொண்டாள். அவள் அதை உடைத்து திறந்து, தன் கொலுசு மாணிக்கங்களால் நிரப்பப்பட்டிருப்பதையும், ராணியின் கொலுசுகள் பாரம்பரியமாக முத்துக்களை வைத்திருப்பதையும் காட்டினார்—கோவலன் குற்றமற்றவர் என்பதையும் மன்னரின் தீர்ப்பு அநீதியானது என்பதையும் நிரூபித்தார்.</p>
                    <p>தனது பயங்கரமான தவறை உணர்ந்து, மன்னர் அதிர்ச்சியில் சரிந்தார் மற்றும் துயரத்தால் இறந்துவிட்டதாகக் கூறப்படுகிறது, அதைத் தொடர்ந்து ராணியும் இறந்தாள். ஆனால் கண்ணகியின் துயரம் ஏற்கனவே நீதியான சீற்றமாக மாறிவிட்டது. அவள் தன் மார்பகத்தைக் கிழித்து நகரத்தை நோக்கி வீசி, ஒரு அப்பாவி மனிதனுக்கும் விசுவாசமான மனைவிக்கும் அநீதி இழைத்ததற்காக மதுரை எரிக்கப்பட வேண்டும் என்று சபித்தாள். புராணத்தின்படி, நகரம் முழுவதும் தீப்பிழம்புகள் எழுந்தன, மதுரை தீயில் மூழ்கியது, தெய்வங்கள் தலையிட்டு கண்ணகியை சமாதானப்படுத்த வேண்டியிருந்தது. காலப்போக்கில், அவள் ஒரு அநீதி செய்யப்பட்ட பெண் மட்டுமல்ல, நீதி மற்றும் கற்புக்கான சக்திவாய்ந்த தெய்வமாக மதிக்கப்படுகிறாள், தமிழ்நாடு மற்றும் இலங்கையின் பல பகுதிகளில் வணங்கப்படுகிறாள்.</p>
                </div>
            `
        },
        meenakshi: {
            title_en: "Warrior-Queen Meenakshi",
            content_en: `
                <div class="story-content">
                    <h4>👑 The Three-Breasted Warrior Princess</h4>
                    <p>Long ago, in Madurai, the Pandya king Malayadhwaja and his queen Kanchanamalai had everything—prosperity, fame, a glorious capital—except a child to inherit the throne. After long penance and elaborate yajnas praying for a son, a miracle happened: from the sacred fire emerged not a boy, but a small three-year-old girl, radiant like an emerald, with three breasts. Priests and sages were stunned, but a divine voice proclaimed that the third breast would vanish the moment she met her destined husband.</p>
                    <p>The royal couple named her Tadaatakai (later Meenakshi) and raised her not as a delicate princess but as a warrior-heir. She mastered weapons, led armies, and is said to have conquered neighboring realms, proving herself as capable as any king. Her unusual birth and destiny became a matter of pride rather than shame in the Pandya court. When it was finally time to perform her coronation and discuss marriage, sages reminded the king of the prophecy: her true consort would be no ordinary man.</p>
                    <p>Meenakshi set out on a northern digvijaya (conquest tour). In one version of the legend, her campaign finally reached Kailash, the abode of Shiva. When she saw Shiva on the battlefield, sword in hand, her third breast disappeared instantly. The fearless warrior-queen, who had never bent before any man, lowered her gaze in shyness for the first time. Shiva accepted her as his consort and agreed to come to Madurai as Sundareshwarar. Their grand wedding in Madurai became the celestial marriage between the city's ruling goddess and the supreme god. This divine marriage is still celebrated every year as Chithirai Thiruvizha: the entire city transforms into a living stage for their wedding, processions fill the streets, and for Madurai's people, it reaffirms that their city itself is built around a goddess-queen and her cosmic marriage.</p>
                </div>
            `,
            title_ta: "போர்வீரன் ராணி மீனாட்சி",
            content_ta: `
                <div class="story-content">
                    <h4>👑 மூன்று மார்பகங்கள் கொண்ட போர்வீரன் இளவரசி</h4>
                    <p>நெடுங்காலத்திற்கு முன்பு, மதுரையில், பாண்டிய மன்னர் மலையத்வஜன் மற்றும் அவரது ராணி காஞ்சனமலை எல்லாவற்றையும் கொண்டிருந்தனர்—செழிப்பு, புகழ், ஒரு புகழ்பெற்ற தலைநகரம்—ஆனால் சிம்மாசனத்தை பெற ஒரு குழந்தை இல்லை. நீண்ட தவம் மற்றும் ஒரு மகனுக்காக பிரார்த்தனை செய்யும் விரிவான யாகங்களுக்குப் பிறகு, ஒரு அதிசயம் நடந்தது: புனித நெருப்பிலிருந்து ஒரு பையன் அல்ல, மாறாக மரகதம் போல் பிரகாசமான, மூன்று மார்பகங்களுடன் ஒரு சிறிய மூன்று வயது பெண் வெளிப்பட்டாள். பூசாரிகள் மற்றும் முனிவர்கள் திகைத்துப் போனார்கள், ஆனால் ஒரு தெய்வீக குரல் அறிவித்தது, அவள் தன் விதிக்கப்பட்ட கணவனைச் சந்திக்கும் தருணத்தில் மூன்றாவது மார்பகம் மறைந்துவிடும்.</p>
                    <p>அரச தம்பதிகள் அவளுக்கு தடாதகை (பின்னர் மீனாட்சி) என்று பெயரிட்டு, அவளை ஒரு மென்மையான இளவரசியாக அல்ல, மாறாக ஒரு போர்வீரன்-வாரிசாக வளர்த்தனர். அவள் ஆயுதங்களில் தேர்ச்சி பெற்றாள், படைகளை வழிநடத்தினாள், அண்டை ராஜ்யங்களை வெற்றி கொண்டதாகக் கூறப்படுகிறது, எந்த மன்னரையும் போல் திறமையானவள் என்பதை நிரூபித்தாள். அவளுடைய அசாதாரண பிறப்பு மற்றும் விதி பாண்டிய அரசவையில் வெட்கத்திற்குப் பதிலாக பெருமையின் விஷயமாக மாறியது. இறுதியாக அவளது முடிசூட்டு விழாவை நடத்தவும் திருமணத்தைப் பற்றி விவாதிக்கவும் நேரம் வந்தபோது, முனிவர்கள் மன்னருக்கு தீர்க்கதரிசனத்தை நினைவுபடுத்தினர்: அவளுடைய உண்மையான துணை சாதாரண மனிதராக இருக்க மாட்டார்.</p>
                    <p>மீனாட்சி வடக்கு திக்விஜயத்திற்கு (வெற்றி சுற்றுப்பயணம்) புறப்பட்டாள். புராணத்தின் ஒரு பதிப்பில், அவளது பிரச்சாரம் இறுதியாக சிவனின் இருப்பிடமான கைலாசத்தை அடைந்தது. போர்க்களத்தில் கையில் வாளுடன் சிவனைப் பார்த்தபோது, அவளுடைய மூன்றாவது மார்பகம் உடனடியாக மறைந்தது. எந்த மனிதனுக்கும் முன்பு வணங்காத அச்சமற்ற போர்வீரன்-ராணி, முதல் முறையாக வெட்கத்தில் தன் பார்வையைத் தாழ்த்தினாள். சிவன் அவளை தனது துணையாக ஏற்றுக்கொண்டு, சுந்தரேஸ்வரராக மதுரைக்கு வர ஒப்புக்கொண்டார். மதுரையில் அவர்களின் பிரமாண்டமான திருமணம் நகரின் ஆளும் தெய்வத்திற்கும் உச்ச கடவுளுக்கும் இடையிலான தெய்வீக திருமணமாக மாறியது. இந்த தெய்வீக திருமணம் இன்றும் ஒவ்வொரு ஆண்டும் சித்திரைத் திருவிழாவாக கொண்டாடப்படுகிறது.</p>
                </div>
            `
        },
        veeran: {
            title_en: "Madurai Veeran – The Outlaw Protector",
            content_en: `
                <div class="story-content">
                    <h4>⚔️ From Bandit to Guardian Deity</h4>
                    <p>Madurai Veeran's story begins at the margins of society. Born in a lower-caste or outcaste family (versions differ), he grew up with extraordinary courage, skill in arms, and a strong sense of justice. Instead of serving oppressive landlords and officials, he chose the forest and the road, attacking corrupt rich travelers and protecting the poor. This dual role—bandit to some, hero to others—made him a legendary figure around Madurai's outskirts.</p>
                    <p>During the rule of Thirumalai Nayak, the king of Madurai, persistent trouble from highway robbers threatened trade and royal authority. Hearing of Veeran's fearless exploits, the king wanted to either crush him or bring him to his side. In many tellings, Veeran is eventually persuaded to protect Madurai instead of preying on its caravans. His bravery in defending the city against enemies and criminals wins him a place in the royal force, and sometimes even the secret love of a woman from a higher status, which creates jealousy and tension in the court.</p>
                    <p>However, caste and politics catch up with him. Court rivals accuse Veeran of betrayal, exaggerate his "bandit" past, and turn the king against him. Though he had risked his life for the city, he is condemned and executed—some versions say by mutilation or hanging. After his death, strange misfortunes and disturbances begin around Madurai, which people interpret as the restless spirit of the wronged warrior. To pacify him and honor his sacrifice, a temple is established for Madurai Veeran, and he is enshrined not outside but within the sacred space of Meenakshi Amman Temple as a guardian deity. For many marginalized communities, Madurai Veeran is more than a folk hero; he is a symbol of resistance, dignity, and the idea that even someone born outside the "respectable" order can become the city's protector.</p>
                </div>
            `,
            title_ta: "மதுரை வீரன் – கொள்ளைக்காரனிலிருந்து பாதுகாவலர் தெய்வமாக",
            content_ta: `
                <div class="story-content">
                    <h4>⚔️ கொள்ளைக்காரனிலிருந்து பாதுகாவலர் தெய்வமாக</h4>
                    <p>மதுரை வீரனின் கதை சமூகத்தின் விளிம்புகளில் தொடங்குகிறது. கீழ்ஜாதி அல்லது புறஜாதி குடும்பத்தில் பிறந்து (பதிப்புகள் வேறுபடுகின்றன), அவர் அசாதாரண தைரியம், ஆயுதங்களில் திறமை மற்றும் வலுவான நீதி உணர்வுடன் வளர்ந்தார். ஒடுக்கும் நில உடையாளர்கள் மற்றும் அதிகாரிகளுக்கு சேவை செய்வதற்கு பதிலாக, அவர் காடு மற்றும் சாலையைத் தேர்ந்தெடுத்தார், ஊழல் செல்வந்த பயணிகளைத் தாக்கி ஏழைகளைப் பாதுகாத்தார். இந்த இரட்டைப் பாத்திரம்—சிலருக்கு கொள்ளைக்காரர், மற்றவர்களுக்கு ஹீரோ—மதுரையின் புறநகர்ப் பகுதிகளில் அவரை ஒரு புகழ்பெற்ற நபராக ஆக்கியது.</p>
                    <p>மதுரை அரசரான திருமலை நாயக்கரின் ஆட்சியின் போது, நெடுஞ்சாலை கொள்ளைக்காரர்களிடமிருந்து தொடர்ச்சியான பிரச்சனை வர்த்தகம் மற்றும் அரச அதிகாரத்தை அச்சுறுத்தியது. வீரனின் அச்சமற்ற சாதனைகளைக் கேள்விப்பட்டு, மன்னர் அவரை நசுக்க விரும்பினார் அல்லது தன் பக்கம் கொண்டுவர விரும்பினார். பல கதைகளில், வீரன் இறுதியாக அதன் வண்டிகளைக் கொள்ளையடிப்பதற்குப் பதிலாக மதுரையைப் பாதுகாக்க சம்மதிக்கப்படுகிறார். எதிரிகள் மற்றும் குற்றவாளிகளுக்கு எதிராக நகரத்தைப் பாதுகாப்பதில் அவரது துணிச்சல் அரச படையில் அவருக்கு ஒரு இடத்தைப் பெற்றுத் தருகிறது.</p>
                    <p>இருப்பினும், ஜாதி மற்றும் அரசியல் அவரைப் பிடிக்கிறது. அரசவை போட்டியாளர்கள் வீரனை துரோகம் என்று குற்றம் சாட்டுகிறார்கள், அவரது "கொள்ளைக்காரர்" கடந்த காலத்தை மிகைப்படுத்தி, மன்னரை அவருக்கு எதிராகத் திருப்புகிறார்கள். அவர் நகரத்திற்காக தனது உயிரைப் பணயம் வைத்திருந்தாலும், அவர் கண்டனம் செய்யப்பட்டு தூக்கிலிடப்படுகிறார். அவரது மரணத்திற்குப் பிறகு, மதுரையைச் சுற்றி விசித்திரமான துரதிர்ஷ்டங்களும் குழப்பங்களும் தொடங்குகின்றன, இதை மக்கள் அநீதி இழைக்கப்பட்ட போர்வீரனின் அமைதியற்ற ஆவி என்று விளக்குகிறார்கள். அவரை சமாதானப்படுத்தவும் அவரது தியாகத்தை கௌரவிக்கவும், மதுரை வீரனுக்கு ஒரு கோவில் நிறுவப்படுகிறது, மேலும் அவர் வெளியில் அல்ல, மாறாக மீனாட்சி அம்மன் கோவிலின் புனித இடத்திற்குள் ஒரு பாதுகாவலர் தெய்வமாக பிரதிஷ்டை செய்யப்படுகிறார். பல ஒதுக்கப்பட்ட சமூகங்களுக்கு, மதுரை வீரன் ஒரு நாட்டுப்புற ஹீரோ மட்டுமல்ல; அவர் எதிர்ப்பு, கண்ணியம் மற்றும் "மரியாதைக்குரிய" ஒழுங்கிற்கு வெளியே பிறந்தவர் கூட நகரத்தின் பாதுகாவலராக மாற முடியும் என்ற எண்ணத்தின் அடையாளமாகும்.</p>
                </div>
            `
        }
    };
    
    // Cache story selection HTML
    if (!window._madurai_story_options_html) {
        const initialBody = document.querySelector('#storytellingModal .modal-body');
        if (initialBody) window._madurai_story_options_html = initialBody.innerHTML;
    }

    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (stories[storyType] && modalBody) {
        const lang = _selectedNarrationLanguage || 'en';
        const content = (lang === 'ta') ? stories[storyType].content_ta : stories[storyType].content_en;
        const title = (lang === 'ta') ? stories[storyType].title_ta : stories[storyType].title_en;

        modalBody.innerHTML = content;

        const backText = (lang === 'ta') ? "← கதைகளுக்குத் திரும்பு" : "← Back to Stories";
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
        
        try { populateVoiceList(); } catch (e) {}
        try { populateNarrationLanguageSelector(); } catch (e) {}
    }
}

// Voice management for TTS
let _selectedVoiceName = localStorage.getItem('madurai_voice') || null;
let _selectedNarrationLanguage = localStorage.getItem('madurai_narration_lang') || 'en';

function showStorySelection() {
    const modalBody = document.querySelector('#storytellingModal .modal-body');
    if (modalBody && window._madurai_story_options_html) {
        modalBody.innerHTML = window._madurai_story_options_html;
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
        localStorage.setItem('madurai_voice', _selectedVoiceName);
    });
}

function populateNarrationLanguageSelector() {
    const langSelect = document.getElementById('narrationLanguage');
    if (!langSelect) return;

    langSelect.addEventListener('change', () => {
        const newLang = langSelect.value;
        _selectedNarrationLanguage = newLang;
        localStorage.setItem('madurai_narration_lang', newLang);
        
        const modal = document.getElementById('storytellingModal');
        if (modal && modal.dataset.currentStoryKey) {
            startStory(modal.dataset.currentStoryKey);
        }
    });
}

function narrateStory() {
    console.log('AI narration - feature placeholder');
    alert('AI narration feature coming soon! Use "Narrate Original" for text-to-speech.');
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

// Load voices when available
if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = () => {
        try { populateVoiceList(); } catch (e) {}
    };
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
                    <h4>Great Living Chola Temples - World Heritage Site</h4>
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
// Madurai-specific quiz questions
let quizQuestions = [
    {
        question: "Which dynasty is primarily associated with the construction of the Meenakshi Amman Temple?",
        options: ["Chola dynasty", "Nayak dynasty", "Pandya dynasty", "Pallava dynasty"],
        correct: 1,
        explanation: "The Nayak dynasty, particularly Thirumalai Nayak in the 17th century, is credited with the temple's current magnificent structure."
    },
    {
        question: "How many gopurams (temple towers) does the Meenakshi Temple complex have?",
        options: ["10", "12", "14", "16"],
        correct: 2,
        explanation: "The Meenakshi Temple has 14 gopurams, with the southern tower being the tallest at 170 feet."
    },
    {
        question: "What is Madurai famously known as?",
        options: ["Athens of the East", "Temple City", "City of Festivals", "Golden City"],
        correct: 0,
        explanation: "Madurai is called the 'Athens of the East' due to its rich cultural heritage and historical significance comparable to ancient Athens."
    },
    {
        question: "Approximately how many sculptures adorn the Meenakshi Temple?",
        options: ["15,000", "25,000", "33,000", "50,000"],
        correct: 2,
        explanation: "The Meenakshi Temple is adorned with over 33,000 sculptures, making it one of the most intricately carved temples in India."
    },
    {
        question: "Which famous Tamil Sangam era academy was located in Madurai?",
        options: ["First Sangam", "Second Sangam", "Third Sangam", "Royal Sangam"],
        correct: 2,
        explanation: "Madurai hosted the Third Tamil Sangam, a legendary academy of Tamil poets and scholars."
    },
    {
        question: "What area does the Meenakshi Temple complex cover?",
        options: ["30 acres", "45 acres", "60 acres", "75 acres"],
        correct: 1,
        explanation: "The sprawling Meenakshi Temple complex covers approximately 45 acres in the heart of Madurai city."
    },
    {
        question: "Which Nayak ruler built the famous Thirumalai Nayak Palace?",
        options: ["Vishwanatha Nayak", "Thirumalai Nayak", "Muthu Virappa Nayak", "Chokkanatha Nayak"],
        correct: 1,
        explanation: "Thirumalai Nayak built the magnificent palace in 1636 CE, blending Dravidian and Islamic architectural styles."
    },
    {
        question: "What is the sacred temple tank in Meenakshi Temple called?",
        options: ["Porthamarai Kulam", "Surya Kulam", "Potramarai Kulam", "Chandra Kulam"],
        correct: 2,
        explanation: "The Potramarai Kulam (Golden Lotus Tank) is the sacred temple tank where devotees take ritual baths."
    },
    {
        question: "Which ancient traveler documented Madurai in his writings?",
        options: ["Ibn Battuta", "Marco Polo", "Megasthenes", "Fa-Hien"],
        correct: 2,
        explanation: "Megasthenes, the Greek ambassador, documented Madurai (ancient Mathurai) in his writings around 302 BCE."
    },
    {
        question: "How many streets form the concentric squares around the Meenakshi Temple?",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "Four concentric streets (Chitrai, Avani, Adi, and Masi streets) form squares around the temple, representing ancient urban planning."
    },
    {
        question: "What is the annual temple festival of Meenakshi Temple called?",
        options: ["Chithirai Festival", "Panguni Festival", "Aadi Festival", "Margazhi Festival"],
        correct: 0,
        explanation: "The Chithirai Festival, celebrating the celestial wedding of Meenakshi and Sundareswarar, is the temple's grandest annual celebration."
    },
    {
        question: "Which river flows near Madurai city?",
        options: ["Kaveri", "Vaigai", "Tamiraparani", "Palar"],
        correct: 1,
        explanation: "The Vaigai River flows through Madurai, playing a crucial role in the city's history and agriculture."
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
        // Try to find any gallery element as fallback
        const anyGallery = document.querySelector('.heritage-gallery');
        console.log('Fallback gallery element:', anyGallery);
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
