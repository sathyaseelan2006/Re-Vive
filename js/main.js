// Interactive India Map with State Tooltips and Cultural Information

// State data with cultural information
const stateData = {
    'IN-AP': { name: 'Andhra Pradesh', culture: 'Known for classical dance Kuchipudi, spicy cuisine, and ancient Buddhist sites like Amaravati.' },
    'IN-AR': { name: 'Arunachal Pradesh', culture: 'Rich tribal heritage with diverse communities, colorful festivals, and pristine Himalayan culture.' },
    'IN-AS': { name: 'Assam', culture: 'Famous for Bihu festival, Assamese silk, tea culture, and classical dance Sattriya.' },
    'IN-BR': { name: 'Bihar', culture: 'Birthplace of Buddhism and Jainism, rich in ancient history, folk music, and Madhubani art.' },
    'IN-CT': { name: 'Chhattisgarh', culture: 'Tribal heritage with vibrant folk dances, handicrafts, and ancient temples.' },
    'IN-GA': { name: 'Goa', culture: 'Portuguese colonial influence, beach culture, carnival celebrations, and unique Indo-Portuguese cuisine.' },
    'IN-GJ': { name: 'Gujarat', culture: 'Land of Mahatma Gandhi, vibrant Garba dance, business acumen, and vegetarian cuisine.' },
    'IN-HR': { name: 'Haryana', culture: 'Agricultural heritage, folk music and dance, wrestling tradition, and proximity to Delhi.' },
    'IN-HP': { name: 'Himachal Pradesh', culture: 'Mountain culture, Buddhist monasteries, apple orchards, and adventure tourism.' },
    'IN-JH': { name: 'Jharkhand', culture: 'Tribal traditions, folk dances, mineral wealth, and forest-based lifestyle.' },
    'IN-KA': { name: 'Karnataka', culture: 'IT hub Bangalore, classical music, Mysore silk, and architectural marvels like Hampi.' },
    'IN-KL': { name: 'Kerala', culture: 'God\'s Own Country with backwaters, Ayurveda, Kathakali dance, and spice trade heritage.' },
    'IN-MP': { name: 'Madhya Pradesh', culture: 'Heart of India with ancient temples, tribal art, wildlife sanctuaries, and rich history.' },
    'IN-MH': { name: 'Maharashtra', culture: 'Bollywood hub, Marathi culture, business capital Mumbai, and historical forts.' },
    'IN-MN': { name: 'Manipur', culture: 'Classical dance Manipuri, martial arts, handloom weaving, and unique cultural festivals.' },
    'IN-ML': { name: 'Meghalaya', culture: 'Matrilineal society, living root bridges, rain-fed culture, and tribal traditions.' },
    'IN-MZ': { name: 'Mizoram', culture: 'Christian majority state with unique tribal culture, bamboo crafts, and community festivals.' },
    'IN-NL': { name: 'Nagaland', culture: 'Warrior tribes, Hornbill festival, traditional crafts, and headhunting history.' },
    'IN-OR': { name: 'Odisha', culture: 'Jagannath temple, classical dance Odissi, ancient architecture, and maritime heritage.' },
    'IN-PB': { name: 'Punjab', culture: 'Sikh heritage, Bhangra dance, wheat farming, and vibrant festivals like Baisakhi.' },
    'IN-RJ': { name: 'Rajasthan', culture: 'Royal heritage, desert culture, colorful festivals, folk music, and majestic palaces.' },
    'IN-SK': { name: 'Sikkim', culture: 'Buddhist culture, mountain traditions, organic farming, and Himalayan lifestyle.' },
    'IN-TN': { name: 'Tamil Nadu', culture: 'Ancient Tamil literature, classical dance Bharatanatyam, Dravidian architecture, and temple culture.' },
    'IN-TG': { name: 'Telangana', culture: 'IT hub Hyderabad, Nizami culture, Bonalu festival, and rich culinary traditions.' },
    'IN-TR': { name: 'Tripura', culture: 'Tribal heritage, handloom weaving, bamboo crafts, and cultural diversity.' },
    'IN-UP': { name: 'Uttar Pradesh', culture: 'Taj Mahal, classical music, diverse cuisine, and rich Mughal heritage.' },
    'IN-UT': { name: 'Uttarakhand', culture: 'Spiritual heritage, yoga traditions, Himalayan culture, and pilgrimage sites.' },
    'IN-WB': { name: 'West Bengal', culture: 'Intellectual hub, Durga Puja, Bengali literature, sweets, and artistic traditions.' },
    'IN-AN': { name: 'Andaman & Nicobar', culture: 'Island culture, tribal heritage, marine life, and colonial history.' },
    'IN-CH': { name: 'Chandigarh', culture: 'Modern planned city, architectural marvel, and cultural blend of Punjab and Haryana.' },
    'IN-DH': { name: 'Dadra & Nagar Haveli', culture: 'Tribal culture, folk dances, handicrafts, and natural beauty.' },
    'IN-DD': { name: 'Daman & Diu', culture: 'Portuguese colonial heritage, coastal culture, and historical architecture.' },
    'IN-DL': { name: 'Delhi', culture: 'Capital city with Mughal heritage, diverse cuisine, political center, and cultural melting pot.' },
    'IN-JK': { name: 'Jammu & Kashmir', culture: 'Kashmir\'s paradise beauty, Sufi traditions, handicrafts, and mountain culture.' },
    'IN-LA': { name: 'Ladakh', culture: 'Buddhist culture, high-altitude desert, monasteries, and unique Himalayan traditions.' },
    'IN-LD': { name: 'Lakshadweep', culture: 'Coral island culture, coconut-based economy, marine traditions, and Islamic heritage.' },
    'IN-PY': { name: 'Puducherry', culture: 'French colonial heritage, spiritual tourism, unique architecture, and cultural fusion.' }
};

