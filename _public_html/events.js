/* ============================================================
   EVENT DATA
   ============================================================
   HOW TO ADD A NEW EVENT:
   1. Copy any existing object block below (from { id: ... } to the closing })
   2. Give it a unique id — use lowercase letters, numbers and hyphens only
      e.g.  id: 'kantha-workshop-2025'
   3. Update every field (see field guide below the data)
   4. In events.html, set the card's "Learn more" link to:
      event-detail.html?id=YOUR-ID
   That's it. No other files need changing.
   ============================================================ */

var EVENTS = [

  /* ── WORKING EXAMPLE 1: Upcoming exhibition ── */
 
   /*
  {Exhibition
    id: 'thari-2025',
    status: 'upcoming',          // 'upcoming' | 'past'
    type: 'exhibition',          // 'exhibition' | 'workshop' | 'award' | 'conference'
    title: 'Thari — Artisan Collective 2025',
    subtitle: 'India\'s finest makers. Four days. One extraordinary space.',
    dates: 'May 15–18, 2025',
    time: '10:00 AM – 8:00 PM daily',
    venue: 'Spaces, Nungambakkam',
    city: 'Chennai, Tamil Nadu',
    entryFee: 'Free entry',
    registration: 'https://forms.google.com/thari-2025',  // replace with real link
    heroGradient: 'linear-gradient(160deg, #C4845C 0%, #7A3818 60%, #3A1008 100%)',
    heroEmoji: '🎨',
    tagLabel: 'Upcoming Exhibition',
    tagClass: 'upcoming',

    // Main description — add as many paragraphs as needed
    description: [
      'Thari is the Crafts Council of India\'s flagship annual showcase — a curated marketplace and cultural festival that brings together master artisans from across India\'s 28 states. Now in its eighth edition, Thari 2025 returns to Chennai with over 80 artisan participants, live craft demonstrations, panel discussions on craft sustainability, and an immersive exhibition of rare textile and object traditions.',
      'The 2025 theme, <em>Roots &amp; Routes</em>, explores the migratory journeys of craft traditions — how techniques travelled across regions, adapted to local materials, and took on new forms while retaining their essential character. Expect Patola weavers from Patan alongside Kanchipuram silk masters, Dhokra casters from Odisha beside Bidri workers from Bidar.',
      'All proceeds from the craft bazaar go directly to the artisans. Thari is one of the few craft events in India with a no-commission policy — what you pay is what the maker receives.'
    ],

    // Highlights — up to 6, show as icon cards
    highlights: [
      { icon: '🏺', title: '80+ Artisans', text: 'Master craftspeople from 22 states, many making their first appearance in Chennai.' },
      { icon: '🎭', title: 'Live Demonstrations', text: 'Watch block printing, Dhokra casting, Kalamkari pen work and mat weaving in real time.' },
      { icon: '🛍️', title: 'Craft Bazaar', text: 'Directly purchase from makers. Zero commission — 100% of sale goes to the artisan.' },
      { icon: '🎤', title: 'Panel Talks', text: 'Craft economists, designers and artisan voices discuss heritage, market and future.' },
      { icon: '👶', title: 'Children\'s Corner', text: 'Hands-on craft activities for children — block printing, clay, and natural dyeing.' },
      { icon: '🍽️', title: 'Craft Cuisine', text: 'Regional food stalls featuring traditional recipes from artisan communities.' }
    ],

    // Schedule — days and sessions
    schedule: [
      { time: 'Day 1 · May 15', title: 'Opening Ceremony', desc: 'Inauguration by the CCI Chairperson and invited dignitaries. Ribbon-cutting at 10:30 AM followed by first-access preview for registered visitors.' },
      { time: 'Day 1 · 2:00 PM', title: 'Talk: The Economics of Craft', desc: 'Panel discussion with craft economists and policy makers on fair trade frameworks for India\'s artisan sector.' },
      { time: 'Day 2 · May 16', title: 'Textile Symposium', desc: 'A full-day programme on India\'s handloom traditions — presentations by weavers from Tamil Nadu, Gujarat, Assam and West Bengal.' },
      { time: 'Day 3 · May 17', title: 'Young Maker Awards', desc: 'CCI felicitates emerging artisans under 35 who have shown exceptional innovation while honouring tradition.' },
      { time: 'Day 4 · May 18', title: 'Closing & Finale', desc: 'Cultural performance by Kuchipudi artists. Closing address by CCI Vice President. Bazaar closes at 6:00 PM.' }
    ],

    // Participating artists / speakers — up to 6
    people: [
      { initials: 'PS', name: 'Priya Saravanan', role: 'Kanchipuram Silk Weaver, Tamil Nadu', color: '#8B3A1E' },
      { initials: 'RK', name: 'Ramesh Kumar', role: 'Blue Pottery Master, Jaipur', color: '#8B6914' },
      { initials: 'FB', name: 'Fatima Begum', role: 'Kutch Embroidery, Gujarat', color: '#5B7053' },
      { initials: 'MD', name: 'Mohan Das', role: 'Dhokra Casting, Odisha', color: '#4A3728' },
      { initials: 'SR', name: 'Suresh Rao', role: 'Kalamkari, Andhra Pradesh', color: '#7A3818' },
      { initials: 'MB', name: 'Meena Borah', role: 'Muga Silk, Assam', color: '#3A4E34' }
    ],

    // Gallery items — emoji placeholders; replace src with real image paths when available
    gallery: [
      { emoji: '🧵', bg: 'linear-gradient(135deg,#C4845C,#8A4820)' },
      { emoji: '🏺', bg: 'linear-gradient(135deg,#C4A44A,#8B6914)' },
      { emoji: '🎨', bg: 'linear-gradient(135deg,#5B7053,#3A4E34)' },
      { emoji: '🪡', bg: 'linear-gradient(135deg,#8B3A1E,#5C2410)' }
    ],

    // Related event IDs — shown at bottom
    related: ['block-printing-workshop-2025', 'kamala-awards-2024']
  },

  {
    id: 'thari-2026',
    status: 'upcoming',          // 'upcoming' | 'past'
    type: 'exhibition',          // 'exhibition' | 'workshop' | 'award' | 'conference'
    title: 'Thari — Artisan Collective 2025',
    subtitle: 'India\'s finest makers. Four days. One extraordinary space.',
    dates: 'May 15–18, 2026',
    time: '10:00 AM – 8:00 PM daily',
    venue: 'Spaces, Nungambakkam',
    city: 'Chennai, Tamil Nadu',
    entryFee: 'Free entry',
    registration: 'https://forms.google.com/thari-2025',  // replace with real link
    heroGradient: 'linear-gradient(160deg, #C4845C 0%, #7A3818 60%, #3A1008 100%)',
    heroEmoji: '🎨',
    tagLabel: 'Upcoming Exhibition',
    tagClass: 'upcoming',

    // Main description — add as many paragraphs as needed
    description: [
      'Thari is the Crafts Council of India\'s flagship annual showcase — a curated marketplace and cultural festival that brings together master artisans from across India\'s 28 states. Now in its eighth edition, Thari 2025 returns to Chennai with over 80 artisan participants, live craft demonstrations, panel discussions on craft sustainability, and an immersive exhibition of rare textile and object traditions.',
      'The 2025 theme, <em>Roots &amp; Routes</em>, explores the migratory journeys of craft traditions — how techniques travelled across regions, adapted to local materials, and took on new forms while retaining their essential character. Expect Patola weavers from Patan alongside Kanchipuram silk masters, Dhokra casters from Odisha beside Bidri workers from Bidar.',
      'All proceeds from the craft bazaar go directly to the artisans. Thari is one of the few craft events in India with a no-commission policy — what you pay is what the maker receives.'
    ],

    // Schedule — days and sessions
    schedule: [
      { time: 'Day 1 · May 15', title: 'Opening Ceremony', desc: 'Inauguration by the CCI Chairperson and invited dignitaries. Ribbon-cutting at 10:30 AM followed by first-access preview for registered visitors.' },
      { time: 'Day 1 · 2:00 PM', title: 'Talk: The Economics of Craft', desc: 'Panel discussion with craft economists and policy makers on fair trade frameworks for India\'s artisan sector.' },
      { time: 'Day 2 · May 16', title: 'Textile Symposium', desc: 'A full-day programme on India\'s handloom traditions — presentations by weavers from Tamil Nadu, Gujarat, Assam and West Bengal.' },
      { time: 'Day 3 · May 17', title: 'Young Maker Awards', desc: 'CCI felicitates emerging artisans under 35 who have shown exceptional innovation while honouring tradition.' },
      { time: 'Day 4 · May 18', title: 'Closing & Finale', desc: 'Cultural performance by Kuchipudi artists. Closing address by CCI Vice President. Bazaar closes at 6:00 PM.' }
    ],

    // Related event IDs — shown at bottom
    related: ['block-printing-workshop-2025', 'kamala-awards-2024']
  },

*/
  /* ── WORKING EXAMPLE 2: Upcoming workshop ── */
   /* 
  {
    id: 'block-printing-workshop-2025',
    status: 'upcoming',
    type: 'workshop',
    title: 'Block Printing Masterclass',
    subtitle: 'Learn traditional Rajasthani block printing from a master artisan in an immersive day-long session.',
    dates: 'April 20, 2025',
    time: '9:00 AM – 5:00 PM',
    venue: 'Anokhi Museum of Hand Printing',
    city: 'Jaipur, Rajasthan',
    entryFee: '₹1,500 per participant',
    registration: 'https://forms.google.com/block-printing-2025',
    heroGradient: 'linear-gradient(160deg, #C4A44A 0%, #8B6914 60%, #4A3010 100%)',
    heroEmoji: '🖨️',
    tagLabel: 'Upcoming Workshop',
    tagClass: 'workshop',

    description: [
      'Join master block printer Ramesh Jangid for a full-day immersive workshop in Jaipur\'s Anokhi Museum — one of India\'s premier spaces dedicated to the art of hand block printing. This workshop covers the complete process from designing and carving simple blocks to printing multi-colour patterns on cotton fabric.',
      'Participants will leave with two hand-printed fabric pieces, a carved wooden block of their own design, and a deep understanding of the history and technique behind one of Rajasthan\'s most celebrated craft traditions. All materials are provided. The workshop is suitable for beginners and intermediate crafters alike — no prior experience needed.',
      'Participation is capped at 15 people to ensure each participant gets individual attention from the master artisan. Lunch and refreshments are included.'
    ],

    highlights: [
      { icon: '🪵', title: 'Block Carving', text: 'Learn to carve a simple repeat motif into a teak block under the guidance of the master artisan.' },
      { icon: '🎨', title: 'Natural Dyes', text: 'Work with traditional natural dyes — indigo, pomegranate and madder — used in Bagru printing.' },
      { icon: '🖨️', title: 'Multi-colour Printing', text: 'Build up a 3-colour pattern through sequential block passes on cotton fabric.' },
      { icon: '📦', title: 'Take Home Kit', text: 'Your printed fabric, carved block, and a set of natural dye samples to continue at home.' }
    ],

    schedule: [
      { time: '9:00 AM', title: 'Welcome & History', desc: 'Introduction to Rajasthani block printing traditions — Sanganer vs Bagru — and a tour of the museum\'s collection.' },
      { time: '10:00 AM', title: 'Block Carving', desc: 'Design your motif, transfer it to the block, and begin carving under supervision. Focus on clean lines and even depth.' },
      { time: '1:00 PM', title: 'Lunch Break', desc: 'Catered Rajasthani lunch. Time to explore the museum gallery.' },
      { time: '2:00 PM', title: 'Printing Session', desc: 'Learn to set up the printing table, charge the block with dye, and execute a clean, even print. Repeat for 3 colours.' },
      { time: '4:30 PM', title: 'Wash, Dry & Q&A', desc: 'Fabric is washed in water to fix dye. Open Q&A with the master on commercialising block printing.' }
    ],

    people: [
      { initials: 'RJ', name: 'Ramesh Jangid', role: 'Master Block Printer, 35 years experience, Sanganer', color: '#8B6914' },
      { initials: 'AK', name: 'Anita Kumari', role: 'Natural Dye Specialist, Bagru', color: '#5B7053' }
    ],

    gallery: [
      { emoji: '🖨️', bg: 'linear-gradient(135deg,#C4A44A,#8B6914)' },
      { emoji: '🌿', bg: 'linear-gradient(135deg,#5B7053,#3A4E34)' },
      { emoji: '🧵', bg: 'linear-gradient(135deg,#C4845C,#8A4820)' },
      { emoji: '🎨', bg: 'linear-gradient(135deg,#8B3A1E,#5C2410)' }
    ],

    related: ['thari-2025', 'dhokra-workshop-2024']
  },*/

  /* ── WORKING EXAMPLE 3: Past award ceremony ── */
  /* 
  {
    id: 'kamala-awards-2024',
    status: 'past',
    type: 'award',
    title: 'Kamala Awards Ceremony 2024',
    subtitle: 'An evening honouring the master craftspeople who have dedicated their lives to India\'s living heritage.',
    dates: 'December 10, 2024',
    time: '6:00 PM – 9:30 PM',
    venue: 'Museum Theatre, Government Museum',
    city: 'Chennai, Tamil Nadu',
    entryFee: 'By invitation',
    registration: null,   // null = hide register button for past events
    heroGradient: 'linear-gradient(160deg, #8B7355 0%, #4A3728 60%, #1E1410 100%)',
    heroEmoji: '🏆',
    tagLabel: 'Past Event',
    tagClass: 'past',

    description: [
      'The Kamala Awards are the Crafts Council of India\'s highest honour — given annually to master craftspeople whose work has made an exceptional and enduring contribution to India\'s craft heritage. The 2024 ceremony, held at Chennai\'s historic Museum Theatre, recognised six artisans across three categories: Lifetime Achievement, Excellence in Craft, and the Young Artisan Award.',
      'Named after Kamaladevi Chattopadhyay, the awards carry her conviction that the craftsperson is not merely a producer but a cultural custodian — someone whose hands carry millennia of knowledge. The 2024 laureates represented weaving, metal casting, natural dyeing, and terracotta traditions.',
      'The event was attended by over 400 guests including artisans, collectors, designers, academics, and representatives from state governments. A retrospective exhibition of past laureates\' work was displayed in the museum foyer.'
    ],

    highlights: [
      { icon: '🏆', title: '6 Awardees', text: 'Recognised across Lifetime Achievement, Excellence in Craft, and Young Artisan categories.' },
      { icon: '👥', title: '400+ Attendees', text: 'Artisans, collectors, designers, academics and government representatives.' },
      { icon: '🎭', title: 'Cultural Programme', text: 'Bharatanatyam performance by Kalakshetra artists celebrating the weaving tradition.' },
      { icon: '🖼️', title: 'Retrospective Exhibition', text: 'Works by all past Kamala Award laureates displayed in the museum foyer.' }
    ],

    schedule: [
      { time: '6:00 PM', title: 'Arrival & Exhibition Preview', desc: 'Guests explore the retrospective exhibition of past Kamala Award laureates. Light refreshments.' },
      { time: '7:00 PM', title: 'Welcome Address', desc: 'CCI Chairperson Smt. Visalakshi Ramaswamy opens the ceremony and reflects on 60 years of CCI.' },
      { time: '7:15 PM', title: 'Young Artisan Awards', desc: 'Two young artisans under 35 honoured for exceptional innovation within traditional frameworks.' },
      { time: '7:45 PM', title: 'Excellence in Craft Awards', desc: 'Two awardees recognised for sustained excellence and community impact.' },
      { time: '8:15 PM', title: 'Lifetime Achievement Awards', desc: 'CCI\'s highest honour — two artisans recognised for a lifetime of service to Indian craft.' },
      { time: '9:00 PM', title: 'Cultural Performance', desc: 'Bharatanatyam recital by Kalakshetra artists followed by reception dinner.' }
    ],

    people: [
      { initials: 'GG', name: 'Gajam Govardhana', role: 'Lifetime Achievement · Telia Rumal Weaving, Telangana', color: '#8B6914' },
      { initials: 'PS', name: 'Padma Shri Weaver', role: 'Lifetime Achievement · Kanchipuram Silk, Tamil Nadu', color: '#8B3A1E' },
      { initials: 'FB', name: 'Fatima Begum', role: 'Excellence · Kutch Embroidery, Gujarat', color: '#5B7053' },
      { initials: 'MD', name: 'Mohan Das', role: 'Excellence · Dhokra Casting, Odisha', color: '#4A3728' },
      { initials: 'PS', name: 'Priya Sharma', role: 'Young Artisan · Natural Dyeing, Maharashtra', color: '#7A3818' },
      { initials: 'AK', name: 'Arjun Kumar', role: 'Young Artisan · Madhubani Painting, Bihar', color: '#3A4E34' }
    ],

    gallery: [
      { emoji: '🏆', bg: 'linear-gradient(135deg,#8B7355,#4A3728)' },
      { emoji: '🎭', bg: 'linear-gradient(135deg,#C4845C,#8A4820)' },
      { emoji: '🧵', bg: 'linear-gradient(135deg,#8B3A1E,#5C2410)' },
      { emoji: '🖼️', bg: 'linear-gradient(135deg,#4A3728,#1E1410)' }
    ],

    related: ['thari-2025', 'block-printing-workshop-2025']
  },
*/
  /* ── WORKING EXAMPLE 4: Past exhibition ── */
   /* 
  {
    id: 'textiles-show-2024',
    status: 'past',
    type: 'exhibition',
    title: 'Textiles & Accessories Show',
    subtitle: 'A curated survey of India\'s handwoven textile diversity across four days in Mumbai.',
    dates: 'November 5–8, 2024',
    time: '11:00 AM – 7:00 PM daily',
    venue: 'Nehru Centre',
    city: 'Mumbai, Maharashtra',
    entryFee: '₹200 per day',
    registration: null,
    heroGradient: 'linear-gradient(160deg, #A0522D 0%, #6A3010 60%, #2C1008 100%)',
    heroEmoji: '🧶',
    tagLabel: 'Past Exhibition',
    tagClass: 'past',

    description: [
      'The Textiles & Accessories Show brought together 45 weavers and textile artisans from 15 states for a four-day curated exhibition at Mumbai\'s Nehru Centre. The show focused on wearable textiles — from the sheer Chanderi of Madhya Pradesh to the dense brocades of Varanasi, from the geometric Naga shawls of Nagaland to the Patola double ikat of Gujarat.',
      'Each artisan had a dedicated display space showing both finished products and the process behind them — sample warps, dye samples, weaving equipment, and process photographs. Visitors could see the raw material alongside the finished cloth, understanding the full journey from fibre to fabric.',
      'The show recorded 3,200 visitors over four days and total sales of ₹42 lakhs, all of which went directly to the participating artisans.'
    ],

    highlights: [
      { icon: '🧵', title: '45 Artisans', text: 'Weavers and textile makers from 15 states — the largest textile-only show in South India.' },
      { icon: '👁️', title: 'Process Displays', text: 'Raw materials, dye samples and process photographs alongside each artisan\'s work.' },
      { icon: '📊', title: '₹42 Lakh Sales', text: 'Total sales over four days, 100% going directly to participating artisans.' },
      { icon: '👥', title: '3,200 Visitors', text: 'Attendance over four days including collectors, designers and the general public.' }
    ],

    schedule: [
      { time: 'Day 1 · Nov 5', title: 'Inauguration', desc: 'Opening by CCI Vice President and Maharashtra state textile minister. First-hour preview for collectors and press.' },
      { time: 'Daily · 3:00 PM', title: 'Artisan Demonstrations', desc: 'A different artisan demonstrates their process each afternoon — weaving, tie-dye, embroidery and more.' },
      { time: 'Day 3 · Nov 7', title: 'Collector\'s Dialogue', desc: 'An intimate session for serious collectors to meet artisans and discuss commissions and documentation.' },
      { time: 'Day 4 · Nov 8', title: 'Closing Ceremony', desc: 'CCI presents a certificate of appreciation to each participating artisan. Final sale at 5:00 PM.' }
    ],

    people: [
      { initials: 'SK', name: 'Sunita Kheni', role: 'Patola Weaving, Patan, Gujarat', color: '#8B3A1E' },
      { initials: 'RV', name: 'Ravi Varma', role: 'Chanderi Weaving, Madhya Pradesh', color: '#8B6914' },
      { initials: 'NK', name: 'Naga Weaver', role: 'Naga Shawl, Kohima, Nagaland', color: '#5B7053' }
    ],

    gallery: [
      { emoji: '🧶', bg: 'linear-gradient(135deg,#A0522D,#6A3010)' },
      { emoji: '🧵', bg: 'linear-gradient(135deg,#C4A44A,#8B6914)' },
      { emoji: '🎨', bg: 'linear-gradient(135deg,#5B7053,#3A4E34)' },
      { emoji: '🏺', bg: 'linear-gradient(135deg,#8B3A1E,#5C2410)' }
    ],

    related: ['thari-2025', 'kamala-awards-2024']
  },
*/

  /* ── WORKING EXAMPLE 5: Past workshop ── */
    /*
  {
    id: 'dhokra-workshop-2024',
    status: 'past',
    type: 'workshop',
    title: 'Dhokra Casting Workshop',
    subtitle: 'Hands-on experience with the ancient art of lost-wax metal casting with Bastar\'s tribal artisans.',
    dates: 'October 15, 2024',
    time: '9:00 AM – 6:00 PM',
    venue: 'Saraswati Shilp Kendra',
    city: 'Jagdalpur, Bastar, Chhattisgarh',
    entryFee: '₹2,000 per participant',
    registration: null,
    heroGradient: 'linear-gradient(160deg, #5B7053 0%, #3A4E34 60%, #1A2818 100%)',
    heroEmoji: '🔥',
    tagLabel: 'Past Workshop',
    tagClass: 'workshop',

    description: [
      'The Dhokra workshop in Bastar took participants into the heart of one of India\'s oldest metal casting traditions. Working directly with three master Dhokra artisans from the Ghadwa community, participants experienced every stage of the lost-wax casting process — from preparing the wax model to breaking open the clay mould to reveal the finished bronze figure.',
      'Bastar\'s Dhokra tradition is distinct from other Indian metal casting schools in its use of beeswax, its reliance on locally sourced clay, and the folk aesthetics of its motifs — tribal animals, goddesses, and daily life scenes rendered in a characteristically bold, textured style. This workshop was part of CCI\'s ongoing documentation and revival programme for Chhattisgarh\'s craft traditions.',
      'The workshop was attended by 12 participants from across India, including product designers, jewellers, and craft enthusiasts. Several participants went on to commission pieces directly from the artisans.'
    ],

    highlights: [
      { icon: '🔥', title: 'Full Process', text: 'Experience every stage from wax modelling to clay casting to metal pouring and finishing.' },
      { icon: '🏺', title: 'Take Home Casting', text: 'Each participant takes home a small Dhokra piece they helped cast.' },
      { icon: '🌿', title: 'Forest Materials', text: 'Learn how local beeswax, clay and forest resources define Bastar\'s unique Dhokra character.' },
      { icon: '📸', title: 'Documentation', text: 'All process photographs shared with participants for reference and personal documentation.' }
    ],

    schedule: [
      { time: '9:00 AM', title: 'Orientation & Village Walk', desc: 'Introduction to Bastar\'s craft traditions. Walk through the artisan village to understand the community context.' },
      { time: '10:30 AM', title: 'Wax Modelling', desc: 'Each participant models a small figure or animal in beeswax under guidance. The wax form will become the finished casting.' },
      { time: '1:00 PM', title: 'Lunch', desc: 'Traditional Chhattisgarhi meal prepared by the artisan families.' },
      { time: '2:00 PM', title: 'Clay Casing & Firing', desc: 'Watch and assist as the wax models are encased in clay, dried, and fired. The wax burns out, leaving the cavity.' },
      { time: '4:00 PM', title: 'Metal Pouring', desc: 'Master artisans pour molten brass into the moulds. Participants observe the full pour and cooling process.' },
      { time: '5:00 PM', title: 'Breaking & Finishing', desc: 'Break open the moulds to reveal the castings. File, polish and take home your unique Dhokra piece.' }
    ],

    people: [
      { initials: 'JG', name: 'Jairam Ghadwa', role: 'Master Dhokra Artisan, 40 years, Bastar', color: '#5B7053' },
      { initials: 'SR', name: 'Sushila Ram', role: 'Dhokra Artisan & Natural Dye Specialist', color: '#3A4E34' }
    ],

    gallery: [
      { emoji: '🔥', bg: 'linear-gradient(135deg,#5B7053,#3A4E34)' },
      { emoji: '🏺', bg: 'linear-gradient(135deg,#8B7355,#4A3728)' },
      { emoji: '⚙️', bg: 'linear-gradient(135deg,#C4845C,#8A4820)' },
      { emoji: '✨', bg: 'linear-gradient(135deg,#C4A44A,#8B6914)' }
    ],

    related: ['thari-2025', 'block-printing-workshop-2025']
  },*/

  /* ── WORKING EXAMPLE 6: Past exhibition ── */
   /* 
  {
    id: 'natural-dyes-2024',
    status: 'past',
    type: 'exhibition',
    title: 'Natural Dyes & Sustainability',
    subtitle: 'Exploring traditional natural dyeing techniques and their relevance in sustainable fashion today.',
    dates: 'September 22, 2024',
    time: '10:00 AM – 6:00 PM',
    venue: 'India Habitat Centre',
    city: 'New Delhi',
    entryFee: 'Free',
    registration: null,
    heroGradient: 'linear-gradient(160deg, #7A8B60 0%, #4A5830 60%, #202C14 100%)',
    heroEmoji: '🌿',
    tagLabel: 'Past Exhibition',
    tagClass: 'past',

    description: [
      'The Natural Dyes & Sustainability exhibition at India Habitat Centre brought together India\'s foremost natural dye practitioners for a one-day symposium and exhibition. Structured around the thesis that natural dye practice is not merely ecological nostalgia but a viable contemporary production system, the event challenged several assumptions in the sustainable fashion conversation.',
      'Exhibitors included indigo farmers from Rajasthan, madder growers from Gujarat, and dyers working with Assam\'s traditional eri silk in natural dye baths. The exhibition showed finished textiles alongside the plants, minerals and process samples that created them — making visible the entire chain from field to fabric.',
      'CCI\'s ongoing partnership with several NGOs in this space has shown that natural dye supply chains, when properly supported, can provide supplementary income to farming communities while reducing the chemical load on water systems near dyeing clusters.'
    ],

    highlights: [
      { icon: '🌱', title: 'Farm to Fabric', text: 'Complete supply chain displayed — from dye plants and minerals to finished natural-dyed textiles.' },
      { icon: '♻️', title: 'Zero Effluent', text: 'Live demonstration of natural dye processes with no harmful water discharge.' },
      { icon: '🎤', title: 'Symposium', text: 'Half-day symposium with dyers, designers, and sustainable fashion researchers.' },
      { icon: '🛍️', title: 'Natural Dye Bazaar', text: 'Small sale of natural-dyed textiles and dye material kits.' }
    ],

    schedule: [
      { time: '10:00 AM', title: 'Exhibition Opens', desc: 'Self-guided tour of natural dye material displays, process samples, and finished textiles from 12 participating artisans.' },
      { time: '11:00 AM', title: 'Symposium: Indigo Revival', desc: 'Panel on the revival of indigo cultivation in Rajasthan and its market implications for natural dye supply chains.' },
      { time: '2:00 PM', title: 'Demonstration: Indigo Vat', desc: 'Live demonstration of indigo vat preparation, reduction, and yarn dyeing. Visitors can dip a sample.' },
      { time: '4:00 PM', title: 'Panel: Fashion & Craft', desc: 'Designers discuss integrating natural dye textiles into contemporary fashion supply chains.' }
    ],

    people: [
      { initials: 'KD', name: 'Kavita Devi', role: 'Indigo Farmer & Dyer, Mandawa, Rajasthan', color: '#4A5830' },
      { initials: 'RN', name: 'Rajan Nair', role: 'Natural Dye Researcher, Coimbatore', color: '#7A8B60' },
      { initials: 'SB', name: 'Shruti Bajaj', role: 'Sustainable Fashion Designer, Delhi', color: '#5B7053' }
    ],

    gallery: [
      { emoji: '🌿', bg: 'linear-gradient(135deg,#7A8B60,#4A5830)' },
      { emoji: '💙', bg: 'linear-gradient(135deg,#1E3A5C,#4A84C0)' },
      { emoji: '🧵', bg: 'linear-gradient(135deg,#C4845C,#8A4820)' },
      { emoji: '🌾', bg: 'linear-gradient(135deg,#C4A44A,#8B6914)' }
    ],

    related: ['thari-2025', 'block-printing-workshop-2025']
  },
  
 */

  /* ── END OF WORKING EXAMPLES ── */

  //  CCI Events 2024

  {
    "id": "kamala-awards-2023",
    "type": "award",
    "title": "Kamala Awards 2023",
    "subtitle": "Honouring excellence in India’s craft traditions.",
    "dates": "November 23, 2024",
    "time": "4:00 PM – 8:00 PM",
    "venue": "MRC Convention Centre, ",
    "city": "Chennai",
    image: "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-53.webp",
    "heroGradient": "linear-gradient(160deg,#7B5E2E,#3E2F14)",
    "heroEmoji": "🏆",
    "tagLabel": "Past Award",
    "tagClass": "past",
    "description": [
      "Instituted by the Craft Council of India in memory of Kamaladevi Chattopadhyay, the Kamala Awards honour excellence in India’s craft traditions.",
      "The 2023 awardees represent diverse practices—from Madhubani and Kalamkari to Kinnal art and Telia Rumal—blending tradition with innovation.",
      "Together, they reflect the enduring spirit and evolution of India’s rich craft heritage."
    ],
    "gallery": [

      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-1.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-2.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-5.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-6.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-7.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-12.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-13.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-14.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-15.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-16.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-17.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-20.webp",
       "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-22.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-23.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-24.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-27.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-28.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-29.webp",
      "images/events/2024-events/kamala-awards-2023/kamala-awards-2023-30.webp"
    ]
  },


  // CCI Events 2025

  {
    "id": "tari-loom-2025",
    "type": "exhibition",
    "title": "Tari – The Loom",
    "subtitle": "A curated textile showcase blending tradition and contemporary design.",
    "dates": "March 7– 8, 2025",
    "time": "10:00 AM – 7:00 PM",
    "venue": "Chola Sheraton,",
    "city": "chennai, Tamil Nadu",
    "image": "images/events/2025-events/2025-tari-the-hand-loom.webp",
    "heroGradient": "linear-gradient(160deg,#C4A44A,#4A3010)",
    "heroEmoji": "🧵",
    "tagLabel": "Past Exhibition",
    "tagClass": "past",
    "description": [
      "The Craft Council of India Textile Show brings together 31 rare handloom collections.",
      "From Patan Patola and Jamdani to Kotpad and Bhujodi, each piece reflects India’s textile heritage.",
      "The collections emphasize sustainability through natural dyes and handcrafted processes."
    ],
    "gallery": [
      "images/events/2025-events/2025-tari-the-hand-loom-1.webp",
      "images/events/2025-events/2025-tari-the-hand-loom-2.webp",
      "images/events/2025-events/2025-tari-the-hand-loom-3.webp"
    ]
  },

   {
    "id": "video-competition-2025",
    "type": "event",
    "title": "Video Competition 2025",
    "subtitle": "Uncover India's craft stories and traditions",
    "dates": "July 28– 31, 2025",
    "time": "10:00 AM – 7:00 PM",
    "venue": "CCI Office, ",
    "city": "chennai, Tamil Nadu",
    "image": "images/events/2025-events/2025-video-conference.webp",
    "heroGradient": "linear-gradient(160deg,#C4A44A,#4A3010)",
    "heroEmoji": "🧵",
    "tagLabel": "Past Exhibition",
    "tagClass": "past",
    "description": [
      "The competition is an open call by the Crafts Council of India (CCI) to celebrate its 60th anniversary.",
      "Participants can choose any craft that sparks their interest, such as basket picking, bronze sculpting, or pottery.",
      
    ],
    "gallery": [
      "images/events/2025-events/2025-video-conference-1.webp",
      "images/events/2025-events/2025-video-conference-2.webp",
      "images/events/2025-events/2025-video-conference-3.webp"
    ]
  },

  {
    "id": "textile-show-2025",
    "type": "exhibition",
    "title": "Textile Show",
    "subtitle": "Celebrating India’s sari heritage through curated handwoven collections.",
    "dates": "August 12– 13, 2025",
    "time": "11:00 AM – 8:00 PM",
    "venue": "MRC Convention Centre",
    "city": "Chennai, Tamil Nadu",
    "image": "images/events/2025-events/2025-textile-show.webp",
    "heroGradient": "linear-gradient(160deg,#8B3A1E,#5C2410)",
    "heroEmoji": "🪡",
    "tagLabel": "Past Exhibition",
    "tagClass": "past",
    "description": [
      "Showcases 42 curated handwoven collections celebrating India’s sari heritage.",
      "Marking CCI’s 60 years, it highlights craftsmanship and sustainability."
    ],
    "gallery": [
      "images/events/2025-events/2025-textile-show-1.webp",
      "images/events/2025-events/2025-textile-show-2.webp",
      "images/events/2025-events/2025-textile-show-3.webp"
    ]
  },

  {
    "id": "cci-60-book-launch",
    "type": "event",
    "title": "Book Launch & CCI Turns 60",
    "subtitle": "Celebrating six decades of the Crafts Council of India.",
    "dates": "October 27, 2025",
    "time": "",
    "venue": "",
    "city": "",
   "image": "images/events/2025-events/cci-book-release-60.webp",
    "heroGradient": "linear-gradient(160deg,#444,#111)",
    "heroEmoji": "📚",
    "tagLabel": "Past Event",
    "tagClass": "past",
    "description": [
      "A commemorative book launch celebrating 60 years of CCI."
    ],
    "gallery": [

      "images/events/2025-events/cci-book-release-60.webp",
      "images/events/2025-events/cci-book-release-60-1.webp",
      "images/events/2025-events/cci-book-release-60-2.webp"
  
    ]
  },

  {
    "id": "cci-60-exhibition",
    "type": "exhibition",
    "title": "A Tapestry of Work Woven Through Time",
    "subtitle": "An exhibition showcasing six decades of CCI’s journey.",
    "dates": "October 27– 29, 2025",
    "time": "11:00 AM – 6:00 PM",
    "venue": "The Foly, Amethyst, Whites road",
    "city": "Chennai",
    "image": "images/events/2025-events/cci-60-journey.webp",
    "heroGradient": "linear-gradient(160deg,#6B4F2B,#2E1F10)",
    "heroEmoji": "🧶",
    "tagLabel": "Past Exhibition",
    "tagClass": "past",
    "description": [
      "An exhibition highlighting CCI’s journey and contributions to craft heritage."
    ],
    "gallery": [
      "images/events/2025-events/cci-60-journey-1.webp",
      "images/events/2025-events/cci-60-journey-2.webp",
      "images/events/2025-events/cci-60-journey-3.webp",

    ]
  },

    // CCI 2026 Events

  {
    "id": "symposium-handmade-2026",
    "type": "symposium",
    "title": "Symposium on The Future of Handmade",
    "subtitle": "Exploring the future of handmade traditions.",
    "dates": "February 1, 2026",
    "time": "",
    "venue": "Chettinad",
    "city": "Tamil Nadu",
    "image": "images/events/2026-events/2026-Symposium-the-future-of-handmade.webp",
    "heroGradient": "linear-gradient(160deg,#3A4E34,#1A2518)",
    "heroEmoji": "🧠",
    "tagLabel": "Upcoming Event",
    "tagClass": "upcoming",
    "description": [
      "The Symposium brought together diverse voices to explore the future of the handmade sector, focusing on Gen Z entrepreneurship, digital platforms like handmade.world, and climate-resilient craft practices. Led by initiatives such as Creative Dignity, it highlighted the need for collaboration, shared knowledge, and collective effort to build a resilient future for handmade traditions."
    ],
    "gallery": [
      "images/events/2026-events/2026-Symposium-the-future-of-handmade-1.webp",
      "images/events/2026-events/2026-Symposium-the-future-of-handmade-2.webp",
      "images/events/2026-events/2026-Symposium-the-future-of-handmade-3.webp",
      "images/events/2026-events/2026-Symposium-the-future-of-handmade-4.webp",
      "images/events/2026-events/2026-Symposium-the-future-of-handmade-5.webp"
    ]
  },

  {
    "id": "craft-bazaar-2026",
    "type": "exhibition",
    "title": "Craft Bazaar",
    "subtitle": "A vibrant showcase of artisans from across India.",
    "dates": "February 13–17, 2026",
    "time": "10:30 AM – 7:00 PM",
    "venue": "Mother Teresa women\'s Complex",
    "city": "Chennai",
    "image": "images/events/2026-events/2026-craft-bazzar.webp",
    "heroGradient": "linear-gradient(160deg,#8B6914,#4A3010)",
    "heroEmoji": "🛍️",
    "tagLabel": "Upcoming Exhibition",
    "tagClass": "upcoming",
    "description": [
      "A vibrant showcase of artisans from across India, featuring textiles, paintings, and handcrafted products—from ikat and Kanjivaram to Pattachitra and Ajrakh—alongside wood, metal, and eco-friendly crafts, celebrating tradition, innovation, and sustainability."
    ],
    "gallery": [
      "images/events/2026-events/2026-craft-bazzar-1.webp",
      "images/events/2026-events/2026-craft-bazzar-2.webp",
      "images/events/2026-events/2026-craft-bazzar-3.webp",
      "images/events/2026-events/2026-craft-bazzar-4.webp",
      "images/events/2026-events/2026-craft-bazzar-5.webp"
    ]
  },

   {
    id: 'kamala-awards-2025',
    status: 'past',
    type: 'award',
    title: 'Kamala Awards Ceremony 2024 - 2025',
    subtitle: 'An evening honouring the master craftspeople who have dedicated their lives to India\'s living heritage.',
    dates: 'March 21, 2026',
    time: '4:00 PM – 9:30 PM',
    venue: 'MRC Convention Centre,',
    city: 'Chennai,',
    image: "images/events/2026-events/2026-kamala-awards.webp",
    heroGradient: 'linear-gradient(160deg, #8B7355 0%, #4A3728 60%, #1E1410 100%)',
    heroEmoji: '🏆',
    tagLabel: 'Past Event',
    tagClass: 'past',

    description: [
      'The Kamala Awards are the Crafts Council of India\'s highest honour — given annually to master craftspeople whose work has made an exceptional and enduring contribution to India\'s craft heritage. The 2024 ceremony, held at Chennai\'s historic Museum Theatre, recognised six artisans across three categories: Lifetime Achievement, Excellence in Craft, and the Young Artisan Award.',
      'Named after Kamaladevi Chattopadhyay, the awards carry her conviction that the craftsperson is not merely a producer but a cultural custodian — someone whose hands carry millennia of knowledge. The 2024 laureates represented weaving, metal casting, natural dyeing, and terracotta traditions.',
      'The event was attended by over 400 guests including artisans, collectors, designers, academics, and representatives from state governments. A retrospective exhibition of past laureates\' work was displayed in the museum foyer.'
    ],

 // Participating artists / speakers — up to 6

   people: [

  {
    initials: "BK",
    name: "B. Krishnamoorthy",
    role: "Kamala Samman – Lifetime Achievement in Craft · Kanchipuram Saree Weaving & Design",
    color: "#8B3A1E"
  },

  {
    initials: "KA",
    name: "Khawaja Nazir Ali",
    role: "Kamala Award for Excellence in Crafts · Sozmi Embroidery",
    color: "#5B7053"
  },

  {
    initials: "KS",
    name: "K. Srinivasarao",
    role: "Kamala Award for Excellence in Crafts · Woodcraft",
    color: "#4A3728"
  },

  {
    initials: "DV",
    name: "Doru Lakhabhai Valabhai",
    role: "Kamala Award for Excellence in Weaving · Kashmir Woollen Shawl (Handweaving)",
    color: "#8B6914"
  },

  {
    initials: "RL",
    name: "Rahman Lone",
    role: "Kamala Award for Contribution to Crafts · Handloom Weaving",
    color: "#3A4E34"
  },

  {
    initials: "GK",
    name: "Gurinder Kaur Bhullar",
    role: "Kamala Award for Revival of Languishing Craft · Phulkari Handwork",
    color: "#7A3818"
  },

  {
    initials: "KS",
    name: "Kumari Suman",
    role: "Kamala Young Artisan Award · Hand-Knotted Carpet Weaving",
    color: "#C4845C"
  }

],
    

    gallery: [
     "images/events/2026-events/2026-kamala-awards.webp",
     "images/events/2026-events/2026-kamala-awards-2.webp",
     "images/events/2026-events/2026-kamala-awards-3.webp",
     "images/events/2026-events/2026-kamala-awards-4.webp"
    ],

  },


  



{
  "id": "national-meet-2026",
  "type": "conference",
  "title": "National Meet",
  "subtitle": "A national gathering focused on preserving and promoting India’s craft heritage.",
  "dates": "October 7–8, 2026",
  "time": "10:00 AM – 5:30 PM",
  "venue": "",
  "city": "Ahmedabad",
  "image": "images/events/2026-events/national-meet.webp",
  "heroGradient": "linear-gradient(160deg,#6E4A1F,#1F1207)",
  "heroEmoji": "🇮🇳",
  "tagLabel": "Upcoming Meet",
  "tagClass": "upcoming",
  "description": [
    "Bringing together craft councils, artisans, designers, scholars, and cultural leaders from across the country."
  ],
  "gallery": [
    
  ]
},



 {
  "id": "chikankari-popup-june-2026",
  "type": "popup",
  "title": "Chikankari Pop-Up",
  "subtitle": "Discover the timeless elegance of handcrafted Chikankari embroidery.",
  "dates": "June 18–20, 2026",
  "time": "11:00 AM – 7:00 PM",
  "venue": "Kamala Crafts Shop",
  "city": "Chennai",
  "image": "images/events/2026-events/chikankari-popup/chikankari-popup-2026-1.jpeg",
  "heroGradient": "linear-gradient(160deg,#F7E7CE,#D4A373)",
  "heroEmoji": "🧵",
  "tagLabel": "Upcoming",
  "tagClass": "upcoming",
  "description": [
    "An embroidery tradition once cherished by royalty, Chikankari continues to captivate with its grace, intricacy, and timeless appeal.",
    "Explore a curated collection of handcrafted kurtas, tunics, dupattas, stoles, palazzos, and more, each adorned with delicate hand embroidery.",
    "Experience the beauty of this celebrated craft and discover the stories, skills, and heritage woven into every piece."
  ],
  "gallery": [
    "images/events/2026-events/chikankari-popup/chikankari-popup-2026-1.jpeg"
  ],
  "contact": [
    "98407 00445"
  ],
  "entryFee": "Free Entry",
  "address": "37, 1st Floor, T.T.K. Road, Royapettah, Opposite Music Academy In Gate, Chennai 600014",
  "mapLink": "https://maps.app.goo.gl/hc87i7g6tA8mhmZ98?g_st=awb",
  "shopTiming": "11:00 AM – 7:00 PM"
},



  // CCI 2026 Events =================================================================
  
//   ======================KAMALA Shop Events ================================


{
  "id": "jamboree-with-jolly-jeeva-2026",
  "type": "workshop",
  "title": "Jamboree with Jolly Jeeva",
  "subtitle": "An interactive storytelling session filled with stories, laughter, imagination, and role-playing.",
  "dates": "June 6, 2026",
  "time": "11:00 AM",
  "venue": "Kamala Crafts Shop",
  "city": "Chennai",
  "image": "images/events/2026-events/jolly-jeeva/jolly-jeeva-2026-1.jpeg",
  "heroGradient": "linear-gradient(160deg,#F4A261,#E76F51)",
  "heroEmoji": "📚",
  "tagLabel": "Upcoming Event",
  "tagClass": "upcoming",
  "description": [
    "Join us for a morning filled with stories, laughter, imagination, and role-playing as beloved storyteller Jeeva Aunty brings alive 3–4 delightful stories from the world of Tulika.",
    "Perfect for young listeners aged 4+, this interactive storytelling session will be conducted in English with a touch of Tanglish, making it engaging, playful, and memorable.",
    "Ticket includes entry for one child and one parent."
  ],
  "gallery": [
    "images/events/2026-events/jolly-jeeva/jolly-jeeva-2026-1.jpeg"
  ],
  "pricing": [
    "₹300 per child + 1 parent",
    "Additional parent: ₹100"
  ],
  "contact": [
    "DM to Register"
  ],
  "address": "37, T.T.K Road, First Floor, Royapettah, Opposite Music Academy IN Gate, Chennai – 600014"
},

{
  "id": "kamala-kreeda-summer-workshop-2026",
  "type": "workshop",
  "title": "Kamala x Kreeda Summer Workshop",
  "subtitle": "Fun-filled traditional games and creative activities for children.",
  "dates": "May 9, 16, 23 & 30, 2026",
  "time": "10:30 AM – 12:30 PM",
  "venue": "Kamala Crafts Shop",
  "city": "Chennai",
  "image": "images/events/2026-events/kamala-kreeda/kamala-kreeda-2026-1.jpeg",
  "heroGradient": "linear-gradient(160deg,#D9B72F,#5B7F2A)",
  "heroEmoji": "🎲",
  "tagLabel": "Upcoming Workshop",
  "tagClass": "upcoming",
  "description": [
    "Join Kamala Crafts Shop and Kreeda for a joyful summer workshop celebrating traditional games and creative learning.",
    "Designed for children aged 5 and above with engaging hands-on activities in a fun environment.",
    "Limited parking available at the venue."
  ],
  "gallery": [
    "images/events/2026-events/kamala-kreeda/kamala-kreeda-2026-1.jpeg"
  ],
  "contact": [
    "98407 00445",
    "98417 48309"
  ],
  "address": "37, T.T.K Road, First Floor, Royapettah, Opposite Music Academy IN Gate, Chennai – 600014"
},
 
 {
    "id": "kamala-kreeda-odisha-2026",
    "type": "workshop",
    "title": "Kamala x Kreeda – Odisha Journey",
    "subtitle": "Stories, games, crafts and heritage traditions of Odisha.",
    "dates": "May 16, 2026",
    "time": "10:30 AM – 12:30 PM",
    "venue": "Kamala Crafts Shop",
     "entryFee": "₹250 per family",
    "city": "Chennai",
    "image": "images/events/2026-events/kamala-kreeda/odisha-2026-1.jpeg",
    "heroGradient": "linear-gradient(160deg,#0B6B3A,#D7B739)",
    "heroEmoji": "🎲",
    "tagLabel": "Upcoming Workshop",
    "tagClass": "upcoming",
    "description": [
      "Journey through Odisha with stories, traditional games, craft traditions and cultural heritage.",
      "Explore Puri, Konark, Bhubaneswar and the remarkable craft village of Raghurajpur.",
      "Join Vinita Sidhartha of Kreeda and historian Chitra Madhavan for an engaging summer morning of discovery."
    ],
    "gallery": [
      "images/events/2026-events/kamala-kreeda/odisha-2026-1.jpeg"
    ],
    "contact": [
      "98407 00445",
      "98417 48309"
    ],
    "ticketPrice": "₹250 per family",
    "ageGroup": "Age 5 onwards",
    "address": "37, 1st Floor, T.T.K Road, Royapettah, Opposite Music Academy IN Gate, Chennai 600014",
    "mapLink": "https://maps.app.goo.gl/hc87i7g6tA8mhmZ98?g_st=awb"
  },
  {
    "id": "kamala-kreeda-karnataka-2026",
    "type": "workshop",
    "title": "Kamala x Kreeda – Karnataka Journey",
    "subtitle": "Crafts, games, heritage and storytelling from Karnataka.",
    "dates": "May 23, 2026",
    "time": "10:30 AM – 12:30 PM",
    "venue": "Kamala Crafts Shop",
    "entryFee": "₹250 per family",
    "city": "Chennai",
    "image": "images/events/2026-events/kamala-kreeda/karnataka-2026-1.jpeg",
    "heroGradient": "linear-gradient(160deg,#D7B739,#0B6B3A)",
    "heroEmoji": "🎨",
    "tagLabel": "Upcoming Workshop",
    "tagClass": "upcoming",
    "description": [
      "Discover the toy village of Channapatna near Mysuru and the magnificent Hoysala architecture of Halebidu, Belur and Somnathpur.",
      "A unique conversation around craft, games and history for children and families.",
      "Join Vinita Sidhartha of Kreeda and heritage activist V. Sriram."
    ],
    "gallery": [
      "images/events/2026-events/kamala-kreeda/karnataka-2026-1.jpeg"
    ],
    "contact": [
      "98407 00445",
      "98417 48309"
    ],
    "ticketPrice": "₹250 per family",
    "ageGroup": "Age 5 onwards",
    "address": "37, 1st Floor, T.T.K Road, Royapettah, Opposite Music Academy IN Gate, Chennai 600014",
    "mapLink": "https://maps.app.goo.gl/hc87i7g6tA8mhmZ98?g_st=awb"
  },
  {
    "id": "kamala-kreeda-tamilnadu-2026",
    "type": "workshop",
    "title": "Kamala x Kreeda – Tamil Nadu Journey",
    "subtitle": "Stories, games, crafts and living traditions of Tamil Nadu.",
    "dates": "May 30, 2026",
    "time": "10:30 AM – 12:30 PM",
    "venue": "Kamala Crafts Shop",
    "entryFee": "₹250 per family",
    "city": "Chennai",
    "image": "images/events/2026-events/kamala-kreeda/tamilnadu-2026-1.jpeg",
    "heroGradient": "linear-gradient(160deg,#0B6B3A,#D7B739)",
    "heroEmoji": "🏺",
    "tagLabel": "Upcoming Workshop",
    "tagClass": "upcoming",
    "description": [
      "Celebrate the rich living traditions of Tamil Nadu through stories, games, crafts and heritage.",
      "An interactive session designed for children, parents and grandparents alike.",
      "Join Vinita Sidhartha of Kreeda and history enthusiast Pradeep Chakravarthy."
    ],
    "gallery": [
      "images/events/2026-events/kamala-kreeda/tamilnadu-2026-1.jpeg"
    ],
    "contact": [
      "98407 00445",
      "98417 48309"
    ],
    "ticketPrice": "₹250 per family",
    "ageGroup": "Age 5 onwards",
    "address": "37, 1st Floor, T.T.K Road, Royapettah, Opposite Music Academy IN Gate, Chennai 600014",
    "mapLink": "https://maps.app.goo.gl/hc87i7g6tA8mhmZ98?g_st=awb"
  },
  {
    "id": "kamala-kreeda-summer-journey-2026",
    "type": "workshop-series",
    "title": "Kamala x Kreeda – Summer Journey Through India",
    "subtitle": "Traditional games, storytelling, crafts and heritage across India.",
    "dates": "May 16–30, 2026",
    "time": "10:30 AM – 12:30 PM",
    "venue": "Kamala Crafts Shop",
    "entryFee": "₹250 per family",
    "city": "Chennai",
    "image": "images/events/2026-events/kamala-kreeda/summer-journey-2026-1.jpeg",
    "heroGradient": "linear-gradient(160deg,#D7B739,#0B6B3A)",
    "heroEmoji": "🎲",
    "tagLabel": "Workshop Series",
    "tagClass": "upcoming",
    "description": [
      "Our Summer Journey Through India continues with immersive Saturdays exploring Odisha, Karnataka and Tamil Nadu.",
      "Each session brings together traditional games, storytelling, crafts and shared experiences for children, parents and grandparents alike.",
      "Join us for unhurried summer mornings filled with play, heritage and discovery."
    ],
    "gallery": [
      "images/events/2026-events/kamala-kreeda/summer-journey-2026-1.jpeg",
      "images/events/2026-events/kamala-kreeda/odisha-2026-1.jpeg",
      "images/events/2026-events/kamala-kreeda/karnataka-2026-1.jpeg",
      "images/events/2026-events/kamala-kreeda/tamilnadu-2026-1.jpeg"
    ],
    "contact": [
      "98407 00445",
      "98417 48309"
    ],
    "ticketPrice": "₹250 per family",
    "ageGroup": "Age 5 onwards",
    "address": "37, 1st Floor, T.T.K Road, Royapettah, Opposite Music Academy IN Gate, Chennai 600014",
    "parking": "Valet Parking Available",
    "mapLink": "https://maps.app.goo.gl/hc87i7g6tA8mhmZ98?g_st=awb"
  },
 


  // Kamala  Awards 2025 - 2026

  {
    "id": "manas-popup-2025",
    "type": "exhibition",
    "title": "Manas Pop-up Show",
    "subtitle": "Blending heritage craftsmanship with contemporary design.",
    "dates": "January 8–11, 2025",
    "time": "11:00 AM – 7:00 PM",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2025-events/manas/manas-2025__1_.webp",
    "heroGradient": "linear-gradient(160deg,#6B4F2B,#2E1F10)",
    "heroEmoji": "🧶",
    "tagLabel": "Past Exhibition",
    "tagClass": "past",
    "description": [
      "MANAS blends heritage craftsmanship with contemporary design to create globally appealing pieces.",
      "Tradition fuels creativity, driving excellence in craftsmanship."
    ],
    "gallery": [
      "images/events/2025-events/manas/manas-2025__1_.webp",
      "images/events/2025-events/manas/manas-2025__2_.webp",
      "images/events/2025-events/manas/manas-2025__3_.webp",
      "images/events/2025-events/manas/manas-2025__4_.webp",
      "images/events/2025-events/manas/manas-2025__5_.webp",


    ]
  },

  {
    "id": "aiaca-popup-2025",
    "type": "exhibition",
    "title": "AIACA Pop-up Show",
    "subtitle": "Strengthening India’s craft sector through market-led growth.",
    "dates": "January 23–25, 2025",
    "time": "11:00 AM – 1:00 PM",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2025-events/aiaca-1.webp",
    "heroGradient": "linear-gradient(160deg,#3A4E34,#1A2518)",
    "heroEmoji": "🛍️",
    "tagLabel": "Past Exhibition",
    "tagClass": "past",
    "description": [
      "AIACA works to strengthen India’s craft sector by improving artisan incomes and livelihoods.",
      "It supports artisans through policy advocacy, design, and market access initiatives."
    ],
    "gallery": [
      "images/events/2025-events/aiaca-1.webp",
      "images/events/2025-events/aiaca-2.webp",
      "images/events/2025-events/aiaca-3.webp",
    
    ]
  },

  {
    "id": "revathi-talk-2025",
    "type": "event",
    "title": "Talk by Ms. Revathi Sankaran",
    "subtitle": "Exploring South Indian textiles and crafts.",
    "dates": "February 21, 2025",
    "time": "4:00 PM - onwards",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2025-events/talk-by-revathi-1.webp",
    "heroGradient": "linear-gradient(160deg,#7A8B60,#202C14)",
    "heroEmoji": "🎤",
    "tagLabel": "Past Event",
    "tagClass": "past",
    "description": [
      "A nostalgic journey through South Indian traditions and textiles.",
      "Explored Eeya Pathram, Kalchatti, and heritage sarees."
    ],
    "gallery": [
      "images/events/2025-events/talk-by-revathi-1.webp",
      "images/events/2025-events/talk-by-revathi-2.webp",
      "images/events/2025-events/talk-by-revathi-3.webp"
    ]
  },

  {
    "id": "c4c-popup-2025",
    "type": "event",
    "title": "Care for Cause Pop-up & Talk",
    "subtitle": "Reviving Chendamangalam weaving traditions.",
    "dates": "June 26–28, 2025",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2025-events/c4c-2025/3.webp",
    "heroGradient": "linear-gradient(160deg,#8B6914,#4A3010)",
    "heroEmoji": "🧵",
    "tagLabel": "Past Event",
    "tagClass": "past",
    "description": [
      "A story of revival and resilience of Chendamangalam weaving traditions.",
      "Focused on artisan support after the 2018 floods."
    ],
       people: [
  {
    initials: "MM",
    name: "Meera Mammen",
    role: "Host",
    color: "#7A3818"
  },

  {
    initials: "TM",
    name: "Thejo Menon",
    role: "Host ",
    color: "#C4845C"
  }

],
    "gallery": [
      "images/events/2025-events/c4c-2025/1.webp",
      "images/events/2025-events/c4c-2025/2.webp",
      "images/events/2025-events/c4c-2025/3.webp",
      "images/events/2025-events/c4c-2025/7.webp",
      "images/events/2025-events/c4c-2025/8.webp",
      "images/events/2025-events/c4c-2025/11.webp",
    ]
  },

  {
    "id": "bric-brac-2025",
    "type": "exhibition",
    "title": "Bric-a-Brac Pop-up Show",
    "subtitle": "Handmade terracotta and artisanal homeware.",
    "dates": "July 31 – August 6, 2025",
    "time": "11:00 AM – 1:00 PM",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2025-events/bric-a-brac/1.webp",
    "heroGradient": "linear-gradient(160deg,#C4845C,#8A4820)",
    "heroEmoji": "🏺",
    "tagLabel": "Past Exhibition",
    "tagClass": "past",
    "description": [
      "A collaboration bringing handcrafted terracotta and artisanal homeware."
    ],
    "gallery": [
      "images/events/2025-events/bric-a-brac//bric-a-brac-2025_(1).webp",
      "images/events/2025-events/bric-a-brac//bric-a-brac-2025_(2).webp",  
      "images/events/2025-events/bric-a-brac//bric-a-brac-2025_(3).webp",
      "images/events/2025-events/bric-a-brac//bric-a-brac-2025_(4).webp",
      "images/events/2025-events/bric-a-brac//bric-a-brac-2025_(5).webp",
      "images/events/2025-events/bric-a-brac//bric-a-brac-2025_(6).webp"
    ]
  },

  {
    "id": "handloom-day-2025",
    "type": "event",
    "title": "Handloom Day Talk",
    "subtitle": "Celebrating India’s handloom traditions.",
    "dates": "August 7, 2025",
    "time": "11:00 AM – 1:00 PM",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2025-events/handloom-day-2025/9.webp",
    "heroGradient": "linear-gradient(160deg,#5B7053,#3A4E34)",
    "heroEmoji": "🪡",
    "tagLabel": "Past Event",
    "tagClass": "past",
    "description": [
      "A conversation with master weaver Krishnamurthy and TN Venkatesh IAS.",
      "Focused on handloom awareness and heritage."
    ],
    "gallery": [
      "images/events/2025-events/handloom-day-2025/1.webp",
      "images/events/2025-events/handloom-day-2025/2.webp",
      "images/events/2025-events/handloom-day-2025/3.webp",
      "images/events/2025-events/handloom-day-2025/4.webp",
      "images/events/2025-events/handloom-day-2025/5.webp",
      "images/events/2025-events/handloom-day-2025/6.webp",
      "images/events/2025-events/handloom-day-2025/7.webp",
      "images/events/2025-events/handloom-day-2025/8.webp",
      "images/events/2025-events/handloom-day-2025/9.webp",
      "images/events/2025-events/handloom-day-2025/10.webp"
    ]
  },

  {
    "id": "paithani-popup-2025",
    "type": "exhibition",
    "title": "Paithani Pop-up Show",
    "subtitle": "Discover heirloom Paithanis reimagined for today.",
    "dates": "November 17–22, 2025",
    "time": "11:00 AM – 7:00 PM",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2025-events/paithani-2025/3.webp",
    "heroGradient": "linear-gradient(160deg,#7B5E2E,#3E2F14)",
    "heroEmoji": "👗",
    "tagLabel": "Past Exhibition",
    "tagClass": "past",
    "description": [
      "A showcase of heritage Paithani sarees with contemporary design.",
      "Featuring work by Mruga Kirloskar."
    ],
    "gallery": [
      "images/events/2025-events/paithani-2025/1.webp",
      "images/events/2025-events/paithani-2025/2.webp",
      "images/events/2025-events/paithani-2025/3.webp",
      "images/events/2025-events/paithani-2025/4.webp",
      "images/events/2025-events/paithani-2025/5.webp",
      "images/events/2025-events/paithani-2025/6.webp",
      "images/events/2025-events/paithani-2025/7.webp",
      "images/events/2025-events/paithani-2025/8.webp",
      "images/events/2025-events/paithani-2025/9.webp",
      "images/events/2025-events/paithani-2025/10.webp",
      "images/events/2025-events/paithani-2025/11.webp",
      "images/events/2025-events/paithani-2025/12.webp"
    ]
  },

  {
    "id": "pashmina-popup-2025",
    "type": "exhibition",
    "title": "Pashmina Pop-up Show",
    "subtitle": "Celebrating authentic Kashmiri craftsmanship.",
    "dates": "December 4–6, 2025",
    "time": "11:00 AM – 7:00 PM",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(2).webp",
    "heroGradient": "linear-gradient(160deg,#4A4A6A,#2B2B3C)",
    "heroEmoji": "🧣",
    "tagLabel": "Past Exhibition",
    "tagClass": "past",
    "description": [
      "Showcasing luxurious handwoven pashminas crafted using ancient techniques.",
      "Featuring master weaver Firdose Ahmad Jan."
    ],
    "gallery": [

      "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(1).webp",
      "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(2).webp",
      "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(3).webp",
      "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(4).webp",
      "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(5).webp",
      "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(6).webp",
      "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(7).webp",
      "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(8).webp",
      "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(9).webp",
      "images/events/2025-events/pashmina-2025/Pashminas_Pop_Up_Show_(10).webp"
    ]
  },

  {
    "id": "tribal-jewellery-2026",
    "type": "exhibition",
    "title": "Tribal Jewellery Pop-up Show",
    "subtitle": "Celebrating craft, culture, and contemporary expression.",
    "dates": "January 8–30, 2026",
    "time": "11:00 AM – 7:00 PM",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image":  "images/events/2026-events/tribal-jewellery-2026/tribal-jewel__1_.webp",
    "heroGradient": "linear-gradient(160deg,#8B3A1E,#5C2410)",
    "heroEmoji": "💍",
    "tagLabel": "Upcoming Exhibition",
    "tagClass": "upcoming",
    "description": [
      "Featuring Nazari Arts, Peno, Sonam Dorjee, Vam, and Zola.",
      "Celebrates Indian design through unique perspectives."
    ],
    "gallery": [
    "images/events/2026-events/tribal-jewellery-2026/tribal-jewel__1_.webp",
    "images/events/2026-events/tribal-jewellery-2026/tribal-jewel__2_.webp",
    "images/events/2026-events/tribal-jewellery-2026/tribal-jewel__3_.webp",
    "images/events/2026-events/tribal-jewellery-2026/tribal-jewel__4_.webp",
    "images/events/2026-events/tribal-jewellery-2026/tribal-jewel__5_.webp"
    ]
  },

  {
    "id": "shrujan-popup-2026",
    "type": "exhibition",
    "title": "Shrujan Pop-up Show",
    "subtitle": "Celebrating Kutch embroidery traditions.",
    "dates": "March 17–19, 2026",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2026-events/shrujan/shrujan.webp",
    "heroGradient": "linear-gradient(160deg,#C4A44A,#8B6914)",
    "heroEmoji": "🧵",
    "tagLabel": "Upcoming Exhibition",
    "tagClass": "upcoming",
    "description": [
      "A celebration of embroidery traditions from Kutch communities.",
      "Supports artisan livelihoods while preserving cultural heritage."
    ],
    "gallery": [
     
      "images/events/2026-events/shrujan/14.webp",
      "images/events/2026-events/shrujan/15.webp",
      "images/events/2026-events/shrujan/16.webp",
      "images/events/2026-events/shrujan/17.webp",
      "images/events/2026-events/shrujan/18.webp",
      "images/events/2026-events/shrujan/25.webp",
      "images/events/2026-events/shrujan/20.webp",
      "images/events/2026-events/shrujan/21.webp",
      "images/events/2026-events/shrujan/22.webp",
      "images/events/2026-events/shrujan/23.webp",
      "images/events/2026-events/shrujan/26.webp",
       "images/events/2026-events/shrujan/27.webp",

    ]
  },

  {
    "id": "bagru-popup-2026",
    "type": "exhibition",
    "title": "Bagru Pop-up Show & Live Demo",
    "subtitle": "Exploring traditional block printing techniques.",
    "dates": "March 24–28, 2026",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2026-events/bagru-2026/Bagru_x_Kamala_-_Pop_Up_posters.webp",
    "heroGradient": "linear-gradient(160deg,#C4845C,#8A4820)",
    "heroEmoji": "🖨️",
    "tagLabel": "Upcoming Exhibition",
    "tagClass": "upcoming",
    "description": [
      "Showcases Bagru printing using natural dyes and hand-carved blocks.",
      "Includes live demonstration by Mukesh Kumar Chippa."
    ],
    "gallery": [
     "images/events/2026-events/bagru-2026/Bagru-2026__1_.webp",
     "images/events/2026-events/bagru-2026/Bagru-2026__2_.webp",
     "images/events/2026-events/bagru-2026/Bagru-2026__3_.webp",
     "images/events/2026-events/bagru-2026/Bagru-2026__4_.webp",
     "images/events/2026-events/bagru-2026/Bagru-2026__5_.webp",
     "images/events/2026-events/bagru-2026/Bagru-2026__6_.webp",


    ]
  },

  {
    "id": "kids-workshop-2026",
    "type": "workshop",
    "title": "Storytelling & Crafts Workshop for Children",
    "subtitle": "Creative storytelling and hands-on craft for young minds.",
    "dates": "April 20–22, 2026",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2026-events/storytelling-2026/Storytelling-2026-april__1_.webp",
    "heroGradient": "linear-gradient(160deg,#7A8B60,#4A5830)",
    "heroEmoji": "🎨",
    "tagLabel": "Upcoming Workshop",
    "tagClass": "upcoming",
    "description": [
      "Three mornings of storytelling, art, and creative exploration for children.",
      "Encouraging imagination through craft and narratives."
    ],
    "gallery": [
      "images/events/2026-events/storytelling-2026/Storytelling-2026-april__1_.webp",
      "images/events/2026-events/storytelling-2026/Storytelling-2026-april__2_.webp",
      "images/events/2026-events/storytelling-2026/Storytelling-2026-april__3_.webp",
      "images/events/2026-events/storytelling-2026/Storytelling-2026-april__4_.webp",
      "images/events/2026-events/storytelling-2026/Storytelling-2026-april__5_.webp",
      "images/events/2026-events/storytelling-2026/Storytelling-2026-april__6_.webp",
      
    ]
  },

  {
    "id": "zishta-popup-2026",
    "type": "event",
    "title": "Zishta Pop-up & Talk",
    "subtitle": "Exploring traditional Indian home design and materials.",
    "dates": "April 25, 2026",
    "time": "4:00 PM – Onwards",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2026-events/zishta/zshta-2026.webp",
    "heroGradient": "linear-gradient(160deg,#5B7053,#3A4E34)",
    "heroEmoji": "🏠",
    "tagLabel": "Upcoming Event",
    "tagClass": "upcoming",
    "description": [
      "A talk on Indian homes shaped by balance, material, and meaning.",
      "Explores sustainability and traditional knowledge systems."
    ],
    "gallery": [
      "images/events/2026-events/zishta/zshta-2026.webp"
    ]
  },


  // July 2026 Pop-up Events
  {
    "id": "coppersoul-popup-july-2026",
    "type": "event",
    "title": "Style begins with the fabric.",
    "subtitle": "Visit the CopperSoul Collective pop-up at Kamala Crafts Shop.",
    "dates": "July 9–11, 2026",
    "time": "11:00 AM – 7:00 PM",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2026-events/pop-up-show-2026/pop-up-show-cloth.webp",
    "heroGradient": "linear-gradient(160deg,#8B6914,#4A3010)",
    "heroEmoji": "👕",
    "tagLabel": "Upcoming Event",
    "tagClass": "upcoming",
    "description": [
      "Discover CopperSoul Collective's thoughtfully designed clothing, where handwoven textiles crafted by women weavers take centre stage.",
      "With clean silhouettes, functional details, and effortless comfort, every garment celebrates the beauty of handmade fabric."
    ],
    "gallery": [
      "images/events/2026-events/pop-up-show-2026/pop-up-show-cloth.webp"
    ],
    "address": "37, 1st Floor, T.T.K. Road, Royapettah, Chennai 600 014 (Opposite Music Academy IN Gate)",
    "contact": [
      "98407 00445"
    ]
  },

  {
    "id": "rangsutra-popup-july-2026",
    "type": "event",
    "title": "Crafted by artisans, made for everyday living.",
    "subtitle": "Visit the RangSutra pop-up at Kamala Crafts Shop.",
    "dates": "July 9–11, 2026",
    "time": "11:00 AM – 7:00 PM",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2026-events/pop-up-show-2026/pop-up-show-cloth-pic.mp4.webp",
    "heroGradient": "linear-gradient(160deg,#C4845C,#8A4820)",
    "heroEmoji": "🧵",
    "tagLabel": "Upcoming Event",
    "tagClass": "upcoming",
    "description": [
      "Explore RangSutra's collection of handcrafted textiles and apparel that bring together traditional Indian craftsmanship and contemporary design.",
      "Every purchase supports rural artisans and helps keep craft traditions alive."
    ],
    "gallery": [
      "images/events/2026-events/pop-up-show-2026/pop-up-show-cloth-video.mp4"
    ],
    "address": "37, 1st Floor, T.T.K. Road, Royapettah, Chennai 600 014 (Opposite Music Academy IN Gate)",
    "contact": [
      "98407 00445"
    ]
  },
  
  {
  "id": "tribal-jewellery-contemporary-touch-kamala-september-2026",
  "type": "event",
  "title": "Tribal Jewellery with a Contemporary Touch",
  "subtitle": "Discover distinctive tribal jewellery from Bengal and Odisha, bringing together traditional forms, handmade details and a contemporary sense of style.",
  "dates": "24, 25, 26 September 2026",
  "time": "11:00 AM – 7:00 PM",
  "venue": "Kamala Crafts Shop, Chennai",
  "city": "Chennai",
  "image": "images/events/2026-events/tribal-jewellery-contemporary-touch-kamala-september-2026.jpeg",
  "heroGradient": "linear-gradient(160deg,#8A5A3B,#3E2920)",
  "heroEmoji": "💍",
  "tagLabel": "Upcoming Event",
  "tagClass": "upcoming",
  "description": [
    "Tribal jewellery with a contemporary touch comes to Kamala this week.",
    "Discover distinctive pieces that bring together traditional forms, handmade details and a contemporary sense of style. Featuring tribal jewellery from Bengal and Odisha, this pop-up offers a selection of striking pieces to explore, whether you’re looking for an everyday accent or something special for the festive season.",
    "Visit us this week and explore the character and craft of tribal jewellery from Bengal and Odisha."
  ],
  "gallery": [
    "images/events/2026-events/tribal-jewellery-contemporary-touch-kamala-september-2026.jpeg"
  ],
  "address": "37, T.T.K Road, First Floor, Royapettah, Chennai 600 014 (Opposite Music Academy IN Gate)",
  "map": "https://maps.app.goo.gl/hc87i7g6tA8mhmZ98?g_st=awb",
  "contact": [
    "98407 00445"
  ]
},
{
  "id": "kamalas-festive-edit-sarees-october-2026",
  "type": "event",
  "title": "Kamala's Festive Edit",
  "subtitle": "A special festive saree collection bringing together rare finds, distinctive weaves and textiles from across India.",
  "dates": "9, 10 & 12 October 2026",
  "time": "",
  "venue": "Kamala Crafts Shop, Chennai",
  "city": "Chennai",
  "image": "images/events/2026-events/kamalas-festive-edit-sarees-october-2026.jpeg",
  "heroGradient": "linear-gradient(160deg,#7A3E45,#3E2027)",
  "heroEmoji": "🥻",
  "tagLabel": "Upcoming Event",
  "tagClass": "upcoming",
  "description": [
    "This festive season, get ready for a saree collection like never before.",
    "Kamala’s Festive Edit brings together an exciting selection of sarees from across India, with rare finds, distinctive weaves and textiles you may not see together every day.",
    "From the richness of Benaras, Kanchipuram and Patan to the beauty of Chanderi, Baluchari, Jamdhani, Ikat, Muga, Koranadu and Bandhani, this is a celebration of India’s incredible textile traditions.",
    "Discover handwoven sarees that bring together rich textile stories from different regions of our country.",
    "The collection features special finds, distinctive combinations and timeless weaves for the festive season. Whether you’re looking for something traditional, something distinctive, or simply a saree that feels special, there’s plenty to discover.",
    "Come find your festive saree at Kamala’s Festive Edit."
  ],
  "gallery": [
    "images/events/2026-events/kamalas-festive-edit-sarees-october-2026.jpeg"
  ],
  "address": "37, 1st Floor, T.T.K Road, Royapettah, Chennai (Opposite Music Academy)",
  "map": "",
  "contact": []
},
  
{
  "id": "festive-edit-specially-curated-sarees-2026",
  "type": "event",
  "title": "Festive Edit",
  "subtitle": "Specially Curated Sarees",
  "dates": "9–12 October 2026",
  "time": "11 AM–7 PM",
  "venue": "Kamala Crafts Shop",
  "city": "Chennai",
  "image": "images/events/2026-events/festive-edit-specially-curated-sarees-2026.jpeg",
  "pdf": "",

  "heroGradient": "linear-gradient(160deg,#E87516,#7B183E)",
  "heroEmoji": "🪷",
  "tagLabel": "Upcoming Event",
  "tagClass": "upcoming",

  "description": [
    "<strong>Kamala Crafts Shop</strong>, an initiative of The Crafts Council of India, brings together an exciting selection of sarees from across India this festive season, featuring rare finds, distinctive weaves and textiles you may not see together every day.",

    "From the richness of <strong>Benaras, Kanchipuram and Patan</strong> to the beauty of <strong>Chanderi, Baluchari, Jamdhani, Ikat, Muga, Koranadu and Bandhani</strong>, this special selection celebrates India's incredible textile traditions.",

    "<strong>Discover handwoven sarees</strong> that bring together rich textile stories from different regions of our country. Explore never-seen-before combinations, special finds and timeless weaves curated especially for the festive season.",

    "Whether you are looking for something traditional, something distinctive, or simply a saree that feels special, there is plenty to discover. Find beautiful choices for <strong>Dussehra, Ayudha Pooja and Deepavali (Diwali)</strong> and add something special to your festive wardrobe.",

    "<strong>Dates & Timings</strong><br>9, 10, 11 & 12 October 2026<br>11 AM–7 PM<br><br><em>We are open on Sunday, 11 October 2026 too.</em>",

    "<strong>Venue</strong><br>Kamala Crafts Shop<br>37, 1st Floor, T.T.K Road, Royapettah, Chennai – 600014.<br><br>Opposite Music Academy, IN Gate.",

    "<strong>Contact</strong><br>98407 00445<br><br>Come by and discover your festive saree."
  ],

  "gallery": [
    "images/events/2026-events/festive-edit-specially-curated-sarees-2026.jpeg"
  ],

  "address": "37, 1st Floor, T.T.K Road, Royapettah, Chennai 600014",
  "map": "https://maps.app.goo.gl/hc87i7g6tA8mhmZ98?g_st=awb",
  "contact": [
    "98407 00445"
  ]
},  
  
  {
  "id": "the-continuing-threadline-sui-dhaga-2026",
  "type": "event",
  "title": "The Continuing Threadline",
  "subtitle": "Keynote Exhibition of Sui Dhaga 2026",
  "dates": "23 October 2026 – 22 November 2026",
  "time": "Tuesday to Sunday, 11 AM–7 PM",
  "venue": "Arthshila Delhi",
  "city": "Delhi",
  "image": "images/events/2026-events/the-continuing-threadline-sui-dhaga-2026.jpeg",
  "pdf": "images/events/2026-events/the-continuing-threadline-sui-dhaga-2026.pdf",

  "heroGradient": "linear-gradient(160deg,#7A5A3A,#3E2A1F)",
  "heroEmoji": "🧵",
  "tagLabel": "Upcoming Event",
  "tagClass": "upcoming",

  "description": [
    "<strong>The Continuing Threadline</strong> is a collaborative showcase by Ahad Anhad, Asia Pacific Crafts Alliance, Crafts Council of India and Delhi Crafts Council, presented as part of Sui Dhaga 2026.",

    "<strong>Friday, 23 October · Preview · 4–6 PM</strong><br>Invocation by the Gandharva Choir, followed by <em>Guru Dakshina</em> — a performance dedicated to the memory of Kamaladevi Chattopadhyay.<br><br>Opening address by <strong>Ashoke Chatterjee</strong>, Advisor, Crafts Council of India.<br>Gallery Talk by celebrated designer <strong>Edric Ong</strong>.<br>Curatorial Walkthrough.",

    "<strong>Saturday, 24 October · Roundtable</strong><br><strong>11 AM–1 PM</strong> — <em>Holding Together in the Time of Polarisation</em><br>Jude van der Merwe and Sitthichai Samanchat in conversation with Sujata Prasad.<br><br><strong>2:30–4:40 PM</strong> — <em>Framing Embroidery as Living Literature</em><br>Edric Ong and Paola Manfredi in conversation with Gita Ram.<br><br>Both conversations will be succeeded by Respondant Sessions with artists and delegates.",

    "<strong>Sunday, 25 October · 6–8 PM</strong><br>Opening remarks by Manjari Nirula, Sujata Prasad and Oroon Das.<br><br>Gallery Talk by textile and crafts scholar <strong>Sitthichai Samanchat</strong>.<br><br><strong>Navtej Johar’s somatic response</strong> to Arpana Caur’s <em>Yogi and The Water Weaver</em>.<br><br><em>Feminine Fables</em>.<br><em>Stories and Songs from the Asia Pacific</em>.",

    "<strong>Sunday, 1 November · 6–8 PM</strong><br>Guided Tour of <em>The Continuing Threadline</em>.<br><br>Screening: <strong><em>Humans in the Loop</em></strong> (2024; Hindi, Kurukh; 1h 12m) — a critically acclaimed film, written and directed by Aranya Sahay, exploring the lives of marginalized female data annotators through a feminist lens.",

    "<strong>Saturday, 14 November · 6–8 PM</strong><br>Guided Tour of <em>The Continuing Threadline</em>.<br><br><strong>Taana-Baana: Many Strands, One Song</strong> — musical rendition by maestro Vidya Shah.",

    "<strong>Sunday, 22 November · 6–8 PM</strong><br>Gallery Walkthrough.<br><br><strong>Kabir Vaani</strong> by physicist, ecologist, poet and musician Krishna Kant Shukla.",

    "<strong>Venue & Public Viewing</strong><br>Arthshila Delhi, B - 19/1, Okhla Industrial Area, Phase II, New Delhi.<br><br>Public viewing of <em>The Continuing Threadline</em> at Sui Dhaga 2026 is open Tuesday to Sunday, 11 AM–7 PM."
  ],

  "gallery": [
    "images/events/2026-events/the-continuing-threadline-sui-dhaga-2026.jpeg"
  ],

  "address": "B - 19/1, Okhla Industrial Area, Phase II, New Delhi",
  "map": "",
  "contact": [
    "+91 (0)11 4155 5418",
    "+91 99103 38118"
  ]
},


  {
  "id": "craftepreneur-sep-2026",
  "type": "event",
  "title": "Craftepreneur 2026",
  "subtitle": "An exhibition of contemporary craft bringing together thoughtful design, skilled making and creative expressions.",
  "dates": "10, 11 & 12 September 2026",
  "time": "10th September: 12:00 PM – 7:30 PM | 11th & 12th September: 10:00 AM – 7:30 PM",
  "venue": "The Folly, Amethyst",
  "city": "Chennai",
  "image": "images/events/2026-events/craftepreneur-2026.jpeg",
  "heroGradient": "linear-gradient(160deg,#8A6A4A,#4A3020)",
  "heroEmoji": "✨",
  "tagLabel": "Upcoming Event",
  "tagClass": "upcoming",
  "description": [
    "The Crafts Council of India invites you to Craftepreneur 2026, an exhibition of contemporary craft bringing together thoughtful design, skilled making and creative expressions.",
    "Join us at Craftepreneur 2026 and discover contemporary interpretations of Indian craft, presented by makers and designers who bring their own perspectives to the world of making.",
    "Experience a thoughtful coming together of contemporary craft, skilled making and creative expressions by makers and designers."
  ],
  "gallery": [
    "images/events/2026-events/craftepreneur-2026.jpeg"
  ],
  "address": "The Folly, Amethyst, 239, Whites Rd, Express Estate, Royapettah, Chennai, Tamil Nadu 600014",
  "map": "",
  "contact": [],
  "payments": []
},
  {
  "id": "three-brands-pop-up-august-2026",
  "type": "event",
  "title": "The Stitch Story × Sewmuchloveeee × Nagalu Jewellers",
  "subtitle": "A special three-day pop-up bringing together traditional weaves, handcrafted clothing, intricate embroidery and one-of-a-kind jewellery.",
  "dates": "27, 28 & 29 August 2026",
  "time": "11:00 AM – 7:00 PM",
  "venue": "Kamala Crafts Shop",
  "city": "Chennai",
  "image": "images/events/2026-events/three-brands-popup-august-2026.jpeg",
  "heroGradient": "linear-gradient(160deg,#8A6A4A,#4A3020)",
  "heroEmoji": "✨",
  "tagLabel": "Upcoming Event",
  "tagClass": "upcoming",
  "description": [
    "Kamala Crafts Shop, an initiative of The Crafts Council of India, presents a special three-day pop-up bringing together three distinct brands under one roof.",
    "Discover The Stitch Story, Sewmuchloveeee and Nagalu Jewellers, with traditional weaves, handcrafted clothing, intricate embroidery and one-of-a-kind jewellery.",
    "Join us at Kamala Crafts Shop, Chennai and explore their collections in person.",
    "Come by, discover something new and make it a Kamala kind of day."
  ],
  "gallery": [
    "images/events/2026-events/three-brands-popup-august-2026.jpeg"
  ],
  "address": "37, 1st Floor, T.T.K Road, Royapettah, Chennai 600 014 (Opposite Music Academy IN Gate)",
  "map": "https://maps.app.goo.gl/hc87i7g6tA8mhmZ98?g_st=awb",
  "contact": [
    "98407 00445"
  ]
},
  {
  "id": "gandhigram-kaveri-popup-july-2026",
  "type": "event",
  "title": "Gandhigram × Kaveri",
  "subtitle": "A special Khadi pop-up celebrating handwoven heritage and contemporary design.",
  "dates": "31 July, 1 & 3 August 2026 (Closed on 2 August)",
  "time": "11:00 AM – 7:00 PM",
  "venue": "Kamala Crafts Shop",
  "city": "Chennai",
  "image": "images/events/2026-events/gandhigram-kaveri-popup.jpeg",
  "heroGradient": "linear-gradient(160deg,#C4845C,#8A4820)",
  "heroEmoji": "🧵",
  "tagLabel": "Upcoming Event",
  "tagClass": "upcoming",
  "description": [
    "Kamala Crafts Shop, an initiative of The Crafts Council of India, presents Gandhigram × Kaveri, a special pop-up celebrating handwoven Khadi through contemporary silhouettes.",
    "Discover handcrafted Khadi collections that blend traditional weaving techniques with modern design, supporting artisans and preserving India's rich textile heritage.",
    "Join us on 31 July at 4:30 PM for a special talk by Dr. V. R. Devika on the enduring legacy of Khadi and the charkha."
  ],
  "gallery": [
    "images/events/2026-events/gandhigram-kaveri-popup.jpeg"
 
  ],
  "specialEvent": {
    "title": "Talk by Dr. V. R. Devika",
    "date": "31 July 2026",
    "time": "4:30 PM",
    "description": "An insightful talk on the enduring legacy of Khadi and the charkha."
  },
  "address": "37, 1st Floor, T.T.K. Road, Royapettah, Chennai 600 014 (Opposite Music Academy IN Gate)",
  "map": "https://maps.app.goo.gl/hc87i7g6tA8mhmZ98?g_st=awb",
  "contact": [
    "98407 00445"
  ]
},

 {
  "id": "textiles-exhibition-aug-2026",
  "type": "event",
  "title": "TEXTILES 2026, presented by The Crafts Council of India.",
  "subtitle": "Discover an exceptional range of handcrafted textiles at TEXTILES 2026.",

  "dates": "August 7–8, 2026",
  "time": "10:00 AM – 8:00 PM",

  "venue": "MRC Centre",
  "city": "Chennai",

  "image": "images/events/2026-events/textiles-2026/textiles-heritage.webp",

  "heroGradient": "linear-gradient(160deg,#A3485E,#5C1E2E)",

  "heroEmoji": "🏮",

  "tagLabel": "National Handloom Day Special",
  "tagClass": "featured-event",

  "description": [
    "Celebrate National Handloom Day with an exceptional range of handcrafted textiles from across India, bridging timeless traditions and contemporary designs.",
    "Explore exquisite sarees, premium yardage, modern apparel, and unique home textiles that showcase the skills of diverse regional weavers."
  ],

  "eventWriteup": [
    "The Crafts Council of India presents a curated celebration of India's finest handcrafted textiles, bringing together master artisans, renowned designers, and exceptional craft traditions from across the country. Every weave, hand-block print, embroidery, and natural dye narrates a story of heritage, skill, and the communities that have preserved these timeless traditions over generations.",

    "The exhibition showcases the extraordinary diversity of India's textile legacy—from handloom weaving and natural dyeing to intricate craft techniques such as Ikat, Jamdani, Kalamkari, Kantha, Bandhani, Leheriya, Shibori, and hand-block printing. It offers visitors the rare opportunity to meet the makers, understand the stories behind each creation, and directly support the artisans who continue to preserve, reinterpret, and sustain these living traditions. The event also marks the celebration of National Handloom Day on 7th August, honouring India's rich handloom heritage.",

    "Spread across 39 stalls, the exhibition features an exceptional collection of sarees, garments, and handcrafted fabrics. Among the participating labels are Abha Dalmia, presenting the timeless elegance of handwoven Banarasi sarees; Blue Lotus, showcasing hand-spun, handwoven, naturally dyed textiles created by weaving communities of Andhra Pradesh and Telangana; Kapaas from Kolkata, known for its distinctive handcrafted made-ups; and Juanita, offering contemporary garments crafted in handwoven fabrics using natural dyes and artisanal surface techniques.",

    "The exhibition also welcomes distinguished exhibitors from across India, including Mauna Dhwani from Odisha, an inspiring handloom revival initiative empowering tribal women through weaving; Neelgar from Gujarat, reinterpreting the state's textile heritage through Bandhani and Shibori; Rangila Dhaga, transforming Bengal's Gamcha into contemporary sustainable fashion; Rangrez Creation, sixth-generation, award-winning masters of Rajasthan's iconic Leheriya; Studio Rama, creating contemporary festive wear in handloom cottons and Kalamkari; and Tana Bana Maheshwari Handloom, presenting the elegant Maheshwari weaves crafted by master artisans from Maheshwar.",

    "Visitors can also discover the remarkable work of The Kantha Store by Farah Khan, where luxurious Kantha embroidery is transformed into heirloom textiles; Tritiya Designs, offering contemporary womenswear inspired by India's rich textile traditions; Weavers Studio, celebrated for its richly layered handcrafted textiles that combine multiple Indian craft techniques; along with many other stand-out labels representing the finest of India's textile heritage.",

    "This exhibition is an invitation to celebrate craftsmanship, discover the enduring beauty of handmade textiles, and become part of the continuing story of India's living textile traditions."
  ],

  "invitePDF": {
    "title": "TEXTILES 2026 Invitation",
    "file": "images/events/2026-events/textiles-2026/TEXTILES-2026-Invitation.pdf",
    "buttonText": "Download Invitation"
  },

  "gallery": [
    "images/events/2026-events/textiles-2026/textiles-heritage-video.mp4"
  ],

  "address": "MRC Centre, 75/2, Santhome High Road, MRC Nagar, Raja Annamalaipuram, Chennai - 600 028",

  "contact": []
},
  {
    "id": "thulika-jewellery-popup-july-2026",
    "type": "event",
    "title": "Handmade with care, designed to be uniquely yours.",
    "subtitle": "Visit the Thulika Jewellery pop-up at Kamala Crafts Shop.",
    "dates": "July 9–11, 2026",
    "time": "11:00 AM – 7:00 PM",
    "venue": "Kamala Crafts Shop",
    "city": "Chennai",
    "image": "images/events/2026-events/pop-up-show-2026/pop-up-show-jewellery.webp",
    "heroGradient": "linear-gradient(160deg,#8B3A1E,#5C2410)",
    "heroEmoji": "💎",
    "tagLabel": "Upcoming Event",
    "tagClass": "upcoming",
    "description": [
      "Based in Chennai, Thulika Jewellery creates handcrafted costume jewellery using materials sourced from artisans across India.",
      "Blending an ethnic flair with thoughtful craftsmanship, every piece celebrates the beauty of handmade and mindful fashion."
    ],
    "gallery": [
      "images/events/2026-events/pop-up-show-2026/pop-up-show-jewellery.webp"
    ],
    "address": "37, 1st Floor, T.T.K. Road, Royapettah, Chennai 600 014 (Opposite Music Academy IN Gate)",
    "contact": [
      "9840700445"
    ]
  },
  {
  "id": "eco-printing-demonstration-july-2026",
  "type": "event",
  "title": "Nature leaves its mark in unexpected ways.",
  "subtitle": "Experience the art of botanical eco printing with Aranya Natural.",
  "dates": "July 23, 2026",
  "time": "4:30 PM onwards",
  "venue": "Kamala Crafts Shop",
  "city": "Chennai",
  "image": "images/events/2026-events/eco-printing-demo-2026/eco-printing-demonstration.webp",
  "heroGradient": "linear-gradient(160deg,#5D7A3C,#2F4F2F)",
  "heroEmoji": "🌿",
  "tagLabel": "Live Demonstration",
  "tagClass": "featured-event",
  "description": [
    "Experience the beauty of botanical eco printing with Aranya Natural, where locally available leaves and flowers create one-of-a-kind natural prints on fabric.",
    "Watch marigold flowers, Eupatorium leaves, and onion peels transform cloth through bundling, steaming, and natural dyeing techniques that celebrate sustainable craftsmanship and the harmony between nature and textiles."
  ],
  "gallery": [
    "images/events/2026-events/eco-printing-demo-2026/eco-printing-demonstration.webp"
  ],
  "address": "37, 1st Floor, T.T.K. Road, Royapettah, Chennai 600 014 (Opposite Music Academy IN Gate)",
  "contact": [
    "9840700445"
  ]
},
  {
  "id": "neela-indigo-textiles-july-2026",
  "type": "event",
  "title": "Naturally dyed, thoughtfully woven, and made to be lived in.",
  "subtitle": "Discover NEELA by Indigene Craft at Kamala Crafts Shop.",
  "dates": "July 23–25, 2026",
  "time": "11:00 AM – 7:00 PM",
  "venue": "Kamala Crafts Shop",
  "city": "Chennai",
  "image": "images/events/2026-events/neela-indigo-2026/neela-indigo-textiles.jpg",
  "heroGradient": "linear-gradient(160deg,#264A7C,#132C4A)",
  "heroEmoji": "💙",
  "tagLabel": "Textile Showcase",
  "tagClass": "upcoming",
  "description": [
    "Explore NEELA by Indigene Craft, a thoughtfully curated collection of naturally indigo-dyed cotton, silk, and handwoven Jamdani textiles rooted in traditional craftsmanship.",
    "Designed for contemporary living, the collection celebrates breathable fabrics, relaxed silhouettes, mindful dressing, and timeless textile traditions that blend heritage with everyday elegance."
  ],
  "gallery": [
    "images/events/2026-events/neela-indigo-2026/neela-indigo-textiles.mp4"
  ],
  "address": "37, 1st Floor, T.T.K. Road, Royapettah, Chennai 600 014 (Opposite Music Academy IN Gate)",
  "contact": [
    "9840700445"
  ]
}

  /* ── ADD MORE EVENTS HERE ──────────────────────────────────────────
  ,
  {
    id: 'your-event-id',
    status: 'upcoming',
    type: 'workshop',
    title: 'Your Event Title',
    subtitle: 'A short one-liner about the event.',
    dates: 'June 10, 2025',
    time: '10:00 AM – 4:00 PM',
    venue: 'Venue Name',
    city: 'City, State',
    entryFee: 'Free / ₹500',
    registration: 'https://your-registration-link.com',
    heroGradient: 'linear-gradient(160deg, #8B3A1E 0%, #5C2410 100%)',
    heroEmoji: '🎨',
    tagLabel: 'Upcoming Workshop',
    tagClass: 'upcoming',
    description: ['Paragraph 1...', 'Paragraph 2...'],
    highlights: [
      { icon: '✅', title: 'Feature', text: 'Description' }
    ],
    schedule: [
      { time: '10:00 AM', title: 'Session Name', desc: 'What happens.' }
    ],
    people: [
      { initials: 'AB', name: 'Artisan Name', role: 'Craft, State', color: '#8B3A1E' }
    ],
    gallery: [
      { emoji: '🎨', bg: 'linear-gradient(135deg,#C4845C,#8A4820)' }
    ],
    related: ['thari-2025']
  }
  ── END ADD ────────────────────────────────────────────────────── */

]; // end EVENTS array


