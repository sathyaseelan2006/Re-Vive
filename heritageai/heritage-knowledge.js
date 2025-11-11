// Heritage Knowledge Database - Comprehensive Indian Cultural Heritage Data
class HeritageKnowledge {
    constructor() {
        this.sites = this.initializeSites();
        this.dynasties = this.initializeDynasties();
        this.traditions = this.initializeTraditions();
        this.festivals = this.initializeFestivals();
    }

    initializeSites() {
        return {
            // Tamil Nadu Heritage Sites
            'brihadeeswara-temple': {
                name: 'Brihadeeswara Temple',
                location: 'Thanjavur, Tamil Nadu',
                dynasty: 'Chola',
                period: '1010 CE',
                type: 'Temple',
                significance: 'UNESCO World Heritage Site, Architectural Marvel',
                description: 'The Great Living Chola Temple built by Raja Raja Chola I',
                legends: [
                    'The shadow of the main dome never falls on the ground at noon',
                    'The Nandi statue was carved from a single stone',
                    'The temple was built without using any binding material'
                ],
                architecture: 'Dravidian style with 216-foot tall vimana',
                deities: ['Shiva as Brihadeeswara', 'Parvati as Brihadnayaki'],
                festivals: ['Maha Shivaratri', 'Brahmotsavam'],
                artForms: ['Bronze sculptures', 'Stone carvings', 'Frescoes'],
                culturalContext: 'Represents the pinnacle of Chola architectural achievement'
            },
            'meenakshi-temple': {
                name: 'Meenakshi Amman Temple',
                location: 'Madurai, Tamil Nadu',
                dynasty: 'Pandya',
                period: '6th century CE (rebuilt 17th century)',
                type: 'Temple Complex',
                significance: 'One of the most important temples in South India',
                description: 'Dedicated to Goddess Meenakshi and Lord Sundareshwar',
                legends: [
                    'Meenakshi was born with three breasts, which disappeared when she met Shiva',
                    'The temple has 14 gopurams with intricate sculptures',
                    'The Hall of Thousand Pillars has exactly 985 pillars'
                ],
                architecture: 'Dravidian style with colorful gopurams',
                deities: ['Meenakshi (Parvati)', 'Sundareshwar (Shiva)'],
                festivals: ['Meenakshi Thirukalyanam', 'Navarathri'],
                artForms: ['Gopuram sculptures', 'Pillar carvings', 'Temple paintings'],
                culturalContext: 'Center of Tamil culture and literature'
            },
            'shore-temple': {
                name: 'Shore Temple',
                location: 'Mahabalipuram, Tamil Nadu',
                dynasty: 'Pallava',
                period: '8th century CE',
                type: 'Structural Temple',
                significance: 'UNESCO World Heritage Site, Earliest structural temple',
                description: 'Ancient temple complex facing the Bay of Bengal',
                legends: [
                    'One of the Seven Pagodas mentioned by early European sailors',
                    'Survived the 2004 tsunami with minimal damage',
                    'Built to withstand sea erosion for over 1300 years'
                ],
                architecture: 'Early Dravidian style with granite construction',
                deities: ['Shiva', 'Vishnu'],
                festivals: ['Mamallapuram Dance Festival'],
                artForms: ['Stone sculptures', 'Rock carvings'],
                culturalContext: 'Represents Pallava maritime power and artistic excellence'
            },
            'keeladi': {
                name: 'Keeladi Archaeological Site',
                location: 'Sivaganga District, Tamil Nadu',
                dynasty: 'Sangam Period',
                period: '6th century BCE - 1st century CE',
                type: 'Archaeological Site',
                significance: 'Proves ancient Tamil civilization and urban planning',
                description: 'Ancient urban settlement with advanced drainage system',
                legends: [
                    'Evidence of Tamil-Brahmi script dating back 2600 years',
                    'Sophisticated urban planning with ring wells',
                    'Trade connections with Rome and other civilizations'
                ],
                architecture: 'Brick structures with advanced drainage',
                artifacts: ['Pottery', 'Iron tools', 'Gold ornaments', 'Inscribed potsherds'],
                culturalContext: 'Challenges Aryan invasion theory, proves Tamil antiquity'
            },

            // Other Major Indian Heritage Sites
            'konark-sun-temple': {
                name: 'Konark Sun Temple',
                location: 'Konark, Odisha',
                dynasty: 'Eastern Ganga',
                period: '13th century CE',
                type: 'Temple',
                significance: 'UNESCO World Heritage Site, Architectural Wonder',
                description: 'Temple designed as a colossal chariot of the Sun God',
                legends: [
                    'The temple was designed as Surya\'s chariot with 24 wheels',
                    'The main deity was suspended in air using magnets',
                    'Sailors used it as a navigation landmark'
                ],
                architecture: 'Kalinga style with intricate stone carvings',
                deities: ['Surya (Sun God)'],
                festivals: ['Konark Dance Festival'],
                artForms: ['Erotic sculptures', 'Wheel carvings', 'Dance poses'],
                culturalContext: 'Represents Odisha\'s golden age of art and architecture'
            },
            'ajanta-caves': {
                name: 'Ajanta Caves',
                location: 'Aurangabad, Maharashtra',
                dynasty: 'Satavahana, Vakataka',
                period: '2nd century BCE - 6th century CE',
                type: 'Rock-cut Caves',
                significance: 'UNESCO World Heritage Site, Buddhist Art Masterpiece',
                description: '30 rock-cut Buddhist cave monuments',
                legends: [
                    'Rediscovered by British officer John Smith in 1819',
                    'Paintings survived for over 1500 years',
                    'Depicts Jataka tales and Buddha\'s life'
                ],
                architecture: 'Rock-cut architecture with chaityas and viharas',
                artForms: ['Frescoes', 'Sculptures', 'Buddhist paintings'],
                culturalContext: 'Pinnacle of ancient Indian Buddhist art'
            },
            'red-fort': {
                name: 'Red Fort (Lal Qila)',
                location: 'Delhi',
                dynasty: 'Mughal',
                period: '1648 CE',
                type: 'Fort Palace',
                significance: 'UNESCO World Heritage Site, Symbol of India',
                description: 'Main residence of Mughal emperors for 200 years',
                legends: [
                    'Site of Indian independence declaration',
                    'Houses the famous Peacock Throne',
                    'Walls are made of red sandstone'
                ],
                architecture: 'Indo-Islamic style with Persian influences',
                culturalContext: 'Symbol of Mughal power and Indian independence'
            }
        };
    }