// Create a mapping from SVG path IDs to state data keys
const stateIdMap = {
    'ap': 'IN-AP',
    'ar': 'IN-AR',
    'as': 'IN-AS',
    'br': 'IN-BR',
    'ct': 'IN-CT',
    'ga': 'IN-GA',
    'gj': 'IN-GJ',
    'hr': 'IN-HR',
    'hp': 'IN-HP',
    'jh': 'IN-JH',
    'ka': 'IN-KA',
    'kl': 'IN-KL',
    'mp': 'IN-MP',
    'mh': 'IN-MH',
    'mn': 'IN-MN',
    'ml': 'IN-ML',
    'mz': 'IN-MZ',
    'nl': 'IN-NL',
    'or': 'IN-OR',
    'pb': 'IN-PB',
    'rj': 'IN-RJ',
    'sk': 'IN-SK',
    'tn': 'IN-TN',
    'tg': 'IN-TG',
    'tr': 'IN-TR',
    'up': 'IN-UP',
    'ut': 'IN-UT',
    'wb': 'IN-WB',
    'an': 'IN-AN',
    'ch': 'IN-CH',
    'dh': 'IN-DH',
    'dd': 'IN-DD',
    'dl': 'IN-DL',
    'jk': 'IN-JK',
    'la': 'IN-LA',
    'ld': 'IN-LD',
    'py': 'IN-PY'
};