/* ============================================================
   RENDER ENGINE — no changes needed below this line
   ============================================================ */

// SVG icons used in sidebar info rows
var ICONS = {
  calendar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  clock:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  pin:      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  ticket:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>',
  arrow:    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
};

function getEventById(id) {
  return [
    ...(window.EVENTS || []),
    ...(window.PAST_EVENTS || [])
  ].find(e => e.id === id) || null;
}


function renderNotFound() {
  var target = document.getElementById('eventPage');
  if (!target) return; // Safely exit if not on event-detail.html

  target.innerHTML =
    '<div class="ed-notfound">'
    + '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--cr)" stroke-width="1.5" stroke-linecap="round" style="margin:0 auto 20px;display:block"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    + '<h2>Event not found</h2>'
    + '<p>The event you\'re looking for doesn\'t exist or may have been removed. Browse all our events below.</p>'
    + '<a href="events.html" class="btn-primary">View All Events</a>'
    + '</div>';
}

function renderHighlights(highlights) {
  if (!highlights || !highlights.length) return '';
  return '<div class="ed-highlights">'
    + highlights.map(function(h) {
        return '<div class="ed-highlight-item">'
          + '<div class="ed-highlight-icon">' + h.icon + '</div>'
          + '<div class="ed-highlight-text"><strong>' + h.title + '</strong>' + h.text + '</div>'
          + '</div>';
      }).join('')
    + '</div>';
}

