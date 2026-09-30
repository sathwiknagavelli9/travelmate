const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;
export const trips = [
  {
    name: "Goa",
    slug: "goa",
    state: "Goa",
    type: "Beach",
    title: "Goa Escape from Hyderabad",
    price: 15999,
    best: "November to February",
    image: photo("photo-1512343879784-a960bf40e7f2"),
    short: "Salt in the air. Sand between your toes. A slower kind of getaway.",
    description:
      "Trade the city rush for the palm-fringed beaches and Portuguese lanes of Goa. This relaxed escape pairs golden sunsets with heritage sights, unhurried café stops, and comfortable stays near the coast.",
    transport:
      "Round-trip AC sleeper coach from Hyderabad to Goa. Overnight outward travel starts the evening before Day 1; the return leaves on Day 4. Exact boarding details are supplied in this demo itinerary.",
    stay: "Three nights in a demo 3-star hotel in Calangute, twin-sharing AC rooms with breakfast.",
    local:
      "Shared air-conditioned sightseeing cab for the scheduled North and South Goa excursions; arrival and departure transfers included.",
    attractions: [
      "Baga Beach",
      "Calangute Beach",
      "Fort Aguada",
      "Basilica of Bom Jesus",
    ],
    days: [
      [
        "Arrival & a little sea therapy",
        "Arrive in Goa, meet your transfer and check in after 2 pm. Spend the evening walking Baga Beach and watching the sunset.",
        ["Coach arrival transfer", "Hotel check-in", "Baga Beach sunset"],
      ],
      [
        "The North Goa coast",
        "After breakfast, visit Fort Aguada and Calangute Beach. Enjoy free time for lunch and explore the coastal markets.",
        ["Fort Aguada", "Calangute Beach", "Beach market walk"],
      ],
      [
        "Old Goa & Panjim lanes",
        "Discover the Basilica of Bom Jesus and the colorful Fontainhas neighborhood. Return to the hotel after a relaxed riverside evening.",
        ["Basilica of Bom Jesus", "Fontainhas walk", "Mandovi riverside"],
      ],
      [
        "One last coastal morning",
        "Enjoy breakfast, check out by 11 am, and keep luggage at reception before the evening return coach to Hyderabad.",
        ["Breakfast", "Hotel checkout", "Return coach transfer"],
      ],
    ],
  },
  {
    name: "Kerala",
    slug: "kerala",
    state: "Kerala",
    type: "Nature",
    title: "Kerala Backwaters & Tea Trails",
    price: 24999,
    best: "September to March",
    image: photo("photo-1602216056096-3b40cc0c9944"),
    short: "Mist-covered tea gardens, quiet backwaters, and a world of green.",
    description:
      "Journey from the tea slopes of Munnar to the still waters of Alleppey. A thoughtfully paced Kerala circuit brings together spice gardens, scenic drives, and an overnight houseboat experience.",
    transport:
      "Demo round-trip economy flight allocation from Hyderabad to Kochi with airport transfers. No external flight booking is performed.",
    stay: "Two nights at a 3-star Munnar hotel, one night on a standard Alleppey houseboat, and one night at a Kochi hotel; twin-sharing rooms.",
    local:
      "Private AC car for the listed Kochi–Munnar–Alleppey circuit. Houseboat cruise follows local operating hours.",
    attractions: [
      "Munnar tea gardens",
      "Mattupetty Dam",
      "Alleppey backwaters",
      "Fort Kochi",
    ],
    days: [
      [
        "Into the hills",
        "Arrive at Kochi and drive to Munnar, stopping at viewpoints along the way. Settle into your hill hotel.",
        ["Airport pickup", "Scenic hill drive", "Munnar check-in"],
      ],
      [
        "Tea country",
        "Walk among tea estates and visit a tea museum before an afternoon stop at Mattupetty Dam.",
        ["Tea gardens", "Tea museum", "Mattupetty Dam"],
      ],
      [
        "Life on the backwaters",
        "Drive to Alleppey and board a houseboat at noon. Cruise canals before docking for the night.",
        ["Alleppey transfer", "Houseboat lunch", "Backwater cruise"],
      ],
      [
        "The old port city",
        "Disembark after breakfast and return to Kochi. Explore the streets of Fort Kochi and see the Chinese fishing nets.",
        ["Houseboat breakfast", "Fort Kochi", "Fishing nets"],
      ],
      [
        "Homeward bound",
        "Have a leisurely breakfast and check out. Transfer to Kochi airport for the return journey to Hyderabad.",
        ["Breakfast", "Checkout", "Airport transfer"],
      ],
    ],
  },
  {
    name: "Rajasthan",
    slug: "rajasthan",
    state: "Rajasthan",
    type: "Heritage",
    title: "Royal Rajasthan Discovery",
    price: 28999,
    best: "October to March",
    image: photo("photo-1599661046827-dacff0c0f09a"),
    short:
      "Pink city mornings, sandstone forts, and stories around every corner.",
    description:
      "Follow a heritage route through Jaipur and Jodhpur with time to discover grand forts, artisan bazaars, and regional food. Comfortable transfers make this a rewarding introduction to Rajasthan.",
    transport:
      "Demo economy flight allocation Hyderabad–Jaipur and Jodhpur–Hyderabad. Airport transfers and intercity road travel included.",
    stay: "Three nights in a 3-star Jaipur hotel and two nights in a 3-star Jodhpur hotel, twin-sharing with breakfast.",
    local:
      "AC vehicle for Jaipur sightseeing, Jaipur–Jodhpur travel, and Jodhpur sightseeing as listed.",
    attractions: [
      "Amber Fort",
      "Hawa Mahal",
      "City Palace Jaipur",
      "Mehrangarh Fort",
    ],
    days: [
      [
        "Hello, Pink City",
        "Arrive in Jaipur and check into your hotel. Explore the evening bazaars at a comfortable pace.",
        ["Airport pickup", "Hotel check-in", "Johari Bazaar"],
      ],
      [
        "Forts & facades",
        "Visit Amber Fort in the morning and stop at Jal Mahal before photographing the Hawa Mahal facade.",
        ["Amber Fort", "Jal Mahal viewpoint", "Hawa Mahal"],
      ],
      [
        "Jaipur in detail",
        "Discover City Palace and Jantar Mantar. Spend your afternoon browsing local crafts.",
        ["City Palace", "Jantar Mantar", "Artisan market"],
      ],
      [
        "Road to the Blue City",
        "Travel to Jodhpur after breakfast, check in, and enjoy an evening near the clock tower.",
        ["Intercity drive", "Jodhpur check-in", "Clock tower market"],
      ],
      [
        "Above the blue rooftops",
        "Tour Mehrangarh Fort and Jaswant Thada before a guided neighborhood walk through the old city.",
        ["Mehrangarh Fort", "Jaswant Thada", "Blue city walk"],
      ],
      [
        "A royal farewell",
        "Check out after breakfast and transfer to Jodhpur airport for your return flight.",
        ["Breakfast", "Checkout", "Airport transfer"],
      ],
    ],
  },
  {
    name: "Manali",
    slug: "manali",
    state: "Himachal Pradesh",
    type: "Adventure",
    title: "Manali Mountain Retreat",
    price: 21999,
    best: "March to June and October to February",
    image: photo("photo-1626621341517-bbf3d9990a23"),
    short:
      "Himalayan air, pine forest trails, and mornings worth waking up for.",
    description:
      "A mountain escape made for fresh air and expansive views. Explore Old Manali, the pine forests around Hadimba Temple, and the scenic Solang Valley without a rushed schedule.",
    transport:
      "Demo Hyderabad–Delhi return economy flight allocation and overnight Delhi–Manali return Volvo coach. Start outward travel one evening before Day 1; allow an extra night for the return coach.",
    stay: "Four nights in a 3-star Manali hotel with mountain-view common areas, twin-sharing rooms and breakfast.",
    local:
      "Local sightseeing cab for listed excursions. Solang access depends on weather and road conditions; optional adventure activities cost extra.",
    attractions: ["Hadimba Temple", "Solang Valley", "Old Manali", "Vashisht"],
    days: [
      [
        "Welcome to the mountains",
        "Arrive by overnight coach and transfer to the hotel. Take a relaxed evening stroll along Mall Road.",
        ["Coach pickup", "Hotel check-in", "Mall Road walk"],
      ],
      [
        "Forest & old village trails",
        "Explore Hadimba Temple and its cedar forest, then walk the lanes of Old Manali.",
        ["Hadimba Temple", "Cedar forest", "Old Manali"],
      ],
      [
        "Solang Valley day",
        "Drive to Solang Valley for mountain views and free time. Optional adventure activities are paid directly and are not included.",
        ["Scenic drive", "Solang Valley", "Mountain viewpoints"],
      ],
      [
        "A slower mountain day",
        "Visit Vashisht village and enjoy a light riverside walk. Keep the afternoon free for cafés and local shopping.",
        ["Vashisht village", "Riverside walk", "Local market"],
      ],
      [
        "Until next time",
        "Check out after breakfast and store luggage until the evening coach departure toward Delhi.",
        ["Breakfast", "Checkout", "Return coach transfer"],
      ],
    ],
  },
  {
    name: "Ooty",
    slug: "ooty",
    state: "Tamil Nadu",
    type: "Nature",
    title: "Ooty & Coonoor Hill Escape",
    price: 13999,
    best: "March to June and September to November",
    image: photo("photo-1544735716-392fe2489ffa"),
    short: "Tea-scented hills, winding roads, and cozy Nilgiri days.",
    description:
      "Head into the Nilgiris for cool weather, rolling tea estates, and gentle sightseeing. This compact break combines Ooty classics with the quieter gardens and viewpoints of Coonoor.",
    transport:
      "Round-trip AC sleeper coach Hyderabad–Coimbatore with road transfers to Ooty. Depart the evening before Day 1; allow overnight coach time after Day 4.",
    stay: "Three nights in a 3-star Ooty hotel, twin-sharing rooms with breakfast.",
    local:
      "Shared sightseeing cab for Ooty and Coonoor routes with arrival and departure transfers.",
    attractions: [
      "Ooty Lake",
      "Botanical Gardens",
      "Doddabetta Peak",
      "Coonoor tea estates",
    ],
    days: [
      [
        "Up to the Nilgiris",
        "Arrive in Coimbatore and take the scenic road to Ooty. Settle in and enjoy a lakeside evening.",
        ["Coimbatore pickup", "Hill transfer", "Ooty Lake"],
      ],
      [
        "Gardens & mountain views",
        "Visit the Botanical Gardens and Doddabetta viewpoint, followed by a tea factory visit.",
        ["Botanical Gardens", "Doddabetta Peak", "Tea factory"],
      ],
      [
        "A day in Coonoor",
        "Take a road excursion to Coonoor for tea gardens, Sim’s Park, and valley viewpoints.",
        ["Coonoor drive", "Sim’s Park", "Tea gardens"],
      ],
      [
        "Back through the hills",
        "Enjoy breakfast, check out, and transfer to Coimbatore for your return coach.",
        ["Breakfast", "Checkout", "Return transfer"],
      ],
    ],
  },
  {
    name: "Bengaluru",
    slug: "bengaluru",
    state: "Karnataka",
    type: "City",
    title: "Bengaluru Garden City Weekend",
    price: 8999,
    best: "October to February",
    image: photo("photo-1596176530529-78163a4f7af2"),
    short: "Garden strolls, palace stories, and a perfectly paced city break.",
    description:
      "See the greener side of Bengaluru on a short city break from Hyderabad. Historic gardens and palace architecture leave plenty of space for neighborhood cafés and a relaxed weekend.",
    transport:
      "Round-trip Hyderabad–Bengaluru AC sleeper coach; outward journey starts the evening before Day 1.",
    stay: "Two nights in a centrally located 3-star Bengaluru hotel, twin-sharing rooms with breakfast.",
    local:
      "AC city sightseeing cab on the listed route, including coach terminal transfers.",
    attractions: [
      "Lalbagh Botanical Garden",
      "Bengaluru Palace",
      "Cubbon Park",
      "Church Street",
    ],
    days: [
      [
        "Garden city welcome",
        "Arrive and transfer to the hotel. Visit Lalbagh in the afternoon and enjoy an evening neighborhood walk.",
        ["Coach pickup", "Lalbagh", "Hotel check-in"],
      ],
      [
        "Royal rooms & green spaces",
        "Explore Bengaluru Palace and Cubbon Park, with free time around Church Street.",
        ["Bengaluru Palace", "Cubbon Park", "Church Street"],
      ],
      [
        "A final city morning",
        "Have breakfast and a relaxed morning before checkout and transfer to the return coach.",
        ["Breakfast", "Local shopping time", "Coach transfer"],
      ],
    ],
  },
  {
    name: "Delhi & Agra",
    slug: "delhi-agra",
    state: "Delhi & Uttar Pradesh",
    type: "Heritage",
    title: "Delhi & Agra Heritage Trail",
    price: 19999,
    best: "October to March",
    image: photo("photo-1564507592333-c60657eea523"),
    short: "Timeless monuments, Mughal gardens, and a sunrise to remember.",
    description:
      "Trace India’s monumental history from Delhi’s lively streets to the marble beauty of the Taj Mahal. A four-day guided circuit combines major landmarks with comfortable road transfers.",
    transport:
      "Demo round-trip economy flight allocation Hyderabad–Delhi with airport transfers and Delhi–Agra return road travel.",
    stay: "Two nights in a 3-star Delhi hotel and one night in a 3-star Agra hotel, twin-sharing rooms with breakfast.",
    local:
      "AC sightseeing vehicle for the Delhi and Agra itinerary. Taj Mahal visit is rearranged when the selected itinerary falls on Friday closure.",
    attractions: ["India Gate", "Qutub Minar", "Taj Mahal", "Agra Fort"],
    days: [
      [
        "Capital beginnings",
        "Arrive in Delhi and transfer to the hotel. Visit India Gate and enjoy an evening drive through central Delhi.",
        ["Airport pickup", "India Gate", "Central Delhi drive"],
      ],
      [
        "Delhi to Agra",
        "Visit Qutub Minar in the morning before driving to Agra and checking into your hotel.",
        ["Qutub Minar", "Agra transfer", "Hotel check-in"],
      ],
      [
        "Marble & red sandstone",
        "Visit the Taj Mahal at sunrise when open, then explore Agra Fort before returning to Delhi.",
        ["Taj Mahal", "Agra Fort", "Delhi return drive"],
      ],
      [
        "Farewell, Delhi",
        "Enjoy breakfast and check out before your transfer to Delhi airport for the journey home.",
        ["Breakfast", "Checkout", "Airport transfer"],
      ],
    ],
  },
] as const;
