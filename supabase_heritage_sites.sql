-- Insert remaining 16 Tamil Nadu Heritage Sites
INSERT INTO heritage_sites (site_name, location, state, district, description, emotional_tags, highlights, period, url_path) VALUES

-- UNESCO World Heritage Sites (2 more)
('Airavatesvara Temple', 'Darasuram, Kumbakonam', 'Tamil Nadu', 'Thanjavur', 'UNESCO World Heritage Site - Great Living Chola Temple with intricate carvings', ARRAY['spiritual', 'history', 'architecture'], ARRAY['Chola architecture', 'Stone chariot', 'UNESCO site'], 'Chola Dynasty (12th century)', '/tamil-nadu/darasuram'),

('Gangaikonda Cholapuram Temple', 'Ariyalur District', 'Tamil Nadu', 'Ariyalur', 'UNESCO World Heritage Site - Great Living Chola Temples built by Rajendra Chola I', ARRAY['spiritual', 'history', 'architecture', 'heroic'], ARRAY['Victory temple', 'Chola glory', 'UNESCO site'], 'Chola Dynasty (11th century)', '/tamil-nadu/gangaikonda-cholapuram'),

-- Major Heritage Temples (8 more)
('Sri Ranganathaswamy Temple', 'Srirangam', 'Tamil Nadu', 'Tiruchirappalli', 'Largest working Hindu temple complex dedicated to Lord Vishnu', ARRAY['spiritual', 'cultural', 'architecture'], ARRAY['Largest temple complex', 'Island temple', '21 gopurams'], 'Medieval period', '/tamil-nadu/srirangam'),

('Nataraja Temple', 'Chidambaram', 'Tamil Nadu', 'Cuddalore', 'Sacred temple dedicated to Lord Shiva as the cosmic dancer Nataraja', ARRAY['spiritual', 'cultural', 'architecture'], ARRAY['Cosmic dance', 'Pancha Bootha Stalam', 'Ancient rituals'], 'Chola Dynasty', '/tamil-nadu/chidambaram'),

('Annamalaiyar Temple', 'Tiruvannamalai', 'Tamil Nadu', 'Tiruvannamalai', 'Panch Bhoota Sthalam representing the fire element, sacred Arunachala hill', ARRAY['spiritual', 'nature', 'cultural'], ARRAY['Fire element', 'Sacred hill', 'Girivalam path'], 'Ancient period', '/tamil-nadu/tiruvannamalai'),

('Palani Murugan Temple', 'Palani', 'Tamil Nadu', 'Dindigul', 'One of the six abodes of Lord Murugan, hilltop temple with panoramic views', ARRAY['spiritual', 'nature'], ARRAY['Murugan abode', 'Hilltop temple', 'Panchamirtham'], 'Medieval period', '/tamil-nadu/palani'),

('Rockfort Temple', 'Tiruchirappalli (Trichy)', 'Tamil Nadu', 'Tiruchirappalli', 'Ancient rock fortress with Ucchi Pillayar Temple atop 83m high rock', ARRAY['spiritual', 'history', 'nature'], ARRAY['Rock fortress', 'Panoramic views', 'Ancient steps'], 'Pallava Dynasty', '/tamil-nadu/rockfort-tiruchirappalli'),

('Thiruchendur Murugan Temple', 'Thiruchendur', 'Tamil Nadu', 'Thoothukudi', 'One of Six Abodes of Murugan, unique seashore temple', ARRAY['spiritual', 'nature', 'romantic'], ARRAY['Seashore temple', 'Murugan abode', 'Coastal beauty'], 'Medieval period', '/tamil-nadu/thiruchendur'),

('Andal Temple', 'Srivilliputhur', 'Tamil Nadu', 'Virudhunagar', 'Famous for its towering gopuram which is the emblem of Tamil Nadu', ARRAY['spiritual', 'cultural', 'architecture'], ARRAY['Tamil Nadu emblem', 'Tallest gopuram', 'Andal deity'], 'Medieval period', '/tamil-nadu/srivilliputhur'),

-- Historical Sites & Forts (3)
('Keeladi Excavations', 'Near Madurai (Sivagangai)', 'Tamil Nadu', 'Sivagangai', 'Sangam-era archaeological site revealing ancient urban settlement and Tamil civilization', ARRAY['history', 'cultural'], ARRAY['Sangam era', 'Archaeological site', 'Ancient civilization'], 'Sangam period (300 BCE - 300 CE)', '/tamil-nadu/keeladi'),

('Kanyakumari', 'Kanyakumari', 'Tamil Nadu', 'Kanyakumari', 'Southern tip of India with Vivekananda Rock Memorial and confluence of three seas', ARRAY['spiritual', 'nature', 'romantic', 'cultural'], ARRAY['Three seas confluence', 'Vivekananda Rock', 'Sunrise & sunset'], 'Modern era', '/tamil-nadu/kanyakumari'),

('Fort St. George', 'Chennai', 'Tamil Nadu', 'Chennai', 'First English Fortress in India built in 1644, now houses Tamil Nadu Legislative Assembly', ARRAY['history', 'war', 'cultural'], ARRAY['British colonial', 'First English fort', 'Museum'], 'Colonial period (1644)', '/tamil-nadu/fort-st-george'),

('Gingee Fort', 'Villupuram District', 'Tamil Nadu', 'Villupuram', 'Troy of the East - Impregnable fortress with three citadels on hilltops', ARRAY['war', 'heroic', 'history', 'nature'], ARRAY['Impregnable fortress', 'Three hills', 'Military strategy'], 'Medieval period', '/tamil-nadu/gingee-fort'),

-- Cultural Heritage (3)
('Chettinad Heritage', 'Karaikudi, Sivaganga', 'Tamil Nadu', 'Sivagangai', 'Palatial mansions of Nattukottai Chettiars with unique Athangudi tiles and architecture', ARRAY['cultural', 'architecture', 'history'], ARRAY['Palatial mansions', 'Athangudi tiles', 'Chettinad cuisine'], '19th-20th century', '/tamil-nadu/chettinad'),

('Chennai Heritage', 'Chennai', 'Tamil Nadu', 'Chennai', 'Capital city with colonial architecture, Marina Beach, and cultural landmarks', ARRAY['cultural', 'history', 'nature'], ARRAY['Marina Beach', 'Colonial buildings', 'Cultural hub'], 'Colonial to modern', '/tamil-nadu/chennai'),

('Nilgiris - Ooty', 'Nilgiris District', 'Tamil Nadu', 'Nilgiris', 'Queen of Hill Stations with colonial heritage, tea gardens, and scenic beauty', ARRAY['nature', 'romantic', 'cultural', 'history'], ARRAY['Hill station', 'Tea gardens', 'Colonial heritage'], 'Colonial period', '/tamil-nadu/nilgiris-ooty');