function renderSchedule(schedule) {
  if (!schedule || !schedule.length) return '';
  return '<div class="ed-schedule">'
    + schedule.map(function(s) {
        return '<div class="ed-schedule-item">'
          + '<div class="ed-schedule-time">' + s.time + '</div>'
          + '<div class="ed-schedule-desc"><strong>' + s.title + '</strong>' + s.desc + '</div>'
          + '</div>';
      }).join('')
    + '</div>';
}

function renderPeople(people) {
  if (!people || !people.length) return '';
  return '<div class="ed-people-grid">'
    + people.map(function(p) {
        return '<div class="ed-person">'
          + '<div class="ed-person-avatar" style="background:' + p.color + '">' + p.initials + '</div>'
          + '<div class="ed-person-name">' + p.name + '</div>'
          + '<div class="ed-person-role">' + p.role + '</div>'
          + '</div>';
      }).join('')
    + '</div>';
}

function renderGallery(gallery) {
  if (!gallery || !gallery.length) return '';

  return '<div class="ed-gallery">'
    + gallery.map(function(item, i) {

        const isVideo = /\.(mp4|webm|ogg)$/i.test(item);

        return '<div class="ed-gallery-item" data-index="' + i + '">'
          + (
              isVideo
              ? '<video class="ed-gallery-media" muted playsinline preload="metadata">'
                  + '<source src="' + item + '" type="video/mp4">'
                + '</video>'
              : '<img src="' + item + '" alt="gallery" class="ed-gallery-media" loading="lazy">'
            )
          + '</div>';

      }).join('')
    + '</div>';
}