    initializeDynasties() {
        return {
            'chola': {
                name: 'Chola Dynasty',
                period: '9th - 13th century CE',
                region: 'Tamil Nadu, South India',
                capital: 'Thanjavur, Gangaikonda Cholapuram',
                achievements: [
                    'Greatest naval power in Indian Ocean',
                    'Architectural marvels like Brihadeeswara Temple',
                    'Efficient administrative system',
                    'Patronage of arts and literature'
                ],
                rulers: ['Raja Raja Chola I', 'Rajendra Chola I', 'Kulottunga Chola I'],
                culturalContributions: [
                    'Bronze sculpture perfection',
                    'Temple architecture',
                    'Tamil literature patronage',
                    'Maritime trade expansion'
                ]
            },
            'pallava': {
                name: 'Pallava Dynasty',
                period: '3rd - 9th century CE',
                region: 'Tamil Nadu, Andhra Pradesh',
                capital: 'Kanchipuram',
                achievements: [
                    'Rock-cut architecture pioneers',
                    'Mahabalipuram monuments',
                    'Sanskrit and Tamil literature patronage'
                ],
                rulers: ['Narasimhavarman I', 'Mahendravarman I'],
                culturalContributions: [
                    'Dravidian architecture foundation',
                    'Shore Temple construction',
                    'Cultural exchange with Southeast Asia'
                ]
            },
            'mughal': {
                name: 'Mughal Empire',
                period: '1526 - 1857 CE',
                region: 'Northern and Central India',
                capital: 'Delhi, Agra, Fatehpur Sikri',
                achievements: [
                    'Architectural wonders like Taj Mahal',
                    'Cultural synthesis of Hindu-Islamic traditions',
                    'Administrative innovations'
                ],
                rulers: ['Akbar', 'Shah Jahan', 'Aurangzeb'],
                culturalContributions: [
                    'Indo-Islamic architecture',
                    'Miniature paintings',
                    'Classical music patronage',
                    'Garden design'
                ]
            }
        };
    }