document.addEventListener('DOMContentLoaded', function() {
    const imgElement = document.getElementById('indiaMapSVG');
    
    if (imgElement) {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.id = 'state-tooltip';
        tooltip.className = 'state-tooltip';
        document.body.appendChild(tooltip);
        
        // Cache SVG content for better performance
        const cachedSVG = sessionStorage.getItem('indiaMapSVG');
        const svgPromise = cachedSVG 
            ? Promise.resolve(cachedSVG)
            : fetch(imgElement.src)
                .then(response => response.text())
                .then(svg => {
                    sessionStorage.setItem('indiaMapSVG', svg);
                    return svg;
                });
        
        svgPromise
            .then(svgContent => {
                // Create a container div and insert SVG content
                const svgContainer = document.createElement('div');
                svgContainer.innerHTML = svgContent;
                const svgElement = svgContainer.querySelector('svg');
                
                if (svgElement) {
                    // Copy attributes from img to svg
                    svgElement.id = imgElement.id;
                    svgElement.className = imgElement.className;
                    svgElement.setAttribute('alt', imgElement.alt);
                    
                    // Replace img with svg
                    imgElement.parentNode.replaceChild(svgElement, imgElement);
                    
                    // Add interactivity to all paths (states)
                    const allPaths = svgElement.querySelectorAll('path');
                    
                    // Add title elements to each path for basic tooltip functionality
                    allPaths.forEach((path, index) => {
                        // Get state ID from various possible attributes and map it correctly
                        const pathId = path.id || path.getAttribute('data-id') || path.getAttribute('name') || 'state-' + index;
                        const stateKey = stateIdMap[pathId] || stateIdMap[pathId.toLowerCase()];
                        const stateInfo = stateData[stateKey];
                        
                        // Create title element for basic browser tooltip
                        if (stateInfo) {
                            const titleElement = document.createElement('title');
                            titleElement.textContent = stateInfo.name + ': ' + stateInfo.culture;
                            path.appendChild(titleElement);
                        }
                        
                        path.style.cursor = 'pointer';
                        path.style.transition = 'transform 0.2s ease, opacity 0.2s ease, fill 0.3s ease, filter 0.3s ease';
                        path.style.willChange = 'transform, opacity';
                        
                        // Mouse enter event - show tooltip
                        path.addEventListener('mouseenter', function(e) {
                            // Only apply hover effect if not selected (golden)
                            if (!path.style.fill || (path.style.fill !== 'rgb(212, 175, 55)' && path.style.fill !== '#d4af37')) {
                                path.style.transform = 'scale(1.02)';
                                path.style.opacity = '0.9';
                            }
                            
                            // Show tooltip with state information
                            if (stateInfo) {
                                tooltip.innerHTML = `
                                    <div class="tooltip-header">
                                        <h3 class="tooltip-title">${stateInfo.name}</h3>
                                    </div>
                                    <div class="tooltip-content">
                                        <p class="tooltip-culture">${stateInfo.culture}</p>
                                    </div>
                                `;
                                tooltip.style.display = 'block';
                                updateTooltipPosition(e);
                            }
                        });
                        
        // Mouse move event - update tooltip position (throttled for performance)
        let tooltipMoveTimeout;
        path.addEventListener('mousemove', function(e) {
            if (tooltip.style.display === 'block') {
                if (!tooltipMoveTimeout) {
                    tooltipMoveTimeout = setTimeout(() => {
                        updateTooltipPosition(e);
                        tooltipMoveTimeout = null;
                    }, 16); // ~60fps
                }
            }
        });                        // Mouse leave event - hide tooltip
                        path.addEventListener('mouseleave', function() {
                            // Only reset hover effect if not selected (golden)
                            if (!path.style.fill || (path.style.fill !== 'rgb(212, 175, 55)' && path.style.fill !== '#d4af37')) {
                                path.style.transform = '';
                                path.style.opacity = '';
                            }
                            tooltip.style.display = 'none';
                        });
                        
                        // Click event - highlight with golden glow and navigate
                        path.addEventListener('click', function(e) {
                            // Reset all paths
                            allPaths.forEach(p => {
                                p.style.fill = '';
                                p.style.stroke = '';
                                p.style.strokeWidth = '';
                                p.style.filter = '';
                                p.style.transform = '';
                                p.style.opacity = '';
                            });
                            
                            // Highlight clicked path with golden glow
                            path.style.fill = '#d4af37';
                            path.style.stroke = '#e6c547';
                            path.style.strokeWidth = '3px';
                            path.style.filter = 'drop-shadow(0 0 12px #d4af37) drop-shadow(0 0 20px #d4af37) brightness(1.2)';
                            path.style.transform = 'scale(1.05)';
                            path.style.opacity = '1';
                            
                            // Show selection feedback and navigate
                            if (stateInfo) {
                                console.log(`Selected: ${stateInfo.name}`);
                                
                                // Navigate to Tamil Nadu page when Tamil Nadu is clicked
                                if (stateKey === 'IN-TN') {
                                    setTimeout(() => {
                                        window.location.href = 'tamil-nadu/index.html';
                                    }, 500);
                                } else {
                                    // For other states, you can add more navigation logic here
                                    console.log(`Navigation to ${stateInfo.name} page not yet implemented`);
                                }
                            }
                        });
                    });
                }
            })
            .catch(error => {
                console.error('Error loading SVG:', error);
                
                // Fallback: Add event listeners directly to the img element
                imgElement.addEventListener('mouseover', function(e) {
                    console.log('Map hovered');
                });
            });
    }
    
    // Function to update tooltip position
    function updateTooltipPosition(e) {
        const tooltip = document.getElementById('state-tooltip');
        if (!tooltip) return;
        
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get the position of the hovered element
        const targetRect = e.target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Position tooltip near the hovered state
        let left = targetRect.left + scrollLeft + targetRect.width / 2 - tooltipRect.width / 2;
        let top = targetRect.top + scrollTop - tooltipRect.height - 10;
        
        // Adjust if tooltip goes off-screen
        if (left + tooltipRect.width > viewportWidth) {
            left = viewportWidth - tooltipRect.width - 10;
        }
        
        if (left < 0) {
            left = 10;
        }
        
        if (top + tooltipRect.height > viewportHeight + scrollTop) {
            top = targetRect.top + scrollTop + targetRect.height + 10;
        }
        
        if (top < scrollTop) {
            top = targetRect.top + scrollTop + targetRect.height + 10;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    // -------------------------------
    // Scroll Reveal + Stagger (Landing) - Optimized
    // -------------------------------
    try {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const revealEls = Array.from(document.querySelectorAll('.reveal'));

        // Pre-assign stagger delays for groups
        const instructionSteps = document.querySelectorAll('.instructions-container .instruction-step.reveal');
        instructionSteps.forEach((el, i) => el.style.setProperty('--stagger', `${i * 100}ms`));

        const featureCards = document.querySelectorAll('.features-grid .feature-card.reveal');
        featureCards.forEach((el, i) => el.style.setProperty('--stagger', `${i * 100}ms`));

        const sectionOrder = [
            document.querySelector('.welcome-section.reveal'),
            document.querySelector('.instructions-section.reveal'),
            document.querySelector('.map-section.reveal'),
            document.querySelector('.features-section.reveal')
        ].filter(Boolean);
        sectionOrder.forEach((el, i) => el.style.setProperty('--stagger', `${i * 120}ms`));

        if (prefersReduced) {
            revealEls.forEach(el => el.classList.add('in-view'));
        } else {
            // Use requestAnimationFrame for smoother reveals
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            entry.target.classList.add('in-view');
                            io.unobserve(entry.target);
                        });
                    }
                });
            }, { 
                threshold: 0.1, 
                rootMargin: '0px 0px -5% 0px'
            });

            revealEls.forEach(el => io.observe(el));
        }
    } catch (err) {
        console.warn('Scroll reveal setup failed:', err);
    }
});