function renderRelated(relatedIds) {
  if (!relatedIds || !relatedIds.length) return '';
  var cards = relatedIds.map(function(id) {
    var e = getEventById(id);
    if (!e) return '';
    return '<div class="event-card card-hover">'
      + '<div class="event-image" style="background:' + e.heroGradient + '">' + e.heroEmoji + '</div>'
      + '<div class="event-content">'
      + '<span class="event-tag">' + e.tagLabel + '</span>'
      + '<h3 class="event-title">' + e.title + '</h3>'
      + '<div class="event-meta"><span>' + e.dates + '</span><span>' + e.city + '</span></div>'
      + '<p class="event-desc">' + e.subtitle + '</p>'
      + '<a href="event-detail.html?id=' + e.id + '" class="event-link">Learn more ' + ICONS.arrow + '</a>'
      + '</div></div>';
  }).filter(Boolean).join('');
  if (!cards) return '';
  return '<div class="ed-related"><div class="ed-related-inner">'
    + '<p class="s-tag">More Events</p>'
    + '<h2 class="s-title">You might also like</h2>'
    + '<div class="ed-related-grid">' + cards + '</div>'
    + '</div></div>';
}

function renderEvent(e) {
  // Update page title
  document.title = e.title + ' — Crafts Council of India';

  // Sections that always show
  var descHtml = '<div class="ed-description">'
    + e.description.map(function(p) { return '<p>' + p + '</p>'; }).join('')
    + '</div>';
    
    
  var inviteHtml = '';

if (e.pdf) {

    inviteHtml =
        '<span class="ed-section-label" style="margin-top:40px">Downloads</span>'
      + '<div style="margin-top:18px">'
      + '<a href="' + e.pdf + '"'
      + ' target="_blank"'
      + ' rel="noopener noreferrer"'
      + ' class="ed-register-btn">'
      + 'View / Download Event PDF'
      + '</a>'
      + '</div>';

}

var contentHtml = '';

if (e.eventWriteup && e.eventWriteup.length) {

    contentHtml =
        '<span class="ed-section-label" style="margin-top:40px">Exhibition Overview</span>'
      + '<div class="ed-divider"></div>'
      + '<div class="ed-description">'
      + e.eventWriteup.map(function(p) {
            return '<p>' + p + '</p>';
        }).join('')
      + '</div>';

}

  var highlightsHtml = e.highlights && e.highlights.length
    ? '<span class="ed-section-label" style="margin-top:40px">Highlights</span>' + renderHighlights(e.highlights)
    : '';

  var scheduleHtml = e.schedule && e.schedule.length
    ? '<span class="ed-section-label" style="margin-top:40px">Programme / Schedule</span>' + renderSchedule(e.schedule)
    : '';

  var peopleLabel = e.type === 'workshop' ? 'Facilitators' : e.type === 'award' ? 'Awardees' : 'Featured Artisans';
  var peopleHtml = e.people && e.people.length
    ? '<span class="ed-section-label" style="margin-top:40px">' + peopleLabel + '</span>' + renderPeople(e.people)
    : '';

  var galleryHtml = e.gallery && e.gallery.length
    ? '<span class="ed-section-label" style="margin-top:40px">Gallery</span>' + renderGallery(e.gallery)
    : '';

  // Register button
  var registerHtml = '';
  if (e.status === 'upcoming' && e.registration) {
    registerHtml = '<div class="ed-register-card">'
      + '<div class="ed-register-title">Join this event</div>'
      + '<div class="ed-register-desc">Secure your spot — ' + (e.entryFee === 'Free' || e.entryFee === 'By invitation' ? e.entryFee.toLowerCase() : 'entry ' + e.entryFee) + '</div>'
      + '<a href="' + e.registration + '" target="_blank" class="ed-register-btn">Register Now</a>'
      + '<a href="contact.html" class="ed-register-btn ghost">Ask a question</a>'
      + '</div>';
  } else if (e.status === 'past') {
    registerHtml = '<div class="ed-register-card">'
      + '<div class="ed-register-title">This event has ended</div>'
      + '<div class="ed-register-desc">Follow CCI on Instagram or subscribe to our newsletter for upcoming events.</div>'
      + '<a href="newsletters.html" class="ed-register-btn">Subscribe to Newsletter</a>'
      + '<a href="events.html" class="ed-register-btn ghost">Browse all events</a>'
      + '</div>';
  }

  // Share buttons
  var pageUrl = encodeURIComponent(window.location.href);
  var pageTitle = encodeURIComponent(e.title);
  var shareHtml = '<div class="ed-share">'
    + '<span class="ed-share-label">Share</span>'
    + '<button class="ed-share-btn" title="Share on WhatsApp" onclick="window.open(\'https://api.whatsapp.com/send?text=' + pageTitle + '%20' + pageUrl + '\',\'_blank\')">'
    + '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.985 0C5.379 0 .006 5.373.006 11.979c0 2.096.546 4.06 1.5 5.77L0 24l6.435-1.688a11.933 11.933 0 005.55 1.373c6.606 0 11.979-5.373 11.979-11.979C23.964 5.373 18.591 0 11.985 0zm0 21.818a9.831 9.831 0 01-5.012-1.368l-.36-.214-3.724.977.993-3.632-.234-.373a9.818 9.818 0 01-1.504-5.249c0-5.437 4.424-9.861 9.861-9.861 5.436 0 9.86 4.424 9.86 9.861s-4.424 9.859-9.88 9.859z"/></svg>'
    + '</button>'
    + '<button class="ed-share-btn" title="Copy link" onclick="navigator.clipboard.writeText(window.location.href);this.innerHTML=\'✓\';setTimeout(()=>this.innerHTML=\'<svg width=&quot;12&quot; height=&quot;12&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot;><path d=&quot;M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71&quot;/><path d=&quot;M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71&quot;/></svg>\',2000)">'
    + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
    + '</button>'
    + '</div>';

  var html =
    // Hero
    '<div class="ed-hero">'
    + '<div class="ed-hero-bg" style="' +
(e.image 
  ? 'background-image:url(' + e.image + ');background-size:cover;background-position:center;' 
  : 'background:' + e.heroGradient) +
'">'
    + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:120px;opacity:.12">' + e.heroEmoji + '</div>'
    + '</div>'
    + '<div class="ed-hero-overlay"></div>'
    + '<div class="ed-hero-content">'
    + '<div class="ed-breadcrumb">'
    + '<a href="index.html">Home</a><span>›</span>'
    + '<a href="events.html">Events</a><span>›</span>'
    + '<span style="color:rgba(250,246,239,.85)">' + e.title + '</span>'
    + '</div>'
    + '<span class="ed-tag ' + e.tagClass + '">' + e.tagLabel + '</span>'
    + '<h1 class="ed-title">' + e.title + '</h1>'
    + '<div class="ed-meta-row">'
    + '<div class="ed-meta-item">' + ICONS.calendar + e.dates + '</div>'
    + '<div class="ed-meta-item">' + ICONS.pin + e.city + '</div>'
    + '</div>'
    + '</div>'
    + '</div>'

    // Body
    + '<div class="ed-body">'

    // Main
    + '<div class="ed-main">'
    + '<span class="ed-section-label">About this event</span>'
    + '<div class="ed-divider"></div>'
+ descHtml
+ contentHtml
+ inviteHtml
+ highlightsHtml
+ scheduleHtml
+ peopleHtml
+ galleryHtml
    + '</div>'

    // Sidebar
    + '<div class="ed-sidebar">'
    + registerHtml
  + '<div class="ed-info-card">'
+ '<div class="ed-info-card-head">Event Details</div>'
+ '<div class="ed-info-rows">'
+ '<div class="ed-info-row"><div class="ed-info-icon">' + ICONS.calendar + '</div><div><span class="ed-info-label">Date</span><span class="ed-info-value">' + e.dates + '</span></div></div>'
+ '<div class="ed-info-row"><div class="ed-info-icon">' + ICONS.clock + '</div><div><span class="ed-info-label">Time</span><span class="ed-info-value">' + e.time + '</span></div></div>'
+ '<div class="ed-info-row"><div class="ed-info-icon">' + ICONS.pin + '</div><div><span class="ed-info-label">Venue</span><span class="ed-info-value">' + e.venue + '<br><span style="font-size:11px;color:var(--mud)">' + e.city + '</span></span></div></div>'
+ (e.ticketPrice ? '<div class="ed-info-row"><div class="ed-info-icon">🎟️</div><div><span class="ed-info-label">Fee</span><span class="ed-info-value">' + e.ticketPrice + '</span></div></div>' : '')
+ (e.ageGroup ? '<div class="ed-info-row"><div class="ed-info-icon">👶</div><div><span class="ed-info-label">Age Group</span><span class="ed-info-value">' + e.ageGroup + '</span></div></div>' : '')
+ (e.contact && e.contact.length ? '<div class="ed-info-row"><div class="ed-info-icon">📞</div><div><span class="ed-info-label">Contact</span><span class="ed-info-value">' + e.contact.join(' / ') + '</span></div></div>' : '')
+ (e.address ? '<div class="ed-info-row"><div class="ed-info-icon">📍</div><div><span class="ed-info-label">Address</span><span class="ed-info-value">' + e.address + '</span></div></div>' : '')
+ (e.parking ? '<div class="ed-info-row"><div class="ed-info-icon">🚗</div><div><span class="ed-info-label">Parking</span><span class="ed-info-value">' + e.parking + '</span></div></div>' : '')
+ (e.mapLink ? '<div class="ed-info-row"><div class="ed-info-icon">🗺️</div><div><span class="ed-info-label">Location</span><span class="ed-info-value"><a href="' + e.mapLink + '" target="_blank" style="color:var(--accent)">View on Google Maps</a></span></div></div>' : '')
+ '</div>'
+ '</div>'
    + shareHtml
    + '</div>'

    + '</div>' // end ed-body

    // Related
    + renderRelated(e.related);

  document.getElementById('eventPage').innerHTML = html;
}


function parseEventDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return new Date(0);

  var months = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11
  };

  // 1. Extract 4-digit Year (e.g., 2024, 2025, 2026)
  var yearMatch = dateStr.match(/\b(20\d{2})\b/);
  var year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

  // 2. Extract Month Name
  var monthMatch = dateStr.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i);
  var month = monthMatch ? months[monthMatch[1].toLowerCase()] : 0;

  // 3. Extract the first Day number (1 to 31)
  // Replaces commas, dashes, ampersands so we can isolate the starting day
  var cleanStr = dateStr.replace(yearMatch ? yearMatch[0] : '', '')
                        .replace(monthMatch ? monthMatch[0] : '', '');
  var dayMatch = cleanStr.match(/\b([1-9]|[12]\d|3[01])\b/);
  var day = dayMatch ? parseInt(dayMatch[1], 10) : 1;

  return new Date(year, month, day);
}

function formatEventType(type) {

  if (!type) return 'Event';

  const normalized = type.toLowerCase().trim();

  switch (normalized) {

    case 'exhibition':
      return 'Exhibition';

    case 'conference':
      return 'Conference';

    case 'workshop':
      return 'Workshop';

    case 'award':
      return 'Award';

    case 'festival':
      return 'Festival';

    case 'seminar':
      return 'Seminar';

    case 'symposium':
      return 'Symposium';

    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}





function renderHomeGrid() {
    const container = document.getElementById('home-events-container');
    if (!container || typeof EVENTS === 'undefined') return;

    // Today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Only use current EVENTS
    // 2. Filter out events whose start date has already passed
    const upcomingEvents = EVENTS
        .filter(event => {
            const eventDate = parseEventDate(event.dates);
            eventDate.setHours(0, 0, 0, 0);

            return eventDate >= today;
        })

        // 3. Sort nearest upcoming event first
        .sort((a, b) => {
            return parseEventDate(a.dates) - parseEventDate(b.dates);
        })

        // 4. Show only the latest 3 upcoming events
        .slice(0, 3);

    // If there are no upcoming events
    if (!upcomingEvents.length) {
        container.innerHTML = `
            <div class="no-events">
                <p>No upcoming events at the moment.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = upcomingEvents.map((event, index) => {

        const hasImage = event.image && event.image.trim() !== '';

        const bgStyle = hasImage
            ? `background-image: url('${event.image}')`
            : `background: ${event.heroGradient || 'var(--cr-deep)'}`;

        const fallbackContent = !hasImage
            ? `<div class="ev-card-emoji" style="font-size:40px;opacity:0.5;">
                ${event.heroEmoji || '🎨'}
               </div>`
            : '';

        // Use JSON tag values
        const tagLabel = event.tagLabel || 'Upcoming Event';
        const tagClass = event.tagClass || 'upcoming';

        // Featured first event
        if (index === 0) {
            return `
                <a href="event-detail.html?id=${event.id}" class="ev-feat">

                    <div
                        class="ev-feat-bg"
                        style="${bgStyle};
                               background-size:cover;
                               background-position:center;">
                    </div>

                    <div style="
                        position:absolute;
                        inset:0;
                        background:linear-gradient(
                            to bottom,
                            transparent,
                            rgba(0,0,0,0.8)
                        );
                        z-index:1;">
                    </div>

                    <span class="ev-tag ${tagClass}" style="z-index:2;">
                        ${tagLabel}
                    </span>

                    <h3 class="ev-title" style="z-index:2;">
                        ${event.title}
                    </h3>

                    <p class="ev-meta" style="z-index:2;">
                        📅 ${event.dates}
                        &nbsp;
                        📍 ${event.city}
                    </p>

                </a>`;
        }

        // Remaining upcoming event cards
        return `
            <a href="event-detail.html?id=${event.id}" class="ev-card">

                <div
                    class="ev-card-img"
                    style="${bgStyle};
                           background-size:cover;
                           background-position:center;">
                    ${fallbackContent}
                </div>

                <div class="ev-card-body">

                    <div class="ev-card-tag ${tagClass}">
                        ${tagLabel}
                    </div>

                    <div class="ev-card-title">
                        ${event.title}
                    </div>

                    <div class="ev-card-date">
                        ${event.dates}
                    </div>

                </div>

            </a>`;
    }).join('');
}


// Execution
document.addEventListener('DOMContentLoaded', renderHomeGrid);


function initLightbox(images) {

  if (!images.length) return;

  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');

  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  const items = document.querySelectorAll('.ed-gallery-item');

  let current = 0;

  function open(index) {

    current = index;

    const file = images[current];
    const isVideo = /\.(mp4|webm|ogg)$/i.test(file);

    if (isVideo) {

        img.outerHTML = `
            <video
                id="lightboxImg"
                controls
                autoplay
                playsinline
                style="max-width:95%;max-height:90vh;border-radius:12px;">
                <source src="${file}" type="video/mp4">
            </video>
        `;

    } else {

        img.outerHTML = `
            <img
                id="lightboxImg"
                src="${file}"
                style="max-width:95%;max-height:90vh;border-radius:12px;">
        `;
    }

    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
}

  function close() {
    lightbox.classList.remove('active');

    document.body.classList.remove('lightbox-open');
  }

  function renderLightboxItem() {

    const file = images[current];
    const isVideo = /\.(mp4|webm|ogg)$/i.test(file);

    const existing = document.getElementById('lightboxImg');

    if (isVideo) {

        existing.outerHTML = `
            <video
                id="lightboxImg"
                controls
                autoplay
                playsinline
                style="max-width:95%;max-height:90vh;border-radius:12px;">
                <source src="${file}" type="video/mp4">
            </video>
        `;

    } else {

        existing.outerHTML = `
            <img
                id="lightboxImg"
                src="${file}"
                style="max-width:95%;max-height:90vh;border-radius:12px;">
        `;
    }
}

function next() {
    current = (current + 1) % images.length;
    renderLightboxItem();
}

function prev() {
    current = (current - 1 + images.length) % images.length;
    renderLightboxItem();
}
  items.forEach(item => {
    item.addEventListener('click', function() {
      open(Number(this.dataset.index));
    });
  });

  closeBtn.addEventListener('click', close);

  nextBtn.addEventListener('click', next);

  prevBtn.addEventListener('click', prev);

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      close();
    }
  });

  document.addEventListener('keydown', function(e) {

    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') close();

    if (e.key === 'ArrowRight') next();

    if (e.key === 'ArrowLeft') prev();

  });

}
// -------------------------------------------------------------
// Unified Initialization (Homepage + Detail Page)
// -------------------------------------------------------------
window.renderHomeGrid = renderHomeGrid;

function initializeEvents() {
  // 1. Homepage Handling
  if (document.getElementById('home-events-container')) {
    renderHomeGrid();
  }

  // 2. Detail Page Handling (Only if #eventPage exists)
  var eventPage = document.getElementById('eventPage');
  if (eventPage) {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id) {
      renderNotFound();
      return;
    }
    var eventItem = getEventById(id);
    if (!eventItem) {
      renderNotFound();
      return;
    }
    renderEvent(eventItem);
    initLightbox(eventItem.gallery || []);
  }
}

// Run immediately if DOM elements are already available
initializeEvents();

// Also hook into loader.js lifecycle event
window.addEventListener('site-scripts-ready', initializeEvents);