    initializeTraditions() {
        return {
            'bharatanatyam': {
                name: 'Bharatanatyam',
                origin: 'Tamil Nadu',
                type: 'Classical Dance',
                history: 'Ancient temple dance form, codified in Natya Shastra',
                elements: ['Nritta', 'Nritya', 'Natya'],
                significance: 'Spiritual expression through dance',
                modernRevival: 'Rukmini Devi Arundale'
            },
            'carnatic-music': {
                name: 'Carnatic Music',
                origin: 'South India',
                type: 'Classical Music',
                history: 'Ancient musical tradition with mathematical precision',
                trinity: ['Tyagaraja', 'Muthuswami Dikshitar', 'Syama Sastri'],
                elements: ['Raga', 'Tala', 'Bhava']
            },
            'ayurveda': {
                name: 'Ayurveda',
                origin: 'Ancient India',
                type: 'Medical System',
                history: 'World\'s oldest healing system',
                principles: ['Vata', 'Pitta', 'Kapha'],
                texts: ['Charaka Samhita', 'Sushruta Samhita']
            }
        };
    }

    initializeFestivals() {
        return {
            'pongal': {
                name: 'Pongal',
                region: 'Tamil Nadu',
                type: 'Harvest Festival',
                duration: '4 days',
                significance: 'Thanksgiving to nature and cattle',
                traditions: ['Boiling rice', 'Decorating cattle', 'Kolam designs']
            },
            'diwali': {
                name: 'Diwali',
                region: 'Pan-India',
                type: 'Festival of Lights',
                significance: 'Victory of light over darkness',
                traditions: ['Oil lamps', 'Fireworks', 'Sweets', 'Rangoli']
            },
            'holi': {
                name: 'Holi',
                region: 'North India',
                type: 'Color Festival',
                significance: 'Arrival of spring, victory of good over evil',
                traditions: ['Color throwing', 'Holika bonfire', 'Folk songs']
            }
        };
    }

    // Search and retrieval methods
    searchSites(query) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        for (const [key, site] of Object.entries(this.sites)) {
            if (site.name.toLowerCase().includes(searchTerm) ||
                site.location.toLowerCase().includes(searchTerm) ||
                site.dynasty.toLowerCase().includes(searchTerm) ||
                site.description.toLowerCase().includes(searchTerm)) {
                results.push({ key, ...site });
            }
        }
        return results;
    }

    getSiteByName(name) {
        const key = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return this.sites[key] || null;
    }

    getDynastyInfo(dynastyName) {
        const key = dynastyName.toLowerCase();
        return this.dynasties[key] || null;
    }

    getRandomSite() {
        const siteKeys = Object.keys(this.sites);
        const randomKey = siteKeys[Math.floor(Math.random() * siteKeys.length)];
        return { key: randomKey, ...this.sites[randomKey] };
    }

    getRandomLegend() {
        const allLegends = [];
        for (const site of Object.values(this.sites)) {
            if (site.legends) {
                site.legends.forEach(legend => {
                    allLegends.push({ site: site.name, legend });
                });
            }
        }
        return allLegends[Math.floor(Math.random() * allLegends.length)];
    }

    getTodayInHistory() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        
        // Sample historical events (can be expanded)
        const historicalEvents = {
            '1-26': 'Republic Day - India became a republic in 1950',
            '8-15': 'Independence Day - India gained independence in 1947',
            '10-2': 'Gandhi Jayanti - Mahatma Gandhi was born in 1869',
            '11-14': 'Children\'s Day - Jawaharlal Nehru was born in 1889'
        };
        
        const dateKey = `${month}-${day}`;
        return historicalEvents[dateKey] || null;
    }

    // Context-aware search for AI responses
    getContextualInfo(query, currentLocation = null) {
        const context = {
            sites: this.searchSites(query),
            dynasties: [],
            traditions: [],
            festivals: []
        };

        // Search dynasties
        for (const [key, dynasty] of Object.entries(this.dynasties)) {
            if (dynasty.name.toLowerCase().includes(query.toLowerCase())) {
                context.dynasties.push({ key, ...dynasty });
            }
        }

        // Search traditions
        for (const [key, tradition] of Object.entries(this.traditions)) {
            if (tradition.name.toLowerCase().includes(query.toLowerCase()) ||
                tradition.type.toLowerCase().includes(query.toLowerCase())) {
                context.traditions.push({ key, ...tradition });
            }
        }

        // Search festivals
        for (const [key, festival] of Object.entries(this.festivals)) {
            if (festival.name.toLowerCase().includes(query.toLowerCase()) ||
                festival.region.toLowerCase().includes(query.toLowerCase())) {
                context.festivals.push({ key, ...festival });
            }
        }

        return context;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeritageKnowledge;
} else {
    window.HeritageKnowledge = HeritageKnowledge;
}
